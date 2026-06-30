# Enrollment Course-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize `Matrícula` so students are added, imported, viewed, edited, withdrawn, and transferred inside a selected course instead of through a general analytics screen.

**Architecture:** Use the existing academic source (`section_subjects` with `grades`, `sections`, `subjects`, and `school_years`) as the course list for this phase. Add course-scoped student/enrollment endpoints under the existing `students` backend module, then replace the frontend `StudentsPage` with a course-first enrollment UI that reuses focused components.

**Tech Stack:** NestJS + Prisma backend, React + TypeScript + Vite frontend, Vitest backend tests, existing `apiClient` and UI components.

## Global Constraints

- Sidebar label remains `Matrícula`; do not rename it to `Estudiantes`.
- Do not show Asistencia, Promedio general, En riesgo, Distribución por estado, or Notificar a padres in Matrícula.
- No student actions are available until a course is selected.
- Student form requires only code/matrícula and full name.
- Optional student fields live under `Más información del estudiante`, collapsed by default.
- Bulk import is paste-based and supports `code - name`, `code, name`, and `name` formats.
- Students must be linked to the selected course.
- Duplicate student codes inside the selected course are blocked.
- Do not create loose student workflows in this module.
- Use `pnpm`; do not create `npm` or `yarn` lockfiles.

---

## File Structure

- Modify `apps/backend/src/modules/students/dto/create-student.dto.ts`
  - Make `birthDate` optional for fast enrollment.
- Create `apps/backend/src/modules/students/dto/course-enrollment.dto.ts`
  - DTOs for course-scoped single-student creation and paste import.
- Modify `apps/backend/src/modules/students/students.service.ts`
  - Add course lookup, course list, students-by-course, create-in-course, import preview, import confirm, and duplicate checks.
- Modify `apps/backend/src/modules/students/students.controller.ts`
  - Add course-scoped enrollment routes before `:id` routes.
- Modify `apps/backend/src/modules/students/students.service.spec.ts`
  - Add focused backend tests for course-first enrollment.
- Modify `apps/frontend/src/modules/students/types/index.ts`
  - Add enrollment course, course-scoped student, full-name input, import preview types.
- Modify `apps/frontend/src/modules/students/services/studentsService.ts`
  - Add API calls for enrollment courses, course students, create-in-course, import preview, import confirm.
- Create `apps/frontend/src/modules/students/utils/pasteImport.ts`
  - Parse pasted student lists on the client for immediate preview display.
- Modify `apps/frontend/src/modules/students/components/StudentForm.tsx`
  - Convert to quick full-name form with collapsed optional fields.
- Replace `apps/frontend/src/modules/students/components/ImportStudentsModal.tsx`
  - Change CSV upload modal to paste-based course import modal.
- Modify `apps/frontend/src/modules/students/components/StudentsTable.tsx`
  - Ensure table can render compact course-scoped columns/actions.
- Modify `apps/frontend/src/modules/students/pages/StudentsPage.tsx`
  - Replace analytics dashboard with course selector, course summary, actions, and course student table.

---

### Task 1: Backend Course-Scoped Enrollment Contracts

**Files:**
- Modify: `apps/backend/src/modules/students/dto/create-student.dto.ts`
- Create: `apps/backend/src/modules/students/dto/course-enrollment.dto.ts`
- Test: `apps/backend/src/modules/students/students.service.spec.ts`

**Interfaces:**
- Produces `CreateCourseStudentDto`, `ImportCourseStudentsPreviewDto`, `ImportCourseStudentsDto`.
- Produces optional `birthDate` in `CreateStudentDto` so fast enrollment can save with only code and name.

- [ ] **Step 1: Write failing DTO/service tests**

Add tests in `apps/backend/src/modules/students/students.service.spec.ts` for the service methods that will be created in Task 2:

