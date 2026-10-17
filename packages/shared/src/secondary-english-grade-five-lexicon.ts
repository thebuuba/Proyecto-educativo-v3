import {requestedLanguageFeatures} from './language-feature-criteria'
import {englishLexicalCriterion,type LexicalFeature} from './secondary-english-grade-one-lexicon'
import {affirmativeScopedEnglishTask} from './secondary-english-task-text'
import {combineEnglishFeatureAlternatives} from './secondary-english-grammar'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
/** PDF163–164:22 vocabulary families and7 intentions in2 compound expression records. */
export const englishGradeFiveLexicon:LexicalFeature[]=[
 {"id": "events", "match": "\\b(?:acontecimientos)\\b", "name": "acontecimientos", "function": "relacionar el acontecimiento con el referente y momento indicados", "error": "confunde el acontecimiento comunicado con otro", "category": "vocabulary"},
 {"id": "activities", "match": "\\b(?:actividades)\\b", "name": "actividades", "function": "relacionar la acción indicada y su relación con el referente de la situación", "error": "atribuye al referente una actividad distinta", "category": "vocabulary"},
 {"id": "goods-services", "match": "\\b(?:bienes y servicios|goods and services)\\b", "name": "bienes y servicios", "function": "relacionar el bien o servicio con la necesidad indicada en la transacción", "error": "confunde un bien con otro servicio o cambia lo solicitado", "category": "vocabulary"},
 {"id": "qualifiers", "match": "\\b(?:calificativos)\\b", "name": "calificativos", "function": "relacionar la intensidad o característica expresada por el calificativo en la situación", "error": "cambia la característica o la gravedad comunicada", "category": "vocabulary"},
 {"id": "money-payment", "match": "\\b(?:dinero y formas de pago)\\b", "name": "dinero y formas de pago", "function": "relacionar el importe o medio de pago con la transacción proporcionada", "error": "atribuye a la transacción otro importe o medio de pago", "category": "vocabulary"},
 {"id": "education", "match": "\\b(?:educacion)\\b", "name": "educación", "function": "relacionar el nivel, curso o institución educativa de la información dada", "error": "cambia el nivel o institución educativa del referente", "category": "vocabulary"},
 {"id": "narrative-elements", "match": "\\b(?:elementos de (?:una |la )?narracion|narrative elements)\\b", "name": "elementos de una narración", "function": "relacionar el personaje, trama o ambiente solicitado con su papel en la narración", "error": "confunde el personaje, trama o ambiente del ejemplo", "category": "vocabulary"},
 {"id": "symptoms", "match": "\\b(?:enfermedades y sintomas)\\b", "name": "enfermedades y síntomas", "function": "relacionar el síntoma o enfermedad nombrados en la ficha del personaje ficticio", "error": "atribuye al personaje otro síntoma o enfermedad", "category": "vocabulary"},
 {"id": "office-equipment", "match": "\\b(?:equipos y materiales de oficina)\\b", "name": "equipos y materiales de oficina", "function": "relacionar el equipo o material con la acción de oficina indicada", "error": "confunde el equipo y el material mencionados", "category": "vocabulary"},
 {"id": "medical-specialties", "match": "\\b(?:especialidades medicas)\\b", "name": "especialidades médicas", "function": "relacionar la especialidad mencionada en la información de la consulta simulada", "error": "confunde la especialidad nombrada con otra", "category": "vocabulary"},
 {"id": "establishments", "match": "\\b(?:establecimientos)\\b", "name": "establecimientos", "function": "relacionar el establecimiento con el servicio o referente de la situación", "error": "atribuye el servicio a otro establecimiento", "category": "vocabulary"},
 {"id": "organized-events", "match": "\\b(?:eventos)\\b", "name": "eventos", "function": "relacionar el evento con la información proporcionada de su realización", "error": "confunde el evento o su referente", "category": "vocabulary"},
 {"id": "contingencies", "match": "\\b(?:eventualidades)\\b", "name": "eventualidades", "function": "relacionar el contratiempo del personaje con lo ocurrido en la situación", "error": "atribuye al personaje otro contratiempo", "category": "vocabulary"},
 {"id": "places-monuments", "match": "\\b(?:lugares y monumentos)\\b", "name": "lugares y monumentos", "function": "relacionar el lugar o monumento con la referencia de la información dada", "error": "confunde el lugar o monumento mencionado", "category": "vocabulary"},
 {"id": "medicines", "match": "\\b(?:medicamentos)\\b", "name": "medicamentos", "function": "relacionar el medicamento nombrado en los datos de una situación ficticia, sin recomendar tratamientos", "error": "cambia el nombre comunicado en la ficha", "category": "vocabulary"},
 {"id": "measurements", "match": "\\b(?:medidas)\\b", "name": "medidas", "function": "relacionar la magnitud y unidad solicitadas con el dato de la situación", "error": "cambia la unidad o atribuye otra magnitud al dato", "category": "vocabulary"},
 {"id": "personal-objects", "match": "\\b(?:objetos personales)\\b", "name": "objetos personales", "function": "relacionar el objeto con el referente indicado en la situación ficticia", "error": "atribuye otro objeto o poseedor a la información", "category": "vocabulary"},
 {"id": "body-parts", "match": "\\b(?:partes del cuerpo)\\b", "name": "partes del cuerpo", "function": "relacionar la parte del cuerpo mencionada con el personaje de la ficha", "error": "atribuye al síntoma o dato otra parte del cuerpo", "category": "vocabulary"},
 {"id": "famous-people", "match": "\\b(?:personajes celebres)\\b", "name": "personajes célebres", "function": "relacionar la persona mencionada con los datos de su referencia proporcionada", "error": "atribuye a una persona los datos de otra", "category": "vocabulary"},
 {"id": "medical-procedures", "match": "\\b(?:procedimientos medicos)\\b", "name": "procedimientos médicos", "function": "relacionar el procedimiento nombrado con los datos de la consulta ficticia, sin ejecutarlo ni indicarlo como tratamiento", "error": "confunde el procedimiento comunicado en la ficha", "category": "vocabulary"},
 {"id": "reporting-verbs", "match": "\\b(?:reportar informacion)\\b", "name": "reportar información", "function": "relacionar quién comunica la información con la acción de decir, contar o explicar solicitada", "error": "atribuye la información a otra persona o cambia cómo se comunica", "category": "vocabulary"},
 {"id": "transactions", "match": "\\b(?:transacciones)\\b", "name": "transacciones", "function": "relacionar la acción de compra, alquiler o depósito solicitada con sus referentes", "error": "cambia la operación o su referente", "category": "vocabulary"},
 {"id": "encouragement", "match": "\\b(?:animar(?: y motivar)?|motivar|dar animo)\\b", "name": "animar y motivar", "function": "comunicar ánimo relacionado con la situación o actuación del referente", "error": "la expresión comunica una intención incompatible con el ánimo solicitado", "category": "expression"},
 {"id": "confirmation", "match": "\\b(?:confirmar informacion)\\b", "name": "confirmar información", "function": "confirmar la información comunicada por el interlocutor o solicitar su confirmación según la intención indicada", "error": "confirma información diferente o atribuye al interlocutor otra afirmación", "category": "expression"},
 {"id": "date", "match": "\\b(?:expresar (?:una |la )?fecha|fechas?)\\b", "name": "expresar una fecha", "function": "comunicar la fecha de la situación con el día, mes o año solicitados", "error": "cambia una referencia de la fecha indicada", "category": "expression"},
 {"id": "time", "match": "\\b(?:expresar (?:una |la )?hora|horas?)\\b", "name": "expresar la hora", "function": "comunicar la hora indicada con sus referencias temporales", "error": "cambia la hora de la situación comunicada", "category": "expression"},
 {"id": "courtesy", "match": "\\b(?:expresarse con cortesia|formulas de cortesia)\\b", "name": "expresarse con cortesía", "function": "comunicar la intención solicitada mediante una fórmula cortés pertinente para el interlocutor", "error": "la expresión comunica un trato o intención incompatible con la situación", "category": "expression"},
 {"id": "offer-help", "match": "\\b(?:ofrecer(?:an)? ayuda)\\b", "name": "ofrecer ayuda", "function": "ofrecer apoyo relacionado con la necesidad comunicada por el interlocutor", "error": "ofrece una acción que no responde a la necesidad indicada", "category": "expression"},
 {"id": "ask-help", "match": "\\b(?:pedir(?:an)? ayuda|solicitar(?:an)? ayuda|pidan ayuda)\\b", "name": "pedir ayuda", "function": "solicitar la ayuda pertinente precisando la necesidad o parte del mensaje que requiere apoyo", "error": "la solicitud pide otro apoyo o no permite reconocer la necesidad", "category": "expression"},
]
const expand=(text:string)=>text.replace(/ofrecer (y|o) pedir ayuda/g,'ofrecer ayuda $1 pedir ayuda')
export function withoutGradeFiveLexicalTargets(raw:string){
 let text=expand(raw)
 for(const category of ['vocabulary','expression']){
  const cue=category==='vocabulary'?'(?:vocabulario|lexico|palabras|terminos) de':'expresiones para'
  const forms=englishGradeFiveLexicon.filter(f=>f.category===category).map(f=>f.match).join('|')
  text=text.replace(new RegExp(`\\b${cue} (?:${forms})(?:\\s+(?:y|o)\\s+(?:${forms}))*`,'g'),' ')
 }
 return text
}
export function requestedGradeFiveLexicon(description:string){
 const text=expand(affirmativeScopedEnglishTask(description)),lexical=/\b(?:vocabulario|lexico|palabras|terminos)\b/.test(text)
 const selected=requestedLanguageFeatures(englishGradeFiveLexicon.filter(f=>f.category==='expression'||lexical),text).filter(f=>!['date','time'].includes(f.id)||/expresiones para/.test(text)||/\b(?:expres\w*|comunic\w*|decir\w*|indic\w*) (?:una |la )?(?:fecha|hora)\b/.test(text)).map(f=>({...f,category:englishGradeFiveLexicon.find(original=>original.id===f.id)!.category}))
 return combineEnglishFeatureAlternatives(text,selected)
}
export function gradeFiveLexicalCriterion(f:LexicalFeature,text:string,mode:string,scope='ing-5'):ContextualTopicCriterion{
 const c=englishLexicalCriterion(f,text,['analysis','comparison','research'].includes(mode)?'reading':mode,scope,f.category)
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
