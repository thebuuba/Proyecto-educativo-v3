import fs from 'node:fs'
import assert from 'node:assert/strict'
const root='docs/curriculum/cobertura-secundaria/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'))
const scope=read(root+'inventario.json').scopes.find(s=>s.grade===4&&s.subject.startsWith('Lengua')&&s.character==='COMMON')
const ids=['cronica','instructivo','informe-investigacion','articulo-opinion','discurso-agradecimiento','novela','soneto']
const bindings=[
 ['sequence','feature-types','feature-types','feature-temporal','feature-manner','feature-adjectives','feature-synonyms','feature-circumstances','feature-pronouns','feature-passive','feature-sentences'],
 ['sequence','feature-impersonal','feature-infinitive','feature-connectors','feature-adverbs','feature-vocabulary','feature-graphics','feature-enumeration'],
 ['problem','problem','feature-argument-types','feature-impersonal','feature-vocabulary','feature-sentences','feature-infinitive','feature-connectors','feature-adverbs','feature-sources','feature-citations','feature-organizers'],
 ['organization','organization','feature-counterarguments','feature-connectors','feature-stance','feature-stance','feature-citations','feature-statistics','feature-rhetorical','feature-vocabulary'],
 ['reasons','occasion','occasion','feature-references','feature-deictics','feature-connectors','feature-courtesy','feature-voices','reasons','feature-nonverbal'],
 ['plot','plot','feature-sequences','feature-connectors','feature-discourse','feature-past','feature-adjectives','narrator','theme','characters'],
 ['verse','feature-licenses','verse','rhyme','feature-images','feature-literary','meaning'],
]
const contracts=scope.topics.flatMap((t,i)=>{assert.equal(t.subtopics.length,bindings[i].length);return t.subtopics.map((s,j)=>({id:`subtopic-${i+1}-${j+1}`,topic:ids[i],source:s,type:'ANALYSIS',description:`Analizarán ${t.title.replace(/\s+/g,' ').toLowerCase()} atendiendo a ${s.text.replace(/^•\s*/,'').replace(/\s+/g,' ')}. Usarán ejemplos del texto disponible.`,criterion:bindings[i][j],contains:'',absent:'No aporta evidencia suficiente'}))})
fs.writeFileSync('data/evaluation-instruments/language-grade-four-subtopic-contracts.json',JSON.stringify(contracts,null,2)+'\n')
// Actual visual boundaries, including oral instructivo/discurso before the left-column labels.
const ranges=[[0,13],[14,24],[25,39],[40,51],[52,70],[71,77],[78,91]]
const groups=ranges.map(([a,b])=>Array.from({length:b-a+1},(_,i)=>scope.elements.PROCEDURE[a+i]))
const checkedPath=root+'lengua-4-cotejo-fuente.json'
if(fs.existsSync(checkedPath)&&read(checkedPath).status==='VERIFIED_DEFINED_FAMILIES') {
 assert.deepEqual(contracts,read(checkedPath).contracts,'Changed source requires a new explicit review')
 console.log({subtopics:contracts.length,proceduralRecords:92,auditPreserved:true});process.exit(0)
}
const review=read(root+'revision.json')
for(let i=0;i<scope.topics.length;i++){
 const entry={id:scope.topics[i].id,procedures:groups[i].map(p=>p.id),boundaryReview:'VISUALLY_REVIEWED_PDF_96_104',procedureAssociation:'VISUALLY_REVIEWED',implementation:'IN_PROGRESS',pending:'Falta cerrar pruebas de familias, HTTP y persistencia real de 4.º.'}
 const prior=review.topics.find(t=>t.id===entry.id);if(prior)Object.assign(prior,entry);else review.topics.push(entry)
}
fs.writeFileSync(root+'revision.json',JSON.stringify(review,null,2)+'\n')
fs.writeFileSync(checkedPath,JSON.stringify({grade:4,subject:'Lengua Española común',status:'IN_PROGRESS',pdfPages:[96,97,98,99,100,101,102,103,104],topics:scope.topics.map((t,i)=>({id:t.id,title:t.title,provider:ids[i],subtopics:t.subtopics,procedures:groups[i]})),notes:[
 'La comprensión escrita de crónica continúa al principio de PDF97; sus procedimientos escritos terminan antes de la comprensión oral del instructivo.',
 'En PDF97 la comprensión y producción oral del instructivo están antes del rótulo de concepto en la columna izquierda; no pertenecen a crónica.',
 'El informe de investigación continúa en PDF99 antes del artículo de opinión.',
 'Función y estructura argumentativa es un único concepto del artículo, separado en dos registros de extracción. Ambos se vinculan a la misma dimensión; 68 registros, 67 conceptos lógicos.',
 'En PDF100 la comprensión oral del discurso de agradecimiento precede a su rótulo. No pertenece al artículo de opinión.',
 'La nota del artículo de opinión utiliza la producción oral para fortalecer la escrita; no exige entregar una exposición cuando se pide preparar el artículo.',
 'La novela prioriza comprensión oral y escrita: no se inventan procedimientos de producción de una novela completa.',
 'La comprensión del soneto continúa en PDF103; su escritura incorpora versos endecasílabos y rima consonante.',
 '92 registros de procedimiento incluyen encabezados y viñetas; se corresponden con 26 bloques de modalidad, no con 92 actividades obligatorias. Optativas separadas.'
],contracts},null,2)+'\n')
console.log({subtopicRecords:contracts.length,logicalConcepts:67,proceduralRecords:groups.flat().length,modalityBlocks:26})
