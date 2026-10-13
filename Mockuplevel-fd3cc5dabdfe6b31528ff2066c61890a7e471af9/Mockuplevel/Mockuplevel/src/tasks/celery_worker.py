"""Celery worker configuration."""

from celery import Celery
import os
import shutil
from src.config import settings
from src.pipeline.video_processor import VideoProcessor
from src.pipeline.chunker import EmbeddingChunker
from src.db.vector_store import VectorStore

celery_app = Celery("ingestion_worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

video_proc = VideoProcessor()
chunker = EmbeddingChunker()
db_store = VectorStore()

@celery_app.task(name="process_video_ingestion", bind=True, max_retries=3)#creates queue
def process_video_ingestion(self, video_path: str, source_id: str):
    temp_dir = f"/tmp/ingest_{source_id}"
    os.makedirs(temp_dir, exist_ok=True)
    try:
        # 1. Process Video via FFmpeg & Whisper
        res = video_proc.process(video_path, temp_dir)

        # 2. Chunk & Embed Transcripts
        chunks = chunker.chunk_transcript(res["transcripts"], source_id)

        # 3. Store into PostgreSQL + pgvector
        db_store.store_chunks(chunks)

        return {"status": "SUCCESS", "source_id": source_id, "chunks_processed": len(chunks)}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=10)
    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)