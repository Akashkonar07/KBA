"""Mind map generation routes."""

from fastapi import APIRouter
from app.models.schemas import MindMapRequest, MindMapResponse
from app.services.mindmap_service import mind_map_service

router = APIRouter(prefix="/mindmap", tags=["Mind Map"])


@router.post("/generate", response_model=MindMapResponse)
async def generate_mind_map(request: MindMapRequest):
    """Generate a mind map for a topic."""
    result = mind_map_service.generate_mind_map(
        request.topic, 
        request.depth, 
        request.max_nodes
    )
    return MindMapResponse(**result)
