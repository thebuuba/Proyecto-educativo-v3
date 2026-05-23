# Esquema de base de datos

La fuente principal del esquema ahora es la migración formal:

```txt
supabase/migrations/001_initial_student_system_schema.sql
```

`schema.sql` queda como puntero para evitar aplicar un esquema suelto fuera del
flujo de migraciones de Supabase.

Documentación ampliada:

```txt
docs/base-datos.md
```

## Relaciones principales

- `app_users.auth_user_id` -> `auth.users.id`
- `user_roles.user_id` -> `app_users.id`
- `user_roles.role_id` -> `roles.id`
- `role_permissions.role_id` -> `roles.id`
- `role_permissions.permission_id` -> `permissions.id`
- `students.user_id` -> `app_users.id`
- `teachers.user_id` -> `app_users.id`
- `guardians.user_id` -> `app_users.id`
- `student_guardians` relaciona estudiantes y tutores
- `academic_periods.school_year_id` -> `school_years.id`
- `sections.grade_id` -> `grades.id`
- `section_subjects` relaciona `school_years`, `sections`, `subjects` y `teachers`
- `enrollments` relaciona `students`, `school_years`, `grades` y `sections`
- `attendance_daily` registra asistencia general diaria
- `attendance_class` registra asistencia por asignatura/clase
- `grades_records` relaciona matrícula, asignatura por sección y período académico
- `pedagogical_recoveries.grade_record_id` -> `grades_records.id`
- `reports` puede relacionarse con año escolar, período, estudiante y usuario generador

## Recuperación pedagógica

La vista `student_grade_details` calcula `effective_score` así:

```sql
coalesce(pedagogical_recoveries.recovery_score, grades_records.score)
```

La vista `student_final_grades` usa el porcentaje efectivo normalizado para
calcular el promedio final ponderado. Si existe una recuperación publicada,
reemplaza la nota original en el cálculo.
