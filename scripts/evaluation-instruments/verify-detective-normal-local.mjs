import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const base='http://localhost:5173/api/v1'
const context=JSON.parse(readFileSync('.dev-qa-context.local','utf8'))
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/detective-grade-one-regressions.json','utf8'))
const health=(await fetch(base+'/health').then(r=>r.json())).data
assert.equal(health.development.supabaseOrigin,'http://127.0.0.1:54321')
assert.equal(health.development.catalogVersion,'evaluation-2026.16')
const login=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:readFileSync('.dev-qa-account.local','utf8')})
assert.equal(login.status,201)
const cookie=login.headers.getSetCookie().find(value=>value.startsWith('aulabase_session='))?.split(';')[0]
assert(cookie)
const request=async(input)=>{
  const response=await fetch(base+'/evaluation-instruments/recommend',{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify(input)})
  assert.equal(response.status,200)
  return (await response.json()).data
}
const results=[]
for(const fixture of fixtures) for(const neutral of [false,true]) for(const maxScore of [20,17.35]) for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
  const input={sectionSubjectId:context.assignments.find(row=>row.grade===1&&row.code==='LEN').id,activityTitle:neutral?'Actividad 1':fixture.activityTitle,description:fixture.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType}
  const proposal=await request(input)
  assert.equal(proposal.catalogVersion,'evaluation-2026.16')
  assert.equal(proposal.curriculumVersionId,context.versionId)
  assert(proposal.curriculumScopeId)
  assert.equal(proposal.internalTrace.mappingStatus,'RESOLVED')
  assert.equal(proposal.activityType,fixture.activityType)
  assert.equal(proposal.instrumentType,preferredInstrumentType)
  assert.equal(proposal.totalScoreUnits,Math.round(maxScore*100))
  assert(proposal.criteria.every(row=>row.templateId.startsWith('detective-')))
  assert(!JSON.stringify(proposal.criteria).includes(fixture.activityTitle))
  assert(!/responde preguntas/i.test(JSON.stringify(proposal.criteria)))
  if(preferredInstrumentType==='lista-ponderada') assert(proposal.criteria.every(row=>row.description.includes('Parcial (50%):')))
  results.push({fixture:fixture.id,neutral,maxScore,input,proposal})
}
const regressions=[]
for(const file of ['science-regressions','math-regressions','news-grade-one-regressions','guide-grade-one-regressions','reading-report-grade-one-regressions','poster-grade-one-regressions']) {
  const controls=JSON.parse(readFileSync(`data/evaluation-instruments/${file}.json`,'utf8'))
  for(const control of controls.slice(0,['science-regressions','math-regressions'].includes(file)?2:1)) {
    const proposal=await request({sectionSubjectId:context.assignments.find(row=>row.grade===control.grade&&row.code===control.code).id,activityTitle:'Actividad 1',description:control.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'})
    assert(proposal.criteria.every(row=>row.templateId.startsWith(control.templatePrefix??`science-${control.id}-`)))
    regressions.push({fixture:control.id,proposal})
  }
}
const focused=await request({sectionSubjectId:context.assignments.find(row=>row.grade===1&&row.code==='LEN').id,activityTitle:'El afiche',description:'Analizarán un cuento policíaco para identificar el narrador y relacionar las pistas con el desenlace.',maxScore:20,participationMode:'INDIVIDUAL'})
assert.deepEqual(focused.criteria.map(row=>row.templateId),['detective-narrator','detective-clues'])
assert(!/afiche|ambiente|recursos literarios/i.test(JSON.stringify(focused.criteria)))
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/cuento-servicio-normal.json',JSON.stringify({health,authentication:'PASSWORD_LOGIN_REAL',proxy:base,results,regressions,focused},null,2)+'\n')
console.log(`${results.length} propuestas de cuento policíaco y ${regressions.length} regresiones, más análisis focalizado: servicio normal verificado.`)
