import { AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { AttendanceGrid } from '@/modules/attendance/components/AttendanceGrid'
import { AttendanceSummary } from '@/modules/attendance/components/AttendanceSummary'
import { useAttendance } from '@/modules/attendance/hooks/useAttendance'

export function AttendancePage() {
  const {
    sections,
    selectedSectionId,
    setSelectedSectionId,
    date,
    setDate,
    students,
    stats,
    loading,
    saving,
    error,
    toggleStatus,
    refresh,
  } = useAttendance()

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-8 space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Control diario
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
              Asistencia
            </h1>
            <p className="mt-3 text-base leading-6 text-muted-foreground">
              Registro y consulta de asistencia por estudiante, grupo y periodo.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
            <Button
              variant="outline"
              className="h-12 px-5"
              onClick={refresh}
            >
              <RefreshCw className="size-4" />
              Actualizar
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Sección
            </label>
            <Select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full sm:w-72"
            >
              {sections.length === 0 ? (
                <option value="">No hay secciones disponibles</option>
              ) : (
                sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.gradeName} — {section.name}
                  </option>
                ))
              )}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Fecha
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-56"
            />
          </div>
        </div>

        <AttendanceSummary stats={stats} loading={loading} />

        {error ? (
          <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        {!selectedSectionId && !loading ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Selecciona una sección y fecha para registrar asistencia.
            </p>
          </div>
        ) : loading ? (
          <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
            Cargando estudiantes...
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {saving ? 'Guardando...' : 'Haz clic en el estado para marcarlo'}
              </p>
            </div>
            <AttendanceGrid
              students={students}
              saving={saving}
              onToggle={toggleStatus}
            />
          </div>
        )}
      </div>
    </section>
  )
}
