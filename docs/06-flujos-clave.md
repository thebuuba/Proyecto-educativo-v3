# Flujos Clave del Sistema

## 1. Registro de escuela + admin

```
Usuario                    Frontend                     Backend                      DB
   │                          │                           │                          │
   │  POST /auth/register     │                           │                          │
   │  (schoolName, slug,      │                           │                          │
   │   email, password,       │                           │                          │
   │   fullName)              │                           │                          │
   ├─────────────────────────►│                           │                          │
   │                          │  POST /api/v1/auth/register                           │
   │                          ├──────────────────────────►│                          │
   │                          │                           │  CREATE School           │
   │                          │                           ├─────────────────────────►│
   │                          │                           │  CREATE AppUser (admin)  │
   │                          │                           ├─────────────────────────►│
   │                          │                           │  Assign admin role       │
   │                          │                           ├─────────────────────────►│
   │                          │                           │  Generate JWT            │
   │                          │◄──────────────────────────│                          │
   │  ◄────────────────────────┤                           │                          │
   │  { user, token, ... }    │                           │                          │
```

Transacción: se crea escuela + usuario admin en una sola operación. El JWT se devuelve inmediatamente para que el admin pueda acceder al sistema.

## 2. Inicio de sesión

```
Usuario                    Frontend                     Backend                      DB
   │                          │                           │                          │
   │  POST /auth/login        │                           │                          │
   │  (email, password)       │                           │                          │
   ├─────────────────────────►│                           │                          │
   │                          │  POST /api/v1/auth/login  │                          │
   │                          ├──────────────────────────►│                          │
   │                          │                           │  Buscar AppUser por email│
   │                          │                           ├─────────────────────────►│
   │                          │                           │◄─────────────────────────│
   │                          │                           │  Validar bcrypt hash     │
   │                          │                           │  Cargar roles + permisos │
   │                          │                           ├─────────────────────────►│
   │                          │                           │◄─────────────────────────│
   │                          │                           │  Generar JWT (8h)        │
   │                          │◄──────────────────────────│                          │
   │  ◄────────────────────────┤                           │                          │
   │  { user, token, roles,   │                           │                          │
   │    permissions }         │                           │                          │
   │                          │                           │                          │
   │  Guardar token en        │                           │                          │
   │  localStorage            │                           │                          │
   │  Redirigir a Dashboard    │                           │                          │
```

El frontend almacena el token en `localStorage` (clave `auth_token`) y lo envía en cada petición como `Authorization: Bearer <token>`.

## 3. Matrícula de estudiante

```
Usuario                    Frontend                     Backend
   │                          │                           │
   │  POST /students          │                           │
   │  (studentCode,           │                           │
   │   firstName, lastName,   │                           │
   │   birthDate, ...)        │                           │
   ├─────────────────────────►│                           │
   │                          │  POST /api/v1/students    │
   │                          ├──────────────────────────►│
   │                          │                           │  Validar unicidad de
   │                          │                           │  studentCode y documentId
   │                          │                           │  en la escuela
   │                          │                           │
   │                          │                           │  Crear Student con
   │                          │                           │  schoolId del token JWT
   │                          │◄──────────────────────────│
   │  ◄────────────────────────┤                           │
   │  { success: true, data } │                           │
   │                          │                           │
   │  POST /students/         │                           │
   │  enrollments             │                           │
   │  (gradeId, sectionId,    │                           │
   │   schoolYearId)          │                           │
   ├─────────────────────────►│                           │
   │                          │  POST /api/v1/students/   │
   │                          │  enrollments              │
   │                          ├──────────────────────────►│
   │                          │                           │  Validar disponibilidad
   │                          │                           │  de sección
   │                          │                           │
   │                          │                           │  Crear Enrollment
   │                          │◄──────────────────────────│
   │  ◄────────────────────────┤                           │
```

## 4. Toma de asistencia

