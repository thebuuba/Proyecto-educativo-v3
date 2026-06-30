# Courses And Enrollment Module Design

## Context

AulaBase needs a clear academic flow after initial onboarding:

1. Create courses.
2. Enroll or import students into those courses.
3. Use those courses and enrollments in schedule, attendance, grades, planning, reports, and AI features.

The old broad "academic configuration" idea is being replaced by two focused operational modules:

- `Cursos`: creates the academic structure.
- `Matrícula`: manages students inside an existing course.

Initial onboarding already captures teacher and school information. Neither module should ask for school name, regional, district, or center data again.

## Goals

Create a course-first data flow:

- A course is the required academic container.
- Students are not managed as isolated records.
- Enrollment, attendance, grades, schedule, planning, reports, and AI features depend on courses created in `Cursos`.

Keep the sidebar label `Matrícula`. Do not rename it to `Estudiantes`, because the module manages enrollment, import, assignment, withdrawal, and transfer, not only a list of students.

## Non-Goals

- Do not show `Asignaturas` or `Matriz curricular` cards inside `Cursos`.
- Do not create independent course lists in downstream modules.
- Do not let Matrícula add students before a course exists.
- Do not rebuild every downstream module in this pass; define the shared source and migrate the visible course selectors first.

## Data Source

Use `section_subjects` as the official course entity. The stable course id is `section_subjects.id`.

The existing academic tables remain the foundation:

- `grades`
- `sections`
- `subjects`
- `section_subjects`
- `school_years`
- `enrollments`
- `students`

Add a new migration extending `section_subjects` with:

- `level` text, required
- `cycle` text, required
- `area` text, required
- `shift` text, required
- `internal_code` text, nullable
- `observations` text, nullable

The active school year is always part of course identity.

## Duplicate Rule

Do not allow duplicate courses in the active school year.

A duplicate course has the same:

- Level
- Cycle
- Grade
- Area
- Subject
- Section
- Shift
- Active school year

Example:

`3ro de secundaria + Lengua Española + Sección A + Matutina` cannot exist twice in the same active school year.

The backend must enforce this before saving and return:

> Ya existe un curso con ese nivel, ciclo, grado, área, asignatura, sección y tanda para este año escolar.

## Courses Module

The `/cursos` page becomes a clean course management screen.

Remove these quick cards/options from Cursos:

- `Asignaturas – Catálogo general de materias disponibles`
- `Matriz curricular – Competencias, contenidos y organización curricular`

Those are not part of course creation.

## New Course Modal

Replace the current `Nuevo curso` modal fields.

Remove:

- Nombre
- Nivel con el texto `Texto legado si no usas catálogo`
- Nivel MINERD
- Modalidad por defecto
- Secuencia

Use this form instead:

### Nivel

Dropdown:

- Nivel Inicial
- Nivel Primario
- Nivel Secundario

### Ciclo

Dependent dropdown.

For `Nivel Primario`:

- Primer ciclo
- Segundo ciclo

For `Nivel Secundario`:

- Primer ciclo
- Segundo ciclo

Rules:

- Primaria, primer ciclo: 1ro, 2do, 3ro de primaria.
- Primaria, segundo ciclo: 4to, 5to, 6to de primaria.
- Secundaria, primer ciclo: 1ro, 2do, 3ro de secundaria.
- Secundaria, segundo ciclo: 4to, 5to, 6to de secundaria.

For `Nivel Inicial`, use an initial-level grade list such as:

- Pre-Kínder
- Kínder
- Preprimario

### Grado

Dependent dropdown based on selected level and cycle.

Example:

If the user selects `Nivel Secundario + Segundo ciclo`, only show:

- 4to de secundaria
- 5to de secundaria
- 6to de secundaria

### Área

Dropdown from Dominican curriculum areas.

Initial areas:

- Lengua Española
- Matemática
- Ciencias Naturales
- Ciencias Sociales
- Educación Artística
- Educación Física
- Formación Humana
- Lenguas Extranjeras
- Optativas

### Asignatura/Subárea

Dropdown filtered by selected area.

If the selected area has only one subject, auto-fill it.

Examples:

- Lengua Española -> Lengua Española
- Matemática -> Matemática
- Ciencias Naturales -> Biología, Química, Física, Ciencias de la Tierra
- Ciencias Sociales -> Ciencias Sociales, Historia, Geografía, Educación Ciudadana
- Lenguas Extranjeras -> Inglés, Francés

### Sección

Combobox or editable dropdown.

Suggested options:

- A
- B
- C
- D
- E

The user must be able to type another section letter/name.

### Tanda

Dropdown:

- Matutina
- Vespertina
- Nocturna
- Extendida

### Buttons

- Cancelar
- Crear curso

## Courses List

After creating a course, show it in a table/list.

Columns:

- Nivel
- Ciclo
- Grado
- Sección
- Área
- Asignatura
- Tanda
- Cantidad de estudiantes
- Acciones

Actions:

- Ver matrícula
- Editar
- Eliminar

`Ver matrícula` navigates to `Matrícula` with the course selected.

## Course Delete Behavior

Deletion is a soft delete by marking the course inactive.

Before deletion, check whether related data exists:

