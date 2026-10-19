import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'
const read=p=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/'+p,'utf8'))
test('el inventario distingue Inglés HLM cuarto del inglés común y de las optativas aún pendientes',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hlm-ing-4-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider)
 assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.grade===4&&s.subject==='Inglés'&&s.character==='COMMON').evidence)
 assert.equal(inventory.scopes.find(s=>s.grade===6&&s.exit===matrix.optativeExitName&&s.area===row.area).status,'PENDING')
})
test('Literatura Anglófona quinto distingue conexión de lectura y runtime pendientes',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hlm-ing-5-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider);assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.grade===5&&s.subject==='Inglés'&&s.character==='COMMON').evidence)
})
for(const grade of [4,5,6])test(`el inventario maestro conserva el ámbito y el estado real de HLM de ${grade}.º`,()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read(`optative-hlm-len-${grade}-matriz.json`)
 const row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status)
 assert.equal(row.provider,matrix.provider)
 assert.equal(row.exit,matrix.optativeExitName)
 assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 if(grade===5)assert.match(row.notes??'',/272instrumentos/, 'Conservar las notas verificadas al regenerar')
 const other=inventory.scopes.find(s=>s.grade===grade&&s.area===row.area&&s.exit==='Humanidades y Ciencias Sociales')
 assert(other);assert.notEqual(other.id,row.id)
 assert.notEqual(other.evidence,row.evidence)
 assert.equal(inventory.counts.optativeGradeScopes,18)
 assert(Array.isArray(inventory.reviewedOptativeScopeIds),'Registrar la lectura sin inferir implementación')
 assert.equal(inventory.reviewedOptativeScopeIds.length,18)
 assert(inventory.scopes.filter(s=>s.character==='OPTATIVE').every(s=>inventory.reviewedOptativeScopeIds.includes(s.id)))
})
