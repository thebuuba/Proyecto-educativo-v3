import {evaluationCatalogV39} from './catalog-v39'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.40",
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
  "englishGradeOneGenres": [
    {
      "id": "conversation",
      "data": "la relación entre las intervenciones de los interlocutores",
      "error": "confunde quién interviene o a qué intervención responde",
      "match": "conversacion(?:es)?|dialogos?",
      "title": "Intercambio de la conversación",
      "production": "Relaciona sus intervenciones en inglés con las de los interlocutores para mantener el intercambio acordado."
    },
    {
      "id": "business-card",
      "data": "los datos de identificación y contacto solicitados de la tarjeta",
      "error": "atribuye los datos de la tarjeta a un referente diferente",
      "match": "tarjetas? de presentacion|business cards?",
      "title": "Datos de la tarjeta de presentación",
      "production": "Dispone en inglés los datos de identificación y contacto solicitados de la persona o personaje indicado."
    },
    {
      "id": "list",
      "data": "los elementos de la lista que corresponden a la búsqueda solicitada",
      "error": "incorpora elementos ajenos a la categoría o finalidad de la lista",
      "match": "listas?(?! (?:de cotejo|ponderadas?|de verificacion|de control|de observacion))",
      "title": "Elementos de la lista",
      "production": "Presenta en inglés los elementos de la lista pertinentes para la finalidad indicada."
    },
    {
      "id": "advertisement",
      "data": "el producto o servicio y la información solicitada del anuncio",
      "error": "atribuye al producto o servicio características diferentes de las comunicadas",
      "match": "anuncios?|advertisements?",
      "title": "Producto o servicio anunciado",
      "production": "Comunica en inglés el producto o servicio anunciado y la información necesaria para el destinatario acordado."
    },
    {
      "id": "recipe",
      "data": "las acciones de preparación y su orden en la receta",
      "error": "invierte o cambia acciones de preparación y altera las instrucciones",
      "match": "recetas?|recipes?",
      "title": "Acciones de la receta",
      "production": "Comunica en inglés las acciones de preparación de la receta en un orden que permite seguir las instrucciones.",
      "existingFunction": "instructions"
    },
    {
      "id": "sign",
      "data": "la indicación del letrero para la situación en que aparece",
      "error": "confunde una indicación con su prohibición o comunica una acción diferente",
      "match": "letreros?|signs?",
      "title": "Indicación del letrero",
      "production": "Comunica en inglés la indicación del letrero de forma breve y comprensible para el destinatario."
    },
    {
      "id": "notice",
      "data": "la información del aviso que permite comprender lo comunicado",
      "error": "cambia lo anunciado o a quién se dirige el aviso",
      "match": "avisos?|notices?",
      "title": "Información del aviso",
      "production": "Comunica en inglés la información del aviso necesaria para reconocer la situación anunciada."
    },
    {
      "id": "poster",
      "data": "el mensaje central del afiche y la información solicitada",
      "error": "el mensaje dispuesto comunica un propósito diferente del solicitado",
      "match": "afiches?|carteles?|posters?",
      "title": "Mensaje del afiche",
      "production": "Dispone en inglés el mensaje central del afiche de forma legible y relacionada con su propósito comunicativo."
    },
    {
      "id": "message",
      "data": "el propósito del mensaje y los datos solicitados para comprenderlo",
      "error": "el contenido cambia la intención o el destinatario del mensaje",
      "match": "mensajes?|messages?",
      "title": "Propósito del mensaje",
      "production": "Comunica en inglés las ideas necesarias para cumplir el propósito del mensaje en la situación acordada."
    },
    {
      "id": "email",
      "data": "el destinatario y propósito del correo y su información solicitada",
      "error": "dirige a otra persona información que no corresponde al propósito del correo",
      "match": "correos? electronicos?|e mails?|emails?",
      "title": "Comunicación por correo electrónico",
      "production": "Relaciona el destinatario y propósito del correo con un cuerpo breve en inglés que permite comprender lo comunicado."
    },
    {
      "id": "cv",
      "data": "los datos de perfil solicitados en el currículum vitae",
      "error": "atribuye datos de perfil a otra persona o los ubica en un apartado diferente",
      "match": "curriculum vitae|curriculum|cv",
      "title": "Perfil del currículum vitae",
      "production": "Organiza en inglés los datos de perfil solicitados de una persona real o ficticia para el currículum vitae acordado."
    },
    {
      "id": "letter",
      "data": "el destinatario y propósito de la carta y la información solicitada",
      "error": "el mensaje se dirige a un destinatario o propósito diferente del acordado",
      "match": "cartas?|letters?",
      "title": "Comunicación de la carta",
      "production": "Relaciona el destinatario y propósito de la carta con un mensaje breve en inglés que permite comprender lo comunicado."
    },
    {
      "id": "form",
      "data": "los campos solicitados del formulario y los datos que contienen o requieren",
      "error": "sitúa los datos en campos que piden una información diferente",
      "match": "formularios?|forms?",
      "title": "Información del formulario",
      "production": "Completa en inglés los campos solicitados con datos pertinentes de la persona o situación real o ficticia indicada."
    },
    {
      "id": "forecast",
      "data": "las condiciones atmosféricas y sus referencias solicitadas en el pronóstico",
      "error": "atribuye al pronóstico condiciones diferentes de las indicadas",
      "match": "pronosticos? del tiempo|weather forecasts?",
      "title": "Información del pronóstico",
      "production": "Comunica en inglés las condiciones atmosféricas del pronóstico y las referencias solicitadas.",
      "existingFunction": "weather"
    },
    {
      "id": "news",
      "data": "el suceso comunicado y los datos solicitados de la noticia",
      "error": "cambia el suceso o atribuye sus datos a otro acontecimiento",
      "match": "noticias?|news",
      "title": "Información de la noticia",
      "production": "Comunica en inglés el suceso comunicado y los datos necesarios para reconocer qué ocurrió en la noticia."
    },
    {
      "id": "schedule",
      "data": "la actividad y momento que corresponden a la consulta del horario",
      "error": "asigna a la actividad un momento diferente del indicado",
      "match": "horarios?|timetables?",
      "title": "Actividad y momento del horario",
      "production": "Relaciona en inglés cada actividad y momento solicitado para que el horario pueda consultarse."
    },
    {
      "id": "agenda",
      "data": "los compromisos y sus referencias temporales solicitadas en la agenda",
      "error": "cambia la correspondencia entre el compromiso y su momento",
      "match": "agendas?",
      "title": "Compromisos de la agenda",
      "production": "Relaciona en inglés los compromisos con las referencias temporales necesarias para consultar la agenda."
    },
    {
      "id": "map",
      "data": "las ubicaciones y referencias del croquis necesarias para responder a la consulta",
      "error": "invierte una ubicación o referencia y cambia el recorrido consultado",
      "match": "croquis|mapas?|maps?",
      "title": "Referencias del croquis",
      "production": "Relaciona las ubicaciones y referencias del croquis con las indicaciones en inglés solicitadas."
    },
    {
      "id": "questionnaire",
      "data": "la información buscada por las preguntas del cuestionario",
      "error": "formula o interpreta preguntas que buscan información distinta de la solicitada",
      "match": "cuestionarios?|questionnaires?",
      "title": "Información buscada por las preguntas",
      "production": "Formula en inglés preguntas comprensibles que permiten obtener la información buscada en la situación acordada."
    },
    {
      "id": "brochure",
      "data": "la información del folleto pertinente para la consulta solicitada",
      "error": "la organización o los datos del folleto conducen a información diferente de la solicitada",
      "match": "folletos?|brochures?",
      "title": "Información del folleto",
      "production": "Dispone en inglés la información del folleto de modo que el destinatario pueda encontrar los datos solicitados."
    },
    {
      "id": "song",
      "data": "el mensaje de la canción expresado por las palabras solicitadas",
      "error": "cambia palabras o relaciones que alteran el sentido del mensaje de la canción",
      "match": "cancion(?:es)?|songs?",
      "title": "Mensaje de la canción",
      "production": "Comunica el mensaje de la canción en inglés con palabras y expresiones comprensibles mediante la interpretación acordada."
    },
    {
      "id": "poem",
      "data": "el sentido de los versos y las expresiones solicitadas de la poesía",
      "error": "atribuye a los versos un sentido incompatible con sus palabras",
      "match": "poesias?|poemas?|poems?",
      "title": "Sentido de los versos",
      "production": "Comunica en inglés el sentido de los versos mediante las expresiones de la producción acordada."
    },
    {
      "id": "comic",
      "data": "la relación entre las viñetas y los mensajes de la historieta",
      "error": "invierte la secuencia o atribuye a una viñeta un mensaje diferente",
      "match": "historietas?|comics?",
      "title": "Secuencia de la historieta",
      "production": "Relaciona en inglés los mensajes con las viñetas para que la secuencia de la historieta resulte comprensible."
    },
    {
      "id": "tourist-guide",
      "data": "los lugares y orientaciones de la guía pertinentes para la consulta",
      "error": "confunde los lugares o las orientaciones y conduce a información diferente",
      "match": "guias? turisticas?|tourist guides?",
      "title": "Orientaciones de la guía turística",
      "production": "Comunica en inglés los lugares y orientaciones de la guía que permiten atender la consulta acordada."
    },
    {
      "id": "description",
      "data": "las características solicitadas y el referente descrito",
      "error": "atribuye las características a un referente distinto",
      "match": "descripcion(?:es)?|descriptions?",
      "title": "Características de lo descrito",
      "production": "Relaciona en inglés las características solicitadas con la persona, lugar u objeto descrito.",
      "existingFunction": "description"
    },
    {
      "id": "biography",
      "data": "los acontecimientos de la vida de la persona y sus relaciones solicitadas",
      "error": "atribuye los acontecimientos a otra persona o cambia su relación",
      "match": "biografias?|biographies",
      "title": "Acontecimientos de la biografía",
      "production": "Comunica en inglés los acontecimientos de la vida de la persona real o ficticia indicada con relaciones comprensibles."
    },
    {
      "id": "narrative",
      "data": "los acontecimientos y personajes presentes en la narración y las relaciones solicitadas",
      "error": "cambia los acontecimientos o sus relaciones y altera la narración",
      "match": "narracion(?:es)?|relatos?|narratives?",
      "title": "Acontecimientos de la narración",
      "production": "Relaciona en inglés los acontecimientos y personajes, cuando corresponda, para que la narración real o ficticia se comprenda."
    },
    {
      "id": "meme",
      "data": "la relación entre texto e imagen que comunica el meme",
      "error": "el texto contradice la imagen y cambia la intención comunicativa acordada",
      "match": "memes?",
      "title": "Relación entre texto e imagen",
      "production": "Relaciona el texto e imagen del meme para comunicar en inglés el mensaje acordado de forma comprensible."
    },
    {
      "id": "audiovisual",
      "data": "la relación entre los recursos seleccionados y el mensaje audiovisual",
      "error": "los recursos comunican ideas incompatibles con el mensaje solicitado",
      "match": "produccion(?:es)? audiovisual(?:es)?|videos?",
      "title": "Mensaje de la producción audiovisual",
      "production": "Relaciona los recursos seleccionados con un mensaje en inglés comprensible para el destinatario acordado."
    }
  ],
  "englishGradeOneGrammar": [
    {
      "id": "present-simple",
      "name": "el presente simple",
      "error": "altera la concordancia o la referencia habitual de las acciones",
      "match": "\\b(?:presente simple|simple present|present simple)\\b",
      "function": "expresar hábitos, datos o estados según el mensaje"
    },
    {
      "id": "preference-verbs",
      "name": "los verbos like, prefer y enjoy solicitados",
      "error": "confunde quién expresa el gusto o qué actividad prefiere",
      "match": "\\b(?:verbos? (?:like|prefer|enjoy)|like prefer enjoy|like y prefer)\\b",
      "terms": [
        [
          "\\blike\\b",
          "el verbo like"
        ],
        [
          "\\bprefer\\b",
          "el verbo prefer"
        ],
        [
          "\\benjoy\\b",
          "el verbo enjoy"
        ]
      ],
      "function": "expresar gustos y preferencias relacionando quién prefiere con lo preferido"
    },
    {
      "id": "present-continuous",
      "name": "el presente continuo",
      "error": "confunde la acción en desarrollo con una acción terminada o habitual",
      "match": "\\b(?:presente continuo|present continuous)\\b",
      "function": "situar una acción en desarrollo en el momento indicado"
    },
    {
      "id": "past-simple",
      "name": "el pasado simple",
      "error": "presenta como actual un hecho situado en el pasado o cambia quién lo realizó",
      "match": "\\b(?:pasado simple|simple past|past simple)\\b",
      "function": "situar hechos o experiencias terminados en el pasado"
    },
    {
      "id": "present-perfect",
      "name": "el presente perfecto",
      "error": "confunde la experiencia anterior con una acción que está ocurriendo ahora",
      "match": "\\b(?:presente perfecto|present perfect)\\b",
      "function": "referir experiencias anteriores relacionadas con el presente"
    },
    {
      "id": "future",
      "name": "will o be going to según la forma solicitada",
      "error": "sitúa la previsión en un momento distinto del anunciado",
      "match": "\\b(?:will|be going to)\\b",
      "terms": [
        [
          "\\bwill\\b",
          "will"
        ],
        [
          "\\bbe going to\\b",
          "be going to"
        ]
      ],
      "function": "comunicar previsiones para el momento futuro indicado"
    },
    {
      "id": "would",
      "name": "would en la invitación",
      "error": "la estructura cambia la invitación por una afirmación que no propone ni responde",
      "match": "\\b(?:would)\\b",
      "function": "formular o aceptar cortésmente una invitación"
    },
    {
      "id": "declining-forms",
      "name": "can’t o have to según la forma solicitada",
      "error": "comunica posibilidad cuando pretende expresar imposibilidad u obligación",
      "match": "\\b(?:can t|cannot|have to)\\b",
      "terms": [
        [
          "\\bcan t\\b|\\bcannot\\b",
          "can’t"
        ],
        [
          "\\bhave to\\b",
          "have to"
        ]
      ],
      "function": "expresar imposibilidad u obligación al rechazar una invitación"
    },
    {
      "id": "there-be",
      "name": "there + be",
      "error": "confunde la existencia o el número de los elementos descritos",
      "match": "\\b(?:there (?:is|are|be)|there y be)\\b",
      "function": "indicar existencia y cantidad en la descripción de un lugar"
    },
    {
      "id": "imperative",
      "name": "el imperativo",
      "error": "cambia una instrucción afirmativa por una prohibición o altera la acción solicitada",
      "match": "\\b(?:imperativos?|imperatives?)\\b",
      "function": "comunicar la acción solicitada en una instrucción"
    },
    {
      "id": "lets",
      "name": "let’s",
      "error": "la expresión deja de proponer una acción compartida al interlocutor",
      "match": "\\b(?:let s)\\b",
      "function": "proponer una actividad compartida mediante una invitación"
    },
    {
      "id": "question-tags",
      "name": "las question tags",
      "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación",
      "match": "\\b(?:question tags?)\\b",
      "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada"
    },
    {
      "id": "possessive-s",
      "name": "el posesivo ’s",
      "error": "atribuye la pertenencia a un poseedor distinto",
      "match": "\\b(?:posesivo s|genitivo sajon|possessive s)\\b",
      "function": "relacionar una pertenencia con su poseedor"
    },
    {
      "id": "articles",
      "name": "los artículos definidos o indefinidos solicitados",
      "error": "la elección del artículo cambia qué referente puede reconocer el destinatario",
      "match": "\\b(?:articulos? definidos?|articulos? indefinidos?|definite articles?|indefinite articles?|a an y the)\\b",
      "terms": [
        [
          "\\bdefinidos?\\b|\\bdefinite\\b",
          "los artículos definidos"
        ],
        [
          "\\bindefinidos?\\b|\\bindefinite\\b",
          "los artículos indefinidos"
        ]
      ],
      "function": "distinguir referentes identificados de referentes no identificados previamente"
    },
    {
      "id": "qualifying-adjectives",
      "name": "los adjetivos calificativos",
      "error": "atribuye una característica incompatible con lo que se desea describir",
      "match": "\\b(?:adjetivos? calificativos?|qualifying adjectives?)\\b",
      "function": "atribuir características a personas, lugares u objetos"
    },
    {
      "id": "comparative",
      "name": "el grado comparativo o superlativo solicitado",
      "error": "confunde la relación entre dos elementos con la selección de uno dentro de un conjunto",
      "match": "\\b(?:comparativos?|comparative|superlativos?|superlative)\\b",
      "terms": [
        [
          "\\bcomparativos?\\b|\\bcomparative\\b",
          "el grado comparativo"
        ],
        [
          "\\bsuperlativos?\\b|\\bsuperlative\\b",
          "el grado superlativo"
        ]
      ],
      "function": "establecer una comparación o destacar un elemento dentro de un conjunto"
    },
    {
      "id": "possessive-adjectives",
      "name": "los adjetivos posesivos",
      "error": "cambia el poseedor de la pertenencia expresada",
      "match": "\\b(?:adjetivos? posesivos?|possessive adjectives?)\\b",
      "function": "señalar a quién pertenece el sustantivo que acompañan"
    },
    {
      "id": "interrogative-pronouns",
      "name": "los pronombres interrogativos",
      "error": "pregunta por una información distinta de la que se quiere solicitar",
      "match": "\\b(?:pronombres? interrogativos?|interrogative pronouns?)\\b",
      "function": "preguntar por la persona, cosa o lugar que se necesita conocer"
    },
    {
      "id": "object-pronouns",
      "name": "los pronombres objeto",
      "error": "atribuye la acción al receptor equivocado",
      "match": "\\b(?:pronombres? objeto|object pronouns?)\\b",
      "function": "señalar a quién se dirige o afecta la acción"
    },
    {
      "id": "possessive-pronouns",
      "name": "los pronombres posesivos",
      "error": "sustituye la pertenencia de modo que se atribuye a otro poseedor",
      "match": "\\b(?:pronombres? posesivos?|possessive pronouns?)\\b",
      "function": "identificar una pertenencia y su poseedor sin repetir el sustantivo"
    },
    {
      "id": "time-prepositions",
      "name": "las preposiciones de tiempo",
      "error": "sitúa el hecho en una referencia temporal diferente",
      "match": "\\b(?:preposiciones? de tiempo|prepositions? of time)\\b",
      "function": "situar el hecho en la hora, fecha o período indicado"
    },
    {
      "id": "place-prepositions",
      "name": "las preposiciones de lugar",
      "error": "cambia la relación espacial entre los elementos",
      "match": "\\b(?:preposiciones? de lugar|prepositions? of place)\\b",
      "function": "situar un elemento respecto a otro en el espacio"
    },
    {
      "id": "time-adverbs",
      "name": "los adverbios de tiempo",
      "error": "desplaza la acción a un momento distinto del indicado",
      "match": "\\b(?:adverbios? de tiempo|adverbs? of time)\\b",
      "function": "indicar cuándo ocurre la acción"
    },
    {
      "id": "frequency-adverbs",
      "name": "los adverbios de frecuencia",
      "error": "confunde una acción habitual con una ocasional o inexistente",
      "match": "\\b(?:adverbios? de frecuencia|adverbs? of frequency)\\b",
      "function": "expresar con qué frecuencia ocurre una acción"
    },
    {
      "id": "manner-adverbs",
      "name": "los adverbios de modo",
      "error": "altera la manera en que se realiza la acción descrita",
      "match": "\\b(?:adverbios? de modo|adverbs? of manner)\\b",
      "function": "precisar cómo se realiza una acción"
    },
    {
      "id": "degree-adverbs",
      "name": "los adverbios de intensidad",
      "error": "cambia el grado de intensidad que se pretende expresar",
      "match": "\\b(?:adverbios? de intensidad|adverbs? of (?:degree|intensity))\\b",
      "function": "graduar la intensidad de una característica o acción"
    },
    {
      "id": "certainty-adverbs",
      "name": "los adverbios de certeza",
      "error": "presenta una posibilidad como una certeza o una certeza como una duda",
      "match": "\\b(?:adverbios? de certeza|adverbs? of certainty)\\b",
      "function": "expresar el grado de seguridad de una afirmación"
    },
    {
      "id": "coordination-connectors",
      "name": "los conectores de coordinación",
      "error": "confunde suma, contraste y alternativa entre las ideas",
      "match": "\\b(?:conectores? de coordinacion|coordinating conjunctions?)\\b",
      "function": "unir, contrastar o presentar alternativas entre ideas"
    },
    {
      "id": "time-connectors",
      "name": "los conectores de tiempo",
      "error": "invierte la relación de anterioridad o posterioridad de las acciones",
      "match": "\\b(?:conectores? de tiempo|temporal connectors?)\\b",
      "function": "relacionar los momentos en que ocurren las acciones"
    },
    {
      "id": "sequence-connectors",
      "name": "los conectores de secuencia",
      "error": "cambia el orden necesario para seguir los pasos o acontecimientos",
      "match": "\\b(?:conectores? de secuencia|sequence connectors?)\\b",
      "function": "ordenar pasos o acontecimientos"
    },
    {
      "id": "cause-connectors",
      "name": "los conectores de causa y consecuencia",
      "error": "invierte o confunde la causa y la consecuencia de los hechos",
      "match": "\\b(?:conectores? de causa(?: y consecuencia)?|conectores? de consecuencia|cause and effect connectors?)\\b",
      "function": "relacionar un hecho con su causa o su consecuencia"
    }
  ],
  "englishGradeOneStrategies": [
    {
      "id": "anticipation",
      "match": "anticip\\w*",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Anticipación del contenido",
      "levels": [
        "Formula una anticipación del contenido en inglés relacionada con las pistas disponibles antes de acceder al mensaje.",
        "La anticipación se relaciona con las pistas; una referencia necesita precisión.",
        "Menciona pistas aisladas, pero la anticipación no las relaciona con un contenido posible.",
        "La anticipación contradice las pistas disponibles.",
        "No aporta una anticipación relacionada con las pistas disponibles."
      ]
    },
    {
      "id": "listening",
      "match": "escuch\\w* atentamente|escucha atenta",
      "modes": [
        "listening"
      ],
      "title": "Recuperación mediante escucha atenta",
      "levels": [
        "Recupera los datos solicitados del mensaje escuchado en inglés con los apoyos acordados.",
        "Recupera los datos principales; un dato puntual necesita una nueva escucha.",
        "Reconoce datos aislados, pero omite relaciones necesarias para responder a lo solicitado.",
        "Atribuye al mensaje escuchado datos que cambian su sentido.",
        "No aporta datos reconocibles del mensaje escuchado."
      ]
    },
    {
      "id": "nonverbal-reception",
      "match": "gestos|expresiones faciales|lenguaje no verbal|senales no verbales",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Interpretación de señales no verbales",
      "levels": [
        "Relaciona las señales no verbales disponibles con el significado del mensaje en inglés.",
        "Relaciona las señales principales con el mensaje; una relación necesita precisión.",
        "Reconoce señales aisladas, pero no las vincula con el significado del intercambio.",
        "Interpreta una señal en contradicción con la situación comunicativa.",
        "No establece una relación reconocible entre las señales disponibles y el mensaje."
      ]
    },
    {
      "id": "inference",
      "match": "infer\\w*.*(?:significado|sentido)",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Inferencia del significado",
      "levels": [
        "Propone un significado de la palabra o expresión en inglés compatible con las pistas del mensaje y el contexto disponible.",
        "El significado propuesto permite comprender el mensaje; una pista requiere revisión.",
        "Propone un significado posible de forma aislada, pero no lo relaciona con las pistas del mensaje.",
        "El significado propuesto contradice el contexto y cambia la información comunicada.",
        "No aporta un significado relacionado con las pistas disponibles."
      ]
    },
    {
      "id": "help",
      "match": "(?:solicit\\w*|ped\\w*) (?:ayuda|repeticion|aclaracion)",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Solicitud de ayuda para comprender",
      "levels": [
        "Señala la parte del mensaje en inglés que necesita aclarar y solicita la ayuda o repetición pertinente.",
        "La solicitud permite localizar la dificultad; una referencia necesita precisión.",
        "Solicita ayuda de forma general, pero no permite reconocer qué parte necesita aclarar.",
        "La solicitud se refiere a otra parte y mantiene el malentendido.",
        "No aporta una solicitud reconocible ante la dificultad planteada."
      ]
    },
    {
      "id": "understanding",
      "match": "indica\\w* (?:si|que|lo que) comprend\\w*|indicar comprension",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Indicación de comprensión",
      "levels": [
        "Comunica qué ha comprendido o qué necesita aclarar del mensaje en inglés mediante la respuesta acordada.",
        "Indica la comprensión principal; una parte de su respuesta necesita precisión.",
        "Da una respuesta general que no permite distinguir lo comprendido de la dificultad restante.",
        "La respuesta indica comprensión de una información diferente de la escuchada o leída.",
        "No aporta una indicación reconocible sobre la comprensión del mensaje."
      ]
    },
    {
      "id": "rehearsal",
      "match": "ensay\\w*|reproduccion de palabras|pautas de entonacion",
      "modes": [
        "oral",
        "interaction"
      ],
      "title": "Ensayo de palabras y entonación",
      "levels": [
        "Ensaya las palabras, expresiones o pautas de entonación solicitadas en inglés de forma que el mensaje resulte comprensible con los apoyos acordados.",
        "El ensayo permite comprender el mensaje; una expresión necesita otra repetición.",
        "Se comprenden palabras aisladas, pero el ensayo aún no permite seguir la expresión solicitada.",
        "La reproducción de la expresión cambia el sentido que debía comunicar.",
        "No aporta una reproducción reconocible de las expresiones solicitadas."
      ]
    },
    {
      "id": "situation",
      "match": "situacion de comunicacion|situacion comunicativa",
      "modes": [
        "writing",
        "oral",
        "interaction"
      ],
      "title": "Situación de comunicación",
      "levels": [
        "Identifica la situación de comunicación y a quién se dirige el mensaje en inglés que prepara.",
        "La situación y el destinatario se reconocen; una referencia necesita precisión.",
        "Reconoce solo la situación o el destinatario, sin relacionarlos entre sí.",
        "Asigna al mensaje una situación o un destinatario diferente del solicitado.",
        "No identifica una situación de comunicación pertinente para el mensaje."
      ]
    },
    {
      "id": "communicative-purpose",
      "match": "(?:establec\\w*|defin\\w*) (?:la )?(?:intencion|proposito) comunicativ\\w*",
      "modes": [
        "writing",
        "oral",
        "interaction"
      ],
      "title": "Intención de la producción",
      "levels": [
        "Establece la intención que orientará el mensaje en inglés en la situación propuesta.",
        "La intención es reconocible; una relación con la situación necesita precisión.",
        "Nombra el tema, pero no precisa para qué se comunica el mensaje.",
        "Plantea una intención que contradice la situación o el encargo.",
        "No aporta una intención reconocible para el mensaje que prepara."
      ]
    },
    {
      "id": "nonverbal-production",
      "match": "gestos|lenguaje no verbal|senales no verbales",
      "modes": [
        "oral",
        "interaction"
      ],
      "title": "Apoyo no verbal al mensaje",
      "levels": [
        "Utiliza los gestos o apoyos no verbales acordados para hacer comprensible el mensaje en inglés.",
        "Los apoyos permiten seguir el mensaje; un gesto necesita ajuste a lo expresado.",
        "Usa apoyos aislados sin vincularlos con las ideas comunicadas.",
        "Los gestos o apoyos contradicen el significado del mensaje.",
        "No aporta el apoyo no verbal solicitado para comunicar el mensaje."
      ]
    },
    {
      "id": "reading-purpose",
      "match": "(?:establec\\w*|defin\\w*) (?:el )?proposito de (?:la )?lectura",
      "modes": [
        "reading"
      ],
      "title": "Propósito de lectura",
      "levels": [
        "Define el propósito de lectura y la información que busca en el texto en inglés.",
        "El propósito permite orientar la lectura; una referencia a lo buscado necesita precisión.",
        "Menciona el tema del texto, pero no distingue qué información busca.",
        "Propone una búsqueda que no corresponde al encargo de lectura.",
        "No aporta un propósito reconocible para la lectura solicitada."
      ]
    },
    {
      "id": "hypothesis",
      "match": "hipotesis|elementos paratextuales",
      "modes": [
        "reading"
      ],
      "title": "Hipótesis a partir del paratexto",
      "levels": [
        "Formula una hipótesis de lectura relacionada con el título, las imágenes u otras pistas paratextuales disponibles del texto en inglés.",
        "La hipótesis se relaciona con las pistas; una relación necesita precisión.",
        "Nombra elementos del paratexto, pero no los integra en una hipótesis de lectura.",
        "La hipótesis contradice las pistas paratextuales disponibles.",
        "No aporta una hipótesis relacionada con el paratexto disponible."
      ]
    },
    {
      "id": "grapheme-phoneme",
      "match": "grafia y (?:el )?sonido|grafema.*fonema",
      "modes": [
        "reading"
      ],
      "title": "Correspondencia entre grafía y sonido",
      "levels": [
        "Relaciona la grafía y el sonido de las palabras en inglés solicitadas mediante la identificación acordada.",
        "Reconoce las correspondencias principales; una palabra necesita revisión.",
        "Reconoce algunas correspondencias, pero confunde otras palabras solicitadas.",
        "Asocia las grafías con sonidos que corresponden a palabras diferentes.",
        "No establece correspondencias reconocibles entre las grafías y los sonidos solicitados."
      ]
    },
    {
      "id": "annotation",
      "match": "subray\\w*|anot\\w*",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Selección de información pertinente",
      "levels": [
        "Selecciona información pertinente del mensaje en inglés mediante el subrayado o la anotación solicitada.",
        "Selecciona la información principal; una selección necesita precisión.",
        "Selecciona información aislada, pero omite datos necesarios para el propósito indicado.",
        "La selección corresponde a información ajena al propósito de comprensión.",
        "No aporta una selección reconocible de información pertinente."
      ]
    },
    {
      "id": "dictionary",
      "match": "consult\\w* (?:el |un )?diccionario|busqu\\w*.*diccionario",
      "modes": [
        "reading",
        "listening",
        "writing",
        "oral",
        "interaction"
      ],
      "title": "Consulta del diccionario",
      "levels": [
        "Selecciona una acepción del diccionario compatible con el uso de la palabra en el mensaje en inglés.",
        "La acepción permite comprender o expresar la idea principal; una elección necesita revisión.",
        "Encuentra una entrada, pero no distingue la acepción pertinente para el mensaje.",
        "Elige una acepción que cambia el sentido de la palabra en la situación.",
        "No aporta una acepción relacionada con la palabra y la situación planteadas."
      ]
    },
    {
      "id": "text-intention",
      "match": "intencion comunicativa del texto|intencion del texto",
      "modes": [
        "reading"
      ],
      "title": "Intención del texto leído",
      "levels": [
        "Identifica la intención del texto en inglés de acuerdo con el mensaje que comunica.",
        "La intención es reconocible; una relación con el mensaje necesita precisión.",
        "Identifica el tema, pero lo confunde con la intención del texto.",
        "Atribuye al texto una intención contraria a la información que comunica.",
        "No aporta una intención reconocible del texto leído."
      ]
    },
    {
      "id": "planning",
      "match": "planific\\w*|organizar(?:an)? (?:las )?ideas",
      "modes": [
        "writing"
      ],
      "title": "Planificación del mensaje escrito",
      "levels": [
        "La organización de ideas preparada permite desarrollar el mensaje en inglés para el propósito y destinatario solicitados.",
        "Las ideas principales permiten preparar el mensaje; una relación necesita ajuste.",
        "Reúne ideas aisladas, pero falta relacionarlas para desarrollar el mensaje.",
        "La planificación organiza ideas ajenas al propósito o destinatario del mensaje.",
        "No aporta una organización de ideas relacionada con el mensaje solicitado."
      ]
    },
    {
      "id": "revision",
      "match": "revis\\w* (?:el |un )?(?:borrador|mensaje|texto)|correg\\w* problemas",
      "modes": [
        "writing"
      ],
      "title": "Revisión de sentido y escritura",
      "levels": [
        "Los cambios realizados resuelven los problemas de sentido o escritura identificados en el mensaje en inglés.",
        "Los cambios resuelven los problemas principales; una relación necesita revisión.",
        "Modifica partes del mensaje, pero mantiene problemas identificados que dificultan comprenderlo.",
        "Los cambios introducen contradicciones o alteran la idea que se quería comunicar.",
        "No aporta cambios relacionados con los problemas de revisión planteados."
      ]
    },
    {
      "id": "association",
      "match": "asociaciones mentales|asociacion mental|asociaciones con acciones",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Asociaciones para comprender palabras",
      "levels": [
        "Establece una asociación entre la palabra o expresión en inglés y su significado mediante el recurso acordado.",
        "La asociación permite reconocer el significado; una relación necesita precisión.",
        "Relaciona elementos aislados, pero la asociación no permite recuperar el significado completo.",
        "La asociación atribuye a la palabra un significado diferente del solicitado.",
        "No aporta una asociación reconocible con el significado de la palabra."
      ]
    },
    {
      "id": "practice",
      "match": "oportunidades de uso|oportunidades de practica",
      "modes": [
        "writing",
        "oral",
        "interaction"
      ],
      "title": "Uso de la lengua en una situación acordada",
      "levels": [
        "Realiza una intervención breve en inglés pertinente para la oportunidad de comunicación acordada.",
        "La intervención permite comunicarse; una expresión necesita apoyo o aclaración.",
        "Aporta expresiones aisladas que no resuelven la necesidad comunicativa acordada.",
        "La intervención expresa una intención diferente de la situación propuesta.",
        "No aporta una intervención reconocible en la situación acordada."
      ]
    },
    {
      "id": "cultural-comparison",
      "match": "compar(?:a|an|ar|aran|ando|en|e|emos|acion|aciones)\\b.*(?:republica dominicana|otros? pais(?:es)?)",
      "modes": [
        "reading",
        "listening",
        "writing",
        "oral",
        "interaction"
      ],
      "title": "Comparación cultural con ejemplos",
      "levels": [
        "La comparación cultural relaciona los aspectos solicitados de República Dominicana y del otro contexto mediante los ejemplos disponibles, sin generalizarlos a todas las personas.",
        "Relaciona los aspectos principales de ambos contextos; un ejemplo necesita precisión.",
        "Menciona ejemplos de los contextos, pero no establece su semejanza o diferencia.",
        "La comparación contradice los ejemplos o atribuye a todas las personas un rasgo de un caso particular.",
        "No aporta una comparación reconocible entre los aspectos solicitados de ambos contextos."
      ]
    },
    {
      "id": "text-type",
      "match": "(?:seleccion\\w*|eleg\\w*|determin\\w*) (?:el )?tipo de texto",
      "modes": [
        "writing"
      ],
      "title": "Elección del tipo de texto",
      "levels": [
        "Selecciona un tipo de texto en inglés que permite cumplir el propósito y dirigirse al destinatario de la situación propuesta.",
        "El tipo de texto permite comunicar lo principal; una relación con el destinatario necesita precisión.",
        "Reconoce un tipo de texto, pero no lo relaciona con la necesidad comunicativa planteada.",
        "Elige un tipo de texto cuya función contradice el propósito del encargo.",
        "No aporta una elección reconocible del tipo de texto para la situación."
      ]
    }
  ],
  "englishGradeOneGenrePolicy": "BASIC_GENRE_INFORMATION_WITH_REQUESTED_EVIDENCE_PRIORITY_V1"
}
export const evaluationCatalogV40={...evaluationCatalogV39,...frozen}
