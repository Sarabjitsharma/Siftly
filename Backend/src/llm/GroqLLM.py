from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm_model = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.1
)


prompt = ChatPromptTemplate.from_template(
"""
You are an assistant answering questions about a YouTube video.

Use ONLY the provided context.

Context:
{context}

Question:
{query}

Answer clearly and concisely.
"""
)


def generate_answer(query, context):
    chain = prompt | llm_model

    response = chain.invoke({
        "context":context,
        "query":query
    })
    return response.content
