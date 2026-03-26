'use client'

import { useState } from 'react'
import { generateMindMap } from '@/lib/api'

interface MindMapNode {
  id: string
  label: string
  children?: MindMapNode[]
}

export default function MindMapPage() {
  const [topic, setTopic] = useState('')
  const [depth, setDepth] = useState(3)
  const [maxNodes, setMaxNodes] = useState(20)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await generateMindMap(topic, depth, maxNodes)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate mind map')
    } finally {
      setLoading(false)
    }
  }

  const renderNode = (node: MindMapNode, level: number = 0) => {
    if (!node) return null
    
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']
    const bgColor = colors[level % colors.length]
    
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className={`${bgColor} text-white px-4 py-2 rounded-lg mb-2 text-center`}>
          {node.label}
        </div>
        {node.children && node.children.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center border-t-2 border-gray-200 pt-4 mt-2">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🗺️ Mind Map Generator</h1>
        <p className="text-gray-600 mb-8">Generate visual mind maps from topics using AI</p>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Machine Learning, Climate Change, History of Rome"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Depth: {depth}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={depth}
                onChange={(e) => setDepth(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Nodes: {maxNodes}
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={maxNodes}
                onChange={(e) => setMaxNodes(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Generating...' : 'Generate Mind Map'}
              </button>
            </div>
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
                <h2 className="text-xl font-bold mb-4 text-center">Mind Map: {result.topic}</h2>
                <div className="overflow-auto">
                  {result.nodes ? renderNode(result.nodes) : (
                    <p className="text-gray-500 text-center">No nodes generated</p>
                  )}
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
