import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-informe-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(index:number,format:typeof formats[number])=>recommend({activityTitle:bank.cases[index].title,description:bank.cases[index].description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
const text=(p:ReturnType<typeof run>)=>JSON.stringify(p.criteria)
describe('Informe1: desempeños de la malla71–72 y límites de consignas reales',()=>{
 for(const format of formats){
  it(`${format}: consigna breve no impone revisión demostrada ni conectores específicos`,()=>{
   const p=run(0,format);expect(text(p)).not.toMatch(/Revisión y versión final|borrador|conectores de adición o ejemplificación/)
   expect(p.criteria.some(c=>c.templateId==='report-summary')).toBe(true)
  })
  it(`${format}: escritura conserva reglas de resumen, contexto cultural y no duplica título`,()=>{
   const p=run(1,format),t=text(p);expect(t).toMatch(/omisión.*selección.*generalización.*reconstrucción|selección.*omisión.*generalización.*reconstrucción/)
   expect(t).toMatch(/costumbres.*comportamientos.*estilos de vida.*pautas culturales/)
   expect(t).toMatch(/compañeros|compañero/);expect(t).toMatch(/mural/)
   expect(t).toMatch(/vocabulario comprensible para sus compañeros/)
   expect(p.criteria.some(c=>c.templateId.startsWith('delivery-format'))).toBe(false)
   expect(t).toMatch(/presente.*análisis.*pasado.*hechos/)
  })
  it(`${format}: escucha conserva título, intención y partes que explican el análisis`,()=>{
   const p=run(2,format),t=text(p);expect(p.activityType).toBe('READING_REPORT_ANALYSIS');expect(p.criteria.length).toBeGreaterThan(2)
   expect(t).toMatch(/título/);expect(t).toMatch(/intención|propósito/);expect(t).toMatch(/introducción.*desarrollo.*conclusión/)
   expect(t).toMatch(/escuchad|audio/);expect(t).not.toMatch(/lectura posterior|informe leído|texto leído/)
  })
  it(`${format}: lectura mantiene propósito, predicciones, inferencia, partes y paráfrasis`,()=>{
   const p=run(3,format),t=text(p);expect(t).toMatch(/propósito/i);expect(t).toMatch(/subtítulo/);expect(t).toMatch(/durante.*después/)
   expect(t).toMatch(/inferencia/);expect(t).toMatch(/introducción.*desarrollo.*conclusión/);expect(t).toMatch(/Paráfrasis|paráfrasis/)
   expect(t).toMatch(/presente.*análisis.*pasado.*hechos/)
   expect(p.criteria.find(c=>c.templateId==='report-feature-adjectives')!.description).toMatch(/prácticas culturales/)
   expect(p.criteria.filter(c=>c.templateId==='report-feature-summary')).toHaveLength(0)
  })
  it(`${format}: presentación conserva producción oral y gramática usada, sin informe escrito`,()=>{
   const p=run(4,format),t=text(p);expect(p.activityType).toBe('READING_REPORT_PRESENTATION')
   expect(t).toMatch(/oral|al hablar/);expect(t).toMatch(/fábula/);expect(t).toMatch(/omisión.*selección.*generalización.*reconstrucción|selección.*omisión.*generalización.*reconstrucción/)
   expect(t).not.toMatch(/Identifica los adjetivos|en el texto de informe|diapositivas|versión final|informe leído/)
   expect(t).not.toMatch(/Señala ejemplos|deja sin explicar.*función|explica, con ejemplos presentes/)
   expect(t).toMatch(/otro grupo/)
   expect(p.criteria.filter(c=>c.templateId==='report-individual')).toHaveLength(0)
  })
  it(`${format}: revisar solo resumen no añade análisis ni estructura completa`,()=>{
   const p=run(5,format),t=text(p);expect(t).toMatch(/omis|omit/);expect(t).toMatch(/generaliz/);expect(t).toMatch(/reconstr/);expect(t).toMatch(/original/)
   expect(t).not.toMatch(/introducción|conclusión|Interpretación del informe|borrador|publicación/)
   expect(t).toMatch(/revisado|corrige|revisa/i)
  })
  it(`${format}: corrección lingüística usa fragmento recibido y no exige otro borrador`,()=>{
   const p=run(6,format),t=text(p);expect(t).toMatch(/corrige|Corrige/);expect(t).toMatch(/original/);expect(t).toMatch(/fragmento/)
   expect(t).not.toMatch(/borrador|publicación|texto propio|nueva interpretación/)
  })
  it(`${format}: comparación acotada conserva tanto resúmenes como análisis culturales`,()=>{
   const p=run(7,format),t=text(p);expect(p.activityType).toBe('READING_REPORT_COMPARISON')
   expect(t).toMatch(/resúmenes/);expect(t).toMatch(/sociocultural|costumbres/);expect(t).toMatch(/ambos/)
   expect(t).not.toMatch(/portada|presentación del documento|tercer informe/)
   expect(p.criteria.length).toBeGreaterThan(1)
  })
 }
 it('revisar comillas sin pedir explicación no añade otra entrega',()=>{
  const p=recommend({activityTitle:'Comillas',description:'Corrijan solo las comillas del informe de lectura para distinguir las citas de la voz propia. No cambien las ideas ni entreguen explicaciones adicionales.',maxScore:20,participationMode:'INDIVIDUAL'},bank.context,null,[],'UNMAPPED',null)
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toMatch(/comillas/)
  expect(JSON.stringify(p.criteria)).not.toMatch(/borrador|Explicación de las correcciones/)
 })
 it('escuchar la presentación oral de la docente no convierte al alumno en expositor',()=>{
  const p=recommend({activityTitle:'Escucha de informe de lectura',description:'Escuchen el informe de lectura que la docente presentará oralmente y reconstruyan su análisis con sus propias palabras.',maxScore:20,participationMode:'INDIVIDUAL'},bank.context,null,[],'UNMAPPED',null)
  expect(p.activityType).toBe('READING_REPORT_ANALYSIS')
  expect(JSON.stringify(p.criteria)).not.toMatch(/Expone con|volumen|Organiza la exposición/)
 })
})
