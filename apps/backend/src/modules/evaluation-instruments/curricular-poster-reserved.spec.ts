import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const read=(name:string)=>JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/'+name+'.json'),'utf8'))
const bank=read('len1-afiche-reservado-v1'),initial=read('len1-afiche-v1')
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(index:number,format:typeof formats[number],b=bank)=>recommend({activityTitle:b.cases[index].title,description:b.cases[index].description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},b.context,null,[],'UNMAPPED',null)
describe('Afiche1: producto respetuoso y límites contrastados después de lectura inicial',()=>{
 for(const format of formats){
  it(`${format}: acciones de convivencia respetuosa se evalúan en afiche producido`,()=>{
   const p=run(0,format),t=JSON.stringify(p.criteria);expect(t).toMatch(/convivencia justa y equitativa/);expect(t).toMatch(/burlas.*exclusión/)
   expect(p.criteria.find(c=>c.templateId==='poster-visuals')!.description).toMatch(/imagen dada/)
   expect(t).not.toMatch(/Elige otra|Selecciona.*imágenes|orgullo|entusiasmo|talento|publicación/)
  })
  it(`${format}: elipsis en producto no requiere explicación ni otros recursos`,()=>{
   const p=run(1,format),row=p.criteria.find(c=>c.templateId==='poster-feature-literary')!,t=JSON.stringify(p.criteria)
   expect(row.description).toMatch(/elipsis.*omitir.*recuperables/)
   expect(row.progressionLevels![2]).not.toMatch(/explica|identifica|describe/)
   expect(row.progressionLevels![3]).toMatch(/omisión.*contexto|omitir.*contexto/)
   expect(t).not.toMatch(/metáfora|pleonasmo|exageración|imagen figurada|poster-visuals/)
  })
  it(`${format}: obligación única conserva norma sin posibilidad ni imperativo negados`,()=>{
   const p=run(2,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/deber.*tener que/);expect(t).toMatch(/norma.*ficha/)
   expect(t).not.toMatch(/posibilidad|poder|podría|imperativo|sobre solo texto/)
  })
  it(`${format}: análisis solo del imperativo conserva un foco sin producción ni imagen`,()=>{
   const p=run(3,format),t=JSON.stringify(p.criteria);expect(p.activityType).toBe('POSTER_ANALYSIS');expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/imperativo/);expect(t).toMatch(/destinatario/);expect(t).not.toMatch(/poster-visuals|Selecciona|Crea un|Elabora un/)
  })
  it(`${format}: descriptores de creación juzgan el uso en el afiche`,()=>{
   const p=run(1,format,initial)
   for(const id of ['poster-feature-literary','poster-visuals'])expect(p.criteria.find(c=>c.templateId===id)!.progressionLevels![2]).not.toMatch(/explica|identifica|describe/)
  })
 }
 it('modalidad única sin norma o ficha no inventa esos insumos',()=>{
  const p=recommend({activityTitle:'Posibilidades de participación',description:'Elaboren un afiche de invitación usando solo perífrasis de posibilidad para expresar qué podrían hacer los destinatarios.',maxScore:20,participationMode:'INDIVIDUAL'},bank.context,null,[],'UNMAPPED',null)
  expect(JSON.stringify(p.criteria)).not.toMatch(/norma|ficha/)
  expect(p.criteria.find(c=>c.templateId==='poster-feature-periphrasis')!.description).toMatch(/posibilidad/)
 })
})
