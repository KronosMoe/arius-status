import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class StatusService {
  private logger: Logger = new Logger(StatusService.name)

  constructor(private readonly prisma: PrismaService) {}

  async getStatusByMonitorId(monitorId: string, barCount: number = 60) {
    const monitor = await this.prisma.monitors.findUnique({
      where: { id: monitorId },
      select: { interval: true },
    })

    if (!monitor) {
      throw new NotFoundException('Monitor not found')
    }

    const barMultiplier = 1.2
    const timeWindowMs = monitor.interval * barCount * barMultiplier * 1000
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

  async getLatestStatusByMonitorId(monitorId: string) {
    const monitor = await this.prisma.monitors.findUnique({
      where: { id: monitorId },
      select: { interval: true },
    })

    if (!monitor) {
      throw new NotFoundException('Monitor not found')
    }

    const latest = await this.prisma.statusResults.findFirst({
      where: {
        monitorId: monitorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!latest) {
      return {
        id: 'unknown',
        createdAt: new Date(),
        responseTime: -999,
        metadata: {},
      }
    }

    return latest
  }

  async getOverallStatus(monitorIds: string[]) {
    const latestStatuses = await Promise.all(
      monitorIds.map(async (monitorId) => {
        const [latest] = await this.prisma.statusResults.findMany({
          where: { monitorId },
          orderBy: { createdAt: 'desc' },
          take: 1,
        })
        return latest
      }),
    )

    const allStatuses = latestStatuses.filter(Boolean)

    const allUp = allStatuses.every((status) => status.responseTime !== -1)
    const allDown = allStatuses.every((status) => status.responseTime === -1)

    if (allUp) {
      return 'All Systems Operational'
    }

    if (allDown) {
      return 'Degraded'
    }

    return 'Partially Degraded'
  }

  async getStatusByTimeRange(monitorId: string, from: Date, to: Date) {
    return await this.prisma.statusResults.findMany({
      where: {
        monitorId: monitorId,
        createdAt: {
          gte: from,
          lte: to,
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
