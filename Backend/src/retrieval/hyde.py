def hyde_query(query, llm):

    prompt = f"""
        Write a short paragraph answering the following question.

        Question:
        {query}
    """

    response = llm.invoke(prompt)

    return response.content