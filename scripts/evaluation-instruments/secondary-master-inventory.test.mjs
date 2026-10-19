import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'
const read=p=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/'+p,'utf8'))
test('el inventario maestro conserva el ámbito y el estado real de la primera optativa conectada',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hlm-len-4-matriz.json')
 const row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status)
 assert.equal(row.provider,matrix.provider)
 assert.equal(row.exit,matrix.optativeExitName)
 assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 const other=inventory.scopes.find(s=>s.grade===4&&s.subject===row.subject&&s.exit==='Humanidades y Ciencias Sociales')
 assert(other);assert.notEqual(other.id,row.id)
 assert.notEqual(other.evidence,row.evidence)
 assert.equal(inventory.counts.optativeGradeScopes,18)
 assert(Array.isArray(inventory.reviewedOptativeScopeIds),'Registrar la lectura sin inferir implementación')
 assert.equal(inventory.reviewedOptativeScopeIds.length,18)
 assert(inventory.scopes.filter(s=>s.character==='OPTATIVE').every(s=>inventory.reviewedOptativeScopeIds.includes(s.id)))
})
