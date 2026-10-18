import type { ArtTopic } from './secondary-art'

/** Adaptaciones de AulaBase; el literal oficial se conserva separado. */
export const artGradeTwoTopics: ArtTopic[] = [
  {
    "id": "painting",
    "grade": 2,
    "label": "materiales y técnicas de pintura",
    "match": "pintura|pinturas|pinta[a-z]*",
    "relation": "las relaciones entre soporte, materiales, técnica pictórica y efecto visual en los ejemplos examinados, diferenciando las decisiones técnicas de las preferencias personales",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "6e84e604-676e-5879-ba7a-03b383913adf",
      "65d4fdeb-c866-5c73-96cd-a23d8c833b4d"
    ],
    "evidence": [
      {
        "id": "pictorial-decisions",
        "title": "Relación entre técnica y resultado pictórico",
        "success": "Aplica la técnica pictórica elegida de modo que la relación entre soporte, materiales y organización visual contribuya al mensaje acordado.",
        "sufficient": "El mensaje y la técnica se reconocen; una aplicación secundaria del material deja una zona poco definida sin deshacer la organización visual.",
        "partial": "La técnica se reconoce parcialmente, pero el uso del material dificulta una relación visual necesaria para el mensaje.",
        "error": "El uso del soporte o del material impide reconocer el efecto técnico y visual pedido."
      }
    ]
  },
  {
    "id": "sculpture",
    "grade": 2,
    "label": "escultura modelada y móvil",
    "match": "escultur[a-z]*|modelado",
    "relation": "las relaciones entre material, forma, volumen y procedimiento en la escultura examinada, distinguiendo el modelado y las estructuras móviles cuando se comparan",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "ec60b93a-4a36-59fd-851d-27e190cc9efb",
      "c2f972f5-cb31-5e9f-a1b2-022e90894d37",
      "995ebc75-165e-5cb7-a3bd-082d54cc60cf"
    ],
    "evidence": [
      {
        "id": "sculptural-form",
        "title": "Forma y estructura de la escultura",
        "success": "Relaciona las partes y el material elegido para mantener la forma y el volumen de la escultura conforme al procedimiento solicitado.",
        "sufficient": "La forma y el volumen se mantienen; una unión o acabado secundario queda poco definido sin deshacer la estructura.",
        "partial": "La forma se reconoce, pero una parte no mantiene la relación estructural prevista.",
        "error": "Las partes no sostienen la forma solicitada o contradicen el procedimiento elegido."
      },
      {
        "id": "mobile-relations",
        "title": "Equilibrio y movimiento del móvil",
        "success": "Organiza apoyos, uniones y distribución de las formas para que el móvil mantenga su equilibrio y produzca el movimiento previsto en las condiciones dadas.",
        "sufficient": "El móvil mantiene el equilibrio y se mueve; una relación secundaria limita parte del recorrido sin impedir el funcionamiento.",
        "partial": "Una relación de peso o unión permite solo parte del movimiento previsto o dificulta el equilibrio.",
        "error": "La disposición de las formas impide mantener el equilibrio o el movimiento pedido.",
        "when": "movil|moviles"
      }
    ]
  },
  {
    "id": "engraving",
    "grade": 2,
    "label": "técnicas del grabado",
    "match": "grabado|xilografia|linografia|calcografia|monotipia",
    "relation": "las relaciones entre matriz, procedimiento y huella impresa de las técnicas de grabado examinadas, identificando sus diferencias sin sustituir una técnica por otra",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "28a7dfa3-0578-5490-a9e0-20ea6145cc7e"
    ],
    "evidence": [
      {
        "id": "matrix-print",
        "title": "Relación entre matriz y huella",
        "success": "Obtiene la huella impresa mediante la técnica de grabado expresamente elegida, relacionando la preparación de la matriz con la organización visual del resultado.",
        "sufficient": "La huella y el procedimiento se reconocen; un detalle secundario de transferencia pierde definición sin alterar la organización principal.",
        "partial": "La transferencia permite reconocer parte de la propuesta, pero una relación entre matriz y huella queda sin resolver.",
        "error": "La huella no corresponde al procedimiento solicitado o no permite reconocer la organización prevista."
      }
    ]
  },
  {
    "id": "heritage",
    "grade": 2,
    "label": "patrimonio artístico material e inmaterial",
    "match": "patrimonio[a-z]*|patrimonial[a-z]*",
    "relation": "el significado, la función y la transmisión del patrimonio artístico material o inmaterial en el caso examinado, usando evidencias y distinguiendo objeto, práctica y valoración",
    "pdfPages": [
      332,
      333
    ],
    "sourceRecordIds": [
      "9ea7e6e7-84e5-5638-9c71-1a66ee961d44",
      "6b60c42b-af09-57bc-b9b7-73fa99e9f405",
      "78096436-c20e-5742-96c9-075596427377"
    ],
    "evidence": [
      {
        "id": "patrimonial-reference",
        "title": "Relación con el referente patrimonial",
        "success": "Vincula las decisiones expresivas del producto con rasgos reconocibles del referente patrimonial proporcionado, sin exigir copia literal ni adhesión cultural.",
        "sufficient": "El referente se reconoce en las decisiones principales; una relación expresiva secundaria queda poco clara.",
        "partial": "La relación con el referente aparece en un detalle aislado que no se integra con las decisiones del producto.",
        "error": "El producto no aporta una relación reconocible con el referente expresamente solicitado."
      }
    ]
  },
  {
    "id": "interpretive-styles",
    "grade": 2,
    "label": "estilos interpretativos en teatro y danza",
    "match": "estilos interpretativos?",
    "relation": "las relaciones entre recursos corporales, vocales o de movimiento y las convenciones interpretativas de los fragmentos de teatro o danza examinados",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "1e9a444e-4e6d-5fd5-9186-05532ca9cbc4"
    ],
    "evidence": [
      {
        "id": "interpretive-convention",
        "title": "Recursos y convención interpretativa",
        "success": "Relaciona los recursos expresivos elegidos con la convención interpretativa expresamente trabajada en el fragmento.",
        "sufficient": "La convención se reconoce en los recursos principales; una decisión secundaria queda poco definida.",
        "partial": "Se reconoce un recurso de la convención, pero su función en el fragmento queda desarticulada.",
        "error": "Los recursos no permiten reconocer la convención interpretativa trabajada."
      }
    ]
  },
  {
    "id": "dance-styles",
    "grade": 2,
    "label": "ballet y danzas moderna, posmoderna, contemporánea y folklórica",
    "match": "ballet|danza moderna|danza posmoderna|danza contemporanea|folkloric[a-z]*|folcloric[a-z]*",
    "relation": "las diferencias contextuales y estéticas de las danzas expresamente examinadas, relacionando ejemplos de movimiento y convenciones sin ordenar los estilos por superioridad",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "262c8de6-ac73-5a64-8cd0-1306738be1ee",
      "215072b8-67df-591f-ba2f-dcfa2aa6096e"
    ],
    "evidence": [
      {
        "id": "dance-conventions",
        "title": "Relación de movimientos y estilo",
        "success": "Relaciona los movimientos expresamente pedidos con las convenciones de la danza trabajada y las condiciones adaptadas del ejercicio.",
        "sufficient": "El estilo se reconoce en la secuencia principal; una transición secundaria queda poco definida.",
        "partial": "Algunos movimientos se relacionan con el estilo, pero una transición interrumpe la coherencia de la secuencia.",
        "error": "La secuencia no permite reconocer las convenciones expresamente trabajadas."
      }
    ]
  },
  {
    "id": "urban-dance",
    "grade": 2,
    "label": "rutinas de danza urbana",
    "match": "danza urbana|danzas urbanas",
    "relation": "las relaciones entre movimiento, ritmo, contexto y organización espacial de las rutinas urbanas examinadas, conservando las adaptaciones expresamente dadas",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "b34ecce2-7f70-575a-b06b-885d9b4c437f",
      "1bdf796c-dc13-5a46-9f59-26e76986a665"
    ],
    "evidence": [
      {
        "id": "urban-sequence",
        "title": "Relación de secuencia, ritmo y espacio",
        "success": "Interpreta la secuencia de danza urbana acordada manteniendo sus relaciones rítmicas y espaciales en las condiciones de movimiento adaptadas que se indicaron.",
        "sufficient": "La secuencia y su relación rítmica se reconocen; una transición espacial secundaria queda desajustada sin impedir su continuidad.",
        "partial": "La secuencia contiene los movimientos centrales, pero una relación rítmica o espacial impide mantener parte de su continuidad.",
        "error": "Los movimientos no mantienen la relación rítmica o espacial acordada y no permiten reconocer la secuencia.",
        "plan": {
          "title": "Plan de secuencia, ritmo y espacio",
          "success": "Planifica la secuencia de danza urbana relacionando movimientos, pauta rítmica y recorridos en el espacio acordado, sin exigir su ejecución.",
          "sufficient": "El plan relaciona secuencia, ritmo y espacio; una transición secundaria queda poco precisada.",
          "partial": "El plan enumera movimientos, pero una relación con el ritmo o el recorrido no permite seguir parte de la propuesta.",
          "error": "El plan no relaciona los movimientos con la pauta rítmica o con el espacio acordado."
        }
      }
    ]
  },
  {
    "id": "stage-direction",
    "grade": 2,
    "label": "dirección y montaje teatral",
    "match": "pieza teatral|piezas teatrales|montaje teatral|direccion escenica|dramaturgia",
    "relation": "las relaciones entre dramaturgia, personajes, conflicto, tiempo, espacio y recursos técnicos del montaje teatral examinado",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "a5d537d2-194e-53a3-ac36-d9de789a5d7d",
      "bf5b7374-c155-5466-8f65-d4302d1d68e9"
    ],
    "evidence": [
      {
        "id": "dramatic-relations",
        "title": "Relaciones dramáticas y escénicas",
        "success": "Representa las acciones de los personajes de modo coherente con el conflicto, el tiempo, el espacio y los recursos técnicos acordados en la dramaturgia dada.",
        "sufficient": "El conflicto y la relación de las acciones se reconocen; un recurso escénico secundario queda impreciso sin cambiar el sentido de la pieza.",
        "partial": "La pieza permite reconocer el conflicto, pero una acción o recurso escénico no se vincula con sus condiciones.",
        "error": "Las acciones o los recursos contradicen las condiciones dramáticas y no permiten reconocer el conflicto de la pieza.",
        "plan": {
          "title": "Plan de relaciones dramáticas y escénicas",
          "success": "Planifica las relaciones entre dramaturgia, personajes, conflicto, tiempo, espacio y recursos técnicos disponibles de modo que el montaje previsto resulte realizable.",
          "sufficient": "El plan relaciona las condiciones dramáticas y técnicas centrales; una decisión secundaria queda sin precisar.",
          "partial": "El plan enumera las condiciones del montaje, pero una relación necesaria entre acciones y recursos queda sin resolver.",
          "error": "Las decisiones del plan contradicen las condiciones de la pieza o los recursos disponibles e impiden realizar el montaje previsto."
        }
      }
    ]
  },
  {
    "id": "theatre-traditions",
    "grade": 2,
    "label": "realismo teatral, teatro épico y antropología teatral",
    "match": "realismo teatral|teatro epico|antropologia teatral",
    "relation": "las convenciones y los contextos del realismo teatral, teatro épico o antropología teatral expresamente examinados, usando rasgos del fragmento sin declarar superior una tradición",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "02059180-8af3-5bf1-a86f-2e9089e9eda3"
    ],
    "evidence": [
      {
        "id": "theatrical-reference",
        "title": "Uso del referente teatral",
        "success": "Relaciona las decisiones de la propuesta escénica con rasgos de la tradición teatral expresamente trabajada.",
        "sufficient": "La tradición se reconoce en las decisiones principales; un recurso secundario queda poco definido.",
        "partial": "La propuesta emplea un rasgo aislado, pero su función no se relaciona con el conjunto escénico.",
        "error": "Las decisiones no permiten reconocer la tradición teatral expresamente solicitada."
      }
    ]
  },
  {
    "id": "expression-exploration",
    "grade": 2,
    "label": "exploración expresiva de teatro y danza",
    "match": "explora[a-z]* diversas formas de expresion",
    "relation": "las diferencias expresivas entre las propuestas corporales, teatrales o de danza examinadas, relacionando decisiones y efectos observables",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "e9b0dc00-be2b-5334-b2c9-708ec54b78b4"
    ],
    "evidence": [
      {
        "id": "expressive-options",
        "title": "Exploración y contraste expresivo",
        "success": "Propone y prueba formas expresivas diferentes con los recursos disponibles y registra las diferencias de sus efectos expresivos.",
        "sufficient": "Las propuestas difieren y sus efectos se reconocen; una relación secundaria con el registro queda poco definida.",
        "partial": "Las propuestas muestran alguna diferencia, pero el registro no relaciona un cambio con su efecto expresivo.",
        "error": "Las propuestas no presentan diferencias expresivas reconocibles o no aportan evidencia de la exploración pedida."
      }
    ]
  },
  {
    "id": "musical-theatre",
    "grade": 2,
    "label": "historia y exponentes del teatro musical",
    "match": "historia.*teatro musical|exponentes.*teatro musical|historia y los principales exponentes del teatro musical|teatro musical y su permanencia",
    "relation": "las relaciones entre contexto histórico, características y exponentes del teatro musical de las fuentes examinadas, distinguiendo obras, autores e intérpretes",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "5a8fcc34-46b0-5840-8c8c-ad868fa429b0"
    ],
    "evidence": [
      {
        "id": "musical-context",
        "title": "Relación del referente musical con su contexto",
        "success": "Relaciona los recursos teatrales y musicales de la propuesta con rasgos documentados del referente histórico expresamente trabajado.",
        "sufficient": "El referente histórico se reconoce en los recursos principales; una relación secundaria queda poco definida.",
        "partial": "Se reconoce un recurso del referente, pero su relación con el contexto queda sin sustentar.",
        "error": "Los recursos contradicen los datos del referente trabajado o no permiten reconocer su relación histórica."
      }
    ]
  },
  {
    "id": "musical-research",
    "grade": 2,
    "label": "investigación de montajes de Broadway en República Dominicana",
    "match": "montajes? de broadway|investiga[a-z]*.*broadway",
    "relation": "los datos, fuentes y relaciones documentadas de los montajes de Broadway en República Dominicana examinados, diferenciando resultados e interpretaciones",
    "pdfPages": [
      332,
      333
    ],
    "sourceRecordIds": [
      "c42387fe-20cb-5ac7-a00f-6437b96601fb",
      "77b0fafa-7cb0-542c-bb84-957a97e8b86d"
    ],
    "evidence": [
      {
        "id": "documented-research",
        "title": "Pregunta, fuentes y contraste",
        "success": "Relaciona una pregunta de investigación sobre el montaje con datos identificables de las fuentes consultadas y contrasta sus coincidencias o diferencias pertinentes.",
        "sufficient": "La pregunta y sus datos se relacionan con fuentes identificables; un contraste secundario queda poco precisado.",
        "partial": "La investigación presenta datos pertinentes, pero una fuente o una relación de contraste no queda identificada.",
        "error": "Los datos no responden a la pregunta o se presentan sin fuentes que permitan reconocer su procedencia."
      },
      {
        "id": "research-results",
        "title": "Resultados documentados",
        "success": "Comunica resultados sobre el montaje vinculando cada conclusión con los datos examinados y distinguiendo información comprobada de interpretación.",
        "sufficient": "Los resultados se relacionan con los datos; una conclusión secundaria queda poco explicitada sin cambiar la respuesta principal.",
        "partial": "Los resultados incluyen información pertinente, pero una conclusión no se vincula con los datos examinados.",
        "error": "Las conclusiones contradicen los datos o no permiten reconocer una respuesta documentada a la pregunta."
      }
    ]
  },
  {
    "id": "scenic-model",
    "grade": 2,
    "label": "maquetas o prototipos escénicos",
    "match": "maqueta[a-z]*|prototipo[a-z]*",
    "relation": "las relaciones de ubicación, proporción funcional y uso de los elementos de la maqueta o prototipo escénico examinado, distinguiendo representación del espacio y función de sus partes",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "2172242a-bd60-5f18-bb9f-325d342e70f4"
    ],
    "evidence": [
      {
        "id": "scenic-function",
        "title": "Relaciones espaciales del modelo",
        "success": "Construye el modelo escénico elegido mostrando la ubicación y la función de sus elementos de modo coherente con las acciones del fragmento proporcionado.",
        "sufficient": "La ubicación y las funciones principales se reconocen; un detalle espacial secundario queda poco definido.",
        "partial": "El modelo presenta los elementos principales, pero una relación de ubicación o función no corresponde al fragmento.",
        "error": "Las relaciones espaciales del modelo impiden reconocer las funciones requeridas por el fragmento."
      }
    ]
  },
  {
    "id": "musical-fragment",
    "grade": 2,
    "label": "recreación de fragmentos de teatro musical",
    "match": "representa[a-z]* un fragmento de teatro musical|recrea[a-z]*.*fragmento.*teatro musical",
    "relation": "las relaciones entre acciones, personajes y música de la recreación del fragmento de teatro musical examinado",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "2172242a-bd60-5f18-bb9f-325d342e70f4"
    ],
    "evidence": [
      {
        "id": "musical-scene",
        "title": "Acción y música del fragmento",
        "success": "Relaciona las acciones y los personajes con la música acordada durante la representación para mantener el sentido del fragmento dado.",
        "sufficient": "El sentido del fragmento se reconoce; una transición secundaria entre acción y música queda desajustada.",
        "partial": "Se reconocen acciones y música del fragmento, pero una relación entre ellas interrumpe su sentido.",
        "error": "Las acciones y la música no se relacionan con las condiciones del fragmento y no permiten reconocer su sentido."
      }
    ]
  },
  {
    "id": "urban-music",
    "grade": 2,
    "label": "melodías y ritmos urbanos",
    "match": "musica urbana|melodia[a-z]* y (?:un )?ritmo[a-z]* urbanos?|ritmos? urbanos?",
    "relation": "las relaciones de melodía, ritmo, recursos expresivos y contexto de los fragmentos de música urbana examinados",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "18d70cb3-2a80-5bd9-91df-667067578c63",
      "c0861860-3245-53b9-9516-d7681b9c4794"
    ],
    "evidence": [
      {
        "id": "urban-interpretation",
        "title": "Relación rítmica y expresiva",
        "success": "Interpreta el fragmento urbano mediante el medio expresamente solicitado, manteniendo sus relaciones rítmicas, melódicas y expresivas acordadas.",
        "sufficient": "El fragmento y sus relaciones principales se reconocen; una entrada o transición secundaria queda imprecisa sin romper la continuidad.",
        "partial": "El fragmento se reconoce parcialmente, pero una relación rítmica o melódica impide mantener parte de su continuidad.",
        "error": "La ejecución no mantiene las relaciones del fragmento y no permite reconocer la interpretación pedida."
      }
    ]
  },
  {
    "id": "social-singing",
    "grade": 2,
    "label": "canto lírico y popular de temática social",
    "match": "canto lirico|canto popular|cantantes? liric[a-z]*|canto lirico y popular",
    "relation": "las relaciones entre recursos vocales, contexto y temática social de las audiciones líricas o populares examinadas, usando evidencias sonoras sin exigir adhesión al mensaje",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "854b8aa3-97df-5d94-b774-3e8d46d9d974",
      "9ab8f289-074a-572b-a88c-18ba1a8a81e8",
      "5c3cc372-b24a-5015-a955-818a77ef2327"
    ],
    "evidence": [
      {
        "id": "song-expression",
        "title": "Recursos vocales y temática",
        "success": "Relaciona los recursos vocales de la interpretación solicitada con el sentido de la temática del fragmento dado.",
        "sufficient": "La temática se reconoce en la interpretación; un recurso vocal secundario queda poco definido sin cambiar el sentido principal.",
        "partial": "La interpretación permite reconocer parte del fragmento, pero un recurso vocal no se relaciona con su temática.",
        "error": "Los recursos vocales no permiten reconocer el sentido expresamente trabajado en el fragmento."
      }
    ]
  },
  {
    "id": "operatic-genres",
    "grade": 2,
    "label": "ópera, opereta, zarzuela y revista musical",
    "match": "opera|opereta|zarzuela|operistic[a-z]*|revista musical",
    "relation": "las características musicales y escénicas, el contexto y los exponentes de los géneros operísticos examinados, distinguiendo compositor e intérprete mediante evidencias de las fuentes y audiciones",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "dd15a9c8-09df-5dee-b761-9ec896841cf7",
      "b53967ef-06a0-5ad3-aa56-a7fd0f4407a8"
    ],
    "evidence": [
      {
        "id": "operatic-resources",
        "title": "Relación de recursos operísticos",
        "success": "Relaciona los recursos vocales, musicales y escénicos expresamente trabajados con el género del fragmento interpretado.",
        "sufficient": "El género se reconoce en los recursos principales; una relación expresiva secundaria queda poco definida.",
        "partial": "Se reconoce un recurso del género, pero su función no se integra con el fragmento.",
        "error": "Los recursos no permiten reconocer el género expresamente trabajado."
      }
    ]
  },
  {
    "id": "musical-story",
    "grade": 2,
    "label": "cuento musical",
    "match": "cuento musical",
    "relation": "las relaciones entre sucesos narrados y recursos sonoros del cuento musical examinado, identificando cómo contribuyen a su sentido",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "26120ba2-2031-5b2c-81c4-e511724a796c",
      "d6b582ba-3bd9-558f-bf44-7d842e794576"
    ],
    "evidence": [
      {
        "id": "narrative-sound",
        "title": "Relación entre narración y sonidos",
        "success": "Organiza los sucesos del cuento y los sonidos elegidos de modo que sus relaciones contribuyan al sentido de la narración ficticia.",
        "sufficient": "La narración y sus sonidos se relacionan; una transición sonora secundaria queda poco definida sin cambiar el sentido principal.",
        "partial": "El cuento presenta sonidos pertinentes, pero una relación con el suceso narrado queda sin resolver.",
        "error": "Los sonidos contradicen o no permiten reconocer su función en la narración solicitada."
      }
    ]
  },
  {
    "id": "character-motifs",
    "grade": 2,
    "label": "motivos musicales de personajes",
    "match": "motivos? musicales?",
    "relation": "las relaciones entre rasgos sonoros de los motivos y la función de los personajes o elementos del cuento musical examinado",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "4e47da3f-2e8a-5604-b302-e19a430a7a06"
    ],
    "evidence": [
      {
        "id": "motif-function",
        "title": "Motivo y función narrativa",
        "success": "Crea motivos musicales diferenciables y relaciona sus rasgos sonoros con la función de los personajes o elementos expresamente dados.",
        "sufficient": "Los motivos y sus funciones se reconocen; un rasgo secundario deja una ambigüedad sin confundir la relación principal.",
        "partial": "Los motivos se distinguen parcialmente, pero uno no mantiene relación reconocible con su función narrativa.",
        "error": "Los motivos no se diferencian o no permiten reconocer la función de los personajes o elementos pedidos."
      }
    ]
  },
  {
    "id": "dominican-musical-works",
    "grade": 2,
    "label": "obras musicales dominicanas y sus exponentes",
    "match": "obras musicales dominicanas",
    "relation": "las relaciones entre obras dominicanas, géneros, compositores e intérpretes expresamente examinados, usando datos y rasgos de las audiciones sin evaluar fe o gusto personal",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "2764027b-2b82-55d4-be6b-12316e80c1a6"
    ],
    "evidence": [
      {
        "id": "musical-reference",
        "title": "Relación con la obra dominicana trabajada",
        "success": "Relaciona los recursos de la propuesta con rasgos reconocibles de la obra y el género dominicanos expresamente dados.",
        "sufficient": "La obra o el género se reconoce en la propuesta; una relación secundaria queda poco definida.",
        "partial": "Se reconoce un recurso aislado de la obra, pero su función no se integra con la propuesta.",
        "error": "Los recursos no permiten reconocer la relación con la obra o el género trabajado."
      }
    ]
  },
  {
    "id": "music-making",
    "grade": 2,
    "label": "interpretación, creación e improvisación musical",
    "match": "improvisa[a-z]*|improvisacion musical|crea[a-z]* una propuesta musical|interpretacion, creacion e improvisacion musical|pieza musical|propuesta musical",
    "relation": "las diferencias entre interpretar, crear e improvisar música y las relaciones de los recursos sonoros con las pautas expresamente examinadas",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "168a0010-f3fd-5a9d-a2ab-b39e14261b44",
      "fa72e000-9545-52d5-b8fc-8b2bf36ca048"
    ],
    "evidence": [
      {
        "id": "musical-prompt",
        "title": "Respuesta musical a la pauta",
        "success": "Organiza la respuesta musical solicitada relacionando sus decisiones sonoras con la pauta y los medios disponibles acordados.",
        "sufficient": "La respuesta mantiene la pauta y se reconoce su organización; una relación sonora secundaria queda poco definida.",
        "partial": "La respuesta conserva parte de la pauta, pero una decisión sonora interrumpe su relación con la propuesta.",
        "error": "La respuesta no mantiene una relación reconocible con la pauta musical dada.",
        "when": "^(?!interpret|improvis)"
      },
      {
        "id": "improvisation",
        "title": "Improvisación a partir de la pauta",
        "success": "Improvisa una respuesta musical durante el ejercicio que mantiene una relación reconocible con la pauta rítmica dada y utiliza los medios sonoros disponibles.",
        "sufficient": "La respuesta improvisada mantiene la pauta y su continuidad; una decisión sonora secundaria queda poco definida sin romper la relación principal.",
        "partial": "La respuesta improvisada conserva parte de la pauta, pero una decisión sonora interrumpe su continuidad en el ejercicio.",
        "error": "La respuesta ejecutada no mantiene una relación reconocible con la pauta dada o sustituye la improvisación solicitada por otro producto.",
        "when": "^improvis"
      },
      {
        "id": "interpretation",
        "title": "Interpretación de la pieza dada",
        "success": "Interpreta la pieza musical dada manteniendo sus relaciones rítmicas y expresivas mediante los medios sonoros disponibles acordados.",
        "sufficient": "La pieza y su continuidad se reconocen; una entrada o transición secundaria queda imprecisa sin cambiar su sentido principal.",
        "partial": "La interpretación permite reconocer parte de la pieza, pero una relación rítmica o expresiva interrumpe su continuidad.",
        "error": "La ejecución contradice las relaciones de la pieza dada o no permite reconocer la interpretación solicitada.",
        "when": "^interpret"
      }
    ]
  },
  {
    "id": "music-function",
    "grade": 2,
    "label": "función de la música en medios escénicos y cine",
    "match": "funcion de la musica",
    "relation": "las relaciones entre música, acciones y sentido de las escenas de teatro, revista musical o cine expresamente examinadas",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "b82c19bc-c171-58b7-ac87-3e423ca366c4"
    ],
    "evidence": [
      {
        "id": "scene-sound-function",
        "title": "Función de la música en la escena",
        "success": "Relaciona la música elegida con las acciones y el sentido de la escena expresamente trabajada.",
        "sufficient": "La función de la música se reconoce en la escena; una relación secundaria queda poco definida.",
        "partial": "La música se relaciona con una parte de la escena, pero una decisión sonora no contribuye a su sentido.",
        "error": "La música no presenta una relación reconocible con las acciones o el sentido pedido."
      }
    ]
  },
  {
    "id": "shared-elements",
    "grade": 2,
    "label": "elementos afines entre lenguajes artísticos",
    "match": "elementos afines|ritmo y el contraste|ritmo y contraste",
    "relation": "las relaciones de los elementos expresamente comparados entre los lenguajes artísticos de los ejemplos dados, identificando su función sin equiparar literalmente medios visuales y sonoros",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "9d1d7901-b140-528c-ac55-7d3ae2b907a5"
    ],
    "evidence": [
      {
        "id": "cross-language-relation",
        "title": "Relaciones entre lenguajes artísticos",
        "success": "Relaciona el elemento expresamente trabajado en los lenguajes elegidos mediante decisiones que hacen reconocible su función en cada medio.",
        "sufficient": "El elemento se reconoce en los medios elegidos; una relación secundaria entre ellos queda poco definida.",
        "partial": "El elemento aparece en cada medio, pero una relación entre sus funciones queda sin resolver.",
        "error": "Las decisiones no permiten reconocer la relación del elemento entre los medios pedidos."
      }
    ]
  },
  {
    "id": "textile-print",
    "grade": 2,
    "label": "estampado textil",
    "match": "estampado[a-z]*|estampa[a-z]* textil",
    "relation": "las relaciones entre tinte, soporte, matriz o procedimiento y huella del estampado textil examinado, según los materiales expresamente elegidos",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "92516ddd-7173-53e6-ae43-58220fea7daf",
      "0f8663e5-dd5b-500e-9ce5-72ccca665b57",
      "6e5deec5-563f-567d-95c7-4ac3f860af8d"
    ],
    "evidence": [
      {
        "id": "textile-transfer",
        "title": "Huella y soporte del estampado",
        "success": "Relaciona el tinte y el procedimiento elegidos con el soporte para obtener una huella textil reconocible conforme al diseño acordado, utilizando los materiales disponibles de forma segura.",
        "sufficient": "La huella y el diseño se reconocen; una zona secundaria pierde definición sin alterar la organización principal.",
        "partial": "La huella aparece parcialmente, pero una relación entre procedimiento y soporte impide reconocer parte del diseño.",
        "error": "La transferencia no permite reconocer el diseño o contradice las condiciones de uso del material dado."
      }
    ]
  },
  {
    "id": "textile-textures",
    "grade": 2,
    "label": "bordado y texturas textiles",
    "match": "textura textil|texturas textiles|bordado|bordados",
    "relation": "las relaciones entre procedimiento, material y efectos táctiles o visuales de las texturas textiles examinadas, distinguiendo las alternativas de técnica cuando correspondan",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "92516ddd-7173-53e6-ae43-58220fea7daf",
      "6e5deec5-563f-567d-95c7-4ac3f860af8d"
    ],
    "evidence": [
      {
        "id": "texture-effect",
        "title": "Procedimiento y efecto de textura",
        "success": "Relaciona el procedimiento textil elegido y los materiales disponibles con el efecto táctil y visual previsto en la textura solicitada.",
        "sufficient": "El efecto de textura se reconoce; una unión o detalle secundario queda poco definido sin deshacerlo.",
        "partial": "El efecto se reconoce parcialmente, pero una relación entre material y procedimiento no permite mantenerlo en parte del producto.",
        "error": "El procedimiento no produce una relación reconocible con el efecto de textura previsto."
      }
    ]
  },
  {
    "id": "fashion-function",
    "grade": 2,
    "label": "valor artístico y funcional del diseño textil y de moda",
    "match": "diseno textil y de moda|valor artistico y funcional.*moda",
    "relation": "las relaciones entre decisiones de forma, recursos expresivos y uso del diseño textil o de moda examinado, sin evaluar cuerpos, marcas ni gustos personales",
    "pdfPages": [
      332,
      333
    ],
    "sourceRecordIds": [
      "07064e41-689d-5acb-86f4-9dd44b7fbcfb",
      "4c8a64b0-8722-59b9-aabb-57d54b68da7c"
    ],
    "evidence": [
      {
        "id": "design-use",
        "title": "Relación entre decisiones y uso",
        "success": "Relaciona las decisiones expresivas del diseño con su función y sus condiciones de uso expresamente acordadas.",
        "sufficient": "La función y las decisiones principales se reconocen; un detalle secundario queda poco definido sin impedir el uso previsto.",
        "partial": "Las decisiones permiten reconocer la función, pero una relación entre forma y uso queda sin resolver.",
        "error": "Las decisiones contradicen las condiciones de uso o impiden reconocer la función solicitada."
      }
    ]
  },
  {
    "id": "costume",
    "grade": 2,
    "label": "diseño y adaptación de vestuario",
    "match": "vestuario[a-z]*|vestuarios",
    "relation": "las relaciones entre vestuario, personaje, movimiento y función escénica en los ejemplos examinados, distinguiendo elaboración y adaptación según el encargo",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "8fd1a3a9-5cd7-59fb-af14-bc633fe7b81e"
    ],
    "evidence": [
      {
        "id": "costume-role",
        "title": "Vestuario, rol y movimiento",
        "success": "Relaciona las modificaciones o decisiones del vestuario expresamente pedidas con el rol del personaje y las condiciones de movimiento de la escena.",
        "sufficient": "El rol y el movimiento se reconocen en el vestuario; una modificación secundaria queda poco definida sin impedir su función.",
        "partial": "El vestuario aporta rasgos del personaje, pero una decisión dificulta el movimiento o su función escénica.",
        "error": "Las decisiones del vestuario contradicen las condiciones del personaje o impiden la función de movimiento solicitada."
      }
    ]
  },
  {
    "id": "decorative-arts",
    "grade": 2,
    "label": "artes decorativas",
    "match": "artes decorativas",
    "relation": "las relaciones entre recursos visuales, material y función del objeto de artes decorativas examinado",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "13571b18-0cf7-5b17-aad7-3639eb89a615"
    ],
    "evidence": [
      {
        "id": "decoration-function",
        "title": "Recurso decorativo y función",
        "success": "Relaciona los recursos decorativos elegidos con el material y el uso del objeto, manteniendo su función acordada.",
        "sufficient": "La decoración se relaciona con el uso y la función se mantiene; un detalle visual secundario queda poco definido.",
        "partial": "La decoración permite reconocer una intención, pero un recurso dificulta parte del uso previsto.",
        "error": "La intervención impide la función del objeto o no presenta relación reconocible con el recurso decorativo pedido."
      }
    ]
  },
  {
    "id": "interior-design",
    "grade": 2,
    "label": "diseño de interiores",
    "match": "interiores|distribucion del espacio interior",
    "relation": "las relaciones entre distribución, uso, recursos visuales y condiciones de accesibilidad del espacio interior examinado",
    "pdfPages": [
      332,
      333
    ],
    "sourceRecordIds": [
      "9d4f95cf-4ec3-5ab8-bd1d-765bc9163150",
      "dcce5856-4405-55a0-9e55-d8796a182fc9",
      "51063104-5e90-5aa7-94a7-5453e3138f73"
    ],
    "evidence": [
      {
        "id": "interior-relations",
        "title": "Distribución y uso del espacio",
        "success": "Propone una distribución del interior que relaciona sus usos y recursos visuales con las condiciones de accesibilidad expresamente indicadas.",
        "sufficient": "Los usos y recorridos se reconocen y permiten la accesibilidad pedida; un recurso visual secundario queda poco definido.",
        "partial": "La distribución permite parte del uso previsto, pero una relación espacial no resuelve una condición dada.",
        "error": "La distribución contradice el uso o una condición de accesibilidad expresamente requerida."
      }
    ]
  },
  {
    "id": "built-environment",
    "grade": 2,
    "label": "arquitectura, jardinería y urbanismo",
    "match": "arquitectura|jardineria|urbanismo",
    "relation": "las funciones y relaciones de arquitectura, jardinería o urbanismo expresamente examinadas en el entorno, distinguiendo escalas, usos y condiciones de las propuestas",
    "pdfPages": [
      332,
      333
    ],
    "sourceRecordIds": [
      "5a773ec4-b0e1-5195-9747-2da8989059bf",
      "dcce5856-4405-55a0-9e55-d8796a182fc9"
    ],
    "evidence": [
      {
        "id": "environment-proposal",
        "title": "Relaciones de uso y entorno",
        "success": "Propone relaciones espaciales y recursos para el ámbito del entorno expresamente pedido, atendiendo sus usos y condiciones dadas.",
        "sufficient": "Los usos y relaciones principales se reconocen; una decisión espacial secundaria queda poco definida.",
        "partial": "La propuesta atiende parte del uso, pero una relación entre recursos y condiciones queda sin resolver.",
        "error": "La propuesta contradice los usos o las condiciones del ámbito del entorno solicitado."
      }
    ]
  },
  {
    "id": "artistic-presentation",
    "grade": 2,
    "label": "presentación de obras artísticas",
    "match": "presenta[a-z]* la obra artistica|presentacion de obras artisticas|presentaciones artisticas",
    "relation": "las relaciones entre organización del espacio, recursos y comunicación de la obra en la presentación examinada, según las condiciones del público y lugar acordados",
    "pdfPages": [
      332
    ],
    "sourceRecordIds": [
      "a3a185ec-581f-5ef3-8c7c-c382f45633f7"
    ],
    "evidence": [
      {
        "id": "presentation-communication",
        "title": "Obra, espacio y comunicación",
        "success": "Organiza la obra y los recursos de presentación para que el público acordado pueda reconocer su sentido en las condiciones del espacio dado.",
        "sufficient": "La obra se comunica y sus recursos principales se relacionan con el espacio; un detalle secundario queda poco definido.",
        "partial": "La presentación permite reconocer parte de la obra, pero una relación de espacio o recurso dificulta su comunicación.",
        "error": "La organización de la presentación impide reconocer el sentido de la obra en las condiciones dadas."
      }
    ]
  },
  {
    "id": "popular-dominican-art",
    "grade": 2,
    "label": "arte popular dominicano de distintas épocas",
    "match": "arte popular dominicano|artistas nacionales",
    "relation": "las características de géneros, estilos, recursos y contextos del arte popular dominicano de las épocas expresamente examinadas, usando evidencias de las obras",
    "pdfPages": [
      333
    ],
    "sourceRecordIds": [
      "60988312-f769-5336-a017-5b9dd10bcf59",
      "7540a09e-1d52-57ef-aa21-7943e32559b1",
      "49740a39-4acf-5ed0-bd5b-1f046ce7f084"
    ],
    "evidence": [
      {
        "id": "popular-reference",
        "title": "Relación con referentes del arte popular",
        "success": "Relaciona las decisiones del producto con rasgos reconocibles de los referentes del arte popular dominicano expresamente trabajados.",
        "sufficient": "Los referentes se reconocen en las decisiones principales; un rasgo secundario queda poco definido.",
        "partial": "Se reconoce un rasgo del referente, pero su función no se integra con el producto.",
        "error": "Las decisiones no permiten reconocer una relación con los referentes pedidos."
      }
    ]
  },
  {
    "id": "recycled-art",
    "grade": 2,
    "label": "creación con recursos desechados",
    "match": "recursos naturales desechados|recursos desechados|materiales naturales desechados",
    "relation": "las relaciones entre selección, transformación y función artística de los recursos desechados de los ejemplos dados, distinguiendo aprovechamiento y extracción dañina",
    "pdfPages": [
      333,
      332
    ],
    "sourceRecordIds": [
      "e8de677d-4c82-54b2-953b-43925506cb62",
      "477594c5-4904-54ee-a5bb-e1f989da3f5e",
      "af0a3c3f-d4d6-5c48-97b5-72fc64203f50",
      "4e04592f-418b-5a34-a718-a6665e3ba53b"
    ],
    "evidence": [
      {
        "id": "material-transformation",
        "title": "Transformación y función artística",
        "success": "Transforma los recursos desechados disponibles relacionando sus propiedades y uniones con la función artística acordada, sin recurrir a extracción dañina.",
        "sufficient": "La transformación y la función se reconocen; una unión secundaria queda poco definida sin impedir el resultado previsto.",
        "partial": "Los recursos se transforman parcialmente, pero una relación entre sus propiedades y la función queda sin resolver.",
        "error": "La transformación impide reconocer la función artística pedida o contradice las condiciones de aprovechamiento dadas."
      }
    ]
  },
  {
    "id": "art-safety",
    "grade": 2,
    "label": "seguridad en el uso artístico de materiales",
    "match": "acciones de seguridad|seguridad.*materiales|manejo seguro",
    "relation": "las relaciones entre acciones observables de protección, instrucciones y uso de materiales artísticos en las situaciones examinadas, sin inferir personalidad ni estado de salud",
    "pdfPages": [
      333
    ],
    "sourceRecordIds": [
      "82a71ba8-d3a7-5f10-bb38-9e401eb7f391"
    ],
    "evidence": [
      {
        "id": "observed-safety",
        "title": "Acciones de seguridad acordadas",
        "success": "Realiza las acciones concretas de seguridad acordadas en todas las oportunidades observadas de uso de los materiales.",
        "sufficient": "Realiza las acciones concretas de seguridad acordadas en casi todas las oportunidades observadas.",
        "partial": "Realiza las acciones concretas de seguridad acordadas en algunas oportunidades observadas.",
        "error": "Realiza las acciones concretas de seguridad acordadas en pocas oportunidades observadas.",
        "absent": "No realiza las acciones concretas de seguridad acordadas en las oportunidades observadas de uso de los materiales."
      }
    ]
  },
  {
    "id": "art-technology",
    "grade": 2,
    "label": "recursos tecnológicos en la creación artística",
    "match": "recurso tecnologico|recursos tecnologicos|herramientas tecnologicas",
    "relation": "las relaciones entre la función del recurso tecnológico expresamente usado y las decisiones o comunicación de la obra examinada, sin exigir herramientas adicionales",
    "pdfPages": [
      333
    ],
    "sourceRecordIds": [
      "3bf7dd9a-53eb-5f63-bb96-fce0c563a9c0",
      "77b0fafa-7cb0-542c-bb84-957a97e8b86d"
    ],
    "evidence": [
      {
        "id": "technology-purpose",
        "title": "Recurso tecnológico y propósito expresivo",
        "success": "Utiliza el recurso tecnológico elegido de modo que su función contribuya a las decisiones y al mensaje acordados en la obra.",
        "sufficient": "El recurso contribuye al mensaje principal; una función secundaria queda poco definida sin impedir su comunicación.",
        "partial": "El recurso se utiliza, pero una decisión de uso no se relaciona con el mensaje o con las condiciones del producto.",
        "error": "El uso del recurso impide reconocer su contribución al propósito artístico expresamente pedido."
      }
    ]
  },
  {
    "id": "artistic-argument",
    "grade": 2,
    "label": "argumentación sobre decisiones artísticas",
    "match": "argumenta[a-z]*.*eleccion.*elementos artisticos|criterios tecnicos dados",
    "relation": "las relaciones entre afirmaciones sobre las decisiones artísticas, criterios expresamente dados y evidencias de la obra, distinguiendo razones técnicas y preferencias personales",
    "pdfPages": [
      333
    ],
    "sourceRecordIds": [
      "a60008f8-52ef-5a7f-9f96-642bf1be357a",
      "a1de755d-178f-5a43-a32e-c94c78dc05d1",
      "29c972dd-f21c-5a65-90cc-dc99d4676c55"
    ],
    "evidence": [
      {
        "id": "artistic-reason",
        "title": "Razones y evidencias de la elección",
        "success": "Sostiene la elección artística mediante razones vinculadas con los criterios dados y con evidencias reconocibles de la obra.",
        "sufficient": "Las razones sostienen la elección con evidencias pertinentes; una relación secundaria queda poco precisada.",
        "partial": "La elección se acompaña de razones, pero una de ellas no se vincula con los criterios o las evidencias de la obra.",
        "error": "Las razones contradicen la obra o sustituyen la evidencia pedida por juicios sobre las personas."
      }
    ]
  },
  {
    "id": "context-creation",
    "grade": 2,
    "label": "creación inspirada en referentes del contexto",
    "match": "inspirada en imagenes|inspirado en imagenes|relatos del contexto|referentes del contexto",
    "relation": "las relaciones entre el referente contextual expresamente elegido y las decisiones expresivas de la obra examinada, sin exigir todos los medios ni revelar intimidad",
    "pdfPages": [
      333
    ],
    "sourceRecordIds": [
      "19512bcf-3a1a-5d82-9c39-f7284b694489",
      "ead2a976-3ca9-53ba-85f2-92522b2f3d36",
      "6e14c1d1-cd2d-5b17-80c9-3b69440afe2e"
    ],
    "evidence": [
      {
        "id": "context-reference",
        "title": "Referente y decisiones expresivas",
        "success": "Relaciona los rasgos del referente contextual elegido con decisiones expresivas reconocibles en la obra solicitada.",
        "sufficient": "El referente se reconoce en las decisiones principales; una relación expresiva secundaria queda poco definida.",
        "partial": "El referente aparece en un detalle aislado, pero su relación con el conjunto de la obra queda sin resolver.",
        "error": "Las decisiones no permiten reconocer la relación con el referente expresamente elegido."
      }
    ]
  }
]
