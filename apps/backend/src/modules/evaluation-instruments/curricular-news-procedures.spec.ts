import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-noticia-procedimientos-v1.json'),'utf8'))
const audio=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-noticia-escucha-reservado-v1.json'),'utf8'))
const reserved=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-noticia-reservado-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
const run=(i:number,format:typeof formats[number])=>recommend({activityTitle:bank.cases[i].title,description:bank.cases[i].description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType:format},bank.context,null,[],'UNMAPPED',null)
describe('Noticia1: procedimientos y continuación de la página74',()=>{
 for(const format of formats){
  it(`${format}: la escucha breve sin inferencias solicitadas conserva su alcance`,()=>{
   const c=reserved.cases[0],p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:format},reserved.context,null,[],'UNMAPPED',null)
   expect(p.criteria.map(r=>r.description).join(' ')).not.toMatch(/inferencias|propósito informativo/)
   expect(p.criteria.map(r=>r.description).join(' ')).toMatch(/interesar al público/)
  })
  it(`${format}: escuchar conserva propósito, inferencias, cómo y vocabulario contextual`,()=>{
   const c=audio.cases[0],p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:format},audio.context,null,[],'UNMAPPED',null)
   const text=p.criteria.map(r=>r.description).join(' ')
   expect(p.activityType).toBe('NEWS_ANALYSIS')
   expect(text).toMatch(/escuchad/)
   expect(text).toMatch(/cómo/)
   expect(text).toMatch(/propósito/)
   expect(text).toMatch(/inferencias/)
   expect(text).toMatch(/palabras desconocidas/)
   expect(text).not.toMatch(/leída|Redacta|Organiza la noticia con|escritura/)
   if(format==='rubrica'||format==='escala')expect(p.criteria.find(r=>r.templateId==='news-procedure-paraphrase')!.descriptors[0].text).toMatch(/cómo|forma en que/)
  })
  it(`${format}: anticipar sin nombrar predicción conserva comprobación y no borra propósito e inferencias`,()=>{
   const p=run(0,format),text=p.criteria.map(r=>r.description).join(' ')
   expect(p.activityType).toBe('NEWS_ANALYSIS')
   expect(text).toMatch(/anticip|predicci/)
   expect(text).toMatch(/contrasta|comprueba/)
   expect(text).toMatch(/propósito|intención/)
   expect(text).toMatch(/inferencias|deduce.*relaciones/)
   expect(text).toMatch(/palabras desconocidas/)
   if(format==='rubrica'||format==='escala'){
    const interpretation=p.criteria.find(r=>r.templateId==='news-interpretation')!
    expect(interpretation.descriptors[1].text).toMatch(/dato|relación|hecho/)
    expect(interpretation.descriptors[1].text).not.toMatch(/apoyo más preciso/)
   }
   expect(text).not.toMatch(/Redacta|publica|experimento/)
  })
  it(`${format}: documentar y explicar coordinación y subordinación conserva todos los requisitos`,()=>{
   const p=run(1,format),text=p.criteria.map(r=>r.description).join(' ')
   expect(p.activityType).toBe('NEWS_WRITING')
   expect(text).toMatch(/fuentes/)
   expect(text).toMatch(/ambiental.*interés internacional/)
   expect(text).toMatch(/comprobad/)
   expect(text).toMatch(/coordinadas/)
   expect(text).toMatch(/subordinadas/)
   expect(text).toMatch(/explica.*ejemplo.*cada/)
   expect(text).toMatch(/formal.*sencillo/)
   expect(text).toMatch(/estudiantes del centro/)
   expect(text).toMatch(/borrador.*versión final|versión final.*borrador/)
   expect(text).not.toMatch(/condición.*1 ejemplo\.|cantidad.*1 ejemplo\./)
   expect(p.totalScoreUnits).toBe(1735)
  })
 }
 it('la agrupación de ejemplos sintácticos conserva otras condiciones de entrega',()=>{
  const c=bank.cases[1]
  const p=recommend({activityTitle:c.title,description:c.description+' Entreguen el documento en dos páginas con fuente Arial 12.',maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:'lista-cotejo'},bank.context,null,[],'UNMAPPED',null)
  const text=p.criteria.map(r=>r.description).join(' ')
  expect(text).toMatch(/2 páginas/)
  expect(text).toMatch(/Arial/)
  expect(text).toMatch(/cada clase de oración/)
 })
})
