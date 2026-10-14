import {describe,it,expect} from 'vitest'
import fixtures from '../../../../../data/evaluation-instruments/language-grade-one-completion-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
describe('Cierre de procedimientos de Lengua 1',()=>{
  for(const fixture of fixtures) for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) it(`${fixture.id}: ${preferredInstrumentType}`,()=>{
    const p=recommend({activityTitle:'Actividad',description:fixture.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
    expect(p.activityType).toBe(fixture.type)
    const row=p.criteria.find(c=>c.templateId===fixture.criterion)
    expect(row).toBeDefined()
    expect(row!.description).toContain(fixture.mustContain)
    expect(JSON.stringify(row)).not.toContain(fixture.mustNot)
    if(fixture.id==='report-punctuation') {
      expect(p.criteria).toHaveLength(1)
      expect(row!.description).not.toMatch(/enumeraciones|organización|borrador/)
      expect(row!.description).toContain('citas')
    }
    expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(1735)
    if(preferredInstrumentType==='rubrica')expect(new Set(row!.descriptors.map(d=>d.text)).size).toBe(4)
  })
})
