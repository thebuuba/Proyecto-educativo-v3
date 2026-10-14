import {describe,it,expect} from 'vitest'
import fixtures from '../../../../../data/evaluation-instruments/language-grade-six-contracts.json'




import subtopics from '../../../../../data/evaluation-instruments/language-grade-six-subtopic-contracts.json'
import procedures from '../../../../../data/evaluation-instruments/language-grade-six-procedure-contracts.json'
import {recommend} from './recommendation-engine'
import {findSecondaryLanguageTopic} from '@aula/shared'
const context={level:'SECONDARY' as const,grade:6,cycle:2,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
describe('Lengua 6: contenido conectado al servicio',()=>{
 for(const [grade,genre] of [[5,'entremés teatral'],[6,'monólogo']] as const)for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`representación observable sin comentario impuesto: ${grade} ${preferredInstrumentType}`,()=>{
  const p=recommend({activityTitle:'Actividad',description:`Representarán un ${genre}.`,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},{...context,grade},null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('PERFORMANCE')
  for(const row of p.criteria){
   expect(row.description).not.toMatch(/^(?:Interpreta|Explica|Relaciona el conflicto)/)
   expect(row.description).not.toMatch(/Enumera .*sin explicar/)
  }
  expect(p.criteria.some(c=>/representación|escena representada/.test(c.description))).toBe(true)
 })
 for(const grade of [3,4,6])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`referencias bibliográficas no impone gráficos: ${grade} ${preferredInstrumentType}`,()=>{
  const genre=grade===3?'informe de experimento':'informe de investigación'
  const p=recommend({activityTitle:'Actividad',description:`Redactarán un ${genre} con referencias bibliográficas.`,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType},{...context,grade},null,[],'UNMAPPED',null)
  expect(p.criteria.some(c=>c.templateId.endsWith('-feature-graphics'))).toBe(false)
 })
 for(const f of [...fixtures,...subtopics,...procedures])for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`${f.id} ${preferredInstrumentType}`,()=>{
  const p=recommend({activityTitle:'Actividad',description:f.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType},context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe(f.type)
  const row=p.criteria.find(c=>c.templateId===`len-6-${f.topic}-${f.criterion}`)
  expect(row).toBeDefined()
  expect(row!.description).toContain(f.contains)
  expect(JSON.stringify(p.criteria)).not.toContain(f.absent)
  expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
  if(preferredInstrumentType==='rubrica')expect(new Set(row!.descriptors.map(d=>d.text)).size).toBe(4)
 })
})
