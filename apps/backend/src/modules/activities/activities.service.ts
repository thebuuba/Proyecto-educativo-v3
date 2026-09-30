import { Injectable } from '@nestjs/common'
import { GradingService } from '../grading/grading.service'
import { SaveActivityDto } from './dto/save-activity.dto'

/**
 * Punto de entrada del dominio Actividades.
 *
 * La persistencia existente se mantiene temporalmente en el servicio de
 * calificaciones para conservar una sola implementación durante la extracción.
 * Ningún consumidor HTTP debe volver a acceder al CRUD desde /grading.
 */
@Injectable()
export class ActivitiesService {
  constructor(private readonly grading: GradingService) {}

  findAll(schoolId: string, filters: { sectionSubjectId?: string; academicPeriodId?: string; planningEntryId?: string }) {
    return this.grading.getActivities(schoolId, filters)
  }

  getCenter(schoolId: string, userId: string, roles: string[]) {
    return this.grading.getActivityCenter(schoolId, userId, roles)
  }

  save(schoolId: string, userId: string, dto: SaveActivityDto, roles: string[]) {
    return this.grading.saveActivity(schoolId, userId, dto, roles)
  }

  linkPlanning(schoolId: string, id: string, dto: { planningEntryId: string | null; planningMoment?: string }) {
    return this.grading.linkActivityToPlanning(schoolId, id, dto)
  }

  remove(schoolId: string, id: string) {
    return this.grading.deleteActivity(schoolId, id)
  }
}
