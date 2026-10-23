import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
import {parseEnv} from 'node:util'
import assert from 'node:assert/strict'
import {developmentEnvironment,developmentProjectRef} from '../cloudflare-development-environment.mjs'

/** Compare the saved checkpoint to an effective Development read; never rebaseline it. */
export function assertPreservedDevelopmentHistory(baseline,current){
 if(baseline.project!==undefined)assert.equal(baseline.project,developmentProjectRef,'Checkpoint de otro proyecto')
 for(const [kind,key]of [['releases','version'],['snapshots','id']]){
  assert(Array.isArray(baseline[kind])&&Array.isArray(current[kind]),'Checkpoint de huellas incompleto')
  const actual=new Map(current[kind].map(row=>[row[key],row]))
  assert.equal(actual.size,current[kind].length,'Huellas duplicadas')
  for(const prior of baseline[kind])assert.deepEqual(actual.get(prior[key]),prior,'Se alteró o perdió una huella histórica: '+kind+'/'+prior[key])
 }
}

// Administrative fingerprints use one read-only PostgreSQL snapshot. They must not
// depend on Prisma's interactive transaction lifetime or alter application timeouts.
export async function readDevelopmentHistory(){
 const environment=developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8')))
 const require=createRequire(new URL('../../packages/database/package.json',import.meta.url))
 const {Client}=require('pg'),{databaseUrlForPg}=require('./dist/index.js')
 const client=new Client({connectionString:databaseUrlForPg(environment.DATABASE_URL),connectionTimeoutMillis:20000,query_timeout:20000,statement_timeout:20000})
 return readDevelopmentHistoryFromClient(client)
}

export async function readDevelopmentHistoryFromClient(client){
 let connectionError,history
 const onError=error=>{connectionError??=error}
 client.on('error',onError)
 const query=async sql=>{
  if(connectionError)throw connectionError
  const result=await client.query(sql)
  if(connectionError)throw connectionError
  return result
 }
 try{
  await client.connect()
  await query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY')
  const releases=await query('SELECT version,md5(payload::text) AS hash FROM evaluation_catalog_releases ORDER BY version')
  const snapshots=await query('SELECT id::text,md5(to_jsonb(s)::text) AS hash FROM evaluation_instrument_snapshots s ORDER BY id')
  await query('COMMIT')
  history={releases:releases.rows,snapshots:snapshots.rows}
 }finally{
  try{await client.end()}finally{client.removeListener('error',onError)}
 }
 if(connectionError)throw connectionError
 return history
}
