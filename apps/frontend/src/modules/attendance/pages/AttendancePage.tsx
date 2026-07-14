import { AlertCircle, CalendarCheck, RefreshCw } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { AttendanceGrid } from '@/modules/attendance/components/AttendanceGrid'
import { AttendanceSummary } from '@/modules/attendance/components/AttendanceSummary'
import { useAttendance } from '@/modules/attendance/hooks/useAttendance'
import {
  getCalendarYearForSchoolMonth,
  maxMonthlyClassPositions,
  schoolYearMonths,
} from '@/modules/attendance/utils/monthlyAttendance'
import type { EnrollmentCourse } from '@/modules/students/types'

type CourseGroup = {
  label: string
  courses: EnrollmentCourse[]
}

export function AttendancePage() {
  const {
    courses,
    selectedCourse,
    selectedCourseId,
    setSelectedCourseId,
    selectedMonth,
    setSelectedMonth,
    workedDays,
    monthlyRows,
    monthlyStats,
    loading,
    saving,
    error,
    toggleCell,
    refresh,
  } = useAttendance()
  const groupedCourses = useMemo(() => groupCoursesForSelect(courses), [courses])
  const selectedMonthInfo = schoolYearMonths.find((month) => month.value === selectedMonth) ?? schoolYearMonths[0]
  const selectedYear = getCalendarYearForSchoolMonth(selectedMonth, selectedCourse?.schoolYearName)

  return (
    <section className="w-full min-w-0">
      <div className="mb-6 space-y-5">
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-3xl font-bold leading-none text-primary sm:text-4xl">
              Asistencia
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Registro mensual por asignatura.
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_auto] lg:items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Curso
            </label>
            <Select
              value={selectedCourseId}
              onChange={(event) => setSelectedCourseId(event.target.value)}
              className="w-full"
            >
              <option value="">
                {courses.length > 0 ? 'Selecciona un curso' : 'No hay cursos disponibles'}
              </option>
              {groupedCourses.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.gradeName} {course.sectionName} · {course.subjectName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Mes
            </label>
            <Select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-full"
            >
              {schoolYearMonths.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Select>
          </div>

          <Button variant="outline" className="h-12 px-5" onClick={refresh}>
            <RefreshCw className="size-4" />
            Actualizar
          </Button>
        </div>

        {selectedCourse ? (
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="rounded-2xl bg-primary px-6 py-5 text-primary-foreground shadow-md">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/70">
              Curso seleccionado
            </p>
            <h2 className="mt-2 text-xl font-bold leading-tight">
              {selectedCourse.gradeName} {selectedCourse.sectionName} · {selectedCourse.subjectName}
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/75">
              Año escolar {selectedCourse.schoolYearName || 'activo'}
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarCheck className="size-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Mes actual
              </p>
              <p className="mt-1 text-xl font-black text-primary">{selectedMonthInfo.label}</p>
              <p className="text-sm font-semibold text-muted-foreground">{selectedYear}</p>
            </div>
          </div>
          </div>
        ) : null}

        <AttendanceSummary stats={monthlyStats} loading={loading} maxWorkedDays={maxMonthlyClassPositions} />

        {error ? (
          <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}
      </div>

      {!selectedCourseId && !loading ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Selecciona un curso para ver su registro mensual de asistencia.
          </p>
        </div>
      ) : loading ? (
        <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
          Cargando asistencia mensual...
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {saving ? 'Guardando...' : 'Clic: vacío → P → A → E → R → vacío'}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
              <span>P = Presente</span>
              <span>A = Ausente</span>
              <span>E = Excusa</span>
              <span>R = Retirado</span>
              <span>Vacio = Sin registro</span>
            </div>
          </div>
          <AttendanceGrid
            rows={monthlyRows}
            workedDays={workedDays}
            saving={saving}
            onToggle={toggleCell}
          />
        </div>
      )}
    </section>
  )
}

function groupCoursesForSelect(courses: EnrollmentCourse[]): CourseGroup[] {
  const groups = new Map<string, EnrollmentCourse[]>()

  ;[...courses].sort(compareCourses).forEach((course) => {
    const level = getCourseLevelLabel(course)
    const group = groups.get(level) ?? []
    group.push(course)
    groups.set(level, group)
  })

  return ['Nivel Primario', 'Nivel Secundario', 'Otros cursos']
    .map((label) => ({ label, courses: groups.get(label) ?? [] }))
    .filter((group) => group.courses.length > 0)
}

function compareCourses(first: EnrollmentCourse, second: EnrollmentCourse) {
  const levelDiff = getLevelOrder(first) - getLevelOrder(second)
  if (levelDiff !== 0) return levelDiff

  const gradeDiff = getGradeOrder(first) - getGradeOrder(second)
  if (gradeDiff !== 0) return gradeDiff

  const sectionDiff = first.sectionName.localeCompare(second.sectionName, 'es', { numeric: true })
  if (sectionDiff !== 0) return sectionDiff

  return first.subjectName.localeCompare(second.subjectName, 'es', { numeric: true })
}

function getCourseLevelLabel(course: EnrollmentCourse) {
  const normalizedLevel = normalizeText(course.academicLevelName)
  const normalizedGrade = normalizeText(course.gradeName)

  if (normalizedLevel.includes('prim') || normalizedGrade.includes('prim')) return 'Nivel Primario'
  if (normalizedLevel.includes('sec') || normalizedGrade.includes('sec')) return 'Nivel Secundario'
  return 'Otros cursos'
}

function getLevelOrder(course: EnrollmentCourse) {
  const label = getCourseLevelLabel(course)
  if (label === 'Nivel Primario') return 1
  if (label === 'Nivel Secundario') return 2
  return 3
}

function getGradeOrder(course: EnrollmentCourse) {
  if (typeof course.gradeSequence === 'number') return course.gradeSequence
  const match = course.gradeName.match(/\d+/)
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
