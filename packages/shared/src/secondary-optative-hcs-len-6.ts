import type {OptativeLanguageModule} from './secondary-optative-language'

/** HCS6: cinco géneros funcionales con datos dados y finalidades propias, sin experiencias privadas ni envíos reales. */
export const optativeHcsLenSix:OptativeLanguageModule={
  "id": "optativa-hcs-len-6",
  "grade": 6,
  "subjectCode": "OPT-HCS-LEN-6",
  "subjectName": "Análisis y Producción de Textos Científicos y Profesionales",
  "optativeExitName": "Humanidades y Ciencias Sociales",
  "modalityCodes": [
    "academic",
    "general"
  ],
  "sourceScopeId": "bd48332d-4af6-5d2d-a5cf-e3be5591436d",
  "pdfPages": [
    472,
    473,
    474,
    475,
    476,
    477,
    478,
    479,
    480,
    481
  ],
  "topics": [
    {
      "id": "curriculum-vitae",
      "label": "currículum vitae",
      "match": "curricul(?:um|o) vitae|\\bcv\\b",
      "sourceRecordIds": [
        "cf9eb736-c7aa-5835-b3af-8f5a53a045ff"
      ],
      "pdfPages": [
        472,
        473
      ],
      "profile": {
        "genre": "currículum vitae",
        "target": "los datos profesionales y laborales de la ficha ficticia y sus relaciones en el currículum vitae",
        "plan": "los componentes expresamente pedidos y sus relaciones"
      },
      "planningComponents": [
        [
          "intencion",
          "la intención"
        ],
        [
          "destinatario|audiencia",
          "el destinatario"
        ],
        [
          "estructura",
          "la estructura"
        ],
        [
          "informacion|datos",
          "la información pertinente"
        ],
        [
          "fuentes",
          "las fuentes dadas"
        ]
      ],
      "features": [
        {
          "id": "structure",
          "match": "\\bfuncion(?:es)?\\b|\\bestructura\\b",
          "name": "la función y la estructura solicitadas",
          "function": "relacionar la organización de las partes con la intención comunicativa del texto",
          "error": "se atribuye a una parte una función incompatible con el texto",
          "sourceRecordIds": [
            "cf9eb736-c7aa-5835-b3af-8f5a53a045ff"
          ],
          "terms": [
            [
              "funcion",
              "la función"
            ],
            [
              "estructura",
              "la estructura"
            ]
          ]
        },
        {
          "id": "characteristics",
          "match": "caracteristicas",
          "name": "las características señaladas",
          "function": "relacionar los rasgos observables indicados con el propósito del texto dado",
          "error": "se atribuye al texto una característica ausente o incompatible con el pasaje",
          "sourceRecordIds": [
            "313d9ef8-1181-58aa-8fa1-3ecb1274b3ff"
          ]
        },
        {
          "id": "data-selection",
          "match": "criterios de (?:seleccion de la )?informacion|\\bpertinencia (?:de (?:los )?datos|de la informacion)\\b|^(?:registr|seleccion)[a-z]*[^.;]*(?:datos|informacion)",
          "name": "la información pertinente solicitada",
          "function": "seleccionar y registrar datos compatibles con la ficha y la finalidad dadas, sin añadir información privada",
          "error": "se incluye un dato no proporcionado o incompatible con el referente",
          "sourceRecordIds": [
            "51657e7e-5343-5d42-bacd-0ad5ec7804a6",
            "5364b003-9246-522a-9cf5-54e63fb56361",
            "64ee753e-6b15-5afd-ba1a-90ffd8731f01"
          ]
        },
        {
          "id": "nominalization",
          "match": "nominali",
          "name": "las frases nominalizadas",
          "function": "expresar la información mediante grupos nominales que conservan la acción o capacidad de la ficha",
          "error": "la nominalización cambia la acción o su referente",
          "sourceRecordIds": [
            "2392551d-1a4d-5189-acaf-65f5ffa5cee4",
            "c1e97d2e-4421-5078-9883-115698fa946a"
          ]
        },
        {
          "id": "nouns",
          "match": "sustantiv",
          "name": "los sustantivos solicitados",
          "function": "identificar las entidades o conceptos a los que se refiere la información",
          "error": "se nombra una entidad distinta de la indicada por el referente",
          "sourceRecordIds": [
            "1fa8ed4d-bba5-5672-9ce2-e02384328e8a"
          ]
        },
        {
          "id": "adjectives",
          "match": "adjetiv",
          "name": "los adjetivos solicitados",
          "function": "precisar los rasgos de la información según el referente proporcionado",
          "error": "el adjetivo atribuye un rasgo incompatible con el referente dado",
          "sourceRecordIds": [
            "cb7bb87d-ff41-5ed6-8ac8-80908985e5e8"
          ]
        },
        {
          "id": "infinitive",
          "match": "infinitiv",
          "name": "los verbos en infinitivo",
          "function": "expresar las acciones o capacidades de la ficha en la forma solicitada",
          "error": "la forma verbal atribuye una acción distinta al referente dado",
          "sourceRecordIds": [
            "92043058-8deb-5607-8114-d31acf1cf6a5",
            "c1e97d2e-4421-5078-9883-115698fa946a"
          ]
        },
        {
          "id": "data-order",
          "match": "cronologic|funcional|orden de (?:los )?datos",
          "name": "el orden de datos solicitado",
          "function": "organizar los datos según el criterio elegido y permitir localizarlos sin invertir sus referencias",
          "error": "el orden atribuye una fecha o función a un dato distinto",
          "sourceRecordIds": [
            "27f62b06-70a8-59a6-aed8-8f6160a72221",
            "64ee753e-6b15-5afd-ba1a-90ffd8731f01"
          ],
          "terms": [
            [
              "cronologico inverso",
              "el orden cronológico inverso"
            ],
            [
              "cronologico(?! inverso)",
              "el orden cronológico"
            ],
            [
              "funcional",
              "el orden funcional"
            ]
          ]
        },
        {
          "id": "paratext",
          "match": "subtitulos|vinetas|enumeraciones|negritas|cursivas|fotograf",
          "name": "los recursos paratextuales solicitados",
          "function": "permitir localizar los datos mediante las marcas elegidas",
          "error": "la marca relaciona un dato con una sección que no le corresponde",
          "sourceRecordIds": [
            "64ee753e-6b15-5afd-ba1a-90ffd8731f01"
          ],
          "terms": [
            [
              "subtitulos",
              "los subtítulos"
            ],
            [
              "vinetas",
              "las viñetas"
            ],
            [
              "enumeraciones",
              "las enumeraciones"
            ],
            [
              "negritas",
              "las negritas"
            ],
            [
              "cursivas",
              "las cursivas"
            ],
            [
              "fotograf",
              "la fotografía proporcionada"
            ]
          ]
        },
        {
          "id": "provided-support",
          "match": "certificados|diplomas|constancias|soportes",
          "name": "los soportes proporcionados solicitados",
          "function": "relacionar los datos del personaje con los documentos ficticios disponibles",
          "error": "el soporte no corresponde al dato que pretende respaldar",
          "sourceRecordIds": [
            "64ee753e-6b15-5afd-ba1a-90ffd8731f01"
          ]
        },
        {
          "id": "professional-vocabulary",
          "match": "vocabulario|lexico|palabras desconocidas",
          "name": "el vocabulario temático solicitado",
          "function": "conservar el significado de la información para el destinatario y la intención dados",
          "error": "una palabra cambia el significado de un dato o una relación del texto",
          "sourceRecordIds": [
            "27f62b06-70a8-59a6-aed8-8f6160a72221"
          ]
        },
        {
          "id": "register",
          "match": "registro formal|registro adecuado|registro apropiado",
          "name": "el registro formal solicitado",
          "function": "hacer comprensible la información en la situación comunicativa y ante el destinatario dados",
          "error": "el registro cambia la relación comunicativa o vuelve ambigua la petición",
          "sourceRecordIds": [
            "a968b983-b2c7-5e35-8dfc-417efc6d5208"
          ]
        },
        {
          "id": "punctuation",
          "match": "puntuacion|\\bcoma\\b|tildes",
          "name": "las convenciones de escritura solicitadas",
          "function": "delimitar las ideas y conservar el significado mediante los signos o tildes expresamente pedidos",
          "error": "un signo o tilde cambia el sentido de una afirmación",
          "sourceRecordIds": [
            "c1e97d2e-4421-5078-9883-115698fa946a"
          ],
          "terms": [
            [
              "puntuacion",
              "la puntuación solicitada"
            ],
            [
              "\\bcoma\\b",
              "la coma de la frase aclaratoria"
            ],
            [
              "tildes",
              "las tildes solicitadas"
            ]
          ]
        },
        {
          "id": "medium",
          "match": "soporte (?:fisico|digital)|fisico|digital",
          "name": "el soporte solicitado",
          "function": "disponer el texto legible y consultable en el medio elegido",
          "error": "el soporte impide consultar una parte necesaria del texto",
          "sourceRecordIds": [
            "c1e97d2e-4421-5078-9883-115698fa946a"
          ],
          "terms": [
            [
              "fisico",
              "el soporte físico"
            ],
            [
              "digital",
              "el soporte digital"
            ]
          ]
        },
        {
          "id": "communication-context",
          "match": "^(?:infier|analiz|identific|explic)[a-z]*\\s+(?:oralmente\\s+)?(?:unicamente\\s+)?(?:(?:la|el|los|las|su|sus)\\s+)?(?:intencion|destinatario|audiencia|canal|elementos de la situacion comunicativa|situacion comunicativa)",
          "name": "los elementos de la situación comunicativa solicitados",
          "function": "relacionar la intención, destinatario o canal pedidos con las marcas del texto",
          "error": "se atribuye al texto un destinatario o canal incompatible con sus referencias",
          "sourceRecordIds": [
            "12edf961-1228-5cdc-98b0-0301f121be84"
          ],
          "terms": [
            [
              "destinatario",
              "el destinatario"
            ],
            [
              "audiencia",
              "la audiencia"
            ],
            [
              "canal",
              "el canal"
            ],
            [
              "intencion",
              "la intención comunicativa"
            ]
          ]
        },
        {
          "id": "effectiveness",
          "match": "eficacia",
          "name": "la eficacia de la información",
          "function": "relacionar los datos del texto con su intención y referentes disponibles",
          "error": "se atribuye pertinencia a un dato incompatible con el propósito comunicado",
          "sourceRecordIds": [
            "601fe017-08f0-5f45-9c90-9788aeb6839c"
          ]
        }
      ],
      "dimensions": [
        {
          "id": "meaning",
          "title": "Intención y destinatario",
          "production": "Hace reconocible la intención del currículum vitae para el destinatario indicado mediante la información dada.",
          "analysis": "Explica la intención y el destinatario del currículum vitae con marcas de la información proporcionada.",
          "comparison": "Compara la intención y los destinatarios de los textos del currículum vitae mediante sus referencias.",
          "evidence": [
            "La intención y el destinatario se reconocen; una referencia necesita precisarse.",
            "Menciona intención y destinatario sin mostrar su relación con la información.",
            "Atribuye al texto una intención o destinatario incompatibles con sus referencias.",
            "No presenta una intención o un destinatario reconocibles en la evidencia solicitada."
          ],
          "weight": 4
        },
        {
          "id": "data",
          "title": "Datos y pertinencia",
          "production": "Selecciona los datos profesionales solicitados de la ficha ficticia y conserva sus referencias para el propósito del currículum vitae.",
          "analysis": "Explica la pertinencia de los datos del currículum vitae mediante el propósito comunicado y los referentes disponibles.",
          "comparison": "Contrasta los datos de los currículums vitae con los referentes proporcionados, sin atribuir méritos personales ajenos.",
          "evidence": [
            "Los datos corresponden a la ficha; una relación con el propósito necesita aclararse.",
            "Enumera datos sin mostrar su pertinencia para el propósito comunicado.",
            "Atribuye al personaje un dato incompatible con la ficha proporcionada.",
            "No aporta datos reconocibles y pertinentes de la ficha en la evidencia solicitada."
          ],
          "weight": 4
        },
        {
          "id": "organization",
          "title": "Organización de la información",
          "production": "Organiza la información del currículum vitae de modo que puedan localizarse las partes solicitadas y seguirse sus relaciones.",
          "analysis": "Explica cómo se organizan las partes del currículum vitae y cómo permiten localizar y relacionar la información.",
          "comparison": "Compara la organización de los textos del currículum vitae conservando qué información aporta cada parte.",
          "evidence": [
            "Las partes permiten localizar y relacionar la información; una conexión necesita aclararse.",
            "Presenta partes o datos aislados sin organizar una relación necesaria para consultarlos.",
            "La organización mezcla referencias de partes distintas y cambia el sentido de la información.",
            "No permite reconocer la organización solicitada de la información."
          ],
          "weight": 4
        }
      ]
    },
    {
      "id": "solicitud-beca",
      "label": "solicitud de beca",
      "match": "solicitud(?:es)? de beca",
      "sourceRecordIds": [
        "8bcff4e3-d54c-5793-b135-7c59e3d6b90d"
      ],
      "pdfPages": [
        473,
        474,
        475
      ],
      "profile": {
        "genre": "solicitud de beca",
        "target": "la petición y las razones de la solicitud de beca del personaje ficticio",
        "plan": "los componentes expresamente pedidos y sus relaciones"
      },
      "planningComponents": [
        [
          "intencion",
          "la intención"
        ],
        [
          "destinatario|audiencia",
          "el destinatario"
        ],
        [
          "argumentos|razones|motivos",
          "las razones de la petición"
        ],
        [
          "estructura",
          "la estructura"
        ],
        [
          "informacion|datos",
          "la información pertinente"
        ]
      ],
      "features": [
        {
          "id": "structure",
          "match": "\\bfuncion(?:es)?\\b|\\bestructura\\b",
          "name": "la función y la estructura solicitadas",
          "function": "relacionar la organización de las partes con la intención comunicativa del texto",
          "error": "se atribuye a una parte una función incompatible con el texto",
          "sourceRecordIds": [
            "8bcff4e3-d54c-5793-b135-7c59e3d6b90d"
          ],
          "terms": [
            [
              "funcion",
              "la función"
            ],
            [
              "estructura",
              "la estructura"
            ]
          ]
        },
        {
          "id": "courtesy",
          "match": "cortesia",
          "name": "las fórmulas de cortesía solicitadas",
          "function": "ajustar la petición y sus referencias al destinatario y situación dados",
          "error": "la fórmula corresponde a otra relación con el destinatario o cambia el sentido de la petición",
          "sourceRecordIds": [
            "5feb23c7-2ccf-5b6f-a0be-ef19cfbd1ce4"
          ]
        },
        {
          "id": "verb-forms",
          "match": "verbos?|presente|preterito|indicativo|persona singular|impersonal|potencial",
          "name": "las formas verbales solicitadas",
          "function": "distinguir persona, tiempo o modalidad según la información del texto",
          "error": "la forma verbal cambia quién realiza la acción, cuándo sucede o su grado de posibilidad",
          "sourceRecordIds": [
            "f4b176ac-7a4c-5273-90f3-a751725537f2",
            "d2a9d29d-8fc0-5358-a9f2-5efb5be6fffa"
          ],
          "terms": [
            [
              "presente",
              "el presente del indicativo"
            ],
            [
              "primera persona singular",
              "la primera persona singular"
            ],
            [
              "preterito perfecto",
              "el pretérito perfecto"
            ],
            [
              "modo potencial|potencial",
              "el modo potencial"
            ]
          ]
        },
        {
          "id": "adjectives",
          "match": "adjetiv",
          "name": "los adjetivos solicitados",
          "function": "precisar los rasgos de la información según el referente proporcionado",
          "error": "el adjetivo atribuye un rasgo incompatible con el referente dado",
          "sourceRecordIds": [
            "a31888a7-16bb-505e-9be5-859e8e863eff"
          ]
        },
        {
          "id": "connectors",
          "match": "conectores?",
          "name": "los conectores solicitados",
          "function": "hacer explícita la relación lógica pedida entre las ideas",
          "error": "el conector invierte o contradice la relación entre las ideas",
          "sourceRecordIds": [
            "73860dc2-0be9-58cd-9681-d82fd916e160"
          ],
          "terms": [
            [
              "finalidad",
              "los conectores de finalidad"
            ],
            [
              "causa.?efecto|causales",
              "los conectores de causa-efecto"
            ],
            [
              "adicion",
              "los conectores de adición"
            ]
          ]
        },
        {
          "id": "professional-vocabulary",
          "match": "vocabulario|lexico|palabras desconocidas",
          "name": "el vocabulario temático solicitado",
          "function": "conservar el significado de la información para el destinatario y la intención dados",
          "error": "una palabra cambia el significado de un dato o una relación del texto",
          "sourceRecordIds": [
            "ee8e538e-8384-569e-895b-566b3e353706"
          ]
        },
        {
          "id": "arguments",
          "match": "^(?!parafras|resum)[\\s\\S]*(?:\\bargumentos?\\b|razones|motivos)",
          "name": "los argumentos solicitados",
          "function": "relacionar la petición con los hechos o razones dados sin añadir méritos del personaje",
          "error": "la razón atribuida contradice los datos proporcionados o no sustenta la petición",
          "sourceRecordIds": [
            "b865de4c-0694-5d14-9bca-c69ce4abaf57",
            "39be5f9b-8ff9-522e-8133-5a49c8d6fcc9",
            "6e269866-28e1-53cc-97f6-9965e9bd528a",
            "9538c280-72c3-5fbb-bc17-797e6c7dfe00"
          ],
          "terms": [
            [
              "causales",
              "los argumentos causales"
            ],
            [
              "(?:de )?hechos",
              "los argumentos de hechos"
            ],
            [
              "motivos",
              "los motivos de la solicitud"
            ],
            [
              "razones",
              "las razones de la solicitud"
            ]
          ]
        },
        {
          "id": "data-selection",
          "match": "criterios de (?:seleccion de la )?informacion|\\bpertinencia (?:de (?:los )?datos|de la informacion)\\b|^(?:registr|seleccion)[a-z]*[^.;]*(?:datos|informacion)",
          "name": "la información pertinente solicitada",
          "function": "seleccionar y registrar datos compatibles con la ficha y la finalidad dadas, sin añadir información privada",
          "error": "se incluye un dato no proporcionado o incompatible con el referente",
          "sourceRecordIds": [
            "9538c280-72c3-5fbb-bc17-797e6c7dfe00"
          ]
        },
        {
          "id": "brevity",
          "match": "brevedad|breves?|credibilidad",
          "name": "la brevedad y la credibilidad textuales solicitadas",
          "function": "mantener las razones pertinentes sin repeticiones ni afirmaciones incompatibles con los datos dados",
          "error": "una afirmación contradice los referentes o la repetición oculta la razón de la petición",
          "sourceRecordIds": [
            "b16b8326-d622-5549-b782-1004cd88206b",
            "9538c280-72c3-5fbb-bc17-797e6c7dfe00"
          ],
          "terms": [
            [
              "brevedad|breves?",
              "la brevedad"
            ],
            [
              "credibilidad",
              "la credibilidad textual"
            ]
          ]
        },
        {
          "id": "communication-context",
          "match": "^(?:infier|analiz|identific|explic)[a-z]*\\s+(?:oralmente\\s+)?(?:unicamente\\s+)?(?:(?:la|el|los|las|su|sus)\\s+)?(?:intencion|destinatario|audiencia|canal|elementos de la situacion comunicativa|situacion comunicativa)",
          "name": "los elementos de la situación comunicativa solicitados",
          "function": "relacionar la intención, destinatario o canal pedidos con las marcas del texto",
          "error": "se atribuye al texto un destinatario o canal incompatible con sus referencias",
          "sourceRecordIds": [
            "4bdea78a-b4d1-53ce-9dd2-e1adaba41044"
          ],
          "terms": [
            [
              "destinatario",
              "el destinatario"
            ],
            [
              "audiencia",
              "la audiencia"
            ],
            [
              "canal",
              "el canal"
            ],
            [
              "intencion",
              "la intención comunicativa"
            ]
          ]
        },
        {
          "id": "register",
          "match": "registro formal|registro adecuado|registro apropiado",
          "name": "el registro formal solicitado",
          "function": "hacer comprensible la información en la situación comunicativa y ante el destinatario dados",
          "error": "el registro cambia la relación comunicativa o vuelve ambigua la petición",
          "sourceRecordIds": [
            "e928c75a-e89e-5e52-9c1e-f8e9d7c58001"
          ]
        },
        {
          "id": "medium",
          "match": "soporte (?:fisico|digital)|fisico|digital",
          "name": "el soporte solicitado",
          "function": "disponer el texto legible y consultable en el medio elegido",
          "error": "el soporte impide consultar una parte necesaria del texto",
          "sourceRecordIds": [
            "c900a52b-b525-5754-9525-713f92532c37"
          ],
          "terms": [
            [
              "fisico",
              "el soporte físico"
            ],
            [
              "digital",
              "el soporte digital"
            ]
          ]
        },
        {
          "id": "punctuation",
          "match": "puntuacion|\\bcoma\\b|tildes",
          "name": "las convenciones de escritura solicitadas",
          "function": "delimitar las ideas y conservar el significado mediante los signos o tildes expresamente pedidos",
          "error": "un signo o tilde cambia el sentido de una afirmación",
          "sourceRecordIds": [
            "9538c280-72c3-5fbb-bc17-797e6c7dfe00"
          ],
          "terms": [
            [
              "puntuacion",
              "la puntuación solicitada"
            ],
            [
              "\\bcoma\\b",
              "la coma de la frase aclaratoria"
            ],
            [
              "tildes",
              "las tildes solicitadas"
            ]
          ]
        }
      ],
      "dimensions": [
        {
          "id": "meaning",
          "title": "Intención y destinatario",
          "production": "Hace reconocible la intención de la solicitud de beca para el destinatario indicado mediante la información dada.",
          "analysis": "Explica la intención y el destinatario de la solicitud de beca con marcas de la información proporcionada.",
          "comparison": "Compara la intención y los destinatarios de los textos de la solicitud de beca mediante sus referencias.",
          "evidence": [
            "La intención y el destinatario se reconocen; una referencia necesita precisarse.",
            "Menciona intención y destinatario sin mostrar su relación con la información.",
            "Atribuye al texto una intención o destinatario incompatibles con sus referencias.",
            "No presenta una intención o un destinatario reconocibles en la evidencia solicitada."
          ],
          "weight": 4
        },
        {
          "id": "reasons",
          "title": "Petición y razones pertinentes",
          "production": "Relaciona la petición de la solicitud de beca con razones pertinentes a los requisitos y datos ficticios proporcionados.",
          "analysis": "Explica cómo se relacionan la petición y sus razones en la solicitud de beca con los referentes dados.",
          "comparison": "Contrasta la pertinencia de las razones de las solicitudes mediante las referencias proporcionadas.",
          "evidence": [
            "La petición tiene razones pertinentes; una relación con el referente necesita precisarse.",
            "Enumera motivos y datos sin mostrar cómo sustentan la petición.",
            "Una razón contradice los datos proporcionados o no corresponde a la petición.",
            "No presenta una relación reconocible entre la petición y razones pertinentes."
          ],
          "weight": 4
        },
        {
          "id": "organization",
          "title": "Organización de la información",
          "production": "Organiza la información de la solicitud de beca de modo que puedan localizarse las partes solicitadas y seguirse sus relaciones.",
          "analysis": "Explica cómo se organizan las partes de la solicitud de beca y cómo permiten localizar y relacionar la información.",
          "comparison": "Compara la organización de los textos de la solicitud de beca conservando qué información aporta cada parte.",
          "evidence": [
            "Las partes permiten localizar y relacionar la información; una conexión necesita aclararse.",
            "Presenta partes o datos aislados sin organizar una relación necesaria para consultarlos.",
            "La organización mezcla referencias de partes distintas y cambia el sentido de la información.",
            "No permite reconocer la organización solicitada de la información."
          ],
          "weight": 4
        }
      ]
    },
    {
      "id": "solicitud-empleo",
      "label": "solicitud de empleo",
      "match": "solicitud(?:es)? de empleo",
      "sourceRecordIds": [
        "4ce7d5fd-7076-5021-ad95-3f7b84cd4d91"
      ],
      "pdfPages": [
        475,
        476
      ],
      "profile": {
        "genre": "solicitud de empleo",
        "target": "la petición y las razones de la solicitud de empleo del personaje ficticio",
        "plan": "los componentes expresamente pedidos y sus relaciones"
      },
      "planningComponents": [
        [
          "intencion",
          "la intención"
        ],
        [
          "destinatario|audiencia",
          "el destinatario"
        ],
        [
          "argumentos|razones|motivos",
          "las razones de la petición"
        ],
        [
          "estructura",
          "la estructura"
        ],
        [
          "informacion|datos",
          "la información pertinente"
        ]
      ],
      "features": [
        {
          "id": "structure",
          "match": "\\bfuncion(?:es)?\\b|\\bestructura\\b",
          "name": "la función y la estructura solicitadas",
          "function": "relacionar la organización de las partes con la intención comunicativa del texto",
          "error": "se atribuye a una parte una función incompatible con el texto",
          "sourceRecordIds": [
            "4ce7d5fd-7076-5021-ad95-3f7b84cd4d91"
          ],
          "terms": [
            [
              "funcion",
              "la función"
            ],
            [
              "estructura",
              "la estructura"
            ]
          ]
        },
        {
          "id": "courtesy",
          "match": "cortesia",
          "name": "las fórmulas de cortesía solicitadas",
          "function": "ajustar la petición y sus referencias al destinatario y situación dados",
          "error": "la fórmula corresponde a otra relación con el destinatario o cambia el sentido de la petición",
          "sourceRecordIds": [
            "9c85d949-000e-5187-b9f5-39e938d1a74d"
          ]
        },
        {
          "id": "verb-forms",
          "match": "verbos?|presente|preterito|indicativo|persona singular|impersonal|potencial",
          "name": "las formas verbales solicitadas",
          "function": "distinguir persona, tiempo o modalidad según la información del texto",
          "error": "la forma verbal cambia quién realiza la acción, cuándo sucede o su grado de posibilidad",
          "sourceRecordIds": [
            "51293eb4-e2e8-5d19-a192-83c91eedd5da",
            "0a1919fd-6a7d-5dfd-b4d7-d782694a6eeb",
            "e62eee8d-ba9b-5013-a344-e1f46b96f633"
          ],
          "terms": [
            [
              "presente",
              "el presente del indicativo"
            ],
            [
              "primera persona singular",
              "la primera persona singular"
            ],
            [
              "preterito perfecto",
              "el pretérito perfecto"
            ],
            [
              "modo potencial|potencial",
              "el modo potencial"
            ]
          ]
        },
        {
          "id": "adjectives",
          "match": "adjetiv",
          "name": "los adjetivos solicitados",
          "function": "precisar los rasgos de la información según el referente proporcionado",
          "error": "el adjetivo atribuye un rasgo incompatible con el referente dado",
          "sourceRecordIds": [
            "e0750060-5970-5a77-a082-cfa56a9333c0"
          ]
        },
        {
          "id": "connectors",
          "match": "conectores?",
          "name": "los conectores solicitados",
          "function": "hacer explícita la relación lógica pedida entre las ideas",
          "error": "el conector invierte o contradice la relación entre las ideas",
          "sourceRecordIds": [
            "8623d242-2164-5f0b-b50c-5b3556e9c2d6"
          ],
          "terms": [
            [
              "finalidad",
              "los conectores de finalidad"
            ],
            [
              "causa.?efecto|causales",
              "los conectores de causa-efecto"
            ],
            [
              "adicion",
              "los conectores de adición"
            ]
          ]
        },
        {
          "id": "professional-vocabulary",
          "match": "vocabulario|lexico|palabras desconocidas",
          "name": "el vocabulario temático solicitado",
          "function": "conservar el significado de la información para el destinatario y la intención dados",
          "error": "una palabra cambia el significado de un dato o una relación del texto",
          "sourceRecordIds": [
            "01935b9e-1557-5db2-913e-b769c6ef7d11"
          ]
        },
        {
          "id": "arguments",
          "match": "^(?!parafras|resum)[\\s\\S]*(?:\\bargumentos?\\b|razones|motivos)",
          "name": "los argumentos solicitados",
          "function": "relacionar la petición con los hechos o razones dados sin añadir méritos del personaje",
          "error": "la razón atribuida contradice los datos proporcionados o no sustenta la petición",
          "sourceRecordIds": [
            "7e595764-c632-5fc0-85ee-ca0b440cc6db",
            "88d4e01f-d4ee-5571-b448-1d6ab3dcd52c",
            "0b6eb3a5-5b09-5280-8347-c845385f6768"
          ],
          "terms": [
            [
              "causales",
              "los argumentos causales"
            ],
            [
              "(?:de )?hechos",
              "los argumentos de hechos"
            ],
            [
              "motivos",
              "los motivos de la solicitud"
            ],
            [
              "razones",
              "las razones de la solicitud"
            ]
          ]
        },
        {
          "id": "data-selection",
          "match": "criterios de (?:seleccion de la )?informacion|\\bpertinencia (?:de (?:los )?datos|de la informacion)\\b|^(?:registr|seleccion)[a-z]*[^.;]*(?:datos|informacion)",
          "name": "la información pertinente solicitada",
          "function": "seleccionar y registrar datos compatibles con la ficha y la finalidad dadas, sin añadir información privada",
          "error": "se incluye un dato no proporcionado o incompatible con el referente",
          "sourceRecordIds": [
            "89c9eb30-141e-5e43-a504-9d5dd0ee62cd"
          ]
        },
        {
          "id": "brevity",
          "match": "brevedad|breves?|credibilidad",
          "name": "la brevedad y la credibilidad textuales solicitadas",
          "function": "mantener las razones pertinentes sin repeticiones ni afirmaciones incompatibles con los datos dados",
          "error": "una afirmación contradice los referentes o la repetición oculta la razón de la petición",
          "sourceRecordIds": [
            "0b6eb3a5-5b09-5280-8347-c845385f6768",
            "22626dba-e328-5088-9435-0666b9bdeb6a"
          ],
          "terms": [
            [
              "brevedad|breves?",
              "la brevedad"
            ],
            [
              "credibilidad",
              "la credibilidad textual"
            ]
          ]
        },
        {
          "id": "communication-context",
          "match": "^(?:infier|analiz|identific|explic)[a-z]*\\s+(?:oralmente\\s+)?(?:unicamente\\s+)?(?:(?:la|el|los|las|su|sus)\\s+)?(?:intencion|destinatario|audiencia|canal|elementos de la situacion comunicativa|situacion comunicativa)",
          "name": "los elementos de la situación comunicativa solicitados",
          "function": "relacionar la intención, destinatario o canal pedidos con las marcas del texto",
          "error": "se atribuye al texto un destinatario o canal incompatible con sus referencias",
          "sourceRecordIds": [
            "8f906960-d095-5b96-957c-0c69f28b2f56"
          ],
          "terms": [
            [
              "destinatario",
              "el destinatario"
            ],
            [
              "audiencia",
              "la audiencia"
            ],
            [
              "canal",
              "el canal"
            ],
            [
              "intencion",
              "la intención comunicativa"
            ]
          ]
        },
        {
          "id": "register",
          "match": "registro formal|registro adecuado|registro apropiado",
          "name": "el registro formal solicitado",
          "function": "hacer comprensible la información en la situación comunicativa y ante el destinatario dados",
          "error": "el registro cambia la relación comunicativa o vuelve ambigua la petición",
          "sourceRecordIds": [
            "8fc09837-32c3-555a-8447-ae240027ab9b"
          ]
        },
        {
          "id": "medium",
          "match": "soporte (?:fisico|digital)|fisico|digital",
          "name": "el soporte solicitado",
          "function": "disponer el texto legible y consultable en el medio elegido",
          "error": "el soporte impide consultar una parte necesaria del texto",
          "sourceRecordIds": [
            "bef2fc52-b708-53f9-903d-7fa75b0024a7"
          ],
          "terms": [
            [
              "fisico",
              "el soporte físico"
            ],
            [
              "digital",
              "el soporte digital"
            ]
          ]
        },
        {
          "id": "punctuation",
          "match": "puntuacion|\\bcoma\\b|tildes",
          "name": "las convenciones de escritura solicitadas",
          "function": "delimitar las ideas y conservar el significado mediante los signos o tildes expresamente pedidos",
          "error": "un signo o tilde cambia el sentido de una afirmación",
          "sourceRecordIds": [
            "0b6eb3a5-5b09-5280-8347-c845385f6768"
          ],
          "terms": [
            [
              "puntuacion",
              "la puntuación solicitada"
            ],
            [
              "\\bcoma\\b",
              "la coma de la frase aclaratoria"
            ],
            [
              "tildes",
              "las tildes solicitadas"
            ]
          ]
        }
      ],
      "dimensions": [
        {
          "id": "meaning",
          "title": "Intención y destinatario",
          "production": "Hace reconocible la intención de la solicitud de empleo para el destinatario indicado mediante la información dada.",
          "analysis": "Explica la intención y el destinatario de la solicitud de empleo con marcas de la información proporcionada.",
          "comparison": "Compara la intención y los destinatarios de los textos de la solicitud de empleo mediante sus referencias.",
          "evidence": [
            "La intención y el destinatario se reconocen; una referencia necesita precisarse.",
            "Menciona intención y destinatario sin mostrar su relación con la información.",
            "Atribuye al texto una intención o destinatario incompatibles con sus referencias.",
            "No presenta una intención o un destinatario reconocibles en la evidencia solicitada."
          ],
          "weight": 4
        },
        {
          "id": "reasons",
          "title": "Petición y razones pertinentes",
          "production": "Relaciona la petición de la solicitud de empleo con razones pertinentes a los requisitos y datos ficticios proporcionados.",
          "analysis": "Explica cómo se relacionan la petición y sus razones en la solicitud de empleo con los referentes dados.",
          "comparison": "Contrasta la pertinencia de las razones de las solicitudes mediante las referencias proporcionadas.",
          "evidence": [
            "La petición tiene razones pertinentes; una relación con el referente necesita precisarse.",
            "Enumera motivos y datos sin mostrar cómo sustentan la petición.",
            "Una razón contradice los datos proporcionados o no corresponde a la petición.",
            "No presenta una relación reconocible entre la petición y razones pertinentes."
          ],
          "weight": 4
        },
        {
          "id": "organization",
          "title": "Organización de la información",
          "production": "Organiza la información de la solicitud de empleo de modo que puedan localizarse las partes solicitadas y seguirse sus relaciones.",
          "analysis": "Explica cómo se organizan las partes de la solicitud de empleo y cómo permiten localizar y relacionar la información.",
          "comparison": "Compara la organización de los textos de la solicitud de empleo conservando qué información aporta cada parte.",
          "evidence": [
            "Las partes permiten localizar y relacionar la información; una conexión necesita aclararse.",
            "Presenta partes o datos aislados sin organizar una relación necesaria para consultarlos.",
            "La organización mezcla referencias de partes distintas y cambia el sentido de la información.",
            "No permite reconocer la organización solicitada de la información."
          ],
          "weight": 4
        }
      ]
    },
    {
      "id": "poster-cientifico",
      "label": "póster científico",
      "match": "poster(?:es)? cientific",
      "sourceRecordIds": [
        "805fe5d7-f8cb-59bc-8bda-5523c73f6943"
      ],
      "pdfPages": [
        476,
        477,
        478
      ],
      "profile": {
        "genre": "póster científico",
        "target": "el contenido y las relaciones de la información proporcionada en el póster científico",
        "plan": "los componentes expresamente pedidos y sus relaciones"
      },
      "planningComponents": [
        [
          "intencion",
          "la intención"
        ],
        [
          "destinatario|audiencia",
          "el destinatario"
        ],
        [
          "informacion|datos",
          "la información pertinente"
        ],
        [
          "organizacion|estructura",
          "la organización"
        ]
      ],
      "features": [
        {
          "id": "structure",
          "match": "\\bfuncion(?:es)?\\b|\\bestructura\\b",
          "name": "la función y la estructura solicitadas",
          "function": "relacionar la organización de las partes con la intención comunicativa del texto",
          "error": "se atribuye a una parte una función incompatible con el texto",
          "sourceRecordIds": [
            "805fe5d7-f8cb-59bc-8bda-5523c73f6943"
          ],
          "terms": [
            [
              "funcion",
              "la función"
            ],
            [
              "estructura",
              "la estructura"
            ]
          ]
        },
        {
          "id": "characteristics",
          "match": "caracteristicas",
          "name": "las características señaladas",
          "function": "relacionar los rasgos observables indicados con el propósito del texto dado",
          "error": "se atribuye al texto una característica ausente o incompatible con el pasaje",
          "sourceRecordIds": [
            "4b56a3d6-4c08-5e49-ae61-68c025fc35c2"
          ]
        },
        {
          "id": "verb-forms",
          "match": "verbos?|presente|preterito|indicativo|persona singular|impersonal|potencial",
          "name": "las formas verbales solicitadas",
          "function": "distinguir persona, tiempo o modalidad según la información del texto",
          "error": "la forma verbal cambia quién realiza la acción, cuándo sucede o su grado de posibilidad",
          "sourceRecordIds": [
            "f1323472-d24d-5907-b51f-e348bc902e39"
          ],
          "terms": [
            [
              "impersonal",
              "las formas impersonales del verbo"
            ],
            [
              "preterito indefinido",
              "el pretérito indefinido"
            ],
            [
              "presente",
              "el presente del indicativo"
            ]
          ]
        },
        {
          "id": "register",
          "match": "registro formal|registro adecuado|registro apropiado",
          "name": "el registro formal solicitado",
          "function": "hacer comprensible la información en la situación comunicativa y ante el destinatario dados",
          "error": "el registro cambia la relación comunicativa o vuelve ambigua la petición",
          "sourceRecordIds": [
            "eb062266-dfb6-5a3a-8273-dcbf97ab15a9"
          ]
        },
        {
          "id": "professional-vocabulary",
          "match": "vocabulario|lexico|palabras desconocidas",
          "name": "el vocabulario temático solicitado",
          "function": "conservar el significado de la información para el destinatario y la intención dados",
          "error": "una palabra cambia el significado de un dato o una relación del texto",
          "sourceRecordIds": [
            "ff9699c1-f414-53c4-b87c-a3e9bd483fe5"
          ]
        },
        {
          "id": "nouns",
          "match": "sustantiv",
          "name": "los sustantivos solicitados",
          "function": "identificar las entidades o conceptos a los que se refiere la información",
          "error": "se nombra una entidad distinta de la indicada por el referente",
          "sourceRecordIds": [
            "267ff1ac-88c2-5f46-8bef-dd159268be74"
          ]
        },
        {
          "id": "adverbs",
          "match": "adverbios",
          "name": "los adverbios solicitados",
          "function": "precisar frecuencia, cantidad o modo de la información expresada en el texto",
          "error": "el adverbio altera una cantidad o relación expresada por los datos",
          "sourceRecordIds": [
            "5a160896-abf2-5e64-9319-118972bda629"
          ],
          "terms": [
            [
              "frecuencia",
              "los adverbios de frecuencia"
            ],
            [
              "cantidad",
              "los adverbios de cantidad"
            ],
            [
              "modo",
              "los adverbios de modo"
            ]
          ]
        },
        {
          "id": "data-selection",
          "match": "criterios de (?:seleccion de la )?informacion|\\bpertinencia (?:de (?:los )?datos|de la informacion)\\b|^(?:registr|seleccion)[a-z]*[^.;]*(?:datos|informacion)",
          "name": "la información pertinente solicitada",
          "function": "seleccionar y registrar datos compatibles con la ficha y la finalidad dadas, sin añadir información privada",
          "error": "se incluye un dato no proporcionado o incompatible con el referente",
          "sourceRecordIds": [
            "45261e9d-23ee-55d0-8ee5-03bb540b3e18",
            "618045b4-5b75-5daf-9fb7-86712887b8c9"
          ]
        },
        {
          "id": "communication-context",
          "match": "^(?:infier|analiz|identific|explic)[a-z]*\\s+(?:oralmente\\s+)?(?:unicamente\\s+)?(?:(?:la|el|los|las|su|sus)\\s+)?(?:intencion|destinatario|audiencia|canal|elementos de la situacion comunicativa|situacion comunicativa)",
          "name": "los elementos de la situación comunicativa solicitados",
          "function": "relacionar la intención, destinatario o canal pedidos con las marcas del texto",
          "error": "se atribuye al texto un destinatario o canal incompatible con sus referencias",
          "sourceRecordIds": [
            "45261e9d-23ee-55d0-8ee5-03bb540b3e18"
          ],
          "terms": [
            [
              "destinatario",
              "el destinatario"
            ],
            [
              "audiencia",
              "la audiencia"
            ],
            [
              "canal",
              "el canal"
            ],
            [
              "intencion",
              "la intención comunicativa"
            ]
          ]
        },
        {
          "id": "logical-relations",
          "match": "^(?!parafras|resum)[\\s\\S]*(?:relaciones logicas|relaciones entre las ideas|organizacion logica|organiza)",
          "name": "las relaciones lógicas de la información",
          "function": "enlazar las ideas conservando las referencias de los datos disponibles",
          "error": "se establece una relación incompatible con la información del texto",
          "sourceRecordIds": [
            "94b834a9-f96f-5798-a370-1f9dd1f2761b",
            "54427c92-5cb0-5e36-a225-34a54f87c4e5",
            "f6f6c57e-ee41-5d96-b822-04820ba06368"
          ]
        },
        {
          "id": "title",
          "match": "\\btitulo\\b",
          "name": "el título solicitado",
          "function": "identificar el contenido del póster sin atribuirle otro objeto o resultado",
          "error": "el título anuncia un contenido incompatible con el póster",
          "sourceRecordIds": [
            "f4243930-8097-56c5-b39e-6c6c82d82969",
            "f6f6c57e-ee41-5d96-b822-04820ba06368"
          ]
        },
        {
          "id": "graphics",
          "match": "tablas?|figuras?|recursos paratextuales",
          "name": "las representaciones solicitadas",
          "function": "relacionar los datos del texto con la representación elegida manteniendo sus referencias",
          "error": "la representación cambia una magnitud o relación de los datos",
          "sourceRecordIds": [
            "123903b9-6957-5b01-aadf-f9cfc72ce28e",
            "f6f6c57e-ee41-5d96-b822-04820ba06368"
          ],
          "terms": [
            [
              "tabla",
              "la tabla"
            ],
            [
              "figura",
              "la figura"
            ]
          ]
        },
        {
          "id": "additional-resource",
          "match": "hipervinculo|codigo qr|informacion adicional|videos|audios|sitios web",
          "name": "la información adicional solicitada",
          "function": "vincular el recurso proporcionado con la información del póster que complementa",
          "error": "el recurso no corresponde al contenido al que se vincula",
          "sourceRecordIds": [
            "f4243930-8097-56c5-b39e-6c6c82d82969",
            "e5015dab-8936-5c49-8187-ba6722d1aee4"
          ],
          "terms": [
            [
              "hipervinculo",
              "el hipervínculo proporcionado"
            ],
            [
              "codigo qr",
              "el código QR proporcionado"
            ],
            [
              "videos",
              "el vídeo proporcionado"
            ],
            [
              "audios",
              "el audio proporcionado"
            ],
            [
              "sitios web",
              "el sitio web proporcionado"
            ]
          ]
        },
        {
          "id": "rehearsal",
          "match": "ensay[a-z]*.*presentacion|practica.*presentacion|mejoras",
          "name": "las mejoras de la práctica oral",
          "function": "hacer explícitos los cambios de secuencia o claridad solicitados tras la práctica",
          "error": "el cambio introduce una relación incompatible con el contenido que se presenta",
          "sourceRecordIds": [
            "5f114e60-4780-5937-a94e-c7c329fbb9d7"
          ],
          "productionLevels": [
            "Realiza una práctica de la presentación del póster y muestra los cambios de organización o claridad acordados con las sugerencias proporcionadas.",
            "La práctica y los cambios permiten seguir las ideas; una sugerencia dada necesita resolverse.",
            "Ensaya la presentación, pero no muestra cómo los cambios responden a las sugerencias dadas.",
            "Los cambios alteran la información del póster o introducen una relación incompatible con sus datos.",
            "No aporta evidencia de la práctica ni de las mejoras solicitadas."
          ]
        },
        {
          "id": "source-synthesis",
          "match": "fuentes|atribucion|sintet",
          "name": "la síntesis de fuentes proporcionadas",
          "function": "seleccionar y reelaborar la información pertinente conservando su sentido y atribución",
          "error": "se altera el sentido o se atribuye a una fuente una idea ajena",
          "sourceRecordIds": [
            "55a80e9b-3730-5ad7-a687-a6582536f79c"
          ],
          "analysisLevels": [
            "Sintetiza la información pertinente de las fuentes proporcionadas para el póster, conservando su sentido, relaciones y atribución.",
            "La síntesis conserva el sentido y la atribución; una relación entre las ideas necesita precisarse.",
            "Recupera datos aislados sin reconstruir una relación necesaria o sin distinguir su fuente.",
            "La síntesis cambia el sentido de un dato o atribuye a una fuente una idea ajena.",
            "No presenta una síntesis reconocible de las fuentes proporcionadas."
          ]
        },
        {
          "id": "medium",
          "match": "soporte (?:fisico|digital)|fisico|digital",
          "name": "el soporte solicitado",
          "function": "disponer el texto legible y consultable en el medio elegido",
          "error": "el soporte impide consultar una parte necesaria del texto",
          "sourceRecordIds": [
            "4f69a502-9c4c-583d-b864-182183201e10"
          ],
          "terms": [
            [
              "fisico",
              "el soporte físico"
            ],
            [
              "digital",
              "el soporte digital"
            ]
          ]
        },
        {
          "id": "punctuation",
          "match": "puntuacion|\\bcoma\\b|tildes",
          "name": "las convenciones de escritura solicitadas",
          "function": "delimitar las ideas y conservar el significado mediante los signos o tildes expresamente pedidos",
          "error": "un signo o tilde cambia el sentido de una afirmación",
          "sourceRecordIds": [
            "4f69a502-9c4c-583d-b864-182183201e10"
          ],
          "terms": [
            [
              "puntuacion",
              "la puntuación solicitada"
            ],
            [
              "\\bcoma\\b",
              "la coma de la frase aclaratoria"
            ],
            [
              "tildes",
              "las tildes solicitadas"
            ]
          ]
        }
      ],
      "dimensions": [
        {
          "id": "meaning",
          "title": "Intención y destinatario",
          "production": "Hace reconocible la intención del póster científico para el destinatario indicado mediante la información dada.",
          "analysis": "Explica la intención y el destinatario del póster científico con marcas de la información proporcionada.",
          "comparison": "Compara la intención y los destinatarios de los textos del póster científico mediante sus referencias.",
          "evidence": [
            "La intención y el destinatario se reconocen; una referencia necesita precisarse.",
            "Menciona intención y destinatario sin mostrar su relación con la información.",
            "Atribuye al texto una intención o destinatario incompatibles con sus referencias.",
            "No presenta una intención o un destinatario reconocibles en la evidencia solicitada."
          ],
          "weight": 4
        },
        {
          "id": "information",
          "title": "Contenido y relaciones del póster",
          "production": "Comunica sintéticamente la información del póster científico conservando las relaciones de los datos, explicaciones o referencias proporcionados.",
          "analysis": "Explica las relaciones entre las ideas del póster científico mediante los datos, explicaciones o referencias disponibles.",
          "comparison": "Contrasta las relaciones entre las ideas de los pósteres científicos con sus datos, explicaciones o referencias.",
          "evidence": [
            "Las ideas conservan las relaciones de la información; una conexión necesita aclararse.",
            "Presenta datos o ideas aislados sin construir una relación necesaria para comprender el contenido.",
            "Una afirmación invierte o contradice las relaciones de los datos o referencias dados.",
            "No presenta un contenido reconocible y relacionado con la información proporcionada."
          ],
          "weight": 4
        },
        {
          "id": "organization",
          "title": "Organización de la información",
          "production": "Organiza la información del póster científico de modo que puedan localizarse las partes solicitadas y seguirse sus relaciones.",
          "analysis": "Explica cómo se organizan las partes del póster científico y cómo permiten localizar y relacionar la información.",
          "comparison": "Compara la organización de los textos del póster científico conservando qué información aporta cada parte.",
          "evidence": [
            "Las partes permiten localizar y relacionar la información; una conexión necesita aclararse.",
            "Presenta partes o datos aislados sin organizar una relación necesaria para consultarlos.",
            "La organización mezcla referencias de partes distintas y cambia el sentido de la información.",
            "No permite reconocer la organización solicitada de la información."
          ],
          "weight": 4
        }
      ]
    },
    {
      "id": "ensayo-academico",
      "label": "ensayo académico",
      "match": "ensayos? academic",
      "sourceRecordIds": [
        "40cedb75-9f06-5eba-a46c-d1ad6635621d"
      ],
      "pdfPages": [
        477,
        478,
        479,
        480
      ],
      "profile": {
        "genre": "ensayo académico",
        "target": "la tesis, los argumentos y las relaciones de los apoyos del ensayo académico dado",
        "plan": "los componentes expresamente pedidos y sus relaciones"
      },
      "planningComponents": [
        [
          "tema",
          "el tema"
        ],
        [
          "intencion",
          "la intención"
        ],
        [
          "audiencia|destinatario",
          "la audiencia"
        ],
        [
          "tesis|punto de vista",
          "la tesis"
        ],
        [
          "(?<!contra)argumentos",
          "los argumentos"
        ],
        [
          "contraargumentos",
          "los contraargumentos"
        ],
        [
          "evidencias|garantias",
          "los apoyos dados"
        ],
        [
          "fuentes",
          "las fuentes proporcionadas"
        ],
        [
          "informacion conocida",
          "la información conocida"
        ],
        [
          "(?:informacion )?nueva",
          "la información nueva"
        ]
      ],
      "features": [
        {
          "id": "purpose",
          "match": "funcion",
          "name": "la función del ensayo",
          "function": "relacionar la intención comunicativa con la organización de las ideas del texto",
          "error": "se atribuye al ensayo una intención incompatible con su desarrollo",
          "sourceRecordIds": [
            "40cedb75-9f06-5eba-a46c-d1ad6635621d"
          ]
        },
        {
          "id": "structure",
          "match": "\\bfuncion(?:es)?\\b|\\bestructura\\b",
          "name": "la estructura solicitada",
          "function": "relacionar las partes del ensayo con el desarrollo de la pregunta y la tesis",
          "error": "se atribuye a una parte una función incompatible con sus ideas",
          "sourceRecordIds": [
            "13d9e2e1-2467-5c14-9e1b-61ff3052fab3"
          ]
        },
        {
          "id": "title-question",
          "match": "titulo|pregunta generadora|cuestionante",
          "name": "la relación entre el título y la pregunta",
          "function": "hacer reconocible el objeto de discusión y su relación con la tesis del texto",
          "error": "el título o la pregunta no corresponde al contenido desarrollado",
          "sourceRecordIds": [
            "13d9e2e1-2467-5c14-9e1b-61ff3052fab3",
            "dd5ea94d-1300-55c2-8a0d-9c24f33c2203"
          ]
        },
        {
          "id": "thesis",
          "match": "\\btesis\\b|punto de vista",
          "name": "la tesis solicitada",
          "function": "distinguir la afirmación defendida de los apoyos o posturas atribuidos a otros",
          "error": "se atribuye al autor una afirmación incompatible con su postura textual",
          "sourceRecordIds": [
            "977bd29c-46e1-5b27-a645-3eaa842cff19"
          ]
        },
        {
          "id": "arguments",
          "match": "^(?!parafras|resum)[\\s\\S]*(?:\\bargumentos?\\b|ejemplificacion|analogia|autoridad|deductiv)",
          "name": "los argumentos solicitados",
          "function": "mostrar qué relación permite pasar del apoyo disponible a la tesis y sus límites",
          "error": "se presenta como apoyo una afirmación que no sustenta la conclusión",
          "sourceRecordIds": [
            "a90738d0-be39-5f32-832b-f72cb535f053",
            "71defff2-4d9e-5577-8f35-3e7449f43694"
          ],
          "terms": [
            [
              "ejemplificacion|ejemplos",
              "los argumentos de ejemplificación"
            ],
            [
              "analogia",
              "los argumentos de analogía"
            ],
            [
              "autoridad",
              "los argumentos de autoridad"
            ],
            [
              "deductiv",
              "los argumentos deductivos"
            ]
          ]
        },
        {
          "id": "evidence",
          "match": "garantias|evidencias",
          "name": "las garantías o evidencias solicitadas",
          "function": "relacionar los apoyos proporcionados con el razonamiento que sustentan",
          "error": "se atribuye a un apoyo una conclusión que no permite sostener",
          "sourceRecordIds": [
            "c763b439-7da9-5258-9905-f9fe5858ee1f",
            "71defff2-4d9e-5577-8f35-3e7449f43694"
          ],
          "terms": [
            [
              "garantias",
              "las garantías"
            ],
            [
              "evidencias",
              "las evidencias"
            ]
          ]
        },
        {
          "id": "impersonal",
          "match": "impersonal",
          "name": "las formas impersonales del verbo",
          "function": "formular las afirmaciones conservando los referentes de la información",
          "error": "la forma verbal cambia la atribución o el sentido de una idea",
          "sourceRecordIds": [
            "61ed25cc-1061-51d2-bede-b181d9f74f4d"
          ]
        },
        {
          "id": "professional-vocabulary",
          "match": "vocabulario|lexico|palabras desconocidas",
          "name": "el vocabulario temático solicitado",
          "function": "conservar el significado de la información para el destinatario y la intención dados",
          "error": "una palabra cambia el significado de un dato o una relación del texto",
          "sourceRecordIds": [
            "4327cedf-71ed-5a7e-b2c4-057b53b648b4"
          ]
        },
        {
          "id": "connectors",
          "match": "conectores?",
          "name": "los conectores solicitados",
          "function": "hacer explícita la relación lógica pedida entre las ideas",
          "error": "el conector invierte o contradice la relación entre las ideas",
          "sourceRecordIds": [
            "54fa59ec-1286-5bc8-a8c8-9616de1e4452"
          ],
          "terms": [
            [
              "concesion",
              "los conectores de concesión"
            ],
            [
              "transicion",
              "los conectores de transición"
            ],
            [
              "precision",
              "los conectores de precisión"
            ],
            [
              "reformulacion",
              "los conectores de reformulación"
            ],
            [
              "causa.?efecto",
              "los conectores de causa-efecto"
            ]
          ]
        },
        {
          "id": "adverbial-phrases",
          "match": "locuciones adverbiales",
          "name": "las locuciones adverbiales",
          "function": "precisar las circunstancias o relaciones de las afirmaciones del texto",
          "error": "la locución modifica la circunstancia o relación expresada por el pasaje",
          "sourceRecordIds": [
            "5b21846b-4332-5992-ac7b-1a7a0a239dc4"
          ]
        },
        {
          "id": "modality",
          "match": "modalizadoras|modalizacion",
          "name": "las expresiones modalizadoras",
          "function": "distinguir posibilidad, certeza y valoración de las afirmaciones",
          "error": "se toma una posibilidad como hecho confirmado o una valoración como dato",
          "sourceRecordIds": [
            "5116505e-6702-5b31-afda-86371adc26a1"
          ]
        },
        {
          "id": "bibliography",
          "match": "referencias bibliograficas|bibliografia",
          "name": "las referencias bibliográficas solicitadas",
          "function": "permitir reconocer las fuentes dadas mediante la información y norma expresamente proporcionadas",
          "error": "la referencia identifica una obra o fuente distinta de la utilizada",
          "sourceRecordIds": [
            "87bb53bd-116b-5666-a201-2b7c954fcb7f"
          ]
        },
        {
          "id": "citation",
          "match": "\\bcitacion\\b|\\bcitas?\\b|parafraseada|autor corporativo",
          "name": "los mecanismos de citación solicitados",
          "function": "atribuir las ideas a su fuente y conservar su sentido según las convenciones dadas",
          "error": "se atribuye a una fuente una idea ajena o se altera el sentido de la cita",
          "sourceRecordIds": [
            "6f0dcba5-844a-55d1-b320-527efeec8f35",
            "c5dedb34-79f6-5157-9ade-de1a53c14767"
          ],
          "terms": [
            [
              "textuales|textual",
              "la cita textual"
            ],
            [
              "parafraseada",
              "la cita parafraseada"
            ],
            [
              "autor corporativo",
              "la cita de autor corporativo"
            ],
            [
              "otra cita|secundaria",
              "la cita de otra cita"
            ]
          ]
        },
        {
          "id": "voices",
          "match": "voces|voz propia|voz del autor",
          "name": "las voces solicitadas",
          "function": "distinguir la postura propia del autor de las ideas atribuidas a otros",
          "error": "se atribuye al autor una postura que el texto asigna a otra voz",
          "sourceRecordIds": [
            "33797823-fab7-5a77-90e5-2b2435d05671",
            "42593d59-76ed-5b3d-8404-8a678c56ef47",
            "81c2fdc0-5a59-5326-a10c-6a3c572b4c49"
          ],
          "terms": [
            [
              "voz propia|voz del autor",
              "la voz propia del autor"
            ],
            [
              "voces ajenas",
              "las voces ajenas"
            ]
          ]
        },
        {
          "id": "counterarguments",
          "match": "contraargumentos|posiciones alternativas|refutacion",
          "name": "las posiciones alternativas solicitadas",
          "function": "relacionar objeciones y respuestas con la tesis sin tergiversar las posturas del texto",
          "error": "se refuta una afirmación que no corresponde a la posición considerada",
          "sourceRecordIds": [
            "33797823-fab7-5a77-90e5-2b2435d05671",
            "71defff2-4d9e-5577-8f35-3e7449f43694",
            "81c2fdc0-5a59-5326-a10c-6a3c572b4c49"
          ],
          "terms": [
            [
              "contraargumentos",
              "los contraargumentos"
            ],
            [
              "posiciones alternativas",
              "las posiciones alternativas"
            ],
            [
              "refutacion",
              "la refutación"
            ]
          ]
        },
        {
          "id": "known-new",
          "match": "informacion conocida|informacion nueva|informaciones.*conocidas",
          "name": "la información conocida y nueva solicitada",
          "function": "distinguir qué referencias se dan por conocidas y qué ideas se desarrollan para la audiencia indicada",
          "error": "se da por conocida una referencia necesaria que el destinatario no recibe",
          "sourceRecordIds": [
            "280822fa-cfe1-5260-9572-8d66b45d1871",
            "d6d88f08-1789-59ea-8cce-578440be8136"
          ],
          "terms": [
            [
              "conocida",
              "la información conocida"
            ],
            [
              "nueva",
              "la información nueva"
            ]
          ]
        },
        {
          "id": "source-selection",
          "match": "fuentes",
          "name": "las fuentes proporcionadas solicitadas",
          "function": "relacionar la información seleccionada con la pregunta y la intención del ensayo",
          "error": "se usa como apoyo una fuente ajena a la pregunta o se cambia su sentido",
          "sourceRecordIds": [
            "280822fa-cfe1-5260-9572-8d66b45d1871",
            "d6d88f08-1789-59ea-8cce-578440be8136"
          ]
        },
        {
          "id": "supported-position",
          "match": "postura argumentada",
          "name": "la postura argumentada solicitada",
          "function": "fundamentar una interpretación de la tesis con evidencias del texto sin exigir adhesión",
          "error": "se atribuye al texto un apoyo que contradice su sentido",
          "sourceRecordIds": [
            "971269b7-aa7b-587e-86bc-503823e3116f",
            "3e3b2ab5-4000-5d3a-ac51-351ab0c0ce99"
          ]
        },
        {
          "id": "explanation",
          "match": "clarificacion de conceptos|estado de la cuestion|relaciones entre conceptos",
          "name": "los procedimientos expositivo-explicativos solicitados",
          "function": "hacer reconocible la explicación conceptual mediante los referentes dados",
          "error": "la explicación confunde conceptos o introduce una relación contradictoria",
          "sourceRecordIds": [
            "81c2fdc0-5a59-5326-a10c-6a3c572b4c49"
          ]
        },
        {
          "id": "punctuation",
          "match": "puntuacion|\\bcoma\\b|tildes",
          "name": "las convenciones de escritura solicitadas",
          "function": "delimitar las ideas y conservar el significado mediante los signos o tildes expresamente pedidos",
          "error": "un signo o tilde cambia el sentido de una afirmación",
          "sourceRecordIds": [
            "81c2fdc0-5a59-5326-a10c-6a3c572b4c49"
          ],
          "terms": [
            [
              "puntuacion",
              "la puntuación solicitada"
            ],
            [
              "\\bcoma\\b",
              "la coma de la frase aclaratoria"
            ],
            [
              "tildes",
              "las tildes solicitadas"
            ]
          ]
        },
        {
          "id": "communication-context",
          "match": "^(?:infier|analiz|identific|explic)[a-z]*\\s+(?:oralmente\\s+)?(?:unicamente\\s+)?(?:(?:la|el|los|las|su|sus)\\s+)?(?:intencion|destinatario|audiencia|canal|elementos de la situacion comunicativa|situacion comunicativa)",
          "name": "los elementos de la situación comunicativa solicitados",
          "function": "relacionar la intención, destinatario o canal pedidos con las marcas del texto",
          "error": "se atribuye al texto un destinatario o canal incompatible con sus referencias",
          "sourceRecordIds": [
            "d6d88f08-1789-59ea-8cce-578440be8136"
          ],
          "terms": [
            [
              "destinatario",
              "el destinatario"
            ],
            [
              "audiencia",
              "la audiencia"
            ],
            [
              "canal",
              "el canal"
            ],
            [
              "intencion",
              "la intención comunicativa"
            ]
          ]
        },
        {
          "id": "medium",
          "match": "soporte (?:fisico|digital)|fisico|digital",
          "name": "el soporte solicitado",
          "function": "disponer el texto legible y consultable en el medio elegido",
          "error": "el soporte impide consultar una parte necesaria del texto",
          "sourceRecordIds": [
            "81c2fdc0-5a59-5326-a10c-6a3c572b4c49"
          ],
          "terms": [
            [
              "fisico",
              "el soporte físico"
            ],
            [
              "digital",
              "el soporte digital"
            ]
          ]
        }
      ],
      "dimensions": [
        {
          "id": "thesis",
          "title": "Tesis y pregunta",
          "production": "Formula una tesis reconocible y relacionada con la pregunta del ensayo académico solicitado.",
          "analysis": "Explica la tesis del ensayo académico y su relación con la pregunta que desarrolla.",
          "comparison": "Contrasta las tesis de los ensayos y sus preguntas con evidencias de los textos.",
          "evidence": [
            "Se reconoce la tesis y su pregunta; una relación necesita precisarse.",
            "Menciona una postura o pregunta sin delimitar su relación.",
            "Atribuye al ensayo una tesis incompatible con las afirmaciones del texto.",
            "No presenta una tesis reconocible y relacionada con la pregunta trabajada."
          ],
          "weight": 4
        },
        {
          "id": "reasoning",
          "title": "Argumentos y apoyos",
          "production": "Relaciona los argumentos del ensayo académico con los apoyos proporcionados y la tesis que sostienen.",
          "analysis": "Explica cómo se relacionan los argumentos y apoyos del ensayo con su tesis mediante evidencias del texto.",
          "comparison": "Contrasta la relación entre argumentos, apoyos y tesis de los ensayos con sus pasajes.",
          "evidence": [
            "Los argumentos sostienen la tesis; una relación con un apoyo requiere precisión.",
            "Enumera argumentos o apoyos sin explicar cómo sustentan la tesis.",
            "Un apoyo se interpreta con un sentido contrario al pasaje o no sustenta la conclusión atribuida.",
            "No presenta una relación reconocible entre argumentos, apoyos y tesis."
          ],
          "weight": 4
        },
        {
          "id": "organization",
          "title": "Organización de la información",
          "production": "Organiza la información del ensayo académico de modo que puedan localizarse las partes solicitadas y seguirse sus relaciones.",
          "analysis": "Explica cómo se organizan las partes del ensayo académico y cómo permiten localizar y relacionar la información.",
          "comparison": "Compara la organización de los textos del ensayo académico conservando qué información aporta cada parte.",
          "evidence": [
            "Las partes permiten localizar y relacionar la información; una conexión necesita aclararse.",
            "Presenta partes o datos aislados sin organizar una relación necesaria para consultarlos.",
            "La organización mezcla referencias de partes distintas y cambia el sentido de la información.",
            "No permite reconocer la organización solicitada de la información."
          ],
          "weight": 4
        }
      ]
    }
  ]
}
