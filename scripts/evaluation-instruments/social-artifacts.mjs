import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {socialGradeOneTopics} from '../../packages/shared/src/secondary-social-grade-1.ts'
import {editableFallbackRecommendation} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
const source=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/inventario.json','utf8')).source
assert.equal(createHash('sha256').update(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')).digest('hex'),source.sha256)
const records=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse)
const scope=records.find(r=>r.kind==='scope'&&r.grade===1&&r.subjectName==='Ciencias Sociales'&&!r.optativeExitName)
assert(scope)
const original=records.filter(r=>r.kind==='element'&&r.scopeKey===scope.stableKey)
const normalize=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\s+/g,' ')
const cases=[...socialGradeOneTopics.map(t=>({id:t.id,description:`Explica ${t.label}.`,family:'EXPLANATION'})),
 {id:'causal',description:'Analiza las causas y consecuencias de la expansión colonial europea usando las fuentes proporcionadas.',family:'CAUSAL_ANALYSIS'},
 {id:'chronology',description:'Elabora una línea de tiempo de la Revolución Francesa con los hechos y fechas indicados.',family:'TIMELINE'},
 {id:'spatial',description:'Ubica los lugares señalados en el mapa utilizando los puntos cardinales. Sin calcular escalas ni utilizar GPS.',family:'MAP_LOCATION'},
 {id:'perspectives',description:'Compara liberalismo y conservadurismo en Europa e interpreta las perspectivas de los autores proporcionados.',family:'PERSPECTIVE_COMPARISON'},
 {id:'alternative',description:'Elabora una línea de tiempo o un mapa sobre la expansión colonial europea.',family:'ALTERNATIVE_PRODUCT'},
 {id:'argument',description:'Debate sobre los efectos sociales de la Segunda Revolución Industrial y justifica los argumentos con las fuentes proporcionadas.',family:'DEBATE'},
]
const context={level:'SECONDARY',grade:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',optativeExitName:null}
const examples=cases.flatMap(c=>['rubrica','lista-cotejo','escala','lista-ponderada'].map(instrumentType=>{
 const p=editableFallbackRecommendation({activityTitle:'Actividad',description:c.description,instrumentType,maxScore:17.35,participationMode:'INDIVIDUAL',academicContext:context})
 assert(p.criteria.length>0&&p.criteria.every(r=>r.templateId.startsWith('soc-1-')))
 return{...c,instrumentType,score:17.35,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,...r})=>r)}
}))
const topics=socialGradeOneTopics.map(t=>({...t,provider:'packages/shared/src/secondary-social.ts',familiesImplemented:['EXPLANATION'],instrumentReview:'PENDING_INDIVIDUAL_REVIEW',officialRecordCandidates:original.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&new RegExp(t.match).test(normalize(r.originalText))).map(r=>r.id)}))
const linked=new Set(topics.flatMap(t=>t.officialRecordCandidates))
const matrix={source,grade:1,scopeId:scope.id,pdfPages:[244,245,246,247,248],printedPages:[243,244,245,246,247],sourceVisualReview:{status:'REVIEWED',pages:[244,245,246,247,248],method:'Full page render: concept/procedure columns, continuations and separate indicators.'},status:'PARTIAL_ACTIONS_PENDING_FULL_REVIEW',mappingPolicy:'Lexical candidates require semantic review; no inferred topic-indicator equivalence.',officialRecords:original.map(r=>({id:r.id,type:r.type,text:r.originalText,pdfPage:r.source.pdfPage,printedPage:r.source.printedPage})),topics,unmappedConceptsAndProcedures:original.filter(r=>['CONCEPT','PROCEDURE'].includes(r.type)&&!linked.has(r.id)).map(r=>({id:r.id,text:r.originalText,type:r.type,pdfPage:r.source.pdfPage,status:'PENDING_MAPPING_OR_JUSTIFIED_EXCLUSION'})),implementedFamilies:cases.slice(socialGradeOneTopics.length),verification:{automatedFixtures:cases.length,fullInstrumentsGenerated:examples.length,fullReview:'PENDING',httpDb:'PENDING',browser:'PENDING'}}
const output='docs/curriculum/cobertura-secundaria/'
const httpPath='.wrangler/secondary-completion/social-1-http.json'
if(existsSync(httpPath)){
 const http=JSON.parse(readFileSync(httpPath,'utf8'))
 assert.equal(http.project,'eolgunypmtgrsyrjzcld')
 assert.deepEqual(http.samples.map(s=>s.format),['rubrica','lista-cotejo','escala','lista-ponderada'])
 assert(http.samples.every(s=>s.strategyOnlyInstrumentUnchanged&&s.manualTextPreserved))
 matrix.verification.httpDb='AUTHENTICATED_FOUR_FORMATS_SAVED_REOPENED'
 matrix.verification.httpEvidence={catalog:http.catalog,sourceScope:http.sourceScope,formats:http.samples.map(s=>s.format),strategyOnlyInstrumentUnchanged:true,manualTextPreserved:true,browser:'PENDING_PERSONAL_ACCOUNT_LOGIN'}
}
writeFileSync(output+'sociales-1-matriz.json',JSON.stringify(matrix,null,2)+'\n')
writeFileSync(output+'sociales-1-instrumentos.json',JSON.stringify(examples,null,2)+'\n')
const selected=examples.filter(e=>e.id==='causal'||e.id==='chronology'||e.id==='spatial'||e.id==='perspectives'||e.id==='argument'||e.id==='alternative')
writeFileSync('.wrangler/secondary-completion/social-review.txt',selected.map(e=>`${e.id} / ${e.instrumentType}\n${e.description}\n${e.criteria.map(c=>`${c.title}: ${c.description}\n${c.descriptors.map(d=>d.text).join('\n')}`).join('\n')}\n`).join('\n'))
const start=performance.now()
for(let i=0;i<200;i++)editableFallbackRecommendation({activityTitle:'Actividad',description:cases[29].description,instrumentType:'rubrica',maxScore:17.35,participationMode:'INDIVIDUAL',academicContext:context})
console.log(JSON.stringify({grade:1,topics:topics.length,cases:cases.length,fullInstruments:examples.length,pendingSourceRows:matrix.unmappedConceptsAndProcedures.length,meanLocalPreparationMs:(performance.now()-start)/200,fullyVerified:false}))
