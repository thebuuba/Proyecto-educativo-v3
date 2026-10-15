import type {ContextualTopicCriterion} from './secondary-topic-criteria'
export type Strategy={id:string;match:string;modes:string[];title:string;levels:NonNullable<ContextualTopicCriterion['progressionLevels']>}
const receptive=['reading','listening'],productive=['writing','oral','interaction']
const strategy=(id:string,match:string,modes:string[],title:string,levels:Strategy['levels']):Strategy=>({id,match,modes,title,levels})
/** Observable language-learning procedures, PDF135–136; anxiety and personal traits are not scored. */
export const englishGradeOneStrategies:Strategy[]=[
 strategy('anticipation','anticip\\w*',receptive,'Anticipación del contenido',[
  'Formula una anticipación del contenido en inglés relacionada con las pistas disponibles antes de acceder al mensaje.',
  'La anticipación se relaciona con las pistas; una referencia necesita precisión.',
  'Menciona pistas aisladas, pero la anticipación no las relaciona con un contenido posible.',
  'La anticipación contradice las pistas disponibles.',
  'No aporta una anticipación relacionada con las pistas disponibles.',
 ]),
 strategy('listening','escuch\\w* atentamente|escucha atenta',['listening'],'Recuperación mediante escucha atenta',[
  'Recupera los datos solicitados del mensaje escuchado en inglés con los apoyos acordados.',
  'Recupera los datos principales; un dato puntual necesita una nueva escucha.',
  'Reconoce datos aislados, pero omite relaciones necesarias para responder a lo solicitado.',
  'Atribuye al mensaje escuchado datos que cambian su sentido.',
  'No aporta datos reconocibles del mensaje escuchado.',
 ]),
 strategy('nonverbal-reception','gestos|expresiones faciales|lenguaje no verbal|senales no verbales',receptive,'Interpretación de señales no verbales',[
  'Relaciona las señales no verbales disponibles con el significado del mensaje en inglés.',
  'Relaciona las señales principales con el mensaje; una relación necesita precisión.',
  'Reconoce señales aisladas, pero no las vincula con el significado del intercambio.',
  'Interpreta una señal en contradicción con la situación comunicativa.',
  'No establece una relación reconocible entre las señales disponibles y el mensaje.',
 ]),
 strategy('inference','infer\\w*.*(?:significado|sentido)',receptive,'Inferencia del significado',[
  'Propone un significado de la palabra o expresión en inglés compatible con las pistas del mensaje y el contexto disponible.',
  'El significado propuesto permite comprender el mensaje; una pista requiere revisión.',
  'Propone un significado posible de forma aislada, pero no lo relaciona con las pistas del mensaje.',
  'El significado propuesto contradice el contexto y cambia la información comunicada.',
  'No aporta un significado relacionado con las pistas disponibles.',
 ]),
 strategy('help','(?:solicit\\w*|ped\\w*) (?:ayuda|repeticion|aclaracion)',receptive,'Solicitud de ayuda para comprender',[
  'Señala la parte del mensaje en inglés que necesita aclarar y solicita la ayuda o repetición pertinente.',
  'La solicitud permite localizar la dificultad; una referencia necesita precisión.',
  'Solicita ayuda de forma general, pero no permite reconocer qué parte necesita aclarar.',
  'La solicitud se refiere a otra parte y mantiene el malentendido.',
  'No aporta una solicitud reconocible ante la dificultad planteada.',
 ]),
 strategy('understanding','indica\\w* (?:si|que|lo que) comprend\\w*|indicar comprension',receptive,'Indicación de comprensión',[
  'Comunica qué ha comprendido o qué necesita aclarar del mensaje en inglés mediante la respuesta acordada.',
  'Indica la comprensión principal; una parte de su respuesta necesita precisión.',
  'Da una respuesta general que no permite distinguir lo comprendido de la dificultad restante.',
  'La respuesta indica comprensión de una información diferente de la escuchada o leída.',
  'No aporta una indicación reconocible sobre la comprensión del mensaje.',
 ]),
 strategy('rehearsal','ensay\\w*|reproduccion de palabras|pautas de entonacion',['oral','interaction'],'Ensayo de palabras y entonación',[
  'Ensaya las palabras, expresiones o pautas de entonación solicitadas en inglés de forma que el mensaje resulte comprensible con los apoyos acordados.',
  'El ensayo permite comprender el mensaje; una expresión necesita otra repetición.',
  'Se comprenden palabras aisladas, pero el ensayo aún no permite seguir la expresión solicitada.',
  'La reproducción de la expresión cambia el sentido que debía comunicar.',
  'No aporta una reproducción reconocible de las expresiones solicitadas.',
 ]),
 strategy('situation','situacion de comunicacion|situacion comunicativa',productive,'Situación de comunicación',[
  'Identifica la situación de comunicación y a quién se dirige el mensaje en inglés que prepara.',
  'La situación y el destinatario se reconocen; una referencia necesita precisión.',
  'Reconoce solo la situación o el destinatario, sin relacionarlos entre sí.',
  'Asigna al mensaje una situación o un destinatario diferente del solicitado.',
  'No identifica una situación de comunicación pertinente para el mensaje.',
 ]),
 strategy('communicative-purpose','(?:establec\\w*|defin\\w*) (?:la )?(?:intencion|proposito) comunicativ\\w*',productive,'Intención de la producción',[
  'Establece la intención que orientará el mensaje en inglés en la situación propuesta.',
  'La intención es reconocible; una relación con la situación necesita precisión.',
  'Nombra el tema, pero no precisa para qué se comunica el mensaje.',
  'Plantea una intención que contradice la situación o el encargo.',
  'No aporta una intención reconocible para el mensaje que prepara.',
 ]),
 strategy('nonverbal-production','gestos|lenguaje no verbal|senales no verbales',['oral','interaction'],'Apoyo no verbal al mensaje',[
  'Utiliza los gestos o apoyos no verbales acordados para hacer comprensible el mensaje en inglés.',
  'Los apoyos permiten seguir el mensaje; un gesto necesita ajuste a lo expresado.',
  'Usa apoyos aislados sin vincularlos con las ideas comunicadas.',
  'Los gestos o apoyos contradicen el significado del mensaje.',
  'No aporta el apoyo no verbal solicitado para comunicar el mensaje.',
 ]),
 strategy('reading-purpose','(?:establec\\w*|defin\\w*) (?:el )?proposito de (?:la )?lectura',['reading'],'Propósito de lectura',[
  'Define el propósito de lectura y la información que busca en el texto en inglés.',
  'El propósito permite orientar la lectura; una referencia a lo buscado necesita precisión.',
  'Menciona el tema del texto, pero no distingue qué información busca.',
  'Propone una búsqueda que no corresponde al encargo de lectura.',
  'No aporta un propósito reconocible para la lectura solicitada.',
 ]),
 strategy('hypothesis','hipotesis|elementos paratextuales',['reading'],'Hipótesis a partir del paratexto',[
  'Formula una hipótesis de lectura relacionada con el título, las imágenes u otras pistas paratextuales disponibles del texto en inglés.',
  'La hipótesis se relaciona con las pistas; una relación necesita precisión.',
  'Nombra elementos del paratexto, pero no los integra en una hipótesis de lectura.',
  'La hipótesis contradice las pistas paratextuales disponibles.',
  'No aporta una hipótesis relacionada con el paratexto disponible.',
 ]),
 strategy('grapheme-phoneme','grafia y (?:el )?sonido|grafema.*fonema',['reading'],'Correspondencia entre grafía y sonido',[
  'Relaciona la grafía y el sonido de las palabras en inglés solicitadas mediante la identificación acordada.',
  'Reconoce las correspondencias principales; una palabra necesita revisión.',
  'Reconoce algunas correspondencias, pero confunde otras palabras solicitadas.',
  'Asocia las grafías con sonidos que corresponden a palabras diferentes.',
  'No establece correspondencias reconocibles entre las grafías y los sonidos solicitados.',
 ]),
 strategy('annotation','subray\\w*|anot\\w*',receptive,'Selección de información pertinente',[
  'Selecciona información pertinente del mensaje en inglés mediante el subrayado o la anotación solicitada.',
  'Selecciona la información principal; una selección necesita precisión.',
  'Selecciona información aislada, pero omite datos necesarios para el propósito indicado.',
  'La selección corresponde a información ajena al propósito de comprensión.',
  'No aporta una selección reconocible de información pertinente.',
 ]),
 strategy('dictionary','consult\\w* (?:el |un )?diccionario|busqu\\w*.*diccionario',[...receptive,...productive],'Consulta del diccionario',[
  'Selecciona una acepción del diccionario compatible con el uso de la palabra en el mensaje en inglés.',
  'La acepción permite comprender o expresar la idea principal; una elección necesita revisión.',
  'Encuentra una entrada, pero no distingue la acepción pertinente para el mensaje.',
  'Elige una acepción que cambia el sentido de la palabra en la situación.',
  'No aporta una acepción relacionada con la palabra y la situación planteadas.',
 ]),
 strategy('text-intention','intencion comunicativa del texto|intencion del texto',['reading'],'Intención del texto leído',[
  'Identifica la intención del texto en inglés de acuerdo con el mensaje que comunica.',
  'La intención es reconocible; una relación con el mensaje necesita precisión.',
  'Identifica el tema, pero lo confunde con la intención del texto.',
  'Atribuye al texto una intención contraria a la información que comunica.',
  'No aporta una intención reconocible del texto leído.',
 ]),
 strategy('planning','planific\\w*|organizar(?:an)? (?:las )?ideas',['writing'],'Planificación del mensaje escrito',[
  'La organización de ideas preparada permite desarrollar el mensaje en inglés para el propósito y destinatario solicitados.',
  'Las ideas principales permiten preparar el mensaje; una relación necesita ajuste.',
  'Reúne ideas aisladas, pero falta relacionarlas para desarrollar el mensaje.',
  'La planificación organiza ideas ajenas al propósito o destinatario del mensaje.',
  'No aporta una organización de ideas relacionada con el mensaje solicitado.',
 ]),
 strategy('revision','revis\\w* (?:el |un )?(?:borrador|mensaje|texto)|correg\\w* problemas',['writing'],'Revisión de sentido y escritura',[
  'Los cambios realizados resuelven los problemas de sentido o escritura identificados en el mensaje en inglés.',
  'Los cambios resuelven los problemas principales; una relación necesita revisión.',
  'Modifica partes del mensaje, pero mantiene problemas identificados que dificultan comprenderlo.',
  'Los cambios introducen contradicciones o alteran la idea que se quería comunicar.',
  'No aporta cambios relacionados con los problemas de revisión planteados.',
 ]),
 strategy('association','asociaciones mentales|asociacion mental|asociaciones con acciones',receptive,'Asociaciones para comprender palabras',[
  'Establece una asociación entre la palabra o expresión en inglés y su significado mediante el recurso acordado.',
  'La asociación permite reconocer el significado; una relación necesita precisión.',
  'Relaciona elementos aislados, pero la asociación no permite recuperar el significado completo.',
  'La asociación atribuye a la palabra un significado diferente del solicitado.',
  'No aporta una asociación reconocible con el significado de la palabra.',
 ]),
 strategy('practice','oportunidades de uso|oportunidades de practica',productive,'Uso de la lengua en una situación acordada',[
  'Realiza una intervención breve en inglés pertinente para la oportunidad de comunicación acordada.',
  'La intervención permite comunicarse; una expresión necesita apoyo o aclaración.',
  'Aporta expresiones aisladas que no resuelven la necesidad comunicativa acordada.',
  'La intervención expresa una intención diferente de la situación propuesta.',
  'No aporta una intervención reconocible en la situación acordada.',
 ]),
 strategy('cultural-comparison','compar(?:a|an|ar|aran|ando|en|e|emos|acion|aciones)\\b.*(?:republica dominicana|otros? pais(?:es)?)',[...receptive,...productive],'Comparación cultural con ejemplos',[
  'La comparación cultural relaciona los aspectos solicitados de República Dominicana y del otro contexto mediante los ejemplos disponibles, sin generalizarlos a todas las personas.',
  'Relaciona los aspectos principales de ambos contextos; un ejemplo necesita precisión.',
  'Menciona ejemplos de los contextos, pero no establece su semejanza o diferencia.',
  'La comparación contradice los ejemplos o atribuye a todas las personas un rasgo de un caso particular.',
  'No aporta una comparación reconocible entre los aspectos solicitados de ambos contextos.',
 ]),
 strategy('text-type','(?:seleccion\\w*|eleg\\w*|determin\\w*) (?:el )?tipo de texto',['writing'],'Elección del tipo de texto',[
  'Selecciona un tipo de texto en inglés que permite cumplir el propósito y dirigirse al destinatario de la situación propuesta.',
  'El tipo de texto permite comunicar lo principal; una relación con el destinatario necesita precisión.',
  'Reconoce un tipo de texto, pero no lo relaciona con la necesidad comunicativa planteada.',
  'Elige un tipo de texto cuya función contradice el propósito del encargo.',
  'No aporta una elección reconocible del tipo de texto para la situación.',
 ]),
]

