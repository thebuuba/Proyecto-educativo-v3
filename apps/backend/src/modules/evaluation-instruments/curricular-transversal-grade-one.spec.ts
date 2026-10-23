import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend,firstSecondaryLanguageSelections} from './recommendation-engine'
import {detectTeachingStrategy} from '@aula/shared'

const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-transversales-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
// Mutations caught: selecting a negated product, losing a requested evidence relation,
// expanding a bounded revision or evaluating two stories instead of two interpretations.
describe('Lengua1: evidencia transversal fijada desde el currículo antes de corregir',()=>{
 for(const f of formats)for(const c of bank.cases)it(`${c.id}/${f}: evalúa el producto solicitado y sus relaciones`,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:17.35,participationMode:c.participationMode,preferredInstrumentType:f},bank.context,null,[],'UNMAPPED',null)
  const t=JSON.stringify(p.criteria),id=c.id.replace('LEN1-TRA-','')
  const types:Record<string,string>={SCI01:'NEWS_WRITING',SCI02:'NEWSCAST',SCI03:'WRITTEN_PRODUCTION',SCI04:'ANALYSIS',CIV01:'PROJECT',CIV02:'PROJECT',CIV03:'COMPARISON',CIV04:'PROJECT',ARG01:'DEBATE',VAL01:'DETECTIVE_STORY_ANALYSIS',VAL02:'DETECTIVE_STORY_WRITING',CAL01:'CALLIGRAM_CREATION',CAL02:'CALLIGRAM_ANALYSIS'}
  expect(p.activityType).toBe(types[id])
  if(id.startsWith('SCI')){
   expect(t).toMatch(/procedimiento|cómo se observó/)
   expect(t).toMatch(/conclusión/)
   expect(t).toMatch(/datos.*conclusión|conclusión.*datos/)
   expect(t).toMatch(/fuente|ficha|fragmento|registro/)
   expect(t).toMatch(/hallazgo.*opinión|resultados.*interpretaci|afirmaciones.*datos|datos.*afirmaciones/)
   expect(t).not.toMatch(/Realiza un experimento|Diseña una investigación|nuevas mediciones/)
  }
  switch(id){
   case'SCI01':expect(t).toMatch(/pregunta/);expect(t).toMatch(/digital/);expect(t).toMatch(/anónim/);expect(t).toMatch(/referencias|fuentes/);expect(t).not.toMatch(/publicación realizada|Publica.*Internet/);break
   case'SCI02':expect(t).toMatch(/pregunta/);expect(t).toMatch(/límite/);expect(t).toMatch(/oral|curso|audiencia/);expect(t).not.toMatch(/su noticia|cada integrante.*noticia|diapositiva|grabación/);break
   case'SCI03':expect(t).toMatch(/propias palabras|paráfrasis/);expect(t).toMatch(/científicos.*sociales|sociales.*científicos/);expect(t).toMatch(/cada idea|cada ficha|ambas fichas/);break
   case'SCI04':expect(t).toMatch(/fragmentos/);expect(t).toMatch(/excede|más allá|sobreinterpret/);expect(t).not.toMatch(/Planifica.*investigación|Elabora un informe completo/);break
   case'CIV01':for(const s of ['problema','datos','objetivo','acciones','responsables','calendario','dignidad','igualdad','acuerdo','opinión','viable'])expect(t).toContain(s);expect(t).toMatch(/sin descalific|sin insult/);expect(t).not.toMatch(/presupuesto|encuestas|ejecuta el proyecto/);break
   case'CIV02':for(const s of ['problema','datos','objetivo','acciones','responsables','secuencia','igualdad'])expect(t).toContain(s);expect(t).toMatch(/plan|previst/);expect(t).not.toMatch(/resultados obtenidos|conclusiones de la investigación|trabajo en equipo|ejecuta el proyecto/);break
   case'CIV03':for(const s of ['proyectos','datos','objetivos','acciones','responsables','tiempos','dignidad','igualdad','viab'])expect(t).toContain(s);expect(t).toMatch(/contrasta|Contrasta|compar/);break
   case'CIV04':expect(p.criteria).toHaveLength(1);expect(t).toMatch(/recomendación.*viable|viable.*recomendación/);expect(t).toMatch(/conserva.*problema.*objetivo.*acciones.*responsables.*tiempos/i);break
   case'ARG01':for(const s of ['postura','hecho','ejemplo','analogía','contraargumento','respuesta','conclusión'])expect(t).toContain(s);expect(t).toMatch(/ejemplo.*concret/);expect(t).toMatch(/analogía.*semejanza/);expect(t).toMatch(/sin descalific|sin insult/);expect(t).not.toMatch(/ensayo|Texto escrito|escritura|al menos.*intervenciones/);expect(p.criteria.some(r=>r.templateId.startsWith('delivery-format'))).toBe(false);break
   case'VAL01':for(const s of ['valores','decisiones','acciones','diálogo','consecuencias','interpretaciones'])expect(t).toContain(s);expect(t).not.toMatch(/ambos cuentos|dos cuentos|conectores|Escribe un cuento/);break
   case'VAL02':for(const s of ['decisiones','convivencia','dignidad','acciones','diálogo','indicios'])expect(t).toContain(s);expect(t).toMatch(/soluciones.*trama|desenlace.*pistas/);break
   case'CAL01':{
    const revision=p.criteria.find(r=>r.templateId==='calligram-process-revision')
    expect(revision?.progressionLevels?.[0]??revision?.description).toMatch(/ajustando.*rima/)
    expect(revision?.progressionLevels?.[0]??revision?.description).toMatch(/conserva.*(?:intención.*imagen|imagen.*intención)/)
    break
   }
   case'CAL02':expect(t).toMatch(/emoción.*representada|representada.*emoción/);expect(t).toMatch(/palabras.*figura|figura.*palabras/);expect(t).toMatch(/coincidencia o.*diferencia|coincidencia.*o diferencia/);expect(t).toMatch(/sin insult|sin burl|sin descalific/);break
  }
  expect(p.totalScoreUnits).toBe(1735);expect(p.criteria.length).toBeLessThanOrEqual(20)
 })
 for(const f of ['rubrica','escala'] as const)it(`${f}: los descriptores puntuables conservan errores sustantivos`,()=>{
  const proposal=(id:string)=>{const c=bank.cases.find(c=>c.id===`LEN1-TRA-${id}`);return recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:c.participationMode,preferredInstrumentType:f},bank.context,null,[],'UNMAPPED',null)}
  const scored=(id:string)=>JSON.stringify(proposal(id).criteria.map(r=>r.descriptors))
  expect(scored('SCI03')).toMatch(/Copia pasajes|copia literal|copiar/)
  expect(scored('CIV04')).toMatch(/cambia elementos.*conservar/)
  expect(scored('ARG01')).toMatch(/Distorsiona el contraargumento|reemplaza la respuesta/)
  expect(scored('CAL02')).toMatch(/Distorsiona la interpretación/)
  const story=proposal('VAL02').criteria.find(r=>r.templateId==='len1-transversal-story-decisions')
  expect(JSON.stringify(story)).not.toMatch(/soluciones se sostienen|resolución del misterio/)
 })
 for(const id of ['CIV01','CIV02','CIV04','VAL01','CAL02'])it(`${id}: recomienda análisis del producto escrito y gradación de calidad`,()=>{
  const c=bank.cases.find(c=>c.id===`LEN1-TRA-${id}`)
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:c.participationMode},bank.context,null,[],'UNMAPPED',null)
  // Optional context is part of this fix; the production function must use it.
  const select=firstSecondaryLanguageSelections as (type:string,description:string,context:typeof bank.context)=>{suggestedEvaluationTechnique:string;suggestedInstrumentType:string}
  expect(select(p.activityType,c.description,bank.context)).toEqual({suggestedEvaluationTechnique:'analisis-producciones',suggestedInstrumentType:'rubrica'})
  expect(p.instrumentType).toBe('rubrica')
 })
 it('el debate conserva argumentos afirmativos antes de «sin descalificar»',()=>{
  const c=bank.cases.find(c=>c.id==='LEN1-TRA-ARG01')
  expect(detectTeachingStrategy({...bank.context,title:c.title,description:c.description,activityType:'DEBATE',participationMode:'GROUP'}).id).toBe('DEBATE')
 })
})
