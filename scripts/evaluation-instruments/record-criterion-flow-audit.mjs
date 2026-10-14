import {readFileSync,readdirSync,writeFileSync} from 'node:fs'
import {createRequire} from 'node:module'
const require=createRequire(new URL('../../apps/backend/package.json',import.meta.url))
const {recommend}=require('./dist/modules/evaluation-instruments/recommendation-engine.js')
const shared=require('@aula/shared')
const root='docs/curriculum/cobertura-secundaria/',data='data/evaluation-instruments/',grades=['one','two','three','four','five','six'],records=[]
for(const file of [...readdirSync(data).filter(f=>/^language-grade-.*contracts\.json$/.test(f)),'novel-task-regression.json']) {
 const grade=file==='novel-task-regression.json'?5:grades.findIndex(g=>file.includes(`grade-${g}-`))+1
 const context={level:'SECONDARY',grade,cycle:grade<=3?1:2,subjectCode:'LEN',subjectName:'Lengua Española',modalityCode:null,optativeExitName:null}
 const payload=JSON.parse(readFileSync(data+file,'utf8'))
 for(const [index,c] of (Array.isArray(payload)?payload:[{...payload,topic:payload.activityTitle,type:payload.activityType}]).entries()) {
  const topic=shared.findSecondaryLanguageTopic(c.topic??'Actividad',c.description,context)
  const family=topic?.id??(grade===1?shared.firstSecondaryLanguageGenre(c.topic??'Actividad',c.description):null)??'noticia'
  for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada']) {
   const input={activityTitle:c.topic??'Actividad',description:c.description,pedagogicalActivityType:c.type,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:format}
   const initial=recommend(input,context,null,[],'UNMAPPED',null),pool=recommend({...input,includeAdditionalCandidates:true},context,null,[],'UNMAPPED',null)
   const generic=pool.criteria.some(row=>['knowledge','development','organization','communication','instructions'].includes(row.templateId))
   const used=new Set(initial.criteria.map(r=>r.templateId))
   records.push({file,caseId:c.id??index,grade,family,format,activity:initial.activityType,initial:initial.criteria.map(r=>r.templateId),pool:pool.criteria.map(r=>r.templateId),additional:pool.criteria.filter(r=>!used.has(r.templateId)).map(r=>r.templateId),generic})
  }
 }
}
const groups=new Map()
for(const r of records){const key=`${r.grade}:${r.family}`;const rows=groups.get(key)??[];rows.push(r);groups.set(key,rows)}
const summary=[...groups.entries()].map(([key,rows])=>({key,cases:rows.length/4,formats:[...new Set(rows.map(r=>r.format))],initialRange:[Math.min(...rows.map(r=>r.initial.length)),Math.max(...rows.map(r=>r.initial.length))],extraCases:rows.filter(r=>r.additional.length).length/4,extraObjectives:[...new Set(rows.flatMap(r=>r.additional))],generic:rows.some(r=>r.generic)})).sort((a,b)=>a.key.localeCompare(b.key))
writeFileSync(root+'evidencias/criterios-matriz-proveedores.json',JSON.stringify({cases:records.length/4,formatChecks:records.length,scoreVariants:3,summary,records},null,2)+'\n')
let md=`# Matriz de añadir y completar por proveedor\n\nGenerada a partir de los${records.length/4} contratos existentes; cada consigna se comprueba en cuatro formatos y tres estados de puntuación en \`criterionProviderMatrix.spec.ts\`. Los extras dependen de la evidencia solicitada, no de una cuota.\n\n| Grado/familia | Consignas | Filas iniciales | Consignas con extras reservados | Objetivos adicionales |\n|---|---:|---|---:|---|\n`
for(const r of summary)md+=`| ${r.key} | ${r.cases} | ${r.initialRange.join('–')} | ${r.extraCases} | ${r.extraObjectives.join(', ')||'Sin extras reservados en estas consignas; agotamiento explícito'} |\n`
md+='\nInglés1 rutina: .45 tenía3 objetivos; .46 incorpora las expresiones temporales y la respuesta a la pregunta, además de precisar las cinco actividades. La generación nueva incluye los5; un borrador antiguo puede añadir/completar los2 omitidos. Guía1 escrita+presentación: seis objetivos previos más `guide-oral`, disponible también en generación nueva. Ningún proveedor se rellena para fabricar otra fila cuando ya se agotó su conjunto pertinente.\n'
writeFileSync(root+'criterios-matriz-proveedores.md',md)
const http=JSON.parse(readFileSync(root+'evidencias/criterios-pools-http.json','utf8'))
let examples='# Instrumentos completos y comparación antes/después\n\nAntes (.45): rutina con `ing-1-routine`, `ing-1-feature-present-simple` e `ing-1-intelligibility`; sin expresiones temporales ni respuesta. La guía del borrador autorizado tenía seis objetivos escritos/visuales y una séptima fila vacía. No se atribuye ese borrador al caso B exacto desconocido.\n\nDespués (.46): los ejemplos siguientes son respuestas HTTP reales para las dos consignas completas. La generación incluye todas las evidencias; la recuperación conserva las filas anteriores y añade/completa las omitidas.\n'
for(const r of http.results.filter(r=>['Rutina exacta','Guía escrita y presentación'].includes(r.case.topic))) {
 const p=r.generated
 examples+=`\n## ${r.case.topic} · ${r.format} · ${r.total} puntos\n\n${r.case.description}\n\n`
 for(const c of p.criteria){
  examples+=`### ${c.title} (${c.maxScore} pts; objetivo ${c.templateId})\n\n${c.description}\n\n`
  for(const d of c.descriptors)examples+=`- ${p.levels.find(l=>l.id===d.levelId)?.label??d.levelId}: ${d.text}\n`
  if(r.format==='lista-cotejo')examples+='- Sí/No: registra la presencia de la evidencia descrita.\n'
  if(r.format==='lista-ponderada')examples+=`- Peso relativo autorado: ${c.relativeWeight}; cumple/parcial/no cumple según el indicador.\n`
 }
}
writeFileSync(root+'criterios-ejemplos-completos.md',examples)
console.log(JSON.stringify({cases:records.length/4,families:summary.length,genericRecords:records.filter(r=>r.generic).length,extraCases:summary.filter(r=>r.extraCases).map(r=>({key:r.key,cases:r.extraCases}))}))
