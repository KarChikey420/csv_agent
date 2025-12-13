from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from llm_loder import llm

memory = ConversationBufferMemory()

chat_chain = LLMChain(
    llm=llm(),
    memory=memory
)

def run_memory_chat(query):
    return chat_chain.run(query)
