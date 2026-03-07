import { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import IngestScreen, { type IngestResponse } from './components/IngestScreen/IngestScreen';

function App() {
  const [ingestedVideo, setIngestedVideo] = useState<IngestResponse | null>(null);

  if (!ingestedVideo) {
    return <IngestScreen onIngestSuccess={setIngestedVideo} />;
  }

  return (
    <MainLayout 
      video={ingestedVideo} 
      onChangeVideo={() => setIngestedVideo(null)} 
    />
  );
}

export default App;
