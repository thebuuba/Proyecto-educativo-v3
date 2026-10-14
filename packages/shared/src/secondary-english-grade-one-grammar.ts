import {requestedLanguageFeatures,type LanguageFeature} from './language-feature-criteria'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

const feature=(id:string,match:string,name:string,purpose:string,error:string):LanguageFeature=>({id,match:`\\b(?:${match})\\b`,name,function:purpose,error})
/** MINERD 2023, PDF136–138. Authored evaluative evidence, not literal official rubrics. */
const grammar:LanguageFeature[]=[
 feature('present-simple','presente simple|simple present|present simple','el presente simple','expresar hábitos, datos o estados según el mensaje','altera la concordancia o la referencia habitual de las acciones'),
 feature('preference-verbs','verbos? (?:like|prefer|enjoy)|like prefer enjoy|like y prefer','los verbos like, prefer y enjoy solicitados','expresar gustos y preferencias relacionando quién prefiere con lo preferido','confunde quién expresa el gusto o qué actividad prefiere'),
 feature('present-continuous','presente continuo|present continuous','el presente continuo','situar una acción en desarrollo en el momento indicado','confunde la acción en desarrollo con una acción terminada o habitual'),
 feature('past-simple','pasado simple|simple past|past simple','el pasado simple','situar hechos o experiencias terminados en el pasado','presenta como actual un hecho situado en el pasado o cambia quién lo realizó'),
 feature('present-perfect','presente perfecto|present perfect','el presente perfecto','referir experiencias anteriores relacionadas con el presente','confunde la experiencia anterior con una acción que está ocurriendo ahora'),
 feature('future','will|be going to','will o be going to según la forma solicitada','comunicar previsiones para el momento futuro indicado','sitúa la previsión en un momento distinto del anunciado'),
 feature('would','would','would en la invitación','formular o aceptar cortésmente una invitación','la estructura cambia la invitación por una afirmación que no propone ni responde'),
 feature('declining-forms','can t|cannot|have to','can’t o have to según la forma solicitada','expresar imposibilidad u obligación al rechazar una invitación','comunica posibilidad cuando pretende expresar imposibilidad u obligación'),
 feature('there-be','there (?:is|are|be)|there y be','there + be','indicar existencia y cantidad en la descripción de un lugar','confunde la existencia o el número de los elementos descritos'),
 feature('imperative','imperativos?|imperatives?','el imperativo','comunicar la acción solicitada en una instrucción','cambia una instrucción afirmativa por una prohibición o altera la acción solicitada'),
 feature('lets','let s','let’s','proponer una actividad compartida mediante una invitación','la expresión deja de proponer una acción compartida al interlocutor'),
 feature('question-tags','question tags?','las question tags','solicitar confirmación de una afirmación mediante una coletilla relacionada','la coletilla no corresponde al sujeto, auxiliar o polaridad de la afirmación'),
 feature('possessive-s','posesivo s|genitivo sajon|possessive s','el posesivo ’s','relacionar una pertenencia con su poseedor','atribuye la pertenencia a un poseedor distinto'),
 feature('articles','articulos? definidos?|articulos? indefinidos?|definite articles?|indefinite articles?|a an y the','los artículos definidos o indefinidos solicitados','distinguir referentes identificados de referentes no identificados previamente','la elección del artículo cambia qué referente puede reconocer el destinatario'),
 feature('qualifying-adjectives','adjetivos? calificativos?|qualifying adjectives?','los adjetivos calificativos','atribuir características a personas, lugares u objetos','atribuye una característica incompatible con lo que se desea describir'),
 feature('comparative','comparativos?|comparative|superlativos?|superlative','el grado comparativo o superlativo solicitado','establecer una comparación o destacar un elemento dentro de un conjunto','confunde la relación entre dos elementos con la selección de uno dentro de un conjunto'),
 feature('possessive-adjectives','adjetivos? posesivos?|possessive adjectives?','los adjetivos posesivos','señalar a quién pertenece el sustantivo que acompañan','cambia el poseedor de la pertenencia expresada'),
 feature('interrogative-pronouns','pronombres? interrogativos?|interrogative pronouns?','los pronombres interrogativos','preguntar por la persona, cosa o lugar que se necesita conocer','pregunta por una información distinta de la que se quiere solicitar'),
 feature('object-pronouns','pronombres? objeto|object pronouns?','los pronombres objeto','señalar a quién se dirige o afecta la acción','atribuye la acción al receptor equivocado'),
 feature('possessive-pronouns','pronombres? posesivos?|possessive pronouns?','los pronombres posesivos','identificar una pertenencia y su poseedor sin repetir el sustantivo','sustituye la pertenencia de modo que se atribuye a otro poseedor'),
 feature('time-prepositions','preposiciones? de tiempo|prepositions? of time','las preposiciones de tiempo','situar el hecho en la hora, fecha o período indicado','sitúa el hecho en una referencia temporal diferente'),
 feature('place-prepositions','preposiciones? de lugar|prepositions? of place','las preposiciones de lugar','situar un elemento respecto a otro en el espacio','cambia la relación espacial entre los elementos'),
 feature('time-adverbs','adverbios? de tiempo|adverbs? of time','los adverbios de tiempo','indicar cuándo ocurre la acción','desplaza la acción a un momento distinto del indicado'),
 feature('frequency-adverbs','adverbios? de frecuencia|adverbs? of frequency','los adverbios de frecuencia','expresar con qué frecuencia ocurre una acción','confunde una acción habitual con una ocasional o inexistente'),
 feature('manner-adverbs','adverbios? de modo|adverbs? of manner','los adverbios de modo','precisar cómo se realiza una acción','altera la manera en que se realiza la acción descrita'),
 feature('degree-adverbs','adverbios? de intensidad|adverbs? of (?:degree|intensity)','los adverbios de intensidad','graduar la intensidad de una característica o acción','cambia el grado de intensidad que se pretende expresar'),
 feature('certainty-adverbs','adverbios? de certeza|adverbs? of certainty','los adverbios de certeza','expresar el grado de seguridad de una afirmación','presenta una posibilidad como una certeza o una certeza como una duda'),
 feature('coordination-connectors','conectores? de coordinacion|coordinating conjunctions?','los conectores de coordinación','unir, contrastar o presentar alternativas entre ideas','confunde suma, contraste y alternativa entre las ideas'),
 feature('time-connectors','conectores? de tiempo|temporal connectors?','los conectores de tiempo','relacionar los momentos en que ocurren las acciones','invierte la relación de anterioridad o posterioridad de las acciones'),
 feature('sequence-connectors','conectores? de secuencia|sequence connectors?','los conectores de secuencia','ordenar pasos o acontecimientos','cambia el orden necesario para seguir los pasos o acontecimientos'),
 feature('cause-connectors','conectores? de causa(?: y consecuencia)?|conectores? de consecuencia|cause and effect connectors?','los conectores de causa y consecuencia','relacionar un hecho con su causa o su consecuencia','invierte o confunde la causa y la consecuencia de los hechos'),
]

