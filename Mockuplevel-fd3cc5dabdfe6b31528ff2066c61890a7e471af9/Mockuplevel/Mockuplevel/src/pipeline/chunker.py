"""Content chunking."""
from openai import OpenAI
from src.config import settings
from typing import List, Dict, Any

class EmbeddingChunker:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def generate_embedding(self, text: str) -> List[float]:
        response = self.client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding

    def chunk_transcript(self, transcript_segments: List[Dict[str, Any]], source_id: str) -> List[Dict[str, Any]]:
        chunks = []
        for segment in transcript_segments:
            embedding = self.generate_embedding(segment["text"])
            chunks.append({
                "source_id": source_id,
                "content": segment["text"],
                "embedding": embedding,
                "metadata": {
                    "t_start": segment["t_start"],
                    "t_end": segment["t_end"],
                    "media_type": "video"
                }
            })
        return chunks