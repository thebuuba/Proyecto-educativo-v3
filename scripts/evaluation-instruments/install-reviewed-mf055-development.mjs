import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {readFileSync,writeFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {parseEnv} from 'node:util'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {developmentEnvironment,developmentProjectRef} from '../cloudflare-development-environment.mjs'
import {readDevelopmentHistory} from './development-history.mjs'
import {mf055SourceManifest} from './reviewed-mf055-source.mjs'

import {installReviewedTechnicalSource} from './install-reviewed-technical-source.mjs'

/** Existing source versions are verified, never repaired or overwritten. */
export async function installMf055Source(prisma,manifest){
 return installReviewedTechnicalSource(prisma,manifest,'MINERD_IFC006_MF055_6_NORM_2017_V1')
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 assert(process.argv.includes('--install'),'Se requiere --install explícito.')
 const manifest=mf055SourceManifest(JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/technical-ifc006-mf055-6-matriz.json','utf8')))
 const position=process.argv.indexOf('--pdf')
 assert(position>=0&&process.argv[position+1],'Falta --pdf con el documento oficial revisado')
 assert.equal(createHash('sha256').update(readFileSync(process.argv[position+1])).digest('hex'),manifest.document.sha256,'PDF diferente al revisado')
 Object.assign(process.env,developmentEnvironment(parseEnv(readFileSync('.dev.vars.local','utf8'))))
 const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url)),{prisma}=require('@aula/database')
 try{
  const [role]=await prisma.$queryRawUnsafe('select current_user::text as name, (select rolbypassrls from pg_roles where rolname=current_user) as bypass')
  assert(['app_backend_local','app_backend'].includes(role.name));assert.equal(role.bypass,false)
  const before=await readDevelopmentHistory(),result=await installMf055Source(prisma,manifest),after=await readDevelopmentHistory()
  assert.deepEqual(after,before,'Una instalación de fuente no debe alterar catálogos ni snapshots')
  const evidence={project:manifest.project,code:manifest.code,result,versionId:manifest.version.id,scopeId:manifest.scope.id,documentIds:[manifest.document.id],elementIdMap:manifest.elementIdMap,metadata:manifest.metadata,elements:37,spans:37,documentaryRecords:8,literalRecords:45,literalParts:45,excludedFromAssessment:6,preservedReleases:before.releases.length,preservedSnapshots:before.snapshots.length}
  writeFileSync(`.wrangler/secondary-completion/${manifest.code}-source.json`,JSON.stringify(evidence,null,2)+'\n')
  console.log(JSON.stringify({...evidence,elementIdMap:undefined,metadata:undefined}))
 }finally{await prisma.$disconnect()}
}
