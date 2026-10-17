import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { parseEnv } from 'node:util'
import { developmentEnvironment, developmentProjectRef as project } from '../cloudflare-development-environment.mjs'

// A French-only source release, with distinct IDs; never imports the full curriculum.
const code = 'MINERD_SECUNDARIA_2023_FRA_COMUN_V1'
const digest = value => createHash('sha256').update(value).digest('hex')
const id = (kind, original) => {
  const bytes = createHash('sha1').update(Buffer.from('6ba7b8119dad11d180b400c04fd430c8', 'hex')).update(`${code}/${kind}/${original}`).digest().subarray(0, 16)
  bytes[6] = (bytes[6] & 15) | 80; bytes[8] = (bytes[8] & 63) | 128
  const hex = bytes.toString('hex'); return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
}
const matrix = JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/frances-matriz.json', 'utf8'))
const rows = readFileSync('data/curriculum/secondary-2023.jsonl', 'utf8').trim().split('\n').map(JSON.parse)
const source = rows.find(row => row.kind === 'document')
assert.equal(digest(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')), source.sha256)
assert.equal(source.sha256, matrix.source.sha256)
assert.deepEqual(matrix.grades.map(row => row.grade), [1,2,3,4,5,6])
const scopeIds = new Set(matrix.grades.map(row => row.scopeId))
const scopes = rows.filter(row => row.kind === 'scope' && scopeIds.has(row.id))
const keys = new Set(scopes.map(row => row.stableKey))
const elements = rows.filter(row => row.kind === 'element' && keys.has(row.scopeKey))
const elementIds = new Set(elements.map(row => row.id))
const relations = rows.filter(row => row.kind === 'relation' && elementIds.has(row.fromId) && elementIds.has(row.toId))
assert.equal(scopes.length, 6); assert.equal(elements.length, 813)
for (const scope of scopes) {
  assert.equal(scope.subjectName, 'Francés'); assert.equal(scope.optativeExitName, null)
  const reviewed = matrix.grades.find(row => row.scopeId === scope.id)
  assert.equal(reviewed.visualReview.status, 'REVIEWED')
  const actual = elements.filter(row => row.scopeKey === scope.stableKey)
  assert.equal(actual.length, reviewed.officialRecords.length)
  for (const row of actual) {
    const original = reviewed.officialRecords.find(item => item.id === row.id)
    assert(original); assert.equal(row.originalText, original.text); assert.equal(row.source.pdfPage, original.pdfPage)
    assert(reviewed.pdfPages.includes(row.source.pdfPage))
  }
}
const versionId = id('version', source.versionId), documentId = id('document', source.id)
const scopeMap = Object.fromEntries(scopes.map(scope => [scope.grade, { sourceId: scope.id, id: id('scope', scope.id) }]))
const scopeByKey = new Map(scopes.map(scope => [scope.stableKey, id('scope', scope.id)]))
const metadata = { subjectCodes: ['FRA'], commonOnly: true, datasetDigest: digest(JSON.stringify({ source, scopes, elements, relations })), sourceVersionId: source.versionId, sourcePdfHash: source.sha256, scopeMap, review: 'docs/curriculum/cobertura-secundaria/frances-matriz.json' }
const manifest = { project, code, versionId, documentId, metadata, scopes: scopes.length, elements: elements.length, relations: relations.length }
if (!process.argv.includes('--install')) { console.log(JSON.stringify(manifest, null, 2)); process.exit(0) }
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const batch = items => Array.from({ length: Math.ceil(items.length / 250) }, (_, i) => items.slice(i * 250, (i + 1) * 250))
const normalize = value => value?.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase() ?? null
try {
  const fingerprints = () => prisma.$queryRawUnsafe('select id, md5(payload::text) as hash from evaluation_instrument_snapshots order by id')
  const before = await fingerprints()
  const existing = await prisma.curriculumVersion.findUnique({ where: { code }, include: { documents: true } })
  let result = 'UNCHANGED'
  if (existing) {
    assert.equal(existing.id, versionId); assert.equal(existing.status, 'PUBLISHED')
    assert.deepEqual(existing.importMetadata, metadata); assert.equal(existing.documents[0]?.sha256, source.sha256)
    assert.equal(await prisma.curriculumScope.count({ where: { versionId } }), scopes.length)
    assert.equal(await prisma.curriculumElement.count({ where: { versionId } }), elements.length)
    assert.equal(await prisma.curriculumSourceSpan.count({ where: { versionId } }), elements.length)
    assert.equal(await prisma.curriculumElementRelation.count({ where: { versionId } }), relations.length)
  } else {
    await prisma.$transaction(async tx => {
      await tx.curriculumVersion.create({ data: { id: versionId, code, level: 'SECONDARY', editionYear: 2023, status: 'DRAFT', importMetadata: metadata } })
      const { kind, url, ...document } = source
      await tx.curriculumDocument.create({ data: { ...document, id: documentId, versionId } })
      await tx.curriculumScope.createMany({ data: scopes.map(scope => ({ id: id('scope', scope.id), versionId, stableKey: scope.stableKey, cycle: scope.cycle, grade: scope.grade, areaName: scope.areaName, subjectName: scope.subjectName, modalityName: scope.modalityName, optativeExitName: scope.optativeExitName, assignmentSourcePdfPage: scope.assignmentSourcePdfPage, areaSearch: normalize(scope.areaName), subjectSearch: normalize(scope.subjectName) })) })
      for (const group of batch(elements)) await tx.curriculumElement.createMany({ data: group.map(row => ({ id: id('element', row.id), versionId, scopeId: scopeByKey.get(row.scopeKey), stableKey: row.stableKey, elementType: row.type, originalText: row.originalText, normalizedText: row.normalizedText, reviewStatus: 'REVIEWED', sourceOrder: row.sourceOrder })) })
      for (const group of batch(relations)) await tx.curriculumElementRelation.createMany({ data: group.map(row => ({ versionId, fromElementId: id('element', row.fromId), toElementId: id('element', row.toId), relationType: row.type })) })
      for (const group of batch(elements)) await tx.curriculumSourceSpan.createMany({ data: group.map(row => ({ versionId, elementId: id('element', row.id), documentId, pdfPage: row.source.pdfPage, printedPage: row.source.printedPage, sectionName: row.source.sectionName, boundingBox: row.source.boundingBox ?? undefined })) })
      // The database makes published sources immutable; publish only after all children exist.
      await tx.curriculumVersion.update({ where: { id: versionId }, data: { status: 'VALIDATED', validatedAt: new Date() } })
      await tx.curriculumVersion.update({ where: { id: versionId }, data: { status: 'PUBLISHED', publishedAt: new Date() } })
    }, { timeout: 120000 })
    result = 'CREATED'
  }
  const stored = await prisma.curriculumElement.findMany({ where: { versionId }, select: { id: true, originalText: true, scopeId: true, sourceSpans: { select: { pdfPage: true, documentId: true } } } })
  for (const element of elements) {
    const actual = stored.find(row => row.id === id('element', element.id)); assert(actual)
    assert.equal(actual.originalText, element.originalText); assert.equal(actual.scopeId, scopeByKey.get(element.scopeKey))
    assert.deepEqual(actual.sourceSpans, [{ pdfPage: element.source.pdfPage, documentId }])
  }
  assert.deepEqual(await fingerprints(), before, 'Historical snapshots changed')
  writeFileSync('.wrangler/french-source/source-catalog.json', JSON.stringify({ ...manifest, result, preservedSnapshots: before.length }, null, 2) + '\n')
  console.log(JSON.stringify({ project, code, versionId, result, scopes: scopes.length, elements: elements.length, preservedSnapshots: before.length }))
} finally { await prisma.$disconnect() }
