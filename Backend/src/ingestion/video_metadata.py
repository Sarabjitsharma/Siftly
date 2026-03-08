import requests

def fetch_video_title(url: str):

    endpoint = f"https://www.youtube.com/oembed?url={url}&format=json"

    response = requests.get(endpoint)

    data = response.json()

    return data["title"]