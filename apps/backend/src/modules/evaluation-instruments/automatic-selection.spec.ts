import { describe, expect, it } from 'vitest'
import { evaluationCatalogCurrent } from './catalog-current'
import { recommend, detectActivityType, suggestedSelections } from './recommendation-engine'
import { automaticInstrumentType } from '../../../../frontend/src/modules/activities/utils/automaticInstrumentType'
import cases from '../../../../../data/evaluation-instruments/automatic-selection-cases.json'

describe('selección automática coherente, sin cuotas',()=>{
  it('distingue desempeño motriz de un informe sobre ese desempeño',()=>{
    expect(detectActivityType('Actividad','Elaborarán un informe sobre la práctica motriz con análisis y conclusiones.').id).toBe('REPORT')
    expect(detectActivityType('Actividad','Realizarán una observación del equilibrio. Recursos: actividad deportiva.').id).toBe('OBSERVATION')
  })
  for(const activity of evaluationCatalogCurrent.activityTypes) for(const level of ['PRIMARY','SECONDARY'] as const) for(const grade of [2,6]) for(const maxScore of [10,20]) {
    it(`${activity.id} ${level} ${grade} ${maxScore}`,()=>{
      const context={level,grade,cycle:grade<=3?1:2,subjectCode:'NAT',subjectName:'Ciencias de la Naturaleza',modalityCode:'academic',optativeExitName:null}
      const result=recommend({activityTitle:'Actividad',participationMode:'INDIVIDUAL',pedagogicalActivityType:activity.id,maxScore},context,null,[],'UNMAPPED',null)
      expect(automaticInstrumentType(activity.id,context,maxScore)).toBe(result.instrumentType)
    })
  }
  it.each(cases)('justifica $instrument: $activityTitle',fixture=>{
    const detected=detectActivityType(fixture.activityTitle,fixture.description)
    expect(detected.id).toBe(fixture.activityType)
    expect(detectActivityType('Actividad de aprendizaje',fixture.description).id).toBe(fixture.activityType)
    expect(suggestedSelections(detected.id,null)?.suggestedInstrumentType).toBe(fixture.instrument)
    const result=recommend({...fixture,maxScore:20,participationMode:'INDIVIDUAL'},null,null,[],'UNMAPPED',null)
    expect(result.instrumentType).toBe(fixture.instrument)
    expect(result.internalTrace.ruleId).toBe(fixture.rule)
  })
})
