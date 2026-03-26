"""YouTube transcript extraction routes."""

from fastapi import APIRouter, HTTPException
from app.models.schemas import YouTubeTranscriptRequest, YouTubeTranscriptResponse
from app.services.youtube_service import YouTubeService

router = APIRouter(prefix="/youtube", tags=["YouTube"])


@router.post("/transcript", response_model=YouTubeTranscriptResponse)
async def get_youtube_transcript(request: YouTubeTranscriptRequest):
    """Extract transcript from a YouTube video."""
    result = YouTubeService.get_transcript(request.video_url, request.language)
    return YouTubeTranscriptResponse(**result)
