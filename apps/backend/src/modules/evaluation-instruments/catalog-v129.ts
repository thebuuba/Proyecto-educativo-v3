import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV128 } from './catalog-v128'
/** Exact129 payload checked against Development, including the reviewed passive-voice boundary. */
export const evaluationCatalogV129={...evaluationCatalogV128,englishGradeSixGrammar:[
  {
    "id": "question-tags",
    "match": "\\b(?:question tags?)\\b",
    "name": "las question tags",
    "function": "solicitar confirmación de una afirmación mediante una coletilla relacionada",
    "error": "la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación"
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
    "id": "time-adverbs",
    "match": "\\b(?:adverbios? de tiempo|adverbs? of time)\\b",
    "name": "los adverbios de tiempo",
    "function": "indicar cuándo ocurre la acción",
    "error": "desplaza la acción a un momento distinto del indicado"
  },
  {
    "id": "manner-adverbs",
    "match": "\\b(?:adverbios? de modo|adverbs? of manner)\\b",
    "name": "los adverbios de modo",
    "function": "precisar cómo se realiza una acción",
    "error": "altera la manera en que se realiza la acción descrita"
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
    "id": "exclamation",
    "match": "\\b(?:oraciones? exclamativas?|exclamaciones?|exclamatory sentences?)\\b",
    "name": "las oraciones exclamativas",
    "function": "expresar una reacción relacionada con el acontecimiento comunicado",
    "error": "la forma comunica una reacción incompatible con el acontecimiento indicado"
  },
  {
    "id": "relative-pronouns",
    "match": "\\b(?:pronombres? relativos?|relative pronouns?)\\b",
    "name": "los pronombres relativos",
    "function": "enlazar información adicional con el referente al que corresponde",
    "error": "relaciona la información con una persona o elemento distinto"
  },
  {
    "id": "contrast-connectors",
    "match": "\\b(?:conectores? de contraste|contrast connectors?)\\b",
    "name": "los conectores de contraste",
    "function": "contrastar ideas o puntos de vista relacionados",
    "error": "presenta como equivalentes ideas que deben contrastarse"
  },
  {
    "id": "concession-connectors",
    "match": "\\b(?:conectores? de concesion|concession connectors?)\\b",
    "name": "los conectores de concesión",
    "function": "relacionar una circunstancia con un resultado que ocurre pese a ella",
    "error": "presenta la circunstancia como causa necesaria del resultado o elimina la concesión"
  },
  {
    "id": "declarative",
    "match": "\\b(?:oraciones? (?:enunciativas?|afirmativas?|negativas?)|declarative sentences?)\\b",
    "name": "las oraciones enunciativas solicitadas",
    "function": "comunicar una afirmación positiva o negativa con el sentido solicitado",
    "error": "invierte la afirmación o negación del mensaje",
    "terms": [
      [
        "afirmativas?",
        "las oraciones afirmativas"
      ],
      [
        "negativas?",
        "las oraciones negativas"
      ]
    ]
  },
  {
    "id": "interrogative-sentences",
    "match": "\\b(?:oraciones? interrogativas?|preguntas? directas?|interrogative sentences?)\\b",
    "name": "las oraciones interrogativas",
    "function": "preguntar por la información indicada mediante una pregunta directa comprensible",
    "error": "pregunta por otro asunto o cambia la relación entre los referentes"
  },
  {
    "id": "indirect-questions",
    "match": "\\b(?:preguntas? indirectas?|preguntas? integradas?|embedded questions?|indirect questions?)\\b",
    "name": "las preguntas indirectas o integradas solicitadas",
    "function": "integrar la pregunta dentro de otra expresión conservando la información solicitada y el orden correspondiente",
    "error": "la pregunta integrada cambia la información pedida o el orden que permite comprenderla"
  },
  {
    "id": "zero-article",
    "match": "\\b(?:omision del articulo|articulo cero|zero article)\\b",
    "name": "la omisión del artículo solicitada",
    "function": "conservar la referencia general que el contexto permite expresar sin artículo",
    "error": "cambia una referencia general por una específica o elimina un artículo necesario en el contexto"
  },
  {
    "id": "frequency-adverbs",
    "match": "\\b(?:adverbios? de frecuencia|adverbs? of frequency)\\b",
    "name": "los adverbios de frecuencia",
    "function": "expresar la frecuencia de la acción indicada",
    "error": "confunde una acción habitual con una ocasional o inexistente"
  },
  {
    "id": "preposition-use",
    "match": "\\b(?:uso de preposiciones|preposiciones solicitadas)\\b",
    "name": "las preposiciones solicitadas",
    "function": "establecer la relación entre los elementos del mensaje según su sentido en la situación",
    "error": "la preposición cambia la relación solicitada entre los referentes"
  },
  {
    "id": "sentence-final-preposition",
    "match": "\\b(?:preposicion al final de la oracion|sentence final preposition)\\b",
    "name": "la preposición al final de la oración",
    "function": "mantener la relación de la preposición con su complemento aunque este se encuentre en otra posición de la oración",
    "error": "relaciona la preposición con un complemento diferente del indicado"
  },
  {
    "id": "causatives",
    "match": "\\b(?:verbos causativos|causative verbs|get have y make)\\b",
    "name": "los verbos causativos solicitados",
    "function": "distinguir quién encarga o provoca la acción y quién la realiza o la recibe en la situación",
    "error": "atribuye la acción a quien la encarga o cambia quién la realiza o recibe"
  },
  {
    "id": "second-conditional",
    "match": "\\b(?:segundo condicional|second conditional)\\b",
    "name": "el segundo condicional",
    "function": "relacionar una situación hipotética con su resultado posible sin presentarla como un hecho confirmado",
    "error": "presenta la hipótesis como real o invierte la relación entre la condición y su resultado"
  },
  {
    "id": "emphatic-reflexives",
    "match": "\\b(?:uso enfatico de los pronombres reflexivos|emphatic reflexive pronouns)\\b",
    "name": "el uso enfático de los pronombres reflexivos",
    "function": "destacar al referente que realiza la acción sin cambiar su identidad",
    "error": "atribuye el énfasis a otro referente o confunde énfasis y acción reflexiva"
  },
  {
    "id": "addition-connectors",
    "match": "\\b(?:conectores de adicion|addition connectors)\\b",
    "name": "los conectores de adición",
    "function": "añadir información relacionada con la idea anterior",
    "error": "presenta como oposición o alternativa la información que debe añadirse"
  },
  {
    "id": "correlative-connectors",
    "match": "\\b(?:conectores de correlacion|correlative connectors)\\b",
    "name": "los conectores de correlación solicitados",
    "function": "relacionar los elementos con la suma, alternativa o negación correlativa indicada",
    "error": "confunde suma, alternativa y negación o deja sin relacionar un elemento de la correlación"
  },
  {
    "id": "illustration-connectors",
    "match": "\\b(?:conectores de ilustracion|illustration connectors)\\b",
    "name": "los conectores de ilustración",
    "function": "relacionar una idea con el ejemplo que permite ilustrarla",
    "error": "el ejemplo contradice o no se relaciona con la idea que debía ilustrar"
  },
  {
    "id": "present-simple",
    "match": "\\b(?:presente simple(?! con valor futuro)|present simple(?! with future meaning)|simple present)\\b",
    "name": "el presente simple",
    "function": "expresar ideas relacionadas con el tema abstracto o cultural indicado",
    "error": "cambia el referente o el sentido de la idea sobre el tema"
  },
  {
    "id": "past-simple",
    "match": "\\b(?:pasado simple|past simple)\\b",
    "name": "el pasado simple",
    "function": "narrar el acontecimiento terminado y su relación con otros hechos de la experiencia indicada",
    "error": "sitúa como actual el acontecimiento pasado o cambia la relación entre los hechos"
  },
  {
    "id": "present-perfect",
    "match": "\\b(?:presente perfecto(?! continuo)|present perfect(?! continuous))\\b",
    "name": "el presente perfecto",
    "function": "relacionar la experiencia anterior del perfil o narración con su referencia presente",
    "error": "presenta como acción aún en desarrollo el acontecimiento anterior o pierde su relación con el presente"
  },
  {
    "id": "present-perfect-continuous",
    "match": "\\b(?:presente perfecto continuo|present perfect continuous)\\b",
    "name": "el presente perfecto continuo",
    "function": "comunicar la continuidad de la actividad del perfil o experiencia y su relación con el presente",
    "error": "presenta como terminada una actividad continuada o cambia su duración o referente"
  },
  {
    "id": "used-to",
    "match": "\\b(?:(?<!be )(?<!get )used to)\\b",
    "name": "used to",
    "function": "contrastar una costumbre pasada con la situación presente del referente",
    "error": "presenta como actual la costumbre pasada o elimina el contraste solicitado"
  },
  {
    "id": "be-used-to",
    "match": "\\b(?:be used to)\\b",
    "name": "be used to",
    "function": "expresar la costumbre o familiaridad establecida del referente con la actividad o situación indicada",
    "error": "presenta la familiaridad establecida como una acción pasada terminada o como una adaptación en curso"
  },
  {
    "id": "get-used-to",
    "match": "\\b(?:get used to)\\b",
    "name": "get used to",
    "function": "expresar el proceso de adaptación del referente a la actividad o situación nueva",
    "error": "presenta como costumbre ya establecida una adaptación en curso o cambia la situación nueva"
  },
  {
    "id": "past-continuous",
    "match": "\\b(?:pasado continuo|past continuous)\\b",
    "name": "el pasado continuo",
    "function": "situar la acción en desarrollo con la que se relaciona otro acontecimiento pasado de la narración",
    "error": "confunde la acción en desarrollo con el acontecimiento terminado o altera su relación"
  },
  {
    "id": "past-perfect",
    "match": "\\b(?:pasado perfecto(?! en voz pasiva)|past perfect(?! passive))\\b",
    "name": "el pasado perfecto",
    "function": "relacionar el acontecimiento anterior con otro hecho pasado de la narración",
    "error": "invierte la anterioridad entre los acontecimientos del pasado"
  },
  {
    "id": "present-simple-future",
    "match": "\\b(?:presente simple con valor futuro|present simple with future meaning)\\b",
    "name": "el presente simple con valor futuro",
    "function": "relacionar el compromiso o hecho programado con la justificación de una acción futura",
    "error": "sitúa como pasado el compromiso futuro o cambia su relación con la acción justificada"
  },
  {
    "id": "modal-must",
    "match": "\\b(?:must)\\b",
    "name": "must",
    "function": "justificar una conclusión o explicación mediante los indicios de la situación indicada",
    "error": "presenta una deducción como observación directa o contradice los indicios"
  },
  {
    "id": "modal-may",
    "match": "\\b(?:may)\\b",
    "name": "may",
    "function": "ofrecer una explicación posible compatible con los datos de la situación",
    "error": "presenta como confirmada una explicación posible o cambia su relación con los datos"
  },
  {
    "id": "modal-could",
    "match": "\\b(?:could)\\b",
    "name": "could",
    "function": "relacionar una explicación o acción posible con los datos que permiten considerarla",
    "error": "comunica certeza cuando se pide una posibilidad o contradice los datos disponibles"
  },
  {
    "id": "modal-might",
    "match": "\\b(?:might)\\b",
    "name": "might",
    "function": "expresar una explicación posible incierta relacionada con los indicios proporcionados",
    "error": "presenta como segura una explicación que los datos solo permiten considerar posible"
  },
  {
    "id": "verb-complements",
    "match": "\\b(?:verbos seguidos de gerundio|verbos seguidos de infinitivo|verbos que admiten infinitivo o gerundio|verb complements)\\b",
    "name": "el complemento verbal en infinitivo o gerundio solicitado",
    "function": "conservar la relación entre el verbo y la acción de su complemento, distinguiendo el significado solicitado",
    "error": "el complemento no es compatible con el verbo o cambia si la acción se recuerda, realiza o está pendiente"
  },
  {
    "id": "phrasal-verbs",
    "match": "\\b(?:phrasal verbs|verbos frasales|fill out|pick up)\\b",
    "name": "los phrasal verbs solicitados",
    "function": "relacionar el verbo y su partícula con el significado de la acción en el contexto indicado",
    "error": "atribuye al conjunto otro significado o relaciona la acción con otro referente"
  },
  {
    "id": "agreement-responses",
    "match": "\\b(?:me too|not me|neither do i|so do i|i do too|so did i)\\b",
    "name": "las respuestas de coincidencia o discrepancia solicitadas",
    "function": "relacionar el acuerdo o desacuerdo con la afirmación del interlocutor conservando su polaridad y referencia temporal",
    "error": "invierte acuerdo y desacuerdo o cambia la polaridad o el tiempo de la afirmación"
  },
  {
    "id": "there-modal-be",
    "match": "\\b(?:there modal be|there might be|there could be|there must be|there may be)\\b",
    "name": "there + modal + be",
    "function": "relacionar la existencia de un referente con el grado de posibilidad o certeza indicado",
    "error": "presenta como confirmada una existencia solo posible o cambia el referente"
  },
  {
    "id": "zero-conditional",
    "match": "\\b(?:condicional cero|zero conditional)\\b",
    "name": "el condicional cero",
    "function": "relacionar la condición con el resultado habitual o general indicado",
    "error": "presenta como excepcional un resultado general o invierte la relación de la condición con el resultado"
  },
  {
    "id": "third-conditional",
    "match": "\\b(?:tercer condicional|third conditional)\\b",
    "name": "el tercer condicional",
    "function": "relacionar una condición pasada no cumplida con el resultado alternativo que habría sido posible",
    "error": "presenta como ocurrido el resultado hipotético o cambia la relación con la condición pasada"
  },
  {
    "id": "passive",
    "match": "\\b(?:(?<!\\ben )voz pasiva|passive voice)\\b",
    "name": "la voz pasiva solicitada",
    "function": "relacionar el hecho narrado o explicado con el referente que recibe la acción",
    "error": "atribuye al receptor la realización de la acción o cambia la referencia temporal solicitada"
  },
  {
    "id": "passive-past-perfect",
    "match": "\\b(?:pasado perfecto en voz pasiva|past perfect passive)\\b",
    "name": "la voz pasiva del pasado perfecto",
    "function": "relacionar la acción recibida por el referente con su anterioridad a otro acontecimiento pasado",
    "error": "atribuye al receptor la realización de la acción o invierte la anterioridad de los hechos"
  },
  {
    "id": "reported-speech",
    "match": "\\b(?:reported speech|estilo indirecto|discurso indirecto)\\b",
    "name": "el estilo indirecto solicitado",
    "function": "relatar de forma detallada lo comunicado conservando sus referentes, información y relaciones temporales",
    "error": "atribuye lo dicho a otra persona o cambia los referentes y la relación temporal de la información"
  },
  {
    "id": "it-cleft",
    "match": "\\b(?:oraciones enfaticas con it|it clefts|it cleft)\\b",
    "name": "la oración enfática con it",
    "function": "destacar el elemento indicado de la afirmación sin cambiar el acontecimiento comunicado",
    "error": "el énfasis destaca otro referente o altera la afirmación"
  },
  {
    "id": "wh-cleft",
    "match": "\\b(?:oraciones enfaticas con wh|wh clefts|wh cleft)\\b",
    "name": "la oración enfática con wh",
    "function": "destacar la información indicada mediante una estructura con wh que conserva la afirmación",
    "error": "la estructura enfatiza otra información o cambia la relación entre sus partes"
  },
  {
    "id": "nominal-gerund",
    "match": "\\b(?:gerundio en funcion de sustantivo|gerundio como sustantivo|nominal gerund)\\b",
    "name": "el gerundio en función de sustantivo",
    "function": "presentar la actividad como referente nominal de la afirmación indicada",
    "error": "cambia la actividad o su función nominal en la afirmación"
  },
  {
    "id": "probability-adverbs",
    "match": "\\b(?:adverbios de probabilidad|adverbs of probability)\\b",
    "name": "los adverbios y frases adverbiales de probabilidad",
    "function": "comunicar el grado de posibilidad de la explicación o afirmación indicada",
    "error": "presenta como segura una posibilidad o contradice el grado de probabilidad solicitado"
  },
  {
    "id": "intensity-adverbs",
    "match": "\\b(?:adverbios de intensidad|adverbs of intensity)\\b",
    "name": "los adverbios y frases adverbiales de intensidad",
    "function": "precisar la intensidad de la acción o característica comunicada",
    "error": "cambia la intensidad que debe reconocer el destinatario"
  },
  {
    "id": "place-prepositions",
    "match": "\\b(?:preposiciones de lugar|prepositions of place)\\b",
    "name": "las preposiciones de lugar",
    "function": "relacionar la ubicación o desplazamiento con la referencia espacial indicada",
    "error": "sitúa el referente o la acción en otro lugar o cambia el sentido del desplazamiento"
  },
  {
    "id": "time-prepositions",
    "match": "\\b(?:preposiciones de tiempo|prepositions of time)\\b",
    "name": "las preposiciones de tiempo",
    "function": "relacionar el acontecimiento con el momento o duración indicados",
    "error": "cambia el momento o duración del acontecimiento"
  },
  {
    "id": "relative-omission",
    "match": "\\b(?:omision del pronombre relativo|omission of relative pronouns|relative omission)\\b",
    "name": "la omisión del pronombre relativo solicitada",
    "function": "conservar la relación con el antecedente cuando el pronombre relativo puede omitirse en la estructura indicada",
    "error": "omite un pronombre necesario o cambia el antecedente de la información"
  },
  {
    "id": "cause-connectors",
    "match": "\\b(?:conectores de causa y efecto|conectores de causa|conectores de efecto|cause and effect connectors)\\b",
    "name": "los conectores de causa o efecto solicitados",
    "function": "relacionar el hecho con su causa o efecto según el sentido pedido",
    "error": "invierte causa y efecto o elimina una relación necesaria para comprender el hecho"
  },
  {
    "id": "exclusion-connectors",
    "match": "\\b(?:conectores de exclusion|exclusion connectors)\\b",
    "name": "los conectores de exclusión",
    "function": "distinguir la excepción del conjunto o afirmación al que corresponde",
    "error": "incluye como general lo que se excluye o atribuye la excepción a otro conjunto"
  },
  {
    "id": "purpose-connectors",
    "match": "\\b(?:conectores de finalidad|purpose connectors)\\b",
    "name": "los conectores de finalidad",
    "function": "relacionar la acción con la finalidad para la que se realiza",
    "error": "confunde la finalidad con un resultado ocurrido o con la causa de la acción"
  },
  {
    "id": "summary-connectors",
    "match": "\\b(?:conectores de sintesis|summary connectors)\\b",
    "name": "los conectores de síntesis",
    "function": "relacionar la síntesis con las ideas principales que resume",
    "error": "introduce como síntesis una idea ajena o cambia el sentido de las ideas resumidas"
  }
],
optativeEnglishModules:[
  {
    "id": "optativa-hlm-ingles-4",
    "grade": 4,
    "subjectCode": "OPT-HLM-ING-4",
    "subjectName": "Manejo de la información en inglés",
    "optativeExitName": "Humanidades y Lenguas Modernas",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "b2d7a388-b852-52a5-adf5-d78642f21f96",
    "pdfPages": [
      445,
      446,
      447,
      448,
      449
    ],
    "policy": "EXPLICIT_OPTATIVE_SCOPE_REQUESTED_FUNCTION_MEDIUM_FORM_SOURCE_REVIEW_V1"
  },
  {
    "id": "optativa-hlm-ingles-5",
    "grade": 5,
    "subjectCode": "OPT-HLM-ING-5",
    "subjectName": "Apreciación de la Literatura Anglófona",
    "optativeExitName": "Humanidades y Lenguas Modernas",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "95d4757b-5e0a-5821-af62-37d031ccf922",
    "pdfPages": [
      450,
      451,
      452,
      453,
      454,
      455
    ],
    "policy": "EXPLICIT_OPTATIVE_SCOPE_REQUESTED_FUNCTION_MEDIUM_BASIC_LITERATURE_SOURCE_REVIEW_V1"
  },
  {
    "id": "optativa-hlm-ingles-6",
    "grade": 6,
    "subjectCode": "OPT-HLM-ING-6",
    "subjectName": "Análisis Crítico y Evaluación de Textos en Inglés",
    "optativeExitName": "Humanidades y Lenguas Modernas",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "7e02a1ba-12f8-5862-81ff-0ad9bb34f8cc",
    "pdfPages": [
      456,
      457,
      458,
      459,
      460
    ],
    "policy": "EXPLICIT_OPTATIVE_SCOPE_REQUESTED_FUNCTION_MEDIUM_CRITICAL_INFORMATION_SOURCE_REVIEW_V1"
  }
],
version:"evaluation-2026.129"} as unknown as EvaluationCatalog
