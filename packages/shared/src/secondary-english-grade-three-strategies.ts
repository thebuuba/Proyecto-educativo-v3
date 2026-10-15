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
  if(row.templateId.endsWith('understanding')&&/comprend\w* y que (?:necesit\w*|no comprend\w*)/.test(text)){
   const levels=[row.progressionLevels![0].replace('o qué necesita aclarar','y qué necesita aclarar'),...row.progressionLevels!.slice(1)] as NonNullable<typeof row.progressionLevels>
   return {...row,observable:levels[0],progressionLevels:levels}
  }
  if(!row.templateId.endsWith('cultural-comparison'))return row
  const aspects=[['advertencias|prohibiciones|senales','las advertencias y prohibiciones de las señales indicadas'],['medioambiente|medio ambiente','el cuidado del medioambiente'],['historias|leyendas','las historias y leyendas de los ejemplos'],['tradiciones','las tradiciones de los ejemplos']].filter(([match])=>new RegExp(match).test(text)).map(([,label])=>label)
  if(!aspects.length)return row
  const levels=row.progressionLevels!.map(level=>level.replace('los aspectos solicitados',aspects.join(' y '))) as NonNullable<typeof row.progressionLevels>
  return {...row,observable:levels[0],progressionLevels:levels}
 })
}
