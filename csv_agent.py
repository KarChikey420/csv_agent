from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_experimental.agents import create_pandas_dataframe_agent
import pandas as pd
from dotenv import load_dotenv
import os

# Load API key
load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("Gemini_Api")
)

# Load CSV
df = pd.read_csv("sample_employees.csv")

# Create Pandas Agent (allow code execution)
create_engin = create_pandas_dataframe_agent(
    llm,
    df,
    verbose=True,
    allow_dangerous_code=True
)

# List of EDA questions
questions = [
    "Give me a summary of this dataset",
    "Check for missing values and data quality issues",
    "What are the most correlated columns?",
    "Which features look important for ML?",
]

# Run each question
for question in questions:
    print(f"\n❓ {question}")
    print(create_engin.run(question))
