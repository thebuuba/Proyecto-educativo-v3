import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV111 } from './catalog-v111'
/** Exact112 payload checked against Development; previous fields remain inherited. */
export const evaluationCatalogV112={...evaluationCatalogV111,version:'evaluation-2026.112',physicalCommonModules:[
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
  }
]} as unknown as EvaluationCatalog
