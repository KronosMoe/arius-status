import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { MonitorPublisherService } from './monitor-publisher.service'

@Injectable()
export class MonitorGateway implements OnModuleInit {
  private logger: Logger = new Logger(MonitorGateway.name)

  constructor(
    private prisma: PrismaService,
    private monitorPublisher: MonitorPublisherService,
  ) {}

  private monitorIntervals = new Map<string, NodeJS.Timeout>()
  private startingMonitors = new Set<string>()

  async onModuleInit() {
    await this.startAllMonitors()
  }

  async startAllMonitors() {
    const monitors = await this.prisma.monitors.findMany({
      where: {
        NOT: { status: 'PAUSED' },
      },
    })

    for (const monitor of monitors) {
      this.startMonitor(monitor)
    }
  }

  startMonitor(monitor: any) {
    if (this.startingMonitors.has(monitor.id)) {
      this.logger.warn(
        `Monitor ${monitor.id} is already being started — skipping`,
      )
      return
    }

    this.startingMonitors.add(monitor.id)

    try {
      if (this.monitorIntervals.has(monitor.id)) {
        this.logger.warn(
          `Monitor ${monitor.id} already running — restarting it`,
        )
        this.stopMonitor(monitor.id)
      }

      if (!monitor.interval || !monitor.agentId) {
        this.logger.warn(`Monitor ${monitor.id} missing interval or agentId.`)
        return
      }

      const intervalMs = monitor.interval * 1000

      this.logger.log(
        `Starting monitor ${monitor.id} with interval ${intervalMs}ms for agent ${monitor.agentId}`,
      )

      const interval = setInterval(() => {
        this.monitorPublisher.publishMonitorCommand({
          monitorId: monitor.id,
          agentId: monitor.agentId,
          data: monitor,
        })
      }, intervalMs)

      this.monitorIntervals.set(monitor.id, interval)
    } finally {
      this.startingMonitors.delete(monitor.id)
    }
  }

  stopMonitor(monitorId: string) {
    const interval = this.monitorIntervals.get(monitorId)
    if (interval) {
      clearInterval(interval)
      this.monitorIntervals.delete(monitorId)
    }
  }
}
