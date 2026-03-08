from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


from src.ingestion.youtube_transcript import fetch_transcript
from src.processing.chunking import chunk_transcript
from src.embeddings.embeddings import embed_chunks, embed_query
from src.vectorstore.faiss_store import FAISSVectorStore
from src.processing.context import build_context
from src.llm.GroqLLM import generate_answer
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

        chunks = chunk_transcript(transcript)

        embeddings = embed_chunks(chunks)

        store.add(embeddings, chunks)

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

        return {
            "status": "error",
            "message": str(e)
        }


from fastapi import HTTPException

class IngestQuery(BaseModel):
    query: str

@app.post("/query")
def ask_question(input: IngestQuery):

    query = input.query

    query_embedding = embed_query(query)

    results = store.search(query_embedding, k=5)

    context = build_context(results)

    answer = generate_answer(query, context)

    return {
        "answer": answer,
        "sources": results
    }