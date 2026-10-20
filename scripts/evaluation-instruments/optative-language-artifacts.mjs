import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {optativeLanguageModules,optativeSocialModules,optativeMathModules,optativeScienceModules,validateInstrumentDefinition} from '../../packages/shared/src/index.ts'
import {editableFallbackRecommendation,recommendationToFields} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
import {scoreInstrumentFields} from '../../apps/frontend/src/modules/activities/services/instrumentScoring.ts'
import {evaluationCatalogCurrent} from '../../apps/backend/src/modules/evaluation-instruments/catalog-current.ts'

// Reuses the shared provider and four formatters; this script only records review artifacts.
const [fixturePath,mappingPath]=process.argv.slice(2)
assert(fixturePath?.startsWith('data/evaluation-instruments/optative-')&&fixturePath.endsWith('-contracts.json'))
assert(mappingPath?.startsWith('docs/curriculum/cobertura-secundaria/optative-')&&mappingPath.endsWith('-correspondencias.json'))
const read=path=>JSON.parse(readFileSync(path,'utf8')),digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex')
const fixture=read(fixturePath),mapping=read(mappingPath),module=[...optativeLanguageModules,...optativeSocialModules,...optativeMathModules,...optativeScienceModules].find(m=>m.subjectCode===fixture.subjectCode)
const science=optativeScienceModules.some(m=>m.subjectCode===fixture.subjectCode)
assert(module);assert.equal(module.sourceScopeId,mapping.scopeId);assert.equal(module.grade,fixture.grade)
assert.equal(module.optativeExitName,fixture.optativeExitName);assert(module.modalityCodes.includes(fixture.modalityCode))
const records=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse)
const source=records.find(r=>r.kind==='document'),scope=records.find(r=>r.kind==='scope'&&r.id===mapping.scopeId)
assert(scope);assert.equal(scope.optativeExitName,module.optativeExitName);assert.equal(scope.subjectName,module.subjectName)
assert.equal(createHash('sha256').update(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')).digest('hex'),source.sha256)
assert.equal(mapping.sourceSha256,source.sha256);assert.equal(mapping.sourceVisualReview.status,'REVIEWED')
const literal=records.filter(r=>r.kind==='element'&&r.scopeKey===scope.stableKey),ids=new Set(literal.map(r=>r.id))
const classified=mapping.classification,covered=new Set(classified.map(r=>r.id))
assert.equal(covered.size,classified.length)
assert(literal.filter(r=>['CONCEPT','PROCEDURE','ATTITUDE_VALUE'].includes(r.type)).every(r=>covered.has(r.id)))
for(const row of classified){const actual=literal.find(r=>r.id===row.id);assert(actual);assert.equal(actual.originalText,row.literal);assert.equal(actual.type,row.type);assert.equal(actual.source.pdfPage,row.pdfPage)}
assert.equal(mapping.contents.length,classified.filter(r=>r.status==='OBSERVABLE_CONTENT_TO_ADAPT').length)
for(const task of fixture.cases)for(const id of task.sourceRecordIds)assert(ids.has(id),task.id+'/'+id)
const cases=[...module.topics.map(t=>({id:'brief:'+t.id,description:'Analiza '+t.label+' en el texto proporcionado.',sourceRecordIds:t.sourceRecordIds})),...fixture.cases]
assert.equal(new Set(cases.map(c=>c.id)).size,cases.length)
const context={level:'SECONDARY',grade:module.grade,cycle:2,subjectCode:module.subjectCode,subjectName:module.subjectName,modalityCode:fixture.modalityCode,optativeExitName:module.optativeExitName}
const examples=[]
for(const task of cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']){
 const participationMode=task.participationMode??'INDIVIDUAL';assert(['INDIVIDUAL','GROUP'].includes(participationMode))
 const proposal=editableFallbackRecommendation({activityTitle:'Un título antiguo sobre células',description:task.description,maxScore:17.35,instrumentType,participationMode,academicContext:context})
 assert(proposal.criteria.length&&proposal.criteria.every(r=>r.templateId.startsWith(module.subjectCode.toLowerCase()+'-')||science&&r.templateId.startsWith('delivery-format')),task.id)
 const fields=scoreInstrumentFields(recommendationToFields(proposal,'Actividad'),instrumentType,17.35,proposal)
 assert.deepEqual(validateInstrumentDefinition(instrumentType,fields,17.35),[])
 examples.push({id:task.id,description:task.description,sourceRecordIds:task.sourceRecordIds,instrumentType,activityType:proposal.activityType,participationMode,totalScore:17.35,levels:proposal.levels,criteria:proposal.criteria.map(({id,sourceReferences,sourceType,...r})=>r)})
}
const prefix=mappingPath.replace(/-correspondencias\.json$/,''),reviewPath=prefix+'-revision-instrumentos.json'
const review=existsSync(reviewPath)?read(reviewPath):{items:[]}
const reviewed=examples.filter(e=>review.items.some(r=>r.caseId===e.id&&r.instrumentType===e.instrumentType&&r.sha256===digest(e)))
const matrix={source,grade:module.grade,subjectCode:module.subjectCode,subjectName:module.subjectName,optativeExitName:module.optativeExitName,modalityCode:fixture.modalityCode,scopeId:scope.id,pdfPages:module.pdfPages,sourceVisualReview:mapping.sourceVisualReview,
 status:'CONNECTED_FULL_REVIEW_OR_RUNTIME_PENDING',provider:science?'packages/shared/src/secondary-optative-science.ts':optativeMathModules.some(m=>m.subjectCode===module.subjectCode)?'packages/shared/src/secondary-optative-math.ts':module.subjectCode.startsWith('OPT-HCS-SOC-')?'packages/shared/src/secondary-optative-social.ts':'packages/shared/src/secondary-optative-language.ts',providerCatalog:evaluationCatalogCurrent.version,
 officialRecords:literal.map(r=>({id:r.id,type:r.type,text:r.originalText,pdfPage:r.source.pdfPage,printedPage:r.source.printedPage})),...(science||optativeMathModules.some(m=>m.subjectCode===module.subjectCode)||module.subjectCode.startsWith('OPT-HCS-SOC-')?{topics:module.topics}:{genres:module.topics}),contents:mapping.contents,
 ...(mapping.criticalIndicators?{criticalIndicators:mapping.criticalIndicators}:{}),explicitExclusions:classified.filter(r=>r.status!=='OBSERVABLE_CONTENT_TO_ADAPT').map(r=>({id:r.id,reason:r.status,explanation:r.reason})),
 verification:{automatedFixtures:cases.length,fullInstrumentsGenerated:examples.length,fullReview:{reviewedWithMatchingDigest:reviewed.length,pending:examples.length-reviewed.length},httpDb:'PENDING',browser:'PENDING'},
 limits:[`${module.topics.length} ${science||optativeMathModules.some(m=>m.subjectCode===module.subjectCode)||module.subjectCode.startsWith('OPT-HCS-SOC-')?'agrupaciones temáticas':'géneros'}, con ${mapping.contents.length} contenidos y procedimientos adaptados; no equivalen a ese número de temas independientes.`,...(module.subjectCode==='OPT-CT-5'?['Se evalúan las acciones químicas y computacionales pedidas con fichas profesionales,modelos yresultados proporcionados;sin dosis,clínica real,síntesis peligrosa,cultivos,consumo,visitas ocompras.','Un modelo oensayo in vitro no demuestra eficacia clínica en personas;la mención curricular de prácticas terapéuticas no acredita eficacia oequivalencia.','Fases,objetos yfilas mixtas conservan su literal;calcular no exige preparar sustancias eidentificar equipos no exige ejecutarlos.']:science?['Se evalúan únicamente las acciones científicas y computacionales solicitadas mediante casos ficticios, datos y fuentes proporcionados; no se exigen procedimientos clínicos, datos privados, cultivos peligrosos ni intervenciones reales.','Las filas mixtas conservan su literal y se adaptan por el objeto solicitado. La similitud de secuencias o la salida de un modelo no demuestran por sí solas una función o eficacia clínica.']:module.subjectCode==='OPT-MT-6'?['Se evalúan acciones de coordenadas polares,superficies yfunciones/derivadas vectoriales con ecuaciones,intervalos,dominios yconvenciones dados;sin intervenciones reales.','Conversión de ecuaciones/puntos,gráfica/modelo/interpretación yfunción/derivada son acciones distintas;colaboración solo por aportaciones pedidas.']:module.subjectCode==='OPT-MT-5'?['Se evalúan únicamente acciones estadísticas oprobabilísticas con datos dados,ficticios oagregados ysupuestos explícitos;no se imponen encuestas privadas.','Normalizar no demuestra normalidad;correlación no implica causalidad;simulación no exige igualdad exacta con elmodelo teórico.']:optativeMathModules.some(m=>m.subjectCode===module.subjectCode)?['Se evalúan las acciones matemáticas o contables pedidas con datos ficticios y convenciones proporcionadas;sin ingresos privados o contrataciones reales.','Herramientas según consigna yacceso;no se imponen todos los programas o productos contables.']:module.subjectCode==='OPT-HCS-SOC-6'?['Se evalúan acciones pedidas de casos,textos ysimulaciones;sin adhesión política,moralidad oemociones privadas.','Norma de citas dada oelegida;ritual solo cuando es explícito;no se imponen todos los productos o ejecución externa.']:module.subjectCode==='OPT-HCS-SOC-5'?['Datos,fórmulas,períodos y convenciones son los proporcionados;no se inventan cifras actuales ni una fórmula universal de índices.','Las alternativas de producto y las acciones independientes se evalúan según la consigna;sin datos privados ni ejecución externa implícita.']:['Autores y obras son referencias opcionales, no requisitos simultáneos.']),'Las adaptaciones de AulaBase no son transcripciones de indicadores oficiales.','Las muestras no acreditan todas las variantes de cada fila curricular ni ejecución real de clase.']}
writeFileSync(prefix+'-instrumentos.json',JSON.stringify(examples,null,2)+'\n')
writeFileSync(prefix+'-matriz.json',JSON.stringify(matrix,null,2)+'\n')
console.log(JSON.stringify({subjectCode:module.subjectCode,catalog:evaluationCatalogCurrent.version,cases:cases.length,instruments:examples.length,reviewed:reviewed.length,pending:examples.length-reviewed.length,remoteWrites:false}))
