import {affirmativeLanguageTask} from './language-feature-criteria'
import {languageInstrumentIntent} from './language-instrument-intent'
import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {requestedEnglishGrammar,englishGrammarCriterion} from './secondary-english-grade-one-grammar'
import {requestedEnglishLexicon,englishLexicalCriterion} from './secondary-english-grade-one-lexicon'
import {requestedEnglishStrategies,englishStrategyCriteria} from './secondary-english-grade-one-strategies'
import {requestedEnglishGenres,englishGenreCriteria} from './secondary-english-grade-one-genres'
import {withoutResources} from './evaluation-task-text'
import {englishContextCriteria} from './secondary-english-grade-one-context'

export const englishGradeOneModule={id:'ingles-comunicacion-1',grade:1,subjectCode:'ING',pdfPages:[134,135,136,137,138,139],policy:'COMMUNICATIVE_FUNCTION_MODALITY_V1'}

export function commonFirstGradeEnglish(context?:InstrumentAcademicContext|null) {
 if(context?.level!=='SECONDARY'||context.grade!==1||context.optativeExitName)return false
 const code=context.subjectCode.trim().toUpperCase()
 return code==='ING'||(!code&&/^(?:(?:lenguas? extranjeras? )?ingles|english)$/.test(affirmativeLanguageTask(context.subjectName??'')))
}

type Mode='reading'|'listening'|'interaction'|'oral'|'writing'|'audiovisual'
type FunctionId='personal'|'invitation'|'routine'|'comparison'|'instructions'|'preferences'|'clarification'|'weather'|'directions'|'experience'|'opinion'|'description'
export type EnglishTask={mode:Mode; functions:FunctionId[]; text:string; evidenceText?:string; contextText?:string; activityType:string; technique:string; actions?:EnglishTask[]}
const modes:Record<Mode,{activityType:string;technique:string}>={
 reading:{activityType:'READING_COMPREHENSION',technique:'analisis-producciones'},
 listening:{activityType:'LISTENING_COMPREHENSION',technique:'observacion-sistematica'},
 interaction:{activityType:'ORAL_INTERACTION',technique:'observacion-directa'},
 oral:{activityType:'ORAL_PRESENTATION',technique:'presentacion'},
 writing:{activityType:'WRITTEN_PRODUCTION',technique:'analisis-producciones'},
 audiovisual:{activityType:'AUDIOVISUAL_PRODUCTION',technique:'analisis-producciones'},
}

/** Content and action come from the assignment; a decorative heading cannot change them. */
export function resolveFirstGradeEnglishTask(title:string,description:string,context?:InstrumentAcademicContext|null):EnglishTask|null {
 if(!commonFirstGradeEnglish(context))return null
 // Split independent actions before normalization removes sentence boundaries. Infinitives
 // of purpose ("para describir") remain attached to their requested product.
 const raw=withoutResources(description||title).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
 const action='(?:leer(?:an)?|lean|escuchar(?:an)?|escuchen|redactar(?:an)?|redacten|escribir(?:an)?|escriban|presentar(?:an)?|presenten|expondran|conversar(?:an)?|dialogar(?:an)?|comparar(?:an)?|compar(?:en|an)|crear(?:an)?|elaborar(?:an)?|revisar(?:an)?|planificar(?:an)?|recitar(?:an)?|cantar(?:an)?)'
 const prefix='(?:(?:luego|despues|posteriormente|finalmente),?\\s+)?(?:(?:los estudiantes|el alumnado|cada estudiante|ellos|ellas)\\s+)?(?:(?:lo|la|los|las)\\s+)?'
 const boundary=new RegExp(`(?:[.;]\\s*|\\s+(?:y|luego|despues|posteriormente|finalmente)\\s+)(?=${prefix}${action}\\b)`,'g')
 const parts=raw.split(boundary).filter(Boolean)
 const actions:EnglishTask[]=[]
 for(const part of parts){
  let task=resolveSingleEnglishAction('',part,context)
  const previous=actions.at(-1)
  // Explicit pronoun refers to the preceding text product, without transferring its
  // verbs (which would incorrectly turn an oral presentation back into writing).
  if(!task&&previous&&/\b(?:lo|la|los|las)\s+(?:present\w*|leer\w*|redact\w*)\b/.test(part)){
   const genres=requestedEnglishGenres(previous.text).map(g=>previous.text.match(new RegExp(`\\b(?:${g.match})\\b`))?.[0]).filter(Boolean)
   if(genres.length)task=resolveSingleEnglishAction('',`${part} ${genres.join(' ')}`,context)
  }
  if(task)actions.push(task)
 }
 if(actions.length<2)return resolveSingleEnglishAction(title,description,context)
 const primary=actions.filter(part=>!['reading','listening'].includes(part.mode)).at(-1)??actions.at(-1)!
 return {...primary,text:affirmativeLanguageTask(description||title),functions:[...new Set(actions.flatMap(part=>part.functions))],actions}
}

