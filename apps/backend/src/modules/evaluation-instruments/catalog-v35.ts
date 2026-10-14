import {evaluationCatalogV34} from './catalog-v34'
import type {ActivityTypeEntry} from './catalog-v1'
/** Immutable communication release before adding explicit grammar. */
const frozen={
  "version": "evaluation-2026.35",
  "activityTypes": [
    {
      "id": "EXPOSITION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "exposicion",
        "exponer"
      ]
    },
    {
      "id": "ORAL_PRESENTATION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "presentacion oral"
      ]
    },
    {
      "id": "DEBATE",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "debate"
      ]
    },
    {
      "id": "NEWSCAST",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "noticiero",
        "presentar noticias",
        "presentaran noticias"
      ]
    },
    {
      "id": "NEWS_ANALYSIS",
      "family": "OBSERVATIONAL",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "analizar una noticia",
        "leer una noticia",
        "identificar sus partes",
        "identificar las partes"
      ]
    },
    {
      "id": "NEWS_COMPARISON",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "comparar noticias",
        "comparacion de noticias"
      ]
    },
    {
      "id": "NEWS_WRITING",
      "family": "WRITTEN",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "redactar una noticia",
        "redactaran una noticia",
        "escribir una noticia"
      ]
    },
    {
      "id": "TOURIST_GUIDE_CREATION",
      "family": "WRITTEN",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "crear una guia turistica",
        "crearan una guia turistica",
        "elaborar una guia turistica",
        "elaboraran una guia turistica",
        "hacer una guia turistica",
        "producir una guia turistica"
      ]
    },
    {
      "id": "TOURIST_GUIDE_ANALYSIS",
      "family": "OBSERVATIONAL",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "leer una guia turistica",
        "leeran una guia turistica",
        "analizar una guia turistica",
        "identificar la estructura de una guia turistica",
        "identificaran su estructura"
      ]
    },
    {
      "id": "TOURIST_GUIDE_PRESENTATION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "presentar oralmente una guia turistica",
        "presentaran oralmente dos lugares",
        "exponer una guia turistica",
        "presentar lugares usando una guia",
        "presentar lugares utilizando una guia"
      ]
    },
    {
      "id": "TOURIST_GUIDE_COMPARISON",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "comparar guias turisticas",
        "compararan dos guias turisticas",
        "comparacion de guias turisticas"
      ]
    },
    {
      "id": "POSTER_CREATION",
      "family": "WRITTEN",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "elaborar un afiche",
        "elaboraran un afiche",
        "crear un afiche",
        "disenar un afiche",
        "producir un afiche"
      ]
    },
    {
      "id": "POSTER_ANALYSIS",
      "family": "OBSERVATIONAL",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "analizar un afiche",
        "analizaran un afiche",
        "leer un afiche",
        "identificar el proposito de un afiche"
      ]
    },
    {
      "id": "POSTER_COMPARISON",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "comparar afiches",
        "compararan dos afiches",
        "comparacion de afiches"
      ]
    },
    {
      "id": "POSTER_PRESENTATION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "presentar su afiche",
        "presentara su afiche",
        "explicar su afiche",
        "presentacion oral de un afiche"
      ]
    },
    {
      "id": "READING_REPORT_WRITING",
      "family": "WRITTEN",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "escribir un informe de lectura",
        "elaborar un informe de lectura",
        "elaboraran un informe de lectura",
        "redactar un informe de lectura"
      ]
    },
    {
      "id": "READING_REPORT_ANALYSIS",
      "family": "OBSERVATIONAL",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "leer un informe de lectura",
        "leeran un informe de lectura",
        "analizar un informe de lectura",
        "analizaran un informe de lectura",
        "identificar la estructura de un informe de lectura"
      ]
    },
    {
      "id": "READING_REPORT_PRESENTATION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "presentar un informe de lectura",
        "presentaran un informe de lectura",
        "exponer un informe de lectura",
        "presentacion oral del informe de lectura"
      ]
    },
    {
      "id": "READING_REPORT_COMPARISON",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "comparar informes de lectura",
        "compararan informes de lectura",
        "comparacion de informes de lectura"
      ]
    },
    {
      "id": "DETECTIVE_STORY_WRITING",
      "family": "WRITTEN",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "escribir un cuento detectivesco",
        "escribiran un cuento detectivesco",
        "escribir un cuento policiaco",
        "crear un cuento detectivesco"
      ]
    },
    {
      "id": "DETECTIVE_STORY_ANALYSIS",
      "family": "OBSERVATIONAL",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "leer un cuento policiaco",
        "leeran un cuento policiaco",
        "analizar un cuento detectivesco",
        "identificar el narrador"
      ]
    },
    {
      "id": "DETECTIVE_STORY_NARRATION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "narrar oralmente un cuento detectivesco",
        "narrara oralmente un cuento detectivesco",
        "contar oralmente un cuento policiaco"
      ]
    },
    {
      "id": "DETECTIVE_STORY_COMPARISON",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "comparar cuentos detectivescos",
        "compararan dos cuentos detectivescos",
        "comparacion de cuentos policiacos"
      ]
    },
    {
      "id": "DETECTIVE_STORY_ANALYSIS_PRESENTATION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "exponer el analisis de un cuento detectivesco",
        "presentar el analisis de un cuento policiaco"
      ]
    },
    {
      "id": "CALLIGRAM_CREATION",
      "family": "ARTISTIC",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "crear un caligrama",
        "escribir un caligrama",
        "escribir un poema formando la silueta",
        "distribuir los versos formando la silueta"
      ]
    },
    {
      "id": "CALLIGRAM_ANALYSIS",
      "family": "OBSERVATIONAL",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "analizar un caligrama",
        "analizaran un caligrama",
        "leer un caligrama",
        "interpretar un caligrama"
      ]
    },
    {
      "id": "CALLIGRAM_COMPARISON",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "comparar caligramas",
        "compararan dos caligramas",
        "comparacion de caligramas"
      ]
    },
    {
      "id": "CALLIGRAM_RECITATION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "recitar un caligrama",
        "recitara un caligrama",
        "declamar un caligrama"
      ]
    },
    {
      "id": "CALLIGRAM_EXPLANATION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "presentar su caligrama",
        "explicar su caligrama",
        "explicar la relacion entre el tema y la figura"
      ]
    },
    {
      "id": "EXPERIMENT",
      "family": "SCIENTIFIC",
      "evidence": [
        "PERFORMANCE",
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "experimento",
        "experimentacion"
      ]
    },
    {
      "id": "LAB_PRACTICE",
      "family": "SCIENTIFIC",
      "evidence": [
        "PERFORMANCE",
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "laboratorio"
      ]
    },
    {
      "id": "WRITTEN_PRODUCTION",
      "family": "WRITTEN",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "produccion escrita",
        "poema",
        "cuento",
        "escribir"
      ]
    },
    {
      "id": "ESSAY",
      "family": "WRITTEN",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "ensayo"
      ]
    },
    {
      "id": "REPORT",
      "family": "WRITTEN",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "informe"
      ]
    },
    {
      "id": "RESEARCH",
      "family": "PROJECT_BASED",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "investigacion"
      ]
    },
    {
      "id": "PROJECT",
      "family": "PROJECT_BASED",
      "evidence": [
        "PRODUCT",
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "proyecto"
      ]
    },
    {
      "id": "PROBLEM_SOLVING",
      "family": "MATHEMATICAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "resolucion de problemas",
        "resolver problemas"
      ]
    },
    {
      "id": "EXERCISE_SET",
      "family": "MATHEMATICAL",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "ejercicios"
      ]
    },
    {
      "id": "CONCEPT_MAP",
      "family": "WRITTEN",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": [
        "mapa conceptual"
      ]
    },
    {
      "id": "PORTFOLIO",
      "family": "OBSERVATIONAL",
      "evidence": [
        "PRODUCT"
      ],
      "triggers": [
        "portafolio",
        "cuaderno"
      ]
    },
    {
      "id": "ARTISTIC_PRODUCTION",
      "family": "ARTISTIC",
      "evidence": [
        "PRODUCT",
        "PERFORMANCE"
      ],
      "triggers": [
        "produccion artistica",
        "pintura",
        "dibujo",
        "escultura"
      ]
    },
    {
      "id": "PERFORMANCE",
      "family": "ARTISTIC",
      "evidence": [
        "PERFORMANCE"
      ],
      "triggers": [
        "dramatizacion",
        "representacion escenica"
      ]
    },
    {
      "id": "MOTOR_SPORTS_PRACTICE",
      "family": "MOTOR",
      "evidence": [
        "PERFORMANCE"
      ],
      "triggers": [
        "deporte",
        "motriz",
        "deportiva"
      ]
    },
    {
      "id": "OBSERVATION",
      "family": "OBSERVATIONAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": [
        "observacion",
        "clasificacion"
      ]
    },
    {
      "id": "QUIZ_TEST",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE"
      ],
      "triggers": [
        "cuestionario",
        "prueba",
        "examen"
      ]
    },
    {
      "id": "OTHER",
      "family": "PRACTICAL",
      "evidence": [
        "PERFORMANCE"
      ],
      "triggers": []
    },
    {
      "id": "ANALYSIS",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "analizar",
        "análisis"
      ]
    },
    {
      "id": "COMPARISON",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": [
        "comparar",
        "comparación",
        "contrastar"
      ]
    },
    {
      "id": "ORAL_INTERACTION",
      "family": "ORAL",
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "triggers": []
    },
    {
      "id": "LISTENING_COMPREHENSION",
      "family": "OBSERVATIONAL",
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE"
      ],
      "triggers": []
    },
    {
      "id": "READING_COMPREHENSION",
      "family": "WRITTEN",
      "evidence": [
        "KNOWLEDGE",
        "PRODUCT"
      ],
      "triggers": []
    }
  ],
  "englishGradeOneModule": {
    "id": "ingles-comunicacion-1",
    "grade": 1,
    "subjectCode": "ING",
    "pdfPages": [
      134,
      135,
      136,
      137,
      138,
      139
    ],
    "policy": "COMMUNICATIVE_FUNCTION_MODALITY_V1"
  }
}
export const evaluationCatalogV35={...evaluationCatalogV34,...frozen,activityTypes:frozen.activityTypes as ActivityTypeEntry[]}
