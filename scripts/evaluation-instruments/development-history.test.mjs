import test from 'node:test'
import assert from 'node:assert/strict'
import {assertPreservedDevelopmentHistory} from './development-history.mjs'
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
