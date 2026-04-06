from langchain_openai import ChatOpenAI
from ..config.setting import GEMMA_API_KEY, MODEL_NAME, GEMMA_BASE_URL

def load_llm():
    if not GEMMA_API_KEY:
        raise ValueError("Missing 'goggle-gema4' or 'GEMMA_API_KEY' in environment variables")
        
    return ChatOpenAI(
        model=MODEL_NAME,
        api_key=GEMMA_API_KEY,
        base_url=GEMMA_BASE_URL,
        temperature=0.7,
        max_tokens=800,
    )

