/**
 * Cliente API para comunicación HTTP con el backend.
 * Incluye métodos para GET, POST, PUT, PATCH y DELETE,
 * manejo de errores y envío de la cookie de sesión HttpOnly.
 */

// Mantener la API bajo el mismo origen evita CORS y el bloqueo de cookies
// HttpOnly de terceros. Vite y Vercel reenvían /api al backend real.
const API_URL = '/api/v1'

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

function legacyAuthHeaders(): Record<string, string> {
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
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...legacyAuthHeaders(), ...options?.headers },
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
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...legacyAuthHeaders(), ...options?.headers },
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
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...legacyAuthHeaders(), ...options?.headers },
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
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...legacyAuthHeaders(), ...options?.headers },
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
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...legacyAuthHeaders(), ...options?.headers },
    }).then(handleResponse<T>)
  },
}
