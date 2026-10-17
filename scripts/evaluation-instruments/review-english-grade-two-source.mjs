import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {writeSecondaryInventory} from './secondary-inventory.mjs'
const root='docs/curriculum/cobertura-secundaria/'
const inventory=JSON.parse(readFileSync(root+'inventario.json','utf8'))
const scope=inventory.scopes.find(s=>s.id==='7e4c1236-8f04-5817-b017-a9ace9edff5e')
assert.equal(scope.subject,'Inglés');assert.equal(scope.character,'COMMON');assert.equal(scope.grade,2)
assert.deepEqual(scope.pdfPages,[140,141,142,143,144,145])
const functions=['conversation','daily','states','help','shopping','wishes','advice','plans','experience']
const fixtures=Object.fromEntries(['grammar','lexicon','strategy','genre','context'].map(name=>[name,JSON.parse(readFileSync(`data/evaluation-instruments/english-grade-two-${name}-contracts.json`,'utf8'))]))
const connections=(family,index)=>fixtures[family].filter(f=>(f.sourceIndices??[f.sourceIndex]).includes(index)).map(f=>`ing-2-${{grammar:'feature',lexicon:'lexicon',strategy:'strategy',genre:'genre',context:'context'}[family]}-${f.id}`)
const domains=[[],['conversation','states','help'],['daily'],['lexicon-places','lexicon-roads'],['lexicon-subjects','lexicon-education'],['lexicon-leisure','lexicon-sports'],['lexicon-food'],['states','lexicon-ailments','lexicon-medicines','context-care'],['lexicon-technology','help','advice'],['strategy-dictionary','strategy-revision'],['lexicon-weather-words','context-care'],['shopping','context-purchase-choice'],['strategy-cultural-comparison'],['lexicon-transport','plans']]
const frameworks=[functions,['interaction','written','intelligibility','feature-sequence-connectors'],['help','advice','interaction'],['context-courtesy','context-respect-differences','strategy-cultural-comparison'],['help','advice','lexicon-technology'],['context-care','daily','shopping','states'],['context-courtesy','context-faithful-information','context-respect-differences']]
const indicators=[
 [...functions,'genre-message'],['written','intelligibility','feature-coordination-connectors'],['interaction','written','intelligibility'],['experience','plans','feature-time-connectors','strategy-inference'],['written','intelligibility','feature-sequence-connectors','strategy-planning'],['interaction','experience','plans','advice'],['help','advice','genre-message'],['advice','written','intelligibility'],['help','advice','daily','states','interaction'],['strategy-cultural-comparison','context-respect-differences'],['context-courtesy','interaction'],['conversation','strategy-social-formulas','context-respect-differences'],['lexicon-technology','genre-message','context-faithful-information'],['advice','states','wishes','experience','lexicon-technology'],['advice','interaction','context-ethical-ict','lexicon-technology'],['context-care'],['context-care','advice','plans'],['context-care','interaction'],['context-empathetic-response'],['help','interaction'],['context-courtesy','context-respect-differences'],
]
const grammar={
 57:['present-simple'],58:['present-simple'],59:['present-simple'],60:['present-simple'],61:['past-simple'],62:['past-continuous'],63:['present-perfect'],64:['past-continuous','past-simple'],65:['will'],66:['going-to'],67:['present-continuous'],68:['there-past'],69:['imperative'],70:['lets'],71:['wishes'],72:['permission'],73:['should'],74:['conditional'],75:['question-tags'],76:['passive'],77:['exclamation'],78:['possessive-s'],79:['countability'],80:['gender'],81:['number','articles','comparative'],82:['present-participle'],83:['past-participle'],84:['interrogative-pronouns'],85:['how-much-many'],86:['why-suggestion'],87:['object-pronouns','possessive-pronouns','reflexive-pronouns'],88:['time-adverbs','frequency-adverbs','quantity-adverbs'],89:['quantity-adverbs','degree-adverbs'],90:['time-prepositions','duration-prepositions'],91:['coordination-connectors','time-connectors','sequence-connectors','cause-connectors'],
}
const headings={CONCEPT:[0,14,20,42],PROCEDURE:[0,10,14,21,26,32,37,41,43]}
const records=Object.entries(scope.elements).flatMap(([type,elements])=>elements.map((record,index)=>{
 let decision='PENDING_EVALUATIVE_CONNECTION',note='Fuente cotejada; falta conectar y verificar la evidencia evaluativa propia de segundo.',providers=[],verification='NOT_RUN'
 if(headings[type]?.includes(index)){
  decision='SOURCE_HEADING_NOT_A_SEPARATE_CRITERION';note='Encabezado de organización; no convertirlo en un criterio independiente.'
 }else if(type==='FUNDAMENTAL_COMPETENCY'||type==='SPECIFIC_COMPETENCY'){
  decision='CONNECTED_CONDITIONAL_COMPETENCY_FRAMEWORK';providers=frameworks[index].map(id=>`ing-2-${id}`);verification='FUNCTION_GRAMMAR_CONTEXT_COMPOSITION_CONTRACTS'
  note='Marco de desempeño concretado por la función, acción, producto y requisitos de la consigna. No es una fila fija adicional ni una calificación de identidad, creatividad interna, personalidad o hábitos reales.'
 }else if(type==='PROCEDURE'&&index>=1&&index<=9){
  decision='CONNECTED_FUNCTION_DEFINED_CONTRACTS';providers=[`ing-2-${functions[index-1]}`];verification='FUNCTION_CONTRACTS_BACKEND_AND_FRONTEND'
  note='Función propia del grado; contratos con cuatro formatos,20/17.35 y alternativa local. La acción determina recepción, producción o interacción; no se exige información privada.'
 }else if(type==='CONCEPT'&&grammar[index]){
  decision='CONNECTED_EXPLICIT_GRAMMAR_REQUIREMENT';providers=connections('grammar',index);verification='english-grade-two-grammar.spec.ts_AND_englishGradeTwoFullContract.spec.ts'
  note='Formas, sinónimos y usos propios de segundo comprobados en reconocimiento, explicación y uso; cuatro formatos y20/17.35. No imponer todas las variantes ni activar palabras ambiguas fuera de un requisito gramatical.'
 }else if(type==='CONCEPT'&&index>=1&&index<=13){
  decision='CONNECTED_CONDITIONAL_COMMUNICATION_DOMAIN';providers=domains[index].map(id=>`ing-2-${id}`);verification='FUNCTION_LEXICON_CONTEXT_STRATEGY_CONTRACTS'
  note='Ámbito cotidiano de comunicación, no una fila por mencionar un tema. Evaluación conectada mediante funciones, léxico o condiciones explícitas; no inventar una disciplina académica especializada ni requisitos privados.'
 }else if(type==='CONCEPT'&&connections('lexicon',index).length){
  decision='CONNECTED_EXPLICIT_LEXICON_OR_EXPRESSION';providers=connections('lexicon',index);verification='english-grade-two-lexicon.spec.ts_AND_englishGradeTwoFullContract.spec.ts'
  note='Vocabulario o intención expresiva de segundo; recepción y uso contextualizados, cuatro formatos,20/17.35, negaciones y aislamiento respecto de primero.'
 }else if(type==='CONCEPT'&&index===44){
  decision='CONTINUATION_NOT_NEW_FAMILY';providers=connections('lexicon',43);verification='LEXICON_COURTESY_CONTRACTS';note='You’re welcome continúa las fórmulas de cortesía de la fila anterior; no constituye una nueva familia.'
 }else if(type==='PROCEDURE'&&index===20){
  decision='EXCLUDED_UNINTERPRETABLE_SOURCE_FRAGMENT';note='La fuente visible dice «Identificación de que se comprensión oral». No se afirma haber implementado su significado indeterminado ni se hereda el sustituto de primero. Intención y situación se cubren por sus registros explícitos. Limitación de la fuente conservada; requeriría una fe de erratas oficial para atribuirle otra habilidad.'
 }else if(type==='PROCEDURE'&&index===39||type==='ATTITUDE_VALUE'&&[0,6,12,13,16].includes(index)){
  decision='EXCLUDED_PERSONAL_TRAIT_SCORE';note='Motivación, ansiedad, autocontrol, humildad, identidad familiar o flexibilidad interna no son criterios de personalidad. Solo una acción comunicativa explícita y observable podrá evaluarse por otra familia.'
 }else if(type==='PROCEDURE'&&connections('strategy',index).length){
  decision='CONNECTED_EXPLICIT_OBSERVABLE_STRATEGY';providers=connections('strategy',index);verification='english-grade-two-strategies.spec.ts_AND_englishGradeTwoFullContract.spec.ts'
  note='Procedimiento observable solo cuando se solicita; respetar modalidad y aspectos culturales explícitos. La revisión de significado y corrección no se elimina por su redacción.'
 }else if(type==='PROCEDURE'&&connections('genre',index).length){
  decision='CONNECTED_MODALITY_SCOPED_GENRES';providers=connections('genre',index);verification='english-grade-two-genres.spec.ts_AND_englishGradeTwoFullContract.spec.ts'
  note='Recepción28, producción oral8 y escrita11: respetar la lista de cada modalidad. No convertir fuentes de apoyo en productos, ni sumar correo/carta alternativos, ni duplicar acontecimientos de experiencia/narración.'
 }else if(type==='ATTITUDE_VALUE'){
  decision='CONNECTED_CONDITIONAL_OBSERVABLE_COMMUNICATION';providers=index===17?['ing-2-help']:connections('context',index);verification='english-grade-two-context.spec.ts_AND_FUNCTION_HELP_CONTRACTS'
  note='Condición explícita de un mensaje, personaje o situación ficticia/proporcionada. No puntuar creencias, empatía interna, salud, posesiones, privacidad ni hábitos reales; los compromisos, precios y restricciones deben venir de la consigna.'
 }else if(type==='ACHIEVEMENT_INDICATOR'){
  decision='CONNECTED_CONDITIONAL_ACHIEVEMENT_EVIDENCE';providers=indicators[index].map(id=>`ing-2-${id}`);verification='FUNCTION_GRAMMAR_LEXICON_STRATEGY_GENRE_CONTEXT_COMPOSITION_CONTRACTS'
  note='Indicador de logro concretado por evidencias comunicativas solicitadas. No añadir filas genéricas ni puntuar disposiciones internas. Ciencia/tecnología son contexto del inglés básico; la información debe venir del texto o situación, sin exigir conocimientos especializados no pedidos.'
 }
 if(type==='CONCEPT'&&index===41)note+=' Registro compuesto: tecnología y vías; separar ambas familias léxicas.'
 if(type==='CONCEPT'&&index===56)note+=' Expresiones de deseos y esperanzas con encabezado Gramática incrustado; separar etiqueta del contenido.'
 if(type==='CONCEPT'&&[81,87,88,89,90,91].includes(index))note+=' Registro compuesto o continuación: conservar cada estructura y su función; no contarlo como un único objetivo.'
 return {...record,type,index,decision,note,providers,verification}
}))
assert.equal(records.length,196);assert.equal(new Set(records.map(r=>r.id)).size,196)
assert(!records.some(r=>r.decision==='PENDING_EVALUATIVE_CONNECTION'),'Un registro conocido sigue sin decisión')
assert(records.filter(r=>r.decision.startsWith('CONNECTED')).every(r=>r.providers.length),'Falta proveedor de una conexión')
const validProviders=new Set([...functions,'written','intelligibility','interaction','research'].map(id=>`ing-2-${id}`))
for(const family of Object.keys(fixtures))for(const f of fixtures[family])validProviders.add(`ing-2-${{grammar:'feature',lexicon:'lexicon',strategy:'strategy',genre:'genre',context:'context'}[family]}-${f.id}`)
assert(records.every(r=>r.providers.every(provider=>validProviders.has(provider))),'Referencia a proveedor inexistente')
const closed=process.argv.includes('--close')
if(closed){
 const http=JSON.parse(readFileSync(root+'evidencias/ingles-2-integral-servicio.json','utf8'))
 assert.equal(http.health.development.catalogVersion,'evaluation-2026.53');assert.equal(http.results.length,158)
 const ui=JSON.parse(readFileSync(root+'evidencias/ingles-2-final-flujo-navegador.json','utf8'))
 const persisted=JSON.parse(readFileSync(root+'evidencias/ingles-2-final-persistencia.json','utf8'))
 assert.equal(new Set(ui.map(a=>a.format)).size,4);assert(ui.every(a=>a.reopened&&a.savedHash))
 assert.equal(persisted.activities.length,4)
}
const report={sourceSha256:inventory.source.sha256,scopeId:scope.id,subject:'Inglés',character:'COMMON',cycle:1,grade:2,pdfPages:scope.pdfPages,printedPages:[139,140,141,142,143,144],method:'Seis páginas renderizadas y revisadas visualmente: columnas, encabezados y continuaciones.',layoutNotes:['PDF143–144: continuaciones de gramática en la columna izquierda; columnas procedimental/actitudinal vacías.','Los temas cotidianos son ámbitos de comunicación; no generan filas por mencionar su nombre.','Géneros de recepción y producción tienen listas diferentes; no trasladar todos los productos de recepción a producción.'],limitations:['Un fragmento oficial ininterpretable excluido expresamente; no se afirma resolverlo.','Cobertura de familias y patrones definidos; no de cualquier redacción imaginable.','Audiovisual procede de una consigna explícita, no de una lista curricular inventada.'],status:closed?'VERIFIED_DEFINED_FAMILIES_WITH_DOCUMENTED_SOURCE_EXCLUSION':'CONNECTED_DEFINED_FAMILIES_FINAL_REVIEW_PENDING',records}
writeFileSync(root+'ingles-2-cotejo-fuente.json',JSON.stringify(report,null,2)+'\n')
const review=JSON.parse(readFileSync(root+'revision.json','utf8'))
assert.equal(review.sourceSha256,report.sourceSha256)
const status={implementation:closed?'VERIFIED_DEFINED_FAMILIES':'PARTIAL_FINAL_REVIEW',automatedVerification:'DEFINED_FAMILIES_FOUR_FORMATS_TOTALS_PENDING_ROW_OPERATIONS_PARITY',manualVerification:'SOURCE_196_RECORDS_VISUALLY_REVIEWED_ONE_UNINTERPRETABLE_FRAGMENT_EXCLUDED',applicationVerification:closed?'FOUR_EVERYDAY_INSTRUMENTS_EDITED_SAVED_REOPENED_SNAPSHOTS_CHECKED':'FINAL_FOUR_FORMAT_PERSISTENCE_PENDING',boundaryReview:'VISUALLY_REVIEWED_PDF_140_145',procedureAssociation:'SOURCE_LEDGER_CONDITIONAL_PROVIDERS_EXPLICIT_EXCLUSIONS',report:'ingles-2-informe-final.md',catalogVersion:'evaluation-2026.53',engineConnection:'COMMON_ENGLISH_SECOND_GRADE_SCOPED_PROVIDERS',instrumentFormats:['rubrica','lista-cotejo','escala','lista-ponderada'],serviceVerification:closed?'158_DEFINED_CASES_HTTP_FORMAT_ROTATION_SELECTION_CAPACITY':'LATEST_HTTP_PENDING',interfaceVerification:closed?'FOUR_AUTHENTICATED_CHROME_CRUD_FIELDS_IDENTITIES_POINTS_CHECKED':'FINAL_REVIEW_PENDING',pending:closed?'Sin pendientes de implementación de las familias definidas. Limitación: fragmento oficial PROCEDURE20 ininterpretable excluido, sin inventar significado. Comprensión determinista acotada a patrones ensayados; no se promete cualquier redacción. Siguiente grado3, no Francés.':'Cerrar último CRUD, cotejar snapshots/históricos, revisar diff y publicar antes de tercero.'}
review.scopes=[...(review.scopes??[]).filter(s=>s.id!==scope.id),{id:scope.id,...status}]
const concepts=scope.elements.CONCEPT
const layout={scopeId:scope.id,provenance:'PDF_COLUMNS_VISUALLY_REVIEWED',headingIds:[concepts[0].id,concepts[20].id],groups:[
 ...concepts.slice(1,14).map(c=>({id:c.id,title:c.text.replace(/^•\s*/,''),memberIds:[]})),
 {id:concepts[14].id,title:'Vocabulario',memberIds:concepts.slice(15,42).filter((_,i)=>i!==5).map(c=>c.id)},
 {id:concepts[42].id,title:'Expresiones',memberIds:concepts.slice(43,57).map(c=>c.id)},
 {id:concepts[57].id,title:'Gramática: formas y usos',memberIds:concepts.slice(58).map(c=>c.id)},
]}
// The first grammatical family anchors this group because the heading is
// embedded in the wishes/expression record56. Its content remains in the ledger;
// every original concept belongs exactly once, without synthetic source records.
review.topicLayouts=[...(review.topicLayouts??[]).filter(l=>l.scopeId!==scope.id),layout]
const oldTopics=new Set(scope.topics.map(t=>t.id))
review.topics=review.topics.filter(t=>!oldTopics.has(t.id))
for(const group of layout.groups)review.topics.push({id:group.id,...status})
writeFileSync(root+'revision.json',JSON.stringify(review,null,2)+'\n')
writeSecondaryInventory()
console.log(JSON.stringify({scope:scope.id,records:records.length,functionRecords:9,grammarFamilies:new Set(Object.values(grammar).flat()).size,status:report.status}))
