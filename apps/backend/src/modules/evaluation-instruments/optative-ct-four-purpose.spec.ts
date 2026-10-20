import {describe,it,expect} from 'vitest'
import {resolveOptativeScienceTask,optativeScienceSelections} from '@aula/shared'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:'OPT-CT-4',subjectName:'Biología y Computación',modalityCode:'academic',optativeExitName:'Ciencias y Tecnología'}

describe('CT4: instrumento y técnica según el propósito efectivo',()=>{
 it('la escala manual de interpretación de frecuencias conserva niveles de calidad, sin inventar observaciones repetidas',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Interpreta los registros del sensor ambiental proporcionados y explica la frecuencia de sus lecturas.',maxScore:17.35,preferredInstrumentType:'escala',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.instrumentType).toBe('escala')
  expect(p.levels.map(l=>l.label)).toEqual(['Completo','Suficiente','Parcial','Aún no logrado'])
 })
 for(const [description,activityType,instrument,technique]of [
  ['Interpreta los registros del sensor ambiental proporcionados y explica la frecuencia de sus lecturas.','ANALYSIS','rubrica','analisis-producciones'],
  ['Interpreta los registros del sensor ambiental proporcionados con los datos y referencias dados.','ANALYSIS','rubrica','analisis-producciones'],
  ['Analiza el caso ficticio de investigación en biología computacional y justifica la procedencia y privacidad de los datos dados.','ANALYSIS','rubrica','analisis-producciones'],
  ['Observa el sensor ambiental del modelo y registra con regularidad las características indicadas.','OBSERVATION','escala','observacion-sistematica'],
  ['Identifica las partes del glucómetro del modelo educativo proporcionado.','ANALYSIS','lista-cotejo','analisis-producciones'],
  ['Aplica el algoritmo de aprendizaje automático proporcionado al dataset biológico dado. Asigna crédito parcial y pesos a los componentes pedidos.','EXERCISE_SET','lista-ponderada','analisis-producciones'],
 ] as const)it(description,()=>{
  const task=resolveOptativeScienceTask('Título antiguo sobre préstamos',description,context)
  expect(task).not.toBeNull()
  expect(task!.activityType).toBe(activityType)
  expect(optativeScienceSelections(task!,description)).toEqual({suggestedInstrumentType:instrument,suggestedEvaluationTechnique:technique})
 })
})
