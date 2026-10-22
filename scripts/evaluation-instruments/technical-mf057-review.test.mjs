import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
const root='docs/curriculum/cobertura-secundaria/',read=p=>{assert(existsSync(p),'Falta revisión completa MF057');return JSON.parse(readFileSync(p,'utf8'))}
test('MF057 registra instrumentos leídos y QA representativo sin acreditar navegador personal',()=>{
 const r=read(root+'technical-mf057-5-revision.json'),f=read('data/evaluation-instruments/technical-mf057-five-contracts.json'),m=read(root+'technical-ifc006-mf057-5-matriz.json')
 assert.equal(r.catalog,'evaluation-2026.147');assert.equal(r.runtimeInstalled,true);assert.equal(r.reviewer,'SELF_REVIEW_NO_SUBAGENTS')
 assert.equal(r.topics,115);assert.equal(r.cases,136);assert.equal(r.fullInstruments,544);assert.equal(r.uniqueCompleteCriteria,133);assert.equal(r.pendingInstrumentReading,0)
 const installed=read(root+'technical-mf057-5-instalacion.json'),personal=read(root+'technical-mf057-5-navegador-personal.json')
 assert.equal(installed.catalogInstallation.second,'UNCHANGED');assert.equal(r.httpDb,'REPRESENTATIVE_QA_PASSED');assert.equal(r.browser,'AUTHENTICATION_REQUIRED');assert.equal(personal.creatorVerified,false);assert.equal(f.status,'IMPLEMENTED_REVIEWED_PENDING_RUNTIME_QA')
 const http=read(root+'technical-mf057-5-verificacion-http.json');assert.equal(http.verified,16);assert.equal(http.personalCreatorVerified,false);assert.equal(r.status,'REVIEWED_INSTALLED_REPRESENTATIVE_QA_VERIFIED_PERSONAL_AUTH_REQUIRED')
 assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.adaptations.length,115)
})
test('las544definiciones MF057 conservan textos completos, niveles y puntuación17.35',()=>{
 const all=read(root+'technical-mf057-5-instrumentos.json'),review=read(root+'technical-mf057-5-revision.json');assert.equal(all.length,544)
 for(const p of all){const {sha256,...definition}=p;assert.equal(createHash('sha256').update(JSON.stringify(definition)).digest('hex'),sha256);assert(review.instruments.some(r=>r.id===p.id&&r.sha256===sha256&&r.status==='REVIEWED'));assert.equal(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),1735);assert(p.criteria.every(c=>c.description.trim()&&c.progressionLevels.length===5));assert.equal(p.levels.length,['rubrica','escala'].includes(p.instrumentType)?4:0)}
})
test('las adaptaciones MF057 conservan referencias sin actitudes, orientaciones o cuentas reales',()=>{
 const m=read(root+'technical-ifc006-mf057-5-matriz.json');assert.equal(m.adaptations.length,115)
 assert(m.officialRecords.filter(r=>['ATTITUDE','TEACHING_STRATEGY'].includes(r.type)).every(r=>r.adaptationIds.length===0))
 for(const t of m.adaptations)for(const id of t.sourceRecordIds){const r=m.officialRecords.find(r=>r.id===id);assert(r);assert(!['ATTITUDE','TEACHING_STRATEGY'].includes(r.type))}
})
