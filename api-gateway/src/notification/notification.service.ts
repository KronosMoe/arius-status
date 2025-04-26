import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class NotificationService {
  private readonly webhookUrl =
    'https://discord.com/api/webhooks/1365704982564700260/CW4TzcPUZIcyOLYG41dJ3KEKGSk77HXMfsTiQH1W5wGPURJ8rgnTv4hO-3i7Fvrt_EtB'

  constructor(private readonly httpService: HttpService) {}

  async sendDiscordNotification(payload?: any): Promise<void> {
    await firstValueFrom(this.httpService.post(this.webhookUrl, payload))
  }
}
