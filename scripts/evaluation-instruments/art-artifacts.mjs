import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { commonArtModules,commonPhysicalModules } from '../../packages/shared/src/index.ts'
import {
  editableFallbackRecommendation,
  recommendationToFields,
} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
import { scoreInstrumentFields } from '../../apps/frontend/src/modules/activities/services/instrumentScoring.ts'
import { validateInstrumentDefinition } from '../../packages/shared/src/index.ts'
import { evaluationCatalogCurrent } from '../../apps/backend/src/modules/evaluation-instruments/catalog-current.ts'

const subjectFlag=process.argv.indexOf('--subject'),subjectCode=subjectFlag<0?'ART':process.argv[subjectFlag+1]
assert(['ART','EFI'].includes(subjectCode),'Área común con fuente y proveedor explícitos requerida')
const physical=subjectCode==='EFI',family=physical?'physical':'art',fileStem=physical?'physical':'artistica',templatePrefix=physical?'efi':'art',subjectName=physical?'Educación Física':'Educación Artística'
const flag = process.argv.indexOf('--grade'),
  grade = flag < 0 ? 1 : Number(process.argv[flag + 1])
assert((physical?[1,2]:[1,2,3,4,5,6]).includes(grade), 'Solo se admiten los grados con páginas, anclas y exclusiones revisadas explícitamente.')
const pdfPages = physical ? grade===1?[359,360,361]:[362,363,364] : grade === 1 ? [330,331] : grade === 2 ? [332,333] : grade === 3 ? [334,335] : grade === 4 ? [341,342,343] : grade === 5 ? [344,345,346] : [347,348,349]
const gradeName = ['', 'one', 'two', 'three', 'four', 'five', 'six'][grade]
const module = (physical?commonPhysicalModules:commonArtModules).find((row) => row.grade === grade)
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
    row.subjectName === subjectName &&
    row.grade === grade &&
    !row.optativeExitName,
)
const literal = records.filter((row) => row.kind === 'element' && row.scopeKey === scope.stableKey)
const mapping = JSON.parse(
  readFileSync(directory + `${fileStem}-${grade}-correspondencias.json`, 'utf8'),
)
assert.equal(mapping.scopeId, scope.id)
assert.equal(mapping.sourceSha256, source.sha256)
const exclusions = (physical ? grade===1 ? [
  ...['30f04f76','7a6eeb3e','e0ddee18','cff05e33','b40ad2e6','c7b8407a','d86ce6e6','a2fa9de0','1c7a91bf','d69d0d85','3e01de7d','2ab97f2c','41ae5100','e4561e74','2a6cb6c3','919bfeb3','4240375e','e042fcac','68f82dc8'].map(prefix=>({prefix,reason:'PURE_HEADING',explanation:'Organizador de contenidos, sin desempeño independiente. Los deportes optativos dentro de EFI no son salidas académicas adicionales.'})),
  ...['dd8e23a1','7417b621','7e6b6e07'].map(prefix=>({prefix,reason:'PRIVATE_ENJOYMENT',explanation:'El disfrute o identidad internos no se infieren ni puntúan; las acciones del juego se observan cuando se solicitan.'})),
  ...['64c80440','8c5a6dd6'].map(prefix=>({prefix,reason:'PRIVATE_TRAIT',explanation:'La perseverancia interna no se puntúa como rasgo; se evalúan propuestas, decisiones o acciones expresamente solicitadas.'})),
] : [
  ...['6ac11444','ca4c0a9a','465409d0','2ec45171','af737c88','2dc248af','14d52317','695c549e','7f1d8672','7057ad78'].map(prefix=>({prefix,reason:'PURE_HEADING',explanation:'Organizador sin desempeño independiente. Las filas con acciones agrupadas permanecen completas; los deportes optativos dentro de EFI no son salidas académicas.'})),
  ...['926b4598','c5ffa50f'].map(prefix=>({prefix,reason:'PRIVATE_TRAIT',explanation:'No se califica perseverancia interna; las decisiones o propuestas observables se evalúan solo cuando se piden expresamente.'})),
] : grade === 1 ? [
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
] : grade === 3 ? [
  ...['541d41bb','ed32be0b','f9362901','c3bf9f72'].map(prefix => ({ prefix, reason: 'PURE_HEADING', explanation: 'Encabezado de lenguaje artístico, sin desempeño independiente.' })),
  { prefix: '7060b34d', reason: 'PRIVATE_LEISURE', explanation: 'No se puntúa el entretenimiento de los momentos de ocio privado.' },
  { prefix: '95944dbb', reason: 'PRIVATE_ENJOYMENT', explanation: 'Disfrutar la programación artística no es un desempeño verificable ni un atributo personal puntuable.' },
] : grade === 4 ? [
  ...['2b1efffa','9c92a778','d7edba97','168e84e8'].map(prefix => ({ prefix, reason: 'PURE_HEADING', explanation: 'Encabezado de lenguaje artístico, sin desempeño independiente.' })),
  { prefix: 'c5defbd4', reason: 'PRIVATE_IDENTITY', explanation: 'El fortalecimiento de identidad personal y social no se infiere ni se puntúa; las decisiones de obras y referentes se evalúan cuando son expresamente solicitadas.' },
] : grade === 5 ? [
  ...['dfa76b3f','8f68133b','bafda287','35f1fc12'].map(prefix => ({ prefix, reason: 'PURE_HEADING', explanation: 'Encabezado de columna, sin desempeño independiente. El literal Educación Artística en la posición musical se conserva sin crear otra asignatura.' })),
  { prefix: '22b54a35', reason: 'PRIVATE_ENJOYMENT', explanation: 'El disfrute musical privado no se infiere ni se puntúa; se observan relaciones y evidencias musicales cuando se solicitan.' },
  { prefix: 'e48036a0', reason: 'PRIVATE_ENJOYMENT', explanation: 'El deleite privado ante signos y símbolos no se puntúa; la interpretación y creación simbólicas se observan en evidencias de las obras.' },
] : [
  ...['aecd5c4d','e171542f','6cfc7d6e','004ad150'].map(prefix => ({ prefix, reason: 'PURE_HEADING', explanation: 'Encabezado de lenguaje artístico, sin desempeño independiente.' })),
  { prefix: '4a6d338e', reason: 'PRIVATE_ENJOYMENT', explanation: 'La apertura a disfrutar o valorar expresiones artísticas no se infiere ni se puntúa como disposición interna; se observan decisiones y argumentos de las obras cuando se solicitan.' },
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
  readFileSync(`data/evaluation-instruments/${family}-grade-${gradeName}-contracts.json`, 'utf8'),
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
  subjectCode,
  subjectName,
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
        proposal.criteria.every((row) => row.templateId.startsWith(`${templatePrefix}-${grade}-`)),
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
const reviewedPath = directory + `${fileStem}-${grade}-revision-instrumentos.json`
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
  provider: `packages/shared/src/secondary-${family}.ts`,
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
const sourcePublicationPath = `.wrangler/secondary-completion/MINERD_SECUNDARIA_2023_${subjectCode}_COMUN_G${grade}_V1-source.json`
if (existsSync(sourcePublicationPath)) {
  const publication = JSON.parse(readFileSync(sourcePublicationPath, 'utf8'))
  assert.equal(publication.project, 'eolgunypmtgrsyrjzcld')
  assert.equal(publication.elements, literal.length)
  matrix.sourcePublication = { project: publication.project, code: publication.code, versionId: publication.versionId, scopeId: publication.scopeId, result: publication.result, sourceRowsAndSpansMatched: true }
}
const httpPath = `.wrangler/secondary-completion/${family}-${grade}-http.json`
if (existsSync(httpPath)) {
  const http = JSON.parse(readFileSync(httpPath, 'utf8'))
  assert.equal(http.project, 'eolgunypmtgrsyrjzcld')
  assert.equal(http.catalog, matrix.providerCatalog)
  assert.deepEqual([...new Set(http.samples.map(sample => sample.format))], ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'])
  assert(http.samples.every(sample => sample.strategyOnlyInstrumentUnchanged && sample.manualTextPreserved))
  matrix.verification.httpDb = 'AUTHENTICATED_FOUR_FORMATS_SAVED_REOPENED'
  matrix.verification.httpEvidence = { catalog: http.catalog, sourceScope: http.sourceScope, samples: http.samples.length, formats: [...new Set(http.samples.map(sample => sample.format))] }
}
const browserPath = directory + `${fileStem}-${grade}-verificacion-navegador-${matrix.providerCatalog}.json`
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
  directory + `${fileStem}-${grade}-instrumentos.json`,
  JSON.stringify(examples, null, 2) + '\n',
)
writeFileSync(directory + `${fileStem}-${grade}-matriz.json`, JSON.stringify(matrix, null, 2) + '\n')
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
