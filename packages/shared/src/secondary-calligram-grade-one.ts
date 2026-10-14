import {calligramCriteria} from './secondary-topics/language/calligram-grade-1-core'
import {normalizedTask} from './secondary-language-topics'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export const firstGradeCalligramModule={id:'caligrama',grade:1,subjectCode:'LEN',sourcePdfPages:[74],status:'PARTIAL_FIVE_ACTIVITY_FAMILIES',procedures:['385e0137-005c-5738-a4fb-123f43df0f51','6c34dfd7-f46b-53bd-bcc5-fbb783867a0e','b09eae34-ec2a-579a-a86f-e0c2e7e020ea','6386112a-44b3-5b36-9416-1f31d2540550']}
export const isFirstGradeCalligramActivity=(activity:string)=>['CALLIGRAM_CREATION','CALLIGRAM_ANALYSIS','CALLIGRAM_COMPARISON','CALLIGRAM_RECITATION','CALLIGRAM_EXPLANATION','WRITTEN_PRODUCTION','ARTISTIC_PRODUCTION','ANALYSIS','COMPARISON','ORAL_PRESENTATION','EXPOSITION'].includes(activity)
type Lower=[string,string,string,string]
const lower:Record<string,Lower>={
  relation:['La figura se relaciona con el mensaje; una disposición de palabras necesita ajuste.','La figura es reconocible, pero solo parte de las palabras se vincula con el mensaje.','La figura contradice o desvía el mensaje del poema.','No establece una relación reconocible entre palabras, figura y mensaje.'],
  expression:['Las palabras comunican el mensaje del poema; una expresión necesita precisión.','El mensaje se reconoce parcialmente, pero algunas expresiones resultan incoherentes.','Las expresiones contradicen el mensaje que el poema pretende comunicar.','No comunica un mensaje reconocible mediante el texto poético.'],
  visual:['La disposición construye una figura legible; un fragmento necesita ajuste.','La figura se reconoce, pero la distribución dificulta leer partes del poema.','La disposición impide relacionar palabras y figura o seguir el poema.','No organiza las palabras en una figura legible.'],
  resources:['El vocabulario se vincula con el tema y mensaje; una expresión necesita ajuste.','Parte del vocabulario o de los recursos elegidos se vincula con el mensaje.','Las palabras o recursos contradicen el sentido que el poema pretende comunicar.','No emplea vocabulario reconocible para comunicar el tema del poema.'],
  revision:['La versión presenta coherencia y convenciones claras; un detalle necesita ajuste.','Algunas inconsistencias o errores dificultan relacionar texto y figura.','Las inconsistencias y errores impiden comprender el poema visual.','No presenta una versión comprensible del texto y su figura.'],
  intention:['Explica la intención expresada en el poema; una relación necesita precisión.','Reconoce parte de la intención, pero la confunde con un elemento secundario.','La intención atribuida contradice palabras o rasgos del caligrama.','No identifica la intención expresada en el caligrama.'],
  evidence:['Los versos y rasgos citados sostienen la interpretación; un vínculo necesita desarrollo.','Cita elementos del caligrama sin vincularlos suficientemente con su interpretación.','Los elementos citados contradicen o no sostienen la interpretación.','No aporta elementos del caligrama que sostengan su interpretación.'],
  message:['Contrasta los mensajes de ambos poemas; una diferencia necesita precisión.','Describe mensajes de ambos caligramas sin compararlos suficientemente.','Atribuye a un caligrama el mensaje del otro.','No compara los mensajes de los caligramas.'],
  figure:['Contrasta la relación texto-figura de ambos poemas; un vínculo necesita precisión.','Describe las figuras sin relacionarlas suficientemente con los textos.','El contraste confunde palabras, figuras o sentidos entre los caligramas.','No compara la relación entre texto y figura de ambos caligramas.'],
  conclusion:['La conclusión se apoya en el contraste; una relación necesita precisión.','La conclusión retoma solo parte de la comparación realizada.','La conclusión contradice los poemas o el contraste presentado.','No formula una conclusión sobre la comparación.'],
  clarity:['Comunica el texto de forma comprensible; una expresión necesita precisión.','Comunica fragmentos comprensibles, pero algunas partes del texto quedan confusas.','La comunicación confunde palabras o relaciones centrales del poema.','No comunica un texto reconocible mediante la recitación o el apoyo acordado.'],
  meaning:['La recitación comunica el sentido del poema; una relación necesita precisión.','Comunica ideas aisladas, pero pierde parte del sentido global del poema.','La interpretación comunicada contradice el mensaje del poema.','No comunica un sentido reconocible del poema.'],
  decisions:['Explica cómo las decisiones apoyan el mensaje; una relación necesita precisión.','Enumera decisiones, pero justifica parcialmente su relación con el mensaje.','Las razones ofrecidas contradicen las decisiones poéticas o visuales.','No explica las decisiones del caligrama.'],
  feelings:['Explica las ideas o sentimientos representados; una relación con el texto necesita precisión.','Reconoce ideas o sentimientos, pero explica parcialmente cómo se representan.','La explicación atribuye al poema ideas o sentimientos incompatibles con su contenido.','No explica las ideas o sentimientos representados en el poema.'],
  oral:['La explicación comunica las decisiones del caligrama; una expresión necesita precisión.','Se comprenden algunas decisiones, pero la explicación deja relaciones incompletas.','La explicación confunde las decisiones y el sentido del poema visual.','No comunica una explicación comprensible del caligrama mediante la exposición o el apoyo acordado.'],
  individual:['Responde sobre el proceso o producto con ejemplos; una relación necesita precisión.','Responde parcialmente y relaciona solo algunas ideas con su caligrama.','Las respuestas contradicen el proceso o producto presentado.','No ofrece respuestas reconocibles sobre el caligrama.'],
}
const analysisLower:Record<string,Lower>={
  relation:['Explica la relación entre palabras, figura y mensaje; un vínculo necesita precisión.','Reconoce palabras y figura, pero explica parcialmente cómo se relacionan.','Atribuye a la figura un significado incompatible con las palabras del poema.','No interpreta la relación entre palabras, figura y mensaje.'],
  resources:['Identifica recursos presentes y explica su efecto; una relación necesita precisión.','Reconoce recursos, pero explica parcialmente su efecto en el poema.','Confunde los recursos o les atribuye efectos incompatibles con el texto.','No identifica ni explica recursos expresivos presentes en el poema.'],
  visual:['Explica cómo la disposición contribuye al sentido; una relación necesita precisión.','Describe la organización visual sin explicar suficientemente su efecto.','Atribuye a la disposición un efecto incompatible con el poema.','No explica la contribución de la organización visual al sentido.'],
}
const comparisonLower:Record<string,Lower>={
  resources:['Contrasta el vocabulario y los recursos presentes; una diferencia necesita precisión.','Enumera recursos de ambos poemas sin contrastarlos suficientemente.','Confunde los recursos de los caligramas o sus efectos.','No compara el vocabulario ni los recursos presentes.'],
  visual:['Contrasta la disposición y legibilidad con ejemplos; un vínculo necesita precisión.','Describe ambas disposiciones sin establecer diferencias relevantes.','La comparación atribuye a un poema la organización visual del otro.','No compara la organización visual de ambos caligramas.'],
}

