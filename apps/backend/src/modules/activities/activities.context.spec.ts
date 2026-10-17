import {beforeEach,expect,it,vi} from 'vitest'
import {GradingService} from '../grading/grading.service'
import {ActivitiesController} from './activities.controller'
import {ActivitiesService} from './activities.service'

const db=vi.hoisted(()=>({evaluationActivity:{findMany:vi.fn()},enrollment:{groupBy:vi.fn()}}))
vi.mock('@aula/database',()=>({prisma:db,Prisma:{DbNull:null}}))
beforeEach(()=>{vi.clearAllMocks();db.evaluationActivity.findMany.mockResolvedValue([]);db.enrollment.groupBy.mockResolvedValue([])})
it('carga el contexto del creador sin consultar instrumentos, snapshots ni conteos del centro',async()=>{
 const service=new GradingService()
 const subjects=vi.spyOn(service as any,'loadSectionSubjects').mockResolvedValue([{id:'ss'}])
 vi.spyOn(service as any,'loadAcademicPeriods').mockResolvedValue([{id:'period'}])
 const controller=new ActivitiesController(new ActivitiesService(service))
 const result=await controller.getCenter({schoolId:'school',id:'teacher',roles:['teacher']} as any,'true')
 expect(result).toEqual({sectionSubjects:[{id:'ss'}],academicPeriods:[{id:'period'}],activities:[]})
 expect(subjects).toHaveBeenCalledWith('school','teacher',true)
 expect(db.evaluationActivity.findMany).not.toHaveBeenCalled()
 expect(db.enrollment.groupBy).not.toHaveBeenCalled()
})
it('mantiene el listado completo y sus filtros de acceso sin la opción del creador',async()=>{
 const service=new GradingService()
 vi.spyOn(service as any,'loadSectionSubjects').mockResolvedValue([])
 vi.spyOn(service as any,'loadAcademicPeriods').mockResolvedValue([])
 db.evaluationActivity.findMany.mockResolvedValue([]);db.enrollment.groupBy.mockResolvedValue([])
 await new ActivitiesController(new ActivitiesService(service)).getCenter({schoolId:'school',id:'teacher',roles:['teacher']} as any)
 expect(db.evaluationActivity.findMany).toHaveBeenCalledOnce()
 expect(db.evaluationActivity.findMany.mock.calls[0][0].where.sectionSubject).toMatchObject({schoolId:'school',teacher:{userId:'teacher',schoolId:'school',status:'ACTIVE'}})
})
