import {evaluationCatalogV28} from './catalog-v28'
/** Frozen verified fourth-grade release. */
export const evaluationCatalogV29={...evaluationCatalogV28,...{
  "version": "evaluation-2026.29",
  "fourthGradeLanguageFeatures": {
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
        "id": "types",
        "match": "tipos de cronica|caracteristicas",
        "name": "los tipos y características de la crónica",
        "function": "relacionar el acontecimiento narrado, su tratamiento y la perspectiva del cronista con la clase de crónica",
        "error": "se clasifica la crónica por un dato aislado que contradice su tratamiento del acontecimiento"
      },
      {
        "id": "passive",
        "match": "voz pasiva",
        "name": "los verbos en voz pasiva",
        "function": "distinguir quién recibe la acción de quién la realiza, incluso cuando el agente queda implícito",
        "error": "se intercambia el agente y quien recibe la acción"
      }
    ],
    "instructivo": [
      {
        "id": "impersonal",
        "match": "impersonal",
        "name": "las formas impersonales del verbo",
        "function": "comunicar acciones sin atribuirlas a un sujeto inexistente",
        "error": "se añade un agente que cambia la acción comunicada"
      },
      {
        "id": "infinitive",
        "match": "infinitivo",
        "name": "los verbos en infinitivo",
        "function": "nombrar acciones y propósitos sin confundirlos con hechos ya realizados",
        "error": "se interpreta un propósito como un resultado ya obtenido"
      },
      {
        "id": "adverbs",
        "match": "adverbios?|construcciones adverbiales",
        "name": "los adverbios y construcciones adverbiales",
        "function": "precisar modo, frecuencia o cantidad de las acciones sin cambiar sus relaciones",
        "error": "se atribuye a una acción una circunstancia de otra",
        "terms": [
          [
            "frecuencia",
            "los adverbios de frecuencia"
          ],
          [
            "modo",
            "los adverbios de modo"
          ],
          [
            "cantidad",
            "los adverbios de cantidad"
          ]
        ]
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
            "imagenes",
            "las imágenes"
          ],
          [
            "ilustraciones|ilustracion",
            "las ilustraciones"
          ],
          [
            "mapas?(?! conceptual)",
            "los mapas"
          ]
        ]
      },
      {
        "id": "nonverbal",
        "match": "paralinguistic|gestos|gestual|corporal|tono de voz|entonacion|postura|recursos no verbales",
        "name": "los recursos expresivos solicitados",
        "function": "relacionar la expresión o los apoyos de acceso acordados con el sentido del contenido comunicado",
        "error": "el recurso expresa una emoción o relación contraria al contenido",
        "terms": [
          [
            "gestos|gestual",
            "los gestos"
          ],
          [
            "entonacion|tono de voz",
            "la entonación"
          ],
          [
            "corporal|postura",
            "la expresión corporal"
          ]
        ]
      },
      {
        "id": "vocabulary",
        "match": "lexico|vocabulario",
        "name": "el léxico técnico del instructivo",
        "function": "nombrar acciones y elementos del procedimiento de forma comprensible para quien lo utiliza",
        "error": "un término indica una acción distinta de la requerida"
      },
      {
        "id": "connectors",
        "match": "conectores",
        "name": "los conectores de orden y finalidad",
        "function": "enlazar los pasos y distinguir su secuencia del propósito de cada acción",
        "error": "se confunde la finalidad con un paso o se invierte la secuencia",
        "terms": [
          [
            "\\borden\\b",
            "los conectores de orden"
          ],
          [
            "\\bfinalidad\\b",
            "los conectores de finalidad"
          ]
        ]
      },
      {
        "id": "enumeration",
        "match": "numeros|vinetas|numeracion",
        "name": "los números y las viñetas",
        "function": "separar instrucciones y hacer reconocible su orden sin mezclar acciones de pasos distintos",
        "error": "una marca une acciones incompatibles o altera el paso al que pertenece una indicación"
      }
    ],
    "informe-investigacion": [
      {
        "id": "impersonal",
        "match": "impersonal",
        "name": "las formas impersonales del verbo",
        "function": "comunicar acciones sin atribuirlas a un sujeto inexistente",
        "error": "se añade un agente que cambia la acción comunicada"
      },
      {
        "id": "infinitive",
        "match": "infinitivo",
        "name": "los verbos en infinitivo",
        "function": "nombrar acciones y propósitos sin confundirlos con hechos ya realizados",
        "error": "se interpreta un propósito como un resultado ya obtenido"
      },
      {
        "id": "vocabulary",
        "match": "vocabulario|lexico",
        "name": "el vocabulario temático",
        "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
        "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
      },
      {
        "id": "adverbs",
        "match": "adverbios?|construcciones adverbiales",
        "name": "los adverbios y construcciones adverbiales",
        "function": "precisar modo, frecuencia o cantidad de las acciones sin cambiar sus relaciones",
        "error": "se atribuye a una acción una circunstancia de otra",
        "terms": [
          [
            "frecuencia",
            "los adverbios de frecuencia"
          ],
          [
            "modo",
            "los adverbios de modo"
          ],
          [
            "cantidad",
            "los adverbios de cantidad"
          ]
        ]
      },
      {
        "id": "citations",
        "match": "citacion|citas? (?:textuales|directas|indirectas)|comillas|parentesis|puntos suspensivos",
        "name": "los mecanismos de citación",
        "function": "distinguir palabras o ideas de la fuente de la voz propia y conservar su sentido al citarlas",
        "error": "se atribuye a la fuente una afirmación que no hizo o se presenta una cita como idea propia",
        "terms": [
          [
            "directas",
            "las citas directas"
          ],
          [
            "indirectas",
            "las citas indirectas"
          ]
        ]
      },
      {
        "id": "sources",
        "match": "referencias bibliograficas|fuentes bibliograficas",
        "name": "las referencias bibliográficas",
        "function": "identificar el origen de los datos e ideas y permitir contrastarlos con la fuente utilizada",
        "error": "la referencia corresponde a una obra distinta o no respalda la información atribuida"
      },
      {
        "id": "connectors",
        "match": "conectores",
        "name": "los conectores de relación lógica",
        "function": "distinguir adición, contraste, explicación y finalidad entre las ideas que enlazan",
        "error": "el enlace invierte una causa, presenta una oposición como coincidencia o atribuye una conclusión ajena",
        "terms": [
          [
            "contraste",
            "los conectores de contraste"
          ],
          [
            "adicion",
            "los conectores de adición"
          ],
          [
            "cierre",
            "los conectores de cierre"
          ],
          [
            "ejemplificacion",
            "los conectores de ejemplificación"
          ],
          [
            "finalidad",
            "los conectores de finalidad"
          ],
          [
            "recapitulacion",
            "los conectores de recapitulación"
          ],
          [
            "apertura",
            "los conectores de apertura"
          ],
          [
            "causa",
            "los conectores de causa y efecto"
          ]
        ]
      },
      {
        "id": "argument-types",
        "match": "composicion de argumentos|analogia|ejemplificacion|deduccion|de autoridad",
        "name": "los procedimientos de argumentación",
        "function": "relacionar razones y evidencias con la afirmación sustentada, distinguiendo lo que puede inferirse de los datos",
        "error": "se afirma una conclusión que no se desprende de las premisas o se atribuye autoridad a una fuente ajena",
        "terms": [
          [
            "analogia",
            "la analogía"
          ],
          [
            "ejemplificacion",
            "la ejemplificación"
          ],
          [
            "deduccion",
            "la deducción"
          ],
          [
            "autoridad",
            "los argumentos de autoridad"
          ]
        ]
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
            "imagenes",
            "las imágenes"
          ],
          [
            "ilustraciones|ilustracion",
            "las ilustraciones"
          ],
          [
            "mapas?(?! conceptual)",
            "los mapas"
          ]
        ]
      },
      {
        "id": "sentences",
        "match": "oraciones compuestas",
        "name": "las oraciones compuestas",
        "function": "enlazar proposiciones del informe manteniendo qué se afirma y cómo se relacionan los datos",
        "error": "se interpreta una proposición dependiente como conclusión independiente"
      },
      {
        "id": "organizers",
        "match": "esquemas de contenido|organizadores graficos",
        "name": "los esquemas y organizadores del contenido",
        "function": "representar las relaciones entre problema, método y resultados comunicados por el informe",
        "error": "un enlace atribuye un resultado a un procedimiento distinto"
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
        "id": "connectors",
        "match": "conectores",
        "name": "los conectores de relación lógica",
        "function": "distinguir adición, contraste, explicación y finalidad entre las ideas que enlazan",
        "error": "el enlace invierte una causa, presenta una oposición como coincidencia o atribuye una conclusión ajena",
        "terms": [
          [
            "contraste",
            "los conectores de contraste"
          ],
          [
            "adicion",
            "los conectores de adición"
          ],
          [
            "cierre",
            "los conectores de cierre"
          ],
          [
            "ejemplificacion",
            "los conectores de ejemplificación"
          ],
          [
            "finalidad",
            "los conectores de finalidad"
          ],
          [
            "recapitulacion",
            "los conectores de recapitulación"
          ],
          [
            "apertura",
            "los conectores de apertura"
          ],
          [
            "causa",
            "los conectores de causa y efecto"
          ]
        ]
      },
      {
        "id": "citations",
        "match": "citacion|citas? (?:textuales|directas|indirectas)|comillas|parentesis|puntos suspensivos",
        "name": "los mecanismos de citación",
        "function": "distinguir palabras o ideas de la fuente de la voz propia y conservar su sentido al citarlas",
        "error": "se atribuye a la fuente una afirmación que no hizo o se presenta una cita como idea propia",
        "terms": [
          [
            "directas",
            "las citas directas"
          ],
          [
            "indirectas",
            "las citas indirectas"
          ]
        ]
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
            "imagenes",
            "las imágenes"
          ],
          [
            "ilustraciones|ilustracion",
            "las ilustraciones"
          ],
          [
            "mapas?(?! conceptual)",
            "los mapas"
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
        "id": "rhetorical",
        "match": "pregunta retorica",
        "name": "la pregunta retórica",
        "function": "reforzar una postura mediante una interrogación cuya intención se interpreta en el argumento",
        "error": "se interpreta la pregunta como solicitud literal de un dato y se pierde su intención argumentativa"
      },
      {
        "id": "counterarguments",
        "match": "contraargument",
        "name": "los contraargumentos",
        "function": "reconocer una postura contraria y responder a sus razones con apoyos pertinentes, sin deformarla",
        "error": "se refuta una postura distinta de la que sostuvo el interlocutor"
      },
      {
        "id": "stance",
        "match": "expresiones.*(?:tesis|punto de vista)|verbos de opinion",
        "name": "las expresiones y verbos de opinión",
        "function": "atribuir la valoración a quien la sostiene y distinguirla de una afirmación presentada como hecho",
        "error": "se atribuye al autor la opinión de otra voz o se interpreta una duda como certeza"
      },
      {
        "id": "statistics",
        "match": "datos estadisticos|cifras|estadisticas",
        "name": "los datos estadísticos",
        "function": "sustentar argumentos indicando qué representan las cifras y qué relación guardan con la tesis",
        "error": "se usa una cifra fuera de su referente o se extrae de ella una conclusión no sustentada"
      },
      {
        "id": "subordinate",
        "match": "oraciones.*subordinadas",
        "name": "las oraciones subordinadas",
        "function": "relacionar circunstancias, sujetos y cualidades con la proposición de la que dependen",
        "error": "se atribuye una condición o cualidad a una afirmación distinta",
        "terms": [
          [
            "adverbiales",
            "las subordinadas adverbiales"
          ],
          [
            "sustantivas",
            "las subordinadas sustantivas"
          ],
          [
            "adjetivas",
            "las subordinadas adjetivas"
          ]
        ]
      }
    ],
    "discurso-agradecimiento": [
      {
        "id": "vocabulary",
        "match": "vocabulario|lexico",
        "name": "el vocabulario temático",
        "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
        "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
      },
      {
        "id": "citations",
        "match": "citacion|citas? (?:textuales|directas|indirectas)|comillas|parentesis|puntos suspensivos",
        "name": "los mecanismos de citación",
        "function": "distinguir palabras o ideas de la fuente de la voz propia y conservar su sentido al citarlas",
        "error": "se atribuye a la fuente una afirmación que no hizo o se presenta una cita como idea propia",
        "terms": [
          [
            "directas",
            "las citas directas"
          ],
          [
            "indirectas",
            "las citas indirectas"
          ]
        ]
      },
      {
        "id": "sources",
        "match": "referencias bibliograficas|fuentes bibliograficas",
        "name": "las referencias bibliográficas",
        "function": "identificar el origen de los datos e ideas y permitir contrastarlos con la fuente utilizada",
        "error": "la referencia corresponde a una obra distinta o no respalda la información atribuida"
      },
      {
        "id": "connectors",
        "match": "conectores",
        "name": "los conectores de relación lógica",
        "function": "distinguir adición, contraste, explicación y finalidad entre las ideas que enlazan",
        "error": "el enlace invierte una causa, presenta una oposición como coincidencia o atribuye una conclusión ajena",
        "terms": [
          [
            "contraste",
            "los conectores de contraste"
          ],
          [
            "adicion",
            "los conectores de adición"
          ],
          [
            "cierre",
            "los conectores de cierre"
          ],
          [
            "ejemplificacion",
            "los conectores de ejemplificación"
          ],
          [
            "finalidad",
            "los conectores de finalidad"
          ],
          [
            "recapitulacion",
            "los conectores de recapitulación"
          ],
          [
            "apertura",
            "los conectores de apertura"
          ],
          [
            "causa",
            "los conectores de causa y efecto"
          ]
        ]
      },
      {
        "id": "nonverbal",
        "match": "paralinguistic|gestos|gestual|corporal|tono de voz|entonacion|postura|recursos no verbales",
        "name": "los recursos expresivos solicitados",
        "function": "relacionar la expresión o los apoyos de acceso acordados con el sentido del contenido comunicado",
        "error": "el recurso expresa una emoción o relación contraria al contenido",
        "terms": [
          [
            "gestos|gestual",
            "los gestos"
          ],
          [
            "entonacion|tono de voz",
            "la entonación"
          ],
          [
            "corporal|postura",
            "la expresión corporal"
          ]
        ]
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
        "id": "references",
        "match": "referencias lexic",
        "name": "las referencias léxicas de persona",
        "function": "retomar a los participantes manteniendo identificable a quién se atribuye cada aporte",
        "error": "la referencia cambia de persona y atribuye un aporte a alguien distinto"
      },
      {
        "id": "deictics",
        "match": "deictic|autorreferencia",
        "name": "la autorreferencia y los deícticos personales",
        "function": "distinguir la voz de quien agradece de las personas a quienes se dirige o incluye en su discurso",
        "error": "se interpreta el nosotros como un grupo ajeno a la situación comunicativa"
      },
      {
        "id": "courtesy",
        "match": "marcas de agradecimiento|cortesia",
        "name": "las marcas de agradecimiento y cortesía",
        "function": "expresar reconocimiento con formas adecuadas a la ocasión y a los participantes",
        "error": "una fórmula se dirige al participante equivocado o contradice el reconocimiento"
      },
      {
        "id": "voices",
        "match": "otras voces|intratextuales|intertextuales",
        "name": "los organizadores y las voces incorporadas",
        "function": "distinguir la referencia a una parte anterior del discurso de la incorporación de ideas de otra voz",
        "error": "se atribuye a otro autor una afirmación propia o se remite a una idea ausente"
      }
    ],
    "novela": [
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
        "id": "discourse",
        "match": "organizadores discursivos|formulas de inicio|formulas.*cierre",
        "name": "los organizadores discursivos",
        "function": "señalar cambios y continuidades entre partes del texto manteniendo sus relaciones",
        "error": "un marcador atribuye continuidad a una idea que inicia otro asunto"
      },
      {
        "id": "vocabulary",
        "match": "vocabulario|lexico",
        "name": "el vocabulario temático",
        "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
        "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
      },
      {
        "id": "sequences",
        "match": "secuencias narrativas|descriptivas|dialogadas",
        "name": "las secuencias narrativas, descriptivas y dialogadas",
        "function": "distinguir hechos, rasgos del ambiente e intervenciones y explicar cómo contribuyen al pasaje",
        "error": "se interpreta una descripción como acción ocurrida o se atribuye un diálogo al narrador"
      },
      {
        "id": "connectors",
        "match": "conectores",
        "name": "los conectores temporales, causales y consecutivos",
        "function": "distinguir el orden de los hechos de sus causas y consecuencias",
        "error": "se interpreta una sucesión temporal como causa o se invierte una consecuencia"
      },
      {
        "id": "past",
        "match": "verbos en pasado",
        "name": "los verbos en pasado",
        "function": "distinguir acciones concluidas y situaciones en desarrollo al reconstruir el orden del relato",
        "error": "se interpreta una situación durativa como una acción puntual y cambia la secuencia"
      }
    ],
    "soneto": [
      {
        "id": "vocabulary",
        "match": "vocabulario|lexico",
        "name": "el vocabulario temático",
        "function": "nombrar con significado pertinente los elementos y relaciones del pasaje",
        "error": "un término atribuye al referente una propiedad o relación que no tiene en el pasaje"
      },
      {
        "id": "nonverbal",
        "match": "paralinguistic|gestos|gestual|corporal|tono de voz|entonacion|postura|recursos no verbales",
        "name": "los recursos expresivos solicitados",
        "function": "relacionar la expresión o los apoyos de acceso acordados con el sentido del contenido comunicado",
        "error": "el recurso expresa una emoción o relación contraria al contenido",
        "terms": [
          [
            "gestos|gestual",
            "los gestos"
          ],
          [
            "entonacion|tono de voz",
            "la entonación"
          ],
          [
            "corporal|postura",
            "la expresión corporal"
          ]
        ]
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
        "id": "licenses",
        "match": "licencias metricas|sinalefa|sineresis|dieresis|hiato",
        "name": "las licencias métricas",
        "function": "justificar uniones o separaciones de sonidos en el cómputo del verso sin confundir sílabas gramaticales y métricas",
        "error": "se cuenta una unión o separación inexistente y se altera la medida del verso",
        "terms": [
          [
            "sinalefa",
            "la sinalefa"
          ],
          [
            "sineresis",
            "la sinéresis"
          ],
          [
            "dieresis",
            "la diéresis"
          ],
          [
            "hiato",
            "el hiato"
          ]
        ]
      },
      {
        "id": "images",
        "match": "imagenes.*(?:visuales|auditivas|olfativas|tactiles|gustativas)",
        "name": "las imágenes sensoriales",
        "function": "relacionar sensaciones evocadas con palabras del verso y con el sentimiento expresado",
        "error": "se atribuye a la imagen una sensación o emoción contraria al verso",
        "terms": [
          [
            "visuales",
            "las imágenes visuales"
          ],
          [
            "auditivas",
            "las imágenes auditivas"
          ],
          [
            "olfativas",
            "las imágenes olfativas"
          ],
          [
            "tactiles",
            "las imágenes táctiles"
          ],
          [
            "gustativas",
            "las imágenes gustativas"
          ]
        ]
      }
    ]
  },
  "fourthGradeLanguagePolicy": "TOPIC_ACTION_EXPLICIT_REQUIREMENTS_TERMS_V2"
}}
