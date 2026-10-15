import {evaluationCatalogV65} from './catalog-v65'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.66",
  "firstGradeReadingReportModule": {
    "id": "lengua-secundaria-1-informe-de-lectura",
    "grade": 1,
    "source": {
      "pdfPages": [
        71,
        72
      ],
      "printedPages": [
        70,
        71
      ],
      "topicElementId": "1d01bb28-c0b4-51ff-8123-dd7c7cd6f694",
      "procedureElementIds": [
        "92a9d148-7590-5e13-a3f6-28094453c2a8",
        "fb146520-8892-5a1d-a107-7c3ca7de00d4",
        "f539e8fd-f625-5294-96fb-285546e10b49",
        "5b1e7ea8-a3e7-589a-9701-792813138f20",
        "f44cf502-e335-5fcd-b2c1-d58e5c21b85c"
      ]
    },
    "adaptation": "Criterios de Aula Base; no instrumentos oficiales del MINERD.",
    "subjectCode": "LEN",
    "optionalEvidence": [
      "report-conclusion"
    ],
    "criteriaByActivity": {
      "READING_REPORT_WRITING": [
        {
          "title": "Resumen de texto literario seleccionado",
          "weight": 5,
          "observable": "Sintetiza las ideas principales del texto leído y conserva sus relaciones sin alterar su sentido.",
          "templateId": "report-summary",
          "progressionLevels": [
            "Sintetiza las ideas principales del texto leído y conserva sus relaciones sin alterar su sentido.",
            "El resumen conserva las ideas principales; omite un detalle secundario.",
            "Recupera hechos o ideas aislados, pero omite relaciones necesarias para comprender el texto.",
            "El resumen altera hechos importantes o añade datos que no pertenecen al texto.",
            "No presenta una síntesis reconocible del texto leído."
          ]
        },
        {
          "title": "Interpretación del texto leído",
          "weight": 5,
          "observable": "Interpreta el sentido y las relaciones entre ideas del texto y sustenta su explicación con ejemplos pertinentes del texto leído.",
          "templateId": "report-analysis",
          "progressionLevels": [
            "Interpreta el sentido y las relaciones entre ideas del texto y sustenta su explicación con ejemplos pertinentes del texto leído.",
            "La interpretación se relaciona con el texto; un ejemplo necesita mayor explicación.",
            "Propone una interpretación y menciona ejemplos sin explicar cómo la apoyan.",
            "La interpretación contradice las acciones o información del texto.",
            "No presenta una interpretación sustentada del texto."
          ]
        },
        {
          "title": "Estructura del informe de lectura",
          "weight": 4,
          "observable": "Organiza título, introducción, desarrollo y conclusión de acuerdo con el propósito del informe.",
          "templateId": "report-structure",
          "progressionLevels": [
            "Organiza título, introducción, desarrollo y conclusión de acuerdo con el propósito del informe.",
            "Las partes del informe son reconocibles; una sección necesita desarrollo.",
            "El resumen o análisis se presentan, pero faltan partes necesarias para relacionarlos.",
            "La organización confunde el resumen con la interpretación o contradice la conclusión.",
            "No organiza un informe de lectura reconocible."
          ]
        },
        {
          "title": "Coherencia y recursos lingüísticos",
          "weight": 3,
          "observable": "Relaciona resumen y análisis con vocabulario adecuado, verbos consistentes y conectores de adición o ejemplificación.",
          "templateId": "report-coherence",
          "progressionLevels": [
            "Relaciona resumen y análisis con vocabulario adecuado, verbos consistentes y conectores de adición o ejemplificación.",
            "La relación entre resumen y análisis se comprende; un enlace necesita precisión.",
            "Presenta ideas aisladas y los conectores no aclaran su relación.",
            "Las formas verbales o conectores cambian el sentido de los hechos o la interpretación.",
            "No se reconoce una relación comprensible entre las ideas del informe."
          ]
        },
        {
          "title": "Revisión y versión final",
          "weight": 3,
          "observable": "Presenta una versión final legible, con claridad, puntuación y ortografía que permiten comprender el informe.",
          "templateId": "report-revision",
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
          "title": "Función y propósito del informe",
          "weight": 4,
          "observable": "Explica para qué se elaboró el informe de lectura y qué texto analiza.",
          "templateId": "report-purpose",
          "progressionLevels": [
            "Explica para qué se elaboró el informe de lectura y qué texto analiza.",
            "Explica el propósito y reconoce la obra abordada con una imprecisión menor.",
            "Identifica la obra o el propósito, pero no explica su relación con el informe.",
            "Atribuye al informe un propósito o una obra que no le corresponden.",
            "No identifica el propósito ni el texto abordado por el informe."
          ]
        },
        {
          "title": "Identificación de la estructura",
          "weight": 4,
          "observable": "Identifica título, introducción, desarrollo y conclusión en el informe leído.",
          "templateId": "report-structure",
          "progressionLevels": [
            "Identifica título, introducción, desarrollo y conclusión en el informe leído.",
            "Localiza las partes presentes; una delimitación necesita precisión.",
            "Identifica algunas partes, pero confunde sus funciones en el informe.",
            "Atribuye contenido del resumen al análisis o de la conclusión a otra sección.",
            "No identifica partes reconocibles del informe."
          ]
        },
        {
          "title": "Comprensión del resumen",
          "weight": 4,
          "observable": "Reconoce las ideas principales de texto literario seleccionado recuperadas en el informe sin confundirlas con el análisis.",
          "templateId": "report-summary",
          "progressionLevels": [
            "Reconoce las ideas principales de texto literario seleccionado recuperadas en el informe sin confundirlas con el análisis.",
            "Reconoce las ideas principales recuperadas por el resumen; un dato necesita precisión.",
            "Identifica algunos hechos del resumen sin relacionarlos con las ideas centrales.",
            "Confunde opiniones del análisis con acontecimientos recuperados por el resumen.",
            "No reconoce información del resumen del informe."
          ]
        },
        {
          "title": "Interpretación del informe de lectura",
          "weight": 5,
          "observable": "Explica cómo el informe interpreta el sentido y las relaciones entre ideas del texto, apoyándose en información del informe.",
          "templateId": "report-analysis",
          "progressionLevels": [
            "Explica cómo el informe interpreta el sentido y las relaciones entre ideas del texto, apoyándose en información del informe.",
            "Explica la interpretación del informe; una relación con el texto necesita precisión.",
            "Menciona una interpretación sin explicar cómo se sustenta en el informe.",
            "La explicación atribuye al informe una interpretación ausente o contraria a sus datos.",
            "No explica una interpretación reconocible del informe analizado."
          ]
        },
        {
          "title": "Justificación con evidencias",
          "weight": 3,
          "observable": "Sustenta sus respuestas con información concreta del informe de lectura.",
          "templateId": "report-evidence",
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
          "title": "Propósito y textos analizados",
          "weight": 4,
          "observable": "Compara el propósito y los textos literarios abordados en ambos informes.",
          "templateId": "report-purpose",
          "progressionLevels": [
            "Compara el propósito y los textos literarios abordados en ambos informes.",
            "Contrasta propósitos y obras abordadas con una imprecisión menor.",
            "Identifica el propósito o texto de un informe sin contrastarlo con el otro.",
            "Confunde las obras o propósitos de los informes comparados.",
            "No reconoce los textos ni propósitos que compara."
          ]
        },
        {
          "title": "Comparación de la estructura",
          "weight": 4,
          "observable": "Contrasta la organización de título, introducción, desarrollo y conclusión.",
          "templateId": "report-structure",
          "progressionLevels": [
            "Contrasta la organización de título, introducción, desarrollo y conclusión.",
            "Contrasta la organización de ambos informes; una diferencia necesita precisión.",
            "Identifica partes de ambos informes sin explicar cómo se organizan de manera semejante o distinta.",
            "Confunde las partes y formula un contraste incompatible con los informes.",
            "No compara la organización de los informes."
          ]
        },
        {
          "title": "Comparación de interpretaciones",
          "weight": 5,
          "observable": "Contrasta cómo los informes interpretan el sentido y las relaciones entre ideas del texto, mediante información de ambos.",
          "templateId": "report-analysis",
          "progressionLevels": [
            "Contrasta cómo los informes interpretan el sentido y las relaciones entre ideas del texto, mediante información de ambos.",
            "Relaciona semejanzas y diferencias entre interpretaciones; una necesita desarrollo.",
            "Enumera interpretaciones de los informes sin explicar una semejanza o diferencia.",
            "El contraste atribuye a un informe una interpretación del otro o una interpretación ausente.",
            "No compara interpretaciones de los informes."
          ]
        },
        {
          "title": "Uso de evidencias",
          "weight": 4,
          "observable": "Sustenta la comparación con información concreta de ambos informes.",
          "templateId": "report-evidence",
          "progressionLevels": [
            "Sustenta la comparación con información concreta de ambos informes.",
            "Usa información de ambos informes; una relación con el contraste necesita precisión.",
            "Usa datos de un solo informe o cita ambos sin explicar su relación con el contraste.",
            "Los datos citados contradicen la comparación formulada.",
            "No aporta información de los informes para sustentar el contraste."
          ]
        },
        {
          "title": "Conclusión comparativa",
          "weight": 3,
          "observable": "Formula una conclusión coherente con las diferencias y semejanzas identificadas.",
          "templateId": "report-conclusion",
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
          "title": "Síntesis de texto literario seleccionado",
          "weight": 5,
          "observable": "Presenta las ideas principales de texto literario seleccionado de forma fiel y comprensible.",
          "templateId": "report-summary",
          "progressionLevels": [
            "Presenta las ideas principales de texto literario seleccionado de forma fiel y comprensible.",
            "Comunica las ideas principales del texto con una omisión menor.",
            "Comunica hechos aislados sin relacionarlos con el sentido principal del texto.",
            "La síntesis oral altera acontecimientos o añade datos ajenos al texto.",
            "No comunica una síntesis reconocible del texto leído."
          ]
        },
        {
          "title": "Interpretación del texto leído",
          "weight": 5,
          "observable": "Interpreta el sentido y las relaciones entre ideas del texto y sustenta su explicación con ejemplos pertinentes del texto leído.",
          "templateId": "report-analysis",
          "progressionLevels": [
            "Interpreta el sentido y las relaciones entre ideas del texto y sustenta su explicación con ejemplos pertinentes del texto leído.",
            "Explica la interpretación del texto; un ejemplo necesita mayor relación con su idea.",
            "Menciona una interpretación y ejemplos sin explicar cómo se relacionan.",
            "La explicación contradice las acciones o información del texto.",
            "No comunica una interpretación sustentada del texto."
          ]
        },
        {
          "title": "Organización del informe oral",
          "weight": 4,
          "observable": "Organiza la exposición con introducción, desarrollo y conclusión reconocibles.",
          "templateId": "report-structure",
          "progressionLevels": [
            "Organiza la exposición con introducción, desarrollo y conclusión reconocibles.",
            "Se reconocen introducción, desarrollo y conclusión; una transición necesita precisión.",
            "Comunica ideas aisladas y no se reconoce una de las partes de la exposición.",
            "El orden confunde hechos del texto con interpretaciones o conclusiones.",
            "No se reconoce una secuencia de exposición del informe."
          ]
        },
        {
          "title": "Claridad de la exposición",
          "weight": 3,
          "observable": "Expone con orden, dicción, volumen y ritmo comprensibles.",
          "templateId": "report-oral",
          "progressionLevels": [
            "Expone con orden, dicción, volumen y ritmo comprensibles.",
            "La comunicación o el apoyo acordado permite comprender las ideas; una pausa necesita ajuste.",
            "Se comprenden ideas aisladas, pero el ritmo o las pausas dificultan relacionarlas.",
            "La expresión cambia el sentido de ideas importantes del informe.",
            "No comunica información comprensible mediante la exposición o el apoyo acordado."
          ]
        },
        {
          "title": "Explicación del contenido presentado",
          "weight": 3,
          "observable": "Explica con sus palabras las ideas del texto y la interpretación que presenta.",
          "templateId": "report-individual",
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
  "englishChecklistEvidencePolicy": "EXPLICIT_FACTS_GENRES_AND_FUNCTIONAL_FIELDS_V4"
}
export const evaluationCatalogV66={...evaluationCatalogV65,...frozen}
