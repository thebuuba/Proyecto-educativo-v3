import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'MF_060_3',subjectName:'Desarrollo e Implementación de Soluciones Web y Multimedia',modalityCode:'technical_professional',optativeExitName:null}
const proposal=(description:string)=>recommend({activityTitle:'Actividad',description,maxScore:17.35,preferredInstrumentType:'rubrica',participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
const visible=(p:ReturnType<typeof proposal>)=>JSON.stringify(p.criteria.map(r=>({title:r.title,description:r.description,progression:r.progressionLevels})))
describe('MF060: propósito y elementos realmente solicitados',()=>{
 it('crear la función de depuración no exige utilizarla',()=>{
  const p=proposal('Crea la función de depuración solicitada para el código web de práctica según la ficha.')
  expect(p.criteria.map(r=>r.templateId)).toEqual(['technical-mf060-debugging-functions-creation']);expect(visible(p)).not.toMatch(/utilizada|utilización/)
 })
 it('utilizar una función de depuración existente no exige crearla',()=>{
  const p=proposal('Utiliza la función de depuración existente para comprobar el fallo del código web de práctica.')
  expect(p.criteria.map(r=>r.templateId)).toEqual(['technical-mf060-debugging-functions-application']);expect(visible(p)).not.toMatch(/creada|creación/)
 })
 it('seleccionar herramientas de depuración no añade selección de navegadores',()=>{
  const p=proposal('Selecciona las herramientas de depuración de los navegadores de las fichas para localizar el fallo web del caso.')
  expect(p.criteria.map(r=>r.templateId)).toEqual(['technical-mf060-debugging-tools-selection'])
 })
 it.each([
  ['Especifica los parámetros de configuración del servidor de práctica según los requisitos proporcionados.',/cliente/],
  ['Especifica los parámetros de configuración del cliente de práctica según los requisitos proporcionados.',/servidor/],
 ])('no impone otro entorno: %s',(description,unrequested)=>{
  const p=proposal(description);expect(p.criteria.map(r=>r.templateId)).toEqual(['technical-mf060-configuration-parameters-design']);expect(visible(p)).not.toMatch(unrequested)
 })
 it.each([
  ['Explica el alcance de la Intranet de la empresa ficticia según la ficha.',/\bInternet\b|Extranet/i],
  ['Explica el alcance de Internet según la ficha del caso ficticio.',/Intranet|Extranet/i],
  ['Compara Intranet y Extranet según el alcance y seguridad de las fichas del caso.',/\bInternet\b/i],
 ])('evalúa solo los ámbitos de red pedidos: %s',(description,unrequested)=>{
  const p=proposal(description);expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^technical-mf060-network-scopes-/);expect(visible(p)).not.toMatch(unrequested)
 })
 it.each([
  ['Instala la aplicación complementaria en el laboratorio de práctica según la ficha del autor.','technical-mf060-required-application-application'],
  ['Instala el diseño web en el servidor de práctica según la ficha del laboratorio.','technical-mf060-server-installation-simulation-application'],
  ['Verifica la instalación y distribución de la aplicación web de práctica según los resultados de la ficha.','technical-mf060-installation-verification-verification'],
 ])('reconoce la práctica breve sin cambiarla por simulación obligatoria: %s',(description,id)=>{
  const p=proposal(description);expect(p.criteria.map(r=>r.templateId)).toEqual([id]);expect(visible(p)).not.toMatch(/simulad/)
 })
 it.each([
  ['Identifica las características de gestión empresarial de la empresa ficticia según la ficha.',/\btipos\b/],
  ['Identifica los tipos de gestión empresarial de las fichas del caso.',/características/],
 ])('no impone otro componente de gestión: %s',(description,unrequested)=>{
  const p=proposal(description);expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^technical-mf060-business-characteristics-/);expect(visible(p)).not.toMatch(unrequested)
 })
 it('diferenciar visión y misión no exige meta u objetivos',()=>{
  const p=proposal('Diferencia visión y misión en los ejemplos de la empresa ficticia.')
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^technical-mf060-institutional-objectives-/);expect(visible(p)).not.toMatch(/\bmeta\b|objetivos/)
 })
 it.each([
  ['Construye el método de formulación de propuestas tecnológicas solicitado para el caso ficticio.',/presentado|presentación/],
  ['Presenta el método de formulación de propuestas tecnológicas proporcionado para el caso ficticio.',/construido|construcción/],
 ])('respeta la acción del método de propuestas: %s',(description,unrequested)=>{
  const p=proposal(description);expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^technical-mf060-proposal-methods-/);expect(visible(p)).not.toMatch(unrequested)
 })
 it.each(['ERP','CRM','SRM','CMS','inteligencia de negocio'])('analizar %s no exige desarrollar una aplicación',component=>{
  const p=proposal(`Analiza el componente de ${component} de la ficha del caso empresarial ficticio según los requerimientos proporcionados.`)
  expect(p.criteria).toHaveLength(1);expect(p.criteria[0].templateId).toMatch(/^technical-mf060-/);expect(p.activityType).toBe('ANALYSIS');expect(visible(p)).not.toMatch(/desarrollad/)
 })
})
