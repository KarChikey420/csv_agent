from langchain_openai import ChatOpenAI
from ..config.setting import GROQ_API_KEY, MODEL_NAME

def load_llm():
    if not GROQ_API_KEY:
        raise ValueError("Missing GROQ_KEY in environment variables")
        
    return ChatOpenAI(
        model=MODEL_NAME,
        api_key=GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
        temperature=0.7,
        max_tokens=800,
    )

