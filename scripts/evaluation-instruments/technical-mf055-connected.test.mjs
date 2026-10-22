import test from 'node:test'
import assert from 'node:assert/strict'
import {existsSync,readFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/',read=n=>{assert(existsSync(root+n),'Falta evidencia de conexión MF055');return JSON.parse(readFileSync(root+n,'utf8'))}
test('MF055 instala una fuente y un catálogo idempotentes sin alterar historia ni cuentas',()=>{
 const p=read('technical-mf055-6-instalacion.json');assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.catalog,'evaluation-2026.148');assert.equal(p.source.first,'CREATED');assert.equal(p.source.second,'UNCHANGED');assert.equal(p.source.elements,37);assert.equal(p.source.spans,37);assert.equal(p.source.literalRecords,45);assert.equal(p.source.literalParts,45)
 assert.equal(p.catalogInstallation.first,'CREATED');assert.equal(p.catalogInstallation.second,'UNCHANGED');assert.equal(p.catalogInstallation.preservedReleases,80);assert.equal(p.catalogInstallation.preservedSnapshots,1153);assert.equal(p.catalogInstallation.finalReleases,81);assert.equal(p.catalogInstallation.finalSnapshots,1153);assert.equal(p.catalogInstallation.previousPayloadsUnchanged,true)
 assert.equal(p.contexts.executions,4);assert.equal(p.contexts.newAccounts,0);assert.equal(p.contexts.newStudents,0);assert.equal(p.priorPersonalBaselines.count,15);assert.equal(p.priorPersonalBaselines.newBaselines,0);assert.equal(p.accessRecovery.originalFailureCode,'P1001');assert.equal(p.accessRecovery.firstFailureBeforeWrites,true);assert.equal(p.accessRecovery.readOnlyPreservationVerified,true);assert.equal(p.deploy,false)
})
test('el navegador personal MF055 en login no se sustituye por el recorrido QA',()=>{
 const p=read('technical-mf055-6-navegador-personal.json');assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.accountKind,'PERSONAL_DEVELOPMENT');assert.equal(p.status,'AUTHENTICATION_REQUIRED_CREATOR_NOT_VERIFIED');assert.equal(p.browserAvailable,true);assert.equal(p.creatorVerified,false);assert.equal(p.savedAndReopened,false);assert.equal(p.browserEntry,'/assets/index-CMio6WV1.js');assert.equal(p.newPassword,false);assert.equal(p.emailSent,false);assert.equal(p.storageCleared,false);assert.equal(p.newBaselines,0)
})
