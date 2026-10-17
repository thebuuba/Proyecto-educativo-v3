import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/'
const prefix='ingles-3-final'
const saved=JSON.parse(readFileSync(root+`evidencias/${prefix}-persistencia.json`,'utf8'))
assert.equal(saved.activities.length,4)
const escape=value=>String(value??'').replace(/\|/g,'\\|').replace(/\n/g,' ')
let md='# Instrumentos cotidianos finales de Inglés común tercero\n\nCuatro formatos generados, editados, guardados y reabiertos en Chrome habitual con la cuenta ficticia local. [Campos y snapshots completos](evidencias/ingles-3-final-persistencia.json); [campos observados en navegador](evidencias/ingles-3-final-flujo-navegador.json). Rúbrica .54; cotejo, escala y ponderada .55. Un primer cotejo .54 se conserva como histórico; el final .55 verifica la conjunción pedida sin corrección manual del indicador de comprensión.\n'
for(const activity of saved.activities){
 const p=activity.instrumentSnapshot
 assert(['evaluation-2026.54','evaluation-2026.55'].includes(p.catalogVersion))
 md+=`\n## ${activity.name}\n\nConsigna: ${activity.description.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}\n\nFormato: ${activity.instrumentType}. Total: ${activity.maxScore}. Catálogo: ${p.catalogVersion}. Actividad: ${activity.id}. Edición manual conservada.\n\n`
 if(['rubrica','escala'].includes(activity.instrumentType)){
  md+='| Criterio/indicador | '+p.levels.map(l=>escape(l.label)).join(' | ')+' | Máximo |\n|---|'+p.levels.map(()=>'---').join('|')+'|---:|\n'
  for(const c of p.criteria)md+='| '+[c.title,...p.levels.map(l=>c.descriptors.find(d=>d.levelId===l.id)?.text),c.maxScore].map(escape).join(' | ')+' |\n'
 }else{
  md+='| Criterio | Evidencia y cumplimiento parcial | Peso | Máximo |\n|---|---|---:|---:|\n'
  for(const [i,c] of p.criteria.entries())md+='| '+[c.title,c.description,activity.instrumentType==='lista-ponderada'?activity.instrumentCriteria[`lista-ponderada:weight:${i}`]+'%':'Sí/No',c.maxScore].map(escape).join(' | ')+' |\n'
 }
}
writeFileSync(root+'ingles-3-ejemplos-finales.md',md)
console.log(JSON.stringify({examples:4,status:'FOUR_EVERYDAY_FORMATS_SAVED_REOPENED'}))
