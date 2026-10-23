import {affirmativeLanguageTask} from './language-feature-criteria'
import {normalizedTask,commonSecondaryLanguageGrade,type SecondaryTopicContext} from './secondary-language-topics'
import type {ContextualTopicCriterion as Criterion} from './secondary-topic-criteria'

type Genre='CATALOGUE'|'RECIPE'|'OPINION'|'INSTRUCTIONS'
type Mode='CREATION'|'COMPARISON'|'ANALYSIS'|'CORRECTION'
export type FirstGradeHealthGenreTask={genre:Genre;mode:Mode;task:string;originalTask:string;activityType:'WRITTEN_PRODUCTION'|'COMPARISON'|'ANALYSIS'}
const namedGenre=(s:string)=>([[/articulos? de opinion/,'OPINION'],[/catalogos?/,'CATALOGUE'],[/recetas?/,'RECIPE'],[/instructivos?/,'INSTRUCTIONS']] as const)
 .map(([pattern,genre])=>({genre,index:s.search(pattern)})).filter(r=>r.index>=0).sort((a,b)=>a.index-b.index)[0]
const join=(parts:string[])=>parts.length<2?parts[0]??'':parts.slice(0,-1).join(', ')+' y '+parts.at(-1)

/** These genres are named in indicator75, not new concept headings of69–74. */
export function resolveFirstGradeHealthGenre(title:string,description:string,context:SecondaryTopicContext|null|undefined):FirstGradeHealthGenreTask|null{
 if(commonSecondaryLanguageGrade(context)!==1)return null
 const originalTask=normalizedTask(description||title)
 const withoutConversion=(description||title).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/\bno\s+(?:(?:lo|la|los|las)\s+)?pas(?:en|ar|aran)\b[^.;\n]*/g,' ')
 const task=affirmativeLanguageTask(withoutConversion),named=namedGenre(task)
 const legacy=task.search(/informe(?:s)? de lectura|cuentos? (?:policiacos?|detectivescos?)|caligramas?|guias? turisticas?|afiches?|noticias?|noticiero/)
 if(legacy>=0&&(!named||legacy<named.index))return null
 const selected=named?.genre??namedGenre(normalizedTask(title))?.genre;if(!selected)return null
 const correction=/\b(?:solo|solamente|unicamente)\b/.test(task)&&/\b(?:corrij\w*|correg\w*|revis(?:en|an|a|e|ar|aran)|reescrib\w*|mejor(?:en|an|a|e|ar|aran))\b/.test(task)
 const mode:Mode=correction?'CORRECTION':/\bcompar\w*\b/.test(task)?'COMPARISON':/\b(?:lean|lee|leer|analic\w*|analiz\w*)\b/.test(task)?'ANALYSIS':'CREATION'
 return{genre:selected,mode,task,originalTask,activityType:mode==='COMPARISON'?'COMPARISON':mode==='ANALYSIS'?'ANALYSIS':'WRITTEN_PRODUCTION'}
}
const row=(id:string,title:string,weight:number,levels:Criterion['progressionLevels']):Criterion=>({templateId:'len1-health-'+id,title,weight,observable:levels[0],progressionLevels:levels})

