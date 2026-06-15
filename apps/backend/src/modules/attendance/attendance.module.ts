/**
 * Módulo de asistencia.
 *
 * Proporciona funcionalidad para el registro y consulta de asistencia
 * de estudiantes, tanto a nivel diario como por clase.
 */
import { Module } from '@nestjs/common'
import { AttendanceController } from './attendance.controller'
import { AttendanceService } from './attendance.service'

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
/**
 * Módulo raíz del módulo de asistencia.
 *
 * Declara el controlador y el servicio necesarios para gestionar
 * la asistencia diaria y por clase de los estudiantes.
 */
export class AttendanceModule {}
