import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { existsSync, writeFileSync } from 'node:fs'
const require = createRequire(import.meta.url)
const { evaluationCatalogCurrent: current, evaluationCatalogForVersion } = require('../../apps/backend/dist/modules/evaluation-instruments/catalog-current.js')
const version = Number(process.argv[2])
assert.equal(current.version, `evaluation-2026.${version}`, 'Build the release to freeze before advancing its version')
const previous = evaluationCatalogForVersion(`evaluation-2026.${version - 1}`)
assert(previous)
const delta = Object.fromEntries(Object.entries(current).filter(([key, value]) => JSON.stringify(value) !== JSON.stringify(previous[key])))
const file = `apps/backend/src/modules/evaluation-instruments/catalog-v${version}.ts`
assert(!existsSync(file), 'Never overwrite an existing frozen release')
writeFileSync(file, `import { evaluationCatalogV${version - 1} } from './catalog-v${version - 1}'\n/** Frozen payload; do not reference mutable providers in historical releases. */\nconst frozen = ${JSON.stringify(delta, null, 2)}\nexport const evaluationCatalogV${version} = { ...evaluationCatalogV${version - 1}, ...frozen }\n`)
console.log(JSON.stringify({ frozen: current.version, changedKeys: Object.keys(delta) }))
