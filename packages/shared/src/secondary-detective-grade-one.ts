import {detectiveStoryCriteria} from './secondary-topics/language/detective-story-grade-1-core'
import {normalizedTask} from './secondary-language-topics'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export const firstGradeDetectiveModule={id:'cuento-policiaco',grade:1,subjectCode:'LEN',sourcePdfPages:[73],status:'PARTIAL_FIVE_ACTIVITY_FAMILIES',procedures:['07dcf12a-5015-52c7-996d-61a5b9a6244b','caeca724-f16b-5730-be70-d3e671ae7840','caaa246b-f525-5292-8ed0-0fd2e8309566','28865ef6-91d3-5df9-b417-0a81f880732a']}
export const isFirstGradeDetectiveActivity=(activity:string)=>['DETECTIVE_STORY_WRITING','DETECTIVE_STORY_ANALYSIS','DETECTIVE_STORY_COMPARISON','DETECTIVE_STORY_NARRATION','DETECTIVE_STORY_ANALYSIS_PRESENTATION','WRITTEN_PRODUCTION','ANALYSIS','COMPARISON','ORAL_PRESENTATION','EXPOSITION'].includes(activity)
type Lower=[string,string,string,string]
const lower: Record<string,Lower>={
  structure:['Los tres momentos se relacionan; una transición necesita precisión.','Se reconocen los momentos, pero una relación entre acciones queda incompleta.','El orden de los hechos contradice la evolución del conflicto.','No presenta una secuencia reconocible de inicio, nudo y desenlace.'],
  mystery:['Las pistas conducen a la resolución; una relación causal necesita precisión.','Parte de las pistas se relaciona con la resolución, pero quedan hechos sin explicar.','La resolución contradice las pistas o las acciones del relato.','No establece una relación reconocible entre misterio, pistas y resolución.'],
  characters:['Las acciones y el ambiente corresponden a los personajes; un vínculo necesita desarrollo.','Describe personajes y ambiente, pero parte de las acciones no se vincula con ellos.','Las caracterizaciones o el ambiente contradicen acciones centrales de la trama.','No presenta personajes y ambiente reconocibles para la trama.'],
  narrator:['La perspectiva del narrador se mantiene; una expresión necesita ajuste.','El narrador se reconoce, pero cambia de perspectiva sin aclararlo.','Los cambios de perspectiva contradicen la información que el narrador puede conocer.','No permite reconocer quién narra ni una perspectiva consistente.'],
  revision:['La cohesión y las convenciones permiten comprender el relato; un detalle requiere ajuste.','Los conectores o varios errores dificultan relacionar partes del relato.','La falta de cohesión y los errores impiden seguir hechos centrales.','No presenta un texto suficientemente comprensible para seguir la trama.'],
  clues:['Relaciona las pistas con el desenlace; una explicación necesita precisión.','Reconoce pistas, pero explica parcialmente cómo conducen al desenlace.','Atribuye a una pista un efecto incompatible con los hechos del texto.','No relaciona pistas del cuento con su desenlace.'],
  resources:['Identifica el recurso y explica su efecto; una relación necesita precisión.','Identifica recursos, pero explica parcialmente su efecto en la narración.','Confunde los recursos o les atribuye efectos incompatibles con el texto.','No identifica ni explica recursos narrativos presentes.'],
  setting:['Explica cómo el ambiente se relaciona con los hechos; un vínculo necesita precisión.','Reconoce el ambiente, pero explica parcialmente su relación con la historia.','La explicación atribuye al ambiente efectos incompatibles con los hechos del cuento.','No explica la relación entre el ambiente y los hechos.'],
  evidence:['Los ejemplos sostienen la interpretación; una relación necesita explicación.','Incluye ejemplos, pero solo algunos se vinculan con la interpretación.','Los ejemplos contradicen o no sostienen la interpretación presentada.','No aporta ejemplos del cuento que sostengan su interpretación.'],
  sequence:['La narración permite seguir los tres momentos; una transición requiere ajuste.','Se comprenden hechos aislados, pero algunos vínculos temporales quedan incompletos.','El orden narrado confunde los hechos y la resolución del conflicto.','No comunica una secuencia reconocible del cuento.'],
  voice:['Diferencia las voces solicitadas; una intervención necesita claridad.','Diferencia algunas intervenciones, pero confunde otras voces del relato.','Las voces representadas atribuyen intervenciones al personaje equivocado.','No diferencia las intervenciones solicitadas.'],
  language:['El vocabulario y los vínculos entre hechos permiten comprender el relato; un detalle necesita precisión.','El vocabulario o los vínculos entre hechos dificultan comprender partes del relato.','Las expresiones confunden hechos centrales de la narración.','No comunica los hechos del cuento de manera comprensible.'],
  individual:['Responde sobre los hechos o interpretación con apoyo textual; una relación necesita precisión.','Responde parcialmente y relaciona solo algunas ideas con el cuento.','Las respuestas contradicen los hechos del cuento.','No ofrece respuestas reconocibles sobre el cuento.'],
  comparison:['Contrasta los misterios y la organización; una diferencia necesita precisión.','Enumera hechos de ambos cuentos sin relacionar suficientemente semejanzas y diferencias.','Atribuye a un cuento los hechos o la organización del otro.','No establece una comparación reconocible de las tramas.'],
  resolution:['Contrasta cómo se resuelven los misterios; una relación con las pistas necesita desarrollo.','Describe ambos desenlaces, pero los compara parcialmente con las pistas.','Confunde las pistas y desenlaces de los cuentos comparados.','No compara las resoluciones de ambos misterios.'],
  conclusion:['La conclusión se apoya en el contraste; una relación necesita precisión.','Formula una conclusión, pero solo parte de ella se sostiene en la comparación.','La conclusión contradice los cuentos o las diferencias presentadas.','No formula una conclusión sobre la comparación realizada.'],
  analysis:['Explica los aspectos solicitados del cuento; una relación necesita precisión.','Reconoce aspectos aislados, pero explica parcialmente sus relaciones.','La explicación contradice aspectos centrales del cuento analizado.','No presenta una interpretación reconocible de los aspectos solicitados.'],
  organization:['Diferencia resumen e interpretación en una secuencia comprensible; una transición necesita ajuste.','El orden permite comprender algunas ideas, pero confunde partes del resumen y análisis.','La secuencia confunde los hechos del cuento y la interpretación presentada.','No organiza una explicación comprensible del análisis.'],
  oral:['La explicación o el apoyo acordado comunica el análisis; una expresión necesita precisión.','Se comprenden ideas aisladas, pero expresiones ambiguas dificultan relacionarlas.','La explicación confunde el sentido de las ideas del análisis.','No comunica una explicación comprensible mediante la exposición o el apoyo acordado.'],
}
const analysisLower: Record<string,Lower>={
  structure:['Explica cómo progresa el conflicto en los tres momentos; una relación necesita precisión.','Reconoce los momentos, pero explica parcialmente cómo progresa el misterio.','La interpretación confunde el orden y la evolución del conflicto.','No interpreta la estructura del cuento leído.'],
  narrator:['Identifica el narrador y explica su perspectiva; una relación necesita precisión.','Reconoce quién narra, pero explica parcialmente su perspectiva.','Confunde al narrador con un personaje o le atribuye una perspectiva incompatible con el texto.','No identifica al narrador ni su perspectiva.'],
  characters:['Relaciona acciones y motivaciones con el conflicto; un vínculo necesita precisión.','Reconoce acciones de los personajes, pero explica parcialmente su contribución al conflicto.','Atribuye a los personajes acciones o motivaciones incompatibles con el texto.','No explica cómo los personajes contribuyen al conflicto.'],
}

