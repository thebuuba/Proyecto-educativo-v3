import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {writeSecondaryInventory} from './secondary-inventory.mjs'
const root='docs/curriculum/cobertura-secundaria/'
const inventory=JSON.parse(readFileSync(root+'inventario.json','utf8'))
const scope=inventory.scopes.find(s=>s.id==='7e4c1236-8f04-5817-b017-a9ace9edff5e')
assert.equal(scope.subject,'Inglés');assert.equal(scope.character,'COMMON');assert.equal(scope.grade,2)
assert.deepEqual(scope.pdfPages,[140,141,142,143,144,145])
const functions=['conversation','daily','states','help','shopping','wishes','advice','plans','experience']
const grammar={
 57:['present-simple'],58:['present-simple'],59:['present-simple'],60:['present-simple'],61:['past-simple'],62:['past-continuous'],63:['present-perfect'],64:['past-continuous','past-simple'],65:['will'],66:['going-to'],67:['present-continuous'],68:['there-past'],69:['imperative'],70:['lets'],71:['wishes'],72:['permission'],73:['should'],74:['conditional'],75:['question-tags'],76:['passive'],77:['exclamation'],78:['possessive-s'],79:['countability'],80:['gender'],81:['number','articles','comparative'],82:['present-participle'],83:['past-participle'],84:['interrogative-pronouns'],85:['how-much-many'],86:['why-suggestion'],87:['object-pronouns','possessive-pronouns','reflexive-pronouns'],88:['time-adverbs','frequency-adverbs','quantity-adverbs'],89:['quantity-adverbs','degree-adverbs'],90:['time-prepositions','duration-prepositions'],91:['coordination-connectors','time-connectors','sequence-connectors','cause-connectors'],
}
const headings={CONCEPT:[0,14,20,42],PROCEDURE:[0,10,14,21,26,32,37,41,43]}
const records=Object.entries(scope.elements).flatMap(([type,elements])=>elements.map((record,index)=>{
 let decision='PENDING_EVALUATIVE_CONNECTION',note='Fuente cotejada; falta conectar y verificar la evidencia evaluativa propia de segundo.',providers=[],verification='NOT_RUN'
 if(headings[type]?.includes(index)||type==='FUNDAMENTAL_COMPETENCY'){
  decision='SOURCE_HEADING_NOT_A_SEPARATE_CRITERION';note='Encabezado de organización; no convertirlo en un criterio independiente.'
 }else if(type==='PROCEDURE'&&index>=1&&index<=9){
  decision='CONNECTED_FUNCTION_DEFINED_CONTRACTS';providers=[`ing-2-${functions[index-1]}`];verification='FUNCTION_CONTRACTS_BACKEND_AND_FRONTEND'
  note='Función propia del grado: nueve consignas representativas, cuatro formatos,20/17.35 y alternativa local; no equivale al cierre integral del grado.'
 }else if(type==='CONCEPT'&&grammar[index]){
  decision='CONNECTED_PENDING_EXHAUSTIVE_REVIEW';providers=grammar[index].map(id=>`ing-2-feature-${id}`)
  note='Requisitos gramaticales presentes en segundo; autoría conectada. Pendientes contratos de todas las formas, usos específicos, variaciones y revisión de pertinencia.'
 }else if(type==='CONCEPT'&&index===44){
  decision='CONTINUATION_NOT_NEW_FAMILY';note='You’re welcome continúa las fórmulas de cortesía de la fila anterior; no constituye una nueva familia.'
 }else if(type==='PROCEDURE'&&index===20){
  decision='AMBIGUOUS_SOURCE_PENDING';note='La fuente visible dice «Identificación de que se comprensión oral». No corregir ni inventar silenciosamente una habilidad; cubrir por separado intención/situación cuando se soliciten.'
 }else if(type==='PROCEDURE'&&index===39||type==='ATTITUDE_VALUE'&&[0,6,12,13,16].includes(index)){
  decision='EXCLUDED_PERSONAL_TRAIT_SCORE';note='Motivación, ansiedad, autocontrol, humildad, identidad familiar o flexibilidad interna no son criterios de personalidad. Solo una acción comunicativa explícita y observable podrá evaluarse por otra familia.'
 }else if(type==='ATTITUDE_VALUE'){
  note='Pendiente traducción condicional a evidencia comunicativa observable; no calificar posesiones, salud, rasgos, privacidad ni hábitos reales. Las condiciones de compra/ayuda deben provenir de la tarea.'
 }
 if(type==='CONCEPT'&&index===41)note+=' Registro compuesto: tecnología y vías; separar ambas familias léxicas.'
 if(type==='CONCEPT'&&index===56)note+=' Expresiones de deseos y esperanzas con encabezado Gramática incrustado; separar etiqueta del contenido.'
 if(type==='CONCEPT'&&[81,87,88,89,90,91].includes(index))note+=' Registro compuesto o continuación: conservar cada estructura y su función; no contarlo como un único objetivo.'
 return {...record,type,index,decision,note,providers,verification}
}))
assert.equal(records.length,196);assert.equal(new Set(records.map(r=>r.id)).size,196)
const report={sourceSha256:inventory.source.sha256,scopeId:scope.id,subject:'Inglés',character:'COMMON',cycle:1,grade:2,pdfPages:scope.pdfPages,printedPages:[139,140,141,142,143,144],method:'Seis páginas renderizadas y revisadas visualmente: columnas, encabezados y continuaciones.',layoutNotes:['PDF143–144: continuaciones de gramática en la columna izquierda; columnas procedimental/actitudinal vacías.','Los temas cotidianos son ámbitos de comunicación; no generan filas por mencionar su nombre.','Géneros de recepción y producción tienen listas diferentes; no trasladar todos los productos de recepción a producción.'],status:'PARTIAL_NO_GRADE_CLOSURE',records}
writeFileSync(root+'ingles-2-cotejo-fuente.json',JSON.stringify(report,null,2)+'\n')
const review=JSON.parse(readFileSync(root+'revision.json','utf8'))
assert.equal(review.sourceSha256,report.sourceSha256)
const status={implementation:'PARTIAL_FUNCTIONS_ONLY',automatedVerification:'FUNCTION_CONTRACTS_AND_ROW_OPERATIONS_ONLY',manualVerification:'SOURCE_196_RECORDS_VISUALLY_REVIEWED',applicationVerification:'FOUR_FUNCTION_EXAMPLES_ONLY_SCOPE_PARTIAL',boundaryReview:'VISUALLY_REVIEWED_PDF_140_145',procedureAssociation:'SOURCE_LEDGER_WITH_EXPLICIT_PENDING',report:'ingles-2-punto-de-avance.md',catalogVersion:'evaluation-2026.48',engineConnection:'PARTIAL_COMMON_ENGLISH_FUNCTION_PROVIDER',instrumentFormats:['rubrica','lista-cotejo','escala','lista-ponderada'],serviceVerification:'FUNCTIONS_LOCAL_AUTHENTICATED_HTTP_ONLY_SCOPE_PARTIAL',interfaceVerification:'FOUR_FUNCTION_EXAMPLES_SAVED_REOPENED_SCOPE_PARTIAL',pending:'Segundo parcial: completar gramática, léxico, expresiones, estrategias, géneros/contexto y composición; contratos exhaustivos, revisión de todas las familias, operaciones de filas y cierre integral. HTTP/Chrome aprobados únicamente para ejemplos de funciones; no comenzar tercero.'}
review.scopes=[...(review.scopes??[]).filter(s=>s.id!==scope.id),{id:scope.id,...status}]
for(const topic of scope.topics){const prior=review.topics.find(t=>t.id===topic.id);if(prior)Object.assign(prior,status);else review.topics.push({id:topic.id,...status})}
writeFileSync(root+'revision.json',JSON.stringify(review,null,2)+'\n')
writeSecondaryInventory()
console.log(JSON.stringify({scope:scope.id,records:records.length,functionRecords:9,grammarFamilies:new Set(Object.values(grammar).flat()).size,status:report.status}))
