from langchain_openai import ChatOpenAI
from ..config.setting import OSS_API_KEY, OSS_MODEL_NAME, OSS_BASE_URL

def load_llm():
    api_key_to_use = OSS_API_KEY or "EMPTY"
        
    return ChatOpenAI(
        model=OSS_MODEL_NAME,
        api_key=api_key_to_use,
        base_url=OSS_BASE_URL,
        temperature=0.7,
        max_tokens=2048,
        timeout=120.0,    # Prevent long hangs
        max_retries=2,    # Stop infinite retry loops
    )

