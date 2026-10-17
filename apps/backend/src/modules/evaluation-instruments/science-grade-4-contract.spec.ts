import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/science-grade-4-contracts.json'
const context={level:'SECONDARY' as const,grade:4,cycle:2,modalityCode:'academic',subjectCode:'NAT-BIO',subjectName:'Ciencias de la Naturaleza',optativeExitName:null}
const propose=(description:string,format:'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'='rubrica',maxScore=20,title='Actividad')=>recommend({activityTitle:title,description,maxScore,preferredInstrumentType:format,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Biología4: contenidos, acciones y formatos',()=>{
 for(const f of fixtures)for(const description of [f.description,...f.variants??[]])for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const total of [20,17.35])it(`${f.id}/${format}/${total}/${description}`,()=>{
  const p=propose(description,format,total)
  expect(p.criteria.some(c=>c.templateId.startsWith(`nat-4-${f.id}-`))).toBe(true)
  expect(p.criteria.every(c=>c.templateId.startsWith('nat-4-')||c.templateId.startsWith('delivery-'))).toBe(true)
  expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
  expect(p.criteria.length).toBeLessThanOrEqual(20)
  expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
  expect(propose(description,format,total,'Partes de una célula').criteria).toEqual(p.criteria)
 })
 it('mendel no transforma probabilidades en certezas ni añade práctica',()=>{const p=propose('Calcula las probabilidades de herencia con el cuadro de Punnett y los genotipos proporcionados.');expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-4-mendel-calculation','nat-4-mendel-result']);expect(p.criteria[0].description).toMatch(/probabilidad|probabilidades/);})
 it('células madre, membrana y herencia no duplican la organización celular',()=>{expect(propose('Explica las características de las células madre.').criteria.map(c=>c.templateId)).toEqual(['nat-4-stem-cells-explanation']);expect(propose('Compara difusión, ósmosis y transporte activo.').criteria.map(c=>c.templateId)).toEqual(['nat-4-membrane-transport-comparison']);})
 it('una fuente de evolución no obliga explicar todo el tema',()=>{const p=propose('Interpreta la datación de fósiles con los datos dados.');expect(p.criteria.map(c=>c.templateId)).toEqual(['nat-4-evolution-evidence-data-interpretation']);})
 it('conserva alternativas celulares y no exige arte ni información personal',()=>{const p=propose('Representa la célula animal mediante dibujo o maqueta, sin elaborar ambos.');expect(p.criteria).toHaveLength(1);expect(p.criteria[0].description).toMatch(/alternativa elegida/);expect(p.criteria[0].description).not.toMatch(/destreza artística avanzada|historia familiar/);})
 it('teoría celular y herencia ligada al sexo no añaden temas relacionados',()=>{
  expect(propose('Explica la contribución del microscopio a la teoría celular.').criteria.map(c=>c.templateId)).toEqual(['nat-4-cell-theory-explanation'])
  expect(propose('Interpreta la herencia ligada al sexo del caso ficticio sin solicitar datos familiares.').criteria.map(c=>c.templateId)).toEqual(['nat-4-genetic-variation-analysis'])
 })
 it('ATP y factores de fotosíntesis no exigen otros componentes ni fases',()=>{
  expect(propose('Explica la relación entre ATP y energía celular.').criteria[0].description).not.toMatch(/funciones mitocondriales/)
  expect(propose('Explica los factores necesarios para la fotosíntesis.').criteria[0].description).not.toMatch(/fase llamada oscura/)
 })
 it('cálculo renal y bioquímica comparada son contenidos, no acciones',()=>{
  expect(propose('Analiza cistitis y cálculo renal con los casos ficticios proporcionados.').criteria.map(c=>c.templateId)).toEqual(['nat-4-excretory-analysis'])
  expect(propose('Argumenta con pruebas evolutivas de anatomía, embriología y bioquímica comparadas proporcionadas.').criteria.map(c=>c.templateId)).toEqual(['nat-4-evolution-evidence-argument'])
  expect(propose('Explica el papel de las enzimas en la digestión.').criteria.map(c=>c.templateId)).toEqual(['nat-4-metabolism-explanation'])
  expect(propose('Explica sistema binomial de Linneo y clasificación moderna.').criteria.map(c=>c.templateId)).toEqual(['nat-4-classification-explanation'])
 })
 it('explicar estructuras de organismos no pide una clasificación adicional',()=>{
  const p=propose('Explica las estructuras y funciones de hongos con el modelo dado.')
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).toMatch(/estructuras.*funciones/)
  expect(p.criteria[0].description).not.toMatch(/clasificación solicitada/)
 })
 it('una maqueta celular de cuarto es proyecto y observar una imagen no exige explicar teoría',()=>{
  expect(propose('Elabora una maqueta de célula vegetal.').activityType).toBe('PROJECT')
  expect(propose('Interpreta la maqueta de célula vegetal proporcionada.').activityType).toBe('ANALYSIS')
  const p=propose('Observa las imágenes microscópicas proporcionadas y registra sus evidencias celulares.')
  expect(p.criteria).toHaveLength(1)
  expect(p.criteria[0].description).not.toMatch(/teoría celular/)
 })
})
