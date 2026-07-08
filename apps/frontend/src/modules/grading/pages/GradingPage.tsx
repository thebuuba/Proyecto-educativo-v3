import { AlertCircle, FileText, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { GradingBook } from '@/modules/grading/components/GradingBook'
import { useGrading } from '@/modules/grading/hooks/useGrading'
import { competencyPeriods } from '@/modules/grading/utils/competencyGrades'

export function GradingPage() {
  const {
    sectionSubjects,
    selectedSs,
    selectedSsId,
    setSelectedSsId,
    selectedPeriod,
    selectedPeriodId,
    setSelectedPeriodId,
    students,
    gradeRecords,
    activities,
    recoveryScores,
    loading,
    saving,
    error,
    addActivity,
    updateActivity,
    deleteActivity,
    updateActivityScore,
    updateRecoveryScore,
    refresh,
    loadFinalRecords,
    getActivitiesForPeriod,
  } = useGrading()

  const isFinalView = selectedPeriodId === 'final'

  return (
    <section className="w-full">
      <div className="mb-4 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">
              Registro por competencias
            </p>
            <h1 className="mt-1 text-3xl font-bold leading-none text-primary">
              Calificaciones
            </h1>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Actividades evaluativas, recuperación y resumen final por bloques de competencias.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="h-12 px-5" onClick={() => setSelectedPeriodId('final')}>
              <FileText className="size-4" />
              Ver resumen final
            </Button>
            <Button variant="outline" className="h-12 px-5" onClick={() => void refresh()}>
              <RefreshCw className="size-4" />
              Actualizar
            </Button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Curso / asignatura
            </label>
            <Select
              value={selectedSsId}
              onChange={(event) => setSelectedSsId(event.target.value)}
              className="w-full"
            >
              <option value="">
                {sectionSubjects.length > 0 ? 'Selecciona un curso' : 'No hay asignaciones'}
              </option>
              {sectionSubjects.map((ss) => (
                <option key={ss.id} value={ss.id}>
                  {ss.gradeName} {ss.sectionName} — {ss.subjectName}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Período
            </label>
            <Select
              value={selectedPeriodId}
              onChange={(event) => setSelectedPeriodId(event.target.value as typeof selectedPeriodId)}
              className="w-full"
            >
              {competencyPeriods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {selectedSs ? (
          <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              {selectedPeriod.name}
            </p>
            <h2 className="mt-1 text-xl font-bold text-primary">
              {selectedSs.gradeName} {selectedSs.sectionName} · {selectedSs.subjectName}
            </h2>
          </div>
        ) : null}

        {error ? (
          <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/12 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}
      </div>

      {!selectedSsId ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Selecciona un curso para gestionar sus calificaciones.
          </p>
        </div>
      ) : loading ? (
        <div className="flex min-h-[280px] items-center justify-center text-sm font-medium text-muted-foreground">
          Cargando calificaciones...
        </div>
      ) : isFinalView ? (
        <GradingBook
          students={students}
          activities={activities}
          records={gradeRecords}
          recoveryScores={recoveryScores}
          periodName={selectedPeriod.name}
          periodShortName={selectedPeriod.shortName}
          recoveryLabel={selectedPeriod.recoveryLabel}
          courseTitle={`${selectedSs?.gradeName ?? ''} ${selectedSs?.sectionName ?? ''} · ${selectedSs?.subjectName ?? ''}`}
          saving={saving}
          initialView="final"
          onAddActivity={addActivity}
          onUpdateActivity={updateActivity}
          onDeleteActivity={deleteActivity}
          onSaveScore={updateActivityScore}
          onSaveRecovery={updateRecoveryScore}
          loadFinalRecords={loadFinalRecords}
          getActivitiesForPeriod={getActivitiesForPeriod}
        />
      ) : (
        <GradingBook
          students={students}
          activities={activities}
          records={gradeRecords}
          recoveryScores={recoveryScores}
          periodName={selectedPeriod.name}
          periodShortName={selectedPeriod.shortName}
          recoveryLabel={selectedPeriod.recoveryLabel}
          courseTitle={`${selectedSs?.gradeName ?? ''} ${selectedSs?.sectionName ?? ''} · ${selectedSs?.subjectName ?? ''}`}
          saving={saving}
          onAddActivity={addActivity}
          onUpdateActivity={updateActivity}
          onDeleteActivity={deleteActivity}
          onSaveScore={updateActivityScore}
          onSaveRecovery={updateRecoveryScore}
          loadFinalRecords={loadFinalRecords}
          getActivitiesForPeriod={getActivitiesForPeriod}
        />
      )}
    </section>
  )
}
