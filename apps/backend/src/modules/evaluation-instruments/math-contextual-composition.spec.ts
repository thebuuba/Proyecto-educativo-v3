import { describe, expect, it } from 'vitest'
import { recommend, topicTerms } from './recommendation-engine'
import type { AcademicContext } from './curriculum-context'
import { findSecondaryScienceTopic, firstSecondaryLanguageGenre, findSecondaryLanguageTopic } from '@aula/shared'

const description = 'Los estudiantes resolverán situaciones prácticas relacionadas con la organización de datos mediante matrices. A partir de ejemplos de ventas de productos, cantidades y precios, construirán matrices y realizarán operaciones de suma, resta y multiplicación, según corresponda. Finalmente, explicarán los procedimientos utilizados e interpretarán los resultados, demostrando cómo las matrices facilitan la organización de información y la resolución de problemas de la vida cotidiana.'
const context: AcademicContext = { level: 'SECONDARY', grade: 5, cycle: 2, subjectCode: 'MAT', subjectName: 'Matemática', modalityCode: 'academic', optativeExitName: null }
const formats = ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const
const run = (title: string, task = description, format: typeof formats[number] = 'rubrica', maxScore = 20, extra = false) => recommend({activityTitle: title, description: task, participationMode: 'INDIVIDUAL', maxScore, preferredInstrumentType: format, includeAdditionalCandidates: extra}, context, null, [], 'UNMAPPED', null)

describe('Composición matemática compartida', () => {
  it.each(formats)('contextualiza matrices en %s con títulos neutrales y 20/17.35', format => {
    for (const total of [20, 17.35]) {
      const result = run('Actividad 1', description, format, total)
      expect(result.criteria.some(c=>c.templateId==='mat-5-matrices-selection')).toBe(true)
      for(const key of ['calculation','result','explanation','representation','interpretation'])expect(result.criteria.some(c=>c.templateId.startsWith('mat-5-matrices-'+key))).toBe(true)
      expect(result.criteria.map(c=>c.description).join(' ')).toMatch(/filas.*columnas/)
      expect(result.criteria.map(c=>c.description).join(' ')).toMatch(/dimensiones/)
      expect(result.criteria.map(c=>c.description).join(' ')).toContain('según corresponda')
      expect(result.totalScoreUnits).toBe(Math.round(total * 100))
      expect(new Set(result.criteria.map(c=>c.maxScoreUnits)).size).toBeGreaterThan(1)
      if (format === 'lista-ponderada') expect(result.criteria.every(c=>c.description.includes('Parcial (50%):'))).toBe(true)
      if (result.levels.length) expect(result.criteria.every(c=>new Set(c.descriptors.map(d=>d.text)).size === 4)).toBe(true)
    }
  })
  it.each(['Aplicamos las matrices para organizar y resolver problemas cotidianos', '¿Cómo nos ayudan las matrices a entender el comercio?', 'Nuestro viaje creativo por el universo de los números'])('no concatena el título %s', title => {
    expect(run(title).criteria.map(c=>[c.title,c.description,c.descriptors.map(d=>d.text)])).toEqual(run('Actividad 1').criteria.map(c=>[c.title,c.description,c.descriptors.map(d=>d.text)]))
  })
  it('no añade plantillas genéricas al agotar el proveedor', () => {
    expect(run('Actividad 1', description, 'rubrica', 20, true).criteria.every(c=>c.templateId.startsWith('mat-5-matrices-'))).toBe(true)
  })
  it('ofrece una comprobación adicional solamente cuando se solicita', () => {
    const task=description+' Comprobarán los resultados contrastándolos con los datos originales.'
    expect(run('Actividad 1').criteria.some(c=>c.templateId.endsWith('-verification'))).toBe(false)
    expect(run('Actividad 1',task).criteria.some(c=>c.templateId==='mat-5-matrices-verification')).toBe(true)
    const expanded=run('Actividad 1',task,'rubrica',20,true)
    expect(expanded.criteria).toEqual(run('Actividad 1',task).criteria)
    expect(expanded.criteria.at(-1)?.templateId).toBe('mat-5-matrices-verification')
  })
  it('cambia la evidencia al cambiar la acción', () => {
    const result = run('Actividad 1', 'Compararán dos matrices de cantidades y precios e interpretarán las diferencias entre sus filas y columnas.')
    expect(result.criteria.some(c=>c.templateId === 'mat-5-matrices-comparison')).toBe(true)
    expect(result.criteria.some(c=>c.templateId === 'mat-5-matrices-calculation')).toBe(false)
  })
  it('no añade explicación ni productos cuando se pide únicamente organizar o sumar',()=>{
    const construction=run('Actividad 1','Construirán matrices para organizar datos de cantidades y precios.')
    expect(construction.criteria.some(c=>/explica/i.test(c.description))).toBe(false)
    const sum=run('Actividad 1','Resolverán sumas de matrices de cantidades y precios.')
    expect(JSON.stringify(sum.criteria)).not.toMatch(/productos|multiplicación/)
  })
  it('no conserva matrices cuando cambia la descripción', () => {
    expect(run('Matrices', 'Resolverán problemas de porcentajes y explicarán el descuento aplicado.').criteria.some(c=>c.templateId.startsWith('math-matrices-'))).toBe(false)
    expect(run('Matrices', 'Resolverán problemas de porcentajes y explicarán el descuento aplicado.').criteria.some(c=>c.description.includes('al abordar matrices'))).toBe(false)
    expect(run('Matrices', 'Resolverán problemas de porcentajes y explicarán el descuento aplicado.').criteria.some(c=>/matrices/i.test(c.description))).toBe(false)
  })
  it('no filtra a Lengua ni a otro grado', () => {
    for (const ctx of [{...context,subjectCode:'LEN',subjectName:'Lengua Española'}, {...context,grade:2,cycle:1}]) {
      expect(recommend({activityTitle:'Matrices',description,participationMode:'INDIVIDUAL',maxScore:20},ctx,null,[],'UNMAPPED',null).criteria.some(c=>c.templateId.startsWith('math-matrices-'))).toBe(false)
    }
  })
  it('prioriza la descripción frente a títulos antiguos en Ciencias y Lengua',()=>{
    expect(findSecondaryScienceTopic('Ley de Ohm','Resolverán problemas de densidad y explicarán los resultados.',{level:'SECONDARY',grade:6,subjectCode:'NAT-FIS'})).toBeNull()
    expect(findSecondaryScienceTopic('Células','Explicarán las partes de un volcán y compararán sus tipos.',{level:'SECONDARY',grade:2,subjectCode:'NAT-VIDA'})).toBeNull()
    expect(firstSecondaryLanguageGenre('Informe de lectura','Elaborarán una guía turística de dos lugares de la comunidad.')).toBe('TOURIST_GUIDE')
    expect(findSecondaryLanguageTopic('La noticia','Elaborarán una guía turística de dos lugares.',{level:'SECONDARY',grade:2,subjectCode:'LEN'})?.id).toBe('guia-turistica')
    expect(findSecondaryLanguageTopic('La guía turística','Redactarán un informe de lectura con resumen.',{level:'SECONDARY',grade:2,subjectCode:'LEN'})?.id).toBe('informe-de-lectura')
  })
  it('la búsqueda curricular no conserva el tema incompatible del título',()=>{
    expect(topicTerms('Ley de Ohm','Resolverán problemas de densidad y explicarán los resultados.')).not.toContain('ohm')
    expect(topicTerms('Informe de lectura','Elaborarán una guía turística de dos lugares de la comunidad.')).not.toContain('inform')
  })
})
