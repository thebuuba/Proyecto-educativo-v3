import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {writeSecondaryInventory} from './secondary-inventory.mjs'
const root='docs/curriculum/cobertura-secundaria/'
const inventory=JSON.parse(readFileSync(root+'inventario.json','utf8'))
const scope=inventory.scopes.find(s=>s.id==='cc482480-0f08-5657-98aa-1afd28ecfa1a')
assert.equal(scope.subject,'Inglés');assert.equal(scope.character,'COMMON');assert.equal(scope.grade,3)
assert.deepEqual(scope.pdfPages,[146,147,148,149,150,151])
const functions=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-three-contracts.json','utf8'))
const grammar=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-three-grammar-contracts.json','utf8'))
const lexicon=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-three-lexicon-contracts.json','utf8'))
const headings={CONCEPT:[0,13,33,36,54],PROCEDURE:[0,9,13,20,25,32,37,41,43]}
const records=Object.entries(scope.elements).flatMap(([type,elements])=>elements.map((record,index)=>{
 let decision='PENDING_EVALUATIVE_CONNECTION',note='Fuente visualmente cotejada; conexión y verificación evaluativa propias de tercero pendientes.',providers=[],verification='NOT_RUN'
 if(headings[type]?.includes(index)){decision='SOURCE_HEADING_NOT_SEPARATE_CRITERION';note='Encabezado de organización; no convertirlo en una fila independiente.'}
 else if(type==='PROCEDURE'&&index>=1&&index<=8){decision='CONNECTED_FUNCTION_CONTRACTS_GRADE_PARTIAL';providers=functions.filter(f=>f.sourceIndex===index).map(f=>`ing-3-${f.id}`);verification='english-grade-three.spec.ts';note='Función de tercero con contenido propio, cuatro formatos y20/17.35; falta cierre integral del grado.'}
 else if(type==='CONCEPT'&&index===40){decision='CONTINUATION_NOT_NEW_FAMILY';providers=grammar.filter(f=>f.sourceIndices.includes(40)).map(f=>`ing-3-feature-${f.id}`);verification='GRAMMAR_MODAL_CONTRACTS';note='Ejemplos continuados de los modales del registro39, no una nueva lista de estructuras.'}
 else if(type==='CONCEPT'&&grammar.some(f=>f.sourceIndices.includes(index))){decision='CONNECTED_GRAMMAR_DEFINED_CONTRACTS_GRADE_PARTIAL';providers=grammar.filter(f=>f.sourceIndices.includes(index)).map(f=>`ing-3-feature-${f.id}`);verification='english-grade-three-grammar.spec.ts';note='Requisitos gramaticales de tercero; reconocimiento, explicación y uso,52 familias/105 formas, cuatro formatos,20/17.35. No implica cobertura de los otros componentes.'}
 else if(type==='CONCEPT'&&lexicon.some(f=>f.sourceIndex===index)){decision='CONNECTED_LEXICON_DEFINED_CONTRACTS_GRADE_PARTIAL';providers=lexicon.filter(f=>f.sourceIndex===index).map(f=>`ing-3-lexicon-${f.id}`);verification='english-grade-three-lexicon.spec.ts';note='Diecinueve familias léxicas y cinco intenciones expresivas de tercero; reconocimiento, explicación y uso. No exigir información privada ni trasladar dinero/medicamentos/tallas de segundo.'}
 else if(type==='PROCEDURE'&&index===39||type==='ATTITUDE_VALUE'&&[0,3].includes(index)){decision='EXCLUDED_PERSONAL_TRAIT_SCORE';note='Motivación, ansiedad, dominio propio y autocontrol no se convierten en puntuaciones de personalidad.'}
 if(type==='CONCEPT'&&index===35)note+=' Registro compuesto: acuerdo/desacuerdo, reacción, solicitud de explicaciones y advertencia; separar las cuatro intenciones expresivas.'
 if(type==='CONCEPT'&&[38,39,41,50,52,53,55,59,60].includes(index))note+=' Registro compuesto: mantener cada forma/función y su fuente, sin reducirlo a una sola estructura.'
 if(type==='CONCEPT'&&index===57)note+=' Ejemplo que continúa los conectores de coordinación, no encabezado temático nuevo.'
 if(type==='PROCEDURE'&&index===8)note+=' Registro compuesto: anuncios/noticias y comparación pasado/presente son funciones diferentes.'
 if(type==='PROCEDURE'&&index===19)note+=' La fuente de tercero sí dice «Indicación de que se comprende»; no heredar la exclusión del fragmento indeterminado de segundo.'
 return {...record,type,index,decision,note,providers,verification}
}))
assert.equal(records.length,158);assert.equal(new Set(records.map(r=>r.id)).size,158)
const report={sourceSha256:inventory.source.sha256,scopeId:scope.id,subject:'Inglés',character:'COMMON',cycle:1,grade:3,pdfPages:scope.pdfPages,printedPages:[145,146,147,148,149,150],method:'Seis páginas renderizadas y cotejadas visualmente, incluidas continuaciones y columnas vacías.',layoutNotes:['PDF149–150 continúan gramática; columnas procedimental y actitudinal vacías.','Doce ámbitos cotidianos: el último une actividades sociales/culturales con viajes/turismo; no copiar los trece de segundo.','Vocabulario19 familias; expresiones5 intenciones, cuatro comprimidas en un registro.','Gramática52 familias en registros compuestos; coordinación y contraste tienen continuaciones de ejemplos.','Recepción28 géneros, producción oral8 y escrita11; listas distintas.'],status:'PARTIAL_FUNCTIONS_GRAMMAR_LEXICON_NO_GRADE_CLOSURE',records}
writeFileSync(root+'ingles-3-cotejo-fuente.json',JSON.stringify(report,null,2)+'\n')
const review=JSON.parse(readFileSync(root+'revision.json','utf8'))
assert.equal(review.sourceSha256,report.sourceSha256)
const status={implementation:'PARTIAL_FUNCTIONS_GRAMMAR_LEXICON',automatedVerification:'FUNCTIONS_GRAMMAR_LEXICON_DEFINED_CONTRACTS_ONLY',manualVerification:'SOURCE_158_RECORDS_VISUALLY_REVIEWED',applicationVerification:'NOT_RUN',boundaryReview:'VISUALLY_REVIEWED_PDF_146_151',procedureAssociation:'SOURCE_LEDGER_WITH_EXPLICIT_PENDING',report:'ingles-3-punto-de-avance.md',catalogVersion:'evaluation-2026.54_CODE_NOT_INSTALLED',engineConnection:'PARTIAL_COMMON_THIRD_GRADE_PROVIDER',instrumentFormats:['rubrica','lista-cotejo','escala','lista-ponderada'],serviceVerification:'NOT_RUN',interfaceVerification:'NOT_RUN',pending:'Tercero parcial: conectar estrategias, géneros, contexto y composición; revisión integral, operaciones y CRUD autenticados/snapshots. No iniciar cuarto.'}
review.scopes=[...(review.scopes??[]).filter(s=>s.id!==scope.id),{id:scope.id,...status}]
const concepts=scope.elements.CONCEPT
const layout={scopeId:scope.id,provenance:'PDF_COLUMNS_VISUALLY_REVIEWED',headingIds:[concepts[0].id],groups:[
 ...concepts.slice(1,13).map(c=>({id:c.id,title:c.text.replace(/^•\s*/,''),memberIds:[]})),
 {id:concepts[13].id,title:'Vocabulario',memberIds:concepts.slice(14,33).map(c=>c.id)},
 {id:concepts[33].id,title:'Expresiones',memberIds:concepts.slice(34,36).map(c=>c.id)},
 {id:concepts[36].id,title:'Gramática: formas y usos',memberIds:concepts.slice(37).map(c=>c.id)},
]}
review.topicLayouts=[...(review.topicLayouts??[]).filter(l=>l.scopeId!==scope.id),layout]
const old=new Set(scope.topics.map(t=>t.id));review.topics=review.topics.filter(t=>!old.has(t.id))
for(const group of layout.groups)review.topics.push({id:group.id,...status})
writeFileSync(root+'revision.json',JSON.stringify(review,null,2)+'\n')
writeSecondaryInventory()
console.log(JSON.stringify({scope:scope.id,records:records.length,groups:layout.groups.length,functions:functions.length,grammar:grammar.length,status:report.status}))
