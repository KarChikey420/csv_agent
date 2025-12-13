from langchain.chains import RetrievalQA

def rag_query(store, query, llm):
    retriever = store.as_retriever()

    rag_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever
    )

    return rag_chain.run(query)
