import {evaluationCatalogV53} from './catalog-v53'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.54",
  "englishGradeThreeGenres": [
    {
      "id": "conversation",
      "data": "la relación entre las intervenciones de los interlocutores",
      "error": "confunde quién interviene o a qué intervención responde",
      "match": "conversacion(?:es)?|dialogos?",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "title": "Intercambio de la conversación",
      "source": "CURRICULUM",
      "production": "Relaciona sus intervenciones en inglés con las de los interlocutores para mantener el intercambio acordado."
    },
    {
      "id": "business-card",
      "data": "los datos de identificación y contacto solicitados de la tarjeta",
      "error": "atribuye los datos de la tarjeta a un referente diferente",
      "match": "tarjetas? de presentacion|business cards?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Datos de la tarjeta de presentación",
      "source": "CURRICULUM",
      "production": "Dispone en inglés los datos de identificación y contacto solicitados de la persona o personaje indicado."
    },
    {
      "id": "list",
      "data": "los elementos de la lista que corresponden a la búsqueda solicitada",
      "error": "incorpora elementos ajenos a la categoría o finalidad de la lista",
      "match": "listas?(?! (?:de cotejo|ponderadas?|de verificacion|de control|de observacion))",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Elementos de la lista",
      "source": "CURRICULUM",
      "production": "Presenta en inglés los elementos de la lista pertinentes para la finalidad indicada."
    },
    {
      "id": "advertisement",
      "data": "el producto o servicio y la información solicitada del anuncio",
      "error": "atribuye al producto o servicio características diferentes de las comunicadas",
      "match": "anuncios?|advertisements?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Producto o servicio anunciado",
      "source": "CURRICULUM",
      "production": "Comunica en inglés el producto o servicio anunciado y la información necesaria para el destinatario acordado."
    },
    {
      "id": "recipe",
      "data": "las acciones de preparación y su orden en la receta",
      "error": "invierte o cambia acciones de preparación y altera las instrucciones",
      "match": "recetas?|recipes?",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "title": "Acciones de la receta",
      "source": "CURRICULUM",
      "production": "Comunica en inglés las acciones de preparación de la receta en un orden que permite seguir las instrucciones.",
      "existingFunction": "instructions"
    },
    {
      "id": "sign",
      "data": "la indicación del letrero para la situación en que aparece",
      "error": "confunde una indicación con su prohibición o comunica una acción diferente",
      "match": "letreros?|signs?",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "title": "Indicación del letrero",
      "source": "CURRICULUM",
      "production": "Comunica en inglés la indicación del letrero de forma breve y comprensible para el destinatario."
    },
    {
      "id": "notice",
      "data": "la información del aviso que permite comprender lo comunicado",
      "error": "cambia lo anunciado o a quién se dirige el aviso",
      "match": "avisos?|notices?",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "title": "Información del aviso",
      "source": "CURRICULUM",
      "production": "Comunica en inglés la información del aviso necesaria para reconocer la situación anunciada."
    },
    {
      "id": "poster",
      "data": "el mensaje central del afiche y la información solicitada",
      "error": "el mensaje dispuesto comunica un propósito diferente del solicitado",
      "match": "afiches?|carteles?|posters?",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "title": "Mensaje del afiche",
      "source": "CURRICULUM",
      "production": "Dispone en inglés el mensaje central del afiche de forma legible y relacionada con su propósito comunicativo."
    },
    {
      "id": "message",
      "data": "el propósito del mensaje y los datos solicitados para comprenderlo",
      "error": "el contenido cambia la intención o el destinatario del mensaje",
      "match": "mensajes?|messages?",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction",
        "writing"
      ],
      "title": "Propósito del mensaje",
      "source": "CURRICULUM",
      "production": "Comunica en inglés las ideas necesarias para cumplir el propósito del mensaje en la situación acordada."
    },
    {
      "id": "email",
      "data": "el destinatario y propósito del correo y su información solicitada",
      "error": "dirige a otra persona información que no corresponde al propósito del correo",
      "match": "correos?(?: electronicos?)?|e mails?|emails?",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "title": "Comunicación por correo electrónico",
      "source": "CURRICULUM",
      "production": "Relaciona el destinatario y propósito del correo con un cuerpo breve en inglés que permite comprender lo comunicado."
    },
    {
      "id": "cv",
      "data": "los datos de perfil solicitados en el currículum vitae",
      "error": "atribuye datos de perfil a otra persona o los ubica en un apartado diferente",
      "match": "curriculum vitae|curriculum|cv",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "title": "Perfil del currículum vitae",
      "source": "CURRICULUM",
      "production": "Organiza en inglés los datos de perfil solicitados de una persona real o ficticia para el currículum vitae acordado."
    },
    {
      "id": "letter",
      "data": "el destinatario y propósito de la carta y la información solicitada",
      "error": "el mensaje se dirige a un destinatario o propósito diferente del acordado",
      "match": "cartas?|letters?",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "title": "Comunicación de la carta",
      "source": "CURRICULUM",
      "production": "Relaciona el destinatario y propósito de la carta con un mensaje breve en inglés que permite comprender lo comunicado."
    },
    {
      "id": "form",
      "data": "los campos solicitados del formulario y los datos que contienen o requieren",
      "error": "sitúa los datos en campos que piden una información diferente",
      "match": "formularios?|forms?",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "title": "Información del formulario",
      "source": "CURRICULUM",
      "production": "Completa en inglés los campos solicitados con datos pertinentes de la persona o situación real o ficticia indicada."
    },
    {
      "id": "forecast",
      "data": "las condiciones atmosféricas y sus referencias solicitadas en el pronóstico",
      "error": "atribuye al pronóstico condiciones diferentes de las indicadas",
      "match": "pronosticos? del tiempo|weather forecasts?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Información del pronóstico",
      "source": "CURRICULUM",
      "production": "Comunica en inglés las condiciones atmosféricas del pronóstico y las referencias solicitadas.",
      "existingFunction": "weather"
    },
    {
      "id": "news",
      "data": "el suceso comunicado y los datos solicitados de la noticia",
      "error": "cambia el suceso o atribuye sus datos a otro acontecimiento",
      "match": "noticias?|news",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "title": "Información de la noticia",
      "source": "CURRICULUM",
      "production": "Comunica en inglés el suceso comunicado y los datos necesarios para reconocer qué ocurrió en la noticia."
    },
    {
      "id": "schedule",
      "data": "la actividad y momento que corresponden a la consulta del horario",
      "error": "asigna a la actividad un momento diferente del indicado",
      "match": "horarios?|timetables?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Actividad y momento del horario",
      "source": "CURRICULUM",
      "production": "Relaciona en inglés cada actividad y momento solicitado para que el horario pueda consultarse."
    },
    {
      "id": "agenda",
      "data": "los compromisos y sus referencias temporales solicitadas en la agenda",
      "error": "cambia la correspondencia entre el compromiso y su momento",
      "match": "agendas?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Compromisos de la agenda",
      "source": "CURRICULUM",
      "production": "Relaciona en inglés los compromisos con las referencias temporales necesarias para consultar la agenda."
    },
    {
      "id": "map",
      "data": "las ubicaciones y referencias del croquis necesarias para responder a la consulta",
      "error": "invierte una ubicación o referencia y cambia el recorrido consultado",
      "match": "croquis|mapas?|maps?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Referencias del croquis",
      "source": "CURRICULUM",
      "production": "Relaciona las ubicaciones y referencias del croquis con las indicaciones en inglés solicitadas."
    },
    {
      "id": "questionnaire",
      "data": "la información buscada por las preguntas del cuestionario",
      "error": "formula o interpreta preguntas que buscan información distinta de la solicitada",
      "match": "cuestionarios?|questionnaires?",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "title": "Información buscada por las preguntas",
      "source": "CURRICULUM",
      "production": "Formula en inglés preguntas comprensibles que permiten obtener la información buscada en la situación acordada."
    },
    {
      "id": "brochure",
      "data": "la información del folleto pertinente para la consulta solicitada",
      "error": "la organización o los datos del folleto conducen a información diferente de la solicitada",
      "match": "folletos?|brochures?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Información del folleto",
      "source": "CURRICULUM",
      "production": "Dispone en inglés la información del folleto de modo que el destinatario pueda encontrar los datos solicitados."
    },
    {
      "id": "song",
      "data": "el mensaje de la canción expresado por las palabras solicitadas",
      "error": "cambia palabras o relaciones que alteran el sentido del mensaje de la canción",
      "match": "cancion(?:es)?|songs?",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction"
      ],
      "title": "Mensaje de la canción",
      "source": "CURRICULUM",
      "production": "Comunica el mensaje de la canción en inglés con palabras y expresiones comprensibles mediante la interpretación acordada."
    },
    {
      "id": "poem",
      "data": "el sentido de los versos y las expresiones solicitadas de la poesía",
      "error": "atribuye a los versos un sentido incompatible con sus palabras",
      "match": "poesias?|poemas?|poems?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Sentido de los versos",
      "source": "CURRICULUM",
      "production": "Comunica en inglés el sentido de los versos mediante las expresiones de la producción acordada."
    },
    {
      "id": "comic",
      "data": "la relación entre las viñetas y los mensajes de la historieta",
      "error": "invierte la secuencia o atribuye a una viñeta un mensaje diferente",
      "match": "historietas?|comics?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Secuencia de la historieta",
      "source": "CURRICULUM",
      "production": "Relaciona en inglés los mensajes con las viñetas para que la secuencia de la historieta resulte comprensible."
    },
    {
      "id": "tourist-guide",
      "data": "los lugares y orientaciones de la guía pertinentes para la consulta",
      "error": "confunde los lugares o las orientaciones y conduce a información diferente",
      "match": "guias? turisticas?|tourist guides?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Orientaciones de la guía turística",
      "source": "CURRICULUM",
      "production": "Comunica en inglés los lugares y orientaciones de la guía que permiten atender la consulta acordada."
    },
    {
      "id": "description",
      "data": "las características solicitadas y el referente descrito",
      "error": "atribuye las características a un referente distinto",
      "match": "descripcion(?:es)?|descriptions?",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction",
        "writing"
      ],
      "title": "Características de lo descrito",
      "source": "CURRICULUM",
      "production": "Relaciona en inglés las características solicitadas con la persona, lugar u objeto descrito.",
      "existingFunction": "description"
    },
    {
      "id": "biography",
      "data": "los acontecimientos de la vida de la persona y sus relaciones solicitadas",
      "error": "atribuye los acontecimientos a otra persona o cambia su relación",
      "match": "biografias?|biographies",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Acontecimientos de la biografía",
      "source": "CURRICULUM",
      "production": "Comunica en inglés los acontecimientos de la vida de la persona real o ficticia indicada con relaciones comprensibles."
    },
    {
      "id": "narrative",
      "data": "los acontecimientos y personajes presentes en la narración y las relaciones solicitadas",
      "error": "cambia los acontecimientos o sus relaciones y altera la narración",
      "match": "narracion(?:es)?|relatos?|narratives?",
      "modes": [
        "reading",
        "listening",
        "oral",
        "interaction",
        "writing"
      ],
      "title": "Acontecimientos de la narración",
      "source": "CURRICULUM",
      "production": "Relaciona en inglés los acontecimientos y personajes, cuando corresponda, para que la narración real o ficticia se comprenda."
    },
    {
      "id": "menu",
      "data": "los productos y la información solicitada del menú",
      "error": "atribuye a un producto información de otro elemento del menú",
      "match": "menus?|menus en ingles",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Información consultada del menú",
      "source": "CURRICULUM",
      "production": ""
    },
    {
      "id": "monologue",
      "data": "las ideas relacionadas con el asunto del monólogo",
      "error": "las relaciones entre las ideas cambian el sentido del asunto comunicado",
      "match": "monologos?|monologues?",
      "modes": [
        "oral"
      ],
      "title": "Ideas del monólogo",
      "source": "CURRICULUM",
      "production": "Comunica en inglés las ideas del monólogo solicitado mediante oraciones básicas enlazadas que permiten seguir el asunto."
    },
    {
      "id": "audiovisual",
      "data": "la relación entre los recursos seleccionados y el mensaje audiovisual",
      "error": "los recursos comunican ideas incompatibles con el mensaje solicitado",
      "match": "produccion(?:es)? audiovisual(?:es)?|videos?",
      "modes": [
        "audiovisual"
      ],
      "title": "Mensaje de la producción audiovisual",
      "source": "EXPLICIT_TASK",
      "production": "Relaciona los recursos seleccionados con un mensaje en inglés comprensible para el destinatario acordado."
    }
  ],
  "englishGradeThreeModule": {
    "id": "ingles-comunicacion-3",
    "grade": 3,
    "policy": "COMMON_THIRD_GRADE_FUNCTIONS_GRAMMAR_LEXICON_STRATEGIES_GENRES_CONTEXT_COMPOSITION_V2",
    "pdfPages": [
      146,
      147,
      148,
      149,
      150,
      151
    ],
    "subjectCode": "ING"
  },
  "englishGradeThreeGrammar": [
    {
      "id": "past-simple",
      "name": "el pasado simple",
      "error": "presenta como actual un hecho situado en el pasado o cambia quién lo realizó",
      "match": "\\b(?:pasado simple|simple past|past simple)\\b",
      "function": "situar hechos o experiencias terminados en el pasado"
    },
    {
      "id": "question-tags",
      "name": "las question tags",
      "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación",
      "match": "\\b(?:question tags?)\\b",
      "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada"
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
      "id": "manner-adverbs",
      "name": "los adverbios de modo",
      "error": "altera la manera en que se realiza la acción descrita",
      "match": "\\b(?:adverbios? de modo|adverbs? of manner)\\b",
      "function": "precisar cómo se realiza una acción"
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
      "match": "\\b(?:conectores? de causa(?: y consecuencia|lidad)?|conectores? de consecuencia|cause and effect connectors?)\\b",
      "function": "relacionar un hecho con su causa o su consecuencia"
    },
    {
      "id": "past-continuous",
      "name": "el pasado continuo",
      "error": "confunde la acción en curso con el acontecimiento que la interrumpe",
      "match": "\\b(?:pasado continuo|past continuous)\\b",
      "function": "situar la acción que estaba en desarrollo como contexto de un acontecimiento pasado"
    },
    {
      "id": "present-participle",
      "name": "los adjetivos en participio presente",
      "error": "confunde el efecto de la actividad con el estado de quien lo experimenta",
      "match": "\\b(?:participio presente|present participle|adjetivos? (?:en|terminados en) ing)\\b",
      "function": "caracterizar el efecto que provoca una situación o actividad"
    },
    {
      "id": "past-participle",
      "name": "los adjetivos en participio pasado",
      "error": "confunde el estado del referente con el efecto que provoca una actividad",
      "match": "\\b(?:participio pasado|past participle|adjetivos? (?:en|terminados en) ed)\\b",
      "function": "describir el estado de la persona o referente"
    },
    {
      "id": "reflexive-pronouns",
      "name": "los pronombres reflexivos",
      "error": "atribuye a otra persona una acción que recae sobre el sujeto",
      "match": "\\b(?:pronombres? reflexivos?|reflexive pronouns?)\\b",
      "function": "relacionar una acción con el mismo referente que la realiza"
    },
    {
      "id": "present-simple",
      "name": "el presente simple",
      "error": "cambia el referente o el sentido de la indicación o afirmación",
      "match": "\\b(?:presente simple|present simple|simple present)\\b",
      "function": "comunicar una indicación o un punto de vista en la situación solicitada"
    },
    {
      "id": "present-continuous",
      "name": "el presente continuo",
      "error": "confunde el acontecimiento anunciado con un hecho terminado",
      "match": "\\b(?:presente continuo|present continuous)\\b",
      "function": "comunicar un anuncio o noticia con la referencia temporal indicada"
    },
    {
      "id": "used-to",
      "name": "used to",
      "error": "presenta como actual el hábito pasado o niega el cambio comunicado",
      "match": "\\b(?:used to)\\b",
      "function": "contrastar una situación o acción habitual del pasado con su situación presente"
    },
    {
      "id": "present-perfect",
      "name": "el presente perfecto",
      "error": "presenta como acción en curso el acontecimiento anterior que se informa",
      "match": "\\b(?:presente perfecto|present perfect)\\b",
      "function": "comunicar una noticia o acontecimiento anterior relacionado con el presente"
    },
    {
      "id": "will",
      "name": "will",
      "error": "presenta como sucedido un resultado futuro o contradice los datos de la predicción",
      "match": "\\b(?:will)\\b",
      "function": "comunicar una predicción o conclusión sobre el resultado futuro apoyada en la información disponible"
    },
    {
      "id": "going-to",
      "name": "be going to",
      "error": "expresa un resultado incompatible con los indicios de la predicción",
      "match": "\\b(?:be going to|going to)\\b",
      "function": "comunicar una predicción sobre el resultado futuro a partir de los indicios disponibles"
    },
    {
      "id": "there-be",
      "name": "there + be",
      "error": "cambia la existencia, la cantidad o el momento del acontecimiento comunicado",
      "match": "\\b(?:there be|there (?:is|are|was|were|has been|have been|will be|s going to be))\\b",
      "function": "indicar existencia en una indicación, anuncio o noticia con el tiempo y número solicitados"
    },
    {
      "id": "imperative",
      "name": "el imperativo",
      "error": "invierte la instrucción y la prohibición o cambia la acción que se comunica",
      "match": "\\b(?:imperativos?|imperatives?)\\b",
      "function": "comunicar la acción indicada o prohibida en la situación solicitada"
    },
    {
      "id": "lets",
      "name": "let’s",
      "error": "la forma cambia la propuesta compartida por una acción diferente",
      "match": "\\b(?:let s)\\b",
      "function": "proponer una acción compartida en una indicación o sugerencia"
    },
    {
      "id": "why-suggestion",
      "name": "why don’t o why not según lo solicitado",
      "error": "pregunta por una causa cuando debe proponer una acción",
      "match": "\\b(?:why don t|why not)\\b",
      "function": "formular una sugerencia de acción al interlocutor"
    },
    {
      "id": "modal-can",
      "name": "can",
      "error": "confunde lo posible o permitido con lo imposible o prohibido",
      "match": "\\b(?:can)\\b",
      "function": "expresar posibilidad o capacidad, o indicar lo permitido según la situación comunicada"
    },
    {
      "id": "modal-should",
      "name": "should",
      "error": "presenta como obligación absoluta la recomendación solicitada",
      "match": "\\b(?:should)\\b",
      "function": "expresar una recomendación pertinente para la situación indicada"
    },
    {
      "id": "modal-must",
      "name": "must",
      "error": "confunde una necesidad con una opción o una deducción con un hecho directamente observado",
      "match": "\\b(?:must)\\b",
      "function": "expresar necesidad o una conclusión fuertemente apoyada en los indicios, según la situación solicitada"
    },
    {
      "id": "modal-may",
      "name": "may",
      "error": "presenta como confirmado lo que la situación solo permite considerar posible",
      "match": "\\b(?:may)\\b",
      "function": "expresar una posibilidad que se distingue de una afirmación confirmada"
    },
    {
      "id": "modal-might",
      "name": "might",
      "error": "comunica como seguro un resultado que los datos solo permiten considerar posible",
      "match": "\\b(?:might)\\b",
      "function": "expresar una posibilidad incierta compatible con los datos de la situación"
    },
    {
      "id": "modal-have-to",
      "name": "have to",
      "error": "cambia o elimina la obligación indicada por las condiciones de la tarea",
      "match": "\\b(?:have to)\\b",
      "function": "expresar la obligación que establece la situación proporcionada"
    },
    {
      "id": "modal-need-to",
      "name": "need to",
      "error": "atribuye necesidad a una acción diferente de la solicitada",
      "match": "\\b(?:need to)\\b",
      "function": "expresar la necesidad de una acción para la situación proporcionada"
    },
    {
      "id": "adjective-clauses",
      "name": "las cláusulas adjetivas",
      "error": "vincula la caracterización con un referente distinto",
      "match": "\\b(?:clausulas? adjetivas?|adjective clauses?)\\b",
      "function": "precisar el referente mediante información que lo caracteriza o identifica"
    },
    {
      "id": "noun-clauses",
      "name": "las cláusulas sustantivas",
      "error": "la cláusula cambia la idea que se atribuye a la afirmación",
      "match": "\\b(?:clausulas? sustantivas?|noun clauses?)\\b",
      "function": "integrar una idea o contenido como parte de la afirmación solicitada"
    },
    {
      "id": "conditional",
      "name": "la oración condicional",
      "error": "presenta el resultado como incondicional o invierte condición y consecuencia",
      "match": "\\b(?:condicional(?:es)?|conditional sentences?)\\b",
      "function": "relacionar una condición con la información o predicción que depende de ella"
    },
    {
      "id": "passive-past",
      "name": "la voz pasiva en pasado",
      "error": "atribuye al receptor una acción realizada por otro o cambia el momento pasado",
      "match": "\\b(?:voz pasiva (?:del|en) pasado|pasiva del pasado|past passive)\\b",
      "function": "comunicar una acción recibida por un referente en un acontecimiento pasado"
    },
    {
      "id": "passive-present",
      "name": "la voz pasiva en presente",
      "error": "atribuye al receptor la acción que recibe o sitúa como pasada una situación presente",
      "match": "\\b(?:voz pasiva (?:del|en) presente|pasiva del presente|present passive)\\b",
      "function": "comunicar la acción que recibe el referente en la situación presente"
    },
    {
      "id": "agreement-responses",
      "name": "las respuestas de coincidencia o discrepancia solicitadas",
      "error": "invierte el acuerdo o desacuerdo o la polaridad de la afirmación",
      "match": "\\b(?:me too|me neither|so did i|neither do i)\\b",
      "function": "comunicar la coincidencia o discrepancia con la afirmación del interlocutor"
    },
    {
      "id": "exclamation",
      "name": "las oraciones exclamativas",
      "error": "la forma comunica una reacción incompatible con el acontecimiento indicado",
      "match": "\\b(?:oraciones? exclamativas?|exclamaciones?|exclamatory sentences?)\\b",
      "function": "expresar una reacción relacionada con el acontecimiento comunicado"
    },
    {
      "id": "abstract-nouns",
      "name": "los sustantivos abstractos",
      "error": "atribuye al concepto un significado diferente del mensaje",
      "match": "\\b(?:sustantivos? abstractos?|abstract nouns?)\\b",
      "function": "nombrar conceptos, estados o ideas de la situación comunicada"
    },
    {
      "id": "subject-gerund",
      "name": "el gerundio en función de sujeto",
      "error": "la forma deja de referirse a la actividad que funciona como sujeto",
      "match": "\\b(?:gerundio (?:en funcion de|como) sujeto|gerund as subject)\\b",
      "function": "presentar una actividad como sujeto de la afirmación"
    },
    {
      "id": "zero-article",
      "name": "la ausencia del artículo definido",
      "error": "la elección del artículo cambia la referencia general por una específica",
      "match": "\\b(?:ausencia del articulo definido|articulo cero|zero article)\\b",
      "function": "referirse a una categoría o idea general sin convertirla en un referente específico"
    },
    {
      "id": "relative-pronouns",
      "name": "los pronombres relativos",
      "error": "relaciona la información con una persona o elemento distinto",
      "match": "\\b(?:pronombres? relativos?|relative pronouns?)\\b",
      "function": "enlazar información adicional con el referente al que corresponde"
    },
    {
      "id": "duration-adverbs",
      "name": "las expresiones adverbiales de duración",
      "error": "confunde la duración con un momento puntual o altera su continuidad",
      "match": "\\b(?:(?:adverbios|frases adverbiales) de duracion|adverbs? of duration)\\b",
      "function": "comunicar la duración o referencia de continuidad temporal de la situación"
    },
    {
      "id": "intensity-adverbs",
      "name": "los adverbios de intensidad",
      "error": "cambia la intensidad que se pretende expresar",
      "match": "\\b(?:adverbios? de intensidad|adverbs? of intensity)\\b",
      "function": "graduar la intensidad de una característica o acción"
    },
    {
      "id": "degree-adverbs",
      "name": "las expresiones adverbiales de grado",
      "error": "expresa un grado o cantidad diferente del indicado",
      "match": "\\b(?:adverbios? de grado|adverbs? of degree)\\b",
      "function": "precisar la cantidad o grado comunicado en la situación"
    },
    {
      "id": "purpose-connectors",
      "name": "los conectores de finalidad",
      "error": "confunde la finalidad con una causa o un resultado ya ocurrido",
      "match": "\\b(?:conectores? de finalidad|purpose connectors?)\\b",
      "function": "relacionar una acción con la finalidad para la que se realiza"
    },
    {
      "id": "contrast-connectors",
      "name": "los conectores de contraste",
      "error": "presenta como equivalentes ideas que deben contrastarse",
      "match": "\\b(?:conectores? de contraste|contrast connectors?)\\b",
      "function": "contrastar ideas o puntos de vista relacionados"
    },
    {
      "id": "concession-connectors",
      "name": "los conectores de concesión",
      "error": "presenta la circunstancia como causa necesaria del resultado o elimina la concesión",
      "match": "\\b(?:conectores? de concesion|concession connectors?)\\b",
      "function": "relacionar una circunstancia con un resultado que ocurre pese a ella"
    }
  ],
  "englishGradeThreeLexicon": [
    {
      "id": "celebrations",
      "name": "celebraciones",
      "error": "confunde la celebración con otro acontecimiento",
      "match": "\\b(?:celebraciones|celebrations)\\b",
      "category": "vocabulary",
      "function": "nombrar la celebración mencionada"
    },
    {
      "id": "weather-words",
      "name": "condiciones atmosféricas",
      "error": "confunde el estado del tiempo comunicado",
      "match": "\\b(?:condiciones atmosfericas|weather conditions)\\b",
      "category": "vocabulary",
      "function": "nombrar el estado del tiempo indicado"
    },
    {
      "id": "sports",
      "name": "deportes",
      "error": "nombra un deporte distinto del solicitado",
      "match": "\\b(?:deportes|sports)\\b",
      "category": "vocabulary",
      "function": "nombrar la práctica deportiva indicada"
    },
    {
      "id": "jobs",
      "name": "ocupaciones",
      "error": "atribuye a la persona una ocupación distinta",
      "match": "\\b(?:ocupaciones|profesiones|occupations|jobs)\\b",
      "category": "vocabulary",
      "function": "nombrar la ocupación mencionada"
    },
    {
      "id": "daily",
      "name": "actividades de la vida diaria",
      "error": "confunde la acción de la jornada comunicada",
      "match": "\\b(?:actividades de la vida diaria|actividades (?:diarias|cotidianas)|daily activities)\\b",
      "category": "vocabulary",
      "function": "nombrar la acción cotidiana del referente"
    },
    {
      "id": "leisure",
      "name": "actividades de tiempo libre y ocio",
      "error": "cambia la actividad recreativa mencionada",
      "match": "\\b(?:actividades de tiempo libre(?: y ocio)?|actividades de ocio|leisure activities)\\b",
      "category": "vocabulary",
      "function": "nombrar la actividad de ocio indicada"
    },
    {
      "id": "moods",
      "name": "estados de ánimo",
      "error": "atribuye al referente un estado diferente del mensaje",
      "match": "\\b(?:estados de animo|moods)\\b",
      "category": "vocabulary",
      "function": "nombrar el estado del personaje o referente descrito"
    },
    {
      "id": "places",
      "name": "lugares",
      "error": "sitúa el referente en un lugar diferente del comunicado",
      "match": "\\b(?:lugares|places)\\b",
      "category": "vocabulary",
      "function": "nombrar el lugar indicado en el mensaje"
    },
    {
      "id": "relationships",
      "name": "relaciones humanas",
      "error": "atribuye entre los referentes una relación distinta",
      "match": "\\b(?:relaciones humanas|human relationships)\\b",
      "category": "vocabulary",
      "function": "comunicar la relación entre los personajes o referentes dados"
    },
    {
      "id": "technology",
      "name": "tecnología",
      "error": "confunde el dispositivo o servicio con otro referente",
      "match": "\\b(?:tecnologia|technology)\\b",
      "category": "vocabulary",
      "function": "nombrar el dispositivo o servicio tecnológico del mensaje"
    },
    {
      "id": "school-activities",
      "name": "actividades escolares",
      "error": "confunde la actividad escolar con una acción distinta",
      "match": "\\b(?:actividades escolares|school activities)\\b",
      "category": "vocabulary",
      "function": "nombrar la acción de aprendizaje o trabajo escolar indicada"
    },
    {
      "id": "school",
      "name": "escuela",
      "error": "confunde un espacio o documento escolar con otro referente",
      "match": "\\b(?:escuela|school vocabulary)\\b",
      "category": "vocabulary",
      "function": "nombrar el espacio, documento o referente escolar mencionado"
    },
    {
      "id": "contingencies",
      "name": "eventualidades",
      "error": "atribuye al personaje un contratiempo distinto del relato",
      "match": "\\b(?:eventualidades|contratiempos|contingencies)\\b",
      "category": "vocabulary",
      "function": "nombrar el acontecimiento imprevisto del personaje o situación dada"
    },
    {
      "id": "environment",
      "name": "medio ambiente",
      "error": "cambia el proceso o problema ambiental mencionado",
      "match": "\\b(?:medio ambiente|medioambiente|environment)\\b",
      "category": "vocabulary",
      "function": "nombrar el proceso o problema ambiental comunicado en el texto"
    },
    {
      "id": "media",
      "name": "medios de comunicación",
      "error": "confunde el canal de comunicación mencionado con otro medio",
      "match": "\\b(?:medios de comunicacion|communication media)\\b",
      "category": "vocabulary",
      "function": "identificar el medio por el que se transmite la información indicada"
    },
    {
      "id": "home-objects",
      "name": "objetos del hogar y el entorno",
      "error": "atribuye al objeto un nombre o uso diferente del mensaje",
      "match": "\\b(?:objetos del hogar(?: y el entorno)?|household objects)\\b",
      "category": "vocabulary",
      "function": "nombrar el objeto del lugar o situación proporcionados"
    },
    {
      "id": "social-problems",
      "name": "problemáticas sociales",
      "error": "atribuye a la situación un problema distinto del descrito",
      "match": "\\b(?:problematicas sociales|problemas sociales|social problems)\\b",
      "category": "vocabulary",
      "function": "nombrar el problema social de la situación o personajes ficticios"
    },
    {
      "id": "recipes",
      "name": "recetas de cocina",
      "error": "confunde la acción o ingrediente de la receta proporcionada",
      "match": "\\b(?:recetas de cocina|cooking recipes)\\b",
      "category": "vocabulary",
      "function": "nombrar el ingrediente, utensilio o acción culinaria mencionados"
    },
    {
      "id": "traffic-signs",
      "name": "señales de tránsito",
      "error": "interpreta como permitida una acción que la señal prohíbe o lo contrario",
      "match": "\\b(?:senales de transito|traffic signs)\\b",
      "category": "vocabulary",
      "function": "reconocer la indicación que comunica la señal mencionada"
    },
    {
      "id": "opinion",
      "name": "opinar",
      "error": "la expresión atribuye certeza factual a un punto de vista o cambia su sentido",
      "match": "\\b(?:opinar|expresar opiniones|expresiones de opinion)\\b",
      "category": "expression",
      "function": "comunicar el punto de vista solicitado distinguiéndolo de un hecho"
    },
    {
      "id": "agreement",
      "name": "mostrar acuerdo o desacuerdo según lo solicitado",
      "error": "expresa desacuerdo cuando corresponde acuerdo o lo contrario",
      "match": "\\b(?:mostrar acuerdo(?: o desacuerdo)?|mostrar desacuerdo|expresar acuerdo|expresar desacuerdo)\\b",
      "category": "expression",
      "function": "comunicar su posición respecto de lo dicho por el interlocutor"
    },
    {
      "id": "reaction",
      "name": "reaccionar",
      "error": "la fórmula expresa una reacción incompatible con el acontecimiento dado",
      "match": "\\b(?:reaccionar|expresar una reaccion|expresiones de reaccion)\\b",
      "category": "expression",
      "function": "responder al acontecimiento con la reacción comunicativa solicitada"
    },
    {
      "id": "explanations",
      "name": "solicitar explicaciones",
      "error": "la pregunta solicita información diferente del motivo que se necesita aclarar",
      "match": "\\b(?:solicitar explicaciones|pedir explicaciones)\\b",
      "category": "expression",
      "function": "pedir el motivo o explicación del hecho indicado"
    },
    {
      "id": "warning",
      "name": "advertir",
      "error": "la expresión no comunica el riesgo o cambia el sentido de la advertencia",
      "match": "\\b(?:advertir|expresiones de advertencia)\\b",
      "category": "expression",
      "function": "alertar al interlocutor sobre el riesgo indicado en la situación"
    }
  ],
  "englishGradeThreeStrategies": [
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
      "match": "(?:establec\\w*|defin\\w*) (?:la |el )?(?:intencion comunicativa|proposito (?:comunicativo|del mensaje))",
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
      "match": "consult\\w* (?:el |un )?diccionario|busqu\\w*.*diccionario|herramientas de consulta",
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
      "match": "revis\\w* (?:el |un )?(?:borrador|mensaje|texto|sentido)|revis\\w* (?:el )?(?:significado|sentido|correccion)(?: y (?:la )?correccion)? (?:del |de un )?(?:mensaje|texto|borrador)|correg\\w* problemas",
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
      "match": "oportunidad(?:es)? de uso|oportunidad(?:es)? de practica",
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
    },
    {
      "id": "social-formulas",
      "match": "formulas cotidianas de interaccion social",
      "modes": [
        "writing",
        "oral",
        "interaction"
      ],
      "title": "Fórmulas del intercambio cotidiano",
      "levels": [
        "Utiliza en inglés fórmulas de interacción pertinentes para iniciar, mantener o cerrar el intercambio según la situación solicitada.",
        "Las fórmulas permiten reconocer la intención del intercambio; una expresión necesita ajuste.",
        "Emplea fórmulas aisladas, pero no las relaciona con la situación de interacción indicada.",
        "La fórmula comunica una intención contraria a la intervención que debía realizar.",
        "No se reconoce una fórmula pertinente para la interacción solicitada."
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
      "id": "cultural-comparison",
      "match": "compar(?:a|an|ar|aran|ando|en|e|emos|acion|aciones)\\b.*(?:republica dominicana|otros? pais(?:es)?)",
      "modes": [
        "reading",
        "listening",
        "writing",
        "oral",
        "interaction",
        "comparison"
      ],
      "title": "Comparación cultural con ejemplos",
      "levels": [
        "La comparación cultural relaciona los aspectos solicitados de República Dominicana y del otro contexto mediante los ejemplos disponibles, sin generalizarlos a todas las personas.",
        "Relaciona los aspectos principales de ambos contextos; un ejemplo necesita precisión.",
        "Menciona ejemplos de los contextos, pero no establece su semejanza o diferencia.",
        "La comparación contradice los ejemplos o atribuye a todas las personas un rasgo de un caso particular.",
        "No aporta una comparación reconocible entre los aspectos solicitados de ambos contextos."
      ]
    }
  ]
}
export const evaluationCatalogV54={...evaluationCatalogV53,...frozen}