function resolveSingleEnglishAction(title:string,description:string,context?:InstrumentAcademicContext|null):EnglishTask|null {
 if(!commonFirstGradeEnglish(context))return null
 const text=affirmativeLanguageTask(description||title)
 const contextText=withoutResources(description||title).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
  .replace(/\b(?:no (?:se )?(?:evalu\w*|calific\w*|exig\w*|requer\w*)|sin evaluar)\b[^.;]*/g,'')
 const grammar=requestedEnglishGrammar(text)
 const lexicon=requestedEnglishLexicon(text)
 const genres=requestedEnglishGenres(text)
 let mode:Mode|undefined
 if(/\b(?:escuch\w*|listen\w*)\b/.test(text))mode='listening'
 else if(/\b(?:leer\w*|leeran|leyendo|lectura|read\w*)\b/.test(text))mode='reading'
 else if(genres.some(g=>g.id==='audiovisual')&&/\b(?:crea\w*|elabor\w*|produc\w*|graba\w*|present\w*)\b/.test(text))mode='audiovisual'
 else if(/\b(?:dialog\w*|convers\w*|intercambios? orales?|entrevist\w*|role play)\b/.test(text))mode='interaction'
 else if(/\b(?:escrib\w*|redact\w*|por escrito|writ\w*|intercambios? escritos?|interaccion escrita|intercambi\w* mensajes escritos)\b/.test(text))mode='writing'
 else if(/\b(?:oralmente|oral|present\w*|expon\w*|speak\w*|tell)\b/.test(text))mode='oral'
 else if(/\b(?:ensay\w*|reproduccion de palabras)\b/.test(text))mode='oral'
 else if(/\b(?:planific\w*|revis\w* (?:el )?borrador)\b/.test(text))mode='writing'
 else if(genres.length&&/\b(?:elabor\w*|crea\w*|disen\w*|complet\w*)\b/.test(text))mode='writing'
 else if(genres.length&&/\b(?:canta\w*|recita\w*|interpreta\w*)\b/.test(text))mode='oral'
 else if((grammar.length||lexicon.length||genres.length)&&/\b(?:identific\w*|analiz\w*|localiz\w*|reconoc\w*)\b/.test(text))mode='reading'
 else if((grammar.length||lexicon.length)&&/\b(?:complet\w*|transform\w*|correg\w*|formul\w*|utiliz\w*)\b/.test(text))mode='writing'
 if(!mode)return null
 const strategies=requestedEnglishStrategies(text,mode)
 const evidenceText=(mode==='reading'||mode==='listening')?text.match(/\b(?:identific\w*|localiz\w*|reconoc\w*|analiz\w*)\s+(.+)/)?.[1]??text:text
 const functionText=evidenceText!==text&&(grammar.length||lexicon.length)?evidenceText:text
 const functions:FunctionId[]=[]
 if(/\b(?:informacion personal|nombre y edad|personal information|name and age)\b/.test(functionText))functions.push('personal')
 if(/\b(?:invit\w*|invitations?)\b/.test(functionText))functions.push('invitation')
 if(/\b(?:rutina|rutinas|actividades (?:cotidianas|diarias)|routine|daily activities)\b/.test(functionText))functions.push('routine')
 if(/\b(?:compar(?:a|an|ar|aran|ando|en|e|emos|acion|aciones)|compare|semejanzas|diferencias)\b/.test(functionText))functions.push('comparison')
 if(/\b(?:recorrid\w*|direcciones|para llegar|directions)\b/.test(functionText))functions.push('directions')
 else if(/\b(?:instrucciones|indicaciones|recetas?|instructions?|recipe)\b/.test(functionText))functions.push('instructions')
 if(/\b(?:gustos|preferencias|likes|dislikes|preferences)\b/.test(functionText))functions.push('preferences')
 if(/\b(?:repeticion|aclaracion|clarification|repeat)\b/.test(functionText))functions.push('clarification')
 if(/\b(?:clima|pronostico del tiempo|condiciones atmosfericas|weather|forecast)\b/.test(functionText))functions.push('weather')
 if(/\b(?:experiencia|experiencias|acontecimientos|experiences)\b/.test(functionText))functions.push('experience')
 if(/\b(?:opinion|opiniones|opinion[s]?)\b/.test(functionText))functions.push('opinion')
 if(!functions.length&&/\b(?:describ\w*|descrip\w*|describe)\b/.test(functionText))functions.push('description')
 if(strategies.some(f=>f.id==='cultural-comparison'))for(const id of ['comparison','preferences','weather','description'] as FunctionId[])if(functions.includes(id))functions.splice(functions.indexOf(id),1)
 if(strategies.some(f=>f.id==='help')&&functions.includes('clarification'))functions.splice(functions.indexOf('clarification'),1)
 return functions.length||grammar.length||lexicon.length||strategies.length||genres.length||englishContextCriteria(contextText).length?{mode,functions,text,evidenceText,contextText,...modes[mode]}:null
}

