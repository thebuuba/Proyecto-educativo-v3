import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/',load=n=>JSON.parse(readFileSync(root+'evidencias/'+n,'utf8'))
const before=load('consignas-antes-66.json'),after=load('consignas-servicio-69.json'),persist=load('consignas-persistencia.json')
const lines=['# Consignas: instrumentos completos antes y después','','Datos de la cuenta ficticia local. Las respuestas del servicio y los instrumentos realmente guardados se distinguen a continuación. Las descripciones completas y sus requisitos están en las evidencias JSON enlazadas en el informe.','']
function instrument(label,p){
 lines.push(`## ${label}`,'',`Catálogo: ${p.catalogVersion}. Formato: ${p.instrumentType}. Total: ${p.totalScore}.`,'')
 for(const [i,c] of p.criteria.entries()){
  lines.push(`### ${i+1}. ${c.title}`,'',`ID de plantilla: ${c.templateId}. Puntos: ${c.maxScore}.`, '',c.description,'')
  for(const d of c.descriptors){const level=p.levels.find(l=>l.id===d.levelId);lines.push(`- ${level?.label??d.levelId}: ${d.text}`)}
  lines.push('')
 }
}
instrument('Antes: My Future Plans, respuesta real .66',before.initial)
for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada']){
 const r=after.results.find(r=>r.case==='future'&&r.input.preferredInstrumentType===format&&r.input.maxScore===20);assert(r)
 instrument(`Después: My Future Plans, servicio ${format}`,r.proposal)
}
for(const a of persist.activities)instrument(`Guardado y reabierto: ${a.name}`,a.instrumentSnapshot)
writeFileSync(root+'consignas-ejemplos-completos.md',lines.join('\n')+'\n')
console.log(JSON.stringify({fullExamples:8,status:'rendered'}))
