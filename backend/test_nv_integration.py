import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

def test_nv_connection():
    api_key = os.getenv("openApi-oss")
    base_url = "https://integrate.api.nvidia.com/v1"
    model_name = "meta/llama-3.1-8b-instruct"

    print(f"Testing connectivity to {base_url} with model {model_name}...")
    
    try:
        llm = ChatOpenAI(
            model=model_name,
            api_key=api_key,
            base_url=base_url,
            temperature=0.5,
            max_tokens=100
        )
        
        response = llm.invoke("Hello, are you working correctly?")
        print("\n--- Response ---")
        print(response.content)
        print("----------------")
        print("\nSUCCESS: Connection established and model responded.")
        
    except Exception as e:
        print(f"\nFAILURE: {str(e)}")

if __name__ == "__main__":
    test_nv_connection()
