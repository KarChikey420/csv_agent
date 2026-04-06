from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from ..llm_loder.llm import load_llm
import logging

logger = logging.getLogger("prepx_backend.rag_store")

class AgentState(TypedDict):
    """The state of the conversation."""
    messages: Annotated[Sequence[BaseMessage], lambda a, b: a + b]

def run_memory_chat(query: str, thread_id: str = "default"):
    """Run a conversational chat with memory using LangGraph."""
    try:
        # Initialize LLM
        llm = load_llm()
        
        # Define the graph
        def call_model(state: AgentState):
            messages = state['messages']
            response = llm.invoke(messages)
            return {"messages": [response]}

        # Define Grap
        workflow = StateGraph(AgentState)
        workflow.add_node("agent", call_model)
        workflow.set_entry_point("agent")
        workflow.add_edge("agent", END)

        # Persistence
        checkpointer = MemorySaver()
        app = workflow.compile(checkpointer=checkpointer)

        # Run with thread_id for memory persistence
        # In a real app, thread_id would be session_id
        config = {"configurable": {"thread_id": thread_id}}
        
        initial_message = HumanMessage(content=query)
        result = app.invoke({"messages": [initial_message]}, config=config)
        
        # Return last message content
        return result['messages'][-1].content
        
    except Exception as e:
        logger.error(f"Error in run_memory_chat: {str(e)}")
        raise e
