/**
 * Módulo de asignaturas.
 * Gestiona las asignaturas o materias disponibles
 * dentro del contexto de una escuela.
 */
import { Module } from '@nestjs/common'
import { SubjectsController } from './subjects.controller'
import { SubjectsService } from './subjects.service'

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
