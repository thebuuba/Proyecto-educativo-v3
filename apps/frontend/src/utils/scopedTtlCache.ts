type CacheEntry<T> = {
  data: T
  timestamp: number
}

/** Crea una caché en memoria con TTL, aislada por ámbito de usuario/colegio. */
export function createScopedTtlCache<T>(ttlMs: number) {
  const entries = new Map<string, CacheEntry<T>>()

  return {
    read(scope: string | null): T | null {
      if (!scope) return null
      const entry = entries.get(scope)
      if (!entry) return null
      if (Date.now() - entry.timestamp >= ttlMs) {
        entries.delete(scope)
        return null
      }
      return entry.data
    },

    write(scope: string | null, data: T) {
      if (!scope) return
      entries.set(scope, { data, timestamp: Date.now() })
    },

    update(scope: string | null, update: (data: T) => T) {
      if (!scope) return
      const entry = entries.get(scope)
      if (!entry) return
      entries.set(scope, { ...entry, data: update(entry.data) })
    },

    clear(scope: string | null) {
      if (scope) entries.delete(scope)
    },
  }
}
