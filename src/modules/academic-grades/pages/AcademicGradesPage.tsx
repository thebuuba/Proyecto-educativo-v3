import { AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { GradeSummary } from '@/modules/academic-grades/components/GradeSummary'
import { GradeTable } from '@/modules/academic-grades/components/GradeTable'
import { useGrades } from '@/modules/academic-grades/hooks/useGrades'

export function AcademicGradesPage() {
  const {
    sectionSubjects,
    periods,
    selectedSsId,
    setSelectedSsId,
    selectedPeriodId,
    setSelectedPeriodId,
    students,
    stats,
    loading,
    saving,
    error,
    updateScore,
    refresh,
  } = useGrades()

  const selectedSs = sectionSubjects.find((s) => s.id === selectedSsId)

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-8 space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Evaluaciones
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-none text-primary sm:text-5xl">
              Calificaciones
            </h1>
            <p className="mt-3 text-base leading-6 text-muted-foreground">
              Control de evaluaciones, notas parciales y resultados académicos.
            </p>
          </div>

          <Button variant="outline" className="h-12 px-5" onClick={() => void refresh()}>
            <RefreshCw className="size-4" />
            Actualizar
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Sección / Asignatura
            </label>
            <Select
              value={selectedSsId}
              onChange={(e) => setSelectedSsId(e.target.value)}
              className="w-full sm:w-80"
            >
              {sectionSubjects.length === 0 ? (
                <option value="">No hay asignaciones</option>
              ) : (
                sectionSubjects.map((ss) => (
                  <option key={ss.id} value={ss.id}>
                    {ss.gradeName} — {ss.sectionName} — {ss.subjectName}
                  </option>
                ))
              )}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Período
            </label>
            <Select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="w-full sm:w-56"
            >
              {periods.length === 0 ? (
                <option value="">Sin períodos</option>
              ) : (
                periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </Select>
          </div>
        </div>

        {selectedSs ? (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{selectedSs.subjectName}</span>
              {' — '}
              {selectedSs.gradeName} {selectedSs.sectionName}
            </p>
          </div>
        ) : null}

        <GradeSummary stats={stats} loading={loading} />

        {error ? (
          <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        {!selectedSsId || !selectedPeriodId ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Selecciona una sección, asignatura y período para gestionar calificaciones.
            </p>
          </div>
        ) : loading ? (
          <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
            Cargando estudiantes...
          </div>
        ) : (
          <GradeTable students={students} saving={saving} onSave={updateScore} />
        )}
      </div>
    </section>
  )
}
