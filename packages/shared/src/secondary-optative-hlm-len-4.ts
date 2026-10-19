import type {OptativeLanguageModule} from './secondary-optative-language'

/** Perfiles y recursos de HLM de cuarto, con anclas propias; las referencias sugeridas no son requisitos. */
export const optativeHlmLenFour:OptativeLanguageModule={
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
}
