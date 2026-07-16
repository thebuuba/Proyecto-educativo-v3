import { describe, expect, it, vi } from 'vitest'
import { TtlMemoryCache } from './ttl-memory-cache'

describe('TtlMemoryCache', () => {
  it('deduplicates concurrent loads without retaining settled data', async () => {
    const cache = new TtlMemoryCache()
    let resolve!: (value: string) => void
    const loader = vi.fn(() => new Promise<string>((done) => {
      resolve = done
    }))

    const first = cache.withCache('options:school-1', loader)
    const second = cache.withCache('options:school-1', loader)
    await Promise.resolve()

    expect(loader).toHaveBeenCalledTimes(1)
    expect(second).toBe(first)

    resolve('cached')
    await expect(Promise.all([first, second])).resolves.toEqual(['cached', 'cached'])
    const freshLoader = vi.fn().mockResolvedValue('fresh')
    await expect(cache.withCache('options:school-1', freshLoader)).resolves.toBe('fresh')
    expect(freshLoader).toHaveBeenCalledTimes(1)
  })

  it('does not let an invalidated pending load repopulate stale data', async () => {
    const cache = new TtlMemoryCache()
    let resolve!: (value: string) => void
    const staleLoader = vi.fn(() => new Promise<string>((done) => {
      resolve = done
    }))

    const pending = cache.withCache('options:school-1', staleLoader)
    await Promise.resolve()
    cache.invalidate('options:school-1')
    resolve('stale')
    await expect(pending).resolves.toBe('stale')

    const freshLoader = vi.fn().mockResolvedValue('fresh')
    await expect(cache.withCache('options:school-1', freshLoader)).resolves.toBe('fresh')
    expect(freshLoader).toHaveBeenCalledTimes(1)
  })

  it('keeps concurrent tenant keys isolated', async () => {
    const cache = new TtlMemoryCache()
    const schoolOneLoader = vi.fn().mockResolvedValue('school-1')
    const schoolTwoLoader = vi.fn().mockResolvedValue('school-2')

    await expect(cache.withCache('options:school-1', schoolOneLoader)).resolves.toBe('school-1')
    await expect(cache.withCache('options:school-2', schoolTwoLoader)).resolves.toBe('school-2')
    expect(schoolOneLoader).toHaveBeenCalledTimes(1)
    expect(schoolTwoLoader).toHaveBeenCalledTimes(1)
  })
})
