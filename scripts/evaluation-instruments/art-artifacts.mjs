import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { commonArtModules } from '../../packages/shared/src/index.ts'
import {
  editableFallbackRecommendation,
  recommendationToFields,
} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
import { scoreInstrumentFields } from '../../apps/frontend/src/modules/activities/services/instrumentScoring.ts'
import { validateInstrumentDefinition } from '../../packages/shared/src/index.ts'
import { evaluationCatalogCurrent } from '../../apps/backend/src/modules/evaluation-instruments/catalog-current.ts'

const flag = process.argv.indexOf('--grade'),
  grade = flag < 0 ? 1 : Number(process.argv[flag + 1])
assert([1,2,3].includes(grade), 'Solo se admiten los grados con páginas, anclas y exclusiones revisadas explícitamente.')
const pdfPages = grade === 1 ? [330,331] : grade === 2 ? [332,333] : [334,335]
const gradeName = grade === 1 ? 'one' : grade === 2 ? 'two' : 'three'
const module = commonArtModules.find((row) => row.grade === grade)
assert(module, 'Grado con proveedor conectado requerido')
const directory = 'docs/curriculum/cobertura-secundaria/'
const records = readFileSync('data/curriculum/secondary-2023.jsonl', 'utf8')
  .trim()
  .split('\n')
  .map(JSON.parse)
const source = records.find((row) => row.kind === 'document')
assert.equal(
  createHash('sha256')
    .update(
      readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf'),
    )
    .digest('hex'),
  source.sha256,
)
const scope = records.find(
  (row) =>
    row.kind === 'scope' &&
    row.subjectName === 'Educación Artística' &&
    row.grade === grade &&
    !row.optativeExitName,
)
const literal = records.filter((row) => row.kind === 'element' && row.scopeKey === scope.stableKey)
const mapping = JSON.parse(
  readFileSync(directory + `artistica-${grade}-correspondencias.json`, 'utf8'),
)
assert.equal(mapping.scopeId, scope.id)
assert.equal(mapping.sourceSha256, source.sha256)
const exclusions = (grade === 1 ? [
  {
    prefix: '03bf6274',
    reason: 'PURE_HEADING',
    explanation: 'Encabezado Artes Visuales; no desempeño independiente.',
  },
  {
    prefix: '11b0676c',
    reason: 'PRIVATE_DISPOSITION',
    explanation:
      'La sensibilidad estética como disposición interna no se puntúa; se evalúan relaciones tonales observables cuando se solicitan.',
  },
  {
    prefix: '6b87cdd6',
    reason: 'PRIVATE_CAPACITY',
    explanation:
      'No se califica capacidad imaginativa ni preferencia por la originalidad; se observan decisiones de síntesis y transformación del producto pedido.',
  },
] : grade === 2 ? [
  { prefix: 'da7ef7d0', reason: 'PURE_HEADING', explanation: 'Encabezado Artes Visuales; no desempeño independiente.' },
  { prefix: '8a98d0d0', reason: 'PRIVATE_CAPACITY', explanation: 'Capacidad imaginativa y valoración de originalidad no son atributos privados puntuables; se observan decisiones del producto pedido.' },
  { prefix: '8b3358e3', reason: 'PRIVATE_LEISURE', explanation: 'No se puntúa el entretenimiento del estudiante en su ocio privado.' },
  { prefix: '1812e660', reason: 'PRIVATE_CAPACITY', explanation: 'No se infiere capacidad creativa propia o ajena; se analizan evidencias y decisiones de obras concretas.' },
] : [
  ...['541d41bb','ed32be0b','f9362901','c3bf9f72'].map(prefix => ({ prefix, reason: 'PURE_HEADING', explanation: 'Encabezado de lenguaje artístico, sin desempeño independiente.' })),
  { prefix: '7060b34d', reason: 'PRIVATE_LEISURE', explanation: 'No se puntúa el entretenimiento de los momentos de ocio privado.' },
  { prefix: '95944dbb', reason: 'PRIVATE_ENJOYMENT', explanation: 'Disfrutar la programación artística no es un desempeño verificable ni un atributo personal puntuable.' },
]).map(({ prefix, ...row }) => {
  const original = literal.find((item) => item.id.startsWith(prefix))
  assert(original)
  return {
    ...row,
    id: original.id,
    type: original.type,
    text: original.originalText,
    pdfPage: original.source.pdfPage,
  }
})
const mapped = new Set(Object.values(mapping.topicRecords).flat())
assert(
  literal
    .filter((row) => ['CONCEPT', 'PROCEDURE'].includes(row.type))
    .every((row) => mapped.has(row.id) || exclusions.some((item) => item.id === row.id)),
)
const contracts = JSON.parse(
  readFileSync(`data/evaluation-instruments/art-grade-${gradeName}-contracts.json`, 'utf8'),
)
assert.equal(contracts.grade, grade)
for (const task of contracts.cases)
  for (const prefix of task.sourceRecordIds)
    assert(
      literal.some((row) => row.id.startsWith(prefix)),
      task.id + ' / ' + prefix,
    )
