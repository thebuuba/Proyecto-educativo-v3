import { describe, expect, it } from 'vitest'
import { detectTeachingStrategy } from '@aula/shared'
import { recommend } from './recommendation-engine'
import topics from '../../../../../data/evaluation-instruments/math-grade-2-contracts.json'
const cases=topics.flatMap(f=>[f,...(f.variants??[]).map(v=>({...v,id:f.id}))])

const context = { level: 'SECONDARY' as const, grade: 2, cycle: 1, modalityCode: 'academic', subjectCode: 'MAT', subjectName: 'Matemática', optativeExitName: null }
const propose = (description: string, format: 'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada' = 'rubrica', maxScore = 20, activityTitle = 'Actividad') => recommend({ activityTitle, description, maxScore, preferredInstrumentType: format, participationMode: 'INDIVIDUAL' }, context, null, [], 'UNMAPPED', null)
describe('Matemática común 2.º: contenido solicitado, acciones y formatos', () => {
  for (const f of cases) for (const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for (const total of [20,17.35]) it(`${f.id}/${format}/${total}`, () => {
    const p=propose(f.description,format,total)
    expect(p.activityType).toBe(f.activity)
    for(const action of ('requiredActions' in f?f.requiredActions:[]))expect(p.criteria.some(c=>c.templateId.includes('-'+action))).toBe(true)
    expect(p.criteria.some(c=>c.templateId.startsWith(`mat-2-${f.id}-`))).toBe(true)
    expect(p.criteria.every(c=>c.templateId.startsWith('mat-2-'))).toBe(true)
    expect(p.criteria.length).toBeGreaterThan(0);expect(p.criteria.length).toBeLessThanOrEqual(20)
    expect(new Set(p.criteria.map(c=>c.templateId)).size).toBe(p.criteria.length)
    expect(p.criteria.reduce((s,c)=>s+c.maxScoreUnits,0)).toBe(Math.round(total*100))
    expect(propose(f.description,format,total,'Ensayo de literatura inglesa').criteria).toEqual(p.criteria)
    expect(p.criteria.map(c=>c.description).join(' ')).not.toMatch(/rapidez|estética|caligrafía|participación|cartulina|datos ficticios/)
  })
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
})
