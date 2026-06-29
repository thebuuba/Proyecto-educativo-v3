import { describe, expect, it } from 'vitest'
import { backendEnvFilePaths } from './env-file-paths'

describe('backendEnvFilePaths', () => {
  it('loads the backend env file when the server starts from the repo root', () => {
    expect(backendEnvFilePaths).toEqual(['apps/backend/.env', '.env'])
  })
})
