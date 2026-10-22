import assert from 'node:assert/strict'
import {developmentProjectRef} from '../cloudflare-development-environment.mjs'

/** Caller must first verify compiled/source payload and preserved frozen lineage. */
export async function installReviewedCatalogRelease(db,{project,version,catalog}){
 assert.equal(project,developmentProjectRef)
 assert(/^evaluation-2026\.\d+$/.test(version));assert.equal(catalog.version,version)
 const payload=JSON.parse(JSON.stringify(catalog)),serialized=JSON.stringify(payload)
 const inspect=async()=>{
  const rows=await db.$queryRawUnsafe('SELECT payload = $2::jsonb AS matches FROM evaluation_catalog_releases WHERE version = $1 LIMIT 1',version,serialized)
  assert(rows.length<=1)
  if(!rows.length)return false
  assert.equal(rows[0].matches,true,'El release ya existe con contenido diferente; no se sobrescribe.')
  return true
 }
 if(await inspect())return'UNCHANGED'
 let result='CREATED'
 try{await db.evaluationCatalogRelease.create({data:{version,payload},select:{version:true}})}
 catch(error){if(error?.code!=='P2002')throw error;result='UNCHANGED'}
 assert(await inspect(),'El release no está disponible después de la creación.')
 return result
}
