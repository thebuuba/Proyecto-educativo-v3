import { Injectable } from '@nestjs/common'
import { GradingService } from '../grading/grading.service'
import { SaveActivityDto } from './dto/save-activity.dto'
import {timeDevelopmentStage} from '../../common/development-request-timing'

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

  findAll(schoolId: string, filters: { sectionSubjectId?: string; academicPeriodId?: string; planningEntryId?: string }, userId: string, roles: string[]) {
    return timeDevelopmentStage('activity.read',()=>this.grading.getActivities(schoolId, filters, userId, roles))
  }

  getCenter(schoolId: string, userId: string, roles: string[], contextOnly = false) {
    return timeDevelopmentStage('context.workspace',()=>this.grading.getActivityCenter(schoolId, userId, roles, contextOnly))
  }

  save(schoolId: string, userId: string, dto: SaveActivityDto, roles: string[]) {
    return timeDevelopmentStage('activity.save',()=>this.grading.saveActivity(schoolId, userId, dto, roles))
  }

  linkPlanning(schoolId: string, id: string, dto: { planningEntryId: string | null; planningMoment?: string }, userId: string, roles: string[]) {
    return this.grading.linkActivityToPlanning(schoolId, id, dto, userId, roles)
  }

  remove(schoolId: string, id: string, userId: string, roles: string[]) {
    return this.grading.deleteActivity(schoolId, id, userId, roles)
  }
}
