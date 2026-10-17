import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
const grade = Number(process.argv[2])
const directory = '.wrangler/french-source'
const read = file => JSON.parse(readFileSync(`${directory}/${file}`, 'utf8'))
const http = read(`grade-${grade}-http.json`), catalog = read(`grade-${grade}-catalog.json`), runtime = read('runtime.json')
assert.equal(http.project, 'eolgunypmtgrsyrjzcld'); assert.equal(catalog.project, http.project); assert.equal(runtime.project, http.project)
assert.equal(http.savedEvidence.length, 4); assert(http.savedEvidence.every(item => item.strategyOnlyExact && item.manualTextAndWeightsPreserved))
assert.equal(catalog.second, 'UNCHANGED'); assert.equal(runtime.frontend.matchesBuild, true)
const logText = file => { const bytes = readFileSync(`${directory}/${file}`); return bytes.toString(bytes[0] === 255 && bytes[1] === 254 ? 'utf16le' : 'utf8').replace(/\x1b\[[0-9;]*m/g, '') }
const testResult = file => { const log = logText(file), match = log.match(/Tests\s+(\d+) passed \((\d+)\)/); assert(match && match[1] === match[2], `${file}: tests did not all pass`); return Number(match[1]) }
const tests = { backendAll: testResult(`grade-${grade}-backend-all.log`), backendFrench: testResult(`grade-${grade}-backend.log`), frontendFrench: testResult(`grade-${grade}-frontend.log`) }
for (const type of ['backend', 'frontend', 'cloudflare']) {
  const log = logText(`grade-${grade}-${type}-build.log`)
  assert(!/error TS\d|ERR_PNPM|Build failed/.test(log), `${type}: build failed`)
  if (type === 'cloudflare') assert(log.includes('--dry-run: exiting now.'))
}
const evidence = { recordedAt: new Date().toISOString(), catalog, runtime, tests, http, builds: ['pnpm --filter backend build', 'pnpm --filter frontend build', 'pnpm cloudflare:build (dry-run)'], browser: { status: 'PENDING', reason: 'Reintentado el 15/10/2026: controlador nativo sin pipe disponible (os error 2); navegador aislado IAB no disponible. Chrome conectado solo anuncia viewport, sin sesión QA aislada. No se cambió la sesión personal ni se borraron borradores.', personalTabObservation: 'Observación anterior del DOM el 15/10/2026: script /assets/index-yWh82mQY.js. No es una medición actual de esa pestaña. Guardar ediciones pendientes y recargar antes de probar; registro/caché del service worker no inspeccionados.' } }
const output = `docs/curriculum/cobertura-secundaria/frances-${grade}-verificacion.json`
writeFileSync(output, JSON.stringify(evidence, null, 2) + '\n')
const matrixFile = 'docs/curriculum/cobertura-secundaria/frances-matriz.json'
const matrix = JSON.parse(readFileSync(matrixFile, 'utf8'))
if (existsSync(`${directory}/source-catalog.json`)) {
  const source = read('source-catalog.json')
  assert.equal(source.project, http.project)
  assert(http.savedEvidence.every(row => row.curriculum?.versionId === source.versionId && row.curriculum?.scopeId === source.metadata.scopeMap[grade].id), 'New QA snapshots must bind the reviewed source')
  matrix.runtimeCurriculumCatalog = { status: 'INSTALLED_FRENCH_COMMON_ONLY', project: source.project, versionId: source.versionId, code: source.code, evidence: 'frances-fuente-development.md' }
} else matrix.runtimeCurriculumCatalog = { status: 'NOT_INSTALLED_IN_DEVELOPMENT', checked: '2026-10-15', detail: 'Fuente oficial revisada localmente; referencias curriculares DB nulas.' }
matrix.grades.find(item => item.grade === grade).coverage = { inventory: 'VISUALLY_REVIEWED', implementation: 'CONNECTED_DEFINED_PATTERNS', providers: [`frances-comunicacion-${grade}`], catalog: catalog.catalog, automated: `PASSED: ${tests.backendFrench} backend French / ${tests.frontendFrench} frontend French, including previous grades`, httpDatabase: `PASSED: ${http.interpreted} interpretations, ${http.generated} matrix recommendations, ${http.persistenceRecommendations ?? 4} persistence recommendations, 4 formats saved/edited/reopened; final recheck ${http.finalBuildRecheck?.generated ?? 'PENDING'}`, browser: 'PENDING_ISOLATED_QA_BROWSER_UNAVAILABLE', evidence: [`frances-${grade}.md`, `frances-${grade}-ejemplos.md`, `frances-${grade}-verificacion.json`], pending: ['Recorrido visual QA en sesión separada; patrones lingüísticos acotados, sin comprensión universal.'] }
for (const item of matrix.grades.filter(row => row.coverage.implementation === 'CONNECTED_DEFINED_PATTERNS')) {
  item.pedagogicalInventory.adaptation = `Patrones acotados conectados; consultar frances-${item.grade}.md y sus límites de verificación.`
}
writeFileSync(matrixFile, JSON.stringify(matrix, null, 2) + '\n')
console.log(JSON.stringify({ evidence: output, tests }))
