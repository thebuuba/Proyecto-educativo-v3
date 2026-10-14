import {evaluationCatalogV35} from './catalog-v35'
/** Immutable grammar release before the vocabulary extension. */
const frozen={
  "version": "evaluation-2026.36",
  "englishGradeOneGrammar": [
    {
      "id": "present-simple",
      "match": "\\b(?:presente simple|simple present|present simple)\\b",
      "name": "el presente simple",
      "function": "expresar hábitos, datos o estados según el mensaje",
      "error": "altera la concordancia o la referencia habitual de las acciones"
    },
    {
      "id": "preference-verbs",
      "match": "\\b(?:verbos? (?:like|prefer|enjoy)|like prefer enjoy|like y prefer)\\b",
      "name": "los verbos like, prefer y enjoy solicitados",
      "function": "expresar gustos y preferencias relacionando quién prefiere con lo preferido",
      "error": "confunde quién expresa el gusto o qué actividad prefiere",
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
      ]
    },
    {
      "id": "present-continuous",
      "match": "\\b(?:presente continuo|present continuous)\\b",
      "name": "el presente continuo",
      "function": "situar una acción en desarrollo en el momento indicado",
      "error": "confunde la acción en desarrollo con una acción terminada o habitual"
    },
    {
      "id": "past-simple",
      "match": "\\b(?:pasado simple|simple past|past simple)\\b",
      "name": "el pasado simple",
      "function": "situar hechos o experiencias terminados en el pasado",
      "error": "presenta como actual un hecho situado en el pasado o cambia quién lo realizó"
    },
    {
      "id": "present-perfect",
      "match": "\\b(?:presente perfecto|present perfect)\\b",
      "name": "el presente perfecto",
      "function": "referir experiencias anteriores relacionadas con el presente",
      "error": "confunde la experiencia anterior con una acción que está ocurriendo ahora"
    },
    {
      "id": "future",
      "match": "\\b(?:will|be going to)\\b",
      "name": "will o be going to según la forma solicitada",
      "function": "comunicar previsiones para el momento futuro indicado",
      "error": "sitúa la previsión en un momento distinto del anunciado",
      "terms": [
        [
          "\\bwill\\b",
          "will"
        ],
        [
          "\\bbe going to\\b",
          "be going to"
        ]
      ]
    },
    {
      "id": "would",
      "match": "\\b(?:would)\\b",
      "name": "would en la invitación",
      "function": "formular o aceptar cortésmente una invitación",
      "error": "la estructura cambia la invitación por una afirmación que no propone ni responde"
    },
    {
      "id": "declining-forms",
      "match": "\\b(?:can t|cannot|have to)\\b",
      "name": "can’t o have to según la forma solicitada",
      "function": "expresar imposibilidad u obligación al rechazar una invitación",
      "error": "comunica posibilidad cuando pretende expresar imposibilidad u obligación",
      "terms": [
        [
          "\\bcan t\\b|\\bcannot\\b",
          "can’t"
        ],
        [
          "\\bhave to\\b",
          "have to"
        ]
      ]
    },
    {
      "id": "there-be",
      "match": "\\b(?:there (?:is|are|be)|there y be)\\b",
      "name": "there + be",
      "function": "indicar existencia y cantidad en la descripción de un lugar",
      "error": "confunde la existencia o el número de los elementos descritos"
    },
    {
      "id": "imperative",
      "match": "\\b(?:imperativo|imperative)\\b",
      "name": "el imperativo",
      "function": "comunicar la acción solicitada en una instrucción",
      "error": "cambia una instrucción afirmativa por una prohibición o altera la acción solicitada"
    },
    {
      "id": "lets",
      "match": "\\b(?:let s)\\b",
      "name": "let’s",
      "function": "proponer una actividad compartida mediante una invitación",
      "error": "la expresión deja de proponer una acción compartida al interlocutor"
    },
    {
      "id": "question-tags",
      "match": "\\b(?:question tags?)\\b",
      "name": "las question tags",
      "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada",
      "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación"
    },
    {
      "id": "possessive-s",
      "match": "\\b(?:posesivo s|genitivo sajon|possessive s)\\b",
      "name": "el posesivo ’s",
      "function": "relacionar una pertenencia con su poseedor",
      "error": "atribuye la pertenencia a un poseedor distinto"
    },
    {
      "id": "articles",
      "match": "\\b(?:articulos? definidos?|articulos? indefinidos?|definite articles?|indefinite articles?|a an y the)\\b",
      "name": "los artículos definidos o indefinidos solicitados",
      "function": "distinguir referentes identificados de referentes no identificados previamente",
      "error": "la elección del artículo cambia qué referente puede reconocer el destinatario",
      "terms": [
        [
          "\\bdefinidos?\\b|\\bdefinite\\b",
          "los artículos definidos"
        ],
        [
          "\\bindefinidos?\\b|\\bindefinite\\b",
          "los artículos indefinidos"
        ]
      ]
    },
    {
      "id": "qualifying-adjectives",
      "match": "\\b(?:adjetivos? calificativos?|qualifying adjectives?)\\b",
      "name": "los adjetivos calificativos",
      "function": "atribuir características a personas, lugares u objetos",
      "error": "atribuye una característica incompatible con lo que se desea describir"
    },
    {
      "id": "comparative",
      "match": "\\b(?:comparativos?|comparative|superlativos?|superlative)\\b",
      "name": "el grado comparativo o superlativo solicitado",
      "function": "establecer una comparación o destacar un elemento dentro de un conjunto",
      "error": "confunde la relación entre dos elementos con la selección de uno dentro de un conjunto",
      "terms": [
        [
          "\\bcomparativos?\\b|\\bcomparative\\b",
          "el grado comparativo"
        ],
        [
          "\\bsuperlativos?\\b|\\bsuperlative\\b",
          "el grado superlativo"
        ]
      ]
    },
    {
      "id": "possessive-adjectives",
      "match": "\\b(?:adjetivos? posesivos?|possessive adjectives?)\\b",
      "name": "los adjetivos posesivos",
      "function": "señalar a quién pertenece el sustantivo que acompañan",
      "error": "cambia el poseedor de la pertenencia expresada"
    },
    {
      "id": "interrogative-pronouns",
      "match": "\\b(?:pronombres? interrogativos?|interrogative pronouns?)\\b",
      "name": "los pronombres interrogativos",
      "function": "preguntar por la persona, cosa o lugar que se necesita conocer",
      "error": "pregunta por una información distinta de la que se quiere solicitar"
    },
    {
      "id": "object-pronouns",
      "match": "\\b(?:pronombres? objeto|object pronouns?)\\b",
      "name": "los pronombres objeto",
      "function": "señalar a quién se dirige o afecta la acción",
      "error": "atribuye la acción al receptor equivocado"
    },
    {
      "id": "possessive-pronouns",
      "match": "\\b(?:pronombres? posesivos?|possessive pronouns?)\\b",
      "name": "los pronombres posesivos",
      "function": "identificar una pertenencia y su poseedor sin repetir el sustantivo",
      "error": "sustituye la pertenencia de modo que se atribuye a otro poseedor"
    },
    {
      "id": "time-prepositions",
      "match": "\\b(?:preposiciones? de tiempo|prepositions? of time)\\b",
      "name": "las preposiciones de tiempo",
      "function": "situar el hecho en la hora, fecha o período indicado",
      "error": "sitúa el hecho en una referencia temporal diferente"
    },
    {
      "id": "place-prepositions",
      "match": "\\b(?:preposiciones? de lugar|prepositions? of place)\\b",
      "name": "las preposiciones de lugar",
      "function": "situar un elemento respecto a otro en el espacio",
      "error": "cambia la relación espacial entre los elementos"
    },
    {
      "id": "time-adverbs",
      "match": "\\b(?:adverbios? de tiempo|adverbs? of time)\\b",
      "name": "los adverbios de tiempo",
      "function": "indicar cuándo ocurre la acción",
      "error": "desplaza la acción a un momento distinto del indicado"
    },
    {
      "id": "frequency-adverbs",
      "match": "\\b(?:adverbios? de frecuencia|adverbs? of frequency)\\b",
      "name": "los adverbios de frecuencia",
      "function": "expresar con qué frecuencia ocurre una acción",
      "error": "confunde una acción habitual con una ocasional o inexistente"
    },
    {
      "id": "manner-adverbs",
      "match": "\\b(?:adverbios? de modo|adverbs? of manner)\\b",
      "name": "los adverbios de modo",
      "function": "precisar cómo se realiza una acción",
      "error": "altera la manera en que se realiza la acción descrita"
    },
    {
      "id": "degree-adverbs",
      "match": "\\b(?:adverbios? de intensidad|adverbs? of (?:degree|intensity))\\b",
      "name": "los adverbios de intensidad",
      "function": "graduar la intensidad de una característica o acción",
      "error": "cambia el grado de intensidad que se pretende expresar"
    },
    {
      "id": "certainty-adverbs",
      "match": "\\b(?:adverbios? de certeza|adverbs? of certainty)\\b",
      "name": "los adverbios de certeza",
      "function": "expresar el grado de seguridad de una afirmación",
      "error": "presenta una posibilidad como una certeza o una certeza como una duda"
    },
    {
      "id": "coordination-connectors",
      "match": "\\b(?:conectores? de coordinacion|coordinating conjunctions?)\\b",
      "name": "los conectores de coordinación",
      "function": "unir, contrastar o presentar alternativas entre ideas",
      "error": "confunde suma, contraste y alternativa entre las ideas"
    },
    {
      "id": "time-connectors",
      "match": "\\b(?:conectores? de tiempo|temporal connectors?)\\b",
      "name": "los conectores de tiempo",
      "function": "relacionar los momentos en que ocurren las acciones",
      "error": "invierte la relación de anterioridad o posterioridad de las acciones"
    },
    {
      "id": "sequence-connectors",
      "match": "\\b(?:conectores? de secuencia|sequence connectors?)\\b",
      "name": "los conectores de secuencia",
      "function": "ordenar pasos o acontecimientos",
      "error": "cambia el orden necesario para seguir los pasos o acontecimientos"
    },
    {
      "id": "cause-connectors",
      "match": "\\b(?:conectores? de causa(?: y consecuencia)?|conectores? de consecuencia|cause and effect connectors?)\\b",
      "name": "los conectores de causa y consecuencia",
      "function": "relacionar un hecho con su causa o su consecuencia",
      "error": "invierte o confunde la causa y la consecuencia de los hechos"
    }
  ],
  "englishGradeOneGrammarPolicy": "ONLY_REQUESTED_FORMS_RECOGNITION_EXPLANATION_USE_V1"
}
export const evaluationCatalogV36={...evaluationCatalogV35,...frozen}
