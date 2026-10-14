import {readFileSync,writeFileSync} from 'node:fs'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {localClient,context} from './language-local-client.mjs'
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url))
const shared=require('@aula/shared')
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.46')
const root='data/evaluation-instruments/',grades=['one','two','three','four','five','six']
const cases=[]
for(const [index,grade] of grades.entries()) {
 const fixtures=JSON.parse(readFileSync(root+`language-grade-${grade}-subtopic-contracts.json`,'utf8'))
 for(const topic of new Set(fixtures.map(c=>c.topic))) {
  const c=fixtures.find(c=>c.topic===topic)
  cases.push({grade:index+1,subject:'LEN',topic,title:topic,description:c.description,type:c.type})
 }
}
cases.push({grade:1,subject:'ING',topic:'Rutina exacta',title:'Presentamos nuestra rutina diaria en inglés.',description:'Los estudiantes prepararán una breve presentación oral en inglés sobre cinco actividades de su rutina diaria. Utilizarán el presente simple y expresiones de tiempo como in the morning, in the afternoon y at night. Al finalizar, responderán una pregunta sencilla de un compañero sobre su rutina.',type:'ORAL_PRESENTATION'})
cases.push({grade:1,subject:'LEN',topic:'Guía escrita y presentación',title:'Descubrimos y promocionamos los atractivos de nuestra comunidad.',description:'Los estudiantes elaborarán una guía turística sobre su comunidad o un lugar destacado de la República Dominicana. Investigarán sus principales atractivos naturales, culturales e históricos y organizarán la información mediante descripciones breves, imágenes y recomendaciones para los visitantes. La guía deberá incluir portada, información del lugar, imágenes y cierre. Finalmente, presentarán sus trabajos ante sus compañeros, fortaleciendo sus habilidades de investigación, redacción y comunicación.',type:'TOURIST_GUIDE_CREATION'})
const results=[]
for(const c of cases){
 const sectionSubjectId=context.assignments.find(s=>s.grade===c.grade&&s.code===c.subject).id
 const academic={level:'SECONDARY',grade:c.grade,cycle:c.grade<=3?1:2,subjectCode:c.subject,subjectName:c.subject==='ING'?'Lenguas extranjeras: Inglés':'Lengua Española',modalityCode:null,optativeExitName:null}
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
  const input={sectionSubjectId,activityTitle:c.title,description:c.description,pedagogicalActivityType:c.type,participationMode:'INDIVIDUAL',maxScore:format==='escala'||format==='lista-ponderada'?17.35:20,preferredInstrumentType:format,competencyBlock:'b1'}
  const generated=await request('/evaluation-instruments/recommend',input)
  const pool=await request('/evaluation-instruments/recommend',{...input,includeAdditionalCandidates:true})
  const task=shared.resolveFirstGradeEnglishTask(c.title,c.description,academic)
  const topic=shared.findSecondaryLanguageTopic(c.title,c.description,academic)
  let authored=task?shared.firstGradeEnglishCriteria(task):topic?shared.secondaryTopicCriteria(topic,generated.activityType,c.description,true):null
  if(!authored&&c.grade===1&&c.type==='TOURIST_GUIDE_CREATION')authored=shared.firstGradeGuideCriteria(c.type,c.description)
  if(authored)assert.deepEqual(pool.criteria.map(r=>r.templateId),shared.formatAuthoredCriteria(authored,format).map(r=>r.templateId))
  assert.equal(generated.totalScoreUnits,Math.round(input.maxScore*100))
  assert.equal(generated.criteria.reduce((n,r)=>n+r.maxScoreUnits,0),generated.totalScoreUnits)
  const used=new Set(generated.criteria.map(r=>r.templateId))
  results.push({case:c,format,total:input.maxScore,generated,pool,unusedObjectives:pool.criteria.filter(r=>!used.has(r.templateId)).map(r=>r.templateId)})
 }
 console.log(JSON.stringify({grade:c.grade,subject:c.subject,topic:c.topic,formats:4}))
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/criterios-pools-http.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,cases:cases.length,requests:results.length*2,results},null,2)+'\n')
console.log(JSON.stringify({cases:cases.length,requests:results.length*2,passed:true}))
