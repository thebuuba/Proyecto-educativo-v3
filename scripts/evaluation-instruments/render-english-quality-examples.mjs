import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/',service=JSON.parse(readFileSync(root+'evidencias/ingles-calidad-servicio-66.json','utf8')),persisted=JSON.parse(readFileSync(root+'evidencias/ingles-calidad-persistencia.json','utf8'))
assert.equal(service.results.length,240);assert.equal(persisted.activities.length,2)
const escape=value=>String(value??'').replace(/\|/g,'\\|').replace(/\n/g,' ')
function table(p,fields){
 let md=''
 if(['rubrica','escala'].includes(p.instrumentType)){
  md+='| Criterio/indicador | '+p.levels.map(l=>escape(l.label)).join(' | ')+' | Máximo |\n|---|'+p.levels.map(()=>'---').join('|')+'|---:|\n'
  for(const c of p.criteria)md+='| '+[c.title,...p.levels.map(l=>c.descriptors.find(d=>d.levelId===l.id)?.text),c.maxScore].map(escape).join(' | ')+' |\n'
 }else{
  md+='| Criterio | Evidencia / cumplimiento parcial | Peso o decisión | Máximo |\n|---|---|---:|---:|\n'
  const sum=p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)
  for(const [i,c] of p.criteria.entries())md+='| '+[c.title,c.description,p.instrumentType==='lista-cotejo'?'Sí/No':fields?.[`lista-ponderada:weight:${i}`]??`${(c.maxScoreUnits*100/sum).toFixed(2)}% de puntos efectivos`,c.maxScore].map(escape).join(' | ')+' |\n'
 }
 return md
}
let md='# Instrumentos completos corregidos: Inglés común\n\nServicio local.66: ocho ejemplos completos (dos consignas × cuatro formatos). Dos instrumentos editados/guardados/reabiertos en Chrome.65, conservados y cotejados nuevamente con.66. La elección manual de un formato se respeta; no se afirma que el motor recomiende los cuatro para la misma consigna. [Servicio](evidencias/ingles-calidad-servicio-66.json), [snapshots reales](evidencias/ingles-calidad-persistencia.json).\n'
for(const c of ['cv','revision'])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada']){
 const r=service.results.find(r=>r.grade===6&&r.case===c&&r.input.preferredInstrumentType===format&&r.input.maxScore===(c==='cv'?17.35:20));assert(r)
 md+=`\n## ${c==='cv'?'Datos del CV':'Escritura y revisión observable'} · ${format}\n\nConsigna: ${r.input.description}\n\nTotal: ${r.input.maxScore}. Fuente: respuesta HTTP, sin edición posterior.\n\n`+table(r.proposal)
}
md+='\n## Dos instrumentos reales del navegador\n\nLas ediciones manuales siguientes se cotejaron con campos, IDs y puntos del snapshot; no se reescribieron los instrumentos anteriores.\n'
for(const a of persisted.activities){md+=`\n### ${a.name}\n\nActividad: ${a.id}. Instrumento: ${a.instrumentId}. Snapshot: ${a.instrumentSnapshotId}. Total: ${a.maxScore}.\n\n`+table(a.instrumentSnapshot,a.instrumentCriteria)}
writeFileSync(root+'ingles-calidad-ejemplos-completos.md',md)
console.log(JSON.stringify({serviceExamples:8,browserSnapshots:2,checks:'passed'}))
