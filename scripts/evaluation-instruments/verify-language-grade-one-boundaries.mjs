import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {localClient,context} from './language-local-client.mjs'
const {request,health}=await localClient()
const sectionSubjectId=context.assignments.find(a=>a.grade===1&&a.code==='LEN').id
const descriptions=[
  'Elabora una guía turística con mapas y fotografías.',
  'Redactarán una noticia sin publicar. Revisarán el borrador con sus compañeros.',
  'Analizarán en una noticia únicamente los sinónimos, sin estudiar las siglas. Explicarán los conectores temporales.',
]
const results=[]
for(const description of descriptions) for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
  const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId,activityTitle:'Trabajo',description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType})
  assert.equal(proposal.catalogVersion,'evaluation-2026.20')
  const content=JSON.stringify(proposal.criteria)
  if(description.startsWith('Elabora')) {
    assert(!/publica/i.test(content))
    assert(content.includes('mapas y fotografías'))
  } else if(description.startsWith('Redactarán')) {
    assert(!proposal.criteria.some(c=>c.templateId.endsWith('-process-publication')))
    assert(proposal.criteria.some(c=>c.templateId.endsWith('-process-revision')))
  } else {
    assert(proposal.criteria.some(c=>c.templateId.endsWith('-feature-connectors')))
    assert(!proposal.criteria.some(c=>c.templateId.endsWith('-feature-abbreviations')))
  }
  results.push({description,proposal})
}
writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/lengua-1-requisitos-ausentes.json',JSON.stringify({health,verifiedAt:new Date().toISOString(),results},null,2)+'\n')
console.log(JSON.stringify({cases:results.length,publicationOnlyWhenRequested:true,negativeClausePreservesNextSentence:true}))
