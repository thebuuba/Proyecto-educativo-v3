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
test('la corrección de búsqueda técnica registra mediciones reales sin dar por terminadas las92muestras',()=>{
 const p=read('technical-mf056-4-busqueda-versiones.json')
 assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.catalog,'evaluation-2026.145')
 assert.equal(p.regressionTests.red,5);assert.equal(p.regressionTests.green,5)
 assert.equal(p.backendTests.passed,92536);assert.equal(p.backendTests.failed,0)
 assert.equal(p.afterNode.broadVersionQueries,0);assert.equal(p.afterNode.interpretMs.length,3)
 assert.equal(p.postBuildHttp.interpretMs.length,3);assert.equal(p.postBuildHttp.everyResponse200,true)
 assert.equal(p.postBuildHttp.clientTimeoutMs,30000);assert.equal(p.postBuildHttp.activityWrites,0)
 assert.equal(p.preservation.compiled145Exact,true);assert.equal(p.preservation.frozen144Exact,true)
 assert.equal(p.preservation.personalBaselinesExact,15);assert.equal(p.preservation.newBaselines,0)
 assert.equal(p.gates.length,5);assert(p.gates.every(g=>g.exit===0))
 assert.equal(p.runtime.postgresRole,'app_backend_local');assert.equal(p.runtime.bypassRls,false)
 assert.equal(p.runtime.authProject,p.project);assert.equal(p.runtime.storageProject,p.project);assert.equal(p.runtime.frontendProject,p.project)
 assert.equal(p.coverage92Complete,false);assert.equal(p.deploy,false);assert.equal(p.push,false)
})
