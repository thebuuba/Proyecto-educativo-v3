const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.message || `Error ${res.status}`)
  }
  const body = await res.json()
  return body.data as T
}

export const api = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
    }).then(handleResponse<T>)
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>)
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>)
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>)
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
    }).then(handleResponse<T>)
  },
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}
