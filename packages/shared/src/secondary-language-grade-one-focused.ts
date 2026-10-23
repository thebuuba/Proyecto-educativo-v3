import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'
import type {InstrumentRecommendation} from './instrument-recommendation'

type Kind='NEWS_CORRECTION'|'NEWS_ORAL'|'SOCIAL_PARAPHRASE'|'ALTERNATIVE_PARAPHRASE'|'SCIENCE_ANNOTATION'|'PARTICIPATION_PLAN'|'PARTICIPATION_COMPARISON'|'RECOMMENDATION_REVISION'|'ARGUMENT_ALTERNATIVES'|'STORY_DECISION'|'WORD_REVISION'|'PROGRESS'
export type FirstGradeFocusedTask={kind:Kind;task:string;activityType:string}
/** Recognize the action and its bounded evidence, before a genre or isolated feature. */
export function firstGradeFocusedTask(task:string):FirstGradeFocusedTask|null{
 const found=(kind:Kind,activityType:string)=>({kind,task,activityType})
 if(/caligrama/.test(task)&&/revis\w*.*palabras/.test(task)&&/conservar/.test(task)&&/sugerencia/.test(task))return found('WORD_REVISION','CALLIGRAM_CREATION')
 if(/cuento policiaco/.test(task)&&/cambi\w*.*decision|decision.*cambi/.test(task)&&/pista/.test(task)&&/actitud o valor/.test(task))return found('STORY_DECISION','DETECTIVE_STORY_ANALYSIS')
 if(/\bdebat(?:an|en|ir|imos)\b/.test(task)&&/postura/.test(task)&&/objecion/.test(task)&&/dato.*\bo\b.*ejemplo/.test(task))return found('ARGUMENT_ALTERNATIVES','DEBATE')
 if(/proyectos?/.test(task)&&/recomendacion/.test(task)&&/reescrib\w*|revis\w*|corrij\w*/.test(task)&&/\bsolo\b|solamente|unicamente/.test(task)&&/nota|explicando el cambio/.test(task))return found('RECOMMENDATION_REVISION','PROJECT')
 if(/compar\w*|contrast\w*/.test(task)&&/proyectos/.test(task)&&/participar|participantes/.test(task)&&/recog\w*.*propuestas/.test(task)&&/solamente|solo|unicamente/.test(task))return found('PARTICIPATION_COMPARISON','COMPARISON')
 if(/\bplan\b/.test(task)&&/participacion|participen|intervienen/.test(task)&&/objetivo/.test(task)&&/responsables/.test(task)&&/acciones/.test(task))return found('PARTICIPATION_PLAN','PROJECT')
 if(/noticia/.test(task)&&/corrij\w*|corrig\w*|correg\w*|revis\w*/.test(task)&&/titular.*entrada/.test(task)&&/posible|incertidumbre|exager/.test(task))return found('NEWS_CORRECTION','NEWS_WRITING')
 if(/noticia oral/.test(task)&&/ficha|registro/.test(task)&&/investigacion|cientific/.test(task))return found('NEWS_ORAL','NEWSCAST')
 if(/propias palabras|sus palabras|parafras|sin copiar|explic\w*.*(?:que encontro|hallazgo|resultados)/.test(task)&&/encuesta/.test(task)&&! /procedimiento|pasos de la investigacion/.test(task))return found('SOCIAL_PARAPHRASE','WRITTEN_PRODUCTION')
 if(/sus palabras|propias palabras|parafras/.test(task)&&/hallazgo/.test(task)&&/parrafo o (?:un )?audio/.test(task))return found('ALTERNATIVE_PARAPHRASE','ANALYSIS')
 if(/\b(?:lee|lean|leer)\b.*informe cientifico/.test(task)&&/margen|anotacion/.test(task)&&/afirmacion.*comprobar/.test(task))return found('SCIENCE_ANNOTATION','ANALYSIS')
 if(/proyecto/.test(task)&&/revis\w*.*avances|seguimiento.*avances/.test(task)&&! /objetivo|producto|entreg\w*|elabor\w*|redact\w*|constru\w*|experimento|informe|noticia/.test(task))return found('PROGRESS','PROJECT')
 return null
}
const row=(id:string,title:string,weight:number,levels:Criterion['progressionLevels'],coveredDeliveryKeys:string[]=[]):Criterion=>({templateId:'len1-focused-'+id,title,weight,observable:levels[0],progressionLevels:levels,fourLevelLowest:`${levels[3]} O bien: ${levels[4]}`,coveredDeliveryKeys})
export function firstGradeFocusedCriteria(spec:FirstGradeFocusedTask):Criterion[]{
 const {kind,task}=spec
 if(kind==='NEWS_CORRECTION')return[
  row('news-certainty','Fidelidad y grado de certeza del hallazgo',5,[
   'Reformula el titular y la entrada de acuerdo con el hallazgo de la ficha; comunica como posibilidad lo que el estudio solo considera posible y conserva los datos comprobados.',
   'Titular y entrada conservan el hallazgo y su incertidumbre; una expresión necesita precisión sin convertir la posibilidad en certeza.',
   'Uno de los fragmentos conserva la incertidumbre, pero el otro todavía exagera parcialmente el alcance del hallazgo.',
   'Presenta la posibilidad como certeza o modifica los datos comprobados al corregir los fragmentos.',
   'No presenta titular y entrada revisados que permitan reconocer el hallazgo y su grado de certeza.',
  ]),row('news-bounded-revision','Revisión limitada y cuerpo conservado',3,[
   'Limita las modificaciones al titular y la entrada y conserva intacto el cuerpo de la noticia; permite comparar esos fragmentos con la versión inicial.',
   'Mantiene intacto el cuerpo y revisa ambos fragmentos; una relación de continuidad entre entrada y cuerpo necesita precisión.',
   'Conserva el cuerpo, pero deja uno de los dos fragmentos sin una revisión reconocible.',
   'Modifica el cuerpo que debía conservar o sustituye la noticia por otro texto.',
   'No permite comprobar qué cambió en el titular y la entrada ni la conservación del cuerpo.',
  ]),
 ]
 if(kind==='NEWS_ORAL')return[
  row('news-oral-fidelity','Hallazgo fiel y procedencia reconocible',5,[
   'Comunica oralmente el hallazgo central de la investigación y lo sitúa con la información disponible en la ficha; reconoce esa ficha como procedencia y mantiene el alcance de sus datos.',
   'El hallazgo, su contexto y su procedencia se reconocen; una relación entre datos necesita precisión sin cambiar su sentido.',
   'Comunica parte del hallazgo, pero deja poco claro su contexto o la procedencia de la información.',
   'Altera el hallazgo, atribuye datos inexistentes a la ficha o presenta una interpretación como un resultado comprobado.',
   'No comunica un hallazgo reconocible que pueda contrastarse con la ficha.',
  ]),row('news-oral-audience','Organización de la noticia oral para sus destinatarios',4,[
   `Organiza una noticia oral comprensible ${/otros cursos/.test(task)?'para otros cursos':'para la audiencia indicada'}, destacando el hecho y conectando sus datos; puede presentarla un portavoz o mediante intervenciones coordinadas del equipo.`,
   'La noticia permite seguir el hecho y sus datos; una transición o expresión necesita claridad para la audiencia.',
   'Se reconocen el hecho y algunos datos, pero su orden o conexión dificulta seguir la noticia oral.',
   'La organización cambia el sentido del hallazgo o reúne intervenciones sin una noticia común comprensible.',
   'No se dispone de una presentación oral común que permita valorar la comunicación del hallazgo.',
  ]),...(/un minuto|1 minuto/.test(task)?[row('news-oral-time','Síntesis en el tiempo indicado',2,[
   'Presenta la noticia oral en el tiempo de un minuto indicado, conservando el hallazgo y los datos esenciales para entenderlo.',
   'Se ajusta al minuto previsto; una repetición puede reducirse sin perder información esencial.',
   'La distribución del tiempo deja incompleto un dato necesario o añade repeticiones que dificultan la síntesis.',
   'La extensión impide completar el hallazgo en el tiempo acordado o lo recorta hasta alterar su sentido.',
   'No hay presentación cuya duración y contenido puedan comprobarse.',
  ])]:[]),
 ]
 if(kind==='SOCIAL_PARAPHRASE'||kind==='ALTERNATIVE_PARAPHRASE'){
  const alternative=kind==='ALTERNATIVE_PARAPHRASE',source=alternative?'ficha':'encuesta',rows=[
   row('paraphrase-fidelity','Hallazgo y datos conservados',5,[
    `Explica el hallazgo central de la ${source} manteniendo sus datos, comparaciones y contexto; distingue lo que esa fuente permite afirmar de conclusiones añadidas.`,
    'El hallazgo y los datos conservan su sentido; una relación contextual necesita precisión.',
    'Conserva parte del hallazgo, pero omite una relación necesaria para comprender sus datos o comparaciones.',
    'Cambia datos o comparaciones, o presenta conclusiones que la fuente no sostiene.',
    'No comunica un hallazgo reconocible y fiel a la fuente.',
   ]),row('paraphrase-own-words','Reformulación propia y claridad',4,[
    `Reformula el hallazgo con sus propias palabras y organización; conserva términos o nombres necesarios y hace reconocible la ${source} de la que procede la información.`,
    'La reformulación es propia y fiel; una expresión necesita claridad sin cambiar el hallazgo.',
    'Combina reformulación propia con fragmentos copiados que no se integran suficientemente en una explicación propia.',
    'Copia pasajes sin reformular o reemplaza términos de manera que altera su significado.',
    'No presenta una explicación propia identificable del hallazgo.',
   ]),
  ]
  if(alternative)rows.push(row('paraphrase-limits','Observación, explicación posible y alcance',4,[
   'Distingue lo observado de una explicación posible; relaciona cada afirmación con la ficha y limita su alcance, sin generalizar el resultado a todas las plantas.',
   'Separa observación e interpretación y conserva el alcance; una relación con la evidencia necesita precisión.',
   'Reconoce parte de lo observado, pero deja ambiguo si la explicación propuesta está comprobada.',
   'Presenta la explicación posible como causa demostrada o extiende el resultado a todas las plantas sin respaldo.',
   'No diferencia observación e interpretación ni permite reconocer el alcance de la evidencia.',
  ]),row('paraphrase-modality','Claridad en la modalidad elegida',2,[
   'Entrega un párrafo o un audio de un minuto: en la modalidad elegida conecta las ideas para comprender el hallazgo; no necesita presentar ambos productos.',
   'La modalidad elegida permite comprender el hallazgo; una conexión entre ideas necesita claridad.',
   'El párrafo o el audio permite reconocer parte del hallazgo, pero su organización dificulta la explicación completa.',
   'La organización de la entrega altera la relación entre las ideas del hallazgo.',
   'No se dispone de un párrafo o audio que permita valorar la explicación.',
  ],['quantity-parrafo']))
  else if(/unas? ochenta palabras|aproximadamente (?:ochenta|80) palabras|unas? 80 palabras/.test(task))rows.push(row('paraphrase-length','Síntesis con extensión aproximada',2,[
   'Explica lo esencial en una extensión aproximada de ochenta palabras, sin exigir un conteo exacto ni incluir todos los resultados secundarios.',
   'La síntesis se aproxima a la extensión prevista; una repetición puede reducirse sin perder lo esencial.',
   'La síntesis dedica espacio a repeticiones y deja poco explicado un resultado central.',
   'La extensión se aleja sustancialmente de la síntesis solicitada o recorta el texto hasta cambiar el hallazgo.',
   'No presenta una síntesis del hallazgo cuya extensión y contenido puedan valorarse.',
  ]))
  return rows
 }
 if(kind==='SCIENCE_ANNOTATION')return[
  row('science-question','Pregunta estudiada en el informe',3,[
   'Identifica la pregunta que estudia el informe científico y la expresa de modo compatible con su objeto y alcance.',
   'La pregunta corresponde al informe; una formulación de su alcance necesita precisión.',
   'Reconoce el asunto general, pero no delimita suficientemente la pregunta estudiada.',
   'Atribuye al informe una pregunta distinta o incompatible con el estudio descrito.',
   'No identifica una pregunta reconocible del informe.',
  ]),row('science-data-inference','Dato que respalda la conclusión',5,[
   'Selecciona un dato del informe que respalde su conclusión y explica al margen por qué existe esa relación, con apoyo en el texto.',
   'El dato y la conclusión se relacionan; una parte de la justificación al margen necesita precisión.',
   'Selecciona un dato pertinente, pero no explica suficientemente cómo respalda la conclusión.',
   'Afirma que el dato demuestra una conclusión incompatible con su contenido o inventa evidencia.',
   'No ofrece una relación reconocible entre un dato del informe y su conclusión.',
  ]),row('science-unproven','Afirmación que todavía requiere comprobación',4,[
   'Señala una afirmación que todavía habría que comprobar y justifica al margen qué apoyo falta en el informe para sostenerla.',
   'Reconoce una afirmación insuficientemente respaldada; una explicación del apoyo faltante necesita precisión.',
   'Señala una afirmación por comprobar, pero la razón no distingue suficientemente el respaldo disponible del que falta.',
   'Presenta como no comprobada una afirmación plenamente sustentada sin justificarlo, o acepta una afirmación ajena al informe.',
   'No identifica una afirmación pendiente ni una razón textual que explique su elección.',
  ]),
 ]
 if(kind==='PARTICIPATION_PLAN')return[
  row('participation-problem','Problema y objetivo del plan',4,[
   'Explica con información del caso el problema de participación y formula un objetivo que responde a esa necesidad del consejo de curso.',
   'Problema y objetivo corresponden al caso; una relación entre ambos necesita precisión.',
   'Describe parte del problema, pero el objetivo responde solo parcialmente a la necesidad identificada.',
   'El problema contradice el caso o el objetivo excluye las voces cuya participación se pretende favorecer.',
   'No se reconoce un problema del caso relacionado con un objetivo del plan.',
  ]),row('participation-actions','Acciones, responsables y momentos previstos',4,[
   `Organiza ${/dos acciones/.test(task)?'dos acciones':'las acciones solicitadas'} coherentes con el objetivo, con responsables y momentos de realización que permiten comprender cómo se pondrían en práctica; presenta planificación, no resultados de ejecución.`,
   'Las acciones responden al objetivo; una relación entre responsables y momentos necesita precisión.',
   'Parte de las acciones se relaciona con el objetivo, pero quedan responsabilidades o momentos sin definir suficientemente.',
   'Las acciones contradicen el objetivo o se presentan resultados de ejecución como si fueran parte del plan solicitado.',
   'No hay acciones previstas con responsables y momentos reconocibles.',
  ]),row('participation-inclusion','Recogida justa de propuestas',5,[
   'Justifica cómo las acciones permiten recoger las propuestas de quienes casi no intervienen; admite mecanismos accesibles distintos sin obligar a participar de la misma manera.',
   'El mecanismo considera las voces poco representadas; una relación con las condiciones del caso necesita precisión.',
   'Menciona participación justa, pero no explica suficientemente cómo recogerá las voces poco representadas.',
   'El mecanismo vuelve a excluir esas voces o identifica participación justa con obligar a todos a intervenir igual.',
   'No propone un mecanismo reconocible para recoger las voces poco representadas.',
  ]),row('participation-alternative','Consideración de una alternativa',3,[
   'Registra una alternativa discutida y explica con razones la decisión de aceptar, adaptar o descartar esa opción respecto del problema y del plan.',
   'La alternativa y la decisión se reconocen; una razón necesita precisión.',
   'Registra una alternativa, pero no explica suficientemente cómo se consideró al decidir.',
   'Distorsiona la alternativa o reemplaza sus razones por la exigencia de acuerdo unánime.',
   'No se reconoce una alternativa discutida ni la decisión tomada sobre ella.',
  ]),
 ]
 if(kind==='PARTICIPATION_COMPARISON')return[
  row('participation-compare','Participantes y mecanismos en ambos proyectos',5,[
   'Contrasta en un cuadro a quiénes permiten participar ambos proyectos y cómo recoge cada uno sus propuestas; apoya las diferencias o coincidencias en los textos.',
   'El cuadro compara participantes y mecanismos de ambos proyectos; una relación con los textos necesita precisión.',
   'Describe a los participantes o mecanismos, pero deja incompleta su comparación entre ambos proyectos.',
   'Intercambia información de los proyectos o atribuye mecanismos de participación que sus textos no contienen.',
   'No presenta una comparación reconocible de participantes y recogida de propuestas.',
  ]),row('participation-choice','Decisión sustentada o límite de información',4,[
   'Recomienda uno de los proyectos con una razón apoyada en cómo permite participar y recoge propuestas, o explica qué información falta para decidir; ambas opciones son válidas si se sustentan en los textos.',
   'La recomendación o el límite de información se sostiene en los textos; una relación con la participación necesita precisión.',
   'Elige un proyecto o declara información insuficiente, pero aporta apoyo textual parcial para esa decisión.',
   'Impone una elección sin respaldo, inventa información o juzga a los autores en lugar de las propuestas.',
   'No presenta una decisión ni un límite de información reconocibles y sustentados.',
  ]),
 ]
 if(kind==='RECOMMENDATION_REVISION')return[
  row('recommendation-fit','Recomendación viable y explicación del cambio',5,[
   'Reescribe la recomendación para que sea viable según las acciones previstas y añade una nota que explica el cambio con información del documento.',
   'La recomendación es viable y la nota justifica el cambio; una relación con las acciones necesita precisión.',
   'La recomendación responde parcialmente a las acciones, pero la nota no explica suficientemente el cambio.',
   'La recomendación sigue pidiendo algo que las acciones no permiten o la nota inventa condiciones del proyecto.',
   'No se reconoce una recomendación revisada y una nota explicativa relacionadas con el documento.',
  ]),row('recommendation-preserve','Componentes del proyecto conservados',3,[
   'Conserva el problema, el objetivo, las acciones, las personas responsables y los plazos; limita la revisión a la recomendación y su nota explicativa.',
   'Mantiene los componentes previstos y el límite de revisión; una referencia de la nota al documento necesita precisión.',
   'La revisión respeta parte del límite, pero deja poco clara la continuidad de algún componente que debía conservar.',
   'Cambia un componente que debía conservar o añade acciones y condiciones para justificar la recomendación.',
   'No permite comprobar la conservación del proyecto y el alcance de la revisión.',
  ]),
 ]
 if(kind==='ARGUMENT_ALTERNATIVES')return[
  row('argument-position','Postura y apoyo pertinente',5,[
   'Defiende oralmente una postura sobre la propuesta con una razón apoyada en un dato del caso o en un ejemplo pertinente; explica cómo ese apoyo sostiene la razón.',
   'La postura, la razón y el apoyo se conectan; una relación argumentativa necesita precisión.',
   'Expresa postura y apoyo, pero no explica suficientemente cómo el dato o el ejemplo sostiene su razón.',
   'El dato o el ejemplo contradice la razón o atribuye al caso información inexistente.',
   'No comunica una postura con una razón y un apoyo reconocibles.',
  ],['quantity-ejemplo']),row('argument-objection','Respuesta al contenido de la objeción',4,[
   'Recupera fielmente la objeción escuchada y responde a su contenido con razones, permitiendo la discrepancia sin descalificación personal.',
   'La respuesta atiende la objeción sin descalificar; una razón necesita precisión.',
   'Reconoce parte de la objeción, pero responde sin explicar suficientemente su posición frente a ella.',
   'Distorsiona la objeción o sustituye la respuesta por descalificaciones personales.',
   'No se reconoce una respuesta al contenido de la objeción.',
  ]),row('argument-close','Cierre reflexivo del debate',3,[
   'Cierra indicando qué mantiene o qué cambia de su postura y explica la decisión a partir de lo discutido; no necesita cambiar de opinión ni alcanzar consenso.',
   'El cierre se relaciona con el intercambio; una razón para mantener o cambiar necesita precisión.',
   'Indica si mantiene o cambia la postura, pero no explica suficientemente su relación con lo discutido.',
   'El cierre contradice sus razones o presenta el acuerdo obligatorio como sustituto de justificación.',
   'No comunica un cierre reconocible sobre su postura y el intercambio.',
  ]),
 ]
 if(kind==='STORY_DECISION')return[
  row('story-change','Cambio de decisión a partir de la pista',4,[
   'Explica el cambio de decisión del personaje relacionando su decisión inicial y la nueva pista con lo que sucede en el cuento leído.',
   'El cambio y su relación con la pista se reconocen; una conexión con la decisión inicial necesita precisión.',
   'Identifica la pista o la decisión, pero explica parcialmente la relación entre ambas.',
   'Atribuye a la pista un cambio incompatible con las decisiones o los hechos del cuento.',
   'No explica un cambio de decisión reconocible a partir de la pista.',
  ]),row('story-attitude','Interpretación de actitud o valor con evidencia',5,[
   'Interpreta una actitud o un valor observable en ese cambio y lo sustenta en dos momentos pertinentes de la historia; admite interpretaciones distintas compatibles con la trama.',
   'La interpretación se sostiene en dos momentos; una relación entre evidencia y actitud o valor necesita precisión.',
   'Propone una interpretación, pero la sustenta solo parcialmente o con un único momento pertinente.',
   'La interpretación contradice los momentos elegidos o sustituye el respaldo narrativo por una aprobación moral sin evidencia.',
   'No presenta una interpretación de actitud o valor apoyada en momentos de la historia.',
  ]),
 ]
 if(kind==='WORD_REVISION')return[
  row('word-choice','Decisiones justificadas sobre las palabras señaladas',5,[
   'Examina las dos palabras señaladas según el tema y la intención del caligrama; justifica sustituir una o ambas o conservarlas por cómo funcionan en el poema.',
   'La decisión sobre ambas palabras se justifica en el poema; una relación expresiva necesita precisión.',
   'Explica la decisión sobre una palabra, pero deja la otra sin una justificación suficiente.',
   'Sustituye o conserva palabras con razones incompatibles con el poema, o considera obligatorio cambiarlas aunque funcionen.',
   'No se reconocen decisiones justificadas sobre las palabras señaladas.',
  ]),row('word-feedback','Consideración razonada de la sugerencia',3,[
   'Considera fielmente la sugerencia escrita del compañero y explica si decide aceptar, adaptar o rechazar esa sugerencia según su efecto en el poema.',
   'La sugerencia y la decisión se reconocen; una razón sobre su efecto necesita precisión.',
   'Menciona la sugerencia, pero no explica suficientemente cómo la consideró al decidir.',
   'Distorsiona la sugerencia o la acepta automáticamente sin relacionarla con el poema.',
   'No se reconoce consideración de la sugerencia escrita.',
  ]),row('word-preserve','Borrador anotado y límites conservados',3,[
   'Señala sus decisiones en el borrador y mantiene la figura, el tema y el orden de los versos; limita la intervención a las palabras señaladas.',
   'Conserva figura, tema y orden; una anotación de la decisión necesita claridad.',
   'Las anotaciones permiten seguir parte de la revisión, pero alguna decisión queda sin identificar.',
   'Modifica figura, tema u orden que debía conservar, o cambia palabras fuera del alcance señalado.',
   'No hay un borrador que permita comprobar las decisiones y la conservación de sus límites.',
  ]),
 ]
 return [row('progress-evidence','Seguimiento provisional: evidencia disponible',3,[
  'Provisional, con evidencia ya acordada y observada: muestra el avance disponible e identifica qué parte se ha trabajado, explicando su relación de forma comprobable.',
  'Provisional: el avance observado y la parte trabajada se relacionan; una explicación necesita precisión, una vez acordada la evidencia.',
  'Provisional: se observa parte del avance, pero su relación con lo trabajado requiere aclaración; no se supone un producto final.',
  'Provisional: atribuye al avance mostrado un trabajo que esa evidencia no respalda; revisar el contraste antes de valorar.',
  'Provisional, solo con evidencia ya acordada y observada: la explicación no corresponde al avance mostrado y no permite identificar qué parte se ha trabajado.',
 ]),row('progress-next','Seguimiento provisional: decisión por revisar',2,[
  'Provisional, con evidencia ya acordada y observada: explica una decisión por revisar o una duda sobre el siguiente paso y la relaciona de forma justificada con el avance mostrado.',
  'Provisional: la decisión o duda corresponde al avance; una relación con el siguiente paso necesita precisión.',
  'Provisional: indica una decisión o duda, pero su relación con el avance requiere aclaración.',
  'Provisional: plantea una decisión incompatible con lo mostrado sin explicar esa diferencia.',
  'Provisional, solo con evidencia ya acordada y observada: la decisión o duda presentada no tiene una relación reconocible con el avance mostrado ni con un siguiente paso posible.',
 ])].map(criterion=>({...criterion,observable:`Propuesta provisional: confirmar el producto, la evidencia y el propósito antes de cerrar criterios; lo aún no observado permanece pendiente y no recibe nivel. ${criterion.observable}`}))
}

export function markFirstGradeProvisional(proposal:InstrumentRecommendation,provisional:boolean):InstrumentRecommendation{
 if(!provisional)return proposal
 return {...proposal,confidence:'LOW',selectedCurriculumElements:[],internalTrace:{...proposal.internalTrace,lowCurriculumConfidence:true,mappingStatus:'UNMAPPED',reasons:[...proposal.internalTrace.reasons,'Seguimiento provisional: confirmar producto, evidencia y propósito; no acredita alineación curricular ni desempeño observado.']}}
}
