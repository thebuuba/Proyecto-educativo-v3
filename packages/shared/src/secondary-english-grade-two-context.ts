import type {ContextualTopicCriterion} from './secondary-topic-criteria'
const row=(id:string,title:string,levels:NonNullable<ContextualTopicCriterion['progressionLevels']>):ContextualTopicCriterion=>({templateId:`ing-2-context-${id}`,title,observable:levels[0],weight:3,progressionLevels:levels})
/** PDF140/145. Only explicit task conditions can turn values into communicative
 * evidence. No measure of internal feelings, personality, private data or habits.
 */
export function gradeTwoContextCriteria(text:string,receptive=false){
 const rows:ContextualTopicCriterion[]=[]
 if(!receptive&&/\b(?:con cortesia|asertiv\w*|con tacto)\b/.test(text))rows.push(row('courtesy','Intención comunicada con cortesía',[
  'Comunica en inglés la intención solicitada mediante fórmulas de cortesía pertinentes para la situación, sin descalificar al interlocutor.',
  'La intención se comprende y el trato es cortés; una fórmula requiere ajuste a la situación.',
  'La intención se reconoce, pero una expresión requiere reformulación para comunicarla con cortesía.',
  'La expresión descalifica al interlocutor o comunica una intención contraria a la solicitada.',
  'No se reconoce una expresión de la intención comunicativa solicitada.',
 ]))
 if(!receptive&&/\b(?:sin estereotipos|sin descalificaciones|sin discriminar|respeto por (?:las )?diferencias)\b/.test(text))rows.push(row('respect-differences','Comunicación de diferencias sin generalizaciones',[
  'Comunica en inglés los modos de vida o costumbres de los personajes o ejemplos indicados sin atribuir a todas las personas características de un caso particular.',
  'Las diferencias se comprenden sin descalificaciones; una referencia al ejemplo necesita precisión.',
  'Describe un ejemplo, pero una generalización no se sustenta en la información proporcionada.',
  'Descalifica a un grupo o atribuye a todas las personas características no sustentadas por los ejemplos.',
  'No aporta un mensaje reconocible sobre los personajes o ejemplos solicitados.',
 ]))
 if(!receptive&&/\b(?:normas eticas|privacidad)\b/.test(text)&&/\b(?:tic|chat|interaccion virtual|datos proporcionados)\b/.test(text))rows.push(row('ethical-ict','Mensaje compatible con las normas del intercambio virtual',[
  'Comunica en inglés el mensaje virtual solicitado respetando las normas proporcionadas y la privacidad de los datos usados en la tarea.',
  'El mensaje respeta las normas principales; una referencia a los datos necesita ajuste.',
  'Se reconoce el mensaje, pero una parte no distingue qué datos pueden comunicarse según las normas dadas.',
  'El mensaje divulga datos o utiliza expresiones contrarias a las normas proporcionadas para la tarea.',
  'No aporta un mensaje virtual reconocible relacionado con las condiciones solicitadas.',
 ]))
 if(!receptive&&/\b(?:horarios|compromisos|tiempo de (?:los )?demas)\b/.test(text)&&/\b(?:proporcionad\w*|acordad\w*|respet\w*)\b/.test(text))rows.push(row('agreed-time','Acuerdo compatible con el tiempo proporcionado',[
  'Comunica en inglés un acuerdo compatible con los horarios o compromisos proporcionados de los personajes del intercambio.',
  'El acuerdo respeta los horarios principales; una referencia temporal necesita precisión.',
  'Propone un acuerdo, pero deja sin relacionar una condición temporal proporcionada.',
  'El acuerdo comunicado contradice los horarios o compromisos proporcionados.',
  'No aporta un acuerdo reconocible relacionado con las condiciones temporales dadas.',
 ]))
 if(!receptive&&/\b(?:con empatia|respuesta empatica)\b/.test(text))rows.push(row('empathetic-response','Respuesta relacionada con la necesidad comunicada',[
  'Responde en inglés reconociendo la necesidad o situación comunicada por el personaje y expresa apoyo relacionado con ella.',
  'La respuesta reconoce la necesidad principal; una referencia al apoyo necesita precisión.',
  'Aporta una expresión de apoyo general sin relacionarla con la necesidad comunicada.',
  'La respuesta contradice o descalifica la necesidad comunicada por el personaje.',
  'No aporta una respuesta reconocible relacionada con la necesidad comunicada.',
 ]))
 if(!receptive&&/\b(?:justific\w*|razon\w*)\b/.test(text)&&/\b(?:compra|producto)\b/.test(text)&&/\b(?:precios|necesidades) proporcionad\w*\b/.test(text))rows.push(row('purchase-choice','Elección de compra sustentada en datos de la tarea',[
  'Justifica en inglés la elección del producto relacionándola con los precios y necesidades proporcionados en la compra simulada.',
  'La elección se relaciona con los datos principales; una razón necesita precisión.',
  'Elige un producto, pero deja sin relacionar un dato necesario para justificar la compra.',
  'Justifica la compra con precios o necesidades incompatibles con los datos proporcionados.',
  'No aporta una elección justificada con los datos de la compra simulada.',
 ]))
 if(!receptive&&/\b(?:fielmente|sin inventar datos|sin alterar (?:los )?datos)\b/.test(text)&&/\binformacion proporcionad\w*\b/.test(text))rows.push(row('faithful-information','Fidelidad a la información proporcionada',[
  'Comunica en inglés la información proporcionada conservando sus referentes y relaciones, sin atribuir datos ausentes a la fuente.',
  'La información principal se conserva; una referencia requiere precisión.',
  'Conserva datos aislados, pero deja sin relacionar información necesaria de la fuente.',
  'Comunica datos que contradicen o no están sustentados por la información proporcionada.',
  'No aporta información reconocible relacionada con la fuente proporcionada.',
 ]))
 const care=/\b(?:cuid\w*|proteg\w*|preserv\w*)\b/.test(text)
 const targets=[/\bsalud\b/.test(text)?'la salud':'',/\b(?:medioambiente|medio ambiente|recursos naturales)\b/.test(text)?'el medioambiente':''].filter(Boolean).join(' y ')
 if(care&&targets)rows.push(row('care','Acciones comunicadas de cuidado',[
  receptive?`Identifica en el mensaje en inglés las acciones indicadas para cuidar ${targets} y su relación con la situación dada.`:`Comunica en inglés acciones para cuidar ${targets} relacionadas con la situación dada.`,
  `Se reconoce la relación de las acciones con el cuidado de ${targets}; una referencia necesita precisión.`,
  `Menciona acciones aisladas sin relacionarlas claramente con el cuidado de ${targets}.`,
  `Las acciones identificadas o comunicadas contradicen el cuidado de ${targets} solicitado.`,
  `No se reconocen acciones relacionadas con el cuidado de ${targets} en la situación dada.`,
 ]))
 return rows
}
