import type {TechnicalModule} from './secondary-technical'

/** AulaBase adaptations from IFC007 PDF54–66, corroborated by IFC006 PDF49–55.
 * Literal records and documentary conditions remain in the source matrix. */
export const technicalMf002Four:TechnicalModule={
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
      "match": "documentos? de texto|documentos? (?:de|en) (?:microsoft )?word|procesador de textos|procesador de palabras",
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
      "match": "fuente|fuentes (?:tipograficas|de letra)|parrafos?|sangrias?|tabulaciones?|formato de texto|interlineado|arial|calibri|times new roman",
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
}
