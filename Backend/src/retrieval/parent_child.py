def create_parent_child_chunks(transcript, parent_size=500, child_size=120):

    parent_chunks = []
    child_chunks = []

    current_parent = []
    current_length = 0

    for segment in transcript:
        text = segment.text

        current_parent.append(text)
        current_length += len(text.split())

        if current_length >= parent_size:

            parent_text = " ".join(current_parent)

            parent_id = len(parent_chunks)

            parent_chunks.append({
                "id": parent_id,
                "text": parent_text
            })

            words = parent_text.split()

            for i in range(0, len(words), child_size):
                child_text = " ".join(words[i:i+child_size])

                child_chunks.append({
                    "text": child_text,
                    "parent_id": parent_id
                })

            current_parent = []
            current_length = 0

    return parent_chunks, child_chunks

def get_parent_context(results, parent_chunks):

    parent_ids = set()

    for r in results:
        parent_ids.add(r["parent_id"])

    contexts = []

    for pid in parent_ids:
        contexts.append(parent_chunks[pid]["text"])

    return contexts