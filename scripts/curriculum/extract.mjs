import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { stableUuid } from './layout.mjs'
import { readPage } from './pdf-page.mjs'
import { createPrimaryAdapter } from './primary.mjs'
import { createSecondaryAdapter } from './secondary.mjs'
import { coverageManifest } from './validate.mjs'
import { sourceAnomalies } from './source-anomalies.mjs'

const args = process.argv.slice(2)
const option = (name) => args[args.indexOf(name) + 1]
if (!args.includes('--primary') || !args.includes('--secondary') || !args.includes('--output')) {
  throw new Error(
    'Uso: node scripts/curriculum/extract.mjs --primary <PDF> --secondary <PDF> --output <directorio>',
  )
}
const outputDirectory = resolve(option('--output'))
mkdirSync(outputDirectory, { recursive: true })
const generatedAt = new Date().toISOString()
const extractorFiles = Object.fromEntries(
  readdirSync(new URL('.', import.meta.url))
    .filter((f) => f.endsWith('.mjs'))
    .sort()
    .map((f) => [
      f,
      createHash('sha256')
        .update(readFileSync(new URL(f, import.meta.url)))
        .digest('hex'),
    ]),
)
const extractorSha256 = createHash('sha256').update(JSON.stringify(extractorFiles)).digest('hex')

