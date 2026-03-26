"""Web scraping routes."""

from fastapi import APIRouter
from app.models.schemas import WebScrapeRequest, WebScrapeResponse
from app.services.web_scraper import WebScraperService

router = APIRouter(prefix="/web", tags=["Web Scraping"])


@router.post("/scrape", response_model=WebScrapeResponse)
async def scrape_web_page(request: WebScrapeRequest):
    """Scrape content from a web page."""
    result = WebScraperService.scrape_url(request.url, request.extract_main_content)
    return WebScrapeResponse(**result)
