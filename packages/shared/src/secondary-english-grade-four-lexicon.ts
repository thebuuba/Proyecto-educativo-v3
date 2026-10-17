import {requestedLanguageFeatures} from './language-feature-criteria'
import {englishLexicalCriterion,type LexicalFeature} from './secondary-english-grade-one-lexicon'
import {englishGradeThreeLexicon} from './secondary-english-grade-three-lexicon'
import {affirmativeScopedEnglishTask} from './secondary-english-task-text'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {combineEnglishFeatureAlternatives} from './secondary-english-grammar'
const word=(id:string,match:string,name:string,purpose:string,error:string):LexicalFeature=>({id,match:`\\b(?:${match})\\b`,name,function:purpose,error,category:'vocabulary'})
const expression=(id:string,match:string,name:string,purpose:string,error:string):LexicalFeature=>({...word(id,match,name,purpose,error),category:'expression'})
/** PDF158–159: fifteen vocabulary records and thirteen expressive records;
 * interest/amazement and asking/giving opinions are separate intentions. */
export const englishGradeFourLexicon:LexicalFeature[]=[
 ...englishGradeThreeLexicon.filter(f=>['sports','contingencies','places','technology'].includes(f.id)),
 word('events-celebrations','acontecimientos y celebraciones|acontecimientos|celebraciones|events and celebrations','acontecimientos y celebraciones solicitados','nombrar el acontecimiento o celebración del referente indicado','confunde el acontecimiento o celebración del ejemplo'),
 word('communication','comunicacion|communication vocabulary','comunicación','nombrar el canal o interacción de comunicación indicado','confunde el canal o la interacción de comunicación de la situación'),
 word('education','educacion|education vocabulary','educación','nombrar el nivel, oportunidad o referente educativo indicado','atribuye al referente otra oportunidad o nivel educativo'),
 word('kitchen-equipment','equipos y utensilios de cocina|utensilios de cocina|kitchen equipment','equipos y utensilios de cocina','nombrar el equipo o utensilio de la situación culinaria indicada','confunde el equipo o utensilio mencionado con otro referente'),
 word('experiences','experiencias personales|personal experiences','experiencias de los referentes indicados','nombrar la experiencia del personaje o referente indicado','atribuye al referente una experiencia distinta de la comunicada'),
 word('natural-phenomena','fenomenos naturales|natural phenomena','fenómenos naturales','nombrar el fenómeno natural mencionado en la situación','confunde el fenómeno natural de la información proporcionada'),
 word('tools','herramientas|tools vocabulary','herramientas','nombrar la herramienta y su referencia en la situación proporcionada','confunde la herramienta indicada con otra'),
 word('transport','medios de transporte|means of transport','medios de transporte','nombrar el medio de transporte indicado','cambia el medio de transporte del mensaje'),
 word('food-preparation','preparacion de alimentos|food preparation','preparación de alimentos','nombrar la acción culinaria indicada y su relación con la preparación','confunde la acción culinaria y cambia la preparación comunicada'),
 word('recreation','recreacion|actividades recreativas|recreation','recreación','nombrar la actividad recreativa indicada','confunde la actividad recreativa mencionada con otra'),
 word('travel','viajes?|travel vocabulary','viaje','nombrar la acción, objeto o servicio del viaje indicado','cambia la acción, objeto o servicio del viaje comunicado'),
 expression('attention','atraer la atencion|llamar la atencion','atraer la atención','llamar al interlocutor antes de comunicar el mensaje','la fórmula no permite reconocer a quién se llama o para qué se inicia el contacto'),
 expression('encouragement','animar a alguien|dar animo','animar a alguien','comunicar ánimo relacionado con la situación o actuación del referente','la fórmula expresa una intención distinta del ánimo solicitado'),
 expression('interest','expresar interes|mostrar interes','expresar interés','comunicar una reacción de interés relacionada con lo dicho por el interlocutor','la reacción cambia el asunto o expresa una intención incompatible con la situación'),
 expression('amazement','expresar asombro|mostrar asombro','expresar asombro','comunicar una reacción de asombro relacionada con el hecho indicado','la fórmula comunica una reacción incompatible con el acontecimiento'),
 expression('empathy','mostrar empatia|expresar empatia','mostrar empatía','responder a la situación comunicada por el personaje con una expresión de apoyo pertinente','la expresión contradice o descalifica la situación comunicada'),
 expression('ask-opinion','(?:pedir(?:an)?|pidan|solicitar(?:an)?) (?:una |las )?opinion(?:es)?','pedir opiniones','solicitar el punto de vista del interlocutor sobre el asunto indicado','la pregunta pide otra información o atribuye al interlocutor un punto de vista no expresado'),
 expression('opinion','dar opinion(?:es)?|expresar opinion(?:es)?','dar opiniones','comunicar el punto de vista sobre el asunto indicado','presenta una opinión ajena como propia o cambia su sentido'),
 expression('agreement','expresar acuerdo(?: y desacuerdo)?|expresar desacuerdo','expresar acuerdo o desacuerdo según lo solicitado','comunicar su posición respecto de lo dicho por el interlocutor','invierte el acuerdo y el desacuerdo de la respuesta indicada'),
 expression('coincidence','coincidir(?: y discrepar)?|discrepar','coincidir o discrepar según lo solicitado','relacionar la respuesta de coincidencia o discrepancia con la afirmación del interlocutor','invierte la coincidencia o discrepancia o la polaridad de la afirmación'),
 expression('clarification','pedir repeticion(?: o aclaracion)?|pedir aclaracion|solicitar repeticion|solicitar aclaracion','pedir repetición o aclaración según lo solicitado','solicitar la repetición o aclaración de la parte del mensaje que necesita comprender','la petición no permite localizar qué parte del mensaje necesita aclarar'),
 expression('change-topic','cambiar de tema','cambiar de tema','señalar la transición hacia el nuevo asunto solicitado','la fórmula no permite reconocer la transición o introduce otro asunto'),
 expression('close-conversation','concluir una conversacion|cerrar una conversacion','concluir una conversación','cerrar el intercambio con una fórmula pertinente para la situación','la fórmula abre otro intercambio cuando corresponde concluirlo'),
 expression('news','dar una noticia|comunicar una noticia','dar una noticia','introducir el acontecimiento nuevo que se comunica al interlocutor','la fórmula no permite reconocer que se introduce una noticia'),
 expression('excuse','excusarse|disculparse','excusarse','comunicar una disculpa relacionada con la situación indicada','la fórmula no permite reconocer la disculpa solicitada'),
 expression('congratulations','felicitar','felicitar','comunicar una felicitación relacionada con el acontecimiento del referente indicado','la fórmula expresa otra intención o se refiere a otro acontecimiento'),
]
/** A named vocabulary/expression object is studied as language; it does not
 * silently become a second required communicative product. */
