import {affirmativeLanguageTask} from './language-feature-criteria'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

type Kind='oral'|'writing'|'interaction'|'written-exchange'|'questions'|'claims'|'reading'|'listening'|'revision'|'alternative'|'pending'
export type EnglishPreferencesTask={kind:Kind;like:boolean;dislike:boolean;preference:boolean;contentAlternative:boolean;source:boolean;missing?:string;compare:boolean;reason:boolean;conditions:boolean;options?:string;questionCount?:string;responseAlternatives:boolean;sourceConflict:boolean;noPreference:boolean;note?:string}

function conflictingPreferenceSources(references:string){
 const normalized=references.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase(),byPerson=new Map<string,Set<string>>()
 // A dated or explicitly prioritized source requires its own temporal interpretation.
 const conditions=normalized.match(/condiciones de las fuentes:([^\n]*)/)?.[1]??''
 if(/\b(?:fecha|prioridad|corrige)\b/.test(conditions)&&!/\bno (?:incluyen|tienen|indican)\b/.test(conditions))return false
 for(const block of normalized.split(/(?:^|\n)(?=(?:ficha|tarjeta)\b)/)){
  const person=block.match(/^(?:ficha|tarjeta) de ([a-z ]+):/)?.[1]?.trim()??block.match(/:\s*([a-z]+)\s+(?:enjoys|likes|prefers)\b/)?.[1]
  const choice=block.match(/\b(?:prefers|preferencia:)\s+([^\n.]+)/)?.[1]?.trim()
  if(!person||!choice)continue
  const choices=byPerson.get(person)??new Set<string>();choices.add(choice);byPerson.set(person,choices)
 }
 return [...byPerson.values()].some(choices=>choices.size>1)
}

