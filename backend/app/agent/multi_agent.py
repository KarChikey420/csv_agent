from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.tools import tool
import os
import pandas as pd
import logging

from ..llm_loder.llm import load_llm
from ..data.load_data import load_dataframe
from ..tools.eda_tools import get_summary_stats, detect_outliers, get_correlation_matrix, generate_eda_plot

logger = logging.getLogger("dataflow.multi_agent")

class AgentState(TypedDict):
    """The state of the graph."""
    messages: Annotated[Sequence[BaseMessage], lambda a, b: a + b]
    file_path: str

def run_multi_agent(query: str, file_path: str = None):
    """Run a multi-agent Expert Cluster using LangGraph."""
    if file_path is None:
        return "Please upload a CSV file to perform data analysis."
    
    try:
        # Load data for state information
        df = load_dataframe(file_path)
        llm = load_llm()
        
        # Define Tools using the new eda_tools
        @tool
        def tool_summary_stats(q: str):
            """Get comprehensive summary statistics for the dataset."""
            return get_summary_stats(df)

        @tool
        def tool_detect_outliers(columns: list = None):
            """Detect outliers in the dataset using IQR and Z-Score."""
            return detect_outliers(df, columns)

        @tool
        def tool_correlation_matrix(q: str):
             """Calculate the correlation matrix for numeric columns."""
             return get_correlation_matrix(df)

        @tool
        def tool_generate_plot(plot_type: str, x: str, y: str = None, hue: str = None, title: str = None):
             """
             Generate a plot (histogram, box, scatter, bar, heatmap) and return as Base64.
             ALWAYS embed the result in your response as ![plot](base64_string).
             """
             return generate_eda_plot(df, plot_type, x, y, hue, title)

        tools = [
            tool_summary_stats,
            tool_detect_outliers,
            tool_correlation_matrix,
            tool_generate_plot
        ]
        
        # Link tools to the LLM
        model = llm.bind_tools(tools)

        # Define Nodes
        def call_model(state: AgentState):
            messages = state['messages']
            response = model.invoke(messages)
            return {"messages": [response]}

        def should_continue(state: AgentState):
            messages = state['messages']
            last_message = messages[-1]
            if last_message.tool_calls:
                return "tools"
            return END

        # Define Graph
        workflow = StateGraph(AgentState)
        workflow.add_node("agent", call_model)
        workflow.add_node("tools", ToolNode(tools))

        workflow.set_entry_point("agent")
        workflow.add_conditional_edges("agent", should_continue)
        workflow.add_edge("tools", "agent")

        # Compile Graph
        app = workflow.compile()

        # Run Graph
        # Initial message
        initial_message = HumanMessage(content=query)
        result = app.invoke({"messages": [initial_message], "file_path": file_path, "plots": []})

        # Process Results
        final_response = result['messages'][-1].content
        
        # Capture plots from tool outputs if any (ToolNode outputs are also in messages)
        plots = []
        for msg in result['messages']:
            # We check for the ![Plot] pattern in tool outputs
            if hasattr(msg, 'content') and "![Plot]" in str(msg.content):
                 plots.append(msg.content)
        
        if plots:
            final_response += "\n\n### Generated Plots\n" + "\n".join(plots)
            
        return final_response
        
    except Exception as e:
        logger.error(f"Error in run_multi_agent: {str(e)}")
        if "parsing" in str(e).lower():
             return "I encountered an error parsing the data results. Please try a more specific question."
        raise e
