import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV134 } from './catalog-v134'
/** Exact135 payload checked against Development, including the reviewed HCS sixth-grade citizenship metadata. */
export const evaluationCatalogV135={...evaluationCatalogV134,optativeSocialModules:[
  {
    "id": "optativa-hcs-soc-4",
    "grade": 4,
    "subjectCode": "OPT-HCS-SOC-4",
    "subjectName": "Filosofía social y Pensamiento Dominicano",
    "optativeExitName": "Humanidades y Ciencias Sociales",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "817c41b1-f690-5afe-bbf5-b438791bf45c",
    "pdfPages": [
      482,
      483,
      484
    ],
    "topics": [
      {
        "id": "philosophy-foundations",
        "grade": 4,
        "label": "la filosofía",
        "match": "filosof(?:ia|ic[ao]s?)|concepto de filosofia|funcion de la filosofia|origenes de la filosofia",
        "relation": "las ideas y relaciones expresamente pedidas sobre {target}, según las preguntas y razones del material proporcionado",
        "sourceRecordIds": [
          "d81dd9c9-6deb-5499-b733-11f94ff0e14f",
          "b79dc910-692b-5dbb-bb47-edfb4f79eb4c",
          "2c0698a2-769e-58da-b492-0679b9ce7fe4",
          "3f30df1c-bcb8-55a5-917c-bce5791c60e4",
          "b2e5b670-b7d3-519d-a0c3-f0b844187b93",
          "40b0da79-c1c0-5e3c-941e-1961cfa81235",
          "b425958b-5a6f-590d-8318-62547efc0a8d",
          "9436270d-addd-5cb9-a320-0251b084abff",
          "018ed93a-24de-54a9-9292-1c9ab49f419d",
          "c358bc9b-9482-5a6e-aad4-ffd7268c9dd4",
          "7c9fa6c9-0abd-50fa-81ab-286fb751fdaf",
          "abaf7a67-9bda-5e36-b268-f56338a1e991"
        ],
        "pages": [
          482,
          483
        ],
        "priority": 1,
        "facets": [
          {
            "label": "el concepto de filosofía",
            "match": "\\bconcepto\\b"
          },
          {
            "label": "la función de la filosofía",
            "match": "\\bfuncion\\b"
          },
          {
            "label": "los orígenes de la filosofía",
            "match": "origenes (?:de (?:la )?)?filosofia"
          },
          {
            "label": "la admiración y la duda en los orígenes de la filosofía y el paso del mito al conocimiento racional",
            "match": "admiracion.*duda"
          },
          {
            "label": "las tendencias actuales de la filosofía social",
            "match": "tendencias actuales"
          }
        ]
      },
      {
        "id": "human-reflection",
        "grade": 4,
        "label": "la reflexión filosófica sobre el ser humano",
        "match": "filosofia y (?:el )?ser humano|filosofia y ser humano|reflexion filosofica sobre (?:el )?ser humano|relacion entre filosofia y ser humano",
        "relation": "las preguntas y razones de {target} en el caso o fragmento dado",
        "sourceRecordIds": [
          "22dfc55e-e76d-50b7-80f6-7a0532c26172",
          "5eca6d98-5124-5d8e-98b7-a721a587f55a",
          "bc63ecc8-1b2e-5ac0-b19f-6b644c3b2d21",
          "105a3a65-0485-52c3-855f-a8f9bd521bee"
        ],
        "pages": [
          482
        ],
        "priority": 30
      },
      {
        "id": "anthropology",
        "grade": 4,
        "label": "los problemas antropológicos de la filosofía",
        "match": "antropolog|existencialismo|planteamientos sobre el ser humano|interpretaciones filosoficas.*ser humano",
        "relation": "los supuestos y argumentos de {target} en los planteamientos seleccionados del material dado",
        "sourceRecordIds": [
          "972bdaac-91a3-59e1-b6ce-706dac1ec306",
          "23ed5e24-177c-5290-9976-72a3f7541416",
          "a7a2ee73-6f92-5cd1-b00e-aa8eba573458",
          "02048792-f092-507e-abd1-60778d266d86",
          "d31202dc-414e-5c6f-918c-39951a2e074b",
          "0612b709-9077-5fe5-8e29-8bbb6970b109",
          "a91d76e0-6a50-547f-b216-3ba61ce8cf4a"
        ],
        "pages": [
          482,
          484
        ],
        "priority": 75,
        "facets": [
          {
            "label": "el existencialismo y el ser humano",
            "match": "existencialismo"
          },
          {
            "label": "las explicaciones antropológicas griegas",
            "match": "\\bgrieg[ao]s?\\b"
          },
          {
            "label": "las explicaciones antropológicas modernas",
            "match": "\\bmodern[ao]s?\\b"
          },
          {
            "label": "las explicaciones antropológicas postmodernas",
            "match": "\\bpostmodern[ao]s?\\b"
          },
          {
            "label": "las explicaciones antropológicas contemporáneas",
            "match": "\\bcontemporane[ao]s?\\b"
          },
          {
            "label": "los planteamientos antropológicos de los autores renacentistas",
            "match": "renacentistas"
          }
        ]
      },
      {
        "id": "culture",
        "grade": 4,
        "label": "cultura e interculturalidad",
        "match": "\\bcultura\\b|multicultur|intercultur",
        "relation": "las relaciones y diferencias de {target} en el caso dado, sin jerarquizar culturas ni exigir adhesión personal",
        "sourceRecordIds": [
          "69458d47-ec67-5baa-81c5-7056fd86c249",
          "874483d6-3c8d-5138-a436-3d5445aa97e0"
        ],
        "pages": [
          482,
          484
        ],
        "priority": 75,
        "facets": [
          {
            "label": "la cultura",
            "match": "\\bcultura\\b"
          },
          {
            "label": "la multiculturalidad",
            "match": "multicultur"
          },
          {
            "label": "la interculturalidad",
            "match": "intercultur"
          }
        ]
      },
      {
        "id": "knowledge",
        "grade": 4,
        "label": "las concepciones filosóficas del conocimiento",
        "match": "conocimiento|escuelas filosoficas|racionalismo|empirismo|idealismo|kant",
        "relation": "los criterios, fundamentos o límites expresamente pedidos de {target} según las posiciones seleccionadas en los textos",
        "sourceRecordIds": [
          "13e7a524-b3f3-589f-9f9c-8e38067b19df",
          "74338c04-2f49-5282-bcc3-a3f86d965489",
          "b87c5623-b686-5e9e-a438-630cb549241b",
          "c1484fa0-523f-5e0b-8bb6-3d104d0b1016",
          "2aa03d98-bc20-52dd-8c37-8c193cf68b42",
          "7970c492-e1ff-5071-a918-414356dc1d9c",
          "1281ad3d-ad0d-55fa-bcd9-3d4be3550621",
          "b79fd02e-5219-5316-b0c7-d14d74bdf37d"
        ],
        "pages": [
          482,
          483,
          484
        ],
        "priority": 65,
        "facets": [
          {
            "label": "el racionalismo",
            "match": "racionalismo"
          },
          {
            "label": "el empirismo",
            "match": "empirismo"
          },
          {
            "label": "el idealismo",
            "match": "idealismo"
          },
          {
            "label": "la crítica de Kant",
            "match": "kant"
          },
          {
            "label": "las escuelas filosóficas griegas",
            "match": "\\bgriegas\\b"
          },
          {
            "label": "las escuelas filosóficas medievales",
            "match": "\\bmedievales\\b"
          },
          {
            "label": "las escuelas filosóficas modernas",
            "match": "\\bmodernas\\b"
          },
          {
            "label": "las escuelas filosóficas contemporáneas",
            "match": "\\bcontemporaneas\\b"
          },
          {
            "label": "la dimensión histórica del conocimiento",
            "match": "dimensiones? historica"
          },
          {
            "label": "la dimensión social del conocimiento",
            "match": "dimensiones? social|historica y social"
          },
          {
            "label": "los aportes de la filosofía al análisis crítico de la realidad y al conocimiento",
            "match": "analisis critico de la realidad"
          }
        ]
      },
      {
        "id": "enlightenment",
        "grade": 4,
        "label": "la Ilustración",
        "match": "ilustracion",
        "relation": "las ideas y los argumentos de {target} que presenta el material proporcionado, sin exigir una adhesión ideológica",
        "sourceRecordIds": [
          "10c5d825-6254-5f4f-b4ed-c8ce9ac108e7"
        ],
        "pages": [
          482
        ],
        "priority": 80
      },
      {
        "id": "modern-consciousness",
        "grade": 4,
        "label": "la conciencia moderna",
        "match": "conciencia moderna",
        "relation": "las concepciones y los supuestos de {target} en los fragmentos dados",
        "sourceRecordIds": [
          "85b360f4-b73f-585d-b4df-92086d38de38"
        ],
        "pages": [
          482
        ],
        "priority": 80
      },
      {
        "id": "classical-philosophy",
        "grade": 4,
        "label": "los aportes de los filósofos griegos seleccionados",
        "match": "presocratic|socrates|platon|aristoteles|aportes de los filosofos griegos",
        "relation": "los aportes o planteamientos expresamente pedidos de {target} según los fragmentos proporcionados",
        "sourceRecordIds": [
          "feba64c5-f6f0-5460-a121-78050c2db893"
        ],
        "pages": [
          482
        ],
        "priority": 50,
        "facets": [
          {
            "label": "los presocráticos",
            "match": "presocratic"
          },
          {
            "label": "Sócrates",
            "match": "socrates"
          },
          {
            "label": "Platón",
            "match": "platon"
          },
          {
            "label": "Aristóteles",
            "match": "aristoteles"
          }
        ]
      },
      {
        "id": "virtue",
        "grade": 4,
        "label": "la virtud y el ser humano",
        "match": "virtud|sofistas",
        "relation": "los planteamientos sobre virtud o ser humano de {target} en los textos dados",
        "sourceRecordIds": [
          "d5ab7e02-751d-5243-bc2e-934eebca0f06",
          "439386c5-cba9-57c4-b0e6-4307c17bcbbe"
        ],
        "pages": [
          482,
          484
        ],
        "priority": 90,
        "facets": [
          {
            "label": "Sócrates",
            "match": "socrates"
          },
          {
            "label": "los sofistas",
            "match": "sofistas"
          }
        ]
      },
      {
        "id": "ethics",
        "grade": 4,
        "label": "ética y moral",
        "match": "etica|moral",
        "relation": "los conceptos, supuestos y razones expresamente pedidos de {target} según los textos o el caso dado, distinguiendo análisis y valoración personal",
        "sourceRecordIds": [
          "156cb738-87c9-547d-b74c-440751848e24",
          "28cbdab5-d92c-5576-951f-481047b6d04c",
          "46539549-9e8b-5122-9488-89812df4b384",
          "d31202dc-414e-5c6f-918c-39951a2e074b",
          "e23efd57-b1a2-5ad6-b901-78e55f2911ab",
          "5ca6c473-689a-5e07-9f37-48e11dfa06d3",
          "22993990-df21-5d6b-b2de-6019f319b449"
        ],
        "pages": [
          482,
          483,
          484
        ],
        "priority": 70,
        "facets": [
          {
            "label": "la ética",
            "match": "etica"
          },
          {
            "label": "la moral",
            "match": "moral"
          },
          {
            "label": "la responsabilidad ética del personaje del caso",
            "match": "responsabilidad etica"
          },
          {
            "label": "los planteamientos éticos de los autores griegos",
            "match": "\\bgrieg[ao]s?\\b"
          },
          {
            "label": "los planteamientos éticos de los autores medievales",
            "match": "\\bmedieval(?:es)?\\b"
          },
          {
            "label": "los planteamientos éticos de los autores modernos",
            "match": "\\bmodern[ao]s?\\b"
          },
          {
            "label": "los planteamientos éticos de los autores contemporáneos",
            "match": "\\bcontemporane[ao]s?\\b"
          }
        ]
      },
      {
        "id": "human-rights-philosophy",
        "grade": 4,
        "label": "los derechos humanos",
        "match": "derechos humanos|dignidad humana",
        "relation": "los derechos, condiciones y razones filosóficas de {target} aplicables al caso ficticio, sin exigir experiencias privadas",
        "sourceRecordIds": [
          "25c407ec-88b4-584f-983e-6d12c507609d",
          "316a07c9-8133-5ddb-be44-b8706d91cc84"
        ],
        "pages": [
          482,
          484
        ],
        "priority": 90
      },
      {
        "id": "other-knowledge",
        "grade": 4,
        "label": "la filosofía y otros saberes",
        "match": "otros saberes|saber cotidiano|conocimiento cotidiano",
        "relation": "las diferencias y relaciones expresamente pedidas de {target}, según los ejemplos del material dado",
        "sourceRecordIds": [
          "33c2f06e-d790-5206-8e47-a1c4797a894a",
          "fe1e7163-f528-530a-9bc6-11a7c58b92e7"
        ],
        "pages": [
          482,
          483
        ],
        "priority": 80,
        "facets": [
          {
            "label": "el saber cotidiano",
            "match": "saber cotidiano|conocimiento cotidiano"
          }
        ]
      },
      {
        "id": "science-philosophy",
        "grade": 4,
        "label": "la filosofía de la ciencia",
        "match": "\\bciencia\\b|\\bcientific[ao]s?\\b",
        "relation": "los aportes o discusiones expresamente pedidos de {target}, distinguiendo los argumentos filosóficos y las explicaciones científicas del material dado",
        "sourceRecordIds": [
          "edba6f29-8caf-5da6-a254-b2809024c54f",
          "463d70e8-b1a0-515f-a380-4fdf8e22b657",
          "ca209422-ca49-5e98-b8fa-801d4e62e050",
          "6de6cbcd-6b58-5747-96ff-6a43120394df",
          "8c648f52-e180-5595-b5c1-862f75425ca8",
          "6efe05b1-733b-59bb-bc8e-d399e8c151ae"
        ],
        "pages": [
          482,
          483,
          484
        ],
        "priority": 85,
        "facets": [
          {
            "label": "los aportes de los filósofos griegos a la ciencia",
            "match": "filosofos griegos.*ciencia"
          },
          {
            "label": "los aportes de los filósofos modernos a la ciencia",
            "match": "filosofos modernos.*cientifico|filosofos modernos.*ciencia"
          },
          {
            "label": "las discusiones del siglo XX sobre filosofía de la ciencia",
            "match": "siglo xx"
          }
        ]
      },
      {
        "id": "myth-logos",
        "grade": 4,
        "label": "el paso del mito al logos",
        "match": "mito|logos",
        "relation": "las diferencias y el cambio en las formas de explicación de {target} según los ejemplos y argumentos dados",
        "sourceRecordIds": [
          "2bd63b98-ab3b-5e4b-a627-9421309aae77",
          "c358bc9b-9482-5a6e-aad4-ffd7268c9dd4"
        ],
        "pages": [
          482,
          483
        ],
        "priority": 95,
        "facets": [
          {
            "label": "el paso del mito al logos y los aportes de los presocráticos",
            "match": "presocratic"
          }
        ]
      },
      {
        "id": "political-power",
        "grade": 4,
        "label": "las concepciones filosóficas del poder",
        "match": "politic|\\bpoder\\b|autoritar|democrat|maquiavelo|hobbes|rousseau",
        "relation": "las posiciones y las implicaciones sociales expresamente pedidas de {target}, según los fragmentos o el caso ficticio dado",
        "sourceRecordIds": [
          "033e2f7f-5e3d-5e2c-b2e7-b44850370e12",
          "439386c5-cba9-57c4-b0e6-4307c17bcbbe",
          "1d85e053-2f04-5795-831e-3a8b45997a8b",
          "0cdfb01e-bdbc-5c9d-9d58-7c97e7d2fb15"
        ],
        "pages": [
          482,
          484
        ],
        "priority": 95,
        "facets": [
          {
            "label": "Sócrates",
            "match": "socrates"
          },
          {
            "label": "los sofistas",
            "match": "sofistas"
          },
          {
            "label": "Platón",
            "match": "platon"
          },
          {
            "label": "Aristóteles",
            "match": "aristoteles"
          },
          {
            "label": "San Agustín",
            "match": "san agustin|agustin"
          },
          {
            "label": "Santo Tomás de Aquino",
            "match": "tomas de aquino"
          },
          {
            "label": "Maquiavelo",
            "match": "maquiavelo|\\bprincipe\\b"
          },
          {
            "label": "Hobbes",
            "match": "hobbes|leviatan"
          },
          {
            "label": "Rousseau",
            "match": "rousseau|contrato social"
          },
          {
            "label": "el caso elegido de violencia, corrupción o autoritarismo",
            "match": "solucion.*violencia.*corrupcion.*autoritarismo"
          }
        ]
      },
      {
        "id": "philosophical-methods",
        "grade": 4,
        "label": "los métodos filosóficos solicitados",
        "match": "mayeutic|\\bsocratic[ao]s?\\b|duda metodica|epoje|metodos filosoficos",
        "relation": "los pasos, supuestos y alcances de {target} aplicados al caso dado",
        "sourceRecordIds": [
          "8f2017dd-af22-5a8a-8793-13cd7861997e",
          "077dd44e-d1f3-5fb3-9748-2ea9984d3e9b"
        ],
        "pages": [
          482,
          484
        ],
        "priority": 110,
        "facets": [
          {
            "label": "la mayéutica",
            "match": "mayeutic|dialogo socratico",
            "procedure": "Las preguntas examinan las respuestas y permiten revisar sus supuestos."
          },
          {
            "label": "la duda metódica",
            "match": "duda metodica",
            "procedure": "Distingue la duda metódica sobre las razones del caso de una negación sin examen."
          },
          {
            "label": "la epojé",
            "match": "epoje",
            "procedure": "Distingue la suspensión del juicio de una conclusión definitiva sobre el caso."
          }
        ]
      },
      {
        "id": "globalization",
        "grade": 4,
        "label": "la globalización y sus implicaciones",
        "match": "globaliz|mundo global",
        "relation": "las posiciones y las implicaciones expresamente pedidas de {target} según los argumentos, datos o casos proporcionados",
        "sourceRecordIds": [
          "258b5ed4-437c-530f-8be2-425d622be7cc",
          "26592ac7-e9f5-5415-abdc-7e5b6eec151a",
          "de88f260-600e-5a08-ad74-8bd2e972a9da",
          "afe97dc3-a391-5ffc-85b0-0df0e76962e1",
          "8909ae07-3ce1-5430-9bf9-12c660714c49",
          "874483d6-3c8d-5138-a436-3d5445aa97e0",
          "2c75fd7a-d1b4-55cd-b4e4-92f5d7234d3b",
          "70f110f6-9f76-54ff-af8a-c86920dc3fb4",
          "342ea412-e5c0-58fa-9f01-1512f549f925"
        ],
        "pages": [
          483,
          484
        ],
        "priority": 85,
        "facets": [
          {
            "label": "la globalización",
            "match": "globaliz|mundo global"
          }
        ]
      },
      {
        "id": "environment-quality",
        "grade": 4,
        "label": "las posiciones filosóficas sobre calidad de vida y medioambiente",
        "match": "calidad de vida|medioambiente|medio ambiente|pobreza|violencia|migracion",
        "relation": "las razones y las implicaciones de {target} expresamente seleccionadas en los textos o casos ficticios",
        "sourceRecordIds": [
          "8f6312dc-5506-5225-83ea-67967b1e4bea",
          "de88f260-600e-5a08-ad74-8bd2e972a9da",
          "89a2f4b3-301d-545a-ab8f-4dd59529fc18",
          "70f110f6-9f76-54ff-af8a-c86920dc3fb4",
          "342ea412-e5c0-58fa-9f01-1512f549f925"
        ],
        "pages": [
          482,
          483,
          484
        ],
        "priority": 60,
        "facets": [
          {
            "label": "la calidad de vida",
            "match": "calidad de vida"
          },
          {
            "label": "el medioambiente",
            "match": "medioambiente|medio ambiente"
          },
          {
            "label": "la pobreza",
            "match": "pobreza"
          },
          {
            "label": "la violencia",
            "match": "violencia"
          },
          {
            "label": "las migraciones",
            "match": "migracion"
          }
        ]
      },
      {
        "id": "religion-philosophy",
        "grade": 4,
        "label": "las cosmovisiones filosóficas sobre la religión",
        "match": "religion|cosmovision|divinidad",
        "relation": "las concepciones y relaciones expresamente pedidas de {target} según las posiciones seleccionadas, sin evaluar la fe personal",
        "sourceRecordIds": [
          "88ddf99d-213b-5c75-900f-675a452d5f8a",
          "6182ed8e-634b-5c0e-87d8-f9ed96a0b6f4",
          "ad31961e-792d-530d-9b85-c89884f3c0a8",
          "52e350a0-b0f1-5ae2-a712-842f82d0cdc5",
          "d2acf20e-e8d2-5877-a6e0-bbfbb52431a8",
          "47464961-4492-534a-a296-3ee15d245379"
        ],
        "pages": [
          483,
          484
        ],
        "priority": 80,
        "facets": [
          {
            "label": "los campos de conocimiento que aborda la filosofía al estudiar la religión",
            "match": "campos de (?:conocimiento|estudio)"
          },
          {
            "label": "las concepciones del ser humano y la divinidad en las religiones seleccionadas",
            "match": "ser humano y la divinidad"
          },
          {
            "label": "las cosmovisiones griegas",
            "match": "\\bgrieg[ao]s?\\b"
          },
          {
            "label": "las cosmovisiones medievales",
            "match": "\\bmedieval(?:es)?\\b"
          },
          {
            "label": "las cosmovisiones modernas",
            "match": "\\bmodern[ao]s?\\b"
          },
          {
            "label": "las cosmovisiones contemporáneas",
            "match": "\\bcontemporane[ao]s?\\b"
          }
        ]
      },
      {
        "id": "spiritual-dimension",
        "grade": 4,
        "label": "la dimensión espiritual del ser humano",
        "match": "dimension espiritual",
        "relation": "las interpretaciones filosóficas de {target} en las posiciones dadas, sin solicitar vivencias privadas",
        "sourceRecordIds": [
          "fade7c76-9070-584e-bc2d-5b83c76a4148",
          "07973769-24a8-5c9a-8b03-f906ba9431ff"
        ],
        "pages": [
          483
        ],
        "priority": 100
      },
      {
        "id": "faith-reason",
        "grade": 4,
        "label": "la fe y la razón en las posiciones filosóficas",
        "match": "fe y razon|fe, razon|fe y la razon|teocentric|antropocentric|controversias medievales",
        "relation": "las relaciones, diferencias y argumentos de {target} según los fragmentos dados, sin una creencia o religión correcta impuesta",
        "sourceRecordIds": [
          "5ea3788e-3e0d-5911-9f2f-4ad76874cd15",
          "fe693577-4929-58e9-a6da-9b11825bb147"
        ],
        "pages": [
          483
        ],
        "priority": 105,
        "facets": [
          {
            "label": "la relación entre fe y razón",
            "match": "fe y (?:la )?razon|fe, razon"
          },
          {
            "label": "la visión teocéntrica",
            "match": "teocentric"
          },
          {
            "label": "la visión antropocéntrica",
            "match": "antropocentric"
          }
        ]
      }
    ],
    "evidence": {
      "interpretation": {
        "title": "Comprensión de {label}",
        "weight": 4,
        "levels": [
          "Explica {relation}, distinguiendo lo que sostiene el texto de su propia interpretación.",
          "La explicación conserva las ideas y relaciones principales de {label}; una referencia necesita precisarse.",
          "Menciona ideas pertinentes de {label}, pero no explica una relación necesaria entre ellas.",
          "Atribuye a {label} una idea o relación incompatible con el material proporcionado.",
          "No aporta una explicación reconocible del contenido solicitado de {label}."
        ]
      },
      "identification": {
        "title": "Identificación de {label}",
        "weight": 3,
        "levels": [
          "Identifica las ideas o elementos solicitados de {label} mediante rasgos reconocibles en el material proporcionado.",
          "Identifica los elementos principales de {label}; una selección necesita precisarse para distinguirla de otra.",
          "Identifica parte de los elementos de {label}, sin distinguir un rasgo necesario del contenido solicitado.",
          "Asigna a {label} nombres o características incompatibles con el material dado.",
          "No identifica los elementos solicitados de {label}."
        ]
      },
      "comparison": {
        "title": "Comparación de {label}",
        "weight": 4,
        "levels": [
          "Compara las posiciones o casos solicitados de {label} mediante los criterios pedidos, haciendo explícitas sus semejanzas y diferencias según el material dado.",
          "Compara las posiciones pertinentes de {label}; una semejanza o diferencia necesita justificarse mejor.",
          "Enumera rasgos pertinentes de {label}, pero no los relaciona mediante un criterio común.",
          "Atribuye a {label} semejanzas o diferencias incompatibles con los planteamientos dados.",
          "No presenta una comparación reconocible de las posiciones solicitadas de {label}."
        ]
      },
      "source-evidence": {
        "title": "Respaldo de las interpretaciones de {label}",
        "weight": 4,
        "levels": [
          "Relaciona su interpretación de {label} con evidencias localizables del material dado y distingue lo que afirma la fuente de sus inferencias.",
          "La interpretación de {label} tiene respaldo localizable; una atribución necesita precisarse.",
          "Usa ideas pertinentes de {label}, pero una inferencia central carece de respaldo localizable.",
          "Atribuye a las fuentes sobre {label} afirmaciones ausentes o incompatibles con su contenido.",
          "No aporta respaldo del material dado para la interpretación de {label}."
        ]
      },
      "source-selection": {
        "title": "Selección de fuentes sobre {label}",
        "weight": 3,
        "levels": [
          "Selecciona entre las fuentes dadas las pertinentes para la pregunta sobre {label}, conservando la correspondencia entre la selección y su contenido.",
          "La selección es pertinente a {label}; una fuente necesita ajustarse al alcance de la pregunta.",
          "Incluye fuentes pertinentes a {label}, pero mezcla una que no responde a la pregunta dada.",
          "Selecciona fuentes incompatibles con el objeto o la pregunta sobre {label}.",
          "No presenta una selección reconocible de las fuentes solicitadas sobre {label}."
        ]
      },
      "source-credibility": {
        "title": "Confiabilidad y procedencia de las fuentes",
        "weight": 4,
        "levels": [
          "Relaciona la elección de fuentes sobre {label} con la autoría, procedencia o respaldo expresamente pedidos de las fichas dadas.",
          "La elección de fuentes sobre {label} tiene respaldo pertinente; un criterio de procedencia necesita precisarse.",
          "Menciona autoría o procedencia sobre {label}, pero no explica cómo respalda la selección.",
          "Declara confiable una fuente sobre {label} mediante un criterio incompatible con las fichas dadas.",
          "No aporta evidencia del criterio de confiabilidad solicitado para {label}."
        ]
      },
      "research": {
        "title": "Hallazgos sobre {label}",
        "weight": 4,
        "levels": [
          "Expone los hallazgos sobre {relation} con respaldo en el conjunto de fuentes indicado y distingue afirmaciones, inferencias y límites de lo examinado.",
          "Los hallazgos sobre {label} conservan sus relaciones principales; una conclusión necesita delimitarse.",
          "Presenta datos o afirmaciones sobre {label}, pero no muestra una relación necesaria para responder la pregunta dada.",
          "Los hallazgos sobre {label} contradicen los textos o presentan inferencias como conclusiones demostradas.",
          "No presenta hallazgos reconocibles que respondan la pregunta sobre {label}."
        ]
      },
      "sources": {
        "title": "Procedencia de la información sobre {label}",
        "weight": 3,
        "levels": [
          "Hace reconocible la procedencia de la información utilizada sobre {label} y su pertinencia para la pregunta solicitada.",
          "La procedencia es reconocible; una referencia sobre {label} necesita precisarse.",
          "Menciona fuentes sobre {label}, pero una afirmación central no puede localizarse en ellas.",
          "Atribuye a una fuente sobre {label} ideas ajenas o incompatibles con su contenido.",
          "No permite reconocer la procedencia de la información usada sobre {label}."
        ]
      },
      "attribution": {
        "title": "Atribución de las ideas",
        "weight": 3,
        "levels": [
          "Relaciona las ideas citadas sobre {label} con sus autores según las referencias proporcionadas, distinguiendo la voz de la fuente y la del informe.",
          "La atribución de ideas sobre {label} es reconocible; una referencia necesita precisarse.",
          "Atribuye algunas ideas sobre {label}, pero una voz no puede distinguirse de la del informe.",
          "Atribuye una idea sobre {label} a un autor incompatible con las referencias dadas.",
          "No permite reconocer la atribución solicitada de las ideas sobre {label}."
        ]
      },
      "dialogue-questions": {
        "title": "Preguntas del diálogo filosófico",
        "weight": 3,
        "levels": [
          "Formula preguntas que examinan los supuestos y las razones de las respuestas sobre {label}, retomando las ideas expresadas en el caso dado.",
          "Las preguntas examinan las ideas sobre {label}; una necesita precisarse para profundizar en un supuesto.",
          "Formula preguntas sobre {label}, pero no las vincula con un supuesto o respuesta que deba examinarse.",
          "Las preguntas sobre {label} exigen una respuesta prefijada o no examinan las ideas del caso.",
          "No presenta preguntas que permitan examinar el caso de {label}."
        ]
      },
      "dialogue-response": {
        "title": "Respuestas y revisión de supuestos",
        "weight": 4,
        "levels": [
          "Responde a las preguntas sobre {label} con razones del caso y revisa un supuesto o explicación cuando se muestran sus límites o contradicciones.",
          "Las respuestas sobre {label} tienen razones pertinentes; una revisión de supuestos necesita precisarse.",
          "Responde sobre {label}, pero no relaciona las razones con una pregunta o contradicción señalada.",
          "Elude las preguntas sobre {label} o mantiene una afirmación incompatible con las razones examinadas.",
          "No aporta respuestas razonadas sobre el caso de {label}."
        ]
      },
      "method-application": {
        "title": "Aplicación de {label}",
        "weight": 4,
        "levels": [
          "Muestra {relation} mediante las actuaciones y razones pedidas para el caso ficticio, sin atribuir al método conclusiones que no permite.",
          "La aplicación de {label} conserva el procedimiento principal; un paso o su razón necesita precisarse.",
          "Muestra pasos de {label}, pero una relación necesaria con el caso no puede seguirse.",
          "La aplicación de {label} contradice sus pasos o trata como definitiva una conclusión que el procedimiento no respalda.",
          "No muestra una aplicación reconocible de {label} al caso dado."
        ]
      },
      "response": {
        "title": "Respuesta a objeciones sobre {label}",
        "weight": 3,
        "levels": [
          "Responde a las objeciones del intercambio sobre {label} con razones pertinentes al caso, distinguiendo qué cuestionan y cómo el respaldo dado permite atenderlas.",
          "La respuesta sobre {label} atiende la objeción con razones pertinentes; una conexión con el respaldo necesita precisarse.",
          "Responde sobre {label}, pero una razón no atiende lo que cuestiona la objeción.",
          "La respuesta sobre {label} cambia el sentido de la objeción o atribuye al material un respaldo que no contiene.",
          "No presenta una respuesta reconocible a las objeciones sobre {label}."
        ]
      },
      "summary": {
        "title": "Síntesis de {label}",
        "weight": 4,
        "levels": [
          "Sintetiza las ideas principales solicitadas de {label}, conservando el sentido y las relaciones del texto proporcionado.",
          "La síntesis de {label} conserva el sentido principal; una relación secundaria necesita precisarse.",
          "Recupera ideas de {label}, pero omite una relación necesaria para reconocer el planteamiento del texto.",
          "La síntesis de {label} cambia el sentido del texto o añade afirmaciones ajenas a su contenido.",
          "No presenta una síntesis reconocible del texto solicitado sobre {label}."
        ]
      },
      "report": {
        "title": "Informe de lectura sobre {label}",
        "weight": 4,
        "levels": [
          "Organiza las ideas y relaciones solicitadas de {label} en el informe, conservando el sentido de las fuentes dadas y distinguiendo sus afirmaciones de las inferencias.",
          "El informe de {label} permite seguir las ideas principales; una relación necesita aclararse.",
          "El informe enumera ideas pertinentes de {label}, pero no permite reconstruir una relación necesaria del texto.",
          "El informe de {label} altera las afirmaciones de las fuentes o les atribuye ideas ausentes.",
          "No presenta el contenido solicitado del informe de lectura sobre {label}."
        ]
      },
      "thesis": {
        "title": "Tesis del ensayo",
        "weight": 4,
        "levels": [
          "Formula una tesis reconocible sobre {label} que responde a la cuestión filosófica del material proporcionado.",
          "La tesis sobre {label} responde a la cuestión; un término necesita delimitarse.",
          "Menciona una postura sobre {label}, pero no delimita una afirmación que pueda sostener con razones.",
          "La tesis sobre {label} responde a otra cuestión o contradice las condiciones dadas del problema.",
          "No permite reconocer la tesis solicitada sobre {label}."
        ]
      },
      "reason": {
        "title": "Razones del ensayo",
        "weight": 4,
        "levels": [
          "Relaciona la tesis sobre {label} con las razones y el respaldo solicitados, distinguiendo las afirmaciones del texto de sus inferencias.",
          "Las razones sostienen la tesis sobre {label}; una conexión con el respaldo necesita precisarse.",
          "Presenta razones sobre {label}, pero no muestra cómo sostienen la tesis o se apoyan en el material dado.",
          "Las razones sobre {label} contradicen la tesis o atribuyen a las fuentes un respaldo que no contienen.",
          "No aporta razones que sostengan la tesis sobre {label}."
        ]
      },
      "organization": {
        "title": "Relación entre las ideas del ensayo",
        "weight": 3,
        "levels": [
          "Organiza el ensayo de {label} de modo que pueda seguirse la relación entre la cuestión, la tesis y su desarrollo argumentado.",
          "Se sigue la relación principal del ensayo de {label}; una transición necesita aclararse.",
          "El ensayo presenta ideas sobre {label}, pero una relación entre tesis y desarrollo queda sin construir.",
          "La organización del ensayo de {label} cambia el sentido de una razón o la desvincula de la cuestión tratada.",
          "No permite seguir la relación entre las ideas del ensayo sobre {label}."
        ]
      },
      "revision": {
        "title": "Revisión del texto filosófico",
        "weight": 3,
        "levels": [
          "Muestra cambios que corrigen {target} en el texto filosófico según las indicaciones y conserva el sentido de las fuentes dadas.",
          "Corrige los problemas principales de {target}; queda una referencia indicada por precisar.",
          "Muestra cambios en {target}, pero mantiene uno de los problemas señalados que impide seguir la relación solicitada.",
          "Los cambios en {target} alteran el sentido del texto o introducen un problema incompatible con las referencias dadas.",
          "No muestra las correcciones solicitadas de {target}."
        ]
      },
      "argument": {
        "title": "Argumentación sobre {label}",
        "weight": 4,
        "levels": [
          "Sostiene una afirmación sobre {label} mediante razones y evidencias pertinentes al caso, distinguiendo el respaldo de la fuente y su inferencia.",
          "La afirmación sobre {label} tiene razones pertinentes; una conexión con la evidencia necesita precisarse.",
          "Presenta una afirmación y razones sobre {label}, pero no muestra una relación necesaria entre ellas.",
          "Las razones sobre {label} contradicen la afirmación o sustituyen su respaldo por una postura impuesta.",
          "No aporta una argumentación reconocible sobre {label}."
        ]
      },
      "proposal": {
        "title": "Propuesta para el caso de {label}",
        "weight": 4,
        "levels": [
          "Propone una respuesta al problema dado de {label} y explica cómo atiende sus condiciones mediante las razones filosóficas proporcionadas.",
          "La propuesta atiende las condiciones principales de {label}; una relación con sus razones necesita precisarse.",
          "Propone una respuesta sobre {label}, pero no muestra cómo atiende una condición del problema dado.",
          "La propuesta de {label} contradice las condiciones del caso o no se vincula con el problema planteado.",
          "No presenta una propuesta reconocible para el caso de {label}."
        ]
      },
      "representation": {
        "title": "Organización del producto sobre {label}",
        "weight": 3,
        "levels": [
          "Organiza en el producto solicitado las ideas y relaciones pertinentes de {label}, conservando el sentido de las posiciones dadas.",
          "El producto permite seguir las ideas de {label}; una relación necesita aclararse.",
          "Incluye ideas de {label}, pero las presenta aisladas de una relación necesaria.",
          "El producto cambia el sentido de las ideas de {label} o les atribuye relaciones incompatibles con el material.",
          "No representa las ideas solicitadas de {label} en el producto pedido."
        ]
      },
      "discussion": {
        "title": "Discusión de las posiciones sobre {label}",
        "weight": 4,
        "levels": [
          "Discute las posiciones dadas de {label} con razones y evidencia, atendiendo las objeciones expresamente indicadas sin imponer acuerdo personal.",
          "La discusión de {label} tiene razones pertinentes; una respuesta a una objeción indicada necesita precisarse.",
          "Expresa posiciones sobre {label}, pero no relaciona una razón con el planteamiento u objeción solicitados.",
          "La discusión de {label} atribuye ideas ausentes o elude las razones planteadas en el caso.",
          "No aporta una discusión razonada de las posiciones sobre {label}."
        ]
      },
      "oral": {
        "title": "Comunicación de las ideas filosóficas",
        "weight": 3,
        "levels": [
          "Comunica las ideas y relaciones solicitadas de {label} de modo comprensible para la audiencia mediante los apoyos de acceso acordados.",
          "Las ideas de {label} se comprenden; una referencia o transición necesita aclararse.",
          "Comunica ideas sobre {label}, pero una relación principal no puede seguirse.",
          "La presentación de {label} altera una idea del material o impide reconocer la relación solicitada.",
          "No aporta una comunicación reconocible del contenido solicitado sobre {label}."
        ]
      }
    }
  },
  {
    "id": "optativa-hcs-soc-5",
    "grade": 5,
    "subjectCode": "OPT-HCS-SOC-5",
    "subjectName": "Geografía Humana y Demografía",
    "optativeExitName": "Humanidades y Ciencias Sociales",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "3cfc3564-ea06-53a7-9906-2e7287fdbb44",
    "pdfPages": [
      485,
      486,
      487
    ],
    "topics": [
      {
        "id": "human-geography",
        "grade": 5,
        "label": "la geografía humana",
        "match": "geografia humana|geografia y demografia|geografia.*autores",
        "relation": "el objeto, las ramas o los aportes expresamente pedidos de {target} y sus relaciones con el estudio de las poblaciones en las fuentes dadas",
        "sourceRecordIds": [
          "0e908a52-8aa8-519b-aca6-3376686eed77",
          "0a98d6d2-71c8-51f9-b348-75aedfa3cd89",
          "4fa7b089-d54d-528b-957b-de0d6f0e55f5",
          "a2bfdf01-1d12-5501-888c-56a1e64ec11c",
          "e8fedfb2-31a7-5a06-a5fd-416291a1d689"
        ],
        "pages": [
          485,
          487
        ],
        "priority": 1,
        "facets": [
          {
            "label": "el concepto, desarrollo contemporáneo y ramas de la geografía humana",
            "match": "concepto.*desarrollo|ramas"
          },
          {
            "label": "los autores y sus aportes a la geografía humana y la demografía",
            "match": "autores|aportes"
          }
        ]
      },
      {
        "id": "demography",
        "grade": 5,
        "label": "la demografía",
        "match": "demograf|poblacion",
        "relation": "el significado y las aplicaciones solicitadas de {target}, distinguiendo datos de población, conclusiones y límites de las fuentes dadas",
        "sourceRecordIds": [
          "fd5f922d-0b1f-53ae-889f-14cfd6f9f497",
          "c1dd8e65-80bc-5191-87b6-0f3bd9a75cea",
          "f1bda703-131c-5672-aa39-a9fbc6fdc932",
          "3fdc0762-0878-5aad-a1c5-8024a2425108",
          "d61e3dc2-022a-54c8-bdd9-c31f4f4f6ff2",
          "af17372d-b329-5c59-89c9-c34892114f64",
          "6a4d8c7f-3000-50a6-b443-beba35581ba8",
          "7b111d4e-498b-5dc2-998d-ca32175f61be",
          "e8fedfb2-31a7-5a06-a5fd-416291a1d689",
          "9d6e4e39-3c0b-5502-b4b3-d4a513b344f4"
        ],
        "pages": [
          485,
          487
        ],
        "priority": 1,
        "facets": [
          {
            "label": "las provincias indicadas en el mapa de población",
            "match": "provincias.*mapa de poblacion"
          }
        ]
      },
      {
        "id": "demography-environment",
        "grade": 5,
        "label": "las relaciones entre demografía y medioambiente",
        "match": "demografia y medioambiente",
        "relation": "las relaciones expresamente estudiadas de {target}, distinguiendo las condiciones de población y del entorno en el caso dado",
        "sourceRecordIds": [
          "ebeb1d70-1caa-50e4-8a69-f41cb2b7c09a"
        ],
        "pages": [
          485
        ],
        "priority": 50
      },
      {
        "id": "demographic-indices",
        "grade": 5,
        "label": "los indicadores demográficos solicitados",
        "match": "natalidad|mortalidad|esperanza de vida|crecimiento poblacional|crecimiento demografico|\\bidh\\b|desarrollo humano|\\bicv\\b|calidad de vida|indicadores demograficos|indice de pobreza|tasa de crecimiento",
        "relation": "el significado, las variables, la base de referencia y el período de {target} que figuran en las definiciones o leyendas dadas",
        "sourceRecordIds": [
          "261e4534-b5d4-5743-aefe-487232950cfd",
          "a57f99f4-1f4c-5f4f-96ca-d00f8b4120ce",
          "41a001ef-51fd-5d44-9239-a4e32bcbdadf",
          "eba82b36-d0af-5343-a1ed-0c40d4c24aae",
          "e22105ad-c22f-5ec3-854a-108364beb280",
          "c226bd2d-5b0a-55fd-9bfe-be29fb94f059",
          "c6cb3ae7-3332-581a-9af0-1f7b91a68005"
        ],
        "pages": [
          485,
          487
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la tasa de natalidad",
            "match": "natalidad"
          },
          {
            "label": "la mortalidad infantil",
            "match": "mortalidad infantil"
          },
          {
            "label": "la tasa de mortalidad general",
            "match": "mortalidad general|mortalidad(?! infantil)"
          },
          {
            "label": "la esperanza de vida al nacer",
            "match": "esperanza de vida"
          },
          {
            "label": "el crecimiento poblacional",
            "match": "crecimiento poblacional|crecimiento demografico|tasa de crecimiento"
          },
          {
            "label": "el Índice de Desarrollo Humano (IDH)",
            "match": "\\bidh\\b|desarrollo humano"
          },
          {
            "label": "el Índice de Calidad de Vida (ICV)",
            "match": "\\bicv\\b|calidad de vida"
          },
          {
            "label": "el índice de pobreza señalado en la leyenda",
            "match": "indice de pobreza"
          }
        ]
      },
      {
        "id": "population-composition",
        "grade": 5,
        "label": "la composición de la población",
        "match": "composicion de la poblacion",
        "relation": "las características y relaciones de {target} según las categorías expresamente utilizadas por el conjunto de datos dado",
        "sourceRecordIds": [
          "0094a607-94d7-5144-a56e-4eb9080c2ef8"
        ],
        "pages": [
          485
        ],
        "priority": 50
      },
      {
        "id": "migration",
        "grade": 5,
        "label": "la migración y la emigración",
        "match": "migracion|emigracion|inmigrantes",
        "relation": "el lugar de origen, destino o referencia y el período expresamente utilizados para estudiar {target} en los casos o datos agregados dados",
        "sourceRecordIds": [
          "5399804d-a062-5a43-91fd-6a4a04b8b048",
          "9d6e4e39-3c0b-5502-b4b3-d4a513b344f4"
        ],
        "pages": [
          485,
          487
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la migración",
            "match": "\\bmigracion\\b"
          },
          {
            "label": "la emigración",
            "match": "emigracion"
          },
          {
            "label": "los países receptores de inmigrantes dominicanos en el período dado",
            "match": "paises.*inmigrantes"
          }
        ]
      },
      {
        "id": "census",
        "grade": 5,
        "label": "los censos de población",
        "match": "censos?|censal",
        "relation": "la información agregada, el alcance territorial y el período de {target}, distinguiendo lo que sus datos permiten concluir",
        "sourceRecordIds": [
          "71dc63ba-7b82-54e4-9d4d-921cc13d0770"
        ],
        "pages": [
          485
        ],
        "priority": 50
      },
      {
        "id": "territorial-division",
        "grade": 5,
        "label": "la división territorial dominicana",
        "match": "regionalizacion|division(?:es)? territorial|macroregion|macro region|region y provincia|region, region|macroregiones",
        "relation": "la organización, los límites o los cambios solicitados de {target}, respetando las escalas territoriales, leyendas y fechas de los materiales dados",
        "sourceRecordIds": [
          "4b7dd6d5-b339-5419-9946-970d1596d12d",
          "61cde0f0-9105-58ec-9182-a9c9e6234b96",
          "6d58b6c1-3b85-5ad8-9e74-88306e0a5f6f",
          "59f9ff9a-380f-5a0c-b988-74d2375f4f57",
          "ec76f251-d7e2-56ce-aeba-be1ac690652c",
          "efb5dcb7-b988-5c5d-b21d-8498a38ffef7",
          "457a542e-126a-5b1d-b66e-e7d62c469f90",
          "b896a10f-24d5-59f7-8d0d-312934768e44",
          "35670a28-778b-5a32-88fe-eaf941c7c06c",
          "a70abd3e-333f-5fea-a497-edff6affaaa2"
        ],
        "pages": [
          485,
          486,
          487
        ],
        "priority": 50,
        "facets": [
          {
            "label": "macroregión, región y provincia",
            "match": "macroregion|macro region"
          },
          {
            "label": "la división territorial colonial y la del período indicado",
            "match": "colonial.*(?:actual|periodo actual)"
          },
          {
            "label": "la división territorial de la época colonial",
            "match": "epoca colonial|division territorial colonial"
          },
          {
            "label": "la regionalización dominicana",
            "match": "regionalizacion"
          }
        ]
      },
      {
        "id": "dominican-regions",
        "grade": 5,
        "label": "las regiones dominicanas solicitadas",
        "match": "cibao|suroeste|sureste|valdesia|el valle|enriquillo|ozama|metropolitana|yuma|higuamo|regiones dominicanas",
        "relation": "la localización o las características expresamente pedidas de {target}, según los límites y referencias del mapa o ficha regional dados",
        "sourceRecordIds": [
          "3e965cd2-aa17-5130-9acb-1234359513c6",
          "18f1cd28-b7b0-56ec-86a8-a4cd372bc983",
          "17acbdac-b4b3-5bed-9ebb-a8ccfd6dfa17",
          "1f34cb80-f730-57cd-a464-0ec93a82d3e2",
          "ffabfd58-4cb2-54ce-a7ed-e7d010e886cc",
          "4a5fbaf4-d47b-57df-a394-44501cd70786",
          "68b1e539-727d-5057-84d2-0f4262ddcd9e",
          "792232ba-7af1-55ec-9300-1f267ae6a6ed",
          "a0761b83-7ddd-5fa3-a246-a9e864f3f403",
          "0b1177f1-6901-5d24-96aa-96c140a7e3cd",
          "f9337110-8cbd-5667-80ab-78c4cfab9cb0",
          "4375a328-4059-5adc-9875-1787ec210c56"
        ],
        "pages": [
          485
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la macroregión del Cibao",
            "match": "macroregion del cibao"
          },
          {
            "label": "Cibao Norte",
            "match": "cibao norte"
          },
          {
            "label": "Cibao Sur",
            "match": "cibao sur"
          },
          {
            "label": "Cibao Nordeste",
            "match": "cibao nordeste"
          },
          {
            "label": "Cibao Noroeste",
            "match": "cibao noroeste"
          },
          {
            "label": "la macroregión Suroeste",
            "match": "suroeste"
          },
          {
            "label": "Valdesia",
            "match": "valdesia"
          },
          {
            "label": "El Valle",
            "match": "el valle"
          },
          {
            "label": "Enriquillo",
            "match": "enriquillo"
          },
          {
            "label": "la macroregión Sureste",
            "match": "sureste"
          },
          {
            "label": "la región Ozama o Metropolitana",
            "match": "ozama|metropolitana"
          },
          {
            "label": "Yuma",
            "match": "yuma"
          },
          {
            "label": "Higuamo",
            "match": "higuamo"
          }
        ]
      },
      {
        "id": "intercultural-convivence",
        "grade": 5,
        "label": "la convivencia intercultural",
        "match": "intercultur|convivencia|trato respetuoso|respeto a las demas personas",
        "relation": "las condiciones y relaciones de {target} en el caso dado, distinguiendo normas de trato y argumentos de juicios sobre la moralidad privada",
        "sourceRecordIds": [
          "4ecc2939-4e6d-5790-853d-d468c6711530",
          "7e0760fc-a78e-5c6e-b8cc-09b715dfb984",
          "f18b26fe-46b1-5d0e-aeb1-b10b605e8c16",
          "1a57935e-8745-54c8-8d4f-fd21c2abaf76",
          "9e5497cd-61a4-5b33-b893-5ca7f5266cce",
          "2b6664f3-c39a-531d-aefe-7b8126ade690",
          "552ffc7e-4788-5395-946b-b438633c730d",
          "0b306cd0-b50a-52f2-9d43-7f4c00699efa",
          "7c55f405-3df6-538f-854c-1682e526c324",
          "1dfdb1ff-767b-534d-8230-bca4c38f1498",
          "d92e88e4-2afd-5968-9585-a513bfba920c"
        ],
        "pages": [
          485,
          486,
          487
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la convivencia intercultural",
            "match": "intercultur|convivencia"
          },
          {
            "label": "el trato respetuoso a las demás personas en el caso dado",
            "match": "trato respetuoso|respeto a las demas personas"
          }
        ]
      },
      {
        "id": "peace-dialogue",
        "grade": 5,
        "label": "la cultura de paz y el diálogo",
        "match": "cultura de paz|dialogo.*paz",
        "relation": "el papel del diálogo y las razones expresamente estudiadas de {target} en el conflicto ficticio proporcionado",
        "sourceRecordIds": [
          "7b4f6288-54bd-592a-9830-afb6b473b78e",
          "aa06f80d-4fa0-54ba-a2c8-29a93fe6eac2"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 50
      },
      {
        "id": "economy",
        "grade": 5,
        "label": "la economía",
        "match": "\\beconomia\\b|economico|economicas",
        "relation": "los conceptos y relaciones solicitados de {target}, distinguiendo las afirmaciones del texto de los datos y ejemplos del caso dado",
        "sourceRecordIds": [
          "37f0efc2-f125-56a4-a642-5ea9efbbd258",
          "619b52dd-2e90-5d35-93db-89ab276d97bc",
          "cc6044db-89e4-57e6-af9a-2cf9aad868b2",
          "786a7915-f9b7-5300-99a0-441be9229e78"
        ],
        "pages": [
          486
        ],
        "priority": 1
      },
      {
        "id": "economic-sectors",
        "grade": 5,
        "label": "los sectores económicos primario, secundario y terciario",
        "match": "sectores economicos|sector primario|primario, secundario",
        "relation": "las funciones y relaciones de {target}, utilizando las actividades productivas expresamente descritas en los ejemplos dados",
        "sourceRecordIds": [
          "bc3cb9dd-dfeb-5d17-abc6-88c6f5a84747"
        ],
        "pages": [
          486
        ],
        "priority": 50
      },
      {
        "id": "national-accounts",
        "grade": 5,
        "label": "los agregados económicos solicitados",
        "match": "producto interno|\\bpib\\b|\\bpin\\b|agregados economicos",
        "relation": "las definiciones, el alcance y las implicaciones solicitadas de {target}, respetando los agregados económicos y los datos proporcionados",
        "sourceRecordIds": [
          "c04938db-f4ef-52e5-a344-a51d7d60fa91",
          "cd75ddeb-0484-5d63-9e9f-d71c0df64205"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 50,
        "facets": [
          {
            "label": "el Producto Interno Bruto (PIB)",
            "match": "producto interno bruto|\\bpib\\b"
          },
          {
            "label": "el Producto Interno Neto",
            "match": "producto interno neto|\\bpin\\b"
          }
        ]
      },
      {
        "id": "finance-production-business",
        "grade": 5,
        "label": "las finanzas, la producción y las empresas económicas",
        "match": "finanzas|produccion y empresas|empresas economicas",
        "relation": "las funciones y relaciones expresamente estudiadas de {target}, según la producción, recursos y decisiones descritos en el caso ficticio dado",
        "sourceRecordIds": [
          "773a2c20-236a-55c2-80e3-2e4689c40d5f"
        ],
        "pages": [
          486
        ],
        "priority": 50
      },
      {
        "id": "tax-havens",
        "grade": 5,
        "label": "los paraísos fiscales",
        "match": "paraisos fiscales",
        "relation": "el concepto y los efectos solicitados de {target} según el texto dado, distinguiendo sus afirmaciones de datos o vigencias no proporcionados",
        "sourceRecordIds": [
          "cf241fc7-179b-5b95-a51b-fd84a156b5d6"
        ],
        "pages": [
          486
        ],
        "priority": 50
      },
      {
        "id": "barter-market",
        "grade": 5,
        "label": "el trueque y el mercado",
        "match": "trueque|\\bmercado\\b",
        "relation": "las formas de intercambio y relaciones solicitadas de {target}, según los bienes, participantes y condiciones de los ejemplos dados",
        "sourceRecordIds": [
          "c0f64f4e-1ea0-50db-9c31-f00400537565"
        ],
        "pages": [
          486
        ],
        "priority": 50,
        "facets": [
          {
            "label": "el trueque",
            "match": "trueque"
          },
          {
            "label": "el mercado",
            "match": "\\bmercado\\b"
          }
        ]
      },
      {
        "id": "trade",
        "grade": 5,
        "label": "el comercio y los acuerdos seleccionados",
        "match": "comercio|acuerdo comercial|acuerdos comerciales",
        "relation": "los flujos, acuerdos o efectos sociales expresamente pedidos de {target}, según las condiciones, fechas y datos del caso proporcionado",
        "sourceRecordIds": [
          "9b4f01c3-adc1-5b32-8bad-3d22056277fa",
          "e2addb75-37d6-59d9-bcd4-e8b81a1cb855",
          "3d874fca-fafa-5122-b5a9-f670fbc42712",
          "f060de6a-0865-5c5a-a775-8427ea907975",
          "81a7d1a0-5874-504c-8ac1-10117fd4a0ac"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 50,
        "facets": [
          {
            "label": "el comercio exterior",
            "match": "comercio exterior|comercio externo|comercio interno y externo"
          },
          {
            "label": "el comercio interno",
            "match": "comercio interno|comercio externo,? (?:e |y )?interno"
          },
          {
            "label": "los acuerdos comerciales seleccionados",
            "match": "acuerdo comercial|acuerdos comerciales"
          }
        ]
      },
      {
        "id": "balance-payments",
        "grade": 5,
        "label": "la balanza de pagos",
        "match": "balanza de pagos",
        "relation": "la clasificación y las relaciones de las operaciones expresamente estudiadas de {target}, según las definiciones y el período proporcionados",
        "sourceRecordIds": [
          "e1ec1862-f19b-5974-8806-c2f175fbf9de"
        ],
        "pages": [
          486
        ],
        "priority": 50
      },
      {
        "id": "tax-system",
        "grade": 5,
        "label": "el Sistema Tributario Dominicano",
        "match": "sistema tributario|impuestos internos|banco central|\\bone\\b",
        "relation": "las funciones y relaciones institucionales expresamente pedidas de {target}, según el organigrama y los textos proporcionados, sin suponer vigencia o asesoría tributaria real",
        "sourceRecordIds": [
          "cc6044db-89e4-57e6-af9a-2cf9aad868b2",
          "0b83c2de-8499-584d-be93-9010085096d4",
          "81a7d1a0-5874-504c-8ac1-10117fd4a0ac"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 50
      },
      {
        "id": "globalization-markets",
        "grade": 5,
        "label": "la globalización económica y los mercados mundiales",
        "match": "globalizacion|mercados mundiales",
        "relation": "las implicaciones y relaciones solicitadas de {target}, distinguiendo argumentos, datos y límites de los textos proporcionados",
        "sourceRecordIds": [
          "a2cacaf0-5ee4-551e-a7a5-f144d5ba0361"
        ],
        "pages": [
          487
        ],
        "priority": 50
      },
      {
        "id": "environment-development",
        "grade": 5,
        "label": "las relaciones entre medioambiente y desarrollo",
        "match": "medioambiente|ambiental|ambiente|entorno",
        "relation": "las condiciones, efectos o reglas expresamente estudiados de {target} en el caso proporcionado, sin atribuir sentimientos o disposiciones privadas al estudiante",
        "sourceRecordIds": [
          "4f3f79f3-a63f-5f83-85e3-fd9d77f05bf2",
          "de6697f2-c328-5970-a539-5aff21d496f2",
          "8215b975-c468-53c7-9516-c7f329a88938",
          "ac3805cb-43af-5506-9c14-2278a9c2f224",
          "60a455aa-61e3-57b1-8088-2b3be35fb289",
          "97d8869a-28c6-51ed-b3e2-c1ac840b46d1",
          "d1b72911-e4e5-5824-bd27-59ed7269b713",
          "08d9c646-f822-576c-8d01-b9eb68af68c8",
          "7e5f06b1-8f58-5eb2-8527-2331da6d7356",
          "d92e88e4-2afd-5968-9585-a513bfba920c"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 1,
        "facets": [
          {
            "label": "el concepto de respeto al entorno en el caso dado",
            "match": "concepto de respeto al entorno"
          },
          {
            "label": "el cuidado del entorno según el caso dado",
            "match": "cuidado del entorno"
          },
          {
            "label": "las disposiciones y acuerdos ambientales seleccionados",
            "match": "disposiciones y acuerdos ambientales"
          },
          {
            "label": "los artículos legales de protección ambiental proporcionados",
            "match": "articulos legales"
          },
          {
            "label": "la propuesta de protección ambiental del caso dado",
            "match": "propuesta de proteccion ambiental|propuesta ambiental"
          }
        ]
      },
      {
        "id": "natural-human-resources",
        "grade": 5,
        "label": "los recursos naturales y humanos solicitados",
        "match": "recursos naturales|recursos humanos|zonas protegidas",
        "relation": "las características, distribución o condiciones de protección expresamente estudiadas de {target}, según las referencias del mapa o caso dado",
        "sourceRecordIds": [
          "3dc293b8-7a1c-5a34-8c88-a4df277273f9",
          "7ee49b27-40a4-54fc-a495-04bd0a795825",
          "dce0ecf8-ec34-5be6-81d8-d3cab16fb7c3"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 50,
        "facets": [
          {
            "label": "los recursos naturales",
            "match": "recursos naturales"
          },
          {
            "label": "los recursos humanos",
            "match": "recursos humanos|recursos naturales y humanos"
          },
          {
            "label": "las zonas protegidas",
            "match": "zonas protegidas"
          },
          {
            "label": "la distribución de población y las zonas protegidas",
            "match": "mapas de poblacion y zonas protegidas"
          }
        ]
      },
      {
        "id": "pollution",
        "grade": 5,
        "label": "la contaminación del caso dado",
        "match": "contaminacion",
        "relation": "las manifestaciones, efectos y relaciones expresamente estudiadas de {target}, distinguiendo los datos del caso de las propuestas de reducción",
        "sourceRecordIds": [
          "02cadf5d-234c-5044-842a-125d84aa0e0a",
          "3a7e10c4-7a99-5b02-bae1-09a592a0e2b1",
          "8215b975-c468-53c7-9516-c7f329a88938",
          "ac3805cb-43af-5506-9c14-2278a9c2f224",
          "5c4e618d-4df7-516d-9068-7e93116bcc65",
          "97d8869a-28c6-51ed-b3e2-c1ac840b46d1"
        ],
        "pages": [
          486
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la contaminación visual",
            "match": "contaminacion visual"
          },
          {
            "label": "la contaminación acústica",
            "match": "acustica"
          },
          {
            "label": "las relaciones entre contaminación y medioambiente",
            "match": "contaminacion y medioambiente"
          }
        ]
      },
      {
        "id": "waste",
        "grade": 5,
        "label": "los desechos solicitados y sus efectos",
        "match": "desechos|degradables",
        "relation": "las características de degradación y los efectos expresamente estudiados de {target}, según las condiciones y materiales proporcionados",
        "sourceRecordIds": [
          "ef5f6f3e-753c-52c6-9526-c5d54c697168",
          "fa485b96-823d-5852-ba4b-fe7f2d56dedf"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 50,
        "facets": [
          {
            "label": "los desechos no degradables",
            "match": "no(?: |-)?degradables"
          },
          {
            "label": "los desechos degradables",
            "match": "(?<!no )degradables"
          },
          {
            "label": "los efectos de los desechos no degradables en el medioambiente y la salud",
            "match": "desechos no(?: |-)?degradables.*salud"
          }
        ]
      },
      {
        "id": "personal-social-project",
        "grade": 5,
        "label": "los proyectos personales ficticios y sociales",
        "match": "proyecto personal|proyectos personales|desarrollo personal|proyecto social|proyecto.*personal ficticio",
        "relation": "el problema, los objetivos o las relaciones expresamente estudiadas de {target}, utilizando las condiciones ficticias dadas sin pedir vivencias familiares",
        "sourceRecordIds": [
          "2f7b58af-fa27-5d58-9dbf-bcfb6f0f2274",
          "0c4653c9-5f84-5c31-8b7a-68fff18c6feb",
          "eef7fd9a-691e-5fec-8a06-a1898ab8d10b",
          "786a7915-f9b7-5300-99a0-441be9229e78",
          "72d20167-4f4b-5a28-a680-a48109979e67",
          "b97dbe0d-6240-5e84-b78d-d258d991fc99"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 50
      },
      {
        "id": "social-belonging",
        "grade": 5,
        "label": "la pertenencia social y la ciudadanía responsable del caso",
        "match": "pertenencia social|ciudadania responsable",
        "relation": "los conceptos y condiciones de participación expresamente estudiados de {target}, utilizando razones del caso sin exigir sentimientos de pertenencia",
        "sourceRecordIds": [
          "8d6d59d1-3279-5c3e-a2ca-00573fefd625",
          "0b306cd0-b50a-52f2-9d43-7f4c00699efa",
          "9c63bead-8672-51bf-ac22-e7c547f0de16"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 50
      },
      {
        "id": "economic-indicators",
        "grade": 5,
        "label": "los indicadores económicos de los datos proporcionados",
        "match": "indicadores economicos",
        "relation": "el significado y el alcance de {target}, respetando las unidades, la procedencia y el período del conjunto dado",
        "sourceRecordIds": [
          "619b52dd-2e90-5d35-93db-89ab276d97bc",
          "cc6044db-89e4-57e6-af9a-2cf9aad868b2"
        ],
        "pages": [
          486,
          487
        ],
        "priority": 50
      }
    ],
    "evidence": {
      "interpretation": {
        "title": "Explicación de {label}",
        "levels": [
          "Explica {relation} vinculando las ideas y los datos pertinentes, y conserva el alcance del material dado.",
          "Explica las relaciones principales de {label} con datos pertinentes; una precisión secundaria del material queda incompleta.",
          "Reconoce elementos de {label}, pero una relación central carece de respaldo en el material dado.",
          "Atribuye a {label} una relación incompatible con las definiciones o los datos proporcionados.",
          "No presenta una explicación reconocible de {label} a partir del material dado."
        ],
        "weight": 4
      },
      "identification": {
        "title": "Identificación de {label}",
        "levels": [
          "Identifica los elementos expresamente solicitados de {label} mediante las características, referencias o leyendas dadas.",
          "Identifica los elementos principales de {label}; una referencia secundaria queda imprecisa.",
          "Identifica parte de los elementos pedidos de {label}, pero confunde una característica que permite distinguirlos.",
          "Asigna nombres o características incompatibles con los elementos dados de {label}.",
          "No identifica los elementos pedidos de {label} en el material proporcionado."
        ],
        "weight": 4
      },
      "comparison": {
        "title": "Comparación de {label}",
        "levels": [
          "Compara {label} con criterios equivalentes, distingue semejanzas y diferencias pertinentes y respeta las definiciones, períodos y referencias dados.",
          "Compara los aspectos principales de {label} con criterios equivalentes; una diferencia secundaria queda imprecisa.",
          "Presenta características de {label}, pero una comparación central usa criterios o períodos distintos.",
          "Confunde las características de {label} o establece diferencias contrarias al material dado.",
          "No presenta una comparación reconocible de {label}."
        ],
        "weight": 4
      },
      "location": {
        "title": "Ubicación de {label}",
        "levels": [
          "Ubica los lugares solicitados de {label} utilizando la leyenda, los límites y las referencias espaciales del mapa proporcionado.",
          "Ubica los lugares pedidos de {label}; una referencia secundaria de la leyenda queda incompleta.",
          "Ubica parte de los lugares de {label}, pero una referencia errónea impide reconocer otra posición solicitada.",
          "Sitúa los lugares de {label} fuera de las áreas o referencias indicadas en el mapa.",
          "No presenta ubicaciones reconocibles de {label} en la representación dada."
        ],
        "weight": 4
      },
      "calculation": {
        "title": "Cálculo de {label}",
        "levels": [
          "Selecciona para {label} la fórmula y las variables expresamente dadas, sustituye los datos correspondientes, realiza las operaciones y presenta un resultado coherente con las unidades, la base y el período indicados.",
          "Plantea la fórmula dada para {label} y opera con los datos correctos; una precisión secundaria de unidades o presentación queda incompleta.",
          "Relaciona la fórmula y parte de los datos de {label}, pero un error de sustitución u operación altera el resultado.",
          "Utiliza para {label} una relación, denominador, base o período incompatible con la fórmula y los datos proporcionados.",
          "No muestra un procedimiento ni un resultado verificable del cálculo solicitado de {label}."
        ],
        "weight": 5
      },
      "result": {
        "title": "Interpretación del resultado de {label}",
        "levels": [
          "Explica qué representa el resultado obtenido de {label} según sus unidades, base, período y condiciones, sin generalizarlo a datos no proporcionados.",
          "Explica el sentido principal del resultado de {label}; una condición secundaria queda imprecisa.",
          "Menciona el resultado de {label}, pero omite una unidad, base o condición necesaria para interpretarlo.",
          "Atribuye al resultado de {label} un significado incompatible con su unidad, base o período.",
          "No explica el significado del resultado calculado de {label}."
        ],
        "weight": 4
      },
      "data-record": {
        "title": "Registro de los datos de {label}",
        "levels": [
          "Registra los valores solicitados de {label} sin alterarlos y hace reconocibles su procedencia, unidades y período según el conjunto proporcionado.",
          "Registra los valores principales de {label} y su procedencia; un dato secundario de contexto queda incompleto.",
          "Registra parte de los datos de {label}, pero una omisión de valor, unidad o procedencia impide verificar su uso.",
          "Cambia valores o atribuye a {label} datos ausentes o de otro período sin indicarlo.",
          "No presenta un registro verificable de los datos solicitados de {label}."
        ],
        "weight": 4
      },
      "attribution": {
        "title": "Atribución de la información de {label}",
        "levels": [
          "Vincula las ideas o cifras utilizadas de {label} con las fuentes proporcionadas que las respaldan, conservando autoría y procedencia reconocibles sin imponer una norma de citas no indicada.",
          "Atribuye las ideas o cifras principales de {label} a sus fuentes; un dato secundario de identificación queda incompleto.",
          "Menciona fuentes de {label}, pero una idea o cifra utilizada no puede relacionarse con su procedencia.",
          "Atribuye a una fuente información de {label} que no contiene o presenta como propia una idea ajena.",
          "No hace reconocible la procedencia de las ideas o cifras utilizadas de {label}."
        ],
        "weight": 4
      },
      "source-selection": {
        "title": "Selección de fuentes sobre {label}",
        "levels": [
          "Selecciona las fuentes de {label} pertinentes a la pregunta y valora su autoría, procedencia y respaldo utilizando las fichas proporcionadas.",
          "Selecciona fuentes pertinentes de {label} con respaldo reconocible; una precisión secundaria de su justificación queda incompleta.",
          "Selecciona alguna fuente pertinente de {label}, pero no relaciona una elección con su procedencia o respaldo.",
          "Selecciona fuentes ajenas a la pregunta sobre {label} o las considera confiables solo por su apariencia.",
          "No presenta una selección verificable de fuentes sobre {label}."
        ],
        "weight": 4
      },
      "research": {
        "title": "Investigación de {label}",
        "levels": [
          "Responde la pregunta de investigación sobre {label} con hallazgos localizables en el conjunto de fuentes o datos dado y distingue sus límites de las conclusiones respaldadas.",
          "Relaciona los hallazgos principales de {label} con la pregunta y las fuentes; un límite secundario queda impreciso.",
          "Recoge información de {label}, pero una conclusión no se vincula con un hallazgo verificable del conjunto dado.",
          "Presenta conclusiones sobre {label} incompatibles con las fuentes o introduce datos privados o externos no pedidos.",
          "No presenta hallazgos verificables que respondan la pregunta sobre {label}."
        ],
        "weight": 4
      },
      "summary": {
        "title": "Resumen de {label}",
        "levels": [
          "Resume las ideas y los datos centrales de {label}, conserva su sentido y procedencia y distingue los hallazgos de las opiniones añadidas.",
          "Resume las ideas centrales de {label} sin alterar su sentido; un dato secundario queda impreciso.",
          "Recoge ideas de {label}, pero omite una relación central o confunde un dato con una opinión.",
          "Altera el sentido de las ideas o datos de {label} al resumirlos.",
          "No presenta un resumen reconocible del material de {label}."
        ],
        "weight": 4
      },
      "report": {
        "title": "Informe de {label}",
        "levels": [
          "Organiza en el informe los datos y hallazgos pedidos de {label}, hace reconocibles sus fuentes y vincula las conclusiones con la evidencia y el período dados.",
          "El informe organiza los datos y hallazgos principales de {label}; una precisión secundaria de respaldo queda incompleta.",
          "El informe incluye datos de {label}, pero una conclusión central carece de respaldo o la organización impide seguirla.",
          "El informe presenta como hallazgo sobre {label} afirmaciones incompatibles con los datos proporcionados.",
          "No presenta un informe reconocible de los datos y hallazgos pedidos de {label}."
        ],
        "weight": 4
      },
      "monograph": {
        "title": "Monografía de {label}",
        "levels": [
          "Desarrolla el tema delimitado de {label} en apartados relacionados, integra la información de las fuentes dadas y presenta una síntesis respaldada, sin exigir una tesis de ensayo adicional.",
          "Desarrolla los aspectos centrales de {label} con fuentes reconocibles; una relación secundaria entre apartados queda incompleta.",
          "Reúne información de {label}, pero un apartado central carece de respaldo o no se vincula con el tema delimitado.",
          "Desarrolla un tema distinto de {label} o atribuye a las fuentes afirmaciones incompatibles con su contenido.",
          "No presenta un desarrollo monográfico reconocible de {label}."
        ],
        "weight": 4
      },
      "representation": {
        "title": "Representación de {label}",
        "levels": [
          "Elabora el soporte expresamente elegido para comunicar {label}, utiliza los datos y referencias pertinentes y hace comprensibles las relaciones solicitadas según el propósito y los destinatarios indicados sin imponer otro producto.",
          "El soporte comunica las relaciones principales de {label}; una referencia secundaria queda imprecisa.",
          "El soporte incluye elementos de {label}, pero una relación central no puede reconocerse por falta de datos o referencias.",
          "La representación comunica relaciones de {label} incompatibles con los datos o el mapa dados.",
          "No presenta una representación reconocible de {label} en el soporte solicitado."
        ],
        "weight": 4
      },
      "proposal": {
        "title": "Propuesta sobre {label}",
        "levels": [
          "Propone una respuesta pertinente al problema dado de {label}, justifica sus acciones y considera los recursos y las condiciones expresamente señalados sin exigir ejecución externa.",
          "Propone acciones pertinentes de {label} con razones reconocibles; una condición secundaria queda imprecisa.",
          "Propone una acción de {label}, pero no explica cómo atiende una condición central del problema.",
          "Propone acciones de {label} incompatibles con el problema o los recursos dados.",
          "No presenta una propuesta reconocible que atienda el problema dado de {label}."
        ],
        "weight": 4
      },
      "project-plan": {
        "title": "Plan del proyecto sobre {label}",
        "levels": [
          "Relaciona el problema y los objetivos de {label} con acciones, recursos y seguimiento viables según las condiciones dadas; planificar no exige ejecutar el proyecto.",
          "El plan relaciona objetivos y acciones pertinentes de {label}; un recurso o detalle secundario de seguimiento queda incompleto.",
          "El plan incluye objetivos y acciones de {label}, pero una relación central entre problema, recursos y seguimiento no está definida.",
          "El plan propone acciones de {label} incompatibles con los objetivos o recursos proporcionados.",
          "No presenta un plan reconocible para el proyecto solicitado de {label}."
        ],
        "weight": 4
      },
      "survey": {
        "title": "Diseño de la encuesta sobre {label}",
        "levels": [
          "Diseña preguntas comprensibles y pertinentes al objetivo de la encuesta simulada de {label}, con respuestas registrables y sin solicitar identidades ni datos privados.",
          "Las preguntas permiten recoger la información principal de {label}; una formulación secundaria queda imprecisa.",
          "Algunas preguntas de {label} son pertinentes, pero otra formulación sesga o impide registrar la información solicitada.",
          "Las preguntas no responden al objetivo de {label} o solicitan datos privados ajenos a la simulación.",
          "No presenta preguntas utilizables para la encuesta simulada de {label}."
        ],
        "weight": 4
      },
      "revision": {
        "title": "Revisión de {label}",
        "levels": [
          "Revisa {target} según las observaciones proporcionadas, muestra la modificación pertinente y conserva los componentes del borrador que no requieren cambios.",
          "Corrige la relación principal señalada en {target}; un ajuste secundario queda incompleto.",
          "Modifica el borrador, pero una observación central sobre {target} permanece sin resolver.",
          "Los cambios contradicen la observación sobre {target} o alteran componentes ajenos al ajuste pedido.",
          "No muestra una revisión verificable de {target}."
        ],
        "weight": 4
      },
      "simulation": {
        "title": "Intervención en la simulación de {label}",
        "levels": [
          "Realiza la acción concreta acordada para su rol ficticio de {label}, aplica las reglas y condiciones dadas y aporta al propósito de la simulación sin evaluar sentimientos privados.",
          "Realiza la acción principal de su rol de {label} conforme a las reglas; una coordinación secundaria queda incompleta.",
          "Realiza parte de la acción de {label}, pero omite una condición necesaria del rol acordado.",
          "Su intervención en {label} contradice la acción o las reglas expresamente acordadas para el rol.",
          "No presenta una intervención observable del rol acordado en la simulación de {label}."
        ],
        "weight": 4
      },
      "oral": {
        "title": "Comunicación oral de {label}",
        "levels": [
          "Comunica oralmente las ideas pedidas de {label} en una secuencia comprensible, utiliza términos pertinentes y explica sus relaciones al destinatario indicado.",
          "Comunica oralmente las ideas principales de {label}; una transición o término secundario queda impreciso.",
          "Menciona ideas de {label}, pero una relación central resulta incomprensible en la exposición.",
          "La exposición sobre {label} confunde las ideas centrales o su relación con el material proporcionado.",
          "No presenta una comunicación oral reconocible de las ideas pedidas de {label}."
        ],
        "weight": 4
      },
      "argument": {
        "title": "Argumentación sobre {label}",
        "levels": [
          "Sostiene una afirmación sobre {label} con razones y evidencias pertinentes al caso, distingue datos de valoraciones y considera los límites dados sin imponer una postura.",
          "Sostiene una afirmación sobre {label} con razones respaldadas; una precisión secundaria queda incompleta.",
          "Presenta una afirmación y razones sobre {label}, pero una razón central carece de respaldo en el material.",
          "Sustituye el argumento sobre {label} por afirmaciones contradictorias con los datos o por una postura impuesta.",
          "No presenta una afirmación razonada y verificable sobre {label}."
        ],
        "weight": 4
      },
      "response": {
        "title": "Respuesta a objeciones sobre {label}",
        "levels": [
          "Responde a la objeción indicada sobre {label} con razones vinculadas al argumento y al material dado, atendiendo su contenido sin descalificar personas.",
          "Responde al contenido principal de la objeción de {label} con razones pertinentes; una precisión secundaria queda incompleta.",
          "Menciona la objeción de {label}, pero una respuesta central no se vincula con su contenido o evidencia.",
          "Desvía la objeción de {label} o la sustituye por una descalificación ajena al argumento.",
          "No presenta una respuesta reconocible a la objeción indicada sobre {label}."
        ],
        "weight": 4
      },
      "thesis": {
        "title": "Tesis del ensayo sobre {label}",
        "levels": [
          "Formula una tesis delimitada que responde al problema del ensayo de {label} y puede sostenerse con los textos dados, sin exigir adhesión a una postura.",
          "La tesis responde al problema de {label}; una precisión secundaria de su alcance queda incompleta.",
          "Propone una idea sobre {label}, pero su alcance o relación con el problema del ensayo es impreciso.",
          "Confunde el problema de {label} con una afirmación incompatible con los textos dados.",
          "No presenta una tesis reconocible para el ensayo de {label}."
        ],
        "weight": 4
      },
      "reason": {
        "title": "Razones del ensayo sobre {label}",
        "levels": [
          "Desarrolla razones relacionadas con la tesis de {label} y las respalda con información pertinente de los textos proporcionados, distinguiendo hechos e inferencias.",
          "Las razones principales respaldan la tesis de {label}; una conexión secundaria con la evidencia queda incompleta.",
          "Incluye razones sobre {label}, pero una razón central no respalda la tesis o carece de evidencia pertinente.",
          "Las razones contradicen la tesis de {label} o alteran las evidencias de los textos dados.",
          "No presenta razones verificables que sostengan la tesis del ensayo sobre {label}."
        ],
        "weight": 4
      },
      "organization": {
        "title": "Organización del ensayo sobre {label}",
        "levels": [
          "Organiza planteamiento, desarrollo y cierre de {label} en una secuencia que permite seguir la tesis, sus razones y una conclusión coherente.",
          "La secuencia permite seguir la tesis y las razones de {label}; una transición secundaria queda incompleta.",
          "Incluye partes del ensayo de {label}, pero una ruptura central impide seguir su razonamiento.",
          "La secuencia desvincula la conclusión de la tesis y las razones sobre {label}.",
          "No presenta una organización reconocible del ensayo sobre {label}."
        ],
        "weight": 4
      },
      "proposal-scope": {
        "title": "Delimitación de la propuesta sobre {label}",
        "levels": [
          "Define el problema, el objetivo y el alcance de la propuesta sobre {label} de forma coherente con las condiciones del caso, sin exigir ejecutar el proyecto completo.",
          "Define el problema y el objetivo de {label} con alcance pertinente; una precisión secundaria queda incompleta.",
          "Menciona problema y objetivo de {label}, pero su alcance no permite distinguir qué situación se atenderá.",
          "Define un objetivo o alcance de {label} incompatible con el problema o las condiciones dados.",
          "No presenta una delimitación reconocible del problema, objetivo y alcance de la propuesta sobre {label}."
        ],
        "weight": 4
      },
      "legal-analysis": {
        "title": "Análisis de las disposiciones sobre {label}",
        "levels": [
          "Explica el alcance y las condiciones de los artículos o disposiciones proporcionados sobre {label} y los relaciona con el caso ficticio, distinguiendo el texto dado de una vigencia no indicada.",
          "Explica el alcance principal de las disposiciones de {label} para el caso; una condición secundaria queda imprecisa.",
          "Menciona disposiciones de {label}, pero no relaciona una condición central con el alcance del caso.",
          "Atribuye a las disposiciones de {label} obligaciones o vigencia ausentes en el texto proporcionado.",
          "No presenta un análisis reconocible del alcance de las disposiciones dadas sobre {label}."
        ],
        "weight": 4
      },
      "data-analysis": {
        "title": "Análisis de datos de {label}",
        "levels": [
          "Analiza los indicadores económicos solicitados de {label}, conserva los valores, unidades, procedencia y período dados y distingue conclusiones respaldadas de afirmaciones que el conjunto no permite sostener.",
          "Analiza los indicadores principales de {label} con valores y procedencia reconocibles; una precisión secundaria queda incompleta.",
          "Menciona datos de {label}, pero omite una unidad, período o respaldo central para sostener la conclusión.",
          "Altera los datos de {label} o deriva conclusiones incompatibles con sus unidades, procedencia o período.",
          "No presenta un análisis verificable de los indicadores solicitados de {label}."
        ],
        "weight": 4
      },
      "map-analysis": {
        "title": "Lectura de los mapas de {label}",
        "levels": [
          "Interpreta las relaciones espaciales solicitadas de {label} utilizando la leyenda, las referencias, los límites y el período del mapa o mural dado, sin exigir elaborar otro soporte.",
          "Interpreta las relaciones espaciales principales de {label}; una referencia secundaria de la leyenda queda imprecisa.",
          "Reconoce lugares o datos de {label}, pero una relación espacial central no respeta la leyenda o el período dados.",
          "Atribuye al mapa de {label} posiciones, límites o relaciones incompatibles con sus referencias.",
          "No presenta una lectura verificable de las relaciones espaciales solicitadas de {label}."
        ],
        "weight": 4
      },
      "problem-selection": {
        "title": "Selección del problema sobre {label}",
        "levels": [
          "Selecciona el problema pertinente de {label} entre los casos proporcionados y justifica su relación con las condiciones y el propósito dados, sin exigir desarrollar el proyecto completo.",
          "Selecciona un problema pertinente de {label} con justificación reconocible; una precisión secundaria queda incompleta.",
          "Selecciona un problema de {label}, pero una razón central no se vincula con las condiciones del caso.",
          "Selecciona un problema de {label} incompatible con el propósito o los casos proporcionados.",
          "No presenta una selección justificada del problema solicitado de {label}."
        ],
        "weight": 4
      },
      "research-plan": {
        "title": "Plan de investigación sobre {label}",
        "levels": [
          "Delimita la pregunta de investigación de {label}, selecciona fuentes pertinentes y organiza pasos coherentes para responderla según las condiciones dadas, sin exigir ejecutar el estudio.",
          "Relaciona pregunta, fuentes y pasos principales de {label}; una precisión secundaria del plan queda incompleta.",
          "Incluye una pregunta y fuentes de {label}, pero un paso central no permite responder el problema planteado.",
          "Propone fuentes o pasos incompatibles con la pregunta o las condiciones dadas de {label}.",
          "No presenta un plan reconocible de pregunta, fuentes y pasos de investigación sobre {label}."
        ],
        "weight": 4
      }
    }
  },
  {
    "id": "optativa-hcs-soc-6",
    "grade": 6,
    "subjectCode": "OPT-HCS-SOC-6",
    "subjectName": "Ciudadanía y Democracia Participativa",
    "optativeExitName": "Humanidades y Ciencias Sociales",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "ec62cee2-b76d-5582-8cf1-7762b9e5b4fd",
    "pdfPages": [
      488,
      489
    ],
    "topics": [
      {
        "id": "democracy",
        "grade": 6,
        "label": "la democracia y la participación",
        "match": "democracia|democratic",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "96638a16-5f68-548a-ad63-ad97e569aba8",
          "e603f417-d806-5cd6-a68f-bff26b2ed3bc",
          "e0acbdb1-1cba-5077-9691-45441b18ab9d",
          "b777f8f3-141d-5664-b815-2fe776a39b26",
          "23c7aa84-f3f8-5bdc-bd3f-1407c030f6c7",
          "0e089477-125f-58ae-872a-ab6737437372"
        ],
        "pages": [
          488
        ],
        "priority": 1,
        "facets": [
          {
            "label": "la democracia",
            "match": "\\bdemocracia\\b"
          },
          {
            "label": "la participación",
            "match": "\\bparticipacion\\b"
          },
          {
            "label": "la salida democrática del caso",
            "match": "salida democratica"
          }
        ]
      },
      {
        "id": "citizenship",
        "grade": 6,
        "label": "la ciudadanía",
        "match": "ciudadania",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "11519de1-4c35-57b9-95bc-a0e3a33edbac",
          "ca7aea8c-9b5a-5948-a91b-ef8129da7348",
          "2592b369-00df-5015-a633-90237232b73b",
          "6f6ac9db-5c75-5838-9243-540f0a705b5a"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 1
      },
      {
        "id": "reliable-sources",
        "grade": 6,
        "label": "las fuentes confiables sobre Constitución, derechos humanos o inmigrantes solicitadas",
        "match": "confiabilidad|fuentes confiables|fuentes.*confiab",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "9f999b36-1a61-50ed-bf35-256db0375252",
          "b777f8f3-141d-5664-b815-2fe776a39b26",
          "6acb2171-4ddd-55e9-b59e-55dd9bc9ded4",
          "667f0a4e-352b-581a-b5ba-da99b1e46735"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 60
      },
      {
        "id": "civic-participation",
        "grade": 6,
        "label": "la participación y los principios cívicos",
        "match": "participacion civica|principios civicos|funcion civica",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "daa9b9e5-bb84-53e9-bb68-4e00f9d8cf04",
          "42fba15a-0755-5047-bee3-3d5964438101"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la participación cívica",
            "match": "participacion civica|participacion y los principios civicos"
          },
          {
            "label": "los principios cívicos de los casos dados",
            "match": "principios civicos"
          }
        ]
      },
      {
        "id": "democracy-types",
        "grade": 6,
        "label": "la democracia participativa y la democracia representativa",
        "match": "democracia (?:representativa|participativa)",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "e633dc5f-3f0d-53f0-94e5-edc789de2460",
          "2c74dd25-7c62-5015-8868-b44428db8553"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la democracia participativa",
            "match": "democracia participativa"
          },
          {
            "label": "la democracia representativa",
            "match": "democracia representativa"
          }
        ]
      },
      {
        "id": "democratic-values",
        "grade": 6,
        "label": "los valores y actuaciones democráticas solicitados",
        "match": "valores democraticos|actitudes democraticas|actitudes no democraticas|autoritarias|decision democratica|valores y actuaciones democraticas",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "c344cbe9-6b37-5a3f-9abd-848c0b38705c",
          "e23fc18c-95f2-5f3a-ace9-0ee28a9c2e4a",
          "56b309cf-ab78-5454-81b7-62ae324eabb9"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50,
        "facets": [
          {
            "label": "los valores democráticos del caso",
            "match": "valores democraticos"
          },
          {
            "label": "las actitudes democráticas y autoritarias de los casos dados",
            "match": "actitudes democraticas.*autoritarias"
          },
          {
            "label": "las actitudes no democráticas de los personajes",
            "match": "actitudes no democraticas"
          },
          {
            "label": "la decisión democrática de la simulación",
            "match": "decision democratica"
          }
        ]
      },
      {
        "id": "democratic-state",
        "grade": 6,
        "label": "el Estado democrático y de derecho",
        "match": "estado democratico|estado de derecho",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "6d760447-8273-5f67-907e-726c2a9cd8ae"
        ],
        "pages": [
          488
        ],
        "priority": 50
      },
      {
        "id": "rights-duties",
        "grade": 6,
        "label": "los derechos y los deberes",
        "match": "derechos y (?:los )?deberes",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "4dd54cdb-c05e-5ab7-a823-38efc422c651",
          "37840259-bdf9-5213-9612-00d3cca1a3be",
          "0501b7a4-0224-5166-846b-69268e9069de",
          "084fcf4c-02ee-589d-8611-274ad87dd343"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50
      },
      {
        "id": "constitutional-rights",
        "grade": 6,
        "label": "los derechos fundamentales y la Constitución dominicana",
        "match": "constitucion|derechos fundamentales",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "cd3d493c-e4d5-577e-b93c-bad97482265f",
          "2c829ce2-9b78-588b-9113-bbd190d145d7",
          "4d878415-a12e-578f-b5cd-6f7121defcd8",
          "237561c5-17ed-50aa-b1c8-45266e9a4d2a",
          "6f17d0d7-15c5-55cc-9645-15601bebe338",
          "667f0a4e-352b-581a-b5ba-da99b1e46735",
          "6cb829b1-0c45-5a4b-90ba-6fab239a687e"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 10,
        "facets": [
          {
            "label": "la Constitución dominicana",
            "match": "constitucion"
          },
          {
            "label": "los derechos fundamentales",
            "match": "derechos fundamentales"
          }
        ]
      },
      {
        "id": "state-powers",
        "grade": 6,
        "label": "los poderes del Estado",
        "match": "poderes del estado",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "563b3b5b-220f-57ec-8a2a-1293f5499766",
          "59060daa-7708-5a16-b435-f10f0f9ef2f4"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50
      },
      {
        "id": "human-rights",
        "grade": 6,
        "label": "los derechos humanos",
        "match": "derechos humanos",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "d30ccbe4-7f72-59b2-9cdc-4801693e6358",
          "7e7b44a8-bc1f-51a3-ab93-39a10e6435d8",
          "5d0e8a72-fca6-5bfe-93cd-d9e5c8b3f1f5",
          "4ab686f9-8a7c-5981-8801-93c6eca78b70",
          "e9f028b3-3731-5ee7-87f3-1c3863a6bcb8",
          "b49819d0-54b9-57dd-841d-43c9854cbb76"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 10
      },
      {
        "id": "equal-rights",
        "grade": 6,
        "label": "la igualdad y el respeto a los derechos humanos",
        "match": "igualdad|respeto a los derechos humanos",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "24a12dfc-06d6-5b8f-af89-2fc375bf8731",
          "df253a47-eaa4-5bc6-a482-778f2fbee63e"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la igualdad de derechos",
            "match": "igualdad"
          },
          {
            "label": "el respeto a los derechos humanos",
            "match": "respeto a los derechos humanos"
          }
        ]
      },
      {
        "id": "democratic-citizenship",
        "grade": 6,
        "label": "la ciudadanía democrática y responsable",
        "match": "ciudadania democratica|ciudadania responsable",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "ca7aea8c-9b5a-5948-a91b-ef8129da7348",
          "6f6ac9db-5c75-5838-9243-540f0a705b5a"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50
      },
      {
        "id": "global-citizenship",
        "grade": 6,
        "label": "la ciudadanía global",
        "match": "ciudadania global",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "d6412626-f907-5c3a-8d4f-662f5ceae153",
          "0cb8b84c-e080-537b-adfd-17689b905877"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50
      },
      {
        "id": "intercultural-convivence",
        "grade": 6,
        "label": "la convivencia, diversidad cultural, multiculturalidad e interculturalidad",
        "match": "diversidad cultural|multicultur|intercultur|distintas culturas",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "85eba0a8-af4f-5d55-94d8-da0951b1c9e8",
          "79ae9d8a-3f95-5c93-9345-dd9427f0b819",
          "5c728b10-2f64-5a9b-96dd-5258770d18b8"
        ],
        "pages": [
          488
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la convivencia",
            "match": "convivencia"
          },
          {
            "label": "la diversidad cultural",
            "match": "diversidad cultural"
          },
          {
            "label": "la multiculturalidad",
            "match": "multicultur"
          },
          {
            "label": "la interculturalidad",
            "match": "intercultur"
          },
          {
            "label": "la convivencia entre distintas culturas",
            "match": "distintas culturas"
          }
        ]
      },
      {
        "id": "migration",
        "grade": 6,
        "label": "la inmigración y los derechos de los inmigrantes",
        "match": "inmigra|migracion",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "79ae9d8a-3f95-5c93-9345-dd9427f0b819",
          "2592b369-00df-5015-a633-90237232b73b",
          "08413b5a-bc74-577d-9c06-339f4bcd2414",
          "b49819d0-54b9-57dd-841d-43c9854cbb76",
          "7258925a-76ab-5afa-9ce1-6c97561c8694"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la inmigración",
            "match": "\\binmigracion\\b"
          },
          {
            "label": "los inmigrantes del conjunto ficticio",
            "match": "inmigrantes"
          },
          {
            "label": "la migración",
            "match": "\\bmigracion\\b"
          }
        ]
      },
      {
        "id": "environment",
        "grade": 6,
        "label": "el cuidado del medioambiente y del entorno",
        "match": "medioambiente|medio natural|entorno|limpieza",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "74bcec61-e726-5551-8b7a-b537843db1be",
          "7b0ad5dd-a5e8-507c-9bb6-5f12bfc10a62",
          "f0790a9e-5c43-59d6-a7d1-f31c0000f082",
          "5b6321f5-fa9e-52ae-a288-47a5afc2c612",
          "2520c219-9003-58d9-8f57-c1c96a1e97b1",
          "0be1a47a-b4ff-5bfa-9ec3-3c63c9ef7405",
          "a333707c-47a4-50cf-84a4-a83b687b662c",
          "1354f61c-26e5-517a-9d20-f796164e3cb7",
          "a800c527-974b-54f3-8e80-2654a761b83e"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 10,
        "facets": [
          {
            "label": "el cuidado del medioambiente",
            "match": "medioambiente"
          },
          {
            "label": "el cuidado del entorno",
            "match": "entorno|limpieza"
          },
          {
            "label": "el cuidado del medio natural y social",
            "match": "medio natural"
          }
        ]
      },
      {
        "id": "pollution",
        "grade": 6,
        "label": "la contaminación y los residuos sólidos solicitados",
        "match": "contaminacion|residuos solidos",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "7b0ad5dd-a5e8-507c-9bb6-5f12bfc10a62",
          "6acb2171-4ddd-55e9-b59e-55dd9bc9ded4",
          "ccd1304b-6619-5561-b70c-d386b9ce960f"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la contaminación y sus efectos en la salud según los datos dados",
            "match": "contaminacion.*salud"
          },
          {
            "label": "la contaminación y los residuos sólidos",
            "match": "contaminacion.*residuos solidos"
          }
        ]
      },
      {
        "id": "peace",
        "grade": 6,
        "label": "la convivencia y la cultura de paz",
        "match": "convivencia|cultura de paz",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "0f583cc3-0933-5558-9cbc-72fa06b9ec7c",
          "5c728b10-2f64-5a9b-96dd-5258770d18b8",
          "b78f069c-1ab3-5b99-b3d9-2ebab6aa9527",
          "10d6f1c2-e087-5f3e-b05b-5bce0a51e2cf"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 10,
        "facets": [
          {
            "label": "la cultura de paz",
            "match": "cultura de paz"
          },
          {
            "label": "la convivencia",
            "match": "convivencia(?! vial)"
          }
        ]
      },
      {
        "id": "road-education",
        "grade": 6,
        "label": "la educación y la convivencia vial",
        "match": "vial",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "d35e9bed-cdaf-52b7-87eb-7aa2674200b9",
          "b78f069c-1ab3-5b99-b3d9-2ebab6aa9527",
          "8375ce1e-88ef-5419-8268-d75153281aa0"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50,
        "facets": [
          {
            "label": "la educación vial",
            "match": "educacion vial|educacion y la convivencia vial"
          },
          {
            "label": "la convivencia vial",
            "match": "convivencia vial"
          }
        ]
      },
      {
        "id": "electoral-system",
        "grade": 6,
        "label": "el sistema y los procedimientos electorales solicitados",
        "match": "electoral|electorales",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "3c4ad8cf-899f-5a63-8718-69fab961b9a8",
          "a8ae2099-71b4-5e88-a9ae-44e7ccbe5765"
        ],
        "pages": [
          488,
          489
        ],
        "priority": 50,
        "facets": [
          {
            "label": "el procedimiento electoral de la simulación escolar",
            "match": "simulacion.*electoral|proceso electoral escolar"
          },
          {
            "label": "las fortalezas y debilidades del sistema electoral dominicano",
            "match": "sistema electoral dominicano"
          }
        ]
      },
      {
        "id": "women-rights",
        "grade": 6,
        "label": "los derechos de la mujer",
        "match": "derechos de la mujer",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "5b0e2fc4-b1bf-5530-8ee7-e0a5cd33ca7c"
        ],
        "pages": [
          489
        ],
        "priority": 50
      },
      {
        "id": "national-symbols",
        "grade": 6,
        "label": "la bandera y el himno nacional en el contexto dado",
        "match": "bandera|himno nacional",
        "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
        "sourceRecordIds": [
          "08d7b730-d448-5697-873a-a15d749f37a3"
        ],
        "pages": [
          489
        ],
        "priority": 50
      }
    ],
    "evidence": {
      "interpretation": {
        "title": "Comprensión de {label}",
        "weight": 3,
        "levels": [
          "Explica las relaciones expresamente solicitadas de {label} con información pertinente del material dado, diferenciando información e interpretación.",
          "Explica las relaciones centrales de {label} con información del material; una relación secundaria queda poco desarrollada.",
          "Reconoce información pertinente de {label}, pero una relación central queda sin explicar o sin apoyo en el material.",
          "La explicación de {label} contradice una relación central del material o se apoya en afirmaciones ajenas al caso.",
          "No presenta una explicación reconocible de {label} basada en el material dado."
        ]
      },
      "identification": {
        "title": "Identificación de {label}",
        "weight": 2,
        "levels": [
          "Identifica los elementos solicitados de {label} y vincula cada uno con la evidencia o condición correspondiente del caso dado.",
          "Identifica los elementos centrales de {label} con respaldo; una correspondencia secundaria queda incompleta.",
          "Identifica algunos elementos de {label}, pero omite o confunde una correspondencia central con el caso.",
          "Las identificaciones de {label} contradicen las condiciones dadas y no permiten reconocer los elementos solicitados.",
          "No identifica elementos pertinentes de {label} en el caso dado."
        ]
      },
      "comparison": {
        "title": "Comparación de {label}",
        "weight": 3,
        "levels": [
          "Contrasta las formas o actuaciones solicitadas de {label} utilizando el mismo aspecto de comparación y evidencias de los casos dados.",
          "Contrasta las diferencias centrales de {label} sobre un mismo aspecto; una evidencia secundaria queda incompleta.",
          "Describe las opciones de {label}, pero no mantiene el aspecto común de comparación o deja sin respaldo una diferencia central.",
          "Confunde las opciones de {label} o atribuye diferencias incompatibles con los casos dados.",
          "No presenta una comparación reconocible de {label}."
        ]
      },
      "document-analysis": {
        "title": "Análisis de disposiciones sobre {label}",
        "weight": 3,
        "levels": [
          "Distingue lo que establecen los artículos dados sobre {label} y relaciona sus disposiciones con las evidencias y condiciones del caso, sin atribuirles alcances que el texto no respalda.",
          "Relaciona las disposiciones centrales sobre {label} con el caso; una condición secundaria queda sin desarrollar.",
          "Reconoce disposiciones sobre {label}, pero una relación central con el caso queda sin respaldo o confunde texto e interpretación.",
          "Atribuye al texto una disposición central sobre {label} que no contiene o la aplica a condiciones incompatibles.",
          "No presenta un análisis reconocible de los artículos dados sobre {label}."
        ]
      },
      "source-selection": {
        "title": "Selección de fuentes sobre {label}",
        "weight": 2,
        "levels": [
          "Selecciona entre los materiales dados las fuentes pertinentes y confiables para la pregunta sobre {label}, respetando las condiciones de selección solicitadas.",
          "Selecciona las fuentes centrales pertinentes y confiables sobre {label}; una selección secundaria queda incompleta.",
          "Incluye alguna fuente pertinente sobre {label}, pero omite una central o incorpora otra que no responde a la pregunta.",
          "La selección sobre {label} se apoya principalmente en materiales ajenos a la pregunta o sin las condiciones de confiabilidad dadas.",
          "No presenta una selección reconocible de fuentes pertinentes sobre {label}."
        ]
      },
      "source-credibility": {
        "title": "Justificación de la confiabilidad sobre {label}",
        "weight": 2,
        "levels": [
          "Justifica la selección de fuentes sobre {label} con la autoría, procedencia o respaldo verificable que muestran los materiales dados y relaciona esa evidencia con su confiabilidad.",
          "Justifica la confiabilidad de las fuentes centrales sobre {label} con respaldo verificable; una justificación secundaria queda incompleta.",
          "Menciona autoría o procedencia sobre {label}, pero no explica su relación con la confiabilidad de una fuente central.",
          "Justifica las fuentes sobre {label} solo por preferencias o por respaldo que los materiales no muestran.",
          "No presenta una justificación reconocible de la confiabilidad de las fuentes sobre {label}."
        ]
      },
      "attribution": {
        "title": "Atribución de informaciones sobre {label}",
        "weight": 2,
        "levels": [
          "Vincula las informaciones utilizadas sobre {label} con sus fuentes identificables y aplica {style} de forma que se distingue la información tomada del aporte propio.",
          "Atribuye las informaciones centrales sobre {label} y sigue {style}; falta un dato secundario sin impedir identificar la fuente.",
          "Atribuye parte de las informaciones sobre {label}, pero una fuente central no es identificable o mezcla información tomada y aporte propio.",
          "La atribución sobre {label} remite a fuentes ajenas a las informaciones utilizadas o incumple las referencias centrales de {style}.",
          "No presenta atribución reconocible de las informaciones utilizadas sobre {label}."
        ]
      },
      "research": {
        "title": "Indagación sobre {label}",
        "weight": 3,
        "levels": [
          "Responde la pregunta sobre {label} mediante los materiales y registros dados, relaciona los hallazgos con las evidencias y delimita lo que esas evidencias permiten concluir.",
          "Relaciona los hallazgos centrales de {label} con la pregunta y las evidencias; una delimitación secundaria queda incompleta.",
          "Recoge información sobre {label}, pero una conclusión central no se vincula con la pregunta o sus evidencias.",
          "Presenta conclusiones sobre {label} contrarias a los registros dados o sin evidencia pertinente.",
          "No presenta hallazgos reconocibles de la indagación solicitada sobre {label}."
        ]
      },
      "data-record": {
        "title": "Registro de informaciones sobre {label}",
        "weight": 2,
        "levels": [
          "Registra las informaciones solicitadas de {label} conservando valores, categorías y procedencia del conjunto dado, sin convertir inferencias en datos observados.",
          "Conserva los datos centrales de {label} y su procedencia; falta una referencia secundaria sin alterar su significado.",
          "Registra parte de la información de {label}, pero una omisión o cambio central impide relacionarla con su procedencia.",
          "Altera valores o categorías centrales de {label} o presenta inferencias sin distinguirlas de los datos dados.",
          "No presenta un registro reconocible de las informaciones solicitadas de {label}."
        ]
      },
      "research-plan": {
        "title": "Propuesta de investigación sobre {label}",
        "weight": 3,
        "levels": [
          "Articula la pregunta sobre {label}, las fuentes o registros dados, los pasos y el producto previstos de modo que permitirían responderla; distingue planificación y resultados aún no obtenidos.",
          "La pregunta, fuentes y pasos centrales de {label} son coherentes; un componente secundario previsto queda poco desarrollado.",
          "Incluye componentes de investigación sobre {label}, pero un paso central o una fuente no responde a la pregunta.",
          "La pregunta y los pasos propuestos sobre {label} son incompatibles o presentan resultados supuestos como ya obtenidos.",
          "No presenta una propuesta reconocible de investigación sobre {label}."
        ]
      },
      "project-steps": {
        "title": "Selección de pasos sobre {label}",
        "weight": 2,
        "levels": [
          "Selecciona y ordena únicamente los pasos solicitados sobre {label} de acuerdo con su finalidad y dependencias en las opciones dadas.",
          "Selecciona los pasos centrales sobre {label} en orden coherente; una relación secundaria queda incompleta.",
          "Selecciona algunos pasos pertinentes sobre {label}, pero omite uno central o altera una dependencia necesaria.",
          "La selección u orden de pasos sobre {label} impide atender la finalidad dada.",
          "No presenta una selección reconocible de pasos sobre {label}."
        ]
      },
      "revision": {
        "title": "Corrección acotada de {label}",
        "weight": 2,
        "levels": [
          "Corrige únicamente {target} en el texto dado sobre {label}, atendiendo las observaciones y conservando los apartados no señalados.",
          "Corrige el problema central de {target} sobre {label}; queda un ajuste secundario sin modificar apartados ajenos.",
          "Corrige parte de {target} sobre {label}, pero deja una observación central sin resolver o cambia un apartado no solicitado.",
          "Los cambios sobre {label} no resuelven el problema central de {target} o sustituyen el texto por otro ajeno.",
          "No presenta una corrección reconocible de {target} sobre {label}."
        ]
      },
      "draft": {
        "title": "Borrador solicitado sobre {label}",
        "weight": 2,
        "levels": [
          "Redacta el borrador sobre {label} con las secciones y correcciones expresamente indicadas en la pauta, conservando la coherencia entre sus componentes y su carácter de propuesta.",
          "El borrador de {label} incorpora los componentes centrales de la pauta; un ajuste secundario queda incompleto.",
          "El borrador de {label} incluye parte de la pauta, pero omite o desvincula un componente central.",
          "El borrador de {label} contradice las correcciones o componentes centrales indicados en la pauta.",
          "No presenta un borrador reconocible sobre {label} según la pauta dada."
        ]
      },
      "newspaper": {
        "title": "Periódico escolar sobre {label}",
        "weight": 3,
        "levels": [
          "Organiza el problema dado de {label} en secciones y artículos coherentes, diferencia información y opinión y utiliza las evidencias proporcionadas sin presentar hechos ficticios como noticias reales.",
          "Las secciones y artículos centrales de {label} atienden el problema con evidencias; una conexión secundaria queda incompleta.",
          "Incluye secciones o artículos de {label}, pero falta una relación central con el problema o confunde información y opinión.",
          "Los artículos sobre {label} contradicen el material dado o su organización impide reconocer el problema abordado.",
          "No presenta un periódico escolar reconocible sobre {label}."
        ]
      },
      "newspaper-structure": {
        "title": "Estructura elegida del periódico sobre {label}",
        "weight": 2,
        "levels": [
          "Selecciona las secciones y su organización para el periódico sobre {label} y justifica cómo atienden el propósito dado, sin sustituir esta decisión por artículos completos.",
          "La estructura de {label} atiende el propósito central y su justificación; una relación secundaria queda incompleta.",
          "Selecciona secciones sobre {label}, pero una decisión central no responde al propósito o queda sin justificación.",
          "La estructura elegida sobre {label} es incompatible con el propósito o no permite reconocer las secciones solicitadas.",
          "No presenta una estructura reconocible del periódico sobre {label}."
        ]
      },
      "article": {
        "title": "Artículo sobre {label}",
        "weight": 3,
        "levels": [
          "El artículo de {label} expone el aporte solicitado relacionándolo con las evidencias dadas, con organización que permite seguir el contenido y sin inventar hechos.",
          "El artículo de {label} presenta el contenido central respaldado y organizado; una conexión secundaria queda incompleta.",
          "El artículo incluye información pertinente de {label}, pero omite un componente central o deja una afirmación central sin respaldo.",
          "El artículo sobre {label} contradice las evidencias centrales o desvincula la información de su propósito.",
          "No presenta un artículo reconocible sobre {label}."
        ]
      },
      "memory": {
        "title": "Memoria sobre {label}",
        "weight": 3,
        "levels": [
          "La memoria de {label} reconstruye las actuaciones solicitadas y su secuencia a partir de las fuentes dadas, con organización que permite seguir el contenido y sin inventar hechos.",
          "La memoria de {label} presenta el contenido central respaldado y organizado; una conexión secundaria queda incompleta.",
          "La memoria incluye información pertinente de {label}, pero omite un componente central o deja una afirmación central sin respaldo.",
          "La memoria sobre {label} contradice las evidencias centrales o desvincula la información de su propósito.",
          "No presenta una memoria reconocible sobre {label}."
        ]
      },
      "report": {
        "title": "Informe sobre {label}",
        "weight": 3,
        "levels": [
          "El informe de {label} sintetiza las funciones o informaciones solicitadas distinguiendo las evidencias dadas de las inferencias, con organización que permite seguir el contenido y sin inventar hechos.",
          "El informe de {label} presenta el contenido central respaldado y organizado; una conexión secundaria queda incompleta.",
          "El informe incluye información pertinente de {label}, pero omite un componente central o deja una afirmación central sin respaldo.",
          "El informe sobre {label} contradice las evidencias centrales o desvincula la información de su propósito.",
          "No presenta un informe reconocible sobre {label}."
        ]
      },
      "thesis": {
        "title": "Tesis sobre {label}",
        "weight": 3,
        "levels": [
          "Formula una tesis precisa sobre {label} que responde al problema solicitado y se mantiene como eje del ensayo.",
          "La tesis de {label} responde al problema y orienta el ensayo; una delimitación secundaria queda imprecisa.",
          "Presenta una postura sobre {label}, pero no delimita el problema central o no la mantiene en el desarrollo.",
          "La postura sobre {label} es incompatible con el problema solicitado o se contradice en el ensayo.",
          "No presenta una tesis reconocible sobre {label}."
        ]
      },
      "reason": {
        "title": "Razones sobre {label}",
        "weight": 3,
        "levels": [
          "Sostiene la posición sobre {label} con razones pertinentes y evidencias del caso o textos dados, explicando cómo la respaldan sin calificar adhesiones personales.",
          "Sostiene la posición central de {label} con razones y evidencias; un vínculo secundario queda poco desarrollado.",
          "Expresa razones sobre {label}, pero una afirmación central carece de respaldo o de relación con la posición.",
          "Las razones sobre {label} contradicen las evidencias centrales o solo apelan a preferencias sin relación con el caso.",
          "No presenta razones reconocibles que sustenten la posición sobre {label}."
        ]
      },
      "organization": {
        "title": "Organización del ensayo sobre {label}",
        "weight": 2,
        "levels": [
          "Organiza planteamiento, desarrollo y cierre del ensayo de {label} de modo que puede seguirse la relación entre tesis, razones y conclusión.",
          "La secuencia del ensayo de {label} permite seguir tesis y razones; una transición secundaria queda incompleta.",
          "El ensayo de {label} tiene partes reconocibles, pero una ruptura central impide seguir el razonamiento.",
          "La organización del ensayo de {label} desvincula la conclusión de la tesis y las razones.",
          "No presenta una organización reconocible del ensayo sobre {label}."
        ]
      },
      "response": {
        "title": "Respuesta en el intercambio sobre {label}",
        "weight": 2,
        "levels": [
          "Responde a las intervenciones u objeciones sobre {label} atendiendo su contenido y relacionando la respuesta con evidencias o razones del caso dado.",
          "Atiende las intervenciones centrales de {label} con razones pertinentes; una conexión secundaria queda incompleta.",
          "Responde parcialmente sobre {label}, pero evita una objeción central o no relaciona su respuesta con el caso.",
          "La respuesta de {label} no atiende la intervención o atribuye al interlocutor una afirmación que no hizo.",
          "No presenta una respuesta reconocible a las intervenciones sobre {label}."
        ]
      },
      "oral": {
        "title": "Comunicación oral de {label}",
        "weight": 2,
        "levels": [
          "Comunica oralmente la explicación solicitada de {label} en una secuencia comprensible y con referencias identificables a los materiales dados.",
          "La exposición oral de {label} permite seguir las ideas centrales; una transición secundaria dificulta el seguimiento.",
          "Comunica ideas pertinentes de {label}, pero una ruptura central de secuencia o referencia impide seguir la explicación.",
          "La exposición de {label} desvincula las ideas centrales o no permite comprender la explicación solicitada.",
          "No presenta una comunicación oral reconocible sobre {label}."
        ]
      },
      "proposal": {
        "title": "Propuesta pertinente sobre {label}",
        "weight": 3,
        "levels": [
          "Propone una respuesta al problema dado de {label}, precisa las acciones previstas solicitadas y justifica cómo atienden sus condiciones sin presentar la ejecución como realizada.",
          "La respuesta propuesta de {label} y las acciones centrales atienden el problema; una justificación secundaria queda incompleta.",
          "Propone acciones sobre {label}, pero una acción central no responde al problema o queda sin justificación.",
          "La propuesta de {label} contradice las condiciones centrales del problema o afirma resultados sin sustento.",
          "No presenta una propuesta reconocible sobre {label}."
        ]
      },
      "project-plan": {
        "title": "Proyecto de {label}",
        "weight": 3,
        "levels": [
          "Relaciona el problema de {label} con acciones, responsables y una forma de comprobar resultados previstos según la pauta dada, distinguiendo planificación y ejecución.",
          "Los componentes centrales del proyecto de {label} son coherentes; una relación secundaria de la planificación queda incompleta.",
          "Incluye componentes de proyecto sobre {label}, pero desvincula una acción o comprobación central del problema.",
          "El proyecto de {label} propone acciones incompatibles con el problema o presenta resultados supuestos como obtenidos.",
          "No presenta un proyecto reconocible sobre {label}."
        ]
      },
      "campaign-plan": {
        "title": "Campaña prevista sobre {label}",
        "weight": 3,
        "levels": [
          "Articula propósito, destinatarios, mensaje y acciones previstas de la campaña ficticia sobre {label} para atender el problema dado, sin exigir ejecución externa.",
          "Los componentes centrales de la campaña de {label} son coherentes; una relación secundaria queda poco desarrollada.",
          "Incluye componentes de campaña de {label}, pero el mensaje o una acción central no responde al propósito y destinatarios.",
          "La campaña de {label} contradice el problema dado o no permite relacionar mensaje, propósito y destinatarios.",
          "No presenta una campaña prevista reconocible sobre {label}."
        ]
      },
      "campaign-message": {
        "title": "Mensaje de campaña sobre {label}",
        "weight": 2,
        "levels": [
          "Redacta el mensaje solicitado de {label} con información pertinente y comprensible para los destinatarios dados, conservando el alcance del encargo sin añadir un plan completo.",
          "El mensaje de {label} comunica la idea central a los destinatarios; una precisión secundaria queda incompleta.",
          "El mensaje de {label} incluye información pertinente, pero una parte central resulta confusa para los destinatarios.",
          "El mensaje de {label} contradice el material dado o no responde a los destinatarios y propósito.",
          "No presenta un mensaje reconocible de campaña sobre {label}."
        ]
      },
      "brochure": {
        "title": "Brochure sobre {label}",
        "weight": 3,
        "levels": [
          "Organiza información y recomendaciones pertinentes de {label} en un brochure legible para los destinatarios dados, relacionando sus mensajes con los textos y el propósito solicitado.",
          "El brochure de {label} comunica información y recomendaciones centrales con organización legible; una conexión secundaria queda incompleta.",
          "Incluye información de {label}, pero una recomendación central carece de respaldo o la organización dificulta reconocer el mensaje.",
          "El brochure de {label} contradice información central de los textos o no permite reconocer las recomendaciones solicitadas.",
          "No presenta un brochure reconocible sobre {label}."
        ]
      },
      "organizer": {
        "title": "Organizador elegido sobre {label}",
        "weight": 3,
        "levels": [
          "Distingue en el cuadro sinóptico u organizador elegido las actuaciones solicitadas de {label}, utilizando categorías y relaciones respaldadas por los casos dados, sin exigir los dos formatos.",
          "El organizador distingue las categorías y relaciones centrales de {label}; una relación secundaria queda incompleta.",
          "El organizador incluye actuaciones de {label}, pero omite o confunde una categoría o relación central.",
          "Las categorías o relaciones centrales del organizador de {label} contradicen los casos dados.",
          "No presenta un organizador reconocible sobre {label}."
        ]
      },
      "electoral-procedure": {
        "title": "Procedimiento electoral simulado sobre {label}",
        "weight": 3,
        "levels": [
          "Ejecuta los pasos establecidos del proceso electoral ficticio de {label} y registra la decisión según las reglas dadas, sin calificar la opción elegida o el resultado ganador.",
          "Ejecuta y registra los pasos centrales del proceso electoral de {label}; omite un paso secundario sin cambiar la decisión registrada.",
          "Ejecuta parte del proceso electoral de {label}, pero omite un paso central o el registro no permite comprobar la regla aplicada.",
          "La actuación de {label} altera una regla central del proceso dado o registra una decisión distinta de la obtenida.",
          "No presenta una ejecución reconocible del procedimiento electoral simulado sobre {label}."
        ]
      },
      "decision-procedure": {
        "title": "Decisión democrática simulada sobre {label}",
        "weight": 3,
        "levels": [
          "Aplica el método y los turnos dados en la simulación de {label} y registra la decisión acordada según ese procedimiento, sin evaluar preferencias privadas.",
          "Aplica el método y los turnos centrales de {label}; una omisión secundaria no altera la decisión registrada.",
          "Aplica parte del procedimiento de {label}, pero omite un turno o paso central necesario para verificar la decisión.",
          "La actuación de {label} sustituye el método acordado o registra una decisión incompatible con el procedimiento dado.",
          "No presenta una aplicación reconocible del procedimiento de decisión sobre {label}."
        ]
      },
      "role-contribution": {
        "title": "Contribución del rol sobre {label}",
        "weight": 2,
        "levels": [
          "Realiza la contribución concreta de su rol acordado en la simulación de {label} según la pauta dada y la coordina con el momento previsto del procedimiento.",
          "Realiza la contribución central del rol de {label}; un ajuste secundario de coordinación queda incompleto.",
          "Realiza parte de la contribución del rol de {label}, pero omite una acción central prevista en la pauta.",
          "La contribución del rol de {label} es incompatible con la acción o el momento acordados en el procedimiento.",
          "No presenta una contribución reconocible del rol acordado sobre {label}."
        ]
      },
      "ritual-procedure": {
        "title": "Procedimiento ritual expresamente solicitado",
        "weight": 2,
        "levels": [
          "Ejecuta la secuencia y los roles dados para el izado de la bandera y la escucha del himno en la simulación, atendiendo únicamente las acciones observables de la pauta.",
          "Ejecuta las acciones centrales del procedimiento dado de bandera e himno; una omisión secundaria no altera la secuencia.",
          "Ejecuta parte de la secuencia de bandera e himno, pero omite un paso o rol central de la pauta.",
          "La actuación sobre bandera e himno contradice el orden o los roles centrales del procedimiento dado.",
          "No presenta una ejecución reconocible del procedimiento dado de bandera e himno."
        ]
      },
      "frequency": {
        "title": "Registro de frecuencia en la simulación de {label}",
        "weight": 2,
        "levels": [
          "Registra la frecuencia del cumplimiento observable de los turnos dados de {label}, conservando las ocasiones y categorías previstas en la pauta.",
          "Registra las ocasiones centrales del cumplimiento de turnos de {label}; falta una anotación secundaria sin alterar el patrón observado.",
          "Registra algunas ocasiones de {label}, pero una omisión central impide establecer la frecuencia pedida.",
          "El registro de {label} confunde las categorías u ocasiones y no representa la frecuencia observada.",
          "No presenta un registro reconocible de frecuencia sobre {label}."
        ]
      },
      "reliability-analysis": {
        "title": "Análisis de la confiabilidad de las páginas dadas",
        "weight": 3,
        "levels": [
          "Explica la confiabilidad de las páginas solicitadas relacionando autoría, procedencia y respaldo verificable con la información y el propósito dados.",
          "Relaciona la confiabilidad central de las páginas con autoría, procedencia o respaldo; una relación secundaria queda incompleta.",
          "Reconoce procedencia o respaldo de las páginas, pero no explica su relación con una conclusión central de confiabilidad.",
          "La conclusión de confiabilidad contradice la procedencia o el respaldo de las páginas dadas.",
          "No presenta un análisis reconocible de la confiabilidad de las páginas dadas."
        ]
      }
    }
  }
],
version:"evaluation-2026.135"} as unknown as EvaluationCatalog
