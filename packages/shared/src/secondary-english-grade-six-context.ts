import type {UpperEnglishEvidence} from './secondary-english-upper-task'
import {gradeFiveContextCriteria} from './secondary-english-grade-five-context'
import {withoutGradeSixLexicalTargets} from './secondary-english-grade-six-lexicon'
import {upperEnglishRow} from './secondary-english-upper-communication'
const row=(id:string,title:string,levels:Parameters<typeof upperEnglishRow>[3])=>upperEnglishRow('ing-6',`context-${id}`,title,levels,3)
/** Source169/174: observable communication in provided cases. No assessment of
 * private identity, flexibility as personality, employment eligibility or life choices. */
export function gradeSixContextCriteria(task:UpperEnglishEvidence,existing:ReturnType<typeof row>[]){
 const text=withoutGradeSixLexicalTargets(task.contextText),receptive=['reading','listening','analysis','comparison','research'].includes(task.mode)
 const shared=new Set(['ethical-ict','faithful-information','respect-differences','care','critical-information','problem-information','problem-description','problem-solution','research','source-information','inference','team-contribution','agreed-norms','plans','wishes','wishes-or-plans','plans-or-wishes','care-choice'])
 const rows=gradeFiveContextCriteria({...task,text,contextText:text,requirementText:text},existing.map(c=>({...c,templateId:c.templateId.replace('ing-6-','ing-5-')}))).filter(c=>shared.has(c.templateId.replace(/^ing-5-(?:context-)?/,''))).map(c=>({...c,templateId:c.templateId.replace('ing-5-','ing-6-')}))
 if(!receptive&&/\b(?:adaptad\w*|adaptando|adaptar(?:an)?|adapten)\b/.test(text)&&/\bmensaje\b/.test(text)&&/\b(?:cambios?|nuev\w*)\b/.test(text))rows.push(row('adapted-message','Mensaje ajustado a las condiciones nuevas proporcionadas',[
  'Ajusta en inglés el mensaje a las condiciones nuevas de la tarea, conservando la información pertinente y relacionándola con el destinatario o propósito indicado.',
  'El mensaje responde al cambio principal; una relación con la información que conserva necesita precisión.',
  'Modifica partes del mensaje, pero deja sin atender una condición nueva proporcionada.',
  'El ajuste cambia la información necesaria o responde a condiciones distintas de las indicadas.',
  'No se reconoce un mensaje ajustado a las condiciones nuevas de la tarea.',
 ]))
 if(/\b(?:juicios?|valoracion(?:es)?)\b/.test(text)&&/\b(?:injusticia|discriminacion|inequidad)\b/.test(text))rows.push(row('critical-judgment','Juicio relacionado con los hechos y perspectivas del caso',[
  receptive?'Relaciona en inglés la valoración del texto sobre el hecho de injusticia, discriminación o inequidad con los datos y perspectivas disponibles del caso proporcionado.':'Expresa en inglés un juicio sobre el hecho de injusticia, discriminación o inequidad del caso proporcionado, relacionando su valoración con los datos y perspectivas disponibles.',
  'La valoración se relaciona con los hechos principales; una relación con los datos necesita precisión.',
  'Menciona una valoración general sin aclarar cómo se relaciona con los hechos del caso.',
  'La valoración atribuye a los personajes hechos incompatibles con la información proporcionada.',
  'No se reconoce un juicio relacionado con los hechos y perspectivas del caso.',
 ]))
 if(/\b(?:vocabulario tecnico|terminos tecnicos)\b/.test(text)&&/\b(?:ciencia|cientific\w*|tecnologia|tecnologic\w*)\b/.test(text))rows.push(row('technical-language','Términos técnicos relacionados con la información de la fuente',[
  `${receptive?'Identifica en el mensaje en inglés':'Emplea en el mensaje en inglés'} los términos técnicos solicitados con el significado que les corresponde en la información proporcionada, conservando sus referentes y relaciones.`,
  'Los términos principales conservan su significado en la fuente; una referencia necesita precisión.',
  'Reconoce o emplea términos aislados, pero deja sin relacionar parte de sus significados con la información.',
  'Atribuye a los términos un significado incompatible con la fuente o cambia sus referentes.',
  'No se reconocen términos pertinentes relacionados con el significado indicado en la información proporcionada.',
 ]))
 const health=/\b(?:salud|saludables?)\b/.test(text),environment=/\b(?:medioambiente|medio ambiente|recursos naturales)\b/.test(text)
 if((health||environment)&&/\b(?:cuidado|cuidar\w*|cuiden|prevencion|prevenir\w*|proteccion|proteger\w*)\b/.test(text)&&/\b(?:razonamientos?|justific\w*|explicacion(?:es)?)\b/.test(text)&&!existing.some(c=>c.templateId==='ing-6-strategy-cultural-comparison')){
  const target=[health?'la salud':'',environment?'el medioambiente':''].filter(Boolean).join(' y ')
  rows.push(row('care-reasons','Razones relacionadas con los efectos de cuidado indicados',[
   `Relaciona en inglés las acciones o puntos de vista comunicados con sus efectos indicados para el cuidado de ${target}, utilizando los datos de los ejemplos proporcionados.`,
   'Las razones se relacionan con los efectos principales; una referencia a los ejemplos necesita precisión.',
   'Menciona acciones o efectos aislados sin aclarar varias relaciones necesarias para sustentar el cuidado indicado.',
   'Las razones contradicen los efectos proporcionados o atribuyen a la situación consecuencias que no aparecen en los ejemplos.',
   'No se reconocen razones relacionadas con los efectos de cuidado indicados en la tarea.',
  ]))
 }
 if(!receptive&&/\bproyecto (?:personal )?de vida\b/.test(text)){
  const target=[/metas|objetivos/.test(text)?'las metas':'',/acciones|pasos/.test(text)?'las acciones':''].filter(Boolean).join(' y ')||'la información solicitada'
  rows.push(row('life-project','Información comunicada del proyecto de vida del referente',[
   `Comunica en inglés el proyecto de vida del referente indicado, relacionando ${target} con los datos proporcionados para la tarea.`,
   'El proyecto se comprende; una relación entre la información y los datos necesita precisión.',
   'Menciona información aislada sin establecer las relaciones solicitadas del proyecto.',
   'Cambia el referente o atribuye al proyecto información incompatible con los datos proporcionados.',
   'No se reconoce información del proyecto relacionada con el referente y los datos indicados.',
  ]))
 }
 return rows
}
