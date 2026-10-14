import { useEffect, useRef, useState } from 'react'
import type { EvaluationProfile, InstrumentAcademicContext } from '@aula/shared'
import { Button } from '@/components/ui/Button'
import { FeedbackBanner } from '@/components/ui/SemanticUI'
import type { CourseTeam } from '@/modules/courses/types'
import type { CompetencyBlockId } from '@/modules/grading/utils/competencyGrades'
import type { Activity, ActivityCreatorOrigin } from '../types'
import type { ActivityDraftContext } from '../utils/activityDraftStorage'
import { useActivityDrafts } from '../hooks/useActivityDrafts'
import { ActivityCreationView } from './editor/ActivityCreationView'
import { ActivityEditorProfile, useActivityEditorProfile } from './editor/ActivityEditorProfile'
import {
  activityToDraft,
  draftToActivity,
  newActivityDraft,
  type ActivityDraft,
} from './editor/editorModel'
import { ActivityInfoModal } from './ActivityInfoModal'

export type ActivityEditorWorkspaceProps = {
  instrumentAcademicContext?: InstrumentAcademicContext | null
  activityDraftContext?: ActivityDraftContext
  evaluationProfile?: EvaluationProfile
  firstSecondaryLanguage?: boolean
  secondSecondaryLanguage?: boolean
  sectionSubjectId?: string
  initialActivityBlockId?: CompetencyBlockId
  initialActivityDraftId?: string
  initialDraft?: ActivityDraft
  planningEntryId?: string
  creatorOrigin?: ActivityCreatorOrigin
  activity?: Activity
  teams?: CourseTeam[]
  courseTitle: string
  periodShortName: string
  saving: boolean
  originReturnLabel?: string
  onReturnToOrigin?: (origin?: ActivityCreatorOrigin) => void
  onAddActivity: (activity: Omit<Activity, 'id'> & { creationId?: string }) => Promise<Activity>
  onUpdateActivity: (activity: Activity) => Promise<Activity>
  onGradeCreatedActivity?: (activity: Activity) => void
  onViewCreatedActivity?: (activity: Activity) => void
}

export function ActivityEditorWorkspace(props: ActivityEditorWorkspaceProps) {
  return (
    <ActivityEditorProfile profile={props.evaluationProfile}>
      <ScopedEditor
        key={JSON.stringify([
          props.activityDraftContext,
          props.activity?.id,
          props.initialActivityDraftId,
          props.initialDraft?.draftId,
          props.planningEntryId,
        ])}
        {...props}
      />
    </ActivityEditorProfile>
  )
}

