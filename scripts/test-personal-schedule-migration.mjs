import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

// Disposable Postgres, no host ports, credentials, or application database access.
const container = `aulabase-schedule-test-${process.pid}`
const root = new URL('../', import.meta.url)
const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
const sql = (source) => execFileSync('docker', ['exec', '-i', container, 'psql', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1'], {
  input: source, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
})

try {
  docker('run', '--rm', '--detach', '--name', container, '-e', 'POSTGRES_HOST_AUTH_METHOD=trust', 'postgres:17-alpine')
  for (let attempt = 0; ; attempt++) {
    try {
      docker('exec', container, 'pg_isready', '-U', 'postgres')
      break
    } catch (error) {
      if (attempt === 30) throw error
      await setTimeout(500)
    }
  }
  for (const path of [
    'scripts/tests/fixtures/personal_schedule_legacy.sql',
    'supabase/migrations/20261020132243_personal_teacher_schedule.sql',
    'scripts/tests/fixtures/personal_schedule_ownership.sql',
  ]) {
    sql(readFileSync(fileURLToPath(new URL(path, root)), 'utf8'))
  }
  console.log('PASS: legacy assignment, independent structures, ambiguous-data preservation, owner RLS and foreign-reference rejection')
} catch (error) {
  process.stderr.write(error.stderr?.toString() || error.message)
  process.exitCode = 1
} finally {
  try { docker('rm', '--force', container) } catch { /* Already removed after a failed startup. */ }
}
