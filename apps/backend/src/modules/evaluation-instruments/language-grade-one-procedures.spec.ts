import {describe,it,expect} from 'vitest'
import fixtures from '../../../../../data/evaluation-instruments/language-grade-one-procedure-contracts.json'
import {recommend} from './recommendation-engine'
import type {AcademicContext} from './curriculum-context'
import type {InstrumentType} from '@aula/shared'
const context:AcademicContext={level:'SECONDARY',grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
const formats:InstrumentType[]=['rubrica','lista-cotejo','escala','lista-ponderada']
describe('Procedimientos curriculares de Lengua 1',()=>{
  it('anticipation alone does not demand the later verification step',()=>{
    const p=recommend({activityTitle:'Trabajo',description:'Anticiparán el contenido de una noticia a partir del titular.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(p.criteria.some(c=>c.templateId==='news-procedure-prediction')).toBe(true)
    expect(JSON.stringify(p.criteria)).not.toMatch(/lectura posterior|contrasta con la lectura|confirma o modifica/)
  })
  it('focused poetic and narrative resources do not require the alternative resource',()=>{
    for(const [description,absent] of [
      ['Analizarán únicamente la caligrafía de un caligrama.','tipografía'],
      ['Analizarán únicamente el diálogo de un cuento policíaco.','descripción'],
    ]) {
      const p=recommend({activityTitle:'Trabajo',description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
      expect(JSON.stringify(p.criteria).toLowerCase()).not.toContain(absent)
    }
  })
  for(const fixture of fixtures) for(const format of formats) it(`${fixture.criterion}, ${fixture.type}, ${format}`,()=>{
    const proposal=recommend({activityTitle:'Trabajo de clase',description:fixture.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
    expect(proposal.activityType).toBe(fixture.type)
    const criterion=proposal.criteria.find(c=>c.templateId===fixture.criterion)
    expect(criterion).toBeDefined()
    expect(JSON.stringify(criterion).toLowerCase()).toContain(fixture.evidence)
    expect(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
    if(format==='rubrica') {
      expect(new Set(criterion!.descriptors.map(d=>d.text)).size).toBe(4)
      expect(criterion!.descriptors.at(-1)!.text).not.toContain(criterion!.descriptors[0].text)
    }
    if(fixture.description.includes('fragmento')) expect(JSON.stringify(proposal.criteria)).not.toMatch(/resolución del caso|explica el desenlace/i)
  })
})
