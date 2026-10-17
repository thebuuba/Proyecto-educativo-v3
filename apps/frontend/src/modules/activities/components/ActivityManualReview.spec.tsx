import {act,fireEvent,render,screen,waitFor,within} from '@testing-library/react'
import {beforeEach,expect,it,vi} from 'vitest'
import {ActivityEditorWorkspace} from './ActivityEditorWorkspace'
import {newActivityDraft,type ActivityDraft} from './editor/editorModel'
import {editableFallbackRecommendation,recommendationToFields,preparationFingerprint} from '../services/instrumentPreparation'
import {api} from '@/services/apiClient'
import {readActivityDrafts} from '../utils/activityDraftStorage'
import type {Activity} from '../types'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor',()=>({ActivityDescriptionEditor:({value,onChange}:{value:string;onChange:(v:string)=>void})=><textarea aria-label="Descripción de la actividad" value={value} onChange={e=>onChange(e.target.value)}/>}))
const context={schoolId:'school',userId:'teacher',schoolYearId:'year',sectionSubjectId:'subject',academicPeriodId:'period'}
const academic={level:'SECONDARY' as const,grade:4,subjectCode:'NAT-BIO'}
const first='Identifica estructuras de célula animal y vegetal en los modelos proporcionados.'
const latest=first+' Compara sus funciones.'
beforeEach(()=>{localStorage.clear();vi.restoreAllMocks()})
for(const type of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)it(`revisa explícitamente el borrador ${type} ampliado sin perder las filas manuales`,async()=>{
 const build=(description:string)=>({...editableFallbackRecommendation({activityTitle:'Células',description,academicContext:academic,instrumentType:type,participationMode:'INDIVIDUAL',maxScore:20}),catalogVersion:'evaluation-2026.90'})
 const proposal=build(first),fields=recommendationToFields(proposal,'Células')
 fields[`${type}:criterion:0`]+=' · edición docente';fields[`${type}:meta:manualPoints`]='true'
 const draft={...newActivityDraft('b1'),name:'Células',description:first,maxScore:'20',activityType:'individual' as const,pedagogicalActivityType:'ANALYSIS',autoDetectedPedagogicalActivityType:true,evaluationTechnique:'analisis-producciones',instrumentType:type,autoSelectedInstrumentType:false,instrumentFields:fields,preparedRecommendation:proposal,preparedManuallyEdited:true,instrumentCompleted:true}
 const onAdd=vi.fn(async (input:Omit<Activity,'id'>&{creationId?:string})=>({...input,id:'saved'}))
 vi.spyOn(api,'post').mockImplementation(async(_path,body)=>build((body as {description:string}).description) as never)
 render(<ActivityEditorWorkspace initialDraft={{...draft,preparedFingerprint:preparationFingerprint(draft)}} activityDraftContext={context} sectionSubjectId="subject" instrumentAcademicContext={academic} courseTitle="Cuarto" periodShortName="P1" saving={false} onAddActivity={onAdd} onUpdateActivity={async input=>input}/> )
 fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:latest}})
 await waitFor(()=>expect(screen.getByRole('button',{name:'Tipo de actividad'})).toHaveTextContent('Comparación'))
 expect(screen.getByRole('button',{name:'Guardar'})).toBeDisabled()
 fireEvent.click(screen.getByRole('button',{name:type==='escala'?'Agregar indicador':'Agregar criterio'}))
 fireEvent.click(await screen.findByRole('button',{name:'Redistribuir y añadir'}))
 await waitFor(()=>expect(readActivityDrafts(context)[0]?.draft.instrumentFields?.[`${type}:meta:criteriaCount`]).toBe('2'))
 const before=readActivityDrafts(context)[0].draft as ActivityDraft
 expect(before.instrumentFields[`${type}:criterion:0`]).toBe(fields[`${type}:criterion:0`])
 expect(screen.getByRole('button',{name:'Guardar'})).toBeDisabled()
 fireEvent.click(screen.getByRole('button',{name:'Conservar instrumento actual'}))
 const reviewed=readActivityDrafts(context)[0].draft as ActivityDraft
 expect(reviewed.instrumentFields).toEqual(before.instrumentFields)
 expect(reviewed.preparedRecommendation).toEqual(before.preparedRecommendation)
 expect(reviewed.preparedFingerprint).toBe(preparationFingerprint(reviewed))
 expect(screen.getByRole('button',{name:'Guardar'})).toBeEnabled()
 fireEvent.click(screen.getByRole('button',{name:'Guardar'}))
 const summary=screen.getByRole('dialog',{name:'Resumen de la actividad'})
 await act(async()=>{fireEvent.click(within(summary).getByRole('button',{name:'Confirmar y guardar'}))})
 expect(onAdd).toHaveBeenCalledOnce()
 expect(onAdd.mock.calls[0][0].description).toBe(latest)
 expect(onAdd.mock.calls[0][0].instrumentCriteria).toEqual(before.instrumentFields)
})
for(const change of ['participation','format','curriculum','invalid-fingerprint'] as const)it(`no permite conservar con incompatibilidad ${change}`,()=>{
 const proposal=editableFallbackRecommendation({activityTitle:'Células',description:first,academicContext:academic,instrumentType:'lista-cotejo',participationMode:'INDIVIDUAL',maxScore:20})
 const draft={...newActivityDraft('b1'),name:'Células',description:first,maxScore:'20',activityType:'individual' as const,pedagogicalActivityType:'ANALYSIS',autoDetectedPedagogicalActivityType:false,evaluationTechnique:'analisis-producciones',instrumentType:'lista-cotejo',autoSelectedInstrumentType:false,instrumentFields:recommendationToFields(proposal,'Células'),preparedRecommendation:proposal,preparedManuallyEdited:true,instrumentCompleted:true}
 const stale:ActivityDraft={...draft,description:latest,preparedFingerprint:preparationFingerprint(draft)}
 if(change==='participation')stale.activityType='group'
 if(change==='format')stale.instrumentType='rubrica'
 if(change==='curriculum')stale.selectedCurriculumElementIds=['another-reference']
 if(change==='invalid-fingerprint')stale.preparedFingerprint='not JSON'
 vi.spyOn(api,'post').mockImplementation(()=>new Promise(()=>{}))
 render(<ActivityEditorWorkspace initialDraft={stale} activityDraftContext={context} sectionSubjectId="subject" instrumentAcademicContext={academic} courseTitle="Cuarto" periodShortName="P1" saving={false} onAddActivity={async input=>({...input,id:'saved'})} onUpdateActivity={async input=>input}/> )
 expect(screen.queryByRole('button',{name:'Conservar instrumento actual'})).not.toBeInTheDocument()
 expect(screen.getByRole('button',{name:'Guardar'})).toBeDisabled()
})