function ScopedEditor(props: ActivityEditorWorkspaceProps) {
  const profile = useActivityEditorProfile()
  const [duplicating, setDuplicating] = useState(false)
  const activity = duplicating ? undefined : props.activity
  const teams = props.teams ?? []
  const createDraft = (
    blockId: CompetencyBlockId,
    context?: Pick<ActivityDraft, 'planningId' | 'creatorOrigin'>,
  ) => {
    const planningId = context?.planningId ?? props.planningEntryId
    return {
      ...newActivityDraft(blockId),
      planningId,
      source: planningId ? ('planning' as const) : undefined,
      creatorOrigin: context?.creatorOrigin ?? props.creatorOrigin,
    }
  }
  const [draft, setDraft] = useState(() =>
    activity
      ? activityToDraft(activity)
      : (props.initialDraft ??
        createDraft(props.initialActivityBlockId ?? (profile.blocks[0].id as CompetencyBlockId))),
  )
  const [mutationError, setMutationError] = useState('')
  const [storageStatus, setStorageStatus] = useState('')
  const [savedActivity, setSavedActivity] = useState<Activity | null>(null)
  const [viewSaved, setViewSaved] = useState(false)
  const draftStore = useActivityDrafts(
    props.activityDraftContext,
    props.courseTitle,
    props.periodShortName,
  )
  const restored = useRef(false)
  const dirty = useRef(false)
  const savingRef = useRef(false)
  useEffect(() => {
    if (!draftStore.ready || restored.current) return
    restored.current = true
    if (activity) return
    if (dirty.current) {
      changeDraft(draft)
      return
    }
    if (!props.initialActivityDraftId) return
    const existing = Object.values(draftStore.drafts)
      .flat()
      .find((item) => item.draftId === props.initialActivityDraftId)
    if (existing) setDraft({ ...existing, creationId: existing.creationId ?? crypto.randomUUID() })
    else
      setMutationError(
        'El borrador ya no está disponible en este contexto. Puedes continuar con una actividad nueva.',
      )
  }, [draftStore.ready, props.initialActivityDraftId, activity])

  function changeDraft(next: ActivityDraft) {
    dirty.current = true
    setDraft(next)
    if (activity) return
    const blockId = next.competencyBlockId as CompetencyBlockId
    const updated = { ...next, updatedAt: new Date().toISOString() }
    const nextDrafts = {
      ...draftStore.drafts,
      [blockId]: [
        updated,
        ...(draftStore.drafts[blockId] ?? []).filter((item) => item.draftId !== updated.draftId),
      ],
    }
    const result = draftStore.persist(nextDrafts)
    setStorageStatus(
      result.ok
        ? 'Borrador guardado'
        : `No se pudo guardar el borrador: ${result.error}. Los cambios permanecen en esta pantalla.`,
    )
  }

  async function save() {
    if (savingRef.current) return
    savingRef.current = true
    setMutationError('')
    try {
      const input = draftToActivity(draft, activity)
      const result = activity
        ? await props.onUpdateActivity({ ...input, id: activity.id })
        : await props.onAddActivity(input)
      if (!activity) {
        const next = Object.fromEntries(
          Object.entries(draftStore.drafts).map(([block, drafts]) => [
            block,
            drafts?.filter((item) => item.draftId !== draft.draftId),
          ]),
        )
        const stored = draftStore.persist(next)
        setStorageStatus(stored.ok ? '' : stored.error)
      }
      setSavedActivity(result)
    } finally {
      savingRef.current = false
    }
  }

  const block =
    profile.blocks.find((item) => item.id === draft.competencyBlockId) ?? profile.blocks[0]
  return (
    <section className="space-y-4">
      {draftStore.error ? (
        <FeedbackBanner tone="warning">
          {draftStore.error}
          <Button variant="outline" onClick={draftStore.retry}>
            Reintentar borradores
          </Button>
        </FeedbackBanner>
      ) : null}
      {mutationError ? (
        <FeedbackBanner role="alert" tone="danger">
          {mutationError} Los cambios se conservan.
        </FeedbackBanner>
      ) : null}
      {storageStatus ? (
        <p role="status" className="text-sm text-muted-foreground">
          {storageStatus}
        </p>
      ) : null}
      {activity && !savedActivity ? (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setDraft(activityToDraft(activity, true))
              setDuplicating(true)
              setStorageStatus('')
              dirty.current = true
            }}
          >
            Duplicar actividad para editar su estructura
          </Button>
        </div>
      ) : null}
      {savedActivity ? (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xl font-bold text-foreground">
            {activity ? 'Actividad actualizada' : 'Actividad creada'}
          </h2>
          <p>{savedActivity.name}</p>
          <div className="flex flex-wrap gap-2">
            {props.onGradeCreatedActivity ? (
              <Button onClick={() => props.onGradeCreatedActivity?.(savedActivity)}>
                Calificar
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={() =>
                props.onViewCreatedActivity
                  ? props.onViewCreatedActivity(savedActivity)
                  : setViewSaved(true)
              }
            >
              Ver actividad
            </Button>
            {!activity ? (
              <Button
                variant="outline"
                onClick={() => {
                  setDraft(createDraft(block.id as CompetencyBlockId, draft))
                  setSavedActivity(null)
                  setStorageStatus('')
                  dirty.current = false
                }}
              >
                Crear otra
              </Button>
            ) : null}
            <Button variant="ghost" onClick={() => props.onReturnToOrigin?.(draft.creatorOrigin)}>
              {draft.creatorOrigin?.label ?? props.originReturnLabel ?? 'Volver'}
            </Button>
          </div>
        </div>
      ) : (
        <ActivityCreationView
          activityDraft={draft}
          block={block}
          teams={teams}
          hasDraft={storageStatus === 'Borrador guardado'}
          firstSecondaryLanguage={props.firstSecondaryLanguage}
          secondSecondaryLanguage={props.secondSecondaryLanguage}
          instrumentAcademicContext={props.instrumentAcademicContext}
          sectionSubjectId={props.sectionSubjectId}
          editingActivityId={activity?.id ?? null}
          structuralLocked={Boolean(activity?.evaluatedCount)}
          returnLabel={draft.creatorOrigin?.label ?? props.originReturnLabel}
          onBack={() => props.onReturnToOrigin?.(draft.creatorOrigin)}
          onChangeDraft={changeDraft}
          onSaveActivity={save}
          onSaveDraft={() => changeDraft(draft)}
          saving={props.saving}
        />
      )}
      {savedActivity && viewSaved ? (
        <ActivityInfoModal activity={savedActivity} onClose={() => setViewSaved(false)} />
      ) : null}
    </section>
  )
}
