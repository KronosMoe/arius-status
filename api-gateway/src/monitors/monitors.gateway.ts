import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { AgentsGateway } from 'src/agents/agents.gateway'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class MonitorGateway implements OnModuleInit {
  private logger: Logger = new Logger(MonitorGateway.name)

  constructor(
    private agentsGateway: AgentsGateway,
    private prisma: PrismaService,
  ) {}

  private monitorIntervals = new Map<string, NodeJS.Timeout>()

  async onModuleInit() {
    await this.startAllMonitors()
  }

  async startAllMonitors() {
    const monitors = await this.prisma.monitors.findMany({
      where: {
        type: 'PING',
      },
    })

    for (const monitor of monitors) {
      this.startMonitor(monitor)
    }
  }

  startMonitor(monitor: any) {
    if (!monitor.interval || !monitor.agentId) {
      this.logger.warn(`⚠️ Monitor ${monitor.id} missing interval or agentId.`)
      return
    }

    const intervalMs = monitor.interval * 1000

    const interval = setInterval(() => {
      const socketServer = this.agentsGateway.server

      if (!socketServer) {
        this.logger.error('🚫 Socket server not ready')
        return
      }

      this.logger.log(
        `📤 Sending monitor ${monitor.id} to agent ${monitor.agentId}`,
      )
      socketServer.to(monitor.agentId).emit('run-command', monitor)
    }, intervalMs)

    this.monitorIntervals.set(monitor.id, interval)
  }

  stopMonitor(monitorId: string) {
    const interval = this.monitorIntervals.get(monitorId)
    if (interval) {
      clearInterval(interval)
      this.monitorIntervals.delete(monitorId)
    }
  }
}
