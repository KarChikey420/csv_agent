from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, create_react_agent
from langchain_experimental.tools import PythonAstREPLTool
from langchain_core.tools import tool, StructuredTool
from ..llm_loder.llm import load_llm
from ..data.load_data import load_dataframe
from ..tools.eda_tools import (
    get_summary_stats, detect_outliers, get_correlation_matrix, generate_eda_plot,
    get_advanced_correlations, get_time_series_projection, get_predictive_insights
)
import logging
import pandas as pd
import os

logger = logging.getLogger("dataflow.agent")

class AgentState(TypedDict):
    """The state of the graph."""
    messages: Annotated[Sequence[BaseMessage], lambda a, b: a + b]

@tool
def get_stats(dataset_path: str):
    """Get basic statistics and summary for the uploaded dataset."""
    df = load_dataframe(dataset_path)
    return get_summary_stats(df)

@tool
def find_outliers(dataset_path: str, columns: list = None):
    """Detect outliers in the specified columns (or all numeric columns if None)."""
    df = load_dataframe(dataset_path)
    return detect_outliers(df, columns)

@tool
def get_correlations(dataset_path: str):
    """Compute the correlation matrix for the dataset."""
    df = load_dataframe(dataset_path)
    return get_correlation_matrix(df)

@tool
def create_plot(dataset_path: str, plot_type: str, x: str, y: str = None, hue: str = None, title: str = None):
    """
    Generate a visualization for the dataset and return it as a Base64 string.
    Supported plot_type: 'histogram', 'box', 'scatter', 'bar', 'heatmap'.
    Returns a string starting with 'data:image/png;base64,...'
    """
    df = load_dataframe(dataset_path)
    return generate_eda_plot(df, plot_type, x, y, hue, title)

def run_dataflow_agent(query: str, file_path: str = None):
    """Run the DataFlow EDA agent."""
    if not file_path or not os.path.exists(file_path):
        return "Please upload a CSV file to begin analysis."
    
    try:
        llm = load_llm()
        
        # Load the dataframe once for Python REPL tool
        df = load_dataframe(file_path)
        
        # Define tools
        # We wrap the file_path in a closure or pass it as a fixed argument
        # For simplicity, we ensure tools know about the file_path
        
        def _get_stats(): return get_stats.invoke({"dataset_path": file_path})
        def _find_outliers(cols=None): return find_outliers.invoke({"dataset_path": file_path, "columns": cols})
        def _create_plot(pt, x, y=None, h=None, t=None): return create_plot.invoke({"dataset_path": file_path, "plot_type": pt, "x": x, "y": y, "hue": h, "title": t})
        
        # Creating a list of tools for the agent
        # We use a custom wrapper or provide the tools with the file_path pre-filled where possible
        # Or better, just give the agent the Python REPL and the specialized tools
        
        tools = [
            PythonAstREPLTool(locals={"df": df}),
            StructuredTool.from_function(
                func=lambda: get_summary_stats(df), 
                name="get_summary_stats", 
                description="Get summary statistics for the current dataframe 'df'."
            ),
            StructuredTool.from_function(
                func=lambda columns=None: detect_outliers(df, columns), 
                name="detect_outliers", 
                description="Detect outliers in 'df' for given columns."
            ),
            StructuredTool.from_function(
                func=lambda plot_type, x, y=None, hue=None, title=None: generate_eda_plot(df, plot_type, x, y, hue, title), 
                name="generate_plot", 
                description="Generate a plot (histogram, box, scatter, bar, heatmap) from 'df'. Returns Base64 string."
            ),
            StructuredTool.from_function(
                func=lambda: get_advanced_correlations(df),
                name="get_advanced_correlations",
                description="Compute multi-factor clustered correlations. Returns a Base64 heatmap image."
            ),
            StructuredTool.from_function(
                func=lambda target_col, periods=10: get_time_series_projection(df, target_col, periods),
                name="get_time_series_projection",
                description="Perform trend forecasting on a column. Projects future values based on historical trends."
            ),
            StructuredTool.from_function(
                func=lambda target, feature: get_predictive_insights(df, target, feature),
                name="get_predictive_insights",
                description="Analyze the predictive relationship between two variables. Returns R-squared and impact description."
            )
        ]
        
        system_msg = (
            "You are DataFlow, a High-Performance AI Exploratory Data Analysis (EDA) assistant. "
            "Your goal is to help users uncover deep insights, project trends, and generate advanced visualizations. "
            "You have access to a pandas DataFrame named 'df'. "
            "You have Advanced Intelligence tools for complex correlations, time-series projections, and predictive modeling. "
            "When asked for a visualization or projection, use the appropriate tools. "
            "You DO NOT need to copy-paste the long Base64 string into your response. "
            "Simply state 'The plot above shows...' or similar. The system will automatically attach the image. "
            "Always explain the 'Statistical Significance' of your findings. "
            "End complex analyses with a 'Key Findings' summary block."
        )
        
        # Define the manual Agent Node
        model = llm.bind_tools(tools)
        
        def call_model(state: AgentState):
            messages = state['messages']
            # Ensure system message is injected for every model call
            full_messages = [SystemMessage(content=system_msg)] + list(messages)
            response = model.invoke(full_messages)
            return {"messages": [response]}

        def should_continue(state: AgentState):
            last_message = state['messages'][-1]
            if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
                return "tools"
            return END

        # Build the graph
        workflow = StateGraph(AgentState)
        workflow.add_node("agent", call_model)
        workflow.add_node("tools", ToolNode(tools))
        
        workflow.set_entry_point("agent")
        workflow.add_conditional_edges("agent", should_continue)
        workflow.add_edge("tools", "agent")
        
        agent = workflow.compile()
        
        # Execute the agent
        result = agent.invoke({"messages": [HumanMessage(content=query)]})
        
        if "messages" in result:
            # AUTO-EXTRACTION: Identify all Base64 plots from ToolMessages
            # This ensures diagrams render even if the LLM doesn't include them in the text
            final_answer = result["messages"][-1].content
            plots = []
            
            for msg in result["messages"]:
                # Check for Base64 image pattern in any message content
                if hasattr(msg, 'content') and isinstance(msg.content, str) and msg.content.startswith("data:image/png;base64,"):
                    plots.append(msg.content)
            
            if plots:
                # Format into markdown and prepend/append to the main response
                # We prepend so it appears at the top (before the 'Key Findings')
                plot_md = "\n".join([f"![plot]({p})" for p in plots])
                return f"### Analysis Visualization\n{plot_md}\n\n---\n\n{final_answer}"
            
            return final_answer
        
        return str(result)
        
    except Exception as e:
        logger.error(f"Error in DataFlow agent: {str(e)}")
        raise e
