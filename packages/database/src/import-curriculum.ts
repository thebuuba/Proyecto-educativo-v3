import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { prisma } from './index.js'

type Version = { kind: 'version'; id: string; code: string; level: string; editionYear: number }
type Document = {
  kind: 'document'
  id: string
  versionId: string
  title: string
  originalFilename: string
  sha256: string
  pageCount: number
  issuingBody: string
}
type Scope = {
  kind: 'scope'
  id: string
  versionId: string
  stableKey: string
  cycle: number | null
  grade: number | null
  areaName: string | null
  subjectName: string | null
  modalityName: string | null
  optativeExitName: string | null
  assignmentSourcePdfPage: number | null
}
type Element = {
  kind: 'element'
  id: string
  versionId: string
  scopeKey: string
  stableKey: string
  type: string
  originalText: string
  normalizedText: string
  reviewStatus: string
  sourceOrder: number
  source: {
    pdfPage: number
    printedPage: string | null
    sectionName: string | null
    boundingBox: object | null
  }
}
type Relation = { kind: 'relation'; versionId: string; fromId: string; toId: string; type: string }
type Record = Version | Document | Scope | Element | Relation

function batch<T>(items: T[], size = 500): T[][] {
  const groups: T[][] = []
  for (let index = 0; index < items.length; index += size)
    groups.push(items.slice(index, index + size))
  return groups
}

async function main() {
  const [datasetPath, coveragePath] = process.argv.slice(2)
  if (!datasetPath || !coveragePath)
    throw new Error(
      'Uso: pnpm --filter @aula/database curriculum:import <dataset.jsonl> <coverage.json>',
    )
  const raw = readFileSync(datasetPath, 'utf8')
  const digest = createHash('sha256').update(raw).digest('hex')
  const rows = raw
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as Record)
  const coverage = JSON.parse(readFileSync(coveragePath, 'utf8')) as {
    version: string
    document: { sha256: string }
    criticalErrors: string[]
    pendingReview: unknown[]
  }
  const version = rows.find((row): row is Version => row.kind === 'version')
  const document = rows.find((row): row is Document => row.kind === 'document')
  if (
    !version ||
    !document ||
    version.code !== coverage.version ||
    document.sha256 !== coverage.document.sha256
  ) {
    throw new Error('Dataset y manifiesto de cobertura no corresponden a la misma fuente')
  }
  const status =
    coverage.criticalErrors.length || coverage.pendingReview.length ? 'VALIDATION_FAILED' : 'DRAFT'
  const existing = await prisma.curriculumVersion.findUnique({
    where: { code: version.code },
    include: { documents: true },
  })
  if (existing) {
    const metadata = existing.importMetadata as { datasetDigest?: string } | null
    if (existing.documents[0]?.sha256 !== document.sha256 || metadata?.datasetDigest !== digest) {
      throw new Error(
        'La versión ya existe con otro PDF o dataset; crear una nueva versión en lugar de sobrescribirla',
      )
    }
    console.log(`${version.code}: ya importado, sin cambios`)
    return
  }
  const scopes = rows.filter((row): row is Scope => row.kind === 'scope')
  const elements = rows.filter((row): row is Element => row.kind === 'element')
  const relations = rows.filter((row): row is Relation => row.kind === 'relation')
  const scopeIds = new Map(scopes.map((scope) => [scope.stableKey, scope.id]))
  if (scopeIds.size !== scopes.length) throw new Error('Scopes duplicados')
  if (new Set(elements.map((element) => element.id)).size !== elements.length)
    throw new Error('IDs de elementos duplicados')
  if (elements.some((element) => !scopeIds.has(element.scopeKey)))
    throw new Error('Elemento sin scope')
  const elementIds = new Set(elements.map((element) => element.id))
  if (
    relations.some((relation) => !elementIds.has(relation.fromId) || !elementIds.has(relation.toId))
  )
    throw new Error('Relación huérfana')

  await prisma.$transaction(
    async (tx) => {
      await tx.curriculumVersion.create({
        data: {
          id: version.id,
          code: version.code,
          level: version.level,
          editionYear: version.editionYear,
          status,
          importMetadata: {
            datasetDigest: digest,
            criticalErrors: coverage.criticalErrors.length,
            pendingReview: coverage.pendingReview.length,
          },
        },
      })
      await tx.curriculumDocument.create({
        data: {
          id: document.id,
          versionId: version.id,
          title: document.title,
          originalFilename: document.originalFilename,
          sha256: document.sha256,
          pageCount: document.pageCount,
          issuingBody: document.issuingBody,
        },
      })
      for (const group of batch(scopes))
        await tx.curriculumScope.createMany({
          data: group.map((scope) => ({
            id: scope.id,
            versionId: version.id,
            stableKey: scope.stableKey,
            cycle: scope.cycle,
            grade: scope.grade,
            areaName: scope.areaName,
            areaSearch:
              scope.areaName?.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase() ?? null,
            subjectName: scope.subjectName,
            subjectSearch:
              scope.subjectName?.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase() ?? null,
            modalityName: scope.modalityName,
            optativeExitName: scope.optativeExitName,
            assignmentSourcePdfPage: scope.assignmentSourcePdfPage,
          })),
        })
      for (const group of batch(elements))
        await tx.curriculumElement.createMany({
          data: group.map((element) => ({
            id: element.id,
            versionId: version.id,
            scopeId: scopeIds.get(element.scopeKey)!,
            stableKey: element.stableKey,
            elementType: element.type,
            originalText: element.originalText,
            normalizedText: element.normalizedText,
            reviewStatus: element.reviewStatus,
            sourceOrder: element.sourceOrder,
          })),
        })
      for (const group of batch(relations))
        await tx.curriculumElementRelation.createMany({
          data: group.map((relation) => ({
            versionId: version.id,
            fromElementId: relation.fromId,
            toElementId: relation.toId,
            relationType: relation.type,
          })),
        })
      for (const group of batch(elements))
        await tx.curriculumSourceSpan.createMany({
          data: group.map((element) => ({
            versionId: version.id,
            elementId: element.id,
            documentId: document.id,
            pdfPage: element.source.pdfPage,
            printedPage: element.source.printedPage,
            sectionName: element.source.sectionName,
            boundingBox: element.source.boundingBox ?? undefined,
          })),
        })
    },
    { timeout: 120_000 },
  )
  console.log(
    `${version.code}: importación ${status}, ${scopes.length} ámbitos, ${elements.length} elementos`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
