import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { CreateNotificationInput } from './dto/create-notification.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { Monitor } from 'src/monitors/entities/monitor.entity'
import { getDiscordEmbed } from 'src/libs/notification'
import { UpdateNotificationInput } from './dto/update-notification.input'

@Injectable()
export class NotificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async getNotificationSettingsByUserId(userId: string) {
    return this.prisma.notifications.findMany({
      where: {
        userId: userId,
      },
    })
  }

  async createNotificationSetting(
    createNotificationInput: CreateNotificationInput,
    userId: string,
  ) {
    return this.prisma.notifications.create({
      data: {
        ...createNotificationInput,
        isDefault: false,
        userId,
      },
    })
  }

  async updateNotificationSetting(
    updateNotificationInput: UpdateNotificationInput,
    id: string,
  ) {
    return this.prisma.notifications.update({
      where: {
        id,
      },
      data: {
        ...updateNotificationInput,
      },
    })
  }

  async deleteNotificationSetting(id: string) {
    return this.prisma.notifications.delete({
      where: {
        id,
      },
    })
  }

  async sendNotification(
    monitor: Monitor & { userId: string },
    isDown = false,
  ) {
    const settings = await this.getNotificationSettingsByUserId(monitor.userId)

    for (const setting of settings) {
      if (setting.method === 'Discord') {
        if (!setting.webhookUrl) {
          throw new BadRequestException('Webhook URL is required for Discord')
        }

        const payload = {
          content: setting.message || undefined,
          embeds: getDiscordEmbed(monitor, isDown),
        }

        await this.sendDiscordNotification(setting.webhookUrl, payload)
      }
    }
  }

  async sendDiscordNotification(
    webhookUrl: string,
    payload?: any,
  ): Promise<void> {
    await firstValueFrom(this.httpService.post(webhookUrl, payload || {}))
  }
}