/** The requested act owns the evidence; an activity named as a choice is not an instruction to perform it. */
export function resolveEnglishPreferencesTask(description:string):EnglishPreferencesTask|null{
 const [assignment,references='']=description.split(/materiales de referencia de la actividad\s*:/i)
 const raw=assignment.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase(),text=affirmativeLanguageTask(assignment)
 if(!/\b(?:gust\w*|prefier\w*|prefer\w*|disfrut\w*|likes?|dislikes?|enjoy\w*)\b/.test(text+' '+references))return null
 const contentAlternative=/\b(?:gusta|gusto)\b[^.;]*\bo\s+(?:(?:cual|que|un[ao]?)\s+)?pref/.test(text)
 const preference=/\b(?:prefier\w*|prefer\w*)\b/.test(text),dislike=/\b(?:no (?:le |les |te |me )?gusta\w*|desagrado|dislikes?)\b/.test(text)
 const like=/\b(?:gusta\w*|gustos?|disfrut\w*|likes?|enjoy\w*)\b/.test(text)
 let kind:Kind
 if(/\bafirmaciones\b/.test(text)&&/\b(?:marca\w*|senal\w*|contrast\w*)\b/.test(text)&&/\bmensajes|textos\b/.test(text))kind='claims'
 else if(/\b(?:revis\w*|corrig\w*|correg\w*)\b/.test(text)&&/\b(?:borrador|oracion|fragmento)\b/.test(text))kind='revision'
 else if(/\b(?:prepara\w*|formula\w*|redacta\w*)\s+(?:\w+\s+)?preguntas\b/.test(text))kind='questions'
 else if(/\b(?:escrib\w*|por escrito)\b/.test(text)&&/\brespond\w*\b/.test(text)&&/\b(?:devuelv\w*|pasar\w*|intercambi\w*)\b/.test(text))kind='written-exchange'
 else if(/\b(?:audio o (?:en )?papel|oral o escrit\w*)\b/.test(text))kind='alternative'
 else if(/\b(?:escucha\w*|listen\w*)\b/.test(text))kind='listening'
 else if(/\b(?:lee|lean|leer\w*|leeran|read\w*)\b/.test(text))kind='reading'
 else if(/\b(?:convers\w*|dialog\w*|intercambi\w* (?:roles|turnos))\b/.test(text))kind='interaction'
 else if(/\b(?:escrib\w*|redact\w*|por escrito|mensaje escrito)\b/.test(text))kind='writing'
 else if(/\b(?:oralmente|oral|audio|graba\w*)\b/.test(text))kind='oral'
 else kind='pending'
 const source=/\b(?:tarjetas?|fichas?|mensajes que|dos mensajes)\b/.test(text)
 const options=raw.match(/\b(?:prefier\w*\s+(?:entre\s+)?|preferencia entre\s+|elegir\s+)([a-z]+\s+(?:o|y)\s+[a-z]+)/)?.[1]
 const responseAlternatives=/\b(?:respuesta|responde\w*)\b/.test(text)&&/\bno tienes? preferencia\b/.test(text)&&/\bno (?:te |le )?gusta ninguna\b/.test(text)
 const sourceConflict=conflictingPreferenceSources(references)
 const note=sourceConflict?'Propuesta provisional: las fuentes atribuyen preferencias distintas a la misma persona. Aclarar qué referencia corresponde antes de exigir una preferencia única, o acordar un mensaje que atribuya expresamente cada información a su ficha sin resolver la discrepancia.':kind==='pending'?'Propuesta provisional: acordar producto, modalidad, datos sobre gustos o preferencias y fase que se evaluará antes de calificar. La consigna no acredita todavía una actuación concreta.':undefined
 return {kind,like,dislike,preference,contentAlternative,source,sourceConflict,responseAlternatives,noPreference:/\b(?:no tiene\w* preferencia|don.t have a preference)\b/i.test(raw+' '+references),questionCount:raw.match(/\b(\d+|dos|tres|cuatro) preguntas\b/)?.[1],missing:/\bnot stated\b/.test(raw)?'not stated':undefined,compare:/\b(?:coinciden|distintas|diferentes)\b/.test(text),reason:/\b(?:razon|justific\w*)\b/.test(text),conditions:/\bcondiciones\b/.test(text)&&/\bsilencio\b/.test(text)&&/\bmateriales|libros|hojas|lapices\b/.test(text),options,note}
}

