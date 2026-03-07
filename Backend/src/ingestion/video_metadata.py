from pytube import YouTube

def fetch_video_title(url: str):
    yt = YouTube(url)
    return yt.title