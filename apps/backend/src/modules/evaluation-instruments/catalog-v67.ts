import {evaluationCatalogV66} from './catalog-v66'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.67",
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
      "match": "correos?(?: electronicos?)?|e mails?|emails?",
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
  "taskRequirementPolicy": "EXPLICIT_NATURAL_REQUESTS_MIXED_MODALITY_DELIVERY_V1",
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
      "match": "\\b(?:will|(?:be )?going to)\\b",
      "terms": [
        [
          "\\bwill\\b",
          "will"
        ],
        [
          "\\b(?:be )?going to\\b",
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
  }
}
export const evaluationCatalogV67={...evaluationCatalogV66,...frozen}
