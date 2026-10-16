import { describe, expect, it } from 'vitest'
import { detectTeachingStrategy } from '@aula/shared'
import { recommend } from './recommendation-engine'
import thirdGrade from '../../../../../data/evaluation-instruments/math-grade-3-contracts.json'
import topics from '../../../../../data/evaluation-instruments/math-grade-2-contracts.json'
for(const [grade,topicsForGrade] of [[2,topics],[3,thirdGrade]] as const){
const cases=topicsForGrade.flatMap(f=>[f,...(f.variants??[]).map(v=>({...v,id:f.id}))])

const context = { level: 'SECONDARY' as const, grade, cycle: 1, modalityCode: 'academic', subjectCode: 'MAT', subjectName: 'Matemática', optativeExitName: null }
const propose = (description: string, format: 'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada' = 'rubrica', maxScore = 20, activityTitle = 'Actividad') => recommend({ activityTitle, description, maxScore, preferredInstrumentType: format, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
describe('Matemática común 2.º: contenido solicitado, acciones y formatos', () => {
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
