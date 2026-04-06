import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Explicitly load .env from the root directory
load_dotenv(dotenv_path="../.env")
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL[:40]}..." if DATABASE_URL else "DATABASE_URL is NONE")

try:
    print("Creating engine...")
    engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})
    print("Connecting...")
    with engine.connect() as conn:
        print("Successfully connected to the database!")
except Exception as e:
    print(f"Database connection failed: {e}")
