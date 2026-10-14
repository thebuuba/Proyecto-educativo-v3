import {posterCriteria} from './secondary-topics/language/poster-grade-1-core'
import {normalizedTask} from './secondary-language-topics'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export const firstGradePosterModule={id:'el-afiche',grade:1,subjectCode:'LEN',sourcePdfPages:[72],status:'PARTIAL_FOUR_ACTIVITY_FAMILIES',procedures:['e391ba43-d01f-56b5-969c-625e7c715d49','156d82cc-d619-56fa-8bb9-3563fb155b3f','75ccb373-3eb0-5d30-af1f-714caffce54d']}
export const isFirstGradePosterActivity=(activity:string)=>['POSTER_CREATION','POSTER_ANALYSIS','POSTER_COMPARISON','POSTER_PRESENTATION','WRITTEN_PRODUCTION','ANALYSIS','COMPARISON','ORAL_PRESENTATION','EXPOSITION'].includes(activity)
const lower: Record<string,[string,string,string,string]>={
  message:['El mensaje comunica la idea central; una expresión necesita precisión.','El mensaje es reconocible, pero contiene ideas ambiguas o ajenas al propósito.','El mensaje contradice o confunde el tema y la acción que pretende comunicar.','No comunica un mensaje reconocible del afiche.'],
  audience:['El vocabulario y la acción corresponden al público; una expresión requiere ajuste.','El público se reconoce, pero parte del lenguaje o la acción no se adecua a él.','El lenguaje y la acción contradicen las necesidades del público previsto.','No permite reconocer a quién se dirige el afiche.'],
  persuasion:['Los argumentos o expresiones apoyan el mensaje; una relación necesita precisión.','Usa expresiones para convencer, pero algunas no sustentan el mensaje.','Los argumentos contradicen el mensaje o presentan datos inventados como hechos.','No aporta argumentos ni recursos persuasivos reconocibles.'],
  visuals:['El recurso visual se vincula con el texto; una relación necesita mayor claridad.','Texto y recurso visual se relacionan parcialmente y compiten por comunicar la idea.','El recurso visual contradice o desvía el mensaje del texto.','No presenta el recurso visual solicitado ni una relación reconocible con el texto.'],
  legibility:['El texto se lee y se organiza con claridad; un detalle de escritura necesita ajuste.','La organización o varios errores dificultan comprender partes importantes del afiche.','La distribución o la escritura impiden seguir el mensaje principal.','No presenta un texto legible y organizado para comunicar el mensaje.'],
  purpose:['Reconoce la intención; una relación con el destinatario necesita precisión.','Identifica parte de la intención, pero la confunde con un dato secundario.','Atribuye al afiche una intención incompatible con su contenido.','No identifica el propósito comunicativo del afiche.'],
  comparison:['El contraste reconoce las diferencias principales; una relación necesita desarrollo.','Enumera elementos de ambos afiches sin establecer una comparación suficiente.','El contraste atribuye a un afiche el mensaje o recurso del otro.','No establece una comparación reconocible de los afiches.'],
  effectiveness:['Valora la eficacia a partir del mensaje y público; una justificación es incompleta.','Expresa una preferencia, pero relaciona solo parte de ella con la eficacia comunicativa.','La valoración contradice los mensajes o los destinatarios de los afiches.','No formula una valoración sobre cuál comunica mejor.'],
  evidence:['La interpretación usa elementos concretos; una relación necesita explicación.','Menciona elementos del afiche sin vincularlos suficientemente con su interpretación.','Los elementos citados no sostienen o contradicen la interpretación presentada.','No aporta elementos del afiche que sustenten su interpretación.'],
  decisions:['Explica las decisiones y su relación con el propósito; una necesita precisión.','Enumera decisiones, pero justifica solo algunas por su relación con el mensaje.','Las razones ofrecidas contradicen las decisiones comunicativas del afiche.','No explica las decisiones comunicativas de su afiche.'],
  oral:['La exposición o el apoyo acordado permite comprender las ideas; una transición requiere ajuste.','Se comprenden ideas aisladas, pero el orden dificulta relacionarlas.','La exposición confunde el mensaje del afiche y las decisiones que intenta explicar.','No comunica una explicación comprensible del afiche mediante la exposición o el apoyo acordado.'],
  individual:['Explica con sus palabras las ideas del afiche; una relación necesita precisión.','Repite información del afiche sin explicar parte de su significado.','La explicación contradice el contenido del afiche presentado.','No ofrece una explicación reconocible del contenido presentado.'],
}

