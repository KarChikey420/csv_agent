from langchain_google_genai import ChatGoogleGenerativeAI
from ..config.setting import GOOGLE_API_KEY, MODEL_NAME

def load_llm():
    return ChatGoogleGenerativeAI(
        model=MODEL_NAME,
        google_api_key=GOOGLE_API_KEY,
        temperature=0.2
    )
if __name__ == "__main__":
    llm = load_llm()
    print(llm.invoke("Hello, world!"))
