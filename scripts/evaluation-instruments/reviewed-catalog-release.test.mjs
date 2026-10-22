import test from 'node:test'
import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import {isDeepStrictEqual} from 'node:util'
const project='eolgunypmtgrsyrjzcld',catalog={version:'evaluation-2026.145',technicalModules:[{id:'mf056-4'}]}
async function install(db,options={project,version:catalog.version,catalog}){
 assert(existsSync(new URL('./reviewed-catalog-release.mjs',import.meta.url)),'Falta el instalador de release con comparación en servidor')
 return(await import('./reviewed-catalog-release.mjs')).installReviewedCatalogRelease(db,options)
}
function store(initial=null){
 const state={row:initial,writes:[],queries:[],concurrent:null}
 state.$queryRawUnsafe=async(sql,...values)=>{state.queries.push({sql,values});return state.row===null?[]:[{matches:isDeepStrictEqual(state.row,JSON.parse(values[1]))}]}
 state.evaluationCatalogRelease={create:async args=>{state.writes.push(args);if(state.concurrent){state.row=state.concurrent;throw Object.assign(new Error('Colisión simulada'),{code:'P2002'})}state.row=structuredClone(args.data.payload);return{version:args.data.version}}}
 return state
}
test('un release ya exacto devuelve UNCHANGED sin escribir ni descargar el payload',async()=>{
 const db=store(structuredClone(catalog));assert.equal(await install(db),'UNCHANGED');assert.deepEqual(db.writes,[])
 assert.match(db.queries[0].sql,/payload\s*=\s*\$2::jsonb/);assert.deepEqual(db.queries[0].values,[catalog.version,JSON.stringify(catalog)])
})
test('crea solo el release pedido y la repetición no escribe',async()=>{
 const db=store();assert.equal(await install(db),'CREATED');assert.equal(await install(db),'UNCHANGED');assert.equal(db.writes.length,1)
 assert.deepEqual(db.writes[0],{data:{version:catalog.version,payload:catalog},select:{version:true}})
})
test('rechaza un release conflictivo existente sin repararlo',async()=>{
 const db=store({...catalog,technicalModules:[]});await assert.rejects(install(db),/contenido diferente/);assert.deepEqual(db.writes,[])
})
test('una creación concurrente solo se acepta si el payload es idéntico',async()=>{
 const db=store();db.concurrent=structuredClone(catalog);assert.equal(await install(db),'UNCHANGED')
 const bad=store();bad.concurrent={...catalog,technicalModules:[]};await assert.rejects(install(bad),/contenido diferente/)
})
test('rechaza otro proyecto o una versión distinta antes de consultar DB',async()=>{
 for(const options of [{project:'otro',version:catalog.version,catalog},{project,version:'evaluation-2026.144',catalog},{project,version:'otra',catalog:{version:'otra'}}]){
  const db=store();await assert.rejects(install(db,options));assert.deepEqual(db.writes,[]);assert.deepEqual(db.queries,[])
 }
})
