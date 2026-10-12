import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import {
  ActivityDataSections,
  availablePedagogicalActivityType,
  evaluationTechniqueOptions,
  pedagogicalActivityLabels,
} from '@/modules/activities/components/editor/ActivityDataSections'
import {
  ActivityCompletionModal,
  ActivityProgressCard,
} from '@/modules/activities/components/editor/ActivityProgress'
import {
  buildActivityDraftMeta,
  validateActivityCompletion,
  type ActivityCompletionIssue,
  type ActivityCompletionTarget,
  type ActivityDraft,
} from '@/modules/activities/components/editor/editorModel'
import {
  ActivityDescriptionContent,
  activityDescriptionText,
  blockShortNames,
  formatActivityTechnique,
  getBlockAccent,
  instrumentTitle,
  ProgressBar,
  useTransientActivityHighlight,
} from '@/modules/activities/components/editor/editorPresentation'
import {
  InstrumentPreview,
  InstrumentPreviewModal,
} from '@/modules/activities/components/editor/InstrumentPreview'
import {
  appendInstrumentCriterion,
  nextCatalogCriterion,
} from '@/modules/activities/services/instrumentCriterionAddition'
import {
  editableFallbackRecommendation,
  interpretActivity,
  preparationFingerprint,
  prepareInstrument,
  recommendationToFields,
  type ActivityInterpretation,
} from '@/modules/activities/services/instrumentPreparation'
import {
  rememberManualLevelWeights,
  rememberManualScoreWeights,
  scoreInstrumentFields,
  scoreRecommendation,
  validActivityScore,
} from '@/modules/activities/services/instrumentScoring'
import { activityDefaultSuggestions } from '@/modules/activities/utils/activityDefaultSuggestions'
import type { CourseTeam } from '@/modules/courses/types'
import { ApiError } from '@/services/apiClient'
import { cn } from '@/utils/cn'
import type { EvaluationProfile } from '@aula/shared'
import {
  detectSecondaryLanguageActivity,
  firstSecondaryLanguageTechnique,
  type InstrumentRecommendation,
} from '@aula/shared'
import {
  Blocks,
  BookOpen,
  Box,
  ClipboardList,
  Eye,
  FileText,
  Scale,
  Target,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useActivityEditorProfile } from './ActivityEditorProfile'
import { ReadOnlyInstrument } from './ReadOnlyInstrument'

