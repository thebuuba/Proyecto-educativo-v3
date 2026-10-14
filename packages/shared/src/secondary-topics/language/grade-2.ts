import { dimension, type SecondaryLanguageTopic } from '../../secondary-topic-types'

/** Aula Base adaptations. Source references describe the curriculum, not official assessment descriptors. */
export const secondaryLanguageGradeTwoTopics: SecondaryLanguageTopic[] = [
  {
    id: 'guia-turistica', grade: 2, subjectCode: 'LEN', aliases: ['guía turística', 'guías turísticas'],
    source: { topicElementId: 'a5536c76-af76-53df-aa37-181e67ef25a0', pdfPages: [77], printedPages: [76] },
    dimensions: [
      dimension('purpose', 'Propósito y destinatario de la guía turística', 'Adapta la información de la guía turística a la orientación del visitante.', 'Identifica a quién se dirige la guía turística y cómo orienta al visitante.', 'Contrasta a quién se dirigen las guías y la orientación que ofrecen al visitante.',
        ['La orientación al visitante se relaciona con información pertinente de los lugares.', 'Se reconoce al visitante destinatario, pero no se relaciona con la información seleccionada.', 'Se confunde la orientación turística con una narración de experiencias sin propósito informativo.', 'No hay evidencia del propósito ni del visitante destinatario.']),
      dimension('places', 'Descripción y clasificación de lugares', 'Describe y clasifica los lugares de la guía mediante características e información comprobable.', 'Reconoce los lugares descritos, su clasificación y las características que los distinguen.', 'Compara las características y la clasificación de los lugares descritos en las guías.',
        ['Los lugares se distinguen por características pertinentes; queda una clasificación sin justificar.', 'Se enumeran lugares, pero no se distinguen por características o categorías.', 'La descripción atribuye características que no corresponden a los lugares señalados.', 'No se aportan características reconocibles de los lugares.'], 5),
      dimension('organization', 'Organización de la guía turística', 'Organiza la guía turística con portada, información y cierre que facilite localizar los lugares.', 'Identifica la organización de portada, información y cierre y su utilidad para consultar la guía.', 'Contrasta la organización de las guías y explica cuál facilita localizar la información turística.',
        ['Se relacionan las partes principales con la consulta de información, aunque el cierre necesita precisión.', 'Se reconocen partes aisladas sin relacionarlas con la consulta de la guía.', 'Se confunden portada, desarrollo informativo y cierre.', 'No se evidencia una organización reconocible de la guía.']),
      dimension('spatial', 'Orientación espacial y vocabulario', 'Usa descripciones y relaciones espaciales claras para situar los lugares de la guía turística.', 'Explica cómo las descripciones y los conectores espaciales sitúan los lugares de la guía.', 'Contrasta la claridad de las descripciones y relaciones espaciales de las guías.',
        ['Las relaciones entre los lugares son comprensibles, aunque una referencia espacial resulta imprecisa.', 'Se mencionan lugares sin establecer relaciones espaciales entre ellos.', 'Las referencias espaciales sitúan los lugares de forma contradictoria.', 'No hay referencias que permitan situar los lugares.']),
      dimension('graphics', 'Información gráfica de la guía', 'Relaciona la información gráfica solicitada con los lugares descritos en la guía.', 'Interpreta la información gráfica solicitada y la relaciona con los lugares de la guía.', 'Compara cómo la información gráfica de las guías facilita comprender los lugares.',
        ['La información gráfica se relaciona con los lugares, aunque una referencia no se explica.', 'La información gráfica aparece sin relación clara con los lugares.', 'La información gráfica contradice los lugares descritos.', 'No se evidencia la información gráfica solicitada.'], 3, '(?:inclu|incorpora|interpreta|analiza|compara|usa|utiliza)\\w*[^.;]{0,70}(?:mapas?|imagenes?|fotografias?|graficos?)'),
    ],
  },
  {
    id: 'articulo-expositivo', grade: 2, subjectCode: 'LEN', aliases: ['artículo expositivo', 'artículos expositivos'],
    source: { topicElementId: '08b968f6-dc72-5d0d-b668-d83c8d84627e', pdfPages: [77, 78], printedPages: [76, 77] },
    dimensions: [
      dimension('problem-solution', 'Organización problema-solución del artículo', 'Explica el problema del artículo expositivo y relaciona con él las soluciones propuestas.', 'Identifica el problema y explica cómo se relacionan con él las soluciones del artículo expositivo.', 'Contrasta los problemas y las soluciones de los artículos expositivos.',
        ['El problema y las soluciones guardan relación, aunque una relación causal necesita precisión.', 'Se mencionan el problema y una solución sin explicar su relación.', 'La solución corresponde a otro problema o se confunde con una causa.', 'No se identifica un problema ni una solución reconocible.'], 5),
      dimension('ideas', 'Idea principal y párrafos de apoyo', 'Desarrolla la idea principal del artículo expositivo mediante párrafos con ideas secundarias pertinentes.', 'Distingue la idea principal del artículo de las ideas secundarias que la desarrollan.', 'Compara las ideas principales y los apoyos que ofrecen los párrafos de los artículos.',
        ['La idea principal se relaciona con apoyos pertinentes, aunque un párrafo pierde el hilo.', 'Se identifican ideas aisladas sin distinguir la principal de sus apoyos.', 'Se presenta un detalle secundario como idea principal y se excluye el problema central.', 'No hay una idea principal reconocible ni apoyos pertinentes.']),
      dimension('explanation', 'Explicación y relaciones causales', 'Explica las relaciones de causa, efecto y finalidad que sustentan el artículo expositivo.', 'Interpreta las relaciones de causa, efecto y finalidad presentes en el artículo.', 'Contrasta las relaciones causales y las explicaciones ofrecidas por los artículos.',
        ['Las relaciones principales son correctas, aunque una transición entre causa y efecto es imprecisa.', 'Se enumeran hechos sin explicar causas, efectos o finalidades.', 'Se invierte una relación causal o se presentan afirmaciones incompatibles.', 'No se aporta una explicación de las relaciones del problema.']),
      dimension('evidence', 'Información y evidencias del artículo', 'Apoya la explicación del artículo con información pertinente y distingue los datos de sus interpretaciones.', 'Relaciona la explicación del artículo con sus datos y distingue evidencias de interpretaciones.', 'Compara las evidencias de los artículos y su relación con las explicaciones propuestas.',
        ['La explicación tiene apoyos pertinentes, aunque una afirmación queda sin sustento.', 'Se aporta un dato sin explicar qué afirmación sustenta.', 'Se atribuye al texto un dato ausente o se presenta una opinión como evidencia.', 'No se aportan datos o referencias para sustentar la explicación.']),
    ],
  },
  {
    id: 'informe-de-lectura', grade: 2, subjectCode: 'LEN', aliases: ['informe de lectura', 'informes de lectura'],
    source: { topicElementId: 'd27d17ed-ccf8-5f69-b79c-1736652f6993', pdfPages: [78, 79], printedPages: [77, 78] },
    dimensions: [
      dimension('summary', 'Resumen del texto leído', 'Selecciona y resume las ideas principales del texto leído sin alterar su sentido.', 'Identifica qué ideas del texto recoge el resumen del informe y comprueba su fidelidad.', 'Compara los resúmenes de los informes y su fidelidad al texto leído.',
        ['Se conserva el sentido del texto, aunque un detalle secundario ocupa espacio innecesario.', 'Se recogen fragmentos aislados sin reconstruir el sentido global.', 'El resumen altera un hecho o una relación fundamental del texto.', 'No se presenta evidencia de las ideas del texto leído.'], 5),
      dimension('analysis', 'Análisis sustentado del texto', 'Explica los temas del texto leído y sustenta el análisis con ejemplos pertinentes.', 'Distingue el análisis del informe de su resumen y reconoce los ejemplos que lo sustentan.', 'Contrasta las interpretaciones de los informes con los ejemplos del texto leído.',
        ['Se explica un tema con ejemplos pertinentes, aunque una interpretación necesita apoyo.', 'Se repite el argumento del texto sin desarrollar una interpretación.', 'La interpretación contradice el texto o utiliza ejemplos ajenos.', 'No se evidencia un análisis del texto leído.'], 5),
      dimension('structure', 'Estructura del informe de lectura', 'Organiza introducción, desarrollo y conclusión del informe en torno al texto leído.', 'Reconoce la introducción, el desarrollo y la conclusión del informe y su función.', 'Compara cómo los informes organizan introducción, desarrollo y conclusión.',
        ['Las partes son reconocibles, aunque la conclusión no retoma una idea del desarrollo.', 'Se reconocen partes aisladas sin una secuencia completa del informe.', 'Se confunden resumen, análisis y conclusión o se mezclan sus funciones.', 'No se evidencia una estructura reconocible del informe.']),
      dimension('paragraphs', 'Oración temática y cohesión del informe', 'Desarrolla cada párrafo del informe a partir de una oración temática y apoyos relacionados.', 'Explica la relación entre la oración temática y los apoyos de los párrafos del informe.', 'Contrasta la cohesión y el desarrollo de los párrafos de los informes.',
        ['Los párrafos mantienen una idea central, aunque un apoyo no se conecta claramente.', 'Se agrupan ideas sin una oración temática o sin apoyos relacionados.', 'Los apoyos contradicen la idea central del párrafo.', 'No hay evidencia de relación entre idea central y desarrollo del párrafo.']),
    ],
  },
  {
    id: 'cuento-amor-amistad', grade: 2, subjectCode: 'LEN', aliases: ['cuento de amor y amistad', 'cuentos de amor y amistad', 'cuento de amor', 'cuento de amistad', 'cuento amoroso', 'cuento sentimental'],
    source: { topicElementId: 'e3f89621-f01a-5ecb-a995-ae3cd6f9c09b', pdfPages: [79, 80], printedPages: [78, 79] },
    dimensions: [
      dimension('conflict', 'Conflicto del cuento de amor y amistad', 'Desarrolla un conflicto de amor o amistad y relaciona su complicación con la resolución del cuento.', 'Explica el conflicto de amor o amistad y relaciona la complicación con la resolución del cuento.', 'Compara los conflictos y las resoluciones de los cuentos de amor y amistad.',
        ['Conflicto y resolución se relacionan, aunque una acción intermedia necesita explicación.', 'Se identifica el conflicto o la resolución sin relacionarlos.', 'La resolución contradice el conflicto o se atribuye al cuento una acción ausente.', 'No se evidencia un conflicto reconocible del cuento.'], 5),
      dimension('characters', 'Personajes y motivaciones', 'Relaciona las motivaciones y las acciones de los personajes con el conflicto del cuento.', 'Sustenta las motivaciones de los personajes con sus acciones y su relación con el conflicto.', 'Contrasta cómo las motivaciones y acciones de los personajes afectan los conflictos de los cuentos.',
        ['Las acciones apoyan las motivaciones de los personajes, aunque una relación queda imprecisa.', 'Se describen personajes sin explicar por qué actúan.', 'Se atribuyen motivaciones incompatibles con las acciones del cuento.', 'No se aporta evidencia de personajes y motivaciones.']),
      dimension('setting', 'Ambiente y secuencia narrativa', 'Sitúa las acciones en un ambiente y una secuencia temporal coherentes con el conflicto del cuento.', 'Explica cómo el ambiente y la secuencia de acciones influyen en el conflicto del cuento.', 'Compara la influencia del ambiente y la secuencia temporal en los cuentos.',
        ['Ambiente y secuencia son comprensibles, aunque una transición temporal no se precisa.', 'Se menciona el ambiente o se enumeran acciones sin relacionarlos con el conflicto.', 'Se confunden tiempos o espacios que modifican el sentido de las acciones.', 'No se evidencia un ambiente o una secuencia narrativa reconocible.']),
      dimension('language', 'Diálogo y recursos expresivos', 'Usa el diálogo y los recursos expresivos pertinentes para caracterizar personajes y acciones del cuento.', 'Interpreta el diálogo y los recursos expresivos del cuento mediante ejemplos del texto.', 'Compara cómo el diálogo y los recursos expresivos caracterizan a los personajes de los cuentos.',
        ['Los ejemplos muestran un efecto expresivo, aunque una interpretación necesita precisión.', 'Se menciona un recurso o diálogo sin relacionarlo con personajes o acciones.', 'Se confunde el sentido del diálogo o se atribuye al texto un recurso ausente.', 'No se aporta evidencia de recursos expresivos o diálogos del cuento.']),
    ],
  },
  {
    id: 'decima-espinela', grade: 2, subjectCode: 'LEN', aliases: ['décima espinela', 'décimas espinelas'],
    source: { topicElementId: 'c517b837-01e5-53db-83fe-d7f74d451ce9', pdfPages: [80, 81], printedPages: [79, 80] },
    dimensions: [
      dimension('theme', 'Tema y sentido de la décima', 'Desarrolla un tema coherente a través de los versos de la décima espinela.', 'Interpreta el tema de la décima espinela a partir de sus versos.', 'Contrasta los temas y sentidos expresados en las décimas espinelas.',
        ['Los versos sostienen un tema reconocible, aunque una imagen necesita explicación.', 'Se identifican ideas de versos aislados sin relacionarlas con el tema.', 'Se atribuye al poema un sentido incompatible con sus versos.', 'No se evidencia un tema reconocible en la décima.']),
      dimension('verse', 'Verso octosílabo de la décima espinela', 'Organiza la décima espinela en diez versos y revisa el cómputo octosilábico.', 'Reconoce los diez versos y explica el cómputo octosilábico de la décima espinela.', 'Compara el cómputo silábico y la organización de los versos de las décimas.',
        ['Se reconoce la organización de versos, aunque un cómputo silábico requiere corrección.', 'Se cuentan versos sin distinguir sílabas métricas de palabras.', 'Se confunde el cómputo octosilábico o se atribuye otra organización a la décima.', 'No se evidencia la organización ni el cómputo de los versos.'], 5),
      dimension('rhyme', 'Rima y ritmo de la décima', 'Relaciona las terminaciones de los versos y el ritmo de la décima con su sentido poético.', 'Identifica las relaciones de rima y ritmo de la décima y explica su efecto.', 'Contrasta la rima y el ritmo de las décimas y su relación con el sentido poético.',
        ['Se reconocen relaciones de rima y ritmo, aunque una relación queda imprecisa.', 'Se mencionan terminaciones semejantes sin relacionarlas con el ritmo.', 'Se confunde rima con repetición de palabras o se altera el sentido al explicar el ritmo.', 'No se aporta evidencia de rima o ritmo de la décima.']),
      dimension('expression', 'Figuras literarias de la décima', 'Usa recursos expresivos pertinentes al tema de la décima sin alterar su sentido.', 'Interpreta las figuras literarias presentes en la décima mediante versos que las ejemplifican.', 'Compara el efecto de los recursos expresivos presentes en las décimas.',
        ['Un verso sustenta la interpretación de un recurso, aunque su efecto necesita precisión.', 'Se nombra una figura sin un verso que permita comprobarla.', 'Se atribuye al poema una figura ausente o se interpreta literalmente su sentido figurado.', 'No se aporta evidencia de recursos expresivos de la décima.']),
    ],
  },
]
