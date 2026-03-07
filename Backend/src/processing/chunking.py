def chunk_transcript(transcript, max_words=200):
    
    chunks = []
    
    current_text = []
    start_time = None
    
    word_count = 0
    
    for t in transcript:
        
        words = t.text.split()
        
        if start_time is None:
            start_time = t.start
        
        current_text.extend(words)
        word_count += len(words)
        
        if word_count >= max_words:
            
            chunk_text = " ".join(current_text)
            
            chunks.append({
                "text": chunk_text,
                "start": start_time,
                "end": t.start + t.duration
            })
            
            current_text = []
            word_count = 0
            start_time = None
    
    return chunks