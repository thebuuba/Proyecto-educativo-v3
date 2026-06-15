/**
 * @description Interceptor global que envuelve respuestas exitosas en { success: true, data: ... }.
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * Interfaz que define la estructura uniforme de una respuesta exitosa de la API.
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
}

/**
 * Interceptor que transforma toda respuesta exitosa del controlador en un objeto
 * con la forma `{ success: true, data: <respuesta original> }`.
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  /**
   * Intercepta la llamada al manejador y envuelve el resultado en ApiResponse.
   *
   * @param context - Contexto de ejecución de NestJS.
   * @param next - Manejador que ejecuta el siguiente paso en la cadena de solicitud.
   * @returns Observable con la respuesta envuelta en { success: true, data }.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    )
  }
}