```ts
it('lists courses available for enrollment with student counts', async () => {
  mocks.prisma.sectionSubject.findMany.mockResolvedValue([
    {
      id: 'course-1',
      schoolYearId: 'year-1',
      gradeId: 'grade-1',
      sectionId: 'section-1',
      subjectId: 'subject-1',
      status: 'ACTIVE',
      grade: { id: 'grade-1', name: '3ro Secundaria', level: 'Nivel Secundario' },
      section: { id: 'section-1', name: 'A' },
      subject: { id: 'subject-1', name: 'Lengua Española', code: 'LEN' },
      schoolYear: { id: 'year-1', name: '2026-2027' },
    },
  ])
  mocks.prisma.enrollment.count.mockResolvedValue(2)

  const result = await createService().getEnrollmentCourses('school-1')

  expect(result).toEqual([
    expect.objectContaining({
      id: 'course-1',
      label: '3ro Secundaria A - Lengua Española - 2026-2027',
      studentCount: 2,
    }),
  ])
})
```

Add this duplicate test:

```ts
it('rejects duplicate student code inside the same course', async () => {
  mockCourse()
  mocks.prisma.student.findFirst.mockResolvedValue({ id: 'student-1', studentCode: '2026001' })
  mocks.prisma.enrollment.findFirst.mockResolvedValue({ id: 'enrollment-1' })

  await expect(
    createService().createStudentInCourse('school-1', 'course-1', {
      studentCode: '2026001',
      fullName: 'Juan Pérez',
    }),
  ).rejects.toThrow('Ya existe un estudiante con esta matrícula en este curso.')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\corepack.cmd' pnpm --filter backend test -- students.service.spec.ts
```

Expected: FAIL because `getEnrollmentCourses` and `createStudentInCourse` do not exist.

- [ ] **Step 3: Make `birthDate` optional**

Update `apps/backend/src/modules/students/dto/create-student.dto.ts`:

```ts
  @IsOptional()
  @IsDateString()
  birthDate?: string
```

- [ ] **Step 4: Create course enrollment DTOs**

Create `apps/backend/src/modules/students/dto/course-enrollment.dto.ts`:

```ts
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCourseStudentDto {
  @IsString()
  @MinLength(1)
  studentCode!: string

  @IsString()
  @MinLength(1)
  fullName!: string

  @IsOptional()
  @IsString()
  documentId?: string

  @IsOptional()
  @IsString()
  birthDate?: string

  @IsOptional()
  @IsString()
  gender?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  guardianPhone?: string

  @IsOptional()
  @IsString()
  guardianEmail?: string

  @IsOptional()
  @IsString()
  observations?: string

  @IsOptional()
  @IsString()
  status?: string
}

export class ImportCourseStudentRowDto {
  @IsOptional()
  @IsString()
  studentCode?: string

  @IsString()
  @MinLength(1)
  fullName!: string
}

export class ImportCourseStudentsPreviewDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportCourseStudentRowDto)
  students!: ImportCourseStudentRowDto[]
}

export class ImportCourseStudentsDto extends ImportCourseStudentsPreviewDto {}
```

- [ ] **Step 5: Run backend tests**

Run the same backend test command.

Expected: still FAIL until Task 2 implements service methods.

---

### Task 2: Backend Course-Scoped Enrollment Service

**Files:**
- Modify: `apps/backend/src/modules/students/students.service.ts`
- Modify: `apps/backend/src/modules/students/students.service.spec.ts`

**Interfaces:**
- Consumes DTOs from Task 1.
- Produces service methods:
  - `getEnrollmentCourses(schoolId: string): Promise<EnrollmentCourse[]>`
  - `getStudentsByCourse(schoolId: string, courseId: string): Promise<CourseStudent[]>`
  - `createStudentInCourse(schoolId: string, courseId: string, dto: CreateCourseStudentDto): Promise<CourseStudent>`
  - `previewCourseImport(schoolId: string, courseId: string, rows: ImportCourseStudentRowDto[]): Promise<ImportPreview>`
  - `importStudentsInCourse(schoolId: string, courseId: string, rows: ImportCourseStudentRowDto[]): Promise<ImportResult>`

