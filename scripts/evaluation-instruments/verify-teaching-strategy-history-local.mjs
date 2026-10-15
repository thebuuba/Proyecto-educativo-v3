import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {spawnSync} from 'node:child_process'
import {readFileSync,writeFileSync} from 'node:fs'
import {fingerprint} from './language-local-client.mjs'
const root='docs/curriculum/cobertura-secundaria/evidencias/'
const baseline=JSON.parse(readFileSync(root+'estrategias-historicos-base.json','utf8'))
const status=spawnSync(process.execPath,['C:/Users/alexa/AppData/Local/pnpm-global/node_modules/pnpm/bin/pnpm.mjs','exec','supabase','status','--output','json'],{encoding:'utf8'})
assert.equal(status.status,0)
const config=JSON.parse(status.stdout),url=new URL(config.DB_URL)
assert(['127.0.0.1','localhost'].includes(url.hostname)&&url.port==='54332')
const require=createRequire(new URL('../../packages/database/package.json',import.meta.url)),{Client}=require('pg')
const client=new Client({connectionString:config.DB_URL})
await client.connect()
try{
 const preserved={},counts={}
 for(const table of ['evaluation_activities','evaluation_instruments','evaluation_instrument_snapshots','planning_entries']){
  const rows=(await client.query(`SELECT to_jsonb(t) - 'teaching_strategy_id' - 'teaching_strategy_origin' value FROM public.${table} t WHERE school_id=$1 ORDER BY id`,['7dc3e818-fc82-410f-b65a-5a3601a9ac8f'])).rows.map(({value})=>({id:value.id,hash:fingerprint(value)}))
  for(const old of baseline[table])assert.equal(rows.find(r=>r.id===old.id)?.hash,old.hash,`${table}:${old.id}`)
  preserved[table]=baseline[table].length;counts[table]=rows.length
 }
 const ids=baseline.evaluation_activities.map(a=>a.id)
 const historicUnknown=(await client.query("SELECT count(*)::int n FROM evaluation_activities WHERE id=ANY($1::uuid[]) AND teaching_strategy_id IS NULL AND teaching_strategy_origin='UNKNOWN'",[ids])).rows[0].n
 assert.equal(historicUnknown,ids.length)
 const policies=(await client.query("SELECT policyname,roles,cmd FROM pg_policies WHERE schemaname='public' AND tablename='evaluation_activities' ORDER BY policyname")).rows
 const grants=(await client.query("SELECT privilege_type FROM information_schema.role_table_grants WHERE grantee='app_backend' AND table_schema='public' AND table_name='evaluation_activities' ORDER BY privilege_type")).rows
 const migration=(await client.query("SELECT version,name FROM supabase_migrations.schema_migrations WHERE version='20261015105401'")).rows
 assert.equal(migration.length,1)
 const result={migration,preserved,counts,historicUnknown,policies,grants,scope:'Authorized fictitious school only; before hashes exclude only the two new activity columns.'}
 writeFileSync(root+'estrategias-historicos-final.json',JSON.stringify(result,null,2)+'\n')
 console.log(JSON.stringify({preserved,counts,historicUnknown}))
}finally{await client.end()}
