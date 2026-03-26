'use client'

import { useEffect, useState } from 'react'
import { checkHealth, getApiInfo } from '@/lib/api'
import Link from 'next/link'

const features = [
  { icon: '📄', title: 'Document Ingestion', path: '/documents', desc: 'Upload PDF, DOCX files', color: 'bg-blue-500' },
  { icon: '🎬', title: 'YouTube Transcript', path: '/youtube', desc: 'Extract video transcripts', color: 'bg-red-500' },
  { icon: '🌐', title: 'Web Scraper', path: '/web', desc: 'Scrape web page content', color: 'bg-green-500' },
  { icon: '💬', title: 'RAG Chat', path: '/chat', desc: 'Chat with your knowledge base', color: 'bg-purple-500' },
  { icon: '🗺️', title: 'Mind Map', path: '/mindmap', desc: 'Generate visual mind maps', color: 'bg-yellow-500' },
  { icon: '📊', title: 'Topic Clustering', path: '/cluster', desc: 'Cluster documents by topic', color: 'bg-indigo-500' },
]

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

          {/* Features Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <Link
                  key={feature.path}
                  href={feature.path}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className={`${feature.color} text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
