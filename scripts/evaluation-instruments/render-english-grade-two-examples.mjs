import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/'
const final=process.argv[2]==='final'
const prefix=final?'ingles-2-final':'ingles-2-funciones'
const saved=JSON.parse(readFileSync(root+`evidencias/${prefix}-persistencia.json`,'utf8'))
assert.equal(saved.activities.length,4)
const escape=value=>String(value??'').replace(/\|/g,'\\|').replace(/\n/g,' ')
let md=final?'# Instrumentos cotidianos finales de Inglés común segundo\n\nCuatro formatos generados, editados, guardados y reabiertos en Chrome habitual con la cuenta ficticia local. [Campos y snapshots completos](evidencias/ingles-2-final-persistencia.json); [campos observados en navegador](evidencias/ingles-2-final-flujo-navegador.json). Rúbrica .51, cotejo y escala .52, ponderada .53; las correcciones posteriores no cambian el contenido de los primeros tres ejemplos.\n':'# Cuatro instrumentos cotidianos de Inglés segundo\n\nEjemplos del bloque de funciones: generados, editados, guardados y reabiertos en Chrome habitual con la cuenta ficticia local. **No constituyen el cierre integral del grado.** [Campos y snapshots completos](evidencias/ingles-2-funciones-persistencia.json); [campos observados en navegador](evidencias/ingles-2-funciones-flujo-navegador.json).\n'
for(const activity of saved.activities){
 const p=activity.instrumentSnapshot
 if(final)assert(['evaluation-2026.51','evaluation-2026.52','evaluation-2026.53'].includes(p.catalogVersion))
 else assert.equal(p.catalogVersion,'evaluation-2026.48')
 md+=`\n## ${activity.name}\n\nConsigna: ${activity.description.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}\n\nFormato: ${activity.instrumentType}. Total: ${activity.maxScore}. Catálogo: ${p.catalogVersion}. Actividad: ${activity.id}. Edición manual conservada.\n\n`
 if(['rubrica','escala'].includes(activity.instrumentType)){
  md+='| Criterio/indicador | '+p.levels.map(l=>escape(l.label)).join(' | ')+' | Máximo |\n|---|'+p.levels.map(()=>'---').join('|')+'|---:|\n'
  for(const c of p.criteria)md+='| '+[c.title,...p.levels.map(l=>c.descriptors.find(d=>d.levelId===l.id)?.text),c.maxScore].map(escape).join(' | ')+' |\n'
 }else{
  md+='| Criterio | Evidencia y cumplimiento parcial | Peso | Máximo |\n|---|---|---:|---:|\n'
  for(const [i,c] of p.criteria.entries())md+='| '+[c.title,c.description,activity.instrumentType==='lista-ponderada'?activity.instrumentCriteria[`lista-ponderada:weight:${i}`]+'%':'Sí/No',c.maxScore].map(escape).join(' | ')+' |\n'
 }
}
writeFileSync(root+(final?'ingles-2-ejemplos-finales.md':'ingles-2-funciones-ejemplos.md'),md)
console.log(JSON.stringify({examples:4,status:final?'FOUR_EVERYDAY_FORMATS_SAVED_REOPENED':'FUNCTIONS_ONLY_GRADE_PARTIAL'}))
