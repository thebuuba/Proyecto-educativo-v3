import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=()=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/modalidades-especializadas-inventario.json','utf8'))
test('el resumen técnico cuenta proveedores únicos y no duplica Ofimática entre programas',()=>{
 const i=read(),modules=new Map(i.technicalProfessional.reviewedPrograms.flatMap(p=>p.subjectsAndModules).filter(m=>m.provider).map(m=>[m.moduleCode,m]))
 assert.equal(modules.size,9);assert.equal(i.technicalProfessional.counts.connectedProviders,modules.size)
 assert.equal(i.technicalProfessional.counts.installedDevelopmentProviders,9)
 assert.equal(i.currentApplication.specializedProvidersAdded,9)
})
test('nueve proveedores conectados no equivalen a nueve QA completas',()=>{
 const c=read().technicalProfessional.counts
 assert.equal(c.representativeHttpVerifiedProviders,4);assert.equal(c.partialHttpProviders,4);assert.equal(c.httpBlockedBeforeCompletionProviders,1)
 assert.equal(c.representativeHttpVerifiedProviders+c.partialHttpProviders+c.httpBlockedBeforeCompletionProviders,9)
})
