import {readFileSync,writeFileSync} from 'node:fs'
import {editableFallbackRecommendation} from '../../apps/frontend/src/modules/activities/services/instrumentPreparation.ts'
const grade=Number(process.argv[3]??1),fixtures=JSON.parse(readFileSync(`data/evaluation-instruments/math-grade-${grade}-contracts.json`,'utf8'))
const academicContext={level:'SECONDARY',grade,subjectCode:'MAT',subjectName:'Matemática'}
const cases=fixtures.flatMap(f=>[f,...(f.variants??[]).map(v=>({...v,id:f.id}))])
const examples=cases.flatMap(f=>['rubrica','lista-cotejo','escala','lista-ponderada'].map(instrumentType=>{
  const p=editableFallbackRecommendation({activityTitle:'Actividad',description:f.description,maxScore:17.35,participationMode:'INDIVIDUAL',instrumentType,academicContext})
  return {topic:f.id,description:f.description,instrumentType,total:17.35,levels:p.levels,criteria:p.criteria.map(({id,sourceReferences,...row})=>row)}
}))
writeFileSync(`docs/curriculum/cobertura-secundaria/matematica-${grade}-instrumentos.json`,JSON.stringify(examples,null,2)+'\n')
// A readable view for reviewing every requested dimension, not merely the totals.
const lines=[]
for(const e of examples.filter(e=>e.instrumentType==='rubrica')){
  lines.push(`\n${e.topic}: ${e.description}`)
  for(const c of e.criteria)lines.push(`${c.title}: ${c.description}`, ...c.descriptors.map(d=>d.text))
}
writeFileSync(`.wrangler/math-source/grade-${grade}-review.txt`,lines.join('\n')+'\n')
console.log(JSON.stringify({grade,topics:fixtures.length,cases:cases.length,completeInstruments:examples.length}))
