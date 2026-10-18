import type {SocialTopic} from './secondary-social-grade-1'
type Add=(key:string,title:string,success:string,partial:string,error:string,weight?:number)=>unknown
export const thirdGradeCreatesProduct=(text:string)=>/\b(?:elabor(?:a|an|ar|ara|aran|e|en|ando)|redact(?:a|an|ar|ara|aran|e|en|ando)|cre(?:a|an|ar|ara|aran|e|en|ando)|produ(?:ce|cen|cir|cira|ciran|ciendo|zca|zcan)|realiz(?:a|an|ar|ara|aran|ando)|realic(?:e|en))\b|mediante un articulo de opinion|por medio de un articulo de opinion/.test(text)
/** Requested American geography/history products; scoring and format rendering remain shared. */
export function addAdvancedSocialEvidence(topic:SocialTopic,text:string,label:string,add:Add):boolean{
 if(topic.grade<3)return false
 const creating=thirdGradeCreatesProduct(text)
 if(topic.id==='human-rights'&&/vulneraciones/.test(text)&&/\bcompar[a-z]*\b/.test(text)){
  add('comparison','Vulneraciones de derechos en los casos','Compara las vulneraciones de derechos humanos indicadas en los casos, relacionando los derechos afectados con los hechos y sistemas de gobierno examinados y conservando los contextos y el respaldo de las fuentes dadas.','Reconoce vulneraciones pertinentes, pero una comparación no relaciona el derecho afectado con los hechos o el contexto del caso.','Atribuye a los casos vulneraciones ausentes de sus evidencias o compara hechos de contextos distintos como si fueran equivalentes.',4)
  return true
 }
 if(/informe antiplagio/.test(text)){
  add('similarity-context',`Coincidencias del informe sobre ${label}`,`Examina las coincidencias señaladas en el informe antiplagio proporcionado sobre ${label}, localizándolas en el texto y sus fuentes y distinguiendo citas, paráfrasis y atribuciones de coincidencias que requieren revisión; no trata un porcentaje como prueba de plagio ni de autenticidad histórica.`,`Localiza coincidencias pertinentes, pero una conclusión no se vincula con el fragmento o su contexto de atribución.`,`Declara plagio o autenticidad histórica únicamente por el porcentaje o atribuye coincidencias ausentes del informe.`,4)
  if(/correcciones de atribucion/.test(text))add('attribution-correction',`Revisión de atribuciones sobre ${label}`,`Propone correcciones de cita, paráfrasis o referencia para los fragmentos que lo requieren en el caso sobre ${label}, conservando el sentido de las fuentes y explicando qué problema de atribución corrige.`,`La corrección responde al fragmento, pero una referencia queda incompleta o no explica el problema resuelto.`,`La corrección altera el sentido de la fuente, oculta la coincidencia o atribuye el fragmento a un autor que no corresponde.`,3)
  return true
 }
 if(topic.id==='governance-democracy'&&/articulos/.test(text)&&/constitucion/.test(text)){
  add('constitutional-evidence','Características del gobierno en los artículos','Explica las características del gobierno establecidas en los artículos constitucionales proporcionados y relaciona sus disposiciones con el caso del ejercicio, distinguiendo el texto normativo de su interpretación y localizando el respaldo de cada afirmación.','Reconoce disposiciones pertinentes, pero una aplicación al caso no conserva su alcance o no permite localizar su respaldo.','Atribuye al texto disposiciones ausentes o aplica una afirmación incompatible con los artículos proporcionados.',4)
  return true
 }
 if((topic.id==='peace'&&/dialogo constructivo|negociacion colaborativa/.test(text))||(topic.grade===4&&topic.id==='dialogue'&&/dialogo/.test(text)&&/\b(?:particip|realiz|simul|practic)[a-z]*\b/.test(text))){
  const reformulation=topic.grade!==4||/\breformul[a-z]*\b/.test(text)
  add('dialogue-contributions','Razones expresadas en el diálogo',reformulation?'Expone razones pertinentes al conflicto ficticio y reformula de manera fiel las razones expresadas por las otras partes, distinguiendo lo que dijeron de sus propias inferencias y respondiendo al asunto planteado.':'Expresa su punto de vista sobre el asunto indicado con razones pertinentes al diálogo solicitado, conservando el sentido de los hechos o ideas examinados sin valorar creencias privadas.',reformulation?'Expone razones pertinentes, pero una reformulación o respuesta no conserva una necesidad o argumento expresado.':'Expresa un punto de vista pertinente, pero una razón no se relaciona con el asunto del diálogo.',reformulation?'Atribuye a las partes razones que no expresaron o sustituye el análisis del conflicto por ataques personales.':'Sustituye su aporte por ataques personales o afirmaciones incompatibles con el asunto indicado.',4)
  if(topic.grade!==4||/alternativas|acuerdos|desacuerdos/.test(text))add('negotiation-alternatives','Alternativas y resultados de la negociación','Examina las alternativas del caso mediante los criterios dados y registra acuerdos o desacuerdos con razones que conservan los derechos y necesidades expresados, sin considerar obligatorio alcanzar un acuerdo ni revelar vivencias privadas.','Reconoce alternativas pertinentes, pero una valoración o un resultado no se relaciona con los criterios y razones del intercambio.','Impone un acuerdo sin examinar sus condiciones o registra resultados incompatibles con lo expresado por las partes.',4)
  return true
 }
 if(['prehispanic-societies','colonial-societies','us-expansion','world-war-two'].includes(topic.id)&&/mapas?/.test(text)&&/\b(?:analiz|analic|interpret)[a-z]*\b/.test(text)){
  add('historical-map-reading',`Lectura de mapas sobre ${label}`,`Interpreta los procesos o hechos solicitados de ${label} mediante las distribuciones o cambios espaciales representados en los mapas proporcionados, conservando sus fechas, leyendas y referencias y distinguiendo lo representado de inferencias que requieren otras fuentes.`,`Reconoce distribuciones o cambios pertinentes, pero una interpretación no conserva una fecha, leyenda o referencia del mapa.`,`Atribuye al mapa límites, fechas o procesos ausentes o interpreta representaciones de períodos distintos como si fueran simultáneas.`,4)
  return true
 }
 if(creating&&/carta argumentativa/.test(text))add('functional-message',`Mensaje de la carta sobre ${label}`,`Desarrolla para el destinatario indicado de la carta una explicación de las consecuencias solicitadas de ${label}, relacionando los hechos y evidencias del caso con el propósito de la comunicación sin presentar como enviado un texto que solo se redacta.`,`La carta comunica información pertinente, pero una consecuencia o su relación con el propósito queda sin explicar.`,`El mensaje altera las consecuencias del caso o no permite reconocer el propósito indicado para su destinatario.`,4)
 if(topic.id==='urban-rural'&&/\bcompar[a-z]*\b/.test(text)&&/consecuencias/.test(text)){
  add('comparison','Consecuencias y factores del crecimiento urbano','Compara las consecuencias del crecimiento urbano en las regiones indicadas mediante dimensiones comunes, relacionando los factores y las transformaciones espaciales con los datos de cada caso y distinguiendo inferencias de relaciones respaldadas.','Reconoce consecuencias pertinentes, pero una comparación no mantiene las dimensiones comunes o deja un factor sin relacionar con los datos.','Atribuye a las regiones consecuencias o factores incompatibles con los datos o confunde transformaciones de contextos distintos.',4)
  return true
 }
 if(topic.id==='urban-rural'&&/\bpropon[a-z]*\b/.test(text)&&/sostenible/.test(text)){
  add('proposal','Estrategias de gestión urbana sostenible','Propone estrategias de gestión sostenible de las ciudades que responden a las consecuencias del crecimiento urbano y explica su viabilidad mediante los factores, recursos y condiciones de las regiones indicadas, sin presentarlas como intervenciones ya ejecutadas.','Las estrategias responden al problema, pero una acción no se relaciona con las condiciones de la región o con el efecto que pretende mitigar.','Propone acciones incompatibles con las condiciones de la región o que no atienden las consecuencias examinadas.',4)
  return true
 }
 if(topic.id==='natural-resources'&&/\bcompar[a-z]*\b/.test(text)&&/consecuencias/.test(text)){
  add('comparison','Consecuencias de la explotación de recursos','Compara las consecuencias socioambientales y económicas de la explotación de recursos naturales en los casos y espacios expresamente indicados, utilizando dimensiones comunes y evidencias compatibles con sus contextos.','Reconoce consecuencias pertinentes, pero una comparación mezcla dimensiones o no se respalda en el caso correspondiente.','Atribuye a los casos consecuencias incompatibles con sus evidencias o compara dimensiones distintas como si fueran equivalentes.',4)
  return true
 }
 if(topic.id==='natural-resources'&&/\bpropon[a-z]*\b/.test(text)&&/sostenible/.test(text)){
  add('proposal','Alternativa de uso sostenible de los recursos','Propone una alternativa sostenible que responde a las consecuencias de la explotación de recursos del caso y explica su viabilidad mediante las condiciones socioambientales y económicas proporcionadas, sin presentarla como una intervención ya ejecutada.','La alternativa responde al problema, pero una acción no se vincula con sus condiciones o con la reducción del impacto.','La alternativa es incompatible con las condiciones del caso o no atiende las consecuencias que pretende reducir.',4)
  return true
 }
 if(topic.id==='world-war-two-economy'&&/grafic/.test(text)&&/deficit/.test(text)){
  add('statistical-series','Datos de déficit económico de la guerra','Interpreta los valores y relaciones de los gráficos de déficit económico proporcionados, conservando las unidades, períodos y países representados y distinguiendo datos de inferencias no respaldadas.','Reconoce los valores principales, pero una unidad, período o relación altera parte de la interpretación.','Cambia los valores o mezcla períodos y magnitudes de modo que los hallazgos no corresponden a los gráficos proporcionados.',4)
  return true
 }
 if(/plan de investigacion/.test(text)||/organiza[a-z]* (?:una )?investigacion/.test(text)){
  add('research-plan-question',`Pregunta y alcance de la investigación sobre ${label}`,`Delimita una pregunta investigable sobre ${label}, su espacio y período y el procedimiento previsto, distinguiendo la planificación de hallazgos que aún no se han obtenido.`,`La pregunta corresponde al tema, pero un límite o paso no permite reconocer cómo se investigaría.`,`La pregunta o el procedimiento son incompatibles con el caso o se presentan hallazgos como si ya se hubieran obtenido.`,4)
  add('research-plan-sources',`Fuentes previstas sobre ${label}`,`Propone fuentes pertinentes y reconocibles para responder la pregunta sobre ${label} y explica qué información buscaría, respetando las condiciones de anonimato del ejercicio cuando se indican.`,`Las fuentes son pertinentes, pero no explica qué información permitiría responder una parte de la pregunta.`,`Propone fuentes ajenas a la pregunta o depende de información privada que el ejercicio no autoriza.`,3)
  return true
 }
 if(['american-relief','american-water'].includes(topic.id)&&/mapa/.test(text)&&/\bidentifi[a-z]*\b/.test(text)){
  add('map-feature-identification',`Elementos representados de ${label}`,`Identifica los elementos solicitados de ${label} en los mapas proporcionados y los distingue mediante sus características, leyendas y referencias espaciales.`,`Reconoce los elementos, pero una característica o referencia espacial no permite distinguirlos.`,`Confunde los elementos o les atribuye características y posiciones incompatibles con el mapa.`,4)
  return true
 }
 if(topic.id==='american-water'&&/mapas?/.test(text)&&/\b(?:interpret|analiz|analic)[a-z]*\b/.test(text)){
  add('hydrographic-map-reading','Lectura de las cuencas y cuerpos de agua','Interpreta las posiciones y relaciones de las cuencas, ríos y lagos indicados en los mapas de América proporcionados, utilizando sus leyendas y referencias para distinguir las zonas y conexiones representadas.','Reconoce los cuerpos y zonas, pero una relación no conserva las referencias o conexiones del mapa.','Atribuye a los cuerpos de agua posiciones o conexiones incompatibles con las referencias representadas.',4)
  return true
 }
 if(topic.id==='american-climate'&&/mapas?/.test(text)&&/variacion|compar/.test(text)){
  add('map-comparison','Variación del clima y la vegetación en América','Relaciona las zonas de clima y vegetación de las regiones americanas representadas en los mapas proporcionados, explicando las variaciones respaldadas por sus leyendas, datos y referencias espaciales.','Reconoce variaciones pertinentes, pero una relación no conserva las zonas o referencias de los mapas.','Atribuye a las regiones una relación entre clima y vegetación incompatible con los mapas o presenta una inferencia sin respaldo como dato.',4)
  return true
 }
 if(topic.id==='american-geology'&&/\bclasifi[a-z]*\b/.test(text)){
  add('classification','Clasificación de las teorías sísmicas','Clasifica las teorías sobre movimientos sísmicos mediante sus fundamentos y evidencias proporcionados, distinguiendo los criterios de clasificación y el alcance explicativo de cada propuesta.','Reconoce teorías pertinentes, pero una clasificación no se relaciona con sus fundamentos o evidencias.','Clasifica por preferencias personales o atribuye a las teorías fundamentos incompatibles con la información proporcionada.',4)
  return true
 }
 if(topic.id==='geography-fields'&&/ideas conceptuales/.test(text)){
  add('conceptual-explanation','Conceptos de los campos geográficos','Explica con sus propias formulaciones el objeto de los campos geográficos solicitados y lo relaciona con los ejemplos proporcionados, conservando sus diferencias conceptuales.','Las formulaciones son pertinentes, pero un ejemplo no permite reconocer el objeto de su campo.','Confunde los objetos de estudio o sustituye los conceptos por afirmaciones incompatibles con los ejemplos dados.',4)
  return true
 }
 if(creating&&/monografia/.test(text)){
  add('monograph-content',`Contenido de la monografía sobre ${label}`,`Desarrolla en la monografía los aspectos solicitados de ${label}, delimitando sus períodos y espacios y explicando las relaciones respaldadas por los hechos o datos de las fuentes indicadas.`,`Desarrolla contenido pertinente, pero una relación no se vincula con el espacio, período o evidencia del caso.`,`La monografía confunde los procesos o atribuye relaciones incompatibles con los hechos y datos proporcionados.`,4)
  return true
 }
 if(creating&&/articulo cientifico/.test(text)){
  add('historical-article-content',`Análisis del artículo sobre ${label}`,`Desarrolla en el artículo el análisis solicitado de ${label}, relacionando hechos, implicaciones y contextos con las evidencias de las fuentes proporcionadas, sin confundir una interpretación con un hecho comprobado.`,`El análisis conserva los hechos principales, pero una implicación no se vincula con su contexto o evidencia.`,`El artículo atribuye implicaciones incompatibles con los hechos o sustituye el análisis por adhesiones personales sin respaldo.`,4)
  return true
 }
 if(creating&&/periodico escolar/.test(text)){
  add('school-newspaper-content',`Contenido del periódico sobre ${label}`,`Organiza las informaciones solicitadas de ${label} en el periódico escolar, relacionando hechos, actores y contextos con las fuentes indicadas y diferenciando la reconstrucción histórica de una noticia actual.`,`Las informaciones son pertinentes, pero una relación entre hecho, actor o contexto queda incompleta.`,`El periódico altera hechos o atribuye a los actores acciones incompatibles con los procesos estudiados.`,4)
  return true
 }
 if(/\bresumen\b/.test(text)&&/\b(?:elabor|redact|realiz)[a-z]*\b/.test(text)){
  add('summary-content',`Síntesis de ${label}`,`Sintetiza los hechos e ideas principales solicitados de ${label}, conservando sus relaciones y contexto y distinguiendo la información de las fuentes de añadidos que estas no respaldan.`,`Conserva los hechos principales, pero omite una relación necesaria para reconocer el proceso resumido.`,`La síntesis cambia el sentido de los hechos o sustituye la información examinada por afirmaciones ajenas a sus fuentes.`,4)
  return true
 }
 if(topic.id==='national-symbols'&&/juego/.test(text)){
  add('symbol-game-content','Contenido del juego de símbolos','Relaciona los elementos del juego de memoria con los rasgos, historia o significado de los símbolos expresamente solicitados, de modo que las correspondencias y respuestas se respaldan en las referencias proporcionadas.','Las correspondencias permiten reconocer los símbolos, pero una respuesta no conserva un rasgo o significado de las referencias.','Las correspondencias o respuestas del juego atribuyen rasgos o significados incompatibles con los símbolos estudiados.',4)
  return true
 }
 if(topic.id==='national-symbols'&&/significado/.test(text)&&(/\b(?:explica|explican|explicar|explique|expliquen)\b/.test(text)||/\bpresent[a-z]* oralmente\b/.test(text)))add('interpretation','Significado de los símbolos presentados','Explica el significado de los símbolos expresamente indicados con respaldo en las referencias históricas proporcionadas, diferenciando el conocimiento del símbolo de sentimientos o adhesiones personales.','Reconoce el significado de los símbolos, pero una explicación no se respalda en las referencias.','Atribuye a los símbolos significados incompatibles con las referencias o sustituye la explicación por sentimientos personales.',4)
 if(creating&&topic.id==='road-safety'&&/video/.test(text)&&/campana/.test(text)){
  add('campaign-message','Mensaje de educación vial','Comunica las normas de tránsito proporcionadas mediante un mensaje comprensible para el destinatario de la campaña, relacionando las orientaciones con el caso sin inventar obligaciones ausentes del documento.','El mensaje conserva las normas, pero una orientación no queda clara para el destinatario.','El mensaje altera las normas proporcionadas o propone acciones incompatibles con las condiciones del caso.',4)
  add('multimedia-relations','Relación entre imágenes y mensaje','Relaciona las imágenes y el mensaje del vídeo para que las normas y orientaciones del ejercicio se comprendan sin que un recurso audiovisual cambie su significado.','Los recursos permiten reconocer el mensaje, pero una relación visual resulta ambigua.','La relación entre imágenes y mensaje altera las normas u orientaciones que se deben comunicar.',3)
  return true
 }
 if(creating&&/presentacion multimedia/.test(text)){
  add('historical-multimedia-content',`Contenido de la presentación sobre ${label}`,`Selecciona y explica los acontecimientos, actores y relaciones expresamente solicitados de ${label} con hechos compatibles con sus fuentes y contextos.`,`El contenido es pertinente, pero una relación entre acontecimiento, actor o contexto queda incompleta.`,`Atribuye a los acontecimientos o actores hechos incompatibles con el proceso estudiado.`,4)
  add('multimedia-relations',`Relaciones multimedia sobre ${label}`,`Relaciona los textos e imágenes proporcionados para explicar el contenido de ${label}, conservando las referencias y el significado de los hechos representados.`,`Los recursos permiten reconocer el contenido, pero una relación entre texto e imagen no queda clara.`,`Las relaciones entre los recursos alteran los hechos o permiten atribuciones incompatibles con su contexto.`,3)
  return true
 }
 if(topic.id==='taxes'&&/presupuest/.test(text)&&(/extracto|documento presupuestario|tabla/.test(text)||/partidas/.test(text)&&/proporcionad|datos|valores|cantidades/.test(text))){
  add('budget-evidence','Partidas y servicios del documento presupuestario','Relaciona las partidas y los servicios indicados en el extracto presupuestario proporcionado, conservando sus valores, unidades, período y alcance para fundamentar las conclusiones sobre el uso de los impuestos.','Reconoce partidas y servicios, pero una conclusión no se vincula con los valores o el alcance del documento.','Atribuye al documento partidas o servicios ausentes o usa valores y períodos incompatibles para fundamentar las conclusiones.',4)
 }
 if(creating&&/ensayo|articulo de opinion/.test(text)&&topic.id!=='taxes')add('argumentative-text',`Contenido del texto sobre ${label}`,`Desarrolla en el texto las relaciones solicitadas de ${label} mediante una exposición coherente, delimitada al caso y respaldada por sus evidencias, diferenciando hechos e interpretación.`,`El texto desarrolla contenido pertinente, pero una relación no se vincula con los hechos o el contexto.`,`El texto altera las relaciones del contenido o las sustituye por afirmaciones ajenas al caso.`,4)
 if(/\bdiscut[a-z]*\b/.test(text)){
  const objections=topic.grade!==5||/objeciones/.test(text)
  add('discussion',`Discusión de las explicaciones sobre ${label}`,`Discute las explicaciones solicitadas de ${label} mediante razones y evidencias del caso${objections?', atendiendo las objeciones indicadas':''} sin exigir acuerdo o adhesión personal.`,`La discusión utiliza información pertinente, pero una razón${objections?' u objeción':''} queda sin relacionar con la evidencia.`,`Sustituye la discusión por afirmaciones sin respaldo o atribuye a las explicaciones hechos incompatibles con el caso.`,4)
 }
 if(creating&&/mural/.test(text))add('visual-information',`Información del mural sobre ${label}`,`Organiza los hechos y relaciones solicitados de ${label} en el mural, conservando sus contextos y el respaldo de las evidencias proporcionadas.`,`Presenta información pertinente, pero una relación o contexto no puede reconocerse.`,`El mural altera los hechos o presenta relaciones incompatibles con los contextos examinados.`,4)
 if(/mesa redonda/.test(text)&&/\bparticip[a-z]*\b/.test(text))add('roundtable',`Aportes a la mesa redonda sobre ${label}`,`Expone sus aportes sobre ${label} con razones y evidencias del caso y responde a las preguntas del intercambio sin atribuir a otros posturas que no expresaron.`,`El aporte conserva el tema, pero una respuesta no se vincula con la pregunta o su evidencia.`,`El aporte o la respuesta cambian el sentido del caso o atribuyen afirmaciones ausentes a los interlocutores.`,4)
 return false
}
