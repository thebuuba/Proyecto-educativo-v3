import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,requestResult,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.69')
for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']){
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===1&&a.code==='LEN').id,activityTitle:'Informe',description:'Hacen un informe de lectura de una noticia. Mínimo dos páginas y máximo tres ejemplos.',maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const proposal=await request('/evaluation-instruments/recommend',input),text=JSON.stringify(proposal.criteria.filter(c=>c.templateId.startsWith('delivery-')))
 assert(text.includes('mínimo 2 páginas'));assert(text.includes('máximo 3 ejemplos'));assert(!text.includes('entre 2 y 3 páginas'))
 assert.equal(proposal.criteria.reduce((s,c)=>s+c.maxScoreUnits,0),1735)
 results.push({input,proposal})
 const invalid={...input,description:'Hacen un informe de lectura de una noticia. Tres páginas y cinco páginas.'},error=await requestResult('/evaluation-instruments/recommend',invalid)
 assert.equal(error.status,400);results.push({input:invalid,error})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/consignas-unidades-69.json',JSON.stringify({health,results},null,2)+'\n')
console.log(JSON.stringify({checks:results.length,status:'passed'}))
