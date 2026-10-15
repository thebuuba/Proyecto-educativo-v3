import {affirmativeLanguageTask} from './language-feature-criteria'
import {languageInstrumentIntent} from './language-instrument-intent'
import {withoutResources} from './evaluation-task-text'
import {normalizedTask} from './evaluation-task-text'
import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {requestedGradeTwoGrammar,gradeTwoGrammarCriterion} from './secondary-english-grade-two-grammar'
import {requestedGradeTwoLexicon,gradeTwoLexicalCriterion} from './secondary-english-grade-two-lexicon'
import {requestedGradeTwoStrategies,gradeTwoStrategyCriteria} from './secondary-english-grade-two-strategies'
import {requestedGradeTwoGenres,gradeTwoGenreCriteria} from './secondary-english-grade-two-genres'
import {gradeTwoContextCriteria} from './secondary-english-grade-two-context'
import {affirmativeScopedEnglishTask,commonEnglishGrade} from './secondary-english-task-text'

export const englishGradeTwoModule={id:'ingles-comunicacion-2',grade:2,subjectCode:'ING',pdfPages:[140,141,142,143,144,145],policy:'COMMON_CURRICULUM_FUNCTIONS_ALIASES_FORMS_PRODUCTS_COMPOSITION_V7'}
type Mode='reading'|'listening'|'interaction'|'oral'|'writing'|'audiovisual'|'analysis'|'comparison'|'research'
type FunctionId='conversation'|'daily'|'states'|'help'|'shopping'|'wishes'|'advice'|'plans'|'experience'
export type EnglishGradeTwoTask={grade:2;mode:Mode;functions:FunctionId[];text:string;requirementText?:string;contextText?:string;activityType:string;technique:string;actions?:EnglishGradeTwoTask[]}
const modes:Record<Mode,{activityType:string;technique:string}>={
 reading:{activityType:'READING_COMPREHENSION',technique:'analisis-producciones'},listening:{activityType:'LISTENING_COMPREHENSION',technique:'observacion-sistematica'},
 interaction:{activityType:'ORAL_INTERACTION',technique:'observacion-directa'},oral:{activityType:'ORAL_PRESENTATION',technique:'presentacion'},
 writing:{activityType:'WRITTEN_PRODUCTION',technique:'analisis-producciones'},audiovisual:{activityType:'AUDIOVISUAL_PRODUCTION',technique:'analisis-producciones'},
 analysis:{activityType:'ANALYSIS',technique:'analisis-producciones'},comparison:{activityType:'COMPARISON',technique:'analisis-producciones'},
 research:{activityType:'RESEARCH',technique:'analisis-producciones'},
}
export function commonSecondGradeEnglish(context?:InstrumentAcademicContext|null){
 return commonEnglishGrade(context,2)
}
export const affirmativeSecondGradeEnglishTask=affirmativeScopedEnglishTask
function single(description:string):EnglishGradeTwoTask|null{
 const text=affirmativeSecondGradeEnglishTask(description)
 const contextText=normalizedTask(withoutResources(description).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\bno (?:se )?(?:evalu\w*|calific\w*|exig\w*|requer\w*)\b[^.;]*/g,''))
 const grammar=requestedGradeTwoGrammar(text)
 const lexical=requestedGradeTwoLexicon(text)
 const strategic=requestedGradeTwoStrategies(text)
 const genres=requestedGradeTwoGenres(text)
 const context=gradeTwoContextCriteria(contextText)
 const features=grammar.length+lexical.length+strategic.length+genres.length+context.length
 const modeText=text.replace(/\b(?:para|a fin de) (?:leer|escuchar|escribir|redactar|presentar|conversar|dialogar|comparar)\b/g,'para')
 let mode:Mode|undefined
 if(/\b(?:investig\w*|research)\b/.test(modeText)&&/\b(?:informacion|textos?|fuentes?)\b/.test(text))mode='research'
 else if(/\b(?:escuch\w*|listen\w*)\b/.test(modeText))mode='listening'
 else if(/\b(?:leer\w*|lean|lectura|leyendo|read\w*)\b/.test(modeText))mode='reading'
 else if(/\b(?:video|audiovisual)\b/.test(modeText)&&/\b(?:grab\w*|crea\w*|elabor\w*)\b/.test(modeText))mode='audiovisual'
 else if(/\b(?:escrib\w*|escrit\w*|redact\w*|correo|por escrito|writ\w*)\b/.test(modeText))mode='writing'
 else if(/\b(?:dialog\w*|convers\w*|entrevist\w*|intercambio oral|role play)\b/.test(modeText))mode='interaction'
 else if(features&&/\b(?:compar(?:ar(?:an)?|en|an|ando)|contrast(?:ar(?:an)?|en|an)|compare)\b/.test(text))mode='comparison'
 else if(features&&/\b(?:explic\w*|analiz\w*)\b/.test(text))mode='analysis'
 else if(/\b(?:oral\w*|present(?:ar|aran|an|en|acion)|expon\w*|narr\w*|speak\w*|tell)\b/.test(text))mode='oral'
 else if(strategic.some(f=>f.id==='rehearsal'))mode='oral'
 else if(features&&/\b(?:identific\w*|reconoc\w*|localiz\w*)\b/.test(text))mode='reading'
 else if(features&&/\b(?:utiliz\w*|emple\w*|complet\w*|transform\w*)\b/.test(text))mode='writing'
 else if(genres.length&&/\b(?:crea\w*|elabor\w*|disen\w*)\b/.test(text))mode='writing'
 else if(genres.length&&/\b(?:canta\w*|recita\w*|interpreta\w*)\b/.test(text))mode='oral'
 if(!mode)return null
 const functions:FunctionId[]=[]
 if(/\b(?:sostener|sostend\w*|mantener|mantend\w*)\b/.test(text)&&/\bconversacion\b/.test(text))functions.push('conversation')
 if(/\b(?:actividades (?:cotidianas|diarias|de la vida diaria)|rutina|daily activities|routine)\b/.test(text))functions.push('daily')
 if(/\b(?:estado(?:s)? (?:de animo|animicos?)|sensacion(?:es)? fisica(?:s)?|estado(?:s)? fisico(?:s)?|moods?)\b/.test(text))functions.push('states')
 if(/\bayuda|\bhelp\b/.test(text))functions.push('help')
 if(/\b(?:compr(?:a(?:r(?:an)?|n|ndo|s)?|e(?:n|mos)?|o)|shopping)\b/.test(text))functions.push('shopping')
 if(/\b(?:deseos?|esperanzas?|wishes|hopes)\b/.test(text))functions.push('wishes')
 if(/\b(?:consejos?|sugerencias?|recomendaciones?|advice|suggestions?)\b/.test(text))functions.push('advice')
 if(/\b(?:planes?|planear\w*|encuentro|cita|meeting|plans)\b/.test(text))functions.push('plans')
 if(/\b(?:experiencias?|acontecimientos?|hechos pasados|experience)\b/.test(text))functions.push('experience')
 if(!functions.length&&mode==='interaction'&&/\b(?:convers(?:ar(?:an)?|an|en)|dialog(?:ar(?:an)?|an|uen))\b/.test(text))functions.push('conversation')
 if(requestedGradeTwoStrategies(text,mode).some(f=>f.id==='cultural-comparison'))functions.splice(0)
 const supported=grammar.length+lexical.length+requestedGradeTwoStrategies(text,mode).length+requestedGradeTwoGenres(text,mode).length
 return functions.length||supported||context.length||mode==='research'?{grade:2,mode,functions,text,contextText,...modes[mode]}:null
}
/** Independent finite actions preserve reception and production; purpose infinitives
 * and requirements remain attached to their action. Source order selects the last
 * requested productive action as the primary field, without dropping earlier evidence.
 */
