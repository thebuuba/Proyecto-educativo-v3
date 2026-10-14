import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
import {capacityDescription} from './criterion-capacity-fixture.mjs'
const load=name=>JSON.parse(readFileSync(`data/evaluation-instruments/${name}.json`,'utf8'))
const revision=process.argv.includes('--revision')
const fixtures=revision?[load('english-grade-one-context-contracts').find(f=>f.id==='property'),{id:'permission-only',description:'Conversarán en inglés para pedir permiso para usar pertenencias ajenas.',criteria:['property']}]:load('english-grade-one-context-contracts')
const mixed=revision?load('english-grade-one-composition-contracts').filter(f=>f.id==='written-exchange'):load('english-grade-one-composition-contracts'),grammar=load('english-grade-one-grammar-contracts')
const {request,requestResult,health}=await localClient()
assert.equal(health.development.catalogVersion,revision?'evaluation-2026.45':'evaluation-2026.44')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'],results=[],interpretations=[]
for(const f of [...fixtures,...mixed])for(const preferredInstrumentType of formats)for(const maxScore of [20,17.35]){
 const input={sectionSubjectId,activityTitle:preferredInstrumentType==='escala'?'Una obra artística':'Actividad',description:f.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const p=await request('/evaluation-instruments/recommend',input)
 assert.equal(p.curriculumScopeId,'7e7fbeb7-c16c-526c-9b7f-ff20ef44d44f');assert.equal(p.instrumentType,preferredInstrumentType)
 assert.equal(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
 for(const id of f.criteria??[])assert(p.criteria.some(c=>c.templateId===`ing-1-context-${id}`))
 if(f.id==='permission-only')assert(!JSON.stringify(p.criteria.find(c=>c.templateId==='ing-1-context-property')).includes('condiciones'))
 for(const [id,meaning] of f.expected??[])assert(p.criteria.some(c=>c.templateId.startsWith(id)&&c.description.includes(meaning)))
 results.push({id:f.id,input,proposal:p})
}
if(!revision)for(const preferredInstrumentType of formats)for(const maxScore of [20,17.35]){
 const input={sectionSubjectId,activityTitle:'Actividad',description:capacityDescription,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const rejected=await requestResult('/evaluation-instruments/recommend',input);assert.equal(rejected.status,400)
 const description=`Leerán un texto en inglés e identificarán ${grammar.slice(0,20).map(f=>f.term).join(', ')}.`
 const p=await request('/evaluation-instruments/recommend',{...input,description});assert.equal(p.criteria.length,20)
 assert.equal(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(maxScore*100))
 const pool=await request('/evaluation-instruments/recommend',{...input,maxScore:100,includeAdditionalCandidates:true});assert.equal(pool.criteria.length,31)
 results.push({id:'capacity',input,rejected,proposal:p,pool})
}
for(const f of mixed){const p=await request('/evaluation-instruments/interpret',{sectionSubjectId,activityTitle:'Actividad',description:f.description});assert.equal(p.suggestedActivityType,f.activity);assert.equal(p.suggestedInstrumentType,f.instrument);interpretations.push({id:f.id,response:p})}
const output={verifiedAt:new Date().toISOString(),health,results,interpretations}
writeFileSync(`docs/curriculum/cobertura-secundaria/evidencias/ingles-1-${revision?'revision45':'final'}-servicio.json`,JSON.stringify(output)+'\n')
console.log(JSON.stringify({contextAndMixedProposals:(fixtures.length+mixed.length)*8,capacityCalls:revision?0:24,interpretations:mixed.length,catalog:health.development.catalogVersion}))
