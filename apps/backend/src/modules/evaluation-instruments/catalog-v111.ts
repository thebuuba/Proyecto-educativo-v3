import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV110 } from './catalog-v110'
/** Exact111payload checked against Development; prior modules stay inherited. */
export const evaluationCatalogV111={...evaluationCatalogV110,version:'evaluation-2026.111',artCommonModules:[...evaluationCatalogV110.artCommonModules!,{
  "id": "educacion-artistica-comun-6",
  "grade": 6,
  "topics": [
    {
      "id": "public-art",
      "grade": 6,
      "label": "ideas y técnicas del arte público",
      "match": "arte publico",
      "relation": "las relaciones entre ideas, recursos formales y evidencias de las manifestaciones de arte público expresamente examinadas",
      "pdfPages": [
        347,
        349
      ],
      "sourceRecordIds": [
        "b62394b2-f528-56de-86af-94f64e4473a7",
        "f784af33-c856-5969-b9d8-edc339096ff1",
        "9f1048e9-c783-5493-9bc2-bcae78f0b55c"
      ],
      "evidence": [
        {
          "id": "public-art-resources",
          "title": "Ideas, recursos y evidencias",
          "success": "Relaciona las ideas y recursos formales de la obra de arte público con evidencias identificables y con los efectos expresamente documentados del referente.",
          "sufficient": "La idea y sus recursos se sostienen; una relación secundaria con la evidencia queda poco precisada.",
          "partial": "Reconoce recursos pertinentes, pero una relación con la idea o evidencia carece de sustento.",
          "error": "Atribuye a la obra recursos o efectos incompatibles con los datos o infiere adhesión del público sin evidencia."
        }
      ]
    },
    {
      "id": "mural",
      "grade": 6,
      "label": "pintura mural y composición a gran formato",
      "match": "mural[a-z]*|gran formato",
      "relation": "las relaciones entre composición, escala del soporte, recursos visuales y mensaje del mural examinado, distinguiendo organización de la obra y tamaño obligatorio",
      "pdfPages": [
        347,
        349
      ],
      "sourceRecordIds": [
        "2451efb1-881b-5d21-8c1b-397c3b0e5ae1",
        "8c12d4c7-354d-56c7-a0ad-3946299f4955",
        "61363eba-e4d9-58c8-8b93-8b80cf6ddd10",
        "123014c6-fa95-5e8f-9b2c-e7361a9a9ab4",
        "4acde849-6590-5d94-bfc4-f3318ed59b46"
      ],
      "evidence": [
        {
          "id": "mural-composition",
          "title": "Composición, escala y mensaje",
          "success": "Relaciona la composición a escala y los recursos visuales del mural con el soporte disponible y el mensaje social ficticio acordado.",
          "sufficient": "La composición y el mensaje se reconocen; una relación visual secundaria queda poco definida.",
          "partial": "Se reconocen recursos pertinentes, pero una relación de escala o composición no contribuye al mensaje.",
          "error": "La composición o escala contradice las condiciones del soporte o impide reconocer el mensaje acordado.",
          "plan": {
            "title": "Plan de composición y recursos",
            "success": "Planifica la composición a escala, los recursos disponibles y el mensaje del mural en relación con las condiciones del soporte simulado dado.",
            "sufficient": "El plan relaciona composición y recursos; una condición secundaria queda poco precisada.",
            "partial": "El plan identifica recursos, pero una relación de escala o mensaje queda sin resolver.",
            "error": "La composición o los recursos previstos contradicen las condiciones dadas o impiden realizar la propuesta."
          }
        },
        {
          "id": "mural-agreements",
          "title": "Aportes y acuerdos de la creación colectiva",
          "success": "Relaciona los aportes y acciones acordadas del grupo con la integración de las partes del mural, utilizando los recursos y soporte expresamente disponibles.",
          "sufficient": "La integración colectiva se reconoce; un acuerdo secundario queda poco definido.",
          "partial": "Se reconocen aportes, pero una acción acordada no se relaciona con la integración de la obra.",
          "error": "Los aportes o acciones contradicen los acuerdos y no permiten reconocer la integración colectiva solicitada.",
          "plan": {
            "title": "Plan de roles y acuerdos",
            "success": "Planifica roles y acuerdos concretos del mural colectivo en relación con las acciones y recursos previstos para integrar la obra.",
            "sufficient": "El plan relaciona roles y acciones; un acuerdo secundario queda poco precisado.",
            "partial": "El plan identifica roles, pero una acción no se vincula con la integración prevista.",
            "error": "Los roles o acuerdos previstos impiden integrar las partes del mural."
          },
          "when": "colectiv|roles|acuerdos"
        }
      ]
    },
    {
      "id": "kinetic-sculpture",
      "grade": 6,
      "label": "escultura cinética y movimiento",
      "match": "escultura cinetica",
      "relation": "las relaciones entre movimiento observable y organización expresiva de la escultura cinética examinada, según las evidencias del referente",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "3c7cf38a-02c7-5d81-90ec-561b45716981"
      ],
      "evidence": [
        {
          "id": "kinetic-function",
          "title": "Movimiento y estructura representada",
          "success": "Relaciona el movimiento, las uniones y la organización de la maqueta cinética con el propósito expresivo dado mediante los materiales ligeros disponibles, sin exigir motor o carga corporal.",
          "sufficient": "El movimiento y su organización se reconocen; una unión secundaria queda poco definida sin impedir la función representada.",
          "partial": "La maqueta presenta recursos pertinentes, pero una relación de movimiento o unión queda sin resolver.",
          "error": "Las uniones o decisiones de organización impiden reconocer el movimiento y la función representada solicitados."
        }
      ]
    },
    {
      "id": "graffiti",
      "grade": 6,
      "label": "grafiti como expresión urbana",
      "match": "grafiti[a-z]*",
      "relation": "las relaciones entre recursos visuales, entorno expresamente dado y mensaje del grafiti examinado, sin exigir intervención en un espacio real",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "ef63ce7e-72dc-5397-bb44-17bed3348ea6",
        "f1fb56ce-02b7-57a7-a713-458794cb5c9b"
      ],
      "evidence": [
        {
          "id": "graffiti-message",
          "title": "Recursos y mensaje del grafiti",
          "success": "Relaciona letras y recursos visuales del grafiti con el mensaje y entorno comunitario ficticios dados mediante el soporte simulado disponible.",
          "sufficient": "El mensaje y el entorno se reconocen; una relación visual secundaria queda poco definida.",
          "partial": "Presenta recursos pertinentes, pero una decisión visual no contribuye al mensaje o entorno dado.",
          "error": "Las decisiones visuales contradicen el referente o no permiten reconocer el mensaje solicitado."
        }
      ]
    },
    {
      "id": "public-art-access",
      "grade": 6,
      "label": "acceso al arte público",
      "match": "acceso.*arte publico",
      "relation": "las relaciones entre alternativas de acceso al arte público, condiciones de acceso y razones sustentadas en evidencias, sin inferir permisos o apoyo comunitario",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "5eebc1a3-a863-5257-a77b-0816f94a8483"
      ],
      "evidence": [
        {
          "id": "access-reasons",
          "title": "Alternativa y razones de acceso",
          "success": "Justifica la alternativa de acceso elegida para el caso ficticio mediante razones vinculadas con las condiciones y evidencias proporcionadas, distinguiendo hechos y permisos no acreditados.",
          "sufficient": "La alternativa se sostiene en razones y evidencias; una condición secundaria queda poco precisada.",
          "partial": "Propone una alternativa pertinente, pero una razón no se vincula con las condiciones dadas.",
          "error": "La alternativa contradice las evidencias o presume condiciones y permisos que el caso no acredita."
        }
      ]
    },
    {
      "id": "collective-stage",
      "grade": 6,
      "label": "creación escénica colectiva y acuerdos",
      "match": "creacion colectiva.*escena|plan de creacion colectiva|creacion escenica colectiva",
      "relation": "las relaciones entre roles, acuerdos, recursos y acciones de la creación colectiva del medio escénico expresamente elegido, sin acumular medios alternativos",
      "pdfPages": [
        347,
        349
      ],
      "sourceRecordIds": [
        "743ce2f9-38a4-50ae-afb6-f9af8c7ab122",
        "02af933c-9e07-5cdc-a6a5-700820cd4de5"
      ],
      "evidence": [
        {
          "id": "collective-scene",
          "title": "Roles, acuerdos y propuesta escénica",
          "success": "Relaciona las acciones y recursos del medio escénico elegido con los roles y acuerdos dados para integrar la propuesta colectiva.",
          "sufficient": "La integración y los roles se reconocen; una acción secundaria queda poco definida.",
          "partial": "Presenta aportes pertinentes, pero una acción no se vincula con los acuerdos de la escena.",
          "error": "Los aportes o acciones contradicen los acuerdos y no permiten reconocer la propuesta colectiva.",
          "plan": {
            "title": "Plan colectivo del medio escénico elegido",
            "success": "Planifica roles, acuerdos, acciones y recursos del medio escénico elegido en relación con las condiciones del espacio simulado dado.",
            "sufficient": "El plan relaciona roles y recursos; un acuerdo secundario queda poco precisado.",
            "partial": "El plan presenta acciones pertinentes, pero una no se vincula con los roles o condiciones del espacio.",
            "error": "Los acuerdos o recursos previstos contradicen las condiciones dadas o impiden integrar la escena colectiva."
          }
        }
      ]
    },
    {
      "id": "dance-theatre",
      "grade": 6,
      "label": "gesto, texto y movimiento en danza-teatro",
      "match": "danza[- ]teatro",
      "relation": "las relaciones entre gesto, texto y movimiento de la pieza de danza-teatro expresamente examinada, apoyadas en evidencias del fragmento",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "88032a45-098c-5b44-a17b-c33bf883d825",
        "aeacbdfc-701b-5a64-b9c0-b42bf9e60c3c"
      ],
      "evidence": [
        {
          "id": "dance-theatre-relations",
          "title": "Gesto, texto y movimiento de la pieza",
          "success": "Relaciona gesto, texto y movimiento del guion ficticio con los recursos disponibles y las adaptaciones acordadas para hacer reconocible el sentido de la pieza.",
          "sufficient": "La relación entre componentes se reconoce; una transición secundaria queda poco definida sin cambiar el sentido principal.",
          "partial": "Se reconocen componentes pertinentes, pero una relación entre gesto, texto y movimiento queda sin resolver.",
          "error": "Las decisiones escénicas contradicen el guion o no permiten reconocer las relaciones entre los componentes solicitados."
        }
      ]
    },
    {
      "id": "dance-theatre-research",
      "grade": 6,
      "label": "investigación y vídeo fórum de danza-teatro",
      "match": "investiga.*danza[- ]teatro|video forum",
      "relation": "las relaciones entre fuentes, evidencias audiovisuales y argumentos sobre los recursos de la pieza de danza-teatro asignada",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "ad46818f-13c1-585a-a5b4-0f899f99e78a"
      ],
      "evidence": [
        {
          "id": "dance-theatre-inquiry",
          "title": "Fuentes y evidencias audiovisuales",
          "success": "Investiga los recursos de la pieza asignada relacionando afirmaciones y evidencias identificables de las fuentes y del registro audiovisual dados.",
          "sufficient": "Las afirmaciones se sostienen en fuentes; una referencia audiovisual secundaria queda poco precisada.",
          "partial": "Presenta información pertinente, pero una afirmación no se vincula con la evidencia audiovisual o documental.",
          "error": "Las afirmaciones contradicen las fuentes o atribuyen al fragmento recursos que no contiene."
        },
        {
          "id": "video-forum-reasons",
          "title": "Argumentos del vídeo fórum",
          "success": "Sostiene las intervenciones del vídeo fórum ficticio con razones vinculadas con evidencias de la pieza y responde a los argumentos proporcionados sin juicios personales.",
          "sufficient": "La intervención y sus evidencias se reconocen; una relación argumentativa secundaria queda poco precisada.",
          "partial": "Presenta una razón pertinente, pero no la vincula con las evidencias o argumento del caso.",
          "error": "La intervención contradice la pieza o sustituye los argumentos por juicios sobre las personas.",
          "when": "video forum"
        }
      ]
    },
    {
      "id": "street-theatre",
      "grade": 6,
      "label": "teatro de calle y espacio escénico",
      "match": "teatro de calle",
      "relation": "las relaciones entre acciones, recursos, público previsto y condiciones del espacio simulado en los ejemplos de teatro de calle examinados",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "33d1c7d7-8257-52f9-83eb-56ec2f1ce493"
      ],
      "evidence": [
        {
          "id": "street-scene",
          "title": "Acciones y condiciones del espacio",
          "success": "Relaciona las acciones de la escena ficticia con el público previsto, recursos adaptados y condiciones expresamente dadas del espacio escolar simulado.",
          "sufficient": "La acción y su espacio se reconocen; una relación escénica secundaria queda poco definida.",
          "partial": "Se reconocen acciones pertinentes, pero una relación con el espacio o público previsto queda sin resolver.",
          "error": "Las acciones o recursos contradicen las condiciones dadas y no permiten reconocer la escena solicitada."
        }
      ]
    },
    {
      "id": "stilt-construction-model",
      "grade": 6,
      "label": "modelo de construcción de zancos",
      "match": "modelo de zancos|construccion de zancos",
      "relation": "las relaciones entre uniones, apoyos y función representada del modelo seguro de zancos examinado, diferenciando una maqueta de mesa y un dispositivo de uso corporal",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "d3106aeb-f8fe-5a4c-af76-dcb53fd6b99a"
      ],
      "evidence": [
        {
          "id": "stilt-model",
          "title": "Uniones y función representada del modelo",
          "success": "Relaciona las uniones, apoyos y forma del modelo de zancos de mesa con la función representada y los materiales seguros dados, sin exigir uso corporal ni acreditar seguridad de un dispositivo real.",
          "sufficient": "La función representada y sus apoyos se reconocen; una unión secundaria queda poco definida.",
          "partial": "El modelo contiene recursos pertinentes, pero una relación de apoyo o unión no representa la función solicitada.",
          "error": "Las uniones o apoyos contradicen el modelo dado o impiden reconocer la función representada."
        }
      ]
    },
    {
      "id": "stilt-safety-check",
      "grade": 6,
      "label": "verificación de condiciones de uso de zancos",
      "match": "plan.*uso de zancos|condiciones de uso de zancos",
      "relation": "la verificación de los requisitos explícitos de espacio y supervisión dados para el plan simulado, sin ejecutar la actividad o inferir capacidad corporal",
      "pdfPages": [
        347,
        349
      ],
      "sourceRecordIds": [
        "d3106aeb-f8fe-5a4c-af76-dcb53fd6b99a",
        "31063a31-605e-59af-be8e-e925dde1a147"
      ],
      "evidence": [
        {
          "id": "stilt-explicit-conditions",
          "title": "Condiciones explícitas del caso",
          "success": "Identifica con evidencias si el plan simulado cumple las condiciones de uso expresamente dadas en la ficha, sin ejecutar el dispositivo.",
          "sufficient": "La verificación se reconoce; una marca secundaria queda poco clara sin alterar el resultado.",
          "partial": "La respuesta es ambigua sobre una condición de la ficha.",
          "error": "Atribuye al caso un cumplimiento incompatible con sus evidencias."
        }
      ]
    },
    {
      "id": "social-theatre-analysis",
      "grade": 6,
      "label": "teatro y comunicación de problemáticas sociales",
      "match": "teatro.*problematica social|teatro y comunicacion de problematicas",
      "relation": "las relaciones entre acciones, recursos escénicos y problemática social representada del fragmento ficticio examinado, sin exigir adhesión a la postura de la obra",
      "pdfPages": [
        347,
        349
      ],
      "sourceRecordIds": [
        "0c8bd964-5b2c-5510-8be8-50e6744dffae",
        "4394517a-be77-5353-8191-87398f31ad69"
      ],
      "evidence": [
        {
          "id": "social-scene",
          "title": "Recursos y problemática representada",
          "success": "Relaciona acciones y recursos del fragmento teatral ficticio con la problemática social dada mediante evidencias de la representación.",
          "sufficient": "La problemática y sus recursos se sostienen; una relación secundaria queda poco precisada.",
          "partial": "Identifica recursos pertinentes, pero una relación con la problemática carece de sustento.",
          "error": "La interpretación contradice las acciones dadas o sustituye sus evidencias por adhesión a una postura."
        }
      ]
    },
    {
      "id": "anthropological-theatre",
      "grade": 6,
      "label": "teatro antropológico latinoamericano",
      "match": "teatro antropologico",
      "relation": "las relaciones entre mitos, creencias, normas o valores representados del grupo ficticio y evidencias escénicas del teatro antropológico latinoamericano examinado, sin atribuir creencias a quien estudia o interpreta",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "b39c74d6-cabc-5b8d-81e2-0b8025b6f8c9"
      ],
      "evidence": [
        {
          "id": "anthropological-scene",
          "title": "Representación cultural y evidencia",
          "success": "Distingue la representación de mitos, creencias, normas y valores del grupo ficticio mediante evidencias de la obra, separando signos escénicos y generalizaciones sobre personas reales.",
          "sufficient": "La representación y su evidencia se reconocen; una relación cultural secundaria queda poco precisada.",
          "partial": "Identifica signos pertinentes, pero una interpretación cultural no se vincula con las evidencias de la obra.",
          "error": "La interpretación contradice la obra o presenta estereotipos como características acreditadas de personas reales."
        }
      ]
    },
    {
      "id": "cultural-management",
      "grade": 6,
      "label": "gestión cultural de festivales y espacios",
      "match": "gestion.*festival|plan de gestion|gestion cultural",
      "relation": "las relaciones entre programación, medio elegido, espacio, público y recursos documentados de la gestión cultural del festival ficticio examinado",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "fc9e9641-f9db-5b00-aa14-979dfbc19ebc"
      ],
      "evidence": [
        {
          "id": "festival-management",
          "title": "Programación y recursos del festival",
          "success": "Relaciona programación, espacio y recursos disponibles del festival ficticio con el medio escénico elegido y las condiciones del público previsto.",
          "sufficient": "La programación y sus condiciones se reconocen; un recurso secundario queda poco definido.",
          "partial": "Presenta recursos pertinentes, pero una decisión de programación no se vincula con las condiciones dadas.",
          "error": "La programación o los recursos contradicen las condiciones del festival ficticio.",
          "plan": {
            "title": "Plan de gestión del festival ficticio",
            "success": "Planifica programación, espacio y recursos del festival ficticio de danza o teatro según el medio elegido y las condiciones dadas, sin exigir contactos o contratación reales.",
            "sufficient": "El plan relaciona programación y condiciones; una decisión secundaria queda poco precisada.",
            "partial": "El plan presenta recursos, pero una acción no se vincula con la programación o público previstos.",
            "error": "Las decisiones previstas contradicen las condiciones dadas o impiden organizar el festival ficticio."
          }
        }
      ]
    },
    {
      "id": "art-project-results",
      "grade": 6,
      "label": "presentación de resultados de proyectos artísticos",
      "match": "resultados de la produccion artistica|resultados.*producciones artisticas",
      "relation": "las relaciones entre decisiones logísticas y creativas, resultados documentados y evidencias del producto artístico ya realizado, diferenciando hallazgos y planes",
      "pdfPages": [
        347,
        349
      ],
      "sourceRecordIds": [
        "bc18a2ff-4f06-5abd-8174-19f45d73b2f6",
        "5c640d0e-43b0-5163-9a2b-e7861674d4a0"
      ],
      "evidence": [
        {
          "id": "project-results",
          "title": "Decisiones y resultados documentados",
          "success": "Presenta resultados de la producción artística ya realizada relacionando decisiones logísticas y creativas con evidencias identificables del producto en el formato elegido.",
          "sufficient": "Los resultados y sus evidencias se reconocen; una relación secundaria de decisión queda poco precisada.",
          "partial": "Presenta resultados pertinentes, pero una decisión no se vincula con las evidencias del producto.",
          "error": "Presenta datos no obtenidos como resultados o atribuye al producto evidencias que no contiene."
        }
      ]
    },
    {
      "id": "stage-enterprise-plan",
      "grade": 6,
      "label": "proyecto escénico emprendedor elegido",
      "match": "proyecto escenico emprendedor|proyectos escenicos emprendedores",
      "relation": "las relaciones entre propósito, secuencia, roles y recursos del proyecto escénico ficticio expresamente elegido, sin acumular alternativas de producción",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "61a601a7-f887-59bb-a8c2-5085e9ebc288",
        "05fa15cb-2bf6-563e-8464-31d8887cc1e4"
      ],
      "evidence": [
        {
          "id": "chosen-stage-enterprise",
          "title": "Propósito y recursos de la propuesta",
          "success": "Relaciona propósito, secuencia, roles y recursos disponibles de la propuesta escénica ficticia elegida para hacer reconocible su organización.",
          "sufficient": "La organización y su propósito se reconocen; un recurso secundario queda poco definido.",
          "partial": "Presenta recursos pertinentes, pero una relación de secuencia o rol queda sin resolver.",
          "error": "Los recursos o acciones contradicen el propósito de la propuesta elegida.",
          "plan": {
            "title": "Plan de la propuesta escénica elegida",
            "success": "Planifica propósito, secuencia, roles y recursos seguros disponibles de la propuesta escénica emprendedora ficticia elegida, sin exigir otras modalidades.",
            "sufficient": "El plan relaciona propósito y recursos; una acción secundaria queda poco precisada.",
            "partial": "El plan identifica recursos, pero una acción no se vincula con el propósito o roles previstos.",
            "error": "Las acciones o recursos previstos impiden organizar la propuesta elegida según las condiciones dadas."
          }
        }
      ]
    },
    {
      "id": "multidisciplinary-project-plan",
      "grade": 6,
      "label": "proyectos artísticos multidisciplinarios",
      "match": "(?:plan|propuesta|proyecto)[a-z]* artistic[a-z]* multidisciplin[a-z]*",
      "relation": "las relaciones entre los lenguajes artísticos expresamente elegidos, problema ficticio, recursos y propósito de la propuesta multidisciplinaria examinada",
      "pdfPages": [
        347,
        348,
        349
      ],
      "sourceRecordIds": [
        "b69a9248-2de6-585e-bf7f-03d6a31204c0",
        "db5ed17d-a6ae-5785-9a95-ba7a9825c9a2",
        "71bbd8ea-e64d-5188-92bd-0b26269a7387",
        "ac82758b-ea69-5a0a-9553-c41cb8192cad"
      ],
      "evidence": [
        {
          "id": "chosen-language-integration",
          "title": "Integración de los lenguajes elegidos",
          "success": "Relaciona los lenguajes artísticos elegidos y las evidencias del producto con los recursos y la problemática escolar ficticia dados, haciendo reconocible su integración.",
          "sufficient": "Los lenguajes y su propósito se reconocen; una relación de integración secundaria queda poco definida.",
          "partial": "Presenta recursos pertinentes, pero una relación entre lenguajes no contribuye al propósito acordado.",
          "error": "La propuesta acumula recursos sin relación reconocible o contradice las condiciones del problema ficticio.",
          "plan": {
            "title": "Plan de integración de los lenguajes elegidos",
            "success": "Planifica la integración de los lenguajes elegidos, recursos y acciones previstos para responder a la problemática escolar ficticia dada, sin exigir ejecución.",
            "sufficient": "El plan relaciona lenguajes y acciones; una condición secundaria queda poco precisada.",
            "partial": "El plan propone recursos, pero una acción no integra los lenguajes con el propósito previsto.",
            "error": "Las acciones o recursos previstos contradicen las condiciones dadas o impiden integrar la propuesta."
          }
        }
      ]
    },
    {
      "id": "school-art-exhibition",
      "grade": 6,
      "label": "muestra escolar de Educación Artística",
      "match": "muestra escolar.*educacion artistica|muestra de educacion artistica",
      "relation": "las relaciones entre obras, lenguajes elegidos, programación, público y recursos disponibles de la muestra escolar simulada examinada",
      "pdfPages": [
        347,
        348
      ],
      "sourceRecordIds": [
        "e29e45ac-cb27-53bd-a83b-8fb26999d47a",
        "1500f30f-85e3-57eb-a88c-d27b9529e52b",
        "1e7c0c20-1fac-5b16-8895-8324aaece3d3"
      ],
      "evidence": [
        {
          "id": "school-exhibition-program",
          "title": "Obras, programación y recursos de la muestra",
          "success": "Organiza las obras y presentaciones de los lenguajes expresamente elegidos en relación con programación, público y recursos de la muestra escolar simulada dada.",
          "sufficient": "La programación y las obras se reconocen; una condición secundaria queda poco definida.",
          "partial": "Incluye obras pertinentes, pero una relación de programación o recurso no contribuye a la muestra prevista.",
          "error": "La programación o recursos contradicen las condiciones dadas o impiden reconocer la muestra solicitada."
        }
      ]
    },
    {
      "id": "craft-accessory",
      "grade": 6,
      "label": "accesorios artesanales y función",
      "match": "accesorio[a-z]* artesanal[a-z]*",
      "relation": "las relaciones entre forma, uniones, recurso elegido y función del accesorio artesanal expresamente examinado, sin valorar precio o gustos personales",
      "pdfPages": [
        347,
        348
      ],
      "sourceRecordIds": [
        "3e99c64c-1cda-5b38-8f96-0bf353728449",
        "5758cc09-d49c-538c-9e04-8112a94e2792"
      ],
      "evidence": [
        {
          "id": "accessory-function",
          "title": "Forma, uniones y función del accesorio",
          "success": "Relaciona forma y uniones del accesorio artesanal con el uso ficticio y el material seguro disponible expresamente dados.",
          "sufficient": "La función y su forma se reconocen; una unión secundaria queda poco definida sin impedir el uso previsto.",
          "partial": "El accesorio presenta recursos pertinentes, pero una unión o decisión formal no se vincula con su función.",
          "error": "Las decisiones de forma o unión contradicen las condiciones dadas o impiden reconocer el uso solicitado."
        }
      ]
    },
    {
      "id": "collective-improvisation",
      "grade": 6,
      "label": "improvisación colectiva teatral o de danza",
      "match": "improvisacion teatral|improvisa.*grupo|improvisacion colectiva",
      "relation": "las relaciones entre propuestas, respuestas, tema, género o estilo y espacio de la improvisación colectiva del medio expresamente elegido",
      "pdfPages": [
        347,
        349
      ],
      "sourceRecordIds": [
        "1ffbaa95-b7ce-597c-b579-16be5e05c134",
        "80dfd450-9fa5-5903-809a-daa4c6687ad7"
      ],
      "evidence": [
        {
          "id": "theatrical-response",
          "title": "Propuestas y respuestas de la improvisación",
          "success": "Relaciona las propuestas y respuestas de la improvisación teatral colectiva con el tema, género, estilo y espacio adaptado expresamente dados.",
          "sufficient": "La interacción y el tema se reconocen; una respuesta secundaria pierde claridad sin cambiar el sentido principal.",
          "partial": "Presenta propuestas pertinentes, pero una respuesta no se vincula con el tema o acciones del grupo.",
          "error": "Las propuestas o respuestas contradicen las condiciones dadas o no permiten reconocer la improvisación colectiva.",
          "plan": {
            "title": "Plan de propuestas y respuestas teatrales",
            "success": "Planifica propuestas, respuestas y uso del espacio de la improvisación teatral colectiva en relación con el tema, género y estilo dados.",
            "sufficient": "El plan relaciona interacción y espacio; una respuesta secundaria queda poco precisada.",
            "partial": "El plan identifica propuestas, pero una respuesta no se vincula con el tema o acciones previstas.",
            "error": "Las decisiones del plan impiden desarrollar la improvisación según las condiciones dadas."
          },
          "when": "teatr[a-z]*|escena"
        },
        {
          "id": "dance-response",
          "title": "Propuestas y respuestas del movimiento",
          "success": "Relaciona las propuestas y respuestas del movimiento en la improvisación de danza con el tema, estilo y uso adaptado del espacio expresamente dados.",
          "sufficient": "La interacción del movimiento se reconoce; una transición secundaria pierde claridad sin romper la secuencia principal.",
          "partial": "Presenta movimientos pertinentes, pero una respuesta no se vincula con las propuestas o espacio del grupo.",
          "error": "Las respuestas del movimiento contradicen las condiciones dadas o no permiten reconocer la improvisación colectiva.",
          "when": "danza|dancistic"
        }
      ]
    },
    {
      "id": "sociodrama",
      "grade": 6,
      "label": "sociodrama de una problemática ficticia",
      "match": "sociodrama[a-z]*|socio drama[a-z]*",
      "relation": "las relaciones entre roles, acciones, posiciones representadas y problemática del sociodrama ficticio examinado, sin exigir adhesión a una posición",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "e7e87227-4481-599e-96ff-0fb87fed2d8f"
      ],
      "evidence": [
        {
          "id": "sociodrama-roles",
          "title": "Roles, acciones y problemática representada",
          "success": "Relaciona roles, acciones y posiciones del sociodrama ficticio con el guion, la problemática y los recursos adaptados dados, distinguiendo personaje y persona.",
          "sufficient": "La problemática y los roles se reconocen; una relación escénica secundaria queda poco definida.",
          "partial": "Presenta acciones pertinentes, pero una relación de rol o posición no se vincula con el guion.",
          "error": "Las acciones o posiciones representadas contradicen el guion o no permiten reconocer la problemática dada.",
          "plan": {
            "title": "Plan de roles y acciones del sociodrama",
            "success": "Planifica roles, acciones y guion del sociodrama de modo coherente con la problemática ficticia y los recursos previstos, sin exigir representación.",
            "sufficient": "El plan relaciona problemática y roles; una acción secundaria queda poco precisada.",
            "partial": "El plan presenta acciones pertinentes, pero una relación con roles o guion queda sin resolver.",
            "error": "Las acciones o roles previstos contradicen el guion o impiden organizar el sociodrama solicitado."
          }
        }
      ]
    },
    {
      "id": "political-parody",
      "grade": 6,
      "label": "parodia de contenido social o político",
      "match": "parodia[a-z]*",
      "relation": "las relaciones entre transformación, contraste, recursos y mensaje de la parodia de una situación social o política ficticia examinada, distinguiendo argumento y ataque personal",
      "pdfPages": [
        347,
        349
      ],
      "sourceRecordIds": [
        "e7e87227-4481-599e-96ff-0fb87fed2d8f",
        "6555a5d9-4f9f-56e1-bf7e-cccfe1dc543a"
      ],
      "evidence": [
        {
          "id": "parody-contrast",
          "title": "Transformación y sentido de la parodia",
          "success": "Relaciona transformación y contraste de la situación ficticia con los recursos expresivos para comunicar un mensaje reconocible sin depender de ataques personales o datos privados.",
          "sufficient": "El mensaje y el contraste se reconocen; una decisión expresiva secundaria queda poco definida.",
          "partial": "Presenta transformaciones pertinentes, pero un contraste no contribuye al mensaje acordado.",
          "error": "Las decisiones expresivas contradicen el caso o sustituyen el contraste de la situación por juicios personales."
        }
      ]
    },
    {
      "id": "copyright-research",
      "grade": 6,
      "label": "investigación de derechos autorales en las artes",
      "match": "derechos autorales",
      "relation": "la distinción entre leyes, entidades y procesos según las fuentes, jurisdicción, fecha y alcance dados, sin inferir vigencia jurídica actual no acreditada",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "994d9065-e64c-501f-8579-777ca3321b3c"
      ],
      "evidence": [
        {
          "id": "copyright-documentation",
          "title": "Fuentes, jurisdicción y alcance",
          "success": "Documenta leyes, entidades y procesos de derechos autorales según las fuentes dadas, identificando jurisdicción, fecha, alcance y límites de la vigencia acreditada.",
          "sufficient": "Los datos y su alcance se reconocen; una referencia secundaria queda poco precisada.",
          "partial": "Presenta información pertinente, pero una afirmación no se vincula con su fuente, jurisdicción o fecha.",
          "error": "Presenta como acreditada una vigencia o autorización que las fuentes no sostienen o contradice su alcance."
        }
      ]
    },
    {
      "id": "music-work-registration",
      "grade": 6,
      "label": "registro y clasificación de obras musicales",
      "match": "registro.*obras musicales|registro y documentacion de obras musicales",
      "relation": "las relaciones entre el criterio de clasificación elegido y los datos documentados de obras musicales y sus autores expresamente solicitados, sin exigir otras categorías",
      "pdfPages": [
        347
      ],
      "sourceRecordIds": [
        "fecf5616-23f0-5eab-aced-e6d9ff6500de"
      ],
      "evidence": [
        {
          "id": "music-records",
          "title": "Registros y clasificación elegida",
          "success": "Organiza los registros de las obras musicales y sus compositores asignados según el criterio de clasificación elegido, vinculando los datos contextuales pedidos con las fuentes proporcionadas.",
          "sufficient": "Los registros y su criterio se reconocen; una referencia contextual secundaria queda poco precisada.",
          "partial": "Incluye registros pertinentes, pero uno no responde al criterio elegido o carece de sustento.",
          "error": "La clasificación contradice el criterio elegido o atribuye a las obras datos incompatibles con las fuentes."
        }
      ]
    },
    {
      "id": "heritage-object-record",
      "grade": 6,
      "label": "registro de objetos patrimoniales",
      "match": "objeto patrimonial|objetos patrimoniales",
      "relation": "las relaciones entre los datos expresamente solicitados del registro patrimonial y sus evidencias, distinguiendo información documentada y dato no determinado",
      "pdfPages": [
        348
      ],
      "sourceRecordIds": [
        "8b2a2098-024b-54b9-8c0b-7ec84504cbde"
      ],
      "evidence": [
        {
          "id": "heritage-record",
          "title": "Datos y evidencias del registro patrimonial",
          "success": "Registra los datos expresamente solicitados del objeto patrimonial en el formato elegido, vinculándolos con sus evidencias e identificando lo no determinado sin inventar información.",
          "sufficient": "Los datos y sus evidencias se reconocen; una referencia secundaria queda poco precisada.",
          "partial": "Incluye datos pertinentes, pero uno no permite reconocer su evidencia o indeterminación.",
          "error": "Inventa datos o atribuye al objeto características incompatibles con las evidencias dadas."
        }
      ]
    },
    {
      "id": "music-enterprise-plan",
      "grade": 6,
      "label": "iniciativas y emprendimiento musical",
      "match": "iniciativa musical|emprendimiento en la musica",
      "relation": "las relaciones entre propósito, público, recursos y acciones de la iniciativa musical ficticia expresamente elegida, sin exigir contratación o inversión reales",
      "pdfPages": [
        348
      ],
      "sourceRecordIds": [
        "6cc576c3-b8ab-5be0-a8e6-7b9c9256adda"
      ],
      "evidence": [
        {
          "id": "music-initiative",
          "title": "Propósito y recursos de la iniciativa musical",
          "success": "Relaciona propósito, público y recursos disponibles de la iniciativa musical ficticia elegida con las acciones de su propuesta.",
          "sufficient": "La iniciativa y sus recursos se reconocen; una acción secundaria queda poco definida.",
          "partial": "Presenta recursos pertinentes, pero una acción no se vincula con el público o propósito dado.",
          "error": "Las acciones o recursos contradicen las condiciones de la iniciativa elegida.",
          "plan": {
            "title": "Plan de la iniciativa musical ficticia",
            "success": "Planifica propósito, público, recursos y acciones de la iniciativa musical ficticia elegida según las condiciones disponibles, sin exigir ventas o contratación reales.",
            "sufficient": "El plan relaciona propósito y recursos; una acción secundaria queda poco precisada.",
            "partial": "El plan presenta acciones, pero una no se vincula con el público o recursos previstos.",
            "error": "Las decisiones previstas contradicen las condiciones dadas o impiden organizar la iniciativa elegida."
          }
        }
      ]
    },
    {
      "id": "music-cultural-project",
      "grade": 6,
      "label": "proyecto cultural musical elegido",
      "match": "proyecto cultural musical|proyectos culturales musicales",
      "relation": "las relaciones entre música, secuencia, público y recursos del tipo de proyecto cultural musical expresamente elegido, sin acumular proyectos alternativos",
      "pdfPages": [
        348
      ],
      "sourceRecordIds": [
        "32e923fe-e770-5b99-857f-c3d0cea971c0"
      ],
      "evidence": [
        {
          "id": "chosen-musical-project",
          "title": "Música, público y secuencia del proyecto",
          "success": "Relaciona el recurso sonoro elegido con público y secuencia del proyecto cultural musical ficticio acordado mediante los recursos disponibles.",
          "sufficient": "El propósito y la secuencia se reconocen; una relación sonora secundaria queda poco definida.",
          "partial": "Presenta recursos sonoros pertinentes, pero una relación con el público o secuencia queda sin resolver.",
          "error": "Las decisiones sonoras contradicen el proyecto acordado o impiden reconocer su propósito y secuencia."
        }
      ]
    },
    {
      "id": "craft-market-plan",
      "grade": 6,
      "label": "muestras y mercados artesanales",
      "match": "muestra artesanal|mercado[a-z]* artesanal[a-z]*",
      "relation": "las relaciones entre productos, promoción, público y recursos documentados de las muestras o mercados artesanales examinados como contextos de emprendimiento",
      "pdfPages": [
        348
      ],
      "sourceRecordIds": [
        "679b26ba-c475-5f55-b6b5-bac8a24f812c"
      ],
      "evidence": [
        {
          "id": "craft-market",
          "title": "Selección y promoción de la muestra",
          "success": "Relaciona productos, promoción, público y recursos de la muestra artesanal ficticia elegida según las condiciones dadas.",
          "sufficient": "La selección y su propósito se reconocen; un recurso secundario queda poco definido.",
          "partial": "Presenta productos pertinentes, pero una relación de promoción o público queda sin resolver.",
          "error": "Los productos o decisiones de promoción contradicen las condiciones de la muestra ficticia.",
          "plan": {
            "title": "Plan de muestra artesanal ficticia",
            "success": "Planifica selección de productos, promoción, público y recursos disponibles de la muestra artesanal ficticia, sin exigir venta o viaje reales.",
            "sufficient": "El plan relaciona selección y recursos; una condición secundaria queda poco precisada.",
            "partial": "El plan presenta productos, pero una decisión de promoción no se vincula con el público o recursos previstos.",
            "error": "Las decisiones del plan contradicen las condiciones dadas o impiden organizar la muestra prevista."
          }
        }
      ]
    },
    {
      "id": "artistic-language-description",
      "grade": 6,
      "label": "elementos visuales del lenguaje artístico o artesanal",
      "match": "elementos del lenguaje visual|elementos visuales del lenguaje",
      "relation": "las relaciones entre los elementos visuales expresamente solicitados, su función y evidencias de la manifestación artística o artesanal examinada, sin imponer recursos de otros medios",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "84ef39da-ced8-55a8-98f6-0465f4b0f863"
      ],
      "evidence": [
        {
          "id": "visual-language-elements",
          "title": "Elementos visuales y evidencias",
          "success": "Describe los elementos visuales solicitados y sus funciones en la obra mediante evidencias identificables del referente.",
          "sufficient": "Los elementos y sus funciones se reconocen; una relación visual secundaria queda poco precisada.",
          "partial": "Identifica elementos pertinentes, pero una función no se vincula con la evidencia visual.",
          "error": "Atribuye a la obra elementos ausentes o funciones incompatibles con sus recursos visibles."
        }
      ]
    },
    {
      "id": "simulated-work-promotion",
      "grade": 6,
      "label": "promoción simulada de obras artísticas",
      "match": "simulacion de promocion|promocion.*obra artistica ficticia",
      "relation": "las relaciones entre mensaje, público y recursos del medio elegido para promocionar una obra artística ficticia, sin exigir publicación externa",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "daa730ed-6751-5bd7-957b-7bc38132ab26"
      ],
      "evidence": [
        {
          "id": "work-promotion",
          "title": "Mensaje y recursos de la promoción",
          "success": "Relaciona mensaje, público y recursos del medio elegido para hacer reconocible la información acordada de la obra en la promoción simulada.",
          "sufficient": "El mensaje y el público se reconocen; un recurso secundario deja una ambigüedad sin alterar la información principal.",
          "partial": "La simulación aporta información pertinente, pero una elección del medio no contribuye al mensaje acordado.",
          "error": "El mensaje o los recursos contradicen la obra ficticia o impiden reconocer la información solicitada."
        }
      ]
    },
    {
      "id": "artistic-text",
      "grade": 6,
      "label": "texto para una pieza artística elegida",
      "match": "texto para la pieza|textos para piezas",
      "relation": "las relaciones entre voces, secuencia y mensaje del texto para el medio artístico expresamente elegido, usando una problemática ficticia sin exigir revelaciones privadas",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "199590ea-7d55-5be5-b302-28b87afb5206"
      ],
      "evidence": [
        {
          "id": "artistic-writing",
          "title": "Voces, secuencia y mensaje del texto",
          "success": "Relaciona voces y secuencia del texto con el mensaje y la problemática social ficticia dados para la pieza escénica elegida, manteniendo coherencia con sus condiciones.",
          "sufficient": "Las voces y el mensaje se reconocen; una transición secundaria queda poco definida.",
          "partial": "El texto presenta recursos pertinentes, pero una voz o transición no contribuye al mensaje acordado.",
          "error": "Las voces o secuencia contradicen la situación ficticia o no permiten reconocer el mensaje solicitado."
        }
      ]
    },
    {
      "id": "genre-style-analysis",
      "grade": 6,
      "label": "características de géneros y estilos artísticos",
      "match": "caracteristicas del genero y estilo|generos y estilos artisticos",
      "relation": "las relaciones entre características observables, género o estilo expresamente asignados y evidencias del referente artístico examinado",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "5396b780-17ff-57ff-9659-179b2b38a2d6"
      ],
      "evidence": [
        {
          "id": "genre-style-evidence",
          "title": "Características y evidencias del referente",
          "success": "Identifica características del género y estilo asignados mediante relaciones sustentadas en evidencias de la obra proporcionada.",
          "sufficient": "Las características principales se sostienen; una referencia secundaria queda poco precisada.",
          "partial": "Identifica rasgos pertinentes, pero una atribución no se vincula con la evidencia.",
          "error": "Atribuye al referente rasgos ausentes o clasificaciones incompatibles con los datos dados."
        }
      ]
    },
    {
      "id": "social-improvement-proposal",
      "grade": 6,
      "label": "propuesta artística de mejora social",
      "match": "propuesta visual.*mejora social|propuesta artistica de mejora social",
      "relation": "las relaciones entre recursos expresivos, razones y mensaje de la propuesta sobre la mejora social ficticia examinada, sin calificar adhesión a una postura",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "129b23f7-3550-54ff-a914-0b7ea42346b9"
      ],
      "evidence": [
        {
          "id": "improvement-message",
          "title": "Recursos y razones de la propuesta",
          "success": "Relaciona los recursos visuales elegidos con razones identificables del caso ficticio para comunicar el mensaje de mejora social expresamente acordado.",
          "sufficient": "El mensaje y sus razones se reconocen; una relación visual secundaria queda poco definida.",
          "partial": "Presenta recursos pertinentes, pero una relación con las razones del caso o mensaje queda sin resolver.",
          "error": "Las decisiones visuales contradicen las evidencias del caso o sustituyen sus razones por juicios personales."
        }
      ]
    },
    {
      "id": "technique-style-research",
      "grade": 6,
      "label": "investigación de técnicas y evolución de estilos",
      "match": "tecnica artistica.*evolucion|tecnica artistica.*surgimiento|investigacion de tecnicas y evolucion",
      "relation": "las relaciones documentadas entre técnicas artísticas y surgimiento o evolución del estilo asignado, distinguiendo evidencia, interpretación y causalidad no acreditada",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "194eccc8-e3ae-5efd-bd9c-185bd8414c89"
      ],
      "evidence": [
        {
          "id": "technique-style-sources",
          "title": "Técnica, estilo y fuentes",
          "success": "Relaciona la técnica artística asignada con el surgimiento o evolución del estilo dado mediante evidencias de las fuentes, diferenciando coincidencia y causalidad sustentada.",
          "sufficient": "Las relaciones principales se sostienen; una referencia histórica secundaria queda poco precisada.",
          "partial": "Presenta datos pertinentes, pero una relación entre técnica y estilo carece de sustento.",
          "error": "Atribuye a la técnica efectos o hechos incompatibles con las fuentes o afirma causalidad no acreditada."
        }
      ]
    },
    {
      "id": "public-art-presentation",
      "grade": 6,
      "label": "presentación del análisis de arte público",
      "match": "presenta.*analisis.*arte publico",
      "relation": "las relaciones entre ideas, técnicas, evidencias y argumentos del análisis de arte público presentado mediante el medio disponible elegido",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "46d7930e-8401-537a-8718-3daae77d83a6"
      ],
      "evidence": [
        {
          "id": "public-analysis-sharing",
          "title": "Ideas y evidencias presentadas",
          "success": "Presenta el análisis de la obra de arte público relacionando ideas, técnicas y argumentos con evidencias identificables del referente en el medio elegido, sin exigir gustos compartidos.",
          "sufficient": "El análisis y sus evidencias se reconocen; una relación argumentativa secundaria queda poco precisada.",
          "partial": "Presenta ideas pertinentes, pero un argumento no se vincula con las evidencias de la obra.",
          "error": "Los argumentos presentados contradicen la obra o sustituyen sus evidencias por preferencias personales."
        }
      ]
    },
    {
      "id": "art-safety-observation",
      "grade": 6,
      "label": "acciones de cuidado de recursos y espacio artístico",
      "match": "acciones.*cuidado de materiales|acciones de cuidado de recursos",
      "relation": "la frecuencia de cumplimiento de las acciones concretas de cuidado de recursos o espacio expresamente acordadas, sin inferir salud o capacidad corporal",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "31063a31-605e-59af-be8e-e925dde1a147"
      ],
      "evidence": [
        {
          "id": "observed-material-care",
          "title": "Frecuencia de acciones de cuidado",
          "success": "Cumple las acciones concretas de cuidado de recursos expresamente acordadas en todas las oportunidades observadas.",
          "sufficient": "Cumple las acciones concretas acordadas en casi todas las oportunidades observadas.",
          "partial": "Cumple las acciones concretas acordadas en algunas oportunidades observadas.",
          "error": "Cumple las acciones concretas acordadas en pocas oportunidades observadas.",
          "absent": "No cumple las acciones concretas acordadas en las oportunidades observadas; no equivale a ausencia de registro."
        }
      ]
    },
    {
      "id": "collective-health-message",
      "grade": 6,
      "label": "comunicación artística de salud colectiva",
      "match": "pieza visual.*salud colectiva|comunicacion artistica de salud colectiva",
      "relation": "las relaciones entre recursos visuales, claridad del mensaje y recomendaciones de la ficha de salud colectiva expresamente proporcionada, sin añadir consejos sanitarios o diagnósticos",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "ecbf50c1-9d60-5375-87a0-dc2a53cde6fa"
      ],
      "evidence": [
        {
          "id": "given-health-message",
          "title": "Recursos y fidelidad a la ficha dada",
          "success": "Relaciona los recursos visuales elegidos con la acción de la ficha proporcionada para comunicar un mensaje claro y fiel a su contenido, sin añadir recomendaciones no incluidas.",
          "sufficient": "El mensaje y la ficha se reconocen; un recurso secundario deja una ambigüedad sin alterar el contenido principal.",
          "partial": "La pieza presenta recursos pertinentes, pero una relación visual no comunica con claridad la acción de la ficha.",
          "error": "La pieza contradice la ficha o introduce una recomendación no sustentada en el material proporcionado."
        }
      ]
    },
    {
      "id": "collective-agreements",
      "grade": 6,
      "label": "propuestas y acuerdos de creación artística",
      "match": "aportan propuestas.*cumplen.*acuerdos|propuestas y acuerdos de creacion",
      "relation": "las acciones observables de aportar propuestas y cumplir acuerdos de la creación artística colectiva, distinguiendo frecuencia registrada y personalidad",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "207a82b0-8e3d-5e6f-893c-66bbb0ce1ea8"
      ],
      "evidence": [
        {
          "id": "observed-proposals",
          "title": "Frecuencia de aportes pertinentes",
          "success": "Aporta propuestas vinculadas con el propósito artístico acordado en todas las oportunidades observadas de creación colectiva.",
          "sufficient": "Aporta propuestas vinculadas con el propósito acordado en casi todas las oportunidades observadas.",
          "partial": "Aporta propuestas vinculadas con el propósito acordado en algunas oportunidades observadas.",
          "error": "Aporta propuestas vinculadas con el propósito acordado en pocas oportunidades observadas.",
          "absent": "No aporta propuestas vinculadas con el propósito acordado en las oportunidades observadas; no equivale a ausencia de registro."
        },
        {
          "id": "observed-agreements",
          "title": "Frecuencia de cumplimiento de acuerdos",
          "success": "Cumple las acciones concretas de los acuerdos artísticos dados en todas las oportunidades observadas de creación colectiva.",
          "sufficient": "Cumple las acciones concretas acordadas en casi todas las oportunidades observadas.",
          "partial": "Cumple las acciones concretas acordadas en algunas oportunidades observadas.",
          "error": "Cumple las acciones concretas acordadas en pocas oportunidades observadas.",
          "absent": "No cumple las acciones concretas acordadas en las oportunidades observadas; no equivale a ausencia de registro."
        }
      ]
    },
    {
      "id": "art-work-opportunities",
      "grade": 6,
      "label": "fuentes de trabajo artístico y artesanal",
      "match": "fuentes de trabajo artistico|fuentes de trabajo.*artesanal",
      "relation": "las relaciones entre técnicas, funciones y condiciones documentadas de las posibles fuentes de trabajo artístico o artesanal del caso ficticio, sin prometer ingresos o contratación",
      "pdfPages": [
        349
      ],
      "sourceRecordIds": [
        "eb055861-6e01-5431-a7bd-208d30848c14"
      ],
      "evidence": [
        {
          "id": "work-context-evidence",
          "title": "Técnicas, funciones y condiciones",
          "success": "Relaciona las técnicas y funciones del caso con condiciones documentadas de posibles fuentes de trabajo artístico o artesanal, diferenciando posibilidades sustentadas y promesas no acreditadas.",
          "sufficient": "Las posibilidades y sus condiciones se sostienen; una referencia secundaria queda poco precisada.",
          "partial": "Identifica funciones pertinentes, pero una posibilidad no se vincula con condiciones documentadas.",
          "error": "Presenta como garantizada una oportunidad no acreditada o contradice las condiciones del caso."
        }
      ]
    }
  ],
  "policy": "REQUESTED_ARTISTIC_EVIDENCE_V1"
}]} as unknown as EvaluationCatalog
