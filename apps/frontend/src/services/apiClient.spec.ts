import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from './apiClient'

describe('api client session transport', () => {
  beforeEach(() => {
    vi.useRealTimers()
    api.clearCache()
    localStorage.setItem('auth_token', 'legacy-token-that-must-not-be-used')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: { ok: true } }),
    }))
  })

  it('never exposes a legacy localStorage token as an authorization header', async () => {
    await api.get('/profile')

    expect(fetch).toHaveBeenCalledWith('/api/v1/profile', expect.objectContaining({
      credentials: 'include',
      headers: expect.not.objectContaining({ Authorization: expect.anything() }),
    }))
  })

  it('uses cookie credentials for state-changing requests', async () => {
    await api.post('/auth/logout')

    expect(fetch).toHaveBeenCalledWith('/api/v1/auth/logout', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }))
  })

  it('deduplicates concurrent GET requests to the same resource', async () => {
    let resolveResponse!: (response: Response) => void
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((resolve) => {
      resolveResponse = resolve
    })))

    const first = api.get('/school-years')
    const second = api.get('/school-years')

    expect(fetch).toHaveBeenCalledTimes(1)
    resolveResponse({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: [] }),
    } as unknown as Response)
    await expect(Promise.all([first, second])).resolves.toEqual([[], []])
  })

  it('aborts a GET that exceeds its timeout with a clear error', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_input, init) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })))

    const request = api.get('/slow-resource', { timeoutMs: 1_000 })
    const rejection = expect(request).rejects.toMatchObject({
      status: 408,
      message: 'La solicitud tardó demasiado',
    })

    await vi.advanceTimersByTimeAsync(1_000)
    await rejection
  })

  it('reuses an opt-in GET response while its TTL is valid', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: [{ id: 'section-1' }] }),
    } as unknown as Response)

    const first = await api.get('/schedule/sections', {
      cacheTtlMs: 60_000,
      cacheTags: ['course-options'],
    })
    const second = await api.get('/schedule/sections', {
      cacheTtlMs: 60_000,
      cacheTags: ['course-options'],
    })

    expect(first).toEqual([{ id: 'section-1' }])
    expect(second).toEqual(first)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('refreshes an expired response and replaces it when forceRefresh is used', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-13T12:00:00Z'))
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { version: 1 } }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { version: 2 } }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { version: 3 } }),
      } as unknown as Response)

    await expect(api.get('/schedule/subjects', { cacheTtlMs: 1_000 })).resolves.toEqual({ version: 1 })
    await expect(api.get('/schedule/subjects', {
      cacheTtlMs: 1_000,
      forceRefresh: true,
    })).resolves.toEqual({ version: 2 })
    await expect(api.get('/schedule/subjects', { cacheTtlMs: 1_000 })).resolves.toEqual({ version: 2 })

    vi.advanceTimersByTime(1_001)
    await expect(api.get('/schedule/subjects', { cacheTtlMs: 1_000 })).resolves.toEqual({ version: 3 })
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('invalidates tagged responses only after a successful mutation', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: ['old'] }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: { id: 'section-2' } }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: ['new'] }),
      } as unknown as Response)

    await api.get('/schedule/sections', {
      cacheTtlMs: 60_000,
      cacheTags: ['course-options'],
    })
    await api.post('/courses/sections', {}, {
      invalidateCacheTags: ['course-options'],
    })

    await expect(api.get('/schedule/sections', {
      cacheTtlMs: 60_000,
      cacheTags: ['course-options'],
    })).resolves.toEqual(['new'])
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('keeps tagged responses when a mutation fails', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: ['cached'] }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({ message: 'Mutation failed' }),
      } as unknown as Response)

    const options = {
      cacheTtlMs: 60_000,
      cacheTags: ['enrollment-options'],
    }
    await api.get('/attendance/courses', options)
    await expect(api.post('/students/enrollments', {}, {
      invalidateCacheTags: ['enrollment-options'],
    })).rejects.toMatchObject({ status: 500 })

    await expect(api.get('/attendance/courses', options)).resolves.toEqual(['cached'])
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('does not repopulate the cache with a response from a previous generation', async () => {
    let resolveOldResponse!: (response: Response) => void
    vi.stubGlobal('fetch', vi.fn()
      .mockImplementationOnce(() => new Promise<Response>((resolve) => {
        resolveOldResponse = resolve
      }))
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: ['current-session'] }),
      } as unknown as Response))

    const oldRequest = api.get('/school-administration/school-years', {
      cacheTtlMs: 60_000,
      cacheTags: ['school-years'],
    })
    api.clearCache()
    resolveOldResponse({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: ['old-session'] }),
    } as unknown as Response)
    await expect(oldRequest).resolves.toEqual(['old-session'])

    await expect(api.get('/school-administration/school-years', {
      cacheTtlMs: 60_000,
      cacheTags: ['school-years'],
    })).resolves.toEqual(['current-session'])
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('clears cached session data after a 401 response', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: ['first-session'] }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ message: 'Unauthorized' }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ data: ['second-session'] }),
      } as unknown as Response)

    const options = { cacheTtlMs: 60_000, cacheTags: ['school-years'] }
    await api.get('/school-administration/school-years', options)
    await expect(api.get('/auth/bootstrap')).rejects.toMatchObject({ status: 401 })
    await expect(api.get('/school-administration/school-years', options)).resolves.toEqual(['second-session'])
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('bounds the response cache and evicts the least recently used entry', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => ({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: String(input) }),
    } as unknown as Response))

    for (let index = 0; index < 100; index += 1) {
      await api.get(`/options/${index}`, { cacheTtlMs: 60_000 })
    }
    await api.get('/options/0', { cacheTtlMs: 60_000 })
    await api.get('/options/100', { cacheTtlMs: 60_000 })
    await api.get('/options/1', { cacheTtlMs: 60_000 })

    expect(fetch).toHaveBeenCalledTimes(102)
  })
})
