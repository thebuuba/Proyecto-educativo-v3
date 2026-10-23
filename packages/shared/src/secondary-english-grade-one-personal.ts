import {affirmativeLanguageTask} from './language-feature-criteria'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentRecommendation} from './instrument-recommendation'

export function markEnglishTaskProvisional(proposal:InstrumentRecommendation,note?:string):InstrumentRecommendation{
 if(!note)return proposal
 return {...proposal,teacherReviewNotes:[note],confidence:'LOW',selectedCurriculumElements:[],internalTrace:{...proposal.internalTrace,lowCurriculumConfidence:true,mappingStatus:'UNMAPPED',reasons:[...proposal.internalTrace.reasons,note]}}
}

type Kind='oral'|'interaction'|'written-exchange'|'preparation'|'revision'|'alternative'|'clarification'|'reading'|'listening'|'presentation-pending'|'form-pending'
export type EnglishPersonalTask={kind:Kind;fields:string[];asked:string[];offered:string[];preserved:string[];source:string;missing?:string;quantity?:string;questionCount?:string;record:boolean;roles:boolean;note?:string}
const fieldPatterns=[['nombre','nombre|name'],['edad','edad|age'],['país','pais|country'],['ciudad','ciudad|city'],['nacionalidad','nacionalidad|nationality'],['ocupación','ocupacion|occupation']] as const
const fieldsIn=(text:string)=>fieldPatterns.filter(([,pattern])=>new RegExp(`\\b(?:${pattern})\\b`).test(text)).map(([label])=>label)
const list=(items:string[])=>items.length?items.length===1?items[0]:items.slice(0,-1).join(', ')+' y '+items.at(-1):'los datos solicitados'

/** The current requested act owns the evidence. A future interview, a supplied
 * profile or an alternative medium cannot become an additional performance. */
