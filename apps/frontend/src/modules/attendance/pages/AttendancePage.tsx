import { AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { AttendanceGrid } from '@/modules/attendance/components/AttendanceGrid'
import { AttendanceSummary } from '@/modules/attendance/components/AttendanceSummary'
import { useAttendance } from '@/modules/attendance/hooks/useAttendance'
import {
  schoolYearMonths,
} from '@/modules/attendance/utils/monthlyAttendance'

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
  const selectedMonthName = schoolYearMonths.find((month) => month.value === selectedMonth)?.label ?? ''

  return (
    <section className="w-full min-w-0">
      <div className="mb-8 space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Registro mensual
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
              Asistencia
            </h1>
            <p className="mt-3 text-base leading-6 text-muted-foreground">
              Control mensual por curso, estudiante y días trabajados.
            </p>
          </div>

          <Button variant="outline" className="h-12 px-5" onClick={refresh}>
            <RefreshCw className="size-4" />
            Actualizar
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
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
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.gradeName} {course.sectionName} · {course.subjectName}
                </option>
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
        </div>

        {selectedCourse ? (
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              Registro de asistencia
            </p>
            <h2 className="mt-3 text-2xl font-bold text-primary">
              {selectedCourse.gradeName} {selectedCourse.sectionName} · {selectedCourse.subjectName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Año escolar {selectedCourse.schoolYearName || 'activo'}
            </p>
          </div>
        ) : null}

        <AttendanceSummary stats={monthlyStats} loading={loading} />

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
            <p className="text-sm text-muted-foreground">
              {saving ? 'Guardando...' : 'Clic: vacío → P → A → E → R → vacío'}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
              <span>P = Presente</span>
              <span>A = Ausente</span>
              <span>E = Excusa</span>
              <span>R = Retirado</span>
            </div>
          </div>
          <AttendanceGrid
            rows={monthlyRows}
            workedDays={workedDays}
            subjectName={selectedCourse?.subjectName}
            courseName={selectedCourse ? `${selectedCourse.gradeName} ${selectedCourse.sectionName}` : ''}
            monthName={selectedMonthName}
            saving={saving}
            onToggle={toggleCell}
          />
        </div>
      )}
    </section>
  )
}
