import type {PhysicalTopic} from './secondary-physical'

/** Adaptaciones pedagógicas; literal y anomalías se conservan en la matriz de fuente. */
export const physicalGradeSixTopics: PhysicalTopic[] = [
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
]
