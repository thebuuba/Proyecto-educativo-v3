# Backlog Codex Inicial

## 1. Agregar DTOs para dashboard tasks

Objetivo: reemplazar `body: any` en dashboard tasks por DTOs con validación.

Archivos probables:
- `apps/backend/src/modules/dashboard/dashboard.controller.ts`
- `apps/backend/src/modules/dashboard/dashboard.service.ts`
- `apps/backend/src/modules/dashboard/dto/*.ts`

Prueba:
```bash
pnpm --filter backend test -- dashboard
pnpm --filter backend build
```

## 2. Mostrar historial de guardian notifications

Objetivo: ver notificaciones guardadas en el detalle de estudiante.

Archivos probables:
- `apps/backend/src/modules/students/students.service.ts`
- `apps/backend/src/modules/students/students.controller.ts`
- `apps/frontend/src/modules/students/components/StudentDetailPanel.tsx`

Prueba:
```bash
pnpm --filter backend test -- students
pnpm --filter frontend build
```

## 3. Agregar validaciones de estudiantes con tests

Objetivo: validar datos mínimos de estudiantes antes de crear/actualizar.

Archivos probables:
- `apps/backend/src/modules/students/dto/create-student.dto.ts`
- `apps/backend/src/modules/students/dto/update-student.dto.ts`
- `apps/backend/src/modules/students/students.service.spec.ts`

Prueba:
```bash
pnpm --filter backend test -- students
```

## 4. Agregar tests de auth para errores comunes

Objetivo: cubrir login/registro con credenciales inválidas y escuela duplicada.

Archivos probables:
- `apps/backend/src/modules/auth/auth.service.spec.ts`
- `apps/backend/src/modules/auth/auth.service.ts`

Prueba:
```bash
pnpm --filter backend test -- auth
```

## 5. Limpiar setup docs según onboarding

Objetivo: corregir README cuando un estudiante nuevo encuentre un paso roto.

Archivos probables:
- `README.md`
- `AGENTS.md`
- `.env.example`
- `apps/backend/.env.example`

Prueba:
```bash
pnpm --filter backend build
pnpm --filter frontend build
```

## 6. Agregar filtros simples a reportes

Objetivo: filtrar reportes por año escolar, periodo o estudiante.

Archivos probables:
- `apps/backend/src/modules/reports/reports.service.ts`
- `apps/backend/src/modules/reports/reports.controller.ts`
- `apps/frontend/src/modules/reports/pages/ReportsPage.tsx`

Prueba:
```bash
pnpm --filter backend build
pnpm --filter frontend build
```
