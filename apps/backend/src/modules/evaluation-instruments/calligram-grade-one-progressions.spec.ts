import {describe,expect,it} from 'vitest'
import {recommend} from './recommendation-engine'
import type {AcademicContext} from './curriculum-context'
import fixtures from '../../../../../data/evaluation-instruments/calligram-grade-one-regressions.json'
const context:AcademicContext={level:'SECONDARY',grade:1,cycle:1,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
describe('Caligrama de primero: niveles por acción y requisitos',()=>{
  for(const fixture of fixtures) for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for(const maxScore of [20,17.35]) it(`${fixture.id} ${preferredInstrumentType} ${maxScore}`,()=>{
    const result=recommend({activityTitle:'Actividad 1',description:fixture.description,pedagogicalActivityType:fixture.activityType,preferredInstrumentType,maxScore,participationMode:'GROUP'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.every(c=>c.templateId.startsWith('calligram-'))).toBe(true)
    expect(result.totalScoreUnits).toBe(Math.round(maxScore*100))
    expect(JSON.stringify(result.criteria)).not.toMatch(/No aporta evidencia suficiente para valorar|responde preguntas|sostiene personalmente/i)
    if(preferredInstrumentType==='lista-ponderada') expect(result.criteria.every(c=>c.description.includes('Parcial (50%):'))).toBe(true)
  })
  it('analiza solamente la relación entre texto y figura cuando se pide ese aspecto',()=>{
    const result=recommend({activityTitle:'El caligrama',description:'Analizarán un caligrama para explicar la relación entre texto y figura.',maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.map(c=>c.templateId)).toEqual(['calligram-relation'])
    expect(JSON.stringify(result.criteria)).not.toMatch(/sentimientos|tipografía|recursos literarios/i)
  })
  it('no exige conclusión ni sentimientos personales ausentes',()=>{
    const result=recommend({activityTitle:'El caligrama',description:fixtures[2].description,maxScore:20,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.map(c=>c.templateId)).not.toContain('calligram-conclusion')
    expect(JSON.stringify(result.criteria)).not.toMatch(/sentimientos personales|creencias/i)
  })
  it('incluye preguntas explícitas sin convertir una explicación grupal en dominio individual',()=>{
    const result=recommend({activityTitle:'El caligrama',description:fixtures[4].description+' Responderán preguntas sobre su proceso y producto.',maxScore:20,participationMode:'GROUP'},context,null,[],'UNMAPPED',null)
    expect(result.criteria.find(c=>c.templateId==='calligram-individual')?.title).toBe('Respuestas sobre el proceso y el producto')
    expect(result.criteria.some(c=>c.title==='Dominio individual')).toBe(false)
  })
})
