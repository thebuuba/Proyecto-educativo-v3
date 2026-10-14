import {evaluationCatalogV46} from './catalog-v46'
/** Frozen from the installed local release; historical snapshots remain unchanged. */
const frozen={
  "version": "evaluation-2026.47",
  "englishGradeTwoModule": {
    "id": "ingles-comunicacion-2",
    "grade": 2,
    "policy": "LINKED_BASIC_SENTENCES_FUNCTIONS_AND_INDEPENDENT_ACTIONS_V1",
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
      "match": "\\b(?:conectores? de causa(?: y consecuencia)?|conectores? de consecuencia|cause and effect connectors?)\\b",
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
      "name": "there was o there were según lo solicitado",
      "error": "cambia la cantidad o sitúa como actual la existencia pasada",
      "match": "\\b(?:there was|there were|there was y there were)\\b",
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
      "match": "\\b(?:voz pasiva|pasiva (?:en )?presente|present passive)\\b",
      "function": "referir el producto o servicio sobre el que recae una acción"
    },
    {
      "id": "exclamation",
      "name": "las oraciones exclamativas",
      "error": "cambia el sentido de la reacción solicitada",
      "match": "\\b(?:exclamaciones?|exclamatory sentences?)\\b",
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
      "function": "preguntar la cantidad de acuerdo con el referente contable o no contable"
    },
    {
      "id": "why-suggestion",
      "name": "why don’t o why not según lo solicitado",
      "error": "pregunta por una causa cuando pretende proponer una acción",
      "match": "\\b(?:why don t|why not)\\b",
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
  ]
}
export const evaluationCatalogV47={...evaluationCatalogV46,...frozen}
