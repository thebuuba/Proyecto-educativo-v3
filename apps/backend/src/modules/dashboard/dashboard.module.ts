/**
 * Módulo de dashboard
 * @module DashboardModule
 * @description Agrupa el controlador y servicio para el panel de control del colegio,
 * incluyendo estadísticas y gestión de tareas del dashboard.
 */
import { Module } from '@nestjs/common'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
/** Módulo que encapsula la funcionalidad del panel de control */
export class DashboardModule {}
