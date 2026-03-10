from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


from src.ingestion.youtube_transcript import fetch_transcript
# from src.processing.chunking import chunk_transcript
from src.retrieval.parent_child import create_parent_child_chunks, get_parent_context
from src.embeddings.embeddings import embed_chunks, embed_query

from src.vectorstore.faiss_store import FAISSVectorStore
# from src.processing.context import build_context
from src.llm.GroqLLM import generate_answer, llm_model
from src.ingestion.video_metadata import fetch_video_title

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://siftly-kappa.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


store = FAISSVectorStore()
parent_chunks = None

video_metadata = {}

class IngestRequest(BaseModel):
    url: str

@app.get("/")
def root():
    return {"status": "running"}

@app.post("/ingest")
def ingest_video(data:IngestRequest):
    print(data)
    try:
        url = data.url
        # print(url)
        transcript, video_id = fetch_transcript(url)
        
        title = fetch_video_title(url)
        
        # reset previous embeddings
        store.reset()
        global parent_chunks
        parent_chunks, child_chunks = create_parent_child_chunks(transcript)

        embeddings = embed_chunks(child_chunks)

        store.add(embeddings, child_chunks)

        thumbnail = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"

        video_metadata["video_id"] = video_id
        video_metadata["title"] = title
        video_metadata["thumbnail"] = thumbnail

        return {
            "status": "ingested",
            "url":f"{url}",
            "title": title,
            "video_id": video_id,
            "thumbnail": thumbnail,
        }

    except Exception as e:
        print(e)
        return {
            "status": "error",
            "message": str(e)
        }

from src.retrieval.hyde import hyde_query
from src.retrieval.multi_query import generate_multi_queries
from langchain_groq import ChatGroq

class IngestQuery(BaseModel):
    query: str

@app.post("/query")
def ask_question(input: IngestQuery):
    if parent_chunks is None:
        return {"answer": "No video ingested yet"}
    
    query = input.query

    hypothetical_doc = hyde_query(query, llm_model)
    queries = generate_multi_queries(query, llm_model)
    queries.append(hypothetical_doc)

    print(hypothetical_doc)
    print(queries)

    all_results = []

    for q in queries:
        query_embedding = embed_query(q)
        result = store.search(query_embedding, k=3)
        all_results.extend(result)

    context = get_parent_context(all_results, parent_chunks)

    final_context = "\n\n".join(context)
    answer = generate_answer(query, final_context)

    return {
        "answer": answer,
        "sources": context
    }