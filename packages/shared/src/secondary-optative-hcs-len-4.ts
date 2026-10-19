import type {OptativeLanguageModule} from './secondary-optative-language'

/** HCS de cuarto: anclas propias; no exige intimidad, creencias ni todos los rasgos de un género. */
export const optativeHcsLenFour:OptativeLanguageModule={
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
