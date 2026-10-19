import {englishGradeFourStrategies} from './secondary-english-grade-four-strategies'
import {englishGradeThreeStrategies} from './secondary-english-grade-three-strategies'
import {englishStrategyCriteria,type Strategy} from './secondary-english-grade-one-strategies'
import {withoutGradeFiveLexicalTargets} from './secondary-english-grade-five-lexicon'
/** PDF164–165. Repeated procedures retain their meanings. Fifth excludes fourth's
 * feedback, new combinations, grapheme/phoneme and text-intention procedures. */
export const englishGradeFiveStrategies:Strategy[]=[
 ...englishGradeFourStrategies.filter(f=>!['help','new-combinations','feedback','grapheme-phoneme','text-intention','main-details'].includes(f.id)),
 englishGradeThreeStrategies.find(f=>f.id==='help')!,
 {id:'main-secondary',match:'ideas? principal(?:es)?|ideas? secundarias?',modes:['reading','listening'],title:'Ideas principales y secundarias del texto',levels:[
  'Identifica {target} del texto en inglés y relaciona la información según su papel en el asunto comunicado.',
  'Reconoce {target}; una relación con el asunto del texto necesita precisión.',
  'Recupera información aislada, pero confunde parte de {target} o deja sin relacionar su papel en el texto.',
  'Atribuye al texto otras ideas o invierte la relación entre la información central y la que la desarrolla.',
  'No aporta información reconocible que permita identificar {target} del texto.',
 ]},
 {id:'compensation',match:'estrategias compensatorias|sinonimos|comodines',modes:['writing'],title:'Expresión compensatoria que conserva el sentido',levels:[
  'Utiliza en el texto en inglés {target} que permite comunicar la idea buscada cuando falta una expresión, conservando su sentido en la situación indicada.',
  'La expresión compensatoria conserva la idea principal; una referencia necesita precisión.',
  'Sustituye una palabra o expresión, pero deja ambigua parte de la idea que debía comunicar.',
  'La expresión elegida cambia el sentido de la idea o atribuye al referente otra acción o característica.',
  'No se reconoce una expresión compensatoria relacionada con la idea solicitada.',
 ]},
]
export function gradeFiveStrategyCriteria(raw:string,mode:string){
 const text=withoutGradeFiveLexicalTargets(raw),resolved=['analysis','comparison','research'].includes(mode)?'reading':mode
 return englishStrategyCriteria(text,resolved,'ing-5',englishGradeFiveStrategies).map(c=>{
  let levels=c.progressionLevels!
  if(c.templateId.endsWith('help')&&/ayuda y repeticion|repeticion y ayuda/.test(text))levels=levels.map(l=>l.replace('la ayuda o repetición pertinente','la ayuda y repetición pertinentes')) as Strategy['levels']
  if(c.templateId.endsWith('cultural-comparison')){
   const aspects=[['habitos de consumo','los hábitos de consumo de los ejemplos'],['derechos','los derechos ciudadanos indicados'],['deberes','los deberes ciudadanos indicados'],['servicios de salud','los servicios de salud de los ejemplos'],['costumbres','las costumbres de los ejemplos'],['tradiciones','las tradiciones de los ejemplos']].filter(([pattern])=>new RegExp(pattern).test(text)).map(([,label])=>label)
   if(aspects.length)levels=levels.map(l=>l.replace('los aspectos solicitados',aspects.join(' y '))) as Strategy['levels']
  }
  return {...c,observable:levels[0],progressionLevels:levels}
 })
}