- [ ] **Step 1: Add helper types and functions**

Add near the top of `students.service.ts`:

```ts
const FAST_ENROLLMENT_BIRTH_DATE = new Date('2000-01-01T00:00:00')

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || fullName.trim()
  const lastName = parts.join(' ') || 'Sin apellido'
  return { firstName, lastName }
}

function toRecordStatus(status?: string) {
  if (status === 'retired' || status === 'withdrawn') return 'INACTIVE'
  if (status === 'transferred') return 'INACTIVE'
  return 'ACTIVE'
}
```

- [ ] **Step 2: Implement course lookup**

Add a private method inside `StudentsService`:

```ts
  private async getCourseOrThrow(schoolId: string, courseId: string) {
    const course = await prisma.sectionSubject.findFirst({
      where: { id: courseId, schoolId, status: 'ACTIVE' },
    })

    if (!course) throw new NotFoundException('Course not found')
    return course
  }
```

- [ ] **Step 3: Implement `getEnrollmentCourses`**

```ts
  async getEnrollmentCourses(schoolId: string) {
    const courses = await prisma.sectionSubject.findMany({
      where: { schoolId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    })

    const [grades, sections, subjects, schoolYears] = await Promise.all([
      prisma.grade.findMany({ where: { schoolId, id: { in: courses.map((course) => course.gradeId) } } }),
      prisma.section.findMany({ where: { schoolId, id: { in: courses.map((course) => course.sectionId) } } }),
      prisma.subject.findMany({ where: { schoolId, id: { in: courses.map((course) => course.subjectId) } } }),
      prisma.schoolYear.findMany({ where: { schoolId, id: { in: courses.map((course) => course.schoolYearId) } } }),
    ])

    const gradeById = new Map(grades.map((item) => [item.id, item]))
    const sectionById = new Map(sections.map((item) => [item.id, item]))
    const subjectById = new Map(subjects.map((item) => [item.id, item]))
    const schoolYearById = new Map(schoolYears.map((item) => [item.id, item]))

    return Promise.all(courses.map(async (course) => {
      const studentCount = await prisma.enrollment.count({
        where: {
          schoolId,
          schoolYearId: course.schoolYearId,
          gradeId: course.gradeId,
          sectionId: course.sectionId,
          status: 'ACTIVE',
        },
      })
      const gradeName = gradeById.get(course.gradeId)?.name ?? ''
      const sectionName = sectionById.get(course.sectionId)?.name ?? ''
      const subjectName = subjectById.get(course.subjectId)?.name ?? ''
      const schoolYearName = schoolYearById.get(course.schoolYearId)?.name ?? ''
      const courseMeta = course as any
      return {
        id: course.id,
        gradeId: course.gradeId,
        sectionId: course.sectionId,
        subjectId: course.subjectId,
        schoolYearId: course.schoolYearId,
        gradeName,
        sectionName,
        area: typeof courseMeta.area === 'string' ? courseMeta.area : subjectName,
        subjectName,
        shift: typeof courseMeta.shift === 'string' ? courseMeta.shift : '',
        schoolYearName,
        studentCount,
        label: `${gradeName} ${sectionName} - ${subjectName} - ${schoolYearName}`.trim(),
      }
    }))
  }
```

- [ ] **Step 4: Implement `getStudentsByCourse`**

```ts
  async getStudentsByCourse(schoolId: string, courseId: string) {
    const course = await this.getCourseOrThrow(schoolId, courseId)
    const enrollments = await prisma.enrollment.findMany({
      where: {
        schoolId,
        schoolYearId: course.schoolYearId,
        gradeId: course.gradeId,
        sectionId: course.sectionId,
        status: 'ACTIVE',
      },
    })
    const studentIds = enrollments.map((item) => item.studentId)
    if (studentIds.length === 0) return []

    const students = await prisma.student.findMany({
      where: { schoolId, id: { in: studentIds } },
      orderBy: { lastName: 'asc' },
    })
    const enrollmentByStudentId = new Map(enrollments.map((item) => [item.studentId, item]))

    return students.map((student) => ({
      ...student,
      status: String(student.status).toLowerCase(),
      fullName: `${student.firstName} ${student.lastName}`.trim(),
      enrollmentId: enrollmentByStudentId.get(student.id)?.id ?? null,
    }))
  }
```

