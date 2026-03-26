"""Topic clustering routes."""

from fastapi import APIRouter
from app.models.schemas import TopicClusterRequest, TopicClusterResponse
from app.services.cluster_service import topic_cluster_service

router = APIRouter(prefix="/cluster", tags=["Topic Clustering"])


@router.post("/documents", response_model=TopicClusterResponse)
async def cluster_documents(request: TopicClusterRequest):
    """Cluster documents by topics."""
    result = topic_cluster_service.cluster_documents(
        request.documents,
        request.num_clusters
    )
    return TopicClusterResponse(**result)
