from sentence_transformers import SentenceTransformer

embedding_model = None


def get_embedding_model():
    global embedding_model

    if embedding_model is None:
        embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    return embedding_model


def embed_query(query: str):
    model = get_embedding_model()

    embedding = model.encode(
        [query],
        normalize_embeddings=True
    )

    return embedding


def embed_chunks(chunks):
    model = get_embedding_model()

    texts = [chunk["text"] for chunk in chunks]

    embeddings = model.encode(
        texts,
        normalize_embeddings=True
    )

    return embeddings