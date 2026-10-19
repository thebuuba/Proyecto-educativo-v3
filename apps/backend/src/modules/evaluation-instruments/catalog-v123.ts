import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV122 } from './catalog-v122'
/** Exact123 payload checked against Development; previous fields remain inherited. */
export const evaluationCatalogV123={...evaluationCatalogV122,version:'evaluation-2026.123',fhrCommonModules:[
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
  },
  {
    "id": "formacion-humana-religiosa-comun-3",
    "grade": 3,
    "topics": [
      {
        "id": "life-value",
        "grade": 3,
        "label": "valor y respeto a la vida",
        "match": "valor.*respeto.*vida",
        "object": "el valor y respeto a la vida",
        "relation": "afirmaciones, acciones y consecuencias documentadas por los referentes dados",
        "sourceRecordIds": [
          "2d6f0722-f424-5018-af2b-5bc6901b74a8"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-mural",
        "grade": 3,
        "label": "mural de respeto e irrespeto a la vida",
        "match": "mural.*(?:respeto|irrespeto).*vida",
        "object": "el mural de respeto e irrespeto a la vida de personas y naturaleza",
        "relation": "situaciones, relaciones y evidencias de los referentes proporcionados",
        "sourceRecordIds": [
          "5b3f5c58-103d-5fbb-90ef-4452d8bc885c"
        ],
        "pdfPages": [
          401
        ],
        "productType": "PROJECT",
        "planReferenceOnly": true
      },
      {
        "id": "life-situations",
        "grade": 3,
        "label": "situaciones de respeto e irrespeto a la vida",
        "match": "situaciones.*(?:respeto|irrespeto).*vida",
        "object": "las situaciones de respeto e irrespeto a la vida del referente",
        "relation": "causas, acciones y efectos documentados en los casos proporcionados",
        "sourceRecordIds": [
          "789c2db5-5675-5e9f-83ae-5794f07ffab0"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true
      },
      {
        "id": "rights-panel",
        "grade": 3,
        "label": "panel de violaciones de derechos humanos",
        "match": "panel.*(?:violaciones|derechos humanos)",
        "object": "el panel sobre violaciones de derechos humanos de los referentes",
        "relation": "propósito, secuencia y relación de las intervenciones con las afirmaciones y evidencias de los textos proporcionados",
        "sourceRecordIds": [
          "ea41f2ee-ee28-58ad-8be8-48b105f54f08",
          "fc0df732-b861-5d9f-8baf-b187ce2f200d"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true
      },
      {
        "id": "rights-texts",
        "grade": 3,
        "label": "dignidad y defensa de vida en textos",
        "match": "dignidad.*defensa.*vida|defensa.*vida.*dignidad",
        "object": "la dignidad humana y defensa de la vida según los textos dados",
        "relation": "afirmaciones y artículos atribuidos a {choice}",
        "sourceRecordIds": [
          "00bb60e0-d8e7-5cb0-9e57-709415a57fd6",
          "9c9592a2-9d3b-565b-aa74-a370548b667f",
          "eb797144-c7a8-59a2-9915-de94105820c6",
          "ce45611b-d759-5be7-b92c-94212788f011",
          "94cca4b9-c390-546f-a6b2-590e600320b9"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "constitucion",
            "la Constitución"
          ],
          [
            "declaracion(?: universal)?",
            "la Declaración Universal"
          ]
        ],
        "choiceDefault": "los textos expresamente trabajados"
      },
      {
        "id": "religious-life",
        "grade": 3,
        "label": "valor de la vida en concepciones religiosas",
        "match": "valor.*vida.*(?:cristianismo|concepciones religiosas)",
        "object": "el valor de la vida en el cristianismo y otras concepciones religiosas",
        "relation": "perspectivas y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "f39c33c1-8e54-5fd9-8de6-24bec02c8d64",
          "88d75898-fe39-52d7-b06c-5b752500be06"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true
      },
      {
        "id": "vocation-talents",
        "grade": 3,
        "label": "relaciones documentadas con la preferencia vocacional",
        "match": "talentos|habilidades.*(?:intereses|preferencia).*vocacional|capacidades.*vocacional|preferencia vocacional",
        "object": "las relaciones documentadas entre {choice} y la preferencia vocacional",
        "relation": "características y relaciones expresamente descritas en el caso educativo proporcionado",
        "sourceRecordIds": [
          "72979943-82f8-570e-85a7-e16eb051fe69",
          "16c5f507-9d65-5d68-a188-f496dcd0d189"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "talentos",
            "talentos"
          ],
          [
            "habilidades",
            "habilidades"
          ],
          [
            "capacidades",
            "capacidades"
          ],
          [
            "intereses",
            "intereses"
          ]
        ],
        "choiceDefault": "los componentes expresamente trabajados"
      },
      {
        "id": "profession-process",
        "grade": 3,
        "label": "proceso para elegir profesión u oficio",
        "match": "proceso.*(?:profesion|oficio)",
        "object": "el proceso para elegir una profesión u oficio del referente",
        "relation": "etapas, condiciones y decisiones documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "587da7f5-7e29-511e-8573-e53f4044a85f"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-service",
        "grade": 3,
        "label": "trabajo como enriquecimiento y servicio",
        "match": "trabajo.*(?:enriquecimiento|servicio)",
        "object": "el trabajo como enriquecimiento personal y servicio a la sociedad",
        "relation": "aportes, condiciones y perspectivas documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "c69a2643-6a0f-5099-8d71-1bdb14432875",
          "8b17400c-413b-5b04-a963-989efa790fc6"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-sense",
        "grade": 3,
        "label": "sentido del trabajo en textos",
        "match": "sentido del trabajo",
        "object": "el sentido del trabajo en la realización de la persona según los textos dados",
        "relation": "afirmaciones, citas y argumentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "2351ed22-4f7a-5c5b-827e-084af8cf4232",
          "e4c6847b-ede4-5548-bf27-cf684d1f5aea"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true
      },
      {
        "id": "professionals-panel",
        "grade": 3,
        "label": "panel de dificultades vivencias y logros profesionales",
        "match": "panel.*profesionales|conversatorio.*profesionales",
        "object": "el panel con profesionales sobre dificultades, vivencias y logros documentados",
        "relation": "propósito, secuencia y recursos expresamente pedidos para el panel",
        "sourceRecordIds": [
          "b3a26ca7-c931-5f33-91cf-55685b9a5003"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-celebration",
        "grade": 3,
        "label": "celebración de beneficios del trabajo",
        "match": "celebracion.*beneficios.*trabajo",
        "object": "la celebración para presentar procesos sobre beneficios del trabajo humano",
        "relation": "propósito, secuencia y condiciones de los productos proporcionados",
        "sourceRecordIds": [
          "e11a59ed-183f-58b9-a3c2-d44f6f3635e6"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true,
        "excludeWhen": "cientific"
      },
      {
        "id": "family-mission",
        "grade": 3,
        "label": "concepto problemáticas y misión familiar en textos",
        "match": "mision.*familia|familia.*aparecida|concepto.*familia",
        "object": "el concepto, problemáticas y misión de la familia según los textos dados",
        "relation": "afirmaciones y relaciones atribuidas a {choice}",
        "sourceRecordIds": [
          "638d3317-a469-5ad9-b5a1-67f962c33000"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "aparecida(?:\\s*\\d+)?",
            "Aparecida 432–435"
          ],
          [
            "colosenses(?:\\s*\\d+)?",
            "Colosenses 3:18–21"
          ]
        ],
        "choiceDefault": "los textos expresamente trabajados"
      },
      {
        "id": "family-norms",
        "grade": 3,
        "label": "normas de convivencia familiar",
        "match": "normas.*convivencia.*familia(?:r(?:es)?|s)?",
        "object": "las normas propuestas para la convivencia familiar del caso dado",
        "relation": "acciones, condiciones y consecuencias vinculadas a los conflictos del caso",
        "sourceRecordIds": [
          "1311c19a-7db4-5b47-b18f-4e47fa913f43"
        ],
        "pdfPages": [
          402
        ],
        "productType": "WRITTEN_PRODUCTION",
        "planReferenceOnly": true
      },
      {
        "id": "family-sociodrama",
        "grade": 3,
        "label": "sociodrama de convivencia familiar",
        "match": "sociodrama.*convivencia.*familia(?:r(?:es)?|s)?",
        "object": "el caso proporcionado de convivencia familiar",
        "relation": "acciones, decisiones y soluciones reconocibles según las condiciones del caso",
        "sourceRecordIds": [
          "e36623a3-3294-5dfe-bdaa-0018e21de790"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "family-colloquium",
        "grade": 3,
        "label": "coloquio de resolución de conflictos en el hogar",
        "match": "coloquio.*(?:madres|padres|hogar)",
        "object": "el coloquio sobre experiencias y valores documentados para resolver conflictos en el hogar",
        "relation": "propósito, intervenciones y evidencias de los testimonios proporcionados",
        "sourceRecordIds": [
          "719dfb4b-f5ea-5eba-bde6-d882a8edf4d9"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "friendship-drama",
        "grade": 3,
        "label": "sociodrama de conflictos de amistad",
        "match": "sociodrama.*amistad|conflictos.*amistad",
        "object": "el caso proporcionado de conflictos en las relaciones de amistad y su resolución",
        "relation": "acciones y soluciones reconocibles de los testimonios suministrados",
        "sourceRecordIds": [
          "dc599b14-384e-5a20-bec3-eeff28eea4d2",
          "92ec9d60-e852-5fde-a28c-fdbb3bab20bc"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "family-encounter",
        "grade": 3,
        "label": "encuentro familiar para presentar productos",
        "match": "encuentro familiar",
        "object": "el encuentro familiar para presentar los productos y {choice} proporcionados",
        "relation": "propósito, secuencia y recursos expresamente elegidos para presentar los productos",
        "sourceRecordIds": [
          "7598e0b5-d117-54c7-bb8f-717b198e4a5b"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "videos",
            "videos"
          ],
          [
            "peliculas",
            "películas"
          ],
          [
            "charlas",
            "charlas"
          ],
          [
            "audiovisuales",
            "audiovisuales"
          ],
          [
            "informaciones",
            "informaciones"
          ]
        ],
        "choiceDefault": "los medios expresamente elegidos"
      },
      {
        "id": "dialogue-actions",
        "grade": 3,
        "label": "criterios y acciones para el diálogo",
        "match": "criterios y acciones.*dialogo",
        "object": "los criterios y acciones para el diálogo en los contextos dados",
        "relation": "acciones, condiciones y efectos sustentados en los referentes proporcionados",
        "sourceRecordIds": [
          "9b5e74e5-82ff-5285-b659-239a1dd8715d",
          "5b8b5bce-18d8-58d2-850b-8d21a33f3c32"
        ],
        "pdfPages": [
          402
        ],
        "productType": "WRITTEN_PRODUCTION",
        "planReferenceOnly": true
      },
      {
        "id": "peace-panel",
        "grade": 3,
        "label": "panel del diálogo y cultura de paz",
        "match": "panel.*(?:dialogo|cultura de paz)",
        "object": "el panel sobre diálogo y cultura de paz para resolver conflictos",
        "relation": "propósito, secuencia y evidencias de las soluciones de los referentes dados",
        "sourceRecordIds": [
          "746621df-ebbc-5b8b-b543-f6095aeec042",
          "2d3f78b9-de8d-543e-8735-dfc2467deb9d"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "conflict-messages",
        "grade": 3,
        "label": "mensajes sobre soluciones a conflictos",
        "match": "mensajes.*soluciones|mensajes.*problematicas",
        "object": "los mensajes que expresan soluciones a las problemáticas analizadas",
        "relation": "soluciones y evidencias comunicadas mediante el lenguaje expresamente solicitado",
        "sourceRecordIds": [
          "fbbba7c1-f30b-5d0f-bc00-1d8fba7ee338"
        ],
        "pdfPages": [
          402
        ],
        "productType": "WRITTEN_PRODUCTION",
        "planReferenceOnly": true
      },
      {
        "id": "conflict-commitments",
        "grade": 3,
        "label": "compromisos formulados para resolver conflictos",
        "match": "compromisos.*(?:conflictos|problematicas)",
        "object": "los compromisos formulados para resolver las problemáticas del caso dado",
        "relation": "acciones, condiciones y relaciones justificadas mediante diálogo, respeto y paz",
        "sourceRecordIds": [
          "45e1b2cc-031c-5b31-8cc5-d5644d886978"
        ],
        "pdfPages": [
          402
        ],
        "productType": "WRITTEN_PRODUCTION",
        "planReferenceOnly": true
      },
      {
        "id": "ecclesiasticus",
        "grade": 3,
        "label": "relaciones interpersonales según Eclesiástico",
        "match": "eclesiastico(?:\\s*11)?",
        "object": "las relaciones interpersonales interpretadas según Eclesiástico11:2–9 dado",
        "relation": "afirmaciones, situaciones y evidencias atribuidas al texto proporcionado",
        "sourceRecordIds": [
          "d793fd15-6a0e-552f-b2e8-06faa23a68f4"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "jesus-values",
        "grade": 3,
        "label": "valores de Jesús en vida muerte y resurrección",
        "match": "valores.*jesus.*vida|valores.*predicaba|valores.*predico.*vivio",
        "object": "los valores predicados y practicados por Jesús de Nazaret según los referentes",
        "relation": "episodios y evidencias atribuidos a los textos dados sobre vida, muerte y resurrección",
        "sourceRecordIds": [
          "78f511dc-5ea4-5386-b26c-119eada1e8df",
          "d6cfa855-cd5b-5d6d-8893-26b79fe6854b"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "dominican-values",
        "grade": 3,
        "label": "valores de Jesús en contexto dominicano",
        "match": "valores.*(?:dominicana|dominicano)",
        "object": "la presencia de valores atribuidos a Jesús en el contexto sociocultural dominicano",
        "relation": "ejemplos, contextos y evidencias documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "4f06ba26-8719-5534-9eb6-c679e9b8e19d",
          "bf2fc283-8afe-52dd-860d-716117dea897"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "dialogue-scene",
        "grade": 3,
        "label": "escenificación de valores mediante diálogo",
        "match": "escenifica.*dialogo|escenificacion.*dialogo",
        "object": "la situación proporcionada de construcción de valores mediante diálogo fraterno",
        "relation": "acciones, decisiones y relaciones reconocibles del caso dado",
        "sourceRecordIds": [
          "b3afea5f-2f28-53f7-8519-70b836e099d6"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "jesus-relations",
        "grade": 3,
        "label": "valores de Jesús y relaciones sociales",
        "match": "practica.*jesus.*valores|valores.*relaciones sociales",
        "object": "la práctica de valores de Jesús que construyen relaciones sociales según los textos",
        "relation": "acciones y relaciones atribuidas a las fuentes bíblicas y otras proporcionadas",
        "sourceRecordIds": [
          "e03d15a3-c750-59d4-92fd-84dab31b6394"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "interfaith-dialogue",
        "grade": 3,
        "label": "criterios para diálogo entre confesiones",
        "match": "criterios.*dialogo.*confesiones",
        "object": "los criterios para el diálogo entre personas de diversas confesiones según los referentes",
        "relation": "acciones y fundamentos atribuidos a los valores de Jesús de los textos dados",
        "sourceRecordIds": [
          "d8a26849-ad53-5ba3-b65d-70c2dc55eed3"
        ],
        "pdfPages": [
          402
        ],
        "productType": "WRITTEN_PRODUCTION",
        "planReferenceOnly": true
      },
      {
        "id": "jesus-episodes",
        "grade": 3,
        "label": "momentos de la vida de Jesús en los evangelios trabajados",
        "match": "momentos.*vida.*jesus|marcos 14|marcos 15|juan 20",
        "object": "los momentos de la vida de Jesús narrados en los episodios dados de {choice}",
        "relation": "secuencia, acciones y evidencias atribuidas a los textos proporcionados",
        "sourceRecordIds": [
          "25d735b4-7996-5f60-9b23-1a71ca07783d"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "marcos(?:\\s*\\d+)?",
            "Marcos"
          ],
          [
            "juan(?:\\s*\\d+)?",
            "Juan"
          ]
        ],
        "choiceDefault": "los evangelios expresamente trabajados"
      },
      {
        "id": "tech-effects",
        "grade": 3,
        "label": "efectos positivos y negativos de tecnología",
        "match": "efectos.*(?:positivos|negativos).*tecnologia",
        "object": "los efectos positivos y negativos de tecnología en {choice}",
        "relation": "afirmaciones y evidencias documentadas en {choice} de los referentes proporcionados",
        "sourceRecordIds": [
          "026bcaaa-4c24-5081-ac0b-7eb2cd5e95e3",
          "19bb1501-5726-527c-8ef1-5b5c05694bb2",
          "14fb1216-0479-5704-9737-25ac3e7baba9",
          "0dcfdc3f-a566-5337-9404-bbadeab2cd8d"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "personas?",
            "la persona"
          ],
          [
            "familias?",
            "la familia"
          ],
          [
            "sociedad",
            "la sociedad"
          ],
          [
            "naturaleza",
            "la naturaleza"
          ]
        ],
        "choiceDefault": "los ámbitos expresamente trabajados"
      },
      {
        "id": "tech-development",
        "grade": 3,
        "label": "tecnología como herramienta de desarrollo",
        "match": "tecnologia.*herramienta.*desarrollo",
        "object": "la tecnología como herramienta de desarrollo de persona y sociedad",
        "relation": "beneficios, condiciones y límites argumentados mediante los referentes proporcionados",
        "sourceRecordIds": [
          "e80796aa-92e3-5660-b5ea-d555749a43d2",
          "aadb278c-90ff-55ad-b4be-4a6490ba2b6e"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "tech-nature",
        "grade": 3,
        "label": "relación entre tecnología y naturaleza",
        "match": "relacion.*tecnologia.*naturaleza",
        "object": "la relación entre tecnología y naturaleza",
        "relation": "relaciones y consecuencias documentadas por las diferentes fuentes proporcionadas",
        "sourceRecordIds": [
          "f4ca7e6b-de91-5a66-ba92-a9cb952b023f",
          "0cdb2365-c2cd-5855-b0d2-f3709b30f7e6"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "science-celebration",
        "grade": 3,
        "label": "celebración de beneficios del trabajo científico",
        "match": "celebracion.*(?:cientifico|avances)",
        "object": "la celebración para presentar beneficios del trabajo científico y sus avances",
        "relation": "propósito, secuencia y evidencias de los productos proporcionados",
        "sourceRecordIds": [
          "3dc7f57e-1fb7-5f05-b1c5-c1b52342c448"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true
      },
      {
        "id": "creation-values",
        "grade": 3,
        "label": "valores del cuidado de vida creada en textos",
        "match": "valores.*cuidado.*(?:creacion|vida creada)",
        "object": "los valores del cuidado de la vida creada atribuidos a los textos dados",
        "relation": "afirmaciones, acciones y evidencias documentadas en {choice}",
        "sourceRecordIds": [
          "c5e602bf-f017-551d-bd24-7cfee5600d33",
          "aadfdd98-4faa-5df1-9e34-06fcf9ebc630"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "nuevo(?:\\s+y\\s+(?:el\\s+)?antiguo)?\\s+testamento",
            "el Nuevo Testamento"
          ],
          [
            "antiguo(?:\\s+y\\s+(?:el\\s+)?nuevo)?\\s+testamento",
            "el Antiguo Testamento"
          ]
        ],
        "choiceDefault": "los textos expresamente trabajados"
      },
      {
        "id": "ecology-texts",
        "grade": 3,
        "label": "ecología integral en textos proporcionados",
        "match": "cantico.*criaturas|laudato si|ecologia integral",
        "object": "el cuidado y respeto del medioambiente según {choice}",
        "relation": "afirmaciones y relaciones atribuidas a los textos proporcionados de ecología integral",
        "sourceRecordIds": [
          "3cabe717-dfe1-5245-9ca8-ff6ea2550645",
          "ef7e70b6-79f0-5797-9768-5d922213199c",
          "7f1920c3-d29b-5ba2-9365-6c5bb8158253",
          "7fb1d04f-b25c-50cc-9689-15d4d4acbbe4"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "cantico(?: de las criaturas)?",
            "el Cántico de las criaturas"
          ],
          [
            "laudato si",
            "Laudato Si capítulo 4"
          ]
        ],
        "choiceDefault": "los textos expresamente trabajados"
      },
      {
        "id": "ecology-project",
        "grade": 3,
        "label": "proyecto de promoción de valores ecológicos",
        "match": "proyecto.*valores ecologicos",
        "object": "el proyecto de promoción de valores ecológicos para contrarrestar la situación dada",
        "relation": "acciones y condiciones de la propuesta sustentadas en las evidencias del referente",
        "sourceRecordIds": [
          "5fb43fef-ac31-59ba-9015-33b6508a7beb"
        ],
        "pdfPages": [
          402
        ],
        "productType": "PROJECT",
        "planReferenceOnly": true
      },
      {
        "id": "nature-scene",
        "grade": 3,
        "label": "escenificación de beneficios de naturaleza",
        "match": "escenifica.*naturaleza|escenificacion.*naturaleza",
        "object": "los elementos de naturaleza y sus beneficios del referente proporcionado",
        "relation": "acciones y relaciones reconocibles de los elementos expresamente representados",
        "sourceRecordIds": [
          "380a1309-ff9f-54f1-b6e6-cb645da488ea"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "environment-institutions",
        "grade": 3,
        "label": "personas e instituciones protectoras del entorno",
        "match": "personas e instituciones.*(?:proteccion|casa comun)",
        "object": "las personas e instituciones que protegen el entorno natural según los referentes",
        "relation": "acciones, aportes y evidencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "41c75f51-ed37-5d31-b898-b0383b15ad46"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "conservation-actions",
        "grade": 3,
        "label": "acciones de conservación del medioambiente",
        "match": "acciones.*(?:defensa|conservacion).*medio ambiente",
        "object": "las acciones de defensa y conservación del medioambiente del caso dado",
        "relation": "acciones, secuencia y condiciones justificadas mediante los referentes proporcionados",
        "sourceRecordIds": [
          "6856764e-3c41-5587-ac57-caa500ecdb72"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true,
        "objects": {
          "PERFORMANCE": "las acciones de defensa y conservación del medioambiente previstas en el caso proporcionado"
        }
      },
      {
        "id": "environment-poster",
        "grade": 3,
        "label": "medios de promoción del cuidado del entorno",
        "match": "brochures?|cartel(?:es)?.*entorno|afiches?.*entorno",
        "object": "el {choice} de promoción de la protección y cuidado del entorno natural",
        "relation": "acciones y evidencias comunicadas mediante el medio expresamente elegido",
        "sourceRecordIds": [
          "48e815a5-d0ef-51ee-82f5-33146b92763e"
        ],
        "pdfPages": [
          403
        ],
        "productType": "WRITTEN_PRODUCTION",
        "planReferenceOnly": true,
        "choices": [
          [
            "cartel|carteles",
            "cartel"
          ],
          [
            "brochure|brochures",
            "brochure"
          ],
          [
            "afiche|afiches",
            "afiche"
          ]
        ],
        "choiceDefault": "medio expresamente elegido"
      },
      {
        "id": "environment-presentation",
        "grade": 3,
        "label": "exposición de acciones y medios de sostenibilidad",
        "match": "exposicion.*acciones.*sostenibilidad|expon[a-z]*.*acciones.*sostenibilidad",
        "object": "las acciones y medios de defensa de la vida y sostenibilidad del entorno documentados",
        "relation": "acciones, medios y resultados sustentados en las evidencias proporcionadas",
        "sourceRecordIds": [
          "5aa02a76-9fc9-5e6b-a8ea-23cfefe90069"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "adolescent-difficulties",
        "grade": 3,
        "label": "situaciones difíciles de adolescentes",
        "match": "situaciones dificiles.*adolescentes",
        "object": "las situaciones difíciles de adolescentes de los referentes educativos proporcionados",
        "relation": "condiciones, causas y consecuencias expresamente documentadas en los casos dados",
        "sourceRecordIds": [
          "8373e111-020b-59db-9ce1-097dda45a52d"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "adolescent-family",
        "grade": 3,
        "label": "problemas adolescentes con familiares",
        "match": "problemas.*adolescente.*familiares",
        "object": "los problemas del adolescente con familiares del caso proporcionado",
        "relation": "situaciones y evidencias expresamente documentadas por el caso educativo",
        "sourceRecordIds": [
          "aa80e11d-c31c-5a13-bb08-6232910de29a",
          "dd3baf3e-eaa1-5bd5-bf31-fe0417647b85"
        ],
        "pdfPages": [
          402,
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "adolescent-drama",
        "grade": 3,
        "label": "dramatización de conflictos escolares adolescentes",
        "match": "dramatiza.*conflictos.*adolescentes|dramatizacion.*adolescentes",
        "object": "el caso proporcionado de conflictos adolescentes en el ámbito escolar",
        "relation": "acciones, decisiones y relaciones reconocibles según las condiciones del caso",
        "sourceRecordIds": [
          "621b14f8-e825-56d5-b768-9f958ce36ad3"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religious-figures",
        "grade": 3,
        "label": "personajes referentes de experiencias religiosas",
        "match": "personajes.*experiencia religiosa",
        "object": "los personajes referentes de experiencias religiosas según las fuentes",
        "relation": "contextos, experiencias y evidencias atribuidas a los documentos proporcionados",
        "sourceRecordIds": [
          "5350273a-d8c5-56cc-95f2-62551a30f15f",
          "55353cc1-4e8d-5a41-aab9-b24f6895eef2"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-questions",
        "grade": 3,
        "label": "panel de interrogantes del ser humano",
        "match": "panel.*interrogantes",
        "object": "el panel sobre grandes interrogantes del ser humano de los referentes",
        "relation": "propósito, secuencia y relación de las intervenciones con interrogantes, perspectivas y evidencias de las fuentes proporcionadas",
        "sourceRecordIds": [
          "73226e41-eb63-59c7-88c2-289d589d34d7"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-meaning",
        "grade": 3,
        "label": "búsqueda del sentido de vida con medios dados",
        "match": "busqueda.*sentido.*vida",
        "object": "la búsqueda del sentido de la vida según {choice} proporcionados",
        "relation": "afirmaciones y relaciones sustentadas en el medio expresamente elegido",
        "sourceRecordIds": [
          "556e3068-d716-55dd-9a26-14315bb0208a",
          "06a4ced0-df3d-5ec5-a464-e6a20391ff4a"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "imagenes",
            "los referentes en imágenes"
          ],
          [
            "canciones",
            "los referentes en canciones"
          ],
          [
            "videos",
            "los referentes en videos"
          ]
        ],
        "choiceDefault": "los medios expresamente elegidos"
      },
      {
        "id": "false-ideals",
        "grade": 3,
        "label": "ideales de felicidad etiquetados por la fuente",
        "match": "ideales.*felicidad|autorrealizacion.*sociedad",
        "object": "los ideales de felicidad y autorrealización denominados falsos por la fuente dada",
        "relation": "afirmaciones, contextos y evidencias atribuidas a los referentes proporcionados",
        "sourceRecordIds": [
          "c2dac5b3-d32c-5c90-a149-86b6d730d043"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "biblical-life-answers",
        "grade": 3,
        "label": "respuestas al sentido de vida en textos bíblicos",
        "match": "respuestas.*sentido.*vida.*(?:biblicos|lucas(?:\\s*\\d+)?|mateo(?:\\s*\\d+)?|juan(?:\\s*\\d+)?)",
        "object": "las respuestas al sentido de la vida atribuidas a los textos bíblicos dados",
        "relation": "afirmaciones, citas y evidencias de {choice}",
        "sourceRecordIds": [
          "50eb358a-0409-5c43-9503-87f4ab9fb1cb"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "lucas(?:\\s*\\d+)?",
            "Lucas"
          ],
          [
            "mateo(?:\\s*\\d+)?",
            "Mateo"
          ],
          [
            "juan(?:\\s*\\d+)?",
            "Juan"
          ]
        ],
        "choiceDefault": "los textos expresamente trabajados"
      },
      {
        "id": "religious-life-answers",
        "grade": 3,
        "label": "respuestas de grandes religiones al sentido de vida",
        "match": "respuestas.*grandes religiones.*sentido|respuestas religiosas.*interrogantes",
        "object": "las respuestas de grandes religiones al sentido de la vida según los referentes",
        "relation": "perspectivas y fundamentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "5469dbf3-7e4d-5484-bca0-10b9f79b83bf",
          "a1f921be-5926-5d9f-9243-a52c7a02adfd",
          "5f17bf1b-1514-5b02-8352-a08bf5feddfc"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true
      },
      {
        "id": "concept-2d6f0722",
        "grade": 3,
        "label": "el valor y respeto a la vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+valor[\\s,:]+y[\\s,:]+respeto[\\s,:]+a[\\s,:]+la[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "el valor y respeto a la vida",
        "relation": "afirmaciones, acciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "2d6f0722-f424-5018-af2b-5bc6901b74a8"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-ea41f2ee",
        "grade": 3,
        "label": "vida y derechos humanos",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:vida[\\s,:]+y[\\s,:]+derechos[\\s,:]+humanos)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre la vida y los derechos humanos",
        "relation": "derechos, situaciones y evidencias atribuidos a los textos proporcionados",
        "sourceRecordIds": [
          "ea41f2ee-ee28-58ad-8be8-48b105f54f08"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-f39c33c1",
        "grade": 3,
        "label": "el valor de la vida en el cristianismo y otras concepciones religiosas",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+valor[\\s,:]+de[\\s,:]+la[\\s,:]+vida[\\s,:]+en[\\s,:]+el[\\s,:]+cristianismo[\\s,:]+y[\\s,:]+otras[\\s,:]+concepciones[\\s,:]+religiosas)(?:\\s+segun\\s+.*)?$",
        "object": "el valor de la vida en el cristianismo y otras concepciones religiosas",
        "relation": "perspectivas y fundamentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "f39c33c1-8e54-5fd9-8de6-24bec02c8d64"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-72979943",
        "grade": 3,
        "label": "talentos y capacidades personales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:talentos[\\s,:]+y[\\s,:]+capacidades[\\s,:]+personales)(?:\\s+segun\\s+.*)?$",
        "object": "los talentos y capacidades personales descritos en los referentes educativos",
        "relation": "características y relaciones expresamente documentadas en los referentes dados",
        "sourceRecordIds": [
          "72979943-82f8-570e-85a7-e16eb051fe69"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-2351ed22",
        "grade": 3,
        "label": "el sentido del trabajo",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+sentido[\\s,:]+del[\\s,:]+trabajo)(?:\\s+segun\\s+.*)?$",
        "object": "el sentido del trabajo según los referentes",
        "relation": "afirmaciones, condiciones y aportes documentados en los textos proporcionados",
        "sourceRecordIds": [
          "2351ed22-4f7a-5c5b-827e-084af8cf4232"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-c69a2643",
        "grade": 3,
        "label": "el trabajo como servicio",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+trabajo[\\s,:]+como[\\s,:]+servicio)(?:\\s+segun\\s+.*)?$",
        "object": "el trabajo como servicio según los referentes",
        "relation": "acciones, aportes y relaciones documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "c69a2643-6a0f-5099-8d71-1bdb14432875"
        ],
        "pdfPages": [
          401
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-aa80e11d",
        "grade": 3,
        "label": "problemáticas y conflictos personales, familiares y sociales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:problematicas[\\s,:]+y[\\s,:]+conflictos[\\s,:]+personales[\\s,:]+familiares[\\s,:]+y[\\s,:]+sociales)(?:\\s+segun\\s+.*)?$",
        "object": "las problemáticas y conflictos personales, familiares y sociales de los referentes educativos",
        "relation": "situaciones, causas y efectos expresamente documentados por los referentes dados",
        "sourceRecordIds": [
          "aa80e11d-c31c-5a13-bb08-6232910de29a"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-dc599b14",
        "grade": 3,
        "label": "relaciones de amistad y sus dificultades",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:relaciones[\\s,:]+de[\\s,:]+amistad[\\s,:]+y[\\s,:]+sus[\\s,:]+dificultades)(?:\\s+segun\\s+.*)?$",
        "object": "las relaciones de amistad y sus dificultades según los referentes",
        "relation": "interacciones, condiciones y dificultades documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "dc599b14-384e-5a20-bec3-eeff28eea4d2"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-746621df",
        "grade": 3,
        "label": "manejo de conflicto en la escuela, familia y con amistades",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:manejo[\\s,:]+de[\\s,:]+conflicto[\\s,:]+en[\\s,:]+la[\\s,:]+escuela[\\s,:]+familia[\\s,:]+y[\\s,:]+con[\\s,:]+amistades)(?:\\s+segun\\s+.*)?$",
        "object": "el manejo de conflictos en escuela, familia y amistad según los referentes",
        "relation": "acciones, condiciones y consecuencias documentadas en los referentes educativos dados",
        "sourceRecordIds": [
          "746621df-ebbc-5b8b-b543-f6095aeec042"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-78f511dc",
        "grade": 3,
        "label": "valores que predicó y vivió Jesús de Nazaret",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+que[\\s,:]+predico[\\s,:]+y[\\s,:]+vivio[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret)(?:\\s+segun\\s+.*)?$",
        "object": "los valores predicados y vividos por Jesús de Nazaret según los textos dados",
        "relation": "afirmaciones, acciones y episodios atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "78f511dc-5ea4-5386-b26c-119eada1e8df"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-4f06ba26",
        "grade": 3,
        "label": "valores de Jesús de Nazaret presentes en la cultura dominicana",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+de[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret[\\s,:]+presentes[\\s,:]+en[\\s,:]+la[\\s,:]+cultural[\\s,:]+dominicana|valores[\\s,:]+de[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret[\\s,:]+presentes[\\s,:]+en[\\s,:]+la[\\s,:]+cultura[\\s,:]+dominicana)(?:\\s+segun\\s+.*)?$",
        "object": "los valores atribuidos a Jesús presentes en la cultura dominicana",
        "relation": "contextos, ejemplos y evidencias documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "4f06ba26-8719-5534-9eb6-c679e9b8e19d"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-9b5e74e5",
        "grade": 3,
        "label": "diálogo fraterno",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:dialogo[\\s,:]+fraterno)(?:\\s+segun\\s+.*)?$",
        "object": "el diálogo fraterno según los referentes",
        "relation": "interacciones, condiciones y efectos documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "9b5e74e5-82ff-5285-b659-239a1dd8715d"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-026bcaaa",
        "grade": 3,
        "label": "ciencia, tecnología y desarrollo humano",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ciencia[\\s,:]+tecnologia[\\s,:]+y[\\s,:]+desarrollo[\\s,:]+humano)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ciencia, tecnología y desarrollo humano",
        "relation": "aportes, condiciones y efectos documentados en los referentes dados",
        "sourceRecordIds": [
          "026bcaaa-4c24-5081-ac0b-7eb2cd5e95e3"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-19bb1501",
        "grade": 3,
        "label": "tecnología, persona y familia",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:tecnologia[\\s,:]+persona[\\s,:]+y[\\s,:]+familia)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre tecnología, persona y familia",
        "relation": "usos, condiciones y evidencias documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "19bb1501-5726-527c-8ef1-5b5c05694bb2"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-f4ca7e6b",
        "grade": 3,
        "label": "relación entre tecnología y la naturaleza",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:relacion[\\s,:]+entre[\\s,:]+tecnologia[\\s,:]+y[\\s,:]+la[\\s,:]+naturaleza)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre tecnología y naturaleza",
        "relation": "relaciones y consecuencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "f4ca7e6b-de91-5a66-ba92-a9cb952b023f"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-c5e602bf",
        "grade": 3,
        "label": "valores de Jesús en torno al cuidado de la creación",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+de[\\s,:]+jesus[\\s,:]+en[\\s,:]+torno[\\s,:]+al[\\s,:]+cuidado[\\s,:]+de[\\s,:]+la[\\s,:]+creacion)(?:\\s+segun\\s+.*)?$",
        "object": "los valores de Jesús en torno al cuidado de la creación según los textos dados",
        "relation": "afirmaciones y acciones atribuidas a los referentes proporcionados",
        "sourceRecordIds": [
          "c5e602bf-f017-551d-bd24-7cfee5600d33"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-3cabe717",
        "grade": 3,
        "label": "medioambiente: nuestra casa común",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:medioambiente[\\s,:]+nuestra[\\s,:]+casa[\\s,:]+comun)(?:\\s+segun\\s+.*)?$",
        "object": "el medioambiente como casa común",
        "relation": "elementos, relaciones y condiciones documentados por los referentes educativos dados",
        "sourceRecordIds": [
          "3cabe717-dfe1-5245-9ca8-ff6ea2550645"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-ef7e70b6",
        "grade": 3,
        "label": "sostenibilidad medioambiental",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:sostenibilida[\\s,:]+y[\\s,:]+medioambiental|sostenibilidad[\\s,:]+medioambiental)(?:\\s+segun\\s+.*)?$",
        "object": "la sostenibilidad medioambiental",
        "relation": "acciones, condiciones y consecuencias documentadas en los referentes proporcionados",
        "sourceRecordIds": [
          "ef7e70b6-79f0-5797-9768-5d922213199c"
        ],
        "pdfPages": [
          402
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-5350273a",
        "grade": 3,
        "label": "religión y persona",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:religion[\\s,:]+y[\\s,:]+persona)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre religión y persona según las fuentes",
        "relation": "perspectivas, contextos y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "5350273a-d8c5-56cc-95f2-62551a30f15f"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-556e3068",
        "grade": 3,
        "label": "búsqueda del sentido de la vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:busqueda[\\s,:]+del[\\s,:]+sentido[\\s,:]+de[\\s,:]+la[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "la búsqueda del sentido de la vida según los referentes",
        "relation": "interrogantes, perspectivas y fundamentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "556e3068-d716-55dd-9a26-14315bb0208a"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-5469dbf3",
        "grade": 3,
        "label": "respuestas religiosas a las grandes interrogantes de la vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:respuestas[\\s,:]+religiosas[\\s,:]+a[\\s,:]+las[\\s,:]+grandes[\\s,:]+interrogantes[\\s,:]+de[\\s,:]+la[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "las respuestas religiosas a las grandes interrogantes de la vida",
        "relation": "perspectivas y fundamentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "5469dbf3-7e4d-5484-bca0-10b9f79b83bf"
        ],
        "pdfPages": [
          403
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      }
    ],
    "policy": "OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH"
  },
  {
    "id": "formacion-humana-religiosa-comun-4",
    "grade": 4,
    "topics": [
      {
        "id": "family-situations",
        "grade": 4,
        "label": "situaciones documentadas de familias dominicanas",
        "match": "situaciones.*familias dominicanas",
        "object": "las situaciones de familias dominicanas de los referentes",
        "relation": "condiciones, relaciones y evidencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "9ea82ee0-4d48-5757-9c23-33568cc35bcd",
          "10708868-a531-56bb-851e-5ff84ef67346"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true
      },
      {
        "id": "family-survey",
        "grade": 4,
        "label": "resultados de encuesta de realidad familiar",
        "match": "encuesta.*realidad familiar",
        "object": "los resultados de la encuesta sobre realidad familiar del registro dado",
        "relation": "preguntas, categorías, respuestas y relaciones documentadas en el registro proporcionado",
        "sourceRecordIds": [
          "b40c01a3-8b38-523b-b832-f33ce83cdf2a"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true
      },
      {
        "id": "family-difficulties",
        "grade": 4,
        "label": "dificultades documentadas de matrimonio y familia",
        "match": "dificultades.*(?:matrimonio|familia dominicana)",
        "object": "las dificultades {choice} sobre matrimonio y familia dominicana de los referentes",
        "relation": "causas, condiciones y consecuencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "b353c183-7c26-53e7-bfef-dc2639814d26"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "personales",
            "personales"
          ],
          [
            "culturales",
            "culturales"
          ],
          [
            "religiosas",
            "religiosas"
          ]
        ],
        "choiceDefault": "expresamente descritas"
      },
      {
        "id": "family-foundation",
        "grade": 4,
        "label": "familia como base de la sociedad según textos",
        "match": "familia.*base.*sociedad",
        "object": "la familia como base de la sociedad según {choice}",
        "relation": "afirmaciones, artículos y argumentos atribuidos a los textos expresamente proporcionados",
        "sourceRecordIds": [
          "37ee569d-5a28-5d07-9bfa-60c4105f43fe"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "constitucion",
            "la Constitución artículo55"
          ],
          [
            "santo domingo",
            "Santo Domingo"
          ],
          [
            "aparecida",
            "Aparecida capítulo9"
          ]
        ],
        "choiceDefault": "los textos expresamente proporcionados"
      },
      {
        "id": "peace-scene",
        "grade": 4,
        "label": "dramatización de relaciones de paz y respeto",
        "match": "dramatiza.*paz.*respeto|relaciones de paz y respeto",
        "object": "el caso proporcionado de relaciones de paz y respeto en los contextos dados",
        "relation": "acciones y decisiones reconocibles según las condiciones del caso",
        "sourceRecordIds": [
          "932d0db9-334d-5c0e-b3f0-9c8fd1455bcf",
          "a648cd4f-fda1-528c-a58f-d98fca19af92",
          "1b98296c-8bba-5c45-8b63-7ab94123fcc0"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true
      },
      {
        "id": "family-role",
        "grade": 4,
        "label": "mesa redonda del apoyo y desarrollo familiar",
        "match": "mesa redonda.*rol.*familia|familia.*desarrollo y apoyo",
        "object": "la mesa redonda sobre el rol de la familia en el desarrollo y apoyo de sus miembros",
        "relation": "propósito, secuencia y relaciones de las intervenciones con las evidencias proporcionadas",
        "sourceRecordIds": [
          "f8fa71c5-0eff-5019-949c-c8f659acc60d"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "el rol de la familia en el desarrollo y apoyo de sus miembros"
        }
      },
      {
        "id": "marriage-texts",
        "grade": 4,
        "label": "matrimonio según perspectivas de textos bíblicos",
        "match": "matrimonio.*(?:proyecto de dios|efesios(?:\\s*\\d+)?|mateo(?:\\s*\\d+)?|pedro(?:\\s*\\d+)?)",
        "object": "las perspectivas sobre matrimonio atribuidas a los textos bíblicos dados",
        "relation": "afirmaciones, contextos y evidencias atribuidas a {choice}",
        "sourceRecordIds": [
          "b380d335-fba5-5c1b-97b9-adcb850e6cd4"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "(?:y\\s*)?efesios(?:\\s*\\d+)?",
            "Efesios"
          ],
          [
            "(?:y\\s*)?mateo(?:\\s*\\d+)?",
            "Mateo"
          ],
          [
            "(?:y\\s*)?(?:1\\s*)?pedro(?:\\s*\\d+)?",
            "1 Pedro"
          ]
        ],
        "choiceDefault": "los textos expresamente trabajados"
      },
      {
        "id": "family-faith-panel",
        "grade": 4,
        "label": "panel de experiencias religiosas documentadas de familias",
        "match": "panel.*familias cristianas|fe.*soporte.*paz",
        "object": "el panel sobre experiencias de familias cristianas documentadas en los testimonios dados",
        "relation": "intervenciones, argumentos y evidencias atribuidas a los testimonios proporcionados",
        "sourceRecordIds": [
          "1fd37a54-5f21-5009-847d-c85cd6bc5ec9"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "experiencias de familias cristianas documentadas en los testimonios dados"
        }
      },
      {
        "id": "family-values-campaign",
        "grade": 4,
        "label": "campaña sobre valores familiares según referentes",
        "match": "campana.*valores.*(?:familia(?:res|r|s)?|sociedad|sociales)",
        "object": "el prototipo de campaña sobre valores y costumbres de los contextos dados",
        "relation": "mensajes, razones y evidencias atribuidas a los referentes expresamente proporcionados",
        "sourceRecordIds": [
          "5cac7fcd-84c3-5d9c-b21f-bcdd76aeea50",
          "22ea8719-933a-5449-8351-bf7119c142b4"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "adolescent-questions",
        "grade": 4,
        "label": "inquietudes e intereses adolescentes sobre sentido de vida",
        "match": "inquietudes e intereses.*adolescentes|adolescentes.*sentido de la vida",
        "object": "las inquietudes e intereses adolescentes sobre sentido de vida descritos en los referentes",
        "relation": "preguntas, contextos y relaciones expresamente documentados por los referentes educativos",
        "sourceRecordIds": [
          "82ce7c11-c2c6-53e8-b467-3904ab1f942b"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-questions",
        "grade": 4,
        "label": "interrogantes del ser humano sobre sentido de vida",
        "match": "interrogantes.*sentido.*vida|inquietudes.*ser humano",
        "object": "las inquietudes e interrogantes sobre sentido de vida de los referentes",
        "relation": "preguntas, perspectivas y fundamentos atribuidos a los textos proporcionados",
        "sourceRecordIds": [
          "c18b55e3-6513-5de0-8b94-d6a7c841b9f6",
          "6ff1fd02-fe30-505c-9c81-67fce7ef7713"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-elements",
        "grade": 4,
        "label": "elementos que dan sentido a la vida según fuentes",
        "match": "elementos.*sentido.*vida",
        "object": "los elementos que dan o no sentido a la vida según los referentes",
        "relation": "afirmaciones, contextos y argumentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "97d7ae27-d76f-57c9-9aee-b1ee06ca4c7b",
          "23d63b06-da22-5b4c-b95c-835c070a3768"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-situations",
        "grade": 4,
        "label": "situaciones de búsqueda y ausencia de sentido vital",
        "match": "situaciones.*(?:sin sentido|ausencia.*sentido|busqueda.*sentido)",
        "object": "las situaciones de búsqueda y ausencia de sentido vital documentadas en los casos dados",
        "relation": "condiciones, perspectivas y evidencias atribuidas a los referentes educativos proporcionados",
        "sourceRecordIds": [
          "d31c6994-5615-5fce-b6a9-d19c28094d7c"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-biblical-arguments",
        "grade": 4,
        "label": "sentido de vida argumentado mediante textos",
        "match": "sentido.*vida.*(?:deuteronomio(?:\\s*\\d+)?|samuel(?:\\s*\\d+)?|jeremias(?:\\s*\\d+)?|marcos(?:\\s*\\d+)?)",
        "object": "el sentido de la vida interpretado según los textos bíblicos dados",
        "relation": "afirmaciones, citas y argumentos atribuidos a {choice}",
        "sourceRecordIds": [
          "77c805b3-a91e-5a66-b0e2-af68727d264f"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "(?:y\\s*)?deuteronomio(?:\\s*\\d+)?",
            "Deuteronomio"
          ],
          [
            "(?:y\\s*)?(?:1\\s*)?samuel(?:\\s*\\d+)?",
            "1 Samuel"
          ],
          [
            "(?:y\\s*)?jeremias(?:\\s*\\d+)?",
            "Jeremías"
          ],
          [
            "(?:y\\s*)?marcos(?:\\s*\\d+)?",
            "Marcos"
          ]
        ],
        "choiceDefault": "los textos expresamente proporcionados"
      },
      {
        "id": "vocation-scene",
        "grade": 4,
        "label": "escenificación de vocaciones documentadas",
        "match": "escenifica.*vocacion|personas.*vocacion.*realizacion",
        "object": "el caso proporcionado de vocación y realización de una persona documentada",
        "relation": "acciones, decisiones y resultados reconocibles según las condiciones del caso",
        "sourceRecordIds": [
          "7d520a41-bbbc-5e0f-bba6-3322e4a7c0d2"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true
      },
      {
        "id": "identity-drama",
        "grade": 4,
        "label": "dramatización de búsqueda de identidad adolescente",
        "match": "dramatiza.*identidad|dramatizacion.*identidad",
        "object": "el caso educativo proporcionado de búsqueda de identidad adolescente",
        "relation": "acciones y decisiones reconocibles según las condiciones del caso",
        "sourceRecordIds": [
          "d8ac5392-bb3b-5b4c-bd04-c87370c444a4",
          "26cda666-d1ff-58e4-a1a3-4f78ea2c0a9f"
        ],
        "pdfPages": [
          413,
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "identity-panel",
        "grade": 4,
        "label": "panel de factores de identidad adolescente",
        "match": "panel.*factores.*identidad",
        "object": "el panel sobre factores de formación de identidad adolescente según los referentes",
        "relation": "propósito, secuencia y relación de las intervenciones con las evidencias educativas proporcionadas",
        "sourceRecordIds": [
          "a9605253-3ccc-5874-95e8-d3d615e20ab8"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "factores de formación de identidad adolescente según los referentes"
        }
      },
      {
        "id": "decision-process",
        "grade": 4,
        "label": "proceso documentado de toma de decisiones",
        "match": "proceso.*tomar decisiones|proceso.*toma de decisiones",
        "object": "el proceso para tomar decisiones según los referentes dados",
        "relation": "etapas, condiciones y relaciones sustentadas en las evidencias proporcionadas",
        "sourceRecordIds": [
          "8edfccf6-3ea5-5ed2-ba51-d2df8953e0bf"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "christian-life-proposal",
        "grade": 4,
        "label": "propuesta cristiana sobre sentido de vida según fuentes",
        "match": "propuesta cristiana.*sentido.*vida",
        "object": "la propuesta cristiana al sentido de la vida según los textos dados",
        "relation": "afirmaciones, fundamentos y argumentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "e843f26b-9d27-5347-aa5e-fc5735961a50",
          "f23e3d16-2274-599f-a253-10d6388f768a"
        ],
        "pdfPages": [
          413,
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-project",
        "grade": 4,
        "label": "proyecto de vida formulado por referentes",
        "match": "proyecto de vida",
        "object": "el proyecto de vida formulado según las condiciones del caso dado",
        "relation": "metas, acciones, condiciones y relaciones justificadas por los referentes proporcionados",
        "sourceRecordIds": [
          "46c9f95e-a37e-5915-adcd-3a670b6c79d8",
          "7f7cc29b-04eb-5e6b-928d-430099f931b6"
        ],
        "pdfPages": [
          413,
          414
        ],
        "planReferenceOnly": true,
        "productType": "PROJECT"
      },
      {
        "id": "adolescent-situations",
        "grade": 4,
        "label": "situaciones personales e interpersonales adolescentes en fuentes",
        "match": "situaciones personales e interpersonales",
        "object": "las situaciones personales e interpersonales adolescentes de los referentes",
        "relation": "condiciones, relaciones y evidencias expresamente documentadas por los referentes educativos proporcionados",
        "sourceRecordIds": [
          "3e286390-bcc1-578d-b0b0-7ecce0d4fa85"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "realization-case",
        "grade": 4,
        "label": "casos que favorecen o perjudican autorrealización",
        "match": "casos.*autorrealizacion|situaciones.*(?:perjudican|favorecen).*autorrealizacion",
        "object": "las situaciones del caso proporcionado que favorecen o perjudican la autorrealización",
        "relation": "condiciones, decisiones, alternativas y consecuencias documentadas por el caso dado",
        "sourceRecordIds": [
          "8f0ad721-479e-5cf7-9f20-cf50747447fa"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "conflict-biblical-analysis",
        "grade": 4,
        "label": "situaciones de conflicto interpretadas mediante textos",
        "match": "situaciones.*(?:personales|familiares|sociales).*textos biblicos",
        "object": "las situaciones personales, familiares y sociales del caso interpretadas según los textos dados",
        "relation": "afirmaciones, conflictos y evidencias atribuidas a los textos proporcionados",
        "sourceRecordIds": [
          "cf29ab71-7bbb-5251-8d2e-53fde8206eab",
          "600b42c4-198a-54e8-887e-4ec05b586bf8"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "jesus-conflict-values",
        "grade": 4,
        "label": "valores de Jesús para afrontar conflictos según textos",
        "match": "valores.*jesus.*(?:superacion|conflictos)|ensenanzas.*jesus.*conflictos",
        "object": "los valores y actitudes de Jesús que favorecen afrontar conflictos según los textos",
        "relation": "episodios, acciones y evidencias atribuidas a los textos bíblicos proporcionados",
        "sourceRecordIds": [
          "17ca14a2-d646-5d7b-9140-a32a54348b3f",
          "823b9bc3-d8b7-57fa-acda-6f36b4408cb3",
          "78fd7239-7d03-5d9b-8688-e78cdc79abf4"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "relationship-catalog",
        "grade": 4,
        "label": "catálogo de valores para relaciones interpersonales",
        "match": "catalogo.*valores.*relaciones",
        "object": "el catálogo de valores y actitudes para relaciones interpersonales del referente",
        "relation": "organización de entradas y relaciones justificadas mediante las evidencias proporcionadas",
        "sourceRecordIds": [
          "ba09050e-0bb8-587d-90bb-28aeed2caaa0",
          "18834f9e-b967-558f-a181-2e9284a5bb48"
        ],
        "pdfPages": [
          413,
          414
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "relationship-scene",
        "grade": 4,
        "label": "representación de relaciones armónicas por casos",
        "match": "representa.*relaciones armonicas",
        "object": "el caso proporcionado de valores y actitudes en relaciones armónicas y autorrealización",
        "relation": "acciones y decisiones reconocibles según las condiciones del caso",
        "sourceRecordIds": [
          "d91fc7d6-1abe-561e-927c-9c0914941bf9"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "relationship-actions",
        "grade": 4,
        "label": "acciones para promover relaciones armónicas",
        "match": "acciones.*relaciones armonicas",
        "object": "las acciones para promover relaciones armónicas en los contextos dados",
        "relation": "acciones, secuencia y condiciones justificadas mediante los referentes proporcionados",
        "sourceRecordIds": [
          "1eb8d028-64c0-5e30-b864-14682cbd7942"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "conflict-campaign",
        "grade": 4,
        "label": "campaña de resolución de conflictos",
        "match": "campana.*(?:resolver|resolucion).*conflictos",
        "object": "el diseño de campaña escrita para resolver conflictos de los casos dados",
        "relation": "mensajes, acciones y evidencias sustentados en los referentes expresamente proporcionados",
        "sourceRecordIds": [
          "51b9c94a-78f1-50cc-8d88-25fd638a476d"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "work-diversity",
        "grade": 4,
        "label": "diversidad de trabajos y aportes documentados",
        "match": "diversidad de trabajos",
        "object": "la diversidad de trabajos y sus aportes a la realización personal según los referentes",
        "relation": "características, aportes y relaciones documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "ce8554cf-431e-5a06-a594-6ee816d5a528"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-difficulties",
        "grade": 4,
        "label": "dificultades del trabajo según registros",
        "match": "dificultades y afanes.*trabajo",
        "object": "las dificultades y afanes del trabajo documentados en los registros dados",
        "relation": "condiciones, acciones y efectos expresamente descritos por las fuentes proporcionadas",
        "sourceRecordIds": [
          "9c669dd7-fddf-5486-8295-a8087ab36bb7"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-contributions",
        "grade": 4,
        "label": "satisfacciones y aportes del trabajo según fuentes",
        "match": "satisfacciones y aportes.*trabajo",
        "object": "las satisfacciones y aportes del trabajo documentados en los referentes dados",
        "relation": "afirmaciones, contextos y evidencias atribuidas a las fuentes proporcionadas",
        "sourceRecordIds": [
          "73f9cfdc-223a-527f-8804-25e115f8dce0",
          "eae478c8-08eb-5e06-bfc3-820810b6a1ab"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-spiritual",
        "grade": 4,
        "label": "sentido espiritual del trabajo en Aparecida",
        "match": "sentido espiritual.*trabajo",
        "object": "el sentido espiritual del trabajo atribuido a Aparecida120–121 dado",
        "relation": "afirmaciones, citas y argumentos atribuidos al texto proporcionado",
        "sourceRecordIds": [
          "4f131009-d7a3-5090-bd66-e4144243f2b9",
          "8aef0cce-3ea2-5f70-856f-1b442e414955"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-dignity-panel",
        "grade": 4,
        "label": "panel de razones sobre dignidad del trabajo",
        "match": "panel.*trabajo.*dignifica|razones.*trabajo.*dignifica",
        "object": "el panel sobre razones por las que el trabajo dignifica según los textos dados",
        "relation": "intervenciones, argumentos y evidencias atribuidas a los referentes proporcionados",
        "sourceRecordIds": [
          "b1a64c81-7028-5b9c-86a6-d60319519970"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "razones por las que el trabajo dignifica según los textos dados"
        }
      },
      {
        "id": "work-rest-right",
        "grade": 4,
        "label": "derecho al descanso según textos proporcionados",
        "match": "derecho.*descanso.*trabajadores|derecho.*trabajadores.*descanso",
        "object": "el derecho al descanso de trabajadores según los textos proporcionados",
        "relation": "afirmaciones, condiciones y fundamentos atribuidos a los documentos dados",
        "sourceRecordIds": [
          "5f16fa68-c4d9-5af4-b0a8-73d3c341d991"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "rest-genesis",
        "grade": 4,
        "label": "necesidad y utilidad del descanso en Génesis",
        "match": "necesidad y utilidad.*descanso|descanso.*genesis",
        "object": "la necesidad y utilidad del descanso según Génesis2:2–3 dado",
        "relation": "afirmaciones, acciones y evidencias atribuidas al texto proporcionado",
        "sourceRecordIds": [
          "fe03ef3c-3e85-555f-8d7e-62e4d645944a"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-creation",
        "grade": 4,
        "label": "trabajo y continuidad de la creación según referentes",
        "match": "colabor(?:ar|acion).*obra (?:de dios|creada)|trabajo.*obra creada",
        "object": "las formas documentadas de colaboración con la obra creada según los referentes",
        "relation": "acciones y relaciones atribuidas a los textos y registros proporcionados",
        "sourceRecordIds": [
          "2d0847a2-f7ef-565f-98ba-4005bd432b6f",
          "c83cc17d-4537-568e-9615-7348d67d0834"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "creation-commitments",
        "grade": 4,
        "label": "compromisos formulados sobre participación en la creación",
        "match": "compromisos.*obra (?:de dios|creada)",
        "object": "los compromisos formulados sobre participación en la obra creada según los referentes",
        "relation": "acciones, condiciones y relaciones justificadas mediante los textos proporcionados",
        "sourceRecordIds": [
          "24b483be-a76e-56c7-9c43-ed61a996b079"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "work-creation-celebration",
        "grade": 4,
        "label": "celebración de productos sobre trabajo y creación",
        "match": "celebracion.*trabajo.*(?:creacion|creadora)",
        "object": "la celebración para presentar productos sobre trabajo humano y creación según los referentes",
        "relation": "propósito, secuencia y relaciones de los productos con las evidencias proporcionadas",
        "sourceRecordIds": [
          "297b539b-8c97-5651-b9ef-e4b483a5aa00"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "tic-influence",
        "grade": 4,
        "label": "función importancia e influencia de TIC según fuentes",
        "match": "funcion.*influencia.*tic|tic.*decisiones y comportamientos",
        "object": "la función, importancia e influencia de TIC en decisiones y comportamientos según los referentes",
        "relation": "afirmaciones, relaciones y evidencias expresamente documentadas por las fuentes dadas",
        "sourceRecordIds": [
          "d4979795-71ab-58ac-831a-a8b94f577c57",
          "269930de-593a-5847-81c8-a85f6ed17e70"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "tic-development",
        "grade": 4,
        "label": "desarrollo y beneficios de tecnologías de información",
        "match": "principales tecnologias.*informacion|tic.*crecimiento.*expansion",
        "object": "el desarrollo y beneficios de tecnologías de información y comunicación según los referentes",
        "relation": "características, evolución, usos y beneficios expresamente documentados en las fuentes dadas",
        "sourceRecordIds": [
          "c282f32e-cfbe-5c49-b51f-20cc7b4517f4"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "tic-regulation",
        "grade": 4,
        "label": "normas de TIC en documentos proporcionados",
        "match": "normas.*(?:regulacion|buen uso).*tic|tic.*vaticano",
        "object": "las normas de regulación y buen uso de TIC según los documentos dados",
        "relation": "normas, fundamentos y evidencias atribuidos a los textos expresamente proporcionados",
        "sourceRecordIds": [
          "5bc80c78-713a-5255-bb52-d34fc035db37",
          "5b0c799a-701b-50af-8515-55589dbc6a95",
          "91308f9c-b6f7-55d9-884b-3153225c2707",
          "a8455d82-e061-5d2f-bc5f-bd053e14625b",
          "67615911-4725-5134-a21e-fa338752d44d",
          "bafcb06d-62b3-587f-9d79-30c84019527e"
        ],
        "pdfPages": [
          414,
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "tic-biblical-ethics",
        "grade": 4,
        "label": "criterios éticos de TIC según textos dados",
        "match": "criterios eticos.*tic|valores.*tic.*(?:exodo|efesios|santiago)",
        "object": "los valores y criterios éticos de TIC atribuidos a los textos proporcionados",
        "relation": "afirmaciones, contextos y evidencias atribuidas a {choice}",
        "sourceRecordIds": [
          "56f64bee-3478-5c10-8320-6c7d8c948abd",
          "166d9684-3621-5036-937a-1a017b90b12d"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "(?:y\\s*)?exodo(?:\\s*\\d+)?",
            "Éxodo"
          ],
          [
            "(?:y\\s*)?efesios(?:\\s*\\d+)?",
            "Efesios"
          ],
          [
            "(?:y\\s*)?santiago(?:\\s*\\d+)?",
            "Santiago"
          ]
        ],
        "choiceDefault": "los textos expresamente trabajados"
      },
      {
        "id": "tic-youth-panel",
        "grade": 4,
        "label": "panel de influencias de TIC en juventud",
        "match": "panel.*(?:influencias|tic).*juventud",
        "object": "el panel sobre influencias de TIC en la juventud según los referentes",
        "relation": "propósito, secuencia y relación de las intervenciones con beneficios y perjuicios documentados",
        "sourceRecordIds": [
          "3d433f11-ea46-5755-946d-d7f417ce5224",
          "f86505e0-0990-5758-ab2f-924e8f57c46a"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "influencias de TIC en la juventud según los referentes"
        }
      },
      {
        "id": "tic-mural",
        "grade": 4,
        "label": "oferta de TIC en ámbitos expresamente dados",
        "match": "mural.*oferta.*tic",
        "object": "la oferta de TIC en {choice} según los referentes",
        "relation": "informaciones y beneficios expresamente documentados en los referentes proporcionados",
        "sourceRecordIds": [
          "bd7f4901-ed42-5114-8ab2-2db08cf3cac0",
          "5f4d04ec-d7fd-5773-b4cc-e9d8ad62090d",
          "f7ee0a47-c587-5e54-b1f3-771471b33af6"
        ],
        "pdfPages": [
          414,
          415
        ],
        "planReferenceOnly": true,
        "productType": "PROJECT",
        "choices": [
          [
            "educativ[a-z]*",
            "el ámbito educativo"
          ],
          [
            "economic[a-z]*",
            "el ámbito económico"
          ],
          [
            "deportiv[a-z]*",
            "el ámbito deportivo"
          ],
          [
            "politic[a-z]*",
            "el ámbito político"
          ],
          [
            "religios[a-z]*",
            "el ámbito religioso"
          ]
        ],
        "choiceDefault": "los ámbitos expresamente pedidos",
        "objects": {
          "PRODUCTION": "la representación mediante {product} de la oferta de TIC en {choice} según los referentes"
        },
        "productChoices": [
          [
            "cartel(?:es)?",
            "el cartel"
          ],
          [
            "mural(?:es)?",
            "el mural"
          ]
        ],
        "productChoiceDefault": "el medio visual expresamente pedido"
      },
      {
        "id": "environment-deterioration",
        "grade": 4,
        "label": "evidencias de deterioro ambiental e impacto humano",
        "match": "evidencias.*deterioro.*medio ambiente",
        "object": "las evidencias de deterioro ambiental y su impacto humano de los referentes",
        "relation": "datos, condiciones y consecuencias documentados por los registros proporcionados",
        "sourceRecordIds": [
          "d5d00881-afd0-5997-abee-9b94b39a5e0e",
          "e0f46f16-f37c-54c9-b1e0-4313b83b98af",
          "5efaf409-a8c4-5deb-81d4-48deaaa40d9a"
        ],
        "pdfPages": [
          415,
          414
        ],
        "planReferenceOnly": true
      },
      {
        "id": "laudato-discard",
        "grade": 4,
        "label": "contaminación y cultura del descarte en Laudato Si",
        "match": "contaminacion.*cultura del descarte|laudato si",
        "object": "la contaminación y cultura del descarte según LaudatoSi20–22 dado",
        "relation": "afirmaciones, consecuencias y evidencias atribuidas al texto expresamente proporcionado",
        "sourceRecordIds": [
          "9dd10a31-ca87-5f80-80a5-6f6fbab8655d",
          "66081786-8eb4-5c5e-a9e5-f819b11acfaa",
          "a1cdbd4d-1579-5405-8f78-fc8570d430e9",
          "fbf23ea7-6ee5-5139-b10c-4d4662cdf023"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "ecosystem-project",
        "grade": 4,
        "label": "proyecto de equilibrio del ecosistema",
        "match": "proyectos?.*equilibrio.*ecosistema",
        "object": "el proyecto de equilibrio del ecosistema de la situación de {choice}",
        "relation": "acciones, condiciones y efectos documentados en los referentes proporcionados",
        "sourceRecordIds": [
          "b42937a2-63cf-5c3d-842b-7857e39179f9"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "ruidos?",
            "ruido"
          ],
          [
            "basura",
            "basura"
          ],
          [
            "chatarra",
            "chatarra"
          ],
          [
            "visual",
            "contaminación visual"
          ],
          [
            "desechables",
            "desechables"
          ],
          [
            "espacios",
            "espacios"
          ],
          [
            "agua",
            "agua"
          ]
        ],
        "choiceDefault": "las condiciones expresamente planteadas"
      },
      {
        "id": "environment-celebration",
        "grade": 4,
        "label": "organización festiva de productos de aprendizaje",
        "match": "organizacion festiva.*aprendizajes?",
        "object": "la organización festiva de los productos de aprendizaje dados",
        "relation": "propósito, secuencia y evidencias de logros documentados en los productos proporcionados",
        "sourceRecordIds": [
          "b4892bdd-271f-5511-a0c9-d9577343a553"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religious-elements",
        "grade": 4,
        "label": "hecho religioso y elementos constitutivos según fuentes",
        "match": "hecho religioso.*elementos constitutivos",
        "object": "el hecho religioso y sus elementos constitutivos según los referentes",
        "relation": "definiciones, contextos y evidencias atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "421e8006-bade-5cc5-aac8-d7f20473a1d6"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religious-manifestations",
        "grade": 4,
        "label": "manifestaciones religiosas en culturas documentadas",
        "match": "manifestaciones religiosas.*culturas",
        "object": "las manifestaciones religiosas en culturas documentadas por los referentes",
        "relation": "características, contextos y evidencias atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "1d20f87a-ae5d-5a42-95d2-a985244d8993"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religious-diversity",
        "grade": 4,
        "label": "pluralidad y diversidad religiosa dominicana",
        "match": "pluralidad.*diversidad religiosa|pluralismo.*diversidad religiosa",
        "object": "la pluralidad y diversidad religiosa dominicana según los referentes",
        "relation": "perspectivas, contextos y evidencias documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "f90ed0af-dcf1-57a1-882c-4190fc52ed24",
          "a2252a7f-1839-5a91-8c50-0802f42585d6"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religious-sense-panel",
        "grade": 4,
        "label": "panel de sentido vital en concepciones religiosas",
        "match": "panel.*sentido.*vida.*concepciones religiosas",
        "object": "el panel sobre sentido de vida desde concepciones religiosas de los referentes",
        "relation": "intervenciones, perspectivas y argumentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "800c8d5b-8ff7-5a2c-a2ba-51b2e2adf9f5"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "sentido de vida desde concepciones religiosas de los referentes"
        }
      },
      {
        "id": "religious-labels",
        "grade": 4,
        "label": "prácticas religiosas y etiquetas atribuidas por fuentes",
        "match": "pseudo(?:r|[ -])?religiosas|practicas religiosas.*sagrado",
        "object": "las prácticas y denominaciones religiosas expresamente analizadas según los textos dados",
        "relation": "definiciones, contextos y argumentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "059a77e1-e8d2-5b13-a5a1-b47c7de789ca"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religion-culture",
        "grade": 4,
        "label": "presencia de lo religioso en sociedad y cultura",
        "match": "presencia.*religioso.*sociedad|hecho religioso.*cultura dominicana",
        "object": "la presencia de lo religioso en sociedad y cultura según los referentes",
        "relation": "manifestaciones, contextos y evidencias documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "7395ef61-81ea-5e57-b977-d0967a484f6d",
          "476c50da-8df5-54e9-81a0-df60b17ac782"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religious-person-scene",
        "grade": 4,
        "label": "representación de personajes documentados y religión",
        "match": "representa.*personajes.*religion",
        "object": "los personajes documentados y su relación con la religión según el caso proporcionado",
        "relation": "acciones, decisiones y contextos reconocibles de los referentes dados",
        "sourceRecordIds": [
          "05328a5e-2e9b-559f-a80c-b503b87b3cac"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "james-religious-behavior",
        "grade": 4,
        "label": "comportamiento religioso interpretado según Santiago",
        "match": "comportamiento religioso.*santiago(?:\\s*\\d+)?",
        "object": "el comportamiento religioso descrito según Santiago1:26–27 dado",
        "relation": "afirmaciones, acciones y evidencias atribuidas al texto proporcionado",
        "sourceRecordIds": [
          "6a28111a-ecf5-5611-85f8-9d58f687195f"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religion-growth-project",
        "grade": 4,
        "label": "proyecto documentado sobre religión y crecimiento",
        "match": "proyectos?.*religion.*crecimiento",
        "object": "el proyecto sobre religión y crecimiento personal y espiritual según los referentes",
        "relation": "afirmaciones, acciones y relaciones sustentadas en los textos proporcionados",
        "sourceRecordIds": [
          "22a0972b-12bd-5055-8999-1069a9d18abf",
          "654d98ab-4212-5c69-91da-1d2641c30edb"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "productType": "PROJECT"
      },
      {
        "id": "religious-diversity-celebration",
        "grade": 4,
        "label": "celebración de productos sobre diversidad religiosa",
        "match": "celebracion.*diversidad religiosa",
        "object": "la celebración para presentar productos sobre diversidad religiosa dominicana",
        "relation": "propósito, secuencia y relaciones de los productos con las evidencias proporcionadas",
        "sourceRecordIds": [
          "c7b919b8-ed62-5dde-8245-53960a8e8ca4"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true
      },
      {
        "id": "concept-5cac7fcd",
        "grade": 4,
        "label": "valores éticos y culturales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+eticos[\\s,:]+y[\\s,:]+culturales)(?:\\s+segun\\s+.*)?$",
        "object": "los valores éticos y culturales según los referentes",
        "relation": "definiciones, contextos y fundamentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "5cac7fcd-84c3-5d9c-b21f-bcdd76aeea50"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-9ea82ee0",
        "grade": 4,
        "label": "conflictos personales y familiares",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:conflictos[\\s,:]+personales[\\s,:]+y[\\s,:]+familiares)(?:\\s+segun\\s+.*)?$",
        "object": "los conflictos personales y familiares de los casos educativos",
        "relation": "condiciones, causas y consecuencias documentadas por los casos proporcionados",
        "sourceRecordIds": [
          "9ea82ee0-4d48-5757-9c23-33568cc35bcd"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-ba09050e",
        "grade": 4,
        "label": "relaciones interpersonales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:relaciones[\\s,:]+interpersonales)(?:\\s+segun\\s+.*)?$",
        "object": "las relaciones interpersonales según los referentes educativos",
        "relation": "interacciones, condiciones y efectos documentados por los referentes dados",
        "sourceRecordIds": [
          "ba09050e-0bb8-587d-90bb-28aeed2caaa0"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-932d0db9",
        "grade": 4,
        "label": "la paz y el respeto en la familia, la sociedad y las religiones",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:la[\\s,:]+paz[\\s,:]+y[\\s,:]+el[\\s,:]+respeto[\\s,:]+en[\\s,:]+la[\\s,:]+familia[\\s,:]+la[\\s,:]+sociedad[\\s,:]+y[\\s,:]+las[\\s,:]+religiones)(?:\\s+segun\\s+.*)?$",
        "object": "la paz y el respeto en familia, sociedad y religiones según las fuentes",
        "relation": "perspectivas, acciones y fundamentos atribuidos a los textos proporcionados",
        "sourceRecordIds": [
          "932d0db9-334d-5c0e-b3f0-9c8fd1455bcf"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-a648cd4f",
        "grade": 4,
        "label": "relaciones de paz y respeto en la vida cotidiana",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:relaciones[\\s,:]+de[\\s,:]+paz[\\s,:]+y[\\s,:]+respeto[\\s,:]+en[\\s,:]+la[\\s,:]+vida[\\s,:]+cotidiana)(?:\\s+segun\\s+.*)?$",
        "object": "las relaciones de paz y respeto en la vida cotidiana documentada",
        "relation": "interacciones, decisiones y consecuencias descritas en los referentes dados",
        "sourceRecordIds": [
          "a648cd4f-fda1-528c-a58f-d98fca19af92"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-97d7ae27",
        "grade": 4,
        "label": "el sentido de la vida y realización personal",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+sentido[\\s,:]+de[\\s,:]+la[\\s,:]+vida[\\s,:]+y[\\s,:]+realizacion[\\s,:]+personal)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre sentido de vida y realización personal según las fuentes",
        "relation": "perspectivas, condiciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "97d7ae27-d76f-57c9-9aee-b1ee06ca4c7b"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-c18b55e3",
        "grade": 4,
        "label": "interrogantes ante el sentido de la vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:interrogantes[\\s,:]+ante[\\s,:]+el[\\s,:]+sentido[\\s,:]+de[\\s,:]+la[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "las interrogantes ante el sentido de la vida según los textos dados",
        "relation": "preguntas, contextos y perspectivas atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "c18b55e3-6513-5de0-8b94-d6a7c841b9f6"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-e843f26b",
        "grade": 4,
        "label": "respuestas ante el sentido de la vida según Jesús y otras fuentes",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:respuestas[\\s,:]+ante[\\s,:]+el[\\s,:]+sentido[\\s,:]+de[\\s,:]+la[\\s,:]+vida[\\s,:]+segun[\\s,:]+jesus[\\s,:]+y[\\s,:]+otras[\\s,:]+fuentes)(?:\\s+segun\\s+.*)?$",
        "object": "las respuestas al sentido de vida según Jesús y otras fuentes dadas",
        "relation": "afirmaciones, perspectivas y fundamentos atribuidos a los referentes expresamente proporcionados",
        "sourceRecordIds": [
          "e843f26b-9d27-5347-aa5e-fc5735961a50"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-d8ac5392",
        "grade": 4,
        "label": "adolescencia e identidad",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:adolescencia[\\s,:]+e[\\s,:]+identidad)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre adolescencia e identidad según los referentes educativos",
        "relation": "procesos, condiciones y relaciones descritos en los casos proporcionados",
        "sourceRecordIds": [
          "d8ac5392-bb3b-5b4c-bd04-c87370c444a4"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-46c9f95e",
        "grade": 4,
        "label": "vida con sentido de servicio optimismo y entrega",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:vida[\\s,:]+con[\\s,:]+sentido[\\s,:]+de[\\s,:]+servicio[\\s,:]+optimismo[\\s,:]+y[\\s,:]+entrega)(?:\\s+segun\\s+.*)?$",
        "object": "las perspectivas sobre vida con sentido de servicio, optimismo y entrega según los textos",
        "relation": "afirmaciones, contextos y fundamentos atribuidos a los referentes dados",
        "sourceRecordIds": [
          "46c9f95e-a37e-5915-adcd-3a670b6c79d8"
        ],
        "pdfPages": [
          413
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-cf29ab71",
        "grade": 4,
        "label": "situaciones y conflictos en las relaciones personales, familiares y sociales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:situaciones[\\s,:]+y[\\s,:]+conflictos[\\s,:]+en[\\s,:]+las[\\s,:]+relaciones[\\s,:]+personales[\\s,:]+familiares[\\s,:]+y[\\s,:]+sociales)(?:\\s+segun\\s+.*)?$",
        "object": "las situaciones y conflictos en relaciones personales, familiares y sociales documentadas",
        "relation": "condiciones, interacciones y consecuencias descritas en los casos proporcionados",
        "sourceRecordIds": [
          "cf29ab71-7bbb-5251-8d2e-53fde8206eab"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-17ca14a2",
        "grade": 4,
        "label": "las enseñanzas de Jesús de Nazaret y los conflictos en las familias",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:las[\\s,:]+ensenanzas[\\s,:]+de[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret[\\s,:]+y[\\s,:]+los[\\s,:]+conflictos[\\s,:]+en[\\s,:]+las[\\s,:]+familias)(?:\\s+segun\\s+.*)?$",
        "object": "las enseñanzas de Jesús de Nazaret sobre conflictos familiares según los textos",
        "relation": "afirmaciones, episodios y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "17ca14a2-d646-5d7b-9140-a32a54348b3f"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-823b9bc3",
        "grade": 4,
        "label": "actitudes y valores de Jesús de Nazaret",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:actitudes[\\s,:]+y[\\s,:]+valores[\\s,:]+de[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret)(?:\\s+segun\\s+.*)?$",
        "object": "las actitudes y valores de Jesús de Nazaret según los textos dados",
        "relation": "acciones, episodios y evidencias atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "823b9bc3-d8b7-57fa-acda-6f36b4408cb3"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-73f9cfdc",
        "grade": 4,
        "label": "el trabajo en el desarrollo de los pueblos",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+trabajo[\\s,:]+en[\\s,:]+el[\\s,:]+desarrollo[\\s,:]+de[\\s,:]+los[\\s,:]+pueblos)(?:\\s+segun\\s+.*)?$",
        "object": "el trabajo en el desarrollo de los pueblos según las fuentes",
        "relation": "actividades, aportes y condiciones documentados por los referentes dados",
        "sourceRecordIds": [
          "73f9cfdc-223a-527f-8804-25e115f8dce0"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-2d0847a2",
        "grade": 4,
        "label": "el trabajo: desarrollo de la obra creada por Dios",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+trabajo[\\s,:]+desarrollo[\\s,:]+de[\\s,:]+la[\\s,:]+obra[\\s,:]+creada[\\s,:]+por[\\s,:]+dios)(?:\\s+segun\\s+.*)?$",
        "object": "el trabajo como desarrollo de la obra creada por Dios según los textos",
        "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "2d0847a2-f7ef-565f-98ba-4005bd432b6f"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-4f131009",
        "grade": 4,
        "label": "el trabajo en el crecimiento humano y espiritual",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+trabajo[\\s,:]+en[\\s,:]+el[\\s,:]+crecimiento[\\s,:]+humano[\\s,:]+y[\\s,:]+espiritual)(?:\\s+segun\\s+.*)?$",
        "object": "el trabajo en el crecimiento humano y espiritual según las fuentes",
        "relation": "afirmaciones, relaciones y fundamentos atribuidos a los textos proporcionados",
        "sourceRecordIds": [
          "4f131009-d7a3-5090-bd66-e4144243f2b9"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-5bc80c78",
        "grade": 4,
        "label": "ética y las TIC",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:etica[\\s,:]+y[\\s,:]+las[\\s,:]+tic)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ética y TIC según los referentes",
        "relation": "normas, acciones y consecuencias documentadas por los referentes dados",
        "sourceRecordIds": [
          "5bc80c78-713a-5255-bb52-d34fc035db37"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-d4979795",
        "grade": 4,
        "label": "tecnología y vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:tecnologia[\\s,:]+y[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre tecnología y vida según las fuentes",
        "relation": "usos, condiciones y efectos documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "d4979795-71ab-58ac-831a-a8b94f577c57"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-bd7f4901",
        "grade": 4,
        "label": "tecnología y diversidad",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:tecnologia[\\s,:]+y[\\s,:]+diversidad)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre tecnología y diversidad según las fuentes",
        "relation": "usos, contextos y diferencias documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "bd7f4901-ed42-5114-8ab2-2db08cf3cac0"
        ],
        "pdfPages": [
          414
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-9dd10a31",
        "grade": 4,
        "label": "cuidado de nuestra Casa Común",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:cuidado[\\s,:]+de[\\s,:]+nuestra[\\s,:]+casa[\\s,:]+comun)(?:\\s+segun\\s+.*)?$",
        "object": "el cuidado de la casa común según los referentes educativos",
        "relation": "acciones, condiciones y consecuencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "9dd10a31-ca87-5f80-80a5-6f6fbab8655d"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-66081786",
        "grade": 4,
        "label": "ecología integral humana",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ecologia[\\s,:]+integral[\\s,:]+humana)(?:\\s+segun\\s+.*)?$",
        "object": "la ecología integral humana según los referentes",
        "relation": "relaciones, condiciones y consecuencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "66081786-8eb4-5c5e-a9e5-f819b11acfaa"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-d5d00881",
        "grade": 4,
        "label": "desarrollo sostenible vs el deterioro medio ambiental",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:desarrollo[\\s,:]+sostenible[\\s,:]+vs[\\s,:]+el[\\s,:]+deterioro[\\s,:]+medio[\\s,:]+ambiental)(?:\\s+segun\\s+.*)?$",
        "object": "el desarrollo sostenible frente al deterioro medioambiental según las fuentes",
        "relation": "condiciones, diferencias y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "d5d00881-afd0-5997-abee-9b94b39a5e0e"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-a1cdbd4d",
        "grade": 4,
        "label": "ecología y bienestar social",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ecologia[\\s,:]+y[\\s,:]+bienestar[\\s,:]+social)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ecología y bienestar social según los referentes",
        "relation": "condiciones, efectos y relaciones documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "a1cdbd4d-1579-5405-8f78-fc8570d430e9"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-07d87677",
        "grade": 4,
        "label": "ecología y Biblia",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ecologia[\\s,:]+y[\\s,:]+biblia)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ecología y Biblia según los textos dados",
        "relation": "afirmaciones, contextos y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "07d87677-7db4-5c57-8d8f-b4188798296b"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-22a0972b",
        "grade": 4,
        "label": "la religión en el crecimiento personal y espiritual",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:la[\\s,:]+religion[\\s,:]+en[\\s,:]+el[\\s,:]+crecimiento[\\s,:]+personal[\\s,:]+y[\\s,:]+espiritual)(?:\\s+segun\\s+.*)?$",
        "object": "la religión en el crecimiento personal y espiritual según los referentes",
        "relation": "perspectivas, contextos y fundamentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "22a0972b-12bd-5055-8999-1069a9d18abf"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-f90ed0af",
        "grade": 4,
        "label": "pluralismo y diversidad religiosa",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:pluralismo[\\s,:]+y[\\s,:]+diversidad[\\s,:]+religiosa)(?:\\s+segun\\s+.*)?$",
        "object": "el pluralismo y la diversidad religiosa según las fuentes",
        "relation": "perspectivas, contextos y diferencias documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "f90ed0af-dcf1-57a1-882c-4190fc52ed24"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      },
      {
        "id": "concept-7395ef61",
        "grade": 4,
        "label": "hecho religioso y cultura dominicana",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:hecho[\\s,:]+religioso[\\s,:]+y[\\s,:]+cultura[\\s,:]+dominicana)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre hecho religioso y cultura dominicana según las fuentes",
        "relation": "manifestaciones, contextos y relaciones documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "7395ef61-81ea-5e57-b977-d0967a484f6d"
        ],
        "pdfPages": [
          415
        ],
        "planReferenceOnly": true,
        "conceptBrief": true
      }
    ],
    "policy": "OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH"
  },
  {
    "id": "formacion-humana-religiosa-comun-5",
    "grade": 5,
    "topics": [
      {
        "id": "religious-data",
        "grade": 5,
        "label": "datos documentados de manifestaciones religiosas",
        "match": "datos.*manifestaciones religiosas",
        "object": "los datos de manifestaciones religiosas de los referentes escolares y comunitarios",
        "relation": "categorías, contextos y evidencias documentados por los registros proporcionados",
        "sourceRecordIds": [
          "90e2273b-6867-57ae-8e39-11b69b43bed8"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religious-diversity",
        "grade": 5,
        "label": "diversidad religiosa en sociedad dominicana",
        "match": "diversidad religiosa.*(?:sociedad|dominicana)",
        "object": "la diversidad religiosa presente en la sociedad dominicana según las fuentes",
        "relation": "manifestaciones, contextos y relaciones documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "661e787d-e3fe-569b-a97f-0d105471196d"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religious-social-work",
        "grade": 5,
        "label": "labor social documentada de grupos religiosos",
        "match": "labor social.*grupos religiosos",
        "object": "la labor social de grupos religiosos descrita en los registros dados",
        "relation": "acciones, contextos y aportes documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "fdffc779-e412-5fb3-9c01-8c58cf286c5a"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true
      },
      {
        "id": "religious-conversation",
        "grade": 5,
        "label": "conversatorio documentado de iglesias",
        "match": "conversatorio.*(?:iglesias|lideres)",
        "object": "el conversatorio sobre características, creencias, cultos y doctrinas de iglesias documentadas",
        "relation": "propósito, preguntas y secuencia de intervenciones sustentados en los testimonios proporcionados",
        "sourceRecordIds": [
          "505ca049-dc78-52c0-b325-424e96a1ed5f"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "características, creencias, cultos y doctrinas de iglesias documentadas"
        }
      },
      {
        "id": "ecumenism-media",
        "grade": 5,
        "label": "medios proporcionados sobre ecumenismo",
        "match": "(?:textos|videos|medios).*ecumenismo",
        "object": "los {choice} proporcionados que promueven ecumenismo en la sociedad dominicana",
        "relation": "mensajes, contextos y evidencias expresamente contenidos en los medios trabajados",
        "sourceRecordIds": [
          "d7c46474-cf75-5b4d-a315-404b29a7d547"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "textos",
            "textos"
          ],
          [
            "videos",
            "videos"
          ]
        ],
        "choiceDefault": "medios expresamente trabajados"
      },
      {
        "id": "christian-dignity",
        "grade": 5,
        "label": "aportes del cristianismo a dignidad según textos",
        "match": "aportes.*cristianismo.*dignidad",
        "object": "los aportes del cristianismo a la dignidad humana según los textos dados",
        "relation": "afirmaciones, episodios y evidencias atribuidos a {choice}",
        "sourceRecordIds": [
          "9f534a55-9a31-5c21-9f88-3b5f9455fe36"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "(?:y\\s*)?juan(?:\\s*\\d+)?",
            "Juan"
          ],
          [
            "(?:y\\s*)?lucas(?:\\s*\\d+)?",
            "Lucas"
          ]
        ],
        "choiceDefault": "los textos expresamente proporcionados"
      },
      {
        "id": "religious-fair",
        "grade": 5,
        "label": "feria de expresiones religiosas documentadas",
        "match": "feria religiosa",
        "object": "la feria de expresiones religiosas documentadas mediante {choice}",
        "relation": "propósito, secuencia y relación de los productos con los referentes proporcionados",
        "sourceRecordIds": [
          "4e84558d-9d16-5959-b3db-82906fe2e879"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "carteles|cartel",
            "los carteles"
          ],
          [
            "esculturas?",
            "las esculturas"
          ],
          [
            "maquetas?",
            "las maquetas"
          ],
          [
            "vestuarios?",
            "los vestuarios"
          ],
          [
            "murales|mural",
            "los murales"
          ],
          [
            "ilustraciones?",
            "las ilustraciones"
          ],
          [
            "libros",
            "los libros proporcionados"
          ],
          [
            "mapas?",
            "los mapas"
          ]
        ],
        "choiceDefault": "los productos expresamente proporcionados"
      },
      {
        "id": "biblical-knowledge",
        "grade": 5,
        "label": "saberes documentados sobre personajes bíblicos",
        "match": "saberes.*personajes biblicos",
        "object": "los saberes sobre personajes bíblicos documentados por los referentes",
        "relation": "personajes, contextos y evidencias atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "3cc1ba84-dfd1-5a4c-b0f6-6efa1f625592"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true
      },
      {
        "id": "biblical-characters-books",
        "grade": 5,
        "label": "personajes bíblicos y libros que los describen",
        "match": "personajes.*(?:antiguo|nuevo).*testamento.*libros",
        "object": "los personajes y libros de {choice} según los referentes dados",
        "relation": "identificación y relación de personajes con las evidencias de los libros proporcionados",
        "sourceRecordIds": [
          "3f46d2b4-9327-57a9-b40a-72ccd8d90406"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "nuevo(?:\\s+y\\s+(?:el\\s+)?antiguo)?\\s+testamento",
            "el Nuevo Testamento"
          ],
          [
            "antiguo(?:\\s+y\\s+(?:el\\s+)?nuevo)?\\s+testamento",
            "el Antiguo Testamento"
          ]
        ],
        "choiceDefault": "los Testamentos expresamente trabajados"
      },
      {
        "id": "old-testament-context",
        "grade": 5,
        "label": "contextos de personajes del Antiguo Testamento",
        "match": "contexto.*(?:abraham|isaac|jacob|moises)",
        "object": "el contexto sociocultural y religioso de {choice} según los referentes",
        "relation": "condiciones, mensajes y evidencias atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "a2c78319-16e5-51ca-8c41-f15f9f6a9663"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "abraham",
            "Abraham"
          ],
          [
            "isaac",
            "Isaac"
          ],
          [
            "jacob",
            "Jacob"
          ],
          [
            "moises",
            "Moisés"
          ]
        ],
        "choiceDefault": "los personajes expresamente documentados"
      },
      {
        "id": "biblical-interview",
        "grade": 5,
        "label": "entrevista dramatizada a personajes bíblicos",
        "match": "entrevista.*(?:personajes|testamento).*mision",
        "object": "la entrevista dramatizada sobre la misión de los personajes expresamente dados de {choice}",
        "relation": "preguntas, respuestas y acciones reconocibles según los textos proporcionados",
        "sourceRecordIds": [
          "235cb8ee-d8bd-5807-a9c4-919ab8a996b3"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "nuevo(?:\\s+y\\s+(?:el\\s+)?antiguo)?\\s+testamento",
            "el Nuevo Testamento"
          ],
          [
            "antiguo(?:\\s+y\\s+(?:el\\s+)?nuevo)?\\s+testamento",
            "el Antiguo Testamento"
          ]
        ],
        "choiceDefault": "los Testamentos expresamente trabajados"
      },
      {
        "id": "new-testament-message",
        "grade": 5,
        "label": "mensajes de personajes del Nuevo Testamento",
        "match": "mensaje.*(?:juan bautista|jesus|apostoles|pablo)",
        "object": "los mensajes de {choice} según los textos dados",
        "relation": "afirmaciones, contextos y evidencias atribuidos a los textos proporcionados",
        "sourceRecordIds": [
          "dcf8bf9e-e49a-5b8c-8491-1eb6db04df31"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "juan(?: el)? bautista",
            "Juan Bautista"
          ],
          [
            "jesus",
            "Jesús"
          ],
          [
            "apostoles",
            "los Apóstoles"
          ],
          [
            "pablo",
            "Pablo"
          ]
        ],
        "choiceDefault": "los personajes expresamente trabajados del Nuevo Testamento"
      },
      {
        "id": "biblical-teachings",
        "grade": 5,
        "label": "enseñanzas de personajes bíblicos según fuentes",
        "match": "ensenanzas?.*personajes biblicos|ensenan.*personajes biblicos",
        "object": "las enseñanzas atribuidas a personajes bíblicos para cristianos de hoy según las fuentes",
        "relation": "afirmaciones, contextos y argumentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "f08e8e3b-377b-51db-b488-fbb7fe2b76c7"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "excludeWhen": "panel"
      },
      {
        "id": "biblical-teachings-panel",
        "grade": 5,
        "label": "panel de enseñanzas bíblicas en contextos dados",
        "match": "panel.*ensenanzas.*(?:testamento|personajes biblicos)",
        "object": "el panel sobre enseñanzas de personajes de {choice} en la vida cotidiana documentada",
        "relation": "intervenciones, perspectivas y argumentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "813f2cb6-c908-56f2-af27-52408b56adee"
        ],
        "pdfPages": [
          417
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "nuevo(?:\\s+y\\s+(?:el\\s+)?antiguo)?\\s+testamento",
            "el Nuevo Testamento"
          ],
          [
            "antiguo(?:\\s+y\\s+(?:el\\s+)?nuevo)?\\s+testamento",
            "el Antiguo Testamento"
          ]
        ],
        "choiceDefault": "los Testamentos expresamente trabajados",
        "objects": {
          "DEBATE": "enseñanzas de personajes de {choice} en la vida cotidiana documentada"
        }
      },
      {
        "id": "biblical-celebration",
        "grade": 5,
        "label": "celebración de productos sobre personajes bíblicos",
        "match": "celebracion.*personajes.*ensenanzas",
        "object": "la celebración para presentar productos sobre personajes bíblicos y sus enseñanzas",
        "relation": "propósito, secuencia y relación de los productos con los referentes proporcionados",
        "sourceRecordIds": [
          "28a01447-2796-5fe7-b10c-80040504ed08"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "conflict-techniques",
        "grade": 5,
        "label": "técnicas de manejo de conflictos en casos",
        "match": "tecnicas.*manejo.*conflictos",
        "object": "las técnicas de manejo de conflictos previstas en el caso proporcionado",
        "relation": "acciones, secuencia y decisiones reconocibles según las condiciones del caso",
        "sourceRecordIds": [
          "f6a8c2b9-6c98-545b-821d-c8a7fc372d03"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "biblical-violence-scene",
        "grade": 5,
        "label": "personajes bíblicos ante violencia documentada",
        "match": "personajes biblicos.*violencia",
        "object": "el caso proporcionado de personajes bíblicos ante violencia {choice}",
        "relation": "acciones, decisiones y contextos reconocibles según los textos proporcionados",
        "sourceRecordIds": [
          "11b3371d-2981-5410-b455-802fd428d801"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "personal",
            "personal"
          ],
          [
            "familiar",
            "familiar"
          ],
          [
            "social",
            "social"
          ],
          [
            "religiosa",
            "religiosa"
          ]
        ],
        "choiceDefault": "en los ámbitos expresamente documentados"
      },
      {
        "id": "family-violence-debate",
        "grade": 5,
        "label": "violencia y complementariedad en casos documentados",
        "match": "violencia.*complementariedad",
        "object": "las situaciones de violencia y complementariedad entre hombre y mujer descritas en los casos dados",
        "relation": "condiciones, perspectivas y argumentos sustentados en los referentes proporcionados",
        "sourceRecordIds": [
          "721c9519-ee4f-580b-9f1d-21fcaa58f7e5"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "support-institutions",
        "grade": 5,
        "label": "instituciones de ayuda documentadas",
        "match": "instituciones.*resolucion.*problematicas",
        "object": "las instituciones de ayuda ante problemáticas sociales, religiosas y familiares documentadas",
        "relation": "funciones, contextos y relaciones con las necesidades descritas en los referentes proporcionados",
        "sourceRecordIds": [
          "15089835-642d-5f82-a172-8999faad6012"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "women-contributions",
        "grade": 5,
        "label": "roles y aportes de mujeres en fuentes",
        "match": "roles y aportes.*mujeres",
        "object": "los roles y aportes de mujeres al desarrollo familiar y social dominicano según las fuentes",
        "relation": "acciones, contextos y aportes documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "c201957e-0b70-56f1-b908-a20bdab783ab"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "jesus-conflict-solutions",
        "grade": 5,
        "label": "enseñanzas de Jesús ante situaciones documentadas",
        "match": "ensenanzas.*jesus.*(?:resolucion|resolver)",
        "object": "las enseñanzas de Jesús para resolver situaciones familiares, sociales y religiosas según los textos",
        "relation": "afirmaciones, acciones y evidencias atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "dbea6882-54ba-50ca-9372-af5b36eec183"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-situation-solutions",
        "grade": 5,
        "label": "alternativas para situaciones escolares familiares y sociales",
        "match": "alternativas.*situaciones.*vida",
        "object": "las alternativas de solución para las situaciones que afectan la vida en los casos dados",
        "relation": "acciones, condiciones y consecuencias justificadas mediante los referentes proporcionados",
        "sourceRecordIds": [
          "7cbba03b-5011-5f47-9d1f-ef431b80f608"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "relationships-panel",
        "grade": 5,
        "label": "panel documentado de relaciones según referentes educativos",
        "match": "panel.*(?:sexualidad|noviazgo|matrimonio)",
        "object": "el panel sobre {choice} según los referentes educativos",
        "relation": "intervenciones, perspectivas y argumentos atribuidos a los textos proporcionados",
        "sourceRecordIds": [
          "021aa18d-214f-58eb-92fa-9441db7d3203"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "sexualidad",
            "sexualidad"
          ],
          [
            "noviazgo",
            "noviazgo"
          ],
          [
            "matrimonio",
            "matrimonio"
          ]
        ],
        "choiceDefault": "las relaciones expresamente documentadas",
        "objects": {
          "DEBATE": "{choice} según los referentes educativos"
        }
      },
      {
        "id": "gender-relationship-texts",
        "grade": 5,
        "label": "relación hombre mujer según textos dados",
        "match": "relacion.*hombre.*mujer.*(?:genesis(?:\\s*\\d+)?|marcos(?:\\s*\\d+)?|corintios(?:\\s*\\d+)?)",
        "object": "las perspectivas sobre relación hombre mujer atribuidas a los textos proporcionados",
        "relation": "afirmaciones, contextos y argumentos atribuidos a {choice}",
        "sourceRecordIds": [
          "7dd65701-63b2-588b-9c04-05077ecb27bd"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "(?:y\\s*)?genesis(?:\\s*\\d+)?",
            "Génesis"
          ],
          [
            "(?:y\\s*)?marcos(?:\\s*\\d+)?",
            "Marcos"
          ],
          [
            "(?:y\\s*)?(?:1\\s*)?corintios(?:\\s*\\d+)?",
            "1 Corintios"
          ]
        ],
        "choiceDefault": "los textos expresamente trabajados"
      },
      {
        "id": "healthy-relationships-campaign",
        "grade": 5,
        "label": "campaña de relaciones sanas según casos",
        "match": "campana.*relaciones sanas",
        "object": "el prototipo de campaña escrita sobre relaciones sanas en {choice}",
        "relation": "mensajes, acciones y evidencias justificadas por los referentes proporcionados",
        "sourceRecordIds": [
          "e785729f-e3b4-5957-8706-b1a5adba85e8"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION",
        "choices": [
          [
            "noviazgo",
            "el noviazgo"
          ],
          [
            "matrimonio",
            "el matrimonio"
          ],
          [
            "familia",
            "la familia"
          ]
        ],
        "choiceDefault": "los contextos expresamente trabajados"
      },
      {
        "id": "relationship-solutions-art",
        "grade": 5,
        "label": "representación artística de soluciones documentadas",
        "match": "representa.*soluciones.*(?:noviazgo|matrimonio|familia)",
        "object": "la representación artística de soluciones a situaciones de {choice} del caso dado",
        "relation": "acciones, decisiones y relaciones reconocibles según las condiciones proporcionadas",
        "sourceRecordIds": [
          "7c58feea-2940-5c36-b56e-0d59d955f6eb"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "noviazgo",
            "el noviazgo"
          ],
          [
            "matrimonio",
            "el matrimonio"
          ],
          [
            "familia",
            "la familia"
          ]
        ],
        "choiceDefault": "los contextos expresamente pedidos",
        "objects": {
          "PERFORMANCE": "las soluciones a situaciones de {choice} del caso dado mediante la representación artística solicitada"
        }
      },
      {
        "id": "abortion-life-documents",
        "grade": 5,
        "label": "aborto y defensa de vida según documentos dados",
        "match": "aborto.*defensa.*vida",
        "object": "las perspectivas sobre aborto y defensa de la vida atribuidas a los documentos proporcionados",
        "relation": "afirmaciones, contextos y fundamentos atribuidos a las fuentes expresamente dadas",
        "sourceRecordIds": [
          "8338062f-e6d4-57a5-87f9-7f251bf365ea"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "harmonious-relationships-celebration",
        "grade": 5,
        "label": "celebración de productos sobre convivencia",
        "match": "celebracion.*relaciones armoniosas",
        "object": "la celebración para presentar productos sobre relaciones armoniosas en los contextos dados",
        "relation": "propósito, secuencia y relación de los productos con los referentes proporcionados",
        "sourceRecordIds": [
          "a302a693-fc2a-5bcb-b27a-52b5254eeca7"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-development",
        "grade": 5,
        "label": "trabajo y desarrollo de pueblos según fuentes",
        "match": "trabajo.*desarrollo.*pueblos",
        "object": "el trabajo y su relación con el desarrollo de los pueblos según las fuentes",
        "relation": "actividades, aportes y condiciones documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "4ba1c014-cf8d-5852-ad87-b13ad8598bf7",
          "da4fab08-8a6d-5c52-a1a7-c0831c2c1c99"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-spiritual",
        "grade": 5,
        "label": "sentido espiritual del trabajo en textos dados",
        "match": "sentido espiritual.*trabajo",
        "object": "el sentido espiritual del trabajo atribuido a los textos proporcionados",
        "relation": "afirmaciones, contextos y fundamentos atribuidos a los referentes expresamente dados",
        "sourceRecordIds": [
          "378ad572-43d6-5d0a-bf3f-cb9e2fad9837"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "work-creation-panel",
        "grade": 5,
        "label": "panel de trabajo creación y desarrollo según textos",
        "match": "panel.*trabajo.*(?:creadora|creacion)",
        "object": "el panel sobre trabajo, obra creadora y desarrollo social según los textos dados",
        "relation": "propósito, secuencia y relación de intervenciones con los fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "17299d7c-ade1-58b8-8507-5ee6dea278b4"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "trabajo, obra creadora y desarrollo social según los textos dados"
        }
      },
      {
        "id": "work-contributions-project",
        "grade": 5,
        "label": "proyecto de aportes del trabajo según referentes",
        "match": "proyecto.*aportes.*trabajo",
        "object": "el proyecto sobre aportes del trabajo a {choice}",
        "relation": "acciones, condiciones y aportes documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "74c9017c-9293-5f1a-8d84-204925537b01"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true,
        "productType": "PROJECT",
        "choices": [
          [
            "persona",
            "la persona"
          ],
          [
            "naturaleza",
            "la naturaleza"
          ],
          [
            "pueblos",
            "los pueblos"
          ]
        ],
        "choiceDefault": "los ámbitos expresamente trabajados"
      },
      {
        "id": "ethical-principles",
        "grade": 5,
        "label": "principios éticos y morales en casos educativos",
        "match": "principios eticos y morales",
        "object": "los principios éticos y morales descritos en los casos proporcionados",
        "relation": "definiciones, acciones y relaciones expresamente documentadas por los referentes educativos",
        "sourceRecordIds": [
          "e3b93a85-5777-5bff-8f0a-fee9a466b188",
          "045d3949-4f50-5ad6-b6ec-5a44ac4f5b47"
        ],
        "pdfPages": [
          418,
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "technology-experiences",
        "grade": 5,
        "label": "experiencias tecnológicas documentadas",
        "match": "experiencias.*avances tecnologicos",
        "object": "las experiencias con avances tecnológicos descritas en los registros proporcionados",
        "relation": "usos, condiciones y efectos documentados por los referentes dados",
        "sourceRecordIds": [
          "0f626cc4-9e8b-524e-a234-f36fbf9fdd9c"
        ],
        "pdfPages": [
          418
        ],
        "planReferenceOnly": true
      },
      {
        "id": "technology-effects",
        "grade": 5,
        "label": "efectos tecnológicos en ámbitos dados",
        "match": "efectos.*tecnologia.*(?:economia|trabajo|personas)",
        "object": "los efectos de la tecnología en {choice}",
        "relation": "usos, condiciones y consecuencias documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "a4811d5f-2290-5b05-9c1b-a566803061e0",
          "a76b15da-6330-5bf0-860d-87878a6f2244"
        ],
        "pdfPages": [
          418,
          419
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "economia",
            "la economía"
          ],
          [
            "trabajo",
            "el trabajo"
          ],
          [
            "personas",
            "las personas"
          ]
        ],
        "choiceDefault": "los ámbitos expresamente pedidos"
      },
      {
        "id": "technology-panel",
        "grade": 5,
        "label": "panel de beneficios y perjuicios tecnológicos",
        "match": "panel.*beneficios y perjuicios.*tecnologia",
        "object": "el panel sobre beneficios y perjuicios de tecnología en {choice}",
        "relation": "propósito, secuencia y relación de intervenciones con evidencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "fe2f112c-30cb-578a-b57f-a3a63d8b6baf"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "naturaleza",
            "la naturaleza"
          ],
          [
            "medioambiente|medio ambiente",
            "el medioambiente"
          ],
          [
            "personas",
            "las personas"
          ]
        ],
        "choiceDefault": "los ámbitos expresamente dados",
        "objects": {
          "DEBATE": "beneficios y perjuicios de tecnología en {choice}"
        }
      },
      {
        "id": "science-critical-scene",
        "grade": 5,
        "label": "dramatización de juicios críticos sobre ciencia y tecnología",
        "match": "dramatiza.*juicios criticos.*(?:ciencia|tecnologia)",
        "object": "el caso proporcionado de juicios críticos sobre ciencia y tecnología en los ámbitos dados",
        "relation": "acciones, decisiones y argumentos reconocibles según las condiciones proporcionadas",
        "sourceRecordIds": [
          "3cddc7e1-14d3-5b2b-a03d-558d0e8c4002",
          "ed2c024c-6c0d-5c6b-a801-6b9d4691f3e0"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "technology-celebration",
        "grade": 5,
        "label": "celebración de productos sobre avances científicos",
        "match": "celebracion.*beneficios.*avances",
        "object": "la celebración para presentar productos sobre beneficios de avances científicos y tecnológicos en {choice}",
        "relation": "propósito, secuencia y relación de productos con evidencias documentadas por los referentes dados",
        "sourceRecordIds": [
          "476786cd-c149-5616-bfb2-a52a801f1378"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "ambiente",
            "el ambiente"
          ],
          [
            "trabajo",
            "el trabajo"
          ],
          [
            "salud",
            "la salud"
          ],
          [
            "transporte",
            "el transporte"
          ],
          [
            "comunicacion",
            "la comunicación"
          ],
          [
            "personas",
            "las personas"
          ]
        ],
        "choiceDefault": "los ámbitos expresamente pedidos"
      },
      {
        "id": "ecological-problems",
        "grade": 5,
        "label": "problemas ecológicos e impacto en calidad de vida",
        "match": "problematicas ecologicas.*calidad de vida",
        "object": "las problemáticas ecológicas y su impacto en calidad de vida según los referentes",
        "relation": "condiciones, causas y consecuencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "7bb067c2-d5dd-5737-a427-d34dd2f3894b"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "environmental-laws",
        "grade": 5,
        "label": "textos de leyes sobre protección ambiental",
        "match": "leyes.*proteccion.*ambient(?:e|al)",
        "object": "las leyes de protección ambiental según los documentos proporcionados",
        "relation": "disposiciones, contextos y fundamentos atribuidos a los textos expresamente dados",
        "sourceRecordIds": [
          "15b25ba8-aafb-5bbf-bead-6817b57c016d",
          "9c736b72-0eb3-534f-ae66-ec43d94ecaa7"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "ecological-ethics-common-good",
        "grade": 5,
        "label": "ética ecológica y bien común en Laudato Si",
        "match": "etica ecologica.*bien comun",
        "object": "la relación entre ética ecológica y bien común según Laudato Si156–162 dado",
        "relation": "afirmaciones, contextos y fundamentos atribuidos al texto proporcionado",
        "sourceRecordIds": [
          "667d40a1-84f8-5277-9b12-235ca6ff23ee"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "dignity-ecology-proclamation",
        "grade": 5,
        "label": "proclama de dignidad y equilibrio ecológico",
        "match": "proclamas?.*dignidad.*equilibrio ecologico",
        "object": "la proclama sobre situaciones que afectan dignidad humana y equilibrio ecológico",
        "relation": "afirmaciones, razones y evidencias sustentadas en los referentes proporcionados",
        "sourceRecordIds": [
          "70dad033-d909-5422-b398-9beda808d4bb"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "ecology-celebration",
        "grade": 5,
        "label": "celebración de productos sobre cuidado ambiental",
        "match": "celebracion.*(?:conciencia ecologica|cuidado ambiental|proteccion del medioambiente)",
        "object": "la celebración para presentar productos sobre cuidado y protección del medioambiente",
        "relation": "propósito, secuencia y relación de productos con evidencias de los referentes proporcionados",
        "sourceRecordIds": [
          "7536afac-a8e3-563c-b4fb-e2c19e8dfce4"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "jesus-lifestyle",
        "grade": 5,
        "label": "estilo de vida de Jesús según textos",
        "match": "estilo de vida.*jesus",
        "object": "el estilo de vida de Jesús según los textos dados",
        "relation": "acciones, relaciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "023a2317-c498-5a9a-956f-49fbc911fd07",
          "0494405e-c7de-58a4-a321-94808d0f3443"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true,
        "excludeWhen": "sociedad|propuestas sociales|celebracion|descripcion grafica"
      },
      {
        "id": "adolescent-conflict-factors",
        "grade": 5,
        "label": "factores de conflictos adolescentes documentados",
        "match": "factores.*conflicto.*adolescen(?:cia|tes)",
        "object": "los factores generadores de conflictos adolescentes de los referentes educativos",
        "relation": "condiciones, relaciones y consecuencias documentadas por los casos proporcionados",
        "sourceRecordIds": [
          "9f75bc4e-f71c-5137-8c7e-447feab86a44"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "jesus-decisions-panel",
        "grade": 5,
        "label": "panel de decisiones de Jesús según casos y textos",
        "match": "panel.*decisiones.*jesus",
        "object": "el panel sobre decisiones atribuidas a Jesús ante las situaciones proporcionadas",
        "relation": "intervenciones, argumentos y fundamentos atribuidos a los textos y casos dados",
        "sourceRecordIds": [
          "03252c7b-edcf-589f-a10b-349360995c61"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "decisiones atribuidas a Jesús ante las situaciones proporcionadas"
        }
      },
      {
        "id": "jesus-graphic-description",
        "grade": 5,
        "label": "descripción gráfica de propuesta de Jesús",
        "match": "descripcion grafica.*(?:propuesta|jesus)",
        "object": "la descripción gráfica de la propuesta de Jesús como estilo de vida según los textos",
        "relation": "rasgos, relaciones y evidencias atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "f1256796-b27f-5615-b52d-362bf50037d2"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "youth-life-options",
        "grade": 5,
        "label": "opciones de vida juveniles según fuentes",
        "match": "opciones de vida.*jovenes",
        "object": "las opciones de vida juveniles descritas en los referentes educativos",
        "relation": "condiciones, perspectivas y consecuencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "8882dd61-0932-5ccf-be73-77836fd29ad6"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "youth-lifestyles",
        "grade": 5,
        "label": "estilos de vida juveniles documentados",
        "match": "estilos de vida.*(?:jovenes|juveniles)",
        "object": "los estilos de vida juveniles y sus causas y efectos según los referentes",
        "relation": "intereses, proyectos y relaciones expresamente documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "e5d2a2ee-90d0-52c3-a3c9-612d3e088e5e"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "youth-challenges",
        "grade": 5,
        "label": "retos y desafíos de jóvenes dominicanos",
        "match": "retos y desafios.*jovenes dominicanos",
        "object": "los retos y desafíos de jóvenes dominicanos documentados por las fuentes",
        "relation": "condiciones, consecuencias y relaciones sustentadas en los referentes proporcionados",
        "sourceRecordIds": [
          "e3b049d8-cf0e-51f6-ba5b-f71291ad198e"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION",
        "objects": {
          "PRODUCTION": "las propuestas para los retos y desafíos juveniles documentados",
          "PLAN": "las propuestas para los retos y desafíos juveniles documentados"
        }
      },
      {
        "id": "jesus-social-lifestyles",
        "grade": 5,
        "label": "estilos de vida según Jesús y propuestas sociales",
        "match": "estilos? de vida.*jesus.*(?:sociedad|propuestas sociales)",
        "object": "el estilo de vida de Jesús y las propuestas sociales juveniles según los referentes",
        "relation": "perspectivas, diferencias y argumentos atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "0bf8eb9c-635a-5d2f-92e4-2ec283a589fc"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "jesus-learning-celebration",
        "grade": 5,
        "label": "celebración de productos sobre propuesta de Jesús",
        "match": "celebracion.*(?:propuesta|estilo de vida).*jesus",
        "object": "la celebración para presentar productos y aprendizajes sobre la propuesta de Jesús",
        "relation": "propósito, secuencia y relación de productos con los referentes proporcionados",
        "sourceRecordIds": [
          "9bd7616a-66e1-5025-9851-a2336f809214"
        ],
        "pdfPages": [
          419
        ],
        "planReferenceOnly": true
      },
      {
        "id": "concept-e8c8e4a2",
        "grade": 5,
        "label": "el hecho o fenómeno religioso",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+hecho[\\s,:]+o[\\s,:]+fenomeno[\\s,:]+religioso)(?:\\s+segun\\s+.*)?$",
        "object": "el hecho o fenómeno religioso según las fuentes",
        "relation": "definiciones, manifestaciones y contextos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "e8c8e4a2-74e5-548b-b1dd-c1c53fbe982d"
        ],
        "pdfPages": [
          417
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-ca10c90f",
        "grade": 5,
        "label": "diversidad religiosa dominicana",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:diversidad[\\s,:]+religiosa[\\s,:]+dominicana)(?:\\s+segun\\s+.*)?$",
        "object": "la diversidad religiosa dominicana según las fuentes",
        "relation": "manifestaciones, contextos y diferencias documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "ca10c90f-a4ff-5875-9801-aab5197aa49e"
        ],
        "pdfPages": [
          417
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-b277c300",
        "grade": 5,
        "label": "cristianismo y dignidad humana",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:cristianismo[\\s,:]+y[\\s,:]+dignidad[\\s,:]+humana)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre cristianismo y dignidad humana según los textos dados",
        "relation": "afirmaciones, contextos y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "b277c300-17df-562d-b590-51b057c57340"
        ],
        "pdfPages": [
          417
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-cad22d39",
        "grade": 5,
        "label": "ecumenismo, diálogo y comunión",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ecumenismo[\\s,:]+dialogo[\\s,:]+y[\\s,:]+comunion)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ecumenismo, diálogo y comunión según las fuentes",
        "relation": "definiciones, perspectivas y condiciones atribuidas a los referentes proporcionados",
        "sourceRecordIds": [
          "cad22d39-ca38-5dfc-9f66-7033714de7c5"
        ],
        "pdfPages": [
          417
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-35db4e49",
        "grade": 5,
        "label": "personajes bíblicos destacados en el Antiguo Testamento: Abraham, Moisés, Isaac, Jacob y profetas",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:personajes[\\s,:]+biblicos[\\s,:]+destacados[\\s,:]+en[\\s,:]+el[\\s,:]+antiguo[\\s,:]+testamento[\\s,:]+abraham[\\s,:]+moises[\\s,:]+isaac[\\s,:]+jacob[\\s,:]+y[\\s,:]+profetas)(?:\\s+segun\\s+.*)?$",
        "object": "los personajes destacados del Antiguo Testamento expresamente documentados",
        "relation": "identificación, contextos y mensajes atribuidos a los textos proporcionados",
        "sourceRecordIds": [
          "35db4e49-8814-53db-8d71-eb0434bb2dbd"
        ],
        "pdfPages": [
          417
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-9ae021d6",
        "grade": 5,
        "label": "personajes bíblicos destacados en el Nuevo Testamento: Juan el Bautista, María, Jesús, Apóstoles y Pablo",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:personajes[\\s,:]+biblicos[\\s,:]+destacados[\\s,:]+en[\\s,:]+el[\\s,:]+nuevo[\\s,:]+testamento[\\s,:]+juan[\\s,:]+el[\\s,:]+bautista[\\s,:]+maria[\\s,:]+jesus[\\s,:]+apostoles[\\s,:]+y[\\s,:]+pablo)(?:\\s+segun\\s+.*)?$",
        "object": "los personajes destacados del Nuevo Testamento expresamente documentados",
        "relation": "identificación, contextos y mensajes atribuidos a los textos proporcionados",
        "sourceRecordIds": [
          "9ae021d6-3d55-5020-acc8-b848c8d26aae"
        ],
        "pdfPages": [
          417
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-d3d4ea02",
        "grade": 5,
        "label": "mensaje bíblico y práctica de vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:mensaje[\\s,:]+biblico[\\s,:]+y[\\s,:]+practica[\\s,:]+de[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre mensaje bíblico y práctica de vida según los textos",
        "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "d3d4ea02-13d8-59f0-b0e1-b512f1895a46"
        ],
        "pdfPages": [
          417
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-037341e6",
        "grade": 5,
        "label": "situaciones sociales y personales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:situaciones[\\s,:]+sociales[\\s,:]+y[\\s,:]+personales)(?:\\s+segun\\s+.*)?$",
        "object": "las situaciones sociales y personales de los casos educativos",
        "relation": "condiciones, relaciones y consecuencias documentadas por los referentes dados",
        "sourceRecordIds": [
          "037341e6-b458-53e9-ad42-1a565d0b7295"
        ],
        "pdfPages": [
          418
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-c619f64b",
        "grade": 5,
        "label": "escuela y contexto social",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:escuela[\\s,:]+y[\\s,:]+contexto[\\s,:]+social)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre escuela y contexto social según las fuentes",
        "relation": "condiciones, interacciones y efectos documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "c619f64b-c968-5458-b0e6-2f45e67d58cd"
        ],
        "pdfPages": [
          418
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-bfd887c0",
        "grade": 5,
        "label": "familia y comunidad",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:familia[\\s,:]+y[\\s,:]+comunidad)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre familia y comunidad según los referentes educativos",
        "relation": "interacciones, condiciones y aportes documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "bfd887c0-89ca-5303-8a49-a9f6760399ae"
        ],
        "pdfPages": [
          418
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-b1c028e8",
        "grade": 5,
        "label": "noviazgo, matrimonio y sexualidad",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:noviazgo[\\s,:]+matrimonio[\\s,:]+y[\\s,:]+sexualidad)(?:\\s+segun\\s+.*)?$",
        "object": "las perspectivas educativas sobre noviazgo, matrimonio y sexualidad de las fuentes",
        "relation": "definiciones, contextos y relaciones atribuidos a los referentes expresamente proporcionados",
        "sourceRecordIds": [
          "b1c028e8-d3ac-5177-bdbe-4ec42ace8b23"
        ],
        "pdfPages": [
          418
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-577d1d0b",
        "grade": 5,
        "label": "las enseñanzas de Jesús a situaciones familiares y sociales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:las[\\s,:]+ensenanzas[\\s,:]+de[\\s,:]+jesus[\\s,:]+a[\\s,:]+situaciones[\\s,:]+familiares[\\s,:]+y[\\s,:]+sociales)(?:\\s+segun\\s+.*)?$",
        "object": "las enseñanzas de Jesús sobre situaciones familiares y sociales según los textos",
        "relation": "afirmaciones, episodios y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "577d1d0b-b1b6-54ee-a4e5-3bd86e7a85d3"
        ],
        "pdfPages": [
          418
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-69b9a21c",
        "grade": 5,
        "label": "el trabajo en el desarrollo de los pueblos",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+trabajo[\\s,:]+en[\\s,:]+el[\\s,:]+desarrollo[\\s,:]+de[\\s,:]+los[\\s,:]+pueblos)(?:\\s+segun\\s+.*)?$",
        "object": "el trabajo en el desarrollo de los pueblos según las fuentes",
        "relation": "actividades, condiciones y aportes documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "69b9a21c-dbe2-59a2-86a5-f06c40367ba2"
        ],
        "pdfPages": [
          418
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-871ea4f6",
        "grade": 5,
        "label": "el sentido espiritual del trabajo",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+sentido[\\s,:]+espiritual[\\s,:]+del[\\s,:]+trabajo)(?:\\s+segun\\s+.*)?$",
        "object": "el sentido espiritual del trabajo según las fuentes",
        "relation": "afirmaciones, contextos y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "871ea4f6-ea4d-5644-9acc-5bfe7227087a"
        ],
        "pdfPages": [
          418
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-61384904",
        "grade": 5,
        "label": "trabajo y creación de Dios",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:trabajo[\\s,:]+y[\\s,:]+creacion[\\s,:]+de[\\s,:]+dios)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre trabajo y creación de Dios según los textos dados",
        "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "61384904-f85b-5898-96c8-bd3425ab688e"
        ],
        "pdfPages": [
          418
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-89511bfd",
        "grade": 5,
        "label": "importancia del trabajo en la vida y la sociedad",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:importancia[\\s,:]+del[\\s,:]+trabajo[\\s,:]+en[\\s,:]+la[\\s,:]+vida[\\s,:]+y[\\s,:]+la[\\s,:]+sociedad)(?:\\s+segun\\s+.*)?$",
        "object": "la importancia del trabajo en vida y sociedad según las fuentes",
        "relation": "actividades, condiciones y aportes documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "89511bfd-ed79-5b89-9744-93f23e1a42c1"
        ],
        "pdfPages": [
          418
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-98d77692",
        "grade": 5,
        "label": "ciencia y tecnología: persona, familia, cultura y religión",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ciencia[\\s,:]+y[\\s,:]+tecnologia[\\s,:]+persona[\\s,:]+familia[\\s,:]+cultura[\\s,:]+y[\\s,:]+religion)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ciencia y tecnología, persona, familia, cultura y religión según las fuentes",
        "relation": "usos, condiciones y efectos documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "98d77692-81fd-5093-a2e1-76ae00f3dec8",
          "96224cd3-ec80-5a41-86f7-e94dabc45e55"
        ],
        "pdfPages": [
          419
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-a4aafa14",
        "grade": 5,
        "label": "juicios éticos sobre las ciencias y las tecnologías",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:juicios[\\s,:]+eticos[\\s,:]+sobre[\\s,:]+las[\\s,:]+ciencias[\\s,:]+y[\\s,:]+las[\\s,:]+tecnologias)(?:\\s+segun\\s+.*)?$",
        "object": "los juicios éticos sobre ciencias y tecnologías según las fuentes",
        "relation": "afirmaciones, fundamentos y consecuencias documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "a4aafa14-c69b-5bc7-88e5-e142b7526936",
          "93261729-8ae7-53b4-9452-e809e2867219"
        ],
        "pdfPages": [
          419
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-be5ff37a",
        "grade": 5,
        "label": "entorno natural y relaciones interpersonales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:entorno[\\s,:]+natural[\\s,:]+y[\\s,:]+relaciones[\\s,:]+interpersonales)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre entorno natural y relaciones interpersonales según las fuentes",
        "relation": "condiciones, interacciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "be5ff37a-4bad-5ea8-9274-448126141652"
        ],
        "pdfPages": [
          419
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-fc0cd10b",
        "grade": 5,
        "label": "estilo de vida de Jesús",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:estilo[\\s,:]+de[\\s,:]+vida[\\s,:]+de[\\s,:]+jesus)(?:\\s+segun\\s+.*)?$",
        "object": "el estilo de vida de Jesús según los textos dados",
        "relation": "acciones, relaciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "fc0cd10b-14ae-5c7f-93fe-c59741472c31"
        ],
        "pdfPages": [
          419
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-8a49ca3f",
        "grade": 5,
        "label": "juventud y estilo de vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:juventud[\\s,:]+y[\\s,:]+estilo[\\s,:]+de[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre juventud y estilos de vida según las fuentes",
        "relation": "condiciones, perspectivas y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "8a49ca3f-d581-5fe9-9e96-a97ff1075b1e"
        ],
        "pdfPages": [
          419
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-089d81bc",
        "grade": 5,
        "label": "cristianismo y testimonio",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:cristianismo[\\s,:]+y[\\s,:]+testimonio)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre cristianismo y testimonio según las fuentes",
        "relation": "afirmaciones, acciones y contextos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "089d81bc-8924-5af7-8656-534ddc534328"
        ],
        "pdfPages": [
          419
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      }
    ],
    "policy": "OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH"
  },
  {
    "id": "formacion-humana-religiosa-comun-6",
    "grade": 6,
    "topics": [
      {
        "id": "gospel-report",
        "grade": 6,
        "label": "reportaje documentado sobre composición de evangelios",
        "match": "reportaje.*(?:composicion|evangelios)",
        "object": "el reportaje sobre {choice} de los evangelios",
        "relation": "los componentes expresamente pedidos y las evidencias atribuidas a los referentes proporcionados",
        "sourceRecordIds": [
          "8f4fef5c-9798-5731-84fb-87f7ae020211"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION",
        "choices": [
          [
            "composicion",
            "composición"
          ],
          [
            "contexto(?: historico)?",
            "contexto histórico"
          ],
          [
            "caracteristicas",
            "características"
          ],
          [
            "veracidad",
            "afirmaciones de veracidad"
          ]
        ],
        "choiceDefault": "los componentes expresamente dados"
      },
      {
        "id": "gospel-comparison",
        "grade": 6,
        "label": "cuadro comparativo de evangelios dados",
        "match": "cuadro comparativo.*evangelios?",
        "object": "el cuadro comparativo de características de los evangelios de {choice}",
        "relation": "dimensiones comunes, semejanzas y diferencias sustentadas en los textos proporcionados",
        "sourceRecordIds": [
          "cb872fbc-36bd-5c6f-97c9-d8ca37ee1459"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION",
        "choices": [
          [
            "(?:cuatro evangelios|(?:y\\s*)?mateo(?:\\s*\\d+)?)",
            "Mateo"
          ],
          [
            "(?:cuatro evangelios|(?:y\\s*)?marcos(?:\\s*\\d+)?)",
            "Marcos"
          ],
          [
            "(?:cuatro evangelios|(?:y\\s*)?lucas(?:\\s*\\d+)?)",
            "Lucas"
          ],
          [
            "(?:cuatro evangelios|(?:y\\s*)?juan(?:\\s*\\d+)?)",
            "Juan"
          ]
        ],
        "choiceDefault": "los autores expresamente trabajados"
      },
      {
        "id": "gospel-emphasis-roundtable",
        "grade": 6,
        "label": "mesa redonda sobre énfasis de evangelistas",
        "match": "mesa redonda.*enfasis.*evangelista",
        "object": "la mesa redonda sobre los énfasis de evangelistas en la vida de Jesús según los textos",
        "relation": "intervenciones, perspectivas y argumentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "1f514664-3ddc-5522-8210-f5dd5549b5cd"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "los énfasis de evangelistas en la vida de Jesús según los textos"
        }
      },
      {
        "id": "new-testament-values",
        "grade": 6,
        "label": "principios de convivencia en escritos del Nuevo Testamento",
        "match": "principios y valores.*convivencia.*nuevo testamento",
        "object": "los principios y valores de convivencia del mensaje de Jesús en los escritos expresamente dados",
        "relation": "afirmaciones, contextos y evidencias atribuidos a {choice}",
        "sourceRecordIds": [
          "f4326f5e-6784-5b35-bcc8-028a69259e04",
          "2a10d83c-7ee1-5026-9794-8c19d36c001d"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "hechos",
            "Hechos"
          ],
          [
            "cartas",
            "las Cartas"
          ],
          [
            "apocalipsis",
            "Apocalipsis"
          ]
        ],
        "choiceDefault": "los escritos expresamente proporcionados"
      },
      {
        "id": "new-testament-map",
        "grade": 6,
        "label": "mapa conceptual de escritos del Nuevo Testamento",
        "match": "mapas? conceptual(?:es)?.*nuevo testamento",
        "object": "el mapa conceptual de los escritos del Nuevo Testamento expresamente trabajados",
        "relation": "{choice} documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "85f88ea4-dbe6-5d75-8bf0-41335be793b7"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION",
        "choices": [
          [
            "fecha",
            "la fecha de composición"
          ],
          [
            "lugar",
            "el lugar de composición"
          ],
          [
            "autores|autoria",
            "la autoría"
          ],
          [
            "intenciones",
            "las intenciones"
          ],
          [
            "destinatarios",
            "los destinatarios"
          ]
        ],
        "choiceDefault": "los componentes expresamente pedidos"
      },
      {
        "id": "christian-conversation-panel",
        "grade": 6,
        "label": "panel documentado de convivencia cristiana",
        "match": "panel.*(?:iglesias|convivencia armonica)",
        "object": "el panel sobre perspectivas cristianas de convivencia armónica y respetuosa según los testimonios",
        "relation": "propósito, preguntas y secuencia de intervenciones fundamentados en los referentes proporcionados",
        "sourceRecordIds": [
          "d2f102e3-9a1d-5299-9c76-ded724e67ede"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "perspectivas cristianas de convivencia armónica y respetuosa según los testimonios"
        }
      },
      {
        "id": "jesus-media-compilation",
        "grade": 6,
        "label": "compilación de medios dados sobre Jesús en cultura",
        "match": "(?:compila|compilacion).*jesus.*cultura",
        "object": "la compilación sobre Jesús en la cultura mediante {choice}",
        "relation": "selección, organización y relación de los medios con las evidencias proporcionadas",
        "sourceRecordIds": [
          "54fa19d2-8a5c-5d47-b038-94838d49ced8"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true,
        "productType": "PORTFOLIO",
        "choices": [
          [
            "ilustraciones",
            "las ilustraciones proporcionadas"
          ],
          [
            "(?:recursos )?audiovisuales",
            "los recursos audiovisuales proporcionados"
          ]
        ],
        "choiceDefault": "los medios expresamente proporcionados"
      },
      {
        "id": "gospel-learning-celebration",
        "grade": 6,
        "label": "celebración de productos sobre mensaje evangélico",
        "match": "celebracion.*mensaje evangelico",
        "object": "la celebración para presentar aprendizajes sobre el mensaje evangélico según los referentes",
        "relation": "propósito, secuencia y relación de productos con las evidencias proporcionadas",
        "sourceRecordIds": [
          "a4305742-b6c6-5ebb-b1bc-bcfe10a4600f"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true
      },
      {
        "id": "jesus-decisions-texts",
        "grade": 6,
        "label": "decisiones de Jesús según textos dados",
        "match": "decisiones.*jesus.*(?:mateo|marcos|juan)(?:\\s*\\d+)?",
        "object": "las decisiones de Jesús descritas en los textos expresamente proporcionados",
        "relation": "episodios, acciones y evidencias atribuidos a {choice}",
        "sourceRecordIds": [
          "c411dde8-d2f9-5797-93a4-1e43d736ef99"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "(?:y\\s*)?mateo(?:\\s*\\d+)?",
            "Mateo"
          ],
          [
            "(?:y\\s*)?marcos(?:\\s*\\d+)?",
            "Marcos"
          ],
          [
            "(?:y\\s*)?lucas(?:\\s*\\d+)?",
            "Lucas"
          ],
          [
            "(?:y\\s*)?juan(?:\\s*\\d+)?",
            "Juan"
          ]
        ],
        "choiceDefault": "los textos expresamente proporcionados"
      },
      {
        "id": "jesus-social-decisions-panel",
        "grade": 6,
        "label": "panel de decisiones atribuidas a Jesús ante casos",
        "match": "panel.*decisiones.*jesus",
        "object": "el panel sobre decisiones atribuidas a Jesús ante las situaciones sociales dadas",
        "relation": "intervenciones, argumentos y fundamentos atribuidos a los textos y casos proporcionados",
        "sourceRecordIds": [
          "10310edb-2e77-5c89-a24b-1c316398f770"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "decisiones atribuidas a Jesús ante las situaciones sociales dadas"
        }
      },
      {
        "id": "jesus-originality",
        "grade": 6,
        "label": "novedad de propuesta de Jesús según Lucas",
        "match": "novedad y originalidad.*propuesta.*jesus",
        "object": "la novedad y originalidad de la propuesta de Jesús según Lucas6:27–36 dado",
        "relation": "afirmaciones, contextos y fundamentos atribuidos al texto proporcionado",
        "sourceRecordIds": [
          "8d83a20b-93ed-5e7f-a2fe-8f14b0abfcd8"
        ],
        "pdfPages": [
          421
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-culture-arguments",
        "grade": 6,
        "label": "argumentos sobre cultura de vida y muerte según fuentes",
        "match": "causas y consecuencias.*cultura.*vida.*muerte",
        "object": "las causas y consecuencias de las denominadas cultura de vida y de muerte según las fuentes",
        "relation": "afirmaciones, contextos y argumentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "892bf135-715f-5718-8cd4-71c3ca0fbaf6"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-institutions",
        "grade": 6,
        "label": "referentes documentados de cultura de vida",
        "match": "(?:instituciones|leyes|iniciativas).*cultura.*vida",
        "object": "los referentes de cultura de vida: {choice}",
        "relation": "funciones, disposiciones y relaciones atribuidas a los referentes dados",
        "sourceRecordIds": [
          "5a90859d-63b2-539a-a845-293a008831c1",
          "3a668ce1-0960-53c2-a0b3-c63ebb303d43"
        ],
        "pdfPages": [
          422,
          423
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "instituciones",
            "las instituciones documentadas"
          ],
          [
            "leyes",
            "las leyes proporcionadas"
          ],
          [
            "iniciativas",
            "las iniciativas documentadas"
          ]
        ],
        "choiceDefault": "los componentes expresamente trabajados"
      },
      {
        "id": "life-culture-celebration",
        "grade": 6,
        "label": "celebración de productos sobre vida y armonía",
        "match": "celebracion.*cultura.*vida.*armonia",
        "object": "la celebración para presentar productos sobre cultura de vida y relaciones armónicas",
        "relation": "propósito, secuencia y relación de productos con las evidencias proporcionadas",
        "sourceRecordIds": [
          "dff2b1d7-18d2-5707-8756-72e9e12b944b"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "problem-solving-values",
        "grade": 6,
        "label": "valores documentados para resolver problemas",
        "match": "valores y actitudes.*(?:resolucion|resolver).*problemas",
        "object": "los valores y actitudes para resolver problemas descritos en los casos educativos",
        "relation": "acciones, condiciones y consecuencias documentadas por los referentes dados",
        "sourceRecordIds": [
          "be8c60de-1261-5e8b-a25d-c80955152c10"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true,
        "excludeWhen": "cristian|biblic"
      },
      {
        "id": "christian-problem-solving",
        "grade": 6,
        "label": "valores cristianos ante problemas según casos",
        "match": "valores y actitudes.*cristian(?:ismo|os).*resolv(?:er|iendo)|valores y actitudes.*cristianismo.*resolucion",
        "object": "los valores y actitudes cristianos ante problemas escolares y familiares según los referentes",
        "relation": "acciones, contextos y evidencias documentados por los casos proporcionados",
        "sourceRecordIds": [
          "1c98f62d-b4b5-5e6d-a821-975702265288"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "biblical-conflict-growth",
        "grade": 6,
        "label": "valores bíblicos ante conflictos y crecimiento comunitario",
        "match": "textos biblicos.*valores.*conflictos|valores.*conflictos.*crecimiento",
        "object": "los valores y actitudes ante conflictos y crecimiento comunitario según los textos dados",
        "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "e77af75c-83d2-5ed2-9c60-dd42beca528b"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "community-solutions-resources",
        "grade": 6,
        "label": "recursos para resolver situaciones y crecimiento comunitario",
        "match": "recursos.*resolucion.*situaciones",
        "object": "los recursos escritos para resolver situaciones y favorecer crecimiento comunitario según los casos",
        "relation": "mensajes, acciones y evidencias sustentados en los referentes proporcionados",
        "sourceRecordIds": [
          "209e09f7-7c54-56d6-a9cb-191b04841bab"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "politics-clientelism",
        "grade": 6,
        "label": "acción política y clientelismo según fuentes",
        "match": "accion politica.*clientelismo",
        "object": "las perspectivas sobre acción política y clientelismo dominicano y su impacto social según las fuentes",
        "relation": "afirmaciones, condiciones y argumentos sustentados en los referentes proporcionados",
        "sourceRecordIds": [
          "9331ebde-a7fe-5a1c-b1df-3f506276a914"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "political-ethics-proclamation",
        "grade": 6,
        "label": "proclama de criterios éticos para política",
        "match": "proclama.*criterios eticos.*politica",
        "object": "la proclama de criterios éticos para política dominicana según los referentes",
        "relation": "afirmaciones, razones y evidencias sustentadas en las fuentes proporcionadas",
        "sourceRecordIds": [
          "4f44a828-df15-58b2-96a6-1de444af2420"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "biblical-phrases-scene-plan",
        "grade": 6,
        "label": "plan de representación de frases bíblicas ante problemas",
        "match": "representacion.*frases biblicas",
        "object": "la representación de frases bíblicas ante problemas personales, familiares y comunitarios de los casos",
        "relation": "propósito, acciones y secuencia sustentados en los textos proporcionados",
        "sourceRecordIds": [
          "fcb95ef1-add6-5c51-a229-4071df43b9a9"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "christian-values-celebration",
        "grade": 6,
        "label": "celebración de productos sobre valores y convivencia",
        "match": "celebracion.*valores cristianos.*convivencia",
        "object": "la celebración para presentar aprendizajes sobre valores cristianos y convivencia según los textos",
        "relation": "propósito, secuencia y relación de productos con los referentes proporcionados",
        "sourceRecordIds": [
          "a273dbeb-b01d-5e5c-bb58-94db91e5d7a4"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "documented-skills",
        "grade": 6,
        "label": "habilidades y cualidades en casos educativos",
        "match": "habilidades.*cualidades.*valores",
        "object": "las habilidades, cualidades, valores y actitudes descritas en los casos educativos",
        "relation": "características, condiciones y relaciones documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "1fcd0d7a-b25f-545f-8fa5-50a452b24e96"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "profession-qualities",
        "grade": 6,
        "label": "cualidades y valores relacionados con profesiones",
        "match": "cualidades.*valores.*profesiones",
        "object": "las cualidades, valores y actitudes relacionados con profesiones y oficios de los referentes",
        "relation": "dimensiones comunes, semejanzas y diferencias sustentadas en los registros proporcionados",
        "sourceRecordIds": [
          "28688ec2-f43c-5c72-9846-d9061ab5d884"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "documented-careers",
        "grade": 6,
        "label": "trayectorias y metas documentadas",
        "match": "personas.*metas.*(?:profesiones|oficio)",
        "object": "las trayectorias, metas, profesiones y oficios de las personas documentadas en los referentes",
        "relation": "acciones, condiciones y resultados descritos por los registros proporcionados",
        "sourceRecordIds": [
          "9f0fb5a5-f9ed-506c-878f-ecf9ffb36e38"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "vocational-factors",
        "grade": 6,
        "label": "factores y criterios de elección vocacional",
        "match": "factores y criterios.*eleccion vocacional",
        "object": "los factores y criterios de elección vocacional según los referentes educativos",
        "relation": "condiciones, alternativas y relaciones documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "bb9b9921-4e2c-5c85-b3ce-9ea3e93719bc"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "career-preferences-project",
        "grade": 6,
        "label": "proyecto sobre preferencias profesionales documentadas",
        "match": "proyecto.*profesiones.*inclinaciones",
        "object": "el proyecto sobre preferencias profesionales e inclinaciones documentadas en el caso educativo",
        "relation": "organización, condiciones y relaciones sustentadas en los registros proporcionados",
        "sourceRecordIds": [
          "052ca1e8-3890-51a8-8fe8-675afeca44bb"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true,
        "productType": "PROJECT"
      },
      {
        "id": "biblical-vocations",
        "grade": 6,
        "label": "vocaciones de personajes bíblicos según textos",
        "match": "vocacion.*(?:abraham|moises|discipulos|pablo)",
        "object": "la vocación de {choice} según los textos dados",
        "relation": "episodios, decisiones y fundamentos atribuidos a los textos proporcionados",
        "sourceRecordIds": [
          "9c0e76ba-b1f7-53fd-88e5-de4e905cc8ca"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "abraham",
            "Abraham"
          ],
          [
            "moises",
            "Moisés"
          ],
          [
            "discipulos",
            "los primeros discípulos"
          ],
          [
            "pablo",
            "Pablo"
          ]
        ],
        "choiceDefault": "los personajes expresamente trabajados"
      },
      {
        "id": "vocation-social-criteria",
        "grade": 6,
        "label": "criterios vocacionales y compromiso social según casos",
        "match": "criterios.*desafios.*eleccion vocacional",
        "object": "los criterios, valores y desafíos de elección vocacional y compromiso social según los casos",
        "relation": "condiciones, alternativas y consecuencias documentadas por los referentes educativos proporcionados",
        "sourceRecordIds": [
          "a88047e5-2d6c-5f4d-9a91-eb8f63926925"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-project-values-table",
        "grade": 6,
        "label": "tabla de valores para proyecto de vida según caso",
        "match": "tabla.*valores.*proyecto de vida",
        "object": "la tabla de valores y actitudes vinculados al proyecto de vida del caso dado",
        "relation": "organización y relaciones justificadas mediante los referentes proporcionados",
        "sourceRecordIds": [
          "bae772c8-23ce-5b46-adaa-ec4759a4d945"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "life-project-case",
        "grade": 6,
        "label": "proyecto de vida formulado para caso educativo",
        "match": "construye.*proyecto de vida|proyecto de vida.*(?:actitudes|capacidades|preferencias)",
        "object": "el proyecto de vida formulado para las condiciones y preferencias del caso educativo",
        "relation": "metas, acciones y condiciones justificadas mediante los referentes proporcionados",
        "sourceRecordIds": [
          "248150e8-e729-5bcb-94db-563cdabca67b"
        ],
        "pdfPages": [
          422
        ],
        "planReferenceOnly": true,
        "productType": "PROJECT",
        "excludeWhen": "tabla|celebracion"
      },
      {
        "id": "realization-values-scene",
        "grade": 6,
        "label": "representación de valores y realización según casos",
        "match": "representa.*valores.*realizacion",
        "object": "el caso proporcionado de acciones y valores que favorecen o desfavorecen realización en los ámbitos dados",
        "relation": "acciones, decisiones y consecuencias reconocibles según las condiciones del caso",
        "sourceRecordIds": [
          "b8b9dc0b-63b1-5f18-a028-3f6e862834ba"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "life-project-celebration",
        "grade": 6,
        "label": "celebración para presentar proyectos de vida dados",
        "match": "celebracion.*proyectos de vida",
        "object": "la celebración para presentar los proyectos de vida proporcionados",
        "relation": "propósito, secuencia y relación de los proyectos con los referentes dados",
        "sourceRecordIds": [
          "5922297a-7e38-5fac-91d3-70f3ba7e46e4"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "technology-data",
        "grade": 6,
        "label": "datos documentados de presencia tecnológica",
        "match": "datos.*presencia.*tecnologia",
        "object": "los datos sobre presencia de tecnología documentados por los referentes",
        "relation": "selección, categorías y relaciones sustentadas en los registros proporcionados",
        "sourceRecordIds": [
          "1fb6b637-dd0b-5870-a84a-d8fb72af5d36"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "science-benefits-verification",
        "grade": 6,
        "label": "beneficios de ciencia y tecnología según registros",
        "match": "beneficios.*ciencia.*tecnologia.*desarrollo humano",
        "object": "los beneficios de ciencia y tecnología para desarrollo humano indicados en el registro dado",
        "relation": "afirmaciones y evidencias verificables según las condiciones del registro proporcionado",
        "sourceRecordIds": [
          "d8c5fcc8-29c7-5d29-ad11-2740714bddb0"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "digital-gap",
        "grade": 6,
        "label": "causas y consecuencias de brecha digital",
        "match": "causas y consecuencias.*brecha digital",
        "object": "las causas y consecuencias de brecha digital y acceso a tecnología según las fuentes",
        "relation": "condiciones, relaciones y argumentos sustentados en los referentes proporcionados",
        "sourceRecordIds": [
          "71e8b156-033d-51a6-8a07-7c285d65ca53"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "social-networks-panel",
        "grade": 6,
        "label": "panel documentado de redes sociales",
        "match": "panel.*(?:riesgos|ventajas|desventajas).*redes sociales",
        "object": "el panel sobre {choice} de redes sociales según los referentes",
        "relation": "propósito, secuencia y relación de intervenciones con las evidencias proporcionadas",
        "sourceRecordIds": [
          "e92ebab5-d817-5700-b1bb-dd55fc96a556"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "riesgos",
            "los riesgos"
          ],
          [
            "ventajas",
            "las ventajas"
          ],
          [
            "desventajas",
            "las desventajas"
          ]
        ],
        "choiceDefault": "los aspectos expresamente pedidos",
        "objects": {
          "DEBATE": "{choice} de redes sociales según los referentes"
        }
      },
      {
        "id": "science-ethics-principles",
        "grade": 6,
        "label": "principios éticos de ciencia y tecnología",
        "match": "principios eticos.*(?:ciencia|tecnologia)",
        "object": "los principios éticos de uso de ciencia y tecnología según los referentes",
        "relation": "normas, fundamentos y consecuencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "2117b170-b1d4-59a9-ab49-d3a2a927d2d4"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "technology-campaign",
        "grade": 6,
        "label": "campaña de oportunidades y riesgos tecnológicos",
        "match": "campana.*oportunidades y riesgos.*tecnolog(?:ia|icos?)",
        "object": "el prototipo de campaña escrita sobre oportunidades y riesgos tecnológicos en {choice}",
        "relation": "mensajes, condiciones y evidencias sustentados en los referentes proporcionados",
        "sourceRecordIds": [
          "d1d362ff-7f33-5a3f-abba-1e04e4280fa8"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION",
        "choices": [
          [
            "familiar",
            "el ámbito familiar"
          ],
          [
            "social",
            "el ámbito social"
          ],
          [
            "laboral",
            "el ámbito laboral"
          ]
        ],
        "choiceDefault": "los contextos expresamente dados"
      },
      {
        "id": "technology-ethics-celebration",
        "grade": 6,
        "label": "organización festiva de productos sobre ética tecnológica",
        "match": "organizacion festiva.*criterios eticos",
        "object": "la organización festiva para presentar productos sobre criterios éticos de ciencia y tecnología",
        "relation": "propósito, secuencia y relación de productos con evidencias de los referentes proporcionados",
        "sourceRecordIds": [
          "51db0265-990b-5769-9b84-548941da6d43"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "jesus-life-nature-scene",
        "grade": 6,
        "label": "escenas evangélicas de defensa de vida y naturaleza",
        "match": "dramatiza.*jesus.*vida.*naturaleza",
        "object": "las escenas de Jesús defendiendo vida y naturaleza según los evangelios dados",
        "relation": "acciones, decisiones y contextos reconocibles de los textos proporcionados",
        "sourceRecordIds": [
          "850a9357-1222-5bbd-9148-103e70739291"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "local-social-ecological-problems",
        "grade": 6,
        "label": "problemas sociales y ecológicos documentados",
        "match": "problematicas sociales y ecologicas",
        "object": "las problemáticas sociales y ecológicas descritas en los referentes locales dados",
        "relation": "condiciones, causas y efectos documentados por las fuentes proporcionadas",
        "sourceRecordIds": [
          "afc1abec-6fa3-58b9-bca2-6d6781ee61bf"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "environmental-deterioration-arguments",
        "grade": 6,
        "label": "causas y consecuencias de deterioro ambiental",
        "match": "causas y consecuencias.*deterioro.*medioambiente",
        "object": "las causas y consecuencias del deterioro medioambiental según las fuentes",
        "relation": "condiciones, relaciones y argumentos sustentados en los referentes proporcionados",
        "sourceRecordIds": [
          "88a300f9-3609-5409-8d57-7c0fc2207cf2"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "sustainability-proposals",
        "grade": 6,
        "label": "alternativas para cuidado y desarrollo sostenible",
        "match": "alternativas.*cuidado.*medioambiente.*desarrollo sostenible",
        "object": "las alternativas de cuidado del medioambiente y desarrollo sostenible del caso dado",
        "relation": "acciones, condiciones y consecuencias justificadas mediante los referentes proporcionados",
        "sourceRecordIds": [
          "11972667-faeb-5f7c-83a5-47c221c925cd"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "environmental-policy-celebration",
        "grade": 6,
        "label": "celebración de productos ambientales documentados",
        "match": "celebracion.*(?:politicas|proyectos|programas).*ambiental(?:es)?",
        "object": "la celebración para presentar {choice} ambientales documentados",
        "relation": "propósito, secuencia y relación de productos con los referentes proporcionados",
        "sourceRecordIds": [
          "40c17fdc-4775-5819-8df2-423e2379751c"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true,
        "choices": [
          [
            "politicas",
            "las políticas"
          ],
          [
            "proyectos",
            "los proyectos"
          ],
          [
            "programas",
            "los programas"
          ]
        ],
        "choiceDefault": "los productos expresamente proporcionados"
      },
      {
        "id": "life-plans-presentation",
        "grade": 6,
        "label": "planes y proyectos de vida documentados",
        "match": "planes y proyectos.*vida",
        "object": "los planes y proyectos de vida descritos en los casos educativos",
        "relation": "metas, acciones y condiciones documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "ade8bd3d-7dc1-51e0-acae-f020e64e64a8"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "beatitudes-art",
        "grade": 6,
        "label": "representación artística de Bienaventuranzas según Mateo",
        "match": "representa.*bienaventuranzas|representacion artistica.*bienaventuranzas",
        "object": "las Bienaventuranzas según Mateo5:3–12 proporcionado",
        "relation": "acciones, relaciones y sentidos reconocibles de los referentes dados",
        "sourceRecordIds": [
          "c6bb307f-bc01-5d4d-9fdc-dcce10096100"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true,
        "objects": {
          "PERFORMANCE": "las Bienaventuranzas según Mateo5:3–12 proporcionado mediante la representación artística solicitada"
        }
      },
      {
        "id": "youth-problems-project",
        "grade": 6,
        "label": "proyecto de alternativas para problema juvenil dado",
        "match": "proyecto.*alternativas.*problema.*(?:jovenes|juvenil|desempleo)",
        "object": "el proyecto de alternativas para {choice}",
        "relation": "metas, acciones, condiciones y consecuencias justificadas por el caso proporcionado",
        "sourceRecordIds": [
          "48bc1ad9-4d1d-52b1-9f18-58975cc50d51"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true,
        "productType": "PROJECT",
        "choices": [
          [
            "desempleo",
            "el desempleo juvenil"
          ],
          [
            "sexualidad",
            "la situación de sexualidad del caso"
          ],
          [
            "tecnologia",
            "la situación tecnológica del caso"
          ],
          [
            "musica",
            "la situación de música del caso"
          ],
          [
            "moda",
            "la situación de moda del caso"
          ],
          [
            "formacion academica",
            "la situación de formación académica del caso"
          ],
          [
            "religion",
            "la situación religiosa del caso"
          ]
        ],
        "choiceDefault": "el problema juvenil expresamente trabajado"
      },
      {
        "id": "jesus-youth-values-panel",
        "grade": 6,
        "label": "panel de valores de Jesús en casos juveniles",
        "match": "panel.*jovenes.*valores.*jesus",
        "object": "el panel sobre valores del estilo de vida de Jesús en los casos juveniles proporcionados",
        "relation": "propósito, secuencia y relación de intervenciones con los referentes dados",
        "sourceRecordIds": [
          "25923dfd-38d8-587b-afac-1ce347f564dc"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true,
        "objects": {
          "DEBATE": "valores del estilo de vida de Jesús en los casos juveniles proporcionados"
        }
      },
      {
        "id": "youth-solidarity-report",
        "grade": 6,
        "label": "reportaje de iniciativas juveniles documentadas",
        "match": "reportaje.*iniciativas y proyectos.*(?:jovenes|juveniles)",
        "object": "el reportaje sobre iniciativas y proyectos juveniles documentados del país y Latinoamérica",
        "relation": "afirmaciones, contextos y evidencias atribuidos a las fuentes proporcionadas",
        "sourceRecordIds": [
          "f8b7a08e-23ef-57b0-a0fd-5f51883cd0d8"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true,
        "productType": "WRITTEN_PRODUCTION"
      },
      {
        "id": "jesus-projects-celebration",
        "grade": 6,
        "label": "celebración de productos sobre enseñanzas y proyectos",
        "match": "celebracion.*ensenanzas.*jesus.*(?:planes|proyectos)",
        "object": "la celebración para presentar productos sobre enseñanzas de Jesús y proyectos juveniles documentados",
        "relation": "propósito, secuencia y relación de los productos con los referentes proporcionados",
        "sourceRecordIds": [
          "2a3e21ef-d8e6-53d8-98be-49837b9123d1"
        ],
        "pdfPages": [
          423
        ],
        "planReferenceOnly": true
      },
      {
        "id": "concept-07c1030f",
        "grade": 6,
        "label": "los evangelios: Conformación y características",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:los[\\s,:]+evangelios[\\s,:]+conformacion[\\s,:]+y[\\s,:]+caracteristicas)(?:\\s+segun\\s+.*)?$",
        "object": "la conformación y características de los evangelios según las fuentes",
        "relation": "composición, contextos y características documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "07c1030f-b0f8-52e6-ad91-a803127e28bc"
        ],
        "pdfPages": [
          421
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-b6c601bc",
        "grade": 6,
        "label": "escritos del Nuevo Testamento",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:escritos[\\s,:]+del[\\s,:]+nuevo[\\s,:]+testamento)(?:\\s+segun\\s+.*)?$",
        "object": "los escritos del Nuevo Testamento expresamente trabajados",
        "relation": "identificación, contextos y mensajes atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "b6c601bc-d30a-5e1f-920e-aed92b37b1f6"
        ],
        "pdfPages": [
          421
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-e62ea6c0",
        "grade": 6,
        "label": "mensajes de Jesús de Nazaret",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:mensajes[\\s,:]+de[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret)(?:\\s+segun\\s+.*)?$",
        "object": "los mensajes de Jesús de Nazaret según los textos dados",
        "relation": "afirmaciones, contextos y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "e62ea6c0-9806-5e74-9788-8780d4e639f9"
        ],
        "pdfPages": [
          421
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-75321787",
        "grade": 6,
        "label": "jerarquía de los valores",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:jerarquia[\\s,:]+de[\\s,:]+los[\\s,:]+valores)(?:\\s+segun\\s+.*)?$",
        "object": "las jerarquías de valores descritas en los referentes educativos",
        "relation": "criterios, relaciones y fundamentos expresamente documentados por las fuentes dadas",
        "sourceRecordIds": [
          "75321787-75ab-5158-bdb7-96c6c9039da1"
        ],
        "pdfPages": [
          421
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-1f70e908",
        "grade": 6,
        "label": "ética y moral en la transformación de la realidad",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:etica[\\s,:]+y[\\s,:]+moral[\\s,:]+en[\\s,:]+la[\\s,:]+transformacion[\\s,:]+de[\\s,:]+la[\\s,:]+realidad)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ética, moral y transformación de la realidad según las fuentes",
        "relation": "afirmaciones, acciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "1f70e908-56ca-5d15-8a81-f4deabf947be"
        ],
        "pdfPages": [
          421
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-253f1db9",
        "grade": 6,
        "label": "cultura de la vida: retos y alternativas",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:cultura[\\s,:]+de[\\s,:]+la[\\s,:]+vida[\\s,:]+retos[\\s,:]+y[\\s,:]+alternativas)(?:\\s+segun\\s+.*)?$",
        "object": "los retos y alternativas de cultura de vida según las fuentes",
        "relation": "perspectivas, condiciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "253f1db9-84f3-58df-973a-60af0fc04e08"
        ],
        "pdfPages": [
          421
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-f459b00a",
        "grade": 6,
        "label": "jesús, fuente de fe y vida cristiana",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:jesus[\\s,:]+fuente[\\s,:]+de[\\s,:]+fe[\\s,:]+y[\\s,:]+vida[\\s,:]+cristiana)(?:\\s+segun\\s+.*)?$",
        "object": "Jesús como fuente de fe y vida cristiana según los textos dados",
        "relation": "afirmaciones, episodios y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "f459b00a-eeca-5932-9df9-2844dd884f0c"
        ],
        "pdfPages": [
          421
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-f3da6b2c",
        "grade": 6,
        "label": "resolución de problemas",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:resolucion[\\s,:]+de[\\s,:]+problemas)(?:\\s+segun\\s+.*)?$",
        "object": "la resolución de problemas según los casos educativos",
        "relation": "condiciones, alternativas y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "f3da6b2c-45be-548f-9154-888322160f3c"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-c3a91f0b",
        "grade": 6,
        "label": "valores y actitudes del cristianismo",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+y[\\s,:]+actitudes[\\s,:]+del[\\s,:]+cristianismo)(?:\\s+segun\\s+.*)?$",
        "object": "los valores y actitudes del cristianismo según los textos dados",
        "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "c3a91f0b-04cd-5f1e-8846-a8f9e4fea8f2"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-fa312225",
        "grade": 6,
        "label": "ética y promoción de la persona",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:etica[\\s,:]+y[\\s,:]+promocion[\\s,:]+de[\\s,:]+la[\\s,:]+persona)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ética y promoción de la persona según las fuentes",
        "relation": "condiciones, acciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "fa312225-a0df-5ef3-af6f-835dbe3f49ec"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-effd1705",
        "grade": 6,
        "label": "política y bien común",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:politica[\\s,:]+y[\\s,:]+bien[\\s,:]+comun)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre política y bien común según las fuentes",
        "relation": "afirmaciones, condiciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "effd1705-6720-5ca7-bffd-f01925bc7454"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-f5768e4a",
        "grade": 6,
        "label": "inclinaciones hacia el trabajo",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:inclinaciones[\\s,:]+hacia[\\s,:]+el[\\s,:]+trabajo)(?:\\s+segun\\s+.*)?$",
        "object": "las inclinaciones hacia el trabajo descritas en los casos educativos",
        "relation": "características, condiciones y relaciones documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "f5768e4a-99d8-5d0f-a0cc-d95401ca07b4"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-18c73a80",
        "grade": 6,
        "label": "el trabajo como continuación de la creación de Dios",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+trabajo[\\s,:]+como[\\s,:]+continuacion[\\s,:]+de[\\s,:]+la[\\s,:]+creacion[\\s,:]+de[\\s,:]+dios)(?:\\s+segun\\s+.*)?$",
        "object": "el trabajo como continuación de la creación de Dios según los textos",
        "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "18c73a80-196a-5783-804e-998e6dbd6c74"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-c6471112",
        "grade": 6,
        "label": "realización personal",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:realizacion[\\s,:]+personal)(?:\\s+segun\\s+.*)?$",
        "object": "la realización personal según los referentes educativos",
        "relation": "perspectivas, condiciones y relaciones documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "c6471112-e78d-5f09-bed9-a7f853378411"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-f6a3b8ae",
        "grade": 6,
        "label": "habilidades y actitudes vinculadas al mundo laboral",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:habilidades[\\s,:]+y[\\s,:]+actitudes[\\s,:]+vinculadas[\\s,:]+al[\\s,:]+mundo[\\s,:]+laboral)(?:\\s+segun\\s+.*)?$",
        "object": "las habilidades y actitudes vinculadas al mundo laboral según los referentes",
        "relation": "características, condiciones y relaciones expresamente documentadas por los casos educativos dados",
        "sourceRecordIds": [
          "f6a3b8ae-b5ad-535a-8d5d-3e0c53588448"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-7120c606",
        "grade": 6,
        "label": "proyecto de vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:proyecto[\\s,:]+de[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "el proyecto de vida según los referentes educativos",
        "relation": "metas, acciones y condiciones documentadas por los casos proporcionados",
        "sourceRecordIds": [
          "7120c606-7048-5fd3-a7af-dc4023d67cfd"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-c28278f5",
        "grade": 6,
        "label": "ciencia, tecnología y calidad de vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ciencia[\\s,:]+tecnologia[\\s,:]+y[\\s,:]+calidad[\\s,:]+de[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ciencia, tecnología y calidad de vida según las fuentes",
        "relation": "aportes, condiciones y efectos documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "c28278f5-a426-5008-9f61-553c492836d2"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-0f3a92b8",
        "grade": 6,
        "label": "ética, avances científicos y tecnológicos",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:etica[\\s,:]+avances[\\s,:]+cientificos[\\s,:]+y[\\s,:]+tecnologicos)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ética y avances científicos y tecnológicos según las fuentes",
        "relation": "afirmaciones, condiciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "0f3a92b8-3752-583e-8b4c-94b1f61b48e2"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-760a44e0",
        "grade": 6,
        "label": "ciencia, tecnología y relaciones interpersonales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ciencia[\\s,:]+tecnologia[\\s,:]+y[\\s,:]+relaciones[\\s,:]+interpersonales)(?:\\s+segun\\s+.*)?$",
        "object": "la relación entre ciencia, tecnología y relaciones interpersonales según las fuentes",
        "relation": "usos, condiciones y efectos documentados por los referentes proporcionados",
        "sourceRecordIds": [
          "760a44e0-068a-59ff-ad86-85f9af2d5463"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-df47eaca",
        "grade": 6,
        "label": "redes sociales: ventajas y desventajas",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:redes[\\s,:]+sociales[\\s,:]+ventajas[\\s,:]+y[\\s,:]+desventajas)(?:\\s+segun\\s+.*)?$",
        "object": "las ventajas y desventajas de redes sociales según los referentes educativos",
        "relation": "usos, condiciones y consecuencias documentadas por las fuentes proporcionadas",
        "sourceRecordIds": [
          "df47eaca-6627-58ce-a1fb-1605857bf507"
        ],
        "pdfPages": [
          422
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-842e6365",
        "grade": 6,
        "label": "iniciativas para la defensa de la casa común",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:iniciativas[\\s,:]+para[\\s,:]+la[\\s,:]+defensa[\\s,:]+de[\\s,:]+la[\\s,:]+casa[\\s,:]+comun)(?:\\s+segun\\s+.*)?$",
        "object": "las iniciativas de defensa de la casa común según las fuentes",
        "relation": "acciones, condiciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "842e6365-d1ef-5d6c-83bc-924164e92b8c"
        ],
        "pdfPages": [
          423
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-bafa16be",
        "grade": 6,
        "label": "políticas ambientales",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:politicas[\\s,:]+ambientales)(?:\\s+segun\\s+.*)?$",
        "object": "las políticas ambientales según los documentos dados",
        "relation": "disposiciones, contextos y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "bafa16be-982f-50a1-801f-9204042d2655"
        ],
        "pdfPages": [
          423
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-fc83c758",
        "grade": 6,
        "label": "desarrollo sostenible",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:desarrollo[\\s,:]+sostenible)(?:\\s+segun\\s+.*)?$",
        "object": "el desarrollo sostenible según las fuentes",
        "relation": "condiciones, acciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "fc83c758-b7fb-56f3-bb18-c8816c5ae0fd"
        ],
        "pdfPages": [
          423
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-e1f1e93a",
        "grade": 6,
        "label": "promoción y respeto a vida y al entorno natural",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:promocion[\\s,:]+y[\\s,:]+respeto[\\s,:]+a[\\s,:]+vida[\\s,:]+y[\\s,:]+al[\\s,:]+entorno[\\s,:]+natural)(?:\\s+segun\\s+.*)?$",
        "object": "la promoción y respeto de vida y entorno natural según las fuentes",
        "relation": "acciones, condiciones y consecuencias documentadas por los referentes proporcionados",
        "sourceRecordIds": [
          "e1f1e93a-1d00-56dd-b3ce-8d190b277b0c"
        ],
        "pdfPages": [
          423
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-67d47931",
        "grade": 6,
        "label": "valores del estilo de vida de Jesús",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+del[\\s,:]+estilo[\\s,:]+de[\\s,:]+vida[\\s,:]+de[\\s,:]+jesus)(?:\\s+segun\\s+.*)?$",
        "object": "los valores del estilo de vida de Jesús según los textos dados",
        "relation": "acciones, relaciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "67d47931-7be7-5305-8800-eaaae9cc128a"
        ],
        "pdfPages": [
          423
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-ab2c0acc",
        "grade": 6,
        "label": "planes y proyectos de vida",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:planes[\\s,:]+y[\\s,:]+proyectos[\\s,:]+de[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
        "object": "los planes y proyectos de vida según los referentes educativos",
        "relation": "metas, acciones y condiciones documentadas por los casos proporcionados",
        "sourceRecordIds": [
          "ab2c0acc-11a7-5db9-b6ac-6938edaa1820"
        ],
        "pdfPages": [
          423
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-0d98d64f",
        "grade": 6,
        "label": "las Bienaventuranzas",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:las[\\s,:]+bienaventuranzas)(?:\\s+segun\\s+.*)?$",
        "object": "las Bienaventuranzas según los textos proporcionados",
        "relation": "afirmaciones, contextos y fundamentos atribuidos a los referentes dados",
        "sourceRecordIds": [
          "0d98d64f-86c2-509d-8d05-5ce4f8f39ce6"
        ],
        "pdfPages": [
          423
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      },
      {
        "id": "concept-0d4526ff",
        "grade": 6,
        "label": "compromiso y seguimiento de Jesucristo",
        "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:compromiso[\\s,:]+y[\\s,:]+seguimiento[\\s,:]+de[\\s,:]+jesucristo)(?:\\s+segun\\s+.*)?$",
        "object": "el compromiso y seguimiento de Jesucristo según los textos dados",
        "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
        "sourceRecordIds": [
          "0d4526ff-420a-5a26-a0b7-be294fa5e116"
        ],
        "pdfPages": [
          423
        ],
        "conceptBrief": true,
        "planReferenceOnly": true
      }
    ],
    "policy": "OBSERVABLE_INTERPRETATION_AND_PRODUCTS_NOT_PRIVATE_FAITH"
  }
]} as unknown as EvaluationCatalog
