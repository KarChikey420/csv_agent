from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_API_KEY = os.getenv("Gemini_Api")
MODEL_NAME = "gemini-2.5-flash"
EMBED_MODEL = "models/text-embedding-004"
