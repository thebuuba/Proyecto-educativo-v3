import {describe,it,expect} from 'vitest'
import {resolveOptativeScienceTask,optativeScienceSelections,deliveryConditions} from '@aula/shared'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'OPT-CT-6',subjectName:'Física y Computación',modalityCode:'academic',optativeExitName:'Ciencias y Tecnología'}

describe('CT6: instrumento y técnica según el propósito efectivo',()=>{
 for(const description of ['Compara DOM y BOM, sin programar una página.','Diseña una página HTML con el formulario dado.','Analiza las tres páginas HTML proporcionadas.'])it('páginas web o negadas no son paginación: '+description,()=>{
  expect(deliveryConditions(description,{includeFileFormats:true,requestedOnly:true})).toEqual([])
 })
 it('conserva paginación documental junto a un producto web',()=>{
  expect(deliveryConditions('Diseña una página HTML. Entrega un informe de tres páginas.',{includeFileFormats:true,requestedOnly:true})).toEqual([{key:'pages',label:'3 páginas'}])
 })
 it('conserva PDF y la exclusión de portada a la vez',()=>{
  expect(deliveryConditions('Entrega el esquema en PDF, sin portada.',{includeFileFormats:true,requestedOnly:true})).toEqual([{key:'file-format',label:'archivo en PDF'},{key:'cover',label:'sin portada'}])
 })
 it('la entrega de archivo explícita se reconoce solo al habilitarla en el ámbito revisado',()=>{
  const description='Diseña un esquema HTML. Entrega el esquema en PDF.'
  expect(deliveryConditions(description)).toEqual([])
  expect(deliveryConditions(description,{includeFileFormats:true})).toEqual([{key:'file-format',label:'archivo en PDF'}])
 })
 for(const description of ['Analiza el esquema en PDF proporcionado.','No entregues el esquema en PDF.','Puedes entregar el esquema en PDF como recurso opcional.'])it('no inventa entrega: '+description,()=>{
  expect(deliveryConditions(description,{includeFileFormats:true})).toEqual([])
 })
 for(const [description,activityType,instrument,technique]of [
  ['Interpreta las mediciones eléctricas proporcionadas y explica la frecuencia de sus resultados.','ANALYSIS','rubrica','analisis-producciones'],
  ['Analiza el caso ficticio de privacidad del robot de servicio. Justifica las decisiones con las fuentes dadas.','ANALYSIS','rubrica','analisis-producciones'],
  ['Observa las señales del sensor de color del robot simulado y registra con regularidad sus variaciones.','OBSERVATION','escala','observacion-sistematica'],
  ['Identifica los componentes electrónicos ilustrados a partir de sus fichas proporcionadas.','ANALYSIS','lista-cotejo','analisis-producciones'],
  ['Calcula el voltaje con la corriente y resistencia dadas del circuito simulado. Asigna crédito parcial y pesos a los componentes solicitados.','EXERCISE_SET','lista-ponderada','analisis-producciones'],
  ['Diseña un robot con las restricciones proporcionadas y justifica las decisiones sobre sensores y actuadores con las fichas dadas.','PROJECT','rubrica','proyecto'],
 ] as const)it(description,()=>{
  const task=resolveOptativeScienceTask('Título antiguo sobre préstamos',description,context)
  expect(task).not.toBeNull()
  expect(task!.activityType).toBe(activityType)
  expect(optativeScienceSelections(task!,description)).toEqual({suggestedInstrumentType:instrument,suggestedEvaluationTechnique:technique})
 })
 it('la escala manual de lectura de frecuencias conserva calidad y no inventa observaciones repetidas',()=>{
  const p=recommend({activityTitle:'Actividad',description:'Interpreta las mediciones eléctricas proporcionadas y explica la frecuencia de sus resultados.',maxScore:17.35,preferredInstrumentType:'escala',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
  expect(p.instrumentType).toBe('escala')
  expect(p.levels.map(l=>l.label)).toEqual(['Completo','Suficiente','Parcial','Aún no logrado'])
 })
})
