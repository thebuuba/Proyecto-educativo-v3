import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/optative-hcs-soc-four-contracts.json'
import {resolveOptativeSocialTask,optativeSocialCriteria} from '../../../../../packages/shared/src/secondary-optative-social'

const context={level:'SECONDARY' as const,grade:4,cycle:2,subjectCode:contracts.subjectCode,subjectName:contracts.subjectName,modalityCode:contracts.modalityCode,optativeExitName:contracts.optativeExitName}
function rows(id:string){
 const fixture=contracts.cases.find(c=>c.id===id)
 if(!fixture)throw Error('Missing fixture '+id)
 const task=resolveOptativeSocialTask('',fixture.description,context)
 expect(task).not.toBeNull()
 return optativeSocialCriteria(task!)
}
const all=(id:string)=>rows(id).map(r=>r.observable).join(' ')
describe('pertinencia de instrumentos completos de Filosofía4',()=>{
 it('distingue presocráticos de un diálogo socrático',()=>{
  const r=rows('concept-26')
  expect(r.every(r=>r.templateId.includes('classical-philosophy'))).toBe(true)
  for(const name of ['presocráticos','Sócrates','Platón','Aristóteles'])expect(r[0].observable).toContain(name)
 })
 for(const [id,topic] of [['indicator-97-knowledge-schools-essay','knowledge'],['indicator-99-anthropology-short-essay','anthropology']])it('conserva el objeto del ensayo científico '+id,()=>{
  const r=rows(id)
  expect(r).toHaveLength(3)
  expect(r.every(r=>r.templateId.includes('-'+topic+'-'))).toBe(true)
  expect(r.map(r=>r.templateId.split('-').at(-1))).toEqual(['thesis','reason','organization'])
 })
 it('no divide argumentos dados en otra tarea',()=>{
  const r=rows('indicator-106-globalization-quality-impact')
  expect(r).toHaveLength(1)
  expect(r[0].observable).toMatch(/globalización.*calidad de vida/)
 })
 it('conserva la relación multicultural en el mundo global',()=>{
  const text=all('indicator-94-multicultural-intercultural-relations')
  expect(text).toMatch(/multicultur/);expect(text).toMatch(/intercultur/);expect(text).toMatch(/global/)
 })
 it('no pierde el período moderno en una coordinación',()=>{
  const text=all('indicator-101-anthropological-change-analysis')
  expect(text).toMatch(/griegas/);expect(text).toMatch(/\bmodernas\b/);expect(text).toMatch(/postmodernas/)
 })
 it('retiene admiración y duda al explicar los orígenes',()=>{
  const text=all('concept-61')
  for(const word of ['orígenes','admiración','duda','mito'])expect(text).toContain(word)
 })
 it('vincula la justificación al respaldo de fuentes y conserva la relación de Kant',()=>{
  const r=rows('indicator-95-kant-source-selection')
  expect(r).toHaveLength(2)
  expect(r.every(r=>/source-selection|source-credibility/.test(r.templateId))).toBe(true)
  expect(r[0].observable).toMatch(/crítica de Kant al racionalismo, al empirismo y al idealismo/)
 })
 it('la solución debatida evalúa propuesta y respaldo sobre el mismo caso',()=>{
  const r=rows('indicator-100-social-solutions-debate')
  expect(r).toHaveLength(1);expect(r[0].templateId).toContain('-proposal')
  expect(r[0].observable).toMatch(/razones/)
 })
 it('la justificación anafórica no añade otra filosofía genérica',()=>{
  const r=rows('indicator-103-human-rights-solution')
  expect(r).toHaveLength(1);expect(r[0].templateId).toContain('human-rights-philosophy-proposal')
 })
 it('explicar hallazgos no duplica la investigación',()=>{
  const r=rows('social-trends-research')
  expect(r).toHaveLength(2)
  expect(r.map(r=>r.templateId.split('-').at(-1))).toEqual(['research','sources'])
 })
 it('responder en el diálogo no añade otra respuesta idéntica',()=>{
  const r=rows('dialogue-no-timeline')
  expect(r).toHaveLength(2)
  expect(r.every(r=>r.templateId.includes('-dialogue-'))).toBe(true)
 })
 it('identifica los planteamientos de poder, no solamente nombres',()=>{
  expect(all('indicator-98-political-power-recognition')).toMatch(/autoritari.*democrátic.*Maquiavelo.*Hobbes.*Rousseau/)
 })
 it('identifica campos de estudio de religión cuando se solicitan',()=>{
  expect(all('indicator-108-religion-study-fields')).toMatch(/campos de (?:estudio|conocimiento)/)
 })
 it('no rompe una oración al añadir el procedimiento de epojé',()=>{
  const task=resolveOptativeSocialTask('','Demuestra la epojé en el caso ficticio dado.',context)!
  const r=optativeSocialCriteria(task)
  expect(r).toHaveLength(1)
  expect(r[0].observable).not.toMatch(/\.\s+mediante/)
  expect(r[0].observable).toMatch(/suspensión del juicio/)
 })
 it('evalúa respuestas a objeciones si el debate las pide',()=>{
  expect(rows('indicator-96-philosophical-method-debate').some(r=>r.templateId.endsWith('-response'))).toBe(true)
 })
 it('conserva cultura cuando se coordina con multiculturalidad',()=>{
  expect(all('concept-18')).toMatch(/\bcultura\b.*multiculturalidad.*interculturalidad/)
 })
 it('conserva los períodos de las escuelas del conocimiento',()=>{
  const text=all('concept-21')
  for(const word of ['griegas','medievales','modernas','contemporáneas'])expect(text).toContain(word)
 })
 for(const [id,words] of [
  ['concept-20',['histórica','social']],
  ['concept-27',['griega','moderna','contemporánea']],
  ['concept-32',['mito','presocráticos']],
  ['concept-69',['griega','medieval','moderna','contemporánea']],
  ['renaissance-modern-anthropology',['renacentistas','modern']],
  ['religious-worldviews-analysis',['grieg','medieval','modern','contemporáne']],
  ['historical-ethical-positions',['griegos','medievales','modernos','contemporáneos']],
  ['philosophy-concept-function-origins',['concepto','función','orígenes']],
  ['philosophy-critical-reality',['análisis crítico','realidad']],
  ['social-trends-research',['tendencias actuales']],
 ] as const)it('conserva las facetas explícitas '+id,()=>{
  const text=all(id);for(const word of words)expect(text).toContain(word)
 })
 it('la presentación evalúa implicaciones políticas además de comunicación',()=>{
  const r=rows('indicator-93-political-implications-oral')
  expect(r).toHaveLength(2)
  expect(r.some(r=>r.templateId.endsWith('-interpretation')&&/implicaciones sociales/.test(r.observable))).toBe(true)
  expect(r.some(r=>r.templateId.endsWith('-oral'))).toBe(true)
 })
 it('no añade postmodernidad a autores renacentistas y modernos',()=>{
  expect(all('renaissance-modern-anthropology')).not.toMatch(/postmodern/)
 })
 it('la solución social conserva el problema elegido sin exigir los tres',()=>{
  expect(all('indicator-100-social-solutions-debate')).toMatch(/caso elegido.*violencia.*corrupción.*autoritarismo/)
 })
 it('conserva el objeto de la responsabilidad ética',()=>{
  expect(all('indicator-102-ethical-responsibility-debate')).toMatch(/responsabilidad ética/)
 })
 it('conserva ser humano y divinidad en la discusión de religión',()=>{
  const text=all('indicator-109-human-divinity-debate')
  expect(text).toMatch(/ser humano/);expect(text).toMatch(/divinidad/)
 })
 for(const method of ['la mayéutica','la duda metódica','la epojé'])it('aplicar un método evalúa su procedimiento '+method,()=>{
  const task=resolveOptativeSocialTask('','Aplica '+method+' al caso ficticio proporcionado.',context)!
  expect(task.activityType).toBe('PERFORMANCE')
  const r=optativeSocialCriteria(task)
  expect(r).toHaveLength(1);expect(r[0].templateId).toContain('-method-application')
  expect(r[0].observable).toContain(method)
 })
})
