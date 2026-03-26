'use client'

import { useState } from 'react'
import { clusterDocuments } from '@/lib/api'

export default function ClusterPage() {
  const [documents, setDocuments] = useState<string[]>([''])
  const [numClusters, setNumClusters] = useState(5)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const addDocument = () => {
    setDocuments([...documents, ''])
  }

  const removeDocument = (index: number) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((_, i) => i !== index))
    }
  }

  const updateDocument = (index: number, value: string) => {
    const updated = [...documents]
    updated[index] = value
    setDocuments(updated)
  }

  const handleCluster = async () => {
    const validDocs = documents.filter(d => d.trim())
    if (validDocs.length === 0) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await clusterDocuments(validDocs, numClusters)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cluster documents')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📊 Topic Clustering</h1>
        <p className="text-gray-600 mb-8">Cluster documents by topics using AI</p>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents (one per text area)
              </label>
              {documents.map((doc, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <textarea
                    value={doc}
                    onChange={(e) => updateDocument(index, e.target.value)}
                    placeholder={`Document ${index + 1} content...`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  {documents.length > 1 && (
                    <button
                      onClick={() => removeDocument(index)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addDocument}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add another document
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Clusters: {numClusters}
              </label>
              <input
                type="range"
                min="2"
                max="10"
                value={numClusters}
                onChange={(e) => setNumClusters(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleCluster}
              disabled={loading || documents.filter(d => d.trim()).length === 0}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Clustering...' : 'Cluster Documents'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-lg p-6 ${result.success ? 'bg-white shadow-lg' : 'bg-red-50 border border-red-200'}`}>
            {result.success ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Clusters</h2>
                <div className="space-y-4">
                  {result.clusters?.map((cluster: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                        <h3 className="font-semibold">{cluster.topic}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{cluster.description}</p>
                      <p className="text-xs text-gray-500">
                        Documents: {cluster.document_indices?.map((i: number) => `#${i + 1}`).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-700">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                {result.error}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
