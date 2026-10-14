import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {localClient,fingerprint} from './language-local-client.mjs'

const file='docs/curriculum/cobertura-secundaria/evidencias/lengua-comun-historicos.json'
const {request,health}=await localClient()
const snapshots=(await request('/activities')).filter(a=>a.instrumentSnapshot).map(a=>({id:a.id,hash:fingerprint({snapshot:a.instrumentSnapshot,fields:a.instrumentFields,maxScore:a.maxScore,instrumentType:a.instrumentType})}))
if(existsSync(file)) {
  const before=JSON.parse(readFileSync(file,'utf8'))
  for(const row of before.snapshots) assert.deepEqual(snapshots.find(s=>s.id===row.id),row,`Historic snapshot changed: ${row.id}`)
  console.log(JSON.stringify({verified:before.snapshots.length,current:snapshots.length}))
} else {
  writeFileSync(file,JSON.stringify({capturedAt:new Date().toISOString(),health,snapshots},null,2)+'\n')
  console.log(JSON.stringify({baseline:snapshots.length}))
}
