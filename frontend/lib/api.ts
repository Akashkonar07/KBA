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
