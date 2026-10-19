import type {FhrTopic} from './secondary-fhr'

/** Adaptaciones observables del tercer grado; fuentes y acciones, sin calificar fe privada. */
export const fhrGradeThreeTopics:FhrTopic[]=[
  {
    "id": "life-value",
    "grade": 3,
    "label": "valor y respeto a la vida",
    "match": "valor.*respeto.*vida",
    "object": "el valor y respeto a la vida",
    "relation": "afirmaciones, acciones y consecuencias documentadas por los referentes dados",
    "sourceRecordIds": [
      "2d6f0722-f424-5018-af2b-5bc6901b74a8"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true
  },
  {
    "id": "life-mural",
    "grade": 3,
    "label": "mural de respeto e irrespeto a la vida",
    "match": "mural.*(?:respeto|irrespeto).*vida",
    "object": "el mural de respeto e irrespeto a la vida de personas y naturaleza",
    "relation": "situaciones, relaciones y evidencias de los referentes proporcionados",
    "sourceRecordIds": [
      "5b3f5c58-103d-5fbb-90ef-4452d8bc885c"
    ],
    "pdfPages": [
      401
    ],
    "productType": "PROJECT",
    "planReferenceOnly": true
  },
  {
    "id": "life-situations",
    "grade": 3,
    "label": "situaciones de respeto e irrespeto a la vida",
    "match": "situaciones.*(?:respeto|irrespeto).*vida",
    "object": "las situaciones de respeto e irrespeto a la vida del referente",
    "relation": "causas, acciones y efectos documentados en los casos proporcionados",
    "sourceRecordIds": [
      "789c2db5-5675-5e9f-83ae-5794f07ffab0"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true
  },
  {
    "id": "rights-panel",
    "grade": 3,
    "label": "panel de violaciones de derechos humanos",
    "match": "panel.*(?:violaciones|derechos humanos)",
    "object": "el panel sobre violaciones de derechos humanos de los referentes",
    "relation": "propósito, secuencia y relación de las intervenciones con las afirmaciones y evidencias de los textos proporcionados",
    "sourceRecordIds": [
      "ea41f2ee-ee28-58ad-8be8-48b105f54f08",
      "fc0df732-b861-5d9f-8baf-b187ce2f200d"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true
  },
  {
    "id": "rights-texts",
    "grade": 3,
    "label": "dignidad y defensa de vida en textos",
    "match": "dignidad.*defensa.*vida|defensa.*vida.*dignidad",
    "object": "la dignidad humana y defensa de la vida según los textos dados",
    "relation": "afirmaciones y artículos atribuidos a {choice}",
    "sourceRecordIds": [
      "00bb60e0-d8e7-5cb0-9e57-709415a57fd6",
      "9c9592a2-9d3b-565b-aa74-a370548b667f",
      "eb797144-c7a8-59a2-9915-de94105820c6",
      "ce45611b-d759-5be7-b92c-94212788f011",
      "94cca4b9-c390-546f-a6b2-590e600320b9"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "constitucion",
        "la Constitución"
      ],
      [
        "declaracion(?: universal)?",
        "la Declaración Universal"
      ]
    ],
    "choiceDefault": "los textos expresamente trabajados"
  },
  {
    "id": "religious-life",
    "grade": 3,
    "label": "valor de la vida en concepciones religiosas",
    "match": "valor.*vida.*(?:cristianismo|concepciones religiosas)",
    "object": "el valor de la vida en el cristianismo y otras concepciones religiosas",
    "relation": "perspectivas y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "f39c33c1-8e54-5fd9-8de6-24bec02c8d64",
      "88d75898-fe39-52d7-b06c-5b752500be06"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true
  },
  {
    "id": "vocation-talents",
    "grade": 3,
    "label": "relaciones documentadas con la preferencia vocacional",
    "match": "talentos|habilidades.*(?:intereses|preferencia).*vocacional|capacidades.*vocacional|preferencia vocacional",
    "object": "las relaciones documentadas entre {choice} y la preferencia vocacional",
    "relation": "características y relaciones expresamente descritas en el caso educativo proporcionado",
    "sourceRecordIds": [
      "72979943-82f8-570e-85a7-e16eb051fe69",
      "16c5f507-9d65-5d68-a188-f496dcd0d189"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "talentos",
        "talentos"
      ],
      [
        "habilidades",
        "habilidades"
      ],
      [
        "capacidades",
        "capacidades"
      ],
      [
        "intereses",
        "intereses"
      ]
    ],
    "choiceDefault": "los componentes expresamente trabajados"
  },
  {
    "id": "profession-process",
    "grade": 3,
    "label": "proceso para elegir profesión u oficio",
    "match": "proceso.*(?:profesion|oficio)",
    "object": "el proceso para elegir una profesión u oficio del referente",
    "relation": "etapas, condiciones y decisiones documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "587da7f5-7e29-511e-8573-e53f4044a85f"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true
  },
  {
    "id": "work-service",
    "grade": 3,
    "label": "trabajo como enriquecimiento y servicio",
    "match": "trabajo.*(?:enriquecimiento|servicio)",
    "object": "el trabajo como enriquecimiento personal y servicio a la sociedad",
    "relation": "aportes, condiciones y perspectivas documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "c69a2643-6a0f-5099-8d71-1bdb14432875",
      "8b17400c-413b-5b04-a963-989efa790fc6"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true
  },
  {
    "id": "work-sense",
    "grade": 3,
    "label": "sentido del trabajo en textos",
    "match": "sentido del trabajo",
    "object": "el sentido del trabajo en la realización de la persona según los textos dados",
    "relation": "afirmaciones, citas y argumentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "2351ed22-4f7a-5c5b-827e-084af8cf4232",
      "e4c6847b-ede4-5548-bf27-cf684d1f5aea"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true
  },
  {
    "id": "professionals-panel",
    "grade": 3,
    "label": "panel de dificultades vivencias y logros profesionales",
    "match": "panel.*profesionales|conversatorio.*profesionales",
    "object": "el panel con profesionales sobre dificultades, vivencias y logros documentados",
    "relation": "propósito, secuencia y recursos expresamente pedidos para el panel",
    "sourceRecordIds": [
      "b3a26ca7-c931-5f33-91cf-55685b9a5003"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true
  },
  {
    "id": "work-celebration",
    "grade": 3,
    "label": "celebración de beneficios del trabajo",
    "match": "celebracion.*beneficios.*trabajo",
    "object": "la celebración para presentar procesos sobre beneficios del trabajo humano",
    "relation": "propósito, secuencia y condiciones de los productos proporcionados",
    "sourceRecordIds": [
      "e11a59ed-183f-58b9-a3c2-d44f6f3635e6"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true,
    "excludeWhen": "cientific"
  },
  {
    "id": "family-mission",
    "grade": 3,
    "label": "concepto problemáticas y misión familiar en textos",
    "match": "mision.*familia|familia.*aparecida|concepto.*familia",
    "object": "el concepto, problemáticas y misión de la familia según los textos dados",
    "relation": "afirmaciones y relaciones atribuidas a {choice}",
    "sourceRecordIds": [
      "638d3317-a469-5ad9-b5a1-67f962c33000"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "aparecida(?:\\s*\\d+)?",
        "Aparecida 432–435"
      ],
      [
        "colosenses(?:\\s*\\d+)?",
        "Colosenses 3:18–21"
      ]
    ],
    "choiceDefault": "los textos expresamente trabajados"
  },
  {
    "id": "family-norms",
    "grade": 3,
    "label": "normas de convivencia familiar",
    "match": "normas.*convivencia.*familia(?:r(?:es)?|s)?",
    "object": "las normas propuestas para la convivencia familiar del caso dado",
    "relation": "acciones, condiciones y consecuencias vinculadas a los conflictos del caso",
    "sourceRecordIds": [
      "1311c19a-7db4-5b47-b18f-4e47fa913f43"
    ],
    "pdfPages": [
      402
    ],
    "productType": "WRITTEN_PRODUCTION",
    "planReferenceOnly": true
  },
  {
    "id": "family-sociodrama",
    "grade": 3,
    "label": "sociodrama de convivencia familiar",
    "match": "sociodrama.*convivencia.*familia(?:r(?:es)?|s)?",
    "object": "el caso proporcionado de convivencia familiar",
    "relation": "acciones, decisiones y soluciones reconocibles según las condiciones del caso",
    "sourceRecordIds": [
      "e36623a3-3294-5dfe-bdaa-0018e21de790"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "family-colloquium",
    "grade": 3,
    "label": "coloquio de resolución de conflictos en el hogar",
    "match": "coloquio.*(?:madres|padres|hogar)",
    "object": "el coloquio sobre experiencias y valores documentados para resolver conflictos en el hogar",
    "relation": "propósito, intervenciones y evidencias de los testimonios proporcionados",
    "sourceRecordIds": [
      "719dfb4b-f5ea-5eba-bde6-d882a8edf4d9"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "friendship-drama",
    "grade": 3,
    "label": "sociodrama de conflictos de amistad",
    "match": "sociodrama.*amistad|conflictos.*amistad",
    "object": "el caso proporcionado de conflictos en las relaciones de amistad y su resolución",
    "relation": "acciones y soluciones reconocibles de los testimonios suministrados",
    "sourceRecordIds": [
      "dc599b14-384e-5a20-bec3-eeff28eea4d2",
      "92ec9d60-e852-5fde-a28c-fdbb3bab20bc"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "family-encounter",
    "grade": 3,
    "label": "encuentro familiar para presentar productos",
    "match": "encuentro familiar",
    "object": "el encuentro familiar para presentar los productos y {choice} proporcionados",
    "relation": "propósito, secuencia y recursos expresamente elegidos para presentar los productos",
    "sourceRecordIds": [
      "7598e0b5-d117-54c7-bb8f-717b198e4a5b"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "videos",
        "videos"
      ],
      [
        "peliculas",
        "películas"
      ],
      [
        "charlas",
        "charlas"
      ],
      [
        "audiovisuales",
        "audiovisuales"
      ],
      [
        "informaciones",
        "informaciones"
      ]
    ],
    "choiceDefault": "los medios expresamente elegidos"
  },
  {
    "id": "dialogue-actions",
    "grade": 3,
    "label": "criterios y acciones para el diálogo",
    "match": "criterios y acciones.*dialogo",
    "object": "los criterios y acciones para el diálogo en los contextos dados",
    "relation": "acciones, condiciones y efectos sustentados en los referentes proporcionados",
    "sourceRecordIds": [
      "9b5e74e5-82ff-5285-b659-239a1dd8715d",
      "5b8b5bce-18d8-58d2-850b-8d21a33f3c32"
    ],
    "pdfPages": [
      402
    ],
    "productType": "WRITTEN_PRODUCTION",
    "planReferenceOnly": true
  },
  {
    "id": "peace-panel",
    "grade": 3,
    "label": "panel del diálogo y cultura de paz",
    "match": "panel.*(?:dialogo|cultura de paz)",
    "object": "el panel sobre diálogo y cultura de paz para resolver conflictos",
    "relation": "propósito, secuencia y evidencias de las soluciones de los referentes dados",
    "sourceRecordIds": [
      "746621df-ebbc-5b8b-b543-f6095aeec042",
      "2d3f78b9-de8d-543e-8735-dfc2467deb9d"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "conflict-messages",
    "grade": 3,
    "label": "mensajes sobre soluciones a conflictos",
    "match": "mensajes.*soluciones|mensajes.*problematicas",
    "object": "los mensajes que expresan soluciones a las problemáticas analizadas",
    "relation": "soluciones y evidencias comunicadas mediante el lenguaje expresamente solicitado",
    "sourceRecordIds": [
      "fbbba7c1-f30b-5d0f-bc00-1d8fba7ee338"
    ],
    "pdfPages": [
      402
    ],
    "productType": "WRITTEN_PRODUCTION",
    "planReferenceOnly": true
  },
  {
    "id": "conflict-commitments",
    "grade": 3,
    "label": "compromisos formulados para resolver conflictos",
    "match": "compromisos.*(?:conflictos|problematicas)",
    "object": "los compromisos formulados para resolver las problemáticas del caso dado",
    "relation": "acciones, condiciones y relaciones justificadas mediante diálogo, respeto y paz",
    "sourceRecordIds": [
      "45e1b2cc-031c-5b31-8cc5-d5644d886978"
    ],
    "pdfPages": [
      402
    ],
    "productType": "WRITTEN_PRODUCTION",
    "planReferenceOnly": true
  },
  {
    "id": "ecclesiasticus",
    "grade": 3,
    "label": "relaciones interpersonales según Eclesiástico",
    "match": "eclesiastico(?:\\s*11)?",
    "object": "las relaciones interpersonales interpretadas según Eclesiástico11:2–9 dado",
    "relation": "afirmaciones, situaciones y evidencias atribuidas al texto proporcionado",
    "sourceRecordIds": [
      "d793fd15-6a0e-552f-b2e8-06faa23a68f4"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "jesus-values",
    "grade": 3,
    "label": "valores de Jesús en vida muerte y resurrección",
    "match": "valores.*jesus.*vida|valores.*predicaba|valores.*predico.*vivio",
    "object": "los valores predicados y practicados por Jesús de Nazaret según los referentes",
    "relation": "episodios y evidencias atribuidos a los textos dados sobre vida, muerte y resurrección",
    "sourceRecordIds": [
      "78f511dc-5ea4-5386-b26c-119eada1e8df",
      "d6cfa855-cd5b-5d6d-8893-26b79fe6854b"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "dominican-values",
    "grade": 3,
    "label": "valores de Jesús en contexto dominicano",
    "match": "valores.*(?:dominicana|dominicano)",
    "object": "la presencia de valores atribuidos a Jesús en el contexto sociocultural dominicano",
    "relation": "ejemplos, contextos y evidencias documentados por los referentes proporcionados",
    "sourceRecordIds": [
      "4f06ba26-8719-5534-9eb6-c679e9b8e19d",
      "bf2fc283-8afe-52dd-860d-716117dea897"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "dialogue-scene",
    "grade": 3,
    "label": "escenificación de valores mediante diálogo",
    "match": "escenifica.*dialogo|escenificacion.*dialogo",
    "object": "la situación proporcionada de construcción de valores mediante diálogo fraterno",
    "relation": "acciones, decisiones y relaciones reconocibles del caso dado",
    "sourceRecordIds": [
      "b3afea5f-2f28-53f7-8519-70b836e099d6"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "jesus-relations",
    "grade": 3,
    "label": "valores de Jesús y relaciones sociales",
    "match": "practica.*jesus.*valores|valores.*relaciones sociales",
    "object": "la práctica de valores de Jesús que construyen relaciones sociales según los textos",
    "relation": "acciones y relaciones atribuidas a las fuentes bíblicas y otras proporcionadas",
    "sourceRecordIds": [
      "e03d15a3-c750-59d4-92fd-84dab31b6394"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "interfaith-dialogue",
    "grade": 3,
    "label": "criterios para diálogo entre confesiones",
    "match": "criterios.*dialogo.*confesiones",
    "object": "los criterios para el diálogo entre personas de diversas confesiones según los referentes",
    "relation": "acciones y fundamentos atribuidos a los valores de Jesús de los textos dados",
    "sourceRecordIds": [
      "d8a26849-ad53-5ba3-b65d-70c2dc55eed3"
    ],
    "pdfPages": [
      402
    ],
    "productType": "WRITTEN_PRODUCTION",
    "planReferenceOnly": true
  },
  {
    "id": "jesus-episodes",
    "grade": 3,
    "label": "momentos de la vida de Jesús en los evangelios trabajados",
    "match": "momentos.*vida.*jesus|marcos 14|marcos 15|juan 20",
    "object": "los momentos de la vida de Jesús narrados en los episodios dados de {choice}",
    "relation": "secuencia, acciones y evidencias atribuidas a los textos proporcionados",
    "sourceRecordIds": [
      "25d735b4-7996-5f60-9b23-1a71ca07783d"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "marcos(?:\\s*\\d+)?",
        "Marcos"
      ],
      [
        "juan(?:\\s*\\d+)?",
        "Juan"
      ]
    ],
    "choiceDefault": "los evangelios expresamente trabajados"
  },
  {
    "id": "tech-effects",
    "grade": 3,
    "label": "efectos positivos y negativos de tecnología",
    "match": "efectos.*(?:positivos|negativos).*tecnologia",
    "object": "los efectos positivos y negativos de tecnología en {choice}",
    "relation": "afirmaciones y evidencias documentadas en {choice} de los referentes proporcionados",
    "sourceRecordIds": [
      "026bcaaa-4c24-5081-ac0b-7eb2cd5e95e3",
      "19bb1501-5726-527c-8ef1-5b5c05694bb2",
      "14fb1216-0479-5704-9737-25ac3e7baba9",
      "0dcfdc3f-a566-5337-9404-bbadeab2cd8d"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "personas?",
        "la persona"
      ],
      [
        "familias?",
        "la familia"
      ],
      [
        "sociedad",
        "la sociedad"
      ],
      [
        "naturaleza",
        "la naturaleza"
      ]
    ],
    "choiceDefault": "los ámbitos expresamente trabajados"
  },
  {
    "id": "tech-development",
    "grade": 3,
    "label": "tecnología como herramienta de desarrollo",
    "match": "tecnologia.*herramienta.*desarrollo",
    "object": "la tecnología como herramienta de desarrollo de persona y sociedad",
    "relation": "beneficios, condiciones y límites argumentados mediante los referentes proporcionados",
    "sourceRecordIds": [
      "e80796aa-92e3-5660-b5ea-d555749a43d2",
      "aadb278c-90ff-55ad-b4be-4a6490ba2b6e"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "tech-nature",
    "grade": 3,
    "label": "relación entre tecnología y naturaleza",
    "match": "relacion.*tecnologia.*naturaleza",
    "object": "la relación entre tecnología y naturaleza",
    "relation": "relaciones y consecuencias documentadas por las diferentes fuentes proporcionadas",
    "sourceRecordIds": [
      "f4ca7e6b-de91-5a66-ba92-a9cb952b023f",
      "0cdb2365-c2cd-5855-b0d2-f3709b30f7e6"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "science-celebration",
    "grade": 3,
    "label": "celebración de beneficios del trabajo científico",
    "match": "celebracion.*(?:cientifico|avances)",
    "object": "la celebración para presentar beneficios del trabajo científico y sus avances",
    "relation": "propósito, secuencia y evidencias de los productos proporcionados",
    "sourceRecordIds": [
      "3dc7f57e-1fb7-5f05-b1c5-c1b52342c448"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true
  },
  {
    "id": "creation-values",
    "grade": 3,
    "label": "valores del cuidado de vida creada en textos",
    "match": "valores.*cuidado.*(?:creacion|vida creada)",
    "object": "los valores del cuidado de la vida creada atribuidos a los textos dados",
    "relation": "afirmaciones, acciones y evidencias documentadas en {choice}",
    "sourceRecordIds": [
      "c5e602bf-f017-551d-bd24-7cfee5600d33",
      "aadfdd98-4faa-5df1-9e34-06fcf9ebc630"
    ],
    "pdfPages": [
      402
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
    "choiceDefault": "los textos expresamente trabajados"
  },
  {
    "id": "ecology-texts",
    "grade": 3,
    "label": "ecología integral en textos proporcionados",
    "match": "cantico.*criaturas|laudato si|ecologia integral",
    "object": "el cuidado y respeto del medioambiente según {choice}",
    "relation": "afirmaciones y relaciones atribuidas a los textos proporcionados de ecología integral",
    "sourceRecordIds": [
      "3cabe717-dfe1-5245-9ca8-ff6ea2550645",
      "ef7e70b6-79f0-5797-9768-5d922213199c",
      "7f1920c3-d29b-5ba2-9365-6c5bb8158253",
      "7fb1d04f-b25c-50cc-9689-15d4d4acbbe4"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "cantico(?: de las criaturas)?",
        "el Cántico de las criaturas"
      ],
      [
        "laudato si",
        "Laudato Si capítulo 4"
      ]
    ],
    "choiceDefault": "los textos expresamente trabajados"
  },
  {
    "id": "ecology-project",
    "grade": 3,
    "label": "proyecto de promoción de valores ecológicos",
    "match": "proyecto.*valores ecologicos",
    "object": "el proyecto de promoción de valores ecológicos para contrarrestar la situación dada",
    "relation": "acciones y condiciones de la propuesta sustentadas en las evidencias del referente",
    "sourceRecordIds": [
      "5fb43fef-ac31-59ba-9015-33b6508a7beb"
    ],
    "pdfPages": [
      402
    ],
    "productType": "PROJECT",
    "planReferenceOnly": true
  },
  {
    "id": "nature-scene",
    "grade": 3,
    "label": "escenificación de beneficios de naturaleza",
    "match": "escenifica.*naturaleza|escenificacion.*naturaleza",
    "object": "los elementos de naturaleza y sus beneficios del referente proporcionado",
    "relation": "acciones y relaciones reconocibles de los elementos expresamente representados",
    "sourceRecordIds": [
      "380a1309-ff9f-54f1-b6e6-cb645da488ea"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "environment-institutions",
    "grade": 3,
    "label": "personas e instituciones protectoras del entorno",
    "match": "personas e instituciones.*(?:proteccion|casa comun)",
    "object": "las personas e instituciones que protegen el entorno natural según los referentes",
    "relation": "acciones, aportes y evidencias documentadas por las fuentes proporcionadas",
    "sourceRecordIds": [
      "41c75f51-ed37-5d31-b898-b0383b15ad46"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "conservation-actions",
    "grade": 3,
    "label": "acciones de conservación del medioambiente",
    "match": "acciones.*(?:defensa|conservacion).*medio ambiente",
    "object": "las acciones de defensa y conservación del medioambiente del caso dado",
    "relation": "acciones, secuencia y condiciones justificadas mediante los referentes proporcionados",
    "sourceRecordIds": [
      "6856764e-3c41-5587-ac57-caa500ecdb72"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true,
    "objects": {
      "PERFORMANCE": "las acciones de defensa y conservación del medioambiente previstas en el caso proporcionado"
    }
  },
  {
    "id": "environment-poster",
    "grade": 3,
    "label": "medios de promoción del cuidado del entorno",
    "match": "brochures?|cartel(?:es)?.*entorno|afiches?.*entorno",
    "object": "el {choice} de promoción de la protección y cuidado del entorno natural",
    "relation": "acciones y evidencias comunicadas mediante el medio expresamente elegido",
    "sourceRecordIds": [
      "48e815a5-d0ef-51ee-82f5-33146b92763e"
    ],
    "pdfPages": [
      403
    ],
    "productType": "WRITTEN_PRODUCTION",
    "planReferenceOnly": true,
    "choices": [
      [
        "cartel|carteles",
        "cartel"
      ],
      [
        "brochure|brochures",
        "brochure"
      ],
      [
        "afiche|afiches",
        "afiche"
      ]
    ],
    "choiceDefault": "medio expresamente elegido"
  },
  {
    "id": "environment-presentation",
    "grade": 3,
    "label": "exposición de acciones y medios de sostenibilidad",
    "match": "exposicion.*acciones.*sostenibilidad|expon[a-z]*.*acciones.*sostenibilidad",
    "object": "las acciones y medios de defensa de la vida y sostenibilidad del entorno documentados",
    "relation": "acciones, medios y resultados sustentados en las evidencias proporcionadas",
    "sourceRecordIds": [
      "5aa02a76-9fc9-5e6b-a8ea-23cfefe90069"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "adolescent-difficulties",
    "grade": 3,
    "label": "situaciones difíciles de adolescentes",
    "match": "situaciones dificiles.*adolescentes",
    "object": "las situaciones difíciles de adolescentes de los referentes educativos proporcionados",
    "relation": "condiciones, causas y consecuencias expresamente documentadas en los casos dados",
    "sourceRecordIds": [
      "8373e111-020b-59db-9ce1-097dda45a52d"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "adolescent-family",
    "grade": 3,
    "label": "problemas adolescentes con familiares",
    "match": "problemas.*adolescente.*familiares",
    "object": "los problemas del adolescente con familiares del caso proporcionado",
    "relation": "situaciones y evidencias expresamente documentadas por el caso educativo",
    "sourceRecordIds": [
      "aa80e11d-c31c-5a13-bb08-6232910de29a",
      "dd3baf3e-eaa1-5bd5-bf31-fe0417647b85"
    ],
    "pdfPages": [
      402,
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "adolescent-drama",
    "grade": 3,
    "label": "dramatización de conflictos escolares adolescentes",
    "match": "dramatiza.*conflictos.*adolescentes|dramatizacion.*adolescentes",
    "object": "el caso proporcionado de conflictos adolescentes en el ámbito escolar",
    "relation": "acciones, decisiones y relaciones reconocibles según las condiciones del caso",
    "sourceRecordIds": [
      "621b14f8-e825-56d5-b768-9f958ce36ad3"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "religious-figures",
    "grade": 3,
    "label": "personajes referentes de experiencias religiosas",
    "match": "personajes.*experiencia religiosa",
    "object": "los personajes referentes de experiencias religiosas según las fuentes",
    "relation": "contextos, experiencias y evidencias atribuidas a los documentos proporcionados",
    "sourceRecordIds": [
      "5350273a-d8c5-56cc-95f2-62551a30f15f",
      "55353cc1-4e8d-5a41-aab9-b24f6895eef2"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "life-questions",
    "grade": 3,
    "label": "panel de interrogantes del ser humano",
    "match": "panel.*interrogantes",
    "object": "el panel sobre grandes interrogantes del ser humano de los referentes",
    "relation": "propósito, secuencia y relación de las intervenciones con interrogantes, perspectivas y evidencias de las fuentes proporcionadas",
    "sourceRecordIds": [
      "73226e41-eb63-59c7-88c2-289d589d34d7"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "life-meaning",
    "grade": 3,
    "label": "búsqueda del sentido de vida con medios dados",
    "match": "busqueda.*sentido.*vida",
    "object": "la búsqueda del sentido de la vida según {choice} proporcionados",
    "relation": "afirmaciones y relaciones sustentadas en el medio expresamente elegido",
    "sourceRecordIds": [
      "556e3068-d716-55dd-9a26-14315bb0208a",
      "06a4ced0-df3d-5ec5-a464-e6a20391ff4a"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "imagenes",
        "los referentes en imágenes"
      ],
      [
        "canciones",
        "los referentes en canciones"
      ],
      [
        "videos",
        "los referentes en videos"
      ]
    ],
    "choiceDefault": "los medios expresamente elegidos"
  },
  {
    "id": "false-ideals",
    "grade": 3,
    "label": "ideales de felicidad etiquetados por la fuente",
    "match": "ideales.*felicidad|autorrealizacion.*sociedad",
    "object": "los ideales de felicidad y autorrealización denominados falsos por la fuente dada",
    "relation": "afirmaciones, contextos y evidencias atribuidas a los referentes proporcionados",
    "sourceRecordIds": [
      "c2dac5b3-d32c-5c90-a149-86b6d730d043"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "biblical-life-answers",
    "grade": 3,
    "label": "respuestas al sentido de vida en textos bíblicos",
    "match": "respuestas.*sentido.*vida.*(?:biblicos|lucas(?:\\s*\\d+)?|mateo(?:\\s*\\d+)?|juan(?:\\s*\\d+)?)",
    "object": "las respuestas al sentido de la vida atribuidas a los textos bíblicos dados",
    "relation": "afirmaciones, citas y evidencias de {choice}",
    "sourceRecordIds": [
      "50eb358a-0409-5c43-9503-87f4ab9fb1cb"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "lucas(?:\\s*\\d+)?",
        "Lucas"
      ],
      [
        "mateo(?:\\s*\\d+)?",
        "Mateo"
      ],
      [
        "juan(?:\\s*\\d+)?",
        "Juan"
      ]
    ],
    "choiceDefault": "los textos expresamente trabajados"
  },
  {
    "id": "religious-life-answers",
    "grade": 3,
    "label": "respuestas de grandes religiones al sentido de vida",
    "match": "respuestas.*grandes religiones.*sentido|respuestas religiosas.*interrogantes",
    "object": "las respuestas de grandes religiones al sentido de la vida según los referentes",
    "relation": "perspectivas y fundamentos atribuidos a las fuentes proporcionadas",
    "sourceRecordIds": [
      "5469dbf3-7e4d-5484-bca0-10b9f79b83bf",
      "a1f921be-5926-5d9f-9243-a52c7a02adfd",
      "5f17bf1b-1514-5b02-8352-a08bf5feddfc"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true
  },
  {
    "id": "concept-2d6f0722",
    "grade": 3,
    "label": "el valor y respeto a la vida",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+valor[\\s,:]+y[\\s,:]+respeto[\\s,:]+a[\\s,:]+la[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
    "object": "el valor y respeto a la vida",
    "relation": "afirmaciones, acciones y consecuencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "2d6f0722-f424-5018-af2b-5bc6901b74a8"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-ea41f2ee",
    "grade": 3,
    "label": "vida y derechos humanos",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:vida[\\s,:]+y[\\s,:]+derechos[\\s,:]+humanos)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre la vida y los derechos humanos",
    "relation": "derechos, situaciones y evidencias atribuidos a los textos proporcionados",
    "sourceRecordIds": [
      "ea41f2ee-ee28-58ad-8be8-48b105f54f08"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-f39c33c1",
    "grade": 3,
    "label": "el valor de la vida en el cristianismo y otras concepciones religiosas",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+valor[\\s,:]+de[\\s,:]+la[\\s,:]+vida[\\s,:]+en[\\s,:]+el[\\s,:]+cristianismo[\\s,:]+y[\\s,:]+otras[\\s,:]+concepciones[\\s,:]+religiosas)(?:\\s+segun\\s+.*)?$",
    "object": "el valor de la vida en el cristianismo y otras concepciones religiosas",
    "relation": "perspectivas y fundamentos atribuidos a las fuentes proporcionadas",
    "sourceRecordIds": [
      "f39c33c1-8e54-5fd9-8de6-24bec02c8d64"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-72979943",
    "grade": 3,
    "label": "talentos y capacidades personales",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:talentos[\\s,:]+y[\\s,:]+capacidades[\\s,:]+personales)(?:\\s+segun\\s+.*)?$",
    "object": "los talentos y capacidades personales descritos en los referentes educativos",
    "relation": "características y relaciones expresamente documentadas en los referentes dados",
    "sourceRecordIds": [
      "72979943-82f8-570e-85a7-e16eb051fe69"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-2351ed22",
    "grade": 3,
    "label": "el sentido del trabajo",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+sentido[\\s,:]+del[\\s,:]+trabajo)(?:\\s+segun\\s+.*)?$",
    "object": "el sentido del trabajo según los referentes",
    "relation": "afirmaciones, condiciones y aportes documentados en los textos proporcionados",
    "sourceRecordIds": [
      "2351ed22-4f7a-5c5b-827e-084af8cf4232"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-c69a2643",
    "grade": 3,
    "label": "el trabajo como servicio",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+trabajo[\\s,:]+como[\\s,:]+servicio)(?:\\s+segun\\s+.*)?$",
    "object": "el trabajo como servicio según los referentes",
    "relation": "acciones, aportes y relaciones documentados por las fuentes proporcionadas",
    "sourceRecordIds": [
      "c69a2643-6a0f-5099-8d71-1bdb14432875"
    ],
    "pdfPages": [
      401
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-aa80e11d",
    "grade": 3,
    "label": "problemáticas y conflictos personales, familiares y sociales",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:problematicas[\\s,:]+y[\\s,:]+conflictos[\\s,:]+personales[\\s,:]+familiares[\\s,:]+y[\\s,:]+sociales)(?:\\s+segun\\s+.*)?$",
    "object": "las problemáticas y conflictos personales, familiares y sociales de los referentes educativos",
    "relation": "situaciones, causas y efectos expresamente documentados por los referentes dados",
    "sourceRecordIds": [
      "aa80e11d-c31c-5a13-bb08-6232910de29a"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-dc599b14",
    "grade": 3,
    "label": "relaciones de amistad y sus dificultades",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:relaciones[\\s,:]+de[\\s,:]+amistad[\\s,:]+y[\\s,:]+sus[\\s,:]+dificultades)(?:\\s+segun\\s+.*)?$",
    "object": "las relaciones de amistad y sus dificultades según los referentes",
    "relation": "interacciones, condiciones y dificultades documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "dc599b14-384e-5a20-bec3-eeff28eea4d2"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-746621df",
    "grade": 3,
    "label": "manejo de conflicto en la escuela, familia y con amistades",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:manejo[\\s,:]+de[\\s,:]+conflicto[\\s,:]+en[\\s,:]+la[\\s,:]+escuela[\\s,:]+familia[\\s,:]+y[\\s,:]+con[\\s,:]+amistades)(?:\\s+segun\\s+.*)?$",
    "object": "el manejo de conflictos en escuela, familia y amistad según los referentes",
    "relation": "acciones, condiciones y consecuencias documentadas en los referentes educativos dados",
    "sourceRecordIds": [
      "746621df-ebbc-5b8b-b543-f6095aeec042"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-78f511dc",
    "grade": 3,
    "label": "valores que predicó y vivió Jesús de Nazaret",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+que[\\s,:]+predico[\\s,:]+y[\\s,:]+vivio[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret)(?:\\s+segun\\s+.*)?$",
    "object": "los valores predicados y vividos por Jesús de Nazaret según los textos dados",
    "relation": "afirmaciones, acciones y episodios atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "78f511dc-5ea4-5386-b26c-119eada1e8df"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-4f06ba26",
    "grade": 3,
    "label": "valores de Jesús de Nazaret presentes en la cultura dominicana",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+de[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret[\\s,:]+presentes[\\s,:]+en[\\s,:]+la[\\s,:]+cultural[\\s,:]+dominicana|valores[\\s,:]+de[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret[\\s,:]+presentes[\\s,:]+en[\\s,:]+la[\\s,:]+cultura[\\s,:]+dominicana)(?:\\s+segun\\s+.*)?$",
    "object": "los valores atribuidos a Jesús presentes en la cultura dominicana",
    "relation": "contextos, ejemplos y evidencias documentados por las fuentes proporcionadas",
    "sourceRecordIds": [
      "4f06ba26-8719-5534-9eb6-c679e9b8e19d"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-9b5e74e5",
    "grade": 3,
    "label": "diálogo fraterno",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:dialogo[\\s,:]+fraterno)(?:\\s+segun\\s+.*)?$",
    "object": "el diálogo fraterno según los referentes",
    "relation": "interacciones, condiciones y efectos documentados por las fuentes proporcionadas",
    "sourceRecordIds": [
      "9b5e74e5-82ff-5285-b659-239a1dd8715d"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-026bcaaa",
    "grade": 3,
    "label": "ciencia, tecnología y desarrollo humano",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ciencia[\\s,:]+tecnologia[\\s,:]+y[\\s,:]+desarrollo[\\s,:]+humano)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre ciencia, tecnología y desarrollo humano",
    "relation": "aportes, condiciones y efectos documentados en los referentes dados",
    "sourceRecordIds": [
      "026bcaaa-4c24-5081-ac0b-7eb2cd5e95e3"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-19bb1501",
    "grade": 3,
    "label": "tecnología, persona y familia",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:tecnologia[\\s,:]+persona[\\s,:]+y[\\s,:]+familia)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre tecnología, persona y familia",
    "relation": "usos, condiciones y evidencias documentados por los referentes proporcionados",
    "sourceRecordIds": [
      "19bb1501-5726-527c-8ef1-5b5c05694bb2"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-f4ca7e6b",
    "grade": 3,
    "label": "relación entre tecnología y la naturaleza",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:relacion[\\s,:]+entre[\\s,:]+tecnologia[\\s,:]+y[\\s,:]+la[\\s,:]+naturaleza)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre tecnología y naturaleza",
    "relation": "relaciones y consecuencias documentadas por las fuentes proporcionadas",
    "sourceRecordIds": [
      "f4ca7e6b-de91-5a66-ba92-a9cb952b023f"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-c5e602bf",
    "grade": 3,
    "label": "valores de Jesús en torno al cuidado de la creación",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+de[\\s,:]+jesus[\\s,:]+en[\\s,:]+torno[\\s,:]+al[\\s,:]+cuidado[\\s,:]+de[\\s,:]+la[\\s,:]+creacion)(?:\\s+segun\\s+.*)?$",
    "object": "los valores de Jesús en torno al cuidado de la creación según los textos dados",
    "relation": "afirmaciones y acciones atribuidas a los referentes proporcionados",
    "sourceRecordIds": [
      "c5e602bf-f017-551d-bd24-7cfee5600d33"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-3cabe717",
    "grade": 3,
    "label": "medioambiente: nuestra casa común",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:medioambiente[\\s,:]+nuestra[\\s,:]+casa[\\s,:]+comun)(?:\\s+segun\\s+.*)?$",
    "object": "el medioambiente como casa común",
    "relation": "elementos, relaciones y condiciones documentados por los referentes educativos dados",
    "sourceRecordIds": [
      "3cabe717-dfe1-5245-9ca8-ff6ea2550645"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-ef7e70b6",
    "grade": 3,
    "label": "sostenibilidad medioambiental",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:sostenibilida[\\s,:]+y[\\s,:]+medioambiental|sostenibilidad[\\s,:]+medioambiental)(?:\\s+segun\\s+.*)?$",
    "object": "la sostenibilidad medioambiental",
    "relation": "acciones, condiciones y consecuencias documentadas en los referentes proporcionados",
    "sourceRecordIds": [
      "ef7e70b6-79f0-5797-9768-5d922213199c"
    ],
    "pdfPages": [
      402
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-5350273a",
    "grade": 3,
    "label": "religión y persona",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:religion[\\s,:]+y[\\s,:]+persona)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre religión y persona según las fuentes",
    "relation": "perspectivas, contextos y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "5350273a-d8c5-56cc-95f2-62551a30f15f"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-556e3068",
    "grade": 3,
    "label": "búsqueda del sentido de la vida",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:busqueda[\\s,:]+del[\\s,:]+sentido[\\s,:]+de[\\s,:]+la[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
    "object": "la búsqueda del sentido de la vida según los referentes",
    "relation": "interrogantes, perspectivas y fundamentos atribuidos a las fuentes proporcionadas",
    "sourceRecordIds": [
      "556e3068-d716-55dd-9a26-14315bb0208a"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  },
  {
    "id": "concept-5469dbf3",
    "grade": 3,
    "label": "respuestas religiosas a las grandes interrogantes de la vida",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:respuestas[\\s,:]+religiosas[\\s,:]+a[\\s,:]+las[\\s,:]+grandes[\\s,:]+interrogantes[\\s,:]+de[\\s,:]+la[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
    "object": "las respuestas religiosas a las grandes interrogantes de la vida",
    "relation": "perspectivas y fundamentos atribuidos a las fuentes proporcionadas",
    "sourceRecordIds": [
      "5469dbf3-7e4d-5484-bca0-10b9f79b83bf"
    ],
    "pdfPages": [
      403
    ],
    "planReferenceOnly": true,
    "conceptBrief": true
  }
]
