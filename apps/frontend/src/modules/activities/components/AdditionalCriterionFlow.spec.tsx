import {render,screen,fireEvent,waitFor,act,within} from '@testing-library/react'
import {it,expect,vi,beforeEach} from 'vitest'
import type {ComponentProps} from 'react'
import {ActivityEditorWorkspace} from './ActivityEditorWorkspace'
import {newActivityDraft,type ActivityDraft} from './editor/editorModel'
import {editableFallbackRecommendation,recommendationToFields,preparationFingerprint} from '../services/instrumentPreparation'
import {appendInstrumentCriterion} from '../services/instrumentCriterionAddition'
import {api,ApiError} from '@/services/apiClient'
import {readActivityDrafts} from '../utils/activityDraftStorage'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor',()=>({ActivityDescriptionEditor:({value,onChange}:{value:string;onChange:(v:string)=>void})=><textarea aria-label="Descripción de la actividad" value={value} onChange={e=>onChange(e.target.value)}/>}))
const context={schoolId:'school',userId:'teacher',schoolYearId:'year',sectionSubjectId:'subject',academicPeriodId:'period'}
const academic={level:'SECONDARY' as const,grade:1,subjectCode:'ING',subjectName:'Lenguas extranjeras: Inglés'}
const description='Los estudiantes prepararán una breve presentación oral en inglés sobre cinco actividades de su rutina diaria. Utilizarán el presente simple y expresiones de tiempo como in the morning, in the afternoon y at night. Al finalizar, responderán una pregunta sencilla de un compañero sobre su rutina.'
beforeEach(()=>{localStorage.clear();vi.restoreAllMocks()})
function setup({blank=false,remote=false,manualPoints=false,type='rubrica' as 'rubrica'|'lista-cotejo'|'escala'|'lista-ponderada'}={}) {
 const pool=editableFallbackRecommendation({activityTitle:'Rutina',description,academicContext:academic,instrumentType:type,participationMode:'INDIVIDUAL',maxScore:20,includeAdditionalCandidates:true})
 const old={...pool,catalogVersion:remote?'evaluation-2026.45':'editable-fallback-v1',criteria:pool.criteria.slice(0,3)}
 let fields=recommendationToFields(old,'Rutina'),proposal=old
 if(blank){const appended=appendInstrumentCriterion(fields,type,20,old,null);fields=appended.fields;proposal=appended.recommendation!}
 if(manualPoints)fields[`${type}:meta:manualPoints`]='true'
 const draft={...newActivityDraft('b1'),name:'Rutina',description,maxScore:'20',activityType:'individual' as const,pedagogicalActivityType:'ORAL_PRESENTATION',evaluationTechnique:'presentacion',instrumentType:type,instrumentFields:fields,preparedRecommendation:proposal,preparedManuallyEdited:true}
 const initial={...draft,preparedFingerprint:preparationFingerprint(draft)}
 const props:ComponentProps<typeof ActivityEditorWorkspace>={activityDraftContext:context,courseTitle:'Curso',periodShortName:'P1',saving:false,onAddActivity:vi.fn(async i=>({...i,id:'saved'})),onUpdateActivity:vi.fn(async i=>i)}
 const view=render(<ActivityEditorWorkspace {...props} initialDraft={initial} sectionSubjectId="subject" instrumentAcademicContext={academic}/> )
 return {pool,initial,props,view,getDraft:()=>readActivityDrafts(context)[0]?.draft as ActivityDraft|undefined}
}
for(const type of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`completa una fila recuperada y comunica el resultado en ${type}`,async()=>{
 vi.spyOn(api,'post').mockRejectedValue(new Error('offline'))
 const {initial,getDraft}=setup({blank:true,type})
 fireEvent.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[3])
 fireEvent.click(screen.getByRole('menuitem',{name:'Completar criterio'}))
 await screen.findByText('Criterio completado. Se conservaron tus textos y puntos.')
 await waitFor(()=>expect(getDraft()?.instrumentFields?.[`${type}:criterion-template:3`]).toBe('ing-1-temporal-expressions'))
 expect(getDraft()?.instrumentFields?.[`${type}:criterion:3`]).not.toBe('')
 const fields=getDraft()!.instrumentFields!
 expect(fields[`${type}:criterion-id:3`]).toBe(initial.instrumentFields[`${type}:criterion-id:3`])
 for(let i=0;i<4;i++)expect(fields[`${type}:points:${i}`]).toBe(initial.instrumentFields[`${type}:points:${i}`])
})
for(const interruption of ['edit','delete'] as const)it(`descarta completar tardío tras ${interruption}`,async()=>{
 let finish!:(value:unknown)=>void
 const pending=new Promise(resolve=>{finish=resolve})
 vi.spyOn(api,'post').mockImplementation(async path=>path.endsWith('/recommend')?await pending as never:{curriculumCandidates:[]} as never)
 const {pool,getDraft}=setup({blank:true,remote:true})
 fireEvent.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[3])
 fireEvent.click(screen.getByRole('menuitem',{name:'Completar criterio'}))
 if(interruption==='edit')fireEvent.change(screen.getByLabelText('Criterio 4'),{target:{value:'Intención manual durante la petición'}})
 else {
  // The completing row shows a spinner; delete another row to shift its position.
  fireEvent.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[0])
  fireEvent.click(screen.getByRole('menuitem',{name:'Eliminar'}))
  fireEvent.click(screen.getByRole('button',{name:'Eliminar criterio'}))
 }
 await act(async()=>{finish(pool);await pending})
 expect(screen.queryByText('Criterio completado. Se conservaron tus textos y puntos.')).not.toBeInTheDocument()
 await waitFor(()=>expect(getDraft()?.instrumentFields?.['rubrica:meta:criteriaCount']).toBe(interruption==='delete'?'3':'4'))
 if(interruption==='edit')expect(getDraft()?.instrumentFields?.['rubrica:criterion:3']).toBe('Intención manual durante la petición')
})
it('expone403 y conserva la fila sin recurrir a una alternativa',async()=>{
 const post=vi.spyOn(api,'post').mockRejectedValue(new ApiError(403,'Sin permiso para obtener candidatos'))
 const {initial}=setup({blank:true,remote:true})
 fireEvent.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[3])
 fireEvent.click(screen.getByRole('menuitem',{name:'Completar criterio'}))
 await screen.findByText('Sin permiso para obtener candidatos')
 expect(screen.getByLabelText('Criterio 4')).toHaveValue('')
 expect(screen.getByLabelText('Criterio 1')).toHaveValue(initial.instrumentFields['rubrica:criterion:0'])
 expect(screen.getByLabelText('Puntos del criterio 4')).toHaveValue(Number(initial.instrumentFields['rubrica:points:3']))
 expect(post.mock.calls.filter(([path])=>path.endsWith('/recommend'))).toHaveLength(1)
})
it('informa fila completa sin consultar candidatos ni modificar el borrador',async()=>{
 const post=vi.spyOn(api,'post').mockRejectedValue(new Error('Unexpected'))
 setup()
 fireEvent.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[0])
 fireEvent.click(screen.getByRole('menuitem',{name:'Completar criterio'}))
 expect(screen.getByText(/Este criterio está completo/)).toBeVisible()
 expect(post.mock.calls.some(([path])=>path.endsWith('/recommend'))).toBe(false)
})
it('registra el catálogo que aporta el candidato al completar un borrador antiguo',async()=>{
 const {pool,getDraft}=setup({blank:true,remote:true})
 vi.spyOn(api,'post').mockResolvedValue({...pool,catalogVersion:'evaluation-2026.46'} as never)
 fireEvent.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[3])
 fireEvent.click(screen.getByRole('menuitem',{name:'Completar criterio'}))
 await screen.findByText('Criterio completado. Se conservaron tus textos y puntos.')
 await waitFor(()=>expect(getDraft()?.preparedRecommendation?.catalogVersion).toBe('evaluation-2026.46'))
 expect(getDraft()?.instrumentFields?.['rubrica:meta:catalogVersion']).toBe('evaluation-2026.46')
})
it('usa la misma propuesta local ante503 y comunica su procedencia',async()=>{
 vi.spyOn(api,'post').mockRejectedValue(new ApiError(503,'Servicio no disponible'))
 const {getDraft}=setup({blank:true,remote:true})
 fireEvent.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[3])
 fireEvent.click(screen.getByRole('menuitem',{name:'Completar criterio'}))
 await screen.findByText(/Criterio completado con la alternativa local/)
 await waitFor(()=>expect(getDraft()?.instrumentFields?.['rubrica:criterion-template:3']).toBe('ing-1-temporal-expressions'))
 expect(getDraft()?.preparedRecommendation?.catalogVersion).toBe('editable-fallback-v1')
})
it('descarta completar tardío cuando cambia el contexto académico sin editar campos',async()=>{
 let finish!:(value:unknown)=>void
 const pending=new Promise(resolve=>{finish=resolve})
 vi.spyOn(api,'post').mockImplementation(async path=>path.endsWith('/recommend')?await pending as never:{curriculumCandidates:[]} as never)
 const {pool,initial,props,view}=setup({blank:true,remote:true})
 fireEvent.click(screen.getAllByRole('button',{name:'Acciones de la fila'})[3])
 fireEvent.click(screen.getByRole('menuitem',{name:'Completar criterio'}))
 view.rerender(<ActivityEditorWorkspace {...props} initialDraft={initial} sectionSubjectId="subject" instrumentAcademicContext={{...academic,grade:2}}/>)
 await act(async()=>{finish(pool);await pending})
 expect(screen.getByLabelText('Criterio 4')).toHaveValue('')
 expect(screen.queryByText('Criterio completado. Se conservaron tus textos y puntos.')).not.toBeInTheDocument()
})
it('exige confirmar antes de redistribuir puntos manuales al añadir',async()=>{
 vi.spyOn(api,'post').mockRejectedValue(new Error('offline'))
 const {getDraft}=setup({manualPoints:true})
 fireEvent.click(screen.getByRole('button',{name:'Agregar criterio'}))
 const cancel=await screen.findByRole('button',{name:'Conservar cambios'})
 fireEvent.click(cancel)
 expect(screen.getAllByRole('button',{name:'Acciones de la fila'})).toHaveLength(3)
 fireEvent.click(screen.getByRole('button',{name:'Agregar criterio'}))
 fireEvent.click(await screen.findByRole('button',{name:'Redistribuir y añadir'}))
 await waitFor(()=>expect(getDraft()?.instrumentFields?.['rubrica:meta:criteriaCount']).toBe('4'))
 const fields=getDraft()!.instrumentFields!
 expect(Array.from({length:4},(_,i)=>Math.round(Number(fields[`rubrica:points:${i}`])*100)).reduce((a,b)=>a+b,0)).toBe(2000)
})
it('mantiene el agotamiento junto al control manual sin caducar',async()=>{
 vi.spyOn(api,'post').mockRejectedValue(new Error('offline'))
 const {pool,initial,props,view}=setup()
 const fields=recommendationToFields(pool,'Rutina')
 const draft={...initial,instrumentFields:fields,preparedRecommendation:pool}
 view.rerender(<ActivityEditorWorkspace {...props} initialDraft={draft} sectionSubjectId="subject" instrumentAcademicContext={academic}/>)
 // Remount with the complete pool: no unselected objective remains.
 view.unmount();localStorage.clear()
 render(<ActivityEditorWorkspace {...props} initialDraft={draft} sectionSubjectId="subject" instrumentAcademicContext={academic}/>)
 fireEvent.click(screen.getByRole('button',{name:'Agregar criterio'}))
 const notice=await screen.findByText(/No hay otro criterio automático pertinente/)
 const region=screen.getByRole('region',{name:'Instrumento y estado de criterios'})
 expect(region).toContainElement(notice)
 expect(within(region).getByRole('button',{name:'Añadir criterio manual'})).toBeVisible()
 vi.useFakeTimers()
 await act(async()=>{vi.advanceTimersByTime(9000)})
 expect(notice).toBeVisible()
 vi.useRealTimers()
})
it('bloquea duplicados durante Agregar y permite reintentar tras un error',async()=>{
 let finish!:(value:unknown)=>void
 const pending=new Promise(resolve=>{finish=resolve})
 const post=vi.spyOn(api,'post').mockImplementation(async path=>path.endsWith('/recommend')?await pending as never:{curriculumCandidates:[]} as never)
 const {pool,initial}=setup({remote:true})
 const button=screen.getByRole('button',{name:'Agregar criterio'})
 fireEvent.click(button)
 expect(await screen.findByRole('button',{name:'Añadiendo…'})).toBeDisabled()
 fireEvent.click(button)
 expect(post.mock.calls.filter(([path])=>path.endsWith('/recommend'))).toHaveLength(1)
 await act(async()=>{finish({...pool,catalogVersion:'evaluation-2026.67'});await pending})
 expect(screen.getAllByRole('button',{name:'Acciones de la fila'})).toHaveLength(4)
 expect(screen.getByLabelText('Criterio 1')).toHaveValue(initial.instrumentFields['rubrica:criterion:0'])
 post.mockRejectedValue(new ApiError(400,'Revisa la consigna antes de reintentar'))
 fireEvent.click(screen.getByRole('button',{name:'Agregar criterio'}))
 const error=await screen.findByText('Revisa la consigna antes de reintentar')
 expect(screen.getByRole('region',{name:'Instrumento y estado de criterios'})).toContainElement(error)
 expect(screen.getByRole('button',{name:'Agregar criterio'})).toBeEnabled()
 expect(screen.getAllByRole('button',{name:'Acciones de la fila'})).toHaveLength(4)
})
