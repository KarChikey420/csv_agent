from fastapi import FastAPI, Request, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .dbsetup.database import SessionLocal, User
from .dbsetup.auth import create_access_token, current_user
import bcrypt
import uuid 
from .agent.react_agent import run_react_agent
from .agent.multi_agent import run_multi_agent
from .agent.rag_store import run_memory_chat
import shutil
import os
import uvicorn

app=FastAPI()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

def save_upload_file(file: UploadFile) -> str:
    if not file:
        return None
    upload_dir = os.path.join(os.getcwd(), "temp_data")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return file_path

@app.post("/agent/react")
def react_agent_endpoint(query: str = Form(...), file: UploadFile = File(None), db: Session = Depends(get_db), user: User = Depends(current_user)):
    file_path = save_upload_file(file)
    response = run_react_agent(query, file_path)
    return {"response": response}

@app.post("/agent/multi")
def multi_agent_endpoint(query: str = Form(...), file: UploadFile = File(None), db: Session = Depends(get_db), user: User = Depends(current_user)):
    file_path = save_upload_file(file)
    response = run_multi_agent(query, file_path)
    return {"response": response}

@app.post("/agent/memory")
def memory_agent_endpoint(request: ChatRequest, db: Session = Depends(get_db), user: User = Depends(current_user)):
    response = run_memory_chat(request.query)
    return {"response": response}

@app.post("/chat")
def chat(query: str = Form(...), file: UploadFile = File(None), db: Session = Depends(get_db), user: User = Depends(current_user)):
    file_path = save_upload_file(file)
    response = run_react_agent(query, file_path)
    return {"response": response}


    