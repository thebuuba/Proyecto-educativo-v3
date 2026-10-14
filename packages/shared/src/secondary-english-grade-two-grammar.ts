import {requestedLanguageFeatures,type LanguageFeature} from './language-feature-criteria'
import {englishGradeOneGrammar,englishGrammarCriterion} from './secondary-english-grade-one-grammar'

/** PDF142–144. Reuse only forms explicitly present in both common scopes.
 * Future forms, advice, states, quantity, duration and narrative background have
 * their own grade-two purposes; first-grade invitation forms are not inherited.
 */
const sharedIds=['present-simple','past-simple','present-perfect','question-tags','possessive-s','articles','comparative','interrogative-pronouns','object-pronouns','possessive-pronouns','time-prepositions','time-adverbs','frequency-adverbs','degree-adverbs','coordination-connectors','time-connectors','sequence-connectors','cause-connectors']
const feature=(id:string,match:string,name:string,purpose:string,error:string,terms?:[string,string][]):LanguageFeature=>({id,match:`\\b(?:${match})\\b`,name,function:purpose,error,...(terms?{terms}:{})})
export const englishGradeTwoGrammar:LanguageFeature[]=[
 ...englishGradeOneGrammar.filter(f=>sharedIds.includes(f.id)),
 feature('past-continuous','pasado continuo|past continuous','el pasado continuo','situar la acción que estaba en desarrollo como contexto de un acontecimiento pasado','confunde la acción en curso con el acontecimiento que la interrumpe'),
 feature('will','will','will','proponer o confirmar un plan futuro en el intercambio','cambia la acción o el momento futuro acordado'),
 feature('going-to','be going to|going to','be going to','expresar la intención o el plan futuro solicitado','presenta como hecho terminado la intención futura'),
 feature('present-continuous','presente continuo|present continuous','el presente continuo','comunicar el plan futuro acordado con su referencia temporal','confunde el acuerdo futuro con una acción sin referencia al plan'),
 feature('there-past','there was|there were|there was y there were','there was o there were según lo solicitado','indicar la existencia y cantidad de elementos en el pasado','cambia la cantidad o sitúa como actual la existencia pasada'),
 feature('imperative','imperativos?|imperatives?','el imperativo','dar el consejo o la indicación solicitada al interlocutor','invierte la indicación afirmativa y la prohibición'),
 feature('lets','let s','let’s','proponer una acción compartida como sugerencia','la expresión deja de proponer una acción compartida'),
 feature('wishes','want|hope|wish','los verbos de deseo o esperanza solicitados','distinguir lo que se desea de lo que se espera que ocurra','comunica como un hecho confirmado lo que se desea o espera',[['\\bwant\\b','want'],['\\bhope\\b','hope'],['\\bwish\\b','wish']]),
 feature('permission','can|may|could','los modales de permiso solicitados','solicitar permiso o intervención cortés según el intercambio','la formulación deja de solicitar permiso o modifica la acción solicitada',[['\\bcan\\b','can'],['\\bmay\\b','may'],['\\bcould\\b','could']]),
 feature('should','should','should','relacionar un consejo con el problema cotidiano planteado','presenta el consejo como una obligación ajena al problema'),
 feature('conditional','condicional(?:es)?|first conditional|conditional sentences?','la oración condicional','relacionar una condición con el consejo o plan que depende de ella','invierte la condición y el resultado o presenta el resultado como incondicional'),
 feature('passive','voz pasiva|pasiva (?:en )?presente|present passive','la voz pasiva en presente','referir el producto o servicio sobre el que recae una acción','atribuye al producto la acción que recibe'),
 feature('exclamation','exclamaciones?|exclamatory sentences?','las oraciones exclamativas','expresar la reacción ante la situación comunicada','cambia el sentido de la reacción solicitada'),
 feature('countability','sustantivos? contables|sustantivos? incontables|contables e incontables|countable|uncountable','los sustantivos contables e incontables solicitados','expresar cantidades compatibles con el tipo de sustantivo','trata una cantidad no contable como unidades contables o lo contrario'),
 feature('gender','genero (?:gramatical|de los sustantivos)|noun gender','el género de los sustantivos solicitado','reconocer el referente del sustantivo según su forma','atribuye a la forma una referencia distinta'),
 feature('number','numero de los sustantivos|singular y plural|noun number','el singular y plural solicitados','distinguir un elemento de varios elementos','cambia la cantidad expresada por el sustantivo'),
 feature('present-participle','participio presente|present participle|adjetivos? (?:en|terminados en) ing','los adjetivos en participio presente','caracterizar el efecto que provoca una situación o actividad','confunde el efecto de la actividad con el estado de quien lo experimenta'),
 feature('past-participle','participio pasado|past participle|adjetivos? (?:en|terminados en) ed','los adjetivos en participio pasado','describir el estado de la persona o referente','confunde el estado del referente con el efecto que provoca una actividad'),
 feature('how-much-many','how much|how many','how much o how many según lo solicitado','preguntar la cantidad de acuerdo con el referente contable o no contable','elige una pregunta incompatible con el tipo de cantidad'),
 feature('why-suggestion','why don t|why not','why don’t o why not según lo solicitado','formular una sugerencia de acción al interlocutor','pregunta por una causa cuando pretende proponer una acción'),
 feature('reflexive-pronouns','pronombres? reflexivos?|reflexive pronouns?','los pronombres reflexivos','relacionar una acción con el mismo referente que la realiza','atribuye a otra persona una acción que recae sobre el sujeto'),
 feature('quantity-adverbs','adverbios? de cantidad|adverbs? of quantity','las expresiones de cantidad solicitadas','precisar cuánto hay del referente','cambia la cantidad que se pretende comunicar'),
 feature('duration-prepositions','preposiciones? de duracion|since|for|ago|until','las preposiciones de duración solicitadas','situar la duración, el inicio o el límite temporal de una situación','confunde la duración con el momento de inicio o final',[['\\bsince\\b','since'],['\\bfor\\b','for'],['\\bago\\b','ago'],['\\buntil\\b','until']]),
]

export function requestedGradeTwoGrammar(text:string){
 let expanded=text
 for(const [category,names] of [['adverbios?','tiempo|frecuencia|cantidad|intensidad'],['preposiciones?','tiempo|duracion'],['conectores?','coordinacion|tiempo|secuencia|causa']] as const)
  expanded=expanded.replace(new RegExp(`\\b(${category}) de ((?:${names})(?:\\s+(?:y\\s+)?(?:${names}))*)\\b`,'g'),(_,label:string,items:string)=>items.split(/\s+(?:y\s+)?/).map(item=>`${label} de ${item}`).join(' y '))
 return requestedLanguageFeatures(englishGradeTwoGrammar,expanded)
}
export const gradeTwoGrammarCriterion=(feature:LanguageFeature,text:string,mode:string)=>englishGrammarCriterion(feature,text,mode,'ing-2')
