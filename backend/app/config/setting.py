from dotenv import load_dotenv
import os

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_KEY")
MODEL_NAME = "llama-3.3-70b-versatile"
EMBED_MODEL = "models/text-embedding-004"
