import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/',read=n=>{assert(existsSync(root+n),'Falta evidencia de conexión MF057');return JSON.parse(readFileSync(root+n,'utf8'))}
test('MF057 registra fuente y catálogo individuales idempotentes en Development con historia exacta',()=>{
 const p=read('technical-mf057-5-instalacion.json');assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.catalog,'evaluation-2026.147');assert.equal(p.source.first,'CREATED');assert.equal(p.source.second,'UNCHANGED');assert.equal(p.source.elements,101);assert.equal(p.source.spans,109);assert.equal(p.source.literalRecords,114);assert.equal(p.source.literalParts,123)
 assert.equal(p.catalogInstallation.first,'CREATED');assert.equal(p.catalogInstallation.second,'UNCHANGED');assert.equal(p.catalogInstallation.preservedReleases,79);assert.equal(p.catalogInstallation.preservedSnapshots,1137);assert.equal(p.catalogInstallation.finalReleases,80);assert.equal(p.catalogInstallation.finalSnapshots,1137);assert.equal(p.catalogInstallation.previousPayloadsUnchanged,true)
 assert.equal(p.contexts.executions,4);assert.equal(p.contexts.newAccounts,0);assert.equal(p.contexts.newStudents,0);assert.equal(p.deploy,false)
})
test('el navegador personal MF057 bloqueado por autenticación no se sustituye por QA',()=>{
 const p=read('technical-mf057-5-navegador-personal.json');assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.accountKind,'PERSONAL_DEVELOPMENT');assert.equal(p.status,'AUTHENTICATION_REQUIRED_CREATOR_NOT_VERIFIED');assert.equal(p.browserAvailable,true);assert.equal(p.creatorVerified,false);assert.equal(p.savedAndReopened,false);assert.equal(p.browserEntry,'/assets/index-TeCjzgjh.js')
 assert.equal(p.newPassword,false);assert.equal(p.emailSent,false);assert.equal(p.storageCleared,false);assert.equal(p.newBaselines,0)
})
test('MF057 completa dieciséis muestras HTTP y preserva historia sin acreditar navegador personal',()=>{
 const p=read('technical-mf057-5-verificacion-http.json')
 assert.equal(p.status,'REPRESENTATIVE_QA_COMPLETE_PERSONAL_AUTHENTICATION_PENDING');assert.equal(p.planned,16);assert.equal(p.verified,16);assert.equal(p.responses,99);assert.equal(p.http500,0);assert.equal(p.http429,0)
 assert.equal(p.coverage.availableContracts,136);assert.equal(p.coverage.selectedCaseIds.length,16);assert.equal(p.verifiedSamples.length,16)
 assert(p.verifiedSamples.every(s=>s.strategyOnlyInstrumentUnchanged&&s.manualTextPreserved))
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'])assert.equal(p.verifiedSamples.filter(s=>s.format===format).length,4)
 assert.equal(p.preservation.exactActivities,16);assert.equal(p.preservation.preservedReleases,79);assert.equal(p.preservation.preservedSnapshots,1137);assert.equal(p.preservation.currentReleases,80);assert.equal(p.preservation.currentSnapshots,1153);assert.equal(p.preservation.duplicates,0)
 assert.equal(p.priorPersonalBaselines.count,15);assert.equal(p.priorPersonalBaselines.exact,true);assert.equal(p.priorPersonalBaselines.newBaselines,0);assert.equal(p.personalCreatorVerified,false)
})
