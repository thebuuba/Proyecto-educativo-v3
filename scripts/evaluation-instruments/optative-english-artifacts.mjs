import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {optativeEnglishModules,validateInstrumentDefinition} from '../../packages/shared/src/index.ts'
import {editableFallbackRecommendation,recommendationToFields} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
import {scoreInstrumentFields} from '../../apps/frontend/src/modules/activities/services/instrumentScoring.ts'
import {evaluationCatalogCurrent} from '../../apps/backend/src/modules/evaluation-instruments/catalog-current.ts'

// Records review artifacts only; recommendations and all formatters remain shared.
const [fixturePath,mappingPath]=process.argv.slice(2)
const scopes={'data/evaluation-instruments/optative-hlm-ing-four-contracts.json':'docs/curriculum/cobertura-secundaria/optative-hlm-ing-4-correspondencias.json','data/evaluation-instruments/optative-hlm-ing-five-contracts.json':'docs/curriculum/cobertura-secundaria/optative-hlm-ing-5-correspondencias.json','data/evaluation-instruments/optative-hlm-ing-six-contracts.json':'docs/curriculum/cobertura-secundaria/optative-hlm-ing-6-correspondencias.json'}
assert(scopes[fixturePath]);assert.equal(mappingPath,scopes[fixturePath])
const read=p=>JSON.parse(readFileSync(p,'utf8')),digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex'),fixture=read(fixturePath),mapping=read(mappingPath),module=optativeEnglishModules.find(m=>m.subjectCode===fixture.subjectCode)
assert(module);assert.equal(module.sourceScopeId,mapping.scopeId);assert.equal(module.grade,fixture.grade);assert.equal(module.optativeExitName,fixture.optativeExitName);assert(module.modalityCodes.includes(fixture.modalityCode))
const records=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse),source=records.find(r=>r.kind==='document'),scope=records.find(r=>r.kind==='scope'&&r.id===mapping.scopeId)
assert(scope);assert.equal(scope.subjectName,module.subjectName);assert.equal(scope.optativeExitName,module.optativeExitName)
assert.equal(createHash('sha256').update(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')).digest('hex'),source.sha256)
assert.equal(mapping.sourceSha256,source.sha256);assert.equal(mapping.sourceVisualReview.status,'REVIEWED')
const literal=records.filter(r=>r.kind==='element'&&r.scopeKey===scope.stableKey),ids=new Set(literal.map(r=>r.id)),classified=mapping.classification
assert.equal(new Set(classified.map(r=>r.id)).size,classified.length)
assert(literal.filter(r=>['CONCEPT','PROCEDURE','ATTITUDE_VALUE'].includes(r.type)).every(r=>classified.some(c=>c.id===r.id)))
for(const r of classified){const actual=literal.find(e=>e.id===r.id);assert(actual);assert.equal(actual.originalText,r.literal);assert.equal(actual.type,r.type);assert.equal(actual.source.pdfPage,r.pdfPage)}
assert.equal(mapping.contents.length,classified.filter(r=>r.status==='OBSERVABLE_CONTENT_TO_ADAPT').length)
const literary=mapping.literaryIndicators??mapping.criticalIndicators??[]
if(module.grade===5||module.grade===6){assert.equal(literary.length,21);for(const r of literary){const actual=literal.find(e=>e.id===r.id);assert.equal(actual?.type,'ACHIEVEMENT_INDICATOR');assert.equal(actual.originalText,r.literal);assert.equal(actual.source.pdfPage,r.pdfPage);assert(r.adaptation&&r.caseIds.length)}}
else assert.equal(literary.length,0)
for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(classified.some(c=>c.id===id&&c.status==='OBSERVABLE_CONTENT_TO_ADAPT')||literary.some(r=>r.id===id),task.id+' uses an excluded reference')}
for(const c of mapping.contents){assert(c.caseIds.length,c.id);for(const id of c.caseIds){const task=fixture.cases.find(t=>t.id===id);assert(task);assert(c.sourceRecordIds.every(id=>task.sourceRecordIds.includes(id)))}}
for(const r of literary)for(const id of r.caseIds)assert(fixture.cases.some(t=>t.id===id&&t.sourceRecordIds.includes(r.id)))
assert.equal(new Set(fixture.cases.map(c=>c.id)).size,fixture.cases.length)
const context={level:'SECONDARY',grade:module.grade,cycle:2,subjectCode:module.subjectCode,subjectName:module.subjectName,modalityCode:fixture.modalityCode,optativeExitName:module.optativeExitName},examples=[]
for(const task of fixture.cases)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']){
 const participationMode=task.participationMode??'INDIVIDUAL';assert(['INDIVIDUAL','GROUP'].includes(participationMode))
 const p=editableFallbackRecommendation({activityTitle:'Un título antiguo sobre células',description:task.description,maxScore:17.35,instrumentType,participationMode,academicContext:context})
 assert(p.criteria.length&&p.criteria.every(r=>r.templateId.startsWith(`opt-hlm-ing-${module.grade}-`)),task.id);assert.equal(p.activityType,task.activityType)
 const fields=scoreInstrumentFields(recommendationToFields(p,'Actividad'),instrumentType,17.35,p);assert.deepEqual(validateInstrumentDefinition(instrumentType,fields,17.35),[])
 examples.push({id:task.id,description:task.description,sourceRecordIds:task.sourceRecordIds,instrumentType,activityType:p.activityType,participationMode,totalScore:17.35,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,sourceType,...r})=>r)})
}
const prefix=mappingPath.replace(/-correspondencias\.json$/,''),reviewPath=prefix+'-revision-instrumentos.json',review=existsSync(reviewPath)?read(reviewPath):{items:[]},reviewed=examples.filter(e=>review.items.some(r=>r.caseId===e.id&&r.instrumentType===e.instrumentType&&r.sha256===digest(e)))
const matrix={source,grade:module.grade,subjectCode:module.subjectCode,subjectName:module.subjectName,optativeExitName:module.optativeExitName,modalityCode:fixture.modalityCode,scopeId:scope.id,pdfPages:module.pdfPages,sourceVisualReview:mapping.sourceVisualReview,status:'CONNECTED_FULL_REVIEW_OR_RUNTIME_PENDING',provider:'packages/shared/src/secondary-optative-english.ts',providerCatalog:evaluationCatalogCurrent.version,
 officialRecords:literal.map(r=>({id:r.id,type:r.type,text:r.originalText,pdfPage:r.source.pdfPage,printedPage:r.source.printedPage})),coverageFamilies:[...new Set(mapping.contents.map(c=>c.family))],contents:mapping.contents,explicitExclusions:classified.filter(r=>r.status!=='OBSERVABLE_CONTENT_TO_ADAPT').map(r=>({id:r.id,reason:r.status,explanation:r.reason})),verification:{automatedFixtures:fixture.cases.length,fullInstrumentsGenerated:examples.length,fullReview:{reviewedWithMatchingDigest:reviewed.length,pending:examples.length-reviewed.length},httpDb:'PENDING',browser:'PENDING'},limits:['Los registros adaptables y los dominios temáticos no equivalen a proveedores ni temas independientes.','Las adaptaciones de AulaBase no son transcripciones de criterios oficiales.','Las muestras verificadas no acreditan todas las combinaciones posibles ni toda capacidad adicional del helper común.','El formato virtual escrito no impone producir un video.']}
if(literary.length)matrix[module.grade===5?'literaryIndicators':'criticalIndicators']=literary
writeFileSync(prefix+'-instrumentos.json',JSON.stringify(examples,null,2)+'\n');writeFileSync(prefix+'-matriz.json',JSON.stringify(matrix,null,2)+'\n')
console.log(JSON.stringify({subjectCode:module.subjectCode,catalog:evaluationCatalogCurrent.version,cases:fixture.cases.length,instruments:examples.length,reviewed:reviewed.length,pending:examples.length-reviewed.length,remoteWrites:false}))
