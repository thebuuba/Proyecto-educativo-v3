import test from 'node:test'
import assert from 'node:assert/strict'
import {httpWriteAlreadyVerified} from './http-progress.mjs'
const expected={description:'Describe el caso.',format:'rubrica',score:17.35}
const prepared=()=>({creationId:'activity-1',format:'rubrica',input:{description:expected.description,maxScore:17.35}})
const complete=()=>({...prepared(),originalHash:'abc',verified:{activityId:'activity-1',snapshotId:'snapshot-1',format:'rubrica',score:17.35,hash:'abc',strategyOnlyInstrumentUnchanged:true,manualTextPreserved:true}})
test('un caso ausente o preparado continúa; una verificación completa se omite',()=>{
 assert.equal(httpWriteAlreadyVerified(undefined,expected),false);assert.equal(httpWriteAlreadyVerified(prepared(),expected),false);assert.equal(httpWriteAlreadyVerified(complete(),expected),true)
})
test('un cambio del fixture se rechaza antes de omitir o reutilizar una escritura',()=>{
 for(const write of [prepared(),complete()])for(const change of [{description:'Otro caso.'},{format:'escala'},{score:20}])assert.throws(()=>httpWriteAlreadyVerified(write,{...expected,...change}))
})
test('una marca de verificación inconsistente no se acepta silenciosamente',()=>{
 for(const change of [{activityId:'otro'},{hash:'otro'},{snapshotId:''},{format:'escala'},{score:20},{strategyOnlyInstrumentUnchanged:false},{manualTextPreserved:false}])assert.throws(()=>httpWriteAlreadyVerified({...complete(),verified:{...complete().verified,...change}},expected))
 assert.throws(()=>httpWriteAlreadyVerified({...complete(),originalHash:undefined},expected))
})
