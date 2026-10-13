import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const baseline=JSON.parse(readFileSync(root+'novela-servicio-normal.json','utf8'))
const ui=JSON.parse(readFileSync(root+'novela-flujo-navegador.json','utf8'))
const fixture=JSON.parse(readFileSync('data/evaluation-instruments/novel-task-regression.json','utf8'))
const context=JSON.parse(readFileSync('.dev-qa-context.local','utf8'))
const base='http://localhost:5173/api/v1'
const health=(await fetch(base+'/health').then(r=>r.json())).data
assert.equal(health.development.supabaseOrigin,'http://127.0.0.1:54321')
assert.equal(health.development.catalogVersion,'evaluation-2026.19')
const login=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:readFileSync('.dev-qa-account.local','utf8')})
assert.equal(login.status,201)
const cookie=login.headers.getSetCookie().find(v=>v.startsWith('aulabase_session='))?.split(';')[0]
assert(cookie)
const response=await fetch(base+'/activities',{headers:{cookie}})
assert.equal(response.status,200)
const activities=(await response.json()).data
const saved=activities.filter(row=>row.instrumentSnapshot?.catalogVersion==='evaluation-2026.19'&&(row.name===fixture.activityTitle||row.name.startsWith('QA novela · ')))
assert.equal(saved.length,4)
assert.equal(new Set(saved.map(row=>row.instrumentType)).size,4)
const reopened={rubrica:ui.rubricaReopened,'lista-cotejo':ui.cotejoReopened,escala:ui.escalaReopened,'lista-ponderada':ui.ponderadaReopened}
for(const row of saved) {
  const snapshot=row.instrumentSnapshot,fields=row.instrumentCriteria,type=row.instrumentType
  const expected=baseline.results.find(r=>!r.neutral&&r.maxScore===row.maxScore&&r.proposal.instrumentType===type)?.proposal
  assert(expected)
  assert.deepEqual(snapshot.criteria.slice(0,5).map(c=>c.templateId),expected.criteria.map(c=>c.templateId))
  assert.deepEqual(snapshot.criteria.slice(0,5).map(c=>c.description),expected.criteria.map(c=>c.description))
  assert.equal(snapshot.curriculumVersionId,context.versionId)
  assert.equal(snapshot.internalTrace.mappingStatus,'RESOLVED')
  assert(snapshot.curriculumScopeId)
  assert.equal(snapshot.totalScoreUnits,Math.round(row.maxScore*100))
  assert.equal(snapshot.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0),snapshot.totalScoreUnits)
  assert.equal(new Set(snapshot.criteria.map(c=>c.id)).size,snapshot.criteria.length)
  for(const [index,c] of snapshot.criteria.entries()) {
    assert.equal(c.id,fields[`${type}:criterion-id:${index}`])
    assert.equal(c.templateId,fields[`${type}:criterion-template:${index}`])
    assert.equal(c.title,fields[`${type}:criterion:${index}`])
    assert(reopened[type].includes(c.title))
    if(type==='rubrica'||type==='escala') for(const descriptor of c.descriptors) assert(reopened[type].includes(descriptor.text))
  }
  if(type==='rubrica') {
    assert.equal(snapshot.criteria.length,6)
    assert.equal(snapshot.criteria.at(-1).templateId,'novel-analysis-limits')
    for(const [index,c] of snapshot.criteria.entries()) {
      assert.equal(c.maxScoreUnits,Math.round(Number(ui.rubricaEdited.find(f=>f.label===`Puntos del criterio ${index+1}`).value)*100))
      for(const [level,d] of c.descriptors.entries()) assert.equal(d.text,ui.rubricaEdited.find(f=>f.label===`${snapshot.levels[level].label} del criterio ${index+1}`).value)
    }
    assert(snapshot.criteria[1].descriptors[1].text.includes('debe explicar mejor una conexión del fragmento'))
    assert.equal(snapshot.criteria[0].descriptors.at(-1).text,expected.criteria[0].descriptors.at(-1).text)
  } else {
    assert.deepEqual(snapshot.criteria.map(c=>c.maxScoreUnits),expected.criteria.map(c=>c.maxScoreUnits))
    if(type==='escala') assert.deepEqual(snapshot.criteria.map(c=>c.descriptors.map(d=>d.text)),expected.criteria.map(c=>c.descriptors.map(d=>d.text)))
  }
}
for(const original of baseline.historical) {
  const current=activities.find(row=>row.id===original.id)
  assert(current)
  assert.equal(createHash('sha256').update(JSON.stringify(current.instrumentSnapshot)).digest('hex'),original.hash)
}
writeFileSync(root+'novela-guardados-reabiertos.json',JSON.stringify({health,authentication:'PASSWORD_LOGIN_REAL',saved,historicalUnchanged:baseline.historical},null,2)+'\n')
console.log(`Cuatro formatos: servicio, editor, snapshot y reapertura coherentes; ${baseline.historical.length} snapshots históricos sin cambios.`)
