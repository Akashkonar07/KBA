"""RAG-based chat routes."""

from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag_service import chat_service

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/message", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """Send a message to the RAG-based chat."""
    result = chat_service.chat(request.message, request.use_context)
    return ChatResponse(**result)


@router.post("/add-context")
async def add_context_to_chat(content: str):
    """Add document content to the chat context."""
    chat_service.add_context(content)
    return {"success": True, "message": "Context added successfully"}


@router.post("/clear-context")
async def clear_chat_context():
    """Clear the chat context."""
    chat_service.clear_context()
    return {"success": True, "message": "Context cleared successfully"}


@router.post("/clear-history")
async def clear_chat_history():
    """Clear the conversation history."""
    chat_service.clear_history()
    return {"success": True, "message": "History cleared successfully"}
