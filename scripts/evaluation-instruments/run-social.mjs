import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync} from 'node:fs'
import {resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
const command=process.argv[2]
assert(['artifacts','http'].includes(command),'Select artifacts or http')
mkdirSync('.wrangler/secondary-completion',{recursive:true})
const require=createRequire(import.meta.url),{build}=createRequire(require.resolve('wrangler/package.json'))('esbuild')
const outfile=resolve(`.wrangler/secondary-completion/social-${command}.bundle.mjs`)
await build({entryPoints:[`scripts/evaluation-instruments/social-${command}.mjs`],outfile,bundle:true,platform:'node',format:'esm',packages:'external',alias:{'@':resolve('apps/frontend/src'),'@aula/shared':resolve('packages/shared/src/index.ts')}})
await import(pathToFileURL(outfile).href)
