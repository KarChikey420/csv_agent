import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app.llm_loder.llm import load_llm
from langchain_core.messages import HumanMessage

def test():
    try:
        print("Initialiazing LLM connection test...")
        llm = load_llm()
        print(f"Model: {os.getenv('MODEL_NAME', 'openai/gpt-oss-20b')}")
        print(f"Base URL: {os.getenv('GEMMA_BASE_URL', 'http://0.0.0.0:8000/v1')}")
        
        message = [HumanMessage(content="Which number is larger, 9.11 or 9.8?")]
        print("Sending request...")
        response = llm.invoke(message)
        print("\n--- Response ---")
        print(response.content)
        print("----------------\n")
    except Exception as e:
        print(f"Test failed: {str(e)}")

if __name__ == "__main__":
    test()
