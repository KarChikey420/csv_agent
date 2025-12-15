from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from ..llm_loder.llm import load_llm

memory = ConversationBufferMemory(memory_key="chat_history")


template = """You are a helpful AI assistant.

Current conversation:
{chat_history}
Human: {input}
AI:"""

prompt = PromptTemplate(
    input_variables=["chat_history", "input"],
    template=template
)


chat_chain = LLMChain(
    llm=load_llm(),
    prompt=prompt, 
    memory=memory,
    verbose=True
)

def run_memory_chat(query):
    return chat_chain.run(input=query)
