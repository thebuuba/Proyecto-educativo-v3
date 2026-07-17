import { describe, expect, it } from 'vitest'
import { isAllowedOrigin } from './cors-origins'

const config = {
  frontendUrl: 'https://app.aulabase.example',
}

describe('CORS origins', () => {
  it('allows only the configured frontend origin', () => {
    expect(isAllowedOrigin(config.frontendUrl, config)).toBe(true)
    expect(isAllowedOrigin('https://otro.example', config)).toBe(false)
  })

  it('allows the configured local development origin', () => {
    expect(isAllowedOrigin('http://localhost:5173', { frontendUrl: 'http://localhost:5173' })).toBe(true)
  })
})
