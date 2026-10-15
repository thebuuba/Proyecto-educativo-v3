import assert from 'node:assert/strict'
import {readFileSync,readdirSync,writeFileSync,existsSync} from 'node:fs'
import {localClient,fingerprint} from './language-local-client.mjs'
import {reconcileActivityEvidence} from './history-reconciliation.mjs'
const {request,health}=await localClient(),current=await request('/activities')
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const englishGradeTwoBaselinePath=root+'ingles-2-historicos-base.json'
const englishGradeTwoBaseline=existsSync(englishGradeTwoBaselinePath)?JSON.parse(readFileSync(englishGradeTwoBaselinePath,'utf8')).snapshots:[]
for(const prior of englishGradeTwoBaseline){
  const actual=current.find(a=>a.id===prior.id);assert(actual)
  assert.equal(fingerprint({snapshot:actual.instrumentSnapshot,fields:actual.instrumentCriteria,maxScore:actual.maxScore,instrumentType:actual.instrumentType}),prior.hash)
}
const initial=JSON.parse(readFileSync(root+'lengua-comun-historicos.json','utf8'))
for(const record of initial.snapshots){
  const activity=current.find(a=>a.id===record.id);assert(activity)
  assert.equal(fingerprint({snapshot:activity.instrumentSnapshot,maxScore:activity.maxScore,instrumentType:activity.instrumentType}),record.hash)
}
const complete=[]
for(const file of readdirSync(root).filter(name=>name==='ingles-calidad-persistencia.json'||/^(?:lengua|ingles)-\d+-(?:procedimientos-|cierre-|final-|funciones-|gramatica-|lexico-|estrategias-|generos-|composicion-)?persistencia.json$/.test(name))) {
  for(const prior of JSON.parse(readFileSync(root+file,'utf8')).activities) {
    const actual=current.find(a=>a.id===prior.id);assert(actual)
    assert.deepEqual(actual.instrumentSnapshot,prior.instrumentSnapshot)
    assert.deepEqual(actual.instrumentCriteria,prior.instrumentCriteria)
    assert.equal(actual.maxScore,prior.maxScore)
    assert.equal(actual.instrumentType,prior.instrumentType)
    complete.push(prior.id)
  }
}
const reconciliation=reconcileActivityEvidence(current,complete,initial.snapshots.map(a=>a.id))
const report={verifiedAt:new Date().toISOString(),health,baselineSnapshotsPreserved:initial.snapshots.length,englishGradeTwoBaselinePreserved:englishGradeTwoBaseline.length,fullInstrumentsPreserved:[...new Set(complete)],currentSnapshots:current.filter(a=>a.instrumentSnapshot).length,
 countDefinitions:{currentSnapshots:'Legacy field: activities returned by GET /activities with a current instrumentSnapshot; not all database snapshot rows.',fullInstrumentsPreserved:'Unique activity IDs with complete persisted instrument evidence in the historical verification fixtures.',baselineSnapshotsPreserved:'Activity IDs in the 28 initial reference fingerprints; a separate evidence set.',englishGradeTwoBaselinePreserved:'108 activity fingerprints captured before grade two; overlaps other sets, never additive.'},reconciliation}
writeFileSync(root+`lengua-historicos-${health.development.catalogVersion}.json`,JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({baseline:initial.snapshots.length,fullInstruments:report.fullInstrumentsPreserved.length,current:report.currentSnapshots}))
