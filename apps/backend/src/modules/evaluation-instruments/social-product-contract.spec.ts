import {describe,it,expect} from 'vitest'
import contracts from '../../../../../data/evaluation-instruments/social-grade-one-product-contracts.json'
import {recommend} from './recommendation-engine'
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'SOC',subjectName:'Ciencias Sociales',modalityCode:'academic',optativeExitName:null}
describe('Sociales primero: productos y acciones curriculares restantes',()=>{
 const propose=(description:string)=>recommend({activityTitle:'Actividad',description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
 it('permite panel o infografía sin obligar a entregar ambos',()=>{
  const proposal=propose('Realiza un panel o una infografía sobre la expansión colonial en el Caribe.')
  expect(proposal.criteria).toHaveLength(1)
  expect(proposal.criteria[0].templateId).toMatch(/-alternative$/)
  expect(proposal.criteria[0].description).toMatch(/O BIEN/)
  expect(proposal.activityType).toBe('PROJECT')
 })
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`${format}: conserva foto, pie y ambos tipos de conectores cuando se piden`,()=>{
  const p=recommend({activityTitle:'Noticia',description:'Redacta una noticia sobre las Revoluciones burguesas con titular, entrada, cuerpo, una foto proporcionada y pie de foto. Usa conectores de orden y temporales.',maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
  const body=p.criteria.map(c=>c.description).join(' ')
  expect(body).toMatch(/foto/);expect(body).toMatch(/pie de foto/);expect(body).toMatch(/de orden y temporales/)
  if(format==='lista-cotejo')expect(p.criteria.filter(c=>c.templateId.includes('-news-structure:'))).toHaveLength(5)
 })
 it('analizar los argumentos dados no exige sostener una postura propia',()=>{
  expect(propose(contracts.cases.find(c=>c.id==='dependency-indicator')!.description).criteria.some(c=>c.templateId.endsWith('-argument'))).toBe(false)
 })
 it('conserva ambos tipos de conectores cuando se solicitan conjuntamente',()=>{
  expect(propose(contracts.cases.find(c=>c.id==='news-connectors')!.description).criteria.find(c=>c.templateId.endsWith('-news-connectors'))?.description).toMatch(/de orden y temporales/)
 })
 it('el Caribe acota la expansión colonial del panel y no duplica el tema general',()=>{
  const proposal=propose(contracts.cases.find(c=>c.id==='panel')!.description)
  expect(proposal.criteria.every(c=>c.templateId.startsWith('soc-1-colonial-caribbean-'))).toBe(true)
 })
 it('el cómic compara los grupos pedidos sin exigir economía o poder colonial general',()=>{
  const proposal=propose(contracts.cases.find(c=>c.id==='historical-comic')!.description)
  expect(proposal.criteria.find(c=>c.templateId.endsWith('-visual-historical'))?.description).toMatch(/bucaneros.*filibusteros.*corsarios.*engagés/)
  expect(proposal.criteria.map(c=>c.description).join(' ')).not.toMatch(/producción, trabajo, población y poder/)
 })
 it('la representación conserva el contenido de piratería',()=>{
  expect(propose(contracts.cases.find(c=>c.id==='historical-role')!.description).criteria.every(c=>/piratería/.test(c.description))).toBe(true)
 })
 it('la infografía de ideas políticas no exige actores, lugares y fechas no solicitados',()=>{
  expect(propose('Elabora una infografía que explique los principios del liberalismo y el conservadurismo.').criteria.map(c=>c.description).join(' ')).not.toMatch(/sus actores, lugares y períodos/)
 })
 it('un folleto de símbolos no se convierte en una solución de conflictos',()=>{
  const proposal=recommend({activityTitle:'Folleto',description:'Elabora un folleto sobre el origen y significado de los símbolos patrios.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'rubrica'},context,null,[],'UNMAPPED',null)
  expect(proposal.criteria.map(c=>c.description).join(' ')).not.toMatch(/conflicto|alternativas dialogadas|necesidades de las partes/)
 })
 for(const task of contracts.cases)for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35]){
  it(`${task.id}/${format}/${maxScore}`,()=>{
   const proposal=recommend({activityTitle:'Un título antiguo de otra asignatura',description:task.description,maxScore,participationMode:'GROUP',preferredInstrumentType:format},context,null,[],'UNMAPPED',null)
   expect(proposal.criteria.every(c=>c.templateId.startsWith('soc-1-'))).toBe(true)
   for(const key of task.requiredKeys)expect(proposal.criteria.some(c=>c.templateId.endsWith('-'+key)||key==='news-structure'&&c.templateId.includes('-news-structure:'))).toBe(true)
   const body=proposal.criteria.map(c=>[c.title,c.description,...c.descriptors.map(d=>d.text)].join(' ')).join(' ')
   expect(body).not.toMatch(new RegExp(task.absent,'i'))
   expect(proposal.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
  })
 }
})
