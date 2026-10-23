import {affirmativeLanguageTask} from './language-feature-criteria'
import {commonSecondaryLanguageGrade,type SecondaryTopicContext} from './secondary-language-topics'
import {completeFirstGradeNewsCriteria,completeFirstGradeDetectiveCriteria} from './secondary-language-grade-one-complete'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'
import {firstGradeFocusedTask,firstGradeFocusedCriteria,type FirstGradeFocusedTask} from './secondary-language-grade-one-focused'
import {firstGradeCommunityTask,firstGradeCommunityCriteria,firstGradeCommunitySelections,type FirstGradeCommunityTask} from './secondary-language-grade-one-community'
export {markFirstGradeProvisional} from './secondary-language-grade-one-focused'

type Family='SCIENCE_NEWS'|'SCIENCE_PARAPHRASE'|'SCIENCE_READING'|'CIVIC_PROJECT'|'ARGUMENT'|'STORY_VALUES'|'CALLIGRAM_COMMENT'|'FOCUSED'|'COMMUNITY'
type Mode='PRODUCTION'|'PLAN'|'COMPARISON'|'REVISION'|'READING'
export type FirstGradeTransversalTask={family:Family;mode:Mode;task:string;description:string;activityType:string;focused?:FirstGradeFocusedTask;community?:FirstGradeCommunityTask}

/** Scope comes from the official first-grade competencies, not the subject of a title. */
export function resolveFirstGradeTransversalTask(title:string,description:string,context:SecondaryTopicContext|null|undefined):FirstGradeTransversalTask|null{
 if(commonSecondaryLanguageGrade(context)!==1)return null
 const task=affirmativeLanguageTask(description||title)
 const result=(family:Family,mode:Mode,activityType:string):FirstGradeTransversalTask=>({family,mode,task,description,activityType})
 const community=firstGradeCommunityTask(task,description||title)
 if(community)return {...result('COMMUNITY','PRODUCTION',community.activityType),community}
 const focused=firstGradeFocusedTask(task)
 if(focused)return {...result('FOCUSED','PRODUCTION',focused.activityType),focused}
 if(/caligrama/.test(task)&&/interpretacion de (?:una? )?compan|interpretacion.*companera|coincidencia o (?:una )?diferencia.*lecturas/.test(task)&&/comentario/.test(task))return result('CALLIGRAM_COMMENT','READING','CALLIGRAM_ANALYSIS')
 if(/cuento policiaco/.test(task)&&/valores|dignidad|convivencia/.test(task)){
  const reading=/\b(?:lean|lee|leer|analic\w*|analiz\w*)\b/.test(task)&&!/\b(?:escrib\w*|redact\w*|cre\w*)\s+(?:un )?cuento/.test(task)
  return result('STORY_VALUES',reading?'READING':'PRODUCTION',reading?'DETECTIVE_STORY_ANALYSIS':'DETECTIVE_STORY_WRITING')
 }
 if(/\bdebate\b/.test(task)&&/hecho|analogia|contraargumento/.test(task))return result('ARGUMENT','PRODUCTION','DEBATE')
 if(/proyectos? (?:de ciudadania|ciudadano)|proyecto.*(?:dignidad|igualdad)/.test(task)){
  const mode:Mode=/\b(?:revis\w*|corrij\w*)\b.*\b(?:solamente|solo|unicamente)\b.*recomendacion/.test(task)?'REVISION'
   :/compar\w*.*proyectos|contrast\w*.*proyectos/.test(task)?'COMPARISON'
    :/\bplan\b/.test(task)?'PLAN':'PRODUCTION'
  return result('CIVIC_PROJECT',mode,mode==='COMPARISON'?'COMPARISON':'PROJECT')
 }
 const scientific=/investigacion|hallazgos? cientific|hallazgos.*registro|hallazgos.*ficha/.test(task)
 if(scientific&&/noticia|noticiero/.test(task))return result('SCIENCE_NEWS','PRODUCTION',/noticiero/.test(task)?'NEWSCAST':'NEWS_WRITING')
 if(scientific&&/propias palabras|parafras/.test(task))return result('SCIENCE_PARAPHRASE','PRODUCTION','WRITTEN_PRODUCTION')
 if(scientific&&/\b(?:lean|lee|leer|analic\w*|analiz\w*)\b.*informe/.test(task))return result('SCIENCE_READING','READING','ANALYSIS')
 return null
}
const row=(id:string,title:string,weight:number,levels:Criterion['progressionLevels']):Criterion=>({templateId:'len1-transversal-'+id,title,weight,observable:levels[0],progressionLevels:levels,fourLevelLowest:`${levels[3]} O bien: ${levels[4]}`})
const join=(parts:string[])=>parts.length<2?parts[0]??'':parts.slice(0,-1).join(', ')+' y '+parts.at(-1)
export function firstGradeTransversalSelections(spec:FirstGradeTransversalTask){
 if(spec.community)return firstGradeCommunitySelections(spec.community)
 return{suggestedEvaluationTechnique:spec.focused?.kind==='PROGRESS'?'observacion':spec.activityType==='DEBATE'?'debate':spec.activityType==='NEWSCAST'?'exposicion':'analisis-producciones',suggestedInstrumentType:'rubrica' as const}
}

