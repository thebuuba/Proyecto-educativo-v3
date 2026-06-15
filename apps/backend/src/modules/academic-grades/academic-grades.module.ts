/**
 * Módulo de calificaciones académicas.
 *
 * Proporciona funcionalidad para el registro y consulta de notas
 * y calificaciones de los estudiantes en las distintas materias.
 */
import { Module } from '@nestjs/common'
import { GradesController } from './grades.controller'
import { GradesService } from './grades.service'

@Module({
  controllers: [GradesController],
  providers: [GradesService],
})
/**
 * Módulo raíz del módulo de calificaciones académicas.
 *
 * Declara el controlador y el servicio necesarios para gestionar
 * las calificaciones de los estudiantes.
 */
export class AcademicGradesModule {}
