"""Application entry point."""
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from src.tasks.celery_worker import process_video_ingestion

app = FastAPI(title="Multimodal Study Companion API")

class VideoIngestRequest(BaseModel):
    source_id: str
    video_path: str

@app.get("/")
def read_root():
    return {"message": "Multimodal Study Companion Ingestion API active"}

@app.post("/api/v1/ingest/video")
def trigger_video_ingestion(payload: VideoIngestRequest):
    """Triggers asynchronous ingestion using FFmpeg and Whisper."""
    task = process_video_ingestion.delay(payload.video_path, payload.source_id)
    return {
        "status": "Queued",
        "task_id": task.id,
        "source_id": payload.source_id
    }
