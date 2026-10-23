import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-informe-reservado-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(index:number,format:typeof formats[number])=>recommend({activityTitle:bank.cases[index].title,description:bank.cases[index].description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
describe('Informe1: límites y componentes pendientes contrastados con banco reservado',()=>{
 for(const format of formats){
  it(`${format}: párrafo de análisis y cinco signos no exigen informe completo`,()=>{
   const p=run(0,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/costumbre/);expect(t).toMatch(/comas.*dos puntos.*comillas/);expect(t).toMatch(/pregunta|interrogación/);expect(t).toMatch(/exclamación/)
   expect(t).not.toMatch(/introducción|conclusión|borrador|Resumen de|resumen del/)
   expect(p.criteria.filter(c=>c.templateId==='report-structure')).toHaveLength(0)
  })
  it(`${format}: plan de novela ya elegida solo entrega el esquema`,()=>{
   const p=run(1,format),t=JSON.stringify(p.criteria);expect(p.activityType).toBe('READING_REPORT_WRITING')
   expect(t).toMatch(/novela/);expect(t).toMatch(/esquema/);expect(t).toMatch(/título.*introducción.*desarrollo.*conclusión/)
   expect(t).not.toMatch(/cuento|informe leído|versión final|publica|Interpreta los patrones|Resume las ideas/)
   expect(p.criteria.length).toBeLessThan(4)
  })
  it(`${format}: revisión con observaciones docentes y publicación digital mantiene su alcance`,()=>{
   const p=run(2,format),t=JSON.stringify(p.criteria);expect(p.criteria.every(c=>!!c.progressionLevels)).toBe(true)
   expect(t).toMatch(/docente/);expect(t).toMatch(/plataforma digital/);expect(t).toMatch(/otro grupo/)
   expect(t).toMatch(/hábitos|pautas culturales/);expect(t).toMatch(/burlas|generalizaciones/)
   expect(t).not.toMatch(/mural|Resumen de|Resume las ideas|Lo realiza con precisión/)
  })
  it(`${format}: escucha de personaje excluye culturas negadas y predicción no pedida`,()=>{
   const p=run(3,format),t=JSON.stringify(p.criteria);expect(p.activityType).toBe('READING_REPORT_ANALYSIS')
   expect(t).toMatch(/personaje/);expect(t).toMatch(/audio|escuchad/)
   expect(t).not.toMatch(/cultur|costumbre|título|predicción|introducción|Expone con/)
  })
 }
})
