import {gradeTwoContextCriteria} from './secondary-english-grade-two-context'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
const row=(id:string,title:string,levels:NonNullable<ContextualTopicCriterion['progressionLevels']>):ContextualTopicCriterion=>({templateId:`ing-3-context-${id}`,title,observable:levels[0],progressionLevels:levels,weight:3})
/** PDF146/151. These five observable conditions have the same meaning as in
 * second; purchase choices and private schedules are not inherited. */
export function gradeThreeContextCriteria(text:string,receptive=false){
 const shared=new Set(['courtesy','respect-differences','empathetic-response','faithful-information','care'])
 const rows=gradeTwoContextCriteria(text,receptive).filter(c=>shared.has(c.templateId.replace('ing-2-context-',''))).map(c=>({...c,templateId:c.templateId.replace('ing-2-','ing-3-')}))
 for(const c of rows)if(c.templateId==='ing-3-context-respect-differences'){
  c.title='Información de los ejemplos sin estereotipos'
  c.progressionLevels=[
   'Comunica en inglés la información de los personajes o ejemplos proporcionados sin atribuir a todas las personas características de un caso particular.',
   'La información se comprende sin descalificaciones; una referencia al ejemplo necesita precisión.',
   'Describe el caso, pero una generalización no se sustenta en la información proporcionada.',
   'Descalifica a un grupo o atribuye a todas las personas características no sustentadas por los ejemplos.',
   'No aporta un mensaje reconocible relacionado con la información de los personajes o ejemplos solicitados.',
  ];c.observable=c.progressionLevels[0]
 }
 if(!receptive&&/\b(?:normas|reglas) (?:del intercambio|de (?:la )?comunicacion)\b/.test(text)&&/\b(?:proporcionad\w*|acordad\w*)\b/.test(text))rows.push(row('agreed-norms','Intervención compatible con las normas dadas',[
  'Comunica en inglés su intervención de acuerdo con las normas proporcionadas para el intercambio, permitiendo reconocer el mensaje y la participación de los interlocutores.',
  'El mensaje cumple las normas principales; una referencia de la intervención necesita ajuste.',
  'La intervención comunica parte del mensaje, pero una condición del intercambio queda sin atender.',
  'La intervención contradice una norma proporcionada y cambia las condiciones del intercambio.',
  'No aporta una intervención reconocible relacionada con las normas y el mensaje solicitados.',
 ]))
 if(!receptive&&/\b(?:problema comunitario|problematicas? sociales?|problemas? sociales?)\b/.test(text)&&/\b(?:aport\w*|contribu\w*)\b/.test(text))rows.push(row('social-contribution','Aporte comunicativo ante el problema dado',[
  `Aporta en inglés una propuesta relacionada con el problema proporcionado y con ${/\bequipo\b/.test(text)?'la intervención del equipo':'los datos de la situación'}, permitiendo continuar la búsqueda comunicativa de una solución.`,
  `El aporte responde al problema principal; una relación con ${/\bequipo\b/.test(text)?'la intervención del equipo':'los datos de la situación'} necesita precisión.`,
  `Expresa una propuesta aislada sin relacionarla claramente con el problema y ${/\bequipo\b/.test(text)?'los aportes disponibles':'los datos proporcionados'}.`,
  'El aporte cambia el problema o contradice las condiciones proporcionadas para la situación.',
  'No aporta una propuesta comunicativa reconocible relacionada con el problema de la tarea.',
 ]))
 if(/\b(?:disting\w*|diferenci\w*|separ\w*)\b/.test(text)&&/\bhechos?\b/.test(text)&&/\b(?:inferencias?|posibilidades|predicciones?|opiniones?)\b/.test(text))rows.push(row('critical-information','Distinción entre información y conclusión',[
  'Distingue en inglés los hechos confirmados por la información proporcionada de las inferencias, opiniones o posibilidades solicitadas, relacionando cada conclusión con sus datos.',
  'Distingue los hechos y las conclusiones principales; una atribución a los datos necesita precisión.',
  'Menciona datos y conclusiones, pero deja sin aclarar cuáles están confirmados por la fuente.',
  'Presenta como hecho confirmado una conclusión incompatible con los datos o aún no confirmada.',
  'No aporta una distinción reconocible entre los hechos disponibles y las conclusiones solicitadas.',
 ]))
 if(receptive&&/\bproblema (?:cotidiano|de la situacion)\b/.test(text)&&/\b(?:identific\w*|localiz\w*|reconoc\w*)\b/.test(text))rows.push(row('problem-information','Datos del problema comunicado',[
  'Identifica en el mensaje en inglés el problema del personaje y relaciona los datos solicitados con la necesidad de solución planteada.',
  'Reconoce el problema y los datos principales; una relación con la necesidad planteada necesita precisión.',
  'Reconoce datos aislados, pero no establece claramente qué problema debe resolverse.',
  'Atribuye al personaje un problema o datos incompatibles con el mensaje proporcionado.',
  'No aporta información reconocible sobre el problema y los datos solicitados del mensaje.',
 ]))
 return rows
}