const terms:Record<string,Array<[string,string]>>={
 'preference-verbs':[['\\blike\\b','el verbo like'],['\\bprefer\\b','el verbo prefer'],['\\benjoy\\b','el verbo enjoy']],
 future:[['\\bwill\\b','will'],['\\bbe going to\\b','be going to']],
 'declining-forms':[['\\bcan t\\b|\\bcannot\\b','can’t'],['\\bhave to\\b','have to']],
 articles:[['\\bdefinidos?\\b|\\bdefinite\\b','los artículos definidos'],['\\bindefinidos?\\b|\\bindefinite\\b','los artículos indefinidos']],
 comparative:[['\\bcomparativos?\\b|\\bcomparative\\b','el grado comparativo'],['\\bsuperlativos?\\b|\\bsuperlative\\b','el grado superlativo']],
}
export const englishGradeOneGrammar=grammar.map(f=>({...f,...(terms[f.id]?{terms:terms[f.id]}:{})}))
export function requestedEnglishGrammar(text:string){
 let expanded=text
 for(const [category,names] of [
  ['adverbios?','tiempo|frecuencia|modo|intensidad|certeza'],
  ['preposiciones?','tiempo|lugar'],
  ['conectores?','coordinacion|tiempo|secuencia|causa|consecuencia'],
 ])expanded=expanded.replace(new RegExp(`\\b(${category}) de ((?:${names})(?:\\s+(?:y\\s+)?(?:${names}))*)\\b`,'g'),(_,label:string,items:string)=>items.split(/\s+(?:y\s+)?/).map(item=>`${label} de ${item}`).join(' y '))
 return requestedLanguageFeatures(englishGradeOneGrammar,expanded)
}

export function englishGrammarCriterion(feature:LanguageFeature,text:string,mode:string):ContextualTopicCriterion{
 const receptive=mode==='reading'||mode==='listening'
 const source=mode==='listening'?'mensaje escuchado':'texto disponible'
 const explain=/\b(?:explic\w*|justific\w*|funcion|relacion\w*)\b/.test(text)
 const target=feature.name,purpose=feature.function
 const ofTarget=target.startsWith('el ')?`del ${target.slice(3)}`:`de ${target}`
 const levels:ContextualTopicCriterion['progressionLevels']=receptive?[
  `Identifica ${target} en el ${source} en inglés${explain?` y explica cómo permite ${purpose}`:''}.`,
  `Localiza ejemplos pertinentes ${ofTarget}${explain?'; una relación entre la forma y su función necesita precisión':'; una identificación aislada necesita precisión'}.`,
  `Localiza algunos ejemplos ${ofTarget}, pero confunde otros${explain?' y no relaciona sus usos con la función solicitada':''}.`,
  `Interpreta incorrectamente la estructura: ${feature.error}.`,
  `No localiza ejemplos pertinentes ${ofTarget} en el ${source}.`,
 ]:[
  `Emplea ${target} en el mensaje en inglés para ${purpose}.`,
  `La estructura permite ${purpose}; un uso aislado necesita revisión.`,
  `Incluye ejemplos ${ofTarget}, pero varios usos no permiten ${purpose}.`,
  `El uso de la estructura cambia el sentido: ${feature.error}.`,
  `No aporta usos reconocibles ${ofTarget} para el propósito solicitado.`,
 ]
 return {templateId:`ing-1-feature-${feature.id}`,title:target.charAt(0).toUpperCase()+target.slice(1),observable:levels[0],weight:3,progressionLevels:levels}
}
