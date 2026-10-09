// API client wrapper for CampusFlow
const API_BASE = '/api'

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = localStorage.getItem('campusflow_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    // If 401 Unauthorized, notify app to clear expired token
    if (response.status === 401) {
      localStorage.removeItem('campusflow_token')
      localStorage.removeItem('campusflow_user')
      window.dispatchEvent(new Event('campusflow:unauthorized'))
    }

    const errorPayload = data?.error || {
      code: 'REQUEST_FAILED',
      message: data?.message || `Request failed with status ${response.status}`,
    }
    
    const error = new Error(errorPayload.message)
    error.code = errorPayload.code
    error.status = response.status
    throw error
  }

  return data
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
}
