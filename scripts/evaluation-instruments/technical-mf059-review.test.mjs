import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
const root='docs/curriculum/cobertura-secundaria/',read=p=>{assert(existsSync(p),'Falta revisión real MF059');return JSON.parse(readFileSync(p,'utf8'))}
test('MF059 registra instrumentos completos leídos y distingue fuente de verificación remota',()=>{
 const r=read(root+'technical-mf059-4-revision.json'),f=read('data/evaluation-instruments/technical-mf059-four-contracts.json')
 assert.equal(r.catalog,'evaluation-2026.146');assert.equal(r.runtimeInstalled,false);assert.equal(r.reviewer,'SELF_REVIEW_NO_SUBAGENTS')
 assert.equal(r.topics,85);assert.equal(r.cases,100);assert.equal(r.fullInstruments,400);assert.equal(r.uniqueCompleteCriteria,99);assert.equal(r.pendingInstrumentReading,0)
 assert.equal(f.status,'IMPLEMENTED_REVIEWED_PENDING_RUNTIME_QA');assert.equal(r.httpDb,'NOT_RUN');assert.equal(r.browser,'NOT_RUN')
})
test('las400definicionesMF059 conservan las huellas y cuatroformatos completos',()=>{
 const all=read(root+'technical-mf059-4-instrumentos.json'),review=read(root+'technical-mf059-4-revision.json');assert.equal(all.length,400)
 for(const p of all){const{sha256,...definition}=p;assert.equal(createHash('sha256').update(JSON.stringify(definition)).digest('hex'),sha256);assert(review.instruments.some(r=>r.id===p.id&&r.sha256===sha256&&r.status==='REVIEWED'));assert.equal(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),1735);assert(p.criteria.every(c=>c.templateId.startsWith('technical-mf059-')&&c.description.trim()&&c.progressionLevels.length===5));assert.equal(p.levels.length,['rubrica','escala'].includes(p.instrumentType)?4:0)}
})
test('las85adaptacionesMF059 no convierten actitudes ni orientaciones en criterios',()=>{
 const m=read(root+'technical-ifc006-mf059-4-matriz.json');assert.equal(m.adaptations.length,85);assert.equal(m.implementation.provider,'packages/shared/src/secondary-technical.ts');assert.equal(m.verification.fullReview.pending,0)
 assert(m.officialRecords.filter(r=>['ATTITUDE','TEACHING_STRATEGY'].includes(r.type)).every(r=>r.adaptationIds.length===0))
 for(const topic of m.adaptations)for(const id of topic.sourceRecordIds){const record=m.officialRecords.find(r=>r.id===id);assert(record);assert(!['ATTITUDE','TEACHING_STRATEGY'].includes(record.type))}
})
