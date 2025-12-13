from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from app.llm.llm_loader import load_llm

memory = ConversationBufferMemory()

# 👉 THIS IS THE MEMORY + LLM CHAIN
chat_chain = LLMChain(
    llm=load_llm(),
    memory=memory
)

def run_memory_chat(query):
    return chat_chain.run(query)