- [ ] **Step 5: Implement duplicate check and create-in-course**

```ts
  private async assertStudentCodeAvailableInCourse(schoolId: string, course: any, studentCode: string) {
    const existingStudent = await prisma.student.findFirst({ where: { schoolId, studentCode } })
    if (!existingStudent) return

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId: existingStudent.id,
        schoolYearId: course.schoolYearId,
        gradeId: course.gradeId,
        sectionId: course.sectionId,
        status: 'ACTIVE',
      },
    })

    if (existingEnrollment) {
      throw new BadRequestException('Ya existe un estudiante con esta matrícula en este curso.')
    }
  }

  async createStudentInCourse(schoolId: string, courseId: string, dto: any) {
    const course = await this.getCourseOrThrow(schoolId, courseId)
    await this.assertStudentCodeAvailableInCourse(schoolId, course, dto.studentCode)
    const { firstName, lastName } = splitFullName(dto.fullName)

    const student = await prisma.$transaction(async (tx) => {
      const created = await tx.student.create({
        data: {
          schoolId,
          studentCode: dto.studentCode,
          firstName,
          lastName,
          documentId: dto.documentId || null,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : FAST_ENROLLMENT_BIRTH_DATE,
          gender: dto.gender || null,
          address: dto.address || null,
          status: toRecordStatus(dto.status) as any,
        },
      })
      await tx.enrollment.create({
        data: {
          schoolId,
          studentId: created.id,
          schoolYearId: course.schoolYearId,
          gradeId: course.gradeId,
          sectionId: course.sectionId,
          status: 'ACTIVE',
        },
      })
      return created
    })

    return { ...student, fullName: `${student.firstName} ${student.lastName}`.trim() }
  }
```

- [ ] **Step 6: Implement import preview and import**

```ts
  async previewCourseImport(schoolId: string, courseId: string, rows: any[]) {
    const course = await this.getCourseOrThrow(schoolId, courseId)
    const seenCodes = new Set<string>()
    const preview = []

    for (const [index, row] of rows.entries()) {
      const studentCode = cleanText(row.studentCode)
      const fullName = cleanText(row.fullName)
      const errors: string[] = []
      const duplicate = studentCode ? seenCodes.has(studentCode) : false
      if (!fullName) errors.push('Nombre requerido.')
      if (studentCode) seenCodes.add(studentCode)
      if (studentCode) {
        const existingStudent = await prisma.student.findFirst({ where: { schoolId, studentCode } })
        if (existingStudent) {
          const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
              schoolId,
              studentId: existingStudent.id,
              schoolYearId: course.schoolYearId,
              gradeId: course.gradeId,
              sectionId: course.sectionId,
              status: 'ACTIVE',
            },
          })
          if (existingEnrollment) errors.push('Ya existe en este curso.')
        }
      }
      preview.push({ rowNumber: index + 1, studentCode, fullName, duplicate, errors })
    }

    return {
      rows: preview,
      detectedStudents: preview.filter((row) => row.fullName).length,
      detectedCodes: preview.filter((row) => row.studentCode).length,
      duplicates: preview.filter((row) => row.duplicate || row.errors.some((error) => error.includes('existe'))).length,
      errors: preview.reduce((count, row) => count + row.errors.length, 0),
    }
  }

  async importStudentsInCourse(schoolId: string, courseId: string, rows: any[]) {
    const preview = await this.previewCourseImport(schoolId, courseId, rows)
    const validRows = preview.rows.filter((row) => row.fullName && row.errors.length === 0)
    let imported = 0
    const errors: { row: number; reason: string }[] = []

    for (const row of validRows) {
      try {
        await this.createStudentInCourse(schoolId, courseId, {
          studentCode: row.studentCode || `TEMP-${Date.now()}-${row.rowNumber}`,
          fullName: row.fullName,
        })
        imported += 1
      } catch (error) {
        errors.push({ row: row.rowNumber, reason: error instanceof Error ? error.message : 'No se pudo importar.' })
      }
    }

    return { imported, errors }
  }
```

