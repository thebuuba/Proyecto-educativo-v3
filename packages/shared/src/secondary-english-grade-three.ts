import {languageInstrumentIntent} from './language-instrument-intent'
import {affirmativeScopedEnglishTask,commonEnglishGrade,englishContextTask,independentEnglishActionParts} from './secondary-english-task-text'
import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {requestedGradeThreeGrammar,gradeThreeGrammarCriterion} from './secondary-english-grade-three-grammar'
import {requestedGradeThreeLexicon,gradeThreeLexicalCriterion} from './secondary-english-grade-three-lexicon'
import {requestedGradeThreeStrategies,gradeThreeStrategyCriteria} from './secondary-english-grade-three-strategies'
import {requestedGradeThreeGenres,gradeThreeGenreCriteria} from './secondary-english-grade-three-genres'
import {gradeThreeContextCriteria} from './secondary-english-grade-three-context'

export const englishGradeThreeModule={id:'ingles-comunicacion-3',grade:3,subjectCode:'ING',pdfPages:[146,147,148,149,150,151],policy:'COMMON_THIRD_GRADE_FUNCTIONS_GRAMMAR_LEXICON_STRATEGIES_GENRES_CONTEXT_COMPOSITION_V2'}
type Mode='reading'|'listening'|'interaction'|'oral'|'writing'|'audiovisual'|'analysis'|'comparison'|'research'
type FunctionId='explanations'|'opinion'|'suggestion'|'prohibition'|'warning'|'directions'|'instructions'|'narrative'|'inference'|'prediction'|'news'|'past-present'
export type EnglishGradeThreeTask={grade:3;mode:Mode;functions:FunctionId[];text:string;contextText?:string;requirementText?:string;activityType:string;technique:string;actions?:EnglishGradeThreeTask[]}
const modes:Record<Mode,{activityType:string;technique:string}>={
 reading:{activityType:'READING_COMPREHENSION',technique:'analisis-producciones'},listening:{activityType:'LISTENING_COMPREHENSION',technique:'observacion-sistematica'},
 interaction:{activityType:'ORAL_INTERACTION',technique:'observacion-directa'},oral:{activityType:'ORAL_PRESENTATION',technique:'presentacion'},
 writing:{activityType:'WRITTEN_PRODUCTION',technique:'analisis-producciones'},audiovisual:{activityType:'AUDIOVISUAL_PRODUCTION',technique:'analisis-producciones'},
 analysis:{activityType:'ANALYSIS',technique:'analisis-producciones'},comparison:{activityType:'COMPARISON',technique:'analisis-producciones'},research:{activityType:'RESEARCH',technique:'analisis-producciones'},
}
export const commonThirdGradeEnglish=(context?:InstrumentAcademicContext|null)=>commonEnglishGrade(context,3)
function single(description:string):EnglishGradeThreeTask|null{
 const text=affirmativeScopedEnglishTask(description),contextText=englishContextTask(description),functions:FunctionId[]=[]
 if(/\b(?:explicaciones|motivos|razones de (?:una|la) decision)\b/.test(text))functions.push('explanations')
 if(/\b(?:opinion(?:es)?|puntos? de vista)\b/.test(text))functions.push('opinion')
 if(/\b(?:sugerencias?|consejos?)\b/.test(text))functions.push('suggestion')
 if(/\bprohibicion(?:es)?\b/.test(text))functions.push('prohibition')
 if(/\b(?:advertencias?|avisar (?:de |sobre )?un riesgo)\b/.test(text))functions.push('warning')
 if(/\bindicaciones\b/.test(text)&&/\b(?:llegar|lugar|recorrido|ruta|croquis)\b/.test(text))functions.push('directions')
 if(/\binstrucciones\b|\bindicaciones\b(?!.*\b(?:llegar|recorrido|ruta|croquis)\b)/.test(text))functions.push('instructions')
 if(/\b(?:historia(?:s)?|narracion(?:es)?|secuenciar\w* (?:los |sus )?(?:eventos|acontecimientos))\b/.test(text))functions.push('narrative')
 if(/\binferencias?\b|\binfer(?:ir\w*|iran)\b(?! (?:el )?significado)/.test(text))functions.push('inference')
 if(/\b(?:prediccion(?:es)?|predecir\w*|predeciran)\b/.test(text))functions.push('prediction')
 if(/\b(?:anuncios?|noticias?)\b/.test(text))functions.push('news')
 if(/\b(?:compar\w*|contrast\w*)\b/.test(text)&&/\bpasado\b/.test(text)&&/\bpresente\b/.test(text))functions.push('past-present')
 const grammar=requestedGradeThreeGrammar(text)
 const lexical=requestedGradeThreeLexicon(text)
 const strategies=requestedGradeThreeStrategies(text),genres=requestedGradeThreeGenres(text)
 const contextual=gradeThreeContextCriteria(contextText)
 if(!functions.length&&!grammar.length&&!lexical.length&&!strategies.length&&!genres.length&&!contextual.length&&!/\binvestig\w*\b/.test(text))return null
 const action=text.replace(/\b(?:para|a fin de) (?:leer|escuchar|escribir|redactar|presentar|comparar)\b/g,'para')
 let mode:Mode|undefined
 if(/\binvestig\w*\b/.test(action))mode='research'
 else if(/\b(?:escuch\w*|listen\w*)\b/.test(action))mode='listening'
 else if(/\b(?:leer\w*|lean|lectura|read\w*)\b/.test(action))mode='reading'
 else if(/\b(?:video|audiovisual)\b/.test(action)&&/\b(?:grab\w*|crea\w*|elabor\w*)\b/.test(action))mode='audiovisual'
 else if(/\b(?:escrib\w*|escrit\w*|redact\w*|por escrito)\b/.test(action))mode='writing'
 else if(/\b(?:dialog\w*|convers\w*|intercambio oral|role play)\b/.test(action))mode='interaction'
 else if(/\b(?:oral\w*|present(?:ar|aran|an|en|acion)|expon\w*|narr\w*)\b/.test(action))mode='oral'
 else if(functions.includes('past-present'))mode='comparison'
 else if((grammar.length||strategies.length)&&/\b(?:compar(?:ar(?:an)?|en|an)|contrast\w*)\b/.test(action))mode='comparison'
 else if(/\b(?:analiz\w*|explic\w*|infer\w*)\b/.test(action))mode='analysis'
 else if(strategies.some(f=>f.id==='rehearsal'))mode='oral'
 else if(/\b(?:particip\w* oralmente|canta\w*|recita\w*)\b/.test(action))mode='oral'
 else if(/\b(?:identific\w*|reconoc\w*|localiz\w*)\b/.test(action))mode='reading'
 else if(genres.length&&/\b(?:crea\w*|elabor\w*)\b/.test(action))mode='writing'
 if(requestedGradeThreeStrategies(text,mode).some(s=>s.id==='cultural-comparison'))functions.splice(0)
 if(!mode)return null
 return {grade:3,mode,functions,text,contextText,...modes[mode]}
}
export function resolveThirdGradeEnglishTask(title:string,description:string,context?:InstrumentAcademicContext|null):EnglishGradeThreeTask|null{
 if(!commonThirdGradeEnglish(context))return null
 const actions:EnglishGradeThreeTask[]=[]
 for(const part of independentEnglishActionParts(description||title)){
  const previous=actions.at(-1)
  let task=single(part)
  if(!task&&previous&&/\b(?:lo|la|los|las|sus trabajos)\s+(?:present\w*|expon\w*)\b/.test(part))task={...previous,mode:'oral',actions:undefined,...modes.oral,requirementText:affirmativeScopedEnglishTask(part),contextText:englishContextTask(part)}
  if(task)actions.push(task)
 }
 if(actions.length<2)return single(description||title)
 const primary=actions.filter(a=>!['reading','listening'].includes(a.mode)).at(-1)??actions.at(-1)!
 return {...primary,text:affirmativeScopedEnglishTask(description||title),actions}
}
export function thirdGradeEnglishSelections(task:EnglishGradeThreeTask,description:string){
 const discrete=(task.actions??[task]).every(a=>['reading','listening'].includes(a.mode)&&!/\b(?:infer\w*|explic\w*|justific\w*|argument\w*)\b/.test(a.text))
 return {suggestedEvaluationTechnique:task.technique,suggestedInstrumentType:languageInstrumentIntent(description)??(discrete?'lista-cotejo':'rubrica')}
}
const row=(id:string,title:string,levels:NonNullable<ContextualTopicCriterion['progressionLevels']>,weight=4):ContextualTopicCriterion=>({templateId:`ing-3-${id}`,title,observable:levels[0],progressionLevels:levels,weight})
export function thirdGradeEnglishCriteria(task:EnglishGradeThreeTask):ContextualTopicCriterion[]{
 if(task.actions){
  const rows:ContextualTopicCriterion[]=[],seen=new Set<string>()
  for(const [index,action] of task.actions.entries())for(const criterion of thirdGradeEnglishCriteria(action)){
   const key=JSON.stringify(criterion);if(seen.has(key))continue;seen.add(key)
   rows.push(rows.some(r=>r.templateId===criterion.templateId)?{...criterion,templateId:`${criterion.templateId}:${action.mode}:${index+1}`}:criterion)
  }
  return rows
 }
 const {text,mode}=task,receptive=['reading','listening','analysis','comparison','research'].includes(mode),source=mode==='listening'?'mensaje escuchado':'texto disponible'
 const rows=task.functions.map(id=>{
  switch(id){
   case 'explanations':{
    const requesting=/solicit\w*|pedir\w*|pid\w*/.test(text),offering=/ofrec\w*|explic\w* (?:los )?motivos/.test(text)
    const target=requesting&&offering?'la petición y la explicación':requesting?'la petición de explicación':'la explicación'
    return row(id,'Motivos relacionados con el hecho o decisión',[
     receptive?`Relaciona en el ${source} en inglés el motivo comunicado con el hecho o decisión que explica.`:`Formula en inglés ${target}, vinculando el motivo con el hecho o decisión de la situación dada.`,
     'El motivo y el hecho se relacionan; una referencia de la explicación necesita precisión.',
     'Menciona el hecho y un motivo aislado, pero deja sin aclarar la relación entre ambos.',
     'Atribuye al hecho un motivo incompatible con la situación proporcionada.',
     'No se reconoce una petición o explicación relacionada con el hecho o decisión indicados.',
    ])
   }
   case 'opinion':{
    const reason=/\b(?:razon|razones|sustent\w*|justific\w*)\b/.test(text)
    return row(id,'Punto de vista comunicado',[
     receptive?`Distingue la opinión expresada en el ${source} en inglés de los hechos${reason?' y la relaciona con la razón que la sustenta':''}.`:`Expresa en inglés su opinión sobre la situación dada${reason?' y la relaciona con la razón solicitada que la sustenta':''}.`,
     'El punto de vista se comprende; una referencia a la situación necesita precisión.',
     'Aporta expresiones de opinión aisladas, pero deja poco claro el punto de vista sobre la situación.',
     'Presenta como hecho una opinión o expresa un punto de vista incompatible con la información dada.',
     'No se reconoce un punto de vista relacionado con la situación solicitada.',
    ])
   }
   case 'suggestion':return row(id,'Sugerencia pertinente para la situación',[
    receptive?`Relaciona la sugerencia del ${source} en inglés con el problema o situación al que responde.`:'Comunica en inglés una sugerencia relacionada con el problema o situación proporcionados, distinguiéndola de una obligación.',
    'La sugerencia responde a la situación; una acción propuesta necesita precisión.',
    'Menciona una acción posible sin relacionarla claramente con el problema planteado.',
    'La sugerencia contradice las condiciones del problema o se comunica como una obligación diferente.',
    'No se reconoce una sugerencia relacionada con la situación indicada.',
   ])
   case 'prohibition':return row(id,'Prohibición vinculada con la norma dada',[
    receptive?`Identifica la acción prohibida en el ${source} en inglés y la relaciona con la norma dada.`:'Comunica en inglés qué acción se prohíbe según la norma dada, distinguiendo la prohibición de un permiso o una recomendación.',
    'La acción prohibida se reconoce; una referencia a la norma necesita precisión.',
    'Menciona una norma, pero deja ambiguo qué acción está prohibida.',
    'Comunica como permitida la acción prohibida o cambia la norma proporcionada.',
    'No se reconoce una prohibición relacionada con la norma indicada.',
   ])
   case 'warning':return row(id,'Advertencia relacionada con el riesgo',[
    receptive?`Relaciona la advertencia del ${source} en inglés con el riesgo señalado en la situación.`:'Comunica en inglés una advertencia que permite reconocer el riesgo de la situación proporcionada.',
    'El riesgo se reconoce en la advertencia; una referencia a la situación necesita precisión.',
    'Usa una expresión de alerta, pero deja poco claro el riesgo sobre el que advierte.',
    'La advertencia se refiere a un riesgo incompatible con la situación proporcionada.',
    'No se reconoce una advertencia relacionada con el riesgo indicado.',
   ])
   case 'directions':return row(id,'Indicaciones del recorrido solicitado',[
    receptive?`Relaciona las indicaciones del ${source} en inglés con el recorrido y el lugar señalados.`:'Solicita o comunica en inglés indicaciones que permiten seguir el recorrido hasta el lugar señalado en la situación proporcionada.',
    'Se reconoce el recorrido hacia el lugar; una referencia de orientación necesita precisión.',
    'Menciona referencias aisladas sin enlazarlas para seguir el recorrido indicado.',
    'Las indicaciones cambian el recorrido o conducen a un lugar distinto del señalado.',
    'No se reconocen indicaciones relacionadas con el recorrido solicitado.',
   ])
   case 'instructions':return row(id,'Pasos de las instrucciones solicitadas',[
    receptive?`Relaciona los pasos de las instrucciones del ${source} en inglés con la tarea indicada y su orden.`:'Comunica en inglés los pasos necesarios para realizar la tarea indicada, en un orden que permite seguir las instrucciones.',
    'Los pasos permiten seguir la tarea; una relación entre acciones necesita precisión.',
    'Menciona pasos aislados y deja sin relacionar una acción necesaria para seguir la tarea.',
    'Las instrucciones alteran el orden necesario o cambian la tarea proporcionada.',
    'No se reconocen pasos relacionados con las instrucciones solicitadas.',
   ])
   case 'narrative':return row(id,'Historia y secuencia de acontecimientos',[
    receptive?`Reconstruye los acontecimientos de la historia del ${source} en inglés en una secuencia que conserva sus relaciones.`:'Narra en inglés los acontecimientos de la historia solicitada mediante frases y oraciones enlazadas que permiten seguir su secuencia.',
    'La historia y su secuencia se comprenden; una transición entre acontecimientos necesita precisión.',
    'Comunica acontecimientos aislados y deja sin relacionar una parte de la historia.',
    'Cambia el orden o la relación de los acontecimientos y altera la historia solicitada.',
    'No se reconocen acontecimientos relacionados con la historia indicada.',
   ])
   case 'inference':return row(id,'Conclusión sustentada en las pistas disponibles',[
    `Relaciona las pistas o información del ${source} en inglés con su conclusión sobre lo ocurrido, distinguiendo lo inferido de lo expresamente comunicado.`,
    'La conclusión se apoya en las pistas principales; una relación con la información necesita precisión.',
    'Menciona pistas y una conclusión, pero deja sin explicar cómo se relacionan.',
    'La conclusión contradice las pistas o atribuye a la fuente información que no proporciona.',
    'No aporta una conclusión reconocible relacionada con las pistas disponibles.',
   ])
   case 'prediction':return row(id,'Predicción vinculada con los datos de la situación',[
    receptive?`Relaciona la predicción del ${source} en inglés con los datos disponibles y distingue lo que podría ocurrir de un hecho ya sucedido.`:'Comunica en inglés una predicción sobre lo que podría ocurrir y la relaciona con los datos de la situación proporcionada.',
    'La predicción se relaciona con los datos principales; una referencia al posible resultado necesita precisión.',
    'Menciona un posible resultado sin relacionarlo claramente con los datos de la situación.',
    'Predice un resultado incompatible con los datos o lo presenta como un hecho ya confirmado.',
    'No se reconoce una predicción relacionada con los datos proporcionados.',
   ])
   case 'news':return row(id,'Información del anuncio o noticia',[
    receptive?`Identifica qué se anuncia o qué acontecimiento se comunica en el ${source} en inglés y recupera la información solicitada.`:'Comunica en inglés qué se anuncia o qué acontecimiento se informa, conservando la información de la situación proporcionada.',
    'El anuncio o acontecimiento se reconoce; una referencia de la información necesita precisión.',
    'Menciona información aislada sin establecer qué se anuncia o qué ocurrió.',
    'Cambia el acontecimiento o atribuye al anuncio información incompatible con la situación proporcionada.',
    'No se reconoce un anuncio o noticia relacionado con la situación indicada.',
   ])
   case 'past-present':return row(id,'Contraste entre el pasado y el presente',[
    `Contrasta en inglés los hechos del pasado con la situación presente de los textos o ejemplos proporcionados, señalando los cambios o continuidades solicitados.`,
    'El contraste distingue el antes y el ahora; una relación entre los hechos necesita precisión.',
    'Enumera hechos del pasado y del presente sin establecer claramente sus relaciones.',
    'Confunde el pasado con el presente o atribuye a los textos cambios incompatibles con su información.',
    'No se reconoce un contraste relacionado con los hechos o situaciones proporcionados.',
   ])
  }
 })
 const requirements=task.requirementText??text
 rows.push(...requestedGradeThreeGrammar(requirements).map(f=>gradeThreeGrammarCriterion(f,requirements,mode)))
 rows.push(...requestedGradeThreeLexicon(requirements).map(f=>gradeThreeLexicalCriterion(f,requirements,mode)))
 rows.push(...gradeThreeStrategyCriteria(requirements,mode))
 rows.push(...gradeThreeGenreCriteria(requirements,mode,rows))
 rows.push(...gradeThreeContextCriteria(task.contextText??text,receptive))
 if(mode==='research'){
  const subject=[['tecnologia','la tecnología'],['cienci\\w*','la ciencia'],['medioambiente|medio ambiente','el medioambiente'],['salud','la salud'],['tradiciones','las tradiciones']].filter(([pattern])=>new RegExp(pattern).test(text)).map(([,label])=>label).join(' y ')||'el asunto indicado'
  rows.push(row('research','Información localizada y relacionada con la búsqueda',[
   `Localiza y relaciona información sobre ${subject} en ${/proporcionad\w*|suministrad\w*/.test(text)?'los textos en inglés proporcionados':'las fuentes en inglés consultadas'}${/sistematiz\w*|organiz\w* (?:los )?datos/.test(text)?', organizando los datos según la pregunta de la tarea':', vinculando los datos con la pregunta o finalidad de la investigación'}.`,
   'La información responde a la búsqueda principal; una relación entre los datos y lo consultado necesita precisión.',
   'Recupera datos aislados sin establecer las relaciones necesarias para responder a la búsqueda indicada.',
   'Atribuye a los textos datos incompatibles con la información consultada o con la pregunta de la tarea.',
   'No aporta información reconocible relacionada con los textos consultados y la búsqueda solicitada.',
  ]))
 }
 if(mode==='interaction'||mode==='writing'&&/\b(?:responder\w*|respond\w*|intercambi\w*)\b/.test(requirements))rows.push(row('interaction','Respuesta relacionada con el interlocutor',[
  'Relaciona su intervención en inglés con lo dicho por el interlocutor y aporta información que permite continuar el intercambio.',
  'La intervención corresponde a lo dicho; una referencia requiere aclaración para continuar.',
  'Responde a una parte de la intervención y deja información relevante sin relacionar.',
  'Interpreta otro asunto como objeto de la intervención y responde a una información diferente.',
  'No aporta una intervención reconocible relacionada con lo dicho por el interlocutor.',
 ],3))
 if(!receptive&&mode!=='audiovisual')rows.push(mode==='writing'?row('written','Mensaje escrito enlazado y comprensible',[
  'Enlaza en inglés frases y oraciones con conectores sencillos que permiten seguir la información del mensaje escrito; los errores básicos aislados no impiden comprenderlo.',
  'Las ideas principales se comprenden; una unión entre oraciones necesita revisión.',
  'Se comprenden expresiones aisladas, pero varias relaciones entre ideas quedan ambiguas.',
  'Las relaciones entre las oraciones cambian el sentido de la información que se comunica.',
  'No se reconoce un mensaje escrito relacionado con el propósito solicitado.',
 ],3):row('intelligibility','Mensaje oral enlazado y comprensible',[
  'Comunica en inglés frases y oraciones enlazadas con conectores sencillos que permiten seguir el mensaje oral, con pausas y reformulaciones compatibles con su comprensión.',
  'Las ideas principales se comprenden; una relación entre expresiones requiere aclaración.',
  'Se comprenden expresiones aisladas, pero varias relaciones necesarias para seguir el mensaje quedan ambiguas.',
  'Las expresiones elegidas cambian el sentido de las ideas que se pretende comunicar.',
  'No se reconoce un mensaje oral relacionado con el propósito solicitado con los apoyos acordados.',
 ],3))
 return rows
}
