import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV124 } from './catalog-v124'
/** Exact125 payload checked against Development; previous fields remain inherited. */
export const evaluationCatalogV125={...evaluationCatalogV124,version:'evaluation-2026.125',optativeLanguageModules:[
  {
    "id": "optativa-hlm-len-4",
    "grade": 4,
    "subjectCode": "OPT-HLM-LEN-4",
    "subjectName": "Apreciación y Producción Literarias",
    "optativeExitName": "Humanidades y Lenguas Modernas",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "d619d96a-6e30-5201-8264-3bc09502e53e",
    "pdfPages": [
      427,
      428,
      429,
      430,
      431
    ],
    "topics": [
      {
        "id": "poesia-romantica",
        "label": "poesía romántica",
        "match": "poesias? romanticas?|poemas? romanticos?",
        "sourceRecordIds": [
          "c73c6a1e-4889-5a45-89c6-d2a848c16072"
        ],
        "pdfPages": [
          427,
          428,
          429
        ],
        "profile": {
          "genre": "poema romántico",
          "target": "el tema, la intención y la organización de los versos del poema",
          "plan": "la relación entre intención, tema y forma expresamente elegida"
        },
        "features": [
          {
            "id": "heroic-tone",
            "match": "tono heroico|narrativa.*heroic",
            "name": "el tono heroico",
            "function": "caracterizar las acciones y la voz narrativa del poema",
            "error": "se atribuye un tono incompatible con los versos",
            "sourceRecordIds": [
              "6034bd4f-a1be-5dc4-b20f-160fa50c1546"
            ]
          },
          {
            "id": "intimist-tone",
            "match": "tono intimista|liric.*intimist",
            "name": "el tono intimista",
            "function": "relacionar la voz lírica con los sentidos del poema",
            "error": "se confunde la voz del poema con una confesión del estudiante",
            "sourceRecordIds": [
              "03e51df1-c36e-564f-8c15-8bd3f008b4d2"
            ]
          },
          {
            "id": "poetry-adjectives",
            "match": "adjetiv",
            "name": "la adjetivación",
            "function": "precisar las imágenes y el sentido del poema",
            "error": "se atribuye al adjetivo una imagen incompatible con el verso",
            "sourceRecordIds": [
              "83d9262c-45af-5416-8c80-bbe7f1021046"
            ]
          },
          {
            "id": "poetry-vocabulary",
            "match": "vocabulario|lexico|palabras desconocidas",
            "name": "el vocabulario contextual",
            "function": "conservar el sentido de las palabras en los versos",
            "error": "se elige un significado incompatible con el contexto",
            "sourceRecordIds": [
              "e20e89e7-8207-5ba5-a48c-7d28f2c00055"
            ]
          },
          {
            "id": "poetry-figures",
            "match": "figuras|recursos (?:literarios|estilisticos|retoricos)|epiteto|hiperbaton|hiperbole|antitesis|paralelismo|anafora|ironia|comparacion|metafora",
            "name": "los recursos literarios expresamente trabajados",
            "function": "relacionar las imágenes y los recursos con el sentido del poema",
            "error": "se identifica un recurso inexistente o se le atribuye un efecto contrario al verso",
            "sourceRecordIds": [
              "dcd26e81-3aa6-5267-b09c-53cd7bd437b6"
            ],
            "terms": [
              [
                "epiteto",
                "el epíteto"
              ],
              [
                "hiperbaton",
                "el hipérbaton"
              ],
              [
                "hiperbole",
                "la hipérbole"
              ],
              [
                "antitesis",
                "la antítesis"
              ],
              [
                "paralelismo",
                "el paralelismo"
              ],
              [
                "anafora",
                "la anáfora"
              ],
              [
                "ironia",
                "la ironía"
              ],
              [
                "comparacion",
                "la comparación"
              ],
              [
                "metafora",
                "la metáfora"
              ]
            ]
          },
          {
            "id": "poetry-exclamations",
            "match": "interjecciones|exclamaciones|interrogaciones retoricas",
            "name": "los recursos expresivos expresamente pedidos",
            "function": "relacionar la voz y la intención con la expresión del verso",
            "error": "se confunde una pregunta literal con una interrogación retórica",
            "sourceRecordIds": [
              "a64d7279-4bcf-5f0e-b7d6-b2d9caf9fd7f"
            ],
            "terms": [
              [
                "interjecciones",
                "las interjecciones"
              ],
              [
                "exclamaciones",
                "las exclamaciones"
              ],
              [
                "interrogaciones retoricas",
                "las interrogaciones retóricas"
              ]
            ]
          },
          {
            "id": "poetry-themes",
            "match": "temas?",
            "name": "el tema",
            "function": "relacionar las ideas e imágenes con el sentido del poema",
            "error": "se atribuye un tema sin apoyo en los versos",
            "sourceRecordIds": [
              "f73b5b5c-4039-531c-b432-545d721d831d"
            ]
          },
          {
            "id": "poetic-form",
            "match": "estrofas|romance|octava real|octavilla|silva|sextina",
            "name": "la estrofa expresamente elegida",
            "function": "organizar los versos según la forma solicitada",
            "error": "la organización contradice la forma elegida",
            "sourceRecordIds": [
              "59f8fa38-16ce-535a-9df5-6027c038984c"
            ],
            "terms": [
              [
                "romance",
                "el romance"
              ],
              [
                "octava real",
                "la octava real"
              ],
              [
                "octavilla",
                "la octavilla"
              ],
              [
                "silva",
                "la silva"
              ],
              [
                "sextina",
                "la sextina"
              ]
            ]
          },
          {
            "id": "rhyme",
            "match": "rima|asonante|consonante",
            "name": "la rima expresamente pedida",
            "function": "relacionar las coincidencias sonoras con la forma elegida",
            "error": "se atribuye una coincidencia sonora que no existe",
            "sourceRecordIds": [
              "59f8fa38-16ce-535a-9df5-6027c038984c"
            ],
            "terms": [
              [
                "asonante",
                "la rima asonante"
              ],
              [
                "consonante",
                "la rima consonante"
              ]
            ]
          },
          {
            "id": "meter",
            "match": "metrica|octosilab|endecasilab|heptasilab|alejandrin",
            "name": "la medida de verso expresamente pedida",
            "function": "ajustar los versos al cómputo solicitado",
            "error": "el cómputo no corresponde a los versos presentados",
            "sourceRecordIds": [
              "59f8fa38-16ce-535a-9df5-6027c038984c"
            ],
            "terms": [
              [
                "octosilab",
                "el verso octosílabo"
              ],
              [
                "endecasilab",
                "el verso endecasílabo"
              ],
              [
                "heptasilab",
                "el verso heptasílabo"
              ],
              [
                "alejandrin",
                "el verso alejandrino"
              ]
            ]
          },
          {
            "id": "nonverbal",
            "match": "gestos|gestual|corporal",
            "name": "los gestos solicitados",
            "function": "hacer reconocible la intención de los versos con los apoyos acordados",
            "error": "el gesto o apoyo comunica una intención contraria al verso",
            "sourceRecordIds": [
              "96043175-af78-5ab9-816f-f1aad09b9f1a"
            ]
          }
        ],
        "dimensions": [
          {
            "id": "meaning",
            "title": "Sentido e intención del poema",
            "production": "Desarrolla el tema y la intención del poema romántico mediante una voz y un vocabulario coherentes con la situación comunicativa solicitada.",
            "analysis": "Explica el sentido y la intención del poema romántico apoyándose en sus versos.",
            "comparison": "Contrasta el sentido y la intención de los poemas románticos mediante sus versos.",
            "evidence": [
              "El sentido y la intención se reconocen; una relación entre ideas e imágenes necesita aclararse.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se atribuye al poema un sentido que contradice sus versos.",
              "No aporta evidencia reconocible del sentido y la intención del poema."
            ],
            "weight": 4
          },
          {
            "id": "organization",
            "title": "Organización de los versos",
            "production": "Organiza los versos y estrofas para que pueda seguirse el desarrollo del tema solicitado.",
            "analysis": "Relaciona la organización de los versos y estrofas con el desarrollo del sentido del poema.",
            "comparison": "Compara cómo la organización de los versos contribuye al sentido en los poemas dados.",
            "evidence": [
              "Puede seguirse el desarrollo; una transición entre versos requiere precisión.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "El orden de los versos cambia el sentido o rompe una relación necesaria.",
              "No presenta una organización reconocible del poema solicitado."
            ],
            "weight": 4
          }
        ]
      },
      {
        "id": "novela-viajes-aventuras",
        "label": "novela de viajes y aventuras",
        "match": "novelas?(?: breves?)? de (?:viajes? y )?aventuras?",
        "sourceRecordIds": [
          "a834c29e-852e-5027-80b2-ef555240f55a"
        ],
        "pdfPages": [
          429,
          430
        ],
        "profile": {
          "genre": "novela de viajes y aventuras",
          "target": "los sucesos, las acciones de los personajes y la voz narrativa del pasaje solicitado",
          "plan": "la relación entre sucesos, personajes, lugar y tiempo expresamente pedidos"
        },
        "features": [
          {
            "id": "novel-structure",
            "match": "funcion|estructura",
            "name": "la función y estructura solicitadas",
            "function": "relacionar la organización de los sucesos con el propósito del relato",
            "error": "se atribuye a una parte una función que contradice los sucesos",
            "sourceRecordIds": [
              "360bde91-5faf-59ae-bfa6-5afeddcde9cf"
            ]
          },
          {
            "id": "novel-protagonist",
            "match": "protagonista",
            "name": "el protagonista",
            "function": "relacionar sus acciones con el desarrollo de la aventura",
            "error": "se atribuye al protagonista la acción de otro personaje",
            "sourceRecordIds": [
              "0d4f7d90-5e8e-520f-8ceb-8208d6ea4a29"
            ]
          },
          {
            "id": "novel-adventures",
            "match": "aventuras? de (?:la )?novela|distincion de (?:las )?aventuras",
            "name": "las aventuras del relato",
            "function": "distinguir los episodios y sus relaciones en el texto",
            "error": "se añade una aventura que no pertenece al texto",
            "sourceRecordIds": [
              "b49ede02-c784-5d7d-9956-1166a69d8b0d"
            ]
          },
          {
            "id": "novel-characters",
            "match": "personajes",
            "name": "los personajes",
            "function": "relacionar sus rasgos y acciones en la aventura",
            "error": "se atribuye un rasgo o una acción al personaje equivocado",
            "sourceRecordIds": [
              "531ce83c-7a45-575f-8800-047aaef3cdba"
            ]
          },
          {
            "id": "novel-adjectives",
            "match": "adjetiv",
            "name": "la adjetivación",
            "function": "caracterizar personajes o espacios según el pasaje solicitado",
            "error": "se atribuye un rasgo incompatible con el personaje o espacio",
            "sourceRecordIds": [
              "18e2b296-3044-5955-a4c0-7d3073160974"
            ]
          },
          {
            "id": "novel-actants",
            "match": "actan",
            "name": "la actancia de los personajes",
            "function": "explicar la función de sus acciones en las relaciones del relato",
            "error": "se confunde el papel actancial con el nombre del personaje",
            "sourceRecordIds": [
              "8e6f8005-f5cc-5642-ae39-1417b4abe224"
            ]
          },
          {
            "id": "narrator",
            "match": "narrador|voces|quien narra|quien cuenta",
            "name": "el narrador y las voces expresamente trabajadas",
            "function": "distinguir quién cuenta los hechos y desde qué perspectiva",
            "error": "se atribuye al narrador la voz de un personaje o una información inaccesible",
            "sourceRecordIds": [
              "6cf4ede5-ee0d-5973-aa2e-82f02465b762"
            ]
          },
          {
            "id": "novel-themes",
            "match": "temas?",
            "name": "el tema",
            "function": "relacionar las acciones con las ideas del relato",
            "error": "se atribuye un tema sin apoyo en los episodios",
            "sourceRecordIds": [
              "1798770d-23a6-59e7-95b7-6ac663547b5b"
            ]
          },
          {
            "id": "novel-sequences",
            "match": "secuencias?",
            "name": "las secuencias expresamente pedidas",
            "function": "relacionar narración, descripción o diálogo con su función en el pasaje",
            "error": "se clasifica una secuencia por un rasgo que no contiene",
            "sourceRecordIds": [
              "0e750be7-7ec5-5f26-b878-41c898395d0e"
            ],
            "terms": [
              [
                "narrativas",
                "la secuencia narrativa"
              ],
              [
                "descriptivas",
                "la secuencia descriptiva"
              ],
              [
                "dialogadas",
                "la secuencia dialogada"
              ]
            ]
          },
          {
            "id": "novel-setting",
            "match": "ambiente|espacio|lugar",
            "name": "el ambiente solicitado",
            "function": "situar las acciones y su relación con el espacio del relato",
            "error": "se atribuye una acción a un lugar incompatible con el pasaje",
            "sourceRecordIds": [
              "1204691b-89ce-59cf-86e4-3836b912a18d"
            ]
          },
          {
            "id": "novel-plot",
            "match": "trama",
            "name": "la trama",
            "function": "relacionar los sucesos y sus conexiones causales",
            "error": "se invierte una causa o se añade un suceso ajeno al relato",
            "sourceRecordIds": [
              "d24c6637-e5b3-5a5d-92d1-062db748f416"
            ]
          },
          {
            "id": "novel-chronology",
            "match": "cronologic|orden.*(?:narracion|sucesos)",
            "name": "el orden cronológico solicitado",
            "function": "relacionar los acontecimientos y su secuencia",
            "error": "se invierte un acontecimiento y cambia su relación con los demás",
            "sourceRecordIds": [
              "b55ea4a0-d2ee-56cf-a5d7-47b8609b025f"
            ]
          },
          {
            "id": "novel-connectors",
            "match": "conectores",
            "name": "los conectores expresamente pedidos",
            "function": "enlazar las acciones conservando sus relaciones",
            "error": "el conector invierte una causa o una relación temporal",
            "sourceRecordIds": [
              "f0375fb2-422f-5f57-a4c4-43810a53f585"
            ],
            "terms": [
              [
                "temporales",
                "los conectores temporales"
              ],
              [
                "causales",
                "los conectores causales"
              ],
              [
                "consecutivos",
                "los conectores consecutivos"
              ]
            ]
          },
          {
            "id": "dialogue",
            "match": "dialogos?|estilo directo",
            "name": "el diálogo en estilo directo solicitado",
            "function": "distinguir las intervenciones de los personajes y conservar su sentido",
            "error": "se atribuye una intervención al personaje equivocado",
            "sourceRecordIds": [
              "eb607999-2063-522f-8329-03d226041abc"
            ]
          },
          {
            "id": "punctuation",
            "match": "puntuacion|\\bcoma\\b|dos puntos|\\braya\\b",
            "name": "la puntuación expresamente pedida",
            "function": "delimitar las acciones y las intervenciones sin cambiar su sentido",
            "error": "el signo cambia quién habla o la relación entre las acciones",
            "sourceRecordIds": [
              "eb607999-2063-522f-8329-03d226041abc"
            ]
          },
          {
            "id": "narrative-tenses",
            "match": "tiempos? verbales|pasado|presente",
            "name": "los tiempos verbales expresamente pedidos",
            "function": "distinguir el tiempo de las acciones y del diálogo solicitado",
            "error": "un cambio temporal contradice la relación entre los sucesos",
            "sourceRecordIds": [
              "eb607999-2063-522f-8329-03d226041abc"
            ],
            "terms": [
              [
                "pasado",
                "el pasado narrativo"
              ],
              [
                "presente",
                "el presente del diálogo"
              ]
            ]
          },
          {
            "id": "suspense",
            "match": "suspens",
            "name": "los recursos descriptivos de suspense solicitados",
            "function": "administrar la información y la expectativa del pasaje",
            "error": "se atribuye suspense a información que contradice la escena",
            "sourceRecordIds": [
              "eb607999-2063-522f-8329-03d226041abc"
            ]
          },
          {
            "id": "motivations",
            "match": "motivaciones|intenciones de (?:los )?personajes",
            "name": "las motivaciones de los personajes",
            "function": "inferir las razones de sus acciones mediante los pasajes proporcionados",
            "error": "se atribuye al personaje una intención sin apoyo en el pasaje",
            "sourceRecordIds": [
              "1aadf631-190b-5082-85ee-bbc197718733"
            ]
          },
          {
            "id": "causality",
            "match": "causalidad|relacion(?:es)? causal(?:es)?",
            "name": "las relaciones causales de las acciones",
            "function": "explicar cómo un suceso contribuye a otro según el relato",
            "error": "se presenta como causa una acción posterior o ajena al suceso",
            "sourceRecordIds": [
              "cf307889-6541-5fa4-843c-60a727bf7897"
            ]
          }
        ],
        "dimensions": [
          {
            "id": "plot",
            "title": "Relaciones entre los sucesos",
            "production": "Enlaza los sucesos del relato solicitado de modo que puedan seguirse las acciones y sus relaciones causales.",
            "analysis": "Explica las relaciones entre los sucesos del relato mediante los pasajes proporcionados.",
            "comparison": "Compara las relaciones entre los sucesos de los relatos con evidencias de los pasajes dados.",
            "evidence": [
              "Se siguen las relaciones principales; una transición necesita explicarse.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se invierte una relación causal o se añade un hecho incompatible con el relato.",
              "No presenta relaciones reconocibles entre los sucesos solicitados."
            ],
            "weight": 4
          },
          {
            "id": "characters",
            "title": "Personajes y acciones",
            "production": "Hace reconocibles los personajes mediante sus acciones y relaciones en la aventura solicitada.",
            "analysis": "Explica las acciones y motivaciones de los personajes mediante episodios del relato.",
            "comparison": "Contrasta acciones y motivaciones de los personajes con episodios de ambos relatos.",
            "evidence": [
              "Las acciones permiten reconocer a los personajes; una motivación requiere precisión.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se atribuye a un personaje una acción o motivación incompatible con el pasaje.",
              "No aporta evidencia reconocible de las acciones y relaciones de los personajes."
            ],
            "weight": 4
          },
          {
            "id": "narrator",
            "title": "Voz narrativa",
            "production": "Emplea una voz narrativa que permite reconocer quién cuenta los sucesos y conserva su perspectiva.",
            "analysis": "Distingue al narrador de las intervenciones de los personajes y fundamenta su perspectiva con el pasaje.",
            "comparison": "Contrasta las voces narrativas y sus perspectivas mediante evidencias de los relatos.",
            "evidence": [
              "Se reconoce quién narra; una referencia requiere distinguir mejor su perspectiva.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se atribuye al narrador una voz o información incompatible con su perspectiva.",
              "No permite reconocer la voz y perspectiva narrativas solicitadas."
            ],
            "weight": 4
          }
        ]
      }
    ]
  },
  {
    "id": "optativa-hlm-len-5",
    "grade": 5,
    "subjectCode": "OPT-HLM-LEN-5",
    "subjectName": "Apreciación y Producción Literarias",
    "optativeExitName": "Humanidades y Lenguas Modernas",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "a4ba08bf-efdf-5ede-9710-5d1d7ea0c559",
    "pdfPages": [
      432,
      433,
      434,
      435,
      436
    ],
    "topics": [
      {
        "id": "epopeya",
        "label": "epopeya",
        "match": "epopeyas?",
        "sourceRecordIds": [
          "a814598d-fedf-527e-82b8-a2f4de48967a"
        ],
        "pdfPages": [
          432,
          433
        ],
        "profile": {
          "genre": "epopeya",
          "target": "los episodios, las acciones de los personajes y la voz narrativa de la epopeya solicitada",
          "plan": "la relación entre sucesos, personajes, lugar y tiempo expresamente pedidos"
        },
        "features": [
          {
            "id": "epic-structure",
            "match": "funcion|forma|estructura|division",
            "name": "la función, forma y estructura expresamente trabajadas",
            "function": "relacionar la organización de los episodios con el propósito de la epopeya",
            "error": "se atribuye a una parte una función que contradice el texto",
            "sourceRecordIds": [
              "e03d029b-546e-5032-8edf-f93258cb502d"
            ],
            "terms": [
              [
                "funcion",
                "la función"
              ],
              [
                "forma",
                "la forma"
              ],
              [
                "estructura",
                "la estructura"
              ],
              [
                "division",
                "la división"
              ]
            ]
          },
          {
            "id": "public-deed",
            "match": "hazana",
            "name": "la hazaña pública",
            "function": "relacionar la acción extraordinaria con su alcance colectivo dentro del mundo narrado",
            "error": "se confunde una acción privada secundaria con la hazaña que articula el relato",
            "sourceRecordIds": [
              "f18d7917-6191-5213-8cf5-8a9bad944338"
            ]
          },
          {
            "id": "protagonist-values",
            "match": "valores",
            "name": "los valores representados por el protagonista",
            "function": "relacionar sus decisiones con los valores que el texto representa, sin exigir adhesión personal",
            "error": "se atribuye al personaje un valor incompatible con sus decisiones en el texto",
            "sourceRecordIds": [
              "481fed69-65ae-53ba-9406-013d1af214c9"
            ]
          },
          {
            "id": "fantastic",
            "match": "fantastic",
            "name": "los seres y hechos fantásticos solicitados",
            "function": "relacionar sus acciones con los acontecimientos del mundo narrado",
            "error": "se presenta un hecho fantástico como un hecho histórico comprobado",
            "sourceRecordIds": [
              "6c31d069-24fc-5b43-864f-be72392382d4"
            ],
            "terms": [
              [
                "seres?",
                "los seres fantásticos"
              ],
              [
                "hechos?",
                "los hechos fantásticos"
              ]
            ]
          },
          {
            "id": "epic-themes",
            "match": "tema|viajes|guerras",
            "name": "el tema expresamente trabajado",
            "function": "relacionar los viajes o conflictos narrados con el sentido de la epopeya",
            "error": "se atribuye al texto un tema ajeno a sus episodios",
            "sourceRecordIds": [
              "10335de6-6a2b-57d2-9f9f-3a95d98bccb6"
            ]
          },
          {
            "id": "epic-sequences",
            "match": "secuencias?",
            "name": "las secuencias narrativas",
            "function": "ordenar las acciones y conservar las relaciones entre los episodios",
            "error": "se invierte una acción y se altera su relación con los episodios",
            "sourceRecordIds": [
              "6fe23900-0f70-51f7-b7f2-3cc119832ed5"
            ]
          },
          {
            "id": "epic-connectors",
            "match": "conectores",
            "name": "los conectores expresamente pedidos",
            "function": "enlazar las acciones conservando sus relaciones temporales y causales",
            "error": "el conector invierte una causa o una relación temporal",
            "sourceRecordIds": [
              "93caec2b-8e21-55d7-be4f-a79f9bdb653e"
            ],
            "terms": [
              [
                "temporales?",
                "los conectores temporales"
              ],
              [
                "causales?",
                "los conectores causales"
              ],
              [
                "consecutivos?",
                "los conectores consecutivos"
              ],
              [
                "de orden",
                "los conectores de orden"
              ]
            ]
          },
          {
            "id": "markers",
            "match": "marcadores",
            "name": "los marcadores expresamente pedidos",
            "function": "situar las acciones y organizar la relación con el interlocutor según el pasaje",
            "error": "se atribuye a un marcador una relación incompatible con el pasaje",
            "sourceRecordIds": [
              "f2090cd9-0102-53d8-96d9-5316a686dadc"
            ],
            "terms": [
              [
                "espaciales?",
                "los marcadores espaciales"
              ],
              [
                "interactivos?",
                "los marcadores interactivos"
              ]
            ]
          },
          {
            "id": "narrative-tenses",
            "match": "tiempos? verbales|pasado|presente",
            "name": "los tiempos verbales expresamente pedidos",
            "function": "distinguir el tiempo de las acciones y del diálogo solicitado",
            "error": "un cambio temporal contradice la relación entre los sucesos",
            "sourceRecordIds": [
              "7fc4e967-decd-5f75-83f9-8ce1cfbfaeeb"
            ],
            "terms": [
              [
                "pasado",
                "el pasado narrativo"
              ],
              [
                "presente",
                "el presente del diálogo"
              ]
            ]
          },
          {
            "id": "epic-adjectives",
            "match": "adjetiv",
            "name": "la adjetivación",
            "function": "caracterizar los personajes y lugares del pasaje solicitado",
            "error": "se atribuye un rasgo incompatible con el personaje o lugar",
            "sourceRecordIds": [
              "4f93c201-5c91-5d3b-9890-740ddc4f1479"
            ]
          },
          {
            "id": "narrator",
            "match": "narrador(?! omnisciente)|voces|quien narra|quien cuenta",
            "name": "el narrador y las voces solicitadas",
            "function": "distinguir quién cuenta los hechos de las intervenciones de los personajes",
            "error": "se atribuye al narrador la intervención de un personaje",
            "sourceRecordIds": [
              "bd966b33-300b-5596-8e74-c6591577389e"
            ]
          },
          {
            "id": "omniscient",
            "match": "omnisciente",
            "name": "el narrador omnisciente",
            "function": "relacionar el conocimiento del narrador con la información que presenta sobre los personajes",
            "error": "se atribuye omnisciencia sin evidencias de ese conocimiento en el pasaje",
            "sourceRecordIds": [
              "3909045f-fa90-5f9d-a9b3-b6e9734b0571"
            ]
          },
          {
            "id": "novel-characters",
            "match": "(?<!de los )(?<!de )personajes",
            "name": "los personajes expresamente trabajados",
            "function": "relacionar sus acciones y sus papeles en la epopeya",
            "error": "se atribuye una acción o un papel al personaje equivocado",
            "sourceRecordIds": [
              "bcaefb96-ef3c-5319-a9f2-996a9961cc2b"
            ],
            "terms": [
              [
                "principal",
                "el personaje principal"
              ],
              [
                "secundarios?",
                "los personajes secundarios"
              ],
              [
                "antagonista",
                "el antagonista"
              ]
            ]
          },
          {
            "id": "epic-actants",
            "match": "actan",
            "name": "los papeles actanciales solicitados",
            "function": "explicar la función de las acciones de los personajes en sus relaciones",
            "error": "se confunde el papel actancial con el nombre del personaje",
            "sourceRecordIds": [
              "c42e936a-7697-5a98-95b7-0ac1b1477d9d"
            ]
          },
          {
            "id": "epic-figures",
            "match": "figuras|recursos literarios|prosopografia|retrato|exageracion",
            "name": "los recursos literarios expresamente pedidos",
            "function": "relacionar la caracterización y la intensidad de las imágenes con el sentido del pasaje",
            "error": "se atribuye al texto un recurso inexistente",
            "sourceRecordIds": [
              "a072e834-726a-5a63-bc12-13c5e0abde3b"
            ],
            "terms": [
              [
                "prosopografia",
                "la prosopografía"
              ],
              [
                "retrato",
                "el retrato"
              ],
              [
                "exageracion",
                "la exageración"
              ]
            ]
          },
          {
            "id": "epic-protagonist",
            "match": "^(?!.*valores).*protagonista",
            "name": "el protagonista",
            "function": "relacionar sus acciones con los episodios de la epopeya",
            "error": "se atribuye al protagonista una acción de otro personaje",
            "sourceRecordIds": [
              "481fed69-65ae-53ba-9406-013d1af214c9"
            ]
          },
          {
            "id": "epic-form",
            "match": "\\bverso\\b|\\bprosa\\b",
            "name": "la forma elegida",
            "function": "mantener la forma de verso o prosa elegida para el relato solicitado",
            "error": "se alternan formas incompatibles con la opción elegida",
            "sourceRecordIds": [
              "c358fc67-3da7-5ac8-bd2f-5d6e2a7466a0"
            ],
            "terms": [
              [
                "verso",
                "el verso"
              ],
              [
                "prosa",
                "la prosa"
              ]
            ]
          },
          {
            "id": "motivations",
            "match": "motivaciones|intenciones de (?:los )?personajes",
            "name": "las motivaciones de los personajes",
            "function": "inferir las razones de sus acciones con los pasajes proporcionados",
            "error": "se atribuye al personaje una intención sin apoyo en el pasaje",
            "sourceRecordIds": [
              "e57c4f2a-fc4a-5eba-8d60-a2f39285638e"
            ]
          },
          {
            "id": "causality",
            "match": "causalidad|relacion(?:es)? causal(?:es)?",
            "name": "las relaciones causales de las acciones",
            "function": "explicar cómo un suceso contribuye a otro según el relato",
            "error": "se presenta como causa una acción posterior o ajena al suceso",
            "sourceRecordIds": [
              "cb31435d-6c4d-5f3d-9d5c-1854e12d082b"
            ]
          },
          {
            "id": "dialogue",
            "match": "dialogos?|estilo directo",
            "name": "el diálogo en estilo directo solicitado",
            "function": "distinguir las intervenciones de los personajes y conservar su sentido",
            "error": "se atribuye una intervención al personaje equivocado",
            "sourceRecordIds": [
              "c358fc67-3da7-5ac8-bd2f-5d6e2a7466a0"
            ]
          },
          {
            "id": "punctuation",
            "match": "puntuacion|\\bcoma\\b|dos puntos|\\braya\\b",
            "name": "la puntuación expresamente pedida",
            "function": "delimitar las acciones y las intervenciones sin cambiar su sentido",
            "error": "el signo cambia quién habla o la relación entre las acciones",
            "sourceRecordIds": [
              "c358fc67-3da7-5ac8-bd2f-5d6e2a7466a0"
            ]
          }
        ],
        "dimensions": [
          {
            "id": "plot",
            "title": "Hazaña y desarrollo de los episodios",
            "production": "Enlaza los episodios de la epopeya solicitada para que pueda seguirse la acción extraordinaria y su alcance en el mundo narrado.",
            "analysis": "Explica cómo los episodios de la epopeya contribuyen a la hazaña y a su alcance en el mundo narrado, con apoyo en el texto dado.",
            "comparison": "Compara las relaciones entre los episodios y la hazaña en las epopeyas dadas, con evidencias de ambos textos.",
            "evidence": [
              "Se siguen las relaciones principales; una transición entre hechos necesita precisarse.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se invierte una relación causal o se añade un hecho incompatible con los episodios disponibles.",
              "No presenta relaciones reconocibles entre los sucesos del relato solicitado."
            ],
            "weight": 4
          },
          {
            "id": "characters",
            "title": "Personajes y acciones",
            "production": "Hace reconocibles los personajes mediante sus acciones y relaciones en el relato ficticio solicitado.",
            "analysis": "Explica las acciones y motivaciones de los personajes mediante episodios del relato proporcionado.",
            "comparison": "Contrasta acciones y motivaciones de los personajes con episodios de ambos relatos.",
            "evidence": [
              "Las acciones permiten reconocer a los personajes; una motivación requiere precisión.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se atribuye a un personaje una acción o motivación incompatible con el pasaje.",
              "No aporta evidencia reconocible de las acciones y relaciones de los personajes."
            ],
            "weight": 4
          },
          {
            "id": "narrator",
            "title": "Voz narrativa",
            "production": "Emplea una voz narrativa que permite reconocer quién cuenta los sucesos y conserva su perspectiva.",
            "analysis": "Distingue al narrador de las intervenciones de los personajes y fundamenta su perspectiva con el pasaje.",
            "comparison": "Contrasta las voces narrativas y sus perspectivas mediante evidencias de los relatos.",
            "evidence": [
              "Se reconoce quién narra; una referencia requiere distinguir mejor su perspectiva.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se atribuye al narrador una voz o información incompatible con su perspectiva.",
              "No permite reconocer la voz y perspectiva narrativas solicitadas."
            ],
            "weight": 4
          }
        ]
      },
      {
        "id": "novela-policiaca",
        "label": "novela policíaca",
        "match": "novelas?(?: breves?)? (?:policiacas?|policiales?|detectivescas?)",
        "sourceRecordIds": [
          "99d05567-92a8-5657-89d1-51adcd59def4"
        ],
        "pdfPages": [
          432,
          433,
          434,
          435
        ],
        "profile": {
          "genre": "novela policíaca",
          "target": "los hechos del caso ficticio, las acciones de los personajes y la voz narrativa del pasaje solicitado",
          "plan": "la relación entre sucesos, personajes, lugar y tiempo expresamente pedidos"
        },
        "features": [
          {
            "id": "novel-structure",
            "match": "funcion|estructura",
            "name": "la función y estructura solicitadas",
            "function": "relacionar la organización de los sucesos con el desarrollo del misterio",
            "error": "se atribuye a una parte una función incompatible con los sucesos",
            "sourceRecordIds": [
              "0a5e85ad-f6b6-5f78-bbef-775511302be0"
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
            "id": "detective-characteristics",
            "match": "caracteristicas",
            "name": "las características de la novela policíaca solicitadas",
            "function": "relacionar los rasgos del género con los hechos y la investigación del caso ficticio",
            "error": "se atribuye al texto un rasgo que no aparece en el pasaje",
            "sourceRecordIds": [
              "31f434e5-cada-5f2a-9d09-31320f0bf6a6"
            ]
          },
          {
            "id": "novel-sequences",
            "match": "secuencias?",
            "name": "las secuencias expresamente pedidas",
            "function": "relacionar narración, descripción o argumentación con su función en el pasaje",
            "error": "se clasifica una secuencia por un rasgo que no contiene",
            "sourceRecordIds": [
              "f52d3715-a015-5851-b676-4a0c71130a9e"
            ],
            "terms": [
              [
                "narrativas?",
                "la secuencia narrativa"
              ],
              [
                "descriptivas?",
                "la secuencia descriptiva"
              ],
              [
                "argumentativas?",
                "la secuencia argumentativa"
              ]
            ]
          },
          {
            "id": "novel-connectors",
            "match": "conectores",
            "name": "los conectores expresamente pedidos",
            "function": "enlazar los hechos y las hipótesis sin invertir sus relaciones",
            "error": "el conector cambia la relación entre los hechos o las hipótesis",
            "sourceRecordIds": [
              "f9ac3b8a-a2bf-5929-88f4-3643ff567d7c"
            ],
            "terms": [
              [
                "temporales?",
                "los conectores temporales"
              ],
              [
                "causales?",
                "los conectores causales"
              ],
              [
                "espaciales?",
                "los conectores espaciales"
              ],
              [
                "contrastivos?",
                "los conectores contrastivos"
              ],
              [
                "distributivos?",
                "los conectores distributivos"
              ],
              [
                "consecutivos?",
                "los conectores consecutivos"
              ]
            ]
          },
          {
            "id": "narrative-tenses",
            "match": "tiempos? verbales|pasado|presente",
            "name": "los tiempos verbales expresamente pedidos",
            "function": "distinguir el tiempo de las acciones y del diálogo solicitado",
            "error": "un cambio temporal contradice la relación entre los sucesos",
            "sourceRecordIds": [
              "f6209300-ab39-5ddd-b994-5b1f19ff658e"
            ],
            "terms": [
              [
                "pasado",
                "el pasado narrativo"
              ],
              [
                "presente",
                "el presente del diálogo"
              ]
            ]
          },
          {
            "id": "novel-adjectives",
            "match": "adjetiv",
            "name": "la adjetivación",
            "function": "caracterizar personajes o espacios según el pasaje solicitado",
            "error": "se atribuye un rasgo incompatible con el personaje o espacio",
            "sourceRecordIds": [
              "b92b30e9-f04b-5562-b7d7-30dd6956004e"
            ]
          },
          {
            "id": "narrator",
            "match": "narrador|voces|quien narra|quien cuenta",
            "name": "el narrador y las voces solicitadas",
            "function": "distinguir quién cuenta los hechos y qué información permite su perspectiva",
            "error": "se atribuye al narrador información inaccesible desde su perspectiva",
            "sourceRecordIds": [
              "0b9cea32-cfde-55da-a966-5906872c65f4"
            ]
          },
          {
            "id": "novel-characters",
            "match": "(?<!de los )(?<!de )personajes",
            "name": "los personajes expresamente trabajados",
            "function": "relacionar sus acciones y motivos con el desarrollo del caso ficticio",
            "error": "se atribuye una acción o una motivación al personaje equivocado",
            "sourceRecordIds": [
              "82c81dbf-51d8-5a27-8e80-f6a89bd6a065"
            ]
          },
          {
            "id": "novel-actants",
            "match": "actan",
            "name": "los papeles actanciales solicitados",
            "function": "explicar la función de las acciones de los personajes en sus relaciones",
            "error": "se confunde el papel actancial con el nombre del personaje",
            "sourceRecordIds": [
              "85350eb6-20be-519b-b87d-f5f72e5f2e78"
            ]
          },
          {
            "id": "clues",
            "match": "pistas|decisiones del investigador",
            "name": "las pistas y las decisiones del investigador",
            "function": "relacionar las evidencias del caso ficticio con las decisiones de la investigación",
            "error": "se atribuye a una pista un efecto incompatible con los hechos disponibles",
            "sourceRecordIds": [
              "e5e0a1fc-b960-5f09-a7a1-963de926a531"
            ]
          },
          {
            "id": "hypotheses",
            "match": "hipotesis",
            "name": "las hipótesis expresamente trabajadas",
            "function": "distinguir las explicaciones descartadas de la que respaldan los hechos disponibles en el caso ficticio",
            "error": "se presenta como comprobada una hipótesis que los hechos disponibles no respaldan",
            "sourceRecordIds": [
              "e5e0a1fc-b960-5f09-a7a1-963de926a531"
            ]
          },
          {
            "id": "motivations",
            "match": "motivaciones|intenciones de (?:los )?personajes",
            "name": "las motivaciones de los personajes",
            "function": "inferir las razones de sus acciones con los pasajes proporcionados",
            "error": "se atribuye al personaje una intención sin apoyo en el pasaje",
            "sourceRecordIds": [
              "aa9eec50-3ced-5b01-b1c5-84de073cc8c2"
            ]
          },
          {
            "id": "novel-themes",
            "match": "temas?",
            "name": "el tema",
            "function": "relacionar las acciones con las ideas del relato",
            "error": "se atribuye un tema sin apoyo en los episodios",
            "sourceRecordIds": [
              "aa9eec50-3ced-5b01-b1c5-84de073cc8c2"
            ]
          },
          {
            "id": "causality",
            "match": "causalidad|relacion(?:es)? causal(?:es)?",
            "name": "las relaciones causales de las acciones",
            "function": "explicar cómo un suceso contribuye a otro según el relato",
            "error": "se presenta como causa una acción posterior o ajena al suceso",
            "sourceRecordIds": [
              "d131306f-9eb7-5ab4-b089-fe559054249e"
            ]
          },
          {
            "id": "dialogue",
            "match": "dialogos?|estilo directo",
            "name": "el diálogo en estilo directo solicitado",
            "function": "distinguir las intervenciones de los personajes y conservar su sentido",
            "error": "se atribuye una intervención al personaje equivocado",
            "sourceRecordIds": [
              "1db2098b-8093-5813-bf63-cff6e98caaf2"
            ]
          },
          {
            "id": "suspense",
            "match": "suspens",
            "name": "los recursos descriptivos de suspense solicitados",
            "function": "administrar la información y la expectativa del pasaje",
            "error": "se atribuye suspense a información que contradice la escena",
            "sourceRecordIds": [
              "f53be5d9-b6ec-5457-8b96-bad71568bc34"
            ]
          },
          {
            "id": "punctuation",
            "match": "puntuacion|\\bcoma\\b|dos puntos|\\braya\\b",
            "name": "la puntuación expresamente pedida",
            "function": "delimitar las acciones y las intervenciones sin cambiar su sentido",
            "error": "el signo cambia quién habla o la relación entre las acciones",
            "sourceRecordIds": [
              "f53be5d9-b6ec-5457-8b96-bad71568bc34"
            ]
          }
        ],
        "dimensions": [
          {
            "id": "plot",
            "title": "Desarrollo del misterio",
            "production": "Enlaza los sucesos de la novela policíaca solicitada de modo que pueda seguirse el desarrollo del misterio sin contradicciones entre los hechos del caso ficticio.",
            "analysis": "Explica cómo los sucesos del texto proporcionado contribuyen al desarrollo del misterio, sin atribuir al fragmento una resolución que no permite conocer.",
            "comparison": "Compara el desarrollo del misterio en las novelas policíacas dadas, apoyándose en los hechos disponibles de ambos textos.",
            "evidence": [
              "Se siguen las relaciones principales; una transición entre hechos necesita precisarse.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se invierte una relación causal o se añade un hecho incompatible con los episodios disponibles.",
              "No presenta relaciones reconocibles entre los sucesos del relato solicitado."
            ],
            "weight": 4
          },
          {
            "id": "characters",
            "title": "Personajes y acciones",
            "production": "Hace reconocibles los personajes mediante sus acciones y relaciones en el relato ficticio solicitado.",
            "analysis": "Explica las acciones y motivaciones de los personajes mediante episodios del relato proporcionado.",
            "comparison": "Contrasta acciones y motivaciones de los personajes con episodios de ambos relatos.",
            "evidence": [
              "Las acciones permiten reconocer a los personajes; una motivación requiere precisión.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se atribuye a un personaje una acción o motivación incompatible con el pasaje.",
              "No aporta evidencia reconocible de las acciones y relaciones de los personajes."
            ],
            "weight": 4
          },
          {
            "id": "narrator",
            "title": "Voz narrativa",
            "production": "Emplea una voz narrativa que permite reconocer quién cuenta los sucesos y conserva su perspectiva.",
            "analysis": "Distingue al narrador de las intervenciones de los personajes y fundamenta su perspectiva con el pasaje.",
            "comparison": "Contrasta las voces narrativas y sus perspectivas mediante evidencias de los relatos.",
            "evidence": [
              "Se reconoce quién narra; una referencia requiere distinguir mejor su perspectiva.",
              "Presenta elementos pertinentes, pero no explica una relación necesaria para comprenderlos.",
              "Se atribuye al narrador una voz o información incompatible con su perspectiva.",
              "No permite reconocer la voz y perspectiva narrativas solicitadas."
            ],
            "weight": 4
          }
        ]
      }
    ]
  }
]} as unknown as EvaluationCatalog
