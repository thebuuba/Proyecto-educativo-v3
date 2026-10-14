import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const base='http://localhost:5173/api/v1'
const context=JSON.parse(readFileSync('.dev-qa-context.local','utf8'))
const fixture=JSON.parse(readFileSync('data/evaluation-instruments/novel-task-regression.json','utf8'))
const health=(await fetch(base+'/health').then(r=>r.json())).data
assert.equal(health.development.supabaseOrigin,'http://127.0.0.1:54321')
assert.equal(health.development.catalogVersion,'evaluation-2026.19')
const login=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:readFileSync('.dev-qa-account.local','utf8')})
assert.equal(login.status,201)
const cookie=login.headers.getSetCookie().find(v=>v.startsWith('aulabase_session='))?.split(';')[0]
assert(cookie)
const request=async(input)=>{
  const r=await fetch(base+'/evaluation-instruments/recommend',{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify(input)})
  assert.equal(r.status,200)
  return (await r.json()).data
}
const assignment=(grade,code)=>context.assignments.find(r=>r.grade===grade&&r.code===code).id
const standard={sectionSubjectId:assignment(5,'LEN'),description:fixture.description,participationMode:'INDIVIDUAL'}
const results=[]
for(const activityTitle of [fixture.activityTitle,'Actividad 1','La noticia']) for(const maxScore of [15,20,17.35]) for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
  const input={...standard,activityTitle,maxScore,preferredInstrumentType}
  const proposal=await request(input)
  assert.equal(proposal.activityType,'ANALYSIS');assert.equal(proposal.instrumentType,preferredInstrumentType)
  assert.equal(proposal.catalogVersion,'evaluation-2026.19');assert(proposal.curriculumScopeId)
  assert.equal(proposal.curriculumVersionId,context.versionId);assert.equal(proposal.internalTrace.mappingStatus,'RESOLVED')
  assert.equal(proposal.totalScoreUnits,Math.round(maxScore*100))
  assert(proposal.criteria.every(c=>c.templateId.startsWith('novel-analysis-')))
  assert.equal(proposal.criteria.length,5)
  assert(!/del las|convenciones del género|exposición oral|inventa.*desenlace/.test(JSON.stringify(proposal.criteria)))
  const baseline=results.find(r=>r.maxScore===maxScore&&r.proposal.instrumentType===preferredInstrumentType)
  if(baseline) assert.deepEqual(proposal.criteria,baseline.proposal.criteria)
  results.push({fixture:fixture.id,neutral:activityTitle!==fixture.activityTitle,maxScore,input,proposal})
}
const candidates=[]
for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
  const proposal=await request({...standard,activityTitle:fixture.activityTitle,maxScore:15,preferredInstrumentType,includeAdditionalCandidates:true})
  assert.equal(proposal.criteria.length,6);assert.equal(proposal.criteria.at(-1).templateId,'novel-analysis-limits')
  candidates.push(proposal)
}
const contrasts=[]
for(const control of [
  {grade:5,code:'LEN',description:'Escribirán una narración policíaca con personajes, ambiente, conflicto, pistas y una resolución coherente.',expected:'WRITTEN_PRODUCTION'},
  {grade:5,code:'LEN',description:'Prepararán preguntas para analizar una entrevista escrita y justificarán sus interpretaciones con evidencias.',expected:'ANALYSIS'},
  {grade:6,code:'NAT-FIS',description:'Elaborarán un informe sobre una investigación científica del movimiento, explicando el procedimiento, los datos obtenidos y sus conclusiones.',expected:'REPORT'},
  {grade:5,code:'MAT',description:'Redactarán una explicación escrita de un procedimiento matemático y justificarán cada paso con ejemplos.',expected:'ANALYSIS'},
]) {
  const proposal=await request({sectionSubjectId:assignment(control.grade,control.code),activityTitle:fixture.activityTitle,description:control.description,maxScore:15,participationMode:'INDIVIDUAL'})
  assert.equal(proposal.activityType,control.expected)
  assert(!proposal.criteria.some(c=>c.templateId.startsWith('novel-analysis')))
  if(control.expected!=='WRITTEN_PRODUCTION') assert(!/convenciones del género|recursos del género literario/.test(JSON.stringify(proposal.criteria)))
  contrasts.push({control,proposal})
}
const regressions=[]
for(const file of ['science-regressions','math-regressions','news-grade-one-regressions','poster-grade-one-regressions','calligram-grade-one-regressions']) {
  const controls=JSON.parse(readFileSync(`data/evaluation-instruments/${file}.json`,'utf8')).slice(0,2)
  for(const control of controls) {
    const proposal=await request({sectionSubjectId:assignment(control.grade,control.code),activityTitle:'Actividad 1',description:control.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'})
    assert(proposal.criteria.every(c=>c.templateId.startsWith(control.templatePrefix??`science-${control.id}-`)))
    regressions.push({fixture:control.id,proposal})
  }
}
const activities=await fetch(base+'/activities',{headers:{cookie}}).then(r=>r.json()).then(r=>r.data)
const historical=activities.filter(r=>r.instrumentSnapshot).map(r=>({id:r.id,name:r.name,hash:createHash('sha256').update(JSON.stringify(r.instrumentSnapshot)).digest('hex')}))
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/novela-servicio-normal.json',JSON.stringify({health,authentication:'PASSWORD_LOGIN_REAL',results,candidates,contrasts,regressions,historical},null,2)+'\n')
console.log(`${results.length} propuestas, ${candidates.length} candidatos, ${contrasts.length} contrastes, ${regressions.length} regresiones; ${historical.length} snapshots históricos registrados.`)
