/**
 * Módulo de horarios
 * @module ScheduleModule
 * @description Agrupa el controlador y servicio para la gestión de horarios escolares,
 * incluyendo franjas horarias, entradas de horario, secciones, profesores y materias.
 */
import { Module } from '@nestjs/common'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
/** Módulo que encapsula la funcionalidad de horarios */
export class ScheduleModule {}
