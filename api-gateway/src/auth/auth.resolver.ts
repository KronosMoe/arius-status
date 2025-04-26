import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { User } from 'src/users/entities/user.entity'
import { RegisterInput } from './dto/register.input'
import { LoginInput } from './dto/login.input'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from './guards/gql-auth.guard'
import { Me } from './decorators/me.decorator'
import { Response } from 'express'
import { ACCESS_TOKEN } from 'src/constants/cookies'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async register(@Args('input') input: RegisterInput): Promise<string> {
    const user = await this.authService.register(input)
    return user.id
  }

  @Mutation(() => String)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: any,
  ): Promise<string> {
    const ip =
      context.req.headers['x-forwarded-for']?.split(',')[0] || context.req.ip
    const { token, user } = await this.authService.login(input, ip)

    const res: Response = context.res
    res.cookie(ACCESS_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    })

    return user.id
  }

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@Me() user: User): Promise<User> {
    return await this.authService.getCurrentUser(user.id)
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: any): Promise<boolean> {
    const res: Response = context.res
    res.clearCookie(ACCESS_TOKEN)
    return true
  }
}
