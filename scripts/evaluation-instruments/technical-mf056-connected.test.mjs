import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/',read=n=>{assert(existsSync(root+n),'Falta evidencia '+n);return JSON.parse(readFileSync(root+n,'utf8'))}
test('MF056 registra la instalación idempotente solo en Development y preserva la historia previa',()=>{
 const p=read('technical-mf056-4-instalacion.json')
 assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.catalog,'evaluation-2026.145')
 assert.equal(p.source.first,'CREATED');assert.equal(p.source.second,'UNCHANGED');assert.equal(p.source.elements,72);assert.equal(p.source.spans,73)
 assert.equal(p.catalogInstallation.first,'CREATED');assert.equal(p.catalogInstallation.second,'UNCHANGED')
 assert.equal(p.catalogInstallation.preservedReleases,77);assert.equal(p.catalogInstallation.preservedSnapshots,1087)
 assert.equal(p.catalogInstallation.previousPayloadsUnchanged,true);assert.equal(p.catalogInstallation.finalReleases,78)
 assert.equal(p.contexts.executions,4);assert.equal(p.contexts.newAccounts,0);assert.equal(p.contexts.newStudents,0);assert.equal(p.deploy,false)
})
test('la prueba personal guardada conserva exactamente instrumento, snapshot y puntuación tras estrategia sola',()=>{
 const p=read('technical-mf056-4-navegador-personal.json')
 assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.status,'PERSONAL_RUBRIC_SAVED_REOPENED_STRATEGY_ONLY_EXACT')
 assert.equal(p.dom.fieldsCompared,13);assert.equal(p.dom.allFieldValuesExact,true)
 assert.equal(p.database.strategyOnlyInstrumentExactlyUnchanged,true);assert.equal(p.database.catalog,'evaluation-2026.145')
 assert.equal(p.database.strategy,'PROBLEM_BASED');assert.equal(p.database.origin,'MANUAL');assert.equal(Number(p.database.score),17.35)
 assert.equal(p.formatsVisuallyVerified.length,4);assert.equal(p.initialPointsEmpty,true);assert.equal(p.previousBaselinesVerified,14)
 assert.equal(p.screenshotCommitted,false);assert.equal(p.cacheStorageCleared,false)
})
