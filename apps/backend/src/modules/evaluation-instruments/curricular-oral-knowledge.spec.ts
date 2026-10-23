import{readFileSync}from'node:fs'
import{resolve}from'node:path'
import{describe,it,expect}from'vitest'
import{recommend,firstSecondaryLanguageSelections}from'./recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-conocimiento-oral-independiente-v1.json'),'utf8'))
describe('Conocimiento nuevo expresado oralmente a partir de dos fuentes',()=>{
 for(const c of bank.cases)for(const format of['rubrica','lista-cotejo','escala','lista-ponderada']as const)it(`${c.id}/${format}`,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,participationMode:c.participationMode,maxScore:17.35,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
  const text=p.criteria.map(r=>r.description).join(' '),all=JSON.stringify(p.criteria)
  expect(p.activityType).toBe('EXPOSITION')
  expect(firstSecondaryLanguageSelections(p.activityType,c.description,bank.context)?.suggestedEvaluationTechnique).toBe('exposicion')
  expect(text).toMatch(/oralmente|explicaci[oó]n oral/)
  expect(text).toMatch(/ambas|ambos/)
  expect(text).toMatch(/relaci[oó]n nueva|relaci[oó]n adicional/)
  expect(text).toMatch(/notas/)
  expect(all).not.toMatch(/redacta|memorizaci[oó]n obligatoria|apoyo frecuente|autonom[ií]a/i)
  if(c.id.endsWith('ORAL01'))expect(text).toMatch(/inferencia.*dato literal/)
  else{
   expect(text).toMatch(/diferencia|tensi[oó]n/)
   expect(text).toMatch(/conclusión.*integrada o provisional/)
   expect(text).toMatch(/qué permiten comprender.*y qué queda sin resolver/)
   expect(text).toMatch(/evidencia.*individual|individual.*evidencia/)
   const sources=p.criteria.find(r=>r.templateId==='len1-community-reasoning-sources')!
   expect(sources.progressionLevels?.[1]).toMatch(/diferencia.*precisión/)
   expect(sources.progressionLevels?.[2]).toMatch(/omite.*diferencia/)
   expect(sources.progressionLevels?.[3]).toMatch(/inventa.*diferencia/)
  }
  expect(p.totalScoreUnits).toBe(1735);expect(p.criteria.length).toBeLessThanOrEqual(20)
 })
})
