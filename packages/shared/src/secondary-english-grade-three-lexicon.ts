import {requestedLanguageFeatures} from './language-feature-criteria'
import {englishGradeOneLexicon,englishLexicalCriterion,type LexicalFeature} from './secondary-english-grade-one-lexicon'
import {englishGradeTwoLexicon} from './secondary-english-grade-two-lexicon'
import {affirmativeScopedEnglishTask} from './secondary-english-task-text'
const word=(id:string,match:string,name:string,purpose:string,error:string):LexicalFeature=>({id,match:`\\b(?:${match})\\b`,name,function:purpose,error,category:'vocabulary'})
const expression=(id:string,match:string,name:string,purpose:string,error:string):LexicalFeature=>({...word(id,match,name,purpose,error),category:'expression'})
/** PDF146–147: nineteen lexical families and five expressive intentions.
 * Shared meanings are retained only when the third-grade list contains them;
 * school contexts, contingencies and household objects have their own evidence. */
export const englishGradeThreeLexicon:LexicalFeature[]=[
 ...englishGradeOneLexicon.filter(f=>['celebrations','weather-words','sports','jobs'].includes(f.id)),
 ...englishGradeTwoLexicon.filter(f=>['daily','leisure','moods','places','relationships','technology'].includes(f.id)),
 word('school-activities','actividades escolares|school activities','actividades escolares','nombrar la acción de aprendizaje o trabajo escolar indicada','confunde la actividad escolar con una acción distinta'),
 word('school','escuela|school vocabulary','escuela','nombrar el espacio, documento o referente escolar mencionado','confunde un espacio o documento escolar con otro referente'),
 word('contingencies','eventualidades|contratiempos|contingencies','eventualidades','nombrar el acontecimiento imprevisto del personaje o situación dada','atribuye al personaje un contratiempo distinto del relato'),
 word('environment','medio ambiente|medioambiente|environment','medio ambiente','nombrar el proceso o problema ambiental comunicado en el texto','cambia el proceso o problema ambiental mencionado'),
 word('media','medios de comunicacion|communication media','medios de comunicación','identificar el medio por el que se transmite la información indicada','confunde el canal de comunicación mencionado con otro medio'),
 word('home-objects','objetos del hogar(?: y el entorno)?|household objects','objetos del hogar y el entorno','nombrar el objeto del lugar o situación proporcionados','atribuye al objeto un nombre o uso diferente del mensaje'),
 word('social-problems','problematicas sociales|problemas sociales|social problems','problemáticas sociales','nombrar el problema social de la situación o personajes ficticios','atribuye a la situación un problema distinto del descrito'),
 word('recipes','recetas de cocina|cooking recipes','recetas de cocina','nombrar el ingrediente, utensilio o acción culinaria mencionados','confunde la acción o ingrediente de la receta proporcionada'),
 word('traffic-signs','senales de transito|traffic signs','señales de tránsito','reconocer la indicación que comunica la señal mencionada','interpreta como permitida una acción que la señal prohíbe o lo contrario'),
 expression('opinion','opinar|expresar opiniones|expresiones de opinion','opinar','comunicar el punto de vista solicitado distinguiéndolo de un hecho','la expresión atribuye certeza factual a un punto de vista o cambia su sentido'),
 expression('agreement','mostrar acuerdo(?: o desacuerdo)?|mostrar desacuerdo|expresar acuerdo|expresar desacuerdo','mostrar acuerdo o desacuerdo según lo solicitado','comunicar su posición respecto de lo dicho por el interlocutor','expresa desacuerdo cuando corresponde acuerdo o lo contrario'),
 expression('reaction','reaccionar|expresar una reaccion|expresiones de reaccion','reaccionar','responder al acontecimiento con la reacción comunicativa solicitada','la fórmula expresa una reacción incompatible con el acontecimiento dado'),
 expression('explanations','solicitar explicaciones|pedir explicaciones','solicitar explicaciones','pedir el motivo o explicación del hecho indicado','la pregunta solicita información diferente del motivo que se necesita aclarar'),
 expression('warning','advertir|expresiones de advertencia','advertir','alertar al interlocutor sobre el riesgo indicado en la situación','la expresión no comunica el riesgo o cambia el sentido de la advertencia'),
]
export function requestedGradeThreeLexicon(description:string){
 const text=affirmativeScopedEnglishTask(description),lexical=/\b(?:vocabulario|lexico|palabras|terminos)\b/.test(text)
 return requestedLanguageFeatures(englishGradeThreeLexicon.filter(f=>f.category==='expression'||lexical),text).map(f=>({...f,category:englishGradeThreeLexicon.find(original=>original.id===f.id)!.category}))
}
export const gradeThreeLexicalCriterion=(f:LexicalFeature,text:string,mode:string)=>englishLexicalCriterion(f,text,['analysis','comparison','research'].includes(mode)?'reading':mode,'ing-3',f.category)
