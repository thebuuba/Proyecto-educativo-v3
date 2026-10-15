import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {spawnSync} from 'node:child_process'
import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs'
import {localClient,context,fingerprint} from './language-local-client.mjs'
import {reconcileActivityEvidence} from './history-reconciliation.mjs'
const {request,health}=await localClient(),activities=await request('/activities'),root='docs/curriculum/cobertura-secundaria/evidencias/'
const full=readdirSync(root).filter(n=>['ingles-calidad-persistencia.json','consignas-persistencia.json'].includes(n)||/^(?:lengua|ingles)-\d+-(?:procedimientos-|cierre-|final-|funciones-|gramatica-|lexico-|estrategias-|generos-|composicion-)?persistencia.json$/.test(n)).flatMap(n=>JSON.parse(readFileSync(root+n,'utf8')).activities.map(a=>a.id))
const initial=JSON.parse(readFileSync(root+'lengua-comun-historicos.json','utf8')).snapshots.map(a=>a.id)
const reconciliation=reconcileActivityEvidence(activities,full,initial)
const status=spawnSync(process.execPath,['C:/Users/alexa/AppData/Local/pnpm-global/node_modules/pnpm/bin/pnpm.mjs','exec','supabase','status','--output','json'],{encoding:'utf8'})
assert.equal(status.status,0);const config=JSON.parse(status.stdout),url=new URL(config.DB_URL)
assert(['localhost','127.0.0.1'].includes(url.hostname)&&url.port==='54332');process.env.DATABASE_URL=config.DB_URL
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
try{
 const {evaluationCatalogForVersion}=require('../../apps/backend/dist/modules/evaluation-instruments/catalog-current.js')
 const canonical=value=>JSON.stringify(value,(_,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.entries(item).sort(([a],[b])=>a.localeCompare(b))):item)
 const releases=await prisma.evaluationCatalogRelease.findMany({where:{version:{in:['evaluation-2026.66','evaluation-2026.67','evaluation-2026.68','evaluation-2026.69']}}})
 for(const release of releases)assert.equal(canonical(evaluationCatalogForVersion(release.version)),canonical(release.payload),`Catalog differs from installed immutable version: ${release.version}`)
 const where={schoolId:context.schoolId}
 const [rows,snapshots,instruments]=await Promise.all([
  prisma.evaluationActivity.findMany({where,select:{id:true,instrumentId:true,instrumentSnapshotId:true,status:true}}),
  prisma.evaluationInstrumentSnapshot.findMany({where,orderBy:{id:'asc'}}),
  prisma.evaluationInstrument.findMany({where,select:{id:true,status:true}}),
 ])
 const baselinePath='.superpowers/consignas-snapshots-base.json',hashes=snapshots.map(s=>({id:s.id,hash:fingerprint(s)}))
 if(process.argv.includes('--baseline')){assert(!existsSync(baselinePath),'Do not overwrite the historical baseline');writeFileSync(baselinePath,JSON.stringify(hashes,null,2)+'\n')}
 const baseline=JSON.parse(readFileSync(baselinePath,'utf8'))
 for(const prior of baseline)assert.equal(hashes.find(s=>s.id===prior.id)?.hash,prior.hash,`Historical snapshot changed: ${prior.id}`)
 const apiIds=new Set(activities.map(a=>a.id)),currentSnapshotIds=new Set(rows.filter(a=>apiIds.has(a.id)).map(a=>a.instrumentSnapshotId).filter(Boolean))
 for(const a of activities){const db=rows.find(r=>r.id===a.id);assert(db);assert.equal(db.instrumentSnapshotId,a.instrumentSnapshotId);assert.equal(db.instrumentId,a.instrumentId)}
 const snapshotRows=snapshots.map(s=>({snapshotId:s.id,instrumentId:s.instrumentId,versionNo:s.versionNo,previousSnapshotId:s.previousSnapshotId,catalogVersion:s.catalogVersion,payloadHash:fingerprint(s.payload),currentApiActivityIds:rows.filter(a=>apiIds.has(a.id)&&a.instrumentSnapshotId===s.id).map(a=>a.id),otherActivityIds:rows.filter(a=>!apiIds.has(a.id)&&a.instrumentSnapshotId===s.id).map(a=>a.id)}))
 const report={verifiedAt:new Date().toISOString(),health,scope:'AUTHORIZED_FICTITIOUS_LOCAL_SCHOOL',activityReconciliation:reconciliation,catalogsPreserved:releases.map(r=>({version:r.version,payloadHash:fingerprint(r.payload)})),
  databaseCounts:{activities:rows.length,apiVisibleActivities:activities.length,instrumentRows:instruments.length,snapshotRows:snapshots.length,currentApiSnapshotRows:currentSnapshotIds.size,otherSnapshotRows:snapshots.filter(s=>!currentSnapshotIds.has(s.id)).length,revisionRows:snapshots.filter(s=>s.previousSnapshotId).length},
  definitions:{instrument:'Row in evaluation_instruments; a revision may create another row.',snapshot:'Immutable row in evaluation_instrument_snapshots, one per instrumentId; versionNo/previousSnapshotId describe lineage.',otherSnapshot:'Not the current snapshot of an API-visible activity; may be a predecessor, refer to another/inactive activity, or be unreferenced. This does not imply loss.',revisionRows:'Subset of all snapshot rows with previousSnapshotId; not additive to snapshotRows.'},
  currentActivities:rows,instrumentRows:instruments,snapshotRows,historicalSnapshotHashesPreserved:baseline.length}
 const suffix=process.argv.includes('--baseline')?'antes-66':`despues-${health.development.catalogVersion.split('.').at(-1)}`
 writeFileSync(root+`consignas-conciliacion-${suffix}.json`,JSON.stringify(report,null,2)+'\n')
 console.log(JSON.stringify({equation:reconciliation.equation,counts:report.databaseCounts,historicalSnapshotsPreserved:baseline.length}))
}finally{await prisma.$disconnect()}
