# Saneamiento Arquitectura Proyecto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar el proyecto organizado, desplegable y seguro para múltiples escuelas, eliminando contradicciones de auth, tipos, build y estructura.

**Architecture:** La prioridad es convertir `schoolId` en contexto de servidor derivado del JWT, no en dato global ni enviado por el cliente. Después se alinean Prisma, Docker, Turbo, lint, tipos y documentación para que el monorepo tenga una sola fuente de verdad.

**Tech Stack:** NestJS, Passport JWT, Prisma, PostgreSQL/Supabase, React, Vite, pnpm workspaces, Turbo, Docker/Railway.

---

## Principio Rector

No arreglar módulos de UI antes de blindar el backend. El backend debe decidir `schoolId`, roles y permisos desde el usuario autenticado; el frontend solo presenta datos y nunca debe poder cambiar de escuela enviando IDs propios.

## Fase 1: Contexto De Autenticación Y Escuela

### Task 1: Crear tipo de usuario autenticado

**Files:**
- Create: `apps/backend/src/modules/auth/types/authenticated-user.ts`
- Modify: `apps/backend/src/modules/auth/strategies/jwt.strategy.ts`
- Modify: `apps/backend/src/common/decorators/current-user.decorator.ts`

- [ ] **Step 1: Crear el tipo compartido del request user**

```ts
export type AuthenticatedUser = {
  id: string
  email: string
  schoolId: string
  roles: string[]
}
```

- [ ] **Step 2: Hacer que JWT Strategy cargue escuela y roles**

En `apps/backend/src/modules/auth/strategies/jwt.strategy.ts`, `validate()` debe devolver:

```ts
async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
  const user = await prisma.appUser.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      schoolId: true,
      status: true,
      roles: {
        where: { status: 'ACTIVE' },
        select: { role: { select: { key: true } } },
      },
    },
  })

  if (!user || user.status !== 'ACTIVE') {
    throw new UnauthorizedException()
  }

  return {
    id: user.id,
    email: user.email,
    schoolId: user.schoolId,
    roles: user.roles.map((item) => item.role.key),
  }
}
```

- [ ] **Step 3: Tipar `CurrentUser`**

Actualizar imports y usar `AuthenticatedUser` en controladores, empezando por `auth`, `profile`, `settings`, `students`.

- [ ] **Step 4: Verificar**

Run:

```bash
pnpm --filter backend build
curl -sS http://localhost:3000/api/v1/auth/profile -H "Authorization: Bearer TOKEN"
```

Expected: profile sigue respondiendo y el código compila.

- [ ] **Step 5: Commit**

```bash
git add apps/backend/src/modules/auth/types/authenticated-user.ts apps/backend/src/modules/auth/strategies/jwt.strategy.ts apps/backend/src/common/decorators/current-user.decorator.ts
git commit -m "refactor: include school context in jwt user"
```

### Task 2: Mover `schoolId` a backend en Settings y Students

**Files:**
- Modify: `apps/backend/src/modules/settings/settings.controller.ts`
- Modify: `apps/backend/src/modules/settings/settings.service.ts`
- Modify: `apps/backend/src/modules/students/students.controller.ts`
- Modify: `apps/backend/src/modules/students/students.service.ts`

- [ ] **Step 1: Pasar `CurrentUser` desde controladores**

Ejemplo para Settings:

```ts
@Get('school')
getSchool(@CurrentUser() user: AuthenticatedUser) {
  return this.settingsService.getSchool(user.schoolId)
}
```

- [ ] **Step 2: Reemplazar `findFirst()` por `schoolId`**

Ejemplo:

```ts
getSchool(schoolId: string) {
  return prisma.school.findUnique({ where: { id: schoolId } })
}
```

- [ ] **Step 3: Cambiar updates/deletes a validación por escuela**

Ejemplo:

```ts
const student = await prisma.student.findFirst({ where: { id, schoolId } })
if (!student) throw new NotFoundException('Student not found')
return prisma.student.update({ where: { id }, data })
```

- [ ] **Step 4: Eliminar `schoolId` enviado por cliente en creates**

Crear estudiantes, matrículas y años escolares usando `schoolId` del usuario autenticado.

- [ ] **Step 5: Verificar**

Run:

```bash
pnpm --filter backend build
pnpm --filter frontend build
```

Expected: ambos pasan.

- [ ] **Step 6: Commit**

```bash
git add apps/backend/src/modules/settings apps/backend/src/modules/students
git commit -m "fix: scope settings and students by authenticated school"
```

## Fase 2: Aislamiento Multi-Escuela En Todos Los Módulos

### Task 3: Aplicar contexto de escuela en módulos académicos

