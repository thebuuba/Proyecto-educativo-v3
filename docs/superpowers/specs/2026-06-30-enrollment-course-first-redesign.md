# Enrollment Course-First Redesign

## Context

The current `Matrícula` screen behaves like a general student analytics page. It shows attendance, average grades, risk, state distribution, and guardian notification actions. Those blocks belong in Inicio, Reportes, Seguimiento, or future analytics views.

`Matrícula` should be an operational module for enrolling and administering students inside a previously created course.

The sidebar label must remain:

`Matrícula`

Do not rename it to `Estudiantes`.

## Goal

Reorganize the `Matrícula` module around this required flow:

1. Select a course created in `Cursos`.
2. View the selected course context.
3. Add or import students into that course.
4. Manage the enrolled students for that course.

The module must not allow student enrollment without a selected course.

## Non-Goals

- Do not show general academic statistics in `Matrícula`.
- Do not manage loose students outside a course.
- Do not rename the sidebar route.
- Do not rebuild Inicio, Reportes, Seguimiento, Asistencia, or Calificaciones in this task.
- Do not require full student demographic data for quick enrollment.

## Remove From Matrícula

Remove or move out of this screen:

- Asistencia
- Promedio general
- En riesgo
- Distribución por estado
- Notificar a padres

These are not enrollment tasks.

## Main Screen Structure

The page starts with a required course selector:

`Selecciona un curso`

Courses must come from the `Cursos` module source. The displayed label should follow this style:

`3ro Secundaria A - Lengua Española - Matutina - 2026-2027`

If no courses exist, show:

> Primero debes crear un curso para poder matricular estudiantes.

Include a button linking to `/cursos`.

## After Course Selection

After selecting a course, show a compact header with:

- Grado
- Sección
- Área
- Asignatura
- Tanda
- Año escolar
- Total de estudiantes matriculados

Actions:

- Agregar estudiante
- Importar estudiantes
- Exportar matrícula

The student list and actions stay hidden until a course is selected.

## Student List

Show a compact table or compact cards for students in the selected course.

Columns:

- Código or matrícula
- Nombre completo
- Estado
- Acciones

Actions:

- Editar
- Retirar
- Trasladar
- Ver expediente

The initial implementation can route `Ver expediente` to the current detail panel or keep it as a disabled/coming-next action only if no detail route exists yet.

## New Student Modal

The modal must be fast and simple.

Required fields:

- Código or matrícula
- Nombre completo

The form must not require separate first name and last name fields. It must accept names such as:

- `Juan Pérez`
- `María del Carmen Gómez Rodríguez`

Optional fields:

- Documento
- Fecha de nacimiento
- Género
- Dirección
- Teléfono del padre/madre/tutor
- Correo del tutor
- Observaciones
- Estado

Default status:

- Activo

If the user only enters code/matrícula and full name, saving must succeed.

## Optional Information Block

Optional fields must live inside a collapsed section:

`Más información del estudiante`

It is closed by default to keep registration fast.

## Full Name Handling

The UI captures `fullName`.

When the existing backend still needs `firstName` and `lastName`, split the full name conservatively:

- First token becomes `firstName`.
- Remaining tokens become `lastName`.
- If only one token exists, use that token as `firstName` and a neutral fallback for `lastName`.

The UI continues to display and edit a single full-name field.

## Bulk Import

The `Importar estudiantes` action opens a paste-based import flow.

Accepted formats:

```text
2026001 - Juan Pérez
2026002 - María Gómez
```

```text
2026001, Juan Pérez
2026002, María Gómez
```

```text
Juan Pérez
María Gómez
```

Parsing rules:

- Read one student per line.
- Split code and name when the line uses ` - `.
- Split code and name when the line uses the first comma.
- If no code exists, leave code empty or generate a temporary code if existing backend logic requires one.
- Ignore blank lines.

Before saving, show a preview with:

- Estudiantes detectados
- Códigos detectados
- Posibles duplicados
- Errores

Final button:

`Confirmar importación`

## Enrollment Rules

Do not allow duplicate students inside the same selected course.

If a student code already exists in the selected course, show:

> Ya existe un estudiante con esta matrícula en este curso.

Every created or imported student must be linked to the selected course.

Allow editing student data.

Allow changing status:

- Activo
- Retirado
- Trasladado

Allow moving a transferred student to another course.

## Data Integration

The selected course and its enrolled students become the source for:

- Asistencia
- Calificaciones
- Reportes
- Planificaciones, if applicable
- Inteligencia artificial

Attendance and grades should not operate on loose students; they should use students enrolled in a course.

## Frontend Design

Use a practical operational layout:

- Header: `Matrícula`
- Short subtitle explaining that enrollment is managed by course.
- Course selector as the first interactive control.
- Empty state if no courses exist.
- Compact course summary after selection.
- Student actions beside or below the summary.
- Student table below.

Avoid dashboard-like metric cards in this screen.

## Backend And Service Design

Preferred first implementation:

- Reuse existing students/enrollments services where possible.
- Add course-scoped service functions if existing endpoints cannot filter cleanly by course.
- Fetch course options from the official course source (`section_subjects` / `courses` endpoint).
- Fetch students by selected course.
- Create students and enrollments in one course-scoped flow.
- Import students into the selected course.

This keeps the first pass focused while preserving the long-term course-first contract.

## Acceptance Criteria

- The sidebar still says `Matrícula`.
- `Matrícula` no longer shows attendance, average, risk, distribution, or guardian notification blocks.
- The page starts with `Selecciona un curso`.
- No student action is available until a course is selected.
- If no courses exist, the page tells the user to create a course first.
- The selected course header shows grade, section, area, subject, shift, school year, and total students.
- The student form only requires code/matrícula and full name.
- Optional fields are inside `Más información del estudiante`, collapsed by default.
- Bulk import supports the three pasted text formats.
- Import preview shows detected students, detected codes, duplicates, and errors.
- Students are linked to the selected course.
- Duplicate students inside the same course are blocked.

## Testing

Backend or service tests:

- Lists courses available for enrollment.
- Lists students for one selected course.
- Creates a student and enrollment for a selected course.
- Rejects duplicate student code in the same course.
- Parses paste import formats.
- Imports multiple students into the selected course.

Frontend verification:

- With no courses, student actions are hidden and the create-course empty state appears.
- With courses, selecting one displays the compact course header.
- `Agregar estudiante` saves with only code and full name.
- Optional student fields are collapsed by default.
- Import preview detects rows and codes.
- Duplicate rows show warnings before confirmation.
- Table shows only students in the selected course.

