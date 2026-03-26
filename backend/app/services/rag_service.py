"""RAG-based chat service using Gemini AI."""

import os
from typing import Optional, List
import google.generativeai as genai
from app.config import get_settings

settings = get_settings()


class RAGChatService:
    """RAG-based chat service using Google Gemini."""
    
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
        self.model = None
        self.conversation_history: List[dict] = []
        self.context_documents: List[str] = []
    
    def _get_model(self):
        """Get or create the Gemini model."""
        if self.model is None and settings.gemini_api_key:
            self.model = genai.GenerativeModel('gemini-pro')
        return self.model
    
    def add_context(self, content: str):
        """Add document content to the context."""
        self.context_documents.append(content)
    
    def clear_context(self):
        """Clear all context documents."""
        self.context_documents = []
    
    def clear_history(self):
        """Clear conversation history."""
        self.conversation_history = []
    
    def _build_context_prompt(self) -> str:
        """Build context from documents."""
        if not self.context_documents:
            return ""
        
        context_text = "\n\n---\n\n".join(self.context_documents)
        return f"""Use the following context to answer questions. If the answer is not in the context, say so.

Context:
{context_text}

"""
    
    def chat(self, message: str, use_context: bool = True) -> dict:
        """Send a message and get a response."""
        model = self._get_model()
        
        if model is None:
            return {
                "success": False,
                "error": "Gemini API key not configured. Please set GEMINI_API_KEY in environment."
            }
        
        try:
            # Build prompt with context if enabled
            if use_context and self.context_documents:
                context_prompt = self._build_context_prompt()
                full_prompt = context_prompt + f"\n\nUser: {message}"
            else:
                full_prompt = message
            
            # Add conversation history
            if self.conversation_history:
                history_text = "\n".join([
                    f"{msg['role']}: {msg['content']}" 
                    for msg in self.conversation_history
                ])
                full_prompt = f"Previous conversation:\n{history_text}\n\n{full_prompt}"
            
            response = model.generate_content(full_prompt)
            
            # Store in history
            self.conversation_history.append({"role": "user", "content": message})
            self.conversation_history.append({"role": "assistant", "content": response.text})
            
            return {
                "success": True,
                "response": response.text,
                "sources": [f"Document {i+1}" for i in range(len(self.context_documents))] if use_context and self.context_documents else []
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Error generating response: {str(e)}"
            }


# Global instance
chat_service = RAGChatService()
