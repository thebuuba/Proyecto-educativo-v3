import {evaluationCatalogV68} from './catalog-v68'
/** Frozen before French: the installed evaluation-2026.69 payload remains identical. */
const frozen={
  "version": "evaluation-2026.69",
  "firstGradeReadingReportModule": {
    "id": "lengua-secundaria-1-informe-de-lectura",
    "grade": 1,
    "subjectCode": "LEN",
    "source": {
      "topicElementId": "1d01bb28-c0b4-51ff-8123-dd7c7cd6f694",
      "pdfPages": [
        71,
        72
      ],
      "printedPages": [
        70,
        71
      ],
      "procedureElementIds": [
        "92a9d148-7590-5e13-a3f6-28094453c2a8",
        "fb146520-8892-5a1d-a107-7c3ca7de00d4",
        "f539e8fd-f625-5294-96fb-285546e10b49",
        "5b1e7ea8-a3e7-589a-9701-792813138f20",
        "f44cf502-e335-5fcd-b2c1-d58e5c21b85c"
      ]
    },
    "adaptation": "Criterios de Aula Base; no instrumentos oficiales del MINERD.",
    "optionalEvidence": [
      "report-conclusion"
    ],
    "criteriaByActivity": {
      "READING_REPORT_WRITING": [
        {
          "templateId": "report-summary",
          "title": "Resumen de texto seleccionado",
          "observable": "Sintetiza las ideas principales del texto leído y conserva sus relaciones sin alterar su sentido.",
          "weight": 5,
          "progressionLevels": [
            "Sintetiza las ideas principales del texto leído y conserva sus relaciones sin alterar su sentido.",
            "El resumen conserva las ideas principales; omite un detalle secundario.",
            "Recupera hechos o ideas aislados, pero omite relaciones necesarias para comprender el texto.",
            "El resumen altera hechos importantes o añade datos que no pertenecen al texto.",
            "No presenta una síntesis reconocible del texto leído."
          ]
        },
        {
          "templateId": "report-analysis",
          "title": "Interpretación del texto leído",
          "observable": "Interpreta el sentido y las relaciones entre ideas del texto y sustenta su explicación con ejemplos pertinentes del texto leído.",
          "weight": 5,
          "progressionLevels": [
            "Interpreta el sentido y las relaciones entre ideas del texto y sustenta su explicación con ejemplos pertinentes del texto leído.",
            "La interpretación se relaciona con el texto; un ejemplo necesita mayor explicación.",
            "Propone una interpretación y menciona ejemplos sin explicar cómo la apoyan.",
            "La interpretación contradice las acciones o información del texto.",
            "No presenta una interpretación sustentada del texto."
          ]
        },
        {
          "templateId": "report-structure",
          "title": "Estructura del informe de lectura",
          "observable": "Organiza título, introducción, desarrollo y conclusión de acuerdo con el propósito del informe.",
          "weight": 4,
          "progressionLevels": [
            "Organiza título, introducción, desarrollo y conclusión de acuerdo con el propósito del informe.",
            "Las partes del informe son reconocibles; una sección necesita desarrollo.",
            "El resumen o análisis se presentan, pero faltan partes necesarias para relacionarlos.",
            "La organización confunde el resumen con la interpretación o contradice la conclusión.",
            "No organiza un informe de lectura reconocible."
          ]
        },
        {
          "templateId": "report-coherence",
          "title": "Coherencia y recursos lingüísticos",
          "observable": "Relaciona resumen y análisis con vocabulario adecuado, verbos consistentes y conectores de adición o ejemplificación.",
          "weight": 3,
          "progressionLevels": [
            "Relaciona resumen y análisis con vocabulario adecuado, verbos consistentes y conectores de adición o ejemplificación.",
            "La relación entre resumen y análisis se comprende; un enlace necesita precisión.",
            "Presenta ideas aisladas y los conectores no aclaran su relación.",
            "Las formas verbales o conectores cambian el sentido de los hechos o la interpretación.",
            "No se reconoce una relación comprensible entre las ideas del informe."
          ]
        },
        {
          "templateId": "report-revision",
          "title": "Revisión y versión final",
          "observable": "Presenta una versión final legible, con claridad, puntuación y ortografía que permiten comprender el informe.",
          "weight": 3,
          "progressionLevels": [
            "Presenta una versión final legible, con claridad, puntuación y ortografía que permiten comprender el informe.",
            "La versión final permite comprender el informe, con errores menores.",
            "Conserva problemas de claridad, puntuación u ortografía que dificultan algunos pasajes.",
            "Los errores de la versión final cambian datos importantes del texto o la interpretación.",
            "La versión final no permite comprender el contenido del informe."
          ]
        }
      ],
      "READING_REPORT_ANALYSIS": [
        {
          "templateId": "report-purpose",
          "title": "Función y propósito del informe",
          "observable": "Explica para qué se elaboró el informe de lectura y qué texto analiza.",
          "weight": 4,
          "progressionLevels": [
            "Explica para qué se elaboró el informe de lectura y qué texto analiza.",
            "Explica el propósito y reconoce la obra abordada con una imprecisión menor.",
            "Identifica la obra o el propósito, pero no explica su relación con el informe.",
            "Atribuye al informe un propósito o una obra que no le corresponden.",
            "No identifica el propósito ni el texto abordado por el informe."
          ]
        },
        {
          "templateId": "report-structure",
          "title": "Identificación de la estructura",
          "observable": "Identifica título, introducción, desarrollo y conclusión en el informe leído.",
          "weight": 4,
          "progressionLevels": [
            "Identifica título, introducción, desarrollo y conclusión en el informe leído.",
            "Localiza las partes presentes; una delimitación necesita precisión.",
            "Identifica algunas partes, pero confunde sus funciones en el informe.",
            "Atribuye contenido del resumen al análisis o de la conclusión a otra sección.",
            "No identifica partes reconocibles del informe."
          ]
        },
        {
          "templateId": "report-summary",
          "title": "Comprensión del resumen",
          "observable": "Reconoce las ideas principales de texto seleccionado recuperadas en el informe sin confundirlas con el análisis.",
          "weight": 4,
          "progressionLevels": [
            "Reconoce las ideas principales de texto seleccionado recuperadas en el informe sin confundirlas con el análisis.",
            "Reconoce las ideas principales recuperadas por el resumen; un dato necesita precisión.",
            "Identifica algunos hechos del resumen sin relacionarlos con las ideas centrales.",
            "Confunde opiniones del análisis con acontecimientos recuperados por el resumen.",
            "No reconoce información del resumen del informe."
          ]
        },
        {
          "templateId": "report-analysis",
          "title": "Interpretación del informe de lectura",
          "observable": "Explica cómo el informe interpreta el sentido y las relaciones entre ideas del texto, apoyándose en información del informe.",
          "weight": 5,
          "progressionLevels": [
            "Explica cómo el informe interpreta el sentido y las relaciones entre ideas del texto, apoyándose en información del informe.",
            "Explica la interpretación del informe; una relación con el texto necesita precisión.",
            "Menciona una interpretación sin explicar cómo se sustenta en el informe.",
            "La explicación atribuye al informe una interpretación ausente o contraria a sus datos.",
            "No explica una interpretación reconocible del informe analizado."
          ]
        },
        {
          "templateId": "report-evidence",
          "title": "Justificación con evidencias",
          "observable": "Sustenta sus respuestas con información concreta del informe de lectura.",
          "weight": 3,
          "progressionLevels": [
            "Sustenta sus respuestas con información concreta del informe de lectura.",
            "Los datos del informe apoyan la respuesta; una relación queda implícita.",
            "Cita información del informe sin explicar qué respuesta sustenta.",
            "La información citada contradice su respuesta o no aparece en el informe.",
            "No aporta información del informe para sustentar sus respuestas."
          ]
        }
      ],
      "READING_REPORT_COMPARISON": [
        {
          "templateId": "report-purpose",
          "title": "Propósito y textos analizados",
          "observable": "Compara el propósito y los textos literarios abordados en ambos informes.",
          "weight": 4,
          "progressionLevels": [
            "Compara el propósito y los textos literarios abordados en ambos informes.",
            "Contrasta propósitos y obras abordadas con una imprecisión menor.",
            "Identifica el propósito o texto de un informe sin contrastarlo con el otro.",
            "Confunde las obras o propósitos de los informes comparados.",
            "No reconoce los textos ni propósitos que compara."
          ]
        },
        {
          "templateId": "report-structure",
          "title": "Comparación de la estructura",
          "observable": "Contrasta la organización de título, introducción, desarrollo y conclusión.",
          "weight": 4,
          "progressionLevels": [
            "Contrasta la organización de título, introducción, desarrollo y conclusión.",
            "Contrasta la organización de ambos informes; una diferencia necesita precisión.",
            "Identifica partes de ambos informes sin explicar cómo se organizan de manera semejante o distinta.",
            "Confunde las partes y formula un contraste incompatible con los informes.",
            "No compara la organización de los informes."
          ]
        },
        {
          "templateId": "report-analysis",
          "title": "Comparación de interpretaciones",
          "observable": "Contrasta cómo los informes interpretan el sentido y las relaciones entre ideas del texto, mediante información de ambos.",
          "weight": 5,
          "progressionLevels": [
            "Contrasta cómo los informes interpretan el sentido y las relaciones entre ideas del texto, mediante información de ambos.",
            "Relaciona semejanzas y diferencias entre interpretaciones; una necesita desarrollo.",
            "Enumera interpretaciones de los informes sin explicar una semejanza o diferencia.",
            "El contraste atribuye a un informe una interpretación del otro o una interpretación ausente.",
            "No compara interpretaciones de los informes."
          ]
        },
        {
          "templateId": "report-evidence",
          "title": "Uso de evidencias",
          "observable": "Sustenta la comparación con información concreta de ambos informes.",
          "weight": 4,
          "progressionLevels": [
            "Sustenta la comparación con información concreta de ambos informes.",
            "Usa información de ambos informes; una relación con el contraste necesita precisión.",
            "Usa datos de un solo informe o cita ambos sin explicar su relación con el contraste.",
            "Los datos citados contradicen la comparación formulada.",
            "No aporta información de los informes para sustentar el contraste."
          ]
        },
        {
          "templateId": "report-conclusion",
          "title": "Conclusión comparativa",
          "observable": "Formula una conclusión coherente con las diferencias y semejanzas identificadas.",
          "weight": 3,
          "progressionLevels": [
            "Formula una conclusión coherente con las diferencias y semejanzas identificadas.",
            "La conclusión retoma el contraste; una justificación necesita desarrollo.",
            "Propone una conclusión general sin relacionarla con las interpretaciones comparadas.",
            "La conclusión contradice el contraste entre los informes.",
            "No formula una conclusión de la comparación."
          ]
        }
      ],
      "READING_REPORT_PRESENTATION": [
        {
          "templateId": "report-summary",
          "title": "Síntesis de texto seleccionado",
          "observable": "Presenta las ideas principales de texto seleccionado de forma fiel y comprensible.",
          "weight": 5,
          "progressionLevels": [
            "Presenta las ideas principales de texto seleccionado de forma fiel y comprensible.",
            "Comunica las ideas principales del texto con una omisión menor.",
            "Comunica hechos aislados sin relacionarlos con el sentido principal del texto.",
            "La síntesis oral altera acontecimientos o añade datos ajenos al texto.",
            "No comunica una síntesis reconocible del texto leído."
          ]
        },
        {
          "templateId": "report-analysis",
          "title": "Interpretación del texto leído",
          "observable": "Interpreta el sentido y las relaciones entre ideas del texto y sustenta su explicación con ejemplos pertinentes del texto leído.",
          "weight": 5,
          "progressionLevels": [
            "Interpreta el sentido y las relaciones entre ideas del texto y sustenta su explicación con ejemplos pertinentes del texto leído.",
            "Explica la interpretación del texto; un ejemplo necesita mayor relación con su idea.",
            "Menciona una interpretación y ejemplos sin explicar cómo se relacionan.",
            "La explicación contradice las acciones o información del texto.",
            "No comunica una interpretación sustentada del texto."
          ]
        },
        {
          "templateId": "report-structure",
          "title": "Organización del informe oral",
          "observable": "Organiza la exposición con introducción, desarrollo y conclusión reconocibles.",
          "weight": 4,
          "progressionLevels": [
            "Organiza la exposición con introducción, desarrollo y conclusión reconocibles.",
            "Se reconocen introducción, desarrollo y conclusión; una transición necesita precisión.",
            "Comunica ideas aisladas y no se reconoce una de las partes de la exposición.",
            "El orden confunde hechos del texto con interpretaciones o conclusiones.",
            "No se reconoce una secuencia de exposición del informe."
          ]
        },
        {
          "templateId": "report-oral",
          "title": "Claridad de la exposición",
          "observable": "Expone con orden, dicción, volumen y ritmo comprensibles.",
          "weight": 3,
          "progressionLevels": [
            "Expone con orden, dicción, volumen y ritmo comprensibles.",
            "La comunicación o el apoyo acordado permite comprender las ideas; una pausa necesita ajuste.",
            "Se comprenden ideas aisladas, pero el ritmo o las pausas dificultan relacionarlas.",
            "La expresión cambia el sentido de ideas importantes del informe.",
            "No comunica información comprensible mediante la exposición o el apoyo acordado."
          ]
        },
        {
          "templateId": "report-individual",
          "title": "Explicación del contenido presentado",
          "observable": "Explica con sus palabras las ideas del texto y la interpretación que presenta.",
          "weight": 3,
          "progressionLevels": [
            "Explica con sus palabras las ideas del texto y la interpretación que presenta.",
            "Explica con sus palabras el texto y su interpretación con una imprecisión menor.",
            "Repite información sin explicar su relación con la interpretación presentada.",
            "Su explicación confunde hechos e interpretaciones del informe.",
            "No ofrece una explicación reconocible del contenido que presenta."
          ]
        }
      ]
    }
  },
  "englishGradeOneGrammar": [
    {
      "id": "present-simple",
      "match": "\\b(?:presente simple|simple present|present simple)\\b",
      "name": "el presente simple",
      "function": "expresar hábitos, datos o estados según el mensaje",
      "error": "altera la concordancia o la referencia habitual de las acciones"
    },
    {
      "id": "preference-verbs",
      "match": "\\b(?:verbos? (?:like|prefer|enjoy)|like prefer enjoy|like y prefer)\\b",
      "name": "los verbos like, prefer y enjoy solicitados",
      "function": "expresar gustos y preferencias relacionando quién prefiere con lo preferido",
      "error": "confunde quién expresa el gusto o qué actividad prefiere",
      "terms": [
        [
          "\\blike\\b",
          "el verbo like"
        ],
        [
          "\\bprefer\\b",
          "el verbo prefer"
        ],
        [
          "\\benjoy\\b",
          "el verbo enjoy"
        ]
      ]
    },
    {
      "id": "present-continuous",
      "match": "\\b(?:presente continuo|present continuous)\\b",
      "name": "el presente continuo",
      "function": "situar una acción en desarrollo en el momento indicado",
      "error": "confunde la acción en desarrollo con una acción terminada o habitual"
    },
    {
      "id": "past-simple",
      "match": "\\b(?:pasado simple|simple past|past simple)\\b",
      "name": "el pasado simple",
      "function": "situar hechos o experiencias terminados en el pasado",
      "error": "presenta como actual un hecho situado en el pasado o cambia quién lo realizó"
    },
    {
      "id": "present-perfect",
      "match": "\\b(?:presente perfecto|present perfect)\\b",
      "name": "el presente perfecto",
      "function": "referir experiencias anteriores relacionadas con el presente",
      "error": "confunde la experiencia anterior con una acción que está ocurriendo ahora"
    },
    {
      "id": "future",
      "match": "\\b(?:will|(?:be )?going to)\\b",
      "name": "will o be going to según la forma solicitada",
      "function": "comunicar previsiones para el momento futuro indicado",
      "error": "sitúa la previsión en un momento distinto del anunciado",
      "terms": [
        [
          "\\bwill\\b",
          "will"
        ],
        [
          "\\b(?:be )?going to\\b",
          "be going to"
        ]
      ]
    },
    {
      "id": "would",
      "match": "\\b(?:would)\\b",
      "name": "would en la invitación",
      "function": "formular o aceptar cortésmente una invitación",
      "error": "la estructura cambia la invitación por una afirmación que no propone ni responde"
    },
    {
      "id": "declining-forms",
      "match": "\\b(?:can t|cannot|have to)\\b",
      "name": "can’t o have to según la forma solicitada",
      "function": "expresar imposibilidad u obligación al rechazar una invitación",
      "error": "comunica posibilidad cuando pretende expresar imposibilidad u obligación",
      "terms": [
        [
          "\\bcan t\\b|\\bcannot\\b",
          "can’t"
        ],
        [
          "\\bhave to\\b",
          "have to"
        ]
      ]
    },
    {
      "id": "there-be",
      "match": "\\b(?:there (?:is|are|be)|there y be)\\b",
      "name": "there + be",
      "function": "indicar existencia y cantidad en la descripción de un lugar",
      "error": "confunde la existencia o el número de los elementos descritos"
    },
    {
      "id": "imperative",
      "match": "\\b(?:imperativos?|imperatives?)\\b",
      "name": "el imperativo",
      "function": "comunicar la acción solicitada en una instrucción",
      "error": "cambia una instrucción afirmativa por una prohibición o altera la acción solicitada"
    },
    {
      "id": "lets",
      "match": "\\b(?:let s)\\b",
      "name": "let’s",
      "function": "proponer una actividad compartida mediante una invitación",
      "error": "la expresión deja de proponer una acción compartida al interlocutor"
    },
    {
      "id": "question-tags",
      "match": "\\b(?:question tags?)\\b",
      "name": "las question tags",
      "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada",
      "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación"
    },
    {
      "id": "possessive-s",
      "match": "\\b(?:posesivo s|genitivo sajon|possessive s)\\b",
      "name": "el posesivo ’s",
      "function": "relacionar una pertenencia con su poseedor",
      "error": "atribuye la pertenencia a un poseedor distinto"
    },
    {
      "id": "articles",
      "match": "\\b(?:articulos? definidos?|articulos? indefinidos?|definite articles?|indefinite articles?|a an y the)\\b",
      "name": "los artículos definidos o indefinidos solicitados",
      "function": "distinguir referentes identificados de referentes no identificados previamente",
      "error": "la elección del artículo cambia qué referente puede reconocer el destinatario",
      "terms": [
        [
          "\\bdefinidos?\\b|\\bdefinite\\b",
          "los artículos definidos"
        ],
        [
          "\\bindefinidos?\\b|\\bindefinite\\b",
          "los artículos indefinidos"
        ]
      ]
    },
    {
      "id": "qualifying-adjectives",
      "match": "\\b(?:adjetivos? calificativos?|qualifying adjectives?)\\b",
      "name": "los adjetivos calificativos",
      "function": "atribuir características a personas, lugares u objetos",
      "error": "atribuye una característica incompatible con lo que se desea describir"
    },
    {
      "id": "comparative",
      "match": "\\b(?:comparativos?|comparative|superlativos?|superlative)\\b",
      "name": "el grado comparativo o superlativo solicitado",
      "function": "establecer una comparación o destacar un elemento dentro de un conjunto",
      "error": "confunde la relación entre dos elementos con la selección de uno dentro de un conjunto",
      "terms": [
        [
          "\\bcomparativos?\\b|\\bcomparative\\b",
          "el grado comparativo"
        ],
        [
          "\\bsuperlativos?\\b|\\bsuperlative\\b",
          "el grado superlativo"
        ]
      ]
    },
    {
      "id": "possessive-adjectives",
      "match": "\\b(?:adjetivos? posesivos?|possessive adjectives?)\\b",
      "name": "los adjetivos posesivos",
      "function": "señalar a quién pertenece el sustantivo que acompañan",
      "error": "cambia el poseedor de la pertenencia expresada"
    },
    {
      "id": "interrogative-pronouns",
      "match": "\\b(?:pronombres? interrogativos?|interrogative pronouns?)\\b",
      "name": "los pronombres interrogativos",
      "function": "preguntar por la persona, cosa o lugar que se necesita conocer",
      "error": "pregunta por una información distinta de la que se quiere solicitar"
    },
    {
      "id": "object-pronouns",
      "match": "\\b(?:pronombres? objeto|object pronouns?)\\b",
      "name": "los pronombres objeto",
      "function": "señalar a quién se dirige o afecta la acción",
      "error": "atribuye la acción al receptor equivocado"
    },
    {
      "id": "possessive-pronouns",
      "match": "\\b(?:pronombres? posesivos?|possessive pronouns?)\\b",
      "name": "los pronombres posesivos",
      "function": "identificar una pertenencia y su poseedor sin repetir el sustantivo",
      "error": "sustituye la pertenencia de modo que se atribuye a otro poseedor"
    },
    {
      "id": "time-prepositions",
      "match": "\\b(?:preposiciones? de tiempo|prepositions? of time)\\b",
      "name": "las preposiciones de tiempo",
      "function": "situar el hecho en la hora, fecha o período indicado",
      "error": "sitúa el hecho en una referencia temporal diferente"
    },
    {
      "id": "place-prepositions",
      "match": "\\b(?:preposiciones? de lugar|prepositions? of place)\\b",
      "name": "las preposiciones de lugar",
      "function": "situar un elemento respecto a otro en el espacio",
      "error": "cambia la relación espacial entre los elementos"
    },
    {
      "id": "time-adverbs",
      "match": "\\b(?:adverbios? de tiempo|adverbs? of time)\\b",
      "name": "los adverbios de tiempo",
      "function": "indicar cuándo ocurre la acción",
      "error": "desplaza la acción a un momento distinto del indicado"
    },
    {
      "id": "frequency-adverbs",
      "match": "\\b(?:adverbios? de frecuencia|adverbs? of frequency)\\b",
      "name": "los adverbios de frecuencia",
      "function": "expresar con qué frecuencia ocurre una acción",
      "error": "confunde una acción habitual con una ocasional o inexistente"
    },
    {
      "id": "manner-adverbs",
      "match": "\\b(?:adverbios? de modo|adverbs? of manner)\\b",
      "name": "los adverbios de modo",
      "function": "precisar cómo se realiza una acción",
      "error": "altera la manera en que se realiza la acción descrita"
    },
    {
      "id": "degree-adverbs",
      "match": "\\b(?:adverbios? de intensidad|adverbs? of (?:degree|intensity))\\b",
      "name": "los adverbios de intensidad",
      "function": "graduar la intensidad de una característica o acción",
      "error": "cambia el grado de intensidad que se pretende expresar"
    },
    {
      "id": "certainty-adverbs",
      "match": "\\b(?:adverbios? de certeza|adverbs? of certainty)\\b",
      "name": "los adverbios de certeza",
      "function": "expresar el grado de seguridad de una afirmación",
      "error": "presenta una posibilidad como una certeza o una certeza como una duda"
    },
    {
      "id": "coordination-connectors",
      "match": "\\b(?:conectores? de coordinacion|coordinating conjunctions?)\\b",
      "name": "los conectores de coordinación",
      "function": "unir, contrastar o presentar alternativas entre ideas",
      "error": "confunde suma, contraste y alternativa entre las ideas"
    },
    {
      "id": "time-connectors",
      "match": "\\b(?:conectores? de tiempo|temporal connectors?)\\b",
      "name": "los conectores de tiempo",
      "function": "relacionar los momentos en que ocurren las acciones",
      "error": "invierte la relación de anterioridad o posterioridad de las acciones"
    },
    {
      "id": "sequence-connectors",
      "match": "\\b(?:conectores? de secuencia|sequence connectors?)\\b",
      "name": "los conectores de secuencia",
      "function": "ordenar pasos o acontecimientos",
      "error": "cambia el orden necesario para seguir los pasos o acontecimientos"
    },
    {
      "id": "cause-connectors",
      "match": "\\b(?:conectores? de causa(?: y consecuencia)?|conectores? de consecuencia|cause and effect connectors?)\\b",
      "name": "los conectores de causa y consecuencia",
      "function": "relacionar un hecho con su causa o su consecuencia",
      "error": "invierte o confunde la causa y la consecuencia de los hechos"
    }
  ],
  "englishGradeOneLexicon": [
    {
      "id": "geography",
      "match": "\\b(?:accidentes geograficos|geographical features)\\b",
      "name": "accidentes geográficos",
      "function": "nombrar los rasgos del paisaje solicitados",
      "error": "nombra un accidente geográfico distinto del referente",
      "category": "vocabulary"
    },
    {
      "id": "arts",
      "match": "\\b(?:actividades artisticas|artistic activities)\\b",
      "name": "actividades artísticas",
      "function": "comunicar la práctica artística indicada",
      "error": "confunde la actividad artística con otra práctica",
      "category": "vocabulary"
    },
    {
      "id": "daily",
      "match": "\\b(?:actividades (?:diarias|cotidianas)|daily activities)\\b",
      "name": "actividades diarias",
      "function": "nombrar las acciones de la jornada",
      "error": "cambia la acción cotidiana que se desea comunicar",
      "category": "vocabulary"
    },
    {
      "id": "leisure",
      "match": "\\b(?:actividades recreativas|recreational activities)\\b",
      "name": "actividades recreativas",
      "function": "nombrar la actividad de ocio indicada",
      "error": "confunde la actividad recreativa con otra actividad",
      "category": "vocabulary"
    },
    {
      "id": "food",
      "match": "\\b(?:(?<!preparacion de )alimentos|comidas y bebidas|food)\\b",
      "name": "alimentos",
      "function": "identificar la comida o bebida mencionada",
      "error": "atribuye al alimento un nombre que corresponde a otro producto",
      "category": "vocabulary"
    },
    {
      "id": "address",
      "match": "\\b(?:apelativos|formas de dirigirse|forms of address)\\b",
      "name": "apelativos",
      "function": "dirigirse a la persona en la situación indicada",
      "error": "emplea un apelativo que cambia el destinatario o el trato solicitado",
      "category": "vocabulary"
    },
    {
      "id": "celebrations",
      "match": "\\b(?:celebraciones|celebrations)\\b",
      "name": "celebraciones",
      "function": "nombrar la celebración mencionada",
      "error": "confunde la celebración con otro acontecimiento",
      "category": "vocabulary"
    },
    {
      "id": "colors",
      "match": "\\b(?:colores|colours|colors)\\b",
      "name": "colores",
      "function": "precisar el color del referente",
      "error": "asigna al referente un color diferente del indicado",
      "category": "vocabulary"
    },
    {
      "id": "weather-words",
      "match": "\\b(?:condiciones atmosfericas|weather conditions)\\b",
      "name": "condiciones atmosféricas",
      "function": "nombrar el estado del tiempo indicado",
      "error": "confunde el estado del tiempo comunicado",
      "category": "vocabulary"
    },
    {
      "id": "territories",
      "match": "\\b(?:continentes|paises|ciudades|continents|countries|cities)\\b",
      "name": "lugares geográficos solicitados",
      "function": "identificar el lugar geográfico nombrado",
      "error": "cambia el lugar al que se refiere el mensaje",
      "category": "vocabulary"
    },
    {
      "id": "sports",
      "match": "\\b(?:deportes|sports)\\b",
      "name": "deportes",
      "function": "nombrar la práctica deportiva indicada",
      "error": "nombra un deporte distinto del solicitado",
      "category": "vocabulary"
    },
    {
      "id": "weekdays",
      "match": "\\b(?:dias de la semana|weekdays|days of the week)\\b",
      "name": "días de la semana",
      "function": "situar la actividad en el día señalado",
      "error": "desplaza la actividad a otro día",
      "category": "vocabulary"
    },
    {
      "id": "seasons",
      "match": "\\b(?:estaciones del ano|seasons)\\b",
      "name": "estaciones del año",
      "function": "identificar la estación del año mencionada",
      "error": "confunde la estación a la que se refiere el mensaje",
      "category": "vocabulary"
    },
    {
      "id": "phenomena",
      "match": "\\b(?:fenomenos atmosfericos|atmospheric phenomena)\\b",
      "name": "fenómenos nombrados en el currículo",
      "function": "identificar el fenómeno nombrado en la situación",
      "error": "utiliza el nombre de un fenómeno distinto del indicado",
      "category": "vocabulary"
    },
    {
      "id": "shapes",
      "match": "\\b(?:formas(?! de ser)|figuras geometricas|shapes)\\b",
      "name": "formas de los objetos",
      "function": "precisar la forma del objeto",
      "error": "atribuye al objeto una forma diferente",
      "category": "vocabulary"
    },
    {
      "id": "personality",
      "match": "\\b(?:formas de ser|personalidad|personality)\\b",
      "name": "formas de ser",
      "function": "comunicar la característica de la persona o personaje descrito",
      "error": "atribuye al personaje un rasgo de personalidad diferente",
      "category": "vocabulary"
    },
    {
      "id": "music",
      "match": "\\b(?:generos musicales|musical genres)\\b",
      "name": "géneros musicales",
      "function": "nombrar el tipo de música mencionado",
      "error": "confunde el género musical con otro género",
      "category": "vocabulary"
    },
    {
      "id": "languages",
      "match": "\\b(?:idiomas|languages)\\b",
      "name": "idiomas",
      "function": "identificar la lengua mencionada",
      "error": "cambia la lengua a la que se refiere el mensaje",
      "category": "vocabulary"
    },
    {
      "id": "building-places",
      "match": "\\b(?:lugares de un edificio|zonas de un edificio|building locations)\\b",
      "name": "lugares de un edificio",
      "function": "localizar la zona del edificio indicada",
      "error": "confunde la entrada, salida u otra zona solicitada",
      "category": "vocabulary"
    },
    {
      "id": "public-places",
      "match": "\\b(?:lugares de la ciudad|lugares publicos|public places)\\b",
      "name": "lugares públicos",
      "function": "identificar el lugar público mencionado",
      "error": "sitúa el referente en un lugar público diferente",
      "category": "vocabulary"
    },
    {
      "id": "transport",
      "match": "\\b(?:medios de transporte|means of transport)\\b",
      "name": "medios de transporte",
      "function": "nombrar el medio de desplazamiento solicitado",
      "error": "cambia el medio de transporte indicado",
      "category": "vocabulary"
    },
    {
      "id": "family",
      "match": "\\b(?:miembros de la familia|parentesco|family members)\\b",
      "name": "miembros de la familia",
      "function": "expresar la relación de parentesco indicada",
      "error": "atribuye una relación de parentesco diferente entre los personajes",
      "category": "vocabulary"
    },
    {
      "id": "furniture",
      "match": "\\b(?:mobiliario(?: y objetos)?|furniture)\\b",
      "name": "mobiliario y objetos solicitados",
      "function": "nombrar el mueble u objeto indicado",
      "error": "confunde el objeto nombrado con otro mueble u objeto",
      "category": "vocabulary"
    },
    {
      "id": "nationalities",
      "match": "\\b(?:nacionalidades|nationalities)\\b",
      "name": "nacionalidades",
      "function": "expresar la nacionalidad indicada",
      "error": "confunde la nacionalidad con otra procedencia",
      "category": "vocabulary"
    },
    {
      "id": "names",
      "match": "\\b(?:nombres propios|proper names)\\b",
      "name": "nombres propios",
      "function": "identificar a la persona o lugar nombrado",
      "error": "atribuye el nombre a un referente distinto",
      "category": "vocabulary"
    },
    {
      "id": "cardinal",
      "match": "\\b(?:numeros cardinales|cardinal numbers)\\b",
      "name": "números cardinales",
      "function": "expresar la cantidad solicitada",
      "error": "comunica una cantidad diferente de la indicada",
      "category": "vocabulary"
    },
    {
      "id": "ordinal",
      "match": "\\b(?:numeros ordinales|ordinal numbers)\\b",
      "name": "números ordinales",
      "function": "expresar la posición en una serie",
      "error": "cambia la posición del elemento en la serie",
      "category": "vocabulary"
    },
    {
      "id": "jobs",
      "match": "\\b(?:ocupaciones|profesiones|occupations|jobs)\\b",
      "name": "ocupaciones",
      "function": "nombrar la ocupación mencionada",
      "error": "atribuye a la persona una ocupación distinta",
      "category": "vocabulary"
    },
    {
      "id": "body",
      "match": "\\b(?:partes del cuerpo|body parts)\\b",
      "name": "partes del cuerpo",
      "function": "identificar la parte corporal indicada",
      "error": "señala una parte corporal distinta de la nombrada",
      "category": "vocabulary"
    },
    {
      "id": "belongings",
      "match": "\\b(?:pertenencias|belongings)\\b",
      "name": "pertenencias",
      "function": "nombrar la pertenencia mencionada",
      "error": "confunde el objeto personal con otro objeto",
      "category": "vocabulary"
    },
    {
      "id": "cooking",
      "match": "\\b(?:preparacion de alimentos|food preparation)\\b",
      "name": "preparación de alimentos",
      "function": "comunicar la acción de preparación solicitada",
      "error": "cambia la acción culinaria indicada por otra",
      "category": "vocabulary"
    },
    {
      "id": "compass",
      "match": "\\b(?:puntos cardinales|cardinal directions)\\b",
      "name": "puntos cardinales",
      "function": "comunicar la orientación espacial indicada",
      "error": "invierte la dirección espacial que se desea comunicar",
      "category": "vocabulary"
    },
    {
      "id": "appearance",
      "match": "\\b(?:rasgos fisicos|physical features)\\b",
      "name": "rasgos físicos",
      "function": "expresar el rasgo de apariencia descrito",
      "error": "atribuye a la persona o personaje un rasgo físico distinto",
      "category": "vocabulary"
    },
    {
      "id": "clothing",
      "match": "\\b(?:ropa(?: y accesorios)?|prendas de vestir|clothing)\\b",
      "name": "ropa y accesorios solicitados",
      "function": "nombrar la prenda o accesorio mencionado",
      "error": "nombra una prenda o accesorio diferente del referente",
      "category": "vocabulary"
    },
    {
      "id": "sizes",
      "match": "\\b(?:tamanos|sizes)\\b",
      "name": "tamaños",
      "function": "precisar el tamaño relativo del referente",
      "error": "cambia el tamaño que se desea indicar",
      "category": "vocabulary"
    },
    {
      "id": "chores",
      "match": "\\b(?:tareas del hogar|tareas domesticas|household chores)\\b",
      "name": "tareas del hogar",
      "function": "nombrar la tarea doméstica indicada",
      "error": "confunde la tarea doméstica con una acción diferente",
      "category": "vocabulary"
    },
    {
      "id": "titles",
      "match": "\\b(?:titulos personales|personal titles)\\b",
      "name": "títulos personales",
      "function": "expresar el tratamiento de la persona en la situación acordada",
      "error": "cambia el tratamiento solicitado al dirigirse a la persona",
      "category": "vocabulary"
    },
    {
      "id": "equipment",
      "match": "\\b(?:uso de aparatos|uso de equipos|equipment use)\\b",
      "name": "uso de aparatos",
      "function": "indicar la acción sobre el aparato",
      "error": "confunde conectar, encender u otra acción solicitada",
      "category": "vocabulary"
    },
    {
      "id": "travel",
      "match": "\\b(?:viajes|travel)\\b",
      "name": "viajes",
      "function": "nombrar el servicio u objeto del viaje indicado",
      "error": "confunde el servicio, lugar u objeto necesario en la situación de viaje",
      "category": "vocabulary"
    },
    {
      "id": "greeting",
      "match": "\\b(?:saludar|saludos|greetings)\\b",
      "name": "saludar",
      "function": "iniciar el contacto según la situación comunicativa",
      "error": "usa una fórmula de cierre cuando se solicita iniciar el contacto",
      "category": "expression"
    },
    {
      "id": "farewell",
      "match": "\\b(?:despedirse|despedidas|farewells)\\b",
      "name": "despedirse",
      "function": "cerrar el contacto en la situación comunicativa",
      "error": "usa una fórmula que abre el contacto cuando corresponde despedirse",
      "category": "expression"
    },
    {
      "id": "introduction",
      "match": "\\b(?:presentarse|presentar a (?:alguien|otras personas)|introductions)\\b",
      "name": "presentarse o presentar a la persona indicada",
      "function": "dar a conocer a una persona en el intercambio",
      "error": "cambia quién se presenta o quién es presentado",
      "category": "expression"
    },
    {
      "id": "classroom",
      "match": "\\b(?:interactuar en el aula|interaccion en el aula|classroom interaction)\\b",
      "name": "interactuar en el aula",
      "function": "comunicar la necesidad de comunicación en clase",
      "error": "la expresión solicita una acción distinta de la necesaria en clase",
      "category": "expression"
    },
    {
      "id": "interruption",
      "match": "\\b(?:interrumpir cortesmente|interrupcion cortes|polite interruption)\\b",
      "name": "interrumpir cortésmente",
      "function": "solicitar una interrupción sin cambiar el asunto del intercambio",
      "error": "la expresión no permite reconocer la solicitud de interrupción",
      "category": "expression"
    },
    {
      "id": "turns",
      "match": "\\b(?:(?:tomar|ceder)(?: y ceder)? el turno|turn taking)\\b",
      "name": "tomar o ceder el turno según lo solicitado",
      "function": "regular el turno de palabra en el intercambio",
      "error": "pide tomar el turno cuando debe cederlo o lo contrario",
      "category": "expression"
    },
    {
      "id": "translation",
      "match": "\\b(?:solicitar (?:traduccion|repeticion)|pedir (?:traduccion|repeticion)|translation or repetition)\\b",
      "name": "solicitar traducción o repetición según lo pedido",
      "function": "pedir ayuda para comprender el mensaje",
      "error": "la solicitud no indica qué parte necesita traducción o repetición",
      "category": "expression"
    },
    {
      "id": "agreement",
      "match": "\\b(?:(?:expresar )?(?:aprobacion|acuerdo)|approval|agreement)\\b",
      "name": "expresar aprobación o acuerdo",
      "function": "comunicar acuerdo con lo comunicado",
      "error": "expresa desacuerdo cuando pretende comunicar aprobación",
      "category": "expression"
    },
    {
      "id": "attention",
      "match": "\\b(?:atraer la atencion|llamar la atencion|attract attention)\\b",
      "name": "atraer la atención",
      "function": "llamar al interlocutor antes de comunicar el mensaje",
      "error": "la expresión no permite al interlocutor reconocer que se le llama",
      "category": "expression"
    },
    {
      "id": "invitation-response",
      "match": "\\b(?:responder a (?:las )?invitaciones|responding to invitations)\\b",
      "name": "responder a una invitación",
      "function": "comunicar aceptación o rechazo según la respuesta elegida",
      "error": "la expresión contradice la aceptación o el rechazo elegido",
      "category": "expression"
    },
    {
      "id": "excuse",
      "match": "\\b(?:excusarse|disculparse|apologizing)\\b",
      "name": "excusarse",
      "function": "expresar una disculpa relacionada con la situación",
      "error": "la expresión no permite reconocer la disculpa solicitada",
      "category": "expression"
    },
    {
      "id": "thanks",
      "match": "\\b(?:agradecer|agradecimiento|thanking)\\b",
      "name": "agradecer",
      "function": "comunicar agradecimiento por la ayuda o acción indicada",
      "error": "la expresión corresponde a otra intención y no comunica agradecimiento",
      "category": "expression"
    },
    {
      "id": "dates",
      "match": "\\b(?:indicar fechas|expresar fechas|giving dates)\\b",
      "name": "indicar fechas",
      "function": "comunicar la fecha indicada",
      "error": "cambia el día, mes o año solicitado",
      "category": "expression"
    },
    {
      "id": "hours",
      "match": "\\b(?:indicar la hora|expresar la hora|telling the time)\\b",
      "name": "indicar la hora",
      "function": "comunicar la hora indicada",
      "error": "cambia la hora a la que se refiere el mensaje",
      "category": "expression"
    }
  ],
  "englishGradeOneGenres": [
    {
      "id": "conversation",
      "match": "conversacion(?:es)?|dialogos?",
      "title": "Intercambio de la conversación",
      "data": "la relación entre las intervenciones de los interlocutores",
      "production": "Relaciona sus intervenciones en inglés con las de los interlocutores para mantener el intercambio acordado.",
      "error": "confunde quién interviene o a qué intervención responde"
    },
    {
      "id": "business-card",
      "match": "tarjetas? de presentacion|business cards?",
      "title": "Datos de la tarjeta de presentación",
      "data": "los datos de identificación y contacto solicitados de la tarjeta",
      "production": "Dispone en inglés los datos de identificación y contacto solicitados de la persona o personaje indicado.",
      "error": "atribuye los datos de la tarjeta a un referente diferente"
    },
    {
      "id": "list",
      "match": "listas?(?! (?:de cotejo|ponderadas?|de verificacion|de control|de observacion))",
      "title": "Elementos de la lista",
      "data": "los elementos de la lista que corresponden a la búsqueda solicitada",
      "production": "Presenta en inglés los elementos de la lista pertinentes para la finalidad indicada.",
      "error": "incorpora elementos ajenos a la categoría o finalidad de la lista"
    },
    {
      "id": "advertisement",
      "match": "anuncios?|advertisements?",
      "title": "Producto o servicio anunciado",
      "data": "el producto o servicio y la información solicitada del anuncio",
      "production": "Comunica en inglés el producto o servicio anunciado y la información necesaria para el destinatario acordado.",
      "error": "atribuye al producto o servicio características diferentes de las comunicadas"
    },
    {
      "id": "recipe",
      "match": "recetas?|recipes?",
      "title": "Acciones de la receta",
      "data": "las acciones de preparación y su orden en la receta",
      "production": "Comunica en inglés las acciones de preparación de la receta en un orden que permite seguir las instrucciones.",
      "error": "invierte o cambia acciones de preparación y altera las instrucciones",
      "existingFunction": "instructions"
    },
    {
      "id": "sign",
      "match": "letreros?|signs?",
      "title": "Indicación del letrero",
      "data": "la indicación del letrero para la situación en que aparece",
      "production": "Comunica en inglés la indicación del letrero de forma breve y comprensible para el destinatario.",
      "error": "confunde una indicación con su prohibición o comunica una acción diferente"
    },
    {
      "id": "notice",
      "match": "avisos?|notices?",
      "title": "Información del aviso",
      "data": "la información del aviso que permite comprender lo comunicado",
      "production": "Comunica en inglés la información del aviso necesaria para reconocer la situación anunciada.",
      "error": "cambia lo anunciado o a quién se dirige el aviso"
    },
    {
      "id": "poster",
      "match": "afiches?|carteles?|posters?",
      "title": "Mensaje del afiche",
      "data": "el mensaje central del afiche y la información solicitada",
      "production": "Dispone en inglés el mensaje central del afiche de forma legible y relacionada con su propósito comunicativo.",
      "error": "el mensaje dispuesto comunica un propósito diferente del solicitado"
    },
    {
      "id": "message",
      "match": "mensajes?|messages?",
      "title": "Propósito del mensaje",
      "data": "el propósito del mensaje y los datos solicitados para comprenderlo",
      "production": "Comunica en inglés las ideas necesarias para cumplir el propósito del mensaje en la situación acordada.",
      "error": "el contenido cambia la intención o el destinatario del mensaje"
    },
    {
      "id": "email",
      "match": "correos?(?: electronicos?)?|e mails?|emails?",
      "title": "Comunicación por correo electrónico",
      "data": "el destinatario y propósito del correo y su información solicitada",
      "production": "Relaciona el destinatario y propósito del correo con un cuerpo breve en inglés que permite comprender lo comunicado.",
      "error": "dirige a otra persona información que no corresponde al propósito del correo"
    },
    {
      "id": "cv",
      "match": "curriculum vitae|curriculum|cv",
      "title": "Perfil del currículum vitae",
      "data": "los datos de perfil solicitados en el currículum vitae",
      "production": "Organiza en inglés los datos de perfil solicitados de una persona real o ficticia para el currículum vitae acordado.",
      "error": "atribuye datos de perfil a otra persona o los ubica en un apartado diferente"
    },
    {
      "id": "letter",
      "match": "cartas?|letters?",
      "title": "Comunicación de la carta",
      "data": "el destinatario y propósito de la carta y la información solicitada",
      "production": "Relaciona el destinatario y propósito de la carta con un mensaje breve en inglés que permite comprender lo comunicado.",
      "error": "el mensaje se dirige a un destinatario o propósito diferente del acordado"
    },
    {
      "id": "form",
      "match": "formularios?|forms?",
      "title": "Información del formulario",
      "data": "los campos solicitados del formulario y los datos que contienen o requieren",
      "production": "Completa en inglés los campos solicitados con datos pertinentes de la persona o situación real o ficticia indicada.",
      "error": "sitúa los datos en campos que piden una información diferente"
    },
    {
      "id": "forecast",
      "match": "pronosticos? del tiempo|weather forecasts?",
      "title": "Información del pronóstico",
      "data": "las condiciones atmosféricas y sus referencias solicitadas en el pronóstico",
      "production": "Comunica en inglés las condiciones atmosféricas del pronóstico y las referencias solicitadas.",
      "error": "atribuye al pronóstico condiciones diferentes de las indicadas",
      "existingFunction": "weather"
    },
    {
      "id": "news",
      "match": "noticias?|news",
      "title": "Información de la noticia",
      "data": "el suceso comunicado y los datos solicitados de la noticia",
      "production": "Comunica en inglés el suceso comunicado y los datos necesarios para reconocer qué ocurrió en la noticia.",
      "error": "cambia el suceso o atribuye sus datos a otro acontecimiento"
    },
    {
      "id": "schedule",
      "match": "horarios?|timetables?",
      "title": "Actividad y momento del horario",
      "data": "la actividad y momento que corresponden a la consulta del horario",
      "production": "Relaciona en inglés cada actividad y momento solicitado para que el horario pueda consultarse.",
      "error": "asigna a la actividad un momento diferente del indicado"
    },
    {
      "id": "agenda",
      "match": "agendas?",
      "title": "Compromisos de la agenda",
      "data": "los compromisos y sus referencias temporales solicitadas en la agenda",
      "production": "Relaciona en inglés los compromisos con las referencias temporales necesarias para consultar la agenda.",
      "error": "cambia la correspondencia entre el compromiso y su momento"
    },
    {
      "id": "map",
      "match": "croquis|mapas?|maps?",
      "title": "Referencias del croquis",
      "data": "las ubicaciones y referencias del croquis necesarias para responder a la consulta",
      "production": "Relaciona las ubicaciones y referencias del croquis con las indicaciones en inglés solicitadas.",
      "error": "invierte una ubicación o referencia y cambia el recorrido consultado"
    },
    {
      "id": "questionnaire",
      "match": "cuestionarios?|questionnaires?",
      "title": "Información buscada por las preguntas",
      "data": "la información buscada por las preguntas del cuestionario",
      "production": "Formula en inglés preguntas comprensibles que permiten obtener la información buscada en la situación acordada.",
      "error": "formula o interpreta preguntas que buscan información distinta de la solicitada"
    },
    {
      "id": "brochure",
      "match": "folletos?|brochures?",
      "title": "Información del folleto",
      "data": "la información del folleto pertinente para la consulta solicitada",
      "production": "Dispone en inglés la información del folleto de modo que el destinatario pueda encontrar los datos solicitados.",
      "error": "la organización o los datos del folleto conducen a información diferente de la solicitada"
    },
    {
      "id": "song",
      "match": "cancion(?:es)?|songs?",
      "title": "Mensaje de la canción",
      "data": "el mensaje de la canción expresado por las palabras solicitadas",
      "production": "Comunica el mensaje de la canción en inglés con palabras y expresiones comprensibles mediante la interpretación acordada.",
      "error": "cambia palabras o relaciones que alteran el sentido del mensaje de la canción"
    },
    {
      "id": "poem",
      "match": "poesias?|poemas?|poems?",
      "title": "Sentido de los versos",
      "data": "el sentido de los versos y las expresiones solicitadas de la poesía",
      "production": "Comunica en inglés el sentido de los versos mediante las expresiones de la producción acordada.",
      "error": "atribuye a los versos un sentido incompatible con sus palabras"
    },
    {
      "id": "comic",
      "match": "historietas?|comics?",
      "title": "Secuencia de la historieta",
      "data": "la relación entre las viñetas y los mensajes de la historieta",
      "production": "Relaciona en inglés los mensajes con las viñetas para que la secuencia de la historieta resulte comprensible.",
      "error": "invierte la secuencia o atribuye a una viñeta un mensaje diferente"
    },
    {
      "id": "tourist-guide",
      "match": "guias? turisticas?|tourist guides?",
      "title": "Orientaciones de la guía turística",
      "data": "los lugares y orientaciones de la guía pertinentes para la consulta",
      "production": "Comunica en inglés los lugares y orientaciones de la guía que permiten atender la consulta acordada.",
      "error": "confunde los lugares o las orientaciones y conduce a información diferente"
    },
    {
      "id": "description",
      "match": "descripcion(?:es)?|descriptions?",
      "title": "Características de lo descrito",
      "data": "las características solicitadas y el referente descrito",
      "production": "Relaciona en inglés las características solicitadas con la persona, lugar u objeto descrito.",
      "error": "atribuye las características a un referente distinto",
      "existingFunction": "description"
    },
    {
      "id": "biography",
      "match": "biografias?|biographies",
      "title": "Acontecimientos de la biografía",
      "data": "los acontecimientos de la vida de la persona y sus relaciones solicitadas",
      "production": "Comunica en inglés los acontecimientos de la vida de la persona real o ficticia indicada con relaciones comprensibles.",
      "error": "atribuye los acontecimientos a otra persona o cambia su relación"
    },
    {
      "id": "narrative",
      "match": "narracion(?:es)?|relatos?|narratives?",
      "title": "Acontecimientos de la narración",
      "data": "los acontecimientos y personajes presentes en la narración y las relaciones solicitadas",
      "production": "Relaciona en inglés los acontecimientos y personajes, cuando corresponda, para que la narración real o ficticia se comprenda.",
      "error": "cambia los acontecimientos o sus relaciones y altera la narración"
    },
    {
      "id": "meme",
      "match": "memes?",
      "title": "Relación entre texto e imagen",
      "data": "la relación entre texto e imagen que comunica el meme",
      "production": "Relaciona el texto e imagen del meme para comunicar en inglés el mensaje acordado de forma comprensible.",
      "error": "el texto contradice la imagen y cambia la intención comunicativa acordada"
    },
    {
      "id": "audiovisual",
      "match": "produccion(?:es)? audiovisual(?:es)?|videos?",
      "title": "Mensaje de la producción audiovisual",
      "data": "la relación entre los recursos seleccionados y el mensaje audiovisual",
      "production": "Relaciona los recursos seleccionados con un mensaje en inglés comprensible para el destinatario acordado.",
      "error": "los recursos comunican ideas incompatibles con el mensaje solicitado"
    }
  ],
  "englishGradeTwoModule": {
    "id": "ingles-comunicacion-2",
    "grade": 2,
    "subjectCode": "ING",
    "pdfPages": [
      140,
      141,
      142,
      143,
      144,
      145
    ],
    "policy": "COMMON_CURRICULUM_FUNCTIONS_ALIASES_FORMS_PRODUCTS_COMPOSITION_V7"
  },
  "englishGradeTwoGrammar": [
    {
      "id": "present-simple",
      "match": "\\b(?:presente simple|simple present|present simple)\\b",
      "name": "el presente simple",
      "function": "expresar hábitos, datos o estados según el mensaje",
      "error": "altera la concordancia o la referencia habitual de las acciones"
    },
    {
      "id": "past-simple",
      "match": "\\b(?:pasado simple|simple past|past simple)\\b",
      "name": "el pasado simple",
      "function": "situar hechos o experiencias terminados en el pasado",
      "error": "presenta como actual un hecho situado en el pasado o cambia quién lo realizó"
    },
    {
      "id": "present-perfect",
      "match": "\\b(?:presente perfecto|present perfect)\\b",
      "name": "el presente perfecto",
      "function": "referir experiencias anteriores relacionadas con el presente",
      "error": "confunde la experiencia anterior con una acción que está ocurriendo ahora"
    },
    {
      "id": "question-tags",
      "match": "\\b(?:question tags?)\\b",
      "name": "las question tags",
      "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada",
      "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación"
    },
    {
      "id": "possessive-s",
      "match": "\\b(?:posesivo s|genitivo sajon|possessive s)\\b",
      "name": "el posesivo ’s",
      "function": "relacionar una pertenencia con su poseedor",
      "error": "atribuye la pertenencia a un poseedor distinto"
    },
    {
      "id": "articles",
      "match": "\\b(?:articulos? definidos?|articulos? indefinidos?|definite articles?|indefinite articles?|a an y the)\\b",
      "name": "los artículos definidos o indefinidos solicitados",
      "function": "distinguir referentes identificados de referentes no identificados previamente",
      "error": "la elección del artículo cambia qué referente puede reconocer el destinatario",
      "terms": [
        [
          "\\bdefinidos?\\b|\\bdefinite\\b",
          "los artículos definidos"
        ],
        [
          "\\bindefinidos?\\b|\\bindefinite\\b",
          "los artículos indefinidos"
        ]
      ]
    },
    {
      "id": "comparative",
      "match": "\\b(?:comparativos?|comparative|superlativos?|superlative)\\b",
      "name": "el grado comparativo o superlativo solicitado",
      "function": "establecer una comparación o destacar un elemento dentro de un conjunto",
      "error": "confunde la relación entre dos elementos con la selección de uno dentro de un conjunto",
      "terms": [
        [
          "\\bcomparativos?\\b|\\bcomparative\\b",
          "el grado comparativo"
        ],
        [
          "\\bsuperlativos?\\b|\\bsuperlative\\b",
          "el grado superlativo"
        ]
      ]
    },
    {
      "id": "interrogative-pronouns",
      "match": "\\b(?:pronombres? interrogativos?|interrogative pronouns?)\\b",
      "name": "los pronombres interrogativos",
      "function": "preguntar por la persona, cosa o lugar que se necesita conocer",
      "error": "pregunta por una información distinta de la que se quiere solicitar"
    },
    {
      "id": "object-pronouns",
      "match": "\\b(?:pronombres? objeto|object pronouns?)\\b",
      "name": "los pronombres objeto",
      "function": "señalar a quién se dirige o afecta la acción",
      "error": "atribuye la acción al receptor equivocado"
    },
    {
      "id": "possessive-pronouns",
      "match": "\\b(?:pronombres? posesivos?|possessive pronouns?)\\b",
      "name": "los pronombres posesivos",
      "function": "identificar una pertenencia y su poseedor sin repetir el sustantivo",
      "error": "sustituye la pertenencia de modo que se atribuye a otro poseedor"
    },
    {
      "id": "time-prepositions",
      "match": "\\b(?:preposiciones? de tiempo|prepositions? of time)\\b",
      "name": "las preposiciones de tiempo",
      "function": "situar el hecho en la hora, fecha o período indicado",
      "error": "sitúa el hecho en una referencia temporal diferente"
    },
    {
      "id": "time-adverbs",
      "match": "\\b(?:adverbios? de tiempo|adverbs? of time)\\b",
      "name": "los adverbios de tiempo",
      "function": "indicar cuándo ocurre la acción",
      "error": "desplaza la acción a un momento distinto del indicado"
    },
    {
      "id": "frequency-adverbs",
      "match": "\\b(?:adverbios? de frecuencia|adverbs? of frequency)\\b",
      "name": "los adverbios de frecuencia",
      "function": "expresar con qué frecuencia ocurre una acción",
      "error": "confunde una acción habitual con una ocasional o inexistente"
    },
    {
      "id": "degree-adverbs",
      "match": "\\b(?:adverbios? de intensidad|adverbs? of (?:degree|intensity))\\b",
      "name": "los adverbios de intensidad",
      "function": "graduar la intensidad de una característica o acción",
      "error": "cambia el grado de intensidad que se pretende expresar"
    },
    {
      "id": "coordination-connectors",
      "match": "\\b(?:conectores? de coordinacion|coordinating conjunctions?)\\b",
      "name": "los conectores de coordinación",
      "function": "unir, contrastar o presentar alternativas entre ideas",
      "error": "confunde suma, contraste y alternativa entre las ideas"
    },
    {
      "id": "time-connectors",
      "match": "\\b(?:conectores? de tiempo|temporal connectors?)\\b",
      "name": "los conectores de tiempo",
      "function": "relacionar los momentos en que ocurren las acciones",
      "error": "invierte la relación de anterioridad o posterioridad de las acciones"
    },
    {
      "id": "sequence-connectors",
      "match": "\\b(?:conectores? de secuencia|sequence connectors?)\\b",
      "name": "los conectores de secuencia",
      "function": "ordenar pasos o acontecimientos",
      "error": "cambia el orden necesario para seguir los pasos o acontecimientos"
    },
    {
      "id": "cause-connectors",
      "match": "\\b(?:conectores? de causa(?:lidad)?|conectores? de consecuencia|cause and effect connectors?)\\b",
      "name": "los conectores de causa y consecuencia",
      "function": "relacionar un hecho con su causa o su consecuencia",
      "error": "invierte o confunde la causa y la consecuencia de los hechos"
    },
    {
      "id": "past-continuous",
      "match": "\\b(?:pasado continuo|past continuous)\\b",
      "name": "el pasado continuo",
      "function": "situar la acción que estaba en desarrollo como contexto de un acontecimiento pasado",
      "error": "confunde la acción en curso con el acontecimiento que la interrumpe"
    },
    {
      "id": "will",
      "match": "\\b(?:will)\\b",
      "name": "will",
      "function": "proponer o confirmar un plan futuro en el intercambio",
      "error": "cambia la acción o el momento futuro acordado"
    },
    {
      "id": "going-to",
      "match": "\\b(?:be going to|going to)\\b",
      "name": "be going to",
      "function": "expresar la intención o el plan futuro solicitado",
      "error": "presenta como hecho terminado la intención futura"
    },
    {
      "id": "present-continuous",
      "match": "\\b(?:presente continuo|present continuous)\\b",
      "name": "el presente continuo",
      "function": "comunicar el plan futuro acordado con su referencia temporal",
      "error": "confunde el acuerdo futuro con una acción sin referencia al plan"
    },
    {
      "id": "there-past",
      "match": "\\b(?:there was|there were|there be en pasado simple)\\b",
      "name": "there + be en pasado simple",
      "function": "indicar la existencia y cantidad de elementos en el pasado",
      "error": "cambia la cantidad o sitúa como actual la existencia pasada",
      "terms": [
        [
          "\\bthere was\\b",
          "there was"
        ],
        [
          "\\bthere were\\b",
          "there were"
        ]
      ]
    },
    {
      "id": "imperative",
      "match": "\\b(?:imperativos?|imperatives?)\\b",
      "name": "el imperativo",
      "function": "dar el consejo o la indicación solicitada al interlocutor",
      "error": "invierte la indicación afirmativa y la prohibición"
    },
    {
      "id": "lets",
      "match": "\\b(?:let s)\\b",
      "name": "let’s",
      "function": "proponer una acción compartida como sugerencia",
      "error": "la expresión deja de proponer una acción compartida"
    },
    {
      "id": "wishes",
      "match": "\\b(?:want|hope|wish)\\b",
      "name": "los verbos de deseo o esperanza solicitados",
      "function": "distinguir lo que se desea de lo que se espera que ocurra",
      "error": "comunica como un hecho confirmado lo que se desea o espera",
      "terms": [
        [
          "\\bwant\\b",
          "want"
        ],
        [
          "\\bhope\\b",
          "hope"
        ],
        [
          "\\bwish\\b",
          "wish"
        ]
      ]
    },
    {
      "id": "permission",
      "match": "\\b(?:can|may|could)\\b",
      "name": "los modales de permiso solicitados",
      "function": "solicitar permiso o intervención cortés según el intercambio",
      "error": "la formulación deja de solicitar permiso o modifica la acción solicitada",
      "terms": [
        [
          "\\bcan\\b",
          "can"
        ],
        [
          "\\bmay\\b",
          "may"
        ],
        [
          "\\bcould\\b",
          "could"
        ]
      ]
    },
    {
      "id": "should",
      "match": "\\b(?:should)\\b",
      "name": "should",
      "function": "relacionar un consejo con el problema cotidiano planteado",
      "error": "presenta el consejo como una obligación ajena al problema"
    },
    {
      "id": "conditional",
      "match": "\\b(?:condicional(?:es)?|first conditional|conditional sentences?)\\b",
      "name": "la oración condicional",
      "function": "relacionar una condición con el consejo o plan que depende de ella",
      "error": "invierte la condición y el resultado o presenta el resultado como incondicional"
    },
    {
      "id": "passive",
      "match": "\\b(?:voz pasiva(?: del presente)?|pasiva (?:en )?presente|present passive)\\b",
      "name": "la voz pasiva en presente",
      "function": "referir el producto o servicio sobre el que recae una acción",
      "error": "atribuye al producto la acción que recibe"
    },
    {
      "id": "exclamation",
      "match": "\\b(?:exclamaciones?|oraciones? exclamativas?|exclamatory sentences?)\\b",
      "name": "las oraciones exclamativas",
      "function": "expresar la reacción ante la situación comunicada",
      "error": "cambia el sentido de la reacción solicitada"
    },
    {
      "id": "countability",
      "match": "\\b(?:sustantivos? contables|sustantivos? incontables|contables e incontables|countable|uncountable)\\b",
      "name": "los sustantivos contables e incontables solicitados",
      "function": "expresar cantidades compatibles con el tipo de sustantivo",
      "error": "trata una cantidad no contable como unidades contables o lo contrario"
    },
    {
      "id": "gender",
      "match": "\\b(?:genero (?:gramatical|de los sustantivos)|noun gender)\\b",
      "name": "el género de los sustantivos solicitado",
      "function": "reconocer el referente del sustantivo según su forma",
      "error": "atribuye a la forma una referencia distinta"
    },
    {
      "id": "number",
      "match": "\\b(?:numero de los sustantivos|singular y plural|noun number)\\b",
      "name": "el singular y plural solicitados",
      "function": "distinguir un elemento de varios elementos",
      "error": "cambia la cantidad expresada por el sustantivo"
    },
    {
      "id": "present-participle",
      "match": "\\b(?:participio presente|present participle|adjetivos? (?:en|terminados en) ing)\\b",
      "name": "los adjetivos en participio presente",
      "function": "caracterizar el efecto que provoca una situación o actividad",
      "error": "confunde el efecto de la actividad con el estado de quien lo experimenta"
    },
    {
      "id": "past-participle",
      "match": "\\b(?:participio pasado|past participle|adjetivos? (?:en|terminados en) ed)\\b",
      "name": "los adjetivos en participio pasado",
      "function": "describir el estado de la persona o referente",
      "error": "confunde el estado del referente con el efecto que provoca una actividad"
    },
    {
      "id": "how-much-many",
      "match": "\\b(?:how much|how many)\\b",
      "name": "how much o how many según lo solicitado",
      "function": "preguntar la cantidad de acuerdo con el referente contable o no contable",
      "error": "elige una pregunta incompatible con el tipo de cantidad",
      "terms": [
        [
          "\\bhow much\\b",
          "how much"
        ],
        [
          "\\bhow many\\b",
          "how many"
        ]
      ]
    },
    {
      "id": "why-suggestion",
      "match": "\\b(?:why don t|why not)\\b",
      "name": "why don’t o why not según lo solicitado",
      "function": "formular una sugerencia de acción al interlocutor",
      "error": "pregunta por una causa cuando pretende proponer una acción",
      "terms": [
        [
          "\\bwhy don t\\b",
          "why don’t"
        ],
        [
          "\\bwhy not\\b",
          "why not"
        ]
      ]
    },
    {
      "id": "reflexive-pronouns",
      "match": "\\b(?:pronombres? reflexivos?|reflexive pronouns?)\\b",
      "name": "los pronombres reflexivos",
      "function": "relacionar una acción con el mismo referente que la realiza",
      "error": "atribuye a otra persona una acción que recae sobre el sujeto"
    },
    {
      "id": "quantity-adverbs",
      "match": "\\b(?:adverbios? de cantidad|adverbs? of quantity)\\b",
      "name": "las expresiones de cantidad solicitadas",
      "function": "precisar cuánto hay del referente",
      "error": "cambia la cantidad que se pretende comunicar"
    },
    {
      "id": "duration-prepositions",
      "match": "\\b(?:preposiciones? de duracion|since|for|ago|until)\\b",
      "name": "las preposiciones de duración solicitadas",
      "function": "situar la duración, el inicio o el límite temporal de una situación",
      "error": "confunde la duración con el momento de inicio o final",
      "terms": [
        [
          "\\bsince\\b",
          "since"
        ],
        [
          "\\bfor\\b",
          "for"
        ],
        [
          "\\bago\\b",
          "ago"
        ],
        [
          "\\buntil\\b",
          "until"
        ]
      ]
    }
  ],
  "englishGradeTwoGenres": [
    {
      "id": "conversation",
      "match": "conversacion(?:es)?|dialogos?",
      "title": "Intercambio de la conversación",
      "data": "la relación entre las intervenciones de los interlocutores",
      "production": "Relaciona sus intervenciones en inglés con las de los interlocutores para mantener el intercambio acordado.",
      "error": "confunde quién interviene o a qué intervención responde",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "business-card",
      "match": "tarjetas? de presentacion|business cards?",
      "title": "Datos de la tarjeta de presentación",
      "data": "los datos de identificación y contacto solicitados de la tarjeta",
      "production": "Dispone en inglés los datos de identificación y contacto solicitados de la persona o personaje indicado.",
      "error": "atribuye los datos de la tarjeta a un referente diferente",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "list",
      "match": "listas?(?! (?:de cotejo|ponderadas?|de verificacion|de control|de observacion))",
      "title": "Elementos de la lista",
      "data": "los elementos de la lista que corresponden a la búsqueda solicitada",
      "production": "Presenta en inglés los elementos de la lista pertinentes para la finalidad indicada.",
      "error": "incorpora elementos ajenos a la categoría o finalidad de la lista",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "advertisement",
      "match": "anuncios?|advertisements?",
      "title": "Producto o servicio anunciado",
      "data": "el producto o servicio y la información solicitada del anuncio",
      "production": "Comunica en inglés el producto o servicio anunciado y la información necesaria para el destinatario acordado.",
      "error": "atribuye al producto o servicio características diferentes de las comunicadas",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "recipe",
      "match": "recetas?|recipes?",
      "title": "Acciones de la receta",
      "data": "las acciones de preparación y su orden en la receta",
      "production": "Comunica en inglés las acciones de preparación de la receta en un orden que permite seguir las instrucciones.",
      "error": "invierte o cambia acciones de preparación y altera las instrucciones",
      "existingFunction": "instructions",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "sign",
      "match": "letreros?|signs?",
      "title": "Indicación del letrero",
      "data": "la indicación del letrero para la situación en que aparece",
      "production": "Comunica en inglés la indicación del letrero de forma breve y comprensible para el destinatario.",
      "error": "confunde una indicación con su prohibición o comunica una acción diferente",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "notice",
      "match": "avisos?|notices?",
      "title": "Información del aviso",
      "data": "la información del aviso que permite comprender lo comunicado",
      "production": "Comunica en inglés la información del aviso necesaria para reconocer la situación anunciada.",
      "error": "cambia lo anunciado o a quién se dirige el aviso",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poster",
      "match": "afiches?|carteles?|posters?",
      "title": "Mensaje del afiche",
      "data": "el mensaje central del afiche y la información solicitada",
      "production": "Dispone en inglés el mensaje central del afiche de forma legible y relacionada con su propósito comunicativo.",
      "error": "el mensaje dispuesto comunica un propósito diferente del solicitado",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "message",
      "match": "mensajes?|messages?",
      "title": "Propósito del mensaje",
      "data": "el propósito del mensaje y los datos solicitados para comprenderlo",
      "production": "Comunica en inglés las ideas necesarias para cumplir el propósito del mensaje en la situación acordada.",
      "error": "el contenido cambia la intención o el destinatario del mensaje",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "email",
      "match": "correos?(?: electronicos?)?|e mails?|emails?",
      "title": "Comunicación por correo electrónico",
      "data": "el destinatario y propósito del correo y su información solicitada",
      "production": "Relaciona el destinatario y propósito del correo con un cuerpo breve en inglés que permite comprender lo comunicado.",
      "error": "dirige a otra persona información que no corresponde al propósito del correo",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "cv",
      "match": "curriculum vitae|curriculum|cv",
      "title": "Perfil del currículum vitae",
      "data": "los datos de perfil solicitados en el currículum vitae",
      "production": "Organiza en inglés los datos de perfil solicitados de una persona real o ficticia para el currículum vitae acordado.",
      "error": "atribuye datos de perfil a otra persona o los ubica en un apartado diferente",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "letter",
      "match": "cartas?|letters?",
      "title": "Comunicación de la carta",
      "data": "el destinatario y propósito de la carta y la información solicitada",
      "production": "Relaciona el destinatario y propósito de la carta con un mensaje breve en inglés que permite comprender lo comunicado.",
      "error": "el mensaje se dirige a un destinatario o propósito diferente del acordado",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "form",
      "match": "formularios?|forms?",
      "title": "Información del formulario",
      "data": "los campos solicitados del formulario y los datos que contienen o requieren",
      "production": "Completa en inglés los campos solicitados con datos pertinentes de la persona o situación real o ficticia indicada.",
      "error": "sitúa los datos en campos que piden una información diferente",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "forecast",
      "match": "pronosticos? del tiempo|weather forecasts?",
      "title": "Información del pronóstico",
      "data": "las condiciones atmosféricas y sus referencias solicitadas en el pronóstico",
      "production": "Comunica en inglés las condiciones atmosféricas del pronóstico y las referencias solicitadas.",
      "error": "atribuye al pronóstico condiciones diferentes de las indicadas",
      "existingFunction": "weather",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "news",
      "match": "noticias?|news",
      "title": "Información de la noticia",
      "data": "el suceso comunicado y los datos solicitados de la noticia",
      "production": "Comunica en inglés el suceso comunicado y los datos necesarios para reconocer qué ocurrió en la noticia.",
      "error": "cambia el suceso o atribuye sus datos a otro acontecimiento",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "schedule",
      "match": "horarios?|timetables?",
      "title": "Actividad y momento del horario",
      "data": "la actividad y momento que corresponden a la consulta del horario",
      "production": "Relaciona en inglés cada actividad y momento solicitado para que el horario pueda consultarse.",
      "error": "asigna a la actividad un momento diferente del indicado",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "agenda",
      "match": "agendas?",
      "title": "Compromisos de la agenda",
      "data": "los compromisos y sus referencias temporales solicitadas en la agenda",
      "production": "Relaciona en inglés los compromisos con las referencias temporales necesarias para consultar la agenda.",
      "error": "cambia la correspondencia entre el compromiso y su momento",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "map",
      "match": "croquis|mapas?|maps?",
      "title": "Referencias del croquis",
      "data": "las ubicaciones y referencias del croquis necesarias para responder a la consulta",
      "production": "Relaciona las ubicaciones y referencias del croquis con las indicaciones en inglés solicitadas.",
      "error": "invierte una ubicación o referencia y cambia el recorrido consultado",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "questionnaire",
      "match": "cuestionarios?|questionnaires?",
      "title": "Información buscada por las preguntas",
      "data": "la información buscada por las preguntas del cuestionario",
      "production": "Formula en inglés preguntas comprensibles que permiten obtener la información buscada en la situación acordada.",
      "error": "formula o interpreta preguntas que buscan información distinta de la solicitada",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "brochure",
      "match": "folletos?|brochures?",
      "title": "Información del folleto",
      "data": "la información del folleto pertinente para la consulta solicitada",
      "production": "Dispone en inglés la información del folleto de modo que el destinatario pueda encontrar los datos solicitados.",
      "error": "la organización o los datos del folleto conducen a información diferente de la solicitada",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "song",
      "match": "cancion(?:es)?|songs?",
      "title": "Mensaje de la canción",
      "data": "el mensaje de la canción expresado por las palabras solicitadas",
      "production": "Comunica el mensaje de la canción en inglés con palabras y expresiones comprensibles mediante la interpretación acordada.",
      "error": "cambia palabras o relaciones que alteran el sentido del mensaje de la canción",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poem",
      "match": "poesias?|poemas?|poems?",
      "title": "Sentido de los versos",
      "data": "el sentido de los versos y las expresiones solicitadas de la poesía",
      "production": "Comunica en inglés el sentido de los versos mediante las expresiones de la producción acordada.",
      "error": "atribuye a los versos un sentido incompatible con sus palabras",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "comic",
      "match": "historietas?|comics?",
      "title": "Secuencia de la historieta",
      "data": "la relación entre las viñetas y los mensajes de la historieta",
      "production": "Relaciona en inglés los mensajes con las viñetas para que la secuencia de la historieta resulte comprensible.",
      "error": "invierte la secuencia o atribuye a una viñeta un mensaje diferente",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "tourist-guide",
      "match": "guias? turisticas?|tourist guides?",
      "title": "Orientaciones de la guía turística",
      "data": "los lugares y orientaciones de la guía pertinentes para la consulta",
      "production": "Comunica en inglés los lugares y orientaciones de la guía que permiten atender la consulta acordada.",
      "error": "confunde los lugares o las orientaciones y conduce a información diferente",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "description",
      "match": "descripcion(?:es)?|descriptions?",
      "title": "Características de lo descrito",
      "data": "las características solicitadas y el referente descrito",
      "production": "Relaciona en inglés las características solicitadas con la persona, lugar u objeto descrito.",
      "error": "atribuye las características a un referente distinto",
      "existingFunction": "description",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "biography",
      "match": "biografias?|biographies",
      "title": "Acontecimientos de la biografía",
      "data": "los acontecimientos de la vida de la persona y sus relaciones solicitadas",
      "production": "Comunica en inglés los acontecimientos de la vida de la persona real o ficticia indicada con relaciones comprensibles.",
      "error": "atribuye los acontecimientos a otra persona o cambia su relación",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "narrative",
      "match": "narracion(?:es)?|relatos?|narratives?",
      "title": "Acontecimientos de la narración",
      "data": "los acontecimientos y personajes presentes en la narración y las relaciones solicitadas",
      "production": "Relaciona en inglés los acontecimientos y personajes, cuando corresponda, para que la narración real o ficticia se comprenda.",
      "error": "cambia los acontecimientos o sus relaciones y altera la narración",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "menu",
      "match": "menus?|menus en ingles",
      "title": "Información consultada del menú",
      "data": "los productos y la información solicitada del menú",
      "production": "",
      "error": "atribuye a un producto información de otro elemento del menú",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "monologue",
      "match": "monologos?|monologues?",
      "title": "Ideas del monólogo",
      "data": "las ideas relacionadas con el asunto del monólogo",
      "production": "Comunica en inglés las ideas del monólogo solicitado mediante oraciones básicas enlazadas que permiten seguir el asunto.",
      "error": "las relaciones entre las ideas cambian el sentido del asunto comunicado",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "audiovisual",
      "match": "produccion(?:es)? audiovisual(?:es)?|videos?",
      "title": "Mensaje de la producción audiovisual",
      "data": "la relación entre los recursos seleccionados y el mensaje audiovisual",
      "production": "Relaciona los recursos seleccionados con un mensaje en inglés comprensible para el destinatario acordado.",
      "error": "los recursos comunican ideas incompatibles con el mensaje solicitado",
      "modes": [
        "audiovisual"
      ],
      "source": "EXPLICIT_TASK"
    }
  ],
  "englishGradeTwoLexicon": [
    {
      "id": "food",
      "match": "\\b(?:(?<!preparacion de )alimentos|comidas y bebidas|food)\\b",
      "name": "alimentos",
      "function": "identificar la comida o bebida mencionada",
      "error": "atribuye al alimento un nombre que corresponde a otro producto",
      "category": "vocabulary"
    },
    {
      "id": "celebrations",
      "match": "\\b(?:celebraciones|celebrations)\\b",
      "name": "celebraciones",
      "function": "nombrar la celebración mencionada",
      "error": "confunde la celebración con otro acontecimiento",
      "category": "vocabulary"
    },
    {
      "id": "weather-words",
      "match": "\\b(?:condiciones atmosfericas|weather conditions)\\b",
      "name": "condiciones atmosféricas",
      "function": "nombrar el estado del tiempo indicado",
      "error": "confunde el estado del tiempo comunicado",
      "category": "vocabulary"
    },
    {
      "id": "sports",
      "match": "\\b(?:deportes|sports)\\b",
      "name": "deportes",
      "function": "nombrar la práctica deportiva indicada",
      "error": "nombra un deporte distinto del solicitado",
      "category": "vocabulary"
    },
    {
      "id": "transport",
      "match": "\\b(?:medios de transporte|means of transport)\\b",
      "name": "medios de transporte",
      "function": "nombrar el medio de desplazamiento solicitado",
      "error": "cambia el medio de transporte indicado",
      "category": "vocabulary"
    },
    {
      "id": "cardinal",
      "match": "\\b(?:numeros cardinales|cardinal numbers)\\b",
      "name": "números cardinales",
      "function": "expresar la cantidad solicitada",
      "error": "comunica una cantidad diferente de la indicada",
      "category": "vocabulary"
    },
    {
      "id": "ordinal",
      "match": "\\b(?:numeros ordinales|ordinal numbers)\\b",
      "name": "números ordinales",
      "function": "expresar la posición en una serie",
      "error": "cambia la posición del elemento en la serie",
      "category": "vocabulary"
    },
    {
      "id": "jobs",
      "match": "\\b(?:ocupaciones|profesiones|occupations|jobs)\\b",
      "name": "ocupaciones",
      "function": "nombrar la ocupación mencionada",
      "error": "atribuye a la persona una ocupación distinta",
      "category": "vocabulary"
    },
    {
      "id": "body",
      "match": "\\b(?:partes del cuerpo|body parts)\\b",
      "name": "partes del cuerpo",
      "function": "identificar la parte corporal indicada",
      "error": "señala una parte corporal distinta de la nombrada",
      "category": "vocabulary"
    },
    {
      "id": "compass",
      "match": "\\b(?:puntos cardinales|cardinal directions)\\b",
      "name": "puntos cardinales",
      "function": "comunicar la orientación espacial indicada",
      "error": "invierte la dirección espacial que se desea comunicar",
      "category": "vocabulary"
    },
    {
      "id": "excuse",
      "match": "\\b(?:excusarse|disculparse|apologizing)\\b",
      "name": "excusarse",
      "function": "expresar una disculpa relacionada con la situación",
      "error": "la expresión no permite reconocer la disculpa solicitada",
      "category": "expression"
    },
    {
      "id": "dates",
      "match": "\\b(?:indicar fechas|expresar fechas|giving dates)\\b",
      "name": "indicar fechas",
      "function": "comunicar la fecha indicada",
      "error": "cambia el día, mes o año solicitado",
      "category": "expression"
    },
    {
      "id": "hours",
      "match": "\\b(?:indicar la hora|expresar la hora|telling the time)\\b",
      "name": "indicar la hora",
      "function": "comunicar la hora indicada",
      "error": "cambia la hora a la que se refiere el mensaje",
      "category": "expression"
    },
    {
      "id": "daily",
      "match": "\\b(?:actividades de la vida diaria|actividades (?:diarias|cotidianas)|daily activities)\\b",
      "name": "actividades de la vida diaria",
      "function": "nombrar la acción cotidiana del referente",
      "error": "confunde la acción de la jornada comunicada",
      "category": "vocabulary"
    },
    {
      "id": "leisure",
      "match": "\\b(?:actividades de tiempo libre(?: y ocio)?|actividades de ocio|leisure activities)\\b",
      "name": "actividades de tiempo libre y ocio",
      "function": "nombrar la actividad de ocio indicada",
      "error": "cambia la actividad recreativa mencionada",
      "category": "vocabulary"
    },
    {
      "id": "subjects",
      "match": "\\b(?:asignaturas|school subjects)\\b",
      "name": "asignaturas",
      "function": "identificar la asignatura mencionada",
      "error": "atribuye a la asignatura un nombre de otra materia",
      "category": "vocabulary"
    },
    {
      "id": "money",
      "match": "\\b(?:dinero|money)\\b",
      "name": "dinero",
      "function": "comunicar la moneda o forma de pago indicada en la situación",
      "error": "confunde la moneda, el cambio o el medio de pago mencionado",
      "category": "vocabulary"
    },
    {
      "id": "ailments",
      "match": "\\b(?:dolencias(?: y enfermedades)?|enfermedades|ailments|illnesses)\\b",
      "name": "dolencias y enfermedades",
      "function": "nombrar la dolencia del personaje o situación suministrada",
      "error": "atribuye a la situación una dolencia distinta de la mencionada",
      "category": "vocabulary"
    },
    {
      "id": "education",
      "match": "\\b(?:educacion|education)\\b",
      "name": "educación",
      "function": "nombrar el nivel o contexto educativo indicado",
      "error": "cambia el nivel o contexto educativo del mensaje",
      "category": "vocabulary"
    },
    {
      "id": "shops",
      "match": "\\b(?:establecimientos comerciales|tiendas|shops)\\b",
      "name": "establecimientos comerciales",
      "function": "identificar el comercio nombrado",
      "error": "confunde el establecimiento con otro tipo de comercio",
      "category": "vocabulary"
    },
    {
      "id": "moods",
      "match": "\\b(?:estados de animo|moods)\\b",
      "name": "estados de ánimo",
      "function": "nombrar el estado del personaje o referente descrito",
      "error": "atribuye al referente un estado diferente del mensaje",
      "category": "vocabulary"
    },
    {
      "id": "life-events",
      "match": "\\b(?:eventos de la vida|life events)\\b",
      "name": "eventos de la vida",
      "function": "nombrar el acontecimiento del personaje o relato dado",
      "error": "cambia el acontecimiento mencionado en el relato",
      "category": "vocabulary"
    },
    {
      "id": "interaction-channels",
      "match": "\\b(?:formas de interaccion|canales de interaccion|interaction channels)\\b",
      "name": "formas de interacción",
      "function": "identificar el canal por el que se comunica el mensaje",
      "error": "confunde el canal escrito, de voz u otro canal indicado",
      "category": "vocabulary"
    },
    {
      "id": "places",
      "match": "\\b(?:lugares|places)\\b",
      "name": "lugares",
      "function": "nombrar el lugar indicado en el mensaje",
      "error": "sitúa el referente en un lugar diferente del comunicado",
      "category": "vocabulary"
    },
    {
      "id": "medicines",
      "match": "\\b(?:medicamentos|medicines)\\b",
      "name": "medicamentos",
      "function": "reconocer el nombre del producto mencionado en la situación dada",
      "error": "confunde el producto nombrado con otro medicamento",
      "category": "vocabulary"
    },
    {
      "id": "relationships",
      "match": "\\b(?:relaciones humanas|human relationships)\\b",
      "name": "relaciones humanas",
      "function": "comunicar la relación entre los personajes o referentes dados",
      "error": "atribuye entre los referentes una relación distinta",
      "category": "vocabulary"
    },
    {
      "id": "physical-sensations",
      "match": "\\b(?:sensaciones fisicas|physical sensations)\\b",
      "name": "sensaciones físicas",
      "function": "nombrar la sensación del personaje o situación dada",
      "error": "confunde la sensación que expresa el mensaje",
      "category": "vocabulary"
    },
    {
      "id": "sizes",
      "match": "\\b(?:tallas|sizes)\\b",
      "name": "tallas",
      "function": "precisar la talla del producto indicado",
      "error": "comunica una talla distinta de la solicitada",
      "category": "vocabulary"
    },
    {
      "id": "technology",
      "match": "\\b(?:tecnologia|technology)\\b",
      "name": "tecnología",
      "function": "nombrar el dispositivo o servicio tecnológico del mensaje",
      "error": "confunde el dispositivo o servicio con otro referente",
      "category": "vocabulary"
    },
    {
      "id": "roads",
      "match": "\\b(?:vias|vias de circulacion|roads)\\b",
      "name": "vías",
      "function": "nombrar la vía de circulación indicada",
      "error": "confunde calle, avenida u otra vía del recorrido",
      "category": "vocabulary"
    },
    {
      "id": "courtesy",
      "match": "\\b(?:mostrar cortesia|expresiones de cortesia|formulas de cortesia)\\b",
      "name": "mostrar cortesía",
      "function": "comunicar el trato cortés en la situación indicada",
      "error": "la fórmula elegida cambia la intención de agradecimiento o trato solicitado",
      "category": "expression"
    },
    {
      "id": "attention",
      "match": "\\b(?:captar la atencion|atraer la atencion|llamar la atencion)\\b",
      "name": "captar la atención",
      "function": "llamar al interlocutor antes de comunicarle el mensaje",
      "error": "no permite reconocer a quién se llama en el intercambio",
      "category": "expression"
    },
    {
      "id": "interruption",
      "match": "\\b(?:interrumpir (?:con cortesia|cortesmente)|interrupcion cortes)\\b",
      "name": "interrumpir con cortesía",
      "function": "solicitar una interrupción relacionada con el intercambio",
      "error": "la fórmula cambia la solicitud por una intervención ajena al intercambio",
      "category": "expression"
    },
    {
      "id": "turns",
      "match": "\\b(?:pedir y dar la palabra|pedir la palabra|dar la palabra|tomar el turno|ceder el turno)\\b",
      "name": "pedir o dar la palabra según lo solicitado",
      "function": "regular el turno de intervención",
      "error": "pide tomar el turno cuando corresponde cederlo o lo contrario",
      "category": "expression"
    },
    {
      "id": "repetition",
      "match": "\\b(?:pedir que repitan|pedir repeticion|solicitar repeticion)\\b",
      "name": "pedir que repitan",
      "function": "solicitar repetición de la información que necesita aclaración",
      "error": "la solicitud no permite reconocer qué información se pide repetir",
      "category": "expression"
    },
    {
      "id": "uncertainty",
      "match": "\\b(?:expresar duda|dudar|uncertainty)\\b",
      "name": "expresar duda",
      "function": "distinguir una posibilidad de una afirmación confirmada",
      "error": "comunica como seguro lo que el referente considera dudoso",
      "category": "expression"
    },
    {
      "id": "empathy",
      "match": "\\b(?:mostrar interes(?: o empatia)?|mostrar empatia|expresiones de empatia)\\b",
      "name": "mostrar interés o empatía",
      "function": "responder a la situación comunicada con una expresión de interés o apoyo",
      "error": "la respuesta se refiere a otro asunto y no reconoce la situación comunicada",
      "category": "expression"
    },
    {
      "id": "indifference",
      "match": "\\b(?:mostrar indiferencia(?: o desinteres)?|mostrar desinteres)\\b",
      "name": "mostrar indiferencia o desinterés",
      "function": "expresar que la elección no modifica la preferencia comunicada",
      "error": "expresa interés o rechazo cuando pretende comunicar indiferencia",
      "category": "expression"
    },
    {
      "id": "agreement",
      "match": "\\b(?:mostrar acuerdo(?: y desacuerdo)?|mostrar desacuerdo|expresar acuerdo|expresar desacuerdo)\\b",
      "name": "mostrar acuerdo o desacuerdo según lo solicitado",
      "function": "comunicar su respuesta a la idea del interlocutor",
      "error": "expresa lo contrario del acuerdo o desacuerdo que pretende comunicar",
      "category": "expression"
    },
    {
      "id": "desire",
      "match": "\\b(?:expresar deseos|expresiones de deseos)\\b",
      "name": "expresar deseos",
      "function": "comunicar la esperanza o el deseo indicado en la situación",
      "error": "presenta como confirmado el resultado que solo se desea",
      "category": "expression"
    }
  ],
  "englishGradeThreeGenres": [
    {
      "id": "conversation",
      "match": "conversacion(?:es)?|dialogos?",
      "title": "Intercambio de la conversación",
      "data": "la relación entre las intervenciones de los interlocutores",
      "production": "Relaciona sus intervenciones en inglés con las de los interlocutores para mantener el intercambio acordado.",
      "error": "confunde quién interviene o a qué intervención responde",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "business-card",
      "match": "tarjetas? de presentacion|business cards?",
      "title": "Datos de la tarjeta de presentación",
      "data": "los datos de identificación y contacto solicitados de la tarjeta",
      "production": "Dispone en inglés los datos de identificación y contacto solicitados de la persona o personaje indicado.",
      "error": "atribuye los datos de la tarjeta a un referente diferente",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "list",
      "match": "listas?(?! (?:de cotejo|ponderadas?|de verificacion|de control|de observacion))",
      "title": "Elementos de la lista",
      "data": "los elementos de la lista que corresponden a la búsqueda solicitada",
      "production": "Presenta en inglés los elementos de la lista pertinentes para la finalidad indicada.",
      "error": "incorpora elementos ajenos a la categoría o finalidad de la lista",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "advertisement",
      "match": "anuncios?|advertisements?",
      "title": "Producto o servicio anunciado",
      "data": "el producto o servicio y la información solicitada del anuncio",
      "production": "Comunica en inglés el producto o servicio anunciado y la información necesaria para el destinatario acordado.",
      "error": "atribuye al producto o servicio características diferentes de las comunicadas",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "recipe",
      "match": "recetas?|recipes?",
      "title": "Acciones de la receta",
      "data": "las acciones de preparación y su orden en la receta",
      "production": "Comunica en inglés las acciones de preparación de la receta en un orden que permite seguir las instrucciones.",
      "error": "invierte o cambia acciones de preparación y altera las instrucciones",
      "existingFunction": "instructions",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "sign",
      "match": "letreros?|signs?",
      "title": "Indicación del letrero",
      "data": "la indicación del letrero para la situación en que aparece",
      "production": "Comunica en inglés la indicación del letrero de forma breve y comprensible para el destinatario.",
      "error": "confunde una indicación con su prohibición o comunica una acción diferente",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "notice",
      "match": "avisos?|notices?",
      "title": "Información del aviso",
      "data": "la información del aviso que permite comprender lo comunicado",
      "production": "Comunica en inglés la información del aviso necesaria para reconocer la situación anunciada.",
      "error": "cambia lo anunciado o a quién se dirige el aviso",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poster",
      "match": "afiches?|carteles?|posters?",
      "title": "Mensaje del afiche",
      "data": "el mensaje central del afiche y la información solicitada",
      "production": "Dispone en inglés el mensaje central del afiche de forma legible y relacionada con su propósito comunicativo.",
      "error": "el mensaje dispuesto comunica un propósito diferente del solicitado",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "message",
      "match": "mensajes?|messages?",
      "title": "Propósito del mensaje",
      "data": "el propósito del mensaje y los datos solicitados para comprenderlo",
      "production": "Comunica en inglés las ideas necesarias para cumplir el propósito del mensaje en la situación acordada.",
      "error": "el contenido cambia la intención o el destinatario del mensaje",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "email",
      "match": "correos?(?: electronicos?)?|e mails?|emails?",
      "title": "Comunicación por correo electrónico",
      "data": "el destinatario y propósito del correo y su información solicitada",
      "production": "Relaciona el destinatario y propósito del correo con un cuerpo breve en inglés que permite comprender lo comunicado.",
      "error": "dirige a otra persona información que no corresponde al propósito del correo",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "cv",
      "match": "curriculum vitae|curriculum|cv",
      "title": "Perfil del currículum vitae",
      "data": "los datos de perfil solicitados en el currículum vitae",
      "production": "Organiza en inglés los datos de perfil solicitados de una persona real o ficticia para el currículum vitae acordado.",
      "error": "atribuye datos de perfil a otra persona o los ubica en un apartado diferente",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "letter",
      "match": "cartas?|letters?",
      "title": "Comunicación de la carta",
      "data": "el destinatario y propósito de la carta y la información solicitada",
      "production": "Relaciona el destinatario y propósito de la carta con un mensaje breve en inglés que permite comprender lo comunicado.",
      "error": "el mensaje se dirige a un destinatario o propósito diferente del acordado",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "form",
      "match": "formularios?|forms?",
      "title": "Información del formulario",
      "data": "los campos solicitados del formulario y los datos que contienen o requieren",
      "production": "Completa en inglés los campos solicitados con datos pertinentes de la persona o situación real o ficticia indicada.",
      "error": "sitúa los datos en campos que piden una información diferente",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "forecast",
      "match": "pronosticos? del tiempo|weather forecasts?",
      "title": "Información del pronóstico",
      "data": "las condiciones atmosféricas y sus referencias solicitadas en el pronóstico",
      "production": "Comunica en inglés las condiciones atmosféricas del pronóstico y las referencias solicitadas.",
      "error": "atribuye al pronóstico condiciones diferentes de las indicadas",
      "existingFunction": "weather",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "news",
      "match": "noticias?|news",
      "title": "Información de la noticia",
      "data": "el suceso comunicado y los datos solicitados de la noticia",
      "production": "Comunica en inglés el suceso comunicado y los datos necesarios para reconocer qué ocurrió en la noticia.",
      "error": "cambia el suceso o atribuye sus datos a otro acontecimiento",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "schedule",
      "match": "horarios?|timetables?",
      "title": "Actividad y momento del horario",
      "data": "la actividad y momento que corresponden a la consulta del horario",
      "production": "Relaciona en inglés cada actividad y momento solicitado para que el horario pueda consultarse.",
      "error": "asigna a la actividad un momento diferente del indicado",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "agenda",
      "match": "agendas?",
      "title": "Compromisos de la agenda",
      "data": "los compromisos y sus referencias temporales solicitadas en la agenda",
      "production": "Relaciona en inglés los compromisos con las referencias temporales necesarias para consultar la agenda.",
      "error": "cambia la correspondencia entre el compromiso y su momento",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "map",
      "match": "croquis|mapas?|maps?",
      "title": "Referencias del croquis",
      "data": "las ubicaciones y referencias del croquis necesarias para responder a la consulta",
      "production": "Relaciona las ubicaciones y referencias del croquis con las indicaciones en inglés solicitadas.",
      "error": "invierte una ubicación o referencia y cambia el recorrido consultado",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "questionnaire",
      "match": "cuestionarios?|questionnaires?",
      "title": "Información buscada por las preguntas",
      "data": "la información buscada por las preguntas del cuestionario",
      "production": "Formula en inglés preguntas comprensibles que permiten obtener la información buscada en la situación acordada.",
      "error": "formula o interpreta preguntas que buscan información distinta de la solicitada",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "brochure",
      "match": "folletos?|brochures?",
      "title": "Información del folleto",
      "data": "la información del folleto pertinente para la consulta solicitada",
      "production": "Dispone en inglés la información del folleto de modo que el destinatario pueda encontrar los datos solicitados.",
      "error": "la organización o los datos del folleto conducen a información diferente de la solicitada",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "song",
      "match": "cancion(?:es)?|songs?",
      "title": "Mensaje de la canción",
      "data": "el mensaje de la canción expresado por las palabras solicitadas",
      "production": "Comunica el mensaje de la canción en inglés con palabras y expresiones comprensibles mediante la interpretación acordada.",
      "error": "cambia palabras o relaciones que alteran el sentido del mensaje de la canción",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poem",
      "match": "poesias?|poemas?|poems?",
      "title": "Sentido de los versos",
      "data": "el sentido de los versos y las expresiones solicitadas de la poesía",
      "production": "Comunica en inglés el sentido de los versos mediante las expresiones de la producción acordada.",
      "error": "atribuye a los versos un sentido incompatible con sus palabras",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "comic",
      "match": "historietas?|comics?",
      "title": "Secuencia de la historieta",
      "data": "la relación entre las viñetas y los mensajes de la historieta",
      "production": "Relaciona en inglés los mensajes con las viñetas para que la secuencia de la historieta resulte comprensible.",
      "error": "invierte la secuencia o atribuye a una viñeta un mensaje diferente",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "tourist-guide",
      "match": "guias? turisticas?|tourist guides?",
      "title": "Orientaciones de la guía turística",
      "data": "los lugares y orientaciones de la guía pertinentes para la consulta",
      "production": "Comunica en inglés los lugares y orientaciones de la guía que permiten atender la consulta acordada.",
      "error": "confunde los lugares o las orientaciones y conduce a información diferente",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "description",
      "match": "descripcion(?:es)?|descriptions?",
      "title": "Características de lo descrito",
      "data": "las características solicitadas y el referente descrito",
      "production": "Relaciona en inglés las características solicitadas con la persona, lugar u objeto descrito.",
      "error": "atribuye las características a un referente distinto",
      "existingFunction": "description",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "biography",
      "match": "biografias?|biographies",
      "title": "Acontecimientos de la biografía",
      "data": "los acontecimientos de la vida de la persona y sus relaciones solicitadas",
      "production": "Comunica en inglés los acontecimientos de la vida de la persona real o ficticia indicada con relaciones comprensibles.",
      "error": "atribuye los acontecimientos a otra persona o cambia su relación",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "narrative",
      "match": "narracion(?:es)?|relatos?|narratives?",
      "title": "Acontecimientos de la narración",
      "data": "los acontecimientos y personajes presentes en la narración y las relaciones solicitadas",
      "production": "Relaciona en inglés los acontecimientos y personajes, cuando corresponda, para que la narración real o ficticia se comprenda.",
      "error": "cambia los acontecimientos o sus relaciones y altera la narración",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "menu",
      "match": "menus?|menus en ingles",
      "title": "Información consultada del menú",
      "data": "los productos y la información solicitada del menú",
      "production": "",
      "error": "atribuye a un producto información de otro elemento del menú",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "monologue",
      "match": "monologos?|monologues?",
      "title": "Ideas del monólogo",
      "data": "las ideas relacionadas con el asunto del monólogo",
      "production": "Comunica en inglés las ideas del monólogo solicitado mediante oraciones básicas enlazadas que permiten seguir el asunto.",
      "error": "las relaciones entre las ideas cambian el sentido del asunto comunicado",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "audiovisual",
      "match": "produccion(?:es)? audiovisual(?:es)?|videos?",
      "title": "Mensaje de la producción audiovisual",
      "data": "la relación entre los recursos seleccionados y el mensaje audiovisual",
      "production": "Relaciona los recursos seleccionados con un mensaje en inglés comprensible para el destinatario acordado.",
      "error": "los recursos comunican ideas incompatibles con el mensaje solicitado",
      "modes": [
        "audiovisual"
      ],
      "source": "EXPLICIT_TASK"
    }
  ],
  "englishGradeThreeModule": {
    "id": "ingles-comunicacion-3",
    "grade": 3,
    "subjectCode": "ING",
    "pdfPages": [
      146,
      147,
      148,
      149,
      150,
      151
    ],
    "policy": "COMMON_THIRD_GRADE_FUNCTIONS_GRAMMAR_LEXICON_STRATEGIES_GENRES_CONTEXT_COMPOSITION_V2"
  },
  "englishGradeThreeGrammar": [
    {
      "id": "past-simple",
      "match": "\\b(?:pasado simple|simple past|past simple)\\b",
      "name": "el pasado simple",
      "function": "situar hechos o experiencias terminados en el pasado",
      "error": "presenta como actual un hecho situado en el pasado o cambia quién lo realizó"
    },
    {
      "id": "question-tags",
      "match": "\\b(?:question tags?)\\b",
      "name": "las question tags",
      "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada",
      "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación"
    },
    {
      "id": "comparative",
      "match": "\\b(?:comparativos?|comparative|superlativos?|superlative)\\b",
      "name": "el grado comparativo o superlativo solicitado",
      "function": "establecer una comparación o destacar un elemento dentro de un conjunto",
      "error": "confunde la relación entre dos elementos con la selección de uno dentro de un conjunto",
      "terms": [
        [
          "\\bcomparativos?\\b|\\bcomparative\\b",
          "el grado comparativo"
        ],
        [
          "\\bsuperlativos?\\b|\\bsuperlative\\b",
          "el grado superlativo"
        ]
      ]
    },
    {
      "id": "interrogative-pronouns",
      "match": "\\b(?:pronombres? interrogativos?|interrogative pronouns?)\\b",
      "name": "los pronombres interrogativos",
      "function": "preguntar por la persona, cosa o lugar que se necesita conocer",
      "error": "pregunta por una información distinta de la que se quiere solicitar"
    },
    {
      "id": "object-pronouns",
      "match": "\\b(?:pronombres? objeto|object pronouns?)\\b",
      "name": "los pronombres objeto",
      "function": "señalar a quién se dirige o afecta la acción",
      "error": "atribuye la acción al receptor equivocado"
    },
    {
      "id": "time-prepositions",
      "match": "\\b(?:preposiciones? de tiempo|prepositions? of time)\\b",
      "name": "las preposiciones de tiempo",
      "function": "situar el hecho en la hora, fecha o período indicado",
      "error": "sitúa el hecho en una referencia temporal diferente"
    },
    {
      "id": "place-prepositions",
      "match": "\\b(?:preposiciones? de lugar|prepositions? of place)\\b",
      "name": "las preposiciones de lugar",
      "function": "situar un elemento respecto a otro en el espacio",
      "error": "cambia la relación espacial entre los elementos"
    },
    {
      "id": "time-adverbs",
      "match": "\\b(?:adverbios? de tiempo|adverbs? of time)\\b",
      "name": "los adverbios de tiempo",
      "function": "indicar cuándo ocurre la acción",
      "error": "desplaza la acción a un momento distinto del indicado"
    },
    {
      "id": "manner-adverbs",
      "match": "\\b(?:adverbios? de modo|adverbs? of manner)\\b",
      "name": "los adverbios de modo",
      "function": "precisar cómo se realiza una acción",
      "error": "altera la manera en que se realiza la acción descrita"
    },
    {
      "id": "certainty-adverbs",
      "match": "\\b(?:adverbios? de certeza|adverbs? of certainty)\\b",
      "name": "los adverbios de certeza",
      "function": "expresar el grado de seguridad de una afirmación",
      "error": "presenta una posibilidad como una certeza o una certeza como una duda"
    },
    {
      "id": "coordination-connectors",
      "match": "\\b(?:conectores? de coordinacion|coordinating conjunctions?)\\b",
      "name": "los conectores de coordinación",
      "function": "unir, contrastar o presentar alternativas entre ideas",
      "error": "confunde suma, contraste y alternativa entre las ideas"
    },
    {
      "id": "time-connectors",
      "match": "\\b(?:conectores? de tiempo|temporal connectors?)\\b",
      "name": "los conectores de tiempo",
      "function": "relacionar los momentos en que ocurren las acciones",
      "error": "invierte la relación de anterioridad o posterioridad de las acciones"
    },
    {
      "id": "sequence-connectors",
      "match": "\\b(?:conectores? de secuencia|sequence connectors?)\\b",
      "name": "los conectores de secuencia",
      "function": "ordenar pasos o acontecimientos",
      "error": "cambia el orden necesario para seguir los pasos o acontecimientos"
    },
    {
      "id": "cause-connectors",
      "match": "\\b(?:conectores? de causa(?: y consecuencia|lidad)?|conectores? de consecuencia|cause and effect connectors?)\\b",
      "name": "los conectores de causa y consecuencia",
      "function": "relacionar un hecho con su causa o su consecuencia",
      "error": "invierte o confunde la causa y la consecuencia de los hechos"
    },
    {
      "id": "past-continuous",
      "match": "\\b(?:pasado continuo|past continuous)\\b",
      "name": "el pasado continuo",
      "function": "situar la acción que estaba en desarrollo como contexto de un acontecimiento pasado",
      "error": "confunde la acción en curso con el acontecimiento que la interrumpe"
    },
    {
      "id": "present-participle",
      "match": "\\b(?:participio presente|present participle|adjetivos? (?:en|terminados en) ing)\\b",
      "name": "los adjetivos en participio presente",
      "function": "caracterizar el efecto que provoca una situación o actividad",
      "error": "confunde el efecto de la actividad con el estado de quien lo experimenta"
    },
    {
      "id": "past-participle",
      "match": "\\b(?:participio pasado|past participle|adjetivos? (?:en|terminados en) ed)\\b",
      "name": "los adjetivos en participio pasado",
      "function": "describir el estado de la persona o referente",
      "error": "confunde el estado del referente con el efecto que provoca una actividad"
    },
    {
      "id": "reflexive-pronouns",
      "match": "\\b(?:pronombres? reflexivos?|reflexive pronouns?)\\b",
      "name": "los pronombres reflexivos",
      "function": "relacionar una acción con el mismo referente que la realiza",
      "error": "atribuye a otra persona una acción que recae sobre el sujeto"
    },
    {
      "id": "present-simple",
      "match": "\\b(?:presente simple|present simple|simple present)\\b",
      "name": "el presente simple",
      "function": "comunicar una indicación o un punto de vista en la situación solicitada",
      "error": "cambia el referente o el sentido de la indicación o afirmación"
    },
    {
      "id": "present-continuous",
      "match": "\\b(?:presente continuo|present continuous)\\b",
      "name": "el presente continuo",
      "function": "comunicar un anuncio o noticia con la referencia temporal indicada",
      "error": "confunde el acontecimiento anunciado con un hecho terminado"
    },
    {
      "id": "used-to",
      "match": "\\b(?:used to)\\b",
      "name": "used to",
      "function": "contrastar una situación o acción habitual del pasado con su situación presente",
      "error": "presenta como actual el hábito pasado o niega el cambio comunicado"
    },
    {
      "id": "present-perfect",
      "match": "\\b(?:presente perfecto|present perfect)\\b",
      "name": "el presente perfecto",
      "function": "comunicar una noticia o acontecimiento anterior relacionado con el presente",
      "error": "presenta como acción en curso el acontecimiento anterior que se informa"
    },
    {
      "id": "will",
      "match": "\\b(?:will)\\b",
      "name": "will",
      "function": "comunicar una predicción o conclusión sobre el resultado futuro apoyada en la información disponible",
      "error": "presenta como sucedido un resultado futuro o contradice los datos de la predicción"
    },
    {
      "id": "going-to",
      "match": "\\b(?:be going to|going to)\\b",
      "name": "be going to",
      "function": "comunicar una predicción sobre el resultado futuro a partir de los indicios disponibles",
      "error": "expresa un resultado incompatible con los indicios de la predicción"
    },
    {
      "id": "there-be",
      "match": "\\b(?:there be|there (?:is|are|was|were|has been|have been|will be|s going to be))\\b",
      "name": "there + be",
      "function": "indicar existencia en una indicación, anuncio o noticia con el tiempo y número solicitados",
      "error": "cambia la existencia, la cantidad o el momento del acontecimiento comunicado"
    },
    {
      "id": "imperative",
      "match": "\\b(?:imperativos?|imperatives?)\\b",
      "name": "el imperativo",
      "function": "comunicar la acción indicada o prohibida en la situación solicitada",
      "error": "invierte la instrucción y la prohibición o cambia la acción que se comunica"
    },
    {
      "id": "lets",
      "match": "\\b(?:let s)\\b",
      "name": "let’s",
      "function": "proponer una acción compartida en una indicación o sugerencia",
      "error": "la forma cambia la propuesta compartida por una acción diferente"
    },
    {
      "id": "why-suggestion",
      "match": "\\b(?:why don t|why not)\\b",
      "name": "why don’t o why not según lo solicitado",
      "function": "formular una sugerencia de acción al interlocutor",
      "error": "pregunta por una causa cuando debe proponer una acción"
    },
    {
      "id": "modal-can",
      "match": "\\b(?:can)\\b",
      "name": "can",
      "function": "expresar posibilidad o capacidad, o indicar lo permitido según la situación comunicada",
      "error": "confunde lo posible o permitido con lo imposible o prohibido"
    },
    {
      "id": "modal-should",
      "match": "\\b(?:should)\\b",
      "name": "should",
      "function": "expresar una recomendación pertinente para la situación indicada",
      "error": "presenta como obligación absoluta la recomendación solicitada"
    },
    {
      "id": "modal-must",
      "match": "\\b(?:must)\\b",
      "name": "must",
      "function": "expresar necesidad o una conclusión fuertemente apoyada en los indicios, según la situación solicitada",
      "error": "confunde una necesidad con una opción o una deducción con un hecho directamente observado"
    },
    {
      "id": "modal-may",
      "match": "\\b(?:may)\\b",
      "name": "may",
      "function": "expresar una posibilidad que se distingue de una afirmación confirmada",
      "error": "presenta como confirmado lo que la situación solo permite considerar posible"
    },
    {
      "id": "modal-might",
      "match": "\\b(?:might)\\b",
      "name": "might",
      "function": "expresar una posibilidad incierta compatible con los datos de la situación",
      "error": "comunica como seguro un resultado que los datos solo permiten considerar posible"
    },
    {
      "id": "modal-have-to",
      "match": "\\b(?:have to)\\b",
      "name": "have to",
      "function": "expresar la obligación que establece la situación proporcionada",
      "error": "cambia o elimina la obligación indicada por las condiciones de la tarea"
    },
    {
      "id": "modal-need-to",
      "match": "\\b(?:need to)\\b",
      "name": "need to",
      "function": "expresar la necesidad de una acción para la situación proporcionada",
      "error": "atribuye necesidad a una acción diferente de la solicitada"
    },
    {
      "id": "adjective-clauses",
      "match": "\\b(?:clausulas? adjetivas?|adjective clauses?)\\b",
      "name": "las cláusulas adjetivas",
      "function": "precisar el referente mediante información que lo caracteriza o identifica",
      "error": "vincula la caracterización con un referente distinto"
    },
    {
      "id": "noun-clauses",
      "match": "\\b(?:clausulas? sustantivas?|noun clauses?)\\b",
      "name": "las cláusulas sustantivas",
      "function": "integrar una idea o contenido como parte de la afirmación solicitada",
      "error": "la cláusula cambia la idea que se atribuye a la afirmación"
    },
    {
      "id": "conditional",
      "match": "\\b(?:condicional(?:es)?|conditional sentences?)\\b",
      "name": "la oración condicional",
      "function": "relacionar una condición con la información o predicción que depende de ella",
      "error": "presenta el resultado como incondicional o invierte condición y consecuencia"
    },
    {
      "id": "passive-past",
      "match": "\\b(?:voz pasiva (?:del|en) pasado|pasiva del pasado|past passive)\\b",
      "name": "la voz pasiva en pasado",
      "function": "comunicar una acción recibida por un referente en un acontecimiento pasado",
      "error": "atribuye al receptor una acción realizada por otro o cambia el momento pasado"
    },
    {
      "id": "passive-present",
      "match": "\\b(?:voz pasiva (?:del|en) presente|pasiva del presente|present passive)\\b",
      "name": "la voz pasiva en presente",
      "function": "comunicar la acción que recibe el referente en la situación presente",
      "error": "atribuye al receptor la acción que recibe o sitúa como pasada una situación presente"
    },
    {
      "id": "agreement-responses",
      "match": "\\b(?:me too|me neither|so did i|neither do i)\\b",
      "name": "las respuestas de coincidencia o discrepancia solicitadas",
      "function": "comunicar la coincidencia o discrepancia con la afirmación del interlocutor",
      "error": "invierte el acuerdo o desacuerdo o la polaridad de la afirmación"
    },
    {
      "id": "exclamation",
      "match": "\\b(?:oraciones? exclamativas?|exclamaciones?|exclamatory sentences?)\\b",
      "name": "las oraciones exclamativas",
      "function": "expresar una reacción relacionada con el acontecimiento comunicado",
      "error": "la forma comunica una reacción incompatible con el acontecimiento indicado"
    },
    {
      "id": "abstract-nouns",
      "match": "\\b(?:sustantivos? abstractos?|abstract nouns?)\\b",
      "name": "los sustantivos abstractos",
      "function": "nombrar conceptos, estados o ideas de la situación comunicada",
      "error": "atribuye al concepto un significado diferente del mensaje"
    },
    {
      "id": "subject-gerund",
      "match": "\\b(?:gerundio (?:en funcion de|como) sujeto|gerund as subject)\\b",
      "name": "el gerundio en función de sujeto",
      "function": "presentar una actividad como sujeto de la afirmación",
      "error": "la forma deja de referirse a la actividad que funciona como sujeto"
    },
    {
      "id": "zero-article",
      "match": "\\b(?:ausencia del articulo definido|articulo cero|zero article)\\b",
      "name": "la ausencia del artículo definido",
      "function": "referirse a una categoría o idea general sin convertirla en un referente específico",
      "error": "la elección del artículo cambia la referencia general por una específica"
    },
    {
      "id": "relative-pronouns",
      "match": "\\b(?:pronombres? relativos?|relative pronouns?)\\b",
      "name": "los pronombres relativos",
      "function": "enlazar información adicional con el referente al que corresponde",
      "error": "relaciona la información con una persona o elemento distinto"
    },
    {
      "id": "duration-adverbs",
      "match": "\\b(?:(?:adverbios|frases adverbiales) de duracion|adverbs? of duration)\\b",
      "name": "las expresiones adverbiales de duración",
      "function": "comunicar la duración o referencia de continuidad temporal de la situación",
      "error": "confunde la duración con un momento puntual o altera su continuidad"
    },
    {
      "id": "intensity-adverbs",
      "match": "\\b(?:adverbios? de intensidad|adverbs? of intensity)\\b",
      "name": "los adverbios de intensidad",
      "function": "graduar la intensidad de una característica o acción",
      "error": "cambia la intensidad que se pretende expresar"
    },
    {
      "id": "degree-adverbs",
      "match": "\\b(?:adverbios? de grado|adverbs? of degree)\\b",
      "name": "las expresiones adverbiales de grado",
      "function": "precisar la cantidad o grado comunicado en la situación",
      "error": "expresa un grado o cantidad diferente del indicado"
    },
    {
      "id": "purpose-connectors",
      "match": "\\b(?:conectores? de finalidad|purpose connectors?)\\b",
      "name": "los conectores de finalidad",
      "function": "relacionar una acción con la finalidad para la que se realiza",
      "error": "confunde la finalidad con una causa o un resultado ya ocurrido"
    },
    {
      "id": "contrast-connectors",
      "match": "\\b(?:conectores? de contraste|contrast connectors?)\\b",
      "name": "los conectores de contraste",
      "function": "contrastar ideas o puntos de vista relacionados",
      "error": "presenta como equivalentes ideas que deben contrastarse"
    },
    {
      "id": "concession-connectors",
      "match": "\\b(?:conectores? de concesion|concession connectors?)\\b",
      "name": "los conectores de concesión",
      "function": "relacionar una circunstancia con un resultado que ocurre pese a ella",
      "error": "presenta la circunstancia como causa necesaria del resultado o elimina la concesión"
    }
  ],
  "englishGradeThreeLexicon": [
    {
      "id": "celebrations",
      "match": "\\b(?:celebraciones|celebrations)\\b",
      "name": "celebraciones",
      "function": "nombrar la celebración mencionada",
      "error": "confunde la celebración con otro acontecimiento",
      "category": "vocabulary"
    },
    {
      "id": "weather-words",
      "match": "\\b(?:condiciones atmosfericas|weather conditions)\\b",
      "name": "condiciones atmosféricas",
      "function": "nombrar el estado del tiempo indicado",
      "error": "confunde el estado del tiempo comunicado",
      "category": "vocabulary"
    },
    {
      "id": "sports",
      "match": "\\b(?:deportes|sports)\\b",
      "name": "deportes",
      "function": "nombrar la práctica deportiva indicada",
      "error": "nombra un deporte distinto del solicitado",
      "category": "vocabulary"
    },
    {
      "id": "jobs",
      "match": "\\b(?:ocupaciones|profesiones|occupations|jobs)\\b",
      "name": "ocupaciones",
      "function": "nombrar la ocupación mencionada",
      "error": "atribuye a la persona una ocupación distinta",
      "category": "vocabulary"
    },
    {
      "id": "daily",
      "match": "\\b(?:actividades de la vida diaria|actividades (?:diarias|cotidianas)|daily activities)\\b",
      "name": "actividades de la vida diaria",
      "function": "nombrar la acción cotidiana del referente",
      "error": "confunde la acción de la jornada comunicada",
      "category": "vocabulary"
    },
    {
      "id": "leisure",
      "match": "\\b(?:actividades de tiempo libre(?: y ocio)?|actividades de ocio|leisure activities)\\b",
      "name": "actividades de tiempo libre y ocio",
      "function": "nombrar la actividad de ocio indicada",
      "error": "cambia la actividad recreativa mencionada",
      "category": "vocabulary"
    },
    {
      "id": "moods",
      "match": "\\b(?:estados de animo|moods)\\b",
      "name": "estados de ánimo",
      "function": "nombrar el estado del personaje o referente descrito",
      "error": "atribuye al referente un estado diferente del mensaje",
      "category": "vocabulary"
    },
    {
      "id": "places",
      "match": "\\b(?:lugares|places)\\b",
      "name": "lugares",
      "function": "nombrar el lugar indicado en el mensaje",
      "error": "sitúa el referente en un lugar diferente del comunicado",
      "category": "vocabulary"
    },
    {
      "id": "relationships",
      "match": "\\b(?:relaciones humanas|human relationships)\\b",
      "name": "relaciones humanas",
      "function": "comunicar la relación entre los personajes o referentes dados",
      "error": "atribuye entre los referentes una relación distinta",
      "category": "vocabulary"
    },
    {
      "id": "technology",
      "match": "\\b(?:tecnologia|technology)\\b",
      "name": "tecnología",
      "function": "nombrar el dispositivo o servicio tecnológico del mensaje",
      "error": "confunde el dispositivo o servicio con otro referente",
      "category": "vocabulary"
    },
    {
      "id": "school-activities",
      "match": "\\b(?:actividades escolares|school activities)\\b",
      "name": "actividades escolares",
      "function": "nombrar la acción de aprendizaje o trabajo escolar indicada",
      "error": "confunde la actividad escolar con una acción distinta",
      "category": "vocabulary"
    },
    {
      "id": "school",
      "match": "\\b(?:escuela|school vocabulary)\\b",
      "name": "escuela",
      "function": "nombrar el espacio, documento o referente escolar mencionado",
      "error": "confunde un espacio o documento escolar con otro referente",
      "category": "vocabulary"
    },
    {
      "id": "contingencies",
      "match": "\\b(?:eventualidades|contratiempos|contingencies)\\b",
      "name": "eventualidades",
      "function": "nombrar el acontecimiento imprevisto del personaje o situación dada",
      "error": "atribuye al personaje un contratiempo distinto del relato",
      "category": "vocabulary"
    },
    {
      "id": "environment",
      "match": "\\b(?:medio ambiente|medioambiente|environment)\\b",
      "name": "medio ambiente",
      "function": "nombrar el proceso o problema ambiental comunicado en el texto",
      "error": "cambia el proceso o problema ambiental mencionado",
      "category": "vocabulary"
    },
    {
      "id": "media",
      "match": "\\b(?:medios de comunicacion|communication media)\\b",
      "name": "medios de comunicación",
      "function": "identificar el medio por el que se transmite la información indicada",
      "error": "confunde el canal de comunicación mencionado con otro medio",
      "category": "vocabulary"
    },
    {
      "id": "home-objects",
      "match": "\\b(?:objetos del hogar(?: y el entorno)?|household objects)\\b",
      "name": "objetos del hogar y el entorno",
      "function": "nombrar el objeto del lugar o situación proporcionados",
      "error": "atribuye al objeto un nombre o uso diferente del mensaje",
      "category": "vocabulary"
    },
    {
      "id": "social-problems",
      "match": "\\b(?:problematicas sociales|problemas sociales|social problems)\\b",
      "name": "problemáticas sociales",
      "function": "nombrar el problema social de la situación o personajes ficticios",
      "error": "atribuye a la situación un problema distinto del descrito",
      "category": "vocabulary"
    },
    {
      "id": "recipes",
      "match": "\\b(?:recetas de cocina|cooking recipes)\\b",
      "name": "recetas de cocina",
      "function": "nombrar el ingrediente, utensilio o acción culinaria mencionados",
      "error": "confunde la acción o ingrediente de la receta proporcionada",
      "category": "vocabulary"
    },
    {
      "id": "traffic-signs",
      "match": "\\b(?:senales de transito|traffic signs)\\b",
      "name": "señales de tránsito",
      "function": "reconocer la indicación que comunica la señal mencionada",
      "error": "interpreta como permitida una acción que la señal prohíbe o lo contrario",
      "category": "vocabulary"
    },
    {
      "id": "opinion",
      "match": "\\b(?:opinar|expresar opiniones|expresiones de opinion)\\b",
      "name": "opinar",
      "function": "comunicar el punto de vista solicitado distinguiéndolo de un hecho",
      "error": "la expresión atribuye certeza factual a un punto de vista o cambia su sentido",
      "category": "expression"
    },
    {
      "id": "agreement",
      "match": "\\b(?:mostrar acuerdo(?: o desacuerdo)?|mostrar desacuerdo|expresar acuerdo|expresar desacuerdo)\\b",
      "name": "mostrar acuerdo o desacuerdo según lo solicitado",
      "function": "comunicar su posición respecto de lo dicho por el interlocutor",
      "error": "expresa desacuerdo cuando corresponde acuerdo o lo contrario",
      "category": "expression"
    },
    {
      "id": "reaction",
      "match": "\\b(?:reaccionar|expresar una reaccion|expresiones de reaccion)\\b",
      "name": "reaccionar",
      "function": "responder al acontecimiento con la reacción comunicativa solicitada",
      "error": "la fórmula expresa una reacción incompatible con el acontecimiento dado",
      "category": "expression"
    },
    {
      "id": "explanations",
      "match": "\\b(?:solicitar explicaciones|pedir explicaciones)\\b",
      "name": "solicitar explicaciones",
      "function": "pedir el motivo o explicación del hecho indicado",
      "error": "la pregunta solicita información diferente del motivo que se necesita aclarar",
      "category": "expression"
    },
    {
      "id": "warning",
      "match": "\\b(?:advertir|expresiones de advertencia)\\b",
      "name": "advertir",
      "function": "alertar al interlocutor sobre el riesgo indicado en la situación",
      "error": "la expresión no comunica el riesgo o cambia el sentido de la advertencia",
      "category": "expression"
    }
  ],
  "englishGradeFourGenres": [
    {
      "id": "conversation",
      "match": "conversacion(?:es)?|dialogos?",
      "title": "Intercambio de la conversación",
      "data": "la relación entre las intervenciones de los interlocutores",
      "production": "Relaciona sus intervenciones en inglés con las de los interlocutores para mantener el intercambio acordado.",
      "error": "confunde quién interviene o a qué intervención responde",
      "modes": [
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "business-card",
      "match": "tarjetas? de presentacion|business cards?",
      "title": "Datos de la tarjeta de presentación",
      "data": "los datos de identificación y contacto solicitados de la tarjeta",
      "production": "Dispone en inglés los datos de identificación y contacto solicitados de la persona o personaje indicado.",
      "error": "atribuye los datos de la tarjeta a un referente diferente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "list",
      "match": "listas?(?! (?:de cotejo|ponderadas?|de verificacion|de control|de observacion))",
      "title": "Elementos de la lista",
      "data": "los elementos de la lista que corresponden a la búsqueda solicitada",
      "production": "Presenta en inglés los elementos de la lista pertinentes para la finalidad indicada.",
      "error": "incorpora elementos ajenos a la categoría o finalidad de la lista",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "advertisement",
      "match": "anuncios?|advertisements?",
      "title": "Producto o servicio anunciado",
      "data": "el producto o servicio y la información solicitada del anuncio",
      "production": "Comunica en inglés el producto o servicio anunciado y la información necesaria para el destinatario acordado.",
      "error": "atribuye al producto o servicio características diferentes de las comunicadas",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "recipe",
      "match": "recetas?|recipes?",
      "title": "Acciones de la receta",
      "data": "las acciones de preparación y su orden en la receta",
      "production": "Comunica en inglés las acciones de preparación de la receta en un orden que permite seguir las instrucciones.",
      "error": "invierte o cambia acciones de preparación y altera las instrucciones",
      "existingFunction": "instructions",
      "modes": [
        "reading",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "sign",
      "match": "letreros?|signs?",
      "title": "Indicación del letrero",
      "data": "la indicación del letrero para la situación en que aparece",
      "production": "Comunica en inglés la indicación del letrero de forma breve y comprensible para el destinatario.",
      "error": "confunde una indicación con su prohibición o comunica una acción diferente",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "notice",
      "match": "avisos?|notices?",
      "title": "Información del aviso",
      "data": "la información del aviso que permite comprender lo comunicado",
      "production": "Comunica en inglés la información del aviso necesaria para reconocer la situación anunciada.",
      "error": "cambia lo anunciado o a quién se dirige el aviso",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poster",
      "match": "afiches?|carteles?|posters?",
      "title": "Mensaje del afiche",
      "data": "el mensaje central del afiche y la información solicitada",
      "production": "Dispone en inglés el mensaje central del afiche de forma legible y relacionada con su propósito comunicativo.",
      "error": "el mensaje dispuesto comunica un propósito diferente del solicitado",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "message",
      "match": "mensajes?|messages?",
      "title": "Propósito del mensaje",
      "data": "el propósito del mensaje y los datos solicitados para comprenderlo",
      "production": "Comunica en inglés las ideas necesarias para cumplir el propósito del mensaje en la situación acordada.",
      "error": "el contenido cambia la intención o el destinatario del mensaje",
      "modes": [
        "reading",
        "listening",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "email",
      "match": "correos?(?: electronicos?)?|e mails?|emails?",
      "title": "Comunicación por correo electrónico",
      "data": "el destinatario y propósito del correo y su información solicitada",
      "production": "Relaciona el destinatario y propósito del correo con un cuerpo breve en inglés que permite comprender lo comunicado.",
      "error": "dirige a otra persona información que no corresponde al propósito del correo",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "cv",
      "match": "curriculum vitae|curriculum|cv",
      "title": "Perfil del currículum vitae",
      "data": "los datos de perfil solicitados en el currículum vitae",
      "production": "Organiza en inglés los datos de perfil solicitados de una persona real o ficticia para el currículum vitae acordado.",
      "error": "atribuye datos de perfil a otra persona o los ubica en un apartado diferente",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "letter",
      "match": "cartas?|letters?",
      "title": "Comunicación de la carta",
      "data": "el destinatario y propósito de la carta y la información solicitada",
      "production": "Relaciona el destinatario y propósito de la carta con un mensaje breve en inglés que permite comprender lo comunicado.",
      "error": "el mensaje se dirige a un destinatario o propósito diferente del acordado",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "form",
      "match": "formularios?|forms?",
      "title": "Información del formulario",
      "data": "los campos solicitados del formulario y los datos que contienen o requieren",
      "production": "Completa en inglés los campos solicitados con datos pertinentes de la persona o situación real o ficticia indicada.",
      "error": "sitúa los datos en campos que piden una información diferente",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "forecast",
      "match": "pronosticos? del tiempo|weather forecasts?",
      "title": "Información del pronóstico",
      "data": "las condiciones atmosféricas y sus referencias solicitadas en el pronóstico",
      "production": "Comunica en inglés las condiciones atmosféricas del pronóstico y las referencias solicitadas.",
      "error": "atribuye al pronóstico condiciones diferentes de las indicadas",
      "existingFunction": "weather",
      "modes": [
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "news",
      "match": "noticias?|news",
      "title": "Información de la noticia",
      "data": "el suceso comunicado y los datos solicitados de la noticia",
      "production": "Comunica en inglés el suceso comunicado y los datos necesarios para reconocer qué ocurrió en la noticia.",
      "error": "cambia el suceso o atribuye sus datos a otro acontecimiento",
      "modes": [
        "reading",
        "listening",
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "schedule",
      "match": "horarios?|timetables?",
      "title": "Actividad y momento del horario",
      "data": "la actividad y momento que corresponden a la consulta del horario",
      "production": "Relaciona en inglés cada actividad y momento solicitado para que el horario pueda consultarse.",
      "error": "asigna a la actividad un momento diferente del indicado",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "agenda",
      "match": "agendas?",
      "title": "Compromisos de la agenda",
      "data": "los compromisos y sus referencias temporales solicitadas en la agenda",
      "production": "Relaciona en inglés los compromisos con las referencias temporales necesarias para consultar la agenda.",
      "error": "cambia la correspondencia entre el compromiso y su momento",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "map",
      "match": "croquis|mapas?|maps?",
      "title": "Referencias del croquis",
      "data": "las ubicaciones y referencias del croquis necesarias para responder a la consulta",
      "production": "Relaciona las ubicaciones y referencias del croquis con las indicaciones en inglés solicitadas.",
      "error": "invierte una ubicación o referencia y cambia el recorrido consultado",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "questionnaire",
      "match": "cuestionarios?|questionnaires?",
      "title": "Información buscada por las preguntas",
      "data": "la información buscada por las preguntas del cuestionario",
      "production": "Formula en inglés preguntas comprensibles que permiten obtener la información buscada en la situación acordada.",
      "error": "formula o interpreta preguntas que buscan información distinta de la solicitada",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "brochure",
      "match": "folletos?|brochures?",
      "title": "Información del folleto",
      "data": "la información del folleto pertinente para la consulta solicitada",
      "production": "Dispone en inglés la información del folleto de modo que el destinatario pueda encontrar los datos solicitados.",
      "error": "la organización o los datos del folleto conducen a información diferente de la solicitada",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "song",
      "match": "cancion(?:es)?|songs?",
      "title": "Mensaje de la canción",
      "data": "el mensaje de la canción expresado por las palabras solicitadas",
      "production": "Comunica el mensaje de la canción en inglés con palabras y expresiones comprensibles mediante la interpretación acordada.",
      "error": "cambia palabras o relaciones que alteran el sentido del mensaje de la canción",
      "modes": [
        "reading",
        "listening",
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poem",
      "match": "poesias?|poemas?|poems?",
      "title": "Sentido de los versos",
      "data": "el sentido de los versos y las expresiones solicitadas de la poesía",
      "production": "Comunica en inglés el sentido de los versos mediante las expresiones de la producción acordada.",
      "error": "atribuye a los versos un sentido incompatible con sus palabras",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "comic",
      "match": "historietas?|comics?",
      "title": "Secuencia de la historieta",
      "data": "la relación entre las viñetas y los mensajes de la historieta",
      "production": "Relaciona en inglés los mensajes con las viñetas para que la secuencia de la historieta resulte comprensible.",
      "error": "invierte la secuencia o atribuye a una viñeta un mensaje diferente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "tourist-guide",
      "match": "guias? turisticas?|tourist guides?",
      "title": "Orientaciones de la guía turística",
      "data": "los lugares y orientaciones de la guía pertinentes para la consulta",
      "production": "Comunica en inglés los lugares y orientaciones de la guía que permiten atender la consulta acordada.",
      "error": "confunde los lugares o las orientaciones y conduce a información diferente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "description",
      "match": "descripcion(?:es)?|descriptions?",
      "title": "Características de lo descrito",
      "data": "las características solicitadas y el referente descrito",
      "production": "Relaciona en inglés las características solicitadas con la persona, lugar u objeto descrito.",
      "error": "atribuye las características a un referente distinto",
      "existingFunction": "description",
      "modes": [
        "reading",
        "listening",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "biography",
      "match": "biografias?|biographies",
      "title": "Acontecimientos de la biografía",
      "data": "los acontecimientos de la vida de la persona y sus relaciones solicitadas",
      "production": "Comunica en inglés los acontecimientos de la vida de la persona real o ficticia indicada con relaciones comprensibles.",
      "error": "atribuye los acontecimientos a otra persona o cambia su relación",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "narrative",
      "match": "narracion(?:es)?|relatos?|narratives?",
      "title": "Acontecimientos de la narración",
      "data": "los acontecimientos y personajes presentes en la narración y las relaciones solicitadas",
      "production": "Relaciona en inglés los acontecimientos y personajes, cuando corresponda, para que la narración real o ficticia se comprenda.",
      "error": "cambia los acontecimientos o sus relaciones y altera la narración",
      "modes": [
        "reading",
        "listening",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "menu",
      "match": "menus?|menus en ingles",
      "title": "Información consultada del menú",
      "data": "los productos y la información solicitada del menú",
      "production": "",
      "error": "atribuye a un producto información de otro elemento del menú",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "monologue",
      "match": "monologos?|monologues?",
      "title": "Ideas del monólogo",
      "data": "las ideas relacionadas con el asunto del monólogo",
      "production": "Comunica en inglés las ideas del monólogo solicitado mediante oraciones básicas enlazadas que permiten seguir el asunto.",
      "error": "las relaciones entre las ideas cambian el sentido del asunto comunicado",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "audiovisual",
      "match": "produccion(?:es)? audiovisual(?:es)?|videos?",
      "title": "Mensaje de la producción audiovisual",
      "data": "la relación entre los recursos seleccionados y el mensaje audiovisual",
      "production": "Relaciona los recursos seleccionados con un mensaje en inglés comprensible para el destinatario acordado.",
      "error": "los recursos comunican ideas incompatibles con el mensaje solicitado",
      "modes": [
        "audiovisual"
      ],
      "source": "EXPLICIT_TASK"
    },
    {
      "id": "catalog",
      "match": "catalogos?|catalogues?|catalogs?",
      "title": "Información consultada del catálogo",
      "data": "los elementos y la información solicitada del catálogo",
      "production": "",
      "error": "atribuye a un elemento información de otro del catálogo",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "dictionary",
      "match": "diccionarios?|dictionaries",
      "title": "Entrada y significado del diccionario",
      "data": "la entrada y el significado solicitados del diccionario",
      "production": "",
      "error": "atribuye a la palabra una acepción diferente de la consultada",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "invoice",
      "match": "facturas?|invoices?",
      "title": "Datos consultados de la factura",
      "data": "los datos solicitados de la factura y sus referentes",
      "production": "",
      "error": "atribuye los datos de la factura a otro producto o referente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "instructions",
      "match": "textos? de instrucciones|instrucciones|instructions",
      "title": "Pasos del texto de instrucciones",
      "data": "las acciones de las instrucciones y su orden",
      "production": "Comunica en inglés los pasos de las instrucciones en un orden que permite seguir la tarea indicada.",
      "error": "cambia las acciones o su orden y altera las instrucciones",
      "existingFunction": "instructions",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "presentation",
      "match": "presentacion(?:es)?|presentations?",
      "title": "Ideas relacionadas en la presentación",
      "data": "las ideas e información solicitadas en la presentación",
      "production": "Relaciona en inglés las ideas e información de la presentación con un orden que permite seguir el asunto y su propósito.",
      "error": "cambia el asunto o las relaciones entre las ideas de la presentación",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "argumentation",
      "match": "argumentacion(?:es)?|argumentations?",
      "title": "Punto de vista y razones de la argumentación",
      "data": "el punto de vista y las razones solicitadas de la argumentación",
      "production": "Relaciona en inglés el punto de vista de la argumentación con las razones solicitadas para sustentarlo ante el interlocutor.",
      "error": "las razones contradicen el punto de vista o no se relacionan con él",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    }
  ],
  "englishGradeFourModule": {
    "id": "ingles-comunicacion-4",
    "grade": 4,
    "subjectCode": "ING",
    "pdfPages": [
      158,
      159,
      160,
      161,
      162
    ],
    "policy": "COMMON_FOURTH_GRADE_DEFINED_FAMILIES_CONTEXT_COMPOSITION_REVIEW_PENDING_V3"
  },
  "englishGradeFourGrammar": [
    {
      "id": "question-tags",
      "match": "\\b(?:question tags?)\\b",
      "name": "las question tags",
      "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada",
      "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación"
    },
    {
      "id": "comparative",
      "match": "\\b(?:comparativos?|comparative|superlativos?|superlative)\\b",
      "name": "el grado comparativo o superlativo solicitado",
      "function": "establecer una comparación o destacar un elemento dentro de un conjunto",
      "error": "confunde la relación entre dos elementos con la selección de uno dentro de un conjunto",
      "terms": [
        [
          "\\bcomparativos?\\b|\\bcomparative\\b",
          "el grado comparativo"
        ],
        [
          "\\bsuperlativos?\\b|\\bsuperlative\\b",
          "el grado superlativo"
        ]
      ]
    },
    {
      "id": "interrogative-pronouns",
      "match": "\\b(?:pronombres? interrogativos?|interrogative pronouns?)\\b",
      "name": "los pronombres interrogativos",
      "function": "preguntar por la persona, cosa o lugar que se necesita conocer",
      "error": "pregunta por una información distinta de la que se quiere solicitar"
    },
    {
      "id": "place-prepositions",
      "match": "\\b(?:preposiciones? de lugar|prepositions? of place)\\b",
      "name": "las preposiciones de lugar",
      "function": "situar un elemento respecto a otro en el espacio",
      "error": "cambia la relación espacial entre los elementos"
    },
    {
      "id": "time-adverbs",
      "match": "\\b(?:adverbios? de tiempo|adverbs? of time)\\b",
      "name": "los adverbios de tiempo",
      "function": "indicar cuándo ocurre la acción",
      "error": "desplaza la acción a un momento distinto del indicado"
    },
    {
      "id": "manner-adverbs",
      "match": "\\b(?:adverbios? de modo|adverbs? of manner)\\b",
      "name": "los adverbios de modo",
      "function": "precisar cómo se realiza una acción",
      "error": "altera la manera en que se realiza la acción descrita"
    },
    {
      "id": "time-connectors",
      "match": "\\b(?:conectores? de tiempo|temporal connectors?)\\b",
      "name": "los conectores de tiempo",
      "function": "relacionar los momentos en que ocurren las acciones",
      "error": "invierte la relación de anterioridad o posterioridad de las acciones"
    },
    {
      "id": "sequence-connectors",
      "match": "\\b(?:conectores? de secuencia|sequence connectors?)\\b",
      "name": "los conectores de secuencia",
      "function": "ordenar pasos o acontecimientos",
      "error": "cambia el orden necesario para seguir los pasos o acontecimientos"
    },
    {
      "id": "cause-connectors",
      "match": "\\b(?:conectores? de causa(?: y consecuencia|lidad)?|conectores? de consecuencia|cause and effect connectors?)\\b",
      "name": "los conectores de causa y consecuencia",
      "function": "relacionar un hecho con su causa o su consecuencia",
      "error": "invierte o confunde la causa y la consecuencia de los hechos"
    },
    {
      "id": "present-participle",
      "match": "\\b(?:participio presente|present participle|adjetivos? (?:en|terminados en) ing)\\b",
      "name": "los adjetivos en participio presente",
      "function": "caracterizar el efecto que provoca una situación o actividad",
      "error": "confunde el efecto de la actividad con el estado de quien lo experimenta"
    },
    {
      "id": "past-participle",
      "match": "\\b(?:participio pasado|past participle|adjetivos? (?:en|terminados en) ed)\\b",
      "name": "los adjetivos en participio pasado",
      "function": "describir el estado de la persona o referente",
      "error": "confunde el estado del referente con el efecto que provoca una actividad"
    },
    {
      "id": "reflexive-pronouns",
      "match": "\\b(?:pronombres? reflexivos?|reflexive pronouns?)\\b",
      "name": "los pronombres reflexivos",
      "function": "relacionar una acción con el mismo referente que la realiza",
      "error": "atribuye a otra persona una acción que recae sobre el sujeto"
    },
    {
      "id": "exclamation",
      "match": "\\b(?:oraciones? exclamativas?|exclamaciones?|exclamatory sentences?)\\b",
      "name": "las oraciones exclamativas",
      "function": "expresar una reacción relacionada con el acontecimiento comunicado",
      "error": "la forma comunica una reacción incompatible con el acontecimiento indicado"
    },
    {
      "id": "relative-pronouns",
      "match": "\\b(?:pronombres? relativos?|relative pronouns?)\\b",
      "name": "los pronombres relativos",
      "function": "enlazar información adicional con el referente al que corresponde",
      "error": "relaciona la información con una persona o elemento distinto"
    },
    {
      "id": "purpose-connectors",
      "match": "\\b(?:conectores? de finalidad|purpose connectors?)\\b",
      "name": "los conectores de finalidad",
      "function": "relacionar una acción con la finalidad para la que se realiza",
      "error": "confunde la finalidad con una causa o un resultado ya ocurrido"
    },
    {
      "id": "contrast-connectors",
      "match": "\\b(?:conectores? de contraste|contrast connectors?)\\b",
      "name": "los conectores de contraste",
      "function": "contrastar ideas o puntos de vista relacionados",
      "error": "presenta como equivalentes ideas que deben contrastarse"
    },
    {
      "id": "concession-connectors",
      "match": "\\b(?:conectores? de concesion|concession connectors?)\\b",
      "name": "los conectores de concesión",
      "function": "relacionar una circunstancia con un resultado que ocurre pese a ella",
      "error": "presenta la circunstancia como causa necesaria del resultado o elimina la concesión"
    },
    {
      "id": "declarative",
      "match": "\\b(?:oraciones? (?:enunciativas?|afirmativas?|negativas?)|declarative sentences?)\\b",
      "name": "las oraciones enunciativas solicitadas",
      "function": "comunicar una afirmación positiva o negativa con el sentido solicitado",
      "error": "invierte la afirmación o negación del mensaje",
      "terms": [
        [
          "afirmativas?",
          "las oraciones afirmativas"
        ],
        [
          "negativas?",
          "las oraciones negativas"
        ]
      ]
    },
    {
      "id": "interrogative-sentences",
      "match": "\\b(?:oraciones? interrogativas?|preguntas? directas?|interrogative sentences?)\\b",
      "name": "las oraciones interrogativas",
      "function": "preguntar por la información indicada mediante una pregunta directa comprensible",
      "error": "pregunta por otro asunto o cambia la relación entre los referentes"
    },
    {
      "id": "present-simple",
      "match": "\\b(?:presente simple|present simple|simple present)\\b",
      "name": "el presente simple",
      "function": "comunicar información, un punto de vista o la situación que explica un problema, según la intención solicitada",
      "error": "cambia el referente o el sentido de la afirmación de la situación"
    },
    {
      "id": "present-continuous",
      "match": "\\b(?:presente continuo|present continuous)\\b",
      "name": "el presente continuo",
      "function": "expresar el plan futuro indicado con su referencia temporal",
      "error": "sitúa como terminada o habitual la acción del plan futuro"
    },
    {
      "id": "past-simple",
      "match": "\\b(?:pasado simple|past simple|simple past)\\b",
      "name": "el pasado simple",
      "function": "comunicar el acontecimiento terminado de la noticia o experiencia indicada",
      "error": "cambia el acontecimiento o su referencia al pasado"
    },
    {
      "id": "present-perfect",
      "match": "\\b(?:presente perfecto|present perfect)\\b",
      "name": "el presente perfecto",
      "function": "comunicar una noticia o experiencia reciente relacionada con el presente",
      "error": "sitúa como acción en desarrollo o sin relación con el presente el acontecimiento reciente"
    },
    {
      "id": "used-to",
      "match": "\\b(?:used to)\\b",
      "name": "used to",
      "function": "expresar un hábito pasado del referente indicado",
      "error": "presenta como hábito actual la situación pasada"
    },
    {
      "id": "imperative",
      "match": "\\b(?:imperativos?|imperatives?)\\b",
      "name": "el imperativo",
      "function": "comunicar la acción solicitada en una instrucción",
      "error": "cambia una instrucción afirmativa por una prohibición o altera la acción solicitada"
    },
    {
      "id": "past-continuous",
      "match": "\\b(?:pasado continuo|past continuous)\\b",
      "name": "el pasado continuo",
      "function": "situar la acción en desarrollo que permite explicar el problema o su motivo en el pasado",
      "error": "confunde la acción en desarrollo con un hecho terminado o cambia el motivo del problema"
    },
    {
      "id": "future-continuous",
      "match": "\\b(?:futuro continuo|future continuous|future progressive)\\b",
      "name": "el futuro continuo",
      "function": "comunicar el plan o acción que estará en desarrollo en el momento futuro indicado",
      "error": "sitúa como terminada o presente la acción en desarrollo del plan futuro"
    },
    {
      "id": "going-to",
      "match": "\\b(?:be going to|going to)\\b",
      "name": "be going to",
      "function": "comunicar un plan, anuncio o resultado futuro previsto a partir de la situación indicada",
      "error": "cambia la acción futura o su relación con los indicios o el plan indicado"
    },
    {
      "id": "will",
      "match": "\\b(?:will)\\b",
      "name": "will",
      "function": "comunicar una predicción sobre el resultado futuro indicado",
      "error": "presenta como ocurrido un resultado futuro o cambia la predicción solicitada"
    },
    {
      "id": "hope",
      "match": "\\b(?:hope)\\b",
      "name": "hope",
      "function": "comunicar la esperanza del referente en un resultado que no se presenta como confirmado",
      "error": "presenta como confirmado el resultado que el referente espera"
    },
    {
      "id": "wish",
      "match": "\\b(?:wish)\\b",
      "name": "wish",
      "function": "expresar el deseo del referente sin presentarlo como un hecho confirmado",
      "error": "cambia el sentido del deseo o lo presenta como un resultado ya confirmado"
    },
    {
      "id": "would-like",
      "match": "\\b(?:would like)\\b",
      "name": "would like",
      "function": "expresar un deseo o preferencia del referente en la situación solicitada",
      "error": "comunica una afirmación confirmada cuando se pide un deseo"
    },
    {
      "id": "verb-complements",
      "match": "\\b(?:verbos? (?:seguidos (?:por|de)|que admiten) (?:infinitivo|gerundio)(?: o gerundio)?|verb complements?)\\b",
      "name": "el complemento verbal en infinitivo o gerundio solicitado",
      "function": "seleccionar un complemento compatible con el verbo para comunicar la acción indicada",
      "error": "el complemento no es compatible con el verbo elegido o cambia la acción comunicada",
      "terms": [
        [
          "infinitivo",
          "el complemento en infinitivo"
        ],
        [
          "gerundio",
          "el complemento en gerundio"
        ]
      ]
    },
    {
      "id": "phrasal-verbs",
      "match": "\\b(?:phrasal verbs?|verbos? frasales?|turn up|fill out|get along with|look after)\\b",
      "name": "los phrasal verbs solicitados",
      "function": "relacionar el verbo y su partícula para comunicar el significado indicado en la situación",
      "error": "atribuye al verbo y su partícula un significado diferente o cambia su relación",
      "terms": [
        [
          "turn up",
          "turn up"
        ],
        [
          "fill out",
          "fill out"
        ],
        [
          "get along with",
          "get along with"
        ],
        [
          "look after",
          "look after"
        ]
      ]
    },
    {
      "id": "there-be",
      "match": "\\b(?:there be|there (?:is going to be|s going to be|has been|have been|will be|is|are|was|were))\\b",
      "name": "there + be",
      "function": "comunicar existencia en el anuncio, noticia o explicación del problema con la referencia solicitada",
      "error": "cambia la existencia, la cantidad o el momento indicado"
    },
    {
      "id": "conditional",
      "match": "\\b(?:condicional(?:es)?(?: cero)?|primer condicional|zero conditional|first conditional)\\b",
      "name": "la estructura condicional solicitada",
      "function": "relacionar la condición con la acción o resultado que depende de ella según el tiempo indicado",
      "error": "invierte la condición y el resultado o altera su relación temporal"
    },
    {
      "id": "passive",
      "match": "\\b(?:voz pasiva(?: en (?:presente|pasado|futuro))?|passive voice|(?:present|past|future) passive)\\b",
      "name": "la voz pasiva solicitada",
      "function": "comunicar la acción que recibe el referente de la información, noticia o predicción indicada",
      "error": "atribuye al receptor la acción que recibe o cambia el momento solicitado",
      "terms": [
        [
          "pasiva en presente|present passive",
          "la voz pasiva en presente"
        ],
        [
          "pasiva en pasado|past passive",
          "la voz pasiva en pasado"
        ],
        [
          "pasiva en futuro|future passive",
          "la voz pasiva en futuro"
        ]
      ]
    },
    {
      "id": "indirect-questions",
      "match": "\\b(?:preguntas? indirectas?|preguntas? integradas?|embedded questions?|indirect questions?)\\b",
      "name": "las preguntas indirectas o integradas solicitadas",
      "function": "integrar la pregunta dentro de otra expresión conservando la información solicitada y el orden correspondiente",
      "error": "la pregunta integrada cambia la información pedida o el orden que permite comprenderla"
    },
    {
      "id": "nominal-gerund",
      "match": "\\b(?:gerundios? en funcion sustantiva|gerundio como sustantivo|gerunds? as nouns?)\\b",
      "name": "el gerundio en función sustantiva",
      "function": "presentar una actividad como elemento nominal de la oración según la función solicitada",
      "error": "cambia la actividad o su función nominal en la oración"
    },
    {
      "id": "zero-article",
      "match": "\\b(?:omision del articulo|articulo cero|zero article)\\b",
      "name": "la omisión del artículo solicitada",
      "function": "conservar la referencia general que el contexto permite expresar sin artículo",
      "error": "cambia una referencia general por una específica o elimina un artículo necesario en el contexto"
    },
    {
      "id": "frequency-adverbs",
      "match": "\\b(?:adverbios? de frecuencia|adverbs? of frequency)\\b",
      "name": "los adverbios de frecuencia",
      "function": "expresar la frecuencia de la acción indicada",
      "error": "confunde una acción habitual con una ocasional o inexistente"
    },
    {
      "id": "preposition-use",
      "match": "\\b(?:uso de preposiciones|preposiciones solicitadas)\\b",
      "name": "las preposiciones solicitadas",
      "function": "establecer la relación entre los elementos del mensaje según su sentido en la situación",
      "error": "la preposición cambia la relación solicitada entre los referentes"
    },
    {
      "id": "time-prepositions",
      "match": "\\b(?:preposiciones? de tiempo|prepositions? of time)\\b",
      "name": "las preposiciones de tiempo",
      "function": "relacionar un acontecimiento con la referencia temporal o duración solicitada",
      "error": "sitúa el hecho en otro momento o cambia la duración indicada"
    },
    {
      "id": "sentence-final-preposition",
      "match": "\\b(?:preposicion al final de la oracion|sentence final preposition)\\b",
      "name": "la preposición al final de la oración",
      "function": "mantener la relación de la preposición con su complemento aunque este se encuentre en otra posición de la oración",
      "error": "relaciona la preposición con un complemento diferente del indicado"
    }
  ],
  "englishGradeFourLexicon": [
    {
      "id": "sports",
      "match": "\\b(?:deportes|sports)\\b",
      "name": "deportes",
      "function": "nombrar la práctica deportiva indicada",
      "error": "nombra un deporte distinto del solicitado",
      "category": "vocabulary"
    },
    {
      "id": "places",
      "match": "\\b(?:lugares|places)\\b",
      "name": "lugares",
      "function": "nombrar el lugar indicado en el mensaje",
      "error": "sitúa el referente en un lugar diferente del comunicado",
      "category": "vocabulary"
    },
    {
      "id": "technology",
      "match": "\\b(?:tecnologia|technology)\\b",
      "name": "tecnología",
      "function": "nombrar el dispositivo o servicio tecnológico del mensaje",
      "error": "confunde el dispositivo o servicio con otro referente",
      "category": "vocabulary"
    },
    {
      "id": "contingencies",
      "match": "\\b(?:eventualidades|contratiempos|contingencies)\\b",
      "name": "eventualidades",
      "function": "nombrar el acontecimiento imprevisto del personaje o situación dada",
      "error": "atribuye al personaje un contratiempo distinto del relato",
      "category": "vocabulary"
    },
    {
      "id": "events-celebrations",
      "match": "\\b(?:acontecimientos y celebraciones|acontecimientos|celebraciones|events and celebrations)\\b",
      "name": "acontecimientos y celebraciones solicitados",
      "function": "nombrar el acontecimiento o celebración del referente indicado",
      "error": "confunde el acontecimiento o celebración del ejemplo",
      "category": "vocabulary"
    },
    {
      "id": "communication",
      "match": "\\b(?:comunicacion|communication vocabulary)\\b",
      "name": "comunicación",
      "function": "nombrar el canal o interacción de comunicación indicado",
      "error": "confunde el canal o la interacción de comunicación de la situación",
      "category": "vocabulary"
    },
    {
      "id": "education",
      "match": "\\b(?:educacion|education vocabulary)\\b",
      "name": "educación",
      "function": "nombrar el nivel, oportunidad o referente educativo indicado",
      "error": "atribuye al referente otra oportunidad o nivel educativo",
      "category": "vocabulary"
    },
    {
      "id": "kitchen-equipment",
      "match": "\\b(?:equipos y utensilios de cocina|utensilios de cocina|kitchen equipment)\\b",
      "name": "equipos y utensilios de cocina",
      "function": "nombrar el equipo o utensilio de la situación culinaria indicada",
      "error": "confunde el equipo o utensilio mencionado con otro referente",
      "category": "vocabulary"
    },
    {
      "id": "experiences",
      "match": "\\b(?:experiencias personales|personal experiences)\\b",
      "name": "experiencias de los referentes indicados",
      "function": "nombrar la experiencia del personaje o referente indicado",
      "error": "atribuye al referente una experiencia distinta de la comunicada",
      "category": "vocabulary"
    },
    {
      "id": "natural-phenomena",
      "match": "\\b(?:fenomenos naturales|natural phenomena)\\b",
      "name": "fenómenos naturales",
      "function": "nombrar el fenómeno natural mencionado en la situación",
      "error": "confunde el fenómeno natural de la información proporcionada",
      "category": "vocabulary"
    },
    {
      "id": "tools",
      "match": "\\b(?:herramientas|tools vocabulary)\\b",
      "name": "herramientas",
      "function": "nombrar la herramienta y su referencia en la situación proporcionada",
      "error": "confunde la herramienta indicada con otra",
      "category": "vocabulary"
    },
    {
      "id": "transport",
      "match": "\\b(?:medios de transporte|means of transport)\\b",
      "name": "medios de transporte",
      "function": "nombrar el medio de transporte indicado",
      "error": "cambia el medio de transporte del mensaje",
      "category": "vocabulary"
    },
    {
      "id": "food-preparation",
      "match": "\\b(?:preparacion de alimentos|food preparation)\\b",
      "name": "preparación de alimentos",
      "function": "nombrar la acción culinaria indicada y su relación con la preparación",
      "error": "confunde la acción culinaria y cambia la preparación comunicada",
      "category": "vocabulary"
    },
    {
      "id": "recreation",
      "match": "\\b(?:recreacion|actividades recreativas|recreation)\\b",
      "name": "recreación",
      "function": "nombrar la actividad recreativa indicada",
      "error": "confunde la actividad recreativa mencionada con otra",
      "category": "vocabulary"
    },
    {
      "id": "travel",
      "match": "\\b(?:viajes?|travel vocabulary)\\b",
      "name": "viaje",
      "function": "nombrar la acción, objeto o servicio del viaje indicado",
      "error": "cambia la acción, objeto o servicio del viaje comunicado",
      "category": "vocabulary"
    },
    {
      "id": "attention",
      "match": "\\b(?:atraer la atencion|llamar la atencion)\\b",
      "name": "atraer la atención",
      "function": "llamar al interlocutor antes de comunicar el mensaje",
      "error": "la fórmula no permite reconocer a quién se llama o para qué se inicia el contacto",
      "category": "expression"
    },
    {
      "id": "encouragement",
      "match": "\\b(?:animar a alguien|dar animo)\\b",
      "name": "animar a alguien",
      "function": "comunicar ánimo relacionado con la situación o actuación del referente",
      "error": "la fórmula expresa una intención distinta del ánimo solicitado",
      "category": "expression"
    },
    {
      "id": "interest",
      "match": "\\b(?:expresar interes|mostrar interes)\\b",
      "name": "expresar interés",
      "function": "comunicar una reacción de interés relacionada con lo dicho por el interlocutor",
      "error": "la reacción cambia el asunto o expresa una intención incompatible con la situación",
      "category": "expression"
    },
    {
      "id": "amazement",
      "match": "\\b(?:expresar asombro|mostrar asombro)\\b",
      "name": "expresar asombro",
      "function": "comunicar una reacción de asombro relacionada con el hecho indicado",
      "error": "la fórmula comunica una reacción incompatible con el acontecimiento",
      "category": "expression"
    },
    {
      "id": "empathy",
      "match": "\\b(?:mostrar empatia|expresar empatia)\\b",
      "name": "mostrar empatía",
      "function": "responder a la situación comunicada por el personaje con una expresión de apoyo pertinente",
      "error": "la expresión contradice o descalifica la situación comunicada",
      "category": "expression"
    },
    {
      "id": "ask-opinion",
      "match": "\\b(?:(?:pedir(?:an)?|pidan|solicitar(?:an)?) (?:una |las )?opinion(?:es)?)\\b",
      "name": "pedir opiniones",
      "function": "solicitar el punto de vista del interlocutor sobre el asunto indicado",
      "error": "la pregunta pide otra información o atribuye al interlocutor un punto de vista no expresado",
      "category": "expression"
    },
    {
      "id": "opinion",
      "match": "\\b(?:dar opinion(?:es)?|expresar opinion(?:es)?)\\b",
      "name": "dar opiniones",
      "function": "comunicar el punto de vista sobre el asunto indicado",
      "error": "presenta una opinión ajena como propia o cambia su sentido",
      "category": "expression"
    },
    {
      "id": "agreement",
      "match": "\\b(?:expresar acuerdo(?: y desacuerdo)?|expresar desacuerdo)\\b",
      "name": "expresar acuerdo o desacuerdo según lo solicitado",
      "function": "comunicar su posición respecto de lo dicho por el interlocutor",
      "error": "invierte el acuerdo y el desacuerdo de la respuesta indicada",
      "category": "expression"
    },
    {
      "id": "coincidence",
      "match": "\\b(?:coincidir(?: y discrepar)?|discrepar)\\b",
      "name": "coincidir o discrepar según lo solicitado",
      "function": "relacionar la respuesta de coincidencia o discrepancia con la afirmación del interlocutor",
      "error": "invierte la coincidencia o discrepancia o la polaridad de la afirmación",
      "category": "expression"
    },
    {
      "id": "clarification",
      "match": "\\b(?:pedir repeticion(?: o aclaracion)?|pedir aclaracion|solicitar repeticion|solicitar aclaracion)\\b",
      "name": "pedir repetición o aclaración según lo solicitado",
      "function": "solicitar la repetición o aclaración de la parte del mensaje que necesita comprender",
      "error": "la petición no permite localizar qué parte del mensaje necesita aclarar",
      "category": "expression"
    },
    {
      "id": "change-topic",
      "match": "\\b(?:cambiar de tema)\\b",
      "name": "cambiar de tema",
      "function": "señalar la transición hacia el nuevo asunto solicitado",
      "error": "la fórmula no permite reconocer la transición o introduce otro asunto",
      "category": "expression"
    },
    {
      "id": "close-conversation",
      "match": "\\b(?:concluir una conversacion|cerrar una conversacion)\\b",
      "name": "concluir una conversación",
      "function": "cerrar el intercambio con una fórmula pertinente para la situación",
      "error": "la fórmula abre otro intercambio cuando corresponde concluirlo",
      "category": "expression"
    },
    {
      "id": "news",
      "match": "\\b(?:dar una noticia|comunicar una noticia)\\b",
      "name": "dar una noticia",
      "function": "introducir el acontecimiento nuevo que se comunica al interlocutor",
      "error": "la fórmula no permite reconocer que se introduce una noticia",
      "category": "expression"
    },
    {
      "id": "excuse",
      "match": "\\b(?:excusarse|disculparse)\\b",
      "name": "excusarse",
      "function": "comunicar una disculpa relacionada con la situación indicada",
      "error": "la fórmula no permite reconocer la disculpa solicitada",
      "category": "expression"
    },
    {
      "id": "congratulations",
      "match": "\\b(?:felicitar)\\b",
      "name": "felicitar",
      "function": "comunicar una felicitación relacionada con el acontecimiento del referente indicado",
      "error": "la fórmula expresa otra intención o se refiere a otro acontecimiento",
      "category": "expression"
    }
  ],
  "englishGradeFiveGenres": [
    {
      "id": "conversation",
      "match": "conversacion(?:es)?|dialogos?",
      "title": "Intercambio de la conversación",
      "data": "la relación entre las intervenciones de los interlocutores",
      "production": "Relaciona sus intervenciones en inglés con las de los interlocutores para mantener el intercambio acordado.",
      "error": "confunde quién interviene o a qué intervención responde",
      "modes": [
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "business-card",
      "match": "tarjetas? de presentacion|business cards?",
      "title": "Datos de la tarjeta de presentación",
      "data": "los datos de identificación y contacto solicitados de la tarjeta",
      "production": "Dispone en inglés los datos de identificación y contacto solicitados de la persona o personaje indicado.",
      "error": "atribuye los datos de la tarjeta a un referente diferente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "list",
      "match": "listas?(?! (?:de cotejo|ponderadas?|de verificacion|de control|de observacion))",
      "title": "Elementos de la lista",
      "data": "los elementos de la lista que corresponden a la búsqueda solicitada",
      "production": "Presenta en inglés los elementos de la lista pertinentes para la finalidad indicada.",
      "error": "incorpora elementos ajenos a la categoría o finalidad de la lista",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "advertisement",
      "match": "anuncios?|advertisements?",
      "title": "Producto o servicio anunciado",
      "data": "el producto o servicio y la información solicitada del anuncio",
      "production": "Comunica en inglés el producto o servicio anunciado y la información necesaria para el destinatario acordado.",
      "error": "atribuye al producto o servicio características diferentes de las comunicadas",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "recipe",
      "match": "recetas?|recipes?",
      "title": "Acciones de la receta",
      "data": "las acciones de preparación y su orden en la receta",
      "production": "Comunica en inglés las acciones de preparación de la receta en un orden que permite seguir las instrucciones.",
      "error": "invierte o cambia acciones de preparación y altera las instrucciones",
      "existingFunction": "instructions",
      "modes": [
        "reading",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "sign",
      "match": "letreros?|signs?",
      "title": "Indicación del letrero",
      "data": "la indicación del letrero para la situación en que aparece",
      "production": "Comunica en inglés la indicación del letrero de forma breve y comprensible para el destinatario.",
      "error": "confunde una indicación con su prohibición o comunica una acción diferente",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "notice",
      "match": "avisos?|notices?",
      "title": "Información del aviso",
      "data": "la información del aviso que permite comprender lo comunicado",
      "production": "Comunica en inglés la información del aviso necesaria para reconocer la situación anunciada.",
      "error": "cambia lo anunciado o a quién se dirige el aviso",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poster",
      "match": "afiches?|carteles?|posters?",
      "title": "Mensaje del afiche",
      "data": "el mensaje central del afiche y la información solicitada",
      "production": "Dispone en inglés el mensaje central del afiche de forma legible y relacionada con su propósito comunicativo.",
      "error": "el mensaje dispuesto comunica un propósito diferente del solicitado",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "message",
      "match": "mensajes?|messages?",
      "title": "Propósito del mensaje",
      "data": "el propósito del mensaje y los datos solicitados para comprenderlo",
      "production": "Comunica en inglés las ideas necesarias para cumplir el propósito del mensaje en la situación acordada.",
      "error": "el contenido cambia la intención o el destinatario del mensaje",
      "modes": [
        "reading",
        "listening",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "email",
      "match": "correos?(?: electronicos?)?|e mails?|emails?",
      "title": "Comunicación por correo electrónico",
      "data": "el destinatario y propósito del correo y su información solicitada",
      "production": "Relaciona el destinatario y propósito del correo con un cuerpo breve en inglés que permite comprender lo comunicado.",
      "error": "dirige a otra persona información que no corresponde al propósito del correo",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "cv",
      "match": "curriculum vitae|curriculum|cv",
      "title": "Perfil del currículum vitae",
      "data": "los datos de perfil solicitados en el currículum vitae",
      "production": "Organiza en inglés los datos de perfil solicitados de una persona real o ficticia para el currículum vitae acordado.",
      "error": "atribuye datos de perfil a otra persona o los ubica en un apartado diferente",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "letter",
      "match": "cartas?|letters?",
      "title": "Comunicación de la carta",
      "data": "el destinatario y propósito de la carta y la información solicitada",
      "production": "Relaciona el destinatario y propósito de la carta con un mensaje breve en inglés que permite comprender lo comunicado.",
      "error": "el mensaje se dirige a un destinatario o propósito diferente del acordado",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "form",
      "match": "formularios?|forms?",
      "title": "Información del formulario",
      "data": "los campos solicitados del formulario y los datos que contienen o requieren",
      "production": "Completa en inglés los campos solicitados con datos pertinentes de la persona o situación real o ficticia indicada.",
      "error": "sitúa los datos en campos que piden una información diferente",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "forecast",
      "match": "pronosticos? del tiempo|weather forecasts?",
      "title": "Información del pronóstico",
      "data": "las condiciones atmosféricas y sus referencias solicitadas en el pronóstico",
      "production": "Comunica en inglés las condiciones atmosféricas del pronóstico y las referencias solicitadas.",
      "error": "atribuye al pronóstico condiciones diferentes de las indicadas",
      "existingFunction": "weather",
      "modes": [
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "news",
      "match": "noticias?|news",
      "title": "Información de la noticia",
      "data": "el suceso comunicado y los datos solicitados de la noticia",
      "production": "Comunica en inglés el suceso comunicado y los datos necesarios para reconocer qué ocurrió en la noticia.",
      "error": "cambia el suceso o atribuye sus datos a otro acontecimiento",
      "modes": [
        "reading",
        "listening",
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "schedule",
      "match": "horarios?|timetables?",
      "title": "Actividad y momento del horario",
      "data": "la actividad y momento que corresponden a la consulta del horario",
      "production": "Relaciona en inglés cada actividad y momento solicitado para que el horario pueda consultarse.",
      "error": "asigna a la actividad un momento diferente del indicado",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "agenda",
      "match": "agendas?",
      "title": "Compromisos de la agenda",
      "data": "los compromisos y sus referencias temporales solicitadas en la agenda",
      "production": "Relaciona en inglés los compromisos con las referencias temporales necesarias para consultar la agenda.",
      "error": "cambia la correspondencia entre el compromiso y su momento",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "map",
      "match": "croquis|mapas?|maps?",
      "title": "Referencias del croquis",
      "data": "las ubicaciones y referencias del croquis necesarias para responder a la consulta",
      "production": "Relaciona las ubicaciones y referencias del croquis con las indicaciones en inglés solicitadas.",
      "error": "invierte una ubicación o referencia y cambia el recorrido consultado",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "questionnaire",
      "match": "cuestionarios?|questionnaires?",
      "title": "Información buscada por las preguntas",
      "data": "la información buscada por las preguntas del cuestionario",
      "production": "Formula en inglés preguntas comprensibles que permiten obtener la información buscada en la situación acordada.",
      "error": "formula o interpreta preguntas que buscan información distinta de la solicitada",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "brochure",
      "match": "folletos?|brochures?",
      "title": "Información del folleto",
      "data": "la información del folleto pertinente para la consulta solicitada",
      "production": "Dispone en inglés la información del folleto de modo que el destinatario pueda encontrar los datos solicitados.",
      "error": "la organización o los datos del folleto conducen a información diferente de la solicitada",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "song",
      "match": "cancion(?:es)?|songs?",
      "title": "Mensaje de la canción",
      "data": "el mensaje de la canción expresado por las palabras solicitadas",
      "production": "Comunica el mensaje de la canción en inglés con palabras y expresiones comprensibles mediante la interpretación acordada.",
      "error": "cambia palabras o relaciones que alteran el sentido del mensaje de la canción",
      "modes": [
        "reading",
        "listening",
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poem",
      "match": "poesias?|poemas?|poems?",
      "title": "Sentido de los versos",
      "data": "el sentido de los versos y las expresiones solicitadas de la poesía",
      "production": "Comunica en inglés el sentido de los versos mediante las expresiones de la producción acordada.",
      "error": "atribuye a los versos un sentido incompatible con sus palabras",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "comic",
      "match": "historietas?|comics?",
      "title": "Secuencia de la historieta",
      "data": "la relación entre las viñetas y los mensajes de la historieta",
      "production": "Relaciona en inglés los mensajes con las viñetas para que la secuencia de la historieta resulte comprensible.",
      "error": "invierte la secuencia o atribuye a una viñeta un mensaje diferente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "tourist-guide",
      "match": "guias? turisticas?|tourist guides?",
      "title": "Orientaciones de la guía turística",
      "data": "los lugares y orientaciones de la guía pertinentes para la consulta",
      "production": "Comunica en inglés los lugares y orientaciones de la guía que permiten atender la consulta acordada.",
      "error": "confunde los lugares o las orientaciones y conduce a información diferente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "description",
      "match": "descripcion(?:es)?|descriptions?",
      "title": "Características de lo descrito",
      "data": "las características solicitadas y el referente descrito",
      "production": "Relaciona en inglés las características solicitadas con la persona, lugar u objeto descrito.",
      "error": "atribuye las características a un referente distinto",
      "existingFunction": "description",
      "modes": [
        "reading",
        "listening",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "biography",
      "match": "biografias?|biographies",
      "title": "Acontecimientos de la biografía",
      "data": "los acontecimientos de la vida de la persona y sus relaciones solicitadas",
      "production": "Comunica en inglés los acontecimientos de la vida de la persona real o ficticia indicada con relaciones comprensibles.",
      "error": "atribuye los acontecimientos a otra persona o cambia su relación",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "narrative",
      "match": "narracion(?:es)?|relatos?|narratives?",
      "title": "Acontecimientos de la narración",
      "data": "los acontecimientos y personajes presentes en la narración y las relaciones solicitadas",
      "production": "Relaciona en inglés los acontecimientos y personajes, cuando corresponda, para que la narración real o ficticia se comprenda.",
      "error": "cambia los acontecimientos o sus relaciones y altera la narración",
      "modes": [
        "reading",
        "listening",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "menu",
      "match": "menus?|menus en ingles",
      "title": "Información consultada del menú",
      "data": "los productos y la información solicitada del menú",
      "production": "",
      "error": "atribuye a un producto información de otro elemento del menú",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "monologue",
      "match": "monologos?|monologues?",
      "title": "Ideas del monólogo",
      "data": "las ideas relacionadas con el asunto del monólogo",
      "production": "Comunica en inglés las ideas del monólogo solicitado mediante oraciones básicas enlazadas que permiten seguir el asunto.",
      "error": "las relaciones entre las ideas cambian el sentido del asunto comunicado",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "audiovisual",
      "match": "produccion(?:es)? audiovisual(?:es)?|videos?",
      "title": "Mensaje de la producción audiovisual",
      "data": "la relación entre los recursos seleccionados y el mensaje audiovisual",
      "production": "Relaciona los recursos seleccionados con un mensaje en inglés comprensible para el destinatario acordado.",
      "error": "los recursos comunican ideas incompatibles con el mensaje solicitado",
      "modes": [
        "audiovisual"
      ],
      "source": "EXPLICIT_TASK"
    },
    {
      "id": "catalog",
      "match": "catalogos?|catalogues?|catalogs?",
      "title": "Información consultada del catálogo",
      "data": "los elementos y la información solicitada del catálogo",
      "production": "",
      "error": "atribuye a un elemento información de otro del catálogo",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "dictionary",
      "match": "diccionarios?|dictionaries",
      "title": "Entrada y significado del diccionario",
      "data": "la entrada y el significado solicitados del diccionario",
      "production": "",
      "error": "atribuye a la palabra una acepción diferente de la consultada",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "invoice",
      "match": "facturas?|invoices?",
      "title": "Datos consultados de la factura",
      "data": "los datos solicitados de la factura y sus referentes",
      "production": "",
      "error": "atribuye los datos de la factura a otro producto o referente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "instructions",
      "match": "textos? de instrucciones|instrucciones|instructions",
      "title": "Pasos del texto de instrucciones",
      "data": "las acciones de las instrucciones y su orden",
      "production": "Comunica en inglés los pasos de las instrucciones en un orden que permite seguir la tarea indicada.",
      "error": "cambia las acciones o su orden y altera las instrucciones",
      "existingFunction": "instructions",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "presentation",
      "match": "presentacion(?:es)?|presentations?",
      "title": "Ideas relacionadas en la presentación",
      "data": "las ideas e información solicitadas en la presentación",
      "production": "Relaciona en inglés las ideas e información de la presentación con un orden que permite seguir el asunto y su propósito.",
      "error": "cambia el asunto o las relaciones entre las ideas de la presentación",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "argumentation",
      "match": "argumentacion(?:es)?|argumentations?",
      "title": "Punto de vista y razones de la argumentación",
      "data": "el punto de vista y las razones solicitadas de la argumentación",
      "production": "Relaciona en inglés el punto de vista de la argumentación con las razones solicitadas para sustentarlo ante el interlocutor.",
      "error": "las razones contradicen el punto de vista o no se relacionan con él",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    }
  ],
  "englishGradeFiveModule": {
    "id": "ingles-comunicacion-5",
    "grade": 5,
    "subjectCode": "ING",
    "pdfPages": [
      163,
      164,
      165,
      166,
      167,
      168
    ],
    "policy": "COMMON_FIFTH_GRADE_DEFINED_FAMILIES_REVIEW_PENDING_V1"
  },
  "englishGradeFiveGrammar": [
    {
      "id": "question-tags",
      "match": "\\b(?:question tags?)\\b",
      "name": "las question tags",
      "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada",
      "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación"
    },
    {
      "id": "comparative",
      "match": "\\b(?:comparativos?|comparative|superlativos?|superlative)\\b",
      "name": "el grado comparativo o superlativo solicitado",
      "function": "establecer una comparación o destacar un elemento dentro de un conjunto",
      "error": "confunde la relación entre dos elementos con la selección de uno dentro de un conjunto",
      "terms": [
        [
          "\\bcomparativos?\\b|\\bcomparative\\b",
          "el grado comparativo"
        ],
        [
          "\\bsuperlativos?\\b|\\bsuperlative\\b",
          "el grado superlativo"
        ]
      ]
    },
    {
      "id": "time-adverbs",
      "match": "\\b(?:adverbios? de tiempo|adverbs? of time)\\b",
      "name": "los adverbios de tiempo",
      "function": "indicar cuándo ocurre la acción",
      "error": "desplaza la acción a un momento distinto del indicado"
    },
    {
      "id": "manner-adverbs",
      "match": "\\b(?:adverbios? de modo|adverbs? of manner)\\b",
      "name": "los adverbios de modo",
      "function": "precisar cómo se realiza una acción",
      "error": "altera la manera en que se realiza la acción descrita"
    },
    {
      "id": "time-connectors",
      "match": "\\b(?:conectores? de tiempo|temporal connectors?)\\b",
      "name": "los conectores de tiempo",
      "function": "relacionar los momentos en que ocurren las acciones",
      "error": "invierte la relación de anterioridad o posterioridad de las acciones"
    },
    {
      "id": "sequence-connectors",
      "match": "\\b(?:conectores? de secuencia|sequence connectors?)\\b",
      "name": "los conectores de secuencia",
      "function": "ordenar pasos o acontecimientos",
      "error": "cambia el orden necesario para seguir los pasos o acontecimientos"
    },
    {
      "id": "reflexive-pronouns",
      "match": "\\b(?:pronombres? reflexivos?|reflexive pronouns?)\\b",
      "name": "los pronombres reflexivos",
      "function": "relacionar una acción con el mismo referente que la realiza",
      "error": "atribuye a otra persona una acción que recae sobre el sujeto"
    },
    {
      "id": "exclamation",
      "match": "\\b(?:oraciones? exclamativas?|exclamaciones?|exclamatory sentences?)\\b",
      "name": "las oraciones exclamativas",
      "function": "expresar una reacción relacionada con el acontecimiento comunicado",
      "error": "la forma comunica una reacción incompatible con el acontecimiento indicado"
    },
    {
      "id": "relative-pronouns",
      "match": "\\b(?:pronombres? relativos?|relative pronouns?)\\b",
      "name": "los pronombres relativos",
      "function": "enlazar información adicional con el referente al que corresponde",
      "error": "relaciona la información con una persona o elemento distinto"
    },
    {
      "id": "contrast-connectors",
      "match": "\\b(?:conectores? de contraste|contrast connectors?)\\b",
      "name": "los conectores de contraste",
      "function": "contrastar ideas o puntos de vista relacionados",
      "error": "presenta como equivalentes ideas que deben contrastarse"
    },
    {
      "id": "concession-connectors",
      "match": "\\b(?:conectores? de concesion|concession connectors?)\\b",
      "name": "los conectores de concesión",
      "function": "relacionar una circunstancia con un resultado que ocurre pese a ella",
      "error": "presenta la circunstancia como causa necesaria del resultado o elimina la concesión"
    },
    {
      "id": "declarative",
      "match": "\\b(?:oraciones? (?:enunciativas?|afirmativas?|negativas?)|declarative sentences?)\\b",
      "name": "las oraciones enunciativas solicitadas",
      "function": "comunicar una afirmación positiva o negativa con el sentido solicitado",
      "error": "invierte la afirmación o negación del mensaje",
      "terms": [
        [
          "afirmativas?",
          "las oraciones afirmativas"
        ],
        [
          "negativas?",
          "las oraciones negativas"
        ]
      ]
    },
    {
      "id": "interrogative-sentences",
      "match": "\\b(?:oraciones? interrogativas?|preguntas? directas?|interrogative sentences?)\\b",
      "name": "las oraciones interrogativas",
      "function": "preguntar por la información indicada mediante una pregunta directa comprensible",
      "error": "pregunta por otro asunto o cambia la relación entre los referentes"
    },
    {
      "id": "used-to",
      "match": "\\b(?:used to)\\b",
      "name": "used to",
      "function": "expresar un hábito pasado del referente indicado",
      "error": "presenta como hábito actual la situación pasada"
    },
    {
      "id": "verb-complements",
      "match": "\\b(?:verbos? (?:seguidos (?:por|de)|que admiten) (?:infinitivo|gerundio)(?: o gerundio)?|verb complements?)\\b",
      "name": "el complemento verbal en infinitivo o gerundio solicitado",
      "function": "seleccionar un complemento compatible con el verbo para comunicar la acción indicada",
      "error": "el complemento no es compatible con el verbo elegido o cambia la acción comunicada",
      "terms": [
        [
          "infinitivo",
          "el complemento en infinitivo"
        ],
        [
          "gerundio",
          "el complemento en gerundio"
        ]
      ]
    },
    {
      "id": "indirect-questions",
      "match": "\\b(?:preguntas? indirectas?|preguntas? integradas?|embedded questions?|indirect questions?)\\b",
      "name": "las preguntas indirectas o integradas solicitadas",
      "function": "integrar la pregunta dentro de otra expresión conservando la información solicitada y el orden correspondiente",
      "error": "la pregunta integrada cambia la información pedida o el orden que permite comprenderla"
    },
    {
      "id": "zero-article",
      "match": "\\b(?:omision del articulo|articulo cero|zero article)\\b",
      "name": "la omisión del artículo solicitada",
      "function": "conservar la referencia general que el contexto permite expresar sin artículo",
      "error": "cambia una referencia general por una específica o elimina un artículo necesario en el contexto"
    },
    {
      "id": "frequency-adverbs",
      "match": "\\b(?:adverbios? de frecuencia|adverbs? of frequency)\\b",
      "name": "los adverbios de frecuencia",
      "function": "expresar la frecuencia de la acción indicada",
      "error": "confunde una acción habitual con una ocasional o inexistente"
    },
    {
      "id": "preposition-use",
      "match": "\\b(?:uso de preposiciones|preposiciones solicitadas)\\b",
      "name": "las preposiciones solicitadas",
      "function": "establecer la relación entre los elementos del mensaje según su sentido en la situación",
      "error": "la preposición cambia la relación solicitada entre los referentes"
    },
    {
      "id": "sentence-final-preposition",
      "match": "\\b(?:preposicion al final de la oracion|sentence final preposition)\\b",
      "name": "la preposición al final de la oración",
      "function": "mantener la relación de la preposición con su complemento aunque este se encuentre en otra posición de la oración",
      "error": "relaciona la preposición con un complemento diferente del indicado"
    },
    {
      "id": "present-simple",
      "match": "\\b(?:presente simple|present simple|simple present)\\b",
      "name": "el presente simple",
      "function": "comunicar los datos actuales de la consulta simulada o del problema reclamado según la situación indicada",
      "error": "cambia el referente o el sentido de los datos actuales de la situación"
    },
    {
      "id": "medical-verbs",
      "match": "\\b(?:be have feel y hurt|verbos? (?:be|have|feel|hurt))\\b",
      "name": "be, have, feel y hurt según los verbos solicitados",
      "function": "relacionar el estado o síntoma con el personaje de la ficha de la consulta simulada",
      "error": "atribuye al personaje un estado o síntoma diferente del proporcionado"
    },
    {
      "id": "suggest",
      "match": "\\b(?:suggest)\\b",
      "name": "suggest",
      "function": "proponer una recomendación relacionada con la necesidad indicada",
      "error": "la recomendación cambia la acción o el referente al que se dirige"
    },
    {
      "id": "advise",
      "match": "\\b(?:advise)\\b",
      "name": "advise",
      "function": "comunicar un consejo relacionado con la necesidad del referente indicado",
      "error": "el consejo cambia la necesidad o se dirige a otro referente"
    },
    {
      "id": "causatives",
      "match": "\\b(?:verbos causativos|causative verbs|get have y make)\\b",
      "name": "los verbos causativos solicitados",
      "function": "distinguir quién encarga o provoca la acción y quién la realiza o la recibe en la situación",
      "error": "atribuye la acción a quien la encarga o cambia quién la realiza o recibe"
    },
    {
      "id": "past-simple",
      "match": "\\b(?:pasado simple|past simple|simple past)\\b",
      "name": "el pasado simple",
      "function": "narrar el acontecimiento terminado con su referencia al pasado",
      "error": "presenta como actual un acontecimiento terminado o cambia el hecho narrado"
    },
    {
      "id": "present-perfect",
      "match": "\\b(?:presente perfecto(?! continuo)|present perfect(?! continuous))\\b",
      "name": "el presente perfecto",
      "function": "relacionar el antecedente del personaje de la consulta simulada con la situación presente",
      "error": "presenta el antecedente como un hecho en desarrollo o cambia su relación con el presente"
    },
    {
      "id": "present-perfect-continuous",
      "match": "\\b(?:presente perfecto continuo|present perfect continuous)\\b",
      "name": "el presente perfecto continuo",
      "function": "comunicar la continuidad del estado o actividad que se relaciona con la consulta simulada o la información reportada",
      "error": "cambia una situación continuada por un hecho terminado o altera su duración"
    },
    {
      "id": "past-continuous",
      "match": "\\b(?:pasado continuo|past continuous)\\b",
      "name": "el pasado continuo",
      "function": "situar la acción en desarrollo con la que se relaciona otro acontecimiento de la narración",
      "error": "confunde la acción en desarrollo y el acontecimiento terminado o altera su relación"
    },
    {
      "id": "past-perfect",
      "match": "\\b(?:pasado perfecto|past perfect)\\b",
      "name": "el pasado perfecto",
      "function": "distinguir el acontecimiento anterior a otro hecho pasado de la narración",
      "error": "invierte la anterioridad entre los acontecimientos del pasado"
    },
    {
      "id": "future-continuous",
      "match": "\\b(?:futuro continuo|future continuous)\\b",
      "name": "el futuro continuo",
      "function": "situar la acción que estará en desarrollo al reportar información o expresar una probabilidad",
      "error": "presenta como terminada la acción futura en desarrollo o cambia su referencia temporal"
    },
    {
      "id": "modal-cannot",
      "match": "\\b(?:can t|cannot)\\b",
      "name": "can’t",
      "function": "comunicar la prohibición de la acción en la situación indicada",
      "error": "presenta como permitida la acción que la situación prohíbe"
    },
    {
      "id": "modal-must",
      "match": "\\b(?:must)\\b",
      "name": "must",
      "function": "expresar la obligación o la certeza deducida de los indicios según la intención solicitada",
      "error": "confunde una obligación con una opción o una deducción con un hecho directamente observado"
    },
    {
      "id": "modal-have-to",
      "match": "\\b(?:have to)\\b",
      "name": "have to",
      "function": "comunicar la obligación establecida en las condiciones de la situación",
      "error": "convierte en opcional la obligación o cambia la acción requerida"
    },
    {
      "id": "modal-should",
      "match": "\\b(?:should)\\b",
      "name": "should",
      "function": "comunicar un consejo relacionado con la necesidad del personaje",
      "error": "presenta el consejo como un hecho ya ocurrido o cambia la recomendación"
    },
    {
      "id": "modal-ought-to",
      "match": "\\b(?:ought to)\\b",
      "name": "ought to",
      "function": "comunicar una recomendación relacionada con los datos de la situación",
      "error": "cambia la acción recomendada o su referente"
    },
    {
      "id": "modal-supposed-to",
      "match": "\\b(?:be supposed to)\\b",
      "name": "be supposed to",
      "function": "comunicar la acción esperada por la norma o acuerdo proporcionado",
      "error": "atribuye al acuerdo una expectativa diferente de la indicada"
    },
    {
      "id": "modal-need-to",
      "match": "\\b(?:need to)\\b",
      "name": "need to",
      "function": "comunicar la necesidad de una acción en la situación indicada",
      "error": "cambia la acción necesaria o la presenta como ya realizada"
    },
    {
      "id": "modal-may",
      "match": "\\b(?:may)\\b",
      "name": "may",
      "function": "comunicar una posibilidad o una solicitud cortés al obtener bienes o servicios según la intención indicada",
      "error": "presenta la posibilidad como confirmada o cambia la solicitud de la transacción"
    },
    {
      "id": "modal-might",
      "match": "\\b(?:might)\\b",
      "name": "might",
      "function": "expresar una posibilidad incierta relacionada con los indicios de la situación",
      "error": "presenta como seguro lo que los indicios solo permiten considerar posible"
    },
    {
      "id": "modal-could",
      "match": "\\b(?:could)\\b",
      "name": "could",
      "function": "comunicar una posibilidad o una solicitud cortés de bienes o servicios según la intención indicada",
      "error": "altera el grado de posibilidad o cambia el sentido de la solicitud"
    },
    {
      "id": "modal-will",
      "match": "\\b(?:will)\\b",
      "name": "will",
      "function": "comunicar la elección o solicitud futura del bien o servicio indicado",
      "error": "sitúa como ya realizada una elección futura o cambia el bien solicitado"
    },
    {
      "id": "modal-would-like",
      "match": "\\b(?:would like)\\b",
      "name": "would like",
      "function": "solicitar cortésmente el bien o servicio indicado",
      "error": "atribuye al interlocutor una solicitud distinta de la indicada"
    },
    {
      "id": "modal-can",
      "match": "\\b(?:can(?! t\\b))\\b",
      "name": "can",
      "function": "solicitar el bien o servicio de la transacción mediante una expresión cortés",
      "error": "cambia lo solicitado o lo presenta como una orden incompatible con la situación"
    },
    {
      "id": "phrasal-verbs",
      "match": "\\b(?:phrasal verbs|verbos frasales|settle down|pick up)\\b",
      "name": "los phrasal verbs solicitados",
      "function": "relacionar el verbo y su partícula con el significado de la acción indicada",
      "error": "atribuye al conjunto otro significado o relaciona la partícula con otro referente"
    },
    {
      "id": "there-be",
      "match": "\\b(?:there be|there was|there were)\\b",
      "name": "there + be en pasado",
      "function": "comunicar la existencia de un acontecimiento o referente al narrar hechos pasados",
      "error": "cambia la existencia o sitúa como presente el acontecimiento pasado"
    },
    {
      "id": "mixed-conditional",
      "match": "\\b(?:condicional mixto|mixed conditional)\\b",
      "name": "el condicional mixto indicado",
      "function": "relacionar la condición con el resultado modal que depende de ella en la situación",
      "error": "presenta el resultado como incondicional o cambia la relación entre condición y modalidad"
    },
    {
      "id": "second-conditional",
      "match": "\\b(?:segundo condicional|second conditional)\\b",
      "name": "el segundo condicional",
      "function": "relacionar una situación hipotética con su resultado posible sin presentarla como un hecho confirmado",
      "error": "presenta la hipótesis como real o invierte la relación entre la condición y su resultado"
    },
    {
      "id": "passive",
      "match": "\\b(?:voz pasiva|passive voice)\\b",
      "name": "la voz pasiva de la narración",
      "function": "relacionar el acontecimiento narrado con el referente que recibe la acción",
      "error": "atribuye al receptor la realización de la acción o cambia el acontecimiento"
    },
    {
      "id": "reported-speech",
      "match": "\\b(?:reported speech|estilo indirecto|discurso indirecto)\\b",
      "name": "el estilo indirecto solicitado",
      "function": "reportar lo dicho conservando la información, sus referentes y las relaciones temporales indicadas",
      "error": "atribuye la afirmación a otra persona o cambia sus referentes y sentido temporal"
    },
    {
      "id": "emphatic-do",
      "match": "\\b(?:oraciones enfaticas con do|emphatic do)\\b",
      "name": "el uso enfático de do",
      "function": "enfatizar la afirmación conservando la acción y su referencia temporal",
      "error": "el énfasis cambia la afirmación o altera el momento de la acción"
    },
    {
      "id": "quantity-adverbs",
      "match": "\\b(?:adverbios de cantidad|adverbs of quantity)\\b",
      "name": "los adverbios y frases adverbiales de cantidad",
      "function": "precisar la cantidad comunicada en la situación",
      "error": "cambia la cantidad que debe reconocer el destinatario"
    },
    {
      "id": "probability-adverbs",
      "match": "\\b(?:adverbios de probabilidad|adverbios de certeza|adverbs of probability|adverbs of certainty)\\b",
      "name": "las expresiones adverbiales de probabilidad o certeza solicitadas",
      "function": "expresar el grado de probabilidad o seguridad de la información",
      "error": "presenta como seguro lo posible o atribuye duda a lo confirmado por los datos"
    },
    {
      "id": "emphatic-reflexives",
      "match": "\\b(?:uso enfatico de los pronombres reflexivos|emphatic reflexive pronouns)\\b",
      "name": "el uso enfático de los pronombres reflexivos",
      "function": "destacar al referente que realiza la acción sin cambiar su identidad",
      "error": "atribuye el énfasis a otro referente o confunde énfasis y acción reflexiva"
    },
    {
      "id": "how-much-many",
      "match": "\\b(?:how much|how many)\\b",
      "name": "how much o how many según la cantidad solicitada",
      "function": "preguntar por la cantidad o el precio en la transacción indicada",
      "error": "pregunta por un precio cuando se requiere cantidad de elementos o altera lo solicitado"
    },
    {
      "id": "why-suggestion",
      "match": "\\b(?:why don t|why not)\\b",
      "name": "why don’t o why not según la forma solicitada",
      "function": "proponer una acción como consejo o sugerencia en la situación indicada",
      "error": "la forma cambia la propuesta por otra acción o altera su destinatario"
    },
    {
      "id": "addition-connectors",
      "match": "\\b(?:conectores de adicion|addition connectors)\\b",
      "name": "los conectores de adición",
      "function": "añadir información relacionada con la idea anterior",
      "error": "presenta como oposición o alternativa la información que debe añadirse"
    },
    {
      "id": "condition-connectors",
      "match": "\\b(?:conectores de condicion|condition connectors)\\b",
      "name": "los conectores de condición",
      "function": "relacionar una acción con la condición que permite realizarla",
      "error": "elimina la condición o invierte su relación con la acción"
    },
    {
      "id": "correlative-connectors",
      "match": "\\b(?:conectores de correlacion|correlative connectors)\\b",
      "name": "los conectores de correlación solicitados",
      "function": "relacionar los elementos con la suma, alternativa o negación correlativa indicada",
      "error": "confunde suma, alternativa y negación o deja sin relacionar un elemento de la correlación"
    },
    {
      "id": "illustration-connectors",
      "match": "\\b(?:conectores de ilustracion|illustration connectors)\\b",
      "name": "los conectores de ilustración",
      "function": "relacionar una idea con el ejemplo que permite ilustrarla",
      "error": "el ejemplo contradice o no se relaciona con la idea que debía ilustrar"
    }
  ],
  "englishGradeFiveLexicon": [
    {
      "id": "events",
      "match": "\\b(?:acontecimientos)\\b",
      "name": "acontecimientos",
      "function": "relacionar el acontecimiento con el referente y momento indicados",
      "error": "confunde el acontecimiento comunicado con otro",
      "category": "vocabulary"
    },
    {
      "id": "activities",
      "match": "\\b(?:actividades)\\b",
      "name": "actividades",
      "function": "relacionar la acción indicada y su relación con el referente de la situación",
      "error": "atribuye al referente una actividad distinta",
      "category": "vocabulary"
    },
    {
      "id": "goods-services",
      "match": "\\b(?:bienes y servicios|goods and services)\\b",
      "name": "bienes y servicios",
      "function": "relacionar el bien o servicio con la necesidad indicada en la transacción",
      "error": "confunde un bien con otro servicio o cambia lo solicitado",
      "category": "vocabulary"
    },
    {
      "id": "qualifiers",
      "match": "\\b(?:calificativos)\\b",
      "name": "calificativos",
      "function": "relacionar la intensidad o característica expresada por el calificativo en la situación",
      "error": "cambia la característica o la gravedad comunicada",
      "category": "vocabulary"
    },
    {
      "id": "money-payment",
      "match": "\\b(?:dinero y formas de pago)\\b",
      "name": "dinero y formas de pago",
      "function": "relacionar el importe o medio de pago con la transacción proporcionada",
      "error": "atribuye a la transacción otro importe o medio de pago",
      "category": "vocabulary"
    },
    {
      "id": "education",
      "match": "\\b(?:educacion)\\b",
      "name": "educación",
      "function": "relacionar el nivel, curso o institución educativa de la información dada",
      "error": "cambia el nivel o institución educativa del referente",
      "category": "vocabulary"
    },
    {
      "id": "narrative-elements",
      "match": "\\b(?:elementos de (?:una |la )?narracion|narrative elements)\\b",
      "name": "elementos de una narración",
      "function": "relacionar el personaje, trama o ambiente solicitado con su papel en la narración",
      "error": "confunde el personaje, trama o ambiente del ejemplo",
      "category": "vocabulary"
    },
    {
      "id": "symptoms",
      "match": "\\b(?:enfermedades y sintomas)\\b",
      "name": "enfermedades y síntomas",
      "function": "relacionar el síntoma o enfermedad nombrados en la ficha del personaje ficticio",
      "error": "atribuye al personaje otro síntoma o enfermedad",
      "category": "vocabulary"
    },
    {
      "id": "office-equipment",
      "match": "\\b(?:equipos y materiales de oficina)\\b",
      "name": "equipos y materiales de oficina",
      "function": "relacionar el equipo o material con la acción de oficina indicada",
      "error": "confunde el equipo y el material mencionados",
      "category": "vocabulary"
    },
    {
      "id": "medical-specialties",
      "match": "\\b(?:especialidades medicas)\\b",
      "name": "especialidades médicas",
      "function": "relacionar la especialidad mencionada en la información de la consulta simulada",
      "error": "confunde la especialidad nombrada con otra",
      "category": "vocabulary"
    },
    {
      "id": "establishments",
      "match": "\\b(?:establecimientos)\\b",
      "name": "establecimientos",
      "function": "relacionar el establecimiento con el servicio o referente de la situación",
      "error": "atribuye el servicio a otro establecimiento",
      "category": "vocabulary"
    },
    {
      "id": "organized-events",
      "match": "\\b(?:eventos)\\b",
      "name": "eventos",
      "function": "relacionar el evento con la información proporcionada de su realización",
      "error": "confunde el evento o su referente",
      "category": "vocabulary"
    },
    {
      "id": "contingencies",
      "match": "\\b(?:eventualidades)\\b",
      "name": "eventualidades",
      "function": "relacionar el contratiempo del personaje con lo ocurrido en la situación",
      "error": "atribuye al personaje otro contratiempo",
      "category": "vocabulary"
    },
    {
      "id": "places-monuments",
      "match": "\\b(?:lugares y monumentos)\\b",
      "name": "lugares y monumentos",
      "function": "relacionar el lugar o monumento con la referencia de la información dada",
      "error": "confunde el lugar o monumento mencionado",
      "category": "vocabulary"
    },
    {
      "id": "medicines",
      "match": "\\b(?:medicamentos)\\b",
      "name": "medicamentos",
      "function": "relacionar el medicamento nombrado en los datos de una situación ficticia, sin recomendar tratamientos",
      "error": "cambia el nombre comunicado en la ficha",
      "category": "vocabulary"
    },
    {
      "id": "measurements",
      "match": "\\b(?:medidas)\\b",
      "name": "medidas",
      "function": "relacionar la magnitud y unidad solicitadas con el dato de la situación",
      "error": "cambia la unidad o atribuye otra magnitud al dato",
      "category": "vocabulary"
    },
    {
      "id": "personal-objects",
      "match": "\\b(?:objetos personales)\\b",
      "name": "objetos personales",
      "function": "relacionar el objeto con el referente indicado en la situación ficticia",
      "error": "atribuye otro objeto o poseedor a la información",
      "category": "vocabulary"
    },
    {
      "id": "body-parts",
      "match": "\\b(?:partes del cuerpo)\\b",
      "name": "partes del cuerpo",
      "function": "relacionar la parte del cuerpo mencionada con el personaje de la ficha",
      "error": "atribuye al síntoma o dato otra parte del cuerpo",
      "category": "vocabulary"
    },
    {
      "id": "famous-people",
      "match": "\\b(?:personajes celebres)\\b",
      "name": "personajes célebres",
      "function": "relacionar la persona mencionada con los datos de su referencia proporcionada",
      "error": "atribuye a una persona los datos de otra",
      "category": "vocabulary"
    },
    {
      "id": "medical-procedures",
      "match": "\\b(?:procedimientos medicos)\\b",
      "name": "procedimientos médicos",
      "function": "relacionar el procedimiento nombrado con los datos de la consulta ficticia, sin ejecutarlo ni indicarlo como tratamiento",
      "error": "confunde el procedimiento comunicado en la ficha",
      "category": "vocabulary"
    },
    {
      "id": "reporting-verbs",
      "match": "\\b(?:reportar informacion)\\b",
      "name": "reportar información",
      "function": "relacionar quién comunica la información con la acción de decir, contar o explicar solicitada",
      "error": "atribuye la información a otra persona o cambia cómo se comunica",
      "category": "vocabulary"
    },
    {
      "id": "transactions",
      "match": "\\b(?:transacciones)\\b",
      "name": "transacciones",
      "function": "relacionar la acción de compra, alquiler o depósito solicitada con sus referentes",
      "error": "cambia la operación o su referente",
      "category": "vocabulary"
    },
    {
      "id": "encouragement",
      "match": "\\b(?:animar(?: y motivar)?|motivar|dar animo)\\b",
      "name": "animar y motivar",
      "function": "comunicar ánimo relacionado con la situación o actuación del referente",
      "error": "la expresión comunica una intención incompatible con el ánimo solicitado",
      "category": "expression"
    },
    {
      "id": "confirmation",
      "match": "\\b(?:confirmar informacion)\\b",
      "name": "confirmar información",
      "function": "confirmar la información comunicada por el interlocutor o solicitar su confirmación según la intención indicada",
      "error": "confirma información diferente o atribuye al interlocutor otra afirmación",
      "category": "expression"
    },
    {
      "id": "date",
      "match": "\\b(?:expresar (?:una |la )?fecha|fechas?)\\b",
      "name": "expresar una fecha",
      "function": "comunicar la fecha de la situación con el día, mes o año solicitados",
      "error": "cambia una referencia de la fecha indicada",
      "category": "expression"
    },
    {
      "id": "time",
      "match": "\\b(?:expresar (?:una |la )?hora|horas?)\\b",
      "name": "expresar la hora",
      "function": "comunicar la hora indicada con sus referencias temporales",
      "error": "cambia la hora de la situación comunicada",
      "category": "expression"
    },
    {
      "id": "courtesy",
      "match": "\\b(?:expresarse con cortesia|formulas de cortesia)\\b",
      "name": "expresarse con cortesía",
      "function": "comunicar la intención solicitada mediante una fórmula cortés pertinente para el interlocutor",
      "error": "la expresión comunica un trato o intención incompatible con la situación",
      "category": "expression"
    },
    {
      "id": "offer-help",
      "match": "\\b(?:ofrecer(?:an)? ayuda)\\b",
      "name": "ofrecer ayuda",
      "function": "ofrecer apoyo relacionado con la necesidad comunicada por el interlocutor",
      "error": "ofrece una acción que no responde a la necesidad indicada",
      "category": "expression"
    },
    {
      "id": "ask-help",
      "match": "\\b(?:pedir(?:an)? ayuda|solicitar(?:an)? ayuda|pidan ayuda)\\b",
      "name": "pedir ayuda",
      "function": "solicitar la ayuda pertinente precisando la necesidad o parte del mensaje que requiere apoyo",
      "error": "la solicitud pide otro apoyo o no permite reconocer la necesidad",
      "category": "expression"
    }
  ],
  "englishGradeSixGenres": [
    {
      "id": "conversation",
      "match": "conversacion(?:es)?|dialogos?",
      "title": "Intercambio de la conversación",
      "data": "la relación entre las intervenciones de los interlocutores",
      "production": "Relaciona sus intervenciones en inglés con las de los interlocutores para mantener el intercambio acordado.",
      "error": "confunde quién interviene o a qué intervención responde",
      "modes": [
        "listening",
        "oral",
        "interaction"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "business-card",
      "match": "tarjetas? de presentacion|business cards?",
      "title": "Datos de la tarjeta de presentación",
      "data": "los datos de identificación y contacto solicitados de la tarjeta",
      "production": "Dispone en inglés los datos de identificación y contacto solicitados de la persona o personaje indicado.",
      "error": "atribuye los datos de la tarjeta a un referente diferente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "list",
      "match": "listas?(?! (?:de cotejo|ponderadas?|de verificacion|de control|de observacion))",
      "title": "Elementos de la lista",
      "data": "los elementos de la lista que corresponden a la búsqueda solicitada",
      "production": "Presenta en inglés los elementos de la lista pertinentes para la finalidad indicada.",
      "error": "incorpora elementos ajenos a la categoría o finalidad de la lista",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "advertisement",
      "match": "anuncios?|advertisements?",
      "title": "Producto o servicio anunciado",
      "data": "el producto o servicio y la información solicitada del anuncio",
      "production": "Comunica en inglés el producto o servicio anunciado y la información necesaria para el destinatario acordado.",
      "error": "atribuye al producto o servicio características diferentes de las comunicadas",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "recipe",
      "match": "recetas?|recipes?",
      "title": "Acciones de la receta",
      "data": "las acciones de preparación y su orden en la receta",
      "production": "Comunica en inglés las acciones de preparación de la receta en un orden que permite seguir las instrucciones.",
      "error": "invierte o cambia acciones de preparación y altera las instrucciones",
      "existingFunction": "instructions",
      "modes": [
        "reading",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "sign",
      "match": "letreros?|signs?",
      "title": "Indicación del letrero",
      "data": "la indicación del letrero para la situación en que aparece",
      "production": "Comunica en inglés la indicación del letrero de forma breve y comprensible para el destinatario.",
      "error": "confunde una indicación con su prohibición o comunica una acción diferente",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "notice",
      "match": "avisos?|notices?",
      "title": "Información del aviso",
      "data": "la información del aviso que permite comprender lo comunicado",
      "production": "Comunica en inglés la información del aviso necesaria para reconocer la situación anunciada.",
      "error": "cambia lo anunciado o a quién se dirige el aviso",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poster",
      "match": "afiches?|carteles?|posters?",
      "title": "Mensaje del afiche",
      "data": "el mensaje central del afiche y la información solicitada",
      "production": "Dispone en inglés el mensaje central del afiche de forma legible y relacionada con su propósito comunicativo.",
      "error": "el mensaje dispuesto comunica un propósito diferente del solicitado",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "message",
      "match": "mensajes?|messages?",
      "title": "Propósito del mensaje",
      "data": "el propósito del mensaje y los datos solicitados para comprenderlo",
      "production": "Comunica en inglés las ideas necesarias para cumplir el propósito del mensaje en la situación acordada.",
      "error": "el contenido cambia la intención o el destinatario del mensaje",
      "modes": [
        "reading",
        "listening",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "email",
      "match": "correos?(?: electronicos?)?|e mails?|emails?",
      "title": "Comunicación por correo electrónico",
      "data": "el destinatario y propósito del correo y su información solicitada",
      "production": "Relaciona el destinatario y propósito del correo con un cuerpo breve en inglés que permite comprender lo comunicado.",
      "error": "dirige a otra persona información que no corresponde al propósito del correo",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "cv",
      "match": "curriculum vitae|curriculum|cv",
      "title": "Perfil del currículum vitae",
      "data": "los datos de perfil solicitados en el currículum vitae",
      "production": "Organiza en inglés los datos de perfil solicitados de una persona real o ficticia para el currículum vitae acordado.",
      "error": "atribuye datos de perfil a otra persona o los ubica en un apartado diferente",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "letter",
      "match": "cartas?|letters?",
      "title": "Comunicación de la carta",
      "data": "el destinatario y propósito de la carta y la información solicitada",
      "production": "Relaciona el destinatario y propósito de la carta con un mensaje breve en inglés que permite comprender lo comunicado.",
      "error": "el mensaje se dirige a un destinatario o propósito diferente del acordado",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "form",
      "match": "formularios?|forms?",
      "title": "Información del formulario",
      "data": "los campos solicitados del formulario y los datos que contienen o requieren",
      "production": "Completa en inglés los campos solicitados con datos pertinentes de la persona o situación real o ficticia indicada.",
      "error": "sitúa los datos en campos que piden una información diferente",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "forecast",
      "match": "pronosticos? del tiempo|weather forecasts?",
      "title": "Información del pronóstico",
      "data": "las condiciones atmosféricas y sus referencias solicitadas en el pronóstico",
      "production": "Comunica en inglés las condiciones atmosféricas del pronóstico y las referencias solicitadas.",
      "error": "atribuye al pronóstico condiciones diferentes de las indicadas",
      "existingFunction": "weather",
      "modes": [
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "news",
      "match": "noticias?|news",
      "title": "Información de la noticia",
      "data": "el suceso comunicado y los datos solicitados de la noticia",
      "production": "Comunica en inglés el suceso comunicado y los datos necesarios para reconocer qué ocurrió en la noticia.",
      "error": "cambia el suceso o atribuye sus datos a otro acontecimiento",
      "modes": [
        "reading",
        "listening",
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "schedule",
      "match": "horarios?|timetables?",
      "title": "Actividad y momento del horario",
      "data": "la actividad y momento que corresponden a la consulta del horario",
      "production": "Relaciona en inglés cada actividad y momento solicitado para que el horario pueda consultarse.",
      "error": "asigna a la actividad un momento diferente del indicado",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "agenda",
      "match": "agendas?",
      "title": "Compromisos de la agenda",
      "data": "los compromisos y sus referencias temporales solicitadas en la agenda",
      "production": "Relaciona en inglés los compromisos con las referencias temporales necesarias para consultar la agenda.",
      "error": "cambia la correspondencia entre el compromiso y su momento",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "map",
      "match": "croquis|mapas?|maps?",
      "title": "Referencias del croquis",
      "data": "las ubicaciones y referencias del croquis necesarias para responder a la consulta",
      "production": "Relaciona las ubicaciones y referencias del croquis con las indicaciones en inglés solicitadas.",
      "error": "invierte una ubicación o referencia y cambia el recorrido consultado",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "questionnaire",
      "match": "cuestionarios?|questionnaires?",
      "title": "Información buscada por las preguntas",
      "data": "la información buscada por las preguntas del cuestionario",
      "production": "Formula en inglés preguntas comprensibles que permiten obtener la información buscada en la situación acordada.",
      "error": "formula o interpreta preguntas que buscan información distinta de la solicitada",
      "modes": [
        "reading",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "brochure",
      "match": "folletos?|brochures?",
      "title": "Información del folleto",
      "data": "la información del folleto pertinente para la consulta solicitada",
      "production": "Dispone en inglés la información del folleto de modo que el destinatario pueda encontrar los datos solicitados.",
      "error": "la organización o los datos del folleto conducen a información diferente de la solicitada",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "song",
      "match": "cancion(?:es)?|songs?",
      "title": "Mensaje de la canción",
      "data": "el mensaje de la canción expresado por las palabras solicitadas",
      "production": "Comunica el mensaje de la canción en inglés con palabras y expresiones comprensibles mediante la interpretación acordada.",
      "error": "cambia palabras o relaciones que alteran el sentido del mensaje de la canción",
      "modes": [
        "reading",
        "listening",
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "poem",
      "match": "poesias?|poemas?|poems?",
      "title": "Sentido de los versos",
      "data": "el sentido de los versos y las expresiones solicitadas de la poesía",
      "production": "Comunica en inglés el sentido de los versos mediante las expresiones de la producción acordada.",
      "error": "atribuye a los versos un sentido incompatible con sus palabras",
      "modes": [
        "reading",
        "listening"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "comic",
      "match": "historietas?|comics?",
      "title": "Secuencia de la historieta",
      "data": "la relación entre las viñetas y los mensajes de la historieta",
      "production": "Relaciona en inglés los mensajes con las viñetas para que la secuencia de la historieta resulte comprensible.",
      "error": "invierte la secuencia o atribuye a una viñeta un mensaje diferente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "tourist-guide",
      "match": "guias? turisticas?|tourist guides?",
      "title": "Orientaciones de la guía turística",
      "data": "los lugares y orientaciones de la guía pertinentes para la consulta",
      "production": "Comunica en inglés los lugares y orientaciones de la guía que permiten atender la consulta acordada.",
      "error": "confunde los lugares o las orientaciones y conduce a información diferente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "description",
      "match": "descripcion(?:es)?|descriptions?",
      "title": "Características de lo descrito",
      "data": "las características solicitadas y el referente descrito",
      "production": "Relaciona en inglés las características solicitadas con la persona, lugar u objeto descrito.",
      "error": "atribuye las características a un referente distinto",
      "existingFunction": "description",
      "modes": [
        "reading",
        "listening",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "biography",
      "match": "biografias?|biographies",
      "title": "Acontecimientos de la biografía",
      "data": "los acontecimientos de la vida de la persona y sus relaciones solicitadas",
      "production": "Comunica en inglés los acontecimientos de la vida de la persona real o ficticia indicada con relaciones comprensibles.",
      "error": "atribuye los acontecimientos a otra persona o cambia su relación",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "narrative",
      "match": "narracion(?:es)?|relatos?|narratives?",
      "title": "Acontecimientos de la narración",
      "data": "los acontecimientos y personajes presentes en la narración y las relaciones solicitadas",
      "production": "Relaciona en inglés los acontecimientos y personajes, cuando corresponda, para que la narración real o ficticia se comprenda.",
      "error": "cambia los acontecimientos o sus relaciones y altera la narración",
      "modes": [
        "reading",
        "listening",
        "oral",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "menu",
      "match": "menus?|menus en ingles",
      "title": "Información consultada del menú",
      "data": "los productos y la información solicitada del menú",
      "production": "",
      "error": "atribuye a un producto información de otro elemento del menú",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "monologue",
      "match": "monologos?|monologues?",
      "title": "Ideas del monólogo",
      "data": "las ideas relacionadas con el asunto del monólogo",
      "production": "Comunica en inglés las ideas del monólogo solicitado mediante oraciones básicas enlazadas que permiten seguir el asunto.",
      "error": "las relaciones entre las ideas cambian el sentido del asunto comunicado",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "audiovisual",
      "match": "produccion(?:es)? audiovisual(?:es)?|videos?",
      "title": "Mensaje de la producción audiovisual",
      "data": "la relación entre los recursos seleccionados y el mensaje audiovisual",
      "production": "Relaciona los recursos seleccionados con un mensaje en inglés comprensible para el destinatario acordado.",
      "error": "los recursos comunican ideas incompatibles con el mensaje solicitado",
      "modes": [
        "audiovisual"
      ],
      "source": "EXPLICIT_TASK"
    },
    {
      "id": "catalog",
      "match": "catalogos?|catalogues?|catalogs?",
      "title": "Información consultada del catálogo",
      "data": "los elementos y la información solicitada del catálogo",
      "production": "",
      "error": "atribuye a un elemento información de otro del catálogo",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "dictionary",
      "match": "diccionarios?|dictionaries",
      "title": "Entrada y significado del diccionario",
      "data": "la entrada y el significado solicitados del diccionario",
      "production": "",
      "error": "atribuye a la palabra una acepción diferente de la consultada",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "invoice",
      "match": "facturas?|invoices?",
      "title": "Datos consultados de la factura",
      "data": "los datos solicitados de la factura y sus referentes",
      "production": "",
      "error": "atribuye los datos de la factura a otro producto o referente",
      "modes": [
        "reading"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "instructions",
      "match": "textos? de instrucciones|instrucciones|instructions",
      "title": "Pasos del texto de instrucciones",
      "data": "las acciones de las instrucciones y su orden",
      "production": "Comunica en inglés los pasos de las instrucciones en un orden que permite seguir la tarea indicada.",
      "error": "cambia las acciones o su orden y altera las instrucciones",
      "existingFunction": "instructions",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "presentation",
      "match": "presentacion(?:es)?|presentations?",
      "title": "Ideas relacionadas en la presentación",
      "data": "las ideas e información solicitadas en la presentación",
      "production": "Relaciona en inglés las ideas e información de la presentación con un orden que permite seguir el asunto y su propósito.",
      "error": "cambia el asunto o las relaciones entre las ideas de la presentación",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    },
    {
      "id": "argumentation",
      "match": "argumentacion(?:es)?|argumentations?",
      "title": "Punto de vista y razones de la argumentación",
      "data": "el punto de vista y las razones solicitadas de la argumentación",
      "production": "Relaciona en inglés el punto de vista de la argumentación con las razones solicitadas para sustentarlo ante el interlocutor.",
      "error": "las razones contradicen el punto de vista o no se relacionan con él",
      "modes": [
        "oral"
      ],
      "source": "CURRICULUM"
    }
  ],
  "englishGradeSixModule": {
    "id": "ingles-comunicacion-6",
    "grade": 6,
    "subjectCode": "ING",
    "pdfPages": [
      169,
      170,
      171,
      172,
      173,
      174
    ],
    "policy": "COMMON_SIXTH_GRADE_DEFINED_FAMILIES_REVIEW_PENDING_V1"
  },
  "englishGradeSixGrammar": [
    {
      "id": "question-tags",
      "match": "\\b(?:question tags?)\\b",
      "name": "las question tags",
      "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada",
      "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación"
    },
    {
      "id": "comparative",
      "match": "\\b(?:comparativos?|comparative|superlativos?|superlative)\\b",
      "name": "el grado comparativo o superlativo solicitado",
      "function": "establecer una comparación o destacar un elemento dentro de un conjunto",
      "error": "confunde la relación entre dos elementos con la selección de uno dentro de un conjunto",
      "terms": [
        [
          "\\bcomparativos?\\b|\\bcomparative\\b",
          "el grado comparativo"
        ],
        [
          "\\bsuperlativos?\\b|\\bsuperlative\\b",
          "el grado superlativo"
        ]
      ]
    },
    {
      "id": "time-adverbs",
      "match": "\\b(?:adverbios? de tiempo|adverbs? of time)\\b",
      "name": "los adverbios de tiempo",
      "function": "indicar cuándo ocurre la acción",
      "error": "desplaza la acción a un momento distinto del indicado"
    },
    {
      "id": "manner-adverbs",
      "match": "\\b(?:adverbios? de modo|adverbs? of manner)\\b",
      "name": "los adverbios de modo",
      "function": "precisar cómo se realiza una acción",
      "error": "altera la manera en que se realiza la acción descrita"
    },
    {
      "id": "time-connectors",
      "match": "\\b(?:conectores? de tiempo|temporal connectors?)\\b",
      "name": "los conectores de tiempo",
      "function": "relacionar los momentos en que ocurren las acciones",
      "error": "invierte la relación de anterioridad o posterioridad de las acciones"
    },
    {
      "id": "sequence-connectors",
      "match": "\\b(?:conectores? de secuencia|sequence connectors?)\\b",
      "name": "los conectores de secuencia",
      "function": "ordenar pasos o acontecimientos",
      "error": "cambia el orden necesario para seguir los pasos o acontecimientos"
    },
    {
      "id": "exclamation",
      "match": "\\b(?:oraciones? exclamativas?|exclamaciones?|exclamatory sentences?)\\b",
      "name": "las oraciones exclamativas",
      "function": "expresar una reacción relacionada con el acontecimiento comunicado",
      "error": "la forma comunica una reacción incompatible con el acontecimiento indicado"
    },
    {
      "id": "relative-pronouns",
      "match": "\\b(?:pronombres? relativos?|relative pronouns?)\\b",
      "name": "los pronombres relativos",
      "function": "enlazar información adicional con el referente al que corresponde",
      "error": "relaciona la información con una persona o elemento distinto"
    },
    {
      "id": "contrast-connectors",
      "match": "\\b(?:conectores? de contraste|contrast connectors?)\\b",
      "name": "los conectores de contraste",
      "function": "contrastar ideas o puntos de vista relacionados",
      "error": "presenta como equivalentes ideas que deben contrastarse"
    },
    {
      "id": "concession-connectors",
      "match": "\\b(?:conectores? de concesion|concession connectors?)\\b",
      "name": "los conectores de concesión",
      "function": "relacionar una circunstancia con un resultado que ocurre pese a ella",
      "error": "presenta la circunstancia como causa necesaria del resultado o elimina la concesión"
    },
    {
      "id": "declarative",
      "match": "\\b(?:oraciones? (?:enunciativas?|afirmativas?|negativas?)|declarative sentences?)\\b",
      "name": "las oraciones enunciativas solicitadas",
      "function": "comunicar una afirmación positiva o negativa con el sentido solicitado",
      "error": "invierte la afirmación o negación del mensaje",
      "terms": [
        [
          "afirmativas?",
          "las oraciones afirmativas"
        ],
        [
          "negativas?",
          "las oraciones negativas"
        ]
      ]
    },
    {
      "id": "interrogative-sentences",
      "match": "\\b(?:oraciones? interrogativas?|preguntas? directas?|interrogative sentences?)\\b",
      "name": "las oraciones interrogativas",
      "function": "preguntar por la información indicada mediante una pregunta directa comprensible",
      "error": "pregunta por otro asunto o cambia la relación entre los referentes"
    },
    {
      "id": "indirect-questions",
      "match": "\\b(?:preguntas? indirectas?|preguntas? integradas?|embedded questions?|indirect questions?)\\b",
      "name": "las preguntas indirectas o integradas solicitadas",
      "function": "integrar la pregunta dentro de otra expresión conservando la información solicitada y el orden correspondiente",
      "error": "la pregunta integrada cambia la información pedida o el orden que permite comprenderla"
    },
    {
      "id": "zero-article",
      "match": "\\b(?:omision del articulo|articulo cero|zero article)\\b",
      "name": "la omisión del artículo solicitada",
      "function": "conservar la referencia general que el contexto permite expresar sin artículo",
      "error": "cambia una referencia general por una específica o elimina un artículo necesario en el contexto"
    },
    {
      "id": "frequency-adverbs",
      "match": "\\b(?:adverbios? de frecuencia|adverbs? of frequency)\\b",
      "name": "los adverbios de frecuencia",
      "function": "expresar la frecuencia de la acción indicada",
      "error": "confunde una acción habitual con una ocasional o inexistente"
    },
    {
      "id": "preposition-use",
      "match": "\\b(?:uso de preposiciones|preposiciones solicitadas)\\b",
      "name": "las preposiciones solicitadas",
      "function": "establecer la relación entre los elementos del mensaje según su sentido en la situación",
      "error": "la preposición cambia la relación solicitada entre los referentes"
    },
    {
      "id": "sentence-final-preposition",
      "match": "\\b(?:preposicion al final de la oracion|sentence final preposition)\\b",
      "name": "la preposición al final de la oración",
      "function": "mantener la relación de la preposición con su complemento aunque este se encuentre en otra posición de la oración",
      "error": "relaciona la preposición con un complemento diferente del indicado"
    },
    {
      "id": "causatives",
      "match": "\\b(?:verbos causativos|causative verbs|get have y make)\\b",
      "name": "los verbos causativos solicitados",
      "function": "distinguir quién encarga o provoca la acción y quién la realiza o la recibe en la situación",
      "error": "atribuye la acción a quien la encarga o cambia quién la realiza o recibe"
    },
    {
      "id": "second-conditional",
      "match": "\\b(?:segundo condicional|second conditional)\\b",
      "name": "el segundo condicional",
      "function": "relacionar una situación hipotética con su resultado posible sin presentarla como un hecho confirmado",
      "error": "presenta la hipótesis como real o invierte la relación entre la condición y su resultado"
    },
    {
      "id": "emphatic-reflexives",
      "match": "\\b(?:uso enfatico de los pronombres reflexivos|emphatic reflexive pronouns)\\b",
      "name": "el uso enfático de los pronombres reflexivos",
      "function": "destacar al referente que realiza la acción sin cambiar su identidad",
      "error": "atribuye el énfasis a otro referente o confunde énfasis y acción reflexiva"
    },
    {
      "id": "addition-connectors",
      "match": "\\b(?:conectores de adicion|addition connectors)\\b",
      "name": "los conectores de adición",
      "function": "añadir información relacionada con la idea anterior",
      "error": "presenta como oposición o alternativa la información que debe añadirse"
    },
    {
      "id": "correlative-connectors",
      "match": "\\b(?:conectores de correlacion|correlative connectors)\\b",
      "name": "los conectores de correlación solicitados",
      "function": "relacionar los elementos con la suma, alternativa o negación correlativa indicada",
      "error": "confunde suma, alternativa y negación o deja sin relacionar un elemento de la correlación"
    },
    {
      "id": "illustration-connectors",
      "match": "\\b(?:conectores de ilustracion|illustration connectors)\\b",
      "name": "los conectores de ilustración",
      "function": "relacionar una idea con el ejemplo que permite ilustrarla",
      "error": "el ejemplo contradice o no se relaciona con la idea que debía ilustrar"
    },
    {
      "id": "present-simple",
      "match": "\\b(?:presente simple(?! con valor futuro)|present simple(?! with future meaning)|simple present)\\b",
      "name": "el presente simple",
      "function": "expresar ideas relacionadas con el tema abstracto o cultural indicado",
      "error": "cambia el referente o el sentido de la idea sobre el tema"
    },
    {
      "id": "past-simple",
      "match": "\\b(?:pasado simple|past simple)\\b",
      "name": "el pasado simple",
      "function": "narrar el acontecimiento terminado y su relación con otros hechos de la experiencia indicada",
      "error": "sitúa como actual el acontecimiento pasado o cambia la relación entre los hechos"
    },
    {
      "id": "present-perfect",
      "match": "\\b(?:presente perfecto(?! continuo)|present perfect(?! continuous))\\b",
      "name": "el presente perfecto",
      "function": "relacionar la experiencia anterior del perfil o narración con su referencia presente",
      "error": "presenta como acción aún en desarrollo el acontecimiento anterior o pierde su relación con el presente"
    },
    {
      "id": "present-perfect-continuous",
      "match": "\\b(?:presente perfecto continuo|present perfect continuous)\\b",
      "name": "el presente perfecto continuo",
      "function": "comunicar la continuidad de la actividad del perfil o experiencia y su relación con el presente",
      "error": "presenta como terminada una actividad continuada o cambia su duración o referente"
    },
    {
      "id": "used-to",
      "match": "\\b(?:(?<!be )(?<!get )used to)\\b",
      "name": "used to",
      "function": "contrastar una costumbre pasada con la situación presente del referente",
      "error": "presenta como actual la costumbre pasada o elimina el contraste solicitado"
    },
    {
      "id": "be-used-to",
      "match": "\\b(?:be used to)\\b",
      "name": "be used to",
      "function": "expresar la costumbre o familiaridad establecida del referente con la actividad o situación indicada",
      "error": "presenta la familiaridad establecida como una acción pasada terminada o como una adaptación en curso"
    },
    {
      "id": "get-used-to",
      "match": "\\b(?:get used to)\\b",
      "name": "get used to",
      "function": "expresar el proceso de adaptación del referente a la actividad o situación nueva",
      "error": "presenta como costumbre ya establecida una adaptación en curso o cambia la situación nueva"
    },
    {
      "id": "past-continuous",
      "match": "\\b(?:pasado continuo|past continuous)\\b",
      "name": "el pasado continuo",
      "function": "situar la acción en desarrollo con la que se relaciona otro acontecimiento pasado de la narración",
      "error": "confunde la acción en desarrollo con el acontecimiento terminado o altera su relación"
    },
    {
      "id": "past-perfect",
      "match": "\\b(?:pasado perfecto(?! en voz pasiva)|past perfect(?! passive))\\b",
      "name": "el pasado perfecto",
      "function": "relacionar el acontecimiento anterior con otro hecho pasado de la narración",
      "error": "invierte la anterioridad entre los acontecimientos del pasado"
    },
    {
      "id": "present-simple-future",
      "match": "\\b(?:presente simple con valor futuro|present simple with future meaning)\\b",
      "name": "el presente simple con valor futuro",
      "function": "relacionar el compromiso o hecho programado con la justificación de una acción futura",
      "error": "sitúa como pasado el compromiso futuro o cambia su relación con la acción justificada"
    },
    {
      "id": "modal-must",
      "match": "\\b(?:must)\\b",
      "name": "must",
      "function": "justificar una conclusión o explicación mediante los indicios de la situación indicada",
      "error": "presenta una deducción como observación directa o contradice los indicios"
    },
    {
      "id": "modal-may",
      "match": "\\b(?:may)\\b",
      "name": "may",
      "function": "ofrecer una explicación posible compatible con los datos de la situación",
      "error": "presenta como confirmada una explicación posible o cambia su relación con los datos"
    },
    {
      "id": "modal-could",
      "match": "\\b(?:could)\\b",
      "name": "could",
      "function": "relacionar una explicación o acción posible con los datos que permiten considerarla",
      "error": "comunica certeza cuando se pide una posibilidad o contradice los datos disponibles"
    },
    {
      "id": "modal-might",
      "match": "\\b(?:might)\\b",
      "name": "might",
      "function": "expresar una explicación posible incierta relacionada con los indicios proporcionados",
      "error": "presenta como segura una explicación que los datos solo permiten considerar posible"
    },
    {
      "id": "verb-complements",
      "match": "\\b(?:verbos seguidos de gerundio|verbos seguidos de infinitivo|verbos que admiten infinitivo o gerundio|verb complements)\\b",
      "name": "el complemento verbal en infinitivo o gerundio solicitado",
      "function": "conservar la relación entre el verbo y la acción de su complemento, distinguiendo el significado solicitado",
      "error": "el complemento no es compatible con el verbo o cambia si la acción se recuerda, realiza o está pendiente"
    },
    {
      "id": "phrasal-verbs",
      "match": "\\b(?:phrasal verbs|verbos frasales|fill out|pick up)\\b",
      "name": "los phrasal verbs solicitados",
      "function": "relacionar el verbo y su partícula con el significado de la acción en el contexto indicado",
      "error": "atribuye al conjunto otro significado o relaciona la acción con otro referente"
    },
    {
      "id": "agreement-responses",
      "match": "\\b(?:me too|not me|neither do i|so do i|i do too|so did i)\\b",
      "name": "las respuestas de coincidencia o discrepancia solicitadas",
      "function": "relacionar el acuerdo o desacuerdo con la afirmación del interlocutor conservando su polaridad y referencia temporal",
      "error": "invierte acuerdo y desacuerdo o cambia la polaridad o el tiempo de la afirmación"
    },
    {
      "id": "there-modal-be",
      "match": "\\b(?:there modal be|there might be|there could be|there must be|there may be)\\b",
      "name": "there + modal + be",
      "function": "relacionar la existencia de un referente con el grado de posibilidad o certeza indicado",
      "error": "presenta como confirmada una existencia solo posible o cambia el referente"
    },
    {
      "id": "zero-conditional",
      "match": "\\b(?:condicional cero|zero conditional)\\b",
      "name": "el condicional cero",
      "function": "relacionar la condición con el resultado habitual o general indicado",
      "error": "presenta como excepcional un resultado general o invierte la relación de la condición con el resultado"
    },
    {
      "id": "third-conditional",
      "match": "\\b(?:tercer condicional|third conditional)\\b",
      "name": "el tercer condicional",
      "function": "relacionar una condición pasada no cumplida con el resultado alternativo que habría sido posible",
      "error": "presenta como ocurrido el resultado hipotético o cambia la relación con la condición pasada"
    },
    {
      "id": "passive",
      "match": "\\b(?:(?<!en )voz pasiva|passive voice)\\b",
      "name": "la voz pasiva solicitada",
      "function": "relacionar el hecho narrado o explicado con el referente que recibe la acción",
      "error": "atribuye al receptor la realización de la acción o cambia la referencia temporal solicitada"
    },
    {
      "id": "passive-past-perfect",
      "match": "\\b(?:pasado perfecto en voz pasiva|past perfect passive)\\b",
      "name": "la voz pasiva del pasado perfecto",
      "function": "relacionar la acción recibida por el referente con su anterioridad a otro acontecimiento pasado",
      "error": "atribuye al receptor la realización de la acción o invierte la anterioridad de los hechos"
    },
    {
      "id": "reported-speech",
      "match": "\\b(?:reported speech|estilo indirecto|discurso indirecto)\\b",
      "name": "el estilo indirecto solicitado",
      "function": "relatar de forma detallada lo comunicado conservando sus referentes, información y relaciones temporales",
      "error": "atribuye lo dicho a otra persona o cambia los referentes y la relación temporal de la información"
    },
    {
      "id": "it-cleft",
      "match": "\\b(?:oraciones enfaticas con it|it clefts|it cleft)\\b",
      "name": "la oración enfática con it",
      "function": "destacar el elemento indicado de la afirmación sin cambiar el acontecimiento comunicado",
      "error": "el énfasis destaca otro referente o altera la afirmación"
    },
    {
      "id": "wh-cleft",
      "match": "\\b(?:oraciones enfaticas con wh|wh clefts|wh cleft)\\b",
      "name": "la oración enfática con wh",
      "function": "destacar la información indicada mediante una estructura con wh que conserva la afirmación",
      "error": "la estructura enfatiza otra información o cambia la relación entre sus partes"
    },
    {
      "id": "nominal-gerund",
      "match": "\\b(?:gerundio en funcion de sustantivo|gerundio como sustantivo|nominal gerund)\\b",
      "name": "el gerundio en función de sustantivo",
      "function": "presentar la actividad como referente nominal de la afirmación indicada",
      "error": "cambia la actividad o su función nominal en la afirmación"
    },
    {
      "id": "probability-adverbs",
      "match": "\\b(?:adverbios de probabilidad|adverbs of probability)\\b",
      "name": "los adverbios y frases adverbiales de probabilidad",
      "function": "comunicar el grado de posibilidad de la explicación o afirmación indicada",
      "error": "presenta como segura una posibilidad o contradice el grado de probabilidad solicitado"
    },
    {
      "id": "intensity-adverbs",
      "match": "\\b(?:adverbios de intensidad|adverbs of intensity)\\b",
      "name": "los adverbios y frases adverbiales de intensidad",
      "function": "precisar la intensidad de la acción o característica comunicada",
      "error": "cambia la intensidad que debe reconocer el destinatario"
    },
    {
      "id": "place-prepositions",
      "match": "\\b(?:preposiciones de lugar|prepositions of place)\\b",
      "name": "las preposiciones de lugar",
      "function": "relacionar la ubicación o desplazamiento con la referencia espacial indicada",
      "error": "sitúa el referente o la acción en otro lugar o cambia el sentido del desplazamiento"
    },
    {
      "id": "time-prepositions",
      "match": "\\b(?:preposiciones de tiempo|prepositions of time)\\b",
      "name": "las preposiciones de tiempo",
      "function": "relacionar el acontecimiento con el momento o duración indicados",
      "error": "cambia el momento o duración del acontecimiento"
    },
    {
      "id": "relative-omission",
      "match": "\\b(?:omision del pronombre relativo|omission of relative pronouns|relative omission)\\b",
      "name": "la omisión del pronombre relativo solicitada",
      "function": "conservar la relación con el antecedente cuando el pronombre relativo puede omitirse en la estructura indicada",
      "error": "omite un pronombre necesario o cambia el antecedente de la información"
    },
    {
      "id": "cause-connectors",
      "match": "\\b(?:conectores de causa y efecto|conectores de causa|conectores de efecto|cause and effect connectors)\\b",
      "name": "los conectores de causa o efecto solicitados",
      "function": "relacionar el hecho con su causa o efecto según el sentido pedido",
      "error": "invierte causa y efecto o elimina una relación necesaria para comprender el hecho"
    },
    {
      "id": "exclusion-connectors",
      "match": "\\b(?:conectores de exclusion|exclusion connectors)\\b",
      "name": "los conectores de exclusión",
      "function": "distinguir la excepción del conjunto o afirmación al que corresponde",
      "error": "incluye como general lo que se excluye o atribuye la excepción a otro conjunto"
    },
    {
      "id": "purpose-connectors",
      "match": "\\b(?:conectores de finalidad|purpose connectors)\\b",
      "name": "los conectores de finalidad",
      "function": "relacionar la acción con la finalidad para la que se realiza",
      "error": "confunde la finalidad con un resultado ocurrido o con la causa de la acción"
    },
    {
      "id": "summary-connectors",
      "match": "\\b(?:conectores de sintesis|summary connectors)\\b",
      "name": "los conectores de síntesis",
      "function": "relacionar la síntesis con las ideas principales que resume",
      "error": "introduce como síntesis una idea ajena o cambia el sentido de las ideas resumidas"
    }
  ],
  "englishGradeSixLexicon": [
    {
      "id": "art",
      "match": "\\b(?:arte)\\b",
      "name": "arte",
      "function": "relacionar la manifestación artística indicada con su referencia en la situación",
      "error": "confunde la manifestación artística con otra",
      "category": "vocabulary"
    },
    {
      "id": "qualifiers",
      "match": "\\b(?:calificativos)\\b",
      "name": "calificativos",
      "function": "relacionar la valoración o característica expresada con el referente del ejemplo",
      "error": "atribuye al referente otra valoración o característica",
      "category": "vocabulary"
    },
    {
      "id": "celebrations",
      "match": "\\b(?:celebraciones)\\b",
      "name": "celebraciones",
      "function": "relacionar la celebración con los datos culturales del ejemplo proporcionado",
      "error": "confunde la celebración mencionada o su referente",
      "category": "vocabulary"
    },
    {
      "id": "citizenship",
      "match": "\\b(?:civismo y ciudadania)\\b",
      "name": "civismo y ciudadanía",
      "function": "relacionar el derecho, responsabilidad o norma nombrados con su referente en los ejemplos",
      "error": "confunde un derecho, responsabilidad o norma con otro",
      "category": "vocabulary"
    },
    {
      "id": "communication",
      "match": "\\b(?:comunicacion)\\b",
      "name": "comunicación",
      "function": "relacionar el medio o forma de comunicación con la situación indicada",
      "error": "confunde el canal o la forma de comunicación",
      "category": "vocabulary"
    },
    {
      "id": "culture",
      "match": "\\b(?:cultura)\\b",
      "name": "cultura",
      "function": "relacionar el término cultural con la identidad o práctica del ejemplo, sin generalizar a todas las personas",
      "error": "atribuye al ejemplo un significado cultural diferente",
      "category": "vocabulary"
    },
    {
      "id": "copyright",
      "match": "\\b(?:derecho de autor)\\b",
      "name": "derecho de autor",
      "function": "relacionar la autoría o el uso atribuido a la obra del ejemplo proporcionado",
      "error": "confunde autoría, atribución y copia en la información dada",
      "category": "vocabulary"
    },
    {
      "id": "natural-phenomena",
      "match": "\\b(?:fenomenos naturales)\\b",
      "name": "fenómenos naturales",
      "function": "relacionar el fenómeno natural con lo ocurrido en la situación indicada",
      "error": "confunde el fenómeno natural con otro acontecimiento",
      "category": "vocabulary"
    },
    {
      "id": "narrative-elements",
      "match": "\\b(?:elementos de (?:una |la )?narracion|narrative elements)\\b",
      "name": "elementos de una narración",
      "function": "relacionar el personaje, trama o ambiente solicitado con su papel en la narración",
      "error": "atribuye a un personaje la acción de otro o confunde trama y ambiente",
      "category": "vocabulary"
    },
    {
      "id": "contingencies",
      "match": "\\b(?:eventualidades)\\b",
      "name": "eventualidades",
      "function": "relacionar el contratiempo del referente con lo ocurrido en la situación",
      "error": "atribuye al referente otra eventualidad",
      "category": "vocabulary"
    },
    {
      "id": "literary-genres",
      "match": "\\b(?:generos literarios)\\b",
      "name": "géneros literarios",
      "function": "relacionar el género literario solicitado con los rasgos del texto proporcionado",
      "error": "confunde el género o atribuye al texto rasgos incompatibles con sus ejemplos",
      "category": "vocabulary"
    },
    {
      "id": "environment",
      "match": "\\b(?:medio ambiente|medioambiente|environment)\\b",
      "name": "medio ambiente",
      "function": "relacionar el proceso o problema ambiental con la información del ejemplo",
      "error": "confunde el proceso o problema ambiental mencionado",
      "category": "vocabulary"
    },
    {
      "id": "occupations",
      "match": "\\b(?:ocupaciones)\\b",
      "name": "ocupaciones",
      "function": "relacionar la ocupación con el papel del personaje en la situación proporcionada",
      "error": "atribuye al personaje otra ocupación",
      "category": "vocabulary"
    },
    {
      "id": "reactions",
      "match": "\\b(?:reacciones)\\b",
      "name": "reacciones",
      "function": "relacionar la reacción comunicada con el acontecimiento del personaje ficticio",
      "error": "cambia el sentido de la reacción o su referente",
      "category": "vocabulary"
    },
    {
      "id": "relationships",
      "match": "\\b(?:relaciones)\\b",
      "name": "relaciones",
      "function": "relacionar el vínculo entre los personajes con la situación comunicada",
      "error": "atribuye a los personajes otra relación",
      "category": "vocabulary"
    },
    {
      "id": "work",
      "match": "\\b(?:trabajo)\\b",
      "name": "trabajo",
      "function": "relacionar el referente laboral con los datos del perfil o situación ficticia proporcionados",
      "error": "confunde la solicitud, entrevista, puesto o referente laboral mencionado",
      "category": "vocabulary"
    },
    {
      "id": "values",
      "match": "\\b(?:valores)\\b",
      "name": "valores",
      "function": "relacionar el valor nombrado con las ideas del texto o ejemplos proporcionados, sin evaluar las creencias personales del estudiante",
      "error": "atribuye al texto un significado distinto del valor que comunica",
      "category": "vocabulary"
    },
    {
      "id": "opinion",
      "match": "\\b(?:opinar|expresar opiniones|expresiones de opinion)\\b",
      "name": "opinar",
      "function": "comunicar el punto de vista solicitado distinguiéndolo de un hecho confirmado",
      "error": "presenta como hecho confirmado un punto de vista o cambia su sentido",
      "category": "expression"
    },
    {
      "id": "agreement",
      "match": "\\b(?:expresar acuerdo(?: y desacuerdo)?|expresar desacuerdo)\\b",
      "name": "expresar acuerdo y desacuerdo",
      "function": "relacionar la posición comunicada con lo dicho por el interlocutor conservando acuerdo o desacuerdo según lo solicitado",
      "error": "invierte el acuerdo o desacuerdo de la respuesta",
      "category": "expression"
    },
    {
      "id": "excuse",
      "match": "\\b(?:excusarse|disculparse)\\b",
      "name": "excusarse",
      "function": "comunicar una disculpa relacionada con lo ocurrido en la situación indicada",
      "error": "la expresión cambia el motivo o no permite reconocer la disculpa",
      "category": "expression"
    },
    {
      "id": "change-topic",
      "match": "\\b(?:cambiar de tema)\\b",
      "name": "cambiar de tema",
      "function": "señalar la transición hacia el nuevo asunto indicado sin perder el vínculo con el intercambio",
      "error": "la expresión no permite reconocer la transición o introduce otro asunto",
      "category": "expression"
    }
  ]
}
export const evaluationCatalogV69={...evaluationCatalogV68,...frozen}