**Files:**
- Modify: `apps/backend/src/modules/grades-sections/*`
- Modify: `apps/backend/src/modules/schedule/*`
- Modify: `apps/backend/src/modules/planning/*`
- Modify: `apps/backend/src/modules/attendance/*`
- Modify: `apps/backend/src/modules/academic-grades/*`
- Modify: `apps/backend/src/modules/dashboard/*`
- Modify: `apps/backend/src/modules/reports/*`
- Modify: `apps/backend/src/modules/subjects/*`

- [ ] **Step 1: Pasar `AuthenticatedUser` desde todos los controllers protegidos**

Cada handler que lee/escribe datos escolares debe recibir:

```ts
@CurrentUser() user: AuthenticatedUser
```

- [ ] **Step 2: Añadir `schoolId` obligatorio a cada service method**

Ejemplo:

```ts
findEntries(schoolId: string, filters: ScheduleFilters) {
  return prisma.scheduleEntry.findMany({
    where: { schoolId, ...filters },
  })
}
```

- [ ] **Step 3: Validar entidades hijas antes de escribir**

Antes de guardar calificaciones/asistencia, verificar que `enrollment`, `sectionSubject`, `academicPeriod` pertenecen al mismo `schoolId`.

- [ ] **Step 4: Eliminar `body.schoolId` e `input.schoolId`**

Buscar:

```bash
rg -n "schoolId:\\s*body\\.|schoolId:\\s*input\\.|findFirst\\(" apps/backend/src/modules
```

Expected: sin usos para contexto de escuela.

- [ ] **Step 5: Commit por grupo**

```bash
git add apps/backend/src/modules/grades-sections apps/backend/src/modules/schedule
git commit -m "fix: scope course and schedule modules by school"

git add apps/backend/src/modules/planning apps/backend/src/modules/attendance apps/backend/src/modules/academic-grades
git commit -m "fix: scope academic workflows by school"

git add apps/backend/src/modules/dashboard apps/backend/src/modules/reports apps/backend/src/modules/subjects
git commit -m "fix: scope reporting modules by school"
```

## Fase 3: Roles Y Permisos Reales

### Task 4: Conectar RBAC en backend

**Files:**
- Modify: `apps/backend/src/app.module.ts`
- Modify: `apps/backend/src/common/guards/roles.guard.ts`
- Modify: protected controllers in `apps/backend/src/modules/**`

- [ ] **Step 1: Registrar `RolesGuard` como guard global**

```ts
providers: [
  { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  { provide: APP_FILTER, useClass: AllExceptionsFilter },
  { provide: APP_GUARD, useClass: RolesGuard },
]
```

- [ ] **Step 2: Anotar endpoints sensibles**

Ejemplos:

```ts
@Roles('admin', 'director', 'coordinator')
@Post('grades')
createGrade(...) {}

@Roles('admin')
@Patch('school')
updateSchool(...) {}
```

- [ ] **Step 3: Corregir mismatch de roles**

Usar siempre minúsculas: `admin`, `director`, `coordinator`, `teacher`, `student`, `guardian`, `viewer`.

- [ ] **Step 4: Verificar**

Crear o usar tokens con usuario admin y usuario sin rol admin. Confirmar que admin accede y no-admin recibe 403.

- [ ] **Step 5: Commit**

```bash
git add apps/backend/src/app.module.ts apps/backend/src/common/guards apps/backend/src/modules
git commit -m "feat: enforce backend role authorization"
```

## Fase 4: Prisma Como Fuente De Verdad

### Task 5: Añadir relaciones Prisma y migración limpia

**Files:**
- Modify: `packages/database/prisma/schema.prisma`
- Create: migration via Supabase/Prisma workflow

- [ ] **Step 1: Añadir relaciones principales**

Ejemplo mínimo:

```prisma
model AppUser {
  school School @relation(fields: [schoolId], references: [id])
  roles  UserRole[]
}

model UserRole {
  user AppUser @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id])
  school School @relation(fields: [schoolId], references: [id])
}
```

- [ ] **Step 2: Añadir índices por escuela en tablas grandes**

Ejemplos:

```prisma
@@index([schoolId])
@@index([schoolId, status])
```

- [ ] **Step 3: Generar cliente y compilar**

```bash
pnpm --filter @aula/database generate
pnpm build
```

- [ ] **Step 4: Crear migración**

Usar el flujo definitivo elegido para este proyecto. Si es Prisma:

```bash
pnpm --filter @aula/database migrate
```

Si se decide Supabase SQL manual, generar SQL y versionarlo en `supabase/migrations/`.

- [ ] **Step 5: Commit**

