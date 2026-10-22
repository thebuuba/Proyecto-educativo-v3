import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
test('MF059 distingue el build146servido enDevelopment del catálogo todavía instalado enDB',()=>{
 const path='docs/curriculum/cobertura-secundaria/technical-mf059-4-comprobaciones-locales.json';assert(existsSync(path),'Falta la comprobación efectiva del buildMF059')
 const p=JSON.parse(readFileSync(path,'utf8'));assert.equal(p.project,'eolgunypmtgrsyrjzcld');assert.equal(p.catalogBuild,'evaluation-2026.146');assert.equal(p.catalogInstalledAtThisCheckpoint,false);assert.equal(p.sourceInstalledAtThisCheckpoint,false)
 assert.equal(p.backend.passed,93499);assert.equal(p.backend.failed,0);assert.equal(p.frontend.passed,91612);assert.equal(p.frontend.failed,0)
 assert.equal(p.gates.length,9);assert(p.gates.every(g=>g.exit===0));assert.equal(p.preservation.priorTechnicalDefinitions,1304);assert.equal(p.preservation.newReviewedDefinitions,400);assert.equal(p.preservation.frozen145Exact,true)
 assert.equal(p.runtime.postgres.role,'app_backend_local');assert.equal(p.runtime.postgres.bypassRls,false);for(const product of ['postgres','auth','storage','frontend'])assert.equal(p.runtime[product].project,p.project)
 assert.equal(p.httpDb,'NOT_RUN');assert.equal(p.browser,'NOT_RUN');assert.equal(p.deploy,false);assert.equal(p.push,false)
})
