import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
const command = process.argv[2]
assert(['artifacts', 'http'].includes(command), 'Selecciona artifacts o http')
if (command === 'http') {
  assert(!process.argv.includes('--subject'), 'El runner de Artística fija ART explícitamente')
  process.argv.push('--subject', 'ART')
}
mkdirSync('.wrangler/secondary-completion', { recursive: true })
const require = createRequire(import.meta.url),
  { build } = createRequire(require.resolve('wrangler/package.json'))('esbuild')
const outfile = resolve(`.wrangler/secondary-completion/art-${command}.bundle.mjs`)
await build({
  entryPoints: [command === 'http' ? 'scripts/evaluation-instruments/social-http.mjs' : 'scripts/evaluation-instruments/art-artifacts.mjs'],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  alias: {
    '@': resolve('apps/frontend/src'),
    '@aula/shared': resolve('packages/shared/src/index.ts'),
  },
})
await import(pathToFileURL(outfile).href)
