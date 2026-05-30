import { prisma } from './index.js'

async function main() {
  const school = await prisma.school.upsert({
    where: { slug: 'aula-base' },
    update: {},
    create: {
      name: 'Aula Base',
      slug: 'aula-base',
    },
  })

  console.log('Seeded:', school.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
