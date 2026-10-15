import {englishGradeOneStrategies,englishStrategyCriteria} from './secondary-english-grade-one-strategies'
import {englishGradeTwoStrategies} from './secondary-english-grade-two-strategies'

/** PDF146–148: the observable procedures coincide with second except that
 * comprehension is explicit here and the cultural comparison has four own aspects. */
export const englishGradeThreeStrategies=[...englishGradeTwoStrategies.filter(s=>s.id!=='cultural-comparison'),
 englishGradeOneStrategies.find(s=>s.id==='understanding')!,
 {...englishGradeOneStrategies.find(s=>s.id==='cultural-comparison')!,modes:['reading','listening','writing','oral','interaction','comparison']},
]
export function requestedGradeThreeStrategies(text:string,mode?:string){
 const resolvedMode=mode&&['analysis','comparison','research'].includes(mode)?'reading':mode
 return englishGradeThreeStrategies.filter(s=>(!resolvedMode||s.modes.includes(resolvedMode))&&new RegExp(`\\b(?:${s.match})\\b`).test(text))
}
export function gradeThreeStrategyCriteria(text:string,mode:string){
 const selected=requestedGradeThreeStrategies(text,mode)
 return englishStrategyCriteria(text,['analysis','comparison','research'].includes(mode)?'reading':mode,'ing-3',selected).map(row=>{
  if(!row.templateId.endsWith('cultural-comparison'))return row
  const aspects=[['advertencias','las advertencias de los ejemplos'],['prohibiciones','las prohibiciones de los ejemplos'],['medioambiente|medio ambiente','el cuidado del medioambiente'],['historias','las historias de los ejemplos'],['leyendas','las leyendas de los ejemplos'],['tradiciones','las tradiciones de los ejemplos']].filter(([match])=>new RegExp(match).test(text)).map(([,label])=>label)
  if(!aspects.length)return row
  const levels=row.progressionLevels!.map(level=>level.replace('los aspectos solicitados',aspects.join(' y '))) as NonNullable<typeof row.progressionLevels>
  return {...row,observable:levels[0],progressionLevels:levels}
 })
}