const cases = [
  ...module.topics.map((topic) => ({
    id: topic.id,
    description: `Explica ${topic.label}.`,
    purpose: 'ANALYSIS',
    kind: 'BRIEF',
    sourceRecordIds: topic.sourceRecordIds,
  })),
  ...contracts.cases.map((task) => ({ ...task, id: `case:${task.id}`, kind: 'SPECIFIC' })),
]
assert.equal(
  new Set(cases.map((task) => task.id)).size,
  cases.length,
  'Cada consigna necesita una identidad única, también frente al tema breve',
)
const context = {
  level: 'SECONDARY',
  grade,
  subjectCode: 'ART',
  subjectName: 'Educación Artística',
  modalityCode: null,
  optativeExitName: null,
}
const examples = []
for (const task of cases)
  for (const instrumentType of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada']) {
    const proposal = editableFallbackRecommendation({
      activityTitle: 'Un título antiguo sobre células',
      description: task.description,
      maxScore: 17.35,
      instrumentType,
      participationMode: 'INDIVIDUAL',
      academicContext: context,
    })
    assert(
      proposal.criteria.length &&
        proposal.criteria.every((row) => row.templateId.startsWith(`art-${grade}-`)),
      task.id,
    )
    const fields = scoreInstrumentFields(
      recommendationToFields(proposal, 'Actividad'),
      instrumentType,
      17.35,
      proposal,
    )
    assert.deepEqual(validateInstrumentDefinition(instrumentType, fields, 17.35), [])
    examples.push({
      id: task.id,
      kind: task.kind,
      description: task.description,
      instrumentType,
      purpose: task.purpose,
      activityType: proposal.activityType,
      totalScore: 17.35,
      levels: proposal.levels,
      criteria: proposal.criteria.map(({ id, sourceReferences, sourceType, ...row }) => row),
    })
  }
const reviewedPath = directory + `artistica-${grade}-revision-instrumentos.json`
const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex')
const review = existsSync(reviewedPath)
  ? JSON.parse(readFileSync(reviewedPath, 'utf8'))
  : { items: [] }
