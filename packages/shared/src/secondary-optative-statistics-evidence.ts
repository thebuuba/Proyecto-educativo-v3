import type {CommonMathTopic} from './secondary-math-common-types'
import {commonMathCriteria,type CommonMathTask} from './secondary-math-common'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'

export const statisticalVerbs='describ(?:e|en|ir|a|an)|simul(?:a|an|ar|e|en)|valid(?:a|an|ar|e|en)|revis(?:a|an|ar|e|en)|propon(?:e|en|er)|present(?:a|an|ar|e|en)|formul(?:a|an|ar|e|en)'
/** Only statistical imperatives absent from the common math negation vocabulary. */
export const statisticalRequirement=(value:string)=>value.replace(/\b(?:no\s+|sin\s+)(?:simul\w*|supong\w*|supon\w*|asum\w*|ejecut\w*|valid\w*|revis\w*)(?:(?!\bpero\b)[^.;\n])*/gi,'').replace(/,\s+(?=(?:organiza|analiza|presenta)\b)/gi,'. ')
export function selectStatisticalTopics(text:string,topics:CommonMathTopic[]):CommonMathTopic[]{
 let found=topics.filter(t=>new RegExp(`\\b(?:${t.match})\\b`).test(text)&&(!t.exclude||!new RegExp(t.exclude).test(text)))
 const has=(...ids:string[])=>found.some(t=>ids.includes(t.id))
 if(has('arithmetic-mean','geometric-mean','harmonic-mean','median','mode'))found=found.filter(t=>t.id!=='central')
 if(has('quartiles','quintiles','percentiles'))found=found.filter(t=>t.id!=='position')
 if(has('range','population-variance','sample-variance','variance','mean-deviation','standard-deviation'))found=found.filter(t=>t.id!=='dispersion')
 if(has('sample-size'))found=found.filter(t=>t.id!=='sample')
 if(has('correlation-coefficient'))found=found.filter(t=>t.id!=='correlation')
 if(has('sampling-distributions'))found=found.filter(t=>t.id!=='sampling')
 if(has('conditional','theoretical-probability','experimental-probability','probability-distributions','expectation'))found=found.filter(t=>t.id!=='probability')
 if(has('experimental-probability')&&/probabilidad experimental.*\b(?:con|a partir de)\b.*frecuencias/.test(text))found=found.filter(t=>t.id!=='frequencies')
 if(has('expectation')&&/esperanza(?: matematica)? de (?:la )?distribucion/.test(text))found=found.filter(t=>t.id!=='probability-distributions')
 if(found.length>1)found=found.filter(t=>t.id!=='statistics')
 return found
}
export function adaptStatisticalTask(task:CommonMathTask):CommonMathTask{
 const text=task.actions.map(a=>a.text).join(' ')
 const project=/\b(?:formul\w*|disen\w*|realiz\w*|desarroll\w*|elabor\w*)\s+(?:un\s+)?proyecto estadistico\b/.test(text)
 const activityType=project?'PROJECT':/\b(?:present\w*|expon\w*)\s+oralmente\b/.test(text)?'ORAL_PRESENTATION':/\b(?:elabor\w*|escrib\w*|present\w*)\s+(?:un |el )?informe\b/.test(text)?'REPORT':task.activityType==='PROBLEM_SOLVING'?'PROBLEM_SOLVING':/\b(?:simul(?:a|an|ar)|organiz(?:a|an|ar)|estim(?:a|an|ar))\b/.test(text)?'EXERCISE_SET':task.activityType==='PROJECT'?'ANALYSIS':task.activityType
 return {...task,activityType,technique:project?'proyecto':activityType==='ORAL_PRESENTATION'?'exposicion-oral':activityType==='REPORT'?'analisis-producciones':task.technique}
}
type Action=CommonMathTask['actions'][number]
type Levels=ContextualTopicCriterion['progressionLevels']
function row(topic:CommonMathTopic,key:string,title:string,levels:Levels,weight=3):ContextualTopicCriterion{return {templateId:`mat-5-${topic.id}-${key}`,title,observable:levels[0],progressionLevels:levels,weight}}
function statisticalActionCriteria(action:Action,task:CommonMathTask):ContextualTopicCriterion[]{
 if(action.steps)return action.steps.flatMap(a=>statisticalActionCriteria(a,task))
 if(action.alternatives){
  const branches=action.alternatives.map(a=>statisticalActionCriteria(a,task))
  return [row(action.topics[0],'alternative','Cumplimiento de una alternativa estadística',[0,1,2,3,4].map(i=>`En la alternativa elegida: ${branches.map(rs=>rs.map(r=>r.progressionLevels[i]).join(' ')).join(' O BIEN: ')}`) as Levels)]
 }
 const text=action.text,topic=action.topics[0]
 if(!topic)return []
 if(/\b(?:fortalezas?|mejoras?)\b/.test(text))return [row(topic,'work-review','Fortaleza y mejora del trabajo concreto',[
  'Identifica una fortaleza y propone una mejora comprobable de la solución estadística dada, respaldadas por pasos o resultados concretos.',
  'La fortaleza y la mejora corresponden al trabajo dado; una referencia al procedimiento necesita precisión.',
  'Reconoce una fortaleza o una mejora pertinente, pero la evidencia del trabajo solo respalda parte de la revisión.',
  'La fortaleza o la mejora contradicen los pasos y resultados de la solución proporcionada.',
  'No aporta una fortaleza ni una mejora verificables del trabajo estadístico dado.',
 ])]
 if(/\bsimul(?:a|an|ar|e|en)\b/.test(text))return [row(topic,'simulation','Simulación del experimento aleatorio',[
  'Ejecuta la simulación según el protocolo y las repeticiones dados, conserva las frecuencias de los eventos y distingue la variación muestral de un valor teórico exacto.',
  'La simulación conserva el protocolo, las repeticiones y las frecuencias principales; un registro necesita precisión.',
  'Simula parte del experimento, pero omite repeticiones o registros necesarios para interpretar las frecuencias.',
  'Las frecuencias o las repeticiones no corresponden al protocolo del experimento dado.',
  'No aporta registros verificables de la simulación solicitada.',
 ],4)]
 if(/\bvalid(?:a|an|ar)\b/.test(text))return [row(topic,'validation','Contraste con la simulación proporcionada',[
  'Contrasta el resultado teórico con las frecuencias de la simulación proporcionada y considera su variación muestral, sin exigir igualdad exacta entre ambos.',
  'El contraste relaciona resultado teórico y simulación; una referencia a la variación muestral necesita precisión.',
  'Compara parcialmente el resultado y la simulación, pero no relaciona sus diferencias con la variación de las frecuencias.',
  'El contraste interpreta una diferencia muestral como prueba suficiente de que el modelo teórico es incorrecto.',
  'No contrasta el resultado teórico con la simulación proporcionada.',
 ])]
 if(/\bdescrib(?:e|en|ir)\b/.test(text))return action.topics.map(t=>row(t,'description',`Descripción de ${t.label}`,[
  `Describe ${t.relation} a partir del caso y las características proporcionadas.`,
  `La descripción de ${t.label} conserva las características principales; una referencia necesita precisión.`,
  `Describe parte de ${t.label}, pero confunde una característica necesaria para el caso.`,
  `La descripción de ${t.label} contradice los datos o las condiciones proporcionados.`,
  `No aporta una descripción verificable de ${t.label}.`,
 ]))
 if(/\b(?:elabor\w*|escrib\w*|present\w*)\s+(?:un |el )?informe\b/.test(text))return [row(topic,'report','Informe de resultados estadísticos',[
  'Comunica por escrito los resultados estadísticos y las conclusiones del trabajo dado, vinculándolos con los datos y los límites proporcionados.',
  'El informe comunica los resultados y las conclusiones principales; una referencia a los datos necesita precisión.',
  'El informe presenta parte de los resultados, pero no respalda una conclusión necesaria con los datos disponibles.',
  'Las conclusiones del informe contradicen los resultados estadísticos proporcionados.',
  'No aporta el informe escrito de resultados solicitado.',
 ])]
 if(/\b(?:present\w*|expon\w*)\s+oralmente\b/.test(text))return [row(topic,'oral-results','Comunicación oral de resultados estadísticos',[
  'Presenta oralmente los resultados estadísticos del trabajo dado y enlaza las conclusiones con los datos, mediante los apoyos acordados.',
  'La presentación permite comprender los resultados y las conclusiones; una relación con los datos necesita precisión.',
  'Comunica algunos resultados, pero deja ambigua su relación con las conclusiones del trabajo.',
  'La presentación atribuye a los resultados conclusiones incompatibles con los datos dados.',
  'No comunica los resultados estadísticos solicitados por el medio oral o los apoyos acordados.',
 ])]
 const safeText=text.replace(/\bmodelos?\b/g,'esquema').replace(/\bproyecto ya realizado\b/g,'trabajo ya realizado')
 let rows=commonMathCriteria({...task,actions:[{...action,text:safeText}]})
 if(/\bformul\w*\s+(?:un )?proyecto estadistico\b/.test(text))rows=[row(topic,'project','Formulación del proyecto estadístico',[
  'Formula la pregunta y el método del proyecto estadístico ficticio relacionándolos con los datos suministrados y los límites de sus conclusiones.',
  'La pregunta y el método son coherentes con los datos del proyecto; un límite necesita precisión.',
  'Formula parte del proyecto, pero la pregunta o el método no se relacionan suficientemente con los datos dados.',
  'La pregunta y el método del proyecto impiden responder con la información suministrada.',
  'No formula un proyecto estadístico reconocible con los datos proporcionados.',
 ],4)]
 if(/\b(?:antes|despues)\b/.test(text)&&/cambio|efecto/.test(text))rows=rows.map(r=>({...r,observable:r.observable+' Contrasta los valores de antes y después del cambio indicado.',progressionLevels:r.progressionLevels.map((s,i)=>i===0?s+' Contrasta los valores de antes y después del cambio indicado.':s) as Levels}))
 return rows
}
export const statisticalMathCriteria=(task:CommonMathTask)=>task.actions.flatMap(a=>statisticalActionCriteria(a,task))
