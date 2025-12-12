from langchain_experimental.agents import create_pandas_dataframe_agent
from ..llm_loder.llm import load_llm
from ..data.load_data import load_dataframe

def run_react_agent(query:str):
    df = load_dataframe()

    llm=load_llm()
    agent=create_pandas_dataframe_agent(llm=llm,
                                        df=df,
                                        verbose=True,
                                        allow_dangerous_code=True)
    return agent.run(query)
