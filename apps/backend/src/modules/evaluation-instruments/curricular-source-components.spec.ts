import{readFileSync}from'node:fs'
import{resolve}from'node:path'
import{describe,it,expect}from'vitest'
import{recommend,firstSecondaryLanguageSelections}from'./recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-cierre-componentes-independiente-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada']as const
describe('Lengua1: componentes ambientales y publicación de una investigación dada',()=>{
 for(const c of bank.cases)for(const format of formats)it(`${c.id}/${format}: evidencias fijadas antes de generar`,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,participationMode:c.participationMode,maxScore:17.35,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
  const descriptions=p.criteria.map(r=>r.description).join(' '),all=JSON.stringify(p.criteria.map(r=>({description:r.description,descriptors:r.descriptors})))
  if(c.id.endsWith('E01')){
   expect(descriptions).toMatch(/recomendaci[oó]n.*ficha/)
   expect(descriptions).toMatch(/qu[eé] entendi[oó]/)
   expect(descriptions).toMatch(/pregunta o.*propuesta/)
   expect(descriptions).toMatch(/respuesta.*recibida|responde.*intervenci[oó]n/i)
   expect(descriptions).toMatch(/mantiene o ajusta|mantener o ajustar/)
   expect(descriptions).toMatch(/registro|registra|anota/i)
   expect(descriptions).toMatch(/dentro del aula/)
   expect(p.activityType).toBe('ORAL_INTERACTION')
   expect(firstSecondaryLanguageSelections(p.activityType,c.description,bank.context)?.suggestedEvaluationTechnique).toBe('observacion-directa')
  }else if(c.id.endsWith('E02')){
   const integrity=p.criteria.find(r=>r.templateId==='len1-community-publication-integrity')!
   expect(integrity.description).toMatch(/qu[eé] se investig[oó]/)
   expect(integrity.description).toMatch(/observaciones.*resultados.*conclusi[oó]n.*limitada/)
   expect(integrity.description).toMatch(/registros/)
   expect(integrity.description).toMatch(/simulad|simulaci[oó]n/)
   expect(descriptions).toMatch(/publicaci[oó]n efectiva/)
  }else if(c.id.endsWith('E03')){
   expect(all).not.toMatch(/clasifica|separar los materiales/)
   expect(descriptions).toMatch(/cara.*disponible|cara.*utiliz|una sola cara/)
   expect(descriptions).toMatch(/evita.*desechar|evitar.*descarte/)
   expect(descriptions).toMatch(/acciones.*ficha|ficha.*acciones/)
   expect(descriptions).toMatch(/orden/)
  }else{
   expect(descriptions).toMatch(/copias adicionales.*necesarias|necesidad de copias adicionales/)
   expect(descriptions).toMatch(/todas las personas|nadie sin lectura/)
   expect(descriptions).toMatch(/algunas o ninguna/)
   expect(descriptions).toMatch(/consumo innecesario|impresiones innecesarias/)
   expect(descriptions).toMatch(/conserva.*dem[aá]s instrucciones|mantiene.*dem[aá]s instrucciones/i)
   expect(all).not.toMatch(/puntuaci[oó]n y numeraci[oó]n|conserva exactamente acciones/)
  }
  expect(all).not.toMatch(/apoyo frecuente|acompa[nñ]amiento paso a paso|autonom[ií]a/)
  expect(p.totalScoreUnits).toBe(1735);expect(p.criteria.length).toBeLessThanOrEqual(20)
  if(['rubrica','escala'].includes(format)&&/E03|E04/.test(c.id))for(const row of p.criteria){
   expect(row.descriptors.at(-1)?.text).toContain(row.progressionLevels![3])
   expect(row.descriptors.at(-1)?.text).toContain(row.progressionLevels![4])
  }
 })
})

const contrasts=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-componentes-contrastes-independiente-v1.json'),'utf8'))
describe('Contrastes independientes de fase, ambiente y alcance de la revisión',()=>{
 for(const c of contrasts.cases)for(const format of formats)it(`${c.id}/${format}`,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,participationMode:c.participationMode,maxScore:20,preferredInstrumentType:format},contrasts.context,null,[],'UNMAPPED',null)
  const text=p.criteria.map(r=>r.description).join(' '),all=JSON.stringify(p.criteria)
  if(c.id.endsWith('V01')){
   expect(text).toMatch(/guion/);expect(text).toMatch(/[aá]rboles/);expect(text).toMatch(/ficha/)
   expect(text).not.toMatch(/semejanzas|diferencias|recibid|intercambio realizado/)
  }else if(c.id.endsWith('V02')){
   expect(text).toMatch(/[aá]rboles/);expect(text).not.toMatch(/agua/)
   expect(text).toMatch(/qu[eé] entendi[oó]/);expect(text).toMatch(/pregunta o.*propuesta/)
   expect(p.activityType).toBe('ORAL_INTERACTION')
  }else if(c.id.endsWith('V03')){
   expect(text).toMatch(/provisional/i);expect(text).toMatch(/conserva.*noticia|noticia.*conserva/i)
   expect(text).toMatch(/simulad|simulaci[oó]n/);expect(all).not.toMatch(/Titular, entrada y cuerpo/)
   expect(p.confidence).toBe('LOW');expect(p.internalTrace.reasons.join(' ')).toMatch(/confirmar.*fase.*medio/i)
   expect(p.selectedCurriculumElements).toEqual([])
  }else if(c.id.endsWith('V04')){
   expect(text).toMatch(/tildes.*puntuaci[oó]n/);expect(text).toMatch(/materiales/)
   expect(text).toMatch(/finalidad|prop[oó]sito/);expect(all).not.toMatch(/clasifica|numeraci[oó]n/)
  }else if(c.id.endsWith('V05')){
   expect(text).toMatch(/copias.*necesarias/);expect(text).toMatch(/caso asignado/)
   expect(text).toMatch(/todas.*algunas.*ninguna/);expect(text).not.toMatch(/ficha/)
   expect(text).toMatch(/diferencia entre lectores y ejemplares/)
  }else{
   expect(text).toMatch(/qu[eé] se investig[oó]/);expect(text).toMatch(/simulada/)
   expect(text).toMatch(/publicaci[oó]n efectiva/)
  }
  expect(p.criteria.length).toBeLessThanOrEqual(20);expect(p.totalScoreUnits).toBe(2000)
  expect(all).not.toMatch(/apoyo frecuente|acompa[nñ]amiento paso a paso|autonom[ií]a/)
 })
})
