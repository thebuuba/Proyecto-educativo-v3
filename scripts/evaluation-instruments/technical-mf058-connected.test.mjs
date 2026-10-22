import test from 'node:test'
import assert from 'node:assert/strict'
import {existsSync,readFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/',read=n=>{assert(existsSync(root+n),'Falta evidencia MF058');return JSON.parse(readFileSync(root+n,'utf8'))}
test('MF058 instala fuente y catálogo idempotentes conservando historia, datos y cuentas',()=>{
 const p=read('technical-mf058-5-instalacion.json');assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.catalog,'evaluation-2026.149');assert.equal(p.source.first,'CREATED');assert.equal(p.source.second,'UNCHANGED');assert.equal(p.source.elements,34);assert.equal(p.source.spans,36);assert.equal(p.source.literalRecords,42);assert.equal(p.source.literalParts,45)
 assert.equal(p.catalogInstallation.first,'CREATED');assert.equal(p.catalogInstallation.second,'UNCHANGED');assert.equal(p.catalogInstallation.preservedReleases,81);assert.equal(p.catalogInstallation.preservedSnapshots,1169);assert.equal(p.catalogInstallation.finalReleases,82);assert.equal(p.catalogInstallation.finalSnapshots,1169);assert.equal(p.catalogInstallation.previousPayloadsUnchanged,true)
 assert.equal(p.contexts.executions,4);assert.equal(p.contexts.newAccounts,0);assert.equal(p.contexts.newStudents,0);assert.equal(p.priorPersonalBaselines.count,15);assert.equal(p.priorPersonalBaselines.newBaselines,0);assert.equal(p.deploy,false)
})
test('el navegador personal MF058 conserva el bloqueo de acceso y no acredita QA como sesión propia',()=>{
 const p=read('technical-mf058-5-navegador-personal.json');assert.equal(p.accountKind,'PERSONAL_DEVELOPMENT');assert.equal(p.status,'AUTHENTICATION_REQUIRED_CREATOR_NOT_VERIFIED');assert.equal(p.browserAvailable,true);assert.equal(p.creatorVerified,false);assert.equal(p.savedAndReopened,false);assert.equal(p.browserEntry,'/assets/index-DWcd921Q.js');assert.equal(p.newPassword,false);assert.equal(p.emailSent,false);assert.equal(p.storageCleared,false);assert.equal(p.newBaselines,0)
})
test('MF058 completa dieciséis muestras HTTP y conserva exactamente instrumentos e historia',()=>{
 const p=read('technical-mf058-5-verificacion-http.json');assert.equal(p.status,'REPRESENTATIVE_QA_COMPLETE_PERSONAL_AUTHENTICATION_PENDING');assert.equal(p.planned,16);assert.equal(p.verified,16);assert.equal(p.responses,99);assert.equal(p.http500,0);assert.equal(p.http429,0)
 assert.equal(p.coverage.availableContracts,72);assert.equal(p.coverage.selectedCaseIds.length,16);assert.equal(p.verifiedSamples.length,16);assert(p.verifiedSamples.every(s=>s.strategyOnlyInstrumentUnchanged&&s.manualTextPreserved))
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'])assert.equal(p.verifiedSamples.filter(s=>s.format===format).length,4)
 assert.equal(p.preservation.exactActivities,16);assert.equal(p.preservation.preservedReleases,81);assert.equal(p.preservation.preservedSnapshots,1169);assert.equal(p.preservation.currentReleases,82);assert.equal(p.preservation.currentSnapshots,1185);assert.equal(p.preservation.duplicates,0)
 assert.equal(p.priorPersonalBaselines.count,15);assert.equal(p.priorPersonalBaselines.exact,true);assert.equal(p.priorPersonalBaselines.newBaselines,0);assert.equal(p.personalCreatorVerified,false)
})
