/**
 * Cliente API para comunicación HTTP con el backend.
 * Incluye métodos para GET, POST, PUT, PATCH y DELETE,
 * manejo de errores y envío de la cookie de sesión HttpOnly.
 */

// Mantener la API bajo el mismo origen evita CORS y el bloqueo de cookies
// HttpOnly de terceros. Vite reenvía /api solo durante el desarrollo local.
const API_URL = '/api/v1'
const GET_TIMEOUT_MS = 15_000

export const API_CACHE_TTL = {
  sessionList: 60_000,
  options: 120_000,
  catalog: 300_000,
} as const

export const API_CACHE_TAGS = {
  academicPeriods: 'academic-periods',
  courseOptions: 'course-options',
  dashboard: 'dashboard',
  enrollmentOptions: 'enrollment-options',
  planningCompetencies: 'planning-competencies',
  planningEntries: 'planning-entries',
  schoolYears: 'school-years',
  timeSlots: 'schedule-time-slots',
  schedule: 'schedule',
} as const

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

type GetRequestOptions = RequestOptions & {
  /** Tiempo máximo que una respuesta GET puede reutilizarse en esta sesión. */
  cacheTtlMs?: number
  /** Etiquetas que permiten invalidar grupos de respuestas relacionadas. */
  cacheTags?: readonly string[]
  /** Omite una respuesta vigente y fuerza una petición de red. */
  forceRefresh?: boolean
  /** Tiempo máximo de espera antes de cancelar la petición. */
  timeoutMs?: number
}

type MutationRequestOptions = RequestOptions & {
  /** Invalida estas etiquetas únicamente después de una mutación exitosa. */
  invalidateCacheTags?: readonly string[]
  /** Limpia toda la caché después de una mutación de sesión exitosa. */
  clearResponseCache?: boolean
}

type CacheEntry = {
  value: unknown
  expiresAt: number
  tags: ReadonlySet<string>
}

type PendingGet = {
  promise: Promise<unknown>
  tags: ReadonlySet<string>
}

const MAX_CACHE_ENTRIES = 100
const responseCache = new Map<string, CacheEntry>()
const tagVersions = new Map<string, number>()
let cacheGeneration = 0

// Evita que varios componentes disparen simultáneamente el mismo GET.
// La entrada desaparece al terminar: no se sirven datos obsoletos.
const pendingGets = new Map<string, PendingGet>()

function cacheKey(url: string) {
  return `${cacheGeneration}:${url}`
}

function pruneExpiredCache(now = Date.now()) {
  responseCache.forEach((entry, key) => {
    if (entry.expiresAt <= now) responseCache.delete(key)
  })
}

function storeCachedResponse(key: string, entry: CacheEntry) {
  pruneExpiredCache()
  responseCache.delete(key)
  while (responseCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = responseCache.keys().next().value
    if (oldestKey === undefined) break
    responseCache.delete(oldestKey)
  }
  responseCache.set(key, entry)
}

function readCachedResponse<T>(key: string): T | undefined {
  const entry = responseCache.get(key)
  if (!entry) return undefined
  if (entry.expiresAt <= Date.now()) {
    responseCache.delete(key)
    return undefined
  }

  // Mantiene el Map ordenado por uso para que el límite funcione como LRU.
  responseCache.delete(key)
  responseCache.set(key, entry)
  return entry.value as T
}

function snapshotTagVersions(tags: ReadonlySet<string>) {
  return new Map(Array.from(tags, (tag) => [tag, tagVersions.get(tag) ?? 0]))
}

function tagsRemainCurrent(snapshot: ReadonlyMap<string, number>) {
  return Array.from(snapshot).every(([tag, version]) => (tagVersions.get(tag) ?? 0) === version)
}

function invalidateCacheTags(tags: readonly string[]) {
  if (tags.length === 0) return
  const invalidated = new Set(tags)
  invalidated.forEach((tag) => tagVersions.set(tag, (tagVersions.get(tag) ?? 0) + 1))

  responseCache.forEach((entry, key) => {
    if (Array.from(entry.tags).some((tag) => invalidated.has(tag))) responseCache.delete(key)
  })
  pendingGets.forEach((entry, key) => {
    if (Array.from(entry.tags).some((tag) => invalidated.has(tag))) pendingGets.delete(key)
  })
}

