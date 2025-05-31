import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { createHash } from 'crypto'
import { RegisterInput } from 'src/auth/dto/register.input'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name)

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany()
  }

  async createUser(createUserInput: RegisterInput) {
    const exists = await this.prisma.users.findMany({
      where: {
        OR: [
          { username: createUserInput.username },
          { email: createUserInput.email },
        ],
      },
    })

    if (exists.length > 0) {
      throw new BadRequestException('This username or email already exists')
    }

    const emailHash = createHash('sha256')
      .update(createUserInput.email)
      .digest('hex')
    const image = `https://gravatar.com/avatar/${emailHash}`

    const user = await this.prisma.users.create({
      data: {
        username: createUserInput.username,
        email: createUserInput.email,
        password: createUserInput.password,
        image,
      },
    })

    await this.prisma.settings.create({
      data: {
        userId: user.id,
      },
    })

    this.logger.log(`User ${user.username} created`)
    return user
  }

  async findUserById(id: string) {
    const user = await this.prisma.users.findUnique({ where: { id } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async findUserByUsername(username: string) {
    const user = await this.prisma.users.findUnique({ where: { username } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
}
