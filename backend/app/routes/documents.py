"""Document ingestion routes."""

from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from app.services.document_processor import DocumentProcessor
from app.models.schemas import DocumentUploadResponse

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a PDF or DOCX document."""
    # Check file type
    filename = file.filename.lower()
    if not (filename.endswith('.pdf') or filename.endswith('.docx') or filename.endswith('.doc')):
        raise HTTPException(
            status_code=400, 
            detail="Unsupported file type. Please upload PDF or DOCX files."
        )
    
    # Read file content
    content = await file.read()
    
    # Process the document
    result = DocumentProcessor.process_uploaded_file(content, file.filename)
    
    return DocumentUploadResponse(**result)


@router.post("/upload-multiple")
async def upload_multiple_documents(files: List[UploadFile] = File(...)):
    """Upload and process multiple documents."""
    results = []
    
    for file in files:
        filename = file.filename.lower()
        if filename.endswith('.pdf') or filename.endswith('.docx') or filename.endswith('.doc'):
            content = await file.read()
            result = DocumentProcessor.process_uploaded_file(content, file.filename)
            results.append(result)
        else:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": "Unsupported file type"
            })
    
    return {"results": results, "total": len(results), "successful": sum(1 for r in results if r.get("success"))}