export function firstGradeTransversalCriteria(spec:FirstGradeTransversalTask):Criterion[]{
 if(spec.community)return firstGradeCommunityCriteria(spec.community)
 if(spec.focused)return firstGradeFocusedCriteria(spec.focused)
 const {family,mode,task,description,activityType}=spec
 if(family==='SCIENCE_NEWS'||family==='SCIENCE_PARAPHRASE'||family==='SCIENCE_READING'){
  const reading=family==='SCIENCE_READING',paraphrase=family==='SCIENCE_PARAPHRASE',oral=activityType==='NEWSCAST'
  const rows:Criterion[]=[]
  if(family==='SCIENCE_NEWS'){
   const base=completeFirstGradeNewsCriteria(activityType,description)
   // One joint investigation does not imply one separate news item per team member.
   if(!oral)rows.push(...base.filter(r=>/news-structure|news-feature/.test(r.templateId)))
   else rows.push(row('science-oral','Comunicación comprensible del hallazgo',3,[
    'Organiza las intervenciones del noticiero para que el curso siga el hallazgo y la relación entre sus datos; comunica la información de forma comprensible sin exagerar su alcance.',
    'El curso puede seguir la información presentada; una transición o expresión necesita precisión.',
    'Se comprenden datos aislados, pero las intervenciones no permiten seguir suficientemente su relación con el hallazgo.',
    'La expresión o el orden de las intervenciones altera la relación entre los datos y el hallazgo.',
    'No comunica información reconocible que permita seguir el hallazgo presentado.',
   ]))
  }
  rows.push(row('science-process','Relación entre proceso, datos y conclusión',5,[
   `${reading?'Reconstruye a partir del informe':paraphrase?'Explica con sus propias palabras':'Comunica'} ${paraphrase?'la relación entre el procedimiento descrito, los datos y la conclusión de los hallazgos científicos y sociales de ambas fichas':'la pregunta, el procedimiento de observación y los resultados del registro dado, relacionando esos datos con la conclusión'} sin alterar la información entregada.`,
   'La relación entre procedimiento, datos y conclusión corresponde al material; una conexión necesita mayor precisión.',
   'Presenta parte del proceso y sus datos, pero no explica suficientemente cómo sostienen la conclusión.',
   'Atribuye al procedimiento datos que no produjo o una conclusión incompatible con los registros disponibles.',
   'No comunica una relación reconocible entre el proceso, sus datos y la conclusión del material dado.',
  ]))
  rows.push(row('science-evidence','Alcance de las afirmaciones',5,[
   reading?'Contrasta las afirmaciones de la conclusión con los datos del informe; distingue cuáles se sostienen y cuál va más allá, apoyándose en fragmentos concretos.'
    :paraphrase?'Distingue cada hallazgo de una opinión y explica qué permiten concluir los datos de las fichas, sin añadir afirmaciones ajenas.'
     :'Distingue los resultados registrados de una interpretación posible y explicita un límite de la conclusión según los datos disponibles.',
   'Distingue evidencia e interpretación y respeta el alcance de los datos; una afirmación necesita precisar su apoyo.',
   'Reconoce datos relevantes, pero presenta parte de las interpretaciones como si fueran resultados comprobados.',
   'Sostiene afirmaciones que contradicen o exceden los datos y no reconoce ese límite de la conclusión.',
   'No diferencia afirmaciones sustentadas de interpretaciones sin apoyo en el material.',
  ]))
  rows.push(row('science-source',paraphrase?'Procedencia y paráfrasis fiel':'Procedencia reconocible de la información',3,[
   paraphrase?'Expresa las ideas con sus propias palabras conservando el sentido y los datos científicos y sociales; identifica de cuál de ambas fichas procede cada idea.'
    :oral?'Reconoce oralmente la ficha de la que proceden los datos, de modo que el curso pueda distinguir la información entregada de la interpretación presentada.'
     :reading?'Vincula cada explicación con fragmentos identificables del informe que permiten comprobar la correspondencia entre proceso, datos y afirmaciones.'
      :'Reconoce la fuente del registro y las referencias de los materiales usados para que la información de la noticia pueda comprobarse.',
   paraphrase?'Reformula las ideas conservando su sentido y procedencia; una expresión propia necesita precisión sin cambiar el hallazgo.':'Las ideas se pueden relacionar con su fuente; una atribución o formulación necesita precisión.',
   paraphrase?'Combina formulaciones propias con fragmentos copiados; se reconoce parte de la explicación, pero otras ideas no se reformulan suficientemente.':'Parte de las ideas tiene procedencia reconocible, pero otras no se pueden vincular al material correspondiente.',
   paraphrase?'Copia pasajes sin reformular o atribuye a una ficha datos que no contiene.':'Atribuye a la fuente datos o afirmaciones que no contiene.',
   'No ofrece una relación reconocible entre la información comunicada y su fuente.',
  ]))
  if(family==='SCIENCE_NEWS'&&/digital|anonim/.test(task))rows.push(row('science-digital','Edición digital responsable para su audiencia',3,[
   `Prepara la edición digital para el espacio comunitario escolar con información legible, fuentes reconocibles${/anonim/.test(task)?' y datos anónimos que evitan identificar personas reales':''}; la edición permite entender el hallazgo sin exagerarlo.`,
   'La edición permite consultar la información y su procedencia de forma responsable; un detalle de legibilidad necesita ajuste.',
   'La edición digital comunica parte del hallazgo, pero dificulta consultar información o referencias necesarias.',
   /anonim/.test(task)?'La edición incorpora datos que identifican personas reales o presenta la simulación como un hallazgo real comprobado.':'La edición altera los datos o atribuye a la fuente afirmaciones ausentes.',
   'No presenta una edición digital reconocible y consultable de la noticia solicitada.',
  ]))
  return rows
 }
 if(family==='CIVIC_PROJECT'){
  if(mode==='REVISION')return[row('civic-recommendation','Recomendación viable y alcance conservado',5,[
   'Revisa la recomendación para responder al problema de forma viable según los datos y las acciones previstas; conserva el problema, el objetivo, las acciones, los responsables y los tiempos del proyecto.',
   'La recomendación responde al problema y conserva el proyecto; una relación entre viabilidad y datos necesita precisión.',
   'La recomendación responde parcialmente al problema, pero no explica suficientemente su viabilidad con los datos disponibles.',
   'La recomendación contradice los datos o cambia elementos del proyecto que debía conservar.',
   'No presenta una recomendación revisada reconocible y relacionada con el problema del proyecto.',
  ])]
  if(mode==='COMPARISON')return[
   row('civic-comparison','Coherencia de ambos proyectos con el caso',5,[
    'Contrasta en ambos proyectos cómo los objetivos, las acciones, los responsables y los tiempos responden al problema y a los datos del caso, explicando sus diferencias relevantes.',
    'El contraste relaciona los componentes de ambos proyectos con el caso; una diferencia necesita precisión.',
    'Describe componentes de los proyectos por separado, pero no explica suficientemente su relación con los datos del caso.',
    'Atribuye a un proyecto componentes del otro o considera coherentes acciones incompatibles con los datos.',
    'No presenta un contraste reconocible entre los proyectos y el problema del caso.',
   ]),
   row('civic-comparison-equality','Dignidad e igualdad en las propuestas',4,[
    'Explica con acciones concretas de ambos proyectos cómo cada propuesta considera la dignidad y la igualdad de las personas del caso; evalúa las propuestas sin juzgar a sus autores.',
    'El análisis se apoya en acciones de ambos proyectos; una relación con dignidad o igualdad necesita precisión.',
    'Menciona dignidad e igualdad, pero no explica suficientemente cómo se reflejan en las acciones comparadas.',
    'Atribuye a una propuesta efectos contrarios a sus acciones o sustituye su análisis por descalificaciones personales.',
    'No relaciona acciones de las propuestas con la dignidad o la igualdad en el caso.',
   ]),
   row('civic-comparison-viability','Viabilidad justificada de las recomendaciones',4,[
    'Justifica qué recomendación es más viable comparando sus acciones y tiempos con la información disponible para atender el problema del caso.',
    'La elección se sostiene en el caso; una relación entre recomendación y viabilidad necesita precisión.',
    'Elige una recomendación, pero solo parte de las razones se apoya en las condiciones disponibles.',
    'Justifica la elección con datos ajenos al caso o incompatibles con las acciones previstas.',
    'No ofrece una elección sustentada entre las recomendaciones de los proyectos.',
   ]),
  ]
  const plan=mode==='PLAN',dignity=/dignidad/.test(task),time=/calendario/.test(task)?'calendario':'secuencia temporal'
  const rows=[row('civic-problem',plan?'Problema que orienta el plan':'Problema sustentado en el caso',4,[
   `Describe el problema con los datos del caso ficticio y explica qué necesidad debe atender ${plan?'el plan':'el proyecto'}, sin atribuir a personas reales información ajena.`,
   'El problema se apoya en los datos disponibles; una relación con la necesidad identificada necesita precisión.',
   'Describe parte del problema, pero no vincula suficientemente la necesidad con los datos del caso.',
   'La formulación del problema contradice los datos o atribuye al caso hechos ausentes.',
   'No presenta un problema reconocible sustentado en la información del caso.',
  ]),row('civic-plan','Coherencia de objetivo y acciones previstas',5,[
   `Relaciona un objetivo con acciones previstas que responden al problema; identifica responsables y un ${time==='calendario'?'calendario coherente':'orden en la secuencia temporal'} que permite comprender cómo se realizarían.`,
   'El objetivo y las acciones responden al problema; una relación entre responsables y tiempos necesita precisión.',
   'Propone un objetivo y acciones, pero deja responsabilidades o tiempos sin relación suficiente con lo previsto.',
   'Las acciones contradicen el objetivo o asignan responsabilidades y tiempos incompatibles entre sí.',
   'No presenta una relación reconocible entre objetivo, acciones previstas, responsables y tiempos.',
  ]),row('civic-equality',dignity?'Dignidad e igualdad en las acciones':'Igualdad de acceso en el plan',4,[
   `Explica cómo las acciones previstas toman en cuenta ${dignity?'la dignidad y la igualdad de quienes usan el espacio':'la igualdad de acceso a los espacios de lectura'}, con relaciones concretas entre la propuesta y el caso.`,
   'Las acciones se relacionan con el trato propuesto; una relación con las condiciones del caso necesita precisión.',
   'Menciona el trato igualitario, pero no explica suficientemente cómo se refleja en las acciones previstas.',
   'Presenta como igualitario un trato que contradice las condiciones o excluye a personas del caso sin fundamento.',
   'No relaciona las acciones propuestas con la igualdad de acceso en el caso.',
  ])]
  if(/acuerdo/.test(task)&&/opinion/.test(task))rows.push(row('civic-dialogue','Acuerdo y consideración de una opinión diferente',3,[
   'Registra un acuerdo del equipo y una opinión diferente; explica cómo la consideraron con razones y sin descalificar a quien la expresó, aunque no la adopten.',
   'El acuerdo y la opinión diferente se reconocen; una razón sobre su consideración necesita precisión.',
   'Registra el acuerdo y la opinión, pero no explica suficientemente cómo se consideró la diferencia.',
   'Distorsiona la opinión diferente o sustituye su consideración por descalificaciones personales.',
   'No presenta evidencia reconocible del acuerdo y de la consideración de una opinión diferente.',
  ]))
  if(/recomendacion/.test(task))rows.push(row('civic-viability','Recomendación viable para el caso',3,[
   'Formula una recomendación viable que responde al problema y se sostiene en los datos, las acciones y los tiempos previstos del proyecto.',
   'La recomendación responde al caso; una relación con las condiciones previstas necesita precisión.',
   'Propone una recomendación relacionada con el problema, pero no sustenta suficientemente su viabilidad.',
   'La recomendación contradice los datos o requiere condiciones incompatibles con el proyecto.',
   'No presenta una recomendación reconocible y sustentada en el caso.',
  ]))
  return rows
 }
 if(family==='ARGUMENT'){
  const rows=[row('argument-position','Postura y razones del debate',5,[
   'Expresa una postura sobre la propuesta del caso y explica razones que la sostienen durante el debate oral, relacionándolas con lo discutido.',
   'La postura y las razones se relacionan con el caso; una conexión argumentativa necesita precisión.',
   'Expresa una postura, pero parte de las razones no explica por qué debe sostenerse.',
   'Las razones contradicen la postura o se apoyan en afirmaciones ajenas al caso.',
   'No comunica una postura reconocible y apoyada en razones sobre la propuesta.',
  ])]
  const components=join([/hecho/.test(task)?'el hecho procede del caso':'',/ejemplo/.test(task)?'el ejemplo concreta la situación que sustenta la postura':'',/analogia/.test(task)?'la analogía explica una semejanza pertinente que ayuda a comprender la razón':''].filter(Boolean))
  if(components)rows.push({...row('argument-support','Función de los apoyos argumentativos',4,[
   `Relaciona los apoyos con la postura: ${components}, sin tratarlos como pruebas intercambiables.`,
   'Los apoyos cumplen funciones pertinentes; una relación con la razón necesita precisión.',
   'Nombra los apoyos solicitados, pero no explica suficientemente cómo sostienen la postura.',
   'Atribuye al caso hechos ausentes o usa una semejanza o situación que contradice la razón que pretende sostener.',
   'No aporta apoyos reconocibles que permitan comprender o sostener la postura.',
  ]),coveredDeliveryKeys:['quantity-ejemplo']})
  if(/contraargumento|respond/.test(task))rows.push(row('argument-response','Escucha y respuesta razonada al contraargumento',4,[
   'Recupera fielmente el contraargumento escuchado y ofrece una respuesta con razones que atienden su contenido, sin descalificar a quien lo expresó.',
   'La respuesta atiende el contraargumento sin descalificaciones; una razón necesita precisión.',
   'Reconoce el contraargumento, pero responde con una afirmación que no explica suficientemente su posición frente a él.',
   'Distorsiona el contraargumento o reemplaza la respuesta razonada por descalificaciones personales.',
   'No ofrece una respuesta reconocible al contenido del contraargumento escuchado.',
  ]))
  if(/conclusion/.test(task))rows.push(row('argument-conclusion','Conclusión vinculada con el intercambio',3,[
   'Formula una conclusión coherente con la postura, las razones y el contraargumento discutidos, sin introducir datos nuevos ajenos al caso.',
   'La conclusión corresponde al intercambio; una relación con las razones necesita precisión.',
   'Cierra con una postura, pero no relaciona suficientemente la conclusión con lo discutido.',
   'La conclusión contradice las razones expuestas o afirma datos ajenos al caso.',
   'No comunica una conclusión reconocible del intercambio argumentativo.',
  ]))
  return rows
 }
 if(family==='STORY_VALUES'){
  if(mode==='READING')return[
   row('story-values','Valores en decisiones y consecuencias narradas',5,[
    'Interpreta las actitudes y los valores que muestran las decisiones de los personajes del cuento, relacionando acciones, diálogo y consecuencias en la trama como evidencia.',
    'La interpretación se apoya en decisiones y evidencia del cuento; una relación con sus consecuencias necesita precisión.',
    'Nombra actitudes o valores, pero no explica suficientemente cómo se muestran en decisiones, acciones o diálogo.',
    'Atribuye a los personajes decisiones o valores que contradicen sus acciones y consecuencias en la trama.',
    'No presenta una interpretación reconocible de actitudes o valores apoyada en el cuento.',
   ]),row('story-interpretations','Contraste de interpretaciones del mismo cuento',4,[
    'Contrasta dos interpretaciones posibles del mismo cuento con indicios de sus acciones y diálogos; distingue la inferencia de lo dicho explícitamente sin atribuir al autor ideas sin apoyo.',
    'El contraste se sostiene en el cuento; una relación entre interpretación e indicio necesita precisión.',
    'Presenta interpretaciones posibles, pero solo parte de sus diferencias tiene apoyo en el cuento.',
    'Atribuye al cuento o al autor ideas que contradicen los indicios o trata su interpretación como información literal.',
    'No contrasta interpretaciones reconocibles apoyadas en el mismo cuento.',
   ]),
  ]
  const base=completeFirstGradeDetectiveCriteria(activityType,description)
  return [...base,row('story-decisions','Decisiones, indicios y consecuencias para la convivencia',4,[
   'Muestra mediante acciones y diálogo cómo las decisiones de acusar sin pruebas o buscar indicios afectan la convivencia y la dignidad de los personajes ficticios.',
   'Las decisiones y sus consecuencias se reconocen en la trama; una relación con el diálogo o los indicios necesita precisión.',
   'Menciona decisiones o valores, pero las acciones y el diálogo no muestran suficientemente su efecto en la convivencia.',
   'Las consecuencias para la convivencia o la dignidad contradicen las decisiones y acciones narradas.',
   'No muestra decisiones y consecuencias reconocibles para la convivencia de los personajes en la trama.',
  ])]
 }
 if(family==='CALLIGRAM_COMMENT')return[
  row('calligram-emotion','Emoción representada mediante palabras y figura',5,[
   'Explica la emoción ficticia representada en el caligrama con indicios de sus palabras y de la figura, relacionándolos para sostener su interpretación.',
   'La interpretación relaciona emoción, palabras y figura; una conexión necesita precisión.',
   'Reconoce palabras y figura, pero explica parcialmente cómo representan la emoción del poema.',
   'Atribuye al poema una emoción incompatible con sus palabras o con la figura disponible.',
   'No presenta una interpretación reconocible de la emoción representada con indicios del caligrama.',
  ]),row('calligram-peer','Consideración razonada de otra interpretación',4,[
   'Recupera fielmente la interpretación de la compañera e indica una coincidencia o una diferencia con razones apoyadas en el poema, sin insultos ni burlas y sin necesitar acuerdo.',
   'Considera la interpretación ajena con razones; una relación entre coincidencia o diferencia y poema necesita precisión.',
   'Indica coincidencia o diferencia, pero no explica suficientemente sus razones con el poema.',
   'Distorsiona la interpretación ajena o sustituye las razones por insultos o burlas.',
   'No presenta una consideración reconocible y razonada de la interpretación ajena.',
  ]),
 ]
 return []
}
