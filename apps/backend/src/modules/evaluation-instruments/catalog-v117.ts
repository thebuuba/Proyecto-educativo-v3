import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV116 } from './catalog-v116'
/** Exact117 payload checked against Development; previous fields remain inherited. */
export const evaluationCatalogV117={...evaluationCatalogV116,version:'evaluation-2026.117',physicalCommonModules:[
  {
    "id": "educacion-fisica-comun-1",
    "grade": 1,
    "topics": [
      {
        "id": "movement-rhythm",
        "grade": 1,
        "label": "movimiento y ritmo",
        "match": "movimientos?.*(?:ritmo|cadencia)|(?:ritmo|cadencia).*movimientos?",
        "relation": "la relación entre la secuencia de movimientos y el ritmo expresamente elegido",
        "pdfPages": [
          359,
          361
        ],
        "sourceRecordIds": [
          "41cf5901-6841-5dd1-9bd6-10322aba6c32",
          "cd7e86c2-4340-5533-a6e3-84070512c900",
          "2e4d311d-c304-5e20-8db3-1551d39d76c1"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Correspondencia del movimiento y el ritmo",
            "success": "Combina los movimientos adaptados dados siguiendo el ritmo elegido y las señales acordadas, con los apoyos permitidos.",
            "sufficient": "La correspondencia rítmica se reconoce; un ajuste secundario pierde continuidad sin romper la secuencia.",
            "partial": "Realiza movimientos pertinentes, pero una entrada o transición no responde al ritmo o señal acordados.",
            "error": "Las entradas o transiciones contradicen las señales dadas y no permiten reconocer la relación rítmica solicitada."
          }
        ]
      },
      {
        "id": "free-improvisation",
        "grade": 1,
        "label": "improvisación motriz adaptada",
        "match": "improvisa[a-z]*.*(?:movimiento|secuencia)|movimientos? libres?",
        "relation": "la relación entre respuestas, variaciones del movimiento y espacio adaptado de la improvisación",
        "pdfPages": [
          359,
          361
        ],
        "sourceRecordIds": [
          "a0dcf1c9-bbce-5f04-aeff-e55e6626920c",
          "f94730cd-3b3f-52ae-a819-6bc3d9816326"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Respuestas y variaciones motrices",
            "success": "Relaciona las respuestas y variaciones del movimiento en la improvisación con el espacio y las condiciones adaptadas expresamente dados.",
            "sufficient": "Las variaciones y respuestas se reconocen; una transición secundaria queda poco definida.",
            "partial": "Presenta movimientos pertinentes, pero una variación no responde a las condiciones de la improvisación.",
            "error": "Las respuestas contradicen las condiciones dadas o no permiten reconocer una secuencia de improvisación."
          }
        ]
      },
      {
        "id": "expressive-situation",
        "grade": 1,
        "label": "representación corporal de una circunstancia",
        "match": "representa[a-z]*.*(?:circunstancia|situacion)|expresion corporal.*(?:emocion|sentimiento)",
        "relation": "la relación entre gesto, ritmo, postura y circunstancia representada",
        "pdfPages": [
          359,
          361
        ],
        "sourceRecordIds": [
          "0bd3dadf-2f26-586f-b884-875fb89b3a3a",
          "f94730cd-3b3f-52ae-a819-6bc3d9816326"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Recursos corporales y circunstancia",
            "success": "Relaciona gesto, ritmo y postura con la circunstancia ficticia del guion para hacer reconocible la representación, distinguiendo personaje y persona.",
            "sufficient": "La circunstancia se reconoce; un recurso secundario deja una ambigüedad sin alterar su sentido principal.",
            "partial": "Presenta gestos pertinentes, pero una relación con la circunstancia o el guion queda sin resolver.",
            "error": "Los recursos corporales contradicen la circunstancia del guion o la sustituyen por una atribución de emociones privadas."
          }
        ]
      },
      {
        "id": "expressive-control",
        "grade": 1,
        "label": "tensión y relajación expresivas",
        "match": "tension.*relajacion|relajacion.*tension",
        "relation": "la función de tensión y relajación en el mensaje corporal del referente",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "92fca148-7e23-5577-9ac8-56982f5db931"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Control expresivo y mensaje",
            "success": "Relaciona la tensión y relajación de la secuencia adaptada con la claridad del mensaje acordado, utilizando los apoyos permitidos.",
            "sufficient": "El mensaje y sus contrastes se reconocen; un cambio secundario de tensión queda poco definido.",
            "partial": "Presenta contrastes pertinentes, pero uno no se vincula con el mensaje o transición acordados.",
            "error": "Los contrastes contradicen el mensaje o impiden reconocer la secuencia según sus condiciones adaptadas."
          }
        ]
      },
      {
        "id": "general-gymnastics-rules",
        "grade": 1,
        "label": "reglas de gimnasia general",
        "match": "(?:reglas?|reglamento).*gimnasia general|gimnasia general.*(?:reglas?|reglamento)",
        "relation": "las funciones y condiciones de las reglas de gimnasia general expresamente asignadas",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "314eb64e-4508-5986-a21f-552720003272"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Reglas y evidencias de la secuencia",
            "success": "Analiza si las acciones registradas responden a las reglas de gimnasia general proporcionadas, sustentando cada decisión con evidencias del referente.",
            "sufficient": "Las decisiones principales se sustentan; una referencia secundaria a la regla queda poco precisada.",
            "partial": "Identifica una regla pertinente, pero una decisión no se vincula con la acción registrada.",
            "error": "Aplica una regla no proporcionada o atribuye a la secuencia un cumplimiento incompatible con sus evidencias."
          }
        ]
      },
      {
        "id": "dance-elements",
        "grade": 1,
        "label": "elementos de danza adaptada",
        "match": "danza adaptad[a-z]*|elementos? (?:corporales? de |basicos? de )?danza",
        "relation": "la relación de los elementos de danza elegidos con ritmo, dirección y apoyos acordados",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "7accce58-5cc5-5d10-aa87-37958e6110ef",
          "799d283c-f311-57e2-baaf-7a52064d3072"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Elementos y transiciones de danza",
            "success": "Ejecuta las marchas y movimientos de brazos expresamente dados relacionando ritmo, dirección y apoyos acordados en la secuencia adaptada.",
            "sufficient": "Los elementos y su secuencia se reconocen; una transición secundaria pierde continuidad sin alterar el recorrido.",
            "partial": "Presenta elementos pertinentes, pero una transición no responde a la dirección o señal acordadas.",
            "error": "Las decisiones de movimiento contradicen las condiciones dadas o no permiten reconocer los elementos solicitados."
          }
        ]
      },
      {
        "id": "implement-handling",
        "grade": 1,
        "label": "agarre y manipulación de implementos",
        "match": "(?:agarre|manipulacion|manejo).*implemento|implemento.*(?:agarre|manipulacion)",
        "relation": "la relación entre agarre, control y función del implemento expresamente elegido",
        "pdfPages": [
          359,
          361
        ],
        "sourceRecordIds": [
          "702b7c4c-999b-5a11-9f79-2dd1cefa5777",
          "dae24a1e-4732-5b63-b36f-0798e4eada1e"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Agarre y función del movimiento",
            "success": "Explica el agarre del implemento elegido y su relación con el movimiento mediante evidencias del referente y la ficha proporcionada.",
            "sufficient": "El agarre y su función se reconocen; una relación secundaria queda poco precisada.",
            "partial": "Identifica un agarre pertinente, pero su relación con el movimiento carece de sustento.",
            "error": "Atribuye al agarre o implemento una función incompatible con el referente o sustituye el análisis por maniobras no solicitadas.",
            "variants": {
              "PERFORMANCE": {
                "title": "Agarre y control del implemento",
                "success": "Manipula el implemento ligero expresamente asignado relacionando agarre y control con las condiciones adaptadas dadas y los apoyos permitidos.",
                "sufficient": "El agarre y su control se reconocen; una transición secundaria pierde continuidad.",
                "partial": "Presenta acciones pertinentes, pero una decisión de agarre o control no corresponde a la condición dada.",
                "error": "Las decisiones de manipulación contradicen las condiciones acordadas o impiden reconocer el control solicitado."
              }
            }
          }
        ]
      },
      {
        "id": "divergent-movement",
        "grade": 1,
        "label": "variantes motrices con implementos",
        "match": "variantes?.*movimiento.*implemento|movimientos?.*divergent",
        "relation": "la relación entre variaciones motrices, espacio y función del implemento elegido",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "245a6d32-9d8f-58a6-b715-535326ee55d1"
        ],
        "primaryPurpose": "PRODUCTION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Variantes y propósito del juego",
            "success": "Crea las variantes de movimiento solicitadas relacionando el implemento elegido y el uso del espacio con el propósito del juego adaptado dado.",
            "sufficient": "Las variantes y su propósito se reconocen; una relación espacial secundaria queda poco definida.",
            "partial": "Presenta variantes pertinentes, pero una elección de movimiento no contribuye al propósito acordado.",
            "error": "Las variantes contradicen las condiciones de espacio o implemento, o no permiten reconocer el propósito del juego."
          }
        ]
      },
      {
        "id": "gymnastics-sequence",
        "grade": 1,
        "label": "composición y secuencia gimnástica adaptada",
        "match": "(?:secuencia|composicion) gimnastic[a-z]*",
        "relation": "la relación entre orden, transiciones, formaciones y recursos de la composición gimnástica adaptada",
        "pdfPages": [
          359,
          361
        ],
        "sourceRecordIds": [
          "f8842e65-1abd-5b98-810f-f78a03f1812c",
          "893eebf0-a965-5c24-a755-365e5f3d4d47",
          "3de07083-482a-532b-a14e-b4de34945273"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Secuencia y formaciones gimnásticas",
            "success": "Ejecuta la secuencia gimnástica adaptada dada relacionando orden, transiciones y formaciones acordadas con los apoyos permitidos.",
            "sufficient": "La secuencia y las formaciones se reconocen; una transición secundaria pierde continuidad.",
            "partial": "Presenta movimientos pertinentes, pero una transición no enlaza las formaciones acordadas.",
            "error": "El orden o las formaciones contradicen las condiciones dadas o no permiten reconocer la secuencia solicitada.",
            "plan": {
              "title": "Plan de composición gimnástica",
              "success": "Planifica el orden, las transiciones y las formaciones de la composición gimnástica adaptada con el espacio, movimientos y recurso expresamente proporcionados.",
              "sufficient": "El plan relaciona movimientos y espacio; una transición secundaria queda poco precisada.",
              "partial": "El plan identifica movimientos pertinentes, pero una formación no se vincula con la secuencia prevista.",
              "error": "El orden o las formaciones previstos contradicen las condiciones dadas o impiden organizar la composición solicitada."
            }
          }
        ]
      },
      {
        "id": "circuit-plan",
        "grade": 1,
        "label": "organización de un circuito adaptado",
        "match": "circuito adaptado|estaciones?.*pausas?|pausas?.*estaciones?",
        "relation": "la relación entre estaciones, acciones, orden y pausas fijados en la ficha docente",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "e12183bb-7ab8-56fb-8e84-4fc18d4da294",
          "b3c5294e-bc83-56be-b21e-1fadeff61881"
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan de estaciones y pausas dadas",
            "success": "Planifica la organización del circuito adaptado relacionando estaciones, acciones y pausas ya fijadas en la ficha docente, sin añadir intensidad o duración nuevas.",
            "sufficient": "El plan relaciona las estaciones y pausas; una referencia secundaria al orden queda poco precisada.",
            "partial": "Identifica estaciones pertinentes, pero una relación de orden o pausa no corresponde a la ficha dada.",
            "error": "El plan modifica las condiciones proporcionadas o introduce dosis físicas no sustentadas en la ficha.",
            "variants": {
              "PERFORMANCE": {
                "title": "Estaciones y pausas del circuito dado",
                "success": "Ejecuta la secuencia de estaciones y acciones del circuito adaptado respetando las pausas y apoyos ya fijados en la ficha docente, sin añadir intensidad o duración nuevas.",
                "sufficient": "La secuencia de estaciones se reconoce; una transición secundaria pierde continuidad.",
                "partial": "Realiza acciones pertinentes, pero una transición o pausa no corresponde a la ficha dada.",
                "error": "Cambia las acciones o pausas de modo incompatible con las condiciones adaptadas proporcionadas."
              }
            }
          }
        ]
      },
      {
        "id": "flexibility-observation",
        "grade": 1,
        "label": "acciones de flexibilidad adaptadas",
        "match": "flexibilidad activa|flexibilidad pasiva|acciones? de flexibilidad",
        "relation": "la relación entre las acciones de flexibilidad elegidas y las condiciones adaptadas del referente",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "e6046f2e-6c81-5e55-9bbd-47f0fb6c14fc"
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Cumplimiento de acciones de flexibilidad",
            "success": "Identifica con evidencias si el referente cumple las acciones de flexibilidad expresamente adaptadas en la ficha docente, sin medir amplitud corporal ni añadir maniobras.",
            "sufficient": "La verificación se sustenta; una marca secundaria queda poco clara sin cambiar su resultado principal.",
            "partial": "Identifica acciones pertinentes, pero una marca no permite determinar si cumple la condición dada.",
            "error": "Atribuye un cumplimiento incompatible con el referente o lo sustituye por un juicio de amplitud o capacidad natural.",
            "variants": {
              "PERFORMANCE": {
                "title": "Acciones de flexibilidad adaptadas",
                "success": "Ejecuta las acciones de flexibilidad expresamente adaptadas en la ficha docente según las señales y apoyos acordados, sin puntuar amplitud corporal.",
                "sufficient": "Las acciones y sus señales se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Presenta acciones pertinentes, pero una respuesta no corresponde a la señal o adaptación acordadas.",
                "error": "Las acciones contradicen las condiciones adaptadas dadas o no permiten reconocer la secuencia solicitada."
              }
            }
          }
        ]
      },
      {
        "id": "continuous-activity-record",
        "grade": 1,
        "label": "registro de actividad continua",
        "match": "actividad continua|registro.*(?:inicio|pausas).*final",
        "relation": "la relación entre inicio, pausas, final y condiciones del registro de actividad continua dado",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "87b31f29-8fc9-5266-a834-d9513f1638b6"
        ],
        "primaryPurpose": "REPORT",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Organización del registro temporal",
            "success": "Organiza el registro ficticio de actividad continua relacionando inicio, pausas y final indicados con los datos proporcionados, sin fijar una duración nueva.",
            "sufficient": "La secuencia temporal se reconoce; una referencia secundaria queda poco precisada.",
            "partial": "Incluye datos pertinentes, pero una pausa o límite no se vincula con el registro proporcionado.",
            "error": "Cambia los tiempos registrados o atribuye a una persona una capacidad o duración no acreditadas por los datos.",
            "variants": {
              "PERFORMANCE": {
                "title": "Secuencia de actividad continua adaptada",
                "success": "Realiza la actividad continua según el inicio, las pausas y el final expresamente dados, utilizando los apoyos acordados sin fijar una duración nueva ni comparar resistencia personal.",
                "sufficient": "La secuencia y sus límites se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Presenta acciones pertinentes, pero una pausa o límite no corresponde a las condiciones dadas.",
                "error": "La secuencia contradice el inicio, las pausas o el final proporcionados para la actividad adaptada."
              }
            }
          }
        ]
      },
      {
        "id": "motor-variation",
        "grade": 1,
        "label": "variaciones de dirección y velocidad",
        "match": "secuencia motriz|cambio[a-z]* (?:de )?(?:direccion|velocidad)",
        "relation": "la relación entre cambios motrices solicitados, señales y apoyos de la secuencia adaptada",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "f4d28cea-9d90-5641-850d-3a93f2931396"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Respuestas a las señales motrices",
            "success": "Ejecuta los cambios de dirección y velocidad expresamente dados respondiendo a las señales y apoyos acordados de la secuencia adaptada.",
            "sufficient": "Los cambios y sus señales se reconocen; un ajuste secundario pierde continuidad sin romper la secuencia.",
            "partial": "Presenta respuestas pertinentes, pero un cambio no corresponde a la dirección o velocidad señaladas.",
            "error": "Las respuestas contradicen las señales dadas o impiden reconocer la secuencia motriz solicitada."
          }
        ]
      },
      {
        "id": "equilibrium-observation",
        "grade": 1,
        "label": "equilibrio y base de sustentación",
        "match": "equilibrio.*(?:base|referente)|base de sustentacion",
        "relation": "la relación entre base de sustentación, apoyos, plano y equilibrio del referente dado",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "a5950938-dfa9-5ecc-89a8-fcb1a754800b"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Base, apoyos y equilibrio del referente",
            "success": "Explica el equilibrio del referente relacionando base de sustentación, apoyos y plano expresamente señalados con evidencias de la ficha proporcionada.",
            "sufficient": "Las relaciones principales se sustentan; una referencia espacial secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación entre apoyo y equilibrio carece de sustento.",
            "error": "Atribuye al referente apoyos o efectos incompatibles con sus datos o sustituye el análisis por una maniobra no solicitada."
          }
        ]
      },
      {
        "id": "spatial-orientation",
        "grade": 1,
        "label": "orientación en un recorrido adaptado",
        "match": "recorrido adaptado|orientacion espacial|puntos cardinales",
        "relation": "la relación entre puntos cardinales, referencias y direcciones del recorrido dado",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "7fbdc113-d3f9-513b-81bb-961ab4d3170d"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias y direcciones del recorrido",
            "success": "Ubica los puntos señalados relacionando las direcciones relativas con el mapa y los puntos cardinales dados, sin imponer instrumentos adicionales.",
            "sufficient": "Las ubicaciones principales se reconocen; una referencia secundaria de dirección queda poco precisada.",
            "partial": "Localiza puntos pertinentes, pero una dirección no se vincula con la referencia acordada.",
            "error": "Las ubicaciones o direcciones contradicen el mapa y las referencias proporcionadas.",
            "variants": {
              "PERFORMANCE": {
                "title": "Referencias y decisiones del recorrido",
                "success": "Recorre el trayecto adaptado relacionando sus decisiones de dirección con el mapa y los puntos cardinales señalados, utilizando los apoyos permitidos.",
                "sufficient": "El trayecto y sus referencias se reconocen; una decisión secundaria de dirección pierde precisión.",
                "partial": "Realiza desplazamientos pertinentes, pero una dirección no se vincula con la referencia del mapa dada.",
                "error": "Las decisiones del recorrido contradicen las referencias proporcionadas o impiden reconocer el trayecto solicitado."
              }
            }
          }
        ]
      },
      {
        "id": "traditional-games-research",
        "grade": 1,
        "label": "origen y variantes de juegos tradicionales",
        "match": "origen.*juego tradicional|juego tradicional.*(?:origen|fuentes|hallazgos)|investiga.*juego tradicional",
        "relation": "la relación entre origen, variantes culturales y fuentes del juego tradicional dominicano elegido",
        "pdfPages": [
          359,
          360,
          361
        ],
        "sourceRecordIds": [
          "52222e4a-54d2-5390-a38f-3ff6d8d186f4",
          "c78151cf-17f6-5173-9c6f-a6460379d56a",
          "ea25b676-94ed-5f7d-8b10-ce0491029544"
        ],
        "primaryPurpose": "RESEARCH",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Origen y variantes sustentados",
            "success": "Investiga el origen y las variantes del juego tradicional elegido relacionando sus hallazgos con evidencias de las fuentes proporcionadas, distinguiendo datos e inferencias.",
            "sufficient": "Los hallazgos principales se sustentan; una referencia cultural secundaria queda poco precisada.",
            "partial": "Aporta información pertinente, pero una atribución de origen o variante carece de sustento.",
            "error": "Atribuye al juego un origen o variante incompatible con las fuentes o presenta una inferencia como hecho acreditado."
          }
        ]
      },
      {
        "id": "regional-games-record",
        "grade": 1,
        "label": "juegos populares por localidad",
        "match": "juegos? populares?.*(?:pueblos?|regiones?)|recopila.*juegos?.*(?:pueblos?|regiones?)",
        "relation": "la relación entre juegos populares, procedencia y variantes documentadas de las localidades dadas",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "e3a64078-7d60-5751-8c7c-32766668dabb"
        ],
        "primaryPurpose": "REPORT",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Procedencia y variantes del registro",
            "success": "Organiza el registro de juegos populares por las localidades expresamente dadas relacionando procedencia y variantes con las evidencias de las fichas proporcionadas.",
            "sufficient": "El criterio territorial se reconoce; una referencia secundaria de procedencia queda poco precisada.",
            "partial": "Incluye registros pertinentes, pero uno no se vincula con la localidad o variante documentada.",
            "error": "Asigna a un juego una procedencia o variante incompatible con las fichas o inventa datos de origen."
          }
        ]
      },
      {
        "id": "game-types-record",
        "grade": 1,
        "label": "juegos colaborativos y competitivos",
        "match": "registro de juegos|juegos colaborativos.*competitivos",
        "relation": "la relación entre propósito, reglas y modalidad de los juegos expresamente dados",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "9620a25f-db91-580c-a1d1-709505dce922"
        ],
        "primaryPurpose": "REPORT",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Propósito y reglas del registro",
            "success": "Organiza los juegos de las modalidades elegidas relacionando su propósito y reglas con las fichas proporcionadas, sin exigir otras modalidades.",
            "sufficient": "El criterio de organización se reconoce; una referencia secundaria a las reglas queda poco precisada.",
            "partial": "Incluye juegos pertinentes, pero uno no responde al criterio o propósito de la modalidad elegida.",
            "error": "Clasifica juegos mediante reglas o propósitos incompatibles con las fichas dadas."
          }
        ]
      },
      {
        "id": "game-performance",
        "grade": 1,
        "label": "ejecución de juegos tradicionales adaptados",
        "match": "participa.*juego tradicional|ejecuta.*juego tradicional|juego tradicional adaptado",
        "relation": "la relación entre reglas, turnos, decisiones y acciones del juego tradicional adaptado elegido",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "5f81a596-b08c-5e21-8155-026e4b106d0e",
          "ff4bab6a-31dc-5114-907a-633ae43be7a6"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Reglas, turnos y acciones del juego",
            "success": "Participa en el juego tradicional adaptado elegido aplicando las reglas, turnos y acciones acordados con los apoyos permitidos, sin puntuar el resultado competitivo.",
            "sufficient": "Las decisiones y reglas se reconocen; un ajuste secundario de turno pierde continuidad.",
            "partial": "Realiza acciones pertinentes, pero una decisión no corresponde a la regla o turno acordados.",
            "error": "Las decisiones contradicen las reglas dadas o impiden reconocer las acciones del juego solicitado."
          }
        ]
      },
      {
        "id": "warmup-observation",
        "grade": 1,
        "label": "calentamiento general y específico dado",
        "match": "calentamiento general|calentamiento especifico|acciones? de calentamiento",
        "relation": "la relación entre acciones de calentamiento y condiciones ya fijadas en la ficha docente",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "457eb924-a26a-56b7-b4c2-32b00ce381fb",
          "d6575c21-e68b-5d7c-b1db-b254990956c3"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Cumplimiento del calentamiento dado",
            "success": "Cumple las acciones de calentamiento expresamente indicadas en todas las oportunidades observadas, sin añadir ejercicios o dosis no proporcionados.",
            "sufficient": "Cumple las acciones indicadas en casi todas las oportunidades observadas.",
            "partial": "Cumple las acciones indicadas en algunas oportunidades observadas.",
            "error": "Cumple las acciones indicadas en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "given-nutrition-record",
        "grade": 1,
        "label": "información alimentaria e hidratación del caso",
        "match": "informacion alimentaria|informacion.*hidratacion|habitos alimenticios",
        "relation": "la relación entre las acciones alimentarias o de hidratación del caso y las evidencias de la ficha proporcionada",
        "pdfPages": [
          359,
          360
        ],
        "sourceRecordIds": [
          "7e35829a-f106-53f1-b44b-17ddc02e47ac",
          "668aebce-96b2-5154-9e6c-9f2fd42ef042"
        ],
        "primaryPurpose": "REPORT",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Organización de la información del caso",
            "success": "Organiza la información alimentaria y de hidratación expresamente dada relacionando las acciones del caso ficticio con las evidencias de la ficha, sin recomendar dietas ni pedir datos privados.",
            "sufficient": "La información principal se reconoce; una referencia secundaria a la ficha queda poco precisada.",
            "partial": "Incluye datos pertinentes, pero una acción del caso no se vincula con la ficha proporcionada.",
            "error": "Modifica la información de la ficha o introduce una recomendación personal no sustentada en los datos dados."
          }
        ]
      },
      {
        "id": "calorie-case-analysis",
        "grade": 1,
        "label": "comprobación calórica con datos dados",
        "match": "valores? caloricos?|requerimientos? caloricos?|tabla.*calori",
        "relation": "la relación entre valores calóricos, operaciones y requerimientos ya proporcionados del caso ficticio",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "dda803e7-5195-549d-8dd0-e55f87dd8272",
          "d5b170d7-8125-5aff-971d-1072062f8236",
          "b2ec6307-d661-571c-a371-1de937111819"
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Comprobación de los datos calóricos dados",
            "success": "Comprueba los valores del caso ficticio mostrando las operaciones y su correspondencia con la tabla y los requerimientos ya proporcionados, sin estimar necesidades de personas reales.",
            "sufficient": "Las operaciones y su correspondencia se reconocen; una referencia secundaria de unidad queda poco precisada.",
            "partial": "Utiliza datos pertinentes, pero una operación o comparación con el requerimiento dado queda sin resolver.",
            "error": "Usa valores u operaciones incompatibles con la tabla o atribuye necesidades personales no proporcionadas."
          }
        ]
      },
      {
        "id": "activity-obesity-debate",
        "grade": 1,
        "label": "argumentación sobre actividad física y obesidad",
        "match": "actividad fisica.*obesidad|obesidad.*actividad fisica",
        "relation": "las relaciones documentadas y límites de las evidencias del caso sobre actividad física y obesidad",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "d81c1f9e-a0be-5e99-9d62-ec0465c8561f"
        ],
        "primaryPurpose": "DEBATE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Razones, evidencias y límites del caso",
            "success": "Argumenta las relaciones del caso ficticio mediante las evidencias y límites de la ficha dada y responde a otra interpretación con razones, sin estigmatizar cuerpos ni afirmar causalidad no acreditada.",
            "sufficient": "La postura y sus evidencias se reconocen; una respuesta secundaria deja un límite poco precisado.",
            "partial": "Aporta razones pertinentes, pero una conclusión o respuesta carece de vínculo con las evidencias del caso.",
            "error": "La argumentación contradice la ficha, atribuye causalidad no acreditada o sustituye las razones por juicios sobre cuerpos."
          }
        ]
      },
      {
        "id": "chess-tactic-concept",
        "grade": 1,
        "label": "tácticas de ajedrez",
        "match": "clavada|doble ataque|jaque|sacrificio|obstruccion|tacticas? de ajedrez",
        "relation": "la relación entre piezas, amenazas, restricciones y táctica expresamente asignada de la posición dada",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "9d428f1c-d685-5e8c-9974-5300651abc38"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Piezas, amenazas y táctica",
            "success": "Explica las tácticas expresamente asignadas relacionando piezas, amenazas y restricciones con las evidencias de las posiciones de ajedrez proporcionadas.",
            "sufficient": "Las tácticas y sus amenazas se reconocen; una referencia secundaria a la posición queda poco precisada.",
            "partial": "Identifica recursos pertinentes, pero una relación entre pieza y amenaza carece de sustento en la posición.",
            "error": "Atribuye a las piezas amenazas o movimientos incompatibles con las posiciones dadas."
          }
        ]
      },
      {
        "id": "chess-problem",
        "grade": 1,
        "label": "resolución de problemas de ajedrez",
        "match": "problemas? de ajedrez|resuelve.*ajedrez",
        "relation": "la relación entre jugadas legales, respuestas del oponente y táctica de la posición dada",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "cd32a06e-a54b-587a-be05-d071bd353572",
          "da4f7bd1-6d81-5cfe-8a4f-f8d727bff27e"
        ],
        "primaryPurpose": "PROBLEM_SOLVING",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Secuencia legal y respuesta prevista",
            "success": "Resuelve el problema de ajedrez con el número de jugadas expresamente solicitado, justificando la táctica y las respuestas legales previstas del oponente a partir de la posición dada.",
            "sufficient": "La solución y sus respuestas principales se sostienen; una justificación secundaria queda poco precisada.",
            "partial": "Propone jugadas pertinentes, pero una respuesta legal o su relación con la táctica queda sin resolver.",
            "error": "La secuencia incluye una jugada ilegal o no responde a las condiciones del problema proporcionado."
          }
        ]
      },
      {
        "id": "chess-game-analysis",
        "grade": 1,
        "label": "análisis de partidas de ajedrez",
        "match": "(?:analiza|posicion critica).*partida.*ajedrez|partida.*ajedrez.*(?:posicion critica|tactica de defensa)",
        "relation": "la relación entre posición crítica, decisiones y efectos documentados de la táctica de ajedrez elegida",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "b06ef448-8752-58d2-bdf2-d42d846fa993",
          "f60711e5-587a-5396-8fed-61e14888d9ee"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones de la posición crítica",
            "success": "Analiza la posición crítica de la partida dada identificando la táctica elegida y sustentando sus efectos en las jugadas y restricciones proporcionadas.",
            "sufficient": "La táctica y sus efectos principales se sustentan; una referencia secundaria a la secuencia queda poco precisada.",
            "partial": "Identifica jugadas pertinentes, pero un efecto atribuido a la táctica no se vincula con la posición.",
            "error": "Atribuye a la táctica un efecto o movimiento incompatible con la partida o ignora una restricción decisiva de la posición."
          }
        ]
      },
      {
        "id": "chess-notation",
        "grade": 1,
        "label": "anotación de partidas de ajedrez",
        "match": "(?:registra|anotacion|notacion).*partida.*ajedrez|partida.*ajedrez.*(?:anotacion|notacion)",
        "relation": "la relación entre notación, jugadas y táctica de la partida de ajedrez registrada",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "59ec0de4-3db9-54c9-89b8-29e535fc5fd6",
          "49ffecdc-71e7-5028-baea-b57ef62a6448"
        ],
        "primaryPurpose": "REPORT",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Notación y decisiones registradas",
            "success": "Registra las jugadas de la partida simulada con la notación proporcionada y explica la táctica aplicada en la posición indicada, sin evaluar quién gana.",
            "sufficient": "Las jugadas y su táctica se reconocen; una marca secundaria de notación queda poco clara.",
            "partial": "Registra jugadas pertinentes, pero una marca o explicación no se vincula con la posición indicada.",
            "error": "La anotación cambia las jugadas dadas o atribuye una táctica incompatible con la posición registrada.",
            "variants": {
              "PERFORMANCE": {
                "title": "Decisiones legales y anotación de ajedrez",
                "success": "Juega la partida adaptada según las reglas dadas utilizando la notación proporcionada y justificando la táctica elegida en la posición indicada, sin evaluar quién gana.",
                "sufficient": "Las jugadas y su táctica se reconocen; una marca secundaria de anotación queda poco clara.",
                "partial": "Realiza jugadas pertinentes, pero una decisión o marca de notación no se vincula con la posición indicada.",
                "error": "Las decisiones incluyen una jugada ilegal según las reglas dadas o una notación incompatible con la secuencia jugada."
              }
            }
          }
        ]
      },
      {
        "id": "basketball-history",
        "grade": 1,
        "label": "historia del baloncesto",
        "match": "(?:historia|hechos|personajes).*baloncesto|baloncesto.*(?:historia|hechos|personajes)",
        "relation": "la relación entre hechos, personajes, fechas y fuentes del ámbito histórico de baloncesto solicitado",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "5491fcea-ba5f-51a5-a951-2011abd905b3",
          "ed0ee3a6-8da0-5a10-881b-2232316090eb",
          "a95f5b5f-c239-51a2-885a-b4bd7c5c8477"
        ],
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y referencias históricas",
            "success": "Presenta los hechos y personajes de baloncesto expresamente asignados relacionándolos con su ubicación temporal y las evidencias de las fuentes dadas.",
            "sufficient": "La secuencia y sus evidencias principales se reconocen; una referencia temporal secundaria queda poco precisada.",
            "partial": "Presenta hechos pertinentes, pero una relación temporal o atribución a un personaje carece de sustento.",
            "error": "Atribuye al baloncesto hechos, fechas o protagonistas incompatibles con las fuentes o cambia el ámbito histórico solicitado.",
            "variants": {
              "RESEARCH": {
                "title": "Hechos, fuentes y contexto del baloncesto",
                "success": "Investiga los hechos, personajes y fechas del ámbito histórico de baloncesto expresamente asignado relacionando hallazgos y referencias con las fuentes proporcionadas.",
                "sufficient": "Los hallazgos principales se sustentan; una referencia histórica secundaria queda poco precisada.",
                "partial": "Aporta información pertinente, pero una atribución temporal o de protagonista carece de vínculo con la fuente.",
                "error": "Atribuye al baloncesto hechos o protagonistas incompatibles con las fuentes o cambia el ámbito histórico solicitado."
              }
            }
          }
        ]
      },
      {
        "id": "basketball-rules",
        "grade": 1,
        "label": "reglas de baloncesto",
        "match": "(?:reglas?|reglamento).*baloncesto|baloncesto.*(?:reglas?|reglamento)",
        "relation": "las funciones y condiciones de las reglas de baloncesto expresamente asignadas",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "149a922f-fa27-5495-8d2d-48fd77ff7d12"
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas de baloncesto",
            "success": "Identifica si las decisiones del caso ficticio de baloncesto cumplen las reglas proporcionadas, justificando las marcas con evidencias del registro.",
            "sufficient": "Las verificaciones principales se sustentan; una referencia secundaria a una regla queda poco precisada.",
            "partial": "Identifica reglas pertinentes, pero una marca no permite determinar el cumplimiento de la condición dada.",
            "error": "Atribuye al caso un cumplimiento incompatible con sus evidencias o utiliza una regla no proporcionada."
          }
        ],
        "excludeWhen": "adaptaciones|silla|3\\s*x\\s*3|baloncesto adaptad"
      },
      {
        "id": "basketball-posture",
        "grade": 1,
        "label": "posiciones fundamentales de baloncesto",
        "match": "posiciones?.*baloncesto|baloncesto.*posiciones?",
        "relation": "la relación entre posiciones, desplazamientos, señales y apoyos de la tarea de baloncesto dada",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "137f277f-b970-50f0-ac94-abee05477fb7"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posiciones y respuestas de baloncesto",
            "success": "Ejecuta las posiciones fundamentales de baloncesto expresamente adaptadas respondiendo a las señales de desplazamiento acordadas con los apoyos permitidos.",
            "sufficient": "Las posiciones y respuestas se reconocen; una transición secundaria pierde continuidad.",
            "partial": "Presenta acciones pertinentes, pero una posición o transición no corresponde a la señal dada.",
            "error": "Las decisiones de posición contradicen las condiciones adaptadas o impiden reconocer la respuesta solicitada.",
            "variants": {
              "COMPARISON": {
                "title": "Contraste de posiciones y respuestas",
                "success": "Compara las posiciones fundamentales de baloncesto de los referentes proporcionados según ubicación y respuesta a las señales expresamente dadas.",
                "sufficient": "El contraste principal se sustenta; una referencia secundaria a la ubicación queda poco precisada.",
                "partial": "Identifica posiciones pertinentes, pero una semejanza o diferencia no se vincula con la señal o ubicación dada.",
                "error": "El contraste atribuye a las posiciones respuestas o ubicaciones incompatibles con los referentes proporcionados."
              }
            }
          }
        ]
      },
      {
        "id": "basketball-fundamentals",
        "grade": 1,
        "label": "fundamentos de baloncesto",
        "match": "(?:pases?|recepciones?|dribles?|tiros?|rebotes?|fundamentos).*baloncesto|baloncesto.*(?:pases?|recepciones?|dribles?|tiros?|rebotes?|fundamentos)",
        "relation": "la relación entre control, dirección y decisiones de los fundamentos de baloncesto expresamente elegidos",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "8dab4e78-8c2e-583c-b95e-680b131e97f6",
          "41ffb066-4965-5ec7-a3b6-5f330f46b657"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Técnicas y decisiones de baloncesto",
            "success": "Ejecuta los pases y recepciones expresamente dados relacionando control, dirección y decisión con las señales y apoyos de la tarea adaptada de baloncesto.",
            "sufficient": "Las técnicas y sus decisiones principales se reconocen; un ajuste secundario pierde continuidad.",
            "partial": "Presenta acciones pertinentes, pero una decisión de control o dirección no responde a las señales dadas.",
            "error": "Las decisiones técnicas contradicen las condiciones adaptadas o no permiten reconocer los fundamentos solicitados."
          }
        ],
        "excludeWhen": "compara|silla"
      },
      {
        "id": "basketball-adapted-rules",
        "grade": 1,
        "label": "adaptaciones de reglas de baloncesto",
        "match": "adaptaciones?.*(?:reglas?|reglamento).*baloncesto|(?:reglas?|reglamento).*baloncesto adaptad",
        "relation": "la relación entre las adaptaciones de las reglas, los recursos y la participación prevista en el caso de baloncesto",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "ff8e3767-c1d5-5e7b-b9e5-33eb63d64aaf"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Reglas adaptadas y participación",
            "success": "Analiza las adaptaciones de las reglas de baloncesto relacionando recursos, participación y necesidades descritos con el propósito del juego dado, sin inferir diagnósticos.",
            "sufficient": "Las adaptaciones principales se sustentan; una relación secundaria con el recurso queda poco precisada.",
            "partial": "Identifica una adaptación pertinente, pero su relación con las condiciones de participación carece de sustento.",
            "error": "Atribuye al caso reglas o necesidades incompatibles con la información proporcionada, o trata una adaptación como déficit personal."
          }
        ]
      },
      {
        "id": "basketball-wheelchair",
        "grade": 1,
        "label": "decisiones de baloncesto en silla de ruedas",
        "match": "baloncesto en silla",
        "relation": "la relación entre decisiones técnicas y reglas adaptadas del referente de baloncesto en silla de ruedas",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "bd70a8ce-620d-5055-ba5a-7497c0ad7ae9"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones del referente adaptado",
            "success": "Analiza las decisiones de pase y recepción del referente de baloncesto en silla de ruedas sustentándolas en las reglas adaptadas y evidencias proporcionadas.",
            "sufficient": "Las decisiones principales se sustentan; una relación secundaria con la regla queda poco precisada.",
            "partial": "Identifica acciones pertinentes, pero una decisión no se vincula con las reglas o condiciones del referente.",
            "error": "Atribuye al referente decisiones o restricciones incompatibles con los datos, o sustituye el análisis por juicios sobre discapacidad.",
            "variants": {
              "PERFORMANCE": {
                "title": "Decisiones técnicas adaptadas de baloncesto",
                "success": "Ejecuta los pases y recepciones expresamente adaptados de baloncesto en silla de ruedas relacionando control, dirección y decisión con las señales, reglas y apoyos proporcionados.",
                "sufficient": "Las técnicas y decisiones se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Realiza acciones pertinentes, pero una decisión de control o dirección no responde a la señal dada.",
                "error": "Las decisiones técnicas contradicen las reglas o condiciones adaptadas proporcionadas."
              }
            }
          }
        ]
      },
      {
        "id": "basketball-three-on-three",
        "grade": 1,
        "label": "reglas de baloncesto convencional y 3x3",
        "match": "3\\s*x\\s*3",
        "relation": "las semejanzas y diferencias entre las reglas proporcionadas de baloncesto convencional y 3x3 para la situación dada",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "026ca3ba-e92a-5d0f-be2f-5d85a4855340"
        ],
        "primaryPurpose": "COMPARISON",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Contraste de reglas y decisiones",
            "success": "Compara las reglas proporcionadas de baloncesto convencional y 3x3 relacionando sus semejanzas y diferencias con las decisiones de la situación de juego dada.",
            "sufficient": "El contraste principal se sustenta; una condición secundaria de uso queda poco precisada.",
            "partial": "Reconoce reglas pertinentes, pero una semejanza o diferencia no se vincula con la situación dada.",
            "error": "El contraste intercambia reglas de las variantes o atribuye condiciones incompatibles con las fichas proporcionadas.",
            "variants": {
              "PERFORMANCE": {
                "title": "Reglas y decisiones de baloncesto 3x3",
                "success": "Aplica las reglas y decisiones expresamente proporcionadas en la situación adaptada de baloncesto 3x3, utilizando los apoyos acordados sin evaluar quién gana.",
                "sufficient": "Las decisiones y reglas se reconocen; un ajuste secundario de continuidad queda poco definido.",
                "partial": "Realiza acciones pertinentes, pero una decisión no se vincula con la regla o situación dada.",
                "error": "Las decisiones contradicen las reglas o condiciones adaptadas proporcionadas para baloncesto 3x3.",
                "absent": "No aporta evidencia de las acciones y decisiones solicitadas de baloncesto 3x3."
              }
            }
          }
        ]
      },
      {
        "id": "artistic-gymnastics-history",
        "grade": 1,
        "label": "historia de la gimnasia artística",
        "match": "(?:historia|hechos historicos).*gimnasia artistica|gimnasia artistica.*(?:historia|hechos historicos)",
        "relation": "la relación entre hechos históricos de gimnasia artística, fuentes y contexto expresamente asignado",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "3d3928d0-b80b-5ef3-a989-b5399b8edd06",
          "a95f5b5f-c239-51a2-885a-b4bd7c5c8477"
        ],
        "primaryPurpose": "RESEARCH",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hallazgos históricos de gimnasia artística",
            "success": "Investiga los hechos históricos de gimnasia artística expresamente asignados relacionando hallazgos y referencias con las fuentes dadas, distinguiendo evidencia e inferencia.",
            "sufficient": "Los hallazgos principales se sustentan; una referencia histórica secundaria queda poco precisada.",
            "partial": "Aporta hechos pertinentes, pero una atribución histórica carece de vínculo con la fuente.",
            "error": "Atribuye a la gimnasia artística hechos o relaciones incompatibles con las fuentes o presenta una inferencia como dato acreditado."
          }
        ]
      },
      {
        "id": "artistic-gymnastics-rules",
        "grade": 1,
        "label": "código de puntuación gimnástica dado",
        "match": "codigo de puntuacion|(?:reglas?|reglamento).*gimnasia artistica",
        "relation": "las condiciones, valores y criterios del código de puntuación gimnástica proporcionado",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "216afdc2-9eb4-53a3-b649-8c53fa108926",
          "37ddabd8-717d-5cd6-a74c-dbf950e4fea9"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aplicación del código proporcionado",
            "success": "Interpreta el código de puntuación gimnástica proporcionado aplicándolo a las acciones del registro ficticio y sustentando cada decisión con sus condiciones expresas.",
            "sufficient": "Las decisiones principales se sustentan; una referencia secundaria al código queda poco precisada.",
            "partial": "Identifica condiciones pertinentes del código, pero una decisión no se vincula con la acción registrada.",
            "error": "Aplica una condición no proporcionada o asigna al referente un resultado incompatible con sus evidencias y el código dado."
          }
        ]
      },
      {
        "id": "apparatus-reference-analysis",
        "grade": 1,
        "label": "análisis de secuencias gimnásticas en aparatos",
        "match": "referente gimnastic|aparatos?.*(?:asignad|gimnastic)|secuencia.*aparato",
        "relation": "la relación entre fases, condiciones adaptadas y evidencias de la secuencia gimnástica del aparato asignado",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "7a2f34e1-4311-5beb-b880-9c0796e3ff60",
          "860a4c73-b881-5120-921e-832c3d2439f1"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Fases y condiciones del referente",
            "success": "Analiza la secuencia gimnástica del referente relacionando sus fases con las condiciones adaptadas expresamente proporcionadas para el aparato asignado.",
            "sufficient": "Las fases principales y sus condiciones se reconocen; una transición secundaria queda poco precisada.",
            "partial": "Identifica fases pertinentes, pero una relación con la condición dada carece de sustento en el referente.",
            "error": "Atribuye al referente fases o condiciones incompatibles con sus evidencias o sustituye el análisis por maniobras no solicitadas.",
            "variants": {
              "PERFORMANCE": {
                "title": "Secuencia y transiciones del aparato asignado",
                "success": "Ejecuta la secuencia gimnástica expresamente adaptada según las fases, transiciones y condiciones ya proporcionadas por el docente, con los apoyos y supervisión acordados.",
                "sufficient": "Las fases principales y sus transiciones se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Realiza acciones pertinentes, pero una transición no corresponde a la fase o condición adaptada dada.",
                "error": "La secuencia contradice las fases o condiciones proporcionadas o introduce maniobras no solicitadas."
              }
            }
          }
        ]
      },
      {
        "id": "handball-history",
        "grade": 1,
        "label": "historia del balonmano",
        "match": "(?:historia|hechos|personajes).*balonmano|balonmano.*(?:historia|hechos|personajes)",
        "relation": "la relación entre hechos, protagonistas, fechas y fuentes del ámbito histórico de balonmano solicitado",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "adf0a324-38b6-52fa-b748-6089167f55f5",
          "24ce2d7b-143c-5fd4-acaf-5aa8ae9df0c8"
        ],
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos históricos de balonmano",
            "success": "Presenta los hechos y personajes de balonmano expresamente asignados relacionándolos con fechas y evidencias de las fuentes del ámbito dado.",
            "sufficient": "La secuencia y sus referencias principales se reconocen; un dato temporal secundario queda poco precisado.",
            "partial": "Presenta hechos pertinentes, pero una atribución temporal o de protagonista carece de sustento.",
            "error": "Atribuye al balonmano hechos o protagonistas incompatibles con las fuentes o sustituye el ámbito histórico solicitado."
          }
        ]
      },
      {
        "id": "handball-rules",
        "grade": 1,
        "label": "reglas de balonmano",
        "match": "(?:reglas?|reglamento).*balonmano|balonmano.*(?:reglas?|reglamento)",
        "relation": "las funciones y condiciones de las reglas de balonmano expresamente asignadas",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "24ce2d7b-143c-5fd4-acaf-5aa8ae9df0c8"
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones y reglas de balonmano",
            "success": "Identifica si las acciones del caso ficticio de balonmano cumplen las reglas proporcionadas, justificando las decisiones con evidencias del registro.",
            "sufficient": "Las verificaciones principales se sustentan; una referencia secundaria a la regla queda poco precisada.",
            "partial": "Identifica reglas pertinentes, pero una decisión no permite determinar el cumplimiento de la condición dada.",
            "error": "Atribuye al caso un cumplimiento incompatible con sus evidencias o aplica una regla no proporcionada."
          }
        ],
        "excludeWhen": "adaptaciones|silla|balonmano adaptad"
      },
      {
        "id": "handball-posture",
        "grade": 1,
        "label": "posiciones fundamentales de balonmano",
        "match": "posiciones?.*balonmano|balonmano.*posiciones?",
        "relation": "la relación entre posición, ubicación, señales y apoyos de la tarea de balonmano dada",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "d48387fa-ddc7-5eb5-9f63-bc305272160a"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posiciones y respuestas de balonmano",
            "success": "Ejecuta las posiciones fundamentales de balonmano expresamente adaptadas relacionando ubicación y respuesta a las señales con los apoyos permitidos.",
            "sufficient": "Las posiciones y respuestas se reconocen; una transición secundaria pierde continuidad.",
            "partial": "Presenta acciones pertinentes, pero una ubicación no corresponde a la señal o condición adaptada.",
            "error": "Las decisiones de posición contradicen las condiciones dadas o impiden reconocer la respuesta solicitada."
          }
        ]
      },
      {
        "id": "handball-fundamentals",
        "grade": 1,
        "label": "fundamentos de balonmano",
        "match": "(?:pases?|recepciones?|lanzamientos?|bote|bloqueo|fundamentos).*balonmano|balonmano.*(?:pases?|recepciones?|lanzamientos?|bote|bloqueo|fundamentos)",
        "relation": "la relación entre control, dirección y decisiones de los fundamentos de balonmano expresamente elegidos",
        "pdfPages": [
          360,
          361
        ],
        "sourceRecordIds": [
          "bcc82a8d-e988-57b9-a913-959ccd1d614b",
          "41ffb066-4965-5ec7-a3b6-5f330f46b657"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Técnicas y decisiones de balonmano",
            "success": "Ejecuta los pases y recepciones expresamente dados relacionando control, dirección y decisión con las señales y apoyos de la tarea adaptada de balonmano.",
            "sufficient": "Las técnicas y sus decisiones principales se reconocen; un ajuste secundario pierde continuidad.",
            "partial": "Presenta acciones pertinentes, pero una decisión técnica no responde a la señal o dirección dadas.",
            "error": "Las decisiones técnicas contradicen las condiciones adaptadas o no permiten reconocer los fundamentos solicitados.",
            "variants": {
              "REPORT": {
                "title": "Registro de acciones técnicas de balonmano",
                "success": "Organiza el registro proporcionado de los fundamentos de balonmano expresamente seleccionados relacionando control, dirección y condiciones documentadas de la tarea adaptada.",
                "sufficient": "Los registros y su criterio de organización se reconocen; una referencia secundaria queda poco precisada.",
                "partial": "Incluye registros pertinentes, pero una acción o condición no se vincula con la evidencia proporcionada.",
                "error": "El registro atribuye a las acciones valores o condiciones incompatibles con los datos dados."
              }
            }
          }
        ],
        "excludeWhen": "propon|variante|silla|compara"
      },
      {
        "id": "handball-adapted-rules",
        "grade": 1,
        "label": "adaptaciones de reglas de balonmano",
        "match": "adaptaciones?.*(?:reglas?|reglamento).*balonmano|(?:reglas?|reglamento).*balonmano adaptad",
        "relation": "la relación entre adaptaciones de las reglas, recursos y participación prevista en el caso de balonmano",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "d2335405-40cf-55c9-a981-d2ace387aab7"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Reglas adaptadas y condiciones del caso",
            "success": "Analiza las adaptaciones del reglamento de balonmano relacionando recursos, participación y necesidades descritos con las condiciones del juego dado, sin inferir diagnósticos.",
            "sufficient": "Las adaptaciones principales se sustentan; una relación secundaria con los recursos queda poco precisada.",
            "partial": "Identifica adaptaciones pertinentes, pero una relación con las condiciones de participación carece de sustento.",
            "error": "Atribuye al caso adaptaciones o necesidades incompatibles con sus datos, o trata los apoyos como déficit personal."
          }
        ]
      },
      {
        "id": "handball-wheelchair",
        "grade": 1,
        "label": "decisiones de balonmano en silla de ruedas",
        "match": "balonmano en silla",
        "relation": "la relación entre la decisión táctica elegida y las reglas adaptadas del referente de balonmano en silla de ruedas",
        "pdfPages": [
          360
        ],
        "sourceRecordIds": [
          "9b9784b7-fc70-545d-a91c-0af42e763a5b"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión táctica del referente adaptado",
            "success": "Analiza la decisión de ataque o defensa expresamente elegida del referente de balonmano en silla de ruedas sustentándola en las reglas adaptadas y evidencias proporcionadas.",
            "sufficient": "La decisión y su regla se reconocen; una relación táctica secundaria queda poco precisada.",
            "partial": "Identifica acciones pertinentes, pero una razón de la decisión no se vincula con el referente o la regla dada.",
            "error": "Atribuye a la decisión efectos o condiciones incompatibles con el referente, o sustituye el análisis por juicios sobre discapacidad.",
            "variants": {
              "PERFORMANCE": {
                "title": "Decisiones técnicas adaptadas de balonmano",
                "success": "Ejecuta las acciones técnicas y tácticas expresamente elegidas de balonmano en silla de ruedas relacionando sus decisiones con las condiciones, reglas y apoyos proporcionados.",
                "sufficient": "Las acciones y sus decisiones se reconocen; una transición secundaria pierde continuidad.",
                "partial": "Realiza acciones pertinentes, pero una decisión no corresponde a la regla o condición adaptada dada.",
                "error": "Las decisiones técnicas contradicen las condiciones proporcionadas o impiden reconocer las acciones tácticas solicitadas."
              }
            }
          }
        ]
      },
      {
        "id": "technique-comparison",
        "grade": 1,
        "label": "comparación de técnicas deportivas",
        "match": "compara.*(?:pases?|dribles?|tiros?)|semejanzas.*(?:pases?|dribles?|tiros?)",
        "relation": "las semejanzas y diferencias de las técnicas expresamente elegidas según los rasgos y situaciones de uso asignados",
        "pdfPages": [
          361
        ],
        "sourceRecordIds": [
          "6747055f-5484-5b56-864f-2884612c420f"
        ],
        "primaryPurpose": "COMPARISON",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Contraste de técnicas y situaciones",
            "success": "Compara los tipos de pases expresamente dados mediante dirección, recepción y situación de uso de los referentes proporcionados.",
            "sufficient": "El contraste principal se sustenta; una referencia secundaria a la situación de uso queda poco precisada.",
            "partial": "Reconoce técnicas pertinentes, pero una semejanza o diferencia no se vincula con la función dada.",
            "error": "El contraste intercambia funciones o atribuye a las técnicas rasgos incompatibles con los referentes proporcionados."
          }
        ]
      },
      {
        "id": "adapted-variant",
        "grade": 1,
        "label": "propuesta técnica para un juego adaptado",
        "match": "propon[a-z]*.*variante|variante.*(?:caso adaptado|reglas.*recursos)",
        "relation": "la relación entre variante técnica, reglas, recursos y propósito del juego adaptado dado",
        "pdfPages": [
          361
        ],
        "sourceRecordIds": [
          "d027555e-0df9-5458-9bed-45e737ea4191"
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan de variante técnica adaptada",
            "success": "Planifica la variante técnica solicitada relacionando las reglas, recursos y propósito del juego adaptado dado, sin exigir ejecución no solicitada.",
            "sufficient": "La variante y su propósito se reconocen; una condición secundaria de uso queda poco precisada.",
            "partial": "Propone recursos pertinentes, pero una elección técnica no se vincula con las condiciones o reglas dadas.",
            "error": "La variante contradice las reglas o recursos proporcionados o impide reconocer el propósito del juego adaptado."
          }
        ]
      },
      {
        "id": "tactical-cooperation",
        "grade": 1,
        "label": "colaboración en soluciones técnico tácticas",
        "match": "soluciones?.*acuerdos? tecnicos?|acuerdos? tecnicos?.*soluciones?|cooperacion tecnico tactica",
        "relation": "la relación entre propuestas, acuerdos concretos y solución técnica de la tarea colectiva observada",
        "pdfPages": [
          361,
          359
        ],
        "sourceRecordIds": [
          "2da7433e-577c-5f0b-8b5b-24c926fad978",
          "61ae4f0d-3c95-5ec8-aa25-cce344af30b7"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aportes y acuerdos técnicos observados",
            "success": "Aporta propuestas pertinentes y cumple los acuerdos técnicos de la tarea colectiva dada en todas las oportunidades observadas, sin puntuar personalidad.",
            "sufficient": "Aporta propuestas y cumple acuerdos en casi todas las oportunidades observadas.",
            "partial": "Aporta propuestas y cumple acuerdos en algunas oportunidades observadas.",
            "error": "Aporta propuestas y cumple acuerdos en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "physical-condition-explanation",
        "grade": 1,
        "label": "capacidades físicas en ejemplos adaptados",
        "match": "(?:explica[a-z]*|analiza[a-z]*|compara[a-z]*).*(?:fuerza rapida|velocidad de reaccion|traslacion|velocidad gestual|flexibilidad|resistencia aerobica|coordinacion|equilibrio|orientacion|capacidades fisicas)",
        "relation": "las diferencias y relaciones entre las capacidades físicas expresamente elegidas en los ejemplos dados",
        "pdfPages": [
          359,
          361
        ],
        "sourceRecordIds": [
          "b3c5294e-bc83-56be-b21e-1fadeff61881",
          "7f2a69f9-5f39-5410-9289-438a8452178d"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Capacidades y evidencias del ejemplo",
            "success": "Explica las diferencias entre las capacidades físicas expresamente asignadas mediante evidencias de los ejemplos adaptados proporcionados, sin clasificar cuerpos o personas.",
            "sufficient": "Las diferencias principales se sustentan; una relación secundaria con el ejemplo queda poco precisada.",
            "partial": "Reconoce capacidades pertinentes, pero una diferencia no se vincula con la acción del ejemplo dado.",
            "error": "Atribuye a las capacidades funciones incompatibles con los ejemplos o sustituye sus evidencias por un juicio de capacidad natural."
          }
        ]
      },
      {
        "id": "care-frequency",
        "grade": 1,
        "label": "cuidado observable de materiales y espacio",
        "match": "cuidado de materiales|cuidado.*espacio|frecuencia.*materiales.*espacio",
        "relation": "la relación entre acciones acordadas de cuidado y oportunidades observadas en el juego adaptado",
        "pdfPages": [
          359
        ],
        "sourceRecordIds": [
          "82e70eec-a902-52f0-ae76-61bebbb160f7",
          "34c5f5c6-7d45-5818-af45-8b0bb26e59f3"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones de cuidado observadas",
            "success": "Cumple las acciones concretas de cuidado de materiales y del espacio acordadas en todas las oportunidades observadas.",
            "sufficient": "Cumple las acciones de cuidado acordadas en casi todas las oportunidades observadas.",
            "partial": "Cumple las acciones de cuidado acordadas en algunas oportunidades observadas.",
            "error": "Cumple las acciones de cuidado acordadas en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "game-facilitation",
        "grade": 1,
        "label": "facilitación de juegos tradicionales",
        "match": "facilita[a-z]*.*juego|animacion de juegos",
        "relation": "la relación entre comunicación de reglas, turnos y apoyos en la facilitación del juego tradicional elegido",
        "pdfPages": [
          359,
          360
        ],
        "sourceRecordIds": [
          "52222e4a-54d2-5390-a38f-3ff6d8d186f4",
          "5f81a596-b08c-5e21-8155-026e4b106d0e"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Reglas y turnos comunicados",
            "success": "Facilita el juego tradicional adaptado elegido comunicando las reglas y organizando turnos con los apoyos acordados para hacer reconocible la participación prevista.",
            "sufficient": "Las reglas y turnos se reconocen; una indicación secundaria queda poco definida.",
            "partial": "Comunica indicaciones pertinentes, pero una decisión de turno o apoyo no se vincula con las reglas dadas.",
            "error": "Las indicaciones o turnos contradicen las reglas acordadas o impiden reconocer la organización del juego solicitado.",
            "variants": {
              "PLAN": {
                "title": "Plan de reglas, turnos y apoyos",
                "success": "Planifica la facilitación del juego tradicional elegido relacionando reglas comunicadas, turnos y apoyos previstos con las condiciones adaptadas dadas.",
                "sufficient": "El plan relaciona reglas y turnos; una condición secundaria del apoyo queda poco precisada.",
                "partial": "Identifica acciones pertinentes, pero un turno o apoyo no se vincula con las reglas previstas.",
                "error": "El plan contradice las reglas o condiciones proporcionadas o impide organizar la facilitación solicitada."
              }
            }
          }
        ]
      },
      {
        "id": "motor-progress-record",
        "grade": 1,
        "label": "análisis de progresión motriz documentada",
        "match": "progresion motriz|registro.*dos momentos",
        "relation": "la relación entre acciones adaptadas, condiciones y cambios documentados en dos momentos del registro dado",
        "pdfPages": [
          359,
          361
        ],
        "sourceRecordIds": [
          "b3c5294e-bc83-56be-b21e-1fadeff61881",
          "7f2a69f9-5f39-5410-9289-438a8452178d"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Progresión según acciones y condiciones",
            "success": "Analiza los cambios del registro ficticio comparando el cumplimiento de las acciones adaptadas y las condiciones documentadas en los dos momentos proporcionados.",
            "sufficient": "Los cambios principales se sustentan; una referencia secundaria a las condiciones queda poco precisada.",
            "partial": "Identifica datos pertinentes, pero una conclusión de progresión no se vincula con acciones o condiciones comparables.",
            "error": "Atribuye al registro mejoras o causas no acreditadas por sus datos o sustituye el análisis por un ranking de capacidad natural."
          }
        ]
      }
    ],
    "policy": "REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1"
  },
  {
    "id": "educacion-fisica-comun-2",
    "grade": 2,
    "topics": [
      {
        "id": "physical-condition-explanation",
        "grade": 2,
        "label": "capacidades físicas en ejemplos adaptados",
        "match": "(?:explica[a-z]*|analiza[a-z]*|compara[a-z]*).*(?:fuerza rapida|velocidad de reaccion|traslacion|velocidad gestual|flexibilidad|resistencia aerobica|coordinacion|equilibrio|orientacion|capacidades fisicas)",
        "relation": "las diferencias y relaciones entre las capacidades físicas expresamente elegidas en los ejemplos dados",
        "pdfPages": [
          362
        ],
        "sourceRecordIds": [
          "1d32e8a8-f597-5d67-99ab-25813d249441"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Capacidades y evidencias del ejemplo",
            "success": "Explica las diferencias entre las capacidades físicas expresamente asignadas mediante evidencias de los ejemplos adaptados proporcionados, sin clasificar cuerpos o personas.",
            "sufficient": "Las diferencias principales se sustentan; una relación secundaria con el ejemplo queda poco precisada.",
            "partial": "Reconoce capacidades pertinentes, pero una diferencia no se vincula con la acción del ejemplo dado.",
            "error": "Atribuye a las capacidades funciones incompatibles con los ejemplos o sustituye sus evidencias por un juicio de capacidad natural."
          }
        ]
      },
      {
        "id": "circuit-plan",
        "grade": 2,
        "label": "organización de un circuito adaptado",
        "match": "circuito adaptado|estaciones?.*pausas?|pausas?.*estaciones?",
        "relation": "la relación entre estaciones, acciones, orden y pausas fijados en la ficha docente",
        "pdfPages": [
          362
        ],
        "sourceRecordIds": [
          "ec0f5e0b-c56a-5d66-881a-c5ae0ace7422"
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan de estaciones y pausas dadas",
            "success": "Planifica la organización del circuito adaptado relacionando estaciones, acciones y pausas ya fijadas en la ficha docente, sin añadir intensidad o duración nuevas.",
            "sufficient": "El plan relaciona las estaciones y pausas; una referencia secundaria al orden queda poco precisada.",
            "partial": "Identifica estaciones pertinentes, pero una relación de orden o pausa no corresponde a la ficha dada.",
            "error": "El plan modifica las condiciones proporcionadas o introduce dosis físicas no sustentadas en la ficha.",
            "variants": {
              "PERFORMANCE": {
                "title": "Estaciones y pausas del circuito dado",
                "success": "Ejecuta la secuencia de estaciones y acciones del circuito adaptado respetando las pausas y apoyos ya fijados en la ficha docente, sin añadir intensidad o duración nuevas.",
                "sufficient": "La secuencia de estaciones se reconoce; una transición secundaria pierde continuidad.",
                "partial": "Realiza acciones pertinentes, pero una transición o pausa no corresponde a la ficha dada.",
                "error": "Cambia las acciones o pausas de modo incompatible con las condiciones adaptadas proporcionadas."
              }
            }
          }
        ]
      },
      {
        "id": "flexibility-observation",
        "grade": 2,
        "label": "acciones de flexibilidad adaptadas",
        "match": "flexibilidad activa|flexibilidad pasiva|acciones? de flexibilidad",
        "relation": "la relación entre las acciones de flexibilidad elegidas y las condiciones adaptadas del referente",
        "pdfPages": [
          362
        ],
        "sourceRecordIds": [
          "ec0f5e0b-c56a-5d66-881a-c5ae0ace7422"
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Cumplimiento de acciones de flexibilidad",
            "success": "Identifica con evidencias si el referente cumple las acciones de flexibilidad expresamente adaptadas en la ficha docente, sin medir amplitud corporal ni añadir maniobras.",
            "sufficient": "La verificación se sustenta; una marca secundaria queda poco clara sin cambiar su resultado principal.",
            "partial": "Identifica acciones pertinentes, pero una marca no permite determinar si cumple la condición dada.",
            "error": "Atribuye un cumplimiento incompatible con el referente o lo sustituye por un juicio de amplitud o capacidad natural.",
            "variants": {
              "PERFORMANCE": {
                "title": "Acciones de flexibilidad adaptadas",
                "success": "Ejecuta las acciones de flexibilidad expresamente adaptadas en la ficha docente según las señales y apoyos acordados, sin puntuar amplitud corporal.",
                "sufficient": "Las acciones y sus señales se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Presenta acciones pertinentes, pero una respuesta no corresponde a la señal o adaptación acordadas.",
                "error": "Las acciones contradicen las condiciones adaptadas dadas o no permiten reconocer la secuencia solicitada."
              }
            }
          }
        ]
      },
      {
        "id": "motor-variation",
        "grade": 2,
        "label": "variaciones de dirección y velocidad",
        "match": "secuencia motriz|(?:combina|variacion|variando).*(?:desplazamientos|giros|direccion|sentido)|centro de gravedad",
        "relation": "la relación entre cambios motrices solicitados, señales y apoyos de la secuencia adaptada",
        "pdfPages": [
          362
        ],
        "sourceRecordIds": [
          "ec0f5e0b-c56a-5d66-881a-c5ae0ace7422"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Respuestas a las señales motrices",
            "success": "Ejecuta los cambios de dirección y velocidad expresamente dados respondiendo a las señales y apoyos acordados de la secuencia adaptada.",
            "sufficient": "Los cambios y sus señales se reconocen; un ajuste secundario pierde continuidad sin romper la secuencia.",
            "partial": "Presenta respuestas pertinentes, pero un cambio no corresponde a la dirección o velocidad señaladas.",
            "error": "Las respuestas contradicen las señales dadas o impiden reconocer la secuencia motriz solicitada."
          }
        ]
      },
      {
        "id": "equilibrium-observation",
        "grade": 2,
        "label": "equilibrio y base de sustentación",
        "match": "equilibrio.*(?:base|referente)|base de sustentacion",
        "relation": "la relación entre base de sustentación, apoyos, plano y equilibrio del referente dado",
        "pdfPages": [
          362
        ],
        "sourceRecordIds": [
          "ec0f5e0b-c56a-5d66-881a-c5ae0ace7422"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Base, apoyos y equilibrio del referente",
            "success": "Explica el equilibrio del referente relacionando base de sustentación, apoyos y plano expresamente señalados con evidencias de la ficha proporcionada.",
            "sufficient": "Las relaciones principales se sustentan; una referencia espacial secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación entre apoyo y equilibrio carece de sustento.",
            "error": "Atribuye al referente apoyos o efectos incompatibles con sus datos o sustituye el análisis por una maniobra no solicitada."
          }
        ]
      },
      {
        "id": "warmup-observation",
        "grade": 2,
        "label": "preparación general y específica",
        "match": "calentamiento|preparacion (?:general|especifica)",
        "relation": "la relación entre las acciones de preparación indicadas y las condiciones de la actividad física",
        "pdfPages": [
          362
        ],
        "sourceRecordIds": [
          "2222311b-0643-5f28-83d8-e6c69fe44e25"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Cumplimiento del calentamiento dado",
            "success": "Cumple las acciones de calentamiento expresamente indicadas en todas las oportunidades observadas, sin añadir ejercicios o dosis no proporcionados.",
            "sufficient": "Cumple las acciones indicadas en casi todas las oportunidades observadas.",
            "partial": "Cumple las acciones indicadas en algunas oportunidades observadas.",
            "error": "Cumple las acciones indicadas en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "given-nutrition-record",
        "grade": 2,
        "label": "información alimentaria e hidratación del caso",
        "match": "informacion alimentaria|informacion.*hidratacion|habitos alimenticios|hidratacion",
        "relation": "la relación entre la información alimentaria y la hidratación del caso",
        "pdfPages": [
          362
        ],
        "sourceRecordIds": [
          "2222311b-0643-5f28-83d8-e6c69fe44e25"
        ],
        "primaryPurpose": "REPORT",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Organización de la información del caso",
            "success": "Organiza la información alimentaria y de hidratación expresamente dada relacionando las acciones del caso ficticio con las evidencias de la ficha, sin recomendar dietas ni pedir datos privados.",
            "sufficient": "La información principal se reconoce; una referencia secundaria a la ficha queda poco precisada.",
            "partial": "Incluye datos pertinentes, pero una acción del caso no se vincula con la ficha proporcionada.",
            "error": "Modifica la información de la ficha o introduce una recomendación personal no sustentada en los datos dados."
          }
        ],
        "excludeWhen": "pulsaciones|descanso"
      },
      {
        "id": "care-frequency",
        "grade": 2,
        "label": "cuidado observable de materiales y espacio",
        "match": "cuidado de materiales|cuidado.*espacio|frecuencia.*materiales.*espacio",
        "relation": "la relación entre acciones de cuidado de materiales y espacio y las condiciones expresamente trabajadas",
        "pdfPages": [
          362
        ],
        "sourceRecordIds": [
          "db28b9b1-9681-5bd8-8314-f71cbf84b41d"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones de cuidado observadas",
            "success": "Cumple las acciones concretas de cuidado de materiales y del espacio acordadas en todas las oportunidades observadas.",
            "sufficient": "Cumple las acciones de cuidado acordadas en casi todas las oportunidades observadas.",
            "partial": "Cumple las acciones de cuidado acordadas en algunas oportunidades observadas.",
            "error": "Cumple las acciones de cuidado acordadas en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "tactical-cooperation",
        "grade": 2,
        "label": "colaboración en soluciones técnico tácticas",
        "match": "solucion(?:es)?.*acuerdos? tecnicos?|acuerdos? tecnicos?.*solucion(?:es)?|cooperacion tecnico tactica",
        "relation": "la relación entre propuestas, acuerdos concretos y solución técnica de la tarea colectiva trabajada",
        "pdfPages": [
          362,
          363
        ],
        "sourceRecordIds": [
          "2453faf4-669f-5de0-801f-f7ffce1c9f46",
          "759efad0-6f5e-5ed9-be81-7dbe751666d4"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aportes y acuerdos técnicos observados",
            "success": "Aporta propuestas pertinentes y cumple los acuerdos técnicos de la tarea colectiva dada en todas las oportunidades observadas, sin puntuar personalidad.",
            "sufficient": "Aporta propuestas y cumple acuerdos en casi todas las oportunidades observadas.",
            "partial": "Aporta propuestas y cumple acuerdos en algunas oportunidades observadas.",
            "error": "Aporta propuestas y cumple acuerdos en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "motor-progress-record",
        "grade": 2,
        "label": "análisis de progresión motriz documentada",
        "match": "progresion motriz|registro.*dos momentos",
        "relation": "la relación entre acciones adaptadas, condiciones y cambios documentados en dos momentos del registro dado",
        "pdfPages": [
          364
        ],
        "sourceRecordIds": [
          "ef8f80ee-c5f6-594f-8a7f-bf1ee3e98c62"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Progresión según acciones y condiciones",
            "success": "Analiza los cambios del registro ficticio comparando el cumplimiento de las acciones adaptadas y las condiciones documentadas en los dos momentos proporcionados.",
            "sufficient": "Los cambios principales se sustentan; una referencia secundaria a las condiciones queda poco precisada.",
            "partial": "Identifica datos pertinentes, pero una conclusión de progresión no se vincula con acciones o condiciones comparables.",
            "error": "Atribuye al registro mejoras o causas no acreditadas por sus datos o sustituye el análisis por un ranking de capacidad natural."
          }
        ]
      },
      {
        "id": "spatial-orientation",
        "grade": 2,
        "label": "orientación espacial con mapa",
        "match": "orientacion espacial|(?:recorrido|trayecto).*mapa|mapa.*(?:recorrido|trayecto)",
        "relation": "la relación entre referencias del mapa, puntos cardinales y decisiones del recorrido adaptado",
        "sourceRecordIds": [
          "ec0f5e0b-c56a-5d66-881a-c5ae0ace7422",
          "df4fe997-43d5-547a-aaee-394d6fbaf1dc"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias del mapa y decisiones",
            "success": "Interpreta el recorrido del mapa proporcionado relacionando puntos cardinales y referencias con las decisiones del trayecto adaptado dado.",
            "sufficient": "La relación principal de orientación con mapa se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de orientación con mapa, pero una relación no se sustenta en las referencias del mapa proporcionado.",
            "error": "Atribuye a orientación con mapa relaciones incompatibles con las referencias del mapa proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "brujula|gps"
      },
      {
        "id": "compass-orientation",
        "grade": 2,
        "label": "orientación con brújula",
        "match": "orientacion.*brujula|brujula.*(?:referencias|orientacion)",
        "relation": "la relación de la brújula con los puntos cardinales y referencias del sistema de orientación proporcionado",
        "sourceRecordIds": [
          "f0c02134-f712-55fd-8336-d6a0cab55169",
          "df4fe997-43d5-547a-aaee-394d6fbaf1dc"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Brújula, referencias y decisiones",
            "success": "Explica las decisiones de orientación con brújula del referente relacionando puntos cardinales y referencias con las condiciones proporcionadas.",
            "sufficient": "La relación principal de orientación con brújula se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de orientación con brújula, pero una relación no se sustenta en el sistema de referencia proporcionado.",
            "error": "Atribuye a orientación con brújula relaciones incompatibles con el sistema de referencia proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "gps-orientation",
        "grade": 2,
        "label": "orientación GPS",
        "match": "orientacion.*gps|gps.*(?:referencias|orientacion)",
        "relation": "la relación entre las referencias GPS expresamente dadas y las decisiones del trayecto",
        "sourceRecordIds": [
          "ec0f5e0b-c56a-5d66-881a-c5ae0ace7422",
          "df4fe997-43d5-547a-aaee-394d6fbaf1dc"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias GPS del registro dado",
            "success": "Analiza las referencias GPS del registro simulado relacionándolas con las decisiones del trayecto proporcionado, sin solicitar ubicación personal.",
            "sufficient": "La relación principal de orientación GPS se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de orientación GPS, pero una relación no se sustenta en las referencias del registro proporcionado.",
            "error": "Atribuye a orientación GPS relaciones incompatibles con las referencias del registro proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "camping-concept",
        "grade": 2,
        "label": "modalidades de acampada",
        "match": "modalidades?.*acampada|concepto.*campismo|campismo.*concepto",
        "relation": "la relación entre las modalidades de acampada y las condiciones y recursos del contexto trabajado",
        "sourceRecordIds": [
          "f0c02134-f712-55fd-8336-d6a0cab55169"
        ],
        "pdfPages": [
          362
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Modalidad y condiciones de acampada",
            "success": "Explica las modalidades de acampada relacionando sus condiciones y recursos con las evidencias del referente proporcionado.",
            "sufficient": "La relación principal de modalidades de acampada se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de modalidades de acampada, pero una relación no se sustenta en las condiciones del referente proporcionado.",
            "error": "Atribuye a modalidades de acampada relaciones incompatibles con las condiciones del referente proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "shelter-plan",
        "grade": 2,
        "label": "plan de casa de campaña o refugio",
        "match": "plan.*(?:casa de campana|refugio)|(?:casa de campana|refugio).*plan",
        "relation": "la relación entre el modelo de alojamiento elegido, sus recursos y las condiciones de instalación previstas",
        "sourceRecordIds": [
          "f0c02134-f712-55fd-8336-d6a0cab55169",
          "f26855c1-11a4-54e3-9c01-ad61ec1c83de"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan de instalación del modelo elegido",
            "success": "Planifica la instalación de la casa de campaña o refugio expresamente elegido relacionando esquema, recursos y condiciones proporcionadas, sin exigir construir ambos.",
            "sufficient": "La relación principal de plan del modelo elegido se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de plan del modelo elegido, pero una relación no se sustenta en el esquema, los recursos y las condiciones proporcionadas.",
            "error": "Atribuye a plan del modelo elegido relaciones incompatibles con el esquema, los recursos y las condiciones proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "shelter-assembly",
        "grade": 2,
        "label": "modelo de casa de campaña o refugio",
        "match": "(?:construye|instala).*(?:casa de campana|refugio)|modelo.*(?:casa de campana|refugio)",
        "relation": "la relación entre el esquema del modelo, los recursos y las fases de construcción e instalación solicitadas",
        "sourceRecordIds": [
          "f26855c1-11a4-54e3-9c01-ad61ec1c83de"
        ],
        "pdfPages": [
          364
        ],
        "primaryPurpose": "PRODUCTION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Construcción e instalación según el esquema",
            "success": "Construye e instala el modelo de casa de campaña expresamente elegido siguiendo el esquema, recursos y condiciones de la simulación supervisada proporcionada.",
            "sufficient": "Las acciones principales de construcción e instalación del modelo se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de construcción e instalación del modelo no corresponde al esquema y las condiciones supervisadas proporcionados.",
            "error": "Las decisiones de construcción e instalación del modelo contradicen el esquema y las condiciones supervisadas proporcionados o impiden reconocer la acción solicitada."
          }
        ],
        "excludeWhen": "plan"
      },
      {
        "id": "hiking-plan",
        "grade": 2,
        "label": "plan de senderismo",
        "match": "plan.*senderismo|senderismo.*plan",
        "relation": "la relación entre trayecto, referencias, recursos y acuerdos previstos del plan de senderismo",
        "sourceRecordIds": [
          "f0c02134-f712-55fd-8336-d6a0cab55169",
          "dd4b5315-031a-5739-8ac0-fc08b3fd11ce"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan del trayecto simulado",
            "success": "Planifica el senderismo del caso simulado relacionando trayecto, referencias, recursos y acuerdos expresamente proporcionados, sin exigir recorrerlo todavía.",
            "sufficient": "La relación principal de plan de senderismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de plan de senderismo, pero una relación no se sustenta en las referencias y condiciones del caso proporcionado.",
            "error": "Atribuye a plan de senderismo relaciones incompatibles con las referencias y condiciones del caso proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "hiking-practice",
        "grade": 2,
        "label": "trayecto de senderismo adaptado",
        "match": "recorre.*senderismo|senderismo.*(?:recorrido|trayecto) adaptad",
        "relation": "la relación entre las decisiones del trayecto adaptado y las referencias y acuerdos solicitados",
        "sourceRecordIds": [
          "dd4b5315-031a-5739-8ac0-fc08b3fd11ce"
        ],
        "pdfPages": [
          364
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias y acuerdos del trayecto",
            "success": "Recorre el trayecto adaptado de senderismo de la simulación supervisada siguiendo las referencias y acuerdos dados, con los apoyos permitidos.",
            "sufficient": "Las acciones principales de trayecto de senderismo se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de trayecto de senderismo no corresponde a las referencias y acuerdos proporcionados.",
            "error": "Las decisiones de trayecto de senderismo contradicen las referencias y acuerdos proporcionados o impiden reconocer la acción solicitada."
          }
        ],
        "excludeWhen": "plan"
      },
      {
        "id": "hydration-pulse-record",
        "grade": 2,
        "label": "registro de hidratación y pulsaciones",
        "match": "registro.*(?:hidratacion.*pulsaciones|pulsaciones.*hidratacion)|pulsaciones",
        "relation": "la relación entre momentos, condiciones y datos del registro ficticio de hidratación y pulsaciones",
        "sourceRecordIds": [
          "62a12730-c006-5c33-a5ea-de89ec8b0bc9"
        ],
        "pdfPages": [
          364
        ],
        "primaryPurpose": "REPORT",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Momentos y condiciones del registro dado",
            "success": "Organiza el registro ficticio de hidratación y pulsaciones relacionando momentos y condiciones de actividad con los datos proporcionados, sin solicitar mediciones personales.",
            "sufficient": "La relación principal de registro de hidratación y pulsaciones se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de registro de hidratación y pulsaciones, pero una relación no se sustenta en los datos y momentos documentados.",
            "error": "Atribuye a registro de hidratación y pulsaciones relaciones incompatibles con los datos y momentos documentados o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "diet-rest-case",
        "grade": 2,
        "label": "alimentación y descanso del caso",
        "match": "(?:alimentacion|dieta).*descanso|descanso.*(?:alimentacion|dieta)|analiza.*descanso.*caso",
        "relation": "la relación entre alimentación, descanso y condiciones de actividad del caso trabajado",
        "sourceRecordIds": [
          "2222311b-0643-5f28-83d8-e6c69fe44e25",
          "306cbee8-d65a-5c93-b0b9-502379dcfab5"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Alimentación, descanso y condiciones dadas",
            "success": "Analiza la relación entre alimentación y descanso del caso ficticio sustentándola en las acciones, condiciones y fichas proporcionadas, sin elaborar una dieta personal.",
            "sufficient": "La relación principal de alimentación y descanso se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de alimentación y descanso, pero una relación no se sustenta en las acciones y condiciones del caso proporcionado.",
            "error": "Atribuye a alimentación y descanso relaciones incompatibles con las acciones y condiciones del caso proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "risk-prevention-case",
        "grade": 2,
        "label": "prevención de riesgos del campismo",
        "match": "riesgos?.*campismo|campismo.*riesgos?",
        "relation": "la relación entre factores de riesgo, condiciones del campismo y decisiones de la ficha de prevención dada",
        "sourceRecordIds": [
          "a2c0597d-3936-5757-acee-f7e7d8becbeb"
        ],
        "pdfPages": [
          364
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Factores y decisiones de prevención",
            "success": "Analiza los factores de riesgo del caso simulado de campismo justificando las decisiones documentadas con la ficha de prevención proporcionada, sin exigir intervenciones físicas.",
            "sufficient": "La relación principal de prevención del riesgo en campismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de prevención del riesgo en campismo, pero una relación no se sustenta en las condiciones del caso y la ficha proporcionada.",
            "error": "Atribuye a prevención del riesgo en campismo relaciones incompatibles con las condiciones del caso y la ficha proporcionada o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "first-aid-reference",
        "grade": 2,
        "label": "protocolo proporcionado de primeros auxilios",
        "match": "primeros auxilios",
        "relation": "las condiciones y los criterios del protocolo de primeros auxilios proporcionado",
        "sourceRecordIds": [
          "a2c0597d-3936-5757-acee-f7e7d8becbeb"
        ],
        "pdfPages": [
          364
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y protocolo proporcionado",
            "success": "Verifica si las decisiones del registro ficticio de primeros auxilios corresponden al protocolo docente proporcionado, justificándolas con sus evidencias sin añadir indicaciones médicas.",
            "sufficient": "La relación principal de decisiones de primeros auxilios se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de decisiones de primeros auxilios, pero una relación no se sustenta en las condiciones expresas del protocolo proporcionado.",
            "error": "Atribuye a decisiones de primeros auxilios relaciones incompatibles con las condiciones expresas del protocolo proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "athletics-history",
        "grade": 2,
        "label": "historia del atletismo",
        "match": "(?:historia|hechos|personajes).*atletismo|atletismo.*(?:historia|historicos)",
        "relation": "la relación entre hechos, personajes, ubicación temporal y fuentes del ámbito histórico de atletismo asignado",
        "sourceRecordIds": [
          "dea958c1-6490-5e95-8d0d-73e19316bd3e",
          "d7c302a2-e64f-5a87-92b0-655437ee4ff2"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y referencias del atletismo",
            "success": "Presenta los hechos y personajes del atletismo expresamente asignados relacionando fechas y evidencias de las fuentes del ámbito proporcionado.",
            "sufficient": "La relación principal de historia del atletismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de historia del atletismo, pero una relación no se sustenta en los hechos, fechas y fuentes proporcionados.",
            "error": "Atribuye a historia del atletismo relaciones incompatibles con los hechos, fechas y fuentes proporcionados o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "paralimp|parlimp"
      },
      {
        "id": "athletics-rules",
        "grade": 2,
        "label": "reglas de atletismo",
        "match": "(?:reglas?|reglamento).*atletismo|atletismo.*(?:reglas?|reglamento)",
        "relation": "las funciones y condiciones de las reglas de atletismo expresamente asignadas",
        "sourceRecordIds": [
          "dea958c1-6490-5e95-8d0d-73e19316bd3e",
          "b586470f-e217-56c7-95cd-194af97b44e7"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas del atletismo",
            "success": "Verifica si las decisiones del caso de atletismo cumplen las reglas proporcionadas justificando cada marca con las evidencias del registro.",
            "sufficient": "La relación principal de reglas de atletismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de reglas de atletismo, pero una relación no se sustenta en las reglas y evidencias proporcionadas.",
            "error": "Atribuye a reglas de atletismo relaciones incompatibles con las reglas y evidencias proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "adaptaciones?|modificaciones?"
      },
      {
        "id": "athletic-walk-run",
        "grade": 2,
        "label": "caminata o carrera atlética elegida",
        "match": "(?:caminata|carrera).*atletic[a-z]*|atletic[a-z]*.*(?:caminata|carrera)",
        "relation": "la relación entre la prueba atlética elegida, sus señales y las condiciones adaptadas",
        "sourceRecordIds": [
          "a6d8a048-c594-55c3-92be-63b358346d93",
          "391bd27b-a0b3-59a9-b4ef-6b1455e9727b"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Prueba atlética elegida y señales",
            "success": "Ejecuta la prueba de caminata o carrera atlética expresamente elegida siguiendo las señales y condiciones adaptadas dadas con los apoyos permitidos, sin comparar rapidez personal.",
            "sufficient": "Las acciones principales de prueba atlética elegida se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de prueba atlética elegida no corresponde a las señales y condiciones adaptadas proporcionadas.",
            "error": "Las decisiones de prueba atlética elegida contradicen las señales y condiciones adaptadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "athletic-starts",
        "grade": 2,
        "label": "salidas atléticas alta y agachada",
        "match": "salidas?.*(?:alta|agachada)",
        "relation": "la relación entre las posiciones de salida y las respuestas a las señales del referente atlético",
        "sourceRecordIds": [
          "a6d8a048-c594-55c3-92be-63b358346d93"
        ],
        "pdfPages": [
          362
        ],
        "primaryPurpose": "COMPARISON",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Contraste de posiciones de salida",
            "success": "Compara las salidas alta y agachada de los referentes atléticos proporcionados relacionando posición y respuesta con las señales dadas, sin exigir ejecutarlas.",
            "sufficient": "La relación principal de posiciones de salida atlética se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de posiciones de salida atlética, pero una relación no se sustenta en las posiciones y señales del referente proporcionado.",
            "error": "Atribuye a posiciones de salida atlética relaciones incompatibles con las posiciones y señales del referente proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "athletic-jumps",
        "grade": 2,
        "label": "salto atlético adaptado elegido",
        "match": "salto.*adaptado|salto.*(?:largo|alto).*atletic",
        "relation": "la relación entre las fases del salto elegido y las condiciones adaptadas del referente atlético",
        "sourceRecordIds": [
          "a6d8a048-c594-55c3-92be-63b358346d93"
        ],
        "pdfPages": [
          362
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Fases del salto elegido",
            "success": "Ejecuta el salto atlético adaptado expresamente elegido según las fases y condiciones supervisadas dadas con los apoyos permitidos, sin exigir otras modalidades.",
            "sufficient": "Las acciones principales de salto atlético elegido se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de salto atlético elegido no corresponde a las fases y condiciones adaptadas proporcionadas.",
            "error": "Las decisiones de salto atlético elegido contradicen las fases y condiciones adaptadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "athletic-implements",
        "grade": 2,
        "label": "lanzamiento atlético con implemento no convencional",
        "match": "lanzamiento.*implemento no convencional|implemento no convencional.*lanzamiento",
        "relation": "la relación entre fases, señales y función del implemento elegido en el lanzamiento atlético adaptado",
        "sourceRecordIds": [
          "f9c2b4b3-24a7-596d-af6b-fe1e478f43b7"
        ],
        "pdfPages": [
          362
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Gesto e implemento expresamente elegidos",
            "success": "Ejecuta el gesto de lanzamiento atlético adaptado con el implemento no convencional elegido según las fases, señales y condiciones supervisadas dadas, sin comparar distancia máxima.",
            "sufficient": "Las acciones principales de lanzamiento con el implemento elegido se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de lanzamiento con el implemento elegido no corresponde a las fases y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de lanzamiento con el implemento elegido contradicen las fases y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "athletic-adaptation",
        "grade": 2,
        "label": "adaptaciones de reglas de atletismo",
        "match": "adaptaciones?.*(?:reglas?|pruebas?).*atletismo|atletismo adaptado.*(?:reglas?|condiciones)",
        "relation": "la relación entre recursos, condiciones de participación y adaptaciones del atletismo solicitadas",
        "sourceRecordIds": [
          "5359e501-7298-5ec8-9a60-3a2a770bac09"
        ],
        "pdfPages": [
          362
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Adaptaciones y participación en atletismo",
            "success": "Analiza las adaptaciones de las reglas de atletismo relacionando recursos y condiciones de participación con las evidencias del caso proporcionado, sin inferir diagnósticos.",
            "sufficient": "La relación principal de adaptaciones de atletismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de adaptaciones de atletismo, pero una relación no se sustenta en los recursos y condiciones de participación proporcionados.",
            "error": "Atribuye a adaptaciones de atletismo relaciones incompatibles con los recursos y condiciones de participación proporcionados o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "paralympic-history",
        "grade": 2,
        "label": "historia del atletismo paralímpico",
        "match": "atletismo paralimpico|atletismo parlimpico",
        "relation": "la relación entre hechos históricos, características y fuentes del atletismo paralímpico del ámbito asignado",
        "sourceRecordIds": [
          "3747a3b8-4e66-5d5e-a2ba-c5c92b024813",
          "d7c302a2-e64f-5a87-92b0-655437ee4ff2"
        ],
        "pdfPages": [
          362,
          364
        ],
        "primaryPurpose": "RESEARCH",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hallazgos históricos del atletismo paralímpico",
            "success": "Investiga los hechos históricos del atletismo paralímpico expresamente asignados relacionando fechas y referencias con las fuentes proporcionadas, distinguiendo evidencia e inferencia.",
            "sufficient": "La relación principal de historia del atletismo paralímpico se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de historia del atletismo paralímpico, pero una relación no se sustenta en los hechos y fuentes del ámbito proporcionado.",
            "error": "Atribuye a historia del atletismo paralímpico relaciones incompatibles con los hechos y fuentes del ámbito proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "chess-strategy-concept",
        "grade": 2,
        "label": "estrategia de ajedrez",
        "match": "estrategia de ajedrez|ajedrez.*concepto de estrategia",
        "relation": "la relación entre objetivo, decisiones y restricciones de la estrategia de ajedrez",
        "sourceRecordIds": [
          "f6c11c97-5039-5d75-8749-9577f76a2b13"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Objetivo y decisiones de la estrategia",
            "success": "Explica la estrategia de ajedrez relacionando objetivo, decisiones y restricciones con las evidencias del ejemplo proporcionado.",
            "sufficient": "La relación principal de estrategia de ajedrez se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de estrategia de ajedrez, pero una relación no se sustenta en las decisiones y restricciones del ejemplo proporcionado.",
            "error": "Atribuye a estrategia de ajedrez relaciones incompatibles con las decisiones y restricciones del ejemplo proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "valor relativo|peones|posicion|plan|partida|notacion"
      },
      {
        "id": "chess-piece-value",
        "grade": 2,
        "label": "valor relativo de las piezas de ajedrez",
        "match": "valor relativo.*piezas",
        "relation": "la relación entre función de las piezas, posición y restricciones que sustentan su valor relativo",
        "sourceRecordIds": [
          "f6c11c97-5039-5d75-8749-9577f76a2b13"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "COMPARISON",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Valor relativo y condiciones de la posición",
            "success": "Compara el valor relativo de las piezas de ajedrez en las posiciones proporcionadas justificando sus diferencias según las restricciones dadas, sin puntuar ganar.",
            "sufficient": "La relación principal de valor relativo de las piezas se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de valor relativo de las piezas, pero una relación no se sustenta en las posiciones y restricciones proporcionadas.",
            "error": "Atribuye a valor relativo de las piezas relaciones incompatibles con las posiciones y restricciones proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "chess-pawn-structure",
        "grade": 2,
        "label": "estructura de peones de ajedrez",
        "match": "peones.*(?:aislados|doblados|retrasados|pasados)|estructura de peones",
        "relation": "la relación entre la estructura de peones expresamente seleccionada y las decisiones de la posición de ajedrez",
        "sourceRecordIds": [
          "f6c11c97-5039-5d75-8749-9577f76a2b13"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Estructura de peones y decisiones",
            "success": "Analiza los peones aislados y doblados de la posición proporcionada relacionando su estructura con las decisiones del referente de ajedrez.",
            "sufficient": "La relación principal de estructura de peones seleccionada se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de estructura de peones seleccionada, pero una relación no se sustenta en los peones y decisiones de la posición proporcionada.",
            "error": "Atribuye a estructura de peones seleccionada relaciones incompatibles con los peones y decisiones de la posición proporcionada o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "chess-position-analysis",
        "grade": 2,
        "label": "posición crítica y estrategias de ajedrez",
        "match": "posicion critica.*ajedrez|ajedrez.*posicion critica|analiza.*estrategias.*ajedrez",
        "relation": "la relación entre las estrategias elegidas, sus efectos y las restricciones de la posición crítica de ajedrez",
        "sourceRecordIds": [
          "f0714e96-05bd-535f-91cf-f48425b76b2e"
        ],
        "pdfPages": [
          364
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Estrategias de la posición crítica",
            "success": "Analiza las estrategias expresamente elegidas de la posición crítica de ajedrez justificando efectos y restricciones con las evidencias de la secuencia proporcionada.",
            "sufficient": "La relación principal de estrategias de la posición crítica se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de estrategias de la posición crítica, pero una relación no se sustenta en las jugadas y restricciones de la secuencia proporcionada.",
            "error": "Atribuye a estrategias de la posición crítica relaciones incompatibles con las jugadas y restricciones de la secuencia proporcionada o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "chess-plan",
        "grade": 2,
        "label": "plan de ajedrez",
        "match": "plan.*ajedrez|ajedrez.*plan",
        "relation": "la relación entre objetivo, puntos fuertes y débiles y respuestas previstas del plan de ajedrez",
        "sourceRecordIds": [
          "f6c11c97-5039-5d75-8749-9577f76a2b13"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Objetivo y respuestas previstas",
            "success": "Planifica las decisiones de ajedrez para la posición proporcionada relacionando objetivo, puntos fuertes y débiles y respuestas previstas según las reglas dadas, sin exigir jugar otra partida.",
            "sufficient": "La relación principal de plan de ajedrez se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de plan de ajedrez, pero una relación no se sustenta en la posición y reglas proporcionadas.",
            "error": "Atribuye a plan de ajedrez relaciones incompatibles con la posición y reglas proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "chess-gameplay",
        "grade": 2,
        "label": "partida adaptada de ajedrez",
        "match": "juega.*ajedrez|partida adaptada de ajedrez",
        "relation": "la relación entre jugadas, notación y estrategia elegida de la partida de ajedrez",
        "sourceRecordIds": [
          "d7dc5502-4298-5d9b-a75f-de48a5cc2a76"
        ],
        "pdfPages": [
          364
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugadas, notación y estrategia elegida",
            "success": "Juega la partida adaptada de ajedrez según las reglas dadas utilizando la notación proporcionada y justificando la estrategia elegida en la posición indicada, sin evaluar ganar.",
            "sufficient": "Las acciones principales de partida de ajedrez se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de partida de ajedrez no corresponde a las reglas y posiciones proporcionadas.",
            "error": "Las decisiones de partida de ajedrez contradicen las reglas y posiciones proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "chess-notation",
        "grade": 2,
        "label": "registro de jugadas de ajedrez",
        "match": "registra.*jugadas.*ajedrez|registro de jugadas de ajedrez",
        "relation": "la relación entre jugadas, notación y estrategia elegida del registro de ajedrez",
        "sourceRecordIds": [
          "d7dc5502-4298-5d9b-a75f-de48a5cc2a76"
        ],
        "pdfPages": [
          364
        ],
        "primaryPurpose": "REPORT",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugadas y notación del registro",
            "success": "Registra las jugadas de ajedrez proporcionadas con la notación dada relacionando la estrategia elegida con la posición indicada, sin exigir otra partida.",
            "sufficient": "La relación principal de registro de jugadas de ajedrez se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de registro de jugadas de ajedrez, pero una relación no se sustenta en las jugadas y posición proporcionadas.",
            "error": "Atribuye a registro de jugadas de ajedrez relaciones incompatibles con las jugadas y posición proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "juega"
      },
      {
        "id": "baseball-history",
        "grade": 2,
        "label": "historia de béisbol o softbol",
        "match": "(?:historia|hechos|personajes).*(?:beisbol|softbol)|(?:beisbol|softbol).*(?:historia|historicos)",
        "relation": "la relación entre hechos, personajes, fechas y fuentes de la disciplina y ámbito históricos expresamente asignados",
        "sourceRecordIds": [
          "8fe5285b-692c-574b-9d8c-ab9382b97c27",
          "6f30a124-ce07-5316-befa-a9a93ded600e"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y fuentes de la disciplina elegida",
            "success": "Presenta los hechos y personajes del softbol expresamente asignados relacionando fechas y evidencias de las fuentes del ámbito proporcionado.",
            "sufficient": "La relación principal de historia de la disciplina elegida se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de historia de la disciplina elegida, pero una relación no se sustenta en las fechas y fuentes del ámbito proporcionado.",
            "error": "Atribuye a historia de la disciplina elegida relaciones incompatibles con las fechas y fuentes del ámbito proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "baseball-rules",
        "grade": 2,
        "label": "reglas de béisbol o softbol",
        "match": "(?:reglas?|reglamento).*(?:beisbol|softbol)|(?:beisbol|softbol).*(?:reglas?|reglamento)",
        "relation": "las funciones y condiciones de las reglas de la disciplina expresamente elegida",
        "sourceRecordIds": [
          "8fe5285b-692c-574b-9d8c-ab9382b97c27",
          "6f30a124-ce07-5316-befa-a9a93ded600e"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas de la disciplina elegida",
            "success": "Verifica si las decisiones del caso de béisbol cumplen las reglas proporcionadas justificando cada marca con las evidencias del registro.",
            "sufficient": "La relación principal de reglas de la disciplina elegida se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de reglas de la disciplina elegida, pero una relación no se sustenta en las reglas y evidencias del registro proporcionado.",
            "error": "Atribuye a reglas de la disciplina elegida relaciones incompatibles con las reglas y evidencias del registro proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "beisbol ?5|beisbol cinco"
      },
      {
        "id": "baseball-five-rules",
        "grade": 2,
        "label": "reglas de béisbol y béisbol 5",
        "match": "reglas?.*beisbol ?5|beisbol cinco|beisbol ?5.*reglas?",
        "relation": "las semejanzas y diferencias entre las reglas de béisbol y béisbol 5 proporcionadas",
        "sourceRecordIds": [
          "6f30a124-ce07-5316-befa-a9a93ded600e"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "COMPARISON",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Reglas y decisiones de las dos variantes",
            "success": "Compara las reglas de béisbol y béisbol 5 expresamente proporcionadas relacionando semejanzas y diferencias con las decisiones de la situación dada.",
            "sufficient": "La relación principal de contraste entre béisbol y béisbol 5 se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de contraste entre béisbol y béisbol 5, pero una relación no se sustenta en las reglas y situaciones proporcionadas.",
            "error": "Atribuye a contraste entre béisbol y béisbol 5 relaciones incompatibles con las reglas y situaciones proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "baseball-positions",
        "grade": 2,
        "label": "posiciones infielder y outfielder",
        "match": "posiciones.*(?:infielder|outfielder)|(?:infielder|outfielder).*ubicacion",
        "relation": "la relación entre ubicación y función de las posiciones expresamente elegidas del béisbol",
        "sourceRecordIds": [
          "8fe5285b-692c-574b-9d8c-ab9382b97c27"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Ubicación y función defensiva",
            "success": "Analiza las posiciones infielder y outfielder del referente de béisbol relacionando ubicación y función defensiva con las evidencias proporcionadas.",
            "sufficient": "La relación principal de posiciones defensivas seleccionadas se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de posiciones defensivas seleccionadas, pero una relación no se sustenta en las ubicaciones y funciones del referente proporcionado.",
            "error": "Atribuye a posiciones defensivas seleccionadas relaciones incompatibles con las ubicaciones y funciones del referente proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "baseball-fielding",
        "grade": 2,
        "label": "fildeo adaptado de béisbol",
        "match": "fildea|fildeo.*beisbol|rolling|flay|fly",
        "relation": "la relación entre el batazo elegido, la posición y las decisiones del fildeo adaptado",
        "sourceRecordIds": [
          "6f30a124-ce07-5316-befa-a9a93ded600e",
          "a6c5b1da-27e1-5aba-b43a-60016fd03e4c"
        ],
        "pdfPages": [
          363,
          364
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Batazo elegido y decisiones de fildeo",
            "success": "Fildea el batazo de rolling expresamente elegido de la tarea adaptada de béisbol según posición y condiciones supervisadas dadas, con los apoyos permitidos.",
            "sufficient": "Las acciones principales de fildeo del batazo elegido se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de fildeo del batazo elegido no corresponde a las posiciones y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de fildeo del batazo elegido contradicen las posiciones y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "baseball-throwing",
        "grade": 2,
        "label": "tiro adaptado de béisbol",
        "match": "tiro.*beisbol|beisbol.*tiro",
        "relation": "la relación entre referencia, dirección y condiciones del tiro adaptado de béisbol",
        "sourceRecordIds": [
          "456fdf2a-8056-505d-a3cf-4adcd5bb2e85",
          "f5a84e79-cfab-5527-b943-3878206aed5e"
        ],
        "pdfPages": [
          364
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencia y dirección del tiro",
            "success": "Realiza el tiro adaptado de béisbol hacia la referencia expresamente indicada según dirección y condiciones supervisadas dadas, sin evaluar distancia máxima.",
            "sufficient": "Las acciones principales de tiro adaptado se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de tiro adaptado no corresponde a la referencia y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de tiro adaptado contradicen la referencia y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "baseball-pitcher",
        "grade": 2,
        "label": "mecánica adaptada de lanzador",
        "match": "mecanica.*lanzador|lanzador.*(?:frente|lado)",
        "relation": "la relación entre fases, señales y condiciones de la mecánica de lanzador expresamente elegida",
        "sourceRecordIds": [
          "6f30a124-ce07-5316-befa-a9a93ded600e",
          "9731854f-fe05-5660-8369-fb335af1a79c"
        ],
        "pdfPages": [
          363,
          364
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Mecánica de lanzador elegida",
            "success": "Ejecuta la mecánica adaptada de lanzador de lado de béisbol según las fases, señales y condiciones supervisadas proporcionadas.",
            "sufficient": "Las acciones principales de mecánica de lanzador elegida se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de mecánica de lanzador elegida no corresponde a las fases y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de mecánica de lanzador elegida contradicen las fases y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "baseball-batting",
        "grade": 2,
        "label": "bateo adaptado de béisbol",
        "match": "bateo|mecanica.*bate",
        "relation": "la relación entre localización, decisiones y condiciones adaptadas del bateo solicitado",
        "sourceRecordIds": [
          "6f30a124-ce07-5316-befa-a9a93ded600e",
          "2ddc6d7c-bad1-5d5e-a55f-595e9581bbf9"
        ],
        "pdfPages": [
          363,
          364
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Localización y decisiones de bateo",
            "success": "Ejecuta el bateo adaptado relacionando sus decisiones con la localización y condiciones supervisadas proporcionadas, utilizando los apoyos permitidos.",
            "sufficient": "Las acciones principales de bateo adaptado se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de bateo adaptado no corresponde a la localización y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de bateo adaptado contradicen la localización y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "base-running",
        "grade": 2,
        "label": "corrido de bases de béisbol",
        "match": "corre.*bases|corrido de.*bases|bases.*outs",
        "relation": "la relación entre decisiones del corrido de bases y los outs, compañeros y marcador de la situación dada",
        "sourceRecordIds": [
          "6f30a124-ce07-5316-befa-a9a93ded600e",
          "4aeba39e-c3bb-5195-9010-297230084ac8"
        ],
        "pdfPages": [
          363,
          364
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones según la situación de bases",
            "success": "Corre las bases de la situación adaptada relacionando sus decisiones con los outs, compañeros en base y marcador proporcionados, utilizando los apoyos permitidos.",
            "sufficient": "Las acciones principales de corrido de bases se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de corrido de bases no corresponde a los outs, compañeros en base y marcador proporcionados.",
            "error": "Las decisiones de corrido de bases contradicen los outs, compañeros en base y marcador proporcionados o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "martial-history",
        "grade": 2,
        "label": "historia de las artes marciales",
        "match": "(?:historia|hechos|historicos).*artes marciales|artes marciales.*historia",
        "relation": "la relación entre hechos, fechas, personajes y fuentes de las artes marciales del ámbito asignado",
        "sourceRecordIds": [
          "5f6c706d-7d63-5e51-beb2-18070ab1fff5",
          "bf5dee58-4d5e-5b18-8241-2fa9826ed9a3"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y fuentes de las artes marciales",
            "success": "Presenta los hechos históricos de las artes marciales expresamente asignados relacionando fechas y personajes con las fuentes proporcionadas.",
            "sufficient": "La relación principal de historia de las artes marciales se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de historia de las artes marciales, pero una relación no se sustenta en las fechas y fuentes del ámbito proporcionado.",
            "error": "Atribuye a historia de las artes marciales relaciones incompatibles con las fechas y fuentes del ámbito proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "martial-rules",
        "grade": 2,
        "label": "reglas de artes marciales",
        "match": "(?:reglas?|reglamento).*artes marciales|artes marciales.*(?:reglas?|reglamento)",
        "relation": "las funciones y condiciones de las reglas de artes marciales expresamente asignadas",
        "sourceRecordIds": [
          "5f6c706d-7d63-5e51-beb2-18070ab1fff5",
          "bf5dee58-4d5e-5b18-8241-2fa9826ed9a3"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas proporcionadas",
            "success": "Verifica si las decisiones del registro de artes marciales cumplen las reglas proporcionadas justificando cada marca con sus evidencias, sin exigir combate.",
            "sufficient": "La relación principal de reglas de artes marciales se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de reglas de artes marciales, pero una relación no se sustenta en las reglas y evidencias del registro proporcionado.",
            "error": "Atribuye a reglas de artes marciales relaciones incompatibles con las reglas y evidencias del registro proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "adaptaciones?"
      },
      {
        "id": "martial-equipment",
        "grade": 2,
        "label": "equipamiento de artes marciales",
        "match": "equipamiento.*artes marciales|artes marciales.*equipamiento",
        "relation": "la relación entre función del equipamiento elegido y las condiciones de uso del referente",
        "sourceRecordIds": [
          "5f6c706d-7d63-5e51-beb2-18070ab1fff5"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Función y condiciones del equipamiento",
            "success": "Analiza la función del equipamiento de artes marciales expresamente asignado relacionándola con las condiciones de uso del referente proporcionado, sin exigir compras o pruebas de contacto.",
            "sufficient": "La relación principal de equipamiento elegido se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de equipamiento elegido, pero una relación no se sustenta en las funciones y condiciones del referente proporcionado.",
            "error": "Atribuye a equipamiento elegido relaciones incompatibles con las funciones y condiciones del referente proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "martial-fundamentals",
        "grade": 2,
        "label": "fundamentos adaptados de artes marciales",
        "match": "fundamentos.*artes marciales|acciones basicas de artes marciales",
        "relation": "la relación entre fases, función y condiciones de los fundamentos de artes marciales expresamente elegidos",
        "sourceRecordIds": [
          "bf5dee58-4d5e-5b18-8241-2fa9826ed9a3",
          "d2120587-d8c6-5cf8-ad9a-0a480b579245"
        ],
        "pdfPages": [
          363,
          364
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones adaptadas y condiciones dadas",
            "success": "Ejecuta las acciones básicas de artes marciales expresamente adaptadas y supervisadas según las señales y condiciones proporcionadas, utilizando los apoyos permitidos sin improvisar maniobras nuevas.",
            "sufficient": "Las acciones principales de fundamentos expresamente adaptados se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de fundamentos expresamente adaptados no corresponde a las señales y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de fundamentos expresamente adaptados contradicen las señales y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "martial-risk-case",
        "grade": 2,
        "label": "decisiones defensivas y prevención de riesgos",
        "match": "caso.*artes marciales.*riesgo|decisiones defensivas.*artes marciales",
        "relation": "la relación entre decisiones defensivas, riesgos y condiciones de la ficha de prevención proporcionada",
        "sourceRecordIds": [
          "bf5dee58-4d5e-5b18-8241-2fa9826ed9a3",
          "926b0590-bbc5-512a-882c-f7785af86f06"
        ],
        "pdfPages": [
          363,
          364
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones del caso y prevención",
            "success": "Analiza las decisiones defensivas del caso simulado de artes marciales justificando su relación con los riesgos y condiciones de la ficha de prevención proporcionada, sin exigir ejecutar técnicas.",
            "sufficient": "La relación principal de decisiones defensivas del caso se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de decisiones defensivas del caso, pero una relación no se sustenta en la ficha de prevención y condiciones proporcionadas.",
            "error": "Atribuye a decisiones defensivas del caso relaciones incompatibles con la ficha de prevención y condiciones proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "martial-adaptation",
        "grade": 2,
        "label": "adaptaciones de artes marciales",
        "match": "adaptaciones?.*(?:elementos|reglas).*artes marciales|artes marciales adaptadas.*(?:reglas|elementos)",
        "relation": "la relación entre recursos, participación y adaptaciones de los elementos y reglas de artes marciales",
        "sourceRecordIds": [
          "957cd1b0-7c54-571b-9777-67e878e920e5",
          "bf5dee58-4d5e-5b18-8241-2fa9826ed9a3"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Adaptaciones y condiciones de participación",
            "success": "Analiza las adaptaciones de los elementos y reglas de artes marciales relacionando recursos y participación con las necesidades ya descritas, sin inferir diagnósticos ni penalizar apoyos.",
            "sufficient": "La relación principal de adaptaciones de artes marciales se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de adaptaciones de artes marciales, pero una relación no se sustenta en los recursos y condiciones de participación proporcionados.",
            "error": "Atribuye a adaptaciones de artes marciales relaciones incompatibles con los recursos y condiciones de participación proporcionados o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "chess-king-edge",
        "grade": 2,
        "label": "rey en la banda de ajedrez",
        "match": "rey.*banda|banda.*rey",
        "relation": "la relación entre posición del rey en la banda, restricciones y posibilidades del tablero proporcionado",
        "sourceRecordIds": [
          "f6c11c97-5039-5d75-8749-9577f76a2b13"
        ],
        "pdfPages": [
          363
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Rey en la banda y posibilidades dadas",
            "success": "Analiza la posición del rey en la banda del tablero de ajedrez proporcionado relacionando restricciones y posibilidades con las evidencias dadas.",
            "sufficient": "La relación principal de posición del rey en la banda se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de posición del rey en la banda, pero una relación no se sustenta en las restricciones y posibilidades del tablero proporcionado.",
            "error": "Atribuye a posición del rey en la banda relaciones incompatibles con las restricciones y posibilidades del tablero proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      }
    ],
    "policy": "REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1"
  },
  {
    "id": "educacion-fisica-comun-3",
    "grade": 3,
    "topics": [
      {
        "id": "physical-condition-explanation",
        "grade": 3,
        "label": "capacidades físicas en ejemplos adaptados",
        "match": "(?:explica[a-z]*|analiza[a-z]*|compara[a-z]*).*(?:fuerza rapida|velocidad de reaccion|traslacion|velocidad gestual|flexibilidad|resistencia aerobica|coordinacion|equilibrio|orientacion|capacidades fisicas)|velocidad maxima|aciclica|resistencia anaerobica",
        "relation": "las diferencias y relaciones entre las capacidades físicas expresamente elegidas en los ejemplos dados",
        "pdfPages": [
          365
        ],
        "sourceRecordIds": [
          "3006588f-6a06-5631-9f1d-4b5aa7e7318b"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Capacidades y evidencias del ejemplo",
            "success": "Explica las diferencias entre las capacidades físicas expresamente asignadas mediante evidencias de los ejemplos adaptados proporcionados, sin clasificar cuerpos o personas.",
            "sufficient": "Las diferencias principales se sustentan; una relación secundaria con el ejemplo queda poco precisada.",
            "partial": "Reconoce capacidades pertinentes, pero una diferencia no se vincula con la acción del ejemplo dado.",
            "error": "Atribuye a las capacidades funciones incompatibles con los ejemplos o sustituye sus evidencias por un juicio de capacidad natural."
          }
        ]
      },
      {
        "id": "circuit-plan",
        "grade": 3,
        "label": "organización de un circuito adaptado",
        "match": "circuito adaptado|estaciones?.*pausas?|pausas?.*estaciones?",
        "relation": "la relación entre estaciones, acciones, orden y pausas fijados en la ficha docente",
        "pdfPages": [
          365
        ],
        "sourceRecordIds": [
          "0cf01e93-3987-5b12-a223-a70f23521653"
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan de estaciones y pausas dadas",
            "success": "Planifica la organización del circuito adaptado relacionando estaciones, acciones y pausas ya fijadas en la ficha docente, sin añadir intensidad o duración nuevas.",
            "sufficient": "El plan relaciona las estaciones y pausas; una referencia secundaria al orden queda poco precisada.",
            "partial": "Identifica estaciones pertinentes, pero una relación de orden o pausa no corresponde a la ficha dada.",
            "error": "El plan modifica las condiciones proporcionadas o introduce dosis físicas no sustentadas en la ficha.",
            "variants": {
              "PERFORMANCE": {
                "title": "Estaciones y pausas del circuito dado",
                "success": "Ejecuta la secuencia de estaciones y acciones del circuito adaptado respetando las pausas y apoyos ya fijados en la ficha docente, sin añadir intensidad o duración nuevas.",
                "sufficient": "La secuencia de estaciones se reconoce; una transición secundaria pierde continuidad.",
                "partial": "Realiza acciones pertinentes, pero una transición o pausa no corresponde a la ficha dada.",
                "error": "Cambia las acciones o pausas de modo incompatible con las condiciones adaptadas proporcionadas."
              }
            }
          }
        ]
      },
      {
        "id": "flexibility-observation",
        "grade": 3,
        "label": "acciones de flexibilidad adaptadas",
        "match": "flexibilidad activa|flexibilidad pasiva|acciones? de flexibilidad",
        "relation": "la relación entre las acciones de flexibilidad elegidas y las condiciones adaptadas del referente",
        "pdfPages": [
          365
        ],
        "sourceRecordIds": [
          "9807829f-dce0-5d51-9f7f-f63ec511b719"
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Cumplimiento de acciones de flexibilidad",
            "success": "Identifica con evidencias si el referente cumple las acciones de flexibilidad expresamente adaptadas en la ficha docente, sin medir amplitud corporal ni añadir maniobras.",
            "sufficient": "La verificación se sustenta; una marca secundaria queda poco clara sin cambiar su resultado principal.",
            "partial": "Identifica acciones pertinentes, pero una marca no permite determinar si cumple la condición dada.",
            "error": "Atribuye un cumplimiento incompatible con el referente o lo sustituye por un juicio de amplitud o capacidad natural.",
            "variants": {
              "PERFORMANCE": {
                "title": "Acciones de flexibilidad adaptadas",
                "success": "Ejecuta las acciones de flexibilidad expresamente adaptadas en la ficha docente según las señales y apoyos acordados, sin puntuar amplitud corporal.",
                "sufficient": "Las acciones y sus señales se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Presenta acciones pertinentes, pero una respuesta no corresponde a la señal o adaptación acordadas.",
                "error": "Las acciones contradicen las condiciones adaptadas dadas o no permiten reconocer la secuencia solicitada."
              }
            }
          }
        ]
      },
      {
        "id": "motor-variation",
        "grade": 3,
        "label": "variaciones de dirección y velocidad",
        "match": "secuencia motriz|(?:combina|variacion|variando).*(?:desplazamientos|giros|direccion|sentido)|centro de gravedad",
        "relation": "la relación entre cambios motrices solicitados, señales y apoyos de la secuencia adaptada",
        "pdfPages": [
          365
        ],
        "sourceRecordIds": [
          "35e04d4b-d064-5cac-b3f1-190e8ea9cd60"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Respuestas a las señales motrices",
            "success": "Ejecuta los cambios de dirección y velocidad expresamente dados respondiendo a las señales y apoyos acordados de la secuencia adaptada.",
            "sufficient": "Los cambios y sus señales se reconocen; un ajuste secundario pierde continuidad sin romper la secuencia.",
            "partial": "Presenta respuestas pertinentes, pero un cambio no corresponde a la dirección o velocidad señaladas.",
            "error": "Las respuestas contradicen las señales dadas o impiden reconocer la secuencia motriz solicitada."
          }
        ]
      },
      {
        "id": "equilibrium-observation",
        "grade": 3,
        "label": "equilibrio y base de sustentación",
        "match": "equilibrio.*(?:base|referente)|base de sustentacion",
        "relation": "la relación entre base de sustentación, apoyos, plano y equilibrio del referente dado",
        "pdfPages": [
          365
        ],
        "sourceRecordIds": [
          "6331f88c-e0bc-5449-b9f6-c987ba6ffe90"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Base, apoyos y equilibrio del referente",
            "success": "Explica el equilibrio del referente relacionando base de sustentación, apoyos y plano expresamente señalados con evidencias de la ficha proporcionada.",
            "sufficient": "Las relaciones principales se sustentan; una referencia espacial secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación entre apoyo y equilibrio carece de sustento.",
            "error": "Atribuye al referente apoyos o efectos incompatibles con sus datos o sustituye el análisis por una maniobra no solicitada."
          }
        ]
      },
      {
        "id": "care-frequency",
        "grade": 3,
        "label": "cuidado observable de materiales y espacio",
        "match": "cuidado de materiales|cuidado.*espacio|frecuencia.*materiales.*espacio",
        "relation": "la relación entre acciones de cuidado de materiales y espacio y las condiciones expresamente trabajadas",
        "pdfPages": [
          365
        ],
        "sourceRecordIds": [
          "e5b3f395-569e-58ed-a570-7d301d637665"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones de cuidado observadas",
            "success": "Cumple las acciones concretas de cuidado de materiales y del espacio acordadas en todas las oportunidades observadas.",
            "sufficient": "Cumple las acciones de cuidado acordadas en casi todas las oportunidades observadas.",
            "partial": "Cumple las acciones de cuidado acordadas en algunas oportunidades observadas.",
            "error": "Cumple las acciones de cuidado acordadas en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "tactical-cooperation",
        "grade": 3,
        "label": "colaboración en soluciones técnico tácticas",
        "match": "solucion(?:es)?.*acuerdos? tecnicos?|acuerdos? tecnicos?.*solucion(?:es)?|cooperacion tecnico tactica",
        "relation": "la relación entre propuestas, acuerdos concretos y solución técnica de la tarea colectiva trabajada",
        "pdfPages": [
          365,
          366
        ],
        "sourceRecordIds": [
          "e900ea46-32c9-5d75-bd77-e67796281ede",
          "7f223771-e3a4-585b-9fd3-cd4fe9993db9"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aportes y acuerdos técnicos observados",
            "success": "Aporta propuestas pertinentes y cumple los acuerdos técnicos de la tarea colectiva dada en todas las oportunidades observadas, sin puntuar personalidad.",
            "sufficient": "Aporta propuestas y cumple acuerdos en casi todas las oportunidades observadas.",
            "partial": "Aporta propuestas y cumple acuerdos en algunas oportunidades observadas.",
            "error": "Aporta propuestas y cumple acuerdos en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "motor-progress-record",
        "grade": 3,
        "label": "análisis de progresión motriz documentada",
        "match": "progresion motriz|registro.*dos momentos",
        "relation": "la relación entre acciones adaptadas, condiciones y cambios documentados en dos momentos del registro dado",
        "pdfPages": [
          367
        ],
        "sourceRecordIds": [
          "499b3928-a488-51f1-a8dc-2fa9c72857fa"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Progresión según acciones y condiciones",
            "success": "Analiza los cambios del registro ficticio comparando el cumplimiento de las acciones adaptadas y las condiciones documentadas en los dos momentos proporcionados.",
            "sufficient": "Los cambios principales se sustentan; una referencia secundaria a las condiciones queda poco precisada.",
            "partial": "Identifica datos pertinentes, pero una conclusión de progresión no se vincula con acciones o condiciones comparables.",
            "error": "Atribuye al registro mejoras o causas no acreditadas por sus datos o sustituye el análisis por un ranking de capacidad natural."
          }
        ]
      },
      {
        "id": "continuous-running",
        "grade": 3,
        "label": "carrera continua adaptada",
        "match": "carrera continua|carreras continuas",
        "relation": "la relación entre acciones, señales y condiciones de la carrera continua adaptada proporcionada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones y condiciones de la carrera continua",
            "success": "Corre la carrera continua adaptada siguiendo las señales, pausas y condiciones supervisadas ya fijadas en la ficha docente, con los apoyos permitidos sin añadir duración o intensidad nuevas.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y condiciones adaptadas proporcionadas pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y condiciones adaptadas proporcionadas.",
            "error": "Las acciones contradicen las señales y condiciones adaptadas proporcionadas o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "1825db3e-53e0-562d-80e8-01427b712a30"
        ],
        "pdfPages": [
          365
        ]
      },
      {
        "id": "spatial-orientation",
        "grade": 3,
        "label": "orientación espacial con mapa",
        "match": "orientacion espacial|(?:recorrido|trayecto).*mapa|mapa.*(?:recorrido|trayecto)",
        "relation": "la relación entre puntos cardinales, referencias y decisiones del recorrido con mapa proporcionado",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Mapa, referencias y decisiones",
            "success": "Interpreta el recorrido del mapa proporcionado relacionando puntos cardinales y referencias con las condiciones del trayecto dado.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las referencias y condiciones del mapa proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las referencias y condiciones del mapa proporcionado.",
            "error": "Las decisiones o relaciones contradicen las referencias y condiciones del mapa proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "b87dfc34-b085-589f-ab55-af87a8169994"
        ],
        "pdfPages": [
          365
        ],
        "excludeWhen": "brujula|gps|carrera de orientacion"
      },
      {
        "id": "compass-orientation",
        "grade": 3,
        "label": "orientación con brújula",
        "match": "orientacion.*brujula|brujula.*(?:orientacion|referencias)",
        "relation": "la relación entre puntos cardinales, referencias de la brújula y decisiones del trayecto proporcionado",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Brújula y decisiones del trayecto",
            "success": "Explica las referencias de orientación con brújula proporcionadas relacionándolas con los puntos cardinales y decisiones del trayecto dado.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las referencias y condiciones del sistema proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las referencias y condiciones del sistema proporcionado.",
            "error": "Las decisiones o relaciones contradicen las referencias y condiciones del sistema proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "693cea6d-5e7b-5c75-873d-c97495524f34",
          "b87dfc34-b085-589f-ab55-af87a8169994"
        ],
        "pdfPages": [
          365
        ],
        "excludeWhen": "carrera de orientacion"
      },
      {
        "id": "gps-orientation",
        "grade": 3,
        "label": "referencias GPS de orientación",
        "match": "gps.*(?:orientacion|registro)|orientacion.*gps|referencias gps",
        "relation": "la relación entre referencias GPS y decisiones del recorrido de orientación proporcionado",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias GPS y decisiones",
            "success": "Analiza las referencias GPS del registro proporcionado de orientación relacionándolas con las decisiones del recorrido dado, sin solicitar ubicación personal.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las referencias y condiciones del registro proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las referencias y condiciones del registro proporcionado.",
            "error": "Las decisiones o relaciones contradicen las referencias y condiciones del registro proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "b87dfc34-b085-589f-ab55-af87a8169994"
        ],
        "pdfPages": [
          365
        ],
        "excludeWhen": "carrera de orientacion"
      },
      {
        "id": "orientation-race",
        "grade": 3,
        "label": "carrera de orientación adaptada",
        "match": "(?:recorre|planifica|plan|juega).*carrera de orientacion",
        "relation": "la relación entre mapa, balizas, tarjetas y decisiones de la carrera de orientación adaptada solicitada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias y decisiones del recorrido",
            "success": "Recorre la carrera de orientación adaptada de la simulación supervisada siguiendo el mapa, las balizas y las tarjetas expresamente dados con los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las referencias y condiciones supervisadas proporcionadas pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las referencias y condiciones supervisadas proporcionadas.",
            "error": "Las acciones contradicen las referencias y condiciones supervisadas proporcionadas o impiden reconocer el desempeño solicitado.",
            "plan": {
              "id": "requested-evidence",
              "title": "Mapa y decisiones previstas",
              "success": "Planifica la carrera de orientación adaptada del caso proporcionado relacionando mapa, balizas, tarjetas y acuerdos dados, sin exigir realizar el recorrido todavía.",
              "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las referencias y condiciones del caso proporcionado queda poco precisada.",
              "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las referencias y condiciones del caso proporcionado.",
              "error": "Las decisiones o relaciones contradicen las referencias y condiciones del caso proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
            }
          }
        ],
        "sourceRecordIds": [
          "693cea6d-5e7b-5c75-873d-c97495524f34",
          "492d89a9-b833-5002-ab26-fad7e12a73e8"
        ],
        "pdfPages": [
          365,
          367
        ],
        "excludeWhen": "historia|historicos|concepto|reglas"
      },
      {
        "id": "orientation-rules",
        "grade": 3,
        "label": "concepto y reglas de carrera de orientación",
        "match": "(?:concepto|reglas).*carrera de orientacion|carrera de orientacion.*(?:concepto|reglas)",
        "relation": "el concepto de carrera de orientación y las funciones de las reglas expresamente trabajadas",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Funciones de las reglas de orientación",
            "success": "Explica el concepto y las reglas de la carrera de orientación relacionando sus funciones con los ejemplos proporcionados, sin exigir recorrer un trayecto.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los ejemplos y las reglas proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los ejemplos y las reglas proporcionados.",
            "error": "Las decisiones o relaciones contradicen los ejemplos y las reglas proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "693cea6d-5e7b-5c75-873d-c97495524f34"
        ],
        "pdfPages": [
          365
        ]
      },
      {
        "id": "orientation-history",
        "grade": 3,
        "label": "historia de carrera de orientación",
        "match": "(?:historia|hechos historicos).*carrera de orientacion",
        "relation": "la relación entre hechos históricos, fechas y fuentes de la carrera de orientación del ámbito asignado",
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y fuentes de la carrera de orientación",
            "success": "Presenta los hechos históricos de la carrera de orientación del ámbito expresamente asignado relacionando fechas y evidencias de las fuentes dadas.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los hechos, fechas y fuentes del ámbito proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los hechos, fechas y fuentes del ámbito proporcionado.",
            "error": "Las decisiones o relaciones contradicen los hechos, fechas y fuentes del ámbito proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "157aece8-0670-5309-a167-99cf8c75b68c"
        ],
        "pdfPages": [
          367
        ]
      },
      {
        "id": "wellbeing-reference",
        "grade": 3,
        "label": "efectos de actividad física sobre salud y bienestar",
        "match": "(?:efectos|importancia).*actividad fisica.*(?:salud|bienestar)|(?:salud|bienestar).*(?:yoga|pilates|aerobicos|zumba|crossfit|step|steep|thai chi|tai chi)|imagen corporal",
        "relation": "la relación entre actividad física, salud y bienestar en los referentes proporcionados",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Efectos y evidencias del referente",
            "success": "Analiza los efectos de la actividad física sobre salud y bienestar relacionando acciones y condiciones de los referentes proporcionados con las evidencias de sus fichas, sin recomendaciones personales ni diagnósticos.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los referentes y las fichas proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los referentes y las fichas proporcionados.",
            "error": "Las decisiones o relaciones contradicen los referentes y las fichas proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "ef1d5b6e-7749-5d06-a379-6c0e2083d61b",
          "4d986105-77d6-5068-b5c3-9fb0a924247d",
          "37f78100-3853-5cbb-b871-e607e9c3e085"
        ],
        "pdfPages": [
          365,
          367
        ]
      },
      {
        "id": "volleyball-history",
        "grade": 3,
        "label": "historia del voleibol",
        "match": "(?:historia|hechos|personajes).*voleibol|voleibol.*(?:historia|historicos)",
        "relation": "la relación entre hechos, personajes, fechas y fuentes del ámbito histórico de la variante de voleibol asignada",
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y fuentes del voleibol",
            "success": "Presenta los hechos y personajes de la variante de voleibol expresamente asignada relacionando fechas y evidencias de las fuentes del ámbito dado.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las fechas y fuentes del ámbito proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las fechas y fuentes del ámbito proporcionado.",
            "error": "Las decisiones o relaciones contradicen las fechas y fuentes del ámbito proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "de437244-d7b8-5bc6-9c75-314e0a3dec51",
          "95e78887-ae9f-5871-81e7-0e6767681240"
        ],
        "pdfPages": [
          365
        ]
      },
      {
        "id": "volleyball-rules",
        "grade": 3,
        "label": "reglas de voleibol",
        "match": "(?:reglas|reglamento).*voleibol|voleibol.*(?:reglas|reglamento)",
        "relation": "las funciones y condiciones de las reglas de la variante de voleibol expresamente elegida",
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas de voleibol",
            "success": "Verifica si las decisiones del registro proporcionado de la variante de voleibol elegida cumplen las reglas dadas, justificando cada marca con sus evidencias.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las reglas y evidencias del registro proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las reglas y evidencias del registro proporcionado.",
            "error": "Las decisiones o relaciones contradicen las reglas y evidencias del registro proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "bc72d162-e802-5728-8c7e-a6f5475d5ac7",
          "1233e2b4-d443-59d7-ae02-48f791e9cd15"
        ],
        "pdfPages": [
          365,
          366
        ],
        "excludeWhen": "adaptaciones|elementos tecnicos"
      },
      {
        "id": "volleyball-postures",
        "grade": 3,
        "label": "posturas fundamentales de voleibol",
        "match": "posturas.*voleibol|voleibol.*posturas",
        "relation": "la relación entre apoyos, posición y función de las posturas de voleibol del referente",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Apoyos y función de las posturas",
            "success": "Analiza las posturas fundamentales de voleibol del referente relacionando apoyos y posición con la función solicitada y las condiciones dadas.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los apoyos y condiciones del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los apoyos y condiciones del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen los apoyos y condiciones del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "de437244-d7b8-5bc6-9c75-314e0a3dec51",
          "636af9d6-6f96-5676-bd7b-c0167b6cf6da"
        ],
        "pdfPages": [
          365,
          366
        ]
      },
      {
        "id": "volleyball-displacements",
        "grade": 3,
        "label": "desplazamientos adaptados de voleibol",
        "match": "desplazamientos.*voleibol|voleibol.*desplazamientos",
        "relation": "la relación entre desplazamientos, señales y posiciones de la tarea adaptada de voleibol",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Desplazamientos y señales de voleibol",
            "success": "Ejecuta los desplazamientos adaptados de voleibol según las señales, posiciones y condiciones supervisadas proporcionadas, utilizando los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y posiciones de la tarea proporcionada pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y posiciones de la tarea proporcionada.",
            "error": "Las acciones contradicen las señales y posiciones de la tarea proporcionada o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "de437244-d7b8-5bc6-9c75-314e0a3dec51"
        ],
        "pdfPages": [
          365
        ]
      },
      {
        "id": "volleyball-pass",
        "grade": 3,
        "label": "pase de voleibol expresamente elegido",
        "match": "(?:pase|toque).*(?:antebrazos|manos altas)|(?:antebrazos|manos altas).*voleibol",
        "relation": "la relación entre función, posición y señales del pase de voleibol expresamente elegido",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Pase elegido y señales dadas",
            "success": "Ejecuta el pase de voleibol expresamente elegido según las señales y condiciones supervisadas dadas con los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y condiciones del pase elegido pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y condiciones del pase elegido.",
            "error": "Las acciones contradicen las señales y condiciones del pase elegido o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "636af9d6-6f96-5676-bd7b-c0167b6cf6da",
          "5d73ef6a-0630-545d-ba74-2c06c414aeca"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "volleyball-attack",
        "grade": 3,
        "label": "acomodada y ataque de voleibol",
        "match": "(?:acomodada|ataque|remate).*voleibol|voleibol.*(?:acomodada|ataque|remate)",
        "relation": "la relación entre posición, señales, acomodada y ataque de voleibol expresamente solicitados",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acomodada y función ofensiva",
            "success": "Analiza la acomodada y el remate del referente de voleibol relacionando posición, señales y función ofensiva con las evidencias dadas, sin exigir ejecutar un salto.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las posiciones y señales del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las posiciones y señales del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen las posiciones y señales del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "ae0e53eb-24f8-5ccc-9a79-39a216213ef1",
          "69b4510f-ff0d-5449-957f-b4a3e043436c"
        ],
        "pdfPages": [
          366,
          367
        ],
        "excludeWhen": "recepciona|recepcion|bloqueo|saque de abajo|juega|defensa"
      },
      {
        "id": "volleyball-reception",
        "grade": 3,
        "label": "recepción adaptada de voleibol",
        "match": "recepciona.*voleibol|recepcion.*voleibol|voleibol.*recepcion",
        "relation": "la relación entre posición, señales y decisiones de la recepción de voleibol solicitada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Recepción elegida y señales",
            "success": "Recepciona el balón de voleibol de la situación expresamente elegida según la posición, señales y condiciones supervisadas dadas, con los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y condiciones de la recepción elegida pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y condiciones de la recepción elegida.",
            "error": "Las acciones contradicen las señales y condiciones de la recepción elegida o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "08005e54-aa3d-5f78-9f48-447f67b12f35"
        ],
        "pdfPages": [
          366
        ],
        "excludeWhen": "juega|bloqueo"
      },
      {
        "id": "volleyball-block",
        "grade": 3,
        "label": "bloqueo de voleibol",
        "match": "bloqueo.*voleibol|voleibol.*bloqueo",
        "relation": "la relación entre posición, decisiones y función defensiva del bloqueo de voleibol",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Bloqueo y función defensiva",
            "success": "Analiza el bloqueo del referente de voleibol relacionando posición, decisiones y condiciones de defensa con las evidencias proporcionadas, sin exigir ejecutarlo.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las posiciones y condiciones del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las posiciones y condiciones del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen las posiciones y condiciones del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "08005e54-aa3d-5f78-9f48-447f67b12f35",
          "e1314cf9-ad20-5d62-be63-766ad8cfab87"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "volleyball-defence",
        "grade": 3,
        "label": "plan de defensa de voleibol",
        "match": "(?:planifica|plan|decisiones de defensa).*voleibol|voleibol.*plan de defensa",
        "relation": "la relación entre posiciones, apoyos y decisiones defensivas previstas para la situación de voleibol dada",
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posiciones y decisiones previstas",
            "success": "Planifica las decisiones de defensa de voleibol para la situación adaptada dada relacionando posiciones y apoyos con las reglas proporcionadas, sin exigir jugar todavía.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las posiciones, apoyos y reglas proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las posiciones, apoyos y reglas proporcionados.",
            "error": "Las decisiones o relaciones contradicen las posiciones, apoyos y reglas proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "de437244-d7b8-5bc6-9c75-314e0a3dec51",
          "08005e54-aa3d-5f78-9f48-447f67b12f35"
        ],
        "pdfPages": [
          365,
          366
        ]
      },
      {
        "id": "volleyball-game",
        "grade": 3,
        "label": "juego adaptado de voleibol",
        "match": "juega.*voleibol|voleibol.*(?:4 contra 4|6 contra 6)",
        "relation": "la relación entre reglas, decisiones y acciones expresamente solicitadas del juego adaptado de voleibol",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones del juego adaptado",
            "success": "Juega la variante adaptada de voleibol expresamente elegida en cancha modificada aplicando las reglas, acciones y apoyos proporcionados, sin evaluar ganar.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las reglas y condiciones del juego proporcionado pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las reglas y condiciones del juego proporcionado.",
            "error": "Las acciones contradicen las reglas y condiciones del juego proporcionado o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "472e9822-b1c8-5f8b-b449-855a6f0a2611",
          "107d3115-dbe8-56c2-b39a-f234cc20cd1a"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "volleyball-serve",
        "grade": 3,
        "label": "saque de voleibol elegido",
        "match": "(?:ejecuta|analiza|explica).*saque.*voleibol|saque de abajo.*voleibol",
        "relation": "la relación entre señales, función y condiciones del saque de voleibol expresamente elegido",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Saque y señales de la tarea",
            "success": "Ejecuta el saque de voleibol expresamente elegido según las señales y condiciones supervisadas dadas, utilizando los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y condiciones del saque elegido pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y condiciones del saque elegido.",
            "error": "Las acciones contradicen las señales y condiciones del saque elegido o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "de437244-d7b8-5bc6-9c75-314e0a3dec51",
          "472e9822-b1c8-5f8b-b449-855a6f0a2611"
        ],
        "pdfPages": [
          365,
          366
        ],
        "excludeWhen": "juega|recepciona|recepcion"
      },
      {
        "id": "volleyball-seated",
        "grade": 3,
        "label": "adaptaciones técnicas del voleibol sentado",
        "match": "adaptaciones.*voleibol sentado|elementos tecnicos.*voleibol sentado",
        "relation": "la relación entre recursos, participación y adaptaciones técnicas del voleibol sentado expresamente trabajadas",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Adaptaciones y condiciones de participación",
            "success": "Analiza las adaptaciones de los elementos técnicos del voleibol sentado relacionando recursos y participación con las necesidades del caso proporcionado, sin inferir diagnósticos.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los recursos y condiciones de participación proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los recursos y condiciones de participación proporcionados.",
            "error": "Las decisiones o relaciones contradicen los recursos y condiciones de participación proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "1233e2b4-d443-59d7-ae02-48f791e9cd15",
          "492d89a9-b833-5002-ab26-fad7e12a73e8"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "football-history",
        "grade": 3,
        "label": "historia de fútbol",
        "match": "(?:historia|hechos historicos|personajes).*(?:futbol|futsal)",
        "relation": "la relación entre hechos, personajes, fechas y fuentes de la variante y ámbito históricos de fútbol asignados",
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y fuentes de la variante elegida",
            "success": "Presenta los hechos históricos de la variante de fútbol expresamente asignada relacionando personajes, fechas y evidencias de las fuentes del ámbito dado.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los hechos, fechas y fuentes del ámbito proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los hechos, fechas y fuentes del ámbito proporcionado.",
            "error": "Las decisiones o relaciones contradicen los hechos, fechas y fuentes del ámbito proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "2b18eaff-d547-5886-a27b-d8ba358019c5",
          "4e275183-394d-54b3-a41d-4d00bd5b98b9"
        ],
        "pdfPages": [
          366
        ],
        "excludeWhen": "arena"
      },
      {
        "id": "football-rules",
        "grade": 3,
        "label": "reglas de fútbol",
        "match": "(?:reglas|reglamento).*futbol|futbol.*(?:reglas|reglamento)",
        "relation": "las funciones y condiciones de las reglas de la variante de fútbol expresamente elegida",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Funciones y condiciones de las reglas",
            "success": "Explica las reglas de la variante de fútbol expresamente elegida relacionando sus funciones con los ejemplos proporcionados.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los ejemplos y reglas proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los ejemplos y reglas proporcionados.",
            "error": "Las decisiones o relaciones contradicen los ejemplos y reglas proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento.",
            "variants": {
              "VERIFICATION": {
                "id": "requested-evidence",
                "title": "Decisiones y reglas de fútbol",
                "success": "Verifica si las decisiones del registro proporcionado de fútbol cumplen las reglas dadas justificando cada marca con sus evidencias, sin exigir jugar otra situación.",
                "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las reglas y evidencias del registro proporcionado queda poco precisada.",
                "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las reglas y evidencias del registro proporcionado.",
                "error": "Las decisiones o relaciones contradicen las reglas y evidencias del registro proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
              }
            }
          }
        ],
        "sourceRecordIds": [
          "962ed019-2bba-538a-965d-149fe4093768",
          "2b18eaff-d547-5886-a27b-d8ba358019c5",
          "3db475cd-7750-5fe4-b5c0-d2a80ac465f5"
        ],
        "pdfPages": [
          366
        ],
        "excludeWhen": "juega|ataque|defensa|adaptaciones|cascabeles"
      },
      {
        "id": "football-positions",
        "grade": 3,
        "label": "posiciones de jugadores de fútbol",
        "match": "posiciones.*(?:jugadores.*)?futbol|futbol.*posiciones",
        "relation": "la relación entre ubicación y función de las posiciones de los jugadores de fútbol del referente",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Ubicación y función de las posiciones",
            "success": "Analiza las posiciones de los jugadores de fútbol del referente relacionando ubicación y función con las evidencias proporcionadas.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las ubicaciones y funciones del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las ubicaciones y funciones del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen las ubicaciones y funciones del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "2cf305b5-7587-5e80-90e2-326ddd15bbe5",
          "75c339c5-4b9e-5858-bf71-9c106f854fc8"
        ],
        "pdfPages": [
          366,
          367
        ],
        "excludeWhen": "arena|ataque|defensa"
      },
      {
        "id": "football-conduction",
        "grade": 3,
        "label": "conducción adaptada de fútbol",
        "match": "conduce.*balon.*futbol|conduccion.*futbol|futbol.*conduccion",
        "relation": "la relación entre trayecto, cambio de dirección, obstáculos y decisiones de la conducción de fútbol dada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Trayecto y decisiones de conducción",
            "success": "Conduce el balón de fútbol por el trayecto adaptado dado relacionando los cambios de dirección con los obstáculos y señales ya proporcionados, según las condiciones supervisadas.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las referencias y condiciones del trayecto proporcionado pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las referencias y condiciones del trayecto proporcionado.",
            "error": "Las acciones contradicen las referencias y condiciones del trayecto proporcionado o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "7e9729bf-7498-50fd-b8dd-5226f7693282",
          "261577e6-8b9c-57d6-a6d8-4dbb90e4fa58"
        ],
        "pdfPages": [
          366,
          367
        ],
        "excludeWhen": "arena"
      },
      {
        "id": "football-pass",
        "grade": 3,
        "label": "pases adaptados de fútbol",
        "match": "pases.*futbol|futbol.*pases",
        "relation": "la relación entre distancia, referencia y condiciones de los pases de fútbol expresamente elegidos",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Distancia y referencia del pase",
            "success": "Ejecuta los pases de fútbol a la distancia expresamente elegida hacia la referencia señalada y según las condiciones supervisadas dadas, con los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las referencias y condiciones del pase elegido pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las referencias y condiciones del pase elegido.",
            "error": "Las acciones contradicen las referencias y condiciones del pase elegido o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "b86648af-6fe2-5664-bace-0ce61e85e93e",
          "c74d1408-f8b2-526a-a77a-f0feb095ee9c"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "football-reception",
        "grade": 3,
        "label": "recepción adaptada de fútbol",
        "match": "recepciona.*futbol|recepcion.*futbol|futbol.*recepcion",
        "relation": "la relación entre la parte del cuerpo elegida, señales y decisiones de la recepción de fútbol dada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y señales de recepción",
            "success": "Recepciona el balón de fútbol con la parte del cuerpo expresamente elegida según las señales y condiciones supervisadas dadas, utilizando los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y condiciones de la recepción elegida pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y condiciones de la recepción elegida.",
            "error": "Las acciones contradicen las señales y condiciones de la recepción elegida o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "ba4e0dfb-d85a-53d8-a09b-94ae32f0772e",
          "26075342-cbeb-56f9-a504-1ece633dbc57"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "football-shot",
        "grade": 3,
        "label": "tiro de fútbol elegido",
        "match": "(?:tiro|penalti).*futbol|futbol.*(?:tiro|penalti)",
        "relation": "la relación entre decisión, trayectoria y reglas del tiro de fútbol expresamente elegido",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y trayectoria del tiro",
            "success": "Analiza el tiro de fútbol expresamente elegido relacionando decisión y trayectoria con las condiciones y reglas proporcionadas.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las trayectorias y reglas del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las trayectorias y reglas del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen las trayectorias y reglas del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento.",
            "plan": {
              "id": "requested-evidence",
              "title": "Alternativas y trayectoria prevista",
              "success": "Planifica la decisión del tiro de fútbol expresamente elegido para la posición dada relacionando alternativas, trayectoria prevista y reglas proporcionadas, sin exigir ejecutarlo.",
              "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las alternativas y reglas de la posición proporcionada queda poco precisada.",
              "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las alternativas y reglas de la posición proporcionada.",
              "error": "Las decisiones o relaciones contradicen las alternativas y reglas de la posición proporcionada o sustituyen el desempeño solicitado por una afirmación sin sustento."
            }
          }
        ],
        "sourceRecordIds": [
          "3db475cd-7750-5fe4-b5c0-d2a80ac465f5",
          "17544931-3bc6-55a3-acc3-e6ef8c48ffbf",
          "962ed019-2bba-538a-965d-149fe4093768"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "football-header-reference",
        "grade": 3,
        "label": "toque de cabeza de fútbol",
        "match": "toque de cabeza.*futbol|futbol.*toque de cabeza",
        "relation": "la relación entre función y condiciones del toque de cabeza del referente de fútbol adaptado",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Función y condiciones del referente",
            "success": "Analiza el toque de cabeza del referente adaptado de fútbol relacionando su función y condiciones con las evidencias dadas, sin exigir ejecutarlo ni dar instrucciones nuevas para practicarlo.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las funciones y condiciones del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las funciones y condiciones del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen las funciones y condiciones del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "41f915d4-39df-5d0a-9cea-7435a721584e"
        ],
        "pdfPages": [
          366
        ]
      },
      {
        "id": "football-attack-defence",
        "grade": 3,
        "label": "decisiones de ataque y defensa de fútbol",
        "match": "(?:compara|contrasta|analiza).*ataque.*defensa.*futbol|futbol.*decisiones de ataque y defensa",
        "relation": "las semejanzas y diferencias entre decisiones de ataque y defensa del referente de fútbol proporcionado",
        "primaryPurpose": "COMPARISON",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Contraste de las decisiones tácticas",
            "success": "Compara las decisiones de ataque y defensa del referente de fútbol relacionando posiciones, reglas y alternativas proporcionadas.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las posiciones y alternativas del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las posiciones y alternativas del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen las posiciones y alternativas del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "d7faa4c6-7d4b-5e01-a9db-dd2aa0ab636d"
        ],
        "pdfPages": [
          366
        ]
      },
      {
        "id": "football-game",
        "grade": 3,
        "label": "juego adaptado de fútbol",
        "match": "juega.*(?:futbol|futsal)|juego adaptado de futbol",
        "relation": "la relación entre reglas, decisiones técnico tácticas y apoyos del juego adaptado de fútbol elegido",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones técnico tácticas del juego",
            "success": "Juega la situación adaptada de la variante de fútbol elegida aplicando las reglas y decisiones técnico tácticas expresamente proporcionadas con los apoyos acordados, sin evaluar ganar.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las reglas y condiciones del juego proporcionado pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las reglas y condiciones del juego proporcionado.",
            "error": "Las acciones contradicen las reglas y condiciones del juego proporcionado o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "d7faa4c6-7d4b-5e01-a9db-dd2aa0ab636d",
          "492d89a9-b833-5002-ab26-fad7e12a73e8"
        ],
        "pdfPages": [
          366,
          367
        ],
        "excludeWhen": "arena|cascabeles"
      },
      {
        "id": "football-arena",
        "grade": 3,
        "label": "referente de fútbol arena",
        "match": "futbol arena",
        "relation": "la relación entre las acciones de fútbol arena expresamente trabajadas y las condiciones del referente proporcionado",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones y condiciones de fútbol arena",
            "success": "Analiza la conducción y posiciones del fútbol arena del referente relacionando función y condiciones con las evidencias dadas, sin exigir jugar un partido.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las acciones y condiciones del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las acciones y condiciones del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen las acciones y condiciones del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "ccd38f0a-fdc9-5096-87b9-ec01d46742f2"
        ],
        "pdfPages": [
          366
        ]
      },
      {
        "id": "football-adaptation",
        "grade": 3,
        "label": "adaptaciones de fútbol con cascabeles",
        "match": "adaptaciones.*futbol.*cascabeles|futbol con cascabeles.*adaptaciones",
        "relation": "la relación entre recursos, condiciones de participación y adaptaciones del fútbol con cascabeles solicitadas",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Recursos y participación con cascabeles",
            "success": "Analiza las adaptaciones del fútbol con cascabeles relacionando recursos y condiciones de participación del caso proporcionado con las evidencias dadas, sin inferir diagnósticos ni penalizar apoyos.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los recursos y condiciones de participación proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los recursos y condiciones de participación proporcionados.",
            "error": "Las decisiones o relaciones contradicen los recursos y condiciones de participación proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "492d89a9-b833-5002-ab26-fad7e12a73e8"
        ],
        "pdfPages": [
          367
        ]
      },
      {
        "id": "chess-opening-types",
        "grade": 3,
        "label": "tipos de aperturas de ajedrez",
        "match": "(?:clasifica|tipos|identifica).*aperturas.*ajedrez|aperturas (?:abiertas|cerradas|semiabiertas).*posiciones.*ajedrez",
        "relation": "la relación entre tipos de aperturas y secuencias de jugadas de las posiciones de ajedrez proporcionadas",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Clasificación y evidencias de las aperturas",
            "success": "Clasifica las aperturas de ajedrez expresamente solicitadas justificando sus diferencias con las jugadas de las posiciones proporcionadas.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las secuencias y posiciones de ajedrez proporcionadas queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las secuencias y posiciones de ajedrez proporcionadas.",
            "error": "Las decisiones o relaciones contradicen las secuencias y posiciones de ajedrez proporcionadas o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "bb9e4d49-28dc-5416-a149-9d6ccc594014",
          "ba1433d1-2004-53fb-b4a4-1e41d29e3806"
        ],
        "pdfPages": [
          366,
          367
        ],
        "excludeWhen": "juega|reproduce|repertorio|esquema|transposicion"
      },
      {
        "id": "chess-transposition",
        "grade": 3,
        "label": "transposición de aperturas de ajedrez",
        "match": "transposicion.*aperturas.*ajedrez|ajedrez.*transposicion",
        "relation": "la relación entre secuencias de jugadas y posición resultante en la transposición de aperturas de ajedrez",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Secuencias y posición resultante",
            "success": "Analiza la transposición de aperturas de ajedrez relacionando las dos secuencias de jugadas proporcionadas con la posición resultante, sin exigir otra partida.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las secuencias y posiciones de ajedrez proporcionadas queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las secuencias y posiciones de ajedrez proporcionadas.",
            "error": "Las decisiones o relaciones contradicen las secuencias y posiciones de ajedrez proporcionadas o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "9f7847e9-62b6-5baa-be4d-6753285e3077"
        ],
        "pdfPages": [
          366
        ]
      },
      {
        "id": "chess-reproduction",
        "grade": 3,
        "label": "reproducción de partida de ajedrez",
        "match": "reproduce.*(?:partida|jugadas).*ajedrez|partida.*maestro.*ajedrez",
        "relation": "la relación entre las jugadas de la partida de ajedrez del maestro proporcionada y las aperturas identificadas",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugadas y aperturas de la partida dada",
            "success": "Reproduce las jugadas de la partida de ajedrez del maestro proporcionada e identifica las aperturas utilizadas según las posiciones y reglas dadas, sin exigir ganar otra partida.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las jugadas y posiciones de la partida proporcionada pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las jugadas y posiciones de la partida proporcionada.",
            "error": "Las acciones contradicen las jugadas y posiciones de la partida proporcionada o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "2c7032f9-7ab5-5bca-bc7b-db8fdc26137b"
        ],
        "pdfPages": [
          366
        ]
      },
      {
        "id": "chess-opening-game",
        "grade": 3,
        "label": "partida con apertura regular de ajedrez",
        "match": "juega.*ajedrez.*apertura (?:abierta|cerrada|semiabierta)|apertura regular.*ajedrez",
        "relation": "la relación entre apertura regular elegida, jugadas y anotación de la partida de ajedrez proporcionada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Apertura elegida y anotación",
            "success": "Juega la partida adaptada de ajedrez con anotación utilizando la apertura regular expresamente elegida según la posición y reglas dadas, sin exigir otras aperturas ni ganar.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las aperturas, reglas y posiciones proporcionadas pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las aperturas, reglas y posiciones proporcionadas.",
            "error": "Las acciones contradicen las aperturas, reglas y posiciones proporcionadas o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "e1f1a2da-0258-5919-9c1b-01c90421f441"
        ],
        "pdfPages": [
          366
        ]
      },
      {
        "id": "chess-irregular-game",
        "grade": 3,
        "label": "partida con apertura irregular de ajedrez",
        "match": "juega.*ajedrez.*apertura irregular|apertura irregular.*ajedrez",
        "relation": "la relación entre apertura irregular elegida, jugadas y anotación de la partida de ajedrez proporcionada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Apertura irregular y anotación",
            "success": "Juega la partida adaptada de ajedrez con anotación utilizando la apertura irregular elegida según la posición y reglas proporcionadas, sin exigir otros tipos ni ganar.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las reglas y posiciones proporcionadas pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las reglas y posiciones proporcionadas.",
            "error": "Las acciones contradicen las reglas y posiciones proporcionadas o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "f65b4548-87a3-5822-9bb6-1afcd4ecf30d"
        ],
        "pdfPages": [
          366
        ]
      },
      {
        "id": "chess-scheme",
        "grade": 3,
        "label": "esquema de apertura de ajedrez",
        "match": "(?:crea|esquema).*apertura.*ajedrez|ajedrez.*esquema de apertura",
        "relation": "la relación entre objetivo de ataque, respuestas defensivas y organización del esquema de apertura de ajedrez",
        "primaryPurpose": "PRODUCTION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Objetivo y respuestas del esquema",
            "success": "Crea el esquema de apertura de ajedrez para la posición dada relacionando objetivo de ataque y respuestas de defensa con las reglas proporcionadas, sin exigir jugar una partida nueva.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los objetivos y reglas de la posición proporcionada queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los objetivos y reglas de la posición proporcionada.",
            "error": "Las decisiones o relaciones contradicen los objetivos y reglas de la posición proporcionada o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "9f7847e9-62b6-5baa-be4d-6753285e3077",
          "4728285f-0c75-5bee-a41a-38864739cd4f",
          "c682e76c-2f1e-59e4-9238-dab7a1b56260"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "chess-repertoire",
        "grade": 3,
        "label": "repertorio de aperturas de ajedrez",
        "match": "repertorio.*aperturas.*ajedrez|ajedrez.*repertorio",
        "relation": "la relación entre aperturas elegidas y fortalezas, restricciones y necesidades de las posiciones de ajedrez del caso dado",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Repertorio y necesidades de las posiciones",
            "success": "Selecciona el repertorio de aperturas de ajedrez del caso proporcionado justificándolo con las fortalezas, restricciones y necesidades de las posiciones dadas, sin inferir inteligencia o personalidad.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las fortalezas y restricciones de las posiciones proporcionadas queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las fortalezas y restricciones de las posiciones proporcionadas.",
            "error": "Las decisiones o relaciones contradicen las fortalezas y restricciones de las posiciones proporcionadas o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "a2ee1259-a0ea-5ea0-bf1f-98e3f2bd0c57",
          "e81ed832-1e7b-50f4-8844-80c6ae2de94d"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "racket-history",
        "grade": 3,
        "label": "historia de deporte de raqueta elegido",
        "match": "(?:historia|hechos historicos).*(?:tenis|badminton|raqueta)",
        "relation": "la relación entre hechos, fechas y fuentes del ámbito histórico del deporte de raqueta expresamente elegido",
        "primaryPurpose": "RESEARCH",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hallazgos históricos de la disciplina elegida",
            "success": "Investiga la historia del deporte de raqueta expresamente elegido relacionando hechos, fechas y evidencias de las fuentes del ámbito asignado.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los hechos y fuentes del ámbito proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los hechos y fuentes del ámbito proporcionado.",
            "error": "Las decisiones o relaciones contradicen los hechos y fuentes del ámbito proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento.",
            "variants": {
              "PRESENTATION": {
                "id": "requested-evidence",
                "title": "Hechos y fuentes de la disciplina elegida",
                "success": "Presenta la historia del deporte de raqueta expresamente elegido del ámbito asignado relacionando hechos y fechas con las fuentes dadas.",
                "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los hechos y fuentes del ámbito proporcionado queda poco precisada.",
                "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los hechos y fuentes del ámbito proporcionado.",
                "error": "Las decisiones o relaciones contradicen los hechos y fuentes del ámbito proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
              }
            }
          }
        ],
        "sourceRecordIds": [
          "600fe734-c44b-595d-adf4-386463f8cf30",
          "157aece8-0670-5309-a167-99cf8c75b68c"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "racket-positions",
        "grade": 3,
        "label": "posiciones del deporte de raqueta elegido",
        "match": "posiciones.*(?:badminton|tenis|raqueta)",
        "relation": "la relación entre apoyos, posición y función de la disciplina de raqueta expresamente elegida",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Apoyos y función de la posición",
            "success": "Analiza las posiciones fundamentales del deporte de raqueta elegido del referente adaptado relacionando apoyos y función con las condiciones dadas.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los apoyos y funciones del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los apoyos y funciones del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen los apoyos y funciones del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "987901f7-4d25-5843-a913-46960ab7355f",
          "d05d7d6f-1fe6-55a7-a27a-1a8762546c0c"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "racket-displacements",
        "grade": 3,
        "label": "desplazamientos del deporte de raqueta elegido",
        "match": "desplazamientos.*(?:badminton|tenis|raqueta)",
        "relation": "la relación entre desplazamientos, señales y referencias de la tarea adaptada del deporte de raqueta elegido",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Desplazamientos y referencias",
            "success": "Ejecuta los desplazamientos adaptados del deporte de raqueta elegido según señales, referencias y condiciones supervisadas proporcionadas, con los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y referencias proporcionadas pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y referencias proporcionadas.",
            "error": "Las acciones contradicen las señales y referencias proporcionadas o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "987901f7-4d25-5843-a913-46960ab7355f"
        ],
        "pdfPages": [
          366
        ]
      },
      {
        "id": "racket-technique",
        "grade": 3,
        "label": "elemento técnico del deporte de raqueta elegido",
        "match": "(?:elemento tecnico|tecnica).*(?:badminton|tenis|raqueta)",
        "relation": "la relación entre función, señales y reglas del elemento técnico del deporte de raqueta expresamente elegido",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Elemento técnico y condiciones dadas",
            "success": "Ejecuta el elemento técnico adaptado del deporte de raqueta expresamente elegido según las reglas, señales y condiciones supervisadas dadas, con los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las reglas y señales de la tarea proporcionada pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las reglas y señales de la tarea proporcionada.",
            "error": "Las acciones contradicen las reglas y señales de la tarea proporcionada o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "987901f7-4d25-5843-a913-46960ab7355f",
          "e1523b84-0123-50c4-9d18-bb5becc90568"
        ],
        "pdfPages": [
          366,
          367
        ]
      },
      {
        "id": "racket-tactics",
        "grade": 3,
        "label": "plan táctico del deporte de raqueta elegido",
        "match": "(?:planifica|plan tactico|ataque y defensa).*(?:badminton|tenis|raqueta)",
        "relation": "la relación entre alternativas y reglas que sustentan las decisiones tácticas previstas del deporte de raqueta elegido",
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Alternativas y decisiones tácticas previstas",
            "success": "Planifica las decisiones de ataque y defensa del deporte de raqueta elegido para el caso adaptado proporcionado relacionando alternativas y reglas dadas, sin exigir ejecutar un partido.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las alternativas y reglas del caso proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las alternativas y reglas del caso proporcionado.",
            "error": "Las decisiones o relaciones contradicen las alternativas y reglas del caso proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "987901f7-4d25-5843-a913-46960ab7355f",
          "e1523b84-0123-50c4-9d18-bb5becc90568"
        ],
        "pdfPages": [
          366,
          367
        ]
      }
    ],
    "policy": "REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1"
  },
  {
    "id": "educacion-fisica-comun-4",
    "grade": 4,
    "topics": [
      {
        "id": "circuit-plan",
        "grade": 4,
        "label": "organización de un circuito adaptado",
        "match": "circuito adaptado|estaciones?.*pausas?|pausas?.*estaciones?",
        "relation": "la relación entre estaciones, acciones, orden y pausas fijados en la ficha docente",
        "pdfPages": [
          374
        ],
        "sourceRecordIds": [
          "e668f5e1-aab5-5156-8021-048890a1bca7"
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan de estaciones y pausas dadas",
            "success": "Planifica la organización del circuito adaptado relacionando estaciones, acciones y pausas ya fijadas en la ficha docente, sin añadir intensidad o duración nuevas.",
            "sufficient": "El plan relaciona las estaciones y pausas; una referencia secundaria al orden queda poco precisada.",
            "partial": "Identifica estaciones pertinentes, pero una relación de orden o pausa no corresponde a la ficha dada.",
            "error": "El plan modifica las condiciones proporcionadas o introduce dosis físicas no sustentadas en la ficha.",
            "variants": {
              "PERFORMANCE": {
                "title": "Estaciones y pausas del circuito dado",
                "success": "Ejecuta la secuencia de estaciones y acciones del circuito adaptado respetando las pausas y apoyos ya fijados en la ficha docente, sin añadir intensidad o duración nuevas.",
                "sufficient": "La secuencia de estaciones se reconoce; una transición secundaria pierde continuidad.",
                "partial": "Realiza acciones pertinentes, pero una transición o pausa no corresponde a la ficha dada.",
                "error": "Cambia las acciones o pausas de modo incompatible con las condiciones adaptadas proporcionadas."
              }
            }
          }
        ]
      },
      {
        "id": "flexibility-observation",
        "grade": 4,
        "label": "acciones de flexibilidad adaptadas",
        "match": "flexibilidad activa|flexibilidad pasiva|acciones? de flexibilidad",
        "relation": "la relación entre las acciones de flexibilidad elegidas y las condiciones adaptadas del referente",
        "pdfPages": [
          374
        ],
        "sourceRecordIds": [
          "5194dca1-cf15-5174-b508-158798aabc4f"
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Cumplimiento de acciones de flexibilidad",
            "success": "Identifica con evidencias si el referente cumple las acciones de flexibilidad expresamente adaptadas en la ficha docente, sin medir amplitud corporal ni añadir maniobras.",
            "sufficient": "La verificación se sustenta; una marca secundaria queda poco clara sin cambiar su resultado principal.",
            "partial": "Identifica acciones pertinentes, pero una marca no permite determinar si cumple la condición dada.",
            "error": "Atribuye un cumplimiento incompatible con el referente o lo sustituye por un juicio de amplitud o capacidad natural.",
            "variants": {
              "PERFORMANCE": {
                "title": "Acciones de flexibilidad adaptadas",
                "success": "Ejecuta las acciones de flexibilidad expresamente adaptadas en la ficha docente según las señales y apoyos acordados, sin puntuar amplitud corporal.",
                "sufficient": "Las acciones y sus señales se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Presenta acciones pertinentes, pero una respuesta no corresponde a la señal o adaptación acordadas.",
                "error": "Las acciones contradicen las condiciones adaptadas dadas o no permiten reconocer la secuencia solicitada."
              }
            }
          }
        ]
      },
      {
        "id": "motor-variation",
        "grade": 4,
        "label": "variaciones de dirección y velocidad",
        "match": "secuencia motriz|(?:combina|variacion|variando).*(?:desplazamientos|giros|direccion|sentido)|centro de gravedad",
        "relation": "la relación entre cambios motrices solicitados, señales y apoyos de la secuencia adaptada",
        "pdfPages": [
          374
        ],
        "sourceRecordIds": [
          "da3b71a7-1db5-5df1-860a-93cc551142ef"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Respuestas a las señales motrices",
            "success": "Ejecuta los cambios de dirección y velocidad expresamente dados respondiendo a las señales y apoyos acordados de la secuencia adaptada.",
            "sufficient": "Los cambios y sus señales se reconocen; un ajuste secundario pierde continuidad sin romper la secuencia.",
            "partial": "Presenta respuestas pertinentes, pero un cambio no corresponde a la dirección o velocidad señaladas.",
            "error": "Las respuestas contradicen las señales dadas o impiden reconocer la secuencia motriz solicitada."
          }
        ]
      },
      {
        "id": "equilibrium-observation",
        "grade": 4,
        "label": "equilibrio y base de sustentación",
        "match": "equilibrio.*(?:base|referente)|base de sustentacion",
        "relation": "la relación entre base de sustentación, apoyos, plano y equilibrio del referente dado",
        "pdfPages": [
          374
        ],
        "sourceRecordIds": [
          "90071f34-eab7-51b9-b512-b8cf8b43437e"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Base, apoyos y equilibrio del referente",
            "success": "Explica el equilibrio del referente relacionando base de sustentación, apoyos y plano expresamente señalados con evidencias de la ficha proporcionada.",
            "sufficient": "Las relaciones principales se sustentan; una referencia espacial secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación entre apoyo y equilibrio carece de sustento.",
            "error": "Atribuye al referente apoyos o efectos incompatibles con sus datos o sustituye el análisis por una maniobra no solicitada."
          }
        ]
      },
      {
        "id": "care-frequency",
        "grade": 4,
        "label": "cuidado observable de materiales y espacio",
        "match": "cuidado de materiales|cuidado.*espacio|frecuencia.*materiales.*espacio",
        "relation": "la relación entre acciones de cuidado de materiales y espacio y las condiciones expresamente trabajadas",
        "pdfPages": [
          375
        ],
        "sourceRecordIds": [
          "7fcd0b61-c7ff-55c9-937e-333a8f816fc5"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones de cuidado observadas",
            "success": "Cumple las acciones concretas de cuidado de materiales y del espacio acordadas en todas las oportunidades observadas.",
            "sufficient": "Cumple las acciones de cuidado acordadas en casi todas las oportunidades observadas.",
            "partial": "Cumple las acciones de cuidado acordadas en algunas oportunidades observadas.",
            "error": "Cumple las acciones de cuidado acordadas en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "tactical-cooperation",
        "grade": 4,
        "label": "colaboración en soluciones técnico tácticas",
        "match": "solucion(?:es)?.*acuerdos? tecnicos?|acuerdos? tecnicos?.*solucion(?:es)?|cooperacion tecnico tactica",
        "relation": "la relación entre propuestas, acuerdos concretos y solución técnica de la tarea colectiva trabajada",
        "pdfPages": [
          374,
          376
        ],
        "sourceRecordIds": [
          "8187526f-82f0-529c-be94-9d25b61fdede",
          "1e0676fc-199a-55a6-9eb8-75f356caee5e",
          "02e0a923-ac89-5be3-9262-0cad2ebb08b8"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aportes y acuerdos técnicos observados",
            "success": "Aporta propuestas pertinentes y cumple los acuerdos técnicos de la tarea colectiva dada en todas las oportunidades observadas, sin puntuar personalidad.",
            "sufficient": "Aporta propuestas y cumple acuerdos en casi todas las oportunidades observadas.",
            "partial": "Aporta propuestas y cumple acuerdos en algunas oportunidades observadas.",
            "error": "Aporta propuestas y cumple acuerdos en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "warmup-observation",
        "grade": 4,
        "label": "calentamiento general y específico dado",
        "match": "calentamiento general|calentamiento especifico|acciones? de calentamiento",
        "relation": "la relación entre acciones de calentamiento y condiciones ya fijadas en la ficha docente",
        "pdfPages": [
          374
        ],
        "sourceRecordIds": [
          "50b63ef0-488c-57ce-a498-0e6b591a7e20"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "general",
            "title": "Cumplimiento del calentamiento general",
            "success": "Verifica el cumplimiento del calentamiento general contrastando cada acción del registro con la ficha docente proporcionada, sin diseñar dosis nuevas.",
            "sufficient": "La relación principal se sustenta en las acciones y evidencias de la ficha proporcionada; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las acciones y evidencias de la ficha proporcionada.",
            "error": "Presenta relaciones incompatibles con las acciones y evidencias de la ficha proporcionada."
          },
          {
            "id": "specific",
            "title": "Cumplimiento del calentamiento específico",
            "success": "Verifica el cumplimiento del calentamiento específico contrastando cada acción del registro con la ficha docente proporcionada, sin diseñar dosis nuevas.",
            "sufficient": "La relación principal se sustenta en las acciones y evidencias de la ficha proporcionada; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las acciones y evidencias de la ficha proporcionada.",
            "error": "Presenta relaciones incompatibles con las acciones y evidencias de la ficha proporcionada."
          }
        ]
      },
      {
        "id": "continuous-activity-record",
        "grade": 4,
        "label": "registro de actividad continua",
        "match": "actividad continua|registro.*(?:inicio|pausas).*final",
        "relation": "la relación entre acciones, tiempos y condiciones del registro de actividad continua proporcionado",
        "pdfPages": [
          374
        ],
        "sourceRecordIds": [
          "5f7d9a80-6086-5f9b-b080-cf0197e504b8"
        ],
        "primaryPurpose": "REPORT",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Organización del registro temporal",
            "success": "Registra la actividad continua del caso proporcionado relacionando acciones y tiempos ya dados, sin fijar una duración nueva.",
            "sufficient": "La secuencia temporal se reconoce; una referencia secundaria queda poco precisada.",
            "partial": "Incluye datos pertinentes, pero una relación entre acción y tiempo no se vincula con el registro proporcionado.",
            "error": "Cambia los tiempos registrados o atribuye a una persona una capacidad o duración no acreditadas por los datos.",
            "variants": {
              "PERFORMANCE": {
                "title": "Secuencia de actividad continua adaptada",
                "success": "Realiza la actividad continua según el inicio, las pausas y el final expresamente dados, utilizando los apoyos acordados sin fijar una duración nueva ni comparar resistencia personal.",
                "sufficient": "La secuencia y sus límites se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Presenta acciones pertinentes, pero una pausa o límite no corresponde a las condiciones dadas.",
                "error": "La secuencia contradice el inicio, las pausas o el final proporcionados para la actividad adaptada."
              }
            }
          }
        ]
      },
      {
        "id": "movement-rhythm",
        "grade": 4,
        "label": "movimiento y ritmo",
        "match": "movimientos?.*(?:ritmo|cadencia)|(?:ritmo|cadencia).*movimientos?",
        "relation": "la relación entre la secuencia de movimientos y el ritmo expresamente elegido",
        "pdfPages": [
          374,
          376
        ],
        "sourceRecordIds": [
          "1ccf45a3-77b7-5c59-8bb6-987b2f0c696f",
          "5164ac19-35a6-5cde-b332-346dbe22e06d"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Correspondencia del movimiento y el ritmo",
            "success": "Combina los movimientos adaptados dados siguiendo el ritmo elegido y las señales acordadas, con los apoyos permitidos.",
            "sufficient": "La correspondencia rítmica se reconoce; un ajuste secundario pierde continuidad sin romper la secuencia.",
            "partial": "Realiza movimientos pertinentes, pero una entrada o transición no responde al ritmo o señal acordados.",
            "error": "Las entradas o transiciones contradicen las señales dadas y no permiten reconocer la relación rítmica solicitada."
          }
        ]
      },
      {
        "id": "physical-condition-explanation",
        "grade": 4,
        "label": "capacidades coordinativas y condicionales",
        "match": "capacidades (?:fisicas|coordinativas|condicionales)|(?:explica|analiza|compara).*(?:fuerza|resistencia|coordinacion|equilibrio|diferenciacion|reaccion|adaptacion|ritmo)",
        "relation": "la función de las capacidades coordinativas y condicionales expresamente elegidas en los ejemplos dados",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "d263f8bd-45cc-50e0-83be-8e206f70b983",
          "f6e8dfb0-93e1-56d4-9e7a-9a19de7c0088"
        ],
        "pdfPages": [
          374
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Capacidades y acciones del ejemplo",
            "success": "Explica la función de las capacidades físicas expresamente elegidas mediante evidencias de los ejemplos adaptados dados, sin comparar cuerpos o personas.",
            "sufficient": "La relación principal se sustenta en los ejemplos adaptados proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los ejemplos adaptados proporcionados.",
            "error": "Presenta relaciones incompatibles con los ejemplos adaptados proporcionados."
          }
        ]
      },
      {
        "id": "spatial-orientation",
        "grade": 4,
        "label": "orientación espacial del trayecto adaptado",
        "match": "orientacion espacial|objetos.*puntos cardinales",
        "relation": "la relación entre objetos, lugares y puntos cardinales expresamente dados y las decisiones del trayecto adaptado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "2fbf1427-6e41-559b-b048-8f7c284a89c8"
        ],
        "pdfPages": [
          374
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias y decisiones de orientación",
            "success": "Realiza la orientación espacial del trayecto adaptado siguiendo los objetos y puntos cardinales dados según las señales y apoyos proporcionados.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las referencias y condiciones del trayecto proporcionado.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las referencias y condiciones del trayecto proporcionado.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las referencias y condiciones del trayecto proporcionado.",
            "variants": {
              "PLAN": {
                "id": "requested-evidence",
                "title": "Referencias y orden previstos",
                "success": "Planifica la orientación espacial del trayecto adaptado relacionando los objetos y puntos cardinales dados con el orden previsto, sin exigir realizar el recorrido.",
                "sufficient": "La relación principal se sustenta en las referencias del trayecto proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las referencias del trayecto proporcionado.",
                "error": "Presenta relaciones incompatibles con las referencias del trayecto proporcionado."
              }
            }
          }
        ]
      },
      {
        "id": "postural-execution",
        "grade": 4,
        "label": "postura en movimientos adaptados",
        "match": "(?:ejecuta|movimientos?).*postura|postura.*referente",
        "relation": "la relación entre movimiento, postura y apoyos del referente adaptado proporcionado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "c5a67623-5f78-56c1-82cd-524729e55e28",
          "1ccf45a3-77b7-5c59-8bb6-987b2f0c696f"
        ],
        "pdfPages": [
          374
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Postura y apoyos del movimiento dado",
            "success": "Ejecuta los movimientos adaptados cuidando la postura según las señales, referentes y apoyos ya proporcionados, sin comparar cuerpos.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto al referente adaptado y sus apoyos proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde al referente adaptado y sus apoyos proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con el referente adaptado y sus apoyos proporcionados."
          }
        ]
      },
      {
        "id": "postural-expression",
        "grade": 4,
        "label": "expresión corporal de posturas",
        "match": "expresion corporal.*posturas|posturas.*(?:abiertas|cerradas|atras|delante)",
        "relation": "la relación entre las señales de las posturas expresamente elegidas y la intención representada en el referente dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "4e728082-aa1c-53ff-b60f-043dac35f573"
        ],
        "pdfPages": [
          374
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Señales de la postura representada",
            "success": "Interpreta la expresión corporal de las posturas expresamente elegidas relacionando sus señales observables con la intención representada en el referente proporcionado.",
            "sufficient": "La relación principal se sustenta en las señales del referente corporal proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las señales del referente corporal proporcionado.",
            "error": "Presenta relaciones incompatibles con las señales del referente corporal proporcionado."
          }
        ]
      },
      {
        "id": "gymnastics-sequence",
        "grade": 4,
        "label": "composición gimnástica adaptada",
        "match": "composicion.*gimnas[a-z]*|gimnas[a-z]*.*composicion",
        "relation": "la relación entre los movimientos elegidos, orden, espacio y ritmo de la composición gimnástica adaptada solicitada",
        "primaryPurpose": "PRODUCTION",
        "sourceRecordIds": [
          "1d417605-3b1b-5f83-a9a7-7b39f524aa7c",
          "de9135f9-6496-517e-8dc6-74ba83998922",
          "501235b5-68eb-5a4b-8a16-92994f46d3f3"
        ],
        "pdfPages": [
          374,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Composición y relaciones de la secuencia",
            "success": "Crea la composición gimnástica adaptada con los movimientos expresamente dados relacionando secuencia, espacio y ritmo según las condiciones supervisadas proporcionadas.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a los elementos y condiciones de la composición proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a los elementos y condiciones de la composición proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con los elementos y condiciones de la composición proporcionados.",
            "variants": {
              "PLAN": {
                "id": "requested-evidence",
                "title": "Orden y relaciones previstos",
                "success": "Planifica la composición gimnástica adaptada relacionando movimientos, orden, planos y niveles ya proporcionados, sin exigir ejecutar la secuencia.",
                "sufficient": "La relación principal se sustenta en los movimientos y condiciones proporcionados; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los movimientos y condiciones proporcionados.",
                "error": "Presenta relaciones incompatibles con los movimientos y condiciones proporcionados."
              }
            }
          }
        ]
      },
      {
        "id": "gymnastics-modalities",
        "grade": 4,
        "label": "modalidades de gimnasia",
        "match": "modalidades.*gimnas[a-z]*|compara.*gimnas[a-z]*ia.*(?:ritmica|artistica)",
        "relation": "las diferencias y semejanzas entre las modalidades gimnásticas expresamente elegidas en los referentes dados",
        "primaryPurpose": "COMPARISON",
        "sourceRecordIds": [
          "1ccf45a3-77b7-5c59-8bb6-987b2f0c696f",
          "2114ae5e-9f9a-5242-a490-93b35691d9d1"
        ],
        "pdfPages": [
          374,
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Modalidades y características del referente",
            "success": "Compara las modalidades de gimnasia expresamente elegidas relacionando sus características y evidencias de los referentes proporcionados.",
            "sufficient": "La relación principal se sustenta en las características y evidencias de los referentes proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las características y evidencias de los referentes proporcionados.",
            "error": "Presenta relaciones incompatibles con las características y evidencias de los referentes proporcionados."
          }
        ]
      },
      {
        "id": "gymnastics-apparatus-research",
        "grade": 4,
        "label": "investigación de aparatos de gimnasia artística",
        "match": "investiga.*aparatos.*gimnas[a-z]*|investigacion.*aparatos",
        "relation": "la relación entre las características del uso de aparatos de gimnasia artística y las evidencias de las fuentes dadas",
        "primaryPurpose": "RESEARCH",
        "sourceRecordIds": [
          "b786f9be-c328-5d70-9d89-63852070318a",
          "f7e0c8c7-afc5-5c03-bb1c-ae1abf657c32"
        ],
        "pdfPages": [
          374
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Características del aparato y fuentes",
            "success": "Investiga las características del uso de aparatos de gimnasia artística masculina y femenina relacionándolas con las evidencias de las fuentes proporcionadas, sin exigir ejecutar maniobras.",
            "sufficient": "La relación principal se sustenta en las fuentes proporcionadas sobre los aparatos; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fuentes proporcionadas sobre los aparatos.",
            "error": "Presenta relaciones incompatibles con las fuentes proporcionadas sobre los aparatos."
          }
        ]
      },
      {
        "id": "gymnastics-terminology",
        "grade": 4,
        "label": "terminología de elementos gimnásticos",
        "match": "terminologia.*gimnas[a-z]*|terminos?.*gimnas[a-z]*",
        "relation": "la correspondencia entre términos gimnásticos y características de los elementos del referente dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "9e63d1ec-ccee-523b-82e6-e30c8d8420e6"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Término y característica observable",
            "success": "Identifica la terminología de los elementos gimnásticos del referente dado relacionando cada término con sus características observables.",
            "sufficient": "La relación principal se sustenta en los términos y elementos del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los términos y elementos del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con los términos y elementos del referente proporcionado."
          }
        ]
      },
      {
        "id": "gymnastics-combination",
        "grade": 4,
        "label": "combinaciones de movimientos gimnásticos",
        "match": "combinaciones?.*movimientos?.*gimnas[a-z]*",
        "relation": "la relación entre los elementos dados y las combinaciones gimnásticas adaptadas solicitadas",
        "primaryPurpose": "PRODUCTION",
        "sourceRecordIds": [
          "c1f0b4e1-f7dd-5af6-a5ef-40b866d3b212"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Combinación de los elementos dados",
            "success": "Crea combinaciones de movimientos gimnásticos adaptados a partir de los elementos proporcionados y según las condiciones supervisadas dadas, sin añadir movimientos de riesgo.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a los elementos y condiciones supervisadas proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a los elementos y condiciones supervisadas proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con los elementos y condiciones supervisadas proporcionados."
          }
        ]
      },
      {
        "id": "gymnastics-series",
        "grade": 4,
        "label": "serie de movimientos gimnásticos",
        "match": "serie.*movimientos?.*gimnas[a-z]*",
        "relation": "la relación entre elementos, transiciones y orden de la serie gimnástica adaptada solicitada",
        "primaryPurpose": "PRODUCTION",
        "sourceRecordIds": [
          "d7199853-40f4-5210-b684-fdd0cf3b8225",
          "0ee707ff-f4f3-5929-b118-1378bb44f6c6",
          "285cf13e-e7c8-51ff-9e04-fb168e0e0fd9"
        ],
        "pdfPages": [
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Serie y transiciones dadas",
            "success": "Crea la serie de movimientos gimnásticos adaptados usando los elementos y transiciones dados según las condiciones supervisadas proporcionadas.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a los elementos y transiciones de la serie proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a los elementos y transiciones de la serie proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con los elementos y transiciones de la serie proporcionada."
          }
        ]
      },
      {
        "id": "fitness-reference",
        "grade": 4,
        "label": "efectos del fitness sobre bienestar",
        "match": "fitness.*(?:salud|bienestar)|efectos.*fitness",
        "relation": "las relaciones entre actividad física, salud y bienestar descritas por los referentes dados",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "e4094ed4-332f-5876-8398-ed8bf6ce96a6",
          "8589deb0-7d47-50f5-9e93-01d28fd8818e"
        ],
        "pdfPages": [
          374
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Relaciones del referente de bienestar",
            "success": "Explica los efectos del fitness sobre salud y bienestar sustentando las relaciones con las evidencias de los referentes proporcionados, sin emitir prescripciones personales.",
            "sufficient": "La relación principal se sustenta en las evidencias de los referentes de bienestar proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las evidencias de los referentes de bienestar proporcionados.",
            "error": "Presenta relaciones incompatibles con las evidencias de los referentes de bienestar proporcionados."
          }
        ]
      },
      {
        "id": "cardiovascular-reference",
        "grade": 4,
        "label": "modalidades cardiovasculares por referentes",
        "match": "zumba|aerobicos|modalidades cardiovasculares",
        "relation": "las características y diferencias de las modalidades cardiovasculares expresamente elegidas en los referentes dados",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "3774171f-74a9-5f7c-a7b5-407bcdf8cdd0",
          "c8a9d1fe-09a5-5bd1-803f-9337f394e68c"
        ],
        "pdfPages": [
          374,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Modalidades y evidencias del referente",
            "success": "Explica las características de las modalidades cardiovasculares expresamente elegidas mediante las evidencias de los referentes proporcionados.",
            "sufficient": "La relación principal se sustenta en los referentes cardiovasculares proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los referentes cardiovasculares proporcionados.",
            "error": "Presenta relaciones incompatibles con los referentes cardiovasculares proporcionados."
          }
        ]
      },
      {
        "id": "basketball-local-research",
        "grade": 4,
        "label": "aportes locales de baloncestistas e instituciones",
        "match": "(?:investiga|presenta|expone).*(?:baloncestistas|clubes|instituciones).*comunidad|aportes locales.*balonc",
        "relation": "la relación entre los aportes de baloncestistas, clubes e instituciones del ámbito local asignado y las fuentes dadas",
        "primaryPurpose": "RESEARCH",
        "sourceRecordIds": [
          "d6d83845-cb14-58d0-aeaa-ce9290bab658",
          "d4bbe84b-ad0d-5c1a-bf39-a717f1a6dc2f",
          "f691a5cc-4fbe-547f-a821-76e58529f04e"
        ],
        "pdfPages": [
          374,
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aporte local y fuente",
            "success": "Investiga los aportes de baloncestistas, clubes e instituciones de la comunidad relacionando sus acciones con las evidencias de las fuentes proporcionadas.",
            "sufficient": "La relación principal se sustenta en las fuentes del ámbito local proporcionadas; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fuentes del ámbito local proporcionadas.",
            "error": "Presenta relaciones incompatibles con las fuentes del ámbito local proporcionadas."
          }
        ]
      },
      {
        "id": "basketball-rules",
        "grade": 4,
        "label": "reglas de baloncesto convencional",
        "match": "reglas.*baloncesto(?: convencional)?|baloncesto convencional.*reglas",
        "relation": "las funciones y condiciones de las reglas de baloncesto convencional expresamente dadas",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "06490636-728c-5bf1-a41f-1a71a281ef7c",
          "a450e010-f6fc-5838-9698-c1e27494730d",
          "faf01292-a075-5ae0-ae10-daaf811dccd5"
        ],
        "pdfPages": [
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Regla y función en la situación dada",
            "success": "Explica las reglas del baloncesto convencional relacionando sus funciones con las evidencias de los ejemplos proporcionados.",
            "sufficient": "La relación principal se sustenta en las reglas y ejemplos de baloncesto proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las reglas y ejemplos de baloncesto proporcionados.",
            "error": "Presenta relaciones incompatibles con las reglas y ejemplos de baloncesto proporcionados.",
            "variants": {
              "VERIFICATION": {
                "id": "requested-evidence",
                "title": "Decisión y regla del registro",
                "success": "Verifica si el registro de decisiones de baloncesto convencional cumple las reglas proporcionadas mediante sus evidencias.",
                "sufficient": "La relación principal se sustenta en las reglas y evidencias del registro proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las reglas y evidencias del registro proporcionado.",
                "error": "Presenta relaciones incompatibles con las reglas y evidencias del registro proporcionado."
              }
            }
          }
        ]
      },
      {
        "id": "basketball-fundamentals",
        "grade": 4,
        "label": "fundamentos técnicos de baloncesto",
        "match": "(?:pases|tiros|drible|fundamentos tecnicos).*baloncesto",
        "relation": "la relación entre las acciones técnicas de baloncesto expresamente elegidas y las referencias dadas",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "5d965b28-6057-599f-87d5-4f3199359384",
          "faf01292-a075-5ae0-ae10-daaf811dccd5"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acción técnica elegida y referencia",
            "success": "Ejecuta las acciones técnicas de baloncesto expresamente elegidas según las señales, referencias y apoyos de la tarea adaptada proporcionada.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las referencias y apoyos de la tarea proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las referencias y apoyos de la tarea proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las referencias y apoyos de la tarea proporcionada."
          }
        ]
      },
      {
        "id": "basketball-possession",
        "grade": 4,
        "label": "ofensiva de posesión de baloncesto",
        "match": "posesion.*baloncesto|baloncesto.*posesion",
        "relation": "la relación entre posiciones, alternativas y decisiones de posesión de baloncesto del caso dado",
        "primaryPurpose": "PLAN",
        "sourceRecordIds": [
          "cd29e975-549e-5471-b5fb-e6ef067c7588",
          "faf01292-a075-5ae0-ae10-daaf811dccd5"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión de posesión prevista",
            "success": "Planifica la ofensiva de posesión de baloncesto del caso dado relacionando decisiones y posiciones con las alternativas proporcionadas, sin exigir ejecutar el juego.",
            "sufficient": "La relación principal se sustenta en las posiciones y alternativas del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y alternativas del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con las posiciones y alternativas del caso proporcionado."
          }
        ]
      },
      {
        "id": "basketball-counterattack",
        "grade": 4,
        "label": "contraataque sencillo de baloncesto",
        "match": "contraataque.*baloncesto",
        "relation": "la relación entre las posiciones y decisiones del contraataque de baloncesto expresamente dado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "cd29e975-549e-5471-b5fb-e6ef067c7588",
          "4faa5235-7e1c-5424-b4ab-48323ea0f0ef"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Contraataque según las señales dadas",
            "success": "Ejecuta el contraataque sencillo adaptado de baloncesto según las señales, posiciones y apoyos de la situación proporcionada.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las señales y posiciones proporcionadas.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y posiciones proporcionadas.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y posiciones proporcionadas."
          }
        ]
      },
      {
        "id": "basketball-screen",
        "grade": 4,
        "label": "bloqueo de baloncesto elegido",
        "match": "(?:bloqueo|pantalla).*(?:baloncesto)",
        "relation": "la relación entre posiciones y decisiones del bloqueo de baloncesto expresamente elegido en el referente dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "3dc958d9-9603-54f9-857b-e3a4786c7393",
          "b5a25357-d859-5a14-8da4-c5f5dc77820e"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posición y decisión del bloqueo elegido",
            "success": "Analiza el bloqueo de baloncesto expresamente elegido relacionando posiciones y decisiones con las evidencias del referente proporcionado.",
            "sufficient": "La relación principal se sustenta en las posiciones y evidencias del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y evidencias del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las posiciones y evidencias del referente proporcionado."
          }
        ]
      },
      {
        "id": "basketball-defense",
        "grade": 4,
        "label": "defensa individual y zonal de baloncesto",
        "match": "defensa.*(?:individual|zonal).*baloncesto",
        "relation": "las diferencias y relaciones entre las defensas de baloncesto expresamente elegidas y las posiciones dadas",
        "primaryPurpose": "COMPARISON",
        "sourceRecordIds": [
          "566adecd-80c5-5a30-b354-9c564ff60cab",
          "5236f48e-f3d8-5493-a00f-5ce2052da4f8",
          "98cb3809-28b6-5e05-afe4-a150ea917b20"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Principios y posiciones de la defensa",
            "success": "Compara las defensas de baloncesto expresamente elegidas relacionando principios y posiciones con las evidencias de los referentes proporcionados.",
            "sufficient": "La relación principal se sustenta en los principios y posiciones de los referentes proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los principios y posiciones de los referentes proporcionados.",
            "error": "Presenta relaciones incompatibles con los principios y posiciones de los referentes proporcionados.",
            "variants": {
              "PERFORMANCE": {
                "id": "requested-evidence",
                "title": "Defensa según la referencia dada",
                "success": "Ejecuta la defensa de baloncesto expresamente elegida según las señales, posiciones y condiciones supervisadas proporcionadas.",
                "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las señales y condiciones supervisadas proporcionadas.",
                "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y condiciones supervisadas proporcionadas.",
                "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y condiciones supervisadas proporcionadas."
              }
            }
          }
        ]
      },
      {
        "id": "basketball-tactics",
        "grade": 4,
        "label": "situación táctica de baloncesto",
        "match": "situacion tactica.*baloncesto",
        "relation": "la relación entre alternativas, posiciones y decisión de la situación táctica de baloncesto dada",
        "primaryPurpose": "PROBLEM_SOLVING",
        "sourceRecordIds": [
          "5d965b28-6057-599f-87d5-4f3199359384",
          "e4e6d8e7-7379-53e2-aee7-4a667a411d8f",
          "9f3be3e2-e086-56e7-88c6-20909e81080e"
        ],
        "pdfPages": [
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión táctica y sustento",
            "success": "Resuelve la situación táctica de baloncesto del caso dado justificando la decisión según las alternativas, posiciones y reglas proporcionadas.",
            "sufficient": "La relación principal se sustenta en las alternativas y condiciones del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las alternativas y condiciones del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con las alternativas y condiciones del caso proporcionado."
          }
        ]
      },
      {
        "id": "basketball-adapted-rules",
        "grade": 4,
        "label": "adaptaciones de reglas de baloncesto",
        "match": "adaptaciones.*reglas.*baloncesto|reglas adaptadas.*baloncesto",
        "relation": "la relación entre recursos, condiciones de participación y adaptaciones de baloncesto del caso dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "371177ef-e8ae-5b4a-8035-5b40c848a821"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Adaptación y participación del caso",
            "success": "Analiza las adaptaciones de las reglas de baloncesto relacionando recursos y condiciones de participación con las evidencias del caso proporcionado, sin inferir diagnósticos.",
            "sufficient": "La relación principal se sustenta en los recursos y condiciones de participación proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los recursos y condiciones de participación proporcionados.",
            "error": "Presenta relaciones incompatibles con los recursos y condiciones de participación proporcionados."
          }
        ]
      },
      {
        "id": "basketball-wheelchair",
        "grade": 4,
        "label": "decisiones de baloncesto en silla de ruedas",
        "match": "baloncesto.*silla de ruedas|silla de ruedas.*baloncesto",
        "relation": "la relación entre decisiones, reglas adaptadas y participación del referente de baloncesto en silla de ruedas dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "865a7c83-e768-5f27-b5f1-e4a830ea4503"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y participación del referente",
            "success": "Analiza las decisiones expresamente solicitadas del referente de baloncesto en silla de ruedas relacionando reglas adaptadas y participación con las evidencias proporcionadas, sin exigir ejecutar maniobras.",
            "sufficient": "La relación principal se sustenta en las decisiones y condiciones del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las decisiones y condiciones del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las decisiones y condiciones del referente proporcionado."
          }
        ]
      },
      {
        "id": "basketball-three-on-three",
        "grade": 4,
        "label": "reglas de baloncesto 3x3",
        "match": "baloncesto 3s*(?:x|contra)s*3",
        "relation": "la relación entre las reglas de baloncesto 3x3 expresamente dadas y las decisiones registradas",
        "primaryPurpose": "VERIFICATION",
        "sourceRecordIds": [
          "0e3d115b-1fcb-5049-83e1-8ecd955a680c",
          "0d4342ae-02b7-531c-a7aa-c9f1455c8762"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y regla 3x3",
            "success": "Verifica si las decisiones del registro de baloncesto 3x3 cumplen el reglamento dado utilizando las evidencias proporcionadas.",
            "sufficient": "La relación principal se sustenta en las reglas y decisiones del registro proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las reglas y decisiones del registro proporcionado.",
            "error": "Presenta relaciones incompatibles con las reglas y decisiones del registro proporcionado."
          }
        ]
      },
      {
        "id": "gymnastics-events",
        "grade": 4,
        "label": "eventos de gimnasia artística",
        "match": "eventos.*gimnas[a-z]*ia artistica",
        "relation": "las características de los eventos de gimnasia artística expresamente dados",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "2114ae5e-9f9a-5242-a490-93b35691d9d1"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Evento y características dadas",
            "success": "Explica los eventos de gimnasia artística relacionando sus características con las evidencias de los referentes proporcionados.",
            "sufficient": "La relación principal se sustenta en las características de los referentes proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las características de los referentes proporcionados.",
            "error": "Presenta relaciones incompatibles con las características de los referentes proporcionados."
          }
        ]
      },
      {
        "id": "artistic-gymnastics-rules",
        "grade": 4,
        "label": "código de puntuación de gimnasia artística",
        "match": "codigo de puntuacion.*gimnas[a-z]*|reglas.*gimnas[a-z]*ia artistica",
        "relation": "la relación entre los valores y reglas del código de puntuación gimnástico proporcionado y sus evidencias",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "80cbf71b-8969-5789-95ce-d6162b27d40e"
        ],
        "pdfPages": [
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Valor y regla del código dado",
            "success": "Interpreta el código de puntuación de gimnasia artística relacionando las reglas y valores dados con las evidencias del referente proporcionado, sin inventar otro código.",
            "sufficient": "La relación principal se sustenta en los valores y evidencias del código proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los valores y evidencias del código proporcionado.",
            "error": "Presenta relaciones incompatibles con los valores y evidencias del código proporcionado."
          }
        ]
      },
      {
        "id": "apparatus-reference-analysis",
        "grade": 4,
        "label": "agarre técnico en aparato de gimnasia artística",
        "match": "agarre.*gimnas[a-z]*ia artistica|referente tecnico.*gimnas[a-z]*ia artistica",
        "relation": "la relación entre agarre, movimiento y condiciones del aparato de gimnasia artística expresamente elegido",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "2114ae5e-9f9a-5242-a490-93b35691d9d1",
          "f580ec52-8d00-561a-a489-b3e33350725e",
          "1d9fa7a8-7acb-507d-9cd0-e8b20c234264"
        ],
        "pdfPages": [
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Agarre y condiciones del aparato elegido",
            "success": "Analiza el agarre del referente técnico de gimnasia artística en el aparato expresamente elegido relacionando movimiento y condiciones con las evidencias proporcionadas.",
            "sufficient": "La relación principal se sustenta en las condiciones y evidencias del aparato elegido; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las condiciones y evidencias del aparato elegido.",
            "error": "Presenta relaciones incompatibles con las condiciones y evidencias del aparato elegido."
          }
        ]
      },
      {
        "id": "handball-local-research",
        "grade": 4,
        "label": "aportes locales de personajes de balonmano",
        "match": "aportes.*balonmano|personajes.*balonmano",
        "relation": "la relación entre los aportes de personajes e instituciones de balonmano del ámbito nacional y local asignado y las fuentes dadas",
        "primaryPurpose": "RESEARCH",
        "sourceRecordIds": [
          "f691a5cc-4fbe-547f-a821-76e58529f04e"
        ],
        "pdfPages": [
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aporte y evidencia de la fuente",
            "success": "Investiga los aportes de personajes e instituciones de balonmano del entorno nacional y local relacionándolos con las evidencias de las fuentes proporcionadas.",
            "sufficient": "La relación principal se sustenta en las fuentes del ámbito nacional y local proporcionadas; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fuentes del ámbito nacional y local proporcionadas.",
            "error": "Presenta relaciones incompatibles con las fuentes del ámbito nacional y local proporcionadas."
          }
        ]
      },
      {
        "id": "handball-positions",
        "grade": 4,
        "label": "posiciones de jugadores de balonmano",
        "match": "posiciones.*jugadores.*balonmano|posiciones.*balonmano",
        "relation": "la relación entre funciones y ubicación de las posiciones de balonmano del referente dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "a0e43f5f-150d-5205-b973-8338374c57f7"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posición y función del jugador",
            "success": "Explica las posiciones de los jugadores de balonmano relacionando sus funciones y ubicación con las referencias proporcionadas, sin inferir capacidad natural.",
            "sufficient": "La relación principal se sustenta en las funciones y ubicaciones del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las funciones y ubicaciones del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las funciones y ubicaciones del referente proporcionado."
          }
        ]
      },
      {
        "id": "handball-fundamentals",
        "grade": 4,
        "label": "fundamentos técnicos de balonmano",
        "match": "(?:pases|lanzamientos|drible|fundamentos tecnicos).*balonmano",
        "relation": "la relación entre las acciones técnicas de balonmano expresamente elegidas y las referencias dadas",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "863ea105-b9fe-55c9-b3ee-ba2995585032",
          "1ebb6295-5d49-52a2-94c9-1ba9b06200d8"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acción técnica elegida y referencia",
            "success": "Ejecuta las acciones técnicas de balonmano expresamente elegidas según las señales y apoyos de la tarea adaptada proporcionada.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las señales y apoyos de la tarea proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y apoyos de la tarea proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y apoyos de la tarea proporcionada."
          }
        ]
      },
      {
        "id": "handball-possession",
        "grade": 4,
        "label": "ofensiva de posesión de balonmano",
        "match": "posesion.*balonmano|balonmano.*posesion",
        "relation": "la relación entre posiciones, alternativas y decisiones de posesión de balonmano del caso dado",
        "primaryPurpose": "PLAN",
        "sourceRecordIds": [
          "36f86e89-8bad-5710-af7a-4694dbe652f0",
          "1ebb6295-5d49-52a2-94c9-1ba9b06200d8"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión de posesión prevista",
            "success": "Planifica la ofensiva de posesión de balonmano del caso dado relacionando decisiones y posiciones con las alternativas proporcionadas, sin exigir jugar.",
            "sufficient": "La relación principal se sustenta en las posiciones y alternativas del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y alternativas del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con las posiciones y alternativas del caso proporcionado."
          }
        ]
      },
      {
        "id": "handball-counterattack",
        "grade": 4,
        "label": "contraataque sencillo de balonmano",
        "match": "contraataque.*balonmano",
        "relation": "la relación entre posiciones y decisiones del contraataque de balonmano expresamente dado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "36f86e89-8bad-5710-af7a-4694dbe652f0",
          "fcee3f90-c405-5c7a-b5a2-20c5e28c6f3b"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Contraataque según las señales dadas",
            "success": "Ejecuta el contraataque sencillo adaptado de balonmano según las señales, posiciones y apoyos de la situación proporcionada.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las señales y posiciones proporcionadas.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y posiciones proporcionadas.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y posiciones proporcionadas."
          }
        ]
      },
      {
        "id": "handball-defense",
        "grade": 4,
        "label": "acciones defensivas de equipo de balonmano",
        "match": "acciones defensivas.*balonmano",
        "relation": "la relación entre posiciones y acuerdos de las acciones defensivas de balonmano expresamente dadas",
        "primaryPurpose": "PLAN",
        "sourceRecordIds": [
          "ff913b61-bde2-583b-8628-f1eab2106fd3",
          "1ebb6295-5d49-52a2-94c9-1ba9b06200d8"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posiciones y acuerdos defensivos previstos",
            "success": "Planifica las acciones defensivas del equipo de balonmano del caso dado relacionando posiciones y acuerdos con las evidencias proporcionadas.",
            "sufficient": "La relación principal se sustenta en las posiciones y acuerdos del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y acuerdos del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con las posiciones y acuerdos del caso proporcionado."
          }
        ]
      },
      {
        "id": "handball-tactics",
        "grade": 4,
        "label": "situación táctica de balonmano",
        "match": "situacion tactica.*balonmano",
        "relation": "la relación entre alternativas, posiciones y decisión de la situación táctica de balonmano dada",
        "primaryPurpose": "PROBLEM_SOLVING",
        "sourceRecordIds": [
          "863ea105-b9fe-55c9-b3ee-ba2995585032",
          "05446020-9be6-5007-b5dd-8f6abebe3742"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión táctica y sustento",
            "success": "Resuelve la situación táctica ofensiva y defensiva de balonmano del caso dado justificando la decisión según las posiciones, reglas y alternativas proporcionadas.",
            "sufficient": "La relación principal se sustenta en las alternativas y condiciones del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las alternativas y condiciones del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con las alternativas y condiciones del caso proporcionado."
          }
        ]
      },
      {
        "id": "handball-rules",
        "grade": 4,
        "label": "reglas de balonmano",
        "match": "reglas.*balonmano|balonmano.*reglas",
        "relation": "las funciones y condiciones de las reglas de balonmano expresamente dadas",
        "primaryPurpose": "VERIFICATION",
        "sourceRecordIds": [
          "007c1ef7-6050-51f7-8817-907357c58e3f",
          "974b3a78-fe0e-5825-901e-e995d55f24be"
        ],
        "pdfPages": [
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y regla del registro",
            "success": "Verifica si las decisiones del registro de balonmano cumplen las reglas dadas mediante las evidencias proporcionadas.",
            "sufficient": "La relación principal se sustenta en las reglas y evidencias del registro proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las reglas y evidencias del registro proporcionado.",
            "error": "Presenta relaciones incompatibles con las reglas y evidencias del registro proporcionado."
          }
        ]
      },
      {
        "id": "handball-adapted-rules",
        "grade": 4,
        "label": "adaptaciones del reglamento de balonmano",
        "match": "adaptaciones.*reglamento.*balonmano|adaptaciones.*reglas.*balonmano",
        "relation": "la relación entre recursos, participación y adaptaciones del reglamento de balonmano del caso dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "e0329548-3acf-51bc-8e5c-463a4fb7dbed"
        ],
        "pdfPages": [
          375
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Adaptación y condiciones de participación",
            "success": "Analiza las adaptaciones del reglamento de balonmano relacionando recursos y participación con las necesidades del caso proporcionado, sin inferir diagnósticos.",
            "sufficient": "La relación principal se sustenta en los recursos y condiciones del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los recursos y condiciones del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con los recursos y condiciones del caso proporcionado."
          }
        ]
      },
      {
        "id": "chess-variants",
        "grade": 4,
        "label": "cálculo de variantes de ajedrez",
        "match": "problema.*ajedrez|variantes.*ajedrez",
        "relation": "la relación entre las jugadas de las variantes expresamente solicitadas y la posición de ajedrez dada",
        "primaryPurpose": "PROBLEM_SOLVING",
        "sourceRecordIds": [
          "121234dc-fbbf-5c51-9f78-aeed6b7cbbab",
          "eb111b62-b6cd-554b-8732-c70028a8bb4b",
          "3023a241-7334-53bf-9868-da5c15a77082",
          "0a27d587-ba13-5614-8abc-26c25059d06a"
        ],
        "pdfPages": [
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Variante y jugadas justificadas",
            "success": "Resuelve el problema de ajedrez calculando las variantes expresamente solicitadas y justificando las jugadas con la posición y reglas proporcionadas.",
            "sufficient": "La relación principal se sustenta en las posiciones y reglas proporcionadas; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y reglas proporcionadas.",
            "error": "Presenta relaciones incompatibles con las posiciones y reglas proporcionadas."
          }
        ]
      },
      {
        "id": "chess-position-advantage",
        "grade": 4,
        "label": "ventaja de posición de ajedrez",
        "match": "ventaja.*ajedrez|ajedrez.*ventaja",
        "relation": "la relación entre el tipo de ventaja de ajedrez expresamente elegido y las evidencias de la posición dada",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "a60b96e2-506c-5dd3-a509-1bc8ec7eca23",
          "416de9b4-d554-5811-bd55-9b9f958e620d",
          "0066021c-0602-5029-9d0f-c93cdce51212"
        ],
        "pdfPages": [
          374,
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Ventaja elegida y evidencia de la posición",
            "success": "Analiza la ventaja de la posición de ajedrez expresamente elegida justificándola con las piezas y evidencias proporcionadas.",
            "sufficient": "La relación principal se sustenta en las piezas y evidencias de la posición proporcionada; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las piezas y evidencias de la posición proporcionada.",
            "error": "Presenta relaciones incompatibles con las piezas y evidencias de la posición proporcionada."
          }
        ]
      },
      {
        "id": "basketball-game",
        "grade": 4,
        "label": "juego adaptado de baloncesto",
        "match": "juega.*baloncesto|juego adaptado.*baloncesto",
        "relation": "la relación entre reglas, acciones ofensivas y defensivas y decisiones del juego de baloncesto expresamente dado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "faf01292-a075-5ae0-ae10-daaf811dccd5",
          "02e0a923-ac89-5be3-9262-0cad2ebb08b8"
        ],
        "pdfPages": [
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas del juego dado",
            "success": "Juega la situación adaptada de baloncesto de la variante expresamente elegida aplicando las reglas y decisiones ofensivas y defensivas proporcionadas con los apoyos acordados, sin evaluar ganar.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las reglas y decisiones del juego proporcionado.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las reglas y decisiones del juego proporcionado.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las reglas y decisiones del juego proporcionado."
          }
        ]
      },
      {
        "id": "handball-game",
        "grade": 4,
        "label": "juego adaptado de balonmano",
        "match": "juega.*balonmano|juego adaptado.*balonmano",
        "relation": "la relación entre reglas, acciones ofensivas y defensivas y decisiones del juego de balonmano dado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "007c1ef7-6050-51f7-8817-907357c58e3f",
          "1ebb6295-5d49-52a2-94c9-1ba9b06200d8",
          "02e0a923-ac89-5be3-9262-0cad2ebb08b8"
        ],
        "pdfPages": [
          375,
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas del juego dado",
            "success": "Juega la situación adaptada de balonmano aplicando las reglas y decisiones ofensivas y defensivas proporcionadas con los apoyos acordados, sin evaluar ganar.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las reglas y decisiones del juego proporcionado.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las reglas y decisiones del juego proporcionado.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las reglas y decisiones del juego proporcionado."
          }
        ]
      },
      {
        "id": "gymnastics-apparatus-performance",
        "grade": 4,
        "label": "ejecución adaptada en aparato de gimnasia artística",
        "match": "ejecuta.*(?:elementos tecnicos|aparato).*gimnas[a-z]*ia artistica|ejecuta.*gimnas[a-z]*ia artistica.*aparato",
        "relation": "la relación entre los elementos técnicos adaptados y los agarres, apoyos y condiciones del aparato expresamente elegido",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "f580ec52-8d00-561a-a489-b3e33350725e",
          "1d9fa7a8-7acb-507d-9cd0-e8b20c234264"
        ],
        "pdfPages": [
          376
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Elemento técnico y apoyos del aparato dado",
            "success": "Ejecuta los elementos técnicos adaptados de gimnasia artística en el aparato expresamente elegido siguiendo las señales, agarres, apoyos y supervisión ya proporcionados, sin añadir maniobras nuevas.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las señales y condiciones supervisadas del aparato proporcionado.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y condiciones supervisadas del aparato proporcionado.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y condiciones supervisadas del aparato proporcionado."
          }
        ]
      }
    ],
    "policy": "REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1"
  },
  {
    "id": "educacion-fisica-comun-5",
    "grade": 5,
    "topics": [
      {
        "id": "circuit-plan",
        "grade": 5,
        "label": "organización de un circuito adaptado",
        "match": "circuito adaptado|estaciones?.*pausas?|pausas?.*estaciones?",
        "relation": "la relación entre estaciones, acciones, orden y pausas fijados en la ficha docente",
        "pdfPages": [
          377
        ],
        "sourceRecordIds": [
          "c81dff16-3ba7-53cc-b403-bb9429e3414a"
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan de estaciones y pausas dadas",
            "success": "Planifica la organización del circuito adaptado relacionando estaciones, acciones y pausas ya fijadas en la ficha docente, sin añadir intensidad o duración nuevas.",
            "sufficient": "El plan relaciona las estaciones y pausas; una referencia secundaria al orden queda poco precisada.",
            "partial": "Identifica estaciones pertinentes, pero una relación de orden o pausa no corresponde a la ficha dada.",
            "error": "El plan modifica las condiciones proporcionadas o introduce dosis físicas no sustentadas en la ficha.",
            "variants": {
              "PERFORMANCE": {
                "title": "Estaciones y pausas del circuito dado",
                "success": "Ejecuta la secuencia de estaciones y acciones del circuito adaptado respetando las pausas y apoyos ya fijados en la ficha docente, sin añadir intensidad o duración nuevas.",
                "sufficient": "La secuencia de estaciones se reconoce; una transición secundaria pierde continuidad.",
                "partial": "Realiza acciones pertinentes, pero una transición o pausa no corresponde a la ficha dada.",
                "error": "Cambia las acciones o pausas de modo incompatible con las condiciones adaptadas proporcionadas."
              }
            }
          }
        ]
      },
      {
        "id": "flexibility-observation",
        "grade": 5,
        "label": "acciones de flexibilidad adaptadas",
        "match": "flexibilidad activa|flexibilidad pasiva|acciones? de flexibilidad",
        "relation": "la relación entre las acciones de flexibilidad elegidas y las condiciones adaptadas del referente",
        "pdfPages": [
          377
        ],
        "sourceRecordIds": [
          "f6314117-cd8b-5900-8353-ab8ccab088b1"
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Cumplimiento de acciones de flexibilidad",
            "success": "Identifica con evidencias si el referente cumple las acciones de flexibilidad expresamente adaptadas en la ficha docente, sin medir amplitud corporal ni añadir maniobras.",
            "sufficient": "La verificación se sustenta; una marca secundaria queda poco clara sin cambiar su resultado principal.",
            "partial": "Identifica acciones pertinentes, pero una marca no permite determinar si cumple la condición dada.",
            "error": "Atribuye un cumplimiento incompatible con el referente o lo sustituye por un juicio de amplitud o capacidad natural.",
            "variants": {
              "PERFORMANCE": {
                "title": "Acciones de flexibilidad adaptadas",
                "success": "Ejecuta las acciones de flexibilidad expresamente adaptadas en la ficha docente según las señales y apoyos acordados, sin puntuar amplitud corporal.",
                "sufficient": "Las acciones y sus señales se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Presenta acciones pertinentes, pero una respuesta no corresponde a la señal o adaptación acordadas.",
                "error": "Las acciones contradicen las condiciones adaptadas dadas o no permiten reconocer la secuencia solicitada."
              }
            }
          }
        ]
      },
      {
        "id": "motor-variation",
        "grade": 5,
        "label": "variaciones de dirección y velocidad",
        "match": "secuencia motriz|(?:combina|variacion|variando).*(?:desplazamientos|giros|direccion|sentido)|centro de gravedad",
        "relation": "la relación entre cambios motrices solicitados, señales y apoyos de la secuencia adaptada",
        "pdfPages": [
          377
        ],
        "sourceRecordIds": [
          "a202952a-487e-5cfc-bf07-bf463a51c697"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Respuestas a las señales motrices",
            "success": "Ejecuta los cambios de dirección y velocidad expresamente dados respondiendo a las señales y apoyos acordados de la secuencia adaptada.",
            "sufficient": "Los cambios y sus señales se reconocen; un ajuste secundario pierde continuidad sin romper la secuencia.",
            "partial": "Presenta respuestas pertinentes, pero un cambio no corresponde a la dirección o velocidad señaladas.",
            "error": "Las respuestas contradicen las señales dadas o impiden reconocer la secuencia motriz solicitada."
          }
        ]
      },
      {
        "id": "equilibrium-observation",
        "grade": 5,
        "label": "equilibrio y base de sustentación",
        "match": "equilibrio.*(?:base|referente)|base de sustentacion",
        "relation": "la relación entre base de sustentación, apoyos, plano y equilibrio del referente dado",
        "pdfPages": [
          377
        ],
        "sourceRecordIds": [
          "0abdf171-7e98-561d-a638-254be2d5b997"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Base, apoyos y equilibrio del referente",
            "success": "Explica el equilibrio del referente relacionando base de sustentación, apoyos y plano expresamente señalados con evidencias de la ficha proporcionada.",
            "sufficient": "Las relaciones principales se sustentan; una referencia espacial secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación entre apoyo y equilibrio carece de sustento.",
            "error": "Atribuye al referente apoyos o efectos incompatibles con sus datos o sustituye el análisis por una maniobra no solicitada."
          }
        ]
      },
      {
        "id": "compass-orientation",
        "grade": 5,
        "label": "orientación con brújula",
        "match": "orientacion.*brujula|brujula.*(?:referencias|orientacion)",
        "relation": "la relación de la brújula con los puntos cardinales y referencias del sistema de orientación proporcionado",
        "sourceRecordIds": [
          "2bef3d27-363b-54ea-8a65-f6c7b427ab08",
          "ca371f93-e826-580a-9700-b4234647aac8"
        ],
        "pdfPages": [
          378,
          379
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Brújula, referencias y decisiones",
            "success": "Explica las decisiones de orientación con brújula del referente relacionando puntos cardinales y referencias con las condiciones proporcionadas.",
            "sufficient": "La relación principal de orientación con brújula se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de orientación con brújula, pero una relación no se sustenta en el sistema de referencia proporcionado.",
            "error": "Atribuye a orientación con brújula relaciones incompatibles con el sistema de referencia proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento.",
            "variants": {
              "PERFORMANCE": {
                "id": "requested-evidence",
                "title": "Referencias y decisiones de brújula",
                "success": "Realiza la orientación con la brújula expresamente dada del trayecto adaptado siguiendo los puntos cardinales y referencias proporcionadas con los apoyos permitidos.",
                "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las referencias y condiciones del trayecto proporcionado.",
                "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las referencias y condiciones del trayecto proporcionado.",
                "error": "Sustituye las acciones solicitadas por otras incompatibles con las referencias y condiciones del trayecto proporcionado.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ]
      },
      {
        "id": "gps-orientation",
        "grade": 5,
        "label": "orientación GPS",
        "match": "orientacion.*gps|gps.*(?:referencias|orientacion)",
        "relation": "la relación entre las referencias GPS expresamente dadas y las decisiones del trayecto",
        "sourceRecordIds": [
          "2bef3d27-363b-54ea-8a65-f6c7b427ab08",
          "ca371f93-e826-580a-9700-b4234647aac8"
        ],
        "pdfPages": [
          378,
          379
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias GPS del registro dado",
            "success": "Analiza las referencias GPS del registro simulado relacionándolas con las decisiones del trayecto proporcionado, sin solicitar ubicación personal.",
            "sufficient": "La relación principal de orientación GPS se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de orientación GPS, pero una relación no se sustenta en las referencias del registro proporcionado.",
            "error": "Atribuye a orientación GPS relaciones incompatibles con las referencias del registro proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "camping-concept",
        "grade": 5,
        "label": "modalidades de acampada",
        "match": "modalidades?.*acampada|concepto.*campismo|campismo.*concepto",
        "relation": "la relación entre las modalidades de acampada y las condiciones y recursos del contexto trabajado",
        "sourceRecordIds": [
          "37ddc0cb-f749-5b7b-9cce-9ada6a7fedfc"
        ],
        "pdfPages": [
          377
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Modalidad y condiciones de acampada",
            "success": "Explica las modalidades de acampada relacionando sus condiciones y recursos con las evidencias del referente proporcionado.",
            "sufficient": "La relación principal de modalidades de acampada se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de modalidades de acampada, pero una relación no se sustenta en las condiciones del referente proporcionado.",
            "error": "Atribuye a modalidades de acampada relaciones incompatibles con las condiciones del referente proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "shelter-plan",
        "grade": 5,
        "label": "plan de casa de campaña o refugio",
        "match": "plan.*(?:casa de campana|refugio)|(?:casa de campana|refugio).*plan",
        "relation": "la relación entre el modelo de alojamiento elegido, sus recursos y las condiciones de instalación previstas",
        "sourceRecordIds": [
          "eb87fbaa-8796-59f2-99f5-e94091153244"
        ],
        "pdfPages": [
          378
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan de instalación del modelo elegido",
            "success": "Planifica la instalación de la casa de campaña o refugio expresamente elegido relacionando esquema, recursos y condiciones proporcionadas, sin exigir construir ambos.",
            "sufficient": "La relación principal de plan del modelo elegido se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de plan del modelo elegido, pero una relación no se sustenta en el esquema, los recursos y las condiciones proporcionadas.",
            "error": "Atribuye a plan del modelo elegido relaciones incompatibles con el esquema, los recursos y las condiciones proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "shelter-assembly",
        "grade": 5,
        "label": "modelo de casa de campaña o refugio",
        "match": "(?:construye|instala).*(?:casa de campana|refugio)|modelo.*(?:casa de campana|refugio)",
        "relation": "la relación entre el esquema del modelo, los recursos y las fases de construcción e instalación solicitadas",
        "sourceRecordIds": [
          "eb87fbaa-8796-59f2-99f5-e94091153244"
        ],
        "pdfPages": [
          378
        ],
        "primaryPurpose": "PRODUCTION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Construcción e instalación según el esquema",
            "success": "Construye e instala el modelo de casa de campaña expresamente elegido siguiendo el esquema, recursos y condiciones de la simulación supervisada proporcionada.",
            "sufficient": "Las acciones principales de construcción e instalación del modelo se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de construcción e instalación del modelo no corresponde al esquema y las condiciones supervisadas proporcionados.",
            "error": "Las decisiones de construcción e instalación del modelo contradicen el esquema y las condiciones supervisadas proporcionados o impiden reconocer la acción solicitada."
          }
        ],
        "excludeWhen": "plan"
      },
      {
        "id": "hiking-plan",
        "grade": 5,
        "label": "plan de senderismo",
        "match": "plan.*senderismo|senderismo.*plan",
        "relation": "la relación entre trayecto, referencias, recursos y acuerdos previstos del plan de senderismo",
        "sourceRecordIds": [
          "37ddc0cb-f749-5b7b-9cce-9ada6a7fedfc",
          "31366105-9603-514d-99c4-f6fb15cbdd17",
          "54d34afc-ac5e-5697-9e75-e5706ca5e6ef",
          "bf362ffe-98b9-5f3a-b481-f0cc7ae2adea"
        ],
        "pdfPages": [
          377,
          378,
          379
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan del trayecto proporcionado",
            "success": "Planifica el senderismo del caso simulado relacionando trayecto, referencias, recursos y acuerdos expresamente proporcionados, sin exigir recorrerlo todavía.",
            "sufficient": "La relación principal de plan de senderismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de plan de senderismo, pero una relación no se sustenta en las referencias y condiciones del caso proporcionado.",
            "error": "Atribuye a plan de senderismo relaciones incompatibles con las referencias y condiciones del caso proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "hiking-practice",
        "grade": 5,
        "label": "trayecto de senderismo adaptado",
        "match": "recorre.*senderismo|senderismo.*(?:recorrido|trayecto) adaptad",
        "relation": "la relación entre las decisiones del trayecto adaptado y las referencias y acuerdos solicitados",
        "sourceRecordIds": [
          "31366105-9603-514d-99c4-f6fb15cbdd17",
          "54d34afc-ac5e-5697-9e75-e5706ca5e6ef"
        ],
        "pdfPages": [
          377,
          378
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias y acuerdos del trayecto",
            "success": "Recorre el trayecto adaptado de senderismo de la simulación supervisada siguiendo las referencias y acuerdos dados, con los apoyos permitidos.",
            "sufficient": "Las acciones principales de trayecto de senderismo se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de trayecto de senderismo no corresponde a las referencias y acuerdos proporcionados.",
            "error": "Las decisiones de trayecto de senderismo contradicen las referencias y acuerdos proporcionados o impiden reconocer la acción solicitada."
          }
        ],
        "excludeWhen": "plan"
      },
      {
        "id": "risk-prevention-case",
        "grade": 5,
        "label": "prevención de riesgos del campismo",
        "match": "riesgos?.*campismo|campismo.*riesgos?",
        "relation": "la relación entre factores de riesgo, condiciones del campismo y decisiones de la ficha de prevención dada",
        "sourceRecordIds": [
          "3f5cfafc-45b4-5fa6-8457-11ef8d88ecee",
          "cc9e713c-f51a-56d5-a83b-35b45ccaea87",
          "3aaccb6b-0653-58c2-83e7-b85f16a15d27"
        ],
        "pdfPages": [
          377,
          378,
          379
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Factores y decisiones de prevención",
            "success": "Analiza la prevención de riesgos del caso de campismo justificando las decisiones documentadas con la ficha proporcionada, sin exigir intervenciones físicas.",
            "sufficient": "La relación principal de prevención del riesgo en campismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de prevención del riesgo en campismo, pero una relación no se sustenta en las condiciones del caso y la ficha proporcionada.",
            "error": "Atribuye a prevención del riesgo en campismo relaciones incompatibles con las condiciones del caso y la ficha proporcionada o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "first-aid-reference",
        "grade": 5,
        "label": "protocolo proporcionado de primeros auxilios",
        "match": "primeros auxilios",
        "relation": "las condiciones y los criterios del protocolo de primeros auxilios proporcionado",
        "sourceRecordIds": [
          "3f5cfafc-45b4-5fa6-8457-11ef8d88ecee",
          "cc9e713c-f51a-56d5-a83b-35b45ccaea87",
          "3aaccb6b-0653-58c2-83e7-b85f16a15d27"
        ],
        "pdfPages": [
          377,
          378,
          379
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y protocolo proporcionado",
            "success": "Verifica el cumplimiento del protocolo de primeros auxilios proporcionado mediante las decisiones y evidencias del registro dado, sin añadir indicaciones médicas.",
            "sufficient": "La relación principal de decisiones de primeros auxilios se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de decisiones de primeros auxilios, pero una relación no se sustenta en las condiciones expresas del protocolo proporcionado.",
            "error": "Atribuye a decisiones de primeros auxilios relaciones incompatibles con las condiciones expresas del protocolo proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "athletics-history",
        "grade": 5,
        "label": "historia del atletismo",
        "match": "(?:historia|hechos|personajes).*atletismo|atletismo.*(?:historia|historicos)",
        "relation": "la relación entre hechos, personajes, ubicación temporal y fuentes del ámbito histórico de atletismo asignado",
        "sourceRecordIds": [
          "15a2f63e-6d67-54b4-9ac3-48988bbdd97d"
        ],
        "pdfPages": [
          379
        ],
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y referencias del atletismo",
            "success": "Presenta los hechos y personajes del atletismo expresamente asignados relacionando fechas y evidencias de las fuentes del ámbito proporcionado.",
            "sufficient": "La relación principal de historia del atletismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de historia del atletismo, pero una relación no se sustenta en los hechos, fechas y fuentes proporcionados.",
            "error": "Atribuye a historia del atletismo relaciones incompatibles con los hechos, fechas y fuentes proporcionados o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "paralimp|parlimp"
      },
      {
        "id": "athletics-rules",
        "grade": 5,
        "label": "reglas de atletismo",
        "match": "(?:reglas?|reglamento).*atletismo|atletismo.*(?:reglas?|reglamento)",
        "relation": "las funciones y condiciones de las reglas de atletismo expresamente asignadas",
        "sourceRecordIds": [
          "cc05bc86-171b-58c1-911d-2fb4529e0541",
          "70e370fa-0f66-50e7-a5f8-24d9f8199625"
        ],
        "pdfPages": [
          377,
          379
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas del atletismo",
            "success": "Verifica si las decisiones del caso de atletismo cumplen las reglas proporcionadas justificando cada marca con las evidencias del registro.",
            "sufficient": "La relación principal de reglas de atletismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de reglas de atletismo, pero una relación no se sustenta en las reglas y evidencias proporcionadas.",
            "error": "Atribuye a reglas de atletismo relaciones incompatibles con las reglas y evidencias proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "adaptaciones?|modificaciones?"
      },
      {
        "id": "athletic-walk-run",
        "grade": 5,
        "label": "caminata o carrera atlética elegida",
        "match": "(?:caminata|carrera).*atletic[a-z]*|atletic[a-z]*.*(?:caminata|carrera)",
        "relation": "la relación entre la prueba atlética elegida, sus señales y las condiciones adaptadas",
        "sourceRecordIds": [
          "2250d4bb-f502-5896-a352-f6638790ed34"
        ],
        "pdfPages": [
          379
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Prueba atlética elegida y señales",
            "success": "Ejecuta la prueba de caminata o carrera atlética expresamente elegida siguiendo las señales y condiciones adaptadas dadas con los apoyos permitidos, sin comparar rapidez personal.",
            "sufficient": "Las acciones principales de prueba atlética elegida se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de prueba atlética elegida no corresponde a las señales y condiciones adaptadas proporcionadas.",
            "error": "Las decisiones de prueba atlética elegida contradicen las señales y condiciones adaptadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "athletic-starts",
        "grade": 5,
        "label": "salidas atléticas alta y agachada",
        "match": "salidas?.*(?:alta|agachada)",
        "relation": "la relación entre las posiciones de salida y las respuestas a las señales del referente atlético",
        "sourceRecordIds": [
          "2250d4bb-f502-5896-a352-f6638790ed34"
        ],
        "pdfPages": [
          379
        ],
        "primaryPurpose": "COMPARISON",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Contraste de posiciones de salida",
            "success": "Compara las salidas alta y agachada de los referentes atléticos proporcionados relacionando posición y respuesta con las señales dadas, sin exigir ejecutarlas.",
            "sufficient": "La relación principal de posiciones de salida atlética se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de posiciones de salida atlética, pero una relación no se sustenta en las posiciones y señales del referente proporcionado.",
            "error": "Atribuye a posiciones de salida atlética relaciones incompatibles con las posiciones y señales del referente proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "athletic-adaptation",
        "grade": 5,
        "label": "adaptaciones de reglas de atletismo",
        "match": "adaptaciones?.*(?:reglas?|pruebas?).*atletismo|atletismo adaptado.*(?:reglas?|condiciones)",
        "relation": "la relación entre recursos, condiciones de participación y adaptaciones del atletismo solicitadas",
        "sourceRecordIds": [
          "c5c49252-0d4a-5f4e-91fd-4b0ef31faf2b"
        ],
        "pdfPages": [
          377
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Adaptaciones y participación en atletismo",
            "success": "Analiza las adaptaciones de las reglas de atletismo relacionando recursos y condiciones de participación con las evidencias del caso proporcionado, sin inferir diagnósticos.",
            "sufficient": "La relación principal de adaptaciones de atletismo se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de adaptaciones de atletismo, pero una relación no se sustenta en los recursos y condiciones de participación proporcionados.",
            "error": "Atribuye a adaptaciones de atletismo relaciones incompatibles con los recursos y condiciones de participación proporcionados o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "paralympic-history",
        "grade": 5,
        "label": "historia del atletismo paralímpico",
        "match": "atletismo paralimpico|atletismo parlimpico",
        "relation": "la relación entre hechos históricos, características y fuentes del atletismo paralímpico del ámbito asignado",
        "sourceRecordIds": [
          "f7cac443-29a9-5ecc-9cf4-8513d2f81af5",
          "15a2f63e-6d67-54b4-9ac3-48988bbdd97d"
        ],
        "pdfPages": [
          377,
          379
        ],
        "primaryPurpose": "RESEARCH",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hallazgos históricos del atletismo paralímpico",
            "success": "Investiga los hechos históricos del atletismo paralímpico expresamente asignados relacionando fechas y referencias con las fuentes proporcionadas, distinguiendo evidencia e inferencia.",
            "sufficient": "La relación principal de historia del atletismo paralímpico se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de historia del atletismo paralímpico, pero una relación no se sustenta en los hechos y fuentes del ámbito proporcionado.",
            "error": "Atribuye a historia del atletismo paralímpico relaciones incompatibles con los hechos y fuentes del ámbito proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "baseball-history",
        "grade": 5,
        "label": "historia de béisbol o softbol",
        "match": "(?:historia|hechos|personajes).*(?:beisbol|softbol)|(?:beisbol|softbol).*(?:historia|historicos)",
        "relation": "la relación entre hechos, personajes, fechas y fuentes de la disciplina y ámbito históricos expresamente asignados",
        "sourceRecordIds": [
          "11de4324-96e9-57f7-ad27-388c9ae33faf",
          "962eda27-ed14-564e-9022-511677fdd22b"
        ],
        "pdfPages": [
          378
        ],
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y fuentes de la disciplina elegida",
            "success": "Presenta los hechos y personajes del softbol expresamente asignados relacionando fechas y evidencias de las fuentes del ámbito proporcionado.",
            "sufficient": "La relación principal de historia de la disciplina elegida se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de historia de la disciplina elegida, pero una relación no se sustenta en las fechas y fuentes del ámbito proporcionado.",
            "error": "Atribuye a historia de la disciplina elegida relaciones incompatibles con las fechas y fuentes del ámbito proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento.",
            "variants": {
              "RESEARCH": {
                "id": "requested-evidence",
                "title": "Historia local y fuente",
                "success": "Investiga la historia de los clubes y equipos de béisbol del ámbito local asignado relacionando hechos y aportes con las evidencias de las fuentes proporcionadas.",
                "sufficient": "La relación principal se sustenta en las fuentes del ámbito local proporcionadas; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fuentes del ámbito local proporcionadas.",
                "error": "Presenta relaciones incompatibles con las fuentes del ámbito local proporcionadas.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ]
      },
      {
        "id": "baseball-rules",
        "grade": 5,
        "label": "reglas de béisbol o softbol",
        "match": "(?:reglas?|reglamento).*(?:beisbol|softbol)|(?:beisbol|softbol).*(?:reglas?|reglamento)",
        "relation": "las funciones y condiciones de las reglas de la disciplina expresamente elegida",
        "sourceRecordIds": [
          "0dadf5a6-b8f6-5aad-a9f4-a6b70e415434",
          "66d34ecd-406f-5186-8a5e-1bf6d5c2ebe9",
          "70e370fa-0f66-50e7-a5f8-24d9f8199625"
        ],
        "pdfPages": [
          377,
          378,
          379
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas de la disciplina elegida",
            "success": "Verifica si las decisiones del caso de béisbol cumplen las reglas proporcionadas justificando cada marca con las evidencias del registro.",
            "sufficient": "La relación principal de reglas de la disciplina elegida se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de reglas de la disciplina elegida, pero una relación no se sustenta en las reglas y evidencias del registro proporcionado.",
            "error": "Atribuye a reglas de la disciplina elegida relaciones incompatibles con las reglas y evidencias del registro proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ],
        "excludeWhen": "beisbol ?5|beisbol cinco"
      },
      {
        "id": "baseball-five-rules",
        "grade": 5,
        "label": "reglas de béisbol y béisbol 5",
        "match": "reglas?.*beisbol ?5|beisbol cinco|beisbol ?5.*reglas?",
        "relation": "las semejanzas y diferencias entre las reglas de béisbol y béisbol 5 proporcionadas",
        "sourceRecordIds": [
          "0dadf5a6-b8f6-5aad-a9f4-a6b70e415434"
        ],
        "pdfPages": [
          377
        ],
        "primaryPurpose": "COMPARISON",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Reglas y decisiones de las dos variantes",
            "success": "Compara las reglas de béisbol y béisbol 5 expresamente proporcionadas relacionando semejanzas y diferencias con las decisiones de la situación dada.",
            "sufficient": "La relación principal de contraste entre béisbol y béisbol 5 se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de contraste entre béisbol y béisbol 5, pero una relación no se sustenta en las reglas y situaciones proporcionadas.",
            "error": "Atribuye a contraste entre béisbol y béisbol 5 relaciones incompatibles con las reglas y situaciones proporcionadas o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "baseball-fielding",
        "grade": 5,
        "label": "fildeo adaptado de béisbol",
        "match": "fildea|fildeo.*beisbol|rolling|flay|fly",
        "relation": "la relación entre el batazo elegido, la posición y las decisiones del fildeo adaptado",
        "sourceRecordIds": [
          "cbd844c9-ddbc-5234-bdff-ddb602668674",
          "45caad49-0600-5522-ab07-37eecda1581f",
          "9f7e45c8-120a-539c-ba4a-d58460a3abae",
          "5fb6c0cb-997a-5bf4-9209-c6a51c28cd85"
        ],
        "pdfPages": [
          378,
          379
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Batazo elegido y decisiones de fildeo",
            "success": "Fildea el batazo de rolling expresamente elegido de la tarea adaptada de béisbol según posición y condiciones supervisadas dadas, con los apoyos permitidos.",
            "sufficient": "Las acciones principales de fildeo del batazo elegido se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de fildeo del batazo elegido no corresponde a las posiciones y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de fildeo del batazo elegido contradicen las posiciones y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "baseball-throwing",
        "grade": 5,
        "label": "tiro adaptado de béisbol",
        "match": "tiro.*beisbol|beisbol.*tiro",
        "relation": "la relación entre referencia, dirección y condiciones del tiro adaptado de béisbol",
        "sourceRecordIds": [
          "ab824da6-73c3-5939-be4d-0c64c226d4c6"
        ],
        "pdfPages": [
          379
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencia y dirección del tiro",
            "success": "Realiza el tiro adaptado de béisbol hacia la referencia expresamente indicada según dirección y condiciones supervisadas dadas, sin evaluar distancia máxima.",
            "sufficient": "Las acciones principales de tiro adaptado se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de tiro adaptado no corresponde a la referencia y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de tiro adaptado contradicen la referencia y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "baseball-batting",
        "grade": 5,
        "label": "bateo adaptado de béisbol",
        "match": "bateo|mecanica.*bate",
        "relation": "la relación entre localización, decisiones y condiciones adaptadas del bateo solicitado",
        "sourceRecordIds": [
          "8e5b705b-29cd-5f48-8a48-d2fded978602",
          "5fb6c0cb-997a-5bf4-9209-c6a51c28cd85",
          "69850c94-f20e-5d32-9bd0-0927ae2f5a8a"
        ],
        "pdfPages": [
          378,
          379
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Bateo y recursos dados",
            "success": "Ejecuta el bateo adaptado de béisbol usando el móvil y el implemento expresamente dados según las señales y condiciones supervisadas proporcionadas con los apoyos permitidos.",
            "sufficient": "Las acciones principales de bateo adaptado se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de bateo adaptado no corresponde a la localización y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de bateo adaptado contradicen la localización y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "base-running",
        "grade": 5,
        "label": "corrido de bases de béisbol",
        "match": "corre.*bases|corrido de.*bases|bases.*outs",
        "relation": "la relación entre decisiones del corrido de bases y los outs, compañeros y marcador de la situación dada",
        "sourceRecordIds": [
          "8e5b705b-29cd-5f48-8a48-d2fded978602",
          "5fb6c0cb-997a-5bf4-9209-c6a51c28cd85",
          "45caad49-0600-5522-ab07-37eecda1581f"
        ],
        "pdfPages": [
          378
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones según la situación de bases",
            "success": "Corre las bases de la situación adaptada relacionando sus decisiones con los outs, compañeros en base y marcador proporcionados, utilizando los apoyos permitidos.",
            "sufficient": "Las acciones principales de corrido de bases se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión del corrido de bases no corresponde a las señales y condiciones proporcionadas.",
            "error": "Las decisiones del corrido de bases contradicen las señales y condiciones proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "martial-history",
        "grade": 5,
        "label": "historia de las artes marciales",
        "match": "(?:historia|hechos|historicos).*artes marciales|artes marciales.*historia",
        "relation": "la relación entre hechos, fechas, personajes y fuentes de las artes marciales del ámbito asignado",
        "sourceRecordIds": [
          "15a2f63e-6d67-54b4-9ac3-48988bbdd97d"
        ],
        "pdfPages": [
          379
        ],
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y fuentes de las artes marciales",
            "success": "Presenta los hechos históricos de las artes marciales expresamente asignados relacionando fechas y personajes con las fuentes proporcionadas.",
            "sufficient": "La relación principal de historia de las artes marciales se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de historia de las artes marciales, pero una relación no se sustenta en las fechas y fuentes del ámbito proporcionado.",
            "error": "Atribuye a historia de las artes marciales relaciones incompatibles con las fechas y fuentes del ámbito proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "martial-fundamentals",
        "grade": 5,
        "label": "fundamentos adaptados de artes marciales",
        "match": "fundamentos.*artes marciales|acciones basicas de artes marciales|(?:posiciones|desplazamientos|bloqueos|patadas|puno|agarres|proyecciones|caidas|defensas|combates).*artes marciales",
        "relation": "la relación entre fases, función y condiciones de los fundamentos de artes marciales expresamente elegidos",
        "sourceRecordIds": [
          "db01e9e4-7a98-5f9f-957a-a2362cac7ef2"
        ],
        "pdfPages": [
          379
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones adaptadas y condiciones dadas",
            "success": "Ejecuta las acciones básicas de artes marciales expresamente adaptadas y supervisadas según las señales y condiciones proporcionadas, utilizando los apoyos permitidos sin improvisar maniobras nuevas.",
            "sufficient": "Las acciones principales de fundamentos expresamente adaptados se reconocen; un ajuste secundario pierde continuidad sin cambiar la condición dada.",
            "partial": "Realiza acciones pertinentes, pero una decisión de fundamentos expresamente adaptados no corresponde a las señales y condiciones supervisadas proporcionadas.",
            "error": "Las decisiones de fundamentos expresamente adaptados contradicen las señales y condiciones supervisadas proporcionadas o impiden reconocer la acción solicitada."
          }
        ]
      },
      {
        "id": "care-frequency",
        "grade": 5,
        "label": "cuidado observable de materiales y espacio",
        "match": "cuidado de materiales|cuidado.*espacio|frecuencia.*materiales.*espacio",
        "relation": "la relación entre acciones de cuidado de materiales y espacio y las condiciones expresamente trabajadas",
        "pdfPages": [
          378
        ],
        "sourceRecordIds": [
          "77878e7e-25ed-5862-b8f3-7c0680ff1fa3"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones de cuidado observadas",
            "success": "Cumple las acciones concretas de cuidado de materiales y del espacio acordadas en todas las oportunidades observadas.",
            "sufficient": "Cumple las acciones de cuidado acordadas en casi todas las oportunidades observadas.",
            "partial": "Cumple las acciones de cuidado acordadas en algunas oportunidades observadas.",
            "error": "Cumple las acciones de cuidado acordadas en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "tactical-cooperation",
        "grade": 5,
        "label": "colaboración en soluciones técnico tácticas",
        "match": "solucion(?:es)?.*acuerdos? tecnicos?|acuerdos? tecnicos?.*solucion(?:es)?|cooperacion tecnico tactica|frecuencia.*propuestas.*acuerdos tecnicos",
        "relation": "la relación entre propuestas, acuerdos concretos y solución técnica de la tarea colectiva trabajada",
        "pdfPages": [
          377,
          378
        ],
        "sourceRecordIds": [
          "0ac15375-09da-591f-8e37-3d4779d4b87e",
          "31e9de72-ae90-5446-a9e0-06c9046279af",
          "571aae4d-1483-558d-a7aa-14dbd3f155be"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aportes y acuerdos técnicos observados",
            "success": "Aporta propuestas pertinentes y cumple los acuerdos técnicos de la tarea colectiva dada en todas las oportunidades observadas, sin puntuar personalidad.",
            "sufficient": "Aporta propuestas y cumple acuerdos en casi todas las oportunidades observadas.",
            "partial": "Aporta propuestas y cumple acuerdos en algunas oportunidades observadas.",
            "error": "Aporta propuestas y cumple acuerdos en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "motor-progress-record",
        "grade": 5,
        "label": "análisis de progresión motriz documentada",
        "match": "progresion motriz|registro.*dos momentos",
        "relation": "la relación entre acciones adaptadas, condiciones y cambios documentados en dos momentos del registro dado",
        "pdfPages": [
          378,
          379
        ],
        "sourceRecordIds": [
          "c5daac39-136e-5690-818c-8e93036b7412",
          "a08151f9-e3f4-5b8b-8e64-ac5ed2e5c8ac",
          "515a0008-2396-5de9-a199-13ed3e4f4064",
          "bdbd9765-6134-5b1b-8220-42a8918f1b05"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Progresión según acciones y condiciones",
            "success": "Analiza la progresión motriz del registro proporcionado relacionando los cambios documentados con las acciones y condiciones dadas, sin comparar cuerpos ni capacidad natural.",
            "sufficient": "Los cambios principales se sustentan; una referencia secundaria a las condiciones queda poco precisada.",
            "partial": "Identifica datos pertinentes, pero una conclusión de progresión no se vincula con acciones o condiciones comparables.",
            "error": "Atribuye al registro mejoras o causas no acreditadas por sus datos o sustituye el análisis por un ranking de capacidad natural."
          }
        ]
      },
      {
        "id": "physical-condition-explanation",
        "grade": 5,
        "label": "capacidades coordinativas y condicionales",
        "match": "capacidades (?:fisicas|coordinativas|condicionales)|(?:explica|analiza|compara).*(?:fuerza|resistencia|coordinacion|equilibrio|diferenciacion|reaccion|adaptacion|ritmo)",
        "relation": "la función de las capacidades coordinativas y condicionales expresamente elegidas en los ejemplos dados",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "4fadab65-f0ed-5c60-bb31-80159c9bfbb8",
          "37154070-19cf-516f-9416-4aaebb124a0e",
          "eb35b824-e885-566f-81e7-ece820c4d954"
        ],
        "pdfPages": [
          377
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Capacidades y acciones del ejemplo",
            "success": "Explica la función de las capacidades físicas expresamente elegidas mediante evidencias de los ejemplos adaptados dados, sin comparar cuerpos o personas.",
            "sufficient": "La relación principal se sustenta en los ejemplos adaptados proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los ejemplos adaptados proporcionados.",
            "error": "Presenta relaciones incompatibles con los ejemplos adaptados proporcionados."
          }
        ]
      },
      {
        "id": "spatial-orientation",
        "grade": 5,
        "label": "orientación espacial del trayecto adaptado",
        "match": "orientacion espacial|objetos.*puntos cardinales",
        "relation": "la relación entre objetos, lugares y puntos cardinales expresamente dados y las decisiones del trayecto adaptado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "942a4496-ec8d-54f7-b0af-4ee8b8792ffd"
        ],
        "pdfPages": [
          377
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias y decisiones de orientación",
            "success": "Realiza la orientación espacial del trayecto adaptado siguiendo los objetos y puntos cardinales dados según las señales y apoyos proporcionados.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las referencias y condiciones del trayecto proporcionado.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las referencias y condiciones del trayecto proporcionado.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las referencias y condiciones del trayecto proporcionado.",
            "variants": {
              "PLAN": {
                "id": "requested-evidence",
                "title": "Referencias y orden previstos",
                "success": "Planifica la orientación espacial del trayecto adaptado relacionando los objetos y puntos cardinales dados con el orden previsto, sin exigir realizar el recorrido.",
                "sufficient": "La relación principal se sustenta en las referencias del trayecto proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las referencias del trayecto proporcionado.",
                "error": "Presenta relaciones incompatibles con las referencias del trayecto proporcionado."
              }
            }
          }
        ]
      },
      {
        "id": "wellbeing-reference",
        "grade": 5,
        "label": "efectos de actividad física sobre salud y bienestar",
        "match": "(?:efectos|importancia).*actividad fisica.*(?:salud|bienestar)|(?:salud|bienestar).*(?:yoga|pilates|aerobicos|zumba|crossfit|step|steep|thai chi|tai chi)|imagen corporal|relacion.*actividad fisica.*bienestar",
        "relation": "la relación entre actividad física, salud y bienestar en los referentes proporcionados",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Efectos y evidencias del referente",
            "success": "Analiza los efectos de la actividad física sobre salud y bienestar relacionando acciones y condiciones de los referentes proporcionados con las evidencias de sus fichas, sin recomendaciones personales ni diagnósticos.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los referentes y las fichas proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los referentes y las fichas proporcionados.",
            "error": "Las decisiones o relaciones contradicen los referentes y las fichas proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "d839e370-3925-51ae-a201-68e678d43779",
          "b76d0713-fff9-5c14-a8dd-5c186415a8d2"
        ],
        "pdfPages": [
          377,
          379
        ]
      },
      {
        "id": "camping-knots",
        "grade": 5,
        "label": "nudos y amarres de cabuyería",
        "match": "nudos?|nudo|cabuyeria|amarres",
        "relation": "la relación entre el nudo o amarre expresamente elegido y las condiciones de la ficha de cabuyería dada",
        "primaryPurpose": "PRODUCTION",
        "sourceRecordIds": [
          "77379d92-4dd7-5bb0-aa74-bddcf526abfa",
          "1fe42230-3fed-5e92-aee2-c711a6b07cee"
        ],
        "pdfPages": [
          377,
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Nudo y condiciones del modelo",
            "success": "Elabora el nudo o amarre expresamente elegido en el modelo de cabuyería según la ficha y condiciones supervisadas dadas, sin personas ni cargas y sin inventar instrucciones.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las relaciones y condiciones de la ficha proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las relaciones y condiciones de la ficha proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las relaciones y condiciones de la ficha proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "athletic-relay",
        "grade": 5,
        "label": "carrera de relevos adaptada",
        "match": "carrera de relevos|carreras? de relevo",
        "relation": "la relación entre orden, intercambios y señales de la carrera de relevos adaptada proporcionada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "cc05bc86-171b-58c1-911d-2fb4529e0541",
          "cd96df4a-9297-50d7-86ab-a95efc65f54f",
          "a3c83c09-cc5e-5452-9e8b-4b90b7d55482",
          "819564e0-6788-5e09-891e-dc7898d74a8d"
        ],
        "pdfPages": [
          377,
          378,
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Intercambios y señales del relevo",
            "success": "Ejecuta la carrera de relevos adaptada según los intercambios, señales y condiciones supervisadas proporcionadas con los apoyos permitidos.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a los intercambios y señales de la tarea proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a los intercambios y señales de la tarea proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con los intercambios y señales de la tarea proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado.",
            "variants": {
              "PLAN": {
                "id": "requested-evidence",
                "title": "Orden e intercambios previstos",
                "success": "Planifica la carrera de relevos adaptada relacionando el orden y los intercambios con las señales y condiciones ya proporcionadas, sin exigir ejecución ni asignar distancias.",
                "sufficient": "La relación principal se sustenta en las señales y condiciones proporcionadas; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las señales y condiciones proporcionadas.",
                "error": "Presenta relaciones incompatibles con las señales y condiciones proporcionadas.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ]
      },
      {
        "id": "athletic-hurdles",
        "grade": 5,
        "label": "técnica de carrera con vallas",
        "match": "carrera con vallas|carrera de vallas",
        "relation": "la relación entre las fases de la carrera con vallas y las evidencias del referente adaptado dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "cc05bc86-171b-58c1-911d-2fb4529e0541",
          "cd96df4a-9297-50d7-86ab-a95efc65f54f",
          "a3c83c09-cc5e-5452-9e8b-4b90b7d55482"
        ],
        "pdfPages": [
          377,
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Fase y evidencia del referente",
            "success": "Analiza la técnica de carrera con vallas relacionando sus fases con las evidencias del referente adaptado proporcionado, sin exigir ejecución ni diseñar alturas.",
            "sufficient": "La relación principal se sustenta en las fases y evidencias del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fases y evidencias del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las fases y evidencias del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "athletic-high-jump",
        "grade": 5,
        "label": "salto alto adaptado",
        "match": "salto alto",
        "relation": "la relación entre las fases del salto alto de la modalidad expresamente elegida y las condiciones del referente dado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "cc05bc86-171b-58c1-911d-2fb4529e0541",
          "a3c83c09-cc5e-5452-9e8b-4b90b7d55482",
          "2250d4bb-f502-5896-a352-f6638790ed34"
        ],
        "pdfPages": [
          377,
          378,
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Fases y apoyos del salto dado",
            "success": "Ejecuta el salto alto adaptado de la modalidad expresamente elegida según las señales y condiciones supervisadas proporcionadas con los apoyos permitidos, sin fijar alturas.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las señales y condiciones supervisadas proporcionadas.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y condiciones supervisadas proporcionadas.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y condiciones supervisadas proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "athletic-javelin",
        "grade": 5,
        "label": "referente del lanzamiento de jabalina",
        "match": "lanzamiento de jabalina",
        "relation": "la relación entre las fases del lanzamiento de jabalina y las evidencias del referente técnico proporcionado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "cc05bc86-171b-58c1-911d-2fb4529e0541",
          "cd96df4a-9297-50d7-86ab-a95efc65f54f",
          "a3c83c09-cc5e-5452-9e8b-4b90b7d55482"
        ],
        "pdfPages": [
          377,
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Fase y evidencia del lanzamiento",
            "success": "Analiza las fases del lanzamiento de jabalina relacionándolas con las evidencias del referente técnico proporcionado, sin exigir lanzar ni generar instrucciones operativas.",
            "sufficient": "La relación principal se sustenta en las fases y evidencias del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fases y evidencias del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las fases y evidencias del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "athletic-long-jump",
        "grade": 5,
        "label": "salto largo adaptado",
        "match": "salto largo",
        "relation": "la relación entre las fases del salto largo de la modalidad expresamente elegida y las evidencias del referente proporcionado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "2250d4bb-f502-5896-a352-f6638790ed34"
        ],
        "pdfPages": [
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Fase y apoyos del salto elegido",
            "success": "Analiza el salto largo de la modalidad expresamente elegida relacionando fases y apoyos con las evidencias del referente adaptado proporcionado, sin exigir ejecución.",
            "sufficient": "La relación principal se sustenta en las fases y apoyos del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fases y apoyos del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las fases y apoyos del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "baseball-biography",
        "grade": 5,
        "label": "aportes biográficos de atletas dominicanos de béisbol o softbol",
        "match": "aportes biograficos|elementos biograficos|atletas dominicanos",
        "relation": "la relación entre aportes, hechos biográficos y fuentes del deporte y ámbito expresamente asignados",
        "primaryPurpose": "PRESENTATION",
        "sourceRecordIds": [
          "4870637f-b6a7-5c7b-8788-5e671f29a3bc",
          "0f9712b6-c71c-5daa-90a4-bfaf991495d2"
        ],
        "pdfPages": [
          377,
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aportes y fuentes del ámbito dado",
            "success": "Presenta los aportes biográficos de atletas dominicanos del deporte y ámbito expresamente asignados relacionándolos con las evidencias de las fuentes proporcionadas, sin valorar prestigio personal.",
            "sufficient": "La relación principal se sustenta en las fuentes del ámbito proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fuentes del ámbito proporcionado.",
            "error": "Presenta relaciones incompatibles con las fuentes del ámbito proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "baseball-positions",
        "grade": 5,
        "label": "asignaciones numéricas de posiciones defensivas de béisbol",
        "match": "posiciones defensivas.*beisbol|asignaciones numericas",
        "relation": "la correspondencia entre las asignaciones numéricas de posiciones defensivas de béisbol y sus funciones y ubicaciones dadas",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "5fe6b02e-774b-5d25-949a-e4c66ffc87b1"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Número, ubicación y función defensiva",
            "success": "Explica las posiciones defensivas de béisbol relacionando sus asignaciones numéricas con las funciones y ubicaciones del referente proporcionado.",
            "sufficient": "La relación principal se sustenta en las asignaciones y funciones del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las asignaciones y funciones del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las asignaciones y funciones del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "baseball-pitcher",
        "grade": 5,
        "label": "tiro en recta entre box y home plate",
        "match": "box.*home plate|tiro en recta",
        "relation": "la relación entre dirección y referencia del tiro en recta entre box y home plate del ejemplo dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "ab824da6-73c3-5939-be4d-0c64c226d4c6"
        ],
        "pdfPages": [
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Dirección y evidencia del referente",
            "success": "Analiza el tiro en recta entre el box y el home plate relacionando dirección y evidencias del referente proporcionado, sin exigir ejecutar lanzamientos.",
            "sufficient": "La relación principal se sustenta en la dirección y evidencias del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en la dirección y evidencias del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con la dirección y evidencias del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "baseball-offensive-reference",
        "grade": 5,
        "label": "referente ofensivo de béisbol",
        "match": "agarre del bate|caja de bateo|zona de strikes",
        "relation": "la relación entre los aspectos ofensivos de béisbol expresamente elegidos y las señales del referente dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "8e5b705b-29cd-5f48-8a48-d2fded978602"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aspecto ofensivo y referencia",
            "success": "Analiza los aspectos ofensivos de béisbol expresamente elegidos relacionándolos con las señales y evidencias del referente proporcionado, sin exigir ejecución.",
            "sufficient": "La relación principal se sustenta en las señales y evidencias del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las señales y evidencias del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las señales y evidencias del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "baseball-double-play",
        "grade": 5,
        "label": "doble play adaptado de béisbol",
        "match": "doble play",
        "relation": "la relación entre orden, recepción, tiro y decisiones del doble play de la situación proporcionada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "8dd2d040-a859-5c9b-a4d3-bc1a729ac86b"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Orden y decisión del doble play",
            "success": "Ejecuta el doble play adaptado de béisbol relacionando recepción, tiro y decisiones con las señales y apoyos de la situación proporcionada.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las señales y decisiones de la situación proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y decisiones de la situación proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y decisiones de la situación proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado.",
            "variants": {
              "PLAN": {
                "id": "requested-evidence",
                "title": "Orden y decisiones previstos",
                "success": "Planifica el doble play adaptado de béisbol relacionando posiciones, orden y decisiones con el caso proporcionado, sin exigir ejecución.",
                "sufficient": "La relación principal se sustenta en las posiciones y condiciones del caso proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y condiciones del caso proporcionado.",
                "error": "Presenta relaciones incompatibles con las posiciones y condiciones del caso proporcionado.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ]
      },
      {
        "id": "baseball-game",
        "grade": 5,
        "label": "juego popular adaptado al béisbol",
        "match": "juega.*beisbol|juego popular adaptado.*beisbol|juego.*softbol",
        "relation": "la relación entre reglas y decisiones ofensivas y defensivas del juego popular o predeportivo de la variante expresamente dada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "528c4d66-8b11-588e-a7f1-b6ed5e983c55",
          "59d37b11-9020-572d-a130-d73cd6d15768",
          "66d34ecd-406f-5186-8a5e-1bf6d5c2ebe9",
          "68309b2a-3db6-5df6-ab13-909bbe463fe2"
        ],
        "pdfPages": [
          378,
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Reglas y decisiones del juego",
            "success": "Juega la situación adaptada de la variante de béisbol expresamente dada aplicando las reglas y decisiones ofensivas y defensivas proporcionadas con los apoyos acordados, sin evaluar ganar.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las reglas y decisiones del juego proporcionado.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las reglas y decisiones del juego proporcionado.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las reglas y decisiones del juego proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "baseball-tactics",
        "grade": 5,
        "label": "situación táctica de béisbol",
        "match": "situacion (?:tactica|defensiva|ofensiva).*beisbol|decisiones.*beisbol",
        "relation": "la relación entre alternativas, posiciones y decisión de la situación táctica de béisbol del caso dado",
        "primaryPurpose": "PROBLEM_SOLVING",
        "sourceRecordIds": [
          "59d37b11-9020-572d-a130-d73cd6d15768",
          "68309b2a-3db6-5df6-ab13-909bbe463fe2"
        ],
        "pdfPages": [
          378,
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y sustento del caso",
            "success": "Resuelve la situación táctica de béisbol del caso dado justificando la decisión según las alternativas y posiciones proporcionadas.",
            "sufficient": "La relación principal se sustenta en las alternativas y posiciones del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las alternativas y posiciones del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con las alternativas y posiciones del caso proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-endings-importance",
        "grade": 5,
        "label": "importancia del dominio de finales de ajedrez",
        "match": "importancia.*finales.*ajedrez",
        "relation": "la relación entre el dominio de los finales de ajedrez y las decisiones de las posiciones proporcionadas",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "cd03a545-8b1f-5889-9604-ed83b20bb24d"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Final y decisión del ejemplo",
            "success": "Explica la importancia del dominio de los finales de ajedrez mediante las decisiones y evidencias de las posiciones proporcionadas.",
            "sufficient": "La relación principal se sustenta en las posiciones y ejemplos proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y ejemplos proporcionados.",
            "error": "Presenta relaciones incompatibles con las posiciones y ejemplos proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-endings-classification",
        "grade": 5,
        "label": "clasificación de finales básicos y medios de ajedrez",
        "match": "clasifica.*finales.*ajedrez|clasificacion.*finales.*ajedrez|finales de ajedrez basicos y medios",
        "relation": "las diferencias entre finales básicos y medios de ajedrez de las posiciones y jugadas proporcionadas",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "9d9afa6d-b64b-5e4e-817d-0cf0a5c9ba58"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Tipo de final y evidencias",
            "success": "Clasifica los finales básicos y medios de ajedrez justificando sus diferencias con las piezas y jugadas de las posiciones proporcionadas.",
            "sufficient": "La relación principal se sustenta en las piezas y jugadas de las posiciones proporcionadas; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las piezas y jugadas de las posiciones proporcionadas.",
            "error": "Presenta relaciones incompatibles con las piezas y jugadas de las posiciones proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-ending-problem",
        "grade": 5,
        "label": "problemas de finales de ajedrez",
        "match": "problema.*final.*ajedrez|problema.*final de ajedrez",
        "relation": "la relación entre las piezas del final de ajedrez expresamente elegido y las jugadas justificadas de la posición dada",
        "primaryPurpose": "PROBLEM_SOLVING",
        "sourceRecordIds": [
          "d7ca6b0d-b323-51ca-bcde-697335e23ad5",
          "5ca8c9fd-bbdd-58df-945c-3e7476731958"
        ],
        "pdfPages": [
          378,
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugadas del final y justificación",
            "success": "Resuelve el problema del final de ajedrez expresamente elegido justificando las jugadas con las piezas, posición y reglas proporcionadas.",
            "sufficient": "La relación principal se sustenta en las piezas y posición proporcionadas; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las piezas y posición proporcionadas.",
            "error": "Presenta relaciones incompatibles con las piezas y posición proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-basic-ending",
        "grade": 5,
        "label": "partida con final básico de ajedrez",
        "match": "partida.*ajedrez.*final.*basico|final basico.*ajedrez",
        "relation": "la relación entre jugadas y decisiones del final básico de ajedrez de la partida proporcionada",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "b74e0d8a-f7d7-5626-baa3-2436df129b20",
          "ec610e8a-934f-5963-a30e-e4e02292b654"
        ],
        "pdfPages": [
          378,
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugadas y decisiones del final básico",
            "success": "Analiza la partida de ajedrez con final de nivel básico relacionando jugadas y decisiones con las evidencias de la posición proporcionada.",
            "sufficient": "La relación principal se sustenta en las jugadas y decisiones del final proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las jugadas y decisiones del final proporcionado.",
            "error": "Presenta relaciones incompatibles con las jugadas y decisiones del final proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-medium-ending",
        "grade": 5,
        "label": "partida con final medio de ajedrez",
        "match": "partida.*ajedrez.*final.*medio|final medio.*ajedrez",
        "relation": "la relación entre jugadas y decisiones del final medio de ajedrez de la partida proporcionada",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "912b4c33-2f2b-5cda-86f6-fa368b6f5246",
          "ac64ebef-e074-5c37-a49f-431161076ee6"
        ],
        "pdfPages": [
          378,
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugadas y decisiones del final medio",
            "success": "Analiza la partida de ajedrez con final de nivel medio relacionando jugadas y decisiones con las evidencias de la posición proporcionada.",
            "sufficient": "La relación principal se sustenta en las jugadas y decisiones del final proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las jugadas y decisiones del final proporcionado.",
            "error": "Presenta relaciones incompatibles con las jugadas y decisiones del final proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-ending-game",
        "grade": 5,
        "label": "partida de ajedrez con técnicas de finales",
        "match": "juega.*ajedrez.*finales|partida adaptada de ajedrez.*finales",
        "relation": "la relación entre las técnicas de finales expresamente dadas y las decisiones de la partida de ajedrez proporcionada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "bc209837-c00e-5107-b024-71f5549a56d8"
        ],
        "pdfPages": [
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y técnica del final",
            "success": "Juega la partida adaptada de ajedrez aplicando las técnicas de finales expresamente dadas según la posición y reglas proporcionadas, sin exigir ganar.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las técnicas y condiciones de la partida proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las técnicas y condiciones de la partida proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las técnicas y condiciones de la partida proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "martial-rules",
        "grade": 5,
        "label": "normas de conducta de artes marciales",
        "match": "normas.*artes marciales|artes marciales.*normas",
        "relation": "la relación entre acciones observables, normas de artes marciales y condiciones de la situación proporcionada",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "dadc26a1-bd70-5c64-9f56-0f1550f46737",
          "214b26bc-8dbe-5277-8e57-7a15d3bd8718",
          "639b9330-73ed-59bd-8191-6585c8bf0b06",
          "3cc3f2cd-f880-5da8-8ac1-516eae3d4016"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acción y norma de la situación",
            "success": "Analiza las normas de conducta de artes marciales relacionando acciones observables y reglas dadas con las condiciones de la situación cotidiana proporcionada.",
            "sufficient": "La relación principal se sustenta en las acciones y normas de la situación proporcionada; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las acciones y normas de la situación proporcionada.",
            "error": "Presenta relaciones incompatibles con las acciones y normas de la situación proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "martial-scoring",
        "grade": 5,
        "label": "sistema de puntuación de combate de artes marciales",
        "match": "sistema.*puntuacion.*combate|puntuacion.*artes marciales",
        "relation": "la correspondencia entre las decisiones del registro de combate de artes marciales y los valores y reglas de puntuación dados",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "ebea24b3-4bd7-5fad-b4f0-afd23a8f6f2c",
          "7f331799-a209-5884-867a-776788b45977",
          "08e35c1e-2b35-5d44-882f-61622c0e37e9"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y valor del sistema dado",
            "success": "Interpreta el sistema de puntuación de combate de artes marciales relacionando cada decisión del registro con los valores y reglas proporcionados, sin inventar otro sistema.",
            "sufficient": "La relación principal se sustenta en los valores y decisiones del registro proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los valores y decisiones del registro proporcionado.",
            "error": "Presenta relaciones incompatibles con los valores y decisiones del registro proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "martial-kata",
        "grade": 5,
        "label": "kata o poomsae básica adaptada",
        "match": "kata|poomsae",
        "relation": "la relación entre posiciones, secuencia y apoyos de la kata o poomsae expresamente elegida y el referente dado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "db4cdf8a-d46c-5605-96ac-14c8622b4cd7",
          "58847e8a-51a0-5f3a-ad2c-369c18f1b666",
          "f008f79a-12ed-57ac-9f38-98b6e4904970"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posición y secuencia elegida",
            "success": "Ejecuta la kata o poomsae básica expresamente elegida según las posiciones, secuencia y condiciones supervisadas proporcionadas con los apoyos permitidos, sin añadir maniobras.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las posiciones y condiciones supervisadas proporcionadas.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las posiciones y condiciones supervisadas proporcionadas.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las posiciones y condiciones supervisadas proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "martial-attacks",
        "grade": 5,
        "label": "combinación de ataques y contraataques de artes marciales",
        "match": "combinacion.*ataques.*contraataques",
        "relation": "la relación entre señales, secuencia y decisiones de la combinación marcial expresamente dada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "69cae1c2-585d-568c-8bd5-9b791ac59a33",
          "5778ff97-b7d9-5bfd-9dbb-a9c8e1de35d9"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Secuencia y señales de la simulación",
            "success": "Ejecuta la combinación de ataques y contraataques de artes marciales en la simulación supervisada según señales, secuencia y apoyos expresamente proporcionados, sin añadir golpes ni instrucciones nuevas.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las señales y condiciones de la simulación proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y condiciones de la simulación proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y condiciones de la simulación proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "martial-defense",
        "grade": 5,
        "label": "defensa personal de artes marciales",
        "match": "defensa personal.*artes marciales|artes marciales.*defensa personal",
        "relation": "la relación entre decisiones de defensa personal y las alternativas y condiciones del referente marcial dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "2429d504-6c4d-5151-8c54-7441974fe963",
          "1dbb95ac-807f-564c-b50d-ae7803da666c",
          "e91b3568-57f0-5106-b559-16becec06ef3"
        ],
        "pdfPages": [
          378
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y condiciones del referente",
            "success": "Analiza las decisiones de defensa personal de artes marciales del referente de agresión simulada según alternativas y condiciones proporcionadas, sin exigir ejecutar técnicas ni generar instrucciones operativas.",
            "sufficient": "La relación principal se sustenta en las decisiones y condiciones del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las decisiones y condiciones del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las decisiones y condiciones del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "fair-play-verification",
        "grade": 5,
        "label": "cumplimiento de reglas de juego limpio",
        "match": "juego limpio|turnos.*registro.*deportiv",
        "relation": "la correspondencia entre acciones del registro deportivo y reglas de juego limpio expresamente dadas",
        "primaryPurpose": "VERIFICATION",
        "sourceRecordIds": [
          "bbfc2f0f-9ffb-5700-a60c-110bcd2ce39e",
          "9be26b57-0bf2-5086-9090-863223c2dd7d",
          "12794c19-5a39-56a9-ba99-ac549da2e2fb"
        ],
        "pdfPages": [
          377,
          379
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acción y regla del registro",
            "success": "Verifica el cumplimiento de las reglas de juego limpio y turnos del registro deportivo proporcionado justificando cada marca con sus evidencias, sin inferir personalidad.",
            "sufficient": "La relación principal se sustenta en las acciones y reglas del registro proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las acciones y reglas del registro proporcionado.",
            "error": "Presenta relaciones incompatibles con las acciones y reglas del registro proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "hygiene-verification",
        "grade": 5,
        "label": "higiene acordada de materiales",
        "match": "higiene.*materiales",
        "relation": "la correspondencia entre las acciones de higiene de materiales expresamente acordadas y las evidencias del registro dado",
        "primaryPurpose": "VERIFICATION",
        "sourceRecordIds": [
          "34176f12-b609-5deb-94ed-8ac5b78ab2ca"
        ],
        "pdfPages": [
          377
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acción de higiene y evidencia",
            "success": "Verifica el cumplimiento de las acciones de higiene de materiales expresamente acordadas mediante las evidencias del registro proporcionado, sin solicitar hábitos privados.",
            "sufficient": "La relación principal se sustenta en las acciones y evidencias del registro proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las acciones y evidencias del registro proporcionado.",
            "error": "Presenta relaciones incompatibles con las acciones y evidencias del registro proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      }
    ],
    "policy": "REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1"
  },
  {
    "id": "educacion-fisica-comun-6",
    "grade": 6,
    "topics": [
      {
        "id": "physical-condition-explanation",
        "grade": 6,
        "label": "capacidades coordinativas y condicionales",
        "match": "capacidades (?:fisicas|coordinativas|condicionales)|(?:explica|analiza|compara).*(?:fuerza|resistencia|coordinacion|equilibrio|diferenciacion|reaccion|adaptacion|ritmo)",
        "relation": "la función de las capacidades coordinativas y condicionales expresamente elegidas en los ejemplos dados",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "98486c92-e206-5632-8844-d7a57ebc6d17",
          "57730434-18ae-5d8e-8986-1f3bd9554aeb",
          "6c8fdde7-7ff2-549a-bbc1-9ef4f96d1ea4"
        ],
        "pdfPages": [
          380
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Capacidades y acciones del ejemplo",
            "success": "Explica la función de las capacidades físicas expresamente elegidas mediante evidencias de los ejemplos adaptados dados, sin comparar cuerpos o personas.",
            "sufficient": "La relación principal se sustenta en los ejemplos adaptados proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los ejemplos adaptados proporcionados.",
            "error": "Presenta relaciones incompatibles con los ejemplos adaptados proporcionados."
          }
        ]
      },
      {
        "id": "circuit-plan",
        "grade": 6,
        "label": "organización de un circuito adaptado",
        "match": "circuito adaptado|estaciones?.*pausas?|pausas?.*estaciones?",
        "relation": "la relación entre estaciones, acciones, orden y pausas fijados en la ficha docente",
        "pdfPages": [
          380
        ],
        "sourceRecordIds": [
          "3f8b0ffc-3082-51e5-a104-66cecf6ea438"
        ],
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Plan de estaciones y pausas dadas",
            "success": "Planifica la organización del circuito adaptado relacionando estaciones, acciones y pausas ya fijadas en la ficha docente, sin añadir intensidad o duración nuevas.",
            "sufficient": "El plan relaciona las estaciones y pausas; una referencia secundaria al orden queda poco precisada.",
            "partial": "Identifica estaciones pertinentes, pero una relación de orden o pausa no corresponde a la ficha dada.",
            "error": "El plan modifica las condiciones proporcionadas o introduce dosis físicas no sustentadas en la ficha.",
            "variants": {
              "PERFORMANCE": {
                "title": "Estaciones y pausas del circuito dado",
                "success": "Ejecuta la secuencia de estaciones y acciones del circuito adaptado respetando las pausas y apoyos ya fijados en la ficha docente, sin añadir intensidad o duración nuevas.",
                "sufficient": "La secuencia de estaciones se reconoce; una transición secundaria pierde continuidad.",
                "partial": "Realiza acciones pertinentes, pero una transición o pausa no corresponde a la ficha dada.",
                "error": "Cambia las acciones o pausas de modo incompatible con las condiciones adaptadas proporcionadas."
              }
            }
          }
        ]
      },
      {
        "id": "flexibility-observation",
        "grade": 6,
        "label": "acciones de flexibilidad adaptadas",
        "match": "flexibilidad activa|flexibilidad pasiva|acciones? de flexibilidad",
        "relation": "la relación entre las acciones de flexibilidad elegidas y las condiciones adaptadas del referente",
        "pdfPages": [
          380
        ],
        "sourceRecordIds": [
          "16a517a9-50ae-5667-90ca-8ad80450ec9c"
        ],
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Cumplimiento de acciones de flexibilidad",
            "success": "Identifica con evidencias si el referente cumple las acciones de flexibilidad expresamente adaptadas en la ficha docente, sin medir amplitud corporal ni añadir maniobras.",
            "sufficient": "La verificación se sustenta; una marca secundaria queda poco clara sin cambiar su resultado principal.",
            "partial": "Identifica acciones pertinentes, pero una marca no permite determinar si cumple la condición dada.",
            "error": "Atribuye un cumplimiento incompatible con el referente o lo sustituye por un juicio de amplitud o capacidad natural.",
            "variants": {
              "PERFORMANCE": {
                "title": "Acciones de flexibilidad adaptadas",
                "success": "Ejecuta las acciones de flexibilidad expresamente adaptadas en la ficha docente según las señales y apoyos acordados, sin puntuar amplitud corporal.",
                "sufficient": "Las acciones y sus señales se reconocen; un ajuste secundario pierde continuidad.",
                "partial": "Presenta acciones pertinentes, pero una respuesta no corresponde a la señal o adaptación acordadas.",
                "error": "Las acciones contradicen las condiciones adaptadas dadas o no permiten reconocer la secuencia solicitada."
              }
            }
          }
        ]
      },
      {
        "id": "motor-variation",
        "grade": 6,
        "label": "variaciones de dirección y velocidad",
        "match": "secuencia motriz|(?:combina|variacion|variando).*(?:desplazamientos|giros|direccion|sentido)|centro de gravedad",
        "relation": "la relación entre cambios motrices solicitados, señales y apoyos de la secuencia adaptada",
        "pdfPages": [
          380
        ],
        "sourceRecordIds": [
          "e7d71979-6025-548e-a4b6-0b4c62324b4f"
        ],
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Respuestas a las señales motrices",
            "success": "Ejecuta los cambios de dirección y velocidad expresamente dados respondiendo a las señales y apoyos acordados de la secuencia adaptada.",
            "sufficient": "Los cambios y sus señales se reconocen; un ajuste secundario pierde continuidad sin romper la secuencia.",
            "partial": "Presenta respuestas pertinentes, pero un cambio no corresponde a la dirección o velocidad señaladas.",
            "error": "Las respuestas contradicen las señales dadas o impiden reconocer la secuencia motriz solicitada."
          }
        ]
      },
      {
        "id": "equilibrium-observation",
        "grade": 6,
        "label": "equilibrio y base de sustentación",
        "match": "equilibrio.*(?:base|referente)|base de sustentacion",
        "relation": "la relación entre base de sustentación, apoyos, plano y equilibrio del referente dado",
        "pdfPages": [
          380
        ],
        "sourceRecordIds": [
          "64492bec-47a2-5f3e-b5d7-01affd508fc7"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Base, apoyos y equilibrio del referente",
            "success": "Explica el equilibrio del referente relacionando base de sustentación, apoyos y plano expresamente señalados con evidencias de la ficha proporcionada.",
            "sufficient": "Las relaciones principales se sustentan; una referencia espacial secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación entre apoyo y equilibrio carece de sustento.",
            "error": "Atribuye al referente apoyos o efectos incompatibles con sus datos o sustituye el análisis por una maniobra no solicitada."
          }
        ]
      },
      {
        "id": "spatial-orientation",
        "grade": 6,
        "label": "orientación espacial del trayecto adaptado",
        "match": "orientacion espacial|objetos.*puntos cardinales",
        "relation": "la relación entre objetos, lugares y puntos cardinales expresamente dados y las decisiones del trayecto adaptado",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "009b9224-27d2-56c9-87ac-6f4c06fae944"
        ],
        "pdfPages": [
          380
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias y decisiones de orientación",
            "success": "Realiza la orientación espacial del trayecto adaptado siguiendo los objetos y puntos cardinales dados según las señales y apoyos proporcionados.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las referencias y condiciones del trayecto proporcionado.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las referencias y condiciones del trayecto proporcionado.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las referencias y condiciones del trayecto proporcionado.",
            "variants": {
              "PLAN": {
                "id": "requested-evidence",
                "title": "Referencias y orden previstos",
                "success": "Planifica la orientación espacial del trayecto adaptado relacionando los objetos y puntos cardinales dados con el orden previsto, sin exigir realizar el recorrido.",
                "sufficient": "La relación principal se sustenta en las referencias del trayecto proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las referencias del trayecto proporcionado.",
                "error": "Presenta relaciones incompatibles con las referencias del trayecto proporcionado."
              }
            }
          }
        ]
      },
      {
        "id": "compass-orientation",
        "grade": 6,
        "label": "orientación con brújula",
        "match": "orientacion.*brujula|brujula.*(?:referencias|orientacion)",
        "relation": "la relación de la brújula con los puntos cardinales y referencias del sistema de orientación proporcionado",
        "sourceRecordIds": [
          "009b9224-27d2-56c9-87ac-6f4c06fae944"
        ],
        "pdfPages": [
          380
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Brújula, referencias y decisiones",
            "success": "Explica las decisiones de orientación con brújula del referente relacionando puntos cardinales y referencias con las condiciones proporcionadas.",
            "sufficient": "La relación principal de orientación con brújula se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de orientación con brújula, pero una relación no se sustenta en el sistema de referencia proporcionado.",
            "error": "Atribuye a orientación con brújula relaciones incompatibles con el sistema de referencia proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento.",
            "variants": {
              "PERFORMANCE": {
                "id": "requested-evidence",
                "title": "Referencias y decisiones de brújula",
                "success": "Realiza la orientación con la brújula expresamente dada del trayecto adaptado siguiendo los puntos cardinales y referencias proporcionadas con los apoyos permitidos.",
                "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las referencias y condiciones del trayecto proporcionado.",
                "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las referencias y condiciones del trayecto proporcionado.",
                "error": "Sustituye las acciones solicitadas por otras incompatibles con las referencias y condiciones del trayecto proporcionado.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ]
      },
      {
        "id": "gps-orientation",
        "grade": 6,
        "label": "orientación GPS",
        "match": "orientacion.*gps|gps.*(?:referencias|orientacion)",
        "relation": "la relación entre las referencias GPS expresamente dadas y las decisiones del trayecto",
        "sourceRecordIds": [
          "009b9224-27d2-56c9-87ac-6f4c06fae944"
        ],
        "pdfPages": [
          380
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias GPS del registro dado",
            "success": "Analiza las referencias GPS del registro simulado relacionándolas con las decisiones del trayecto proporcionado, sin solicitar ubicación personal.",
            "sufficient": "La relación principal de orientación GPS se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de orientación GPS, pero una relación no se sustenta en las referencias del registro proporcionado.",
            "error": "Atribuye a orientación GPS relaciones incompatibles con las referencias del registro proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "care-frequency",
        "grade": 6,
        "label": "cuidado observable de materiales y espacio",
        "match": "cuidado de materiales|cuidado.*espacio|frecuencia.*materiales.*espacio",
        "relation": "la relación entre acciones de cuidado de materiales y espacio y las condiciones expresamente trabajadas",
        "pdfPages": [
          381
        ],
        "sourceRecordIds": [
          "fae1a451-1189-534d-b8dc-8a6d4af7dba0"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones de cuidado observadas",
            "success": "Cumple las acciones concretas de cuidado de materiales y del espacio acordadas en todas las oportunidades observadas.",
            "sufficient": "Cumple las acciones de cuidado acordadas en casi todas las oportunidades observadas.",
            "partial": "Cumple las acciones de cuidado acordadas en algunas oportunidades observadas.",
            "error": "Cumple las acciones de cuidado acordadas en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "tactical-cooperation",
        "grade": 6,
        "label": "colaboración en soluciones técnico tácticas",
        "match": "solucion(?:es)?.*acuerdos? tecnicos?|acuerdos? tecnicos?.*solucion(?:es)?|cooperacion tecnico tactica|frecuencia.*propuestas.*acuerdos tecnicos",
        "relation": "la relación entre propuestas, acuerdos concretos y solución técnica de la tarea colectiva trabajada",
        "pdfPages": [
          380,
          381
        ],
        "sourceRecordIds": [
          "53b4167c-8e38-5163-8499-0dd703be91bc",
          "5df10925-c8f0-5804-978b-47415a4b1618"
        ],
        "primaryPurpose": "OBSERVATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aportes y acuerdos técnicos observados",
            "success": "Aporta propuestas pertinentes y cumple los acuerdos técnicos de la tarea colectiva dada en todas las oportunidades observadas, sin puntuar personalidad.",
            "sufficient": "Aporta propuestas y cumple acuerdos en casi todas las oportunidades observadas.",
            "partial": "Aporta propuestas y cumple acuerdos en algunas oportunidades observadas.",
            "error": "Aporta propuestas y cumple acuerdos en pocas oportunidades observadas."
          }
        ]
      },
      {
        "id": "motor-progress-record",
        "grade": 6,
        "label": "análisis de progresión motriz documentada",
        "match": "progresion motriz|registro.*dos momentos",
        "relation": "la relación entre acciones adaptadas, condiciones y cambios documentados en dos momentos del registro dado",
        "pdfPages": [
          381,
          382
        ],
        "sourceRecordIds": [
          "134a9f12-127f-5a7c-8e8f-2885d2742795",
          "0406b607-132c-5933-843d-f70077c26549",
          "9e9a2e87-9bb6-54e8-a566-149cdb9e41eb"
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Progresión según acciones y condiciones",
            "success": "Analiza la progresión motriz del registro proporcionado relacionando los cambios documentados con las acciones y condiciones dadas, sin comparar cuerpos ni capacidad natural.",
            "sufficient": "Los cambios principales se sustentan; una referencia secundaria a las condiciones queda poco precisada.",
            "partial": "Identifica datos pertinentes, pero una conclusión de progresión no se vincula con acciones o condiciones comparables.",
            "error": "Atribuye al registro mejoras o causas no acreditadas por sus datos o sustituye el análisis por un ranking de capacidad natural."
          }
        ]
      },
      {
        "id": "wellbeing-reference",
        "grade": 6,
        "label": "efectos de actividad física sobre salud y bienestar",
        "match": "(?:efectos|importancia).*actividad fisica.*(?:salud|bienestar)|(?:salud|bienestar).*(?:yoga|pilates|aerobicos|zumba|crossfit|step|steep|thai chi|tai chi)|imagen corporal|relacion.*actividad fisica.*bienestar",
        "relation": "la relación entre actividad física, salud y bienestar en los referentes proporcionados",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Efectos y evidencias del referente",
            "success": "Analiza los efectos de la actividad física sobre salud y bienestar relacionando acciones y condiciones de los referentes proporcionados con las evidencias de sus fichas, sin recomendaciones personales ni diagnósticos.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los referentes y las fichas proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los referentes y las fichas proporcionados.",
            "error": "Las decisiones o relaciones contradicen los referentes y las fichas proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "0fece179-5327-54b5-8736-da6521f0e092",
          "a2a5a296-9950-5cbb-806c-a72a9e2c16ae",
          "ec8a26da-821f-5d4f-918b-68334d5a1e7f"
        ],
        "pdfPages": [
          380,
          382
        ]
      },
      {
        "id": "fair-play-verification",
        "grade": 6,
        "label": "cumplimiento de reglas de juego limpio",
        "match": "juego limpio|turnos.*registro.*deportiv",
        "relation": "la correspondencia entre acciones del registro deportivo y reglas de juego limpio expresamente dadas",
        "primaryPurpose": "VERIFICATION",
        "sourceRecordIds": [
          "d00f3ebb-555b-5a30-8a5c-93112e76dda1",
          "89d624ad-7e1f-5f40-ad0f-aa9ad9fac73b"
        ],
        "pdfPages": [
          380
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acción y regla del registro",
            "success": "Verifica el cumplimiento de las reglas de juego limpio y turnos del registro deportivo proporcionado justificando cada marca con sus evidencias, sin inferir personalidad.",
            "sufficient": "La relación principal se sustenta en las acciones y reglas del registro proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las acciones y reglas del registro proporcionado.",
            "error": "Presenta relaciones incompatibles con las acciones y reglas del registro proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "hygiene-verification",
        "grade": 6,
        "label": "higiene acordada de materiales",
        "match": "higiene.*materiales",
        "relation": "la correspondencia entre las acciones de higiene de materiales expresamente acordadas y las evidencias del registro dado",
        "primaryPurpose": "VERIFICATION",
        "sourceRecordIds": [
          "284d8c04-a862-5770-b951-417e39d50798"
        ],
        "pdfPages": [
          380
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acción de higiene y evidencia",
            "success": "Verifica el cumplimiento de las acciones de higiene de materiales expresamente acordadas mediante las evidencias del registro proporcionado, sin solicitar hábitos privados.",
            "sufficient": "La relación principal se sustenta en las acciones y evidencias del registro proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las acciones y evidencias del registro proporcionado.",
            "error": "Presenta relaciones incompatibles con las acciones y evidencias del registro proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "continuous-running",
        "grade": 6,
        "label": "carrera continua adaptada",
        "match": "carrera continua|carreras continuas",
        "relation": "la relación entre acciones, señales y condiciones de la carrera continua adaptada proporcionada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acciones y condiciones de la carrera continua",
            "success": "Corre la carrera continua adaptada siguiendo las señales, pausas y condiciones supervisadas ya fijadas en la ficha docente, con los apoyos permitidos sin añadir duración o intensidad nuevas.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y condiciones adaptadas proporcionadas pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y condiciones adaptadas proporcionadas.",
            "error": "Las acciones contradicen las señales y condiciones adaptadas proporcionadas o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "da186a76-ffa9-5bc2-b66f-83760c658f82"
        ],
        "pdfPages": [
          380
        ]
      },
      {
        "id": "orientation-race",
        "grade": 6,
        "label": "carrera de orientación adaptada",
        "match": "(?:recorre|planifica|plan|juega).*carrera de orientacion",
        "relation": "la relación entre mapa, balizas, tarjetas y decisiones de la carrera de orientación adaptada solicitada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Referencias y decisiones del recorrido",
            "success": "Recorre la carrera de orientación adaptada de la simulación supervisada siguiendo el mapa, las balizas y las tarjetas expresamente dados con los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las referencias y condiciones supervisadas proporcionadas pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las referencias y condiciones supervisadas proporcionadas.",
            "error": "Las acciones contradicen las referencias y condiciones supervisadas proporcionadas o impiden reconocer el desempeño solicitado.",
            "plan": {
              "id": "requested-evidence",
              "title": "Mapa y decisiones previstas",
              "success": "Planifica la carrera de orientación adaptada del caso proporcionado relacionando mapa, balizas, tarjetas y acuerdos dados, sin exigir realizar el recorrido todavía.",
              "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las referencias y condiciones del caso proporcionado queda poco precisada.",
              "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las referencias y condiciones del caso proporcionado.",
              "error": "Las decisiones o relaciones contradicen las referencias y condiciones del caso proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
            }
          }
        ],
        "sourceRecordIds": [
          "acb80eed-10e9-5f71-b22c-a98f452a4875",
          "784d8a98-3c0f-5a21-94a9-b49a8bb06308",
          "fc1d038d-6f9f-59fb-acfe-6d1653ff2b50",
          "b24c9446-a573-5fe9-9e62-6d7c7d58bccd"
        ],
        "pdfPages": [
          380,
          381,
          382
        ],
        "excludeWhen": "historia|historicos|concepto|reglas"
      },
      {
        "id": "orientation-rules",
        "grade": 6,
        "label": "concepto y reglas de carrera de orientación",
        "match": "(?:concepto|reglas).*carrera de orientacion|carrera de orientacion.*(?:concepto|reglas)",
        "relation": "el concepto de carrera de orientación y las funciones de las reglas expresamente trabajadas",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Funciones de las reglas de orientación",
            "success": "Explica el concepto y las reglas de la carrera de orientación relacionando sus funciones con los ejemplos proporcionados, sin exigir recorrer un trayecto.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los ejemplos y las reglas proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los ejemplos y las reglas proporcionados.",
            "error": "Las decisiones o relaciones contradicen los ejemplos y las reglas proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento.",
            "variants": {
              "VERIFICATION": {
                "id": "requested-evidence",
                "title": "Decisión y regla del registro",
                "success": "Verifica si las decisiones de la carrera de orientación del registro dado cumplen las reglas proporcionadas justificando cada marca con sus evidencias.",
                "sufficient": "La relación principal se sustenta en las reglas y decisiones del registro proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las reglas y decisiones del registro proporcionado.",
                "error": "Presenta relaciones incompatibles con las reglas y decisiones del registro proporcionado.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ],
        "sourceRecordIds": [
          "b24c9446-a573-5fe9-9e62-6d7c7d58bccd",
          "5e9ae1b9-bb82-54e9-af43-80b2a8a81098"
        ],
        "pdfPages": [
          382
        ]
      },
      {
        "id": "football-history",
        "grade": 6,
        "label": "historia de fútbol",
        "match": "(?:historia|hechos historicos|personajes).*(?:futbol|futsal)",
        "relation": "la relación entre hechos, personajes, fechas y fuentes de la variante y ámbito históricos de fútbol asignados",
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y fuentes de la variante elegida",
            "success": "Presenta los hechos históricos de la variante de fútbol expresamente asignada relacionando personajes, fechas y evidencias de las fuentes del ámbito dado.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los hechos, fechas y fuentes del ámbito proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los hechos, fechas y fuentes del ámbito proporcionado.",
            "error": "Las decisiones o relaciones contradicen los hechos, fechas y fuentes del ámbito proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento.",
            "variants": {
              "RESEARCH": {
                "id": "requested-evidence",
                "title": "Historia y fuentes de la modalidad dada",
                "success": "Investiga la historia de la modalidad de fútbol expresamente dada del ámbito asignado relacionando hechos y fechas con las evidencias de las fuentes proporcionadas.",
                "sufficient": "La relación principal se sustenta en las fuentes del ámbito proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fuentes del ámbito proporcionado.",
                "error": "Presenta relaciones incompatibles con las fuentes del ámbito proporcionado.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ],
        "sourceRecordIds": [
          "67813de3-73c7-5e74-bb08-cd988f46da19",
          "8343dea3-0644-5484-8561-55af5c219041",
          "bc645420-c508-50c5-b555-7d84f844f7e9",
          "94727fee-d90a-5108-9dbd-91f4282daabe",
          "e076710d-f299-5289-a620-836efad387eb"
        ],
        "pdfPages": [
          380,
          381,
          382
        ],
        "excludeWhen": "arena"
      },
      {
        "id": "football-game",
        "grade": 6,
        "label": "juego adaptado de fútbol",
        "match": "juega.*(?:futbol|futsal)|juego adaptado de futbol",
        "relation": "la relación entre reglas, decisiones técnico tácticas y apoyos del juego adaptado de fútbol elegido",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones técnico tácticas del juego",
            "success": "Juega la situación adaptada de la variante de fútbol elegida aplicando las reglas y decisiones técnico tácticas expresamente proporcionadas con los apoyos acordados, sin evaluar ganar.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las reglas y condiciones del juego proporcionado pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las reglas y condiciones del juego proporcionado.",
            "error": "Las acciones contradicen las reglas y condiciones del juego proporcionado o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "9174de56-cea4-5b2b-b221-93ffc51b81fd",
          "2f79c8fe-4ef0-5be2-8234-dd396f3bc0e2",
          "d31d83ac-8126-5d94-b681-5b1fd6cd3618"
        ],
        "pdfPages": [
          381,
          380,
          382
        ],
        "excludeWhen": "arena|cascabeles"
      },
      {
        "id": "football-rules",
        "grade": 6,
        "label": "reglas de fútbol",
        "match": "(?:reglas|reglamento).*futbol|futbol.*(?:reglas|reglamento)|futsal.*reglas|(?:reglas|reglamento).*futsal",
        "relation": "las funciones y condiciones de las reglas de la variante de fútbol expresamente elegida",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Funciones y condiciones de las reglas",
            "success": "Explica las reglas de la variante de fútbol expresamente elegida relacionando sus funciones con los ejemplos proporcionados.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los ejemplos y reglas proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los ejemplos y reglas proporcionados.",
            "error": "Las decisiones o relaciones contradicen los ejemplos y reglas proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento.",
            "variants": {
              "VERIFICATION": {
                "id": "requested-evidence",
                "title": "Decisión y regla de la modalidad dada",
                "success": "Verifica si las decisiones del registro de la modalidad de fútbol expresamente dada cumplen las reglas proporcionadas justificando cada marca con sus evidencias.",
                "sufficient": "La relación principal se sustenta en las reglas y decisiones del registro proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las reglas y decisiones del registro proporcionado.",
                "error": "Presenta relaciones incompatibles con las reglas y decisiones del registro proporcionado.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ],
        "sourceRecordIds": [
          "5e9ae1b9-bb82-54e9-af43-80b2a8a81098"
        ],
        "pdfPages": [
          382
        ],
        "excludeWhen": "juega|ataque|defensa|adaptaciones|cascabeles"
      },
      {
        "id": "football-adaptation",
        "grade": 6,
        "label": "adaptaciones de fútbol con cascabeles",
        "match": "adaptaciones.*futbol.*cascabeles|futbol con cascabeles.*adaptaciones",
        "relation": "la relación entre recursos, condiciones de participación y adaptaciones del fútbol con cascabeles solicitadas",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Recursos y participación con cascabeles",
            "success": "Analiza las adaptaciones del fútbol con cascabeles relacionando recursos y condiciones de participación del caso proporcionado con las evidencias dadas, sin inferir diagnósticos ni penalizar apoyos.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con los recursos y condiciones de participación proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en los recursos y condiciones de participación proporcionados.",
            "error": "Las decisiones o relaciones contradicen los recursos y condiciones de participación proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "9c714105-6f57-5c02-8dc1-51fe6a2574b5",
          "d31d83ac-8126-5d94-b681-5b1fd6cd3618"
        ],
        "pdfPages": [
          380,
          382
        ]
      },
      {
        "id": "volleyball-history",
        "grade": 6,
        "label": "historia del voleibol",
        "match": "(?:historia|hechos|personajes).*voleibol|voleibol.*(?:historia|historicos)",
        "relation": "la relación entre hechos, personajes, fechas y fuentes del ámbito histórico de la variante de voleibol asignada",
        "primaryPurpose": "PRESENTATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hechos y fuentes del voleibol",
            "success": "Presenta los hechos y personajes de la variante de voleibol expresamente asignada relacionando fechas y evidencias de las fuentes del ámbito dado.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las fechas y fuentes del ámbito proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las fechas y fuentes del ámbito proporcionado.",
            "error": "Las decisiones o relaciones contradicen las fechas y fuentes del ámbito proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "ce7385bb-3bb2-5e73-9e9f-31b95bc83f89",
          "e076710d-f299-5289-a620-836efad387eb"
        ],
        "pdfPages": [
          381,
          382
        ]
      },
      {
        "id": "volleyball-rules",
        "grade": 6,
        "label": "reglas de voleibol",
        "match": "(?:reglas|reglamento).*voleibol|voleibol.*(?:reglas|reglamento)",
        "relation": "las funciones y condiciones de las reglas de la variante de voleibol expresamente elegida",
        "primaryPurpose": "VERIFICATION",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones y reglas de voleibol",
            "success": "Verifica si las decisiones del registro proporcionado de la variante de voleibol elegida cumplen las reglas dadas, justificando cada marca con sus evidencias.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las reglas y evidencias del registro proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las reglas y evidencias del registro proporcionado.",
            "error": "Las decisiones o relaciones contradicen las reglas y evidencias del registro proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "c322ccb3-26f6-5215-9ee3-ee56255f6ccf",
          "d4ec4c6e-55fe-52f3-be22-b95d3e2219ea",
          "1a5480db-c7a2-5b90-bb3e-af37e95bf924",
          "5e9ae1b9-bb82-54e9-af43-80b2a8a81098"
        ],
        "pdfPages": [
          381,
          382
        ],
        "excludeWhen": "adaptaciones|elementos tecnicos"
      },
      {
        "id": "volleyball-pass",
        "grade": 6,
        "label": "pase de voleibol expresamente elegido",
        "match": "(?:pase|toque).*(?:antebrazos|manos altas)|(?:antebrazos|manos altas).*voleibol",
        "relation": "la relación entre función, posición y señales del pase de voleibol expresamente elegido",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Pase elegido y señales dadas",
            "success": "Ejecuta el pase de voleibol expresamente elegido según las señales y condiciones supervisadas dadas con los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y condiciones del pase elegido pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y condiciones del pase elegido.",
            "error": "Las acciones contradicen las señales y condiciones del pase elegido o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "9fc6d399-d251-5d06-8a0f-1d5cab807244"
        ],
        "pdfPages": [
          381
        ]
      },
      {
        "id": "volleyball-attack",
        "grade": 6,
        "label": "acomodada y ataque de voleibol",
        "match": "(?:acomodada|ataque|remate).*voleibol|voleibol.*(?:acomodada|ataque|remate)",
        "relation": "la relación entre posición, señales, acomodada y ataque de voleibol expresamente solicitados",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Acomodada y función ofensiva",
            "success": "Analiza la acomodada y el remate del referente de voleibol relacionando posición, señales y función ofensiva con las evidencias dadas, sin exigir ejecutar un salto.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las posiciones y señales del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las posiciones y señales del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen las posiciones y señales del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "9fc6d399-d251-5d06-8a0f-1d5cab807244"
        ],
        "pdfPages": [
          381
        ],
        "excludeWhen": "recepciona|recepcion|bloqueo|saque de abajo|juega|defensa"
      },
      {
        "id": "volleyball-reception",
        "grade": 6,
        "label": "recepción adaptada de voleibol",
        "match": "recepciona.*voleibol|recepcion.*voleibol|voleibol.*recepcion",
        "relation": "la relación entre posición, señales y decisiones de la recepción de voleibol solicitada",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Recepción elegida y señales",
            "success": "Recepciona el balón de voleibol de la situación expresamente elegida según la posición, señales y condiciones supervisadas dadas, con los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y condiciones de la recepción elegida pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y condiciones de la recepción elegida.",
            "error": "Las acciones contradicen las señales y condiciones de la recepción elegida o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "9060bf0b-c197-51aa-ad29-2ff37d3d4fe1"
        ],
        "pdfPages": [
          381
        ],
        "excludeWhen": "juega|bloqueo"
      },
      {
        "id": "volleyball-block",
        "grade": 6,
        "label": "bloqueo de voleibol",
        "match": "bloqueo.*voleibol|voleibol.*bloqueo",
        "relation": "la relación entre posición, decisiones y función defensiva del bloqueo de voleibol",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Bloqueo y función defensiva",
            "success": "Analiza el bloqueo del referente de voleibol relacionando posición, decisiones y condiciones de defensa con las evidencias proporcionadas, sin exigir ejecutarlo.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las posiciones y condiciones del referente proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las posiciones y condiciones del referente proporcionado.",
            "error": "Las decisiones o relaciones contradicen las posiciones y condiciones del referente proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "9060bf0b-c197-51aa-ad29-2ff37d3d4fe1"
        ],
        "pdfPages": [
          381
        ]
      },
      {
        "id": "volleyball-defence",
        "grade": 6,
        "label": "plan de defensa de voleibol",
        "match": "(?:planifica|plan|decisiones de defensa).*voleibol|voleibol.*plan de defensa",
        "relation": "la relación entre posiciones, apoyos y decisiones defensivas previstas para la situación de voleibol dada",
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posiciones y decisiones previstas",
            "success": "Planifica las decisiones de defensa de voleibol para la situación adaptada dada relacionando posiciones y apoyos con las reglas proporcionadas, sin exigir jugar todavía.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las posiciones, apoyos y reglas proporcionados queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las posiciones, apoyos y reglas proporcionados.",
            "error": "Las decisiones o relaciones contradicen las posiciones, apoyos y reglas proporcionados o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "2c80741a-e73c-5c42-bef9-def093c5a0f0",
          "9060bf0b-c197-51aa-ad29-2ff37d3d4fe1",
          "ba7ff818-6e90-5e54-a2f7-2c9ad2fc4780"
        ],
        "pdfPages": [
          381,
          382
        ]
      },
      {
        "id": "volleyball-game",
        "grade": 6,
        "label": "juego adaptado de voleibol",
        "match": "juega.*voleibol|voleibol.*(?:4 contra 4|6 contra 6)",
        "relation": "la relación entre reglas, decisiones y acciones expresamente solicitadas del juego adaptado de voleibol",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisiones del juego adaptado",
            "success": "Juega la variante adaptada de voleibol expresamente elegida en cancha modificada aplicando las reglas, acciones y apoyos proporcionados, sin evaluar ganar.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las reglas y condiciones del juego proporcionado pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las reglas y condiciones del juego proporcionado.",
            "error": "Las acciones contradicen las reglas y condiciones del juego proporcionado o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "1c53a4ed-5497-5970-ae7c-eb289dcf1897",
          "1d9cf6b8-cc99-5621-b3d8-26c8387333ce",
          "d31d83ac-8126-5d94-b681-5b1fd6cd3618"
        ],
        "pdfPages": [
          381,
          382
        ]
      },
      {
        "id": "volleyball-serve",
        "grade": 6,
        "label": "saque de voleibol elegido",
        "match": "(?:ejecuta|analiza|explica).*saque.*voleibol|saque de abajo.*voleibol",
        "relation": "la relación entre señales, función y condiciones del saque de voleibol expresamente elegido",
        "primaryPurpose": "PERFORMANCE",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Saque y señales de la tarea",
            "success": "Ejecuta el saque de voleibol expresamente elegido según las señales y condiciones supervisadas dadas, utilizando los apoyos permitidos.",
            "sufficient": "Las acciones solicitadas se reconocen; una respuesta secundaria a las señales y condiciones del saque elegido pierde continuidad sin romper la secuencia.",
            "partial": "Realiza acciones pertinentes, pero una respuesta no corresponde a las señales y condiciones del saque elegido.",
            "error": "Las acciones contradicen las señales y condiciones del saque elegido o impiden reconocer el desempeño solicitado."
          }
        ],
        "sourceRecordIds": [
          "1d9cf6b8-cc99-5621-b3d8-26c8387333ce"
        ],
        "pdfPages": [
          381
        ],
        "excludeWhen": "juega|recepciona|recepcion"
      },
      {
        "id": "chess-repertoire",
        "grade": 6,
        "label": "repertorio de aperturas de ajedrez",
        "match": "repertorio.*aperturas.*ajedrez|ajedrez.*repertorio",
        "relation": "la relación entre aperturas elegidas y fortalezas, restricciones y necesidades de las posiciones de ajedrez del caso dado",
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Repertorio y necesidades de las posiciones",
            "success": "Selecciona el repertorio de aperturas de ajedrez del caso proporcionado justificándolo con las fortalezas, restricciones y necesidades de las posiciones dadas, sin inferir inteligencia o personalidad.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las fortalezas y restricciones de las posiciones proporcionadas queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las fortalezas y restricciones de las posiciones proporcionadas.",
            "error": "Las decisiones o relaciones contradicen las fortalezas y restricciones de las posiciones proporcionadas o sustituyen el desempeño solicitado por una afirmación sin sustento.",
            "variants": {
              "PLAN": {
                "id": "requested-evidence",
                "title": "Repertorio y decisiones previstas",
                "success": "Planifica el repertorio de aperturas de ajedrez del caso relacionando fortalezas y debilidades documentadas con las alternativas proporcionadas, sin exigir jugar.",
                "sufficient": "La relación principal se sustenta en las alternativas y condiciones del caso proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las alternativas y condiciones del caso proporcionado.",
                "error": "Presenta relaciones incompatibles con las alternativas y condiciones del caso proporcionado.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ],
        "sourceRecordIds": [
          "8c391b8a-4924-5837-8039-35a3ee6a72fe"
        ],
        "pdfPages": [
          382
        ]
      },
      {
        "id": "racket-tactics",
        "grade": 6,
        "label": "plan táctico del deporte de raqueta elegido",
        "match": "(?:planifica|plan tactico|ataque y defensa).*(?:badminton|tenis|raqueta)",
        "relation": "la relación entre alternativas y reglas que sustentan las decisiones tácticas previstas del deporte de raqueta elegido",
        "primaryPurpose": "PLAN",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Alternativas y decisiones tácticas previstas",
            "success": "Planifica las decisiones de ataque y defensa del deporte de raqueta elegido para el caso adaptado proporcionado relacionando alternativas y reglas dadas, sin exigir ejecutar un partido.",
            "sufficient": "El desempeño principal solicitado se reconoce; una relación secundaria con las alternativas y reglas del caso proporcionado queda poco precisada.",
            "partial": "Presenta elementos pertinentes, pero una decisión o relación no se sustenta en las alternativas y reglas del caso proporcionado.",
            "error": "Las decisiones o relaciones contradicen las alternativas y reglas del caso proporcionado o sustituyen el desempeño solicitado por una afirmación sin sustento."
          }
        ],
        "sourceRecordIds": [
          "d70a01cb-39e1-5e3f-9eeb-3ec8727b2584"
        ],
        "pdfPages": [
          382
        ]
      },
      {
        "id": "chess-pawn-structure",
        "grade": 6,
        "label": "estructura de peones de ajedrez",
        "match": "peones.*(?:aislados|doblados|retrasados|pasados)|estructura de peones",
        "relation": "la relación entre la estructura de peones expresamente seleccionada y las decisiones de la posición de ajedrez",
        "sourceRecordIds": [
          "fef04d74-fada-5df4-a618-0d35ecdeec61"
        ],
        "pdfPages": [
          381
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Estructura de peones y decisiones",
            "success": "Analiza los peones aislados y doblados de la posición proporcionada relacionando su estructura con las decisiones del referente de ajedrez.",
            "sufficient": "La relación principal de estructura de peones seleccionada se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de estructura de peones seleccionada, pero una relación no se sustenta en los peones y decisiones de la posición proporcionada.",
            "error": "Atribuye a estructura de peones seleccionada relaciones incompatibles con los peones y decisiones de la posición proporcionada o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "diet-rest-case",
        "grade": 6,
        "label": "alimentación y descanso del caso",
        "match": "(?:alimentacion|dieta).*descanso|descanso.*(?:alimentacion|dieta)|analiza.*descanso.*caso",
        "relation": "la relación entre alimentación, descanso y condiciones de actividad del caso trabajado",
        "sourceRecordIds": [
          "0fece179-5327-54b5-8736-da6521f0e092"
        ],
        "pdfPages": [
          380
        ],
        "primaryPurpose": "ANALYSIS",
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Alimentación, descanso y condiciones dadas",
            "success": "Analiza la relación entre alimentación y descanso del caso ficticio sustentándola en las acciones, condiciones y fichas proporcionadas, sin elaborar una dieta personal.",
            "sufficient": "La relación principal de alimentación y descanso se sustenta; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes de alimentación y descanso, pero una relación no se sustenta en las acciones y condiciones del caso proporcionado.",
            "error": "Atribuye a alimentación y descanso relaciones incompatibles con las acciones y condiciones del caso proporcionado o sustituye la evidencia solicitada por una afirmación sin sustento."
          }
        ]
      },
      {
        "id": "chess-ending-game",
        "grade": 6,
        "label": "partida de ajedrez con técnicas de finales",
        "match": "juega.*ajedrez.*finales|partida adaptada de ajedrez.*finales",
        "relation": "la relación entre las técnicas de finales expresamente dadas y las decisiones de la partida de ajedrez proporcionada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "30beb9eb-ef12-5829-8b99-833cf081553e"
        ],
        "pdfPages": [
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y técnica del final",
            "success": "Juega la partida adaptada de ajedrez aplicando las técnicas de finales expresamente dadas según la posición y reglas proporcionadas, sin exigir ganar.",
            "sufficient": "Las acciones y el orden solicitados se reconocen; una transición secundaria pierde continuidad respecto a las técnicas y condiciones de la partida proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las técnicas y condiciones de la partida proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las técnicas y condiciones de la partida proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "distance-running",
        "grade": 6,
        "label": "carrera de mediana o larga distancia",
        "match": "carrera.*(?:mediana|larga) distancia",
        "relation": "la relación entre el ritmo, las señales y las condiciones de la carrera de la distancia expresamente elegida",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "b8daf84e-811e-5287-b2f4-4d3c1a3b06e3"
        ],
        "pdfPages": [
          380
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Ritmo y señales de la carrera dada",
            "success": "Realiza la carrera adaptada de la distancia expresamente elegida siguiendo el ritmo, señales y condiciones supervisadas proporcionadas con los apoyos permitidos, sin asignar una distancia nueva.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto a las señales y condiciones supervisadas proporcionadas.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y condiciones supervisadas proporcionadas.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y condiciones supervisadas proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "orientation-signs",
        "grade": 6,
        "label": "símbolos y señales de rastreo de orientación",
        "match": "simbolos.*senales.*orientacion|senales de rastreo",
        "relation": "la correspondencia entre símbolos y señales de rastreo de orientación y las referencias expresamente proporcionadas",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "acb80eed-10e9-5f71-b22c-a98f452a4875",
          "fc1d038d-6f9f-59fb-acfe-6d1653ff2b50"
        ],
        "pdfPages": [
          380,
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Símbolo y referencia del recorrido",
            "success": "Interpreta los símbolos y señales de rastreo de orientación relacionándolos con las evidencias y referencias proporcionadas, sin exigir realizar el recorrido.",
            "sufficient": "La relación principal se sustenta en los símbolos y referencias proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los símbolos y referencias proporcionados.",
            "error": "Presenta relaciones incompatibles con los símbolos y referencias proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "orientation-map",
        "grade": 6,
        "label": "croquis o mapa de orientación",
        "match": "(?:croquis|mapa).*orientacion|orientacion.*(?:croquis|mapa)|o-cad",
        "relation": "la correspondencia entre símbolos, referencias y ubicaciones del croquis o mapa de orientación expresamente elegido",
        "primaryPurpose": "PRODUCTION",
        "sourceRecordIds": [
          "80d33b5d-7c2b-5891-8263-8c53b7cd0659",
          "fc1d038d-6f9f-59fb-acfe-6d1653ff2b50",
          "0f77d006-7e1c-5742-b875-8d5f85b636ac"
        ],
        "pdfPages": [
          380,
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Símbolos y ubicaciones del producto dado",
            "success": "Elabora el croquis o mapa de orientación expresamente elegido relacionando símbolos, referencias y ubicaciones proporcionadas según la guía dada, sin exigir instalar software ni realizar el recorrido.",
            "sufficient": "El producto relaciona los símbolos y ubicaciones principales con las referencias dadas; una referencia secundaria queda poco precisada.",
            "partial": "Incluye símbolos y ubicaciones pertinentes, pero una correspondencia no se sustenta en las referencias proporcionadas.",
            "error": "Las ubicaciones o símbolos del producto contradicen las referencias y condiciones proporcionadas.",
            "absent": "No aporta evidencia del producto expresamente solicitado."
          }
        ]
      },
      {
        "id": "orientation-safety",
        "grade": 6,
        "label": "seguridad de recorridos de orientación",
        "match": "seguridad.*(?:recorrido|orientacion)|(?:recorrido|orientacion).*(?:urbano|rural)",
        "relation": "la relación entre riesgos, medidas y protocolos del recorrido de orientación del entorno expresamente elegido",
        "primaryPurpose": "PLAN",
        "sourceRecordIds": [
          "553b223f-f03f-5226-a388-d38c1b907e3f"
        ],
        "pdfPages": [
          380
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Riesgo y medida de seguridad previstos",
            "success": "Planifica las medidas de seguridad del recorrido de orientación del entorno expresamente elegido justificándolas según los riesgos y protocolos proporcionados, sin exigir realizar una excursión.",
            "sufficient": "La relación principal se sustenta en los riesgos y protocolos del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los riesgos y protocolos del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con los riesgos y protocolos del caso proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "orientation-modalities",
        "grade": 6,
        "label": "modalidades de carrera de orientación",
        "match": "modalidades.*carrera de orientacion",
        "relation": "las diferencias entre las modalidades de carrera de orientación expresamente elegidas y las condiciones de sus referentes",
        "primaryPurpose": "COMPARISON",
        "sourceRecordIds": [
          "c33ce6bf-11b5-5eff-93ff-c02434e8d209"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Modalidad y condiciones del referente",
            "success": "Compara las modalidades de carrera de orientación expresamente elegidas relacionando condiciones y recursos con las evidencias de los referentes proporcionados.",
            "sufficient": "La relación principal se sustenta en las condiciones y recursos de los referentes proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las condiciones y recursos de los referentes proporcionados.",
            "error": "Presenta relaciones incompatibles con las condiciones y recursos de los referentes proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "football-local",
        "grade": 6,
        "label": "aportes locales de clubes y equipos de fútbol",
        "match": "aportes.*clubes.*futbol|clubes.*equipos.*futbol.*comunidad",
        "relation": "la relación entre los aportes de clubes y equipos de fútbol de la comunidad asignada y las evidencias de las fuentes dadas",
        "primaryPurpose": "PRESENTATION",
        "sourceRecordIds": [
          "96db7d1d-5cfb-5c8b-a9ed-94b97909e52e",
          "94727fee-d90a-5108-9dbd-91f4282daabe"
        ],
        "pdfPages": [
          380
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Aporte local y fuente",
            "success": "Presenta los aportes de clubes y equipos de fútbol de la comunidad asignada relacionándolos con las evidencias de las fuentes proporcionadas.",
            "sufficient": "La relación principal se sustenta en las fuentes del ámbito local proporcionadas; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fuentes del ámbito local proporcionadas.",
            "error": "Presenta relaciones incompatibles con las fuentes del ámbito local proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "football-biography",
        "grade": 6,
        "label": "aportes biográficos de futbolistas dominicanos",
        "match": "(?:aportes|elementos) biograficos.*futbolistas|biografi.*futbolistas",
        "relation": "la relación entre hechos biográficos y aportes de futbolistas dominicanos del ámbito expresamente asignado y las fuentes dadas",
        "primaryPurpose": "RESEARCH",
        "sourceRecordIds": [
          "571a46b9-7900-553e-b903-c99694930bd3",
          "209331a3-3d87-5932-87e1-2bd4bf243dab"
        ],
        "pdfPages": [
          380
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hecho biográfico y aporte documentado",
            "success": "Investiga los aportes biográficos de futbolistas dominicanos del ámbito expresamente asignado relacionándolos con las evidencias de las fuentes proporcionadas, sin inferir prestigio personal.",
            "sufficient": "La relación principal se sustenta en las fuentes del ámbito proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las fuentes del ámbito proporcionado.",
            "error": "Presenta relaciones incompatibles con las fuentes del ámbito proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "football-possession",
        "grade": 6,
        "label": "ofensiva de posesión de fútbol",
        "match": "ofensiva de posesion.*futbol|posesion.*futbol",
        "relation": "la relación entre posiciones, alternativas y decisiones de la ofensiva de posesión de la modalidad de fútbol expresamente dada",
        "primaryPurpose": "PLAN",
        "sourceRecordIds": [
          "0fcdc02f-9690-5d51-9113-5e05b8fe6773",
          "da255c73-6eb6-576d-b0c7-2ab929c1ee47",
          "841d1975-eea6-57c3-92e0-09dbbf547122"
        ],
        "pdfPages": [
          380,
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posición y decisión de posesión previstas",
            "success": "Planifica la ofensiva de posesión de la modalidad de fútbol expresamente dada relacionando posiciones y decisiones con las alternativas proporcionadas, sin exigir ejecutar el juego.",
            "sufficient": "La relación principal se sustenta en las posiciones y alternativas del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y alternativas del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con las posiciones y alternativas del caso proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "football-counterattack",
        "grade": 6,
        "label": "contraataque de fútbol o futsal",
        "match": "contraataque.*(?:futbol|futsal)",
        "relation": "la relación entre posesión del balón, posiciones y decisiones del contraataque de la modalidad expresamente elegida",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "0fcdc02f-9690-5d51-9113-5e05b8fe6773",
          "da255c73-6eb6-576d-b0c7-2ab929c1ee47",
          "841d1975-eea6-57c3-92e0-09dbbf547122"
        ],
        "pdfPages": [
          380,
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Decisión y posición del contraataque",
            "success": "Ejecuta el contraataque adaptado de la modalidad de fútbol expresamente dada según posesión del balón, posiciones, señales y apoyos proporcionados.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto a las posiciones y señales de la situación proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las posiciones y señales de la situación proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las posiciones y señales de la situación proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "football-defense",
        "grade": 6,
        "label": "defensa de jugador de campo o portero de fútbol",
        "match": "defensa.*(?:campo|portero).*futbol|defensa.*futbol.*(?:campo|portero)",
        "relation": "la relación entre posiciones y decisiones defensivas de la función de fútbol expresamente elegida y las evidencias del referente dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "73dad8b3-ab0c-571d-8e14-743f9ec98055",
          "6224a790-830f-5c49-81e6-bd9f5397b19f"
        ],
        "pdfPages": [
          380,
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posición y decisión de la función elegida",
            "success": "Analiza la defensa de la función de fútbol expresamente elegida relacionando posiciones y decisiones con las evidencias del referente proporcionado, sin exigir ejecutar maniobras.",
            "sufficient": "La relación principal se sustenta en las posiciones y decisiones del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y decisiones del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las posiciones y decisiones del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado.",
            "variants": {
              "PLAN": {
                "id": "requested-evidence",
                "title": "Posiciones y decisiones defensivas previstas",
                "success": "Planifica la defensa de la función de fútbol expresamente elegida relacionando posiciones y decisiones con las alternativas del caso proporcionado, sin exigir ejecución.",
                "sufficient": "La relación principal se sustenta en las posiciones y alternativas del caso proporcionado; una referencia secundaria queda poco precisada.",
                "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y alternativas del caso proporcionado.",
                "error": "Presenta relaciones incompatibles con las posiciones y alternativas del caso proporcionado.",
                "absent": "No aporta evidencia del desempeño expresamente solicitado."
              }
            }
          }
        ]
      },
      {
        "id": "football-systems",
        "grade": 6,
        "label": "sistemas defensivos de fútbol",
        "match": "sistema.*defensivo.*futbol|sistemas?.*(?:4-4-2|4-5-1|4-3-3)",
        "relation": "la relación entre las posiciones del sistema defensivo de fútbol expresamente elegido y las decisiones dadas de la situación de juego",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "9c714105-6f57-5c02-8dc1-51fe6a2574b5",
          "3c1c088a-ce33-5890-b7a0-873e9be2fbf5"
        ],
        "pdfPages": [
          380,
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Posiciones del sistema elegido",
            "success": "Ejecuta el sistema defensivo de fútbol expresamente elegido en la situación de juego adaptada según las señales, posiciones y apoyos proporcionados.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto a las señales y posiciones de la situación proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y posiciones de la situación proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y posiciones de la situación proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "football-team-plan",
        "grade": 6,
        "label": "plan de acciones ofensivas o defensivas del equipo de fútbol",
        "match": "plan.*acciones.*(?:ofensivas|defensivas).*futbol",
        "relation": "la relación entre acciones del equipo de fútbol expresamente elegidas, roles, posiciones y alternativas del plan dado",
        "primaryPurpose": "PLAN",
        "sourceRecordIds": [
          "2f79c8fe-4ef0-5be2-8234-dd396f3bc0e2"
        ],
        "pdfPages": [
          380
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Roles y posiciones previstos",
            "success": "Organiza el plan de acciones del equipo de fútbol expresamente elegidas relacionando roles y posiciones con las alternativas del caso proporcionado, sin exigir ejecutar el juego.",
            "sufficient": "La relación principal se sustenta en los roles y alternativas del caso proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los roles y alternativas del caso proporcionado.",
            "error": "Presenta relaciones incompatibles con los roles y alternativas del caso proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "volleyball-institutions",
        "grade": 6,
        "label": "instituciones que regulan y fomentan el voleibol",
        "match": "instituciones.*voleibol|organizacion.*voleibol",
        "relation": "la relación entre las funciones de las instituciones del voleibol del ámbito expresamente asignado y las evidencias de las fuentes dadas",
        "primaryPurpose": "RESEARCH",
        "sourceRecordIds": [
          "c322ccb3-26f6-5215-9ee3-ee56255f6ccf",
          "121255fd-402d-5f94-a6ba-3d613aa212a5"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Institución y función documentada",
            "success": "Investiga las funciones de las instituciones que regulan y fomentan el voleibol del ámbito expresamente asignado relacionándolas con las evidencias de las fuentes proporcionadas.",
            "sufficient": "La relación principal se sustenta en las funciones y fuentes del ámbito proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las funciones y fuentes del ámbito proporcionado.",
            "error": "Presenta relaciones incompatibles con las funciones y fuentes del ámbito proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "volleyball-modalities",
        "grade": 6,
        "label": "objetivos y características de modalidades del voleibol",
        "match": "objetivos.*voleibol|compara.*voleibol.*(?:arena|grama|sala|sentado)|modalidades.*voleibol",
        "relation": "las diferencias entre objetivos y características de las modalidades de voleibol expresamente elegidas y sus referentes",
        "primaryPurpose": "COMPARISON",
        "sourceRecordIds": [
          "c322ccb3-26f6-5215-9ee3-ee56255f6ccf",
          "1c53a4ed-5497-5970-ae7c-eb289dcf1897",
          "aa023c71-ef92-51e3-868e-9d0ffa1e7ae4",
          "1a5480db-c7a2-5b90-bb3e-af37e95bf924"
        ],
        "pdfPages": [
          381,
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Objetivo y característica de la modalidad",
            "success": "Compara los objetivos y características de las modalidades de voleibol expresamente elegidas relacionándolos con las evidencias de los referentes proporcionados.",
            "sufficient": "La relación principal se sustenta en los objetivos y características de los referentes proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los objetivos y características de los referentes proporcionados.",
            "error": "Presenta relaciones incompatibles con los objetivos y características de los referentes proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "volleyball-alignments",
        "grade": 6,
        "label": "funciones de alineaciones ofensivas de voleibol",
        "match": "alineacion.*ofensiva.*voleibol|(?:atacador|acomodador).*voleibol",
        "relation": "la relación entre las funciones expresamente elegidas y las posiciones y decisiones de la alineación ofensiva de voleibol dada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "3ded2dc9-13a7-533c-a534-208b716003bd",
          "1343603e-c26a-5ef2-93fe-18929963bdf5",
          "b96b48ed-e531-554d-b162-60b8c19563cd"
        ],
        "pdfPages": [
          381,
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Función y posición de la alineación",
            "success": "Ejecuta la función expresamente elegida en la alineación ofensiva de voleibol dada según posiciones, señales y condiciones supervisadas proporcionadas con los apoyos permitidos.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto a las posiciones y señales de la situación proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las posiciones y señales de la situación proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las posiciones y señales de la situación proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-advanced-ending",
        "grade": 6,
        "label": "partida con final avanzado de ajedrez",
        "match": "final.*avanzado.*ajedrez|partida.*ajedrez.*final.*avanzado",
        "relation": "la relación entre jugadas, decisiones y restricciones del final avanzado de ajedrez de la posición proporcionada",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "f2feff03-de52-5e38-9567-51a8dd64915d",
          "9d8a193a-a3ca-5c5c-8000-df910c73c7ba"
        ],
        "pdfPages": [
          381,
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugadas y decisiones del final avanzado",
            "success": "Analiza la partida de ajedrez con final de nivel avanzado relacionando jugadas y decisiones con las evidencias de la posición proporcionada.",
            "sufficient": "La relación principal se sustenta en las jugadas y decisiones de la posición proporcionada; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las jugadas y decisiones de la posición proporcionada.",
            "error": "Presenta relaciones incompatibles con las jugadas y decisiones de la posición proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-rook-ending",
        "grade": 6,
        "label": "final de torres de ajedrez",
        "match": "final.*torres.*ajedrez",
        "relation": "la relación entre las jugadas del final de torres de ajedrez y las restricciones de la posición y reglas dadas",
        "primaryPurpose": "PROBLEM_SOLVING",
        "sourceRecordIds": [
          "0a02820e-0abe-5788-9a89-347dfac21368",
          "00491a85-1f8b-51e5-a6ef-1ef8856cd266"
        ],
        "pdfPages": [
          381,
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugada y restricción del final de torres",
            "success": "Resuelve el problema del final de torres de ajedrez justificando las jugadas con la posición y reglas proporcionadas.",
            "sufficient": "La relación principal se sustenta en las posiciones y reglas proporcionadas; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las posiciones y reglas proporcionadas.",
            "error": "Presenta relaciones incompatibles con las posiciones y reglas proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-bishop-ending",
        "grade": 6,
        "label": "finales de alfiles de ajedrez",
        "match": "final.*(?:alfiles|alfil).*ajedrez|final de ajedrez.*(?:alfiles|alfil)",
        "relation": "la relación entre las piezas del final de alfiles de ajedrez expresamente elegido y las jugadas de la posición dada",
        "primaryPurpose": "PROBLEM_SOLVING",
        "sourceRecordIds": [
          "b12466de-5760-524c-9522-db0feb93b176",
          "89f44746-3653-59cc-8f1c-36e6863f9a2a",
          "8c9fc218-507e-5a00-a594-f90137f30310"
        ],
        "pdfPages": [
          381,
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugada y piezas del final elegido",
            "success": "Resuelve el problema del final de alfiles de ajedrez expresamente elegido justificando las jugadas con las piezas y posición proporcionadas.",
            "sufficient": "La relación principal se sustenta en las piezas y posición proporcionadas; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las piezas y posición proporcionadas.",
            "error": "Presenta relaciones incompatibles con las piezas y posición proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-weak-squares",
        "grade": 6,
        "label": "casillas débiles de ajedrez",
        "match": "casillas debiles",
        "relation": "la correspondencia entre las casillas débiles de la posición de ajedrez y las restricciones de las piezas y jugadas dadas",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "ea5eb554-bad7-5254-b106-38904037cb46"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Casilla y evidencia de debilidad",
            "success": "Identifica las casillas débiles de la posición de ajedrez justificando su clasificación con las piezas y evidencias proporcionadas.",
            "sufficient": "La relación principal se sustenta en las piezas y evidencias de la posición proporcionada; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las piezas y evidencias de la posición proporcionada.",
            "error": "Presenta relaciones incompatibles con las piezas y evidencias de la posición proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-pawn-openings",
        "grade": 6,
        "label": "aperturas que derivan en estructuras de peones",
        "match": "apertura.*estructura.*peones|estructuras.*peones.*apertura",
        "relation": "la relación entre las jugadas de la apertura de ajedrez y la estructura de peones expresamente dada de la partida",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "295b67a1-4179-571b-b820-da655f6ebd7d"
        ],
        "pdfPages": [
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugada de apertura y estructura resultante",
            "success": "Analiza la partida con apertura de ajedrez que deriva en la estructura de peones expresamente dada relacionando jugadas y decisiones con las evidencias de la posición proporcionada.",
            "sufficient": "La relación principal se sustenta en las jugadas y estructura de la posición proporcionada; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las jugadas y estructura de la posición proporcionada.",
            "error": "Presenta relaciones incompatibles con las jugadas y estructura de la posición proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-pawn-game",
        "grade": 6,
        "label": "partida con temas de estructuras de peones",
        "match": "juega.*ajedrez.*(?:ofensivo|defensivo).*peones|partida.*temas.*peones",
        "relation": "la relación entre el tema ofensivo o defensivo de la estructura de peones expresamente elegido y las decisiones de la partida dada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "b51d8560-a7fd-50ce-850d-6c8e19fb3da6"
        ],
        "pdfPages": [
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Tema y decisión de la estructura dada",
            "success": "Juega la partida adaptada de ajedrez aplicando el tema de la estructura de peones expresamente elegido según las reglas y posiciones proporcionadas, sin exigir ganar.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto a las reglas y posiciones de la partida proporcionada.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las reglas y posiciones de la partida proporcionada.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las reglas y posiciones de la partida proporcionada.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-history",
        "grade": 6,
        "label": "historia del ajedrez",
        "match": "(?:historia|hechos historicos).*ajedrez",
        "relation": "la relación entre hechos históricos, personajes, fechas y fuentes del ajedrez del ámbito expresamente asignado",
        "primaryPurpose": "RESEARCH",
        "sourceRecordIds": [
          "e076710d-f299-5289-a620-836efad387eb"
        ],
        "pdfPages": [
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Hecho y fuente del ámbito asignado",
            "success": "Investiga los hechos históricos del ajedrez del ámbito expresamente asignado relacionando personajes, fechas y evidencias de las fuentes proporcionadas.",
            "sufficient": "La relación principal se sustenta en los hechos y fuentes del ámbito proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en los hechos y fuentes del ámbito proporcionado.",
            "error": "Presenta relaciones incompatibles con los hechos y fuentes del ámbito proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "chess-rules",
        "grade": 6,
        "label": "reglas de ajedrez",
        "match": "(?:reglas|reglamento|cumplen).*ajedrez|registro de ajedrez.*reglas",
        "relation": "la correspondencia entre las jugadas del registro de ajedrez y las reglas expresamente dadas",
        "primaryPurpose": "VERIFICATION",
        "sourceRecordIds": [
          "5e9ae1b9-bb82-54e9-af43-80b2a8a81098"
        ],
        "pdfPages": [
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Jugada y regla del registro",
            "success": "Verifica si las jugadas del registro de ajedrez cumplen las reglas proporcionadas justificando cada marca con sus evidencias.",
            "sufficient": "La relación principal se sustenta en las jugadas y reglas del registro proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las jugadas y reglas del registro proporcionado.",
            "error": "Presenta relaciones incompatibles con las jugadas y reglas del registro proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "racket-institutions",
        "grade": 6,
        "label": "instituciones del deporte de raqueta elegido",
        "match": "instituciones.*(?:tenis|badminton)|organizacion.*(?:tenis|badminton)",
        "relation": "la relación entre las funciones de instituciones del deporte de raqueta expresamente elegido del ámbito asignado y las fuentes dadas",
        "primaryPurpose": "RESEARCH",
        "sourceRecordIds": [
          "2ed6c3b5-0781-5a62-98ca-be55549bbcc9",
          "656b5617-6d45-5282-a70f-be06518af13f",
          "e94f3f78-8715-5267-9e15-939ca0049d48",
          "215675ce-49bf-5276-b0a8-b451c93c2930"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Institución y función del ámbito dado",
            "success": "Investiga las funciones de las instituciones que regulan y fomentan el deporte de raqueta expresamente elegido del ámbito asignado mediante las evidencias de las fuentes proporcionadas.",
            "sufficient": "La relación principal se sustenta en las funciones y fuentes del ámbito proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las funciones y fuentes del ámbito proporcionado.",
            "error": "Presenta relaciones incompatibles con las funciones y fuentes del ámbito proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "racket-rules",
        "grade": 6,
        "label": "reglas de modalidades del deporte de raqueta elegido",
        "match": "reglas.*(?:tenis|badminton)|(?:individuales|dobles mixtos).*reglas",
        "relation": "las semejanzas y diferencias de las reglas de las modalidades expresamente elegidas del deporte de raqueta dado",
        "primaryPurpose": "COMPARISON",
        "sourceRecordIds": [
          "37b1fad7-7cd6-52ae-bb1a-45f5d396af25",
          "5e9ae1b9-bb82-54e9-af43-80b2a8a81098"
        ],
        "pdfPages": [
          381,
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Modalidad y regla proporcionada",
            "success": "Compara las reglas de las modalidades expresamente elegidas del deporte de raqueta dado mediante las semejanzas y diferencias de los referentes proporcionados.",
            "sufficient": "La relación principal se sustenta en las modalidades y reglas de los referentes proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las modalidades y reglas de los referentes proporcionados.",
            "error": "Presenta relaciones incompatibles con las modalidades y reglas de los referentes proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "table-stroke",
        "grade": 6,
        "label": "golpeo de tenis de mesa",
        "match": "golpeo.*tenis de mesa",
        "relation": "la relación entre el lado y la trayectoria del golpeo de tenis de mesa expresamente elegido y las señales de la tarea dada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "8003e8d7-381a-56ae-bb03-322eb99c4d35"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Lado y trayectoria del golpeo",
            "success": "Ejecuta el golpeo adaptado de tenis de mesa del lado y trayectoria expresamente elegidos según las señales y apoyos de la tarea proporcionada.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto al lado, trayectoria y señales de la tarea proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde al lado, trayectoria y señales de la tarea proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con el lado, trayectoria y señales de la tarea proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "table-block",
        "grade": 6,
        "label": "bloqueo de tenis de mesa",
        "match": "bloqueo.*tenis de mesa",
        "relation": "la relación entre lado, trayectoria y decisiones del bloqueo de tenis de mesa expresamente elegido",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "a98ed5eb-112e-562d-95fd-8c35b13186f4"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Lado y trayectoria del bloqueo",
            "success": "Ejecuta el bloqueo adaptado de tenis de mesa del lado y trayectoria expresamente elegidos según las señales y condiciones supervisadas proporcionadas.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto al lado y trayectoria del referente proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde al lado y trayectoria del referente proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con el lado y trayectoria del referente proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "table-cut",
        "grade": 6,
        "label": "corte de tenis de mesa",
        "match": "corte.*tenis de mesa",
        "relation": "la relación entre lado, trayectoria y decisiones del corte de tenis de mesa expresamente elegido",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "2a31aca4-7abb-5c73-8769-141bc6bab047"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Lado y trayectoria del corte",
            "success": "Ejecuta el corte adaptado de tenis de mesa del lado y trayectoria expresamente elegidos según las señales y apoyos proporcionados.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto al lado, trayectoria y señales del referente proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde al lado, trayectoria y señales del referente proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con el lado, trayectoria y señales del referente proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "table-serve",
        "grade": 6,
        "label": "saque de tenis de mesa",
        "match": "saque.*tenis de mesa",
        "relation": "la relación entre lado, trayectoria y efecto del saque de tenis de mesa expresamente elegido y las evidencias del referente dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "945d75fc-9346-535b-a08b-aa2b17cd5b60"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Lado, trayectoria y decisión del saque",
            "success": "Analiza el saque de tenis de mesa expresamente elegido relacionando lado, trayectoria y efecto pedidos con las evidencias del referente proporcionado, sin exigir ejecución.",
            "sufficient": "La relación principal se sustenta en el lado, trayectoria y efecto del referente proporcionados; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en el lado, trayectoria y efecto del referente proporcionados.",
            "error": "Presenta relaciones incompatibles con el lado, trayectoria y efecto del referente proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "table-combination",
        "grade": 6,
        "label": "ejercicio combinado de tenis de mesa",
        "match": "ejercicio combinado.*tenis de mesa|(?:1|2)s*vss*2.*tenis de mesa",
        "relation": "la relación entre el agrupamiento y el trayecto del ejercicio combinado de tenis de mesa expresamente elegido y las señales dadas",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "94bba2e4-4896-53aa-843b-7f7f8ddaaa84"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Agrupamiento y trayecto del ejercicio dado",
            "success": "Ejecuta el ejercicio combinado adaptado de tenis de mesa del agrupamiento y trayecto expresamente elegidos según las señales y apoyos proporcionados.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto al agrupamiento, trayecto y señales proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde al agrupamiento, trayecto y señales proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con el agrupamiento, trayecto y señales proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "racket-game",
        "grade": 6,
        "label": "set o partido adaptado de raqueta",
        "match": "juega.*(?:tenis|badminton)|(?:games?|set|partidos?).*(?:tenis|badminton)",
        "relation": "la relación entre reglas, movimientos y decisiones del set o partido adaptado de la disciplina de raqueta expresamente dada",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "0d3c113e-8604-55cc-bd4b-145ca8463ab2",
          "25a9ea6b-c38d-5dc1-a5fd-d33999d4e16a",
          "d31d83ac-8126-5d94-b681-5b1fd6cd3618"
        ],
        "pdfPages": [
          381,
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Reglas y decisiones del juego dado",
            "success": "Juega el set o partido adaptado de la disciplina de raqueta expresamente dada aplicando reglas y decisiones proporcionadas con los apoyos acordados, sin evaluar ganar.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto a las reglas y decisiones del juego proporcionado.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las reglas y decisiones del juego proporcionado.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las reglas y decisiones del juego proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "badminton-serve",
        "grade": 6,
        "label": "saque de bádminton",
        "match": "saque.*badminton",
        "relation": "la relación entre lado, modalidad y trayectoria del saque de bádminton expresamente elegido y las señales dadas",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "de698fba-5e45-5161-92ac-0986b902fe74",
          "f3f91f0d-4185-5726-a012-c58271f3763e"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Lado y modalidad del saque dado",
            "success": "Ejecuta el saque adaptado de bádminton del lado y modalidad expresamente elegidos según las señales y condiciones supervisadas proporcionadas.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto al lado, modalidad y señales del referente proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde al lado, modalidad y señales del referente proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con el lado, modalidad y señales del referente proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "badminton-back",
        "grade": 6,
        "label": "juego de fondo de pista de bádminton",
        "match": "fondo de pista.*badminton|(?:globo|clear|dejada|drop|remate|drive).*badminton",
        "relation": "la relación entre el golpe de fondo de pista de bádminton expresamente elegido y la trayectoria y decisiones del referente dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "1bcd45e6-56b0-5c8c-a49e-437862c5d614"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Golpe elegido y trayectoria del referente",
            "success": "Analiza el golpe de fondo de pista de bádminton expresamente elegido relacionando trayectoria y decisión con las evidencias proporcionadas, sin exigir ejecución.",
            "sufficient": "La relación principal se sustenta en las trayectorias y decisiones del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las trayectorias y decisiones del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las trayectorias y decisiones del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "badminton-net",
        "grade": 6,
        "label": "juego en la red de bádminton",
        "match": "(?:lob|net|red).*badminton",
        "relation": "la relación entre el golpe en la red de bádminton expresamente elegido y las señales y condiciones dadas",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "1bcd45e6-56b0-5c8c-a49e-437862c5d614"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Golpe de red elegido y señales",
            "success": "Ejecuta el golpe de red de bádminton expresamente elegido según las señales y condiciones supervisadas proporcionadas con los apoyos permitidos.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto a las señales y condiciones supervisadas proporcionadas.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y condiciones supervisadas proporcionadas.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y condiciones supervisadas proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "tennis-serve",
        "grade": 6,
        "label": "servicio de tenis",
        "match": "servicio.*tenis(?! de mesa)",
        "relation": "la relación entre la modalidad de servicio de tenis expresamente elegida y las señales, referencias y apoyos dados",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "b023b115-55db-5535-bb6a-a5f72cf439a8"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Modalidad y referencias del servicio",
            "success": "Ejecuta el servicio adaptado de tenis de la modalidad expresamente elegida según las señales, referencias y apoyos proporcionados.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto a las señales y condiciones supervisadas proporcionadas.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y condiciones supervisadas proporcionadas.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y condiciones supervisadas proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "tennis-stroke",
        "grade": 6,
        "label": "golpe de tenis",
        "match": "golpe.*tenis(?! de mesa)",
        "relation": "la relación entre lado, modalidad y decisiones del golpe de tenis expresamente elegido y las señales dadas",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "14b42f7f-685c-55d4-9ae4-adb2843e7b6e"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Lado y modalidad del golpe",
            "success": "Ejecuta el golpe adaptado de tenis del lado y modalidad expresamente elegidos según las señales y condiciones supervisadas proporcionadas.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto al lado, modalidad y señales del referente proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde al lado, modalidad y señales del referente proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con el lado, modalidad y señales del referente proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "tennis-volley",
        "grade": 6,
        "label": "volea de tenis",
        "match": "volea.*tenis",
        "relation": "la relación entre el lado de la volea de tenis expresamente elegido y las señales y condiciones dadas",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "b161e350-bde0-5fb3-8af8-df1f66dc0e46"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Lado y señales de la volea",
            "success": "Ejecuta la volea adaptada de tenis del lado expresamente elegido según las señales y condiciones supervisadas proporcionadas.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto al lado y señales del referente proporcionados.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde al lado y señales del referente proporcionados.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con el lado y señales del referente proporcionados.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "tennis-lob",
        "grade": 6,
        "label": "globo de tenis",
        "match": "globo.*tenis",
        "relation": "la relación entre la trayectoria y decisiones del globo adaptado de tenis y las señales y referencias dadas",
        "primaryPurpose": "PERFORMANCE",
        "sourceRecordIds": [
          "18dfd71f-b199-59e5-b2c5-75f16fab7d9a"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Trayectoria y señales del globo",
            "success": "Ejecuta el globo adaptado de tenis según las señales, referencias y apoyos proporcionados.",
            "sufficient": "Las acciones y decisiones solicitadas se reconocen; una transición secundaria pierde continuidad respecto a las señales y referencias del globo proporcionadas.",
            "partial": "Realiza acciones pertinentes, pero una decisión o transición no corresponde a las señales y referencias del globo proporcionadas.",
            "error": "Sustituye las acciones solicitadas por otras incompatibles con las señales y referencias del globo proporcionadas.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "tennis-smash",
        "grade": 6,
        "label": "remate de tenis",
        "match": "remate.*tenis",
        "relation": "la relación entre trayectoria y decisiones del remate de tenis y las evidencias del referente técnico dado",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "9f09edbe-df37-5834-a1b5-ce0c5db83203"
        ],
        "pdfPages": [
          381
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Trayectoria y decisión del remate",
            "success": "Analiza el remate de tenis del referente técnico relacionando trayectoria y decisión con las evidencias proporcionadas, sin exigir ejecución.",
            "sufficient": "La relación principal se sustenta en las trayectorias y decisiones del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las trayectorias y decisiones del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las trayectorias y decisiones del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      },
      {
        "id": "physical-image-reference",
        "grade": 6,
        "label": "actividad física e imagen corporal saludable",
        "match": "imagen corporal",
        "relation": "las relaciones entre actividad física e imagen corporal saludable descritas por el referente proporcionado, sin inferir atributos privados",
        "primaryPurpose": "ANALYSIS",
        "sourceRecordIds": [
          "6c5623ae-b722-5bc1-a4f7-5bd799efefdd"
        ],
        "pdfPages": [
          382
        ],
        "evidence": [
          {
            "id": "requested-evidence",
            "title": "Relación y evidencias del referente",
            "success": "Analiza la relación entre actividad física e imagen corporal saludable del referente proporcionado sustentándola con sus evidencias, sin comparar apariencia ni inferir autoestima, diagnósticos o atributos privados.",
            "sufficient": "La relación principal se sustenta en las relaciones y evidencias del referente proporcionado; una referencia secundaria queda poco precisada.",
            "partial": "Identifica elementos pertinentes, pero una relación no se sustenta en las relaciones y evidencias del referente proporcionado.",
            "error": "Presenta relaciones incompatibles con las relaciones y evidencias del referente proporcionado.",
            "absent": "No aporta evidencia del desempeño expresamente solicitado."
          }
        ]
      }
    ],
    "policy": "REQUESTED_ADAPTED_MOTOR_EVIDENCE_V1"
  }
]} as unknown as EvaluationCatalog
