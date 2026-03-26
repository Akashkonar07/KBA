'use client'

import { useEffect, useState } from 'react'
import { checkHealth, getApiInfo } from '@/lib/api'

export default function Home() {
  const [health, setHealth] = useState<{ status: string; timestamp: string; service: string } | null>(null)
  const [apiInfo, setApiInfo] = useState<{ name: string; version: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [healthData, apiData] = await Promise.all([
          checkHealth(),
          getApiInfo()
        ])
        setHealth(healthData)
        setApiInfo(apiData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to backend')
      }
    }
    fetchData()
  }, [])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">KBA - Knowledge Base AI</h1>
        <p className="text-gray-600 mb-8">Multi-source AI knowledge platform</p>

        <div className="grid gap-6">
          {/* Backend Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Backend Status</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {apiInfo && (
              <div className="space-y-2">
                <p><strong>API:</strong> {apiInfo.name}</p>
                <p><strong>Version:</strong> {apiInfo.version}</p>
              </div>
            )}

            {health && (
              <div className="mt-4 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${health.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-green-600 font-medium">{health.status}</span>
                <span className="text-gray-500 text-sm">({health.timestamp})</span>
              </div>
            )}
          </div>

          {/* Features Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Features (Coming Soon)</h2>
            <ul className="space-y-2 text-gray-600">
              <li>📄 Document Ingestion (PDF, DOCX)</li>
              <li>🎬 YouTube Transcript Extraction</li>
              <li>🌐 Web Content Scraping</li>
              <li>💬 RAG-based Chat Interface</li>
              <li>🗺️ Mind Map Generation</li>
              <li>📊 Topic Clustering</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
