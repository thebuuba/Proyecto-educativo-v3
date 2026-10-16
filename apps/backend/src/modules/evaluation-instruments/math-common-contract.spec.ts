import { describe, expect, it } from 'vitest'
import { detectTeachingStrategy } from '@aula/shared'
import { recommend } from './recommendation-engine'
import topics from '../../../../../data/evaluation-instruments/math-grade-1-contracts.json'
const cases=topics.flatMap(f=>[f,...(f.variants??[]).map(v=>({...v,id:f.id}))])

const context = { level: 'SECONDARY' as const, grade: 1, cycle: 1, modalityCode: 'academic', subjectCode: 'MAT', subjectName: 'Matemática', optativeExitName: null }
const propose = (description: string, format: 'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada' = 'rubrica', maxScore = 20, activityTitle = 'Actividad') => recommend({ activityTitle, description, maxScore, preferredInstrumentType: format, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
describe('Matemática común 1.º: contenido solicitado, acciones y formatos', () => {
  for (const f of cases) for (const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for (const total of [20,17.35]) it(`${f.id}/${format}/${total}`, () => {
    const p=propose(f.description,format,total)
    expect(p.activityType).toBe(f.activity)
    for(const action of ('requiredActions' in f?f.requiredActions:[]))expect(p.criteria.some(c=>c.templateId.includes('-'+action))).toBe(true)
    expect(p.criteria.some(c=>c.templateId.startsWith(`mat-1-${f.id}-`))).toBe(true)
    expect(p.criteria.every(c=>c.templateId.startsWith('mat-1-'))).toBe(true)
    expect(p.criteria.length).toBeGreaterThan(0);expect(p.criteria.length).toBeLessThanOrEqual(20)
    expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
    expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
    expect(propose(f.description,format,total,'Ensayo de literatura inglesa').criteria).toEqual(p.criteria)
    expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/rapidez|estética|caligrafía|participación|cartulina|datos ficticios/)
  })
  it('explicación y negación no obligan a calcular ni a producir un gráfico',()=>{
    const p=propose('Explica el procedimiento para operar fracciones. No calcules resultados ni dibujes gráficos.')
    expect(p.criteria.some(c=>c.templateId.endsWith('-explanation'))).toBe(true)
    expect(p.criteria.some(c=>/-calculation|-result|-representation/.test(c.templateId))).toBe(false)
  })
  it('conserva acciones independientes de dos temas sin combinar sus productos',()=>{
    const p=propose('Calcula operaciones con enteros y representa fracciones en la recta numérica.')
    expect(p.criteria.some(c=>c.templateId==='mat-1-integers-calculation')).toBe(true)
    expect(p.criteria.some(c=>c.templateId==='mat-1-rationals-representation')).toBe(true)
    expect(p.criteria.some(c=>c.templateId==='mat-1-integers-representation')).toBe(false)
  })
  it('una alternativa no exige ambos productos',()=>{
    const p=propose('Explica operaciones con fracciones o representa los números racionales indicados.')
    expect(p.criteria.some(c=>c.templateId.includes('alternative'))).toBe(true)
    expect(p.criteria.some(c=>c.templateId.endsWith('-representation'))).toBe(false)
  })
  it('análisis de errores no obliga a corregirlos cuando no se pide',()=>{
    const p=propose('Analiza los errores del procedimiento de operaciones con enteros.')
    expect(p.criteria.some(c=>c.templateId==='mat-1-integers-error')).toBe(true)
    expect(p.criteria.some(c=>c.templateId.endsWith('-correction'))).toBe(false)
  })
  it('el problema no fuerza ABProblemas',()=>{
    expect(detectTeachingStrategy({ ...context, description:'Resuelve problemas de interés simple.' }).id).toBeNull()
  })
  it.each(['Suma fracciones.','Resta números enteros.','Multiplica números racionales.'])('consigna habitual breve: %s',description=>{
    const p=propose(description)
    expect(p.activityType).toBe('EXERCISE_SET')
    expect(p.criteria.every(c=>c.templateId.startsWith('mat-1-'))).toBe(true)
  })
  it('el análisis de un procedimiento no equivale a ejecutarlo',()=>{
    const p=propose('Los estudiantes explicarán cómo calcular con números racionales y analizarán los errores de las operaciones dadas.')
    expect(p.criteria.some(c=>/-calculation|-result/.test(c.templateId))).toBe(false)
  })
  it('nombra las operaciones solicitadas y separa las medidas independientes en cotejo',()=>{
    expect(propose('Suma y resta fracciones.').criteria.map(c=>c.description).join(' ')).toMatch(/suma.*resta/)
    const p=propose('Calcula la media, mediana y moda de los datos dados.','lista-cotejo')
    for(const measure of ['media','mediana','moda']) expect(p.criteria.some(c=>c.templateId.includes(`result:${measure}`))).toBe(true)
  })
  it.each([
    ['Lee y escribe los números enteros indicados.',['reading','notation']],
    ['Ordena los números racionales indicados.',['ordering']],
    ['Recolecta y organiza los datos agrupados de la investigación.',['collection','organization']],
  ] as const)('conserva acciones curriculares distintas del cálculo: %s',(description,actions)=>{
    const p=propose(description)
    for(const action of actions)expect(p.criteria.some(c=>c.templateId.endsWith('-'+action))).toBe(true)
    expect(p.criteria.some(c=>c.templateId.endsWith('-calculation'))).toBe(false)
  })
  it('investigar el origen de impuestos no impone calcular una tasa',()=>{
    const p=propose('Investiga el origen de los impuestos.')
    expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/tasa|importe|base del impuesto/)
  })
  it('las negaciones de productos y la recta numérica no añaden geometría ni proyectos',()=>{
    const p=propose('Representa fracciones en la recta numérica. No elabores un proyecto ni un afiche.')
    expect(p.activityType).toBe('EXERCISE_SET')
    expect(p.criteria.every(c=>c.templateId.startsWith('mat-1-rationals-'))).toBe(true)
  })
  it('respeta una alternativa con varias acciones en una rama',()=>{
    const p=propose('Calcula y explica operaciones con enteros o representa fracciones en la recta numérica.')
    expect(p.criteria).toHaveLength(1)
    expect(p.criteria[0].description).toMatch(/alternativa elegida/i)
    expect(p.criteria[0].description).toMatch(/O BIEN/)
  })
  it('analizar un proyecto proporcionado no exige elaborar un proyecto',()=>{
    const p=propose('Analiza los errores del cálculo de porcentajes del proyecto proporcionado.')
    expect(p.activityType).toBe('ANALYSIS')
    expect(p.criteria.some(c=>c.templateId.endsWith('-model'))).toBe(false)
  })
  it('datos agrupados no es una orden de agrupar',()=>{
    expect(propose('Interpreta el histograma de los datos agrupados.').criteria.some(c=>c.templateId.endsWith('-organization'))).toBe(false)
  })
  it('comprender los datos e incógnitas de un problema se distingue de ejecutarlo',()=>{
    const p=propose('Resuelve el problema de porcentajes dado.')
    expect(p.criteria.some(c=>c.templateId.endsWith('-understanding'))).toBe(true)
    expect(propose('Calcula porcentajes.').criteria.some(c=>c.templateId.endsWith('-understanding'))).toBe(false)
  })
  it('una negación no elimina la acción afirmativa tras pero',()=>{
    const p=propose('No calcules resultados, pero explica el procedimiento con fracciones.')
    expect(p.criteria.some(c=>c.templateId.endsWith('-explanation'))).toBe(true)
    expect(p.criteria.some(c=>c.templateId.endsWith('-calculation'))).toBe(false)
  })
  it('compara interés simple y compuesto sin exigir calcularlos',()=>{
    const p=propose('Compara el interés simple y compuesto.')
    expect(p.criteria.some(c=>c.templateId==='mat-1-compound-interest-comparison')).toBe(true)
    expect(p.criteria.some(c=>c.templateId.endsWith('-calculation'))).toBe(false)
  })
  it('estima una magnitud con los datos disponibles sin exigir un cálculo exacto',()=>{
    const p=propose('Estima la capacidad de los recipientes dados.')
    expect(p.criteria.some(c=>c.templateId.endsWith('-estimation'))).toBe(true)
    expect(p.criteria.some(c=>c.templateId.endsWith('-calculation'))).toBe(false)
  })
  it('conserva la comprobación solicitada con comprueba',()=>{
    expect(propose('Resuelve problemas con el teorema de Pitágoras y comprueba los resultados.').criteria.some(c=>c.templateId.endsWith('-verification'))).toBe(true)
  })
  it('identificar una pirámide no añade un prisma por la palabra vértices',()=>{
    const p=propose('Identifica las aristas y vértices de la pirámide dada.')
    expect(p.criteria.every(c=>c.templateId.startsWith('mat-1-pyramids-'))).toBe(true)
  })
  it('conserva el histograma cuando también se pide interpretar la media',()=>{
    const p=propose('Interpreta el histograma y la media de los datos proporcionados.')
    expect(p.criteria.some(c=>c.templateId==='mat-1-statistics-interpretation')).toBe(true)
    expect(p.criteria.some(c=>c.templateId==='mat-1-central-interpretation')).toBe(true)
  })
  it('explicar el origen de los impuestos no obliga a explicar una tasa',()=>{
    expect(propose('Explica el origen de los impuestos.').criteria.map(c=>c.description).join(' ')).not.toMatch(/tasa|importe|base del impuesto/)
  })
})
