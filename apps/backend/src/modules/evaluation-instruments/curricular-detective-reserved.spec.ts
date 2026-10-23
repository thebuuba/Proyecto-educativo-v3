import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-cuento-reservado-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(index:number,format:typeof formats[number])=>recommend({activityTitle:bank.cases[index].title,description:bank.cases[index].description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
describe('Cuento1: banco reservado del mismo autor, no independiente',()=>{
 for(const format of formats){
  it(`${format}: solo ayuda y oposición no fuerzan los demás papeles ni una ficha no dada`,()=>{
   const p=run(0,format),t=JSON.stringify(p.criteria);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/ayud|opone/);expect(t).toMatch(/hechos/)
   expect(t).not.toMatch(/sujeto|objeto|destinador|destinatario|impulsa|beneficia|quién busca|ficha/)
  })
  it(`${format}: edición únicamente digital no exige impresión ni nueva ilustración`,()=>{
   const p=run(1,format),t=JSON.stringify(p.criteria);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/digital/);expect(t).toMatch(/legibilidad/);expect(t).toMatch(/conserva.*contenido/i)
   expect(t).not.toMatch(/impresa|ilustración|borrador/)
  })
  it(`${format}: corregir ortografía no añade una corrección de puntuación`,()=>{
   const p=run(2,format),t=JSON.stringify(p.criteria);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/Corrige (?:únicamente )?la ortografía/)
   expect(t).toMatch(/conserva.*puntuación/i);expect(t).not.toMatch(/Corrige puntuación/)
  })
  it(`${format}: revisión de diálogo con compañero no añade docente ni justificación`,()=>{
   const t=JSON.stringify(run(3,format).criteria)
   expect(t).toMatch(/compañer/);expect(t).toMatch(/diálogo/);expect(t).toMatch(/conserva.*trama.*narrador/i)
   expect(t).not.toMatch(/profesor|justifica|descripción|caracteriza|ilustración|publicación/)
  })
  it(`${format}: cuenten oralmente conserva narración breve sin actuaciones obligatorias`,()=>{
   const p=run(4,format),t=JSON.stringify(p.criteria);expect(p.activityType).toBe('DETECTIVE_STORY_NARRATION')
   expect(t).toMatch(/Narra inicio/);expect(t).toMatch(/pistas/)
   expect(t).not.toMatch(/análisis|texto escrito|volumen|tono|corporal|voces|grabación/)
  })
  it(`${format}: comparación literaria no se interpreta como comparación entre cuentos`,()=>{
   const p=run(5,format),t=JSON.stringify(p.criteria);expect(p.activityType).toBe('DETECTIVE_STORY_ANALYSIS')
   expect(p.criteria).toHaveLength(1);expect(t).toMatch(/comparación/);expect(t).toMatch(/semejanza/)
   expect(t).toMatch(/caracteriza.*ambiente/);expect(t).toMatch(/el ejemplo presente/)
   expect(t).not.toMatch(/metáfora|epíteto|ambos cuentos|Compara personajes|Contrasta los ambientes/)
  })
 }
})
