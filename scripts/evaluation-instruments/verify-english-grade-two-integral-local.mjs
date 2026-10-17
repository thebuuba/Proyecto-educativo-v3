import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const load=name=>JSON.parse(readFileSync(`data/evaluation-instruments/english-grade-two-${name}-contracts.json`,'utf8'))
const cases=[
 ...JSON.parse(readFileSync('data/evaluation-instruments/english-grade-two-contracts.json','utf8')).map(f=>({family:`function-${f.id}`,expected:`ing-2-${f.criteria[0]}`,required:f.criteria.map(id=>`ing-2-${id}`),description:f.description,activity:f.activity})),
 ...load('grammar').map(f=>({family:`grammar-${f.id}`,expected:`ing-2-feature-${f.id}`,description:`Escribirán un mensaje en inglés utilizando ${f.forms[0]}.`})),
 ...load('lexicon').map(f=>({family:`lexicon-${f.id}`,expected:`ing-2-lexicon-${f.id}`,description:`Leerán un texto en inglés e identificarán ${f.category==='vocabulary'?'vocabulario de':'expresiones para'} ${f.label}.`})),
 ...load('strategy').filter((f,i,all)=>all.findIndex(other=>other.id===f.id)===i).map(f=>({family:`strategy-${f.id}`,expected:`ing-2-strategy-${f.id}`,description:f.description})),
 ...load('genre').map(f=>({family:`genre-${f.id}`,expected:`ing-2-genre-${f.id}`,description:`${f.modes.includes('reading')?'Leerán':'Presentarán oralmente'} en inglés una ${f.label} para comunicar la información solicitada.`})),
 ...load('context').filter((f,i,all)=>all.findIndex(other=>other.id===f.id)===i).map(f=>({family:`context-${f.id}`,expected:`ing-2-context-${f.id}`,description:f.description})),
 ...load('composition').map(f=>({family:`composition-${f.id}`,expected:`ing-2-${f.criteria[0]}`,description:f.description,activity:f.activity,required:f.criteria.map(id=>`ing-2-${id}`),excluded:(f.excluded??[]).map(id=>`ing-2-${id}`)})),
]
const formats=['rubrica','lista-cotejo','escala','lista-ponderada']
const {request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.53')
const sectionSubjectId=context.assignments.find(a=>a.grade===2&&a.code==='ING').id
for(const [index,f] of cases.entries()){
 const preferredInstrumentType=formats[index%4],maxScore=index%2?17.35:20
 const input={sectionSubjectId,activityTitle:'Actividad',description:f.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const proposal=await request('/evaluation-instruments/recommend',input)
 assert.equal(proposal.catalogVersion,'evaluation-2026.53');assert.equal(proposal.curriculumScopeId,'7e4c1236-8f04-5817-b017-a9ace9edff5e')
 assert(proposal.criteria.some(c=>c.templateId===f.expected),f.family)
 for(const id of f.required??[])assert(proposal.criteria.some(c=>c.templateId===id),`${f.family}: missing ${id}`)
 for(const id of f.excluded??[])assert(!proposal.criteria.some(c=>c.templateId===id),`${f.family}: unrequested ${id}`)
 if(f.activity)assert.equal(proposal.activityType,f.activity)
 assert.equal(proposal.instrumentType,preferredInstrumentType)
 assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
 assert(proposal.criteria.every(c=>c.progressionLevels?.length===5))
 results.push({family:f.family,input,proposal})
 if(index%15===0)console.log(JSON.stringify({verified:results.length,total:cases.length,family:f.family}))
}
const selections=[]
const describe='Dialogarán en inglés para solicitar y ofrecer ayuda sobre una tarea escolar.'
for(const [purpose,instrument] of [['Se valorará la calidad en varias dimensiones.','rubrica'],['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],['Se registrará la regularidad de cada indicador.','escala'],['Se distribuirán pesos entre los componentes verificables.','lista-ponderada']]){
 const input={sectionSubjectId,activityTitle:'Actividad',description:describe+' '+purpose}
 const interpretation=await request('/evaluation-instruments/interpret',input)
 assert.equal(interpretation.suggestedActivityType,'ORAL_INTERACTION');assert.equal(interpretation.suggestedInstrumentType,instrument)
 for(const total of [20,17.35]){
  const proposal=await request('/evaluation-instruments/recommend',{...input,maxScore:total,participationMode:'INDIVIDUAL'})
  assert.equal(proposal.instrumentType,instrument)
  assert.equal(proposal.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0),Math.round(total*100))
  selections.push({instrument,total,interpretation,proposal})
 }
}
const capacityDescription=load('grammar').map(f=>f.forms[0]).join(', ')
const capacity=[]
for(const preferredInstrumentType of formats){
 const input={sectionSubjectId,activityTitle:'Actividad',description:`Escribirán en inglés un mensaje utilizando ${capacityDescription}.`,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const error=await request('/evaluation-instruments/recommend',input).then(()=>null).catch(e=>e.message)
 assert(error?.includes('HTTP 400'))
 const pool=await request('/evaluation-instruments/recommend',{...input,includeAdditionalCandidates:true})
 assert(pool.criteria.length>20);capacity.push({format:preferredInstrumentType,count:pool.criteria.length,rejectedWithoutPool:true})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-2-integral-servicio.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),scope:'DEFINED_FAMILIES_HTTP_ONE_FORMAT_PER_FAMILY_ALL_FORMATS_SELECTION_TOTALS_UNIT_MATRIX',results,selections,capacity},null,2)+'\n')
console.log(JSON.stringify({families:results.length,selections:selections.length,capacity:capacity.length,checks:'passed'}))
