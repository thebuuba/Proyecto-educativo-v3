import {describe,it,expect} from 'vitest'
import {recommend,detectActivityType} from './recommendation-engine'
import type {AcademicContext} from './curriculum-context'
import fixture from '../../../../../data/evaluation-instruments/novel-task-regression.json'
import {detectSecondaryLanguageActivity,distributeScoreUnits} from '@aula/shared'
const context:AcademicContext={level:'SECONDARY',grade:5,cycle:2,subjectCode:'LEN',subjectName:'Lengua Española',optativeExitName:null,modalityCode:'academic'}
const run=(description=fixture.description,activityTitle=fixture.activityTitle,pedagogicalActivityType?:string)=>recommend({activityTitle,description,pedagogicalActivityType,maxScore:15,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
describe('Contrato entre texto estudiado y producto solicitado',()=>{
  it('service and editor use the same relative weight distribution',()=>{
    const r=run()
    expect(r.criteria.map(c=>c.maxScoreUnits)).toEqual(distributeScoreUnits(1500,r.criteria.map(c=>c.relativeWeight!)))
  })
  it('conserva Análisis pero evalúa las evidencias del fragmento, no crear una novela',()=>{
    const r=run()
    expect(r.activityType).toBe('ANALYSIS')
    expect(r.instrumentType).toBe('rubrica')
    expect(r.criteria.map(c=>c.templateId)).toEqual(['novel-analysis-elements','novel-analysis-clues','novel-analysis-sequence','novel-analysis-interpretation','novel-analysis-writing'])
    expect(JSON.stringify(r.criteria)).not.toMatch(/del las|convenciones del género|crea una novela|exposición oral/)
    expect(r.criteria[2].description).toMatch(/información disponible/)
  })
  it('el título incompatible no contamina los criterios',()=>{
    expect(run(fixture.description,'La noticia').criteria.map(c=>[c.templateId,c.description,c.descriptors])).toEqual(run().criteria.map(c=>[c.templateId,c.description,c.descriptors]))
  })
  it('escribir una narración requiere una evidencia distinta de analizarla',()=>{
    const created=run('Escribirán una narración policíaca con personajes, ambiente, conflicto, pistas y una resolución coherente.')
    expect(created.activityType).toBe('WRITTEN_PRODUCTION')
    expect(created.criteria.map(c=>c.templateId)).not.toEqual(run().criteria.map(c=>c.templateId))
  })
  it('preparar preguntas para analizar una entrevista no exige realizarla',()=>{
    expect(detectActivityType('La entrevista','Prepararán preguntas para analizar una entrevista escrita y justificarán la interpretación con evidencias.').id).toBe('ANALYSIS')
  })
  for(const [genre,type] of [['afiche','POSTER_ANALYSIS'],['caligrama','CALLIGRAM_ANALYSIS'],['noticia','NEWS_ANALYSIS']] as const) it(`elabora un análisis de ${genre}, no el género estudiado`,()=>{
    expect(detectSecondaryLanguageActivity('Actividad',`Leerán un ${genre} y elaborarán un análisis escrito de su significado. Presentarán una interpretación justificada.`,{...context,grade:1})).toBe(type)
  })
  it('una selección de producción escrita conserva la elección pero no cambia el objeto entregado',()=>{
    const r=run(fixture.description,fixture.activityTitle,'WRITTEN_PRODUCTION')
    expect(r.activityType).toBe('WRITTEN_PRODUCTION')
    expect(r.criteria[0].templateId).toBe('novel-analysis-elements')
  })
  it('un tema sin proveedor utiliza análisis, no convenciones de creación literaria',()=>{
    const r=run('Elaborarán un análisis escrito de una entrevista para explicar sus ideas y justificar conclusiones con evidencias.')
    expect(r.criteria.map(c=>c.templateId)).toContain('task-analysis-reasoning')
    expect(JSON.stringify(r.criteria)).not.toMatch(/convenciones del género|recursos del género literario/)
    expect(r.internalTrace.reasons).toContain('coverage=ACTION_ONLY')
  })
  for(const format of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) for(const maxScore of [15,20,17.35]) it(`adapta la misma evidencia a ${format}, total ${maxScore}`,()=>{
    const r=recommend({...fixture,preferredInstrumentType:format,maxScore,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(r.totalScoreUnits).toBe(Math.round(maxScore*100))
    expect(r.criteria).toHaveLength(5)
    expect(r.criteria.slice(0,4).reduce((s,c)=>s+c.maxScoreUnits,0)).toBeGreaterThan(r.criteria[4].maxScoreUnits*4)
    expect(r.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
    expect(JSON.stringify(r.criteria)).not.toMatch(/Lo realiza con precisión|Aún no lo evidencia|exposición oral/)
    if(format==='lista-ponderada') expect(r.criteria.every(c=>c.description.includes('Parcial (50%):'))).toBe(true)
    else if(format==='lista-cotejo') expect(r.levels).toEqual([])
    else if(format==='escala') {
      expect(r.criteria[1].title).toMatch(/pistas/)
      expect(r.levels.map(level=>level.label)).toEqual(['Completo','Suficiente','Parcial','Aún no logrado'])
      expect(r.criteria[1].descriptors.at(-1)?.text).toBe('No demuestra el desempeño descrito en el indicador.')
    } else expect(r.criteria[1].descriptors.at(-1)?.text).toBe('Confunde las pistas o no explica su relación con la investigación.')
  })
  it('ofrece un candidato sobre límites de la interpretación sin duplicar los cinco iniciales',()=>{
    const r=recommend({...fixture,maxScore:15,includeAdditionalCandidates:true,participationMode:'INDIVIDUAL'},context,null,[],'UNMAPPED',null)
    expect(r.criteria.map(c=>c.templateId)).toContain('novel-analysis-limits')
    expect(new Set(r.criteria.map(c=>c.templateId)).size).toBe(6)
  })
  for(const [code,description] of [
    ['NAT-FIS','Elaborarán un informe sobre una investigación científica del movimiento, explicando el procedimiento, los datos obtenidos y sus conclusiones.'],
    ['MAT','Redactarán una explicación escrita de un procedimiento matemático y justificarán cada paso con ejemplos.'],
  ]) it(`un producto escrito de ${code} no crea literatura`,()=>{
    const r=recommend({activityTitle:fixture.activityTitle,description,maxScore:20,participationMode:'INDIVIDUAL'},{...context,subjectCode:code},null,[],'UNMAPPED',null)
    expect(JSON.stringify(r.criteria)).not.toMatch(/convenciones del género|recursos del género literario|novel-analysis|del las pistas/)
    expect(r.criteria.every(c=>c.templateId.startsWith('task-'))).toBe(true)
  })
  it('no aplica novela de quinto a otra asignatura o grado',()=>{
    for(const changed of [{...context,grade:4},{...context,subjectCode:'ENG'}]) {
      const r=recommend({...fixture,maxScore:20,participationMode:'INDIVIDUAL'},changed,null,[],'UNMAPPED',null)
      expect(r.criteria.some(c=>c.templateId.startsWith('novel-analysis'))).toBe(false)
    }
  })
})