export function firstGradeDetectiveCriteria(activity:string,description:string):ContextualTopicCriterion[] {
  if(!isFirstGradeDetectiveActivity(activity)) return []
  const mode=activity==='ANALYSIS'?'DETECTIVE_STORY_ANALYSIS':activity==='COMPARISON'?'DETECTIVE_STORY_COMPARISON':['ORAL_PRESENTATION','EXPOSITION'].includes(activity)?'DETECTIVE_STORY_ANALYSIS_PRESENTATION':activity
  const task=normalizedTask(description)
  let rows=detectiveStoryCriteria(mode)
  if(!/preguntas/.test(task)) rows=rows.filter(row=>row.templateId!=='detective-individual')
  if(mode==='DETECTIVE_STORY_NARRATION'&&!/voces|voz.*diferenci|dramatiz|tono|volumen|ritmo/.test(task)) rows=rows.filter(row=>row.templateId!=='detective-voice')
  if(mode==='DETECTIVE_STORY_COMPARISON'&&!/conclu/.test(task)) rows=rows.filter(row=>row.templateId!=='detective-conclusion')
  if(mode==='DETECTIVE_STORY_ANALYSIS') {
    const focus={structure:/estructura|inicio|nudo|trama/,narrator:/narrador/,characters:/personajes/,setting:/ambiente/,clues:/pistas|desenlace|resolucion/,resources:/recursos|literarios|linguisticos|metafora|adjetivo|conectores/,evidence:/evidencia|ejemplos|justific|sustent/}
    if(Object.values(focus).some(pattern=>pattern.test(task))) rows=rows.filter(row=>focus[row.templateId.replace('detective-','') as keyof typeof focus]?.test(task))
  }
  return rows.map(row=>{
    const id=row.templateId.replace('detective-','')
    let observable=row.observable, title=row.title
    let progression=lower[id]
    if(mode==='DETECTIVE_STORY_ANALYSIS') {
      progression=analysisLower[id]??progression
    }
    if(mode==='DETECTIVE_STORY_ANALYSIS_PRESENTATION'&&id==='analysis') {
      const aspects=[/trama|estructura/.test(task)?'la trama':null,/narrador/.test(task)?'el narrador':null,/personajes/.test(task)?'los personajes':null,/ambiente/.test(task)?'el ambiente':null,/pistas|misterio|desenlace/.test(task)?'las pistas y la resolución del misterio':null].filter(Boolean)
      observable=aspects.length?`Explica ${aspects.join(', ')} y sus relaciones en el cuento.`:'Explica su interpretación del cuento y las relaciones entre los hechos relevantes.'
    }
    if(mode==='DETECTIVE_STORY_COMPARISON'&&id==='characters') {
      if(!/ambiente/.test(task)) {title='Comparación de personajes';observable='Compara las acciones y motivaciones de los personajes con ejemplos de ambos cuentos.'}
      progression=['Compara los personajes con ejemplos de ambos cuentos; una diferencia necesita precisión.','Describe personajes de ambos cuentos sin contrastarlos suficientemente.','La comparación confunde personajes entre los cuentos.','No compara personajes de los cuentos.']
    }
    if(mode==='DETECTIVE_STORY_NARRATION'&&id==='language') observable='Comunica los hechos del cuento con vocabulario comprensible y vínculos claros entre las ideas.'
    if(id==='voice') observable='Diferencia las intervenciones de narrador y personajes mediante el recurso expresivo solicitado o el apoyo acordado.'
    if(id==='revision'&&!/revis|borrador|correg/.test(task)) {title='Cohesión y convenciones del texto';observable='Usa vínculos claros entre los hechos, puntuación y ortografía que permiten comprender el cuento.'}
    if(id==='oral') observable='Comunica el análisis de manera comprensible mediante la exposición o el apoyo acordado.'
    return {...row,title,observable,progressionLevels:[observable,...progression]}
  })
}
