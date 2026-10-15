import assert from 'node:assert/strict'

/** These categories describe activities, not rows/versions in the snapshot table. */
export function reconcileActivityEvidence(activities,completeIds,initialIds){
 const current=activities.filter(a=>a.instrumentSnapshot),ids=new Set(current.map(a=>a.id))
 const full=new Set(completeIds),initial=new Set(initialIds)
 for(const id of [...full,...initial])assert(ids.has(id),`Referenced activity missing: ${id}`)
 const overlap=[...full].filter(id=>initial.has(id)).sort()
 const additional=current.filter(a=>!full.has(a.id)&&!initial.has(a.id)).map(a=>({activityId:a.id,name:a.name,instrumentId:a.instrumentId,snapshotId:a.instrumentSnapshotId})).sort((a,b)=>a.activityId.localeCompare(b.activityId))
 assert.equal(current.length,full.size+initial.size-overlap.length+additional.length)
 return {countedEntity:'ACTIVITIES_WITH_CURRENT_SNAPSHOT',allActivityIds:current.map(a=>a.id).sort(),completeEvidenceActivityIds:[...full].sort(),initialReferenceActivityIds:[...initial].sort(),overlapActivityIds:overlap,additionalActivities:additional,
  counts:{allActivities:activities.length,activitiesWithSnapshot:current.length,completeEvidenceActivities:full.size,initialReferenceActivities:initial.size,overlap:overlap.length,additionalActivities:additional.length},
  equation:`${current.length} = ${full.size} + ${initial.size} - ${overlap.length} + ${additional.length}`}
}
