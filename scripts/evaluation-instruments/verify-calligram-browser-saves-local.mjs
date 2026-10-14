import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const base='http://localhost:5173/api/v1'
const health=(await fetch(base+'/health').then(r=>r.json())).data
assert.equal(health.development.supabaseOrigin,'http://127.0.0.1:54321')
assert.equal(health.development.catalogVersion,'evaluation-2026.17')
const context=JSON.parse(readFileSync('.dev-qa-context.local','utf8'))
const login=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:readFileSync('.dev-qa-account.local','utf8')})
assert.equal(login.status,201)
const cookie=login.headers.getSetCookie().find(v=>v.startsWith('aulabase_session='))?.split(';')[0]
assert(cookie)
const response=await fetch(base+'/activities',{headers:{cookie}})
assert.equal(response.status,200)
const activities=(await response.json()).data
const saved=activities.filter(row=>row.name.startsWith('QA caligrama · '))
const proposals=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/evidencias/caligrama-servicio-normal.json','utf8')).results
const fixtureByType={rubrica:'calligram-creation','lista-cotejo':'calligram-analysis',escala:'calligram-recitation','lista-ponderada':'calligram-comparison'}
assert.equal(saved.length,4)
assert.equal(new Set(saved.map(row=>row.instrumentType)).size,4)
for(const row of saved) {
  const snapshot=row.instrumentSnapshot,fields=row.instrumentCriteria
  const expected=proposals.find(result=>!result.neutral&&result.maxScore===row.maxScore&&result.fixture===fixtureByType[row.instrumentType]&&result.proposal.instrumentType===row.instrumentType)?.proposal
  assert(expected)
  assert.deepEqual(snapshot.criteria.map(c=>c.templateId),expected.criteria.map(c=>c.templateId))
  assert.deepEqual(snapshot.criteria.map(c=>c.maxScoreUnits),expected.criteria.map(c=>c.maxScoreUnits))
  assert.deepEqual(snapshot.criteria.map(c=>c.description),expected.criteria.map(c=>c.description))
  // Persistence represents native yes/no/partial options as grading levels;
  // only rubric/scale carry authored performance descriptors from the service.
  if(row.instrumentType==='rubrica'||row.instrumentType==='escala') assert.deepEqual(snapshot.criteria.map(c=>c.descriptors.map(d=>d.text)),expected.criteria.map(c=>c.descriptors.map(d=>d.text)))
  assert.equal(snapshot.catalogVersion,'evaluation-2026.17')
  assert.equal(snapshot.curriculumVersionId,context.versionId)
  assert(snapshot.curriculumScopeId)
  assert.equal(snapshot.internalTrace.mappingStatus,'RESOLVED')
  assert.equal(snapshot.totalScoreUnits,Math.round(row.maxScore*100))
  assert.equal(snapshot.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0),snapshot.totalScoreUnits)
  assert.equal(new Set(snapshot.criteria.map(c=>c.id)).size,snapshot.criteria.length)
  for(const [index,c] of snapshot.criteria.entries()) {
    assert(c.templateId.startsWith('calligram-'))
    assert.equal(c.id,fields[`${row.instrumentType}:criterion-id:${index}`])
    assert.equal(c.templateId,fields[`${row.instrumentType}:criterion-template:${index}`])
    assert.equal(c.title,fields[`${row.instrumentType}:criterion:${index}`])
  }
  assert(fields[`${row.instrumentType}:criterion:1`].includes('revisión docente'))
  if(row.instrumentType==='rubrica') {
    assert(snapshot.criteria[0].descriptors.at(-1).text.includes('No establece una relación reconocible'))
    assert(JSON.stringify(snapshot.criteria).includes('sin exigir rima'))
  }
  if(row.instrumentType==='escala') {
    assert.equal(snapshot.criteria.length,3)
    assert(snapshot.criteria[0].descriptors.at(-1).text.includes('No comunica un texto reconocible'))
    assert(!/responde preguntas|volumen|ritmo/i.test(JSON.stringify(snapshot.criteria)))
  }
  if(row.instrumentType==='lista-ponderada') {
    assert(snapshot.criteria.every(c=>c.description.includes('Parcial (50%):')))
    assert.equal(snapshot.criteria.length,4)
    assert(!snapshot.criteria.some(c=>c.templateId==='calligram-conclusion'))
  }
}
const historical=activities.filter(row=>row.instrumentSnapshot?.catalogVersion==='evaluation-2026.14')
assert.equal(historical.length,7)
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/caligrama-guardados-reabiertos.json',JSON.stringify({health,authentication:'PASSWORD_LOGIN_REAL',saved,historical:historical.map(row=>({id:row.id,name:row.name,catalogVersion:row.instrumentSnapshot.catalogVersion}))},null,2)+'\n')
assert.equal(activities.filter(row=>row.instrumentSnapshot?.catalogVersion==='evaluation-2026.15').length,4)
assert.equal(activities.filter(row=>row.instrumentSnapshot?.catalogVersion==='evaluation-2026.16').length,4)
console.log('Cuatro formatos de caligrama guardados y reabiertos: textos manuales, celdas, identidades, procedencia, ámbito y puntos exactos confirmados. Controles .14/.15/.16 conservados.')
