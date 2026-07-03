/**
 * @fileoverview Script de seed para poblar la base de datos con datos
 * iniciales (roles, permisos, catálogos RD).
 */

import { prisma } from './index.js'

/**
 * @description Función principal del seed. Crea un centro educativo por
 * defecto, el rol de administrador, y un usuario admin de prueba.
 */
async function main() {
  const school = await prisma.school.upsert({
    where: { slug: 'aula-base' },
    update: {},
    create: {
      name: 'Aula Base',
      slug: 'aula-base',
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { key: 'admin' },
    update: {},
    create: { key: 'admin', name: 'Administrador' },
  })

  const adminUser = await prisma.appUser.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      authUserId: crypto.randomUUID(),
      email: 'admin@test.com',
      fullName: 'Admin Aula Base',
      schoolId: school.id,
    },
  })

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id, schoolId: school.id },
  })

  console.log('Seeded:', school.name, '| Admin:', adminUser.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
