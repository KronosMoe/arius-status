import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthService } from '../auth.service'
import { ACCESS_TOKEN } from 'src/constants/cookies'

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext()

    const token = ctx.req.cookies[ACCESS_TOKEN]

    if (!token) {
      throw new UnauthorizedException()
    }

    const user = await this.authService.getUserFromToken(token)
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    ctx.req.user = user
    return true
  }
}
