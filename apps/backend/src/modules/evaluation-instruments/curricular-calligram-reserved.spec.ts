import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-caligrama-reservado-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(i:number,f:typeof formats[number])=>recommend({activityTitle:bank.cases[i].title,description:bank.cases[i].description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:f},bank.context,null,[],'UNMAPPED',null)
describe('Caligrama1: reservado interno sin independencia externa',()=>{
 for(const f of formats){
  it(`${f}: solo intención del audio no obliga a analizar sentimientos`,()=>{
   const p=run(0,f),t=JSON.stringify(p.criteria);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/intención/);expect(t).toMatch(/audio|escuchad/)
   expect(t).not.toMatch(/sentimientos|emoción|figura|tipografía|metáfora|paráfrasis/)
  })
  it(`${f}: revisión de vocabulario con compañero conserva sus límites`,()=>{
   const p=run(1,f),t=JSON.stringify(p.criteria);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/compañer/);expect(t).toMatch(/vocabulario/);expect(t).toMatch(/conserva.*imagen.*intención/i)
   expect(t).not.toMatch(/docente|profesor|fictici|emoción|figuras presentes|rima|publicación/)
  })
  it(`${f}: edición en revista no exige otros medios ni escritura inicial`,()=>{
   const p=run(2,f),t=JSON.stringify(p.criteria);expect(p.activityType).toBe('CALLIGRAM_CREATION');expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/revista escolar/);expect(t).toMatch(/legibilidad/)
   expect(t).not.toMatch(/mural|libro artesanal|borrador|recitación/)
  })
  it(`${f}: anáfora sola y su ejemplo no duplican la condición de entrega`,()=>{
   const p=run(3,f),t=JSON.stringify(p.criteria);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/anáfora/);expect(t).toMatch(/ejemplo.*presente/);expect(t).toMatch(/inicio/)
   expect(t).not.toMatch(/metáfora|epíteto|personificación|comparación/)
  })
  it(`${f}: solo ritmo no reevalúa el verso libre ni exige rima`,()=>{
   const p=run(4,f),t=JSON.stringify(p.criteria);expect(p.activityType).toBe('CALLIGRAM_ANALYSIS');expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/ritmo/);expect(t).toMatch(/pausas.*acentos|acentos.*pausas/)
   expect(t).not.toMatch(/rima|verso libre|coincidencia sonora|recitación/)
  })
  it(`${f}: recita solo figuras presentes mediante pausas o apoyo`,()=>{
   const p=run(5,f),t=JSON.stringify(p.criteria);expect(p.activityType).toBe('CALLIGRAM_RECITATION')
   const figure=p.criteria.find(c=>c.templateId==='calligram-feature-literary')!;expect(figure.description).toMatch(/que estén presentes/)
   expect(figure.description).toMatch(/pausas.*apoyo|apoyo.*pausas/)
   expect(t).not.toMatch(/rima|memoriza|metáfora|epíteto|comparación|lenguaje gestual/)
  })
  it(`${f}: plan de distribución no exige elegir de nuevo los datos ya entregados`,()=>{
   const p=run(6,f),t=JSON.stringify(p.criteria);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/esquema/);expect(t).toMatch(/conserva.*intención.*tema.*imagen/i)
   expect(t).not.toMatch(/Define en el plan|emoción|fictici|poema terminado/)
  })
  it(`${f}: tipografía digital no impone caligrafía ni altera el contenido`,()=>{
   const p=run(7,f),t=JSON.stringify(p.criteria);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/tipografía/);expect(t).toMatch(/conserva.*texto.*versos.*disposición/i)
   expect(t).not.toMatch(/caligrafía|rima|metáfora|publicación/)
  })
 }
})
