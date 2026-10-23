import {affirmativeLanguageTask} from './language-feature-criteria'
import {firstGradeDetectiveCriteria} from './secondary-detective-grade-one'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'

const criterion=(id:string,title:string,weight:number,levels:Criterion['progressionLevels']):Criterion=>({templateId:id,title,weight,observable:levels[0],progressionLevels:levels})
const replace=(rows:Criterion[],row:Criterion)=>[...rows.filter(r=>r.templateId!==row.templateId),row]
const join=(parts:string[])=>parts.length<2?parts[0]??'':parts.slice(0,-1).join(', ')+' y '+parts.at(-1)

/** Current release only. Historical criteria remain in their original exports. */
export function refineFirstGradeDetectiveRequirements(activity:string,description:string,initial:Criterion[]):Criterion[]{
 const task=affirmativeLanguageTask(description),writing=/WRITING|WRITTEN_PRODUCTION/.test(activity),narrating=activity==='DETECTIVE_STORY_NARRATION',creating=writing||narrating
 const analyzing=/ANALYSIS|REPORT/.test(activity),comparing=/COMPARISON/.test(activity)
 const planOnly=writing&&/planifi[cq]\w*|\bplan\b/.test(task)&&!/\b(?:escrib\w*|redact\w*)\b|\b(?:elabor\w*|cre\w*|hagan)\s+(?:(?:un|el)\s+)?cuento/.test(task)
 const correcting=writing&&/corrij|correg/.test(task)&&/unicamente|solo|exclusivamente/.test(task)&&/puntuacion|ortografia/.test(task)
 const editing=writing&&/edicion final/.test(task)&&/ya corregido/.test(task)
 const revising=writing&&/revis/.test(task)&&/borrador.*entregado/.test(task)
 const literaryOnly=analyzing&&/\b(?:solo|solamente|unicamente|exclusivamente)\b.*?(?:descripcion|dialogo|recursos|comparacion literaria|figura de comparacion)/.test(task)
 const linguisticOnly=analyzing&&/analic\w*\s+(?:solo|solamente|unicamente).*?recursos linguisticos/.test(task)
 let rows=initial
 const paratexts=join(([[/titulo/,'título'],[/imagen/,'imagen'],[/color/,'colores'],[/graficos/,'gráficos'],[/cubierta/,'cubierta']] as const).filter(([pattern])=>pattern.test(task)).map(([,name])=>name))
 const predictionOnly=analyzing&&/\b(?:solo|solamente|unicamente|exclusivamente)\b/.test(task)&&/anticip|predicci/.test(task)&&paratexts&&!/estructura|narrador|personajes|gramatica/.test(task)
 if(predictionOnly)return[criterion('detective-procedure-prediction','Predicción desde los recursos disponibles y comprobación',4,[
  `Formula una predicción del contenido desde ${paratexts}, relaciona los indicios disponibles con lo anticipado y la comprueba con hechos de la lectura que la confirman o modifican.`,
  'La predicción se apoya en indicios disponibles y se comprueba; una relación entre indicio y hecho leído necesita precisión.',
  'Describe indicios o propone una predicción, pero no relaciona su comprobación con hechos de la lectura.',
  'Atribuye a los recursos información ausente o da por confirmada una predicción que los hechos contradicen.',
  'No presenta una predicción sustentada ni una comprobación reconocible con los hechos leídos.',
 ])]
 if(correcting){
  const focus=task.split(/manteng|conserv/)[0],punctuation=/puntuacion/.test(focus),conventions=punctuation&&/ortografia/.test(focus)?'puntuación y ortografía':punctuation?'la puntuación':'la ortografía'
  return[criterion('detective-correction','Convenciones del diálogo conservado',4,[
  `Corrige ${conventions} del diálogo para reconocer quién habla, conservando exactamente contenido, personajes${!punctuation&&/puntuacion/.test(task)?', puntuación':''} y orden de los hechos.`,
  'Las convenciones corregidas permiten comprender el diálogo; queda un error aislado sin cambio del contenido.',
  'Corrige parte de las convenciones solicitadas, pero varios errores dificultan comprender las intervenciones.',
  'La corrección atribuye una intervención a otro personaje o altera contenido u orden de los hechos.',
  'No presenta una corrección reconocible de las convenciones del diálogo entregado.',
 ])]}
 if(editing){
  const media=join([/impresa/.test(task)?'impresa':'',/digital/.test(task)?'digital':''].filter(Boolean)),destination=/revista escolar/.test(task)?' para la revista escolar':''
  rows=initial.filter(r=>r.templateId==='detective-procedure-illustration')
  return[criterion('detective-edition','Edición para los medios solicitados',4,[
   `Prepara la edición ${media||'para el medio indicado'}${destination} con legibilidad y presentación que permiten seguir el relato; conserva el contenido del cuento ya corregido.`,
   'Las ediciones solicitadas conservan el contenido y se leen; un detalle de presentación dificulta localizar un pasaje.',
   'La presentación permite leer solo parte del relato en los medios solicitados.',
   'La edición cambia contenido del cuento corregido o su presentación impide seguir hechos centrales.',
   'No presenta una edición legible del cuento para los medios solicitados.',
  ]),...rows]
 }
 if(planOnly){
  rows=[criterion('detective-procedure-outline','Secuencia prevista del misterio',5,[
   'Organiza el plan en un esquema secuencial de inicio, nudo y desenlace que relaciona las pistas y la posible solución con la trama elegida.',
   'El esquema permite seguir el misterio previsto; una transición necesita relacionarse con una pista.',
   'Enumera momentos y pistas, pero no organiza su relación con la solución prevista.',
   'La solución prevista contradice las pistas o la secuencia de hechos del plan.',
   'No presenta un esquema reconocible del misterio previsto.',
  ])]
  if(/personajes|narrador|ambiente/.test(task))rows.push(criterion('detective-plan-characters','Personajes, narrador y ambiente previstos',4,[
   `Define en el plan ${/perfiles/.test(task)?'perfiles y motivaciones de los personajes, ':''}${/actan/.test(task)?'su papel actancial según la ficha, ':''}el narrador y el ambiente, relacionándolos con las acciones previstas.`,
   'Los componentes previstos se relacionan; un vínculo entre personaje, ambiente y acción necesita precisión.',
   'Nombra componentes, pero sus relaciones no permiten entender las acciones previstas.',
   'Las motivaciones o el ambiente previstos contradicen las acciones del plan o lo que el narrador puede saber.',
   'No define relaciones reconocibles entre personajes, narrador y ambiente en el plan.',
  ]))
 }
 if(analyzing&&!linguisticOnly&&!literaryOnly){
  const actantsOnly=/actantes/.test(task)&&!/estructura|inicio|nudo|desenlace|narrador|ambiente/.test(task)
  if(actantsOnly)rows=rows.filter(r=>r.templateId==='detective-feature-actants')
  else if(/parafras|predicci|anticip|reconstru/.test(task)){
   for(const r of firstGradeDetectiveCriteria('DETECTIVE_STORY_ANALYSIS',task)){
    if(!/-resources$|-evidence$/.test(r.templateId)&&!rows.some(x=>x.templateId===r.templateId))rows.push(r)
   }
  }
 }
 if(linguisticOnly||literaryOnly)rows=rows.filter(r=>r.templateId.startsWith('detective-feature-'))
 if(comparing){
  if(!/conclusion/.test(task))rows=rows.filter(r=>r.templateId!=='detective-conclusion')
  if(/narrador/.test(task)&&!rows.some(r=>r.templateId==='detective-feature-narrator'))rows=replace(rows,criterion('detective-narrator','Contraste de narradores',3,[
   'Compara quién narra y los límites de su información en ambos cuentos, con hechos de cada relato que sustentan semejanzas o diferencias.',
   'El contraste distingue los narradores; queda implícito un vínculo entre perspectiva e información disponible.',
   'Identifica narradores de ambos cuentos, pero no contrasta qué información puede conocer cada uno.',
   'Atribuye al narrador de un cuento información o perspectiva del otro.',
   'No presenta un contraste reconocible de los narradores de ambos cuentos.',
  ]))
  if(/ambiente/.test(task))rows=replace(rows,criterion('detective-characters','Personajes y ambientes en contraste',4,[
   'Compara personajes, motivaciones y la influencia del ambiente sobre las acciones, con hechos de ambos cuentos.',
   'El contraste relaciona personajes y ambientes; una influencia sobre las acciones necesita precisión.',
   'Enumera personajes y ambientes de ambos cuentos sin contrastar sus relaciones con las acciones.',
   'El contraste confunde personajes, ambientes o sus efectos entre ambos relatos.',
   'No contrasta personajes y ambientes de los dos cuentos.',
  ]))
 }
 if(narrating){
  rows=replace(rows,firstGradeDetectiveCriteria('DETECTIVE_STORY_WRITING',task).find(r=>r.templateId==='detective-narrator')!)
  rows=replace(rows,criterion('detective-mystery','Misterio narrado y resolución',5,[
   'Narra el misterio relacionando acciones y pistas con una solución que no contradice los hechos del relato.',
   'El relato relaciona pistas y solución; una relación causal necesita precisión.',
   'Comunica pistas y solución, pero deja sin relacionar parte de los hechos narrados.',
   'La solución narrada contradice las pistas o atribuye acciones a otro personaje.',
   'No comunica una relación reconocible entre misterio, pistas y solución.',
  ]))
  if(/tono|volumen|corporal/.test(task))rows=replace(rows,criterion('detective-voice','Expresión de las intervenciones',3,[
   'Usa tono y volumen de voz y lenguaje corporal, o el apoyo de comunicación acordado, para diferenciar intervenciones y transmitir la intención del relato.',
   'Las intervenciones se distinguen mediante los recursos acordados; una transición necesita claridad.',
   'Los recursos distinguen algunas intervenciones, pero otras se confunden.',
   'La expresión o el apoyo atribuye una intervención a otro personaje o contradice su intención.',
   'No permite reconocer las intervenciones mediante los recursos o el apoyo acordados.',
  ]))
 }
 if(!editing&&!correcting&&/entretener|intencion ludica/.test(task)&&(creating||planOnly))rows=replace(rows,criterion(planOnly?'detective-plan-purpose':'detective-purpose','Intención y destinatarios del relato',3,[
  `${planOnly?'Define en el plan cómo':'Construye el misterio para'} entretener a ${/revista/.test(task)?'los lectores de la revista escolar':'los lectores o participantes del curso'}, relacionando la selección de la trama con esa intención.`,
  'La trama responde a la intención y sus destinatarios; un detalle requiere adecuación.',
  'Propone un misterio, pero no mantiene su relación con la intención comunicativa y los destinatarios.',
  'La selección de hechos contradice la intención comunicativa o resulta ajena a sus destinatarios.',
  'No presenta una relación reconocible entre trama, intención y destinatarios.',
 ]))
 if(planOnly)return rows
 if(rows.some(r=>r.templateId==='detective-feature-literary')){
  const figures=([[/comparacion|simil/,'la comparación','establecer una semejanza explícita','la semejanza contradice los referentes comparados'],[/metafora/,'la metáfora','asociar referentes mediante una imagen figurada','la asociación figurada contradice el sentido del pasaje'],[/epiteto/,'el epíteto','destacar expresivamente una cualidad del referente','se atribuye la cualidad a un referente distinto']] as const).filter(([pattern])=>pattern.test(task))
  if(figures.length){
   const names=join(figures.map(([,name])=>name)),functions=figures.map(([,name,fn])=>`${name} permite ${fn}`).join('; ')
   const evidence=/ejemplo de cada/.test(task)?'con un ejemplo de cada recurso del cuento y su efecto':/el ejemplo presente/.test(task)?'con el ejemplo presente y su efecto':'con ejemplos presentes y su efecto'
   const target=!creating&&/ambiente/.test(task)?/ambiente o/.test(task)?' Explica cómo caracteriza el ambiente o expresa las acciones e intervenciones de los personajes.':' Explica cómo caracteriza el ambiente del fragmento.':''
   const poetry=criterion('detective-feature-literary','Función de los recursos literarios',3,[
    `${creating?'Emplea':'Explica'} ${names} ${creating?'en el relato para expresar sus hechos, personajes o ambiente':evidence}: ${functions}.${target}`,
    'Los recursos se relacionan con su función en el pasaje; un vínculo entre expresión y efecto necesita precisión.',
    creating?'Incluye los recursos solicitados, pero sus usos no contribuyen al sentido expresivo del relato.':'Identifica los recursos, pero no explica cómo su función contribuye al sentido del pasaje.',
    `El sentido se altera: ${figures.map(([, , ,error])=>error).join('; o ')}.`,
    creating?'No incorpora usos reconocibles de los recursos literarios solicitados.':'No aporta explicaciones reconocibles de los recursos literarios solicitados.',
   ])
   rows=replace(rows,{...poetry,...(/ejemplo de cada/.test(task)?{coveredDeliveryKeys:['quantity-ejemplo']}: {})})
  }
 }
 const dialogue=rows.find(r=>r.templateId==='detective-feature-dialogue')
 if(dialogue&&/descri[bp]|dialog/.test(task)){
  const describing=/descri[bp]/.test(task),speaking=/dialog/.test(task)
  const parts=[describing?'la descripción permite caracterizar personajes o ambiente':'',speaking?'el diálogo permite reconocer intervenciones e intercambios de los personajes':''].filter(Boolean)
  const targets=join([describing?'descripción':'',speaking?'diálogo':''].filter(Boolean))
  rows=replace(rows,{...criterion(dialogue.templateId,'Función de '+targets,3,[
   `${creating?'Emplea':'Explica'} los recursos solicitados ${creating?'en el relato':/ejemplo de cada/.test(task)?'con un ejemplo de cada recurso del cuento':'con ejemplos del cuento'}: ${parts.join('; ')}.`,
   'Los recursos cumplen su función; una relación con el sentido del pasaje necesita precisión.',
   creating?`Usa los recursos, pero no permiten ${join([describing?'caracterizar con claridad':'',speaking?'seguir los intercambios':''].filter(Boolean))}.`:`Identifica los recursos, pero no explica su aportación a ${join([describing?'la caracterización':'',speaking?'los intercambios':''].filter(Boolean))}.`,
   `Atribuye ${join([describing?'un rasgo':'',speaking?'una intervención':''].filter(Boolean))} a otro personaje y altera el sentido del pasaje.`,
   creating?'No emplea de manera reconocible los recursos solicitados.':'No explica de manera reconocible los recursos solicitados.',
  ]),...(/ejemplo de cada/.test(task)?{coveredDeliveryKeys:['quantity-ejemplo']}: {})})
 }
 const actants=rows.find(r=>r.templateId==='detective-feature-actants')
 if(actants){
  const named=/sujeto/.test(task)&&/destinador/.test(task)
  const selected=([[/sujeto|quien busca/,'quién busca'],[/objeto|que busca/,'qué busca'],[/destinador|quien impulsa/,'quién impulsa la búsqueda'],[/destinatario|quien se beneficia/,'quién se beneficia'],[/ayudant|quien ayuda/,'quién ayuda'],[/oponent|quien se opone/,'quién se opone']] as const).filter(([pattern])=>pattern.test(task)).map(([,fn])=>fn)
  const functions=named?'sujeto, objeto, destinador, destinatario, ayudante y oponente':selected.length?join(selected):'quién busca y qué busca, quién impulsa la búsqueda, quién se beneficia, quién ayuda y quién se opone'
  rows=replace(rows,criterion(actants.templateId,comparing?'Contraste de funciones actanciales':'Funciones actanciales del conflicto',3,[
   `${comparing?'Contrasta en ambos cuentos':'Relaciona en el cuento'} las funciones de los actantes${/ficha/.test(task)?' según la ficha':''} (${functions}) con hechos del relato; distingue cada función del nombre del personaje sin exigir un personaje diferente para cada papel.`,
   comparing?'Contrasta las funciones con hechos de ambos cuentos; una semejanza o diferencia necesita precisión.':'Los papeles se sustentan en hechos; una relación entre función y acción necesita precisión.',
   comparing?'Identifica papeles de ambos cuentos, pero no contrasta las relaciones entre sus funciones y acciones.':'Nombra personajes y algunas funciones, pero no relaciona todos los papeles solicitados con hechos.',
   'Atribuye a una función hechos contrarios a las acciones del personaje o invierte los papeles solicitados.',
   comparing?'No presenta un contraste reconocible de las funciones actanciales de ambos cuentos.':'No establece relaciones reconocibles entre las funciones actanciales solicitadas y los hechos.',
  ]))
 }
 rows=rows.map(r=>{
  if(r.templateId==='detective-feature-indicative'){
   const adapt=(s:string)=>s.replace('situaciones en desarrollo','situaciones de fondo o habituales').replace('con ejemplos presentes',/ejemplo de cada/.test(task)?'con un ejemplo de cada tipo':'con ejemplos presentes')
   return{...r,...(/ejemplo de cada/.test(task)?{coveredDeliveryKeys:['quantity-ejemplo']}:{}),observable:adapt(r.observable),progressionLevels:r.progressionLevels.map(adapt) as Criterion['progressionLevels']}
  }
  if(/detective-feature-(?:adjectives|adverbs|connectors)/.test(r.templateId)&&/ejemplo de cada/.test(task))return{...r,coveredDeliveryKeys:['quantity-ejemplo'],observable:r.observable.replace('con ejemplos presentes','con un ejemplo de cada tipo'),progressionLevels:r.progressionLevels.map(s=>s.replace('con ejemplos presentes','con un ejemplo de cada tipo')) as Criterion['progressionLevels']}
  return r
 })
 if(analyzing&&!linguisticOnly&&!literaryOnly){
  const listening=/escuch/.test(task)
  if(/centrales/.test(task)&&/secundarios/.test(task))rows=replace(rows,criterion('detective-characters','Personajes y motivaciones',3,[
   `Relaciona personajes centrales y secundarios, sus motivaciones y acciones con el desarrollo del misterio, sustentándose en hechos ${listening?'del audio escuchado':'del cuento leído'}.`,
   'Las relaciones se sostienen en hechos; una motivación necesita vincularse con su acción.',
   'Identifica personajes y acciones, pero solo relaciona parcialmente sus motivaciones con el misterio.',
   'Confunde las acciones o motivaciones de personajes centrales y secundarios.',
   'No relaciona personajes y motivaciones con los hechos disponibles.',
  ]))
  if(/funcion del cuento/.test(task))rows=replace(rows,criterion('detective-purpose','Función del cuento policíaco',3,[
   'Explica cómo el cuento organiza un misterio y su resolución para despertar interés y entretener, con hechos del relato.',
   'Relaciona la función con el misterio; un vínculo con los hechos necesita precisión.',
   'Nombra la función, pero no la relaciona con la organización del misterio.',
   'Atribuye al cuento una función incompatible con el relato disponible.',
   'No explica una función reconocible del cuento estudiado.',
  ]))
  if(listening&&/cerrad/.test(task)&&/abiert/.test(task))rows=replace(rows,criterion('detective-setting','Ambiente y acciones escuchadas',3,[
   'Explica con hechos del audio cómo el paso del espacio cerrado al abierto y de la ciudad al campo influye en las acciones de la búsqueda.',
   'Relaciona los ambientes con la búsqueda; una influencia necesita precisión.',
   'Distingue los ambientes, pero no explica su influencia sobre las acciones escuchadas.',
   'Atribuye a un ambiente hechos del otro o una influencia contraria al audio.',
   'No relaciona ambientes y acciones del cuento escuchado.',
  ]))
  if(rows.some(r=>r.templateId==='detective-procedure-paraphrase'))rows=replace(rows,criterion('detective-procedure-paraphrase',/resumen o parafrasis/.test(task)?'Resumen o paráfrasis global':'Paráfrasis global del cuento',3,[
   `Reconstruye ${/resumen o parafrasis/.test(task)?'mediante un resumen o paráfrasis':'mediante una paráfrasis con sus propias palabras'} el sentido global y las relaciones entre los hechos ${listening?'escuchados en el audio':'del cuento leído'}, sin añadir información ajena al relato.`,
   'Reconstruye las relaciones principales; una formulación necesita aclaración sin cambiar su sentido.',
   'Recupera hechos aislados, pero no reconstruye el sentido global del relato.',
   'Cambia el sentido de los hechos o añade información ajena al cuento disponible.',
   'No reconstruye de forma reconocible el sentido global del cuento.',
  ]))
  if(/anticip|predicci/.test(task)&&/titulo/.test(task)&&/cubierta/.test(task))rows=replace(rows,criterion('detective-procedure-prediction','Anticipación desde el paratexto y comprobación',3,[
   'Anticipa el contenido desde el título y la cubierta dados y contrasta la predicción con hechos de la lectura que la confirman o modifican.',
   'Relaciona la predicción y los indicios; un vínculo con la comprobación posterior necesita precisión.',
   'Formula una predicción, pero no la contrasta con los hechos leídos.',
   'Da por confirmada una predicción que contradice el cuento.',
   'No aporta una anticipación y comprobación reconocibles desde los paratextos dados.',
  ]))
 }
 if(creating&&/centrales/.test(task)&&/secundarios/.test(task))rows=replace(rows,criterion('detective-characters','Personajes y ambiente de la trama',4,[
  'Define perfiles de personajes centrales y secundarios y relaciona sus motivaciones, acciones y ambiente con la trama del misterio.',
  'Los perfiles y el ambiente sostienen la trama; una motivación necesita relacionarse con su acción.',
  'Presenta perfiles y ambiente, pero solo parte de las motivaciones se relaciona con las acciones.',
  'Los perfiles, motivaciones o el ambiente contradicen acciones centrales del relato.',
  'No presenta personajes y ambiente relacionados de manera reconocible con la trama.',
 ]))
 if(creating&&/borrador/.test(task)&&/sugerencias|observaciones/.test(task)){
  const justify=/justifi|senalen.*por que/.test(task),teacher=/profesora/.test(task)?'de la profesora':/profesor/.test(task)?'del profesor':/maestra/.test(task)?'de la maestra':/maestro/.test(task)?'del maestro':''
  const sources=join([/compan/.test(task)?'de compañeros':'',teacher].filter(Boolean)),parts=join([/descri[bp]/.test(task)?'descripciones':'',/dialogo/.test(task)?'diálogos':''].filter(Boolean))
  rows=replace(rows,criterion('detective-process-revision','Revisión con las observaciones disponibles',3,[
  `Revisa ${revising&&parts?'la claridad de '+parts+' en el borrador':'el borrador'} según las sugerencias ${sources||'disponibles'}${revising?`; conserva la trama y el narrador${justify?' y justifica las decisiones sobre qué sugerencias atendió y por qué':''}`:', corrigiendo escritura y claridad del relato'}.`,
  justify?'Los cambios atienden observaciones y se justifican; una decisión necesita vincularse con la dificultad señalada.':'Los cambios atienden las observaciones y aclaran el relato; queda un problema secundario sin resolver.',
  justify?'Realiza cambios, pero no relaciona sus decisiones con las observaciones recibidas.':'Realiza cambios de forma, pero mantiene problemas de escritura o claridad señalados en las observaciones.',
  'Los cambios contradicen las observaciones atendidas o alteran el contenido que debía conservarse.',
  'No aporta una revisión reconocible a partir de las observaciones disponibles.',
 ]))}
 if(writing&&!revising&&/publi/.test(task)&&/impresa/.test(task)&&/digital/.test(task))rows=replace(rows,criterion('detective-edition','Edición y publicación solicitadas',3,[
  'Prepara la versión impresa y digital del cuento para publicarlas en la revista escolar con legibilidad, conservando el contenido de la versión final revisada.',
  'Ambos formatos conservan la versión revisada; un detalle de presentación necesita ajuste.',
  'Solo uno de los formatos solicitados permite seguir la versión revisada del cuento.',
  'La edición altera hechos de la versión final o impide leer parte central del relato.',
  'No presenta versiones reconocibles para los medios solicitados.',
 ]))
 if(/inclusiv|excluy|ridiculiz/.test(task))rows=replace(rows,criterion('detective-vocabulary','Vocabulario apropiado e inclusivo',2,[
  `${revising?'Revisa el vocabulario del cuento para que sea apropiado e inclusivo, sustituyendo expresiones que excluyan o ridiculicen':'Emplea vocabulario apropiado al cuento e inclusivo, sin expresiones que excluyan o ridiculicen'}; conserva los hechos y referentes al comunicar las acciones.`,
  'El vocabulario mantiene referentes y trato inclusivo; una expresión necesita precisión.',
  'Varias expresiones dificultan reconocer referentes o no mantienen el trato inclusivo solicitado.',
  'El vocabulario cambia referentes de los hechos o introduce expresiones que excluyen o ridiculizan.',
  'No aporta expresiones comprensibles y pertinentes que permitan comprobar el vocabulario solicitado.',
 ]))
 const listening=analyzing&&/escuch/.test(task)&&!/\b(?:lean|leeran|leer)\b/.test(task)
 if(listening||narrating){
  const adapt=(s:string)=>listening?s.replace(/cuento leído/g,'cuento escuchado').replace(/\btexto\b/g,'audio'):s.replace(/\btexto\b/g,'relato oral')
  rows=rows.map(r=>({...r,observable:adapt(r.observable),progressionLevels:r.progressionLevels.map(adapt) as Criterion['progressionLevels']}))
 }
 return rows
}
