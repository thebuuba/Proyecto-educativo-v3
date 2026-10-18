import type {InstrumentAcademicContext} from './secondary-science'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import type {InstrumentType,InstrumentRecommendation} from './instrument-recommendation'
import {socialGradeOneTopics,type SocialTopic} from './secondary-social-grade-1'
import {withoutResources} from './evaluation-task-text'

export const commonSocialModules=[{id:'ciencias-sociales-comun-1',grade:1,topics:socialGradeOneTopics,policy:'REQUESTED_SOCIAL_EVIDENCE_V3'}]
const normalize=(s:string)=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
const verbs=`(?:${['analiz','analic','interpret','explic','expliqu','compar(?!t)','contrast','identific','identifiqu','describ','ubic','ubiqu','localiz','orden','elabor','constru','redact','investig','consult','debat','argument','justific','justifiqu','propon','propong','present','expon','registr','represent','simul','formul','comprob','comprueb','indag','indagu','diferenci','produc','observ','caracteriz','discut','evalu','valor','calcul','realiz','respond','particip','dramatiz','dramatic'].map(v=>v+'[a-z]*').join('|')})`
/** Preserve clause boundaries: a negative requirement cannot suppress a later positive action. */
function requestedText(value:string){
 return normalize(withoutResources(value.replace(/<\/(?:p|li|div)>|<br\s*\/?\s*>/gi,'. ').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ')))
  .replace(new RegExp(`\\b(?:no|sin)\\b[^.;\\n]*?(?=[.;\\n]|\\s+(?:y|pero)\\s+${verbs}\\b|$)`,'g'),'')
  .replace(/\b(?:pueden|podran)\s+(?:usar|utilizar|apoyarse)[^.;\n]*/g,'').trim()
}
type SocialAction={text:string;topics:SocialTopic[]}
export type CommonSocialTask={grade:number;actions:SocialAction[];activityType:string;technique:string}
const has=(text:string,action:string)=>new RegExp(`\\b(?:${action})[a-z]*\\b`).test(text)
const compares=(text:string)=>has(text,'compar(?!t)|contrast|distingu|diferenci')
const oral=(text:string)=>/\boralmente\b|\bexpon[a-z]*\b|\bexposicion\b/.test(text)
const performs=(text:string)=>/\b(?:simula(?:r|n|ran)?|dramatiza[a-z]*|dramatice[a-z]*)\b|\b(?:realiz|elabor|represent)[a-z]*\b[^.;]*\b(?:simulacion|dramatizacion)\b/.test(text)
const observedFrequency=(text:string)=>/frecuencia|regularidad/.test(text)&&has(text,'observ|registr')&&/reglas|cumplimiento|conducta|comportamiento/.test(text)
function matches(text:string,topics:SocialTopic[]){
 let selected=topics.filter(t=>text.includes(normalize(t.label))||new RegExp(`\\b(?:${t.match})\\b`).test(text))
 if((observedFrequency(text)||/escala (?:debe valorar|evaluativa|de valoracion|de frecuencia|de evaluacion)/.test(text))&&!/cartografic|mapas?|mercator|distancias?|escala (?:numerica|grafica)/.test(text))selected=selected.filter(t=>t.id!=='scale')
 if(selected.some(t=>t.id==='gps')&&!/puntos cardinales|rosa de los vientos|meridianos|paralelos|greenwich/.test(text))selected=selected.filter(t=>t.id!=='orientation')
 if(selected.some(t=>t.id==='colonial-expansion')&&!/calentamiento|contaminacion|reciclaje|problemas? ambientales?/.test(text))selected=selected.filter(t=>t.id!=='environment')
 if(/dialogo socratico/.test(text)&&selected.some(t=>t.id!=='peace'))selected=selected.filter(t=>t.id!=='peace')
 const specificSpatial=selected.some(t=>['orientation','scale','gps'].includes(t.id))
 if(specificSpatial&&!/\bgeografia\b|ciencias auxiliares/.test(text))selected=selected.filter(t=>t.id!=='geography')
 if(selected.some(t=>t.id==='scale')&&!/elementos|componentes|tipos de mapas|mapas y planos/.test(text))selected=selected.filter(t=>t.id!=='cartography')
 const thematic=selected.some(t=>!['cartography','orientation','scale','gps','geography'].includes(t.id))
 // A map can be a delivery medium for historical content, rather than the studied topic.
 return thematic&&has(text,'elabor|represent|constru|ubic|ubiqu|localiz')?selected.filter(t=>t.id!=='cartography'):selected
}
function splitActions(text:string){
 const parts=text.split(new RegExp(`(?:[.;\\n]+\\s*|\\s+(?:y|e|luego|despues)\\s+)(?=(?:(?:los estudiantes|cada estudiante)\\s+)?${verbs}\\b)`)).filter(Boolean)
 // Coordinated verbs can share one object: «formula y comprueba una hipótesis».
 for(let i=parts.length-2;i>=0;i--)if(new RegExp(`(?:^|\\s)${verbs}\\s*$`).test(parts[i]))parts.splice(i,2,parts[i]+' y '+parts[i+1])
 return parts.reduce<string[]>((actions,part)=>{
  const previous=actions.at(-1)
  // Justifying the reliability selection is part of the same evidence, not a new debate.
  if(previous&&(/fuentes/.test(previous)&&/confiab|credib/.test(previous)&&/^justifi(?:ca|que)[a-z]* (?:tu|su|la) seleccion[.\s]*$/.test(part)||has(previous,'investig|consult')&&/^expli(?:ca|que)[a-z]* (?:su|sus|la) relacion/.test(part)))actions[actions.length-1]+=' y '+part
  else actions.push(part)
  return actions
 },[])
}
export function resolveCommonSocialTask(title:string,description:string,context?:InstrumentAcademicContext|null,topics:SocialTopic[]=socialGradeOneTopics):CommonSocialTask|null{
 if(context?.level!=='SECONDARY'||context.grade!==1||context.optativeExitName||context.subjectCode.trim().toUpperCase()!=='SOC')return null
 const text=requestedText(description||title),selected=matches(text,topics)
 if(!selected.length||!new RegExp(`\\b${verbs}\\b`).test(text))return null
 let previous:SocialTopic[]=selected
 const actions=splitActions(text).map(text=>{
  let own=matches(text,topics)
  if(previous.some(t=>t.id==='gps')&&own.length===1&&own[0].id==='cartography'&&has(text,'ubic|ubiqu|localiz')&&!/elementos|componentes|tipos de mapas/.test(text))own=[]
  if(own.length)previous=own
  return{text,topics:own.length?own:previous}
 })
 const activityType=observedFrequency(text)?'OBSERVATION':/dialogo socratico/.test(text)?'ORAL_INTERACTION':has(text,'debat')?'DEBATE':oral(text)?'ORAL_PRESENTATION':has(text,'investig|consult')?'RESEARCH':/linea de tiempo/.test(text)?'PROJECT':performs(text)?'PERFORMANCE':compares(text)?'COMPARISON':/\b(?:elabor[a-z]*|redact[a-z]*)\b[^.;]*\binforme\b/.test(text)?'REPORT':'ANALYSIS'
 const technique=activityType==='DEBATE'?'debate':activityType==='ORAL_PRESENTATION'?'presentacion':['PERFORMANCE','OBSERVATION'].includes(activityType)?'observacion-sistematica':'analisis-producciones'
 return{grade:1,actions,activityType,technique}
}
type Levels=ContextualTopicCriterion['progressionLevels']
function requestedRelation(topic:SocialTopic,text:string){
 if(topic.id==='colonial-expansion'&&/recursos naturales/.test(text))return 'los recursos naturales de los continentes colonizados y su relación con la expansión colonial europea en el período solicitado'
 if(topic.id==='santo-domingo-colony'&&/modelos de produccion/.test(text))return 'las relaciones entre los modelos de producción y los cambios de población en la colonia de Santo Domingo'
 if(topic.id==='digital-safety'&&/riesgos?/.test(text)&&!/medidas|proteccion|preven/.test(text))return 'los riesgos de exponer información en medios digitales y sus consecuencias en el caso ficticio, sin divulgar datos o cuentas propias'
 if(topic.id==='geography'){
  if(/concepto|definicion/.test(text))return 'el significado de geografía como estudio del espacio y sus relaciones'
  if(/ramas/.test(text))return 'las ramas de la geografía expresamente solicitadas y su objeto de estudio'
  if(/ciencias auxiliares/.test(text))return 'la contribución de las ciencias auxiliares solicitadas al estudio geográfico'
 }
 if(topic.id==='earth'){
  if(/movimientos de la tierra/.test(text))return 'los movimientos terrestres solicitados y sus características, sin confundir rotación y traslación'
  if(/origen/.test(text))return 'los modelos o explicaciones estudiados sobre el origen de la Tierra y su fundamento'
  if(/nuevos planetas/.test(text))return 'las implicaciones del descubrimiento de nuevos planetas para los conocimientos examinados, distinguiendo evidencia de conjetura'
 }
 if(topic.id==='cartography'&&!compares(text)&&!/mapas? y planos?/.test(text))return 'los elementos y la representación espacial del mapa o plano expresamente indicado'
 if(topic.id==='scale'&&!/mercator/.test(text))return 'la relación entre distancias representadas y reales mediante la escala solicitada y sus unidades'
 if(topic.id==='scale'&&/mercator/.test(text)&&!/escalas?/.test(text))return 'las características de la proyección de Mercator estudiadas, diferenciándola de la escala del mapa'
 if(topic.id==='constitution'){
  if(/derechos|deberes|voto/.test(text)&&!/poderes|organizacion del estado|funciones/.test(text))return 'el alcance y fundamento constitucional de los derechos o deberes expresamente examinados en el caso'
  if(/poderes|funciones/.test(text)&&!/derechos|deberes/.test(text))return 'las funciones constitucionales de los poderes del Estado indicados y sus relaciones en el caso estudiado'
 }
 return topic.relation
}
function criterion(topic:SocialTopic,key:string,title:string,success:string,partial:string,error:string,weight=3):ContextualTopicCriterion{
 const progressionLevels:Levels=[success,`${success} Una precisión secundaria queda incompleta, sin alterar la relación principal.`,partial,error,`No aporta evidencia del desempeño solicitado sobre ${topic.label}.`]
 return{templateId:`soc-${topic.grade}-${topic.id}-${key}`,title,observable:success,progressionLevels,weight}
}
function requestedLabel(topic:SocialTopic,text:string){
 if(topic.id==='earth'&&/origen/.test(text))return 'el origen de la Tierra'
 if(topic.id==='environment'){
  const facets=[['calentamiento global','el calentamiento global'],['contaminacion','la contaminación'],['reciclaje','el reciclaje']].filter(([term])=>text.includes(term))
  if(facets.length===1)return facets[0][1]
 }
 return topic.label
}
function actionCriteria(action:SocialAction):ContextualTopicCriterion[]{
 const {text,topics}=action
 const alternatives=text.split(/\s+o\s+(?:bien\s+)?(?=(?:una?\s+)?(?:mapa|linea de tiempo|cuadro|informe)\b)/)
 if(alternatives.length>1){
  const branches=alternatives.map((part,i)=>actionCriteria({text:i?text.slice(0,text.search(new RegExp(`\\b${verbs}\\b`))+text.match(new RegExp(`\\b${verbs}\\b`))![0].length)+' '+part:part,topics}))
  const levels=[0,1,2,3,4].map(i=>`En la alternativa elegida: ${branches.map(b=>b.map(c=>c.progressionLevels[i]).join(' ')).join(' O BIEN: ')}`) as Levels
  return[{templateId:`soc-1-${topics[0].id}-alternative`,title:'Producto alternativo solicitado',observable:levels[0],progressionLevels:levels,weight:4}]
 }
 const rows:ContextualTopicCriterion[]=[]
 for(const topic of topics){
  const add=(key:string,title:string,success:string,partial:string,error:string,weight=3)=>rows.push(criterion(topic,key,title,success,partial,error,weight))
  const label=requestedLabel(topic,text),relation=requestedRelation(topic,text),analyzes=has(text,'analiz|analic|interpret'),explains=has(text,'explic|expliqu|describ'),comparison=compares(text)
  const sourceAssessment=/fuentes/.test(text)&&/confiab|credib/.test(text)&&has(text,'identific|identifiqu|evalu|valor|justific|justifiqu')
  if(sourceAssessment){
   add('source-reliability',`Confiabilidad de las fuentes sobre ${label}`,`Distingue la confiabilidad de las fuentes proporcionadas sobre ${label} justificando su selección con autoría, procedencia, contexto y respaldo verificable para el propósito indicado.`,`Distingue fuentes pertinentes, pero la justificación de una selección no se vincula con evidencias de su procedencia o respaldo.`,`Considera confiable una fuente por su apariencia o popularidad sin comprobar su procedencia ni respaldo.`,4)
   continue
  }
  if(observedFrequency(text)){
   add('observed-conduct',`Cumplimiento observado en ${label}`,`Aplica las reglas indicadas de ${label} en todas las oportunidades observadas durante la situación propuesta.`,`Aplica las reglas indicadas de ${label} en algunas de las oportunidades observadas.`,`Aplica las reglas indicadas de ${label} en pocas de las oportunidades observadas.`,4)
   rows.at(-1)!.progressionLevels=[`Aplica las reglas indicadas de ${label} en todas las oportunidades observadas.`,`Aplica las reglas indicadas de ${label} en casi todas las oportunidades observadas.`,`Aplica las reglas indicadas de ${label} en algunas oportunidades observadas.`,`Aplica las reglas indicadas de ${label} en pocas oportunidades observadas.`,`No aplica las reglas indicadas de ${label} en ninguna de las oportunidades observadas.`]
   continue
  }
  if(/silogismo/.test(text)){
   add('premises',`Premisas sobre ${label}`,`Distingue la premisa universal y la particular sobre ${label}, manteniendo los términos y el alcance de las afirmaciones proporcionadas.`,`Distingue las dos premisas, pero una cambia el alcance o un término del planteamiento.`,`Confunde las premisas o usa términos incompatibles entre ellas.`,4)
   add('inference',`Conclusión del silogismo sobre ${label}`,`Deriva una conclusión que se sigue de las dos premisas sobre ${label}, diferenciando la validez de la inferencia de la veracidad de sus premisas.`,`La conclusión se relaciona con las premisas, pero un cambio de término impide justificar la inferencia.`,`La conclusión no se sigue de las premisas o introduce una afirmación ajena a ellas.`,4)
   continue
  }
  if(/dialogo socratico/.test(text)){
   add('dialogue-questions',`Preguntas del diálogo sobre ${label}`,`Formula preguntas abiertas que examinan los supuestos y las relaciones históricas del caso de ${label}, retomando las ideas expresadas en el diálogo.`,`Formula preguntas pertinentes, pero una no permite profundizar en las ideas del caso.`,`Las preguntas no examinan las ideas del caso o se limitan a exigir una respuesta prefijada.`,3)
   add('dialogue-response',`Respuestas razonadas sobre ${label}`,`Responde a las preguntas con razones y evidencias del caso de ${label} y revisa una explicación cuando se muestran límites o contradicciones.`,`Responde con razones pertinentes, pero no resuelve una contradicción señalada en el diálogo.`,`Las respuestas eluden las preguntas o mantienen afirmaciones incompatibles con las evidencias examinadas.`,4)
   continue
  }
  if(topic.id==='gps'&&/registro|coordenadas|ubic|localiz/.test(text)){
   add('gps-position','Interpretación del registro GPS','Interpreta los valores y referencias del registro GPS proporcionado para ubicar el lugar indicado, manteniendo la correspondencia entre coordenadas y posición en el mapa.','Reconoce las coordenadas, pero una referencia o su traslado al mapa altera parcialmente la posición.','Confunde las referencias o ubica un lugar incompatible con las coordenadas proporcionadas.',4)
   continue
  }
  if(topic.id==='scale'&&has(text,'calcul')){
   add('scale-calculation','Cálculo de distancias con escala','Aplica la relación de escala del mapa a la distancia indicada y obtiene una distancia real consistente con los datos proporcionados.','Plantea correctamente la relación de escala, pero un error de cálculo altera el resultado.','Invierte la relación de escala o utiliza datos que no corresponden al mapa.',4)
   add('scale-units','Unidades del resultado','Expresa la distancia real en las unidades solicitadas, conservando la equivalencia al convertirlas y haciendo reconocible el resultado.','El resultado conserva la magnitud, pero la unidad o una conversión queda incompleta.','La unidad o la conversión cambia la magnitud y hace incompatible el resultado.',3)
   continue
  }
  if(/organizador grafico|mapa conceptual|esquema/.test(text)){
   add('organizer-relations',`Relaciones en el organizador de ${label}`,`Organiza los conceptos y hechos solicitados de ${label} con conexiones explícitas y compatibles con ${relation}, de modo que puede reconocerse qué relación expresa cada enlace.`,`Incluye los conceptos pertinentes, pero un enlace no expresa la relación histórica o espacial solicitada.`,`Los enlaces alteran las relaciones solicitadas o presentan conceptos aislados que no permiten interpretarlas.`,4)
   continue
  }
  if(has(text,'formul|elabor')&&/preguntas?/.test(text))add('question',`Preguntas sobre ${label}`,`Formula preguntas delimitadas y pertinentes sobre ${label} que permiten buscar una respuesta mediante los hechos o fuentes disponibles.`,`Formula una pregunta pertinente, pero su delimitación impide relacionarla con los hechos o fuentes indicados.`,`Formula preguntas ajenas al problema o que no pueden contrastarse con la información disponible.`,3)
  if(/hipotesis/.test(text)&&has(text,'formul|elabor|comprob|comprueb|contrast'))add('hypothesis',`Hipótesis sobre ${label}`,`Plantea una explicación provisional sobre ${label} y distingue los hechos conocidos de lo que deberá contrastarse con las evidencias indicadas, sin presentarla como conclusión comprobada.`,`La hipótesis se relaciona con el tema, pero no distingue con claridad su carácter provisional o la evidencia necesaria.`,`Presenta una opinión como hecho comprobado o una hipótesis incompatible con los hechos conocidos.`,4)
  if(/hipotesis/.test(text)&&has(text,'comprob|comprueb|contrast'))add('hypothesis-evidence',`Contraste de la hipótesis sobre ${label}`,`Contrasta la hipótesis sobre ${label} con las evidencias proporcionadas e indica si estas la respaldan, limitan o contradicen, ajustando la conclusión al alcance de la información disponible.`,`Relaciona la hipótesis con evidencias pertinentes, pero deja sin justificar cómo afectan a la conclusión.`,`Declara comprobada o refutada la hipótesis sin relacionarla con las evidencias disponibles.`,4)
  const news=/noticia/.test(text)&&has(text,'redact|produc|elabor')
  const newsParts=['titular','entrada','entradilla','copete','cuerpo','foto','pie de foto'].filter(part=>part==='foto'?/\bfoto(?:grafias?)?\b/.test(text.replace(/\bpie de foto\b/g,'')):new RegExp(`\\b${part}\\b`).test(text))
  if(news&&newsParts.length){
   add('news-structure',`Organización de la noticia sobre ${label}`,`Organiza la noticia histórica sobre ${label} con los componentes solicitados (${newsParts.join(', ')}), diferenciando información de los hechos y atribuciones de las fuentes.`,`La noticia presenta los hechos, pero un componente solicitado no cumple su función informativa.`,`Los componentes no permiten reconocer el acontecimiento o presentan como hechos afirmaciones incompatibles con las fuentes.`,3)
   const functions:Record<string,string>={titular:'identifica el acontecimiento central sin alterar los hechos',entrada:'resume los datos esenciales del acontecimiento',entradilla:'resume los datos esenciales del acontecimiento',copete:'resume los datos esenciales del acontecimiento',cuerpo:'desarrolla los hechos con un orden histórico comprensible',foto:'representa el acontecimiento de forma compatible con las fuentes','pie de foto':'identifica la imagen y su relación con el acontecimiento'}
   rows[rows.length-1].checklistParts=newsParts.map(part=>({key:part,observable:`Incluye ${part} que ${functions[part]} sobre ${label}.`,progressionLevels:[`El componente ${part} cumple su función informativa.`,`El componente ${part} cumple su función, con una precisión secundaria incompleta.`,`El componente ${part} está presente, pero su función queda parcialmente resuelta.`,`El componente ${part} presenta información incompatible con el acontecimiento.`,`No incluye el componente ${part} solicitado.`]}))
  }
  const mapping=/mapas?|planos?/.test(text)&&has(text,'ubic|ubiqu|localiz|represent|elabor|constru'),chronology=/linea de tiempo|cronolog|secuencia temporal/.test(text)
  if(chronology)add('sequence',`Secuencia temporal de ${label}`,`Ordena los hechos indicados de ${label} en una secuencia cronológica consistente con los períodos o fechas proporcionados, sin confundir simultaneidad con sucesión.`,`Ordena parte de los hechos de ${label}, pero una ubicación temporal no corresponde a la información indicada.`,`La secuencia de ${label} invierte hechos o atribuye fechas incompatibles con los datos del caso.`,4)
  if(mapping&&topic.id!=='orientation')add('location',`Ubicación de ${label}`,`Ubica los lugares indicados de ${label} en la representación solicitada con referencias espaciales consistentes con los datos disponibles.`,`Ubica parte de los lugares, pero una referencia espacial impide reconocer la posición solicitada.`,`Las posiciones representadas no corresponden a los lugares o referencias indicados.`,4)
  if(topic.id==='orientation'&&mapping)add('orientation','Uso de referencias de orientación','Utiliza los puntos cardinales o coordenadas solicitados para expresar la posición de los lugares y mantiene la misma referencia al compararlos.','Utiliza la referencia de orientación, pero una dirección o coordenada resulta inconsistente.','Invierte las direcciones o interpreta las coordenadas con una referencia incompatible.',3)
  if(analyzes&&/causas?|factores|motivos/.test(text))add('causes',`Causas de ${label}`,`Explica los factores solicitados de ${label} relacionando las condiciones del contexto con los hechos y distinguiendo evidencia de una suposición.`,`Menciona factores de ${label}, pero no explica una relación causal necesaria.`,`Presenta como causa de ${label} un hecho posterior o una afirmación sin relación con el caso.`,4)
  if(analyzes&&/consecuencias?|repercusiones|efectos|impacto/.test(text))add('consequences',`Consecuencias de ${label}`,`Explica los efectos solicitados de ${label} indicando qué cambia y para qué actores o espacios, con respaldo en la información disponible.`,`Menciona efectos de ${label}, pero deja sin explicar qué cambia o quiénes se ven afectados.`,`Confunde las consecuencias de ${label} con sus antecedentes o atribuye efectos incompatibles con los hechos.`,4)
  if(comparison)add('comparison',`Comparación de ${label}`,`Compara los casos solicitados de ${label} mediante dimensiones comunes, distinguiendo semejanzas y diferencias respaldadas por sus contextos.`,`Describe los casos de ${label}, pero usa dimensiones diferentes o deja una diferencia sin respaldo.`,`Atribuye a los casos de ${label} semejanzas o diferencias que contradicen la información examinada.`,4)
  if(analyzes&&/perspectivas|posturas|autores|interpretaciones/.test(text))add('perspectives',`Perspectivas sobre ${label}`,`Interpreta las perspectivas de los autores indicados sobre ${label}, diferenciando sus afirmaciones y contextos.`,`Reconoce las perspectivas de ${label}, pero atribuye sin precisión una afirmación a su autor o contexto.`,`Confunde las posturas de los autores o sustituye su interpretación por una afirmación ajena a las fuentes.`,4)
  const specific=chronology||mapping||comparison||/hipotesis|preguntas?/.test(text)||analyzes&&/causas?|factores|motivos|consecuencias?|repercusiones|efectos|impacto|perspectivas|posturas|autores|interpretaciones/.test(text)
  if((analyzes||explains)&&!specific&&!has(text,'investig|consult'))add('interpretation',`Comprensión de ${label}`,`Explica ${relation} utilizando los hechos o conceptos solicitados y diferenciando la información del caso de su interpretación.`,`Reconoce información pertinente de ${label}, pero una relación del caso queda sin explicar.`,`La explicación de ${label} confunde los hechos, conceptos o contexto que se deben interpretar.`,4)
  if(has(text,'identific|identifiqu')&&!specific)add('identification',`Identificación de ${label}`,`Identifica los hechos, conceptos o elementos solicitados de ${label} con características compatibles con ${relation}.`,`Identifica parte de los elementos solicitados, pero una característica no permite distinguirlos.`,`Asigna nombres o características incompatibles con los elementos que se deben identificar.`,3)
  if(has(text,'investig|consult')){
   add('research-content',`Contenido investigado de ${label}`,`Expone los hallazgos sobre ${relation}, distinguiendo datos de inferencias y ajustándolos al espacio y período solicitados.`,`Presenta hallazgos pertinentes, pero una relación del contenido o su contexto queda sin explicar.`,`Los hallazgos confunden hechos o corresponden a un espacio o período ajeno al solicitado.`,4)
   add('sources',`Fuentes sobre ${label}`,`Selecciona información pertinente sobre ${label} y hace reconocible su procedencia, valorando autoría, contexto y respaldo para el propósito solicitado.`,`La información es pertinente, pero una fuente no puede identificarse o su respaldo no se explica.`,`Utiliza información sin procedencia reconocible o incompatible con el objeto de investigación.`,4)
  }
  if(analyzes&&/fuentes/.test(text))add('source-evidence',`Evidencias de las fuentes sobre ${label}`,`Relaciona sus interpretaciones de ${label} con evidencias localizables en las fuentes indicadas y distingue lo que afirman de sus propias inferencias.`,`Usa información de las fuentes, pero una inferencia sobre ${label} queda sin evidencia localizable.`,`Atribuye a las fuentes afirmaciones ausentes o interpreta evidencias incompatibles con su contexto.`,4)
  if(has(text,'argument|justific|justifiqu|debat'))add('argument',`Argumentación sobre ${label}`,`Sostiene una afirmación sobre ${label} mediante razones y evidencias pertinentes al caso, separando hechos y valoraciones sin exigir una postura predeterminada.`,`Presenta una afirmación sobre ${label}, pero una razón no se vincula con la evidencia utilizada.`,`Sustituye el argumento por afirmaciones sin respaldo o por una postura impuesta ajena al análisis.`,4)
  if(has(text,'propon|propong'))add('proposal',`Propuesta sobre ${label}`,`Propone una respuesta al problema indicado de ${label} y explica cómo sus acciones atienden las condiciones y derechos de las personas implicadas.`,`La propuesta atiende parte del problema, pero una acción no se relaciona con sus condiciones.`,`La propuesta no responde al problema indicado o desconoce los derechos examinados.`,4)
  if(oral(text))add('oral',`Explicación oral de ${label}`,`Presenta oralmente el contenido solicitado de ${label} con relaciones comprensibles entre las ideas y referencias al caso, sin valorar acento o rasgos personales.`,`La presentación permite reconocer el contenido, pero una relación entre las ideas queda poco clara.`,`La presentación no permite reconocer las relaciones solicitadas del contenido.`,3)
  if(performs(text))add('simulation',`Acciones en la simulación de ${label}`,`Realiza las acciones del rol indicado de ${label} conforme a las reglas de la situación simulada y las condiciones de seguridad solicitadas.`,`Realiza parte de las acciones del rol, pero una decisión no corresponde a las reglas indicadas.`,`Las acciones de la simulación no corresponden al rol o a las reglas de seguridad indicadas.`,4)
  if(!rows.some(r=>r.templateId.startsWith(`soc-1-${topic.id}-`)))add('representation',`Representación de ${label}`,`Organiza la información de ${label} en el producto solicitado conservando las relaciones entre los hechos, conceptos y espacios indicados.`,`El producto presenta información pertinente, pero una relación solicitada queda incompleta.`,`El producto altera las relaciones solicitadas o no presenta el contenido del caso.`,4)
 }
 return rows
}
export function commonSocialCriteria(task:CommonSocialTask):ContextualTopicCriterion[]{
 const rows=task.actions.flatMap(actionCriteria)
 return rows.filter((r,i)=>rows.findIndex(o=>o.templateId===r.templateId)===i)
}
export function commonSocialSelections(task:CommonSocialTask,description:string){
 const text=requestedText(description||task.actions.map(a=>a.text).join('. '))
 const progressiveQuality=has(text,'analiz|analic|interpret|explic|expliqu|compar(?!t)|contrast|argument|justific|justifiqu|debat|investig|propon|propong')||['ORAL_PRESENTATION','ORAL_INTERACTION','REPORT'].includes(task.activityType)
 const suggestedInstrumentType:InstrumentType=/credito parcial|ponderada|pesos por|puntos por/.test(text)?'lista-ponderada':observedFrequency(text)?'escala':progressiveQuality?'rubrica':'lista-cotejo'
 return{suggestedInstrumentType,suggestedEvaluationTechnique:task.technique}
}
export function adaptSocialScale(proposal:InstrumentRecommendation):InstrumentRecommendation{
 if(proposal.instrumentType!=='escala')return proposal
 const indexes=proposal.levels.length===4?[0,1,2,4]:[0,1,2,3,4]
 const frequency=proposal.criteria.length>0&&proposal.criteria.every(c=>c.templateId.endsWith('-observed-conduct'))
 const labels=frequency?['Siempre','Casi siempre','A veces','Casi nunca','Nunca']:['Completo','Suficiente','Parcial','Incipiente','Aún no logrado']
 return{...proposal,levels:proposal.levels.map((l,i)=>({...l,label:labels[indexes[i]]})),criteria:proposal.criteria.map(c=>({...c,descriptors:c.descriptors.map((d,i)=>({...d,text:c.progressionLevels?.[indexes[i]]??d.text}))}))}
}
