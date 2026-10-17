import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {UpperEnglishEvidence} from './secondary-english-upper-task'
import {gradeThreeContextCriteria} from './secondary-english-grade-three-context'
import {withoutGradeFourLexicalTargets} from './secondary-english-grade-four-lexicon'
import {gradeFourStrategyCriteria} from './secondary-english-grade-four-strategies'
const row=(id:string,title:string,levels:NonNullable<ContextualTopicCriterion['progressionLevels']>):ContextualTopicCriterion=>({templateId:`ing-4-context-${id}`,title,observable:levels[0],progressionLevels:levels,weight:3})
/** PDF158–162. Conditions apply to the requested communication and provided
 * characters/data. Internal feelings, private habits and personal honesty are not scored. */
export function gradeFourContextCriteria(task:UpperEnglishEvidence,existing:ContextualTopicCriterion[]){
 const text=withoutGradeFourLexicalTargets(task.contextText),receptive=['reading','listening','analysis','comparison','research'].includes(task.mode)
 const shared=new Set(['respect-differences','empathetic-response','faithful-information','care','social-contribution','critical-information','problem-information'])
 const observableText=text.replace(/\b(?:respuesta solidaria|con solidaridad)\b/g,'respuesta empatica')
 let rows=gradeThreeContextCriteria(observableText,receptive).filter(c=>shared.has(c.templateId.replace('ing-3-context-',''))).map(c=>({...c,templateId:c.templateId.replace('ing-3-','ing-4-')}))
 if(existing.some(c=>c.templateId==='ing-4-strategy-cultural-comparison'))rows=rows.filter(c=>c.templateId!=='ing-4-context-respect-differences')
 if(existing.some(c=>c.templateId==='ing-4-problem-causes'))rows=rows.filter(c=>c.templateId!=='ing-4-context-problem-information')
 const existingIds=new Set(existing.map(c=>c.templateId))
 rows.push(...gradeFourStrategyCriteria(text,task.mode).filter(c=>c.templateId==='ing-4-strategy-courtesy'&&!existingIds.has(c.templateId)))
 const virtual=/\b(?:tic|chat|virtual|redes sociales)\b/.test(text)
 if(!receptive&&virtual&&/\b(?:normas eticas|privacidad|normas del chat|normas del intercambio)\b/.test(text)){
  const conditions=[/normas/.test(text)?'las normas proporcionadas para el intercambio':'',/privacidad/.test(text)?'la privacidad de la información utilizada':''].filter(Boolean).join(' y ')
  rows.push(row('ethical-ict','Mensaje compatible con las condiciones del intercambio virtual',[
   `Comunica en inglés el mensaje virtual solicitado de acuerdo con ${conditions}, utilizando los datos de la tarea.`,
   'El mensaje respeta las condiciones principales; una referencia a los datos necesita ajuste.',
   'El mensaje se reconoce, pero deja sin atender una condición proporcionada para el intercambio.',
   'El mensaje comunica datos o expresiones incompatibles con las condiciones indicadas.',
   'No aporta un mensaje virtual reconocible relacionado con las condiciones de la tarea.',
  ]))
 }
 if(!receptive&&virtual&&/\b(?:tiempo|duracion|turnos?)\b/.test(text)&&/\b(?:acordad\w*|proporcionad\w*|indicad\w*)\b/.test(text)){
  const target=[/tiempo|duracion/.test(text)?'el tiempo':'',/turnos?/.test(text)?'los turnos':''].filter(Boolean).join(' y ')
  rows.push(row('agreed-time','Intervención ajustada al acuerdo de la tarea',[
   `Ajusta su intervención en inglés a ${target} acordados para el intercambio virtual, conservando la información solicitada.`,
   'La intervención respeta el acuerdo principal; una relación con lo comunicado necesita ajuste.',
   'Comunica parte de la información, pero deja sin atender una condición del acuerdo de la tarea.',
   'La intervención contradice las condiciones temporales o de participación proporcionadas.',
   'No aporta una intervención reconocible relacionada con el acuerdo de la tarea.',
  ]))
 }
 const problem=/\bproblemas?\b|\bsituacion(?:es)? problematica(?:s)?\b/.test(text)
 if(!receptive&&problem&&/\b(?:describ\w*|descripcion)\b/.test(text)&&!existingIds.has('ing-4-problem-causes'))rows.push(row('problem-description','Detalles del problema comunicado',[
  'Describe en inglés el problema del personaje o situación proporcionados, relacionando los detalles solicitados para que se comprenda qué sucede.',
  'El problema y los detalles principales se comprenden; una referencia necesita precisión.',
  'Menciona detalles aislados sin establecer claramente qué problema se presenta.',
  'Cambia el problema o atribuye a la situación detalles incompatibles con los proporcionados.',
  'No se reconoce una descripción relacionada con el problema y los detalles solicitados.',
 ]))
 if(!receptive&&problem&&/\b(?:solucion(?:es)?|solucionar\w*|resolver\w*|resolv\w*|propuestas?)\b/.test(text)&&!rows.some(c=>c.templateId==='ing-4-context-social-contribution'))rows.push(row('problem-solution','Propuesta relacionada con el problema y sus datos',[
  'Comunica en inglés una propuesta de solución relacionada con el problema y con los datos proporcionados, permitiendo reconocer cómo responde a la situación.',
  'La propuesta responde al problema principal; una relación con los datos necesita precisión.',
  'Propone una acción aislada sin aclarar cómo responde al problema indicado.',
  'La solución cambia el problema o contradice las condiciones proporcionadas para la situación.',
  'No se reconoce una propuesta de solución relacionada con el problema de la tarea.',
 ]))
 if(/\binfer(?:ir\w*|iran)\b(?! (?:el )?significado)|\b(?:haran|formular\w*|elabor\w*|present\w*|escrib\w*|comunic\w*|realiz\w*) (?:una |las |sus )?inferencias?\b/.test(text)&&!/\binfer\w* (?:el )?significado\b/.test(text))rows.push(row('inference','Conclusión relacionada con las pistas de la situación',[
  'Relaciona en inglés las pistas de la situación proporcionada con su conclusión sobre lo ocurrido, distinguiendo lo inferido de lo expresamente comunicado.',
  'La conclusión se apoya en las pistas principales; una relación con los datos necesita precisión.',
  'Menciona pistas y una conclusión sin aclarar cómo se relacionan.',
  'La conclusión contradice las pistas o atribuye a la situación información que no proporciona.',
  'No aporta una conclusión reconocible relacionada con las pistas disponibles.',
 ]))
 const scientific=/\b(?:ciencia|cientific\w*|tecnologia|tecnologic\w*)\b/.test(text)
 if(scientific&&/\b(?:valid\w*|confiable\w*|fiable\w*|contrast\w*|verific\w*)\b/.test(text)&&/\bfuentes?\b/.test(text))rows.push(row('source-information','Información científica relacionada con las fuentes de la tarea',[
  'Relaciona los datos científicos o tecnológicos comunicados en inglés con las fuentes proporcionadas o consultadas, distinguiendo la información sustentada de una atribución que la fuente no confirma.',
  'La información se corresponde con las fuentes principales; una atribución de los datos necesita precisión.',
  'Comunica datos de las fuentes, pero deja sin relacionar parte de la información con su sustento.',
  'Atribuye a las fuentes información incompatible con los datos disponibles o presenta como confirmado lo que no sustentan.',
  'No aporta información reconocible relacionada con las fuentes de la tarea.',
 ]))
 if(scientific&&/\b(?:investig(?:ar(?:an)?|an|uen|ando)|localiz\w*|busc\w*)\b/.test(text)&&!/\b(?:vocabulario|lexico|expresiones)\b/.test(text)){
  const target=[/ciencia|cientific/.test(text)?'la ciencia':'',/tecnologia|tecnologic/.test(text)?'la tecnología':''].filter(Boolean).join(' y ')
  const organize=/organiz\w*|sistematiz\w*/.test(text)
  const c=row('research','Información localizada y organizada según la búsqueda',[
   `${organize?'Localiza y organiza':'Localiza'} información sobre ${target} en ${/proporcionad\w*|suministrad\w*/.test(text)?'los textos en inglés proporcionados':'las fuentes en inglés consultadas'}, relacionando los datos con la pregunta o finalidad de la tarea.`,
   'La información responde a la búsqueda principal; una relación entre los datos necesita precisión.',
   'Recupera datos aislados sin establecer las relaciones necesarias para responder a la búsqueda.',
   'Atribuye a lo consultado datos incompatibles con la información disponible o con la pregunta de la tarea.',
   'No aporta información reconocible relacionada con lo consultado y la búsqueda solicitada.',
  ]);rows.push({...c,templateId:'ing-4-research'})
 }
 if(/\briesgos?\b/.test(text)&&/\b(?:salud|medioambiente|medio ambiente)\b/.test(text)){
  const care=/\b(?:orientaciones|indicaciones|informacion|acciones|medidas)\b/.test(text)&&/\b(?:cuid\w*|preven\w*|proteg\w*)\b/.test(text)
  rows=rows.filter(c=>c.templateId!=='ing-4-context-care')
  rows.push(row('risk-care','Riesgo y relación con la situación proporcionada',[
   `${receptive?'Identifica en el mensaje en inglés':'Describe en inglés'} el riesgo para ${/salud/.test(text)&&/medioambiente|medio ambiente/.test(text)?'la salud y el medioambiente':/salud/.test(text)?'la salud':'el medioambiente'} de la situación proporcionada${care?' y lo relaciona con las orientaciones de cuidado solicitadas':''}.`,
   'El riesgo y su relación con la situación se comprenden; una referencia necesita precisión.',
   'Menciona información aislada sin aclarar el riesgo de la situación indicada.',
   'Cambia el riesgo o lo relaciona con datos incompatibles con la situación proporcionada.',
   'No se reconoce información pertinente sobre el riesgo de la situación indicada.',
  ]))
 }
 return rows
}
