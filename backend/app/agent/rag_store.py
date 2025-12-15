from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from ..llm_loder.llm import load_llm

memory = ConversationBufferMemory()

chat_chain = LLMChain(
    llm=load_llm(),
    memory=memory
)

def run_memory_chat(query):
    return chat_chain.run(query)
