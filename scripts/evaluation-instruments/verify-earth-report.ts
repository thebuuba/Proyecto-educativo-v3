import {readFileSync,writeFileSync} from 'node:fs'
import assert from 'node:assert/strict'
import {recommend} from '../../apps/backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation'
import {resolveCommonScienceTask,extractTaskRequirements} from '../../packages/shared/src'
const root='data/evaluation-instruments/earth-report/'
const bank=JSON.parse(readFileSync(root+'cases.json','utf8'))
const phase=process.argv[2];if(!['before','after','inspect'].includes(phase))throw Error('Use before, after or inspect')
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const results=bank.cases.map((c:any)=>({id:c.id,requirements:extractTaskRequirements(c.description),task:resolveCommonScienceTask(c.title,c.description,bank.context),formats:(c.id==='earth'?formats:['rubrica'] as const).map(format=>{
 const input={activityTitle:c.title,description:c.description,maxScore:17.35,participationMode:'INDIVIDUAL' as const}
 return {format,server:recommend({...input,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null),local:editableFallbackRecommendation({...input,instrumentType:format,academicContext:bank.context})}
})}))
writeFileSync(phase==='inspect'?'.wrangler/realistic-audit/earth-inspect.json':root+phase+'.json',JSON.stringify({phase,results},null,2)+'\n',{flag:phase==='inspect'?'w':'wx'})
const shape=(p:any)=>p.criteria.map((c:any)=>({templateId:c.templateId,title:c.title,description:c.description,progressionLevels:c.progressionLevels,descriptors:c.descriptors.map((d:any)=>d.text),maxScoreUnits:c.maxScoreUnits,taskConditionIds:c.taskConditionIds}))
const parity=results.map((r:any)=>({id:r.id,formats:r.formats.map((f:any)=>({format:f.format,completeContentEqual:JSON.stringify(shape(f.server))===JSON.stringify(shape(f.local))}))}))
if(phase==='after'){
 for(const r of parity)for(const f of r.formats)assert(f.completeContentEqual,r.id+' '+f.format+' content differs')
 writeFileSync(root+'parity.json',JSON.stringify(parity,null,2)+'\n',{flag:'wx'})
}
if(phase!=='before'){
 const lines=['# Informe de la Tierra · instrumentos completos','', 'Revisión del coordinador, sin agentes; propuestas evaluables, sin inspección automática de archivos.','']
 for(const f of results[0].formats){
  lines.push(`## ${f.format}`,'')
  for(const c of f.server.criteria){lines.push(`### ${c.title} (${c.maxScore} puntos; ${c.templateId})`,'',c.description,'');for(const d of c.descriptors)lines.push(`- ${d.levelId}: ${d.text} (${d.scoreUnits/100} puntos)`);if(c.descriptors.length)lines.push('')}
 }
 writeFileSync(phase==='inspect'?'.wrangler/realistic-audit/earth-instruments-preview.md':root+'instrumentos-completos.md',lines.join('\n').trimEnd()+'\n',{flag:phase==='inspect'?'w':'wx'})
}
console.log(JSON.stringify({phase,cases:results.length,parity}))
