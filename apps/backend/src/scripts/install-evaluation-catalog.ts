import { prisma } from '@aula/database'
import { seedEvaluationCatalog } from '../modules/evaluation-instruments/catalog-operations'

async function install() {
  const result = await seedEvaluationCatalog(prisma)
  console.log(`Catálogo evaluativo: ${result === 'CREATED' ? 'instalado' : 'ya estaba instalado y es válido'}.`)
}

install()
  .catch((error) => {
    console.error('No se pudo instalar el catálogo evaluativo.', error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