const expandedGradeFourExpressions=(text:string)=>text.replace(/\b(expresar|mostrar) interes (y|o) asombro\b/g,'$1 interes $2 $1 asombro').replace(/\bpedir (y|o) dar opiniones\b/g,'pedir opiniones $1 dar opiniones')
export function withoutGradeFourLexicalTargets(raw:string){
 let text=expandedGradeFourExpressions(raw)
 for(const category of ['vocabulary','expression']){
  const cue=category==='vocabulary'?'(?:vocabulario|lexico|palabras|terminos) de':'expresiones para'
  const forms=englishGradeFourLexicon.filter(f=>f.category===category).map(f=>f.match).join('|')
  text=text.replace(new RegExp(`\\b${cue} (?:${forms})(?:\\s+(?:y|o)\\s+(?:${forms}))*`,'g'),' ')
 }
 return text
}
export function requestedGradeFourLexicon(description:string){
 const text=expandedGradeFourExpressions(affirmativeScopedEnglishTask(description)),lexical=/\b(?:vocabulario|lexico|palabras|terminos)\b/.test(text)
 const selected=requestedLanguageFeatures(englishGradeFourLexicon.filter(f=>f.category==='expression'||lexical),text).map(f=>({...f,category:englishGradeFourLexicon.find(original=>original.id===f.id)!.category}))
 return combineEnglishFeatureAlternatives(text,selected).map(f=>{
  if(f.id==='agreement'&&/expresar acuerdo y desacuerdo/.test(text))return {...f,name:'expresar acuerdo y desacuerdo en los casos solicitados'}
  if(f.id==='coincidence'&&/coincidir y discrepar/.test(text))return {...f,name:'coincidir y discrepar en los casos solicitados'}
  return f
 })
}
export function gradeFourLexicalCriterion(f:LexicalFeature,text:string,mode:string):ContextualTopicCriterion{
 const c=englishLexicalCriterion(f,text,['analysis','comparison','research'].includes(mode)?'reading':mode,'ing-4',f.category)
 if(mode!=='comparison')return c
 const target=`${f.category==='expression'?'las expresiones para':'el vocabulario de'} ${f.name}`
 const levels:NonNullable<ContextualTopicCriterion['progressionLevels']>=[
  `Contrasta ${target} en los textos en inglés, relacionando sus ejemplos con el significado y la función de ${f.function}.`,
  'Localiza ejemplos pertinentes y establece un contraste; una relación con el significado necesita precisión.',
  'Enumera palabras o expresiones de los textos, pero no establece la semejanza o diferencia de sus usos.',
  `El contraste atribuye a las palabras o expresiones un significado incorrecto: ${f.error}.`,
  `No aporta ejemplos pertinentes de los textos que permitan contrastar ${target}.`,
 ]
 return {...c,observable:levels[0],progressionLevels:levels}
}
