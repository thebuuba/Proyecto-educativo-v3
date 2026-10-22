import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
const root='docs/curriculum/cobertura-secundaria/',read=p=>{assert(existsSync(p),'Falta revisión completa MF055');return JSON.parse(readFileSync(p,'utf8'))}
test('MF055 registra instrumentos leídos y QA representativo sin acreditar navegador personal',()=>{
 const r=read(root+'technical-mf055-6-revision.json'),m=read(root+'technical-ifc006-mf055-6-matriz.json')
 assert.equal(r.catalog,'evaluation-2026.148');assert.equal(r.runtimeInstalled,true);assert.equal(r.reviewer,'SELF_REVIEW_NO_SUBAGENTS');assert.equal(r.topics,35);assert.equal(r.cases,50);assert.equal(r.fullInstruments,200);assert.equal(r.uniqueCompleteCriteria,42);assert.equal(r.pendingInstrumentReading,0)
 assert.equal(r.httpDb,'REPRESENTATIVE_QA_PASSED');assert.equal(r.browser,'AUTHENTICATION_REQUIRED');assert.equal(m.adaptations.length,35)
 const installed=read(root+'technical-mf055-6-instalacion.json'),personal=read(root+'technical-mf055-6-navegador-personal.json');assert.equal(installed.catalogInstallation.second,'UNCHANGED');assert.equal(personal.creatorVerified,false)
 const http=read(root+'technical-mf055-6-verificacion-http.json');assert.equal(http.verified,16);assert.equal(http.personalCreatorVerified,false)
})
test('las200definiciones MF055 conservan textos leídos, cuatroformatos, niveles y17.35exactos',()=>{
 const all=read(root+'technical-mf055-6-instrumentos.json'),review=read(root+'technical-mf055-6-revision.json');assert.equal(all.length,200)
 for(const p of all){const {sha256,...definition}=p;assert.equal(createHash('sha256').update(JSON.stringify(definition)).digest('hex'),sha256);assert(review.instruments.some(r=>r.id===p.id&&r.sha256===sha256&&r.status==='REVIEWED'));assert.equal(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),1735);assert(p.criteria.every(c=>c.description.trim()&&c.progressionLevels.length===5));assert.equal(p.levels.length,['rubrica','escala'].includes(p.instrumentType)?4:0)}
})
test('las35adaptaciones MF055 no convierten actitudes u orientaciones en criterios de personalidad',()=>{
 const m=read(root+'technical-ifc006-mf055-6-matriz.json');assert.equal(m.adaptations.length,35)
 assert(m.officialRecords.filter(r=>['ATTITUDE','TEACHING_STRATEGY'].includes(r.type)).every(r=>r.adaptationIds.length===0))
 for(const topic of m.adaptations)for(const id of topic.sourceRecordIds){const r=m.officialRecords.find(r=>r.id===id);assert(r);assert(!['ATTITUDE','TEACHING_STRATEGY'].includes(r.type))}
})
