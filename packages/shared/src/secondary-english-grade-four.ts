import {createUpperEnglishProvider,type UpperEnglishEvidence} from './secondary-english-upper-task'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
import {requestedGradeFourGrammar,gradeFourGrammarCriterion} from './secondary-english-grade-four-grammar'

export const englishGradeFourModule={id:'ingles-comunicacion-4',grade:4,subjectCode:'ING',pdfPages:[158,159,160,161,162],policy:'COMMON_FOURTH_GRADE_FUNCTIONS_PARTIAL_V1'}
const row=(id:string,title:string,levels:NonNullable<ContextualTopicCriterion['progressionLevels']>,weight=4):ContextualTopicCriterion=>({templateId:`ing-4-${id}`,title,observable:levels[0],progressionLevels:levels,weight})
export function requestedGradeFourFunctions(text:string){
 const ids:string[]=[]
 if(/\b(?:solicit\w*|ofrec\w*|pedir\w*|pid\w*|compart\w*|intercambi\w*)\b/.test(text)&&/\binformacion\b/.test(text))ids.push('information')
 if(/\b(?:prediccion(?:es)?|predecir\w*|predeciran)\b/.test(text))ids.push('prediction')
 if(/\b(?:anuncios?|anunci\w*)\b/.test(text))ids.push('announcement')
 if(/\bproblemas?\b/.test(text)&&/\b(?:motivos?|causas?|explic\w*)\b/.test(text))ids.push('problem-causes')
 if(/\b(?:deseos?|esperanzas?)\b/.test(text))ids.push('wishes')
 if(/\b(?:planes?|plan futuro)\b/.test(text))ids.push('plans')
 if(/\bnoticias?\b/.test(text))ids.push('news')
 if(/\b(?:experiencias?|relatos?|narracion(?:es)?)\b/.test(text)&&!/\bvocabulario de experiencias\b/.test(text))ids.push('experience')
 if(/\b(?:opinion(?:es)?|puntos? de vista)\b/.test(text))ids.push('opinion')
 const route=/\bindicaciones\b/.test(text)&&/\b(?:llegar|lugar|recorrido|ruta|croquis)\b/.test(text)
 if(route)ids.push('directions')
 if(/\binstrucciones\b/.test(text)||!route&&/\bindicaciones\b/.test(text))ids.push('instructions')
 return ids
}
export function fourthGradeEnglishContent(task:UpperEnglishEvidence){
 const {text,mode}=task,receptive=['reading','listening','analysis','comparison','research'].includes(mode),source=mode==='listening'?'mensaje escuchado':'texto disponible'
 const rows=task.functions.map(id=>{
  switch(id){
   case 'information':{
    const ask=/solicit\w*|pedir\w*|pid\w*/.test(text),offer=/ofrec\w*|compart\w*|intercambi\w*/.test(text)
    const action=ask&&offer?'Solicita y ofrece':ask?'Solicita':'Ofrece'
    return row(id,'Información vinculada con la pregunta',[
     receptive?`Relaciona la pregunta y la información solicitada u ofrecida en el ${source} en inglés con la situación indicada.`:`${action} en inglés la información de la situación proporcionada, relacionando la pregunta y la respuesta con los datos necesarios para continuar el intercambio.`,
     'La pregunta y la información se relacionan; una referencia a los datos de la situación necesita precisión.',
     'Comunica información aislada, pero deja sin relacionar parte de la pregunta o respuesta solicitada.',
     'La pregunta o respuesta cambia la información o el referente de la situación proporcionada.',
     'No se reconoce información pertinente para la pregunta o respuesta solicitada.',
    ])
   }
   case 'prediction':return row(id,'Predicción relacionada con los indicios',[
    receptive?`Relaciona la predicción del ${source} en inglés con los indicios y distingue el resultado posible de un hecho confirmado.`:'Comunica en inglés la predicción solicitada, vinculando el resultado posible con los indicios proporcionados y distinguiéndolo de un hecho confirmado.',
    'La predicción responde a los indicios principales; una relación con el resultado necesita precisión.',
    'Menciona un resultado posible sin relacionarlo claramente con los indicios de la situación.',
    'Predice un resultado incompatible con los indicios o lo presenta como un hecho ya sucedido.',
    'No se reconoce una predicción relacionada con los indicios proporcionados.',
   ])
   case 'announcement':{
    const details=[/\bdia\b|fecha/.test(text)?'el día':'',/\bhora\b/.test(text)?'la hora':'',/\blugar\b/.test(text)?'el lugar':''].filter(Boolean).join(', ')
    return row(id,'Información de lo que se anuncia',[
     receptive?`Identifica qué se anuncia en el ${source} en inglés y relaciona los datos solicitados.`:`Comunica en inglés qué se anuncia${details?' e incluye '+details+' proporcionados':' y los datos solicitados de la situación proporcionada'}, permitiendo reconocer el acontecimiento anunciado.`,
     'Se reconoce lo anunciado y los datos principales; una referencia necesita precisión.',
     'Comunica datos aislados sin establecer claramente qué se anuncia o qué información corresponde al acto.',
     'Cambia el acto anunciado o atribuye a la situación datos incompatibles con los proporcionados.',
     'No se reconoce un anuncio relacionado con la situación indicada.',
    ])
   }
   case 'problem-causes':return row(id,'Problema relacionado con sus causas',[
    receptive?`Relaciona el problema del ${source} en inglés con sus motivos o causas y con los hechos que lo explican.`:'Explica en inglés el problema del personaje o situación proporcionados, relacionando lo ocurrido con la causa o motivo que lo explica.',
    'El problema se relaciona con su causa principal; una referencia entre los hechos necesita precisión.',
    'Menciona el problema y motivos aislados sin aclarar cómo se relacionan.',
    'Confunde el problema con su causa o atribuye motivos incompatibles con los hechos proporcionados.',
    'No se reconoce una explicación que relacione el problema con sus motivos o causas.',
   ])
   case 'wishes':return row(id,'Deseos diferenciados de hechos confirmados',[
    receptive?`Reconoce los deseos o esperanzas del referente en el ${source} en inglés y los distingue de un hecho confirmado.`:'Expresa en inglés los deseos o esperanzas del referente indicado, distinguiendo lo deseado de un resultado confirmado.',
    'Se comprende lo deseado; una referencia al resultado esperado necesita precisión.',
    'Menciona resultados posibles, pero no precisa qué desea o espera el referente.',
    'Presenta como sucedido o confirmado un resultado que el referente solo desea o espera.',
    'No se reconocen deseos o esperanzas relacionados con la situación indicada.',
   ])
   case 'plans':{
    const details=[/\bdia\b|fecha/.test(text)?'el día':'',/\bhora\b/.test(text)?'la hora':'',/\blugar\b/.test(text)?'el lugar':''].filter(Boolean).join(' y ')||'la información solicitada'
    return row(id,'Plan futuro relacionado con la situación',[
     receptive?`Identifica la acción propuesta y ${details} del plan futuro en el ${source} en inglés.`:`Comunica en inglés la acción propuesta y ${details} del plan futuro solicitado, vinculándolos con la situación proporcionada.`,
     'El plan futuro se comprende; una referencia necesaria para realizarlo necesita precisión.',
     'Menciona una acción futura sin relacionar parte de la información solicitada del plan.',
     'Cambia la acción o los datos del plan y comunica una situación futura diferente de la indicada.',
     'No se reconoce un plan futuro relacionado con la situación solicitada.',
    ])
   }
   case 'news':return row(id,'Acontecimiento y datos de la noticia',[
    receptive?`Identifica el acontecimiento de la noticia en el ${source} en inglés y relaciona sus datos solicitados.`:'Comunica en inglés el acontecimiento de la noticia, relacionando sus datos según la situación proporcionada.',
    'El acontecimiento y los datos principales se comprenden; una referencia necesita precisión.',
    'Menciona datos aislados sin establecer qué acontecimiento se comunica.',
    'Cambia el acontecimiento o atribuye a la noticia datos incompatibles con la situación proporcionada.',
    'No se reconoce una noticia relacionada con el acontecimiento y los datos proporcionados.',
   ])
   case 'experience':return row(id,'Experiencia y secuencia de acontecimientos',[
    receptive?`Relaciona los acontecimientos de la experiencia en el ${source} en inglés en una secuencia comprensible.`:'Relata en inglés la experiencia real o ficticia elegida para la tarea, enlazando sus acontecimientos en una secuencia que permite seguir lo ocurrido.',
    'La experiencia y su secuencia se comprenden; una relación entre acontecimientos necesita precisión.',
    'Comunica acontecimientos aislados, pero omite relaciones necesarias para seguir la experiencia.',
    'Cambia la relación entre acontecimientos y altera la experiencia solicitada.',
    'No se reconocen acontecimientos relacionados con la experiencia indicada.',
   ])
   case 'opinion':return row(id,'Opinión relacionada con la situación',[
    receptive?`Reconoce la opinión del ${source} en inglés${/razon|justific\w*/.test(text)?' y la relaciona con la razón que la sustenta':''}.`:`Comunica en inglés su opinión sobre la situación proporcionada${/razon|justific\w*/.test(text)?' y la relaciona con la razón solicitada':''}.`,
    'La opinión se comprende; una referencia a la situación necesita precisión.',
    'Menciona expresiones de opinión sin establecer claramente el punto de vista sobre la situación.',
    'Atribuye a la situación un punto de vista incompatible con la información proporcionada.',
    'No se reconoce una opinión relacionada con la situación indicada.',
   ])
   case 'directions':return row(id,'Indicaciones del recorrido señalado',[
    receptive?`Relaciona las indicaciones del ${source} en inglés con el recorrido y el lugar señalados.`:'Solicita o comunica en inglés indicaciones que permiten seguir el recorrido hacia el lugar señalado en el croquis o situación proporcionados.',
    'Se reconoce el recorrido; una referencia de orientación necesita precisión.',
    'Menciona lugares o referencias aisladas sin enlazarlos para seguir el recorrido.',
    'Las indicaciones cambian el recorrido o conducen a otro lugar.',
    'No se reconocen indicaciones relacionadas con el recorrido solicitado.',
   ])
   case 'instructions':return row(id,'Pasos de las instrucciones solicitadas',[
    receptive?`Relaciona los pasos de las instrucciones del ${source} en inglés con su orden y con la tarea indicada.`:'Comunica en inglés los pasos de las instrucciones solicitadas en un orden que permite seguir la tarea indicada.',
    'Los pasos permiten seguir la tarea; una relación entre acciones necesita precisión.',
    'Menciona pasos aislados sin enlazar una acción necesaria para seguir la tarea.',
    'Cambia el orden necesario o la acción indicada y altera las instrucciones.',
    'No se reconocen pasos relacionados con las instrucciones solicitadas.',
   ])
   default:throw new Error('Función de cuarto no definida.')
  }
 })
 rows.push(...requestedGradeFourGrammar(task.requirementText).map(f=>gradeFourGrammarCriterion(f,task.requirementText,mode)))
 // Other curricular providers are connected in the next block, before closure.
 if(!rows.length)return rows
 if(mode==='interaction')rows.push(row('interaction','Respuesta que sostiene el intercambio',[
  'Relaciona su respuesta en inglés con lo dicho por el interlocutor y aporta información pertinente que permite sostener el intercambio.',
  'La respuesta permite continuar el intercambio; una referencia necesita aclaración.',
  'Responde a parte de la intervención y deja información necesaria sin relacionar.',
  'Responde a un asunto diferente y cambia el sentido de la intervención del interlocutor.',
  'No se reconoce una respuesta pertinente que permita continuar el intercambio.',
 ],3))
 if(!receptive&&mode!=='audiovisual')rows.push(mode==='writing'?row('written','Mensaje escrito estructurado y comprensible',[
  'Organiza en inglés las ideas del mensaje escrito con una estructura y conectores que permiten seguir la información y el propósito solicitados; los errores aislados no impiden comprenderlo.',
  'El mensaje escrito se comprende; una relación entre ideas necesita revisión.',
  'Comunica ideas aisladas sin establecer varias relaciones necesarias para seguir el mensaje.',
  'La organización o las expresiones cambian el sentido del mensaje solicitado.',
  'No se reconoce un mensaje escrito relacionado con el propósito de la tarea.',
 ],3):row('intelligibility','Discurso oral sostenido y comprensible',[
  'Comunica en inglés un discurso sencillo y sostenido que enlaza las ideas para seguir el mensaje; las pausas y reformulaciones no impiden comprender la información solicitada.',
  'Las ideas principales se comprenden; una relación o expresión necesita aclaración.',
  'Se comprenden expresiones aisladas, pero varias relaciones necesarias para seguir el discurso quedan ambiguas.',
  'La organización o las expresiones cambian el sentido de las ideas que se comunican.',
  'No se reconoce un mensaje oral relacionado con el propósito solicitado con los apoyos acordados.',
 ],3))
 return rows
}
const provider=createUpperEnglishProvider({grade:4,functions:requestedGradeFourFunctions,criteria:fourthGradeEnglishContent})
export const commonFourthGradeEnglish=provider.common
export const resolveFourthGradeEnglishTask=provider.resolve
