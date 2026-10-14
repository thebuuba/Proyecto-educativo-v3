import { describe, expect, it } from 'vitest'
import { assertExistingSeedIdentity, seedConfiguration } from '../../../../packages/database/src/seed-config'
import { seedCsvPath } from '../../../../packages/database/src/seed-csv-path'

const local = { SEED_BOOTSTRAP_ADMIN: 'true', SUPABASE_URL: 'http://127.0.0.1:54321', DATABASE_URL: 'postgresql://local:local@127.0.0.1:54322/postgres', SUPABASE_SERVICE_ROLE_KEY: 'only-a-test-key', SEED_ADMIN_EMAIL: 'admin@example.invalid', SEED_ADMIN_PASSWORD: 'test-password-only-123', SEED_ADMIN_NAME: 'Administrador QA', SEED_SCHOOL_NAME: 'Centro QA', SEED_SCHOOL_SLUG: 'centro-qa' }

describe('inicialización segura y rutas portables', () => {
  it('no activa el seed por defecto', () => expect(seedConfiguration({})).toBeNull())
  it.each(['SEED_ADMIN_EMAIL', 'SEED_ADMIN_PASSWORD', 'SEED_ADMIN_NAME', 'SEED_SCHOOL_NAME', 'SEED_SCHOOL_SLUG'])('exige %s', (key) => {
    expect(() => seedConfiguration({ ...local, [key]: undefined })).toThrow()
  })
  it('rechaza producción y proyectos remotos aun sin NODE_ENV', () => {
    expect(() => seedConfiguration({ ...local, NODE_ENV: 'production' })).toThrow()
    expect(() => seedConfiguration({ ...local, SUPABASE_URL: 'https://project.supabase.co' })).toThrow()
    expect(() => seedConfiguration({ ...local, DATABASE_URL: 'postgresql://user:pass@db.example.com/db' })).toThrow()
  })
  it('acepta solamente la configuración local explícita', () => expect(seedConfiguration(local)?.schoolSlug).toBe('centro-qa'))
  it('no promueve ni reasigna identidades existentes', () => {
    const user = { schoolId: 'school', authUserId: 'auth', status: 'ACTIVE' }
    expect(() => assertExistingSeedIdentity(user, 'school', 'auth', false)).toThrow()
    expect(() => assertExistingSeedIdentity(user, 'other-school', 'auth', true)).toThrow()
    expect(() => assertExistingSeedIdentity(user, 'school', 'other-auth', true)).toThrow()
    expect(() => assertExistingSeedIdentity(null, 'school', 'auth', true)).toThrow()
    expect(() => assertExistingSeedIdentity(user, 'school', 'auth', true)).not.toThrow()
  })
  it('exige la ruta CSV y permite sobrescribirla desde el comando', () => {
    expect(() => seedCsvPath('SCHOOLS_CSV_PATH', {}, [])).toThrow()
    expect(seedCsvPath('SCHOOLS_CSV_PATH', { SCHOOLS_CSV_PATH: 'other.csv' }, ['--csv', 'schools.csv'])).toMatch(/schools\.csv$/)
    expect(() => seedCsvPath('SCHOOLS_CSV_PATH', {}, ['--csv'])).toThrow()
  })
})
