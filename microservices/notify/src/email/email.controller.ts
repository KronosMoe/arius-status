import { Controller } from '@nestjs/common'
import { EmailService } from './email.service'
import { EventPattern } from '@nestjs/microservices'

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern({ cmd: 'sendNewSessionEmail' })
  async sendNewSessionEmail(payload: {
    to: string
    context: { email: string; ip: string }
  }) {
    return await this.emailService.sendNewSessionEmail(
      payload.to,
      payload.context,
    )
  }
}
