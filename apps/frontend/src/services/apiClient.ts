/**
 * Cliente API para comunicación HTTP con el backend.
 * Incluye métodos para GET, POST, PUT, PATCH y DELETE,
 * manejo de errores y gestión del token de autenticación.
 */

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

/** Error personalizado con código de estado HTTP. */
export class ApiError extends Error {
  /** Código de estado HTTP del error. */
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Opciones para las peticiones HTTP, omitiendo headers para merge interno. */
type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

/** Obtiene los encabezados de autenticación desde localStorage. */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Procesa la respuesta HTTP, lanzando ApiError si no es exitosa.
 *
 * @param res - Respuesta de fetch.
 * @returns Datos extraídos del cuerpo de la respuesta.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.error || body.message || `Error ${res.status}`)
  }
  const body = await res.json()
  return body.data as T
}

/** Cliente HTTP con métodos para cada verbo. */
export const api = {
  /**
   * Petición GET.
   * @param path - Ruta relativa al base URL.
   * @param options - Opciones adicionales de fetch.
   */
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
    }).then(handleResponse<T>)
  },

  /**
   * Petición POST.
   * @param path - Ruta relativa al base URL.
   * @param body - Cuerpo de la petición.
   * @param options - Opciones adicionales de fetch.
   */
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>)
  },

  /**
   * Petición PATCH.
   * @param path - Ruta relativa al base URL.
   * @param body - Cuerpo de la petición.
   * @param options - Opciones adicionales de fetch.
   */
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>)
  },

  /**
   * Petición PUT.
   * @param path - Ruta relativa al base URL.
   * @param body - Cuerpo de la petición.
   * @param options - Opciones adicionales de fetch.
   */
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>)
  },

  /**
   * Petición DELETE.
   * @param path - Ruta relativa al base URL.
   * @param options - Opciones adicionales de fetch.
   */
  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return fetch(`${API_URL}${path}`, {
      ...options,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options?.headers },
    }).then(handleResponse<T>)
  },
}

/**
 * Guarda o elimina el token de autenticación en localStorage.
 *
 * @param token - Token JWT o null para eliminar.
 */
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

/**
 * Obtiene el token de autenticación desde localStorage.
 *
 * @returns El token JWT o null si no existe.
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}
