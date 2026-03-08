import React, { useState } from 'react';
import { Youtube } from 'lucide-react';
import './IngestScreen.css';

export interface IngestResponse {
  url:string,
  video_id: string;
  thumbnail: string;
  title?: string;
}

interface IngestScreenProps {
  onIngestSuccess: (data: IngestResponse) => void;
}

const IngestScreen: React.FC<IngestScreenProps> = ({ onIngestSuccess }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || (!url.includes('youtube.com/') && !url.includes('youtu.be/'))) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to process video.');
      }

      const data = await response.json();

      if (data.status === "error") {
        throw new Error(data.message);
      }

      onIngestSuccess(data as IngestResponse);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ingest-screen glass-panel">
      <div className="ingest-content">
        <div className="ingest-header">
          <div className="logo-icon">▶</div>
          <h1>Siftly</h1>
          <p>Enter a YouTube video link to chat with its content</p>
        </div>

        <div className="ingest-input-container">
          {!isLoading ? (
            <form onSubmit={handleSubmit} className="ingest-form">
              <div style={{ position: 'relative' }}>
                <Youtube
                  size={20}
                  style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Paste YouTube Link (e.g., https://youtube.com/watch?v=...)"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  className="url-input"
                  autoFocus
                />
              </div>
              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="submit-btn"
                disabled={!url.trim()}
              >
                Process Video
              </button>
            </form>
          ) : (
            <div className="ingesting-state">
              <div className="radar-spinner"></div>
              <p>Extracting audio & transcript...</p>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>This might take a few moments</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngestScreen;
