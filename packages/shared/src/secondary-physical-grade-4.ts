import type {PhysicalTopic} from './secondary-physical'

/** Adaptaciones de AulaBase; literal y anomalías de columnas separados en la matriz. */
export const physicalGradeFourTopics: PhysicalTopic[] = [
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
]