export function resolveSecondGradeEnglishTask(title:string,description:string,context?:InstrumentAcademicContext|null):EnglishGradeTwoTask|null{
 if(!commonSecondGradeEnglish(context))return null
 const raw=withoutResources(description||title).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\bno (?:se )?(?:evalu\w*|calific\w*|exig\w*|requer\w*|us\w*|utiliz\w*|emple\w*|respond\w*)\b[^.;]*/g,'')
 const action='(?:leer(?:an)?|lean|escuchar(?:an)?|escuchen|redactar(?:an)?|redacten|escribir(?:an)?|escriban|presentar(?:an)?|presenten|expondran|conversar(?:an)?|dialogar(?:an)?|comparar(?:an)?|compar(?:en|an)|crear(?:an)?|elaborar(?:an)?|narrar(?:an)?)'
 const prefix='(?:(?:luego|despues|posteriormente|finalmente),?\\s+)?(?:(?:los estudiantes|el alumnado|cada estudiante|ellos|ellas)\\s+)?(?:(?:lo|la|los|las)\\s+)?'
 const parts=raw.split(new RegExp(`(?:[.;]\\s*|\\s+(?:y|luego|despues|posteriormente|finalmente)\\s+)(?=${prefix}${action}\\b)`,'g'))
 const actions:EnglishGradeTwoTask[]=[]
 for(const part of parts){
  const previous=actions.at(-1)
  let task=single(part)
  if(!task&&previous&&/\b(?:lo|la|los|las|sus trabajos)\s+(?:present\w*|expon\w*)\b/.test(part)){
   task={...previous,mode:'oral',actions:undefined,...modes.oral,requirementText:affirmativeSecondGradeEnglishTask(part),contextText:normalizedTask(part)}
  }
  if(!task&&previous&&/\b(?:compar(?:aran|an|en|ar))\b/.test(part)&&/\b(?:ambos contextos|ambos paises|los dos contextos)\b/.test(part)&&/republica dominicana.*otros paises/.test(previous.text))task=single(part+' República Dominicana y otros países')
  if(task)actions.push(task)
 }
 if(actions.length<2)return single(description||title)
 const primary=actions.filter(part=>!['reading','listening'].includes(part.mode)).at(-1)??actions.at(-1)!
 return {...primary,text:affirmativeLanguageTask(description||title),actions}
}
export function secondGradeEnglishSelections(task:EnglishGradeTwoTask,description:string){
 const discrete=(task.actions??[task]).every(a=>['reading','listening'].includes(a.mode)&&!/\b(?:explic\w*|justific\w*|infer\w*|argument\w*)\b/.test(a.text))
 return {suggestedEvaluationTechnique:task.technique,suggestedInstrumentType:languageInstrumentIntent(description)??(discrete?'lista-cotejo':'rubrica')}
}
const row=(id:string,title:string,levels:ContextualTopicCriterion['progressionLevels'],weight=4):ContextualTopicCriterion=>({templateId:`ing-2-${id}`,title,observable:levels[0],progressionLevels:levels,weight})
export function secondGradeEnglishCriteria(task:EnglishGradeTwoTask):ContextualTopicCriterion[]{
 if(task.actions){
  const rows:ContextualTopicCriterion[]=[],seen=new Set<string>()
  for(const [index,action] of task.actions.entries())for(const criterion of secondGradeEnglishCriteria(action)){
   const key=JSON.stringify(criterion);if(seen.has(key))continue;seen.add(key)
   rows.push(rows.some(r=>r.templateId===criterion.templateId)?{...criterion,templateId:`${criterion.templateId}:${action.mode}:${index+1}`}:criterion)
  }
  return rows
 }
 const {mode,text}=task,receptive=['reading','listening','analysis','comparison','research'].includes(mode),source=mode==='listening'?'mensaje escuchado':'texto leído'
 const rows:ContextualTopicCriterion[]=task.functions.map(id=>{
  switch(id){
   case 'conversation':return row(id,'Continuidad de la conversación',[
    receptive?`Reconoce el tema y cómo las intervenciones continúan la conversación del ${source} en inglés.`:'Sostiene la conversación en inglés mediante intervenciones relacionadas con el tema y con lo dicho por el interlocutor.',
    'La conversación mantiene el tema; una intervención requiere aclaración para continuar.',
    'Reconoce o aporta intervenciones aisladas, pero pierde la relación que permite continuar el tema.',
    'Confunde el asunto o el sentido de una intervención y cambia el tema de la conversación.',
    'No se reconocen intervenciones relacionadas que permitan seguir la conversación.',
   ])
   case 'daily':{
    const quantity=text.match(/\b(\d+|dos|tres|cuatro|cinco|seis) actividades\b/)?.[1]
    const target=quantity?`las ${quantity} actividades cotidianas solicitadas`:'las actividades cotidianas solicitadas'
    return row(id,'Información de las actividades cotidianas',[
     receptive?`Identifica ${target} y sus relaciones en el ${source} en inglés.`:`Comunica en inglés ${target} mediante oraciones básicas enlazadas que permiten seguir la jornada descrita.`,
     'Las actividades y sus relaciones se comprenden; una referencia de la jornada necesita precisión.',
     'Menciona actividades aisladas y deja sin relacionar parte de la jornada solicitada.',
     'Confunde las acciones o su relación y cambia la jornada descrita.',
     'No aporta información reconocible sobre las actividades cotidianas solicitadas.',
    ])
   }
   case 'states':{
    const targets=[/estado(?:s)? (?:de animo|animicos?)|moods?/.test(text)?'el estado de ánimo':'',/sensacion(?:es)? fisica(?:s)?|estado(?:s)? fisico(?:s)?|estados animicos y fisicos/.test(text)?'la sensación física':''].filter(Boolean).join(' y ')
    return row(id,'Estados del personaje o referente',[
     receptive?`Distingue ${targets} del personaje o referente indicado en el ${source} en inglés.`:`Describe en inglés ${targets} del personaje o referente indicado con oraciones básicas que permiten reconocer lo descrito.`,
     'Se comprende el estado solicitado; una referencia al personaje necesita precisión.',
     'Nombra estados aislados sin establecer cuál corresponde al personaje o referente.',
     'Atribuye al personaje un estado incompatible con la situación comunicada.',
     'No aporta información reconocible del estado solicitado del personaje o referente.',
    ])
   }
   case 'help':{
    const requesting=/solicit\w*|pedir\w*|pid\w*/.test(text),offering=/ofrec\w*|ofert\w*|offer/.test(text)
    const target=requesting&&offering?'la solicitud y la oferta de ayuda':offering?'la oferta de ayuda':'la solicitud de ayuda'
    return row(id,'Solicitud u oferta de ayuda',[
     receptive?`Reconoce ${target} y a qué necesidad se refiere en el ${source} en inglés.`:`Formula en inglés ${target} ${requesting&&offering?'relacionándolas':'relacionándola'} con la necesidad indicada en la tarea.`,
     'Se comprende qué ayuda se pide u ofrece; una referencia a la necesidad requiere precisión.',
     'Menciona ayuda sin precisar qué necesita o qué ofrece ante la situación.',
     'La ayuda solicitada u ofrecida se refiere a una necesidad diferente de la planteada.',
     'No se reconoce una solicitud u oferta de ayuda relacionada con la situación.',
    ])
   }
   case 'shopping':{
    const details=[/cantidad|quantity/.test(text)?'cantidad':'',/precio|price/.test(text)?'precio':'',/tamano|size/.test(text)?'tamaño':''].filter(Boolean)
    const target=`el producto${details.length?' y su '+details.join(' y '):''}`
    return row(id,'Información del intercambio de compra',[
     receptive?`Relaciona ${target} con la petición o respuesta del ${source} en inglés.`:`Solicita o comunica en inglés ${target} de la compra simulada según el papel indicado.`,
     'La petición o respuesta permite reconocer la compra; una referencia al producto necesita precisión.',
     'Nombra el producto, pero deja incompleta información solicitada para la compra.',
     'Confunde el producto o la información solicitada y cambia la compra simulada.',
     'No se reconoce información pertinente para la compra indicada.',
    ])
   }
   case 'wishes':return row(id,'Deseos y esperanzas comunicados',[
    receptive?`Reconoce qué desea o espera el referente en el ${source} en inglés y lo distingue de un hecho confirmado.`:'Expresa en inglés los deseos o esperanzas solicitados del referente mediante oraciones básicas que distinguen lo deseado de un hecho confirmado.',
    'Se comprende qué se desea o espera; una referencia al resultado necesita precisión.',
    'Menciona resultados posibles sin dejar claro qué desea o espera el referente.',
    'Presenta como ocurrido un resultado que el referente solo desea o espera.',
    'No se reconoce un deseo o una esperanza relacionada con la situación indicada.',
   ])
   case 'advice':return row(id,'Consejo relacionado con el problema',[
    receptive?`Relaciona el consejo o sugerencia del ${source} en inglés con el problema cotidiano planteado.`:'Formula en inglés un consejo o sugerencia que responde al problema cotidiano del personaje o situación indicada.',
    'El consejo responde al problema; una acción sugerida requiere precisión.',
    'Propone una acción, pero deja poco clara su relación con el problema cotidiano.',
    'El consejo responde a otro problema o contradice las condiciones de la situación.',
    'No se reconoce un consejo o sugerencia relacionado con el problema planteado.',
   ])
   case 'plans':{
    const details=[/\bdia\b|fecha|date/.test(text)?'el día':'',/\bhora\b|time/.test(text)?'la hora':'',/lugar|place/.test(text)?'el lugar':''].filter(Boolean)
    const target=details.length<2?details[0]??'la información solicitada':details.slice(0,-1).join(', ')+' y '+details.at(-1)
    return row(id,'Plan o encuentro acordado',[
     receptive?`Identifica la acción propuesta y ${target} en el plan del ${source} en inglés.`:`Comunica en inglés la acción propuesta y ${target} del plan o encuentro solicitado mediante oraciones básicas enlazadas.`,
     'El plan es reconocible; una referencia necesaria para el encuentro requiere precisión.',
     'Menciona una acción futura, pero omite parte de la información solicitada para el encuentro.',
     'Confunde la acción o una referencia del encuentro y comunica un plan distinto.',
     'No se reconoce un plan o encuentro relacionado con lo solicitado.',
    ])
   }
   case 'experience':return row(id,'Secuencia de hechos y experiencia',[
    receptive?`Relaciona los hechos de la experiencia del ${source} en inglés en una secuencia comprensible.`:'Narra en inglés los hechos de la experiencia real o ficticia solicitada mediante oraciones básicas enlazadas en una secuencia comprensible.',
    'Se comprende la experiencia y su secuencia; una transición entre hechos necesita precisión.',
    'Comunica hechos aislados sin establecer varias relaciones necesarias para seguir la experiencia.',
    'Confunde los hechos o su secuencia y cambia la experiencia narrada.',
    'No se reconocen hechos relacionados con la experiencia solicitada.',
   ])
  }
 })
 const requirements=task.requirementText??text
 rows.push(...requestedGradeTwoGrammar(requirements).map(f=>gradeTwoGrammarCriterion(f,requirements,mode)))
 rows.push(...requestedGradeTwoLexicon(requirements).map(f=>gradeTwoLexicalCriterion(f,requirements,mode)))
 rows.push(...gradeTwoStrategyCriteria(requirements,mode))
 rows.push(...gradeTwoGenreCriteria(requirements,mode,rows))
 if(mode==='research'){
  const target=[['celebraciones','las celebraciones'],['lugares de interes','los lugares de interés'],['tecnologia','la tecnología'],['salud','la salud'],['clima','el clima'],['situaciones problematicas','las situaciones problemáticas'],['actividades de tiempo libre','las actividades de tiempo libre']].filter(([pattern])=>new RegExp(pattern).test(text)).map(([,label])=>label).join(' y ')||'el asunto solicitado'
  const provided=/proporcionad\w*|suministrad\w*/.test(text)
  rows.push(row('research','Información recuperada de la investigación',[
   `Recupera y relaciona información de ${provided?'los textos en inglés proporcionados':'las fuentes consultadas en inglés'} sobre ${target}, vinculándola con la pregunta o finalidad de la investigación.`,
   'La información responde a la búsqueda principal; una relación con lo consultado necesita precisión.',
   'Recupera datos aislados, pero deja sin relacionar información necesaria para responder a la búsqueda.',
   'Atribuye a las fuentes información incompatible con lo consultado o con la búsqueda solicitada.',
   'No aporta información reconocible relacionada con lo consultado y la búsqueda solicitada.',
  ]))
 }
 rows.push(...gradeTwoContextCriteria(task.contextText??text,receptive))
 if(mode==='interaction'||mode==='writing'&&/\b(?:responder\w*|respond\w*|intercambi\w*)\b|\b(?:correo|mensaje) (?:electronico )?de respuesta\b/.test(text))rows.push(row('interaction','Respuesta al interlocutor',[
  `Relaciona su respuesta en inglés con la intervención del interlocutor y permite continuar el intercambio${mode==='writing'?' escrito':''}.`,
  'La respuesta corresponde a lo dicho; necesita una aclaración puntual para continuar.',
  'Responde solo a una parte de la intervención y deja información relevante sin relacionar.',
  'Interpreta otro asunto como objeto de la intervención y responde a una información diferente.',
  'No aporta una respuesta reconocible relacionada con lo dicho por el interlocutor.',
 ],3))
 if(!receptive&&mode!=='audiovisual')rows.push(mode==='writing'?row('written','Mensaje escrito enlazado y comprensible',[
  'Enlaza oraciones básicas en inglés que permiten comprender las ideas del mensaje escrito; los errores aislados no impiden seguir el sentido.',
  'Se comprenden las ideas principales; una unión entre oraciones o una palabra requiere revisión.',
  'Se comprenden oraciones aisladas, pero varias relaciones entre ideas quedan ambiguas.',
  'Las relaciones entre oraciones o palabras elegidas cambian el sentido del mensaje escrito.',
  'No se reconoce un mensaje escrito relacionado con el propósito solicitado.',
 ],3):row('intelligibility','Mensaje oral enlazado y comprensible',[
  'Comunica en inglés oraciones básicas enlazadas que permiten seguir el mensaje oral; las pausas, reformulaciones y apoyos acordados permiten reconocer las ideas.',
  'Las ideas principales se comprenden; una expresión requiere aclaración o repetición.',
  'Se comprenden expresiones aisladas, pero varias relaciones necesarias para seguir las ideas quedan ambiguas.',
  'Las expresiones elegidas cambian el sentido de las ideas que se pretende comunicar.',
  'No se reconoce un mensaje oral relacionado con el propósito solicitado con los apoyos acordados.',
 ],3))
 return rows
}
