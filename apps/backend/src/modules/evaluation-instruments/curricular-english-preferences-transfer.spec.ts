import{readFileSync}from'node:fs'
import{resolve}from'node:path'
import{describe,it,expect}from'vitest'
import{recommend}from'./recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/ing1-gustos-preferencias-transferencia-reservada-v1.json'),'utf8'))
describe('Preferencias: transferencia independiente con referencias efectivamente enviadas',()=>{
 for(const c of bank.cases)for(const format of['rubrica','lista-cotejo','escala','lista-ponderada']as const)it(c.id+'/'+format,()=>{
  const payload=bank.effectivePayloads.find(p=>p.caseId===c.id).payload,p=recommend({activityTitle:payload.title,description:payload.description,participationMode:c.participationMode,maxScore:17.35,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null),text=p.criteria.map(r=>r.description).join(' '),all=JSON.stringify(p.criteria)
  switch(c.id){
   case'ING-PREF-TR01':expect(p.activityType).toBe('READING_COMPREHENSION');expect(text).toMatch(/afirmaci[oó]n|afirmaciones/);expect(text).toMatch(/fragmentos|sustent/);expect(text).not.toMatch(/comunica.*gusto propio|producto acordado/i);break
   case'ING-PREF-TR02':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(text).toMatch(/dos preguntas/);expect(text).toMatch(/gusta|disfruta/);expect(text).toMatch(/preferencia.*ajedrez.*dibujo/);expect(text).toMatch(/hoy/);expect(all).not.toMatch(/mensaje oral|respuesta recibida/);break
   case'ING-PREF-TR03':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(text).toMatch(/cada participante.*pregunta.*responde/i);expect(text).toMatch(/preguntas.*respuestas.*escrit|escrit.*preguntas.*respuestas/);expect(text).toMatch(/ausencia de preferencia/);expect(text).not.toMatch(/texto leído|consenso|mensaje oral|comunica.*gustos/i);break
   case'ING-PREF-TR04':expect(p.activityType).toBe('ORAL_PRESENTATION');expect(text).toMatch(/gusto.*desagrado/);expect(text).toMatch(/cada personaje|cada persona/);expect(all).toMatch(/polaridad|negaci[oó]n/);expect(text).not.toMatch(/preferencia|preguntas|envío|video/);break
   case'ING-PREF-TR05':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(text).toMatch(/preferencia.*ausencia de preferencia.*desagrado/);expect(text).toMatch(/una.*alternativa/);expect(text).toMatch(/pregunta dada|contexto/);expect(all).not.toMatch(/razón|oración completa|pregunta nueva/);break
   case'ING-PREF-TR06':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(p.teacherReviewNotes?.join(' ')).toMatch(/fuentes.*preferencias.*distintas|preferencias.*incompatibles/);expect(p.confidence).toBe('LOW');expect(p.selectedCurriculumElements).toEqual([]);expect(text).toMatch(/aclar|acuerd/);expect(text).not.toMatch(/texto leído|investiga|entrevista/);break
  }
  expect(p.totalScoreUnits).toBe(1735);expect(p.criteria.length).toBeLessThanOrEqual(20)
 })
})
