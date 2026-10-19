import type {UpperEnglishEvidence} from './secondary-english-upper-task'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
export const upperEnglishRow=(scope:string,id:string,title:string,levels:NonNullable<ContextualTopicCriterion['progressionLevels']>,weight=4):ContextualTopicCriterion=>({templateId:`${scope}-${id}`,title,observable:levels[0],progressionLevels:levels,weight})
/** Communicative performance only; grade-owned content must already exist. */
export function upperEnglishCommunication(task:UpperEnglishEvidence,scope:string){
 const {mode,requirementText:text}=task,rows:ContextualTopicCriterion[]=[]
 if(mode==='interaction'||mode==='writing'&&/\b(?:responder\w*|respuesta|intercambi\w*)\b/.test(text))rows.push(upperEnglishRow(scope,'interaction','Respuesta que sostiene el intercambio',[
  'Relaciona su respuesta en inglés con lo comunicado por el interlocutor y aporta información pertinente que permite continuar el intercambio solicitado.',
  'La respuesta permite continuar el intercambio; una referencia necesita aclaración.',
  'Responde a parte de la intervención y deja información necesaria sin relacionar.',
  'Responde a otro asunto y cambia el sentido de la intervención del interlocutor.',
  'No aporta una respuesta pertinente reconocible para continuar el intercambio.',
 ],3))
 const preparationOnly=/\b(?:planific\w*|ensay\w*)\b/.test(text)&&!/\b(?:present(?:ar|aran|an|en)|expon\w*|comunic\w*|escrib\w*|redact\w*)\b/.test(text)
 const messageRequested=/\b(?:mensaje|texto|parrafo|discurso)\b/.test(text)
 const standalone=!messageRequested&&(/\b(?:oraciones|frases|enunciados) independientes\b/.test(text)||mode==='writing'&&/\bpreguntas?\b/.test(text))
 if(!['oral','interaction','writing'].includes(mode)||preparationOnly||standalone)return rows
 rows.push(mode==='writing'?upperEnglishRow(scope,'written','Texto escrito estructurado y comprensible',[
  'Organiza en inglés las ideas del texto con una estructura y relaciones que permiten seguir la información y el propósito solicitados; los errores aislados no impiden comprenderlo.',
  'El texto se comprende; una relación entre ideas necesita revisión.',
  'Comunica ideas aisladas sin establecer varias relaciones necesarias para seguir el texto.',
  'La organización o las expresiones cambian el sentido del texto solicitado.',
  'No se reconoce un texto escrito relacionado con el propósito de la tarea.',
 ],3):upperEnglishRow(scope,'intelligibility','Discurso oral sostenido y comprensible',[
  'Comunica en inglés un discurso sencillo y sostenido que enlaza las ideas para seguir el mensaje solicitado; las pausas y reformulaciones no impiden comprenderlo.',
  'Las ideas principales se comprenden; una relación o expresión necesita aclaración.',
  'Se comprenden expresiones aisladas, pero varias relaciones necesarias para seguir el discurso quedan ambiguas.',
  'La organización o las expresiones cambian el sentido del mensaje comunicado.',
  'No se reconoce un mensaje oral relacionado con el propósito solicitado con los apoyos acordados.',
 ],3))
 return rows
}
