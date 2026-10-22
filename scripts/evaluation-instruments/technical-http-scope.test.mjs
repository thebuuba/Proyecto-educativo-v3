import test from 'node:test'
import assert from 'node:assert/strict'
import {reviewedTechnicalHttpScope,reviewedTechnicalElementIds} from './technical-http-scope.mjs'
test('selecciona solo los ocho módulos técnicos revisados y su grado exacto',()=>{
 const expected=[['MF_053_3',4,'technical-ifc-mf053-four-contracts.json'],['MF_002_3',4,'technical-mf002-four-contracts.json'],['MF_054_3',5,'technical-mf054-five-contracts.json'],['MF_056_3',4,'technical-mf056-four-contracts.json'],['MF_059_3',4,'technical-mf059-four-contracts.json'],['MF_057_3',5,'technical-mf057-five-contracts.json'],['MF_055_3',6,'technical-mf055-six-contracts.json'],['MF_058_3',5,'technical-mf058-five-contracts.json']]
 for(const [code,grade,contract]of expected){
  const scope=reviewedTechnicalHttpScope(code,grade);assert(scope,code+' no está registrado');assert.equal(scope.contract,contract)
  assert(scope.source.includes(code.split('_').slice(0,2).join('')))
  for(const other of [1,2,3,4,5,6].filter(g=>g!==grade))assert.equal(reviewedTechnicalHttpScope(code,other),null)
 }
 assert.equal(reviewedTechnicalHttpScope('MF_060_3',6),null)
 assert.equal(reviewedTechnicalHttpScope('SOC',5),null)
 assert.equal(reviewedTechnicalHttpScope('__proto__',5),null)
})
test('un RA documental conserva el ámbito sin inventar un elemento seleccionable',()=>{
 const source={elementIdMap:{criterion:'uuid'},metadata:{documentaryRecords:[{id:'outcome',type:'LEARNING_OUTCOME'},{id:'guidance',type:'TEACHING_STRATEGY'}]}}
 assert.deepEqual(reviewedTechnicalElementIds({id:'criterion'},source),['uuid'])
 assert.deepEqual(reviewedTechnicalElementIds({id:'outcome'},source),[])
 assert.throws(()=>reviewedTechnicalElementIds({id:'guidance'},source))
 assert.throws(()=>reviewedTechnicalElementIds({id:'unknown'},source))
})
