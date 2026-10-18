import type {SocialTopic} from './secondary-social-grade-1'
import {thirdGradeCreatesProduct} from './secondary-social-advanced-evidence'
type Add=(key:string,title:string,success:string,partial:string,error:string,weight?:number)=>unknown
/** Evidencias geográficas y cívicas compartidas; formato, progresión y puntuación permanecen comunes. */
export function addFourthGradeSocialEvidence(topic:SocialTopic,text:string,label:string,add:Add):boolean{
 if(![4,5].includes(topic.grade))return false
 const creating=thirdGradeCreatesProduct(text)
 if(topic.id==='political-geography'&&/\binfluencia\b/.test(text)&&/decisiones internacionales/.test(text)){
  add('causes','Factores geográficos y decisiones internacionales','Explica la influencia de los factores geográficos en las decisiones internacionales de los casos indicados, vinculando condiciones y hechos sin atribuir una causa única o determinismo geográfico sin evidencia.','Relaciona factores y decisiones pertinentes, pero una conexión no queda respaldada por los hechos del caso.','Presenta la geografía como causa única inevitable o atribuye a una decisión factores incompatibles con los hechos.',4);return true
 }
 if(topic.id==='continents-position'&&/\binfluencia\b/.test(text)){
  const dimensions=[['economia','economía'],['politica','política'],['cultura','cultura']].filter(([term])=>text.includes(term)).map(([,label])=>label)
  if(dimensions.length){
   const effect=dimensions.length>1?dimensions.slice(0,-1).join(', ')+' y '+dimensions.at(-1):dimensions[0]
   add('causes','Influencia de la posición geográfica',`Explica la influencia de la posición geográfica de los continentes en ${effect} de los casos indicados, vinculando las relaciones con los hechos proporcionados sin presentar determinismo geográfico.`,`Reconoce una influencia pertinente, pero una conexión con ${effect} queda sin explicar o respaldar.`,`Atribuye a la posición geográfica efectos incompatibles con los hechos o los presenta como inevitables sin evidencia.`,4);return true
  }
 }
 if(topic.id==='boundaries'&&/estabilidad|paz mundial/.test(text)){
  add('interpretation','Fronteras, estabilidad y paz','Explica cómo el respeto de las fronteras se relaciona con la estabilidad y la paz en los casos proporcionados, vinculando hechos, condiciones y consecuencias sin juzgar nacionalidades o patriotismo.','Reconoce una relación pertinente, pero una conexión entre respeto de fronteras y estabilidad o paz queda sin explicar.','Atribuye a los casos relaciones incompatibles con sus hechos o sustituye el análisis por juicios sobre nacionalidades.',4);return true
 }
 if(topic.id==='climate-change'&&/acciones/.test(text)&&/\bevalu[a-z]*\b/.test(text)){
  add('climate-action-evaluation','Evaluación de las acciones climáticas','Evalúa las acciones climáticas indicadas en las escalas mundial, nacional y local del caso mediante los criterios dados y las evidencias de su alcance y resultados, distinguiendo acciones previstas de ejecutadas.','Relaciona acciones y evidencias pertinentes, pero una valoración no mantiene el criterio o la escala del caso.','Atribuye resultados ausentes a una acción o valora acciones de escalas distintas como si fueran equivalentes.',4);return true
 }
 if(['social-methods','climate-change'].includes(topic.id)&&/\bsinteti[a-z]*\b/.test(text)){
  add('information-synthesis',`Síntesis de información sobre ${label}`,`Selecciona, relaciona y sintetiza las informaciones solicitadas de ${label} a partir del conjunto proporcionado, conservando su procedencia, contexto y límites y distinguiendo hallazgos de inferencias.`,`La síntesis conserva información pertinente, pero una relación o procedencia no permite reconocer el respaldo del hallazgo.`,`La síntesis altera la información del conjunto o presenta inferencias sin respaldo como datos obtenidos.`,4);return true
 }
 if(topic.id==='economic-blocs'&&/cuantitativa|cualitativa/.test(text)){
  add('quantitative-qualitative-information','Información de los bloques económicos','Localiza y selecciona la información cuantitativa y cualitativa solicitada sobre los bloques económicos en los registros proporcionados, conservando procedencia, valores, unidades, períodos y el significado de las categorías.','Selecciona información pertinente, pero una unidad, período, categoría o procedencia impide interpretar una parte de los datos.','Cambia valores o categorías, mezcla períodos incompatibles o atribuye a una fuente información ausente.',4);return true
 }
 if(topic.id==='spatial-networks'&&/\banaliz[a-z]*\b/.test(text)){
  add('spatial-network-relations','Conexiones y flujos de las redes','Interpreta las conexiones y flujos de las redes de transporte, comunicación y comercio expresamente indicados, explicando cómo articulan los espacios de los casos con respaldo en sus referencias y condiciones.','Reconoce conexiones pertinentes, pero un flujo o su relación con los espacios queda sin explicar.','Atribuye a la red conexiones o flujos ausentes o explica la articulación con relaciones incompatibles con el caso.',4);return true
 }
 if(topic.id==='rivers-lakes'&&creating&&/maqueta/.test(text)){
  add('spatial-model','Relaciones espaciales de la maqueta','Representa los ríos y lagos solicitados en la maqueta conservando sus posiciones y relaciones espaciales según las referencias proporcionadas, sin valorar el costo o acabado decorativo de los materiales.','Los elementos son reconocibles, pero una posición o conexión no conserva las referencias espaciales indicadas.','Las posiciones o conexiones representadas contradicen las referencias del caso o no permiten reconocer los cuerpos de agua.',4);return true
 }
 if(/mapas?/.test(text)&&!creating){
  const mapTypes:Record<string,[string,string,string]>={
   'earth-representation':['map-reading','Lectura de las representaciones terrestres','el significado de las representaciones terrestres mediante sus leyendas, orientación y referencias'],
   'continents-position':['map-reading','Distribución de los continentes','la posición y distribución de los continentes solicitados mediante las referencias espaciales del mapa'],
   'tectonic-plates':['tectonic-map-reading','Movimientos y dirección de las placas','los movimientos y direcciones de desplazamiento de las placas tectónicas mediante las flechas, leyendas y referencias proporcionadas'],
   'seismic-volcanic':['seismic-spatial-pattern','Distribución y frecuencia sísmica y volcánica','la distribución y frecuencia de actividad volcánica y sísmica mediante las zonas, períodos y leyendas indicados, sin convertir frecuencia en predicción'],
   'hydric-resources':['hydric-map-reading','Distribución de recursos hídricos','la distribución y relaciones espaciales de los recursos hídricos solicitados mediante las referencias de los mapas'],
   'continental-climate':['climate-map-relations','Relaciones entre mapas climáticos e hidrográficos','las relaciones entre las zonas climáticas y los rasgos hidrográficos expresamente representados, conservando las leyendas y referencias de ambos mapas'],
   'civilizations':['historical-map-reading','Espacios y períodos de las civilizaciones','los procesos y espacios de las civilizaciones solicitadas, conservando las leyendas y períodos de los mapas históricos'],
  }
  const map=mapTypes[topic.id]
  if(map){add(map[0],map[1],`Interpreta ${map[2]} y distingue lo representado de inferencias que necesitan otras evidencias.`,`Reconoce elementos pertinentes, pero una relación no conserva una referencia o condición de la representación.`,`Atribuye a la representación elementos, posiciones o relaciones ausentes o incompatibles con sus referencias.`,4);return true}
 }
 if(topic.id==='hydric-resources'&&/impactos?/.test(text)&&/accion humana/.test(text)){
  add('hydric-impact','Impactos humanos en las fuentes hídricas','Explica los impactos de la acción humana en las fuentes hídricas expresamente indicadas del mundo y de República Dominicana, relacionando los cambios con las evidencias del caso sin inventar mediciones o análisis de calidad del agua.','Reconoce impactos pertinentes, pero una relación entre acción, cambio y evidencia queda sin explicar.','Atribuye a una fuente hídrica impactos o mediciones ausentes de los datos o confunde una inferencia con un resultado observado.',4);return true
 }
 if(topic.id==='kyoto-agreements'&&/\banaliz[a-z]*\b/.test(text)&&/proporcionad|fuentes|documentos/.test(text)){
  add('agreement-evidence','Alcance y argumentos de los acuerdos climáticos','Explica las disposiciones y alcances de los acuerdos climáticos proporcionados y los argumentos de los países expresamente indicados ante su aceptación, localizando el respaldo de las afirmaciones sin atribuir obligaciones o vigencia no comprobadas.','Reconoce disposiciones y argumentos pertinentes, pero una interpretación no conserva su alcance o procedencia.','Atribuye al acuerdo obligaciones ausentes o a un país argumentos que no aparecen en las fuentes del ejercicio.',4);return true
 }
 if(topic.id==='hominization'&&/\bsocializ[a-z]*\b/.test(text)){
  add('ideas-exchange','Aportes al intercambio sobre hominización','Comparte y relaciona ideas sobre la hominización con los hallazgos proporcionados y retoma las explicaciones expresadas en el intercambio, distinguiendo evidencia, interpretación y creencias privadas que no se califican.','El aporte conserva el tema, pero una relación o atribución de lo expresado por otra persona queda incompleta.','Atribuye a los hallazgos o interlocutores afirmaciones ausentes o sustituye el intercambio por juicios sobre sus creencias.',4);return true
 }
 if(topic.id==='hominization'&&/creacionista|evolucionista/.test(text)&&/implicaciones/.test(text)){
  add('epistemic-explanations','Carácter y justificación de las explicaciones','Analiza las implicaciones de las explicaciones creacionistas y evolucionistas proporcionadas, distinguiendo sus preguntas, carácter y bases de justificación; diferencia evidencia empírica de creencia sin convertir la fe personal en criterio de evaluación.','Reconoce los tipos de explicación, pero una implicación no se vincula con sus preguntas o bases de justificación.','Atribuye evidencia empírica ausente a una explicación o sustituye el análisis por valoración de las creencias del estudiante.',4);return true
 }
 if(topic.id==='american-peopling'&&/\bclasifi[a-z]*\b/.test(text)){
  add('classification','Clasificación de teorías del poblamiento','Clasifica las teorías del poblamiento expresamente proporcionadas mediante sus propuestas y evidencias, explicando el criterio de agrupación y conservando el alcance provisional de las hipótesis.','Reconoce teorías pertinentes, pero una clasificación no se respalda en su propuesta o evidencia.','Clasifica por preferencias personales, añade teorías ausentes o presenta una hipótesis no respaldada como certeza.',4);return true
 }
 if(topic.id==='protected-areas'&&/\bidentifi[a-z]*\b/.test(text)&&/proporcionad/.test(text)){
  add('identification','Reservas y categorías en los documentos','Identifica las reservas naturales o áreas protegidas expresamente indicadas en los documentos proporcionados, relacionando sus nombres, ubicaciones y categorías, sin afirmar vigencia legal no comprobada.','Identifica áreas pertinentes, pero una ubicación o categoría no conserva la referencia del documento.','Asigna a un área una ubicación o categoría ausente o incompatible con el documento del ejercicio.',4);return true
 }
 if(topic.id==='digital-history-sources'&&/\b(?:localiz|seleccion)[a-z]*\b/.test(text)){
  add('digital-source-recovery','Recuperación y selección de documentos históricos','Localiza y selecciona los documentos históricos solicitados en los registros de los repositorios indicados, haciendo reconocibles su autoría, procedencia, contexto y pertinencia para la pregunta sin exigir otros repositorios o acceso de pago.','Los documentos son pertinentes, pero una procedencia o justificación no permite reconocer su utilidad para el propósito.','Selecciona documentos ajenos al propósito o atribuye a un repositorio información que sus registros no respaldan.',4);return true
 }
 if(topic.id==='rule-of-law-powers'&&/\bsimul[a-z]*\b/.test(text)){
  add('state-role','Actuación del poder del Estado asignado','Representa las decisiones y funciones del poder del Estado asignado en la situación ficticia de acuerdo con los documentos y hechos proporcionados, distinguiendo el rol representado de una decisión jurídica real.','Representa funciones pertinentes, pero una decisión no se relaciona con las condiciones o hechos de la situación.','Atribuye al rol funciones incompatibles con los documentos o actúa sobre hechos ajenos al caso.',4)
  add('state-limits','Límites y relación entre poderes','Conserva los límites y relaciones entre los poderes del Estado expresamente indicados en los documentos al resolver la situación simulada, sin inventar atribuciones ausentes.','Reconoce los límites principales, pero una relación o decisión no conserva su alcance en el caso.','Transfiere a un poder una atribución que el documento no le asigna o elimina un límite requerido por la situación.',3);return true
 }
 if(['boundaries','human-rights','taxes'].includes(topic.id)&&/\banaliz[a-z]*\b/.test(text)&&/\bcaso\b/.test(text)){
  const key=topic.id==='boundaries'?'boundary-case':topic.id==='human-rights'?'rights-case':'tax-case'
  add(key,`Análisis del caso de ${label}`,`Relaciona los hechos y condiciones del caso proporcionado de ${label} con las disposiciones, referencias y alternativas expresamente indicadas, distinguiendo información, interpretación y límites de lo que puede decidirse en el ejercicio.`,`Reconoce hechos pertinentes, pero una relación con las condiciones o referencias queda sin explicar.`,`Atribuye al caso hechos o disposiciones ausentes o decide mediante afirmaciones incompatibles con las condiciones proporcionadas.`,4);return true
 }
 if(topic.id==='human-rights'&&/foro/.test(text)&&/\brealiz[a-z]*\b/.test(text)){
  add('forum-contributions','Aportes y respuestas del foro','Expone aportes sobre los derechos humanos del caso ficticio con razones y referencias a los hechos dados y responde a los aportes de los demás conservando lo que expresaron y los límites de la información.','El aporte responde al tema, pero una razón o respuesta no se relaciona con el caso o con lo expresado por otra persona.','Atribuye afirmaciones ausentes a los interlocutores o sustituye las razones por ataques personales o hechos incompatibles con el caso.',4);return true
 }
 if(topic.id==='human-rights'&&creating&&/ensayo/.test(text)&&/convenios|acuerdos/.test(text)){
  add('convention-evidence','Disposiciones de los convenios en el caso','Desarrolla el análisis de los convenios de derechos expresamente proporcionados, relacionando sus disposiciones con los hechos del caso y diferenciando el texto, su interpretación y los límites de su alcance.','El análisis conserva disposiciones pertinentes, pero una aplicación al caso no permite localizar su respaldo o alcance.','Atribuye al convenio derechos u obligaciones ausentes o aplica una disposición incompatible con los documentos del ejercicio.',4);return true
 }
 if(creating&&/informe/.test(text)){
  add('report-content',`Contenido del informe sobre ${label}`,`Organiza en el informe los hallazgos o ideas solicitados de ${label}, conservando los hechos, períodos y espacios del material proporcionado y distinguiendo la información examinada de su interpretación.`,`El informe contiene información pertinente, pero una relación o contexto queda incompleto.`,`El informe altera hechos o atribuye a la información relaciones incompatibles con el material del ejercicio.`,4)
  if(topic.id==='community-surveys')add('survey-evidence','Resultados y alcance de los sondeos','Interpreta los resultados anónimos proporcionados de los sondeos y encuestas del caso, conservando cantidades, categorías y límites de representación sin identificar personas ni generalizar más allá de la muestra.','Reconoce resultados pertinentes, pero una cantidad, categoría o conclusión no mantiene el alcance de la muestra.','Cambia los datos o presenta resultados de la muestra como conclusiones generales sin respaldo.',4)
  return true
 }
 if(['peace','human-rights','road-safety'].includes(topic.id)&&/campana/.test(text)&&!/video/.test(text)&&(creating||/\bpropon[a-z]*\b/.test(text))){
  if(/mensaje/.test(text)||!/acciones/.test(text))add('campaign-message',`Mensaje de la campaña sobre ${label}`,`Elabora el mensaje solicitado de la campaña simulada de ${label} de forma comprensible para el destinatario indicado, relacionando las orientaciones con los hechos, derechos o documentos del caso sin imponer adhesiones personales.`,`El mensaje conserva el propósito, pero una orientación no queda clara para el destinatario o no se relaciona con el caso.`,`El mensaje altera los hechos o disposiciones proporcionados o sustituye la explicación por una adhesión personal exigida.`,4)
  if(/acciones/.test(text))add('campaign-actions',`Acciones previstas sobre ${label}`,`Propone las acciones solicitadas de la campaña de ${label}, relacionando propósito, destinatarios y condiciones dadas sin presentar la planificación como ejecutada.`,`Las acciones conservan el propósito, pero una no se relaciona con el destinatario o las condiciones.`,`Las acciones son incompatibles con el propósito o requieren condiciones ausentes del caso.`,3)
  return true
 }
 if(topic.id==='road-safety'&&/plan de charla|organiza[a-z]*[^.;]*charla interactiva/.test(text)){
  const resources=/recursos/.test(text)
  add('interactive-talk-plan','Propósito, secuencia e intercambio de la charla',`Organiza el propósito, secuencia y preguntas de intercambio de la charla de educación vial prevista, relacionándolos con ${resources?'el caso, destinatarios y recursos proporcionados':'el propósito y los destinatarios indicados'} sin afirmar que se contactó a instituciones o ejecutó la actividad.`,resources?'La planificación responde al propósito, pero un paso o pregunta no se vincula con el destinatario o recurso indicado.':'La planificación responde al propósito, pero un paso o pregunta no se vincula con el destinatario indicado.',resources?'Propone pasos incompatibles con los recursos o sustituye la planificación por contactos o resultados no realizados.':'Propone una secuencia incompatible con el propósito o sustituye la planificación por contactos o resultados no realizados.',4)
  if(/demostracion/.test(text))add('demonstration-plan','Demostración práctica simulada','Integra la demostración simulada proporcionada en la secuencia de la charla, indicando qué permitiría observar y cómo se relaciona con las normas del ejercicio sin ejecutar maniobras en tránsito real.','La demostración se relaciona con el propósito, pero no explica qué se observaría o su relación con una norma dada.','La demostración no corresponde a las normas o depende de condiciones incompatibles con la simulación indicada.',3)
  return true
 }
 if(topic.id==='healthy-lifestyle'&&/\bpropon[a-z]*\b/.test(text)){
  add('healthy-proposal','Propuesta educativa de estilo de vida saludable','Propone acciones de estilo de vida saludable para el caso ficticio mediante las orientaciones educativas proporcionadas y explica su viabilidad en las condiciones indicadas, sin formular diagnósticos, dietas o tratamientos personales.','La propuesta utiliza orientaciones pertinentes, pero una acción no se vincula con las condiciones o el propósito del caso.','La propuesta contradice las orientaciones proporcionadas o sustituye el ejercicio educativo por diagnósticos o prescripciones personales.',4);return true
 }
 return false
}