export function resolveEnglishPersonalTask(description:string):EnglishPersonalTask|null{
 const raw=description.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
 const text=affirmativeLanguageTask(description)
 const fields=fieldsIn(text)
 if(!/\b(?:persona\w*|personaje\w*|visitante\w*|perfil|tarjetas?|presentaciones?|nombre|name)\b/.test(text)&&fields.length<2)return null
 if(!fields.length&&!/\b(?:presentacion personal|informacion personal|datos personales|datos.*ficha de inscripcion)\b/.test(text))return null
 const revision=/\b(?:revis\w*|corrig\w*|corrij\w*)\b/.test(text)&&/\b(?:unicamente|exclusivamente|solo)\b/.test(text)&&/\b(?:pregunta|respuesta)\b/.test(text)
 const alternative=/\b(?:audio|nota de voz|oral)\b[^.;]*\bo\b[^.;]*\b(?:papel|hoja|escrito|mensaje)\b/.test(text)
 const prep=/\b(?:solo|solamente|unicamente) (?:las |tres |\d+ )?preguntas\b/.test(text)&&/\b(?:prepar\w*|redact\w*|escrib\w*|entreg\w*)\b/.test(text)
 const written=/\b(?:escrib\w*|escrit\w*|redact\w*|papel|hoja|mensajes)\b/.test(text)
 const exchange=/\b(?:pregunt\w*|averigu\w*|entrevist\w*)\b/.test(text)&&/\b(?:respond\w*|respon\w*)\b/.test(text)&&/\b(?:parejas|intercambi\w*|entrevistense|dialog\w*|convers\w*)\b/.test(text)
 const clarification=/\b(?:aclar\w*|confirm\w*)\b/.test(text)&&/\b(?:residencia|vive\w*)\b/.test(text)&&/\b(?:viene|origen)\b/.test(text)
 let kind:Kind|undefined
 if(revision)kind='revision'
 else if(alternative)kind='alternative'
 else if(prep)kind='preparation'
 else if(clarification)kind='clarification'
 else if(exchange)kind=written?'written-exchange':'interaction'
 else if(/\bescuch\w*\b/.test(text))kind='listening'
 else if(/\b(?:lee|lean|leen|leer\w*|lectura)\b/.test(text))kind='reading'
 else if(/\b(?:oralmente|oral)\b/.test(text)&&/\b(?:present\w*|comunic\w*|di|digan)\b/.test(text))kind='oral'
 else if(/\bpresentacion personal\b/.test(text)&&/\bprepar\w*\b/.test(text))kind='presentation-pending'
 else if(/\bcomplet\w*\b/.test(text)&&/\bficha de inscripcion\b/.test(text))kind='form-pending'
 if(!kind)return null
 const preservedText=text.match(/\b(?:conserv\w*|manten\w*|manteng\w*)\b(.+)/)?.[1]??''
 const focus=revision?text.split(/\b(?:conserv\w*|manten\w*|manteng\w*)\b/)[0]:text
 const focusedFields:string[]=fieldsIn(focus).filter(field=>!(field==='nombre'&&/\bnombre\w* ya impres\w*\b/.test(focus)))
 if(revision&&/\bciudad donde vive\w*\b/.test(focus))focusedFields.splice(focusedFields.indexOf('ciudad'),1,'ciudad de residencia')
 const askedText=kind==='alternative'?text.match(/\bpregunt\w*\b(.+?)(?=\. |puedes|entrega|$)/)?.[1]??'':focus
 const offeredText=kind==='alternative'?text.split(/\bpregunt\w*\b/)[0]:focus
 const source=/\btarjetas?\b/.test(text)?'la tarjeta del personaje':/\bperfil\b/.test(text)?'el perfil ficticio entregado':kind==='listening'?'el mensaje escuchado':kind==='reading'?'el texto leído':'los datos elegidos para el personaje'
 const missing=/\bnot stated\b/.test(raw)?'not stated':/\bnot given\b/.test(raw)?'not given':/\bguion\b/.test(raw)?'un guion':undefined
 const quantity=text.match(/\b(\d+|dos|tres|cuatro) datos\b/)?.[1]
 const questionCount=text.match(/\b(\d+|una|dos|tres|cuatro|cinco) preguntas?\b/)?.[1]
 const note=kind==='presentation-pending'?'Propuesta provisional: falta precisar modalidad, producto de preparación y datos previstos. Pueden ser ficticios; no se requieren datos privados reales. No acredita una presentación realizada.':kind==='form-pending'?'Propuesta provisional: falta precisar los campos y la fuente de los datos. Completar la ficha no acredita lectura, escucha ni intercambio. Valorar la fidelidad solo cuando esté disponible la referencia.':undefined
 return {kind,fields:focusedFields,asked:fieldsIn(askedText),offered:fieldsIn(offeredText),preserved:fieldsIn(preservedText),source,missing,quantity,questionCount,record:/\b(?:conserv\w*.*preguntas.*respuestas|registr\w*)\b/.test(text),roles:/\bcambien de papel\b/.test(text),note}
}

const row=(id:string,title:string,levels:ContextualTopicCriterion['progressionLevels'],weight=4):ContextualTopicCriterion=>({templateId:`ing-1-${id}`,title,observable:levels[0],progressionLevels:levels,fourLevelLowest:`${levels[3]} O bien: ${levels[4]}`,weight})
const clarity=(medium:string,questions=true)=>row('intelligibility','Mensaje comprensible',[
 `Permite comprender los datos${questions?' y las preguntas':''} del mensaje ${medium} en inglés mediante expresiones breves; se admiten reformulaciones y apoyos acordados${medium==='oral'?', incluidas pausas':''}.`,
 'El mensaje se comprende en conjunto; una expresión deja una referencia puntual ambigua.',
 'Se reconocen expresiones aisladas, pero varias referencias impiden relacionar los datos con lo solicitado.',
 `Las expresiones elegidas cambian el sentido de los datos${questions?' o preguntas':''} que se quieren comunicar.`,
 'No se aporta un mensaje reconocible en inglés con los apoyos acordados.',
],3)

