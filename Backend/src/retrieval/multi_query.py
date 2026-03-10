def generate_multi_queries(query, llm):

    prompt = f"""
        Generate 3 alternative search queries for:

        {query}

        Return only the queries.
    """

    response = llm.invoke(prompt)

    queries = [q.strip() for q in response.content.split("\n") if q.strip()]

    return [query] + queries