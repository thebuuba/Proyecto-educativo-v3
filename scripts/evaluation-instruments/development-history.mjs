import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
import {parseEnv} from 'node:util'
import {developmentEnvironment} from '../cloudflare-development-environment.mjs'

// Administrative fingerprints use one read-only PostgreSQL snapshot. They must not
// depend on Prisma's interactive transaction lifetime or alter application timeouts.
export async function readDevelopmentHistory(){
 const environment=developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8')))
 const require=createRequire(new URL('../../packages/database/package.json',import.meta.url))
 const {Client}=require('pg'),{databaseUrlForPg}=require('./dist/index.js')
 const client=new Client({connectionString:databaseUrlForPg(environment.DATABASE_URL),connectionTimeoutMillis:20000})
 try{
  await client.connect()
  await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY')
  const releases=await client.query('SELECT version,md5(payload::text) AS hash FROM evaluation_catalog_releases ORDER BY version')
  const snapshots=await client.query('SELECT id::text,md5(to_jsonb(s)::text) AS hash FROM evaluation_instrument_snapshots s ORDER BY id')
  await client.query('COMMIT')
  return{releases:releases.rows,snapshots:snapshots.rows}
 }finally{await client.end()}
}
