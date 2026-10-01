import { createRequire } from 'node:module'
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const url = new URL(process.env.DATABASE_URL ?? 'http://missing')
if (!['localhost', '127.0.0.1'].includes(url.hostname) || url.port !== '54332') throw new Error('Solo PostgreSQL local explícito en puerto 54332; no se cargan archivos .env.')
const { prisma } = require('@aula/database')
const { seedEvaluationCatalog, synchronizeCurriculumMappings } = require('./dist/modules/evaluation-instruments/catalog-operations.js')
try {
  console.log(JSON.stringify({ catalog: await seedEvaluationCatalog(prisma) }))
  const [schoolId, ...versionIds] = process.argv.slice(2)
  if (schoolId) console.log(JSON.stringify({ mappings: await synchronizeCurriculumMappings(prisma, schoolId, versionIds) }, null, 2))
} finally { await prisma.$disconnect() }