function clearResponseCache() {
  cacheGeneration += 1
  responseCache.clear()
  pendingGets.clear()
  tagVersions.clear()
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
    const error = new ApiError(res.status, body.error || body.message || `Error ${res.status}`)
    if (res.status === 401) clearResponseCache()
    throw error
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
  get<T>(path: string, options?: GetRequestOptions): Promise<T> {
    const url = `${API_URL}${path}`
    const {
      cacheTtlMs = 0,
      cacheTags = [],
      forceRefresh = false,
      timeoutMs = GET_TIMEOUT_MS,
      ...fetchOptions
    } = options ?? {}
    const canShare = !fetchOptions.signal && !fetchOptions.headers
    const key = cacheKey(url)
    const tags = new Set(cacheTags)

    if (canShare && cacheTtlMs > 0 && !forceRefresh) {
      const cached = readCachedResponse<T>(key)
      if (cached !== undefined) return Promise.resolve(cached)
    }

    const existing = canShare ? pendingGets.get(key) : undefined
    if (existing) return existing.promise as Promise<T>

    const requestGeneration = cacheGeneration
    const tagSnapshot = snapshotTagVersions(tags)

    const request = (async () => {
      const controller = new AbortController()
      const externalSignal = fetchOptions.signal
      let timedOut = false
      const abortFromExternalSignal = () => controller.abort(externalSignal?.reason)
      externalSignal?.addEventListener('abort', abortFromExternalSignal, { once: true })
      if (externalSignal?.aborted) abortFromExternalSignal()

      const timeoutId = window.setTimeout(() => {
        timedOut = true
        controller.abort()
      }, timeoutMs)

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
        })
        const value = await handleResponse<T>(response)
        if (
          canShare &&
          cacheTtlMs > 0 &&
          requestGeneration === cacheGeneration &&
          tagsRemainCurrent(tagSnapshot)
        ) {
          storeCachedResponse(key, {
            value,
            expiresAt: Date.now() + cacheTtlMs,
            tags,
          })
        }
        return value
      } catch (error) {
        if (timedOut) throw new ApiError(408, 'La solicitud tardó demasiado')
        throw error
      } finally {
        window.clearTimeout(timeoutId)
        externalSignal?.removeEventListener('abort', abortFromExternalSignal)
      }
    })()

    if (canShare) {
      const pending = { promise: request, tags }
      pendingGets.set(key, pending)
      void request.finally(() => {
        if (pendingGets.get(key) === pending) pendingGets.delete(key)
      }).catch(() => undefined)
    }

    return request
  },

  /**
   * Petición POST.
   * @param path - Ruta relativa al base URL.
   * @param body - Cuerpo de la petición.
   * @param options - Opciones adicionales de fetch.
   */
  post<T>(path: string, body?: unknown, options?: MutationRequestOptions): Promise<T> {
    const { invalidateCacheTags: tags = [], clearResponseCache: clear = false, ...fetchOptions } = options ?? {}
    return fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...fetchOptions.headers },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>).then((value) => {
      if (clear) clearResponseCache()
      else invalidateCacheTags(tags)
      return value
    })
  },

  /**
   * Petición PATCH.
   * @param path - Ruta relativa al base URL.
   * @param body - Cuerpo de la petición.
   * @param options - Opciones adicionales de fetch.
   */
  patch<T>(path: string, body?: unknown, options?: MutationRequestOptions): Promise<T> {
    const { invalidateCacheTags: tags = [], clearResponseCache: clear = false, ...fetchOptions } = options ?? {}
    return fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...fetchOptions.headers },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>).then((value) => {
      if (clear) clearResponseCache()
      else invalidateCacheTags(tags)
      return value
    })
  },

  /**
   * Petición PUT.
   * @param path - Ruta relativa al base URL.
   * @param body - Cuerpo de la petición.
   * @param options - Opciones adicionales de fetch.
   */
  put<T>(path: string, body?: unknown, options?: MutationRequestOptions): Promise<T> {
    const { invalidateCacheTags: tags = [], clearResponseCache: clear = false, ...fetchOptions } = options ?? {}
    return fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...fetchOptions.headers },
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>).then((value) => {
      if (clear) clearResponseCache()
      else invalidateCacheTags(tags)
      return value
    })
  },

  /**
   * Petición DELETE.
   * @param path - Ruta relativa al base URL.
   * @param options - Opciones adicionales de fetch.
   */
  delete<T>(path: string, options?: MutationRequestOptions): Promise<T> {
    const { invalidateCacheTags: tags = [], clearResponseCache: clear = false, ...fetchOptions } = options ?? {}
    return fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...fetchOptions.headers },
    }).then(handleResponse<T>).then((value) => {
      if (clear) clearResponseCache()
      else invalidateCacheTags(tags)
      return value
    })
  },

  /** Invalida respuestas relacionadas sin afectar el resto de la sesión. */
  invalidateCache(...tags: string[]) {
    invalidateCacheTags(tags)
  },

  /** Vacía respuestas y solicitudes compartidas; úsalo al cambiar de sesión. */
  clearCache() {
    clearResponseCache()
  },
}
