import {englishGradeThreeStrategies} from './secondary-english-grade-three-strategies'
import {englishStrategyCriteria,type Strategy} from './secondary-english-grade-one-strategies'
import {withoutGradeFourLexicalTargets} from './secondary-english-grade-four-lexicon'
export const englishGradeFourStrategies:Strategy[]=[
 ...englishGradeThreeStrategies.filter(f=>!['cultural-comparison','social-formulas'].includes(f.id)).map(f=>{
  if(f.id==='help')return {...f,match:'(?:solicit\\w*|ped\\w*|pidan) (?:una )?repeticion',title:'Solicitud de repetición',levels:f.levels.map(l=>l.replace('la ayuda o repetición pertinente','la repetición pertinente')) as Strategy['levels']}
  if(f.id==='planning')return {...f,title:'Planificación del mensaje',match:'planific\\w*(?: (?:el|un|su|en|ingles|por|escrito)){0,4} (?:mensaje|discurso|texto|presentacion)|organiz\\w* (?:las |sus )?ideas',modes:['oral','interaction','writing']}
  return f
 }),
 {id:'new-combinations',match:'ensay\\w*.*nuevas (?:combinaciones|expresiones)',modes:['oral','interaction'],title:'Ensayo de nuevas combinaciones',levels:[
  'Ensaya en inglés nuevas combinaciones de expresiones que conservan el sentido del mensaje y permiten comunicarlo en la situación indicada.',
  'Las nuevas combinaciones comunican lo principal; una relación entre expresiones necesita ajuste.',
  'Ensaya expresiones aisladas sin establecer las relaciones necesarias para comunicar el mensaje.',
  'Las nuevas combinaciones cambian el sentido de las ideas que debía comunicar.',
  'No aporta una combinación reconocible relacionada con el ensayo solicitado.',
 ]},
 {id:'feedback',match:'(?:solicit\\w*|ped\\w*|pidan).*retroalimentacion',modes:['oral','interaction'],title:'Solicitud de retroalimentación pertinente',levels:[
  'Solicita en inglés retroalimentación sobre una parte del mensaje, permitiendo reconocer qué necesita comprobar o mejorar en el ensayo.',
  'La solicitud permite localizar lo principal; una referencia al aspecto consultado necesita precisión.',
  'Solicita una valoración general sin precisar qué parte necesita comprobar.',
  'La solicitud se refiere a otro asunto y no permite revisar el aspecto del ensayo indicado.',
  'No aporta una solicitud reconocible de retroalimentación sobre el mensaje ensayado.',
 ]},
 {id:'main-details',match:'ideas? principal(?:es)?|detalles especificos',modes:['reading','listening'],title:'Idea principal y detalles del texto',levels:[
  'Identifica {target} del texto en inglés y los relaciona con la información disponible.',
  'Reconoce {target}; una relación con el texto necesita precisión.',
  'Recupera información aislada, pero deja sin relacionar parte de {target}.',
  'Atribuye al texto información que cambia {target}.',
  'No aporta información reconocible que permita identificar {target} del texto.',
 ]},
 {id:'courtesy',match:'normas de cortesia|(?:con|usando|utilizando|aplicando) cortesia|con respeto|sin descalificaciones|asertiv\\w*|con tacto',modes:['writing','oral','interaction'],title:'Cortesía en la intención comunicativa',levels:[
  'Comunica en inglés la intención solicitada con fórmulas de cortesía pertinentes para la situación, sin descalificar al interlocutor.',
  'La intención se comprende y el trato es cortés; una fórmula necesita ajuste a la situación.',
  'La intención se reconoce, pero una expresión necesita reformulación para comunicarla con cortesía.',
  'La expresión descalifica al interlocutor o comunica una intención contraria a la solicitada.',
  'No se reconoce una expresión de la intención comunicativa solicitada.',
 ]},
 {id:'neutral-register',match:'registro neutro|neutral register',modes:['writing','oral','interaction'],title:'Registro neutro acorde con la situación',levels:[
  'Emplea en inglés un registro neutro acorde con la función, el destinatario y la situación de comunicación proporcionados.',
  'El registro corresponde a la situación principal; una fórmula necesita ajuste.',
  'El mensaje se reconoce, pero varias expresiones mezclan tratamientos que no corresponden a la situación.',
  'El registro atribuye al interlocutor un trato incompatible con la situación proporcionada.',
  'No se reconoce un mensaje pertinente que permita valorar el registro solicitado.',
 ]},
 englishGradeThreeStrategies.find(f=>f.id==='cultural-comparison')!,
]
export function requestedGradeFourStrategies(text:string,mode?:string){
 const task=withoutGradeFourLexicalTargets(text),resolved=mode&&['analysis','comparison','research'].includes(mode)?'reading':mode
 const selected=englishGradeFourStrategies.filter(f=>(!resolved||f.modes.includes(resolved))&&new RegExp(`\\b(?:${f.match})\\b`).test(task))
 return selected.some(f=>f.id==='new-combinations')&&!/palabras|entonacion/.test(task)?selected.filter(f=>f.id!=='rehearsal'):selected
}
export function gradeFourStrategyCriteria(text:string,mode:string){
 const intent=withoutGradeFourLexicalTargets(text),selected=requestedGradeFourStrategies(text,mode)
 return englishStrategyCriteria(intent,['analysis','comparison','research'].includes(mode)?'reading':mode,'ing-4',selected).map(row=>{
  let levels=row.progressionLevels!,title=row.title
  if(row.templateId.endsWith('main-details')){
   const main=/ideas? principal(?:es)?/.test(intent),details=/detalles especificos/.test(intent)
   const target=main&&details?'la idea principal y los detalles específicos solicitados':main?'la idea principal':'los detalles específicos solicitados'
   title=main&&details?'Idea principal y detalles del texto':main?'Idea principal del texto':'Detalles específicos del texto'
   levels=levels.map(l=>l.replace('{target}',target)) as Strategy['levels']
  }
  if(row.templateId.endsWith('cultural-comparison')){
   const aspects=[['medios de comunicacion','los medios de comunicación'],['valores','los valores de los ejemplos proporcionados'],['tradiciones','las tradiciones de los ejemplos proporcionados'],['creencias','las creencias de los ejemplos proporcionados'],['normas de cortesia','las normas de cortesía'],['actividades de tiempo libre','las actividades de tiempo libre'],['atractivos turisticos','los atractivos turísticos'],['situaciones problematicas|problemas.*jovenes','las situaciones problemáticas de los jóvenes de los ejemplos'],['medioambiente|medio ambiente','el cuidado del medioambiente']].filter(([pattern])=>new RegExp(pattern).test(intent)).map(([,label])=>label)
   if(aspects.length)levels=levels.map(l=>l.replace('los aspectos solicitados',aspects.join(' y '))) as Strategy['levels']
  }
  return {...row,title,observable:levels[0],progressionLevels:levels}
 })
}
