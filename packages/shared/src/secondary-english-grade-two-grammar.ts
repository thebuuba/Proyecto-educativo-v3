import {affirmativeLanguageTask,requestedLanguageFeatures,type LanguageFeature} from './language-feature-criteria'
import {englishGradeOneGrammar,englishGrammarCriterion} from './secondary-english-grade-one-grammar'
import {explicitEnglishFeatureRequest} from './english-feature-request'

/** PDF142–144. Reuse only forms explicitly present in both common scopes.
 * Future forms, advice, states, quantity, duration and narrative background have
 * their own grade-two purposes; first-grade invitation forms are not inherited.
 */
const sharedIds=['present-simple','past-simple','present-perfect','question-tags','possessive-s','articles','comparative','interrogative-pronouns','object-pronouns','possessive-pronouns','time-prepositions','time-adverbs','frequency-adverbs','degree-adverbs','coordination-connectors','time-connectors','sequence-connectors','cause-connectors']
const feature=(id:string,match:string,name:string,purpose:string,error:string,terms?:[string,string][]):LanguageFeature=>({id,match:`\\b(?:${match})\\b`,name,function:purpose,error,...(terms?{terms}:{})})
const grammar:LanguageFeature[]=[
 ...englishGradeOneGrammar.filter(f=>sharedIds.includes(f.id)).map(f=>f.id==='cause-connectors'?{...f,match:'\\b(?:conectores? de causa(?:lidad)?|conectores? de consecuencia|cause and effect connectors?)\\b'}:f),
 feature('past-continuous','pasado continuo|past continuous','el pasado continuo','situar la acción que estaba en desarrollo como contexto de un acontecimiento pasado','confunde la acción en curso con el acontecimiento que la interrumpe'),
 feature('will','will','will','proponer o confirmar un plan futuro en el intercambio','cambia la acción o el momento futuro acordado'),
 feature('going-to','be going to|going to','be going to','expresar la intención o el plan futuro solicitado','presenta como hecho terminado la intención futura'),
 feature('present-continuous','presente continuo|present continuous','el presente continuo','comunicar el plan futuro acordado con su referencia temporal','confunde el acuerdo futuro con una acción sin referencia al plan'),
 feature('there-past','there was|there were|there be en pasado simple','there + be en pasado simple','indicar la existencia y cantidad de elementos en el pasado','cambia la cantidad o sitúa como actual la existencia pasada',[['\\bthere was\\b','there was'],['\\bthere were\\b','there were']]),
 feature('imperative','imperativos?|imperatives?','el imperativo','dar el consejo o la indicación solicitada al interlocutor','invierte la indicación afirmativa y la prohibición'),
 feature('lets','let s','let’s','proponer una acción compartida como sugerencia','la expresión deja de proponer una acción compartida'),
 feature('wishes','want|hope|wish','los verbos de deseo o esperanza solicitados','distinguir lo que se desea de lo que se espera que ocurra','comunica como un hecho confirmado lo que se desea o espera',[['\\bwant\\b','want'],['\\bhope\\b','hope'],['\\bwish\\b','wish']]),
 feature('permission','can|may|could','los modales de permiso solicitados','solicitar permiso o intervención cortés según el intercambio','la formulación deja de solicitar permiso o modifica la acción solicitada',[['\\bcan\\b','can'],['\\bmay\\b','may'],['\\bcould\\b','could']]),
 feature('should','should','should','relacionar un consejo con el problema cotidiano planteado','presenta el consejo como una obligación ajena al problema'),
 feature('conditional','condicional(?:es)?|first conditional|conditional sentences?','la oración condicional','relacionar una condición con el consejo o plan que depende de ella','invierte la condición y el resultado o presenta el resultado como incondicional'),
 feature('passive','voz pasiva(?: del presente)?|pasiva (?:en )?presente|present passive','la voz pasiva en presente','referir el producto o servicio sobre el que recae una acción','atribuye al producto la acción que recibe'),
 feature('exclamation','exclamaciones?|oraciones? exclamativas?|exclamatory sentences?','las oraciones exclamativas','expresar la reacción ante la situación comunicada','cambia el sentido de la reacción solicitada'),
 feature('countability','sustantivos? contables|sustantivos? incontables|contables e incontables|countable|uncountable','los sustantivos contables e incontables solicitados','expresar cantidades compatibles con el tipo de sustantivo','trata una cantidad no contable como unidades contables o lo contrario'),
 feature('gender','genero (?:gramatical|de los sustantivos)|noun gender','el género de los sustantivos solicitado','reconocer el referente del sustantivo según su forma','atribuye a la forma una referencia distinta'),
 feature('number','numero de los sustantivos|singular y plural|noun number','el singular y plural solicitados','distinguir un elemento de varios elementos','cambia la cantidad expresada por el sustantivo'),
 feature('present-participle','participio presente|present participle|adjetivos? (?:en|terminados en) ing','los adjetivos en participio presente','caracterizar el efecto que provoca una situación o actividad','confunde el efecto de la actividad con el estado de quien lo experimenta'),
 feature('past-participle','participio pasado|past participle|adjetivos? (?:en|terminados en) ed','los adjetivos en participio pasado','describir el estado de la persona o referente','confunde el estado del referente con el efecto que provoca una actividad'),
 feature('how-much-many','how much|how many','how much o how many según lo solicitado','preguntar la cantidad de acuerdo con el referente contable o no contable','elige una pregunta incompatible con el tipo de cantidad',[['\\bhow much\\b','how much'],['\\bhow many\\b','how many']]),
 feature('why-suggestion','why don t|why not','why don’t o why not según lo solicitado','formular una sugerencia de acción al interlocutor','pregunta por una causa cuando pretende proponer una acción',[['\\bwhy don t\\b','why don’t'],['\\bwhy not\\b','why not']]),
 feature('reflexive-pronouns','pronombres? reflexivos?|reflexive pronouns?','los pronombres reflexivos','relacionar una acción con el mismo referente que la realiza','atribuye a otra persona una acción que recae sobre el sujeto'),
 feature('quantity-adverbs','adverbios? de cantidad|adverbs? of quantity','las expresiones de cantidad solicitadas','precisar cuánto hay del referente','cambia la cantidad que se pretende comunicar'),
 feature('duration-prepositions','preposiciones? de duracion|since|for|ago|until','las preposiciones de duración solicitadas','situar la duración, el inicio o el límite temporal de una situación','confunde la duración con el momento de inicio o final',[['\\bsince\\b','since'],['\\bfor\\b','for'],['\\bago\\b','ago'],['\\buntil\\b','until']]),
]
export const englishGradeTwoGrammar=grammar

