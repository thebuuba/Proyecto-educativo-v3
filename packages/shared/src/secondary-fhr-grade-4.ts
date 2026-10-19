import type {FhrTopic} from './secondary-fhr'

/** Adaptaciones observables del cuarto grado; casos y fuentes, sin evaluar fe privada. */
export const fhrGradeFourTopics:FhrTopic[]=[
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
]
