import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { CreateNotificationInput } from './dto/create-notification.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateNotificationInput } from './dto/update-notification.input'
import { Agents, Monitors, Notifications } from '@prisma/client'
import {
  getDiscordAgentEmbed,
  getDiscordMonitorEmbed,
} from 'src/lib/notification'

@Injectable()
export class NotificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async getNotificationSettingsByUserId(
    userId: string,
  ): Promise<Notifications[]> {
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

  async sendMonitorNotification(monitor: Monitors, isDown = false) {
    const settings = await this.getNotificationSettingsByUserId(monitor.userId)

    for (const setting of settings) {
      if (setting.method === 'Discord') {
        if (!setting.webhookUrl) {
          throw new BadRequestException('Webhook URL is required for Discord')
        }

        const payload = {
          content: setting.message || undefined,
          embeds: getDiscordMonitorEmbed(monitor, isDown),
        }

        await this.sendDiscordNotification(setting.webhookUrl, payload)
      }
    }
  }

  async sendAgentNotification(agent: Agents, userId: string, isDown = false) {
    const settings = await this.getNotificationSettingsByUserId(userId)

    for (const setting of settings) {
      if (setting.method === 'Discord') {
        if (!setting.webhookUrl) {
          throw new BadRequestException('Webhook URL is required for Discord')
        }

        const payload = {
          content: setting.message || undefined,
          embeds: getDiscordAgentEmbed(agent, isDown),
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
