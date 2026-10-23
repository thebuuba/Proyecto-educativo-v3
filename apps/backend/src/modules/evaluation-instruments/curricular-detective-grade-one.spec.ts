import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-cuento-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(index:number,format:typeof formats[number])=>recommend({activityTitle:bank.cases[index].title,description:bank.cases[index].description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
const text=(p:ReturnType<typeof run>)=>JSON.stringify(p.criteria)
describe('Cuento1: contenidos y procedimientos de malla73, banco previo fijo',()=>{
 for(const format of formats){
  it(`${format}: escritura breve conserva cuento sin inventar entregas`,()=>{
   const p=run(0,format),t=text(p);expect(p.activityType).toBe('DETECTIVE_STORY_WRITING')
   expect(t).toMatch(/inicio.*nudo.*desenlace/i);expect(t).toMatch(/pistas/);expect(t).toMatch(/narrador/)
   expect(t).not.toMatch(/publicación|ilustración|entrevista|exposición/)
  })
  it(`${format}: producción completa conserva intención, personajes, recursos y ambas ediciones`,()=>{
   const p=run(1,format),t=text(p)
   expect(t).toMatch(/entretener/);expect(t).toMatch(/revista escolar/)
   expect(t).toMatch(/centrales.*secundarios/);expect(t).toMatch(/motivaciones/)
   expect(t).toMatch(/comparación/);expect(t).toMatch(/metáfora/);expect(t).toMatch(/epíteto/)
   expect(t).toMatch(/semejanza/);expect(t).toMatch(/cualidad/)
   expect(t).toMatch(/descripci[oó]n/);expect(t).toMatch(/diálogo/)
   expect(t).toMatch(/compañer/);expect(t).toMatch(/profesor/)
   expect(t).toMatch(/impresa.*digital/);expect(t).toMatch(/ilustración/);expect(t).toMatch(/inclusiv/)
   expect(t).not.toMatch(/Identifica.*metáfora|Explica.*uso.*recursos/)
  })
  it(`${format}: comprensión completa no se reduce a paráfrasis y actantes`,()=>{
   const p=run(2,format),t=text(p)
   expect(t).toMatch(/función/);expect(t).toMatch(/inicio.*nudo.*desenlace/);expect(t).toMatch(/narrador/)
   expect(t).toMatch(/centrales.*secundarios/);expect(t).toMatch(/motivaciones/);expect(t).toMatch(/ambiente/)
   for(const role of ['sujeto','objeto','destinador','destinatario','ayudante','oponente'])expect(t).toContain(role)
   expect(t).toMatch(/título.*cubierta/);expect(t).toMatch(/contrasta|confirma/);expect(t).toMatch(/paráfrasis/i)
   expect(t).toMatch(/pistas/);expect(t).toMatch(/inclusiv/)
  })
  it(`${format}: escucha conserva audio, tres momentos, motivos y ambiente`,()=>{
   const t=text(run(3,format));expect(t).toMatch(/audio|escuchad/)
   expect(t).toMatch(/inicio.*nudo.*desenlace/);expect(t).toMatch(/centrales.*secundarios/)
   expect(t).toMatch(/motivaciones/);expect(t).toMatch(/cerrad.*abiert/);expect(t).toMatch(/ciudad.*campo/)
   expect(t).toMatch(/resumen o paráfrasis/i);expect(t).toMatch(/inclusiv/)
   expect(t).not.toMatch(/texto leído|lectura posterior|borrador|cubierta|escritura/)
   expect(t).not.toMatch(/cuento leído|un ejemplo de cada tipo/)
  })
  it(`${format}: inventar y narrar oralmente produce relato, sin análisis impuesto`,()=>{
   const p=run(4,format),t=text(p);expect(p.activityType).toBe('DETECTIVE_STORY_NARRATION')
   expect(t).toMatch(/entretener/);expect(t).toMatch(/curso/);expect(t).toMatch(/pistas/)
   expect(t).toMatch(/narrador/);expect(t).toMatch(/comparación.*metáfora.*epíteto/)
   expect(t).toMatch(/descripción.*caracterizar personajes o ambiente/)
   expect(t).toMatch(/tono.*volumen/);expect(t).toMatch(/corporal.*apoyo|apoyo.*corporal/)
   expect(t).not.toMatch(/Justifica el análisis|texto escrito|su texto|borrador|publicación/)
  })
  it(`${format}: análisis lingüístico excluye lo negado e integra ejemplo de cada tipo`,()=>{
   const p=run(5,format),t=text(p)
   expect(p.criteria.every(c=>c.templateId.startsWith('detective-feature-'))).toBe(true)
   expect(t).toMatch(/indefinido/);expect(t).toMatch(/imperfecto/);expect(t).toMatch(/habitual|hábitos/)
   expect(t).toMatch(/tiempo.*espacio/);expect(t).toMatch(/adjetivos/);expect(t).toMatch(/coordinación.*consecuencia/)
   expect(t).toMatch(/ejemplo de cada/);expect(t).not.toMatch(/1 ejemplo|trama|narrador|metáfora/)
  })
  it(`${format}: cinco recursos distintos no se convierten en análisis adicional de trama`,()=>{
   const p=run(6,format),t=text(p)
   expect(p.criteria.every(c=>/detective-feature-(?:dialogue|literary)/.test(c.templateId))).toBe(true)
   expect(t).toMatch(/descripción/);expect(t).toMatch(/diálogo/)
   expect(t).toMatch(/comparación/);expect(t).toMatch(/metáfora/);expect(t).toMatch(/epíteto/)
   expect(t).toMatch(/semejanza/);expect(t).toMatch(/cualidad/);expect(t).toMatch(/ejemplo de cada/)
   expect(t).not.toMatch(/1 ejemplo|No compara personajes|No explica cómo los personajes/)
  })
  it(`${format}: comparación conserva narrador y actantes sin conclusión negada`,()=>{
   const p=run(7,format),t=text(p);expect(p.activityType).toBe('DETECTIVE_STORY_COMPARISON')
   expect(t).toMatch(/ambos/);expect(t).toMatch(/narrador/);expect(t).toMatch(/actan/)
   expect(t).toMatch(/influencia|influye/);expect(t).not.toMatch(/Conclusión|conclusión/)
   const actants=p.criteria.find(c=>c.templateId==='detective-feature-actants')!
   expect(actants.progressionLevels?.[2]).toMatch(/ambos.*contrasta|contrasta.*ambos/)
  })
  it(`${format}: plan no exige cuento terminado ni convenciones de su versión final`,()=>{
   const p=run(8,format),t=text(p)
   expect(p.criteria.some(c=>/detective-(?:structure|mystery|revision|narrator)$/.test(c.templateId))).toBe(false)
   expect(t).toMatch(/entretener/);expect(t).toMatch(/lectores/);expect(t).toMatch(/esquema/)
   expect(t).toMatch(/motivaciones/);expect(t).toMatch(/actan/);expect(t).toMatch(/narrador/)
   expect(t).not.toMatch(/Ortografía|ortografía|No presenta un texto|No presenta personajes/)
  })
  it(`${format}: revisión respeta restricciones y hace visibles sugerencias y decisiones`,()=>{
   const t=text(run(9,format));expect(t).toMatch(/compañer/);expect(t).toMatch(/profesor/)
   expect(t).toMatch(/sugerencias.*por qué|decisiones.*justifica|justifica.*decisiones/)
   expect(t).toMatch(/excluy|inclusiv|ridiculiz/);expect(t).toMatch(/conserva.*trama.*narrador/i)
   expect(t).toMatch(/sustituy.*excluy/);expect(t).not.toMatch(/Corrige vocabulario apropiado/)
   expect(t).not.toMatch(/publicación|ilustración|nueva trama/)
  })
  it(`${format}: corrección solo de convenciones conserva contenido y orden`,()=>{
   const p=run(10,format),t=text(p)
   expect(p.criteria).toHaveLength(1);expect(t).toMatch(/puntuación.*ortografía/)
   expect(t).toMatch(/contenido.*personajes.*orden/);expect(t).toMatch(/quién habla|turnos/)
   expect(t).not.toMatch(/misterio|metáfora|desenlace|perspectiva/)
  })
  it(`${format}: funciones actanciales no equivalen a nombres ni a seis personajes forzosos`,()=>{
   const p=run(11,format),t=text(p);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/impulsa.*beneficia.*ayuda.*opone/);expect(t).toMatch(/busca/)
   expect(t).toMatch(/hechos/);expect(t).not.toMatch(/seis personajes|6 personajes/)
  })
  it(`${format}: edición de texto corregido no reevalúa producción o revisión inicial`,()=>{
   const p=run(12,format),t=text(p)
   expect(p.criteria.every(c=>/detective-(?:edition|procedure-illustration)/.test(c.templateId))).toBe(true)
   expect(t).toMatch(/impresa.*digital/);expect(t).toMatch(/conserva.*contenido/i)
   expect(t).toMatch(/legibilidad/);expect(t).toMatch(/ilustración/)
   expect(t).not.toMatch(/borrador|Inicio, nudo|Misterio, pistas/)
  })
 }
})