export function requestedEnglishStrategies(text:string,mode?:string,strategies=englishGradeOneStrategies){
 return strategies.filter(f=>(!mode||f.modes.includes(mode))&&new RegExp(`\\b(?:${f.match})\\b`).test(text))
}

export function englishStrategyCriteria(text:string,mode:string,scope='ing-1',strategies=englishGradeOneStrategies):ContextualTopicCriterion[]{
 return requestedEnglishStrategies(text,mode,strategies).map(f=>{
  let levels=f.levels
  if(f.id==='cultural-comparison'){
   const aspects=[['celebraciones','las celebraciones'],['puntualidad','la puntualidad'],['gustos|preferencias','los gustos y preferencias'],['formas de interactuar','las formas de interactuar'],['rasgos fisicos','los rasgos físicos de las personas o personajes de los ejemplos'],['efecto del clima|clima en las condiciones','el efecto del clima en las condiciones de vida']].filter(([pattern])=>new RegExp(pattern).test(text)).map(([,label])=>label)
   if(aspects.length){const target=aspects.length===1?aspects[0]:aspects.slice(0,-1).join(', ')+' y '+aspects.at(-1);levels=levels.map(level=>level.replace('los aspectos solicitados',target)) as Strategy['levels']}
  }
  if(f.id==='annotation'){
   const subrayar=/\bsubray\w*/.test(text),anotar=/\banot\w*/.test(text)
   const selected=subrayar&&anotar?'el subrayado y la anotación solicitados':subrayar?'el subrayado solicitado':'la anotación solicitada'
   levels=[levels[0].replace('el subrayado o la anotación solicitada',selected),...levels.slice(1)] as Strategy['levels']
  }
  return {templateId:`${scope}-strategy-${f.id}`,title:f.title,observable:levels[0],weight:3,progressionLevels:levels}
 })
}
