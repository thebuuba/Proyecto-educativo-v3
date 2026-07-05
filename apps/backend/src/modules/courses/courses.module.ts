/**
 * Módulo de grados y secciones
 * @module CoursesModule
 * @description Agrupa el controlador y servicio para la gestión de grados, secciones,
 * materias y asignación de materias a secciones dentro de un colegio.
 */
import { Module } from '@nestjs/common'
import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
})
/** Módulo que encapsula la funcionalidad de grados y secciones */
export class CoursesModule {}
