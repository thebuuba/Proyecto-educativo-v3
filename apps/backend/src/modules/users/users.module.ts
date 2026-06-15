/**
 * Módulo de usuarios.
 * Gestiona las operaciones CRUD de usuarios y la consulta
 * de roles y permisos dentro del contexto de una escuela.
 */
import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
