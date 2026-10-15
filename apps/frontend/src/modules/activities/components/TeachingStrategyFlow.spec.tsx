import {render,screen,fireEvent,waitFor,within} from '@testing-library/react'
import {beforeEach,it,expect,vi} from 'vitest'
import {ActivityEditorWorkspace} from './ActivityEditorWorkspace'
import {activityToDraft,newActivityDraft,normalizeStoredActivityDrafts,type ActivityDraft} from './editor/editorModel'
import {editableFallbackRecommendation,recommendationToFields,preparationFingerprint} from '../services/instrumentPreparation'
import {readActivityDrafts} from '../utils/activityDraftStorage'
import {saveActivity} from '../services/activitiesService'
import {api} from '@/services/apiClient'
import type {InstrumentType} from '@aula/shared'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor',()=>({ActivityDescriptionEditor:({value,onChange}:{value:string;onChange:(v:string)=>void})=><textarea aria-label="Descripción de la actividad" value={value} onChange={e=>onChange(e.target.value)}/>}))
const context={schoolId:'school',userId:'teacher',schoolYearId:'year',sectionSubjectId:'subject',academicPeriodId:'period'}
const academic={level:'SECONDARY' as const,grade:1,subjectCode:'LEN',subjectName:'Lengua Española'}
const description='Analizan un caso real con datos concretos y justifican una decisión.'
beforeEach(()=>{localStorage.clear();vi.restoreAllMocks()})
function setup(type:InstrumentType='rubrica',historical=false) {
 const proposal=editableFallbackRecommendation({activityTitle:'Actividad',description,academicContext:academic,instrumentType:type,maxScore:20,participationMode:'INDIVIDUAL'})
 const draft:ActivityDraft={...newActivityDraft('b1'),name:'Actividad',description,maxScore:'20',activityType:'individual',instrumentType:type,instrumentFields:recommendationToFields(proposal,'Actividad'),preparedRecommendation:proposal,preparedManuallyEdited:true,evaluationTechnique:'analisis-contenido',...(historical?{teachingStrategyId:null,teachingStrategyOrigin:'UNKNOWN' as const}:{})}
 draft.preparedFingerprint=preparationFingerprint(draft)
 render(<ActivityEditorWorkspace activityDraftContext={context} courseTitle="Curso" periodShortName="P1" saving={false} onAddActivity={vi.fn(async i=>({...i,id:'saved'}))} onUpdateActivity={vi.fn(async i=>i)} initialDraft={draft} instrumentAcademicContext={academic}/>)
 return {draft,getDraft:()=>readActivityDrafts(context)[0]?.draft as ActivityDraft|undefined}
}
function choose(label:string){fireEvent.click(screen.getByRole('combobox',{name:'Estrategia de enseñanza y aprendizaje'}));fireEvent.click(within(screen.getByRole('listbox',{name:'Estrategia de enseñanza y aprendizaje'})).getByRole('option',{name:label}))}
it.each(['rubrica','lista-cotejo','escala','lista-ponderada'] as const)('auto, manual y retorno conservan instrumento exacto: %s',async type=>{
 const {draft,getDraft}=setup(type)
 await waitFor(()=>expect(screen.getByRole('combobox',{name:'Estrategia de enseñanza y aprendizaje'})).toHaveTextContent('Estudio de caso'))
 choose('Debate')
 await waitFor(()=>expect(getDraft()?.teachingStrategyOrigin).toBe('MANUAL'))
 expect(getDraft()?.instrumentFields).toEqual(draft.instrumentFields)
 expect(getDraft()?.preparedRecommendation).toEqual(draft.preparedRecommendation)
 fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:'Dialogan mediante preguntas abiertas guiadas por el docente.'}})
 expect(screen.getByRole('combobox',{name:'Estrategia de enseñanza y aprendizaje'})).toHaveTextContent('Debate')
 choose('Seleccionar automáticamente')
 await waitFor(()=>expect(screen.getByRole('combobox',{name:'Estrategia de enseñanza y aprendizaje'})).toHaveTextContent('Indagación dialógica'))
 expect(getDraft()?.teachingStrategyOrigin).toBe('AUTO')
 expect(getDraft()?.instrumentFields).toEqual(draft.instrumentFields)
})
it('histórico permanece ausente hasta acción explícita; búsqueda y teclado',async()=>{
 setup('rubrica',true)
 const selector=screen.getByRole('combobox',{name:'Estrategia de enseñanza y aprendizaje'})
 expect(selector).toHaveTextContent('Sin estrategia')
 fireEvent.click(selector)
 const search=screen.getByRole('searchbox',{name:'Buscar estrategia'})
 fireEvent.change(search,{target:{value:'socrático'}})
 expect(screen.getByRole('option',{name:'Indagación dialógica o cuestionamiento'})).toBeVisible()
 fireEvent.keyDown(search,{key:'ArrowDown'})
 fireEvent.keyDown(search,{key:'Enter'})
 expect(selector).toHaveTextContent('Indagación dialógica')
})
it('recuperación y duplicación conservan selección y origen; viejos no se infieren',()=>{
 const restored=normalizeStoredActivityDrafts({b1:[{...newActivityDraft('b1'),teachingStrategyId:'DEBATE',teachingStrategyOrigin:'MANUAL'}]})
 expect(restored.b1?.[0]).toMatchObject({teachingStrategyId:'DEBATE',teachingStrategyOrigin:'MANUAL'})
 const old={...newActivityDraft('b1'),name:'Borrador antiguo'} as Partial<ActivityDraft>
 delete old.teachingStrategyOrigin;delete old.teachingStrategyId
 expect(normalizeStoredActivityDrafts({b1:[old]}).b1?.[0].teachingStrategyOrigin).toBe('UNKNOWN')
 const activity={id:'old',name:'Vieja',maxScore:20,competencyBlockId:'b1',teachingStrategyId:'DEBATE',teachingStrategyOrigin:'MANUAL' as const}
 expect(activityToDraft(activity,true)).toMatchObject({teachingStrategyId:'DEBATE',teachingStrategyOrigin:'MANUAL'})
 expect(activityToDraft({...activity,teachingStrategyId:undefined,teachingStrategyOrigin:undefined})).toMatchObject({teachingStrategyId:null,teachingStrategyOrigin:'UNKNOWN'})
})
it('contrato HTTP incluye la estrategia separada del instrumento',async()=>{
 const post=vi.spyOn(api,'post').mockResolvedValue({} as never)
 await saveActivity({sectionSubjectId:'subject',academicPeriodId:'period',competencyBlockId:'b1',name:'Caso',maxScore:20,teachingStrategyId:'CASE_STUDY',teachingStrategyOrigin:'MANUAL'})
 expect(post).toHaveBeenCalledWith('/activities',expect.objectContaining({teachingStrategyId:'CASE_STUDY',teachingStrategyOrigin:'MANUAL'}))
})
