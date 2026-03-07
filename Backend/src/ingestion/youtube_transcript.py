from youtube_transcript_api import YouTubeTranscriptApi
import re
def fetch_transcript(url: str):
    
    video_id = re.search(r"v=([^&]+)", url).group(1)
    video_id = re.sub(r'[^a-zA-Z0-9]', '', video_id)
    print(video_id)
    f = YouTubeTranscriptApi()
    transcript = f.fetch(video_id)

    return transcript, video_id