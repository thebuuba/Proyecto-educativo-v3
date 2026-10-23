import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/realistic-audit-bank-v1.json'),'utf8'))
const task=(id:string)=>bank.cases.find((c:{id:string})=>c.id===id)
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
function propose(id:string,format:typeof formats[number],description?:string){
 const c=task(id)
 return recommend({activityTitle:c.title,description:description??c.description,preferredInstrumentType:format,maxScore:17.35,participationMode:'INDIVIDUAL'},{level:'SECONDARY',grade:c.grade,cycle:c.grade<=3?1:2,subjectCode:c.subjectCode,subjectName:c.subjectName,optativeExitName:null},null,[],'UNMAPPED',null)
}
describe('Consignas científicas realistas: cobertura, comunicación y condiciones',()=>{
 for(const format of formats){
  it(`sistema solar: cobertura completa sin una fila por planeta, explicación y apoyo: ${format}`,()=>{
   const p=propose('B-NAT1-solar-exacta',format),text=p.criteria.map(c=>c.description).join(' ')
   expect(text).toMatch(/todos los planetas|ocho planetas/i)
   expect(text).toMatch(/cada planeta|cada uno/i)
   expect(text).toMatch(/material de apoyo/)
   expect(text).toMatch(/5 minutos|cinco minutos/)
   expect(text).not.toMatch(/maqueta|bibliografía|tolerancia|±|imprecisión puntual/)
   expect(p.criteria.length).toBeLessThan(8)
   expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(1735)
  })
  it(`tabla periódica: organización y ubicación explicadas sin predicciones añadidas: ${format}`,()=>{
   const p=propose('B-NAT5-tabla-reconstruida',format),text=p.criteria.map(c=>c.description).join(' ')
   expect(text).toMatch(/grupos/);expect(text).toMatch(/períodos/)
   expect(text).toMatch(/columnas/);expect(text).toMatch(/filas/)
   expect(text).toMatch(/número atómico/)
   expect(text).not.toMatch(/predicciones|tendencia|minutos|diapositivas/)
   const oral=p.criteria.find(c=>c.templateId.endsWith('-oral'))!
   expect(oral).toBeDefined()
   expect(oral.description).not.toMatch(/número atómico|predicciones|posición del elemento/)
   expect(p.criteria.flatMap(c=>c.progressionLevels??[]).join(' ')).not.toMatch(/imprecisión puntual/)
   expect(p.criteria.reduce((sum,c)=>sum+c.maxScoreUnits,0)).toBe(1735)
  })
 }
 it('distingue duración exacta, máxima y aproximada sin decidir una tolerancia',()=>{
  const descriptions=['B-NAT1-solar-exacta','B-NAT1-solar-maxima','B-NAT1-solar-aproximada'].map(id=>propose(id,'lista-cotejo').criteria.map(c=>c.description).join(' '))
  expect(descriptions[0]).toMatch(/(?:duración|dura|durante|exactamente|tiempo).*?(?:5|cinco) minutos/i)
  expect(descriptions[1]).toMatch(/máximo (?:5|cinco) minutos|no supera.*?(?:5|cinco) minutos/i)
  expect(descriptions[1]).not.toMatch(/exactamente|entre 4|mínimo/)
  expect(descriptions[2]).toMatch(/aproximadamente (?:5|cinco) minutos/)
  expect(descriptions[2]).not.toMatch(/exactamente|±|entre 4|4.*6 minutos|30 segundos/)
 })
 it('no recupera apoyo ni duración cuando el docente los retira',()=>{
  const p=propose('B-NAT1-solar-exacta','rubrica','Expongan todos los planetas del sistema solar y expliquen qué son. No se requiere material de apoyo ni se fija duración.')
  expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/material de apoyo|minutos|diapositivas|maqueta/)
 })
 it('conserva una predicción científica cuando sí está solicitada',()=>{
  const p=propose('B-NAT5-tabla-reconstruida','rubrica','Explica la posición de los elementos en la tabla periódica y las predicciones sustentadas por sus tendencias.')
  expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/predic|tendencia/)
 })
 it('no exige apoyos opcionales ni toma el tiempo de preparación como duración oral',()=>{
  const p=propose('B-NAT1-solar-exacta','rubrica','Expliquen oralmente todos los planetas del sistema solar. Tienen cinco minutos para preparar la exposición. Opcionalmente utilicen material de apoyo.')
  expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/material de apoyo|duración|minutos/)
 })
 it('la comunicación oral se agrupa una sola vez aunque haya varias facetas científicas',()=>{
  const p=propose('B-NAT1-solar-exacta','rubrica','Expongan qué son los volcanes, sus partes, cómo se forman y sus tipos de erupción.')
  expect(p.criteria.filter(c=>c.templateId.endsWith('-oral'))).toHaveLength(1)
  expect(p.criteria.filter(c=>c.templateId.endsWith('-oral'))[0].progressionLevels?.join(' ')).not.toMatch(/imprecisión puntual/)
 })
 it('no convierte mencionar grupos y períodos como recurso en una exposición obligatoria',()=>{
  const p=propose('B-NAT5-tabla-reconstruida','rubrica','Explica la ubicación de los elementos en la tabla periódica. Como recurso: una exposición sobre grupos y períodos.')
  expect(p.criteria.some(c=>c.templateId.endsWith('-oral'))).toBe(false)
 })
 it('no agrega la explicación de ubicación si solo se pide distinguir grupos y períodos',()=>{
  const p=propose('B-NAT5-tabla-reconstruida','rubrica','Expliquen los grupos y períodos de la tabla periódica.')
  expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/número atómico|predicciones/)
 })
 it('una consigna oral breve conserva contenido científico además de comunicación',()=>{
  const p=propose('B-NAT1-solar-exacta','rubrica','Expongan sobre la hidrosfera.')
  expect(p.criteria.some(c=>!c.templateId.endsWith('-oral')&&/agua|hidrosfera/.test(c.description))).toBe(true)
  expect(p.criteria.filter(c=>c.templateId.endsWith('-oral'))).toHaveLength(1)
  expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/minutos|material de apoyo|todos los planetas/)
 })
})
