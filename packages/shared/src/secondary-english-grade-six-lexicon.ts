import {requestedLanguageFeatures} from './language-feature-criteria'
import type {LexicalFeature} from './secondary-english-grade-one-lexicon'
import {gradeFiveLexicalCriterion} from './secondary-english-grade-five-lexicon'
import {affirmativeScopedEnglishTask} from './secondary-english-task-text'
import {combineEnglishFeatureAlternatives} from './secondary-english-grammar'
/** PDF170: seventeen own vocabulary families and four expressive intentions. */
export const englishGradeSixLexicon:LexicalFeature[]=[
 {"id": "art", "match": "\\b(?:arte)\\b", "name": "arte", "function": "relacionar la manifestación artística indicada con su referencia en la situación", "error": "confunde la manifestación artística con otra", "category": "vocabulary"},
 {"id": "qualifiers", "match": "\\b(?:calificativos)\\b", "name": "calificativos", "function": "relacionar la valoración o característica expresada con el referente del ejemplo", "error": "atribuye al referente otra valoración o característica", "category": "vocabulary"},
 {"id": "celebrations", "match": "\\b(?:celebraciones)\\b", "name": "celebraciones", "function": "relacionar la celebración con los datos culturales del ejemplo proporcionado", "error": "confunde la celebración mencionada o su referente", "category": "vocabulary"},
 {"id": "citizenship", "match": "\\b(?:civismo y ciudadania)\\b", "name": "civismo y ciudadanía", "function": "relacionar el derecho, responsabilidad o norma nombrados con su referente en los ejemplos", "error": "confunde un derecho, responsabilidad o norma con otro", "category": "vocabulary"},
 {"id": "communication", "match": "\\b(?:comunicacion)\\b", "name": "comunicación", "function": "relacionar el medio o forma de comunicación con la situación indicada", "error": "confunde el canal o la forma de comunicación", "category": "vocabulary"},
 {"id": "culture", "match": "\\b(?:cultura)\\b", "name": "cultura", "function": "relacionar el término cultural con la identidad o práctica del ejemplo, sin generalizar a todas las personas", "error": "atribuye al ejemplo un significado cultural diferente", "category": "vocabulary"},
 {"id": "copyright", "match": "\\b(?:derecho de autor)\\b", "name": "derecho de autor", "function": "relacionar la autoría o el uso atribuido a la obra del ejemplo proporcionado", "error": "confunde autoría, atribución y copia en la información dada", "category": "vocabulary"},
 {"id": "natural-phenomena", "match": "\\b(?:fenomenos naturales)\\b", "name": "fenómenos naturales", "function": "relacionar el fenómeno natural con lo ocurrido en la situación indicada", "error": "confunde el fenómeno natural con otro acontecimiento", "category": "vocabulary"},
 {"id": "narrative-elements", "match": "\\b(?:elementos de (?:una |la )?narracion|narrative elements)\\b", "name": "elementos de una narración", "function": "relacionar el personaje, trama o ambiente solicitado con su papel en la narración", "error": "atribuye a un personaje la acción de otro o confunde trama y ambiente", "category": "vocabulary"},
 {"id": "contingencies", "match": "\\b(?:eventualidades)\\b", "name": "eventualidades", "function": "relacionar el contratiempo del referente con lo ocurrido en la situación", "error": "atribuye al referente otra eventualidad", "category": "vocabulary"},
 {"id": "literary-genres", "match": "\\b(?:generos literarios)\\b", "name": "géneros literarios", "function": "relacionar el género literario solicitado con los rasgos del texto proporcionado", "error": "confunde el género o atribuye al texto rasgos incompatibles con sus ejemplos", "category": "vocabulary"},
 {"id": "environment", "match": "\\b(?:medio ambiente|medioambiente|environment)\\b", "name": "medio ambiente", "function": "relacionar el proceso o problema ambiental con la información del ejemplo", "error": "confunde el proceso o problema ambiental mencionado", "category": "vocabulary"},
 {"id": "occupations", "match": "\\b(?:ocupaciones)\\b", "name": "ocupaciones", "function": "relacionar la ocupación con el papel del personaje en la situación proporcionada", "error": "atribuye al personaje otra ocupación", "category": "vocabulary"},
 {"id": "reactions", "match": "\\b(?:reacciones)\\b", "name": "reacciones", "function": "relacionar la reacción comunicada con el acontecimiento del personaje ficticio", "error": "cambia el sentido de la reacción o su referente", "category": "vocabulary"},
 {"id": "relationships", "match": "\\b(?:relaciones)\\b", "name": "relaciones", "function": "relacionar el vínculo entre los personajes con la situación comunicada", "error": "atribuye a los personajes otra relación", "category": "vocabulary"},
 {"id": "work", "match": "\\b(?:trabajo)\\b", "name": "trabajo", "function": "relacionar el referente laboral con los datos del perfil o situación ficticia proporcionados", "error": "confunde la solicitud, entrevista, puesto o referente laboral mencionado", "category": "vocabulary"},
 {"id": "values", "match": "\\b(?:valores)\\b", "name": "valores", "function": "relacionar el valor nombrado con las ideas del texto o ejemplos proporcionados, sin evaluar las creencias personales del estudiante", "error": "atribuye al texto un significado distinto del valor que comunica", "category": "vocabulary"},
 {"id": "opinion", "match": "\\b(?:opinar|expresar opiniones|expresiones de opinion)\\b", "name": "opinar", "function": "comunicar el punto de vista solicitado distinguiéndolo de un hecho confirmado", "error": "presenta como hecho confirmado un punto de vista o cambia su sentido", "category": "expression"},
 {"id": "agreement", "match": "\\b(?:expresar acuerdo(?: y desacuerdo)?|expresar desacuerdo)\\b", "name": "expresar acuerdo y desacuerdo", "function": "relacionar la posición comunicada con lo dicho por el interlocutor conservando acuerdo o desacuerdo según lo solicitado", "error": "invierte el acuerdo o desacuerdo de la respuesta", "category": "expression"},
 {"id": "excuse", "match": "\\b(?:excusarse|disculparse)\\b", "name": "excusarse", "function": "comunicar una disculpa relacionada con lo ocurrido en la situación indicada", "error": "la expresión cambia el motivo o no permite reconocer la disculpa", "category": "expression"},
 {"id": "change-topic", "match": "\\b(?:cambiar de tema)\\b", "name": "cambiar de tema", "function": "señalar la transición hacia el nuevo asunto indicado sin perder el vínculo con el intercambio", "error": "la expresión no permite reconocer la transición o introduce otro asunto", "category": "expression"},
]
export function withoutGradeSixLexicalTargets(raw:string){
 let text=raw
 for(const category of ['vocabulary','expression']){
  const cue=category==='vocabulary'?'(?:vocabulario|lexico|palabras|terminos) de':'expresiones para'
  const forms=englishGradeSixLexicon.filter(f=>f.category===category).map(f=>f.match).join('|')
  text=text.replace(new RegExp(`\\b${cue} (?:${forms})(?:\\s+(?:y|o)\\s+(?:${forms}))*`,'g'),' ')
 }
 return text
}
export function requestedGradeSixLexicon(description:string){
 const text=affirmativeScopedEnglishTask(description),lexical=/\b(?:vocabulario|lexico|palabras|terminos)\b/.test(text)
 const selected=requestedLanguageFeatures(englishGradeSixLexicon.filter(f=>f.category==='expression'||lexical),text).map(f=>({...f,category:englishGradeSixLexicon.find(original=>original.id===f.id)!.category}))
 return combineEnglishFeatureAlternatives(text,selected).map(f=>f.id==='agreement'?{...f,name:/expresar acuerdo y desacuerdo/.test(text)?'expresar acuerdo y desacuerdo en los casos solicitados':/expresar desacuerdo/.test(text)?'expresar desacuerdo':'expresar acuerdo'}:f)
}
export const gradeSixLexicalCriterion=(f:LexicalFeature,text:string,mode:string)=>gradeFiveLexicalCriterion(f,text,mode,'ing-6')
