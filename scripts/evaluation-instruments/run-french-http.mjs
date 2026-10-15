import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
const require = createRequire(import.meta.url)
const wranglerRequire = createRequire(require.resolve('wrangler/package.json'))
const { build } = wranglerRequire('esbuild')
const outfile = resolve('.wrangler/french-source/french-http.bundle.mjs')
await build({ entryPoints: ['scripts/evaluation-instruments/french-http.mjs'], outfile, bundle: true, platform: 'node', format: 'esm', packages: 'external', alias: { '@': resolve('apps/frontend/src'), '@aula/shared': resolve('packages/shared/src/index.ts') } })
await import(pathToFileURL(outfile).href)
