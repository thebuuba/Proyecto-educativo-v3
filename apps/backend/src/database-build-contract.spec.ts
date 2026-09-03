import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('database package build contract', () => {
  it('generates Prisma Client from the workspace schema after a clean install', () => {
    const packagePath = resolve(process.cwd(), '../../packages/database/package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8')) as {
      scripts?: Record<string, string>
    }

    expect(packageJson.scripts?.postinstall).toBe('prisma generate --schema prisma/schema.prisma')
  })
})
