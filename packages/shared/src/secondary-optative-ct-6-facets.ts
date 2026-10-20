import type {CommonScienceTopic} from './secondary-science-common-types'

type Facet={label:string;match:string;relation:string}
const norm=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const canonicalLabel=(topic:CommonScienceTopic)=>norm(topic.label).replace(/\s+\((?:dom|bom)\)$/,'')
const facet=(label:string,relation:string,match=norm(label)):Facet=>({label,relation,match})
const matches=(text:string,pattern:string)=>new RegExp('\\b(?:'+pattern+')\\b').test(text)
const facets:Record<string,Facet[]>={
 'electronic-components':[
  facet('resistencias electrónicas','la relación entre resistencia, corriente y caída de tensión del componente según las condiciones dadas','resistencias(?: electronicas)?'),
  facet('capacitores','la relación entre carga almacenada, tensión y capacitancia del modelo dado'),
  facet('inductores','la relación entre corriente, campo magnético e inducción del modelo dado'),
  facet('diodos','la relación entre polaridad y conducción del diodo según la característica proporcionada'),
  facet('transistores','la relación entre señales de control y salida del transistor en la configuración dada'),
  facet('circuitos integrados','la correspondencia entre terminales, función y salidas del circuito integrado según la ficha dada'),
 ],
 'electronic-power':[
  facet('baterías','la relación entre tensión, capacidad y requisitos del modelo de batería proporcionado, sin manipulación física'),
  facet('fuentes de alimentación','la correspondencia entre entrada, tensión de salida y requisitos del circuito ficticio según la ficha dada'),
 ],
 'home-electrical-model':[
  facet('calibre del alambrado','la correspondencia entre consumo, protección y calibre en el plano y la tabla profesional proporcionados, sin realizar instalaciones energizadas'),
  facet('conexión a tierra','la función de la conexión de protección representada en el plano y su distinción del conductor de funcionamiento, sin intervenir instalaciones reales','conexion(?:es)? a tierra'),
  facet('inversores','la correspondencia entre entrada, salida y medidas de protección del modelo de inversor dado, sin instalación física'),
 ],
 'robot-sensors':[
  facet('sensor de contacto del robot','la correspondencia entre contacto detectado, señal y decisión del robot simulado','sensor de contacto'),
  facet('sonares del robot','la relación entre señal emitida, eco y distancia según el modelo robótico proporcionado','sonares|sonar'),
  facet('giroscopio del robot','la relación entre movimiento angular y señal de referencia del sensor robótico según su ficha','giroscopio'),
  facet('sensor de color del robot','la correspondencia entre señal óptica, referencia y clasificación del color según los casos dados','sensor de color'),
  facet('sensores del robot','la correspondencia entre magnitud detectada, señal de entrada y decisión del robot según las fichas dadas','sensores?(?! de (?:contacto|color))'),
  facet('actuadores del robot','la correspondencia entre orden de control y acción de salida del robot según la tarea dada','actuadores'),
 ],
 'robot-program-data':[
  facet('variables del programa robótico','la correspondencia entre nombre, valor y cambio de estado de la variable solicitada en el programa de control dado','variables'),
  facet('funciones del programa robótico','la relación entre parámetros, operaciones y retorno de la función solicitada en el control robótico','funciones'),
  facet('arreglos del programa robótico','la relación entre elementos, índices y operaciones solicitados del arreglo del programa robótico dado','arreglos'),
 ],
 'robot-control-structures':[
  facet('toma de decisiones del robot','la relación entre condición, decisión y respuesta del robot en los casos proporcionados','toma(?:s)? de decisiones'),
  facet('estructura de selección del robot','la relación entre condición, rama elegida y respuesta del robot según los casos dados','estructuras? de seleccion'),
  facet('estructuras de repetición del robot','la relación entre condición, iteraciones y terminación de la secuencia robótica dada','estructuras? de repeticion'),
 ],
 'numerical-function':[
  facet('gráficas de funciones','la correspondencia entre expresión, dominio, ejes y valores de la función representada según las referencias dadas','graficas? de funciones'),
  facet('asíntotas de la función','el comportamiento límite de la función y su relación con la recta de referencia solicitada según la expresión o gráfica dadas','asintotas'),
  facet('raíces de la función','la correspondencia entre ceros de la expresión e intersecciones con el eje de valores nulos según la función dada','raices'),
  facet('intercepción de la función','la correspondencia entre coordenadas y el eje indicado en la gráfica de la función dada','intercepcion'),
 ],
 'numerical-difference':[
  facet('diferencias hacia adelante','la aproximación de la derivada con el punto y los valores posteriores del método, paso y orden proporcionados','diferencias hacia adelante|derivacion hacia adelante'),
  facet('diferencias hacia atrás','la aproximación de la derivada con el punto y los valores anteriores del método, paso y orden proporcionados','diferencias hacia atras|derivacion hacia atras'),
  facet('diferencias centrales','la aproximación de la derivada con valores a ambos lados del punto y el paso del método proporcionado','diferencias centrales|derivacion central'),
 ],
 'numerical-second-derivative':[facet('segunda derivada numérica','la correspondencia entre valores, paso y aproximación de la segunda derivada, distinguiéndola de la primera según las referencias dadas','segundas? derivadas? numericas?')],
 'numerical-integration':[
  facet('método del trapecio','la aproximación de la integral mediante áreas trapezoidales con los valores e intervalos dados, respetando las unidades','metodo del trapecio|trapecios?'),
  facet('método de Simpson','la aproximación de la integral mediante la regla de Simpson solicitada y sus condiciones sobre intervalos y paso proporcionados','metodo de simpson|simpson'),
 ],
 'energy-conservation':[facet('conservación de la energía','las transferencias y transformaciones de energía del sistema delimitado y el balance según las condiciones dadas','conservacion de (?:la )?energia')],
 'html-structure':[facet('contenido textual HTML','la correspondencia entre estructura semántica de etiquetas y contenido textual solicitado según los requisitos dados','contenido textual|contenido de texto')],
 'html-rich-content':[
  facet('encabezados HTML','la correspondencia entre niveles de encabezado y organización del contenido dado','encabezados'),
  facet('listas HTML','la correspondencia entre elementos y estructura de la lista solicitada según el contenido dado','listas'),
  facet('enlaces HTML','la correspondencia entre texto del enlace, destino indicado y navegación solicitada','enlaces'),
  facet('imágenes HTML','la correspondencia entre imagen proporcionada, función en el contenido y referencia textual solicitada','imagenes'),
 ],
 'html-multimedia':[
  facet('tablas HTML','la correspondencia entre encabezados, filas, celdas y relaciones del contenido tabular solicitado','tablas'),
  facet('multimedia HTML','la correspondencia entre recurso multimedia proporcionado, controles nativos solicitados y su función en el contenido','multimedia'),
 ],
 'html-forms':[facet('formularios HTML','la correspondencia entre etiquetas, campos, controles y entradas ficticias del formulario solicitado','formularios?')],
 'physical-applications':[
  facet('aplicaciones físicas en astronomía','la relación entre el modelo, la evidencia y la aplicación astronómica solicitada según las fuentes dadas, sin atribuir observaciones o validaciones no realizadas','astronomia|astronomic\\w*'),
  facet('aplicaciones físicas ambientales','la relación entre el modelo, la evidencia y la aplicación ambiental solicitada según las fuentes dadas, sin intervención ambiental real','ambiental\\w*'),
  facet('aplicaciones físicas en salud','la relación entre el modelo, la evidencia y la aplicación de salud solicitada según las fuentes profesionales dadas, sin diagnóstico o intervención sobre personas','salud'),
 ],
 'javascript-types':[
  facet('valores lógicos JavaScript','la correspondencia entre valor booleano, condición y resultado del ejemplo proporcionado','valores logicos|datos logicos|booleanos'),
  facet('fechas JavaScript','la correspondencia entre representación, operación y resultado temporal JavaScript del ejemplo dado','fechas'),
  facet('objetos JavaScript','la correspondencia entre propiedades, referencias y operaciones del objeto solicitado según los casos dados','objetos'),
  facet('arreglos JavaScript','la correspondencia entre elementos, índices y operaciones del arreglo solicitado según los casos dados','arreglos?'),
 ],
 'javascript-json-functions':[
  facet('JSON','la correspondencia entre estructura de serialización, nombres y valores de los datos ficticios solicitados, sin tratar JSON como código ejecutable','json'),
  facet('funciones JavaScript','la correspondencia entre parámetros, operaciones y retorno de la función solicitada según los casos proporcionados','funciones'),
 ],
 'css-text':[facet('formato de texto CSS','la correspondencia entre propiedad tipográfica, valor y presentación textual solicitada según el ejemplo dado','formato de texto')],
 'natural-language-processing':[facet('procesamiento del lenguaje natural','la relación entre texto ficticio, representación lingüística y salida del modelo solicitado según los ejemplos proporcionados','procesamiento de(?:l)? lenguaje natural')],
 'expert-fuzzy-systems':[
  facet('sistemas expertos','la correspondencia entre hechos, reglas de la base de conocimiento e inferencia del caso ficticio dado'),
  facet('lógica difusa','la correspondencia entre entradas, funciones de pertenencia, reglas y salida según el sistema dado, sin equiparar pertenencia con probabilidad'),
 ],
 'prompt-selection':[
  facet('tipos de prompts','la correspondencia entre características, clasificación y propósito del prompt según los ejemplos dados'),
  facet('elección de prompts','la correspondencia entre necesidad, restricciones y prompt elegido según las fichas proporcionadas'),
 ],
 'prompt-security':[facet('seguridad de prompts','las decisiones justificadas sobre instrucciones, privacidad y límites del prompt ficticio según los riesgos documentados','seguridad de prompts|seguridad y etica de prompts')],
}

