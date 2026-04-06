from fastapi import FastAPI, Request, HTTPException, Depends, UploadFile, File, Form, BackgroundTasks
from typing import Optional
from contextlib import asynccontextmanager
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from sqlalchemy.orm import Session
import bcrypt
import pandas as pd
import uuid 
import shutil
import os
import uvicorn
import logging
import time
import numpy as np

from .dbsetup.database import SessionLocal, User, Dataset, AnalysisHistory, get_db, init_db
from .dbsetup.auth import create_access_token, current_user
from .agent.react_agent import run_react_agent
from .agent.multi_agent import run_multi_agent
from .agent.dataflow_agent import run_dataflow_agent
from .agent.rag_store import run_memory_chat
from .data.load_data import load_dataframe
from .tools.eda_tools import get_summary_stats
from .config.setting import ALLOWED_ORIGINS, DEV_CORS_ORIGIN_REGEX, TEMP_DATA_DIR

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("dataflow_backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup without blocking the main thread
    await run_in_threadpool(init_db)
    yield

app = FastAPI(title="DataFlow EDA Intelligence API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=DEV_CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "DataFlow API is live"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}

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
    await file.seek(0)
    
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
            if os.path.getmtime(f_path) < now - 3600:
                if os.path.isfile(f_path):
                    os.remove(f_path)
        logger.info("Temporary files cleaned up.")
    except Exception as e:
        logger.error(f"Error during cleanup: {str(e)}")

@app.post("/dataset/upload")
async def upload_dataset(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    user: User = Depends(current_user)
):
    try:
        file_path = await save_upload_file(file)
        df = await run_in_threadpool(load_dataframe, file_path)
        stats = get_summary_stats(df)
        
        dataset = Dataset(
            filename=file.filename,
            file_path=file_path,
            schema_info=stats,
            user_id=user.id
        )
        db.add(dataset)
        db.commit()
        db.refresh(dataset)
        
        return {
            "message": "Dataset uploaded successfully",
            "dataset_id": dataset.id,
            "preview": {
                "columns": list(df.columns),
                "head": df.head().replace({np.nan: None}).to_dict(orient="records"),
                "shape": df.shape,
                "stats": stats
            }
        }
    except Exception as e:
        logger.error(f"Error in dataset upload: {str(e)}")
        raise HTTPException(500, f"Upload failed: {str(e)}")

@app.post("/data/preview")
async def preview_data(file: UploadFile = File(...)):
    try:
        file_path = await save_upload_file(file)
        if not file_path:
             raise HTTPException(400, "File upload failed")
        
        df = await run_in_threadpool(load_dataframe, file_path)
        stats = get_summary_stats(df)
        
        preview = {
            "filename": file.filename,
            "columns": list(df.columns),
            "head": df.head().replace({np.nan: None}).to_dict(orient="records"),
            "shape": df.shape,
            "stats": stats
        }
        return preview
    except Exception as e:
        logger.error(f"Error in preview endpoint: {str(e)}")
        raise HTTPException(500, "Preview failed. Please check logs.")

@app.post("/chat")
async def chat(
    background_tasks: BackgroundTasks,
    query: str = Form(...), 
    file: Optional[UploadFile] = File(None), 
    dataset_id: Optional[int] = Form(None),
    db: Session = Depends(get_db), 
    user: User = Depends(current_user)
):
    try:
        file_path = None
        
        if dataset_id:
            dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == user.id).first()
            if not dataset:
                 raise HTTPException(404, "Dataset not found or access denied")
            file_path = dataset.file_path
            logger.info(f"Using existing dataset from DB: {file_path}")
        elif file:
            file_path = await save_upload_file(file)
            logger.info(f"Using newly uploaded file: {file_path}")
        
        if not file_path:
             raise HTTPException(400, "No file or dataset_id provided")

        response = await run_in_threadpool(run_dataflow_agent, query, file_path)
        
        # Save history
        actual_dataset_id = dataset_id
        if not actual_dataset_id and file:
             dataset = db.query(Dataset).filter(Dataset.filename == file.filename, Dataset.user_id == user.id).first()
             if dataset:
                 actual_dataset_id = dataset.id
        
        if actual_dataset_id:
             history = AnalysisHistory(dataset_id=actual_dataset_id, query=query, response=response)
             db.add(history)
             db.commit()

        background_tasks.add_task(cleanup_temp_files)
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        if "quota" in str(e).lower() or "429" in str(e):
            raise HTTPException(429, "API quota exceeded. Please wait a moment and try again.")
        raise HTTPException(500, f"Agent processing failed: {str(e)}")

@app.post("/agent/react")
async def react_agent_endpoint(
    background_tasks: BackgroundTasks,
    query: str = Form(...), 
    file: Optional[UploadFile] = File(None), 
    dataset_id: Optional[int] = Form(None),
    db: Session = Depends(get_db), 
    user: User = Depends(current_user)
):
    return await chat(background_tasks, query, file, dataset_id, db, user)

@app.post("/agent/multi")
async def multi_agent_endpoint(
    background_tasks: BackgroundTasks,
    query: str = Form(...), 
    file: Optional[UploadFile] = File(None), 
    dataset_id: Optional[int] = Form(None),
    db: Session = Depends(get_db), 
    user: User = Depends(current_user)
):
    try:
        file_path = None
        if dataset_id:
            dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == user.id).first()
            if not dataset:
                 raise HTTPException(404, "Dataset not found")
            file_path = dataset.file_path
        elif file:
            file_path = await save_upload_file(file)
        
        if not file_path:
             raise HTTPException(400, "No file or dataset_id provided")

        response = await run_in_threadpool(run_multi_agent, query, file_path)
        background_tasks.add_task(cleanup_temp_files)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error in multi_agent_endpoint: {str(e)}")
        raise HTTPException(500, f"Multi-agent failed: {str(e)}")

@app.post("/agent/memory")
def memory_agent_endpoint(request: ChatRequest, db: Session = Depends(get_db), user: User = Depends(current_user)):
    try:
        response = run_memory_chat(request.query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(500, f"Memory agent failed: {str(e)}")

@app.get("/api/plots/{filename}")
async def serve_plot(filename: str):
    plots_dir = os.path.join(TEMP_DATA_DIR, "plots")
    file_path = os.path.join(plots_dir, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/png")
    raise HTTPException(404, f"Plot not found: {filename}")

@app.post("/gemma/chat")
async def gemma_chat(request: Request, db: Session = Depends(get_db), user: User = Depends(current_user)):
    try:
        from .llm_loder.llm import load_llm
        payload = await request.json()
        if "messages" not in payload:
            raise HTTPException(400, "'messages' field is required")
        
        llm = load_llm()
        if hasattr(llm, "ainvoke"):
            response = await llm.ainvoke(payload["messages"])
        else:
            response = await run_in_threadpool(llm.invoke, payload["messages"])
        
        return {"choices": [{"message": {"content": response.content, "role": "assistant"}}]}
    except Exception as e:
        raise HTTPException(500, f"Gemma endpoint failed: {str(e)}")

@app.get("/api/me")
def get_user_profile(user: User = Depends(current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }
