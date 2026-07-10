import { describe, expect, it } from 'vitest'
import { isAllowedOrigin } from './cors-origins'

const config = {
  frontendUrl: 'https://proyecto-educativo-v3-frontend.vercel.app',
  vercelProjectSlug: 'proyecto-educativo-v3-frontend',
  vercelTeamSlug: 'proyecto-educativo-a',
}

describe('CORS origins', () => {
  it('allows production and this project preview deployments', () => {
    expect(isAllowedOrigin(config.frontendUrl, config)).toBe(true)
    expect(isAllowedOrigin(
      'https://proyecto-educativo-v3-frontend-b3evaky9o-proyecto-educativo-a.vercel.app',
      config,
    )).toBe(true)
  })

  it('rejects lookalike and unrelated Vercel deployments', () => {
    expect(isAllowedOrigin('https://evil.vercel.app', config)).toBe(false)
    expect(isAllowedOrigin(
      'https://proyecto-educativo-v3-frontend-attack-other-team.vercel.app',
      config,
    )).toBe(false)
    expect(isAllowedOrigin('https://proyecto-educativo-v3-frontend.vercel.app.evil.com', config)).toBe(false)
  })

  it('allows the configured local development origin', () => {
    expect(isAllowedOrigin('http://localhost:5173', { frontendUrl: 'http://localhost:5173' })).toBe(true)
  })
})