const analysisLower: Record<string,[string,string,string,string]>={
  message:['Explica la idea central; una relación con el contenido necesita precisión.','Reconoce parte del mensaje, pero confunde una idea relevante con información secundaria.','La explicación atribuye al afiche un mensaje incompatible con su contenido.','No ofrece una interpretación reconocible del mensaje del afiche.'],
  persuasion:['Identifica los recursos persuasivos y explica su función; una relación necesita precisión.','Reconoce algunos recursos, pero explica parcialmente cómo buscan convencer.','Confunde los recursos persuasivos o les atribuye una función incompatible con el mensaje.','No identifica ni explica recursos persuasivos del afiche leído.'],
  visuals:['Explica la relación entre el recurso presente y el mensaje; un vínculo necesita desarrollo.','Describe el recurso visual sin explicar suficientemente su relación con el texto.','Atribuye al recurso visual un sentido incompatible con el mensaje del afiche.','No explica la relación entre los recursos presentes y el mensaje.'],
}
const comparisonLower: Record<string,[string,string,string,string]>={
  purpose:['Compara las intenciones y destinatarios; una relación necesita precisión.','Identifica algunas intenciones o destinatarios sin contrastarlos suficientemente.','El contraste atribuye a un afiche la intención o el destinatario del otro.','No compara las intenciones y destinatarios de los afiches.'],
  visuals:['Contrasta los recursos presentes y su relación con los mensajes; un vínculo necesita precisión.','Enumera los recursos de ambos afiches sin explicar diferencias relevantes.','El contraste confunde los recursos o les atribuye efectos incompatibles con los mensajes.','No establece una comparación de los recursos visuales presentes.'],
}

export function firstGradePosterCriteria(activity:string,_title:string,description:string): ContextualTopicCriterion[] {
  if(!isFirstGradePosterActivity(activity)) return []
  const task=normalizedTask(description)
  const mode=activity==='ANALYSIS'?'POSTER_ANALYSIS':activity==='COMPARISON'?'POSTER_COMPARISON':['ORAL_PRESENTATION','EXPOSITION'].includes(activity)?'POSTER_PRESENTATION':activity
  const creating=mode==='POSTER_CREATION'||mode==='WRITTEN_PRODUCTION'
  const visual=/imagen|simbolo|fotograf|elementos visuales|color|tipograf|tipo de letra/.test(task)&&!/solo texto|sin imagen|sin recursos visuales/.test(task)
  let rows=posterCriteria(mode,'',description)
  if(!visual) rows=rows.filter(row=>row.templateId!=='poster-visuals')
  if(mode==='POSTER_PRESENTATION'&&!/preguntas/.test(task)) rows=rows.filter(row=>row.templateId!=='poster-individual')
  if(mode==='POSTER_COMPARISON'&&!/proposito|publico|destinatario|intencion/.test(task)) rows=rows.filter(row=>row.templateId!=='poster-purpose')
  if(mode==='POSTER_ANALYSIS') {
    const focus={purpose:/funcion|situacion comunicativa|proposito|intencion|destinatario|publico/,message:/mensaje|idea principal|sentido/,persuasion:/persua|argument|convencer|recursos/,visuals:/estructura|imagen|color|visual|tipograf/,evidence:/evidencia|justific|sustent|ejemplos|inferen/}
    const explicit=Object.values(focus).some(pattern=>pattern.test(task))
    if(explicit) rows=rows.filter(row=>focus[row.templateId.replace('poster-','') as keyof typeof focus]?.test(task))
  }
  return rows.map(row=>{
    const id=row.templateId.replace('poster-','')
    let observable=row.observable
    let title=row.title
    if(id==='purpose'&&mode==='POSTER_ANALYSIS'&&!/publico|destinatario/.test(task)) {title='Propósito del afiche';observable='Identifica e interpreta la intención comunicativa del afiche a partir de su contenido.'}
    if(id==='message'&&mode==='POSTER_ANALYSIS'&&!/inferen/.test(task)) observable='Explica la idea central y el sentido del mensaje del afiche leído.'
    if(id==='decisions'&&!visual) observable='Justifica las decisiones de redacción y organización del mensaje en relación con el propósito del afiche.'
    if(id==='evidence'&&!visual) observable=mode==='POSTER_COMPARISON'?'Sustenta su valoración con palabras o frases concretas de ambos afiches.':'Justifica su interpretación con palabras o frases concretas del afiche leído.'
    if(id==='visuals') observable=creating
      ? /imagen\s+o\s+simbolo/.test(task) ? 'Relaciona el texto con la alternativa visual elegida: imagen o símbolo.' : 'Relaciona el texto con el recurso visual solicitado para comunicar el mensaje.'
      : 'Explica o contrasta cómo los recursos visuales presentes contribuyen al mensaje, según la consigna.'
    if(id==='oral') observable='Comunica la explicación del afiche en un orden comprensible mediante la exposición o el apoyo acordado.'
    if(id==='message'&&mode==='POSTER_PRESENTATION') observable=observable.replace('con precisión ','')
    let progression: [string,string,string,string] = id==='purpose'&&!/publico|destinatario/.test(task)
      ? ['Reconoce la intención del afiche; una relación con su contenido necesita precisión.',lower.purpose[1],lower.purpose[2],lower.purpose[3]]
      : lower[id]
    if(mode==='POSTER_ANALYSIS') progression=analysisLower[id]??progression
    if(mode==='POSTER_COMPARISON') progression=comparisonLower[id]??progression
    if(mode==='POSTER_PRESENTATION'&&id==='message') progression=analysisLower.message
    if(mode==='POSTER_PRESENTATION'&&id==='audience') progression=['Explica la relación entre público y propósito; una relación necesita precisión.','Reconoce el público, pero explica parcialmente cómo se vincula con el mensaje.','La explicación atribuye al afiche un público incompatible con su propósito.','No explica a quién se dirige el afiche ni su relación con el propósito.']
    return {...row,title,observable,progressionLevels:[observable,...progression]}
  })
}
