import { useCallback, useEffect, useState } from 'react'
import {
  activityDraftStorageKey,
  readActivityDraftsForContext,
  writeActivityDrafts,
  type ActivityDraftContext,
  type ActivityDraftStorageResult,
} from '../utils/activityDraftStorage'
import {
  normalizeStoredActivityDrafts,
  type ActivityDraft,
  type ActivityDraftsByBlock,
} from '../components/editor/editorModel'

export function useActivityDrafts(
  context: ActivityDraftContext | undefined,
  courseTitle: string,
  periodShortName: string,
) {
  let key = ''
  try {
    if (context) key = activityDraftStorageKey(context)
  } catch {
    /* Report incomplete scope below. */
  }
  const [state, setState] = useState<{
    key: string
    drafts: ActivityDraftsByBlock
    ready: boolean
    error: string | null
  }>({ key: '', drafts: {}, ready: false, error: null })
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (!key || !context) {
      setState({
        key,
        drafts: {},
        ready: false,
        error: 'Falta el contexto de la cuenta o del período. No se puede guardar el borrador.',
      })
      return
    }
    try {
      setState({
        key,
        drafts: normalizeStoredActivityDrafts(readActivityDraftsForContext<ActivityDraft>(context)),
        ready: true,
        error: null,
      })
    } catch {
      setState({
        key,
        drafts: {},
        ready: false,
        error:
          'No se pudieron leer los borradores. Reintenta el acceso; tus entradas guardadas se conservan.',
      })
    }
  }, [key, retry])
  const persist = useCallback(
    (drafts: ActivityDraftsByBlock): ActivityDraftStorageResult => {
      if (!context || !key || state.key !== key || !state.ready)
        return {
          ok: false,
          error: state.error ?? 'Espera a que los borradores terminen de cargar.',
        }
      const result = writeActivityDrafts(context, drafts, { courseTitle, periodShortName })
      setState({ key, drafts, ready: true, error: result.ok ? null : result.error })
      return result
    },
    [key, state.key, state.ready, state.error, courseTitle, periodShortName],
  )
  return {
    drafts: state.key === key ? state.drafts : {},
    ready: state.key === key && state.ready,
    error: state.key === key ? state.error : null,
    persist,
    retry: () => setRetry((value) => value + 1),
  }
}
