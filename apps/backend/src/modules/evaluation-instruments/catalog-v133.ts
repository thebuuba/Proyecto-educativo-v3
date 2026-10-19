import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV132 } from './catalog-v132'
/** Exact133 payload checked against Development, including the reviewed HCS fourth-grade philosophy metadata. */
export const evaluationCatalogV133={...evaluationCatalogV132,optativeSocialModules:[
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
  }
],
version:"evaluation-2026.133"} as unknown as EvaluationCatalog
