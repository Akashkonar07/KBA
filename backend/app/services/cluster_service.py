"""Topic clustering service using embeddings."""

from typing import List, Optional
import google.generativeai as genai
from app.config import get_settings

settings = get_settings()


class TopicClusterService:
    """Cluster documents by topics using AI."""
    
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
        self.model = None
    
    def _get_model(self):
        """Get or create the Gemini model."""
        if self.model is None and settings.gemini_api_key:
            self.model = genai.GenerativeModel('gemini-pro')
        return self.model
    
    def cluster_documents(self, documents: List[str], num_clusters: int = 5) -> dict:
        """Cluster documents into topics."""
        model = self._get_model()
        
        if model is None:
            return {
                "success": False,
                "error": "Gemini API key not configured. Please set GEMINI_API_KEY in environment."
            }
        
        if not documents:
            return {
                "success": False,
                "error": "No documents provided for clustering."
            }
        
        # Truncate documents if too long
        max_doc_length = 500
        truncated_docs = [doc[:max_doc_length] + "..." if len(doc) > max_doc_length else doc for doc in documents]
        
        prompt = f"""Analyze the following {len(documents)} documents and cluster them into {num_clusters} topic groups.

Documents:
{chr(10).join([f"Document {i+1}: {doc}" for i, doc in enumerate(truncated_docs)])}

Return a JSON object with the following structure:
{{
  "clusters": [
    {{
      "topic": "Topic Name",
      "description": "Brief description of this topic",
      "document_indices": [0, 2, 5]
    }},
    {{
      "topic": "Another Topic",
      "description": "Description",
      "document_indices": [1, 3]
    }}
  ]
}}

The document_indices should reference the original document numbers (0-indexed).
Only return the JSON, no additional text."""
        
        try:
            response = model.generate_content(prompt)
            text = response.text
            
            # Extract JSON from code blocks if present
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0]
            elif '```' in text:
                text = text.split('```')[1].split('```')[0]
            
            import json
            result = json.loads(text.strip())
            
            return {
                "success": True,
                "clusters": result.get("clusters", [])
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error clustering documents: {str(e)}"
            }


# Global instance
topic_cluster_service = TopicClusterService()
