/**
 * Módulo de calificaciones académicas.
 *
 * Proporciona funcionalidad para el registro y consulta de notas
 * y calificaciones de los estudiantes en las distintas materias.
 */
import { Module } from '@nestjs/common'
import { GradingController } from './grading.controller'
import { GradingService } from './grading.service'

@Module({
  controllers: [GradingController],
  providers: [GradingService],
})
/**
 * Módulo raíz del módulo de calificaciones académicas.
 *
 * Declara el controlador y el servicio necesarios para gestionar
 * las calificaciones de los estudiantes.
 */
export class GradingModule {}
