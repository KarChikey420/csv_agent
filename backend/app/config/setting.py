from dotenv import load_dotenv
import os

load_dotenv()

GEMMA_API_KEY = os.getenv("goggle-gema4") or os.getenv("GEMMA_API_KEY")
MODEL_NAME = "google/gemma-4-31b-it"
GEMMA_BASE_URL = os.getenv("GEMMA_BASE_URL", "http://0.0.0.0:8000/v1")
EMBED_MODEL = "models/text-embedding-004"
