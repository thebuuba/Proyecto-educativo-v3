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
