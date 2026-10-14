import {evaluationCatalogV37} from './catalog-v37'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.38",
  "englishGradeOneLexicon": [
    {
      "id": "geography",
      "name": "accidentes geográficos",
      "error": "nombra un accidente geográfico distinto del referente",
      "match": "\\b(?:accidentes geograficos|geographical features)\\b",
      "category": "vocabulary",
      "function": "nombrar los rasgos del paisaje solicitados"
    },
    {
      "id": "arts",
      "name": "actividades artísticas",
      "error": "confunde la actividad artística con otra práctica",
      "match": "\\b(?:actividades artisticas|artistic activities)\\b",
      "category": "vocabulary",
      "function": "comunicar la práctica artística indicada"
    },
    {
      "id": "daily",
      "name": "actividades diarias",
      "error": "cambia la acción cotidiana que se desea comunicar",
      "match": "\\b(?:actividades (?:diarias|cotidianas)|daily activities)\\b",
      "category": "vocabulary",
      "function": "nombrar las acciones de la jornada"
    },
    {
      "id": "leisure",
      "name": "actividades recreativas",
      "error": "confunde la actividad recreativa con otra actividad",
      "match": "\\b(?:actividades recreativas|recreational activities)\\b",
      "category": "vocabulary",
      "function": "nombrar la actividad de ocio indicada"
    },
    {
      "id": "food",
      "name": "alimentos",
      "error": "atribuye al alimento un nombre que corresponde a otro producto",
      "match": "\\b(?:(?<!preparacion de )alimentos|comidas y bebidas|food)\\b",
      "category": "vocabulary",
      "function": "identificar la comida o bebida mencionada"
    },
    {
      "id": "address",
      "name": "apelativos",
      "error": "emplea un apelativo que cambia el destinatario o el trato solicitado",
      "match": "\\b(?:apelativos|formas de dirigirse|forms of address)\\b",
      "category": "vocabulary",
      "function": "dirigirse a la persona en la situación indicada"
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
      "id": "colors",
      "name": "colores",
      "error": "asigna al referente un color diferente del indicado",
      "match": "\\b(?:colores|colours|colors)\\b",
      "category": "vocabulary",
      "function": "precisar el color del referente"
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
      "id": "territories",
      "name": "lugares geográficos solicitados",
      "error": "cambia el lugar al que se refiere el mensaje",
      "match": "\\b(?:continentes|paises|ciudades|continents|countries|cities)\\b",
      "category": "vocabulary",
      "function": "identificar el lugar geográfico nombrado"
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
      "id": "weekdays",
      "name": "días de la semana",
      "error": "desplaza la actividad a otro día",
      "match": "\\b(?:dias de la semana|weekdays|days of the week)\\b",
      "category": "vocabulary",
      "function": "situar la actividad en el día señalado"
    },
    {
      "id": "seasons",
      "name": "estaciones del año",
      "error": "confunde la estación a la que se refiere el mensaje",
      "match": "\\b(?:estaciones del ano|seasons)\\b",
      "category": "vocabulary",
      "function": "identificar la estación del año mencionada"
    },
    {
      "id": "phenomena",
      "name": "fenómenos nombrados en el currículo",
      "error": "utiliza el nombre de un fenómeno distinto del indicado",
      "match": "\\b(?:fenomenos atmosfericos|atmospheric phenomena)\\b",
      "category": "vocabulary",
      "function": "identificar el fenómeno nombrado en la situación"
    },
    {
      "id": "shapes",
      "name": "formas de los objetos",
      "error": "atribuye al objeto una forma diferente",
      "match": "\\b(?:formas(?! de ser)|figuras geometricas|shapes)\\b",
      "category": "vocabulary",
      "function": "precisar la forma del objeto"
    },
    {
      "id": "personality",
      "name": "formas de ser",
      "error": "atribuye al personaje un rasgo de personalidad diferente",
      "match": "\\b(?:formas de ser|personalidad|personality)\\b",
      "category": "vocabulary",
      "function": "comunicar la característica de la persona o personaje descrito"
    },
    {
      "id": "music",
      "name": "géneros musicales",
      "error": "confunde el género musical con otro género",
      "match": "\\b(?:generos musicales|musical genres)\\b",
      "category": "vocabulary",
      "function": "nombrar el tipo de música mencionado"
    },
    {
      "id": "languages",
      "name": "idiomas",
      "error": "cambia la lengua a la que se refiere el mensaje",
      "match": "\\b(?:idiomas|languages)\\b",
      "category": "vocabulary",
      "function": "identificar la lengua mencionada"
    },
    {
      "id": "building-places",
      "name": "lugares de un edificio",
      "error": "confunde la entrada, salida u otra zona solicitada",
      "match": "\\b(?:lugares de un edificio|zonas de un edificio|building locations)\\b",
      "category": "vocabulary",
      "function": "localizar la zona del edificio indicada"
    },
    {
      "id": "public-places",
      "name": "lugares públicos",
      "error": "sitúa el referente en un lugar público diferente",
      "match": "\\b(?:lugares de la ciudad|lugares publicos|public places)\\b",
      "category": "vocabulary",
      "function": "identificar el lugar público mencionado"
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
      "id": "family",
      "name": "miembros de la familia",
      "error": "atribuye una relación de parentesco diferente entre los personajes",
      "match": "\\b(?:miembros de la familia|parentesco|family members)\\b",
      "category": "vocabulary",
      "function": "expresar la relación de parentesco indicada"
    },
    {
      "id": "furniture",
      "name": "mobiliario y objetos solicitados",
      "error": "confunde el objeto nombrado con otro mueble u objeto",
      "match": "\\b(?:mobiliario(?: y objetos)?|furniture)\\b",
      "category": "vocabulary",
      "function": "nombrar el mueble u objeto indicado"
    },
    {
      "id": "nationalities",
      "name": "nacionalidades",
      "error": "confunde la nacionalidad con otra procedencia",
      "match": "\\b(?:nacionalidades|nationalities)\\b",
      "category": "vocabulary",
      "function": "expresar la nacionalidad indicada"
    },
    {
      "id": "names",
      "name": "nombres propios",
      "error": "atribuye el nombre a un referente distinto",
      "match": "\\b(?:nombres propios|proper names)\\b",
      "category": "vocabulary",
      "function": "identificar a la persona o lugar nombrado"
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
      "id": "belongings",
      "name": "pertenencias",
      "error": "confunde el objeto personal con otro objeto",
      "match": "\\b(?:pertenencias|belongings)\\b",
      "category": "vocabulary",
      "function": "nombrar la pertenencia mencionada"
    },
    {
      "id": "cooking",
      "name": "preparación de alimentos",
      "error": "cambia la acción culinaria indicada por otra",
      "match": "\\b(?:preparacion de alimentos|food preparation)\\b",
      "category": "vocabulary",
      "function": "comunicar la acción de preparación solicitada"
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
      "id": "appearance",
      "name": "rasgos físicos",
      "error": "atribuye a la persona o personaje un rasgo físico distinto",
      "match": "\\b(?:rasgos fisicos|physical features)\\b",
      "category": "vocabulary",
      "function": "expresar el rasgo de apariencia descrito"
    },
    {
      "id": "clothing",
      "name": "ropa y accesorios solicitados",
      "error": "nombra una prenda o accesorio diferente del referente",
      "match": "\\b(?:ropa(?: y accesorios)?|prendas de vestir|clothing)\\b",
      "category": "vocabulary",
      "function": "nombrar la prenda o accesorio mencionado"
    },
    {
      "id": "sizes",
      "name": "tamaños",
      "error": "cambia el tamaño que se desea indicar",
      "match": "\\b(?:tamanos|sizes)\\b",
      "category": "vocabulary",
      "function": "precisar el tamaño relativo del referente"
    },
    {
      "id": "chores",
      "name": "tareas del hogar",
      "error": "confunde la tarea doméstica con una acción diferente",
      "match": "\\b(?:tareas del hogar|tareas domesticas|household chores)\\b",
      "category": "vocabulary",
      "function": "nombrar la tarea doméstica indicada"
    },
    {
      "id": "titles",
      "name": "títulos personales",
      "error": "cambia el tratamiento solicitado al dirigirse a la persona",
      "match": "\\b(?:titulos personales|personal titles)\\b",
      "category": "vocabulary",
      "function": "expresar el tratamiento de la persona en la situación acordada"
    },
    {
      "id": "equipment",
      "name": "uso de aparatos",
      "error": "confunde conectar, encender u otra acción solicitada",
      "match": "\\b(?:uso de aparatos|uso de equipos|equipment use)\\b",
      "category": "vocabulary",
      "function": "indicar la acción sobre el aparato"
    },
    {
      "id": "travel",
      "name": "viajes",
      "error": "confunde el servicio, lugar u objeto necesario en la situación de viaje",
      "match": "\\b(?:viajes|travel)\\b",
      "category": "vocabulary",
      "function": "nombrar el servicio u objeto del viaje indicado"
    },
    {
      "id": "greeting",
      "name": "saludar",
      "error": "usa una fórmula de cierre cuando se solicita iniciar el contacto",
      "match": "\\b(?:saludar|saludos|greetings)\\b",
      "category": "expression",
      "function": "iniciar el contacto según la situación comunicativa"
    },
    {
      "id": "farewell",
      "name": "despedirse",
      "error": "usa una fórmula que abre el contacto cuando corresponde despedirse",
      "match": "\\b(?:despedirse|despedidas|farewells)\\b",
      "category": "expression",
      "function": "cerrar el contacto en la situación comunicativa"
    },
    {
      "id": "introduction",
      "name": "presentarse o presentar a la persona indicada",
      "error": "cambia quién se presenta o quién es presentado",
      "match": "\\b(?:presentarse|presentar a (?:alguien|otras personas)|introductions)\\b",
      "category": "expression",
      "function": "dar a conocer a una persona en el intercambio"
    },
    {
      "id": "classroom",
      "name": "interactuar en el aula",
      "error": "la expresión solicita una acción distinta de la necesaria en clase",
      "match": "\\b(?:interactuar en el aula|interaccion en el aula|classroom interaction)\\b",
      "category": "expression",
      "function": "comunicar la necesidad de comunicación en clase"
    },
    {
      "id": "interruption",
      "name": "interrumpir cortésmente",
      "error": "la expresión no permite reconocer la solicitud de interrupción",
      "match": "\\b(?:interrumpir cortesmente|interrupcion cortes|polite interruption)\\b",
      "category": "expression",
      "function": "solicitar una interrupción sin cambiar el asunto del intercambio"
    },
    {
      "id": "turns",
      "name": "tomar o ceder el turno según lo solicitado",
      "error": "pide tomar el turno cuando debe cederlo o lo contrario",
      "match": "\\b(?:(?:tomar|ceder)(?: y ceder)? el turno|turn taking)\\b",
      "category": "expression",
      "function": "regular el turno de palabra en el intercambio"
    },
    {
      "id": "translation",
      "name": "solicitar traducción o repetición según lo pedido",
      "error": "la solicitud no indica qué parte necesita traducción o repetición",
      "match": "\\b(?:solicitar (?:traduccion|repeticion)|pedir (?:traduccion|repeticion)|translation or repetition)\\b",
      "category": "expression",
      "function": "pedir ayuda para comprender el mensaje"
    },
    {
      "id": "agreement",
      "name": "expresar aprobación o acuerdo",
      "error": "expresa desacuerdo cuando pretende comunicar aprobación",
      "match": "\\b(?:(?:expresar )?(?:aprobacion|acuerdo)|approval|agreement)\\b",
      "category": "expression",
      "function": "comunicar acuerdo con lo comunicado"
    },
    {
      "id": "attention",
      "name": "atraer la atención",
      "error": "la expresión no permite al interlocutor reconocer que se le llama",
      "match": "\\b(?:atraer la atencion|llamar la atencion|attract attention)\\b",
      "category": "expression",
      "function": "llamar al interlocutor antes de comunicar el mensaje"
    },
    {
      "id": "invitation-response",
      "name": "responder a una invitación",
      "error": "la expresión contradice la aceptación o el rechazo elegido",
      "match": "\\b(?:responder a (?:las )?invitaciones|responding to invitations)\\b",
      "category": "expression",
      "function": "comunicar aceptación o rechazo según la respuesta elegida"
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
      "id": "thanks",
      "name": "agradecer",
      "error": "la expresión corresponde a otra intención y no comunica agradecimiento",
      "match": "\\b(?:agradecer|agradecimiento|thanking)\\b",
      "category": "expression",
      "function": "comunicar agradecimiento por la ayuda o acción indicada"
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
    }
  ]
}
export const evaluationCatalogV38={...evaluationCatalogV37,...frozen}
