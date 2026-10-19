import type {UpperEnglishEvidence} from './secondary-english-upper-task'
import {upperEnglishRow,upperEnglishCommunication} from './secondary-english-upper-communication'
import {fifthGradeEnglishContent} from './secondary-english-grade-five'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {englishAlternativeGroups} from './secondary-english-grammar'

const row=(id:string,title:string,levels:Parameters<typeof upperEnglishRow>[3])=>upperEnglishRow('ing-5',`literary-${id}`,title,levels)
/** HLM5, PDF450–455: basic supported literary work, only as requested.
 * Source indicators do not impose a canon, private preferences or one interpretation. */
export function fifthOptativeEnglishContent(task:UpperEnglishEvidence){
 const text=task.requirementText,receptive=['reading','listening','analysis','comparison','research'].includes(task.mode)
 const literary=/\b(?:literari[oa]s?|poemas?|poesias?|versos?|metaforas?|simil(?:es)?|personificaciones?|comparacion figurada|lenguaje figurado|sentido figurado)\b/.test(text)
 const rows:ContextualTopicCriterion[]=[]
 if(literary){
  const source=task.mode==='listening'?'texto escuchado':'texto proporcionado'
  if(/\bideas? (?:general(?:es)?|principal(?:es)?)\b|\bmensaje general\b/.test(text))rows.push(row('main','Idea general del texto literario sencillo',[
   `Identifica en inglés la idea general del ${source}, relacionándola con las palabras y el asunto del texto literario sencillo con los apoyos proporcionados.`,
   'La idea general se relaciona con el texto; una referencia al asunto necesita precisión.',
   'Recupera información aislada, pero deja imprecisa la idea general del texto.',
   'Atribuye al texto una idea general incompatible con sus palabras o su asunto.',
   'No se reconoce una idea general relacionada con el texto literario proporcionado.',
  ]))
  if(/\bdetalles? especificos?\b|\bideas? secundarias?\b/.test(text))rows.push(row('details','Detalles solicitados del texto literario sencillo',[
   `Identifica en inglés los detalles específicos solicitados del ${source} y los relaciona con sus referentes, utilizando los apoyos proporcionados.`,
   'Los detalles principales solicitados se reconocen; una referencia necesita precisión.',
   'Recupera detalles aislados, pero omite o deja imprecisa parte de la información solicitada.',
   'Atribuye a un referente detalles de otro o aporta información incompatible con el texto.',
   'No aporta detalles reconocibles relacionados con la información solicitada del texto.',
  ]))
  const modifiers='(?:(?:solo|unicamente|el|la|los|las|un|una|sus)\\s+)*'
  const requested=(target:string)=>new RegExp(`\\b(?:identific\\w*|identifiqu\\w*|recono\\w*|analiz\\w*|analic\\w*|describ\\w*|caracteriz\\w*|crea\\w*|constru\\w*|inclu\\w*|relacion\\w*)\\s+${modifiers}(?:(?:personajes?|ambiente|escenario|acontecimientos|trama|secuencia)\\s+(?:y|o)\\s+${modifiers})*(?:${target})\\b|\\b(?:${target})\\s+(?:solicitad\\w*|senalad\\w*)\\b`)
  const elements:[string,string,RegExp][]=[['characters','los personajes',requested('personajes?')],['setting','el ambiente',requested('ambiente|escenario')],['events','los acontecimientos y su secuencia',requested('acontecimientos|trama|secuencia')]]
  for(const [id,target,match]of elements)if(match.test(text)){
   const singular=id==='setting',requestedTarget=target+(singular?' solicitado':' solicitados'),ofTarget=target.startsWith('el ')?'del '+target.slice(3):'de '+target
   rows.push(row(id,`Relación con ${target} del texto`,[
   `${receptive?'Identifica':'Construye'} en inglés ${requestedTarget}, ${singular?'relacionándolo':'relacionándolos'} con la información ${receptive?'del texto literario sencillo proporcionado':'de la situación literaria y los apoyos indicados'}.`,
   `Se ${singular?'reconoce':'reconocen'} ${requestedTarget}; una relación necesita precisión.`,
   `Presenta información aislada y deja sin precisar parte ${ofTarget} ${singular?'solicitado':'solicitados'}.`,
   `Atribuye información incompatible con ${target} o altera sus referentes en la situación indicada.`,
   `No se reconoce información pertinente sobre ${requestedTarget}.`,
  ]))}
  const elementGroups=englishAlternativeGroups(text,rows.filter(r=>elements.some(([id])=>r.templateId==='ing-5-literary-'+id)).map(r=>({...r,id:r.templateId.slice('ing-5-literary-'.length),match:r.templateId.endsWith('-characters')?'personajes?':r.templateId.endsWith('-setting')?'ambiente|escenario':'acontecimientos|trama|secuencia'})))
  for(const group of elementGroups)if(group.length>1){
   const index=rows.findIndex(r=>r.templateId===group[0].templateId)
   for(let i=rows.length-1;i>=0;i--)if(group.some(g=>g.templateId===rows[i].templateId))rows.splice(i,1)
   rows.splice(index,0,row(group.map(g=>g.id).join('-or-'),'Elemento elegido del texto literario',[0,1,2,3,4].map(i=>group.map(g=>g.progressionLevels![i]).join(' / ')+' Se valora únicamente la alternativa elegida.') as Parameters<typeof row>[2]))
  }
  if(/\bestructura (?:basica|sencilla)|\belementos estructurales\b/.test(text))rows.push(row('structure','Estructura sencilla solicitada del texto literario',[
   `${receptive?'Reconoce':'Organiza'} en inglés las partes de la estructura sencilla solicitada del texto literario y sus relaciones, según el modelo o las indicaciones proporcionados.`,
   'La estructura solicitada se reconoce; una relación entre sus partes necesita precisión.',
   'Presenta partes aisladas y deja incompleta una relación necesaria para seguir la estructura solicitada.',
   'Cambia las relaciones entre las partes y comunica una estructura incompatible con el modelo indicado.',
   'No se reconoce la estructura sencilla solicitada con los apoyos proporcionados.',
  ]))
  const figures=/\b(?:figuras? literarias?|metaforas?|simil(?:es)?|personificaciones?|comparacion figurada)\b/.test(text)
  const meaningChoice=/\b(?:sentido|lenguaje) literal o figurado\b/.test(text)
  if(meaningChoice)rows.push(row('literal-or-figurative','Sentido de la alternativa elegida en el texto',[
   'Interpreta en inglés el sentido literal o figurado elegido de la expresión señalada, relacionándolo con el contexto del texto sencillo y los ejemplos de apoyo. Se valora únicamente la alternativa elegida.',
   'El sentido elegido se relaciona con la expresión y su contexto; una referencia necesita precisión.',
   'Reconoce información aislada, pero deja imprecisa parte del sentido de la alternativa elegida.',
   'Atribuye a la expresión un sentido incompatible con su contexto y la alternativa elegida.',
   'No se reconoce una interpretación del sentido elegido con los apoyos proporcionados.',
  ]))
  else if(/\b(?:sentido|lenguaje) literal\b/.test(text)&&/\bfigurado\b/.test(text))rows.push(row('literal-figurative','Sentido literal y figurado en el texto',[
   'Distingue en inglés el sentido literal y el figurado de las expresiones señaladas, relacionándolos con el contexto del texto sencillo y los ejemplos de apoyo.',
   'La distinción se comprende; una relación entre expresión y contexto necesita precisión.',
   'Reconoce una expresión, pero deja imprecisa parte de la diferencia entre sentido literal y figurado.',
   'Confunde el sentido literal con el figurado y propone una lectura incompatible con el contexto.',
   'No se reconoce una distinción de los sentidos solicitados con los apoyos proporcionados.',
  ]))
  if(figures){
   const effect=/\b(?:efecto|efectos|aport[ae]|aporta)\b/.test(text)&&/\b(?:explic\w*|expliqu\w*|analiz\w*|analic\w*|relacion\w*)\b/.test(text)
   if(!receptive)rows.push(row('figure-use','Uso de la figura básica solicitada',[
    'Utiliza en inglés la figura literaria básica solicitada en el texto sencillo, relacionando la expresión figurada con el sentido buscado y el modelo o apoyo proporcionado.',
    'La figura solicitada y su sentido se reconocen; una relación necesita precisión.',
    'Incluye una expresión figurada aislada, pero deja imprecisa su relación con el sentido solicitado.',
    'La expresión no corresponde a la figura solicitada o comunica un sentido incompatible con el contexto.',
    'No se reconoce el uso de la figura básica solicitada con los apoyos proporcionados.',
   ]))
   else if(effect)rows.push(row('figure-effect','Efecto de la figura señalada en el texto',[
    'Explica en inglés cómo la figura básica señalada contribuye al sentido del texto sencillo, relacionando la expresión con su contexto y los ejemplos de apoyo.',
    'El efecto se relaciona con la expresión señalada; una referencia al contexto necesita precisión.',
    'Nombra la figura, pero deja sin explicar parte de su relación con el sentido del texto.',
    'Atribuye a la figura un efecto incompatible con la expresión o su contexto.',
    'No se reconoce una explicación del efecto de la figura señalada con los apoyos proporcionados.',
   ]))
   else rows.push(row('figures','Reconocimiento de las figuras básicas solicitadas',[
    'Identifica en inglés las figuras literarias básicas solicitadas en las expresiones señaladas del texto sencillo, utilizando la ayuda y los ejemplos proporcionados.',
    'Reconoce las figuras solicitadas; una relación entre figura y expresión necesita precisión.',
    'Reconoce alguna expresión, pero confunde parte de las figuras básicas solicitadas.',
    'Atribuye a las expresiones figuras incompatibles con los ejemplos y las indicaciones dadas.',
    'No identifica las figuras básicas solicitadas con los apoyos proporcionados.',
   ]))
  }
  if(figures&&/\b(?:metaforas?|simil(?:es)?|personificaciones?)\s+o\s+(?:(?:un|una|el|la)\s+)?(?:metaforas?|simil(?:es)?|personificaciones?)\b/.test(text))for(const r of rows.filter(r=>/literary-(?:figures|figure-use|figure-effect)$/.test(r.templateId))){
   const levels=r.progressionLevels!.map(l=>l+' Se valora únicamente la figura de la alternativa elegida.') as NonNullable<ContextualTopicCriterion['progressionLevels']>
   r.progressionLevels=levels;r.observable=levels[0]
  }
  if(/\bpuntos? de vista\b/.test(text)){
   const reasons=/\b(?:razones|razonamientos|justific\w*|sustent\w*)\b/.test(text)
   rows.push(row('viewpoint',reasons?'Punto de vista relacionado con las razones del texto':'Punto de vista relacionado con el texto',[
    `${receptive?'Reconoce':'Comunica'} en inglés el punto de vista solicitado sobre el texto literario sencillo${reasons?', relacionándolo con las razones y referencias del texto proporcionado':', conservando su relación con la información del texto proporcionado'}.`,
    `El punto de vista se relaciona con el texto${reasons?' y sus razones':''}; una referencia necesita precisión.`,
    `Menciona un punto de vista, pero deja imprecisa parte de su relación con el texto${reasons?' o con las razones solicitadas':''}.`,
    'Atribuye al texto información incompatible con sus palabras para presentar el punto de vista.',
    'No se reconoce un punto de vista relacionado con el texto literario proporcionado.',
   ]))
  }
  if(receptive&&/\b(?:costumbres|diferencias culturales)\b/.test(text)&&/\b(?:identific\w*|identifiqu\w*|recono\w*|analiz\w*|analic\w*)\b/.test(text))rows.push(row('cultural-information','Información cultural de los ejemplos del texto',[
   'Identifica en inglés la información cultural solicitada de los personajes o situaciones del texto literario sencillo, relacionando las diferencias con los ejemplos proporcionados.',
   'La información cultural se relaciona con los ejemplos; una referencia necesita precisión.',
   'Recupera información aislada, pero deja imprecisa una diferencia solicitada entre los ejemplos.',
   'Atribuye a un personaje información de otro o interpreta diferencias incompatibles con el texto.',
   'No se reconoce información cultural pertinente a partir de los ejemplos del texto.',
  ]))
 }
 const evidence=rows.length?{...task,functions:task.functions.filter(f=>f!=='narrative'&&!(f==='alternatives'&&/comparacion figurada/.test(text)))}:task
 const base=fifthGradeEnglishContent(evidence).filter(r=>!rows.length||!/^ing-5-genre-(?:narrative|poem|argumentation)$/.test(r.templateId)&&!(r.templateId==='ing-5-strategy-main-secondary'&&rows.some(c=>/-literary-(?:main|details)$/.test(c.templateId))))
 const bareLiterary=/^(?:leer(?:an)?|lean|lee|escuchar(?:an)?|escuchen|escribir(?:an)?|escriban|presentar(?:an)?|presenten) (?:en ingles )?(?:un|el) texto literario sencillo(?: en ingles)?$/.test(text)
 if(literary&&bareLiterary&&!base.length&&!rows.length)return [receptive?row('main','Idea general del texto literario sencillo',[
  `Identifica en inglés la idea general del ${task.mode==='listening'?'texto escuchado':'texto proporcionado'}, relacionándola con las palabras y el asunto del texto literario sencillo con los apoyos proporcionados.`,
  'La idea general se relaciona con el texto; una referencia al asunto necesita precisión.',
  'Recupera información aislada, pero deja imprecisa la idea general del texto.',
  'Atribuye al texto una idea general incompatible con sus palabras o su asunto.',
  'No se reconoce una idea general relacionada con el texto literario proporcionado.',
 ]):row('simple-production','Sentido del texto literario sencillo',[
  'Comunica en inglés el sentido del texto literario sencillo acordado mediante expresiones relacionadas que permiten seguir su asunto, con los apoyos proporcionados.',
  'El sentido del texto se comprende; una relación entre expresiones necesita precisión.',
  'Presenta expresiones aisladas, pero deja imprecisa parte del sentido del texto solicitado.',
  'Las expresiones comunican un asunto incompatible con el texto literario acordado.',
  'No se reconoce un texto literario sencillo relacionado con el asunto acordado y los apoyos proporcionados.',
 ])]
 const result=[...base,...rows]
 if(rows.length&&!base.some(r=>/^ing-5-(?:written|intelligibility|interaction)$/.test(r.templateId)))result.push(...upperEnglishCommunication(task,'ing-5'))
 return result
}
