import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs'
import {recommend} from '../../apps/backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation'
import {scoreInstrumentFields} from '../../apps/frontend/src/modules/activities/services/instrumentScoring'
const root='data/evaluation-instruments/composition-pilot/',out=root+'closure/'
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'))
const bank=read(root+'bank.json'),lock=read(root+'bank.lock.json'),before=read(root+'after-reviewed.json')
const hash=(path:string)=>createHash('sha256').update(readFileSync(path,'utf8').replace(/\r\n/g,'\n')).digest('hex')
assert.equal(hash(root+'bank.json'),lock.sha256)
for(const source of lock.sources)assert.equal(hash(source.path),source.sha256)
const affected=new Set(['B-NAT1-solar-exacta','B-NAT1-solar-maxima','NEW-B2','MAT04'])
const content=(p:any)=>({activityType:p.activityType,instrumentType:p.instrumentType,levels:p.levels,totalScore:p.totalScore,totalScoreUnits:p.totalScoreUnits,criteria:p.criteria.map(({id,sourceReferences,sourceType,...c}:any)=>c)})
const results:any[]=[],instruments:any[]=[],markdown=['# Instrumentos afectados: lectura completa del coordinador','', 'Consignas y expectativas: banco original inmutable. Sin revisión independiente. Esta evidencia es generación automática; el juicio pedagógico se documenta en el informe.','']
for(const task of bank.cases){
 const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:task.subjectCode==='NAT'?'NAT-TU':task.subjectCode,subjectName:task.subjectCode,modalityCode:null,optativeExitName:null}
 const input={activityTitle:task.title,description:task.description,maxScore:20,participationMode:'INDIVIDUAL' as const}
 const p=recommend(input,context,null,[],'UNMAPPED',null),old=before.results.find((r:any)=>r.id===task.id).instruments[0].instrument
 const stable=!['B-NAT1-solar-exacta','B-NAT1-solar-maxima','NEW-B2'].includes(task.id)
 if(stable)assert.deepEqual(content(p),content(old),task.id+': no cambiar criterios correctos')
 assert.deepEqual(p.internalTrace.composition!.uncovered,[])
 results.push({id:task.id,originalRequirements:task.requirements,inherent:task.inherent,forbidden:task.forbidden,expected:task.expected??null,originalExpectations:task.originalExpectations??null,criteriaCount:p.criteria.length,criteriaUnchanged:stable,trace:p.internalTrace.composition})
 const formats=affected.has(task.id)?['rubrica','lista-cotejo','escala','lista-ponderada'] as const:[p.instrumentType]
 for(const instrumentType of formats){
  const server=recommend({...input,preferredInstrumentType:instrumentType},context,null,[],'UNMAPPED',null)
  if(task.id==='MAT04')assert.deepEqual(content(server),content(before.results.find((r:any)=>r.id===task.id).instruments.find((p:any)=>p.selection===instrumentType).instrument),'MAT04: conservar los cuatro formatos')
  const local=editableFallbackRecommendation({...input,instrumentType,academicContext:context})
  assert.deepEqual(content(server),content(local),task.id+': paridad')
  const pending=scoreInstrumentFields(recommendationToFields(server,task.title),instrumentType,null,server)
  assert.equal(pending[instrumentType+':meta:scorePending'],'true')
  for(const [key,value]of Object.entries(pending))if(key.startsWith(instrumentType+':points:'))assert.equal(value,'')
  for(const score of [20,17.35]){
   const scored=scoreInstrumentFields(pending,instrumentType,score,server)
   const total=Object.entries(scored).filter(([key])=>key.startsWith(instrumentType+':points:')).reduce((n,[,value])=>n+Math.round(Number(value)*100),0)
   assert.equal(total,Math.round(score*100))
  }
  instruments.push({case:task.id,format:instrumentType,serverLocalExact:true,pending:true,exactTotals:[2000,1735],instrument:server})
  if(affected.has(task.id)){
   markdown.push(`## ${task.id}: ${instrumentType}`,'',task.description,'',`Total: ${server.totalScore}. Niveles: ${server.levels.map(l=>l.label).join(' / ')||'Sí / No'+(instrumentType==='lista-ponderada'?' / Parcial según indicador':'')}.`,'')
   for(const c of server.criteria){markdown.push(`### ${c.title} (${c.maxScore} puntos)`,'',c.description,'');for(const d of c.descriptors)markdown.push(`- ${server.levels.find(l=>l.id===d.levelId)!.label}: ${d.text}`);markdown.push('')}
  }
 }
}
const comparison=results.find(r=>r.id==='MAT04').trace.contract.requirements.find((r:any)=>r.key==='comparison')
assert.equal(comparison.origin.text,'Compara −0.75 y −2/3')
mkdirSync(out,{recursive:true})
const result={bankSha256:lock.sha256,beforeReference:root+'after-reviewed.json',review:'COORDINADOR_SOLO',results,instruments}
if(process.argv.includes('--check')){
 assert.deepEqual(read(out+'results.json'),JSON.parse(JSON.stringify(result)),'La evidencia final debe corresponder al código actual serializado')
 assert.equal(readFileSync(out+'instrumentos-afectados.md','utf8').replace(/\r\n/g,'\n'),markdown.join('\n').trimEnd()+'\n')
}else{
 writeFileSync(out+'results.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'})
 writeFileSync(out+'instrumentos-afectados.md',markdown.join('\n').trimEnd()+'\n',{flag:'wx'})
}
console.log(JSON.stringify({cases:results.length,instruments:instruments.length,affectedComplete:affected.size*4,parity:true,pending:true,totals:[20,17.35],unchangedCriteria:results.filter(r=>r.criteriaUnchanged).length,comparison:comparison.origin}))
