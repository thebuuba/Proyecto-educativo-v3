import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient(),results=[]
assert.equal(health.development.catalogVersion,'evaluation-2026.34')
const cases=[
 [1,'Redactarán una noticia con sus hechos y fuentes.'],
 [2,'Analizarán un artículo expositivo distinguiendo el problema y su solución.'],
 [3,'Compararán dos crónicas relacionando sus hechos y perspectivas.'],
 [4,'Redactarán un informe de investigación con datos proporcionados.'],
 [5,'Representarán un entremés teatral mostrando el conflicto y la crítica social.'],
 [6,'Declamarán un poema social comunicando sus sentimientos mediante ritmo y entonación.'],
]
for(const [grade,description] of cases)for(const [purpose,expected] of [
 ['Se valorará la calidad en varias dimensiones.','rubrica'],
 ['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],
 ['Se registrará la regularidad con que se cumplen los indicadores.','escala'],
 ['Se distribuirán pesos entre los componentes verificables.','lista-ponderada'],
]){
 const sectionSubjectId=context.assignments.find(a=>a.grade===grade&&a.code==='LEN').id
 const input={sectionSubjectId,activityTitle:'Actividad',description:description+' '+purpose,maxScore:17.35,participationMode:'INDIVIDUAL'}
 const proposal=await request('/evaluation-instruments/recommend',input)
 assert.equal(proposal.catalogVersion,health.development.catalogVersion)
 assert.equal(proposal.instrumentType,expected)
 assert.equal(proposal.totalScoreUnits,1735)
 assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),1735)
 if(grade===5){assert.equal(proposal.activityType,'PERFORMANCE');assert(!proposal.criteria.some(c=>c.templateId.endsWith('-oral')))}
 if(grade===6)assert.deepEqual(proposal.criteria.map(c=>c.templateId),['len-6-poesia-social-recitation-sequence','len-6-poesia-social-recitation-expression'])
 results.push({grade,input,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/lengua-revision-final-servicio.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),results},null,2)+'\n')
console.log(JSON.stringify({requests:results.length,grades:6,formats:4}))
