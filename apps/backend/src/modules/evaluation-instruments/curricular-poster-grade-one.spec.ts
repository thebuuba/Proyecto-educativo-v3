import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-afiche-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(index:number,format:typeof formats[number])=>recommend({activityTitle:bank.cases[index].title,description:bank.cases[index].description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
describe('Afiche1: malla72 y consignas sintéticas fijadas antes de generar',()=>{
 for(const format of formats){
  it(`${format}: invitación breve conserva acción y público sin inventar datos`,()=>{
   const p=run(0,format),t=JSON.stringify(p.criteria)
   expect(p.activityType).toBe('POSTER_CREATION');expect(t).toMatch(/feria del libro/);expect(t).toMatch(/curso/)
   expect(t).not.toMatch(/fecha|horario|estadístic|borrador|publicación|exposición/)
  })
  it(`${format}: convocatoria según ficha conserva todos los datos, argumentos y plan`,()=>{
   const p=run(1,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/día.*hora.*lugar.*público.*actividades/)
   expect(t).toMatch(/familias/);expect(t).toMatch(/hechos.*cifras.*ventajas/);expect(t).toMatch(/ficha/)
   expect(t).toMatch(/plan|esquema/);expect(t).toMatch(/imágenes.*formas.*colores.*letras.*distribución.*tamaño/)
   expect(t).not.toMatch(/publicación|exposición oral|estadísticas nuevas/)
  })
  it(`${format}: comprensión mantiene propósito, recursos gráficos, inferencia y paráfrasis`,()=>{
   const p=run(2,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/propósito/);expect(t).toMatch(/imagen.*letras.*colores.*distribución/)
   expect(t).toMatch(/palabras clave/);expect(t).toMatch(/razones|argumentos/);expect(t).toMatch(/inferencia/)
   expect(t).toMatch(/Paráfrasis|paráfrasis|sus palabras/);expect(t).toMatch(/datos importantes/)
   expect(t).not.toMatch(/Crea un|Elabora un|Dibuja/)
  })
  it(`${format}: funciones distintas de cuatro recursos y un ejemplo de cada uno`,()=>{
   const p=run(3,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/metáfora/);expect(t).toMatch(/pleonasmo/);expect(t).toMatch(/elipsis/);expect(t).toMatch(/exageración/)
   expect(t).toMatch(/reiteración|redundancia/);expect(t).toMatch(/omi(?:si[oó]n|tir).*recuper|recuper.*omis/)
   expect(t).toMatch(/ejemplo de cada/);expect(t).toMatch(/literal/)
   expect(p.criteria.some(c=>c.templateId.startsWith('delivery-format'))).toBe(false)
  })
  it(`${format}: deber, tener que, poder y podría conservan modalidad de ficha`,()=>{
   const p=run(4,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/deber.*tener que/);expect(t).toMatch(/poder.*podría/);expect(t).toMatch(/obligaci/);expect(t).toMatch(/posibilidad/)
   expect(t).toMatch(/ficha/);expect(t).toMatch(/riesgo.*acciones/)
  })
  it(`${format}: simulacro se refiere al protocolo dado sin otras instrucciones`,()=>{
   const p=run(5,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/simulacro/);expect(t).toMatch(/protocolo/);expect(t).toMatch(/riesgo.*acciones/)
   expect(t).toMatch(/obligaci/);expect(t).toMatch(/posibilidad/)
   expect(t).not.toMatch(/video|estadístic|terremoto|evacúa|llama al/)
  })
  it(`${format}: contraste de argumentos no queda reducido a estadísticas`,()=>{
   const p=run(6,format),t=JSON.stringify(p.criteria)
   expect(p.activityType).toBe('POSTER_COMPARISON');expect(t).toMatch(/hechos.*cifras.*ventajas/)
   expect(t).toMatch(/ambos/);expect(t).toMatch(/connotativ/);expect(t).toMatch(/ficha/)
   expect(t).not.toMatch(/tercer afiche|decoración|calidad artística/)
  })
  it(`${format}: plan de campaña conserva situación y convivencia sin exigir afiche final`,()=>{
   const p=run(7,format),t=JSON.stringify(p.criteria)
   expect(t).toMatch(/plan|esquema/);expect(t).toMatch(/intención.*destinatario.*actividad.*día.*lugar.*acciones/)
   expect(t).toMatch(/justa|equitativa/);expect(t).toMatch(/respeto|respetuoso/);expect(t).toMatch(/burlas.*exclusión/)
   expect(t).not.toMatch(/Presenta la información con jerarquía|No presenta el recurso visual|afiche terminado|publicación/)
  })
 }
})
