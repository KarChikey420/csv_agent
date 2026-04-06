from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
import logging

logger = logging.getLogger("prepx_backend.rag_qa")

def rag_query(store, query, llm):
    """Run a RAG query using modern LangChain chains."""
    try:
        retriever = store.as_retriever()

        # Define prompt
        system_prompt = (
            "You are an assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer the question. "
            "If you don't know the answer, just say that you don't know. "
            "Use three sentences maximum and keep the answer concise."
            "\n\n"
            "{context}"
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])

        # Create stuff documents chain
        question_answer_chain = create_stuff_documents_chain(llm, prompt)

        # Create retrieval chain
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)

        # Run the chain
        response = rag_chain.invoke({"input": query})
        
        return response["answer"]
        
    except Exception as e:
        logger.error(f"Error in rag_query: {str(e)}")
        raise e
