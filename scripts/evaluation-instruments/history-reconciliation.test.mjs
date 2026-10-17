import test from 'node:test'
import assert from 'node:assert/strict'
import {reconcileActivityEvidence} from './history-reconciliation.mjs'
const activity=id=>({id,name:id,instrumentSnapshot:{},instrumentId:`i-${id}`,instrumentSnapshotId:`s-${id}`})
test('concilia conjuntos disjuntos y actividades adicionales sin llamarlas versiones perdidas',()=>{
 const r=reconcileActivityEvidence(['a','b','c','d'].map(activity),['a'],['b'])
 assert.equal(r.equation,'4 = 1 + 1 - 0 + 2');assert.deepEqual(r.additionalActivities.map(a=>a.activityId),['c','d'])
})
test('descuenta solapamientos y detecta una referencia ausente',()=>{
 assert.equal(reconcileActivityEvidence(['a','b'].map(activity),['a','b'],['a']).equation,'2 = 2 + 1 - 1 + 0')
 assert.throws(()=>reconcileActivityEvidence([activity('a')],['b'],[]),/Referenced activity missing/)
})