export function ActivityCreationView(props: {
  firstSecondaryLanguage?: boolean
  secondSecondaryLanguage?: boolean
  sectionSubjectId?: string
  activityDraft: ActivityDraft
  teams: CourseTeam[]
  hasDraft: boolean
  block: EvaluationProfile['blocks'][number]
  editingActivityId: string | null
  onBack: () => void
  onChangeDraft: (draft: ActivityDraft) => void
  onSaveActivity: () => void | Promise<void>
  onSaveDraft: () => void
  structuralLocked?: boolean
  returnLabel?: string
  saving: boolean
}) {
  const {
    activityDraft,
    block,
    editingActivityId,
    firstSecondaryLanguage = false,
    secondSecondaryLanguage = false,
    hasDraft,
    onBack,
    onChangeDraft,
    onSaveActivity,
    onSaveDraft,
    saving,
    teams,
    sectionSubjectId,
  } = props
  const competencyBlocks = useActivityEditorProfile().blocks
  const structuralLocked = props.structuralLocked ?? false
  const [step, setStep] = useState<'activity' | 'instrument' | 'review'>('activity')
  const [fallbackNotice, setFallbackNotice] = useState('')
  const contextualLanguageGrade = firstSecondaryLanguage ? 1 : secondSecondaryLanguage ? 2 : null
  const latestDraft = useRef(activityDraft)
  latestDraft.current = activityDraft
  const committedScore = useRef(validActivityScore(activityDraft.maxScore))
  useEffect(() => {
    committedScore.current = validActivityScore(activityDraft.maxScore)
  }, [activityDraft.draftId, editingActivityId])
  const manualSelections = useRef({
    activity: Boolean(
      activityDraft.pedagogicalActivityType && !activityDraft.autoDetectedPedagogicalActivityType,
    ),
    technique: Boolean(
      activityDraft.evaluationTechnique && !activityDraft.autoSelectedEvaluationTechnique,
    ),
    instrument: Boolean(activityDraft.instrumentType && !activityDraft.autoSelectedInstrumentType),
  })
  useEffect(() => {
    manualSelections.current = {
      activity: Boolean(
        activityDraft.pedagogicalActivityType && !activityDraft.autoDetectedPedagogicalActivityType,
      ),
      technique: Boolean(
        activityDraft.evaluationTechnique && !activityDraft.autoSelectedEvaluationTechnique,
      ),
      instrument: Boolean(
        activityDraft.instrumentType && !activityDraft.autoSelectedInstrumentType,
      ),
    }
  }, [activityDraft.draftId])
  const onChangeDraftRef = useRef(onChangeDraft)
  onChangeDraftRef.current = onChangeDraft
  const [interpretation, setInterpretation] = useState<ActivityInterpretation | null>(null)
  const [preparing, setPreparing] = useState(false)
  const [regenerated, setRegenerated] = useState(false)
  const preparingRequest = useRef(false)
  const preparationSequence = useRef(0)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      preparationSequence.current += 1
    }
  }, [])
  const [addingCriterion, setAddingCriterion] = useState(false)
  const addingRequest = useRef(false)
  const pendingCriterionAddition = useRef<{
    criterion: InstrumentRecommendation['criteria'][number] | null
    onAdded: () => void
  } | null>(null)
  const [confirmCriterionRedistribution, setConfirmCriterionRedistribution] = useState(false)
  const [preparationError, setPreparationError] = useState('')
  const [failedInstrumentType, setFailedInstrumentType] = useState('')
  const [pendingInstrumentType, setPendingInstrumentType] = useState('')
  const [requiredFieldError, setRequiredFieldError] = useState('')
  const [completionIssues, setCompletionIssues] = useState<ActivityCompletionIssue[]>([])
  const [showSummary, setShowSummary] = useState(false)
  const [saveFailure, setSaveFailure] = useState('')
  const [summaryView, setSummaryView] = useState<
    'summary' | 'description' | 'instrument' | 'resources'
  >('summary')
  const [autoDetectionRevision, refreshAutoDetection] = useState(0)
  const confirmingSave = useRef(false)
  const { highlightTarget, showHighlight } = useTransientActivityHighlight()
  const accent = getBlockAccent(block.id)
  const progressMeta = buildActivityDraftMeta(activityDraft, block.id)
  const instrumentLabel = activityDraft.instrumentType
    ? instrumentTitle(activityDraft.instrumentType)
    : 'Instrumento de evaluación'
  const fingerprint = preparationFingerprint(activityDraft)
  const stale =
    !structuralLocked &&
    Boolean(
      activityDraft.preparedRecommendation && activityDraft.preparedFingerprint !== fingerprint,
    )
  const savedSnapshot = structuralLocked
  const canKeepCurrentInstrument = (() => {
    if (!stale || !editingActivityId || !activityDraft.preparedFingerprint) return false
    try {
      return (
        JSON.stringify(JSON.parse(activityDraft.preparedFingerprint).slice(2)) ===
        JSON.stringify(JSON.parse(fingerprint).slice(2))
      )
    } catch {
      return false
    }
  })()
  const manualPedagogicalType = activityDraft.autoDetectedPedagogicalActivityType
    ? ''
    : activityDraft.pedagogicalActivityType || ''

  useEffect(() => {
    if (!sectionSubjectId || !activityDraft.name.trim() || editingActivityId) {
      setInterpretation(null)
      return
    }
    const abort = new AbortController()
    const timer = window.setTimeout(() => {
      const scopedType = contextualLanguageGrade
        ? detectSecondaryLanguageActivity(
            activityDraft.name,
            activityDescriptionText(activityDraft.description),
            { level: 'SECONDARY', grade: contextualLanguageGrade, subjectCode: 'LEN' },
          )
        : null
      const localDefaults = scopedType
        ? {
            activityType: scopedType,
            technique: firstSecondaryLanguageTechnique(scopedType),
            instrument: scopedType.endsWith('_ANALYSIS') ? 'lista-cotejo' : 'rubrica',
          }
        : activityDefaultSuggestions(
            activityDraft.name,
            activityDescriptionText(activityDraft.description),
          )
      if (localDefaults) {
        const current = latestDraft.current
        const preservePrepared =
          current.preparedRecommendation &&
          current.preparedFingerprint === preparationFingerprint(current)
        const next = { ...current }
        if (!manualSelections.current.activity && !preservePrepared) {
          next.pedagogicalActivityType = localDefaults.activityType
          next.autoDetectedPedagogicalActivityType = true
        }
        if (!manualSelections.current.technique && !preservePrepared) {
          next.evaluationTechnique = localDefaults.technique
          next.autoSelectedEvaluationTechnique = true
        }
        if (!manualSelections.current.instrument && !current.preparedRecommendation) {
          next.instrumentType = localDefaults.instrument
          next.autoSelectedInstrumentType = true
        }
        if (
          next.pedagogicalActivityType !== current.pedagogicalActivityType ||
          next.evaluationTechnique !== current.evaluationTechnique ||
          next.instrumentType !== current.instrumentType
        ) {
          latestDraft.current = next
          onChangeDraftRef.current(next)
        }
      }
      interpretActivity(
        {
          sectionSubjectId,
          activityTitle: activityDraft.name,
          description: activityDescriptionText(activityDraft.description),
          pedagogicalActivityType: manualPedagogicalType || undefined,
          competencyBlock: block.id,
        },
        abort.signal,
      )
        .then((value) => {
          if (abort.signal.aborted) return
          const current = latestDraft.current
          if (
            current.name !== activityDraft.name ||
            current.description !== activityDraft.description
          )
            return
          setInterpretation(value)
          if (
            current.preparedManuallyEdited ||
            (current.preparedRecommendation &&
              current.preparedFingerprint === preparationFingerprint(current))
          )
            return
          const next = { ...current }
          const suggestedTechnique = scopedType
            ? firstSecondaryLanguageTechnique(scopedType)
            : value.suggestedEvaluationTechnique
          const suggestedType = scopedType || value.suggestedActivityType
          if (
            suggestedTechnique &&
            evaluationTechniqueOptions.some(([id]) => id === suggestedTechnique) &&
            !manualSelections.current.technique &&
            (current.autoSelectedEvaluationTechnique || !current.evaluationTechnique)
          ) {
            next.evaluationTechnique = suggestedTechnique
            next.autoSelectedEvaluationTechnique = true
          }
          if (
            pedagogicalActivityLabels[suggestedType] &&
            availablePedagogicalActivityType(
              suggestedType,
              firstSecondaryLanguage,
              secondSecondaryLanguage,
            ) &&
            !manualSelections.current.activity &&
            (current.autoDetectedPedagogicalActivityType || !current.pedagogicalActivityType)
          ) {
            next.pedagogicalActivityType = suggestedType
            next.autoDetectedPedagogicalActivityType = true
          }
          if (
            value.suggestedInstrumentType &&
            ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'].includes(
              value.suggestedInstrumentType,
            ) &&
            !manualSelections.current.instrument &&
            !current.preparedRecommendation &&
            (current.autoSelectedInstrumentType || !current.instrumentType)
          ) {
            next.instrumentType = value.suggestedInstrumentType
            next.autoSelectedInstrumentType = true
          }
          if (
            next.evaluationTechnique !== current.evaluationTechnique ||
            next.pedagogicalActivityType !== current.pedagogicalActivityType ||
            next.instrumentType !== current.instrumentType
          )
            onChangeDraftRef.current(next)
        })
        .catch(() => {
          if (!abort.signal.aborted) setInterpretation(null)
        })
    }, 450)
    return () => {
      window.clearTimeout(timer)
      abort.abort()
    }
  }, [
    sectionSubjectId,
    activityDraft.name,
    activityDraft.description,
    manualPedagogicalType,
    block.id,
    editingActivityId,
    firstSecondaryLanguage,
    secondSecondaryLanguage,
    autoDetectionRevision,
  ])

  async function prepare(
    preferredType?: string,
    replaceManual = false,
    forceAutomatic = false,
    newGeneration = false,
  ) {
    if (preparingRequest.current) return
    if (!sectionSubjectId) {
      setPreparationError(
        'No se pudo identificar la asignatura. Vuelve a seleccionarla e inténtalo de nuevo.',
      )
      return
    }
    // A delayed preparation can start after the mounted editor initialized its fields.
    // Capture the current draft at request time; later changes still invalidate this request.
    const requestedDraft = latestDraft.current
    if (!validatePreparation(requestedDraft)) return
    const requestedFingerprint = preparationFingerprint(requestedDraft)
    const requestedFields = JSON.stringify([
      requestedDraft.maxScore,
      requestedDraft.instrumentFields,
    ])
    const requestSequence = ++preparationSequence.current
    // The service currently requires a score for its internal calculation. Pending
    // scores are removed from the proposal and fields before they enter the draft.
    const preparationScore = committedScore.current ?? 20
    preparingRequest.current = true
    setPreparing(true)
    setPreparationError('')
    try {
      const proposal = await prepareInstrument({
        sectionSubjectId,
        activityTitle: requestedDraft.name,
        description: activityDescriptionText(requestedDraft.description),
        participationMode: requestedDraft.activityType === 'group' ? 'GROUP' : 'INDIVIDUAL',
        pedagogicalActivityType: requestedDraft.autoDetectedPedagogicalActivityType
          ? undefined
          : requestedDraft.pedagogicalActivityType || undefined,
        maxScore: preparationScore,
        competencyBlock: block.id,
        curriculumVersionId: interpretation?.curriculumVersionId ?? undefined,
        preferredInstrumentType: forceAutomatic
          ? undefined
          : (preferredType ??
            (newGeneration
              ? requestedDraft.instrumentType || undefined
              : requestedDraft.autoSelectedInstrumentType
                ? undefined
                : requestedDraft.instrumentType || undefined)),
        selectedCurriculumElementIds: requestedDraft.selectedCurriculumElementIds?.length
          ? requestedDraft.selectedCurriculumElementIds
          : undefined,
      })
      if (
        !proposal.criteria?.length ||
        !proposal.criteria.every((item) => item.title.trim() && item.description.trim()) ||
        proposal.instrumentType !==
          (forceAutomatic
            ? proposal.instrumentType
            : (preferredType ?? requestedDraft.instrumentType)) ||
        proposal.criteria.reduce((sum, item) => sum + item.maxScoreUnits, 0) !==
          proposal.totalScoreUnits ||
        !Number.isInteger(proposal.totalScoreUnits) ||
        proposal.totalScoreUnits <= 0
      ) {
        throw new Error(
          'El servicio no devolvió un instrumento válido. Tus cambios se conservaron; puedes intentar de nuevo.',
        )
      }
      if (
        requestSequence !== preparationSequence.current ||
        preparationFingerprint(latestDraft.current) !== requestedFingerprint ||
        JSON.stringify([latestDraft.current.maxScore, latestDraft.current.instrumentFields]) !==
          requestedFields ||
        (latestDraft.current.manualInstrumentBlank && !newGeneration) ||
        (latestDraft.current.preparedManuallyEdited && !replaceManual)
      )
        return
      const current = latestDraft.current
      const generation = newGeneration
        ? (current.instrumentGeneration || 0) + 1
        : current.instrumentGeneration || 0
      const selectedProposal = proposal
      const assignedScore = committedScore.current
      const preparedFields = scoreInstrumentFields(
        recommendationToFields(selectedProposal, current.name),
        selectedProposal.instrumentType,
        assignedScore,
        selectedProposal,
      )
      const preparedProposal = scoreRecommendation(selectedProposal, preparedFields, assignedScore)
      const next = {
        ...current,
        instrumentType: selectedProposal.instrumentType,
        pedagogicalActivityType: current.pedagogicalActivityType || proposal.activityType,
        autoSelectedInstrumentType: forceAutomatic
          ? true
          : preferredType
            ? false
            : current.autoSelectedInstrumentType || !current.instrumentType,
        autoDetectedPedagogicalActivityType: preferredType
          ? current.autoDetectedPedagogicalActivityType
          : current.autoDetectedPedagogicalActivityType || !current.pedagogicalActivityType,
        instrumentFields: preparedFields,
        instrumentCompleted: true,
        preparedRecommendation: preparedProposal,
        preparedManuallyEdited: false,
        manualInstrumentBlank: false,
        instrumentGeneration: generation,
      }
      const prepared = { ...next, preparedFingerprint: preparationFingerprint(next) }
      latestDraft.current = prepared
      onChangeDraft(prepared)
      if (newGeneration) {
        setRegenerated(true)
        window.setTimeout(() => setRegenerated(false), 1800)
      }
      setFailedInstrumentType('')
      setFallbackNotice('')
    } catch (error) {
      if (
        requestSequence !== preparationSequence.current ||
        preparationFingerprint(latestDraft.current) !== requestedFingerprint ||
        JSON.stringify([latestDraft.current.maxScore, latestDraft.current.instrumentFields]) !==
          requestedFields
      )
        return
      const requestedType = preferredType ?? (requestedDraft.instrumentType || 'rubrica')
      if (
        !newGeneration &&
        !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
        (!requestedDraft.preparedManuallyEdited || replaceManual)
      ) {
        useEditableTemplate(requestedType, newGeneration, Boolean(preferredType))
        setFallbackNotice(
          'El servicio de instrumentos no está disponible. Se preparó una plantilla local editable; revisa sus criterios antes de guardar.',
        )
      } else {
        setFailedInstrumentType(requestedType)
        setPreparationError(
          error instanceof ApiError && error.status < 500
            ? error.message
            : 'No se pudo actualizar el instrumento. Tus cambios se conservaron; puedes intentar de nuevo.',
        )
      }
    } finally {
      if (requestSequence === preparationSequence.current) {
        preparingRequest.current = false
        if (mounted.current) setPreparing(false)
      }
    }
  }

  useEffect(() => {
    if (
      editingActivityId ||
      !sectionSubjectId ||
      !activityDraft.name.trim() ||
      !activityDescriptionText(activityDraft.description).trim() ||
      activityDraft.manualInstrumentBlank ||
      activityDraft.preparedManuallyEdited ||
      (activityDraft.preparedRecommendation && !stale)
    )
      return
    const timer = window.setTimeout(() => {
      if (preparationFingerprint(latestDraft.current) === fingerprint) void prepare()
    }, 900)
    return () => window.clearTimeout(timer)
  }, [
    fingerprint,
    sectionSubjectId,
    editingActivityId,
    activityDraft.activityType,
    activityDraft.manualInstrumentBlank,
    activityDraft.preparedManuallyEdited,
    activityDraft.preparedRecommendation,
    stale,
  ])

  function requestInstrumentChange(instrumentType: string) {
    if (instrumentType === activityDraft.instrumentType) return
    manualSelections.current.instrument = Boolean(instrumentType)
    if (activityDraft.preparedManuallyEdited) {
      setPendingInstrumentType(instrumentType || '__auto__')
      return
    }
    if (!activityDraft.preparedRecommendation) {
      handleDraftChange({
        ...activityDraft,
        instrumentType,
        autoSelectedInstrumentType: !instrumentType,
      })
      return
    }
    void prepare(instrumentType || undefined, false, !instrumentType)
  }

  function requestRegeneration(preferredType?: string) {
    if (preparingRequest.current) return
    if (activityDraft.preparedManuallyEdited) {
      setPendingInstrumentType('__regenerate__')
      return
    }
    void prepare(preferredType, false, false, true)
  }

  function applyAddedCriterion(
    criterion: InstrumentRecommendation['criteria'][number] | null,
    onAdded: () => void,
  ) {
    const current = latestDraft.current
    const type = current.instrumentType as InstrumentRecommendation['instrumentType']
    const result = appendInstrumentCriterion(
      current.instrumentFields,
      type,
      validActivityScore(current.maxScore),
      current.preparedRecommendation,
      criterion,
    )
    const next = {
      ...current,
      instrumentFields: result.fields,
      preparedRecommendation: result.recommendation,
      preparedManuallyEdited: true,
      instrumentCompleted: Boolean(criterion) && current.instrumentCompleted,
    }
    latestDraft.current = next
    onChangeDraft(next)
    onAdded()
  }

  async function requestAdditionalCriterion(onAdded: () => void) {
    if (addingRequest.current || !activityDraft.instrumentType) return
    addingRequest.current = true
    setAddingCriterion(true)
    const current = latestDraft.current
    const signature = `${preparationFingerprint(current)}:${JSON.stringify([current.maxScore, current.instrumentFields])}`
    const type = current.instrumentType as InstrumentRecommendation['instrumentType']
    let candidates: InstrumentRecommendation['criteria'] = []
    try {
      if (current.preparedRecommendation?.catalogVersion === 'editable-fallback-v1')
        throw new Error('Usar plantilla local')
      const proposal = await prepareInstrument({
        sectionSubjectId: sectionSubjectId!,
        activityTitle: current.name,
        description: activityDescriptionText(current.description),
        participationMode: current.activityType === 'group' ? 'GROUP' : 'INDIVIDUAL',
        pedagogicalActivityType: current.pedagogicalActivityType || undefined,
        maxScore: 100,
        competencyBlock: block.id,
        curriculumVersionId: interpretation?.curriculumVersionId ?? undefined,
        preferredInstrumentType: type,
        selectedCurriculumElementIds: current.selectedCurriculumElementIds?.length
          ? current.selectedCurriculumElementIds
          : undefined,
        includeAdditionalCandidates: true,
        levelCount: Number(current.instrumentFields[`${type}:meta:levelCount`]) === 5 ? 5 : 4,
      })
      candidates = proposal.criteria
    } catch (error) {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        setPreparationError(error.message)
        return
      }
      const base = {
        activityTitle: current.name,
        description: activityDescriptionText(current.description),
        maxScore: 100,
        instrumentType: type,
        participationMode:
          current.activityType === 'group' ? ('GROUP' as const) : ('INDIVIDUAL' as const),
        activityType: current.pedagogicalActivityType,
        secondaryLanguageGrade: (contextualLanguageGrade as 1 | 2 | null) || undefined,
      }
      candidates = [0, 1].flatMap(
        (variation) => editableFallbackRecommendation({ ...base, variation }).criteria,
      )
      if (mounted.current)
        setFallbackNotice(
          'No se pudo consultar el catálogo. Se utilizó una alternativa local editable para el criterio adicional.',
        )
    } finally {
      addingRequest.current = false
      setAddingCriterion(false)
    }
    if (
      !mounted.current ||
      `${preparationFingerprint(latestDraft.current)}:${JSON.stringify([latestDraft.current.maxScore, latestDraft.current.instrumentFields])}` !==
        signature
    )
      return
    const criterion = nextCatalogCriterion(
      candidates,
      current.instrumentFields,
      type,
      current.preparedRecommendation?.criteria,
    )
    if (
      criterion &&
      validActivityScore(current.maxScore) !== null &&
      current.instrumentFields[`${type}:meta:manualPoints`] === 'true'
    ) {
      pendingCriterionAddition.current = { criterion, onAdded }
      setConfirmCriterionRedistribution(true)
    } else applyAddedCriterion(criterion, onAdded)
  }

  function useEditableTemplate(
    preferredType?: string,
    newGeneration = false,
    manualInstrumentSelection = false,
  ) {
    const current = latestDraft.current
    const instrumentType = (preferredType ||
      failedInstrumentType ||
      current.instrumentType ||
      'rubrica') as InstrumentRecommendation['instrumentType']
    const generation = newGeneration
      ? (current.instrumentGeneration || 0) + 1
      : current.instrumentGeneration || 0
    const score = committedScore.current
    const proposal = editableFallbackRecommendation({
      activityTitle: current.name,
      description: activityDescriptionText(current.description),
      maxScore: score ?? 20,
      instrumentType,
      variation: generation % 2,
      participationMode: current.activityType === 'group' ? 'GROUP' : 'INDIVIDUAL',
      activityType: contextualLanguageGrade
        ? current.pedagogicalActivityType ||
          detectSecondaryLanguageActivity(
            current.name,
            activityDescriptionText(current.description),
            { level: 'SECONDARY', grade: contextualLanguageGrade, subjectCode: 'LEN' },
          ) ||
          undefined
        : undefined,
      secondaryLanguageGrade: contextualLanguageGrade || undefined,
    })
    const preparedFields = scoreInstrumentFields(
      recommendationToFields(proposal, current.name),
      instrumentType,
      score,
      proposal,
    )
    const next = {
      ...current,
      instrumentType,
      instrumentFields: preparedFields,
      instrumentCompleted: true,
      preparedRecommendation: scoreRecommendation(proposal, preparedFields, score),
      preparedManuallyEdited: false,
      manualInstrumentBlank: false,
      instrumentGeneration: generation,
      autoSelectedInstrumentType:
        !manualInstrumentSelection &&
        (current.autoSelectedInstrumentType || !current.instrumentType),
    }
    onChangeDraft({ ...next, preparedFingerprint: preparationFingerprint(next) })
    setFailedInstrumentType('')
    setPreparationError('')
  }

  function requestInstrumentFromScratch() {
    if (
      activityDraft.preparedManuallyEdited ||
      Object.keys(activityDraft.instrumentFields).length
    ) {
      setPendingInstrumentType('__scratch__')
      return
    }
    createInstrumentFromScratch()
  }

  function createInstrumentFromScratch() {
    preparationSequence.current += 1
    preparingRequest.current = false
    setPreparing(false)
    const instrumentType = failedInstrumentType || activityDraft.instrumentType || 'rubrica'
    const next = {
      ...activityDraft,
      instrumentType,
      instrumentFields: {},
      instrumentCompleted: false,
      preparedRecommendation: undefined,
      preparedFingerprint: undefined,
      preparedManuallyEdited: false,
      manualInstrumentBlank: true,
      autoSelectedInstrumentType: false,
    }
    latestDraft.current = next
    onChangeDraft(next)
    setPreparationError('')
  }

  function validatePreparation(draft = activityDraft) {
    const missing: Array<{ target: ActivityCompletionTarget; message: string }> = [
      {
        target: 'name',
        message: 'Escribe el nombre de la actividad para preparar el instrumento.',
      },
      { target: 'description', message: 'Describe la actividad para preparar el instrumento.' },
    ]
    const issue = missing.find((item) =>
      item.target === 'name'
        ? !draft.name.trim()
        : !activityDescriptionText(draft.description).trim(),
    )
    if (!issue) {
      setRequiredFieldError('')
      return true
    }
    setRequiredFieldError(issue.message)
    showHighlight(issue.target)
    window.setTimeout(() => {
      const field = document.querySelector<HTMLElement>(
        `[data-activity-required="${issue.target}"] input:not(:disabled), [data-activity-required="${issue.target}"] button`,
      )
      field?.scrollIntoView?.({
        block: 'center',
        behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      })
      field?.focus()
    }, 0)
    return false
  }

  function handleDraftChange(draft: ActivityDraft) {
    const changedInstrument = draft.instrumentType !== activityDraft.instrumentType
    const changedPedagogicalType =
      draft.pedagogicalActivityType !== activityDraft.pedagogicalActivityType
    if (changedInstrument)
      manualSelections.current.instrument = Boolean(
        draft.instrumentType && !draft.autoSelectedInstrumentType,
      )
    if (changedPedagogicalType)
      manualSelections.current.activity = Boolean(
        draft.pedagogicalActivityType && !draft.autoDetectedPedagogicalActivityType,
      )
    if (draft.evaluationTechnique !== activityDraft.evaluationTechnique)
      manualSelections.current.technique = Boolean(
        draft.evaluationTechnique && !draft.autoSelectedEvaluationTechnique,
      )
    if (
      (changedPedagogicalType && draft.autoDetectedPedagogicalActivityType) ||
      (draft.evaluationTechnique !== activityDraft.evaluationTechnique &&
        draft.autoSelectedEvaluationTechnique) ||
      (changedInstrument && draft.autoSelectedInstrumentType)
    )
      refreshAutoDetection((value) => value + 1)
    onChangeDraft({
      ...draft,
      autoSelectedInstrumentType:
        changedInstrument && !draft.autoSelectedInstrumentType
          ? false
          : draft.autoSelectedInstrumentType,
      autoDetectedPedagogicalActivityType:
        changedPedagogicalType && !draft.autoDetectedPedagogicalActivityType
          ? false
          : draft.autoDetectedPedagogicalActivityType,
      competencyBlockId: block.id,
      instrumentCompleted: changedInstrument ? false : draft.instrumentCompleted,
      instrumentFields: changedInstrument ? {} : draft.instrumentFields,
      instrumentId: changedInstrument ? undefined : draft.instrumentId,
      preparedRecommendation: changedInstrument ? undefined : draft.preparedRecommendation,
      preparedFingerprint: changedInstrument ? undefined : draft.preparedFingerprint,
    })
  }

  function updateActivityScore(value: string) {
    const score = validActivityScore(value)
    const current = latestDraft.current
    if (
      score === committedScore.current &&
      (score !== null ||
        !current.instrumentType ||
        current.instrumentFields[`${current.instrumentType}:meta:scorePending`] === 'true')
    ) {
      const next = { ...current, maxScore: value }
      latestDraft.current = next
      onChangeDraft(next)
      return
    }
    committedScore.current = score
    const fields = scoreInstrumentFields(
      current.instrumentFields,
      current.instrumentType,
      score,
      current.preparedRecommendation,
    )
    const next = {
      ...current,
      maxScore: value,
      instrumentFields: fields,
      preparedRecommendation: current.preparedRecommendation
        ? scoreRecommendation(current.preparedRecommendation, fields, score)
        : undefined,
    }
    latestDraft.current = next
    onChangeDraft(next)
  }

  function goToIssue(issue: ActivityCompletionIssue) {
    setStep(issue.tab)
    showHighlight(issue.target)
    setCompletionIssues([])
    window.setTimeout(() => {
      const field = document.querySelector<HTMLElement>(
        `[data-activity-required="${issue.target}"] input:not(:disabled), [data-activity-required="${issue.target}"] button, [data-activity-required="${issue.target}"] select, [data-activity-required="${issue.target}"] [contenteditable="true"]`,
      )
      field?.scrollIntoView?.({
        block: 'center',
        behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      })
      field?.focus()
    }, 0)
  }

  function saveActivity() {
    const issues = structuralLocked ? [] : validateActivityCompletion(activityDraft)
    if (issues.length > 0) {
      setCompletionIssues(issues)
      goToIssue(issues[0])
      setCompletionIssues(issues)
      return
    }
    if (stale || preparing) return
    setStep('review')
    setSummaryView('summary')
    setShowSummary(true)
  }

  function confirmActivitySave() {
    if (confirmingSave.current || saving) return
    confirmingSave.current = true
    setSaveFailure('')
    void Promise.resolve(onSaveActivity())
      .catch((reason) =>
        setSaveFailure(
          reason instanceof Error
            ? reason.message
            : 'No se pudo guardar. Tus cambios se conservan.',
        ),
      )
      .finally(() => {
        confirmingSave.current = false
      })
  }

  return (
    <section className="space-y-4" data-competency-block-id={block.id}>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <button type="button" className="font-medium text-primary hover:underline" onClick={onBack}>
          {props.returnLabel ?? 'Volver'}
        </button>
        <span>›</span>
        <span>{block.shortName}</span>
        <span>›</span>
        <span>{editingActivityId ? 'Editar actividad' : 'Crear actividad'}</span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-5 py-4 text-foreground shadow-sm">
        <div className="relative z-10 flex items-center gap-4">
          <span
            className={cn(
              'grid size-12 shrink-0 place-items-center rounded-xl',
              accent.card,
              accent.text,
            )}
          >
            <ClipboardList className="size-6" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              {block.shortName}
            </p>
            <h2 className="text-xl font-black">{blockShortNames[block.id] ?? block.name}</h2>
            <p className="mt-1 max-w-3xl text-xs text-muted-foreground">{block.name}</p>
          </div>
          {hasDraft ? (
            <Badge tone="warning" className="ml-auto">
              Borrador autoguardado
            </Badge>
          ) : null}
        </div>
      </div>

      <nav aria-label="Pasos de creación" className="flex flex-wrap gap-2">
        {(
          [
            ['activity', '1. Actividad'],
            ['instrument', '2. Instrumento'],
            ['review', '3. Revisar y guardar'],
          ] as const
        ).map(([id, label]) => (
          <Button
            key={id}
            variant={step === id ? 'secondary' : 'ghost'}
            aria-current={step === id ? 'step' : undefined}
            onClick={() => (id === 'review' ? saveActivity() : setStep(id))}
          >
            {label}
          </Button>
        ))}
      </nav>
      {fallbackNotice ? (
        <div
          role="status"
          className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm"
        >
          {fallbackNotice}
        </div>
      ) : null}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <main className="order-2 min-w-0 space-y-4 xl:order-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black text-foreground">
                {editingActivityId ? 'Editar actividad' : 'Crear actividad'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Completa la actividad y su instrumento como un único flujo.
              </p>
            </div>
            <div className="min-w-64 lg:w-72">
              <div className="flex items-center justify-between text-xs font-black">
                <span>Progreso de la actividad</span>
                <span className={accent.text}>{progressMeta.completion}%</span>
              </div>
              <ProgressBar
                value={progressMeta.completion}
                className="mt-2"
                indicatorGradient={accent.gradient}
              />
            </div>
          </div>

          {requiredFieldError ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {requiredFieldError}
            </div>
          ) : null}
          <div hidden={step !== 'activity'}>
            <ActivityDataSections
              structuralLocked={structuralLocked}
              activityDraft={activityDraft}
              teams={teams}
              accent={accent}
              highlightTarget={highlightTarget}
              onChangeDraft={handleDraftChange}
              onScoreChange={updateActivityScore}
              onInstrumentTypeChange={requestInstrumentChange}
              interpretation={interpretation}
              requiredFieldError={requiredFieldError}
              firstSecondaryLanguage={firstSecondaryLanguage}
              secondSecondaryLanguage={secondSecondaryLanguage}
            />
          </div>
          {savedSnapshot ? (
            <div
              role="alert"
              className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm"
            >
              Esta actividad tiene calificaciones. Puedes editar sus datos; para cambiar la
              estructura, duplica la actividad.
            </div>
          ) : null}

          <div
            hidden={step !== 'instrument'}
            data-activity-required="instrumentBody"
            className="space-y-3"
          >
            <h3 className="text-lg font-black text-foreground">
              6. Instrumento completo · {instrumentLabel}
            </h3>
            <p className="text-sm text-muted-foreground">
              Procedencia:{' '}
              {activityDraft.preparedManuallyEdited
                ? 'Edición manual docente'
                : activityDraft.preparedRecommendation?.catalogVersion === 'editable-fallback-v1'
                  ? 'Plantilla local editable'
                  : activityDraft.preparedRecommendation?.criteria.some(
                        (row) => row.sourceType === 'CURRICULUM_DERIVED',
                      )
                    ? 'Catálogo y currículo'
                    : activityDraft.preparedRecommendation
                      ? 'Catálogo revisado'
                      : 'Manual'}
            </p>
            {structuralLocked ? (
              <ReadOnlyInstrument
                type={activityDraft.instrumentType}
                fields={activityDraft.instrumentFields}
                maxScore={Number(activityDraft.maxScore)}
              />
            ) : null}
            {preparationError ? (
              <div
                role="alert"
                className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-foreground"
              >
                <p>{preparationError}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => requestRegeneration()}
                    disabled={preparing}
                  >
                    {preparing ? 'Preparando…' : 'Generar nuevo instrumento'}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={requestInstrumentFromScratch}
                  >
                    Crear desde cero
                  </Button>
                </div>
              </div>
            ) : null}
            {!preparationError &&
            !savedSnapshot &&
            (activityDraft.preparedRecommendation ||
              activityDraft.manualInstrumentBlank ||
              activityDraft.preparedManuallyEdited) ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => requestRegeneration()}
                  disabled={preparing}
                >
                  {preparing
                    ? 'Preparando…'
                    : regenerated
                      ? 'Instrumento preparado'
                      : 'Generar nuevo instrumento'}
                </Button>
                {!activityDraft.manualInstrumentBlank ? (
                  <Button type="button" variant="ghost" onClick={requestInstrumentFromScratch}>
                    Crear desde cero
                  </Button>
                ) : null}
              </div>
            ) : null}
            {stale && !preparationError ? (
              <div
                role="alert"
                className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm"
              >
                La actividad cambió. Revisa el instrumento antes de guardar.{' '}
                {activityDraft.preparedManuallyEdited
                  ? 'Se reemplazarán tus cambios manuales solo si lo confirmas.'
                  : null}{' '}
                {canKeepCurrentInstrument ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={preparing}
                    onClick={() =>
                      onChangeDraft({ ...activityDraft, preparedFingerprint: fingerprint })
                    }
                  >
                    Conservar instrumento actual
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => requestRegeneration()}
                  disabled={preparing}
                >
                  Regenerar
                </Button>
              </div>
            ) : null}
            {!structuralLocked &&
            (!preparationError ||
              activityDraft.preparedRecommendation ||
              activityDraft.manualInstrumentBlank) &&
            (!activityDraft.autoSelectedInstrumentType || activityDraft.preparedRecommendation) ? (
              <div>
                <InstrumentPreview
                  key={`${activityDraft.instrumentType}:${activityDraft.manualInstrumentBlank ? 'blank' : 'prepared'}:${activityDraft.instrumentFields[`${activityDraft.instrumentType}:meta:criteriaCount`] || ''}`}
                  accent={accent}
                  activityName={activityDraft.name}
                  block={block}
                  completed={activityDraft.instrumentCompleted}
                  fields={activityDraft.instrumentFields}
                  highlight={
                    highlightTarget === 'instrumentBody' || highlightTarget === 'instrumentType'
                  }
                  instrumentType={activityDraft.instrumentType}
                  maxScore={
                    activityDraft.instrumentFields[
                      `${activityDraft.instrumentType}:meta:scorePending`
                    ] === 'true'
                      ? 0
                      : (committedScore.current ?? 0)
                  }
                  skipDefaults={activityDraft.manualInstrumentBlank}
                  addingCriterion={addingCriterion}
                  onAddCriterion={requestAdditionalCriterion}
                  onCompletedChange={(instrumentCompleted) =>
                    handleDraftChange({ ...activityDraft, instrumentCompleted })
                  }
                  onFieldsChange={(instrumentFields, automatic) => {
                    const pointChanged = Object.keys(instrumentFields).some(
                      (key) =>
                        key.startsWith(`${activityDraft.instrumentType}:points:`) &&
                        instrumentFields[key] !== activityDraft.instrumentFields[key],
                    )
                    const levelChanged = Object.keys(instrumentFields).some(
                      (key) =>
                        key.startsWith(`${activityDraft.instrumentType}:level-points:`) &&
                        instrumentFields[key] !== activityDraft.instrumentFields[key],
                    )
                    const weightChanged = Object.keys(instrumentFields).some(
                      (key) =>
                        key.startsWith(`${activityDraft.instrumentType}:weight:`) &&
                        instrumentFields[key] !== activityDraft.instrumentFields[key],
                    )
                    const nextFields =
                      !automatic &&
                      pointChanged &&
                      instrumentFields[`${activityDraft.instrumentType}:meta:scoreWeights`] ===
                        activityDraft.instrumentFields[
                          `${activityDraft.instrumentType}:meta:scoreWeights`
                        ]
                        ? rememberManualScoreWeights(instrumentFields, activityDraft.instrumentType)
                        : instrumentFields
                    const weightedFields =
                      !automatic && levelChanged
                        ? rememberManualLevelWeights(nextFields, activityDraft.instrumentType)
                        : nextFields
                    handleDraftChange({
                      ...activityDraft,
                      preparedManuallyEdited: automatic
                        ? activityDraft.preparedManuallyEdited
                        : true,
                      instrumentFields:
                        !automatic && (pointChanged || weightChanged)
                          ? {
                              ...weightedFields,
                              [`${activityDraft.instrumentType}:meta:manualPoints`]: 'true',
                            }
                          : weightedFields,
                    })
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="flex justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => setStep(step === 'review' ? 'instrument' : 'activity')}
              disabled={step === 'activity'}
            >
              Anterior
            </Button>
            <Button
              type="button"
              disabled={saving || preparing || (step !== 'activity' && stale)}
              onClick={() => (step === 'activity' ? setStep('instrument') : saveActivity())}
            >
              {step === 'activity' ? 'Continuar al instrumento' : 'Revisar y guardar'}
            </Button>
          </div>
        </main>

        <ActivityProgressCard
          cancelHint={
            editingActivityId
              ? 'Los cambios no guardados de esta edición se descartarán.'
              : hasDraft
                ? 'El borrador se ha guardado en este dispositivo.'
                : 'Los cambios permanecen en esta pantalla. Comprueba el estado del borrador antes de salir.'
          }
          meta={progressMeta}
          onCancel={onBack}
          onSelectIssue={goToIssue}
        />
      </div>

      {showSummary && summaryView === 'instrument' ? (
        <InstrumentPreviewModal
          accent={accent}
          activityName={activityDraft.name}
          block={block}
          fields={activityDraft.instrumentFields}
          instrumentType={activityDraft.instrumentType}
          maxScore={Number(activityDraft.maxScore)}
          onClose={() => setSummaryView('summary')}
          returnLabel="Volver al resumen"
        />
      ) : null}
      {showSummary && summaryView !== 'instrument' ? (
        <Modal
          title={
            summaryView === 'summary'
              ? 'Resumen de la actividad'
              : summaryView === 'description'
                ? 'Descripción de la actividad'
                : 'Recursos de la actividad'
          }
          onClose={() => {
            if (summaryView === 'summary') setShowSummary(false)
            else setSummaryView('summary')
          }}
          className="max-w-3xl"
          contentClassName="p-5"
        >
          {saveFailure ? (
            <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {saveFailure}. Tus cambios se conservan; vuelve a guardar para reintentar.
            </p>
          ) : null}
          {summaryView === 'summary' ? (
            <div className="space-y-4">
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: <FileText className="size-4" />,
                    label: 'Título',
                    value: activityDraft.name,
                  },
                  {
                    icon: <Blocks className="size-4" />,
                    label: 'Bloques de competencias',
                    value: competencyBlocks
                      .filter((item) => (activityDraft.competencyBlockWeights[item.id] ?? 0) > 0)
                      .map((item) => item.shortName)
                      .join(', '),
                  },
                  {
                    icon: <BookOpen className="size-4" />,
                    label: 'Tipo de actividad',
                    value:
                      pedagogicalActivityLabels[activityDraft.pedagogicalActivityType ?? ''] ??
                      'Sin clasificar',
                  },
                  {
                    icon: <Users className="size-4" />,
                    label: 'Modalidad',
                    value: activityDraft.activityType === 'group' ? 'Grupal' : 'Individual',
                  },
                  {
                    icon: <Target className="size-4" />,
                    label: 'Técnica de evaluación',
                    value: formatActivityTechnique(activityDraft.evaluationTechnique),
                  },
                  {
                    icon: <ClipboardList className="size-4" />,
                    label: 'Tipo de instrumento',
                    value: instrumentTitle(activityDraft.instrumentType),
                  },
                  {
                    icon: <Scale className="size-4" />,
                    label: 'Valor total',
                    value: `${activityDraft.maxScore} puntos`,
                  },
                  ...(activityDraft.activityType === 'group'
                    ? [
                        {
                          icon: <Users className="size-4" />,
                          label: 'Equipos',
                          value:
                            teams
                              .filter((team) => activityDraft.teamIds.includes(team.id))
                              .map((team) => team.name)
                              .join(', ') || 'Sin equipos seleccionados',
                        },
                      ]
                    : []),
                  ...(activityDraft.resources.length
                    ? [
                        {
                          icon: <Box className="size-4" />,
                          label: 'Recursos',
                          value:
                            activityDraft.resources.length <= 3
                              ? activityDraft.resources.join(', ')
                              : `${activityDraft.resources.length} recursos`,
                        },
                      ]
                    : []),
                ].map((item) => (
                  <div key={item.label} className="flex gap-3 rounded-xl border border-border p-3">
                    <span className="text-primary">{item.icon}</span>
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">{item.label}</dt>
                      <dd className="break-words text-sm font-semibold text-foreground">
                        {item.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSummaryView('description')}
                >
                  <Eye className="size-4" />
                  Ver descripción
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSummaryView('instrument')}
                >
                  <Eye className="size-4" />
                  Ver instrumento
                </Button>
                {activityDraft.resources.length > 3 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSummaryView('resources')}
                  >
                    <Eye className="size-4" />
                    Ver recursos
                  </Button>
                ) : null}
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setShowSummary(false)}>
                  Volver a editar
                </Button>
                <Button type="button" disabled={saving} onClick={confirmActivitySave}>
                  Confirmar y guardar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="max-h-[60vh] overflow-auto rounded-xl border border-border bg-card p-4">
                {summaryView === 'description' ? (
                  <ActivityDescriptionContent
                    value={activityDraft.description}
                    fallback="Sin descripción."
                  />
                ) : (
                  <ul className="space-y-2">
                    {activityDraft.resources.map((resource) => (
                      <li key={resource}>{resource}</li>
                    ))}
                  </ul>
                )}
              </div>
              <Button type="button" variant="outline" onClick={() => setSummaryView('summary')}>
                Volver al resumen
              </Button>
            </div>
          )}
        </Modal>
      ) : null}
      {completionIssues.length > 0 ? (
        <ActivityCompletionModal
          deleteLabel={editingActivityId ? 'Descartar cambios' : 'Eliminar borrador'}
          issues={completionIssues}
          onClose={() => setCompletionIssues([])}
          onDelete={onBack}
          onSelectIssue={goToIssue}
          onSaveDraft={() => {
            setCompletionIssues([])
            onSaveDraft()
          }}
        />
      ) : null}
      {pendingInstrumentType ? (
        <ConfirmDialog
          title="¿Reemplazar el instrumento editado?"
          description="Volver a preparar el instrumento reemplazará tus criterios, indicadores y cambios manuales actuales."
          confirmLabel="Cambiar instrumento"
          cancelLabel="Conservar cambios"
          onClose={() => setPendingInstrumentType('')}
          onConfirm={async () => {
            const nextType = pendingInstrumentType
            setPendingInstrumentType('')
            if (nextType === '__scratch__') {
              createInstrumentFromScratch()
              return
            }
            if (nextType === '__fallback__') {
              useEditableTemplate(undefined, true)
              return
            }
            await prepare(
              nextType === '__auto__' ||
                nextType === '__regenerate__' ||
                (nextType === activityDraft.instrumentType &&
                  activityDraft.autoSelectedInstrumentType)
                ? undefined
                : nextType,
              true,
              nextType === '__auto__',
              nextType === '__regenerate__',
            )
          }}
        />
      ) : null}
      {confirmCriterionRedistribution ? (
        <ConfirmDialog
          title="¿Redistribuir los puntos editados?"
          description="Para incorporar el criterio se ajustarán proporcionalmente los puntos manuales actuales y se conservará el total de la actividad."
          confirmLabel="Redistribuir y añadir"
          cancelLabel="Conservar cambios"
          onClose={() => {
            pendingCriterionAddition.current = null
            setConfirmCriterionRedistribution(false)
          }}
          onConfirm={() => {
            const pending = pendingCriterionAddition.current
            pendingCriterionAddition.current = null
            setConfirmCriterionRedistribution(false)
            if (pending) applyAddedCriterion(pending.criterion, pending.onAdded)
          }}
        />
      ) : null}
    </section>
  )
}
