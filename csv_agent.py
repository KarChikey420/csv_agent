from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_experimental.agents import create_pandas_dataframe_agent
import pandas as pd
from dotenv import load_dotenv
import os

# Load API key
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
    
# llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-flash",
#     google_api_key=os.getenv("Gemini_Api")
# )

# # Load CSV
# df = pd.read_csv("sample_employees.csv")

# # Create Pandas Agent (allow code execution)
# create_engin = create_pandas_dataframe_agent(
#     llm,
#     df,
#     verbose=True,
#     allow_dangerous_code=True
# )

# # List of EDA questions
# questions = [
#     "Give me a summary of this dataset",
#     "Check for missing values and data quality issues",
#     "What are the most correlated columns?",
#     "Which features look important for ML?",
# ]

# # Run each question
# for question in questions:
#     print(f"\n {question}")
#     print(create_engin.run(question))
