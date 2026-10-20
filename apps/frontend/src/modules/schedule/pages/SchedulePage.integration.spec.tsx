import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ScheduleEntry, TimeSlot } from '../types'

const mocks = vi.hoisted(() => ({canEdit:true, small:false, slots:[] as TimeSlot[],entries:[] as ScheduleEntry[],pending:[] as ScheduleEntry[],get:vi.fn(),create:vi.fn(),update:vi.fn(),remove:vi.fn(),save:vi.fn()}))
vi.mock('@/modules/auth/hooks/useAuth',()=>({useAuth:()=>({appUser:{id:'teacher',schoolId:'school'},hasRole:()=>mocks.canEdit})}))
vi.mock('../polymet/lib/live-schedule-source',()=>({createLiveScheduleSource:()=>({getWorkspace:mocks.get,getAssignableClasses:async()=>[{sectionSubjectId:'subject',sectionId:'section',subjectName:'Matemática',gradeName:'Primero',sectionName:'A',academicLevelName:'Secundaria'}],createEntry:mocks.create,updateEntry:mocks.update,deleteEntry:mocks.remove,saveStructure:mocks.save,deleteStructure:vi.fn()})}))
import { SchedulePage } from './SchedulePage'
const slot=(id:string,day:number):TimeSlot=>({id,name:'Período 1',startTime:'08:00',endTime:'08:45',sequence:1,status:'active',dayOfWeek:day,blockType:'CLASS',journeyId:'journey'})
const entry=():ScheduleEntry=>({id:'entry',schoolYearId:'year',academicPeriodId:null,sectionSubjectId:'subject',sectionId:'section',timeSlotId:'mon',dayOfWeek:1,room:'101',status:'active',subjectName:'Matemática',gradeName:'Primero',sectionName:'A',academicLevelName:'Secundaria',teacherName:'Docente',timeSlotName:'Período 1',startTime:'08:00',endTime:'08:45'})
beforeEach(()=>{
  vi.clearAllMocks();mocks.canEdit=true;mocks.small=false;mocks.slots=[slot('mon',1),slot('tue',2)];mocks.entries=[];mocks.pending=[]
  mocks.get.mockImplementation(async()=>({currentSchoolYear:{id:'year',name:'2026',isCurrent:true},journeys:[{id:'journey',name:'Matutina',kind:'MORNING',status:'active',sequence:1,startTime:'08:00',endTime:'12:00'}],timeSlots:mocks.slots,entries:[...mocks.entries,...mocks.pending],sections:[],teachers:[],subjects:[],integrityIssues:[]}))
  mocks.create.mockResolvedValue(entry());mocks.update.mockResolvedValue(entry());mocks.remove.mockResolvedValue(undefined)
  vi.stubGlobal('matchMedia',vi.fn((query:string)=>({matches:query.includes('min-width')&&!mocks.small,addEventListener:vi.fn(),removeEventListener:vi.fn()})))
  vi.stubGlobal('CSS',{escape:(value:string)=>value});HTMLElement.prototype.scrollIntoView=vi.fn()
})
afterEach(()=>{cleanup();vi.unstubAllGlobals()})
const openMonday = async(user:ReturnType<typeof userEvent.setup>)=>user.click(within(await screen.findByRole('group',{name:'Lunes'})).getByRole('button'))
describe('Horario original de Polymet conectado',()=>{
  it('conserva la cabecera original con iconos y selector de vista accesible',async()=>{
    render(<SchedulePage/>);expect(await screen.findByRole('heading',{name:'Horario docente'})).toBeInTheDocument();expect(screen.getByRole('radio',{name:'Semana'})).toHaveAttribute('aria-checked','true');expect(screen.getByRole('button',{name:'Exportar horario como PDF o imagen'})).toBeInTheDocument()
  })
  it('asigna aula y repite únicamente en períodos libres de la misma hora',async()=>{
    const user=userEvent.setup();render(<SchedulePage/>);await openMonday(user);await user.click(await screen.findByRole('radio',{name:/Primero A/}));await user.type(screen.getByLabelText(/Aula o espacio/),'204');await user.click(screen.getByRole('button',{name:'Mar'}));await user.click(screen.getByRole('button',{name:/Asignar.*días/}));await waitFor(()=>expect(mocks.create).toHaveBeenCalledTimes(2));expect(mocks.create).toHaveBeenNthCalledWith(1,expect.objectContaining({timeSlotId:'mon',dayOfWeek:1,room:'204'}));expect(mocks.create).toHaveBeenNthCalledWith(2,expect.objectContaining({timeSlotId:'tue',dayOfWeek:2,room:'204'}))
  })
  it('mantiene el formulario y el aula si el servidor rechaza el guardado',async()=>{
    mocks.create.mockRejectedValue(new TypeError('Failed to fetch'));const user=userEvent.setup();render(<SchedulePage/>);await openMonday(user);await user.click(await screen.findByRole('radio',{name:/Primero A/}));await user.type(screen.getByLabelText(/Aula o espacio/),'204');await user.click(screen.getByRole('button',{name:/Asignar el lunes/}));expect(await screen.findByRole('alert')).toHaveTextContent(/conectar con el servidor/);expect(screen.getByLabelText(/Aula o espacio/)).toHaveValue('204')
  })
  it('edita y permite borrar el aula sin enviar campos de creación al PATCH',async()=>{
    mocks.entries=[entry()];const user=userEvent.setup();render(<SchedulePage/>);await openMonday(user);await user.click(screen.getByRole('button',{name:'Cambiar clase'}));await user.clear(screen.getByLabelText(/Aula o espacio/));await user.click(screen.getByRole('button',{name:'Guardar cambio'}));await waitFor(()=>expect(mocks.update).toHaveBeenCalledWith('entry',{sectionSubjectId:'subject',sectionId:'section',room:null}))
  })
  it('mantiene detalle y exportación en solo lectura',async()=>{
    mocks.entries=[entry()];mocks.canEdit=false;const user=userEvent.setup();render(<SchedulePage/>);await openMonday(user);expect(screen.getByText(/Solo lectura: no tienes permiso/)).toBeInTheDocument();expect(screen.queryByRole('button',{name:'Cambiar clase'})).not.toBeInTheDocument();expect(screen.getByRole('button',{name:'Exportar horario como PDF o imagen'})).toBeEnabled()
  })
  it('reubica una clase pendiente conservando su ID',async()=>{
    mocks.pending=[{...entry(),timeSlotId:'retired',needsPlacement:true}];const user=userEvent.setup();render(<SchedulePage/>);await user.click(await screen.findByRole('button',{name:'Reubicar clase'}));await user.click(screen.getByRole('button',{name:/Asignar el lunes/}));await waitFor(()=>expect(mocks.update).toHaveBeenCalledWith('entry',expect.objectContaining({timeSlotId:'mon',dayOfWeek:1})));expect(mocks.create).not.toHaveBeenCalled()
  })
  it('muestra el estado vacío original y conserva la revisión sin estructura',async()=>{
    mocks.slots=[];mocks.pending=[{...entry(),timeSlotId:'retired',needsPlacement:true}];render(<SchedulePage/>);expect(await screen.findByRole('button',{name:'Crear mi horario'})).toBeInTheDocument();expect(screen.getByText('Requiere revisión')).toBeInTheDocument();expect(screen.getByRole('button',{name:'Reubicar clase'})).toBeInTheDocument()
  })
  it('confirma antes de quitar una clase',async()=>{
    mocks.entries=[entry()];const user=userEvent.setup();render(<SchedulePage/>);await openMonday(user);await user.click(screen.getByRole('button',{name:'Quitar del horario'}));expect(mocks.remove).not.toHaveBeenCalled();await user.click(within(screen.getByRole('alertdialog')).getByRole('button',{name:'Quitar clase'}));await waitFor(()=>expect(mocks.remove).toHaveBeenCalledWith('entry'))
  })
  it('conserva el inspector y bloquea cambios hasta terminar todos los días del lote',async()=>{
    let release!: (value:ScheduleEntry)=>void
    mocks.create.mockImplementation(async(input)=>{
      if(input.dayOfWeek===1){const saved=entry();mocks.entries=[saved];return saved}
      return new Promise<ScheduleEntry>(resolve=>{release=resolve})
    })
    const user=userEvent.setup();render(<SchedulePage/>);await openMonday(user)
    await user.click(await screen.findByRole('radio',{name:/Primero A/}));await user.click(screen.getByRole('button',{name:'Mar'}));await user.click(screen.getByRole('button',{name:/^Asignar en 2 /}))
    await waitFor(()=>expect(mocks.create).toHaveBeenCalledTimes(2))
    expect(screen.getByRole('button',{name:/Asignando/})).toBeDisabled()
    expect(screen.queryByRole('button',{name:'Cambiar clase'})).not.toBeInTheDocument()
    await user.click(within(screen.getByRole('group',{name:'Martes'})).getByRole('button'))
    expect(screen.getByRole('heading',{name:/Lunes, per.odo 1/})).toBeInTheDocument()
    release({...entry(),id:'tue-entry',timeSlotId:'tue',dayOfWeek:2})
    await waitFor(()=>expect(screen.queryByRole('button',{name:/Asignando/})).not.toBeInTheDocument())
  })
  it('conserva los días fallidos y su motivo después de un lote parcialmente guardado',async()=>{
    mocks.create.mockImplementation(async(input)=>{if(input.dayOfWeek===2)throw new TypeError('Failed to fetch');const saved=entry();mocks.entries=[saved];return saved})
    const user=userEvent.setup();render(<SchedulePage/>);await openMonday(user)
    await user.click(await screen.findByRole('radio',{name:/Primero A/}));await user.click(screen.getByRole('button',{name:'Mar'}));await user.click(screen.getByRole('button',{name:/^Asignar en 2 /}))
    expect(await screen.findByRole('alert')).toHaveTextContent(/Martes:.*conectar con el servidor/)
    expect(within(screen.getByRole('alert')).getByRole('button',{name:'Cerrar aviso'})).toBeInTheDocument()
  })
  it('continúa la eliminación parcial desde los IDs pendientes y evita doble envío',async()=>{
    mocks.pending=[{...entry(),id:'one',timeSlotId:'retired',needsPlacement:true},{...entry(),id:'two',timeSlotId:'retired',needsPlacement:true}]
    const baseGet=mocks.get.getMockImplementation()!
    mocks.get.mockImplementation(async()=>({...await baseGet(),integrityIssues:[{code:'NEEDS_PLACEMENT',message:'Reubicar estas clases',entryIds:['one','two'],subjectName:'Matem\u00e1tica',gradeName:'Primero',sectionName:'A'}]}))
    let release!:()=>void
    mocks.remove.mockImplementationOnce(()=>new Promise<void>(resolve=>{release=()=>{mocks.pending=mocks.pending.filter(item=>item.id!=='one');resolve()}})).mockRejectedValueOnce(new TypeError('Failed to fetch')).mockImplementation(async(id)=>{mocks.pending=mocks.pending.filter(item=>item.id!==id)})
    const user=userEvent.setup();render(<SchedulePage/>)
    await user.click(await screen.findByRole('button',{name:'Quitar clase'}))
    const confirm=within(screen.getByRole('alertdialog')).getByRole('button',{name:'Quitar clase'})
    await user.click(confirm);expect(confirm).toBeDisabled();await user.click(confirm);expect(mocks.remove).toHaveBeenCalledTimes(1)
    release();await waitFor(()=>expect(within(screen.getByRole('alertdialog')).getByRole('alert')).toHaveTextContent(/conectar con el servidor/))
    await user.click(confirm);await waitFor(()=>expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(mocks.remove.mock.calls.map(call=>call[0])).toEqual(['one','two','two'])
  })

})
