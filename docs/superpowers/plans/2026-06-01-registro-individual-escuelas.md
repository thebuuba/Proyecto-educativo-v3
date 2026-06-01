# Plan de implementación: registro individual de escuelas

> **Para agentes de implementación:** SUB-HABILIDAD REQUERIDA: usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para ejecutar este plan tarea por tarea. Los pasos usan casillas (`- [ ]`) para seguimiento.

**Objetivo:** Permitir que cada registro público cree una escuela independiente, asigne al usuario como administrador y abra una sesión válida sin consultar rutas protegidas antes de tiempo.

**Arquitectura:** `POST /api/v1/auth/register` será el único propietario del alta inicial. El backend normalizará el slug y creará escuela, usuario y vínculo con el rol `admin` dentro de una transacción de Prisma; el frontend enviará el slug candidato y aplicará la sesión devuelta usando el mismo contexto de autenticación que el login.

**Stack tecnológico:** NestJS, Prisma, PostgreSQL, React, TypeScript, Vite, `curl`, Node.js.

---

## Estructura de archivos

- Modificar `apps/backend/src/modules/auth/dto/register.dto.ts`: aceptar el nombre de escuela y el slug.
- Modificar `apps/backend/src/modules/auth/auth.service.ts`: crear la escuela y el administrador en una transacción.
- Crear `scripts/verify-individual-registration.mjs`: comprobar el contrato público, los slugs únicos, el rol `admin`, el correo duplicado y el acceso autenticado.
- Modificar `apps/frontend/src/modules/auth/context/AuthContext.ts`: exponer el método de registro autenticado.
- Modificar `apps/frontend/src/modules/auth/context/AuthProvider.tsx`: guardar la sesión devuelta por registro y reutilizar la aplicación de sesión del login.
- Modificar `apps/frontend/src/modules/auth/services/authService.ts`: añadir el cliente tipado de registro.
- Modificar `apps/frontend/src/modules/auth/types/auth.ts`: declarar `RegisterCredentials`.
- Modificar `apps/frontend/src/modules/auth/pages/RegisterPage.tsx`: eliminar la consulta protegida y usar el método de registro.
- Mantener `apps/frontend/src/services/apiClient.ts`: conservar la lectura de `body.error` para mostrar mensajes útiles del backend.

### Tarea 1: Crear una prueba de integración del contrato de registro

**Archivos:**
- Crear: `scripts/verify-individual-registration.mjs`

- [ ] **Paso 1: Crear la prueba de integración que falla con el backend actual**

```js
import { readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'

for (const line of readFileSync('apps/backend/.env', 'utf8').split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
}

const prisma = new PrismaClient()
const apiUrl = process.env.API_URL ?? 'http://localhost:3000/api/v1'
const runId = Date.now()
const schoolName = `Colegio Diagnostico ${runId}`
const firstEmail = `registro-${runId}-1@example.com`
const secondEmail = `registro-${runId}-2@example.com`
const password = '123456'

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const body = await response.json()
  return { response, body }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function normalizeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'escuela'
}

async function register(email) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      fullName: 'Administrador Diagnostico',
      schoolName,
      slug: schoolName,
    }),
  })
}

const first = await register(firstEmail)
assert(first.response.status === 201, `registro inicial: ${first.response.status}`)
assert(first.body.data.token, 'registro inicial sin token')
assert(first.body.data.roles.some((role) => role.key === 'admin'), 'registro inicial sin rol admin')

const second = await register(secondEmail)
assert(second.response.status === 201, `segundo registro: ${second.response.status}`)
assert(second.body.data.roles.some((role) => role.key === 'admin'), 'segundo registro sin rol admin')
assert(
  first.body.data.appUser.schoolId !== second.body.data.appUser.schoolId,
  'los registros comparten escuela',
)

const firstSchool = await prisma.school.findUnique({
  where: { id: first.body.data.appUser.schoolId },
})
const secondSchool = await prisma.school.findUnique({
  where: { id: second.body.data.appUser.schoolId },
})
const baseSlug = normalizeSlug(schoolName)
assert(firstSchool.slug === baseSlug, `slug inicial inesperado: ${firstSchool.slug}`)
assert(secondSchool.slug === `${baseSlug}-1`, `slug con sufijo inesperado: ${secondSchool.slug}`)

const duplicate = await register(firstEmail)
assert(duplicate.response.status === 409, `correo duplicado: ${duplicate.response.status}`)

const profile = await request('/auth/profile', {
  headers: { Authorization: `Bearer ${first.body.data.token}` },
})
assert(profile.response.status === 200, `perfil autenticado: ${profile.response.status}`)
assert(
  profile.body.data.schoolId === first.body.data.appUser.schoolId,
  'el perfil autenticado apunta a otra escuela',
)

await prisma.$disconnect()
console.log('PASS: registro individual de escuelas')
```

