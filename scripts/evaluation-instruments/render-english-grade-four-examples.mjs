import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/'
const prefix='ingles-4-final'
const saved=JSON.parse(readFileSync(root+`evidencias/${prefix}-persistencia.json`,'utf8'))
assert.equal(saved.activities.length,4)
const escape=value=>String(value??'').replace(/\|/g,'\\|').replace(/\n/g,' ')
let md='# Instrumentos cotidianos finales de Inglés común cuarto\n\nCuatro formatos generados, editados, guardados y reabiertos en Chrome habitual con la cuenta ficticia local. [Campos y snapshots completos](evidencias/ingles-4-final-persistencia.json); [campos observados en navegador](evidencias/ingles-4-final-flujo-navegador.json). Rúbrica, cotejo y escala .57; lista ponderada .58. La versión .58 corrige la falsa solicitud derivada del adjetivo solicitada y conserva los instrumentos anteriores.\n'
for(const activity of saved.activities){
 const p=activity.instrumentSnapshot
 assert(['evaluation-2026.57','evaluation-2026.58'].includes(p.catalogVersion))
 md+=`\n## ${activity.name}\n\nConsigna: ${activity.description.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}\n\nFormato: ${activity.instrumentType}. Total: ${activity.maxScore}. Catálogo: ${p.catalogVersion}. Actividad: ${activity.id}. Edición manual conservada.\n\n`
 if(['rubrica','escala'].includes(activity.instrumentType)){
  md+='| Criterio/indicador | '+p.levels.map(l=>escape(l.label)).join(' | ')+' | Máximo |\n|---|'+p.levels.map(()=>'---').join('|')+'|---:|\n'
  for(const c of p.criteria)md+='| '+[c.title,...p.levels.map(l=>c.descriptors.find(d=>d.levelId===l.id)?.text),c.maxScore].map(escape).join(' | ')+' |\n'
 }else{
  md+='| Criterio | Evidencia y cumplimiento parcial | Peso | Máximo |\n|---|---|---:|---:|\n'
  for(const [i,c] of p.criteria.entries())md+='| '+[c.title,c.description,activity.instrumentType==='lista-ponderada'?activity.instrumentCriteria[`lista-ponderada:weight:${i}`]+'%':'Sí/No',c.maxScore].map(escape).join(' | ')+' |\n'
 }
}
writeFileSync(root+'ingles-4-ejemplos-finales.md',md)
console.log(JSON.stringify({examples:4,status:'FOUR_EVERYDAY_FORMATS_SAVED_REOPENED'}))
