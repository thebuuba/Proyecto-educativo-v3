import {readFileSync,writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {performance} from 'node:perf_hooks'
import assert from 'node:assert/strict'
import {recommend} from '../../apps/backend/src/modules/evaluation-instruments/recommendation-engine'
import {editableFallbackRecommendation,recommendationToFields} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation'
import {scoreInstrumentFields} from '../../apps/frontend/src/modules/activities/services/instrumentScoring'
import {composePilotInstrument} from '../../packages/shared/src/instrument-composition-pilot'

const root='data/evaluation-instruments/composition-pilot/',read=(p:string)=>JSON.parse(readFileSync(p,'utf8'))
const bank=read(root+'bank.json'),lock=read(root+'bank.lock.json'),phase=process.argv[2]
const fileDigest=(path:string)=>createHash('sha256').update(readFileSync(path,'utf8').replace(/\r\n/g,'\n')).digest('hex')
assert(['before','after'].includes(phase),'Fase explícita before/after')
assert.equal(fileDigest(root+'bank.json'),lock.sha256)
for(const source of lock.sources)assert.equal(fileDigest(source.path),source.sha256,'Banco anterior inmutable')
const names={LEN:'Lengua Española',NAT:'Ciencias de la Naturaleza',MAT:'Matemática',SOC:'Ciencias Sociales',ING:'Inglés',FRA:'Francés'}
const context=(task:any)=>({level:'SECONDARY' as const,grade:task.grade,cycle:task.grade<=3?1:2,subjectCode:task.subjectCode,subjectName:names[task.subjectCode],modalityCode:null,optativeExitName:null})
// Solo se separa identidad/referencias del transporte: ningún texto, peso, orden o cálculo se normaliza.
const content=(p:any)=>({activityType:p.activityType,instrumentType:p.instrumentType,levels:p.levels,totalScore:p.totalScore,totalScoreUnits:p.totalScoreUnits,scoreUnit:p.scoreUnit,criteria:p.criteria.map(({id,sourceReferences,sourceType,...row}:any)=>row)})
const results=[]
for(const task of bank.cases){
 const input={activityTitle:task.title,description:task.description,maxScore:20,participationMode:'INDIVIDUAL' as const}
 const start=performance.now(),automatic=recommend(input,context(task),null,[],'UNMAPPED',null),elapsed=performance.now()-start
 const instruments=[{selection:'AUTO',instrument:automatic},...bank.representatives.includes(task.id)?(['rubrica','lista-cotejo','escala','lista-ponderada'] as const).map(format=>({selection:format,instrument:recommend({...input,preferredInstrumentType:format},context(task),null,[],'UNMAPPED',null)})):[]]
 const parity=instruments.map(({selection,instrument:p})=>{
  const local=editableFallbackRecommendation({...input,instrumentType:p.instrumentType,academicContext:context(task)})
  const fields=recommendationToFields(p,task.title)
  const pending=scoreInstrumentFields(fields,p.instrumentType,null,p),decimal=scoreInstrumentFields(fields,p.instrumentType,17.35,p)
  return {selection,equal:JSON.stringify(content(p))===JSON.stringify(content(local)),...JSON.stringify(content(p))===JSON.stringify(content(local))?{}:{local},pendingScores:Object.entries(pending).filter(([id])=>id.startsWith(p.instrumentType+':points:')),decimalTotal:Object.entries(decimal).filter(([id])=>id.startsWith(p.instrumentType+':points:')).reduce((s,[,value])=>s+Math.round(Number(value)*100),0)}
 })
 const composerSamplesMs:number[]=[]
 if(phase==='after')for(let sample=0;sample<5;sample++){
  const started=performance.now();composePilotInstrument({description:task.description,context:context(task),instrumentType:automatic.instrumentType,maxScore:20,participationMode:'INDIVIDUAL'});composerSamplesMs.push(performance.now()-started)
 }
 results.push({id:task.id,instruments,parity,backendPureMs:elapsed,composerSamplesMs})
}
const original=read('data/evaluation-instruments/engine-evaluation/bank-v1.json')
const outside=original.cases.filter((c:any)=>['LEN03','LEN04','ING02','ING03','FRA02','SOC02','NAT02','NAT03','MAT01','MAT02'].includes(c.id)).map((task:any)=>({id:task.id,instrument:recommend({activityTitle:task.title,description:task.description,maxScore:20,participationMode:'INDIVIDUAL'},context(task),null,[],'UNMAPPED',null)}))
if(phase==='after')assert.deepEqual(outside.map(r=>({id:r.id,content:content(r.instrument)})),read(root+'before.json').outside.map((r:any)=>({id:r.id,content:content(r.instrument)})),'Despacho fuera del piloto cambia contenido')
writeFileSync(root+phase+(process.argv[3]?'-'+process.argv[3]:'')+'.json',JSON.stringify({bankSha256:lock.sha256,review:'COORDINADOR_SOLO',results,outside},null,2)+'\n',{flag:'wx'})
console.log(JSON.stringify({phase,cases:results.length,instruments:results.reduce((n,r)=>n+r.instruments.length,0),parity:results.map(r=>({id:r.id,all:r.parity.every(p=>p.equal)})),outside:outside.length}))
