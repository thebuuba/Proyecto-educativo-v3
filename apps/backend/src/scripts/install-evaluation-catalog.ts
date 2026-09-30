import { prisma } from '@aula/database'
import { seedEvaluationCatalog } from '../modules/evaluation-instruments/catalog-operations'

function assertExpectedProject() {
  const expected = process.argv.find((argument) => argument.startsWith('--expected-project-ref='))?.split('=')[1]
  if (!expected) throw new Error('Falta --expected-project-ref. La instalación requiere identificar explícitamente el entorno de destino.')
  const supabaseUrl = new URL(process.env.SUPABASE_URL ?? 'http://missing')
  if (supabaseUrl.hostname !== `${expected}.supabase.co`) {
    throw new Error(`El destino configurado no corresponde al proyecto esperado ${expected}; no se realizaron cambios.`)
  }
}

async function install() {
  assertExpectedProject()
  const result = await seedEvaluationCatalog(prisma)
  console.log(`Catálogo evaluativo: ${result === 'CREATED' ? 'instalado' : 'ya estaba instalado y es válido'}.`)
}

install()
  .catch((error) => {
    console.error('No se pudo instalar el catálogo evaluativo.', error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
