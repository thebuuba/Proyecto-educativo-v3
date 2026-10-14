import fs from 'node:fs'
const source=JSON.parse(fs.readFileSync('docs/curriculum/cobertura-secundaria/lengua-6-cotejo-fuente.json','utf8'))
const rows=[
 ['informe-investigacion','Escucharán un informe de investigación y parafrasearán el problema, objetivos, método, bases teóricas, conclusiones y recomendaciones. Resumirán mediante omisión, selección y generalización.','ANALYSIS','feature-summary','generalización'],
 ['informe-investigacion','Producirán oralmente un informe de investigación justificando el problema con los datos dados y argumentos de analogía, ejemplificación, deducción y autoridad; usarán formas impersonales y vocabulario apropiado.','ORAL_PRESENTATION','feature-argument-types','producción oral'],
 ['informe-investigacion','Leerán un informe de investigación, anticiparán el contenido desde marcas paratextuales y gráficos. Inferirán el significado de palabras desconocidas y lo comprobarán en el diccionario.','ANALYSIS','procedure-dictionary','acepción'],
 ['informe-investigacion','Redactarán un informe de investigación en soporte digital con datos proporcionados. Planificarán un esquema, usarán citas para el marco teórico, una tabla o gráfico para los resultados, redactarán conclusiones y revisarán los borradores.','REPORT','feature-graphics','tabla o gráfico'],
 ['reportaje','Escucharán un reportaje, anticiparán el contenido y parafrasearán los hechos, el contexto y las explicaciones del problema.','ANALYSIS','procedure-paraphrase','hechos'],
 ['reportaje','Producirán oralmente un reportaje con información investigada, entrevistas o testimonios, imágenes y recursos no verbales que apoyen la comprensión; usarán oraciones coordinadas y vocabulario pertinente.','ORAL_PRESENTATION','feature-testimony','producción oral'],
 ['reportaje','Leerán un reportaje e inferirán la intención y relaciones entre las ideas; comprobarán en el diccionario las palabras que desconozcan.','ANALYSIS','procedure-dictionary','acepción'],
 ['reportaje','Redactarán un reportaje en soporte físico o digital contrastando la diversidad y fiabilidad de las fuentes. Usarán fotografías o gráficos y revisarán sus borradores.','WRITTEN_PRODUCTION','source-reliability','discrepancias'],
 ['ensayo-argumentativo','Escucharán un ensayo argumentativo y anticiparán su contenido a partir del título y marcas paratextuales.','ANALYSIS','procedure-prediction','indicios'],
 ['ensayo-argumentativo','Planificarán un ensayo argumentativo que escribirán, organizando tesis, fuentes, argumentos y contraargumentos para el destinatario.','WRITTEN_PRODUCTION','procedure-outline','tesis'],
 ['ensayo-argumentativo','Leerán un ensayo argumentativo identificando la tesis, argumentos, contraargumentos y falacias. Resumirán mediante omisión, selección, generalización y reconstrucción.','ANALYSIS','feature-fallacies','razonamiento'],
 ['ensayo-argumentativo','Escribirán un ensayo argumentativo utilizando conectores de rectificación, distanciamiento, refuerzo y recapitulación. Revisarán los borradores, márgenes, párrafos, mayúsculas y tildes.','WRITTEN_PRODUCTION','feature-writing-conventions','párrafos'],
 ['discurso-graduacion','Escucharán un discurso de graduación, anticiparán su contenido y explicarán la tesis, las razones y las referencias a los participantes.','ANALYSIS','procedure-prediction','indicios'],
 ['discurso-graduacion','Producirán oralmente un discurso de graduación con una tesis, argumentos y una anécdota pertinente. Usarán entonación, gestos y marcas de cortesía para comunicar el mensaje.','ORAL_PRESENTATION','feature-anecdotes','producción oral'],
 ['discurso-graduacion','Leerán un discurso de graduación y reconocerán otras voces, citas textuales y organizadores intratextuales, expresiones de postura y marcas paratextuales; comprobarán palabras en el diccionario.','ANALYSIS','feature-voices','ideas de otra voz'],
 ['discurso-graduacion','Redactarán un discurso de graduación con un esquema o guion en soporte físico o digital, organizando tesis y argumentos. Usarán deícticos, referencias léxicas, citas y signos de puntuación; revisarán los borradores.','WRITTEN_PRODUCTION','procedure-outline','esquema o guion'],
 ['novela','Escucharán un fragmento de novela y resumirán las acciones, motivaciones, voces y ambiente, distinguiendo el orden cronológico del orden de la narración.','ANALYSIS','feature-order','cronológico'],
 ['novela','Leerán un fragmento de novela, clasificarán personajes y actantes por sus acciones y distinguirán narrador y voces. Consultarán palabras en el diccionario y usarán sinónimos en la paráfrasis.','ANALYSIS','feature-actants','quién actúa'],
 ['poesia-social','Escucharán un poema social, anticiparán su sentido y parafrasearán la problemática y sentimientos que evocan sus imágenes.','ANALYSIS','procedure-paraphrase','problemática'],
 ['poesia-social','Declamarán un poema social con ritmo, entonación y lenguaje gestual y corporal que comunique los sentimientos y sentido del texto.','ORAL_PRESENTATION','recitation-expression','sentimientos'],
 ['poesia-social','Leerán una poesía social, interpretarán los sentidos connotativos y denotativos y parafrasearán el contenido con vocabulario pertinente.','ANALYSIS','feature-meaning','connotaciones'],
 ['poesia-social','Escribirán un poema social usando metáfora y personificación. Revisarán ortografía y borradores y publicarán el poema en un mural o revista escolar.','WRITTEN_PRODUCTION','process-publication','medio solicitado'],
 ['monologo','Escucharán un monólogo, parafrasearán el tema e inferirán el punto de vista del autor. Identificarán objetos simbólicos y rasgos de la personalidad de la voz monologal.','ANALYSIS','feature-symbols','significado'],
 ['monologo','Representarán un monólogo utilizando objetos como símbolos y recursos verbales y no verbales para expresar el punto de vista del personaje.','PERFORMANCE','performance','Representa'],
 ['monologo','Leerán un monólogo teatral y subrayarán intervenciones relevantes. Inferirán el punto de vista del autor y relacionarán la situación con la realidad cotidiana y otras materias.','ANALYSIS','author-view','inferencia'],
 ['monologo','Escribirán un monólogo con secuencias de narración, descripción y argumentación; usarán objetos como símbolos, conectores lógicos, figuras literarias y rasgos de personalidad de la voz. Revisarán los borradores.','WRITTEN_PRODUCTION','feature-sequences','Emplea'],
]
const extras=[
 ['monologo','Representarán un monólogo utilizando recursos verbales y no verbales para hacer reconocible el punto de vista de la voz.','PERFORMANCE','feature-nonverbal','no verbales','segundo actor'],
 ['monologo','Analizarán un monólogo atendiendo solo a la descripción del personaje.','ANALYSIS','feature-sequences','descripción','Representa la voz'],
 ['discurso-graduacion','Analizarán un discurso de graduación atendiendo solo a las oraciones desiderativas.','ANALYSIS','feature-attitude','desiderativas','las oraciones interrogativas'],
 ['informe-investigacion','Redactarán un informe de investigación con datos dados y recomendaciones sustentadas en los resultados.','REPORT','recommendations','resultados','Origen de la información'],
 ['informe-investigacion','Analizarán un informe de investigación atendiendo solo a conectores de concesión y expresiones modalizadoras.','ANALYSIS','feature-modalizers','certeza','Redacta'],
 ['informe-investigacion','Presentarán oralmente un informe de investigación explicando el problema, el método y los resultados disponibles.','ORAL_PRESENTATION','results','Relaciona los resultados','Comprueba cómo'],
 ['informe-investigacion','Investigarán información y fuentes para un informe de investigación.','RESEARCH','research-sources','fuentes','No aporta evidencia suficiente'],
 ['reportaje','Escribirán un reportaje con información y testimonios ya proporcionados sin realizar entrevistas.','WRITTEN_PRODUCTION','feature-testimony','declaraciones','realiza entrevistas'],
 ['reportaje','Analizarán solo las oraciones subordinadas de un reportaje.','ANALYSIS','feature-subordinate','proposición','oraciones subordinadas sustantivas especificativas'],
 ['reportaje','Elaborarán un reportaje usando una fotografía o un gráfico con información ya proporcionada.','WRITTEN_PRODUCTION','feature-graphics','fotografía o gráfico','fotografía y gráfico'],
 ['reportaje','Investigarán los hechos de un reportaje y contrastarán la fiabilidad de las fuentes.','RESEARCH','source-reliability','discrepancias','Redacta'],
 ['ensayo-argumentativo','Escribirán un ensayo argumentativo sobre el reportaje leído, defendiendo una tesis con razones propias.','WRITTEN_PRODUCTION','arguments','Sostiene la tesis','Desarrollo informativo del reportaje'],
 ['ensayo-argumentativo','Analizarán únicamente las falacias de un ensayo argumentativo, justificando qué conclusión no sostienen sus razones.','ANALYSIS','feature-fallacies','razonamiento','Redacta'],
 ['discurso-graduacion','Presentarán por escrito un discurso de graduación con una tesis y razones sustentadas.','WRITTEN_PRODUCTION','thesis','Fundamenta','Comunica la ocasión'],
 ['discurso-graduacion','Presentarán oralmente un discurso de graduación con entonación expresiva, sin anécdotas ni gestos obligatorios.','ORAL_PRESENTATION','feature-nonverbal','la entonación','las anécdotas'],
 ['novela','Analizarán solo los tipos de narrador de los fragmentos de novela disponibles y qué conoce cada voz.','ANALYSIS','feature-narrator-types','conoce','desenlace'],
 ['novela','Identificarán únicamente el narrador de un fragmento de novela con evidencias de sus intervenciones.','ANALYSIS','narrator','Distingue','motivaciones de los personajes'],
 ['novela','Elaborarán un informe sobre un fragmento de novela sustentando las interpretaciones en sus pasajes.','REPORT','report-evidence','pasajes','Escribe una novela'],
 ['poesia-social','Escribirán poesía social en verso libre sin rima obligatoria, sin publicarla ni declamarla.','WRITTEN_PRODUCTION','feature-verse','el verso libre','rima consonante'],
 ['poesia-social','Escribirán un poema social en verso rimado.','WRITTEN_PRODUCTION','feature-verse','el verso rimado','catorce versos'],
 ['poesia-social','Declamarán un poema social con entonación, sin gestos obligatorios.','ORAL_PRESENTATION','recitation-expression','sentimientos','los gestos'],
 ['monologo','Analizarán el monólogo representado explicando la voz y la situación.','ANALYSIS','voice','Interpreta','Representa la voz'],
 ['monologo','Escribirán un monólogo teatral sin representarlo ni utilizar objetos.','WRITTEN_PRODUCTION','voice','Construye','objetos simbólicos'],
 ['monologo','Presentarán por escrito un análisis de un monólogo representado usando sus intervenciones.','ANALYSIS','voice','Interpreta','Representa la voz'],
 ['monologo','Compararán un soliloquio y una comedia de pie como formas de monólogo, contrastando la relación de la voz con el público.','COMPARISON','feature-types','comedia de pie','segundo actor'],
]
const labels=['informe de investigación','reportaje','ensayo argumentativo','discurso de graduación','novela','poesía social','monólogo']
for(const [i,t] of source.topics.entries()){
 extras.push([t.provider,`Compararán dos textos de ${labels[i]} explicando semejanzas y diferencias sustentadas en pasajes.`, 'COMPARISON',i===0?'results':i===1?'context':i===2?'arguments':i===3?'thesis':i===4?'narrator':i===5?'meaning':'voice',i===3?'Compara':'Contrasta','No aporta evidencia suficiente'])
 extras.push([t.provider,`Debatirán una interpretación de ${labels[i]} con evidencias del texto y responderán a otras posturas.`, 'DEBATE','debate','responde','Redacta'])
 if(i!==0&&i!==4)extras.push([t.provider,`Elaborarán un informe sobre ${labels[i]} justificando la interpretación con pasajes disponibles.`, 'REPORT','report-evidence','pasajes','No aporta evidencia suficiente'])
}
const fixtures=[...rows,...extras].map(([topic,description,type,criterion,contains,absent],i)=>({id:`procedure-family-${i+1}`,topic,description,type,criterion,contains,absent:absent??'No aporta evidencia suficiente',...(i<rows.length?{sourceTopicId:source.topics.find(t=>t.provider===topic).id}:{})}))
fs.writeFileSync('data/evaluation-instruments/language-grade-six-procedure-contracts.json',JSON.stringify(fixtures,null,2)+'\n')
console.log({modalityContracts:rows.length,additionalContracts:extras.length,total:fixtures.length})
