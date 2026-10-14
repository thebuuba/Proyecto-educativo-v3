import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,fingerprint,context} from './language-local-client.mjs'
const {request,health}=await localClient(),records=[]
for(const item of [{subject:'ING',prefix:'ingles',name:'Presentamos nuestra rutina diaria en inglés.',total:20,count:5},{subject:'LEN',prefix:'guia',name:'Descubrimos y promocionamos los atractivos de nuestra comunidad.',total:17.35,count:7}]) {
 const ui=JSON.parse(readFileSync(`.superpowers/criterios-${item.prefix}-despues.json`,'utf8'))
 const reopened=readFileSync(`.superpowers/criterios-${item.prefix}-reapertura.txt`,'utf8')
 const sectionSubjectId=context.assignments.find(x=>x.grade===1&&x.code===item.subject).id
 const activities=await request(`/activities?sectionSubjectId=${sectionSubjectId}&academicPeriodId=${context.periodId}`)
 const a=activities.find(a=>a.name===item.name)
 assert(a);assert.equal(a.maxScore,item.total)
 const snapshot=a.instrumentSnapshot,fields=a.instrumentCriteria,type=a.instrumentType
 assert.equal(type,'rubrica');assert.equal(snapshot.criteria.length,item.count)
 assert.equal(snapshot.catalogVersion,'evaluation-2026.46')
 assert.equal(snapshot.totalScoreUnits,Math.round(item.total*100))
 assert.equal(snapshot.criteria.reduce((n,r)=>n+r.maxScoreUnits,0),snapshot.totalScoreUnits)
 for(const [index,c] of snapshot.criteria.entries()) {
  assert.equal(fields[`${type}:criterion-id:${index}`],c.id)
  assert.equal(fields[`${type}:criterion-template:${index}`],c.templateId)
  assert.equal(Math.round(Number(fields[`${type}:points:${index}`])*100),c.maxScoreUnits)
  assert(c.title&&c.description&&c.descriptors.every(d=>d.text.trim()))
 }
 for(const field of ui.formFields.filter(f=>/^(Criterio|Destacado|Logrado|En proceso|Inicial)/.test(f.label)&&f.value)) {
  assert(Object.values(fields).includes(field.value),`Not persisted: ${item.subject} ${field.label}`)
  assert(reopened.includes(field.value),`Not reopened: ${item.subject} ${field.label}`)
 }
 assert(reopened.includes('Ajuste manual del docente.'))
 records.push({subject:item.subject,grade:1,format:type,name:item.name,activityId:a.id,snapshotId:a.instrumentSnapshotId,catalogVersion:snapshot.catalogVersion,formFields:ui.formFields,reopenedProof:reopened,identityAndPointParity:true,hash:fingerprint({snapshot,fields}),activity:a})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/criterios-flujo-navegador.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,records},null,2)+'\n')
console.log(JSON.stringify(records.map(r=>({subject:r.subject,id:r.activityId,snapshot:r.snapshotId,parity:true,reopened:true}))))
