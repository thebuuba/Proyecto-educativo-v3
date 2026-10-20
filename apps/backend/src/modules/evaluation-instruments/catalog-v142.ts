import type {EvaluationCatalog} from './catalog-current'
import {evaluationCatalogV141} from './catalog-v141'
/** Payload142 verificado con Development; conservar exactamente MF053. */
export const evaluationCatalogV142={...evaluationCatalogV141,technicalModules:[
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
  }
],
version:"evaluation-2026.142"} as unknown as EvaluationCatalog
