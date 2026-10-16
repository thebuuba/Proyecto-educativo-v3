import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync} from 'node:fs'
import {resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
const command=process.argv[2]
assert(['artifacts','development','source-catalog','http','review','relevance','relevance-http'].includes(command),'Select a known Mathematics QA operation')
mkdirSync('.wrangler/math-source',{recursive:true})
const require=createRequire(import.meta.url),wranglerRequire=createRequire(require.resolve('wrangler/package.json')),{build}=wranglerRequire('esbuild')
const outfile=resolve(`.wrangler/math-source/math-${command}.bundle.mjs`)
await build({entryPoints:[`scripts/evaluation-instruments/math-${command}.mjs`],outfile,bundle:true,platform:'node',format:'esm',packages:'external',alias:{'@':resolve('apps/frontend/src'),'@aula/shared':resolve('packages/shared/src/index.ts')}})
await import(pathToFileURL(outfile).href)
