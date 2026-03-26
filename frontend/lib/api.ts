const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Health check
export async function checkHealth() {
  return fetchApi<{ status: string; timestamp: string; service: string }>('/health')
}

// API info
export async function getApiInfo() {
  return fetchApi<{ name: string; version: string; docs: string; health: string }>('/')
}

// ============ Documents ============
export async function uploadDocument(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Upload failed')
  }
  
  return response.json()
}

export async function uploadMultipleDocuments(files: File[]) {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  
  const response = await fetch(`${API_BASE_URL}/documents/upload-multiple`, {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    throw new Error('Upload failed')
  }
  
  return response.json()
}

// ============ YouTube ============
export async function getYoutubeTranscript(videoUrl: string, language: string = 'en') {
  return fetchApi<{ success: boolean; video_id?: string; transcript?: string; error?: string }>('/youtube/transcript', {
    method: 'POST',
    body: JSON.stringify({ video_url: videoUrl, language }),
  })
}

// ============ Web Scraping ============
export async function scrapeWebPage(url: string, extractMainContent: boolean = true) {
  return fetchApi<{ success: boolean; url?: string; title?: string; content?: string; error?: string }>('/web/scrape', {
    method: 'POST',
    body: JSON.stringify({ url, extract_main_content: extractMainContent }),
  })
}

// ============ Chat ============
export async function sendChatMessage(message: string, useContext: boolean = true) {
  return fetchApi<{ success: boolean; response?: string; sources?: string[]; error?: string }>('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message, use_context: useContext }),
  })
}

export async function addChatContext(content: string) {
  return fetchApi<{ success: boolean; message: string }>(`/chat/add-context?content=${encodeURIComponent(content)}`, {
    method: 'POST',
  })
}

export async function clearChatContext() {
  return fetchApi<{ success: boolean; message: string }>('/chat/clear-context', {
    method: 'POST',
  })
}

// ============ Mind Map ============
export async function generateMindMap(topic: string, depth: number = 3, maxNodes: number = 20) {
  return fetchApi<{ success: boolean; topic?: string; nodes?: any; error?: string }>('/mindmap/generate', {
    method: 'POST',
    body: JSON.stringify({ topic, depth, max_nodes: maxNodes }),
  })
}

// ============ Topic Clustering ============
export async function clusterDocuments(documents: string[], numClusters: number = 5) {
  return fetchApi<{ success: boolean; clusters?: any[]; error?: string }>('/cluster/documents', {
    method: 'POST',
    body: JSON.stringify({ documents, num_clusters: numClusters }),
  })
}
