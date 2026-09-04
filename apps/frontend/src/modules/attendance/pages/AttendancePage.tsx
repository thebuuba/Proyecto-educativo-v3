import { ArrowLeft, CalendarCheck, RefreshCw } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FeedbackBanner, FilterBar, PageHero, StatusBadge } from '@/components/ui/SemanticUI'
import { Select } from '@/components/ui/Select'
import { AttendanceGrid } from '@/modules/attendance/components/AttendanceGrid'
import { AttendanceSummary } from '@/modules/attendance/components/AttendanceSummary'
import { useAttendance } from '@/modules/attendance/hooks/useAttendance'
import { getCalendarYearForSchoolMonth, schoolYearMonths } from '@/modules/attendance/utils/monthlyAttendance'
import type { EnrollmentCourse } from '@/modules/students/types'

type CourseGroup = { label: string; courses: EnrollmentCourse[] }

export function AttendancePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
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
  const requestedCourseId = searchParams.get('sectionSubjectId')
  const returnCourseId = searchParams.get('returnCourseId')
  const returnSubjectId = searchParams.get('returnSubjectId')
  const returnsToSubject = searchParams.get('origin') === 'subject' && Boolean(returnCourseId && returnSubjectId)

  useEffect(() => {
    if (requestedCourseId && requestedCourseId !== selectedCourseId && courses.some((course) => course.id === requestedCourseId)) {
      setSelectedCourseId(requestedCourseId)
    }
  }, [courses, requestedCourseId, selectedCourseId, setSelectedCourseId])

  const returnToSubject = () => {
    if (!returnCourseId || !returnSubjectId) return
    navigate(`/cursos?${new URLSearchParams({ courseId: returnCourseId, subjectId: returnSubjectId }).toString()}`)
  }

  return (
    <section className="w-full min-w-0 space-y-4 pb-10">
      <PageHero
        title="Asistencia"
        description="Registro mensual por asignatura. Marca el estado de cada estudiante y consulta el progreso del mes."
        icon={CalendarCheck}
        tone="success"
        actions={returnsToSubject ? (
          <Button variant="outline" onClick={returnToSubject}><ArrowLeft className="size-4" /> Volver a la asignatura</Button>
        ) : undefined}
      >
        <div className="flex flex-wrap items-center gap-2">
          {selectedCourse ? <StatusBadge tone="info">{selectedCourse.gradeName} {selectedCourse.sectionName} · {selectedCourse.subjectName}</StatusBadge> : <StatusBadge tone="warning">Selecciona un curso</StatusBadge>}
          <StatusBadge tone="warning">{selectedMonthInfo.label} {selectedYear}</StatusBadge>
        </div>
      </PageHero>

      <FilterBar className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_auto] lg:items-end">
        <label className="grid min-w-0 gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Curso</span>
          <Select value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value)} className="h-11 w-full">
            <option value="">{courses.length > 0 ? 'Selecciona un curso' : 'No hay cursos disponibles'}</option>
            {groupedCourses.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.courses.map((course) => <option key={course.id} value={course.id}>{course.gradeName} {course.sectionName} · {course.subjectName}</option>)}
              </optgroup>
            ))}
          </Select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Mes</span>
          <Select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="h-11 w-full">
            {schoolYearMonths.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
          </Select>
        </label>

        <Button variant="outline" onClick={refresh}><RefreshCw className="size-4" /> Actualizar</Button>
      </FilterBar>

      {selectedCourse ? (
        <section className="rounded-3xl bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Curso seleccionado</p>
              <h2 className="mt-1 truncate text-lg font-black tracking-tight text-foreground">{selectedCourse.gradeName} {selectedCourse.sectionName} · {selectedCourse.subjectName}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Año escolar {selectedCourse.schoolYearName || 'activo'}</p>
            </div>
            <div className="rounded-2xl bg-warning/20 px-4 py-3 sm:min-w-[12rem]">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Mes del registro</p>
              <div className="mt-1 flex items-baseline gap-2"><span className="text-base font-black text-foreground">{selectedMonthInfo.label}</span><span className="text-xs font-semibold text-muted-foreground">{selectedYear}</span></div>
            </div>
          </div>
        </section>
      ) : null}

      <AttendanceSummary stats={monthlyStats} loading={loading} />

      {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}

      {!selectedCourseId && !loading ? (
        <EmptyState title="Selecciona un curso" description="Elige un curso para ver su registro mensual de asistencia." icon={CalendarCheck} tone="success" />
      ) : loading ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-3xl bg-card text-sm font-medium text-muted-foreground shadow-sm">Cargando asistencia mensual...</div>
      ) : (
        <AttendanceGrid rows={monthlyRows} workedDays={workedDays} saving={saving} onToggle={toggleCell} />
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
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}
