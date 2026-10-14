/** Inicialización de un administrador local, explícita y sin datos de prueba implícitos. */
import { prisma } from './index.js'
import { assertExistingSeedIdentity, seedConfiguration, type SeedConfiguration } from './seed-config.js'

async function createAuthUser(config: SeedConfiguration) {
  const response = await fetch(`${config.supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { apikey: config.serviceKey, authorization: `Bearer ${config.serviceKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ email: config.email, password: config.password, email_confirm: true, user_metadata: { full_name: config.fullName } }),
  })
  if (!response.ok) throw new Error(`No se pudo crear la identidad local: HTTP ${response.status}.`)
  const identity = await response.json() as { id?: string }
  if (!identity.id) throw new Error('Supabase no devolvió el identificador del usuario.')
  return identity.id
}

async function main() {
  const config = seedConfiguration()
  if (!config) {
    console.log('Administrador omitido: requiere SEED_BOOTSTRAP_ADMIN=true y configuración local explícita.')
    return
  }
  try {
    const [school, user, identities] = await Promise.all([
      prisma.school.findUnique({ where: { slug: config.schoolSlug } }),
      prisma.appUser.findUnique({ where: { email: config.email } }),
      prisma.$queryRaw<Array<{ id: string }>>`select id::text as id from auth.users where lower(email) = ${config.email} limit 1`,
    ])
    if (school && school.name !== config.schoolName) throw new Error('El slug pertenece a un centro con un nombre diferente.')
    const authId = identities[0]?.id ?? null
    if (user || authId) {
      const assignment = user && school ? await prisma.userRole.findFirst({
        where: { userId: user.id, schoolId: school.id, status: 'ACTIVE', role: { key: 'admin', status: 'ACTIVE' } },
      }) : null
      assertExistingSeedIdentity(user, school?.id, authId, Boolean(assignment))
      console.log('El administrador local ya estaba inicializado. No se cambió su cuenta ni su contraseña.')
      return
    }
    const authUserId = await createAuthUser(config)
    try {
      await prisma.$transaction(async (tx) => {
        const targetSchool = school ?? await tx.school.create({ data: { name: config.schoolName, slug: config.schoolSlug } })
        const adminRole = await tx.role.upsert({ where: { key: 'admin' }, update: {}, create: { key: 'admin', name: 'Administrador' } })
        if (adminRole.status !== 'ACTIVE') throw new Error('El rol de administrador no está activo.')
        const admin = await tx.appUser.create({ data: { authUserId, email: config.email, fullName: config.fullName, schoolId: targetSchool.id } })
        await tx.userRole.create({ data: { userId: admin.id, roleId: adminRole.id, schoolId: targetSchool.id } })
      })
    } catch (error) {
      // Solo limpia la identidad recién creada y únicamente si no llegó a vincularse.
      const linked = await prisma.appUser.findUnique({ where: { authUserId } }).catch(() => undefined)
      if (linked === null) {
        const cleanup = await fetch(`${config.supabaseUrl}/auth/v1/admin/users/${authUserId}`, {
          method: 'DELETE', headers: { apikey: config.serviceKey, authorization: `Bearer ${config.serviceKey}` },
        }).catch(() => null)
        if (!cleanup?.ok) console.error('La identidad local pendiente requiere revisión manual.')
      }
      throw error
    }
    console.log('Administrador local inicializado para el centro configurado.')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'No se pudo inicializar el administrador local.')
  process.exitCode = 1
})
