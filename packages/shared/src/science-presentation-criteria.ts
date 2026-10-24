import type {CommonScienceTopic} from './secondary-science-common-types'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {taskClauseSpans} from './task-clause-spans'

type Levels=ContextualTopicCriterion['progressionLevels']
const criterion=(topic:CommonScienceTopic,key:string,title:string,levels:Levels,weight=3):ContextualTopicCriterion=>({
 templateId:`nat-${topic.grade}-${topic.id}-${key}`,title,observable:levels[0],progressionLevels:levels,weight,
})

/** Adaptaciones de AulaBase: alcance solicitado, sin añadir cifras, productos o predicciones. */
export function explicitScienceContent(topic:CommonScienceTopic,text:string):ContextualTopicCriterion[]|null{
 if(['solar-system','solar-galaxy'].includes(topic.id)&&/sistema solar/.test(text)&&/\btodos los planetas\b|\bocho planetas\b/.test(text)){
  const rows=[criterion(topic,'coverage','Cobertura de los planetas',[
   'Presenta todos los planetas del sistema solar: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno, identificándolos sin confundirlos con otros cuerpos.',
   'Incluye los ocho nombres, pero durante la presentación alguna identificación queda sin resolver o se confunde con otro cuerpo.',
   'Permite identificar parte de los planetas, pero deja otros sin presentar o sin distinguir entre los cuerpos mencionados.',
   'Menciona cuerpos del sistema solar sin permitir reconocer cuáles son los planetas que intenta presentar.',
   'No presenta evidencia que permita identificar los planetas solicitados.',
  ])]
  if(/\bexplic\w*\b/.test(text))rows.push(criterion(topic,'explanation','Explicación científica de los planetas',[
   'Explica qué es cada planeta y sus características científicas pertinentes, distinguiendo su naturaleza planetaria de la de una estrella o un satélite.',
   'Explica la naturaleza planetaria de cada uno, pero algunas características quedan enunciadas sin aclarar qué significan.',
   'Explica qué son algunos planetas; en otros se limita a nombrarlos o les atribuye características incompatibles con su naturaleza.',
   'Ofrece afirmaciones aisladas que confunden planetas, estrellas o satélites y no explican qué son los planetas presentados.',
   'No aporta una explicación científica de los planetas presentados.',
  ],4))
  return rows
 }
 if(topic.id!=='periodic-position'||!/\bexplic\w*\b/.test(text)||/predic\w*|tendenci\w*/.test(text))return null
 const groups=/\bgrupos?\b/.test(text),periods=/\bperiodos?\b/.test(text),position=/\bposicion|\bubicacion|\bocupan?\b/.test(text)
 const rows:ContextualTopicCriterion[]=[]
 if(groups&&periods)rows.push(criterion(topic,'organization','Grupos y períodos de la tabla',[
  'Explica los grupos como columnas y los períodos como filas de la tabla periódica, mostrando que cada elemento ocupa el cruce de un grupo y un período.',
  'Distingue columnas y filas y las nombra correctamente, pero su explicación de grupos o períodos queda reducida a señalar su orientación.',
  'Reconoce una de las dos formas de organización, pero omite o confunde la otra al explicar grupos y períodos.',
  'Menciona grupos y períodos, pero intercambia columnas y filas sin establecer una distinción válida.',
  'No explica los grupos ni los períodos de la tabla periódica.',
 ],3))
 if(position)rows.push(criterion(topic,'explanation','Fundamento de la ubicación de los elementos',[
  'Explica la ubicación de los elementos mediante el orden creciente del número atómico y la organización periódica de sus propiedades, relacionando ambas ideas con la tabla.',
  'Relaciona el número atómico con el orden de los elementos, pero no conecta las semejanzas periódicas con su ubicación.',
  'Reconoce datos o posiciones de los elementos, pero no explica cómo el número atómico y la periodicidad sustentan su ubicación.',
  'Atribuye la ubicación a un orden arbitrario o confunde el número atómico con otra magnitud al justificarla.',
  'No aporta una explicación de por qué los elementos ocupan su ubicación en la tabla.',
 ],4))
 return rows.length?rows:null
}

