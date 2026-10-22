import type {EvaluationCatalog} from './catalog-current'
import {evaluationCatalogV145} from './catalog-v145'
/** Payload146 verificado con Development; conservar los cinco módulos técnicos publicados. */
export const evaluationCatalogV146={...evaluationCatalogV145,technicalModules:[
  {
    "id": "ifc006-mf053-4",
    "programCode": "IFC006_3",
    "moduleCode": "MF_053_3",
    "grade": 4,
    "cycle": 2,
    "modalityCode": "technical_professional",
    "subjectName": "Análisis y Diseño de Sistemas Informáticos",
    "sourceScopeId": "ifc006-mf053-4",
    "pdfPages": [
      15,
      16,
      17,
      18,
      19
    ],
    "policy": "REQUESTED_SYSTEM_ANALYSIS_DESIGN_FICTITIOUS_CASES_V1",
    "topics": [
      {
        "id": "organization",
        "grade": 4,
        "label": "Estructura organizacional",
        "match": "estructura organizacional|estructura (?:interna|de la organizacion)|dependencias|departamentos|sucursales",
        "relation": "la ubicación de las dependencias y sus vínculos dentro de la organización del caso",
        "pages": [
          15,
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-RA1.1",
          "ifc006-mf053-CE1.1.2",
          "ifc006-mf053-c-organization",
          "ifc006-mf053-p-organization"
        ]
      },
      {
        "id": "management",
        "grade": 4,
        "label": "Niveles directivos",
        "match": "niveles directivos|funciones directivas|nivel directivo",
        "relation": "la correspondencia entre las funciones o actividades dadas y el nivel directivo al que pertenecen",
        "pages": [
          15,
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.3",
          "ifc006-mf053-c-management-levels",
          "ifc006-mf053-p-management"
        ]
      },
      {
        "id": "analyst",
        "grade": 4,
        "label": "Funciones del analista de sistemas",
        "match": "analista de sistemas",
        "relation": "la función del analista en la identificación de necesidades y en la comunicación del análisis al usuario",
        "pages": [
          15,
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-RA1.1",
          "ifc006-mf053-c-analyst"
        ]
      },
      {
        "id": "objectives",
        "grade": 4,
        "label": "Objetivos de la entidad",
        "match": "objetivos (?:de la entidad|organizacionales|de la organizacion)",
        "relation": "la correspondencia entre los objetivos de la entidad y las necesidades que debe atender el sistema",
        "pages": [
          15,
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-RA1.1",
          "ifc006-mf053-c-objectives",
          "ifc006-mf053-p-objectives"
        ]
      },
      {
        "id": "resources",
        "grade": 4,
        "label": "Recursos de la organización",
        "match": "gestion de recursos|recursos de la organizacion",
        "relation": "la correspondencia entre los recursos disponibles y las necesidades del sistema en el caso dado",
        "pages": [
          15,
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.4",
          "ifc006-mf053-c-resources"
        ]
      },
      {
        "id": "processes",
        "grade": 4,
        "label": "Procesos organizacionales",
        "match": "procesos (?:productivos|organizacionales|de la organizacion)|gestion de procesos",
        "relation": "la relación entre las actividades del proceso y su finalidad dentro de la organización descrita",
        "pages": [
          15,
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.1",
          "ifc006-mf053-CE1.1.3",
          "ifc006-mf053-c-process-management",
          "ifc006-mf053-p-organization"
        ]
      },
      {
        "id": "process-measurement",
        "grade": 4,
        "label": "Medición y mejora de procesos",
        "match": "medicion(?:es)? de procesos|mejora de (?:los )?procesos|indicadores de (?:los )?procesos",
        "relation": "la correspondencia entre la medida del proceso, los datos del caso y la mejora solicitada",
        "pages": [
          15,
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.1",
          "ifc006-mf053-c-process-measurement"
        ]
      },
      {
        "id": "systems",
        "grade": 4,
        "label": "Tipos de sistemas de información",
        "match": "tipos de sistemas|clasificacion de sistemas|sistemas de informacion",
        "relation": "la correspondencia entre las características del sistema de información y la función que cumple en la organización",
        "pages": [
          15,
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-RA1.1",
          "ifc006-mf053-c-systems",
          "ifc006-mf053-p-system-types"
        ],
        "fallbackGroup": "system-detail"
      },
      {
        "id": "users",
        "grade": 4,
        "label": "Usuarios del sistema",
        "match": "tipos de usuarios|usuarios (?:internos|externos)|usuarios del sistema",
        "relation": "la correspondencia entre los tipos de usuario y su interacción prevista con el sistema del caso",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-RA1.2",
          "ifc006-mf053-c-users",
          "ifc006-mf053-p-users"
        ]
      },
      {
        "id": "requirements",
        "grade": 4,
        "label": "Requerimientos del usuario",
        "match": "requerimientos (?:del|de los) usuarios?|necesidades (?:del|de los) usuarios?|analisis del sistema",
        "relation": "la correspondencia entre las necesidades expresadas en el caso y los requerimientos de información identificados",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-RA1.3",
          "ifc006-mf053-CE1.3.1",
          "ifc006-mf053-c-users",
          "ifc006-mf053-p-needs",
          "ifc006-mf053-p-system-analysis"
        ],
        "fallbackGroup": "system-detail"
      },
      {
        "id": "feasibility-economic",
        "grade": 4,
        "label": "Factibilidad económica",
        "match": "(?:factibilidad|viabilidad) economica|economica(?=,? (?:tecnica|y operacional))",
        "relation": "la relación entre costos, recursos económicos disponibles y objetivos del sistema en el caso dado",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.4",
          "ifc006-mf053-c-feasibility",
          "ifc006-mf053-p-feasibility"
        ]
      },
      {
        "id": "feasibility-technical",
        "grade": 4,
        "label": "Factibilidad técnica",
        "match": "(?:factibilidad|viabilidad) (?:tecnica|tecnologica)|tecnica(?= y operacional)",
        "relation": "la compatibilidad técnica entre los recursos disponibles y las exigencias del sistema del caso",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.4",
          "ifc006-mf053-c-feasibility",
          "ifc006-mf053-p-feasibility"
        ]
      },
      {
        "id": "feasibility-operational",
        "grade": 4,
        "label": "Factibilidad operacional",
        "match": "(?:factibilidad|viabilidad) (?:humana|operacional)|operacional",
        "relation": "la correspondencia entre las tareas del sistema y la disponibilidad y preparación del personal descrito en el caso",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.4",
          "ifc006-mf053-c-feasibility",
          "ifc006-mf053-p-feasibility"
        ]
      },
      {
        "id": "feasibility",
        "grade": 4,
        "label": "Estudio de factibilidad",
        "match": "factibilidad|viabilidad",
        "relation": "la correspondencia entre las condiciones de factibilidad solicitadas, los recursos disponibles y los objetivos del sistema",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.4",
          "ifc006-mf053-c-feasibility",
          "ifc006-mf053-p-feasibility"
        ],
        "fallbackGroup": "feasibility"
      },
      {
        "id": "method-classic",
        "grade": 4,
        "label": "Ciclo de vida clásico",
        "match": "ciclo de vida clasico",
        "relation": "la secuencia de análisis del ciclo de vida clásico y su adecuación a las condiciones del sistema dado",
        "pages": [
          15,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.5",
          "ifc006-mf053-c-analysis-methods",
          "ifc006-mf053-p-method-selection"
        ]
      },
      {
        "id": "method-structured",
        "grade": 4,
        "label": "Análisis estructurado",
        "match": "analisis estructurado",
        "relation": "la relación entre los procesos, los datos y su descomposición en el análisis estructurado solicitado",
        "pages": [
          15,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.5",
          "ifc006-mf053-c-analysis-methods",
          "ifc006-mf053-p-method-selection"
        ]
      },
      {
        "id": "method-prototype",
        "grade": 4,
        "label": "Método del prototipo",
        "match": "metodo del prototipo|prototipo (?:del|de un) sistema",
        "relation": "la relación entre las necesidades del usuario y la representación preliminar con la que se revisan los requisitos del sistema",
        "pages": [
          15,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.5",
          "ifc006-mf053-c-analysis-methods",
          "ifc006-mf053-p-method-selection"
        ]
      },
      {
        "id": "method-objects",
        "grade": 4,
        "label": "Modelo orientado a objetos",
        "match": "modelo orientado a objetos|analisis orientado a objetos",
        "relation": "la correspondencia entre los objetos, sus responsabilidades y sus relaciones en el análisis solicitado",
        "pages": [
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-c-analysis-methods",
          "ifc006-mf053-p-method-selection"
        ]
      },
      {
        "id": "method-selection",
        "grade": 4,
        "label": "Métodos de análisis de sistemas",
        "match": "metodos? de analisis|metodologia de analisis",
        "relation": "la adecuación del método elegido a los requisitos y restricciones del sistema del caso",
        "pages": [
          15,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.5",
          "ifc006-mf053-c-analysis-methods",
          "ifc006-mf053-p-method-selection"
        ],
        "fallbackGroup": "method"
      },
      {
        "id": "sources",
        "grade": 4,
        "label": "Fuentes de información",
        "match": "fuentes de informacion|fuentes internas|fuentes externas",
        "relation": "la distinción entre las fuentes internas o externas solicitadas y su pertinencia para los datos que necesita el sistema",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-RA1.2",
          "ifc006-mf053-c-information-sources",
          "ifc006-mf053-p-sources"
        ]
      },
      {
        "id": "sampling",
        "grade": 4,
        "label": "Muestreo para el sistema",
        "match": "muestreo|muestra de datos",
        "relation": "la correspondencia entre la muestra de datos seleccionada, las variables requeridas y el conjunto del caso al que representa",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-RA1.2",
          "ifc006-mf053-c-collection-techniques",
          "ifc006-mf053-p-sampling"
        ]
      },
      {
        "id": "interview",
        "grade": 4,
        "label": "Entrevista de recopilación",
        "match": "entrevista",
        "relation": "la correspondencia entre las preguntas de la entrevista y la información que necesita el sistema, con lenguaje comprensible para el usuario del caso",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.6",
          "ifc006-mf053-CE1.2.1",
          "ifc006-mf053-CE1.2.2",
          "ifc006-mf053-c-collection-techniques",
          "ifc006-mf053-p-interview"
        ],
        "application": "Formula las preguntas de la entrevista simulada con lenguaje comprensible y escucha las respuestas del usuario sin atribuirle información que no aportó."
      },
      {
        "id": "questionnaire",
        "grade": 4,
        "label": "Cuestionario de recopilación",
        "match": "cuestionario|encuesta",
        "relation": "la correspondencia entre las preguntas y opciones de respuesta del cuestionario y los datos requeridos, con lenguaje comprensible para el usuario del caso",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.6",
          "ifc006-mf053-CE1.2.1",
          "ifc006-mf053-CE1.2.2",
          "ifc006-mf053-c-collection-techniques",
          "ifc006-mf053-p-questionnaire"
        ],
        "application": "Aplica el cuestionario en el caso simulado y registra las respuestas respetando sus categorías, sin completar por cuenta propia respuestas ausentes."
      },
      {
        "id": "observation",
        "grade": 4,
        "label": "Observación de procesos",
        "match": "observacion directa|observacion (?:del|de un) proceso",
        "relation": "la correspondencia entre los aspectos observables del proceso y la información que necesita el sistema",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.6",
          "ifc006-mf053-CE1.2.1",
          "ifc006-mf053-CE1.2.2",
          "ifc006-mf053-c-collection-techniques",
          "ifc006-mf053-p-observation"
        ],
        "application": "Registra lo observado en el proceso simulado separando los hechos de sus interpretaciones, según las categorías solicitadas."
      },
      {
        "id": "document-review",
        "grade": 4,
        "label": "Revisión de documentos",
        "match": "revision de documentos|revisa(?:r|n)? (?:los )?documentos",
        "relation": "la correspondencia entre los datos localizados en los documentos proporcionados y la información requerida por el sistema",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.1.6",
          "ifc006-mf053-CE1.2.1",
          "ifc006-mf053-CE1.2.2",
          "ifc006-mf053-c-collection-techniques",
          "ifc006-mf053-p-document-review"
        ],
        "application": "Localiza en los documentos proporcionados los datos solicitados y conserva la referencia que permite comprobar su procedencia."
      },
      {
        "id": "collection-techniques",
        "grade": 4,
        "label": "Técnicas de recopilación",
        "match": "tecnicas? de (?:recoleccion|recopilacion|investigacion)",
        "relation": "la adecuación de la técnica elegida a los datos requeridos y al contexto del usuario descrito",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-RA1.2",
          "ifc006-mf053-CE1.1.6",
          "ifc006-mf053-CE1.2.1",
          "ifc006-mf053-c-collection-techniques"
        ],
        "fallbackGroup": "collection"
      },
      {
        "id": "data-types",
        "grade": 4,
        "label": "Tipos de datos",
        "match": "tipos de datos|datos de tipo|fechas.*(?:logicos|numericos|textos)|valores logicos",
        "relation": "la correspondencia entre los valores proporcionados y los tipos de datos solicitados, distinguiendo su representación y uso en el sistema",
        "pages": [
          15,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.2.3",
          "ifc006-mf053-c-data-algorithm",
          "ifc006-mf053-p-data-types"
        ]
      },
      {
        "id": "tabulation",
        "grade": 4,
        "label": "Tabulación de datos",
        "match": "tabula\\w*|tabulacion|tabla de entradas",
        "relation": "la correspondencia entre cada dato proporcionado, su categoría de entrada, proceso o salida y su ubicación en la tabla solicitada",
        "pages": [
          16,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.2.4",
          "ifc006-mf053-p-tabulation"
        ]
      },
      {
        "id": "algorithm-elements",
        "grade": 4,
        "label": "Elementos de algoritmos",
        "match": "elementos (?:de |del |de un )algoritmo|algoritmos? computacionales?",
        "relation": "la distinción entre los elementos del algoritmo y su función en la transformación de las entradas en resultados",
        "pages": [
          16,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.2",
          "ifc006-mf053-c-data-algorithm",
          "ifc006-mf053-p-algorithm-elements"
        ]
      },
      {
        "id": "algorithm-phases",
        "grade": 4,
        "label": "Fases de algoritmos",
        "match": "fases? (?:de |del |de un )algoritmo",
        "relation": "la secuencia de las fases del algoritmo y el papel de cada fase en la solución descrita",
        "pages": [
          16,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.2",
          "ifc006-mf053-c-data-algorithm",
          "ifc006-mf053-p-algorithm-phases"
        ]
      },
      {
        "id": "operators",
        "grade": 4,
        "label": "Operadores computacionales",
        "match": "operadores (?:computacionales|logicos|aritmeticos|relacionales)|tipos de operadores",
        "relation": "la correspondencia entre el operador solicitado, sus operandos y el resultado que produce en la expresión del caso",
        "pages": [
          16,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.3",
          "ifc006-mf053-c-data-algorithm",
          "ifc006-mf053-p-operators"
        ]
      },
      {
        "id": "symbols",
        "grade": 4,
        "label": "Símbolos de diagramación",
        "match": "simbolos (?:de|del|para)|tipos de simbolos",
        "relation": "la correspondencia entre los símbolos seleccionados y las operaciones que representan en el diagrama solicitado",
        "pages": [
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-c-diagrams",
          "ifc006-mf053-p-symbols"
        ],
        "requires": "diagrama|programador|programacion|algoritmo"
      },
      {
        "id": "instructions",
        "grade": 4,
        "label": "Instrucciones del sistema",
        "match": "tipos de instrucciones|instrucciones (?:del|de un) (?:sistema|algoritmo)",
        "relation": "la correspondencia entre cada instrucción y la operación que debe realizar según la lógica solicitada",
        "pages": [
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-c-diagrams",
          "ifc006-mf053-p-instructions"
        ]
      },
      {
        "id": "expressions",
        "grade": 4,
        "label": "Expresiones computacionales",
        "match": "tipos de expresiones|expresiones (?:logicas|aritmeticas|computacionales)",
        "relation": "la correspondencia entre los datos, los operadores y el resultado de la expresión solicitada",
        "pages": [
          16,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-c-diagrams",
          "ifc006-mf053-p-expressions"
        ]
      },
      {
        "id": "file-hierarchy",
        "grade": 4,
        "label": "Jerarquización de archivos",
        "match": "jerarqui\\w* de archivos|jerarqui\\w* (?:los )?archivos",
        "relation": "la correspondencia entre la jerarquía de archivos y las relaciones de organización o acceso indicadas en el caso",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-c-files-arrays",
          "ifc006-mf053-p-file-hierarchy"
        ]
      },
      {
        "id": "records",
        "grade": 4,
        "label": "Registros de archivo",
        "match": "registros? (?:del|de un|de los) archivos?|campos de (?:los )?registros",
        "relation": "la correspondencia entre los campos del registro, sus valores y la estructura del archivo descrito",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-c-files-arrays",
          "ifc006-mf053-p-records"
        ],
        "fallbackGroup": "record"
      },
      {
        "id": "file-diagram",
        "grade": 4,
        "label": "Diagrama de archivos",
        "match": "diagramacion de archivos|diagrama de archivos",
        "relation": "las relaciones entre los archivos necesarias para los procesos del sistema descrito",
        "pages": [
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-p-file-diagrams",
          "ifc006-mf053-c-files-arrays"
        ]
      },
      {
        "id": "reports",
        "grade": 4,
        "label": "Reportes del sistema",
        "match": "reportes (?:del|de un) sistema|genera\\w* reportes",
        "relation": "la correspondencia entre los datos de origen y la información del reporte solicitado, manteniendo los campos y agrupaciones indicados",
        "pages": [
          16,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.1",
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-p-reports"
        ]
      },
      {
        "id": "sequences",
        "grade": 4,
        "label": "Secuencias del sistema",
        "match": "secuencias? (?:del|de un) (?:sistema|algoritmo)|verifica\\w* secuencias",
        "relation": "la continuidad lógica entre pasos y el resultado esperado para las entradas del caso",
        "pages": [
          16,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-p-sequences"
        ]
      },
      {
        "id": "debug-records",
        "grade": 4,
        "label": "Depuración de registros",
        "match": "depura\\w* (?:los )?registros|depuracion de registros",
        "relation": "la identificación y corrección de inconsistencias en los registros proporcionados según las reglas indicadas, conservando los valores válidos",
        "pages": [
          16,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-p-debug-records"
        ]
      },
      {
        "id": "arrays",
        "grade": 4,
        "label": "Arreglos computacionales",
        "match": "arreglos (?:computacionales|del sistema)|arreglo unidimensional|arreglo multidimensional",
        "relation": "la correspondencia entre los elementos, sus posiciones y el acceso a los datos del arreglo solicitado",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-c-files-arrays",
          "ifc006-mf053-p-arrays"
        ],
        "fallbackGroup": "array"
      },
      {
        "id": "vectors",
        "grade": 4,
        "label": "Vectores computacionales",
        "match": "vector(?:es)? (?:computacional(?:es)?|del sistema)|vector unidimensional",
        "relation": "la correspondencia entre índice, posición y valor en el vector del caso, según la representación proporcionada",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-c-files-arrays",
          "ifc006-mf053-p-vectors"
        ]
      },
      {
        "id": "array-types",
        "grade": 4,
        "label": "Tipos de arreglos",
        "match": "tipos de arreglos",
        "relation": "la distinción entre los tipos de arreglos solicitados por sus dimensiones y organización de los datos",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-c-files-arrays",
          "ifc006-mf053-p-array-types"
        ]
      },
      {
        "id": "characteristics",
        "grade": 4,
        "label": "Características del sistema",
        "match": "caracteristicas del sistema",
        "relation": "la correspondencia entre las características señaladas y las necesidades de información de la organización del caso",
        "pages": [
          16,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-p-characteristics"
        ]
      },
      {
        "id": "classes",
        "grade": 4,
        "label": "Clases del modelo de objetos",
        "match": "clases (?:del|de un) (?:modelo|sistema)|clases y objetos",
        "relation": "la distinción entre una clase y sus instancias, según los atributos y responsabilidades del modelo proporcionado",
        "pages": [
          16,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-c-files-arrays"
        ],
        "fallbackGroup": "class"
      },
      {
        "id": "objects",
        "grade": 4,
        "label": "Objetos del sistema",
        "match": "objetos (?:del|de un) (?:modelo|sistema)",
        "relation": "la correspondencia entre los objetos identificados y las clases, atributos o responsabilidades del modelo proporcionado",
        "pages": [
          16,
          17
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-c-analysis-methods"
        ],
        "fallbackGroup": "object"
      },
      {
        "id": "decision-tree",
        "grade": 4,
        "label": "Árbol de decisión",
        "match": "arbol(?:es)? de decision",
        "relation": "la correspondencia entre las condiciones, sus ramas y los resultados del árbol, según las reglas del caso",
        "pages": [
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-p-decision-tree"
        ]
      },
      {
        "id": "decision-table",
        "grade": 4,
        "label": "Tabla de decisión",
        "match": "tablas? de decision",
        "relation": "la correspondencia entre las combinaciones de condiciones y las acciones de la tabla, según las reglas del caso",
        "pages": [
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-p-decision-table"
        ]
      },
      {
        "id": "diagram-use-case",
        "grade": 4,
        "label": "Diagrama de casos de uso",
        "match": "diagramas? de (?:casos? de )?uso",
        "relation": "la correspondencia entre actores, casos de uso y alcance funcional del sistema solicitado",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.4",
          "ifc006-mf053-c-diagrams",
          "ifc006-mf053-p-diagrams"
        ]
      },
      {
        "id": "diagram-class",
        "grade": 4,
        "label": "Diagrama de clases",
        "match": "diagramas? de clases|diagramacion de clases",
        "relation": "la correspondencia entre clases, atributos y relaciones en el modelo solicitado",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.4",
          "ifc006-mf053-c-files-arrays",
          "ifc006-mf053-p-class-diagrams",
          "ifc006-mf053-p-diagrams"
        ]
      },
      {
        "id": "diagram-behavior",
        "grade": 4,
        "label": "Diagrama de comportamiento",
        "match": "diagramas? de comportamiento",
        "relation": "la correspondencia entre los estados o acciones representados y las condiciones que explican su cambio en el caso",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.4",
          "ifc006-mf053-c-diagrams"
        ]
      },
      {
        "id": "diagram-object",
        "grade": 4,
        "label": "Diagrama de objetos",
        "match": "diagramas? de objetos",
        "relation": "la correspondencia entre las instancias, sus valores y sus vínculos en la situación representada",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.4",
          "ifc006-mf053-c-diagrams",
          "ifc006-mf053-p-diagrams"
        ]
      },
      {
        "id": "diagram-interaction",
        "grade": 4,
        "label": "Diagrama de interacción",
        "match": "diagramas? de interaccion",
        "relation": "la correspondencia entre participantes, mensajes y orden de las interacciones requeridas",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.4",
          "ifc006-mf053-c-diagrams"
        ]
      },
      {
        "id": "diagram-process",
        "grade": 4,
        "label": "Diagrama de procesos",
        "match": "diagramas? de procesos",
        "relation": "la correspondencia entre las actividades, su secuencia y las entradas o salidas del proceso representado",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.4",
          "ifc006-mf053-c-diagrams",
          "ifc006-mf053-p-diagrams"
        ]
      },
      {
        "id": "diagram-flow",
        "grade": 4,
        "label": "Diagrama de flujo",
        "match": "diagramas? de flujos?",
        "relation": "la correspondencia entre símbolos, decisiones y recorrido lógico del flujo solicitado",
        "pages": [
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-c-diagrams",
          "ifc006-mf053-p-diagrams"
        ]
      },
      {
        "id": "diagram-distribution",
        "grade": 4,
        "label": "Diagrama de distribución",
        "match": "diagramas? de distribucion",
        "relation": "la correspondencia entre los componentes representados y su distribución indicada en el caso",
        "pages": [
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-c-diagrams",
          "ifc006-mf053-p-diagrams"
        ]
      },
      {
        "id": "diagram-selection",
        "grade": 4,
        "label": "Selección de diagramas",
        "match": "seleccion\\w* (?:los )?diagramas|tipos de diagramas|usos de (?:los )?diagramas",
        "relation": "la adecuación del tipo de diagrama elegido a los requerimientos que debe representar",
        "pages": [
          16,
          17,
          18
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.4",
          "ifc006-mf053-c-diagrams"
        ],
        "fallbackGroup": "diagram"
      },
      {
        "id": "interface",
        "grade": 4,
        "label": "Interfaz del sistema",
        "match": "(?:interfaz|interfaces) graficas?|(?:interfaz|interfaces) (?:del|de un) sistema",
        "relation": "la correspondencia entre los controles, la información mostrada y la interacción requerida en el diseño de interfaz",
        "pages": [
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.5",
          "ifc006-mf053-CE1.3.6"
        ]
      },
      {
        "id": "inputs",
        "grade": 4,
        "label": "Entradas del sistema",
        "match": "entradas (?:del|de un) sistema|diseno de entradas",
        "relation": "la correspondencia entre los datos de entrada, su formato y los requisitos del sistema descrito",
        "pages": [
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.6"
        ]
      },
      {
        "id": "outputs",
        "grade": 4,
        "label": "Salidas del sistema",
        "match": "salidas (?:del|de un) sistema|diseno de salidas",
        "relation": "la correspondencia entre la información de salida y las necesidades del usuario descritas en el caso",
        "pages": [
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.6"
        ]
      },
      {
        "id": "database",
        "grade": 4,
        "label": "Estructura básica de datos",
        "match": "bases? de datos",
        "relation": "la correspondencia entre los datos requeridos, los campos y las relaciones de la estructura básica representada",
        "pages": [
          16
        ],
        "sourceRecordIds": [
          "ifc006-mf053-CE1.3.6"
        ]
      }
    ]
  },
  {
    "id": "mf002-4",
    "programCode": "IFC007_3",
    "programCodes": [
      "IFC006_3",
      "IFC007_3"
    ],
    "moduleCode": "MF_002_3",
    "grade": 4,
    "cycle": 2,
    "modalityCode": "technical_professional",
    "subjectName": "Ofimática",
    "sourceScopeId": "mf002-4",
    "templatePrefix": "technical-mf002",
    "additionalVerbs": "(?:cre(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|prepar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|insert(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|configur(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|conect(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|desconect(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|transcrib(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|practic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|practiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|modific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|modifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|personaliz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|personalic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|anad(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|combin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|guard(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|gestion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|distribuy(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|distribu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|filtr(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|import(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|export(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|duplic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|dupliqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|archiv(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|corrig(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|envi(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|imprim(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|publiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|public(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|utiliz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|utilic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|aplic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|apliqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|seleccion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|reorganiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|reorganic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|organiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|organic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|disen(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|tabul(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|depur(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|gener(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|diagram(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|jerarqui(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|enumer(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|program(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|implement(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|justific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|justifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|busc(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|busqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|comprueb(?:a|an|e|en)|disting(?:ue|uen|uir|a|an)|recon(?:oce|ocen|ocer|ozca|ozcan)|prop(?:one|onen|oner|onga|ongan))(?:lo|la|los|las)?",
    "pdfPages": [
      54,
      55,
      56,
      57,
      58,
      59,
      60,
      61,
      62,
      63,
      64,
      65,
      66
    ],
    "policy": "REQUESTED_OFFICE_ACTIONS_FICTITIOUS_DATA_NO_IMPLICIT_DELIVERY_V1",
    "topics": [
      {
        "id": "hardware",
        "grade": 4,
        "label": "Hardware del equipo",
        "match": "hardware|componentes fisicos",
        "relation": "la función de los componentes físicos identificados en el equipo del caso",
        "pages": [
          54,
          55,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-1-1",
          "technical-mf002-ce1-2-1",
          "technical-mf002-ce1-8-1",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ]
      },
      {
        "id": "software",
        "grade": 4,
        "label": "Software de sistema y aplicación",
        "match": "software",
        "relation": "la distinción entre los programas de sistema y de aplicación por su función, sin confundirlos con componentes físicos",
        "pages": [
          54,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-2-1",
          "technical-mf002-ce1-3-1",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ]
      },
      {
        "id": "os-interface",
        "grade": 4,
        "label": "Interfaz del sistema operativo",
        "match": "escritorio|ventanas|barras de tareas|interfaz del sistema operativo",
        "relation": "la ubicación y función de los elementos de la interfaz solicitados en el entorno mostrado",
        "pages": [
          54,
          55,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-7-1",
          "technical-mf002-ce1-10-1",
          "technical-mf002-procedure-001",
          "technical-mf002-procedure-002",
          "technical-mf002-procedure-003",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ]
      },
      {
        "id": "os-settings",
        "grade": 4,
        "label": "Configuración del sistema operativo",
        "match": "opciones del sistema operativo|panel de control|configura\\w*[^.;]*sistema operativo",
        "relation": "la correspondencia entre las opciones configuradas y el funcionamiento pedido en el entorno de práctica",
        "pages": [
          54,
          55,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-4-1",
          "technical-mf002-ce1-11-1",
          "technical-mf002-procedure-004",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ]
      },
      {
        "id": "os-tools",
        "grade": 4,
        "label": "Accesorios y herramientas del sistema operativo",
        "match": "accesorios|herramientas del sistema operativo|unidades de discos",
        "relation": "la función y el resultado de las herramientas solicitadas en el entorno de práctica",
        "pages": [
          54,
          55,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-4-1",
          "technical-mf002-ce1-8-1",
          "technical-mf002-procedure-005",
          "technical-mf002-procedure-006",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ]
      },
      {
        "id": "os-commands",
        "grade": 4,
        "label": "Comandos del sistema operativo",
        "match": "comandos del sistema operativo",
        "relation": "la correspondencia entre el comando solicitado, sus parámetros y el resultado esperado en el entorno de práctica",
        "pages": [
          54,
          55,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-11-1",
          "technical-mf002-procedure-008",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ]
      },
      {
        "id": "peripherals",
        "grade": 4,
        "label": "Periféricos del equipo",
        "match": "perifericos",
        "relation": "la función de los periféricos señalados y su relación con la entrada, salida o almacenamiento de datos del equipo",
        "pages": [
          54,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-5-1",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ]
      },
      {
        "id": "peripheral-connection",
        "grade": 4,
        "label": "Conexión de periféricos",
        "match": "conect\\w*|desconect\\w*",
        "relation": "la correspondencia entre el periférico, su conexión y el procedimiento del manual dado, con las medidas de cuidado solicitadas",
        "pages": [
          54,
          55,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-6-1",
          "technical-mf002-ce1-11-1",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ],
        "requires": "teclado|impresora|periferico|raton|monitor|escaner"
      },
      {
        "id": "antivirus-firewall",
        "grade": 4,
        "label": "Antivirus y cortafuegos",
        "match": "antivirus|cortafuegos|firewall",
        "relation": "la distinción entre detección de software malicioso y control de comunicaciones, según las herramientas del caso",
        "pages": [
          54,
          55,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-9-1",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ]
      },
      {
        "id": "storage-maintenance",
        "grade": 4,
        "label": "Mantenimiento y respaldo de disco",
        "match": "desfragmentacion|reparacion[^.;]*disco|respaldo de disco",
        "relation": "la relación entre el problema de almacenamiento, el procedimiento indicado y la conservación de los datos del caso",
        "pages": [
          54,
          55,
          61,
          62
        ],
        "sourceRecordIds": [
          "technical-mf002-ce1-11-1",
          "technical-mf002-procedure-007",
          "technical-mf002-ra1-1",
          "technical-mf002-concept-1"
        ]
      },
      {
        "id": "keyboard",
        "grade": 4,
        "label": "Transcripción con teclado",
        "match": "teclado alfanumerico|mecanografia|transcrib\\w*",
        "relation": "la fidelidad del texto transcrito al original y las condiciones de precisión o velocidad expresamente indicadas",
        "pages": [
          55,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-1-1",
          "technical-mf002-ra2-1",
          "technical-mf002-concept-2"
        ],
        "relationsByMode": {
          "recording": "la correspondencia entre las mediciones registradas de velocidad y precisión y la práctica realizada, con las unidades y condiciones indicadas"
        }
      },
      {
        "id": "workspace",
        "grade": 4,
        "label": "Espacio de trabajo informático",
        "match": "espacio de trabajo informatico|ergonomic\\w*",
        "relation": "la correspondencia entre la organización del espacio, las medidas de cuidado y las adaptaciones descritas en la ficha",
        "pages": [
          55,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-1-1",
          "technical-mf002-ra2-1",
          "technical-mf002-concept-2"
        ]
      },
      {
        "id": "document",
        "grade": 4,
        "label": "Documento de texto",
        "match": "documento de texto|procesador de textos|procesador de palabras",
        "relation": "la fidelidad a los datos proporcionados y su organización en el documento de texto solicitado",
        "pages": [
          55,
          56,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-5-1",
          "technical-mf002-procedure-009",
          "technical-mf002-ra2-1",
          "technical-mf002-concept-2"
        ]
      },
      {
        "id": "document-template",
        "grade": 4,
        "label": "Plantillas de documentos",
        "match": "plantilla de (?:memorando|carta|documento|informe)|plantillas?[^.;]*(?:procesador|texto)",
        "relation": "la correspondencia entre los campos de la plantilla, los datos que deben completarse y el tipo de documento solicitado",
        "pages": [
          55,
          62,
          63,
          64
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-3-1",
          "technical-mf002-procedure-047",
          "technical-mf002-procedure-048",
          "technical-mf002-ra2-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "text-format",
        "grade": 4,
        "label": "Formato del texto",
        "match": "fuente|parrafos|sangrias|tabulaciones|formato de texto",
        "relation": "la aplicación de las opciones de texto solicitadas según el modelo, manteniendo el contenido legible",
        "pages": [
          55,
          56,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-4-1",
          "technical-mf002-ce2-5-1",
          "technical-mf002-procedure-010",
          "technical-mf002-procedure-021",
          "technical-mf002-ra2-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "requires": "documento|texto|procesador",
        "application": "Aplica solo las opciones de formato indicadas en el modelo, conservando el texto y su legibilidad."
      },
      {
        "id": "page-format",
        "grade": 4,
        "label": "Configuración de página",
        "match": "margenes|orientacion|encabezados|pies|numeracion de paginas|saltos de pagina|saltos de seccion",
        "relation": "la correspondencia entre las opciones de página y el modelo solicitado, incluidas solo las distinciones indicadas entre secciones",
        "pages": [
          55,
          56,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-6-1",
          "technical-mf002-procedure-016",
          "technical-mf002-procedure-022",
          "technical-mf002-procedure-025",
          "technical-mf002-procedure-035",
          "technical-mf002-procedure-036",
          "technical-mf002-procedure-037",
          "technical-mf002-ra2-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "requires": "documento|texto|procesador"
      },
      {
        "id": "text-correction",
        "grade": 4,
        "label": "Corrección del texto",
        "match": "corrig\\w*[^.;]*(?:texto|errores)|ortografia|gramatica|buscar y reemplazar|sinonimos|autocorreccion",
        "relation": "el significado de la información proporcionada al subsanar los errores del texto",
        "pages": [
          55,
          56,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-1-1",
          "technical-mf002-ce2-5-1",
          "technical-mf002-procedure-015",
          "technical-mf002-procedure-038",
          "technical-mf002-procedure-039",
          "technical-mf002-procedure-040",
          "technical-mf002-procedure-041",
          "technical-mf002-procedure-042",
          "technical-mf002-ra2-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "exclude": "presentacion|diapositivas"
      },
      {
        "id": "word-customize",
        "grade": 4,
        "label": "Personalización del procesador de textos",
        "match": "cinta de opciones|acceso rapido|atajos|metodos abreviados",
        "relation": "la correspondencia entre la personalización de las herramientas del procesador y los accesos solicitados",
        "pages": [
          55,
          56,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-7-1",
          "technical-mf002-ra2-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "word-tables",
        "grade": 4,
        "label": "Tablas en documentos",
        "match": "tabla[^.;]*(?:documento|procesador)|(?:documento|procesador)[^.;]*tabla",
        "relation": "la correspondencia entre los datos dados y su ubicación en filas y columnas de la tabla del documento",
        "pages": [
          56,
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-1-1",
          "technical-mf002-ce3-3-1",
          "technical-mf002-procedure-011",
          "technical-mf002-procedure-026",
          "technical-mf002-procedure-027",
          "technical-mf002-procedure-028",
          "technical-mf002-procedure-029",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "relationsByMode": {
          "application": "la correspondencia entre la estructura de filas y columnas insertada y el modelo de tabla solicitado",
          "sequence": "la correspondencia entre cada dato dado y su ubicación en las filas y columnas de la tabla"
        }
      },
      {
        "id": "word-table-structure",
        "grade": 4,
        "label": "Estructura y formato de tablas",
        "match": "(?:modific\\w*|combin\\w*|divid\\w*)[^.;]*(?:filas|columnas|celdas)|bordes[^.;]*celdas",
        "relation": "la correspondencia entre la estructura o formato de la tabla y el modelo solicitado, conservando los datos de las celdas",
        "pages": [
          56,
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-3-1",
          "technical-mf002-procedure-030",
          "technical-mf002-procedure-031",
          "technical-mf002-procedure-032",
          "technical-mf002-procedure-033",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document",
          "word-tables"
        ],
        "requires": "documento|procesador"
      },
      {
        "id": "word-table-formula",
        "grade": 4,
        "label": "Operaciones en tablas de texto",
        "match": "formula[^.;]*(?:tabla|procesador)|ordena\\w*[^.;]*tabla",
        "relation": "la correspondencia entre la operación solicitada, los datos de la tabla y su resultado dentro del procesador de textos",
        "pages": [
          56,
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-3-1",
          "technical-mf002-procedure-034",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document",
          "word-tables"
        ],
        "requires": "procesador de textos|tabla del documento",
        "relationsByMode": {
          "application": "la correspondencia entre la fórmula solicitada, sus referencias de celdas y el resultado de la tabla",
          "sequence": "el orden indicado para los registros de la tabla, conservando los datos asociados a cada registro"
        }
      },
      {
        "id": "word-images",
        "grade": 4,
        "label": "Imágenes del documento",
        "match": "imagen|imagenes|autoformas",
        "relation": "la correspondencia entre la imagen solicitada, su ubicación y el contenido del documento, sin deformar la información representada",
        "pages": [
          56,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-1-1",
          "technical-mf002-ce3-2-1",
          "technical-mf002-procedure-020",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "requires": "documento|texto|procesador"
      },
      {
        "id": "word-diagrams",
        "grade": 4,
        "label": "Diagramas y formas del documento",
        "match": "diagrama de formas|arte inteligente|smartart|formas del documento",
        "relation": "la representación de las relaciones dadas mediante las formas y conexiones del diagrama solicitado",
        "pages": [
          56,
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-3-1",
          "technical-mf002-procedure-011",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "requires": "documento|procesador"
      },
      {
        "id": "word-watermark",
        "grade": 4,
        "label": "Marca de agua",
        "match": "marca de agua|marcas de agua",
        "relation": "la aplicación de la marca de agua solicitada sin impedir la lectura del documento",
        "pages": [
          56,
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-3-1",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "application": "Inserta la marca de agua indicada conservando la legibilidad del documento."
      },
      {
        "id": "word-equation",
        "grade": 4,
        "label": "Símbolos y ecuaciones del documento",
        "match": "simbolos|ecuacion|ecuaciones",
        "relation": "la fidelidad de los símbolos o ecuaciones insertados a la expresión proporcionada",
        "pages": [
          56,
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-3-1",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "requires": "documento|texto|procesador"
      },
      {
        "id": "word-screenshot",
        "grade": 4,
        "label": "Capturas de pantalla en documentos",
        "match": "captura de pantalla|capturas de pantalla",
        "relation": "la correspondencia entre la captura proporcionada, su ubicación y la información que debe mostrar en el documento",
        "pages": [
          56,
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-3-1",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "requires": "documento|texto|procesador"
      },
      {
        "id": "word-outline",
        "grade": 4,
        "label": "Esquema y bloques del documento",
        "match": "esquema de titulos|bloques de creacion|esquema de un documento",
        "relation": "la organización de los títulos o bloques conforme a la estructura solicitada, conservando su contenido",
        "pages": [
          56,
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-3-1",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "word-columns",
        "grade": 4,
        "label": "Columnas de texto",
        "match": "columnas periodisticas|texto en columnas|columnas (?:del|de un|en el) documento",
        "relation": "la distribución del texto en las columnas solicitadas, con continuidad de lectura y sin pérdida de contenido",
        "pages": [
          55,
          56,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-5-1",
          "technical-mf002-procedure-023",
          "technical-mf002-procedure-024",
          "technical-mf002-procedure-025",
          "technical-mf002-ra2-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "mail-merge",
        "grade": 4,
        "label": "Combinación de correspondencia",
        "match": "combinacion de correspondencia|correspondencia personalizada|carta modelo|combina\\w*[^.;]*correspondencia",
        "relation": "la correspondencia entre los campos del modelo y los datos ficticios de cada destinatario en los documentos personalizados",
        "pages": [
          55,
          56,
          57,
          62,
          63,
          64
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-8-1",
          "technical-mf002-ce3-4-1",
          "technical-mf002-ce3-5-1",
          "technical-mf002-ce3-6-1",
          "technical-mf002-procedure-012",
          "technical-mf002-procedure-043",
          "technical-mf002-procedure-044",
          "technical-mf002-procedure-046",
          "technical-mf002-ra2-1",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "labels",
        "grade": 4,
        "label": "Sobres y etiquetas",
        "match": "sobres|etiquetas",
        "relation": "la correspondencia entre los datos ficticios, los campos y la distribución solicitada en los sobres o etiquetas preparados",
        "pages": [
          56,
          57,
          62,
          63,
          64
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-4-2",
          "technical-mf002-procedure-017",
          "technical-mf002-procedure-018",
          "technical-mf002-procedure-019",
          "technical-mf002-procedure-045",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "word-comments",
        "grade": 4,
        "label": "Comentarios del documento",
        "match": "comentarios",
        "relation": "la pertinencia de los comentarios respecto del fragmento revisado y su tratamiento según las indicaciones",
        "pages": [
          56,
          57,
          62,
          63,
          64
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-5-2",
          "technical-mf002-procedure-049",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "requires": "documento de texto|procesador"
      },
      {
        "id": "word-changes",
        "grade": 4,
        "label": "Control de cambios del documento",
        "match": "control de cambios",
        "relation": "la identificación y gestión de las revisiones solicitadas, preservando los cambios que deban conservarse",
        "pages": [
          56,
          57,
          62,
          63,
          64
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-5-2",
          "technical-mf002-procedure-050",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "requires": "documento|texto|procesador"
      },
      {
        "id": "word-comparison",
        "grade": 4,
        "label": "Comparación de documentos",
        "match": "versiones del documento|compar\\w*[^.;]*documentos|combina\\w*[^.;]*documentos",
        "relation": "las diferencias identificadas entre las versiones dadas y su relación con la decisión solicitada",
        "pages": [
          56,
          57,
          62,
          63,
          64
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-5-2",
          "technical-mf002-procedure-051",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "relationsByMode": {
          "comparison": "la identificación de diferencias relevantes entre las versiones del documento proporcionadas",
          "application": "la conservación de los cambios solicitados en el documento combinado, sin perder contenido válido"
        }
      },
      {
        "id": "word-protection",
        "grade": 4,
        "label": "Protección del documento",
        "match": "proteccion[^.;]*documento|proteg\\w*[^.;]*documento|protege\\w*[^.;]*documento",
        "relation": "la correspondencia entre las restricciones de edición solicitadas y los permisos previstos para el documento del caso",
        "pages": [
          56,
          57,
          62,
          63,
          64
        ],
        "sourceRecordIds": [
          "technical-mf002-ce3-5-2",
          "technical-mf002-procedure-052",
          "technical-mf002-ra3-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "file-export",
        "grade": 4,
        "label": "Formatos de archivo del documento",
        "match": "formatos de archivo|guarda\\w*[^.;]*formatos|archivo de documentos",
        "relation": "la conservación del contenido al guardar el documento en los formatos solicitados",
        "pages": [
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce4-1-1",
          "technical-mf002-procedure-014",
          "technical-mf002-ra4-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "web-document",
        "grade": 4,
        "label": "Documento web",
        "match": "documento web|documentos web",
        "relation": "la correspondencia entre el contenido, las secciones y la estructura del documento web preparado",
        "pages": [
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce4-2-1",
          "technical-mf002-ra4-1",
          "technical-mf002-concept-2"
        ]
      },
      {
        "id": "blog-entry",
        "grade": 4,
        "label": "Entrada de blog",
        "match": "entrada de blog|entradas de blog",
        "relation": "la correspondencia entre el texto preparado, los datos proporcionados y la estructura solicitada para la entrada",
        "pages": [
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce4-3-1",
          "technical-mf002-ra4-1",
          "technical-mf002-concept-2"
        ]
      },
      {
        "id": "word-links",
        "grade": 4,
        "label": "Hipervínculos del documento",
        "match": "hipervinculos",
        "relation": "la correspondencia entre el texto del enlace y el destino solicitado, comprobando su referencia",
        "pages": [
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce4-4-1",
          "technical-mf002-procedure-013",
          "technical-mf002-ra4-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ],
        "requires": "documento|texto|procesador"
      },
      {
        "id": "word-references",
        "grade": 4,
        "label": "Campos y referencias cruzadas",
        "match": "marcadores|referencias cruzadas|campos[^.;]*documento largo",
        "relation": "la correspondencia de los campos, marcadores o referencias solicitados con sus destinos dentro del documento",
        "pages": [
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce4-4-1",
          "technical-mf002-ra4-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "word-contents",
        "grade": 4,
        "label": "Tabla de contenidos",
        "match": "tabla de contenidos|tabla de contenido",
        "relation": "la correspondencia entre las entradas de la tabla, la jerarquía de títulos y sus ubicaciones en el documento",
        "pages": [
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce4-4-1",
          "technical-mf002-ra4-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document",
          "word-tables"
        ]
      },
      {
        "id": "word-index",
        "grade": 4,
        "label": "Índice de términos",
        "match": "indice de terminos|indice del documento",
        "relation": "la correspondencia entre los términos solicitados, sus entradas en el índice y las ubicaciones donde aparecen",
        "pages": [
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce4-4-1",
          "technical-mf002-ra4-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "word-bibliography",
        "grade": 4,
        "label": "Fuentes y bibliografía",
        "match": "bibliografia|compila\\w*[^.;]*fuentes",
        "relation": "la correspondencia entre las fuentes proporcionadas y sus entradas bibliográficas, con los datos requeridos para identificarlas",
        "pages": [
          57,
          62,
          63
        ],
        "sourceRecordIds": [
          "technical-mf002-ce4-4-1",
          "technical-mf002-ra4-1",
          "technical-mf002-concept-2"
        ],
        "suppresses": [
          "document"
        ]
      },
      {
        "id": "spreadsheet-cells",
        "grade": 4,
        "label": "Datos y formato de celdas",
        "match": "celdas|hoja de calculo|hojas de calculo",
        "relation": "la correspondencia entre cada dato, su ubicación y su tipo o formato solicitado en la hoja de cálculo",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-1-1",
          "technical-mf002-ce5-3-1",
          "technical-mf002-procedure-053",
          "technical-mf002-procedure-054",
          "technical-mf002-procedure-055",
          "technical-mf002-procedure-056",
          "technical-mf002-procedure-057",
          "technical-mf002-procedure-058",
          "technical-mf002-procedure-059",
          "technical-mf002-procedure-060",
          "technical-mf002-procedure-061",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "requires": "hoja de calculo|libro de calculo",
        "relationsByMode": {
          "sequence": "la correspondencia entre cada dato dado y su ubicación en la hoja de cálculo",
          "application": "la correspondencia entre el tipo de dato y el formato solicitado para cada celda"
        }
      },
      {
        "id": "spreadsheet-formulas",
        "grade": 4,
        "label": "Fórmulas de cálculo",
        "match": "formula|formulas",
        "relation": "la relación entre las referencias de celdas, la operación solicitada y el resultado comprobado con los datos dados",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-3-1",
          "technical-mf002-procedure-063",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ],
        "requires": "hoja de calculo|libro de calculo"
      },
      {
        "id": "spreadsheet-functions",
        "grade": 4,
        "label": "Funciones de hoja de cálculo",
        "match": "funcion|funciones|promedio|busqueda y referencia",
        "relation": "la adecuación de la función solicitada y de sus argumentos al resultado buscado, sin sustituir datos ausentes por valores inventados",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-3-1",
          "technical-mf002-ce6-5-1",
          "technical-mf002-procedure-065",
          "technical-mf002-ra5-1",
          "technical-mf002-ra6-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ],
        "requires": "hoja de calculo|libro de calculo"
      },
      {
        "id": "spreadsheet-chart",
        "grade": 4,
        "label": "Gráficos de hoja de cálculo",
        "match": "grafico|graficos",
        "relation": "la correspondencia entre el rango de datos, el tipo de gráfico solicitado y las magnitudes representadas",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-5-1",
          "technical-mf002-procedure-064",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ],
        "requires": "hoja de calculo|libro de calculo"
      },
      {
        "id": "spreadsheet-template",
        "grade": 4,
        "label": "Plantillas de hoja de cálculo",
        "match": "plantilla de presupuesto|plantilla[^.;]*hoja de calculo",
        "relation": "la correspondencia entre los campos de la plantilla de cálculo y la información que debe registrarse según la ficha",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-4-1",
          "technical-mf002-procedure-078",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ]
      },
      {
        "id": "conditional-format",
        "grade": 4,
        "label": "Formato condicional",
        "match": "formato condicional",
        "relation": "la correspondencia entre la regla indicada, el rango al que se aplica y los valores señalados por el formato",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-3-1",
          "technical-mf002-procedure-056",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ]
      },
      {
        "id": "data-validation",
        "grade": 4,
        "label": "Validación de datos",
        "match": "validacion de datos|limites[^.;]*celdas",
        "relation": "la correspondencia entre la regla de validación solicitada y los valores que la celda debe aceptar o rechazar",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-3-1",
          "technical-mf002-procedure-058",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ]
      },
      {
        "id": "autofilter",
        "grade": 4,
        "label": "Autofiltro de datos",
        "match": "autofiltro|filtra\\w*[^.;]*lista|filtros? de datos",
        "relation": "la correspondencia entre el criterio solicitado y los registros que quedan visibles, conservando los datos originales",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-6-1",
          "technical-mf002-ce6-1-1",
          "technical-mf002-ce6-2-1",
          "technical-mf002-procedure-066",
          "technical-mf002-ra5-1",
          "technical-mf002-ra6-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ]
      },
      {
        "id": "advanced-filter",
        "grade": 4,
        "label": "Filtro avanzado",
        "match": "filtro avanzado|filtros avanzados|rango de criterios",
        "relation": "la correspondencia entre las condiciones del rango de criterios y los registros extraídos por el filtro avanzado",
        "pages": [
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce6-4-1",
          "technical-mf002-ra6-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ]
      },
      {
        "id": "external-data",
        "grade": 4,
        "label": "Datos externos de tabla",
        "match": "datos externos|importa\\w*[^.;]*tabla",
        "relation": "la correspondencia entre los campos de origen y las columnas importadas, sin perder o duplicar registros",
        "pages": [
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce6-3-1",
          "technical-mf002-ra6-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ]
      },
      {
        "id": "pivot-table",
        "grade": 4,
        "label": "Tablas y gráficos dinámicos",
        "match": "tabla dinamica|tablas dinamicas|grafico dinamico|graficos dinamicos",
        "relation": "la correspondencia entre los campos, las agrupaciones y los resúmenes solicitados a partir de los datos dados",
        "pages": [
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce6-6-1",
          "technical-mf002-procedure-080",
          "technical-mf002-ra6-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks",
          "spreadsheet-chart"
        ]
      },
      {
        "id": "spreadsheet-export",
        "grade": 4,
        "label": "Exportación de datos",
        "match": "exporta\\w*[^.;]*(?:datos|hoja de calculo)|datos[^.;]*aplicaciones",
        "relation": "la conservación de los campos y registros solicitados al transferir los datos de la hoja de cálculo al formato indicado",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-6-1",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ]
      },
      {
        "id": "spreadsheet-protection",
        "grade": 4,
        "label": "Protección de hoja y libro",
        "match": "proteger[^.;]*(?:hoja|libro)|proteccion[^.;]*(?:hoja|libro)|protege\\w*[^.;]*(?:hoja|libro)",
        "relation": "la correspondencia entre las restricciones solicitadas y los permisos previstos para la hoja o el libro del caso",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-2-1",
          "technical-mf002-ce5-6-1",
          "technical-mf002-procedure-075",
          "technical-mf002-procedure-076",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ]
      },
      {
        "id": "workbooks",
        "grade": 4,
        "label": "Organización de hojas y libros",
        "match": "libro de calculo|libros de calculo|hojas del libro",
        "relation": "la correspondencia entre las hojas, sus nombres y las operaciones solicitadas dentro del libro de práctica, conservando los datos indicados",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-3-1",
          "technical-mf002-ce5-7-1",
          "technical-mf002-procedure-062",
          "technical-mf002-procedure-067",
          "technical-mf002-procedure-068",
          "technical-mf002-procedure-069",
          "technical-mf002-procedure-070",
          "technical-mf002-procedure-071",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells"
        ],
        "relationsByMode": {
          "creation": "la correspondencia entre las hojas creadas y la estructura solicitada para el libro",
          "sequence": "la correspondencia entre la posición, el nombre y la finalidad indicada para cada hoja del libro"
        }
      },
      {
        "id": "spreadsheet-comments",
        "grade": 4,
        "label": "Revisión de libros compartidos",
        "match": "comentarios|cambios del libro|libro compartido",
        "relation": "la pertinencia de los comentarios o revisiones solicitados y la conservación de las modificaciones autorizadas en el libro",
        "pages": [
          57,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-2-1",
          "technical-mf002-procedure-073",
          "technical-mf002-procedure-074",
          "technical-mf002-procedure-077",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ],
        "requires": "calculo|hoja|libro"
      },
      {
        "id": "macros",
        "grade": 4,
        "label": "Macros de hoja de cálculo",
        "match": "macro|macros",
        "relation": "la relación entre la secuencia descrita por la macro y la tarea que automatiza en la hoja de cálculo del caso",
        "pages": [
          57,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-1-1",
          "technical-mf002-procedure-072",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ]
      },
      {
        "id": "spreadsheet-print",
        "grade": 4,
        "label": "Vista previa de hoja de cálculo",
        "match": "vista previa de impresion|impresion de la hoja",
        "relation": "la correspondencia entre el rango, la distribución y la información visible en la vista previa solicitada",
        "pages": [
          57,
          58,
          64,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-3-1",
          "technical-mf002-procedure-079",
          "technical-mf002-ra5-1",
          "technical-mf002-concept-3"
        ],
        "suppresses": [
          "spreadsheet-cells",
          "workbooks"
        ],
        "requires": "hoja de calculo|libro de calculo"
      },
      {
        "id": "slides",
        "grade": 4,
        "label": "Presentación de diapositivas",
        "match": "diapositivas|presentacion",
        "relation": "la fidelidad a la información proporcionada y su distribución comprensible en las diapositivas solicitadas",
        "pages": [
          58,
          59,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce7-1-1",
          "technical-mf002-ce7-4-1",
          "technical-mf002-ce7-5-1",
          "technical-mf002-procedure-081",
          "technical-mf002-procedure-082",
          "technical-mf002-procedure-084",
          "technical-mf002-ra7-1",
          "technical-mf002-concept-4"
        ]
      },
      {
        "id": "slide-format",
        "grade": 4,
        "label": "Formato de diapositivas",
        "match": "patron|fondo|distribucion del texto|formato de diapositivas",
        "relation": "la correspondencia entre el formato solicitado y la lectura del contenido de las diapositivas, sin imponer preferencias decorativas",
        "pages": [
          58,
          59,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce7-5-1",
          "technical-mf002-procedure-083",
          "technical-mf002-procedure-086",
          "technical-mf002-procedure-087",
          "technical-mf002-ra7-1",
          "technical-mf002-concept-4"
        ],
        "suppresses": [
          "slides"
        ],
        "requires": "diapositivas|presentacion"
      },
      {
        "id": "slide-graphics",
        "grade": 4,
        "label": "Gráficos y diagramas de diapositivas",
        "match": "grafico|diagrama|organigrama|formas",
        "relation": "la representación de los datos o relaciones proporcionados mediante los gráficos y objetos solicitados en las diapositivas",
        "pages": [
          58,
          59,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce7-5-1",
          "technical-mf002-ce7-8-1",
          "technical-mf002-procedure-085",
          "technical-mf002-procedure-089",
          "technical-mf002-procedure-090",
          "technical-mf002-procedure-091",
          "technical-mf002-ra7-1",
          "technical-mf002-concept-4"
        ],
        "suppresses": [
          "slides"
        ],
        "requires": "diapositivas|presentacion"
      },
      {
        "id": "slide-media",
        "grade": 4,
        "label": "Sonido y vídeo de diapositivas",
        "match": "sonido|videoclip|multimedia",
        "relation": "la correspondencia entre los recursos multimedia proporcionados, su ubicación y su reproducción según la ficha",
        "pages": [
          58,
          59,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce7-8-1",
          "technical-mf002-procedure-093",
          "technical-mf002-ra7-1",
          "technical-mf002-concept-4"
        ],
        "suppresses": [
          "slides"
        ],
        "requires": "diapositivas|presentacion"
      },
      {
        "id": "slide-animation",
        "grade": 4,
        "label": "Animaciones y transiciones",
        "match": "animaciones|transiciones|animacion",
        "relation": "la correspondencia entre los efectos solicitados, los objetos o diapositivas afectados y el orden previsto",
        "pages": [
          58,
          59,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce7-7-1",
          "technical-mf002-ce7-9-1",
          "technical-mf002-ce7-10-1",
          "technical-mf002-procedure-092",
          "technical-mf002-ra7-1",
          "technical-mf002-concept-4"
        ],
        "suppresses": [
          "slides"
        ],
        "requires": "diapositivas|presentacion"
      },
      {
        "id": "slide-timing",
        "grade": 4,
        "label": "Tiempos de diapositivas",
        "match": "duracion|orden de aparicion|temporaliza\\w*",
        "relation": "la correspondencia entre los tiempos indicados y la aparición de los elementos o diapositivas solicitados",
        "pages": [
          58,
          59,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce7-7-1",
          "technical-mf002-ra7-1",
          "technical-mf002-concept-4"
        ],
        "suppresses": [
          "slides"
        ],
        "requires": "diapositivas|presentacion"
      },
      {
        "id": "slide-notes",
        "grade": 4,
        "label": "Notas y comentarios de diapositivas",
        "match": "notas del orador|comentarios",
        "relation": "la relación entre las notas o comentarios preparados y la información de la diapositiva a la que se refieren",
        "pages": [
          58,
          59,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce7-9-1",
          "technical-mf002-ra7-1",
          "technical-mf002-concept-4"
        ],
        "suppresses": [
          "slides"
        ],
        "requires": "diapositivas|presentacion"
      },
      {
        "id": "slide-config",
        "grade": 4,
        "label": "Configuración y exportación de presentaciones",
        "match": "presentacion personalizada|export\\w*[^.;]*video|configura\\w*[^.;]*presentaciones",
        "relation": "la correspondencia entre la secuencia o exportación preparada y las opciones indicadas para utilizar la presentación",
        "pages": [
          58,
          59,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce7-10-1",
          "technical-mf002-procedure-088",
          "technical-mf002-ra7-1",
          "technical-mf002-concept-4"
        ],
        "suppresses": [
          "slides"
        ],
        "relationsByMode": {
          "configuration": "la correspondencia entre las diapositivas seleccionadas, su secuencia y las opciones de presentación indicadas"
        }
      },
      {
        "id": "slide-review",
        "grade": 4,
        "label": "Revisión de presentaciones",
        "match": "(?:comprueb\\w*|corrig\\w*)[^.;]*(?:presentacion|diapositivas)",
        "relation": "la identificación y corrección de los errores del archivo, conservando la información y el formato de entrega indicados",
        "pages": [
          58,
          59,
          65
        ],
        "sourceRecordIds": [
          "technical-mf002-ce7-2-1",
          "technical-mf002-ce7-3-1",
          "technical-mf002-ce7-7-1",
          "technical-mf002-ra7-1",
          "technical-mf002-concept-4"
        ],
        "suppresses": [
          "slides"
        ],
        "relationsByMode": {
          "verification": "la identificación de los errores del archivo respecto de la información y las condiciones de la ficha",
          "correction": "la fidelidad de la información y del formato de entrega al subsanar los errores indicados"
        }
      },
      {
        "id": "browser-search",
        "grade": 4,
        "label": "Navegadores y buscadores",
        "match": "navegador|buscador|metabuscador",
        "relation": "la distinción entre acceder a páginas y localizar información mediante motores de búsqueda, según las funciones de la ficha",
        "pages": [
          59,
          60,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce8-1-1",
          "technical-mf002-ce8-3-1",
          "technical-mf002-procedure-094",
          "technical-mf002-procedure-095",
          "technical-mf002-ra8-1",
          "technical-mf002-concept-5"
        ]
      },
      {
        "id": "web-search",
        "grade": 4,
        "label": "Búsqueda y selección de información",
        "match": "fuentes web|busca\\w*[^.;]*informacion|busquedas[^.;]*internet",
        "relation": "la correspondencia entre la información requerida, las restricciones de búsqueda y las fuentes seleccionadas",
        "pages": [
          59,
          60,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce8-6-1",
          "technical-mf002-ra8-1",
          "technical-mf002-concept-5"
        ]
      },
      {
        "id": "files-folders",
        "grade": 4,
        "label": "Archivos y carpetas",
        "match": "archivos y carpetas|carpetas|accesos directos",
        "relation": "la correspondencia entre los nombres, ubicaciones y accesos solicitados para localizar los archivos ficticios",
        "pages": [
          59,
          60,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce8-5-1",
          "technical-mf002-ra8-1",
          "technical-mf002-concept-5"
        ]
      },
      {
        "id": "files-safety",
        "grade": 4,
        "label": "Conservación de archivos",
        "match": "(?:copia\\w*|copiar|mover|mueve\\w*)[^.;]*archivos|integridad[^.;]*archivos",
        "relation": "la conservación del contenido y la ubicación prevista al realizar las operaciones solicitadas con archivos del caso",
        "pages": [
          57,
          58,
          59,
          60,
          64,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce5-7-1",
          "technical-mf002-ce8-6-1",
          "technical-mf002-ra5-1",
          "technical-mf002-ra8-1",
          "technical-mf002-concept-3",
          "technical-mf002-concept-5"
        ]
      },
      {
        "id": "copyright",
        "grade": 4,
        "label": "Autoría y licencias",
        "match": "autoria|licencias|derechos de autor",
        "relation": "las condiciones de uso y atribución aplicables a las fuentes digitales proporcionadas",
        "pages": [
          59,
          60,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce8-4-1",
          "technical-mf002-ce8-6-1",
          "technical-mf002-ra8-1",
          "technical-mf002-concept-5"
        ]
      },
      {
        "id": "bookmarks",
        "grade": 4,
        "label": "Favoritos e historial",
        "match": "favoritos|historial del navegador",
        "relation": "la correspondencia entre las referencias guardadas y las fuentes que permiten recuperar",
        "pages": [
          59,
          60,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce8-6-1",
          "technical-mf002-ra8-1",
          "technical-mf002-concept-5"
        ],
        "suppresses": [
          "browser-search"
        ]
      },
      {
        "id": "browser-security",
        "grade": 4,
        "label": "Seguridad del navegador",
        "match": "seguridad del navegador|riesgos[^.;]*navegador",
        "relation": "la relación entre los riesgos descritos y las medidas o niveles de protección del navegador del caso",
        "pages": [
          59,
          60,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce8-2-1",
          "technical-mf002-procedure-096",
          "technical-mf002-ra8-1",
          "technical-mf002-concept-5"
        ],
        "suppresses": [
          "browser-search"
        ]
      },
      {
        "id": "email-draft",
        "grade": 4,
        "label": "Mensaje de correo preparado",
        "match": "correo simulado|redacta\\w*[^.;]*correo|mensaje de correo|archivo adjunto",
        "relation": "la correspondencia entre destinatario, asunto, mensaje y adjuntos expresamente solicitados en el correo preparado",
        "pages": [
          60,
          61,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce9-1-1",
          "technical-mf002-ce9-4-1",
          "technical-mf002-procedure-097",
          "technical-mf002-ra9-1",
          "technical-mf002-concept-5"
        ]
      },
      {
        "id": "email-agenda",
        "grade": 4,
        "label": "Contactos y agenda electrónica",
        "match": "contactos ficticios|agenda electronica|libreta de contactos",
        "relation": "la correspondencia entre los datos ficticios proporcionados y las entradas, fechas o avisos solicitados en la agenda",
        "pages": [
          60,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce9-1-1",
          "technical-mf002-ce9-3-1",
          "technical-mf002-ra9-1",
          "technical-mf002-concept-5"
        ]
      },
      {
        "id": "email-archive",
        "grade": 4,
        "label": "Clasificación de correo",
        "match": "archiva\\w*[^.;]*correo|clasifica\\w*[^.;]*correo|mensajes de correo simulados",
        "relation": "la correspondencia entre los mensajes y las reglas de clasificación, registro o archivo indicadas",
        "pages": [
          60,
          61,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce9-5-1",
          "technical-mf002-ra9-1",
          "technical-mf002-concept-5"
        ],
        "relationsByMode": {
          "classification": "la correspondencia entre el contenido de cada mensaje y la categoría indicada por las reglas",
          "application": "la ubicación de los mensajes en las carpetas o registros indicados, conservando su contenido"
        }
      },
      {
        "id": "email-security",
        "grade": 4,
        "label": "Seguridad del correo",
        "match": "seguridad[^.;]*correo|proteccion de datos[^.;]*correo",
        "relation": "la relación entre los riesgos del correo del caso y las medidas que preservan los datos de sus participantes",
        "pages": [
          60,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce9-2-1",
          "technical-mf002-ra9-1",
          "technical-mf002-concept-5"
        ]
      },
      {
        "id": "ftp",
        "grade": 4,
        "label": "Transferencia de ficheros FTP",
        "match": "ftp|transferencia de ficheros",
        "relation": "la correspondencia entre origen, destino y ficheros indicados en el procedimiento de transferencia descrito",
        "pages": [
          59,
          60,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce8-6-1",
          "technical-mf002-procedure-098",
          "technical-mf002-ra8-1",
          "technical-mf002-concept-5"
        ]
      },
      {
        "id": "software-help",
        "grade": 4,
        "label": "Consulta de ayuda ofimática",
        "match": "manual de ayuda|ayuda de la aplicacion|incidencia descrita",
        "relation": "la correspondencia entre la incidencia descrita, la información localizada en la ayuda y la solución propuesta",
        "pages": [
          55,
          57,
          58,
          59,
          60,
          61,
          62,
          63,
          64,
          65,
          66
        ],
        "sourceRecordIds": [
          "technical-mf002-ce2-2-1",
          "technical-mf002-ce5-8-1",
          "technical-mf002-ce7-6-1",
          "technical-mf002-ce9-6-1",
          "technical-mf002-ra2-1",
          "technical-mf002-ra5-1",
          "technical-mf002-ra7-1",
          "technical-mf002-ra9-1",
          "technical-mf002-concept-2",
          "technical-mf002-concept-3",
          "technical-mf002-concept-4",
          "technical-mf002-concept-5"
        ]
      }
    ]
  },
  {
    "id": "mf054-5",
    "programCode": "IFC006_3",
    "moduleCode": "MF_054_3",
    "grade": 5,
    "cycle": 2,
    "modalityCode": "technical_professional",
    "subjectName": "Desarrollo de Aplicaciones y Sistemas de Información",
    "sourceScopeId": "ifc006-mf054-5",
    "pdfPages": [
      19,
      20,
      21,
      22
    ],
    "policy": "REQUESTED_DEVELOPMENT_ACTIONS_FICTITIOUS_DATA_NO_IMPLICIT_DEPLOYMENT_V1",
    "templatePrefix": "technical-mf054",
    "additionalVerbs": "(?:desarroll(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|codific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|codifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|construy(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|constru(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|cre(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|prepar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|implement(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|ejecut(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|revis(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|organiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|organic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|clasific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|clasifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|seleccion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|aplic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|apliqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|utiliz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|utilic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|identific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|identifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|compar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|contrast(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|justific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|justifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|disen(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|registr(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|valid(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|prob(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|analiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|describ(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|explic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|comprueb(?:a|an|e|en)|disting(?:ue|uen|uir|a|an)|recon(?:oce|ocen|ocer|ozca|ozcan)|elige|elegir)(?:lo|la|los|las)?",
    "topics": [
      {
        "id": "language-identification",
        "grade": 5,
        "label": "Lenguajes de programación",
        "match": "lenguajes? de programacion",
        "relation": "los lenguajes presentes y sus características según la documentación de la ficha",
        "pages": [
          19,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.1.1",
          "ifc006-mf054-p-languages-identification",
          "ifc006-mf054-p-languages-comparison",
          "ifc006-mf054-c-languages",
          "ifc006-mf054-RA2.1"
        ]
      },
      {
        "id": "language-selection",
        "grade": 5,
        "label": "Selección del lenguaje",
        "match": "lenguajes? de programacion",
        "relation": "la correspondencia entre el lenguaje elegido y los requisitos del sistema del caso",
        "pages": [
          19,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.1.2",
          "ifc006-mf054-c-languages",
          "ifc006-mf054-RA2.1"
        ],
        "requires": "seleccion|elige|elegir|escog",
        "suppresses": [
          "language-identification"
        ]
      },
      {
        "id": "language-license",
        "grade": 5,
        "label": "Licenciamiento del lenguaje",
        "match": "licenciamiento|licencias?",
        "relation": "la correspondencia entre las condiciones de licencia documentadas y el uso previsto del lenguaje del caso",
        "pages": [
          19
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.1.1",
          "ifc006-mf054-RA2.1"
        ],
        "requires": "lenguajes? de programacion",
        "suppresses": [
          "language-identification",
          "language-selection"
        ]
      },
      {
        "id": "database-engine",
        "grade": 5,
        "label": "Motor de base de datos",
        "match": "motor(?:es)? de bases? de datos",
        "relation": "la correspondencia entre el motor elegido y los requisitos de almacenamiento y uso dados",
        "pages": [
          19
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.1.3",
          "ifc006-mf054-RA2.1"
        ]
      },
      {
        "id": "database-license",
        "grade": 5,
        "label": "Licenciamiento del motor",
        "match": "licenciamiento|licencias?",
        "relation": "la correspondencia entre las condiciones de licencia documentadas para los motores y el uso previsto en el caso",
        "pages": [
          19
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.1.3",
          "ifc006-mf054-RA2.1"
        ],
        "requires": "motor(?:es)? de bases? de datos",
        "suppresses": [
          "database-engine"
        ]
      },
      {
        "id": "system-tools",
        "grade": 5,
        "label": "Herramienta de sistema",
        "match": "herramientas? de sistemas?",
        "relation": "la correspondencia entre las funciones de la herramienta y los requisitos de la plataforma de práctica indicada",
        "pages": [
          19
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.1.4",
          "ifc006-mf054-RA2.1"
        ]
      },
      {
        "id": "desktop-app",
        "grade": 5,
        "label": "Aplicación de escritorio",
        "match": "aplicacion(?:es)? de escritorio",
        "relation": "la correspondencia entre las funciones desarrolladas y los requisitos de la aplicación de escritorio del caso",
        "pages": [
          19
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.1.4",
          "ifc006-mf054-RA2.1"
        ]
      },
      {
        "id": "web-app",
        "grade": 5,
        "label": "Aplicación web",
        "match": "aplicacion(?:es)? web|aplicacion(?:es)? para la web",
        "relation": "la correspondencia entre las funciones de la aplicación web de práctica y el diseño proporcionado",
        "pages": [
          19
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.1.4",
          "ifc006-mf054-RA2.1"
        ]
      },
      {
        "id": "input-devices",
        "grade": 5,
        "label": "Dispositivos de entrada",
        "match": "dispositivos? de entrada",
        "relation": "la relación entre las características de los dispositivos de entrada y la captura de información solicitada",
        "pages": [
          20
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-devices-comparison",
          "ifc006-mf054-p-devices",
          "ifc006-mf054-c-system-design"
        ]
      },
      {
        "id": "output-devices",
        "grade": 5,
        "label": "Dispositivos de salida",
        "match": "dispositivos? de salida",
        "relation": "la relación entre las características de los dispositivos de salida y la información que debe presentarse",
        "pages": [
          20
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-devices",
          "ifc006-mf054-c-system-design"
        ]
      },
      {
        "id": "input-data",
        "grade": 5,
        "label": "Datos de entrada",
        "match": "datos de entrada",
        "relation": "la correspondencia entre los datos identificados y la información necesaria para el proceso descrito",
        "pages": [
          20
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-input-identification",
          "ifc006-mf054-c-system-design",
          "ifc006-mf054-CE2.2.2",
          "ifc006-mf054-RA2.2"
        ]
      },
      {
        "id": "input-method",
        "grade": 5,
        "label": "Método de entrada",
        "match": "metodos? de entrada",
        "relation": "la correspondencia entre el método de captura y los datos y condiciones del sistema del caso",
        "pages": [
          20
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-input-design",
          "ifc006-mf054-p-input-identification",
          "ifc006-mf054-c-system-design",
          "ifc006-mf054-CE2.2.2",
          "ifc006-mf054-RA2.2"
        ]
      },
      {
        "id": "input-format",
        "grade": 5,
        "label": "Formato de entrada",
        "match": "formatos? de entrada",
        "relation": "la correspondencia entre los campos, tipos y restricciones del formato y las reglas proporcionadas",
        "pages": [
          20
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-input-design",
          "ifc006-mf054-p-input-identification",
          "ifc006-mf054-c-system-design",
          "ifc006-mf054-CE2.2.2",
          "ifc006-mf054-RA2.2"
        ]
      },
      {
        "id": "output-screen",
        "grade": 5,
        "label": "Salidas del sistema",
        "match": "salidas? en pantalla|salidas? del sistema",
        "exclude": "dispositivos? de salida|validacion de (?:las )?(?:entradas y )?salidas?",
        "relation": "la correspondencia entre la información de salida y el contenido, organización y formato previstos en el diseño",
        "pages": [
          19,
          20,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.1",
          "ifc006-mf054-p-outputs-development",
          "ifc006-mf054-p-outputs-design",
          "ifc006-mf054-p-outputs-analysis",
          "ifc006-mf054-RA2.2"
        ]
      },
      {
        "id": "output-report",
        "grade": 5,
        "label": "Reportes de salida",
        "match": "reportes? de salida|reportes? del sistema",
        "relation": "la correspondencia entre los reportes solicitados, sus datos y las necesidades de información del caso",
        "pages": [
          20,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-output-reports",
          "ifc006-mf054-p-reports",
          "ifc006-mf054-c-system-design"
        ],
        "suppresses": [
          "output-screen"
        ]
      },
      {
        "id": "records",
        "grade": 5,
        "label": "Registros del sistema",
        "match": "registros?",
        "relation": "la correspondencia entre los campos de cada registro, sus tipos y la información que debe conservarse",
        "pages": [
          20
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-records-identification",
          "ifc006-mf054-p-records-design",
          "ifc006-mf054-c-system-design"
        ],
        "exclude": "registros? de acceso"
      },
      {
        "id": "process-types",
        "grade": 5,
        "label": "Tipos de procesos",
        "match": "tipos de procesos",
        "relation": "la distinción de los procesos de la ficha según su función y las transformaciones de información requeridas",
        "pages": [
          20
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-process-types",
          "ifc006-mf054-c-system-design"
        ],
        "suppresses": [
          "process-design"
        ]
      },
      {
        "id": "process-design",
        "grade": 5,
        "label": "Procesos del sistema",
        "match": "procesos? del sistema",
        "relation": "la correspondencia entre las entradas, transformaciones y salidas previstas para el proceso del caso",
        "pages": [
          20,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-process-design",
          "ifc006-mf054-p-input-development",
          "ifc006-mf054-c-system-design"
        ]
      },
      {
        "id": "database-structure",
        "grade": 5,
        "label": "Estructura básica de base de datos",
        "match": "estructura[^.;]*bases? de datos",
        "relation": "la correspondencia entre las estructuras de datos, sus relaciones y los requisitos proporcionados",
        "pages": [
          19,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.4",
          "ifc006-mf054-p-database-structure",
          "ifc006-mf054-p-database-design",
          "ifc006-mf054-RA2.2"
        ]
      },
      {
        "id": "validation",
        "grade": 5,
        "label": "Validación de entradas, salidas y procesos",
        "match": "validacion",
        "relation": "la correspondencia entre las reglas dadas y los controles que distinguen datos o resultados válidos e inválidos",
        "pages": [
          20,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-validation",
          "ifc006-mf054-c-system-design"
        ]
      },
      {
        "id": "queries",
        "grade": 5,
        "label": "Consultas del sistema",
        "match": "consultas?",
        "relation": "la correspondencia entre los datos consultados, las condiciones dadas y el resultado solicitado",
        "pages": [
          20,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-queries",
          "ifc006-mf054-c-system-design"
        ]
      },
      {
        "id": "structured-program",
        "grade": 5,
        "label": "Programa estructurado",
        "match": "programas?[^.;]*estructurad[oa]s?|programacion estructurada",
        "relation": "la correspondencia entre la secuencia de instrucciones, las estructuras solicitadas y el resultado del caso",
        "pages": [
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-structured"
        ]
      },
      {
        "id": "modular-program",
        "grade": 5,
        "label": "Programa modular",
        "match": "programas?[^.;]*modular|programacion modular",
        "relation": "la distribución de responsabilidades entre módulos y la correspondencia de sus entradas y salidas con el diseño",
        "pages": [
          21,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-modular",
          "ifc006-mf054-c-modularity"
        ]
      },
      {
        "id": "object-program",
        "grade": 5,
        "label": "Programa orientado a objetos",
        "match": "orientad[^.;]*objetos?",
        "relation": "la correspondencia entre clases, responsabilidades e interacciones y el diseño proporcionado",
        "pages": [
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-objects"
        ]
      },
      {
        "id": "functions",
        "grade": 5,
        "label": "Funciones del programa",
        "match": "funciones?",
        "relation": "la correspondencia entre los parámetros, operaciones y resultados de las funciones solicitadas",
        "pages": [
          21,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-c-modularity",
          "ifc006-mf054-p-modular"
        ]
      },
      {
        "id": "methods",
        "grade": 5,
        "label": "Métodos de las clases",
        "match": "metodos?",
        "relation": "la correspondencia entre el comportamiento de los métodos y las responsabilidades previstas para sus clases",
        "pages": [
          21,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-c-modularity",
          "ifc006-mf054-p-objects"
        ],
        "requires": "clases|objetos|programa",
        "exclude": "metodos? de entrada"
      },
      {
        "id": "interfaces",
        "grade": 5,
        "label": "Interfaces entre módulos",
        "match": "interfaces?",
        "relation": "la correspondencia entre los contratos de intercambio, sus datos y los módulos que deben comunicarse",
        "pages": [
          21,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-c-modularity",
          "ifc006-mf054-p-modular"
        ]
      },
      {
        "id": "conditions",
        "grade": 5,
        "label": "Condiciones del programa",
        "match": "condiciones",
        "relation": "la correspondencia entre las condiciones lógicas, las ramas ejecutadas y las reglas del caso",
        "pages": [
          21,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-c-modularity",
          "ifc006-mf054-p-structured"
        ]
      },
      {
        "id": "iterations",
        "grade": 5,
        "label": "Iteraciones del programa",
        "match": "iteraciones|bucles",
        "relation": "la correspondencia entre la repetición, su terminación y el procesamiento de los datos dados",
        "pages": [
          21,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-c-modularity",
          "ifc006-mf054-p-structured"
        ]
      },
      {
        "id": "recursion",
        "grade": 5,
        "label": "Recursividad",
        "match": "recursividad|recursiv[^ ]*",
        "relation": "la relación entre el caso base, las llamadas recursivas y la resolución del problema de práctica",
        "pages": [
          21,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-c-modularity"
        ]
      },
      {
        "id": "peripheral-communication",
        "grade": 5,
        "label": "Comunicación con periféricos",
        "match": "comunicacion[^.;]*perifericos?",
        "relation": "la relación entre las operaciones del programa y el intercambio con el periférico descrito",
        "pages": [
          21,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-c-modularity"
        ]
      },
      {
        "id": "design-patterns",
        "grade": 5,
        "label": "Patrón de diseño",
        "match": "patron(?:es)? de diseno",
        "relation": "la correspondencia entre las responsabilidades del patrón indicado y las necesidades del programa de práctica",
        "pages": [
          19,
          20,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.3.4",
          "ifc006-mf054-p-patterns",
          "ifc006-mf054-RA2.3"
        ]
      },
      {
        "id": "development-practices",
        "grade": 5,
        "label": "Buenas prácticas de desarrollo",
        "match": "buenas practicas|mejores practicas",
        "relation": "la correspondencia entre el código revisado y las prácticas de desarrollo expresamente indicadas",
        "pages": [
          19,
          20,
          21
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.3.4",
          "ifc006-mf054-p-practices",
          "ifc006-mf054-RA2.3"
        ]
      },
      {
        "id": "access-policy",
        "grade": 5,
        "label": "Criterios de acceso",
        "match": "criterios? de acceso",
        "relation": "la correspondencia entre los módulos, los usuarios ficticios y las reglas de acceso proporcionadas",
        "pages": [
          19,
          20,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.3.1",
          "ifc006-mf054-c-access-exceptions",
          "ifc006-mf054-RA2.3"
        ]
      },
      {
        "id": "access-database",
        "grade": 5,
        "label": "Acceso a la estructura de datos",
        "match": "estructura[^.;]*bases? de datos",
        "relation": "la correspondencia entre las reglas de acceso dadas y las restricciones implementadas en la estructura de datos",
        "pages": [
          19,
          20
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.3.2",
          "ifc006-mf054-RA2.3"
        ],
        "requires": "criterios? de acceso|permisos",
        "suppresses": [
          "database-structure",
          "access-policy"
        ]
      },
      {
        "id": "access-code",
        "grade": 5,
        "label": "Control de acceso codificado",
        "match": "controles? de acceso|criterios? de acceso",
        "relation": "la correspondencia entre las comprobaciones del código y los accesos permitidos o denegados por la política del caso",
        "pages": [
          19,
          20,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.3.3",
          "ifc006-mf054-p-access-control",
          "ifc006-mf054-RA2.3"
        ],
        "requires": "codific|codigo|sentencias|controles? de acceso",
        "suppresses": [
          "access-policy"
        ]
      },
      {
        "id": "access-levels",
        "grade": 5,
        "label": "Niveles de acceso",
        "match": "niveles? de acceso",
        "relation": "la correspondencia entre cada nivel y los permisos previstos para los usuarios ficticios del caso",
        "pages": [
          19,
          20,
          21,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.3.1",
          "ifc006-mf054-c-modularity",
          "ifc006-mf054-RA2.3"
        ]
      },
      {
        "id": "access-log",
        "grade": 5,
        "label": "Registro de acceso",
        "match": "registros? de acceso",
        "relation": "la correspondencia entre las entradas del registro, los intentos de acceso ficticios y sus resultados",
        "pages": [
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-access-records",
          "ifc006-mf054-c-access-exceptions"
        ],
        "suppresses": [
          "records"
        ]
      },
      {
        "id": "credentials",
        "grade": 5,
        "label": "Credenciales de práctica",
        "match": "credenciales",
        "relation": "la correspondencia entre las credenciales ficticias preparadas y las reglas de identificación y acceso dadas",
        "pages": [
          19,
          20,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-credentials",
          "ifc006-mf054-CE2.3.1",
          "ifc006-mf054-RA2.3"
        ]
      },
      {
        "id": "backup",
        "grade": 5,
        "label": "Respaldo de datos de práctica",
        "match": "respaldo|copias? de seguridad",
        "relation": "la conservación de los datos ficticios previstos en la copia y el procedimiento de respaldo indicado",
        "pages": [
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-p-backup",
          "ifc006-mf054-c-access-exceptions"
        ]
      },
      {
        "id": "exception-identification",
        "grade": 5,
        "label": "Identificación de excepciones",
        "match": "excepciones",
        "relation": "la relación entre las excepciones identificadas y las entradas, estados o salidas del programa de práctica",
        "pages": [
          20,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.4.1",
          "ifc006-mf054-p-exceptions",
          "ifc006-mf054-RA2.4"
        ]
      },
      {
        "id": "exception-classification",
        "grade": 5,
        "label": "Organización de excepciones",
        "match": "excepciones",
        "relation": "la correspondencia entre cada excepción observada, su módulo y la clasificación solicitada",
        "pages": [
          20,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.4.1",
          "ifc006-mf054-p-exceptions",
          "ifc006-mf054-RA2.4"
        ],
        "requires": "organiz|clasific",
        "suppresses": [
          "exception-identification"
        ]
      },
      {
        "id": "exception-database",
        "grade": 5,
        "label": "Excepciones en la estructura de datos",
        "match": "estructura[^.;]*bases? de datos",
        "relation": "la correspondencia entre las situaciones de error dadas y el manejo de excepciones implementado en la estructura de datos",
        "pages": [
          20
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.4.2",
          "ifc006-mf054-RA2.4"
        ],
        "requires": "excepciones",
        "suppresses": [
          "database-structure",
          "exception-identification",
          "exception-code"
        ]
      },
      {
        "id": "exception-code",
        "grade": 5,
        "label": "Manejo de excepciones codificado",
        "match": "excepciones",
        "relation": "la correspondencia entre los casos de error dados, su detección y la respuesta prevista por el código de práctica",
        "pages": [
          20,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.4.3",
          "ifc006-mf054-p-exceptions",
          "ifc006-mf054-RA2.4"
        ],
        "requires": "codigo|codific|sentencias|manejo",
        "suppresses": [
          "exception-identification"
        ]
      },
      {
        "id": "menu-dropdown",
        "grade": 5,
        "label": "Menú desplegable",
        "match": "menu[^.;]*desplegable",
        "relation": "la correspondencia entre las opciones y el comportamiento del menú desplegable y el diseño solicitado",
        "pages": [
          19,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.3",
          "ifc006-mf054-p-menus",
          "ifc006-mf054-RA2.2"
        ],
        "suppresses": [
          "menu-general"
        ]
      },
      {
        "id": "menu-cascade",
        "grade": 5,
        "label": "Menú en cascada",
        "match": "menu[^.;]*en cascada",
        "relation": "la correspondencia entre las opciones y el comportamiento del menú en cascada y el diseño solicitado",
        "pages": [
          19,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.3",
          "ifc006-mf054-p-menus",
          "ifc006-mf054-RA2.2"
        ],
        "suppresses": [
          "menu-general"
        ]
      },
      {
        "id": "menu-checkbox",
        "grade": 5,
        "label": "Menú con botones de chequeo",
        "match": "menu[^.;]*(?:con )?botones de chequeo",
        "relation": "la correspondencia entre las opciones y el comportamiento del menú con botones de chequeo y el diseño solicitado",
        "pages": [
          19,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.3",
          "ifc006-mf054-p-menus",
          "ifc006-mf054-RA2.2"
        ],
        "suppresses": [
          "menu-general"
        ]
      },
      {
        "id": "menu-floating",
        "grade": 5,
        "label": "Menú flotante",
        "match": "menu[^.;]*flotante",
        "relation": "la correspondencia entre las opciones y el comportamiento del menú flotante y el diseño solicitado",
        "pages": [
          19,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.3",
          "ifc006-mf054-p-menus",
          "ifc006-mf054-RA2.2"
        ],
        "suppresses": [
          "menu-general"
        ]
      },
      {
        "id": "menu-navigation",
        "grade": 5,
        "label": "Menú de navegación",
        "match": "menu[^.;]*de navegacion",
        "relation": "la correspondencia entre las opciones y el comportamiento del menú de navegación y el diseño solicitado",
        "pages": [
          19,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.3",
          "ifc006-mf054-p-menus",
          "ifc006-mf054-RA2.2"
        ],
        "suppresses": [
          "menu-general"
        ]
      },
      {
        "id": "menu-context",
        "grade": 5,
        "label": "Menú contextual",
        "match": "menu[^.;]*contextual",
        "relation": "la correspondencia entre las opciones y el comportamiento del menú contextual y el diseño solicitado",
        "pages": [
          19,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.3",
          "ifc006-mf054-p-menus",
          "ifc006-mf054-RA2.2"
        ],
        "suppresses": [
          "menu-general"
        ]
      },
      {
        "id": "menu-popup",
        "grade": 5,
        "label": "Menú emergente",
        "match": "menu[^.;]*emergente",
        "relation": "la correspondencia entre las opciones y el comportamiento del menú emergente y el diseño solicitado",
        "pages": [
          19,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.3",
          "ifc006-mf054-p-menus",
          "ifc006-mf054-RA2.2"
        ],
        "suppresses": [
          "menu-general"
        ]
      },
      {
        "id": "menu-action-bar",
        "grade": 5,
        "label": "Menú de opciones y barra de acción",
        "match": "menu[^.;]*de opciones y barra de accion|barra de accion",
        "relation": "la correspondencia entre las opciones y el comportamiento del menú de opciones y barra de acción y el diseño solicitado",
        "pages": [
          19,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.3",
          "ifc006-mf054-p-menus",
          "ifc006-mf054-RA2.2"
        ],
        "suppresses": [
          "menu-general"
        ]
      },
      {
        "id": "menu-general",
        "grade": 5,
        "label": "Menú del programa",
        "match": "menus?",
        "relation": "la correspondencia entre las opciones, la navegación y las acciones previstas en el menú del diseño dado",
        "pages": [
          19,
          22
        ],
        "sourceRecordIds": [
          "ifc006-mf054-CE2.2.3",
          "ifc006-mf054-p-menus",
          "ifc006-mf054-RA2.2"
        ]
      },
      {
        "id": "program-structure",
        "grade": 5,
        "label": "Estructura general de la aplicación",
        "match": "estructura general[^.;]*aplicacion",
        "relation": "la correspondencia entre los componentes de la aplicación y las responsabilidades, entradas y salidas del diseño proporcionado",
        "pages": [
          19
        ],
        "sourceRecordIds": [
          "ifc006-mf054-RA2.2"
        ]
      }
    ]
  },
  {
    "id": "mf056-4",
    "programCode": "IFC006_3",
    "moduleCode": "MF_056_3",
    "grade": 4,
    "cycle": 2,
    "modalityCode": "technical_professional",
    "subjectName": "Diseño y Desarrollo de Base de Datos",
    "sourceScopeId": "ifc006-mf056-4",
    "pdfPages": [
      24,
      25,
      26,
      27,
      28,
      29
    ],
    "policy": "REQUESTED_DATABASE_ACTIONS_FICTITIOUS_PRACTICE_NO_IMPLICIT_INFRASTRUCTURE_V1",
    "templatePrefix": "technical-mf056",
    "additionalVerbs": "(?:cre(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|prepar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|defin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|determin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|insert(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|modific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|modifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|elimin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|relacion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|aplic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|apliqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|utiliz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|utilic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|compar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|contrast(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|disen(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|describ(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|explic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|identific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|identifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|seleccion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|justific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|justifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|analiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|interpret(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|clasific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|clasifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|elabor(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|implement(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|ejecut(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|disting(?:ue|uen|uir|a|an)|recon(?:oce|ocen|ocer|ozca|ozcan)|elige|elegir)(?:lo|la|los|las)?",
    "topics": [
      {
        "id": "database-types",
        "grade": 4,
        "label": "Tipos de bases de datos",
        "match": "tipos? de bases? de datos",
        "relation": "las características del tipo de base de datos y la organización de la información descrita en la ficha",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.1",
          "ifc006-mf056-p-database-types",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "records-fields-data",
        "grade": 4,
        "label": "Registros, campos y datos",
        "match": "registros?,? campos? y datos",
        "relation": "la distinción entre cada registro, sus campos y los valores de la tabla dada",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.2",
          "ifc006-mf056-c-databases",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "entity-relationship",
        "grade": 4,
        "label": "Modelo entidad-relación",
        "match": "modelo entidad[ -]relacion",
        "relation": "la correspondencia entre entidades, atributos, relaciones y requisitos del caso",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.3",
          "ifc006-mf056-CE4.1.4",
          "ifc006-mf056-p-entity-relationship",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "database-managers",
        "grade": 4,
        "label": "Gestores de bases de datos",
        "match": "gestores? de bases? de datos",
        "relation": "las funciones de administración de datos del gestor descritas en la ficha",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.5",
          "ifc006-mf056-p-managers-identification",
          "ifc006-mf056-p-managers-functions",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "data-model",
        "grade": 4,
        "label": "Modelo de datos",
        "match": "modelo de datos (?:relacional|jerarquico|en red)",
        "relation": "la organización de los datos y sus vínculos en el modelo solicitado, de acuerdo con los requisitos del caso",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.6",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25
        ],
        "facets": [
          {
            "id": "relational",
            "match": "relacional",
            "label": "Modelo de datos relacional",
            "relation": "la organización en tablas y la correspondencia entre sus claves y los requisitos del caso"
          },
          {
            "id": "hierarchical",
            "match": "jerarquico",
            "label": "Modelo de datos jerárquico",
            "relation": "la estructura de árbol y los vínculos entre padre e hijos de acuerdo con los requisitos del caso"
          },
          {
            "id": "network",
            "match": "en red",
            "label": "Modelo de datos en red",
            "relation": "la organización de registros y sus múltiples vínculos de acuerdo con los requisitos del caso"
          }
        ]
      },
      {
        "id": "xml",
        "grade": 4,
        "label": "Documento XML",
        "match": "\\bxml\\b",
        "relation": "la correspondencia entre los elementos, atributos y anidamiento del documento XML y la estructura solicitada",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.7",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25
        ]
      },
      {
        "id": "normalization",
        "grade": 4,
        "label": "Normalización del modelo",
        "match": "normalizacion|boyce[ -]codd|formas? normales?",
        "relation": "la correspondencia entre las dependencias, claves y descomposición de las relaciones y la forma normal expresamente solicitada",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.8",
          "ifc006-mf056-CE4.1.12",
          "ifc006-mf056-p-normalization",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "sql-language",
        "grade": 4,
        "label": "Lenguaje SQL",
        "match": "lenguaje sql",
        "relation": "la función del lenguaje SQL en las operaciones sobre datos descritas por el ejemplo dado",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.9",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25
        ]
      },
      {
        "id": "statement-families",
        "grade": 4,
        "label": "Sentencias DDL, DML y DCL",
        "match": "sentencias? sql",
        "relation": "la función de cada sentencia dada en la definición, manipulación o control de datos",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.10",
          "ifc006-mf056-p-statement-types",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ],
        "requires": "\\b(?:ddl|dml|dcl)\\b"
      },
      {
        "id": "transact-sql",
        "grade": 4,
        "label": "Transact-SQL",
        "match": "transact[ -]sql",
        "relation": "las características de Transact-SQL que se reconocen en los ejemplos de la ficha",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.10",
          "ifc006-mf056-c-databases",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "data-types",
        "grade": 4,
        "label": "Tipos de datos",
        "match": "tipos? de datos",
        "relation": "la correspondencia entre el tipo de cada campo y la información que debe conservar el modelo",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-data-types",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "relational-algebra",
        "grade": 4,
        "label": "Álgebra relacional",
        "match": "algebra relacional",
        "relation": "la relación entre las operaciones del álgebra relacional, las relaciones de entrada y el resultado del ejemplo",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.11",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25
        ]
      },
      {
        "id": "database-creation",
        "grade": 4,
        "label": "Base de datos de práctica",
        "match": "crea (?:la|una) base de datos",
        "relation": "la correspondencia entre la base de datos creada y los requisitos de estructura y almacenamiento proporcionados",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-database-creation",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "tables",
        "grade": 4,
        "label": "Tabla del modelo",
        "match": "tablas?",
        "relation": "la correspondencia entre los campos, tipos y restricciones de la tabla y el modelo dado",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-tables",
          "ifc006-mf056-CE4.3.4",
          "ifc006-mf056-RA4.1",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          25,
          26,
          28
        ],
        "exclude": "\\b(?:inner join|relaciona)\\b|registros?,? campos? y datos|clausula|indice|claves? de la tabla"
      },
      {
        "id": "indexes",
        "grade": 4,
        "label": "Índice de la tabla",
        "match": "indices?",
        "relation": "la correspondencia entre el índice expresamente indicado, sus campos y la necesidad de acceso descrita",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25
        ],
        "facets": [
          {
            "id": "removal",
            "match": "elimin|drop index",
            "label": "Índice eliminado",
            "relation": "la ausencia del índice indicado tras su eliminación y la conservación de los demás objetos de la base de datos de práctica"
          }
        ]
      },
      {
        "id": "keys",
        "grade": 4,
        "label": "Claves del modelo",
        "match": "claves?",
        "relation": "la correspondencia entre las claves, unicidad y referencias del modelo y las reglas proporcionadas",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-c-databases",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ],
        "exclude": "\\binner join\\b|relaciona"
      },
      {
        "id": "views",
        "grade": 4,
        "label": "Vista de la base de datos",
        "match": "vistas?",
        "relation": "la correspondencia entre los datos y restricciones de la vista y la información requerida por el caso",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-objects",
          "ifc006-mf056-CE4.2.2",
          "ifc006-mf056-CE4.2.3",
          "ifc006-mf056-RA4.1",
          "ifc006-mf056-RA4.2"
        ],
        "pages": [
          25,
          26,
          28
        ]
      },
      {
        "id": "queries",
        "grade": 4,
        "label": "Consulta SQL",
        "match": "consultas?|queries",
        "relation": "la correspondencia entre los datos consultados, las condiciones del modelo y la información solicitada",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.3.6",
          "ifc006-mf056-p-query-type",
          "ifc006-mf056-CE4.3.2",
          "ifc006-mf056-CE4.3.3",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          26,
          28
        ]
      },
      {
        "id": "database-forms",
        "grade": 4,
        "label": "Formulario de datos",
        "match": "formularios?",
        "relation": "la correspondencia entre los campos y controles del formulario y las reglas de captura dadas",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-objects",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          28
        ]
      },
      {
        "id": "database-functions",
        "grade": 4,
        "label": "Función de la base de datos",
        "match": "funcion(?:es)?",
        "relation": "la correspondencia entre los parámetros, operaciones y resultado de la función y los requisitos dados",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-CE4.2.2",
          "ifc006-mf056-CE4.2.3",
          "ifc006-mf056-CE4.3.3",
          "ifc006-mf056-RA4.1",
          "ifc006-mf056-RA4.2",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          25,
          26
        ],
        "requires": "base de datos|modelo de datos|sistema ficticio",
        "exclude": "gestores? de bases? de datos|segun su funcion"
      },
      {
        "id": "stored-procedures",
        "grade": 4,
        "label": "Procedimiento almacenado",
        "match": "procedimientos? almacenados?",
        "relation": "la correspondencia entre los parámetros, operaciones y efectos del procedimiento almacenado y los requisitos dados",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-database-creation",
          "ifc006-mf056-CE4.2.2",
          "ifc006-mf056-CE4.2.3",
          "ifc006-mf056-CE4.3.3",
          "ifc006-mf056-RA4.1",
          "ifc006-mf056-RA4.2",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          25,
          26,
          27
        ]
      },
      {
        "id": "triggers",
        "grade": 4,
        "label": "Disparador de datos",
        "match": "disparador(?:es)?|triggers?",
        "relation": "la correspondencia entre el evento, las condiciones y la acción del disparador y las reglas dadas",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-c-queries-dictionary",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          28
        ]
      },
      {
        "id": "insert",
        "grade": 4,
        "label": "Inserción de filas",
        "match": "\\binsert into\\b|inserta[^.;]*filas",
        "relation": "la incorporación de las filas ficticias expresamente dadas, respetando los campos y restricciones de la tabla",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-data-maintenance",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          28
        ],
        "suppresses": [
          "tables"
        ]
      },
      {
        "id": "update",
        "grade": 4,
        "label": "Actualización de filas",
        "match": "\\bupdate\\b",
        "relation": "la modificación de los valores expresamente solicitados solo en las filas que cumplen la condición dada",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-data-maintenance",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          28
        ]
      },
      {
        "id": "delete",
        "grade": 4,
        "label": "Eliminación de registros",
        "match": "\\bdelete\\b",
        "relation": "la eliminación únicamente de los registros ficticios que cumplen la condición solicitada, conservando los demás",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-record-deletion",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          28
        ],
        "suppresses": [
          "tables"
        ]
      },
      {
        "id": "table-relationships",
        "grade": 4,
        "label": "Relaciones entre tablas",
        "match": "relaciona[^.;]*tablas",
        "relation": "la correspondencia entre las claves y restricciones de las relaciones y el modelo proporcionado",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-c-databases",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ],
        "suppresses": [
          "tables",
          "keys"
        ]
      },
      {
        "id": "object-removal",
        "grade": 4,
        "label": "Eliminación de objetos",
        "match": "elimina[^.;]*objetos",
        "relation": "la eliminación solo de los objetos de práctica expresamente indicados, conservando los restantes",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-p-structure-changes",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "database-configuration",
        "grade": 4,
        "label": "Configuración del gestor",
        "match": "configuracion[^.;]*(?:dispositivos|procesos|espacio fisico)",
        "relation": "la correspondencia entre los dispositivos, procesos y espacio previstos y los recursos y necesidades dados",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.1.14",
          "ifc006-mf056-p-feasibility",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          27
        ]
      },
      {
        "id": "data-dictionary",
        "grade": 4,
        "label": "Diccionario de datos",
        "match": "diccionarios? de datos",
        "relation": "la correspondencia entre las propiedades solicitadas de los campos y el modelo de datos proporcionado",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.2.4",
          "ifc006-mf056-c-queries-dictionary",
          "ifc006-mf056-CE4.2.5",
          "ifc006-mf056-RA4.2"
        ],
        "pages": [
          26,
          28
        ],
        "facets": [
          {
            "id": "name",
            "match": "\\bnombres?\\b",
            "label": "Nombre en el diccionario",
            "relation": "la correspondencia entre el identificador del campo y su nombre en el modelo dado"
          },
          {
            "id": "type",
            "match": "\\btipos?\\b",
            "label": "Tipo en el diccionario",
            "relation": "la correspondencia entre el tipo del campo y los valores admitidos por el modelo dado"
          },
          {
            "id": "size",
            "match": "\\btamanos?\\b",
            "label": "Tamaño en el diccionario",
            "relation": "la correspondencia entre la capacidad del campo y el tamaño especificado en el modelo dado"
          },
          {
            "id": "alias",
            "match": "\\balias\\b",
            "label": "Alias en el diccionario",
            "relation": "la correspondencia entre el nombre alternativo y el campo al que designa en el modelo dado"
          },
          {
            "id": "content",
            "match": "\\bcontenidos?\\b",
            "label": "Contenido en el diccionario",
            "relation": "el significado de los valores del campo de acuerdo con su contenido en el modelo dado"
          },
          {
            "id": "organization",
            "match": "\\borganizacion\\b",
            "label": "Organización en el diccionario",
            "relation": "la organización de los campos y sus relaciones de acuerdo con el modelo dado"
          }
        ]
      },
      {
        "id": "dictionary-documentation",
        "grade": 4,
        "label": "Documentación del diccionario",
        "match": "documentacion[^.;]*diccionarios? de datos",
        "relation": "la fidelidad de la documentación a las propiedades y campos del diccionario dado",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.2.1",
          "ifc006-mf056-CE4.2.5",
          "ifc006-mf056-RA4.2"
        ],
        "pages": [
          26
        ],
        "suppresses": [
          "data-dictionary"
        ]
      },
      {
        "id": "query-objective",
        "grade": 4,
        "label": "Objetivo de la consulta",
        "match": "objetivo de la consulta",
        "relation": "la relación entre el objetivo de información, las tablas o vistas disponibles y el resultado requerido",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.3.1",
          "ifc006-mf056-p-query-objective",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          26,
          28
        ],
        "suppresses": [
          "queries",
          "tables",
          "views"
        ]
      },
      {
        "id": "select-syntax",
        "grade": 4,
        "label": "Sintaxis de SELECT",
        "match": "sentencia select",
        "relation": "la correspondencia entre las partes de la sentencia SELECT y su función en la consulta proporcionada",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.3.4",
          "ifc006-mf056-CE4.1.13",
          "ifc006-mf056-RA4.3",
          "ifc006-mf056-RA4.1"
        ],
        "pages": [
          25,
          26
        ],
        "suppresses": [
          "queries"
        ]
      },
      {
        "id": "query-clauses",
        "grade": 4,
        "label": "Cláusula SQL solicitada",
        "match": "clausula (?:from|order by|distinct|all|top|where|group by|having)",
        "relation": "el efecto de la cláusula solicitada sobre los datos y resultados de la consulta dada",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.3.6",
          "ifc006-mf056-CE4.3.5",
          "ifc006-mf056-c-queries-dictionary",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          26,
          28
        ],
        "suppresses": [
          "queries"
        ],
        "facets": [
          {
            "id": "from",
            "label": "Cláusula FROM",
            "match": "\\bfrom\\b",
            "relation": "el origen de los datos en las tablas o vistas indicadas para la consulta"
          },
          {
            "id": "order-by",
            "label": "Cláusula ORDER BY",
            "match": "\\border by\\b",
            "relation": "el orden de las filas del resultado según los campos y sentido de ordenación dados"
          },
          {
            "id": "distinct",
            "label": "Cláusula DISTINCT",
            "match": "\\bdistinct\\b",
            "relation": "la eliminación de filas duplicadas del resultado según las columnas seleccionadas"
          },
          {
            "id": "all",
            "label": "Cláusula ALL",
            "match": "\\ball\\b",
            "relation": "la conservación de las filas duplicadas del resultado según la consulta dada"
          },
          {
            "id": "top",
            "label": "Cláusula TOP",
            "match": "\\btop\\b",
            "relation": "la limitación de filas del resultado según la cantidad y orden expresamente dados"
          },
          {
            "id": "where",
            "label": "Cláusula WHERE",
            "match": "\\bwhere\\b",
            "relation": "el filtrado de filas según la condición dada"
          },
          {
            "id": "group-by",
            "label": "Cláusula GROUP BY",
            "match": "\\bgroup by\\b",
            "relation": "la agrupación de las filas por los campos indicados y su relación con los agregados solicitados"
          },
          {
            "id": "having",
            "label": "Cláusula HAVING",
            "match": "\\bhaving\\b",
            "relation": "el filtrado de los grupos según la condición indicada sobre los resultados agrupados"
          }
        ]
      },
      {
        "id": "selection-query",
        "grade": 4,
        "label": "Consulta de selección",
        "match": "consulta de seleccion",
        "relation": "la correspondencia entre el filtro y la organización de los datos y los requisitos de información dados",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.3.7",
          "ifc006-mf056-p-data-organization",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          26,
          28
        ],
        "suppresses": [
          "queries"
        ]
      },
      {
        "id": "action-query",
        "grade": 4,
        "label": "Consulta de acción",
        "match": "consulta de accion",
        "relation": "la correspondencia entre la acción y los cambios de datos expresamente solicitados, conservando los datos ajenos a la condición",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.3.7",
          "ifc006-mf056-p-action-queries",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          26,
          28
        ],
        "suppresses": [
          "queries"
        ]
      },
      {
        "id": "inner-join",
        "grade": 4,
        "label": "Consulta INNER JOIN",
        "match": "inner join",
        "relation": "la correspondencia entre las claves de unión y las filas coincidentes que debe obtener la consulta del modelo",
        "sourceRecordIds": [
          "ifc006-mf056-p-action-queries"
        ],
        "pages": [
          28
        ],
        "suppresses": [
          "queries",
          "tables",
          "keys"
        ]
      },
      {
        "id": "union-query",
        "grade": 4,
        "label": "Consulta UNION",
        "match": "\\bunion\\b",
        "relation": "la correspondencia entre las columnas compatibles de los resultados combinados y las filas que debe producir UNION según la consigna",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.3.7",
          "ifc006-mf056-p-action-queries",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          26,
          28
        ],
        "suppresses": [
          "queries"
        ]
      },
      {
        "id": "decision-query",
        "grade": 4,
        "label": "Consulta para la decisión",
        "match": "consulta[^.;]*decision",
        "relation": "la correspondencia entre la información obtenida y la necesidad de decisión del caso",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.3.7",
          "ifc006-mf056-RA4.3"
        ],
        "pages": [
          26
        ],
        "suppresses": [
          "queries"
        ]
      },
      {
        "id": "document-database",
        "grade": 4,
        "label": "Base de gestión documental",
        "match": "base de datos de gestion documental",
        "relation": "la relación entre los criterios de diseño y los documentos, usos y necesidades del caso ficticio",
        "sourceRecordIds": [
          "ifc006-mf056-p-document-database"
        ],
        "pages": [
          28
        ]
      },
      {
        "id": "institutional-needs",
        "grade": 4,
        "label": "Necesidades de información",
        "match": "procesos y necesidades de informacion",
        "relation": "la relación entre los procesos de la institución ficticia, sus necesidades de información y el uso propuesto de la base de datos",
        "sourceRecordIds": [
          "ifc006-mf056-p-institutional-processes"
        ],
        "pages": [
          28
        ]
      },
      {
        "id": "users-roles",
        "grade": 4,
        "label": "Usuarios y roles de práctica",
        "match": "usuarios y roles",
        "relation": "la correspondencia entre los usuarios y roles ficticios y los permisos expresamente dados",
        "sourceRecordIds": [
          "ifc006-mf056-p-access"
        ],
        "pages": [
          28
        ]
      },
      {
        "id": "database-login",
        "grade": 4,
        "label": "Acceso de prueba",
        "match": "\\blogin\\b",
        "relation": "la correspondencia entre el acceso de prueba y las reglas de identificación y autenticación proporcionadas",
        "sourceRecordIds": [
          "ifc006-mf056-p-access"
        ],
        "pages": [
          28
        ]
      },
      {
        "id": "access-levels",
        "grade": 4,
        "label": "Niveles de acceso",
        "match": "niveles? de acceso",
        "relation": "la correspondencia entre cada nivel y los permisos proporcionados para los datos ficticios",
        "sourceRecordIds": [
          "ifc006-mf056-p-access"
        ],
        "pages": [
          28
        ]
      },
      {
        "id": "access-security",
        "grade": 4,
        "label": "Seguridad de acceso",
        "match": "seguridad de acceso",
        "relation": "la correspondencia entre los controles aplicados y la política de acceso a los datos ficticios dada",
        "sourceRecordIds": [
          "ifc006-mf056-p-access"
        ],
        "pages": [
          28
        ]
      },
      {
        "id": "availability-scope",
        "grade": 4,
        "label": "Alcance de la disponibilidad",
        "match": "alcance[^.;]*(?:alta disponibilidad|tolerancia a fallos)",
        "relation": "la delimitación de los servicios y fallos contemplados de acuerdo con los requisitos del escenario ficticio",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.4.1",
          "ifc006-mf056-p-availability",
          "ifc006-mf056-RA4.4"
        ],
        "pages": [
          26,
          28
        ]
      },
      {
        "id": "availability-strategy",
        "grade": 4,
        "label": "Estrategia de disponibilidad",
        "match": "estrategia[^.;]*alta disponibilidad|alta disponibilidad[^.;]*estrategia|failover clustering|real application clustering|database mirroring|database replication|log shipping|always on availability groups",
        "relation": "la correspondencia entre el funcionamiento de la estrategia solicitada y los recursos y requisitos de disponibilidad proporcionados",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.4.2",
          "ifc006-mf056-c-availability",
          "ifc006-mf056-CE4.4.3",
          "ifc006-mf056-p-availability-selection",
          "ifc006-mf056-CE4.4.4",
          "ifc006-mf056-p-availability-application",
          "ifc006-mf056-RA4.4"
        ],
        "pages": [
          26,
          27,
          28,
          29
        ],
        "facets": [
          {
            "id": "failover",
            "match": "failover clustering",
            "label": "Failover Clustering",
            "relation": "la relación entre los nodos y la conmutación del servicio ante el fallo previsto en el escenario"
          },
          {
            "id": "rac",
            "match": "real application cluster(?:ing|s)|\\brac\\b",
            "label": "Real Application Clusters",
            "relation": "la coordinación de instancias que acceden a una base de datos compartida según el escenario"
          },
          {
            "id": "mirroring",
            "match": "database mirroring",
            "label": "Database Mirroring",
            "relation": "la relación entre la base principal y su copia en espejo según el escenario"
          },
          {
            "id": "replication",
            "match": "database replication",
            "label": "Database Replication",
            "relation": "la distribución y sincronización de los datos entre origen y destinos indicados en el escenario"
          },
          {
            "id": "log-shipping",
            "match": "log shipping",
            "label": "Log Shipping",
            "relation": "el envío de copias de los registros de transacciones y su restauración en la base secundaria del escenario"
          },
          {
            "id": "always-on",
            "match": "always on availability groups",
            "label": "Always On Availability Groups",
            "relation": "la relación entre el grupo de disponibilidad y sus réplicas primaria y secundarias según el escenario"
          }
        ]
      },
      {
        "id": "availability-feasibility",
        "grade": 4,
        "label": "Factibilidad de la estrategia",
        "match": "factibilidad[^.;]*alta disponibilidad",
        "relation": "la relación entre la estrategia elegida, los recursos disponibles y los motivos dados para descartar las otras opciones",
        "sourceRecordIds": [
          "ifc006-mf056-p-availability-feasibility"
        ],
        "pages": [
          29
        ],
        "suppresses": [
          "availability-strategy"
        ]
      },
      {
        "id": "availability-values",
        "grade": 4,
        "label": "Valores de disponibilidad",
        "match": "porcentajes y tiempos de disponibilidad",
        "relation": "la interpretación de los porcentajes y tiempos de disponibilidad proporcionados de acuerdo con el escenario, sin inferir una configuración real",
        "sourceRecordIds": [
          "ifc006-mf056-CE4.4.3",
          "ifc006-mf056-RA4.4"
        ],
        "pages": [
          26,
          27
        ]
      },
      {
        "id": "database-structure",
        "grade": 4,
        "label": "Estructura básica de datos",
        "match": "estructura basica[^.;]*base de datos",
        "relation": "la correspondencia entre los componentes y vínculos de la estructura básica y los requisitos de información dados",
        "sourceRecordIds": [
          "ifc006-mf056-p-database-structure"
        ],
        "pages": [
          27
        ]
      },
      {
        "id": "statements-clauses",
        "grade": 4,
        "label": "Sentencias y cláusulas",
        "match": "sentencias y clausulas",
        "relation": "la distinción entre una sentencia completa y las cláusulas que la componen, según su función en los ejemplos",
        "sourceRecordIds": [
          "ifc006-mf056-p-statements-clauses"
        ],
        "pages": [
          27
        ],
        "suppresses": [
          "queries"
        ]
      },
      {
        "id": "query-maintenance",
        "grade": 4,
        "label": "Mantenimiento según consulta",
        "match": "mantenimiento[^.;]*resultados de la consulta",
        "relation": "la correspondencia entre los resultados de la consulta y los cambios de datos expresamente solicitados, conservando la información ajena a ellos",
        "sourceRecordIds": [
          "ifc006-mf056-p-query-maintenance"
        ],
        "pages": [
          28
        ],
        "suppresses": [
          "queries"
        ]
      }
    ]
  },
  {
    "id": "mf059-4",
    "programCode": "IFC006_3",
    "moduleCode": "MF_059_3",
    "grade": 4,
    "cycle": 2,
    "modalityCode": "technical_professional",
    "subjectName": "Diseño de Portales Web y Recursos Multimedia",
    "sourceScopeId": "ifc006-mf059-4",
    "pdfPages": [
      39,
      40,
      41,
      42
    ],
    "policy": "REQUESTED_WEB_ACTIONS_FICTITIOUS_PRACTICE_NO_IMPLICIT_DEPLOYMENT_OR_LEGACY_PLUGINS_V1",
    "templatePrefix": "technical-mf059",
    "additionalVerbs": "(?:cre(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|prepar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|defin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|determin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|insert(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|modific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|modifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|aplic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|apliqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|utiliz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|utilic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|compar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|contrast(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|disen(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|describ(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|explic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|identific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|identifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|seleccion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|justific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|justifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|analiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|interpret(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|clasific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|clasifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|elabor(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|implement(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|ejecut(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|configur(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|document(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|desactiv(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|adapt(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|vincul(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|enlaz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|cambi(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|public(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|publiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|instal(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|trat(?:a|as|an|ar|e|es|en|er|ir|ando|iendo|ara|aran|era|eran|ira|iran)|prueba|prueban|probar|comprueba|comprueban|comprobar|reconoce|reconocen|reconocer|escoge|escogen|escoger|elige|elegir)(?:lo|la|los|las)?",
    "topics": [
      {
        "id": "client-needs",
        "grade": 4,
        "label": "Necesidades del cliente",
        "match": "necesidades? (?:del? )?cliente",
        "relation": "la correspondencia entre las necesidades del cliente ficticio y las funciones solicitadas para el portal",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.1.1"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "information-handling",
        "grade": 4,
        "label": "Manejo de información",
        "match": "manejo de (?:la )?informacion",
        "relation": "el recorrido de la información entre las entradas, los usos y las salidas descritas en el caso del portal",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.1.1"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "information-security",
        "grade": 4,
        "label": "Seguridad de la información",
        "match": "seguridad de (?:la )?informacion",
        "relation": "la relación entre los riesgos señalados y la protección de la información del portal en el caso ficticio",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.1.1"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "information-updates",
        "grade": 4,
        "label": "Actualización de datos",
        "match": "actualizacion de (?:los )?datos",
        "relation": "la correspondencia entre los cambios de información solicitados y los datos del portal que deben actualizarse",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.1.1"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "web-objectives",
        "grade": 4,
        "label": "Objetivos del portal",
        "match": "objetivos? (?:del? )?(?:diseno|portal|pagina)",
        "relation": "la correspondencia entre cada objetivo del portal y la finalidad descrita de la organización ficticia",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.1.2"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "visual-elements",
        "grade": 4,
        "label": "Elementos visuales",
        "match": "elementos? visuales",
        "relation": "la función de las imágenes y elementos visuales incluidos expresamente en la propuesta del portal",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.1.2"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "equipment-capacity",
        "grade": 4,
        "label": "Capacidad del equipo",
        "match": "capacidad (?:del? |de los )?equipos?",
        "relation": "la relación entre las prestaciones del equipo tecnológico y el volumen de información indicado en el caso",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.1.3"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "software-selection",
        "grade": 4,
        "label": "Software de diseño web",
        "match": "software",
        "relation": "la correspondencia entre las funciones del software de las opciones dadas y los requisitos del usuario ficticio",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.1.4"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "hardware-selection",
        "grade": 4,
        "label": "Hardware de diseño web",
        "match": "hardware",
        "relation": "la correspondencia entre las prestaciones del hardware de las opciones dadas y los requisitos del usuario ficticio",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.1.4"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "tool-characteristics",
        "grade": 4,
        "label": "Programas de diseño web",
        "match": "caracteristicas? de (?:los )?programas? de diseno web",
        "relation": "las características de los programas de diseño web tal como se presentan en las fichas proporcionadas",
        "sourceRecordIds": [
          "ifc006-mf059-p-tools-characteristics"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "publication-types",
        "grade": 4,
        "label": "Tipos de publicación web",
        "match": "tipos? de publicacion web",
        "relation": "la distinción entre los tipos de publicación web descritos en la ficha, sin realizar una publicación",
        "sourceRecordIds": [
          "ifc006-mf059-p-publication-explanation"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "workspace",
        "grade": 4,
        "label": "Ventana de trabajo",
        "match": "ventana de trabajo",
        "relation": "la función y organización de las herramientas visibles en las ventanas de los editores de diseño web dados",
        "sourceRecordIds": [
          "ifc006-mf059-p-workspace-comparison"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "templates",
        "grade": 4,
        "label": "Publicación desde plantilla",
        "match": "plantillas?",
        "relation": "la correspondencia entre la plantilla proporcionada, el contenido solicitado y la publicación de práctica preparada",
        "sourceRecordIds": [
          "ifc006-mf059-p-templates"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "page-format",
        "grade": 4,
        "label": "Formato y configuración de página",
        "match": "formato y (?:la )?configuracion de pagina|configuracion de pagina",
        "relation": "la correspondencia entre las opciones de formato y configuración solicitadas y su resultado en la publicación de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-p-page-format",
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "html-versions",
        "grade": 4,
        "label": "Versiones de HTML",
        "match": "versiones? de html",
        "relation": "la distinción entre las versiones de HTML efectivamente descritas en la ficha histórica proporcionada",
        "sourceRecordIds": [
          "ifc006-mf059-p-versions-editors",
          "ifc006-mf059-c-html"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "exclude": "\\b(?:php|java|javascript|asp)\\b"
      },
      {
        "id": "html-editors",
        "grade": 4,
        "label": "Editores HTML",
        "match": "editores? html",
        "relation": "la relación entre las funciones descritas de cada editor HTML y su uso para modificar el documento de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-p-versions-editors"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "html-converters",
        "grade": 4,
        "label": "Convertidores HTML",
        "match": "convertidores? html",
        "relation": "la relación entre los formatos de entrada y salida descritos y la función del convertidor HTML de la ficha",
        "sourceRecordIds": [
          "ifc006-mf059-p-versions-editors"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "html-characters",
        "grade": 4,
        "label": "Caracteres especiales HTML",
        "match": "caracteres? (?:especiales?|extendidos?|de control) html",
        "relation": "la correspondencia entre los caracteres HTML utilizados y los símbolos que debe representar el texto dado",
        "sourceRecordIds": [
          "ifc006-mf059-p-versions-editors",
          "ifc006-mf059-c-html"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "html-structure",
        "grade": 4,
        "label": "Estructura básica HTML",
        "match": "estructura basica (?:del? )?(?:documento )?html|estructura html",
        "relation": "la correspondencia entre la estructura del documento HTML y la organización del contenido solicitado",
        "sourceRecordIds": [
          "ifc006-mf059-p-structure",
          "ifc006-mf059-c-structure"
        ],
        "pages": [
          41,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "html-tags",
        "grade": 4,
        "label": "Etiquetas HTML",
        "match": "etiquetas? html",
        "relation": "la correspondencia entre cada etiqueta HTML indicada y la función que cumple en el fragmento proporcionado",
        "sourceRecordIds": [
          "ifc006-mf059-p-tags-links",
          "ifc006-mf059-c-structure"
        ],
        "pages": [
          41,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "html-links",
        "grade": 4,
        "label": "Enlaces HTML",
        "match": "enlaces?",
        "relation": "la correspondencia entre cada enlace creado y el destino proporcionado al que debe conducir",
        "sourceRecordIds": [
          "ifc006-mf059-p-tags-links"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:cre(?:a|an|ar|e|en)|utiliz\\w*|modific\\w*)\\b"
      },
      {
        "id": "url-types",
        "grade": 4,
        "label": "Tipos de URL",
        "match": "tipos? de url",
        "relation": "la distinción entre los tipos de URL de los ejemplos y la forma en que señalan el destino del enlace",
        "sourceRecordIds": [
          "ifc006-mf059-p-urls-anchors",
          "ifc006-mf059-c-structure"
        ],
        "pages": [
          41,
          42
        ],
        "suppresses": [
          "web-design",
          "html-links"
        ]
      },
      {
        "id": "anchor-types",
        "grade": 4,
        "label": "Tipos de anclas HTML",
        "match": "tipos? de anclas?",
        "relation": "la distinción entre las anclas HTML proporcionadas y el punto de destino señalado por cada una",
        "sourceRecordIds": [
          "ifc006-mf059-p-urls-anchors",
          "ifc006-mf059-c-structure"
        ],
        "pages": [
          41,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "html-lists",
        "grade": 4,
        "label": "Listas HTML",
        "match": "listas? html",
        "relation": "la correspondencia entre el tipo de lista HTML y la organización de los elementos mostrados",
        "sourceRecordIds": [
          "ifc006-mf059-p-lists-images-format",
          "ifc006-mf059-c-structure"
        ],
        "pages": [
          41,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "image-formats",
        "grade": 4,
        "label": "Formatos de imagen",
        "match": "formatos? de (?:las )?imagenes?",
        "relation": "la relación entre las características descritas de cada formato de imagen y la finalidad indicada para el recurso web",
        "sourceRecordIds": [
          "ifc006-mf059-p-lists-images-format",
          "ifc006-mf059-CE7.2.4"
        ],
        "pages": [
          40,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "text-alignment",
        "grade": 4,
        "label": "Alineación del texto",
        "match": "alineacion (?:indicada )?(?:al|del?|de el) texto",
        "relation": "la correspondencia entre la alineación solicitada y la disposición del texto en la página de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-p-lists-images-format",
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "text-color",
        "grade": 4,
        "label": "Color del texto",
        "match": "color (?:del?|al) texto",
        "relation": "la correspondencia entre el color de texto solicitado y el aplicado en la página de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-p-lists-images-format",
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "font-size",
        "grade": 4,
        "label": "Tamaño de letra",
        "match": "tamano de letra",
        "relation": "la correspondencia entre el tamaño de letra solicitado y el aplicado al texto de la página de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-p-lists-images-format",
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "typography",
        "grade": 4,
        "label": "Tipografía",
        "match": "tipografia|tipos? de letras?",
        "relation": "la relación entre la tipografía elegida de las opciones dadas y el requisito de lectura indicado",
        "sourceRecordIds": [
          "ifc006-mf059-p-lists-images-format",
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "background-color",
        "grade": 4,
        "label": "Fondo de color",
        "match": "fondo de color",
        "relation": "la correspondencia entre el color de fondo solicitado y el aplicado en la página de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-p-lists-images-format",
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "background-image",
        "grade": 4,
        "label": "Imagen de fondo",
        "match": "imagen de fondo",
        "relation": "la correspondencia entre la imagen de fondo proporcionada y su aplicación según el diseño solicitado",
        "sourceRecordIds": [
          "ifc006-mf059-p-lists-images-format"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "visual-layout",
        "grade": 4,
        "label": "Apariencia de pantalla",
        "match": "apariencia de (?:la )?pantalla",
        "relation": "la correspondencia entre la distribución de los elementos de la pantalla y los requisitos visuales expresamente solicitados",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.1"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "printed-layout",
        "grade": 4,
        "label": "Apariencia del documento impreso",
        "match": "apariencia (?:del?|de un) documento impreso",
        "relation": "la correspondencia entre la distribución de los elementos del impreso y los requisitos de salida solicitados",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.1"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "screen-dimensions",
        "grade": 4,
        "label": "Dimensiones de pantalla",
        "match": "dimensiones? de (?:la )?pantalla",
        "relation": "la correspondencia entre las dimensiones propuestas para la pantalla y las características del dispositivo indicado",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "print-dimensions",
        "grade": 4,
        "label": "Dimensiones del impreso",
        "match": "dimensiones? (?:del?|de un) impreso",
        "relation": "la correspondencia entre las dimensiones del impreso y el tamaño de salida solicitado",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "design-colors",
        "grade": 4,
        "label": "Colores del diseño",
        "match": "colores? de (?:los )?elementos|paleta",
        "relation": "la correspondencia entre los colores de los elementos del diseño y la paleta proporcionada para el caso ficticio",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "page-margins",
        "grade": 4,
        "label": "Márgenes de página",
        "match": "margenes?",
        "relation": "la correspondencia entre los márgenes solicitados y la separación del contenido respecto a los bordes de la página",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.2"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "image-modification",
        "grade": 4,
        "label": "Modificación de imagen",
        "match": "imagen(?:es)?",
        "relation": "la correspondencia entre la imagen modificada y los cambios expresamente solicitados en la propuesta web",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.3"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:modific\\w*|modifiqu\\w*|adapt\\w*|adecu\\w*)\\b",
        "application": "La imagen presenta los cambios solicitados y conserva los elementos que deben mantenerse."
      },
      {
        "id": "animation-modification",
        "grade": 4,
        "label": "Modificación de animación",
        "match": "animacion(?:es)?",
        "relation": "la correspondencia entre la animación modificada y los cambios expresamente solicitados en la propuesta web",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.3"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:modific\\w*|modifiqu\\w*|adapt\\w*)\\b",
        "application": "La animación presenta los cambios solicitados y conserva los elementos que no requieren cambios."
      },
      {
        "id": "image-insertion",
        "grade": 4,
        "label": "Inserción de imagen",
        "match": "imagen(?:es)?",
        "relation": "la correspondencia entre la imagen proporcionada, su referencia en HTML y el lugar de inserción solicitado",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:insert\\w*|inclu\\w*)\\b",
        "application": "La página incluye la imagen proporcionada en el lugar solicitado mediante una referencia que permite reconocer el recurso."
      },
      {
        "id": "image-attributes",
        "grade": 4,
        "label": "Atributos de imagen",
        "match": "atributos (?:indicados )?(?:(?:a|de) (?:la )?)?imagen|imagen html[^.;]*atributos",
        "relation": "la correspondencia entre los atributos de la imagen HTML expresamente solicitados y el efecto indicado para cada uno",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "image-placement",
        "grade": 4,
        "label": "Ubicación de imagen",
        "match": "ubicacion de (?:la )?imagen|imagen respecto al texto",
        "relation": "la correspondencia entre la ubicación de la imagen, el texto de la página y la propuesta de distribución dada",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4",
          "ifc006-mf059-p-lists-images-format"
        ],
        "pages": [
          40,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "image-map-regions",
        "grade": 4,
        "label": "Regiones del mapa de imagen",
        "match": "regiones? (?:del? )?mapa de imagen",
        "relation": "la correspondencia entre las regiones definidas en el mapa de imagen y las zonas señaladas en el recurso proporcionado",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design",
          "image-map"
        ],
        "requires": "\\b(?:defin\\w*|delimit\\w*|identific\\w*|disen\\w*)\\b"
      },
      {
        "id": "image-map-links",
        "grade": 4,
        "label": "Vínculos del mapa de imagen",
        "match": "regiones? (?:del? )?mapa de imagen",
        "relation": "la correspondencia entre cada región del mapa de imagen y el destino proporcionado al que debe conducir",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design",
          "image-map"
        ],
        "requires": "\\b(?:vincul\\w*|enlaz\\w*)\\b"
      },
      {
        "id": "audio-insertion",
        "grade": 4,
        "label": "Inserción de audio",
        "match": "audio",
        "relation": "la correspondencia entre el archivo de audio dado, su inserción en la página y las propiedades expresamente solicitadas",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4",
          "ifc006-mf059-p-multimedia"
        ],
        "pages": [
          40,
          42
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:insert\\w*|inclu\\w*)\\b",
        "application": "La página incorpora el audio dado mediante las etiquetas y propiedades solicitadas para ese recurso."
      },
      {
        "id": "video-insertion",
        "grade": 4,
        "label": "Inserción de video",
        "match": "video",
        "relation": "la correspondencia entre el archivo de video dado, su inserción en la página y las propiedades expresamente solicitadas",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4",
          "ifc006-mf059-p-multimedia"
        ],
        "pages": [
          40,
          42
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:insert\\w*|inclu\\w*)\\b",
        "application": "La página incorpora el video dado mediante las etiquetas y propiedades solicitadas para ese recurso."
      },
      {
        "id": "embedded-programs",
        "grade": 4,
        "label": "Inserción documental de programas",
        "match": "insercion de programas",
        "relation": "la relación entre el mecanismo de inserción de programas descrito y el papel del componente en el ejemplo documental, sin instalarlo ni ejecutarlo",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "audio-resources",
        "grade": 4,
        "label": "Recursos de audio",
        "match": "recursos de audio",
        "relation": "la correspondencia entre los archivos y opciones de audio proporcionados y la configuración solicitada en la página de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "video-resources",
        "grade": 4,
        "label": "Recursos de video",
        "match": "recursos de video",
        "relation": "la correspondencia entre los archivos y opciones de video proporcionados y la configuración solicitada en la página de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.4"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "form-textbox",
        "grade": 4,
        "label": "Cajas de texto del formulario",
        "match": "cajas? de texto",
        "relation": "la correspondencia entre cada caja de texto del formulario HTML y la información que recibe según el ejemplo dado",
        "sourceRecordIds": [
          "ifc006-mf059-p-forms",
          "ifc006-mf059-c-structure"
        ],
        "pages": [
          41,
          42
        ],
        "suppresses": [
          "web-design",
          "form-controls"
        ]
      },
      {
        "id": "form-options",
        "grade": 4,
        "label": "Opciones del formulario",
        "match": "opciones (?:del? )?formulario",
        "relation": "la correspondencia entre las opciones del formulario HTML y las alternativas de entrada indicadas",
        "sourceRecordIds": [
          "ifc006-mf059-p-forms"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design",
          "form-controls"
        ]
      },
      {
        "id": "form-buttons",
        "grade": 4,
        "label": "Botones del formulario",
        "match": "botones? (?:del? )?formulario",
        "relation": "la correspondencia entre los botones del formulario HTML y las acciones indicadas para cada uno",
        "sourceRecordIds": [
          "ifc006-mf059-p-forms"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design",
          "form-controls"
        ]
      },
      {
        "id": "form-controls",
        "grade": 4,
        "label": "Controles del formulario",
        "match": "controles? (?:del? )?formulario",
        "relation": "la correspondencia entre los controles del formulario HTML y los campos y acciones solicitados por el usuario ficticio",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.2.1",
          "ifc006-mf059-p-forms",
          "ifc006-mf059-c-structure"
        ],
        "pages": [
          40,
          41,
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "tag-manipulation",
        "grade": 4,
        "label": "Modificación de etiquetas",
        "match": "etiquetas? html",
        "relation": "la correspondencia entre las etiquetas HTML modificadas y el cambio de estructura solicitado en el fragmento dado",
        "sourceRecordIds": [
          "ifc006-mf059-p-tag-manipulation"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design",
          "html-tags"
        ],
        "requires": "\\b(?:modific\\w*|modifiqu\\w*)\\b",
        "application": "El fragmento HTML presenta el cambio de etiquetas solicitado y conserva la estructura que debe mantenerse."
      },
      {
        "id": "element-disabling",
        "grade": 4,
        "label": "Desactivación de un elemento",
        "match": "elemento (?:del? )?formulario|elementos? html",
        "relation": "la desactivación del elemento señalado y la conservación del funcionamiento de los demás controles del ejemplo",
        "sourceRecordIds": [
          "ifc006-mf059-p-tag-manipulation"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design",
          "form-controls"
        ],
        "requires": "\\bdesactiv\\w*\\b",
        "application": "El elemento indicado queda desactivado y los demás controles del ejemplo conservan el comportamiento que deben mantener."
      },
      {
        "id": "image-map",
        "grade": 4,
        "label": "Mapa de imagen HTML",
        "match": "mapa de imagen",
        "relation": "la correspondencia entre las zonas del mapa de imagen proporcionado y los destinos indicados para el recorrido de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-p-maps-tables"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "table-rows",
        "grade": 4,
        "label": "Filas de tabla HTML",
        "match": "filas de (?:la )?tabla html",
        "relation": "la correspondencia entre las filas modificadas, la estructura de tabla solicitada y la conservación de los datos dados",
        "sourceRecordIds": [
          "ifc006-mf059-p-maps-tables"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ],
        "application": "Las filas de la tabla HTML presentan la estructura solicitada y conservan los datos que deben mantenerse."
      },
      {
        "id": "table-cells",
        "grade": 4,
        "label": "Celdas de tabla HTML",
        "match": "celdas de (?:la )?tabla html",
        "relation": "la correspondencia entre la distribución solicitada de las celdas HTML y la conservación de su contenido",
        "sourceRecordIds": [
          "ifc006-mf059-p-maps-tables"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ],
        "application": "Las celdas de la tabla HTML presentan la distribución solicitada y conservan el contenido que debe mantenerse."
      },
      {
        "id": "table-caption",
        "grade": 4,
        "label": "Título de tabla HTML",
        "match": "titulo (?:indicado )?(?:a|de) (?:la )?tabla html",
        "relation": "la correspondencia entre el título de la tabla HTML y el contenido que representa",
        "sourceRecordIds": [
          "ifc006-mf059-p-maps-tables"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "animation-application",
        "grade": 4,
        "label": "Aplicación de animación",
        "match": "animacion(?:es)?",
        "relation": "la correspondencia entre la animación proporcionada y las condiciones de aplicación expresamente indicadas para el recurso multimedia web",
        "sourceRecordIds": [
          "ifc006-mf059-p-multimedia"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:aplic\\w*|apliqu\\w*|insert\\w*|utiliz\\w*)\\b",
        "application": "El recurso multimedia utiliza la animación dada según las condiciones de aplicación solicitadas."
      },
      {
        "id": "external-files",
        "grade": 4,
        "label": "Ficheros externos",
        "match": "ficheros? externos?",
        "relation": "la correspondencia entre los ficheros externos identificados y las referencias a recursos del documento web proporcionado",
        "sourceRecordIds": [
          "ifc006-mf059-p-external-files"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "online-multimedia",
        "grade": 4,
        "label": "Multimedia en línea",
        "match": "multimedia (?:en linea|online)",
        "relation": "la relación entre el recurso multimedia en línea descrito y las dependencias indicadas en la ficha, sin conectarse a servicios externos",
        "sourceRecordIds": [
          "ifc006-mf059-p-external-files"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "plugins-description",
        "grade": 4,
        "label": "Plugins históricos",
        "match": "plugins?",
        "relation": "la función del plugin en el ejemplo documental histórico y su relación con el recurso web descrito, sin instalarlo ni ejecutarlo",
        "sourceRecordIds": [
          "ifc006-mf059-p-external-files"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "embedded-objects",
        "grade": 4,
        "label": "Objetos incrustados",
        "match": "objetos? incrustados?",
        "relation": "la correspondencia entre los objetos incrustados identificados y su representación en el fragmento HTML documental",
        "sourceRecordIds": [
          "ifc006-mf059-p-external-files"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "navigation-diagram",
        "grade": 4,
        "label": "Diagrama de navegación",
        "match": "diagrama de navegacion",
        "relation": "la correspondencia entre las pantallas, los accesos y los enlaces solicitados en el recorrido del portal ficticio",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.1"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "window-hierarchy",
        "grade": 4,
        "label": "Jerarquía de ventanas",
        "match": "jerarquia de (?:las )?ventanas",
        "relation": "la correspondencia entre el orden de las ventanas y las prioridades de acceso a la información indicadas",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.2"
        ],
        "pages": [
          40
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "style-syntax",
        "grade": 4,
        "label": "Sintaxis de estilos",
        "match": "sintaxis[^.;]*estilos?|estilos? (?:a|de) (?:las )?etiquetas",
        "relation": "la correspondencia entre la sintaxis de asignación de estilos y el efecto indicado sobre las etiquetas del ejemplo",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design",
          "html-tags"
        ]
      },
      {
        "id": "browser-testing",
        "grade": 4,
        "label": "Prueba en navegadores",
        "match": "navegadores?",
        "relation": "la correspondencia entre las pruebas realizadas en los navegadores indicados y el comportamiento solicitado para la página local",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:prueb\\w*|probar|comprueb\\w*|comprob\\w*|verific\\w*)\\b"
      },
      {
        "id": "source-documentation",
        "grade": 4,
        "label": "Documentación del fichero HTML",
        "match": "fichero html|documento html",
        "relation": "la correspondencia entre la documentación presentada y los aspectos del fichero HTML expresamente solicitados",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\bdocument(?:a|an|ar|e|en|ando)\\b"
      },
      {
        "id": "accessibility-definition",
        "grade": 4,
        "label": "Definición de accesibilidad",
        "match": "accesibilidad web",
        "relation": "la relación entre la accesibilidad web y la posibilidad de acceder al contenido ante la barrera descrita en el ejemplo",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\bdefin\\w*\\b"
      },
      {
        "id": "accessibility-advantages",
        "grade": 4,
        "label": "Ventajas de accesibilidad",
        "match": "ventajas de (?:la )?accesibilidad",
        "relation": "la relación entre las ventajas de accesibilidad explicadas y los ejemplos dados de acceso y navegación",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "accessibility-verification",
        "grade": 4,
        "label": "Comprobación de accesibilidad",
        "match": "accesibilidad",
        "relation": "la correspondencia entre las condiciones indicadas, la comprobación realizada y el acceso al contenido de la página de práctica",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:comprueb\\w*|comprob\\w*|verific\\w*|prueb\\w*)\\b"
      },
      {
        "id": "accessibility-application",
        "grade": 4,
        "label": "Aplicación de accesibilidad",
        "match": "accesibilidad",
        "relation": "la correspondencia entre el criterio de accesibilidad expresamente solicitado y la corrección de la barrera señalada en el ejemplo",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:aplic\\w*|apliqu\\w*|corrig\\w*)\\b",
        "application": "La página de práctica corrige la barrera señalada mediante el criterio de accesibilidad indicado, sin añadir exigencias ajenas a la consigna."
      },
      {
        "id": "accessibility-resources",
        "grade": 4,
        "label": "Recursos de accesibilidad",
        "match": "recursos web estandares de accesibilidad|recursos de accesibilidad",
        "relation": "la correspondencia entre los recursos de accesibilidad descritos en la ficha y la función indicada para cada uno",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "usability-definition",
        "grade": 4,
        "label": "Definición de usabilidad",
        "match": "usabilidad web",
        "relation": "la relación entre la usabilidad, la tarea indicada y la interacción de la persona con el sitio del ejemplo",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\bdefin\\w*\\b"
      },
      {
        "id": "usability-design",
        "grade": 4,
        "label": "Diseño de sitio usable",
        "match": "sitio web usable",
        "relation": "la correspondencia entre el diseño del sitio, la tarea del usuario y el recorrido indicado en el caso ficticio",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\bdisen\\w*\\b"
      },
      {
        "id": "usability-description",
        "grade": 4,
        "label": "Descripción de usabilidad",
        "match": "usabilidad (?:del? )?sitio web",
        "relation": "la relación entre la organización del sitio mostrado y la realización de la tarea del usuario indicada",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\bdescrib\\w*\\b"
      },
      {
        "id": "usability-analysis",
        "grade": 4,
        "label": "Análisis de usabilidad",
        "match": "usabilidad",
        "relation": "la relación entre la estructura y el diseño del sitio, la tarea indicada y los problemas de uso descritos en el caso",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\b(?:analiz\\w*|interpret\\w*)\\b"
      },
      {
        "id": "usability-adaptation",
        "grade": 4,
        "label": "Adaptación de sitio usable",
        "match": "usabilidad",
        "relation": "la correspondencia entre la adaptación del sitio y el problema de uso señalado, conservando los elementos que no requieren cambios",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\badapt\\w*\\b",
        "application": "El sitio de práctica resuelve el problema de usabilidad señalado y conserva los elementos que no requieren cambios."
      },
      {
        "id": "usability-use",
        "grade": 4,
        "label": "Uso del sitio web",
        "match": "usabilidad",
        "relation": "la correspondencia entre el recorrido realizado en el sitio de práctica y la tarea del usuario indicada",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.3"
        ],
        "pages": [
          40,
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "requires": "\\butiliz\\w*\\b",
        "relationsByMode": {
          "verification": "la relación entre la facilidad o las dificultades de interacción observadas y la tarea del usuario indicada en el sitio de práctica"
        }
      },
      {
        "id": "web-design",
        "grade": 4,
        "label": "Diseño de aplicación web",
        "match": "(?:aplicacion|sitio|portal|pagina) web",
        "relation": "la correspondencia entre el diseño de la aplicación web ficticia y los requisitos de la institución expresamente proporcionados",
        "sourceRecordIds": [
          "ifc006-mf059-CE7.3.4"
        ],
        "pages": [
          41
        ],
        "requires": "\\bdisen\\w*\\b"
      },
      {
        "id": "web-technologies",
        "grade": 4,
        "label": "Tecnologías de desarrollo web",
        "match": "tecnologias de desarrollo web",
        "relation": "la distinción entre las tecnologías de desarrollo web de la ficha y la función descrita para cada una",
        "sourceRecordIds": [
          "ifc006-mf059-c-html"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "sound-formats",
        "grade": 4,
        "label": "Formatos de sonido",
        "match": "formatos? de sonido|mp3|wav|midi",
        "relation": "la relación entre las características dadas de los formatos de sonido solicitados y su pertinencia para el recurso sonoro descrito",
        "sourceRecordIds": [
          "ifc006-mf059-c-multimedia"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ],
        "facets": [
          {
            "id": "mp3",
            "label": "Formato MP3",
            "match": "\\bmp3\\b",
            "relation": "la relación entre las características de MP3 descritas en la ficha y su pertinencia para el recurso solicitado"
          },
          {
            "id": "wav",
            "label": "Formato WAV",
            "match": "\\bwav\\b",
            "relation": "la relación entre las características de WAV descritas en la ficha y su pertinencia para el recurso solicitado"
          },
          {
            "id": "midi",
            "label": "Formato MIDI",
            "match": "\\bmidi\\b",
            "relation": "la relación entre las características de MIDI descritas en la ficha y su pertinencia para el recurso solicitado"
          }
        ]
      },
      {
        "id": "historical-flash",
        "grade": 4,
        "label": "SWF y Flash documentales",
        "match": "swf|animacion flash",
        "relation": "la relación entre SWF, la animación Flash y su uso histórico descrito en la ficha, sin instalar ni ejecutar componentes",
        "sourceRecordIds": [
          "ifc006-mf059-c-multimedia"
        ],
        "pages": [
          42
        ],
        "suppresses": [
          "web-design"
        ]
      },
      {
        "id": "historical-languages",
        "grade": 4,
        "label": "Tecnologías bajo el encabezado histórico HTML",
        "match": "php|java|javascript|asp",
        "relation": "la relación entre las tecnologías expresamente solicitadas y la función descrita para cada una en la ficha histórica",
        "sourceRecordIds": [
          "ifc006-mf059-c-html"
        ],
        "pages": [
          41
        ],
        "suppresses": [
          "web-design"
        ],
        "facets": [
          {
            "id": "html",
            "label": "Tecnología HTML",
            "match": "\\bhtml\\b",
            "relation": "la función de HTML descrita en la ficha histórica y su lugar en el desarrollo web del ejemplo dado"
          },
          {
            "id": "php",
            "label": "Tecnología PHP",
            "match": "\\bphp\\b",
            "relation": "la función de PHP descrita en la ficha histórica y su lugar en el desarrollo web del ejemplo dado"
          },
          {
            "id": "java",
            "label": "Tecnología Java",
            "match": "\\bjava\\b",
            "relation": "la función de Java descrita en la ficha histórica y su lugar en el desarrollo web del ejemplo dado"
          },
          {
            "id": "javascript",
            "label": "Tecnología JavaScript",
            "match": "\\bjavascript\\b",
            "relation": "la función de JavaScript descrita en la ficha histórica y su lugar en el desarrollo web del ejemplo dado"
          },
          {
            "id": "asp",
            "label": "Tecnología ASP",
            "match": "\\basp\\b",
            "relation": "la función de ASP descrita en la ficha histórica y su lugar en el desarrollo web del ejemplo dado"
          }
        ]
      }
    ]
  }
],
version:"evaluation-2026.146"} as unknown as EvaluationCatalog
