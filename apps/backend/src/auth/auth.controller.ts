import { BadRequestException, Controller, Get, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import axios from 'axios'
import { ACCESS_TOKEN } from 'src/constants/cookies'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string

    if (!code) {
      throw new BadRequestException('Code not found')
    }

    try {
      const tokenRes = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
          client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
          redirect_uri: `${this.configService.get<string>('BACKEND_URL')}/auth/google/callback`,
          grant_type: 'authorization_code',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )

      const accessToken = tokenRes.data.access_token

      const userRes = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      const { email, name, picture } = userRes.data

      const user = await this.authService.validateOAuthLogin(
        {
          email,
          username: name,
          image: picture,
        },
        'google',
      )

      const userAgent = req.headers['user-agent'] || 'unknown'
      const token = await this.authService.createSession(
        user.id,
        req.ip,
        userAgent,
        email,
      )

      res.cookie(ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.redirect(
        process.env.NODE_ENV === 'production'
          ? `${process.env.URL}/dashboard`
          : 'http://localhost:3000/dashboard',
      )
    } catch (error: any) {
      const msg = encodeURIComponent(error.message || 'OAuth failed')
      return res.redirect(
        process.env.NODE_ENV === 'production'
          ? `${process.env.URL}/auth/sign-in?error=${msg}`
          : `http://localhost:3000/auth/sign-in?error=${msg}`,
      )
    }
  }

  @Get('github/callback')
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string

    if (!code) {
      throw new BadRequestException('Code not found')
    }

    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
        client_secret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const accessToken = tokenResponse.data.access_token

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const emailResponse = await axios.get(
      'https://api.github.com/user/emails',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    const primaryEmail = emailResponse.data.find((e) => e.primary)?.email

    const { login: username, avatar_url: image } = userResponse.data

    try {
      // This may throw if user exists
      const user = await this.authService.validateOAuthLogin(
        {
          username,
          email: primaryEmail,
          image,
        },
        'github',
      )

      const userAgent = req.headers['user-agent'] || 'unknown'
      const token = await this.authService.createSession(
        user.id,
        req.ip,
        userAgent,
        primaryEmail,
      )

      res.cookie(ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.redirect(
        process.env.NODE_ENV === 'production'
          ? process.env.URL + '/dashboard'
          : 'http://localhost:3000/dashboard',
      )
    } catch (error: any) {
      const errorMessage = encodeURIComponent(
        error.message || 'OAuth login failed',
      )
      return res.redirect(
        `${
          process.env.NODE_ENV === 'production'
            ? process.env.URL + '/auth/sign-in'
            : `http://localhost:3000/auth/sign-in`
        }?error=${errorMessage}`,
      )
    }
  }
}