export function firstGradeHealthGenreCriteria({genre:g,mode,task,originalTask}:FirstGradeHealthGenreTask):Criterion[]{
 const correction=mode==='CORRECTION',comparing=mode==='COMPARISON',analyzing=mode==='ANALYSIS'
 const correctionFocus=task.split(/\b(?:manteng\w*|conserv\w*)\b/)[0]
 if(g==='CATALOGUE'){
  if(correction){
  const fields=join([/nombre/.test(correctionFocus)?'el nombre':'',/rasgos/.test(correctionFocus)?'los rasgos':'',/habitat/.test(correctionFocus)?'el hábitat':'',/fuente/.test(correctionFocus)?'la fuente':''].filter(Boolean))||'los datos señalados'
  const preservation=originalTask.split(/\b(?:manteng\w*|conserv\w*)\b/).slice(1).join(' ')
  const preserved=join([/nombre/.test(preservation)?'el nombre':'',/rasgos/.test(preservation)?'los rasgos':'',/fuente/.test(preservation)?'la fuente':'',/entradas/.test(preservation)?'las demás entradas':'',/orden/.test(preservation)?'su orden':'',/ilustracion/.test(preservation)?'las ilustraciones':''].filter(Boolean))||'los otros datos de la entrada y del catálogo'
  return[row('catalogue-correction','Datos de la entrada señalada',5,[
   `Corrige ${fields} de la entrada señalada según la ficha; conserva ${preserved}.`,
   'Los datos corregidos corresponden a la ficha y el resto del catálogo se conserva; queda una precisión de escritura.',
   fields==='el hábitat'?'Corrige el hábitat parcialmente, pero conserva una imprecisión respecto de la ficha.':'Corrige parte de los datos señalados, pero mantiene otro que no corresponde a la ficha.',
   `La corrección introduce un dato incompatible con la ficha o cambia ${preserved} que debía conservar.`,
   'No presenta una corrección comprobable de los datos señalados en la entrada.',
  ])]}
  if(comparing||analyzing)return[
   row('catalogue-consultation','Organización y consulta del catálogo',4,[
    'Contrasta cómo la clasificación y la organización de las entradas permiten localizar información en los catálogos entregados; explica el efecto de las diferencias en la consulta.',
    'El contraste explica la consulta de ambos catálogos; una relación entre organización y localización necesita precisión.',
    'Describe la organización de los catálogos por separado, sin explicar parte de sus efectos en la consulta.',
    'Atribuye a un catálogo una clasificación o una forma de consulta que corresponde al otro.',
    'No explica diferencias comprobables en la clasificación o consulta de los catálogos dados.',
   ]),
   row('catalogue-reference','Fidelidad de nombres y hábitats',4,[
    'Comprueba los nombres y los hábitats de las entradas frente a las fichas de referencia e identifica las diferencias que cambian la información.',
    'El contraste se apoya en las fichas; una correspondencia entre entrada y referencia necesita precisión.',
    'Señala diferencias, pero parte de ellas no se comprueba con las fichas.',
    'Presenta como fiel un dato que contradice la ficha o atribuye a ella información ausente.',
    'No contrasta los datos de las entradas con las fichas disponibles.',
   ]),
  ]
  const rows=[row('catalogue-grouping','Entradas de flora y fauna para consultar',4,[
   'Organiza las entradas de flora y fauna dominicanas en grupos reconocibles y con identificaciones que permiten consultar las fichas del catálogo.',
   'Los grupos y las entradas se reconocen; una identificación dificulta localizar una ficha.',
   'Presenta entradas identificables, pero mezcla parte de los grupos y dificulta su consulta.',
   'La clasificación atribuye una entrada a un grupo incompatible con su ficha.',
   'No presenta entradas organizadas que permitan reconocer flora y fauna en el catálogo.',
  ]),row('catalogue-data','Datos fieles a las fichas',4,[
   /rasgos|habitat|fuente/.test(task)?'Presenta en cada entrada el nombre, los rasgos, el hábitat y la fuente que constan en la ficha, sin sustituirlos por datos ajenos.':'Presenta datos identificables de cada entrada que corresponden a las fichas entregadas y permiten consultar su contenido.',
   'Los datos corresponden a las fichas; una relación entre dato y entrada necesita precisión.',
   'Parte de los datos corresponde a la ficha, pero hay omisiones que dificultan identificar la entrada.',
   'Atribuye a una entrada datos de otra o información que contradice la ficha.',
   'No aporta datos comprobables de las fichas en las entradas del catálogo.',
  ])]
  if(/conservacion/.test(task))rows.push(row('catalogue-conservation','Orientación de conservación sustentada',3,[
   'Incluye la orientación de conservación indicada en la ficha y la relaciona con la entrada correspondiente, sin inventar datos o efectos.',
   'La orientación corresponde a la ficha; una relación con la entrada necesita precisión.',
   'Menciona conservación, pero no relaciona suficientemente la orientación con los datos entregados.',
   'La orientación contradice la ficha o se atribuye a una entrada distinta.',
   'No incluye una orientación de conservación comprobable en el material entregado.',
  ]))
  if(/indice/.test(task))rows.push(row('catalogue-index','Índice para localizar las entradas',3,[
   `Organiza un índice cuyas identificaciones remiten a las entradas ${/digital/.test(task)?'de la versión digital':/manuscrit|cuaderno/.test(task)?'del catálogo manuscrito en el cuaderno':'del catálogo en el medio elegido'} y permiten localizarlas.`,
   'El índice permite localizar las entradas; una remisión necesita precisión.',
   'El índice identifica parte de las entradas, pero otras no pueden localizarse con sus remisiones.',
   'Las remisiones del índice conducen a entradas diferentes de las anunciadas.',
   'No presenta un índice que permita localizar entradas del catálogo.',
  ]))
  return rows
 }
 if(g==='RECIPE'){
  if(correction)return[row('recipe-verbs','Acciones de la receta en imperativo',5,[
   'Revisa los verbos en imperativo para aclarar las acciones de la receta; conserva exactamente ingredientes, cantidades, orden y contenido de los pasos.',
   'Los imperativos aclaran las acciones y conservan el procedimiento; queda una forma verbal por precisar.',
   'Parte de los verbos aclara la acción, pero otros no permiten reconocer qué se debe hacer.',
   'La revisión cambia ingredientes, cantidades u orden y altera el procedimiento original.',
   'No presenta una revisión reconocible de los verbos de las acciones dadas.',
  ])]
  if(comparing||analyzing){
  const onlyQuantities=/compar\w*\s+(?:unicamente|solo|solamente)\s+las cantidades/.test(task)
  return[row('recipe-comparison',onlyQuantities?'Cantidades de las versiones':'Cantidades y orden del procedimiento',5,[
   onlyQuantities?'Contrasta las cantidades de ingredientes de ambas versiones con la ficha original y explica cuáles cambiaron respecto de la referencia.':'Contrasta las cantidades y el orden de las acciones de ambas versiones con la ficha; explica qué cambios impiden seguir el procedimiento original de la receta.',
   onlyQuantities?'El contraste explica las cantidades cambiadas; una correspondencia con la ficha necesita precisión.':'El contraste explica los cambios principales; una relación entre cambio y procedimiento necesita precisión.',
   onlyQuantities?'Identifica parte de las cantidades cambiadas, pero no explica suficientemente su diferencia respecto de la ficha.':'Identifica cambios de cantidades u orden, pero no explica suficientemente su efecto en el procedimiento.',
   onlyQuantities?'Atribuye a una versión cantidades de otra y contradice la referencia.':'Atribuye a una versión cantidades o acciones de otra y contradice la referencia.',
   onlyQuantities?'No identifica cambios comprobables de cantidades respecto de la receta de referencia.':'No identifica cambios comprobables de cantidades u orden respecto de la receta de referencia.',
  ])]}
  const rows=[row('recipe-ingredients','Ingredientes del material entregado',4,[
   /cantidades/.test(task)?`Presenta ${/titulo/.test(task)?'el título de la receta y ':''}los ingredientes con las cantidades exactas de la ficha entregada para seguir la receta sin alterar sus datos.`:'Presenta los ingredientes de la receta que constan en la ficha entregada, sin añadir ingredientes ajenos al procedimiento.',
   'Los ingredientes corresponden a la ficha; una identificación necesita precisión.',
   /titulo/.test(task)?'Presenta parte de los ingredientes, pero omite el título o información necesaria de la ficha para seguir la receta.':'Recupera parte de los ingredientes, pero omite información de la ficha necesaria para seguir la receta.',
   'Añade o sustituye ingredientes o datos que contradicen la ficha de la receta.',
   'No presenta ingredientes reconocibles de la receta de la ficha.',
  ]),row('recipe-steps','Procedimiento comprensible y ordenado',4,[
   'Expresa con acciones claras los pasos en el orden del procedimiento de la ficha y relaciona cada ingrediente con el paso donde se utiliza.',
   'Las acciones y su orden permiten seguir la receta; una relación entre ingrediente y paso necesita precisión.',
   'Presenta parte de los pasos, pero deja acciones o ingredientes sin relación suficiente en el procedimiento.',
   'Cambia el orden o una acción y contradice el procedimiento de la ficha.',
   'No presenta una secuencia reconocible para seguir el procedimiento de la receta.',
  ])]
  if(/escrib\w*\s+(?:solamente|solo|unicamente)\s+el procedimiento/.test(task))return rows.filter(r=>r.templateId==='len1-health-recipe-steps')
  if(/higiene/.test(task))rows.push(row('recipe-hygiene','Indicaciones de higiene de la ficha',3,[
   'Conserva las indicaciones de higiene de la ficha en los pasos que corresponden, sin añadir recomendaciones no entregadas.',
   'Las indicaciones corresponden a los pasos; una relación necesita precisión.',
   'Recupera parte de las indicaciones, pero omite una necesaria según la ficha.',
   'Modifica una indicación y contradice la ficha entregada.',
   'No recoge indicaciones de higiene comprobables en la ficha.',
  ]))
  return rows
 }
 if(g==='OPINION'){
  if(correction&&/conclusion/.test(correctionFocus)&&!/contraargumento/.test(correctionFocus))return[row('opinion-conclusion-revision','Conclusión según las razones ya escritas',5,[
   'Revisa la conclusión para que se derive de las razones ya escritas; conserva postura, datos y desarrollo del artículo entregado.',
   'La conclusión se sostiene en las razones dadas; una relación necesita precisión.',
   'Cambia el cierre, pero parte de su conclusión queda sin apoyo en las razones ya escritas.',
   'La conclusión contradice las razones o el cambio altera postura, datos o desarrollo que debía conservar.',
   'No presenta una revisión reconocible de la conclusión según las razones disponibles.',
  ])]
  if(correction)return[row('opinion-fragment','Contraargumento y respuesta revisados',5,[
   'Reescribe el contraargumento con fidelidad a la opinión contraria y la respuesta con una razón pertinente, sin insultos ni burlas; conserva postura, datos y conclusión del artículo.',
   'El contraargumento es fiel y la respuesta razonada; queda una relación con la razón por precisar.',
   'Expone la opinión contraria, pero la respuesta no atiende suficientemente su razón.',
   'Desfigura la opinión contraria, la descalifica o cambia la postura, los datos o la conclusión que debía conservar.',
   'No presenta una revisión reconocible del contraargumento y su respuesta.',
  ])]
  if(analyzing&&/(?:unicamente|solo|solamente)\s+la analogia/.test(task))return[row('opinion-analogy','Función de la analogía presente',5,[
   'Explica la analogía presente mediante su expresión en el artículo y la semejanza pertinente que permite apoyar la postura.',
   'La semejanza y su apoyo a la postura se explican; una relación necesita precisión.',
   'Cita la expresión, pero no explica suficientemente cómo la semejanza apoya la postura.',
   'Atribuye a los referentes una semejanza que no sostiene la postura o contradice el fragmento.',
   'No explica una analogía reconocible mediante la expresión presente del artículo.',
  ])]
  if(analyzing)return[row('opinion-analysis','Funciones de los componentes argumentativos',5,[
   'Explica con fragmentos presentes cómo el hecho aporta información comprobable, el ejemplo concreta un caso, la analogía establece una semejanza pertinente, el argumento vincula razones con la postura y el contraargumento presenta una razón contraria; comprueba si la conclusión se sostiene en esas relaciones.',
   'Relaciona los componentes con la postura y la conclusión; un vínculo necesita precisión.',
   'Identifica componentes, pero no explica suficientemente qué relación sostiene cada uno.',
   'Confunde una opinión con un hecho, atribuye al texto un componente ausente o sostiene una conclusión que contradice sus razones.',
   'No explica funciones argumentativas comprobables mediante fragmentos del artículo entregado.',
  ])]
  const rows=[row('opinion-position','Postura y razones sobre el problema',4,[
   'Presenta una postura reconocible sobre el problema tratado y la sostiene con razones pertinentes que permiten comprender su punto de vista.',
   'La postura y sus razones se relacionan; una explicación necesita precisión.',
   'Expresa una postura, pero parte de las razones no muestra cómo la sostiene.',
   'Las razones contradicen la postura o no corresponden al problema tratado.',
   'No presenta una postura reconocible sostenida en razones sobre el problema.',
  ]),row('opinion-organization','Organización del artículo de opinión',3,[
   'Organiza el artículo para reconocer la postura, seguir sus razones y comprender el cierre del punto de vista sobre el problema.',
   'El recorrido del punto de vista se comprende; una transición necesita precisión.',
   'Se reconocen ideas, pero su orden dificulta relacionar postura y razones.',
   'El orden atribuye a la postura una razón que la contradice o cambia el sentido del cierre.',
   'No organiza un recorrido reconocible del punto de vista en el artículo.',
  ])]
  if(/hecho|ejemplo|analogia/.test(task))rows.push({...row('opinion-evidence','Hecho, ejemplo y analogía para sostener razones',4,[
   'Distingue el hecho comprobable del registro de las opiniones y reconoce su fuente; el ejemplo concreta un caso y la analogía establece una semejanza pertinente; explica cómo esas evidencias apoyan la postura mediante una razón.',
   'Las evidencias sostienen la postura; un vínculo entre ejemplo o analogía y razón necesita precisión.',
   'Incluye el hecho, el ejemplo o la analogía, pero parte de ellos queda sin relación suficiente con la postura.',
   'Presenta una opinión como hecho, inventa datos del registro o usa una analogía cuya semejanza no sostiene la razón.',
   'No aporta evidencias reconocibles del registro y de los recursos argumentativos solicitados.',
  ]),coveredDeliveryKeys:['quantity-ejemplo']})
  if(/contraargumento/.test(task))rows.push(row('opinion-counterargument','Contraargumento y respuesta razonada',4,[
   'Representa con fidelidad un contraargumento y presenta una respuesta con una razón pertinente, sin descalificar a quienes sostienen la opinión contraria.',
   'La respuesta atiende el contraargumento; una relación con la razón necesita precisión.',
   'Incluye contraargumento y respuesta, pero esta no atiende suficientemente la razón contraria.',
   'Deforma la postura contraria o sustituye la respuesta razonada por una descalificación.',
   'No presenta un contraargumento reconocible con respuesta razonada.',
  ]))
  if(/conclusion|recomendacion/.test(task))rows.push(row('opinion-conclusion','Conclusión y recomendación derivadas',3,[
   'Formula una conclusión y una recomendación que se derivan de la postura y de las razones desarrolladas para atender el problema.',
   'El cierre se deriva de las razones; una relación con la recomendación necesita precisión.',
   'Presenta un cierre, pero parte de la conclusión o recomendación no se sostiene en las razones del artículo.',
   'La conclusión o recomendación contradice los hechos o razones desarrollados.',
   'No presenta una conclusión y una recomendación reconocibles vinculadas con lo argumentado.',
  ]))
  return rows
 }
 if(correction)return[row('instructions-edition','Puntuación y numeración conservando las acciones',5,[
  'Corrige puntuación y numeración para distinguir los pasos; conserva exactamente acciones, condiciones, materiales, orden y verbos del instructivo entregado.',
  'Los pasos se distinguen y el contenido se conserva; queda una delimitación por precisar.',
  'Mejora parte de la delimitación, pero otros pasos siguen confundiendo las acciones.',
  'La edición cambia acciones, condiciones, materiales, orden o verbos que debían conservarse.',
  'No presenta una mejora reconocible de puntuación y numeración de los pasos.',
 ])]
 if(analyzing)return[row('instructions-analysis','Ambigüedad y orden de las instrucciones',5,[
  'Localiza y explica la ambigüedad y los pasos fuera de orden; propone una secuencia sustentada en la ficha que conserva acciones y condiciones dadas.',
  'La explicación y la secuencia responden a la ficha; una relación entre acción y orden necesita precisión.',
  'Señala parte de los problemas, pero deja sin explicar una ambigüedad o la necesidad del orden propuesto.',
  'La secuencia cambia acciones o condiciones y contradice la ficha de referencia.',
  'No identifica problemas comprobables de ambigüedad u orden del instructivo dado.',
 ])]
 const consultation=/consultar|consulta|buscar|localizar/.test(task)&&/catalogo|indice/.test(task)
 const rows=[row('instructions-actions',consultation?'Acciones para consultar el catálogo':'Acciones y clasificación según la ficha',4,[
  consultation?'Expresa acciones claras para buscar en el índice y localizar la ficha necesaria del catálogo entregado, siguiendo el recorrido de consulta indicado.':'Expresa acciones claras para organizar o separar los materiales según la clasificación de la ficha entregada, de modo que se comprenda qué hacer.',
  consultation?'Las acciones permiten consultar el catálogo; una relación entre remisión y búsqueda necesita precisión.':'Las acciones permiten reconocer qué hacer; una relación con la clasificación necesita precisión.',
  consultation?'Expresa parte del recorrido, pero deja sin aclarar cómo localizar la ficha necesaria.':'Expresa parte de las acciones, pero otras no permiten identificar cómo clasificar los materiales.',
  consultation?'Una acción dirige hacia una ficha diferente de la solicitada en el recorrido de consulta.':'Una acción o clasificación contradice la ficha y cambia el procedimiento solicitado.',
  consultation?'No presenta acciones reconocibles para consultar el catálogo según el recorrido dado.':'No presenta acciones reconocibles para organizar los materiales según la ficha.',
 ]),row('instructions-order','Orden comprensible de los pasos',4,[
  'Organiza los pasos en el orden necesario para seguir las acciones de la ficha y mantiene las condiciones dadas para realizarlas.',
  'El orden permite seguir las acciones; una transición necesita precisión.',
  'Presenta pasos reconocibles, pero el orden deja acciones sin una condición previa necesaria.',
  'La secuencia invierte acciones que dependen de otras y contradice el procedimiento de la ficha.',
  'No presenta un orden reconocible para seguir las acciones del instructivo.',
 ])]
 if(/proposito|destinatario/.test(task))rows.push(row('instructions-purpose','Propósito y materiales disponibles',3,[
  'Indica el propósito del instructivo para el grupo destinatario y los materiales de la ficha que corresponden a las acciones, sin añadir otros.',
  'El propósito y los materiales corresponden a las acciones; una relación necesita precisión.',
  'Menciona el propósito o materiales, pero deja sin identificar parte de lo necesario según la ficha.',
  'Presenta un propósito o materiales incompatibles con las acciones de la ficha.',
  'No identifica un propósito ni materiales reconocibles de la ficha para el instructivo.',
 ]))
 if(/ambiguedad/.test(task))rows.push(row('instructions-revision','Comprobación por lectura y corrección de ambigüedad',3,[
  'Comprueba por lectura si el grupo destinatario puede seguir las instrucciones y muestra la corrección de una ambigüedad detectada, conservando las acciones de la ficha.',
  'La corrección aclara la acción para el destinatario; queda una expresión por precisar.',
  'Señala una ambigüedad, pero el cambio no permite aclarar suficientemente qué debe hacerse.',
  'El cambio altera una acción o condición de la ficha en lugar de aclarar su formulación.',
  'No muestra una comprobación por lectura ni una corrección reconocible de ambigüedad.',
 ]))
 return rows
}
