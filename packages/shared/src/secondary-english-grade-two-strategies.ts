import {englishGradeOneStrategies,requestedEnglishStrategies,englishStrategyCriteria,type Strategy} from './secondary-english-grade-one-strategies'
/** PDF141–142 repeats these observable procedures. The malformed comprehension
 * line is recorded as ambiguous, rather than inheriting first grade's substitute.
 */
export const englishGradeTwoStrategies:Strategy[]=[
 ...englishGradeOneStrategies.filter(f=>f.id!=='understanding').map(f=>{
  if(f.id==='communicative-purpose')return {...f,match:'(?:establec\\w*|defin\\w*) (?:la |el )?(?:intencion comunicativa|proposito (?:comunicativo|del mensaje))'}
  if(f.id==='revision')return {...f,match:'revis\\w* (?:el |un )?(?:borrador|mensaje|texto|sentido)|revis\\w* (?:el )?(?:significado|sentido|correccion)(?: y (?:la )?correccion)? (?:del |de un )?(?:mensaje|texto|borrador)|correg\\w* problemas'}
  if(f.id==='practice')return {...f,match:'oportunidad(?:es)? de uso|oportunidad(?:es)? de practica'}
  if(f.id==='dictionary')return {...f,match:'consult\\w* (?:el |un )?diccionario|busqu\\w*.*diccionario|herramientas de consulta'}
  return f
 }),
 {id:'social-formulas',match:'formulas cotidianas de interaccion social',modes:['writing','oral','interaction'],title:'Fórmulas del intercambio cotidiano',levels:[
  'Utiliza en inglés fórmulas de interacción pertinentes para iniciar, mantener o cerrar el intercambio según la situación solicitada.',
  'Las fórmulas permiten reconocer la intención del intercambio; una expresión necesita ajuste.',
  'Emplea fórmulas aisladas, pero no las relaciona con la situación de interacción indicada.',
  'La fórmula comunica una intención contraria a la intervención que debía realizar.',
  'No se reconoce una fórmula pertinente para la interacción solicitada.',
 ]},
]
export function requestedGradeTwoStrategies(text:string,mode?:string){
 const resolvedMode=mode==='analysis'||mode==='comparison'?'reading':mode
 const rows=requestedEnglishStrategies(text,resolvedMode,englishGradeTwoStrategies)
 return rows.some(f=>f.id==='cultural-comparison')?rows.filter(f=>!['nonverbal-reception','nonverbal-production'].includes(f.id)):rows
}
export function gradeTwoStrategyCriteria(text:string,mode:string){
 const selected=requestedGradeTwoStrategies(text,mode)
 const rows=englishStrategyCriteria(text,['analysis','comparison'].includes(mode)?'reading':mode,'ing-2',selected)
 return rows.map(row=>{
  if(!row.templateId.endsWith('cultural-comparison'))return row
  const aspects=[['gestos','los gestos que expresan estados anímicos o físicos'],['situaciones problematicas|problemas.*jovenes','las situaciones problemáticas que afectan a los jóvenes'],['compras','las compras'],['celebraciones','las celebraciones'],['actividades de tiempo libre','las actividades de tiempo libre'],['puntualidad','la puntualidad'],['lugares de interes','los lugares de interés']].filter(([match])=>new RegExp(match).test(text)).map(([,label])=>label)
  if(!aspects.length)return row
  const target=aspects.length<2?aspects[0]:aspects.slice(0,-1).join(', ')+' y '+aspects.at(-1)
  const levels=row.progressionLevels!.map(level=>level.replace(/los aspectos solicitados|las celebraciones|la puntualidad/g,target)) as NonNullable<typeof row.progressionLevels>
  return {...row,observable:levels[0],progressionLevels:levels}
 })
}
