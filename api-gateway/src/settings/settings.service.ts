import { Injectable } from '@nestjs/common'
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

  async updateTimezone(timezone: string, userId: string) {
    return this.prisma.settings.update({
      where: {
        userId,
      },
      data: {
        timezone,
      },
    })
  }
}
