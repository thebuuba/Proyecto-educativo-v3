import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
import {futureTitle,futureDescription} from './reproduce-natural-task-local.mjs'
const {health,request,requestResult}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.69')
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'],results=[],selections=[],rejections=[]
const inputFor=(grade,code,description,format,total=17.35,title='Actividad')=>({sectionSubjectId:context.assignments.find(a=>a.grade===grade&&a.code===code).id,activityTitle:title,description,maxScore:total,participationMode:'INDIVIDUAL',preferredInstrumentType:format})
async function check(input,caseId){
 const proposal=await request('/evaluation-instruments/recommend',input)
 assert.equal(proposal.instrumentType,input.preferredInstrumentType)
 assert.equal(proposal.criteria.reduce((s,c)=>s+c.maxScoreUnits,0),Math.round(input.maxScore*100))
 assert.equal(new Set(proposal.criteria.map(c=>c.templateId)).size,proposal.criteria.length)
 assert(proposal.criteria.every(c=>c.title.trim()&&c.description.trim()&&c.descriptors.every(d=>d.text.trim())))
 if(caseId==='future'||caseId.startsWith('variant-')){
  const ids=proposal.criteria.map(c=>c.templateId)
  if(input.description.includes(' o '))assert(ids.includes('ing-4-feature-will-or-going-to'))
  else{assert(ids.includes('ing-4-feature-will'));assert(ids.includes('ing-4-feature-going-to'))}
  assert(ids.includes('ing-4-intelligibility'))
  if(caseId==='future')assert(ids.includes('ing-4-written'))
 }
 if(caseId==='delivery'){
  const rows=proposal.criteria.filter(c=>c.templateId.startsWith('delivery-'))
  assert.equal(rows.length,input.preferredInstrumentType==='lista-cotejo'?5:1)
  assert(proposal.criteria.some(c=>!c.templateId.startsWith('delivery-')))
  assert(proposal.criteria.filter(c=>c.templateId.startsWith('delivery-')).reduce((s,c)=>s+c.maxScoreUnits,0)<proposal.totalScoreUnits/2)
 }
 if(caseId==='brief-report'||caseId==='delivery'){
  const text=JSON.stringify(proposal.criteria)
  assert(!/texto literario seleccionado|procedimiento de la investigaci|pregunta investigada/.test(text))
  assert(/ideas principales|resume|resumen/i.test(text))
 }
 results.push({case:caseId,input,proposal})
 if(results.length%32===0)console.log(JSON.stringify({verified:results.length}))
 return proposal
}
for(let grade=1;grade<=6;grade++)for(const [id,code,description] of [
 ['mixed','ING','Elaboran una presentación oral y escrita en inglés con presente simple sobre información de un personaje ficticio.'],
 ['brief-report','LEN','Hacen un informe de lectura de una noticia'],
 ['brief-comparison','LEN','Comparan dos noticias'],
 ['delivery','LEN','Hacen un informe de lectura de una noticia. Entre una y tres páginas, interlineado 1,5, fuente Arial o Calibri, tamaño 12, sin portada.'],
])for(const format of formats)for(const total of [20,17.35])await check(inputFor(grade,code,description,format,total),id)
for(const format of formats)for(const total of [20,17.35])await check(inputFor(4,'ING',futureDescription,format,total,futureTitle),'future')
for(const format of formats)for(const total of [20,17.35]){
 const p=await check(inputFor(2,'MAT','Los estudiantes resuelven ejercicios de suma y resta',format,total),'action-only-exercises')
 assert.equal(p.activityType,'EXERCISE_SET');assert.equal(p.criteria.length,2);assert(p.internalTrace.reasons.includes('coverage=ACTION_ONLY'))
}
for(const [index,wording] of ['utilizando will y going to','utilizando las estructuras gramaticales will y going to','deben usar las formas de futuro will y going to','con will y going to','usando will o going to, a elección'].entries())for(const format of formats)for(const total of [20,17.35])await check(inputFor(4,'ING',`Presentan sus planes en inglés ${wording}`,format,total),`variant-${index}`)
for(const [id,description] of [
 ['typo','Precentan sus planes en ingles utilisando will y going to'],
 ['english','Write a message using will and going to.'],
 ['referent','Escribirán en inglés un mensaje con presente simple sobre George Washington.'],
 ['negative','Presentan sus planes en inglés. No deben usar will ni going to. Como recurso: video usando will y going to.'],
])for(const format of formats){
 const p=await check(inputFor(4,'ING',description,format),id)
 if(id==='negative')assert(!p.criteria.some(c=>/feature-(?:will|going-to)/.test(c.templateId)))
 if(id==='referent')assert(!/presidente|nacio|nació|1732|1799/.test(JSON.stringify(p.criteria)))
}
for(const description of [futureDescription,'Presentan sus planes en inglés con will y going to','Escriben en inglés un correo electrónico','Leerán en inglés un curriculum vitae e identificarán la experiencia y capacidades.']){
 const input=inputFor(4,'ING',description,'rubrica'),{maxScore,participationMode,preferredInstrumentType,...interpretInput}=input
 const interpretation=await request('/evaluation-instruments/interpret',interpretInput)
 selections.push({input:interpretInput,interpretation})
 assert.equal(interpretation.suggestedInstrumentType,description.startsWith('Leer')?'lista-cotejo':'rubrica')
}
for(const description of ['Hacen un informe de lectura de una noticia. Mínimo cinco páginas y máximo tres páginas.','Escriben un informe. Con portada. Sin portada.']){
 const input=inputFor(1,'LEN',description,'rubrica'),{maxScore,participationMode,preferredInstrumentType,...interpretInput}=input
 for(const [path,body] of [['/evaluation-instruments/interpret',interpretInput],['/evaluation-instruments/recommend',input]]){
  const error=await requestResult(path,body);assert.equal(error.status,400);assert(JSON.stringify(error.body).includes('contradictorios'));rejections.push({path,input:body,error})
 }
}
const candidateInput=inputFor(4,'ING',futureDescription,'rubrica',20,futureTitle),pool=await request('/evaluation-instruments/recommend',{...candidateInput,includeAdditionalCandidates:true})
assert.deepEqual(pool.criteria.map(c=>c.templateId),results.find(r=>r.case==='future'&&r.input.preferredInstrumentType==='rubrica').proposal.criteria.map(c=>c.templateId))
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/consignas-servicio-69.json',JSON.stringify({health,results,selections,rejections,candidatePool:{input:candidateInput,proposal:pool},limits:'HTTP uses positive totals; pending score is verified in editor contracts and browser. Action-only cases do not prove grade-specific curriculum coverage.'},null,2)+'\n')
console.log(JSON.stringify({responses:results.length,interpretations:selections.length,rejections:rejections.length,candidates:pool.criteria.map(c=>c.templateId),status:'passed'}))