- [ ] **Step 7: Run backend tests**

Run:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\corepack.cmd' pnpm --filter backend test -- students.service.spec.ts
```

Expected: PASS for new students service tests.

---

### Task 3: Backend Course-Scoped Routes

**Files:**
- Modify: `apps/backend/src/modules/students/students.controller.ts`
- Test: `apps/backend/src/modules/students/students.service.spec.ts`

**Interfaces:**
- Consumes service methods from Task 2.
- Produces endpoints:
  - `GET /students/enrollment-courses`
  - `GET /students/courses/:courseId/students`
  - `POST /students/courses/:courseId/students`
  - `POST /students/courses/:courseId/import-preview`
  - `POST /students/courses/:courseId/import`

- [ ] **Step 1: Add imports**

Update controller imports:

```ts
import {
  CreateCourseStudentDto,
  ImportCourseStudentsDto,
  ImportCourseStudentsPreviewDto,
} from './dto/course-enrollment.dto'
```

- [ ] **Step 2: Add routes before `@Get(':id')`**

```ts
  @Get('enrollment-courses')
  getEnrollmentCourses(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.getEnrollmentCourses(user.schoolId)
  }

  @Get('courses/:courseId/students')
  getStudentsByCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
  ) {
    return this.studentsService.getStudentsByCourse(user.schoolId, courseId)
  }

  @Post('courses/:courseId/students')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  createStudentInCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseStudentDto,
  ) {
    return this.studentsService.createStudentInCourse(user.schoolId, courseId, dto)
  }

  @Post('courses/:courseId/import-preview')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  previewCourseImport(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Body() dto: ImportCourseStudentsPreviewDto,
  ) {
    return this.studentsService.previewCourseImport(user.schoolId, courseId, dto.students)
  }

  @Post('courses/:courseId/import')
  @Roles('admin', 'director', 'coordinator', 'teacher')
  importStudentsInCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Body() dto: ImportCourseStudentsDto,
  ) {
    return this.studentsService.importStudentsInCourse(user.schoolId, courseId, dto.students)
  }
```

- [ ] **Step 3: Run backend build**

Run:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\corepack.cmd' pnpm --filter backend build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add apps/backend/src/modules/students
git commit -m "feat: add course-scoped enrollment api"
```

---

### Task 4: Frontend Enrollment Service And Parsing Utilities

**Files:**
- Modify: `apps/frontend/src/modules/students/types/index.ts`
- Modify: `apps/frontend/src/modules/students/services/studentsService.ts`
- Create: `apps/frontend/src/modules/students/utils/pasteImport.ts`

**Interfaces:**
- Produces frontend types:
  - `EnrollmentCourse`
  - `CourseStudent`
  - `CreateCourseStudentInput`
  - `CourseImportPreview`
- Produces functions:
  - `getEnrollmentCourses()`
  - `getStudentsByCourse(courseId)`
  - `createStudentInCourse(courseId, input)`
  - `previewCourseStudentImport(courseId, rows)`
  - `importStudentsInCourse(courseId, rows)`
  - `parsePastedStudents(text)`

- [ ] **Step 1: Add types**

Append to `apps/frontend/src/modules/students/types/index.ts`:

```ts
export type EnrollmentCourse = {
  id: string
  gradeId: string
  sectionId: string
  subjectId: string
  schoolYearId: string
  gradeName: string
  sectionName: string
  area: string
  subjectName: string
  shift: string
  schoolYearName: string
  studentCount: number
  label: string
}

export type CourseStudent = Student & {
  fullName: string
  enrollmentId: string | null
}

export type CreateCourseStudentInput = {
  studentCode: string
  fullName: string
  documentId?: string
  birthDate?: string
  gender?: string
  address?: string
  guardianPhone?: string
  guardianEmail?: string
  observations?: string
  status?: 'active' | 'retired' | 'transferred'
}

export type ImportCourseStudentRow = {
  studentCode?: string
  fullName: string
}

export type CourseImportPreviewRow = ImportCourseStudentRow & {
  rowNumber: number
  duplicate: boolean
  errors: string[]
}

export type CourseImportPreview = {
  rows: CourseImportPreviewRow[]
  detectedStudents: number
  detectedCodes: number
  duplicates: number
  errors: number
}
```

- [ ] **Step 2: Add service calls**

Extend the existing type import at the top of `studentsService.ts` with the new types, then append the service functions near the other exported API functions:

```ts
export async function getEnrollmentCourses(): Promise<EnrollmentCourse[]> {
  return api.get<EnrollmentCourse[]>('/students/enrollment-courses')
}

export async function getStudentsByCourse(courseId: string): Promise<CourseStudent[]> {
  return api.get<CourseStudent[]>(`/students/courses/${courseId}/students`)
}

export async function createStudentInCourse(
  courseId: string,
  input: CreateCourseStudentInput,
): Promise<CourseStudent> {
  return api.post<CourseStudent>(`/students/courses/${courseId}/students`, input)
}

export async function previewCourseStudentImport(
  courseId: string,
  students: ImportCourseStudentRow[],
): Promise<CourseImportPreview> {
  return api.post<CourseImportPreview>(`/students/courses/${courseId}/import-preview`, { students })
}

export async function importStudentsInCourse(
  courseId: string,
  students: ImportCourseStudentRow[],
): Promise<{ imported: number; errors: { row: number; reason: string }[] }> {
  return api.post(`/students/courses/${courseId}/import`, { students })
}
```

- [ ] **Step 3: Create paste parser**

Create `apps/frontend/src/modules/students/utils/pasteImport.ts`:

```ts
import type { ImportCourseStudentRow } from '@/modules/students/types'

export function parsePastedStudents(text: string): ImportCourseStudentRow[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes(' - ')) {
        const [studentCode, ...nameParts] = line.split(' - ')
        return { studentCode: studentCode.trim(), fullName: nameParts.join(' - ').trim() }
      }
      if (line.includes(',')) {
        const [studentCode, ...nameParts] = line.split(',')
        return { studentCode: studentCode.trim(), fullName: nameParts.join(',').trim() }
      }
      return { fullName: line }
    })
}
```

- [ ] **Step 4: Run frontend build**

Run:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\corepack.cmd' pnpm --filter frontend build
```

Expected: PASS.

---

### Task 5: Quick Student Modal And Paste Import Modal

**Files:**
- Modify: `apps/frontend/src/modules/students/components/StudentForm.tsx`
- Replace: `apps/frontend/src/modules/students/components/ImportStudentsModal.tsx`

**Interfaces:**
- Consumes `CreateCourseStudentInput`, `ImportCourseStudentRow`, `CourseImportPreview`.
- Produces course-first UI components used by `StudentsPage`.

- [ ] **Step 1: Rewrite `StudentForm` state and submit**

Change `StudentForm` to capture `fullName` and optional fields. Keep prop name `onSubmit`, but make its input `CreateCourseStudentInput`.

Core submit logic:

```ts
if (!studentCode.trim() || !fullName.trim()) {
  setValidationError('Completa código o matrícula y nombre completo.')
  return
}

await onSubmit({
  studentCode: studentCode.trim(),
  fullName: fullName.trim(),
  documentId: documentId.trim() || undefined,
  birthDate: birthDate || undefined,
  gender: gender || undefined,
  address: address.trim() || undefined,
  guardianPhone: guardianPhone.trim() || undefined,
  guardianEmail: guardianEmail.trim() || undefined,
  observations: observations.trim() || undefined,
  status,
})
```

- [ ] **Step 2: Add collapsed optional section**

Use local state:

```ts
const [showMore, setShowMore] = useState(false)
```

Render a button:

```tsx
<button type="button" onClick={() => setShowMore((value) => !value)}>
  Más información del estudiante
