/**
 * Módulo de configuración
 * @module SettingsModule
 * @description Agrupa el controlador y servicio para la gestión de la configuración
 * del colegio, incluyendo datos de la institución, años escolares y períodos académicos.
 */
import { Module } from '@nestjs/common'
import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
})
/** Módulo que encapsula la funcionalidad de configuración del colegio */
export class SettingsModule {}
