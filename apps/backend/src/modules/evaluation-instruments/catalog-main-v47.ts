import { evaluationCatalogV46 } from './catalog-v46'
/** Immutable payload from the pre-integration branch; never overwrite. */
const frozen = {
  "version": "evaluation-2026.47",
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
        "escribir",
        "trabajo escrito",
        "redactar"
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
        "proyecto",
        "cartel",
        "modelo"
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
        "mapa conceptual",
        "esquema conceptual"
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
    },
    {
      "id": "AUDIOVISUAL_PRODUCTION",
      "family": "PROJECT_BASED",
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "triggers": []
    }
  ],
  "criterionTemplates": [
    {
      "id": "organization",
      "title": "Organización",
      "observable": "Organiza las ideas en una secuencia comprensible.",
      "simple": "Presenta sus ideas en orden.",
      "area": "*",
      "keywords": [
        "organizacion",
        "secuencia",
        "ideas"
      ],
      "families": [
        "ORAL",
        "WRITTEN",
        "PROJECT_BASED"
      ],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 2
    },
    {
      "id": "communication",
      "title": "Comunicación",
      "observable": "Comunica las ideas de forma clara y adecuada al destinatario.",
      "simple": "Expresa sus ideas con claridad.",
      "area": "*",
      "keywords": [
        "comunica",
        "explica",
        "oral"
      ],
      "families": [
        "ORAL"
      ],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 2
    },
    {
      "id": "instructions",
      "title": "Seguimiento de instrucciones",
      "observable": "Realiza los pasos y entrega la evidencia solicitada.",
      "simple": "Sigue los pasos indicados.",
      "area": "*",
      "keywords": [
        "instrucciones",
        "pasos"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 1
    },
    {
      "id": "science-content",
      "title": "Dominio del contenido",
      "observable": "Explica los conceptos y sus relaciones usando el contenido trabajado.",
      "simple": "Reconoce y describe las características trabajadas.",
      "area": "science",
      "keywords": [
        "conceptos",
        "caracteristicas",
        "clasificacion",
        "explica"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 5
    },
    {
      "id": "science-accuracy",
      "title": "Precisión científica",
      "observable": "Usa los términos científicos con precisión.",
      "simple": "Usa las palabras científicas trabajadas.",
      "area": "science",
      "keywords": [
        "cientifico",
        "identifica",
        "describe"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "science-procedure",
      "title": "Procedimiento",
      "observable": "Aplica y explica los pasos del procedimiento científico.",
      "simple": "Realiza los pasos de la actividad.",
      "area": "science",
      "keywords": [
        "procedimiento",
        "experimento",
        "indagacion"
      ],
      "families": [
        "SCIENTIFIC",
        "OBSERVATIONAL",
        "PRACTICAL"
      ],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 5
    },
    {
      "id": "science-data",
      "title": "Registro de datos",
      "observable": "Registra observaciones y datos de forma ordenada y verificable.",
      "simple": "Anota lo que observa.",
      "area": "science",
      "keywords": [
        "datos",
        "registro",
        "observacion"
      ],
      "families": [
        "SCIENTIFIC",
        "OBSERVATIONAL"
      ],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "science-interpretation",
      "title": "Interpretación de resultados",
      "observable": "Interpreta los resultados a partir de los datos obtenidos.",
      "simple": "Explica lo que encontró.",
      "area": "science",
      "keywords": [
        "interpreta",
        "resultados",
        "analisis"
      ],
      "families": [
        "SCIENTIFIC",
        "OBSERVATIONAL"
      ],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "science-conclusion",
      "title": "Conclusiones",
      "observable": "Formula conclusiones sustentadas en los resultados registrados.",
      "simple": "Dice qué aprendió de sus observaciones.",
      "area": "science",
      "keywords": [
        "conclusiones",
        "evidencia"
      ],
      "families": [
        "SCIENTIFIC"
      ],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "science-safety",
      "title": "Seguridad",
      "observable": "Aplica las normas de seguridad pertinentes al procedimiento y los materiales.",
      "simple": "Usa los materiales con cuidado según las instrucciones.",
      "area": "science",
      "keywords": [
        "seguridad",
        "proteccion"
      ],
      "families": [
        "SCIENTIFIC"
      ],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3,
      "requires": [
        "laboratorio",
        "seguridad",
        "reactivos",
        "calor",
        "sustancias"
      ]
    },
    {
      "id": "math-comprehension",
      "title": "Comprensión del problema",
      "observable": "Identifica datos, condiciones y la pregunta del problema.",
      "simple": "Señala los datos y qué debe encontrar.",
      "area": "math",
      "keywords": [
        "problema",
        "datos"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "math-procedure",
      "title": "Procedimiento matemático",
      "observable": "Selecciona y aplica un procedimiento adecuado al problema.",
      "simple": "Muestra los pasos que usa.",
      "area": "math",
      "keywords": [
        "procedimiento",
        "operaciones"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 5
    },
    {
      "id": "math-reasoning",
      "title": "Razonamiento y justificación",
      "observable": "Justifica la estrategia y relaciona los pasos con los datos.",
      "simple": "Explica cómo llegó a su respuesta.",
      "area": "math",
      "keywords": [
        "razonamiento",
        "justifica",
        "estrategia"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 5
    },
    {
      "id": "math-accuracy",
      "title": "Exactitud",
      "observable": "Realiza los cálculos y usa las unidades con precisión.",
      "simple": "Comprueba sus cálculos.",
      "area": "math",
      "keywords": [
        "calcula",
        "calculo",
        "exactitud"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "math-interpretation",
      "title": "Interpretación",
      "observable": "Interpreta y comprueba la respuesta en el contexto del problema.",
      "simple": "Dice qué significa su respuesta.",
      "area": "math",
      "keywords": [
        "interpreta",
        "solucion",
        "resultado"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "language-content",
      "title": "Contenido y adecuación",
      "observable": "Desarrolla contenido pertinente al propósito y al género solicitado.",
      "simple": "Escribe ideas relacionadas con el tema.",
      "area": "language",
      "keywords": [
        "contenido",
        "adecuacion",
        "proposito"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 5
    },
    {
      "id": "language-structure",
      "title": "Estructura",
      "observable": "Organiza el texto según las convenciones del género trabajado.",
      "simple": "Ordena las partes de su texto.",
      "area": "language",
      "keywords": [
        "estructura",
        "texto",
        "genero"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "language-coherence",
      "title": "Coherencia y cohesión",
      "observable": "Relaciona las ideas con una progresión coherente y conectores adecuados.",
      "simple": "Une sus ideas de forma comprensible.",
      "area": "language",
      "keywords": [
        "coherencia",
        "cohesion",
        "conectores"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "language-argument",
      "title": "Argumentación",
      "observable": "Sustenta sus ideas con razones y evidencias pertinentes.",
      "simple": "Da razones para sus ideas.",
      "area": "language",
      "keywords": [
        "argumentacion",
        "argumentos",
        "evidencias"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3,
      "requires": [
        "ensayo",
        "debate",
        "argumento",
        "opinion"
      ]
    },
    {
      "id": "language-correctness",
      "title": "Vocabulario y corrección",
      "observable": "Usa vocabulario apropiado y revisa la corrección lingüística.",
      "simple": "Revisa las palabras y la escritura.",
      "area": "language",
      "keywords": [
        "vocabulario",
        "ortografia",
        "correccion"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "language-expression",
      "title": "Recursos expresivos",
      "observable": "Usa recursos del género literario para expresar su intención.",
      "simple": "Usa palabras que expresan sus ideas y sentimientos.",
      "area": "language",
      "keywords": [
        "poema",
        "literario",
        "expresion"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4,
      "requires": [
        "poema",
        "cuento",
        "literario",
        "romantico"
      ]
    },
    {
      "id": "social-sources",
      "title": "Fuentes y evidencias",
      "observable": "Selecciona y contrasta fuentes pertinentes para sustentar sus afirmaciones.",
      "simple": "Indica de dónde obtuvo la información.",
      "area": "social",
      "keywords": [
        "fuentes",
        "evidencias"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 5
    },
    {
      "id": "social-context",
      "title": "Contexto",
      "observable": "Sitúa hechos y procesos en su contexto histórico y geográfico.",
      "simple": "Ubica los hechos en tiempo y lugar.",
      "area": "social",
      "keywords": [
        "contexto",
        "historico",
        "geografico"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "social-causes",
      "title": "Causas y consecuencias",
      "observable": "Explica relaciones entre causas y consecuencias con evidencia.",
      "simple": "Relaciona lo que ocurrió con sus causas.",
      "area": "social",
      "keywords": [
        "causas",
        "consecuencias"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "social-argument",
      "title": "Argumentación social",
      "observable": "Defiende una interpretación usando razones y fuentes.",
      "simple": "Explica sus ideas con información.",
      "area": "social",
      "keywords": [
        "argumentacion",
        "fuentes"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "social-interpretation",
      "title": "Interpretación social",
      "observable": "Interpreta información considerando perspectivas y contexto.",
      "simple": "Explica la información trabajada.",
      "area": "social",
      "keywords": [
        "interpreta",
        "perspectivas"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "art-technique",
      "title": "Técnica",
      "observable": "Aplica la técnica artística trabajada con control.",
      "simple": "Usa la técnica practicada.",
      "area": "art",
      "keywords": [
        "tecnica",
        "artistica"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 5
    },
    {
      "id": "art-creativity",
      "title": "Creatividad",
      "observable": "Propone decisiones expresivas propias dentro de la consigna.",
      "simple": "Aporta ideas propias a su creación.",
      "area": "art",
      "keywords": [
        "creatividad",
        "creacion"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "art-composition",
      "title": "Composición",
      "observable": "Organiza los elementos de la producción de acuerdo con su intención.",
      "simple": "Organiza las partes de su creación.",
      "area": "art",
      "keywords": [
        "composicion",
        "elementos"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "art-intention",
      "title": "Intención expresiva",
      "observable": "Comunica una intención a través de sus decisiones artísticas.",
      "simple": "Expresa una idea o emoción en su creación.",
      "area": "art",
      "keywords": [
        "expresion",
        "intencion"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "art-materials",
      "title": "Uso de materiales",
      "observable": "Selecciona y utiliza materiales adecuados a la técnica y al propósito.",
      "simple": "Usa los materiales según la técnica.",
      "area": "art",
      "keywords": [
        "materiales",
        "recursos"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3,
      "requires": [
        "materiales",
        "pintura",
        "dibujo",
        "escultura",
        "produccion"
      ]
    },
    {
      "id": "motor-technique",
      "title": "Ejecución técnica",
      "observable": "Ejecuta los movimientos de la práctica con control técnico.",
      "simple": "Realiza los movimientos practicados.",
      "area": "motor",
      "keywords": [
        "ejecucion",
        "movimiento"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 5
    },
    {
      "id": "motor-coordination",
      "title": "Coordinación",
      "observable": "Coordina movimientos y ajusta el equilibrio a la situación.",
      "simple": "Coordina sus movimientos.",
      "area": "motor",
      "keywords": [
        "coordinacion",
        "equilibrio"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "motor-rules",
      "title": "Aplicación de reglas",
      "observable": "Aplica las reglas de la práctica durante su ejecución.",
      "simple": "Sigue las reglas del juego.",
      "area": "motor",
      "keywords": [
        "reglas",
        "juego"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "motor-performance",
      "title": "Desempeño motriz",
      "observable": "Adapta su ejecución a las condiciones de la tarea motriz.",
      "simple": "Completa la tarea motriz propuesta.",
      "area": "motor",
      "keywords": [
        "motriz",
        "desempeno"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "motor-cooperation",
      "title": "Cooperación",
      "observable": "Coordina acciones con sus compañeros para la tarea compartida.",
      "simple": "Colabora en las acciones del equipo.",
      "area": "motor",
      "keywords": [
        "cooperacion",
        "equipo"
      ],
      "families": [],
      "evidence": [
        "ATTITUDE",
        "PERFORMANCE"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3,
      "attitude": true,
      "requires": [
        "cooperacion",
        "equipo",
        "cooperativo"
      ]
    },
    {
      "id": "fihr-comprehension",
      "title": "Comprensión",
      "observable": "Explica los conceptos y situaciones trabajados.",
      "simple": "Describe lo que comprendió.",
      "area": "fihr",
      "keywords": [
        "comprension",
        "conceptos"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 5
    },
    {
      "id": "fihr-reflection",
      "title": "Reflexión",
      "observable": "Reflexiona sobre el sentido de las situaciones y sus implicaciones.",
      "simple": "Expresa lo que piensa de la situación.",
      "area": "fihr",
      "keywords": [
        "reflexion",
        "sentido"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 4
    },
    {
      "id": "fihr-argument",
      "title": "Argumentación",
      "observable": "Expresa una posición sustentada en razones.",
      "simple": "Da razones para su opinión.",
      "area": "fihr",
      "keywords": [
        "argumentacion",
        "razones"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "fihr-application",
      "title": "Aplicación a situaciones",
      "observable": "Relaciona lo aprendido con situaciones concretas.",
      "simple": "Da un ejemplo de lo aprendido.",
      "area": "fihr",
      "keywords": [
        "situaciones",
        "aplicacion"
      ],
      "families": [],
      "evidence": [
        "KNOWLEDGE",
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3
    },
    {
      "id": "fihr-values",
      "title": "Convivencia y valores",
      "observable": "Propone y demuestra acciones de convivencia pertinentes a la situación.",
      "simple": "Muestra la acción de convivencia trabajada.",
      "area": "fihr",
      "keywords": [
        "convivencia",
        "valores"
      ],
      "families": [],
      "evidence": [
        "ATTITUDE",
        "PERFORMANCE"
      ],
      "purpose": "Valorar evidencia observable de la actividad",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "weight": 3,
      "attitude": true,
      "requires": [
        "convivencia",
        "valores",
        "solidaridad"
      ]
    },
    {
      "id": "oral-mastery",
      "title": "Dominio del tema",
      "observable": "Explica el tema con autonomía, sin depender de la lectura del material de apoyo.",
      "simple": "Explica el tema con sus propias palabras.",
      "area": "*",
      "families": [
        "ORAL"
      ],
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "purpose": "Valorar dominio oral",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "keywords": [
        "dominio",
        "sin leer",
        "propias palabras"
      ],
      "weight": 4
    },
    {
      "id": "oral-resources",
      "title": "Uso de recursos de apoyo",
      "observable": "Utiliza los recursos solicitados para aclarar y apoyar la explicación.",
      "simple": "Usa sus recursos para ayudar a comprender.",
      "area": "*",
      "families": [
        "ORAL"
      ],
      "evidence": [
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar recursos de apoyo",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "keywords": [
        "recursos",
        "imagenes",
        "cartel",
        "diapositivas",
        "modelo"
      ],
      "weight": 3,
      "requires": [
        "recursos",
        "imagenes",
        "cartel",
        "diapositivas",
        "modelo"
      ]
    },
    {
      "id": "oral-responses",
      "title": "Respuestas a preguntas",
      "observable": "Responde las preguntas con información pertinente y coherente con lo expuesto.",
      "simple": "Responde preguntas sobre lo que explicó.",
      "area": "*",
      "families": [
        "ORAL"
      ],
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "purpose": "Valorar respuestas",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "keywords": [
        "preguntas",
        "respuestas"
      ],
      "weight": 2,
      "requires": [
        "preguntas",
        "responder",
        "respuestas"
      ]
    },
    {
      "id": "debate-evidence",
      "title": "Uso de evidencias",
      "observable": "Sustenta sus argumentos con datos, ejemplos o fuentes pertinentes.",
      "simple": "Apoya sus ideas con ejemplos o información.",
      "area": "*",
      "families": [
        "ORAL"
      ],
      "evidence": [
        "PERFORMANCE",
        "KNOWLEDGE"
      ],
      "purpose": "Valorar evidencia argumentativa",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "keywords": [
        "evidencia",
        "datos",
        "fuentes",
        "ejemplos"
      ],
      "weight": 4
    },
    {
      "id": "debate-response",
      "title": "Respuesta a posturas",
      "observable": "Escucha, contrasta y responde a las posturas presentadas sin desviar el argumento.",
      "simple": "Escucha y responde a las ideas de otros.",
      "area": "*",
      "families": [
        "ORAL"
      ],
      "evidence": [
        "PERFORMANCE"
      ],
      "purpose": "Valorar interacción argumentativa",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "keywords": [
        "posturas",
        "refutar",
        "responder",
        "debate"
      ],
      "weight": 4
    },
    {
      "id": "concept-hierarchy",
      "title": "Jerarquía conceptual",
      "observable": "Organiza los conceptos desde los más generales hasta los específicos.",
      "simple": "Ordena las ideas principales y sus detalles.",
      "area": "*",
      "families": [
        "WRITTEN"
      ],
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "purpose": "Valorar jerarquía conceptual",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "keywords": [
        "jerarquia",
        "conceptos",
        "mapa conceptual"
      ],
      "weight": 4
    },
    {
      "id": "concept-relations",
      "title": "Relaciones y palabras enlace",
      "observable": "Conecta los conceptos mediante relaciones correctas y palabras enlace significativas.",
      "simple": "Une las ideas con palabras que explican su relación.",
      "area": "*",
      "families": [
        "WRITTEN"
      ],
      "evidence": [
        "PRODUCT",
        "KNOWLEDGE"
      ],
      "purpose": "Valorar relaciones conceptuales",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "keywords": [
        "relaciones",
        "conectores",
        "palabras enlace",
        "mapa conceptual"
      ],
      "weight": 5
    },
    {
      "id": "project-product",
      "title": "Producto final",
      "observable": "El producto responde al propósito y a los requisitos explícitos de la actividad.",
      "simple": "Entrega el producto solicitado con sus partes.",
      "area": "*",
      "families": [
        "PROJECT_BASED"
      ],
      "evidence": [
        "PRODUCT"
      ],
      "purpose": "Valorar producto",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "keywords": [
        "producto",
        "proyecto",
        "modelo",
        "cartel"
      ],
      "weight": 5
    },
    {
      "id": "project-process",
      "title": "Proceso de elaboración",
      "observable": "Documenta y justifica las decisiones tomadas durante la elaboración.",
      "simple": "Muestra cómo realizó su trabajo.",
      "area": "*",
      "families": [
        "PROJECT_BASED"
      ],
      "evidence": [
        "PERFORMANCE",
        "PRODUCT"
      ],
      "purpose": "Valorar proceso",
      "bands": [
        "PRIMARY_FIRST",
        "PRIMARY_SECOND",
        "SECONDARY"
      ],
      "keywords": [
        "proceso",
        "etapas",
        "evidencia"
      ],
      "weight": 4
    }
  ],
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
export const evaluationCatalogMainV47 = { ...evaluationCatalogV46, ...frozen }
