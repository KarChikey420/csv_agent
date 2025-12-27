from langchain_experimental.agents import create_pandas_dataframe_agent
from ..llm_loder.llm import load_llm
from ..data.load_data import load_dataframe

def run_react_agent(query:str,file_path:str=None):
    if file_path is None:
        return "Please upload a CSV file to perform data analysis."
    df = load_dataframe(file_path)

    llm=load_llm()
    agent=create_pandas_dataframe_agent(llm=llm,
                                        df=df,
                                        verbose=True,
                                        allow_dangerous_code=True,
                                        agent_executor_kwargs={"handle_parsing_errors": True})
    try:
        result = agent.invoke({"input": query})
        return result.get("output", str(result))
    except Exception as e:
        error_msg = str(e)
        if "parsing" in error_msg.lower():
            if "Could not parse LLM output: `" in error_msg:
                return error_msg.split("Could not parse LLM output: `")[1].split("`")[0]
            elif "Could not parse LLM output: " in error_msg:
                return error_msg.split("Could not parse LLM output: ")[1]
        raise e
