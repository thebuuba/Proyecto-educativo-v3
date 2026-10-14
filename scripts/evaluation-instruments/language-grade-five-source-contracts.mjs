import fs from 'node:fs'
import assert from 'node:assert/strict'
const root='docs/curriculum/cobertura-secundaria/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'))
const scope=read(root+'inventario.json').scopes.find(s=>s.grade===5&&s.subject.startsWith('Lengua')&&s.character==='COMMON')
const ids=['carta-autopresentacion','resena','ensayo-argumentativo','discurso-recibimiento-despedida','novela','poesia-satirica','entremes-teatral']
const bindings=[
 ['purpose','feature-courtesy','feature-verbs','feature-verbs','feature-verbs','feature-adjectives','feature-connectors','feature-vocabulary','feature-motive'],
 ['summary','feature-verbs','feature-connectors','feature-adjectives','feature-adverbs','feature-vocabulary','feature-citations'],
 ['thesis','thesis','feature-arguments','feature-counterarguments','feature-connectors'],
 ['occasion','occasion','occasion','feature-references','feature-deictics','feature-deictics','feature-connectors','feature-courtesy','feature-courtesy','feature-register','feature-certainty','feature-certainty','feature-voices','feature-citations','feature-voices','reasons','feature-oratory','feature-punctuation'],
 ['plot','feature-sequences','feature-connectors','feature-discourse','feature-past','feature-adjectives','narrator','theme','characters','feature-actants'],
 ['tone','feature-satire','feature-satire','tone','feature-form','feature-images','feature-figures','feature-figures','feature-figures','feature-figures'],
 ['feature-genre','feature-genre','feature-history','critique','feature-archaic','feature-dialogue','feature-sequences','feature-connectors','feature-figures','feature-history'],
]
const contracts=scope.topics.flatMap((t,i)=>{assert.equal(t.subtopics.length,bindings[i].length);return t.subtopics.map((s,j)=>({id:`subtopic-${i+1}-${j+1}`,topic:ids[i],source:s,type:'ANALYSIS',description:`Analizarán ${t.title.replace(/\s+/g,' ').toLowerCase()} atendiendo a ${s.text.split('Nota:')[0].replace(/^•\s*/,'').replace(/\s+/g,' ')}. Usarán ejemplos del texto disponible.`,criterion:bindings[i][j],contains:'',absent:'No aporta evidencia suficiente'}))})
fs.writeFileSync('data/evaluation-instruments/language-grade-five-subtopic-contracts.json',JSON.stringify(contracts,null,2)+'\n')
const indices=[[0,1,2,3,4],[5,6,7,8],[23,24,9,10],[11,12,13,14],[25,26],[15,16,17,27],[18,19,20,21,22]]
const groups=indices.map(g=>g.map(i=>scope.elements.PROCEDURE[i]))
const path=root+'lengua-5-cotejo-fuente.json'
if(fs.existsSync(path)&&read(path).status==='VERIFIED_DEFINED_FAMILIES'){assert.deepEqual(contracts,read(path).contracts);console.log({auditPreserved:true});process.exit(0)}
const review=read(root+'revision.json')
for(let i=0;i<scope.topics.length;i++){
 const entry={id:scope.topics[i].id,procedures:groups[i].map(p=>p.id),boundaryReview:'VISUALLY_REVIEWED_PDF_105_112',procedureAssociation:'VISUALLY_REVIEWED',implementation:'IN_PROGRESS',pending:'Cerrar contratos, HTTP y persistencia real de 5.º.'}
 const prior=review.topics.find(t=>t.id===entry.id);if(prior)Object.assign(prior,entry);else review.topics.push(entry)
}
fs.writeFileSync(root+'revision.json',JSON.stringify(review,null,2)+'\n')
fs.writeFileSync(path,JSON.stringify({grade:5,subject:'Lengua Española común',status:'IN_PROGRESS',pdfPages:[105,106,107,108,109,110,111,112],topics:scope.topics.map((t,i)=>({id:t.id,title:t.title,provider:ids[i],subtopics:t.subtopics,procedures:groups[i]})),notes:[
 'En PDF106 el comienzo de la columna de procedimientos continúa comprensión y producción escrita de carta; no pertenece a reseña pese al rótulo izquierdo.',
 'La reseña escrita termina en PDF106 junto al rótulo de ensayo; el ensayo oral comienza en PDF107, encima de su comprensión escrita.',
 'En PDF108 la producción escrita de discurso precede a novela aunque el rótulo de novela ya aparece a la izquierda.',
 'Ocho conceptos de novela y cinco bloques de procedimientos omitidos por la extracción original se recuperaron de regiones visualmente cotejadas. Ver lengua-5-omisiones-extraccion.json. Sus identificadores reviewed-* son del inventario auditado, no de la base curricular.',
 'La nota de reseña limita la producción oral a preparar la escritura. No convierte una reseña escrita en exposición.',
 'Novela prioriza comprensión oral y escrita; no se exige crear ni conocer el desenlace de una novela completa para analizar un fragmento.',
 'El PDF escribe ponente entre actantes. Se conserva literalmente; la adaptación acepta oponente y contrasta el rol según la acción.',
 'La producción escrita de poesía continúa en PDF110 antes de entremés; la lectura de entremés continúa en PDF111 antes de su escritura.',
 '69 registros conceptuales representan 68 conceptos lógicos: Recursos estilísticos y figuras son una unidad dividida. Los 28 registros de procedimientos son 26 modalidades y dos continuaciones. Optativas separadas.'
 ],contracts},null,2)+'\n')
console.log({subtopics:contracts.length,proceduralRecords:groups.flat().length,modalities:26})
