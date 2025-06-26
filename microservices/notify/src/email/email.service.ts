import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, Logger } from '@nestjs/common'
import { join } from 'path'

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name)

  constructor(private readonly mailerService: MailerService) {}

  async sendNewSessionEmail(
    to: string,
    context: { email: string; ip: string },
  ) {
    const nowUtc = new Date()
    const formatUtcDate = (date: Date): string => {
      const pad = (n: number) => String(n).padStart(2, '0')
      return (
        `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
        `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
      )
    }

    this.logger.debug(`Sending new session email to ${to}`)

    try {
      const result = await this.mailerService.sendMail({
        to,
        subject: 'New Session Detected',
        template: './session-created',
        context: {
          ...context,
          time: formatUtcDate(nowUtc),
          year: new Date().getFullYear(),
        },
        attachments: [
          {
            filename: 'Logo.png',
            path: join(__dirname, 'assets', 'Logo.png'),
            cid: 'logo@arius',
          },
        ],
      })

      this.logger.log(`Email sent successfully to ${to}`, result)
      return result
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error)
      throw error
    }
  }
}
