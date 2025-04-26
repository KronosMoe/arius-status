import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class NotificationService {
  private readonly webhookUrl = process.env.DISCORD_WEBHOOK

  constructor(private readonly httpService: HttpService) {}

  async sendDiscordNotification(payload?: any): Promise<void> {
    await firstValueFrom(this.httpService.post(this.webhookUrl, payload))
  }
}
