from dotenv import load_dotenv
import os

load_dotenv()

GEMMA_API_KEY = os.getenv("goggle-gema4") or os.getenv("GEMMA_API_KEY")
MODEL_NAME = "google/gemma-4-31b-it"
GEMMA_BASE_URL = os.getenv("GEMMA_BASE_URL", "https://integrate.api.nvidia.com/v1")
EMBED_MODEL = "models/text-embedding-004"

# Security & CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173").split(",")

# File Storage
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMP_DATA_DIR = os.path.join(BASE_DIR, "temp_data")
