import type {OptativeLanguageModule} from './secondary-optative-language'

/** Cuatro géneros periodísticos y publicitarios de HLM6, con perfiles y anclas propios. */
export const optativeHlmLenSix:OptativeLanguageModule={
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
}
