import {requestedLanguageFeatures,type LanguageFeature} from './language-feature-criteria'
import {englishGradeOneGrammar,englishGrammarCriterion} from './secondary-english-grade-one-grammar'
import {englishGradeTwoGrammar} from './secondary-english-grade-two-grammar'
import {affirmativeScopedEnglishTask} from './secondary-english-task-text'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

const feature=(id:string,match:string,name:string,purpose:string,error:string):LanguageFeature=>({id,match:`\\b(?:${match})\\b`,name,function:purpose,error})
/** Common forms are reused only where PDF147–150 explicitly repeats them.
 * News, deductions, zero article, clauses and modal purposes belong to third;
 * the first/second grade purpose is not inherited merely because a form matches. */
const common=['past-simple','question-tags','comparative','interrogative-pronouns','object-pronouns','time-prepositions','place-prepositions','time-adverbs','manner-adverbs','certainty-adverbs','coordination-connectors','time-connectors','sequence-connectors','cause-connectors']
export const englishGradeThreeGrammar:LanguageFeature[]=[
 ...englishGradeOneGrammar.filter(f=>common.includes(f.id)).map(f=>f.id==='cause-connectors'?{...f,match:'\\b(?:conectores? de causa(?: y consecuencia|lidad)?|conectores? de consecuencia|cause and effect connectors?)\\b'}:f),
 ...englishGradeTwoGrammar.filter(f=>['past-continuous','present-participle','past-participle','reflexive-pronouns'].includes(f.id)),
 feature('present-simple','presente simple|present simple|simple present','el presente simple','comunicar una indicación o un punto de vista en la situación solicitada','cambia el referente o el sentido de la indicación o afirmación'),
 feature('present-continuous','presente continuo|present continuous','el presente continuo','comunicar un anuncio o noticia con la referencia temporal indicada','confunde el acontecimiento anunciado con un hecho terminado'),
 feature('used-to','used to','used to','contrastar una situación o acción habitual del pasado con su situación presente','presenta como actual el hábito pasado o niega el cambio comunicado'),
 feature('present-perfect','presente perfecto|present perfect','el presente perfecto','comunicar una noticia o acontecimiento anterior relacionado con el presente','presenta como acción en curso el acontecimiento anterior que se informa'),
 feature('will','will','will','comunicar una predicción o conclusión sobre el resultado futuro apoyada en la información disponible','presenta como sucedido un resultado futuro o contradice los datos de la predicción'),
 feature('going-to','be going to|going to','be going to','comunicar una predicción sobre el resultado futuro a partir de los indicios disponibles','expresa un resultado incompatible con los indicios de la predicción'),
 feature('there-be','there be|there (?:is|are|was|were|has been|have been|will be|s going to be)','there + be','indicar existencia en una indicación, anuncio o noticia con el tiempo y número solicitados','cambia la existencia, la cantidad o el momento del acontecimiento comunicado'),
 feature('imperative','imperativos?|imperatives?','el imperativo','comunicar la acción indicada o prohibida en la situación solicitada','invierte la instrucción y la prohibición o cambia la acción que se comunica'),
 feature('lets','let s','let’s','proponer una acción compartida en una indicación o sugerencia','la forma cambia la propuesta compartida por una acción diferente'),
 feature('why-suggestion','why don t|why not','why don’t o why not según lo solicitado','formular una sugerencia de acción al interlocutor','pregunta por una causa cuando debe proponer una acción'),
 feature('modal-can','can','can','expresar posibilidad o capacidad, o indicar lo permitido según la situación comunicada','confunde lo posible o permitido con lo imposible o prohibido'),
 feature('modal-should','should','should','expresar una recomendación pertinente para la situación indicada','presenta como obligación absoluta la recomendación solicitada'),
 feature('modal-must','must','must','expresar necesidad o una conclusión fuertemente apoyada en los indicios, según la situación solicitada','confunde una necesidad con una opción o una deducción con un hecho directamente observado'),
 feature('modal-may','may','may','expresar una posibilidad que se distingue de una afirmación confirmada','presenta como confirmado lo que la situación solo permite considerar posible'),
 feature('modal-might','might','might','expresar una posibilidad incierta compatible con los datos de la situación','comunica como seguro un resultado que los datos solo permiten considerar posible'),
 feature('modal-have-to','have to','have to','expresar la obligación que establece la situación proporcionada','cambia o elimina la obligación indicada por las condiciones de la tarea'),
 feature('modal-need-to','need to','need to','expresar la necesidad de una acción para la situación proporcionada','atribuye necesidad a una acción diferente de la solicitada'),
 feature('adjective-clauses','clausulas? adjetivas?|adjective clauses?','las cláusulas adjetivas','precisar el referente mediante información que lo caracteriza o identifica','vincula la caracterización con un referente distinto'),
 feature('noun-clauses','clausulas? sustantivas?|noun clauses?','las cláusulas sustantivas','integrar una idea o contenido como parte de la afirmación solicitada','la cláusula cambia la idea que se atribuye a la afirmación'),
 feature('conditional','condicional(?:es)?|conditional sentences?','la oración condicional','relacionar una condición con la información o predicción que depende de ella','presenta el resultado como incondicional o invierte condición y consecuencia'),
 feature('passive-past','voz pasiva (?:del|en) pasado|pasiva del pasado|past passive','la voz pasiva en pasado','comunicar una acción recibida por un referente en un acontecimiento pasado','atribuye al receptor una acción realizada por otro o cambia el momento pasado'),
 feature('passive-present','voz pasiva (?:del|en) presente|pasiva del presente|present passive','la voz pasiva en presente','comunicar la acción que recibe el referente en la situación presente','atribuye al receptor la acción que recibe o sitúa como pasada una situación presente'),
 feature('agreement-responses','me too|me neither|so did i|neither do i','las respuestas de coincidencia o discrepancia solicitadas','comunicar la coincidencia o discrepancia con la afirmación del interlocutor','invierte el acuerdo o desacuerdo o la polaridad de la afirmación'),
 feature('exclamation','oraciones? exclamativas?|exclamaciones?|exclamatory sentences?','las oraciones exclamativas','expresar una reacción relacionada con el acontecimiento comunicado','la forma comunica una reacción incompatible con el acontecimiento indicado'),
 feature('abstract-nouns','sustantivos? abstractos?|abstract nouns?','los sustantivos abstractos','nombrar conceptos, estados o ideas de la situación comunicada','atribuye al concepto un significado diferente del mensaje'),
 feature('subject-gerund','gerundio (?:en funcion de|como) sujeto|gerund as subject','el gerundio en función de sujeto','presentar una actividad como sujeto de la afirmación','la forma deja de referirse a la actividad que funciona como sujeto'),
 feature('zero-article','ausencia del articulo definido|articulo cero|zero article','la ausencia del artículo definido','referirse a una categoría o idea general sin convertirla en un referente específico','la elección del artículo cambia la referencia general por una específica'),
 feature('relative-pronouns','pronombres? relativos?|relative pronouns?','los pronombres relativos','enlazar información adicional con el referente al que corresponde','relaciona la información con una persona o elemento distinto'),
 feature('duration-adverbs','(?:adverbios|frases adverbiales) de duracion|adverbs? of duration','las expresiones adverbiales de duración','comunicar la duración o referencia de continuidad temporal de la situación','confunde la duración con un momento puntual o altera su continuidad'),
 feature('intensity-adverbs','adverbios? de intensidad|adverbs? of intensity','los adverbios de intensidad','graduar la intensidad de una característica o acción','cambia la intensidad que se pretende expresar'),
 feature('degree-adverbs','adverbios? de grado|adverbs? of degree','las expresiones adverbiales de grado','precisar la cantidad o grado comunicado en la situación','expresa un grado o cantidad diferente del indicado'),
 feature('purpose-connectors','conectores? de finalidad|purpose connectors?','los conectores de finalidad','relacionar una acción con la finalidad para la que se realiza','confunde la finalidad con una causa o un resultado ya ocurrido'),
 feature('contrast-connectors','conectores? de contraste|contrast connectors?','los conectores de contraste','contrastar ideas o puntos de vista relacionados','presenta como equivalentes ideas que deben contrastarse'),
 feature('concession-connectors','conectores? de concesion|concession connectors?','los conectores de concesión','relacionar una circunstancia con un resultado que ocurre pese a ella','presenta la circunstancia como causa necesaria del resultado o elimina la concesión'),
]
export function requestedGradeThreeGrammar(description:string){
 let text=affirmativeScopedEnglishTask(description)
 for(const [category,names] of [['adverbios?','tiempo|duracion|modo|intensidad|grado|certeza'],['preposiciones?','tiempo|lugar'],['conectores?','coordinacion|tiempo|secuencia|causa|consecuencia|finalidad|contraste|concesion']] as const)
  text=text.replace(new RegExp(`\\b(${category}) de ((?:${names})(?:\\s+(?:y\\s+)?(?:${names}))*)\\b`,'g'),(_,label:string,items:string)=>items.split(/\s+(?:y\s+)?/).map(item=>`${label} de ${item}`).join(' y '))
 const guarded=new Set(['used-to','will','going-to','there-be','lets','why-suggestion','agreement-responses',...englishGradeThreeGrammar.filter(f=>f.id.startsWith('modal-')).map(f=>f.id)])
 const forms=englishGradeThreeGrammar.map(f=>f.match).join('|')
 const cue='(?:utiliz\\w*|emple\\w*|us(?:ar(?:an)?|an|en|ando)|identific\\w*|localiz\\w*|reconoc\\w*|compar(?:ar(?:an)?|an|en)|(?:funcion|significado|uso) de)'
 const article='(?:(?:el|la|los|las|verbo|modal|forma|estructura)\\s+)*'
 const selected=requestedLanguageFeatures(englishGradeThreeGrammar,text).filter(f=>!guarded.has(f.id)||new RegExp(`\\b${cue}\\s+${article}(?:(?:${forms})(?:\\s+(?:(?:y|o|e)\\s+)?)${article})*(?:${f.match})`).test(text))
 const consumed=new Set<string>(),result:LanguageFeature[]=[]
 for(const f of selected){
  if(consumed.has(f.id))continue
  const alternatives=[f],match=text.match(new RegExp(f.match))
  let end=(match?.index??-1)+(match?.[0].length??0)
  for(;;){
   const next=selected.find(other=>!consumed.has(other.id)&&!alternatives.includes(other)&&new RegExp(`^\\s+o\\s+${article}(?:${other.match})`).test(text.slice(end)))
   if(!next)break
   const continuation=text.slice(end).match(new RegExp(`^\\s+o\\s+${article}(?:${next.match})`))!
   alternatives.push(next);consumed.add(next.id);end+=continuation[0].length
  }
  result.push(alternatives.length===1?f:{...f,id:alternatives.map(a=>a.id).join('-or-'),name:alternatives.map(a=>a.name).join(' o ')+', según la alternativa elegida',function:alternatives.map(a=>a.function).join(' o ')+', según la forma elegida y la intención solicitada',error:alternatives.map(a=>a.error).join(' o ')+', según la alternativa elegida',terms:undefined})
 }
 return result
}
export function gradeThreeGrammarCriterion(feature:LanguageFeature,text:string,mode:string):ContextualTopicCriterion{
 const c=englishGrammarCriterion(feature,text,['analysis','comparison','research'].includes(mode)?'reading':mode,'ing-3')
 if(mode!=='comparison')return c
 const levels:NonNullable<ContextualTopicCriterion['progressionLevels']>=[
  `Contrasta ${feature.name} en los textos en inglés y sustenta las semejanzas o diferencias mediante ejemplos relacionados con su función para ${feature.function}.`,
  `Localiza ejemplos pertinentes de ${feature.name} y establece un contraste; una relación con su función requiere precisión.`,
  `Enumera ejemplos de ${feature.name}, pero deja sin relacionar las semejanzas o diferencias de sus usos.`,
  `El contraste atribuye a la forma una función incorrecta: ${feature.error}.`,
  `No aporta ejemplos pertinentes que permitan contrastar ${feature.name} en los textos disponibles.`,
 ]
 return {...c,observable:levels[0],progressionLevels:levels}
}
