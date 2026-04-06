from fastapi import FastAPI, Request, HTTPException, Depends, UploadFile, File, Form
import requests
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .dbsetup.database import SessionLocal, User
from .dbsetup.auth import create_access_token, current_user
import bcrypt
import pandas as pd
import uuid 
from .agent.react_agent import run_react_agent
from .agent.multi_agent import run_multi_agent
from .agent.rag_store import run_memory_chat
from .data.load_data import load_dataframe
import shutil
import os
import uvicorn
import logging
import time
from fastapi import BackgroundTasks
from fastapi.concurrency import run_in_threadpool
from .config.setting import ALLOWED_ORIGINS, TEMP_DATA_DIR

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("prepx_backend")

app=FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    query: str

@app.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        raise HTTPException(400, "User already exists")

    hashed = hash_password(request.password)
    new_user = User(name=request.name, email=request.email, password=hashed)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}


@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(404, "User not found")

    if not verify_password(request.password, user.password):
        raise HTTPException(401, "Wrong password")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

async def save_upload_file(file: UploadFile) -> str:
    if not file or not file.filename:
        return None
    
    os.makedirs(TEMP_DATA_DIR, exist_ok=True)
    file_path = os.path.join(TEMP_DATA_DIR, file.filename)
    
    def write_file():
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
    await run_in_threadpool(write_file)
    return file_path

async def cleanup_temp_files():
    """Background task to delete old temp files."""
    try:
        now = time.time()
        for f in os.listdir(TEMP_DATA_DIR):
            f_path = os.path.join(TEMP_DATA_DIR, f)
            # Delete if older than 1 hour
            if os.path.getmtime(f_path) < now - 3600:
                if os.path.isfile(f_path):
                    os.remove(f_path)
                elif os.path.isdir(f_path) and f == "plots":
                    # Keep plots dir but maybe clean contents? 
                    # For now just files.
                    pass
        logger.info("Temporary files cleaned up.")
    except Exception as e:
        logger.error(f"Error during cleanup: {str(e)}")

@app.post("/agent/react")
async def react_agent_endpoint(
    background_tasks: BackgroundTasks,
    query: str = Form(...), 
    file: UploadFile = File(None), 
    db: Session = Depends(get_db), 
    user: User = Depends(current_user)
):
    try:
        file_path = await save_upload_file(file)
        response = await run_in_threadpool(run_react_agent, query, file_path)
        background_tasks.add_task(cleanup_temp_files)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error in react_agent_endpoint: {str(e)}")
        if "quota" in str(e).lower() or "429" in str(e):
            raise HTTPException(429, "API quota exceeded. Please wait a moment and try again.")
        raise HTTPException(500, "Agent processing failed. Please check logs.")

@app.post("/agent/multi")
async def multi_agent_endpoint(
    background_tasks: BackgroundTasks,
    query: str = Form(...), 
    file: UploadFile = File(None), 
    db: Session = Depends(get_db), 
    user: User = Depends(current_user)
):
    try:
        file_path = await save_upload_file(file)
        response = await run_in_threadpool(run_multi_agent, query, file_path)
        background_tasks.add_task(cleanup_temp_files)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error in multi_agent_endpoint: {str(e)}")
        if "quota" in str(e).lower() or "429" in str(e):
            raise HTTPException(429, "API quota exceeded. Please wait a moment and try again.")
        raise HTTPException(500, "Agent processing failed. Please check logs.")

@app.post("/agent/memory")
def memory_agent_endpoint(request: ChatRequest, db: Session = Depends(get_db), user: User = Depends(current_user)):
    try:
        response = run_memory_chat(request.query)
        return {"response": response}
    except Exception as e:
        if "quota" in str(e).lower() or "429" in str(e):
            raise HTTPException(429, "API quota exceeded. Please wait a moment and try again.")
        raise HTTPException(500, f"Agent processing failed: {str(e)}")

@app.post("/chat")
async def chat(
    background_tasks: BackgroundTasks,
    query: str = Form(...), 
    file: UploadFile = File(None), 
    db: Session = Depends(get_db), 
    user: User = Depends(current_user)
):
    try:
        file_path = await save_upload_file(file)
        response = await run_in_threadpool(run_react_agent, query, file_path)
        background_tasks.add_task(cleanup_temp_files)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        if "quota" in str(e).lower() or "429" in str(e):
            raise HTTPException(429, "API quota exceeded. Please wait a moment and try again.")
        raise HTTPException(500, "Agent processing failed. Please check logs.")


@app.get("/api/plots/{filename}")
async def serve_plot(filename: str):
    plots_dir = os.path.join(TEMP_DATA_DIR, "plots")
    file_path = os.path.join(plots_dir, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/png")
    raise HTTPException(404, f"Plot not found: {filename}")

@app.post("/data/preview")
async def preview_data(file: UploadFile = File(...)):
    try:
        file_path = await save_upload_file(file)
        if not file_path:
             raise HTTPException(400, "File upload failed")
        
        df = await run_in_threadpool(load_dataframe, file_path)
        df = df.where(pd.notnull(df), None)
        
        preview = {
            "filename": file.filename,
            "columns": list(df.columns),
            "head": df.head().to_dict(orient="records"),
            "shape": df.shape
        }
        return preview
    except Exception as e:
        logger.error(f"Error in preview endpoint: {str(e)}")
        raise HTTPException(500, "Preview failed. Please check logs.")



@app.post("/gemma/chat")
async def gemma_chat(request: Request, db: Session = Depends(get_db), user: User = Depends(current_user)):
    """Proxy request to Google Gemma-4 model using the project's LLM loader.
    Expects JSON body with 'messages' and optional 'max_tokens'.
    """
    try:
        from .llm_loder.llm import load_llm
        payload = await request.json()
        if "messages" not in payload:
            raise HTTPException(400, "'messages' field is required")
        
        llm = load_llm()
        # For ChatOpenAI, we can pass messages directly
        if hasattr(llm, "ainvoke"):
            response = await llm.ainvoke(payload["messages"])
        else:
            response = await run_in_threadpool(llm.invoke, payload["messages"])
        
        # Return in a format similar to OpenAI's response if possible, 
        # or just return the content.
        return {"choices": [{"message": {"content": response.content, "role": "assistant"}}]}
    except Exception as e:
        raise HTTPException(500, f"Gemma endpoint failed: {str(e)}")