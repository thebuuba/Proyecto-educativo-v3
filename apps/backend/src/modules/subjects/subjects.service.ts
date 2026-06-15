/**
 * Servicio de asignaturas.
 * Provee la lógica de negocio para la consulta de asignaturas
 * disponibles en una escuela.
 */
import { Injectable } from '@nestjs/common'
import { prisma } from '@aula/database'

@Injectable()
export class SubjectsService {
  /**
   * Obtiene todas las asignaturas de una escuela ordenadas por nombre.
   *
   * @param schoolId - ID de la escuela.
   * @returns Lista de asignaturas.
   */
  findAll(schoolId: string) {
    return prisma.subject.findMany({ where: { schoolId }, orderBy: { name: 'asc' } })
  }
}