function focused(text:string,topic:CommonScienceTopic):CommonScienceTopic{
 if(text.includes(canonicalLabel(topic)))return topic
 const selected=facets[topic.id]?.filter(f=>matches(text,f.match))
 return selected?.length?{...topic,label:selected.map(f=>f.label).join(' y '),relation:selected.map(f=>f.relation).join('; ')}:topic
}

/** CT6 keeps mathematical, robotic and language-specific objects distinct. */
export function selectCtSixTopics(text:string,topics:CommonScienceTopic[],contextText=text):CommonScienceTopic[]{
 text=text.replace(/\b(?:sin|no se (?:pide|requiere|incluye))\s+[^.;]*/g,'')
 const exact=topics.filter(t=>text.includes(canonicalLabel(t))).filter(t=>!topics.some(other=>other!==t&&canonicalLabel(other).includes(canonicalLabel(t))&&text.includes(canonicalLabel(other))))
 const rest=exact.reduce((value,t)=>value.replaceAll(canonicalLabel(t),''),text)
 let found=[...exact,...topics.filter(t=>!exact.includes(t)&&(matches(rest,t.match)||facets[t.id]?.some(f=>matches(rest,f.match))))]
 const add=(id:string)=>{const t=topics.find(t=>t.id===id);if(t&&!found.some(r=>r.id===id))found.push(t)}
 const has=(id:string)=>found.some(t=>t.id===id),isExact=(id:string)=>exact.some(t=>t.id===id)
 const robot=matches(contextText,'robot\\w*'),javascript=matches(contextText,'javascript|json|dom|bom'),css=matches(contextText,'css'),physical=matches(contextText,'fisic\\w*|numeric\\w*|derivad\\w*|integracion|grafica de funciones|graficas de funciones')
 if(matches(text,'circuito simulado|circuitos simulados'))add('electronic-circuit')
 if(has('electronic-circuit')&&!isExact('circuit-simulation'))found=found.filter(t=>t.id!=='circuit-simulation')
 if(matches(contextText,'circuit\\w*|electri\\w*|electronic\\w*')&&matches(text,'seguridad|proteccion'))add('electrical-safety')
 if(matches(text,'disen\\w*')&&matches(text,'robot\\w*')&&!matches(text,'programa|prompts?'))add('robot-design')
 if(robot&&matches(text,'simul(?:a|an|ar|e|en)[^.;]*movimiento'))add('robot-movement')
 if(matches(text,'algoritmo[^.;]*aplicacion|aplicacion[^.;]*algoritmo'))add('programming-basics')
 if(robot){
  if(has('robot-programming'))found=found.filter(t=>t.id!=='programming-basics'||isExact(t.id))
  if(found.some(t=>['robot-programming','robot-movement','robot-design','robot-sensors','robot-diagnosis'].includes(t.id))&&!isExact('robot-simulation'))found=found.filter(t=>t.id!=='robot-simulation')
  if(has('computer-vision')){add('robot-vision');found=found.filter(t=>t.id!=='computer-vision')}
  if(has('machine-learning')){add('robot-ai');found=found.filter(t=>t.id!=='machine-learning')}
 }else found=found.filter(t=>!['robot-program-data','robot-control-structures'].includes(t.id)||isExact(t.id))
 if(robot&&/^\s*resuelv\w*\b/.test(text)&&matches(text,'fallo|problema del sistema robotico')){
  add('robot-diagnosis');found=found.filter(t=>t.id==='robot-diagnosis')
 }
 if(javascript){
  const typeText=text.replace(/\bmodelo de objetos del documento\b/g,'dom')
  if(matches(typeText,'fechas|arreglos?|valores logicos|objetos'))add('javascript-types')
  if(matches(text,'funciones'))add('javascript-json-functions')
  if(!robot)found=found.filter(t=>!['robot-program-data','functions-objects'].includes(t.id))
 }
 if(!javascript)found=found.filter(t=>!t.id.startsWith('javascript-')||isExact(t.id))
 if(has('algorithms-data-structures')&&!isExact('programming-basics'))found=found.filter(t=>t.id!=='programming-basics')
 if(has('electrical-measurement')&&/^\s*(?:calcul\w*|resuelv\w*)\b/.test(text))found=found.filter(t=>!['electronic-circuit','circuit-simulation'].includes(t.id))
 if(has('physical-data-analysis')&&/^\s*(?:analiz\w*|interpret\w*)\b/.test(text)&&!matches(text,'grafic\\w*|funciones parametricas'))found=found.filter(t=>t.id!=='position-graph')
 if(has('physical-report')&&found.some(t=>t.id!=='physical-report')&&!isExact('physical-report'))found=found.filter(t=>t.id!=='physical-report')
 if(has('physical-applications')&&!isExact('computational-physics'))found=found.filter(t=>t.id!=='computational-physics')
 if(matches(text,'prompts?')&&found.some(t=>t.id.startsWith('prompt-')))found=found.filter(t=>!['educational-web-application','robot-design'].includes(t.id))
 if(physical&&!robot&&!javascript)found=found.filter(t=>t.id!=='robot-program-data')
 if(found.some(t=>t.id.startsWith('html-')&&t.id!=='html-structure')&&!isExact('html-structure'))found=found.filter(t=>t.id!=='html-structure')
 if(css&&has('css-style')&&found.some(t=>t.id.startsWith('css-')&&t.id!=='css-style')&&!isExact('css-style'))found=found.filter(t=>t.id!=='css-style')
 return found.map(t=>focused(text,t))
}

