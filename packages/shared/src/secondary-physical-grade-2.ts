import type {PhysicalTopic} from './secondary-physical'

/** Adaptaciones de AulaBase; las filas oficiales permanecen separadas. */
export const physicalGradeTwoTopics: PhysicalTopic[] = [
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
]
