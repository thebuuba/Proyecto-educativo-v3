import {describe,expect,it} from 'vitest'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'MF_055_3',subjectName:'Implementación y Mantenimiento de Aplicaciones y Sistemas Informáticos',modalityCode:'technical_professional',optativeExitName:null}
const proposal=(description:string)=>recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:'lista-cotejo',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
const words=(p:ReturnType<typeof proposal>)=>p.criteria.map(r=>r.description).join(' ')
describe('MF055: requisitos y acciones limitados a lo expresamente pedido',()=>{
 it('explicar entregables sin documentación no añade documentación',()=>{
  const p=proposal('Explica los entregables de la aplicación según la ficha proporcionada.')
  expect(p.criteria).toHaveLength(1);expect(words(p)).not.toMatch(/documentación/)
 })
 it('explicar entregables y documentación produce dos evidencias independientes',()=>{
  const p=proposal('Explica los entregables y la documentación de la aplicación según la ficha proporcionada.')
  expect(p.criteria).toHaveLength(2);expect(p.criteria.some(c=>c.templateId.startsWith('technical-mf055-documentation-explanation-'))).toBe(true)
 })
 it('la recepción del entregable pedido no añade otros procesos',()=>{
  const p=proposal('Realiza la recepción de los entregables de codificación según las condiciones dadas.')
  expect(p.criteria).toHaveLength(1);expect(words(p)).not.toMatch(/prueba e instalación|prueba,|instalación/)
 })
 it('comparar caja blanca y negra según fichas no exige ejecutar caminos de código',()=>{
  const p=proposal('Compara las pruebas de caja blanca y caja negra según la información disponible en las fichas.')
  expect(p.criteria).toHaveLength(2);expect(words(p)).toMatch(/disponibilidad/);expect(words(p)).not.toMatch(/comprobación de los caminos/)
 })
 it('la integración no técnica no se convierte en prueba de integración',()=>{
  const p=proposal('Analiza la integración cultural de los personajes del relato.')
  expect(p.criteria.some(c=>c.templateId.startsWith('technical-mf055-'))).toBe(false)
 })
 it('reconoce pruebas de sistemas en plural',()=>{
  const p=proposal('Aplica las pruebas de sistemas a la aplicación de práctica según los casos dados.')
  expect(p.criteria.some(c=>c.templateId.startsWith('technical-mf055-test-system-application'))).toBe(true)
 })
 it('identificar un error de sintaxis no exige corregirlo',()=>{
  const p=proposal('Identifica el error de sintaxis en el código de práctica proporcionado.')
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toBe('technical-mf055-error-syntax-identification');expect(words(p)).not.toMatch(/corregid|corrección/)
 })
 it('recibir entregables conserva la acción operativa breve',()=>{
  const p=proposal('Recibe los entregables de codificación según las condiciones de aceptación dadas.')
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toBe('technical-mf055-deliverables-reception-application');expect(p.activityType).toBe('EXERCISE_SET')
 })
 it('instalar en paralelo conserva la variante breve elegida',()=>{
  const p=proposal('Instala en paralelo la aplicación de práctica según las condiciones dadas.')
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toBe('technical-mf055-installation-parallel-application')
 })
})
