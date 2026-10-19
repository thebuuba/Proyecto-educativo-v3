import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV129 } from './catalog-v129'
/** Exact130 payload checked against Development, including the reviewed HCS fourth-grade metadata. */
export const evaluationCatalogV130={...evaluationCatalogV129,optativeLanguageModules:[
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
        "match": "novelas?(?: breves?)? (?:policiacas?|policial(?:es)?|detectivescas?)",
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
  },
  {
    "id": "optativa-hlm-len-6",
    "grade": 6,
    "subjectCode": "OPT-HLM-LEN-6",
    "subjectName": "Análisis y Producción de Textos Periodísticos y Publicitarios",
    "optativeExitName": "Humanidades y Lenguas Modernas",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "6ebb8ac8-f9d0-5530-9c53-366f87055eee",
    "pdfPages": [
      437,
      438,
      439,
      440,
      441,
      442,
      443,
      444
    ],
    "topics": [
      {
        "id": "editorial",
        "label": "editorial",
        "match": "editorial(?:es)?",
        "sourceRecordIds": [
          "effacfee-3177-5b03-bfad-535ca36013f8"
        ],
        "pdfPages": [
          437,
          438
        ],
        "profile": {
          "genre": "editorial",
          "target": "la tesis, sus argumentos y la postura textual del editorial",
          "plan": "la relación entre tesis, argumentos,tema y destinatario solicitados"
        },
        "planningComponents": [
          [
            "tesis",
            "la tesis"
          ],
          [
            "argumentos",
            "los argumentos"
          ],
          [
            "tema",
            "el tema"
          ],
          [
            "destinatario|audiencia",
            "el destinatario"
          ],
          [
            "intencion",
            "la intención"
          ]
        ],
        "features": [
          {
            "id": "meaning",
            "match": "intencion|proposito|funcion",
            "name": "la intención comunicativa solicitada",
            "function": "relacionar los indicios del mensaje con su propósito comunicativo",
            "error": "se atribuye al texto un propósito incompatible con sus indicios",
            "sourceRecordIds": [
              "3b8d7bd8-eb24-5835-b020-68e16113c8a0"
            ],
            "terms": [
              [
                "funcion",
                "la función comunicativa"
              ],
              [
                "intencion|proposito",
                "la intención comunicativa"
              ]
            ]
          },
          {
            "id": "organization",
            "match": "estructura|titulo|introduccion|desarrollo|conclusion",
            "name": "la estructura expresamente trabajada",
            "function": "relacionar las partes solicitadas con el desarrollo del mensaje",
            "error": "se atribuye a una parte una función incompatible con el texto",
            "sourceRecordIds": [
              "9d281a3a-b0ec-5d4a-ab3a-dab12dcca2e8"
            ],
            "terms": [
              [
                "titulo",
                "el título"
              ],
              [
                "introduccion",
                "la introducción"
              ],
              [
                "desarrollo",
                "el desarrollo"
              ],
              [
                "conclusion",
                "la conclusión"
              ]
            ]
          },
          {
            "id": "characteristics",
            "match": "caracteristicas",
            "name": "las características del editorial solicitadas",
            "function": "relacionar los rasgos del género con la postura y los apoyos del texto",
            "error": "se atribuye al editorial un rasgo ausente o contrario a su contenido",
            "sourceRecordIds": [
              "5aab1be2-3982-5f0c-bdb4-860e2acaa398"
            ]
          },
          {
            "id": "argumentation",
            "match": "argumentos?",
            "name": "los argumentos solicitados",
            "function": "relacionar las razones con la tesis y distinguir afirmaciones sustentadas de suposiciones",
            "error": "se atribuye a una razón un apoyo que no ofrece al planteamiento",
            "sourceRecordIds": [
              "69daf246-1ebb-505b-adc4-7f6269e17aa6"
            ],
            "terms": [
              [
                "logicos",
                "los argumentos lógicos"
              ],
              [
                "autoridad",
                "los argumentos de autoridad"
              ],
              [
                "ejemplos",
                "los argumentos de ejemplos"
              ]
            ]
          },
          {
            "id": "connectors",
            "match": "conectores",
            "name": "los conectores solicitados",
            "function": "enlazar las razones y las reformulaciones conservando sus relaciones",
            "error": "el conector invierte una causa o cambia el sentido de una explicación",
            "sourceRecordIds": [
              "02d4b068-b7dc-58a8-982c-80c804d5b289"
            ],
            "terms": [
              [
                "causa|causales",
                "los conectores causales"
              ],
              [
                "reformulacion",
                "los conectores de reformulación"
              ],
              [
                "explicacion",
                "los conectores de explicación"
              ]
            ]
          },
          {
            "id": "nominalization",
            "match": "nominaliza",
            "name": "las nominalizaciones solicitadas",
            "function": "relacionar las expresiones nominales con las acciones o ideas que representan",
            "error": "se atribuye a la expresión nominal una acción o idea ajena al pasaje",
            "sourceRecordIds": [
              "92fd5682-a4f0-58ca-89ad-9b24d1faabee"
            ]
          },
          {
            "id": "opinion-verbs",
            "match": "indicativo|verbos.*opinion|primera persona",
            "name": "los verbos y la persona gramatical solicitados",
            "function": "relacionar la forma verbal con la afirmación o postura expresada por la voz editorial",
            "error": "se confunde una afirmación del medio con la voz de otro emisor",
            "sourceRecordIds": [
              "1dd5f258-8db5-5cbf-8b1a-23b28a147888"
            ],
            "terms": [
              [
                "indicativo",
                "el modo indicativo"
              ],
              [
                "opinion",
                "los verbos de opinión"
              ],
              [
                "primera persona(?: del)? plural",
                "la primera persona del plural"
              ]
            ]
          },
          {
            "id": "clauses",
            "match": "oraciones|coordinad|subordinad",
            "name": "las oraciones expresamente trabajadas",
            "function": "relacionar las proposiciones y sus enlaces conservando el razonamiento",
            "error": "se atribuye al enlace una relación distinta de la expresada",
            "sourceRecordIds": [
              "990f5e1a-5599-5e91-b324-63107efcdf13"
            ],
            "terms": [
              [
                "coordinad",
                "las oraciones coordinadas"
              ],
              [
                "subordinad",
                "las oraciones subordinadas"
              ]
            ]
          },
          {
            "id": "textual-marks",
            "match": "marcas textuales",
            "name": "las marcas textuales solicitadas",
            "function": "reconocer la organización y la postura comunicativa mediante indicios del editorial",
            "error": "se atribuye a una marca una función incompatible con el pasaje",
            "sourceRecordIds": [
              "611b2d60-64cd-5530-9e8e-ad7a08c81938"
            ]
          },
          {
            "id": "rhetoric",
            "match": "retoric|figuras|metafora|personificacion|paradoja|hiperbole|eufemismo|perifrasis|metonimia",
            "name": "los recursos retóricos solicitados",
            "function": "relacionar los recursos expresivos con el sentido y el efecto del mensaje",
            "error": "se identifica un recurso inexistente o se atribuye un efecto contrario al pasaje",
            "sourceRecordIds": [
              "9aa38957-8ae6-5284-a3e2-9d0a769279b2"
            ],
            "terms": [
              [
                "metafora",
                "la metáfora"
              ],
              [
                "personificacion",
                "la personificación"
              ],
              [
                "paradoja",
                "la paradoja"
              ],
              [
                "hiperbole",
                "la hipérbole"
              ],
              [
                "eufemismo",
                "el eufemismo"
              ],
              [
                "perifrasis",
                "la perífrasis"
              ]
            ]
          },
          {
            "id": "stance",
            "match": "tesis|postura|punto de vista|ideologi",
            "name": "la postura textual y la tesis solicitadas",
            "function": "vincular la posición expresada con las razones del texto, sin exigir adhesión personal",
            "error": "se atribuye al emisor una postura o tesis que contradice el mensaje",
            "sourceRecordIds": [
              "c2917caf-b852-5ba4-ad44-eb5ee95617a2"
            ],
            "terms": [
              [
                "tesis",
                "la tesis"
              ],
              [
                "postura|punto de vista|ideologi",
                "la postura expresada por el emisor"
              ]
            ]
          }
        ],
        "dimensions": [
          {
            "id": "stance",
            "title": "Tesis y postura textual",
            "production": "Formula una tesis reconocible y una postura textual coherente con el tema solicitado en el editorial, sin que se exija adhesión personal.",
            "analysis": "Reconoce la tesis y la postura expresadas en el editorial y las fundamenta con indicios del texto disponible.",
            "comparison": "Contrasta las tesis y las posturas de los textos con evidencias de ambos.",
            "evidence": [
              "La tesis y postura se reconocen; una relación con el tema requiere precisión.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "Se atribuye al texto una tesis o postura que contradice sus afirmaciones.",
              "No aporta una tesis reconocible ni evidencia de la postura textual solicitada."
            ],
            "weight": 4
          },
          {
            "id": "argumentation",
            "title": "Relación entre tesis y argumentos",
            "production": "Relaciona los argumentos solicitados con la tesis y distingue afirmaciones sustentadas de suposiciones.",
            "analysis": "Explica cómo las razones del texto apoyan su tesis, con los datos y ejemplos disponibles.",
            "comparison": "Contrasta cómo las razones de ambos textos apoyan sus respectivas tesis.",
            "evidence": [
              "Los argumentos principales apoyan la tesis; una conexión necesita precisarse.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "Una razón contradice la tesis o se atribuye un apoyo que la evidencia no ofrece.",
              "No relaciona razones reconocibles con la tesis del texto."
            ],
            "weight": 4
          },
          {
            "id": "organization",
            "title": "Organización del razonamiento",
            "production": "Organiza las partes solicitadas para que pueda seguirse el planteamiento y el desarrollo de sus razones.",
            "analysis": "Relaciona la organización del texto con el desarrollo de su planteamiento y sus razones.",
            "comparison": "Compara cómo la organización de cada texto contribuye a desarrollar su planteamiento.",
            "evidence": [
              "Se sigue el desarrollo principal; una transición requiere aclararse.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "El orden o los enlaces cambian una relación necesaria entre las ideas.",
              "No presenta una organización reconocible del planteamiento y sus apoyos."
            ],
            "weight": 4
          }
        ]
      },
      {
        "id": "columna-periodistica",
        "label": "columna periodística",
        "match": "columnas? (?:periodisticas?|de opinion)",
        "sourceRecordIds": [
          "ffcc1271-128f-53c7-b9be-6cf17f2237b5"
        ],
        "pdfPages": [
          439,
          440
        ],
        "profile": {
          "genre": "columna periodística",
          "target": "la tesis, los argumentos y el comentario de autor de la columna",
          "plan": "la relación entre tesis, argumentos, tema y destinatario solicitados"
        },
        "planningComponents": [
          [
            "tesis",
            "la tesis"
          ],
          [
            "argumentos",
            "los argumentos"
          ],
          [
            "tema",
            "el tema"
          ],
          [
            "destinatario|audiencia",
            "el destinatario"
          ],
          [
            "intencion",
            "la intención"
          ]
        ],
        "features": [
          {
            "id": "meaning",
            "match": "intencion|proposito|funcion",
            "name": "la intención comunicativa solicitada",
            "function": "relacionar los indicios del mensaje con su propósito comunicativo",
            "error": "se atribuye al texto un propósito incompatible con sus indicios",
            "sourceRecordIds": [
              "2a5f26c3-115a-519a-91c1-bdc3a993a100"
            ],
            "terms": [
              [
                "funcion",
                "la función comunicativa"
              ],
              [
                "intencion|proposito",
                "la intención comunicativa"
              ]
            ]
          },
          {
            "id": "organization",
            "match": "estructura|punto de partida|conclusion",
            "name": "la estructura expresamente trabajada",
            "function": "relacionar las partes solicitadas con el desarrollo del mensaje",
            "error": "se atribuye a una parte una función incompatible con el texto",
            "sourceRecordIds": [
              "700b8e7f-58fc-5b55-a00f-18b87075bd25"
            ],
            "terms": [
              [
                "punto de partida",
                "el punto de partida"
              ],
              [
                "tesis",
                "la tesis"
              ],
              [
                "argumentos",
                "los argumentos"
              ],
              [
                "conclusion",
                "la conclusión"
              ]
            ]
          },
          {
            "id": "characteristics",
            "match": "caracteristicas",
            "name": "las características de la columna solicitadas",
            "function": "relacionar el comentario de autor con sus razones y el asunto tratado",
            "error": "se atribuye a la columna un rasgo que no aparece en el pasaje",
            "sourceRecordIds": [
              "59b74eed-4b78-5ced-a901-5f6865a7f1dd"
            ]
          },
          {
            "id": "stance",
            "match": "tesis|postura|punto de vista|ideologi",
            "name": "la postura textual y la tesis solicitadas",
            "function": "vincular la posición expresada con las razones del texto, sin exigir adhesión personal",
            "error": "se atribuye al emisor una postura o tesis que contradice el mensaje",
            "sourceRecordIds": [
              "dc587122-0f3e-51dd-80df-b512c9321715"
            ],
            "terms": [
              [
                "tesis",
                "la tesis"
              ],
              [
                "postura|punto de vista|ideologi",
                "la postura expresada por el emisor"
              ]
            ]
          },
          {
            "id": "opinion-verbs",
            "match": "verbos.*opinion",
            "name": "los verbos de opinión",
            "function": "distinguir la postura del autor de los hechos que comenta",
            "error": "se atribuye una opinión a quien no la expresa en el texto",
            "sourceRecordIds": [
              "ec1e4f1f-9408-5d94-93fa-bd95f713d586"
            ]
          },
          {
            "id": "markers",
            "match": "marcadores",
            "name": "los marcadores solicitados",
            "function": "organizar el comentario y hacer reconocible la postura expresada",
            "error": "se atribuye al marcador una relación o postura contraria al pasaje",
            "sourceRecordIds": [
              "086c5692-8ea8-5ccf-ac4b-e927b7330ab9"
            ]
          },
          {
            "id": "connectors",
            "match": "conectores",
            "name": "los conectores solicitados",
            "function": "enlazar las razones y las reformulaciones conservando sus relaciones",
            "error": "el conector invierte una causa o cambia el sentido de una explicación",
            "sourceRecordIds": [
              "7c3a0dd6-45f0-58c5-b61e-440c4a4c916e"
            ],
            "terms": [
              [
                "causa|causales",
                "los conectores causales"
              ],
              [
                "reformulacion",
                "los conectores de reformulación"
              ],
              [
                "explicacion",
                "los conectores de explicación"
              ]
            ]
          },
          {
            "id": "nominalization",
            "match": "nominaliza",
            "name": "las nominalizaciones solicitadas",
            "function": "relacionar las expresiones nominales con las acciones o ideas que representan",
            "error": "se atribuye a la expresión nominal una acción o idea ajena al pasaje",
            "sourceRecordIds": [
              "bf5d19a1-c561-5f6e-8a5c-2abf265a89b5"
            ]
          },
          {
            "id": "adjectives",
            "match": "adjetiv",
            "name": "los adjetivos solicitados",
            "function": "precisar la caracterización o valoración expresada en el mensaje",
            "error": "se atribuye al adjetivo una valoración incompatible con el pasaje",
            "sourceRecordIds": [
              "14a0a727-d6bb-5edf-bd69-10c3a9fd804b"
            ]
          },
          {
            "id": "rhetoric",
            "match": "retoric|figuras|metafora|personificacion|paradoja|hiperbole|eufemismo|perifrasis|metonimia",
            "name": "los recursos retóricos solicitados",
            "function": "relacionar los recursos expresivos con el sentido y el efecto del mensaje",
            "error": "se identifica un recurso inexistente o se atribuye un efecto contrario al pasaje",
            "sourceRecordIds": [
              "0518f821-702c-53b1-b552-c98d7dd50132"
            ]
          },
          {
            "id": "argumentation",
            "match": "argumentos?",
            "name": "los argumentos solicitados",
            "function": "relacionar las razones con la tesis y distinguir afirmaciones sustentadas de suposiciones",
            "error": "se atribuye a una razón un apoyo que no ofrece al planteamiento",
            "sourceRecordIds": [
              "74032649-fcad-5ea6-b5bb-5b9b30a9e091"
            ],
            "terms": [
              [
                "logicos",
                "los argumentos lógicos"
              ],
              [
                "autoridad",
                "los argumentos de autoridad"
              ],
              [
                "ejemplos",
                "los argumentos de ejemplos"
              ]
            ]
          }
        ],
        "dimensions": [
          {
            "id": "stance",
            "title": "Tesis y postura textual",
            "production": "Formula una tesis reconocible y una postura textual coherente con el tema solicitado en la columna periodística, sin que se exija adhesión personal.",
            "analysis": "Reconoce la tesis y la postura expresadas en la columna periodística y las fundamenta con indicios del texto disponible.",
            "comparison": "Contrasta las tesis y las posturas de los textos con evidencias de ambos.",
            "evidence": [
              "La tesis y postura se reconocen; una relación con el tema requiere precisión.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "Se atribuye al texto una tesis o postura que contradice sus afirmaciones.",
              "No aporta una tesis reconocible ni evidencia de la postura textual solicitada."
            ],
            "weight": 4
          },
          {
            "id": "argumentation",
            "title": "Relación entre tesis y argumentos",
            "production": "Relaciona los argumentos solicitados con la tesis y distingue afirmaciones sustentadas de suposiciones.",
            "analysis": "Explica cómo las razones del texto apoyan su tesis, con los datos y ejemplos disponibles.",
            "comparison": "Contrasta cómo las razones de ambos textos apoyan sus respectivas tesis.",
            "evidence": [
              "Los argumentos principales apoyan la tesis; una conexión necesita precisarse.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "Una razón contradice la tesis o se atribuye un apoyo que la evidencia no ofrece.",
              "No relaciona razones reconocibles con la tesis del texto."
            ],
            "weight": 4
          },
          {
            "id": "organization",
            "title": "Organización del razonamiento",
            "production": "Organiza las partes solicitadas para que pueda seguirse el planteamiento y el desarrollo de sus razones.",
            "analysis": "Relaciona la organización del texto con el desarrollo de su planteamiento y sus razones.",
            "comparison": "Compara cómo la organización de cada texto contribuye a desarrollar su planteamiento.",
            "evidence": [
              "Se sigue el desarrollo principal; una transición requiere aclararse.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "El orden o los enlaces cambian una relación necesaria entre las ideas.",
              "No presenta una organización reconocible del planteamiento y sus apoyos."
            ],
            "weight": 4
          }
        ]
      },
      {
        "id": "anuncio-publicitario",
        "label": "anuncio publicitario",
        "match": "anuncios? publicitarios?",
        "sourceRecordIds": [
          "59e46def-4cec-5cd0-809d-a2b5b58d0db2"
        ],
        "pdfPages": [
          440,
          441
        ],
        "profile": {
          "genre": "anuncio publicitario",
          "target": "el mensaje, su intención y los componentes expresamente pedidos del anuncio",
          "plan": "la relación entre intención, destinatario y componentes expresamente pedidos"
        },
        "planningComponents": [
          [
            "titular",
            "el titular"
          ],
          [
            "eslogan",
            "el eslogan"
          ],
          [
            "imagen",
            "la relación con la imagen proporcionada o solicitada"
          ],
          [
            "informacion(?:es)? complementaria",
            "la información complementaria"
          ],
          [
            "destinatario|audiencia",
            "el destinatario"
          ],
          [
            "intencion",
            "la intención"
          ],
          [
            "tipo",
            "el tipo de anuncio"
          ]
        ],
        "features": [
          {
            "id": "meaning",
            "match": "intencion|proposito|funcion",
            "name": "la intención comunicativa solicitada",
            "function": "relacionar los indicios del mensaje con su propósito comunicativo",
            "error": "se atribuye al texto un propósito incompatible con sus indicios",
            "sourceRecordIds": [
              "6c7dd8cf-8ade-5d76-be4d-87b28ad73ea7"
            ],
            "terms": [
              [
                "funcion",
                "la función comunicativa"
              ],
              [
                "intencion|proposito",
                "la intención comunicativa"
              ]
            ]
          },
          {
            "id": "organization",
            "match": "estructura|titular|informacion(?:es)? complementaria",
            "name": "la estructura expresamente trabajada",
            "function": "relacionar las partes solicitadas con el desarrollo del mensaje",
            "error": "se atribuye a una parte una función incompatible con el texto",
            "sourceRecordIds": [
              "f1414995-f54c-5417-bbd3-d454371ffc66"
            ],
            "terms": [
              [
                "titular",
                "el titular"
              ],
              [
                "eslogan",
                "el eslogan"
              ],
              [
                "informacion(?:es)? complementaria",
                "la información complementaria"
              ]
            ]
          },
          {
            "id": "ad-types",
            "match": "\\btipos? de anuncios?\\b",
            "name": "el tipo de anuncio solicitado",
            "function": "relacionar las características del anuncio con su propósito y el destinatario dado",
            "error": "se clasifica el anuncio por un rasgo ausente o incompatible con su propósito",
            "sourceRecordIds": [
              "ea57ff8c-efd9-5ea2-bb7f-a1b35fecfcf8"
            ]
          },
          {
            "id": "language-values",
            "match": "denotativ|informativ|expresiv",
            "name": "los valores del lenguaje expresamente trabajados",
            "function": "distinguir información literal de asociaciones expresivas mediante indicios del anuncio",
            "error": "se presenta una asociación simbólica como si fuera información literal",
            "sourceRecordIds": [
              "9d0bf2a0-c734-5453-946a-e38c2d8a29f6"
            ],
            "terms": [
              [
                "denotativ|informativ",
                "el valor denotativo o informativo"
              ],
              [
                "connotativ|expresiv",
                "el valor connotativo o expresivo"
              ]
            ]
          },
          {
            "id": "persuasion",
            "match": "persuasiv|^(?!.*(?:denotativ|informativ|expresiv)).*connotativ",
            "name": "el lenguaje persuasivo y connotativo solicitado",
            "function": "relacionar las asociaciones y apelaciones del mensaje con su intención",
            "error": "se atribuye al mensaje una asociación o apelación incompatible con sus recursos",
            "sourceRecordIds": [
              "6269a8f7-0052-5955-9fdd-76752b9b10d4"
            ],
            "terms": [
              [
                "persuasiv",
                "el lenguaje persuasivo"
              ],
              [
                "connotativ",
                "el lenguaje connotativo"
              ]
            ]
          },
          {
            "id": "audiovisual",
            "match": "audiovisual",
            "name": "los recursos audiovisuales expresamente pedidos",
            "function": "relacionar los apoyos visuales o sonoros disponibles con el mensaje",
            "error": "el apoyo contradice el contenido o se atribuye un efecto a un recurso inexistente",
            "sourceRecordIds": [
              "6498dc63-9b25-59cf-b725-9eb46592a690"
            ]
          },
          {
            "id": "ad-resources",
            "match": "recursos (?:graficos|fonicos|morfosintacticos|lexicos|semanticos)",
            "name": "los recursos expresamente pedidos",
            "function": "relacionar los recursos del anuncio con su sentido y su propósito",
            "error": "se identifica un recurso ausente o se le atribuye una función incompatible",
            "sourceRecordIds": [
              "430f12ae-22a9-55a5-8d93-cba407c0b399"
            ],
            "terms": [
              [
                "graficos",
                "los recursos gráficos"
              ],
              [
                "fonicos",
                "los recursos fónicos"
              ],
              [
                "morfosintacticos",
                "los recursos morfosintácticos"
              ],
              [
                "lexicos",
                "los recursos léxicos"
              ],
              [
                "semanticos",
                "los recursos semánticos"
              ]
            ]
          },
          {
            "id": "address",
            "match": "vocativo|segunda persona",
            "name": "la apelación gramatical solicitada",
            "function": "reconocer cómo el mensaje se dirige a su destinatario",
            "error": "se confunde el destinatario con quien emite el mensaje",
            "sourceRecordIds": [
              "fa017519-3024-5b4f-a02a-5dd7d58c5a00"
            ],
            "terms": [
              [
                "vocativo",
                "el vocativo"
              ],
              [
                "segunda persona",
                "la segunda persona"
              ]
            ]
          },
          {
            "id": "imperative",
            "match": "imperativo",
            "name": "el modo imperativo",
            "function": "relacionar la forma verbal con la acción propuesta al destinatario",
            "error": "se confunde una afirmación o descripción con la acción propuesta",
            "sourceRecordIds": [
              "2cd98309-f70a-5a2e-9498-ca6fd24f0de4"
            ]
          },
          {
            "id": "adjectives",
            "match": "adjetiv",
            "name": "los adjetivos solicitados",
            "function": "precisar la caracterización o valoración expresada en el mensaje",
            "error": "se atribuye al adjetivo una valoración incompatible con el pasaje",
            "sourceRecordIds": [
              "91546f37-9332-597e-af99-c8b0c659928a"
            ]
          },
          {
            "id": "rhetoric",
            "match": "retoric|figuras|metafora|personificacion|paradoja|hiperbole|eufemismo|perifrasis|metonimia",
            "name": "los recursos retóricos solicitados",
            "function": "relacionar los recursos expresivos con el sentido y el efecto del mensaje",
            "error": "se identifica un recurso inexistente o se atribuye un efecto contrario al pasaje",
            "sourceRecordIds": [
              "82653d65-a22d-557e-855f-f648ab28daac"
            ]
          },
          {
            "id": "formal-aspects",
            "match": "aspectos formales|registro visual|registro sonoro",
            "name": "los aspectos formales expresamente solicitados",
            "function": "organizar la percepción del mensaje mediante los componentes disponibles",
            "error": "se atribuye a una elección formal una función que contradice el mensaje",
            "sourceRecordIds": [
              "7659635a-9751-5a98-8700-692f1a334d86"
            ]
          },
          {
            "id": "design",
            "match": "estetica|legib|diseno|disena|disposicion grafica|color|espacios",
            "name": "la relación entre diseño, legibilidad e intención",
            "function": "hacer legible y comprensible el anuncio con los recursos proporcionados, sin imponer gustos o acabado profesional",
            "error": "la disposición dificulta leer o relacionar los componentes centrales",
            "sourceRecordIds": [
              "f4723e0b-0d33-592d-92a8-138ca75c3536"
            ]
          },
          {
            "id": "slogan",
            "match": "eslogan",
            "name": "el eslogan solicitado",
            "function": "vincular una expresión breve con el mensaje y el propósito del anuncio",
            "error": "el eslogan comunica una idea contraria al mensaje",
            "sourceRecordIds": [
              "36155cab-071c-5984-9783-33b776aef822"
            ]
          },
          {
            "id": "image",
            "match": "imagen(?:es)?",
            "name": "la imagen proporcionada o solicitada",
            "function": "relacionar la información visual con el contenido y la intención del anuncio",
            "error": "la imagen contradice el mensaje o se le atribuye información que no contiene",
            "sourceRecordIds": [
              "6aaf3b03-4135-50af-b5e4-039eeb536214"
            ]
          },
          {
            "id": "manipulation",
            "match": "manipul|discrimin|estereotipo",
            "name": "la presencia o ausencia de usos manipuladores o discriminatorios",
            "function": "fundamentar el análisis de los recursos con evidencias del mensaje, sin prejuzgar una postura como correcta",
            "error": "se atribuye una estrategia al mensaje sin evidencia o se presenta una interpretación como un hecho comprobado",
            "sourceRecordIds": [
              "9080d87a-fb33-5812-afbd-dbee7737fbc3"
            ],
            "terms": [
              [
                "manipul",
                "la presencia o ausencia de usos manipuladores"
              ],
              [
                "discrimin",
                "la presencia o ausencia de usos discriminatorios"
              ],
              [
                "estereotipo",
                "la presencia o ausencia de estereotipos"
              ]
            ],
            "analysisLevels": [
              "Fundamenta {target} mediante indicios del mensaje y distingue lo que observa de lo que infiere, sin exigir adhesión a una postura.",
              "La conclusión sobre {target} tiene apoyo en el mensaje; un indicio o inferencia necesita precisarse.",
              "Menciona indicios pertinentes, pero no muestra cómo respaldan su conclusión sobre los recursos solicitados.",
              "Atribuye al mensaje una estrategia ausente o descarta una identificable sin apoyo en el texto disponible.",
              "No sostiene una conclusión verificable sobre la presencia o ausencia de los recursos analizados."
            ]
          },
          {
            "id": "product-values",
            "match": "literal|simbolic",
            "name": "los valores literales o simbólicos expresamente pedidos",
            "function": "distinguir las características declaradas del producto de las asociaciones simbólicas propuestas",
            "error": "se presenta una asociación simbólica como una característica literal del producto",
            "sourceRecordIds": [
              "e76241ba-f77e-5c79-b461-2b8b82914fa4"
            ],
            "terms": [
              [
                "literal",
                "el valor literal"
              ],
              [
                "simbolic",
                "el valor simbólico"
              ]
            ]
          },
          {
            "id": "register",
            "match": "\\bregistro\\b(?!\\s+(?:visual|sonoro))",
            "name": "el registro expresamente acordado",
            "function": "adecuar el vocabulario y las formas de dirigirse al destinatario según las condiciones del ejercicio",
            "error": "el registro contradice las condiciones comunicativas acordadas",
            "sourceRecordIds": [
              "e2b16fe6-9e3e-5525-855e-764d243a9b7f"
            ]
          }
        ],
        "dimensions": [
          {
            "id": "meaning",
            "title": "Intención y destinatario del mensaje",
            "production": "Relaciona el mensaje del anuncio ficticio con su propósito y el destinatario dados.",
            "analysis": "Reconoce el propósito y el destinatario previsto mediante indicios del mensaje, distinguiendo información literal de inferencias.",
            "comparison": "Contrasta los propósitos y destinatarios previstos con indicios de ambos mensajes.",
            "evidence": [
              "El propósito y destinatario se reconocen; una relación con el mensaje necesita aclararse.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "Se atribuye al mensaje un propósito o destinatario incompatible con sus indicios.",
              "No aporta evidencia reconocible de la relación entre mensaje, propósito y destinatario."
            ],
            "weight": 4
          },
          {
            "id": "organization",
            "title": "Organización de los componentes",
            "production": "Organiza únicamente los componentes y recursos solicitados para que el mensaje pueda leerse o comprenderse.",
            "analysis": "Relaciona los componentes disponibles del mensaje con su organización y su intención.",
            "comparison": "Contrasta cómo los componentes disponibles de ambos mensajes contribuyen a su organización.",
            "evidence": [
              "Los componentes principales se relacionan; una disposición o referencia necesita precisarse.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "La disposición cambia una relación central o impide comprender un componente necesario.",
              "No permite reconocer las relaciones entre los componentes del mensaje solicitado."
            ],
            "weight": 4
          }
        ]
      },
      {
        "id": "propaganda-politica",
        "label": "propaganda política",
        "match": "propagandas? politicas?",
        "sourceRecordIds": [
          "caa2576e-c17e-51b5-ad35-d2d26c1354e3"
        ],
        "pdfPages": [
          441,
          442,
          443
        ],
        "profile": {
          "genre": "propaganda política ficticia",
          "target": "el mensaje ficticio y los recursos persuasivos expresamente trabajados",
          "plan": "la relación entre intención, destinatario y componentes expresamente pedidos"
        },
        "planningComponents": [
          [
            "identificador",
            "el identificador ficticio"
          ],
          [
            "eslogan",
            "el eslogan"
          ],
          [
            "imagen",
            "la relación con la imagen proporcionada o solicitada"
          ],
          [
            "informacion(?:es)? complementaria",
            "la información complementaria"
          ],
          [
            "destinatario|audiencia",
            "el destinatario"
          ],
          [
            "intencion",
            "la intención"
          ]
        ],
        "features": [
          {
            "id": "meaning",
            "match": "intencion|proposito|funcion",
            "name": "la intención comunicativa solicitada",
            "function": "relacionar los indicios del mensaje con su propósito comunicativo",
            "error": "se atribuye al texto un propósito incompatible con sus indicios",
            "sourceRecordIds": [
              "d5303c63-6a10-5a84-909d-71bbcbb3d3bb"
            ],
            "terms": [
              [
                "funcion",
                "la función comunicativa"
              ],
              [
                "intencion|proposito",
                "la intención comunicativa"
              ]
            ]
          },
          {
            "id": "organization",
            "match": "estructura|informacion(?:es)? complementaria",
            "name": "la estructura expresamente trabajada",
            "function": "relacionar las partes solicitadas con el desarrollo del mensaje",
            "error": "se atribuye a una parte una función incompatible con el texto",
            "sourceRecordIds": [
              "d5303c63-6a10-5a84-909d-71bbcbb3d3bb"
            ],
            "terms": [
              [
                "identificador",
                "el identificador"
              ],
              [
                "eslogan",
                "el eslogan"
              ],
              [
                "informacion(?:es)? complementaria",
                "la información complementaria"
              ]
            ]
          },
          {
            "id": "codes",
            "match": "codigos|verbal|iconograf",
            "name": "los códigos expresamente trabajados",
            "function": "relacionar el mensaje verbal y los signos visuales disponibles",
            "error": "se atribuye al signo un sentido contrario al mensaje",
            "sourceRecordIds": [
              "09c9772a-3b42-50ec-a705-04cc401878d7"
            ],
            "terms": [
              [
                "verbal",
                "el código verbal"
              ],
              [
                "iconograf",
                "el código iconográfico"
              ]
            ]
          },
          {
            "id": "persuasion",
            "match": "persuasiv|connotativ",
            "name": "el lenguaje persuasivo y connotativo solicitado",
            "function": "relacionar asociaciones y apelaciones con la intención del mensaje ficticio, sin exigir adhesión",
            "error": "se atribuye al mensaje una apelación o asociación que no contiene",
            "sourceRecordIds": [
              "1500a8bb-a221-5623-8509-3ece37ec8790"
            ],
            "terms": [
              [
                "persuasiv",
                "el lenguaje persuasivo"
              ],
              [
                "connotativ",
                "el lenguaje connotativo"
              ]
            ]
          },
          {
            "id": "pronouns",
            "match": "pronombres",
            "name": "los pronombres personales solicitados",
            "function": "reconocer las referencias al emisor y al destinatario del mensaje",
            "error": "se atribuye un pronombre a una persona o grupo distinto del indicado por el texto",
            "sourceRecordIds": [
              "8f428ca7-1d02-584a-8782-a1bbba492475"
            ]
          },
          {
            "id": "adverbs",
            "match": "adverbios",
            "name": "los adverbios expresamente pedidos",
            "function": "situar las referencias temporales o espaciales del mensaje",
            "error": "se invierte una referencia temporal o espacial",
            "sourceRecordIds": [
              "93decb7c-099c-5446-9ded-f37960fb2ed4"
            ],
            "terms": [
              [
                "temporales",
                "los adverbios temporales"
              ],
              [
                "espaciales",
                "los adverbios espaciales"
              ]
            ]
          },
          {
            "id": "adjectives",
            "match": "adjetiv",
            "name": "los adjetivos solicitados",
            "function": "precisar la caracterización o valoración expresada en el mensaje",
            "error": "se atribuye al adjetivo una valoración incompatible con el pasaje",
            "sourceRecordIds": [
              "ce50c140-0bb2-5de5-ad76-9067e9c2c4cb"
            ]
          },
          {
            "id": "modality",
            "match": "modalizador|modalizac|distancia|cercania",
            "name": "las modalizaciones solicitadas",
            "function": "relacionar las marcas de distancia o cercanía con la posición expresada en el mensaje",
            "error": "se atribuye al emisor una posición contraria a sus marcas discursivas",
            "sourceRecordIds": [
              "a9ee1249-e72c-55bd-80c8-f5b76788dbf7"
            ],
            "terms": [
              [
                "distancia",
                "los modalizadores de distancia"
              ],
              [
                "cercania",
                "los modalizadores de cercanía"
              ]
            ]
          },
          {
            "id": "nominalization",
            "match": "nominaliza",
            "name": "las nominalizaciones solicitadas",
            "function": "relacionar las expresiones nominales con las acciones o ideas que representan",
            "error": "se atribuye a la expresión nominal una acción o idea ajena al pasaje",
            "sourceRecordIds": [
              "d997bc04-8a56-5b0d-a7fb-797db2d532c6"
            ]
          },
          {
            "id": "emotional-arguments",
            "match": "argumentos emocionales|apelaciones emocionales",
            "name": "los argumentos emocionales solicitados",
            "function": "analizar la apelación propuesta y su relación con el mensaje sin evaluar emociones privadas",
            "error": "se atribuye al recurso una apelación que no se sostiene en el texto",
            "sourceRecordIds": [
              "8fccb97d-2421-58f6-89b6-1856d8a730d3"
            ]
          },
          {
            "id": "audiovisual",
            "match": "audiovisual",
            "name": "los recursos audiovisuales expresamente pedidos",
            "function": "relacionar los apoyos visuales o sonoros disponibles con el mensaje ficticio",
            "error": "el apoyo contradice el contenido o se atribuye un efecto a un recurso inexistente",
            "sourceRecordIds": [
              "764c8063-b275-5332-a1a7-084b854fafbe"
            ]
          },
          {
            "id": "rhetoric",
            "match": "retoric|figuras|metafora|personificacion|paradoja|hiperbole|eufemismo|perifrasis|metonimia",
            "name": "los recursos retóricos solicitados",
            "function": "relacionar los recursos expresivos con el sentido y el efecto del mensaje",
            "error": "se identifica un recurso inexistente o se atribuye un efecto contrario al pasaje",
            "sourceRecordIds": [
              "ef19c9bd-0536-5fa3-be47-033fe9d5f9ad"
            ]
          },
          {
            "id": "identifier",
            "match": "identificador",
            "name": "el identificador solicitado",
            "function": "hacer reconocible la voz o propuesta ficticia presentada en el ejercicio",
            "error": "se atribuye el mensaje a una voz o propuesta distinta de la indicada",
            "sourceRecordIds": [
              "1e0ddbf1-df90-5075-8ef4-7d5f7b4d5bb0"
            ]
          },
          {
            "id": "slogan",
            "match": "eslogan",
            "name": "el eslogan solicitado",
            "function": "vincular una expresión breve con el mensaje ficticio y su propósito educativo",
            "error": "el eslogan contradice el mensaje del ejercicio",
            "sourceRecordIds": [
              "1e0ddbf1-df90-5075-8ef4-7d5f7b4d5bb0"
            ]
          },
          {
            "id": "image",
            "match": "imagen(?:es)?",
            "name": "la imagen proporcionada o solicitada",
            "function": "relacionar la información visual con el mensaje ficticio del ejercicio",
            "error": "la imagen contradice el texto o se le atribuye información que no contiene",
            "sourceRecordIds": [
              "7cf78e83-7446-580a-9ee0-fde2b12797c8"
            ]
          },
          {
            "id": "design",
            "match": "legib|diseno|disena|disposicion grafica|color|espacios",
            "name": "la legibilidad y disposición de los componentes solicitados",
            "function": "hacer comprensible el prototipo ficticio con los recursos proporcionados",
            "error": "la disposición impide relacionar o leer los componentes centrales",
            "sourceRecordIds": [
              "7cf78e83-7446-580a-9ee0-fde2b12797c8"
            ]
          },
          {
            "id": "manipulation",
            "match": "manipul|discrimin|estereotipo",
            "name": "la presencia o ausencia de usos manipuladores o discriminatorios",
            "function": "fundamentar el análisis de los recursos con evidencias del mensaje, sin prejuzgar una postura como correcta",
            "error": "se atribuye una estrategia al mensaje sin evidencia o se presenta una interpretación como un hecho comprobado",
            "sourceRecordIds": [
              "0e08646c-d5dd-5a7e-8d1f-ed6f6f4da849"
            ],
            "terms": [
              [
                "manipul",
                "la presencia o ausencia de usos manipuladores"
              ],
              [
                "discrimin",
                "la presencia o ausencia de usos discriminatorios"
              ],
              [
                "estereotipo",
                "la presencia o ausencia de estereotipos"
              ]
            ],
            "analysisLevels": [
              "Fundamenta {target} mediante indicios del mensaje y distingue lo que observa de lo que infiere, sin exigir adhesión a una postura.",
              "La conclusión sobre {target} tiene apoyo en el mensaje; un indicio o inferencia necesita precisarse.",
              "Menciona indicios pertinentes, pero no muestra cómo respaldan su conclusión sobre los recursos solicitados.",
              "Atribuye al mensaje una estrategia ausente o descarta una identificable sin apoyo en el texto disponible.",
              "No sostiene una conclusión verificable sobre la presencia o ausencia de los recursos analizados."
            ]
          },
          {
            "id": "effects",
            "match": "efectos|pensamiento del destinatario",
            "name": "los posibles efectos del mensaje",
            "function": "fundamentar inferencias sobre la recepción con recursos del texto y distinguirlas de efectos realmente observados",
            "error": "se afirma como comprobada una reacción del destinatario que no se observó",
            "sourceRecordIds": [
              "715c324f-eb31-534f-b8da-978fcf60b4d4"
            ]
          },
          {
            "id": "register",
            "match": "\\bregistro\\b(?!\\s+(?:visual|sonoro))",
            "name": "el registro expresamente acordado",
            "function": "adecuar el vocabulario y las formas de dirigirse al destinatario según las condiciones del ejercicio",
            "error": "el registro contradice las condiciones comunicativas acordadas",
            "sourceRecordIds": [
              "1e0ddbf1-df90-5075-8ef4-7d5f7b4d5bb0"
            ]
          }
        ],
        "dimensions": [
          {
            "id": "meaning",
            "title": "Intención y destinatario del mensaje",
            "production": "Construye un mensaje ficticio comprensible para el propósito educativo y el destinatario dados, sin exigir adhesión personal.",
            "analysis": "Reconoce el propósito y el destinatario previsto mediante indicios del mensaje, distinguiendo información literal de inferencias.",
            "comparison": "Contrasta los propósitos y destinatarios previstos con indicios de ambos mensajes.",
            "evidence": [
              "El propósito y destinatario se reconocen; una relación con el mensaje necesita aclararse.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "Se atribuye al mensaje un propósito o destinatario incompatible con sus indicios.",
              "No aporta evidencia reconocible de la relación entre mensaje, propósito y destinatario."
            ],
            "weight": 4
          },
          {
            "id": "organization",
            "title": "Organización de los componentes",
            "production": "Organiza únicamente los componentes y recursos solicitados para que el mensaje pueda leerse o comprenderse.",
            "analysis": "Relaciona los componentes disponibles del mensaje con su organización y su intención.",
            "comparison": "Contrasta cómo los componentes disponibles de ambos mensajes contribuyen a su organización.",
            "evidence": [
              "Los componentes principales se relacionan; una disposición o referencia necesita precisarse.",
              "Reconoce elementos pertinentes, pero no relaciona suficientemente los componentes de la evidencia solicitada.",
              "La disposición cambia una relación central o impide comprender un componente necesario.",
              "No permite reconocer las relaciones entre los componentes del mensaje solicitado."
            ],
            "weight": 4
          }
        ]
      }
    ]
  },
  {
    "id": "optativa-hcs-len-4",
    "grade": 4,
    "subjectCode": "OPT-HCS-LEN-4",
    "subjectName": "Apreciación y Producción Literarias",
    "optativeExitName": "Humanidades y Ciencias Sociales",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "e05229b2-4f79-5cf9-a57e-b0be79bb0cb7",
    "pdfPages": [
      462,
      463,
      464,
      465,
      466
    ],
    "topics": [
      {
        "id": "novela-autobiografica",
        "label": "novela autobiográfica",
        "match": "novelas?(?: breves?)? autobiografic",
        "sourceRecordIds": [
          "46a3dbf8-a082-5646-a7fe-686db73f78ce"
        ],
        "pdfPages": [
          462,
          463
        ],
        "profile": {
          "genre": "novela autobiográfica",
          "target": "los sucesos, las acciones y la perspectiva de la voz narrativa del texto proporcionado",
          "plan": "la intención, los sucesos, personajes, lugar, tiempo y perspectiva expresamente pedidos"
        },
        "features": [
          {
            "id": "novel-structure",
            "match": "funcion|estructura",
            "name": "la función y estructura solicitadas",
            "function": "relacionar la organización del relato con su propósito",
            "error": "se atribuye a una parte una función incompatible con el pasaje",
            "sourceRecordIds": [
              "46a3dbf8-a082-5646-a7fe-686db73f78ce"
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
            "id": "narrative-time",
            "match": "tiempo narrativo|frecuencia|duracion|\\borden\\b(?! (?:anacronico|cronologico))",
            "name": "el tiempo narrativo solicitado",
            "function": "relacionar la disposición, repetición o extensión de los acontecimientos con el pasaje",
            "error": "se confunde el tiempo de los hechos con su disposición o extensión en el relato",
            "sourceRecordIds": [
              "28839aca-55ab-5d8d-89a8-8032e6a349c3"
            ],
            "terms": [
              [
                "\\borden\\b",
                "el orden narrativo"
              ],
              [
                "frecuencia",
                "la frecuencia narrativa"
              ],
              [
                "duracion",
                "la duración narrativa"
              ]
            ]
          },
          {
            "id": "narrator",
            "match": "narrador|voces|(?<!estilo del )\\bautor\\b|quien narra|quien cuenta",
            "name": "la voz narrativa solicitada",
            "function": "distinguir el papel y la perspectiva solicitados según las marcas disponibles en el pasaje",
            "error": "se atribuye a una voz una intervención o información incompatible con el pasaje",
            "sourceRecordIds": [
              "39a3b24f-6d4c-57f7-befc-31285e44c884"
            ],
            "terms": [
              [
                "autor",
                "el autor"
              ],
              [
                "narrador omnisciente",
                "el narrador omnisciente"
              ],
              [
                "narrador testigo",
                "el narrador testigo"
              ],
              [
                "narrador(?! (?:omnisciente|testigo))",
                "el narrador"
              ],
              [
                "voces",
                "las voces narrativas"
              ],
              [
                "personajes?",
                "los personajes"
              ]
            ]
          },
          {
            "id": "novel-sequences",
            "match": "secuencias?",
            "name": "las secuencias expresamente pedidas",
            "function": "relacionar la narración, descripción o diálogo solicitado con su papel en el pasaje",
            "error": "se clasifica una secuencia por un rasgo ausente",
            "sourceRecordIds": [
              "e1ad6412-d33e-508d-884d-69577ca835e9"
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
                "dialogadas?",
                "la secuencia dialogada"
              ]
            ]
          },
          {
            "id": "novel-connectors",
            "match": "conectores",
            "name": "los conectores solicitados",
            "function": "enlazar las acciones conservando la relación expresamente pedida",
            "error": "el conector invierte una relación entre los sucesos",
            "sourceRecordIds": [
              "cd4b4c8c-48d1-5c31-9761-55455c219506"
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
              ],
              [
                "espaciales",
                "los conectores espaciales"
              ]
            ]
          },
          {
            "id": "novel-characters",
            "match": "analiz[a-z]*\\s+(?:unicamente\\s+)?(?:los )?personajes|(?:caracteriza|describ)[a-z]*[^.;]*personajes|rasgos de (?:los )?personajes",
            "name": "los personajes solicitados",
            "function": "relacionar sus rasgos y acciones con los pasajes disponibles",
            "error": "se atribuye a un personaje una acción o un rasgo ajeno",
            "sourceRecordIds": [
              "7428a6ab-e1a0-5392-8678-ed43ab1643a4"
            ]
          },
          {
            "id": "novel-actants",
            "match": "actan",
            "name": "la actancia solicitada",
            "function": "relacionar el papel de los personajes con sus acciones en el relato",
            "error": "se confunde el papel actancial con el nombre del personaje",
            "sourceRecordIds": [
              "36d20cbb-f362-5167-8fc8-594c7716d920"
            ]
          },
          {
            "id": "novel-themes",
            "match": "\\btemas?\\b",
            "name": "el tema solicitado",
            "function": "relacionar las ideas del relato con sus episodios",
            "error": "se atribuye al relato un tema sin apoyo textual",
            "sourceRecordIds": [
              "7889c146-e3c1-5630-a134-b7a8dbde9dda"
            ]
          },
          {
            "id": "motivations",
            "match": "motivaciones|intenciones de (?:los )?personajes",
            "name": "las motivaciones solicitadas de los personajes",
            "function": "inferir las razones de sus acciones mediante los pasajes disponibles",
            "error": "se atribuye al personaje una intención sin apoyo en el pasaje",
            "sourceRecordIds": [
              "72ae32d0-cf54-5837-b283-970ed77cf1f6"
            ]
          },
          {
            "id": "causality",
            "match": "causalidad|relacion(?:es)? causal(?:es)?",
            "name": "las relaciones causales solicitadas",
            "function": "relacionar un suceso con otro según el relato",
            "error": "se presenta como causa un hecho posterior o ajeno al suceso",
            "sourceRecordIds": [
              "72ae32d0-cf54-5837-b283-970ed77cf1f6"
            ]
          },
          {
            "id": "novel-chronology",
            "match": "cronologic|anacron",
            "name": "el orden narrativo solicitado",
            "function": "conservar la relación entre la secuencia narrada y los acontecimientos",
            "error": "se invierte la relación temporal solicitada",
            "sourceRecordIds": [
              "dd26b9f6-b7ce-5d36-a219-0d37983a58a0"
            ],
            "terms": [
              [
                "anacron",
                "el orden anacrónico"
              ],
              [
                "(?<!ana)cronologic",
                "el orden cronológico"
              ]
            ]
          },
          {
            "id": "novel-vocabulary",
            "match": "vocabulario|lexico|palabras desconocidas",
            "name": "el vocabulario contextual solicitado",
            "function": "conservar el significado de las palabras en el pasaje",
            "error": "se elige una acepción incompatible con el contexto",
            "sourceRecordIds": [
              "c84b0baf-b362-5414-b117-27284ecbe9c8"
            ]
          },
          {
            "id": "dialogue",
            "match": "dialogos?|estilo directo",
            "name": "el diálogo solicitado",
            "function": "distinguir las intervenciones y su sentido en el relato",
            "error": "se atribuye una intervención al personaje equivocado",
            "sourceRecordIds": [
              "dd26b9f6-b7ce-5d36-a219-0d37983a58a0"
            ]
          },
          {
            "id": "punctuation",
            "match": "puntuacion|\\bcoma\\b|dos puntos|\\braya\\b",
            "name": "la puntuación solicitada",
            "function": "delimitar los sucesos y las intervenciones sin alterar su sentido",
            "error": "el signo cambia quién habla o la relación entre los sucesos",
            "sourceRecordIds": [
              "dd26b9f6-b7ce-5d36-a219-0d37983a58a0"
            ]
          },
          {
            "id": "narrative-tenses",
            "match": "tiempos? verbales|\\bpasado\\b|\\bpresente\\b",
            "name": "los tiempos verbales solicitados",
            "function": "distinguir el tiempo de las acciones y las intervenciones según el pasaje",
            "error": "un cambio temporal contradice la relación entre los sucesos",
            "sourceRecordIds": [
              "dd26b9f6-b7ce-5d36-a219-0d37983a58a0"
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
            "name": "los recursos de suspense solicitados",
            "function": "administrar la información y la expectativa del pasaje",
            "error": "se atribuye suspense a información que contradice la escena",
            "sourceRecordIds": [
              "dd26b9f6-b7ce-5d36-a219-0d37983a58a0"
            ]
          },
          {
            "id": "chapter-boundaries",
            "match": "capitulos|marcas de inicio|inicio.*(?:cierre|progresion)",
            "name": "las marcas de inicio, progresión o cierre solicitadas",
            "function": "delimitar el desarrollo de los episodios para que pueda seguirse el relato",
            "error": "el límite de un episodio interrumpe una relación necesaria",
            "sourceRecordIds": [
              "dd26b9f6-b7ce-5d36-a219-0d37983a58a0"
            ],
            "terms": [
              [
                "inicio",
                "el inicio"
              ],
              [
                "progresion",
                "la progresión"
              ],
              [
                "cierre",
                "el cierre"
              ],
              [
                "capitulos",
                "los límites entre capítulos"
              ]
            ]
          },
          {
            "id": "narratory-resource",
            "match": "recurso narrator",
            "name": "el recurso narratorio solicitado",
            "function": "relacionar el modo de contar con la perspectiva del pasaje",
            "error": "se atribuye al relato un recurso que no presenta",
            "sourceRecordIds": [
              "6f020960-3220-5616-9384-7a3d3db57071"
            ]
          },
          {
            "id": "leitmotiv",
            "match": "leitmotiv",
            "name": "el leitmotiv solicitado",
            "function": "relacionar las recurrencias del relato con sus sentidos",
            "error": "se toma un detalle aislado como motivo recurrente",
            "sourceRecordIds": [
              "ebf82f33-e115-53fb-bcfe-6a92c472223c"
            ]
          },
          {
            "id": "author-style",
            "match": "estilo del autor",
            "name": "el estilo del autor solicitado",
            "function": "relacionar las elecciones expresivas con los pasajes disponibles",
            "error": "se atribuye al texto un rasgo estilístico sin ejemplo",
            "sourceRecordIds": [
              "11514ea7-877d-5809-8ff6-cd5d8fcc88f5"
            ]
          },
          {
            "id": "novel-plot",
            "match": "\\btrama\\b",
            "name": "la trama solicitada",
            "function": "relacionar los sucesos y sus conexiones según el pasaje",
            "error": "se añade o se invierte un suceso y cambia el sentido de la trama",
            "sourceRecordIds": [
              "94e12840-3aed-5fb6-be76-8fdf4a7e6efd"
            ]
          },
          {
            "id": "novel-setting",
            "match": "\\bambiente\\b|atmosfera",
            "name": "el ambiente y la atmósfera solicitados",
            "function": "situar los sucesos según los rasgos espaciales y sensoriales disponibles en el pasaje",
            "error": "se atribuye al pasaje un espacio o una atmósfera incompatible con sus referencias",
            "sourceRecordIds": [
              "19cc1da6-33c6-5d9e-94bb-3064fecb0d6c"
            ],
            "terms": [
              [
                "\\bambiente\\b",
                "el ambiente"
              ],
              [
                "atmosfera",
                "la atmósfera"
              ]
            ]
          },
          {
            "id": "novel-adjectives",
            "match": "adjetiv",
            "name": "la adjetivación solicitada",
            "function": "caracterizar personajes o espacios según el pasaje",
            "error": "se atribuye un rasgo incompatible con el elemento descrito",
            "sourceRecordIds": [
              "7245732f-dbe2-5f66-8f81-8d878ddfc32f"
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
            "production": "Hace reconocibles los personajes mediante sus acciones y relaciones en la narración solicitada.",
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
        ],
        "planningComponents": [
          [
            "intencion",
            "la intención"
          ],
          [
            "sucesos|acciones",
            "los sucesos"
          ],
          [
            "personajes",
            "los personajes"
          ],
          [
            "lugar|ambiente",
            "el lugar"
          ],
          [
            "tiempo",
            "el tiempo"
          ],
          [
            "perspectiva|punto de vista|voz",
            "la perspectiva narrativa"
          ]
        ]
      },
      {
        "id": "novela-realismo-magico",
        "label": "novela de realismo mágico",
        "match": "novelas?(?: breves?)? (?:del? )?realismo magico",
        "sourceRecordIds": [
          "e1493fb7-a1f4-582b-beff-1e9667741a61"
        ],
        "pdfPages": [
          463,
          464,
          465
        ],
        "profile": {
          "genre": "novela de realismo mágico",
          "target": "los sucesos, las voces y la integración de lo extraordinario en el mundo narrado del pasaje",
          "plan": "la intención, los sucesos, personajes, lugar, tiempo y perspectiva expresamente pedidos"
        },
        "features": [
          {
            "id": "novel-structure",
            "match": "funcion|estructura",
            "name": "la función y estructura solicitadas",
            "function": "relacionar la organización del relato con su propósito",
            "error": "se atribuye a una parte una función incompatible con el pasaje",
            "sourceRecordIds": [
              "e1493fb7-a1f4-582b-beff-1e9667741a61"
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
            "id": "narrative-time",
            "match": "tiempo narrativo|frecuencia|duracion|\\borden\\b(?! (?:anacronico|cronologico))",
            "name": "el tiempo narrativo solicitado",
            "function": "relacionar la disposición, repetición o extensión de los acontecimientos con el pasaje",
            "error": "se confunde el tiempo de los hechos con su disposición o extensión en el relato",
            "sourceRecordIds": [
              "e2547b4d-83ad-58e1-933c-9bab42ddc201"
            ],
            "terms": [
              [
                "\\borden\\b",
                "el orden narrativo"
              ],
              [
                "frecuencia",
                "la frecuencia narrativa"
              ],
              [
                "duracion",
                "la duración narrativa"
              ]
            ]
          },
          {
            "id": "narrator",
            "match": "narrador|voces|(?<!estilo del )\\bautor\\b|quien narra|quien cuenta",
            "name": "la voz narrativa solicitada",
            "function": "distinguir el papel y la perspectiva solicitados según las marcas disponibles en el pasaje",
            "error": "se atribuye a una voz una intervención o información incompatible con el pasaje",
            "sourceRecordIds": [
              "9b073947-e14a-5ada-860c-7d26c4f18e1c"
            ],
            "terms": [
              [
                "autor",
                "el autor"
              ],
              [
                "narrador omnisciente",
                "el narrador omnisciente"
              ],
              [
                "narrador testigo",
                "el narrador testigo"
              ],
              [
                "narrador(?! (?:omnisciente|testigo))",
                "el narrador"
              ],
              [
                "voces",
                "las voces narrativas"
              ],
              [
                "personajes?",
                "los personajes"
              ]
            ]
          },
          {
            "id": "novel-sequences",
            "match": "secuencias?",
            "name": "las secuencias expresamente pedidas",
            "function": "relacionar la narración, descripción o diálogo solicitado con su papel en el pasaje",
            "error": "se clasifica una secuencia por un rasgo ausente",
            "sourceRecordIds": [
              "fbad03c9-856d-52f9-a9f0-c235c630b60b"
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
                "dialogadas?",
                "la secuencia dialogada"
              ]
            ]
          },
          {
            "id": "novel-connectors",
            "match": "conectores",
            "name": "los conectores solicitados",
            "function": "enlazar las acciones conservando la relación expresamente pedida",
            "error": "el conector invierte una relación entre los sucesos",
            "sourceRecordIds": [
              "3eaa924f-1211-5b31-9677-24d59ba54129"
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
              ],
              [
                "espaciales",
                "los conectores espaciales"
              ]
            ]
          },
          {
            "id": "novel-characters",
            "match": "analiz[a-z]*\\s+(?:unicamente\\s+)?(?:los )?personajes|(?:caracteriza|describ)[a-z]*[^.;]*personajes|rasgos de (?:los )?personajes",
            "name": "los personajes solicitados",
            "function": "relacionar sus rasgos y acciones con los pasajes disponibles",
            "error": "se atribuye a un personaje una acción o un rasgo ajeno",
            "sourceRecordIds": [
              "59914a2b-f654-5422-a741-f22f182ec6da"
            ]
          },
          {
            "id": "novel-actants",
            "match": "actan",
            "name": "la actancia solicitada",
            "function": "relacionar el papel de los personajes con sus acciones en el relato",
            "error": "se confunde el papel actancial con el nombre del personaje",
            "sourceRecordIds": [
              "8ed370d4-1f4e-5ba0-a163-c3896c8bc083"
            ]
          },
          {
            "id": "novel-themes",
            "match": "\\btemas?\\b",
            "name": "el tema solicitado",
            "function": "relacionar las ideas del relato con sus episodios",
            "error": "se atribuye al relato un tema sin apoyo textual",
            "sourceRecordIds": [
              "b18572fb-4208-5efe-bffd-d2bb24afe64a"
            ]
          },
          {
            "id": "motivations",
            "match": "motivaciones|intenciones de (?:los )?personajes",
            "name": "las motivaciones solicitadas de los personajes",
            "function": "inferir las razones de sus acciones mediante los pasajes disponibles",
            "error": "se atribuye al personaje una intención sin apoyo en el pasaje",
            "sourceRecordIds": [
              "237d02d5-b416-596b-8e7e-9f7be5610528"
            ]
          },
          {
            "id": "causality",
            "match": "causalidad|relacion(?:es)? causal(?:es)?",
            "name": "las relaciones causales solicitadas",
            "function": "relacionar un suceso con otro según el relato",
            "error": "se presenta como causa un hecho posterior o ajeno al suceso",
            "sourceRecordIds": [
              "237d02d5-b416-596b-8e7e-9f7be5610528"
            ]
          },
          {
            "id": "novel-chronology",
            "match": "cronologic|anacron",
            "name": "el orden narrativo solicitado",
            "function": "conservar la relación entre la secuencia narrada y los acontecimientos",
            "error": "se invierte la relación temporal solicitada",
            "sourceRecordIds": [
              "7415d6ac-142c-5a10-b32f-9834097d18bf",
              "38cc5181-d04c-5dee-bc30-9ae2ccba9d37",
              "208ce86f-372b-5ca4-81a7-7285346b514b"
            ],
            "terms": [
              [
                "anacron",
                "el orden anacrónico"
              ],
              [
                "(?<!ana)cronologic",
                "el orden cronológico"
              ]
            ]
          },
          {
            "id": "novel-vocabulary",
            "match": "vocabulario|lexico|palabras desconocidas",
            "name": "el vocabulario contextual solicitado",
            "function": "conservar el significado de las palabras en el pasaje",
            "error": "se elige una acepción incompatible con el contexto",
            "sourceRecordIds": [
              "94c98193-3f51-537b-8aae-8477f900afd8"
            ]
          },
          {
            "id": "dialogue",
            "match": "dialogos?|estilo directo",
            "name": "el diálogo solicitado",
            "function": "distinguir las intervenciones y su sentido en el relato",
            "error": "se atribuye una intervención al personaje equivocado",
            "sourceRecordIds": [
              "208ce86f-372b-5ca4-81a7-7285346b514b"
            ]
          },
          {
            "id": "punctuation",
            "match": "puntuacion|\\bcoma\\b|dos puntos|\\braya\\b",
            "name": "la puntuación solicitada",
            "function": "delimitar los sucesos y las intervenciones sin alterar su sentido",
            "error": "el signo cambia quién habla o la relación entre los sucesos",
            "sourceRecordIds": [
              "208ce86f-372b-5ca4-81a7-7285346b514b"
            ]
          },
          {
            "id": "narrative-tenses",
            "match": "tiempos? verbales|\\bpasado\\b|\\bpresente\\b",
            "name": "los tiempos verbales solicitados",
            "function": "distinguir el tiempo de las acciones y las intervenciones según el pasaje",
            "error": "un cambio temporal contradice la relación entre los sucesos",
            "sourceRecordIds": [
              "208ce86f-372b-5ca4-81a7-7285346b514b"
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
            "name": "los recursos de suspense solicitados",
            "function": "administrar la información y la expectativa del pasaje",
            "error": "se atribuye suspense a información que contradice la escena",
            "sourceRecordIds": [
              "208ce86f-372b-5ca4-81a7-7285346b514b"
            ]
          },
          {
            "id": "chapter-boundaries",
            "match": "capitulos|marcas de inicio|inicio.*(?:cierre|progresion)",
            "name": "las marcas de inicio, progresión o cierre solicitadas",
            "function": "delimitar el desarrollo de los episodios para que pueda seguirse el relato",
            "error": "el límite de un episodio interrumpe una relación necesaria",
            "sourceRecordIds": [
              "208ce86f-372b-5ca4-81a7-7285346b514b"
            ],
            "terms": [
              [
                "inicio",
                "el inicio"
              ],
              [
                "progresion",
                "la progresión"
              ],
              [
                "cierre",
                "el cierre"
              ],
              [
                "capitulos",
                "los límites entre capítulos"
              ]
            ]
          },
          {
            "id": "novel-components",
            "match": "componentes de la novela",
            "name": "los componentes narrativos solicitados",
            "function": "relacionar los elementos del relato según el pasaje",
            "error": "se atribuye un componente ajeno al texto",
            "sourceRecordIds": [
              "130beaed-d06c-567d-9924-d8fdf01ebd4c"
            ]
          },
          {
            "id": "novel-context",
            "match": "contexto del relato|contexto (?:social|historico|cultural)",
            "name": "el contexto del relato solicitado",
            "function": "situar los acontecimientos con los datos del texto disponibles",
            "error": "se añade un contexto incompatible con el pasaje",
            "sourceRecordIds": [
              "24f62e2b-2720-59e9-8f60-e4af4e1a86e6"
            ]
          },
          {
            "id": "writer-resources",
            "match": "recursos del escritor",
            "name": "los recursos del escritor solicitados",
            "function": "relacionar las elecciones narrativas con el efecto sustentado en el pasaje",
            "error": "se atribuye al relato un recurso ausente",
            "sourceRecordIds": [
              "a14fe125-6cd1-59a1-8173-b87474571302"
            ]
          },
          {
            "id": "interior-monologue",
            "match": "monologo interior",
            "name": "el monólogo interior",
            "function": "distinguir el discurso interior del personaje según el pasaje",
            "error": "se atribuye el pensamiento a una voz distinta",
            "sourceRecordIds": [
              "f8ee37cc-2b95-5cec-84fe-f6507370c7ef"
            ]
          },
          {
            "id": "descriptive-language",
            "match": "lenguaje descriptivo",
            "name": "el lenguaje descriptivo solicitado",
            "function": "construir una imagen reconocible de los elementos descritos",
            "error": "se atribuye al elemento un rasgo incompatible con el pasaje",
            "sourceRecordIds": [
              "6f63d7a3-0d81-561b-a99f-a9dceb3224af"
            ]
          },
          {
            "id": "novel-adjectives",
            "match": "adjetiv",
            "name": "la adjetivación solicitada",
            "function": "caracterizar personajes o espacios según el pasaje",
            "error": "se atribuye un rasgo incompatible con el elemento descrito",
            "sourceRecordIds": [
              "cfd7a77e-7239-52fb-9751-d5bdd36c8fc7"
            ]
          },
          {
            "id": "magic-natural",
            "match": "extraordinari|cotidian|elementos magicos|irreal.*natural",
            "name": "la integración de lo extraordinario como cotidiano",
            "function": "relacionar el acontecimiento extraordinario con la percepción de los personajes dentro del mundo narrado",
            "error": "se confunde la perspectiva del relato con una creencia obligatoria del lector",
            "sourceRecordIds": [
              "4824e344-59b6-5d7f-9bb6-b35553b109cd"
            ]
          },
          {
            "id": "magic-sensory",
            "match": "sensorial",
            "name": "los elementos sensoriales solicitados",
            "function": "relacionar la percepción del personaje con el mundo narrado",
            "error": "se atribuye una percepción incompatible con el pasaje",
            "sourceRecordIds": [
              "4824e344-59b6-5d7f-9bb6-b35553b109cd"
            ]
          },
          {
            "id": "magic-myths",
            "match": "mitos|leyendas",
            "name": "los mitos o leyendas solicitados",
            "function": "relacionar las referencias del texto con los acontecimientos narrados",
            "error": "se añade una referencia ausente del pasaje",
            "sourceRecordIds": [
              "4824e344-59b6-5d7f-9bb6-b35553b109cd"
            ],
            "terms": [
              [
                "mitos",
                "los mitos"
              ],
              [
                "leyendas",
                "las leyendas"
              ]
            ]
          },
          {
            "id": "magic-setting",
            "match": "escenarios|latinoamerican|pobreza|marginal",
            "name": "el escenario expresamente solicitado",
            "function": "situar los hechos de acuerdo con los datos del pasaje",
            "error": "se impone un escenario ajeno al texto",
            "sourceRecordIds": [
              "4824e344-59b6-5d7f-9bb6-b35553b109cd"
            ]
          },
          {
            "id": "novel-plot",
            "match": "\\btrama\\b",
            "name": "la trama solicitada",
            "function": "relacionar los sucesos y sus conexiones según el pasaje",
            "error": "se añade o se invierte un suceso y cambia el sentido de la trama",
            "sourceRecordIds": [
              "237d02d5-b416-596b-8e7e-9f7be5610528"
            ]
          },
          {
            "id": "novel-setting",
            "match": "\\bambiente\\b|atmosfera",
            "name": "el ambiente y la atmósfera solicitados",
            "function": "situar los sucesos según los rasgos espaciales y sensoriales disponibles en el pasaje",
            "error": "se atribuye al pasaje un espacio o una atmósfera incompatible con sus referencias",
            "sourceRecordIds": [
              "29f7944b-a481-56ba-b277-765d3a4ecf96"
            ],
            "terms": [
              [
                "\\bambiente\\b",
                "el ambiente"
              ],
              [
                "atmosfera",
                "la atmósfera"
              ]
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
            "production": "Hace reconocibles los personajes mediante sus acciones y relaciones en la narración solicitada.",
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
          },
          {
            "id": "magic-natural",
            "title": "Lo extraordinario en el mundo narrado",
            "production": "Integra el acontecimiento extraordinario solicitado como parte de la experiencia cotidiana de los personajes en el mundo narrado.",
            "analysis": "Explica cómo los personajes o la voz narrativa presentan lo extraordinario como cotidiano, con evidencias del pasaje.",
            "comparison": "Contrasta cómo los textos dados presentan lo extraordinario como cotidiano mediante evidencias de sus mundos narrados.",
            "evidence": [
              "La relación con lo cotidiano se reconoce; una referencia de la perspectiva requiere precisión.",
              "Menciona el hecho extraordinario, pero queda sin establecer su relación con la experiencia de los personajes.",
              "Atribuye al personaje una reacción o una perspectiva incompatible con el pasaje.",
              "No aporta una relación reconocible entre el hecho extraordinario y la perspectiva del mundo narrado."
            ],
            "weight": 4
          }
        ],
        "planningComponents": [
          [
            "intencion",
            "la intención"
          ],
          [
            "sucesos|acciones",
            "los sucesos"
          ],
          [
            "personajes",
            "los personajes"
          ],
          [
            "lugar|ambiente",
            "el lugar"
          ],
          [
            "tiempo",
            "el tiempo"
          ],
          [
            "perspectiva|punto de vista|voz",
            "la perspectiva narrativa"
          ]
        ]
      }
    ]
  }
],
version:"evaluation-2026.130"} as unknown as EvaluationCatalog
