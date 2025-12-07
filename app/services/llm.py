from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_API_KEY=os.getenv("Gemini_Api")

llm=ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api=GOOGLE_API_KEY,
    temperature=0.7,
    max_tokens=1000    
)