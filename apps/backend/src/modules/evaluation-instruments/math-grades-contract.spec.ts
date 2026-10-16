import { describe, expect, it } from 'vitest'
import { detectTeachingStrategy } from '@aula/shared'
import { recommend } from './recommendation-engine'
import fifthGrade from '../../../../../data/evaluation-instruments/math-grade-5-contracts.json'
import fourthGrade from '../../../../../data/evaluation-instruments/math-grade-4-contracts.json'
import thirdGrade from '../../../../../data/evaluation-instruments/math-grade-3-contracts.json'
import topics from '../../../../../data/evaluation-instruments/math-grade-2-contracts.json'
for(const [grade,topicsForGrade] of [[2,topics],[3,thirdGrade],[4,fourthGrade],[5,fifthGrade]] as const){
const cases=topicsForGrade.flatMap(f=>[f,...(f.variants??[]).map(v=>({...v,id:f.id}))])

const context = { level: 'SECONDARY' as const, grade, cycle: grade<=3?1:2, modalityCode: 'academic', subjectCode: 'MAT', subjectName: 'Matemática', optativeExitName: null }
const propose = (description: string, format: 'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada' = 'rubrica', maxScore = 20, activityTitle = 'Actividad') => recommend({ activityTitle, description, maxScore, preferredInstrumentType: format, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
describe(`Matemática común ${grade}.º: contenido solicitado, acciones y formatos`, () => {
  for (const f of cases) for (const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for (const total of [20,17.35]) it(`${f.id}/${format}/${total}`, () => {
    const p=propose(f.description,format,total)
    expect(p.activityType).toBe(f.activity)
    for(const action of ('requiredActions' in f?f.requiredActions:[]))expect(p.criteria.some(c=>c.templateId.includes('-'+action))).toBe(true)
    expect(p.criteria.some(c=>c.templateId.startsWith(`mat-${grade}-${f.id}-`))).toBe(true)
    expect(p.criteria.every(c=>c.templateId.startsWith(`mat-${grade}-`))).toBe(true)
    expect(p.criteria.length).toBeGreaterThan(0);expect(p.criteria.length).toBeLessThanOrEqual(20)
    expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
    expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
    expect(propose(f.description,format,total,'Ensayo de literatura inglesa').criteria).toEqual(p.criteria)
    expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/rapidez|estética|caligrafía|participación|cartulina|datos ficticios/)
  })
  if(grade===5){
    it('respeta operaciones negadas y una consigna con error habitual',()=>{
      const p=propose('No multipliquen matrices, pero explica sus dimensiones.')
      expect(p.criteria.some(c=>c.templateId.endsWith('-calculation'))).toBe(false)
      expect(propose('Resulve problemas con vectores.').activityType).toBe('PROBLEM_SOLVING')
    })
    it('comprobar identidades exige dominio y equivalencia, no un solo ejemplo',()=>{
      const p=propose('Comprueba las identidades trigonométricas pitagóricas dadas.')
      expect(p.criteria[0].description).toMatch(/dominio común/)
      expect(p.criteria[0].description).toMatch(/un solo ejemplo/)
    })
    it('la gráfica proporcionada no obliga a dibujar y analizar/corregir conserva ambas acciones',()=>{
      const graph=propose('Analiza los errores de la gráfica de la tangente.')
      expect(graph.criteria.map(c=>c.templateId)).toEqual(['mat-5-trig-graphs-error'])
      const identity=propose('Analiza y corrige los errores de la identidad trigonométrica dada.')
      expect(identity.criteria.some(c=>c.templateId==='mat-5-identities-error')).toBe(true)
      expect(identity.criteria.some(c=>c.templateId==='mat-5-identities-correction')).toBe(true)
    })
    it('distingue matriz inversa de operación genérica y conserva opciones',()=>{
      expect(propose('Calcula la matriz inversa cuando exista.').criteria.every(c=>c.templateId.startsWith('mat-5-inverse-'))).toBe(true)
      const p=propose('Explica la ley de los senos o representa la parábola dada. No calcules resultados.')
      expect(p.criteria).toHaveLength(1);expect(p.criteria[0].description).toMatch(/O BIEN/)
      expect(p.criteria[0].description).not.toMatch(/Obtiene el resultado/)
    })
  }
  if(grade===4){
    it('el cotejo conserva ángulos y perímetro como resultados independientes',()=>{
      const p=propose('Calcula los ángulos y perímetro de los polígonos dados.','lista-cotejo')
      expect(p.criteria.some(c=>c.templateId.includes('result:angulos'))).toBe(true)
      expect(p.criteria.some(c=>c.templateId.includes('result:perimetro'))).toBe(true)
    })
    it('un dibujo proporcionado no exige dibujar y explicar errores no duplica la explicación',()=>{
      const p=propose('Explica los errores de los ángulos de la figura dibujada.')
      expect(p.criteria).toHaveLength(1)
      expect(p.criteria[0].templateId).toBe('mat-4-angles-error')
      expect(p.activityType).toBe('ANALYSIS')
    })
    it('respeta una medida negada y una alternativa de construcción',()=>{
      const p=propose('No midas los ángulos, pero explica su relación o construye los ángulos dados.')
      expect(p.criteria).toHaveLength(1);expect(p.criteria[0].description).toMatch(/O BIEN/)
      expect(p.criteria[0].description).not.toMatch(/Obtiene el resultado/)
    })
  }
  if(grade===3){
    it('Descartes no exige factorizar ni relacionar factores',()=>{
      expect(propose('Explica las posibilidades de raíces según Descartes.').criteria.every(c=>c.templateId.startsWith('mat-3-descartes-'))).toBe(true)
    })
    it('cotejo conserva los dos casos y las dos medidas solicitadas',()=>{
      const p=propose('Factoriza la suma de cubos y la diferencia de cubos dadas.','lista-cotejo')
      expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/diferencia de cubos/)
      const f=propose('Calcula el dominio y rango de la función algebraica dada.','lista-cotejo')
      expect(f.criteria.some(c=>c.templateId.includes('result:dominio'))).toBe(true)
      expect(f.criteria.some(c=>c.templateId.includes('result:rango'))).toBe(true)
    })
    it('la alternativa no impone ambas ramas ni un cálculo negado',()=>{
      const p=propose('Explica la división sintética o representa el valor absoluto. No calcules resultados.')
      expect(p.criteria).toHaveLength(1);expect(p.criteria[0].description).toMatch(/O BIEN/)
      expect(p.criteria[0].description).not.toMatch(/Obtiene el resultado/)
    })
  }
  if(grade===2){
  it('negación de reducir no exige operar expresiones',()=>{
    const p=propose('Explica los términos semejantes. No reduzcas expresiones algebraicas.')
    expect(p.criteria.some(c=>c.templateId.endsWith('-calculation'))).toBe(false)
  })
  it('la esfera recibe una explicación pertinente de su desarrollo',()=>{
    const p=propose('Explica por qué la esfera no admite un desarrollo plano exacto.')
    expect(p.criteria.map(c=>c.description).join(' ')).toMatch(/curvatura|distorsión/)
    expect(p.criteria.some(c=>c.templateId.endsWith('-representation'))).toBe(false)
  })
  it('alternativas, acciones mixtas y elecciones manuales permanecen propias',()=>{
    const p=propose('Resuelve ecuaciones de primer grado o representa las coordenadas dadas.','escala',17.35)
    expect(p.instrumentType).toBe('escala');expect(p.criteria).toHaveLength(1)
    expect(p.criteria[0].description).toMatch(/O BIEN/)
    const m=propose('Reduce términos semejantes y representa las coordenadas dadas.')
    expect(m.criteria.some(c=>c.templateId==='mat-2-expressions-calculation')).toBe(true)
    expect(m.criteria.some(c=>c.templateId==='mat-2-coordinates-representation')).toBe(true)
    expect(m.criteria.some(c=>c.templateId==='mat-2-expressions-representation')).toBe(false)
  })
  }
})
}
