import {createUpperEnglishProvider,type UpperEnglishEvidence} from './secondary-english-upper-task'
import {upperEnglishRow,upperEnglishCommunication} from './secondary-english-upper-communication'
import {englishAlternativeGroups} from './secondary-english-grammar'
import {englishGradeFiveGrammar,requestedGradeFiveGrammar,gradeFiveGrammarCriterion} from './secondary-english-grade-five-grammar'
import {requestedGradeFiveLexicon,gradeFiveLexicalCriterion,withoutGradeFiveLexicalTargets} from './secondary-english-grade-five-lexicon'
import {gradeFiveStrategyCriteria} from './secondary-english-grade-five-strategies'
import {gradeFiveGenreCriteria} from './secondary-english-grade-five-genres'
import {gradeFiveContextCriteria} from './secondary-english-grade-five-context'
export const englishGradeFiveModule={id:'ingles-comunicacion-5',grade:5,subjectCode:'ING',pdfPages:[163,164,165,166,167,168],policy:'COMMON_FIFTH_GRADE_DEFINED_FAMILIES_REVIEW_PENDING_V1'}
const row=(id:string,title:string,levels:Parameters<typeof upperEnglishRow>[3])=>upperEnglishRow('ing-5',id,title,levels)
export function requestedGradeFiveFunctions(raw:string){
 let text=withoutGradeFiveLexicalTargets(raw)
 for(const feature of englishGradeFiveGrammar)text=text.replace(new RegExp(feature.match,'g'),' ')
 const ids:string[]=[]
 if(/\b(?:quejas?|reclamacion(?:es)?|reclamos?)\b/.test(text))ids.push('complaint')
 if(/\b(?:compar\w*|contrast\w*)\b/.test(text)&&!/\b(?:funcion|gramatica|vocabulario|expresiones)\b/.test(text))ids.push('alternatives')
 if(/\b(?:comprar(?:an)?|compra(?:n|s)?|transaccion(?:es)?|adquirir\w*)\b/.test(text))ids.push('purchase')
 if(/\b(?:probabilidad|probable\w*|posibilidad(?:es)?)\b/.test(text))ids.push('probability')
 if(/\b(?:certeza|cierta|cierto|segura|seguro)\b/.test(text))ids.push('certainty')
 if(/\b(?:report\w*|reporte(?:s)?)\b/.test(text)&&/\b(?:informacion|informaciones|ideas?|comunic\w*|dijo|dijeron)\b/.test(text))ids.push('reported-information')
 if(/\b(?:prohibicion(?:es)?|prohibir\w*|no esta permitid\w*)\b/.test(text))ids.push('prohibition')
 if(/\b(?:obligacion(?:es)?|debe hacer|deben hacer)\b/.test(text))ids.push('obligation')
 if(/\bconsultas? medicas?\b/.test(text))ids.push('medical-interaction')
 if(/\b(?:narr\w*|relatos?)\b/.test(text)&&!/\belementos de (?:una |la )?narracion\b/.test(text))ids.push('narrative')
 if(/\bconsejos?\b/.test(text))ids.push('advice')
 if(/\b(?:sugerencias?|sugerir\w*)\b/.test(text))ids.push('suggestion')
 return ids
}
export function fifthGradeEnglishContent(task:UpperEnglishEvidence){
 const {mode,text}=task,receptive=['reading','listening','analysis','comparison','research'].includes(mode),source=mode==='listening'?'mensaje escuchado':'texto disponible'
 const cultural=gradeFiveStrategyCriteria(task.requirementText,mode).some(c=>c.templateId.endsWith('cultural-comparison'))
 const rows=(cultural?[]:task.functions).map(id=>{
  switch(id){
   case 'complaint':{
    const remedy=/solucion solicitad|remedio|reparacion|reembolso|reemplazo/.test(text)
    return row(id,'Reclamación relacionada con el problema y lo acordado',[
     receptive?`Relaciona la queja del ${source} en inglés con el problema del bien o servicio y los datos de lo acordado.`:`Plantea en inglés la reclamación del caso proporcionado, relacionando el problema con lo acordado${remedy?' y la solución solicitada':''}.`,
     'La reclamación y el problema se comprenden; una referencia a lo acordado necesita precisión.',
     'Menciona una inconformidad, pero deja sin relacionar el problema con los datos del caso.',
     'La reclamación atribuye al caso otro problema o contradice lo acordado en la situación proporcionada.',
     'No se reconoce una reclamación relacionada con el problema del caso.',
    ])
   }
   case 'alternatives':return row(id,'Contraste de las alternativas con los datos disponibles',[
    'Contrasta en inglés las alternativas indicadas, relacionando sus semejanzas y diferencias con los datos o criterios de comparación proporcionados.',
    'El contraste permite distinguir las alternativas; una relación con los datos necesita precisión.',
    'Enumera características de las alternativas sin relacionar varias semejanzas o diferencias solicitadas.',
    'El contraste atribuye a una alternativa datos de otra o establece diferencias incompatibles con la información disponible.',
    'No aporta un contraste reconocible entre las alternativas indicadas.',
   ])
   case 'purchase':return row(id,'Solicitud y acuerdo de la compra simulada',[
    receptive?`Identifica el bien o servicio de la compra del ${source} en inglés y relaciona los datos de la transacción solicitados.`:`Solicita en inglés el bien o servicio de la compra simulada y relaciona ${[/cantidad/.test(text)?'la cantidad':'',/precio/.test(text)?'el precio':'',/forma de pago|pago/.test(text)?'la forma de pago':''].filter(Boolean).join(', ')||'los datos solicitados de la transacción'} con la información proporcionada.`,
    'Se comprende qué se compra y los datos principales del acuerdo; una referencia necesita precisión.',
    'Menciona el bien o servicio, pero deja sin relacionar un dato necesario para completar la transacción.',
    'Cambia el bien, servicio o datos acordados y comunica una compra distinta de la indicada.',
    'No se reconoce una compra relacionada con el bien o servicio y los datos de la tarea.',
   ])
   case 'probability':return row(id,'Probabilidad vinculada con los indicios',[
    receptive?`Relaciona la posibilidad comunicada en el ${source} en inglés con sus indicios, sin convertirla en un hecho confirmado.`:'Expresa en inglés el resultado posible de la situación y relaciona su grado de probabilidad con los indicios proporcionados, distinguiéndolo de un hecho confirmado.',
    'La posibilidad y sus indicios se comprenden; una relación con el grado de probabilidad necesita precisión.',
    'Menciona una posibilidad sin relacionarla claramente con los indicios de la tarea.',
    'Presenta como seguro un resultado que los indicios solo permiten considerar posible, o contradice la situación.',
    'No se reconoce una posibilidad relacionada con los indicios proporcionados.',
   ])
   case 'certainty':return row(id,'Grado de certeza sustentado en la información',[
    'Distingue en inglés lo cierto de lo posible en la información de los ejemplos y sustenta el grado de certeza comunicado con los datos disponibles.',
    'Distingue lo cierto y lo posible; una relación entre el grado de certeza y los datos necesita precisión.',
    'Menciona datos e impresiones, pero deja sin aclarar qué información sustenta el grado de certeza.',
    'Afirma como cierto lo que los datos no confirman o atribuye incertidumbre a un hecho confirmado en la tarea.',
    'No aporta una distinción reconocible del grado de certeza basada en los datos indicados.',
   ])
   case 'reported-information':return row(id,'Información reportada y referente de lo dicho',[
    receptive?`Relaciona la información reportada en el ${source} en inglés con quién la comunicó y conserva el sentido de sus ideas.`:'Reporta en inglés la información o ideas del personaje indicado, conservando quién las comunicó, sus referentes y el sentido de lo dicho en la fuente proporcionada.',
    'La información y quién la comunicó se reconocen; una referencia del reporte necesita precisión.',
    'Reporta ideas aisladas, pero deja sin relacionar parte de lo dicho con su referente o fuente.',
    'Atribuye a un personaje las ideas de otro o cambia el sentido de la información reportada.',
    'No se reconoce información reportada relacionada con lo comunicado en la fuente.',
   ])
   case 'prohibition':return row(id,'Acción no permitida según las normas dadas',[
    receptive?`Identifica qué acción no está permitida en el ${source} en inglés y relaciona la prohibición con su situación.`:'Comunica en inglés qué acción no está permitida según las normas proporcionadas, conservando la prohibición y su referente en la situación ficticia.',
    'Se comprende la acción prohibida; una referencia a su situación necesita precisión.',
    'Menciona una norma sin precisar qué acción no se permite en la situación.',
    'Presenta como permitida u obligatoria la acción que debía prohibir o cambia su referente.',
    'No se reconoce una prohibición relacionada con las normas proporcionadas.',
   ])
   case 'obligation':return row(id,'Acción obligatoria según las normas dadas',[
    receptive?`Identifica qué debe hacer el referente del ${source} en inglés según las normas proporcionadas.`:'Comunica en inglés qué debe hacer el personaje según las normas proporcionadas, distinguiendo la obligación de una opción o sugerencia.',
    'Se comprende la acción obligatoria; una referencia a la norma necesita precisión.',
    'Menciona la norma sin precisar qué acción debe realizar el personaje.',
    'Presenta como opcional o prohibida la acción obligatoria o atribuye otra obligación al personaje.',
    'No se reconoce una obligación relacionada con las normas de la tarea.',
   ])
   case 'medical-interaction':return row(id,'Información de la consulta médica simulada',[
    receptive?`Identifica la información solicitada de la consulta médica del ${source} en inglés y la relaciona con los datos del personaje.`:'Comunica en inglés los síntomas y datos solicitados de la ficha del personaje ficticio en la consulta simulada, relacionando preguntas y respuestas sin aportar información médica personal.',
    'La información principal de la consulta se comprende; una referencia a la ficha necesita precisión.',
    'Menciona síntomas o datos aislados sin relacionarlos con la pregunta de la consulta simulada.',
    'Cambia los síntomas o atribuye al personaje información incompatible con su ficha.',
    'No se reconoce información de la consulta relacionada con la ficha del personaje.',
   ])
   case 'narrative':return row(id,'Acontecimientos relacionados en la narración',[
    receptive?`Relaciona los acontecimientos del ${source} en inglés con sus referentes y secuencia para seguir lo ocurrido.`:'Narra en inglés los hechos reales o imaginarios de la tarea, relacionando los acontecimientos con sus referentes y su secuencia para seguir lo ocurrido.',
    'Los acontecimientos y su secuencia se comprenden; una relación entre hechos necesita precisión.',
    'Enumera acontecimientos aislados, pero omite relaciones necesarias para seguir lo ocurrido.',
    'Cambia la secuencia o los referentes y altera el sentido de los acontecimientos narrados.',
    'No se reconocen acontecimientos relacionados con la narración solicitada.',
   ])
   case 'advice':case 'suggestion':{
    const ask=/\b(?:pedir(?:an)?|pidan|solicitar(?:an)?)\b/.test(text),give=/\b(?:dar(?:an)?|dan|den|comunic(?:ar(?:an)?|an|en|ando)|expres(?:ar(?:an)?|an|en|ando)|propon(?:dran|er|en|gan))\b/.test(text)
    const definite=id==='advice'?'el consejo':'la sugerencia',indefinite=id==='advice'?'un consejo':'una sugerencia'
    return row(id,id==='advice'?'Consejo relacionado con la situación':'Sugerencia relacionada con la necesidad',[
     receptive?`Relaciona ${definite} del ${source} en inglés con la situación y los datos que ${id==='advice'?'lo motivan':'la motivan'}.`:ask&&!give?`Solicita en inglés ${indefinite}, precisando la situación o necesidad del personaje sobre la que pide orientación.`:`${ask?'Solicita y comunica':'Comunica'} en inglés ${indefinite}, relacionando la recomendación u opción propuesta con la situación y los datos del personaje.`,
     `${id==='advice'?'El consejo solicitado o comunicado':'La sugerencia solicitada o comunicada'} se relaciona con la situación; una referencia necesita precisión.`,
     `Menciona ${indefinite} general sin precisar su relación con la necesidad del personaje.`,
     `${id==='advice'?'El consejo':'La sugerencia'} cambia la necesidad o contradice los datos proporcionados para el personaje.`,
     `No se reconoce ${indefinite} pertinente para la situación indicada.`,
    ])
   }
   default:throw new Error('Función de quinto no definida')
  }
 })
 const matches:Record<string,string>={complaint:'quejas?|reclamacion(?:es)?|reclamos?',alternatives:'alternativas',purchase:'compras?',probability:'probabilidad|posibilidades|posibilidad',certainty:'certeza', 'reported-information':'informaciones?|ideas?',prohibition:'prohibiciones?|prohibicion',obligation:'obligaciones?|obligacion','medical-interaction':'consultas? medicas?',narrative:'narraciones?|narracion|relatos?',advice:'consejos?',suggestion:'sugerencias?'}
 const combined=englishAlternativeGroups(task.requirementText,rows.map(c=>({...c,id:c.templateId.slice(6),match:matches[c.templateId.slice(6)]}))).map(group=>{
  if(group.length===1){const {id,match,...criterion}=group[0];return criterion}
  return row(group.map(c=>c.id).join('-or-'),group.map(c=>c.title).join(' o '),[0,1,2,3,4].map(i=>group.map(c=>c.progressionLevels![i]).join(' / ')+' Se valora únicamente la alternativa elegida.') as Parameters<typeof row>[2])
 })
 combined.push(...requestedGradeFiveGrammar(task.requirementText).map(f=>gradeFiveGrammarCriterion(f,task.requirementText,mode)))
 combined.push(...requestedGradeFiveLexicon(task.requirementText).map(f=>gradeFiveLexicalCriterion(f,task.requirementText,mode)))
 combined.push(...gradeFiveStrategyCriteria(task.requirementText,mode))
 combined.push(...gradeFiveContextCriteria(task,combined))
 combined.push(...gradeFiveGenreCriteria(task.requirementText,mode,combined))
 if(combined.length)combined.push(...upperEnglishCommunication(task,'ing-5'))
 return combined
}
const provider=createUpperEnglishProvider({grade:5,functions:requestedGradeFiveFunctions,criteria:fifthGradeEnglishContent})
export const commonFifthGradeEnglish=provider.common
export const resolveFifthGradeEnglishTask=provider.resolve