const reviewed = examples.filter((example) =>
  review.items.some(
    (row) =>
      row.caseId === example.id &&
      row.instrumentType === example.instrumentType &&
      row.sha256 === digest(example),
  ),
)
const matrix = {
  source,
  grade,
  scopeId: scope.id,
  pdfPages,
  printedPages: pdfPages.map(page => page - 1),
  sourceVisualReview: {
    status: 'REVIEWED',
    pages: pdfPages,
    method:
      'Complete rendered pages: competency and content columns, then all achievement indicators.',
  },
  status: reviewed.length === examples.length ? 'CONNECTED_REPRESENTATIVE_INSTRUMENTS_REVIEWED_RUNTIME_PENDING' : 'CONNECTED_SOURCE_AND_CONTRACTS_FULL_INSTRUMENT_REVIEW_AND_RUNTIME_PENDING',
  provider: 'packages/shared/src/secondary-art.ts',
  providerCatalog: evaluationCatalogCurrent.version,
  officialRecords: literal.map((row) => ({
    id: row.id,
    type: row.type,
    text: row.originalText,
    pdfPage: row.source.pdfPage,
    printedPage: row.source.printedPage,
  })),
  topics: module.topics.map((topic) => ({
    ...topic,
    reviewedOfficialRecordIds: mapping.topicRecords[topic.id],
  })),
  explicitExclusions: exclusions,
  verification: {
    automatedFixtures: cases.length,
    fullInstrumentsGenerated: examples.length,
    fullReview: {
      reviewedWithMatchingDigest: reviewed.length,
      pending: examples.length - reviewed.length,
    },
    httpDb: 'PENDING',
    browser: 'PENDING',
  },
  limits: [
    'Los ejemplos son patrones representativos, no todas las variantes de filas compuestas.',
    'Los criterios son adaptaciones de AulaBase; no texto oficial ni atribución literal por criterio.',
    'Las actitudes solo contextualizan acciones observables pedidas; no se evalúan intimidad, identidad ni personalidad.',
    'No hay ejecución real de clase o visita acreditada por esta matriz.',
  ],
}
const sourcePublicationPath = `.wrangler/secondary-completion/MINERD_SECUNDARIA_2023_ART_COMUN_G${grade}_V1-source.json`
if (existsSync(sourcePublicationPath)) {
  const publication = JSON.parse(readFileSync(sourcePublicationPath, 'utf8'))
  assert.equal(publication.project, 'eolgunypmtgrsyrjzcld')
  assert.equal(publication.elements, literal.length)
  matrix.sourcePublication = { project: publication.project, code: publication.code, versionId: publication.versionId, scopeId: publication.scopeId, result: publication.result, sourceRowsAndSpansMatched: true }
}
const httpPath = `.wrangler/secondary-completion/art-${grade}-http.json`
if (existsSync(httpPath)) {
  const http = JSON.parse(readFileSync(httpPath, 'utf8'))
  assert.equal(http.project, 'eolgunypmtgrsyrjzcld')
  assert.equal(http.catalog, matrix.providerCatalog)
  assert.deepEqual([...new Set(http.samples.map(sample => sample.format))], ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'])
  assert(http.samples.every(sample => sample.strategyOnlyInstrumentUnchanged && sample.manualTextPreserved))
  matrix.verification.httpDb = 'AUTHENTICATED_FOUR_FORMATS_SAVED_REOPENED'
  matrix.verification.httpEvidence = { catalog: http.catalog, sourceScope: http.sourceScope, samples: http.samples.length, formats: [...new Set(http.samples.map(sample => sample.format))] }
}
const browserPath = directory + `artistica-${grade}-verificacion-navegador-${matrix.providerCatalog}.json`
if (existsSync(browserPath)) {
  const browser = JSON.parse(readFileSync(browserPath, 'utf8'))
  assert.equal(browser.grade, grade)
  assert.equal(browser.catalog, matrix.providerCatalog)
  assert(browser.savedAndReopenedAfterManualStrategy && browser.existingDraftsPreserved)
  assert.equal(browser.readOnlyDatabaseInstrumentFingerprintBefore, browser.readOnlyDatabaseInstrumentFingerprintAfter)
  matrix.verification.browser = { status: browser.status, catalog: browser.catalog, evidence: browserPath, format: browser.format, limits: browser.limits }
  if (matrix.verification.httpDb === 'AUTHENTICATED_FOUR_FORMATS_SAVED_REOPENED' && reviewed.length === examples.length) matrix.status = 'REPRESENTATIVE_VARIANTS_HTTP_PERSONAL_VERIFIED_NOT_FULL_PROCEDURAL_COVERAGE'
}
writeFileSync(
  directory + `artistica-${grade}-instrumentos.json`,
  JSON.stringify(examples, null, 2) + '\n',
)
writeFileSync(directory + `artistica-${grade}-matriz.json`, JSON.stringify(matrix, null, 2) + '\n')
console.log(
  JSON.stringify({
    grade,
    topics: module.topics.length,
    cases: cases.length,
    instruments: examples.length,
    reviewed: reviewed.length,
    pending: examples.length - reviewed.length,
    catalog: evaluationCatalogCurrent.version,
    remoteWrites: false,
  }),
)
