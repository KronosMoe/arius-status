import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettingsByUserId(userId: string) {
    return this.prisma.settings.findUnique({
      where: {
        userId: userId,
      },
    })
  }

  async updateTheme(theme: string, userId: string) {
    return this.prisma.settings.update({
      where: {
        userId,
      },
      data: {
        theme,
      },
    })
  }

  async getSessionsByUserId(userId: string) {
    return this.prisma.sessions.findMany({
      where: {
        userId,
      },
    })
  }

  async clearSessionsByUserId(userId: string) {
    const sessions = await this.prisma.sessions.findMany({
      where: { userId },
    })

    await this.prisma.sessions.deleteMany({
      where: { userId },
    })

    return sessions
  }

  async clearSessionById(id: string) {
    const session = await this.prisma.sessions.findUnique({
      where: { id },
    })

    if (!session) {
      throw new NotFoundException('Session not found')
    }

    await this.prisma.sessions.delete({
      where: { id },
    })

    return session
  }
}
