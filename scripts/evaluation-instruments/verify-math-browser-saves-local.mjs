import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const base='http://localhost:5173/api/v1'
const health=(await fetch(base+'/health').then(r=>r.json())).data
assert.equal(health.development.supabaseOrigin,'http://127.0.0.1:54321')
const login=await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:readFileSync('.dev-qa-account.local','utf8')})
assert.equal(login.status,201)
const cookie=login.headers.getSetCookie().find(value=>value.startsWith('aulabase_session='))?.split(';')[0]
assert(cookie)
const response=await fetch(base+'/activities',{headers:{cookie}})
assert.equal(response.status,200)
const trig=JSON.parse(readFileSync('data/evaluation-instruments/trigonometry-user-control.json','utf8'))
const activities=(await response.json()).data
const saved=activities.filter(row=>row.name==='Actividad 1 · QA matrices' || row.name==='QA ámbito matrices' || row.name==='QA pesos matrices' || row.name.startsWith('QA filas matrices · ') || row.name===trig.activityTitle)
assert.equal(saved.length,7,'Primero guardar los siete controles desde navegador.')
for(const row of saved) {
  const snapshot=row.instrumentSnapshot
  const fields=row.instrumentCriteria
  assert.equal(snapshot.catalogVersion,'evaluation-2026.14')
  assert.equal(snapshot.totalScoreUnits,Math.round(row.maxScore*100))
  assert.equal(snapshot.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0),Math.round(row.maxScore*100))
  assert.equal(new Set(snapshot.criteria.map(c=>c.id)).size,snapshot.criteria.length)
  assert(snapshot.criteria.every(c=>c.templateId.startsWith(row.name===trig.activityTitle ? 'math-trigonometry-' : 'math-matrices-')))
  for(const [index,c] of snapshot.criteria.entries()) {
    assert.equal(c.id,fields[`${row.instrumentType}:criterion-id:${index}`])
    assert.equal(c.templateId,fields[`${row.instrumentType}:criterion-template:${index}`])
    assert.equal(c.title,fields[`${row.instrumentType}:criterion:${index}`])
  }
  if(row.instrumentType==='lista-ponderada') assert(snapshot.criteria.every(c=>c.description.includes('Parcial (50%):')))
  if(row.name==='Actividad 1 · QA matrices' || row.instrumentType==='escala') {
    assert.equal(snapshot.levels.length,5)
    assert(snapshot.criteria.every(c=>new Set(c.descriptors.map(d=>d.text)).size===5))
  }
  if(row.name!==trig.activityTitle && row.name!=='QA ámbito matrices') assert(fields[`${row.instrumentType}:criterion:1`].includes('revisión docente'))
  if(row.name==='QA ámbito matrices') {
    assert.equal(snapshot.curriculumVersionId,'d98f8201-3cac-5da6-b855-38f7bb8c8011')
    assert.equal(snapshot.curriculumScopeId,'392f46f2-fbc7-5931-a290-c45a88a4f206')
    assert.equal(snapshot.internalTrace.mappingStatus,'RESOLVED')
  }
  if(row.name==='QA pesos matrices') {
    assert.equal(Number(fields['lista-ponderada:criterion-weight:5']),2)
    assert.equal(Number(fields['lista-ponderada:weight:5']),9.09)
    assert.equal(Number(fields['lista-ponderada:weight:0']),18.18)
  }
}
const historical=activities.filter(row=>['evaluation-2026.10','evaluation-2026.11','evaluation-2026.12','evaluation-2026.13'].includes(row.instrumentSnapshot?.catalogVersion))
assert.equal(historical.length,5,'Los cinco instrumentos históricos se conservan.')
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/matematica-guardados-reabiertos.json',JSON.stringify({health,authentication:'PASSWORD_LOGIN_REAL',saved,historical:historical.map(row=>({id:row.id,name:row.name,catalogVersion:row.instrumentSnapshot.catalogVersion}))},null,2)+'\n')
console.log('Siete controles de navegador persistidos; último ámbito curricular resuelto. Identidad, procedencia, textos manuales, peso relativo y totales exactos comprobados. Cinco instrumentos históricos conservados.')
