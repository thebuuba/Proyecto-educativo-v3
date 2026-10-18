import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {commonSocialModules} from '../../packages/shared/src/secondary-social.ts'
import {evaluationCatalogCurrent} from '../../apps/backend/src/modules/evaluation-instruments/catalog-current.ts'
import {editableFallbackRecommendation} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
const source=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/inventario.json','utf8')).source
const gradeFlag=process.argv.indexOf('--grade'),grade=gradeFlag<0?1:Number(process.argv[gradeFlag+1])
assert(Number.isInteger(grade)&&grade>=1&&grade<=6)
const socialTopics=commonSocialModules.find(m=>m.grade===grade)?.topics;assert(socialTopics,'El grado debe tener proveedor conectado antes de generar instrumentos')
const gradeName=['','one','two','three','four','five','six'][grade]
const pageReview=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/sociales-fuentes-revisadas.json','utf8')).grades.find(g=>g.grade===grade)
assert.equal(pageReview.visualReview,'REVIEWED_FULL_PAGE_COLUMNS_AND_CONTINUATIONS')
assert.equal(createHash('sha256').update(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')).digest('hex'),source.sha256)
const records=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse)
const scope=records.find(r=>r.kind==='scope'&&r.grade===grade&&r.subjectName==='Ciencias Sociales'&&!r.optativeExitName)
assert(scope)
const original=records.filter(r=>r.kind==='element'&&r.scopeKey===scope.stableKey)
const exclusions=JSON.parse(readFileSync(`docs/curriculum/cobertura-secundaria/sociales-${grade}-exclusiones.json`,'utf8'))
assert.equal(exclusions.sourceSha256,source.sha256)
assert.equal(new Set(exclusions.records.map(r=>r.id)).size,exclusions.records.length)
for(const excluded of exclusions.records)assert(original.some(r=>r.id===excluded.id&&r.source.pdfPage===excluded.pdfPage))
const excludedIds=new Set(exclusions.records.map(r=>r.id))
const semantic=JSON.parse(readFileSync(`docs/curriculum/cobertura-secundaria/sociales-${grade}-correspondencias.json`,'utf8'))
assert.equal(semantic.sourceSha256,source.sha256)
const reviewed=new Map(Object.entries(semantic.topicRecords).map(([topic,prefixes])=>{
 assert(socialTopics.some(t=>t.id===topic),'Unknown reviewed topic')
 return[topic,prefixes.map(prefix=>{
  const matching=original.filter(r=>r.id.startsWith(prefix));assert.equal(matching.length,1)
  assert(['CONCEPT','PROCEDURE'].includes(matching[0].type));assert(!excludedIds.has(matching[0].id))
  return matching[0].id
 })]
}))
const classified=new Set([...reviewed.values()].flat())
const indicatorReviewed=new Map(Object.entries(semantic.indicatorTopicRecords??{}).map(([topic,prefixes])=>[topic,prefixes.map(prefix=>{
 const matches=original.filter(r=>r.id.startsWith(prefix));assert.equal(matches.length,1);assert.equal(matches[0].type,'ACHIEVEMENT_INDICATOR')
 assert.equal(socialTopics.find(t=>t.id===topic)?.sourceRecordType,'ACHIEVEMENT_INDICATOR')
 return matches[0].id
})]))
for(const record of original.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)))assert(classified.has(record.id)||excludedIds.has(record.id),'Unreviewed source record '+record.id)
const normalize=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\s+/g,' ')
const proceduralPath=`data/evaluation-instruments/social-grade-${gradeName}-procedural-contracts.json`
const procedural=existsSync(proceduralPath)?JSON.parse(readFileSync(proceduralPath,'utf8')):{sourceSha256:source.sha256,cases:[]}
const products=JSON.parse(readFileSync(grade===1?'data/evaluation-instruments/social-grade-one-product-contracts.json':`data/evaluation-instruments/social-grade-${gradeName}-contracts.json`,'utf8'))
assert.equal(procedural.sourceSha256,source.sha256)
assert.equal(products.sourceSha256,source.sha256)
for(const task of procedural.cases)for(const id of task.sourceRecordIds)assert(original.some(r=>r.id===id&&r.type==='PROCEDURE'),'El procedimiento debe pertenecer al ámbito literal revisado')
for(const task of products.cases){
 assert(['CONCEPT','PROCEDURE','ACHIEVEMENT_INDICATOR'].includes(task.sourceRecordType),'No convertir disposiciones personales en contratos de producto')
 for(const id of task.sourceRecordIds)assert(original.some(r=>r.id===id&&r.type===task.sourceRecordType),'El referente mantiene su tipo curricular literal')
}
const firstGradeCases=grade===1?[
 {id:'causal',description:'Analiza las causas y consecuencias de la expansión colonial europea usando las fuentes proporcionadas.',family:'CAUSAL_ANALYSIS'},
 {id:'chronology',description:'Elabora una línea de tiempo de la Revolución Francesa con los hechos y fechas indicados.',family:'TIMELINE'},
 {id:'spatial',description:'Ubica los lugares señalados en el mapa utilizando los puntos cardinales. Sin calcular escalas ni utilizar GPS.',family:'MAP_LOCATION'},
 {id:'perspectives',description:'Compara liberalismo y conservadurismo en Europa e interpreta las perspectivas de los autores proporcionados.',family:'PERSPECTIVE_COMPARISON'},
 {id:'alternative',description:'Elabora una línea de tiempo o un mapa sobre la expansión colonial europea.',family:'ALTERNATIVE_PRODUCT'},
 {id:'argument',description:'Debate sobre los efectos sociales de la Segunda Revolución Industrial y justifica los argumentos con las fuentes proporcionadas.',family:'DEBATE'},
 {id:'questions-hypotheses',description:'Formula preguntas e hipótesis provisionales sobre la expansión colonial europea. No investigues nuevas fuentes.',family:'QUESTIONS_HYPOTHESES'},
 {id:'source-reliability',description:'Identifica cuáles de las fuentes proporcionadas para el estudio geográfico son confiables y justifica tu selección.',family:'SOURCE_RELIABILITY'},
 {id:'historical-news',description:'Redacta una noticia sobre las revoluciones burguesas. Incluye titular, entrada y cuerpo. Sin fotografías ni pie de foto.',family:'HISTORICAL_NEWS'},
 {id:'digital-prevention',description:'Analiza los riesgos de compartir información personal en redes sociales y propone medidas de protección para el caso ficticio. No compartas datos propios.',family:'DIGITAL_PREVENTION'},
 ...procedural.cases,
]:[]
const cases=[...socialTopics.map(t=>({id:t.id,description:`Explica ${t.label}.`,family:'EXPLANATION'})),...(grade===1?firstGradeCases:procedural.cases),...products.cases]
assert.equal(new Set(cases.map(c=>c.id)).size,cases.length,'Las consignas tienen identificadores únicos')
const context={level:'SECONDARY',grade,subjectCode:'SOC',subjectName:'Ciencias Sociales',optativeExitName:null}
const examples=cases.flatMap(c=>['rubrica','lista-cotejo','escala','lista-ponderada'].map(instrumentType=>{
 const p=editableFallbackRecommendation({activityTitle:'Actividad',description:c.description,instrumentType,maxScore:17.35,participationMode:'INDIVIDUAL',academicContext:context})
 assert(p.criteria.length>0&&p.criteria.every(r=>r.templateId.startsWith(`soc-${grade}-`)))
 return{...c,instrumentType,score:17.35,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,...r})=>r)}
}))
const topics=socialTopics.map(t=>({...t,provider:'packages/shared/src/secondary-social.ts',familiesImplemented:[...new Set(examples.filter(e=>e.criteria.some(c=>c.templateId.startsWith(`soc-${grade}-${t.id}-`))).map(e=>e.family))],instrumentReview:'PENDING_INDIVIDUAL_REVIEW',officialRecordCandidates:original.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&!excludedIds.has(r.id)&&new RegExp(t.match).test(normalize(r.originalText))).map(r=>r.id)}))
const linked=new Set(topics.flatMap(t=>t.officialRecordCandidates))
const matrix={source,grade,scopeId:scope.id,pdfPages:pageReview.pdfPages,printedPages:pageReview.printedPages,sourceVisualReview:{status:'REVIEWED',pages:pageReview.pdfPages,method:'Full page render: concept/procedure columns, continuations and separate indicators.'},status:'PARTIAL_VARIANTS_AND_PERSONAL_VISUAL_PENDING',mappingPolicy:'Lexical candidates require semantic review; no inferred topic-indicator equivalence.',officialRecords:original.map(r=>({id:r.id,type:r.type,text:r.originalText,pdfPage:r.source.pdfPage,printedPage:r.source.printedPage})),topics,unmappedConceptsAndProcedures:original.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&!linked.has(r.id)).map(r=>({id:r.id,text:r.originalText,type:r.type,pdfPage:r.source.pdfPage,status:'PENDING_MAPPING_OR_JUSTIFIED_EXCLUSION'})),implementedFamilies:cases.slice(socialTopics.length),verification:{automatedFixtures:cases.length,fullInstrumentsGenerated:examples.length,fullReview:'PENDING',httpDb:'PENDING',browser:'PENDING'}}
const output='docs/curriculum/cobertura-secundaria/'
matrix.providerCatalog=evaluationCatalogCurrent.version
const publicationPath=`.wrangler/secondary-completion/MINERD_SECUNDARIA_2023_SOC_COMUN_G${grade}_V1-source.json`
if(existsSync(publicationPath)){
 const publication=JSON.parse(readFileSync(publicationPath,'utf8'))
 assert.equal(publication.project,'eolgunypmtgrsyrjzcld');assert.equal(publication.metadata.sourcePdfHash,source.sha256)
 assert.equal(publication.elements,original.length)
 matrix.sourcePublication={status:'PUBLISHED_LITERAL_SOURCE_NOT_COMPLETE_INSTRUMENT_COVERAGE',code:publication.code,versionId:publication.versionId,scopeId:publication.scopeId,records:publication.elements,excludedFromAssessment:publication.excludedFromAssessment,idempotentResult:publication.result}
}
writeFileSync('.wrangler/secondary-completion/expected-catalog.json',JSON.stringify(evaluationCatalogCurrent)+'\n')
matrix.explicitExclusions=exclusions.records
matrix.lexicallyUnmatchedReviewedRecords=matrix.unmappedConceptsAndProcedures.filter(r=>classified.has(r.id)&&!excludedIds.has(r.id)).map(r=>({...r,status:'SEMANTIC_GROUP_LINK_NOT_AUTOMATIC_ACTION_COVERAGE'}))
matrix.unmappedConceptsAndProcedures=matrix.unmappedConceptsAndProcedures.filter(r=>!classified.has(r.id)&&!excludedIds.has(r.id))
matrix.semanticMappingReview='REVIEWED_SOURCE_GROUPS_PROCEDURAL_COVERAGE_STILL_PARTIAL'
matrix.semanticMappingLimits=semantic.limits
for(const topic of matrix.topics)topic.reviewedOfficialRecordIds=reviewed.get(topic.id)??indicatorReviewed.get(topic.id)??[]
const contentReviewPath=output+`sociales-${grade}-revision-instrumentos.json`
if(existsSync(contentReviewPath)){
 const review=JSON.parse(readFileSync(contentReviewPath,'utf8'))
 const valid=review.items.filter(r=>{
  const example=examples.find(e=>e.id===r.caseId&&e.instrumentType===r.instrumentType)
  return example&&createHash('sha256').update(JSON.stringify(example)).digest('hex')===r.sha256
 })
 matrix.verification.fullReview={reviewedWithMatchingDigest:valid.length,pending:examples.length-valid.length,method:review.method,limits:review.limits}
 for(const topic of matrix.topics){
  const topicExamples=examples.filter(e=>e.criteria.some(c=>c.templateId.startsWith(`soc-${grade}-${topic.id}-`)))
  const reviewedExamples=topicExamples.filter(e=>valid.some(r=>r.caseId===e.id&&r.instrumentType===e.instrumentType))
  topic.instrumentReview=reviewedExamples.length===topicExamples.length?'REPRESENTATIVE_EXAMPLES_REVIEWED_NOT_COMPLETE_PROCEDURAL_COVERAGE':'PENDING_INDIVIDUAL_REVIEW'
  topic.reviewedRepresentativeExamples=reviewedExamples.length
 }
}
const httpPath=`.wrangler/secondary-completion/social-${grade}-http.json`
if(existsSync(httpPath)){
 const http=JSON.parse(readFileSync(httpPath,'utf8'))
 assert.equal(http.project,'eolgunypmtgrsyrjzcld')
 assert.deepEqual([...new Set(http.samples.map(s=>s.format))],['rubrica','lista-cotejo','escala','lista-ponderada'])
 assert(http.samples.every(s=>s.strategyOnlyInstrumentUnchanged&&s.manualTextPreserved))
 matrix.verification.httpDb=http.catalog===matrix.providerCatalog?'AUTHENTICATED_FOUR_FORMATS_SAVED_REOPENED':'PREVIOUS_CATALOG_ONLY_CURRENT_PENDING'
 matrix.verification.httpEvidence={catalog:http.catalog,sourceScope:http.sourceScope,formats:http.samples.map(s=>s.format),strategyOnlyInstrumentUnchanged:true,manualTextPreserved:true,browser:'PENDING_PERSONAL_ACCOUNT_LOGIN'}
}
matrix.verification.currentCatalogHttpRuns=readdirSync('.wrangler/secondary-completion').filter(name=>name.startsWith(`social-${grade}-`+matrix.providerCatalog+'-')&&name.endsWith('-http.json')).map(name=>{
 const run=JSON.parse(readFileSync('.wrangler/secondary-completion/'+name,'utf8'))
 assert.equal(run.project,'eolgunypmtgrsyrjzcld');assert.equal(run.catalog,matrix.providerCatalog)
 assert(run.samples.every(s=>s.strategyOnlyInstrumentUnchanged&&s.manualTextPreserved))
 return{evidence:name,samples:run.samples.length,sourceScope:run.sourceScope,formats:[...new Set(run.samples.map(s=>s.format))],verification:run.verification}
})
const currentBrowserPath=output+`sociales-${grade}-verificacion-navegador-${matrix.providerCatalog}.json`
const browserPath=existsSync(currentBrowserPath)?currentBrowserPath:output+`sociales-${grade}-verificacion-navegador.json`
if(existsSync(browserPath)){
 const browser=JSON.parse(readFileSync(browserPath,'utf8'));assert.equal(browser.grade,grade)
 assert(browser.savedAndReopenedAfterManualStrategy&&browser.existingDraftsPreserved)
 assert.equal(browser.readOnlyDatabaseInstrumentFingerprintBefore,browser.readOnlyDatabaseInstrumentFingerprintAfter)
 matrix.verification.browser={status:browser.catalog===matrix.providerCatalog?browser.status:'PREVIOUS_CATALOG_ONLY_CURRENT_PENDING',catalog:browser.catalog,evidence:browserPath,format:browser.format,limits:browser.limits}
 if(matrix.verification.httpEvidence)matrix.verification.httpEvidence.browser=matrix.verification.browser.status
}
if(matrix.verification.httpDb==='AUTHENTICATED_FOUR_FORMATS_SAVED_REOPENED'&&matrix.verification.browser?.catalog===matrix.providerCatalog&&matrix.verification.fullReview?.pending===0)matrix.status='REPRESENTATIVE_VARIANTS_HTTP_PERSONAL_VERIFIED_NOT_FULL_PROCEDURAL_COVERAGE'
writeFileSync(output+`sociales-${grade}-matriz.json`,JSON.stringify(matrix,null,2)+'\n')
writeFileSync(output+`sociales-${grade}-instrumentos.json`,JSON.stringify(examples,null,2)+'\n')
const selected=examples.filter(e=>e.id==='causal'||e.id==='chronology'||e.id==='spatial'||e.id==='perspectives'||e.id==='argument'||e.id==='alternative')
writeFileSync(`.wrangler/secondary-completion/social-${grade}-review.txt`,selected.map(e=>`${e.id} / ${e.instrumentType}\n${e.description}\n${e.criteria.map(c=>`${c.title}: ${c.description}\n${c.descriptors.map(d=>d.text).join('\n')}`).join('\n')}\n`).join('\n'))
const start=performance.now()
for(let i=0;i<200;i++)editableFallbackRecommendation({activityTitle:'Actividad',description:cases[Math.min(29,cases.length-1)].description,instrumentType:'rubrica',maxScore:17.35,participationMode:'INDIVIDUAL',academicContext:context})
console.log(JSON.stringify({grade,topics:topics.length,cases:cases.length,fullInstruments:examples.length,pendingSourceRows:matrix.unmappedConceptsAndProcedures.length,meanLocalPreparationMs:(performance.now()-start)/200,fullyVerified:false}))
