import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, path, params } = request
    if (!['POST', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle()
    }

    const user = request.user
    const userId = user?.id ?? user?.sub ?? 'anonymous'
    const resourceId = params?.id ?? ''

    return next.handle().pipe(
      tap(() => {
        console.log(
          `[AUDIT] user=${userId} action=${method} resource=${path} timestamp=${new Date().toISOString()}${resourceId ? ` id=${resourceId}` : ''}`,
        )
      }),
    )
  }
}
