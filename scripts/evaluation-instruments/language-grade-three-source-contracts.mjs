import fs from 'node:fs'
import assert from 'node:assert/strict'
const root='docs/curriculum/cobertura-secundaria/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'))
const inventory=read(root+'inventario.json'),scope=inventory.scopes.find(s=>s.grade===3&&s.subject.startsWith('Lengua')&&s.character==='COMMON')
const ids=['entrevista','cronica','catalogo','informe-experimento','articulo-opinion','cuento-social','madrigal']
const bindings=[
 ['questions','roles','feature-types','feature-interrogatives','feature-pronouns','feature-register','feature-abstract-nouns','feature-first-person'],
 ['sequence','facts','feature-temporal','feature-manner','feature-synonyms','feature-prepositions','feature-circumstances','feature-pronouns','feature-sentences'],
 ['organization','feature-paratext','feature-compound','feature-hyponyms','feature-latin','feature-adjectives','feature-gerund','feature-enumeration','feature-vocabulary','feature-graphics'],
 ['procedure','feature-impersonal','feature-periphrases','feature-temporal','feature-manner','feature-incidental','feature-vocabulary','feature-compound','feature-graphics','procedure-organizer'],
 ['organization','thesis','feature-argument-types','feature-modalizers','feature-argument-connectors','feature-rhetorical','procedure-underlining'],
 ['conflict','feature-types','characters','narrator','narrator','feature-actants','feature-literary','feature-dialogue','feature-indicative','feature-adverbs','feature-connectors','feature-variants'],
 ['meaning','verse','rhyme','feature-literary','feature-vocabulary'],
]
const contracts=scope.topics.flatMap((t,i)=>{assert.equal(t.subtopics.length,bindings[i].length);return t.subtopics.map((s,j)=>({id:`subtopic-${i+1}-${j+1}`,topic:ids[i],source:s,type:'ANALYSIS',description:`Analizarán ${t.title.replace(/\s+/g,' ').toLowerCase()} atendiendo a ${s.text.replace(/^•\s*/,'').replace(/\s+/g,' ')}. Usarán ejemplos del texto disponible.`,criterion:bindings[i][j],contains:'',absent:'No aporta evidencia suficiente'}))})
fs.writeFileSync('data/evaluation-instruments/language-grade-three-subtopic-contracts.json',JSON.stringify(contracts,null,2)+'\n')
// Visually checked: interview continues at the top of PDF83; story writing begins PDF87.
const groups=[[0,1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14],[15,16,17,18],[19,20,21,22],[23,24,25,26]]
const review=read(root+'revision.json')
// Regenerating fixtures must not erase a completed audit or its browser evidence.
const checkedPath=root+'lengua-3-cotejo-fuente.json'
if(fs.existsSync(checkedPath)&&read(checkedPath).status==='VERIFIED_DEFINED_FAMILIES') {
 const checked=read(checkedPath)
 assert.deepEqual(contracts,checked.contracts,'Changed source requires a new explicit coverage review')
 assert.deepEqual(groups.map(group=>group.map(n=>scope.elements.PROCEDURE[n].id)),checked.topics.map(t=>t.procedures.map(p=>p.id)))
 console.log({subtopics:contracts.length,proceduralRecords:groups.flat().length,auditPreserved:true})
 process.exit(0)
}
for(let i=0;i<scope.topics.length;i++) {
 const entry={id:scope.topics[i].id,procedures:groups[i].map(n=>scope.elements.PROCEDURE[n].id),boundaryReview:'VISUALLY_REVIEWED_PDF_82_88',procedureAssociation:'VISUALLY_REVIEWED',implementation:'IN_PROGRESS',pending:'Proveedores en implementación; faltan verificación completa de familias, servicio y persistencia real de 3.º.'}
 const prior=review.topics.find(t=>t.id===entry.id);if(prior)Object.assign(prior,entry);else review.topics.push(entry)
}
fs.writeFileSync(root+'revision.json',JSON.stringify(review,null,2)+'\n')
fs.writeFileSync(root+'lengua-3-cotejo-fuente.json',JSON.stringify({grade:3,subject:'Lengua Española común',status:'IN_PROGRESS',pdfPages:[82,83,84,85,86,87,88],topics:scope.topics.map((t,i)=>({id:t.id,title:t.title,provider:ids[i],subtopics:t.subtopics,procedures:groups[i].map(n=>scope.elements.PROCEDURE[n])})),notes:['La continuación de producción escrita de entrevista en PDF83 no pertenece a crónica.','La producción escrita de cuento continúa en PDF87 antes de madrigal.','El informe de experimento integra oralidad en comprensión/producción escrita según la nota oficial: no hay bloques orales independientes.','En madrigal, el concepto endecasílabo se amplía con versos de siete y once sílabas en los procedimientos.','La fila de producción escrita de catálogo repite operaciones de lectura: se conservan como fuente, sin convertir comprensión en creación.'],contracts},null,2)+'\n')
console.log({subtopics:contracts.length,proceduralRecords:groups.flat().length})
