def build_context(results):

    context = ""

    for r in results:
        context += r["text"] + "\n"

    return context