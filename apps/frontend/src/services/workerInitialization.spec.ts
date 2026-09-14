import { describe, expect, it, vi } from 'vitest'

import { initializeWithRetry } from '../../../../cloudflare/workerInitialization'

describe('initializeWithRetry', () => {
  it('retries one failed Worker initialization', async () => {
    const initialize = vi.fn()
      .mockRejectedValueOnce(new Error('temporary startup failure'))
      .mockResolvedValueOnce(undefined)

    await expect(initializeWithRetry(initialize)).resolves.toBeUndefined()
    expect(initialize).toHaveBeenCalledTimes(2)
  })

  it('returns the second initialization error when recovery also fails', async () => {
    const initialize = vi.fn().mockRejectedValue(new Error('persistent startup failure'))

    await expect(initializeWithRetry(initialize)).rejects.toThrow('persistent startup failure')
    expect(initialize).toHaveBeenCalledTimes(2)
  })
})
