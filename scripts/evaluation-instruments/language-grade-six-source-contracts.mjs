import fs from 'node:fs'
import assert from 'node:assert/strict'
const root='docs/curriculum/cobertura-secundaria/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'))
const scope=read(root+'inventario.json').scopes.find(s=>s.grade===6&&s.subject.startsWith('Lengua')&&s.character==='COMMON')
const ids=['informe-investigacion','reportaje','ensayo-argumentativo','discurso-graduacion','novela','poesia-social','monologo']
const bindings=[
 ['problem','feature-argument-types','feature-impersonal','feature-vocabulary','feature-connectors','feature-locutions','feature-modalizers','feature-adverbs','feature-sources','feature-citations','feature-organizers','feature-paratext'],
 ['context','context','feature-sequences','feature-impersonal','feature-subordinate','feature-sentences','feature-adjectives','feature-paratext'],
 ['thesis','thesis','feature-arguments','feature-counterarguments','feature-fallacies','feature-connectors'],
 ['thesis','feature-references','feature-deictics','feature-connectors','feature-courtesy','feature-register','feature-attitude','feature-sequences','feature-nonverbal'],
 ['plot','feature-sequences','feature-connectors','feature-spatial','feature-paratext','feature-discourse','feature-past','feature-adjectives','feature-narrator-types','characters','theme','feature-actants','feature-order'],
 ['meaning','feature-verse','feature-literary','feature-literary'],
 ['voice','feature-types','feature-strategies','feature-elements','feature-elements','feature-sequences','feature-adverbs'],
]
const contracts=scope.topics.flatMap((t,i)=>{assert.equal(t.subtopics.length,bindings[i].length);return t.subtopics.map((s,j)=>({id:`subtopic-${i+1}-${j+1}`,topic:ids[i],source:s,type:'ANALYSIS',description:`Analizarán ${t.title.replace(/\s+/g,' ').toLowerCase()} atendiendo a ${s.text.replace(/^•\s*/,'').replace(/\s+/g,' ')}. Usarán ejemplos del texto disponible.`,criterion:bindings[i][j],contains:'',absent:'No aporta evidencia suficiente'}))})
fs.writeFileSync('data/evaluation-instruments/language-grade-six-subtopic-contracts.json',JSON.stringify(contracts,null,2)+'\n')
const ranges=[[0,5],[6,10],[11,14],[15,20],[21,23],[24,27],[28,39]]
const groups=ranges.map(([a,b])=>Array.from({length:b-a+1},(_,i)=>scope.elements.PROCEDURE[a+i]))
const path=root+'lengua-6-cotejo-fuente.json'
if(fs.existsSync(path)&&read(path).status==='VERIFIED_DEFINED_FAMILIES'){assert.deepEqual(contracts,read(path).contracts);console.log({auditPreserved:true});process.exit(0)}
const review=read(root+'revision.json')
for(let i=0;i<scope.topics.length;i++){
 const entry={id:scope.topics[i].id,procedures:groups[i].map(p=>p.id),boundaryReview:'VISUALLY_REVIEWED_PDF_113_121',procedureAssociation:'VISUALLY_REVIEWED',implementation:'IN_PROGRESS',pending:'Cerrar contratos, HTTP y persistencia real de 6.º.'}
 const prior=review.topics.find(t=>t.id===entry.id);if(prior)Object.assign(prior,entry);else review.topics.push(entry)
}
fs.writeFileSync(root+'revision.json',JSON.stringify(review,null,2)+'\n')
fs.writeFileSync(path,JSON.stringify({grade:6,subject:'Lengua Española común',status:'IN_PROGRESS',pdfPages:[113,114,115,116,117,118,119,120,121],topics:scope.topics.map((t,i)=>({id:t.id,title:t.title,provider:ids[i],subtopics:t.subtopics,procedures:groups[i]})),notes:[
 'La comprensión y producción escrita del informe ocupan la parte superior de PDF114. El reportaje inicia después; su producción oral continúa al principio de PDF115.',
 'El ensayo ocupa el final de PDF115 y principio de PDF116. En el original falta el rótulo de comprensión escrita; el párrafo Realización de inferencias...ensayo que lee documenta esa modalidad. No se inventa un encabezado oficial.',
 'La nota del ensayo indica que la producción oral prepara comprensión/producción escrita; no exige exponer el ensayo escrito.',
 'El registro que comienza Empleo de expresiones en PDF117 contiene el final de producción oral de graduación y el encabezado y comienzo de comprensión escrita. Se conserva el registro y se documentan ambos bloques; no se cuenta como una sola modalidad.',
 'La escritura del discurso de graduación continúa en PDF118 antes del rótulo de novela. La nota reconoce escritura como estrategia para la oralización; el motor respeta la entrega escrita solicitada sin forzar una presentación.',
 'Novela prioriza comprensión oral y escrita. No exige crear una novela ni inferir un desenlace ausente del fragmento.',
 'En reportaje, el original dice subordinadas sustantivas (especificativas y explicativas). Se conserva literalmente; la adaptación evalúa la función de la proposición y el enlace sin convertir esa clasificación ambigua en una regla gramatical.',
 'La sección Comprensión escrita del monólogo repite indicaciones de escucha/puesta en escena del original. Se conserva y se distingue la adaptación de lectura, análisis y representación solicitada.',
 '59 conceptos y 40 registros de procedimientos (párrafos, encabezados y viñetas) corresponden a 26 modalidades; no a 40 tareas obligatorias. Optativas separadas.'
 ],contracts},null,2)+'\n')
console.log({subtopics:contracts.length,proceduralRecords:40,modalities:26})
