from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_experimental.agents import create_pandas_dataframe_agent
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

model_name="gemini-1.5-flash"
Google_Api=os.getenv("Gemini_Api")

def load_agent(model_name:str=model_name):
    llm= ChatGoogleGenerativeAI(
       model=model_name,
       google_api_key=Google_Api
    )
    return llm

def create_agent(df:pd.DataFrame,llm):
    engine=create_pandas_dataframe_agent(
        llm,
        df,
        verbose=True,
        allow_dangerous_code=True
    )
    return engine
    
