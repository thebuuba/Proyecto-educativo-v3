import type {EvaluationCatalog} from './catalog-current'
import {evaluationCatalogV149} from './catalog-v149'
/** Catálogo 150 contrastado con Development antes de la auditoría realista; no reescribir. */
export const evaluationCatalogV150={...evaluationCatalogV149,version:'evaluation-2026.150',technicalModules:[...evaluationCatalogV149.technicalModules!,{
  "id": "mf060-6",
  "programCode": "IFC006_3",
  "moduleCode": "MF_060_3",
  "grade": 6,
  "cycle": 2,
  "modalityCode": "technical_professional",
  "subjectName": "Desarrollo e Implementación de Soluciones Web y Multimedia",
  "sourceScopeId": "ifc006-mf060-6",
  "pdfPages": [
    42,
    43,
    44,
    45,
    46,
    47
  ],
  "policy": "REQUESTED_WEB_MULTIMEDIA_AND_BUSINESS_TECHNOLOGY_ACTIONS_FICTITIOUS_PRACTICE_NO_REAL_DEPLOYMENT_V1",
  "templatePrefix": "technical-mf060",
  "additionalVerbs": "anad(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|instal(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|seleccion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|explic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|realiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|simul(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|defin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|identific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|document(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|integr(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|confirm(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|inclu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|public(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|program(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|configur(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|verific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|comprueb(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|cre(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|utiliz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|utilic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|describ(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|establec(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|indic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|ejecut(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|redact(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|prepar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|diferenci(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|analiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|examin(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|reproduzc(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|reproduc(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|organiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|present(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|aplic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|apliqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|elabor(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|compar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|propong(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|propon(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|construy(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|constru(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|adapt(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|argument(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|desarroll(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|relacion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|pid(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|requier(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|solicit(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)",
  "topics": [
    {
      "id": "language-selection",
      "grade": 6,
      "label": "Lenguaje de programación web",
      "match": "lenguaje de programacion web",
      "relation": "la adecuación del lenguaje elegido a las especificaciones del diseño y los requisitos proporcionados",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.1.1"
      ],
      "pages": [
        42
      ],
      "requires": "seleccion|elige|elegir"
    },
    {
      "id": "compatibility-tests",
      "grade": 6,
      "label": "Pruebas de compatibilidad",
      "match": "pruebas de compatibilidad",
      "relation": "la correspondencia entre los casos de prueba, las condiciones del sistema y software de práctica y los resultados esperados",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.1.2"
      ],
      "pages": [
        42
      ]
    },
    {
      "id": "required-application",
      "grade": 6,
      "label": "Instalación complementaria",
      "match": "instalacion de (?:la )?aplicacion complementaria|instala (?:la |una )?aplicacion(?:es)? complementarias?",
      "relation": "la secuencia de instalación indicada en el entorno de práctica conforme a las prescripciones de la ficha, sin exigir componentes obsoletos en equipos reales",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.1.3"
      ],
      "pages": [
        42,
        43
      ]
    },
    {
      "id": "browser-selection",
      "grade": 6,
      "label": "Navegadores de prueba",
      "match": "navegadores",
      "relation": "la adecuación de los navegadores seleccionados a los requisitos y casos de prueba proporcionados",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.1.3"
      ],
      "pages": [
        42,
        43
      ],
      "requires": "seleccion|elige",
      "exclude": "herramientas? de depuracion"
    },
    {
      "id": "test-environment",
      "grade": 6,
      "label": "Entornos de prueba",
      "match": "entornos? de pruebas?",
      "relation": "la correspondencia entre las condiciones definidas para el entorno de prueba y los requisitos de la aplicación del caso",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.1.3"
      ],
      "pages": [
        42,
        43
      ]
    },
    {
      "id": "test-parameters",
      "grade": 6,
      "label": "Parámetros que verificar",
      "match": "parametros[^.;]*verificar(?:se)?",
      "relation": "la correspondencia entre los parámetros identificados y las condiciones de funcionamiento que requieren las pruebas de la aplicación",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.1.3"
      ],
      "pages": [
        42,
        43
      ]
    },
    {
      "id": "process-documentation",
      "grade": 6,
      "label": "Documentación de procesos",
      "match": "documenta[^.;]*procesos|documentacion de (?:los )?procesos",
      "relation": "la fidelidad del registro de los procesos realizados al procedimiento proporcionado para la empresa ficticia",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.1.3",
        "ifc006-mf060-p-process-documentation"
      ],
      "pages": [
        42,
        43,
        45
      ]
    },
    {
      "id": "query-integration",
      "grade": 6,
      "label": "Integración de consulta",
      "match": "consultas?",
      "relation": "la correspondencia entre la consulta integrada, sus campos y condiciones y las especificaciones del diseño web",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.1"
      ],
      "pages": [
        43
      ],
      "requires": "integr"
    },
    {
      "id": "search-integration",
      "grade": 6,
      "label": "Integración de búsqueda",
      "match": "busquedas?",
      "relation": "la correspondencia entre los criterios de la búsqueda integrada y los resultados ficticios requeridos por el diseño web",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.1"
      ],
      "pages": [
        43
      ],
      "requires": "integr"
    },
    {
      "id": "database-integration",
      "grade": 6,
      "label": "Integración de base de datos",
      "match": "bases? de datos",
      "relation": "la correspondencia entre la base de práctica integrada, su esquema y los datos requeridos por el diseño web",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.1"
      ],
      "pages": [
        43
      ],
      "requires": "integr"
    },
    {
      "id": "browser-compatibility",
      "grade": 6,
      "label": "Compatibilidad del diseño",
      "match": "compatibilidad (?:del|de) diseno web",
      "relation": "la correspondencia entre el comportamiento del diseño en los navegadores indicados y los requisitos de los usuarios ficticios",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.2"
      ],
      "pages": [
        43
      ],
      "requires": "confirma|verific|comprueb"
    },
    {
      "id": "search-engine-selection",
      "grade": 6,
      "label": "Buscadores para las páginas",
      "match": "buscadores",
      "relation": "la adecuación de los buscadores elegidos a las características de las páginas ficticias y los requisitos de las fichas",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.2"
      ],
      "pages": [
        43
      ],
      "requires": "seleccion|elige"
    },
    {
      "id": "descriptors",
      "grade": 6,
      "label": "Descriptores y etiquetas",
      "match": "descriptores",
      "relation": "la correspondencia entre los descriptores solicitados, el contenido de la página y las etiquetas empleadas en el ejemplo",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.2"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "automatic-publication-simulation",
      "grade": 6,
      "label": "Publicación automática simulada",
      "match": "publicacion automatica",
      "relation": "la correspondencia entre las páginas, la herramienta y el procedimiento de publicación automática solicitado en la simulación, sin publicación real",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.2",
        "ifc006-mf060-p-publication-tools"
      ],
      "pages": [
        43,
        45
      ]
    },
    {
      "id": "manual-publication-simulation",
      "grade": 6,
      "label": "Publicación manual simulada",
      "match": "publicacion manual",
      "relation": "la secuencia manual prevista para las páginas excluidas del procedimiento automático, respetando el procedimiento y la seguridad del caso ficticio",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.2",
        "ifc006-mf060-p-publication-procedures"
      ],
      "pages": [
        43,
        45
      ]
    },
    {
      "id": "periodic-functionality",
      "grade": 6,
      "label": "Comprobación periódica",
      "match": "funcionalidad[^.;]*periodos|periodic[^.;]*funcionalidad",
      "relation": "la correspondencia entre los períodos de comprobación indicados, los registros proporcionados y la funcionalidad observada de la página de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.2"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "element-programming",
      "grade": 6,
      "label": "Programación del elemento web",
      "match": "programa(?:r)?",
      "relation": "la correspondencia entre el código del elemento solicitado, su enlace y las especificaciones del diseño web",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.3"
      ],
      "pages": [
        43
      ],
      "requires": "elemento"
    },
    {
      "id": "element-configuration",
      "grade": 6,
      "label": "Configuración del elemento web",
      "match": "configura(?:r)?",
      "relation": "la correspondencia entre las opciones y el enlace configurados para el elemento y el diseño web proporcionado",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.3"
      ],
      "pages": [
        43
      ],
      "requires": "elemento"
    },
    {
      "id": "component-functionality",
      "grade": 6,
      "label": "Funcionamiento del componente",
      "match": "funcionamiento del componente",
      "relation": "la correspondencia entre la respuesta del componente añadido y las especificaciones del diseño y software de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "component-quality",
      "grade": 6,
      "label": "Calidad del componente",
      "match": "criterios de calidad",
      "relation": "la correspondencia entre las evidencias del componente web y los criterios de calidad proporcionados, sin añadir dimensiones no solicitadas",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "component-usability",
      "grade": 6,
      "label": "Usabilidad del componente",
      "match": "usabilidad",
      "relation": "la correspondencia entre los resultados de los casos de uso y los criterios de usabilidad proporcionados, sin calificar preferencias estéticas personales",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "debugging-tools",
      "grade": 6,
      "label": "Herramienta de depuración",
      "match": "herramientas? de depuracion",
      "relation": "la adecuación de la herramienta del navegador elegida al fallo y las condiciones descritas en las fichas",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ],
      "requires": "seleccion|elige"
    },
    {
      "id": "debugging-functions",
      "grade": 6,
      "label": "Función de depuración",
      "match": "funcion(?:es)? de depuracion",
      "relation": "la correspondencia entre la función de depuración, el fallo indicado y la información que permite comprobar en el código de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ],
      "relationsByMode": {
        "creation": "la correspondencia entre la estructura de la función creada, el fallo indicado y la información que debe permitir obtener en el código de práctica",
        "application": "la correspondencia entre el uso de la función proporcionada, la información obtenida y el fallo del código de práctica que permite comprobar"
      }
    },
    {
      "id": "image-complement",
      "grade": 6,
      "label": "Complemento para imágenes",
      "match": "complementos? para imagenes",
      "relation": "la función del complemento de imágenes descrito en la ficha y su relación con el contenido del navegador de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "music-complement",
      "grade": 6,
      "label": "Complemento para música",
      "match": "complementos? para musica",
      "relation": "la función del complemento de música descrito en la ficha y su relación con el contenido del ejemplo web",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "video-complement",
      "grade": 6,
      "label": "Complemento para video",
      "match": "complementos? para video",
      "relation": "la función del complemento de video descrito en la ficha y su relación con el contenido del ejemplo web",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "content-complement",
      "grade": 6,
      "label": "Complemento para contenidos",
      "match": "complementos? para contenidos",
      "relation": "la función del complemento descrito y su relación con los contenidos del navegador y la aplicación de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "virtual-machine",
      "grade": 6,
      "label": "Máquina virtual del entorno",
      "match": "maquinas? virtual(?:es)?",
      "relation": "la función de la máquina virtual en el esquema proporcionado del entorno web, sin exigir crear máquinas o cambiar la seguridad del equipo",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.2.4"
      ],
      "pages": [
        43
      ]
    },
    {
      "id": "server-installation-simulation",
      "grade": 6,
      "label": "Instalación del diseño web",
      "match": "instalacion (?:del|de) diseno web|instala (?:el |un )?diseno web",
      "relation": "la secuencia de instalación acordada para el servidor de práctica, conforme al diseño y las condiciones proporcionadas por el cliente ficticio",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.1",
        "ifc006-mf060-p-deployment"
      ],
      "pages": [
        43,
        44,
        45
      ],
      "requires": "servidor"
    },
    {
      "id": "installation-requirements",
      "grade": 6,
      "label": "Requisitos de instalación y distribución",
      "match": "requisitos de instalacion y distribucion",
      "relation": "la correspondencia entre los requisitos establecidos y las condiciones proporcionadas para instalar y distribuir la aplicación de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.1"
      ],
      "pages": [
        43,
        44
      ]
    },
    {
      "id": "server-directories",
      "grade": 6,
      "label": "Directorios del servidor",
      "match": "directorios",
      "relation": "la correspondencia entre la estructura definida, las ubicaciones de documentos y componentes y las necesidades de la aplicación en el servidor simulado",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.1"
      ],
      "pages": [
        43,
        44
      ]
    },
    {
      "id": "affected-resources",
      "grade": 6,
      "label": "Recursos afectados",
      "match": "recursos afectados",
      "relation": "la correspondencia entre los recursos identificados en el inventario y los cambios que introduce el desarrollo web del caso",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.1"
      ],
      "pages": [
        43,
        44
      ]
    },
    {
      "id": "server-services",
      "grade": 6,
      "label": "Servicios del servidor",
      "match": "servicios necesarios",
      "relation": "la correspondencia entre los servicios identificados para el servidor simulado y las funciones que necesita ejecutar la aplicación web",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.1"
      ],
      "pages": [
        43,
        44
      ]
    },
    {
      "id": "configuration-parameters",
      "grade": 6,
      "label": "Parámetros de configuración",
      "match": "parametros de configuracion",
      "relation": "la correspondencia entre los parámetros especificados, el entorno o entornos expresamente solicitados y las condiciones del diseño de práctica, sin credenciales reales",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.1"
      ],
      "pages": [
        43,
        44
      ]
    },
    {
      "id": "security-parameters",
      "grade": 6,
      "label": "Parámetros de seguridad",
      "match": "parametros de seguridad",
      "relation": "la correspondencia entre los parámetros de seguridad especificados y los requisitos de acceso y protección del caso ficticio",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.1"
      ],
      "pages": [
        43,
        44
      ]
    },
    {
      "id": "installation-packages",
      "grade": 6,
      "label": "Paquete de instalación",
      "match": "paquetes? de instalacion",
      "relation": "la correspondencia entre el contenido y opciones del paquete de práctica y las condiciones de instalación y distribución solicitadas",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.1"
      ],
      "pages": [
        43,
        44
      ]
    },
    {
      "id": "installation-verification",
      "grade": 6,
      "label": "Verificación de instalación y distribución",
      "match": "(?:verifica|comprueba)[^.;]{0,40}instalacion|verificacion (?:del proceso de )?instalacion",
      "relation": "la correspondencia entre los resultados del proceso o procesos solicitados y los requisitos y resultados esperados proporcionados para la práctica",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.1"
      ],
      "pages": [
        43,
        44
      ],
      "requires": "verific|comprueb"
    },
    {
      "id": "execution",
      "grade": 6,
      "label": "Ejecución del diseño web",
      "match": "ejecuta (?:el )?diseno web|ejecutar (?:el )?diseno web",
      "relation": "la secuencia de ejecución en el entorno de práctica conforme al procedimiento técnico y las condiciones indicadas",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.2"
      ],
      "pages": [
        44
      ]
    },
    {
      "id": "database-storage-tests",
      "grade": 6,
      "label": "Pruebas de almacenamiento",
      "match": "pruebas de almacenamiento",
      "relation": "la correspondencia entre los datos ficticios enviados por la aplicación, los valores almacenados en la base de práctica y los parámetros esperados",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.2"
      ],
      "pages": [
        44
      ]
    },
    {
      "id": "user-training",
      "grade": 6,
      "label": "Entrenamiento simulado",
      "match": "entrenamiento",
      "relation": "la correspondencia entre la explicación o demostración del uso de la aplicación en el entrenamiento simulado y los requisitos del usuario ficticio",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.3"
      ],
      "pages": [
        44
      ],
      "requires": "realiza|simula|imparte"
    },
    {
      "id": "user-instructions",
      "grade": 6,
      "label": "Instrucciones para el usuario",
      "match": "instrucciones de ejecucion|instrucciones[^.;]*aplicacion",
      "relation": "la correspondencia entre los pasos de las instrucciones redactadas y la ejecución de la aplicación que necesita realizar el usuario ficticio",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.3.3"
      ],
      "pages": [
        44
      ],
      "requires": "redact|prepar|elabor|escrib"
    },
    {
      "id": "business-characteristics",
      "grade": 6,
      "label": "Gestión empresarial",
      "match": "(?:caracteristicas|tipos)(?: y tipos)? de gestion empresarial",
      "relation": "la correspondencia entre las características y tipos identificados y los datos de las organizaciones ficticias de las fichas",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.4.1",
        "ifc006-mf060-p-business-management",
        "ifc006-mf060-c-history-business"
      ],
      "pages": [
        44,
        45
      ],
      "facets": [
        {
          "id": "characteristics",
          "label": "Características de gestión empresarial",
          "match": "\\bcaracteristicas\\b",
          "relation": "la correspondencia entre las características identificadas y los datos de las organizaciones ficticias de las fichas"
        },
        {
          "id": "types",
          "label": "Tipos de gestión empresarial",
          "match": "\\btipos\\b",
          "relation": "la correspondencia entre la clasificación de gestión empresarial y los datos de las organizaciones ficticias de las fichas"
        }
      ]
    },
    {
      "id": "institutional-objectives",
      "grade": 6,
      "label": "Componentes institucionales",
      "match": "meta|vision|mision|objetivos institucionales",
      "relation": "la distinción entre las funciones de los componentes institucionales solicitados y los ejemplos proporcionados de la empresa ficticia",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.4.1",
        "ifc006-mf060-p-institutional-objectives",
        "ifc006-mf060-c-history-business"
      ],
      "pages": [
        44,
        45
      ]
    },
    {
      "id": "automation-requirements",
      "grade": 6,
      "label": "Requerimientos de automatización",
      "match": "requerimientos de automatizacion",
      "relation": "la relación entre los procesos institucionales descritos, sus necesidades y los requerimientos de automatización respaldados por los datos ficticios",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.4.1",
        "ifc006-mf060-p-institutional-processes"
      ],
      "pages": [
        44,
        45
      ]
    },
    {
      "id": "technology-update-sources",
      "grade": 6,
      "label": "Medios de actualización tecnológica",
      "match": "medios de actualizacion tecnologica|fuente pertinente",
      "relation": "la adecuación del medio o fuente de actualización al problema y las condiciones del caso, sin exigir compras, visitas o consultas reales",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.4.2",
        "ifc006-mf060-p-technology-updates",
        "ifc006-mf060-c-updates-proposals"
      ],
      "pages": [
        44,
        46
      ]
    },
    {
      "id": "weaknesses-threats",
      "grade": 6,
      "label": "Debilidades y amenazas tecnológicas",
      "match": "debilidades y amenazas",
      "relation": "la correspondencia entre las debilidades y amenazas identificadas y las evidencias de la implementación tecnológica del caso",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.4.3",
        "ifc006-mf060-p-weaknesses-threats"
      ],
      "pages": [
        44,
        46
      ]
    },
    {
      "id": "technology-timing",
      "grade": 6,
      "label": "Tecnología y horizonte temporal",
      "match": "horizonte temporal",
      "relation": "la adecuación de la tecnología definida al horizonte temporal y las necesidades del caso, usando las características proporcionadas en las fichas",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.4.4"
      ],
      "pages": [
        44
      ]
    },
    {
      "id": "forum-analysis",
      "grade": 6,
      "label": "Intercambio sobre nuevas tecnologías",
      "match": "foro de intercambio",
      "relation": "la relación entre la forma de participación descrita, el intercambio de conocimiento y la conversación ficticia proporcionada, sin exigir publicar o crear cuentas",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.5.1"
      ],
      "pages": [
        44
      ]
    },
    {
      "id": "improvement-scenarios",
      "grade": 6,
      "label": "Escenario de mejora tecnológica",
      "match": "escenario simulado",
      "relation": "la correspondencia entre los cambios representados en el escenario, la tecnología indicada y la mejora del proceso empresarial respaldada por los datos ficticios",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.5.2",
        "ifc006-mf060-p-use-scenarios"
      ],
      "pages": [
        44,
        46
      ]
    },
    {
      "id": "implementation-organization",
      "grade": 6,
      "label": "Organización de la implementación",
      "match": "organiza (?:la )?implementacion|organizacion de la implementacion",
      "relation": "la correspondencia entre la secuencia de implementación propuesta, las dependencias y los recursos proporcionados para la empresa ficticia",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.5.3"
      ],
      "pages": [
        44
      ]
    },
    {
      "id": "planning-meeting",
      "grade": 6,
      "label": "Planificación en reunión simulada",
      "match": "reunion simulada",
      "relation": "la correspondencia entre la planificación presentada en la reunión simulada, la solución elegida y las condiciones de implementación del caso",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.6.1"
      ],
      "pages": [
        44
      ]
    },
    {
      "id": "scheduled-task",
      "grade": 6,
      "label": "Tarea del cronograma",
      "match": "tarea asignada",
      "relation": "la correspondencia entre la tarea realizada en la simulación, su posición en el cronograma y las dependencias y condiciones proporcionadas",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.6.2"
      ],
      "pages": [
        44
      ]
    },
    {
      "id": "progress-report",
      "grade": 6,
      "label": "Reporte de avance",
      "match": "reporte de avance",
      "relation": "la fidelidad del reporte a los avances y tareas documentados en los registros ficticios de implementación, sin inventar trabajo realizado",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.6.3"
      ],
      "pages": [
        44
      ]
    },
    {
      "id": "progress-minutes",
      "grade": 6,
      "label": "Minuta de seguimiento",
      "match": "minuta",
      "relation": "la fidelidad de la minuta a los acuerdos, responsables y seguimiento descritos en la reunión ficticia proporcionada",
      "sourceRecordIds": [
        "ifc006-mf060-CE8.6.3"
      ],
      "pages": [
        44
      ]
    },
    {
      "id": "development-policies",
      "grade": 6,
      "label": "Política de desarrollo y pruebas",
      "match": "politica de desarrollo y pruebas",
      "relation": "la distinción entre desarrollo, preproducción y producción y la adecuación de las reglas propuestas al caso web ficticio, sin cambiar entornos reales",
      "sourceRecordIds": [
        "ifc006-mf060-p-development-policies"
      ],
      "pages": [
        44,
        45
      ]
    },
    {
      "id": "style-resources",
      "grade": 6,
      "label": "Hojas de estilo",
      "match": "hojas de estilo",
      "relation": "la correspondencia entre la ubicación de las hojas de estilo, la estructura solicitada y las referencias que debe conservar la aplicación de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-p-resources",
        "ifc006-mf060-c-resources-components"
      ],
      "pages": [
        44,
        45
      ]
    },
    {
      "id": "configuration-resources",
      "grade": 6,
      "label": "Ficheros de configuración",
      "match": "ficheros de configuracion",
      "relation": "la correspondencia entre la ubicación de los ficheros de práctica y el esquema indicado, sin incorporar secretos o credenciales reales",
      "sourceRecordIds": [
        "ifc006-mf060-p-resources",
        "ifc006-mf060-c-resources-components"
      ],
      "pages": [
        44,
        45
      ]
    },
    {
      "id": "image-resources",
      "grade": 6,
      "label": "Imágenes de la aplicación",
      "match": "imagenes proporcionadas",
      "relation": "la correspondencia entre las rutas de las imágenes proporcionadas y las referencias que debe conservar la aplicación de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-p-resources",
        "ifc006-mf060-c-resources-components"
      ],
      "pages": [
        44,
        45
      ]
    },
    {
      "id": "document-resources",
      "grade": 6,
      "label": "Documentos de la aplicación",
      "match": "documentos proporcionados",
      "relation": "la correspondencia entre la ubicación de los documentos proporcionados y las rutas solicitadas para la aplicación de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-p-resources",
        "ifc006-mf060-c-resources-components"
      ],
      "pages": [
        44,
        45
      ]
    },
    {
      "id": "library-resources",
      "grade": 6,
      "label": "Bibliotecas de componentes",
      "match": "bibliotecas de componentes",
      "relation": "la correspondencia entre la organización de las bibliotecas proporcionadas y sus dependencias y referencias en el proyecto de práctica",
      "sourceRecordIds": [
        "ifc006-mf060-p-resources",
        "ifc006-mf060-c-resources-components"
      ],
      "pages": [
        44,
        45
      ]
    },
    {
      "id": "security-levels",
      "grade": 6,
      "label": "Niveles de seguridad",
      "match": "niveles de seguridad",
      "relation": "la relación entre los niveles de seguridad, los permisos y los recursos ficticios descritos en las fichas, sin suponer acceso universal",
      "sourceRecordIds": [
        "ifc006-mf060-c-resources-components"
      ],
      "pages": [
        44,
        45
      ]
    },
    {
      "id": "programming-standards",
      "grade": 6,
      "label": "Estándares de programación web",
      "match": "estandares de programacion web",
      "relation": "la correspondencia entre el fragmento de código ajustado y los estándares concretos proporcionados para la práctica",
      "sourceRecordIds": [
        "ifc006-mf060-p-standards"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "identification",
      "grade": 6,
      "label": "Identificación en el caso web",
      "match": "tecnica de identificacion",
      "relation": "la correspondencia entre los identificadores ficticios proporcionados y el sujeto identificado en el caso web",
      "sourceRecordIds": [
        "ifc006-mf060-p-access-techniques"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "authentication",
      "grade": 6,
      "label": "Autenticación simulada",
      "match": "tecnica de autenticacion",
      "relation": "la correspondencia entre la evidencia de identidad presentada en el simulador y las condiciones de autenticación del caso, sin cuentas o credenciales reales",
      "sourceRecordIds": [
        "ifc006-mf060-p-access-techniques"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "authorization",
      "grade": 6,
      "label": "Autorización de acceso",
      "match": "control de autorizacion",
      "relation": "la correspondencia entre el rol ficticio, la acción solicitada y el acceso permitido o denegado por la matriz proporcionada",
      "sourceRecordIds": [
        "ifc006-mf060-p-access-techniques"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "certificates",
      "grade": 6,
      "label": "Certificado digital del ejemplo",
      "match": "certificado digital",
      "relation": "la relación entre los datos del certificado proporcionado y la identificación y autenticación descritas en el caso, sin emitir certificados ni compartir claves",
      "sourceRecordIds": [
        "ifc006-mf060-p-certificates"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "deployment-characteristics",
      "grade": 6,
      "label": "Características del despliegue",
      "match": "caracteristicas del proceso de despliegue",
      "relation": "la correspondencia entre las características descritas y las etapas y condiciones del despliegue simulado de la ficha",
      "sourceRecordIds": [
        "ifc006-mf060-p-deployment-characteristics"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "publication-procedures",
      "grade": 6,
      "label": "Procedimientos de publicación",
      "match": "procedimientos empresariales y de seguridad",
      "relation": "la relación entre el procedimiento de publicación descrito, las responsabilidades empresariales y las condiciones de seguridad del caso ficticio",
      "sourceRecordIds": [
        "ifc006-mf060-p-publication-procedures"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "domain-hierarchy",
      "grade": 6,
      "label": "Jerarquía de dominios",
      "match": "jerarquia de (?:los )?dominios",
      "relation": "la correspondencia entre los niveles de la jerarquía representada y los dominios ficticios proporcionados",
      "sourceRecordIds": [
        "ifc006-mf060-c-domains"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "dns",
      "grade": 6,
      "label": "Resolución DNS",
      "match": "dns",
      "relation": "la relación entre el nombre de dominio ficticio, la función del servicio DNS y el recorrido de resolución proporcionado",
      "sourceRecordIds": [
        "ifc006-mf060-c-domains"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "network-scopes",
      "grade": 6,
      "label": "Ámbitos de red",
      "match": "intranet|extranet|(?:alcance|ambito) de (?:la )?internet|(?:explica|describe|compara) (?:el |la )?internet(?! explorer)",
      "relation": "la relación entre el alcance de las redes solicitadas y las consideraciones de acceso y seguridad proporcionadas para el caso",
      "sourceRecordIds": [
        "ifc006-mf060-c-domains"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "firewall",
      "grade": 6,
      "label": "Regla de cortafuegos",
      "match": "cortafuegos",
      "relation": "la adecuación de la regla propuesta al servicio ficticio y los requisitos de acceso del caso, sin modificar reglas reales",
      "sourceRecordIds": [
        "ifc006-mf060-c-domains"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "ict-history",
      "grade": 6,
      "label": "Evolución de las TIC",
      "match": "evolucion de las tic",
      "relation": "la relación entre los hitos de evolución tecnológica, sus fechas proporcionadas y los cambios descritos en las fuentes",
      "sourceRecordIds": [
        "ifc006-mf060-c-history-business"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "business-ict-strategy",
      "grade": 6,
      "label": "Estrategia empresarial y TIC",
      "match": "estrategia empresarial y las tic",
      "relation": "la relación entre las metas de la estrategia empresarial, los procesos descritos y las funciones de las TIC en el caso",
      "sourceRecordIds": [
        "ifc006-mf060-c-history-business"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "ict-service-cases",
      "grade": 6,
      "label": "TIC y servicios del negocio",
      "match": "tic fortalecieron",
      "relation": "la correspondencia entre la intervención de las TIC y el fortalecimiento de los servicios respaldado por las evidencias del caso ficticio",
      "sourceRecordIds": [
        "ifc006-mf060-p-ict-cases"
      ],
      "pages": [
        45
      ]
    },
    {
      "id": "research-innovation",
      "grade": 6,
      "label": "Innovación a partir de investigación",
      "match": "innovacion del proceso empresarial",
      "relation": "la relación entre la innovación propuesta, los resultados de investigación proporcionados y la necesidad del proceso empresarial",
      "sourceRecordIds": [
        "ifc006-mf060-p-research-innovation",
        "ifc006-mf060-c-updates-proposals"
      ],
      "pages": [
        45,
        46
      ]
    },
    {
      "id": "innovation-process",
      "grade": 6,
      "label": "Proceso de innovación",
      "match": "proceso de innovacion",
      "relation": "la correspondencia entre los pasos construidos o adaptados del proceso y las restricciones proporcionadas para la empresa ficticia",
      "sourceRecordIds": [
        "ifc006-mf060-p-innovation-processes",
        "ifc006-mf060-c-updates-proposals"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "innovation-importance",
      "grade": 6,
      "label": "Importancia de la innovación",
      "match": "importancia de la innovacion",
      "relation": "la relación entre las razones sobre competir y evolucionar y las evidencias proporcionadas de la empresa ficticia",
      "sourceRecordIds": [
        "ifc006-mf060-p-innovation-importance"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "proposal-methods",
      "grade": 6,
      "label": "Método de formulación de propuestas",
      "match": "metodo de formulacion de propuestas",
      "relation": "la correspondencia entre los pasos del método y las necesidades de formulación de propuestas del caso",
      "sourceRecordIds": [
        "ifc006-mf060-p-proposals",
        "ifc006-mf060-c-updates-proposals"
      ],
      "pages": [
        46
      ],
      "relationsByMode": {
        "development": "la correspondencia entre los pasos del método construido y las necesidades de formulación de propuestas del caso",
        "evidence": "la correspondencia entre los pasos del método presentado, su secuencia y las necesidades de formulación de propuestas del caso"
      }
    },
    {
      "id": "information-systems",
      "grade": 6,
      "label": "Tipos de sistemas de información",
      "match": "tipos de sistemas de informacion",
      "relation": "la distinción entre las funciones de los sistemas de las fichas y los procesos de las empresas ficticias a los que responden",
      "sourceRecordIds": [
        "ifc006-mf060-p-information-systems"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "erp-application",
      "grade": 6,
      "label": "Componente ERP",
      "match": "erp",
      "relation": "la relación entre las funciones del componente ERP y los procesos institucionales de planificación de recursos expresamente solicitados",
      "sourceRecordIds": [
        "ifc006-mf060-p-management-applications",
        "ifc006-mf060-c-management-applications"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "crm-application",
      "grade": 6,
      "label": "Componente CRM",
      "match": "crm",
      "relation": "la relación entre las funciones del componente CRM y los requerimientos del caso ficticio de relación o servicio al consumidor",
      "sourceRecordIds": [
        "ifc006-mf060-p-management-applications",
        "ifc006-mf060-c-management-applications"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "srm-application",
      "grade": 6,
      "label": "Componente SRM",
      "match": "srm",
      "relation": "la relación entre las funciones del componente SRM y los requerimientos del caso ficticio de relación con los proveedores",
      "sourceRecordIds": [
        "ifc006-mf060-p-management-applications",
        "ifc006-mf060-c-management-applications"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "cms-application",
      "grade": 6,
      "label": "Portal CMS",
      "match": "cms",
      "relation": "la correspondencia entre las funciones del portal CMS, sus contenidos ficticios y los requerimientos proporcionados, sin publicación real",
      "sourceRecordIds": [
        "ifc006-mf060-p-management-applications",
        "ifc006-mf060-c-management-applications"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "business-intelligence",
      "grade": 6,
      "label": "Inteligencia de negocio",
      "match": "inteligencia de negocio",
      "relation": "la correspondencia entre las funciones de la aplicación de inteligencia de negocio, los datos ficticios y el objetivo de información solicitado",
      "sourceRecordIds": [
        "ifc006-mf060-p-management-applications",
        "ifc006-mf060-c-management-applications"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "open-source",
      "grade": 6,
      "label": "Open Source en el caso",
      "match": "open source",
      "relation": "la relación entre las ventajas y desventajas identificadas en las fichas y las condiciones del caso empresarial ficticio",
      "sourceRecordIds": [
        "ifc006-mf060-p-open-cloud-saas"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "cloud-computing",
      "grade": 6,
      "label": "Cloud Computing en el caso",
      "match": "cloud computing",
      "relation": "la relación entre las ventajas y desventajas identificadas y las necesidades y condiciones del caso, sin contratar servicios",
      "sourceRecordIds": [
        "ifc006-mf060-p-open-cloud-saas",
        "ifc006-mf060-c-management-applications"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "saas",
      "grade": 6,
      "label": "SaaS en el caso",
      "match": "saas",
      "relation": "la relación entre las ventajas y desventajas identificadas y las condiciones del software como servicio descrito para el caso, sin crear cuentas",
      "sourceRecordIds": [
        "ifc006-mf060-p-open-cloud-saas",
        "ifc006-mf060-c-management-applications"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "management-configuration",
      "grade": 6,
      "label": "Configuración de gestión empresarial",
      "match": "configura (?:la )?aplicacion de gestion empresarial",
      "relation": "la correspondencia entre las opciones configuradas en la aplicación de práctica y las necesidades y parámetros proporcionados para el negocio ficticio",
      "sourceRecordIds": [
        "ifc006-mf060-p-application-configuration"
      ],
      "pages": [
        46
      ]
    },
    {
      "id": "tools-context",
      "grade": 6,
      "label": "Herramienta y entorno empresarial",
      "match": "relaciona (?:la )?herramienta tecnologica",
      "relation": "la relación entre las funciones de la herramienta proporcionada y las condiciones concretas del entorno empresarial ficticio descrito",
      "sourceRecordIds": [
        "ifc006-mf060-p-tools-context"
      ],
      "pages": [
        47
      ]
    }
  ]
}]} as unknown as EvaluationCatalog
