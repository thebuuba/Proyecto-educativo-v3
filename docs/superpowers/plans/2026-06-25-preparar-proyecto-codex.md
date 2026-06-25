# Preparar Proyecto Para Codex Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar el repo listo para que varios estudiantes puedan programar con Codex sin romper setup, base de datos ni flujo de PR.

**Architecture:** Mantener el flujo simple: Supabase migrations son el esquema versionado, Prisma debe estar alineado, y el README/AGENTS.md son la guía operativa. No agregar herramientas nuevas; usar pnpm, Turbo, Prisma, Supabase CLI y Vitest ya instalados.

**Tech Stack:** pnpm 11.1.2, Node 20+, NestJS, React/Vite, Prisma, Supabase CLI, Vitest.

---

### Task 1: Sanear Secretos Y Env

**Files:**
- Modify: `.env.example`
- Create: `apps/backend/.env.example` if missing
- Optional manual action: rotate credentials in Supabase/dashboard/provider

- [ ] Replace real values in `.env.example` with placeholders only:

```env
VITE_API_URL=
VITE_API_PROXY_TARGET=http://localhost:3000

PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
JWT_SECRET=change-me
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=replace-me
SUPABASE_SERVICE_ROLE_KEY=replace-me
```

- [ ] Add or update `apps/backend/.env.example` with backend-only vars:

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
JWT_SECRET=change-me
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=replace-me
SUPABASE_ANON_KEY=replace-me
```

- [ ] Rotate any credential that was committed in `.env.example`: DB password, `JWT_SECRET`, Supabase anon key, and Supabase service role key.

- [ ] Run:

```bash
rg -n "postgresql://postgres:|JWT_SECRET=.*[A-Za-z0-9+/]{20,}|SERVICE_ROLE_KEY=(?!replace-me)" . -P --glob '!node_modules/**' --glob '!dist/**' --glob '!pnpm-lock.yaml' --glob '!docs/superpowers/plans/**'
```

Expected: no real secrets; placeholder names are OK.

### Task 2: Cerrar La Base Actual

**Files:**
- Existing modified files from current schema fixes

- [ ] Confirm working tree only contains intended files:

```bash
git status --short
```

Expected: schema fixes, tests, migrations, docs/env cleanup; no generated `dist/`.

- [ ] Run verification:

```bash
pnpm db:generate
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend build
pnpm --filter @aula/database build
```

Expected: all commands exit `0`.

- [ ] Commit the baseline:

```bash
git add .
git commit -m "chore: prepare project baseline for codex work"
```

### Task 3: Actualizar README Con Comandos Oficiales

**Files:**
- Modify: `README.md`
- Modify: `docs/02-base-de-datos.md` if needed

- [ ] Update README to say schema source is `supabase/migrations/` and Prisma must stay aligned.

- [ ] Replace DB setup instructions with:

```bash
pnpm install
supabase db push
pnpm db:generate
pnpm db:seed
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend build
```

- [ ] Keep frontend note: no Supabase service keys in `VITE_*`.

- [ ] Run:

```bash
pnpm --filter frontend build
```

Expected: exits `0`; docs-only changes should not affect build.

### Task 4: Crear AGENTS.md Para Codex

**Files:**
- Create: `AGENTS.md`

- [ ] Add concise repo rules:

```md
# AGENTS.md

## Project Rules

- Use pnpm; do not add npm/yarn lockfiles.
- Do not edit old Supabase migrations that may already be applied.
- For DB changes, create a new migration with `supabase migration new <name>`.
- Keep `supabase/migrations/`, `packages/database/prisma/schema.prisma`, and `apps/frontend/src/types/database.types.ts` aligned.
- Never commit secrets. `.env.example` must contain placeholders only.
- Run before finishing: `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build`.
- Prefer small PRs: one feature/fix per branch.
- Do not add dependencies unless the standard library or existing packages cannot solve the task.
```

- [ ] Run:

```bash
rg -n "Do not edit old Supabase migrations|Never commit secrets|Run before finishing" AGENTS.md
```

Expected: all three rules found.

### Task 5: Verificar Y Arreglar Seed

**Files:**
- Modify only if needed: `packages/database/src/seed.ts`

- [ ] Run against the real dev database:

```bash
pnpm db:seed
```

Expected: `Seeded: Aula Base | Admin: admin@test.com`.

- [ ] If seed fails because `auth_user_id` does not exist in `auth.users`, replace fake UUID creation with a documented dev-only seed path or create the auth user through the existing backend auth flow. Pick the smallest fix that makes repeated `pnpm db:seed` safe.

- [ ] Re-run:

```bash
pnpm db:seed
```

Expected: command is idempotent and exits `0`.

### Task 6: Definir Flujo De Ramas Y PR

**Files:**
- Modify: `README.md`
- Create: `.github/pull_request_template.md` if `.github/` is acceptable in repo

- [ ] Add branch naming to README:

```md
## Flujo De Trabajo

- `main`: rama estable.
- `feature/<nombre-corto>`: cambios nuevos.
- `fix/<nombre-corto>`: correcciones.
- Cada cambio entra por PR pequeño.
```

- [ ] Add PR template:

```md
## Qué cambia

## Cómo se probó
- [ ] `pnpm --filter backend test`
- [ ] `pnpm --filter backend build`
- [ ] `pnpm --filter frontend build`

## DB
- [ ] No toca DB
- [ ] Incluye migración Supabase nueva

## Seguridad
- [ ] No incluye secretos
```

### Task 7: Preparar Backlog Inicial Para Estudiantes

**Files:**
- Create: `docs/backlog-codex.md`

- [ ] Add small starter tasks:

```md
# Backlog Codex Inicial

1. Agregar DTOs para dashboard tasks.
2. Mostrar historial de `guardian_notifications` en detalle de estudiante.
3. Agregar validaciones de estudiantes con tests.
4. Agregar tests de auth para errores comunes.
5. Limpiar setup docs según lo que falle en onboarding.
6. Agregar filtros simples a reportes.
```

- [ ] Each task must include: objetivo, archivos probables, comando de prueba.

### Task 8: Ensayar Onboarding Desde Cero

**Files:**
- Modify docs only if the rehearsal finds gaps

- [ ] From a clean checkout or fresh branch, run:

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
pnpm install
cp apps/backend/.env.example apps/backend/.env
pnpm db:generate
pnpm db:seed
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend build
```

- [ ] Fix README/AGENTS.md for every mismatch found.

- [ ] Final commit:

```bash
git add .
git commit -m "docs: add codex onboarding workflow"
```

---

## Acceptance Criteria

- `git status --short` is clean after commits.
- No real secrets remain in tracked env examples.
- Supabase migrations, Prisma schema, and frontend DB types are aligned.
- `pnpm db:seed` is repeatable on the dev DB.
- A new student can read README + AGENTS.md and make a small PR without asking for setup commands.
