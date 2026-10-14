import {evaluationCatalogV27} from './catalog-v27'
/** Frozen intermediate local release. */
export const evaluationCatalogV28={...evaluationCatalogV27,version:'evaluation-2026.28',contextualModules:[
  {
    "id": "guia-turistica",
    "grade": 2,
    "subjectCode": "LEN",
    "aliases": [
      "guía turística",
      "guías turísticas"
    ],
    "source": {
      "topicElementId": "a5536c76-af76-53df-aa37-181e67ef25a0",
      "pdfPages": [
        77
      ],
      "printedPages": [
        76
      ]
    },
    "dimensions": [
      {
        "id": "purpose",
        "title": "Propósito y destinatario de la guía turística",
        "production": "Adapta la información de la guía turística a la orientación del visitante.",
        "analysis": "Identifica a quién se dirige la guía turística y cómo orienta al visitante.",
        "comparison": "Contrasta a quién se dirigen las guías y la orientación que ofrecen al visitante.",
        "evidence": [
          "La orientación al visitante se relaciona con información pertinente de los lugares.",
          "Se reconoce al visitante destinatario, pero no se relaciona con la información seleccionada.",
          "Se confunde la orientación turística con una narración de experiencias sin propósito informativo.",
          "No hay evidencia del propósito ni del visitante destinatario."
        ],
        "weight": 4
      },
      {
        "id": "places",
        "title": "Descripción y clasificación de lugares",
        "production": "Describe y clasifica los lugares de la guía mediante características e información comprobable.",
        "analysis": "Reconoce los lugares descritos, su clasificación y las características que los distinguen.",
        "comparison": "Compara las características y la clasificación de los lugares descritos en las guías.",
        "evidence": [
          "Los lugares se distinguen por características pertinentes; queda una clasificación sin justificar.",
          "Se enumeran lugares, pero no se distinguen por características o categorías.",
          "La descripción atribuye características que no corresponden a los lugares señalados.",
          "No se aportan características reconocibles de los lugares."
        ],
        "weight": 5
      },
      {
        "id": "organization",
        "title": "Organización de la guía turística",
        "production": "Organiza la guía turística con portada, información y cierre que facilite localizar los lugares.",
        "analysis": "Identifica la organización de portada, información y cierre y su utilidad para consultar la guía.",
        "comparison": "Contrasta la organización de las guías y explica cuál facilita localizar la información turística.",
        "evidence": [
          "Se relacionan las partes principales con la consulta de información, aunque el cierre necesita precisión.",
          "Se reconocen partes aisladas sin relacionarlas con la consulta de la guía.",
          "Se confunden portada, desarrollo informativo y cierre.",
          "No se evidencia una organización reconocible de la guía."
        ],
        "weight": 4
      },
      {
        "id": "spatial",
        "title": "Orientación espacial y vocabulario",
        "production": "Usa descripciones y relaciones espaciales claras para situar los lugares de la guía turística.",
        "analysis": "Explica cómo las descripciones y los conectores espaciales sitúan los lugares de la guía.",
        "comparison": "Contrasta la claridad de las descripciones y relaciones espaciales de las guías.",
        "evidence": [
          "Las relaciones entre los lugares son comprensibles, aunque una referencia espacial resulta imprecisa.",
          "Se mencionan lugares sin establecer relaciones espaciales entre ellos.",
          "Las referencias espaciales sitúan los lugares de forma contradictoria.",
          "No hay referencias que permitan situar los lugares."
        ],
        "weight": 4
      },
      {
        "id": "graphics",
        "title": "Información gráfica de la guía",
        "production": "Relaciona la información gráfica solicitada con los lugares descritos en la guía.",
        "analysis": "Interpreta la información gráfica solicitada y la relaciona con los lugares de la guía.",
        "comparison": "Compara cómo la información gráfica de las guías facilita comprender los lugares.",
        "evidence": [
          "La información gráfica se relaciona con los lugares, aunque una referencia no se explica.",
          "La información gráfica aparece sin relación clara con los lugares.",
          "La información gráfica contradice los lugares descritos.",
          "No se evidencia la información gráfica solicitada."
        ],
        "weight": 3,
        "requestedOnly": "(?:inclu|incorpora|interpreta|analiza|compara|usa|utiliza)\\w*[^.;]{0,70}(?:mapas?|imagenes?|fotografias?|graficos?)"
      }
    ]
  },
  {
    "id": "articulo-expositivo",
    "grade": 2,
    "subjectCode": "LEN",
    "aliases": [
      "artículo expositivo",
      "artículos expositivos"
    ],
    "source": {
      "topicElementId": "08b968f6-dc72-5d0d-b668-d83c8d84627e",
      "pdfPages": [
        77,
        78
      ],
      "printedPages": [
        76,
        77
      ]
    },
    "dimensions": [
      {
        "id": "problem-solution",
        "title": "Organización problema-solución del artículo",
        "production": "Explica el problema del artículo expositivo y relaciona con él las soluciones propuestas.",
        "analysis": "Identifica el problema y explica cómo se relacionan con él las soluciones del artículo expositivo.",
        "comparison": "Contrasta los problemas y las soluciones de los artículos expositivos.",
        "evidence": [
          "El problema y las soluciones guardan relación, aunque una relación causal necesita precisión.",
          "Se mencionan el problema y una solución sin explicar su relación.",
          "La solución corresponde a otro problema o se confunde con una causa.",
          "No se identifica un problema ni una solución reconocible."
        ],
        "weight": 5
      },
      {
        "id": "ideas",
        "title": "Idea principal y párrafos de apoyo",
        "production": "Desarrolla la idea principal del artículo expositivo mediante párrafos con ideas secundarias pertinentes.",
        "analysis": "Distingue la idea principal del artículo de las ideas secundarias que la desarrollan.",
        "comparison": "Compara las ideas principales y los apoyos que ofrecen los párrafos de los artículos.",
        "evidence": [
          "La idea principal se relaciona con apoyos pertinentes, aunque un párrafo pierde el hilo.",
          "Se identifican ideas aisladas sin distinguir la principal de sus apoyos.",
          "Se presenta un detalle secundario como idea principal y se excluye el problema central.",
          "No hay una idea principal reconocible ni apoyos pertinentes."
        ],
        "weight": 4
      },
      {
        "id": "explanation",
        "title": "Explicación y relaciones causales",
        "production": "Explica las relaciones de causa, efecto y finalidad que sustentan el artículo expositivo.",
        "analysis": "Interpreta las relaciones de causa, efecto y finalidad presentes en el artículo.",
        "comparison": "Contrasta las relaciones causales y las explicaciones ofrecidas por los artículos.",
        "evidence": [
          "Las relaciones principales son correctas, aunque una transición entre causa y efecto es imprecisa.",
          "Se enumeran hechos sin explicar causas, efectos o finalidades.",
          "Se invierte una relación causal o se presentan afirmaciones incompatibles.",
          "No se aporta una explicación de las relaciones del problema."
        ],
        "weight": 4
      },
      {
        "id": "evidence",
        "title": "Información y evidencias del artículo",
        "production": "Apoya la explicación del artículo con información pertinente y distingue los datos de sus interpretaciones.",
        "analysis": "Relaciona la explicación del artículo con sus datos y distingue evidencias de interpretaciones.",
        "comparison": "Compara las evidencias de los artículos y su relación con las explicaciones propuestas.",
        "evidence": [
          "La explicación tiene apoyos pertinentes, aunque una afirmación queda sin sustento.",
          "Se aporta un dato sin explicar qué afirmación sustenta.",
          "Se atribuye al texto un dato ausente o se presenta una opinión como evidencia.",
          "No se aportan datos o referencias para sustentar la explicación."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "informe-de-lectura",
    "grade": 2,
    "subjectCode": "LEN",
    "aliases": [
      "informe de lectura",
      "informes de lectura"
    ],
    "source": {
      "topicElementId": "d27d17ed-ccf8-5f69-b79c-1736652f6993",
      "pdfPages": [
        78,
        79
      ],
      "printedPages": [
        77,
        78
      ]
    },
    "dimensions": [
      {
        "id": "summary",
        "title": "Resumen del texto leído",
        "production": "Selecciona y resume las ideas principales del texto leído sin alterar su sentido.",
        "analysis": "Identifica qué ideas del texto recoge el resumen del informe y comprueba su fidelidad.",
        "comparison": "Compara los resúmenes de los informes y su fidelidad al texto leído.",
        "evidence": [
          "Se conserva el sentido del texto, aunque un detalle secundario ocupa espacio innecesario.",
          "Se recogen fragmentos aislados sin reconstruir el sentido global.",
          "El resumen altera un hecho o una relación fundamental del texto.",
          "No se presenta evidencia de las ideas del texto leído."
        ],
        "weight": 5
      },
      {
        "id": "analysis",
        "title": "Análisis sustentado del texto",
        "production": "Explica los temas del texto leído y sustenta el análisis con ejemplos pertinentes.",
        "analysis": "Distingue el análisis del informe de su resumen y reconoce los ejemplos que lo sustentan.",
        "comparison": "Contrasta las interpretaciones de los informes con los ejemplos del texto leído.",
        "evidence": [
          "Se explica un tema con ejemplos pertinentes, aunque una interpretación necesita apoyo.",
          "Se repite el argumento del texto sin desarrollar una interpretación.",
          "La interpretación contradice el texto o utiliza ejemplos ajenos.",
          "No se evidencia un análisis del texto leído."
        ],
        "weight": 5
      },
      {
        "id": "structure",
        "title": "Estructura del informe de lectura",
        "production": "Organiza introducción, desarrollo y conclusión del informe en torno al texto leído.",
        "analysis": "Reconoce la introducción, el desarrollo y la conclusión del informe y su función.",
        "comparison": "Compara cómo los informes organizan introducción, desarrollo y conclusión.",
        "evidence": [
          "Las partes son reconocibles, aunque la conclusión no retoma una idea del desarrollo.",
          "Se reconocen partes aisladas sin una secuencia completa del informe.",
          "Se confunden resumen, análisis y conclusión o se mezclan sus funciones.",
          "No se evidencia una estructura reconocible del informe."
        ],
        "weight": 4
      },
      {
        "id": "paragraphs",
        "title": "Oración temática y cohesión del informe",
        "production": "Desarrolla cada párrafo del informe a partir de una oración temática y apoyos relacionados.",
        "analysis": "Explica la relación entre la oración temática y los apoyos de los párrafos del informe.",
        "comparison": "Contrasta la cohesión y el desarrollo de los párrafos de los informes.",
        "evidence": [
          "Los párrafos mantienen una idea central, aunque un apoyo no se conecta claramente.",
          "Se agrupan ideas sin una oración temática o sin apoyos relacionados.",
          "Los apoyos contradicen la idea central del párrafo.",
          "No hay evidencia de relación entre idea central y desarrollo del párrafo."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "cuento-amor-amistad",
    "grade": 2,
    "subjectCode": "LEN",
    "aliases": [
      "cuento de amor y amistad",
      "cuentos de amor y amistad",
      "cuento de amor",
      "cuento de amistad",
      "cuento amoroso",
      "cuento sentimental"
    ],
    "source": {
      "topicElementId": "e3f89621-f01a-5ecb-a995-ae3cd6f9c09b",
      "pdfPages": [
        79,
        80
      ],
      "printedPages": [
        78,
        79
      ]
    },
    "dimensions": [
      {
        "id": "conflict",
        "title": "Conflicto del cuento de amor y amistad",
        "production": "Desarrolla un conflicto de amor o amistad y relaciona su complicación con la resolución del cuento.",
        "analysis": "Explica el conflicto de amor o amistad y relaciona la complicación con la resolución del cuento.",
        "comparison": "Compara los conflictos y las resoluciones de los cuentos de amor y amistad.",
        "evidence": [
          "Conflicto y resolución se relacionan, aunque una acción intermedia necesita explicación.",
          "Se identifica el conflicto o la resolución sin relacionarlos.",
          "La resolución contradice el conflicto o se atribuye al cuento una acción ausente.",
          "No se evidencia un conflicto reconocible del cuento."
        ],
        "weight": 5
      },
      {
        "id": "characters",
        "title": "Personajes y motivaciones",
        "production": "Relaciona las motivaciones y las acciones de los personajes con el conflicto del cuento.",
        "analysis": "Sustenta las motivaciones de los personajes con sus acciones y su relación con el conflicto.",
        "comparison": "Contrasta cómo las motivaciones y acciones de los personajes afectan los conflictos de los cuentos.",
        "evidence": [
          "Las acciones apoyan las motivaciones de los personajes, aunque una relación queda imprecisa.",
          "Se describen personajes sin explicar por qué actúan.",
          "Se atribuyen motivaciones incompatibles con las acciones del cuento.",
          "No se aporta evidencia de personajes y motivaciones."
        ],
        "weight": 4
      },
      {
        "id": "setting",
        "title": "Ambiente y secuencia narrativa",
        "production": "Sitúa las acciones en un ambiente y una secuencia temporal coherentes con el conflicto del cuento.",
        "analysis": "Explica cómo el ambiente y la secuencia de acciones influyen en el conflicto del cuento.",
        "comparison": "Compara la influencia del ambiente y la secuencia temporal en los cuentos.",
        "evidence": [
          "Ambiente y secuencia son comprensibles, aunque una transición temporal no se precisa.",
          "Se menciona el ambiente o se enumeran acciones sin relacionarlos con el conflicto.",
          "Se confunden tiempos o espacios que modifican el sentido de las acciones.",
          "No se evidencia un ambiente o una secuencia narrativa reconocible."
        ],
        "weight": 4
      },
      {
        "id": "language",
        "title": "Diálogo y recursos expresivos",
        "production": "Usa el diálogo y los recursos expresivos pertinentes para caracterizar personajes y acciones del cuento.",
        "analysis": "Interpreta el diálogo y los recursos expresivos del cuento mediante ejemplos del texto.",
        "comparison": "Compara cómo el diálogo y los recursos expresivos caracterizan a los personajes de los cuentos.",
        "evidence": [
          "Los ejemplos muestran un efecto expresivo, aunque una interpretación necesita precisión.",
          "Se menciona un recurso o diálogo sin relacionarlo con personajes o acciones.",
          "Se confunde el sentido del diálogo o se atribuye al texto un recurso ausente.",
          "No se aporta evidencia de recursos expresivos o diálogos del cuento."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "decima-espinela",
    "grade": 2,
    "subjectCode": "LEN",
    "aliases": [
      "décima espinela",
      "décimas espinelas"
    ],
    "source": {
      "topicElementId": "c517b837-01e5-53db-83fe-d7f74d451ce9",
      "pdfPages": [
        80,
        81
      ],
      "printedPages": [
        79,
        80
      ]
    },
    "dimensions": [
      {
        "id": "theme",
        "title": "Tema y sentido de la décima",
        "production": "Desarrolla un tema coherente a través de los versos de la décima espinela.",
        "analysis": "Interpreta el tema de la décima espinela a partir de sus versos.",
        "comparison": "Contrasta los temas y sentidos expresados en las décimas espinelas.",
        "evidence": [
          "Los versos sostienen un tema reconocible, aunque una imagen necesita explicación.",
          "Se identifican ideas de versos aislados sin relacionarlas con el tema.",
          "Se atribuye al poema un sentido incompatible con sus versos.",
          "No se evidencia un tema reconocible en la décima."
        ],
        "weight": 4
      },
      {
        "id": "verse",
        "title": "Verso octosílabo de la décima espinela",
        "production": "Organiza la décima espinela en diez versos y revisa el cómputo octosilábico.",
        "analysis": "Reconoce los diez versos y explica el cómputo octosilábico de la décima espinela.",
        "comparison": "Compara el cómputo silábico y la organización de los versos de las décimas.",
        "evidence": [
          "Se reconoce la organización de versos, aunque un cómputo silábico requiere corrección.",
          "Se cuentan versos sin distinguir sílabas métricas de palabras.",
          "Se confunde el cómputo octosilábico o se atribuye otra organización a la décima.",
          "No se evidencia la organización ni el cómputo de los versos."
        ],
        "weight": 5
      },
      {
        "id": "rhyme",
        "title": "Rima y ritmo de la décima",
        "production": "Relaciona las terminaciones de los versos y el ritmo de la décima con su sentido poético.",
        "analysis": "Identifica las relaciones de rima y ritmo de la décima y explica su efecto.",
        "comparison": "Contrasta la rima y el ritmo de las décimas y su relación con el sentido poético.",
        "evidence": [
          "Se reconocen relaciones de rima y ritmo, aunque una relación queda imprecisa.",
          "Se mencionan terminaciones semejantes sin relacionarlas con el ritmo.",
          "Se confunde rima con repetición de palabras o se altera el sentido al explicar el ritmo.",
          "No se aporta evidencia de rima o ritmo de la décima."
        ],
        "weight": 4
      },
      {
        "id": "expression",
        "title": "Figuras literarias de la décima",
        "production": "Usa recursos expresivos pertinentes al tema de la décima sin alterar su sentido.",
        "analysis": "Interpreta las figuras literarias presentes en la décima mediante versos que las ejemplifican.",
        "comparison": "Compara el efecto de los recursos expresivos presentes en las décimas.",
        "evidence": [
          "Un verso sustenta la interpretación de un recurso, aunque su efecto necesita precisión.",
          "Se nombra una figura sin un verso que permita comprobarla.",
          "Se atribuye al poema una figura ausente o se interpreta literalmente su sentido figurado.",
          "No se aporta evidencia de recursos expresivos de la décima."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "entrevista",
    "grade": 3,
    "subjectCode": "LEN",
    "aliases": [
      "entrevista",
      "entrevistas"
    ],
    "source": {
      "topicElementId": "bfb77540-cff5-5bf8-8a5d-4b2e1efb329d",
      "pdfPages": [
        82,
        83
      ],
      "printedPages": [
        81,
        82
      ]
    },
    "dimensions": [
      {
        "id": "purpose",
        "title": "Propósito y alcance de la entrevista",
        "production": "Delimita el tema, el destinatario y el propósito que orienta la entrevista.",
        "analysis": "Relaciona el tema y el destinatario con el propósito de la entrevista.",
        "comparison": "Contrasta los propósitos, temas y destinatarios de las entrevistas.",
        "evidence": [
          "El tema responde al propósito; queda una pregunta cuya pertinencia necesita aclararse.",
          "Se nombra un tema sin explicar qué se busca conocer del entrevistado.",
          "Se atribuye a la entrevista un propósito incompatible con las preguntas.",
          "No hay evidencia del propósito ni del tema de la entrevista."
        ],
        "weight": 4
      },
      {
        "id": "questions",
        "title": "Preguntas y respuestas de la entrevista",
        "production": "Organiza preguntas pertinentes al entrevistado y al tema, con una secuencia que permite profundizar en sus respuestas.",
        "analysis": "Explica cómo las preguntas y respuestas desarrollan el tema y organizan la presentación, el cuerpo y el cierre de la entrevista.",
        "comparison": "Contrasta las preguntas y respuestas y su contribución al desarrollo de los temas de las entrevistas.",
        "evidence": [
          "Las preguntas y respuestas desarrollan el tema; una transición necesita enlazarse.",
          "Se enumeran preguntas o respuestas aisladas sin explicar su relación.",
          "Una pregunta se interpreta a partir de una respuesta ajena o contradictoria.",
          "No se relacionan preguntas y respuestas con el tema de la entrevista."
        ],
        "weight": 5
      },
      {
        "id": "roles",
        "title": "Roles de los participantes",
        "production": "Distingue las intervenciones del entrevistador y del entrevistado, respetando a quién pertenece cada pregunta o respuesta.",
        "analysis": "Identifica los roles del entrevistador y del entrevistado a partir de sus intervenciones.",
        "comparison": "Compara las intervenciones y los roles de los participantes en las entrevistas.",
        "evidence": [
          "Se distinguen los roles; una intervención necesita atribuirse con mayor claridad.",
          "Se nombran participantes sin relacionarlos con sus intervenciones.",
          "Se atribuye al entrevistador la respuesta del entrevistado o se intercambian sus roles.",
          "No se identifican los participantes a partir de sus intervenciones."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "cronica",
    "grade": 3,
    "subjectCode": "LEN",
    "aliases": [
      "crónica",
      "crónicas"
    ],
    "source": {
      "topicElementId": "9e516a4a-e640-5e3f-914f-1a626b6e8fb8",
      "pdfPages": [
        83
      ],
      "printedPages": [
        82
      ]
    },
    "dimensions": [
      {
        "id": "facts",
        "title": "Hechos documentados de la crónica",
        "production": "Relata hechos identificables de un acontecimiento, distinguiendo información documentada de valoraciones del cronista.",
        "analysis": "Reconoce los hechos del acontecimiento y distingue información documentada de valoraciones del cronista.",
        "comparison": "Contrasta los hechos y las valoraciones de las crónicas sobre el acontecimiento.",
        "evidence": [
          "Los hechos se distinguen de las valoraciones; una afirmación necesita precisar su sustento.",
          "Se mezclan datos y valoraciones sin señalar de qué tipo son.",
          "Se presenta una valoración como hecho comprobado o se atribuye un hecho inexistente al acontecimiento.",
          "No se identifican hechos reconocibles del acontecimiento."
        ],
        "weight": 5
      },
      {
        "id": "sequence",
        "title": "Secuencia narrativa de la crónica",
        "production": "Enlaza qué ocurrió, cómo, cuándo y quiénes participaron mediante una secuencia narrativa comprensible.",
        "analysis": "Explica la secuencia de la crónica relacionando qué ocurrió, cómo, cuándo y quiénes participaron.",
        "comparison": "Compara el orden de los hechos y las relaciones temporales de las crónicas.",
        "evidence": [
          "La secuencia permite seguir el acontecimiento; una transición temporal queda implícita.",
          "Se enumeran hechos sin establecer su orden o sus relaciones.",
          "El orden atribuido a los hechos cambia una causa o una consecuencia.",
          "No se presenta una secuencia reconocible de los hechos."
        ],
        "weight": 4
      },
      {
        "id": "perspective",
        "title": "Perspectiva del cronista y ambiente",
        "production": "Sitúa el acontecimiento y permite reconocer la perspectiva del cronista sin confundirla con los hechos relatados.",
        "analysis": "Explica cómo el ambiente y la perspectiva del cronista orientan el relato del acontecimiento.",
        "comparison": "Contrasta el ambiente y la perspectiva desde la que cada cronista relata los hechos.",
        "evidence": [
          "Se reconoce la perspectiva; una referencia al ambiente necesita vincularse con los hechos.",
          "Se menciona un ambiente o una valoración sin relacionarla con el relato.",
          "Se confunde la voz del cronista con la de un participante o se altera el ambiente de los hechos.",
          "No hay referencias que permitan situar el acontecimiento ni reconocer la perspectiva del relato."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "catalogo",
    "grade": 3,
    "subjectCode": "LEN",
    "aliases": [
      "catálogo",
      "catálogos"
    ],
    "source": {
      "topicElementId": "613b5847-3a67-5eb1-a91e-2a388725792c",
      "pdfPages": [
        84
      ],
      "printedPages": [
        83
      ]
    },
    "dimensions": [
      {
        "id": "organization",
        "title": "Organización y consulta del catálogo",
        "production": "Organiza las entradas del catálogo para localizar y consultar información de las especies según el propósito y destinatario.",
        "analysis": "Explica cómo la estructura del catálogo permite localizar y consultar información de las especies.",
        "comparison": "Contrasta la organización de los catálogos y cómo facilita consultar sus entradas.",
        "evidence": [
          "Se pueden consultar las entradas; una referencia de organización necesita aclararse.",
          "Se agrupa información sin mostrar cómo localizar la entrada correspondiente.",
          "La organización remite a una especie distinta de la consultada.",
          "No hay una organización que permita consultar las entradas del catálogo."
        ],
        "weight": 4
      },
      {
        "id": "entries",
        "title": "Información descriptiva de las especies",
        "production": "Describe las especies del catálogo mediante características que permiten reconocerlas y distinguirlas.",
        "analysis": "Identifica las especies y las características que permiten distinguirlas en las entradas del catálogo.",
        "comparison": "Compara las características de las especies y la información disponible en sus entradas.",
        "evidence": [
          "Las características distinguen las especies; una descripción necesita precisar a cuál corresponde.",
          "Se enumeran especies sin relacionarlas con rasgos que las distingan.",
          "Se atribuye a una especie una característica de otra.",
          "No se presenta información que permita reconocer las especies."
        ],
        "weight": 5
      }
    ]
  },
  {
    "id": "informe-experimento",
    "grade": 3,
    "subjectCode": "LEN",
    "aliases": [
      "informe de experimento",
      "informes de experimento",
      "informe del experimento",
      "informe experimental"
    ],
    "source": {
      "topicElementId": "236be722-0ef3-5211-9dd2-5af2c786fad6",
      "pdfPages": [
        85
      ],
      "printedPages": [
        84
      ]
    },
    "dimensions": [
      {
        "id": "procedure",
        "title": "Propósito y procedimiento comunicados",
        "production": "Organiza el informe de experimento relacionando su propósito con el procedimiento descrito y el orden de las acciones registradas.",
        "analysis": "Reconoce el propósito del informe y explica la relación y secuencia de las acciones descritas.",
        "comparison": "Contrasta los propósitos y procedimientos descritos en los informes de experimento.",
        "evidence": [
          "El procedimiento responde al propósito; una transición entre acciones necesita aclararse.",
          "Se enumeran acciones sin relacionarlas con el propósito o su secuencia.",
          "Se altera el orden de acciones y cambia el procedimiento comunicado.",
          "No hay evidencia del propósito ni del procedimiento descrito."
        ],
        "weight": 4
      },
      {
        "id": "results",
        "title": "Resultados e interpretación del informe",
        "production": "Comunica los resultados disponibles y relaciona su interpretación con los datos, sin inventar observaciones.",
        "analysis": "Distingue los resultados del informe de su interpretación y comprueba el apoyo de las afirmaciones en los datos.",
        "comparison": "Compara los resultados y las interpretaciones de los informes utilizando los datos disponibles.",
        "evidence": [
          "La interpretación se apoya en datos; una afirmación necesita precisar qué resultado la respalda.",
          "Se enumeran resultados sin explicar qué interpretación permiten.",
          "Se atribuye a los datos un resultado que no contienen o se presenta una inferencia como observación.",
          "No se relacionan resultados e interpretación con datos disponibles."
        ],
        "weight": 5
      }
    ]
  },
  {
    "id": "articulo-opinion",
    "grade": 3,
    "subjectCode": "LEN",
    "aliases": [
      "artículo de opinión",
      "artículos de opinión"
    ],
    "source": {
      "topicElementId": "f7019573-c2eb-5685-a2bf-a0ac16c1e300",
      "pdfPages": [
        85,
        86
      ],
      "printedPages": [
        84,
        85
      ]
    },
    "dimensions": [
      {
        "id": "thesis",
        "title": "Tesis y propósito argumentativo",
        "production": "Formula una tesis definida sobre el asunto del artículo de opinión y mantiene esa postura a lo largo del texto.",
        "analysis": "Identifica la tesis y explica la postura del autor frente al asunto del artículo de opinión.",
        "comparison": "Contrasta las tesis y las posturas de los autores sobre el asunto tratado.",
        "evidence": [
          "La postura es reconocible; una afirmación necesita aclarar su relación con ella.",
          "Se menciona el asunto sin distinguir la postura defendida.",
          "Se atribuye al autor una postura contraria a la que sostiene el artículo.",
          "No se identifica una tesis reconocible sobre el asunto."
        ],
        "weight": 5
      },
      {
        "id": "arguments",
        "title": "Argumentos que sostienen la tesis",
        "production": "Desarrolla argumentos relacionados con la tesis y muestra cómo las razones o evidencias la sostienen.",
        "analysis": "Explica cómo los argumentos apoyan la tesis y valora si las razones se relacionan con lo afirmado.",
        "comparison": "Contrasta los argumentos y su capacidad para sostener las tesis de los artículos.",
        "evidence": [
          "Las razones apoyan la tesis; una relación entre razón y afirmación queda implícita.",
          "Se enumeran opiniones o ejemplos sin explicar su apoyo a la tesis.",
          "Una razón contradice la tesis o se presenta una afirmación sin sustento como prueba.",
          "No se aportan argumentos vinculados con la tesis."
        ],
        "weight": 5
      },
      {
        "id": "organization",
        "title": "Secuencia argumentativa del artículo",
        "production": "Organiza el punto de partida y el desarrollo de la tesis y sus argumentos en una secuencia comprensible.",
        "analysis": "Explica cómo el punto de partida y el desarrollo organizan la tesis y sus argumentos.",
        "comparison": "Compara la organización de las tesis y los argumentos en los artículos.",
        "evidence": [
          "Se sigue el hilo argumentativo; una transición requiere aclaración.",
          "Se agrupan razones sin un orden que permita seguir la defensa de la tesis.",
          "El orden separa una razón de la afirmación que sostiene y cambia el sentido argumentativo.",
          "No se reconoce una secuencia argumentativa en el artículo."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "cuento-social",
    "grade": 3,
    "subjectCode": "LEN",
    "aliases": [
      "cuento social",
      "cuentos sociales",
      "cuento político",
      "cuentos políticos",
      "cuento cultural",
      "cuentos culturales",
      "cuento social, político, cultural"
    ],
    "source": {
      "topicElementId": "00f602dd-e9d8-50c5-b1d6-07b5e8d983b3",
      "pdfPages": [
        86,
        87
      ],
      "printedPages": [
        85,
        86
      ]
    },
    "dimensions": [
      {
        "id": "conflict",
        "title": "Conflicto y realidad representada",
        "production": "Desarrolla un conflicto que representa una situación social, política o cultural mediante acciones narrativas relacionadas.",
        "analysis": "Explica el conflicto y su relación con una situación social, política o cultural apoyándose en los hechos disponibles.",
        "comparison": "Contrasta los conflictos y las situaciones sociales, políticas o culturales representadas en los cuentos.",
        "evidence": [
          "El conflicto se relaciona con la situación representada; una acción necesita explicarse.",
          "Se mencionan hechos o problemas sin relacionarlos con el conflicto narrativo.",
          "Se atribuye al cuento un conflicto incompatible con los hechos disponibles.",
          "No se reconoce un conflicto sustentado en las acciones del relato."
        ],
        "weight": 5
      },
      {
        "id": "characters",
        "title": "Personajes, motivaciones y ambiente",
        "production": "Relaciona las motivaciones y acciones de los personajes con el ambiente físico y psicológico del cuento.",
        "analysis": "Sustenta las motivaciones y acciones de los personajes mediante su relación con el ambiente del cuento.",
        "comparison": "Compara la influencia del ambiente en las motivaciones y acciones de los personajes.",
        "evidence": [
          "Las acciones se relacionan con motivaciones y ambiente; una relación necesita explicarse.",
          "Se describen personajes o lugares sin explicar su influencia en las acciones.",
          "Se atribuyen motivaciones incompatibles con las acciones disponibles.",
          "No se relacionan personajes, acciones y ambiente."
        ],
        "weight": 4
      },
      {
        "id": "narrator",
        "title": "Voz y forma narrativa",
        "production": "Mantiene una voz narrativa reconocible y organiza las acciones de manera coherente con lo que conoce el narrador.",
        "analysis": "Identifica al narrador y explica qué permite conocer su voz sobre las acciones del cuento.",
        "comparison": "Contrasta las voces narrativas y la información que permiten conocer sobre los hechos.",
        "evidence": [
          "Se reconoce la voz narrativa; una referencia necesita atribuirse con claridad.",
          "Se menciona una voz sin explicar qué conoce sobre las acciones.",
          "Se confunde al narrador con el autor o se le atribuye información ajena al pasaje.",
          "No hay evidencia de reconocimiento de la voz narrativa."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "madrigal",
    "grade": 3,
    "subjectCode": "LEN",
    "aliases": [
      "madrigal",
      "madrigales"
    ],
    "source": {
      "topicElementId": "0f3b956f-31a9-565d-9db4-9f07efd83410",
      "pdfPages": [
        87
      ],
      "printedPages": [
        86
      ]
    },
    "dimensions": [
      {
        "id": "meaning",
        "title": "Sentimientos y sentido poético",
        "production": "Desarrolla sentimientos e imágenes relacionadas a través de los versos del madrigal.",
        "analysis": "Interpreta los sentimientos y el sentido poético del madrigal apoyándose en sus versos.",
        "comparison": "Contrasta los sentimientos y las imágenes expresadas en los madrigales.",
        "evidence": [
          "Los versos sostienen un sentido reconocible; una imagen necesita relacionarse con él.",
          "Se mencionan sentimientos o imágenes aisladas sin explicar su relación.",
          "Se atribuye al poema un sentimiento incompatible con sus versos.",
          "No se reconoce un sentido poético apoyado en los versos."
        ],
        "weight": 4
      },
      {
        "id": "verse",
        "title": "Versos y cómputo métrico",
        "production": "Combina versos heptasílabos y endecasílabos en el madrigal y revisa su cómputo métrico.",
        "analysis": "Distingue los versos heptasílabos y endecasílabos del madrigal mediante el cómputo métrico.",
        "comparison": "Compara la combinación de versos y el cómputo métrico de los madrigales.",
        "evidence": [
          "Se distinguen las medidas de los versos; un cómputo necesita corregirse.",
          "Se cuentan sílabas sin diferenciar la medida de los versos.",
          "Se confunden sílabas métricas con palabras o se asigna al verso una medida incompatible.",
          "No hay evidencia del cómputo ni de la combinación de versos."
        ],
        "weight": 4
      },
      {
        "id": "rhyme",
        "title": "Rima y ritmo del madrigal",
        "production": "Relaciona la rima y el ritmo de los versos con el sentido expresado por el madrigal.",
        "analysis": "Explica la rima y el ritmo del madrigal a partir de las terminaciones y las pausas de sus versos.",
        "comparison": "Contrasta la rima y el ritmo y su relación con el sentido de los madrigales.",
        "evidence": [
          "Las relaciones sonoras se reconocen; una terminación o pausa necesita precisarse.",
          "Se señalan sonidos semejantes sin explicar sus relaciones entre versos.",
          "Se confunde rima con repetición de palabras sin correspondencia sonora.",
          "No se identifican relaciones de rima o ritmo en los versos."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "cronica",
    "grade": 4,
    "subjectCode": "LEN",
    "aliases": [
      "crónica",
      "crónicas"
    ],
    "source": {
      "topicElementId": "370c118d-5406-5327-8bba-6325ea12703f",
      "pdfPages": [
        96,
        97
      ],
      "printedPages": [
        95,
        96
      ]
    },
    "dimensions": [
      {
        "id": "facts",
        "title": "Hechos documentados de la crónica",
        "production": "Relata hechos identificables de un acontecimiento, distinguiendo información documentada de valoraciones del cronista.",
        "analysis": "Reconoce los hechos del acontecimiento y distingue información documentada de valoraciones del cronista.",
        "comparison": "Contrasta los hechos y las valoraciones de las crónicas sobre el acontecimiento.",
        "evidence": [
          "Los hechos se distinguen de las valoraciones; una afirmación necesita precisar su sustento.",
          "Se mezclan datos y valoraciones sin señalar de qué tipo son.",
          "Se presenta una valoración como hecho comprobado o se atribuye un hecho inexistente al acontecimiento.",
          "No se identifican hechos reconocibles del acontecimiento."
        ],
        "weight": 5
      },
      {
        "id": "sequence",
        "title": "Secuencia narrativa de la crónica",
        "production": "Enlaza qué ocurrió, cómo, cuándo y quiénes participaron mediante una secuencia narrativa comprensible.",
        "analysis": "Explica la secuencia de la crónica relacionando qué ocurrió, cómo, cuándo y quiénes participaron.",
        "comparison": "Compara el orden de los hechos y las relaciones temporales de las crónicas.",
        "evidence": [
          "La secuencia permite seguir el acontecimiento; una transición temporal queda implícita.",
          "Se enumeran hechos sin establecer su orden o sus relaciones.",
          "El orden atribuido a los hechos cambia una causa o una consecuencia.",
          "No se presenta una secuencia reconocible de los hechos."
        ],
        "weight": 4
      },
      {
        "id": "perspective",
        "title": "Perspectiva del cronista y ambiente",
        "production": "Sitúa el acontecimiento y permite reconocer la perspectiva del cronista sin confundirla con los hechos relatados.",
        "analysis": "Explica cómo el ambiente y la perspectiva del cronista orientan el relato del acontecimiento.",
        "comparison": "Contrasta el ambiente y la perspectiva desde la que cada cronista relata los hechos.",
        "evidence": [
          "Se reconoce la perspectiva; una referencia al ambiente necesita vincularse con los hechos.",
          "Se menciona un ambiente o una valoración sin relacionarla con el relato.",
          "Se confunde la voz del cronista con la de un participante o se altera el ambiente de los hechos.",
          "No hay referencias que permitan situar el acontecimiento ni reconocer la perspectiva del relato."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "instructivo",
    "grade": 4,
    "subjectCode": "LEN",
    "aliases": [
      "instructivo",
      "instructivos"
    ],
    "source": {
      "topicElementId": "acceb93b-533e-5b2d-8b6c-ffd5f971a1ff",
      "pdfPages": [
        97,
        98
      ],
      "printedPages": [
        96,
        97
      ]
    },
    "dimensions": [
      {
        "id": "purpose",
        "title": "Propósito y destinatario del instructivo",
        "production": "Delimita qué permite hacer el instructivo y adecua las indicaciones a quien las utilizará.",
        "analysis": "Explica qué permite hacer el instructivo y a quién se dirigen sus indicaciones.",
        "comparison": "Contrasta los propósitos y destinatarios de los instructivos.",
        "evidence": [
          "Se reconoce qué se busca hacer; una indicación necesita adecuarse al destinatario.",
          "Se menciona una actividad sin explicar qué orientan sus instrucciones.",
          "Se atribuye al instructivo un uso incompatible con sus indicaciones.",
          "No se reconoce el propósito de las instrucciones."
        ],
        "weight": 4
      },
      {
        "id": "sequence",
        "title": "Secuencia de las instrucciones",
        "production": "Ordena las instrucciones y sus condiciones para que pueda seguirse el procedimiento o las reglas del juego descrito.",
        "analysis": "Relaciona cada instrucción con la anterior y explica las condiciones necesarias para seguir el procedimiento descrito.",
        "comparison": "Compara el orden y las condiciones de las instrucciones, explicando qué cambia en su ejecución.",
        "evidence": [
          "Puede seguirse la secuencia; una condición requiere explicitarse.",
          "Se enumeran acciones sin indicar su orden o las condiciones para continuarlas.",
          "El orden o una condición contradice el procedimiento y conduce a una acción distinta.",
          "No hay una secuencia reconocible de instrucciones."
        ],
        "weight": 5
      }
    ]
  },
  {
    "id": "informe-investigacion",
    "grade": 4,
    "subjectCode": "LEN",
    "aliases": [
      "informe de investigación",
      "informes de investigación",
      "informe investigativo"
    ],
    "source": {
      "topicElementId": "e5744392-a238-5d33-bfb6-9b2dcb08d517",
      "pdfPages": [
        98,
        99
      ],
      "printedPages": [
        97,
        98
      ]
    },
    "dimensions": [
      {
        "id": "problem",
        "title": "Problema, objetivos y método comunicados",
        "production": "Organiza el informe relacionando el problema y los objetivos con el método descrito y la información disponible.",
        "analysis": "Explica la relación entre el problema, los objetivos y el método comunicado en el informe.",
        "comparison": "Contrasta los problemas, objetivos y métodos descritos en los informes.",
        "evidence": [
          "Se comprende la relación entre problema y método; un objetivo necesita precisarse.",
          "Enumera objetivos y acciones sin relacionarlos con el problema.",
          "Atribuye al método un objetivo incompatible con las acciones descritas.",
          "No relaciona el problema con los objetivos ni el método comunicado."
        ],
        "weight": 4
      },
      {
        "id": "results",
        "title": "Resultados y argumentos de investigación",
        "production": "Relaciona los resultados disponibles con las afirmaciones del informe y distingue datos, interpretaciones y límites de la información.",
        "analysis": "Comprueba cómo los resultados y argumentos del informe sustentan sus afirmaciones, distinguiendo datos e interpretaciones.",
        "comparison": "Contrasta resultados y argumentos de los informes utilizando los datos que cada uno comunica.",
        "evidence": [
          "Los datos apoyan las afirmaciones; una interpretación necesita indicar su sustento.",
          "Reproduce datos y afirmaciones sin mostrar qué relación tienen.",
          "Atribuye a los datos una conclusión que no permiten o inventa resultados.",
          "No relaciona resultados disponibles con las afirmaciones del informe."
        ],
        "weight": 5
      }
    ]
  },
  {
    "id": "articulo-opinion",
    "grade": 4,
    "subjectCode": "LEN",
    "aliases": [
      "artículo de opinión",
      "artículos de opinión"
    ],
    "source": {
      "topicElementId": "31fa58fe-2821-55cc-9124-6703ebf699d4",
      "pdfPages": [
        99,
        100
      ],
      "printedPages": [
        98,
        99
      ]
    },
    "dimensions": [
      {
        "id": "thesis",
        "title": "Tesis y propósito argumentativo",
        "production": "Formula una tesis definida sobre el asunto del artículo de opinión y mantiene esa postura a lo largo del texto.",
        "analysis": "Identifica la tesis y explica la postura del autor frente al asunto del artículo de opinión.",
        "comparison": "Contrasta las tesis y las posturas de los autores sobre el asunto tratado.",
        "evidence": [
          "La postura es reconocible; una afirmación necesita aclarar su relación con ella.",
          "Se menciona el asunto sin distinguir la postura defendida.",
          "Se atribuye al autor una postura contraria a la que sostiene el artículo.",
          "No se identifica una tesis reconocible sobre el asunto."
        ],
        "weight": 5
      },
      {
        "id": "arguments",
        "title": "Argumentos que sostienen la tesis",
        "production": "Desarrolla argumentos relacionados con la tesis y muestra cómo las razones o evidencias la sostienen.",
        "analysis": "Explica cómo los argumentos apoyan la tesis y valora si las razones se relacionan con lo afirmado.",
        "comparison": "Contrasta los argumentos y su capacidad para sostener las tesis de los artículos.",
        "evidence": [
          "Las razones apoyan la tesis; una relación entre razón y afirmación queda implícita.",
          "Se enumeran opiniones o ejemplos sin explicar su apoyo a la tesis.",
          "Una razón contradice la tesis o se presenta una afirmación sin sustento como prueba.",
          "No se aportan argumentos vinculados con la tesis."
        ],
        "weight": 5
      },
      {
        "id": "organization",
        "title": "Secuencia argumentativa del artículo",
        "production": "Organiza el punto de partida y el desarrollo de la tesis y sus argumentos en una secuencia comprensible.",
        "analysis": "Explica cómo el punto de partida y el desarrollo organizan la tesis y sus argumentos.",
        "comparison": "Compara la organización de las tesis y los argumentos en los artículos.",
        "evidence": [
          "Se sigue el hilo argumentativo; una transición requiere aclaración.",
          "Se agrupan razones sin un orden que permita seguir la defensa de la tesis.",
          "El orden separa una razón de la afirmación que sostiene y cambia el sentido argumentativo.",
          "No se reconoce una secuencia argumentativa en el artículo."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "discurso-agradecimiento",
    "grade": 4,
    "subjectCode": "LEN",
    "aliases": [
      "discurso de agradecimiento",
      "discurso oral de agradecimiento",
      "discursos de agradecimiento"
    ],
    "source": {
      "topicElementId": "12697a72-41be-5f03-802b-f3f56162c2fe",
      "pdfPages": [
        100,
        101
      ],
      "printedPages": [
        99,
        100
      ]
    },
    "dimensions": [
      {
        "id": "occasion",
        "title": "Ocasión y participantes del agradecimiento",
        "production": "Sitúa la ocasión y distingue quién agradece, a quién se reconoce y a quiénes se dirige el discurso.",
        "analysis": "Identifica la ocasión y los roles de quien agradece, de quien recibe el reconocimiento y del público.",
        "comparison": "Compara las ocasiones y los roles de los participantes en los discursos.",
        "evidence": [
          "Los roles se reconocen; una referencia a un participante necesita aclararse.",
          "Nombra personas sin distinguir sus papeles en el agradecimiento.",
          "Confunde a quien agradece con quien recibe el reconocimiento.",
          "No se reconoce la ocasión ni a quién se dirige el agradecimiento."
        ],
        "weight": 4
      },
      {
        "id": "reasons",
        "title": "Razones y secuencia del agradecimiento",
        "production": "Fundamenta el agradecimiento en aportes reconocibles y organiza las razones para mostrar por qué merecen reconocimiento.",
        "analysis": "Explica la tesis del agradecimiento y cómo sus razones se relacionan con los aportes de la persona o entidad reconocida.",
        "comparison": "Contrasta las razones de agradecimiento y su relación con los aportes reconocidos en cada discurso.",
        "evidence": [
          "Las razones justifican el reconocimiento; una relación con un aporte queda implícita.",
          "Enumera elogios sin relacionarlos con aportes identificables.",
          "Atribuye a una persona aportes de otra o razones contrarias al reconocimiento.",
          "No presenta razones que justifiquen el agradecimiento."
        ],
        "weight": 5
      }
    ]
  },
  {
    "id": "novela",
    "grade": 4,
    "subjectCode": "LEN",
    "aliases": [
      "novela",
      "novelas",
      "novela de aventuras"
    ],
    "source": {
      "topicElementId": "11f07c73-d310-565e-8d05-0da190350962",
      "pdfPages": [
        102
      ],
      "printedPages": [
        101
      ]
    },
    "dimensions": [
      {
        "id": "plot",
        "title": "Acontecimientos y relaciones de la trama",
        "production": "Relaciona los acontecimientos disponibles de la novela y sustenta sus vínculos temporales y causales en el pasaje.",
        "analysis": "Relaciona los acontecimientos disponibles de la novela y sustenta sus vínculos temporales y causales en el pasaje.",
        "comparison": "Contrasta las relaciones temporales y causales de los acontecimientos en los pasajes disponibles.",
        "evidence": [
          "Las relaciones corresponden al pasaje; una transición necesita apoyo textual.",
          "Enumera acontecimientos sin explicar sus relaciones.",
          "Invierte una causa y consecuencia o añade acontecimientos ausentes del pasaje.",
          "No relaciona acontecimientos reconocibles del pasaje."
        ],
        "weight": 5
      },
      {
        "id": "characters",
        "title": "Personajes, motivaciones y ambiente",
        "production": "Sustenta las motivaciones de los personajes relacionando sus acciones con el ambiente disponible en la novela.",
        "analysis": "Sustenta las motivaciones de los personajes relacionando sus acciones con el ambiente disponible en la novela.",
        "comparison": "Compara las motivaciones y acciones de los personajes y su relación con los ambientes de los pasajes.",
        "evidence": [
          "Las motivaciones tienen apoyo en acciones; una relación con el ambiente necesita aclararse.",
          "Describe personajes o lugares sin explicar su influencia en las acciones.",
          "Atribuye a un personaje una motivación contraria a sus acciones.",
          "No aporta acciones que sustenten las motivaciones ni su relación con el ambiente."
        ],
        "weight": 4
      },
      {
        "id": "narrator",
        "title": "Narrador y voces de los personajes",
        "production": "Distingue al narrador de los personajes y explica qué información permite conocer cada voz en el texto disponible.",
        "analysis": "Distingue al narrador de los personajes y explica qué información permite conocer cada voz en el texto disponible.",
        "comparison": "Contrasta las voces narrativas y la información que ofrecen en los pasajes comparados.",
        "evidence": [
          "Distingue las voces; una intervención necesita atribuirse con mayor claridad.",
          "Nombra voces sin explicar quién comunica cada información.",
          "Confunde narrador y autor o atribuye a un personaje palabras de otro.",
          "No identifica las voces mediante evidencias del texto disponible."
        ],
        "weight": 4
      },
      {
        "id": "theme",
        "title": "Temas sustentados en el pasaje",
        "production": "Formula una interpretación de los temas de la novela apoyada en acciones, ambientes o intervenciones del pasaje disponible.",
        "analysis": "Formula una interpretación de los temas de la novela apoyada en acciones, ambientes o intervenciones del pasaje disponible.",
        "comparison": "Contrasta los temas de los pasajes mediante sus acciones, ambientes o intervenciones.",
        "evidence": [
          "El tema tiene apoyo textual; una relación con la evidencia necesita explicarse.",
          "Nombra asuntos generales sin relacionarlos con el pasaje.",
          "Atribuye al texto un tema incompatible con la evidencia disponible.",
          "No propone un tema sustentado en el pasaje."
        ],
        "weight": 4
      }
    ]
  },
  {
    "id": "soneto",
    "grade": 4,
    "subjectCode": "LEN",
    "aliases": [
      "soneto",
      "sonetos"
    ],
    "source": {
      "topicElementId": "ec355624-74ba-59cb-b85a-5577ab279b7c",
      "pdfPages": [
        102,
        103
      ],
      "printedPages": [
        101,
        102
      ]
    },
    "dimensions": [
      {
        "id": "meaning",
        "title": "Sentimientos y sentido del soneto",
        "production": "Desarrolla un sentimiento o reflexión mediante imágenes y versos relacionados a lo largo del soneto.",
        "analysis": "Interpreta el sentimiento o reflexión del soneto a partir de sus imágenes y versos.",
        "comparison": "Contrasta los sentimientos o reflexiones de los sonetos mediante sus imágenes y versos.",
        "evidence": [
          "Se reconoce el sentimiento; una imagen necesita relacionarse con él.",
          "Menciona emociones o imágenes aisladas sin explicar sus relaciones.",
          "Atribuye al soneto un sentimiento contrario a sus versos.",
          "No reconoce un sentido poético apoyado en los versos."
        ],
        "weight": 4
      },
      {
        "id": "verse",
        "title": "Estructura y versos del soneto",
        "production": "Organiza catorce versos endecasílabos en dos cuartetos y dos tercetos, manteniendo el desarrollo del sentido poético.",
        "analysis": "Explica la organización de los versos y estrofas del soneto y comprueba su medida mediante el cómputo métrico.",
        "comparison": "Compara la organización estrófica y la medida de los versos de los sonetos.",
        "evidence": [
          "La organización se reconoce; un verso necesita ajustar o explicar su cómputo.",
          "Enumera versos o estrofas sin establecer su organización y medida.",
          "Confunde palabras con sílabas métricas o asigna una medida incompatible al verso.",
          "No aporta evidencia de la organización ni del cómputo de los versos."
        ],
        "weight": 4
      },
      {
        "id": "rhyme",
        "title": "Rima y ritmo del soneto",
        "production": "Enlaza la rima consonante y las pausas de los versos con el sentido que comunica el soneto.",
        "analysis": "Explica la rima y el ritmo a partir de las terminaciones y las pausas de los versos del soneto.",
        "comparison": "Contrasta las relaciones de rima y ritmo en los sonetos y su contribución al sentido.",
        "evidence": [
          "Las relaciones sonoras se reconocen; una terminación o pausa necesita precisarse.",
          "Señala sonidos parecidos sin explicar sus correspondencias entre versos.",
          "Confunde rima con repetición de palabras sin correspondencia sonora.",
          "No identifica relaciones de rima ni ritmo en los versos."
        ],
        "weight": 4
      }
    ]
  }
],fourthGradeLanguageFeatures:{
  "cronica": [
    {
      "id": "temporal",
      "match": "conectores.*(?:temporal|secuenciacion|causalidad)|conectores temporales",
      "name": "los conectores de secuencia y causalidad",
      "function": "distinguir el orden de las acciones de las relaciones entre causas y efectos",
      "error": "se interpreta como causa una sucesión temporal o se invierte el orden de las acciones",
      "terms": [
        [
          "temporal|secuenciacion",
          "los conectores de secuencia temporal"
        ],
        [
          "causalidad",
          "los conectores de causalidad"
        ]
      ]
    },
    {
      "id": "manner",
      "match": "adverbios? de modo",
      "name": "los adverbios de modo",
      "function": "precisar cómo se realizan las acciones comunicadas",
      "error": "se atribuye al adverbio una circunstancia distinta de la que modifica"
    },
    {
      "id": "paratext",
      "match": "paratext|volanta|copete|epigrafe",
      "name": "los elementos paratextuales disponibles",
      "function": "orientar la lectura y relacionar el título, los apoyos y las referencias con el contenido",
      "error": "se atribuye al paratexto una información que contradice el texto",
      "terms": [
        [
          "volanta",
          "la volanta"
        ],
        [
          "copete",
          "el copete"
        ],
        [
          "epigrafe",
          "el epígrafe"
        ]
      ]
    },
    {
      "id": "register",
      "match": "registro|formal e informal",
      "name": "el registro de la comunicación",
      "function": "ajustar el tratamiento y las expresiones al interlocutor y a la situación",
      "error": "se mezclan tratamientos incompatibles o expresiones ajenas a la relación comunicativa",
      "terms": [
        [
          "\\bformal\\b",
          "el registro formal"
        ],
        [
          "\\binformal\\b",
          "el registro informal"
        ]
      ]
    },
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "synonyms",
      "match": "sinonim",
      "name": "los sinónimos",
      "function": "retomar una misma idea sin repeticiones ni cambios de referente",
      "error": "se sustituye una palabra por otra de significado incompatible en ese contexto"
    },
    {
      "id": "punctuation",
      "match": "puntuacion",
      "name": "los signos de puntuación",
      "function": "delimitar enunciados y distinguir relaciones entre los datos informados",
      "error": "la delimitación une datos incompatibles o separa información que debe leerse junta"
    },
    {
      "id": "circumstances",
      "match": "modificadores circunstanciales",
      "name": "los modificadores circunstanciales",
      "function": "precisar las circunstancias de los hechos sin confundirlas con sus participantes",
      "error": "se atribuye una circunstancia a una acción distinta de la que modifica"
    },
    {
      "id": "pronouns",
      "match": "pronombres",
      "name": "los pronombres personales, demostrativos e indefinidos",
      "function": "retomar participantes y referencias de los hechos manteniendo identificable a quién o qué aluden",
      "error": "se cambia el referente y se atribuye el hecho a otro participante"
    },
    {
      "id": "sentences",
      "match": "oraciones.*(?:coordinadas|yuxtapuestas|subordinadas)",
      "name": "las oraciones coordinadas, yuxtapuestas y subordinadas",
      "function": "relacionar hechos distinguiendo coordinación, dependencia y enlace mediante puntuación",
      "error": "se interpreta una proposición dependiente como hecho independiente o se cambia su relación"
    },
    {
      "id": "adjectives",
      "match": "adjetiv",
      "name": "los adjetivos",
      "function": "caracterizar los referentes del texto",
      "error": "se atribuye una cualidad o determinación a un referente distinto",
      "terms": [
        [
          "calificativ",
          "los adjetivos calificativos"
        ],
        [
          "determinativ",
          "los adjetivos determinativos"
        ]
      ]
    },
    {
      "id": "types",
      "match": "tipos de cronica|caracteristicas",
      "name": "los tipos y características de la crónica",
      "function": "relacionar el acontecimiento narrado, su tratamiento y la perspectiva del cronista con la clase de crónica",
      "error": "se clasifica la crónica por un dato aislado que contradice su tratamiento del acontecimiento"
    },
    {
      "id": "passive",
      "match": "voz pasiva",
      "name": "los verbos en voz pasiva",
      "function": "distinguir quién recibe la acción de quién la realiza, incluso cuando el agente queda implícito",
      "error": "se intercambia el agente y quien recibe la acción"
    }
  ],
  "instructivo": [
    {
      "id": "impersonal",
      "match": "impersonal",
      "name": "las formas impersonales del verbo",
      "function": "comunicar acciones sin atribuirlas a un sujeto inexistente",
      "error": "se añade un agente que cambia la acción comunicada"
    },
    {
      "id": "infinitive",
      "match": "infinitivo",
      "name": "los verbos en infinitivo",
      "function": "nombrar acciones y propósitos sin confundirlos con hechos ya realizados",
      "error": "se interpreta un propósito como un resultado ya obtenido"
    },
    {
      "id": "adverbs",
      "match": "adverbios?|construcciones adverbiales",
      "name": "los adverbios y construcciones adverbiales",
      "function": "precisar modo, frecuencia o cantidad de las acciones sin cambiar sus relaciones",
      "error": "se atribuye a una acción una circunstancia de otra",
      "terms": [
        [
          "frecuencia",
          "los adverbios de frecuencia"
        ],
        [
          "modo",
          "los adverbios de modo"
        ],
        [
          "cantidad",
          "los adverbios de cantidad"
        ]
      ]
    },
    {
      "id": "graphics",
      "match": "informacion grafica|grafic[oa]s?|tablas?|diagramas?|dibujos?|fotografias?|imagenes|ilustr|mapas?(?! conceptual)",
      "name": "los recursos gráficos solicitados",
      "function": "relacionar lo representado con la información del texto y mantener sus datos o referencias",
      "error": "el recurso representa datos o referentes incompatibles con el pasaje",
      "terms": [
        [
          "grafic[oa]s?",
          "los gráficos"
        ],
        [
          "tablas?",
          "las tablas"
        ],
        [
          "diagramas?",
          "los diagramas"
        ],
        [
          "dibujos?",
          "los dibujos"
        ],
        [
          "fotografias?",
          "las fotografías"
        ],
        [
          "imagenes",
          "las imágenes"
        ],
        [
          "ilustraciones|ilustracion",
          "las ilustraciones"
        ],
        [
          "mapas?(?! conceptual)",
          "los mapas"
        ]
      ]
    },
    {
      "id": "nonverbal",
      "match": "paralinguistic|gestos|gestual|corporal|tono de voz|entonacion|postura|recursos no verbales",
      "name": "los recursos expresivos solicitados",
      "function": "relacionar gestos, entonación o apoyos de acceso acordados con el sentido del contenido comunicado",
      "error": "el gesto o la entonación expresa una emoción o relación contraria al contenido"
    },
    {
      "id": "vocabulary",
      "match": "lexico|vocabulario",
      "name": "el léxico técnico del instructivo",
      "function": "nombrar acciones y elementos del procedimiento de forma comprensible para quien lo utiliza",
      "error": "un término indica una acción distinta de la requerida"
    },
    {
      "id": "connectors",
      "match": "conectores",
      "name": "los conectores de orden y finalidad",
      "function": "enlazar los pasos y distinguir su secuencia del propósito de cada acción",
      "error": "se confunde la finalidad con un paso o se invierte la secuencia",
      "terms": [
        [
          "orden",
          "los conectores de orden"
        ],
        [
          "finalidad",
          "los conectores de finalidad"
        ]
      ]
    },
    {
      "id": "enumeration",
      "match": "numeros|vinetas|numeracion",
      "name": "los números y las viñetas",
      "function": "separar instrucciones y hacer reconocible su orden sin mezclar acciones de pasos distintos",
      "error": "una marca une acciones incompatibles o altera el paso al que pertenece una indicación"
    }
  ],
  "informe-investigacion": [
    {
      "id": "impersonal",
      "match": "impersonal",
      "name": "las formas impersonales del verbo",
      "function": "comunicar acciones sin atribuirlas a un sujeto inexistente",
      "error": "se añade un agente que cambia la acción comunicada"
    },
    {
      "id": "infinitive",
      "match": "infinitivo",
      "name": "los verbos en infinitivo",
      "function": "nombrar acciones y propósitos sin confundirlos con hechos ya realizados",
      "error": "se interpreta un propósito como un resultado ya obtenido"
    },
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "adverbs",
      "match": "adverbios?|construcciones adverbiales",
      "name": "los adverbios y construcciones adverbiales",
      "function": "precisar modo, frecuencia o cantidad de las acciones sin cambiar sus relaciones",
      "error": "se atribuye a una acción una circunstancia de otra",
      "terms": [
        [
          "frecuencia",
          "los adverbios de frecuencia"
        ],
        [
          "modo",
          "los adverbios de modo"
        ],
        [
          "cantidad",
          "los adverbios de cantidad"
        ]
      ]
    },
    {
      "id": "citations",
      "match": "citacion|citas? (?:textuales|directas|indirectas)|comillas|parentesis|puntos suspensivos",
      "name": "los mecanismos de citación",
      "function": "distinguir palabras o ideas de la fuente de la voz propia y conservar su sentido al citarlas",
      "error": "se atribuye a la fuente una afirmación que no hizo o se presenta una cita como idea propia",
      "terms": [
        [
          "directas",
          "las citas directas"
        ],
        [
          "indirectas",
          "las citas indirectas"
        ]
      ]
    },
    {
      "id": "sources",
      "match": "referencias bibliograficas|fuentes bibliograficas",
      "name": "las referencias bibliográficas",
      "function": "identificar el origen de los datos e ideas y permitir contrastarlos con la fuente utilizada",
      "error": "la referencia corresponde a una obra distinta o no respalda la información atribuida"
    },
    {
      "id": "connectors",
      "match": "conectores",
      "name": "los conectores de relación lógica",
      "function": "distinguir adición, contraste, explicación y finalidad entre las ideas que enlazan",
      "error": "el enlace invierte una causa, presenta una oposición como coincidencia o atribuye una conclusión ajena",
      "terms": [
        [
          "contraste",
          "los conectores de contraste"
        ],
        [
          "adicion",
          "los conectores de adición"
        ],
        [
          "cierre",
          "los conectores de cierre"
        ],
        [
          "ejemplificacion",
          "los conectores de ejemplificación"
        ],
        [
          "finalidad",
          "los conectores de finalidad"
        ],
        [
          "recapitulacion",
          "los conectores de recapitulación"
        ],
        [
          "apertura",
          "los conectores de apertura"
        ],
        [
          "causa",
          "los conectores de causa y efecto"
        ]
      ]
    },
    {
      "id": "argument-types",
      "match": "composicion de argumentos|analogia|ejemplificacion|deduccion|de autoridad",
      "name": "los procedimientos de argumentación",
      "function": "relacionar razones y evidencias con la afirmación sustentada, distinguiendo lo que puede inferirse de los datos",
      "error": "se afirma una conclusión que no se desprende de las premisas o se atribuye autoridad a una fuente ajena",
      "terms": [
        [
          "analogia",
          "la analogía"
        ],
        [
          "ejemplificacion",
          "la ejemplificación"
        ],
        [
          "deduccion",
          "la deducción"
        ],
        [
          "autoridad",
          "los argumentos de autoridad"
        ]
      ]
    },
    {
      "id": "graphics",
      "match": "informacion grafica|grafic[oa]s?|tablas?|diagramas?|dibujos?|fotografias?|imagenes|ilustr|mapas?(?! conceptual)",
      "name": "los recursos gráficos solicitados",
      "function": "relacionar lo representado con la información del texto y mantener sus datos o referencias",
      "error": "el recurso representa datos o referentes incompatibles con el pasaje",
      "terms": [
        [
          "grafic[oa]s?",
          "los gráficos"
        ],
        [
          "tablas?",
          "las tablas"
        ],
        [
          "diagramas?",
          "los diagramas"
        ],
        [
          "dibujos?",
          "los dibujos"
        ],
        [
          "fotografias?",
          "las fotografías"
        ],
        [
          "imagenes",
          "las imágenes"
        ],
        [
          "ilustraciones|ilustracion",
          "las ilustraciones"
        ],
        [
          "mapas?(?! conceptual)",
          "los mapas"
        ]
      ]
    },
    {
      "id": "sentences",
      "match": "oraciones compuestas",
      "name": "las oraciones compuestas",
      "function": "enlazar proposiciones del informe manteniendo qué se afirma y cómo se relacionan los datos",
      "error": "se interpreta una proposición dependiente como conclusión independiente"
    },
    {
      "id": "organizers",
      "match": "esquemas de contenido|organizadores graficos",
      "name": "los esquemas y organizadores del contenido",
      "function": "representar las relaciones entre problema, método y resultados comunicados por el informe",
      "error": "un enlace atribuye un resultado a un procedimiento distinto"
    }
  ],
  "articulo-opinion": [
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "connectors",
      "match": "conectores",
      "name": "los conectores de relación lógica",
      "function": "distinguir adición, contraste, explicación y finalidad entre las ideas que enlazan",
      "error": "el enlace invierte una causa, presenta una oposición como coincidencia o atribuye una conclusión ajena",
      "terms": [
        [
          "contraste",
          "los conectores de contraste"
        ],
        [
          "adicion",
          "los conectores de adición"
        ],
        [
          "cierre",
          "los conectores de cierre"
        ],
        [
          "ejemplificacion",
          "los conectores de ejemplificación"
        ],
        [
          "finalidad",
          "los conectores de finalidad"
        ],
        [
          "recapitulacion",
          "los conectores de recapitulación"
        ],
        [
          "apertura",
          "los conectores de apertura"
        ],
        [
          "causa",
          "los conectores de causa y efecto"
        ]
      ]
    },
    {
      "id": "citations",
      "match": "citacion|citas? (?:textuales|directas|indirectas)|comillas|parentesis|puntos suspensivos",
      "name": "los mecanismos de citación",
      "function": "distinguir palabras o ideas de la fuente de la voz propia y conservar su sentido al citarlas",
      "error": "se atribuye a la fuente una afirmación que no hizo o se presenta una cita como idea propia",
      "terms": [
        [
          "directas",
          "las citas directas"
        ],
        [
          "indirectas",
          "las citas indirectas"
        ]
      ]
    },
    {
      "id": "graphics",
      "match": "informacion grafica|grafic[oa]s?|tablas?|diagramas?|dibujos?|fotografias?|imagenes|ilustr|mapas?(?! conceptual)",
      "name": "los recursos gráficos solicitados",
      "function": "relacionar lo representado con la información del texto y mantener sus datos o referencias",
      "error": "el recurso representa datos o referentes incompatibles con el pasaje",
      "terms": [
        [
          "grafic[oa]s?",
          "los gráficos"
        ],
        [
          "tablas?",
          "las tablas"
        ],
        [
          "diagramas?",
          "los diagramas"
        ],
        [
          "dibujos?",
          "los dibujos"
        ],
        [
          "fotografias?",
          "las fotografías"
        ],
        [
          "imagenes",
          "las imágenes"
        ],
        [
          "ilustraciones|ilustracion",
          "las ilustraciones"
        ],
        [
          "mapas?(?! conceptual)",
          "los mapas"
        ]
      ]
    },
    {
      "id": "register",
      "match": "registro|formal e informal",
      "name": "el registro de la comunicación",
      "function": "ajustar el tratamiento y las expresiones al interlocutor y a la situación",
      "error": "se mezclan tratamientos incompatibles o expresiones ajenas a la relación comunicativa",
      "terms": [
        [
          "\\bformal\\b",
          "el registro formal"
        ],
        [
          "\\binformal\\b",
          "el registro informal"
        ]
      ]
    },
    {
      "id": "rhetorical",
      "match": "pregunta retorica",
      "name": "la pregunta retórica",
      "function": "reforzar una postura mediante una interrogación cuya intención se interpreta en el argumento",
      "error": "se interpreta la pregunta como solicitud literal de un dato y se pierde su intención argumentativa"
    },
    {
      "id": "counterarguments",
      "match": "contraargument",
      "name": "los contraargumentos",
      "function": "reconocer una postura contraria y responder a sus razones con apoyos pertinentes, sin deformarla",
      "error": "se refuta una postura distinta de la que sostuvo el interlocutor"
    },
    {
      "id": "stance",
      "match": "expresiones.*(?:tesis|punto de vista)|verbos de opinion",
      "name": "las expresiones y verbos de opinión",
      "function": "atribuir la valoración a quien la sostiene y distinguirla de una afirmación presentada como hecho",
      "error": "se atribuye al autor la opinión de otra voz o se interpreta una duda como certeza"
    },
    {
      "id": "statistics",
      "match": "datos estadisticos|cifras|estadisticas",
      "name": "los datos estadísticos",
      "function": "sustentar argumentos indicando qué representan las cifras y qué relación guardan con la tesis",
      "error": "se usa una cifra fuera de su referente o se extrae de ella una conclusión no sustentada"
    },
    {
      "id": "subordinate",
      "match": "oraciones.*subordinadas",
      "name": "las oraciones subordinadas",
      "function": "relacionar circunstancias, sujetos y cualidades con la proposición de la que dependen",
      "error": "se atribuye una condición o cualidad a una afirmación distinta",
      "terms": [
        [
          "adverbiales",
          "las subordinadas adverbiales"
        ],
        [
          "sustantivas",
          "las subordinadas sustantivas"
        ],
        [
          "adjetivas",
          "las subordinadas adjetivas"
        ]
      ]
    }
  ],
  "discurso-agradecimiento": [
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "citations",
      "match": "citacion|citas? (?:textuales|directas|indirectas)|comillas|parentesis|puntos suspensivos",
      "name": "los mecanismos de citación",
      "function": "distinguir palabras o ideas de la fuente de la voz propia y conservar su sentido al citarlas",
      "error": "se atribuye a la fuente una afirmación que no hizo o se presenta una cita como idea propia",
      "terms": [
        [
          "directas",
          "las citas directas"
        ],
        [
          "indirectas",
          "las citas indirectas"
        ]
      ]
    },
    {
      "id": "sources",
      "match": "referencias bibliograficas|fuentes bibliograficas",
      "name": "las referencias bibliográficas",
      "function": "identificar el origen de los datos e ideas y permitir contrastarlos con la fuente utilizada",
      "error": "la referencia corresponde a una obra distinta o no respalda la información atribuida"
    },
    {
      "id": "connectors",
      "match": "conectores",
      "name": "los conectores de relación lógica",
      "function": "distinguir adición, contraste, explicación y finalidad entre las ideas que enlazan",
      "error": "el enlace invierte una causa, presenta una oposición como coincidencia o atribuye una conclusión ajena",
      "terms": [
        [
          "contraste",
          "los conectores de contraste"
        ],
        [
          "adicion",
          "los conectores de adición"
        ],
        [
          "cierre",
          "los conectores de cierre"
        ],
        [
          "ejemplificacion",
          "los conectores de ejemplificación"
        ],
        [
          "finalidad",
          "los conectores de finalidad"
        ],
        [
          "recapitulacion",
          "los conectores de recapitulación"
        ],
        [
          "apertura",
          "los conectores de apertura"
        ],
        [
          "causa",
          "los conectores de causa y efecto"
        ]
      ]
    },
    {
      "id": "nonverbal",
      "match": "paralinguistic|gestos|gestual|corporal|tono de voz|entonacion|postura|recursos no verbales",
      "name": "los recursos expresivos solicitados",
      "function": "relacionar gestos, entonación o apoyos de acceso acordados con el sentido del contenido comunicado",
      "error": "el gesto o la entonación expresa una emoción o relación contraria al contenido"
    },
    {
      "id": "paratext",
      "match": "paratext|volanta|copete|epigrafe",
      "name": "los elementos paratextuales disponibles",
      "function": "orientar la lectura y relacionar el título, los apoyos y las referencias con el contenido",
      "error": "se atribuye al paratexto una información que contradice el texto",
      "terms": [
        [
          "volanta",
          "la volanta"
        ],
        [
          "copete",
          "el copete"
        ],
        [
          "epigrafe",
          "el epígrafe"
        ]
      ]
    },
    {
      "id": "register",
      "match": "registro|formal e informal",
      "name": "el registro de la comunicación",
      "function": "ajustar el tratamiento y las expresiones al interlocutor y a la situación",
      "error": "se mezclan tratamientos incompatibles o expresiones ajenas a la relación comunicativa",
      "terms": [
        [
          "\\bformal\\b",
          "el registro formal"
        ],
        [
          "\\binformal\\b",
          "el registro informal"
        ]
      ]
    },
    {
      "id": "references",
      "match": "referencias lexic",
      "name": "las referencias léxicas de persona",
      "function": "retomar a los participantes manteniendo identificable a quién se atribuye cada aporte",
      "error": "la referencia cambia de persona y atribuye un aporte a alguien distinto"
    },
    {
      "id": "deictics",
      "match": "deictic|autorreferencia",
      "name": "la autorreferencia y los deícticos personales",
      "function": "distinguir la voz de quien agradece de las personas a quienes se dirige o incluye en su discurso",
      "error": "se interpreta el nosotros como un grupo ajeno a la situación comunicativa"
    },
    {
      "id": "courtesy",
      "match": "marcas de agradecimiento|cortesia",
      "name": "las marcas de agradecimiento y cortesía",
      "function": "expresar reconocimiento con formas adecuadas a la ocasión y a los participantes",
      "error": "una fórmula se dirige al participante equivocado o contradice el reconocimiento"
    },
    {
      "id": "voices",
      "match": "otras voces|intratextuales|intertextuales",
      "name": "los organizadores y las voces incorporadas",
      "function": "distinguir la referencia a una parte anterior del discurso de la incorporación de ideas de otra voz",
      "error": "se atribuye a otro autor una afirmación propia o se remite a una idea ausente"
    }
  ],
  "novela": [
    {
      "id": "adjectives",
      "match": "adjetiv",
      "name": "los adjetivos",
      "function": "caracterizar los referentes del texto",
      "error": "se atribuye una cualidad o determinación a un referente distinto",
      "terms": [
        [
          "calificativ",
          "los adjetivos calificativos"
        ],
        [
          "determinativ",
          "los adjetivos determinativos"
        ]
      ]
    },
    {
      "id": "character-roles",
      "match": "personajes principales|personajes secundarios|clasific.*personajes|protagonista|antagonista|incidentales|ambientales|fugaces",
      "name": "los roles de los personajes",
      "function": "distinguir la participación de los personajes en el conflicto mediante sus acciones disponibles",
      "error": "se atribuye a un personaje un papel incompatible con su participación en el relato",
      "terms": [
        [
          "principales",
          "los personajes principales"
        ],
        [
          "secundarios",
          "los personajes secundarios"
        ],
        [
          "\\bprotagonista\\b",
          "el protagonista"
        ],
        [
          "\\bantagonista\\b",
          "el antagonista"
        ],
        [
          "ambientales",
          "los personajes ambientales"
        ],
        [
          "incidentales|fugaces",
          "los personajes incidentales o fugaces"
        ]
      ]
    },
    {
      "id": "setting",
      "match": "ambiente (?:fisico|psicologico|sicologico)",
      "name": "el ambiente del relato",
      "function": "relacionar las condiciones del entorno y las emociones disponibles con las acciones de los personajes",
      "error": "se atribuye al ambiente una condición o emoción que contradice los hechos del pasaje",
      "terms": [
        [
          "fisico",
          "el ambiente físico"
        ],
        [
          "psicologico|sicologico",
          "el ambiente psicológico"
        ]
      ]
    },
    {
      "id": "indicative",
      "match": "indicativo|preterito|tiempos verbales",
      "name": "los tiempos verbales del relato",
      "function": "distinguir acciones terminadas, situaciones en desarrollo y relaciones de anterioridad en la narración",
      "error": "se cambia la duración o el orden de los hechos al confundir los tiempos verbales",
      "terms": [
        [
          "indefinido",
          "el pretérito indefinido"
        ],
        [
          "imperfecto",
          "el pretérito imperfecto"
        ],
        [
          "compuesto",
          "el pretérito compuesto"
        ]
      ]
    },
    {
      "id": "discourse",
      "match": "organizadores discursivos|formulas de inicio|formulas.*cierre",
      "name": "los organizadores discursivos",
      "function": "señalar cambios y continuidades entre partes del texto manteniendo sus relaciones",
      "error": "un marcador atribuye continuidad a una idea que inicia otro asunto"
    },
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "sequences",
      "match": "secuencias narrativas|descriptivas|dialogadas",
      "name": "las secuencias narrativas, descriptivas y dialogadas",
      "function": "distinguir hechos, rasgos del ambiente e intervenciones y explicar cómo contribuyen al pasaje",
      "error": "se interpreta una descripción como acción ocurrida o se atribuye un diálogo al narrador"
    },
    {
      "id": "connectors",
      "match": "conectores",
      "name": "los conectores temporales, causales y consecutivos",
      "function": "distinguir el orden de los hechos de sus causas y consecuencias",
      "error": "se interpreta una sucesión temporal como causa o se invierte una consecuencia"
    },
    {
      "id": "past",
      "match": "verbos en pasado",
      "name": "los verbos en pasado",
      "function": "distinguir acciones concluidas y situaciones en desarrollo al reconstruir el orden del relato",
      "error": "se interpreta una situación durativa como una acción puntual y cambia la secuencia"
    }
  ],
  "soneto": [
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "nonverbal",
      "match": "paralinguistic|gestos|gestual|corporal|tono de voz|entonacion|postura|recursos no verbales",
      "name": "los recursos expresivos solicitados",
      "function": "relacionar gestos, entonación o apoyos de acceso acordados con el sentido del contenido comunicado",
      "error": "el gesto o la entonación expresa una emoción o relación contraria al contenido"
    },
    {
      "id": "literary",
      "match": "figuras literarias|recursos linguisticos y literarios|recursos literarios|imagenes poeticas|epiteto|personificacion|hiperbole|hiperbaton|sinestesia",
      "name": "las figuras literarias",
      "function": "vincular las imágenes y los desplazamientos de sentido con los sentimientos o acciones expresados",
      "error": "se interpreta literalmente una expresión figurada o se le atribuye un efecto contrario al pasaje",
      "terms": [
        [
          "epiteto",
          "el epíteto"
        ],
        [
          "personificacion",
          "la personificación"
        ],
        [
          "hiperbole",
          "la hipérbole"
        ],
        [
          "hiperbaton",
          "el hipérbaton"
        ],
        [
          "sinestesia",
          "la sinestesia"
        ]
      ]
    },
    {
      "id": "licenses",
      "match": "licencias metricas|sinalefa|sineresis|dieresis|hiato",
      "name": "las licencias métricas",
      "function": "justificar uniones o separaciones de sonidos en el cómputo del verso sin confundir sílabas gramaticales y métricas",
      "error": "se cuenta una unión o separación inexistente y se altera la medida del verso",
      "terms": [
        [
          "sinalefa",
          "la sinalefa"
        ],
        [
          "sineresis",
          "la sinéresis"
        ],
        [
          "dieresis",
          "la diéresis"
        ],
        [
          "hiato",
          "el hiato"
        ]
      ]
    },
    {
      "id": "images",
      "match": "imagenes.*(?:visuales|auditivas|olfativas|tactiles|gustativas)",
      "name": "las imágenes sensoriales",
      "function": "relacionar sensaciones evocadas con palabras del verso y con el sentimiento expresado",
      "error": "se atribuye a la imagen una sensación o emoción contraria al verso",
      "terms": [
        [
          "visuales",
          "las imágenes visuales"
        ],
        [
          "auditivas",
          "las imágenes auditivas"
        ],
        [
          "olfativas",
          "las imágenes olfativas"
        ],
        [
          "tactiles",
          "las imágenes táctiles"
        ],
        [
          "gustativas",
          "las imágenes gustativas"
        ]
      ]
    }
  ]
},fourthGradeLanguagePolicy:'TOPIC_ACTION_EXPLICIT_REQUIREMENTS_V1'}
