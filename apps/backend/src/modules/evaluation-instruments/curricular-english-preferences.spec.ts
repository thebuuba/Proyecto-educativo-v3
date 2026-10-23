import{readFileSync}from'node:fs'
import{resolve}from'node:path'
import{describe,it,expect}from'vitest'
import{recommend}from'./recommendation-engine'
import{affirmativeLanguageTask}from'../../../../../packages/shared/src/language-feature-criteria'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/ing1-gustos-preferencias-independiente-v1.json'),'utf8'))
describe('Inglés1: gustos y preferencias, banco independiente antes del motor',()=>{
 it('una entrevista excluida no se convierte en una actuación; conserva la siguiente acción afirmativa',()=>{
  expect(affirmativeLanguageTask('Revisa el mensaje; no tienes que entrevistar a nadie ni añadir tus gustos y entrega la versión revisada.')).toBe('revisa el mensaje y entrega la version revisada')
 })
 for(const format of['rubrica','lista-cotejo','escala','lista-ponderada']as const)for(const id of['ING-PREF01','ING-PREF04','ING-PREF06','ING-PREF07','ING-PREF08'])it('reserva de lectura '+id+'/'+format,()=>{
  const c=bank.cases.find(c=>c.id===id),p=recommend({activityTitle:c.title,description:c.description,participationMode:c.participationMode,maxScore:20,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null),all=JSON.stringify(p.criteria)
  if(id==='ING-PREF01')expect(all).not.toContain('referencia indicada')
  if(id==='ING-PREF04')expect(all).toMatch(/repara.*descalific|descalific.*repara/)
  if(id==='ING-PREF06')expect(all).toMatch(/solo.*gusto.*sin.*preferencia/)
  if(id==='ING-PREF07')expect(p.criteria[0].description).toMatch(/gusto o.*preferencia entre dibujar y leer/)
  if(id==='ING-PREF08')expect(all).not.toContain('puede registrarse')
 })
 for(const c of bank.cases)for(const format of['rubrica','lista-cotejo','escala','lista-ponderada']as const)it(c.id+'/'+format,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,participationMode:c.participationMode,maxScore:17.35,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null),text=p.criteria.map(r=>r.description).join(' '),all=JSON.stringify(p.criteria)
  expect(text).not.toMatch(/contenido pertinente al propósito y al género|convenciones del género trabajado|pasos y entrega la evidencia/)
  expect(all).not.toMatch(/autonomía y consistencia|apoyo frecuente/)
  switch(c.id){
   case'ING-PREF01':expect(p.activityType).toBe('ORAL_PRESENTATION');expect(text).toMatch(/gusto|gusta/);expect(text).toMatch(/personaje|persona/);expect(text).not.toMatch(/pregunta|razón|conectores/);break
   case'ING-PREF02':expect(p.activityType).toBe('READING_COMPREHENSION');expect(text).toMatch(/gusto.*desagrado.*preferencia/);expect(text).toMatch(/personaje|persona/);expect(text).toMatch(/not stated/);expect(text).not.toMatch(/redacta|pronunciación/);break
   case'ING-PREF03':expect(p.activityType).toBe('LISTENING_COMPREHENSION');expect(text).toMatch(/escuchado/);expect(text).toMatch(/gusto.*preferencia/);expect(text).toMatch(/not stated/);expect(text).not.toMatch(/pronunciación|produce.*nombre/);break
   case'ING-PREF04':expect(p.activityType).toBe('ORAL_INTERACTION');expect(text).toMatch(/cada participante.*pregunta.*responde/i);expect(text).toMatch(/tarjeta/);expect(text).toMatch(/coinciden.*distintas/);expect(text).toMatch(/sin descalificar|sin burlas/);break
   case'ING-PREF05':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(text).toMatch(/oración.*preferencia/);expect(text).toMatch(/borrador/);expect(text).toMatch(/conserva.*otras.*oraciones/i);expect(all).not.toMatch(/delivery-format|mensaje oral|sus gustos/);break
   case'ING-PREF06':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(text).toMatch(/preferencia.*lectura.*dibujo/);expect(text).toMatch(/razón.*silencio.*materiales/);expect(text).not.toMatch(/texto leído|siempre.*because/);break
   case'ING-PREF07':expect(p.activityType).toBe('OTHER');expect(text).toMatch(/gusto o.*preferencia/);expect(text).toMatch(/audio o.*papel/);expect(text).toMatch(/hoy/);expect(text).not.toMatch(/texto leído|gusto y preferencia/);break
   case'ING-PREF08':expect(p.confidence).toBe('LOW');expect(p.teacherReviewNotes?.join(' ')).toMatch(/provisional.*producto.*modalidad.*datos.*fase/i);expect(p.selectedCurriculumElements).toEqual([]);expect(text).toMatch(/acordad/);break
  }
  expect(p.totalScoreUnits).toBe(1735);expect(p.criteria.length).toBeLessThanOrEqual(20)
 })
})
