import { describe, expect, it } from 'vitest'
import { editableFallbackRecommendation, recommendationToFields } from './instrumentPreparation'
import { scoreInstrumentFields } from './instrumentScoring'

const formats = ['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const tasks = [
  {grade:5,id:'matrices',description:'Resolverán problemas de ventas mediante matrices de cantidades y precios; construirán matrices y realizarán suma, resta y multiplicación según corresponda. Explicarán los procedimientos e interpretarán los resultados.'},
  {grade:6,id:'trigonometry',description:'Resolverán situaciones de alturas y distancias mediante seno, coseno y tangente. Identificarán datos, seleccionarán la razón y calcularán la medida. Explicarán los procedimientos y resultados en situaciones cotidianas.'},
]
describe('Matemática contextual en la alternativa compartida',()=>{
  it.each(formats)('conserva evidencia, puntaje pendiente y decimales en %s',instrumentType=>{
    for(const task of tasks) {
      const proposal=editableFallbackRecommendation({activityTitle:'Actividad 1',description:task.description,academicContext:{level:'SECONDARY',grade:task.grade,subjectCode:'MAT'},instrumentType,participationMode:'INDIVIDUAL',maxScore:100})
      expect(proposal.criteria.every(row=>row.templateId.startsWith(task.grade===5?'mat-5-matrices-':`math-${task.id}-`))).toBe(true)
      for(const total of [null,20,17.35]) {
        const fields=scoreInstrumentFields(recommendationToFields(proposal,'Actividad 1'),instrumentType,total,proposal)
        const count=proposal.criteria.length
        expect(Array.from({length:count},(_,row)=>Number(fields[`${instrumentType}:points:${row}`])).reduce((sum,value)=>sum+Math.round(value*100),0)).toBe(total === null ? 0 : Math.round(total*100))
        expect(fields[`${instrumentType}:meta:scorePending`]).toBe(total === null ? 'true':'false')
        expect(fields[`${instrumentType}:criterion:0`]).toBeTruthy()
      }
    }
  })
})
