'use client'

import { useState } from 'react'
import { scrapeWebPage, addChatContext } from '@/lib/api'

export default function WebPage() {
  const [url, setUrl] = useState('')
  const [extractMain, setExtractMain] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScrape = async () => {
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await scrapeWebPage(url, extractMain)
      setResult(response)
      
      // Add to chat context if successful
      if (response.success && response.content) {
        await addChatContext(response.content)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scrape page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🌐 Web Scraper</h1>
        <p className="text-gray-600 mb-8">Extract content from web pages</p>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="extractMain"
                checked={extractMain}
                onChange={(e) => setExtractMain(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="extractMain" className="text-sm text-gray-700">
                Extract main content only (recommended)
              </label>
            </div>

            <button
              onClick={handleScrape}
              disabled={loading || !url.trim()}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Scraping...' : 'Scrape Content'}
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
          <div className={`rounded-lg p-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.success ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="font-medium text-green-700">Content Scraped Successfully</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><strong>Title:</strong> {result.title}</p>
                  <p><strong>URL:</strong> {result.url}</p>
                  <p><strong>Words:</strong> {result.word_count?.toLocaleString()}</p>
                </div>

                <details className="bg-white rounded-lg p-4">
                  <summary className="cursor-pointer font-medium text-blue-600">View Content</summary>
                  <div className="mt-4 whitespace-pre-wrap text-sm max-h-96 overflow-auto">
                    {result.content}
                  </div>
                </details>
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
