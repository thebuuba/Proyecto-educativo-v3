import {evaluationCatalogV48} from './catalog-v48'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.49",
  "englishGradeTwoGenres": [
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
      "match": "correos? electronicos?|e mails?|emails?",
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
  "englishGradeTwoModule": {
    "id": "ingles-comunicacion-2",
    "grade": 2,
    "policy": "EXPLICIT_FORMS_RECEPTION_EXPLANATION_COMPARISON_NEGATIONS_V3",
    "pdfPages": [
      140,
      141,
      142,
      143,
      144,
      145
    ],
    "subjectCode": "ING"
  },
  "englishGradeTwoGrammar": [
    {
      "id": "present-simple",
      "name": "el presente simple",
      "error": "altera la concordancia o la referencia habitual de las acciones",
      "match": "\\b(?:presente simple|simple present|present simple)\\b",
      "function": "expresar hábitos, datos o estados según el mensaje"
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
      "id": "degree-adverbs",
      "name": "los adverbios de intensidad",
      "error": "cambia el grado de intensidad que se pretende expresar",
      "match": "\\b(?:adverbios? de intensidad|adverbs? of (?:degree|intensity))\\b",
      "function": "graduar la intensidad de una característica o acción"
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
      "match": "\\b(?:conectores? de causa(?:lidad)?|conectores? de consecuencia|cause and effect connectors?)\\b",
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
      "id": "will",
      "name": "will",
      "error": "cambia la acción o el momento futuro acordado",
      "match": "\\b(?:will)\\b",
      "function": "proponer o confirmar un plan futuro en el intercambio"
    },
    {
      "id": "going-to",
      "name": "be going to",
      "error": "presenta como hecho terminado la intención futura",
      "match": "\\b(?:be going to|going to)\\b",
      "function": "expresar la intención o el plan futuro solicitado"
    },
    {
      "id": "present-continuous",
      "name": "el presente continuo",
      "error": "confunde el acuerdo futuro con una acción sin referencia al plan",
      "match": "\\b(?:presente continuo|present continuous)\\b",
      "function": "comunicar el plan futuro acordado con su referencia temporal"
    },
    {
      "id": "there-past",
      "name": "there + be en pasado simple",
      "error": "cambia la cantidad o sitúa como actual la existencia pasada",
      "match": "\\b(?:there was|there were|there be en pasado simple)\\b",
      "terms": [
        [
          "\\bthere was\\b",
          "there was"
        ],
        [
          "\\bthere were\\b",
          "there were"
        ]
      ],
      "function": "indicar la existencia y cantidad de elementos en el pasado"
    },
    {
      "id": "imperative",
      "name": "el imperativo",
      "error": "invierte la indicación afirmativa y la prohibición",
      "match": "\\b(?:imperativos?|imperatives?)\\b",
      "function": "dar el consejo o la indicación solicitada al interlocutor"
    },
    {
      "id": "lets",
      "name": "let’s",
      "error": "la expresión deja de proponer una acción compartida",
      "match": "\\b(?:let s)\\b",
      "function": "proponer una acción compartida como sugerencia"
    },
    {
      "id": "wishes",
      "name": "los verbos de deseo o esperanza solicitados",
      "error": "comunica como un hecho confirmado lo que se desea o espera",
      "match": "\\b(?:want|hope|wish)\\b",
      "terms": [
        [
          "\\bwant\\b",
          "want"
        ],
        [
          "\\bhope\\b",
          "hope"
        ],
        [
          "\\bwish\\b",
          "wish"
        ]
      ],
      "function": "distinguir lo que se desea de lo que se espera que ocurra"
    },
    {
      "id": "permission",
      "name": "los modales de permiso solicitados",
      "error": "la formulación deja de solicitar permiso o modifica la acción solicitada",
      "match": "\\b(?:can|may|could)\\b",
      "terms": [
        [
          "\\bcan\\b",
          "can"
        ],
        [
          "\\bmay\\b",
          "may"
        ],
        [
          "\\bcould\\b",
          "could"
        ]
      ],
      "function": "solicitar permiso o intervención cortés según el intercambio"
    },
    {
      "id": "should",
      "name": "should",
      "error": "presenta el consejo como una obligación ajena al problema",
      "match": "\\b(?:should)\\b",
      "function": "relacionar un consejo con el problema cotidiano planteado"
    },
    {
      "id": "conditional",
      "name": "la oración condicional",
      "error": "invierte la condición y el resultado o presenta el resultado como incondicional",
      "match": "\\b(?:condicional(?:es)?|first conditional|conditional sentences?)\\b",
      "function": "relacionar una condición con el consejo o plan que depende de ella"
    },
    {
      "id": "passive",
      "name": "la voz pasiva en presente",
      "error": "atribuye al producto la acción que recibe",
      "match": "\\b(?:voz pasiva(?: del presente)?|pasiva (?:en )?presente|present passive)\\b",
      "function": "referir el producto o servicio sobre el que recae una acción"
    },
    {
      "id": "exclamation",
      "name": "las oraciones exclamativas",
      "error": "cambia el sentido de la reacción solicitada",
      "match": "\\b(?:exclamaciones?|oraciones? exclamativas?|exclamatory sentences?)\\b",
      "function": "expresar la reacción ante la situación comunicada"
    },
    {
      "id": "countability",
      "name": "los sustantivos contables e incontables solicitados",
      "error": "trata una cantidad no contable como unidades contables o lo contrario",
      "match": "\\b(?:sustantivos? contables|sustantivos? incontables|contables e incontables|countable|uncountable)\\b",
      "function": "expresar cantidades compatibles con el tipo de sustantivo"
    },
    {
      "id": "gender",
      "name": "el género de los sustantivos solicitado",
      "error": "atribuye a la forma una referencia distinta",
      "match": "\\b(?:genero (?:gramatical|de los sustantivos)|noun gender)\\b",
      "function": "reconocer el referente del sustantivo según su forma"
    },
    {
      "id": "number",
      "name": "el singular y plural solicitados",
      "error": "cambia la cantidad expresada por el sustantivo",
      "match": "\\b(?:numero de los sustantivos|singular y plural|noun number)\\b",
      "function": "distinguir un elemento de varios elementos"
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
      "id": "how-much-many",
      "name": "how much o how many según lo solicitado",
      "error": "elige una pregunta incompatible con el tipo de cantidad",
      "match": "\\b(?:how much|how many)\\b",
      "terms": [
        [
          "\\bhow much\\b",
          "how much"
        ],
        [
          "\\bhow many\\b",
          "how many"
        ]
      ],
      "function": "preguntar la cantidad de acuerdo con el referente contable o no contable"
    },
    {
      "id": "why-suggestion",
      "name": "why don’t o why not según lo solicitado",
      "error": "pregunta por una causa cuando pretende proponer una acción",
      "match": "\\b(?:why don t|why not)\\b",
      "terms": [
        [
          "\\bwhy don t\\b",
          "why don’t"
        ],
        [
          "\\bwhy not\\b",
          "why not"
        ]
      ],
      "function": "formular una sugerencia de acción al interlocutor"
    },
    {
      "id": "reflexive-pronouns",
      "name": "los pronombres reflexivos",
      "error": "atribuye a otra persona una acción que recae sobre el sujeto",
      "match": "\\b(?:pronombres? reflexivos?|reflexive pronouns?)\\b",
      "function": "relacionar una acción con el mismo referente que la realiza"
    },
    {
      "id": "quantity-adverbs",
      "name": "las expresiones de cantidad solicitadas",
      "error": "cambia la cantidad que se pretende comunicar",
      "match": "\\b(?:adverbios? de cantidad|adverbs? of quantity)\\b",
      "function": "precisar cuánto hay del referente"
    },
    {
      "id": "duration-prepositions",
      "name": "las preposiciones de duración solicitadas",
      "error": "confunde la duración con el momento de inicio o final",
      "match": "\\b(?:preposiciones? de duracion|since|for|ago|until)\\b",
      "terms": [
        [
          "\\bsince\\b",
          "since"
        ],
        [
          "\\bfor\\b",
          "for"
        ],
        [
          "\\bago\\b",
          "ago"
        ],
        [
          "\\buntil\\b",
          "until"
        ]
      ],
      "function": "situar la duración, el inicio o el límite temporal de una situación"
    }
  ],
  "englishGradeTwoLexicon": [
    {
      "id": "food",
      "name": "alimentos",
      "error": "atribuye al alimento un nombre que corresponde a otro producto",
      "match": "\\b(?:(?<!preparacion de )alimentos|comidas y bebidas|food)\\b",
      "category": "vocabulary",
      "function": "identificar la comida o bebida mencionada"
    },
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
      "id": "transport",
      "name": "medios de transporte",
      "error": "cambia el medio de transporte indicado",
      "match": "\\b(?:medios de transporte|means of transport)\\b",
      "category": "vocabulary",
      "function": "nombrar el medio de desplazamiento solicitado"
    },
    {
      "id": "cardinal",
      "name": "números cardinales",
      "error": "comunica una cantidad diferente de la indicada",
      "match": "\\b(?:numeros cardinales|cardinal numbers)\\b",
      "category": "vocabulary",
      "function": "expresar la cantidad solicitada"
    },
    {
      "id": "ordinal",
      "name": "números ordinales",
      "error": "cambia la posición del elemento en la serie",
      "match": "\\b(?:numeros ordinales|ordinal numbers)\\b",
      "category": "vocabulary",
      "function": "expresar la posición en una serie"
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
      "id": "body",
      "name": "partes del cuerpo",
      "error": "señala una parte corporal distinta de la nombrada",
      "match": "\\b(?:partes del cuerpo|body parts)\\b",
      "category": "vocabulary",
      "function": "identificar la parte corporal indicada"
    },
    {
      "id": "compass",
      "name": "puntos cardinales",
      "error": "invierte la dirección espacial que se desea comunicar",
      "match": "\\b(?:puntos cardinales|cardinal directions)\\b",
      "category": "vocabulary",
      "function": "comunicar la orientación espacial indicada"
    },
    {
      "id": "excuse",
      "name": "excusarse",
      "error": "la expresión no permite reconocer la disculpa solicitada",
      "match": "\\b(?:excusarse|disculparse|apologizing)\\b",
      "category": "expression",
      "function": "expresar una disculpa relacionada con la situación"
    },
    {
      "id": "dates",
      "name": "indicar fechas",
      "error": "cambia el día, mes o año solicitado",
      "match": "\\b(?:indicar fechas|expresar fechas|giving dates)\\b",
      "category": "expression",
      "function": "comunicar la fecha indicada"
    },
    {
      "id": "hours",
      "name": "indicar la hora",
      "error": "cambia la hora a la que se refiere el mensaje",
      "match": "\\b(?:indicar la hora|expresar la hora|telling the time)\\b",
      "category": "expression",
      "function": "comunicar la hora indicada"
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
      "id": "subjects",
      "name": "asignaturas",
      "error": "atribuye a la asignatura un nombre de otra materia",
      "match": "\\b(?:asignaturas|school subjects)\\b",
      "category": "vocabulary",
      "function": "identificar la asignatura mencionada"
    },
    {
      "id": "money",
      "name": "dinero",
      "error": "confunde la moneda, el cambio o el medio de pago mencionado",
      "match": "\\b(?:dinero|money)\\b",
      "category": "vocabulary",
      "function": "comunicar la moneda o forma de pago indicada en la situación"
    },
    {
      "id": "ailments",
      "name": "dolencias y enfermedades",
      "error": "atribuye a la situación una dolencia distinta de la mencionada",
      "match": "\\b(?:dolencias(?: y enfermedades)?|enfermedades|ailments|illnesses)\\b",
      "category": "vocabulary",
      "function": "nombrar la dolencia del personaje o situación suministrada"
    },
    {
      "id": "education",
      "name": "educación",
      "error": "cambia el nivel o contexto educativo del mensaje",
      "match": "\\b(?:educacion|education)\\b",
      "category": "vocabulary",
      "function": "nombrar el nivel o contexto educativo indicado"
    },
    {
      "id": "shops",
      "name": "establecimientos comerciales",
      "error": "confunde el establecimiento con otro tipo de comercio",
      "match": "\\b(?:establecimientos comerciales|tiendas|shops)\\b",
      "category": "vocabulary",
      "function": "identificar el comercio nombrado"
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
      "id": "life-events",
      "name": "eventos de la vida",
      "error": "cambia el acontecimiento mencionado en el relato",
      "match": "\\b(?:eventos de la vida|life events)\\b",
      "category": "vocabulary",
      "function": "nombrar el acontecimiento del personaje o relato dado"
    },
    {
      "id": "interaction-channels",
      "name": "formas de interacción",
      "error": "confunde el canal escrito, de voz u otro canal indicado",
      "match": "\\b(?:formas de interaccion|canales de interaccion|interaction channels)\\b",
      "category": "vocabulary",
      "function": "identificar el canal por el que se comunica el mensaje"
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
      "id": "medicines",
      "name": "medicamentos",
      "error": "confunde el producto nombrado con otro medicamento",
      "match": "\\b(?:medicamentos|medicines)\\b",
      "category": "vocabulary",
      "function": "reconocer el nombre del producto mencionado en la situación dada"
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
      "id": "physical-sensations",
      "name": "sensaciones físicas",
      "error": "confunde la sensación que expresa el mensaje",
      "match": "\\b(?:sensaciones fisicas|physical sensations)\\b",
      "category": "vocabulary",
      "function": "nombrar la sensación del personaje o situación dada"
    },
    {
      "id": "sizes",
      "name": "tallas",
      "error": "comunica una talla distinta de la solicitada",
      "match": "\\b(?:tallas|sizes)\\b",
      "category": "vocabulary",
      "function": "precisar la talla del producto indicado"
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
      "id": "roads",
      "name": "vías",
      "error": "confunde calle, avenida u otra vía del recorrido",
      "match": "\\b(?:vias|vias de circulacion|roads)\\b",
      "category": "vocabulary",
      "function": "nombrar la vía de circulación indicada"
    },
    {
      "id": "courtesy",
      "name": "mostrar cortesía",
      "error": "la fórmula elegida cambia la intención de agradecimiento o trato solicitado",
      "match": "\\b(?:mostrar cortesia|expresiones de cortesia|formulas de cortesia)\\b",
      "category": "expression",
      "function": "comunicar el trato cortés en la situación indicada"
    },
    {
      "id": "attention",
      "name": "captar la atención",
      "error": "no permite reconocer a quién se llama en el intercambio",
      "match": "\\b(?:captar la atencion|atraer la atencion|llamar la atencion)\\b",
      "category": "expression",
      "function": "llamar al interlocutor antes de comunicarle el mensaje"
    },
    {
      "id": "interruption",
      "name": "interrumpir con cortesía",
      "error": "la fórmula cambia la solicitud por una intervención ajena al intercambio",
      "match": "\\b(?:interrumpir (?:con cortesia|cortesmente)|interrupcion cortes)\\b",
      "category": "expression",
      "function": "solicitar una interrupción relacionada con el intercambio"
    },
    {
      "id": "turns",
      "name": "pedir o dar la palabra según lo solicitado",
      "error": "pide tomar el turno cuando corresponde cederlo o lo contrario",
      "match": "\\b(?:pedir y dar la palabra|pedir la palabra|dar la palabra|tomar el turno|ceder el turno)\\b",
      "category": "expression",
      "function": "regular el turno de intervención"
    },
    {
      "id": "repetition",
      "name": "pedir que repitan",
      "error": "la solicitud no permite reconocer qué información se pide repetir",
      "match": "\\b(?:pedir que repitan|pedir repeticion|solicitar repeticion)\\b",
      "category": "expression",
      "function": "solicitar repetición de la información que necesita aclaración"
    },
    {
      "id": "uncertainty",
      "name": "expresar duda",
      "error": "comunica como seguro lo que el referente considera dudoso",
      "match": "\\b(?:expresar duda|dudar|uncertainty)\\b",
      "category": "expression",
      "function": "distinguir una posibilidad de una afirmación confirmada"
    },
    {
      "id": "empathy",
      "name": "mostrar interés o empatía",
      "error": "la respuesta se refiere a otro asunto y no reconoce la situación comunicada",
      "match": "\\b(?:mostrar interes(?: o empatia)?|mostrar empatia|expresiones de empatia)\\b",
      "category": "expression",
      "function": "responder a la situación comunicada con una expresión de interés o apoyo"
    },
    {
      "id": "indifference",
      "name": "mostrar indiferencia o desinterés",
      "error": "expresa interés o rechazo cuando pretende comunicar indiferencia",
      "match": "\\b(?:mostrar indiferencia(?: o desinteres)?|mostrar desinteres)\\b",
      "category": "expression",
      "function": "expresar que la elección no modifica la preferencia comunicada"
    },
    {
      "id": "agreement",
      "name": "mostrar acuerdo o desacuerdo según lo solicitado",
      "error": "expresa lo contrario del acuerdo o desacuerdo que pretende comunicar",
      "match": "\\b(?:mostrar acuerdo(?: y desacuerdo)?|mostrar desacuerdo|expresar acuerdo|expresar desacuerdo)\\b",
      "category": "expression",
      "function": "comunicar su respuesta a la idea del interlocutor"
    },
    {
      "id": "desire",
      "name": "expresar deseos",
      "error": "presenta como confirmado el resultado que solo se desea",
      "match": "\\b(?:expresar deseos|expresiones de deseos)\\b",
      "category": "expression",
      "function": "comunicar la esperanza o el deseo indicado en la situación"
    }
  ],
  "englishGradeTwoStrategies": [
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
      "match": "revis\\w* (?:el |un )?(?:borrador|mensaje|texto|sentido)|correg\\w* problemas",
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
    }
  ],
  "englishGradeTwoEvidencePolicy": "COMMON_SCOPE_EXPLICIT_FORMS_ACTIONS_PRODUCTS_CONDITIONS_NO_TRAIT_SCORES_V1",
  "englishGradeTwoAlternativePolicy": "REQUESTED_ONE_OF_FORMS_OR_PRODUCTS_NOT_SIMULTANEOUS_REQUIREMENTS_V1"
}
export const evaluationCatalogV49={...evaluationCatalogV48,...frozen}