```
Docente                    Frontend                     Backend                      DB
   │                          │                           │                          │
   │  Selecciona:             │                           │                          │
   │  - Sección               │                           │                          │
   │  - Fecha                 │                           │                          │
   │  - Tipo (diaria/clase)   │                           │                          │
   │                          │                           │                          │
   │                          │  GET /attendance/students │                          │
   │                          │  (?sectionSubjectId=)     │                          │
   │                          ├──────────────────────────►│                          │
   │                          │                           │  Obtener estudiantes      │
   │                          │                           │  de la sección con su     │
   │                          │                           │  estado actual            │
   │                          │◄──────────────────────────│                          │
   │  ◄────────────────────────┤                           │                          │
   │  Lista de estudiantes    │                           │                          │
   │                          │                           │                          │
   │  Por cada estudiante:    │                           │                          │
   │  Click en estado         │                           │                          │
   │  (Presente/Ausente/      │                           │                          │
   │   Tarde/Justificado)     │                           │                          │
   │                          │                           │                          │
   │                          │  POST /attendance/upsert  │                          │
   │                          │  (enrollmentId, status,   │                          │
   │                          │   attendanceDate, type)   │                          │
   │                          ├──────────────────────────►│                          │
   │                          │                           │  UPSERT AttendanceDaily   │
   │                          │                           │  o AttendanceClass       │
   │                          │                           ├─────────────────────────►│
   │                          │◄──────────────────────────│                          │
   │  ◄────────────────────────┤                           │                          │
   │  Confirmación            │                           │                          │
```

Usa **upsert** (INSERT ... ON CONFLICT UPDATE) para crear o actualizar sin duplicados.

## 5. Calificación

```
Docente                    Frontend                     Backend                      DB
   │                          │                           │                          │
   │  Selecciona:             │                           │                          │
   │  - Materia (sección)     │                           │                          │
   │  - Periodo académico     │                           │                          │
   │                          │                           │                          │
   │                          │  GET /grading/    │                          │
   │                          │  students                 │                          │
   │                          ├──────────────────────────►│                          │
   │                          │◄──────────────────────────│                          │
   │  ◄────────────────────────┤                           │                          │
   │  Tabla de estudiantes    │                           │                          │
   │  con notas existentes    │                           │                          │
   │                          │                           │                          │
   │  Edita nota de un        │                           │                          │
   │  estudiante              │                           │                          │
   │                          │  POST /grading/   │                          │
   │                          │  save                     │                          │
   │                          │  (enrollmentId, score,    │                          │
   │                          │   assessmentName,         │                          │
   │                          │   sectionSubjectId,       │                          │
   │                          │   academicPeriodId)       │                          │
   │                          ├──────────────────────────►│                          │
   │                          │                           │  Crear o actualizar      │
   │                          │                           │  GradesRecord            │
   │                          │                           ├─────────────────────────►│
   │                          │◄──────────────────────────│                          │
```

Las calificaciones pueden estar en estado `draft` (borrador) o `published` (publicadas). El docente puede editar borradores. Una vez publicadas, requieren permisos adicionales para modificar.

## 6. Asignación de horario

```
Coordinador                Frontend                     Backend
   │                          │                           │
   │  Gestiona bloques        │                           │
   │  horarios (TimeSlots)    │                           │
   │  POST /schedule/         │                           │
   │  time-slots              │                           │
   ├─────────────────────────►│                           │
   │                          │  CRUD TimeSlot            │
   │                          ├──────────────────────────►│
   │                          │◄──────────────────────────│
   │                          │                           │
   │  Asigna materia a        │                           │
   │  sección + docente       │                           │
   │  POST /courses/  │                           │
   │  assign-subject          │                           │
   ├─────────────────────────►│                           │
   │                          │  Crear SectionSubject     │
   │                          ├──────────────────────────►│
   │                          │◄──────────────────────────│
   │                          │                           │
   │  Crea entrada de         │                           │
   │  horario                 │                           │
   │  POST /schedule/entries  │                           │
   │  (timeSlotId, dayOfWeek, │                           │
   │   sectionSubjectId)      │                           │
   ├─────────────────────────►│                           │
   │                          │  Crear ScheduleEntry      │
   │                          ├──────────────────────────►│
```

El horario asigna qué materia con qué docente se imparte en qué día y bloque horario para cada sección.

## 7. Planificación didáctica

```
Docente                    Frontend                     Backend
   │                          │                           │
   │  Selecciona materia      │                           │
   │  y periodo               │                           │
   │                          │                           │
   │  Crea entrada de         │                           │
   │  planificación           │                           │
   │  POST /planning/entries  │                           │
   │  (title, competencies,   │                           │
   │   content, activities,   │                           │
   │   evaluation, etc.)      │                           │
   ├─────────────────────────►│                           │
   │                          │  POST /api/v1/planning/   │
   │                          │  entries                  │
   │                          ├──────────────────────────►│
   │                          │                           │  Crear PlanningEntry
   │                          │◄──────────────────────────│
   │  ◄────────────────────────┤                           │
```

Cada entrada de planificación incluye: competencia específica, indicador de logro, contenidos (conceptuales, procedimentales, actitudinales), estrategias, actividades (inicio/desarrollo/cierre), recursos, método de evaluación e instrumentos.
