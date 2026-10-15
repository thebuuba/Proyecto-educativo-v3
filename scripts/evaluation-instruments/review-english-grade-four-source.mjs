import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {writeSecondaryInventory} from './secondary-inventory.mjs'
const root='docs/curriculum/cobertura-secundaria/'
const inventory=JSON.parse(readFileSync(root+'inventario.json','utf8'))
const scope=inventory.scopes.find(s=>s.id==='011167a1-54f7-5915-9d75-5168ec1b0a97')
assert.equal(scope.subject,'Inglés');assert.equal(scope.character,'COMMON');assert.equal(scope.grade,4)
assert.deepEqual(scope.pdfPages,[158,159,160,161,162])
const functions=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-four-contracts.json','utf8'))
const grammar=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-four-grammar-contracts.json','utf8'))
const lexicon=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-four-lexicon-contracts.json','utf8'))
const strategies=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-four-strategy-contracts.json','utf8'))
const genres=JSON.parse(readFileSync('data/evaluation-instruments/english-grade-four-genre-contracts.json','utf8'))
const headings={CONCEPT:[0,13,29],PROCEDURE:[0,9,14,21,28,36,41,45]}
const records=Object.entries(scope.elements).flatMap(([type,elements])=>elements.map((record,index)=>{
 let decision='PENDING_EVALUATIVE_CONNECTION',note='Fuente visualmente cotejada; conexión y verificación evaluativa propia de cuarto pendientes.',providers=[],verification='NOT_RUN'
 if(headings[type]?.includes(index)){decision='SOURCE_HEADING_NOT_SEPARATE_CRITERION';note='Encabezado organizativo, no una fila de calificación.'}
 else if(type==='CONCEPT'&&index>=1&&index<=12){decision='CONTEXT_ONLY_COMMUNICATIVE_TASK';note='Ámbito cotidiano, no criterio por su mención. Se requiere una acción comunicativa explícita; no exigir datos privados.'}
 else if(type==='PROCEDURE'&&index>=1&&index<=8){decision='CONNECTED_FUNCTION_CONTRACTS_GRADE_PARTIAL';providers=functions.filter(f=>f.sourceIndex===index).map(f=>`ing-4-${f.id}`);verification='english-grade-four.spec.ts';note='Evidencias funcionales de cuarto con progresiones propias, cuatro formatos y20/17.35. No implica cierre del grado.'}
 else if(type==='CONCEPT'&&grammar.some(f=>f.sourceIndices.includes(index))){decision='CONNECTED_GRAMMAR_CONTRACTS_GRADE_PARTIAL';providers=grammar.filter(f=>f.sourceIndices.includes(index)).map(f=>`ing-4-feature-${f.id}`);verification='english-grade-four-grammar.spec.ts';note='44 familias/115 formas y alias de cuarto: reconocimiento, explicación, uso, comparación e investigación. No heredar los modales ni las cláusulas de tercero ausentes aquí.'}
 else if(type==='CONCEPT'&&lexicon.some(f=>f.sourceIndex===index)){decision='CONNECTED_LEXICON_CONTRACTS_GRADE_PARTIAL';providers=lexicon.filter(f=>f.sourceIndex===index).map(f=>`ing-4-lexicon-${f.id}`);verification='english-grade-four-lexicon.spec.ts';note='Quince familias de vocabulario y quince intenciones de trece registros expresivos; separar interés/asombro y pedir/dar opiniones. No convertir el análisis de expresiones en otro producto comunicativo ni exigir experiencias privadas.'}
 else if(type==='PROCEDURE'&&index===43||type==='ATTITUDE_VALUE'&&[0,5,12].includes(index)){decision='EXCLUDED_PERSONAL_TRAIT_SCORE';note='Motivación, ansiedad, autocontrol y humildad como rasgo interno no se convierten en puntuaciones personales.'}
 else if(type==='PROCEDURE'&&strategies.some(f=>f.sourceIndex===index)){decision='CONNECTED_EXPLICIT_OBSERVABLE_STRATEGY';providers=[...new Set(strategies.filter(f=>f.sourceIndex===index).map(f=>`ing-4-strategy-${f.id}`))];verification='english-grade-four-strategies-genres.spec.ts';note='Estrategia observable solicitada, con modalidad y aspectos propios. Planificar oralmente no exige escritura; idea principal no exige detalles ausentes; no confundir reconocimiento de fórmulas con una acción de solicitarlas.'}
 else if(type==='PROCEDURE'&&genres.some(f=>f.sourceIndices.includes(index))){decision='CONNECTED_MODALITY_SCOPED_GENRES';providers=genres.filter(f=>f.sourceIndices.includes(index)).map(f=>`ing-4-genre-${f.id}`);verification='english-grade-four-strategies-genres.spec.ts';note='Listas cotejadas por modalidad: recepción oral12/escrita30, producción oral10/escrita14; audiovisual explícito. Respetar fuentes, productos y alternativas; no trasladar géneros entre listas.'}
 else if(type==='PROCEDURE'&&index===48){decision='CONNECTED_CULTURAL_COMPARISON_SCOPE_INTRODUCTION';providers=['ing-4-strategy-cultural-comparison'];verification='english-grade-four-strategies-genres.spec.ts';note='Introduce la comparación cultural de los siete aspectos siguientes; no es una fila adicional ni exige todos los aspectos a la vez.'}
 else if(type==='FUNDAMENTAL_COMPETENCY'){decision='ORGANIZATIONAL_COMPETENCY_NOT_SEPARATE_CRITERION';note='Organiza la competencia específica; no es una fila independiente.'}
 if(type==='CONCEPT'&&index===43)note+=' Contiene encabezado Gramática y múltiples contenidos reales: enunciativas, interrogativas, exclamativas y varios tiempos; no descartar como mero encabezado.'
 if(type==='CONCEPT'&&[45,46,47,49,50,51,52].includes(index))note+=' Registro compuesto: conservar cada forma, función o ejemplo con su origen.'
 if(type==='CONCEPT'&&index===48)note+=' Continúa el condicional con resultado futuro; distinguirlo del condicional de instrucciones del registro47.'
 return {...record,type,index,decision,note,providers,verification}
}))
assert.equal(records.length,162);assert.equal(new Set(records.map(r=>r.id)).size,162)
assert(records.filter(r=>r.decision.startsWith('CONNECTED')).every(r=>r.providers.length))
const validProviders=new Set([...functions.map(f=>`ing-4-${f.id}`),...grammar.map(f=>`ing-4-feature-${f.id}`),...lexicon.map(f=>`ing-4-lexicon-${f.id}`),...strategies.map(f=>`ing-4-strategy-${f.id}`),...genres.map(f=>`ing-4-genre-${f.id}`)])
assert(records.every(r=>r.providers.every(p=>validProviders.has(p))),'Proveedor inexistente')
const report={sourceSha256:inventory.source.sha256,scopeId:scope.id,grade:4,cycle:2,subject:'Inglés',character:'COMMON',pdfPages:scope.pdfPages,printedPages:[157,158,159,160,161],method:'Cinco páginas renderizadas y cotejadas visualmente, incluidas columnas y continuaciones.',layoutNotes:['PDF161 continúa gramática con las otras columnas vacías.','CONCEPT43 combina encabezado y contenidos; conservar todas sus formas.','Comprensión oral12 y escrita30 géneros; producción oral10 y escrita14. No trasladar una lista a todas las modalidades.','Doce ámbitos cotidianos,15 familias de vocabulario y13 expresivas; no copiar los de tercero.'],status:'PARTIAL_FUNCTIONS_GRAMMAR_NO_GRADE_CLOSURE',records}
writeFileSync(root+'ingles-4-cotejo-fuente.json',JSON.stringify(report,null,2)+'\n')
const review=JSON.parse(readFileSync(root+'revision.json','utf8'));assert.equal(review.sourceSha256,report.sourceSha256)
const status={implementation:'PARTIAL_FUNCTIONS_GRAMMAR',automatedVerification:'FUNCTION_GRAMMAR_DEFINED_CONTRACTS_ONLY',manualVerification:'SOURCE_162_RECORDS_VISUALLY_REVIEWED',boundaryReview:'VISUALLY_REVIEWED_PDF_158_162',procedureAssociation:'SOURCE_LEDGER_WITH_EXPLICIT_PENDING',report:'ingles-4-punto-de-avance.md',catalogVersion:'evaluation-2026.56_CODE_NOT_INSTALLED',engineConnection:'PARTIAL_COMMON_FOURTH_GRADE_PROVIDER',instrumentFormats:['rubrica','lista-cotejo','escala','lista-ponderada'],applicationVerification:'NOT_RUN',serviceVerification:'REPRODUCTION_55_GENERIC_BEFORE_INSTALL',interfaceVerification:'NOT_RUN',pending:'Conectar léxico/expresiones, estrategias, géneros, contexto/indicadores y composición; revisión integral, operaciones, HTTP y cuatro CRUD auténticos/snapshots. No iniciar quinto.'}
report.status='PARTIAL_DEFINED_CONTENT_CONTEXT_COMPOSITION_PENDING'
report.layoutNotes=report.layoutNotes.map(n=>n.replace('13 expresivas','13 registros expresivos/15 intenciones'))
writeFileSync(root+'ingles-4-cotejo-fuente.json',JSON.stringify(report,null,2)+'\n')
Object.assign(status,{implementation:'PARTIAL_FUNCTIONS_GRAMMAR_LEXICON_STRATEGIES_GENRES',automatedVerification:'DEFINED_CONTENT_CONTRACTS_CONTEXT_COMPOSITION_PENDING',pending:'Contenido definido conectado en código. Faltan contexto/indicadores, composición y revisión integral/operaciones/HTTP/cuatro CRUD auténticos/snapshots. No iniciar quinto.'})
review.scopes=[...(review.scopes??[]).filter(s=>s.id!==scope.id),{id:scope.id,...status}]
const concepts=scope.elements.CONCEPT
const layout={scopeId:scope.id,provenance:'PDF_COLUMNS_VISUALLY_REVIEWED',headingIds:[concepts[0].id],groups:[...concepts.slice(1,13).map(c=>({id:c.id,title:c.text.replace(/^•\s*/,''),memberIds:[]})),{id:concepts[13].id,title:'Vocabulario',memberIds:concepts.slice(14,29).map(c=>c.id)},{id:concepts[29].id,title:'Expresiones',memberIds:concepts.slice(30,43).map(c=>c.id)},{id:concepts[43].id,title:'Gramática: formas y usos',memberIds:concepts.slice(44).map(c=>c.id)}]}
review.topicLayouts=[...(review.topicLayouts??[]).filter(l=>l.scopeId!==scope.id),layout]
const old=new Set(scope.topics.map(t=>t.id));review.topics=review.topics.filter(t=>!old.has(t.id));for(const group of layout.groups)review.topics.push({id:group.id,...status})
writeFileSync(root+'revision.json',JSON.stringify(review,null,2)+'\n');writeSecondaryInventory()
console.log(JSON.stringify({scope:scope.id,records:records.length,groups:layout.groups.length,functions:functions.length,grammar:grammar.length,status:report.status}))
