// src/auth/gql-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
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
      return false
    }

    const user = await this.authService.getUserFromToken(token)
    if (!user) {
      return false
    }

    ctx.req.user = user
    return true
  }
}
