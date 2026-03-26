"""Pydantic models for API requests and responses."""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DocumentUploadResponse(BaseModel):
    """Response model for document upload."""
    success: bool
    filename: Optional[str] = None
    file_type: Optional[str] = None
    content: Optional[str] = None
    word_count: Optional[int] = None
    char_count: Optional[int] = None
    error: Optional[str] = None


class YouTubeTranscriptRequest(BaseModel):
    """Request model for YouTube transcript extraction."""
    video_url: str
    language: Optional[str] = "en"


class YouTubeTranscriptResponse(BaseModel):
    """Response model for YouTube transcript."""
    success: bool
    video_id: Optional[str] = None
    title: Optional[str] = None
    transcript: Optional[str] = None
    language: Optional[str] = None
    error: Optional[str] = None


class WebScrapeRequest(BaseModel):
    """Request model for web scraping."""
    url: str
    extract_main_content: Optional[bool] = True


class WebScrapeResponse(BaseModel):
    """Response model for web scraping."""
    success: bool
    url: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    word_count: Optional[int] = None
    error: Optional[str] = None


class ChatMessage(BaseModel):
    """Chat message model."""
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = datetime.utcnow()


class ChatRequest(BaseModel):
    """Request model for RAG chat."""
    message: str
    conversation_id: Optional[str] = None
    use_context: Optional[bool] = True


class ChatResponse(BaseModel):
    """Response model for RAG chat."""
    success: bool
    response: Optional[str] = None
    conversation_id: Optional[str] = None
    sources: Optional[List[str]] = None
    error: Optional[str] = None


class MindMapRequest(BaseModel):
    """Request model for mind map generation."""
    topic: str
    depth: Optional[int] = 3
    max_nodes: Optional[int] = 20


class MindMapNode(BaseModel):
    """Node in a mind map."""
    id: str
    label: str
    children: Optional[List["MindMapNode"]] = None


class MindMapResponse(BaseModel):
    """Response model for mind map generation."""
    success: bool
    topic: Optional[str] = None
    nodes: Optional[MindMapNode] = None
    error: Optional[str] = None


class TopicClusterRequest(BaseModel):
    """Request model for topic clustering."""
    documents: List[str]
    num_clusters: Optional[int] = 5


class TopicClusterResponse(BaseModel):
    """Response model for topic clustering."""
    success: bool
    clusters: Optional[List[dict]] = None
    error: Optional[str] = None
