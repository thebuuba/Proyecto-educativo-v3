import type {SocialTopic} from './secondary-social-grade-1'
type Add=(key:string,title:string,success:string,partial:string,error:string,weight?:number)=>unknown
/** Grade-specific evidence; formatting, points and manual editing remain shared. */
export function addSecondGradeSocialEvidence(topic:SocialTopic,text:string,label:string,add:Add):boolean{
 if(topic.grade!==2)return false
 if(topic.id==='disaster-risk'&&/\bclasifi(?:ca|que)[a-z]*\b/.test(text)){
  add('phenomenon-classification','Clasificación de los fenómenos examinados','Clasifica los casos proporcionados mediante las categorías indicadas y justifica su ubicación con características observables o documentadas de cada fenómeno.','Ubica los casos en categorías pertinentes, pero una clasificación no se justifica con sus características.','Utiliza categorías incompatibles con las características de los casos o clasifica fenómenos distintos sin un criterio reconocible.',4)
  return true
 }
 const mapLegend=/\bleyenda\b/.test(text)&&/mapa/.test(text)
 if(mapLegend){
  const creating=/\b(?:represent|elabor|constru)[a-z]*\b/.test(text)
  add('map-legend',`${creating?'Construcción':'Lectura'} de la leyenda sobre ${label}`,creating?`Construye una leyenda que permite distinguir las rutas o elementos representados sobre ${label}, manteniendo la correspondencia entre sus símbolos y las referencias del mapa.`:`Interpreta los símbolos, colores y referencias de la leyenda del mapa proporcionado sobre ${label} y los relaciona con las zonas o elementos representados.`,`La leyenda permite reconocer parte de la representación, pero una referencia no corresponde a su símbolo en el mapa.`,`Asigna a los símbolos un significado incompatible con la leyenda o no puede relacionarlos con el mapa.`,3)
 }
 if(topic.id==='climate'&&/climograma/.test(text)&&/\b(?:compar|interpret|elabor|represent)[a-z]*\b/.test(text)){
  add('climogram-reading','Lectura de los climogramas','Interpreta los meses, las temperaturas y las precipitaciones del climograma proporcionado conservando los valores, las unidades y la correspondencia entre ejes y series.','Reconoce las dos variables, pero una lectura de eje, unidad o mes altera una parte de los datos.','Confunde temperatura con precipitación o atribuye valores que no corresponden a los ejes y meses representados.',4)
  if(/\bcompar[a-z]*\b/.test(text))add('climate-comparison','Comparación de los climas representados','Compara los patrones mensuales de temperatura y precipitación de los climogramas y explica sus diferencias climáticas mediante los datos proporcionados.','Reconoce una diferencia pertinente, pero no relaciona una parte de su explicación con los patrones de las dos variables.','Describe climas incompatibles con los datos o compara valores de variables o meses que no corresponden.',4)
  return true
 }
 if(topic.id==='weather-instruments'&&/\binterpret[a-z]*\b/.test(text)&&/registros|datos/.test(text)){
  add('weather-reading','Magnitudes y unidades meteorológicas','Distingue qué magnitud mide cada instrumento indicado e interpreta sus registros proporcionados con las unidades y referencias temporales correspondientes.','Relaciona instrumentos y magnitudes, pero una unidad o referencia temporal queda confundida.','Atribuye a un instrumento una magnitud distinta o interpreta un valor con una unidad incompatible.',4)
  return true
 }
 if(['demographic-rates','census','road-safety'].includes(topic.id)&&/\b(?:series|datos|frecuencias?|registros|grafic[a-z]*)\b/.test(text)){
  const graphing=/\b(?:represent|elabor|constru|realiz)[a-z]*\b/.test(text)&&/grafic/.test(text)
  add('statistical-series',`Datos y series sobre ${label}`,graphing?`Representa las series proporcionadas sobre ${label} conservando valores, unidades, períodos y correspondencia entre los datos y los ejes de la gráfica.`:`Lee y compara los valores o frecuencias proporcionados sobre ${label}, conservando sus unidades y períodos y distinguiendo los hallazgos de inferencias no respaldadas por los datos.`,`Conserva parte de los datos, pero una unidad, período o correspondencia de serie altera una comparación.`,`Cambia los valores o mezcla períodos y magnitudes de forma que las conclusiones no corresponden a los datos proporcionados.`,4)
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
