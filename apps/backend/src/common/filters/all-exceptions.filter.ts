/**
 * @description Filtro global de excepciones NestJS. Captura errores y devuelve formato uniforme.
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

/**
 * Filtro que atrapa todas las excepciones no controladas y las transforma
 * en una respuesta JSON uniforme con los campos success, error y statusCode.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Maneja la excepción y envía la respuesta formateada al cliente.
   *
   * @param exception - La excepción lanzada (puede ser HttpException u otra).
   * @param host - Contexto del manejador de la solicitud actual.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()
      message = typeof res === 'string' ? res : (res as any).message ?? message
    }

    response.status(status).json({
      success: false,
      error: message,
      statusCode: status,
    })
  }
}
