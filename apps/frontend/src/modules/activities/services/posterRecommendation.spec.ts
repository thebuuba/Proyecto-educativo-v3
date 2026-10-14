import {describe,expect,it} from 'vitest'
import {firstGradePosterCriteria,editableAuthoredRecommendation} from '@aula/shared'
import {editableFallbackRecommendation} from './instrumentPreparation'

const descriptions = [
  ['POSTER_CREATION','Elaborarán un afiche sobre la convivencia escolar con mensaje breve, público destinatario, argumentos y una imagen o símbolo, cuidando la legibilidad.'],
  ['POSTER_ANALYSIS','Analizarán un afiche de solo texto e identificarán su propósito y mensaje.'],
  ['POSTER_COMPARISON','Compararán dos afiches de convivencia escolar considerando sus mensajes y recursos persuasivos; justificarán cuál resulta más eficaz.'],
  ['POSTER_PRESENTATION','Presentarán un afiche de convivencia escolar y explicarán su mensaje, público y decisiones comunicativas.'],
] as const

describe('Afiche de primero: alternativa compartida',()=>{
  it('no recupera la plantilla heredada al elegir una actividad incompatible',()=>{
    const result=editableFallbackRecommendation({activityTitle:'El afiche',description:descriptions[0][1],activityType:'PROBLEM_SOLVING',instrumentType:'rubrica',maxScore:20,participationMode:'INDIVIDUAL',secondaryLanguageGrade:1})
    expect(result.activityType).toBe('PROBLEM_SOLVING')
    expect(result.criteria.some(c=>c.templateId.startsWith('poster-'))).toBe(false)
    expect(result.criteria.some(c=>c.title.includes('Argumentos y recursos persuasivos'))).toBe(false)
  })
  for(const [activityType,description] of descriptions) for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for(const maxScore of [20,17.35,0]) {
    it(`${activityType} ${instrumentType} ${maxScore}`,()=>{
      const input={activityTitle:'Actividad 1',description,activityType,instrumentType,maxScore,participationMode:'INDIVIDUAL' as const,secondaryLanguageGrade:1 as const}
      const fallback=editableFallbackRecommendation(input)
      const shared=editableAuthoredRecommendation(firstGradePosterCriteria(activityType,input.activityTitle,description),input,activityType,'lengua-secundaria-1-el-afiche')
      expect(fallback.criteria).toEqual(shared.criteria)
      expect(fallback.instrumentType).toBe(instrumentType)
      expect(fallback.totalScoreUnits).toBe(Math.round(maxScore*100))
      expect(fallback.criteria.every(c=>c.templateId.startsWith('poster-'))).toBe(true)
    })
  }
})