export function englishPersonalCriteria(task:EnglishPersonalTask):ContextualTopicCriterion[]{
 const {kind,source}=task,fields=list(task.fields),rows:ContextualTopicCriterion[]=[]
 if(kind==='presentation-pending')return [row('personal','Datos previstos para la presentación',[
  'En la evidencia de preparación acordada, comunica en inglés los datos seleccionados para la presentación, que pueden ser ficticios.',
  'Se reconocen los datos seleccionados; una referencia necesita precisión.',
  'Solo parte de los datos seleccionados resulta reconocible en la evidencia de preparación.',
  'La preparación confunde los datos y cambia la información que se pretende comunicar.',
  'Tras definir la tarea y ofrecer los apoyos acordados, no se aporta evidencia reconocible de los datos seleccionados.',
 ]),clarity('en la modalidad que se acuerde',false)]
 if(kind==='form-pending')return [row('personal-fields','Datos y campos correspondientes',[
  'Una vez definidos los campos, coloca cada dato en el campo y visitante correspondientes de la ficha en inglés.',
  'Los datos se relacionan con su campo y visitante; una asociación puntual queda ambigua o incorrecta.',
  'Relaciona algunos datos con sus campos, pero confunde u omite varias asociaciones.',
  'La mayoría de los datos queda mezclada entre campos o visitantes, cambiando la información registrada.',
  'Tras definir los campos y ofrecer la referencia, no aporta asociaciones reconocibles.',
 ]),row('personal-source','Fidelidad a la referencia disponible',[
  'Cuando esté disponible la referencia acordada, registra los datos de la ficha conservando su significado y sin inventarlos.',
  'Conserva el significado de los datos en conjunto; un error puntual de transcripción o de contenido necesita corrección.',
  'Conserva algunos datos, pero cambia u omite varios de los disponibles.',
  'La mayoría de los datos añadidos o cambiados contradice la referencia disponible.',
  'Con la referencia disponible y los apoyos acordados, no aporta datos contrastables.',
 ])]
 if(kind==='reading'||kind==='listening'){
  rows.push(row('personal','Información de cada persona',[
   `Relaciona ${fields} con la persona y los campos correspondientes según ${source} en inglés, sin mezclar datos entre personajes.`,
   'Relaciona los datos con cada persona y campo; una asociación puntual queda ambigua o incorrecta, sin deshacer las demás relaciones.',
   'Relaciona algunos datos, pero confunde u omite varias asociaciones entre datos y personas.',
   'La confusión es generalizada: la mayoría de los datos se atribuye a otra persona o contradice la fuente.',
   'No aporta asociaciones reconocibles entre datos, campos y personas a partir de la fuente.',
  ]))
  if(task.missing)rows.push(row('personal-missing','Información no proporcionada',[
   `Distingue los datos presentes de los ausentes en ${source} y marca los campos sin información con ${task.missing}, sin inferir país o nacionalidad por el nombre o la ciudad.`,
   'Distingue lo presente de lo ausente; la marca de ausencia de un campo necesita corrección.',
   'Reconoce algunas ausencias, pero deja varios campos sin distinguir entre dato disponible y dato omitido.',
   'Completa de forma generalizada los campos ausentes con datos inventados o incompatibles con la fuente.',
   'No aporta evidencia de distinguir los datos presentes de los ausentes.',
  ],3))
  return rows
 }
 if(kind==='revision')return [row('personal-revision','Revisión del fragmento autorizado',[
  `Revisa la pregunta y la respuesta sobre ${fields} para que pidan y comuniquen correctamente ese dato en inglés según ${source}; contrasta el cambio con el borrador.`,
  'La pregunta y la respuesta corresponden al dato de la fuente; una expresión del fragmento todavía necesita precisión.',
  'Corrige solo la pregunta o la respuesta y deja sin resolver su correspondencia con el dato de la fuente.',
  'La revisión cambia el dato o hace que la pregunta y la respuesta se refieran a información distinta.',
  'No aporta una revisión reconocible del fragmento autorizado frente al borrador.',
 ]),row('personal-preservation','Conservación del resto del borrador',[
  `Conserva exactamente ${list(task.preserved)} y el resto del mensaje fuera del fragmento autorizado, comparando con el borrador.`,
  'Mantiene los datos y el sentido del resto del mensaje; un cambio formal ajeno al fragmento debe revertirse.',
  'Introduce cambios formales fuera del fragmento autorizado, sin alterar datos ni sentido, y deja varios sin revertir.',
  'La revisión altera datos o sentido de otras partes del borrador que debían conservarse.',
  'No ofrece una versión que permita comprobar la conservación del resto del borrador.',
 ],3)]
 if(kind==='preparation')return [row('personal-questions','Preguntas preparatorias',[
  `En la preparación escrita, formula en inglés ${task.questionCount?task.questionCount+' ':''}preguntas que solicitan ${fields}; se evalúan las preguntas disponibles hoy, sin exigir respuestas de una entrevista futura.`,
  `Las preguntas permiten reconocer todos los datos solicitados${task.questionCount?' y respetan la cantidad pedida':''}; una formulación necesita precisión.`,
  `Las preguntas permiten solicitar algunos datos, pero otras omiten el dato o no dejan claro qué se pregunta${task.questionCount?', o la cantidad de preguntas no corresponde a la pedida':''}.`,
  'Las preguntas solicitan información distinta de los datos previstos.',
  'No aporta preguntas comprensibles sobre los datos previstos.',
 ])]
 if(kind==='clarification'){
  rows.push(row('personal-clarification','Origen y residencia diferenciados',[
   `Distingue origen y residencia en el mensaje escuchado, formula en inglés una pregunta para aclarar dónde vive el visitante y confirma el dato${task.record?' y registra la ciudad de residencia':''}.`,
   'Distingue las dos ciudades y aclara la residencia; una parte de la confirmación o del registro solicitado necesita precisión.',
   'Reconoce las dos ciudades, pero no aclara cuál corresponde a la residencia o deja sin confirmar el dato.',
   'Confunde origen y residencia y confirma o registra como residencia la ciudad de origen.',
   'No aporta evidencia de aclarar cuál es la ciudad de residencia.',
  ]))
  rows.push(row('personal','Datos del visitante',[
   `Como visitante, comunica en inglés la ciudad de origen y la ciudad de residencia según ${source}, y responde a la aclaración${task.roles?'; al cambiar de papel, cada participante muestra ambas actuaciones':''}.`,
   'Comunica las dos ciudades y responde a la aclaración; una referencia puntual queda ambigua.',
   'Comunica solo una ciudad o responde sin distinguir suficientemente los dos datos.',
   'Intercambia las ciudades o responde con información incompatible con la tarjeta.',
   'No aporta datos reconocibles sobre origen y residencia en su papel de visitante.',
  ]))
 }else if(kind==='alternative'){
  rows.push(row('personal','Respuesta y solicitud de información',[
   `Comunica ${list(task.offered)} según ${source} y formula una pregunta sobre ${list(task.asked)} del destinatario, en audio o mensaje escrito en papel, sin exigir envío ni respuesta posterior.`,
   'La respuesta y la pregunta comunican los datos pedidos; una referencia puntual necesita precisión.',
   'La respuesta comunica parte de lo pedido o la pregunta no permite reconocer el dato solicitado al destinatario.',
   'La respuesta cambia los datos del perfil o la pregunta solicita información distinta de la prevista.',
   'No aporta una respuesta ni una pregunta reconocibles sobre la información solicitada.',
  ]))
 }else if(kind==='written-exchange'){
  rows.push(row('personal','Preguntas y respuestas escritas',[
   `Solicita por escrito en inglés ${task.quantity?task.quantity+' datos':'los datos'} personales todavía desconocidos y responde a las preguntas recibidas según ${source}${task.record?'; conserva las preguntas y las respuestas':''}.`,
   'Las preguntas solicitan la información prevista y las respuestas se ajustan a la tarjeta; una relación puntual necesita precisión.',
   'Solicita o responde solo parte de los datos previstos, o deja incompleta la evidencia escrita del intercambio.',
   'Las preguntas no solicitan los datos desconocidos o las respuestas contradicen la tarjeta.',
   'No aporta preguntas y respuestas escritas reconocibles para el intercambio solicitado.',
  ]))
 }else rows.push(row('personal','Información personal solicitada',[
  kind==='interaction'?`Cada participante pregunta y responde en inglés sobre ${fields} del personaje según ${source}, vinculando cada respuesta con el dato solicitado.`:`Presenta oralmente en inglés al personaje u otra persona indicada comunicando ${fields} según ${source}.`,
  kind==='interaction'?'Se reconocen las preguntas y respuestas sobre los datos solicitados; una referencia puntual queda ambigua o incorrecta.':'Se reconocen los datos solicitados y su relación con la persona; una referencia puntual queda ambigua o incorrecta.',
  kind==='interaction'?'Solicita o responde solo parte de los datos, o confunde varios; hay información reconocible, pero no completa ambos actos.':'Se reconocen algunos datos, pero otros se confunden, quedan incompletos o no corresponden a lo solicitado.',
  'La confusión generalizada entre datos o personas impide reconocer la información que se pretende comunicar.',
  'No aporta datos reconocibles de la persona o personaje indicado.',
 ]))
 if(kind==='interaction'||kind==='written-exchange')rows.push(row('interaction','Correspondencia entre intervenciones',[
  `Relaciona cada respuesta con la pregunta recibida y permite intervenir al compañero sin burlas ni descalificaciones en el intercambio${kind==='written-exchange'?' escrito':' oral'} en inglés, usando aclaraciones o reformulaciones cuando las necesita.`,
  'Las intervenciones se relacionan y ambos pueden participar; una referencia queda ambigua o una interrupción o descalificación puntual se repara.',
  'Responde a algunas preguntas, pero otras quedan sin respuesta relacionada, o interrumpe reiteradamente sin reparar y recorta las intervenciones del compañero, o mantiene una descalificación sin reparar aunque el compañero aún puede participar.',
  'Las respuestas cambian el sentido de las preguntas de forma generalizada o las descalificaciones impiden participar al compañero.',
  'No aporta respuestas reconocibles a las preguntas del interlocutor.',
 ],3))
 if(kind==='oral'){
  const keys:Record<string,string>={nombre:'name',edad:'age',país:'country',ciudad:'city',nacionalidad:'nationality',ocupación:'occupation'}
  rows[0].checklistParts=task.fields.map(field=>{
   const levels:ContextualTopicCriterion['progressionLevels']=[
    `Presenta oralmente en inglés el dato de ${field} de la persona o personaje indicado según ${source}, de forma comprensible.`,
    `Se reconoce el dato de ${field}; una expresión deja una referencia puntual ambigua.`,
    `Comunica parte del dato de ${field}, pero deja incompleta su relación con la persona indicada.`,
    `Atribuye el dato de ${field} a otra persona o cambia la información que pretende comunicar.`,
    `No aporta información reconocible sobre ${field} de la persona o personaje indicado.`,
   ]
   return {key:keys[field]??field,observable:levels[0],progressionLevels:levels,fourLevelLowest:`${levels[3]} O bien: ${levels[4]}`}
  })
 }
 rows.push(clarity(kind==='alternative'?'oral o escrito, según la única modalidad elegida':kind==='written-exchange'?'escrito':'oral',kind!=='oral'))
 return rows
}
