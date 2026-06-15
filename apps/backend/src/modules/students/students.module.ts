/**
 * Módulo de estudiantes.
 *
 * Encapsula toda la funcionalidad relacionada con la gestión de
 * estudiantes, incluyendo operaciones CRUD, matrículas, apoderados
 * e importación masiva de datos.
 */
import { Module } from '@nestjs/common'
import { StudentsController } from './students.controller'
import { StudentsService } from './students.service'

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
/**
 * Módulo raíz del módulo de estudiantes.
 *
 * Declara el controlador y el servicio necesarios para la gestión
 * de estudiantes, y exporta el servicio para otros módulos.
 */
export class StudentsModule {}
