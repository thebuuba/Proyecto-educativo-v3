import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { createRequire } from 'node:module'
import { developmentEnvironment, developmentProjectRef } from '../cloudflare-development-environment.mjs'
Object.assign(process.env, developmentEnvironment(parseEnv(readFileSync('.dev.vars.local', 'utf8'))))
const require = createRequire(new URL('../../apps/backend/package.json', import.meta.url))
const { prisma } = require('@aula/database')
const file = '.wrangler/french-source/presentation-history.json'
const phase = process.argv[2]
assert(['before', 'after'].includes(phase))
try {
  const snapshots = await prisma.$queryRaw`SELECT id::text, md5(to_jsonb(s)::text) AS hash FROM public.evaluation_instrument_snapshots s ORDER BY id`
  const releases = await prisma.$queryRaw`SELECT version, md5(payload::text) AS hash FROM public.evaluation_catalog_releases ORDER BY version`
  if (phase === 'before') {
    assert(!existsSync(file), 'Preserve existing baseline; never replace it after writes')
    writeFileSync(file, JSON.stringify({ project: developmentProjectRef, snapshots, releases }, null, 2) + '\n')
    console.log(JSON.stringify({ phase, project: developmentProjectRef, snapshots: snapshots.length, releases: releases.length }))
  } else {
    const original = JSON.parse(readFileSync(file, 'utf8'))
    assert.equal(original.project, developmentProjectRef)
    for (const row of original.snapshots) assert.equal(snapshots.find(s => s.id === row.id)?.hash, row.hash, 'Historical snapshot changed')
    for (const row of original.releases) assert.equal(releases.find(s => s.version === row.version)?.hash, row.hash, 'Historical release changed')
    original.verified = { preservedSnapshots: original.snapshots.length, preservedReleases: original.releases.length, addedSnapshots: snapshots.length - original.snapshots.length, addedReleases: releases.length - original.releases.length }
    writeFileSync(file, JSON.stringify(original, null, 2) + '\n')
    console.log(JSON.stringify({ phase, project: developmentProjectRef, ...original.verified }))
  }
} finally { await prisma.$disconnect() }
