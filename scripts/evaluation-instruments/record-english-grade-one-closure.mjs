import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/',load=p=>JSON.parse(readFileSync(root+p,'utf8'))
const review=load('revision.json'),inventory=load('inventario.json'),source=load('ingles-1-cotejo-integral.json')
const persisted=load('evidencias/ingles-1-final-persistencia.json'),http=load('evidencias/ingles-1-revision45-servicio.json'),selectors=load('evidencias/ingles-1-seleccion-final-navegador.json')
assert.equal(source.records.length,201);assert.equal(http.health.development.catalogVersion,'evaluation-2026.45')
assert.equal(new Set(persisted.activities.map(a=>a.instrumentType)).size,4);assert(persisted.activities.every(a=>a.instrumentSnapshot.criteria.length===20))
assert.equal(new Set(selectors.selections.map(s=>s.instrument)).size,4)
const scope=inventory.scopes.find(s=>s.id===source.scopeId)
const status={implementation:'VERIFIED_DEFINED_FAMILIES',automatedVerification:'PASSED_DEFINED_CONTRACTS',manualVerification:'SOURCE_201_RECORDS_VISUALLY_REVIEWED',applicationVerification:'FOUR_LOCAL_UI_FLOWS_PASSED',boundaryReview:'VISUALLY_REVIEWED_PDF_134_139',procedureAssociation:'SOURCE_LEDGER_CONDITIONAL_AND_EXCLUSIONS_REVIEWED',report:'ingles-1-informe-final.md',catalogVersion:'evaluation-2026.45',engineConnection:'CONTEXTUAL_PROVIDER_DEFINED_FAMILIES',instrumentFormats:['rubrica','lista-cotejo','escala','lista-ponderada'],serviceVerification:'LOCAL_AUTHENTICATED_HTTP_PASSED',interfaceVerification:'FOUR_SAVED_REOPENED_EXAMPLES_AND_CAPACITY_AND_ROW_OPERATIONS',pending:'Sin pendientes conocidos dentro de las familias y requisitos documentados. Análisis determinista limitado a patrones ensayados; no cobertura de cualquier redacción.'}
review.scopes=[...(review.scopes??[]).filter(s=>s.id!==scope.id),{id:scope.id,...status}]
for(const topic of scope.topics){const prior=review.topics.find(t=>t.id===topic.id);if(prior)Object.assign(prior,status);else review.topics.push({id:topic.id,...status})}
writeFileSync(root+'revision.json',JSON.stringify(review,null,2)+'\n')
const escape=v=>String(v??'').replace(/\|/g,'\\|').replace(/\n/g,' ')
let md='# Cuatro instrumentos completos de Inglés primero\n\nEstos ejemplos se generaron, editaron, guardaron y reabrieron en el entorno local habitual. Corresponden a una consigna deliberadamente extensa de20 estructuras para comprobar el límite; no representan una exigencia curricular de evaluar todas las estructuras en cada actividad. Los cuatro formatos admiten elección docente explícita. [Snapshots y campos completos](evidencias/ingles-1-final-persistencia.json).\n'
for(const a of persisted.activities){const p=a.instrumentSnapshot;md+=`\n## ${a.name}\n\nConsigna: ${a.description.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}\n\nFormato: ${a.instrumentType}; total: ${a.maxScore}; catálogo: ${p.catalogVersion}; actividad: ${a.id}. Edición manual conservada.\n\n`
 if(['rubrica','escala'].includes(a.instrumentType)){md+='| Criterio/indicador | '+p.levels.map(l=>escape(l.label)).join(' | ')+' | Máximo |\n|---|'+p.levels.map(()=>'---').join('|')+'|---:|\n';for(const c of p.criteria)md+='| '+[c.title,...p.levels.map(l=>c.descriptors.find(d=>d.levelId===l.id)?.text),c.maxScore].map(escape).join(' | ')+' |\n'}
 else {md+='| Criterio | Evidencia observable | Peso | Máximo |\n|---|---|---:|---:|\n';for(const [i,c] of p.criteria.entries())md+='| '+[c.title,c.description,a.instrumentType==='lista-ponderada'?a.instrumentCriteria[`lista-ponderada:weight:${i}`]+'%':'Sí/No',c.maxScore].map(escape).join(' | ')+' |\n'}
}
writeFileSync(root+'ingles-1-ejemplos-finales.md',md)
console.log(JSON.stringify({scope:scope.id,topicGroups:scope.topics.length,sourceRecords:201,savedFormats:4,currentCatalog:status.catalogVersion}))
