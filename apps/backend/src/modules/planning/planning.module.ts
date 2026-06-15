/**
 * Módulo de planificación
 * @module PlanningModule
 * @description Agrupa el controlador y servicio para la gestión de planificaciones
 * educativas, incluyendo períodos académicos, competencias y entradas de planificación.
 */
import { Module } from '@nestjs/common'
import { PlanningController } from './planning.controller'
import { PlanningService } from './planning.service'

@Module({
  controllers: [PlanningController],
  providers: [PlanningService],
})
/** Módulo que encapsula la funcionalidad de planificación académica */
export class PlanningModule {}
