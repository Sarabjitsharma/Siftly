import faiss
import numpy as np


class FAISSVectorStore:
    def __init__(self, dimensions=768):
        self.dimensions = dimensions
        self.index = faiss.IndexFlatIP(dimensions)
        self.metadata = []

    def add(self, embeddings, metadata):
        
        embeddings = np.array(embeddings).astype("float32")
        
        self.index.add(embeddings)

        self.metadata.extend(metadata)
    
    def search(self, query_embedding, k=3):

        query_embedding = np.array(query_embedding).astype("float32")

        distances, indices = self.index.search(query_embedding, k)

        results = []
        for idx in indices[0]:
            results.append(self.metadata[idx])
        
        return results
    
    def reset(self):

        self.index.reset()
        self.metadata = []