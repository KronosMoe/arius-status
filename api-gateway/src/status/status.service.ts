import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class StatusService {
  private logger: Logger = new Logger(StatusService.name)

  constructor(private readonly prisma: PrismaService) {}

  async getStatusByMonitorId(monitorId: string) {
    const monitor = await this.prisma.monitors.findUnique({
      where: { id: monitorId },
      select: { interval: true },
    })

    if (!monitor) {
      throw new NotFoundException('Monitor not found')
    }

    const BAR_COUNT = 60
    const timeWindowMs = monitor.interval * BAR_COUNT * 1000
    const fromDate = new Date(Date.now() - timeWindowMs)

    return await this.prisma.statusResults.findMany({
      where: {
        monitorId: monitorId,
        createdAt: {
          gte: fromDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  @Cron('0 5 * * *')
  async deleteOldStatuses() {
    const thresholdDate = new Date()
    thresholdDate.setHours(thresholdDate.getHours() - 24)

    await this.prisma.statusResults.deleteMany({
      where: {
        createdAt: {
          lt: thresholdDate,
        },
      },
    })

    this.logger.log('Cleaned up statuses older than 24 hours')
  }
}
