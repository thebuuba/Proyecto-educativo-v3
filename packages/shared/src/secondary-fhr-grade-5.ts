import type {FhrTopic} from './secondary-fhr'

/** Adaptaciones observables del quinto grado; casos y fuentes, sin evaluar fe privada. */
export const fhrGradeFiveTopics:FhrTopic[]=[
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
]
