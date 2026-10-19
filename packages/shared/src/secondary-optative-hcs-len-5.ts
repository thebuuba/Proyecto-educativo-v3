import type {OptativeLanguageModule} from './secondary-optative-language'

/** HCS de quinto: referentes históricos dados y relaciones sociales del mundo narrado, sin adhesión privada. */
export const optativeHcsLenFive:OptativeLanguageModule={
  "id": "optativa-hcs-len-5",
  "grade": 5,
  "subjectCode": "OPT-HCS-LEN-5",
  "subjectName": "Apreciación y Producción Literarias",
  "optativeExitName": "Humanidades y Ciencias Sociales",
  "modalityCodes": [
    "academic",
    "general"
  ],
  "sourceScopeId": "b1f1b6c5-3136-5287-8d68-e6171cd86a5f",
  "pdfPages": [
    467,
    468,
    469,
    470,
    471
  ],
  "topics": [
    {
      "id": "novela-historica",
      "label": "novela histórica",
      "match": "novelas?(?: breves?)? historic",
      "sourceRecordIds": [
        "b73d624c-3285-5f38-986d-de3bf05faa6e"
      ],
      "pdfPages": [
        467,
        468
      ],
      "profile": {
        "genre": "novela histórica",
        "target": "los sucesos, las voces y los referentes históricos expresamente trabajados en el texto dado",
        "plan": "la intención, los sucesos, personajes, lugar, tiempo y referentes expresamente pedidos"
      },
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
        ],
        [
          "epoca",
          "la época"
        ],
        [
          "personaje destacado",
          "el personaje destacado"
        ],
        [
          "hecho historico",
          "el hecho histórico"
        ]
      ],
      "features": [
        {
          "id": "novel-structure",
          "match": "funcion|estructura",
          "name": "la función y estructura solicitadas",
          "function": "relacionar la organización del relato con su propósito",
          "error": "se atribuye a una parte una función incompatible con el pasaje",
          "sourceRecordIds": [
            "b73d624c-3285-5f38-986d-de3bf05faa6e"
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
          "match": "tiempo narrativo|frecuencia|duracion|(?<!de )\\borden\\b(?! (?:anacronico|cronologico))",
          "name": "el tiempo narrativo solicitado",
          "function": "relacionar la disposición, repetición o extensión de los acontecimientos con el pasaje",
          "error": "se confunde el tiempo de los hechos con su disposición o extensión en el relato",
          "sourceRecordIds": [
            "6abff723-b0a3-584d-a048-88524472f4de"
          ],
          "terms": [
            [
              "(?<!de )\\borden\\b(?! (?:cronologico|anacronico))",
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
            "b5cf2af6-7c0f-57fb-939c-14d2efc2d5eb"
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
              "narrador(?! (?:omnisciente|testigo))|quien narra|quien cuenta",
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
            "e99a89c9-5846-536e-9ccb-a24dc82081e2"
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
            "7d2a0178-a647-5c24-9b0c-e8ec37d8a77b"
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
            ],
            [
              "de orden",
              "los conectores de orden"
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
            "d1df0d32-15fd-5086-b208-6f92405656c2"
          ]
        },
        {
          "id": "novel-actants",
          "match": "actan",
          "name": "la actancia solicitada",
          "function": "relacionar el papel de los personajes con sus acciones en el relato",
          "error": "se confunde el papel actancial con el nombre del personaje",
          "sourceRecordIds": [
            "2d612bea-bd59-5a66-b3be-3a8c0a3860c9"
          ]
        },
        {
          "id": "novel-themes",
          "match": "\\btemas?\\b",
          "name": "el tema solicitado",
          "function": "relacionar las ideas del relato con sus episodios",
          "error": "se atribuye al relato un tema sin apoyo textual",
          "sourceRecordIds": [
            "cb21e4f2-be52-5862-83e5-337c3d05bd11"
          ]
        },
        {
          "id": "motivations",
          "match": "motivaciones|intenciones de (?:los )?personajes",
          "name": "las motivaciones solicitadas de los personajes",
          "function": "inferir las razones de sus acciones mediante los pasajes disponibles",
          "error": "se atribuye al personaje una intención sin apoyo en el pasaje",
          "sourceRecordIds": [
            "4ea65c3d-c83e-5827-982f-27d4369656e8"
          ]
        },
        {
          "id": "causality",
          "match": "causalidad|relacion(?:es)? causal(?:es)?",
          "name": "las relaciones causales solicitadas",
          "function": "relacionar un suceso con otro según el relato",
          "error": "se presenta como causa un hecho posterior o ajeno al suceso",
          "sourceRecordIds": [
            "4ea65c3d-c83e-5827-982f-27d4369656e8"
          ]
        },
        {
          "id": "novel-chronology",
          "match": "cronologic|anacron",
          "name": "el orden narrativo solicitado",
          "function": "conservar la relación entre la secuencia narrada y los acontecimientos",
          "error": "se invierte la relación temporal solicitada",
          "sourceRecordIds": [
            "552a51e5-0d92-5cfe-badc-d5e7c195712c"
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
            "4ea65c3d-c83e-5827-982f-27d4369656e8"
          ]
        },
        {
          "id": "dialogue",
          "match": "dialogos?|estilo directo",
          "name": "el diálogo solicitado",
          "function": "distinguir las intervenciones y su sentido en el relato",
          "error": "se atribuye una intervención al personaje equivocado",
          "sourceRecordIds": [
            "d98e3393-a5c9-5824-99a4-b5f747972fcf"
          ]
        },
        {
          "id": "punctuation",
          "match": "puntuacion|\\bcoma\\b|dos puntos|\\braya\\b",
          "name": "la puntuación solicitada",
          "function": "delimitar los sucesos y las intervenciones sin alterar su sentido",
          "error": "el signo cambia quién habla o la relación entre los sucesos",
          "sourceRecordIds": [
            "11651691-56aa-549d-974c-18339035c43d"
          ]
        },
        {
          "id": "narrative-tenses",
          "match": "tiempos? verbales|\\bpasado\\b|\\bpresente\\b",
          "name": "los tiempos verbales solicitados",
          "function": "distinguir el tiempo de las acciones y las intervenciones según el pasaje",
          "error": "un cambio temporal contradice la relación entre los sucesos",
          "sourceRecordIds": [
            "a783728e-fac5-53c1-b867-fbcad7c33d57",
            "11651691-56aa-549d-974c-18339035c43d"
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
            "11651691-56aa-549d-974c-18339035c43d"
          ]
        },
        {
          "id": "chapter-boundaries",
          "match": "capitulos|marcas de inicio|inicio.*(?:cierre|progresion)",
          "name": "las marcas de inicio, progresión o cierre solicitadas",
          "function": "delimitar el desarrollo de los episodios para que pueda seguirse el relato",
          "error": "el límite de un episodio interrumpe una relación necesaria",
          "sourceRecordIds": [
            "2ed6bf6d-6157-56e9-83d9-24ef0c2e4196"
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
          "id": "novel-plot",
          "match": "\\btrama\\b",
          "name": "la trama solicitada",
          "function": "relacionar los sucesos y sus conexiones según el pasaje",
          "error": "se añade o se invierte un suceso y cambia el sentido de la trama",
          "sourceRecordIds": [
            "4ea65c3d-c83e-5827-982f-27d4369656e8"
          ]
        },
        {
          "id": "novel-setting",
          "match": "\\bambiente\\b|atmosfera",
          "name": "el ambiente y la atmósfera solicitados",
          "function": "situar los sucesos según los rasgos espaciales y sensoriales disponibles en el pasaje",
          "error": "se atribuye al pasaje un espacio o una atmósfera incompatible con sus referencias",
          "sourceRecordIds": [
            "37c092c6-168e-5aff-9608-e9b7c0d662ce"
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
            "ca34fd1f-f67a-5fa4-b02d-86a0eadad5e3"
          ]
        },
        {
          "id": "historical-facts-fiction",
          "match": "hechos (?:historicos )?(?:reales|documentados|de ficcion)|hechos? (?:de )?ficcion",
          "name": "los hechos documentados o ficticios solicitados",
          "function": "distinguir lo documentado de lo ficcional con los referentes proporcionados",
          "error": "se presenta como documentado un hecho que los referentes dados muestran como ficcional",
          "sourceRecordIds": [
            "a74a0230-038b-5e1a-928e-9f5547fd5a30"
          ],
          "terms": [
            [
              "(?:hechos (?:historicos )?)?(?:reales|documentados)",
              "los hechos documentados"
            ],
            [
              "ficcion|ficcional",
              "los hechos de ficción"
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
        }
      ]
    },
    {
      "id": "novela-social",
      "label": "novela social",
      "match": "novelas?(?: breves?)? social(?:es)?",
      "sourceRecordIds": [
        "a3b3ed47-f763-51a4-9187-e0a0ab61613b"
      ],
      "pdfPages": [
        468,
        469,
        470
      ],
      "profile": {
        "genre": "novela social",
        "target": "los sucesos, las voces y las situaciones sociales del mundo narrado del pasaje",
        "plan": "la intención, los sucesos, personajes, lugar, tiempo y referentes expresamente pedidos"
      },
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
      ],
      "features": [
        {
          "id": "novel-structure",
          "match": "funcion|estructura",
          "name": "la función y estructura solicitadas",
          "function": "relacionar la organización del relato con su propósito",
          "error": "se atribuye a una parte una función incompatible con el pasaje",
          "sourceRecordIds": [
            "a3b3ed47-f763-51a4-9187-e0a0ab61613b"
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
          "match": "tiempo narrativo|frecuencia|(?<!de )\\borden\\b(?! (?:anacronico|cronologico))",
          "name": "el tiempo narrativo solicitado",
          "function": "relacionar la disposición o repetición de los acontecimientos con el pasaje",
          "error": "se confunde el orden de los hechos con su disposición o repetición en el relato",
          "sourceRecordIds": [
            "9d04a75f-f6a6-54eb-a9bb-b8180506d6db"
          ],
          "terms": [
            [
              "(?<!de )\\borden\\b(?! (?:cronologico|anacronico))",
              "el orden narrativo"
            ],
            [
              "frecuencia",
              "la frecuencia narrativa"
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
            "84954dd2-8cad-5489-ad7f-736ec8e985cd"
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
              "narrador(?! (?:omnisciente|testigo))|quien narra|quien cuenta",
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
            "0b098237-1a58-5141-ac4d-40811aa44df6"
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
            "1b2daea9-5c73-54c7-9e10-add0a16635d6",
            "51c0b0bc-dda5-5712-b5eb-df8c0e35fe17"
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
              "de orden",
              "los conectores de orden"
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
            "095d0dd1-e3e3-5f34-8ea7-3d0d9cd559b7"
          ]
        },
        {
          "id": "novel-actants",
          "match": "actan",
          "name": "la actancia solicitada",
          "function": "relacionar el papel de los personajes con sus acciones en el relato",
          "error": "se confunde el papel actancial con el nombre del personaje",
          "sourceRecordIds": [
            "692c32da-a7c6-5f75-9850-a8dac64a1451"
          ],
          "terms": [
            [
              "\\bagente\\b",
              "el actante agente"
            ],
            [
              "\\bpaciente\\b",
              "el actante paciente"
            ],
            [
              "beneficiario",
              "el actante beneficiario"
            ],
            [
              "complice",
              "el actante cómplice"
            ],
            [
              "ayudante",
              "el actante ayudante"
            ],
            [
              "oponente",
              "el actante oponente"
            ],
            [
              "aliado",
              "el actante aliado"
            ]
          ]
        },
        {
          "id": "novel-themes",
          "match": "\\btemas?\\b",
          "name": "el tema solicitado",
          "function": "relacionar las ideas del relato con sus episodios",
          "error": "se atribuye al relato un tema sin apoyo textual",
          "sourceRecordIds": [
            "8bc1425b-c39e-5914-af03-064e3c72e59a"
          ]
        },
        {
          "id": "motivations",
          "match": "motivaciones|intenciones de (?:los )?personajes",
          "name": "las motivaciones solicitadas de los personajes",
          "function": "inferir las razones de sus acciones mediante los pasajes disponibles",
          "error": "se atribuye al personaje una intención sin apoyo en el pasaje",
          "sourceRecordIds": [
            "8bc1425b-c39e-5914-af03-064e3c72e59a"
          ]
        },
        {
          "id": "causality",
          "match": "causalidad|relacion(?:es)? causal(?:es)?",
          "name": "las relaciones causales solicitadas",
          "function": "relacionar un suceso con otro según el relato",
          "error": "se presenta como causa un hecho posterior o ajeno al suceso",
          "sourceRecordIds": [
            "8bc1425b-c39e-5914-af03-064e3c72e59a"
          ]
        },
        {
          "id": "novel-chronology",
          "match": "cronologic|anacron",
          "name": "el orden narrativo solicitado",
          "function": "conservar la relación entre la secuencia narrada y los acontecimientos",
          "error": "se invierte la relación temporal solicitada",
          "sourceRecordIds": [
            "9d04a75f-f6a6-54eb-a9bb-b8180506d6db"
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
            "84954dd2-8cad-5489-ad7f-736ec8e985cd"
          ]
        },
        {
          "id": "dialogue",
          "match": "dialogos?|estilo directo",
          "name": "el diálogo solicitado",
          "function": "distinguir las intervenciones y su sentido en el relato",
          "error": "se atribuye una intervención al personaje equivocado",
          "sourceRecordIds": [
            "156d9259-fc29-5d29-976a-a179aaa57c8b"
          ]
        },
        {
          "id": "punctuation",
          "match": "puntuacion|\\bcoma\\b|dos puntos|\\braya\\b",
          "name": "la puntuación solicitada",
          "function": "delimitar los sucesos y las intervenciones sin alterar su sentido",
          "error": "el signo cambia quién habla o la relación entre los sucesos",
          "sourceRecordIds": [
            "156d9259-fc29-5d29-976a-a179aaa57c8b"
          ]
        },
        {
          "id": "narrative-tenses",
          "match": "tiempos? verbales|\\bpasado\\b|\\bpresente\\b",
          "name": "los tiempos verbales solicitados",
          "function": "distinguir el tiempo de las acciones y las intervenciones según el pasaje",
          "error": "un cambio temporal contradice la relación entre los sucesos",
          "sourceRecordIds": [
            "beab2755-caa6-5660-96a6-bd9ca2ff1016",
            "a7918997-4513-5153-849c-2e556cad84c0"
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
          "id": "chapter-boundaries",
          "match": "capitulos|marcas de inicio|inicio.*(?:cierre|progresion)",
          "name": "las marcas de inicio, progresión o cierre solicitadas",
          "function": "delimitar el desarrollo de los episodios para que pueda seguirse el relato",
          "error": "el límite de un episodio interrumpe una relación necesaria",
          "sourceRecordIds": [
            "51c0b0bc-dda5-5712-b5eb-df8c0e35fe17"
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
          "id": "novel-plot",
          "match": "\\btrama\\b",
          "name": "la trama solicitada",
          "function": "relacionar los sucesos y sus conexiones según el pasaje",
          "error": "se añade o se invierte un suceso y cambia el sentido de la trama",
          "sourceRecordIds": [
            "8bc1425b-c39e-5914-af03-064e3c72e59a"
          ]
        },
        {
          "id": "novel-setting",
          "match": "\\bambiente\\b|atmosfera",
          "name": "el ambiente y la atmósfera solicitados",
          "function": "situar los sucesos según los rasgos espaciales y sensoriales disponibles en el pasaje",
          "error": "se atribuye al pasaje un espacio o una atmósfera incompatible con sus referencias",
          "sourceRecordIds": [
            "c66c2573-8d19-5535-84d0-3c12d56563ba"
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
            "4833edf2-a9ef-5a44-bf47-3aa740a209cd"
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
          "id": "social-world",
          "title": "Situaciones del mundo narrado",
          "production": "Relaciona las acciones de los personajes con la situación social ficticia solicitada, conservando las condiciones del mundo narrado.",
          "analysis": "Explica las relaciones entre las acciones y la situación social del mundo narrado con evidencias del pasaje.",
          "comparison": "Contrasta las relaciones entre acciones y situaciones sociales de los mundos narrados con evidencias de los textos dados.",
          "evidence": [
            "La relación con la situación social se reconoce; una referencia requiere precisión.",
            "Menciona acciones y situaciones, pero no establece una relación necesaria entre ellas.",
            "Atribuye al pasaje una condición o una acción social incompatible con sus referencias.",
            "No presenta una relación reconocible entre las acciones y la situación del mundo narrado."
          ],
          "weight": 4
        }
      ]
    }
  ]
}
