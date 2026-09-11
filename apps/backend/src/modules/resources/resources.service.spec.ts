import { describe, expect, it, vi } from 'vitest'
vi.mock('@aula/database', () => ({ prisma: {} }))
import { RESOURCE_UPLOAD_LIMIT_BYTES, SUBJECT_STORAGE_LIMIT_BYTES, validateResourceUrl } from './resources.service'

describe('ResourcesService security rules', () => {
  it('accepts only web links', () => {
    expect(validateResourceUrl('https://example.com/material')).toBe('https://example.com/material')
    expect(() => validateResourceUrl('javascript:alert(1)')).toThrow('HTTP o HTTPS')
  })

  it('keeps the upload ceiling at 25 MB', () => {
    expect(RESOURCE_UPLOAD_LIMIT_BYTES).toBe(25 * 1024 * 1024)
    expect(SUBJECT_STORAGE_LIMIT_BYTES).toBe(500 * 1024 * 1024)
  })
})
