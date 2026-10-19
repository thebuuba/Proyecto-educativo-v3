import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV118 } from './catalog-v118'
/** Exact119 payload checked against Development; previous fields remain inherited. */
export const evaluationCatalogV119={...evaluationCatalogV118,version:'evaluation-2026.119',fhrCommonModules:[
  {
    "id": "formacion-humana-religiosa-comun-1",
    "grade": 1,
    "topics": [
      {
        "id": "life-culture",
        "grade": 1,
        "label": "cultura de la vida y conservación",
        "match": "cultura de la vida|vida en todas sus (?:formas|manifestaciones)",
        "object": "la vida y su conservación",
        "relation": "manifestaciones, condiciones y evidencias de conservación de la vida",
        "sourceRecordIds": [
          "05ef29a4-c44a-5c54-8e5d-67bf919a2ad6",
          "40cf00a2-015f-57e6-82d2-f987d31549d1",
          "554a5d91-f025-5e78-b8cf-b88202450f98",
          "6b66bab7-0ac9-5c0e-a279-794f2628459d"
        ],
        "pdfPages": [
          392,
          394
        ]
      },
      {
        "id": "life-values",
        "grade": 1,
        "label": "valores respecto a la vida",
        "match": "valores (?:morales|culturales|religiosos).*vida",
        "object": "los valores morales, culturales y religiosos respecto a la vida",
        "relation": "valores, fundamentos y perspectivas atribuidos por los textos",
        "sourceRecordIds": [
          "8e43ef08-d507-5766-bb25-e1c8d72c15c9"
        ],
        "pdfPages": [
          392
        ]
      },
      {
        "id": "human-rights",
        "grade": 1,
        "label": "dignidad y derechos humanos",
        "match": "dignidad|derechos humanos",
        "object": "la dignidad y los derechos humanos",
        "relation": "afirmaciones, derechos y evidencias de los textos proporcionados",
        "sourceRecordIds": [
          "71550f5c-32a4-5464-b4ad-466284b49c63",
          "0773063e-8368-5b1f-97da-d3ec08fc7743"
        ],
        "pdfPages": [
          392
        ],
        "excludeWhen": "proclama|manifiesto"
      },
      {
        "id": "jesus-life",
        "grade": 1,
        "label": "Jesús como defensor de la vida",
        "match": "jesus.*(?:defien|defensor).*vida|defien.*vida.*jesus",
        "object": "la defensa de la vida por Jesús",
        "relation": "episodios, decisiones y citas de los textos de Marcos y Juan",
        "sourceRecordIds": [
          "d040f82a-6bc4-587e-9596-6a4cb0e46059"
        ],
        "pdfPages": [
          392
        ]
      },
      {
        "id": "life-institutions",
        "grade": 1,
        "label": "instituciones que defienden vida y ambiente",
        "match": "personas e instituciones|instituciones.*(?:vida|medioambiente)",
        "object": "los aportes de personas e instituciones que defienden la vida y el medioambiente",
        "relation": "aportes documentados y evidencias de las fuentes",
        "sourceRecordIds": [
          "ae00f5ae-e353-5d1f-bb55-d53f7dc81876"
        ],
        "pdfPages": [
          392
        ]
      },
      {
        "id": "life-proclamation",
        "grade": 1,
        "label": "proclama o manifiesto en defensa de la vida",
        "match": "proclama|manifiesto",
        "object": "{choice} en defensa de la vida",
        "relation": "argumentos sobre derechos humanos y valores documentados",
        "sourceRecordIds": [
          "56386186-dfd3-59cd-a319-826a6915591d"
        ],
        "pdfPages": [
          392
        ],
        "choices": [
          [
            "proclama",
            "proclama"
          ],
          [
            "manifiesto",
            "manifiesto"
          ]
        ],
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "community-values",
        "grade": 1,
        "label": "valores de primeras comunidades cristianas",
        "match": "primeras comunidades cristianas",
        "object": "los valores de las primeras comunidades cristianas",
        "relation": "valores, episodios y citas de los textos bíblicos proporcionados",
        "sourceRecordIds": [
          "7a204f92-1111-5402-8455-c1b34a1ba50e"
        ],
        "pdfPages": [
          392
        ],
        "choices": [
          [
            "portafolio",
            "portafolio"
          ],
          [
            "album",
            "álbum"
          ]
        ],
        "productType": "PORTFOLIO"
      },
      {
        "id": "life-exhibition",
        "grade": 1,
        "label": "exposición sobre defensa de la vida",
        "match": "exposicion.*defensa de la vida",
        "object": "la exposición sobre la defensa de la vida con {choice}",
        "relation": "afirmaciones, evidencias y recursos expresamente elegidos",
        "sourceRecordIds": [
          "af4d77a3-ca3c-5986-86f8-433c548086ed"
        ],
        "pdfPages": [
          392
        ],
        "choices": [
          [
            "ilustraciones",
            "ilustraciones"
          ],
          [
            "canciones",
            "canciones"
          ],
          [
            "fotografias|fotos",
            "fotografías"
          ],
          [
            "dibujos",
            "dibujos"
          ]
        ]
      },
      {
        "id": "religions-elements",
        "grade": 1,
        "label": "características de las religiones",
        "match": "caracteristicas.*religiones|religiones.*caracteristicas",
        "object": "las características de las religiones",
        "relation": "características y perspectivas atribuidas a las fuentes proporcionadas",
        "sourceRecordIds": [
          "d49334ac-baae-545d-b69f-75e2ee3fe7af"
        ],
        "pdfPages": [
          392
        ],
        "excludeWhen": "mapa conceptual"
      },
      {
        "id": "religions-map",
        "grade": 1,
        "label": "mapa conceptual de religiones",
        "match": "mapa conceptual.*religiones",
        "object": "el mapa conceptual sobre religiones y sus características",
        "relation": "conceptos, enlaces y relaciones sustentados en las fuentes proporcionadas",
        "sourceRecordIds": [
          "2b0badf1-1f12-5e75-a065-c44d1fdc6143"
        ],
        "pdfPages": [
          392
        ],
        "productType": "CONCEPT_MAP"
      },
      {
        "id": "religion-family",
        "grade": 1,
        "label": "manifestaciones religiosas familiares",
        "match": "manifestaciones religiosas familiares|religion y familia",
        "object": "las manifestaciones religiosas familiares del referente",
        "relation": "características y contexto documentados por el referente",
        "sourceRecordIds": [
          "a776b501-9a02-5591-b087-7816e6524e10",
          "fc7b9a71-38bc-5cb7-b1f0-0a61c37a70f0"
        ],
        "pdfPages": [
          392
        ]
      },
      {
        "id": "religion-panel",
        "grade": 1,
        "label": "panel de vivencias religiosas",
        "match": "vivencias religiosas.*(?:familia|escuela|comunidad)|panel.*vivencias religiosas",
        "object": "los aportes de vivencias religiosas en familia, escuela y comunidad",
        "relation": "afirmaciones y evidencias de los referentes documentales",
        "sourceRecordIds": [
          "48c52a18-4270-55b1-ac64-954873514194"
        ],
        "pdfPages": [
          392
        ],
        "excludeWhen": "composicion"
      },
      {
        "id": "religious-labels",
        "grade": 1,
        "label": "etiquetas curriculares sobre actitudes religiosas",
        "match": "falsas actitudes religiosas|etiqueta curricular.*religios",
        "object": "el uso de la etiqueta curricular «falsas actitudes religiosas»",
        "relation": "atribuciones documentales y evidencias de los referentes",
        "sourceRecordIds": [
          "20815eeb-f89a-590a-a506-5dd044915ec5"
        ],
        "pdfPages": [
          392
        ]
      },
      {
        "id": "religious-composition",
        "grade": 1,
        "label": "composición sobre vivencia religiosa",
        "match": "composicion.*vivencia religiosa",
        "object": "la composición sobre vivencia religiosa del referente",
        "relation": "aporte personal y espiritual descrito por el referente",
        "sourceRecordIds": [
          "802773ab-fe3f-5a70-9db7-3b53774a3b55"
        ],
        "pdfPages": [
          393
        ],
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "cultural-manifestations",
        "grade": 1,
        "label": "manifestaciones culturales y religiosas dominicanas",
        "match": "manifestaciones culturales y religiosas",
        "object": "las manifestaciones culturales y religiosas de la sociedad dominicana",
        "relation": "características, contextos y evidencias de las fuentes proporcionadas",
        "sourceRecordIds": [
          "fcb16a29-c0b8-5ae2-bf73-79e080e51bca",
          "3b6824b2-0123-5c96-a88b-1b2c9c6909a1"
        ],
        "pdfPages": [
          392,
          393
        ]
      },
      {
        "id": "work-classification",
        "grade": 1,
        "label": "clasificación de oficios y profesiones",
        "match": "clasifica.*(?:oficios|profesiones)|clasificacion.*trabajo",
        "object": "los oficios y profesiones del registro de trabajo",
        "relation": "características que sustentan la clasificación del trabajo proporcionado",
        "sourceRecordIds": [
          "736e0250-cb63-52e7-8e01-087b1831f481",
          "ee72154d-ebc7-5e75-9647-b802b68433b4",
          "cab69f60-b0b1-5a4d-8ba7-98e7560000fc"
        ],
        "pdfPages": [
          392,
          393
        ]
      },
      {
        "id": "work-importance",
        "grade": 1,
        "label": "importancia y dificultades del trabajo",
        "match": "importancia.*trabajo|beneficios y dificultades.*trabajo",
        "object": "la importancia del trabajo humano, sus beneficios y dificultades",
        "relation": "aportes, condiciones y dificultades acreditados por las fuentes",
        "sourceRecordIds": [
          "894a7309-88a1-53a7-a1eb-f1be94a7f66d",
          "63a6eaba-47af-576e-a91e-b82c0d687d60"
        ],
        "pdfPages": [
          392,
          393
        ]
      },
      {
        "id": "work-wellbeing",
        "grade": 1,
        "label": "trabajo y bienestar",
        "match": "trabajo y bienestar|trabajo.*bienestar",
        "object": "la relación entre trabajo y bienestar personal, familiar y comunitario",
        "relation": "acciones, condiciones y efectos documentados por los referentes",
        "sourceRecordIds": [
          "8cf68dec-c57c-588e-bb92-80a83682d8c6"
        ],
        "pdfPages": [
          392
        ]
      },
      {
        "id": "women-work",
        "grade": 1,
        "label": "aportes del trabajo de las mujeres",
        "match": "trabajo de (?:las? )?mujeres?|aportes.*mujeres",
        "object": "los aportes del trabajo de las mujeres a la familia y sociedad",
        "relation": "aportes y evidencias documentadas por las fuentes",
        "sourceRecordIds": [
          "734a196a-45e5-5588-abab-cb3b758a0543"
        ],
        "pdfPages": [
          393
        ]
      },
      {
        "id": "biblical-help",
        "grade": 1,
        "label": "ayuda en el texto de Proverbios",
        "match": "proverbios|acciones de ayuda",
        "object": "las acciones de ayuda del texto de Proverbios",
        "relation": "acciones, referencias y evidencias del texto proporcionado",
        "sourceRecordIds": [
          "95e25a73-7530-5687-956f-d7e7e000ce3a"
        ],
        "pdfPages": [
          393
        ]
      },
      {
        "id": "responsibilities",
        "grade": 1,
        "label": "responsabilidades del caso",
        "match": "responsabilidades|tareas.*familia.*escuela",
        "object": "las responsabilidades expresamente dadas del caso",
        "relation": "acciones acordadas, condiciones y evidencias documentadas",
        "sourceRecordIds": [
          "c3b5a98b-da31-5227-af13-680030fee828",
          "765c1aad-5e37-5ad4-a6cc-9b73fd95da09",
          "33039a8c-797d-5c0a-a027-f02f8c31aa77"
        ],
        "pdfPages": [
          393
        ]
      },
      {
        "id": "vocational-reference",
        "grade": 1,
        "label": "intereses y preferencia vocacional",
        "match": "preferencia vocacional|habilidades.*intereses",
        "object": "la relación entre habilidades, intereses y preferencia vocacional del caso",
        "relation": "datos, intereses y alternativas documentados por el caso",
        "sourceRecordIds": [
          "beba9f2f-958e-55e1-bd86-f8d92c70ea2e"
        ],
        "pdfPages": [
          393
        ]
      },
      {
        "id": "profession-representation",
        "grade": 1,
        "label": "representación de oficio o profesión",
        "match": "representa.*(?:oficio|profesion)|representacion de (?:oficio|profesion)",
        "object": "{choice} de la representación dada",
        "relation": "acciones, reseña y recursos de la profesión elegida expresamente proporcionados",
        "sourceRecordIds": [
          "99f489b0-f3a7-5261-a956-678a81523f82"
        ],
        "pdfPages": [
          393
        ],
        "choices": [
          [
            "oficio",
            "oficio"
          ],
          [
            "profesion",
            "profesión"
          ]
        ]
      },
      {
        "id": "adolescent-reality",
        "grade": 1,
        "label": "realidad personal familiar y social adolescente",
        "match": "realidad personal.*familiar.*social",
        "object": "la realidad personal, familiar y social de los adolescentes del referente",
        "relation": "condiciones y relaciones acreditadas por las evidencias proporcionadas",
        "sourceRecordIds": [
          "5694677b-5e99-5c4f-9c97-935ac542dc00",
          "b5cd0b13-5526-54fb-b16d-8080a07cc1e1"
        ],
        "pdfPages": [
          392,
          393
        ]
      },
      {
        "id": "family-values",
        "grade": 1,
        "label": "valores y resolución de conflictos",
        "match": "valores humanos y cristianos|valores.*conflictos",
        "object": "la influencia de valores humanos y cristianos en la resolución de conflictos",
        "relation": "argumentos y evidencias de los referentes familiares y escolares proporcionados",
        "sourceRecordIds": [
          "567f02c1-e2d2-5798-8af8-ac8aaa8a338f",
          "f8cdca97-40b1-5685-8667-a94273a5c9bb"
        ],
        "pdfPages": [
          392,
          393
        ]
      },
      {
        "id": "adolescent-support",
        "grade": 1,
        "label": "orientación y apoyo en la adolescencia",
        "match": "orientacion y apoyo|falta de orientacion",
        "object": "las consecuencias de la falta de orientación y apoyo en la adolescencia",
        "relation": "condiciones, consecuencias y evidencias del referente proporcionado",
        "sourceRecordIds": [
          "1bec290a-a2ee-54c1-aa66-2f92798a039f",
          "90ea142a-7f91-526e-9c79-dd5ab8ea5a8d"
        ],
        "pdfPages": [
          393,
          395
        ]
      },
      {
        "id": "adolescent-composition",
        "grade": 1,
        "label": "composición sobre amistad y familia adolescente",
        "match": "(?:poesia|cancion|drama).*(?:adolescente|amistad|familia)",
        "object": "{choice} sobre situaciones adolescentes de amistad y familia",
        "relation": "situaciones, relaciones y decisiones expresivas sustentadas en el referente proporcionado",
        "sourceRecordIds": [
          "10545048-71f8-5b76-86b0-91ad840cb941"
        ],
        "pdfPages": [
          393
        ],
        "choices": [
          [
            "poesia",
            "poesía"
          ],
          [
            "cancion",
            "canción"
          ],
          [
            "drama",
            "drama"
          ]
        ],
        "choiceDefault": "la composición expresamente elegida",
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "conflict-strategies",
        "grade": 1,
        "label": "estrategias para conflictos adolescentes",
        "match": "estrategias.*conflictos|resolucion armoniosa.*conflictos",
        "object": "las estrategias de resolución de conflictos en la adolescencia",
        "relation": "alternativas y decisiones justificadas según las condiciones del caso dado",
        "sourceRecordIds": [
          "924f6fc5-d5e1-5146-a014-3884ace00f9b",
          "19c596fb-cafc-5bc9-8b7e-ca81f362c378"
        ],
        "pdfPages": [
          392,
          393
        ]
      },
      {
        "id": "conflict-dramatization",
        "grade": 1,
        "label": "dramatización de conflicto y solución",
        "match": "dramatiza.*conflicto|dramatizacion.*conflicto",
        "object": "el conflicto adolescente y la solución propuesta del caso dado",
        "relation": "acciones, decisiones y solución reconocibles según las condiciones proporcionadas",
        "sourceRecordIds": [
          "1db7259a-346e-51f4-b627-3fe5ef2f4921"
        ],
        "pdfPages": [
          393
        ]
      },
      {
        "id": "dialogue-panel",
        "grade": 1,
        "label": "diálogo y paz en situaciones adolescentes",
        "match": "dialogo y paz|panel.*dialogo",
        "object": "el diálogo y la paz para resolver situaciones adolescentes",
        "relation": "argumentos, alternativas y evidencias de los referentes proporcionados",
        "sourceRecordIds": [
          "e57a70f2-cdb6-5ae4-89e5-4b08c39356b8"
        ],
        "pdfPages": [
          393
        ],
        "excludeWhen": "frecuencia"
      },
      {
        "id": "jesus-gospel",
        "grade": 1,
        "label": "novedad de la vida de Jesús en evangelios",
        "match": "novedad.*vida de jesus|jesus.*capitulos.*versiculos",
        "object": "la novedad de la vida de Jesús de Nazaret en los evangelios",
        "relation": "episodios, capítulos y versículos de los textos proporcionados",
        "sourceRecordIds": [
          "9450799a-6b28-52d5-ace6-804360c684c7",
          "d02614df-6b38-547c-acde-8f301e28a997"
        ],
        "pdfPages": [
          393
        ]
      },
      {
        "id": "jesus-values",
        "grade": 1,
        "label": "valores de Jesús en los evangelios",
        "match": "valores.*jesus|jesus.*valores",
        "object": "los valores practicados y enseñados por Jesús de Nazaret",
        "relation": "valores y evidencias de los evangelios proporcionados",
        "sourceRecordIds": [
          "15504dd2-074e-58bb-a378-fd284dea7d2e",
          "97fdcb8e-7913-5679-8700-2e0ff8e31bb0"
        ],
        "pdfPages": [
          393
        ],
        "excludeWhen": "compromiso"
      },
      {
        "id": "jesus-love",
        "grade": 1,
        "label": "amor de Jesús en textos proporcionados",
        "match": "amor de jesus|amor.*jesus de nazaret",
        "object": "el amor de Jesús de Nazaret a las personas",
        "relation": "episodios, acciones y evidencias de los textos proporcionados",
        "sourceRecordIds": [
          "04d920e9-5eaa-5bc1-8799-e9543daf8672",
          "58427410-2354-59f5-9e4c-41f73cfce669"
        ],
        "pdfPages": [
          393
        ]
      },
      {
        "id": "jesus-events",
        "grade": 1,
        "label": "pasión muerte y resurrección de Jesús",
        "match": "pasion.*muerte.*resurreccion",
        "object": "la pasión, muerte y resurrección de Jesús en {choice}",
        "relation": "secuencia, episodios y evidencias de la fuente expresamente elegida",
        "sourceRecordIds": [
          "9875d630-1a16-54dd-8a19-7de8af8ac08a"
        ],
        "pdfPages": [
          393
        ],
        "choices": [
          [
            "lectura",
            "la lectura proporcionada"
          ],
          [
            "video",
            "el video proporcionado"
          ]
        ],
        "choiceDefault": "el referente expresamente elegido"
      },
      {
        "id": "common-good",
        "grade": 1,
        "label": "acciones y bien común",
        "match": "bien comun",
        "object": "las acciones que favorecen el bien común en familia, escuela y comunidad",
        "relation": "acciones, condiciones y efectos sustentados en los referentes proporcionados",
        "sourceRecordIds": [
          "3ff3f803-97d5-54a6-8f56-8686b52e5345",
          "ef745437-a1cf-5372-8ac6-c8378e718ed1"
        ],
        "pdfPages": [
          393,
          394
        ],
        "excludeWhen": "compromiso"
      },
      {
        "id": "common-good-commitment",
        "grade": 1,
        "label": "propuesta de compromiso para el bien común",
        "match": "compromiso.*bien comun",
        "object": "la propuesta de compromiso para el bien común del referente",
        "relation": "acciones propuestas y valores de Jesús de Nazaret atribuidos por el referente",
        "sourceRecordIds": [
          "539a9120-23da-58b9-94d5-b707b7a1499a"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "technology-development",
        "grade": 1,
        "label": "efectos de ciencia y tecnología",
        "match": "efectos positivos y negativos|ciencia.*tecnologia.*desarrollo humano",
        "object": "los efectos positivos y negativos de ciencia y tecnología en el desarrollo humano",
        "relation": "efectos, condiciones y evidencias de los referentes proporcionados",
        "sourceRecordIds": [
          "cdab8ec0-cdc0-589b-924f-a6414c08c43e",
          "8d45ed02-c3eb-5ac8-975a-e147d4ffc2f3"
        ],
        "pdfPages": [
          393,
          394
        ],
        "excludeWhen": "crecimiento economico|progreso.*uso etico"
      },
      {
        "id": "technology-access",
        "grade": 1,
        "label": "causas y consecuencias del acceso tecnológico",
        "match": "falta de acceso.*tecnologia|falta del uso.*tecnologia|sin acceso.*tecnologia",
        "object": "las causas y consecuencias de la falta de acceso a tecnología",
        "relation": "condiciones, causas y consecuencias documentadas por el caso proporcionado",
        "sourceRecordIds": [
          "b0ffc8b6-0aed-5722-8d33-c6bcc8bb4acd"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "biblical-technology",
        "grade": 1,
        "label": "tecnología en Génesis y Crónicas",
        "match": "tecnologia.*(?:genesis|cronicas)|(?:genesis|cronicas).*tecnologia",
        "object": "la presencia y uso de tecnología en Génesis y Crónicas",
        "relation": "referencias, funciones y evidencias de los textos proporcionados",
        "sourceRecordIds": [
          "0c73ff5c-ecff-5df2-8208-9f1f9babf22e"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "technology-artifacts",
        "grade": 1,
        "label": "artefactos y beneficios documentados",
        "match": "artefactos cientificos y tecnologicos|artefactos.*beneficios",
        "object": "los artefactos científicos y tecnológicos y sus beneficios",
        "relation": "funciones y beneficios documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "9e59b8e9-3a6b-5df6-acd0-9b807d6f86d8"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "technology-exhibition",
        "grade": 1,
        "label": "tecnología antes y después",
        "match": "tecnologia antes y despues",
        "object": "la exposición Tecnología antes y después y sus aportes a la calidad de vida",
        "relation": "inventos, transformaciones y evidencias de los referentes proporcionados",
        "sourceRecordIds": [
          "a8987223-34eb-500c-8ae8-6d3c365d9f8b"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "technology-debate",
        "grade": 1,
        "label": "uso ético de tecnología y desarrollo",
        "match": "crecimiento economico.*(?:progreso|desarrollo)|progreso.*uso etico",
        "object": "la relación del crecimiento económico, progreso y desarrollo humano con el uso ético de ciencia y tecnología",
        "relation": "argumentos y evidencias de las fuentes proporcionadas",
        "sourceRecordIds": [
          "493a5bd3-3391-5a30-bbc5-d483a01cc411"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "technology-ethics",
        "grade": 1,
        "label": "criterios éticos de ciencia y tecnología",
        "match": "criterios eticos.*(?:ciencia|tecnologia)",
        "object": "los criterios éticos de uso de la ciencia y tecnología del referente",
        "relation": "criterios, acciones y consecuencias para personas y entorno documentados por el referente",
        "sourceRecordIds": [
          "b1e3e58a-62ae-5c47-9293-f411acd2ecb2",
          "66f667c1-b3fa-553e-9629-54e3bc52c867",
          "5ae9d576-fc1c-5e4e-8322-6895260a3a1c"
        ],
        "pdfPages": [
          393,
          394
        ]
      },
      {
        "id": "technology-panel",
        "grade": 1,
        "label": "panel de beneficios tecnológicos",
        "match": "panel.*beneficios.*(?:ciencia|tecnologia)",
        "object": "los beneficios de ciencia y tecnología para personas y entorno natural",
        "relation": "argumentos y evidencias de las fuentes proporcionadas",
        "sourceRecordIds": [
          "36f8e528-809c-5d17-b589-adc6a7e59fbf"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "technology-environment",
        "grade": 1,
        "label": "ciencia tecnología y entorno natural",
        "match": "relaciones entre ciencia.*tecnologia.*entorno natural|ciencia tecnologia y entorno natural",
        "object": "las relaciones entre ciencia, tecnología y entorno natural",
        "relation": "acciones, condiciones y efectos acreditados por el referente proporcionado",
        "sourceRecordIds": [
          "0249816e-17b6-57dd-87cc-85920fb59fa9",
          "19db6c3b-638d-5120-91e1-5d1ef765c06c"
        ],
        "pdfPages": [
          393,
          394
        ]
      },
      {
        "id": "environment-care",
        "grade": 1,
        "label": "cuidado del entorno natural",
        "match": "cuidado del entorno natural",
        "object": "el cuidado del entorno natural",
        "relation": "acciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "b9bbbb97-e086-5cdb-8246-ff3d5d9f5125",
          "c8395c0e-bca1-5078-9aaa-b9f3a53ccb6f",
          "c077b3b2-c7ca-53eb-8bd6-aabf59a814a0"
        ],
        "pdfPages": [
          394
        ],
        "excludeWhen": "normas|leyes"
      },
      {
        "id": "environment-plan",
        "grade": 1,
        "label": "conservación de vida y entorno",
        "match": "conservacion.*vida.*entorno|conservacion de la vida",
        "object": "las acciones de conservación de la vida y el entorno natural",
        "relation": "fases, recursos y condiciones expresamente proporcionados",
        "sourceRecordIds": [
          "d096ad32-bae9-5dc6-9f63-a93173c0bb86"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "environment-laws",
        "grade": 1,
        "label": "normas y leyes de cuidado ambiental",
        "match": "normas y leyes|leyes.*entorno natural",
        "object": "las normas y leyes dominicanas de cuidado del entorno natural",
        "relation": "normas atribuidas, afirmaciones y evidencias de los textos proporcionados",
        "sourceRecordIds": [
          "0fc908fb-7cee-55c2-9530-bbc2f847ca02"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "environment-news",
        "grade": 1,
        "label": "noticias sobre vida y entorno",
        "match": "noticias.*(?:vida|entorno)|situaciones hechos y noticias",
        "object": "las situaciones, hechos y noticias sobre cuidado de la vida y el entorno natural",
        "relation": "afirmaciones, procedencia y evidencias de las noticias proporcionadas",
        "sourceRecordIds": [
          "8cd49d24-0134-5b7e-bc45-531f09063eac"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "environment-mural",
        "grade": 1,
        "label": "mural de beneficios del cuidado de la vida",
        "match": "mural.*(?:vida|entorno)",
        "object": "el mural informativo sobre beneficios del cuidado de la vida y el entorno natural",
        "relation": "beneficios y relaciones sustentados en los referentes proporcionados",
        "sourceRecordIds": [
          "f6bc10d0-2c81-5120-88d6-9da1faff3629"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "environment-campaign",
        "grade": 1,
        "label": "campaña de cuidado de vida y entorno",
        "match": "campana.*redes|redes sociales.*(?:vida|entorno)",
        "object": "el prototipo de campaña en redes sociales para cuidar la vida y el entorno natural",
        "relation": "acciones, destinatarios y recursos expresamente proporcionados",
        "sourceRecordIds": [
          "462eac70-33a1-56f7-a8c4-19a98844bd2d",
          "a0b9e0c5-1b0f-5b94-970d-f4e2fe780e62"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "health-representation",
        "grade": 1,
        "label": "representación de cuidado de salud y entorno",
        "match": "dramatiza.*salud|acciones.*salud personal.*comunitaria",
        "object": "las acciones de cuidado de salud personal, comunitaria y entorno natural de la situación dada",
        "relation": "acciones y decisiones reconocibles según las condiciones proporcionadas",
        "sourceRecordIds": [
          "97e22f28-9a69-56ce-9719-d1ba726e432a",
          "421d154a-14b5-5718-9f3f-6159fc500a63"
        ],
        "pdfPages": [
          394
        ]
      },
      {
        "id": "adolescent-changes",
        "grade": 1,
        "label": "cambios durante la adolescencia",
        "match": "cambios.*(?:adolescencia|adolescentes)",
        "object": "los cambios {choice} durante la adolescencia",
        "relation": "características y relaciones documentadas por los referentes educativos proporcionados",
        "sourceRecordIds": [
          "62916618-153c-5995-bc61-024d4dbd8c34",
          "3debd5b8-4723-5b0e-be4c-cf8a2ff2a256"
        ],
        "pdfPages": [
          395
        ],
        "choices": [
          [
            "fisicos",
            "físicos"
          ],
          [
            "emocionales",
            "emocionales"
          ],
          [
            "sociales",
            "sociales"
          ],
          [
            "afectivo sexuales|sexuales",
            "afectivo-sexuales"
          ],
          [
            "espirituales",
            "espirituales"
          ]
        ],
        "choiceDefault": "expresamente trabajados",
        "excludeWhen": "dramatiza|dramatizacion"
      },
      {
        "id": "adolescent-questions",
        "grade": 1,
        "label": "interrogantes y preocupaciones adolescentes",
        "match": "interrogantes.*adolescen|preocupaciones adolescentes",
        "object": "las interrogantes y preocupaciones adolescentes del referente",
        "relation": "preocupaciones, relaciones y evidencias documentadas por el referente proporcionado",
        "sourceRecordIds": [
          "9d7db50f-ba78-5137-9025-ab27cc982bc0",
          "aa66511b-41d6-5c5b-b3bf-485b383cad49"
        ],
        "pdfPages": [
          395
        ]
      },
      {
        "id": "personal-knowledge",
        "grade": 1,
        "label": "conocimiento personal y espiritual adolescente",
        "match": "conocimiento personal y espiritual",
        "object": "el conocimiento personal y espiritual en la adolescencia descrito por el referente",
        "relation": "relaciones y evidencias documentadas por el referente",
        "sourceRecordIds": [
          "4b7fe19e-8489-5e2e-8400-b223799d8070"
        ],
        "pdfPages": [
          395
        ],
        "excludeWhen": "dramatiza|dramatizacion|proyecto de vida"
      },
      {
        "id": "adolescent-dramatization",
        "grade": 1,
        "label": "dramatización de cambios y conocimiento adolescente",
        "match": "dramatiza.*cambios.*conocimiento|dramatizacion.*cambios",
        "object": "la influencia de cambios adolescentes en el conocimiento personal y espiritual del referente",
        "relation": "acciones, cambios y relaciones reconocibles según el referente proporcionado",
        "sourceRecordIds": [
          "16875baf-3b5c-5b21-9b6e-9000471a0271"
        ],
        "pdfPages": [
          395
        ]
      },
      {
        "id": "life-project",
        "grade": 1,
        "label": "proyecto de vida",
        "match": "proyecto de vida",
        "object": "el proyecto de vida del referente con {choice}",
        "relation": "componentes, valores y condiciones documentados por el referente proporcionado",
        "sourceRecordIds": [
          "8fac8aed-3ac3-5ed1-92ac-0c63a73ad4b6"
        ],
        "pdfPages": [
          395
        ],
        "choices": [
          [
            "vision",
            "visión"
          ],
          [
            "mision",
            "misión"
          ],
          [
            "metas",
            "metas futuras"
          ]
        ]
      },
      {
        "id": "dialogue-observation",
        "grade": 1,
        "label": "cumplimiento observable de turnos y referencia a opiniones",
        "match": "frecuencia.*turnos|frecuencia.*opiniones religiosas",
        "object": "las reglas de turnos y de referencia respetuosa a opiniones religiosas distintas",
        "relation": "reglas concretas y oportunidades observadas proporcionadas",
        "sourceRecordIds": [
          "d79ab9aa-7451-5897-a15d-c33d838ee084",
          "e57a70f2-cdb6-5ae4-89e5-4b08c39356b8"
        ],
        "pdfPages": [
          393
        ]
      }
    ],
    "policy": "OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH"
  },
  {
    "id": "formacion-humana-religiosa-comun-2",
    "grade": 2,
    "topics": [
      {
        "id": "life-stages",
        "grade": 2,
        "label": "etapas de la vida humana",
        "match": "etapas de la vida|diferentes momentos.*ser humano",
        "object": "las etapas de la vida humana",
        "relation": "características y relaciones documentadas por los referentes educativos proporcionados",
        "sourceRecordIds": [
          "1ef7820d-405c-5d37-bd09-5d85d808a82e",
          "fcc10fd9-dca5-5374-8de0-23a805f6276b"
        ],
        "pdfPages": [
          397
        ]
      },
      {
        "id": "life-dignity",
        "grade": 2,
        "label": "vida y dignidad por derechos humanos",
        "match": "dignidad.*(?:vida|persona)|vida.*dignidad",
        "object": "el respeto a la vida y la dignidad de la persona",
        "relation": "afirmaciones y derechos atribuidos a los textos dados de la Declaración Universal y la Constitución",
        "sourceRecordIds": [
          "add87da8-f64e-5dc7-bba5-5aa1c9e4db15",
          "c0772aad-f7b5-5723-bc3b-0fd94587a253"
        ],
        "pdfPages": [
          397
        ],
        "excludeWhen": "artistica"
      },
      {
        "id": "image-god",
        "grade": 2,
        "label": "imagen y semejanza de Dios en textos",
        "match": "imagen y semejanza",
        "object": "la imagen y semejanza de Dios atribuida al ser humano por los textos",
        "relation": "afirmaciones, citas y argumentos del Génesis y Salmo proporcionados",
        "sourceRecordIds": [
          "31a75187-2594-563c-9355-a3b62c83d579"
        ],
        "pdfPages": [
          397
        ]
      },
      {
        "id": "religious-origins",
        "grade": 2,
        "label": "origen y valor de la vida en religiones",
        "match": "origen.*valor.*vida|vision religiosa de la vida",
        "object": "el origen y el valor de la vida según las grandes religiones de los referentes",
        "relation": "perspectivas, fundamentos y evidencias atribuidas a las fuentes proporcionadas",
        "sourceRecordIds": [
          "3b7e4a78-9469-517e-8f3a-ccd1290eda7e",
          "7836f2c7-160b-5719-b49c-04885fc23849"
        ],
        "pdfPages": [
          397
        ]
      },
      {
        "id": "life-care",
        "grade": 2,
        "label": "acciones de protección de la vida",
        "match": "acciones.*(?:cuidado|proteccion).*vida",
        "object": "las acciones de cuidado y protección de la vida del referente",
        "relation": "acciones, condiciones y consecuencias documentadas en familia, escuela y comunidad",
        "sourceRecordIds": [
          "72fa7db9-a30d-5150-b4b2-abad4d233287"
        ],
        "pdfPages": [
          397
        ]
      },
      {
        "id": "life-art",
        "grade": 2,
        "label": "presentación artística de razones sobre dignidad",
        "match": "(?:presentacion|produccion) artistica.*dignidad|razones eticas.*dignidad",
        "object": "la presentación artística de razones {choice} que defienden la dignidad de la vida",
        "relation": "razones y evidencias atribuidas a los referentes expresamente proporcionados",
        "sourceRecordIds": [
          "c7caacc1-2b3b-54cb-960b-1cb02abb1592"
        ],
        "pdfPages": [
          397
        ],
        "choices": [
          [
            "eticas",
            "éticas"
          ],
          [
            "morales",
            "morales"
          ],
          [
            "religiosas",
            "religiosas"
          ],
          [
            "cientificas",
            "científicas"
          ]
        ],
        "choiceDefault": "expresamente elegidas"
      },
      {
        "id": "work-classification",
        "grade": 2,
        "label": "clasificación del trabajo sociocultural",
        "match": "clasifica.*trabajo|clasificacion del trabajo",
        "object": "el trabajo del registro sociocultural proporcionado",
        "relation": "características y evidencias que sustentan su clasificación",
        "sourceRecordIds": [
          "7ca8fe91-faa3-537b-987c-19aca9416822",
          "a73fb046-9bb7-53e8-9799-8c3330a1045c"
        ],
        "pdfPages": [
          397
        ]
      },
      {
        "id": "work-goals",
        "grade": 2,
        "label": "logros laborales y metas documentadas",
        "match": "personas.*(?:logrado|logros).*metas|logros laborales|logros.*metas laborales",
        "object": "los logros de metas laborales de personas descritas en las fuentes",
        "relation": "condiciones, acciones y resultados documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "828d5d82-a250-59e2-9c93-6b46fc54e640",
          "effa0980-3054-5a99-b58d-0762f3f48a99"
        ],
        "pdfPages": [
          397
        ]
      },
      {
        "id": "work-benefits",
        "grade": 2,
        "label": "trabajo y bienestar",
        "match": "importancia.*trabajo|beneficios y dificultades.*trabajo|trabajo y bienestar",
        "object": "la importancia, beneficios y dificultades del trabajo para el bienestar",
        "relation": "aportes, condiciones y dificultades documentados para personas, familia y sociedad",
        "sourceRecordIds": [
          "9bedc594-d629-55fd-825b-8a778695a231",
          "9e4cf4f3-514b-5f73-adfe-40a7b1603698"
        ],
        "pdfPages": [
          397
        ]
      },
      {
        "id": "work-tree",
        "grade": 2,
        "label": "árbol de valores del trabajo humano",
        "match": "arbol.*valores.*trabajo",
        "object": "el árbol de valores del trabajo humano",
        "relation": "valores atribuidos, relaciones y efectos sobre el bienestar documentados por los referentes",
        "sourceRecordIds": [
          "2b3fdffd-9a55-580e-a30e-f976346e84df"
        ],
        "pdfPages": [
          397
        ],
        "productType": "CONCEPT_MAP"
      },
      {
        "id": "work-dramatization",
        "grade": 2,
        "label": "dramatización de metas laborales",
        "match": "dramatiza.*(?:laboral|metas)|dramatizacion.*metas laborales",
        "object": "el caso de logros de metas laborales expresamente proporcionado",
        "relation": "acciones, decisiones y resultados reconocibles según las condiciones del caso",
        "sourceRecordIds": [
          "6012245f-88a3-5fbb-a5d8-87949bc37ab5"
        ],
        "pdfPages": [
          397
        ]
      },
      {
        "id": "work-celebration",
        "grade": 2,
        "label": "celebración de producciones y aprendizajes",
        "match": "celebracion.*(?:producciones|aprendizajes).*trabajo",
        "object": "la celebración de producciones y aprendizajes sobre el trabajo",
        "relation": "producciones, aprendizajes y condiciones expresamente solicitados",
        "sourceRecordIds": [
          "e1fb0572-2bb1-5e97-97b3-c71a9dd62dd1"
        ],
        "pdfPages": [
          397
        ]
      },
      {
        "id": "family-description",
        "grade": 2,
        "label": "realidad familiar del referente",
        "match": "realidad familiar",
        "object": "la realidad familiar del referente proporcionado",
        "relation": "características y relaciones expresamente documentadas por el referente",
        "sourceRecordIds": [
          "c5634e99-c416-59b8-bff7-719a2e9dc538"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "family-types",
        "grade": 2,
        "label": "tipos y características de familias",
        "match": "tipos.*familias|familias.*tipos",
        "object": "los tipos y características de familias de los referentes",
        "relation": "características, contextos y evidencias documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "7db6ad7f-68a5-5c8d-ade4-44d38ebe374b",
          "96a2572b-c87e-5b1e-a2d4-94e979d590fd"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "family-roles",
        "grade": 2,
        "label": "situaciones problemas y roles familiares",
        "match": "problemas.*familia.*roles|roles.*familia|familia y resolucion de conflictos",
        "object": "las situaciones, problemas y roles familiares del referente",
        "relation": "condiciones, roles y alternativas documentadas por el caso proporcionado",
        "sourceRecordIds": [
          "74c5ca91-b887-5851-adb1-1bde3c5877c7",
          "c71fb43e-5dd5-5365-a445-cb023d4d77f8"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "family-rights",
        "grade": 2,
        "label": "derechos de la familia",
        "match": "derechos de la familia",
        "object": "los derechos de la familia atribuidos al artículo 55 de la Constitución dada",
        "relation": "normas atribuidas, afirmaciones y evidencias del texto proporcionado",
        "sourceRecordIds": [
          "a4234858-ca7b-55d2-9934-1bfb9123311a"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "family-culture",
        "grade": 2,
        "label": "elementos culturales y sociales familiares",
        "match": "elementos culturales y sociales.*familia",
        "object": "los elementos culturales y sociales de la familia dominicana de los referentes",
        "relation": "características, contextos y evidencias documentadas por las fuentes",
        "sourceRecordIds": [
          "eaec3971-636f-5283-a9d4-bff813123239",
          "6b0e3e4b-ed89-51fd-b5f9-d655f3247d8a"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "family-biblical",
        "grade": 2,
        "label": "familia trato y amor en textos bíblicos",
        "match": "familia.*trato.*amor|trato.*familia.*textos biblicos",
        "object": "las características, trato y amor familiar descritos en los textos dados",
        "relation": "afirmaciones, episodios y citas de Mateo, Efesios, Proverbios y Corintios proporcionados",
        "sourceRecordIds": [
          "e17182de-2fd7-5071-a088-9e419dfa91b4"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "family-album",
        "grade": 2,
        "label": "álbum familiar con reseña",
        "match": "album familiar",
        "object": "el álbum familiar con {choice} del referente proporcionado",
        "relation": "organización y relaciones entre los componentes expresamente proporcionados",
        "sourceRecordIds": [
          "38dc9c5b-b659-5848-b5c0-e5861cad159f"
        ],
        "pdfPages": [
          398
        ],
        "productType": "PORTFOLIO",
        "choices": [
          [
            "fotografias|fotos",
            "fotografías"
          ],
          [
            "imagenes",
            "imágenes"
          ],
          [
            "resena(?: biografica)?",
            "reseña biográfica"
          ]
        ],
        "choiceDefault": "los componentes expresamente elegidos"
      },
      {
        "id": "family-values",
        "grade": 2,
        "label": "valores familiares documentados",
        "match": "valores.*familia(?:res)?|familia.*valores",
        "object": "los valores familiares atribuidos por los referentes dominicanos",
        "relation": "valores, situaciones y evidencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "b0c288b7-03ac-517b-ae0e-223e20c92263",
          "82496629-ef50-54b1-b770-0d090186f965"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "family-colloquium",
        "grade": 2,
        "label": "coloquio de soluciones familiares",
        "match": "coloquio.*(?:familia(?:res)?|madres|padres)",
        "object": "el coloquio sobre soluciones a dificultades y conflictos familiares",
        "relation": "preguntas, testimonios atribuidos y alternativas de los referentes proporcionados",
        "sourceRecordIds": [
          "0e51b460-9ad2-5ed6-866f-e47c475975ad"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "jesus-parables",
        "grade": 2,
        "label": "valores y acciones de Jesús en parábolas",
        "match": "parabolas|valores y acciones de jesus",
        "object": "los valores y acciones de Jesús de Nazaret en las parábolas dadas",
        "relation": "episodios, acciones y citas de los textos proporcionados de Lucas, Marcos y Mateo",
        "sourceRecordIds": [
          "e470e794-de9c-5601-a58f-41afe91d5143"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "jesus-mission",
        "grade": 2,
        "label": "cuadro comparativo de etapas de la misión de Jesús",
        "match": "cuadro comparativo.*mision.*jesus|etapas.*mision.*jesus",
        "object": "las etapas de la misión de Jesús de Nazaret",
        "relation": "etapas, episodios y relaciones documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "07d944f7-241f-5256-b178-e4a741ce0db9"
        ],
        "pdfPages": [
          398
        ],
        "productType": "WRITTEN_PRODUCTION",
        "objects": {
          "PRODUCTION": "el cuadro comparativo de las etapas de la misión de Jesús de Nazaret",
          "ANALYSIS": "el cuadro comparativo de las etapas de la misión de Jesús de Nazaret"
        }
      },
      {
        "id": "jesus-mission-narrative",
        "grade": 2,
        "label": "narración de la misión de Jesús",
        "match": "relata.*mision.*jesus|narra.*mision.*jesus|narracion de la mision",
        "object": "los momentos claves de la misión de Jesús de Nazaret",
        "relation": "secuencia, episodios y evidencias documentadas por los textos proporcionados",
        "sourceRecordIds": [
          "fd56d4e9-dea0-534a-a6a6-2e426b258b46"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "jesus-interviews",
        "grade": 2,
        "label": "entrevistas sobre la misión y valores de Jesús",
        "match": "entrevistas.*(?:lideres religiosos|mision.*jesus)",
        "object": "las entrevistas sobre la misión y valores de Jesús de Nazaret en la sociedad actual",
        "relation": "preguntas, perspectivas atribuidas y evidencias de los referentes proporcionados",
        "sourceRecordIds": [
          "8daf9264-a0ed-500e-a676-c9c490ae82c3"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "god-love",
        "grade": 2,
        "label": "amor de Dios en textos proporcionados",
        "match": "amor de dios",
        "object": "el amor de Dios descrito en los textos proporcionados",
        "relation": "afirmaciones, citas y evidencias atribuidas al evangelio de Juan, Oseas, primera carta de Juan y Tesalonicenses dados",
        "sourceRecordIds": [
          "4d13cac6-eefa-51c7-90f2-a5042d257231",
          "d247c2ac-d8b5-560d-94d0-7895341ed7e8"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "jesus-treatment",
        "grade": 2,
        "label": "trato de Jesús hacia las personas",
        "match": "trato.*jesus.*personas|jesus.*trato.*personas",
        "object": "el trato de Jesús de Nazaret hacia las personas descrito en los textos",
        "relation": "acciones, decisiones y citas documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "e81fd0fb-600c-5295-bf26-934cb33b3cc5",
          "ffebc986-296b-5439-bb81-7aa68772e284"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "jesus-passion",
        "grade": 2,
        "label": "panel de juicio y resurrección de Jesús",
        "match": "panel.*(?:juicio|crucifixion|resurreccion)|pasion.*muerte.*resurreccion",
        "object": "el juicio, crucifixión, muerte, sepultura y resurrección de Jesús de Nazaret",
        "relation": "secuencia, afirmaciones y evidencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "99a6fa94-14a7-5294-b391-6b41d9f5fa31",
          "1c61ed2e-ed27-5329-b710-7f005cd6deca"
        ],
        "pdfPages": [
          398
        ],
        "excludeWhen": "entrevista"
      },
      {
        "id": "passion-interview",
        "grade": 2,
        "label": "guion de entrevista sobre pasión y resurrección",
        "match": "entrevista.*(?:pasion|crucifixion|resurreccion)",
        "object": "el guion de entrevista sobre el significado de la pasión, muerte y resurrección de Jesús de Nazaret atribuido por el referente",
        "relation": "preguntas, significado atribuido y evidencias expresamente proporcionadas",
        "sourceRecordIds": [
          "4d313297-da18-5c5e-b756-3defbe4bf967"
        ],
        "pdfPages": [
          398
        ],
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "science-artifacts",
        "grade": 2,
        "label": "artefactos inventos y beneficios",
        "match": "artefactos tecnologicos|inventos cientificos.*beneficios",
        "object": "los artefactos tecnológicos e inventos científicos y sus beneficios",
        "relation": "funciones, beneficios y evidencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "efba2497-208e-54f0-8fec-c805f1035134"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "science-inventions",
        "grade": 2,
        "label": "características y aportes de inventos",
        "match": "caracteristicas.*inventos|inventos.*cuidado.*vida",
        "object": "las características y aportes de inventos científicos y tecnológicos al cuidado de vida y entorno",
        "relation": "características, funciones y aportes documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "169d306c-1cbd-5149-96cb-f122e0701a65",
          "7fa77ae4-67ae-593c-95d9-da7bf7433190"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "covid-science",
        "grade": 2,
        "label": "contribución científica ante Covid 19",
        "match": "covid|pandemia",
        "object": "la contribución de ciencias y tecnologías ante la pandemia de Covid 19",
        "relation": "contribuciones, condiciones e impactos personales, familiares y sociales documentados por las fuentes dadas",
        "sourceRecordIds": [
          "79563e36-29e6-5474-a2e8-36c671d71559",
          "286d15bf-2c99-5fcd-b67a-0d9ee9221100"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "bioethics",
        "grade": 2,
        "label": "bioética y uso de ciencias y tecnologías",
        "match": "bioetica",
        "object": "la bioética y su aporte al uso de ciencias y tecnologías",
        "relation": "criterios, decisiones y consecuencias documentadas en los ámbitos del referente proporcionado",
        "sourceRecordIds": [
          "12cc07f3-2de3-5d6b-ae06-06a65ffb3066",
          "65998773-511e-53df-98c2-48540318cefc",
          "e8395104-aa7b-56b5-bc9c-a44f919ba432"
        ],
        "pdfPages": [
          398
        ],
        "objects": {
          "VERIFICATION": "los criterios de bioética para el uso de ciencias y tecnologías expresamente acordados en el registro proporcionado"
        }
      },
      {
        "id": "science-fair",
        "grade": 2,
        "label": "feria científica y tecnológica",
        "match": "feria cientifica y tecnologica",
        "object": "la feria científica y tecnológica",
        "relation": "producciones, aportes y condiciones expresamente proporcionados",
        "sourceRecordIds": [
          "d65fb5b2-d7ff-560e-a9ac-f5e024cc72ae"
        ],
        "pdfPages": [
          398
        ]
      },
      {
        "id": "environment-sustainability",
        "grade": 2,
        "label": "cuidado y sostenibilidad de la casa común",
        "match": "cuidado y sostenibilidad|casa comun",
        "object": "el cuidado y la sostenibilidad del entorno natural como casa común",
        "relation": "acciones, condiciones y efectos documentados para personas y sociedad",
        "sourceRecordIds": [
          "1dbd639b-9b71-59bd-911f-3476a8d19b4f",
          "562a8ef8-5a8a-5502-8962-e87518060e5d",
          "ebe3d5fa-4dcf-5da2-9c0b-16ed72ef3d86",
          "3361e113-dc40-5170-87dc-4803dcd99170"
        ],
        "pdfPages": [
          399
        ],
        "excludeWhen": "laudato si|ecologia integral"
      },
      {
        "id": "laudato-care",
        "grade": 2,
        "label": "acciones ambientales según Laudato Si",
        "match": "laudato si",
        "object": "las acciones que favorecen y desfavorecen el cuidado del entorno natural según Laudato Si",
        "relation": "acciones, consecuencias y afirmaciones atribuidas al texto proporcionado",
        "sourceRecordIds": [
          "2295f74c-ab97-5980-b024-6b57f6763c18"
        ],
        "pdfPages": [
          399
        ]
      },
      {
        "id": "resource-management",
        "grade": 2,
        "label": "gestión y preservación de recursos naturales",
        "match": "gestion y preservacion|recursos naturales.*generaciones",
        "object": "la gestión y preservación de recursos naturales y sus efectos en nuevas generaciones",
        "relation": "alternativas, condiciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "be54d537-a281-56a5-8ca2-badac93c729b"
        ],
        "pdfPages": [
          399
        ]
      },
      {
        "id": "environment-values",
        "grade": 2,
        "label": "valores en el cuidado del entorno natural",
        "match": "valores culturales.*(?:espirituales|axiologicos)",
        "object": "los valores culturales, espirituales y axiológicos en el cuidado del entorno natural",
        "relation": "valores atribuidos, acciones y relaciones documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "b5c9b393-080d-508f-ba4e-b1ad4fc05703"
        ],
        "pdfPages": [
          399
        ]
      },
      {
        "id": "integral-ecology",
        "grade": 2,
        "label": "representación de ecología integral",
        "match": "ecologia integral",
        "object": "la situación de ecología integral expresamente proporcionada",
        "relation": "acciones, condiciones y relaciones reconocibles de sostenimiento del entorno natural",
        "sourceRecordIds": [
          "9346a44e-eb6d-5b59-a922-229d23873ef2",
          "017529b6-bdf7-5268-8452-f050a50f5c44"
        ],
        "pdfPages": [
          399
        ]
      },
      {
        "id": "adolescent-description",
        "grade": 2,
        "label": "descripción de características adolescentes",
        "match": "descripcion.*(?:adolescentes?|caracteristicas)|describe.*caracteristicas.*adolescentes?",
        "object": "las características {choice} de la adolescencia del referente proporcionado",
        "relation": "características y relaciones expresamente documentadas con intereses, comportamientos y decisiones",
        "sourceRecordIds": [
          "cba1c202-5e0b-5ad2-9459-a886ed589f0e",
          "efa5df22-e644-562a-a924-c3cac45cb98d"
        ],
        "pdfPages": [
          399
        ],
        "choices": [
          [
            "fisicas|fisicos",
            "físicas"
          ],
          [
            "cognitivas|cognitivos",
            "cognitivas"
          ],
          [
            "emocionales",
            "emocionales"
          ],
          [
            "sociales",
            "sociales"
          ],
          [
            "espirituales",
            "espirituales"
          ]
        ],
        "choiceDefault": "expresamente trabajadas"
      },
      {
        "id": "adolescent-comparison",
        "grade": 2,
        "label": "comparación de intereses y cambios adolescentes",
        "match": "compara.*intereses.*(?:cambios|adolescencia)|comparacion.*intereses",
        "object": "los intereses, comportamientos y valores en relación con cambios adolescentes del referente",
        "relation": "semejanzas, diferencias y relaciones documentadas por los referentes educativos proporcionados",
        "sourceRecordIds": [
          "6a9bb7c2-d3ec-5c7c-ba63-aa551a4f4a36",
          "6e8084d6-a3c1-5146-bc2f-9f7f6d731bc7",
          "10856706-03bc-54d0-a98a-bdbeed26427a"
        ],
        "pdfPages": [
          399
        ]
      },
      {
        "id": "affective-development",
        "grade": 2,
        "label": "desarrollo afectivo sexual adolescente",
        "match": "desarrollo afectivo[ -]sexual",
        "object": "el desarrollo afectivo-sexual y su importancia durante la adolescencia",
        "relation": "conceptos y relaciones documentados por los referentes educativos proporcionados",
        "sourceRecordIds": [
          "ccd8dc0d-c955-5f1c-9a0a-7a09166abe47"
        ],
        "pdfPages": [
          399
        ]
      },
      {
        "id": "adolescent-integrity",
        "grade": 2,
        "label": "derecho a la integridad física adolescente",
        "match": "integridad fisica",
        "object": "el derecho a la integridad física de los adolescentes",
        "relation": "afirmaciones, derechos y argumentos atribuidos al artículo 12 de la Ley 136-03 y documentos dados",
        "sourceRecordIds": [
          "09111bc6-2238-5df2-84cc-d1815b0255c1"
        ],
        "pdfPages": [
          399
        ]
      },
      {
        "id": "religious-composition",
        "grade": 2,
        "label": "composición de vivencia religiosa adolescente",
        "match": "composicion.*vivencia religiosa",
        "object": "la composición sobre vivencia religiosa y desarrollo humano y espiritual del referente",
        "relation": "relaciones y aportes descritos por el referente proporcionado",
        "sourceRecordIds": [
          "ba4dea60-392f-569c-8287-f550d343f155"
        ],
        "pdfPages": [
          399
        ],
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "decision-elements",
        "grade": 2,
        "label": "elementos para decisiones adolescentes",
        "match": "elementos.*(?:tomar decisiones|decisiones acertadas)",
        "object": "los elementos para tomar decisiones durante la adolescencia",
        "relation": "condiciones, alternativas y consecuencias documentadas por el caso proporcionado",
        "sourceRecordIds": [
          "123e5e3d-87bd-5ef3-b39e-41b57962f520",
          "4bf36aec-dfbc-5d83-b39a-40738c510aa8"
        ],
        "pdfPages": [
          399
        ]
      },
      {
        "id": "hasty-decisions",
        "grade": 2,
        "label": "decisiones apresuradas en la adolescencia",
        "match": "decisiones apresuradas",
        "object": "las causas y consecuencias de decisiones apresuradas durante la adolescencia",
        "relation": "decisiones, condiciones y consecuencias documentadas por el caso proporcionado",
        "sourceRecordIds": [
          "4f606262-9cca-529b-bf0d-ef350751df61"
        ],
        "pdfPages": [
          399
        ]
      }
    ],
    "policy": "OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH"
  }
]} as unknown as EvaluationCatalog
