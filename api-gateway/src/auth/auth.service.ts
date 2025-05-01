import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { RegisterInput } from './dto/register.input'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service'
import { generateToken } from 'src/libs/token'
import { addMilliseconds } from 'date-fns'
import { LoginInput } from './dto/login.input'
import { Auth } from './entities/auth.entity'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async register(createUserInput: RegisterInput) {
    const hash = await bcrypt.hash(createUserInput.password, 10)
    const user = await this.userService.createUser({
      username: createUserInput.username,
      email: createUserInput.email,
      password: hash,
      timezone: createUserInput.timezone,
    })

    return user
  }

  async login(loginInput: LoginInput, ip: string) {
    const user = await this.userService.findUserByUsername(loginInput.username)

    if (!user || !(await bcrypt.compare(loginInput.password, user.password))) {
      throw new UnauthorizedException('Incorrect username or password')
    }

    const existingSession = await this.prisma.sessions.findFirst({
      where: {
        userId: user.id,
        platform: loginInput.platform,
        deviceIP: ip,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (existingSession) {
      return { token: existingSession.token, user }
    }

    const token = generateToken()
    const expires = addMilliseconds(new Date(), 604800000)

    await this.prisma.sessions.create({
      data: {
        userId: user.id,
        token,
        expires,
        platform: loginInput.platform,
        deviceIP: ip,
      },
    })

    return { token, user }
  }

  async getUserFromToken(token: string) {
    const session = await this.prisma.sessions.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || session.expires < new Date()) {
      return null
    }

    return session.user
  }

  async logout(token: string) {
    await this.prisma.sessions.delete({ where: { token } })
    return true
  }

  async getCurrentUser(userId: string): Promise<Auth> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        image: true,
      },
    })
    const settings = await this.prisma.settings.findUnique({
      where: { userId },
    })

    return { ...user, settings } as Auth
  }
}
