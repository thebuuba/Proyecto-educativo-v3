import type {SocialTopic} from './secondary-social-grade-1'

type Add=(key:string,title:string,success:string,partial:string,error:string,weight?:number)=>unknown
/** Sexto conserva acciones, ámbitos y datos pedidos; formatos y puntuación siguen siendo comunes. */
export function addSixthGradeSocialEvidence(topic:SocialTopic,text:string,label:string,add:Add):boolean{
 if(topic.grade!==6)return false
 const is=(...ids:string[])=>ids.includes(topic.id)
 if(is('source-similarity-review')){
  add('similarity-context','Coincidencias y contexto de atribución','Localiza las coincidencias del informe antiplagio proporcionado en el texto y sus fuentes, distinguiendo citas, paráfrasis y fragmentos que requieren revisión sin tratar un porcentaje como prueba de veracidad o autoría.','Localiza coincidencias pertinentes, pero una conclusión no se vincula con el fragmento o su atribución.','Declara plagio o autenticidad solo por el porcentaje o atribuye coincidencias ausentes al informe.',4)
  if(/correcciones/.test(text))add('attribution-correction','Corrección de los problemas de atribución','Propone correcciones de cita, paráfrasis o referencia para los fragmentos que lo requieren y explica qué problema de atribución corrigen sin alterar el sentido de la fuente.','La corrección responde al fragmento, pero una atribución o explicación queda incompleta.','La corrección oculta la coincidencia, altera el sentido de la fuente o atribuye el fragmento a otro autor.',3)
  return true
 }
 if(is('natural-resource-research')&&/busqueda documental/.test(text)){
  add('research-content','Hallazgos de la búsqueda documental de recursos','Sintetiza los hallazgos de los registros proporcionados sobre los recursos dominicanos expresamente solicitados conservando espacios, contexto y límites sin exigir investigar predios reales o todos los recursos del país.','La síntesis contiene información pertinente, pero una relación no conserva el espacio o alcance del registro.','Presenta como hallazgo una afirmación incompatible con los registros o inventa datos de predios reales.',4)
  add('sources','Procedencia de los hallazgos documentales','Hace reconocible la procedencia de los hallazgos seleccionados y explica su pertinencia y alcance para la búsqueda solicitada, distinguiendo registros e información documental disponible.','Utiliza información pertinente, pero una procedencia o límite no puede reconocerse.','Atribuye a un registro información ausente o utiliza datos sin procedencia reconocible.',3);return true
 }
 if(is('historical-evolution-since-1961')){
  add('historical-evolution','Cambios y continuidades desde 1961','Relaciona los cambios y continuidades dominicanos desde 1961 expresamente examinados con las evidencias sociales, políticas y económicas proporcionadas, conservando la fecha y alcance de los materiales sin inventar una actualización.','Reconoce cambios pertinentes, pero una continuidad o relación no se vincula con su evidencia y período.','Confunde períodos o presenta como actualidad comprobada información ausente de los materiales.',4);return true
 }
 if(is('dominican-position')&&/mapas|informaciones/.test(text)){
  add('geographic-evidence','Posición y extensión del territorio dominicano','Interpreta la posición, ubicación, límites y extensión expresamente solicitados de República Dominicana mediante referencias de los mapas e informaciones proporcionados y explica las ventajas o desventajas respaldadas por esos datos.','Reconoce referencias pertinentes, pero una ventaja o desventaja no se relaciona con el dato geográfico que la respalda.','Atribuye al territorio límites, extensión o ventajas incompatibles con las referencias del ejercicio.',4)
  if(/isla/.test(text))add('spatial-scope','Distinción entre país e isla','Distingue República Dominicana de toda la isla de Santo Domingo, conservando límites y ámbito de las referencias del ejercicio sin atribuir al país la superficie del otro Estado.','Distingue país e isla, pero una referencia territorial queda imprecisa.','Confunde país e isla o atribuye a República Dominicana toda la superficie insular.',4)
  return true
 }
 if(is('dominican-boundaries')&&/comprueb|verific/.test(text)){
  add('boundary-evidence','Verificación de afirmaciones fronterizas','Contrasta las afirmaciones del ejercicio sobre fronteras dominicanas con referencias localizables en los mapas y documentos dados, distinguiendo información, interpretación y alcance temporal sin resolver una controversia real.','Reconoce información pertinente, pero una afirmación no se vincula con una referencia o su alcance.','Declara verificada una afirmación incompatible con los documentos o atribuye vigencia ausente.',4)
  if(/efectos|consecuencias/.test(text))add('consequences','Efectos políticos y económicos del caso fronterizo','Explica los efectos políticos y económicos expresamente examinados relacionándolos con las condiciones y evidencias del caso fronterizo ficticio.','Reconoce efectos pertinentes, pero una conexión con las condiciones del caso queda sin explicar.','Atribuye efectos ajenos al caso o confunde consecuencias y antecedentes.',3)
  return true
 }
 if(is('mountains-climate-soils')&&/analiz|interpret/.test(text)){
  add('physical-relations','Relaciones entre relieve, clima y suelos','Relaciona montañas, diversificación climática y variación de suelos dominicanos expresamente examinadas con las afirmaciones y evidencias de los espacios dados, distinguiendo conexiones respaldadas y relaciones inciertas.','Reconoce elementos pertinentes, pero una relación espacial o entre factores no tiene respaldo reconocible.','Confunde factores o atribuye a un espacio condiciones incompatibles con el material.',4);return true
 }
 if(is('valleys-plains')&&/mapas/.test(text)){
  add('spatial-evidence','Lectura de valles, llanuras y regiones','Interpreta las posiciones y características solicitadas de valles, llanuras y regiones especiales en los mapas proporcionados, conservando leyendas y referencias al explicar los usos del territorio del caso.','Reconoce lugares pertinentes, pero una relación de uso o referencia espacial queda imprecisa.','Atribuye al mapa usos o posiciones ausentes o incompatibles con su leyenda.',4);return true
 }
 if(is('coastal-relief','coastal-marine-ecosystems')&&/datos|mapas/.test(text)){
  add('coastal-relations','Relieve, ecosistemas y usos costeros','Explica las características y relaciones entre playas, bahías, ensenadas, ecosistemas y usos expresamente incluidos en los datos costeros del ejercicio, manteniendo sus espacios y distinguiendo observación e inferencia.','Reconoce características pertinentes, pero una relación con el uso o espacio del caso queda sin respaldo.','Confunde formas costeras y ecosistemas o inventa mediciones y usos ajenos al material.',4);return true
 }
 if(is('agroforestry-systems')&&/clasificacion|clasifica/.test(text)){
  add('research-content','Información recopilada sobre sistemas agroforestales','Sintetiza los hallazgos de las fuentes dadas sobre los sistemas agroforestales dominicanos solicitados, conservando su contexto y distinguiendo datos e inferencias sin exigir estudios de fincas reales.','La síntesis conserva información pertinente, pero una relación no mantiene el contexto o respaldo de la fuente.','Atribuye a los sistemas características ausentes o presenta datos inventados como recopilados.',4)
  add('agroforestry-classification','Clasificación de los sistemas agroforestales','Clasifica los sistemas dados mediante composición, estructura y función, explicando qué características respaldan cada clasificación sin tratar las tres dimensiones como equivalentes.','Usa dimensiones pertinentes, pero una clasificación no se relaciona con las características del sistema.','Confunde composición, estructura y función o clasifica mediante rasgos incompatibles con los datos.',4);return true
 }
 if(is('agroforestry-systems')&&/ventajas|implement/.test(text)){
  add('agroforestry-development','Ventajas e implementación agroforestal','Relaciona las ventajas económicas de los sistemas agroforestales examinados con su implementación y condiciones en los casos dominicanos proporcionados, conservando los límites de cada caso.','Reconoce una ventaja pertinente, pero no explica una relación con las condiciones de implementación.','Generaliza una ventaja a todo el país o atribuye al caso una implementación no documentada.',4);return true
 }
 if(is('protected-areas-law','renewable-energy-norms','protected-areas-system')&&/comprueb|verific/.test(text)){
  add('norm-source-verification','Contraste documental de referencias ambientales','Contrasta la información y referencias ambientales expresamente indicadas con los documentos del ejercicio, conservando autoría, fecha, denominación y alcance y señalando discrepancias sin certificar vigencia ni corregir silenciosamente el currículo.','El contraste utiliza documentos pertinentes, pero una discrepancia o referencia queda sin localizar.','Declara vigente una disposición sin respaldo o cambia la referencia curricular sin distinguir texto y corrección.',4);return true
 }
 if(is('environmental-project')&&/seleccion/.test(text)){
  add('project-steps','Pasos del proyecto ambiental','Selecciona y ordena pasos compatibles con el propósito de protección ambiental y las condiciones políticas, económicas y de conservación del caso ficticio, diferenciando planificación y ejecución.','Selecciona pasos pertinentes, pero una relación de orden o compatibilidad queda sin explicar.','Propone pasos ajenos al caso o afirma como ejecutadas acciones solo previstas.',4)
  add('project-justification','Justificación de los pasos seleccionados','Justifica cómo los pasos previstos responden al problema ambiental dado mediante razones vinculadas a sus condiciones y recursos, sin presuponer resultados obtenidos.','La justificación relaciona algunos pasos con el caso, pero una decisión carece de fundamento pertinente.','La justificación es ajena a las condiciones del caso o utiliza resultados inventados.',3);return true
 }
 if(is('environmental-project')&&/actividad escolar/.test(text)){
  add('project-purpose','Propósito de la actividad ambiental','Explica el propósito de la actividad escolar simulada relacionándolo con el problema ambiental y las áreas protegidas del caso dado.','El propósito conserva el tema, pero no explica una conexión con el problema del caso.','El propósito es ajeno al caso o atribuye efectos que la actividad no permite justificar.',4)
  add('project-actions','Acciones y recursos de la actividad','Propone acciones de la actividad compatibles con su propósito y los recursos dados, distinguiendo la planificación de una ejecución o visita real.','Las acciones son pertinentes, pero una no se relaciona con el propósito o recurso indicado.','Las acciones no atienden el propósito o dependen de recursos y contactos ajenos al ejercicio.',3);return true
 }
 if(is('digital-repositories')&&/utiliz|seleccion|identific/.test(text)){
  add('repository-selection','Selección y procedencia de los registros','Selecciona documentos pertinentes al tema entre los registros de repositorios proporcionados, justificando la elección mediante procedencia, fecha y alcance sin confundir el catálogo con el contenido de un documento no disponible.','La selección es pertinente, pero una atribución o límite del registro queda sin justificar.','Selecciona registros ajenos al tema o atribuye al documento información ausente de los materiales.',4);return true
 }
 if(is('national-official-sources','international-official-sources')){
  const national=is('national-official-sources')
  add(national?'official-source-selection':'international-source-selection',national?'Pertinencia de las fuentes oficiales nacionales':'Selección de información de organismos internacionales',`Selecciona la información ${national?'cuantitativa o cualitativa nacional':'de organismos internacionales'} solicitada en los registros proporcionados y explica su pertinencia conservando procedencia, fecha, alcance y unidades cuando corresponden, sin suponer infalibilidad por su carácter oficial.`,`La selección es pertinente, pero una referencia, unidad o límite de comparabilidad queda sin explicar.`,`Selecciona información ajena al propósito o combina datos de distintos períodos o alcances como equivalentes.`,4);return true
 }
 if(is('water-access')&&/seleccion/.test(text)&&/proyecto/.test(text)){
  add('project-purpose','Propósito del proyecto de acceso al agua','Delimita el propósito del proyecto con los problemas de acceso al agua expresamente examinados y las condiciones del caso ficticio, sin exigir todos los problemas hídricos.','El propósito conserva el tema, pero una necesidad no se vincula con las condiciones del caso.','El propósito no responde a las necesidades dadas o depende de caudales inventados.',4)
  add('project-actions','Pasos del proyecto de agua','Selecciona pasos y acciones coherentes con el propósito y las condiciones de distribución, acopio, riego, contaminación u otros problemas expresamente examinados, distinguiendo previsión y ejecución.','Los pasos son pertinentes, pero una acción no se relaciona con la condición que debe atender.','Los pasos son ajenos al problema o se presentan como acciones ya realizadas.',4)
  add('project-follow-up','Evidencias previstas del proyecto de agua','Propone evidencias observables que permitirían comprobar las acciones previstas sobre acceso al agua, distinguiendo indicadores de seguimiento y resultados todavía no obtenidos.','Una evidencia es pertinente, pero no permite comprobar una acción concreta.','Confunde la intención con un resultado comprobado o inventa mediciones realizadas.',3);return true
 }
 if(is('agrochemical-impact','forestry-mining-impact')&&/analiz/.test(text)){
  add('resource-impact','Actividades, riesgos y evidencia del caso','Relaciona los agroquímicos o actividades forestales y mineras expresamente examinados con los riesgos sanitarios y ambientales respaldados por los datos del caso, distinguiendo evidencia y relaciones inciertas sin emitir diagnósticos personales.','Reconoce riesgos pertinentes, pero una relación no tiene respaldo o no identifica su incertidumbre.','Afirma una causalidad no respaldada o atribuye diagnósticos y mediciones ausentes al caso.',4);return true
 }
 if(is('urban-rural-growth')&&/exodo/.test(text)){
  add('urban-migration-relations','Éxodo y crecimiento urbano del caso','Relaciona los movimientos del campo a la ciudad con las condiciones y evidencias del aumento urbano en el caso ficticio, distinguiendo flujos migratorios y otros cambios demográficos sin culpabilizar a las personas.','Identifica movimientos pertinentes, pero una conexión con el crecimiento o condición del caso queda sin explicar.','Atribuye el crecimiento a rasgos morales o confunde datos de movimientos y población acumulada.',4);return true
 }
 if(is('migration-movements')&&/analiz/.test(text)){
  add('migration-relations','Flujos, condiciones y alcance migratorio','Relaciona los movimientos migratorios expresamente examinados con sus condiciones y datos conservando origen, destino, período y alcance, distinguiendo flujos, derechos e inferencias sin generalizar conductas a nacionalidades.','Reconoce movimientos pertinentes, pero una relación no conserva el período, espacio o evidencia del caso.','Confunde origen y destino o atribuye a una población completa hechos ausentes del material.',4);return true
 }
 if(is('demographic-rates')&&/formulas|calcul/.test(text)){
  add('rate-calculation','Cálculo de tasas demográficas','Aplica las fórmulas indicadas de natalidad y mortalidad a los nacimientos, defunciones y población ficticios del mismo período, conservando denominador y base y haciendo reconocibles operación y resultado.','Plantea la tasa pertinente, pero un cálculo o uso de la base altera parcialmente el resultado.','Confunde numerador y denominador o calcula con poblaciones y períodos incompatibles.',4)
  add('rate-interpretation','Unidades y significado de las tasas','Explica las unidades, base y significado de las tasas obtenidas en el período dado, distinguiendo la proporción respecto de la población de los conteos absolutos de nacimientos o defunciones.','Interpreta el resultado, pero una unidad o referencia a la base queda incompleta.','Presenta una tasa como conteo absoluto o atribuye al resultado un significado incompatible con su base.',4);return true
 }
 if(is('migration-norms')){
  add('migration-norm-evidence','Disposiciones y alcance del texto migratorio','Identifica las disposiciones migratorias solicitadas en el texto proporcionado y explica su alcance en el caso ficticio, conservando condiciones y distinguiendo texto e interpretación sin decidir la situación de una persona real.','Identifica disposiciones pertinentes, pero una interpretación no se vincula con sus condiciones o texto.','Inventa requisitos o atribuye vigencia y decisiones ajenas al documento del ejercicio.',4);return true
 }
 if(is('population-pyramid')&&/analiz|interpret/.test(text)){
  add('population-pyramid-evidence','Lectura de la pirámide poblacional','Relaciona edades y distribución de la pirámide proporcionada conservando escalas, porcentajes, fecha y población representada; ajusta las inferencias a sus límites sin deducir tasas exactas de natalidad o mortalidad solo por su forma.','Lee información pertinente, pero una comparación de edades no conserva escala, porcentaje o alcance.','Confunde porcentajes y conteos o deriva tasas y pronósticos no respaldados por la pirámide.',4);return true
 }
 if(is('supply-demand')){
  if(/graficos|curvas/.test(text))add('supply-demand-graph','Lectura de gráficos de oferta y demanda','Interpreta los cambios del gráfico dado conservando ejes, unidades, período y curvas, distinguiendo desplazamientos y movimientos según los supuestos expresamente proporcionados.','Reconoce cambios pertinentes, pero una relación entre eje, curva y supuesto queda sin explicar.','Invierte ejes o interpreta un movimiento como desplazamiento sin respaldo en los datos.',4)
  else add('supply-demand-relations','Relaciones de oferta y demanda','Explica los efectos de los cambios de oferta y demanda en los casos ficticios dados, relacionando condiciones, movimientos y supuestos con la información disponible sin inventar precios actuales.','Reconoce un efecto pertinente, pero una relación con los supuestos del caso queda sin explicar.','Invierte las relaciones del caso o afirma efectos que sus datos y supuestos no respaldan.',4)
  return true
 }
 if(is('economic-sectors')){
  add('economic-relations','Actividades y relaciones sectoriales','Caracteriza los sectores primario, secundario y terciario expresamente examinados y explica sus relaciones o impacto mediante las actividades, condiciones, fecha y alcance de los datos del caso, sin confundir producción y participación porcentual.','Identifica actividades pertinentes, pero una relación sectorial o referencia temporal queda sin respaldo.','Asigna actividades a un sector incompatible o inventa porcentajes y efectos ajenos a los datos.',4);return true
 }
 if(is('border-agricultural-production')){
  add('productive-relations','Producción fronteriza y desarrollo local','Relaciona los tipos de producción agrícola de las provincias fronterizas indicadas con las condiciones e impacto local respaldados por los datos, conservando provincia y período sin inventar rendimientos.','Reconoce producción pertinente, pero una relación con las condiciones o impacto local queda sin respaldo.','Atribuye a una provincia producción o rendimientos incompatibles con los datos del ejercicio.',4);return true
 }
 if(is('sugar-sector')){
  add('sugar-sector-relations','Incidencia histórica del sector azucarero','Explica la incidencia del sector azucarero dominicano del siglo XX expresamente examinada relacionando hechos, actores y condiciones con las evidencias del material y conservando el período solicitado.','Reconoce hechos pertinentes, pero una relación de incidencia no tiene respaldo reconocible.','Extrapola a otros períodos o atribuye al sector hechos incompatibles con las evidencias dadas.',4);return true
 }
 if(is('social-survey-methods')&&/disen/.test(text)){
  add('research-method-design','Diseño del método de investigación social elegido','Diseña la entrevista, encuesta o sondeo simulado elegido mediante preguntas vinculadas al propósito del problema ficticio, selección de participantes ficticios y registro previsto de respuestas; distingue diseño y recolección sin exigir los tres métodos.','El diseño conserva el propósito, pero una pregunta, selección o registro no permite obtener la información solicitada.','Las preguntas son ajenas al propósito o el diseño exige datos privados o confunde previsión con recolección realizada.',4);return true
 }
 if(is('risk-zones')&&/identific|present|explic/.test(text)){
  add('risk-location','Peligro, exposición y vulnerabilidad del territorio','Identifica las zonas dominicanas indicadas y explica sus condiciones de peligro, exposición y vulnerabilidad mediante las referencias de los mapas dados, distinguiendo riesgo y predicción de un desastre.','Identifica zonas pertinentes, pero una condición de riesgo o referencia espacial queda sin explicar.','Confunde peligro y vulnerabilidad o presenta una localización como predicción de desastre.',4);return true
 }
 if(is('conservative-neoliberalism')||/teorias economicas/.test(text)){
  add('theory-relations','Supuestos, propuestas e incidencia de la teoría','Explica los planteamientos teóricos expresamente indicados relacionando sus supuestos y propuestas con las condiciones y evidencias del caso; distingue argumentos y efectos respaldados sin exigir adhesión ideológica.','Reconoce planteamientos pertinentes, pero una conexión entre supuesto, propuesta y caso queda sin explicar.','Atribuye a la teoría propuestas ausentes o sustituye su explicación por adhesión o efectos inventados.',4);return true
 }
 if(is('trujillo-foreign-policy')){
  add('foreign-policy-evaluation','Valoración de la política internacional examinada','Evalúa las decisiones de política internacional de Trujillo expresamente examinadas en el Caribe y Latinoamérica mediante los criterios y evidencias del material, distinguiendo contextos anteriores y de Guerra Fría sin imponer una postura política actual.','Utiliza criterios pertinentes, pero un juicio no se vincula con su evidencia o contexto.','Valora por preferencia actual o confunde decisiones y contextos incompatibles.',4);return true
 }
 if(is('dictatorship-resistance')&&/exposicion visual/.test(text)){
  add('visual-information','Resistencia histórica representada','Selecciona y organiza los hechos, actores y condiciones de resistencia a la dictadura expresamente solicitados, conservando las atribuciones de los textos e imágenes dados sin inventar testimonios.','Conserva hechos pertinentes, pero una atribución o relación con los actores queda incompleta.','Atribuye a una forma de resistencia hechos ausentes o presenta testimonios inventados como auténticos.',4)
  add('visual-relations','Relaciones entre textos e imágenes de resistencia','Relaciona los textos e imágenes proporcionados para explicar las formas de resistencia examinadas, distinguiendo información histórica y recursos de representación sin recrear violencia.','Los recursos conservan el tema, pero una conexión visual no expresa la relación histórica solicitada.','La organización altera los hechos o atribuye a una imagen información incompatible con las referencias.',3);return true
 }
 if(is('regime-duration')&&/factores/.test(text)){
  add('regime-duration-factors','Factores de duración del régimen','Selecciona los factores de duración del régimen respaldados por las fuentes y explica sus relaciones con las condiciones del caso, distinguiendo explicación histórica y aprobación moral.','Selecciona factores pertinentes, pero una relación con las condiciones queda sin respaldo.','Confunde duración y legitimidad o presenta como factor una afirmación incompatible con las fuentes.',4);return true
 }
 if(is('dictatorship-end')&&/factores/.test(text)){
  add('regime-end-factors','Factores de crisis y final del régimen','Distingue y relaciona los factores de crisis y del final del régimen en 1961 expresamente examinados, conservando actores, condiciones y evidencias sin confundirlos con efectos posteriores.','Reconoce factores pertinentes, pero una relación o ubicación temporal queda sin explicar.','Presenta un efecto posterior como factor previo o atribuye relaciones incompatibles con las fuentes.',4);return true
 }
 if(is('trujillo-interim-governments')){
  add('interim-government-relations','Características y atribuciones de los gobiernos interinos','Relaciona las características económicas, políticas y sociales de los gobiernos interinos trujillistas expresamente indicados con sus actores, fechas y evidencias, sin atribuir todas las decisiones al mismo gobernante.','Reconoce características pertinentes, pero una atribución o referencia temporal queda incompleta.','Confunde gobiernos o atribuye a un actor decisiones incompatibles con los documentos.',4);return true
 }
 if(is('democratic-struggles')&&/movimientos sociales/.test(text)){
  add('social-movement-relations','Aportes y condiciones de los movimientos sociales','Explica los aportes de los movimientos sociales dados antes y después del final de la dictadura relacionando actores, condiciones y evidencias, sin presuponer unanimidad ni adhesión personal.','Reconoce aportes pertinentes, pero una relación con el actor o condición del caso queda sin respaldo.','Confunde posiciones o atribuye unanimidad y aportes ausentes a los movimientos.',4);return true
 }
 if(is('political-parties')&&/cuadro/.test(text)){
  add('party-table','Organización histórica del cuadro de partidos','Organiza los partidos desde 1960 expresamente incluidos en los registros mediante nombres, períodos y relaciones solicitadas, manteniendo atribuciones y fecha del material sin valorar preferencias personales.','El cuadro conserva información pertinente, pero un período o relación queda incompleto.','Confunde partidos y períodos o inventa organizaciones ajenas al material.',4);return true
 }
 if(is('april-revolution-1965')&&/dramatiz/.test(text)){
  add('historical-role','Decisiones y sectores de la representación de Abril','Representa las decisiones y posiciones de los sectores del caso de Abril y la intervención de 1965 conforme a sus actores y condiciones históricas, sin recrear violencia ni inventar testimonios auténticos.','La representación conserva el rol, pero una decisión no corresponde al sector o condición del caso.','Atribuye al rol decisiones o posiciones incompatibles con las evidencias históricas.',4)
  add('historical-context','Fundamento histórico de la escenificación','Relaciona las causas e impactos expresamente examinados con las evidencias históricas dadas y distingue los hechos estudiados de los recursos ficticios de la escenificación.','Conserva el contexto, pero una causa o impacto representado carece de respaldo reconocible.','Presenta una invención escénica como documento auténtico o altera las relaciones históricas del caso.',4);return true
 }
 if(is('april-revolution-1965')&&/investig/.test(text)&&/informe/.test(text)){
  add('report-content','Contenido del informe sobre los sectores de Abril','Organiza los hallazgos solicitados sobre sectores vulnerables, golpistas y constitucionalistas de Abril relacionando actores, condiciones y evidencias, conservando diferencias de posición sin atribuir a todos la misma respuesta.','El informe conserva información pertinente, pero una posición o relación no tiene respaldo reconocible.','Atribuye unanimidad o posiciones incompatibles a los sectores o inventa vivencias privadas.',4);return true
 }
 if(is('governments-since-1978')&&/compar/.test(text)){
  add('government-comparison','Comparación de los gobiernos solicitados','Compara los gobiernos del intervalo expresamente solicitado mediante dimensiones comunes y evidencias de estilo político, medidas, política internacional, logros o errores cuando corresponden, conservando cada período y actor.','Describe gobiernos pertinentes, pero una comparación usa dimensiones diferentes o queda sin respaldo.','Mezcla decisiones y períodos o sustituye la comparación por preferencias partidarias.',4);return true
 }
 if(is('governments-since-1978')&&/evalu/.test(text)){
  add('government-evaluation','Valoración crítica de los gobiernos del material','Evalúa los gobiernos surgidos desde 1978 expresamente incluidos en el material mediante sus criterios políticos, sociales o económicos y evidencias, conservando su fecha y alcance sin inventar una actualización.','Aplica criterios pertinentes, pero un juicio no se relaciona con la evidencia o período del caso.','Valora por preferencia partidaria o atribuye hechos actuales ausentes al material.',4);return true
 }
 if(is('society-twenty-first-century')){
  add('society-relations','Dimensiones de la sociedad del siglo XXI examinada','Relaciona las características económicas, gubernamentales, sociales, culturales, avances heredados y temas pendientes expresamente examinados con los datos y fecha de los materiales, distinguiendo dimensiones y límites de sus inferencias.','Reconoce características pertinentes, pero una dimensión no se relaciona con su dato o fecha.','Confunde dimensiones o presenta como actualidad comprobada información ajena a los materiales.',4);return true
 }
 if(is('constitutional-changes-1963-2010')&&/compar/.test(text)){
  add('constitutional-comparison','Comparación de cambios constitucionales','Compara los cambios de las constituciones dominicanas históricas expresamente proporcionadas mediante dimensiones comunes y disposiciones localizables, conservando sus fechas sin atribuir vigencia actual.','Reconoce cambios pertinentes, pero una dimensión o disposición no permite fundamentar la comparación.','Atribuye a un texto disposiciones ausentes o compara normas de períodos incompatibles como equivalentes.',4);return true
 }
 if(is('sovereignty-identity-creation')&&/crea|elabor|redact/.test(text)){
  add('cultural-alternative','Sentido de la creación literaria elegida','Desarrolla en el poema, canción o composición literaria elegida el significado de soberanía e identidad nacional trabajado, relacionando decisiones expresivas y contenido del caso sin exigir las tres formas ni valorar sentimientos patrióticos o talento avanzado.','La creación conserva el tema, pero una decisión expresiva no permite reconocer el sentido trabajado.','La creación altera el sentido del contenido del caso o sustituye su desarrollo por una declaración de adhesión obligatoria.',4);return true
 }
 if(is('national-symbols')&&/plan/.test(text)&&/feria|exposicion/.test(text)){
  add('cultural-fair-plan','Plan de la exposición o feria cultural elegida','Organiza el plan de la exposición o feria elegida relacionando contenidos, estaciones y recursos dados con la historia y significado de los emblemas expresamente indicados, distinguiendo previsión y ejecución sin exigir ambos eventos.','El plan conserva contenidos pertinentes, pero una estación o recurso no explica su relación con el significado histórico.','El plan altera el significado de los emblemas o presenta como realizada una actividad solo prevista.',4);return true
 }
 if(is('duarte-constitutional-project')&&!/compar/.test(text)){
  add('duarte-project-relations','Proyecto de Duarte y Constitución','Explica las relaciones entre las propuestas del proyecto de nación de Duarte y la Constitución expresamente examinadas, localizando su respaldo en los documentos y conservando condiciones y alcance históricos sin atribuir vigencia actual.','Reconoce propuestas pertinentes, pero una relación constitucional no se vincula con el documento o contexto.','Atribuye al proyecto disposiciones ausentes o confunde propuesta histórica y norma vigente.',4);return true
 }
 if(is('bosch-democratic-project')){
  add('political-project-relations','Propuestas del proyecto liberal democrático','Explica los planteamientos del proyecto liberal democrático de Bosch expresamente indicados relacionándolos con el texto, condiciones y caso dado, sin convertir el proyecto en una evaluación de todos sus gobiernos.','Reconoce planteamientos pertinentes, pero una relación con el caso o texto queda sin explicar.','Atribuye al proyecto decisiones ajenas o sustituye la explicación por preferencia partidaria.',4);return true
 }
 if(is('democracy-national-project')){
  add('democratic-project-relations','Proyecto nacional y vida democrática','Relaciona las prácticas y propuestas del proyecto nacional y Estado democrático examinados con la democracia como forma de vida social, fundamentando sus conexiones en los hechos del caso sin valorar preferencias privadas.','Reconoce prácticas pertinentes, pero una conexión con el proyecto o criterio democrático queda sin explicar.','Confunde aspiraciones y hechos o sustituye el análisis por una evaluación de la moralidad personal.',4);return true
 }
 if(is('democratic-government-simulation')&&/simul/.test(text)){
  add('government-role','Acciones y límites del rol democrático','Realiza las acciones del rol de gobierno nacional o local elegido conforme a las funciones, competencias y reglas expresamente dadas en el caso ficticio, manteniendo sus límites sin exigir ambos niveles.','Realiza acciones pertinentes, pero una decisión no conserva la competencia o regla indicada.','Atribuye al rol facultades ausentes o realiza acciones incompatibles con los límites del caso.',4);return true
 }
 if(is('equality-diversity-inclusion')){
  add('equality-evidence','Condiciones de igualdad, diversidad e inclusión','Identifica y explica las situaciones de igualdad, diversidad, inclusión o exclusión expresamente examinadas mediante hechos y condiciones de los casos ficticios, distinguiendo evidencias y generalizaciones sobre grupos.','Reconoce situaciones pertinentes, pero una clasificación no se vincula con los hechos del caso.','Confunde inclusión y exclusión o atribuye a grupos enteros características no respaldadas.',4);return true
 }
 if(is('democratic-practices')){
  add('democratic-practice-relations','Caracterización de prácticas democráticas','Caracteriza las prácticas democráticas y no democráticas de los casos nacionales o municipales dados mediante relaciones entre criterios y hechos verificables, distinguiendo análisis y preferencia partidaria.','Reconoce prácticas pertinentes, pero un criterio no se relaciona con el hecho que lo respalda.','Clasifica por preferencia personal o atribuye prácticas ausentes a los casos.',4);return true
 }
 if(is('legal-social-projects')){
  add('norm-project-distinction','Distinción entre norma y proyecto social','Distingue las disposiciones del ordenamiento jurídico y los propósitos de los proyectos sociales de los documentos proporcionados, explicando sus relaciones y contextos sin confundir norma, aspiración y ejecución.','Distingue normas y propósitos pertinentes, pero una relación no conserva el texto o contexto.','Presenta una aspiración como obligación vigente o atribuye al documento disposiciones ausentes.',4);return true
 }
 if(is('road-safety')&&/simula/.test(text)&&/campana/.test(text)){
  add('campaign-communication','Comunicación y respuestas de la campaña vial','Comunica las orientaciones viales dadas de manera comprensible para los destinatarios ficticios y responde sus preguntas con razones pertinentes a las reglas del caso, reconociendo los límites de la información sin salir al tránsito real.','Comunica orientaciones pertinentes, pero una explicación o respuesta no resuelve la condición planteada.','Transmite orientaciones incompatibles con las reglas o responde mediante afirmaciones ajenas al caso.',4);return true
 }
 if(is('universal-values')){
  add('convivence-relations','Valores, decisiones y convivencia del caso','Explica cómo los valores universales expresamente indicados se relacionan con decisiones, condiciones y derechos en la convivencia del caso ficticio, utilizando sus evidencias sin valorar fe, sentimientos o moralidad privada.','Reconoce valores pertinentes, pero una conexión con la decisión o derecho queda sin explicar.','Sustituye el análisis por un juicio sobre sentimientos privados o atribuye efectos ajenos al caso.',4);return true
 }
 if(is('historian-comparison')){
  add('historian-comparison','Contraste crítico de textos de historiadores','Compara las interpretaciones de los historiadores proporcionados mediante dimensiones sociales, políticas o económicas comunes, conservando autores, contextos y evidencias y distinguiendo acuerdos y discrepancias respaldados.','Reconoce diferencias pertinentes, pero una interpretación o evidencia no conserva autor y contexto.','Atribuye a un autor afirmaciones ausentes o impone una interpretación sin contrastar los textos.',4);return true
 }
 if(is('national-accounts-comparison')){
  add('national-account-comparison','Comparación de magnitudes de los estudios dados','Compara los estudios de Producto Nacional Bruto y Producto Interior Neto proporcionados conservando sus definiciones, unidades, períodos y magnitudes al valorar su relación con el equilibrio monetario del caso, sin sustituir Interior por Nacional ni tratarlos como equivalentes.','Conserva magnitudes pertinentes, pero una comparación no explica la diferencia de definición, unidad o período.','Sustituye la magnitud estudiada o compara valores de alcances incompatibles como equivalentes.',4);return true
 }
 if(is('growth-development-analysis')&&/redact|elabor/.test(text)){
  add('growth-development-text','Relaciones y argumento del texto elegido','Desarrolla en el ensayo o monografía elegida las implicaciones del crecimiento poblacional y económico y variantes de desarrollo desde 1950 expresamente examinadas, relacionando hechos, argumentos y alcance de los datos sin exigir ambos textos o una teoría obligatoria.','El texto conserva datos pertinentes, pero un argumento no se relaciona con el período o evidencia del caso.','Confunde crecimiento y desarrollo o generaliza conclusiones incompatibles con los datos proporcionados.',4);return true
 }
 if(is('migration-solutions')){
  add('migration-data-synthesis','Síntesis de estudios migratorios proporcionados','Sintetiza los datos ficticios y anónimos de encuestas y estudios migratorios dados conservando procedencia, fecha, población y límites de sus inferencias, distinguiendo datos disponibles y recolección no realizada.','La síntesis conserva datos pertinentes, pero una conclusión no considera su fecha, alcance o procedencia.','Generaliza conductas a nacionalidades o presenta datos propios no recogidos como resultados del estudio.',4)
  if(/propon/.test(text))add('proposal','Soluciones para las condiciones migratorias del caso','Propone soluciones viables vinculadas a las condiciones, derechos y evidencias del caso migratorio, explicando cómo responden a sus necesidades sin discriminar nacionalidades.','Las soluciones atienden parte del caso, pero una acción no se relaciona con sus condiciones.','La propuesta no responde a los datos del caso o desconoce los derechos de las personas.',4);return true
 }
 if(is('nation-projects-comparison')){
  add('constitutional-project-comparison','Proyectos constitucionales y condiciones históricas','Compara el proyecto constitucional de Duarte y los proyectos liberales y conservadores del siglo XIX expresamente proporcionados mediante dimensiones comunes, relacionando propuestas, condiciones e impactos sociales y económicos con respaldo documental sin atribuir vigencia actual.','Reconoce propuestas pertinentes, pero una dimensión o relación de impacto no tiene respaldo reconocible.','Atribuye disposiciones ausentes a un proyecto o compara contextos incompatibles como equivalentes.',4);return true
 }
 if(is('national-identity')&&/resumen/.test(text)){
  add('identity-summary','Síntesis histórica de identidad y proyectos de nación','Sintetiza las ideas principales y relaciones entre identidad dominicana y proyectos de nación de las fuentes dadas desde el siglo XIX hasta la fecha del material, conservando procedencia y alcance sin exigir identidad privada o adhesión.','El resumen conserva ideas pertinentes, pero una relación o referencia temporal queda sin respaldo.','El resumen altera las ideas o presenta sentimientos personales como evidencia histórica.',4);return true
 }
 if(is('civic-campaign')&&/disen|plan|elabor/.test(text)){
  add('campaign-message','Mensaje de la campaña escolar','Diseña un mensaje comprensible para el destinatario ficticio sobre los derechos, normas o símbolos expresamente indicados, relacionándolo con el contenido y propósito del caso sin exigir todos los temas.','El mensaje conserva contenido pertinente, pero una orientación no responde al propósito o destinatario.','El mensaje altera el contenido dado o exige adhesión personal como resultado de la campaña.',4)
  add('campaign-actions','Acciones y recursos previstos de la campaña','Relaciona las acciones y recursos dados con el mensaje y destinatario de la campaña escolar simulada, distinguiendo planificación y ejecución sin exigir contactos externos.','Las acciones son pertinentes, pero una no se relaciona con el mensaje o recurso disponible.','Las acciones son ajenas al propósito o dependen de recursos y contactos no proporcionados.',3);return true
 }
 if(is('dialogue-negotiation')){
  add('dialogue-contributions','Razones y escucha del diálogo','Expresa razones vinculadas al conflicto académico ficticio y reformula las necesidades de las otras partes conservando su sentido, respondiendo a sus planteamientos sin exigir experiencias privadas o consenso.','Expresa razones pertinentes, pero una reformulación o respuesta no conserva la necesidad planteada.','Elude las razones de las partes o atribuye necesidades incompatibles con el caso.',4)
  add('negotiation-alternatives','Acuerdos y desacuerdos justificados','Relaciona las alternativas de negociación con las necesidades y criterios dados y registra acuerdos o desacuerdos justificados, distinguiendo propuestas y compromisos sin presentar consenso forzado.','Registra resultados pertinentes, pero una alternativa o desacuerdo no se vincula con sus razones.','Impone un acuerdo ajeno al caso o presenta como consenso una diferencia no resuelta.',4);return true
 }
 // Historical reading distinguishes relationships, map evidence and causality, never a required political stance.
 if(is('occupation-1916-1924','vasquez-government','economic-crisis-1929','trujillo-dictatorship','dictatorship-end','coup-1963','triumvirate','april-revolution-1965','balaguer-twelve-years')){
  if(/mapas/.test(text)&&/analiz/.test(text)){
   add('historical-map-evidence','Información espacial y temporal de los mapas históricos','Relaciona los espacios y cambios históricos expresamente indicados en mapas e informaciones proporcionados, conservando leyendas, períodos y límites de sus evidencias sin exigir dibujar otro mapa.','Reconoce información pertinente, pero una relación espacial o temporal no conserva las referencias.','Atribuye al mapa hechos ausentes o mezcla períodos incompatibles con sus referencias.',4);return true
  }
  if(/golpe/.test(text)&&/abril/.test(text)&&/analiz/.test(text)){
   const transition=/triunvirato|doce anos/.test(text)
   add(transition?'transition-relations':'historical-causality',transition?'Relaciones de los procesos de transición':'Causas y decisiones de los acontecimientos dados',`Relaciona los acontecimientos históricos expresamente solicitados con sus actores, condiciones y evidencias, distinguiendo sucesión, causas y consecuencias sin tratarlos como simultáneos ni imponer una cadena causal única.`,`Reconoce acontecimientos pertinentes, pero una conexión causal o temporal queda sin respaldo.`,`Invierte la secuencia o presenta como causa única una relación incompatible con las fuentes.`,4);return true
  }
  if(/analiz/.test(text)&&/informaciones/.test(text)){
   add('historical-relations',`Relaciones históricas de ${label}`,`Relaciona los hechos, actores y condiciones expresamente solicitados de ${label} con las evidencias proporcionadas, diferenciando períodos y procesos sin imponer toda la historia dominicana.`,`Reconoce hechos pertinentes, pero una relación no conserva el período o evidencia del caso.`,`Confunde procesos o atribuye a un período hechos incompatibles con las fuentes.`,4);return true
  }
 }
 return false
}
