# Siftly - AI Video Knowledge Assistant

Siftly is an AI-powered system that allows users to interact with YouTube videos through natural language.  
The platform processes video transcripts, builds a semantic search index, and enables users to ask questions about the content without watching the entire video.

---

## 🚀 Features

- **YouTube Video Ingestion** – Process YouTube videos by extracting transcripts and metadata.
- **Semantic Search** – Retrieve relevant video segments using AI-powered similarity search.
- **AI Chat Assistant** – Ask questions about video content and receive contextual answers.
- **Video Metadata Display** – Automatically fetch and display video title and thumbnail.
- **Fast Retrieval** – Efficient vector search for quick responses.
- **Interactive Interface** – Simple frontend interface for video ingestion and querying.

---

## 🏗️ Architecture

### Backend (Python / FastAPI)

- Transcript extraction from YouTube videos
- Transcript chunking pipeline
- Embedding generation for semantic search
- FAISS vector store for similarity search
- LLM integration using Groq

### Frontend (React / Vite)

- Clean interface for video ingestion
- Display video title and thumbnail
- Chat-style interface for asking questions
- API communication with FastAPI backend

---

## 📊 Evaluation Framework

Siftly evaluates retrieval performance using standard information retrieval metrics.

### Metrics

- **Precision@K** – Measures how many retrieved segments are relevant.
- **Recall@K** – Measures how many relevant segments were retrieved.
- **MRR (Mean Reciprocal Rank)** – Evaluates ranking quality of results.

---

## 🛠️ Installation & Setup

### Requirements

- Python 3.10+
- Node.js & npm
- Groq API Key

---

## Backend Setup

Create a virtual environment

```bash
python -m venv .venv
```

Activate the environment

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the backend server

```bash
uvicorn src.api.main:app --reload
```

---

## Frontend Setup

Navigate to the frontend folder

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

---

## 🔮 Future Improvements

- Multi-video indexing
- Timestamp navigation for retrieved segments
- Enhanced semantic search and ranking
- Streaming responses for chat interface
- Improved UI and visualization features

---

## 👨‍💻 Author

Sarabjit Sharma
