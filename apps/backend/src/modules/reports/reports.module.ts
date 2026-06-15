/**
 * Módulo de reportes
 * @module ReportsModule
 * @description Agrupa el controlador y servicio para la generación y exportación
 * de reportes académicos, incluyendo reportes de estudiantes y exportación de calificaciones.
 */
import { Module } from '@nestjs/common'
import { ReportsController } from './reports.controller'
import { ReportsService } from './reports.service'

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
})
/** Módulo que encapsula la funcionalidad de reportes académicos */
export class ReportsModule {}
