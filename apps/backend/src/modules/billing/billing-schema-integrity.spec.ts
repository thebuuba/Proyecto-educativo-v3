import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(process.cwd(), '../..')
const migration = readFileSync(resolve(root, 'supabase/migrations/20261015143145_billing_runtime_integrity.sql'), 'utf8')
const schema = readFileSync(resolve(root, 'packages/database/prisma/schema.prisma'), 'utf8')
const types = readFileSync(resolve(root, 'apps/frontend/src/types/database.types.ts'), 'utf8')
const constraints = [...migration.matchAll(/alter table public\.(\w+) add constraint (\w+)\s+foreign key \(([^)]+)\) references public\.(\w+)\(([^)]+)\)/gi)]
describe('metadatos de las referencias compuestas comerciales', () => {
  it('la migración contiene las diez referencias de propietario y plan', () => expect(constraints).toHaveLength(10))
  for (const [, table, name, columns, target, targetColumns] of constraints) it(name, () => {
    const model = [...schema.matchAll(/^model \w+ \{([\s\S]*?)^\}/gm)].find(([, body]) => body.includes(`@@map("${table}")`))?.[1]
    const relation = model?.split('\n').find(line => line.includes(`map: "${name}"`))
    expect(relation, `${name} no está representada en Prisma`).toBeDefined()
    const fields = relation!.match(/fields: \[([^\]]+)\]/)![1].split(',').map(s => s.trim())
    const dbFields = fields.map(field => model!.match(new RegExp('\\n\\s+' + field + '\\s+[^\\n]+@map\\("([^"\\n]+)"\\)'))?.[1] ?? field)
    expect(dbFields).toEqual(columns.split(',').map(s => s.trim()))
    const frontend = types.split('\n').find(line => line.includes(`foreignKeyName: "${name}"`))
    expect(frontend, `${name} no está representada en los tipos públicos`).toBeDefined()
    expect(frontend).toContain(`columns: [${columns.split(',').map(s => `"${s.trim()}"`).join(', ')}]`)
    expect(frontend).toContain(`referencedRelation: "${target}"`)
    expect(frontend).toContain(`referencedColumns: [${targetColumns.split(',').map(s => `"${s.trim()}"`).join(', ')}]`)
  })
})
