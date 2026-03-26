"""Mind map generation service using Gemini AI."""

from typing import List, Optional
import google.generativeai as genai
import json
from app.config import get_settings

settings = get_settings()


class MindMapService:
    """Generate mind maps from topics using Gemini AI."""
    
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
        self.model = None
    
    def _get_model(self):
        """Get or create the Gemini model."""
        if self.model is None and settings.gemini_api_key:
            self.model = genai.GenerativeModel('gemini-pro')
        return self.model
    
    def _parse_mind_map_response(self, response_text: str) -> dict:
        """Parse the AI response into a structured mind map."""
        try:
            # Try to extract JSON from the response
            json_match = None
            for line in response_text.split('\n'):
                if line.strip().startswith('{'):
                    json_match = line
                    break
            
            if json_match:
                return json.loads(json_match)
            
            # Fallback: create a simple structure from text
            lines = [l.strip() for l in response_text.split('\n') if l.strip() and not l.strip().startswith('#')]
            return {"nodes": lines}
        except:
            return {"raw": response_text}
    
    def generate_mind_map(self, topic: str, depth: int = 3, max_nodes: int = 20) -> dict:
        """Generate a mind map for a given topic."""
        model = self._get_model()
        
        if model is None:
            return {
                "success": False,
                "error": "Gemini API key not configured. Please set GEMINI_API_KEY in environment."
            }
        
        prompt = f"""Create a mind map for the topic: "{topic}"

Generate a hierarchical structure with main concepts and sub-concepts.
Maximum depth: {depth}
Maximum total nodes: {max_nodes}

Return the result as a JSON structure in this exact format:
{{
  "id": "root",
  "label": "{topic}",
  "children": [
    {{
      "id": "unique_id_1",
      "label": "Main Concept 1",
      "children": [
        {{"id": "unique_id_2", "label": "Sub-concept 1"}},
        {{"id": "unique_id_3", "label": "Sub-concept 2"}}
      ]
    }},
    {{
      "id": "unique_id_4",
      "label": "Main Concept 2",
      "children": []
    }}
  ]
}}

Only return the JSON, no additional text."""
        
        try:
            response = model.generate_content(prompt)
            
            # Parse the response
            try:
                # Try to find and parse JSON
                text = response.text
                # Extract JSON from code blocks if present
                if '```json' in text:
                    text = text.split('```json')[1].split('```')[0]
                elif '```' in text:
                    text = text.split('```')[1].split('```')[0]
                
                nodes = json.loads(text.strip())
                
                return {
                    "success": True,
                    "topic": topic,
                    "nodes": nodes
                }
            except json.JSONDecodeError:
                # Return raw text if parsing fails
                return {
                    "success": True,
                    "topic": topic,
                    "nodes": {"id": "root", "label": topic, "raw_content": response.text}
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Error generating mind map: {str(e)}"
            }


# Global instance
mind_map_service = MindMapService()
