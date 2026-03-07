from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("BAAI/bge-base-en-v1.5")


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