import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { secondaryEvaluationProfile, type InstrumentRecommendation } from '@aula/shared'
import { ActivityEditorWorkspace } from './ActivityEditorWorkspace'
import { activityToDraft, draftToActivity, newActivityDraft } from './editor/editorModel'
import {
  editableFallbackRecommendation,
  preparationFingerprint,
  recommendationToFields,
} from '../services/instrumentPreparation'
import { activityDraftStorageKey, readActivityDrafts } from '../utils/activityDraftStorage'
import { api, ApiError } from '@/services/apiClient'
import scienceFixtures from '../../../../../../data/evaluation-instruments/science-regressions.json'
import selectionFixtures from '../../../../../../data/evaluation-instruments/automatic-selection-cases.json'
import novelFixture from '../../../../../../data/evaluation-instruments/novel-task-regression.json'
import grammarCapacity from '../../../../../../data/evaluation-instruments/english-grade-one-grammar-contracts.json'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor', () => ({
  ActivityDescriptionEditor: ({
    value,
    onChange,
  }: {
    value: string
    onChange: (value: string) => void
  }) => (
    <textarea
      aria-label="Descripción de la actividad"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))
const context = {
  schoolId: 'school',
  userId: 'app-user',
  schoolYearId: 'year',
  sectionSubjectId: 'subject',
  academicPeriodId: 'period',
}
function readyDraft() {
  const draft = {
    ...newActivityDraft('b1'),
    name: 'Informe',
    description: 'Elaborar un informe con evidencia.',
    maxScore: '20',
    activityType: 'individual' as const,
    evaluationTechnique: 'analisis-producciones',
    instrumentType: 'lista-cotejo',
    instrumentCompleted: true,
    preparedManuallyEdited: true,
  }
  const proposal = editableFallbackRecommendation({
    activityTitle: draft.name,
    description: draft.description,
    maxScore: 20,
    instrumentType: 'lista-cotejo',
    participationMode: 'INDIVIDUAL',
  })
  return {
    ...draft,
    instrumentFields: recommendationToFields(proposal, draft.name),
    preparedRecommendation: proposal,
    preparedFingerprint: preparationFingerprint(draft),
  }
}
function props() {
  return {
    activityDraftContext: context,
    courseTitle: 'Curso',
    periodShortName: 'P1',
    saving: false,
    onAddActivity: vi.fn(async (input) => ({ ...input, id: 'saved' })),
    onUpdateActivity: vi.fn(async (input) => input),
  }
}

