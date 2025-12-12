from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool
from app.llm_loder.llm import load_llm
from app.data.load_data import load_dataframe
from app.tools.missing_tool import find_missing
from app.tools.outlier import find_outlier
from app.tools.correlation import get_correlation
from app.tools.eda_tools import df_summary

def run_multi_agent(query):
    df = load_dataframe()
    llm_instance = load_llm()

    tools = [
        Tool(
            name="missing_values",
            func=lambda q: find_missing(),
            description="Detect missing values"
        ),
        Tool(
            name="outliers",
            func=lambda q: find_outlier(df),
            description="Outlier detection"
        ),
        Tool(
            name="correlation_matrix",
            func=lambda q: get_correlation(),
            description="Correlation matrix"
        ),
        Tool(
            name="dataset_summary",
            func=lambda q: df_summary(),
            description="Summary statistics"
        ),
    ]

    agent = initialize_agent(
        tools=tools,
        llm=llm_instance,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True
    )

    return agent.run(query)

if __name__ == "__main__":
    query = "What is the correlation between the columns?"
    print(run_multi_agent(query))
