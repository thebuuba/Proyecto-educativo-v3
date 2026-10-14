import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.25')
const assignment=context.assignments.find(a=>a.grade===2&&a.code==='LEN'),results=[]
for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'])for(const description of ['Elaborarán una guía turística sin mapas ni fotografías.','Elaborarán una guía turística por escrito, sin exposición oral.']) {
 const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle:'Trabajo',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType})
 assert.equal(proposal.activityType,'TOURIST_GUIDE_CREATION')
 assert(!proposal.criteria.some(c=>/-graphics$|-oral-communication$/.test(c.templateId)))
 results.push({description,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/lengua-2-final-negaciones.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),results},null,2)+'\n')
console.log(JSON.stringify({requests:results.length,negativeRequirementsPreserved:true}))
