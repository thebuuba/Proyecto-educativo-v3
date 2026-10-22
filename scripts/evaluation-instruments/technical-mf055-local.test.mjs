import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
test('MF055 acredita gates locales y preservación sin afirmar instalación o navegador',()=>{
 const path='docs/curriculum/cobertura-secundaria/technical-mf055-6-comprobaciones-locales.json';assert(existsSync(path),'Falta comprobación local MF055')
 const p=JSON.parse(readFileSync(path,'utf8'));assert.equal(p.catalog,'evaluation-2026.148');assert.equal(p.backendTests,95291);assert.equal(p.frontendActivityTests,93102);assert.equal(p.nodeTechnicalTests,138);assert.equal(p.commands.length,9);assert(p.commands.every(c=>c.exit===0))
 assert.equal(p.priorTechnicalDefinitionsExact,2248);assert.equal(p.newDefinitionsReviewedExact,200);assert.equal(p.frozen147Exact,true);assert.equal(p.commonPreservation.english,15176);assert.equal(p.commonPreservation.math,2888);assert.equal(p.commonPreservation.optatives,14488)
 assert.equal(p.assets.allPrecached,true);assert(p.assets.maxBytes<=2097152);assert.equal(p.sourceInstalledAtThisCheckpoint,false);assert.equal(p.catalogInstalledAtThisCheckpoint,false);assert.equal(p.httpDb,'NOT_RUN');assert.equal(p.browser,'NOT_RUN');assert.equal(p.deploy,false);assert.equal(p.push,false)
})
