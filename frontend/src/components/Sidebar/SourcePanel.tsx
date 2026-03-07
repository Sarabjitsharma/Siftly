import React, { useState } from 'react';
import { PlayCircle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SourcePanel.css';
import type { IngestResponse } from '../IngestScreen/IngestScreen';

interface SourcePanelProps {
  video: IngestResponse;
  onChangeVideo: () => void;
}

const SourcePanel: React.FC<SourcePanelProps> = ({ video, onChangeVideo }) => {
  const [showTranscript] = useState(true);

  const videoDetails = {
    title: video.title || `YouTube Video (${video.video_id})`,
    channel: "Siftly Imported Video",
    duration: "Unknown",
    thumbnail: video.thumbnail
  };

  return (
    <div className="source-panel">
      <div className="source-header">
        <h2>Knowledge Source</h2>
        <p className="subtitle">Currently chatting with this video</p>
      </div>

      <div className="source-input-container" style={{ paddingBottom: 0 }}>
        <button onClick={onChangeVideo} className="submit-url-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
          <RefreshCw size={18} />
          Change Video
        </button>
      </div>

      <div className="source-content" style={{ marginTop: '1.5rem' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key="video-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="video-content"
          >
            <div className="video-card glass-panel">
              <div className="thumbnail-wrapper">
                <img src={videoDetails.thumbnail} alt={videoDetails.title} className="thumbnail" />
                <div className="play-overlay">
                  <PlayCircle size={40} />
                </div>
              </div>
              <div className="video-info">
                <h3 title={videoDetails.title} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{videoDetails.title}</h3>
                <p>{videoDetails.channel}</p>
                <div className="status-badge" style={{ marginTop: '0.5rem' }}>
                  <CheckCircle2 size={14} className="success-icon" /> {video.num_chunks} chunks indexed
                </div>
              </div>
            </div>

            {showTranscript && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="transcript-section"
              >
                <div className="section-title">
                  <FileText size={18} />
                  <h4>Indexing Status</h4>
                </div>
                <div className="transcript-box glass-panel">
                  <p>
                    Successfully extracted and indexed <strong>{video.num_chunks}</strong> chunks of context from this video. The RAG system is fully initialized and ready to answer your questions.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SourcePanel;
