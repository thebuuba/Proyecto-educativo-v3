import { describe, expect, it } from 'vitest'
import { assertEvaluationCatalogTarget } from './catalog-target'

describe('protección del destino del catálogo evaluativo', () => {
  const ref = 'eolgunypmtgrsyrjzcld'

  it('acepta conexión directa o pooler solamente si ambos destinos corresponden al proyecto esperado', () => {
    expect(() => assertEvaluationCatalogTarget(ref, { SUPABASE_URL: `https://${ref}.supabase.co`, DATABASE_URL: `postgresql://postgres:secret@db.${ref}.supabase.co:5432/postgres` })).not.toThrow()
    expect(() => assertEvaluationCatalogTarget(ref, { SUPABASE_URL: `https://${ref}.supabase.co`, DATABASE_URL: `postgresql://postgres.${ref}:secret@aws-0-us-east-1.pooler.supabase.com:6543/postgres` })).not.toThrow()
  })

  it('rechaza una DATABASE_URL de otro proyecto aunque SUPABASE_URL sea correcta', () => {
    expect(() => assertEvaluationCatalogTarget(ref, { SUPABASE_URL: `https://${ref}.supabase.co`, DATABASE_URL: 'postgresql://postgres.otroproyecto:secret@aws-0-us-east-1.pooler.supabase.com:6543/postgres' })).toThrow('DATABASE_URL')
  })
})
