import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,fingerprint} from './language-local-client.mjs'

const grade=Number(process.argv[2]||1)
const run=process.argv[3]||'base'
assert(['base','procedimientos','cierre'].includes(run))
const prefix=`lengua-${grade}${run==='base'?'':'-'+run}`
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const ui=JSON.parse(readFileSync(`${root}${prefix}-flujo-navegador.json`,'utf8'))
assert(ui.every(record=>record.grade===grade),'Mixed grades in browser evidence')
const {request,health}=await localClient()
const names=new Set(ui.map(record=>record.name))
const saved=(await request('/activities')).filter(a=>names.has(a.name))
assert.equal(new Set(saved.map(a=>a.instrumentType)).size,4)
for(const evidence of ui) {
  const activity=saved.find(a=>a.name===evidence.name&&a.instrumentType===evidence.format)
  assert(activity)
  const proposal=activity.instrumentSnapshot
  assert.equal(proposal.catalogVersion,evidence.catalogVersion??'evaluation-2026.20')
  assert.equal(proposal.activityType,activity.pedagogicalActivityType)
  assert.equal(proposal.totalScoreUnits,Math.round(activity.maxScore*100))
  assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),proposal.totalScoreUnits)
  const fields=evidence.formFields??evidence.fields
  const savedValues=new Set(Object.values(activity.instrumentCriteria))
  for(const field of fields) {
    if(!field.value||!field.label||/instrumento|puntos|nivel/i.test(field.label)) continue
    assert(savedValues.has(field.value),`UI text not persisted: ${evidence.format}, ${field.label}`)
  }
  assert(JSON.stringify(proposal).includes('Ajuste manual del docente.'))
  evidence.activityId=activity.id
  evidence.snapshotId=activity.instrumentSnapshotId
  evidence.savedHash=fingerprint({snapshot:proposal,fields:activity.instrumentCriteria})
}
writeFileSync(`${root}${prefix}-flujo-navegador.json`,JSON.stringify(ui,null,2)+'\n')
writeFileSync(`${root}${prefix}-persistencia.json`,JSON.stringify({verifiedAt:new Date().toISOString(),health,activities:saved},null,2)+'\n')
console.log(JSON.stringify({grade,formats:4,activities:saved.map(a=>({id:a.id,format:a.instrumentType,score:a.maxScore})),uiTextsPreserved:true}))
