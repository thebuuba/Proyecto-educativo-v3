import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {recommend} from '../../apps/backend/src/modules/evaluation-instruments/recommendation-engine.ts'
import {editableFallbackRecommendation} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
import {resolveCommonMathTask} from '../../packages/shared/src/secondary-math-common.ts'
const phase=process.argv[3]
assert(['before','after'].includes(phase),'Choose before or after')
const path=`docs/superpowers/reports/2026-10-16-operaciones-${phase}.json`
const context={level:'SECONDARY',grade:1,cycle:1,subjectCode:'MAT',subjectName:'Matemática',optativeExitName:null}
const cases=JSON.parse(readFileSync('data/evaluation-instruments/math-operations-relevance.json','utf8'))
const results=cases.map(f=>{
  const input={activityTitle:f.title,description:f.description,maxScore:17.35,participationMode:'INDIVIDUAL'}
  const automatic=recommend(input,context,null,[],'UNMAPPED',null)
  const instruments=['rubrica','lista-cotejo','escala','lista-ponderada'].map(instrumentType=>({
    instrumentType,
    server:recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null),
    local:editableFallbackRecommendation({...input,instrumentType,academicContext:context}),
  }))
  return {...f,task:resolveCommonMathTask(f.title,f.description,context),automatic,instruments}
})
writeFileSync(path,JSON.stringify({phase,scope:'Reproducción mínima; no es la consigna original no disponible. Servicio puro sin recuperación curricular y alternativa local.',results},null,2)+'\n',{flag:phase==='before'?'wx':'w'})
console.log(JSON.stringify(results.map(r=>({id:r.id,task:r.task?.actions.map(a=>a.topics.map(t=>t.id)),automatic:r.automatic.instrumentType,rows:r.automatic.criteria.map(c=>({id:c.templateId,title:c.title,description:c.description}))})),null,2))
