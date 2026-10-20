import {describe,it,expect} from 'vitest'
import {resolveOptativeScienceTask,optativeScienceSelections} from '@aula/shared'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:5,cycle:2,subjectCode:'OPT-CT-5',subjectName:'Química y Computación',modalityCode:'academic',optativeExitName:'Ciencias y Tecnología'}

describe('CT5: instrumento y técnica según el propósito efectivo',()=>{
 for(const [description,activityType,instrument,technique]of [
  ['Interpreta los registros proporcionados de las pruebas textiles y explica la frecuencia de sus resultados.','ANALYSIS','rubrica','analisis-producciones'],
  ['Analiza el caso ficticio de privacidad de datos en un proyecto de química computacional. Justifica las decisiones con las fuentes dadas.','ANALYSIS','rubrica','analisis-producciones'],
  ['Observa las muestras textiles simuladas y registra con regularidad el cambio de color de las fibras.','OBSERVATION','escala','observacion-sistematica'],
  ['Identifica las fibras textiles ilustradas a partir de las propiedades proporcionadas.','ANALYSIS','lista-cotejo','analisis-producciones'],
  ['Calcula la concentración de la solución textil con las cantidades y unidades dadas. Asigna crédito parcial y pesos a los componentes solicitados.','EXERCISE_SET','lista-ponderada','analisis-producciones'],
  ['Diseña una molécula con las restricciones estructurales proporcionadas y justifica sus propiedades con el modelo dado.','PROJECT','rubrica','proyecto'],
 ] as const)it(description,()=>{
  const task=resolveOptativeScienceTask('Título antiguo sobre préstamos',description,context)
  expect(task).not.toBeNull()
  expect(task!.activityType).toBe(activityType)
  expect(optativeScienceSelections(task!,description)).toEqual({suggestedInstrumentType:instrument,suggestedEvaluationTechnique:technique})
 })
 it('la escala manual de lectura de frecuencias conserva calidad y no inventa observaciones repetidas',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Interpreta los registros proporcionados de las pruebas textiles y explica la frecuencia de sus resultados.',maxScore:17.35,preferredInstrumentType:'escala',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.instrumentType).toBe('escala')
  expect(p.levels.map(l=>l.label)).toEqual(['Completo','Suficiente','Parcial','Aún no logrado'])
 })
})
