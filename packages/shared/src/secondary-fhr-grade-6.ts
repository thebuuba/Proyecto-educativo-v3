import type {FhrTopic} from './secondary-fhr'

/** Adaptaciones observables del sexto grado; fuentes y casos, sin evaluar fe privada. */
export const fhrGradeSixTopics:FhrTopic[]=[
  {
    "id": "gospel-report",
    "grade": 6,
    "label": "reportaje documentado sobre composición de evangelios",
    "match": "reportaje.*(?:composicion|evangelios)",
    "object": "el reportaje sobre {choice} de los evangelios",
    "relation": "los componentes expresamente pedidos y las evidencias atribuidas a los referentes proporcionados",
    "sourceRecordIds": [
      "8f4fef5c-9798-5731-84fb-87f7ae020211"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION",
    "choices": [
      [
        "composicion",
        "composición"
      ],
      [
        "contexto(?: historico)?",
        "contexto histórico"
      ],
      [
        "caracteristicas",
        "características"
      ],
      [
        "veracidad",
        "afirmaciones de veracidad"
      ]
    ],
    "choiceDefault": "los componentes expresamente dados"
  },
  {
    "id": "gospel-comparison",
    "grade": 6,
    "label": "cuadro comparativo de evangelios dados",
    "match": "cuadro comparativo.*evangelios?",
    "object": "el cuadro comparativo de características de los evangelios de {choice}",
    "relation": "dimensiones comunes, semejanzas y diferencias sustentadas en los textos proporcionados",
    "sourceRecordIds": [
      "cb872fbc-36bd-5c6f-97c9-d8ca37ee1459"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION",
    "choices": [
      [
        "(?:cuatro evangelios|(?:y\\s*)?mateo(?:\\s*\\d+)?)",
        "Mateo"
      ],
      [
        "(?:cuatro evangelios|(?:y\\s*)?marcos(?:\\s*\\d+)?)",
        "Marcos"
      ],
      [
        "(?:cuatro evangelios|(?:y\\s*)?lucas(?:\\s*\\d+)?)",
        "Lucas"
      ],
      [
        "(?:cuatro evangelios|(?:y\\s*)?juan(?:\\s*\\d+)?)",
        "Juan"
      ]
    ],
    "choiceDefault": "los autores expresamente trabajados"
  },
  {
    "id": "gospel-emphasis-roundtable",
    "grade": 6,
    "label": "mesa redonda sobre énfasis de evangelistas",
    "match": "mesa redonda.*enfasis.*evangelista",
    "object": "la mesa redonda sobre los énfasis de evangelistas en la vida de Jesús según los textos",
    "relation": "intervenciones, perspectivas y argumentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "1f514664-3ddc-5522-8210-f5dd5549b5cd"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true,
    "objects": {
      "DEBATE": "los énfasis de evangelistas en la vida de Jesús según los textos"
    }
  },
  {
    "id": "new-testament-values",
    "grade": 6,
    "label": "principios de convivencia en escritos del Nuevo Testamento",
    "match": "principios y valores.*convivencia.*nuevo testamento",
    "object": "los principios y valores de convivencia del mensaje de Jesús en los escritos expresamente dados",
    "relation": "afirmaciones, contextos y evidencias atribuidos a {choice}",
    "sourceRecordIds": [
      "f4326f5e-6784-5b35-bcc8-028a69259e04",
      "2a10d83c-7ee1-5026-9794-8c19d36c001d"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "hechos",
        "Hechos"
      ],
      [
        "cartas",
        "las Cartas"
      ],
      [
        "apocalipsis",
        "Apocalipsis"
      ]
    ],
    "choiceDefault": "los escritos expresamente proporcionados"
  },
  {
    "id": "new-testament-map",
    "grade": 6,
    "label": "mapa conceptual de escritos del Nuevo Testamento",
    "match": "mapas? conceptual(?:es)?.*nuevo testamento",
    "object": "el mapa conceptual de los escritos del Nuevo Testamento expresamente trabajados",
    "relation": "{choice} documentados por los referentes proporcionados",
    "sourceRecordIds": [
      "85f88ea4-dbe6-5d75-8bf0-41335be793b7"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION",
    "choices": [
      [
        "fecha",
        "la fecha de composición"
      ],
      [
        "lugar",
        "el lugar de composición"
      ],
      [
        "autores|autoria",
        "la autoría"
      ],
      [
        "intenciones",
        "las intenciones"
      ],
      [
        "destinatarios",
        "los destinatarios"
      ]
    ],
    "choiceDefault": "los componentes expresamente pedidos"
  },
  {
    "id": "christian-conversation-panel",
    "grade": 6,
    "label": "panel documentado de convivencia cristiana",
    "match": "panel.*(?:iglesias|convivencia armonica)",
    "object": "el panel sobre perspectivas cristianas de convivencia armónica y respetuosa según los testimonios",
    "relation": "propósito, preguntas y secuencia de intervenciones fundamentados en los referentes proporcionados",
    "sourceRecordIds": [
      "d2f102e3-9a1d-5299-9c76-ded724e67ede"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true,
    "objects": {
      "DEBATE": "perspectivas cristianas de convivencia armónica y respetuosa según los testimonios"
    }
  },
  {
    "id": "jesus-media-compilation",
    "grade": 6,
    "label": "compilación de medios dados sobre Jesús en cultura",
    "match": "(?:compila|compilacion).*jesus.*cultura",
    "object": "la compilación sobre Jesús en la cultura mediante {choice}",
    "relation": "selección, organización y relación de los medios con las evidencias proporcionadas",
    "sourceRecordIds": [
      "54fa19d2-8a5c-5d47-b038-94838d49ced8"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true,
    "productType": "PORTFOLIO",
    "choices": [
      [
        "ilustraciones",
        "las ilustraciones proporcionadas"
      ],
      [
        "(?:recursos )?audiovisuales",
        "los recursos audiovisuales proporcionados"
      ]
    ],
    "choiceDefault": "los medios expresamente proporcionados"
  },
  {
    "id": "gospel-learning-celebration",
    "grade": 6,
    "label": "celebración de productos sobre mensaje evangélico",
    "match": "celebracion.*mensaje evangelico",
    "object": "la celebración para presentar aprendizajes sobre el mensaje evangélico según los referentes",
    "relation": "propósito, secuencia y relación de productos con las evidencias proporcionadas",
    "sourceRecordIds": [
      "a4305742-b6c6-5ebb-b1bc-bcfe10a4600f"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true
  },
  {
    "id": "jesus-decisions-texts",
    "grade": 6,
    "label": "decisiones de Jesús según textos dados",
    "match": "decisiones.*jesus.*(?:mateo|marcos|juan)(?:\\s*\\d+)?",
    "object": "las decisiones de Jesús descritas en los textos expresamente proporcionados",
    "relation": "episodios, acciones y evidencias atribuidos a {choice}",
    "sourceRecordIds": [
      "c411dde8-d2f9-5797-93a4-1e43d736ef99"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "(?:y\\s*)?mateo(?:\\s*\\d+)?",
        "Mateo"
      ],
      [
        "(?:y\\s*)?marcos(?:\\s*\\d+)?",
        "Marcos"
      ],
      [
        "(?:y\\s*)?lucas(?:\\s*\\d+)?",
        "Lucas"
      ],
      [
        "(?:y\\s*)?juan(?:\\s*\\d+)?",
        "Juan"
      ]
    ],
    "choiceDefault": "los textos expresamente proporcionados"
  },
  {
    "id": "jesus-social-decisions-panel",
    "grade": 6,
    "label": "panel de decisiones atribuidas a Jesús ante casos",
    "match": "panel.*decisiones.*jesus",
    "object": "el panel sobre decisiones atribuidas a Jesús ante las situaciones sociales dadas",
    "relation": "intervenciones, argumentos y fundamentos atribuidos a los textos y casos proporcionados",
    "sourceRecordIds": [
      "10310edb-2e77-5c89-a24b-1c316398f770"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true,
    "objects": {
      "DEBATE": "decisiones atribuidas a Jesús ante las situaciones sociales dadas"
    }
  },
  {
    "id": "jesus-originality",
    "grade": 6,
    "label": "novedad de propuesta de Jesús según Lucas",
    "match": "novedad y originalidad.*propuesta.*jesus",
    "object": "la novedad y originalidad de la propuesta de Jesús según Lucas6:27–36 dado",
    "relation": "afirmaciones, contextos y fundamentos atribuidos al texto proporcionado",
    "sourceRecordIds": [
      "8d83a20b-93ed-5e7f-a2fe-8f14b0abfcd8"
    ],
    "pdfPages": [
      421
    ],
    "planReferenceOnly": true
  },
  {
    "id": "life-culture-arguments",
    "grade": 6,
    "label": "argumentos sobre cultura de vida y muerte según fuentes",
    "match": "causas y consecuencias.*cultura.*vida.*muerte",
    "object": "las causas y consecuencias de las denominadas cultura de vida y de muerte según las fuentes",
    "relation": "afirmaciones, contextos y argumentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "892bf135-715f-5718-8cd4-71c3ca0fbaf6"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "life-institutions",
    "grade": 6,
    "label": "referentes documentados de cultura de vida",
    "match": "(?:instituciones|leyes|iniciativas).*cultura.*vida",
    "object": "los referentes de cultura de vida: {choice}",
    "relation": "funciones, disposiciones y relaciones atribuidas a los referentes dados",
    "sourceRecordIds": [
      "5a90859d-63b2-539a-a845-293a008831c1",
      "3a668ce1-0960-53c2-a0b3-c63ebb303d43"
    ],
    "pdfPages": [
      422,
      423
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "instituciones",
        "las instituciones documentadas"
      ],
      [
        "leyes",
        "las leyes proporcionadas"
      ],
      [
        "iniciativas",
        "las iniciativas documentadas"
      ]
    ],
    "choiceDefault": "los componentes expresamente trabajados"
  },
  {
    "id": "life-culture-celebration",
    "grade": 6,
    "label": "celebración de productos sobre vida y armonía",
    "match": "celebracion.*cultura.*vida.*armonia",
    "object": "la celebración para presentar productos sobre cultura de vida y relaciones armónicas",
    "relation": "propósito, secuencia y relación de productos con las evidencias proporcionadas",
    "sourceRecordIds": [
      "dff2b1d7-18d2-5707-8756-72e9e12b944b"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "problem-solving-values",
    "grade": 6,
    "label": "valores documentados para resolver problemas",
    "match": "valores y actitudes.*(?:resolucion|resolver).*problemas",
    "object": "los valores y actitudes para resolver problemas descritos en los casos educativos",
    "relation": "acciones, condiciones y consecuencias documentadas por los referentes dados",
    "sourceRecordIds": [
      "be8c60de-1261-5e8b-a25d-c80955152c10"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true,
    "excludeWhen": "cristian|biblic"
  },
  {
    "id": "christian-problem-solving",
    "grade": 6,
    "label": "valores cristianos ante problemas según casos",
    "match": "valores y actitudes.*cristian(?:ismo|os).*resolv(?:er|iendo)|valores y actitudes.*cristianismo.*resolucion",
    "object": "los valores y actitudes cristianos ante problemas escolares y familiares según los referentes",
    "relation": "acciones, contextos y evidencias documentados por los casos proporcionados",
    "sourceRecordIds": [
      "1c98f62d-b4b5-5e6d-a821-975702265288"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "biblical-conflict-growth",
    "grade": 6,
    "label": "valores bíblicos ante conflictos y crecimiento comunitario",
    "match": "textos biblicos.*valores.*conflictos|valores.*conflictos.*crecimiento",
    "object": "los valores y actitudes ante conflictos y crecimiento comunitario según los textos dados",
    "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "e77af75c-83d2-5ed2-9c60-dd42beca528b"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "community-solutions-resources",
    "grade": 6,
    "label": "recursos para resolver situaciones y crecimiento comunitario",
    "match": "recursos.*resolucion.*situaciones",
    "object": "los recursos escritos para resolver situaciones y favorecer crecimiento comunitario según los casos",
    "relation": "mensajes, acciones y evidencias sustentados en los referentes proporcionados",
    "sourceRecordIds": [
      "209e09f7-7c54-56d6-a9cb-191b04841bab"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION"
  },
  {
    "id": "politics-clientelism",
    "grade": 6,
    "label": "acción política y clientelismo según fuentes",
    "match": "accion politica.*clientelismo",
    "object": "las perspectivas sobre acción política y clientelismo dominicano y su impacto social según las fuentes",
    "relation": "afirmaciones, condiciones y argumentos sustentados en los referentes proporcionados",
    "sourceRecordIds": [
      "9331ebde-a7fe-5a1c-b1df-3f506276a914"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "political-ethics-proclamation",
    "grade": 6,
    "label": "proclama de criterios éticos para política",
    "match": "proclama.*criterios eticos.*politica",
    "object": "la proclama de criterios éticos para política dominicana según los referentes",
    "relation": "afirmaciones, razones y evidencias sustentadas en las fuentes proporcionadas",
    "sourceRecordIds": [
      "4f44a828-df15-58b2-96a6-1de444af2420"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION"
  },
  {
    "id": "biblical-phrases-scene-plan",
    "grade": 6,
    "label": "plan de representación de frases bíblicas ante problemas",
    "match": "representacion.*frases biblicas",
    "object": "la representación de frases bíblicas ante problemas personales, familiares y comunitarios de los casos",
    "relation": "propósito, acciones y secuencia sustentados en los textos proporcionados",
    "sourceRecordIds": [
      "fcb95ef1-add6-5c51-a229-4071df43b9a9"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "christian-values-celebration",
    "grade": 6,
    "label": "celebración de productos sobre valores y convivencia",
    "match": "celebracion.*valores cristianos.*convivencia",
    "object": "la celebración para presentar aprendizajes sobre valores cristianos y convivencia según los textos",
    "relation": "propósito, secuencia y relación de productos con los referentes proporcionados",
    "sourceRecordIds": [
      "a273dbeb-b01d-5e5c-bb58-94db91e5d7a4"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "documented-skills",
    "grade": 6,
    "label": "habilidades y cualidades en casos educativos",
    "match": "habilidades.*cualidades.*valores",
    "object": "las habilidades, cualidades, valores y actitudes descritas en los casos educativos",
    "relation": "características, condiciones y relaciones documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "1fcd0d7a-b25f-545f-8fa5-50a452b24e96"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "profession-qualities",
    "grade": 6,
    "label": "cualidades y valores relacionados con profesiones",
    "match": "cualidades.*valores.*profesiones",
    "object": "las cualidades, valores y actitudes relacionados con profesiones y oficios de los referentes",
    "relation": "dimensiones comunes, semejanzas y diferencias sustentadas en los registros proporcionados",
    "sourceRecordIds": [
      "28688ec2-f43c-5c72-9846-d9061ab5d884"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "documented-careers",
    "grade": 6,
    "label": "trayectorias y metas documentadas",
    "match": "personas.*metas.*(?:profesiones|oficio)",
    "object": "las trayectorias, metas, profesiones y oficios de las personas documentadas en los referentes",
    "relation": "acciones, condiciones y resultados descritos por los registros proporcionados",
    "sourceRecordIds": [
      "9f0fb5a5-f9ed-506c-878f-ecf9ffb36e38"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "vocational-factors",
    "grade": 6,
    "label": "factores y criterios de elección vocacional",
    "match": "factores y criterios.*eleccion vocacional",
    "object": "los factores y criterios de elección vocacional según los referentes educativos",
    "relation": "condiciones, alternativas y relaciones documentadas por las fuentes proporcionadas",
    "sourceRecordIds": [
      "bb9b9921-4e2c-5c85-b3ce-9ea3e93719bc"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "career-preferences-project",
    "grade": 6,
    "label": "proyecto sobre preferencias profesionales documentadas",
    "match": "proyecto.*profesiones.*inclinaciones",
    "object": "el proyecto sobre preferencias profesionales e inclinaciones documentadas en el caso educativo",
    "relation": "organización, condiciones y relaciones sustentadas en los registros proporcionados",
    "sourceRecordIds": [
      "052ca1e8-3890-51a8-8fe8-675afeca44bb"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true,
    "productType": "PROJECT"
  },
  {
    "id": "biblical-vocations",
    "grade": 6,
    "label": "vocaciones de personajes bíblicos según textos",
    "match": "vocacion.*(?:abraham|moises|discipulos|pablo)",
    "object": "la vocación de {choice} según los textos dados",
    "relation": "episodios, decisiones y fundamentos atribuidos a los textos proporcionados",
    "sourceRecordIds": [
      "9c0e76ba-b1f7-53fd-88e5-de4e905cc8ca"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "abraham",
        "Abraham"
      ],
      [
        "moises",
        "Moisés"
      ],
      [
        "discipulos",
        "los primeros discípulos"
      ],
      [
        "pablo",
        "Pablo"
      ]
    ],
    "choiceDefault": "los personajes expresamente trabajados"
  },
  {
    "id": "vocation-social-criteria",
    "grade": 6,
    "label": "criterios vocacionales y compromiso social según casos",
    "match": "criterios.*desafios.*eleccion vocacional",
    "object": "los criterios, valores y desafíos de elección vocacional y compromiso social según los casos",
    "relation": "condiciones, alternativas y consecuencias documentadas por los referentes educativos proporcionados",
    "sourceRecordIds": [
      "a88047e5-2d6c-5f4d-9a91-eb8f63926925"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true
  },
  {
    "id": "life-project-values-table",
    "grade": 6,
    "label": "tabla de valores para proyecto de vida según caso",
    "match": "tabla.*valores.*proyecto de vida",
    "object": "la tabla de valores y actitudes vinculados al proyecto de vida del caso dado",
    "relation": "organización y relaciones justificadas mediante los referentes proporcionados",
    "sourceRecordIds": [
      "bae772c8-23ce-5b46-adaa-ec4759a4d945"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION"
  },
  {
    "id": "life-project-case",
    "grade": 6,
    "label": "proyecto de vida formulado para caso educativo",
    "match": "construye.*proyecto de vida|proyecto de vida.*(?:actitudes|capacidades|preferencias)",
    "object": "el proyecto de vida formulado para las condiciones y preferencias del caso educativo",
    "relation": "metas, acciones y condiciones justificadas mediante los referentes proporcionados",
    "sourceRecordIds": [
      "248150e8-e729-5bcb-94db-563cdabca67b"
    ],
    "pdfPages": [
      422
    ],
    "planReferenceOnly": true,
    "productType": "PROJECT",
    "excludeWhen": "tabla|celebracion"
  },
  {
    "id": "realization-values-scene",
    "grade": 6,
    "label": "representación de valores y realización según casos",
    "match": "representa.*valores.*realizacion",
    "object": "el caso proporcionado de acciones y valores que favorecen o desfavorecen realización en los ámbitos dados",
    "relation": "acciones, decisiones y consecuencias reconocibles según las condiciones del caso",
    "sourceRecordIds": [
      "b8b9dc0b-63b1-5f18-a028-3f6e862834ba"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "life-project-celebration",
    "grade": 6,
    "label": "celebración para presentar proyectos de vida dados",
    "match": "celebracion.*proyectos de vida",
    "object": "la celebración para presentar los proyectos de vida proporcionados",
    "relation": "propósito, secuencia y relación de los proyectos con los referentes dados",
    "sourceRecordIds": [
      "5922297a-7e38-5fac-91d3-70f3ba7e46e4"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "technology-data",
    "grade": 6,
    "label": "datos documentados de presencia tecnológica",
    "match": "datos.*presencia.*tecnologia",
    "object": "los datos sobre presencia de tecnología documentados por los referentes",
    "relation": "selección, categorías y relaciones sustentadas en los registros proporcionados",
    "sourceRecordIds": [
      "1fb6b637-dd0b-5870-a84a-d8fb72af5d36"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "science-benefits-verification",
    "grade": 6,
    "label": "beneficios de ciencia y tecnología según registros",
    "match": "beneficios.*ciencia.*tecnologia.*desarrollo humano",
    "object": "los beneficios de ciencia y tecnología para desarrollo humano indicados en el registro dado",
    "relation": "afirmaciones y evidencias verificables según las condiciones del registro proporcionado",
    "sourceRecordIds": [
      "d8c5fcc8-29c7-5d29-ad11-2740714bddb0"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "digital-gap",
    "grade": 6,
    "label": "causas y consecuencias de brecha digital",
    "match": "causas y consecuencias.*brecha digital",
    "object": "las causas y consecuencias de brecha digital y acceso a tecnología según las fuentes",
    "relation": "condiciones, relaciones y argumentos sustentados en los referentes proporcionados",
    "sourceRecordIds": [
      "71e8b156-033d-51a6-8a07-7c285d65ca53"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "social-networks-panel",
    "grade": 6,
    "label": "panel documentado de redes sociales",
    "match": "panel.*(?:riesgos|ventajas|desventajas).*redes sociales",
    "object": "el panel sobre {choice} de redes sociales según los referentes",
    "relation": "propósito, secuencia y relación de intervenciones con las evidencias proporcionadas",
    "sourceRecordIds": [
      "e92ebab5-d817-5700-b1bb-dd55fc96a556"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "riesgos",
        "los riesgos"
      ],
      [
        "ventajas",
        "las ventajas"
      ],
      [
        "desventajas",
        "las desventajas"
      ]
    ],
    "choiceDefault": "los aspectos expresamente pedidos",
    "objects": {
      "DEBATE": "{choice} de redes sociales según los referentes"
    }
  },
  {
    "id": "science-ethics-principles",
    "grade": 6,
    "label": "principios éticos de ciencia y tecnología",
    "match": "principios eticos.*(?:ciencia|tecnologia)",
    "object": "los principios éticos de uso de ciencia y tecnología según los referentes",
    "relation": "normas, fundamentos y consecuencias documentadas por las fuentes proporcionadas",
    "sourceRecordIds": [
      "2117b170-b1d4-59a9-ab49-d3a2a927d2d4"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION"
  },
  {
    "id": "technology-campaign",
    "grade": 6,
    "label": "campaña de oportunidades y riesgos tecnológicos",
    "match": "campana.*oportunidades y riesgos.*tecnolog(?:ia|icos?)",
    "object": "el prototipo de campaña escrita sobre oportunidades y riesgos tecnológicos en {choice}",
    "relation": "mensajes, condiciones y evidencias sustentados en los referentes proporcionados",
    "sourceRecordIds": [
      "d1d362ff-7f33-5a3f-abba-1e04e4280fa8"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION",
    "choices": [
      [
        "familiar",
        "el ámbito familiar"
      ],
      [
        "social",
        "el ámbito social"
      ],
      [
        "laboral",
        "el ámbito laboral"
      ]
    ],
    "choiceDefault": "los contextos expresamente dados"
  },
  {
    "id": "technology-ethics-celebration",
    "grade": 6,
    "label": "organización festiva de productos sobre ética tecnológica",
    "match": "organizacion festiva.*criterios eticos",
    "object": "la organización festiva para presentar productos sobre criterios éticos de ciencia y tecnología",
    "relation": "propósito, secuencia y relación de productos con evidencias de los referentes proporcionados",
    "sourceRecordIds": [
      "51db0265-990b-5769-9b84-548941da6d43"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "jesus-life-nature-scene",
    "grade": 6,
    "label": "escenas evangélicas de defensa de vida y naturaleza",
    "match": "dramatiza.*jesus.*vida.*naturaleza",
    "object": "las escenas de Jesús defendiendo vida y naturaleza según los evangelios dados",
    "relation": "acciones, decisiones y contextos reconocibles de los textos proporcionados",
    "sourceRecordIds": [
      "850a9357-1222-5bbd-9148-103e70739291"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "local-social-ecological-problems",
    "grade": 6,
    "label": "problemas sociales y ecológicos documentados",
    "match": "problematicas sociales y ecologicas",
    "object": "las problemáticas sociales y ecológicas descritas en los referentes locales dados",
    "relation": "condiciones, causas y efectos documentados por las fuentes proporcionadas",
    "sourceRecordIds": [
      "afc1abec-6fa3-58b9-bca2-6d6781ee61bf"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "environmental-deterioration-arguments",
    "grade": 6,
    "label": "causas y consecuencias de deterioro ambiental",
    "match": "causas y consecuencias.*deterioro.*medioambiente",
    "object": "las causas y consecuencias del deterioro medioambiental según las fuentes",
    "relation": "condiciones, relaciones y argumentos sustentados en los referentes proporcionados",
    "sourceRecordIds": [
      "88a300f9-3609-5409-8d57-7c0fc2207cf2"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "sustainability-proposals",
    "grade": 6,
    "label": "alternativas para cuidado y desarrollo sostenible",
    "match": "alternativas.*cuidado.*medioambiente.*desarrollo sostenible",
    "object": "las alternativas de cuidado del medioambiente y desarrollo sostenible del caso dado",
    "relation": "acciones, condiciones y consecuencias justificadas mediante los referentes proporcionados",
    "sourceRecordIds": [
      "11972667-faeb-5f7c-83a5-47c221c925cd"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION"
  },
  {
    "id": "environmental-policy-celebration",
    "grade": 6,
    "label": "celebración de productos ambientales documentados",
    "match": "celebracion.*(?:politicas|proyectos|programas).*ambiental(?:es)?",
    "object": "la celebración para presentar {choice} ambientales documentados",
    "relation": "propósito, secuencia y relación de productos con los referentes proporcionados",
    "sourceRecordIds": [
      "40c17fdc-4775-5819-8df2-423e2379751c"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true,
    "choices": [
      [
        "politicas",
        "las políticas"
      ],
      [
        "proyectos",
        "los proyectos"
      ],
      [
        "programas",
        "los programas"
      ]
    ],
    "choiceDefault": "los productos expresamente proporcionados"
  },
  {
    "id": "life-plans-presentation",
    "grade": 6,
    "label": "planes y proyectos de vida documentados",
    "match": "planes y proyectos.*vida",
    "object": "los planes y proyectos de vida descritos en los casos educativos",
    "relation": "metas, acciones y condiciones documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "ade8bd3d-7dc1-51e0-acae-f020e64e64a8"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "beatitudes-art",
    "grade": 6,
    "label": "representación artística de Bienaventuranzas según Mateo",
    "match": "representa.*bienaventuranzas|representacion artistica.*bienaventuranzas",
    "object": "las Bienaventuranzas según Mateo5:3–12 proporcionado",
    "relation": "acciones, relaciones y sentidos reconocibles de los referentes dados",
    "sourceRecordIds": [
      "c6bb307f-bc01-5d4d-9fdc-dcce10096100"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true,
    "objects": {
      "PERFORMANCE": "las Bienaventuranzas según Mateo5:3–12 proporcionado mediante la representación artística solicitada"
    }
  },
  {
    "id": "youth-problems-project",
    "grade": 6,
    "label": "proyecto de alternativas para problema juvenil dado",
    "match": "proyecto.*alternativas.*problema.*(?:jovenes|juvenil|desempleo)",
    "object": "el proyecto de alternativas para {choice}",
    "relation": "metas, acciones, condiciones y consecuencias justificadas por el caso proporcionado",
    "sourceRecordIds": [
      "48bc1ad9-4d1d-52b1-9f18-58975cc50d51"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true,
    "productType": "PROJECT",
    "choices": [
      [
        "desempleo",
        "el desempleo juvenil"
      ],
      [
        "sexualidad",
        "la situación de sexualidad del caso"
      ],
      [
        "tecnologia",
        "la situación tecnológica del caso"
      ],
      [
        "musica",
        "la situación de música del caso"
      ],
      [
        "moda",
        "la situación de moda del caso"
      ],
      [
        "formacion academica",
        "la situación de formación académica del caso"
      ],
      [
        "religion",
        "la situación religiosa del caso"
      ]
    ],
    "choiceDefault": "el problema juvenil expresamente trabajado"
  },
  {
    "id": "jesus-youth-values-panel",
    "grade": 6,
    "label": "panel de valores de Jesús en casos juveniles",
    "match": "panel.*jovenes.*valores.*jesus",
    "object": "el panel sobre valores del estilo de vida de Jesús en los casos juveniles proporcionados",
    "relation": "propósito, secuencia y relación de intervenciones con los referentes dados",
    "sourceRecordIds": [
      "25923dfd-38d8-587b-afac-1ce347f564dc"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true,
    "objects": {
      "DEBATE": "valores del estilo de vida de Jesús en los casos juveniles proporcionados"
    }
  },
  {
    "id": "youth-solidarity-report",
    "grade": 6,
    "label": "reportaje de iniciativas juveniles documentadas",
    "match": "reportaje.*iniciativas y proyectos.*(?:jovenes|juveniles)",
    "object": "el reportaje sobre iniciativas y proyectos juveniles documentados del país y Latinoamérica",
    "relation": "afirmaciones, contextos y evidencias atribuidos a las fuentes proporcionadas",
    "sourceRecordIds": [
      "f8b7a08e-23ef-57b0-a0fd-5f51883cd0d8"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true,
    "productType": "WRITTEN_PRODUCTION"
  },
  {
    "id": "jesus-projects-celebration",
    "grade": 6,
    "label": "celebración de productos sobre enseñanzas y proyectos",
    "match": "celebracion.*ensenanzas.*jesus.*(?:planes|proyectos)",
    "object": "la celebración para presentar productos sobre enseñanzas de Jesús y proyectos juveniles documentados",
    "relation": "propósito, secuencia y relación de los productos con los referentes proporcionados",
    "sourceRecordIds": [
      "2a3e21ef-d8e6-53d8-98be-49837b9123d1"
    ],
    "pdfPages": [
      423
    ],
    "planReferenceOnly": true
  },
  {
    "id": "concept-07c1030f",
    "grade": 6,
    "label": "los evangelios: Conformación y características",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:los[\\s,:]+evangelios[\\s,:]+conformacion[\\s,:]+y[\\s,:]+caracteristicas)(?:\\s+segun\\s+.*)?$",
    "object": "la conformación y características de los evangelios según las fuentes",
    "relation": "composición, contextos y características documentados por los referentes proporcionados",
    "sourceRecordIds": [
      "07c1030f-b0f8-52e6-ad91-a803127e28bc"
    ],
    "pdfPages": [
      421
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-b6c601bc",
    "grade": 6,
    "label": "escritos del Nuevo Testamento",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:escritos[\\s,:]+del[\\s,:]+nuevo[\\s,:]+testamento)(?:\\s+segun\\s+.*)?$",
    "object": "los escritos del Nuevo Testamento expresamente trabajados",
    "relation": "identificación, contextos y mensajes atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "b6c601bc-d30a-5e1f-920e-aed92b37b1f6"
    ],
    "pdfPages": [
      421
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-e62ea6c0",
    "grade": 6,
    "label": "mensajes de Jesús de Nazaret",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:mensajes[\\s,:]+de[\\s,:]+jesus[\\s,:]+de[\\s,:]+nazaret)(?:\\s+segun\\s+.*)?$",
    "object": "los mensajes de Jesús de Nazaret según los textos dados",
    "relation": "afirmaciones, contextos y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "e62ea6c0-9806-5e74-9788-8780d4e639f9"
    ],
    "pdfPages": [
      421
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-75321787",
    "grade": 6,
    "label": "jerarquía de los valores",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:jerarquia[\\s,:]+de[\\s,:]+los[\\s,:]+valores)(?:\\s+segun\\s+.*)?$",
    "object": "las jerarquías de valores descritas en los referentes educativos",
    "relation": "criterios, relaciones y fundamentos expresamente documentados por las fuentes dadas",
    "sourceRecordIds": [
      "75321787-75ab-5158-bdb7-96c6c9039da1"
    ],
    "pdfPages": [
      421
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-1f70e908",
    "grade": 6,
    "label": "ética y moral en la transformación de la realidad",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:etica[\\s,:]+y[\\s,:]+moral[\\s,:]+en[\\s,:]+la[\\s,:]+transformacion[\\s,:]+de[\\s,:]+la[\\s,:]+realidad)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre ética, moral y transformación de la realidad según las fuentes",
    "relation": "afirmaciones, acciones y consecuencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "1f70e908-56ca-5d15-8a81-f4deabf947be"
    ],
    "pdfPages": [
      421
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-253f1db9",
    "grade": 6,
    "label": "cultura de la vida: retos y alternativas",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:cultura[\\s,:]+de[\\s,:]+la[\\s,:]+vida[\\s,:]+retos[\\s,:]+y[\\s,:]+alternativas)(?:\\s+segun\\s+.*)?$",
    "object": "los retos y alternativas de cultura de vida según las fuentes",
    "relation": "perspectivas, condiciones y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "253f1db9-84f3-58df-973a-60af0fc04e08"
    ],
    "pdfPages": [
      421
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-f459b00a",
    "grade": 6,
    "label": "jesús, fuente de fe y vida cristiana",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:jesus[\\s,:]+fuente[\\s,:]+de[\\s,:]+fe[\\s,:]+y[\\s,:]+vida[\\s,:]+cristiana)(?:\\s+segun\\s+.*)?$",
    "object": "Jesús como fuente de fe y vida cristiana según los textos dados",
    "relation": "afirmaciones, episodios y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "f459b00a-eeca-5932-9df9-2844dd884f0c"
    ],
    "pdfPages": [
      421
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-f3da6b2c",
    "grade": 6,
    "label": "resolución de problemas",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:resolucion[\\s,:]+de[\\s,:]+problemas)(?:\\s+segun\\s+.*)?$",
    "object": "la resolución de problemas según los casos educativos",
    "relation": "condiciones, alternativas y consecuencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "f3da6b2c-45be-548f-9154-888322160f3c"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-c3a91f0b",
    "grade": 6,
    "label": "valores y actitudes del cristianismo",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+y[\\s,:]+actitudes[\\s,:]+del[\\s,:]+cristianismo)(?:\\s+segun\\s+.*)?$",
    "object": "los valores y actitudes del cristianismo según los textos dados",
    "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "c3a91f0b-04cd-5f1e-8846-a8f9e4fea8f2"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-fa312225",
    "grade": 6,
    "label": "ética y promoción de la persona",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:etica[\\s,:]+y[\\s,:]+promocion[\\s,:]+de[\\s,:]+la[\\s,:]+persona)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre ética y promoción de la persona según las fuentes",
    "relation": "condiciones, acciones y consecuencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "fa312225-a0df-5ef3-af6f-835dbe3f49ec"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-effd1705",
    "grade": 6,
    "label": "política y bien común",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:politica[\\s,:]+y[\\s,:]+bien[\\s,:]+comun)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre política y bien común según las fuentes",
    "relation": "afirmaciones, condiciones y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "effd1705-6720-5ca7-bffd-f01925bc7454"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-f5768e4a",
    "grade": 6,
    "label": "inclinaciones hacia el trabajo",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:inclinaciones[\\s,:]+hacia[\\s,:]+el[\\s,:]+trabajo)(?:\\s+segun\\s+.*)?$",
    "object": "las inclinaciones hacia el trabajo descritas en los casos educativos",
    "relation": "características, condiciones y relaciones documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "f5768e4a-99d8-5d0f-a0cc-d95401ca07b4"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-18c73a80",
    "grade": 6,
    "label": "el trabajo como continuación de la creación de Dios",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:el[\\s,:]+trabajo[\\s,:]+como[\\s,:]+continuacion[\\s,:]+de[\\s,:]+la[\\s,:]+creacion[\\s,:]+de[\\s,:]+dios)(?:\\s+segun\\s+.*)?$",
    "object": "el trabajo como continuación de la creación de Dios según los textos",
    "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "18c73a80-196a-5783-804e-998e6dbd6c74"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-c6471112",
    "grade": 6,
    "label": "realización personal",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:realizacion[\\s,:]+personal)(?:\\s+segun\\s+.*)?$",
    "object": "la realización personal según los referentes educativos",
    "relation": "perspectivas, condiciones y relaciones documentadas por las fuentes proporcionadas",
    "sourceRecordIds": [
      "c6471112-e78d-5f09-bed9-a7f853378411"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-f6a3b8ae",
    "grade": 6,
    "label": "habilidades y actitudes vinculadas al mundo laboral",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:habilidades[\\s,:]+y[\\s,:]+actitudes[\\s,:]+vinculadas[\\s,:]+al[\\s,:]+mundo[\\s,:]+laboral)(?:\\s+segun\\s+.*)?$",
    "object": "las habilidades y actitudes vinculadas al mundo laboral según los referentes",
    "relation": "características, condiciones y relaciones expresamente documentadas por los casos educativos dados",
    "sourceRecordIds": [
      "f6a3b8ae-b5ad-535a-8d5d-3e0c53588448"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-7120c606",
    "grade": 6,
    "label": "proyecto de vida",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:proyecto[\\s,:]+de[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
    "object": "el proyecto de vida según los referentes educativos",
    "relation": "metas, acciones y condiciones documentadas por los casos proporcionados",
    "sourceRecordIds": [
      "7120c606-7048-5fd3-a7af-dc4023d67cfd"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-c28278f5",
    "grade": 6,
    "label": "ciencia, tecnología y calidad de vida",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ciencia[\\s,:]+tecnologia[\\s,:]+y[\\s,:]+calidad[\\s,:]+de[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre ciencia, tecnología y calidad de vida según las fuentes",
    "relation": "aportes, condiciones y efectos documentados por los referentes proporcionados",
    "sourceRecordIds": [
      "c28278f5-a426-5008-9f61-553c492836d2"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-0f3a92b8",
    "grade": 6,
    "label": "ética, avances científicos y tecnológicos",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:etica[\\s,:]+avances[\\s,:]+cientificos[\\s,:]+y[\\s,:]+tecnologicos)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre ética y avances científicos y tecnológicos según las fuentes",
    "relation": "afirmaciones, condiciones y consecuencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "0f3a92b8-3752-583e-8b4c-94b1f61b48e2"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-760a44e0",
    "grade": 6,
    "label": "ciencia, tecnología y relaciones interpersonales",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:ciencia[\\s,:]+tecnologia[\\s,:]+y[\\s,:]+relaciones[\\s,:]+interpersonales)(?:\\s+segun\\s+.*)?$",
    "object": "la relación entre ciencia, tecnología y relaciones interpersonales según las fuentes",
    "relation": "usos, condiciones y efectos documentados por los referentes proporcionados",
    "sourceRecordIds": [
      "760a44e0-068a-59ff-ad86-85f9af2d5463"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-df47eaca",
    "grade": 6,
    "label": "redes sociales: ventajas y desventajas",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:redes[\\s,:]+sociales[\\s,:]+ventajas[\\s,:]+y[\\s,:]+desventajas)(?:\\s+segun\\s+.*)?$",
    "object": "las ventajas y desventajas de redes sociales según los referentes educativos",
    "relation": "usos, condiciones y consecuencias documentadas por las fuentes proporcionadas",
    "sourceRecordIds": [
      "df47eaca-6627-58ce-a1fb-1605857bf507"
    ],
    "pdfPages": [
      422
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-842e6365",
    "grade": 6,
    "label": "iniciativas para la defensa de la casa común",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:iniciativas[\\s,:]+para[\\s,:]+la[\\s,:]+defensa[\\s,:]+de[\\s,:]+la[\\s,:]+casa[\\s,:]+comun)(?:\\s+segun\\s+.*)?$",
    "object": "las iniciativas de defensa de la casa común según las fuentes",
    "relation": "acciones, condiciones y consecuencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "842e6365-d1ef-5d6c-83bc-924164e92b8c"
    ],
    "pdfPages": [
      423
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-bafa16be",
    "grade": 6,
    "label": "políticas ambientales",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:politicas[\\s,:]+ambientales)(?:\\s+segun\\s+.*)?$",
    "object": "las políticas ambientales según los documentos dados",
    "relation": "disposiciones, contextos y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "bafa16be-982f-50a1-801f-9204042d2655"
    ],
    "pdfPages": [
      423
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-fc83c758",
    "grade": 6,
    "label": "desarrollo sostenible",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:desarrollo[\\s,:]+sostenible)(?:\\s+segun\\s+.*)?$",
    "object": "el desarrollo sostenible según las fuentes",
    "relation": "condiciones, acciones y consecuencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "fc83c758-b7fb-56f3-bb18-c8816c5ae0fd"
    ],
    "pdfPages": [
      423
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-e1f1e93a",
    "grade": 6,
    "label": "promoción y respeto a vida y al entorno natural",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:promocion[\\s,:]+y[\\s,:]+respeto[\\s,:]+a[\\s,:]+vida[\\s,:]+y[\\s,:]+al[\\s,:]+entorno[\\s,:]+natural)(?:\\s+segun\\s+.*)?$",
    "object": "la promoción y respeto de vida y entorno natural según las fuentes",
    "relation": "acciones, condiciones y consecuencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "e1f1e93a-1d00-56dd-b3ce-8d190b277b0c"
    ],
    "pdfPages": [
      423
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-67d47931",
    "grade": 6,
    "label": "valores del estilo de vida de Jesús",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:valores[\\s,:]+del[\\s,:]+estilo[\\s,:]+de[\\s,:]+vida[\\s,:]+de[\\s,:]+jesus)(?:\\s+segun\\s+.*)?$",
    "object": "los valores del estilo de vida de Jesús según los textos dados",
    "relation": "acciones, relaciones y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "67d47931-7be7-5305-8800-eaaae9cc128a"
    ],
    "pdfPages": [
      423
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-ab2c0acc",
    "grade": 6,
    "label": "planes y proyectos de vida",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:planes[\\s,:]+y[\\s,:]+proyectos[\\s,:]+de[\\s,:]+vida)(?:\\s+segun\\s+.*)?$",
    "object": "los planes y proyectos de vida según los referentes educativos",
    "relation": "metas, acciones y condiciones documentadas por los casos proporcionados",
    "sourceRecordIds": [
      "ab2c0acc-11a7-5db9-b6ac-6938edaa1820"
    ],
    "pdfPages": [
      423
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-0d98d64f",
    "grade": 6,
    "label": "las Bienaventuranzas",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:las[\\s,:]+bienaventuranzas)(?:\\s+segun\\s+.*)?$",
    "object": "las Bienaventuranzas según los textos proporcionados",
    "relation": "afirmaciones, contextos y fundamentos atribuidos a los referentes dados",
    "sourceRecordIds": [
      "0d98d64f-86c2-509d-8d05-5ce4f8f39ce6"
    ],
    "pdfPages": [
      423
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  },
  {
    "id": "concept-0d4526ff",
    "grade": 6,
    "label": "compromiso y seguimiento de Jesucristo",
    "match": "^(?:explica|analiza|describe|interpreta|reflexiona sobre)\\s+(?:compromiso[\\s,:]+y[\\s,:]+seguimiento[\\s,:]+de[\\s,:]+jesucristo)(?:\\s+segun\\s+.*)?$",
    "object": "el compromiso y seguimiento de Jesucristo según los textos dados",
    "relation": "afirmaciones, acciones y fundamentos atribuidos a los referentes proporcionados",
    "sourceRecordIds": [
      "0d4526ff-420a-5a26-a0b7-be294fa5e116"
    ],
    "pdfPages": [
      423
    ],
    "conceptBrief": true,
    "planReferenceOnly": true
  }
]
