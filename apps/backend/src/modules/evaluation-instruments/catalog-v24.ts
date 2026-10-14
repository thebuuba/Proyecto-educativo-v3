import {evaluationCatalogV23} from './catalog-v23'
export const evaluationCatalogV24={
 ...evaluationCatalogV23,
 version:'evaluation-2026.24',
 secondGradeLanguageFeatures:{
  "noticia": [
    {
      "id": "newsworthiness",
      "match": "noticiabilidad|hecho sea noticia|hecho noticioso|actualidad|relevancia|caracteristicas de la noticia",
      "name": "los rasgos que hacen noticioso un hecho",
      "function": "justificar su actualidad o relevancia para el público a partir de datos disponibles",
      "error": "se confunde una preferencia personal con un dato que muestra relevancia pública"
    },
    {
      "id": "connectors",
      "match": "conectores|orden y temporal",
      "name": "los conectores de orden y temporales",
      "function": "enlazar la secuencia de los hechos de la noticia",
      "error": "se invierte el orden temporal o se enlazan hechos que no guardan esa relación"
    },
    {
      "id": "synonyms",
      "match": "sinonim",
      "name": "los sinónimos",
      "function": "retomar una misma idea sin repeticiones ni cambios de referente",
      "error": "se sustituye una palabra por otra de significado incompatible en ese contexto"
    },
    {
      "id": "punctuation",
      "match": "puntuacion",
      "name": "los signos de puntuación",
      "function": "delimitar enunciados y distinguir relaciones entre los datos informados",
      "error": "la delimitación une datos incompatibles o separa información que debe leerse junta"
    },
    {
      "id": "paratext",
      "match": "paratext",
      "name": "los paratextos",
      "function": "anticipar y orientar la lectura del hecho informado",
      "error": "se atribuye a un paratexto información que no aparece en él"
    },
    {
      "id": "indicative",
      "match": "indicativo|tiempos? verbales|preterito|pluscuamperfecto|verbos en presente",
      "name": "los tiempos del indicativo",
      "function": "situar los hechos y distinguir su orden y duración, incluidos los anteriores a otro hecho pasado",
      "error": "se invierte el orden de los hechos o se confunde una acción terminada con una situación en desarrollo",
      "terms": [
        [
          "presente",
          "el presente del indicativo"
        ],
        [
          "perfecto simple|indefinido",
          "el pretérito perfecto simple"
        ],
        [
          "imperfecto",
          "el pretérito imperfecto"
        ],
        [
          "pluscuamperfecto",
          "el pretérito pluscuamperfecto"
        ]
      ]
    },
    {
      "id": "complex-sentences",
      "match": "oraciones coordinadas|oraciones subordinadas|coordinacion|subordinacion",
      "name": "las relaciones entre oraciones",
      "function": "enlazar información del texto distinguiendo la coordinación de ideas y la dependencia entre proposiciones",
      "error": "se atribuye a una proposición una relación sintáctica que cambia lo afirmado",
      "terms": [
        [
          "coordinad|coordinacion",
          "las oraciones coordinadas"
        ],
        [
          "subordinad|subordinacion",
          "las oraciones subordinadas"
        ]
      ]
    },
    {
      "id": "paragraphs",
      "match": "parrafos?|oracion tematica",
      "name": "la organización de los párrafos y sus oraciones",
      "function": "desarrollar una idea central con oraciones relacionadas y separar cambios de asunto",
      "error": "se agrupan ideas incompatibles o se atribuye al párrafo una idea que no desarrolla"
    },
    {
      "id": "thematic-vocabulary",
      "match": "vocabulario tematico|sustantivos y verbos|verbos y sustantivos",
      "name": "los verbos y sustantivos del vocabulario temático",
      "function": "nombrar los referentes del hecho noticioso y expresar las acciones sin confundir quién hace qué",
      "error": "se atribuye una acción a un referente distinto del que participa en el hecho"
    }
  ],
  "guia-turistica": [
    {
      "id": "nouns",
      "match": "sustantiv",
      "name": "los sustantivos",
      "function": "nombrar e identificar personas, lugares, objetos o ideas",
      "error": "se confunde el referente nombrado o la clase de sustantivo",
      "terms": [
        [
          "propios",
          "los sustantivos propios"
        ],
        [
          "comunes",
          "los sustantivos comunes"
        ],
        [
          "abstractos",
          "los sustantivos abstractos"
        ]
      ]
    },
    {
      "id": "adjectives",
      "match": "adjetiv",
      "name": "los adjetivos",
      "function": "caracterizar los referentes del texto",
      "error": "se atribuye una cualidad o determinación a un referente distinto",
      "terms": [
        [
          "calificativ",
          "los adjetivos calificativos"
        ],
        [
          "determinativ",
          "los adjetivos determinativos"
        ]
      ]
    },
    {
      "id": "signs",
      "match": "interrogaci|exclamaci|interrogativa|exclamativa",
      "name": "los signos y oraciones de interrogación y exclamación",
      "function": "distinguir preguntas y expresiones enfáticas dirigidas al visitante",
      "error": "se interpreta una pregunta como afirmación o se pierde el énfasis indicado"
    },
    {
      "id": "persuasion",
      "match": "(?:vocabulario|lexico).*?(?:persuasiv|atractiv)|atractivo y persuasivo",
      "name": "el vocabulario persuasivo",
      "function": "invitar al visitante mediante cualidades vinculadas con el lugar descrito",
      "error": "la invitación atribuye al lugar una cualidad contraria a la información disponible"
    },
    {
      "id": "appearance",
      "match": "apariencia|estimulos|atractivos y contenido",
      "name": "la apariencia y los estímulos de la guía",
      "function": "orientar la atención del visitante hacia información pertinente del lugar",
      "error": "se toma un adorno sin información como prueba de una característica del lugar"
    },
    {
      "id": "indicative",
      "match": "indicativo|tiempos? verbales|preterito|pluscuamperfecto|verbos en presente",
      "name": "los tiempos del indicativo",
      "function": "situar los hechos y distinguir su orden y duración, incluidos los anteriores a otro hecho pasado",
      "error": "se invierte el orden de los hechos o se confunde una acción terminada con una situación en desarrollo",
      "terms": [
        [
          "presente",
          "el presente del indicativo"
        ],
        [
          "perfecto simple|indefinido",
          "el pretérito perfecto simple"
        ],
        [
          "imperfecto",
          "el pretérito imperfecto"
        ],
        [
          "pluscuamperfecto",
          "el pretérito pluscuamperfecto"
        ]
      ]
    },
    {
      "id": "punctuation",
      "match": "puntuacion|comas?|dos puntos|comillas|signos de (?:interrogacion|exclamacion)",
      "name": "los signos de puntuación",
      "function": "delimitar las ideas, las enumeraciones y las citas para conservar el sentido del texto",
      "error": "la delimitación cambia qué se enumera, qué se cita o cómo se relacionan las ideas",
      "terms": [
        [
          "comas?",
          "las comas"
        ],
        [
          "dos puntos",
          "los dos puntos"
        ],
        [
          "comillas",
          "las comillas"
        ],
        [
          "interrogacion",
          "los signos de interrogación"
        ],
        [
          "exclamacion",
          "los signos de exclamación"
        ]
      ]
    },
    {
      "id": "spatial-connectors",
      "match": "conectores? (?:espaciales|temporales)|conectores? de (?:espacio|tiempo)",
      "name": "los conectores espaciales y temporales",
      "function": "situar los lugares y ordenar los recorridos o las indicaciones de visita",
      "error": "se invierte una ubicación o la secuencia de las indicaciones",
      "terms": [
        [
          "espaciales|espacio",
          "los conectores espaciales"
        ],
        [
          "temporales|tiempo",
          "los conectores temporales"
        ]
      ]
    },
    {
      "id": "topography",
      "match": "topografic",
      "name": "la descripción topográfica",
      "function": "relacionar la ubicación, la distribución y los rasgos de los lugares descritos",
      "error": "se atribuye a un lugar la ubicación o un rasgo de otro"
    },
    {
      "id": "auxiliary-signs",
      "match": "signos auxiliares|parentesis|corchetes|rayas",
      "name": "los signos auxiliares",
      "function": "delimitar aclaraciones o información añadida sin confundirla con el enunciado principal",
      "error": "se deja sin delimitar una aclaración o se cambia qué palabras pertenecen al enunciado principal",
      "terms": [
        [
          "parentesis",
          "los paréntesis"
        ],
        [
          "corchetes",
          "los corchetes"
        ],
        [
          "rayas",
          "las rayas"
        ]
      ]
    },
    {
      "id": "vocabulary",
      "match": "vocabulario adecuado|lexico adecuado",
      "name": "el vocabulario de orientación al visitante",
      "function": "describir y localizar los lugares con palabras comprensibles para el destinatario de la guía",
      "error": "se usa una palabra que atribuye al lugar una característica o ubicación distinta"
    }
  ],
  "articulo-expositivo": [
    {
      "id": "adjectives",
      "match": "adjetiv",
      "name": "los adjetivos",
      "function": "caracterizar los referentes del texto",
      "error": "se atribuye una cualidad o determinación a un referente distinto",
      "terms": [
        [
          "calificativ",
          "los adjetivos calificativos"
        ],
        [
          "determinativ",
          "los adjetivos determinativos"
        ]
      ]
    },
    {
      "id": "indicative",
      "match": "indicativo|tiempos? verbales|preterito|pluscuamperfecto|verbos en presente",
      "name": "los tiempos del indicativo",
      "function": "situar los hechos y distinguir su orden y duración, incluidos los anteriores a otro hecho pasado",
      "error": "se invierte el orden de los hechos o se confunde una acción terminada con una situación en desarrollo",
      "terms": [
        [
          "presente",
          "el presente del indicativo"
        ],
        [
          "perfecto simple|indefinido",
          "el pretérito perfecto simple"
        ],
        [
          "imperfecto",
          "el pretérito imperfecto"
        ],
        [
          "pluscuamperfecto",
          "el pretérito pluscuamperfecto"
        ]
      ]
    },
    {
      "id": "paragraphs",
      "match": "parrafos?|oracion tematica",
      "name": "la organización de los párrafos y sus oraciones",
      "function": "desarrollar una idea central con oraciones relacionadas y separar cambios de asunto",
      "error": "se agrupan ideas incompatibles o se atribuye al párrafo una idea que no desarrolla"
    },
    {
      "id": "questions",
      "match": "oraciones interrogativas|preguntas",
      "name": "las oraciones interrogativas",
      "function": "plantear preguntas vinculadas con el problema que el artículo explica",
      "error": "se atribuye a una pregunta una respuesta ajena al problema planteado"
    },
    {
      "id": "agreement",
      "match": "concordancia",
      "name": "la concordancia entre las palabras",
      "function": "mantener las relaciones de género, número y persona entre las palabras vinculadas",
      "error": "el género, número o persona de una palabra no corresponde al término con el que debe concordar"
    },
    {
      "id": "demonstratives",
      "match": "pronombres demostrativos",
      "name": "los pronombres demostrativos",
      "function": "retomar referentes identificables y mantener la continuidad de la explicación",
      "error": "se atribuye al demostrativo un referente distinto del que retoma en el pasaje"
    },
    {
      "id": "connectors",
      "match": "conectores.*(?:causa|efecto|finalidad|contraste)|conectores causales",
      "name": "los conectores de relación lógica",
      "function": "enlazar causas, consecuencias, propósitos o contrastes manteniendo las relaciones de la explicación",
      "error": "se invierte la relación entre causa y efecto o se presenta un contraste como coincidencia",
      "terms": [
        [
          "causa",
          "los conectores de causa"
        ],
        [
          "efecto",
          "los conectores de efecto"
        ],
        [
          "finalidad",
          "los conectores de finalidad"
        ],
        [
          "contraste",
          "los conectores de contraste"
        ]
      ]
    },
    {
      "id": "comparatives",
      "match": "construcciones comparativas",
      "name": "las construcciones comparativas",
      "function": "establecer relaciones de semejanza o diferencia que aclaran el problema explicado",
      "error": "se comparan propiedades incompatibles o se atribuye a un referente la propiedad del otro"
    }
  ],
  "informe-de-lectura": [
    {
      "id": "summary",
      "match": "estrategias.*resumen|pasos.*resumen|resumir|parafras",
      "name": "las estrategias de resumen y paráfrasis",
      "function": "conservar las ideas principales sin copiar ni agregar información ajena al texto",
      "error": "se cambia una idea principal o se incorpora información que el texto no ofrece"
    },
    {
      "id": "indicative",
      "match": "indicativo|tiempos? verbales|preterito|pluscuamperfecto|verbos en presente",
      "name": "los tiempos del indicativo",
      "function": "situar los hechos y distinguir su orden y duración, incluidos los anteriores a otro hecho pasado",
      "error": "se invierte el orden de los hechos o se confunde una acción terminada con una situación en desarrollo",
      "terms": [
        [
          "presente",
          "el presente del indicativo"
        ],
        [
          "perfecto simple|indefinido",
          "el pretérito perfecto simple"
        ],
        [
          "imperfecto",
          "el pretérito imperfecto"
        ],
        [
          "pluscuamperfecto",
          "el pretérito pluscuamperfecto"
        ]
      ]
    },
    {
      "id": "punctuation",
      "match": "puntuacion|comas?|dos puntos|comillas|signos de (?:interrogacion|exclamacion)",
      "name": "los signos de puntuación",
      "function": "delimitar las ideas, las enumeraciones y las citas para conservar el sentido del texto",
      "error": "la delimitación cambia qué se enumera, qué se cita o cómo se relacionan las ideas",
      "terms": [
        [
          "comas?",
          "las comas"
        ],
        [
          "dos puntos",
          "los dos puntos"
        ],
        [
          "comillas",
          "las comillas"
        ],
        [
          "interrogacion",
          "los signos de interrogación"
        ],
        [
          "exclamacion",
          "los signos de exclamación"
        ]
      ]
    }
  ],
  "cuento-amor-amistad": [
    {
      "id": "adjectives",
      "match": "adjetiv",
      "name": "los adjetivos",
      "function": "caracterizar los referentes del texto",
      "error": "se atribuye una cualidad o determinación a un referente distinto",
      "terms": [
        [
          "calificativ",
          "los adjetivos calificativos"
        ],
        [
          "determinativ",
          "los adjetivos determinativos"
        ]
      ]
    },
    {
      "id": "actants",
      "match": "actantes",
      "name": "los actantes",
      "function": "relacionar las funciones de los personajes con la búsqueda, la ayuda y los obstáculos del conflicto",
      "error": "se confunde la función de un personaje con su nombre o con una función contraria a sus acciones"
    },
    {
      "id": "adverbs",
      "match": "adverbios",
      "name": "los adverbios de tiempo y espacio",
      "function": "localizar las acciones del relato en el tiempo y el espacio",
      "error": "se sitúa una acción en un momento o lugar distinto del señalado"
    },
    {
      "id": "connectors",
      "match": "conectores|coordinantes|consecuencia",
      "name": "los conectores coordinantes y de consecuencia",
      "function": "relacionar acciones y distinguir la coordinación de la consecuencia",
      "error": "se invierte una consecuencia o se presenta como causal una coordinación"
    },
    {
      "id": "indicative",
      "match": "indicativo|tiempos? verbales|preterito|pluscuamperfecto|verbos en presente",
      "name": "los tiempos del indicativo",
      "function": "situar los hechos y distinguir su orden y duración, incluidos los anteriores a otro hecho pasado",
      "error": "se invierte el orden de los hechos o se confunde una acción terminada con una situación en desarrollo",
      "terms": [
        [
          "presente",
          "el presente del indicativo"
        ],
        [
          "perfecto simple|indefinido",
          "el pretérito perfecto simple"
        ],
        [
          "imperfecto",
          "el pretérito imperfecto"
        ],
        [
          "pluscuamperfecto",
          "el pretérito pluscuamperfecto"
        ]
      ]
    },
    {
      "id": "literary",
      "match": "figuras? literarias?|recursos (?:literarios|expresivos)|metafora|comparacion|epiteto|paradoja|antitesis|ironia",
      "name": "los recursos literarios presentes",
      "function": "expresar sentidos figurados y relacionar imágenes o contrastes con el sentido del pasaje",
      "error": "se interpreta como literal una expresión figurada o se le atribuye un efecto contrario al pasaje",
      "terms": [
        [
          "metafora",
          "la metáfora"
        ],
        [
          "comparacion",
          "la comparación literaria"
        ],
        [
          "epiteto",
          "el epíteto"
        ],
        [
          "paradoja",
          "la paradoja"
        ],
        [
          "antitesis",
          "la antítesis"
        ],
        [
          "ironia",
          "la ironía"
        ]
      ]
    },
    {
      "id": "subjunctive",
      "match": "subjuntivo",
      "name": "el modo subjuntivo",
      "function": "expresar deseos, posibilidades o situaciones no afirmadas como hechos",
      "error": "se presenta como hecho una posibilidad o se cambia la relación temporal expresada",
      "terms": [
        [
          "presente",
          "el presente del subjuntivo"
        ],
        [
          "imperfecto",
          "el pretérito imperfecto del subjuntivo"
        ]
      ]
    },
    {
      "id": "dialogue",
      "match": "dialogo|estilo directo|estilo indirecto",
      "name": "el diálogo del relato",
      "function": "distinguir las voces de los personajes y relacionar sus palabras con las acciones",
      "error": "se atribuyen a un personaje palabras de otro o se confunde la voz del narrador",
      "terms": [
        [
          "\\bdirecto\\b",
          "el diálogo de estilo directo"
        ],
        [
          "\\bindirecto\\b",
          "el diálogo de estilo indirecto"
        ]
      ]
    },
    {
      "id": "pronouns",
      "match": "pronombres",
      "name": "los pronombres del relato",
      "function": "retomar personajes o elementos con referentes identificables y mantener la continuidad narrativa",
      "error": "el pronombre cambia el referente y atribuye la acción a otro personaje"
    },
    {
      "id": "authorship",
      "match": "autoria|autores|autor del cuento|informacion bibliografica|emilia pardo|oscar wilde|rafael altamira|horacio quiroga|borja rodriguez|juan ruiz|arcipreste",
      "name": "la autoría y las referencias del cuento",
      "function": "relacionar la obra leída con su autoría mediante información bibliográfica disponible",
      "error": "se atribuye la obra a un autor distinto del documentado o se confunde obra y autor"
    }
  ],
  "decima-espinela": [
    {
      "id": "literary",
      "match": "figuras? literarias?|recursos (?:literarios|expresivos)|metafora|comparacion|epiteto|paradoja|antitesis|ironia",
      "name": "los recursos literarios presentes",
      "function": "expresar sentidos figurados y relacionar imágenes o contrastes con el sentido del pasaje",
      "error": "se interpreta como literal una expresión figurada o se le atribuye un efecto contrario al pasaje",
      "terms": [
        [
          "metafora",
          "la metáfora"
        ],
        [
          "comparacion",
          "la comparación literaria"
        ],
        [
          "epiteto",
          "el epíteto"
        ],
        [
          "paradoja",
          "la paradoja"
        ],
        [
          "antitesis",
          "la antítesis"
        ],
        [
          "ironia",
          "la ironía"
        ]
      ]
    },
    {
      "id": "interjections",
      "match": "interjecciones|exclamaciones",
      "name": "las interjecciones y exclamaciones",
      "function": "hacer reconocible la emoción o énfasis que expresan los versos",
      "error": "se atribuye a la exclamación una emoción incompatible con el verso",
      "terms": [
        [
          "interjecciones",
          "las interjecciones"
        ],
        [
          "exclamaciones",
          "las exclamaciones"
        ]
      ]
    }
  ]
},
 secondGradeLanguagePolicy:'ACTION_PRODUCT_PROCEDURES_AND_EXPLICIT_FEATURES_V1',
}
