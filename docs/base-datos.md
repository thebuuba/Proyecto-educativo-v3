# Base de datos

La fuente principal del esquema es la migración:

```txt
supabase/migrations/20260522_initial_student_system_schema.sql
```

`supabase/schema.sql` queda solo como puntero para evitar aplicar un esquema
suelto fuera del flujo formal de migraciones.

## Tablas principales

- `app_users`: perfil interno de usuario, conectado con `auth.users`.
- `roles`, `permissions`, `role_permissions`, `user_roles`: autorización base.
- `students`, `teachers`, `guardians`, `student_guardians`: personas académicas y responsables.
- `school_years`, `academic_periods`: año escolar y períodos.
- `grades`, `sections`, `subjects`, `section_subjects`: estructura académica.
- `enrollments`: matrícula por estudiante y año escolar.
- `attendance_daily`: asistencia general diaria.
- `attendance_class`: asistencia por asignatura/clase.
- `grades_records`: calificaciones por evaluación y período.
- `pedagogical_recoveries`: recuperación pedagógica por calificación.
- `reports`: reportes generados por el sistema.

## Relación con Supabase Auth

La tabla `app_users` mantiene el perfil propio del sistema y referencia:

```sql
auth_user_id references auth.users(id)
```

Esto separa autenticación de datos internos. Las tablas `students`, `teachers`
y `guardians` pueden apuntar a `app_users` cuando esas personas tienen acceso al
sistema.

## Roles y permisos

El modelo permite múltiples roles por usuario mediante `user_roles`. Esto cubre
casos como un docente que también es tutor, o accesos temporales de coordinación.

Roles base:

- `admin`
- `director`
- `coordinator`
- `teacher`
- `student`
- `guardian`
- `viewer`

Las policies actuales usan roles como control principal. `permissions` y
`role_permissions` quedan listos para evolucionar hacia permisos más finos en la
capa de aplicación o en futuras policies.

## Integridad académica

Se agregaron relaciones compuestas para evitar inconsistencias:

- `enrollments(section_id, grade_id)` debe existir en `sections(id, grade_id)`.
- `section_subjects(section_id, grade_id)` debe coincidir con la sección real.
- `attendance_*` y `grades_records` referencian matrícula, año escolar, sección,
  asignatura por sección y período académico de forma consistente.
- `academic_periods` expone `(id, school_year_id)` para impedir mezclar períodos
  de otro año escolar.

## Asistencia

La asistencia se separa en dos tablas:

- `attendance_daily`: asistencia general del día escolar.
- `attendance_class`: asistencia específica por asignatura/clase.

Esta decisión evita el problema de `unique` con columnas `NULL` y permite
registrar asistencia diaria aunque no exista una clase específica.

## Calificaciones

`grades_records` guarda evaluaciones por:

- matrícula
- año escolar
- sección
- asignatura por sección
- período académico

`score` debe estar entre `0` y `max_score`. Como `max_score` puede variar, las
vistas calculan porcentajes normalizados para evitar promedios en escalas
mezcladas.

## Recuperación pedagógica

`pedagogical_recoveries` referencia una calificación original. Un trigger valida
que `recovery_score` no exceda el `max_score` de esa evaluación.

La vista `student_grade_details` calcula:

```sql
coalesce(recovery_score, score)
```

La vista `student_final_grades` usa el porcentaje efectivo normalizado. Si existe
recuperación publicada, reemplaza la nota original para el promedio.

## RLS

La migración habilita Row Level Security en las tablas públicas relevantes.

Policies iniciales:

- `admin`: acceso total.
- `director`: lectura amplia.
- `coordinator`: lectura amplia y gestión académica.
- `teacher`: acceso a estudiantes, asistencia y calificaciones relacionadas con sus asignaciones.
- `student`: acceso a su propia información.
- `guardian`: acceso a estudiantes vinculados.

Las policies son una base inicial. Antes de producción deben revisarse contra la
matriz final de permisos de la institución.

## Vistas

Las vistas `student_grade_details` y `student_final_grades` usan:

```sql
with (security_invoker = true)
```

Esto evita que las vistas salten RLS en versiones modernas de PostgreSQL usadas
por Supabase.

## Tipos TypeScript

El archivo actual:

```txt
src/services/supabase/database.types.ts
```

es un placeholder. Después de aplicar migraciones, debe reemplazarse con tipos
generados:

```bash
npx supabase gen types typescript --project-id <project-id> \
  --schema public > src/services/supabase/database.types.ts
```

## Pendientes de producción

- Probar la migración contra una instancia Supabase real o local.
- Crear datos iniciales de `app_users` y `user_roles` con service role durante bootstrap.
- Revisar si los docentes pueden gestionar asistencia diaria de toda la sección
  o solo de asignaturas específicas.
- Ajustar permisos finos según la política real del centro educativo.
- Generar tipos TypeScript reales desde Supabase.
