import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-one-genre-contracts.json','utf8'))
const before=process.argv.includes('--before'),{request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,before?'evaluation-2026.39':'evaluation-2026.40')
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='ING').id
for(const [index,f] of fixtures.entries()){
 if(before&&!['email','form'].includes(f.id))continue
 for(const mode of ['reading','writing','oral'])if(f[mode])for(const preferredInstrumentType of before?['rubrica']:['rubrica','lista-cotejo','escala','lista-ponderada']){
  const description=mode==='reading'?`Leerán un texto del tipo ${f.name} en inglés e identificarán la información solicitada.`:mode==='writing'?`Redactarán un texto del tipo ${f.name} en inglés para la situación acordada.`:`Presentarán oralmente un texto del tipo ${f.name} en inglés para la situación acordada.`
  const input={sectionSubjectId,activityTitle:'Actividad',description,maxScore:index%2?20:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType}
  const proposal=await request('/evaluation-instruments/recommend',input)
  if(!before){
   assert.equal(proposal.curriculumScopeId,'7e7fbeb7-c16c-526c-9b7f-ff20ef44d44f')
   const reused={recipe:'instructions',forecast:'weather',description:'description'}
   const criterion=proposal.criteria.find(c=>c.templateId===`ing-1-genre-${f.id}`||c.templateId===`ing-1-${reused[f.id]}`)
   assert(criterion,`Missing ${f.id}`)
   assert(criterion.description.includes(f.id==='recipe'?'acciones':f.meaning))
   assert.equal(proposal.instrumentType,preferredInstrumentType)
   assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),Math.round(input.maxScore*100))
  }
  results.push({genre:f.id,mode,input,proposal})
 }
}
writeFileSync(`docs/curriculum/cobertura-secundaria/evidencias/ingles-1-generos-${before?'antes':'servicio'}.json`,JSON.stringify({health,verifiedAt:new Date().toISOString(),results})+'\n')
console.log(JSON.stringify({before,requests:results.length}))
