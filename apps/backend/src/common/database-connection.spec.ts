import { describe, expect, it } from 'vitest'
import { databaseUrlForPg } from '@aula/database'

describe('databaseUrlForPg', () => {
  it('uses standard PostgreSQL TLS semantics for sslmode=require', () => {
    const url = databaseUrlForPg('postgresql://user:password@db.example.com/postgres?sslmode=require')

    expect(new URL(url).searchParams.get('uselibpqcompat')).toBe('true')
  })
})
