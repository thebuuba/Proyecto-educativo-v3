import {evaluationCatalogV26} from './catalog-v26'
/** Frozen local release; never changes existing snapshots. */
export const evaluationCatalogV27={...evaluationCatalogV26,version:'evaluation-2026.27',thirdGradeLanguageFeatures:{
  "entrevista": [
    {
      "id": "register",
      "match": "registro|formal e informal",
      "name": "el registro de la comunicación",
      "function": "ajustar el tratamiento y las expresiones al interlocutor y a la situación",
      "error": "se mezclan tratamientos incompatibles o expresiones ajenas a la relación comunicativa",
      "terms": [
        [
          "\\bformal\\b",
          "el registro formal"
        ],
        [
          "\\binformal\\b",
          "el registro informal"
        ]
      ]
    },
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "nonverbal",
      "match": "gestos|gestual|tono de voz|postura|recursos no verbales",
      "name": "los gestos y recursos expresivos solicitados",
      "function": "apoyar el sentido de las intervenciones o versos mediante recursos expresivos o apoyos de acceso acordados",
      "error": "el gesto o recurso expresa una relación o emoción contraria al contenido comunicado"
    },
    {
      "id": "types",
      "match": "tipos de entrevista|objetivo y la modalidad",
      "name": "los tipos de entrevista según objetivo y modalidad",
      "function": "clasificar la entrevista a partir de su finalidad y de cómo participan sus interlocutores",
      "error": "se asigna una modalidad o finalidad incompatible con las intervenciones disponibles"
    },
    {
      "id": "interrogatives",
      "match": "oraciones interrogativas",
      "name": "las oraciones interrogativas",
      "function": "solicitar información pertinente al tema y distinguir preguntas abiertas de respuestas anticipadas",
      "error": "la pregunta supone una respuesta que el entrevistado no ha dado"
    },
    {
      "id": "pronouns",
      "match": "pronombres.*(?:interrogativos|exclamativos)",
      "name": "los pronombres interrogativos y exclamativos",
      "function": "reconocer qué información se solicita o qué referente recibe el énfasis expresivo",
      "error": "se confunde el referente interrogado con la respuesta o con una exclamación"
    },
    {
      "id": "abstract-nouns",
      "match": "sustantivos abstractos",
      "name": "los sustantivos abstractos",
      "function": "nombrar ideas, cualidades o experiencias al interpretar las opiniones del entrevistado",
      "error": "se trata una idea o cualidad como un objeto concreto y cambia el sentido de la respuesta"
    },
    {
      "id": "first-person",
      "match": "primera persona|tono confesional",
      "name": "las formas verbales en primera persona y el tono confesional",
      "function": "atribuir experiencias y opiniones a quien habla sin presentarlas como hechos de otra persona",
      "error": "se atribuye al entrevistador una experiencia expresada por el entrevistado"
    }
  ],
  "cronica": [
    {
      "id": "temporal",
      "match": "conectores.*(?:temporal|secuenciacion|causalidad)|conectores temporales",
      "name": "los conectores de secuencia y causalidad",
      "function": "distinguir el orden de las acciones de las relaciones entre causas y efectos",
      "error": "se interpreta como causa una sucesión temporal o se invierte el orden de las acciones",
      "terms": [
        [
          "temporal|secuenciacion",
          "los conectores de secuencia temporal"
        ],
        [
          "causalidad",
          "los conectores de causalidad"
        ]
      ]
    },
    {
      "id": "manner",
      "match": "adverbios? de modo",
      "name": "los adverbios de modo",
      "function": "precisar cómo se realizan las acciones comunicadas",
      "error": "se atribuye al adverbio una circunstancia distinta de la que modifica"
    },
    {
      "id": "paratext",
      "match": "paratext|volanta|copete|epigrafe",
      "name": "los elementos paratextuales disponibles",
      "function": "orientar la lectura y relacionar el título, los apoyos y las referencias con el contenido",
      "error": "se atribuye al paratexto una información que contradice el texto",
      "terms": [
        [
          "volanta",
          "la volanta"
        ],
        [
          "copete",
          "el copete"
        ],
        [
          "epigrafe",
          "el epígrafe"
        ]
      ]
    },
    {
      "id": "register",
      "match": "registro|formal e informal",
      "name": "el registro de la comunicación",
      "function": "ajustar el tratamiento y las expresiones al interlocutor y a la situación",
      "error": "se mezclan tratamientos incompatibles o expresiones ajenas a la relación comunicativa",
      "terms": [
        [
          "\\bformal\\b",
          "el registro formal"
        ],
        [
          "\\binformal\\b",
          "el registro informal"
        ]
      ]
    },
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
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
      "id": "prepositions",
      "match": "preposiciones|locuciones preposicionales",
      "name": "las preposiciones y locuciones preposicionales",
      "function": "enlazar participantes, lugares y circunstancias con los hechos relatados",
      "error": "se interpreta una relación de lugar, origen o compañía como otra circunstancia"
    },
    {
      "id": "circumstances",
      "match": "modificadores circunstanciales",
      "name": "los modificadores circunstanciales",
      "function": "precisar las circunstancias de los hechos sin confundirlas con sus participantes",
      "error": "se atribuye una circunstancia a una acción distinta de la que modifica"
    },
    {
      "id": "pronouns",
      "match": "pronombres",
      "name": "los pronombres personales, demostrativos e indefinidos",
      "function": "retomar participantes y referencias de los hechos manteniendo identificable a quién o qué aluden",
      "error": "se cambia el referente y se atribuye el hecho a otro participante"
    },
    {
      "id": "sentences",
      "match": "oraciones.*(?:coordinadas|yuxtapuestas|subordinadas)",
      "name": "las oraciones coordinadas, yuxtapuestas y subordinadas",
      "function": "relacionar hechos distinguiendo coordinación, dependencia y enlace mediante puntuación",
      "error": "se interpreta una proposición dependiente como hecho independiente o se cambia su relación"
    }
  ],
  "catalogo": [
    {
      "id": "compound",
      "match": "palabras compuestas",
      "name": "las palabras compuestas",
      "function": "reconocer cómo sus componentes forman una unidad de significado en el pasaje",
      "error": "se interpreta cada componente por separado y se cambia el significado de la palabra"
    },
    {
      "id": "paratext",
      "match": "paratext|volanta|copete|epigrafe",
      "name": "los elementos paratextuales disponibles",
      "function": "orientar la lectura y relacionar el título, los apoyos y las referencias con el contenido",
      "error": "se atribuye al paratexto una información que contradice el texto",
      "terms": [
        [
          "volanta",
          "la volanta"
        ],
        [
          "copete",
          "el copete"
        ],
        [
          "epigrafe",
          "el epígrafe"
        ]
      ]
    },
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "graphics",
      "match": "informacion grafica|grafic[oa]s?|tablas?|diagramas?|dibujos?|fotografias?|imagenes|ilustr|mapas?(?! conceptual)",
      "name": "los recursos gráficos solicitados",
      "function": "relacionar lo representado con la información del texto y mantener sus datos o referencias",
      "error": "el recurso representa datos o referentes incompatibles con el pasaje",
      "terms": [
        [
          "grafic[oa]s?",
          "los gráficos"
        ],
        [
          "tablas?",
          "las tablas"
        ],
        [
          "diagramas?",
          "los diagramas"
        ],
        [
          "dibujos?",
          "los dibujos"
        ],
        [
          "fotografias?",
          "las fotografías"
        ],
        [
          "imagenes|ilustr",
          "las imágenes"
        ],
        [
          "mapas?(?! conceptual)",
          "los mapas"
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
      "id": "hyponyms",
      "match": "hiponimos|hiperonimos",
      "name": "los hipónimos e hiperónimos",
      "function": "relacionar especies y categorías distinguiendo términos específicos de categorías amplias",
      "error": "se invierte la inclusión entre una especie y la categoría que la contiene"
    },
    {
      "id": "latin",
      "match": "latin|nombre cientifico",
      "name": "los nombres científicos en latín",
      "function": "identificar una especie con su denominación científica y relacionarla con el nombre común",
      "error": "se atribuye a una especie la denominación de otra"
    },
    {
      "id": "gerund",
      "match": "gerundio",
      "name": "el gerundio",
      "function": "expresar acciones en desarrollo relacionadas con las características descritas",
      "error": "el gerundio atribuye una acción a un referente distinto o altera su relación temporal"
    },
    {
      "id": "enumeration",
      "match": "numeros y vinetas|vinetas|numeracion",
      "name": "los números y las viñetas",
      "function": "separar y localizar entradas o características sin mezclar información de distintas especies",
      "error": "una viñeta o número agrupa datos de especies diferentes como una misma entrada"
    }
  ],
  "informe-experimento": [
    {
      "id": "compound",
      "match": "palabras compuestas",
      "name": "las palabras compuestas",
      "function": "reconocer cómo sus componentes forman una unidad de significado en el pasaje",
      "error": "se interpreta cada componente por separado y se cambia el significado de la palabra"
    },
    {
      "id": "temporal",
      "match": "conectores.*(?:temporal|secuenciacion|causalidad)|conectores temporales",
      "name": "los conectores de secuencia y causalidad",
      "function": "distinguir el orden de las acciones de las relaciones entre causas y efectos",
      "error": "se interpreta como causa una sucesión temporal o se invierte el orden de las acciones",
      "terms": [
        [
          "temporal|secuenciacion",
          "los conectores de secuencia temporal"
        ],
        [
          "causalidad",
          "los conectores de causalidad"
        ]
      ]
    },
    {
      "id": "manner",
      "match": "adverbios? de modo",
      "name": "los adverbios de modo",
      "function": "precisar cómo se realizan las acciones comunicadas",
      "error": "se atribuye al adverbio una circunstancia distinta de la que modifica"
    },
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "graphics",
      "match": "informacion grafica|grafic[oa]s?|tablas?|diagramas?|dibujos?|fotografias?|imagenes|ilustr|mapas?(?! conceptual)",
      "name": "los recursos gráficos solicitados",
      "function": "relacionar lo representado con la información del texto y mantener sus datos o referencias",
      "error": "el recurso representa datos o referentes incompatibles con el pasaje",
      "terms": [
        [
          "grafic[oa]s?",
          "los gráficos"
        ],
        [
          "tablas?",
          "las tablas"
        ],
        [
          "diagramas?",
          "los diagramas"
        ],
        [
          "dibujos?",
          "los dibujos"
        ],
        [
          "fotografias?",
          "las fotografías"
        ],
        [
          "imagenes|ilustr",
          "las imágenes"
        ],
        [
          "mapas?(?! conceptual)",
          "los mapas"
        ]
      ]
    },
    {
      "id": "impersonal",
      "match": "verbos impersonales|formas impersonales",
      "name": "las formas verbales impersonales",
      "function": "comunicar procedimientos y observaciones sin atribuirlos a un sujeto inexistente",
      "error": "se introduce un agente o referente que cambia la acción comunicada"
    },
    {
      "id": "periphrases",
      "match": "perifrasis verbales",
      "name": "las perífrasis verbales",
      "function": "precisar obligación, posibilidad o fase de realización de las acciones descritas",
      "error": "se interpreta como realizado un procedimiento que solo se propone o considera posible"
    },
    {
      "id": "incidental",
      "match": "frases incidentales",
      "name": "las frases incidentales",
      "function": "añadir aclaraciones delimitadas sin confundirlas con las acciones principales",
      "error": "se incorpora una aclaración como acción principal y cambia la secuencia del procedimiento"
    }
  ],
  "articulo-opinion": [
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "register",
      "match": "registro|formal e informal",
      "name": "el registro de la comunicación",
      "function": "ajustar el tratamiento y las expresiones al interlocutor y a la situación",
      "error": "se mezclan tratamientos incompatibles o expresiones ajenas a la relación comunicativa",
      "terms": [
        [
          "\\bformal\\b",
          "el registro formal"
        ],
        [
          "\\binformal\\b",
          "el registro informal"
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
      "id": "argument-types",
      "match": "ejemplificacion|analogia|argumentos de autoridad|citas textuales",
      "name": "los argumentos solicitados",
      "function": "sostener una tesis mediante casos, relaciones comparables o fuentes que realmente respalden lo afirmado",
      "error": "se usa un caso que contradice la tesis o una analogía entre relaciones no comparables",
      "terms": [
        [
          "ejemplificacion|ejemplos",
          "los argumentos de ejemplificación"
        ],
        [
          "analogia",
          "los argumentos de analogía"
        ],
        [
          "autoridad|citas textuales",
          "los argumentos de autoridad y sus citas"
        ]
      ]
    },
    {
      "id": "modalizers",
      "match": "modalizadores",
      "name": "los modalizadores",
      "function": "distinguir el grado de certeza y la valoración de quien sostiene una postura",
      "error": "se presenta como certeza una posibilidad o se atribuye una valoración al autor equivocado"
    },
    {
      "id": "argument-connectors",
      "match": "conectores.*(?:ejemplificacion|comparacion)",
      "name": "los conectores argumentativos",
      "function": "introducir ejemplos y comparaciones relacionados con las razones que sostienen la tesis",
      "error": "el conector presenta como ejemplo un caso ajeno a la razón que se defiende"
    },
    {
      "id": "rhetorical",
      "match": "pregunta retorica",
      "name": "la pregunta retórica",
      "function": "reforzar una postura mediante una interrogación cuya intención se interpreta en el argumento",
      "error": "se interpreta la pregunta como solicitud literal de un dato y se pierde su intención argumentativa"
    },
    {
      "id": "nominalization",
      "match": "nominalizacion",
      "name": "la nominalización",
      "function": "retomar procesos o ideas mediante nombres que mantienen la continuidad del argumento",
      "error": "el nombre cambia el proceso o la idea que se pretendía retomar"
    }
  ],
  "cuento-social": [
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "literary",
      "match": "figuras literarias|recursos linguisticos y literarios|recursos literarios|imagenes poeticas|epiteto|personificacion|hiperbole|hiperbaton|sinestesia",
      "name": "las figuras literarias",
      "function": "vincular las imágenes y los desplazamientos de sentido con los sentimientos o acciones expresados",
      "error": "se interpreta literalmente una expresión figurada o se le atribuye un efecto contrario al pasaje",
      "terms": [
        [
          "epiteto",
          "el epíteto"
        ],
        [
          "personificacion",
          "la personificación"
        ],
        [
          "hiperbole",
          "la hipérbole"
        ],
        [
          "hiperbaton",
          "el hipérbaton"
        ],
        [
          "sinestesia",
          "la sinestesia"
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
      "id": "actants",
      "match": "actantes",
      "name": "los actantes",
      "function": "relacionar las funciones de los personajes con la búsqueda, la ayuda y los obstáculos del conflicto",
      "error": "se confunde la función de un personaje con su nombre o con una función contraria a sus acciones"
    },
    {
      "id": "connectors",
      "match": "conectores|coordinantes|consecuencia",
      "name": "los conectores del relato",
      "function": "enlazar acciones distinguiendo la coordinación de ideas y la dependencia entre proposiciones",
      "error": "se cambia la relación entre acciones al presentar una proposición dependiente como independiente",
      "terms": [
        [
          "coordinantes",
          "los conectores coordinantes"
        ],
        [
          "subordinantes",
          "los conectores subordinantes"
        ]
      ]
    },
    {
      "id": "character-roles",
      "match": "personajes principales|personajes secundarios|clasific.*personajes|protagonista|antagonista|incidentales|ambientales|fugaces",
      "name": "los roles de los personajes",
      "function": "distinguir la participación de los personajes en el conflicto mediante sus acciones disponibles",
      "error": "se atribuye a un personaje un papel incompatible con su participación en el relato",
      "terms": [
        [
          "principales",
          "los personajes principales"
        ],
        [
          "secundarios",
          "los personajes secundarios"
        ],
        [
          "\\bprotagonista\\b",
          "el protagonista"
        ],
        [
          "\\bantagonista\\b",
          "el antagonista"
        ],
        [
          "ambientales",
          "los personajes ambientales"
        ],
        [
          "incidentales|fugaces",
          "los personajes incidentales o fugaces"
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
      "id": "setting",
      "match": "ambiente (?:fisico|psicologico|sicologico)",
      "name": "el ambiente del relato",
      "function": "relacionar las condiciones del entorno y las emociones disponibles con las acciones de los personajes",
      "error": "se atribuye al ambiente una condición o emoción que contradice los hechos del pasaje",
      "terms": [
        [
          "fisico",
          "el ambiente físico"
        ],
        [
          "psicologico|sicologico",
          "el ambiente psicológico"
        ]
      ]
    },
    {
      "id": "indicative",
      "match": "indicativo|preterito|tiempos verbales",
      "name": "los tiempos verbales del relato",
      "function": "distinguir acciones terminadas, situaciones en desarrollo y relaciones de anterioridad en la narración",
      "error": "se cambia la duración o el orden de los hechos al confundir los tiempos verbales",
      "terms": [
        [
          "indefinido",
          "el pretérito indefinido"
        ],
        [
          "imperfecto",
          "el pretérito imperfecto"
        ],
        [
          "compuesto",
          "el pretérito compuesto"
        ]
      ]
    },
    {
      "id": "adverbs",
      "match": "adverbios?|adverbio",
      "name": "los adverbios de tiempo y espacio",
      "function": "situar las acciones narrativas y mantener comprensibles sus relaciones temporales y espaciales",
      "error": "se atribuye a la acción un lugar o tiempo incompatible con el pasaje"
    },
    {
      "id": "variants",
      "match": "variantes linguisticas",
      "name": "las variantes lingüísticas",
      "function": "relacionar las formas de hablar con los personajes y su contexto sin descalificar la variedad usada",
      "error": "se atribuye una forma de hablar a otro personaje o se confunde una variante con un fallo de contenido"
    },
    {
      "id": "types",
      "match": "tipos de cuento|atendiendo a tipos(?! de narrador)",
      "name": "los tipos de cuento social, político y cultural",
      "function": "relacionar la clasificación del relato con el conflicto y la realidad representada",
      "error": "se clasifica el cuento a partir de un dato aislado incompatible con su conflicto"
    }
  ],
  "madrigal": [
    {
      "id": "vocabulary",
      "match": "vocabulario|lexico",
      "name": "el vocabulario temático",
      "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
      "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
    },
    {
      "id": "literary",
      "match": "figuras literarias|recursos linguisticos y literarios|recursos literarios|imagenes poeticas|epiteto|personificacion|hiperbole|hiperbaton|sinestesia",
      "name": "las figuras literarias",
      "function": "vincular las imágenes y los desplazamientos de sentido con los sentimientos o acciones expresados",
      "error": "se interpreta literalmente una expresión figurada o se le atribuye un efecto contrario al pasaje",
      "terms": [
        [
          "epiteto",
          "el epíteto"
        ],
        [
          "personificacion",
          "la personificación"
        ],
        [
          "hiperbole",
          "la hipérbole"
        ],
        [
          "hiperbaton",
          "el hipérbaton"
        ],
        [
          "sinestesia",
          "la sinestesia"
        ]
      ]
    },
    {
      "id": "nonverbal",
      "match": "gestos|gestual|tono de voz|postura|recursos no verbales",
      "name": "los gestos y recursos expresivos solicitados",
      "function": "apoyar el sentido de las intervenciones o versos mediante recursos expresivos o apoyos de acceso acordados",
      "error": "el gesto o recurso expresa una relación o emoción contraria al contenido comunicado"
    }
  ]
},thirdGradeLanguagePolicy:'TOPIC_ACTION_EXPLICIT_REQUIREMENTS_GESTURES_V2'}
