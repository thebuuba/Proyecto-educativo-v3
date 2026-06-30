# Courses Module Design

## Context

AulaBase needs a first functional academic module after initial onboarding. The old idea of a broad "academic configuration" screen is being replaced by a focused `Cursos` module.

Initial onboarding already captures teacher and school information. The courses module must not ask for school data again.

The codebase already has these academic tables and module concepts:

- `grades`
- `sections`
- `subjects`
- `section_subjects`
- `school_years`

Existing modules such as Horario, Asistencia, Calificaciones, Planificación, and Matrícula already depend on section, subject, school year, or `section_subjects` relationships. Because of that, `section_subjects` should become the official course source instead of creating an independent course list.

## Goal

Create the `Cursos` module as the structural base for AulaBase. A course represents:

- Grade
- Section
- Level
- Shift
- Area
- Subject
- School year
- Optional internal code
- Optional observations

All future and existing modules should read course options from this same source.

## Non-Goals

- Do not ask for school name, regional, district, or other center data.
- Do not create a separate course table that duplicates `section_subjects`.
- Do not keep independent course lists inside Matrícula, Horario, Asistencia, Calificaciones, Planificación, Reportes, or AI features.
- Do not rebuild every dependent module in the first pass; design the contract so they can migrate cleanly.

## Data Model

Use `section_subjects` as the official course entity.

Add a new migration that extends `section_subjects` with:

- `shift` text, required, defaulting to the school shift or `extended`
- `area` text, required
- `internal_code` text, nullable
- `observations` text, nullable

Add a duplicate-prevention constraint for active course identity:

- `school_year_id`
- `grade_id`
- `section_id`
- `subject_id`
- `shift`

The user-facing duplicate rule is:

> The same grade, section, subject, and shift cannot exist twice in the same school year.

The backend should enforce this before saving and return a clear conflict message.

## Backend Design

Add a dedicated `courses` API/module that writes to the existing `grades`, `sections`, `subjects`, and `section_subjects` tables. The existing `grades-sections` module can remain for now, but `/cursos` should use the new course-oriented API.

Required operations:

- List courses for the current school year.
- Create a course.
- Update course fields.
- Duplicate a course into a new draft-like course payload, then save it as a real course after duplicate validation.
- Deactivate/delete a course.
- Return related-data counts used for delete warnings.

### Create Course Flow

When creating a course:

1. Resolve the current school year for the authenticated user's school.
2. Find or create the grade by school and grade name.
3. Find or create the section by grade and section name.
4. Find or create the subject by school and subject/code.
5. Check for an active duplicate `section_subject` with the same school year, section, subject, and shift.
6. Create the `section_subject` with area, shift, internal code, observations, and the current teacher if appropriate.

### Delete Behavior

Deletion should be soft delete by setting status to inactive.

Before deletion, the backend checks whether the course has related data:

- enrollments/students through the same section and school year
- schedule entries
- attendance records
- grade records
- planning entries

If related data exists, the response should include the counts and a warning message:

> Este curso contiene información relacionada. Si lo elimina perderá todos esos datos.

The first implementation requires an explicit `confirmRelatedData=true` flag before deactivating a course with related data.

## Frontend Design

The `/cursos` page becomes the first functional module screen.

It should have two main areas:

1. A compact course creation form.
2. A table of existing courses.

The design should feel like an operational tool, not a marketing page. It should be dense enough for repeated use, with clear labels, restrained visual styling, and predictable actions.

## Course Form

Fields:

- Grado: dropdown
- Sección: dropdown or short text
- Nivel: auto-filled from onboarding/school setup, editable
- Tanda: dropdown
- Área: dropdown from Dominican curriculum areas
- Asignatura: dropdown filtered by selected area
- Código interno: optional
- Observaciones: optional

Primary button:

- `Crear curso`

The initial grade and section options can include common Dominican school values while still allowing short text entry where the current data does not exist yet.

## Dominican Curriculum Catalog

Use a local curriculum catalog in the first pass. It can live in shared/frontend code or backend code depending on implementation needs.

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

Subjects are filtered by area. Examples:

- Lengua Española -> Lengua Española
- Ciencias Naturales -> Biología, Química, Física, Ciencias de la Tierra
- Ciencias Sociales -> Ciencias Sociales, Historia, Geografía, Educación Ciudadana
- Lenguas Extranjeras -> Inglés, Francés

The catalog can later move into database tables if the curriculum needs tenant-level customization.

## Courses Table

Each row shows:

- Grade
- Section
- Area
- Subject
- Shift
- Student count
- Actions

Actions:

- Editar
- Duplicar
- Eliminar
- Ver matrícula
- Ver horario

`Ver matrícula` navigates to the enrollment module filtered to the course. `Ver horario` navigates to the schedule module filtered to the course.

If the target module does not yet support filtering by course, the link can include query params now and the receiving module can adopt them later.

## Integration Contract

Other modules must use this course source:

- Matrícula lists courses from active `section_subjects` or a course list endpoint.
- Horario lists courses from active `section_subjects`.
- Asistencia lists courses from active `section_subjects`.
- Calificaciones lists courses from active `section_subjects`.
- Planificación lists courses from active `section_subjects`.
- Reportes and AI features use the same course identifiers.

The stable course identifier is `section_subjects.id`.

Modules that still need section-level behavior can derive section and grade from the course record.

## Permissions

For the first implementation, allow:

- `admin`
- `director`
- `coordinator`
- `teacher`

Teachers can create their own taught courses because AulaBase is teacher-centered. Later role restrictions can distinguish school-wide admins from individual teachers.

## Error Handling

Required field errors should be shown inline in the form.

Duplicate courses should show a clear message:

> Ya existe un curso con ese grado, sección, asignatura y tanda para este año escolar.

Delete warnings should show related-data counts when available.

Unexpected backend failures should remain short and user-readable.

## Testing

Backend tests:

- Creates a course by reusing or creating grade, section, and subject.
- Rejects duplicate course identity.
- Lists courses with student counts.
- Soft-deletes a course without related data.
- Requires confirmation when related data exists.

Frontend verification:

- Area selection filters subjects.
- Required fields block submit.
- Creating a course refreshes the table.
- Duplicate errors display clearly.
- Edit, duplicate, delete, matrícula, and horario actions are visible.

Manual end-to-end verification:

- Create `3ro Secundaria / A / Lengua Española / Matutina`.
- Attempt to create the same course again and confirm it is rejected.
- Create `5to Secundaria / B / Ciencias Naturales / Biología / Extendida`.
- Confirm both appear in the table with `0` students.
