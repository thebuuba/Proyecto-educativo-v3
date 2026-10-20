import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'
const read=p=>JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/'+p,'utf8'))

test('Cálculo MT6 conserva su fuente literal y su evidencia independiente de MT4 yMT5',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-mt-6-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider);assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.equal(row.subject,'Tigonometría, Cálculo Diferencial y Tecnología');assert.equal(row.exit,'Matemática y Tecnología');assert.equal(row.evidence,'docs/curriculum/cobertura-secundaria/optative-mt-6-matriz.json')
 for(const grade of [4,5])assert.notEqual(row.evidence,inventory.scopes.find(s=>s.id===read(`optative-mt-${grade}-matriz.json`).scopeId).evidence)
})

test('Estadística MT5 conserva su evidencia propia y no acredita Cálculo MT6',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-mt-5-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider);assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.equal(row.evidence,'docs/curriculum/cobertura-secundaria/optative-mt-5-matriz.json');assert.equal(row.exit,'Matemática y Tecnología')
 const fourth=inventory.scopes.find(s=>s.id===read('optative-mt-4-matriz.json').scopeId),sixth=inventory.scopes.find(s=>s.grade===6&&s.exit===row.exit)
 assert(fourth&&sixth);assert.notEqual(row.evidence,fourth.evidence);assert.notEqual(row.evidence,sixth.evidence)
})

test('Ciudadanía HCS sexto separa revisión completa de runtime pendiente y otros grados',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hcs-soc-6-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,'packages/shared/src/secondary-optative-social.ts');assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.equal(row.grade,6);assert.equal(row.exit,'Humanidades y Ciencias Sociales');assert.equal(row.evidence,'docs/curriculum/cobertura-secundaria/optative-hcs-soc-6-matriz.json')
 assert.equal(matrix.topics.length,23);assert.equal(matrix.contents.length,47);assert.equal(matrix.criticalIndicators.length,21)
 assert.equal(matrix.verification.fullReview.reviewedWithMatchingDigest,412);assert.equal(matrix.verification.fullReview.pending,0)
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.id===read('optative-hcs-soc-5-matriz.json').scopeId).evidence)
})

test('Demografía HCS quinto distingue instrumentos revisados de verificación runtime pendiente',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hcs-soc-5-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,'packages/shared/src/secondary-optative-social.ts');assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.equal(row.grade,5);assert.equal(row.exit,'Humanidades y Ciencias Sociales');assert.equal(row.evidence,'docs/curriculum/cobertura-secundaria/optative-hcs-soc-5-matriz.json')
 assert.equal(matrix.topics.length,28);assert.equal(matrix.contents.length,81);assert.equal(matrix.criticalIndicators.length,21)
 assert.equal(matrix.verification.fullReview.reviewedWithMatchingDigest,608);assert.equal(matrix.verification.fullReview.pending,0)
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.grade===6&&s.area==='Ciencias Sociales'&&s.exit===row.exit)?.evidence)
})

test('Filosofía HCS cuarto mantiene proveedor propio y evidencia pendiente real',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hcs-soc-4-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,'packages/shared/src/secondary-optative-social.ts');assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.equal(row.exit,'Humanidades y Ciencias Sociales');assert.equal(row.grade,4)
 assert.equal(row.evidence,'docs/curriculum/cobertura-secundaria/optative-hcs-soc-4-matriz.json');assert.equal(matrix.topics.length,21)
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.grade===6&&s.area==='Ciencias Sociales'&&s.exit===row.exit)?.evidence)
})
test('Textos científicos y profesionales HCS sexto conserva evidencia propia de cinco géneros',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hcs-len-6-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider);assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.equal(row.exit,'Humanidades y Ciencias Sociales');assert.equal(row.grade,6)
 assert.equal(row.evidence,'docs/curriculum/cobertura-secundaria/optative-hcs-len-6-matriz.json')
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.id===read('optative-hcs-len-5-matriz.json').scopeId).evidence)
 assert.equal(matrix.genres.length,5);assert.equal(matrix.verification.fullReview.pending,0)
})
test('Literatura HCS quinto conserva su matriz propia sin heredar la evidencia de cuarto o HLM',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hcs-len-5-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider);assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.equal(row.exit,'Humanidades y Ciencias Sociales')
 for(const name of ['optative-hcs-len-4','optative-hlm-len-5'])assert.notEqual(row.evidence,inventory.scopes.find(s=>s.id===read(name+'-matriz.json').scopeId).evidence)
 assert.equal(row.evidence,'docs/curriculum/cobertura-secundaria/optative-hcs-len-5-matriz.json')
})
test('Literatura HCS cuarto conserva su evidencia independiente de HLM y de HCS quinto',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hcs-len-4-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider);assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.equal(row.exit,'Humanidades y Ciencias Sociales')
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.id===read('optative-hlm-len-4-matriz.json').scopeId).evidence)
 const fifth=inventory.scopes.find(s=>s.grade===5&&s.subject===row.subject&&s.exit===row.exit);assert(fifth);assert.notEqual(fifth.evidence,row.evidence)
})
test('el inventario distingue Inglés HLM cuarto del inglés común y de las optativas aún pendientes',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hlm-ing-4-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider)
 assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.grade===4&&s.subject==='Inglés'&&s.character==='COMMON').evidence)
 const sixth=read('optative-hlm-ing-6-matriz.json');assert.equal(inventory.scopes.find(s=>s.id===sixth.scopeId).status,sixth.status)
})
test('Literatura Anglófona quinto conserva su estado de conexión verificado',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hlm-ing-5-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider);assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.grade===5&&s.subject==='Inglés'&&s.character==='COMMON').evidence)
})
test('Análisis crítico sexto mantiene ámbito propio y no hereda la verificación de quinto',()=>{
 const inventory=read('secundaria-inventario-maestro.json'),matrix=read('optative-hlm-ing-6-matriz.json'),row=inventory.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.status,matrix.status);assert.equal(row.provider,matrix.provider);assert.equal(row.currentRunVerification,matrix.verification.httpDb)
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.grade===6&&s.subject==='Inglés'&&s.character==='COMMON').evidence)
 assert.notEqual(row.evidence,inventory.scopes.find(s=>s.id===read('optative-hlm-ing-5-matriz.json').scopeId).evidence)
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