export function firstGradeEnglishSelections(task:EnglishTask,description:string){
 const discreteReception=(task.actions??[task]).every(action=>(action.mode==='reading'||action.mode==='listening')&&!/\b(?:explic\w*|justific\w*|infer\w*|argument\w*)\b/.test(action.text))
 return {suggestedEvaluationTechnique:task.technique,suggestedInstrumentType:languageInstrumentIntent(description)??(discreteReception?'lista-cotejo':'rubrica')}
}

const row=(id:string,title:string,levels:ContextualTopicCriterion['progressionLevels'],weight=4):ContextualTopicCriterion=>({templateId:`ing-1-${id}`,title,observable:levels[0],progressionLevels:levels,weight})
const list=(items:string[])=>items.length<2?items[0]:items.slice(0,-1).join(', ')+' y '+items.at(-1)

export function firstGradeEnglishCriteria(task:EnglishTask):ContextualTopicCriterion[]{
 if(task.actions){
  const rows:ContextualTopicCriterion[]=[],seen=new Set<string>()
  for(const [index,action] of task.actions.entries())for(const criterion of firstGradeEnglishCriteria(action)){
   const key=JSON.stringify(criterion)
   if(seen.has(key))continue
   seen.add(key)
   rows.push(rows.some(row=>row.templateId===criterion.templateId)?{...criterion,templateId:`${criterion.templateId}:${action.mode}:${index+1}`}:criterion)
  }
  return rows
 }
 const {text,mode}=task,receptive=mode==='reading'||mode==='listening'
 const source=mode==='listening'?'mensaje escuchado':'texto leído'
 const output=mode==='writing'?'escrito':'oral'
 const result=task.functions.map(id=>{
  switch(id){
   case 'personal':{
    const fields=[['nombre|name','nombre'],['edad|age','edad'],['nacionalidad|nationality','nacionalidad'],['ocupacion|occupation','ocupación']].filter(([pattern])=>new RegExp(`\\b(?:${pattern})\\b`).test(text)).map(([,name])=>name)
    const requested=fields.length?list(fields):'datos solicitados'
    return row(id,'Información personal solicitada',[
     receptive?`Identifica ${requested} de la persona o personaje a partir del ${source} en inglés.`:`Comunica en inglés ${requested} de la persona o personaje indicado, con frases breves que permiten reconocer los datos solicitados.`,
     `Se reconocen los datos principales de ${requested}; una referencia aislada necesita aclaración.`,
     `Se reconocen algunos datos de ${requested}, pero otros quedan incompletos o no se relacionan con la persona indicada.`,
     'Confunde los datos entre personas o personajes y cambia la identidad descrita.',
     'No aporta datos reconocibles de la persona o personaje indicado.',
    ])
   }
   case 'invitation':{
    const responding=/\b(?:acept\w*|rechaz\w*|respond\w*|accept\w*|declin\w*)\b/.test(text)
    const inviting=/\b(?:invitar\w*|inviten|invitando|invite|inviting)\b/.test(text)||!responding
    if(!receptive&&!(responding&&inviting))return responding?row(id,'Respuesta a la invitación',[
     'Acepta o rechaza en inglés la invitación recibida con una expresión cortés que comunica la respuesta elegida.',
     'La aceptación o el rechazo es reconocible; una expresión cortés necesita precisión.',
     'Responde a la invitación, pero no queda claro si la acepta o rechaza.',
     'La respuesta expresa lo contrario de la aceptación o el rechazo que pretende comunicar.',
     'No aporta una respuesta reconocible a la invitación recibida.',
    ]):row(id,'Formulación de la invitación',[
     'Formula en inglés una invitación comprensible que permite reconocer la actividad propuesta al destinatario.',
     'La propuesta es reconocible; una referencia de la invitación necesita precisión.',
     'Menciona una actividad, pero no queda claro que la propone al destinatario.',
     'La formulación cambia la actividad que se pretende proponer.',
     'No se reconoce una invitación a la actividad indicada.',
    ])
    return row(id,'Invitación y respuesta',[
    receptive?`Reconoce qué se propone en la invitación del ${source} y si la respuesta la acepta o rechaza.`:'Formula una invitación comprensible en inglés y acepta o rechaza la invitación recibida con una expresión cortés, según el papel solicitado.',
    'Se comprende la propuesta y la aceptación o el rechazo; una expresión necesita aclaración.',
    'Se reconoce la propuesta, pero no queda claro si la respuesta acepta o rechaza la invitación.',
    'La respuesta contradice la aceptación o el rechazo que se pretende comunicar.',
    'No se reconoce la propuesta ni una respuesta a la invitación.',
   ])
   }
   case 'routine':{
    const quantity=text.match(/\b(\d+|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez) actividades\b/)?.[1]
    const activities=quantity?`las ${quantity} actividades solicitadas`:'las actividades'
    const time=/horarios?|\bhora\b|hours?|\btime\b/.test(text)?' y sus horarios':''
    return row(id,'Actividades de la rutina',[
     receptive?`Relaciona ${activities} de la rutina${time} según la información del ${source} en inglés.`:`Describe en inglés ${activities} de la rutina${time} mediante frases breves relacionadas entre sí.`,
     `Se reconocen ${activities}${time}; una relación necesita precisión.`,
     `Menciona actividades aisladas sin establecer las relaciones de la rutina${time}.`,
     'Confunde las actividades o sus relaciones y cambia la rutina descrita.',
     'No se identifican actividades que permitan reconocer la rutina.',
    ])
   }
   case 'comparison':return row(id,'Semejanzas y diferencias',[
    receptive?`Distingue semejanzas y diferencias de los elementos comparados en el ${source} en inglés.`:'Compara en inglés los elementos indicados estableciendo semejanzas y diferencias sobre un mismo aspecto.',
    'La comparación es comprensible; una relación entre los elementos necesita precisión.',
    'Describe por separado los elementos sin relacionar sus semejanzas y diferencias.',
    'Compara aspectos distintos como si fueran equivalentes y altera la relación entre los elementos.',
    'No aporta una semejanza ni una diferencia reconocible de los elementos indicados.',
   ])
   case 'instructions':return row(id,'Acciones y orden de las instrucciones',[
    receptive?`Relaciona cada instrucción en inglés del ${source} con la acción que solicita y reconoce el orden de las acciones indicadas.`:'Comunica en inglés las instrucciones solicitadas mediante acciones reconocibles y un orden que permite seguirlas.',
    'Las acciones y su orden son reconocibles; una indicación necesita precisión.',
    'Se reconocen algunas acciones, pero faltan relaciones necesarias para seguir el orden de las instrucciones.',
    'Confunde una acción o su orden y cambia lo que la instrucción solicita.',
    'No se reconocen las acciones solicitadas en las instrucciones.',
   ])
   case 'preferences':return row(id,'Gustos y preferencias',[
    receptive?`Reconoce la actividad o elemento preferido y a quién corresponde la preferencia en el ${source} en inglés.`:'Expresa en inglés sus gustos o preferencias sobre las actividades o elementos indicados y permite distinguir qué prefiere.',
    'Se reconoce qué actividad o elemento prefiere; una expresión necesita aclaración.',
    'Nombra actividades o elementos sin dejar clara su preferencia.',
    'Confunde el gusto y el rechazo o atribuye la preferencia a otra persona.',
    'No se reconoce una preferencia sobre las actividades o elementos indicados.',
   ])
   case 'clarification':return row(id,'Solicitud de aclaración',[
    receptive?`Reconoce qué repetición o aclaración se solicita y cómo se responde en el ${source} en inglés.`:'Solicita en inglés una repetición o aclaración pertinente y responde a la información aclarada para continuar el intercambio.',
    'La solicitud permite aclarar el mensaje; necesita apoyo puntual para continuar el intercambio.',
    'Pide repetición, pero no relaciona la respuesta con la información que necesitaba aclarar.',
    'La solicitud se refiere a otra información y mantiene el malentendido.',
    'No aporta una solicitud reconocible ni una respuesta a la aclaración.',
   ])
   case 'weather':{
    const details=[/lugar|ciudad|place|city/.test(text)?'el lugar':'',/\bdia\b|fecha|day|date/.test(text)?'el día':''].filter(Boolean)
    const relation=details.length?` y las relaciona con ${list(details)} indicado${details.length===1?'':'s'}`:''
    return row(id,'Condiciones atmosféricas',[
     receptive?`Identifica las condiciones atmosféricas del ${source} en inglés${relation}.`:`Comunica en inglés las condiciones atmosféricas solicitadas${relation}.`,
     'Las condiciones atmosféricas se comprenden; una referencia del pronóstico necesita precisión.',
     'Reconoce términos del tiempo, pero no los relaciona con la información solicitada.',
     'Confunde las condiciones atmosféricas y cambia la información del pronóstico.',
     'No aporta información reconocible sobre las condiciones atmosféricas solicitadas.',
    ])
   }
   case 'directions':return row(id,'Ubicación y recorrido',[
    receptive?`Reconoce el destino y relaciona las indicaciones de dirección del ${source} en inglés con el recorrido solicitado.`:'Da o solicita en inglés indicaciones que permiten reconocer el destino y seguir el recorrido solicitado.',
    'Se reconoce el destino y el recorrido; una indicación espacial necesita aclaración.',
    'Nombra el destino o lugares aislados sin enlazar las indicaciones del recorrido.',
    'Confunde las direcciones y conduce a un destino distinto del solicitado.',
    'No se reconoce el destino ni un recorrido relacionado con las indicaciones.',
   ])
   case 'experience':return row(id,'Acontecimientos de la experiencia',[
    receptive?`Reconoce los acontecimientos y su secuencia en la experiencia narrada en el ${source} en inglés.`:'Narra en inglés una experiencia real o ficticia mediante acontecimientos relacionados en una secuencia comprensible.',
    'La experiencia se comprende; una transición entre acontecimientos necesita precisión.',
    'Menciona acontecimientos aislados sin establecer la secuencia de la experiencia.',
    'Confunde los acontecimientos o su orden y cambia la experiencia narrada.',
    'No se reconocen acontecimientos de una experiencia narrada.',
   ])
   case 'opinion':{
    const reason=/razon|motivo|porque|reason|because/.test(text)
    return row(id,'Opinión sobre la situación',[
     receptive?`Identifica la opinión sobre la situación del ${source} en inglés${reason?' y la razón que la apoya':''}.`:`Expresa en inglés una opinión reconocible sobre la situación indicada${reason?' y la apoya con una razón relacionada':''}.`,
     `La opinión es reconocible${reason?' y tiene una razón pertinente':''}; una expresión necesita precisión.`,
     reason?'Enuncia una opinión, pero la razón no permite reconocer por qué la sostiene.':'Menciona la situación sin dejar clara su opinión sobre ella.',
     'Las expresiones contradicen la opinión que se pretende comunicar.',
     'No se reconoce una opinión sobre la situación indicada.',
    ])
   }
   case 'description':{
    const aspects=[/apariencia|rasgos fisicos/.test(text)?'la apariencia':'',/forma de ser|personalidad/.test(text)?'la forma de ser':''].filter(Boolean)
    const target=aspects.length?list(aspects):'las características solicitadas de la persona, objeto o lugar'
    return row(id,'Características descritas',[
     receptive?`Reconoce ${target} en el ${source} en inglés.`:`Describe en inglés ${target} con frases breves que permiten reconocer lo descrito.`,
     'Las características descritas son reconocibles; una referencia necesita precisión.',
     'Menciona características aisladas sin relacionarlas con la persona, objeto o lugar indicado.',
     'Atribuye características contradictorias y cambia la descripción solicitada.',
     'No se reconocen características de la persona, objeto o lugar indicado.',
    ])
   }
  }
 })
 const grammar=requestedEnglishGrammar(task.evidenceText??text)
 result.push(...grammar.map(f=>englishGrammarCriterion(f,task.evidenceText??text,mode)))
 const strategies=englishStrategyCriteria(text,mode)
 const lexicon=requestedEnglishLexicon(task.evidenceText??text).filter(f=>f.id!=='translation'||!strategies.some(s=>s.templateId==='ing-1-strategy-help'))
 result.push(...lexicon.map(f=>englishLexicalCriterion(f,text,mode)))
 result.push(...strategies)
 const genres=englishGenreCriteria(text,mode,result)
 result.push(...genres)
 result.push(...englishContextCriteria(task.contextText??text,receptive).filter(c=>c.templateId!=='ing-1-context-respectful-message'||!result.some(row=>/cortesía|cortés/.test(row.observable))))
 if(receptive&&!result.length)result.push(row('source','Comprensión sustentada en el mensaje',[
  `Responde a lo solicitado apoyándose en palabras o datos presentes en el ${source} en inglés.`,
  `La respuesta corresponde al ${source}; una relación con sus palabras o datos necesita precisión.`,
  'Recupera palabras aisladas, pero deja sin relacionar datos necesarios para responder a lo solicitado.',
  'La respuesta contradice la información disponible en el mensaje.',
  'No aporta una respuesta relacionada con información reconocible del mensaje.',
 ],3))
 if((mode==='interaction'||mode==='writing'&&/\b(?:intercambi\w*|interaccion escrita|respondi\w* al interlocutor)\b/.test(text))&&!genres.some(g=>g.templateId==='ing-1-genre-conversation'))result.push(row('interaction','Respuesta al interlocutor',[
  `Relaciona sus intervenciones breves en inglés con lo dicho por el interlocutor y permite continuar el intercambio${mode==='writing'?' escrito':''}, usando aclaraciones cuando las necesita.`,
  'Responde al interlocutor de forma pertinente; necesita una aclaración puntual para continuar.',
  'Responde a algunas intervenciones, pero otras quedan sin una respuesta relacionada.',
  'Las respuestas cambian el sentido de lo dicho por el interlocutor e interrumpen el intercambio.',
  'No se aporta una respuesta reconocible a las intervenciones del interlocutor.',
 ],3))
 if(!receptive&&mode!=='audiovisual'&&(task.functions.length||mode==='oral'&&genres.length))result.push(mode==='writing'?row('written','Mensaje escrito comprensible',[
  'Enlaza frases breves en inglés que permiten comprender el mensaje escrito; los posibles errores básicos no impiden reconocer las ideas.',
  'Las ideas principales se comprenden; una unión de frases o un uso del vocabulario necesita revisión.',
  'Se comprenden frases aisladas, pero varias relaciones entre las ideas quedan ambiguas.',
  'La organización de las frases o las palabras elegidas cambia el sentido del mensaje escrito.',
  'No se aporta un mensaje escrito reconocible en inglés.',
 ],3):row('intelligibility','Mensaje oral comprensible',[
  `Comunica el mensaje ${output} en inglés con frases breves y vocabulario comprensible; las pausas, reformulaciones o apoyos acordados permiten seguir las ideas.`,
  'Se comprenden las ideas principales; una expresión necesita aclaración o repetición.',
  'Se comprenden expresiones aisladas, pero resulta difícil relacionarlas con el mensaje solicitado.',
  'Las expresiones elegidas cambian el sentido de las ideas que se desean comunicar.',
  'No se aporta un mensaje oral reconocible en inglés con los apoyos acordados.',
 ],3))
 // Explicit requirements omitted by the broad communicative/grammar rows. They are
 // also returned during generation: a new instrument must not omit requested evidence.
 const requirements=(task.contextText??text).replace(/\bno (?:se )?(?:respond\w*|utiliz\w*|emple\w*|us\w*)\b[^.;]*/g,'')
 if(!receptive&&/\b(?:utiliz\w*|emple\w*|us\w*)\b/.test(requirements)&&/\bexpresiones (?:de tiempo|temporales)\b/.test(requirements)) {
  const expressions=['in the morning','in the afternoon','at night'].filter(expression=>requirements.includes(expression))
  const requested=expressions.length?list(expressions):'las expresiones temporales solicitadas'
  result.push(row('temporal-expressions','Expresiones temporales en el mensaje',[
   `Relaciona las acciones del mensaje en inglés con el momento correspondiente mediante ${requested}.`,
   `Las expresiones temporales sitúan las acciones; una asociación con el momento necesita precisión.`,
   'Emplea algunas expresiones temporales, pero deja acciones sin situar o confunde varios momentos.',
   'Las expresiones temporales sitúan las acciones en momentos incompatibles con el mensaje que pretende comunicar.',
   'No utiliza expresiones temporales reconocibles para situar las acciones del mensaje.',
  ],3))
 }
 if(mode==='oral'&&/\brespond\w*\b/.test(requirements)&&/\bpreguntas?\b/.test(requirements)&&!result.some(c=>/interaction|conversation/.test(c.templateId)))result.push(row('question-response','Comprensión y respuesta a la pregunta',[
  `Responde en inglés a la pregunta del interlocutor con información pertinente${task.functions.includes('routine')?' sobre la rutina presentada':''}, mostrando que reconoce lo que se le pregunta.`,
  'La respuesta corresponde a la pregunta; necesita una aclaración puntual para precisar la información.',
  'Reconoce parte de la pregunta, pero responde solo a una parte o aporta información poco relacionada.',
  'Interpreta otra información como objeto de la pregunta y responde a un asunto diferente.',
  'No aporta una respuesta reconocible relacionada con la pregunta, aun con los apoyos acordados.',
 ],3))
 return result
}