describe('independent activity editor', () => {
  it('conserva la intención automática si cambia la descripción durante la preparación',async()=>{
    const initial={...readyDraft(),preparedManuallyEdited:false,autoSelectedInstrumentType:false}
    const description='Escribirán en inglés una opinión sobre la escuela. Se valorará la calidad en varias dimensiones.'
    const proposal=editableFallbackRecommendation({activityTitle:initial.name,description,academicContext:{level:'SECONDARY',grade:1,subjectCode:'ING'},maxScore:20,participationMode:'INDIVIDUAL',instrumentType:'rubrica'})
    let finish!:(p:InstrumentRecommendation)=>void
    const pending=new Promise<InstrumentRecommendation>(resolve=>{finish=resolve})
    let calls=0
    const post=vi.spyOn(api,'post').mockImplementation(async(path)=>{
      if(path.endsWith('/recommend'))return (++calls===1?await pending:proposal) as never
      return {suggestedActivityType:'WRITTEN_PRODUCTION',suggestedEvaluationTechnique:'analisis-producciones',suggestedInstrumentType:'rubrica',curriculumVersionId:null,curriculumCandidates:[]} as never
    })
    render(<ActivityEditorWorkspace {...props()} initialDraft={initial} sectionSubjectId="subject" instrumentAcademicContext={{level:'SECONDARY',grade:1,subjectCode:'ING'}} />)
    fireEvent.change(screen.getByRole('combobox',{name:'Tipo de instrumento'}),{target:{value:''}})
    await waitFor(()=>expect(calls).toBe(1))
    fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:description}})
    await act(async()=>{finish(initial.preparedRecommendation!);await pending})
    await waitFor(()=>expect(calls).toBeGreaterThan(1),{timeout:5000})
    const requests=post.mock.calls.filter(([path])=>path.endsWith('/recommend'))
    expect(requests.at(-1)?.[1]).toMatchObject({description,preferredInstrumentType:undefined})
    await waitFor(()=>expect(screen.getByRole('combobox',{name:'Tipo de instrumento'})).toHaveValue('rubrica'))
  })
  it('un rechazo por capacidad después de confirmar regeneración conserva la edición manual',async()=>{
    vi.spyOn(api,'post').mockRejectedValue(new ApiError(400,'La consigna requiere 31 criterios y el instrumento admite hasta 20.'))
    const original=readyDraft()
    original.instrumentFields['lista-cotejo:criterion:0']='Criterio editado por el docente'
    render(<ActivityEditorWorkspace {...props()} initialDraft={original} sectionSubjectId="subject" />)
    fireEvent.change(screen.getByLabelText('Criterio 1'),{target:{value:'Criterio editado por el docente (conservado)'}})
    await waitFor(()=>expect(readActivityDrafts(context)).toHaveLength(1))
    const beforeFields=readActivityDrafts(context)[0].draft.instrumentFields
    fireEvent.click(screen.getByRole('button',{name:'Generar nuevo instrumento'}))
    const dialog=await screen.findByRole('dialog',{name:'¿Reemplazar el instrumento editado?'})
    fireEvent.click(within(dialog).getByRole('button',{name:'Cambiar instrumento'}))
    await screen.findByText(/La consigna requiere 31 criterios/)
    expect(screen.getByLabelText('Criterio 1')).toHaveValue('Criterio editado por el docente (conservado)')
    expect(screen.getByRole('textbox',{name:/Valor en puntos/})).toHaveValue('20')
    expect(readActivityDrafts(context)[0].draft.instrumentFields).toEqual(beforeFields)
  })
  for(const offline of [false,true])it(`capacidad excedida conserva el instrumento previo: ${offline?'alternativa':'servicio'}`,async()=>{
    const message='La consigna requiere 31 criterios y el instrumento admite hasta 20.'
    vi.spyOn(api,'post').mockRejectedValue(new ApiError(offline?503:400,offline?'No disponible':message))
    const original={...readyDraft(),name:'Requisitos extensos',description:`Leerán un texto en inglés e identificarán ${grammarCapacity.map(f=>f.term).join(', ')}.`,preparedManuallyEdited:false}
    render(<ActivityEditorWorkspace {...props()} initialDraft={original} sectionSubjectId="subject" instrumentAcademicContext={{level:'SECONDARY',grade:1,subjectCode:'ING'}} />)
    await screen.findByText(/La consigna requiere 31 criterios/,{}, {timeout:5000})
    expect(screen.getByLabelText('Criterio 1')).toHaveValue(original.instrumentFields['lista-cotejo:criterion:0'])
    expect(screen.queryByText(/Revisa el instrumento alternativo antes de guardar/)).not.toBeInTheDocument()
    expect(screen.getByRole('textbox',{name:/Valor en puntos/})).toHaveValue('20')
  })
  it('keeps the modality when another field changes before the next render',()=>{
    render(<ActivityEditorWorkspace {...props()} initialDraft={{...newActivityDraft('b1'),name:'Actividad'}} />)
    act(()=>{
      screen.getByRole('button',{name:/^Individual\s*Cada estudiante/}).click()
      fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:'Analizarán una noticia.'}})
    })
    expect(screen.getByRole('button',{name:/✓\s*Modalidad de la actividad/})).toBeInTheDocument()
    expect(screen.getByLabelText('Descripción de la actividad')).toHaveValue('Analizarán una noticia.')
  })
  for (const interruption of ['cancel', 'description', 'context']) it(`activity adaptation discards late response after ${interruption}`, async () => {
    const original = {...readyDraft(), pedagogicalActivityType: 'REPORT'}
    original.preparedFingerprint = preparationFingerprint(original)
    const adapted = {...original.preparedRecommendation, activityType: 'ANALYSIS', criteria: original.preparedRecommendation.criteria.map(c => ({...c, title: 'Respuesta obsoleta'}))}
    let resolveResponse!: (value: InstrumentRecommendation) => void
    const calls = vi.spyOn(api, 'post').mockImplementation(path => path.endsWith('/interpret')
      ? Promise.resolve({suggestedActivityType: 'REPORT', activityType: 'REPORT'})
      : new Promise(resolve => { resolveResponse = resolve }))
    const view = render(<ActivityEditorWorkspace {...props()} initialDraft={original} sectionSubjectId="subject" />)
    fireEvent.change(screen.getByRole('combobox', {name: 'Tipo de actividad'}), {target: {value: 'ANALYSIS'}})
    const dialog = await screen.findByRole('dialog', {name: 'Cambiar tipo de actividad'})
    fireEvent.click(within(dialog).getByRole('button', {name: 'Adaptar instrumento'}))
    await waitFor(() => expect(resolveResponse).toBeTypeOf('function'))
    expect(calls.mock.calls.filter(([path]) => path.endsWith('/recommend'))).toHaveLength(1)
    if (interruption === 'cancel') fireEvent.click(within(dialog).getByRole('button', {name: 'Cancelar'}))
    if (interruption === 'description') fireEvent.change(screen.getByLabelText('Descripción de la actividad'), {target: {value: 'Una consigna diferente.'}})
    if (interruption === 'context') view.rerender(<ActivityEditorWorkspace {...props()} initialDraft={original} sectionSubjectId="changed-subject" />)
    await act(async () => resolveResponse(adapted))
    expect(screen.getByLabelText('Criterio 1')).toHaveValue(original.preparedRecommendation.criteria[0].title)
    expect(screen.getByRole('combobox', {name: 'Tipo de actividad'})).toHaveValue('REPORT')
  })
  for (const invalid of ['forbidden', 'wrong-activity', 'wrong-format']) it(`activity adaptation preserves draft on ${invalid}`, async () => {
    const original = {...readyDraft(), pedagogicalActivityType: 'REPORT'}
    original.preparedFingerprint = preparationFingerprint(original)
    vi.spyOn(api, 'post').mockImplementation(async path => {
      if (path.endsWith('/interpret')) return {suggestedActivityType: 'REPORT', activityType: 'REPORT'}
      if (invalid === 'forbidden') throw new ApiError(403, 'Sin permiso para preparar')
      return {...original.preparedRecommendation, activityType: invalid === 'wrong-activity' ? 'REPORT' : 'ANALYSIS', instrumentType: invalid === 'wrong-format' ? 'rubrica' : original.instrumentType}
    })
    render(<ActivityEditorWorkspace {...props()} initialDraft={original} sectionSubjectId="subject" />)
    fireEvent.change(screen.getByRole('combobox', {name: 'Tipo de actividad'}), {target: {value: 'ANALYSIS'}})
    const dialog = await screen.findByRole('dialog', {name: 'Cambiar tipo de actividad'})
    fireEvent.click(within(dialog).getByRole('button', {name: 'Adaptar instrumento'}))
    await within(dialog).findByRole('alert')
    expect(screen.getByLabelText('Criterio 1')).toHaveValue(original.preparedRecommendation.criteria[0].title)
    expect(readActivityDrafts(context)).toEqual([])
    expect(screen.queryByText(/Revisa el instrumento alternativo/)).not.toBeInTheDocument()
  })
  for (const choice of ['Conservar instrumento', 'Cancelar', 'Cerrar', 'Escape']) it(`activity change transaction: ${choice}`, async () => {
    const original=readyDraft()
    original.preparedRecommendation={...original.preparedRecommendation,catalogVersion:'evaluation-2026.20',activityType:'REPORT'}
    original.pedagogicalActivityType='REPORT'
    original.preparedFingerprint=preparationFingerprint(original)
    vi.spyOn(api,'post').mockRejectedValue(new ApiError(503,'Sin conexión'))
    render(<ActivityEditorWorkspace {...props()} initialDraft={original} sectionSubjectId="subject" />)
    fireEvent.change(screen.getByRole('combobox',{name:'Tipo de actividad'}),{target:{value:'ANALYSIS'}})
    const dialog=await screen.findByRole('dialog',{name:'Cambiar tipo de actividad'})
    expect(screen.getByRole('combobox',{name:'Tipo de actividad'})).toHaveValue('REPORT')
    if(choice==='Escape') fireEvent.keyDown(dialog,{key:'Escape'})
    else fireEvent.click(within(dialog).getByRole('button',{name:choice}))
    await waitFor(()=>expect(screen.queryByRole('dialog',{name:'Cambiar tipo de actividad'})).not.toBeInTheDocument())
    expect(screen.getByRole('combobox',{name:'Tipo de actividad'})).toHaveValue(choice==='Conservar instrumento'?'ANALYSIS':'REPORT')
    expect(screen.getByLabelText('Criterio 1')).toHaveValue(original.preparedRecommendation.criteria[0].title)
    if(choice==='Conservar instrumento') {
      const draft=readActivityDrafts(context)[0].draft as ReturnType<typeof newActivityDraft>
      expect(draft.instrumentFields).toEqual(original.instrumentFields)
      expect(draft.preparedRecommendation).toEqual(original.preparedRecommendation)
      expect(draft.preparedManuallyEdited).toBe(true)
      const payload=draftToActivity(draft)
      expect(payload.instrumentSnapshot?.activityType).toBe('ANALYSIS')
      expect(payload.instrumentSnapshot?.criteria).toEqual(draftToActivity(original).instrumentSnapshot?.criteria)
      fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:'Otra consigna para comparar noticias.'}})
      await act(async()=>{await new Promise(resolve=>setTimeout(resolve,1050))})
      expect(readActivityDrafts(context)[0].draft.instrumentFields).toEqual(original.instrumentFields)
    }
  })
  for (const failure of [false,true]) it(`activity change adaptation ${failure?'failure then retry':'valid response'}`,async()=>{
    const original=readyDraft()
    original.pedagogicalActivityType='REPORT';original.preparedFingerprint=preparationFingerprint(original)
    const adapted={...original.preparedRecommendation,activityType:'ANALYSIS',criteria:original.preparedRecommendation.criteria.map(c=>({...c,title:'Análisis nuevo: '+c.title}))}
    let reject=failure
    vi.spyOn(api,'post').mockImplementation(async path=>{
      if(path.endsWith('/interpret')) return {suggestedActivityType:'REPORT',activityType:'REPORT'}
      if(reject) throw new ApiError(503,'Servicio no disponible')
      return adapted
    })
    render(<ActivityEditorWorkspace {...props()} initialDraft={original} sectionSubjectId="subject" />)
    fireEvent.change(screen.getByRole('combobox',{name:'Tipo de actividad'}),{target:{value:'ANALYSIS'}})
    let dialog=await screen.findByRole('dialog',{name:'Cambiar tipo de actividad'})
    fireEvent.click(within(dialog).getByRole('button',{name:'Adaptar instrumento'}))
    if(failure){
      await within(dialog).findByRole('alert')
      expect(readActivityDrafts(context)).toEqual([])
      expect(screen.getByRole('combobox',{name:'Tipo de actividad'})).toHaveValue('REPORT')
      expect(screen.getByLabelText('Criterio 1')).toHaveValue(original.preparedRecommendation.criteria[0].title)
      reject=false
      fireEvent.click(within(dialog).getByRole('button',{name:'Adaptar instrumento'}))
    }
    await waitFor(()=>expect(screen.queryByRole('dialog',{name:'Cambiar tipo de actividad'})).not.toBeInTheDocument())
    expect((readActivityDrafts(context)[0].draft as ReturnType<typeof newActivityDraft>).pedagogicalActivityType).toBe('ANALYSIS')
    expect(readActivityDrafts(context)[0].draft.instrumentType).toBe(original.instrumentType)
    expect(readActivityDrafts(context)[0].draft.maxScore).toBe(original.maxScore)
    expect(screen.getByLabelText('Criterio 1')).toHaveValue(adapted.criteria[0].title)
  })
  for (const offline of [false, true]) for (const selected of ['rubrica', 'lista-cotejo', 'escala', 'lista-ponderada'] as const) {
    it(`novel: explicit ${selected} before description, ${offline ? 'fallback' : 'service'}`, async () => {
      const academicContext = { level: 'SECONDARY' as const, grade: 5, subjectCode: 'LEN' }
      const proposal = {...editableFallbackRecommendation({...novelFixture, maxScore: 15, instrumentType: selected, participationMode: 'INDIVIDUAL', academicContext}), catalogVersion: 'evaluation-2026.19'}
      const calls = vi.spyOn(api, 'post').mockImplementation(async path => {
        if (offline) throw new ApiError(503, 'Servicio no disponible')
        return path.endsWith('/interpret') ? {suggestedActivityType: 'ANALYSIS', activityType: 'ANALYSIS', suggestedInstrumentType: 'rubrica'} : proposal
      })
      render(<ActivityEditorWorkspace {...props()} initialDraft={newActivityDraft('b1')} sectionSubjectId="subject" instrumentAcademicContext={academicContext} />)
      fireEvent.change(screen.getByRole('combobox', {name: 'Tipo de instrumento'}), {target: {value: selected}})
      fireEvent.change(screen.getByLabelText('Nombre de la actividad *'), {target: {value: novelFixture.activityTitle}})
      fireEvent.click(screen.getByRole('button', {name: /Individual\s*Cada estudiante/}))
      fireEvent.change(screen.getByRole('textbox', {name: /Valor en puntos/}), {target: {value: '15'}})
      fireEvent.change(screen.getByLabelText('Descripción de la actividad'), {target: {value: `<p>${novelFixture.description}</p>`}})
      await waitFor(() => {
        const draft = readActivityDrafts(context)[0]?.draft as ReturnType<typeof newActivityDraft>
        expect(draft?.preparedRecommendation?.catalogVersion).toBe(offline ? 'editable-fallback-v1' : 'evaluation-2026.19')
        expect(draft?.preparedRecommendation?.criteria[0].templateId).toBe('novel-analysis-elements')
        expect(draft?.instrumentType).toBe(selected)
        expect(draft?.autoSelectedInstrumentType).toBe(false)
      }, {timeout: 5000})
      expect(calls.mock.calls.find(([path]) => path.endsWith('/recommend'))?.[1]).toMatchObject({description: novelFixture.description, preferredInstrumentType: selected})
    })
  }
  it('returns to automatic mode after clearing a manual rubric while offline',async()=>{
    vi.spyOn(api,'post').mockRejectedValue(new ApiError(503,'Servicio no disponible'))
    const fixture=selectionFixtures[3]
    render(<ActivityEditorWorkspace {...props()} initialDraft={{...newActivityDraft('b1'),name:fixture.activityTitle,description:fixture.description,maxScore:'20',activityType:'individual',instrumentType:'rubrica',autoSelectedInstrumentType:false}} sectionSubjectId="subject" />)
    await waitFor(()=>expect((readActivityDrafts(context)[0]?.draft as ReturnType<typeof newActivityDraft>)?.preparedRecommendation?.catalogVersion).toBe('editable-fallback-v1'),{timeout:5000})
    expect(readActivityDrafts(context)[0].draft.instrumentType).toBe('rubrica')
    fireEvent.change(screen.getByRole('combobox',{name:'Tipo de instrumento'}),{target:{value:''}})
    await waitFor(()=>expect(readActivityDrafts(context)[0].draft.instrumentType).toBe('lista-ponderada'),{timeout:5000})
    expect((readActivityDrafts(context)[0].draft as ReturnType<typeof newActivityDraft>).autoSelectedInstrumentType).toBe(true)
  })
  for(const selected of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const) {
    it(`preserves explicit ${selected} after description changes`,async()=>{
      const proposal={...editableFallbackRecommendation({activityTitle:'Informe',description:'Elaborar un informe.',maxScore:20,instrumentType:selected,participationMode:'INDIVIDUAL'}),catalogVersion:'evaluation-2026.10'}
      const calls=vi.spyOn(api,'post').mockImplementation(async path=>path.endsWith('/interpret')?{suggestedActivityType:'REPORT',suggestedInstrumentType:'rubrica',activityType:'REPORT'}:proposal)
      render(<ActivityEditorWorkspace {...props()} initialDraft={{...newActivityDraft('b1'),name:'Informe',description:'Elaborar un informe.',maxScore:'20',activityType:'individual',instrumentType:selected,autoSelectedInstrumentType:false}} sectionSubjectId="subject" />)
      await waitFor(()=>expect((readActivityDrafts(context)[0]?.draft as ReturnType<typeof newActivityDraft>)?.preparedRecommendation?.catalogVersion).toBe('evaluation-2026.10'),{timeout:5000})
      fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:'Realizar una observación y registrar presencia o ausencia de características.'}})
      await waitFor(()=>expect(calls.mock.calls.filter(([path])=>path.endsWith('/recommend')).length).toBeGreaterThan(1),{timeout:5000})
      expect(calls.mock.calls.filter(([path])=>path.endsWith('/recommend')).every(([,input])=>(input as {preferredInstrumentType?:string}).preferredInstrumentType===selected)).toBe(true)
      expect(readActivityDrafts(context)[0].draft.instrumentType).toBe(selected)
      expect((readActivityDrafts(context)[0].draft as ReturnType<typeof newActivityDraft>).autoSelectedInstrumentType).toBe(false)
    })
  }
  for (const fixture of selectionFixtures) for (const offline of [false,true]) {
    it(`automatic ${fixture.instrument}, provisional rubric, ${offline?'offline':'service'}`, async () => {
      const proposal={...editableFallbackRecommendation({activityTitle:fixture.activityTitle,description:fixture.description,maxScore:20,instrumentType:fixture.instrument as InstrumentRecommendation['instrumentType'],participationMode:'INDIVIDUAL'}),catalogVersion:'evaluation-2026.10',activityType:fixture.activityType}
      const requests=vi.spyOn(api,'post').mockImplementation(async path=>{
        if(offline)throw new ApiError(503,'Servicio no disponible')
        return path.endsWith('/interpret')?{suggestedActivityType:fixture.activityType,suggestedInstrumentType:fixture.instrument,activityType:fixture.activityType}:proposal
      })
      const old=editableFallbackRecommendation({activityTitle:'Informe inicial',maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL'})
      const draft={...newActivityDraft('b1'),name:fixture.activityTitle,description:fixture.description,maxScore:'20',activityType:'individual' as const,instrumentType:'rubrica',autoSelectedInstrumentType:true,preparedRecommendation:old,preparedFingerprint:'["anterior"]',preparedManuallyEdited:false}
      render(<ActivityEditorWorkspace {...props()} initialDraft={draft} sectionSubjectId="subject" />)
      await waitFor(()=>{
        const stored=readActivityDrafts(context)[0]?.draft as ReturnType<typeof newActivityDraft>
        expect(stored?.instrumentType).toBe(fixture.instrument)
        expect(stored?.preparedRecommendation?.catalogVersion).toBe(offline?'editable-fallback-v1':'evaluation-2026.10')
        expect(stored?.autoSelectedInstrumentType).toBe(true)
        expect(stored?.preparedRecommendation?.activityType).toBe(fixture.activityType)
      },{timeout:5000})
      if(!offline) {
        fireEvent.click(screen.getByRole('button',{name:'Generar nuevo instrumento'}))
        await waitFor(()=>expect(requests.mock.calls.filter(([path])=>path.endsWith('/recommend')).length).toBeGreaterThan(1),{timeout:5000})
        expect(requests.mock.calls.filter(([path])=>path.endsWith('/recommend')).every(([,input])=>(input as {preferredInstrumentType?:string}).preferredInstrumentType===undefined)).toBe(true)
      }
    })
  }
  for (const fixture of scienceFixtures) for (const offline of [false,true]) {
    it(`science ${fixture.id}: ${offline ? '503 activates scoped fallback' : 'valid service response is retained'}`, async () => {
      const academicContext = { level:'SECONDARY' as const,grade:fixture.grade,subjectCode:fixture.code,subjectName:fixture.name }
      const proposal = { ...editableFallbackRecommendation({activityTitle:fixture.activityTitle,description:fixture.description,maxScore:20,instrumentType:'rubrica',participationMode:'INDIVIDUAL',academicContext}), catalogVersion:'evaluation-2026.10' }
      const calls = vi.spyOn(api,'post').mockImplementation(async (path) => {
        if (offline) throw new ApiError(503,'Servicio no disponible')
        return path.endsWith('/interpret') ? {suggestedActivityType:fixture.expectedType,activityType:fixture.expectedType,curriculumVersionId:null} : proposal
      })
      const draft = { ...newActivityDraft('b1'), name:fixture.activityTitle,description:`<p>${fixture.description}</p>`,maxScore:'20',instrumentType:'rubrica',activityType:'individual' as const,evaluationTechnique:'analisis-producciones' }
      render(<ActivityEditorWorkspace {...props()} initialDraft={draft} sectionSubjectId="subject" instrumentAcademicContext={academicContext} />)
      await waitFor(()=>expect(screen.getByLabelText('Criterio 1')).toHaveValue(proposal.criteria[0].title),{timeout:5000})
      await waitFor(()=>expect((readActivityDrafts(context)[0]?.draft as ReturnType<typeof newActivityDraft>)?.preparedRecommendation?.catalogVersion).toBe(offline ? 'editable-fallback-v1' : 'evaluation-2026.10'))
      expect(calls.mock.calls.find(([path])=>path.endsWith('/recommend'))?.[1]).toMatchObject({description:fixture.description})
      expect(screen.queryByText('Dominio del contenido')).not.toBeInTheDocument()
      fireEvent.change(screen.getByLabelText('Criterio 1'),{target:{value:'Edición docente conservada'}})
      await waitFor(()=>expect((readActivityDrafts(context)[0].draft as ReturnType<typeof newActivityDraft>).preparedManuallyEdited).toBe(true))
      expect(screen.getByLabelText('Criterio 1')).toHaveValue('Edición docente conservada')
    })
  }
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })
  it('keeps all activity cards and the editable instrument visible without step navigation', () => {
    render(<ActivityEditorWorkspace {...props()} initialDraft={readyDraft()} />)
    expect(screen.queryByRole('button', { name: '1. Actividad' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '2. Instrumento' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '3. Revisar y guardar' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Anterior' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continuar al instrumento' })).not.toBeInTheDocument()
    for (const title of ['1. Bloques de competencias', '2. Actividad', '3. Modalidad', '4. Evaluación', '5. Recursos']) {
      expect(screen.getByText(title)).toBeVisible()
    }
    expect(screen.getByPlaceholderText('1. Criterio')).toBeVisible()
    expect(screen.getByRole('textbox', { name: /Nombre de la actividad/ })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeVisible()
    expect(screen.queryByText(/Procedencia:/)).not.toBeInTheDocument()
  })
  it('scrolls to and focuses a pending field without hiding the editable instrument', async () => {
    const scrollIntoView = vi.fn()
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))
    const draft = { ...readyDraft(), name: '' }
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} />)
    const name = screen.getByRole('textbox', { name: /Nombre de la actividad/ })
    name.scrollIntoView = scrollIntoView
    fireEvent.click(within(screen.getByRole('complementary')).getByRole('button', { name: /Nombre de la actividad/ }))
    await waitFor(() => expect(name).toHaveFocus())
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' })
    expect(name.closest('[data-activity-required="name"]')?.className).toContain('ring-2')
    expect(screen.getByPlaceholderText('1. Criterio')).toBeVisible()
    fireEvent.change(name, { target: { value: 'Informe' } })
    expect(within(screen.getByRole('complementary')).getByRole('button', { name: /Nombre de la actividad/ })).toBeDisabled()
    vi.unstubAllGlobals()
  })
  it('shows a dismissible brief notice after preparing an editable alternative', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new ApiError(503, 'Servicio no disponible'))
    const draft = { ...readyDraft(), preparedRecommendation: undefined, preparedFingerprint: undefined,
      preparedManuallyEdited: false, instrumentCompleted: false, instrumentFields: {} }
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} sectionSubjectId="subject" />)
    await waitFor(() => expect(screen.getByPlaceholderText('1. Criterio')).not.toHaveValue(''), { timeout: 5000 })
    const notice = screen.getAllByRole('status').find(element => /alternativo/.test(element.textContent ?? ''))!
    expect(notice).toBeDefined()
    expect(notice).toHaveTextContent(/alternativo/)
    expect(screen.queryByText(/Procedencia:/)).not.toBeInTheDocument()
    expect(notice).not.toHaveTextContent(/catálogo|currículo|plantilla local/i)
    fireEvent.click(within(notice).getByRole('button', { name: /Cerrar/ }))
    expect(screen.queryByText(/El servicio no respondi/)).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('1. Criterio')).not.toHaveValue('')
  }, 10000)
  it('keeps actionable service validation errors visible and allows retry without losing content', async () => {
    const proposal = readyDraft().preparedRecommendation
    const post = vi.spyOn(api, 'post').mockImplementation(async (path) => {
      if (path.endsWith('/recommend')) throw new ApiError(400, 'No se pudo validar la asignatura')
      throw new ApiError(503, 'Interpretación no disponible')
    })
    const draft = { ...readyDraft(), preparedRecommendation: undefined, preparedFingerprint: undefined,
      preparedManuallyEdited: false, instrumentCompleted: false, instrumentFields: {} }
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} sectionSubjectId="subject" />)
    expect(await screen.findByText('No se pudo validar la asignatura', {}, { timeout: 5000 })).toBeVisible()
    expect(screen.queryByText(/alternativo/)).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /Nombre de la actividad/ })).toHaveValue('Informe')
    post.mockImplementation(async (path) => {
      if (path.endsWith('/recommend')) return proposal as never
      throw new Error('Interpretación no disponible')
    })
    fireEvent.click(screen.getByRole('button', { name: 'Generar nuevo instrumento' }))
    await waitFor(() => expect(screen.getByPlaceholderText('1. Criterio')).toHaveValue(proposal.criteria[0].title))
    expect(screen.queryByText('No se pudo validar la asignatura')).not.toBeInTheDocument()
  }, 10000)
  it('adds a criterion to a local editable instrument without claiming a service failure', async () => {
    const post = vi.spyOn(api, 'post').mockRejectedValue(new Error('Unexpected remote request'))
    const draft = readyDraft()
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} sectionSubjectId="subject" />)
    const initialCriteria = screen.getAllByPlaceholderText(/^\d+\. Criterio$/).length
    fireEvent.click(screen.getByRole('button', { name: 'Agregar criterio' }))
    const confirmation = screen.queryByRole('button', { name: 'Redistribuir puntos' })
    if (confirmation) fireEvent.click(confirmation)
    await waitFor(() => expect(screen.getAllByPlaceholderText(/^\d+\. Criterio$/)).toHaveLength(initialCriteria + 1))
    expect(screen.queryByText(/El servicio no respondi/)).not.toBeInTheDocument()
    expect(post.mock.calls.some(([path]) => path.endsWith('/recommend'))).toBe(false)
  })
  it('prepares the visible instrument after selecting a type despite automatic field initialization', async () => {
    const draft = {
      ...newActivityDraft('b1'),
      name: 'Informe',
      description: 'Analizar un texto.',
      maxScore: '20',
      activityType: 'individual' as const,
      evaluationTechnique: 'analisis-producciones',
      pedagogicalActivityType: 'REPORT',
    }
    const proposal = editableFallbackRecommendation({
      activityTitle: draft.name,
      description: draft.description,
      maxScore: 20,
      instrumentType: 'lista-cotejo',
      participationMode: 'INDIVIDUAL',
    })
    vi.spyOn(api, 'post').mockImplementation(async (path) => {
      if (path.endsWith('/recommend')) return proposal as never
      throw new Error('Sin interpretación remota')
    })
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} sectionSubjectId="subject" />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Tipo de instrumento' }), {
      target: { value: 'lista-cotejo' },
    })
    await waitFor(
      () =>
        expect(screen.getByPlaceholderText('1. Criterio')).toHaveValue(proposal.criteria[0].title),
      { timeout: 5000 },
    )
    expect(readActivityDrafts(context)[0].draft.instrumentCompleted).toBe(true)
  }, 10000)
  it('does not replace a manual edit made after the preparation request starts', async () => {
    const draft = {
      ...newActivityDraft('b1'),
      name: 'Informe',
      description: 'Analizar un texto.',
      maxScore: '20',
      activityType: 'individual' as const,
      evaluationTechnique: 'analisis-producciones',
      pedagogicalActivityType: 'REPORT',
    }
    const proposal = editableFallbackRecommendation({
      activityTitle: draft.name,
      description: draft.description,
      maxScore: 20,
      instrumentType: 'lista-cotejo',
      participationMode: 'INDIVIDUAL',
    })
    let finish!: (value: typeof proposal) => void
    const pending = new Promise<typeof proposal>((resolve) => {
      finish = resolve
    })
    const post = vi.spyOn(api, 'post').mockImplementation(async (path) => {
      if (path.endsWith('/recommend')) return (await pending) as never
      throw new Error('Sin interpretación remota')
    })
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} sectionSubjectId="subject" />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Tipo de instrumento' }), {
      target: { value: 'lista-cotejo' },
    })
    await waitFor(
      () => expect(post.mock.calls.some(([path]) => path.endsWith('/recommend'))).toBe(true),
      { timeout: 5000 },
    )
    fireEvent.change(screen.getByPlaceholderText('1. Criterio'), {
      target: { value: 'Mi criterio manual' },
    })
    await act(async () => {
      finish(proposal)
      await pending
    })
    expect(screen.getByPlaceholderText('1. Criterio')).toHaveValue('Mi criterio manual')
    expect(
      readActivityDrafts(context)[0].draft.instrumentFields?.['lista-cotejo:criterion:0'],
    ).toBe('Mi criterio manual')
  }, 10000)
  it('preserves invisible historical fields when updating a graded activity', async () => {
    const input = props()
    const historical = {
      date: '2026-10-14', planningMoment: 'cierre' as const, studentRole: 'Investigar',
      teacherRole: 'Guiar', evidenceInstructions: 'Entregar PDF', observations: 'Registro histórico',
      planningId: 'plan-1', source: 'planning' as const,
    }
    const activity = { ...draftToActivity(readyDraft()), ...historical, id: 'dated', evaluatedCount: 1 }
    render(<ActivityEditorWorkspace {...input} activity={activity} />)
    for (const label of [/Fecha/, /Momento de planificación/, /Rol del estudiante/, /Rol del docente/, /Evidencia esperada/, /Observaciones/]) {
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument()
    }
    fireEvent.change(screen.getByRole('textbox', { name: /Nombre de la actividad/ }), {
      target: { value: 'Informe actualizado' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await screen.findByText('Actividad actualizada')
    expect(input.onUpdateActivity.mock.calls[0][0]).toMatchObject({ ...historical, name: 'Informe actualizado' })
  })
  it('confirms starting from scratch before overwriting manually edited and autosaved fields', async () => {
    const draft = readyDraft()
    render(<ActivityEditorWorkspace {...props()} initialDraft={draft} />)
    fireEvent.change(screen.getByPlaceholderText('1. Criterio'), {
      target: { value: 'Criterio editado' },
    })
    const storedBefore = readActivityDrafts(context)[0].draft.instrumentFields
    fireEvent.click(screen.getByRole('button', { name: 'Crear desde cero' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Reemplazar')
    expect(readActivityDrafts(context)[0].draft.instrumentFields).toEqual(storedBefore)
    fireEvent.click(screen.getByRole('button', { name: 'Conservar cambios' }))
    expect(readActivityDrafts(context)[0].draft.instrumentFields).toEqual(storedBefore)
    fireEvent.click(screen.getByRole('button', { name: 'Crear desde cero' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar instrumento' }))
    await waitFor(() =>
      expect(readActivityDrafts(context)[0].draft).toMatchObject({ manualInstrumentBlank: true }),
    )
    expect(readActivityDrafts(context)[0].draft.instrumentFields).not.toEqual(storedBefore)
  })
  it('keeps a versioned ungraded instrument after reviewing a title correction', async () => {
    const input = props()
    const draft = readyDraft()
    const activity = {
      ...draftToActivity(draft),
      id: 'versioned',
      evaluatedCount: 0,
      instrumentSnapshot: { ...draft.preparedRecommendation, catalogVersion: 'evaluation-2026.7' },
      instrumentSnapshotId: 'snapshot',
      instrumentSnapshotVersion: 2,
    }
    render(<ActivityEditorWorkspace {...input} activity={activity} />)
    fireEvent.change(screen.getByRole('textbox', { name: /Nombre de la actividad/ }), {
      target: { value: 'Informe corregido' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Conservar instrumento actual' }))
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await screen.findByText('Actividad actualizada')
    const saved = input.onUpdateActivity.mock.calls[0][0]
    expect(saved).toMatchObject({
      name: 'Informe corregido',
      instrumentCriteria: activity.instrumentCriteria,
    })
    expect(saved.instrumentSnapshot?.criteria.map((row: { id: string }) => row.id)).toEqual(
      activity.instrumentSnapshot.criteria.map((row) => row.id),
    )
  })
  it('preserves fields and the same creation ID when save fails, then removes only that draft on success', async () => {
    const input = props(),
      draft = readyDraft()
    input.onAddActivity.mockRejectedValueOnce(new Error('Sin conexión'))
    render(<ActivityEditorWorkspace {...input} initialDraft={draft} />)
    fireEvent.change(screen.getByPlaceholderText('1. Criterio'), {
      target: { value: 'Criterio para reintentar' },
    })
    await waitFor(() => expect(readActivityDrafts(context)).toHaveLength(1))
    const beforeSummary = readActivityDrafts(context)[0].draft
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(input.onAddActivity).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Volver a editar' }))
    expect(readActivityDrafts(context)[0].draft).toEqual(beforeSummary)
    expect(screen.getByPlaceholderText('1. Criterio')).toHaveValue('Criterio para reintentar')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await waitFor(() => expect(input.onAddActivity).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveTextContent('Sin conexión'))
    expect(readActivityDrafts(context)[0].draft.creationId).toBe(draft.creationId)
    expect(readActivityDrafts(context)[0].draft.instrumentFields?.['lista-cotejo:criterion:0']).toBe('Criterio para reintentar')
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await screen.findByText('Actividad creada')
    expect(input.onAddActivity.mock.calls[0][0].creationId).toBe(draft.creationId)
    expect(input.onAddActivity.mock.calls[1][0].creationId).toBe(draft.creationId)
    expect(input.onAddActivity.mock.calls[1][0].instrumentCriteria?.['lista-cotejo:criterion:0']).toBe('Criterio para reintentar')
    expect(readActivityDrafts(context)).toHaveLength(0)
  })
  it('reports denied storage and preserves the editable state without claiming autosave', async () => {
    const failing = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota')
    })
    render(<ActivityEditorWorkspace {...props()} />)
    fireEvent.change(screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'), {
      target: { value: 'Conservar' },
    })
    expect(
      screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'),
    ).toHaveValue('Conservar')
    expect(screen.queryByText('Borrador autoguardado')).not.toBeInTheDocument()
    expect(screen.getAllByText(/guardar.*borrador|almacenamiento/i).length).toBeGreaterThan(0)
    failing.mockRestore()
  })
  it('keeps profile contexts independent between simultaneous primary and secondary editors', () => {
    const primary = {
      ...secondaryEvaluationProfile,
      blocks: secondaryEvaluationProfile.blocks.slice(0, 3),
    }
    render(
      <div>
        <div data-testid="primary">
          <ActivityEditorWorkspace {...props()} evaluationProfile={primary} />
        </div>
        <div data-testid="secondary">
          <ActivityEditorWorkspace {...props()} evaluationProfile={secondaryEvaluationProfile} />
        </div>
      </div>,
    )
    expect(
      within(screen.getByTestId('primary')).getAllByRole('checkbox', { name: /Bloque/ }),
    ).toHaveLength(3)
    expect(
      within(screen.getByTestId('secondary')).getAllByRole('checkbox', { name: /Bloque/ }),
    ).toHaveLength(4)
  })
  it('restores scoped IDs and does not expose a legacy label draft', async () => {
    localStorage.setItem(
      'grading-activity-drafts:Curso:P1',
      JSON.stringify({ b1: [{ ...readyDraft(), name: 'Otro usuario' }] }),
    )
    const draft = readyDraft()
    localStorage.setItem(
      activityDraftStorageKey(context),
      JSON.stringify({
        context,
        courseTitle: 'Nombre anterior',
        periodShortName: 'Antiguo',
        drafts: { b1: [draft] },
      }),
    )
    render(<ActivityEditorWorkspace {...props()} initialActivityDraftId={draft.draftId} />)
    await waitFor(() =>
      expect(
        screen.getByPlaceholderText('Ej: Exposición oral sobre el cambio climático'),
      ).toHaveValue('Informe'),
    )
    expect(screen.queryByDisplayValue('Otro usuario')).not.toBeInTheDocument()
  })
  it('allows metadata edits with grades and retains the original structural definition', () => {
    const activity = {
      ...draftToActivity(readyDraft()),
      id: 'original',
      evaluatedCount: 2,
      evidenceInstructions: 'Entregar PDF',
      planningId: 'plan',
      source: 'planning' as const,
    }
    const draft = activityToDraft(activity)
    expect(draft.preparedFingerprint).toBe(preparationFingerprint(draft))
    const saved = draftToActivity({ ...draft, name: 'Nuevo título', maxScore: '99' }, activity)
    expect(saved).toMatchObject({
      name: 'Nuevo título',
      maxScore: 20,
      evidenceInstructions: 'Entregar PDF',
      planningId: 'plan',
      source: 'planning',
    })
    render(<ActivityEditorWorkspace {...props()} activity={activity} />)
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: /Nombre de la actividad/ })).not.toBeDisabled()
  })

  it('duplicates a graded activity into a fresh editable draft and creates rather than updates', async () => {
    const input = props()
    const activity = { ...draftToActivity(readyDraft()), id: 'graded', evaluatedCount: 2 }
    render(<ActivityEditorWorkspace {...input} activity={activity} />)
    fireEvent.click(
      screen.getByRole('button', { name: 'Duplicar actividad para editar su estructura' }),
    )
    expect(screen.getByRole('textbox', { name: /Nombre de la actividad/ })).toHaveValue(
      'Informe copia',
    )
    expect(screen.getByRole('textbox', { name: /Valor en puntos/ })).not.toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar y guardar' }))
    await screen.findByText('Actividad creada')
    expect(input.onUpdateActivity).not.toHaveBeenCalled()
    expect(input.onAddActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Informe copia',
        creationId: expect.any(String),
        instrumentCriteria: activity.instrumentCriteria,
      }),
    )
    expect(input.onAddActivity.mock.calls[0][0]).not.toHaveProperty('id')
  })
})
