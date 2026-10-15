import type {LanguageFeature} from './language-feature-criteria'
import {englishGradeThreeGrammar} from './secondary-english-grade-three-grammar'
import {requestedScopedEnglishGrammar,scopedEnglishGrammarCriterion} from './secondary-english-grammar'
const feature=(id:string,match:string,name:string,purpose:string,error:string,terms?:[string,string][]):LanguageFeature=>({id,match:`\\b(?:${match})\\b`,name,function:purpose,error,...(terms?{terms}:{})})
const common=['exclamation','question-tags','comparative','present-participle','past-participle','time-adverbs','manner-adverbs','place-prepositions','interrogative-pronouns','reflexive-pronouns','relative-pronouns','cause-connectors','contrast-connectors','concession-connectors','purpose-connectors','sequence-connectors','time-connectors']
/** PDF159–161. Seventeen forms retain their meaning; the other twenty-seven
 * entries are authored for fourth, including plans, verb complements and questions. */
export const englishGradeFourGrammar:LanguageFeature[]=[
 ...englishGradeThreeGrammar.filter(f=>common.includes(f.id)),
 feature('declarative','oraciones? (?:enunciativas?|afirmativas?|negativas?)|declarative sentences?','las oraciones enunciativas solicitadas','comunicar una afirmación positiva o negativa con el sentido solicitado','invierte la afirmación o negación del mensaje',[[ 'afirmativas?','las oraciones afirmativas'],['negativas?','las oraciones negativas']]),
 feature('interrogative-sentences','oraciones? interrogativas?|preguntas? directas?|interrogative sentences?','las oraciones interrogativas','preguntar por la información indicada mediante una pregunta directa comprensible','pregunta por otro asunto o cambia la relación entre los referentes'),
 feature('present-simple','presente simple|present simple|simple present','el presente simple','comunicar información, un punto de vista o la situación que explica un problema, según la intención solicitada','cambia el referente o el sentido de la afirmación de la situación'),
 feature('present-continuous','presente continuo|present continuous','el presente continuo','expresar el plan futuro indicado con su referencia temporal','sitúa como terminada o habitual la acción del plan futuro'),
 feature('past-simple','pasado simple|past simple|simple past','el pasado simple','comunicar el acontecimiento terminado de la noticia o experiencia indicada','cambia el acontecimiento o su referencia al pasado'),
 feature('present-perfect','presente perfecto|present perfect','el presente perfecto','comunicar una noticia o experiencia reciente relacionada con el presente','sitúa como acción en desarrollo o sin relación con el presente el acontecimiento reciente'),
 feature('used-to','used to','used to','expresar un hábito pasado del referente indicado','presenta como hábito actual la situación pasada'),
 feature('imperative','imperativos?|imperatives?','el imperativo','comunicar la acción solicitada en una instrucción','cambia una instrucción afirmativa por una prohibición o altera la acción solicitada'),
 feature('past-continuous','pasado continuo|past continuous','el pasado continuo','situar la acción en desarrollo que permite explicar el problema o su motivo en el pasado','confunde la acción en desarrollo con un hecho terminado o cambia el motivo del problema'),
 feature('future-continuous','futuro continuo|future continuous|future progressive','el futuro continuo','comunicar el plan o acción que estará en desarrollo en el momento futuro indicado','sitúa como terminada o presente la acción en desarrollo del plan futuro'),
 feature('going-to','be going to|going to','be going to','comunicar un plan, anuncio o resultado futuro previsto a partir de la situación indicada','cambia la acción futura o su relación con los indicios o el plan indicado'),
 feature('will','will','will','comunicar una predicción sobre el resultado futuro indicado','presenta como ocurrido un resultado futuro o cambia la predicción solicitada'),
 feature('hope','hope','hope','comunicar la esperanza del referente en un resultado que no se presenta como confirmado','presenta como confirmado el resultado que el referente espera'),
 feature('wish','wish','wish','expresar el deseo del referente sin presentarlo como un hecho confirmado','cambia el sentido del deseo o lo presenta como un resultado ya confirmado'),
 feature('would-like','would like','would like','expresar un deseo o preferencia del referente en la situación solicitada','comunica una afirmación confirmada cuando se pide un deseo'),
 feature('verb-complements','verbos? (?:seguidos (?:por|de)|que admiten) (?:infinitivo|gerundio)(?: o gerundio)?|verb complements?','el complemento verbal en infinitivo o gerundio solicitado','seleccionar un complemento compatible con el verbo para comunicar la acción indicada','el complemento no es compatible con el verbo elegido o cambia la acción comunicada',[[ 'infinitivo','el complemento en infinitivo'],['gerundio','el complemento en gerundio']]),
 feature('phrasal-verbs','phrasal verbs?|verbos? frasales?|turn up|fill out|get along with|look after','los phrasal verbs solicitados','relacionar el verbo y su partícula para comunicar el significado indicado en la situación','atribuye al verbo y su partícula un significado diferente o cambia su relación',[[ 'turn up','turn up'],['fill out','fill out'],['get along with','get along with'],['look after','look after']]),
 feature('there-be','there be|there (?:is going to be|s going to be|has been|have been|will be|is|are|was|were)','there + be','comunicar existencia en el anuncio, noticia o explicación del problema con la referencia solicitada','cambia la existencia, la cantidad o el momento indicado'),
 feature('conditional','condicional(?:es)?(?: cero)?|primer condicional|zero conditional|first conditional','la estructura condicional solicitada','relacionar la condición con la acción o resultado que depende de ella según el tiempo indicado','invierte la condición y el resultado o altera su relación temporal'),
 feature('passive','voz pasiva(?: en (?:presente|pasado|futuro))?|passive voice|(?:present|past|future) passive','la voz pasiva solicitada','comunicar la acción que recibe el referente de la información, noticia o predicción indicada','atribuye al receptor la acción que recibe o cambia el momento solicitado',[[ 'pasiva en presente|present passive','la voz pasiva en presente'],['pasiva en pasado|past passive','la voz pasiva en pasado'],['pasiva en futuro|future passive','la voz pasiva en futuro']]),
 feature('indirect-questions','preguntas? indirectas?|preguntas? integradas?|embedded questions?|indirect questions?','las preguntas indirectas o integradas solicitadas','integrar la pregunta dentro de otra expresión conservando la información solicitada y el orden correspondiente','la pregunta integrada cambia la información pedida o el orden que permite comprenderla'),
 feature('nominal-gerund','gerundios? en funcion sustantiva|gerundio como sustantivo|gerunds? as nouns?','el gerundio en función sustantiva','presentar una actividad como elemento nominal de la oración según la función solicitada','cambia la actividad o su función nominal en la oración'),
 feature('zero-article','omision del articulo|articulo cero|zero article','la omisión del artículo solicitada','conservar la referencia general que el contexto permite expresar sin artículo','cambia una referencia general por una específica o elimina un artículo necesario en el contexto'),
 feature('frequency-adverbs','adverbios? de frecuencia|adverbs? of frequency','los adverbios de frecuencia','expresar la frecuencia de la acción indicada','confunde una acción habitual con una ocasional o inexistente'),
 feature('preposition-use','uso de preposiciones|preposiciones solicitadas','las preposiciones solicitadas','establecer la relación entre los elementos del mensaje según su sentido en la situación','la preposición cambia la relación solicitada entre los referentes'),
 feature('time-prepositions','preposiciones? de tiempo|prepositions? of time','las preposiciones de tiempo','relacionar un acontecimiento con la referencia temporal o duración solicitada','sitúa el hecho en otro momento o cambia la duración indicada'),
 feature('sentence-final-preposition','preposicion al final de la oracion|sentence final preposition','la preposición al final de la oración','mantener la relación de la preposición con su complemento aunque este se encuentre en otra posición de la oración','relaciona la preposición con un complemento diferente del indicado'),
]
export function requestedGradeFourGrammar(text:string){
 return requestedScopedEnglishGrammar(text,englishGradeFourGrammar,['hope','wish','would-like','phrasal-verbs']).map(f=>{
  if(f.id==='verb-complements'&&/infinitivo o gerundio/.test(text))return {...f,name:'el complemento en infinitivo o gerundio, según la alternativa elegida'}
  return f
 })
}
export function gradeFourGrammarCriterion(feature:LanguageFeature,text:string,mode:string){
 if(feature.id==='will'&&/\bplanes?\b/.test(text))feature={...feature,function:'comunicar la intención o decisión futura del referente en el plan solicitado',error:'cambia la acción o el momento futuro del plan comunicado'}
 const explains=new RegExp(`\\b(?:funcion|significado|uso) (?:de|del|de la) (?:(?:el|la|los|las)\\s+)*(?:${feature.match})`).test(text)&&/\b(?:explic\w*|analiz\w*|investig\w*)\b/.test(text)
 return scopedEnglishGrammarCriterion(feature,text,mode!=='comparison'&&explains?'analysis':mode,'ing-4')
}