- [ ] **Paso 2: Ejecutar la prueba para confirmar que falla**

Ejecutar:

```bash
node scripts/verify-individual-registration.mjs
```

Resultado esperado: `FAIL` porque el DTO actual rechaza `schoolName` y `slug` con estado `400`, o porque el registro todavía no devuelve el rol `admin`.

- [ ] **Paso 3: Confirmar que el fallo reproduce el problema de contrato**

Ejecutar:

```bash
curl -sS -o /tmp/aula-register-before.json -w '%{http_code}\n' \
  -H 'Content-Type: application/json' \
  -X POST http://localhost:3000/api/v1/auth/register \
  --data '{"email":"before-fix@example.com","password":"123456","fullName":"Antes del arreglo","schoolName":"Escuela Antes","slug":"escuela-antes"}'
cat /tmp/aula-register-before.json
```

Resultado esperado: `400` con campos no permitidos o una respuesta sin rol `admin`.

### Tarea 2: Implementar el registro transaccional en el backend

**Archivos:**
- Modificar: `apps/backend/src/modules/auth/dto/register.dto.ts`
- Modificar: `apps/backend/src/modules/auth/auth.service.ts`

- [ ] **Paso 1: Ampliar el DTO con los campos de escuela**

```ts
export class RegisterDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(6)
  password!: string

  @IsString()
  fullName!: string

  @IsString()
  schoolName!: string

  @IsString()
  slug!: string
}
```

- [ ] **Paso 2: Añadir normalización y resolución de colisiones de slug**

En `auth.service.ts`, añadir antes de la clase:

```ts
function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'escuela'
}

async function getAvailableSlug(slug: string) {
  const baseSlug = normalizeSlug(slug)
  let candidate = baseSlug
  let suffix = 1

  while (await prisma.school.findUnique({ where: { slug: candidate } })) {
    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }

  return candidate
}
```

- [ ] **Paso 3: Sustituir `register` por la creación transaccional**

```ts
async register(dto: RegisterDto) {
  const existing = await prisma.appUser.findUnique({
    where: { email: dto.email },
  })
  if (existing) throw new ConflictException('Email already registered')

  const adminRole = await prisma.role.findUnique({ where: { key: 'admin' } })
  if (!adminRole) throw new Error('Admin role not configured')

  const passwordHash = await bcrypt.hash(dto.password, 10)
  const slug = await getAvailableSlug(dto.slug)

  const { user, roles } = await prisma.$transaction(async (tx) => {
    const school = await tx.school.create({
      data: { name: dto.schoolName, slug },
    })
    const user = await tx.appUser.create({
      data: {
        authUserId: crypto.randomUUID(),
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
        schoolId: school.id,
      },
    })
    await tx.userRole.create({
      data: { userId: user.id, roleId: adminRole.id, schoolId: school.id },
    })
    return { user, roles: [adminRole] }
  })

  const token = this.jwtService.sign({ sub: user.id, email: user.email })

  return {
    user: { id: user.id, email: user.email },
    token,
    appUser: {
      id: user.id,
      authUserId: user.authUserId,
      schoolId: user.schoolId,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      lastLoginAt: user.lastLoginAt,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    roles,
    permissions: [],
  }
}
```

- [ ] **Paso 4: Compilar el backend**

Ejecutar:

```bash
pnpm --filter backend build
```

Resultado esperado: salida exitosa con código `0`.

- [ ] **Paso 5: Reiniciar el backend local y ejecutar la prueba de integración**

Ejecutar:

```bash
pnpm --filter backend dev
node scripts/verify-individual-registration.mjs
```

Resultado esperado: `PASS: registro individual de escuelas`.

- [ ] **Paso 6: Crear el commit del backend**

```bash
git add apps/backend/src/modules/auth/dto/register.dto.ts \
  apps/backend/src/modules/auth/auth.service.ts \
  scripts/verify-individual-registration.mjs
git commit -m "feat: create school administrator during registration"
```

### Tarea 3: Aplicar la sesión devuelta por registro en el frontend

**Archivos:**
- Modificar: `apps/frontend/src/modules/auth/types/auth.ts`
- Modificar: `apps/frontend/src/modules/auth/services/authService.ts`
- Modificar: `apps/frontend/src/modules/auth/context/AuthContext.ts`
- Modificar: `apps/frontend/src/modules/auth/context/AuthProvider.tsx`

- [ ] **Paso 1: Añadir el tipo de credenciales de registro**

```ts
export type RegisterCredentials = LoginCredentials & {
  fullName: string
  schoolName: string
  slug: string
}
```

- [ ] **Paso 2: Añadir el servicio de registro**

```ts
export async function register(credentials: RegisterCredentials): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/register', credentials)
}
```

- [ ] **Paso 3: Exponer `register` en el contexto**

