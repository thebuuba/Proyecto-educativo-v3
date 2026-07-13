type CachedValue = {
  kind: 'value'
  value: unknown
  expiresAt: number
}

type PendingValue = {
  kind: 'pending'
  promise: Promise<unknown>
  expiresAt: number
}

type CacheEntry = CachedValue | PendingValue

type TtlMemoryCacheOptions = {
  ttlMs?: number
  maxEntries?: number
}

/**
 * Caché TTL local y acotada para lecturas repetidas dentro de una instancia.
 * También comparte la promesa de una carga en curso para evitar consultas
 * idénticas concurrentes.
 */
export class TtlMemoryCache {
  private readonly entries = new Map<string, CacheEntry>()
  private readonly ttlMs: number
  private readonly maxEntries: number

  constructor(options: TtlMemoryCacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? 60_000
    this.maxEntries = Math.max(1, options.maxEntries ?? 100)
  }

  withCache<T>(key: string, loader: () => Promise<T>, ttlMs = this.ttlMs): Promise<T> {
    const now = Date.now()
    const entry = this.entries.get(key)

    if (entry && entry.expiresAt > now) {
      if (entry.kind === 'pending') return entry.promise as Promise<T>
      return Promise.resolve(entry.value as T)
    }

    if (entry) this.entries.delete(key)
    this.pruneExpired(now)
    this.evictOldestIfFull()

    let loaded: Promise<T>
    try {
      loaded = loader()
    } catch (error) {
      return Promise.reject(error)
    }

    const promise = loaded.then(
      (value) => {
        const current = this.entries.get(key)
        if (current?.kind === 'pending' && current.promise === promise) {
          this.entries.delete(key)
          this.entries.set(key, {
            kind: 'value',
            value,
            expiresAt: Date.now() + ttlMs,
          })
        }
        return value
      },
      (error) => {
        const current = this.entries.get(key)
        if (current?.kind === 'pending' && current.promise === promise) {
          this.entries.delete(key)
        }
        throw error
      },
    )

    this.entries.set(key, {
      kind: 'pending',
      promise,
      expiresAt: now + ttlMs,
    })
    return promise
  }

  invalidate(key: string) {
    this.entries.delete(key)
  }

  invalidatePrefix(prefix: string) {
    for (const key of this.entries.keys()) {
      if (key.startsWith(prefix)) this.entries.delete(key)
    }
  }

  clear() {
    this.entries.clear()
  }

  private pruneExpired(now: number) {
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) this.entries.delete(key)
    }
  }

  private evictOldestIfFull() {
    if (this.entries.size < this.maxEntries) return

    const settledKey = Array.from(this.entries).find(([, entry]) => entry.kind === 'value')?.[0]
    const oldestKey = settledKey ?? this.entries.keys().next().value
    if (oldestKey !== undefined) this.entries.delete(oldestKey)
  }
}
