import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'

const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-transversales-reservado-independiente-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
// Expectations were fixed by a real independent designer before outputs. These checks
// detect omissions; independent reading of complete descriptors is still required.
describe('Consignas independientes de Lengua1: alcance, alternativas y provisionalidad',()=>{
 for(const format of formats)for(const c of bank.cases)it(`${c.id}/${format}`,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:17.35,participationMode:c.participationMode,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
  const t=JSON.stringify(p.criteria),visible=p.criteria.map(r=>r.description).join(' ')
  const id=c.id.slice(-3)
  const types:Record<string,string>={R01:'NEWS_WRITING',R02:'NEWSCAST',R03:'WRITTEN_PRODUCTION',R04:'ANALYSIS',R05:'ANALYSIS',R06:'PROJECT',R07:'COMPARISON',R08:'PROJECT',R09:'DEBATE',R10:'DETECTIVE_STORY_ANALYSIS',R11:'CALLIGRAM_ANALYSIS',R12:'CALLIGRAM_CREATION',R13:'PROJECT'}
  expect(p.activityType).toBe(types[id])
  switch(id){
   case'R01':expect(visible).toMatch(/titular.*entrada/);expect(visible).toMatch(/posibilidad|posible|incertidumbre/);expect(visible).toMatch(/conserva.*cuerpo|cuerpo.*intacto/i);break
   case'R02':expect(visible).toMatch(/oral/);expect(visible).toMatch(/un minuto|1 minuto/);expect(visible).toMatch(/otros cursos/);expect(visible).toMatch(/portavoz.*o.*intervenciones/);expect(visible).not.toMatch(/pregunta.*procedimiento.*resultados/);break
   case'R03':expect(visible).toMatch(/propias palabras|reformula/i);expect(visible).toMatch(/encuesta/);expect(visible).toMatch(/aproximad.*ochenta|ochenta.*aproximad/i);expect(visible).not.toMatch(/científicos y sociales|ambas fichas/);break
   case'R04':expect(visible).toMatch(/párrafo o.*audio/);expect(visible).toMatch(/observad.*explicación|observación.*interpretación/i);expect(visible).toMatch(/alcance|generaliz/);expect(p.criteria.some(r=>r.templateId==='delivery-quantity-parrafo')).toBe(false);break
   case'R05':expect(visible).toMatch(/pregunta/);expect(visible).toMatch(/dato.*conclusión/);expect(visible).toMatch(/afirmación.*comprobar/);expect(visible).toMatch(/margen/);expect(visible).not.toMatch(/procedimiento.*resultados.*conclusión|Planifica/);break
   case'R06':expect(visible).toMatch(/dos acciones/);expect(visible).toMatch(/responsables.*momentos/);expect(visible).toMatch(/casi no intervienen|poco representad/);expect(visible).toMatch(/alternativa/);expect(visible).toMatch(/aceptar.*adaptar.*descartar|acepta.*adapta.*descarta/);expect(visible).not.toMatch(/espacios de lectura|resultados obtenidos|ejecuta el proyecto/);break
   case'R07':expect(visible).toMatch(/ambos proyectos/);expect(visible).toMatch(/participantes|quiénes/);expect(visible).toMatch(/recog.*propuestas/);expect(visible).toMatch(/información.*(?:falta|insuficiente)|falta.*información/);expect(visible).not.toMatch(/acciones y tiempos|presupuestos y calendarios/);break
   case'R08':expect(visible).toMatch(/recomendación.*viable|viable.*recomendación/);expect(visible).toMatch(/nota.*explica|explica.*nota/);expect(visible).toMatch(/conserva.*problema.*objetivo.*acciones.*responsables.*plazos/i);break
   case'R09':expect(visible).toMatch(/dato.*o.*ejemplo/);expect(visible).toMatch(/objeción/);expect(visible).toMatch(/mantiene.*o.*cambia|mantener.*o.*cambiar/);expect(visible).not.toMatch(/diez minutos|analogía/);expect(p.criteria.some(r=>r.templateId.startsWith('delivery-quantity-ejemplo'))).toBe(false);break
   case'R10':expect(visible).toMatch(/cambio.*decisión|decisión.*cambio/);expect(visible).toMatch(/pista/);expect(visible).toMatch(/actitud o.*valor/);expect(visible).toMatch(/dos momentos/);expect(visible).not.toMatch(/dos interpretaciones|ambos cuentos/);break
   case'R11':expect(visible).toMatch(/emoción/);expect(visible).toMatch(/palabras.*figura/);expect(visible).toMatch(/coincidencia o.*diferencia/);expect(visible).toMatch(/sin.*burlas/);expect(visible).not.toMatch(/Emplea verso libre/);break
   case'R12':expect(visible).toMatch(/una o ambas.*conservar|una.*ambas.*conservar/);expect(visible).toMatch(/sugerencia/);expect(visible).toMatch(/aceptar.*adaptar.*rechazar|acepta.*adapta.*rechaza/);expect(visible).toMatch(/figura.*tema.*orden/);expect(visible).toMatch(/borrador/);break
   case'R13':expect(p.confidence).toBe('LOW');expect(p.criteria.every(r=>/provisional/i.test(r.title)||/provisional/i.test(r.description))).toBe(true);expect(visible).toMatch(/confirmar.*producto.*evidencia/i);expect(visible).not.toMatch(/Ejecuta|resultados obtenidos|informe completo/);expect(p.selectedCurriculumElements).toHaveLength(0);break
  }
  expect(p.totalScoreUnits).toBe(1735);expect(p.criteria.length).toBeLessThanOrEqual(20)
  if(format==='rubrica'||format==='escala')expect(p.criteria.every(r=>r.descriptors.length===4&&r.descriptors.every(d=>d.text.length>25))).toBe(true)
  expect(t).not.toMatch(/No aporta evidencia suficiente para valorar/)
 })
 for(const format of ['rubrica','escala'] as const)it(`${format}: el seguimiento provisional no ofrece cero por evidencia aún no observada`,()=>{
  const c=bank.cases.find(c=>c.id.endsWith('R13'))
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:c.participationMode,preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
  const scored=JSON.stringify(p.criteria.map(r=>r.descriptors))
  expect(scored).not.toMatch(/no observada|dejar pendiente|mantener pendiente|información suficiente para valorar/)
  expect(p.criteria.every(r=>/acordada y observada/.test(r.descriptors.at(-1)!.text))).toBe(true)
  expect(p.criteria.map(r=>r.description).join(' ')).toMatch(/pendiente/)
 })
})
