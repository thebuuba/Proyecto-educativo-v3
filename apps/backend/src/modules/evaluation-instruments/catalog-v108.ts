import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV107 } from './catalog-v107'
/** Exact108payload checked against Development; prior modules stay inherited. */
export const evaluationCatalogV108={...evaluationCatalogV107,version:'evaluation-2026.108',artCommonModules:[...evaluationCatalogV107.artCommonModules!,{
  "id": "educacion-artistica-comun-3",
  "grade": 3,
  "topics": [
    {
      "id": "photo-series",
      "grade": 3,
      "label": "fotografía artística y series narrativas",
      "match": "fotografias?|fotografica[a-z]*|serie de fotos",
      "relation": "las relaciones entre encuadre, orden visual y sentido del texto o referente narrativo de la serie fotográfica examinada, distinguiendo decisiones expresivas y registro documental",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "df00a3ee-78ca-5d22-92a5-aea4e5885f3d",
        "78e5bc56-6438-5e02-89f8-be2a0d23d830"
      ],
      "evidence": [
        {
          "id": "visual-sequence",
          "title": "Secuencia visual y referente",
          "success": "Organiza los encuadres y el orden de las fotografías de modo que sus relaciones hagan reconocible la secuencia y el sentido del texto o referente expresamente trabajado.",
          "sufficient": "La secuencia y el referente se reconocen; una transición visual secundaria queda poco definida sin alterar su sentido principal.",
          "partial": "Las imágenes se relacionan parcialmente con el referente, pero un encuadre o transición no permite reconocer un vínculo necesario.",
          "error": "El orden o los encuadres contradicen el referente trabajado y no permiten reconocer la secuencia visual solicitada.",
          "when": "serie|historia|texto|relato"
        },
        {
          "id": "single-frame",
          "title": "Encuadre y organización visual",
          "success": "Relaciona el encuadre y la disposición de los recursos visuales de la fotografía con la organización expresiva expresamente trabajada.",
          "sufficient": "La organización visual se reconoce en el encuadre; una relación secundaria queda poco definida sin alterar el sentido principal.",
          "partial": "El encuadre permite reconocer recursos pertinentes, pero una relación visual necesaria queda sin resolver.",
          "error": "El encuadre y la disposición de recursos no permiten reconocer la organización expresiva solicitada.",
          "when": "^(?!.*(?:serie|historia|texto|relato))"
        }
      ]
    },
    {
      "id": "photo-tone",
      "grade": 3,
      "label": "escala tonal en fotografía",
      "match": "escala tonal|luz y sombra|luz y la sombra",
      "relation": "las relaciones entre luz, sombra, contraste tonal y percepción del volumen en la fotografía examinada, usando evidencias visuales sin imponer edición digital",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "20e25c8b-a139-5898-a75c-2b1d39bd7f58"
      ],
      "evidence": [
        {
          "id": "tonal-organization",
          "title": "Organización tonal de la fotografía",
          "success": "Organiza las relaciones de luz y sombra de la fotografía para que la escala tonal y el volumen expresamente trabajados resulten reconocibles.",
          "sufficient": "La escala tonal y el volumen se reconocen; una relación secundaria de iluminación queda poco definida sin deshacer su organización.",
          "partial": "La fotografía muestra diferencias tonales, pero una relación de luz y sombra impide reconocer parte del volumen previsto.",
          "error": "Las relaciones de iluminación no permiten reconocer la escala tonal o el volumen expresamente solicitados."
        }
      ]
    },
    {
      "id": "photo-report",
      "grade": 3,
      "label": "fotorreportaje de acontecimientos",
      "match": "foto[- ]?r?reportaj[a-z]*",
      "relation": "las relaciones entre imágenes, secuencia, pies y datos documentados del fotorreportaje examinado, diferenciando registro, reconstrucción identificada e interpretación",
      "pdfPages": [
        334,
        335
      ],
      "sourceRecordIds": [
        "a511f217-468b-598b-a94c-fd617abafbfd",
        "530714d8-886b-5eb7-a278-8d78e9e2d364"
      ],
      "evidence": [
        {
          "id": "documented-images",
          "title": "Imágenes y evidencia del acontecimiento",
          "success": "Relaciona la selección y el orden de las imágenes con datos y pies identificables del acontecimiento dado, sin presentar inferencias como hechos documentados.",
          "sufficient": "El acontecimiento y sus evidencias se reconocen; una relación secundaria entre pie y dato queda poco precisada sin cambiar el sentido principal.",
          "partial": "Las imágenes aportan datos pertinentes, pero un pie o transición no se vincula con la evidencia del acontecimiento.",
          "error": "La secuencia o los pies contradicen los datos del acontecimiento o presentan como documentado algo que las evidencias no sostienen."
        }
      ]
    },
    {
      "id": "regional-film",
      "grade": 3,
      "label": "cine dominicano y caribeño",
      "match": "pelicula[a-z]* dominican[a-z]*|pelicula[a-z]*.*cariben[a-z]*|cine dominicano|cine caribeno",
      "relation": "las relaciones entre problemática representada, contexto y recursos temáticos y técnicos de las películas dominicanas o caribeñas expresamente examinadas, argumentando con evidencias de la obra sin revelar experiencias privadas",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "52b0d8da-2bc4-5c63-b25e-d25eeca1e41b",
        "022c6960-716e-5edc-9f95-313ae2223a0a"
      ],
      "evidence": [
        {
          "id": "regional-film-decisions",
          "title": "Recursos y problemática del corto",
          "success": "Relaciona los recursos audiovisuales elegidos con la problemática y el contexto de la propuesta cinematográfica expresamente acordada.",
          "sufficient": "La problemática y el contexto se reconocen; un recurso audiovisual secundario queda poco definido sin cambiar el sentido principal.",
          "partial": "La propuesta presenta recursos pertinentes, pero una relación con la problemática o el contexto queda sin resolver.",
          "error": "Los recursos no permiten reconocer la problemática o contradicen las condiciones expresamente acordadas."
        }
      ]
    },
    {
      "id": "film-screening",
      "grade": 3,
      "label": "muestras y festivales de cine",
      "match": "muestra[a-z]*.*cine|muestra escolar|festival[a-z]*.*cine",
      "relation": "las funciones de selección, programación y difusión de las muestras o festivales de cine examinados, relacionándolas con su público y condiciones",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "a499507f-1049-52cd-acd6-a82f9e83b6d3",
        "ffafec41-5fa7-598b-81eb-1fd2fe3429a9"
      ],
      "evidence": [
        {
          "id": "screening-program",
          "title": "Selección, secuencia y condiciones de la muestra",
          "success": "Organiza la selección y el orden de las obras de la muestra relacionando su propósito, público y recursos con las condiciones de acceso expresamente acordadas.",
          "sufficient": "La muestra mantiene su propósito y condiciones principales; una decisión secundaria de orden o recurso queda poco definida.",
          "partial": "La programación incluye obras pertinentes, pero una relación con el público, el orden o los recursos queda sin resolver.",
          "error": "La selección o la organización contradicen las condiciones dadas y no permiten realizar la muestra prevista.",
          "plan": {
            "title": "Plan de selección y organización de la muestra",
            "success": "Planifica la selección y el orden de las obras, los recursos disponibles y las condiciones del público para que la muestra escolar prevista resulte coherente y realizable.",
            "sufficient": "El plan relaciona obras, público y recursos; una condición secundaria queda poco precisada sin impedir la propuesta.",
            "partial": "El plan presenta obras pertinentes, pero una relación entre orden, recursos o condiciones del público queda sin resolver.",
            "error": "Las decisiones del plan contradicen las condiciones dadas o impiden realizar la muestra prevista."
          }
        }
      ]
    },
    {
      "id": "fiction-short",
      "grade": 3,
      "label": "cortos de ficción de contenido social",
      "match": "corto[a-z]* de ficcion",
      "relation": "las relaciones entre acciones ficticias, secuencia audiovisual y mensaje social en el corto de ficción examinado, diferenciando una representación imaginada de un registro documental",
      "pdfPages": [
        334,
        335
      ],
      "sourceRecordIds": [
        "a02f5e11-da19-564e-9632-96d48bf18aee",
        "8499298e-4589-59ed-96e2-2ed5a1e369ab"
      ],
      "evidence": [
        {
          "id": "fiction-audiovisual",
          "title": "Secuencia y sentido de la ficción",
          "success": "Relaciona las acciones, la secuencia audiovisual y los recursos disponibles del corto para hacer reconocible el mensaje social ficticio acordado, diferenciando ficción y registro documental.",
          "sufficient": "El mensaje y la secuencia se reconocen; una transición audiovisual secundaria queda poco definida sin cambiar el sentido principal.",
          "partial": "La secuencia presenta acciones pertinentes, pero una relación audiovisual no contribuye al sentido de la ficción.",
          "error": "Las acciones o los recursos no permiten reconocer el sentido de la ficción acordada o se presentan sus hechos como documentación real.",
          "plan": {
            "title": "Plan audiovisual de la ficción",
            "success": "Planifica la secuencia de escenas, los recursos y el mensaje ficticio del corto de modo coherente con las condiciones disponibles, sin exigir filmación ejecutada.",
            "sufficient": "El plan relaciona escenas, recursos y mensaje; una transición secundaria queda poco precisada.",
            "partial": "El plan presenta escenas pertinentes, pero una relación con los recursos o el mensaje queda sin resolver.",
            "error": "Las escenas o los recursos del plan contradicen el sentido ficticio acordado o impiden realizar la propuesta."
          }
        }
      ]
    },
    {
      "id": "documentary-short",
      "grade": 3,
      "label": "cortos documentales",
      "match": "corto[a-z]* documental[a-z]*|corto documental",
      "relation": "las relaciones entre afirmaciones, imágenes, datos y montaje del corto documental examinado, distinguiendo hechos documentados, reconstrucciones identificadas e interpretación",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "a02f5e11-da19-564e-9632-96d48bf18aee"
      ],
      "evidence": [
        {
          "id": "documentary-evidence",
          "title": "Afirmaciones y evidencia documental",
          "success": "Vincula las afirmaciones y el montaje del corto con imágenes y datos identificables del caso, diferenciando evidencia, reconstrucción expresamente identificada e interpretación.",
          "sufficient": "Las afirmaciones principales se relacionan con evidencias identificables; una relación secundaria de montaje queda poco precisada.",
          "partial": "El corto presenta datos pertinentes, pero una afirmación o transición no se vincula con su evidencia.",
          "error": "El corto presenta afirmaciones incompatibles con los datos o hace pasar por hechos documentados elementos que no están sustentados."
        }
      ]
    },
    {
      "id": "shadow-theatre",
      "grade": 3,
      "label": "teatro de sombras",
      "match": "teatro de sombras|siluetas.*proyeccion",
      "relation": "las relaciones de silueta, luz, superficie de proyección y movimiento de los ejemplos de teatro de sombras, distinguiéndolas de las convenciones de visibilidad del teatro negro",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "edabaee9-034f-5d3d-8567-8372c7b557a1",
        "6773b203-b0e2-556f-ab7a-d4fa0e46f1b8"
      ],
      "evidence": [
        {
          "id": "shadow-projection",
          "title": "Proyección y acción de las sombras",
          "success": "Relaciona las siluetas, sus posiciones y movimientos con la luz y la superficie de proyección acordadas para hacer reconocible la acción de la escena ficticia.",
          "sufficient": "La acción y sus siluetas se reconocen; una relación secundaria de posición o movimiento queda poco definida sin cambiar el sentido principal.",
          "partial": "Las siluetas se reconocen parcialmente, pero una posición o movimiento dificulta la acción expresamente trabajada.",
          "error": "La disposición de luz, siluetas o movimiento no permite reconocer la acción escénica acordada.",
          "plan": {
            "title": "Plan de luz, siluetas y movimiento",
            "success": "Planifica las posiciones de siluetas, luz y superficie y su relación con el movimiento de la escena, utilizando los recursos seguros dados sin exigir representación ejecutada.",
            "sufficient": "El plan relaciona luz, siluetas y movimiento; una posición secundaria queda poco precisada.",
            "partial": "El plan muestra los elementos centrales, pero una relación de posición o movimiento no permite seguir parte de la escena.",
            "error": "Las posiciones o movimientos previstos impiden reconocer la proyección o la acción de la escena."
          }
        }
      ]
    },
    {
      "id": "black-theatre",
      "grade": 3,
      "label": "teatro negro",
      "match": "teatro negro",
      "relation": "las relaciones entre visibilidad, ocultamiento, objetos, intérpretes y acción en los ejemplos de teatro negro, diferenciándolas de la proyección de siluetas del teatro de sombras",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "edabaee9-034f-5d3d-8567-8372c7b557a1",
        "6773b203-b0e2-556f-ab7a-d4fa0e46f1b8"
      ],
      "evidence": [
        {
          "id": "black-visibility",
          "title": "Visibilidad, ocultamiento y acción",
          "success": "Relaciona la visibilidad y el ocultamiento acordados de objetos e intérpretes con sus movimientos para hacer reconocible la acción de la escena de teatro negro con los recursos seguros dados.",
          "sufficient": "La acción y la convención de visibilidad se reconocen; un movimiento secundario deja una ambigüedad sin cambiar el sentido principal.",
          "partial": "Se reconocen objetos o movimientos, pero una relación de visibilidad no permite seguir parte de la acción.",
          "error": "La disposición de visibilidad y movimiento contradice las condiciones acordadas e impide reconocer la acción escénica.",
          "plan": {
            "title": "Plan de visibilidad y acción del teatro negro",
            "success": "Planifica las relaciones de visibilidad, ocultamiento, objetos y movimientos según los recursos seguros dados para hacer realizable la escena de teatro negro, sin exigir su representación.",
            "sufficient": "El plan relaciona visibilidad y acción; un movimiento o recurso secundario queda poco precisado.",
            "partial": "El plan presenta objetos y acciones, pero una relación de visibilidad o movimiento queda sin resolver.",
            "error": "Las condiciones de visibilidad o movimiento del plan impiden realizar la escena prevista con los recursos dados."
          }
        }
      ]
    },
    {
      "id": "stage-objects",
      "grade": 3,
      "label": "objetos y espacios del teatro de luz",
      "match": "muñec[a-z]*|munec[a-z]*|construye.*objeto.*sombras|espacios.*teatro negro",
      "relation": "las relaciones entre forma, material, articulación o disposición y función escénica del objeto o espacio expresamente examinado para teatro negro o de sombras",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "37169566-1893-506b-baf0-cb57c6c7f7f3"
      ],
      "evidence": [
        {
          "id": "scenic-object-function",
          "title": "Forma y función del recurso escénico",
          "success": "Relaciona la forma, el material y las articulaciones o uniones expresamente requeridas del recurso elegido con la función de luz y movimiento de la escena dada.",
          "sufficient": "La función escénica se reconoce; una unión o detalle formal secundario queda poco definido sin impedir su uso previsto.",
          "partial": "El recurso permite reconocer parte de su función, pero una relación de forma o unión dificulta el movimiento pedido.",
          "error": "La forma o las uniones impiden la función escénica requerida o contradicen las condiciones del recurso expresamente pedido."
        }
      ]
    },
    {
      "id": "video-dance",
      "grade": 3,
      "label": "videodanza y relación de cámara y movimiento",
      "match": "video[- ]?danza",
      "relation": "las relaciones entre encuadre, movimiento, espacio y secuencia temporal de la videodanza examinada, usando evidencias audiovisuales y respetando las adaptaciones dadas",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "530cfe6b-d857-56e5-8e27-ff5338b953e8",
        "789bac58-d9a7-596a-8cb4-f4d12cd4b18e"
      ],
      "evidence": [
        {
          "id": "camera-movement",
          "title": "Relación entre cámara y movimiento",
          "success": "Relaciona encuadres, movimientos adaptados y secuencia temporal de la videodanza para que las decisiones de cámara contribuyan al sentido de la propuesta acordada.",
          "sufficient": "La relación entre cámara y movimiento se reconoce; una transición secundaria queda poco definida sin romper la secuencia principal.",
          "partial": "La propuesta muestra movimientos y encuadres pertinentes, pero una relación entre ellos no permite seguir parte de la secuencia.",
          "error": "Las decisiones de cámara y movimiento no presentan una relación reconocible con el sentido de la videodanza acordada.",
          "plan": {
            "title": "Plan de cámara y movimiento",
            "success": "Planifica encuadres, movimientos adaptados y secuencia temporal de modo que sus relaciones hagan realizable el sentido de la videodanza, sin exigir filmación o danza ejecutadas.",
            "sufficient": "El plan relaciona cámara, movimiento y tiempo; una transición secundaria queda poco precisada.",
            "partial": "El plan presenta encuadres y movimientos, pero una relación temporal o espacial queda sin resolver.",
            "error": "Las decisiones del plan contradicen las condiciones dadas o impiden reconocer la relación entre cámara y movimiento."
          }
        }
      ]
    },
    {
      "id": "dance-audiovisual",
      "grade": 3,
      "label": "danza en medios audiovisuales",
      "match": "videoclip|video clip|danza en el cine|danza en medios audiovisuales",
      "relation": "las funciones de la cámara, el movimiento y la secuencia de la danza en los medios audiovisuales expresamente comparados, distinguiendo sus propósitos sin exigir otro producto",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "1199f4c7-3cab-5334-991c-2d384ec45a90"
      ],
      "evidence": [
        {
          "id": "audiovisual-dance-function",
          "title": "Función de movimiento y cámara en el medio",
          "success": "Relaciona las decisiones de movimiento y cámara con la función de la danza en el medio audiovisual expresamente trabajado.",
          "sufficient": "La función se reconoce en las decisiones principales; una relación secundaria queda poco definida.",
          "partial": "Se reconocen recursos de movimiento y cámara, pero una relación con la función del medio queda sin resolver.",
          "error": "Los recursos no permiten reconocer la función de la danza en el medio expresamente solicitado."
        }
      ]
    },
    {
      "id": "web-stage",
      "grade": 3,
      "label": "montajes escénicos inspirados en la web",
      "match": "montaje[a-z]* web|inspirad[a-z]*.*montaje.*web|montaje[a-z]*.*encontrad[a-z]*.*web",
      "relation": "las relaciones entre el referente escénico web, la adaptación de acciones y los recursos disponibles en los ejemplos examinados, distinguiendo referencia y copia literal",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "88ca97f9-4767-5253-816d-435e50c27b8a",
        "5ea0dade-95f4-5f00-b8a0-681fcb02c18f"
      ],
      "evidence": [
        {
          "id": "adapted-web-scene",
          "title": "Referencia y adaptación escénica",
          "success": "Relaciona las acciones y recursos del fragmento representado con rasgos identificables del referente web, adaptándolos al espacio disponible y distinguiendo la referencia de una copia literal.",
          "sufficient": "La referencia y la adaptación se reconocen; una decisión escénica secundaria queda poco definida sin cambiar el sentido principal.",
          "partial": "Se reconoce un rasgo del referente, pero una adaptación de acción o recurso no se vincula con el espacio disponible.",
          "error": "Las acciones o los recursos contradicen las condiciones de la adaptación y no permiten reconocer la relación con el referente trabajado."
        }
      ]
    },
    {
      "id": "stage-appreciation",
      "grade": 3,
      "label": "apreciación de teatro y danza",
      "match": "fragmentos audiovisuales de teatro y danza|apreciacion de teatro y danza",
      "relation": "las relaciones temáticas, técnicas y expresivas de los fragmentos de teatro o danza examinados, usando evidencias de sus medios sin exigir asistencia presencial o preferencias personales",
      "pdfPages": [
        334,
        335
      ],
      "sourceRecordIds": [
        "fa45b35d-3f0a-55e7-99c2-2f908bd1310b",
        "c21174f7-9b4f-5cd5-813b-790d4af897f5"
      ],
      "evidence": [
        {
          "id": "stage-analysis",
          "title": "Recursos y sentido escénico",
          "success": "Sostiene una interpretación de la obra mediante relaciones entre sus recursos escénicos y evidencias reconocibles de su sentido.",
          "sufficient": "La interpretación se sostiene en recursos y evidencias pertinentes; una relación secundaria queda poco precisada.",
          "partial": "La interpretación reconoce recursos pertinentes, pero una afirmación no se vincula con evidencias de la obra.",
          "error": "La interpretación contradice la obra o sustituye la evidencia por juicios sobre las personas."
        }
      ]
    },
    {
      "id": "musical-language",
      "grade": 3,
      "label": "lenguaje musical y comunicación",
      "match": "lenguaje musical|respuesta musical.*comunicar",
      "relation": "las relaciones entre recursos sonoros y la idea ficticia o sentido comunicativo del fragmento musical examinado, distinguiendo lo expresado en la obra y los sentimientos privados de las personas",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "8ffcf1f1-1f4d-5f30-885e-755d53ef5480",
        "350141d8-2535-5811-a18d-482ba9c22913"
      ],
      "evidence": [
        {
          "id": "musical-message",
          "title": "Recursos sonoros y sentido expresivo",
          "success": "Relaciona los recursos del medio sonoro elegido con el mensaje o idea ficticia acordados para hacer reconocible su sentido musical, sin exigir todos los medios disponibles.",
          "sufficient": "La idea se reconoce en los recursos sonoros; una elección secundaria deja una ambigüedad sin cambiar el sentido principal.",
          "partial": "Los recursos permiten reconocer parte de la idea, pero una decisión sonora no se vincula con el sentido acordado.",
          "error": "Los recursos sonoros no permiten reconocer el sentido musical expresamente trabajado."
        }
      ]
    },
    {
      "id": "musicalization",
      "grade": 3,
      "label": "musicalización de imágenes, escenas y ambientes",
      "match": "musicaliza[a-z]*|musicalizacion",
      "relation": "las relaciones entre entradas, ritmo, carácter sonoro y sentido del referente visual, escénico o ambiental expresamente musicalizado",
      "pdfPages": [
        334,
        335
      ],
      "sourceRecordIds": [
        "7d467f0d-f8f9-553c-8231-ee59481f9986",
        "35a42d92-530e-525f-b011-a9a5057f42ed",
        "0c7c37e5-0d85-5915-baf2-bbc7cb17fa11"
      ],
      "evidence": [
        {
          "id": "music-reference",
          "title": "Música y sentido del referente",
          "success": "Relaciona entradas, ritmo y carácter de la música con las acciones o relaciones del referente expresamente dado, de modo que las decisiones sonoras contribuyan a su sentido.",
          "sufficient": "La música y el referente se relacionan; una entrada o transición secundaria queda poco definida sin cambiar el sentido principal.",
          "partial": "La música aporta recursos pertinentes, pero una entrada o relación sonora no se vincula con el referente.",
          "error": "Las decisiones sonoras contradicen el referente dado o no permiten reconocer su función en la propuesta."
        }
      ]
    },
    {
      "id": "social-song",
      "grade": 3,
      "label": "mensajes de himnos y canciones sociales",
      "match": "himno[a-z]*|cancion[a-z]*.*social|cancion de contenido social",
      "relation": "las relaciones entre mensaje, recursos musicales y verbales y contexto de los himnos o canciones de contenido social examinados, usando evidencias sin exigir adhesión política o emocional",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "42f52ff2-15db-5a0c-960f-23c7f0f9c06f",
        "0904b2b7-fe7d-5a65-ae54-9ddf742d6d22",
        "baea648b-a0a0-5aa4-a346-b0064108783f"
      ],
      "evidence": [
        {
          "id": "social-musical-message",
          "title": "Relación entre mensaje, letra y música",
          "success": "Relaciona el mensaje ficticio de contenido social con la letra y los recursos musicales elegidos para que su sentido sea reconocible sin imponer una postura predeterminada.",
          "sufficient": "El mensaje y las relaciones entre letra y música se reconocen; una elección secundaria deja una ambigüedad sin cambiar el sentido principal.",
          "partial": "La canción permite reconocer parte del mensaje, pero una relación entre letra y recursos musicales queda sin resolver.",
          "error": "La letra y los recursos musicales no permiten reconocer el sentido social acordado o contradicen las condiciones del caso dado."
        }
      ]
    },
    {
      "id": "music-function",
      "grade": 3,
      "label": "función de la música en cine y escena",
      "match": "tema musical.*(?:cine|cinematografic|teatro)|musica.*escena|funcion de la musica",
      "relation": "las relaciones entre recursos sonoros, acciones y sentido de la escena de cine, teatro o revista musical expresamente examinada",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "3396ccdc-1575-5a05-9070-5c0a147bc66c",
        "463d4b1d-7588-5bee-943d-2e56ab3ca52e"
      ],
      "evidence": [
        {
          "id": "scene-musical-function",
          "title": "Función de los recursos sonoros",
          "success": "Relaciona las decisiones sonoras elegidas con las acciones y el sentido de la escena expresamente trabajada.",
          "sufficient": "La función de la música se reconoce; una relación secundaria con la escena queda poco definida.",
          "partial": "Los recursos se relacionan con parte de la escena, pero una decisión sonora no contribuye a su sentido.",
          "error": "Las decisiones sonoras no presentan una relación reconocible con las acciones o el sentido pedido."
        }
      ]
    },
    {
      "id": "musical-appreciation",
      "grade": 3,
      "label": "apreciación de obras musicales",
      "match": "obra musical.*audicion|apreciacion de obras musicales",
      "relation": "las relaciones técnicas y expresivas de la obra musical examinada, usando evidencias escuchadas y los criterios dados sin exigir presencia en vivo o preferencias personales",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "28449e1c-8183-5abc-834f-50eda80e9549"
      ],
      "evidence": [
        {
          "id": "heard-evidence",
          "title": "Argumentos y evidencia musical",
          "success": "Relaciona sus afirmaciones sobre la obra con criterios técnicos o expresivos dados y con evidencias sonoras reconocibles de la audición.",
          "sufficient": "Las afirmaciones se vinculan con criterios y evidencias; una relación secundaria queda poco precisada.",
          "partial": "Presenta afirmaciones pertinentes, pero una no se vincula con el criterio o la evidencia sonora utilizada.",
          "error": "Las afirmaciones contradicen la audición o sustituyen las evidencias por juicios sobre el gusto de las personas."
        }
      ]
    },
    {
      "id": "ambient-programming",
      "grade": 3,
      "label": "selección y programación de música ambiental",
      "match": "musica ambiental|programa[a-z]* musica|selecciona[a-z]*.*musica.*espacio",
      "relation": "las relaciones entre selección, secuencia y función de la música ambiental y las condiciones del público y espacio de la programación examinada",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "7a6829f2-4c99-5b51-b5cc-cf2674b6050c",
        "3396ccdc-1575-5a05-9070-5c0a147bc66c"
      ],
      "evidence": [
        {
          "id": "ambient-music-plan",
          "title": "Selección, secuencia y función ambiental",
          "success": "Organiza la selección y la secuencia musical relacionando su función con el público, el espacio y las condiciones expresamente dadas, diferenciando una programación simulada de una presentación ejecutada.",
          "sufficient": "La programación se relaciona con el público y el espacio; una transición secundaria queda poco definida sin impedir su función principal.",
          "partial": "La programación incluye música pertinente, pero una relación entre secuencia, público o condiciones del espacio queda sin resolver.",
          "error": "La selección o la secuencia contradicen las condiciones del espacio o no permiten reconocer la función ambiental solicitada."
        }
      ]
    },
    {
      "id": "illustration",
      "grade": 3,
      "label": "ilustración como síntesis visual",
      "match": "ilustra[a-z]*|ilustracion[a-z]*",
      "relation": "las relaciones entre rasgos visuales seleccionados y contenido central del texto o referente de la ilustración examinada, distinguiendo síntesis y copia literal",
      "pdfPages": [
        334,
        335
      ],
      "sourceRecordIds": [
        "549864e5-dd71-5673-b2e6-fb72771c5f94",
        "ecbb1b4d-c642-574c-94d1-8170ad2376d4"
      ],
      "evidence": [
        {
          "id": "visual-synthesis",
          "title": "Síntesis visual del referente",
          "success": "Selecciona y relaciona rasgos visuales que hacen reconocibles las relaciones centrales del texto o referente dado en la ilustración, sin copiar cada parte ni añadir información contradictoria.",
          "sufficient": "Las relaciones centrales se reconocen; un detalle visual secundario queda ambiguo sin cambiar el sentido principal.",
          "partial": "La ilustración presenta rasgos del referente, pero una relación central queda sin resolver o se pierde entre detalles accesorios.",
          "error": "Las decisiones visuales contradicen el referente o no permiten reconocer sus relaciones centrales."
        }
      ]
    },
    {
      "id": "industrial-design",
      "grade": 3,
      "label": "diseño industrial de objetos de uso",
      "match": "diseno industrial|objeto de uso comun",
      "relation": "las relaciones entre forma, material, función y condiciones de uso del diseño industrial examinado, distinguiendo propuesta, modelo de comprobación y objeto definitivo",
      "pdfPages": [
        334,
        335
      ],
      "sourceRecordIds": [
        "d51b6c79-7d12-5c8a-904d-7af7527416df",
        "ecbb1b4d-c642-574c-94d1-8170ad2376d4"
      ],
      "evidence": [
        {
          "id": "object-use",
          "title": "Forma, material y función del objeto",
          "success": "Relaciona la forma y los materiales disponibles con la función y las condiciones de uso expresamente dadas en la propuesta o modelo solicitado, sin exigir fabricar un objeto definitivo.",
          "sufficient": "La función y las relaciones principales se reconocen; una decisión secundaria de forma o material queda poco definida sin impedir el uso previsto.",
          "partial": "La propuesta o modelo permite reconocer la función, pero una relación entre forma, material y uso queda sin resolver.",
          "error": "Las decisiones contradicen las condiciones de uso o impiden reconocer la función solicitada."
        }
      ]
    },
    {
      "id": "creative-portfolio",
      "grade": 3,
      "label": "portafolio o informe creativo de propuestas",
      "match": "portafolio|informe creativo",
      "relation": "las relaciones entre organización de evidencias, técnicas, terminología y decisiones de las propuestas investigadas en el portafolio o informe creativo examinado, sin exigir ambos formatos",
      "pdfPages": [
        334
      ],
      "sourceRecordIds": [
        "13438001-bc37-57ed-b578-d5552c5d31d9"
      ],
      "evidence": [
        {
          "id": "creative-evidence",
          "title": "Evidencias, técnicas y decisiones",
          "success": "Organiza las evidencias de las propuestas investigadas en el formato elegido y relaciona técnicas, decisiones y terminología artística con ejemplos identificables de los trabajos.",
          "sufficient": "Las evidencias y sus relaciones principales se reconocen; una explicación técnica secundaria queda poco precisada.",
          "partial": "El conjunto presenta evidencias pertinentes, pero una relación entre técnica y decisión no queda sustentada por el ejemplo utilizado.",
          "error": "Las evidencias no permiten reconocer las propuestas investigadas o la terminología contradice los trabajos examinados."
        }
      ]
    },
    {
      "id": "art-integration",
      "grade": 3,
      "label": "integración de disciplinas artísticas",
      "match": "integra[a-z]*.*imagen y.*sonido|integracion de disciplinas|integre la imagen",
      "relation": "las relaciones expresivas y funcionales entre los recursos de las disciplinas artísticas expresamente integradas en los ejemplos dados, sin exigir otras disciplinas",
      "pdfPages": [
        335
      ],
      "sourceRecordIds": [
        "b1c56da7-5577-55e1-aa9d-cc3a84663491"
      ],
      "evidence": [
        {
          "id": "integrated-resources",
          "title": "Relación entre los lenguajes elegidos",
          "success": "Relaciona los recursos de las disciplinas expresamente elegidas para que su integración contribuya al mensaje ficticio acordado y cada medio cumpla una función reconocible.",
          "sufficient": "La integración y el mensaje se reconocen; una relación secundaria entre los medios queda poco definida.",
          "partial": "Los medios aportan recursos pertinentes, pero una relación entre sus funciones no contribuye al mensaje acordado.",
          "error": "Los recursos no presentan una relación reconocible entre las disciplinas elegidas o contradicen el mensaje acordado."
        }
      ]
    },
    {
      "id": "artistic-promotion",
      "grade": 3,
      "label": "promoción artística en medios disponibles",
      "match": "promover la obra|promover.*evento|simulacion de publicacion|promocion artistica",
      "relation": "las relaciones entre mensaje, público, plataforma y recursos de la difusión artística examinada, distinguiendo una simulación de una publicación efectiva y respetando las condiciones dadas",
      "pdfPages": [
        335
      ],
      "sourceRecordIds": [
        "3780ea6b-626a-594c-a844-3b8552dead5b",
        "3200fba5-cbc9-5549-a5a8-c8dc183f67c2"
      ],
      "evidence": [
        {
          "id": "promotion-message",
          "title": "Mensaje, público y medio de difusión",
          "success": "Relaciona el mensaje y los recursos de la propuesta de difusión con el público y el medio disponibles, identificando obra y evento ficticios sin publicar ni utilizar datos personales reales cuando la consigna pide simulación.",
          "sufficient": "La obra o evento y el público se reconocen; un recurso secundario del medio queda poco definido sin impedir la comunicación principal.",
          "partial": "La propuesta identifica la obra o evento, pero una relación entre mensaje, público y medio queda sin resolver.",
          "error": "Los recursos no permiten reconocer la difusión solicitada o contradicen las condiciones expresas de simulación y privacidad."
        }
      ]
    },
    {
      "id": "web-diffusion",
      "grade": 3,
      "label": "web como espacio de difusión de las artes",
      "match": "importancia.*web|web.*difusion|limites.*web",
      "relation": "las relaciones entre acceso, público, medios y límites de la web como espacio de difusión artística, usando evidencias de las fuentes examinadas sin exigir cuentas ni publicación real",
      "pdfPages": [
        335
      ],
      "sourceRecordIds": [
        "26a7ffd5-bfc8-5340-9173-344bcb0c6cdd"
      ],
      "evidence": [
        {
          "id": "web-diffusion-reasons",
          "title": "Razones y evidencia sobre difusión",
          "success": "Sostiene sus afirmaciones sobre la difusión artística en la web con razones y evidencias relacionadas con acceso, público y medios del caso dado.",
          "sufficient": "Las afirmaciones se sostienen en evidencias pertinentes; una relación secundaria queda poco precisada.",
          "partial": "Presenta razones pertinentes, pero una de ellas no se relaciona con evidencias del caso o con las condiciones del medio.",
          "error": "Las razones contradicen las evidencias o sustituyen el análisis por afirmaciones sin sustento."
        }
      ]
    },
    {
      "id": "arts-health",
      "grade": 3,
      "label": "artes y aportes a la salud",
      "match": "artes.*salud fisica y mental|aportes.*artes.*salud",
      "relation": "las relaciones entre los aportes y límites atribuidos a las artes para intérpretes o audiencia y las evidencias de las fuentes dadas, diferenciando argumentación, diagnóstico y garantías terapéuticas",
      "pdfPages": [
        335,
        334
      ],
      "sourceRecordIds": [
        "97b2d47e-92ab-59ef-a740-7b2ce3c2e9a4",
        "304148cc-47fe-5aef-9500-776798a57821"
      ],
      "evidence": [
        {
          "id": "bounded-health-argument",
          "title": "Aportes y límites sustentados",
          "success": "Relaciona sus afirmaciones sobre los aportes y límites de las artes con evidencias identificables de las fuentes dadas, sin convertirlas en diagnósticos ni garantías terapéuticas.",
          "sufficient": "Las afirmaciones centrales y sus límites se sostienen en fuentes; una relación secundaria queda poco precisada.",
          "partial": "Presenta un aporte pertinente, pero una afirmación o un límite no queda relacionado con la evidencia utilizada.",
          "error": "Las afirmaciones contradicen las fuentes o presentan diagnósticos o garantías que sus evidencias no sostienen."
        }
      ]
    },
    {
      "id": "social-impact",
      "grade": 3,
      "label": "arte y contenido e impacto social",
      "match": "impacto social|contenido y.*impacto",
      "relation": "las relaciones entre contenido, recursos expresivos y afirmaciones sobre impacto social de la obra examinada, diferenciando evidencia, interpretación y supuestos sobre la audiencia",
      "pdfPages": [
        334,
        335
      ],
      "sourceRecordIds": [
        "c39f23e3-4de1-5831-80e1-df6cb9cf62c2",
        "9745120f-f113-54fe-ab32-ff73d4345389",
        "b48bc818-bf48-5031-88c8-643adde4488f"
      ],
      "evidence": [
        {
          "id": "social-art-evidence",
          "title": "Contenido social y evidencia del caso",
          "success": "Relaciona las decisiones expresivas con el contenido social del caso dado y distingue los efectos sustentados en evidencias de las interpretaciones sobre su audiencia.",
          "sufficient": "El contenido y las evidencias centrales se relacionan; una interpretación secundaria queda poco precisada.",
          "partial": "Se reconoce contenido social pertinente, pero una afirmación de efecto no se vincula con la evidencia utilizada.",
          "error": "Las afirmaciones de impacto contradicen los datos o atribuyen emociones a la audiencia sin evidencia que las sostenga."
        }
      ]
    },
    {
      "id": "artistic-collaboration",
      "grade": 3,
      "label": "colaboración en creaciones artísticas",
      "match": "frecuencia.*rol|colaboracion en creaciones|agrupaciones artisticas",
      "relation": "las relaciones entre acciones observables de los roles, acuerdos y contribuciones de la creación artística examinada, sin inferir personalidad ni simpatía",
      "pdfPages": [
        335
      ],
      "sourceRecordIds": [
        "ac46a190-dbe4-5f14-a3ca-6eaaf4827307"
      ],
      "evidence": [
        {
          "id": "observed-contribution",
          "title": "Acciones del rol y acuerdos de creación",
          "success": "Realiza las acciones concretas de su rol y los acuerdos de la creación artística grupal en todas las oportunidades observadas.",
          "sufficient": "Realiza las acciones concretas de su rol y los acuerdos en casi todas las oportunidades observadas.",
          "partial": "Realiza las acciones concretas de su rol y los acuerdos en algunas oportunidades observadas.",
          "error": "Realiza las acciones concretas de su rol y los acuerdos en pocas oportunidades observadas.",
          "absent": "No realiza las acciones concretas de su rol y los acuerdos en las oportunidades observadas de creación artística."
        }
      ]
    },
    {
      "id": "popular-art",
      "grade": 3,
      "label": "manifestaciones artísticas populares",
      "match": "manifestacion artistica popular|manifestaciones artisticas populares",
      "relation": "las características de recursos, contexto y sentido de la manifestación artística popular examinada, usando evidencias de los ejemplos sin exigir adhesión cultural",
      "pdfPages": [
        335
      ],
      "sourceRecordIds": [
        "e4290c77-f622-52a9-a385-948ba52faff5"
      ],
      "evidence": [
        {
          "id": "popular-art-reference",
          "title": "Recursos y referente popular",
          "success": "Relaciona las decisiones de la propuesta con rasgos reconocibles del referente artístico popular expresamente trabajado.",
          "sufficient": "El referente se reconoce en las decisiones principales; una relación secundaria queda poco definida.",
          "partial": "Se reconoce un rasgo del referente, pero su función no se integra con la propuesta.",
          "error": "Las decisiones no permiten reconocer una relación con el referente artístico popular pedido."
        }
      ]
    },
    {
      "id": "identity-in-art",
      "grade": 3,
      "label": "elementos identitarios representados en las obras",
      "match": "elementos identitarios",
      "relation": "las relaciones entre símbolos, recursos y contexto representados en las obras examinadas, distinguiendo evidencia de la obra y atributos privados de las personas",
      "pdfPages": [
        335
      ],
      "sourceRecordIds": [
        "ffc02472-e0ae-551a-8527-c49a43cdb12f"
      ],
      "evidence": [
        {
          "id": "identity-work-evidence",
          "title": "Recursos y contexto de la obra",
          "success": "Relaciona los recursos expresivos de la propuesta con el contexto representado mediante rasgos reconocibles del referente dado, sin exigir revelar identidad privada.",
          "sufficient": "El contexto se reconoce en las decisiones principales; una relación secundaria queda poco definida.",
          "partial": "La propuesta presenta un rasgo contextual, pero una relación con el referente queda sin resolver.",
          "error": "Las decisiones no permiten reconocer el contexto representado o sustituyen la evidencia por juicios sobre la identidad de las personas."
        }
      ]
    },
    {
      "id": "heritage-art",
      "grade": 3,
      "label": "aportes de artes pasadas al patrimonio",
      "match": "obra.*epoca pasada|artes pasadas.*patrimonio|aportes.*patrimonio artistico",
      "relation": "las relaciones entre rasgos de las obras de épocas pasadas y sus aportes documentados al patrimonio artístico, argumentando con evidencias sin exigir admiración o adhesión personal",
      "pdfPages": [
        335
      ],
      "sourceRecordIds": [
        "6d7eb815-611a-5df6-8fe5-99e5da743f04"
      ],
      "evidence": [
        {
          "id": "historical-art-contribution",
          "title": "Razones sobre los aportes patrimoniales",
          "success": "Sostiene los aportes atribuidos a la obra de otra época con razones y evidencias de las fuentes dadas, relacionando sus rasgos con el enriquecimiento del patrimonio artístico.",
          "sufficient": "Los aportes principales se sostienen en fuentes y rasgos de la obra; una relación secundaria queda poco precisada.",
          "partial": "Presenta un aporte pertinente, pero una razón no se vincula con los rasgos o las evidencias utilizadas.",
          "error": "Los aportes atribuidos contradicen las fuentes o se sustituyen las evidencias por juicios de admiración personal."
        }
      ]
    },
    {
      "id": "social-context-creation",
      "grade": 3,
      "label": "creación artística desde un caso social",
      "match": "propuesta artistica de contenido social|necesidades.*caso ficticio",
      "relation": "las relaciones entre análisis de necesidades del caso dado, decisiones expresivas y contenido social de la propuesta examinada, sin exigir testimonios privados ni una postura predeterminada",
      "pdfPages": [
        335
      ],
      "sourceRecordIds": [
        "f5212985-bcbb-589d-8d73-f0833fe293d2",
        "8499298e-4589-59ed-96e2-2ed5a1e369ab"
      ],
      "evidence": [
        {
          "id": "social-case-decisions",
          "title": "Necesidades del caso y decisiones expresivas",
          "success": "Relaciona las decisiones expresivas de la propuesta con evidencias de las necesidades y condiciones del caso social ficticio dado, haciendo reconocible su contenido sin imponer una postura predeterminada.",
          "sufficient": "El contenido social se relaciona con el caso; una decisión expresiva secundaria queda poco definida.",
          "partial": "La propuesta muestra contenido social pertinente, pero una relación con la necesidad o condición del caso queda sin resolver.",
          "error": "Las decisiones contradicen los datos del caso o no permiten reconocer la relación con las necesidades expresamente trabajadas."
        }
      ]
    },
    {
      "id": "art-technology",
      "grade": 3,
      "label": "herramientas tecnológicas en la creación artística",
      "match": "herramienta tecnologica|herramientas tecnologicas",
      "relation": "las relaciones entre función de la herramienta tecnológica elegida y decisiones expresivas de la creación examinada, sin exigir equipo de pago ni plataformas adicionales",
      "pdfPages": [
        335
      ],
      "sourceRecordIds": [
        "34a09704-1a29-51e1-bfa0-146218ed9fe7"
      ],
      "evidence": [
        {
          "id": "technology-decisions",
          "title": "Herramienta y decisiones expresivas",
          "success": "Utiliza la función de la herramienta elegida de modo que contribuya a las decisiones expresivas expresamente pedidas en la obra con los recursos disponibles.",
          "sufficient": "La herramienta contribuye a las decisiones principales; una función secundaria queda poco definida sin impedir el resultado previsto.",
          "partial": "La herramienta se utiliza, pero una decisión de uso no se relaciona con las condiciones expresivas del producto.",
          "error": "El uso de la herramienta impide reconocer su contribución al propósito artístico expresamente pedido."
        }
      ]
    }
  ],
  "policy": "REQUESTED_ARTISTIC_EVIDENCE_V1"
}]} as unknown as EvaluationCatalog
