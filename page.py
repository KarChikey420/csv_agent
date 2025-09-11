import streamlit as st
from csv_agent import create_agent,load_agent
import pandas as pd

st.set_page_config(page_title="CSV Agent", page_icon=":guardsman:", layout="wide")

st.title("COME TO EDA WITH CSV AGENT")

uploaded_file=st.file_uploader("Upload your CSV here", type=["csv"])

if uploaded_file is not None:
    df=pd.read_csv(uploaded_file)
    st.subheader("DataFrame preview")
    st.dataframe(df.head())
    
    llm=load_agent()
    
    agent=create_agent(df,llm)
    
    st.subheader("Ask questions about your data")
    question=st.text_input("Enter your question here")
    
    if question:
        with st.spinner("Generating answer..."):
            try:
                response=agent.invoke({"input":question})
                st.success("Answer Generated")
                st.text_area("Answer", value=str(response["output"]),height=500)
                
            except Exception as e:
                st.error(f"Error: {e}")
    