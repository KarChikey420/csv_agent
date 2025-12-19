from langchain_experimental.agents import create_pandas_dataframe_agent
from ..llm_loder.llm import load_llm
from ..data.load_data import load_dataframe

def run_react_agent(query:str,file_path:str=None):
    df = load_dataframe(file_path)

    llm=load_llm()
    agent=create_pandas_dataframe_agent(llm=llm,
                                        df=df,
                                        verbose=True,
                                        allow_dangerous_code=True,
                                        handle_parsing_errors=True)
    try:
        result = agent.invoke({"input": query})
        return result.get("output", str(result))
    except Exception as e:
        if "parsing" in str(e).lower():
            return str(e).split("Could not parse LLM output: `")[1].split("`")[0] if "Could not parse LLM output: `" in str(e) else str(e)
        raise e
