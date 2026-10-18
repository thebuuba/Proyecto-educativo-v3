import type {PhysicalTopic} from './secondary-physical'

/** Adaptaciones de AulaBase; el literal oficial permanece separado. */
export const physicalGradeThreeTopics: PhysicalTopic[] = [
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
]