export function firstGradeCalligramCriteria(activity:string,description:string):ContextualTopicCriterion[] {
  if(!isFirstGradeCalligramActivity(activity)) return []
  const mode=activity==='ANALYSIS'?'CALLIGRAM_ANALYSIS':activity==='COMPARISON'?'CALLIGRAM_COMPARISON':['ORAL_PRESENTATION','EXPOSITION'].includes(activity)?'CALLIGRAM_EXPLANATION':activity
  const task=normalizedTask(description)
  let rows=calligramCriteria(mode,description)
  if(mode==='CALLIGRAM_RECITATION') rows=rows.filter(row=>!['calligram-individual','calligram-fluency'].includes(row.templateId))
  else if(!/preguntas/.test(task)) rows=rows.filter(row=>row.templateId!=='calligram-individual')
  if(mode==='CALLIGRAM_EXPLANATION'&&!/ideas|sentimientos|emociones/.test(task)) rows=rows.filter(row=>row.templateId!=='calligram-feelings')
  if(mode==='CALLIGRAM_COMPARISON'&&!/conclu/.test(task)) rows=rows.filter(row=>row.templateId!=='calligram-conclusion')
  if(mode==='CALLIGRAM_ANALYSIS') {
    const focus={relation:/funcion|estructura|imagen visual|relacion|texto|figura|palabras.*mensaje/,intention:/tema del poema|intencion|sentimientos|emociones/,resources:/recursos|figuras literarias|vocabulario|metafora|anafora|epiteto|personific|comparacion/,visual:/organizacion|tipograf|disposicion|legibilidad/,evidence:/evidencia|justific|versos.*rasgos|sustent|ejemplos/}
    if(Object.values(focus).some(pattern=>pattern.test(task))) rows=rows.filter(row=>focus[row.templateId.replace('calligram-','') as keyof typeof focus]?.test(task))
  }
  return rows.map(row=>{
    const id=row.templateId.replace('calligram-','')
    let observable=row.observable, title=row.title, progression=lower[id]
    if(mode==='CALLIGRAM_ANALYSIS') progression=analysisLower[id]??progression
    if(mode==='CALLIGRAM_COMPARISON') progression=comparisonLower[id]??progression
    if(mode==='CALLIGRAM_COMPARISON'&&id==='message') observable='Compara los temas y mensajes representados en ambos caligramas.'
    if(mode==='CALLIGRAM_RECITATION'&&id==='expression') {
      observable='Usa pausas y expresión que permiten comunicar el mensaje del poema mediante la recitación o el apoyo acordado.'
      progression=['Las pausas y la expresión apoyan el mensaje; una relación necesita precisión.','La expresión comunica parte del mensaje, pero algunas pausas dificultan relacionar las ideas.','Las pausas o la expresión confunden el sentido del poema.','No comunica una relación reconocible entre expresión y mensaje.']
    }
    if(id==='clarity') observable='Comunica el texto de manera comprensible mediante la recitación o el apoyo acordado.'
    if(id==='oral') observable='Explica sus decisiones de forma ordenada y comprensible mediante la exposición o el apoyo acordado.'
    if(id==='individual') title='Respuestas sobre el proceso y el producto'
    if(id==='feelings') observable='Explica las ideas o sentimientos representados en el poema mediante sus palabras y su figura; pueden ser ficticios.'
    if(id==='intention') {title='Intención comunicativa del poema';observable='Explica la intención y, cuando corresponda, los sentimientos expresados por el texto del caligrama.'}
    if(id==='resources'&&!mode.includes('ANALYSIS')&&!mode.includes('COMPARISON')&&!/recursos|figuras literarias|metafora|anafora|epiteto|personific/.test(task)) observable='Usa vocabulario pertinente para comunicar el tema y mensaje del poema.'
    if(id==='resources'&&/verso libre/.test(task)&&!observable.includes('sin exigir rima')) observable=observable.replace(/\.$/,'')+' en verso libre, sin exigir rima.'
    if(id==='revision'&&!/revis|borrador|correg/.test(task)) {title='Coherencia y convenciones del poema';observable='Presenta palabras, figura y convenciones de escritura que permiten comprender el poema visual.'}
    return {...row,title,observable,progressionLevels:[observable,...progression]}
  })
}