```bash
git add packages/database/prisma/schema.prisma packages/database/src/index.ts
git commit -m "refactor: add prisma relations and school indexes"
```

## Fase 5: DTOs, Validación Y Contratos

### Task 6: Reemplazar `body: any` en endpoints de escritura

**Files:**
- Create DTO files under `apps/backend/src/modules/*/dto`
- Modify controllers/services using `any`

- [ ] **Step 1: Crear DTOs por módulo**

Ejemplo para dashboard:

```ts
import { IsOptional, IsString, IsDateString, IsIn } from 'class-validator'

export class CreateDashboardTaskDto {
  @IsString()
  title!: string

  @IsOptional()
  @IsIn(['pending', 'completed'])
  status?: string

  @IsOptional()
  @IsIn(['low', 'normal', 'high'])
  priority?: string

  @IsOptional()
  @IsDateString()
  dueDate?: string
}
```

- [ ] **Step 2: Cambiar controllers a DTOs**

```ts
createTask(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateDashboardTaskDto) {
  return this.dashboardService.createTask(user.schoolId, user.id, dto)
}
```

- [ ] **Step 3: Verificar búsqueda**

```bash
rg -n "body: any|input: any|as any" apps/backend/src/modules
```

Expected: solo usos justificados o cero.

- [ ] **Step 4: Commit**

```bash
git add apps/backend/src/modules
git commit -m "refactor: validate backend write contracts"
```

## Fase 6: Auth Frontend Sin Flujos Muertos

### Task 7: Eliminar o reescribir registro incompleto y OAuth falso

**Files:**
- Modify: `apps/frontend/src/App.tsx`
- Delete or rewrite: `apps/frontend/src/modules/auth/pages/CompleteRegistrationPage.tsx`
- Modify: `apps/frontend/src/modules/auth/components/SocialLoginButtons.tsx`
- Modify: `apps/frontend/src/modules/auth/pages/LoginPage.tsx`
- Modify: `apps/frontend/src/modules/auth/pages/RegisterPage.tsx`
- Modify: `apps/frontend/src/modules/auth/context/AuthProvider.tsx`

- [ ] **Step 1: Eliminar ruta `/completar-registro` si no existe OAuth**

Quitar import/ruta y `needsProfile` si ya no hay usuarios OAuth incompletos.

- [ ] **Step 2: Ocultar botones sociales hasta implementar OAuth real**

Eliminar `<SocialLoginButtons />` de Login/Register o mostrarlo solo si `VITE_ENABLE_OAUTH === 'true'`.

- [ ] **Step 3: Verificar**

```bash
rg -n "CompleteRegistration|needsProfile|OAuth|loginWithOAuth|settings/school" apps/frontend/src
pnpm --filter frontend build
```

Expected: no quedan rutas/flujos muertos.

- [ ] **Step 4: Commit**

```bash
git add apps/frontend/src
git commit -m "refactor: remove inactive oauth registration flow"
```

## Fase 7: Build, Docker, Turbo Y Lint

### Task 8: Corregir Dockerfiles y Turbo outputs

**Files:**
- Modify: `Dockerfile.backend`
- Modify: `Dockerfile.frontend`
- Modify: `turbo.json`
- Modify: package scripts if needed

- [ ] **Step 1: Backend Docker debe construir paquetes dependientes**

```dockerfile
RUN pnpm --filter @aula/database generate
RUN pnpm --filter @aula/database build
RUN pnpm --filter @aula/shared build
RUN pnpm --filter backend build
```

- [ ] **Step 2: Frontend Docker debe copiar desde etapa build**

```dockerfile
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY --from=build /app/apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
```

- [ ] **Step 3: Ajustar outputs por paquete**

En `turbo.json`, usar outputs que Turbo pueda encontrar:

```json
"outputs": ["dist/**", "apps/**/dist/**", "packages/**/dist/**"]
```

- [ ] **Step 4: Verificar Docker build**

```bash
docker build -f Dockerfile.backend -t aula-backend:test .
docker build -f Dockerfile.frontend -t aula-frontend:test .
```

- [ ] **Step 5: Commit**

```bash
git add Dockerfile.backend Dockerfile.frontend turbo.json
git commit -m "fix: make docker builds reproducible"
```

### Task 9: Arreglar ESLint monorepo

**Files:**
- Create: `eslint.config.js` at root, or copy minimal config into packages
- Modify: package lint scripts if needed

- [ ] **Step 1: Centralizar configuración ESLint**

Crear `eslint.config.js` raíz que cubra TS en `apps/**` y `packages/**`.

- [ ] **Step 2: Eliminar scripts que apunten a configuración inexistente**

