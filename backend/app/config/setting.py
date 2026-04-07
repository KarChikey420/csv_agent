from dotenv import load_dotenv
import os

load_dotenv()

OSS_API_KEY = os.getenv("openApi-oss") or os.getenv("goggle-gema4") or os.getenv("GEMMA_API_KEY")
OSS_MODEL_NAME = os.getenv("MODEL_NAME", "meta/llama-3.1-8b-instruct")
OSS_BASE_URL = os.getenv("GEMMA_BASE_URL", "https://integrate.api.nvidia.com/v1")
EMBED_MODEL = "models/text-embedding-004"

# Security & CORS
DEFAULT_ORIGINS = ",".join([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
])
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")
    if origin.strip()
]
DEV_CORS_ORIGIN_REGEX = os.getenv(
    "DEV_CORS_ORIGIN_REGEX",
    r"^https?://("
    r"localhost"
    r"|127\.0\.0\.1"
    r"|0\.0\.0\.0"
    r"|10\.\d{1,3}\.\d{1,3}\.\d{1,3}"
    r"|192\.168\.\d{1,3}\.\d{1,3}"
    r"|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}"
    r")(:\d+)?$",
)

# File Storage
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMP_DATA_DIR = os.path.join(BASE_DIR, "temp_data")
