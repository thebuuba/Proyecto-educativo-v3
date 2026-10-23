import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-caligrama-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(index:number,format:typeof formats[number])=>recommend({activityTitle:bank.cases[index].title,description:bank.cases[index].description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
const text=(p:ReturnType<typeof run>)=>JSON.stringify(p.criteria)
describe('Caligrama1: malla74 y actitudes explícitas73, expectativas previas',()=>{
 for(const f of formats){
  it(`${f}: creación breve conserva texto y figura sin otras entregas`,()=>{
   const p=run(0,f),t=text(p);expect(p.activityType).toBe('CALLIGRAM_CREATION');expect(t).toMatch(/figura/);expect(t).toMatch(/palabras/)
   expect(t).not.toMatch(/rima|métrica|publicación|recitación|borrador/)
  })
  it(`${f}: verso libre y medios alternativos no se convierten en rima ni doble entrega`,()=>{
   const p=run(1,f),t=text(p);expect(p.activityType).toBe('CALLIGRAM_CREATION')
   expect(p.criteria.some(c=>c.templateId==='calligram-feature-rhyme-rhythm')).toBe(false)
   expect(t).toMatch(/tipografía.*o.*caligrafía/);expect(t).toMatch(/verso libre/);expect(t).toMatch(/fictici/)
   for(const figure of ['epíteto','anáfora','comparación','personificación','metáfora'])expect(t).toContain(figure)
   expect(t).toMatch(/inici(?:o|al)|comienzo/);expect(t).toMatch(/rasgos humanos|cualidades humanas|acciones humanas/)
   expect(t).toMatch(/docente|profesor/);expect(t).toMatch(/compañer/);expect(t).toMatch(/mural/);expect(t).toMatch(/edición/)
   expect(t).not.toMatch(/libro artesanal|revista escolar|experiencia personal/)
  })
  it(`${f}: lectura conserva inferencia, funciones distintas y ejemplo de cada figura`,()=>{
   const p=run(2,f),t=text(p);expect(p.activityType).toBe('CALLIGRAM_ANALYSIS')
   expect(t).toMatch(/función/);expect(t).toMatch(/intención/);expect(t).toMatch(/tema/);expect(t).toMatch(/figura/)
   expect(t).toMatch(/implícit|no.*literal/);expect(t).toMatch(/ejemplo de cada/)
   expect(p.criteria.find(c=>c.templateId==='calligram-feature-rhyme-rhythm')?.description).toMatch(/rima.*coincidencias.*ritmo.*pausas.*acentos/)
   for(const figure of ['epíteto','anáfora','comparación','personificación','metáfora'])expect(t).toContain(figure)
   expect(p.criteria.some(c=>c.templateId.startsWith('delivery-format'))).toBe(false)
  })
  it(`${f}: comprensión de audio con lámina no pierde intención ni figura por pedir paráfrasis`,()=>{
   const t=text(run(3,f));expect(t).toMatch(/audio|escuchad/);expect(t).toMatch(/lámina/);expect(t).toMatch(/figura/)
   expect(t).toMatch(/intención/);expect(t).toMatch(/sentimientos.*(?:expresad|representad)|(?:expresad|representad).*sentimientos/)
   expect(t).toMatch(/implícit/);expect(t).toMatch(/paráfrasis.*oral|oral.*paráfrasis/);expect(t).toMatch(/vocabulario/)
   expect(t).not.toMatch(/biografía|memoriza|sonríe|disfruta/)
  })
  it(`${f}: solo audio no exige información gráfica ni emociones íntimas`,()=>{
   const t=text(run(4,f));expect(t).toMatch(/audio|escuchad/);expect(t).toMatch(/intención/);expect(t).toMatch(/global/)
   expect(t).toMatch(/anáfora/);expect(t).toMatch(/personificación/)
   expect(t).not.toMatch(/figura formada|tipografía|caligrafía|texto leído|metáfora|epíteto|comparación literaria/)
  })
  it(`${f}: selección y recitación evalúan intención y expresión con apoyos`,()=>{
   const p=run(5,f),t=text(p);expect(p.activityType).toBe('CALLIGRAM_RECITATION')
   expect(t).toMatch(/Selecciona.*(?:intención|mensaje)/);expect(t).toMatch(/entregado|disponible/)
   expect(t).toMatch(/entonación.*gestual|gestual.*entonación/);expect(t).toMatch(/apoyo/)
   expect(t).toMatch(/comparación/);expect(t).not.toMatch(/memoriza|biografía|experiencia personal/)
  })
  it(`${f}: nombres, adjetivos y descripción no añaden figuras negadas ni un ejemplo total`,()=>{
   const p=run(6,f),t=text(p)
   expect(p.criteria.every(c=>/calligram-feature-(?:nouns|adjectives|description)/.test(c.templateId))).toBe(true)
   expect(t).toMatch(/ejemplo de cada/);expect(t).toMatch(/nombrar/);expect(t).toMatch(/caracterizar/);expect(t).toMatch(/imagen/)
   expect(t).not.toMatch(/clase de sustantivo|recursos literarios|1 ejemplo/)
  })
  it(`${f}: no basta escribir nombres no transforma análisis de cinco figuras en creación`,()=>{
   const p=run(7,f),t=text(p);expect(p.activityType).toBe('CALLIGRAM_ANALYSIS')
   expect(p.criteria.every(c=>c.templateId==='calligram-feature-literary')).toBe(true)
   expect(t).toMatch(/ejemplo de cada/);expect(t).toMatch(/semejanza/);expect(t).toMatch(/reiteración.*inici|repetición.*inici/)
   expect(t).toMatch(/rasgos humanos|cualidades humanas|acciones humanas/)
   expect(t).not.toMatch(/Dispone los versos|1 ejemplo/)
  })
  it(`${f}: plan no se evalúa como poema terminado`,()=>{
   const p=run(8,f),t=text(p)
   expect(p.criteria.some(c=>/calligram-(?:relation|revision|visual|resources)$/.test(c.templateId))).toBe(false)
   expect(t).toMatch(/plan|esquema/);expect(t).toMatch(/intención.*tema.*imagen/);expect(t).toMatch(/fictici/)
   expect(t).not.toMatch(/No organiza las palabras en una figura legible|publicación|rima/)
  })
  it(`${f}: compara medios del mismo poema, no inventa mensajes distintos ni conclusión`,()=>{
   const p=run(9,f),t=text(p);expect(p.activityType).toBe('CALLIGRAM_COMPARISON')
   expect(t).toMatch(/digital/);expect(t).toMatch(/manuscrit/);expect(t).toMatch(/tipografía/);expect(t).toMatch(/caligrafía/)
   expect(t).toMatch(/tamaño.*forma.*disposición/);expect(t).toMatch(/legibilidad/)
   expect(t).not.toMatch(/conclusión|Compara los temas y mensajes|belleza/)
  })
  it(`${f}: edición conserva texto e imagen para un medio elegido, sin tres productos`,()=>{
   const p=run(10,f),t=text(p);expect(p.activityType).toBe('CALLIGRAM_CREATION')
   expect(p.criteria).toHaveLength(1);expect(t).toMatch(/mural.*libro artesanal.*revista escolar/)
   expect(t).toMatch(/uno|medio elegido/);expect(t).toMatch(/conserva.*palabras.*versos.*intención.*imagen/i)
   expect(t).not.toMatch(/recitación|borrador|Explica la intención/)
  })
  it(`${f}: revisión con sugerencias conserva verso libre y muestra los cambios`,()=>{
   const p=run(11,f),t=text(p);expect(p.activityType).toBe('CALLIGRAM_CREATION')
   expect(t).toMatch(/profesor|docente/);expect(t).toMatch(/compañer/);expect(t).toMatch(/cambios/)
   expect(t).toMatch(/borrador.*versión/);expect(t).toMatch(/vocabulario/);expect(t).toMatch(/intención/);expect(t).toMatch(/fictici/)
   expect(p.criteria.some(c=>c.templateId==='calligram-feature-rhyme-rhythm')).toBe(false)
   expect(t).not.toMatch(/publicación|Dispone los versos formando/)
  })
  it(`${f}: crear con rima pedida no activa recitación por una exclusión`,()=>{
   const p=run(12,f),t=text(p);expect(p.activityType).toBe('CALLIGRAM_CREATION')
   expect(t).toMatch(/rima.*ritmo/);expect(t).toMatch(/figura/);expect(t).toMatch(/adjetivos/);expect(t).toMatch(/descripciones/)
   expect(t).not.toMatch(/recitación|pausas o énfasis|metáfora|epíteto|memoriza/)
  })
  it(`${f}: corrección solo de caligrafía conserva texto, versos y disposición`,()=>{
   const p=run(13,f),t=text(p);expect(p.criteria).toHaveLength(1)
   expect(t).toMatch(/caligrafía/);expect(t).toMatch(/conserva.*texto.*versos.*disposición/i)
   expect(t).toMatch(/legibilidad|legibles/);expect(t).not.toMatch(/tipografía|digital|rima|emociones/)
  })
 }
})