async function extract(path, level, code, adapterFactory) {
  const pdfBytes = readFileSync(resolve(path))
  const sha256 = createHash('sha256').update(pdfBytes).digest('hex')
  const document = await getDocument({ data: new Uint8Array(pdfBytes), useSystemFonts: true })
    .promise
  const version = {
    id: stableUuid('MINERD', code, sha256),
    code,
    level,
    editionYear: 2023,
    status: 'DRAFT',
  }
  const source = {
    id: stableUuid(version.id, 'document', sha256),
    versionId: version.id,
    title: `Adecuación Curricular del Nivel ${level === 'PRIMARY' ? 'Primario' : 'Secundario'}`,
    originalFilename: basename(path),
    sha256,
    pageCount: document.numPages,
    issuingBody: 'MINERD',
  }
  const adapter = adapterFactory(code)
  const scopes = new Map()
  const elements = []
  const relations = []
  const pending = []
  const mallaPages = []
  const pageAudit = []
  for (let pdfPage = 1; pdfPage <= document.numPages; pdfPage++) {
    const page = await document.getPage(pdfPage)
    const items = await readPage(page)
    const result = adapter.extract(pdfPage, items)
    if (result.mallaDetected) mallaPages.push(pdfPage)
    for (const scope of result.scopes) {
      scopes.set(
        scope.level +
          '/' +
          scope.cycle +
          '/' +
          scope.grade +
          '/' +
          scope.areaName +
          '/' +
          scope.subjectName +
          '/' +
          scope.optativeExitName,
        {
          ...scope,
          stableKey: [
            scope.level,
            scope.cycle ?? 'ALL',
            scope.grade ?? 'ALL',
            (scope.areaName || 'ALL')
              .normalize('NFD')
              .replace(/\p{M}/gu, '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, ' ')
              .trim(),
            (scope.subjectName || 'ALL')
              .normalize('NFD')
              .replace(/\p{M}/gu, '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, ' ')
              .trim(),
            (scope.modalityName || 'ALL')
              .normalize('NFD')
              .replace(/\p{M}/gu, '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, ' ')
              .trim(),
            (scope.optativeExitName || 'ALL')
              .normalize('NFD')
              .replace(/\p{M}/gu, '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, ' ')
              .trim(),
          ].join('/'),
        },
      )
    }
    for (const element of result.elements) element.source.documentId = source.id
    elements.push(...result.elements)
    relations.push(...result.relations)
    pending.push(...result.pending)
    pageAudit.push({
      pdfPage,
      scope: result.context
        ? [
            result.context.cycle,
            result.context.grade,
            result.context.areaName,
            result.context.subjectName,
            result.context.optativeExitName,
          ]
        : null,
      mallaDetected: result.mallaDetected,
      elements: result.elements.length,
      textItems: items.length,
      tableRules: items.rules.length,
      headings: items
        .filter((item) => item.y > 600)
        .map((item) => item.text)
        .join(' ')
        .slice(0, 600),
    })
  }
  const dataset = {
    version,
    document: source,
    scopes: [...scopes.values()],
    elements,
    relations,
    pending,
    mallaPages,
  }
  const coverage = coverageManifest(dataset)
  const prefix = level === 'PRIMARY' ? 'primary-2023' : 'secondary-2023'
  const jsonl = [
    { kind: 'version', ...version },
    { kind: 'document', ...source },
    ...dataset.scopes.map((record) => ({
      kind: 'scope',
      id: stableUuid(version.id, 'scope', record.stableKey),
      versionId: version.id,
      ...record,
    })),
    ...elements.map((record) => ({ kind: 'element', versionId: version.id, ...record })),
    ...relations.map((record) => ({ kind: 'relation', versionId: version.id, ...record })),
  ]
  writeFileSync(
    join(outputDirectory, `${prefix}.jsonl`),
    `${jsonl.map((record) => JSON.stringify(record)).join('\n')}\n`,
  )
  writeFileSync(
    join(outputDirectory, `${prefix}.coverage.json`),
    `${JSON.stringify(coverage, null, 2)}\n`,
  )
  writeFileSync(
    join(outputDirectory, `${prefix}.pending.json`),
    `${JSON.stringify(pending, null, 2)}\n`,
  )
  writeFileSync(
    join(outputDirectory, `${prefix}.pages.json`),
    `${JSON.stringify(pageAudit, null, 2)}\n`,
  )
  const samples = dataset.scopes
    .filter((scope) => scope.grade !== null)
    .map((scope) => {
      const sourceElements = elements.filter((element) => element.scopeKey === scope.stableKey)
      const examples = [...new Set(sourceElements.map((element) => element.type))].map((type) => {
        const element = sourceElements.find((candidate) => candidate.type === type)
        return (
          element && {
            id: element.id,
            type,
            originalText: element.originalText,
            normalizedText: element.normalizedText,
            source: element.source,
            relations: relations.filter(
              (relation) => relation.fromId === element.id || relation.toId === element.id,
            ),
          }
        )
      })
      return { grade: scope.grade, scope, examples }
    })
  writeFileSync(
    join(outputDirectory, `${prefix}.samples.json`),
    `${JSON.stringify(samples, null, 2)}\n`,
  )
  writeFileSync(
    join(outputDirectory, `${prefix}.matrix.csv`),
    [
      'level,cycle,grade,area,subject,modality,optative_exit,specific_competencies,criteria,concepts,procedures,indicators,attitudes,status',
      ...coverage.matrix.map((row) =>
        [
          row.level,
          row.cycle,
          row.grade,
          row.area,
          row.subject,
          row.modality || '',
          row.optativeExit || '',
          row.specificCompetencies,
          row.criteria,
          row.concepts,
          row.procedures,
          row.indicators,
          row.attitudes,
          row.status,
        ]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      ),
    ].join('\n') + '\n',
  )
  const artifacts = Object.fromEntries(
    ['jsonl', 'coverage.json', 'matrix.csv', 'pending.json', 'samples.json', 'pages.json'].map(
      (ext) => [
        `${prefix}.${ext}`,
        createHash('sha256')
          .update(readFileSync(join(outputDirectory, `${prefix}.${ext}`)))
          .digest('hex'),
      ],
    ),
  )
  writeFileSync(
    join(outputDirectory, `${prefix}.run.json`),
    JSON.stringify(
      {
        generatedAt,
        extractorSha256,
        extractorFiles,
        node: process.version,
        document: source,
        sourceAnomalies: sourceAnomalies.filter((a) => a.level === level),
        artifacts,
      },
      null,
      2,
    ) + '\n',
  )
  console.log(
    `${code}: ${document.numPages} páginas, ${elements.length} elementos, ${relations.length} relaciones, ${coverage.criticalErrors.length} errores, ${pending.length} pendientes`,
  )
  return coverage
}

await extract(option('--primary'), 'PRIMARY', 'MINERD_PRIMARIA_2023', createPrimaryAdapter)
await extract(option('--secondary'), 'SECONDARY', 'MINERD_SECUNDARIA_2023', createSecondaryAdapter)
