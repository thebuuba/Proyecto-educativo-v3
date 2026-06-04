import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticatedUser } from '../../modules/auth/types/authenticated-user'

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
