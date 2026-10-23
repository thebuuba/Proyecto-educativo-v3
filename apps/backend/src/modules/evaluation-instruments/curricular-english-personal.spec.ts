import{readFileSync}from'node:fs'
import{resolve}from'node:path'
import{describe,it,expect}from'vitest'
import{recommend}from'./recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/ing1-informacion-personal-independiente-v1.json'),'utf8'))
describe('Inglés de primero: consignas independientes de información personal',()=>{
 for(const c of bank.cases)for(const format of['rubrica','lista-cotejo','escala','lista-ponderada']as const)it(c.id+'/'+format,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,participationMode:c.participationMode,maxScore:17.35,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
  const text=p.criteria.map(r=>r.description).join(' '),all=JSON.stringify(p.criteria)
  expect(text).not.toMatch(/contenido pertinente al propósito y al género|convenciones del género trabajado|pasos y entrega la evidencia/)
  expect(all).not.toMatch(/autonomía y consistencia|apoyo frecuente/)
  switch(c.id){
   case'ING-PER01':expect(p.activityType).toBe('ORAL_INTERACTION');expect(text).toMatch(/pregunta|solicita/);expect(text).toMatch(/responde/);expect(text).toMatch(/nombre.*país.*ciudad/);expect(text).toMatch(/tarjeta/);break
   case'ING-PER02':expect(p.activityType).toBe('ORAL_PRESENTATION');expect(text).toMatch(/nombre.*país.*ocupación/);expect(text).toMatch(/otra persona|personaje/);expect(text).toMatch(/oral/);break
   case'ING-PER03':expect(p.activityType).toBe('LISTENING_COMPREHENSION');expect(text).toMatch(/escuch/);expect(text).toMatch(/nombre|persona/);expect(text).toMatch(/país.*ocupación/);expect(text).not.toMatch(/pronunciación|redacta|conectores/);break
   case'ING-PER04':expect(p.activityType).toBe('READING_COMPREHENSION');expect(text).toMatch(/campo/);expect(text).toMatch(/país.*nacionalidad.*ocupación/);expect(text).toMatch(/not stated/);expect(text).not.toMatch(/mensaje oral|redacta|conectores/);break
   case'ING-PER05':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(text).toMatch(/dos datos.*desconoc/);expect(text).toMatch(/tarjeta/);expect(text).toMatch(/conserva.*preguntas.*respuestas/i);break
   case'ING-PER06':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(text).toMatch(/nombre.*país.*ocupación/);expect(text).toMatch(/preparación|preparator/);expect(text).not.toMatch(/responde al interlocutor|continua el intercambio/i);break
   case'ING-PER07':expect(text).toMatch(/pregunta.*respuesta.*país/);expect(text).toMatch(/conserva.*nombre.*ciudad.*ocupación.*resto/i);expect(text).toMatch(/borrador/);break
   case'ING-PER08':expect(text).toMatch(/nombre.*ciudad/);expect(text).toMatch(/pregunta.*país/);expect(text).toMatch(/audio o.*(?:papel|escrito)|oral o escrito/i);expect(text).toMatch(/sin exigir.*envío|no exige.*envío/i);break
   case'ING-PER09':expect(p.activityType).toBe('ORAL_INTERACTION');expect(text).toMatch(/origen.*residencia/);expect(text).toMatch(/aclar/);expect(text).toMatch(/confirma.*registra|confirma.*registro/);break
   case'ING-PER10':expect(p.teacherReviewNotes?.join(' ')).toMatch(/provisional.*modalidad.*producto.*datos/i);expect(text).not.toMatch(/confirma.*modalidad/);expect(p.confidence).toBe('LOW');break
   case'ING-PER11':expect(p.teacherReviewNotes?.join(' ')).toMatch(/provisional.*campos.*fuente/i);expect(text).not.toMatch(/confirma.*fuente/);expect(text).not.toMatch(/conectores|pronunciación/);expect(p.confidence).toBe('LOW');break
  }
  expect(p.totalScoreUnits).toBe(1735);expect(p.criteria.length).toBeLessThanOrEqual(20)
 })
})
const transfer=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/ing1-personal-transferencia-v1.json'),'utf8'))
describe('Información personal: transferencia independiente de acto, fase y fuente',()=>{
 for(const c of transfer.cases)for(const format of['rubrica','lista-cotejo','escala','lista-ponderada']as const)it(c.id+'/'+format,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,participationMode:c.participationMode,maxScore:20,preferredInstrumentType:format},transfer.context,null,[],'UNMAPPED',null)
  const text=p.criteria.map(r=>r.description).join(' ')
  switch(c.id){
   case'ING-TR01':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(text).toMatch(/tres preguntas.*nombre.*país.*ocupación/);expect(text).not.toMatch(/continua el intercambio|pronunciación/);break
   case'ING-TR02':expect(p.activityType).toBe('ORAL_INTERACTION');expect(text).toMatch(/pregunta y responde/i);expect(text).not.toMatch(/presenta.*visitante|preparación escrita/);break
   case'ING-TR03':expect(text).toMatch(/nombre.*ciudad/);expect(text).toMatch(/pregunta.*país/);expect(text).toMatch(/única modalidad elegida/);expect(text).not.toMatch(/oral y escrito|graba.*video/);break
   case'ING-TR04':expect(text).toMatch(/pregunta.*respuesta.*ciudad/);expect(text).toMatch(/conserva exactamente nombre, país y ocupación/i);expect(text).toMatch(/borrador/);break
   case'ING-TR05':expect(p.activityType).toBe('READING_COMPREHENSION');expect(text).toMatch(/un guion/);expect(text).not.toContain('not stated');expect(text).toMatch(/sin inferir país o nacionalidad/);break
   case'ING-TR06':expect(p.activityType).toBe('LISTENING_COMPREHENSION');expect(text).toMatch(/mensaje escuchado/);expect(text).toContain('not given');expect(text).not.toMatch(/pronunciación|redacta|texto leído/);break
  }
  expect(p.totalScoreUnits).toBe(2000);expect(p.criteria.length).toBeLessThanOrEqual(20)
 })
})
describe('Reservas de lectura pedagógica de la captura170v1',()=>{
 const proposal=(id:string)=>{const c=bank.cases.find(c=>c.id===id);return recommend({activityTitle:c.title,description:c.description,participationMode:c.participationMode,maxScore:20,preferredInstrumentType:'rubrica'},bank.context,null,[],'UNMAPPED',null)}
 for(const id of ['ING-PER02','ING-PER10'])it(id+' no añade preguntas a una presentación',()=>{
  expect(JSON.stringify(proposal(id).criteria)).not.toMatch(/preguntas|interlocutor/)
 })
 for(const id of ['ING-PER03','ING-PER04'])it(id+' distingue una confusión puntual de una confusión generalizada',()=>{
  const row=proposal(id).criteria.find(r=>r.templateId==='ing-1-personal')!
  expect(row.progressionLevels![1]).toMatch(/confusión puntual|asociación.*incorrecta/)
  expect(row.progressionLevels![2]).toMatch(/confunde|confusiones/)
  expect(row.progressionLevels![3]).toMatch(/mayoría|generalizada/)
 })
 it('PER07 limita el parcial de conservación a forma, sin alterar datos ni sentido',()=>{
  expect(proposal('ING-PER07').criteria.find(r=>r.templateId==='ing-1-personal-preservation')!.progressionLevels![2]).toMatch(/formales.*sin alterar datos ni sentido/)
 })
 it('PER11 permite distinguir error puntual y generalizado sin exigir fuente inexistente',()=>{
  for(const row of proposal('ING-PER11').criteria){expect(row.progressionLevels![1]).toMatch(/incorrecta|error puntual/);expect(row.progressionLevels![3]).toMatch(/mayoría|generalizada/)}
 })
 it('PER01 distingue una descalificación reparada de otra que persiste',()=>{
  const row=proposal('ING-PER01').criteria.find(r=>r.templateId==='ing-1-interaction')!
  expect(row.progressionLevels![1]).toMatch(/descalificación.*repara/)
  expect(row.progressionLevels![2]).toMatch(/descalificación.*sin reparar/)
  expect(row.progressionLevels![2]).toMatch(/interrumpe reiteradamente sin reparar/)
 })
 it('PER02 conserva un mínimo específico para cada dato separado del cotejo',()=>{
  const c=bank.cases.find(c=>c.id==='ING-PER02')
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:20,preferredInstrumentType:'lista-cotejo'},bank.context,null,[],'UNMAPPED',null)
  const parts=p.criteria.filter(r=>r.templateId?.startsWith('ing-1-personal:'))
  expect(parts).toHaveLength(3)
  for(const part of parts)expect(part.fourLevelLowest).toBe(`${part.progressionLevels![3]} O bien: ${part.progressionLevels![4]}`)
 })
})
