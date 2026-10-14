import assert from 'node:assert/strict'
import {readFileSync,readdirSync,writeFileSync} from 'node:fs'
import {localClient,fingerprint} from './language-local-client.mjs'
const {request,health}=await localClient(),current=await request('/activities')
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const initial=JSON.parse(readFileSync(root+'lengua-comun-historicos.json','utf8'))
for(const record of initial.snapshots){
  const activity=current.find(a=>a.id===record.id);assert(activity)
  assert.equal(fingerprint({snapshot:activity.instrumentSnapshot,maxScore:activity.maxScore,instrumentType:activity.instrumentType}),record.hash)
}
const complete=[]
for(const file of readdirSync(root).filter(name=>/^(?:lengua|ingles)-\d+-(?:procedimientos-|cierre-|final-|funciones-|gramatica-|lexico-|estrategias-)?persistencia.json$/.test(name))) {
  for(const prior of JSON.parse(readFileSync(root+file,'utf8')).activities) {
    const actual=current.find(a=>a.id===prior.id);assert(actual)
    assert.deepEqual(actual.instrumentSnapshot,prior.instrumentSnapshot)
    assert.deepEqual(actual.instrumentCriteria,prior.instrumentCriteria)
    assert.equal(actual.maxScore,prior.maxScore)
    assert.equal(actual.instrumentType,prior.instrumentType)
    complete.push(prior.id)
  }
}
const report={verifiedAt:new Date().toISOString(),health,baselineSnapshotsPreserved:initial.snapshots.length,fullInstrumentsPreserved:[...new Set(complete)],currentSnapshots:current.filter(a=>a.instrumentSnapshot).length}
writeFileSync(root+`lengua-historicos-${health.development.catalogVersion}.json`,JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({baseline:initial.snapshots.length,fullInstruments:report.fullInstrumentsPreserved.length,current:report.currentSnapshots}))
