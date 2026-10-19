import type {OptativeLanguageModule} from './secondary-optative-language'

/** HLM de quinto: perfiles propios de epopeya y novela policíaca, con anclas literales. */
export const optativeHlmLenFive:OptativeLanguageModule={
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
}