const numbers:Record<string,string>={un:'1',uno:'1',dos:'2',tres:'3',cuatro:'4',cinco:'5',seis:'6',siete:'7',ocho:'8',nueve:'9',diez:'10',quince:'15',veinte:'20'}
/** El texto recibido ya excluye recursos opcionales y acciones negadas. */
export function presentationDurationMatch(text:string):RegExpExecArray|null{
 const number='(\\d+(?:[.,]\\d+)?|'+Object.keys(numbers).join('|')+')'
 for(const clause of taskClauseSpans(text)){
  const value=clause.text
  // Explicit presentation time remains eligible beside a separate preparation time.
  const explicit=new RegExp('\\b(?:(maximo|aproximadamente|alrededor de|unos|unas|no mas de|hasta)\\s+)?'+number+'\\s+(minutos?|segundos?)\\s+para\\s+(?:exponer|presentar|la exposicion|la presentacion)\\b').exec(value)
  if(explicit){const amount=new RegExp('\\b(?:(maximo|aproximadamente|alrededor de|unos|unas|no mas de|hasta)\\s+)?'+number+'\\s+(minutos?|segundos?)\\b').exec(explicit[0])!;amount.index+=clause.start+explicit.index;return amount}
  const eligible=
  (/duracion|durara?\w*|exposicion|presentacion|intervencion|expong\w*|expon\w*/.test(value)
   ||new RegExp('^\\s*(?:maximo|aproximadamente|alrededor de|unos|unas|no mas de|hasta)?\\s*'+number+'\\s+(?:minutos?|segundos?)\\s*$').test(value))
  &&!/para preparar|preparacion|ensay\w*|recreo|descanso/.test(value)
  if(!eligible)continue
  const match=new RegExp('\\b(?:(maximo|aproximadamente|alrededor de|unos|unas|no mas de|hasta)\\s+)?'+number+'\\s+(minutos?|segundos?)\\b').exec(value)
  if(match){match.index+=clause.start;return match}
 }
 return null
}
function presentationDuration(text:string):string|null{
 const match=presentationDurationMatch(text)
 if(!match)return null
 const unit=match[3],amount=numbers[match[2]]??match[2].replace(',','.'),limit=match[1]
 if(limit&&/maximo|no mas de|hasta/.test(limit))return `duración de máximo ${amount} ${unit}`
 if(limit)return `duración de aproximadamente ${amount} ${unit}`
 return `duración de ${amount} ${unit}`
}

/** Una sola dimensión oral por presentación; la precisión disciplinar se valora aparte. */
export function sciencePresentationCriteria(topic:CommonScienceTopic,text:string):ContextualTopicCriterion[]{
 text=text.replace(/\b(?:opcionalmente|si lo deseas)\b[^.;]*/g,'')
  .replace(/\b(?:sin|no\s+(?:(?:se|deben?|es necesario)\s+)?)(?:\s+)?(?:utili[cz]\w*|us[ae]\w*)[^.;]*/g,'')
 const duration=presentationDuration(text)
 const condition=duration?` Respeta la ${duration} solicitada.`:''
 const partialCondition=duration?` La organización dificulta seguir parte del mensaje o no se cumple la ${duration} solicitada.`:''
 const rows=[criterion(topic,'oral','Comunicación oral',[
  'Presenta las ideas en una secuencia comprensible y conecta las partes de la exposición; la expresión permite seguir el mensaje, con los apoyos de acceso que correspondan.'+condition,
  'El mensaje se entiende y las ideas principales se enlazan, aunque alguna transición queda abrupta o requiere aclaración.'+condition,
  duration?'Se reconocen ideas del mensaje, pero cuesta seguir sus conexiones o no se cumple la '+duration+' solicitada.':'Se reconocen ideas del mensaje, pero la secuencia o las referencias no permiten seguir bien sus conexiones.',
  'Los fragmentos comunicados no permiten reconstruir una secuencia de ideas de la exposición.'+partialCondition,
  'No hay una intervención oral evaluable, considerando los apoyos de acceso que correspondan.',
 ],3)]
 const support=/\b(?:utiliz\w*|us[ae]\w*|con|mediante)\s+(?:un\s+|el\s+)?material de apoyo\b|\b(?:utiliz\w*|us[ae]\w*)\s+(?:una?s?\s+)?(?:imagenes|diapositivas|laminas|esquemas)\b/.test(text)
 if(support)rows.push(criterion(topic,'support','Uso del material de apoyo',[
  'Utiliza el material de apoyo solicitado para aclarar las ideas de la exposición y establece su relación con lo que explica.',
  'Relaciona el material de apoyo con las ideas, pero alguna referencia no permite reconocer qué parte del material las aclara.',
  'Muestra material relacionado con el tema, pero su uso queda desconectado de la explicación o no ayuda a comprenderla.',
  'El material mostrado no guarda relación reconocible con las ideas que se comunican.',
  'No utiliza el material de apoyo solicitado.',
 ],2))
 return rows
}
