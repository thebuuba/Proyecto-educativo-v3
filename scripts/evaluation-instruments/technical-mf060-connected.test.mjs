import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=name=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-mf060-6-'+name+'.json','utf8'))
test('MF060 se instala individual e idempotentemente solo en Development conservando datos previos',()=>{
 const r=read('instalacion');assert.equal(r.project,'eolgunypmtgrsyrjzcld');assert.equal(r.grade,6);assert.equal(r.moduleCode,'MF_060_3')
 assert.equal(r.catalog,'evaluation-2026.150');assert.equal(r.source.first,'CREATED');assert.equal(r.source.second,'UNCHANGED')
 assert.equal(r.source.literalRecords,70);assert.equal(r.source.literalParts,75);assert.equal(r.catalogInstallation.second,'UNCHANGED')
 assert.equal(r.catalogInstallation.preservedReleases,82);assert.equal(r.catalogInstallation.preservedSnapshots,1185)
 assert.equal(r.contexts.executions,4);assert(r.contexts.modes.every(m=>m.grade===6&&m.originalDataUnchanged&&m.newAccounts===0&&m.newStudents===0))
 assert.equal(r.priorPersonalBaselines.count,15);assert.equal(r.priorPersonalBaselines.exact,true);assert.equal(r.deploy,false);assert.equal(r.push,false)
})
test('MF060 distingue el bloqueo visual personal de la verificación HTTP',()=>{
 const r=read('navegador-personal');assert.equal(r.status,'AUTHENTICATION_REQUIRED_CREATOR_NOT_VERIFIED');assert.equal(r.browserAvailable,true)
 assert.equal(r.creatorVerified,false);assert.equal(r.savedAndReopened,false);assert.equal(r.emailSent,false);assert.equal(r.newPassword,false);assert.equal(r.storageCleared,false)
 assert.equal(r.browserEntry,'/assets/index-CBNy98H1.js');assert.equal(r.browserEntryMatchesBuild,true);assert(r.manualSteps.length>=4)
})
test('MF060 no acredita QA completada cuando el cliente y el acceso a Development quedan bloqueados',()=>{
 const r=read('verificacion-http');assert.equal(r.status,'QA_BLOCKED_CONNECTION_TIMEOUT_PERSONAL_AUTH_REQUIRED')
 assert.equal(r.verified,0);assert.equal(r.preparedIds,0);assert.equal(r.responses,2);assert.equal(r.http500,0);assert.equal(r.http429,0)
 assert.equal(r.initialClientTimeouts,1);assert.equal(r.independentPositiveProbe.status,500);assert.equal(r.independentPositiveProbe.dataWrites,false)
 assert.equal(r.preservation.lastConfirmedReleases,83);assert.equal(r.preservation.lastConfirmedSnapshots,1185)
 assert.equal(r.preservation.previousReleases,82);assert.equal(r.preservation.previousSnapshots,1185);assert.equal(r.preservation.latestCheck,'CONNECTION_TIMEOUT')
 assert.equal(r.personalBaselinesBefore.count,15);assert.equal(r.personalBaselinesAfter,'BLOCKED_NOT_VERIFIED');assert.deepEqual(r.verifiedSamples,[])
})
