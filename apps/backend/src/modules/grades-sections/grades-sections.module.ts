/**
 * Módulo de grados y secciones
 * @module GradesSectionsModule
 * @description Agrupa el controlador y servicio para la gestión de grados, secciones,
 * materias y asignación de materias a secciones dentro de un colegio.
 */
import { Module } from '@nestjs/common'
import { GradesSectionsController } from './grades-sections.controller'
import { GradesSectionsService } from './grades-sections.service'

@Module({
  controllers: [GradesSectionsController],
  providers: [GradesSectionsService],
})
/** Módulo que encapsula la funcionalidad de grados y secciones */
export class GradesSectionsModule {}