`pnpm lint` debe pasar en root.

- [ ] **Step 3: Verificar**

```bash
pnpm lint
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add eslint.config.js package.json apps/*/package.json packages/*/package.json
git commit -m "chore: configure monorepo linting"
```

## Fase 8: Tipos, Documentación Y Limpieza

### Task 10: Unificar tipos compartidos

**Files:**
- Modify: `packages/shared/src/index.ts`
- Modify: `apps/frontend/src/types/domain.ts`
- Review: `apps/frontend/src/types/database.types.ts`

- [ ] **Step 1: Elegir una convención**

Usar minúsculas porque Prisma enum mapea a valores DB en minúscula y el frontend ya espera minúsculas.

- [ ] **Step 2: Actualizar `packages/shared`**

Roles:

```ts
export type UserRole = 'admin' | 'director' | 'coordinator' | 'teacher' | 'student' | 'guardian' | 'viewer'
```

Estados:

```ts
export type RecordStatus = 'active' | 'inactive' | 'archived'
```

- [ ] **Step 3: Reemplazar duplicación donde aplique**

El frontend debe importar desde `@aula/shared` o mantener un solo archivo local, no ambos.

- [ ] **Step 4: Commit**

```bash
git add packages/shared/src/index.ts apps/frontend/src/types
git commit -m "refactor: unify shared domain types"
```

### Task 11: Limpiar artefactos y docs obsoletas

**Files:**
- Modify: `.gitignore`
- Remove from git: tracked tsbuildinfo and `.opencode` plan
- Modify: `README.md`
- Modify or archive: `docs/superpowers/specs/*`, `docs/superpowers/plans/*`

- [ ] **Step 1: Ignorar artefactos**

Añadir:

```gitignore
*.tsbuildinfo
.opencode/
apps/*/dist/
packages/*/dist/
```

- [ ] **Step 2: Quitar del índice**

```bash
git rm --cached apps/backend/tsconfig.build.tsbuildinfo apps/backend/tsconfig.tsbuildinfo
git rm --cached .opencode/plans/conectar-dashboard-supabase.md
```

- [ ] **Step 3: Actualizar README**

Debe describir:

- monorepo real (`apps/backend`, `apps/frontend`, `packages/database`, `packages/shared`)
- auth JWT propio
- Supabase solo como Postgres
- comandos `pnpm`, no `npm`
- registro público actual

- [ ] **Step 4: Commit**

```bash
git add .gitignore README.md docs
git commit -m "docs: align project structure and auth docs"
```

## Fase 9: Pruebas De Regresión Mínimas

### Task 12: Añadir scripts de verificación de auth y multi-escuela

**Files:**
- Create: `scripts/verify-auth-registration.mjs`
- Create: `scripts/verify-school-isolation.mjs`
- Modify: `package.json`

- [ ] **Step 1: Script de registro**

El script debe:

1. registrar una escuela A
2. registrar una escuela B con mismo nombre
3. confirmar slugs distintos
4. confirmar rol admin
5. limpiar datos creados

- [ ] **Step 2: Script de aislamiento**

El script debe:

1. crear dos usuarios con escuelas distintas
2. crear estudiante con token A
3. consultar estudiantes con token B
4. confirmar que B no ve estudiante de A

- [ ] **Step 3: Agregar comandos**

```json
"verify:auth": "node scripts/verify-auth-registration.mjs",
"verify:isolation": "node scripts/verify-school-isolation.mjs"
```

- [ ] **Step 4: Verificar**

```bash
pnpm verify:auth
pnpm verify:isolation
pnpm build
pnpm lint
```

- [ ] **Step 5: Commit**

```bash
git add scripts package.json
git commit -m "test: add auth and school isolation verification"
```

## Orden Recomendado De Ejecución

1. Fase 1 y 2 primero: corrigen el riesgo de datos cruzados.
2. Fase 3: activa permisos reales.
3. Fase 5: cierra entradas sin validar.
4. Fase 6: elimina flujos muertos que causan errores visibles.
5. Fase 7: estabiliza despliegue y CI local.
6. Fase 8: limpia organización y documentación.
7. Fase 4 y 9 pueden ejecutarse con más cuidado si hay datos reales en Supabase; no aplicar migraciones destructivas sin backup.

## Verificación Final

Run:

```bash
pnpm build
pnpm lint
pnpm verify:auth
pnpm verify:isolation
docker build -f Dockerfile.backend -t aula-backend:test .
docker build -f Dockerfile.frontend -t aula-frontend:test .
```

Expected:

- build pasa
- lint pasa
- registro crea escuela independiente
- aislamiento entre escuelas pasa
- ambos Docker images construyen desde cero

