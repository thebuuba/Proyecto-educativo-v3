import fs from 'node:fs'
import assert from 'node:assert/strict'
const scope=JSON.parse(fs.readFileSync('docs/curriculum/cobertura-secundaria/inventario.json')).scopes.find(s=>s.grade===2&&s.subject.startsWith('Lengua')&&s.character==='COMMON')
const rows=[
 ['Escucharán una noticia e identificarán el hecho, sus datos y las interrogantes fundamentales.','NEWS_ANALYSIS','news-analysis-questions','ocurrió'],
 ['Presentarán un noticiero usando vocabulario temático y oraciones coordinadas y subordinadas para relatar la noticia.','NEWSCAST','news-feature-complex-sentences','coordinadas'],
 ['Leerán una noticia, anticiparán su contenido, comprobarán sus predicciones y parafrasearán sus datos. Inferirán el significado de palabras desconocidas por el contexto.','NEWS_ANALYSIS','news-procedure-vocabulary','contexto'],
 ['Parafrasearán una guía turística escuchada explicando con sus propias palabras los lugares y sus indicaciones.','TOURIST_GUIDE_ANALYSIS','len-2-guia-turistica-procedure-paraphrase','lugares'],
 ['Producirán oralmente una guía turística usando mapas o fotografías, la descripción topográfica y verbos en presente del indicativo.','TOURIST_GUIDE_PRESENTATION','len-2-guia-turistica-graphics','mapas o fotografías'],
 ['Leerán una guía turística, clasificarán los lugares y reconstruirán su sentido con un organizador gráfico.','TOURIST_GUIDE_ANALYSIS','len-2-guia-turistica-procedure-reconstruction','representación'],
 ['Elaborarán una guía turística con mapas y fotografías. Revisarán los borradores antes de entregar la versión final.','TOURIST_GUIDE_CREATION','len-2-guia-turistica-graphics','mapas y fotografías'],
 ['Escucharán un artículo expositivo e inferirán la relación entre el problema y su solución con apoyos del texto.','ANALYSIS','len-2-articulo-expositivo-problem-solution','problema'],
 ['Parafrasearán un artículo expositivo escuchado conservando la idea principal y sus apoyos.','ANALYSIS','len-2-articulo-expositivo-procedure-paraphrase','solución'],
 ['Producirán oralmente un artículo expositivo con citas o datos y apoyos audiovisuales que expliquen el problema y las soluciones.','ORAL_PRESENTATION','len-2-articulo-expositivo-procedure-supports','citas o datos'],
 ['Leerán un artículo expositivo y construirán un cuadro sinóptico para representar el problema y sus soluciones.','ANALYSIS','len-2-articulo-expositivo-procedure-organizer','cuadro sinóptico'],
 ['Redactarán un artículo expositivo con gráficos que ilustren el problema y su solución. Planificarán con un mapa conceptual, revisarán los borradores y publicarán la versión final.','WRITTEN_PRODUCTION','len-2-articulo-expositivo-procedure-supports','gráficos'],
 ['Escucharán un informe de lectura, anticiparán su contenido a partir del título y lo parafrasearán.','READING_REPORT_ANALYSIS','len-2-informe-de-lectura-procedure-paraphrase','interpretación'],
 ['Expondrán un informe de lectura sobre un cuento con resumen y análisis sustentado de sus temas.','READING_REPORT_PRESENTATION','len-2-informe-de-lectura-summary','Selecciona y resume'],
 ['Leerán un informe de lectura, anticiparán su contenido y explicarán la función de la oración temática de sus párrafos.','READING_REPORT_ANALYSIS','len-2-informe-de-lectura-paragraphs','oración temática'],
 ['Redactarán un informe de lectura de un cuento con resumen y análisis. Revisarán los borradores y publicarán la versión final.','REPORT','len-2-informe-de-lectura-process-publication','medio solicitado'],
 ['Escucharán un cuento de amor y amistad e identificarán sus personajes, actantes, ambiente y conectores lógicos.','ANALYSIS','len-2-cuento-amor-amistad-feature-actants','actantes'],
 ['Narrarán oralmente un cuento de amor y amistad utilizando diálogo de estilo directo e indirecto y variaciones de voz según los personajes.','ORAL_PRESENTATION','len-2-cuento-amor-amistad-feature-dialogue','indirecto'],
 ['Leerán un cuento de amor y amistad y parafrasearán su contenido identificando motivaciones y relaciones entre personajes y ambiente.','ANALYSIS','len-2-cuento-amor-amistad-procedure-paraphrase','personajes'],
 ['Escribirán un cuento de amor y amistad. Planificarán un esquema secuencial y emplearán pronombres y conectores coordinantes y subordinantes. Revisarán los borradores y publicarán la versión final.','WRITTEN_PRODUCTION','len-2-cuento-amor-amistad-feature-pronouns','pronombres'],
 ['Escucharán una décima espinela y parafrasearán su sentido global con sus propias palabras.','ANALYSIS','len-2-decima-espinela-procedure-paraphrase','versos'],
 ['Recitarán una décima espinela utilizando entonación y lenguaje gestual para comunicar las emociones de los versos.','ORAL_PRESENTATION','len-2-decima-espinela-recitation-expression','sentido'],
 ['Leerán una décima espinela e interpretarán sus diez versos octosílabos, rima y ritmo con ejemplos.','ANALYSIS','len-2-decima-espinela-verse','octosilábico'],
 ['Escribirán una décima espinela usando metáfora y antítesis. Revisarán el borrador y publicarán la versión final en un mural.','WRITTEN_PRODUCTION','len-2-decima-espinela-feature-literary','antítesis'],
]
const procedures=scope.topics.flatMap(t=>t.procedures.map(p=>({topic:t.title,sourceId:p.id,pdfPage:p.pdfPage})))
assert.equal(procedures.length,rows.length)
const fixtures=rows.map(([description,type,criterion,contains],i)=>({id:'procedure-'+(i+1),...procedures[i],description,type,criterion,contains,absent:'No aporta evidencia suficiente'}))
fs.writeFileSync('data/evaluation-instruments/language-grade-two-procedure-contracts.json',JSON.stringify(fixtures,null,2)+'\n')
