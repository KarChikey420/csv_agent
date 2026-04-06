from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, DateTime, JSON, text
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
import os
import datetime
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True, 
    connect_args={"sslmode": "require", "connect_timeout": 10}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users2"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    datasets = relationship("Dataset", back_populates="owner")

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    schema_info = Column(JSON, nullable=True) # Column names, types, summary
    user_id = Column(Integer, ForeignKey("users2.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner = relationship("User", back_populates="datasets")
    history = relationship("AnalysisHistory", back_populates="dataset")

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"
    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"))
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    dataset = relationship("Dataset", back_populates="history")

def init_db():
    print("Initializing database tables...")
    try:
        # Set a statement timeout during table creation for safety
        with engine.connect() as conn:
            conn.execute(text("SET statement_timeout = '30s'"))
            Base.metadata.create_all(bind=engine)
        print("Database tables initialized successfully.")
    except Exception as e:
        import logging
        logging.error(f"Database initialization failed or timed out: {str(e)}")
        print(f"Critical: Database initialization failed: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()