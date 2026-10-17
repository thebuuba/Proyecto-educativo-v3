import {englishGradeFiveStrategies} from './secondary-english-grade-five-strategies'
import {englishStrategyCriteria,type Strategy} from './secondary-english-grade-one-strategies'
import {withoutGradeSixLexicalTargets} from './secondary-english-grade-six-lexicon'
/** PDF170–171. Sixth does not list attentive listening as its own procedure;
 * comprehension is what is understood. Cultural aspects are authored below. */
export const englishGradeSixStrategies:Strategy[]=englishGradeFiveStrategies.filter(f=>f.id!=='listening').map(f=>f.id==='understanding'?{...f,title:'Indicación de lo comprendido',levels:[
 'Comunica en inglés lo que ha comprendido del mensaje, relacionando su respuesta con la información disponible.',
 'Indica lo principal comprendido; una referencia a la información necesita precisión.',
 'Comunica una respuesta general que deja sin precisar parte de lo comprendido del mensaje.',
 'La respuesta atribuye al mensaje información que cambia su sentido.',
 'No aporta una indicación reconocible de lo comprendido del mensaje.',
]}:f)
export function gradeSixStrategyCriteria(raw:string,mode:string){
 const text=withoutGradeSixLexicalTargets(raw),resolved=['analysis','comparison','research'].includes(mode)?'reading':mode
 return englishStrategyCriteria(text,resolved,'ing-6',englishGradeSixStrategies).map(c=>{
  let levels=c.progressionLevels!,title=c.title
  if(c.templateId.endsWith('help')&&/ayuda y repeticion|repeticion y ayuda/.test(text))levels=levels.map(l=>l.replace('la ayuda o repetición pertinente','la ayuda y repetición pertinentes')) as Strategy['levels']
  if(c.templateId.endsWith('main-secondary')){
   const main=/ideas? principal(?:es)?/.test(text),secondary=/ideas? secundarias?/.test(text)
   const target=main&&secondary?'las ideas principales y secundarias solicitadas':main?'las ideas principales solicitadas':'las ideas secundarias solicitadas'
   levels=levels.map(l=>l.replace('{target}',target)) as Strategy['levels'];title=main&&secondary?'Ideas principales y secundarias del texto':main?'Ideas principales del texto':'Ideas secundarias del texto'
  }
  if(c.templateId.endsWith('compensation')){
   const synonyms=/sinonimos/.test(text),placeholders=/comodines/.test(text)
   const target=synonyms&&placeholders?'los sinónimos y comodines solicitados':synonyms?'el sinónimo solicitado':placeholders?'el comodín solicitado':'la expresión compensatoria solicitada'
   levels=levels.map(l=>l.replace('{target}',target)) as Strategy['levels']
  }
  if(c.templateId.endsWith('cultural-comparison')){
   const aspects=[['costumbres','las costumbres de los ejemplos'],['tradiciones','las tradiciones de los ejemplos'],['creencias','las creencias de los ejemplos'],['valores','los valores de los ejemplos'],['manifestaciones artisticas','las manifestaciones artísticas de los ejemplos'],['situaciones problematicas|problemas.*jovenes','las situaciones problemáticas de los jóvenes de los ejemplos'],['medioambiente|medio ambiente','el cuidado del medioambiente de los ejemplos']].filter(([pattern])=>new RegExp(pattern).test(text)).map(([,label])=>label)
   if(aspects.length)levels=levels.map(l=>l.replace('los aspectos solicitados',aspects.join(' y '))) as Strategy['levels']
  }
  return {...c,title,observable:levels[0],progressionLevels:levels}
 })
}
