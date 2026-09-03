import { BookOpen, CalendarDays, GraduationCap } from 'lucide-react'

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { EmptyState } from '@/components/ui/EmptyState'
import { FeedbackBanner, FilterBar, PageHero, StatusBadge } from '@/components/ui/SemanticUI'
import { Select } from '@/components/ui/Select'
import { GradingBook } from '@/modules/grading/components/GradingBook'
import { getCourseTeams } from '@/modules/courses/services/coursesService'
import type { CourseTeam } from '@/modules/courses/types'
import { useGrading } from '@/modules/grading/hooks/useGrading'
import type { SectionSubjectOption } from '@/modules/grading/types'
import { competencyPeriods, getRequestedCompetencyBlockId } from '@/modules/grading/utils/competencyGrades'

export function GradingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedSectionSubjectId = searchParams.get('sectionSubjectId') ?? undefined
  const requestedAcademicPeriodId = searchParams.get('academicPeriodId') ?? undefined
  const requestedAction = searchParams.get('action') === 'create-activity' ? 'create' : undefined
  const requestedBlockId = getRequestedCompetencyBlockId(searchParams)
  const requestedActivityId = searchParams.get('activityId') ?? undefined
  const requestedActivityMode = searchParams.get('activityMode') === 'edit' ? 'edit' : searchParams.get('activityMode') === 'evaluate' ? 'evaluate' : searchParams.get('activityMode') === 'results' ? 'results' : 'view'
  const returnCourseId = searchParams.get('returnCourseId')
  const returnSubjectId = searchParams.get('returnSubjectId')
  const returnTab = searchParams.get('returnTab')
  const returnsToSubject = searchParams.get('origin') === 'subject' && Boolean(returnCourseId && returnSubjectId)
  const returnsToActivities = searchParams.get('origin') === 'activities'
  const returnToOrigin = returnsToSubject
    ? () => navigate(`/cursos?${new URLSearchParams({ courseId: returnCourseId!, subjectId: returnSubjectId!, ...(returnTab ? { tab: returnTab } : {}) }).toString()}`)
    : returnsToActivities ? () => navigate('/actividades') : undefined
  const originReturnLabel = returnsToSubject ? 'Volver a la asignatura' : returnsToActivities ? 'Volver a actividades' : undefined
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
    cellSaveStates,
    error,
    addActivity,
    updateActivity,
    deleteActivity,
    updateActivityScore,
    updateRecoveryScore,
    loadFinalRecords,
    getActivitiesForPeriod,
  } = useGrading({ initialSectionSubjectId: requestedSectionSubjectId, initialAcademicPeriodId: requestedAcademicPeriodId })

  const isFinalView = selectedPeriodId === 'final'
  const groupedSectionSubjects = groupSectionSubjects(sectionSubjects)
  const [hideFilters, setHideFilters] = useState(false)
  const [teams, setTeams] = useState<CourseTeam[]>([])

  useEffect(() => {
    let active = true
    if (!selectedSsId) {
      setTeams([])
      return
    }
    void getCourseTeams(selectedSsId).then((result) => { if (active) setTeams(result) }).catch(() => { if (active) setTeams([]) })
    return () => { active = false }
  }, [selectedSsId])

  return (
    <section className="w-full space-y-4">
      {!hideFilters ? (
        <>
          <PageHero
            title="Evaluación"
            description="Registra actividades, califica evidencias y consulta el progreso por competencias."
            icon={GraduationCap}
            tone="info"
          >
            <div className="flex flex-wrap items-center gap-2">
              {selectedSs ? <StatusBadge tone="info">{selectedSs.gradeName} {selectedSs.sectionName} · {selectedSs.subjectName}</StatusBadge> : <StatusBadge tone="warning">Selecciona un curso</StatusBadge>}
              <StatusBadge tone={isFinalView ? 'success' : 'warning'}>{selectedPeriod.name}</StatusBadge>
            </div>
          </PageHero>

          <FilterBar className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
            <div className="relative min-w-0">
              <BookOpen className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-primary" aria-hidden="true" />
              <Select
                aria-label="Curso y asignatura"
                value={selectedSsId}
                onChange={(event) => setSelectedSsId(event.target.value)}
                className="h-11 w-full min-w-0 pl-10"
              >
                <option value="">{sectionSubjects.length > 0 ? 'Selecciona un curso' : 'No hay asignaciones'}</option>
                {groupedSectionSubjects.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.items.map((ss) => <option key={ss.id} value={ss.id}>{ss.gradeName} {ss.sectionName} — {ss.subjectName}</option>)}
                  </optgroup>
                ))}
              </Select>
            </div>

            <div className="relative min-w-0">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-warning" aria-hidden="true" />
              <Select
                aria-label="Período de evaluación"
                value={selectedPeriodId}
                onChange={(event) => setSelectedPeriodId(event.target.value as typeof selectedPeriodId)}
                className="h-11 w-full min-w-0 pl-10"
              >
                {competencyPeriods.map((period) => <option key={period.id} value={period.id}>{period.name}</option>)}
              </Select>
            </div>
          </FilterBar>
        </>
      ) : null}

      {error ? <FeedbackBanner tone="danger">{error}</FeedbackBanner> : null}

      {!selectedSsId ? (
        <EmptyState
          title="Selecciona un curso"
          description="Elige el curso y la asignatura para gestionar actividades, calificaciones y recuperación."
          icon={GraduationCap}
          tone="warning"
        />
      ) : loading ? (
        <div role="status" aria-label="Cargando calificaciones" className="space-y-3 animate-pulse">
          <span className="sr-only">Cargando calificaciones...</span>
          <div className="h-14 rounded-2xl bg-muted/55" />
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-24 rounded-2xl bg-muted/55" />)}
          </div>
          <div className="grid gap-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-64 rounded-3xl bg-muted/55" />)}
          </div>
        </div>
      ) : (
        <GradingBook
          students={students}
          teams={teams}
          activities={activities}
          records={gradeRecords}
          recoveryScores={recoveryScores}
          periodName={selectedPeriod.name}
          periodShortName={selectedPeriod.shortName}
          recoveryLabel={selectedPeriod.recoveryLabel}
          courseTitle={`${selectedSs?.gradeName ?? ''} ${selectedSs?.sectionName ?? ''} · ${selectedSs?.subjectName ?? ''}`}
          saving={saving}
          cellSaveStates={cellSaveStates}
          {...(isFinalView ? { initialView: 'final' as const } : {})}
          initialActivityAction={requestedAction}
          initialActivityBlockId={requestedBlockId}
          initialActivityId={requestedActivityId}
          initialActivityMode={requestedActivityMode}
          originReturnLabel={originReturnLabel}
          onReturnToOrigin={returnToOrigin}
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
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}