- Students/enrollments
- Schedule entries
- Attendance records
- Grade records
- Planning entries

If related data exists, warn:

> Este curso contiene información relacionada. Si lo elimina perderá todos esos datos.

The first implementation requires explicit confirmation before deleting a course with related data.

## Enrollment Module

The sidebar label remains:

`Matrícula`

This module depends on courses created in `/cursos`.

If no course exists, Matrícula shows an empty state:

- Explain that the user must create a course first.
- Provide a button to go to `/cursos`.
- Do not show student creation/import actions.

If courses exist, Matrícula first shows a selector:

`Selecciona un curso`

After selecting a course, show course context:

- Grado
- Sección
- Área
- Asignatura
- Tanda
- Total de estudiantes

Only then show student actions.

## Add Individual Student

Inside the selected course, allow adding one student.

Fields:

- Matrícula or student code
- Full name
- Sex, optional
- Birth date, optional
- Parent/guardian phone, optional
- Address, optional
- Status: Activo, Retirado, Trasladado

The student is created and enrolled in the selected course.

## Bulk Import

Inside the selected course, allow pasting a list of students.

Accepted formats:

### Format 1

`Matrícula - Nombre completo`

Example:

```text
2026001 - Juan Pérez
2026002 - María Gómez
```

### Format 2

`Nombre completo`

Example:

```text
Juan Pérez
María Gómez
```

### Format 3

`Matrícula, Nombre completo`

Example:

```text
2026001, Juan Pérez
2026002, María Gómez
```

The app parses each line and detects:

- Students detected
- Student codes detected
- Errors found
- Duplicates found

Before saving, show a preview table.

Final button:

`Confirmar importación`

## Enrollment Rules

Do not allow duplicate students inside the same course.

If the student code already exists in the selected course, show:

> Ya existe un estudiante con esta matrícula en este curso.

Allow editing student data.

Allow changing status:

- Activo
- Retirado
- Trasladado

Allow moving a transferred student to another course.

## Backend Design

Add a dedicated `courses` API/module that writes to the existing academic tables.

Required course endpoints:

- `GET /courses`
- `POST /courses`
- `PATCH /courses/:id`
- `DELETE /courses/:id`
- `GET /courses/catalog`

`GET /courses` returns active courses for the active school year with student counts.

Add or reshape enrollment endpoints so Matrícula can work by course id:

- `GET /enrollment/courses`
- `GET /enrollment/courses/:courseId/students`
- `POST /enrollment/courses/:courseId/students`
- `POST /enrollment/courses/:courseId/import-preview`
- `POST /enrollment/courses/:courseId/import`
- `PATCH /enrollment/students/:studentId`
- `POST /enrollment/students/:studentId/move`

The existing students module can remain internally, but the user-facing Matrícula flow must be course-scoped.

## Frontend Design

### `/cursos`

Use a practical operational layout:

- Header with title `Cursos`
- Primary action `Nuevo curso`
- No `Asignaturas` or `Matriz curricular` quick cards
- Course table as the main content
- Empty state inviting the user to create the first course

### `/estudiantes` Route

Keep the route if convenient, but the UI and sidebar label are `Matrícula`.

The page layout:

- Course selector first
- Course summary after selection
- Student table for selected course
- Buttons for `Agregar estudiante` and `Carga masiva`

## Integration Contract

Future modules must use courses from this source:

- Matrícula reads courses from active `section_subjects`.
- Horario reads courses from active `section_subjects`.
- Asistencia reads courses from active `section_subjects`.
- Calificaciones reads courses from active `section_subjects`.
- Planificación reads courses from active `section_subjects`.
- Reportes and AI features use the same course ids.

Attendance and grades must work with enrolled students in a course, not loose students.

## Permissions

For the first implementation, allow course and enrollment management for:

- `admin`
- `director`
- `coordinator`
- `teacher`

This keeps AulaBase teacher-centered. School-wide permission refinement can come later.

## Testing

Backend tests:

- Creates a course from level, cycle, grade, area, subject, section, shift.
- Rejects duplicate courses.
- Lists courses with student count.
- Soft-deletes courses.
- Blocks or confirms deletion when related data exists.
- Parses bulk import formats.
- Rejects duplicate student codes inside a selected course.
- Moves transferred students to another course.

Frontend verification:

- Sidebar still says `Matrícula`.
- `/cursos` no longer shows Asignaturas or Matriz curricular cards.
- `Nuevo curso` shows the new dependent fields.
- Level and cycle filter grade options correctly.
- Area filters subject options correctly.
- Single-subject areas auto-fill subject.
- Creating a course adds it to the table.
- Matrícula blocks student actions until a course is selected.
- Bulk import preview detects rows, codes, errors, and duplicates.

Manual end-to-end verification:

1. Create `Nivel Secundario / Primer ciclo / 3ro de secundaria / Lengua Española / Lengua Española / A / Matutina`.
2. Confirm it appears in Cursos with `0` students.
3. Open Matrícula through `Ver matrícula`.
4. Add one student manually.
5. Import two students by pasted list.
6. Confirm the course student count updates.
7. Confirm duplicate course and duplicate student protections trigger.
