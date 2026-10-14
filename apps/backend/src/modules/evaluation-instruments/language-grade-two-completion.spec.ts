import {describe,it,expect} from 'vitest'
import fixtures from '../../../../../data/evaluation-instruments/language-grade-two-contracts.json'
import subtopics from '../../../../../data/evaluation-instruments/language-grade-two-subtopic-contracts.json'
import procedures from '../../../../../data/evaluation-instruments/language-grade-two-procedure-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:2,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
describe('Lengua común 2: acción, subtema y procedimiento',()=>{
  for(const grade of [1,2])it(`la ponderación de componentes no significa componer una noticia en ${grade}`,()=>{
    const p=recommend({activityTitle:'Trabajo',description:'Analizarán una noticia identificando sus hechos, interrogantes fundamentales y estructura. Se distribuirán pesos entre los componentes verificables.',maxScore:17.35,participationMode:'INDIVIDUAL'}, {...context,grade},null,[],'UNMAPPED',null)
    expect(p.activityType).toBe('NEWS_ANALYSIS')
    expect(p.instrumentType).toBe('lista-ponderada')
    expect(JSON.stringify(p.criteria)).not.toMatch(/news-writing|Revisa la claridad/)
  })
  for(const fixture of subtopics)for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`fuente ${fixture.source.text} ${preferredInstrumentType}`,()=>{
    const p=recommend({activityTitle:'Trabajo',description:fixture.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
    const row=p.criteria.find(c=>c.templateId===fixture.criterion)
    expect(row,JSON.stringify(p.criteria.map(c=>c.templateId))).toBeDefined()
    expect(row!.description.length).toBeGreaterThan(35)
    if(preferredInstrumentType==='rubrica')expect(new Set(row!.descriptors.map(d=>d.text)).size).toBe(4)
  })
  it('el noticiero produce evidencia oral, sin exigir redacción',()=>{
    const p=recommend({activityTitle:'Noticiero',description:'Presentarán oralmente un noticiero con los hechos de una noticia.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(p.activityType).toBe('NEWSCAST')
    expect(JSON.stringify(p.criteria)).not.toMatch(/Redacta el hecho|news-writing/)
    expect(p.criteria.some(c=>/entonación|ritmo|voz/i.test(c.description))).toBe(true)
  })
  for(const fixture of [...fixtures,...procedures])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`${fixture.id} ${preferredInstrumentType}`,()=>{
    const p=recommend({activityTitle:'Trabajo',description:fixture.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
    expect(p.activityType).toBe(fixture.type)
    const row=p.criteria.find(c=>c.templateId===fixture.criterion)
    expect(row).toBeDefined()
    expect(row!.description).toContain(fixture.contains)
    expect(JSON.stringify(p.criteria)).not.toContain(fixture.absent)
    expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
    if(preferredInstrumentType==='rubrica')expect(new Set(row!.descriptors.map(d=>d.text)).size).toBe(4)
  })
})
