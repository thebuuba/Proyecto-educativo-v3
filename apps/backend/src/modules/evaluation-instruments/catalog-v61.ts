import {evaluationCatalogV60} from './catalog-v60'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.61",
  "englishGradeFiveGenres": [
    {
      "id": "conversation",
      "data": "la relación entre las intervenciones de los interlocutores",
      "error": "confunde quién interviene o a qué intervención responde",
      "match": "conversacion(?:es)?|dialogos?",
      "modes": [
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
        "reading"
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
        "reading"
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
        "oral",
        "writing"
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
        "oral"
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
        "reading"
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
        "reading"
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
        "reading"
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
        "reading"
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
        "oral"
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
        "reading"
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
        "reading"
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
        "listening",
        "writing"
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
        "reading"
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
    },
    {
      "id": "catalog",
      "data": "los elementos y la información solicitada del catálogo",
      "error": "atribuye a un elemento información de otro del catálogo",
      "match": "catalogos?|catalogues?|catalogs?",
      "modes": [
        "reading"
      ],
      "title": "Información consultada del catálogo",
      "source": "CURRICULUM",
      "production": ""
    },
    {
      "id": "dictionary",
      "data": "la entrada y el significado solicitados del diccionario",
      "error": "atribuye a la palabra una acepción diferente de la consultada",
      "match": "diccionarios?|dictionaries",
      "modes": [
        "reading"
      ],
      "title": "Entrada y significado del diccionario",
      "source": "CURRICULUM",
      "production": ""
    },
    {
      "id": "invoice",
      "data": "los datos solicitados de la factura y sus referentes",
      "error": "atribuye los datos de la factura a otro producto o referente",
      "match": "facturas?|invoices?",
      "modes": [
        "reading"
      ],
      "title": "Datos consultados de la factura",
      "source": "CURRICULUM",
      "production": ""
    },
    {
      "id": "instructions",
      "data": "las acciones de las instrucciones y su orden",
      "error": "cambia las acciones o su orden y altera las instrucciones",
      "match": "textos? de instrucciones|instrucciones|instructions",
      "modes": [
        "reading",
        "listening",
        "writing"
      ],
      "title": "Pasos del texto de instrucciones",
      "source": "CURRICULUM",
      "production": "Comunica en inglés los pasos de las instrucciones en un orden que permite seguir la tarea indicada.",
      "existingFunction": "instructions"
    },
    {
      "id": "presentation",
      "data": "las ideas e información solicitadas en la presentación",
      "error": "cambia el asunto o las relaciones entre las ideas de la presentación",
      "match": "presentacion(?:es)?|presentations?",
      "modes": [
        "oral"
      ],
      "title": "Ideas relacionadas en la presentación",
      "source": "CURRICULUM",
      "production": "Relaciona en inglés las ideas e información de la presentación con un orden que permite seguir el asunto y su propósito."
    },
    {
      "id": "argumentation",
      "data": "el punto de vista y las razones solicitadas de la argumentación",
      "error": "las razones contradicen el punto de vista o no se relacionan con él",
      "match": "argumentacion(?:es)?|argumentations?",
      "modes": [
        "oral"
      ],
      "title": "Punto de vista y razones de la argumentación",
      "source": "CURRICULUM",
      "production": "Relaciona en inglés el punto de vista de la argumentación con las razones solicitadas para sustentarlo ante el interlocutor."
    }
  ],
  "englishGradeFiveModule": {
    "id": "ingles-comunicacion-5",
    "grade": 5,
    "policy": "COMMON_FIFTH_GRADE_DEFINED_FAMILIES_REVIEW_PENDING_V1",
    "pdfPages": [
      163,
      164,
      165,
      166,
      167,
      168
    ],
    "subjectCode": "ING"
  },
  "englishGradeFiveGrammar": [
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
      "id": "reflexive-pronouns",
      "name": "los pronombres reflexivos",
      "error": "atribuye a otra persona una acción que recae sobre el sujeto",
      "match": "\\b(?:pronombres? reflexivos?|reflexive pronouns?)\\b",
      "function": "relacionar una acción con el mismo referente que la realiza"
    },
    {
      "id": "exclamation",
      "name": "las oraciones exclamativas",
      "error": "la forma comunica una reacción incompatible con el acontecimiento indicado",
      "match": "\\b(?:oraciones? exclamativas?|exclamaciones?|exclamatory sentences?)\\b",
      "function": "expresar una reacción relacionada con el acontecimiento comunicado"
    },
    {
      "id": "relative-pronouns",
      "name": "los pronombres relativos",
      "error": "relaciona la información con una persona o elemento distinto",
      "match": "\\b(?:pronombres? relativos?|relative pronouns?)\\b",
      "function": "enlazar información adicional con el referente al que corresponde"
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
    },
    {
      "id": "declarative",
      "name": "las oraciones enunciativas solicitadas",
      "error": "invierte la afirmación o negación del mensaje",
      "match": "\\b(?:oraciones? (?:enunciativas?|afirmativas?|negativas?)|declarative sentences?)\\b",
      "terms": [
        [
          "afirmativas?",
          "las oraciones afirmativas"
        ],
        [
          "negativas?",
          "las oraciones negativas"
        ]
      ],
      "function": "comunicar una afirmación positiva o negativa con el sentido solicitado"
    },
    {
      "id": "interrogative-sentences",
      "name": "las oraciones interrogativas",
      "error": "pregunta por otro asunto o cambia la relación entre los referentes",
      "match": "\\b(?:oraciones? interrogativas?|preguntas? directas?|interrogative sentences?)\\b",
      "function": "preguntar por la información indicada mediante una pregunta directa comprensible"
    },
    {
      "id": "used-to",
      "name": "used to",
      "error": "presenta como hábito actual la situación pasada",
      "match": "\\b(?:used to)\\b",
      "function": "expresar un hábito pasado del referente indicado"
    },
    {
      "id": "verb-complements",
      "name": "el complemento verbal en infinitivo o gerundio solicitado",
      "error": "el complemento no es compatible con el verbo elegido o cambia la acción comunicada",
      "match": "\\b(?:verbos? (?:seguidos (?:por|de)|que admiten) (?:infinitivo|gerundio)(?: o gerundio)?|verb complements?)\\b",
      "terms": [
        [
          "infinitivo",
          "el complemento en infinitivo"
        ],
        [
          "gerundio",
          "el complemento en gerundio"
        ]
      ],
      "function": "seleccionar un complemento compatible con el verbo para comunicar la acción indicada"
    },
    {
      "id": "indirect-questions",
      "name": "las preguntas indirectas o integradas solicitadas",
      "error": "la pregunta integrada cambia la información pedida o el orden que permite comprenderla",
      "match": "\\b(?:preguntas? indirectas?|preguntas? integradas?|embedded questions?|indirect questions?)\\b",
      "function": "integrar la pregunta dentro de otra expresión conservando la información solicitada y el orden correspondiente"
    },
    {
      "id": "zero-article",
      "name": "la omisión del artículo solicitada",
      "error": "cambia una referencia general por una específica o elimina un artículo necesario en el contexto",
      "match": "\\b(?:omision del articulo|articulo cero|zero article)\\b",
      "function": "conservar la referencia general que el contexto permite expresar sin artículo"
    },
    {
      "id": "frequency-adverbs",
      "name": "los adverbios de frecuencia",
      "error": "confunde una acción habitual con una ocasional o inexistente",
      "match": "\\b(?:adverbios? de frecuencia|adverbs? of frequency)\\b",
      "function": "expresar la frecuencia de la acción indicada"
    },
    {
      "id": "preposition-use",
      "name": "las preposiciones solicitadas",
      "error": "la preposición cambia la relación solicitada entre los referentes",
      "match": "\\b(?:uso de preposiciones|preposiciones solicitadas)\\b",
      "function": "establecer la relación entre los elementos del mensaje según su sentido en la situación"
    },
    {
      "id": "sentence-final-preposition",
      "name": "la preposición al final de la oración",
      "error": "relaciona la preposición con un complemento diferente del indicado",
      "match": "\\b(?:preposicion al final de la oracion|sentence final preposition)\\b",
      "function": "mantener la relación de la preposición con su complemento aunque este se encuentre en otra posición de la oración"
    },
    {
      "id": "present-simple",
      "name": "el presente simple",
      "error": "cambia el referente o el sentido de los datos actuales de la situación",
      "match": "\\b(?:presente simple|present simple|simple present)\\b",
      "function": "comunicar los datos actuales de la consulta simulada o del problema reclamado según la situación indicada"
    },
    {
      "id": "medical-verbs",
      "name": "be, have, feel y hurt según los verbos solicitados",
      "error": "atribuye al personaje un estado o síntoma diferente del proporcionado",
      "match": "\\b(?:be have feel y hurt|verbos? (?:be|have|feel|hurt))\\b",
      "function": "relacionar el estado o síntoma con el personaje de la ficha de la consulta simulada"
    },
    {
      "id": "suggest",
      "name": "suggest",
      "error": "la recomendación cambia la acción o el referente al que se dirige",
      "match": "\\b(?:suggest)\\b",
      "function": "proponer una recomendación relacionada con la necesidad indicada"
    },
    {
      "id": "advise",
      "name": "advise",
      "error": "el consejo cambia la necesidad o se dirige a otro referente",
      "match": "\\b(?:advise)\\b",
      "function": "comunicar un consejo relacionado con la necesidad del referente indicado"
    },
    {
      "id": "causatives",
      "name": "los verbos causativos solicitados",
      "error": "atribuye la acción a quien la encarga o cambia quién la realiza o recibe",
      "match": "\\b(?:verbos causativos|causative verbs|get have y make)\\b",
      "function": "distinguir quién encarga o provoca la acción y quién la realiza o la recibe en la situación"
    },
    {
      "id": "past-simple",
      "name": "el pasado simple",
      "error": "presenta como actual un acontecimiento terminado o cambia el hecho narrado",
      "match": "\\b(?:pasado simple|past simple|simple past)\\b",
      "function": "narrar el acontecimiento terminado con su referencia al pasado"
    },
    {
      "id": "present-perfect",
      "name": "el presente perfecto",
      "error": "presenta el antecedente como un hecho en desarrollo o cambia su relación con el presente",
      "match": "\\b(?:presente perfecto(?! continuo)|present perfect(?! continuous))\\b",
      "function": "relacionar el antecedente del personaje de la consulta simulada con la situación presente"
    },
    {
      "id": "present-perfect-continuous",
      "name": "el presente perfecto continuo",
      "error": "cambia una situación continuada por un hecho terminado o altera su duración",
      "match": "\\b(?:presente perfecto continuo|present perfect continuous)\\b",
      "function": "comunicar la continuidad del estado o actividad que se relaciona con la consulta simulada o la información reportada"
    },
    {
      "id": "past-continuous",
      "name": "el pasado continuo",
      "error": "confunde la acción en desarrollo y el acontecimiento terminado o altera su relación",
      "match": "\\b(?:pasado continuo|past continuous)\\b",
      "function": "situar la acción en desarrollo con la que se relaciona otro acontecimiento de la narración"
    },
    {
      "id": "past-perfect",
      "name": "el pasado perfecto",
      "error": "invierte la anterioridad entre los acontecimientos del pasado",
      "match": "\\b(?:pasado perfecto|past perfect)\\b",
      "function": "distinguir el acontecimiento anterior a otro hecho pasado de la narración"
    },
    {
      "id": "future-continuous",
      "name": "el futuro continuo",
      "error": "presenta como terminada la acción futura en desarrollo o cambia su referencia temporal",
      "match": "\\b(?:futuro continuo|future continuous)\\b",
      "function": "situar la acción que estará en desarrollo al reportar información o expresar una probabilidad"
    },
    {
      "id": "modal-cannot",
      "name": "can’t",
      "error": "presenta como permitida la acción que la situación prohíbe",
      "match": "\\b(?:can t|cannot)\\b",
      "function": "comunicar la prohibición de la acción en la situación indicada"
    },
    {
      "id": "modal-must",
      "name": "must",
      "error": "confunde una obligación con una opción o una deducción con un hecho directamente observado",
      "match": "\\b(?:must)\\b",
      "function": "expresar la obligación o la certeza deducida de los indicios según la intención solicitada"
    },
    {
      "id": "modal-have-to",
      "name": "have to",
      "error": "convierte en opcional la obligación o cambia la acción requerida",
      "match": "\\b(?:have to)\\b",
      "function": "comunicar la obligación establecida en las condiciones de la situación"
    },
    {
      "id": "modal-should",
      "name": "should",
      "error": "presenta el consejo como un hecho ya ocurrido o cambia la recomendación",
      "match": "\\b(?:should)\\b",
      "function": "comunicar un consejo relacionado con la necesidad del personaje"
    },
    {
      "id": "modal-ought-to",
      "name": "ought to",
      "error": "cambia la acción recomendada o su referente",
      "match": "\\b(?:ought to)\\b",
      "function": "comunicar una recomendación relacionada con los datos de la situación"
    },
    {
      "id": "modal-supposed-to",
      "name": "be supposed to",
      "error": "atribuye al acuerdo una expectativa diferente de la indicada",
      "match": "\\b(?:be supposed to)\\b",
      "function": "comunicar la acción esperada por la norma o acuerdo proporcionado"
    },
    {
      "id": "modal-need-to",
      "name": "need to",
      "error": "cambia la acción necesaria o la presenta como ya realizada",
      "match": "\\b(?:need to)\\b",
      "function": "comunicar la necesidad de una acción en la situación indicada"
    },
    {
      "id": "modal-may",
      "name": "may",
      "error": "presenta la posibilidad como confirmada o cambia la solicitud de la transacción",
      "match": "\\b(?:may)\\b",
      "function": "comunicar una posibilidad o una solicitud cortés al obtener bienes o servicios según la intención indicada"
    },
    {
      "id": "modal-might",
      "name": "might",
      "error": "presenta como seguro lo que los indicios solo permiten considerar posible",
      "match": "\\b(?:might)\\b",
      "function": "expresar una posibilidad incierta relacionada con los indicios de la situación"
    },
    {
      "id": "modal-could",
      "name": "could",
      "error": "altera el grado de posibilidad o cambia el sentido de la solicitud",
      "match": "\\b(?:could)\\b",
      "function": "comunicar una posibilidad o una solicitud cortés de bienes o servicios según la intención indicada"
    },
    {
      "id": "modal-will",
      "name": "will",
      "error": "sitúa como ya realizada una elección futura o cambia el bien solicitado",
      "match": "\\b(?:will)\\b",
      "function": "comunicar la elección o solicitud futura del bien o servicio indicado"
    },
    {
      "id": "modal-would-like",
      "name": "would like",
      "error": "atribuye al interlocutor una solicitud distinta de la indicada",
      "match": "\\b(?:would like)\\b",
      "function": "solicitar cortésmente el bien o servicio indicado"
    },
    {
      "id": "modal-can",
      "name": "can",
      "error": "cambia lo solicitado o lo presenta como una orden incompatible con la situación",
      "match": "\\b(?:can(?! t\\b))\\b",
      "function": "solicitar el bien o servicio de la transacción mediante una expresión cortés"
    },
    {
      "id": "phrasal-verbs",
      "name": "los phrasal verbs solicitados",
      "error": "atribuye al conjunto otro significado o relaciona la partícula con otro referente",
      "match": "\\b(?:phrasal verbs|verbos frasales|settle down|pick up)\\b",
      "function": "relacionar el verbo y su partícula con el significado de la acción indicada"
    },
    {
      "id": "there-be",
      "name": "there + be en pasado",
      "error": "cambia la existencia o sitúa como presente el acontecimiento pasado",
      "match": "\\b(?:there be|there was|there were)\\b",
      "function": "comunicar la existencia de un acontecimiento o referente al narrar hechos pasados"
    },
    {
      "id": "mixed-conditional",
      "name": "el condicional mixto indicado",
      "error": "presenta el resultado como incondicional o cambia la relación entre condición y modalidad",
      "match": "\\b(?:condicional mixto|mixed conditional)\\b",
      "function": "relacionar la condición con el resultado modal que depende de ella en la situación"
    },
    {
      "id": "second-conditional",
      "name": "el segundo condicional",
      "error": "presenta la hipótesis como real o invierte la relación entre la condición y su resultado",
      "match": "\\b(?:segundo condicional|second conditional)\\b",
      "function": "relacionar una situación hipotética con su resultado posible sin presentarla como un hecho confirmado"
    },
    {
      "id": "passive",
      "name": "la voz pasiva de la narración",
      "error": "atribuye al receptor la realización de la acción o cambia el acontecimiento",
      "match": "\\b(?:voz pasiva|passive voice)\\b",
      "function": "relacionar el acontecimiento narrado con el referente que recibe la acción"
    },
    {
      "id": "reported-speech",
      "name": "el estilo indirecto solicitado",
      "error": "atribuye la afirmación a otra persona o cambia sus referentes y sentido temporal",
      "match": "\\b(?:reported speech|estilo indirecto|discurso indirecto)\\b",
      "function": "reportar lo dicho conservando la información, sus referentes y las relaciones temporales indicadas"
    },
    {
      "id": "emphatic-do",
      "name": "el uso enfático de do",
      "error": "el énfasis cambia la afirmación o altera el momento de la acción",
      "match": "\\b(?:oraciones enfaticas con do|emphatic do)\\b",
      "function": "enfatizar la afirmación conservando la acción y su referencia temporal"
    },
    {
      "id": "quantity-adverbs",
      "name": "los adverbios y frases adverbiales de cantidad",
      "error": "cambia la cantidad que debe reconocer el destinatario",
      "match": "\\b(?:adverbios de cantidad|adverbs of quantity)\\b",
      "function": "precisar la cantidad comunicada en la situación"
    },
    {
      "id": "probability-adverbs",
      "name": "las expresiones adverbiales de probabilidad o certeza solicitadas",
      "error": "presenta como seguro lo posible o atribuye duda a lo confirmado por los datos",
      "match": "\\b(?:adverbios de probabilidad|adverbios de certeza|adverbs of probability|adverbs of certainty)\\b",
      "function": "expresar el grado de probabilidad o seguridad de la información"
    },
    {
      "id": "emphatic-reflexives",
      "name": "el uso enfático de los pronombres reflexivos",
      "error": "atribuye el énfasis a otro referente o confunde énfasis y acción reflexiva",
      "match": "\\b(?:uso enfatico de los pronombres reflexivos|emphatic reflexive pronouns)\\b",
      "function": "destacar al referente que realiza la acción sin cambiar su identidad"
    },
    {
      "id": "how-much-many",
      "name": "how much o how many según la cantidad solicitada",
      "error": "pregunta por un precio cuando se requiere cantidad de elementos o altera lo solicitado",
      "match": "\\b(?:how much|how many)\\b",
      "function": "preguntar por la cantidad o el precio en la transacción indicada"
    },
    {
      "id": "why-suggestion",
      "name": "why don’t o why not según la forma solicitada",
      "error": "la forma cambia la propuesta por otra acción o altera su destinatario",
      "match": "\\b(?:why don t|why not)\\b",
      "function": "proponer una acción como consejo o sugerencia en la situación indicada"
    },
    {
      "id": "addition-connectors",
      "name": "los conectores de adición",
      "error": "presenta como oposición o alternativa la información que debe añadirse",
      "match": "\\b(?:conectores de adicion|addition connectors)\\b",
      "function": "añadir información relacionada con la idea anterior"
    },
    {
      "id": "condition-connectors",
      "name": "los conectores de condición",
      "error": "elimina la condición o invierte su relación con la acción",
      "match": "\\b(?:conectores de condicion|condition connectors)\\b",
      "function": "relacionar una acción con la condición que permite realizarla"
    },
    {
      "id": "correlative-connectors",
      "name": "los conectores de correlación solicitados",
      "error": "confunde suma, alternativa y negación o deja sin relacionar un elemento de la correlación",
      "match": "\\b(?:conectores de correlacion|correlative connectors)\\b",
      "function": "relacionar los elementos con la suma, alternativa o negación correlativa indicada"
    },
    {
      "id": "illustration-connectors",
      "name": "los conectores de ilustración",
      "error": "el ejemplo contradice o no se relaciona con la idea que debía ilustrar",
      "match": "\\b(?:conectores de ilustracion|illustration connectors)\\b",
      "function": "relacionar una idea con el ejemplo que permite ilustrarla"
    }
  ],
  "englishGradeFiveLexicon": [
    {
      "id": "events",
      "name": "acontecimientos",
      "error": "confunde el acontecimiento comunicado con otro",
      "match": "\\b(?:acontecimientos)\\b",
      "category": "vocabulary",
      "function": "relacionar el acontecimiento con el referente y momento indicados"
    },
    {
      "id": "activities",
      "name": "actividades",
      "error": "atribuye al referente una actividad distinta",
      "match": "\\b(?:actividades)\\b",
      "category": "vocabulary",
      "function": "relacionar la acción indicada y su relación con el referente de la situación"
    },
    {
      "id": "goods-services",
      "name": "bienes y servicios",
      "error": "confunde un bien con otro servicio o cambia lo solicitado",
      "match": "\\b(?:bienes y servicios|goods and services)\\b",
      "category": "vocabulary",
      "function": "relacionar el bien o servicio con la necesidad indicada en la transacción"
    },
    {
      "id": "qualifiers",
      "name": "calificativos",
      "error": "cambia la característica o la gravedad comunicada",
      "match": "\\b(?:calificativos)\\b",
      "category": "vocabulary",
      "function": "relacionar la intensidad o característica expresada por el calificativo en la situación"
    },
    {
      "id": "money-payment",
      "name": "dinero y formas de pago",
      "error": "atribuye a la transacción otro importe o medio de pago",
      "match": "\\b(?:dinero y formas de pago)\\b",
      "category": "vocabulary",
      "function": "relacionar el importe o medio de pago con la transacción proporcionada"
    },
    {
      "id": "education",
      "name": "educación",
      "error": "cambia el nivel o institución educativa del referente",
      "match": "\\b(?:educacion)\\b",
      "category": "vocabulary",
      "function": "relacionar el nivel, curso o institución educativa de la información dada"
    },
    {
      "id": "narrative-elements",
      "name": "elementos de una narración",
      "error": "confunde el personaje, trama o ambiente del ejemplo",
      "match": "\\b(?:elementos de (?:una |la )?narracion|narrative elements)\\b",
      "category": "vocabulary",
      "function": "relacionar el personaje, trama o ambiente solicitado con su papel en la narración"
    },
    {
      "id": "symptoms",
      "name": "enfermedades y síntomas",
      "error": "atribuye al personaje otro síntoma o enfermedad",
      "match": "\\b(?:enfermedades y sintomas)\\b",
      "category": "vocabulary",
      "function": "relacionar el síntoma o enfermedad nombrados en la ficha del personaje ficticio"
    },
    {
      "id": "office-equipment",
      "name": "equipos y materiales de oficina",
      "error": "confunde el equipo y el material mencionados",
      "match": "\\b(?:equipos y materiales de oficina)\\b",
      "category": "vocabulary",
      "function": "relacionar el equipo o material con la acción de oficina indicada"
    },
    {
      "id": "medical-specialties",
      "name": "especialidades médicas",
      "error": "confunde la especialidad nombrada con otra",
      "match": "\\b(?:especialidades medicas)\\b",
      "category": "vocabulary",
      "function": "relacionar la especialidad mencionada en la información de la consulta simulada"
    },
    {
      "id": "establishments",
      "name": "establecimientos",
      "error": "atribuye el servicio a otro establecimiento",
      "match": "\\b(?:establecimientos)\\b",
      "category": "vocabulary",
      "function": "relacionar el establecimiento con el servicio o referente de la situación"
    },
    {
      "id": "organized-events",
      "name": "eventos",
      "error": "confunde el evento o su referente",
      "match": "\\b(?:eventos)\\b",
      "category": "vocabulary",
      "function": "relacionar el evento con la información proporcionada de su realización"
    },
    {
      "id": "contingencies",
      "name": "eventualidades",
      "error": "atribuye al personaje otro contratiempo",
      "match": "\\b(?:eventualidades)\\b",
      "category": "vocabulary",
      "function": "relacionar el contratiempo del personaje con lo ocurrido en la situación"
    },
    {
      "id": "places-monuments",
      "name": "lugares y monumentos",
      "error": "confunde el lugar o monumento mencionado",
      "match": "\\b(?:lugares y monumentos)\\b",
      "category": "vocabulary",
      "function": "relacionar el lugar o monumento con la referencia de la información dada"
    },
    {
      "id": "medicines",
      "name": "medicamentos",
      "error": "cambia el nombre comunicado en la ficha",
      "match": "\\b(?:medicamentos)\\b",
      "category": "vocabulary",
      "function": "relacionar el medicamento nombrado en los datos de una situación ficticia, sin recomendar tratamientos"
    },
    {
      "id": "measurements",
      "name": "medidas",
      "error": "cambia la unidad o atribuye otra magnitud al dato",
      "match": "\\b(?:medidas)\\b",
      "category": "vocabulary",
      "function": "relacionar la magnitud y unidad solicitadas con el dato de la situación"
    },
    {
      "id": "personal-objects",
      "name": "objetos personales",
      "error": "atribuye otro objeto o poseedor a la información",
      "match": "\\b(?:objetos personales)\\b",
      "category": "vocabulary",
      "function": "relacionar el objeto con el referente indicado en la situación ficticia"
    },
    {
      "id": "body-parts",
      "name": "partes del cuerpo",
      "error": "atribuye al síntoma o dato otra parte del cuerpo",
      "match": "\\b(?:partes del cuerpo)\\b",
      "category": "vocabulary",
      "function": "relacionar la parte del cuerpo mencionada con el personaje de la ficha"
    },
    {
      "id": "famous-people",
      "name": "personajes célebres",
      "error": "atribuye a una persona los datos de otra",
      "match": "\\b(?:personajes celebres)\\b",
      "category": "vocabulary",
      "function": "relacionar la persona mencionada con los datos de su referencia proporcionada"
    },
    {
      "id": "medical-procedures",
      "name": "procedimientos médicos",
      "error": "confunde el procedimiento comunicado en la ficha",
      "match": "\\b(?:procedimientos medicos)\\b",
      "category": "vocabulary",
      "function": "relacionar el procedimiento nombrado con los datos de la consulta ficticia, sin ejecutarlo ni indicarlo como tratamiento"
    },
    {
      "id": "reporting-verbs",
      "name": "reportar información",
      "error": "atribuye la información a otra persona o cambia cómo se comunica",
      "match": "\\b(?:reportar informacion)\\b",
      "category": "vocabulary",
      "function": "relacionar quién comunica la información con la acción de decir, contar o explicar solicitada"
    },
    {
      "id": "transactions",
      "name": "transacciones",
      "error": "cambia la operación o su referente",
      "match": "\\b(?:transacciones)\\b",
      "category": "vocabulary",
      "function": "relacionar la acción de compra, alquiler o depósito solicitada con sus referentes"
    },
    {
      "id": "encouragement",
      "name": "animar y motivar",
      "error": "la expresión comunica una intención incompatible con el ánimo solicitado",
      "match": "\\b(?:animar(?: y motivar)?|motivar|dar animo)\\b",
      "category": "expression",
      "function": "comunicar ánimo relacionado con la situación o actuación del referente"
    },
    {
      "id": "confirmation",
      "name": "confirmar información",
      "error": "confirma información diferente o atribuye al interlocutor otra afirmación",
      "match": "\\b(?:confirmar informacion)\\b",
      "category": "expression",
      "function": "confirmar la información comunicada por el interlocutor o solicitar su confirmación según la intención indicada"
    },
    {
      "id": "date",
      "name": "expresar una fecha",
      "error": "cambia una referencia de la fecha indicada",
      "match": "\\b(?:expresar (?:una |la )?fecha|fechas?)\\b",
      "category": "expression",
      "function": "comunicar la fecha de la situación con el día, mes o año solicitados"
    },
    {
      "id": "time",
      "name": "expresar la hora",
      "error": "cambia la hora de la situación comunicada",
      "match": "\\b(?:expresar (?:una |la )?hora|horas?)\\b",
      "category": "expression",
      "function": "comunicar la hora indicada con sus referencias temporales"
    },
    {
      "id": "courtesy",
      "name": "expresarse con cortesía",
      "error": "la expresión comunica un trato o intención incompatible con la situación",
      "match": "\\b(?:expresarse con cortesia|formulas de cortesia)\\b",
      "category": "expression",
      "function": "comunicar la intención solicitada mediante una fórmula cortés pertinente para el interlocutor"
    },
    {
      "id": "offer-help",
      "name": "ofrecer ayuda",
      "error": "ofrece una acción que no responde a la necesidad indicada",
      "match": "\\b(?:ofrecer(?:an)? ayuda)\\b",
      "category": "expression",
      "function": "ofrecer apoyo relacionado con la necesidad comunicada por el interlocutor"
    },
    {
      "id": "ask-help",
      "name": "pedir ayuda",
      "error": "la solicitud pide otro apoyo o no permite reconocer la necesidad",
      "match": "\\b(?:pedir(?:an)? ayuda|solicitar(?:an)? ayuda|pidan ayuda)\\b",
      "category": "expression",
      "function": "solicitar la ayuda pertinente precisando la necesidad o parte del mensaje que requiere apoyo"
    }
  ],
  "englishGradeFiveStrategies": [
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
      "id": "planning",
      "match": "planific\\w*(?: (?:el|un|su|en|ingles|por|escrito)){0,4} (?:mensaje|discurso|texto|presentacion)|organiz\\w* (?:las |sus )?ideas",
      "modes": [
        "oral",
        "interaction",
        "writing"
      ],
      "title": "Planificación del mensaje",
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
      "id": "courtesy",
      "match": "normas de cortesia|con cortesia|con respeto|sin descalificaciones|asertiv\\w*|con tacto",
      "modes": [
        "writing",
        "oral",
        "interaction"
      ],
      "title": "Cortesía en la intención comunicativa",
      "levels": [
        "Comunica en inglés la intención solicitada con fórmulas de cortesía pertinentes para la situación, sin descalificar al interlocutor.",
        "La intención se comprende y el trato es cortés; una fórmula necesita ajuste a la situación.",
        "La intención se reconoce, pero una expresión necesita reformulación para comunicarla con cortesía.",
        "La expresión descalifica al interlocutor o comunica una intención contraria a la solicitada.",
        "No se reconoce una expresión de la intención comunicativa solicitada."
      ]
    },
    {
      "id": "neutral-register",
      "match": "registro neutro|neutral register",
      "modes": [
        "writing",
        "oral",
        "interaction"
      ],
      "title": "Registro neutro acorde con la situación",
      "levels": [
        "Emplea en inglés un registro neutro acorde con la función, el destinatario y la situación de comunicación proporcionados.",
        "El registro corresponde a la situación principal; una fórmula necesita ajuste.",
        "El mensaje se reconoce, pero varias expresiones mezclan tratamientos que no corresponden a la situación.",
        "El registro atribuye al interlocutor un trato incompatible con la situación proporcionada.",
        "No se reconoce un mensaje pertinente que permita valorar el registro solicitado."
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
      "id": "main-secondary",
      "match": "ideas? principal(?:es)?|ideas? secundarias?",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Ideas principales y secundarias del texto",
      "levels": [
        "Identifica {target} del texto en inglés y relaciona la información según su papel en el asunto comunicado.",
        "Reconoce {target}; una relación con el asunto del texto necesita precisión.",
        "Recupera información aislada, pero confunde parte de {target} o deja sin relacionar su papel en el texto.",
        "Atribuye al texto otras ideas o invierte la relación entre la información central y la que la desarrolla.",
        "No aporta información reconocible que permita identificar {target} del texto."
      ]
    },
    {
      "id": "compensation",
      "match": "estrategias compensatorias|sinonimos|comodines",
      "modes": [
        "writing"
      ],
      "title": "Expresión compensatoria que conserva el sentido",
      "levels": [
        "Utiliza en el texto en inglés {target} que permite comunicar la idea buscada cuando falta una expresión, conservando su sentido en la situación indicada.",
        "La expresión compensatoria conserva la idea principal; una referencia necesita precisión.",
        "Sustituye una palabra o expresión, pero deja ambigua parte de la idea que debía comunicar.",
        "La expresión elegida cambia el sentido de la idea o atribuye al referente otra acción o característica.",
        "No se reconoce una expresión compensatoria relacionada con la idea solicitada."
      ]
    }
  ]
}
export const evaluationCatalogV61={...evaluationCatalogV60,...frozen}