export function requestedGradeTwoGrammar(text:string){
 let expanded=affirmativeLanguageTask(text)
 for(const [category,names] of [['adverbios?','tiempo|frecuencia|cantidad|intensidad'],['preposiciones?','tiempo|duracion'],['conectores?','coordinacion|tiempo|secuencia|causa']] as const)
  expanded=expanded.replace(new RegExp(`\\b(${category}) de ((?:${names})(?:\\s+(?:y\\s+)?(?:${names}))*)\\b`,'g'),(_,label:string,items:string)=>items.split(/\s+(?:y\s+)?/).map(item=>`${label} de ${item}`).join(' y '))
 const forms=englishGradeTwoGrammar.map(f=>f.match).join('|')
 return requestedLanguageFeatures(englishGradeTwoGrammar,expanded).filter(f=>{
  if(!['will','wishes','permission','duration-prepositions'].includes(f.id))return true
  const named=f.id==='duration-prepositions'&&/\bpreposiciones? de duracion\b/.test(expanded)
  // An ambiguous English word is evidence only inside an explicitly requested
  // form/list, not a date (May), a person's name (Will), or quoted content.
  return named||explicitEnglishFeatureRequest(expanded,f.match,forms)
 }).map(f=>{
  const terms=f.terms?.filter(([pattern])=>new RegExp(pattern).test(expanded)).map(([,name])=>name)??[]
  if(terms.length>1&&terms.some((term,index)=>index<terms.length-1&&expanded.includes(`${term.replace(/[’']/g,' ')} o ${terms[index+1].replace(/[’']/g,' ')}`)))return {...f,name:terms.join(' o ')+', según la alternativa elegida'}
  return f
 })
}
export function gradeTwoGrammarCriterion(feature:LanguageFeature,text:string,mode:string){
 if(feature.id==='past-continuous'&&/estado(?:s)? (?:fisicos?|animicos?|de animo)|sensacion(?:es)? fisica(?:s)?/.test(text))feature={...feature,function:'describir el estado anímico o físico en desarrollo en el momento pasado indicado',error:'confunde el estado pasado con el estado actual del referente'}
 if(/\b(?:compra|pedido)\b/.test(text)){
  if(feature.id==='will')feature={...feature,function:'formular el pedido o la elección del producto en la compra indicada',error:'el pedido comunica una elección diferente del producto solicitado'}
  if(feature.id==='present-continuous')feature={...feature,function:'comunicar la búsqueda o acción de compra en desarrollo según la situación indicada',error:'confunde la búsqueda actual con una compra terminada'}
 }
 const criterion=englishGrammarCriterion(feature,text,mode==='analysis'?'reading':mode,'ing-2')
 if(mode!=='comparison')return criterion
 const target=feature.name
 const levels:typeof criterion.progressionLevels=[
  `Contrasta ${target} en los textos en inglés y explica sus semejanzas o diferencias con ejemplos vinculados con su función para ${feature.function}.`,
  `Localiza ejemplos pertinentes de ${target} y establece un contraste; una relación con su función requiere precisión.`,
  `Enumera ejemplos de ${target}, pero deja sin establecer cómo se asemejan o diferencian sus usos.`,
  `El contraste atribuye a la estructura una función incorrecta: ${feature.error}.`,
  `No aporta ejemplos que permitan contrastar ${target} en los textos disponibles.`,
 ]
 return {...criterion,observable:levels[0],progressionLevels:levels}
}
