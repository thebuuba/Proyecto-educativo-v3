import type {TechnicalModule} from './secondary-technical'
/** Pedagogical adaptations; official literals remain in the reviewed matrix. */
export const technicalMf055Six:TechnicalModule={
  "id": "mf055-6",
  "programCode": "IFC006_3",
  "moduleCode": "MF_055_3",
  "grade": 6,
  "cycle": 2,
  "modalityCode": "technical_professional",
  "subjectName": "Implementación y Mantenimiento de Aplicaciones y Sistemas Informáticos",
  "sourceScopeId": "ifc006-mf055-6",
  "pdfPages": [
    22,
    23,
    24
  ],
  "policy": "REQUESTED_IMPLEMENTATION_MAINTENANCE_ACTIONS_FICTITIOUS_PRACTICE_NO_REAL_DEPLOYMENT_OR_ACCOUNTS_V1",
  "templatePrefix": "technical-mf055",
  "additionalVerbs": "identific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|identifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|seleccion(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|aplic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|apliqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|realiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|analiz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|compar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|explic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|elabor(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|verific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|cit(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|corrig(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|corrij(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|cre(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|instal(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|despleg(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|desplieg(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|modific(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|modifiqu(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|us(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|utiliz(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|utilic(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|recib(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|comprob(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|comprueb(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|ejecut(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)|prepar(?:a|as|an|ar|e|es|en|er|ir|ando|iendo)",
  "topics": [
    {
      "id": "quality-parameters",
      "grade": 6,
      "label": "Parámetros de calidad",
      "match": "parametros de calidad",
      "relation": "la correspondencia entre los parámetros identificados y las condiciones de calidad establecidas por la organización ficticia",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.1.1",
        "ifc006-mf055-p-quality-parameters"
      ],
      "pages": [
        23
      ],
      "exclude": "tipo de prueba|pruebas? de"
    },
    {
      "id": "quality-measurement",
      "grade": 6,
      "label": "Medición de calidad",
      "match": "medicion de calidad",
      "relation": "la relación entre los valores observados, los parámetros proporcionados y el nivel de calidad del servicio del caso",
      "sourceRecordIds": [
        "ifc006-mf055-c-tests"
      ],
      "pages": [
        23
      ]
    },
    {
      "id": "test-techniques",
      "grade": 6,
      "label": "Técnicas de prueba",
      "match": "tecnicas de prueba",
      "relation": "la correspondencia entre las técnicas identificadas y el procedimiento de prueba descrito en cada ficha",
      "sourceRecordIds": [
        "ifc006-mf055-p-test-techniques"
      ],
      "pages": [
        23
      ]
    },
    {
      "id": "test-selection",
      "grade": 6,
      "label": "Selección del tipo de prueba",
      "match": "tipo de prueba",
      "relation": "la adecuación de la prueba elegida al propósito, la información disponible y los parámetros de calidad del caso",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.1.2"
      ],
      "pages": [
        23
      ],
      "requires": "seleccion|elige|elegir|escog"
    },
    {
      "id": "test-code",
      "grade": 6,
      "label": "Prueba de código",
      "match": "pruebas? de codigos?",
      "relation": "la correspondencia entre el código examinado, los casos de prueba indicados y los resultados obtenidos frente a los esperados",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.1.3",
        "ifc006-mf055-p-code-test"
      ],
      "pages": [
        23
      ]
    },
    {
      "id": "test-unit",
      "grade": 6,
      "label": "Prueba unitaria",
      "match": "pruebas? unitarias?",
      "relation": "la correspondencia entre el módulo probado, las entradas del caso y su resultado esperado, sin atribuirle la integración de otros módulos",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.1.3",
        "ifc006-mf055-p-unit-test"
      ],
      "pages": [
        23
      ]
    },
    {
      "id": "test-integration",
      "grade": 6,
      "label": "Prueba de integración",
      "match": "integracion",
      "relation": "la correspondencia entre las interacciones de los módulos indicados y los resultados esperados de su integración",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.1.3",
        "ifc006-mf055-p-integration-test"
      ],
      "pages": [
        23,
        24
      ],
      "requires": "pruebas?|modulos|componentes"
    },
    {
      "id": "test-system",
      "grade": 6,
      "label": "Prueba de sistema",
      "match": "pruebas? (?:de(?:l)?|al) sistemas?",
      "exclude": "tecnicas de prueba",
      "relation": "la correspondencia entre el funcionamiento conjunto del sistema de práctica y los requisitos y resultados esperados del caso",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.1.3",
        "ifc006-mf055-p-system-test"
      ],
      "pages": [
        23,
        24
      ]
    },
    {
      "id": "test-acceptance",
      "grade": 6,
      "label": "Prueba de aceptación",
      "match": "pruebas? de aceptacion",
      "relation": "la correspondencia entre los resultados de la aplicación y las condiciones de aceptación proporcionadas por el usuario ficticio",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.1.3",
        "ifc006-mf055-p-acceptance-test"
      ],
      "pages": [
        23,
        24
      ]
    },
    {
      "id": "test-white-box",
      "grade": 6,
      "label": "Prueba de caja blanca",
      "match": "caja blanca",
      "relation": "la relación entre la estructura interna disponible, los casos de prueba solicitados y la comprobación de los caminos de código indicados",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.1.3",
        "ifc006-mf055-p-white-box"
      ],
      "pages": [
        23
      ],
      "relationsByMode": {
        "comparison": "la diferencia entre las pruebas según la disponibilidad de la estructura interna y el propósito descrito en las fichas, sin ejecutar nuevas pruebas"
      }
    },
    {
      "id": "test-black-box",
      "grade": 6,
      "label": "Prueba de caja negra",
      "match": "caja negra",
      "relation": "la relación entre las entradas, las salidas observadas y el comportamiento esperado, sin exigir acceso a la estructura interna",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.1.3",
        "ifc006-mf055-p-black-box"
      ],
      "pages": [
        23
      ],
      "relationsByMode": {
        "comparison": "la diferencia entre las pruebas según la disponibilidad de entradas y salidas documentadas y el propósito descrito en las fichas, sin exigir acceso a la estructura interna ni ejecutar nuevas pruebas"
      }
    },
    {
      "id": "installation-types",
      "grade": 6,
      "label": "Tipos de instalación",
      "match": "tipos? de instalacion(?:es)?",
      "relation": "la correspondencia entre cada tipo identificado y las condiciones de puesta en marcha descritas en la ficha",
      "sourceRecordIds": [
        "ifc006-mf055-p-installation-types"
      ],
      "pages": [
        24
      ],
      "requires": "identific|reconoc|enumera"
    },
    {
      "id": "installation-selection",
      "grade": 6,
      "label": "Selección de instalación",
      "match": "tipos? de instalacion(?:es)?",
      "relation": "la adecuación de la instalación elegida a las condiciones y parámetros establecidos por la organización ficticia",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.2.1"
      ],
      "pages": [
        23
      ],
      "requires": "seleccion|elige|elegir|escog"
    },
    {
      "id": "installation-direct",
      "grade": 6,
      "label": "Instalación directa",
      "match": "instalacion directa",
      "relation": "la sustitución directa prevista en la simulación de práctica según las condiciones de puesta en marcha y la política proporcionada",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.2.2",
        "ifc006-mf055-p-implementation-phase"
      ],
      "pages": [
        23,
        24
      ]
    },
    {
      "id": "installation-parallel",
      "grade": 6,
      "label": "Instalación en paralelo",
      "match": "instal(?:acion|a|ar|en) en paralelo",
      "relation": "la coexistencia del sistema anterior y el nuevo en la simulación según las condiciones y el período indicados",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.2.2",
        "ifc006-mf055-p-implementation-phase"
      ],
      "pages": [
        23,
        24
      ]
    },
    {
      "id": "installation-sites",
      "grade": 6,
      "label": "Instalación por localidades",
      "match": "instalacion en localidades individuales",
      "relation": "la puesta en marcha por localidades individuales en la simulación según los sitios y condiciones indicados",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.2.2",
        "ifc006-mf055-p-implementation-phase"
      ],
      "pages": [
        23,
        24
      ]
    },
    {
      "id": "installation-phased",
      "grade": 6,
      "label": "Instalación por fases",
      "match": "instalacion por fases",
      "relation": "la secuencia de puesta en marcha de las fases indicadas en la simulación según las condiciones de la organización ficticia",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.2.2",
        "ifc006-mf055-p-implementation-phase"
      ],
      "pages": [
        23,
        24
      ]
    },
    {
      "id": "implementation-analysis",
      "grade": 6,
      "label": "Análisis de implementación",
      "match": "tipo de implementacion",
      "relation": "la relación entre la modalidad de puesta en marcha y las condiciones de implementación descritas en el caso ficticio",
      "sourceRecordIds": [
        "ifc006-mf055-RA3.2",
        "ifc006-mf055-c-implementation"
      ],
      "pages": [
        23
      ]
    },
    {
      "id": "deliverables-explanation",
      "grade": 6,
      "label": "Función de los entregables",
      "match": "entregables",
      "relation": "la relación entre la función y el contenido de los entregables solicitados y las necesidades de los usuarios descritos",
      "sourceRecordIds": [
        "ifc006-mf055-p-deliverables-explanation"
      ],
      "pages": [
        24
      ],
      "requires": "explic"
    },
    {
      "id": "documentation-explanation",
      "grade": 6,
      "label": "Función de la documentación",
      "match": "documentacion",
      "relation": "la relación entre el contenido de la documentación solicitada y la información que necesitan los usuarios para utilizar el sistema",
      "sourceRecordIds": [
        "ifc006-mf055-p-deliverables-explanation"
      ],
      "pages": [
        24
      ],
      "requires": "explic"
    },
    {
      "id": "deliverables-creation",
      "grade": 6,
      "label": "Elaboración de entregables",
      "match": "entregables",
      "relation": "la correspondencia entre el contenido de los entregables elaborados y las necesidades de uso expresamente solicitadas para la aplicación ficticia",
      "sourceRecordIds": [
        "ifc006-mf055-p-deliverables-creation"
      ],
      "pages": [
        24
      ],
      "requires": "elabor|crea|prepara",
      "exclude": "recepcion"
    },
    {
      "id": "deliverables-reception",
      "grade": 6,
      "label": "Recepción de entregables",
      "match": "(?:recepcion de (?:los )?|recibe (?:los )?)entregables",
      "relation": "la correspondencia entre los entregables recibidos de los procesos expresamente indicados y las condiciones de aceptación dadas",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.2.3",
        "ifc006-mf055-p-deliverables-reception"
      ],
      "pages": [
        23,
        24
      ]
    },
    {
      "id": "diagnostic-test",
      "grade": 6,
      "label": "Prueba diagnóstica",
      "match": "pruebas? diagnosticas?",
      "relation": "la correspondencia entre la prueba diagnóstica aplicada, los parámetros indicados y los resultados obtenidos con los datos de práctica",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.1"
      ],
      "pages": [
        23
      ],
      "exclude": "resultados de (?:las? )?pruebas?"
    },
    {
      "id": "diagnostic-results",
      "grade": 6,
      "label": "Resultados diagnósticos",
      "match": "resultados de (?:las? )?pruebas? diagnosticas?",
      "relation": "la relación entre los resultados diagnósticos observados, los valores esperados y los posibles errores identificados",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.2",
        "ifc006-mf055-p-errors-identification"
      ],
      "pages": [
        23,
        24
      ]
    },
    {
      "id": "errors-citation",
      "grade": 6,
      "label": "Registro de errores",
      "match": "errores encontrados",
      "relation": "la fidelidad de la cita de los errores encontrados a los resultados proporcionados y al procedimiento de registro indicado",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.3"
      ],
      "pages": [
        23
      ],
      "requires": "cita|citar|registre|registra"
    },
    {
      "id": "error-syntax",
      "grade": 6,
      "label": "Error de sintaxis",
      "match": "error de sintaxis",
      "relation": "la correspondencia entre la sintaxis corregida y la regla del lenguaje que provocaba el error señalado, conservando el comportamiento ajeno al error",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.4",
        "ifc006-mf055-p-errors-correction",
        "ifc006-mf055-p-errors-identification"
      ],
      "pages": [
        23,
        24
      ],
      "relationsByMode": {
        "identification": "la relación entre la sintaxis señalada y la regla del lenguaje que permite reconocer el error en el código proporcionado",
        "description": "la relación entre la sintaxis señalada y la regla del lenguaje que permite reconocer el error en el código proporcionado",
        "explanation": "la relación entre la sintaxis señalada y la regla del lenguaje que permite reconocer el error en el código proporcionado",
        "analysis": "la relación entre la sintaxis señalada y la regla del lenguaje que permite reconocer el error en el código proporcionado",
        "comparison": "la relación entre la sintaxis señalada y la regla del lenguaje que permite reconocer el error en el código proporcionado",
        "recording": "la relación entre la sintaxis señalada y la regla del lenguaje que permite reconocer el error en el código proporcionado"
      }
    },
    {
      "id": "error-field-size",
      "grade": 6,
      "label": "Error de tamaño de campo",
      "match": "error de tamano del campo",
      "relation": "la correspondencia entre el tamaño corregido del campo y los datos admitidos según el caso, sin alterar otros campos",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.4",
        "ifc006-mf055-p-errors-correction",
        "ifc006-mf055-p-errors-identification"
      ],
      "pages": [
        23,
        24
      ],
      "relationsByMode": {
        "identification": "la relación entre el tamaño del campo y la longitud de los datos que permite reconocer el error indicado",
        "description": "la relación entre el tamaño del campo y la longitud de los datos que permite reconocer el error indicado",
        "explanation": "la relación entre el tamaño del campo y la longitud de los datos que permite reconocer el error indicado",
        "analysis": "la relación entre el tamaño del campo y la longitud de los datos que permite reconocer el error indicado",
        "comparison": "la relación entre el tamaño del campo y la longitud de los datos que permite reconocer el error indicado",
        "recording": "la relación entre el tamaño del campo y la longitud de los datos que permite reconocer el error indicado"
      }
    },
    {
      "id": "error-variable-type",
      "grade": 6,
      "label": "Error de tipo de variable",
      "match": "error de tipo de variable",
      "relation": "la compatibilidad entre el tipo corregido de la variable y los valores y operaciones esperados en el caso",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.4",
        "ifc006-mf055-p-errors-correction",
        "ifc006-mf055-p-errors-identification"
      ],
      "pages": [
        23,
        24
      ],
      "relationsByMode": {
        "identification": "la incompatibilidad entre el tipo de la variable, los valores y las operaciones del caso que permite reconocer el error",
        "description": "la incompatibilidad entre el tipo de la variable, los valores y las operaciones del caso que permite reconocer el error",
        "explanation": "la incompatibilidad entre el tipo de la variable, los valores y las operaciones del caso que permite reconocer el error",
        "analysis": "la incompatibilidad entre el tipo de la variable, los valores y las operaciones del caso que permite reconocer el error",
        "comparison": "la incompatibilidad entre el tipo de la variable, los valores y las operaciones del caso que permite reconocer el error",
        "recording": "la incompatibilidad entre el tipo de la variable, los valores y las operaciones del caso que permite reconocer el error"
      }
    },
    {
      "id": "error-overflow",
      "grade": 6,
      "label": "Error de desbordamiento",
      "match": "error de desbordamiento",
      "relation": "la correspondencia entre el límite afectado por el desbordamiento y la corrección solicitada para los datos de prueba",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.4",
        "ifc006-mf055-p-errors-correction",
        "ifc006-mf055-p-errors-identification"
      ],
      "pages": [
        23,
        24
      ],
      "relationsByMode": {
        "identification": "la relación entre el valor o la operación del caso y el límite que produce el desbordamiento señalado",
        "description": "la relación entre el valor o la operación del caso y el límite que produce el desbordamiento señalado",
        "explanation": "la relación entre el valor o la operación del caso y el límite que produce el desbordamiento señalado",
        "analysis": "la relación entre el valor o la operación del caso y el límite que produce el desbordamiento señalado",
        "comparison": "la relación entre el valor o la operación del caso y el límite que produce el desbordamiento señalado",
        "recording": "la relación entre el valor o la operación del caso y el límite que produce el desbordamiento señalado"
      }
    },
    {
      "id": "error-reference",
      "grade": 6,
      "label": "Error de referencia",
      "match": "error de referencia",
      "relation": "la correspondencia entre la referencia corregida y el elemento que debe utilizar la aplicación según el comportamiento esperado",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.4",
        "ifc006-mf055-p-errors-correction",
        "ifc006-mf055-p-errors-identification"
      ],
      "pages": [
        23,
        24
      ],
      "relationsByMode": {
        "identification": "la relación entre la referencia señalada y el elemento esperado que permite reconocer el error del caso",
        "description": "la relación entre la referencia señalada y el elemento esperado que permite reconocer el error del caso",
        "explanation": "la relación entre la referencia señalada y el elemento esperado que permite reconocer el error del caso",
        "analysis": "la relación entre la referencia señalada y el elemento esperado que permite reconocer el error del caso",
        "comparison": "la relación entre la referencia señalada y el elemento esperado que permite reconocer el error del caso",
        "recording": "la relación entre la referencia señalada y el elemento esperado que permite reconocer el error del caso"
      }
    },
    {
      "id": "error-analysis",
      "grade": 6,
      "label": "Análisis de errores",
      "match": "errores de la aplicacion",
      "relation": "la relación entre los resultados diagnósticos proporcionados, los errores observados y su efecto en el funcionamiento, sin modificar el código",
      "sourceRecordIds": [
        "ifc006-mf055-RA3.3",
        "ifc006-mf055-p-errors-identification"
      ],
      "pages": [
        23,
        24
      ],
      "requires": "analiz"
    },
    {
      "id": "protection-selection",
      "grade": 6,
      "label": "Selección de protección",
      "match": "tipo de proteccion",
      "relation": "la adecuación de la protección elegida a los riesgos y la política de la empresa ficticia",
      "sourceRecordIds": [
        "ifc006-mf055-p-protection-selection"
      ],
      "pages": [
        24
      ]
    },
    {
      "id": "backup-full",
      "grade": 6,
      "label": "Copia completa",
      "match": "completas?",
      "relation": "la inclusión de todos los datos de práctica previstos en la copia completa según la política proporcionada",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.5"
      ],
      "pages": [
        23
      ],
      "requires": "copias? de seguridad"
    },
    {
      "id": "backup-incremental",
      "grade": 6,
      "label": "Copia incremental",
      "match": "incremental(?:es)?",
      "relation": "la selección de los cambios desde la copia anterior en la secuencia de práctica según la política proporcionada",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.5"
      ],
      "pages": [
        23
      ],
      "requires": "copias? de seguridad"
    },
    {
      "id": "backup-differential",
      "grade": 6,
      "label": "Copia diferencial",
      "match": "diferencial(?:es)?",
      "relation": "la selección de los cambios desde la última copia completa en la secuencia de práctica según la política proporcionada",
      "sourceRecordIds": [
        "ifc006-mf055-CE3.3.5"
      ],
      "pages": [
        23
      ],
      "requires": "copias? de seguridad"
    }
  ]
}
