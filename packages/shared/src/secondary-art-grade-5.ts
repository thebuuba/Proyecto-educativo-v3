import type {ArtTopic} from './secondary-art'

/** Adaptaciones de AulaBase; literal curricular separado. */
export const artGradeFiveTopics: ArtTopic[] = [
  {
    "id": "visual-art-history",
    "grade": 5,
    "label": "hitos de la historia de las artes visuales",
    "match": "historia de las artes visuales|hitos.*artes visuales",
    "relation": "la secuencia de hitos, obras y contextos de los periodos de las artes visuales expresamente examinados, con fechas sustentadas y sin ampliar el intervalo pedido",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "3ab26e6e-48f6-5829-bcee-bf1f242a00f4"
    ],
    "evidence": [
      {
        "id": "chronology-evidence",
        "title": "Hitos, fechas y fuentes",
        "success": "Organiza los hitos y las obras de los periodos asignados en una secuencia temporal coherente, relacionando fechas y contexto con evidencias identificables de las fuentes.",
        "sufficient": "La secuencia y sus fuentes se reconocen; una relación contextual secundaria queda poco precisada.",
        "partial": "Presenta hitos pertinentes, pero una fecha o relación contextual no se sustenta en la fuente.",
        "error": "La secuencia altera las fechas documentadas o atribuye obras a periodos incompatibles con las fuentes."
      }
    ]
  },
  {
    "id": "avant-garde-documentation",
    "grade": 5,
    "label": "documentación de vanguardias del siglo XX",
    "match": "documenta.*vanguardias|representantes de las vanguardias",
    "relation": "las relaciones entre conceptos, ideas, representantes y obras de las vanguardias del siglo XX expresamente estudiadas y su importancia local o trascendencia documentada",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "3577e856-1276-5d26-8699-9d0504a3e692",
      "c335866a-3de0-5363-9229-8cf84aba5a1d"
    ],
    "evidence": [
      {
        "id": "documented-vanguards",
        "title": "Representantes, obras y fuentes",
        "success": "Relaciona conceptos e ideas de los representantes asignados con obras y evidencias de las fuentes, sustentando su importancia local y trascendencia documentada sin exigir todas las disciplinas.",
        "sufficient": "Las atribuciones y relaciones principales se sostienen; una relación contextual secundaria queda poco precisada.",
        "partial": "Documenta datos pertinentes, pero una relación entre idea, obra y contexto carece de sustento.",
        "error": "Las atribuciones o afirmaciones sobre las obras contradicen las fuentes o sustituyen la documentación por suposiciones."
      }
    ]
  },
  {
    "id": "artistic-research-method",
    "grade": 5,
    "label": "métodos y técnicas de investigación artística",
    "match": "plan.*investigacion|planifica.*investigacion|metodos y tecnicas de investigacion artistica",
    "relation": "la relación entre pregunta artística, método, técnicas y fuentes pertinentes, distinguiendo un plan de investigación de sus resultados",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "260a7ce2-3aa8-51db-b380-080970a4a8e3",
      "967121f5-efa5-592a-b04b-941756fbaa14"
    ],
    "evidence": [
      {
        "id": "research-design",
        "title": "Pregunta, método y fuentes documentados",
        "success": "Relaciona preguntas artísticas, métodos y técnicas con las evidencias y fuentes documentales dadas, explicando su pertinencia para la investigación examinada.",
        "sufficient": "Las relaciones entre pregunta y método se sostienen; una técnica secundaria queda poco precisada.",
        "partial": "Identifica métodos pertinentes, pero una relación con la pregunta o evidencias carece de sustento.",
        "error": "Atribuye al método funciones incompatibles con sus fuentes o no permite reconocer su relación con la pregunta artística.",
        "plan": {
          "title": "Pregunta, método y fuentes previstos",
          "success": "Planifica preguntas, método, técnicas y fuentes pertinentes para investigar la propuesta artística dada, relacionando las decisiones previstas con el propósito.",
          "sufficient": "El plan vincula pregunta y recursos; una decisión secundaria queda poco precisada.",
          "partial": "El plan presenta fuentes, pero una decisión metodológica no responde a la pregunta.",
          "error": "Las decisiones previstas impiden obtener evidencias pertinentes para la pregunta artística."
        }
      }
    ]
  },
  {
    "id": "artistic-proposal-research",
    "grade": 5,
    "label": "investigación de propuestas artísticas",
    "match": "investiga[a-z]* la propuesta artistica|investigacion de propuestas",
    "relation": "las relaciones entre preguntas, fuentes bibliográficas o registros de la visita elegida, decisiones y conclusiones sobre la propuesta artística examinada",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "967121f5-efa5-592a-b04b-941756fbaa14"
    ],
    "evidence": [
      {
        "id": "proposal-inquiry",
        "title": "Evidencias y conclusiones de la propuesta",
        "success": "Relaciona las evidencias de las fuentes y de la visita expresamente elegidas con las decisiones y conclusiones sobre la propuesta artística investigada, distinguiendo datos e interpretación.",
        "sufficient": "Las conclusiones se sostienen en evidencias identificables; una relación secundaria con la propuesta queda poco precisada.",
        "partial": "Presenta evidencias pertinentes, pero una conclusión no se vincula con la fuente o registro utilizado.",
        "error": "Las conclusiones contradicen las fuentes o atribuyen a la visita información que no contiene."
      }
    ]
  },
  {
    "id": "virtual-exhibition",
    "grade": 5,
    "label": "visita y registro de exposiciones",
    "match": "visita virtual.*exposicion|visitas.*exposiciones",
    "relation": "la relación entre las observaciones de las obras asignadas y las evidencias de la exposición visitada mediante el recurso expresamente elegido",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "b6dd0cc4-4d40-521b-a43f-0395410fcc0d"
    ],
    "evidence": [
      {
        "id": "exhibition-record",
        "title": "Observaciones y evidencias de la exposición",
        "success": "Registra observaciones identificables de las obras asignadas y las vincula con evidencias de la exposición mediante el recurso disponible elegido, diferenciando observación e interpretación.",
        "sufficient": "Las observaciones y sus evidencias se reconocen; una referencia secundaria queda poco precisada.",
        "partial": "El registro contiene observaciones pertinentes, pero una de ellas no se vincula con la obra o recurso de la visita.",
        "error": "El registro atribuye a las obras rasgos ausentes o presenta suposiciones como observaciones documentadas."
      }
    ]
  },
  {
    "id": "artistic-language-resources",
    "grade": 5,
    "label": "recursos del lenguaje artístico y artesanal",
    "match": "lenguaje.*obra visual|espacio.*soporte.*color.*textura|lenguajes presentes",
    "relation": "las relaciones de los recursos expresamente solicitados del lenguaje artístico o artesanal con la organización de la obra examinada",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "91819b24-d533-5699-a83d-fd566c2d70f1"
    ],
    "evidence": [
      {
        "id": "requested-resources",
        "title": "Relaciones de los recursos elegidos",
        "success": "Relaciona los recursos expresamente solicitados del lenguaje de la obra con su organización visual mediante evidencias identificables del referente.",
        "sufficient": "La organización y sus recursos se reconocen; una relación secundaria queda poco precisada.",
        "partial": "Identifica recursos pertinentes, pero una relación con la organización de la obra queda sin sustento.",
        "error": "Atribuye a la obra recursos ausentes o relaciones incompatibles con sus evidencias."
      }
    ]
  },
  {
    "id": "visual-sign-interpretation",
    "grade": 5,
    "label": "signos y símbolos en las artes visuales",
    "match": "signos y simbolos.*obra visual|semiotica.*visual|interpreta.*signos",
    "relation": "las relaciones entre signos, símbolos, recursos visibles y significados sustentados de la obra visual, distinguiendo interpretación e inferencias sobre estados privados",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "427e96e1-87d5-5025-969d-d242d77a2b7a",
      "5d57d4ae-62df-57fa-9756-5f76ed244ff0",
      "063c6a88-7d47-57d5-8d40-725f700f26e0"
    ],
    "evidence": [
      {
        "id": "visual-signs",
        "title": "Signos y significados sustentados",
        "success": "Relaciona los signos y símbolos de la obra con recursos visibles y significados sustentados en sus evidencias, sin atribuir emociones privadas al autor o público.",
        "sufficient": "Los significados principales se sostienen en recursos visibles; una relación secundaria queda poco precisada.",
        "partial": "Identifica signos pertinentes, pero un significado no se vincula con evidencias de la obra.",
        "error": "Los significados atribuidos contradicen los recursos visibles o dependen exclusivamente de suposiciones sobre las personas."
      }
    ]
  },
  {
    "id": "symbolic-visual-work",
    "grade": 5,
    "label": "creación visual con signos y símbolos",
    "match": "crea.*obra visual.*signos|creacion visual.*simbolos",
    "relation": "la relación entre los signos, símbolos y decisiones visuales de la obra y la idea ficticia expresamente acordada",
    "pdfPages": [
      344,
      346
    ],
    "sourceRecordIds": [
      "37562bf6-9162-55a2-b6c4-0ea425d98e5d",
      "2ed257f4-5137-50e2-a2b9-eca0e15ec965",
      "73a9a50c-023f-5794-a24d-526413bbe096"
    ],
    "evidence": [
      {
        "id": "symbolic-communication",
        "title": "Recursos visuales y sentido simbólico",
        "success": "Relaciona los signos y símbolos dados con las decisiones visuales para comunicar el mensaje ficticio acordado mediante recursos reconocibles de la obra.",
        "sufficient": "El sentido simbólico se reconoce; una elección visual secundaria deja una ambigüedad sin cambiar la idea principal.",
        "partial": "La obra utiliza signos pertinentes, pero una relación visual no contribuye al mensaje acordado.",
        "error": "Las decisiones visuales contradicen la idea acordada o no permiten reconocer la función de los signos elegidos."
      }
    ]
  },
  {
    "id": "avant-garde-project",
    "grade": 5,
    "label": "proyecto de creación de vanguardia",
    "match": "proyecto.*vanguardia|proyecto artistico acordado",
    "relation": "las relaciones entre concepto, técnica, referente cultural y decisiones de un proyecto de creación basado en la vanguardia del siglo XX expresamente elegida",
    "pdfPages": [
      344,
      346
    ],
    "sourceRecordIds": [
      "14899bd0-724f-52de-acc4-0554c2c1c36d",
      "2f04594d-b9dd-5f2f-93c6-cd6196cd793a"
    ],
    "evidence": [
      {
        "id": "vanguard-decisions",
        "title": "Concepto, técnica y referente",
        "success": "Relaciona las decisiones y evidencias del proyecto artístico con conceptos, técnicas y referentes de la vanguardia asignada, transformándolos según el propósito acordado.",
        "sufficient": "El proyecto y el referente se reconocen; una decisión técnica secundaria queda poco definida.",
        "partial": "El producto contiene recursos pertinentes, pero una relación con el concepto o referente queda sin resolver.",
        "error": "Las decisiones del producto contradicen el referente asignado o no permiten reconocer el propósito del proyecto.",
        "plan": {
          "title": "Plan de concepto, recursos y acciones",
          "success": "Planifica concepto, técnica, referente cultural, recursos y acciones del proyecto de vanguardia de modo coherente con el propósito y las condiciones disponibles.",
          "sufficient": "El plan relaciona referente, recursos y acciones; una condición secundaria queda poco precisada.",
          "partial": "El plan identifica recursos pertinentes, pero una acción no se relaciona con el concepto o referente.",
          "error": "Las acciones o recursos previstos contradicen el referente o impiden realizar el proyecto acordado."
        }
      }
    ]
  },
  {
    "id": "cubism-work",
    "grade": 5,
    "label": "creación inspirada en el cubismo",
    "match": "cubismo",
    "relation": "las relaciones entre síntesis de la forma, organización visual y decisiones expresivas en la obra inspirada en el cubismo expresamente examinada",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "7369d87b-007d-5b20-a907-eb6f4e6c7469"
    ],
    "evidence": [
      {
        "id": "cubist-form",
        "title": "Síntesis de la forma y organización visual",
        "success": "Relaciona la síntesis de la forma y la organización de los recursos visuales con rasgos identificables del referente cubista proporcionado, transformándolos según el propósito acordado.",
        "sufficient": "La organización y el referente se reconocen; una relación formal secundaria queda poco definida.",
        "partial": "Se reconocen formas pertinentes, pero una relación visual no se vincula con el referente trabajado.",
        "error": "Las decisiones de forma no permiten reconocer el referente cubista o contradicen las condiciones dadas."
      }
    ]
  },
  {
    "id": "pointillism-work",
    "grade": 5,
    "label": "creación inspirada en el puntillismo",
    "match": "puntillismo",
    "relation": "las relaciones entre distribución de puntos, color y organización visual de la obra inspirada en el puntillismo expresamente examinada",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "7369d87b-007d-5b20-a907-eb6f4e6c7469"
    ],
    "evidence": [
      {
        "id": "point-color",
        "title": "Puntos, color y organización",
        "success": "Relaciona la distribución de puntos y color con la organización visual expresamente trabajada del referente puntillista mediante los recursos disponibles.",
        "sufficient": "La organización se reconoce; una relación secundaria de puntos o color queda poco definida.",
        "partial": "El producto incluye puntos pertinentes, pero una relación de color o distribución queda sin resolver.",
        "error": "La distribución de puntos o color impide reconocer la organización visual solicitada."
      }
    ]
  },
  {
    "id": "symbolism-work",
    "grade": 5,
    "label": "creación inspirada en el simbolismo",
    "match": "simbolismo",
    "relation": "las relaciones entre ideas, recursos simbólicos y mensaje ficticio en la obra inspirada en el simbolismo expresamente examinada",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "7369d87b-007d-5b20-a907-eb6f4e6c7469"
    ],
    "evidence": [
      {
        "id": "symbolist-idea",
        "title": "Idea y recursos simbólicos",
        "success": "Relaciona las ideas y los recursos simbólicos del referente con las decisiones de la obra para comunicar el mensaje ficticio acordado, sin depender de revelaciones privadas.",
        "sufficient": "El mensaje y sus recursos se reconocen; una relación simbólica secundaria queda poco definida.",
        "partial": "Presenta recursos pertinentes, pero una relación entre símbolo e idea queda sin resolver.",
        "error": "Las decisiones simbólicas contradicen el referente dado o no permiten reconocer el mensaje acordado."
      }
    ]
  },
  {
    "id": "western-theatre-history",
    "grade": 5,
    "label": "historia del teatro occidental",
    "match": "historia del teatro occidental|hitos.*teatro occidental",
    "relation": "las relaciones entre hitos, obras, figuras, periodos y contextos documentados de la historia del teatro occidental expresamente estudiados",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "121bab66-f2c6-5257-9263-f5fd340a01d7",
      "c51b71bf-2028-5745-a59b-0cfec6c7b99a"
    ],
    "evidence": [
      {
        "id": "theatre-history",
        "title": "Hitos teatrales y fuentes",
        "success": "Relaciona hitos, obras y figuras de la historia del teatro de los periodos asignados con su contexto mediante fuentes identificables, diferenciando dato documentado e interpretación.",
        "sufficient": "Los hitos y sus contextos se sostienen; una relación temporal secundaria queda poco precisada.",
        "partial": "Presenta información pertinente, pero un hito o atribución no se vincula con la fuente.",
        "error": "Las fechas, atribuciones o relaciones contextuales contradicen las fuentes del periodo asignado."
      }
    ]
  },
  {
    "id": "dance-history",
    "grade": 5,
    "label": "historia de la danza del ballet a la modernidad",
    "match": "ballet|historia de la danza",
    "relation": "las semejanzas y diferencias entre recursos y contextos documentados de los referentes de ballet y danza moderna expresamente examinados",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "99e292dc-cb68-5f5c-b44d-19c1e1e05cbc"
    ],
    "evidence": [
      {
        "id": "dance-periods",
        "title": "Referentes y contextos de la danza",
        "success": "Relaciona recursos y contextos de los referentes de danza asignados mediante evidencias identificables, distinguiendo sus periodos y convenciones.",
        "sufficient": "Los referentes se reconocen; una relación contextual secundaria queda poco precisada.",
        "partial": "Identifica recursos pertinentes, pero una relación con el periodo o contexto queda sin sustento.",
        "error": "Atribuye a los referentes recursos o convenciones incompatibles con las evidencias dadas."
      }
    ]
  },
  {
    "id": "dominican-stage-history",
    "grade": 5,
    "label": "historia del teatro y la danza dominicanos",
    "match": "figuras dominicanas.*teatro|historia.*teatro.*republica dominicana|agrupaciones.*dominicanas",
    "relation": "las relaciones entre las obras, agrupaciones o figuras dominicanas expresamente asignadas, época, contexto y aportes sustentados en fuentes",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "c143271c-8c6f-5b6d-b29a-e1cdd4c95c37"
    ],
    "evidence": [
      {
        "id": "dominican-stage-documents",
        "title": "Obras y figuras dominicanas documentadas",
        "success": "Documenta las obras, agrupaciones o figuras dominicanas asignadas y relaciona sus aportes con época y contexto mediante evidencias identificables de las fuentes.",
        "sufficient": "Las atribuciones y relaciones contextuales se reconocen; un dato secundario queda poco precisado.",
        "partial": "Aporta datos pertinentes, pero una atribución o aporte no se vincula con su fuente.",
        "error": "La documentación atribuye obras o aportes incompatibles con las fuentes o inventa datos contextuales."
      }
    ]
  },
  {
    "id": "stage-history-folder",
    "grade": 5,
    "label": "carpeta histórica de teatro y danza",
    "match": "carpeta.*historia del teatro|carpeta historica",
    "relation": "la organización de evidencias sobre elementos, personajes y figuras de los periodos de teatro o danza asignados en el formato de carpeta elegido",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "c51b71bf-2028-5745-a59b-0cfec6c7b99a"
    ],
    "evidence": [
      {
        "id": "stage-folder",
        "title": "Organización y contexto de la carpeta",
        "success": "Organiza en la carpeta física o digital elegida las evidencias de elementos, personajes y figuras asignados, relacionando cada registro con su contexto documentado.",
        "sufficient": "La carpeta permite reconocer registros y contextos; una referencia secundaria queda poco precisada.",
        "partial": "La carpeta contiene registros pertinentes, pero uno no se vincula con su contexto o evidencia.",
        "error": "La organización confunde atribuciones o periodos, o presenta registros incompatibles con las fuentes."
      }
    ]
  },
  {
    "id": "classical-stage-repertoire",
    "grade": 5,
    "label": "repertorio y obras clásicas escénicas",
    "match": "obra clasica escenica|repertorio.*dramaturgia",
    "relation": "las relaciones entre repertorio, dramaturgia y figuras relevantes de la obra escénica clásica examinada, entendiendo clásica como permanencia documentada y no como periodo musical",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "c571c88a-19f6-5ff4-b0ab-3d151c95fd1d"
    ],
    "evidence": [
      {
        "id": "stage-repertoire",
        "title": "Dramaturgia, figuras y repertorio",
        "success": "Relaciona los elementos de dramaturgia y figuras de la obra escénica con su lugar en el repertorio según las evidencias de las fuentes dadas.",
        "sufficient": "Las relaciones principales se sostienen; un dato secundario del repertorio queda poco precisado.",
        "partial": "Identifica elementos pertinentes, pero una relación con el repertorio carece de sustento.",
        "error": "Las atribuciones o relaciones contradicen la obra o confunden su permanencia con una clasificación musical no documentada."
      }
    ]
  },
  {
    "id": "stage-appreciation-report",
    "grade": 5,
    "label": "reporte crítico de teatro o danza",
    "match": "reporte critico.*teatro|reporte critico.*danza|apreciacion estetica del teatro",
    "relation": "las relaciones entre recursos formales, signos, sentido y evidencias del fragmento de teatro o danza expresamente examinado",
    "pdfPages": [
      344,
      345,
      346
    ],
    "sourceRecordIds": [
      "3041de52-e51b-51ce-ba1d-1882dce5785f",
      "3fc53d5e-0cfe-52ac-a542-d4bcadea9b35",
      "018c7114-e778-5337-8d63-a30d31df5561"
    ],
    "evidence": [
      {
        "id": "stage-critical-report",
        "title": "Interpretación crítica con evidencias",
        "success": "Sustenta la interpretación crítica del fragmento de teatro o danza en relaciones entre recursos formales, signos y sentido con evidencias identificables del registro proporcionado.",
        "sufficient": "La interpretación se sostiene en evidencias; una relación formal secundaria queda poco precisada.",
        "partial": "Reconoce recursos pertinentes, pero una afirmación del reporte no se vincula con sus evidencias.",
        "error": "El reporte atribuye recursos ausentes o sustituye la interpretación sustentada por afirmaciones sobre las personas."
      }
    ]
  },
  {
    "id": "stage-semiotics",
    "grade": 5,
    "label": "semiótica de gesto y movimiento escénicos",
    "match": "gesto y movimiento|semiotica.*escenic",
    "relation": "la función comunicativa de los gestos y movimientos expresamente solicitados en la escena, relacionando signos observables y significados sustentados",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "5b99e730-2fa4-5f43-95ef-3ce346593adb"
    ],
    "evidence": [
      {
        "id": "stage-signs",
        "title": "Gesto, movimiento y significado",
        "success": "Relaciona los gestos y movimientos de la escena con su significado comunicativo mediante evidencias observables, diferenciando personaje y persona intérprete.",
        "sufficient": "El significado principal se reconoce; una relación gestual secundaria queda poco precisada.",
        "partial": "Identifica acciones pertinentes, pero una interpretación no se vincula con los signos de la escena.",
        "error": "La interpretación contradice las acciones dadas o depende de atribuir rasgos privados al intérprete."
      }
    ]
  },
  {
    "id": "music-history-listening",
    "grade": 5,
    "label": "audición e historia de la música",
    "match": "fragmento musical.*criterios y datos historicos|historia de la musica",
    "relation": "las relaciones entre características audibles, datos históricos y criterios expresamente proporcionados para identificar el fragmento musical examinado",
    "pdfPages": [
      344,
      345
    ],
    "sourceRecordIds": [
      "15606978-be5b-5118-bf8d-b3cd9812de81",
      "42d572b3-e7f9-5bc1-889c-e18e190c7b04"
    ],
    "evidence": [
      {
        "id": "historical-listening",
        "title": "Características audibles y datos históricos",
        "success": "Relaciona las características reconocibles del fragmento escuchado con los criterios y datos históricos proporcionados, justificando su identificación con evidencias audibles.",
        "sufficient": "La identificación principal se sostiene; una referencia audible secundaria queda poco precisada.",
        "partial": "Reconoce rasgos pertinentes, pero una identificación no se vincula con las evidencias o datos dados.",
        "error": "La identificación contradice las evidencias audibles o atribuye un periodo no sustentado en los datos."
      }
    ]
  },
  {
    "id": "dominican-symphonic-listening",
    "grade": 5,
    "label": "audición de compositores sinfónicos dominicanos",
    "match": "sinfonic[a-z]* dominican[a-z]*|compositores sinfonicos dominicanos",
    "relation": "las relaciones entre rasgos audibles, autoría y época de los fragmentos sinfónicos dominicanos expresamente escuchados según las fuentes",
    "pdfPages": [
      344,
      345
    ],
    "sourceRecordIds": [
      "4fb1754f-1744-5718-aaca-9bdae8a5010c",
      "bbf80d2c-2a1a-5301-8a8c-dd906cc0119a"
    ],
    "evidence": [
      {
        "id": "symphonic-evidence",
        "title": "Rasgos sonoros, autoría y época",
        "success": "Relaciona rasgos audibles del fragmento sinfónico dominicano con su compositor o compositora y época según evidencias y fuentes identificables.",
        "sufficient": "La identificación se sostiene; una relación sonora secundaria queda poco precisada.",
        "partial": "Identifica rasgos pertinentes, pero una relación de autoría o época queda sin sustento.",
        "error": "La atribución de autoría o época contradice las fuentes o los rasgos expresamente documentados."
      }
    ]
  },
  {
    "id": "contemporary-music-contrast",
    "grade": 5,
    "label": "música contemporánea y periodos elegidos",
    "match": "musica contemporanea|fragmento musical contemporaneo",
    "relation": "las relaciones entre recursos sonoros y evidencias escuchadas de la música contemporánea y los periodos expresamente elegidos, sin acumular referentes no solicitados",
    "pdfPages": [
      344,
      345
    ],
    "sourceRecordIds": [
      "63250486-1322-5dcd-83e9-b53d88798c6f",
      "0a808f5f-a539-5237-beea-b5f02cd0c56b"
    ],
    "evidence": [
      {
        "id": "musical-period-contrast",
        "title": "Contraste sonoro sustentado",
        "success": "Contrasta los fragmentos contemporáneos y de los periodos elegidos mediante los recursos sonoros expresamente solicitados, sustentando las relaciones en evidencias audibles.",
        "sufficient": "El contraste principal se sostiene; una relación sonora secundaria queda poco precisada.",
        "partial": "Identifica rasgos pertinentes, pero una diferencia no se vincula con evidencias escuchadas.",
        "error": "El contraste atribuye a los fragmentos recursos ausentes o relaciones incompatibles con las evidencias dadas."
      }
    ]
  },
  {
    "id": "music-aesthetic-semiotic",
    "grade": 5,
    "label": "estética y semiótica del fragmento musical",
    "match": "forma.*agogica.*dinamica|dinamica del fragmento musical|estetica y semiotica.*musica",
    "relation": "las relaciones entre los recursos musicales expresamente solicitados, su sentido y los criterios dados para la época y estilo del fragmento examinado",
    "pdfPages": [
      345
    ],
    "sourceRecordIds": [
      "8a910983-ae5f-5796-988b-688b6efc31e2",
      "10672f1c-68d7-5942-82c7-57eb0496bdd3"
    ],
    "evidence": [
      {
        "id": "musical-signs",
        "title": "Recursos musicales y sentido",
        "success": "Relaciona los recursos musicales expresamente solicitados con su sentido en el fragmento según criterios formales y contextuales dados, sustentando cada vínculo en evidencias audibles.",
        "sufficient": "El sentido principal se sostiene; una relación sonora secundaria queda poco precisada.",
        "partial": "Reconoce recursos pertinentes, pero una interpretación no se relaciona con las evidencias audibles.",
        "error": "La interpretación contradice los recursos del fragmento o sustituye el análisis por preferencias personales."
      }
    ]
  },
  {
    "id": "costume-history",
    "grade": 5,
    "label": "historia y función del vestuario",
    "match": "vestuario",
    "relation": "las relaciones entre forma, recursos, función y contexto documentado del vestuario de la obra y época examinadas, distinguiendo evidencia e inferencias sobre cuerpos",
    "pdfPages": [
      345
    ],
    "sourceRecordIds": [
      "3685b8f8-25af-573e-b66a-ee8434275df7"
    ],
    "evidence": [
      {
        "id": "costume-context",
        "title": "Función contextual del vestuario",
        "success": "Relaciona las decisiones de forma y recursos del vestuario dado con su función en la obra y época según evidencias contextuales documentadas.",
        "sufficient": "La función y el contexto se reconocen; una relación formal secundaria queda poco precisada.",
        "partial": "Identifica recursos pertinentes, pero una relación con la función contextual carece de sustento.",
        "error": "Las atribuciones de función o época contradicen las evidencias del vestuario o se basan en juicios sobre personas."
      }
    ]
  },
  {
    "id": "copyright-research",
    "grade": 5,
    "label": "investigación de derechos autorales en las artes",
    "match": "derechos autorales",
    "relation": "la distinción entre leyes, entidades y procesos de derechos autorales en las fuentes estudiadas, atendiendo a jurisdicción, fecha, alcance y límites de lo documentado",
    "pdfPages": [
      345,
      346
    ],
    "sourceRecordIds": [
      "558d3edf-6496-50cd-9ca1-fe146e4a0be9",
      "b35ba154-875f-58fa-8d0f-00e7eb1d9b5d",
      "b2a09489-bcc3-531d-8cc7-7241d00cb8e1"
    ],
    "evidence": [
      {
        "id": "copyright-sources",
        "title": "Fuentes, jurisdicción y alcance",
        "success": "Documenta leyes, entidades y procesos de derechos autorales según las fuentes dadas, identificando jurisdicción, fecha y alcance y diferenciando lo acreditado de la vigencia no verificada.",
        "sufficient": "Los datos principales se atribuyen a sus fuentes; un límite secundario de alcance queda poco precisado.",
        "partial": "Presenta información pertinente, pero una afirmación no se vincula con su fuente, jurisdicción o fecha.",
        "error": "Presenta como acreditada una vigencia o autorización no sustentada, o contradice el alcance de las fuentes."
      }
    ]
  },
  {
    "id": "copyright-application",
    "grade": 5,
    "label": "registro de autoría y fuente original",
    "match": "obra propia o ajena|registro.*obra artistica.*requisitos|registro de autoria y fuente",
    "relation": "las relaciones entre registro de la obra, autoría y fuente original según los requisitos expresamente dados, distinguiendo atribución, procedencia y permiso documentado",
    "pdfPages": [
      346,
      344
    ],
    "sourceRecordIds": [
      "1f172bb0-a107-5735-bca1-cb9dae3348e5",
      "15b76c06-5337-5e59-94c9-113adb61385b"
    ],
    "evidence": [
      {
        "id": "attribution-record",
        "title": "Autoría y fuente original",
        "success": "Registra la autoría y la fuente original de la obra del ejemplo según los requisitos dados, diferenciando atribución y permiso y señalando la autorización no documentada sin presuponerla.",
        "sufficient": "La atribución y la fuente se reconocen; un dato secundario del registro queda poco precisado.",
        "partial": "El registro aporta datos pertinentes, pero una atribución o fuente no se vincula con sus evidencias.",
        "error": "El registro confunde autoría y permiso o atribuye una autorización que la ficha no acredita."
      }
    ]
  },
  {
    "id": "heritage-object-record",
    "grade": 5,
    "label": "registro de objetos patrimoniales",
    "match": "objeto patrimonial|objetos patrimoniales",
    "relation": "las relaciones entre los datos expresamente solicitados del registro patrimonial y sus evidencias, distinguiendo atribución documentada y dato no determinado",
    "pdfPages": [
      345
    ],
    "sourceRecordIds": [
      "df0e31fd-63f9-540b-b609-39412ac28731",
      "e5abbe39-792b-5d41-9423-6e5425c75b22"
    ],
    "evidence": [
      {
        "id": "heritage-metadata",
        "title": "Datos y evidencias del registro",
        "success": "Registra los datos expresamente solicitados del objeto patrimonial y los relaciona con evidencias identificables, señalando lo no determinado sin inventar información.",
        "sufficient": "Los datos y sus evidencias se reconocen; una referencia secundaria queda poco precisada.",
        "partial": "El registro contiene datos pertinentes, pero uno se presenta sin evidencia o sin aclarar su indeterminación.",
        "error": "El registro inventa datos o atribuye al objeto características incompatibles con las evidencias dadas."
      }
    ]
  },
  {
    "id": "artwork-classification",
    "grade": 5,
    "label": "clasificación documentada de obras",
    "match": "registro de las obras|clasificacion.*obras",
    "relation": "la relación entre el criterio de clasificación elegido, los registros de obras y los datos contextuales expresamente solicitados de las fuentes",
    "pdfPages": [
      345
    ],
    "sourceRecordIds": [
      "93ceb13c-d42d-56bb-b8cd-d57537c939d4"
    ],
    "evidence": [
      {
        "id": "chosen-classification",
        "title": "Criterio elegido y registros",
        "success": "Organiza los registros de obras según el criterio de clasificación expresamente elegido y relaciona los datos contextuales pedidos con las fuentes proporcionadas.",
        "sufficient": "El criterio y los registros se reconocen; una referencia contextual secundaria queda poco precisada.",
        "partial": "Organiza registros pertinentes, pero uno no responde al criterio elegido o carece de evidencia.",
        "error": "La clasificación contradice el criterio elegido o atribuye a las obras datos incompatibles con las fichas."
      }
    ]
  },
  {
    "id": "artistic-synthesis",
    "grade": 5,
    "label": "síntesis visual de forma y recursos",
    "match": "sintesis de forma|sintesis.*obra visual",
    "relation": "las relaciones entre síntesis de forma, materiales, color e idea sustentada en la obra visual examinada, sin acumular recursos de otros lenguajes",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "0872296c-a6da-59e4-9364-d57b4928484f"
    ],
    "evidence": [
      {
        "id": "visual-synthesis",
        "title": "Síntesis visual sustentada",
        "success": "Relaciona la síntesis de forma y los recursos visuales expresamente solicitados con la idea de la obra mediante evidencias identificables.",
        "sufficient": "La síntesis y la idea se reconocen; una relación visual secundaria queda poco precisada.",
        "partial": "Identifica recursos pertinentes, pero una relación con la idea queda sin sustento.",
        "error": "Atribuye a la obra recursos ausentes o relaciones incompatibles con su organización visual."
      }
    ]
  },
  {
    "id": "dominican-folklore-elements",
    "grade": 5,
    "label": "elementos folclóricos en obras dominicanas",
    "match": "elementos folcloricos",
    "relation": "las relaciones entre elementos folclóricos identificables en las obras dominicanas examinadas y evidencias visuales o fuentes contextuales expresamente dadas",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "27ef1f9d-80d2-5f6a-844c-8eb4ae363006"
    ],
    "evidence": [
      {
        "id": "folklore-evidence",
        "title": "Elementos y evidencias culturales",
        "success": "Identifica elementos folclóricos en las obras dadas y sustenta sus relaciones con evidencias de la obra y las fuentes contextuales, sin inferir pertenencia personal.",
        "sufficient": "Los elementos y sus referentes se reconocen; una relación contextual secundaria queda poco precisada.",
        "partial": "Identifica recursos pertinentes, pero un referente cultural no se vincula con la evidencia.",
        "error": "Atribuye a las obras elementos ausentes o referentes incompatibles con las fuentes dadas."
      }
    ]
  },
  {
    "id": "avant-garde-learning-presentation",
    "grade": 5,
    "label": "presentación de aprendizajes de vanguardia",
    "match": "presenta.*aprendizajes.*vanguardia",
    "relation": "la relación entre conceptos aprendidos, ejemplos y fuentes de la vanguardia del siglo XX asignada, presentados en el formato disponible elegido",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "4bfcb15c-26fe-5362-b0e3-edd720169cf7"
    ],
    "evidence": [
      {
        "id": "vanguard-learning",
        "title": "Conceptos y ejemplos presentados",
        "success": "Presenta los aprendizajes de la vanguardia asignada relacionando conceptos y ejemplos con evidencias de las fuentes en el formato elegido.",
        "sufficient": "El aprendizaje y sus ejemplos se reconocen; una relación conceptual secundaria queda poco precisada.",
        "partial": "Presenta conceptos pertinentes, pero un ejemplo no se relaciona con el aprendizaje o la fuente.",
        "error": "Las relaciones presentadas contradicen los conceptos o ejemplos de la vanguardia asignada."
      }
    ]
  },
  {
    "id": "simulated-event-diffusion",
    "grade": 5,
    "label": "difusión simulada de eventos artísticos",
    "match": "simulacion de difusion|difusion del evento artistico",
    "relation": "las relaciones entre mensaje, público y recursos del medio elegido para difundir un evento artístico ficticio, sin requerir publicación externa",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "9d01d350-eb8d-5c3c-84d3-8182c95bc2ab"
    ],
    "evidence": [
      {
        "id": "event-message",
        "title": "Mensaje, público y medio",
        "success": "Relaciona mensaje, público y recursos del medio elegido en la simulación de difusión del evento artístico ficticio, haciendo reconocible la información acordada sin usar datos personales reales.",
        "sufficient": "La información y su público se reconocen; un recurso secundario deja una ambigüedad sin cambiar el mensaje principal.",
        "partial": "La simulación aporta información pertinente, pero una elección del medio no contribuye al mensaje o público dado.",
        "error": "La información o recursos contradicen el evento ficticio o no permiten reconocer el mensaje de difusión."
      }
    ]
  },
  {
    "id": "history-period-research",
    "grade": 5,
    "label": "investigación de periodos artísticos",
    "match": "caracteristicas artisticas de los periodos|investigacion de periodos",
    "relation": "las relaciones entre características, obras y contextos de los periodos artísticos expresamente asignados mediante evidencias de las fuentes",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "0f91b02b-fbac-5727-bb61-86e5e13d0283"
    ],
    "evidence": [
      {
        "id": "assigned-periods",
        "title": "Periodos y evidencias contextuales",
        "success": "Investiga las características de los periodos asignados relacionando obras, contexto y afirmaciones con evidencias identificables de las fuentes.",
        "sufficient": "Las características y contextos se sostienen; una referencia secundaria queda poco precisada.",
        "partial": "Presenta datos pertinentes, pero una relación entre obra y periodo carece de sustento.",
        "error": "Las atribuciones o relaciones temporales contradicen las fuentes de los periodos asignados."
      }
    ]
  },
  {
    "id": "style-context-research",
    "grade": 5,
    "label": "investigación contextual de estilos artísticos",
    "match": "aspectos contextuales.*estilo|investigacion contextual de estilos",
    "relation": "las relaciones entre condiciones contextuales documentadas, obras y desarrollo del estilo artístico expresamente estudiado",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "d4613b42-57c7-53f7-835e-3872f101315e"
    ],
    "evidence": [
      {
        "id": "style-context",
        "title": "Condiciones, obras y fuentes",
        "success": "Relaciona condiciones contextuales documentadas con obras y desarrollo del estilo asignado, sustentando las afirmaciones en evidencias de las fuentes dadas.",
        "sufficient": "Las relaciones principales se sostienen; una referencia contextual secundaria queda poco precisada.",
        "partial": "Aporta datos pertinentes, pero una relación entre contexto y estilo no se vincula con su fuente.",
        "error": "Atribuye al contexto efectos o hechos incompatibles con las evidencias del estilo estudiado."
      }
    ]
  },
  {
    "id": "art-history-portfolio",
    "grade": 5,
    "label": "portafolio de historia de las artes",
    "match": "portafolio.*historia de las artes",
    "relation": "las relaciones entre aprendizajes, reflexiones sustentadas y evidencias de los maestros o personajes asignados de la historia de las artes, organizadas en el formato elegido",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "9de799a6-f144-5d79-b104-adff03bbe647"
    ],
    "evidence": [
      {
        "id": "art-history-evidence",
        "title": "Aprendizajes y reflexión del portafolio",
        "success": "Organiza en el portafolio elegido aprendizajes y reflexiones sobre los personajes asignados, sustentando sus relaciones con evidencias de obras y fuentes.",
        "sufficient": "El portafolio permite reconocer aprendizajes y evidencias; una reflexión secundaria queda poco precisada.",
        "partial": "Incluye materiales pertinentes, pero una reflexión no se relaciona con sus evidencias.",
        "error": "La organización o las reflexiones contradicen los materiales o no permiten reconocer los aprendizajes solicitados."
      }
    ]
  },
  {
    "id": "research-systematization",
    "grade": 5,
    "label": "sistematización de investigación artística",
    "match": "sistematiza.*investigacion|sistematizacion de investigacion",
    "relation": "la trazabilidad entre preguntas, método acordado, evidencias, resultados y conclusiones de la investigación artística ya realizada",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "756b4755-128d-5768-be5a-6e0a82785a6c"
    ],
    "evidence": [
      {
        "id": "research-trace",
        "title": "Método, evidencias y resultados",
        "success": "Organiza la investigación ya realizada relacionando preguntas, método acordado, evidencias, resultados y conclusiones en el formato de presentación elegido, sin inventar datos.",
        "sufficient": "La trazabilidad principal se reconoce; una referencia secundaria queda poco precisada.",
        "partial": "Presenta resultados pertinentes, pero una conclusión o decisión metodológica no se vincula con sus evidencias.",
        "error": "Las conclusiones contradicen los resultados o la sistematización atribuye al trabajo datos no obtenidos."
      }
    ]
  },
  {
    "id": "ecological-art-project-plan",
    "grade": 5,
    "label": "proyecto artístico de cuidado ecológico",
    "match": "proyecto artistico.*cuidado ecologico|proyecto artistico de cuidado ecologico",
    "relation": "las relaciones entre propósito ecológico, recursos seguros elegidos y acciones previstas de uso, reúso o reciclaje expresamente acordadas para el proyecto artístico",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "cb30d48b-ac46-5f51-8151-abbc2581db04"
    ],
    "evidence": [
      {
        "id": "ecological-plan",
        "title": "Propósito, recursos y acciones previstos",
        "success": "Planifica las relaciones entre propósito ecológico, recursos seguros y acciones del medio elegido para comunicar el cuidado acordado, sin exigir ejecución.",
        "sufficient": "El plan relaciona propósito y recursos; una acción secundaria queda poco precisada.",
        "partial": "El plan propone recursos pertinentes, pero una acción no se relaciona con el cuidado acordado.",
        "error": "Las acciones previstas contradicen las condiciones del material elegido o no permiten reconocer el propósito ecológico.",
        "plan": {
          "title": "Propósito, recursos y acciones previstos",
          "success": "Planifica el propósito ecológico, los recursos seguros elegidos y las acciones previstas de uso, reúso o reciclaje expresamente acordadas, sin acumular técnicas alternativas.",
          "sufficient": "El plan relaciona propósito, recursos y acciones; una condición secundaria queda poco precisada.",
          "partial": "El plan identifica recursos, pero una acción no contribuye al cuidado expresamente acordado.",
          "error": "Las acciones o recursos previstos contradicen las condiciones dadas o impiden realizar la propuesta."
        }
      }
    ]
  },
  {
    "id": "art-residue-observation",
    "grade": 5,
    "label": "acciones de cuidado visual, sonoro y de residuos",
    "match": "cuidado visual.*sonoro.*residuos|acciones de cuidado.*residuos",
    "relation": "la frecuencia observada de las acciones concretas de cuidado visual, sonoro y de residuos expresamente acordadas en la producción artística, sin inferir conciencia interna",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "d2e19649-22bb-5bb6-b41b-1b2dd291972a"
    ],
    "evidence": [
      {
        "id": "observed-care",
        "title": "Frecuencia de acciones de cuidado",
        "success": "Aplica las acciones concretas de cuidado visual, sonoro y de residuos expresamente acordadas en todas las oportunidades observadas.",
        "sufficient": "Aplica las acciones concretas acordadas en casi todas las oportunidades observadas.",
        "partial": "Aplica las acciones concretas acordadas en algunas oportunidades observadas.",
        "error": "Aplica las acciones concretas acordadas en pocas oportunidades observadas.",
        "absent": "No aplica las acciones concretas de cuidado acordadas en las oportunidades observadas; no equivale a ausencia de registro."
      }
    ]
  },
  {
    "id": "art-health-practices",
    "grade": 5,
    "label": "medidas explícitas de cuidado en producción artística",
    "match": "produccion artistica.*medidas|medidas.*uso seguro",
    "relation": "la verificación de las medidas concretas de uso seguro del recurso y pausas expresamente acordadas, sin inferir salud privada ni efectos terapéuticos",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "ef534f07-3c12-534f-8552-d8d89ce3e114"
    ],
    "evidence": [
      {
        "id": "explicit-care",
        "title": "Medidas acordadas y evidencias",
        "success": "Identifica con evidencias si la producción artística del caso cumple las medidas concretas de cuidado expresamente dadas.",
        "sufficient": "La verificación se reconoce; una marca secundaria queda poco clara sin alterar el resultado.",
        "partial": "La respuesta es ambigua sobre el cumplimiento de una medida acordada.",
        "error": "Atribuye al caso un cumplimiento incompatible con sus evidencias."
      }
    ]
  },
  {
    "id": "aesthetic-position",
    "grade": 5,
    "label": "argumentación de una postura estética",
    "match": "postura estetica",
    "relation": "la relación entre postura estética, razones y evidencias de la obra, diferenciando argumento sobre recursos y juicios personales o exigencias de acuerdo",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "92a9f983-a6a0-5c7f-a3d4-b46d527f0146",
      "9b21e5fa-2bd1-5c41-a8fb-e72c4f8fccf9"
    ],
    "evidence": [
      {
        "id": "aesthetic-reasons",
        "title": "Razones y evidencias de la postura",
        "success": "Sostiene la postura estética elegida con razones vinculadas a recursos identificables de la obra y evidencias pertinentes, sin exigir acuerdo con preferencias ajenas.",
        "sufficient": "La postura se sostiene en razones y evidencias; una relación secundaria queda poco precisada.",
        "partial": "Presenta razones pertinentes, pero una no se relaciona con la obra o las evidencias.",
        "error": "Las razones contradicen la obra o sustituyen las evidencias por juicios sobre las personas."
      },
      {
        "id": "aesthetic-response",
        "title": "Respuesta a una postura diferente",
        "success": "Responde a la postura distinta del caso ficticio mediante razones vinculadas con evidencias de la obra, sin ataques personales ni obligación de compartirla.",
        "sufficient": "La respuesta aborda la postura ajena con evidencias; una relación secundaria queda poco precisada.",
        "partial": "La respuesta presenta una razón pertinente, pero no se vincula con el argumento del caso.",
        "error": "La respuesta evita el argumento o lo sustituye por ataques personales o afirmaciones incompatibles con la obra.",
        "when": "respondiendo|responde.*postura"
      }
    ]
  },
  {
    "id": "historical-heritage-contribution",
    "grade": 5,
    "label": "aportes históricos al patrimonio artístico",
    "match": "aportes.*obra historica|aportes historicos al patrimonio",
    "relation": "las relaciones entre aportes de la obra histórica examinada, patrimonio artístico y evidencias documentadas de las fuentes, sin exigir admiración o adhesión cultural",
    "pdfPages": [
      346
    ],
    "sourceRecordIds": [
      "c1bc9fc0-f73c-5950-905f-531ace27108a",
      "b58d5ae6-5b32-572b-be85-0cce60edb276"
    ],
    "evidence": [
      {
        "id": "historical-contributions",
        "title": "Aportes documentados al patrimonio",
        "success": "Explica los aportes de la obra histórica al patrimonio artístico mediante relaciones sustentadas en evidencias de las fuentes dadas.",
        "sufficient": "Los aportes principales se sostienen; una relación histórica secundaria queda poco precisada.",
        "partial": "Identifica aportes pertinentes, pero uno no se vincula con las evidencias de la obra.",
        "error": "Atribuye a la obra aportes incompatibles con las fuentes o sustituye la explicación por preferencias personales."
      }
    ]
  },
  {
    "id": "chosen-avant-garde",
    "grade": 5,
    "label": "creación según la vanguardia elegida",
    "match": "(?:cubismo|puntillismo|simbolismo) o (?:el )?(?:cubismo|puntillismo|simbolismo).*estilo elegido",
    "relation": "las relaciones entre el estilo expresamente elegido, sus recursos y la organización visual de una obra, sin acumular técnicas alternativas",
    "pdfPages": [
      344
    ],
    "sourceRecordIds": [
      "7369d87b-007d-5b20-a907-eb6f4e6c7469"
    ],
    "evidence": [
      {
        "id": "chosen-style",
        "title": "Recursos del estilo elegido",
        "success": "Relaciona los recursos y la organización visual de la obra con el referente del estilo elegido entre las alternativas dadas, mediante decisiones reconocibles del producto.",
        "sufficient": "El estilo elegido y su organización se reconocen; una relación visual secundaria queda poco definida.",
        "partial": "Presenta recursos pertinentes, pero una decisión no se vincula con el referente del estilo elegido.",
        "error": "Las decisiones visuales contradicen el referente elegido o no permiten reconocer la organización solicitada."
      }
    ]
  }
]
