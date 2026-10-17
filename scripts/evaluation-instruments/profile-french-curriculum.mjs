import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createRequire } from 'node:module'
import { performance } from 'node:perf_hooks'
import { developmentEnvironment, developmentProjectRef } from '../cloudflare-development-environment.mjs'
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const baseline = JSON.parse(readFileSync('.wrangler/french-source/presentation-before.json', 'utf8'))
assert.equal(baseline.project, developmentProjectRef)
const { curriculumVersionId: versionId, curriculumScopeId: scopeId } = baseline.instruments[0]
assert(versionId && scopeId)
const measured = []
const canonical = rows => rows.map(row => ({ ...row, sourceSpans: row.sourceSpans.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) }))
try {
  for (let pass = 0; pass < 2; pass++) {
    let start = performance.now()
    const relation = await prisma.curriculumElement.findMany({ where: { scopeId, versionId }, select: { id: true, versionId: true, scopeId: true, elementType: true, originalText: true, normalizedText: true, sourceSpans: { select: { documentId: true, pdfPage: true, printedPage: true } } }, orderBy: { id: 'asc' } })
    const relationMs = Math.round(performance.now() - start)
    start = performance.now()
    const joined = await prisma.$queryRaw`
      SELECT e.id, e.version_id AS "versionId", e.scope_id AS "scopeId", e.element_type AS "elementType",
        e.original_text AS "originalText", e.normalized_text AS "normalizedText",
        COALESCE(jsonb_agg(jsonb_build_object('documentId', s.document_id, 'pdfPage', s.pdf_page, 'printedPage', s.printed_page)
          ORDER BY s.document_id, s.pdf_page) FILTER (WHERE s.id IS NOT NULL), '[]'::jsonb) AS "sourceSpans"
      FROM public.curriculum_elements e
      LEFT JOIN public.curriculum_source_spans s ON s.element_id = e.id AND s.version_id = e.version_id
      WHERE e.scope_id = ${scopeId}::uuid AND e.version_id = ${versionId}::uuid
      GROUP BY e.id ORDER BY e.id`
    const joinedMs = Math.round(performance.now() - start)
    assert.deepEqual(canonical(joined), canonical(relation), 'Joined query lost elements or source evidence')
    measured.push({ pass, relationMs, joinedMs, elements: relation.length, exact: true })
  }
  const report = { project: developmentProjectRef, measured, conditions: 'Same process and authorized Development role, sequential A/B; durations include pool, network, DB and decoding, not pure SQL.' }
  writeFileSync('.wrangler/french-source/presentation-curriculum-profile.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report))
} finally { await prisma.$disconnect() }
