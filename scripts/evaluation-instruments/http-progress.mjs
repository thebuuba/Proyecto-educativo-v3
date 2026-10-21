import assert from 'node:assert/strict'

/** Completed checkpoints are immutable; resume only unfinished cases. */
export function httpWriteAlreadyVerified(write,{description,format,score}){
 if(!write)return false
 assert.equal(write.input.description,description,'El fixture cambió: no reutilizar una escritura anterior para otra consigna')
 assert.equal(write.format,format);assert.equal(write.input.maxScore,score)
 if(!write.verified)return false
 const v=write.verified
 assert(write.originalHash);assert.equal(v.hash,write.originalHash);assert.equal(v.activityId,write.creationId);assert(v.snapshotId)
 assert.equal(v.format,format);assert.equal(v.score,score);assert.equal(v.strategyOnlyInstrumentUnchanged,true);assert.equal(v.manualTextPreserved,true)
 return true
}
