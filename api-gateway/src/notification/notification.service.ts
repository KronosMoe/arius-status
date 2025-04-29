import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { CreateNotificationInput } from './dto/create-notification.input'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class NotificationService {
  private readonly webhookUrl = process.env.DISCORD_WEBHOOK

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
        title: createNotificationInput.title,
        method: createNotificationInput.method,
        message: createNotificationInput.message,
        metadata: createNotificationInput.metadata,
        userId,
      },
    })
  }

  async sendDiscordNotification(payload?: any): Promise<void> {
    await firstValueFrom(this.httpService.post(this.webhookUrl, payload))
  }
}
