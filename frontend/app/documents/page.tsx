'use client'

import { useState, useCallback } from 'react'
import { uploadDocument, uploadMultipleDocuments, addChatContext } from '@/lib/api'

export default function DocumentsPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)
    setResults([])

    try {
      let response
      if (files.length === 1) {
        response = await uploadDocument(files[0])
        setResults([response])
        
        // Add to chat context if successful
        if (response.success && response.content) {
          await addChatContext(response.content)
        }
      } else {
        response = await uploadMultipleDocuments(files)
        setResults(response.results || [])
        
        // Add successful documents to context
        for (const result of response.results || []) {
          if (result.success && result.content) {
            await addChatContext(result.content)
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || 
              file.name.endsWith('.docx') || 
              file.name.endsWith('.doc')
    )
    setFiles(droppedFiles)
  }, [])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📄 Document Ingestion</h1>
        <p className="text-gray-600 mb-8">Upload PDF or DOCX files to extract and process content</p>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-500 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.docx,.doc"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg">Drop files here or click to upload</p>
            <p className="text-sm mt-2">Supports PDF, DOCX files</p>
          </div>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Selected Files:</h3>
            <ul className="space-y-1">
              {files.map((file, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Processing...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Results:</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="font-medium">{result.filename}</span>
                </div>
                {result.success ? (
                  <div className="text-sm text-gray-600">
                    <p>Type: {result.file_type?.toUpperCase()}</p>
                    <p>Words: {result.word_count?.toLocaleString()}</p>
                    <p>Characters: {result.char_count?.toLocaleString()}</p>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600">View Content</summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs bg-white p-2 rounded border max-h-60 overflow-auto">
                        {result.content?.substring(0, 2000)}...
                      </pre>
                    </details>
                  </div>
                ) : (
                  <p className="text-red-600 text-sm">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
