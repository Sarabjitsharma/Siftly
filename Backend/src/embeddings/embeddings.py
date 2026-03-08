from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def embed_query(query:str):
    query = "quer: " + query
    embedding = embedding_model.encode(
        [query],
        normalize_embeddings=True
    )
    return embedding


def embed_chunks(chunks):
    texts = ["passage: " + chunk["text"] for chunk in chunks]

    embeddings = embedding_model.encode(
        texts,
        normalize_embeddings=True
    )

    return embeddings