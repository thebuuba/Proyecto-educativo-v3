import { prisma } from '@aula/database'
import { diagnoseEvaluationCatalog } from '../modules/evaluation-instruments/catalog-operations'

function safeTarget() {
  const databaseUrl = new URL(process.env.DATABASE_URL ?? 'http://missing')
  const supabaseUrl = new URL(process.env.SUPABASE_URL ?? 'http://missing')
  return {
    databaseHost: databaseUrl.hostname,
    databasePort: databaseUrl.port || 'default',
    databaseName: databaseUrl.pathname.replace(/^\//, '') || 'unknown',
    supabaseProject: supabaseUrl.hostname.replace(/\.supabase\.co$/, ''),
  }
}

async function diagnose() {
  const target = safeTarget()
  try {
    const catalog = await diagnoseEvaluationCatalog(prisma)
    const installedVersions = (await prisma.evaluationCatalogRelease.findMany({ select: { version: true }, orderBy: { version: 'asc' } }))
      .map(({ version }) => version)
    console.log(JSON.stringify({ target, table: 'AVAILABLE', catalog, installedVersions }, null, 2))
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : 'UNKNOWN'
    console.log(JSON.stringify({ target, table: code === 'P2021' ? 'MISSING' : 'ERROR', errorCode: code }, null, 2))
    process.exitCode = 1
  }
}

diagnose().finally(() => prisma.$disconnect())
