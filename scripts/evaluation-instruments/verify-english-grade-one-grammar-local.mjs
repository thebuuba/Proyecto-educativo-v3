import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-one-grammar-contracts.json','utf8'))
const before=process.argv.includes('--before'),{request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,before?'evaluation-2026.35':'evaluation-2026.36')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
for(const [index,f] of (before?fixtures.slice(0,2):fixtures).entries())for(const mode of ['production','recognition'])for(const preferredInstrumentType of before?['rubrica']:['rubrica','lista-cotejo','escala','lista-ponderada']){
 const description=mode==='production'?f.production:`Leerán un texto en inglés e identificarán ${f.term}.`
 const input={sectionSubjectId,activityTitle:'Actividad',description,maxScore:index%2?20:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const proposal=await request('/evaluation-instruments/recommend',input)
 if(!before){
  assert.equal(proposal.curriculumScopeId,'7e7fbeb7-c16c-526c-9b7f-ff20ef44d44f')
  const features=proposal.criteria.filter(c=>c.templateId.includes('-feature-'))
  assert.deepEqual(features.map(c=>c.templateId),[`ing-1-feature-${f.id}`])
  if(mode==='production')assert(features[0].description.includes(f.meaning))
  else assert(!/explica|Emplea/.test(features[0].description))
  assert.equal(proposal.instrumentType,preferredInstrumentType)
  assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(input.maxScore*100))
 }
 results.push({feature:f.id,mode,input,proposal})
}
// Preserve each pedagogical response; newline-separated entries keep large evidence readable without duplicating indentation.
const file=`docs/curriculum/cobertura-secundaria/evidencias/ingles-1-gramatica-${before?'antes':'servicio'}.json`
writeFileSync(file,JSON.stringify({health,verifiedAt:new Date().toISOString(),results})+'\n')
console.log(JSON.stringify({before,structures:before?2:fixtures.length,requests:results.length}))
