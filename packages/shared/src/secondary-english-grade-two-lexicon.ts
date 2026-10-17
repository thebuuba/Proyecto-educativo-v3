import {affirmativeLanguageTask,requestedLanguageFeatures} from './language-feature-criteria'
import {englishGradeOneLexicon,englishLexicalCriterion,type LexicalFeature} from './secondary-english-grade-one-lexicon'

const word=(id:string,match:string,name:string,purpose:string,error:string):LexicalFeature=>({id,match:`\\b(?:${match})\\b`,name,function:purpose,error,category:'vocabulary'})
const expression=(id:string,match:string,name:string,purpose:string,error:string):LexicalFeature=>({...word(id,match,name,purpose,error),category:'expression'})
/** PDF140–142. Shared word families have the same lexical evidence, but the list
 * is restricted to grade two; medicines/moods assess meanings in a provided task,
 * never the learner's own health, personality or possessions.
 */
const commonIds=['celebrations','food','weather-words','sports','transport','cardinal','ordinal','jobs','body','compass','excuse','dates','hours']
export const englishGradeTwoLexicon:LexicalFeature[]=[
 ...englishGradeOneLexicon.filter(f=>commonIds.includes(f.id)),
 word('daily','actividades de la vida diaria|actividades (?:diarias|cotidianas)|daily activities','actividades de la vida diaria','nombrar la acción cotidiana del referente','confunde la acción de la jornada comunicada'),
 word('leisure','actividades de tiempo libre(?: y ocio)?|actividades de ocio|leisure activities','actividades de tiempo libre y ocio','nombrar la actividad de ocio indicada','cambia la actividad recreativa mencionada'),
 word('subjects','asignaturas|school subjects','asignaturas','identificar la asignatura mencionada','atribuye a la asignatura un nombre de otra materia'),
 word('money','dinero|money','dinero','comunicar la moneda o forma de pago indicada en la situación','confunde la moneda, el cambio o el medio de pago mencionado'),
 word('ailments','dolencias(?: y enfermedades)?|enfermedades|ailments|illnesses','dolencias y enfermedades','nombrar la dolencia del personaje o situación suministrada','atribuye a la situación una dolencia distinta de la mencionada'),
 word('education','educacion|education','educación','nombrar el nivel o contexto educativo indicado','cambia el nivel o contexto educativo del mensaje'),
 word('shops','establecimientos comerciales|tiendas|shops','establecimientos comerciales','identificar el comercio nombrado','confunde el establecimiento con otro tipo de comercio'),
 word('moods','estados de animo|moods','estados de ánimo','nombrar el estado del personaje o referente descrito','atribuye al referente un estado diferente del mensaje'),
 word('life-events','eventos de la vida|life events','eventos de la vida','nombrar el acontecimiento del personaje o relato dado','cambia el acontecimiento mencionado en el relato'),
 word('interaction-channels','formas de interaccion|canales de interaccion|interaction channels','formas de interacción','identificar el canal por el que se comunica el mensaje','confunde el canal escrito, de voz u otro canal indicado'),
 word('places','lugares|places','lugares','nombrar el lugar indicado en el mensaje','sitúa el referente en un lugar diferente del comunicado'),
 word('medicines','medicamentos|medicines','medicamentos','reconocer el nombre del producto mencionado en la situación dada','confunde el producto nombrado con otro medicamento'),
 word('relationships','relaciones humanas|human relationships','relaciones humanas','comunicar la relación entre los personajes o referentes dados','atribuye entre los referentes una relación distinta'),
 word('physical-sensations','sensaciones fisicas|physical sensations','sensaciones físicas','nombrar la sensación del personaje o situación dada','confunde la sensación que expresa el mensaje'),
 word('sizes','tallas|sizes','tallas','precisar la talla del producto indicado','comunica una talla distinta de la solicitada'),
 word('technology','tecnologia|technology','tecnología','nombrar el dispositivo o servicio tecnológico del mensaje','confunde el dispositivo o servicio con otro referente'),
 word('roads','vias|vias de circulacion|roads','vías','nombrar la vía de circulación indicada','confunde calle, avenida u otra vía del recorrido'),
 expression('courtesy','mostrar cortesia|expresiones de cortesia|formulas de cortesia','mostrar cortesía','comunicar el trato cortés en la situación indicada','la fórmula elegida cambia la intención de agradecimiento o trato solicitado'),
 expression('attention','captar la atencion|atraer la atencion|llamar la atencion','captar la atención','llamar al interlocutor antes de comunicarle el mensaje','no permite reconocer a quién se llama en el intercambio'),
 expression('interruption','interrumpir (?:con cortesia|cortesmente)|interrupcion cortes','interrumpir con cortesía','solicitar una interrupción relacionada con el intercambio','la fórmula cambia la solicitud por una intervención ajena al intercambio'),
 expression('turns','pedir y dar la palabra|pedir la palabra|dar la palabra|tomar el turno|ceder el turno','pedir o dar la palabra según lo solicitado','regular el turno de intervención','pide tomar el turno cuando corresponde cederlo o lo contrario'),
 expression('repetition','pedir que repitan|pedir repeticion|solicitar repeticion','pedir que repitan','solicitar repetición de la información que necesita aclaración','la solicitud no permite reconocer qué información se pide repetir'),
 expression('uncertainty','expresar duda|dudar|uncertainty','expresar duda','distinguir una posibilidad de una afirmación confirmada','comunica como seguro lo que el referente considera dudoso'),
 expression('empathy','mostrar interes(?: o empatia)?|mostrar empatia|expresiones de empatia','mostrar interés o empatía','responder a la situación comunicada con una expresión de interés o apoyo','la respuesta se refiere a otro asunto y no reconoce la situación comunicada'),
 expression('indifference','mostrar indiferencia(?: o desinteres)?|mostrar desinteres','mostrar indiferencia o desinterés','expresar que la elección no modifica la preferencia comunicada','expresa interés o rechazo cuando pretende comunicar indiferencia'),
 expression('agreement','mostrar acuerdo(?: y desacuerdo)?|mostrar desacuerdo|expresar acuerdo|expresar desacuerdo','mostrar acuerdo o desacuerdo según lo solicitado','comunicar su respuesta a la idea del interlocutor','expresa lo contrario del acuerdo o desacuerdo que pretende comunicar'),
 expression('desire','expresar deseos|expresiones de deseos','expresar deseos','comunicar la esperanza o el deseo indicado en la situación','presenta como confirmado el resultado que solo se desea'),
]
export function requestedGradeTwoLexicon(description:string){
 const text=affirmativeLanguageTask(description)
 const lexical=/\b(?:vocabulario|lexico|palabras|terminos)\b/.test(text)
 return requestedLanguageFeatures(englishGradeTwoLexicon.filter(f=>f.category==='expression'||lexical),text).map(f=>({...f,category:englishGradeTwoLexicon.find(original=>original.id===f.id)!.category}))
}
export const gradeTwoLexicalCriterion=(f:LexicalFeature,text:string,mode:string)=>englishLexicalCriterion(f,text,['analysis','comparison'].includes(mode)?'reading':mode,'ing-2',f.category)
