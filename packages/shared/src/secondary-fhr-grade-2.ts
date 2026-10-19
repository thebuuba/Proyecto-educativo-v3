import type {FhrTopic} from './secondary-fhr'

/** Adaptaciones observables del segundo grado; no se puntúan fe o experiencias privadas. */
export const fhrGradeTwoTopics:FhrTopic[]=[
  {
    "id": "life-stages",
    "grade": 2,
    "label": "etapas de la vida humana",
    "match": "etapas de la vida|diferentes momentos.*ser humano",
    "object": "las etapas de la vida humana",
    "relation": "características y relaciones documentadas por los referentes educativos proporcionados",
    "sourceRecordIds": [
      "1ef7820d-405c-5d37-bd09-5d85d808a82e",
      "fcc10fd9-dca5-5374-8de0-23a805f6276b"
    ],
    "pdfPages": [
      397
    ]
  },
  {
    "id": "life-dignity",
    "grade": 2,
    "label": "vida y dignidad por derechos humanos",
    "match": "dignidad.*(?:vida|persona)|vida.*dignidad",
    "object": "el respeto a la vida y la dignidad de la persona",
    "relation": "afirmaciones y derechos atribuidos a los textos dados de la Declaración Universal y la Constitución",
    "sourceRecordIds": [
      "add87da8-f64e-5dc7-bba5-5aa1c9e4db15",
      "c0772aad-f7b5-5723-bc3b-0fd94587a253"
    ],
    "pdfPages": [
      397
    ],
    "excludeWhen": "artistica"
  },
  {
    "id": "image-god",
    "grade": 2,
    "label": "imagen y semejanza de Dios en textos",
    "match": "imagen y semejanza",
    "object": "la imagen y semejanza de Dios atribuida al ser humano por los textos",
    "relation": "afirmaciones, citas y argumentos del Génesis y Salmo proporcionados",
    "sourceRecordIds": [
      "31a75187-2594-563c-9355-a3b62c83d579"
    ],
    "pdfPages": [
      397
    ]
  },
  {
    "id": "religious-origins",
    "grade": 2,
    "label": "origen y valor de la vida en religiones",
    "match": "origen.*valor.*vida|vision religiosa de la vida",
    "object": "el origen y el valor de la vida según las grandes religiones de los referentes",
    "relation": "perspectivas, fundamentos y evidencias atribuidas a las fuentes proporcionadas",
    "sourceRecordIds": [
      "3b7e4a78-9469-517e-8f3a-ccd1290eda7e",
      "7836f2c7-160b-5719-b49c-04885fc23849"
    ],
    "pdfPages": [
      397
    ]
  },
  {
    "id": "life-care",
    "grade": 2,
    "label": "acciones de protección de la vida",
    "match": "acciones.*(?:cuidado|proteccion).*vida",
    "object": "las acciones de cuidado y protección de la vida del referente",
    "relation": "acciones, condiciones y consecuencias documentadas en familia, escuela y comunidad",
    "sourceRecordIds": [
      "72fa7db9-a30d-5150-b4b2-abad4d233287"
    ],
    "pdfPages": [
      397
    ]
  },
  {
    "id": "life-art",
    "grade": 2,
    "label": "presentación artística de razones sobre dignidad",
    "match": "(?:presentacion|produccion) artistica.*dignidad|razones eticas.*dignidad",
    "object": "la presentación artística de razones {choice} que defienden la dignidad de la vida",
    "relation": "razones y evidencias atribuidas a los referentes expresamente proporcionados",
    "sourceRecordIds": [
      "c7caacc1-2b3b-54cb-960b-1cb02abb1592"
    ],
    "pdfPages": [
      397
    ],
    "choices": [
      [
        "eticas",
        "éticas"
      ],
      [
        "morales",
        "morales"
      ],
      [
        "religiosas",
        "religiosas"
      ],
      [
        "cientificas",
        "científicas"
      ]
    ],
    "choiceDefault": "expresamente elegidas"
  },
  {
    "id": "work-classification",
    "grade": 2,
    "label": "clasificación del trabajo sociocultural",
    "match": "clasifica.*trabajo|clasificacion del trabajo",
    "object": "el trabajo del registro sociocultural proporcionado",
    "relation": "características y evidencias que sustentan su clasificación",
    "sourceRecordIds": [
      "7ca8fe91-faa3-537b-987c-19aca9416822",
      "a73fb046-9bb7-53e8-9799-8c3330a1045c"
    ],
    "pdfPages": [
      397
    ]
  },
  {
    "id": "work-goals",
    "grade": 2,
    "label": "logros laborales y metas documentadas",
    "match": "personas.*(?:logrado|logros).*metas|logros laborales|logros.*metas laborales",
    "object": "los logros de metas laborales de personas descritas en las fuentes",
    "relation": "condiciones, acciones y resultados documentados por las fuentes proporcionadas",
    "sourceRecordIds": [
      "828d5d82-a250-59e2-9c93-6b46fc54e640",
      "effa0980-3054-5a99-b58d-0762f3f48a99"
    ],
    "pdfPages": [
      397
    ]
  },
  {
    "id": "work-benefits",
    "grade": 2,
    "label": "trabajo y bienestar",
    "match": "importancia.*trabajo|beneficios y dificultades.*trabajo|trabajo y bienestar",
    "object": "la importancia, beneficios y dificultades del trabajo para el bienestar",
    "relation": "aportes, condiciones y dificultades documentados para personas, familia y sociedad",
    "sourceRecordIds": [
      "9bedc594-d629-55fd-825b-8a778695a231",
      "9e4cf4f3-514b-5f73-adfe-40a7b1603698"
    ],
    "pdfPages": [
      397
    ]
  },
  {
    "id": "work-tree",
    "grade": 2,
    "label": "árbol de valores del trabajo humano",
    "match": "arbol.*valores.*trabajo",
    "object": "el árbol de valores del trabajo humano",
    "relation": "valores atribuidos, relaciones y efectos sobre el bienestar documentados por los referentes",
    "sourceRecordIds": [
      "2b3fdffd-9a55-580e-a30e-f976346e84df"
    ],
    "pdfPages": [
      397
    ],
    "productType": "CONCEPT_MAP"
  },
  {
    "id": "work-dramatization",
    "grade": 2,
    "label": "dramatización de metas laborales",
    "match": "dramatiza.*(?:laboral|metas)|dramatizacion.*metas laborales",
    "object": "el caso de logros de metas laborales expresamente proporcionado",
    "relation": "acciones, decisiones y resultados reconocibles según las condiciones del caso",
    "sourceRecordIds": [
      "6012245f-88a3-5fbb-a5d8-87949bc37ab5"
    ],
    "pdfPages": [
      397
    ]
  },
  {
    "id": "work-celebration",
    "grade": 2,
    "label": "celebración de producciones y aprendizajes",
    "match": "celebracion.*(?:producciones|aprendizajes).*trabajo",
    "object": "la celebración de producciones y aprendizajes sobre el trabajo",
    "relation": "producciones, aprendizajes y condiciones expresamente solicitados",
    "sourceRecordIds": [
      "e1fb0572-2bb1-5e97-97b3-c71a9dd62dd1"
    ],
    "pdfPages": [
      397
    ]
  },
  {
    "id": "family-description",
    "grade": 2,
    "label": "realidad familiar del referente",
    "match": "realidad familiar",
    "object": "la realidad familiar del referente proporcionado",
    "relation": "características y relaciones expresamente documentadas por el referente",
    "sourceRecordIds": [
      "c5634e99-c416-59b8-bff7-719a2e9dc538"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "family-types",
    "grade": 2,
    "label": "tipos y características de familias",
    "match": "tipos.*familias|familias.*tipos",
    "object": "los tipos y características de familias de los referentes",
    "relation": "características, contextos y evidencias documentados por las fuentes proporcionadas",
    "sourceRecordIds": [
      "7db6ad7f-68a5-5c8d-ade4-44d38ebe374b",
      "96a2572b-c87e-5b1e-a2d4-94e979d590fd"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "family-roles",
    "grade": 2,
    "label": "situaciones problemas y roles familiares",
    "match": "problemas.*familia.*roles|roles.*familia|familia y resolucion de conflictos",
    "object": "las situaciones, problemas y roles familiares del referente",
    "relation": "condiciones, roles y alternativas documentadas por el caso proporcionado",
    "sourceRecordIds": [
      "74c5ca91-b887-5851-adb1-1bde3c5877c7",
      "c71fb43e-5dd5-5365-a445-cb023d4d77f8"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "family-rights",
    "grade": 2,
    "label": "derechos de la familia",
    "match": "derechos de la familia",
    "object": "los derechos de la familia atribuidos al artículo 55 de la Constitución dada",
    "relation": "normas atribuidas, afirmaciones y evidencias del texto proporcionado",
    "sourceRecordIds": [
      "a4234858-ca7b-55d2-9934-1bfb9123311a"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "family-culture",
    "grade": 2,
    "label": "elementos culturales y sociales familiares",
    "match": "elementos culturales y sociales.*familia",
    "object": "los elementos culturales y sociales de la familia dominicana de los referentes",
    "relation": "características, contextos y evidencias documentadas por las fuentes",
    "sourceRecordIds": [
      "eaec3971-636f-5283-a9d4-bff813123239",
      "6b0e3e4b-ed89-51fd-b5f9-d655f3247d8a"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "family-biblical",
    "grade": 2,
    "label": "familia trato y amor en textos bíblicos",
    "match": "familia.*trato.*amor|trato.*familia.*textos biblicos",
    "object": "las características, trato y amor familiar descritos en los textos dados",
    "relation": "afirmaciones, episodios y citas de Mateo, Efesios, Proverbios y Corintios proporcionados",
    "sourceRecordIds": [
      "e17182de-2fd7-5071-a088-9e419dfa91b4"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "family-album",
    "grade": 2,
    "label": "álbum familiar con reseña",
    "match": "album familiar",
    "object": "el álbum familiar con {choice} del referente proporcionado",
    "relation": "organización y relaciones entre los componentes expresamente proporcionados",
    "sourceRecordIds": [
      "38dc9c5b-b659-5848-b5c0-e5861cad159f"
    ],
    "pdfPages": [
      398
    ],
    "productType": "PORTFOLIO",
    "choices": [
      [
        "fotografias|fotos",
        "fotografías"
      ],
      [
        "imagenes",
        "imágenes"
      ],
      [
        "resena(?: biografica)?",
        "reseña biográfica"
      ]
    ],
    "choiceDefault": "los componentes expresamente elegidos"
  },
  {
    "id": "family-values",
    "grade": 2,
    "label": "valores familiares documentados",
    "match": "valores.*familia(?:res)?|familia.*valores",
    "object": "los valores familiares atribuidos por los referentes dominicanos",
    "relation": "valores, situaciones y evidencias documentadas por las fuentes proporcionadas",
    "sourceRecordIds": [
      "b0c288b7-03ac-517b-ae0e-223e20c92263",
      "82496629-ef50-54b1-b770-0d090186f965"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "family-colloquium",
    "grade": 2,
    "label": "coloquio de soluciones familiares",
    "match": "coloquio.*(?:familia(?:res)?|madres|padres)",
    "object": "el coloquio sobre soluciones a dificultades y conflictos familiares",
    "relation": "preguntas, testimonios atribuidos y alternativas de los referentes proporcionados",
    "sourceRecordIds": [
      "0e51b460-9ad2-5ed6-866f-e47c475975ad"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "jesus-parables",
    "grade": 2,
    "label": "valores y acciones de Jesús en parábolas",
    "match": "parabolas|valores y acciones de jesus",
    "object": "los valores y acciones de Jesús de Nazaret en las parábolas dadas",
    "relation": "episodios, acciones y citas de los textos proporcionados de Lucas, Marcos y Mateo",
    "sourceRecordIds": [
      "e470e794-de9c-5601-a58f-41afe91d5143"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "jesus-mission",
    "grade": 2,
    "label": "cuadro comparativo de etapas de la misión de Jesús",
    "match": "cuadro comparativo.*mision.*jesus|etapas.*mision.*jesus",
    "object": "las etapas de la misión de Jesús de Nazaret",
    "relation": "etapas, episodios y relaciones documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "07d944f7-241f-5256-b178-e4a741ce0db9"
    ],
    "pdfPages": [
      398
    ],
    "productType": "WRITTEN_PRODUCTION",
    "objects": {
      "PRODUCTION": "el cuadro comparativo de las etapas de la misión de Jesús de Nazaret",
      "ANALYSIS": "el cuadro comparativo de las etapas de la misión de Jesús de Nazaret"
    }
  },
  {
    "id": "jesus-mission-narrative",
    "grade": 2,
    "label": "narración de la misión de Jesús",
    "match": "relata.*mision.*jesus|narra.*mision.*jesus|narracion de la mision",
    "object": "los momentos claves de la misión de Jesús de Nazaret",
    "relation": "secuencia, episodios y evidencias documentadas por los textos proporcionados",
    "sourceRecordIds": [
      "fd56d4e9-dea0-534a-a6a6-2e426b258b46"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "jesus-interviews",
    "grade": 2,
    "label": "entrevistas sobre la misión y valores de Jesús",
    "match": "entrevistas.*(?:lideres religiosos|mision.*jesus)",
    "object": "las entrevistas sobre la misión y valores de Jesús de Nazaret en la sociedad actual",
    "relation": "preguntas, perspectivas atribuidas y evidencias de los referentes proporcionados",
    "sourceRecordIds": [
      "8daf9264-a0ed-500e-a676-c9c490ae82c3"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "god-love",
    "grade": 2,
    "label": "amor de Dios en textos proporcionados",
    "match": "amor de dios",
    "object": "el amor de Dios descrito en los textos proporcionados",
    "relation": "afirmaciones, citas y evidencias atribuidas al evangelio de Juan, Oseas, primera carta de Juan y Tesalonicenses dados",
    "sourceRecordIds": [
      "4d13cac6-eefa-51c7-90f2-a5042d257231",
      "d247c2ac-d8b5-560d-94d0-7895341ed7e8"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "jesus-treatment",
    "grade": 2,
    "label": "trato de Jesús hacia las personas",
    "match": "trato.*jesus.*personas|jesus.*trato.*personas",
    "object": "el trato de Jesús de Nazaret hacia las personas descrito en los textos",
    "relation": "acciones, decisiones y citas documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "e81fd0fb-600c-5295-bf26-934cb33b3cc5",
      "ffebc986-296b-5439-bb81-7aa68772e284"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "jesus-passion",
    "grade": 2,
    "label": "panel de juicio y resurrección de Jesús",
    "match": "panel.*(?:juicio|crucifixion|resurreccion)|pasion.*muerte.*resurreccion",
    "object": "el juicio, crucifixión, muerte, sepultura y resurrección de Jesús de Nazaret",
    "relation": "secuencia, afirmaciones y evidencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "99a6fa94-14a7-5294-b391-6b41d9f5fa31",
      "1c61ed2e-ed27-5329-b710-7f005cd6deca"
    ],
    "pdfPages": [
      398
    ],
    "excludeWhen": "entrevista"
  },
  {
    "id": "passion-interview",
    "grade": 2,
    "label": "guion de entrevista sobre pasión y resurrección",
    "match": "entrevista.*(?:pasion|crucifixion|resurreccion)",
    "object": "el guion de entrevista sobre el significado de la pasión, muerte y resurrección de Jesús de Nazaret atribuido por el referente",
    "relation": "preguntas, significado atribuido y evidencias expresamente proporcionadas",
    "sourceRecordIds": [
      "4d313297-da18-5c5e-b756-3defbe4bf967"
    ],
    "pdfPages": [
      398
    ],
    "productType": "WRITTEN_PRODUCTION"
  },
  {
    "id": "science-artifacts",
    "grade": 2,
    "label": "artefactos inventos y beneficios",
    "match": "artefactos tecnologicos|inventos cientificos.*beneficios",
    "object": "los artefactos tecnológicos e inventos científicos y sus beneficios",
    "relation": "funciones, beneficios y evidencias documentadas por las fuentes proporcionadas",
    "sourceRecordIds": [
      "efba2497-208e-54f0-8fec-c805f1035134"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "science-inventions",
    "grade": 2,
    "label": "características y aportes de inventos",
    "match": "caracteristicas.*inventos|inventos.*cuidado.*vida",
    "object": "las características y aportes de inventos científicos y tecnológicos al cuidado de vida y entorno",
    "relation": "características, funciones y aportes documentados por los referentes proporcionados",
    "sourceRecordIds": [
      "169d306c-1cbd-5149-96cb-f122e0701a65",
      "7fa77ae4-67ae-593c-95d9-da7bf7433190"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "covid-science",
    "grade": 2,
    "label": "contribución científica ante Covid 19",
    "match": "covid|pandemia",
    "object": "la contribución de ciencias y tecnologías ante la pandemia de Covid 19",
    "relation": "contribuciones, condiciones e impactos personales, familiares y sociales documentados por las fuentes dadas",
    "sourceRecordIds": [
      "79563e36-29e6-5474-a2e8-36c671d71559",
      "286d15bf-2c99-5fcd-b67a-0d9ee9221100"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "bioethics",
    "grade": 2,
    "label": "bioética y uso de ciencias y tecnologías",
    "match": "bioetica",
    "object": "la bioética y su aporte al uso de ciencias y tecnologías",
    "relation": "criterios, decisiones y consecuencias documentadas en los ámbitos del referente proporcionado",
    "sourceRecordIds": [
      "12cc07f3-2de3-5d6b-ae06-06a65ffb3066",
      "65998773-511e-53df-98c2-48540318cefc",
      "e8395104-aa7b-56b5-bc9c-a44f919ba432"
    ],
    "pdfPages": [
      398
    ],
    "objects": {
      "VERIFICATION": "los criterios de bioética para el uso de ciencias y tecnologías expresamente acordados en el registro proporcionado"
    }
  },
  {
    "id": "science-fair",
    "grade": 2,
    "label": "feria científica y tecnológica",
    "match": "feria cientifica y tecnologica",
    "object": "la feria científica y tecnológica",
    "relation": "producciones, aportes y condiciones expresamente proporcionados",
    "sourceRecordIds": [
      "d65fb5b2-d7ff-560e-a9ac-f5e024cc72ae"
    ],
    "pdfPages": [
      398
    ]
  },
  {
    "id": "environment-sustainability",
    "grade": 2,
    "label": "cuidado y sostenibilidad de la casa común",
    "match": "cuidado y sostenibilidad|casa comun",
    "object": "el cuidado y la sostenibilidad del entorno natural como casa común",
    "relation": "acciones, condiciones y efectos documentados para personas y sociedad",
    "sourceRecordIds": [
      "1dbd639b-9b71-59bd-911f-3476a8d19b4f",
      "562a8ef8-5a8a-5502-8962-e87518060e5d",
      "ebe3d5fa-4dcf-5da2-9c0b-16ed72ef3d86",
      "3361e113-dc40-5170-87dc-4803dcd99170"
    ],
    "pdfPages": [
      399
    ],
    "excludeWhen": "laudato si|ecologia integral"
  },
  {
    "id": "laudato-care",
    "grade": 2,
    "label": "acciones ambientales según Laudato Si",
    "match": "laudato si",
    "object": "las acciones que favorecen y desfavorecen el cuidado del entorno natural según Laudato Si",
    "relation": "acciones, consecuencias y afirmaciones atribuidas al texto proporcionado",
    "sourceRecordIds": [
      "2295f74c-ab97-5980-b024-6b57f6763c18"
    ],
    "pdfPages": [
      399
    ]
  },
  {
    "id": "resource-management",
    "grade": 2,
    "label": "gestión y preservación de recursos naturales",
    "match": "gestion y preservacion|recursos naturales.*generaciones",
    "object": "la gestión y preservación de recursos naturales y sus efectos en nuevas generaciones",
    "relation": "alternativas, condiciones y consecuencias documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "be54d537-a281-56a5-8ca2-badac93c729b"
    ],
    "pdfPages": [
      399
    ]
  },
  {
    "id": "environment-values",
    "grade": 2,
    "label": "valores en el cuidado del entorno natural",
    "match": "valores culturales.*(?:espirituales|axiologicos)",
    "object": "los valores culturales, espirituales y axiológicos en el cuidado del entorno natural",
    "relation": "valores atribuidos, acciones y relaciones documentadas por los referentes proporcionados",
    "sourceRecordIds": [
      "b5c9b393-080d-508f-ba4e-b1ad4fc05703"
    ],
    "pdfPages": [
      399
    ]
  },
  {
    "id": "integral-ecology",
    "grade": 2,
    "label": "representación de ecología integral",
    "match": "ecologia integral",
    "object": "la situación de ecología integral expresamente proporcionada",
    "relation": "acciones, condiciones y relaciones reconocibles de sostenimiento del entorno natural",
    "sourceRecordIds": [
      "9346a44e-eb6d-5b59-a922-229d23873ef2",
      "017529b6-bdf7-5268-8452-f050a50f5c44"
    ],
    "pdfPages": [
      399
    ]
  },
  {
    "id": "adolescent-description",
    "grade": 2,
    "label": "descripción de características adolescentes",
    "match": "descripcion.*(?:adolescentes?|caracteristicas)|describe.*caracteristicas.*adolescentes?",
    "object": "las características {choice} de la adolescencia del referente proporcionado",
    "relation": "características y relaciones expresamente documentadas con intereses, comportamientos y decisiones",
    "sourceRecordIds": [
      "cba1c202-5e0b-5ad2-9459-a886ed589f0e",
      "efa5df22-e644-562a-a924-c3cac45cb98d"
    ],
    "pdfPages": [
      399
    ],
    "choices": [
      [
        "fisicas|fisicos",
        "físicas"
      ],
      [
        "cognitivas|cognitivos",
        "cognitivas"
      ],
      [
        "emocionales",
        "emocionales"
      ],
      [
        "sociales",
        "sociales"
      ],
      [
        "espirituales",
        "espirituales"
      ]
    ],
    "choiceDefault": "expresamente trabajadas"
  },
  {
    "id": "adolescent-comparison",
    "grade": 2,
    "label": "comparación de intereses y cambios adolescentes",
    "match": "compara.*intereses.*(?:cambios|adolescencia)|comparacion.*intereses",
    "object": "los intereses, comportamientos y valores en relación con cambios adolescentes del referente",
    "relation": "semejanzas, diferencias y relaciones documentadas por los referentes educativos proporcionados",
    "sourceRecordIds": [
      "6a9bb7c2-d3ec-5c7c-ba63-aa551a4f4a36",
      "6e8084d6-a3c1-5146-bc2f-9f7f6d731bc7",
      "10856706-03bc-54d0-a98a-bdbeed26427a"
    ],
    "pdfPages": [
      399
    ]
  },
  {
    "id": "affective-development",
    "grade": 2,
    "label": "desarrollo afectivo sexual adolescente",
    "match": "desarrollo afectivo[ -]sexual",
    "object": "el desarrollo afectivo-sexual y su importancia durante la adolescencia",
    "relation": "conceptos y relaciones documentados por los referentes educativos proporcionados",
    "sourceRecordIds": [
      "ccd8dc0d-c955-5f1c-9a0a-7a09166abe47"
    ],
    "pdfPages": [
      399
    ]
  },
  {
    "id": "adolescent-integrity",
    "grade": 2,
    "label": "derecho a la integridad física adolescente",
    "match": "integridad fisica",
    "object": "el derecho a la integridad física de los adolescentes",
    "relation": "afirmaciones, derechos y argumentos atribuidos al artículo 12 de la Ley 136-03 y documentos dados",
    "sourceRecordIds": [
      "09111bc6-2238-5df2-84cc-d1815b0255c1"
    ],
    "pdfPages": [
      399
    ]
  },
  {
    "id": "religious-composition",
    "grade": 2,
    "label": "composición de vivencia religiosa adolescente",
    "match": "composicion.*vivencia religiosa",
    "object": "la composición sobre vivencia religiosa y desarrollo humano y espiritual del referente",
    "relation": "relaciones y aportes descritos por el referente proporcionado",
    "sourceRecordIds": [
      "ba4dea60-392f-569c-8287-f550d343f155"
    ],
    "pdfPages": [
      399
    ],
    "productType": "WRITTEN_PRODUCTION"
  },
  {
    "id": "decision-elements",
    "grade": 2,
    "label": "elementos para decisiones adolescentes",
    "match": "elementos.*(?:tomar decisiones|decisiones acertadas)",
    "object": "los elementos para tomar decisiones durante la adolescencia",
    "relation": "condiciones, alternativas y consecuencias documentadas por el caso proporcionado",
    "sourceRecordIds": [
      "123e5e3d-87bd-5ef3-b39e-41b57962f520",
      "4bf36aec-dfbc-5d83-b39a-40738c510aa8"
    ],
    "pdfPages": [
      399
    ]
  },
  {
    "id": "hasty-decisions",
    "grade": 2,
    "label": "decisiones apresuradas en la adolescencia",
    "match": "decisiones apresuradas",
    "object": "las causas y consecuencias de decisiones apresuradas durante la adolescencia",
    "relation": "decisiones, condiciones y consecuencias documentadas por el caso proporcionado",
    "sourceRecordIds": [
      "4f606262-9cca-529b-bf0d-ef350751df61"
    ],
    "pdfPages": [
      399
    ]
  }
]
