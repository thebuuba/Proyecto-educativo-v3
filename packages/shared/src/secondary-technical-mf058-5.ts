import type {TechnicalModule} from './secondary-technical'
/** Pedagogical adaptations; official literals remain in the reviewed matrix. */
export const technicalMf058Five:TechnicalModule={
  "id": "mf058-5",
  "programCode": "IFC006_3",
  "moduleCode": "MF_058_3",
  "grade": 5,
  "cycle": 2,
  "modalityCode": "technical_professional",
  "subjectName": "Análisis y Diseño de Reporte",
  "sourceScopeId": "ifc006-mf058-5",
  "pdfPages": [
    37,
    38,
    39
  ],
  "policy": "REQUESTED_REPORT_DESIGN_DATA_AND_OUTPUT_ACTIONS_FICTITIOUS_PRACTICE_NO_REMOTE_PUBLICATION_V1",
  "templatePrefix": "technical-mf058",
  "additionalVerbs": "comprueb(?:a|an|e|en)|verific(?:a|an|ar|ando)|calcul(?:a|an|ar|e|en|ando)|analiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|clasific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|clasifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|seleccion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|determin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|compar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|explic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|ejecut(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|realiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|instal(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|cre(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|estructur(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|especific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|agreg(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|defin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|aplic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|apliqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|disen(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|ajust(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|gener(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|oper(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|utiliz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|utilic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|configur(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|orden(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|modific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|modifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|prepar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|mostr(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|muestr(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|almacen(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|public(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|produzc(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|produc(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|consult(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|(?:pid|requier|solicit)(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)",
  "topics": [
    {
      "id": "report-needs",
      "grade": 5,
      "label": "Necesidades de información",
      "match": "necesidades de informacion",
      "relation": "la relación entre la información requerida por los usuarios ficticios y las condiciones proporcionadas para el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.1.1"
      ],
      "pages": [
        37
      ],
      "requires": "analiz|clasific"
    },
    {
      "id": "report-type",
      "grade": 5,
      "label": "Tipo de reporte",
      "match": "internos?|externos?",
      "relation": "la adecuación del carácter interno o externo del reporte al destinatario y las necesidades del caso",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.1.2"
      ],
      "pages": [
        37
      ],
      "requires": "tipos? de reportes?|determina|clasific|identific|compara|describe|explica"
    },
    {
      "id": "report-medium",
      "grade": 5,
      "label": "Medio del reporte",
      "match": "medio apropiado del reporte|metodos? o tecnologias?",
      "relation": "la correspondencia entre el medio elegido, las necesidades de información y los recursos descritos, sin exigir todas las opciones",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.1.2"
      ],
      "pages": [
        37
      ]
    },
    {
      "id": "report-order",
      "grade": 5,
      "label": "Orden de las informaciones",
      "match": "cronologicamente|por costos",
      "relation": "la adecuación del orden cronológico o por costos a los requerimientos de información del caso",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.1.2"
      ],
      "pages": [
        37
      ]
    },
    {
      "id": "report-structure",
      "grade": 5,
      "label": "Estructura general del reporte",
      "match": "estructura general del reporte",
      "relation": "la distribución y función de las secciones expresamente solicitadas en el esquema del reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.1.2"
      ],
      "pages": [
        37
      ],
      "suppresses": [
        "totals",
        "section-report-header",
        "section-page-header",
        "section-details",
        "section-page-footer",
        "section-report-footer",
        "section-group-header",
        "section-group-footer"
      ]
    },
    {
      "id": "tools-classification",
      "grade": 5,
      "label": "Herramientas de diseño de reportes",
      "match": "herramientas de diseno de reportes",
      "relation": "la correspondencia entre las características de las herramientas proporcionadas y los requerimientos del caso",
      "relationsByMode": {
        "classification": "la correspondencia entre las categorías indicadas y las características de las herramientas proporcionadas",
        "selection": "la adecuación de la herramienta seleccionada a los requerimientos del caso"
      },
      "sourceRecordIds": [
        "ifc006-mf058-CE6.1.3"
      ],
      "pages": [
        37
      ]
    },
    {
      "id": "report-views",
      "grade": 5,
      "label": "Vistas del reporte",
      "match": "vistas del reporte",
      "relation": "la correspondencia entre los mismos datos de origen y sus diferencias de presentación en las vistas proporcionadas",
      "sourceRecordIds": [
        "ifc006-mf058-c-reports-tools"
      ],
      "pages": [
        38
      ]
    },
    {
      "id": "report-execution",
      "grade": 5,
      "label": "Ejecución del reporte",
      "match": "ejecuta (?:el )?reporte|ejecutar (?:el )?reporte",
      "relation": "la correspondencia entre los parámetros usados al ejecutar el reporte de práctica y la salida obtenida frente a la esperada",
      "sourceRecordIds": [
        "ifc006-mf058-c-reports-tools"
      ],
      "pages": [
        38
      ]
    },
    {
      "id": "manager-installation",
      "grade": 5,
      "label": "Instalación del gestor de reportes",
      "match": "instalacion del gestor de reportes|instala (?:el )?gestor de reportes",
      "relation": "la correspondencia entre el gestor proporcionado, el procedimiento de instalación y su disponibilidad en la máquina de práctica indicada",
      "sourceRecordIds": [
        "ifc006-mf058-p-manager-installation"
      ],
      "pages": [
        38
      ]
    },
    {
      "id": "project-creation",
      "grade": 5,
      "label": "Proyecto de reportes",
      "match": "proyectos? de reportes?",
      "relation": "la correspondencia entre la estructura del proyecto creado y los requisitos proporcionados para los reportes de práctica",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.1",
        "ifc006-mf058-p-project-creation"
      ],
      "pages": [
        37,
        38
      ],
      "requires": "crea|creacion|estructura|elabora"
    },
    {
      "id": "connection-ado",
      "grade": 5,
      "label": "Conexión ADO",
      "match": "activex data objects|ado",
      "relation": "la correspondencia entre el mecanismo ADO especificado y las informaciones ficticias de conexión necesarias para el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.2",
        "ifc006-mf058-p-connection-specification"
      ],
      "pages": [
        38
      ]
    },
    {
      "id": "connection-dao",
      "grade": 5,
      "label": "Conexión DAO",
      "match": "data access object|dao",
      "relation": "la correspondencia entre el mecanismo DAO especificado y las informaciones ficticias de conexión necesarias para el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.2",
        "ifc006-mf058-p-connection-specification"
      ],
      "pages": [
        38
      ]
    },
    {
      "id": "connection-oledb",
      "grade": 5,
      "label": "Conexión OLE/DB",
      "match": "object linking and embedding for databases|ole/db",
      "relation": "la correspondencia entre el mecanismo OLE/DB especificado y las informaciones ficticias de conexión necesarias para el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.2",
        "ifc006-mf058-p-connection-specification"
      ],
      "pages": [
        38
      ]
    },
    {
      "id": "connection-selection",
      "grade": 5,
      "label": "Selección de conexión",
      "match": "ado|dao|ole/db",
      "relation": "la adecuación del mecanismo elegido al entorno y las necesidades del reporte del caso, sin implementar todos los mecanismos",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.2"
      ],
      "pages": [
        38
      ],
      "requires": "seleccion|elige|elegir|escog",
      "suppresses": [
        "connection-ado",
        "connection-dao",
        "connection-oledb"
      ]
    },
    {
      "id": "dataset-creation",
      "grade": 5,
      "label": "Conjunto de datos",
      "match": "conjuntos? de datos",
      "relation": "la correspondencia entre los campos y registros del conjunto creado y los datos que necesita el informe de práctica",
      "sourceRecordIds": [
        "ifc006-mf058-p-datasets-queries"
      ],
      "pages": [
        38
      ]
    },
    {
      "id": "query-creation",
      "grade": 5,
      "label": "Consulta del informe",
      "match": "consultas?",
      "relation": "la correspondencia entre los campos y condiciones de la consulta creada y los datos solicitados para el informe de práctica",
      "sourceRecordIds": [
        "ifc006-mf058-p-datasets-queries"
      ],
      "pages": [
        38
      ],
      "requires": "informe|reporte"
    },
    {
      "id": "tables-addition",
      "grade": 5,
      "label": "Tablas del proyecto",
      "match": "tablas",
      "relation": "la correspondencia entre las tablas agregadas al proyecto y los datos que deben distribuirse en el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.3",
        "ifc006-mf058-p-tables-addition"
      ],
      "pages": [
        38
      ],
      "requires": "agrega|agregar|adicion|anad"
    },
    {
      "id": "table-relations",
      "grade": 5,
      "label": "Relaciones de tablas",
      "match": "relaciones entre (?:las )?tablas",
      "relation": "la correspondencia entre las relaciones definidas, las claves proporcionadas y la asociación de los datos del reporte",
      "sourceRecordIds": [
        "ifc006-mf058-c-reports-tools"
      ],
      "pages": [
        38
      ]
    },
    {
      "id": "section-report-header",
      "grade": 5,
      "label": "Encabezado del reporte",
      "match": "encabezados? de(?:l)? reporte",
      "relation": "la ubicación de los datos solicitados en el encabezado general del reporte, distinguiéndolo de los encabezados repetidos en cada página",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.3",
        "ifc006-mf058-p-sections"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "section-page-header",
      "grade": 5,
      "label": "Encabezado de página",
      "match": "encabezados? de paginas?",
      "relation": "la ubicación de los datos solicitados en la sección que encabeza las páginas del reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.3",
        "ifc006-mf058-p-sections"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "section-details",
      "grade": 5,
      "label": "Línea de detalles",
      "match": "lineas? de detalles?",
      "relation": "la correspondencia entre cada línea de detalles y los registros ficticios que deben repetirse en el cuerpo del reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.3",
        "ifc006-mf058-p-sections"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "section-page-footer",
      "grade": 5,
      "label": "Pie de página",
      "match": "pies? de paginas?",
      "relation": "la ubicación de los datos solicitados en la sección que cierra cada página del reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.3",
        "ifc006-mf058-p-sections"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "section-report-footer",
      "grade": 5,
      "label": "Pie del reporte",
      "match": "pies? de(?:l)? reporte",
      "relation": "la ubicación de los datos finales solicitados en el cierre general del reporte, sin confundirlo con el pie de cada página",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.3",
        "ifc006-mf058-p-sections"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "section-group-header",
      "grade": 5,
      "label": "Encabezado de grupo",
      "match": "encabezados? de grupos?",
      "relation": "la ubicación de los datos solicitados al inicio de cada grupo definido en el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.3",
        "ifc006-mf058-p-sections"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "section-group-footer",
      "grade": 5,
      "label": "Pie de grupo",
      "match": "pies? de grupos?",
      "relation": "la ubicación de los datos solicitados al cierre de cada grupo definido en el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.3",
        "ifc006-mf058-p-sections"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "format-dates",
      "grade": 5,
      "label": "Formato de fechas",
      "match": "formatos? de fechas",
      "relation": "la correspondencia entre la presentación de las fechas y el estilo indicado, conservando sus valores originales",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.4",
        "ifc006-mf058-p-data-format"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "format-numbers",
      "grade": 5,
      "label": "Formato numérico",
      "match": "formatos? de numeros",
      "relation": "la correspondencia entre la presentación numérica y el estilo indicado, conservando los valores de origen",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.4",
        "ifc006-mf058-p-data-format"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "format-currency",
      "grade": 5,
      "label": "Formato de monedas",
      "match": "formatos? de monedas",
      "relation": "la correspondencia entre la presentación de las cantidades monetarias y el estilo indicado, sin alterar sus valores",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.4",
        "ifc006-mf058-p-data-format"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "format-thousands",
      "grade": 5,
      "label": "Separación de millares",
      "match": "formatos? de separacion de millares",
      "relation": "la correspondencia entre los separadores de millares mostrados y el estilo indicado, sin modificar las cantidades originales",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.4",
        "ifc006-mf058-p-data-format"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "format-percentages",
      "grade": 5,
      "label": "Formato de porcentajes",
      "match": "formatos? de porcentajes",
      "relation": "la correspondencia entre la presentación porcentual y el estilo indicado, conservando el valor que representa cada dato",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.4",
        "ifc006-mf058-p-data-format"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "text-style",
      "grade": 5,
      "label": "Estilo de textos",
      "match": "estilo y formato de (?:los )?textos",
      "relation": "la correspondencia entre el estilo de los textos del reporte y la guía visual proporcionada",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.4",
        "ifc006-mf058-p-text-style"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "column-width",
      "grade": 5,
      "label": "Ancho de columnas",
      "match": "ancho de (?:las )?columnas",
      "relation": "la correspondencia entre el ancho de las columnas, los datos visibles y el diseño solicitado para el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-p-text-style"
      ],
      "pages": [
        39
      ]
    },
    {
      "id": "groups",
      "grade": 5,
      "label": "Grupos de datos",
      "match": "grupos de datos",
      "relation": "la correspondencia entre el campo de agrupación indicado y los registros incluidos en cada grupo del reporte",
      "sourceRecordIds": [
        "ifc006-mf058-p-groups"
      ],
      "pages": [
        39
      ]
    },
    {
      "id": "totals",
      "grade": 5,
      "label": "Totales y subtotales",
      "match": "subtotales?|totales?(?! diarios?\\b| general(?:es)?\\b)",
      "relation": "la correspondencia entre los totales y subtotales solicitados y los registros que debe resumir cada uno",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.2.5"
      ],
      "pages": [
        38
      ],
      "facets": [
        {
          "id": "total",
          "label": "Totales del reporte",
          "match": "\\btotales?\\b",
          "relation": "la correspondencia entre los totales solicitados y la suma de los registros que deben resumir"
        },
        {
          "id": "subtotal",
          "label": "Subtotales del reporte",
          "match": "\\bsubtotales?\\b",
          "relation": "la correspondencia entre cada subtotal solicitado y los registros incluidos en su grupo"
        }
      ]
    },
    {
      "id": "daily-totals",
      "grade": 5,
      "label": "Totales diarios",
      "match": "totales diarios",
      "relation": "la correspondencia entre los totales de cada día y los registros y fechas proporcionados, sin exigir un total general",
      "sourceRecordIds": [
        "ifc006-mf058-p-totals"
      ],
      "pages": [
        39
      ]
    },
    {
      "id": "general-total",
      "grade": 5,
      "label": "Total general",
      "match": "total general",
      "relation": "la correspondencia entre el total general y el conjunto de registros ficticios proporcionados, sin exigir un desglose diario",
      "sourceRecordIds": [
        "ifc006-mf058-p-totals"
      ],
      "pages": [
        39
      ]
    },
    {
      "id": "filters",
      "grade": 5,
      "label": "Filtro del reporte",
      "match": "filtros?",
      "relation": "la correspondencia entre la condición del filtro y los registros que permanecen visibles en el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-p-filters"
      ],
      "pages": [
        39
      ]
    },
    {
      "id": "data-order",
      "grade": 5,
      "label": "Orden de datos",
      "match": "ordena (?:los )?datos|ordenar (?:los )?datos",
      "relation": "la correspondencia entre el campo y sentido de ordenación indicados y la secuencia de los registros, sin perder datos",
      "sourceRecordIds": [
        "ifc006-mf058-c-sections-functions"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "data-manipulation",
      "grade": 5,
      "label": "Modificación de datos",
      "match": "modifica (?:los )?datos|modificar (?:los )?datos",
      "relation": "la correspondencia entre los cambios indicados en los datos de práctica y su efecto en los valores mostrados por el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-p-data-manipulation"
      ],
      "pages": [
        39
      ]
    },
    {
      "id": "charts",
      "grade": 5,
      "label": "Reporte gráfico",
      "match": "reportes? graficos?|graficos? de datos",
      "relation": "la correspondencia entre las categorías y valores proporcionados y su representación en el reporte gráfico solicitado",
      "sourceRecordIds": [
        "ifc006-mf058-p-charts"
      ],
      "pages": [
        39
      ]
    },
    {
      "id": "formulas",
      "grade": 5,
      "label": "Fórmula del reporte",
      "match": "formulas?",
      "relation": "la correspondencia entre la fórmula indicada, los datos de entrada y el resultado esperado en el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-p-formulas"
      ],
      "pages": [
        39
      ],
      "requires": "reporte|informe"
    },
    {
      "id": "functions",
      "grade": 5,
      "label": "Función del reporte",
      "match": "funcion(?:es)?",
      "relation": "la correspondencia entre la función solicitada, sus argumentos y el resultado esperado en el reporte",
      "sourceRecordIds": [
        "ifc006-mf058-p-functions"
      ],
      "pages": [
        39
      ],
      "requires": "reporte|informe"
    },
    {
      "id": "messages",
      "grade": 5,
      "label": "Mensajes por eventos",
      "match": "mensajes?",
      "relation": "la correspondencia entre el evento indicado del reporte y el mensaje configurado como respuesta en la práctica",
      "sourceRecordIds": [
        "ifc006-mf058-p-messages"
      ],
      "pages": [
        39
      ]
    },
    {
      "id": "function-types",
      "grade": 5,
      "label": "Tipos de funciones",
      "match": "tipos de funciones",
      "relation": "la correspondencia entre la clasificación de las funciones de las fichas y el uso que corresponde a cada tipo",
      "sourceRecordIds": [
        "ifc006-mf058-c-sections-functions"
      ],
      "pages": [
        38,
        39
      ],
      "suppresses": [
        "functions"
      ]
    },
    {
      "id": "hierarchies",
      "grade": 5,
      "label": "Jerarquía de información",
      "match": "jerarquia",
      "relation": "la relación entre los niveles de la jerarquía proporcionada y la información que agrupa cada nivel del reporte",
      "sourceRecordIds": [
        "ifc006-mf058-c-sections-functions"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "recursion",
      "grade": 5,
      "label": "Recursividad del reporte",
      "match": "recursividad",
      "relation": "la relación entre los pasos recursivos del ejemplo, los datos tratados y la condición que permite terminar el proceso",
      "sourceRecordIds": [
        "ifc006-mf058-c-sections-functions"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "procedures",
      "grade": 5,
      "label": "Procedimiento del reporte",
      "match": "procedimiento proporcionado del reporte",
      "relation": "la correspondencia entre la secuencia del procedimiento proporcionado, los datos ficticios y su resultado",
      "sourceRecordIds": [
        "ifc006-mf058-c-sections-functions"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "matrices-lists",
      "grade": 5,
      "label": "Matrices y listas",
      "match": "matri(?:z|ces)|listas?",
      "relation": "la correspondencia entre los mismos datos de origen y su organización en la matriz y la lista proporcionadas del reporte",
      "facets": [
        {"id":"matrix","label":"Matriz del reporte","match":"\\bmatri(?:z|ces)\\b","relation":"la correspondencia entre los datos de origen y su organización en las filas y columnas de la matriz proporcionada del reporte"},
        {"id":"list","label":"Lista del reporte","match":"\\blistas?\\b","relation":"la correspondencia entre los datos de origen y su organización en los elementos de la lista proporcionada del reporte"}
      ],
      "sourceRecordIds": [
        "ifc006-mf058-c-sections-functions"
      ],
      "pages": [
        38,
        39
      ],
      "requires": "reporte|informe"
    },
    {
      "id": "access-mechanism",
      "grade": 5,
      "label": "Acceso al reporte",
      "match": "mecanismos? de acceso (?:al|a los) reportes?",
      "relation": "la correspondencia entre el acceso local configurado y la forma de consultar el reporte solicitada por el usuario ficticio, sin habilitar acceso público",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.3.1",
        "ifc006-mf058-p-access"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "output-print",
      "grade": 5,
      "label": "Salida de impresión",
      "match": "salida de impresion",
      "relation": "la correspondencia entre el tamaño, orientación y contenido solicitados y la vista previa de impresión del reporte, sin exigir impresora física",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.3.2",
        "ifc006-mf058-p-access"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "output-screen",
      "grade": 5,
      "label": "Salida en pantalla",
      "match": "muestra en pantalla|mostrar en pantalla",
      "relation": "la correspondencia entre los datos visibles en pantalla y las informaciones requeridas para el reporte de práctica",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.3.2",
        "ifc006-mf058-c-sections-functions"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "output-web-simulation",
      "grade": 5,
      "label": "Salida web simulada",
      "match": "salida web",
      "relation": "la correspondencia entre el contenido solicitado y la salida web del reporte en la simulación local, sin publicación en internet ni servicios externos",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.3.2",
        "ifc006-mf058-p-access"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "output-storage",
      "grade": 5,
      "label": "Almacenamiento del reporte",
      "match": "almacena (?:el )?reporte|almacenar (?:el )?reporte",
      "relation": "la correspondencia entre el archivo local guardado, la ubicación indicada y el contenido que debe conservar el reporte al abrirse",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.3.2",
        "ifc006-mf058-p-access"
      ],
      "pages": [
        38,
        39
      ]
    },
    {
      "id": "output-cd-simulation",
      "grade": 5,
      "label": "Grabación simulada en disco",
      "match": "disco compacto",
      "relation": "la correspondencia entre el mecanismo de acceso previsto y la grabación simulada del reporte en el disco compacto del caso, sin exigir dispositivo físico",
      "sourceRecordIds": [
        "ifc006-mf058-CE6.3.1"
      ],
      "pages": [
        38
      ]
    }
  ]
}
