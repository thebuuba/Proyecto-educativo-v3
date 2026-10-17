import {evaluationCatalogV55} from './catalog-v55'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.56",
  "englishGradeFourGenres": [
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
  "englishGradeFourModule": {
    "id": "ingles-comunicacion-4",
    "grade": 4,
    "policy": "COMMON_FOURTH_GRADE_FUNCTIONS_GRAMMAR_LEXICON_STRATEGIES_GENRES_PARTIAL_V2",
    "pdfPages": [
      158,
      159,
      160,
      161,
      162
    ],
    "subjectCode": "ING"
  },
  "englishGradeFourGrammar": [
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
      "id": "present-simple",
      "name": "el presente simple",
      "error": "cambia el referente o el sentido de la afirmación de la situación",
      "match": "\\b(?:presente simple|present simple|simple present)\\b",
      "function": "comunicar información, un punto de vista o la situación que explica un problema, según la intención solicitada"
    },
    {
      "id": "present-continuous",
      "name": "el presente continuo",
      "error": "sitúa como terminada o habitual la acción del plan futuro",
      "match": "\\b(?:presente continuo|present continuous)\\b",
      "function": "expresar el plan futuro indicado con su referencia temporal"
    },
    {
      "id": "past-simple",
      "name": "el pasado simple",
      "error": "cambia el acontecimiento o su referencia al pasado",
      "match": "\\b(?:pasado simple|past simple|simple past)\\b",
      "function": "comunicar el acontecimiento terminado de la noticia o experiencia indicada"
    },
    {
      "id": "present-perfect",
      "name": "el presente perfecto",
      "error": "sitúa como acción en desarrollo o sin relación con el presente el acontecimiento reciente",
      "match": "\\b(?:presente perfecto|present perfect)\\b",
      "function": "comunicar una noticia o experiencia reciente relacionada con el presente"
    },
    {
      "id": "used-to",
      "name": "used to",
      "error": "presenta como hábito actual la situación pasada",
      "match": "\\b(?:used to)\\b",
      "function": "expresar un hábito pasado del referente indicado"
    },
    {
      "id": "imperative",
      "name": "el imperativo",
      "error": "cambia una instrucción afirmativa por una prohibición o altera la acción solicitada",
      "match": "\\b(?:imperativos?|imperatives?)\\b",
      "function": "comunicar la acción solicitada en una instrucción"
    },
    {
      "id": "past-continuous",
      "name": "el pasado continuo",
      "error": "confunde la acción en desarrollo con un hecho terminado o cambia el motivo del problema",
      "match": "\\b(?:pasado continuo|past continuous)\\b",
      "function": "situar la acción en desarrollo que permite explicar el problema o su motivo en el pasado"
    },
    {
      "id": "future-continuous",
      "name": "el futuro continuo",
      "error": "sitúa como terminada o presente la acción en desarrollo del plan futuro",
      "match": "\\b(?:futuro continuo|future continuous|future progressive)\\b",
      "function": "comunicar el plan o acción que estará en desarrollo en el momento futuro indicado"
    },
    {
      "id": "going-to",
      "name": "be going to",
      "error": "cambia la acción futura o su relación con los indicios o el plan indicado",
      "match": "\\b(?:be going to|going to)\\b",
      "function": "comunicar un plan, anuncio o resultado futuro previsto a partir de la situación indicada"
    },
    {
      "id": "will",
      "name": "will",
      "error": "presenta como ocurrido un resultado futuro o cambia la predicción solicitada",
      "match": "\\b(?:will)\\b",
      "function": "comunicar una predicción sobre el resultado futuro indicado"
    },
    {
      "id": "hope",
      "name": "hope",
      "error": "presenta como confirmado el resultado que el referente espera",
      "match": "\\b(?:hope)\\b",
      "function": "comunicar la esperanza del referente en un resultado que no se presenta como confirmado"
    },
    {
      "id": "wish",
      "name": "wish",
      "error": "cambia el sentido del deseo o lo presenta como un resultado ya confirmado",
      "match": "\\b(?:wish)\\b",
      "function": "expresar el deseo del referente sin presentarlo como un hecho confirmado"
    },
    {
      "id": "would-like",
      "name": "would like",
      "error": "comunica una afirmación confirmada cuando se pide un deseo",
      "match": "\\b(?:would like)\\b",
      "function": "expresar un deseo o preferencia del referente en la situación solicitada"
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
      "id": "phrasal-verbs",
      "name": "los phrasal verbs solicitados",
      "error": "atribuye al verbo y su partícula un significado diferente o cambia su relación",
      "match": "\\b(?:phrasal verbs?|verbos? frasales?|turn up|fill out|get along with|look after)\\b",
      "terms": [
        [
          "turn up",
          "turn up"
        ],
        [
          "fill out",
          "fill out"
        ],
        [
          "get along with",
          "get along with"
        ],
        [
          "look after",
          "look after"
        ]
      ],
      "function": "relacionar el verbo y su partícula para comunicar el significado indicado en la situación"
    },
    {
      "id": "there-be",
      "name": "there + be",
      "error": "cambia la existencia, la cantidad o el momento indicado",
      "match": "\\b(?:there be|there (?:is going to be|s going to be|has been|have been|will be|is|are|was|were))\\b",
      "function": "comunicar existencia en el anuncio, noticia o explicación del problema con la referencia solicitada"
    },
    {
      "id": "conditional",
      "name": "la estructura condicional solicitada",
      "error": "invierte la condición y el resultado o altera su relación temporal",
      "match": "\\b(?:condicional(?:es)?(?: cero)?|primer condicional|zero conditional|first conditional)\\b",
      "function": "relacionar la condición con la acción o resultado que depende de ella según el tiempo indicado"
    },
    {
      "id": "passive",
      "name": "la voz pasiva solicitada",
      "error": "atribuye al receptor la acción que recibe o cambia el momento solicitado",
      "match": "\\b(?:voz pasiva(?: en (?:presente|pasado|futuro))?|passive voice|(?:present|past|future) passive)\\b",
      "terms": [
        [
          "pasiva en presente|present passive",
          "la voz pasiva en presente"
        ],
        [
          "pasiva en pasado|past passive",
          "la voz pasiva en pasado"
        ],
        [
          "pasiva en futuro|future passive",
          "la voz pasiva en futuro"
        ]
      ],
      "function": "comunicar la acción que recibe el referente de la información, noticia o predicción indicada"
    },
    {
      "id": "indirect-questions",
      "name": "las preguntas indirectas o integradas solicitadas",
      "error": "la pregunta integrada cambia la información pedida o el orden que permite comprenderla",
      "match": "\\b(?:preguntas? indirectas?|preguntas? integradas?|embedded questions?|indirect questions?)\\b",
      "function": "integrar la pregunta dentro de otra expresión conservando la información solicitada y el orden correspondiente"
    },
    {
      "id": "nominal-gerund",
      "name": "el gerundio en función sustantiva",
      "error": "cambia la actividad o su función nominal en la oración",
      "match": "\\b(?:gerundios? en funcion sustantiva|gerundio como sustantivo|gerunds? as nouns?)\\b",
      "function": "presentar una actividad como elemento nominal de la oración según la función solicitada"
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
      "id": "time-prepositions",
      "name": "las preposiciones de tiempo",
      "error": "sitúa el hecho en otro momento o cambia la duración indicada",
      "match": "\\b(?:preposiciones? de tiempo|prepositions? of time)\\b",
      "function": "relacionar un acontecimiento con la referencia temporal o duración solicitada"
    },
    {
      "id": "sentence-final-preposition",
      "name": "la preposición al final de la oración",
      "error": "relaciona la preposición con un complemento diferente del indicado",
      "match": "\\b(?:preposicion al final de la oracion|sentence final preposition)\\b",
      "function": "mantener la relación de la preposición con su complemento aunque este se encuentre en otra posición de la oración"
    }
  ],
  "englishGradeFourLexicon": [
    {
      "id": "sports",
      "name": "deportes",
      "error": "nombra un deporte distinto del solicitado",
      "match": "\\b(?:deportes|sports)\\b",
      "category": "vocabulary",
      "function": "nombrar la práctica deportiva indicada"
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
      "id": "technology",
      "name": "tecnología",
      "error": "confunde el dispositivo o servicio con otro referente",
      "match": "\\b(?:tecnologia|technology)\\b",
      "category": "vocabulary",
      "function": "nombrar el dispositivo o servicio tecnológico del mensaje"
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
      "id": "events-celebrations",
      "name": "acontecimientos y celebraciones solicitados",
      "error": "confunde el acontecimiento o celebración del ejemplo",
      "match": "\\b(?:acontecimientos y celebraciones|acontecimientos|celebraciones|events and celebrations)\\b",
      "category": "vocabulary",
      "function": "nombrar el acontecimiento o celebración del referente indicado"
    },
    {
      "id": "communication",
      "name": "comunicación",
      "error": "confunde el canal o la interacción de comunicación de la situación",
      "match": "\\b(?:comunicacion|communication vocabulary)\\b",
      "category": "vocabulary",
      "function": "nombrar el canal o interacción de comunicación indicado"
    },
    {
      "id": "education",
      "name": "educación",
      "error": "atribuye al referente otra oportunidad o nivel educativo",
      "match": "\\b(?:educacion|education vocabulary)\\b",
      "category": "vocabulary",
      "function": "nombrar el nivel, oportunidad o referente educativo indicado"
    },
    {
      "id": "kitchen-equipment",
      "name": "equipos y utensilios de cocina",
      "error": "confunde el equipo o utensilio mencionado con otro referente",
      "match": "\\b(?:equipos y utensilios de cocina|utensilios de cocina|kitchen equipment)\\b",
      "category": "vocabulary",
      "function": "nombrar el equipo o utensilio de la situación culinaria indicada"
    },
    {
      "id": "experiences",
      "name": "experiencias de los referentes indicados",
      "error": "atribuye al referente una experiencia distinta de la comunicada",
      "match": "\\b(?:experiencias personales|personal experiences)\\b",
      "category": "vocabulary",
      "function": "nombrar la experiencia del personaje o referente indicado"
    },
    {
      "id": "natural-phenomena",
      "name": "fenómenos naturales",
      "error": "confunde el fenómeno natural de la información proporcionada",
      "match": "\\b(?:fenomenos naturales|natural phenomena)\\b",
      "category": "vocabulary",
      "function": "nombrar el fenómeno natural mencionado en la situación"
    },
    {
      "id": "tools",
      "name": "herramientas",
      "error": "confunde la herramienta indicada con otra",
      "match": "\\b(?:herramientas|tools vocabulary)\\b",
      "category": "vocabulary",
      "function": "nombrar la herramienta y su referencia en la situación proporcionada"
    },
    {
      "id": "transport",
      "name": "medios de transporte",
      "error": "cambia el medio de transporte del mensaje",
      "match": "\\b(?:medios de transporte|means of transport)\\b",
      "category": "vocabulary",
      "function": "nombrar el medio de transporte indicado"
    },
    {
      "id": "food-preparation",
      "name": "preparación de alimentos",
      "error": "confunde la acción culinaria y cambia la preparación comunicada",
      "match": "\\b(?:preparacion de alimentos|food preparation)\\b",
      "category": "vocabulary",
      "function": "nombrar la acción culinaria indicada y su relación con la preparación"
    },
    {
      "id": "recreation",
      "name": "recreación",
      "error": "confunde la actividad recreativa mencionada con otra",
      "match": "\\b(?:recreacion|actividades recreativas|recreation)\\b",
      "category": "vocabulary",
      "function": "nombrar la actividad recreativa indicada"
    },
    {
      "id": "travel",
      "name": "viaje",
      "error": "cambia la acción, objeto o servicio del viaje comunicado",
      "match": "\\b(?:viajes?|travel vocabulary)\\b",
      "category": "vocabulary",
      "function": "nombrar la acción, objeto o servicio del viaje indicado"
    },
    {
      "id": "attention",
      "name": "atraer la atención",
      "error": "la fórmula no permite reconocer a quién se llama o para qué se inicia el contacto",
      "match": "\\b(?:atraer la atencion|llamar la atencion)\\b",
      "category": "expression",
      "function": "llamar al interlocutor antes de comunicar el mensaje"
    },
    {
      "id": "encouragement",
      "name": "animar a alguien",
      "error": "la fórmula expresa una intención distinta del ánimo solicitado",
      "match": "\\b(?:animar a alguien|dar animo)\\b",
      "category": "expression",
      "function": "comunicar ánimo relacionado con la situación o actuación del referente"
    },
    {
      "id": "interest",
      "name": "expresar interés",
      "error": "la reacción cambia el asunto o expresa una intención incompatible con la situación",
      "match": "\\b(?:expresar interes|mostrar interes)\\b",
      "category": "expression",
      "function": "comunicar una reacción de interés relacionada con lo dicho por el interlocutor"
    },
    {
      "id": "amazement",
      "name": "expresar asombro",
      "error": "la fórmula comunica una reacción incompatible con el acontecimiento",
      "match": "\\b(?:expresar asombro|mostrar asombro)\\b",
      "category": "expression",
      "function": "comunicar una reacción de asombro relacionada con el hecho indicado"
    },
    {
      "id": "empathy",
      "name": "mostrar empatía",
      "error": "la expresión contradice o descalifica la situación comunicada",
      "match": "\\b(?:mostrar empatia|expresar empatia)\\b",
      "category": "expression",
      "function": "responder a la situación comunicada por el personaje con una expresión de apoyo pertinente"
    },
    {
      "id": "ask-opinion",
      "name": "pedir opiniones",
      "error": "la pregunta pide otra información o atribuye al interlocutor un punto de vista no expresado",
      "match": "\\b(?:(?:pedir(?:an)?|pidan|solicitar(?:an)?) (?:una |las )?opinion(?:es)?)\\b",
      "category": "expression",
      "function": "solicitar el punto de vista del interlocutor sobre el asunto indicado"
    },
    {
      "id": "opinion",
      "name": "dar opiniones",
      "error": "presenta una opinión ajena como propia o cambia su sentido",
      "match": "\\b(?:dar opinion(?:es)?|expresar opinion(?:es)?)\\b",
      "category": "expression",
      "function": "comunicar el punto de vista sobre el asunto indicado"
    },
    {
      "id": "agreement",
      "name": "expresar acuerdo o desacuerdo según lo solicitado",
      "error": "invierte el acuerdo y el desacuerdo de la respuesta indicada",
      "match": "\\b(?:expresar acuerdo(?: y desacuerdo)?|expresar desacuerdo)\\b",
      "category": "expression",
      "function": "comunicar su posición respecto de lo dicho por el interlocutor"
    },
    {
      "id": "coincidence",
      "name": "coincidir o discrepar según lo solicitado",
      "error": "invierte la coincidencia o discrepancia o la polaridad de la afirmación",
      "match": "\\b(?:coincidir(?: y discrepar)?|discrepar)\\b",
      "category": "expression",
      "function": "relacionar la respuesta de coincidencia o discrepancia con la afirmación del interlocutor"
    },
    {
      "id": "clarification",
      "name": "pedir repetición o aclaración según lo solicitado",
      "error": "la petición no permite localizar qué parte del mensaje necesita aclarar",
      "match": "\\b(?:pedir repeticion(?: o aclaracion)?|pedir aclaracion|solicitar repeticion|solicitar aclaracion)\\b",
      "category": "expression",
      "function": "solicitar la repetición o aclaración de la parte del mensaje que necesita comprender"
    },
    {
      "id": "change-topic",
      "name": "cambiar de tema",
      "error": "la fórmula no permite reconocer la transición o introduce otro asunto",
      "match": "\\b(?:cambiar de tema)\\b",
      "category": "expression",
      "function": "señalar la transición hacia el nuevo asunto solicitado"
    },
    {
      "id": "close-conversation",
      "name": "concluir una conversación",
      "error": "la fórmula abre otro intercambio cuando corresponde concluirlo",
      "match": "\\b(?:concluir una conversacion|cerrar una conversacion)\\b",
      "category": "expression",
      "function": "cerrar el intercambio con una fórmula pertinente para la situación"
    },
    {
      "id": "news",
      "name": "dar una noticia",
      "error": "la fórmula no permite reconocer que se introduce una noticia",
      "match": "\\b(?:dar una noticia|comunicar una noticia)\\b",
      "category": "expression",
      "function": "introducir el acontecimiento nuevo que se comunica al interlocutor"
    },
    {
      "id": "excuse",
      "name": "excusarse",
      "error": "la fórmula no permite reconocer la disculpa solicitada",
      "match": "\\b(?:excusarse|disculparse)\\b",
      "category": "expression",
      "function": "comunicar una disculpa relacionada con la situación indicada"
    },
    {
      "id": "congratulations",
      "name": "felicitar",
      "error": "la fórmula expresa otra intención o se refiere a otro acontecimiento",
      "match": "\\b(?:felicitar)\\b",
      "category": "expression",
      "function": "comunicar una felicitación relacionada con el acontecimiento del referente indicado"
    }
  ],
  "englishGradeFourStrategies": [
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
      "match": "(?:solicit\\w*|ped\\w*|pidan) (?:una )?repeticion",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Solicitud de repetición",
      "levels": [
        "Señala la parte del mensaje en inglés que necesita aclarar y solicita la repetición pertinente.",
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
      "id": "new-combinations",
      "match": "ensay\\w*.*nuevas (?:combinaciones|expresiones)",
      "modes": [
        "oral",
        "interaction"
      ],
      "title": "Ensayo de nuevas combinaciones",
      "levels": [
        "Ensaya en inglés nuevas combinaciones de expresiones que conservan el sentido del mensaje y permiten comunicarlo en la situación indicada.",
        "Las nuevas combinaciones comunican lo principal; una relación entre expresiones necesita ajuste.",
        "Ensaya expresiones aisladas sin establecer las relaciones necesarias para comunicar el mensaje.",
        "Las nuevas combinaciones cambian el sentido de las ideas que debía comunicar.",
        "No aporta una combinación reconocible relacionada con el ensayo solicitado."
      ]
    },
    {
      "id": "feedback",
      "match": "(?:solicit\\w*|ped\\w*|pidan).*retroalimentacion",
      "modes": [
        "oral",
        "interaction"
      ],
      "title": "Solicitud de retroalimentación pertinente",
      "levels": [
        "Solicita en inglés retroalimentación sobre una parte del mensaje, permitiendo reconocer qué necesita comprobar o mejorar en el ensayo.",
        "La solicitud permite localizar lo principal; una referencia al aspecto consultado necesita precisión.",
        "Solicita una valoración general sin precisar qué parte necesita comprobar.",
        "La solicitud se refiere a otro asunto y no permite revisar el aspecto del ensayo indicado.",
        "No aporta una solicitud reconocible de retroalimentación sobre el mensaje ensayado."
      ]
    },
    {
      "id": "main-details",
      "match": "ideas? principal(?:es)?|detalles especificos",
      "modes": [
        "reading",
        "listening"
      ],
      "title": "Idea principal y detalles del texto",
      "levels": [
        "Identifica {target} del texto en inglés y los relaciona con la información disponible.",
        "Reconoce {target}; una relación con el texto necesita precisión.",
        "Recupera información aislada, pero deja sin relacionar parte de {target}.",
        "Atribuye al texto información que cambia {target}.",
        "No aporta información reconocible que permita identificar {target} del texto."
      ]
    },
    {
      "id": "courtesy",
      "match": "normas de cortesia|con cortesia|asertiv\\w*|con tacto",
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
    }
  ],
  "englishCulturalAspectsPolicy": "ONLY_REQUESTED_COMPONENTS_SCOPE_OWN_GRADE_V1",
  "englishGenreAlternativesPolicy": "ALL_CONTIGUOUS_ALTERNATIVES_ONE_SELECTED_PRODUCT_V2"
}
export const evaluationCatalogV56={...evaluationCatalogV55,...frozen}
