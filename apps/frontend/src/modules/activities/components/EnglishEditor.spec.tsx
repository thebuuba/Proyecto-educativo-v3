import {fireEvent,render,screen,waitFor} from '@testing-library/react'
import {beforeEach,describe,expect,it,vi} from 'vitest'
import {ActivityEditorWorkspace} from './ActivityEditorWorkspace'
import {newActivityDraft} from './editor/editorModel'
import {api} from '@/services/apiClient'
import {recommend} from '../../../../../backend/src/modules/evaluation-instruments/recommendation-engine'
import {resolveFirstGradeEnglishTask,firstGradeEnglishSelections} from '@aula/shared'

vi.mock('@/modules/grading/components/ActivityDescriptionEditor',()=>({ActivityDescriptionEditor:({value,onChange}:{value:string;onChange:(value:string)=>void})=><textarea aria-label="Descripción de la actividad" value={value} onChange={e=>onChange(e.target.value)}/>}))
const context={level:'SECONDARY' as const,grade:1,cycle:1,subjectCode:'ING',subjectName:'Inglés',optativeExitName:null,modalityCode:'academic'}
const base='Conversarán en inglés solicitando y ofreciendo información personal: nombre y edad. '
const purposes=[['Se valorará la calidad en varias dimensiones.','rubrica'],['Se comprobará la presencia de cada evidencia con sí o no.','lista-cotejo'],['Se registrará la regularidad de cada indicador.','escala'],['Se distribuirán pesos entre los componentes verificables.','lista-ponderada']] as const
describe('Selector inglés: automático, manual y alternativa',()=>{
 beforeEach(()=>{localStorage.clear();vi.restoreAllMocks()})
 for(const offline of [false,true])for(const [purpose,format] of purposes)it(`${format}, ${offline?'alternativa':'servicio'}`,async()=>{
  vi.spyOn(api,'post').mockImplementation(async(path,input)=>{
   if(offline)throw new Error('Servicio no disponible')
   const p=input as Parameters<typeof recommend>[0]
   if(path.endsWith('/interpret')){const task=resolveFirstGradeEnglishTask(p.activityTitle,p.description??'',context)!;return {activityType:task.activityType,suggestedActivityType:task.activityType,...firstGradeEnglishSelections(task,p.description??'')}}
   return recommend(p,context,null,[],'UNMAPPED',null)
  })
  render(<ActivityEditorWorkspace initialDraft={{...newActivityDraft('b1'),name:'Actividad',activityType:'individual',instrumentType:'rubrica',autoSelectedInstrumentType:true}} sectionSubjectId="subject" instrumentAcademicContext={context} courseTitle="Inglés 1.º" periodShortName="P1" saving={false} onAddActivity={async a=>({...a,id:'saved'})} onUpdateActivity={async a=>a}/> )
  fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:base+purpose}})
  await waitFor(()=>expect(screen.getByRole('combobox',{name:'Tipo de instrumento'})).toHaveValue(format),{timeout:5000})
  await waitFor(()=>expect(screen.getByRole('button',{name:'Generar nuevo instrumento'})).toBeEnabled(),{timeout:5000})
  expect(screen.getByRole('combobox',{name:'Tipo de actividad'})).toHaveValue('ORAL_INTERACTION')
  expect(screen.getByRole('textbox',{name:/Valor en puntos/})).toHaveValue('')
  fireEvent.change(screen.getByRole('combobox',{name:'Tipo de instrumento'}),{target:{value:'rubrica'}})
  await waitFor(()=>expect(screen.getByLabelText('Criterio 1')).toHaveValue('Información personal solicitada'),{timeout:5000})
  fireEvent.change(screen.getByLabelText('Descripción de la actividad'),{target:{value:base+purposes[1][0]}})
  await waitFor(()=>expect(screen.getByRole('button',{name:'Generar nuevo instrumento'})).toBeEnabled(),{timeout:5000})
  expect(screen.getByRole('combobox',{name:'Tipo de instrumento'})).toHaveValue('rubrica')
 },10000)
})
