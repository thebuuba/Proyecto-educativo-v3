import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.46')
const prior=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/evidencias/criterios-pools-http.json','utf8'))
const tasks=prior.results.filter(r=>r.format==='rubrica'&&['Rutina exacta','Guía escrita y presentación'].includes(r.case.topic)).map(r=>r.case)
const novel=JSON.parse(readFileSync('data/evaluation-instruments/novel-task-regression.json','utf8'))
tasks.push({grade:5,subject:'LEN',topic:'Novela y límites de la interpretación',title:novel.activityTitle,description:novel.description,type:novel.activityType})
const results=[]
for(const c of tasks)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const total of [20,17.35]) {
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===c.grade&&a.code===c.subject).id,activityTitle:c.title,description:c.description,pedagogicalActivityType:c.type,preferredInstrumentType:format,participationMode:'INDIVIDUAL',maxScore:total,competencyBlock:'b1'}
 const generated=await request('/evaluation-instruments/recommend',input),pool=await request('/evaluation-instruments/recommend',{...input,includeAdditionalCandidates:true})
 assert.equal(generated.totalScoreUnits,Math.round(total*100));assert.equal(generated.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),generated.totalScoreUnits)
 if(c.subject==='ING')assert.equal(generated.criteria.length,5)
 if(c.grade===1&&c.subject==='LEN')assert(pool.criteria.some(c=>c.templateId==='guide-oral'))
 if(c.grade===5)assert(pool.criteria.some(c=>c.templateId==='novel-analysis-limits')&&!generated.criteria.some(c=>c.templateId==='novel-analysis-limits'))
 results.push({case:c,format,total,generated,pool})
}
for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
 const generated=await request('/evaluation-instruments/recommend',{sectionSubjectId:context.assignments.find(a=>a.grade===1&&a.code==='ING').id,activityTitle:'Actividad',description:'Presentarán oralmente la rutina diaria. No se evaluarán expresiones temporales ni responderán preguntas.',preferredInstrumentType:format,participationMode:'INDIVIDUAL',maxScore:20})
 assert(!generated.criteria.some(c=>/temporal-expressions|question-response/.test(c.templateId)))
 results.push({case:'Exclusión explícita',format,generated})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/criterios-verificacion-final-http.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,requests:52,results},null,2)+'\n')
console.log(JSON.stringify({requests:52,totals:[20,17.35],formats:4,novelAdditionalVerified:true,explicitExclusionsVerified:true}))
