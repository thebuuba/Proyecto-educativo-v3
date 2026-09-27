import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { coverageManifest } from './validate.mjs'

const directory = resolve(process.argv[2] || 'data/curriculum')
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex')
const files = Object.fromEntries(
  readdirSync(new URL('.', import.meta.url))
    .filter((f) => f.endsWith('.mjs'))
    .sort()
    .map((f) => [f, sha(readFileSync(new URL(f, import.meta.url)))]),
)
for (const prefix of ['primary-2023', 'secondary-2023']) {
  const read = (suffix) => JSON.parse(readFileSync(`${directory}/${prefix}.${suffix}`, 'utf8'))
  const run = read('run.json'),
    stored = read('coverage.json')
  assert.deepEqual(run.extractorFiles, files, 'El código difiere del extractor registrado')
  assert.equal(run.extractorSha256, sha(JSON.stringify(files)))
  for (const [name, digest] of Object.entries(run.artifacts))
    assert.equal(sha(readFileSync(`${directory}/${name}`)), digest, name)
  const rows = readFileSync(`${directory}/${prefix}.jsonl`, 'utf8')
    .trim()
    .split('\n')
    .map(JSON.parse)
  const get = (kind) => rows.filter((row) => row.kind === kind).map(({ kind, ...row }) => row)
  const result = coverageManifest({
    version: get('version')[0],
    document: get('document')[0],
    scopes: get('scope'),
    elements: get('element'),
    relations: get('relation'),
    pending: read('pending.json'),
    mallaPages: read('pages.json')
      .filter((p) => p.mallaDetected)
      .map((p) => p.pdfPage),
  })
  assert.deepEqual(
    JSON.parse(JSON.stringify(result)),
    stored,
    'Manifiesto no reproducible desde los artefactos',
  )
  assert.deepEqual(result.criticalErrors, [])
  assert.deepEqual(result.pendingReview, [])
  assert.equal(result.expectedScopesMissing, 0)
  assert.equal(read('samples.json').length, result.expectedScopes)
  console.log(
    `${prefix}: hashes, código, cobertura, procedencia y muestras OK; ${result.expectedScopes}/${result.expectedScopes} ámbitos`,
  )
}
