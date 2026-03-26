"""Document processing service for PDF and DOCX files."""

import os
import tempfile
from typing import Optional
from pypdf import PdfReader
from docx import Document


class DocumentProcessor:
    """Process PDF and DOCX documents to extract text content."""
    
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extract text content from a PDF file."""
        reader = PdfReader(file_path)
        text_parts = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        return "\n".join(text_parts)
    
    @staticmethod
    def extract_text_from_docx(file_path: str) -> str:
        """Extract text content from a DOCX file."""
        doc = Document(file_path)
        text_parts = []
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text_parts.append(paragraph.text)
        return "\n".join(text_parts)
    
    @classmethod
    def process_document(cls, file_path: str, file_type: str) -> dict:
        """Process a document and return extracted content."""
        try:
            if file_type.lower() == "pdf":
                text = cls.extract_text_from_pdf(file_path)
            elif file_type.lower() in ["docx", "doc"]:
                text = cls.extract_text_from_docx(file_path)
            else:
                return {
                    "success": False,
                    "error": f"Unsupported file type: {file_type}"
                }
            
            return {
                "success": True,
                "content": text,
                "word_count": len(text.split()),
                "char_count": len(text)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    @classmethod
    def process_uploaded_file(cls, file_content: bytes, filename: str) -> dict:
        """Process an uploaded file from bytes."""
        file_type = os.path.splitext(filename)[1].lstrip(".").lower()
        
        if file_type not in ["pdf", "docx", "doc"]:
            return {
                "success": False,
                "error": f"Unsupported file type: {file_type}. Supported types: PDF, DOCX"
            }
        
        # Write to temp file for processing
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_type}") as tmp:
            tmp.write(file_content)
            tmp_path = tmp.name
        
        try:
            result = cls.process_document(tmp_path, file_type)
            result["filename"] = filename
            result["file_type"] = file_type
            return result
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
