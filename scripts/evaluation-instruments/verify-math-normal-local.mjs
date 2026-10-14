import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const base='http://localhost:5173/api/v1'
const context=JSON.parse(readFileSync('.dev-qa-context.local','utf8'))
const fixtures=JSON.parse(readFileSync('data/evaluation-instruments/math-regressions.json','utf8'))
const health=(await fetch(base+'/health').then(r=>r.json())).data
assert.equal(health.development.supabaseOrigin,'http://127.0.0.1:54321')
assert.equal(health.development.catalogVersion,'evaluation-2026.14')
const login=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:readFileSync('.dev-qa-account.local','utf8')})
assert.equal(login.status,201)
const cookie=login.headers.getSetCookie().find(value=>value.startsWith('aulabase_session='))?.split(';')[0]
assert(cookie)
const request=async(path,input)=>{
  const response=await fetch(base+path,{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify(input)})
  assert.equal(response.status,200,path)
  return (await response.json()).data
}
const results=[]
for(const fixture of fixtures) for(const neutral of [false,true]) {
  const input={sectionSubjectId:context.assignments.find(row=>row.grade===fixture.grade && row.code===fixture.code).id,
    activityTitle:neutral ? 'Actividad 1' : fixture.activityTitle,description:fixture.description}
  const interpretation=await request('/evaluation-instruments/interpret',input)
  for(const maxScore of [20,17.35]) for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
    const proposal=await request('/evaluation-instruments/recommend',{...input,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType})
    assert.equal(proposal.catalogVersion,'evaluation-2026.14')
    assert.equal(proposal.curriculumVersionId,context.versionId)
    assert(proposal.curriculumScopeId,'El ámbito curricular no está resuelto.')
    assert.equal(proposal.internalTrace.mappingStatus,'RESOLVED')
    assert.equal(proposal.instrumentType,preferredInstrumentType)
    assert.equal(proposal.totalScoreUnits,Math.round(maxScore*100))
    assert(proposal.criteria.every(row=>row.templateId.startsWith(fixture.templatePrefix)))
    assert(proposal.criteria.every(row=>!row.description.includes(fixture.activityTitle)))
    assert(!JSON.stringify(proposal.criteria).includes('construye físicamente'))
    if(preferredInstrumentType==='lista-ponderada') assert(proposal.criteria.every(row=>row.description.includes('Parcial (50%):')))
    results.push({fixture:fixture.id,neutral,maxScore,interpretation,proposal})
  }
}
const matrix=fixtures[0]
const input={sectionSubjectId:context.assignments.find(row=>row.grade===5&&row.code==='MAT').id,activityTitle:'Actividad 1',description:matrix.description+' Comprobarán los resultados con los datos originales.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica',includeAdditionalCandidates:true}
const candidates=await request('/evaluation-instruments/recommend',input)
assert.equal(candidates.criteria.length,6)
assert.equal(candidates.criteria.at(-1).templateId,'math-matrices-verification')
const regressions=[]
for(const file of ['science-regressions','news-grade-one-regressions','guide-grade-one-regressions','reading-report-grade-one-regressions']) {
  const controls=JSON.parse(readFileSync(`data/evaluation-instruments/${file}.json`,'utf8'))
  for(const control of controls.slice(0,file==='science-regressions' ? 2 : 1)) {
  for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
    const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:context.assignments.find(row=>row.grade===control.grade&&row.code===control.code).id,
      activityTitle:'Actividad 1',description:control.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType})
    assert(proposal.criteria.every(row=>row.templateId.startsWith(control.templatePrefix ?? `science-${control.id}-`)))
    regressions.push({fixture:control.id,proposal})
  }
  }
}
const crossTasks=[{grade:6,code:'NAT-FIS',title:'Ley de Ohm',description:'Resolverán problemas de densidad y explicarán los resultados.',excluded:'science-ohm-'},
  {grade:1,code:'LEN',title:'Informe de lectura',description:'Elaborarán una guía turística de dos lugares de la comunidad.',expected:'guide-'},
  {grade:2,code:'LEN',title:'La guía turística',description:'Redactarán un informe de lectura con resumen.',expected:'len-2-informe-de-lectura-'}]
for(const task of crossTasks) {
  const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:context.assignments.find(row=>row.grade===task.grade&&row.code===task.code).id,
    activityTitle:task.title,description:task.description,maxScore:20,participationMode:'INDIVIDUAL'})
  if(task.excluded) {
    assert(!proposal.criteria.some(row=>row.templateId.startsWith(task.excluded)))
    assert(!/ohm|electricidad|voltaje|corriente/i.test(JSON.stringify(proposal.criteria)))
    assert(!proposal.selectedCurriculumElements.some(row=>/ohm|electricidad/i.test(row.text)))
  }
  if(task.expected) assert(proposal.criteria.every(row=>row.templateId.startsWith(task.expected)))
  regressions.push({fixture:'incompatible-'+task.grade+'-'+task.code,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/matematica-servicio-normal.json',JSON.stringify({health,authentication:'PASSWORD_LOGIN_REAL',proxy:base,results,additional:{input,proposal:candidates},regressions},null,2)+'\n')
console.log(`${results.length} instrumentos matemáticos, un candidato adicional y ${regressions.length} regresiones cruzadas verificados en el servicio normal local.`)