</button>
```

Render optional fields only when `showMore` is true.

- [ ] **Step 3: Replace import modal with paste workflow**

The modal should contain:

```tsx
<textarea
  value={text}
  onChange={(event) => setText(event.target.value)}
  aria-label="Lista de estudiantes"
/>
```

On preview:

```ts
const parsedRows = parsePastedStudents(text)
const preview = await onPreview(parsedRows)
setPreview(preview)
```

On confirm:

```ts
await onImport(preview.rows.map(({ studentCode, fullName }) => ({ studentCode, fullName })))
```

- [ ] **Step 4: Run frontend build**

Run frontend build command.

Expected: PASS.

---

### Task 6: Replace Matrícula Page With Course-First UI

**Files:**
- Modify: `apps/frontend/src/modules/students/pages/StudentsPage.tsx`
- Modify: `apps/frontend/src/modules/students/components/StudentsTable.tsx`

**Interfaces:**
- Consumes service functions from Task 4.
- Consumes components from Task 5.
- Produces course-first `Matrícula` screen.

- [ ] **Step 1: Replace page data state**

In `StudentsPage`, remove metric calculations and notification state. Add:

```ts
const [courses, setCourses] = useState<EnrollmentCourse[]>([])
const [selectedCourseId, setSelectedCourseId] = useState('')
const [students, setStudents] = useState<CourseStudent[]>([])
const [loadingCourses, setLoadingCourses] = useState(true)
const [loadingStudents, setLoadingStudents] = useState(false)
const selectedCourse = courses.find((course) => course.id === selectedCourseId) ?? null
```

- [ ] **Step 2: Load courses**

```ts
useEffect(() => {
  let active = true
  setLoadingCourses(true)
  getEnrollmentCourses()
    .then((data) => {
      if (!active) return
      setCourses(data)
      setSelectedCourseId((current) => current || data[0]?.id || '')
    })
    .catch((error) => setActionError(error instanceof Error ? error.message : 'No se pudieron cargar los cursos.'))
    .finally(() => active && setLoadingCourses(false))
  return () => {
    active = false
  }
}, [])
```

- [ ] **Step 3: Load students for selected course**

```ts
useEffect(() => {
  if (!selectedCourseId) {
    setStudents([])
    return
  }
  setLoadingStudents(true)
  getStudentsByCourse(selectedCourseId)
    .then(setStudents)
    .catch((error) => setActionError(error instanceof Error ? error.message : 'No se pudo cargar la matrícula.'))
    .finally(() => setLoadingStudents(false))
}, [selectedCourseId])
```

- [ ] **Step 4: Render no-course empty state**

When `courses.length === 0`:

```tsx
<EmptyState
  title="Primero debes crear un curso"
  description="Primero debes crear un curso para poder matricular estudiantes."
  action={<Button asChild><Link to="/cursos">Ir a Cursos</Link></Button>}
/>
```

- [ ] **Step 5: Render selector and compact course header**

Use:

```tsx
<select value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value)}>
  <option value="">Selecciona un curso</option>
  {courses.map((course) => (
    <option key={course.id} value={course.id}>{course.label}</option>
  ))}
</select>
```

Header fields:

```tsx
<p>Grado: {selectedCourse.gradeName}</p>
<p>Sección: {selectedCourse.sectionName}</p>
<p>Área: {selectedCourse.area}</p>
<p>Asignatura: {selectedCourse.subjectName}</p>
<p>Tanda: {selectedCourse.shift}</p>
<p>Año escolar: {selectedCourse.schoolYearName}</p>
<p>Total: {students.length}</p>
```

- [ ] **Step 6: Wire create/import actions**

Create handler:

```ts
async function handleCreateStudent(input: CreateCourseStudentInput) {
  if (!selectedCourseId) return
  await createStudentInCourse(selectedCourseId, input)
  setStudents(await getStudentsByCourse(selectedCourseId))
  setIsFormOpen(false)
}
```

Import handlers:

```ts
async function handlePreviewImport(rows: ImportCourseStudentRow[]) {
  if (!selectedCourseId) throw new Error('Selecciona un curso.')
  return previewCourseStudentImport(selectedCourseId, rows)
}

