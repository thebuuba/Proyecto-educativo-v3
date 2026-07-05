/**
 * Módulo de configuración
 * @module SchoolAdministrationModule
 * @description Agrupa el controlador y servicio para la gestión de la configuración
 * del colegio, incluyendo datos de la institución, años escolares y períodos académicos.
 */
import { Module } from '@nestjs/common'
import { SchoolAdministrationController } from './school-administration.controller'
import { SchoolAdministrationService } from './school-administration.service'

@Module({
  controllers: [SchoolAdministrationController],
  providers: [SchoolAdministrationService],
})
/** Módulo que encapsula la funcionalidad de configuración del colegio */
export class SchoolAdministrationModule {}
