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
import { Auth } from './entities/auth.entity'
import { ConfigService } from '@nestjs/config'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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
      maxAge: 604800000,
    })

    return user.id
  }

  @Query(() => Auth, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@Me() user: User): Promise<Auth> {
    return await this.authService.getCurrentUser(user.id)
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: any): Promise<boolean> {
    const res: Response = context.res
    res.clearCookie(ACCESS_TOKEN)
    return true
  }

  // Github OAuth

  @Query(() => String)
  getGithubOAuthUrl(): string {
    const clientId = this.configService.get<string>('GITHUB_CLIENT_ID')
    const redirectUri = `${this.configService.get<string>('BACKEND_URL')}/auth/github/callback`
    const scope = 'user:email'

    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`

    return githubUrl
  }

  // Google Oauth

  @Query(() => String)
  getGoogleOAuthUrl(): string {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
      redirect_uri: `${this.configService.get<string>('BACKEND_URL')}/auth/google/callback`,
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
    }

    const qs = new URLSearchParams(options).toString()
    return `${rootUrl}?${qs}`
  }
}
