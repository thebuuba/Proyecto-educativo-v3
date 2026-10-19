import type {UpperEnglishEvidence} from './secondary-english-upper-task'
import {sixthGradeEnglishContent} from './secondary-english-grade-six'
import {upperEnglishRow,upperEnglishCommunication} from './secondary-english-upper-communication'
const row=(id:string,title:string,levels:Parameters<typeof upperEnglishRow>[3])=>upperEnglishRow('ing-6',id,title,levels)
/** HLM6, PDF456–460: locating and systematizing reliable information are explicit
 * source outcomes. They apply only to the requested action and available data. */
export function sixthOptativeEnglishContent(task:UpperEnglishEvidence){
 const text=task.requirementText,rows=sixthGradeEnglishContent(task)
 const information=/\b(?:informacion|datos|textos?|fuentes?)\b/.test(text)
 const locate=/\b(?:localiz\w*|localic\w*|seleccion\w*|busc\w*|identifiqu\w*)\b.{0,100}\b(?:informacion|datos|detalles)\b/.test(text)&&/\b(?:pertinente\w*|apropiad\w*|preguntas?|proposito|finalidad)\b/.test(text)
 const systematize=information&&/\b(?:sistematiz\w*|sistematic\w*|clasific\w*|clasifiqu\w*|organiz\w*)\b/.test(text)
 const reliability=/\b(?:fiabilidad|confiabilidad|credibilidad)\b/.test(text)&&/\b(?:evalu\w*|valor\w*|contrast\w*|compar\w*|seleccion\w*)\b/.test(text)
 if(locate)rows.push(row('critical-location','Información pertinente para la búsqueda solicitada',[
  'Localiza y selecciona en los textos en inglés disponibles la información pertinente para responder a la pregunta o propósito indicado, relacionando los datos con sus referentes en la fuente.',
  'La selección responde a la búsqueda principal; una relación entre el dato y la pregunta necesita precisión.',
  'Recupera información aislada, pero omite datos necesarios o incluye información ajena a la búsqueda solicitada.',
  'Atribuye a la fuente datos incompatibles con lo comunicado o selecciona información que responde a otra pregunta.',
  'No se reconoce información de los textos relacionada con la búsqueda indicada.',
 ]))
 if(reliability){
  const features=[/\bautor(?:ia)?\b/.test(text)?'la autoría':'',/\bfecha\b|\bactualidad\b/.test(text)?'la fecha o actualidad':'',/\bevidencias?\b/.test(text)?'las evidencias':''].filter(Boolean)
  const target=features.length?features.join(', ')+' disponibles':'los rasgos y evidencias disponibles indicados en la tarea'
  rows.push(row('critical-reliability','Valoración de la fiabilidad sustentada en los rasgos disponibles',[
   `Valora en inglés la fiabilidad de las fuentes proporcionadas, relacionando su conclusión con ${target} y distinguiendo lo sustentado de lo que esa información no permite confirmar.`,
   'La valoración se apoya en los rasgos principales indicados; una relación con la conclusión necesita precisión.',
   'Nombra rasgos de la fuente, pero deja sin relacionar parte de su valoración con la información disponible.',
   'Atribuye a la fuente rasgos no proporcionados o presenta como confirmada una conclusión que los datos no sustentan.',
   'No se reconoce una valoración de fiabilidad relacionada con los rasgos disponibles de la fuente.',
  ]))
 }
 if(systematize)rows.push(row('critical-systematization','Información organizada según las relaciones solicitadas',[
  'Sistematiza la información de los textos en inglés según el propósito y los criterios indicados, conservando los datos, sus referentes y las relaciones necesarias para responder a la tarea.',
  'La organización conserva las relaciones principales solicitadas; una clasificación o referencia necesita precisión.',
  'Reúne datos aislados, pero deja sin organizar parte de la información o sus relaciones según el criterio indicado.',
  'La organización altera datos o relaciones de la fuente, o emplea criterios incompatibles con los solicitados.',
  'No se reconoce una organización de información relacionada con el propósito y los criterios indicados.',
 ]))
 const main=['reading','listening'].includes(task.mode)&&/\b(?:idea general|mensaje general)\b/.test(text)
 if(main)rows.push(row('message-main','Idea general relacionada con el mensaje',[
  `Identifica en inglés la idea general del ${task.mode==='listening'?'mensaje escuchado':'texto proporcionado'}, relacionándola con la información y el asunto comunicado.`,
  'La idea general se relaciona con el mensaje; una referencia al asunto necesita precisión.',
  'Recupera información aislada sin precisar la idea general del mensaje.',
  'Atribuye al mensaje una idea incompatible con los datos proporcionados.',
  'No se reconoce una idea general relacionada con el mensaje disponible.',
 ]))
 const risk=/\briesgos?\b/.test(text)&&/\b(?:salud|medioambiente|medio ambiente)\b/.test(text)
 if(risk){
  const prevention=/\b(?:prevencion|prevenir\w*|preven\w*)\b/.test(text),receptive=['reading','listening','analysis','comparison','research'].includes(task.mode)
  const target=[/\bsalud\b/.test(text)?'la salud':'',/\b(?:medioambiente|medio ambiente)\b/.test(text)?'el medioambiente':''].filter(Boolean).join(' y ')
  rows.push(row('critical-risk-prevention','Riesgo relacionado con los datos de la situación',[
   `${receptive?'Identifica en el texto en inglés':'Describe en inglés'} el riesgo para ${target} del caso proporcionado${prevention?' y lo relaciona con las medidas de prevención solicitadas según sus efectos indicados':''}, utilizando únicamente la información disponible de la situación.`,
   `El riesgo se relaciona con los datos${prevention?' y la prevención indicada':''}; una referencia necesita precisión.`,
   `Menciona información aislada, pero deja sin aclarar parte del riesgo${prevention?' o de su relación con las medidas indicadas':''}.`,
   'Atribuye a la situación riesgos o efectos incompatibles con los datos proporcionados.',
   `No se reconoce un riesgo relacionado con los datos${prevention?' y las medidas indicadas':''} del caso.`,
  ]))
 }
 // More specific evidence already includes the justification/search; avoid scoring it twice.
 const care=rows.some(r=>r.templateId==='ing-6-context-care-reasons'),specificReasoning=care||rows.some(r=>['ing-6-context-care-choice','ing-6-context-problem-solution'].includes(r.templateId))
 const result=rows.filter(r=>!(locate&&r.templateId==='ing-6-research')&&!(reliability&&['ing-6-context-source-information','ing-6-reasoning'].includes(r.templateId))&&!(specificReasoning&&r.templateId==='ing-6-reasoning')&&!(care&&r.templateId==='ing-6-context-care')&&!(main&&r.templateId==='ing-6-genre-message')&&!(risk&&['ing-6-context-care','ing-6-context-care-reasons','ing-6-explanations'].includes(r.templateId)))
 if(result.length&&!result.some(r=>/^ing-6-(?:written|intelligibility|interaction)$/.test(r.templateId)))result.push(...upperEnglishCommunication(task,'ing-6'))
 return result
}
