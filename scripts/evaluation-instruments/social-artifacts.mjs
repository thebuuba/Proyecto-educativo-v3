import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {socialGradeOneTopics} from '../../packages/shared/src/secondary-social-grade-1.ts'
import {evaluationCatalogCurrent} from '../../apps/backend/src/modules/evaluation-instruments/catalog-current.ts'
import {editableFallbackRecommendation} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
const source=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/inventario.json','utf8')).source
assert.equal(createHash('sha256').update(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')).digest('hex'),source.sha256)
const records=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse)
const scope=records.find(r=>r.kind==='scope'&&r.grade===1&&r.subjectName==='Ciencias Sociales'&&!r.optativeExitName)
assert(scope)
const original=records.filter(r=>r.kind==='element'&&r.scopeKey===scope.stableKey)
const exclusions=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/sociales-1-exclusiones.json','utf8'))
assert.equal(exclusions.sourceSha256,source.sha256)
assert.equal(new Set(exclusions.records.map(r=>r.id)).size,exclusions.records.length)
for(const excluded of exclusions.records)assert(original.some(r=>r.id===excluded.id&&r.source.pdfPage===excluded.pdfPage))
const excludedIds=new Set(exclusions.records.map(r=>r.id))
const semantic=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/sociales-1-correspondencias.json','utf8'))
assert.equal(semantic.sourceSha256,source.sha256)
const reviewed=new Map(Object.entries(semantic.topicRecords).map(([topic,prefixes])=>{
 assert(socialGradeOneTopics.some(t=>t.id===topic),'Unknown reviewed topic')
 return[topic,prefixes.map(prefix=>{
  const matching=original.filter(r=>r.id.startsWith(prefix));assert.equal(matching.length,1)
  assert(['CONCEPT','PROCEDURE'].includes(matching[0].type));assert(!excludedIds.has(matching[0].id))
  return matching[0].id
 })]
}))
const classified=new Set([...reviewed.values()].flat())
for(const record of original.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)))assert(classified.has(record.id)||excludedIds.has(record.id),'Unreviewed source record '+record.id)
const normalize=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\s+/g,' ')
const cases=[...socialGradeOneTopics.map(t=>({id:t.id,description:`Explica ${t.label}.`,family:'EXPLANATION'})),
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
]
const context={level:'SECONDARY',grade:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',optativeExitName:null}
const examples=cases.flatMap(c=>['rubrica','lista-cotejo','escala','lista-ponderada'].map(instrumentType=>{
 const p=editableFallbackRecommendation({activityTitle:'Actividad',description:c.description,instrumentType,maxScore:17.35,participationMode:'INDIVIDUAL',academicContext:context})
 assert(p.criteria.length>0&&p.criteria.every(r=>r.templateId.startsWith('soc-1-')))
 return{...c,instrumentType,score:17.35,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,...r})=>r)}
}))
const topics=socialGradeOneTopics.map(t=>({...t,provider:'packages/shared/src/secondary-social.ts',familiesImplemented:['EXPLANATION'],instrumentReview:'PENDING_INDIVIDUAL_REVIEW',officialRecordCandidates:original.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&!excludedIds.has(r.id)&&new RegExp(t.match).test(normalize(r.originalText))).map(r=>r.id)}))
const linked=new Set(topics.flatMap(t=>t.officialRecordCandidates))
const matrix={source,grade:1,scopeId:scope.id,pdfPages:[244,245,246,247,248],printedPages:[243,244,245,246,247],sourceVisualReview:{status:'REVIEWED',pages:[244,245,246,247,248],method:'Full page render: concept/procedure columns, continuations and separate indicators.'},status:'PARTIAL_ACTIONS_PENDING_FULL_REVIEW',mappingPolicy:'Lexical candidates require semantic review; no inferred topic-indicator equivalence.',officialRecords:original.map(r=>({id:r.id,type:r.type,text:r.originalText,pdfPage:r.source.pdfPage,printedPage:r.source.printedPage})),topics,unmappedConceptsAndProcedures:original.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&!linked.has(r.id)).map(r=>({id:r.id,text:r.originalText,type:r.type,pdfPage:r.source.pdfPage,status:'PENDING_MAPPING_OR_JUSTIFIED_EXCLUSION'})),implementedFamilies:cases.slice(socialGradeOneTopics.length),verification:{automatedFixtures:cases.length,fullInstrumentsGenerated:examples.length,fullReview:'PENDING',httpDb:'PENDING',browser:'PENDING'}}
const output='docs/curriculum/cobertura-secundaria/'
matrix.providerCatalog=evaluationCatalogCurrent.version
writeFileSync('.wrangler/secondary-completion/expected-catalog.json',JSON.stringify(evaluationCatalogCurrent)+'\n')
matrix.explicitExclusions=exclusions.records
matrix.unmappedConceptsAndProcedures=matrix.unmappedConceptsAndProcedures.filter(r=>!excludedIds.has(r.id))
matrix.semanticMappingReview='REVIEWED_SOURCE_GROUPS_PROCEDURAL_COVERAGE_STILL_PARTIAL'
matrix.semanticMappingLimits=semantic.limits
for(const topic of matrix.topics)topic.reviewedOfficialRecordIds=reviewed.get(topic.id)??[]
const contentReviewPath=output+'sociales-1-revision-instrumentos.json'
if(existsSync(contentReviewPath)){
 const review=JSON.parse(readFileSync(contentReviewPath,'utf8'))
 const valid=review.items.filter(r=>{
  const example=examples.find(e=>e.id===r.caseId&&e.instrumentType===r.instrumentType)
  return example&&createHash('sha256').update(JSON.stringify(example)).digest('hex')===r.sha256
 })
 matrix.verification.fullReview={reviewedWithMatchingDigest:valid.length,pending:examples.length-valid.length,method:review.method,limits:review.limits}
}
const httpPath='.wrangler/secondary-completion/social-1-http.json'
if(existsSync(httpPath)){
 const http=JSON.parse(readFileSync(httpPath,'utf8'))
 assert.equal(http.project,'eolgunypmtgrsyrjzcld')
 assert.deepEqual([...new Set(http.samples.map(s=>s.format))],['rubrica','lista-cotejo','escala','lista-ponderada'])
 assert(http.samples.every(s=>s.strategyOnlyInstrumentUnchanged&&s.manualTextPreserved))
 matrix.verification.httpDb=http.catalog===matrix.providerCatalog?'AUTHENTICATED_FOUR_FORMATS_SAVED_REOPENED':'PREVIOUS_CATALOG_ONLY_CURRENT_PENDING'
 matrix.verification.httpEvidence={catalog:http.catalog,sourceScope:http.sourceScope,formats:http.samples.map(s=>s.format),strategyOnlyInstrumentUnchanged:true,manualTextPreserved:true,browser:'PENDING_PERSONAL_ACCOUNT_LOGIN'}
}
writeFileSync(output+'sociales-1-matriz.json',JSON.stringify(matrix,null,2)+'\n')
writeFileSync(output+'sociales-1-instrumentos.json',JSON.stringify(examples,null,2)+'\n')
const selected=examples.filter(e=>e.id==='causal'||e.id==='chronology'||e.id==='spatial'||e.id==='perspectives'||e.id==='argument'||e.id==='alternative')
writeFileSync('.wrangler/secondary-completion/social-review.txt',selected.map(e=>`${e.id} / ${e.instrumentType}\n${e.description}\n${e.criteria.map(c=>`${c.title}: ${c.description}\n${c.descriptors.map(d=>d.text).join('\n')}`).join('\n')}\n`).join('\n'))
const start=performance.now()
for(let i=0;i<200;i++)editableFallbackRecommendation({activityTitle:'Actividad',description:cases[29].description,instrumentType:'rubrica',maxScore:17.35,participationMode:'INDIVIDUAL',academicContext:context})
console.log(JSON.stringify({grade:1,topics:topics.length,cases:cases.length,fullInstruments:examples.length,pendingSourceRows:matrix.unmappedConceptsAndProcedures.length,meanLocalPreparationMs:(performance.now()-start)/200,fullyVerified:false}))