```ts
register: (credentials: RegisterCredentials) => Promise<void>
```

- [ ] **Paso 4: Reutilizar una función para guardar sesiones de login y registro**

En `AuthProvider.tsx`, importar `register as registerService`,
`LoginResponse` y `RegisterCredentials`. Luego añadir:

```ts
const applySession = useCallback((response: LoginResponse) => {
  setAuthToken(response.token)
  setState({
    user: response.user,
    token: response.token,
    appUser: response.appUser,
    roles: response.roles,
    permissions: response.permissions,
    loading: false,
    authError: null,
    needsProfile: false,
  })
}, [])
```

Actualizar `login`:

```ts
const login = useCallback(
  async (credentials: LoginCredentials) => {
    applySession(await loginService(credentials))
  },
  [applySession],
)
```

Añadir `register`:

```ts
const register = useCallback(
  async (credentials: RegisterCredentials) => {
    applySession(await registerService(credentials))
  },
  [applySession],
)
```

Incluir `register` en el valor del contexto y en las dependencias de
`useMemo`.

- [ ] **Paso 5: Ejecutar el chequeo de TypeScript del frontend**

Ejecutar:

```bash
pnpm --filter frontend build
```

Resultado esperado: puede seguir fallando únicamente por los tres errores
preexistentes de variables sin uso en el dashboard. No debe añadir errores en
los archivos de autenticación.

### Tarea 4: Eliminar la consulta protegida del formulario de registro

**Archivos:**
- Modificar: `apps/frontend/src/modules/auth/pages/RegisterPage.tsx`
- Mantener: `apps/frontend/src/services/apiClient.ts`

- [ ] **Paso 1: Eliminar `getAvailableSlug` de `RegisterPage.tsx`**

Conservar `createSlug`, pero eliminar la función que llama:

```ts
api.get<Array<{ slug: string }>>('/settings/school')
```

- [ ] **Paso 2: Usar el método `register` del contexto**

Cambiar la lectura del contexto:

```ts
const { register, loginWithOAuth } = useAuth()
```

Sustituir el bloque de envío por:

```ts
await register({
  email: trimmedEmail,
  password,
  fullName: trimmedFullName,
  schoolName: trimmedSchoolName,
  slug: createSlug(trimmedSchoolName),
})
setRegistered(true)
```

- [ ] **Paso 3: Mantener el mensaje útil de errores del API**

Confirmar que `apps/frontend/src/services/apiClient.ts` conserva:

```ts
throw new ApiError(res.status, body.error || body.message || `Error ${res.status}`)
```

- [ ] **Paso 4: Verificar que el formulario ya no consulta configuración**

Ejecutar:

```bash
rg -n "getAvailableSlug|/settings/school" apps/frontend/src/modules/auth/pages/RegisterPage.tsx
```

Resultado esperado: sin coincidencias.

- [ ] **Paso 5: Compilar el frontend**

Ejecutar:

```bash
pnpm --filter frontend build
```

Resultado esperado: puede seguir fallando únicamente por los tres errores
preexistentes de variables sin uso en el dashboard.

- [ ] **Paso 6: Crear el commit del frontend**

```bash
git add apps/frontend/src/modules/auth/types/auth.ts \
  apps/frontend/src/modules/auth/services/authService.ts \
  apps/frontend/src/modules/auth/context/AuthContext.ts \
  apps/frontend/src/modules/auth/context/AuthProvider.tsx \
  apps/frontend/src/modules/auth/pages/RegisterPage.tsx \
  apps/frontend/src/services/apiClient.ts
git commit -m "fix: register independent school accounts"
```

### Tarea 5: Verificación final del flujo completo

**Archivos:**
- Verificar: `scripts/verify-individual-registration.mjs`

- [ ] **Paso 1: Ejecutar la prueba de integración del backend**

```bash
node scripts/verify-individual-registration.mjs
```

Resultado esperado: `PASS: registro individual de escuelas`.

- [ ] **Paso 2: Verificar el formulario en el navegador**

Abrir `http://localhost:5173/registro`, crear una cuenta con un correo nuevo y
confirmar:

1. No aparece `Unauthorized`.
2. La aplicación navega a `/`.
3. El usuario autenticado tiene rol `admin`.
4. La pestaña de red no contiene una solicitud previa a
   `/api/v1/settings/school`.

- [ ] **Paso 3: Ejecutar chequeos de compilación**

```bash
pnpm --filter backend build
pnpm --filter frontend build
git diff --check
```

Resultado esperado:

- Backend: código `0`.
- Frontend: registrar por separado los tres errores preexistentes de variables
  sin uso del dashboard si continúan presentes.
- `git diff --check`: código `0`.

- [ ] **Paso 4: Revisar el estado final**

```bash
git status --short
git log --oneline -3
```

Resultado esperado: solo cambios intencionales y commits separados para
backend y frontend.
