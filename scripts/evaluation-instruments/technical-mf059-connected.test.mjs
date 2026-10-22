import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/',read=n=>{assert(existsSync(root+n),'Falta evidencia de conexiónMF059');return JSON.parse(readFileSync(root+n,'utf8'))}
test('MF059 registra instalación individual idempotente enDevelopment y conserva la historia',()=>{
 const p=read('technical-mf059-4-instalacion.json');assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.catalog,'evaluation-2026.146');assert.equal(p.source.first,'CREATED');assert.equal(p.source.second,'UNCHANGED');assert.equal(p.source.elements,37);assert.equal(p.source.spans,39);assert.equal(p.source.literalRecords,45);assert.equal(p.source.literalParts,47)
 assert.equal(p.catalogInstallation.first,'CREATED');assert.equal(p.catalogInstallation.second,'UNCHANGED');assert.equal(p.catalogInstallation.preservedReleases,78);assert.equal(p.catalogInstallation.preservedSnapshots,1103);assert.equal(p.catalogInstallation.finalReleases,79);assert.equal(p.catalogInstallation.previousPayloadsUnchanged,true)
 assert.equal(p.contexts.executions,4);assert.equal(p.contexts.newAccounts,0);assert.equal(p.contexts.newStudents,0);assert.equal(p.deploy,false)
})
test('el bloqueo personal de autenticación no se presenta como prueba del creador completada',()=>{
 const p=read('technical-mf059-4-navegador-personal.json');assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.accountKind,'PERSONAL_DEVELOPMENT');assert.equal(p.status,'AUTHENTICATION_REQUIRED_CREATOR_NOT_VERIFIED');assert.equal(p.browserAvailable,true);assert.equal(p.creatorVerified,false);assert.equal(p.savedAndReopened,false)
 assert.equal(p.browserEntry,'/assets/index-CbCMfNVx.js');assert.equal(p.newPassword,false);assert.equal(p.emailSent,false);assert.equal(p.storageCleared,false);assert.equal(p.previousPersonalBaselinesExact,15);assert.equal(p.newBaselines,0)
})
test('MF059 distingue33 recorridos completos de34 guardados y preserva la historia tras el timeout',()=>{
 const p=read('technical-mf059-4-verificacion-http.json')
 assert.equal(p.status,'PARTIAL_TRANSPORT_TIMEOUT_PERSONAL_AUTHENTICATION_PENDING')
 assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.catalog,'evaluation-2026.146');assert.equal(p.planned,100)
 assert.equal(p.verified,33);assert.equal(p.knownSavedAndInitiallyReopened,34);assert.equal(p.responses,206);assert.equal(p.http500,0);assert.equal(p.http429,0)
 assert.equal(p.executorStopped,true);assert.equal(p.timeout.clientLimitMs,30000);assert.equal(p.timeout.lateWorkerStatus,200);assert.equal(p.timeout.lateWorkerMs,30605)
 assert.equal(p.preservation.savedExact,34);assert.equal(p.preservation.previousReleasesExact,78);assert.equal(p.preservation.previousSnapshotsExact,1103);assert.equal(p.preservation.currentReleases,79);assert.equal(p.preservation.currentSnapshots,1137);assert.equal(p.preservation.duplicates,0)
 assert.equal(p.preservation.lastStrategySaved,true);assert.equal(p.preservation.lastHttpReopenPending,true);assert.equal(p.preservation.personalBaselinesExact,15);assert.equal(p.preservation.newBaselines,0)
 assert.equal(p.verifiedSamples.length,33);assert.equal(p.preservation.activities.length,34);assert(p.preservation.activities.every(a=>a.exact))
 assert.equal(p.increasedTimeouts,false);assert.equal(p.restartedExecutor,false);assert.equal(p.remoteWritesAfterTimeout,false)
})
test('el diagnóstico MF059 distingue lectura del servidor de transferencia y no inventa una corrección',()=>{
 const p=read('technical-mf059-4-diagnostico-latencia.json')
 assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.catalog,'evaluation-2026.146');assert.equal(p.readOnly,true)
 assert.equal(p.nodeService.activities,34);assert.equal(p.nodeService.rounds.length,3);assert.equal(p.nodeService.jsonBytes,263845)
 assert.equal(p.payloadBoundary.serverHashes.rows,34);assert.equal(p.payloadBoundary.constantTransfer.payloadBytes,263845)
 assert.equal(p.applicationChanged,false);assert.equal(p.timeoutsIncreased,false);assert.equal(p.executorRestarted,false);assert.equal(p.rootCauseFullyIsolated,false)
})