async function handleImport(rows: ImportCourseStudentRow[]) {
  if (!selectedCourseId) throw new Error('Selecciona un curso.')
  const result = await importStudentsInCourse(selectedCourseId, rows)
  setStudents(await getStudentsByCourse(selectedCourseId))
  return result
}
```

- [ ] **Step 7: Simplify table actions**

`StudentsTable` should show compact columns:

- student code
- full name
- status
- actions: Editar, Retirar, Trasladar, Ver expediente

For first implementation:

```tsx
<button onClick={() => onEdit(student)}>Editar</button>
<button onClick={() => onDeactivate(student)}>Retirar</button>
<button onClick={() => onTransfer(student)}>Trasladar</button>
<button onClick={() => onView(student)}>Ver expediente</button>
```

`onView` opens the existing `StudentDetailPanel`. `onTransfer` opens the edit modal with `status: 'transferred'` and a target-course selector above the save button.

- [ ] **Step 8: Run frontend build**

Run frontend build command.

Expected: PASS.

- [ ] **Step 9: Commit**

```powershell
git add apps/frontend/src/modules/students
git commit -m "feat: reorganize enrollment by course"
```

---

### Task 7: Full Verification And Server Restart

**Files:**
- No source edits unless verification reveals a bug.

**Interfaces:**
- Verifies all previous tasks together.

- [ ] **Step 1: Run backend tests**

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\corepack.cmd' pnpm --filter backend test
```

Expected: all tests pass.

- [ ] **Step 2: Run backend build**

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\corepack.cmd' pnpm --filter backend build
```

Expected: TypeScript build passes.

- [ ] **Step 3: Run frontend build**

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path; & 'C:\Program Files\nodejs\corepack.cmd' pnpm --filter frontend build
```

Expected: Vite build passes.

- [ ] **Step 4: Restart backend**

```powershell
$backend = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($backend) { Stop-Process -Id $backend.OwningProcess -Force }
$node = 'C:\Program Files\nodejs\node.exe'
$workdir = (Resolve-Path -LiteralPath 'apps/backend').Path
Start-Process -FilePath $node -ArgumentList 'dist/main.js' -WorkingDirectory $workdir -WindowStyle Hidden -RedirectStandardOutput (Join-Path (Get-Location) 'backend.restart.log') -RedirectStandardError (Join-Path (Get-Location) 'backend.restart.err.log')
Start-Sleep -Seconds 2
Get-NetTCPConnection -LocalPort 3000 -State Listen
```

Expected: port `3000` listening.

- [ ] **Step 5: Verify frontend server**

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:5173/' | Select-Object StatusCode, StatusDescription
```

Expected: `200 OK`.

- [ ] **Step 6: Manual acceptance checks**

In the browser:

1. Open `http://localhost:5173/estudiantes`.
2. Confirm the sidebar still says `Matrícula`.
3. Confirm metrics cards are gone.
4. Confirm the first control is `Selecciona un curso`.
5. Select a course.
6. Confirm course header shows grade, section, area, subject, shift, year, and total.
7. Click `Agregar estudiante`.
8. Save with only code and full name.
9. Click `Importar estudiantes`.
10. Paste:

```text
2026001 - Juan Pérez
2026002, María Gómez
Ana Rodríguez
```

11. Confirm preview shows detected students, codes, errors, duplicates.
12. Confirm import and verify the table updates.

- [ ] **Step 7: Commit any verification fixes**

If fixes were needed:

```powershell
git add apps/backend/src/modules/students apps/frontend/src/modules/students
git commit -m "fix: verify course-first enrollment flow"
```