/** Only the interpretation copy is normalized; saved descriptions stay intact. */
export function ctSixRequirement(value:string):string{
 return value.replace(/\b(?:sin|no se (?:pide|requiere|incluye))\s+[^.;]*/gi,'')
  .replace(/\bcontraste\s+cr[ií]tico\b/gi,'valoración crítica')
  .replace(/\binterpretaci[oó]n\s+geom[eé]trica\b/gi,'lectura geométrica')
  .replace(/\bmejora\s+el\s+prompt/gi,'diseña la mejora del prompt')
  .replace(/\bmejora\s+un\s+prompt/gi,'diseña la mejora de un prompt')
  .replace(/\b(?:registrad|observad)[oa]s?\b/gi,'documentados')
}

export function ctSixCommonText(value:string,topics:CommonScienceTopic[]):string{
 let text=value
 if(topics.every(t=>t.id==='css-cascade'))text=text.replace(/\borden\b/g,'prioridad')
 if(topics.every(t=>['results-ethics','physical-oop','programming-basics','functions-objects','algorithms-data-structures','graphical-interface','javascript-dynamic-page','application-database','prompt-data','robot-program-data','javascript-types','javascript-json-functions'].includes(t.id)))text=text.replace(/\bdatos\b/g,'información').replace(/\bgrafic[ao]s?\b/g,'visual').replace(/\bresultados\b/g,'conclusiones')
 if(topics.every(t=>t.id==='html-multimedia'))text=text.replace(/\btablas\b/g,'marcado tabular')
 if(/^\s*resuelv\w*\b/.test(text)&&matches(text,'error|fallo'))text=text.replace(/\balgoritmo numerico\b/g,'procedimiento computacional')
 if(/^\s*(?:redact\w*|elabor\w*|escrib\w*)\b/.test(text))text=text.replace(/\bpruebas\b/g,'verificaciones documentadas')
 if(/^\s*(?:redact\w*|elabor\w*|escrib\w*)\b/.test(text)&&matches(text,'informe'))text=text.replace(/\bmodelos?\b/g,'referente físico').replace(/\bdistingue(?:n|r)?\b/g,'delimita')
 return text
}
