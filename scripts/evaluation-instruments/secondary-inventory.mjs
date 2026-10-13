import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const elementTypes = ['CONCEPT', 'PROCEDURE', 'ATTITUDE_VALUE', 'SPECIFIC_COMPETENCY', 'FUNDAMENTAL_COMPETENCY', 'ACHIEVEMENT_INDICATOR', 'EVALUATION_CRITERION']
const sourceUrl = 'https://ministeriodeeducacion.gob.do/docs/direccion-general-de-curriculo/Ht7X-adecuacion-secundaria-2023pdf.pdf'
const reference = element => ({ id: element.id, text: element.originalText, pdfPage: element.source.pdfPage, printedPage: element.source.printedPage, sourceOrder: element.sourceOrder })

/** Heading candidates from the concept column only. Other columns stay unassociated until reviewed. */
function topicCandidates(concepts) {
  const topics = []
  for (const element of concepts) {
    const ref = reference(element)
    if (/^[\s•●\-–]*Nota:/i.test(element.originalText) || /^[a-záéíóúüñ]/.test(element.originalText)) {
      if (topics.length) (topics.at(-1).sourceNotes ??= []).push(ref)
      continue
    }
    if (!/^[\s•●\-–]/.test(element.originalText)) {
      topics.push({ id: element.id, title: element.originalText, source: ref, subtopics: [],
        procedures: [], procedureAssociation: 'PENDING_VISUAL_REVIEW', boundaryReview: 'PENDING_VISUAL_REVIEW',
        implementation: 'PENDING', automatedVerification: 'NOT_RUN', manualVerification: 'NOT_RUN', applicationVerification: 'NOT_RUN' })
    } else if (topics.length) topics.at(-1).subtopics.push(ref)
  }
  return topics
}

/** Reviewed evidence lives separately, so rebuilding extraction cannot erase progress. */
export function applyInventoryReview(inventory, review) {
  if (review.sourceSha256 !== inventory.source.sha256) throw new Error('La revisión corresponde a otra fuente.')
  const statusFields = ['implementation', 'automatedVerification', 'manualVerification', 'applicationVerification', 'boundaryReview', 'procedureAssociation', 'report', 'catalogVersion']
  for (const entry of review.topics ?? []) {
    const scope = inventory.scopes.find(scope => scope.topics.some(topic => topic.id === entry.id))
    if (!scope) throw new Error(`Tema de revisión desconocido: ${entry.id}`)
    const topic = scope.topics.find(topic => topic.id === entry.id)
    for (const field of statusFields) if (entry[field] !== undefined) topic[field] = entry[field]
    if (entry.procedures) {
      topic.procedures = entry.procedures.map(id => {
        const procedure = scope.elements.PROCEDURE.find(element => element.id === id)
        if (!procedure) throw new Error(`Referencia de procedimiento ajena al ámbito: ${id}`)
        return procedure
      })
    }
  }
  return inventory
}

export function buildSecondaryInventory(rows) {
  const document = rows.find(row => row.kind === 'document')
  if (!document) throw new Error('Falta el documento curricular de origen.')
  const elements = rows.filter(row => row.kind === 'element')
  const scopes = rows.filter(row => row.kind === 'scope').map(scope => {
    const scoped = elements.filter(element => element.scopeKey === scope.stableKey).sort((a, b) => a.sourceOrder - b.sourceOrder)
    const grouped = Object.fromEntries(elementTypes.map(type => [type, scoped.filter(element => element.type === type).map(reference)]))
    return { id: scope.id, stableKey: scope.stableKey, cycle: scope.cycle, grade: scope.grade,
      area: scope.areaName, subject: scope.subjectName, modality: scope.modalityName ?? null, exit: scope.optativeExitName ?? null,
      character: scope.optativeExitName ? 'OPTATIVE' : 'COMMON', pdfPages: [...new Set(scoped.map(element => element.source.pdfPage))].sort((a, b) => a - b),
      elements: grouped, topics: topicCandidates(scoped.filter(element => element.type === 'CONCEPT')),
      extraction: 'EXTRACTED_PENDING_REVIEW', implementation: 'PENDING', automatedVerification: 'NOT_RUN', manualVerification: 'NOT_RUN', applicationVerification: 'NOT_RUN' }
  })
  return { source: { ...document, url: sourceUrl }, scopeCount: scopes.length,
    scopes: scopes.filter(scope => scope.grade !== null), cycleScopes: scopes.filter(scope => scope.grade === null),
    relations: rows.filter(row => row.kind === 'relation'),
    caveats: [
      'Los encabezados de temas son candidatos de la columna conceptual, no asociaciones pedagógicas aprobadas.',
      'Procedimientos, actitudes, competencias e indicadores se conservan por ámbito; no se asignan a temas por proximidad entre columnas.',
      'Las relaciones conservadas son únicamente EXPLICITLY_LINKED de la extracción original.',
      'La extracción original conserva la denominación Tigonometría del PDF; no se corrige silenciosamente.',
    ] }
}

const csv = value => `"${String(value ?? '').replaceAll('"', '""')}"`
export function writeSecondaryInventory(output = 'docs/curriculum/cobertura-secundaria') {
  const rows = readFileSync('data/curriculum/secondary-2023.jsonl', 'utf8').trim().split('\n').map(JSON.parse)
  const extracted = buildSecondaryInventory(rows)
  const reviewPath = `${output}/revision.json`
  const result = existsSync(reviewPath) ? applyInventoryReview(extracted, JSON.parse(readFileSync(reviewPath, 'utf8'))) : extracted
  mkdirSync(output, { recursive: true })
  writeFileSync(`${output}/inventario.json`, JSON.stringify(result, null, 2) + '\n')
  const header = ['scope_id', 'cycle', 'grade', 'area', 'subject', 'character', 'modality', 'exit', 'topic_id', 'topic', 'pdf_page', 'printed_page', 'subtopics', 'boundary_review', 'implementation', 'automated_verification', 'manual_verification', 'application_verification']
  const lines = result.scopes.flatMap(scope => (scope.topics.length ? scope.topics : [null]).map(topic => [
    scope.id, scope.cycle, scope.grade, scope.area, scope.subject, scope.character, scope.modality, scope.exit,
    topic?.id, topic?.title, topic?.source.pdfPage, topic?.source.printedPage,
    topic?.subtopics.map(item => item.text.replace(/\s+/g, ' ')).join(' | '),
    topic?.boundaryReview ?? 'PENDING_TOPIC_EXTRACTION', topic?.implementation ?? scope.implementation, topic?.automatedVerification ?? scope.automatedVerification, topic?.manualVerification ?? scope.manualVerification, topic?.applicationVerification ?? scope.applicationVerification,
  ].map(csv).join(',')))
  writeFileSync(`${output}/matriz.csv`, [header.join(','), ...lines].join('\n') + '\n')
  return result
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = writeSecondaryInventory(process.argv[2])
  console.log(JSON.stringify({ scopes: result.scopes.length, cycleScopes: result.cycleScopes.length, topicCandidates: result.scopes.reduce((sum, scope) => sum + scope.topics.length, 0), source: result.source.sha256 }))
}
