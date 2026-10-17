import { describe, expect, it } from 'vitest'
import { detectTeachingStrategy, teachingStrategies, resolveTeachingStrategy, teachingStrategyAllowed } from '@aula/shared'

describe('estrategia pedagógica independiente', () => {
  const cases = [
    ['Analizan un caso real con datos concretos y justifican una decisión.', 'CASE_STUDY'],
    ['Plantean preguntas, buscan información y contrastan explicaciones.', 'INQUIRY'],
    ['Dialogan mediante preguntas abiertas guiadas por el docente.', 'DIALOGIC_INQUIRY'],
    ['Identifican una necesidad de la comunidad, planifican, investigan y elaboran un producto para atenderla.', 'PROJECT_BASED'],
    ['Parten de un problema de la vida cotidiana, formulan hipótesis e investigan alternativas de solución.', 'PROBLEM_BASED'],
    ['Recuperan sus experiencias previas y comparten lo que ya saben.', 'PRIOR_EXPERIENCES'],
    ['El docente explica de forma organizada los conocimientos y propone ejemplos para comprenderlos.', 'EXPOSITORY'],
    ['Visitan la comunidad, dialogan con sus habitantes y proponen soluciones al problema ambiental.', 'ENVIRONMENT_IMMERSION'],
    ['Comparten opiniones en grupo, contrastan aportes y acuerdan conclusiones.', 'GROUP_SOCIALIZATION'],
    ['Debaten posturas opuestas con argumentos y réplicas.', 'DEBATE'],
    ['Dramatizan una situación social mediante personajes y diálogos.', 'DRAMATIZATION'],
    ['Realizan un foro para intercambiar opiniones y responder aportes.', 'FORUM'],
    ['Simulan una entrevista asumiendo roles para practicar la comunicación.', 'SIMULATION'],
    ['Resuelven diez ejercicios de sumas en grupo.', null],
    ['Elaboran un afiche como producto final.', null],
    ['Presentan oralmente un tema ante sus compañeros.', null],
    ['Leen un texto sobre el aprendizaje basado en proyectos y resumen su definición.', null],
    ['No realizarán debate; resolverán ejercicios.', null],
    ['Recursos: un video de un debate. Escriben un resumen.', null],
    ['Los estudiantes no debatirán posturas opuestas con argumentos; resolverán ejercicios.', null],
    ['Analizan las características del debate y sus argumentos.', null],
    ['Utilizan como recurso un video de un debate con argumentos. Escriben un resumen.', null],
    ['Realizan una mesa redonda con moderación e intercambio de perspectivas.', 'ROUND_TABLE'],
    ['Organizan un simposio con exposiciones complementarias.', 'SYMPOSIUM'],
    ['Realizan un taller de práctica guiada y revisión de sus producciones.', 'WORKSHOP'],
    ['Realizan la actividad.', null],
  ] as const
  it.each(cases)('%s', (description, id) => {
    expect(detectTeachingStrategy({description, title: 'Actividad', level: 'SECONDARY'}).id).toBe(id)
  })
  it('prioriza la descripción, no un título incompatible ni marcado HTML', () => {
    expect(detectTeachingStrategy({title:'Debate', description:'<p>Analizan un caso real con datos&nbsp;concretos y justifican una decisión.</p>', level:'SECONDARY'}).id).toBe('CASE_STUDY')
    expect(detectTeachingStrategy({title:'Debate', description:'Resuelven ejercicios.', level:'SECONDARY'}).id).toBeNull()
  })
  it('unifica alias sin mezclar ABP ambiguo', () => {
    expect(resolveTeachingStrategy('diálogo socrático')?.id).toBe('DIALOGIC_INQUIRY')
    expect(resolveTeachingStrategy('ABP')).toBeNull()
    expect(resolveTeachingStrategy('aprendizaje basado en proyectos')?.id).toBe('PROJECT_BASED')
  })
  it('catálogo estable, documentado y ámbito explícito', () => {
    expect(new Set(teachingStrategies.map(s=>s.id)).size).toBe(16)
    for (const s of teachingStrategies) {
      expect(s.sources.length).toBeGreaterThan(0)
      expect(s.exclusions.length).toBeGreaterThan(0)
    }
    expect(teachingStrategyAllowed('FORUM', {level:'PRIMARY'})).toBe(false)
    expect(teachingStrategyAllowed('FORUM', {level:'SECONDARY'})).toBe(true)
    expect(teachingStrategyAllowed('inventado', {level:'SECONDARY'})).toBe(false)
  })
  it.each(['LEN','ING','MAT','NAT','SOC','ART','EFI'])('transversal %s de primero a sexto',subjectCode=>{
    for(let grade=1;grade<=6;grade++)expect(detectTeachingStrategy({title:'Tarea',description:cases[0][0],level:'SECONDARY',grade,subjectCode}).id).toBe('CASE_STUDY')
  })
})
