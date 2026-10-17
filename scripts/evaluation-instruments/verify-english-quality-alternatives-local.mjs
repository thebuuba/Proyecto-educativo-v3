import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.66')
for(const alternative of ['subrayarán o anotarán','anotarán o subrayarán'])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const maxScore of [20,17.35]){
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===6&&a.code==='ING').id,activityTitle:'Actividad',description:`Leerán un texto en inglés y ${alternative} las expresiones solicitadas.`,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
 const proposal=await request('/evaluation-instruments/recommend',input),rows=proposal.criteria.filter(c=>c.templateId.includes('strategy-annotation'))
 assert.equal(rows.length,1);assert(rows[0].description.includes('la alternativa elegida'))
 assert.equal(proposal.criteria.reduce((s,c)=>s+c.maxScoreUnits,0),Math.round(maxScore*100));results.push({input,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/ingles-calidad-alternativas-66.json',JSON.stringify({health,results},null,2)+'\n')
console.log(JSON.stringify({alternatives:results.length,status:'passed'}))
