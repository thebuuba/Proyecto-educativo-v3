import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/services/apiClient'
import { saveActivity } from './activitiesService'
import { activityToDraft, draftToActivity } from '../components/editor/editorModel'

vi.mock('@/services/apiClient', () => ({ api: { post: vi.fn() } }))

// Compile the actual backend DTO and catalog with its decorator settings, not a copied whitelist.
const backendRequire = createRequire(resolve('../backend/package.json'))
backendRequire('reflect-metadata')
const ts = backendRequire('typescript')
function sourceModule(file: string): Record<string, any> {
  const output = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    },
  }).outputText
  const target = { exports: {} }
  const requireSource = (id: string) =>
    id.startsWith('.') ? sourceModule(resolve(dirname(file), id + '.ts')) : backendRequire(id)
  new Function('require', 'module', 'exports', output)(requireSource, target, target.exports)
  return target.exports
}
const { SaveActivityDto } = sourceModule(
  resolve('../backend/src/modules/activities/dto/save-activity.dto.ts'),
)
const { plainToInstance } = backendRequire('class-transformer')
const { validateSync } = backendRequire('class-validator')

describe('activity HTTP write contract', () => {
  beforeEach(() => vi.mocked(api.post).mockReset())
  const original = {
    id: 'activity',
    name: 'Original',
    maxScore: 20,
    competencyBlockId: 'b1',
    evaluatedCount: 1,
    instrumentSnapshotId: 'snapshot',
    instrumentSnapshotVersion: 2,
    profileCompatibility: 'compatible' as const,
    planningId: 'entry',
    source: 'planning' as const,
    date: '2026-10-12',
    studentRole: 'Investigar',
    teacherRole: 'Guiar',
    observations: 'Anterior',
    futurePlanningLink: '/future',
    futureInstrumentLink: '/future-instrument',
  }
  it('posts response-derived graded edits through the real strict DTO whitelist', async () => {
    const edited = draftToActivity({ ...activityToDraft(original), name: 'Corregida' }, original)
    await saveActivity({
      ...edited,
      id: original.id,
      sectionSubjectId: 'subject',
      academicPeriodId: 'period',
      schoolYearId: 'year',
    })
    const body = JSON.parse(JSON.stringify(vi.mocked(api.post).mock.calls[0][1]))
    expect(
      validateSync(plainToInstance(SaveActivityDto, body), {
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    ).toEqual([])
    expect(body).toMatchObject({
      id: 'activity',
      name: 'Corregida',
      planningEntryId: 'entry',
      source: 'planning',
      maxScore: 20,
    })
    for (const key of [
      'evaluatedCount',
      'instrumentSnapshotId',
      'instrumentSnapshotVersion',
      'profileCompatibility',
      'planningId',
      'futurePlanningLink',
      'futureInstrumentLink',
    ])
      expect(body).not.toHaveProperty(key)
  })
  it('sends explicit empty metadata and date so the server can clear old values', async () => {
    const edited = draftToActivity(
      {
        ...activityToDraft(original),
        date: '',
        studentRole: '',
        teacherRole: '',
        observations: '',
      },
      original,
    )
    await saveActivity({
      ...edited,
      id: original.id,
      sectionSubjectId: 'subject',
      academicPeriodId: 'period',
    })
    const body = JSON.parse(JSON.stringify(vi.mocked(api.post).mock.calls[0][1]))
    expect(body).toMatchObject({ date: '', studentRole: '', teacherRole: '', observations: '' })
    expect(
      validateSync(plainToInstance(SaveActivityDto, body), {
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    ).toEqual([])
    const reopened = activityToDraft({ ...original, ...body })
    expect(reopened).toMatchObject({ date: '', studentRole: '', teacherRole: '', observations: '' })
  })
  it('never sends a creation retry token on updates, while preserving it on creation', async () => {
    const input = {
      ...original,
      creationId: crypto.randomUUID(),
      sectionSubjectId: 'subject',
      academicPeriodId: 'period',
    }
    await saveActivity(input)
    expect(JSON.parse(JSON.stringify(vi.mocked(api.post).mock.calls[0][1]))).not.toHaveProperty(
      'creationId',
    )
    await saveActivity({ ...input, id: undefined })
    expect(vi.mocked(api.post).mock.calls[1][1]).toMatchObject({ creationId: input.creationId })
  })
})
