import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'

const read=(name:string)=>JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/'+name+'.json'),'utf8'))
const banks=[read('len1-transversales-complementario-independiente-v1'),read('len1-cierre-fuente-independiente-v1')]
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
// Evidence is fixed by independent activities, not by existing provider labels.
describe('Lengua1: evidencias de publicación, intercambio e inferencia',()=>{
 for(const format of formats)it(`${format}: conserva límites y consecuencias solo donde se solicitan, sin duplicarlos`,()=>{
  for(const c of banks[0].cases.filter(c=>/C01$|C10$|C11$/.test(c.id))){
   const p=recommend({activityTitle:c.title,description:c.description,maxScore:20,preferredInstrumentType:format},banks[0].context,null,[],'UNMAPPED',null)
   if(c.id.endsWith('C01'))expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/delimita qu[eé] todav[ií]a/)
   if(c.id.endsWith('C10'))expect(p.criteria.find(r=>r.templateId==='len1-community-reasoning-limits')!.description).not.toMatch(/y qu[eé] no puede resolverse/)
   if(c.id.endsWith('C11'))expect(p.criteria.filter(r=>/consecuencias/.test(r.description))).toHaveLength(1)
  }
 })
 for(const format of formats)for(const suffix of ['P01A','P02B','P03A','P04A','P06B','P07A','P07B','P08B'])it(`${format}/${suffix}: no añade fases, soportes o evidencias no solicitadas`,()=>{
  const bank=read('len1-contrastes-independientes-v1'),c=bank.cases.find(c=>c.id.endsWith(suffix))
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:20,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
  const visible=JSON.stringify(p.criteria.map(r=>({title:r.title,description:r.description,descriptors:r.descriptors})))
  if(suffix==='P01A')expect(visible).not.toMatch(/revisi[oó]n docente/)
  if(suffix==='P02B'){expect(visible).not.toMatch(/revista/);expect(visible).toMatch(/antolog[ií]a impresa/)}
  if(suffix==='P03A'){const expression=p.criteria.find(r=>r.templateId==='calligram-expression')!;expect(expression.description).toMatch(/calma/);expect(expression.description).not.toMatch(/tema elegido/)}
  if(suffix==='P04A')expect(visible).not.toMatch(/entre mensajes|mensaje recibido/)
  if(suffix==='P06B')expect(p.criteria.some(r=>r.templateId==='len1-community-reasoning-limits')).toBe(false)
  if(suffix==='P07A'||suffix==='P07B')expect(p.criteria.some(r=>r.templateId==='len1-community-history-limits')).toBe(false)
  if(suffix==='P08B')expect(visible).not.toMatch(/consecuencias/)
 })
 for(const format of formats)it(`${format}: escribir un borrador no exige revisión; responder conserva solo información disponible`,()=>{
  const bank=read('len1-contrastes-independientes-v1')
  for(const suffix of ['P03A','P04A','P04B']){
   const c=bank.cases.find(c=>c.id.endsWith(suffix)),p=recommend({activityTitle:c.title,description:c.description,maxScore:20,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
   if(suffix==='P03A')expect(p.criteria.some(r=>/calligram-(?:process-)?revision/.test(r.templateId))).toBe(false)
   else expect(JSON.stringify(p.criteria.map(r=>({description:r.description,descriptors:r.descriptors})))).not.toMatch(/lecturas|fuentes/)
  }
 })
 for(const format of formats)for(let pair=1;pair<=8;pair++)it(`contraste independiente P0${pair}/${format}`,()=>{
  const bank=read('len1-contrastes-independientes-v1'),tasks=bank.cases.slice((pair-1)*2,pair*2)
  const [a,b]=tasks.map(c=>recommend({activityTitle:c.title,description:c.description,maxScore:20,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null))
  const av=a.criteria.map(r=>r.description).join(' '),bv=b.criteria.map(r=>r.description).join(' ')
  if(pair===1){expect(av).toMatch(/borrador.*sin publicar/);expect(bv).toMatch(/publicaci[oó]n efectiva/);expect(bv).not.toMatch(/investigaci[oó]n nueva|datos de presentaci[oó]n previstos/)}
  if(pair===2){expect(av).toMatch(/antolog[ií]a digital/);expect(av).not.toMatch(/[ií]ndice|impresa/);expect(bv).toMatch(/antolog[ií]a impresa/);expect(bv).not.toMatch(/digital/)}
  if(pair===3){expect(a.activityType).toBe('CALLIGRAM_CREATION');expect(av).not.toMatch(/colocaci[oó]n.*mural/);expect(bv).toMatch(/colocaci[oó]n efectiva/);expect(bv).not.toMatch(/recit|cr[eé]ditos|rima/)}
  if(pair===4){expect(av).toMatch(/env[ií]o.*pendiente/);expect(av).not.toMatch(/pregunta.*recibida/);expect(bv).toMatch(/pregunta.*recibida/);expect(bv).toMatch(/respuesta/);expect(bv).not.toMatch(/foro|lecturas|comparte una explicaci[oó]n/i)}
  if(pair===5){const shape=p=>p.criteria.map(({templateId,title,description,descriptors,maxScoreUnits,relativeWeight})=>({templateId,title,description,descriptors,maxScoreUnits,relativeWeight}));expect(shape(a)).toEqual(shape(b));expect(av).not.toMatch(/qui[eé]nes|c[oó]mo sucedi[oó]|voz alta/)}
  if(pair===6){expect(av).toMatch(/ideas principales|resum/i);expect(av).not.toMatch(/(?:formula|construye|infiere) una relaci[oó]n nueva/i);expect(bv).toMatch(/relaci[oó]n nueva/);expect(bv).toMatch(/ambos textos/);expect(bv).not.toMatch(/biblioteca|horarios/)}
  if(pair===7){expect(av).toMatch(/antes.*ahora/);expect(av).not.toMatch(/recurso natural|patrimonio natural/);expect(bv).toMatch(/cambio.*recurso natural/);expect(bv).not.toMatch(/testimonios/)}
  if(pair===8){expect(av).toMatch(/razones.*respuesta|respuesta.*razones/i);expect(av).not.toMatch(/decisi[oó]n propia/);expect(bv).toMatch(/decisi[oó]n propia/);expect(bv).toMatch(/coincidencia o.*diferencia/)}
 })
 for(const format of ['rubrica','escala'] as const)it(`${format}: los niveles de publicación distinguen fallos observables sin puntuar dos veces los créditos`,()=>{
  for(const bank of banks)for(const c of bank.cases.filter(c=>/C0[3-6]$|F01$/.test(c.id))){
   const p=recommend({activityTitle:c.title,description:c.description,maxScore:20,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
   const integrity=p.criteria.find(r=>r.templateId==='len1-community-publication-integrity')!
   expect(integrity.descriptors[1].text).not.toMatch(/detalle de presentaci[oó]n/)
   expect(integrity.descriptors[1].text).toMatch(/diferencia.*transcripci[oó]n/)
   const access=p.criteria.find(r=>r.templateId==='len1-community-publication-access')
   if(access)expect(access.descriptors[1].text).toMatch(/obst[aá]culo.*acceso|dificulta.*lectura/)
   if(c.id.endsWith('F01'))expect(p.criteria.filter(r=>/cr[eé]ditos/.test(r.description))).toHaveLength(1)
  }
 })
 it('la preparación editorial final no sustituye el proceso completo de creación del cuento',()=>{
  const bank=read('len1-cuento-v1'),c=bank.cases.find(c=>c.id==='LEN1-CUE-02')
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:20,preferredInstrumentType:'rubrica'},bank.context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('DETECTIVE_STORY_WRITING')
  expect(p.criteria.some(r=>r.templateId.startsWith('len1-community-publication'))).toBe(false)
  expect(p.criteria.some(r=>r.templateId==='detective-mystery')).toBe(true)
 })
 for(const bank of banks)for(const c of bank.cases)for(const format of formats)it(`${c.id}/${format}`,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:17.35,participationMode:c.participationMode,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
  const visible=p.criteria.map(r=>r.description).join(' '),scored=JSON.stringify(p.criteria.map(r=>r.descriptors)),id=c.id.slice(-3)
  switch(id){
   case'C01':expect(visible).toMatch(/hecho.*hist[oó]ric/i);expect(visible).toMatch(/relaci[oó]n.*tradici[oó]n.*patrimonio|relaciona.*pr[aá]ctica.*patrimonio/i);expect(visible).toMatch(/ambos textos/);break
   case'C02':expect(visible).toMatch(/antes.*ahora/);expect(visible).toMatch(/cambio.*recurso natural/);expect(visible).toMatch(/documentad.*interpretaci[oó]n|documentad.*hip[oó]tesis/);expect(visible).toMatch(/oral/);break
   case'C03':expect(visible).toMatch(/publicaci[oó]n.*efectiva|publica.*efectivamente/i);expect(visible).toMatch(/destinatarios.*abrir|acceso.*destinatarios/);expect(visible).toMatch(/conserva.*texto.*referencias/i);expect(visible).toMatch(/enlace o.*constancia/);break
   case'C04':expect(visible).toMatch(/vista previa/);expect(visible).toMatch(/guardad.*borrador/);expect(visible).toMatch(/sin publicar/);expect(visible).toMatch(/conserva.*texto.*referencias/i);break
   case'C05':expect(visible).toMatch(/antolog[ií]a digital/);expect(visible).toMatch(/[ií]ndice.*cuento/);expect(visible).toMatch(/conserva.*palabras.*pistas.*desenlace/i);expect(visible).toMatch(/cr[eé]ditos/);expect(visible).not.toMatch(/impres/);break
   case'C06':expect(visible).toMatch(/colocaci[oó]n.*mural/);expect(visible).toMatch(/conserva.*palabras.*figura/i);expect(visible).toMatch(/fotograf[ií]a o.*verificaci[oó]n docente/);expect(p.criteria.some(r=>r.templateId==='calligram-revision')).toBe(false);break
   case'C07':expect(visible).toMatch(/problema ambiental/);expect(visible).toMatch(/pregunta o propuesta.*recibida/);expect(visible).toMatch(/responde.*fuentes|respuesta.*fuentes/i);expect(visible).toMatch(/registro.*intercambio|guarda.*intercambio/i);break
   case'C08':expect(visible).toMatch(/otro centro/);expect(visible).toMatch(/idea.*recibida/);expect(visible).toMatch(/mantiene o revisa|mantener o revisar/);expect(visible).toMatch(/respuesta externa.*pendiente|pendiente.*respuesta externa/);expect(scored).not.toMatch(/no llega|todav[ií]a no.*respuesta|respuesta externa.*pendiente/);break
   case'C09':expect(visible).toMatch(/relaci[oó]n nueva|relaci[oó]n.*no.*literal/);expect(visible).toMatch(/ambos textos/);expect(visible).toMatch(/l[ií]mite|no permiten asegurar/);break
   case'C10':expect(visible).toMatch(/diferencia|discrepancia|tensi[oó]n/);expect(visible).toMatch(/s[ií]ntesis.*integr|integra.*s[ií]ntesis/i);expect(visible).toMatch(/conclusi[oó]n.*o.*(?:cuesti[oó]n|tensi[oó]n).*abierta/);break
   case'C11':expect(visible).toMatch(/decisi[oó]n propia.*ficticia|decisi[oó]n.*situaci[oó]n imaginaria/);expect(visible).toMatch(/personaje.*razones|razones.*personaje/);expect(visible).toMatch(/coincidencia o.*diferencia/);expect(visible).toMatch(/consecuencias/);break
   case'C12':expect(visible).toMatch(/texto recibido/);expect(visible).toMatch(/nota.*individual/);expect(visible).toMatch(/conserva o modifica/);expect(visible).toMatch(/razones/);break
   case'F01':expect(visible).toMatch(/revista o antolog[ií]a impresa/);expect(visible).toMatch(/disponible.*biblioteca/);expect(visible).toMatch(/conserva.*texto/i);expect(visible).toMatch(/cr[eé]ditos/);expect(visible).toMatch(/d[oó]nde|ubicaci[oó]n/);expect(visible).not.toMatch(/recursos literarios|resoluci[oó]n del conflicto/);break
   case'F02':expect(visible).toMatch(/qu[eé].*ocurri[oó].*qui[eé]nes.*afecta.*c[oó]mo.*sucedi[oó]/);expect(visible).toMatch(/dos datos/);expect(visible).toMatch(/respuesta.*o.*informaci[oó]n.*insuficiente/);expect(scored).not.toMatch(/d[oó]nde|cu[aá]ndo|dicci[oó]n|entonaci[oó]n|modalidad.*lectura/);break
  }
  expect(p.criteria.length).toBeLessThanOrEqual(20);expect(p.totalScoreUnits).toBe(1735)
  expect(scored).not.toMatch(/autonom[ií]a|apoyo frecuente|acompa[nñ]amiento paso a paso/)
 })
})
