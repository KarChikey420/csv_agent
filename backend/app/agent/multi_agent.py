from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool
from langchain import hub
import os
from ..llm_loder.llm import load_llm
from ..data.load_data import load_dataframe
from ..tools.missing_tool import find_missing
from ..tools.outlier import find_outlier
from ..tools.correlation import get_correlation
from ..tools.eda_tools import df_summary
from ..tools.plot_tool import generate_plot
from ..tools.report_tool import generate_report

def run_multi_agent(query:str, file_path:str=None):
    if file_path is None:
        return "Please upload a CSV file to perform data analysis."
    df = load_dataframe(file_path)
    llm_instance = load_llm()

    # Capture plots
    plots = []

    def plot_wrapper_captured(q):
        try:
            parts = q.split(',')
            column = parts[0].strip()
            plot_type = parts[1].strip() if len(parts) > 1 else "hist"
            result_plot = generate_plot(df, column, plot_type)
            if "![Plot]" in str(result_plot):
                plots.append(result_plot)
                return "Plot generated successfully."
            return result_plot
        except Exception as e:
            return f"Error generating plot: {str(e)}"

    data_snapshot = f"""
### Data Snapshot
**Columns**: {list(df.columns)}

**Sample Data**:
```text
{df.head().to_string()}
```
"""

    tools = [
        Tool(
            name="missing_values",
            func=lambda q: find_missing(file_path),
            description="Detect missing values"
        ),
        Tool(
            name="outliers",
            func=lambda q: find_outlier(df),
            description="Outlier detection"
        ),
        Tool(
            name="correlation_matrix",
            func=lambda q: get_correlation(file_path),
            description="Correlation matrix"
        ),
        Tool(
            name="dataset_summary",
            func=lambda q: df_summary(file_path),
            description="Summary statistics"
        ),
        Tool(
            name="generate_plot",
            func=plot_wrapper_captured,
            description="Generate a plot. Input: 'column_name, plot_type'. plot_type: hist, box, line."
        ),
        Tool(
            name="generate_report",
            func=lambda q: generate_report(df),
            description="Generate a full EDA report of the dataset."
        ),

    ]

    prompt = hub.pull("hwchase17/react")
    
    agent = create_react_agent(llm_instance, tools, prompt)
    
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True
    )

    try:
        result = agent_executor.invoke({"input": query})
        output = result.get("output", str(result))
        
        final_response = f"{data_snapshot}\n\n{output}"
        if plots:
            final_response += "\n\n### Generated Plots\n" + "\n".join(plots)
            
        return final_response
    except Exception as e:
        if "parsing" in str(e).lower():
            return str(e).split("Could not parse LLM output: `")[1].split("`")[0] if "Could not parse LLM output: `" in str(e) else str(e)
        raise e


