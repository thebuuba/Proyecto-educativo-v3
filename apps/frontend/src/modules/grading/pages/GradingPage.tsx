import { AlertCircle, BookOpen, CalendarDays } from 'lucide-react'

import { useState } from 'react'

import { Select } from '@/components/ui/Select'
import { GradingBook } from '@/modules/grading/components/GradingBook'
import { useGrading } from '@/modules/grading/hooks/useGrading'
import type { SectionSubjectOption } from '@/modules/grading/types'
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
    loadFinalRecords,
    getActivitiesForPeriod,
  } = useGrading()

  const isFinalView = selectedPeriodId === 'final'
  const groupedSectionSubjects = groupSectionSubjects(sectionSubjects)
  const [hideFilters, setHideFilters] = useState(false)

  return (
    <section className="w-full">
      <div className="mb-3 space-y-3">
        {!hideFilters ? (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-2 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-4" />
            </span>
            <Select
              value={selectedSsId}
              onChange={(event) => setSelectedSsId(event.target.value)}
              className="h-9 min-w-0 flex-1"
            >
              <option value="">
                {sectionSubjects.length > 0 ? 'Selecciona un curso' : 'No hay asignaciones'}
              </option>
              {groupedSectionSubjects.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.items.map((ss) => (
                    <option key={ss.id} value={ss.id}>
                      {ss.gradeName} {ss.sectionName} — {ss.subjectName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </div>

          <div className="flex min-w-0 items-center gap-2 lg:w-80">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="size-4" />
            </span>
            <Select
              value={selectedPeriodId}
              onChange={(event) => setSelectedPeriodId(event.target.value as typeof selectedPeriodId)}
              className="h-9 min-w-0 flex-1"
            >
              {competencyPeriods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </Select>
          </div>
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
          onActivityWorkspaceChange={setHideFilters}
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
          onActivityWorkspaceChange={setHideFilters}
        />
      )}
    </section>
  )
}

function groupSectionSubjects(items: SectionSubjectOption[]) {
  const orderedItems = [...items].sort(compareSectionSubjects)
  const groups = new Map<string, SectionSubjectOption[]>()

  orderedItems.forEach((item) => {
    const label = getLevelLabel(item)
    const groupItems = groups.get(label) ?? []
    groupItems.push(item)
    groups.set(label, groupItems)
  })

  return Array.from(groups.entries())
    .sort(([firstLabel, firstItems], [secondLabel, secondItems]) => {
      const levelOrder = getLevelOrder(firstItems[0]) - getLevelOrder(secondItems[0])
      if (levelOrder !== 0) return levelOrder
      return firstLabel.localeCompare(secondLabel, 'es')
    })
    .map(([label, groupItems]) => ({ label, items: groupItems }))
}

function compareSectionSubjects(first: SectionSubjectOption, second: SectionSubjectOption) {
  const levelOrder = getLevelOrder(first) - getLevelOrder(second)
  if (levelOrder !== 0) return levelOrder

  const gradeOrder = getGradeOrder(first) - getGradeOrder(second)
  if (gradeOrder !== 0) return gradeOrder

  const sectionOrder = first.sectionName.localeCompare(second.sectionName, 'es', { numeric: true })
  if (sectionOrder !== 0) return sectionOrder

  return first.subjectName.localeCompare(second.subjectName, 'es')
}

function getLevelLabel(item: SectionSubjectOption) {
  const level = normalizeText(item.academicLevelName ?? '')
  if (level.includes('primario') || level.includes('primaria')) return 'Nivel Primario'
  if (level.includes('secundario') || level.includes('secundaria')) return 'Nivel Secundario'
  return item.academicLevelName || 'Otros cursos'
}

function getLevelOrder(item: SectionSubjectOption) {
  const label = getLevelLabel(item)
  if (label === 'Nivel Primario') return 1
  if (label === 'Nivel Secundario') return 2
  return item.academicLevelSequence ?? 99
}

function getGradeOrder(item: SectionSubjectOption) {
  if (typeof item.gradeSequence === 'number') return item.gradeSequence
  const number = Number(item.gradeName.match(/\d+/)?.[0])
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
