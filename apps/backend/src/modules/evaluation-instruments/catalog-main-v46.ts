import { evaluationCatalogV46 } from './catalog-v46'
/** Immutable payload from the pre-integration branch; never overwrite. */
const frozen = {
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
          "title": "Resumen de texto literario seleccionado",
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
          "observable": "Reconoce las ideas principales de texto literario seleccionado recuperadas en el informe sin confundirlas con el análisis.",
          "weight": 4,
          "progressionLevels": [
            "Reconoce las ideas principales de texto literario seleccionado recuperadas en el informe sin confundirlas con el análisis.",
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
          "title": "Síntesis de texto literario seleccionado",
          "observable": "Presenta las ideas principales de texto literario seleccionado de forma fiel y comprensible.",
          "weight": 5,
          "progressionLevels": [
            "Presenta las ideas principales de texto literario seleccionado de forma fiel y comprensible.",
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
  }
}
export const evaluationCatalogMainV46 = { ...evaluationCatalogV46, ...frozen }
