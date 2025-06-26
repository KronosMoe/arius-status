import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SessionCleanupService {
  private readonly logger = new Logger(SessionCleanupService.name)

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running daily session cleanup...')

    const result = await this.prisma.sessions.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    })

    this.logger.log(`Deleted ${result.count} expired sessions.`)
  }
}
