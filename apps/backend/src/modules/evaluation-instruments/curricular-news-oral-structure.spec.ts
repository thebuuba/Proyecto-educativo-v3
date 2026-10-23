import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-noticia-estructura-oral-v1.json'),'utf8'))
describe('Noticia1: estructura comprendida por escucha con apoyo visual',()=>{
 for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(format,()=>{
  const c=bank.cases[0],p=recommend({activityTitle:c.title,description:c.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('NEWS_ANALYSIS')
  const text=p.criteria.map(r=>r.description).join(' ')
  const structure=p.criteria.find(r=>r.templateId==='news-structure')
  expect(structure).toBeDefined()
  expect(structure!.description).toMatch(/titular.*entrada.*cuerpo/)
  expect(structure!.description).toMatch(/función|sirve/)
  expect(text).toMatch(/fotografía.*pie/)
  expect(text).toMatch(/datos.*audio|información.*audio/)
  expect(text).not.toMatch(/quiénes participaron|dónde.*cuándo|Redacta|noticia leída/)
  expect(p.totalScoreUnits).toBe(1735)
 })
})
