import {readFileSync,writeFileSync} from 'node:fs'
import assert from 'node:assert/strict'
import {recommend} from '../../apps/backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation'
const root='data/evaluation-instruments/presentation-requirements/'
const bank=JSON.parse(readFileSync(root+'cases.json','utf8'))
const phase=process.argv[2]
if(!['before','after','inspect'].includes(phase))throw Error('Use before, after or inspect')
const results=bank.cases.map((c:any)=>{
 const context={level:'SECONDARY' as const,grade:c.grade,cycle:c.grade<=3?1:2,subjectCode:c.subjectCode,subjectName:c.subjectCode,modalityCode:null,optativeExitName:null}
 return {id:c.id,expected:c.expected,formats:((c.id==='huerto'||c.id==='structure-evidence')&&phase!=='before'?['rubrica','lista-cotejo','escala','lista-ponderada']:c.id==='huerto'?['rubrica','lista-cotejo','escala','lista-ponderada']:['rubrica']).map((format:any)=>{
  const input={activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL' as const}
  try{return {format,server:recommend({...input,preferredInstrumentType:format},context,null,[],'UNMAPPED',null),local:editableFallbackRecommendation({...input,instrumentType:format,academicContext:context})}}
  catch(e){return {format,error:e instanceof Error?e.message:String(e)}}
 })}
})
const parity=results.map((r:any)=>({id:r.id,formats:r.formats.map((f:any)=>{
 if(f.error)return {format:f.format,error:f.error}
 const empty={conditions:[],issues:[]}
 const contractEqual=JSON.stringify(f.server.internalTrace.taskRequirements??empty)===JSON.stringify(f.local.internalTrace.taskRequirements??empty)
 const project=(p:any)=>p.criteria.map((c:any)=>({templateId:c.templateId,description:c.description,progressionLevels:c.progressionLevels,taskConditionIds:c.taskConditionIds}))
 if(phase==='after'){
  assert(contractEqual,r.id+': contract mismatch')
  for(const p of [f.server,f.local]){
   assert.equal(p.criteria.reduce((s:number,c:any)=>s+c.maxScoreUnits,0),2000)
   const ids=p.criteria.flatMap((c:any)=>c.taskConditionIds??[])
   assert.equal(new Set(ids).size,ids.length,r.id+': repeated binding')
   const report=p.internalTrace.taskRequirements??empty,unresolved=new Set(report.issues.flatMap((i:any)=>i.conditionIds))
   for(const c of report.conditions){
    assert.equal(bank.cases.find((item:any)=>item.id===r.id).description.slice(c.origin.start,c.origin.end),c.origin.text)
    if(['REQUIRED','ALTERNATIVE'].includes(c.relation)&&!unresolved.has(c.id))assert(ids.includes(c.id),r.id+': unbound '+c.id)
    if(c.relation==='OPTIONAL')assert(!ids.includes(c.id),r.id+': optional condition scored')
   }
  }
 }
 return {format:f.format,contractEqual,completeContentEqual:JSON.stringify(project(f.server))===JSON.stringify(project(f.local))}
})}))
writeFileSync(phase==='inspect'?'.wrangler/realistic-audit/presentation-inspect.json':root+phase+'.json',JSON.stringify({phase,results},null,2)+'\n',{flag:phase==='inspect'?'w':'wx'})
if(phase!=='before'){
 const lines=['# Instrumentos completos representativos','', 'Revisión del coordinador, sin agentes. Son propuestas para evaluación docente; no inspeccionan archivos entregados.','']
 for(const r of results.filter((r:any)=>['huerto','structure-evidence'].includes(r.id)))for(const f of r.formats){
  lines.push(`## ${r.id} · ${f.format}`,'')
  for(const c of f.server.criteria){
   lines.push(`### ${c.title} (${c.templateId}; ${c.maxScore} puntos)`,'',c.description,'')
   for(const d of c.descriptors)lines.push(`- ${d.levelId}: ${d.text} (${d.scoreUnits/100} puntos)`)
   if(c.descriptors.length)lines.push('')
  }
 }
 writeFileSync(phase==='inspect'?'.wrangler/realistic-audit/presentation-instrumentos-preview.md':root+'instrumentos-representativos.md',lines.join('\n')+'\n',{flag:phase==='inspect'?'w':'wx'})
 if(phase==='after')writeFileSync(root+'parity.json',JSON.stringify(parity,null,2)+'\n',{flag:'wx'})
}
console.log(JSON.stringify({phase,cases:results.length,errors:results.filter((r:any)=>r.formats.some((f:any)=>f.error)).map((r:any)=>r.id)}))