const row=(id:string,title:string,levels:ContextualTopicCriterion['progressionLevels'],weight=4):ContextualTopicCriterion=>({templateId:id==='meaning'?'ing-1-preferences':id==='clarity'?'ing-1-intelligibility':`ing-1-preferences-${id}`,title,observable:levels[0],progressionLevels:levels,fourLevelLowest:`${levels[3]} O bien: ${levels[4]}`,weight})
export function englishPreferencesCriteria(task:EnglishPreferencesTask):ContextualTopicCriterion[]{
 const {kind}=task,rows:ContextualTopicCriterion[]=[]
 if(task.sourceConflict)return [row('sources','Fidelidad a fuentes pendientes de aclaración',[
  'Una vez aclarada la referencia, comunica la preferencia correspondiente; si se acuerda un mensaje provisional, atribuye cada preferencia a su ficha y conserva expresamente la discrepancia sin inventar cuál es vigente.',
  'Con la referencia o el mensaje provisional acordados, conserva la información; una atribución puntual necesita precisión.',
  'Conserva parte de la información, pero deja incompleta la atribución de cada preferencia a su fuente.',
  'Resuelve arbitrariamente la discrepancia, inventa un cambio de opinión o confunde gustos coincidentes con ausencia de preferencia.',
  'Después de aclarar o acordar cómo comunicar la discrepancia, no aporta un mensaje contrastable con las fuentes.',
 ])]
 if(kind==='claims')return [row('claims','Correspondencia entre afirmaciones y mensajes',[
  'Distingue qué afirmaciones coinciden y cuáles contradicen los mensajes, conservando personaje, gusto, preferencia y ausencia explícita de preferencia; no convierte la opción no preferida en desagrado.',
  'Decide correctamente la correspondencia en conjunto; una decisión puntual necesita corrección.',
  'Distingue algunas afirmaciones, pero confunde u omite varias relaciones con los mensajes.',
  'La mayoría de las decisiones cambia referente o significado, incluyendo atribuir una preferencia donde la fuente indica que no la tiene.',
  'No aporta decisiones reconocibles sobre la correspondencia de las afirmaciones.',
 ]),row('support','Sustento de cada decisión',[
  'Señala los fragmentos de los mensajes que sustentan cada decisión; utiliza ambos mensajes cuando la afirmación se refiere a las dos personas.',
  'El sustento corresponde a las decisiones; un fragmento necesita precisarse o completarse.',
  'Señala fragmentos pertinentes para algunas decisiones, pero deja otras sin sustento suficiente.',
  'Los fragmentos señalados no sostienen las decisiones o pertenecen a otro referente.',
  'No señala evidencia textual que permita contrastar las decisiones.',
 ],3)]
 if(kind==='questions')return [row('questions','Preguntas preparadas con propósito definido',[
  `Prepara en inglés ${task.questionCount??'las'} preguntas: una permite saber qué actividades gustan o se disfrutan y otra pregunta por la preferencia${task.options?' entre '+task.options.replace(/ o /,' y '):''}; se evalúan las preguntas escritas disponibles hoy, no las respuestas futuras.`,
  'Las preguntas conservan las dos intenciones y las opciones pedidas; una formulación necesita precisión.',
  'Una pregunta cumple su propósito, pero la otra repite esa intención o deja sin precisar qué información solicita.',
  'Las preguntas solicitan información distinta de los gustos y preferencias previstos.',
  'No aporta preguntas comprensibles que permitan solicitar la información prevista.',
 ])]
 if(task.responseAlternatives)return [row('response','Respuesta elegida en su contexto',[
  'Comunica una de las alternativas autorizadas: preferencia por una opción, ausencia de preferencia o desagrado por ambas. La respuesta se comprende junto con la pregunta dada; admite expresiones breves o elípticas equivalentes sin favorecer una elección.',
  'La alternativa elegida se reconoce en contexto; una expresión puntual necesita precisión.',
  'Menciona una opción o que ambas gustan, pero deja sin aclarar cuál de los significados autorizados quiere comunicar.',
  'La respuesta comunica un significado contrario al pretendido o confunde ausencia de preferencia con desagrado por ambas opciones.',
  'No aporta una respuesta reconocible respecto de la pregunta dada.',
 ])]
 if(kind==='pending')return [row('pending','Contenido acordado para la preparación',[
  'Una vez acordados el producto, la modalidad, los datos y la fase, comunica en inglés el gusto o la preferencia que corresponda a esa tarea.',
  'Con la tarea definida, se reconoce el contenido acordado; una referencia puntual necesita precisión.',
  'Con la tarea definida, se reconoce parte del contenido, pero queda incompleta la relación entre persona y actividad.',
  'Tras definir la tarea, la evidencia cambia el gusto o la preferencia que se pretende comunicar.',
  'Después de definir la tarea y ofrecer los apoyos acordados, no aporta evidencia reconocible del contenido convenido.',
 ])]
 if(kind==='revision')return [row('revision','Revisión de la preferencia indicada',[
  'Corrige únicamente la oración sobre la preferencia del personaje, según su tarjeta, y contrasta la versión revisada con el borrador; distingue preferir de que algo le guste.',
  'La oración revisada comunica la preferencia de la tarjeta; una expresión deja una relación puntual ambigua.',
  'Modifica la oración, pero solo expresa un gusto o deja sin precisar qué actividad prefiere el personaje.',
  'La revisión invierte la preferencia o la atribuye a otra persona, contradiciendo la tarjeta.',
  'No aporta una revisión reconocible de la oración autorizada frente al borrador.',
 ]),row('preservation','Conservación del resto del mensaje',[
  'Conserva exactamente las otras oraciones del mensaje; el borrador y la versión revisada permiten comprobar que solo cambió el fragmento autorizado.',
  'Conserva el sentido y los datos de las otras oraciones, pero un cambio formal fuera del fragmento necesita revertirse.',
  'Mantiene el sentido de las otras oraciones, pero deja varios cambios formales fuera del fragmento autorizado.',
  'Cambia datos o sentido de otras oraciones que debían conservarse.',
  'No ofrece las dos versiones necesarias para comprobar la conservación.',
 ],3)]
 if(kind==='reading'||kind==='listening'){
  const source=kind==='listening'?'mensaje escuchado':'texto leído',meanings=task.dislike?'gusto, desagrado y preferencia':'gusto y preferencia'
  rows.push(row('reception','Información de cada personaje',[
   `Relaciona las actividades con el personaje y el significado correspondiente —${meanings}— según el ${source} en inglés, sin atribuir desagrado a una opción solo porque no sea la preferida.`,
   'Conserva las relaciones entre personajes, actividades y significados; una asociación puntual queda ambigua o incorrecta.',
   'Reconoce algunas asociaciones, pero mezcla u omite varias relaciones entre actividades, personajes o significados.',
   'La mayoría de las asociaciones cambia la persona, invierte el gusto o confunde preferencia con desagrado.',
   'No aporta asociaciones reconocibles entre personajes y actividades a partir de la fuente.',
  ]))
  if(task.missing)rows.push(row('missing','Información que no aparece',[
   `Distingue la información presente de la ausente en el ${source} y marca con ${task.missing} los campos cuyo dato no aparece, sin inventar una preferencia a partir del orden o del gusto expresado.`,
   'Reconoce qué información falta; la marca de un campo necesita corrección.',
   'Identifica algunas ausencias, pero deja varios campos sin distinguir entre información expresada y no proporcionada.',
   'Rellena de forma generalizada los datos ausentes con gustos, desagrados o preferencias no expresados en la fuente.',
   'No aporta evidencia que distinga los datos presentes de los ausentes.',
  ],3))
  return rows
 }
 if(kind==='interaction'||kind==='written-exchange')rows.push(row('exchange','Preguntar y responder en el intercambio',[
  `Cada participante pregunta en inglés por la preferencia del otro y responde a la pregunta recibida según su tarjeta, manteniendo la correspondencia entre pregunta, personaje y respuesta${task.noPreference?'; admite la ausencia de preferencia explícita, sin confundirla con desagrado':''}.`,
  'Cada participante pregunta y responde de manera relacionada; una referencia puntual requiere aclaración.',
  'Solo pregunta o responde, o las intervenciones dejan sin aclarar parte de la preferencia solicitada.',
  'Las respuestas no corresponden a las preguntas o cambian la preferencia de la tarjeta.',
  'No aporta intervenciones reconocibles que permitan comprobar pregunta y respuesta en el intercambio.',
 ]))
 else if(task.dislike)rows.push(row('polarity','Gusto y desagrado de cada personaje',[
  'Comunica en el audio en inglés el gusto y el desagrado de cada personaje de la ficha, conservando todas las asociaciones entre persona, actividad y polaridad afirmativa o negativa.',
  'Comunica los datos de cada personaje; una asociación o negación puntual queda ambigua o necesita corrección.',
  'Comunica algunos datos, pero omite o confunde varios gustos, desagrados o referentes.',
  'La mayoría de las asociaciones intercambia personajes, actividades o polaridad y contradice la ficha.',
  'No aporta asociaciones reconocibles de gusto y desagrado de los personajes indicados.',
 ]))
 else{
  const target=task.contentAlternative?`un gusto o una preferencia${task.options?' entre '+task.options.replace(/ o /,' y '):''}, según la opción elegida`:task.preference?`${task.like?'el gusto y ':''}la preferencia${task.options?' entre '+task.options.replace(/ o /,' y '):''}`:'una actividad que le gusta a la persona o personaje elegido'
  rows.push(row('meaning','Significado de la elección',[
   `Comunica en inglés ${target}${task.source?' conservando la información de la referencia indicada':''}${kind==='alternative'?'; hoy se evalúa el mensaje preparado en audio o en papel, sin exigir ambos medios':kind==='oral'?' mediante el mensaje oral':' en el mensaje escrito'}.`,
   'Se reconoce la persona y su elección; una expresión deja una referencia puntual ambigua.',
   task.preference&&!task.contentAlternative?'Expresa solo un gusto o menciona una actividad sin establecer la preferencia requerida.':'Menciona una actividad, pero no queda clara su relación con el gusto o la preferencia que se desea comunicar.',
   'Invierte la elección o la atribuye a otra persona, cambiando el significado previsto.',
   task.preference&&!task.contentAlternative?'No aporta una elección reconocible que permita valorar la preferencia solicitada.':'No aporta un gusto o una preferencia reconocible en la evidencia solicitada.',
  ]))
 }
 if(kind==='written-exchange')rows.push(row('record','Notas vinculadas del intercambio',[
  'Devuelve cada respuesta a quien preguntó y conserva las preguntas con sus respuestas escritas, vinculadas al personaje correspondiente; responde sin descalificar una elección distinta o la ausencia de preferencia.',
  'Conserva la correspondencia de las notas; precisa un vínculo o repara expresamente una descalificación puntual.',
  'Conserva solo algunos pares de notas o deja incompleta la reparación de una descalificación.',
  'Las notas no permiten relacionar preguntas y respuestas, o mantiene la descalificación de una elección diferente.',
  'No ofrece notas que permitan comprobar el intercambio escrito realizado.',
 ],3))
 if(task.compare)rows.push(row('comparison','Coincidencias y diferencias',[
  'Comenta si las elecciones expresadas coinciden o son distintas, sin descalificar la preferencia de la otra persona ni exigir que cambie para llegar a un acuerdo.',
  'Reconoce la coincidencia o diferencia; precisa una referencia o repara una descalificación puntual, reconociendo la legitimidad de la elección ajena.',
  'Menciona ambas elecciones, pero deja incompleta la comparación o la reparación de una expresión descalificadora.',
  'Presenta elecciones distintas como iguales, atribuye otra elección a alguien o mantiene la descalificación de una preferencia diferente.',
  'No aporta una comparación reconocible entre las elecciones expresadas.',
 ],3))
 if(task.reason)rows.push(row('reason','Razón de la preferencia',[
  `Expresa una razón sencilla relacionada con la preferencia${task.conditions?' y con el silencio o los materiales disponibles, sin contradecir las condiciones de la actividad':''}; se admiten formulaciones equivalentes en inglés.`,
  'La razón se relaciona con la preferencia y las condiciones solicitadas; una relación puntual necesita precisión.',
  'Da una razón, pero deja sin establecer su relación con la preferencia o con las condiciones solicitadas.',
  'La razón contradice la elección o las condiciones expresas de la actividad.',
  'No aporta una razón reconocible para la preferencia.',
 ],3))
 rows.push(row('clarity','Mensaje comprensible en inglés',[
  `Permite reconocer la persona, la actividad y el sentido de la elección mediante expresiones breves en inglés${kind==='alternative'?', en audio o en papel según el medio elegido':''}; admite apoyos y reformulaciones acordados${kind==='oral'||kind==='interaction'?', incluidas pausas':''}.`,
  'El mensaje se comprende en conjunto; una expresión deja una referencia puntual ambigua.',
  'Se comprenden expresiones aisladas, pero varias referencias impiden relacionar la persona con su elección.',
  'Las expresiones empleadas cambian la persona, la actividad o el sentido de la elección.',
  'No aporta un mensaje reconocible en inglés con los apoyos acordados.',
 ],2))
 return rows
}
