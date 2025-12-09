import pandas as pd
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

VECTORSTORE=None
QACHAIN=None
EMBEDDINGS=HuggingFaceEmbeddings(model_name="all-mpnet-base-v2")

def dataframe_to_text(df:pd.DataFrame):
    line=[]
    
    line.append("Database columns:\n")
    for col in df.columns:
        line.append(f"{col}:{df[col].dtype}")
    
    line.append("\n Column Summuries:\n")
    for col in df.columns:
        try:
            if pd.api.types.is_numeric_dtype(df[col]):
                summury=df[col].describe().to_string()
            else:
                summury(
                    f"Uniqe values: {df[col].unique()}"
                    f"TOP VALUES:{df[col].value_counts().head(5).to_dict()}"
                )
        except Exception as e:
            summury="Error"
            line.append(f"{col}:{summury}\n")
            
    return "\n".join(line)

def build_vectorstore(df:pd.DataFrame):
    global  VECTORSTORE,QACHAIN
    text=dataframe_to_text(text)
    splitter=RecursiveCharacterTextSplitter(chunk_size=500,chunk_overlap=50)
    chunks=splitter.split_text(text)
    VECTORSTORE=FAISS.from_texts(chunks,EMBEDDINGS)
    QACHAIN=RetrievalQA.from_chain_type(
        llm=OpenAI(temperature=0),
        chain_type="stuff",
        retriever=VECTORSTORE.as_retriever()
    )
def ask(question:str):
    if QACHAIN is None:
        raise ValueError("No Vectorstore available yet")
    return QACHAIN.run(question)