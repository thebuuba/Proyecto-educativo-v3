import type {LanguageFeature} from './language-feature-criteria'
import {englishGradeFourGrammar} from './secondary-english-grade-four-grammar'
import {requestedScopedEnglishGrammar,scopedEnglishGrammarCriterion} from './secondary-english-grammar'
const common=["declarative", "interrogative-sentences", "exclamation", "used-to", "verb-complements", "question-tags", "indirect-questions", "zero-article", "comparative", "time-adverbs", "frequency-adverbs", "manner-adverbs", "preposition-use", "sentence-final-preposition", "relative-pronouns", "reflexive-pronouns", "concession-connectors", "contrast-connectors", "sequence-connectors", "time-connectors"]
/** PDF164–167: only these unchanged forms reuse fourth-grade meanings. All medical, narrative, modal and reporting purposes below are authored for fifth. */
export const englishGradeFiveGrammar:LanguageFeature[]=[
 ...englishGradeFourGrammar.filter(f=>common.includes(f.id)),
 {"id": "present-simple", "match": "\\b(?:presente simple|present simple|simple present)\\b", "name": "el presente simple", "function": "comunicar los datos actuales de la consulta simulada o del problema reclamado según la situación indicada", "error": "cambia el referente o el sentido de los datos actuales de la situación"},
 {"id": "medical-verbs", "match": "\\b(?:be have feel y hurt|verbos? (?:be|have|feel|hurt))\\b", "name": "be, have, feel y hurt según los verbos solicitados", "function": "relacionar el estado o síntoma con el personaje de la ficha de la consulta simulada", "error": "atribuye al personaje un estado o síntoma diferente del proporcionado"},
 {"id": "suggest", "match": "\\b(?:suggest)\\b", "name": "suggest", "function": "proponer una recomendación relacionada con la necesidad indicada", "error": "la recomendación cambia la acción o el referente al que se dirige"},
 {"id": "advise", "match": "\\b(?:advise)\\b", "name": "advise", "function": "comunicar un consejo relacionado con la necesidad del referente indicado", "error": "el consejo cambia la necesidad o se dirige a otro referente"},
 {"id": "causatives", "match": "\\b(?:verbos causativos|causative verbs|get have y make)\\b", "name": "los verbos causativos solicitados", "function": "distinguir quién encarga o provoca la acción y quién la realiza o la recibe en la situación", "error": "atribuye la acción a quien la encarga o cambia quién la realiza o recibe"},
 {"id": "past-simple", "match": "\\b(?:pasado simple|past simple|simple past)\\b", "name": "el pasado simple", "function": "narrar el acontecimiento terminado con su referencia al pasado", "error": "presenta como actual un acontecimiento terminado o cambia el hecho narrado"},
 {"id": "present-perfect", "match": "\\b(?:presente perfecto(?! continuo)|present perfect(?! continuous))\\b", "name": "el presente perfecto", "function": "relacionar el antecedente del personaje de la consulta simulada con la situación presente", "error": "presenta el antecedente como un hecho en desarrollo o cambia su relación con el presente"},
 {"id": "present-perfect-continuous", "match": "\\b(?:presente perfecto continuo|present perfect continuous)\\b", "name": "el presente perfecto continuo", "function": "comunicar la continuidad del estado o actividad que se relaciona con la consulta simulada o la información reportada", "error": "cambia una situación continuada por un hecho terminado o altera su duración"},
 {"id": "past-continuous", "match": "\\b(?:pasado continuo|past continuous)\\b", "name": "el pasado continuo", "function": "situar la acción en desarrollo con la que se relaciona otro acontecimiento de la narración", "error": "confunde la acción en desarrollo y el acontecimiento terminado o altera su relación"},
 {"id": "past-perfect", "match": "\\b(?:pasado perfecto|past perfect)\\b", "name": "el pasado perfecto", "function": "distinguir el acontecimiento anterior a otro hecho pasado de la narración", "error": "invierte la anterioridad entre los acontecimientos del pasado"},
 {"id": "future-continuous", "match": "\\b(?:futuro continuo|future continuous)\\b", "name": "el futuro continuo", "function": "situar la acción que estará en desarrollo al reportar información o expresar una probabilidad", "error": "presenta como terminada la acción futura en desarrollo o cambia su referencia temporal"},
 {"id": "modal-cannot", "match": "\\b(?:can t|cannot)\\b", "name": "can’t", "function": "comunicar la prohibición de la acción en la situación indicada", "error": "presenta como permitida la acción que la situación prohíbe"},
 {"id": "modal-must", "match": "\\b(?:must)\\b", "name": "must", "function": "expresar la obligación o la certeza deducida de los indicios según la intención solicitada", "error": "confunde una obligación con una opción o una deducción con un hecho directamente observado"},
 {"id": "modal-have-to", "match": "\\b(?:have to)\\b", "name": "have to", "function": "comunicar la obligación establecida en las condiciones de la situación", "error": "convierte en opcional la obligación o cambia la acción requerida"},
 {"id": "modal-should", "match": "\\b(?:should)\\b", "name": "should", "function": "comunicar un consejo relacionado con la necesidad del personaje", "error": "presenta el consejo como un hecho ya ocurrido o cambia la recomendación"},
 {"id": "modal-ought-to", "match": "\\b(?:ought to)\\b", "name": "ought to", "function": "comunicar una recomendación relacionada con los datos de la situación", "error": "cambia la acción recomendada o su referente"},
 {"id": "modal-supposed-to", "match": "\\b(?:be supposed to)\\b", "name": "be supposed to", "function": "comunicar la acción esperada por la norma o acuerdo proporcionado", "error": "atribuye al acuerdo una expectativa diferente de la indicada"},
 {"id": "modal-need-to", "match": "\\b(?:need to)\\b", "name": "need to", "function": "comunicar la necesidad de una acción en la situación indicada", "error": "cambia la acción necesaria o la presenta como ya realizada"},
 {"id": "modal-may", "match": "\\b(?:may)\\b", "name": "may", "function": "comunicar una posibilidad o una solicitud cortés al obtener bienes o servicios según la intención indicada", "error": "presenta la posibilidad como confirmada o cambia la solicitud de la transacción"},
 {"id": "modal-might", "match": "\\b(?:might)\\b", "name": "might", "function": "expresar una posibilidad incierta relacionada con los indicios de la situación", "error": "presenta como seguro lo que los indicios solo permiten considerar posible"},
 {"id": "modal-could", "match": "\\b(?:could)\\b", "name": "could", "function": "comunicar una posibilidad o una solicitud cortés de bienes o servicios según la intención indicada", "error": "altera el grado de posibilidad o cambia el sentido de la solicitud"},
 {"id": "modal-will", "match": "\\b(?:will)\\b", "name": "will", "function": "comunicar la elección o solicitud futura del bien o servicio indicado", "error": "sitúa como ya realizada una elección futura o cambia el bien solicitado"},
 {"id": "modal-would-like", "match": "\\b(?:would like)\\b", "name": "would like", "function": "solicitar cortésmente el bien o servicio indicado", "error": "atribuye al interlocutor una solicitud distinta de la indicada"},
 {"id": "modal-can", "match": "\\b(?:can(?! t\\b))\\b", "name": "can", "function": "solicitar el bien o servicio de la transacción mediante una expresión cortés", "error": "cambia lo solicitado o lo presenta como una orden incompatible con la situación"},
 {"id": "phrasal-verbs", "match": "\\b(?:phrasal verbs|verbos frasales|settle down|pick up)\\b", "name": "los phrasal verbs solicitados", "function": "relacionar el verbo y su partícula con el significado de la acción indicada", "error": "atribuye al conjunto otro significado o relaciona la partícula con otro referente"},
 {"id": "there-be", "match": "\\b(?:there be|there was|there were)\\b", "name": "there + be en pasado", "function": "comunicar la existencia de un acontecimiento o referente al narrar hechos pasados", "error": "cambia la existencia o sitúa como presente el acontecimiento pasado"},
 {"id": "mixed-conditional", "match": "\\b(?:condicional mixto|mixed conditional)\\b", "name": "el condicional mixto indicado", "function": "relacionar la condición con el resultado modal que depende de ella en la situación", "error": "presenta el resultado como incondicional o cambia la relación entre condición y modalidad"},
 {"id": "second-conditional", "match": "\\b(?:segundo condicional|second conditional)\\b", "name": "el segundo condicional", "function": "relacionar una situación hipotética con su resultado posible sin presentarla como un hecho confirmado", "error": "presenta la hipótesis como real o invierte la relación entre la condición y su resultado"},
 {"id": "passive", "match": "\\b(?:voz pasiva|passive voice)\\b", "name": "la voz pasiva de la narración", "function": "relacionar el acontecimiento narrado con el referente que recibe la acción", "error": "atribuye al receptor la realización de la acción o cambia el acontecimiento"},
 {"id": "reported-speech", "match": "\\b(?:reported speech|estilo indirecto|discurso indirecto)\\b", "name": "el estilo indirecto solicitado", "function": "reportar lo dicho conservando la información, sus referentes y las relaciones temporales indicadas", "error": "atribuye la afirmación a otra persona o cambia sus referentes y sentido temporal"},
 {"id": "emphatic-do", "match": "\\b(?:oraciones enfaticas con do|emphatic do)\\b", "name": "el uso enfático de do", "function": "enfatizar la afirmación conservando la acción y su referencia temporal", "error": "el énfasis cambia la afirmación o altera el momento de la acción"},
 {"id": "quantity-adverbs", "match": "\\b(?:adverbios de cantidad|adverbs of quantity)\\b", "name": "los adverbios y frases adverbiales de cantidad", "function": "precisar la cantidad comunicada en la situación", "error": "cambia la cantidad que debe reconocer el destinatario"},
 {"id": "probability-adverbs", "match": "\\b(?:adverbios de probabilidad|adverbios de certeza|adverbs of probability|adverbs of certainty)\\b", "name": "las expresiones adverbiales de probabilidad o certeza solicitadas", "function": "expresar el grado de probabilidad o seguridad de la información", "error": "presenta como seguro lo posible o atribuye duda a lo confirmado por los datos"},
 {"id": "emphatic-reflexives", "match": "\\b(?:uso enfatico de los pronombres reflexivos|emphatic reflexive pronouns)\\b", "name": "el uso enfático de los pronombres reflexivos", "function": "destacar al referente que realiza la acción sin cambiar su identidad", "error": "atribuye el énfasis a otro referente o confunde énfasis y acción reflexiva"},
 {"id": "how-much-many", "match": "\\b(?:how much|how many)\\b", "name": "how much o how many según la cantidad solicitada", "function": "preguntar por la cantidad o el precio en la transacción indicada", "error": "pregunta por un precio cuando se requiere cantidad de elementos o altera lo solicitado"},
 {"id": "why-suggestion", "match": "\\b(?:why don t|why not)\\b", "name": "why don’t o why not según la forma solicitada", "function": "proponer una acción como consejo o sugerencia en la situación indicada", "error": "la forma cambia la propuesta por otra acción o altera su destinatario"},
 {"id": "addition-connectors", "match": "\\b(?:conectores de adicion|addition connectors)\\b", "name": "los conectores de adición", "function": "añadir información relacionada con la idea anterior", "error": "presenta como oposición o alternativa la información que debe añadirse"},
 {"id": "condition-connectors", "match": "\\b(?:conectores de condicion|condition connectors)\\b", "name": "los conectores de condición", "function": "relacionar una acción con la condición que permite realizarla", "error": "elimina la condición o invierte su relación con la acción"},
 {"id": "correlative-connectors", "match": "\\b(?:conectores de correlacion|correlative connectors)\\b", "name": "los conectores de correlación solicitados", "function": "relacionar los elementos con la suma, alternativa o negación correlativa indicada", "error": "confunde suma, alternativa y negación o deja sin relacionar un elemento de la correlación"},
 {"id": "illustration-connectors", "match": "\\b(?:conectores de ilustracion|illustration connectors)\\b", "name": "los conectores de ilustración", "function": "relacionar una idea con el ejemplo que permite ilustrarla", "error": "el ejemplo contradice o no se relaciona con la idea que debía ilustrar"},
]
export function requestedGradeFiveGrammar(text:string){
 const scoped=text.replace(/uso enfatico de (?:los )?pronombres reflexivos/g,'emphatic reflexive pronouns')
 const forms=englishGradeFiveGrammar.map(f=>f.id==='reflexive-pronouns'?{...f,match:'(?<!emphatic )'+f.match}:f)
 return requestedScopedEnglishGrammar(scoped,forms,['suggest','advise','causatives','medical-verbs','phrasal-verbs','how-much-many','why-suggestion'])
}
export function gradeFiveGrammarCriterion(feature:LanguageFeature,text:string,mode:string){
 // Curricular examples do not require another medical or purchase scenario.
 const medical=/\b(?:consultas? medicas?|consulta simulada|sintomas?|reclamacion(?:es)?|quejas?)\b/.test(text)
 const purchase=/\b(?:compras?|transacciones?|bienes|servicios|precios?|pagos?)\b/.test(text)
 const neutral:Record<string,{function:string;error?:string}>={
  ...(!medical?{
   'present-simple':{function:'comunicar la información actual indicada en la situación'},
   'present-perfect':{function:'relacionar un antecedente con la situación presente'},
   'present-perfect-continuous':{function:'comunicar la continuidad del estado o actividad y su duración indicada'},
   'medical-verbs':{function:'relacionar el estado, posesión o sensación con el referente indicado en la situación',error:'atribuye a otro referente el estado, posesión o sensación comunicados'},
  }:{}),
  ...(!purchase?{
   'modal-may':{function:'comunicar una posibilidad o una solicitud cortés según la intención indicada',error:'presenta la posibilidad como confirmada o cambia la solicitud indicada'},
   'modal-could':{function:'comunicar una posibilidad o una solicitud cortés según la intención indicada'},
   'modal-can':{function:'comunicar una solicitud mediante una expresión cortés',error:'cambia lo solicitado o lo presenta como una orden incompatible con la situación'},
   'modal-will':{function:'comunicar la acción futura indicada',error:'sitúa como ya realizada una acción futura o cambia su referente'},
   'modal-would-like':{function:'expresar cortésmente lo deseado o solicitado en la situación'},
  }:{}),
 }
 const contextual=neutral[feature.id]?{...feature,...neutral[feature.id]}:feature
 const explains=new RegExp(`\\b(?:funcion|significado|uso) (?:de|del|de la) (?:(?:el|la|los|las)\\s+)*(?:${feature.match})`).test(text)&&/\b(?:explic\w*|analiz\w*|investig\w*)\b/.test(text)
 return scopedEnglishGrammarCriterion(contextual,text,mode!=='comparison'&&explains?'analysis':mode,'ing-5')
}
