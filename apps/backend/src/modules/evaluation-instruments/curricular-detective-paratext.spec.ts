import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-cuento-paratextos-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
describe('Cuento1: imágenes, colores y gráficos con evidencia propia en73',()=>{
 for(const format of formats)for(const [i,c]of bank.cases.entries())it(`${format}: ${c.id}`,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null),t=JSON.stringify(p.criteria)
  expect(p.activityType).toBe('DETECTIVE_STORY_ANALYSIS');expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].templateId).toBe('detective-procedure-prediction')
  expect(t).toMatch(/imagen.*colores.*gráficos/);expect(t).toMatch(/indicio/);expect(t).toMatch(/confirma|modifica/)
  if(i===0){expect(t).toMatch(/título/);expect(t).toMatch(/cubierta/)}
  else expect(t).not.toMatch(/título|cubierta/)
  expect(t).not.toMatch(/narrador|personajes|desenlace|Lo realiza con precisión|autonomía/)
 })
})
