import fs from 'node:fs'
const source=JSON.parse(fs.readFileSync('docs/curriculum/cobertura-secundaria/lengua-5-cotejo-fuente.json','utf8'))
const rows=[
 ['carta-autopresentacion','Escucharán una carta de autopresentación y anticiparán el propósito a partir del destinatario. Resumirán el contenido mediante omisión, selección, generalización y reconstrucción de ideas.','ANALYSIS','feature-summary','generalización'],
 ['carta-autopresentacion','Planificarán una carta de autopresentación expresando intereses, preparación, experiencias y habilidades con conectores de finalidad y vocabulario pertinente al destinatario. La conversación preparará la escritura.','WRITTEN_PRODUCTION','procedure-outline','destinatario'],
 ['carta-autopresentacion','Leerán una carta de autopresentación e inferirán el significado de palabras desconocidas por el contexto; comprobarán su acepción en el diccionario y parafrasearán su contenido.','ANALYSIS','procedure-dictionary','acepción'],
 ['carta-autopresentacion','Redactarán una carta de autopresentación en soporte digital, con lugar y fecha, destinatario, saludo, asunto, despedida y firma. Revisarán los borradores atendiendo a la brevedad y credibilidad del contenido.','WRITTEN_PRODUCTION','credibility','brevedad'],
 ['resena','Escucharán una reseña, inferirán la intención del autor y parafrasearán la síntesis y la valoración de la obra.','ANALYSIS','procedure-paraphrase','valoración'],
 ['resena','Planificarán una reseña seleccionando citas claves y testimonios de la obra para fundamentar su valoración. Organizarán las ideas y el vocabulario para su audiencia.','WRITTEN_PRODUCTION','feature-testimony','testimonios'],
 ['resena','Leerán una reseña, anticiparán su contenido a partir de las marcas paratextuales y comprobarán palabras desconocidas en el diccionario.','ANALYSIS','procedure-dictionary','acepción'],
 ['resena','Escribirán una reseña con título, ficha bibliográfica, resumen y valoración personal de una película. Examinarán códigos, actores, director, técnicos y elementos verbales, paraverbales y no verbales. Revisarán y publicarán el texto en soporte digital.','WRITTEN_PRODUCTION','feature-audiovisual','códigos expresivos'],
 ['ensayo-argumentativo','Escucharán un ensayo argumentativo, reconocerán pienso que y me parece que como opinión personal y según y de acuerdo con como fórmulas de citas. Resumirán la tesis y argumentos.','ANALYSIS','feature-citation-formula','atribución'],
 ['ensayo-argumentativo','Planificarán un ensayo argumentativo para escribirlo, justificando el tema y título y organizando tesis, fuentes, argumentos y contraargumentos para su audiencia.','WRITTEN_PRODUCTION','procedure-outline','tesis'],
 ['ensayo-argumentativo','Leerán un ensayo argumentativo, anticiparán su tesis a partir del título y comprobarán en el diccionario palabras desconocidas para comprender las razones del autor.','ANALYSIS','procedure-dictionary','acepción'],
 ['ensayo-argumentativo','Redactarán un ensayo argumentativo usando conectores de digresión, adición, contraste, consecuencia y orden; revisarán márgenes, párrafos, mayúsculas, tildes y signos de puntuación.','WRITTEN_PRODUCTION','feature-writing-conventions','párrafos'],
 ['discurso-recibimiento-despedida','Escucharán un discurso de despedida y anticiparán su contenido. Parafrasearán las razones del homenaje y distinguirán las marcas de cortesía y deícticos.','ANALYSIS','procedure-paraphrase','participantes'],
 ['discurso-recibimiento-despedida','Producirán oralmente un discurso de recibimiento con gestos, entonación, ritmo y pausas para expresar las razones de la bienvenida. Identificarán las fuentes bibliográficas utilizadas.','ORAL_PRESENTATION','feature-nonverbal','producción oral'],
 ['discurso-recibimiento-despedida','Leerán un discurso de despedida, reconocerán marcas paratextuales, subrayados, números y letras, negritas e itálicas para localizar la tesis y las razones; comprobarán palabras en el diccionario.','ANALYSIS','feature-markers','localizar'],
 ['discurso-recibimiento-despedida','Redactarán un discurso de recibimiento con un guion en soporte físico o digital, citas textuales, referencias bibliográficas, deícticos y conectores de apertura y cierre. Revisarán los borradores.','WRITTEN_PRODUCTION','feature-sources','origen'],
 ['novela','Escucharán un fragmento de novela, anticiparán su contenido y resumirán acontecimientos, personajes, narrador y ambiente relacionando las causas de las acciones disponibles.','ANALYSIS','procedure-paraphrase','pasaje disponible'],
 ['novela','Leerán un fragmento de novela, clasificarán personajes y actantes por sus acciones e interpretarán las voces. Consultarán palabras en el diccionario y usarán sinónimos en el resumen.','ANALYSIS','feature-synonyms','referente'],
 ['poesia-satirica','Escucharán un poema satírico y anticiparán su sentido a partir del título; inferirán palabras por el contexto y explicarán los significados implícitos y explícitos de la crítica.','ANALYSIS','feature-meaning','literal'],
 ['poesia-satirica','Declamarán un poema satírico con entonación, ritmo, pausas y lenguaje gestual y corporal que comuniquen el sentido de la crítica.','ORAL_PRESENTATION','recitation-expression','sentido de la crítica'],
 ['poesia-satirica','Leerán una poesía satírica, analizarán los elementos connotativos y denotativos y parafrasearán su sentido global.','ANALYSIS','feature-meaning','literal'],
 ['poesia-satirica','Escribirán una poesía satírica con metáfora e ironía sobre una situación social. Revisarán ortografía y borradores y publicarán el poema en la revista escolar.','WRITTEN_PRODUCTION','process-publication','medio solicitado'],
 ['entremes-teatral','Escucharán un entremés teatral, anticiparán su contenido y parafrasearán el tema. Relacionarán los hechos de la escena con hechos actuales y contenidos de otras materias.','ANALYSIS','connections','semejanzas'],
 ['entremes-teatral','Representarán un entremés teatral con sus compañeros, enlazando los diálogos, las acciones de los personajes y la crítica de la escena.','PERFORMANCE','performance','Representa'],
 ['entremes-teatral','Leerán un entremés teatral, subrayarán información relevante e inferirán el punto de vista implícito del autor a partir de la escena. Investigarán su vida y contexto social para contrastar su interpretación.','ANALYSIS','author-context','documentada'],
 ['entremes-teatral','Escribirán un entremés teatral con crítica social y contexto espacial y temporal, utilizando ironía, retruécano y metáfora. Revisarán borradores y publicarán el texto en un mural.','WRITTEN_PRODUCTION','feature-figures','retruécano'],
]
const extras=[
 ['carta-autopresentacion','Redactarán una carta de autopresentación con lugar y fecha, cargo del destinatario, saludo, cuerpo, despedida y firma en formato físico o digital.','WRITTEN_PRODUCTION','feature-letter-parts','la firma','físico y digital'],
 ['carta-autopresentacion','Redactarán una carta de autopresentación en soporte digital y enviarán la versión final al destinatario acordado.','WRITTEN_PRODUCTION','delivery-confirmation','envío','correo tradicional'],
 ['ensayo-argumentativo','Leerán un ensayo argumentativo y resumirán sus argumentos mediante omisión y generalización.','ANALYSIS','feature-summary','la generalización','la selección'],
 ['ensayo-argumentativo','Escribirán un ensayo argumentativo utilizando argumentos por causa y efecto.','WRITTEN_PRODUCTION','feature-arguments','los argumentos causales','estadísticos'],
 ['discurso-recibimiento-despedida','Redactarán discursos de recibimiento y despedida con un guion en soporte físico o digital.','WRITTEN_PRODUCTION','medium','físico o digital','físico y digital'],
 ['novela','Compararán dos fragmentos de novela usando sinónimos para referirse a sus personajes sin cambiar el sentido.','COMPARISON','feature-synonyms','referente','Escribe una novela'],
 ['poesia-satirica','Escribirán un poema satírico en verso.','WRITTEN_PRODUCTION','tone','en verso','en verso o prosa'],
 ['entremes-teatral','Analizarán un entremés teatral y subrayarán las intervenciones que sustentan la interpretación del conflicto.','ANALYSIS','underlining','Subraya','representa físicamente'],
 ['entremes-teatral','Leerán un entremés teatral e inferirán el punto de vista implícito del autor usando las acciones e intervenciones.','ANALYSIS','author-view','inferencia','investiga la vida'],
 ['carta-autopresentacion','Elaborarán un informe sobre una carta de autopresentación justificando su propósito con pasajes.','REPORT','report-evidence','pasajes','envío'],
 ['carta-autopresentacion','Redactarán una carta de autopresentación en soporte físico o digital y anotarán los datos del destinatario en el sobre.','WRITTEN_PRODUCTION','delivery','destinatario','físico y digital'],
 ['carta-autopresentacion','Redactarán una carta de autopresentación sin enviarla ni publicarla.','WRITTEN_PRODUCTION','purpose','Organiza','publicación'],
 ['resena','Escribirán una reseña de una novela policíaca leída justificando su valoración con pistas de la obra.','WRITTEN_PRODUCTION','assessment','Sustenta','misterio en el fragmento'],
 ['resena','Escribirán una reseña con ficha bibliográfica y citas claves de la obra.','WRITTEN_PRODUCTION','feature-bibliography','identificar','actuación'],
 ['ensayo-argumentativo','Escribirán un ensayo argumentativo con argumentos por causa y efecto y teorías o generalizaciones.','WRITTEN_PRODUCTION','feature-arguments','generalización','estadísticos'],
 ['ensayo-argumentativo','Redactarán un ensayo argumentativo usando según y de acuerdo con para atribuir ideas a sus autores.','WRITTEN_PRODUCTION','feature-citation-formula','atribución','ante la audiencia'],
 ['discurso-recibimiento-despedida','Presentarán por escrito un discurso de despedida explicando las razones de la separación.','WRITTEN_PRODUCTION','reasons','Relaciona','Comunica la ocasión'],
 ['discurso-recibimiento-despedida','Presentarán oralmente un discurso de despedida con entonación expresiva.','ORAL_PRESENTATION','feature-nonverbal','la entonación','los gestos'],
 ['novela','Identificarán únicamente el narrador de un fragmento de novela mediante sus intervenciones.','ANALYSIS','narrator','Distingue','motivaciones de los personajes'],
 ['novela','Analizarán una novela atendiendo solo a los verbos en pasado y presente.','ANALYSIS','feature-past','presente','Temas sustentados'],
 ['poesia-satirica','Escribirán una poesía satírica en prosa sin recitarla ni publicarla.','WRITTEN_PRODUCTION','tone','en prosa','catorce'],
 ['poesia-satirica','Analizarán solo la metáfora de una poesía satírica utilizando ejemplos del texto.','ANALYSIS','feature-figures','la metáfora','la antítesis'],
 ['entremes-teatral','Analizarán un fragmento de entremés teatral relacionando las intervenciones con la crítica social. Presentarán por escrito su análisis.','ANALYSIS','critique','Interpreta','Representa las intervenciones'],
 ['entremes-teatral','Investigarán el origen del entremés teatral en el Siglo de Oro y contrastarán fuentes sobre su evolución.','RESEARCH','research-sources','fuentes','Escribe'],
 ['entremes-teatral','Escribirán un entremés teatral sin representarlo ni publicarlo.','WRITTEN_PRODUCTION','scene','Desarrolla una escena','Representa las intervenciones'],
]
const labels=['carta de autopresentación','reseña','ensayo argumentativo','discurso de recibimiento','novela','poesía satírica','entremés teatral']
for(const [i,t] of source.topics.entries()){
 extras.push([t.provider,`Compararán dos textos de ${labels[i]} explicando semejanzas y diferencias sustentadas en pasajes.`, 'COMPARISON',i===0?'purpose':i===1?'assessment':i===2?'arguments':i===3?'reasons':i===4?'narrator':'critique',i===0?'Contrasta':i===1?'Compara':i===2?'Contrasta':i===3?'Compara':'Contrasta','No aporta evidencia suficiente'])
 if(i!==0)extras.push([t.provider,`Debatirán una interpretación de ${labels[i]} con evidencias del texto y responderán a otras posturas.`, 'DEBATE','debate','responde','Redacta'])
 if(i>0&&i!==4)extras.push([t.provider,`Elaborarán un informe sobre ${labels[i]} explicando su interpretación con pasajes disponibles.`, 'REPORT','report-evidence','pasajes','No aporta evidencia suficiente'])
}
const fixtures=[...rows,...extras].map(([topic,description,type,criterion,contains,absent],i)=>({id:`procedure-family-${i+1}`,topic,description,type,criterion,contains,absent:absent??'No aporta evidencia suficiente',...(i<rows.length?{sourceTopicId:source.topics.find(t=>t.provider===topic).id}:{})}))
fs.writeFileSync('data/evaluation-instruments/language-grade-five-procedure-contracts.json',JSON.stringify(fixtures,null,2)+'\n')
console.log({modalityContracts:rows.length,additionalContracts:extras.length,total:fixtures.length})
