/**
 * @fileoverview Script de seed para poblar la base de datos con datos
 * iniciales (roles, permisos, catálogos RD).
 */

import { prisma } from './index.js'

const seedAdminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@test.com'
const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD

async function getAuthUserIdByEmail(email: string) {
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    select id::text as id
    from auth.users
    where email = ${email}
    limit 1
  `

  return rows[0]?.id ?? null
}

async function createAuthUser(email: string, password: string) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to seed an admin user.')
  }

  const response = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Admin Aula Base' },
    }),
  })

  if (!response.ok) {
    throw new Error(`Could not create Supabase Auth seed user: ${response.status} ${await response.text()}`)
  }

  const user = await response.json() as { id?: string }
  if (!user.id) throw new Error('Supabase Auth seed user response did not include an id.')
  return user.id
}

async function getOrCreateSeedAdminAuthUser() {
  const existingId = await getAuthUserIdByEmail(seedAdminEmail)
  if (existingId) return existingId

  if (!seedAdminPassword) {
    console.log('Skipped admin user seed: set SEED_ADMIN_PASSWORD to create one.')
    return null
  }

  return createAuthUser(seedAdminEmail, seedAdminPassword)
}

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

  const authUserId = await getOrCreateSeedAdminAuthUser()
  if (!authUserId) {
    console.log('Seeded:', school.name, '| Admin: skipped')
    return
  }

  const adminUser = await prisma.appUser.upsert({
    where: { email: seedAdminEmail },
    update: { authUserId, schoolId: school.id },
    create: {
      authUserId,
      email: seedAdminEmail,
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
