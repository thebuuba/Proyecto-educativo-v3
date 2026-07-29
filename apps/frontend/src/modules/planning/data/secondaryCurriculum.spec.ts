import { describe, expect, it } from 'vitest'

import {
  curricularAreaForSubject,
  curriculumUnitsFor,
  secondaryGradeNumber,
} from './secondaryCurriculum'

describe('catálogo curricular secundario', () => {
  it('clasifica las asignaturas en las áreas oficiales', () => {
    expect(curricularAreaForSubject('Biología')).toBe('Ciencias de la Naturaleza')
    expect(curricularAreaForSubject('Ciencias de la Tierra y del Universo')).toBe(
      'Ciencias de la Naturaleza',
    )
    expect(curricularAreaForSubject('Lenguas Extranjeras: Inglés')).toBe(
      'Lenguas Extranjeras (Inglés y Francés)',
    )
    expect(curricularAreaForSubject('Educación Física')).toBe('Educación Física')
    expect(curricularAreaForSubject('Salida Optativa: Matemática y Tecnología')).toBe(
      'Matemática y Tecnología',
    )
  })

  it('reconoce los seis grados secundarios sin confundir primaria', () => {
    expect(secondaryGradeNumber('1ro de Secundaria', 'Secundario')).toBe(1)
    expect(secondaryGradeNumber('6.º', 'Secundaria')).toBe(6)
    expect(secondaryGradeNumber('1ro de Primaria', 'Primario')).toBeNull()
  })

  it('mantiene la jerarquía y el orden de Ciencias de la Naturaleza de primer grado', () => {
    const units = curriculumUnitsFor(
      '1ro de Secundaria',
      'Ciencias de la Naturaleza',
      'Secundario',
      'Ciencias de la Tierra y del Universo',
    )

    expect(units.map((unit) => unit.title)).toEqual([
      'Estructura interna del planeta Tierra',
      'Planeta Tierra',
      'Composición y distribución',
      'Fenómenos geológicos',
    ])
    expect(units[1]?.topics).toContain('Deriva continental.')
    expect(units[2]?.topics).toEqual(['Rocas.', 'Minerales.', 'Magma.', 'Suelo.', 'Agua.', 'Aire.'])
  })

  it('mantiene las seis unidades de Lengua Española de primero y sus subtemas', () => {
    const units = curriculumUnitsFor(
      '1ro de Secundaria',
      'Lengua Española',
      'Secundario',
      'Lengua Española',
    )

    expect(units.map((unit) => unit.title)).toEqual([
      'La noticia',
      'La guía turística',
      'El informe de lectura',
      'El afiche',
      'El cuento policiaco y detectivesco',
      'El caligrama',
    ])
    expect(units.find((unit) => unit.title === 'El afiche')?.topics).toEqual([
      'Función y estructura.',
      'El afiche como texto argumentativo.',
      'Situación comunicativa.',
      'Recursos poéticos.',
      'Metáfora.',
      'Pleonasmo.',
      'Elipsis.',
      'Exageración.',
      'Argumentos para convencer.',
      'El imperativo.',
      'Lo connotativo expresivo.',
      'Palabras y frases de prevención o alerta.',
      'Verbos y perífrasis de obligación o posibilidad.',
    ])
  })

  it('separa las ocho unidades de Química de quinto de sus subtemas', () => {
    const units = curriculumUnitsFor(
      '5to de Secundaria',
      'Ciencias de la Naturaleza',
      'Secundario',
      'Química',
    )

    expect(units.map((unit) => unit.title)).toEqual([
      'Teoría atómica moderna',
      'Tabla periódica y propiedades de los elementos químicos',
      'Enlaces y estructuras químicas',
      'Termodinámica',
      'Reacciones químicas',
      'Química de los compuestos de carbono',
      'Biomoléculas y bioquímica',
      'Geoquímica y astroquímica',
    ])
    expect(units[0]?.topics).toEqual([
      'Niveles de energía.',
      'Subniveles de energía.',
      'Números cuánticos.',
      'Regla de Pauli.',
      'Regla de Hund.',
      'Configuración electrónica.',
    ])
    expect(units.flatMap((unit) => unit.topics)).not.toContain('Ambiental y de la salud')
    expect(units.flatMap((unit) => unit.topics)).not.toContain(
      'Desarrollo personal y espiritual',
    )
  })

  it('separa las ocho unidades de Ciencias Físicas de tercero de sus subtemas', () => {
    const units = curriculumUnitsFor(
      '3ro de Secundaria',
      'Ciencias de la Naturaleza',
      'Secundario',
      'Ciencias Físicas',
    )

    expect(units.map((unit) => unit.title)).toEqual([
      'Naturaleza de la ciencia',
      'Movimiento',
      'Propiedades de la materia',
      'Energía y conservación',
      'Estados de la materia',
      'Estructura e interacciones de la materia',
      'Movimiento ondulatorio',
      'Nociones de electricidad',
    ])
    expect(units.find((unit) => unit.title === 'Estados de la materia')?.topics).toEqual([
      'Presión.',
      'Densidad.',
      'Fuerza boyante.',
      'Principios de Arquímedes y de Pascal.',
      'Propiedades de sólidos, líquidos y gases.',
      'Temperatura y calor.',
      'Gas ideal.',
      'Tensión superficial y capilaridad de los líquidos.',
      'Cambios de estado de la materia.',
      'Ósmosis.',
      'Metabolismo humano.',
      'Nociones de termodinámica en el ser humano.',
    ])
    expect(units.find((unit) => unit.title === 'Nociones de electricidad')?.topics).toEqual([
      'Carga eléctrica.',
      'Conductores, aislantes y semiconductores.',
      'Circuitos.',
      'Resistencia y corriente.',
      'Resistencia, corriente y voltaje.',
      'Nociones eléctricas en sistemas biológicos.',
    ])
    expect(units.some((unit) => unit.title.startsWith('Observación'))).toBe(false)
  })

  it('mantiene separados los conceptos de Bioelementos de segundo', () => {
    const units = curriculumUnitsFor(
      '2do de Secundaria',
      'Ciencias de la Naturaleza',
      'Secundario',
      'Ciencias de la Vida',
    )

    expect(units.find((unit) => unit.title === 'Bioelementos')?.topics).toEqual([
      'Materia viva.',
      'Niveles de organización.',
      'Célula',
      'Eucariota.',
      'Procariota.',
      'Tejidos.',
      'Órganos.',
      'Sistemas de órganos',
    ])
    expect(
      units
        .find((unit) => unit.title === 'Bioelementos')
        ?.topics.some((topic) => topic.includes('Materia viva. Niveles de organización.')),
    ).toBe(false)
  })

  it('mantiene la jerarquía curricular de Educación Física de sexto', () => {
    const units = curriculumUnitsFor(
      '6to de Secundaria',
      'Educación Física',
      'Secundario',
      'Educación Física',
    )

    expect(units.map((unit) => unit.title)).toEqual([
      'Capacidades físicas',
      'Fútbol',
      'Voleibol',
      'Ajedrez',
      'Deportes con raqueta, optativos',
    ])
    expect(units.find((unit) => unit.title === 'Capacidades físicas')?.topics).toEqual([
      'Capacidades coordinativas (equilibrio, coordinación, orientación, diferenciación, reacción, adaptación y ritmo).',
      'Capacidades condicionales (fuerza, velocidad, flexibilidad y resistencia).',
    ])
    expect(units.some((unit) => unit.title === 'Técnica y táctica.')).toBe(false)
    expect(units.some((unit) => unit.title === 'Tipos de defensa')).toBe(false)
    expect(units.some((unit) => unit.title === 'Sistemas defensivos')).toBe(false)
    expect(units.some((unit) => unit.title === 'Carrera de orientación')).toBe(false)
  })

  it('no expone unidades vacías, duplicadas ni pies de página en el catálogo', () => {
    for (const grade of ['1ro', '2do', '3ro', '4to', '5to', '6to']) {
      for (const area of [
        'Lengua Española',
        'Matemática',
        'Ciencias Sociales',
        'Ciencias de la Naturaleza',
        'Educación Artística',
        'Educación Física',
        'Formación Integral Humana y Religiosa',
      ]) {
        const units = curriculumUnitsFor(`${grade} de Secundaria`, area, 'Secundario')
        const normalizedTitles = units.map((unit) => unit.title.toLocaleLowerCase('es'))

        expect(units.every((unit) => unit.title.trim() && unit.topics.length > 0)).toBe(true)
        expect(new Set(normalizedTitles).size).toBe(normalizedTitles.length)
        expect(
          units.some(
            (unit) =>
              /adecuación curricular|nivel secundario/i.test(unit.title) ||
              unit.topics.some((topic) =>
                /adecuación curricular|nivel secundario/i.test(topic),
              ),
          ),
        ).toBe(false)
      }
    }
  })

  it('cubre todos los grados y áreas del nivel secundario con unidades y subtemas', () => {
    const coreAreas = [
      ['Lengua Española', 'Lengua Española'],
      ['Lenguas Extranjeras (Inglés y Francés)', 'Inglés'],
      ['Lenguas Extranjeras (Inglés y Francés)', 'Francés'],
      ['Matemática', 'Matemática'],
      ['Ciencias Sociales', 'Ciencias Sociales'],
      ['Ciencias de la Naturaleza', 'Ciencias de la Naturaleza'],
      ['Educación Artística', 'Educación Artística'],
      ['Educación Física', 'Educación Física'],
      ['Formación Integral Humana y Religiosa', 'Formación Integral Humana y Religiosa'],
    ] as const

    for (const grade of [1, 2, 3, 4, 5, 6]) {
      for (const [area, subject] of coreAreas) {
        const units = curriculumUnitsFor(
          `${grade}.º de Secundaria`,
          area,
          'Secundario',
          subject,
        )

        expect(units.length, `${grade}.º - ${area} - ${subject}`).toBeGreaterThan(0)
        expect(
          units.every((unit) => unit.title.trim() && unit.topics.length > 0),
          `${grade}.º - ${area} - ${subject}`,
        ).toBe(true)
      }
    }

    for (const grade of [4, 5, 6]) {
      for (const area of [
        'Humanidades y Lenguas Modernas',
        'Humanidades y Ciencias Sociales',
        'Matemática y Tecnología',
        'Ciencias y Tecnología',
      ]) {
        const units = curriculumUnitsFor(
          `${grade}.º de Secundaria`,
          area,
          'Secundario',
          area,
        )

        expect(units.length, `${grade}.º - ${area}`).toBeGreaterThan(0)
        expect(units.every((unit) => unit.title.trim() && unit.topics.length > 0)).toBe(true)
      }
    }
  })
})
