import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {mf002SourceManifest} from './reviewed-mf002-source.mjs'
import {installMf002Source} from './install-reviewed-mf002-development.mjs'
const manifest=mf002SourceManifest(JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-mf002-4-matriz.json','utf8')))
const published=()=>({...structuredClone(manifest.version),status:'PUBLISHED'})
function store(version=published()){
 const writes=[],data={curriculumVersion:version?[version]:[],curriculumDocument:structuredClone(manifest.documents),curriculumScope:[structuredClone(manifest.scope)],curriculumElement:structuredClone(manifest.elements),curriculumSourceSpan:structuredClone(manifest.spans)}
 if(!version)for(const model of Object.keys(data))data[model]=[]
 const db={writes,data}
 for(const model of Object.keys(data))db[model]={
  findUnique:async()=>data[model][0]??null,
  findMany:async()=>structuredClone(data[model]),
  create:async({data:row})=>{writes.push([model,'create']);data[model].push(row)},
  createMany:async({data:rows})=>{writes.push([model,'createMany']);data[model]=structuredClone(rows)},
  update:async({data:row})=>{writes.push([model,'update',row.status]);Object.assign(data[model][0],row)},
 }
 db.$transaction=async run=>{writes.push(['transaction']);return run(db)}
 return db
}
test('repetir la fuente ya publicada verifica todos los documentos y literales sin escritura',async()=>{
 const db=store()
 assert.equal(await installMf002Source(db,manifest),'UNCHANGED')
 assert.deepEqual(db.writes,[])
})
test('una fuente existente alterada o incompleta se rechaza sin repararla ni sobrescribirla',async()=>{
 for(const alter of [
  db=>db.data.curriculumVersion[0].status='DRAFT',
  db=>db.data.curriculumVersion[0].importMetadata={},
  db=>db.data.curriculumVersion[0].level='PRIMARY',
  db=>db.data.curriculumDocument.pop(),
  db=>db.data.curriculumElement[0].originalText+=' alterado',
  db=>db.data.curriculumSourceSpan.pop(),
 ]){
  const db=store();alter(db)
  await assert.rejects(installMf002Source(db,manifest))
  assert.deepEqual(db.writes,[])
 }
})
test('la creación está dentro de una transacción y una falla impide publicar',async()=>{
 const db=store(null)
 db.curriculumElement.createMany=async()=>{throw Error('Fallo simulado de inserción')}
 await assert.rejects(installMf002Source(db,manifest),/Fallo simulado/)
 assert.deepEqual(db.writes[0],['transaction'])
 assert(!db.writes.some(w=>w[0]==='curriculumVersion'&&w[1]==='update'))
})
test('crea una fuente nueva y la siguiente ejecución no escribe',async()=>{
 const db=store(null)
 assert.equal(await installMf002Source(db,manifest),'CREATED')
 assert.deepEqual(db.writes.slice(-2),[['curriculumVersion','update','VALIDATED'],['curriculumVersion','update','PUBLISHED']])
 const count=db.writes.length
 assert.equal(await installMf002Source(db,manifest),'UNCHANGED')
 assert.equal(db.writes.length,count)
})
test('rechaza otro destino antes de consultar y respeta la unicidad de referencias del esquema',async()=>{
 await assert.rejects(installMf002Source({}, {...manifest,project:'otro-proyecto'}))
 await assert.rejects(installMf002Source({}, {...manifest,code:'OTRO_MODULO'}))
 const keys=manifest.spans.map(s=>[s.elementId,s.documentId,s.pdfPage].join('/'))
 assert.equal(new Set(keys).size,271)
})
