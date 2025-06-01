import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-github2'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { username, emails, photos } = profile

    const email = emails?.[0]?.value

    return this.authService.validateOAuthLogin({
      username,
      email,
      image: photos?.[0]?.value ?? '',
    })
  }
}
