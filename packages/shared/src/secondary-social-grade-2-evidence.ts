import type {SocialTopic} from './secondary-social-grade-1'
type Add=(key:string,title:string,success:string,partial:string,error:string,weight?:number)=>unknown
/** Grade-specific evidence; formatting, points and manual editing remain shared. */
export function addSecondGradeSocialEvidence(topic:SocialTopic,text:string,label:string,add:Add):boolean{
 if(topic.grade!==2)return false
 const comparing=/\bcompar[a-z]*\b/.test(text)
 const climateComparison=()=>add('climate-comparison','Comparación de los climas representados','Compara los patrones mensuales de temperatura y precipitación de los climogramas y explica sus diferencias climáticas mediante los datos proporcionados.','Reconoce una diferencia pertinente, pero no relaciona una parte de su explicación con los patrones de las dos variables.','Describe climas incompatibles con los datos o compara valores de variables o meses que no corresponden.',4)
 if(topic.id==='geomorphology'&&/mapa/.test(text)&&/\bidentifi[a-z]*\b/.test(text)){
  add('map-feature-identification','Fenómenos geomorfológicos del mapa','Identifica en el mapa físico mundial los fenómenos geomorfológicos solicitados y los distingue mediante las características y referencias espaciales representadas.','Reconoce los fenómenos, pero una característica o referencia espacial no permite distinguirlos.','Confunde los fenómenos señalados o les atribuye características incompatibles con el mapa proporcionado.',4)
  return true
 }
 if(['seismic','volcanism'].includes(topic.id)&&/mapas?/.test(text)&&/distribucion|zonas/.test(text)&&/\b(?:analiz|analic|interpret)[a-z]*\b/.test(text)){
  add('spatial-distribution',`Distribución espacial de ${label}`,`Interpreta la distribución de ${label} en los mapas proporcionados, relacionando las zonas representadas con las referencias espaciales y temporales del caso, sin confundir los fenómenos.`,`Reconoce las zonas, pero una relación no corresponde a las referencias o al fenómeno representado.`,`Atribuye a los mapas zonas o relaciones incompatibles con el fenómeno y las referencias indicadas.`,4)
  return true
 }
 if(topic.id==='historical-sources'&&/importancia|aportacion/.test(text)){
  add('historical-source-purpose','Aportación de las fuentes históricas','Explica qué aportan las fuentes históricas al conocimiento de los fenómenos estudiados, situándolas en su contexto y distinguiendo testimonios de interpretaciones posteriores.','Reconoce una aportación pertinente, pero no la relaciona con el contexto o confunde parcialmente testimonio e interpretación.','Atribuye a las fuentes información ausente o trata una interpretación posterior como testimonio del fenómeno estudiado.',4)
  return true
 }
 if(topic.id==='disaster-risk'&&/plan preventivo/.test(text)){
  add('prevention-plan','Acciones del plan preventivo','Organiza las acciones del plan preventivo de forma compatible con el fenómeno, las condiciones y las orientaciones proporcionadas para el caso, sin presentar su planificación como si ya se hubiera ejecutado.','Las acciones responden al caso, pero una no corresponde a sus condiciones u orientaciones.','Las acciones contradicen las orientaciones proporcionadas o no atienden las condiciones del fenómeno examinado.',4)
  if(/responsables/.test(text))add('plan-roles','Responsables de las acciones previstas','Asigna a cada acción prevista un responsable compatible con los roles y condiciones indicados en el caso, distinguiendo sus funciones dentro del plan.','Reconoce responsables pertinentes, pero una acción queda sin una función o asignación clara.','Asigna responsabilidades incompatibles con los roles del caso o no relaciona las acciones con responsables reconocibles.',3)
  return true
 }
 if(topic.id==='weather-instruments'&&/\b(?:utiliz|maneja|emplea)[a-z]*\b/.test(text)&&/instrucciones|manejo/.test(text)){
  add('weather-handling','Manejo de los instrumentos indicados','Utiliza los instrumentos meteorológicos indicados conforme a las instrucciones de manejo y seguridad proporcionadas, conservando las condiciones de medición del ejercicio.','Sigue las instrucciones principales, pero una operación altera una condición de medición.','Utiliza un procedimiento incompatible con las instrucciones o no conserva las condiciones de la medición.',4)
  return true
 }
 if(topic.id==='weather-instruments'&&/\bregistr(?:a|an|ar|ando|e|en)\b/.test(text)&&/mediciones|datos|registros/.test(text)){
  add('weather-recording','Registro de las mediciones','Registra las mediciones indicadas conservando valores, magnitudes, unidades y referencias temporales, sin sustituir un dato observado por una inferencia.','Conserva los datos principales, pero una unidad, magnitud o referencia temporal queda incompleta.','Cambia los valores o confunde magnitudes y unidades de manera que el registro no corresponde a la medición.',4)
  return true
 }
 if(topic.id==='national-symbols'&&/maqueta|dibujo|pintura/.test(text)&&/\bcre(?:a|an|ar|e|en)\b/.test(text)){
  add('symbol-representation','Representación del símbolo elegido','Representa el símbolo patrio solicitado mediante el recurso elegido, conservando los rasgos y referencias históricas indicados para reconocerlo sin calificar materiales, talento artístico o sentimientos personales.','La representación permite reconocer el símbolo, pero un rasgo solicitado no corresponde a las referencias indicadas.','La representación altera los rasgos esenciales del símbolo indicado o no permite relacionarlo con las referencias proporcionadas.',4)
  return true
 }
 if(topic.id==='climate'&&/climogramas?/.test(text)&&/\b(?:constru|elabor|represent)[a-z]*\b/.test(text)){
  add('climogram-construction','Construcción de los climogramas','Construye los climogramas solicitados con los datos mensuales proporcionados, conservando temperatura, precipitación, unidades y correspondencia entre meses, ejes y series.','Representa las variables y meses, pero una unidad o correspondencia altera una parte de los datos.','Omite una variable o cambia los datos y referencias de modo que el climograma no representa las series proporcionadas.',4)
  if(comparing)climateComparison()
  return true
 }
 if(topic.id==='disaster-risk'&&/\bclasifi(?:ca|que)[a-z]*\b/.test(text)){
  add('phenomenon-classification','Clasificación de los fenómenos examinados','Clasifica los casos proporcionados mediante las categorías indicadas y justifica su ubicación con características observables o documentadas de cada fenómeno.','Ubica los casos en categorías pertinentes, pero una clasificación no se justifica con sus características.','Utiliza categorías incompatibles con las características de los casos o clasifica fenómenos distintos sin un criterio reconocible.',4)
  return true
 }
 const mapLegend=/\bleyendas?\b/.test(text)&&/mapa/.test(text)
 if(mapLegend){
  const creating=/\b(?:represent|elabor|constru)[a-z]*\b/.test(text)
  add('map-legend',`${creating?'Construcción':'Lectura'} de la leyenda sobre ${label}`,creating?`Construye una leyenda que permite distinguir las rutas o elementos representados sobre ${label}, manteniendo la correspondencia entre sus símbolos y las referencias del mapa.`:`Interpreta los símbolos, colores y referencias de la leyenda del mapa proporcionado sobre ${label} y los relaciona con las zonas o elementos representados.`,`La leyenda permite reconocer parte de la representación, pero una referencia no corresponde a su símbolo en el mapa.`,`Asigna a los símbolos un significado incompatible con la leyenda o no puede relacionarlos con el mapa.`,3)
 }
 if(topic.id==='climate'&&/mapas?/.test(text)&&/vegetacion/.test(text)&&comparing){
  add('map-comparison','Relaciones entre clima y vegetación representados','Compara las zonas de clima y vegetación de la República Dominicana y las Antillas representadas en los mapas proporcionados, relacionando sus coincidencias y diferencias con las leyendas y referencias espaciales indicadas.','Reconoce coincidencias o diferencias, pero una no corresponde a las zonas o referencias de sus mapas.','Compara zonas incompatibles con las leyendas o atribuye a los mapas relaciones entre clima y vegetación que no representan.',4)
  return true
 }
 if(topic.id==='population-structure'&&/mapamundi/.test(text)&&/\binterpret[a-z]*\b/.test(text)){
  add('population-map-reading','Dinámica poblacional representada','Interpreta la dinámica poblacional representada en el mapamundi proporcionado, conservando las referencias espaciales y temporales y diferenciando datos representados de inferencias sobre la población.','Reconoce las zonas y datos, pero una interpretación no conserva una referencia espacial o temporal.','Atribuye al mapamundi datos o cambios poblacionales incompatibles con las referencias representadas.',4)
  return true
 }
 if(topic.id==='census'&&/mapas?/.test(text)&&/datos/.test(text)&&/\binterpret[a-z]*\b/.test(text)){
  add('census-map-data','Relación entre mapas y datos censales','Interpreta los valores y períodos de los datos censales proporcionados y los relaciona con las zonas representadas en sus mapas, respetando la escala territorial y el alcance de la información.','Lee los valores y zonas, pero una relación mezcla períodos o escalas territoriales.','Relaciona valores con zonas o períodos que no les corresponden o generaliza el censo más allá de su alcance.',4)
  return true
 }
 if(topic.id==='climate'&&/climograma/.test(text)&&/\b(?:compar|interpret|elabor|represent)[a-z]*\b/.test(text)){
  add('climogram-reading','Lectura de los climogramas','Interpreta los meses, las temperaturas y las precipitaciones del climograma proporcionado conservando los valores, las unidades y la correspondencia entre ejes y series.','Reconoce las dos variables, pero una lectura de eje, unidad o mes altera una parte de los datos.','Confunde temperatura con precipitación o atribuye valores que no corresponden a los ejes y meses representados.',4)
  if(comparing)climateComparison()
  return true
 }
 if(topic.id==='weather-instruments'&&/\binterpret[a-z]*\b/.test(text)&&/registros|datos/.test(text)){
  add('weather-reading','Magnitudes y unidades meteorológicas','Distingue qué magnitud mide cada instrumento indicado e interpreta sus registros proporcionados con las unidades y referencias temporales correspondientes.','Relaciona instrumentos y magnitudes, pero una unidad o referencia temporal queda confundida.','Atribuye a un instrumento una magnitud distinta o interpreta un valor con una unidad incompatible.',4)
  return true
 }
 if(['demographic-rates','census','road-safety','population-structure'].includes(topic.id)&&/\b(?:series|datos|frecuencias?|registros|grafic[a-z]*)\b/.test(text)&&/\b(?:analiz|analic|compar|interpret|represent|elabor|constru|realiz)[a-z]*\b/.test(text)){
  const graphing=/\b(?:represent|elabor|constru|realiz)[a-z]*\b/.test(text)&&/grafic/.test(text)
  add('statistical-series',`Datos y series sobre ${label}`,graphing?`Representa las series proporcionadas sobre ${label} conservando valores, unidades, períodos y correspondencia entre los datos y los ejes de la gráfica.`:`Lee y compara los valores o frecuencias proporcionados sobre ${label}, conservando sus unidades y períodos y distinguiendo los hallazgos de inferencias no respaldadas por los datos.`,`Conserva parte de los datos, pero una unidad, período o correspondencia de serie altera una comparación.`,`Cambia los valores o mezcla períodos y magnitudes de forma que las conclusiones no corresponden a los datos proporcionados.`,4)
  return true
 }
 if(topic.id==='imperialism'&&/mapa/.test(text)&&/poder economico/.test(text)&&/\binterpret[a-z]*\b/.test(text)){
  add('spatial-power','Relaciones espaciales del poder económico','Interpreta el espacio mundial representado como escenario de confrontación de las potencias por el poder económico, relacionando actores, espacios e intereses con el contexto del período indicado.','Reconoce actores y espacios, pero una relación de poder no se vincula con el contexto examinado.','Atribuye a los actores intereses o relaciones espaciales incompatibles con el mapa y el período estudiados.',4)
  return true
 }
 if(topic.id==='fascism'&&/factores|originaron|su fin/.test(text)&&/\b(?:explic|expliqu)[a-z]*\b/.test(text)){
  add('causes','Origen del fascismo en los casos estudiados','Explica los factores que originaron el fascismo en el contexto y período examinados, relacionando las condiciones con los hechos históricos proporcionados.','Reconoce factores pertinentes, pero una relación con las condiciones históricas queda sin explicar.','Confunde los factores de origen con hechos posteriores o presenta afirmaciones incompatibles con el contexto.',4)
  if(/su fin/.test(text))add('consequences','Fin del fascismo en los casos estudiados','Explica los hechos y factores del fin del fascismo en el contexto y período examinados, diferenciando ese proceso de su origen.','Reconoce hechos del proceso, pero una relación con su contexto o secuencia queda sin explicar.','Confunde el fin del proceso estudiado con su origen o atribuye hechos incompatibles con el período.',4)
  return true
 }
 if(/articulo expositivo/.test(text)&&/\bredact[a-z]*\b/.test(text)){
  add('expository-content',`Contenido histórico del artículo sobre ${label}`,`Desarrolla en el artículo expositivo las relaciones históricas solicitadas de ${label}, con una explicación coherente y hechos compatibles con el contexto y las fuentes proporcionadas.`,`Expone contenido pertinente, pero una relación histórica queda sin explicar o no conserva su contexto.`,`El artículo confunde hechos o desarrolla relaciones incompatibles con el proceso histórico solicitado.`,4)
  return true
 }
 if(/tematica/.test(text)&&/articulo/.test(text)&&/\bidentifi[a-z]*\b/.test(text)){
  add('topic-selection',`Delimitación de la temática sobre ${label}`,`Identifica una temática pertinente a las opciones proporcionadas sobre ${label} y delimita su alcance según el propósito del artículo previsto.`,`Selecciona una temática pertinente, pero su delimitación no permite reconocer una parte del propósito.`,`Selecciona una temática ajena a las opciones o la delimita de forma incompatible con el propósito del artículo.`,4)
  return true
 }
 if(topic.id==='peace'&&/procedimientos dialogicos/.test(text)&&/\bidentifi[a-z]*\b/.test(text)){
  add('alternatives','Procedimientos dialógicos para el conflicto','Identifica procedimientos dialógicos pertinentes a las condiciones del conflicto proporcionado y a los derechos de las partes, diferenciando sus funciones para abordar el problema.','Reconoce procedimientos pertinentes, pero una función no se relaciona con las condiciones del conflicto.','Presenta procedimientos incompatibles con las condiciones del conflicto o los derechos de las partes.',4)
  return true
 }
 if(topic.id==='peace'&&/hipotesis/.test(text)&&/\bdiscut[a-z]*\b/.test(text)){
  add('hypothesis-discussion','Discusión razonada de la hipótesis','Expone la hipótesis sobre el conflicto y la discute mediante hechos y razones del caso, respondiendo a las objeciones indicadas sin presentar una suposición como hecho comprobado.','La discusión utiliza hechos pertinentes, pero una objeción queda sin responder o una razón no respalda la hipótesis.','Mantiene la hipótesis sin relación con los hechos o sustituye la discusión por afirmaciones impuestas sin respaldo.',4)
  return true
 }
 if(topic.id==='population-structure'&&/piramides?/.test(text)){
  add('age-structure','Estructura de edades representada','Interpreta los grupos de edad y las proporciones de las pirámides proporcionadas, distinguiendo sus ejes y categorías según la leyenda de cada representación.','Reconoce los grupos, pero una lectura de eje o proporción altera una parte de la estructura.','Confunde los grupos o compara cantidades que no corresponden a las categorías representadas.',4)
  if(/\bcompar[a-z]*\b/.test(text))add('population-comparison','Comparación de estructuras poblacionales','Compara las estructuras de edad de las poblaciones con referencias a las pirámides y explica diferencias respaldadas por los datos, reconociendo los límites de la representación.','Reconoce diferencias, pero una explicación no se vincula con las proporciones observadas.','Atribuye a las poblaciones características incompatibles con las pirámides o presenta una inferencia como si fuera un dato observado.',4)
  return true
 }
 if(topic.id==='migration'&&/rutas|flujos/.test(text)&&/mapa|mapamundi/.test(text)){
  add('migration-flow','Origen, destino y dirección de los flujos','Representa las rutas migratorias proporcionadas manteniendo la correspondencia entre origen, destino y dirección del flujo en el mapa y distinguiendo las rutas mediante las referencias solicitadas.','Reconoce las rutas, pero una dirección o referencia no corresponde a su origen y destino.','Invierte los flujos o atribuye a las rutas orígenes o destinos incompatibles con los datos proporcionados.',4)
  return true
 }
 if(topic.id==='north-south'&&/\bidh\b|indice de desarrollo humano/.test(text)&&/indicadores economicos/.test(text)&&/\bcompar[a-z]*\b/.test(text)){
  add('development-indicators','Alcance de los indicadores de desarrollo','Compara los indicadores económicos y el IDH proporcionados, distinguiendo las magnitudes y dimensiones que expresan y justificando qué relaciones permiten establecer y cuáles no.','Reconoce diferencias entre los indicadores, pero una comparación omite sus magnitudes o límites.','Trata indicadores distintos como si midieran lo mismo o extrae conclusiones incompatibles con sus valores y alcance.',4)
  return true
 }
 if(topic.id==='transport-canals'&&/rutas|intercambios/.test(text)&&/\b(?:analiz|analic|interpret)[a-z]*\b/.test(text)){
  add('transport-routes','Cambios de rutas e intercambios','Relaciona los canales de Suez y Panamá con los cambios de rutas, transporte e intercambios que muestran los mapas históricos proporcionados, situando las relaciones en sus períodos y fuentes.','Identifica cambios de rutas, pero una relación con los intercambios o el contexto queda sin respaldo.','Atribuye a los canales cambios incompatibles con las rutas o los períodos de las fuentes examinadas.',4)
  return true
 }
 if(topic.id==='first-world-war'&&/tratados/.test(text)&&/\b(?:compar|contrast)[a-z]*\b/.test(text)){
  add('treaty-context','Tratados y contexto de guerra y posguerra','Compara las disposiciones de los tratados proporcionados situándolas antes o después de la Primera Guerra Mundial y relacionándolas con los actores y condiciones históricas indicados.','Reconoce disposiciones pertinentes, pero una no se relaciona con su período o contexto.','Atribuye a los tratados disposiciones ausentes o confunde los contextos de guerra y posguerra.',4)
  return true
 }
 if(topic.id==='environmental-agreements'&&/\b(?:analiz|analic|interpret)[a-z]*\b/.test(text)){
  add('environmental-measures','Objetivos y alcance de las medidas ambientales','Relaciona las medidas ambientales descritas en el documento proporcionado con sus objetivos, alcance y límites, explicando su pertinencia para el problema del caso.','Reconoce medidas pertinentes, pero no explica un objetivo, límite o relación con el problema.','Atribuye a las medidas un alcance que no tienen en el documento o las vincula con un problema ajeno al caso.',4)
  return true
 }
 if(topic.id==='disaster-risk'&&/preventiv|prevencion/.test(text)&&/\b(?:propon|propong|elabor|present)[a-z]*\b/.test(text)){
  add('prevention-fit','Pertinencia de las acciones preventivas','Propone acciones preventivas compatibles con las indicaciones oficiales proporcionadas y con el fenómeno, las zonas y las condiciones del caso de emergencia.','Las acciones responden al caso, pero una no se relaciona con una condición o indicación proporcionada.','Propone acciones incompatibles con las indicaciones oficiales o con las condiciones del caso.',4)
  return true
 }
 if(topic.id==='decolonization'&&/mapas?/.test(text)&&/\bcompar[a-z]*\b/.test(text)){
  add('historical-map-change','Cambios históricos y espaciales comparados','Compara los cambios espaciales visibles en los mapas del neocolonialismo y la descolonización proporcionados, vinculándolos con los contextos y referencias temporales de cada fuente.','Reconoce cambios, pero una comparación no se relaciona con el contexto o la referencia temporal de su mapa.','Compara espacios o períodos incompatibles o atribuye a los mapas cambios que no representan.',4)
  return true
 }
 return mapLegend
}
