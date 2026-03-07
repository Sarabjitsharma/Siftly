import React from 'react';
import './MainLayout.css';
import SourcePanel from '../Sidebar/SourcePanel';
import ChatInterface from '../Chat/ChatInterface';
import type { IngestResponse } from '../IngestScreen/IngestScreen';

interface MainLayoutProps {
  video: IngestResponse;
  onChangeVideo: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ video, onChangeVideo }) => {
  return (
    <div className="layout-container">
      {/* Header spanning top */}
      <header className="layout-header glass-panel">
        <div className="logo">
          <span className="logo-icon">▶</span> Siftly RAG
        </div>
      </header>

      {/* Main content grid */}
      <main className="layout-main">
        <div className="panel-container source-panel-container">
          <SourcePanel video={video} onChangeVideo={onChangeVideo} />
        </div>
        <div className="panel-container chat-panel-container">
          <ChatInterface videoId={video.video_id} />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
