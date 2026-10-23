import test from 'node:test'
import assert from 'node:assert/strict'
import {EventEmitter} from 'node:events'
import {assertPreservedDevelopmentHistory,readDevelopmentHistoryFromClient} from './development-history.mjs'
const baseline={releases:[{version:'evaluation-2026.141',hash:'a'.repeat(32)}],snapshots:[{id:'old-snapshot',hash:'b'.repeat(32)}]}
test('acepta un checkpoint sin campo de proyecto solo si todas sus huellas coinciden con la lectura efectiva',()=>{
 assert.doesNotThrow(()=>assertPreservedDevelopmentHistory(baseline,structuredClone(baseline)))
 assert.doesNotThrow(()=>assertPreservedDevelopmentHistory(baseline,{releases:[...baseline.releases,{version:'evaluation-2026.142',hash:'c'.repeat(32)}],snapshots:baseline.snapshots}))
})
test('rechaza un proyecto declarado distinto y cualquier pérdida o cambio de huella antes de escribir',()=>{
 assert.throws(()=>assertPreservedDevelopmentHistory({...baseline,project:'otro-proyecto'},baseline))
 assert.throws(()=>assertPreservedDevelopmentHistory(baseline,{releases:[],snapshots:baseline.snapshots}))
 assert.throws(()=>assertPreservedDevelopmentHistory(baseline,{releases:baseline.releases,snapshots:[{id:'old-snapshot',hash:'c'.repeat(32)}]}))
})

class ReadClient extends EventEmitter{
 queries=[]
 ended=false
 async connect(){}
 async query(sql){
  this.queries.push(sql)
  if(sql.includes('evaluation_catalog_releases'))return{rows:baseline.releases}
  if(sql.includes('evaluation_instrument_snapshots'))return{rows:baseline.snapshots}
  return{rows:[]}
 }
 async end(){this.ended=true}
}
test('lee las dos huellas en una sola transacción de solo lectura y cierra el cliente',async()=>{
 const client=new ReadClient()
 assert.deepEqual(await readDevelopmentHistoryFromClient(client),baseline)
 assert.equal(client.queries[0],'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY')
 assert.equal(client.queries.at(-1),'COMMIT')
 assert.equal(client.ended,true)
})
test('un error de conexión entre consultas rechaza la conservación y cierra sin un evento no controlado',async()=>{
 const client=new ReadClient(),error=Object.assign(new Error('Conexión interrumpida'),{code:'ECONNRESET'})
 client.connect=async()=>{queueMicrotask(()=>client.emit('error',error))}
 await assert.rejects(readDevelopmentHistoryFromClient(client),e=>e===error)
 assert.equal(client.queries.length,0)
 assert.equal(client.ended,true)
})
test('un timeout de consulta conserva el fallo y no devuelve una historia parcial',async()=>{
 const client=new ReadClient(),read=client.query.bind(client),error=Object.assign(new Error('Consulta agotada'),{code:'QUERY_TIMEOUT'})
 client.query=async sql=>{if(sql.includes('evaluation_instrument_snapshots'))throw error;return read(sql)}
 await assert.rejects(readDevelopmentHistoryFromClient(client),e=>e===error)
 assert(!client.queries.includes('COMMIT'))
 assert.equal(client.ended,true)
})
