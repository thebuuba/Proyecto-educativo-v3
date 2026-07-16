/** Comparte únicamente cargas simultáneas; no conserva datos entre peticiones. */
export class TtlMemoryCache {
  private readonly pending = new Map<string, Promise<unknown>>()

  withCache<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const existing = this.pending.get(key)
    if (existing) return existing as Promise<T>

    let loaded: Promise<T>
    try {
      loaded = loader()
    } catch (error) {
      return Promise.reject(error)
    }

    const promise = loaded.finally(() => {
      if (this.pending.get(key) === promise) this.pending.delete(key)
    })
    this.pending.set(key, promise)
    return promise
  }

  invalidate(key: string) {
    this.pending.delete(key)
  }

  invalidatePrefix(prefix: string) {
    for (const key of this.pending.keys()) {
      if (key.startsWith(prefix)) this.pending.delete(key)
    }
  }

  clear() {
    this.pending.clear()
  }
}
