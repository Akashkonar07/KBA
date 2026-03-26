'use client'

import { useState } from 'react'
import { getYoutubeTranscript, addChatContext } from '@/lib/api'

export default function YouTubePage() {
  const [videoUrl, setVideoUrl] = useState('')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExtract = async () => {
    if (!videoUrl.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await getYoutubeTranscript(videoUrl, language)
      setResult(response)
      
      // Add to chat context if successful
      if (response.success && response.transcript) {
        await addChatContext(response.transcript)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract transcript')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🎬 YouTube Transcript</h1>
        <p className="text-gray-600 mb-8">Extract transcripts from YouTube videos</p>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <button
              onClick={handleExtract}
              disabled={loading || !videoUrl.trim()}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Extracting...' : 'Extract Transcript'}
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
                  <span className="font-medium text-green-700">Transcript Extracted Successfully</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><strong>Video ID:</strong> {result.video_id}</p>
                  <p><strong>Language:</strong> {result.language}</p>
                  <p><strong>Words:</strong> {result.word_count?.toLocaleString()}</p>
                </div>

                <details className="bg-white rounded-lg p-4">
                  <summary className="cursor-pointer font-medium text-blue-600">View Transcript</summary>
                  <div className="mt-4 whitespace-pre-wrap text-sm max-h-96 overflow-auto">
                    {result.transcript}
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
