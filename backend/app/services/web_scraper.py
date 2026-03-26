"""Web content scraping service."""

import re
from typing import Optional
import requests
from bs4 import BeautifulSoup


class WebScraperService:
    """Scrape and extract content from web pages."""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean extracted text by removing extra whitespace."""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove leading/trailing whitespace
        text = text.strip()
        return text
    
    @classmethod
    def scrape_url(cls, url: str, extract_main_content: bool = True) -> dict:
        """Scrape content from a URL."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
                element.decompose()
            
            # Get title
            title = soup.title.string.strip() if soup.title else ""
            
            if extract_main_content:
                # Try to find main content area
                main_content = (
                    soup.find('main') or 
                    soup.find('article') or 
                    soup.find('div', class_=re.compile(r'content|main|article', re.I)) or
                    soup.find('div', id=re.compile(r'content|main|article', re.I)) or
                    soup.body
                )
                
                if main_content:
                    text = main_content.get_text(separator='\n')
                else:
                    text = soup.get_text(separator='\n')
            else:
                text = soup.get_text(separator='\n')
            
            cleaned_text = cls.clean_text(text)
            
            return {
                "success": True,
                "url": url,
                "title": title,
                "content": cleaned_text,
                "word_count": len(cleaned_text.split())
            }
            
        except requests.RequestException as e:
            return {
                "success": False,
                "url": url,
                "error": f"Failed to fetch URL: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "url": url,
                "error": f"Error scraping content: {str(e)}"
            }
