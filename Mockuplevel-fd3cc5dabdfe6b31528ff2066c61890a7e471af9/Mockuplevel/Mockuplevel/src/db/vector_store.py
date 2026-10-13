from supabase import create_client, Client
from src.config import settings

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


class VectorStore:
    """Persistence operations for embedded document chunks."""

    def store_chunks(self, chunks: list[dict]) -> list[dict]:
        if not chunks:
            return []

        response = supabase.table("document_chunks").insert(chunks).execute()
        return response.data


def search_relevant_context(query_text: str, query_embedding: list, tenant_id: str, course_id: str):
    response = supabase.rpc(
        "match_document_chunks_rrf",
        {
            "query_text": query_text,
            "query_embedding": query_embedding,
            "filter_tenant_id": tenant_id,
            "filter_course_id": course_id,
            "match_count": 5
        }
    ).execute()
    
    return response.data