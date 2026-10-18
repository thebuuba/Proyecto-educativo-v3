import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {parseEnv} from 'node:util'
import {createRequire} from 'node:module'
import {isDeepStrictEqual} from 'node:util'
import {developmentEnvironment,developmentProjectRef as project} from '../cloudflare-development-environment.mjs'
import {readDevelopmentHistory} from './development-history.mjs'

// Explicit version + source manifest + compiled payload must agree before any DB access.
const requestedVersion=process.argv[2]
assert(/^evaluation-2026\.\d+$/.test(requestedVersion??''),'Indica explícitamente el release revisado')
const directory='.wrangler/secondary-completion/'
const expected=JSON.parse(readFileSync(directory+'expected-catalog.json','utf8'))
assert.equal(expected.version,requestedVersion,'Regenera el manifiesto desde el código fuente revisado')
Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url))
const {evaluationCatalogCurrent:catalog,evaluationCatalogForVersion}=require('./dist/modules/evaluation-instruments/catalog-current.js')
assert.equal(catalog.version,requestedVersion,'Recompila backend antes de instalar')
assert(isDeepStrictEqual(JSON.parse(JSON.stringify(catalog)),expected),'El catálogo compilado difiere del fuente: recompila shared y backend; no se escribió en DB')
const {seedEvaluationCatalog}=require('./dist/modules/evaluation-instruments/catalog-operations.js'),{prisma}=require('@aula/database')
const fingerprint=readDevelopmentHistory
try{
 const checkpoint=directory+'history-before-'+requestedVersion+'.json'
 if(!existsSync(checkpoint))writeFileSync(checkpoint,JSON.stringify({project,...await fingerprint()},null,2)+'\n')
 const baseline=JSON.parse(readFileSync(checkpoint,'utf8'));assert.equal(baseline.project,project)
 for(const version of ['evaluation-2026.94','evaluation-2026.95','evaluation-2026.96','evaluation-2026.97','evaluation-2026.98','evaluation-2026.99','evaluation-2026.100','evaluation-2026.101','evaluation-2026.102','evaluation-2026.103','evaluation-2026.104','evaluation-2026.105','evaluation-2026.106','evaluation-2026.107','evaluation-2026.108','evaluation-2026.109','evaluation-2026.110']){
  const old=await prisma.evaluationCatalogRelease.findUniqueOrThrow({where:{version}})
  assert(isDeepStrictEqual(old.payload,JSON.parse(JSON.stringify(evaluationCatalogForVersion(version)))),'No coincide el catálogo histórico congelado')
 }
 const first=await seedEvaluationCatalog(prisma),second=await seedEvaluationCatalog(prisma)
 assert.equal(second,'UNCHANGED')
 const current=await fingerprint()
 for(const kind of ['releases','snapshots'])for(const row of baseline[kind])assert(isDeepStrictEqual(current[kind].find(r=>kind==='releases'?r.version===row.version:r.id===row.id),row),'Se alteró una huella histórica')
 const result={project,catalog:catalog.version,first,second,preservedReleases:baseline.releases.length,preservedSnapshots:baseline.snapshots.length,sourceEqualsCompiled:true,previousPayloadsUnchanged:true}
 writeFileSync(directory+requestedVersion+'-install.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result))
}finally{await prisma.$disconnect()}
