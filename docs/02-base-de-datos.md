# Base de Datos

## Esquema

El esquema versionado vive en `supabase/migrations/`. `packages/database/prisma/schema.prisma` debe mantenerse alineado para que Prisma Client use las mismas tablas y columnas.

## Enums globales

| Enum | Valores | Uso |
|------|---------|-----|
| `RecordStatus` | active, inactive, archived | Soft-delete genérico |
| `EnrollmentStatus` | active, transferred, withdrawn, completed | Estado de matrícula |
| `AttendanceStatus` | present, absent, late, excused | Asistencia |
| `GradeRecordStatus` | draft, published, voided | Estado de calificación |
| `ReportStatus` | pending, generated, failed, archived | Estado de reporte |

## Modelos principales

### Escuela y usuarios

| Modelo | Descripción |
|--------|-------------|
| `School` | Centro educativo (tenant). Datos MINERD: regional, distrito, código de centro, sector, subsistemas habilitados |
| `AppUser` | Cuenta de usuario (email + password hash). Vinculada a un `schoolId` |
| `Role` | Roles del sistema (admin, director, coordinator, teacher, student, guardian, viewer) |
| `Permission` | Permisos granulares |
| `RolePermission` | Asignación de permisos a roles |
| `UserRole` | Asignación de roles a usuarios por escuela |

### Académico

| Modelo | Descripción |
|--------|-------------|
| `SchoolYear` | Año escolar (nombre, fechas, esquema de periodos, días lectivos) |
| `AcademicPeriod` | Periodo académico (trimestre/semestre) dentro de un año escolar |
| `Grade` | Nivel/grado educativo (1ro básico, 2do básico, etc.) |
| `Section` | Sección/curso dentro de un grado (A, B, C) |
| `Subject` | Asignatura/materia |
| `SectionSubject` | Asignación de materia a una sección con un docente |
| `Teacher` | Datos del docente (código empleado, documento, datos personales) |
| `Student` | Datos del estudiante (código, documento, datos personales) |

### Matrícula y calificaciones

| Modelo | Descripción |
|--------|-------------|
| `Enrollment` | Matrícula: estudiante en un grado+sección en un año escolar |
| `GradesRecord` | Calificación: evaluación, puntaje, peso, estado (draft/published) |
| `PedagogicalRecovery` | Recuperación pedagógica vinculada a una calificación |

### Asistencia

| Modelo | Descripción |
|--------|-------------|
| `AttendanceDaily` | Asistencia diaria por estudiante |
| `AttendanceClass` | Asistencia por clase/materia |

### Horario y planificación

| Modelo | Descripción |
|--------|-------------|
| `TimeSlot` | Bloque horario (nombre, hora inicio, hora fin, secuencia) |
| `ScheduleEntry` | Entrada de horario: materia-sección en un día y bloque |
| `PlanningEntry` | Planificación didáctica: competencias, contenidos, actividades, evaluación |

### Catálogos RD (MINERD)

| Modelo | Descripción |
|--------|-------------|
| `DrAcademicLevel` | Niveles educativos RD (Inicial, Primario, Secundario) |
| `DrAcademicCycle` | Ciclos dentro de cada nivel |
| `DrModality` | Modalidades (General, Técnico, Artes) |
| `DrSubsystem` | Subsistemas |
| `DrCompetency` | Competencias fundamentales |
| `DrEvaluationRule` | Reglas de evaluación (nota mínima, esquema de periodos) |

### Otros

| Modelo | Descripción |
|--------|-------------|
| `Guardian` / `StudentGuardian` | Padre/madre/tutor y relación con estudiante |
| `DashboardTask` | Tareas del panel principal |
| `Report` | Metadatos de reportes generados |

## Migraciones

Las migraciones SQL están en `supabase/migrations/`. Se gestionan a través de Supabase CLI. El flujo típico:

1. Se modifica `schema.prisma`
2. Se genera la migración SQL
3. Se aplica contra Supabase
4. Se regenera Prisma Client

## Seed

El script `packages/database/src/seed.ts` puebla la base de datos con datos iniciales (roles, permisos, catálogos RD).

## Comandos útiles

```bash
# Aplicar esquema a DB vacía
pnpm --filter @aula/database exec prisma db push

# Ejecutar seed
pnpm db:seed

# Regenerar Prisma Client
pnpm db:generate

# Abrir Prisma Studio (navegador de datos)
pnpm db:studio
```
