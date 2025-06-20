import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { AgentsGateway } from 'src/gateway/agents.gateway'
import { PrismaService } from 'src/prisma/prisma.service'
import { NotificationService } from 'src/notification/notification.service'

@Injectable()
export class MonitorWebSocketEmitter {
  private logger = new Logger(MonitorWebSocketEmitter.name)

  constructor(
    private agentsGateway: AgentsGateway,
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  @RabbitSubscribe({
    exchange: 'monitor.exchange',
    routingKey: 'monitor.route',
    queue: 'monitor.queue',
    queueOptions: {
      durable: false,
      autoDelete: true,
    },
  })
  async handleMonitorCommand(payload: any) {
    const { agentId, monitorId, data } = payload

    if (!agentId || !monitorId || !data) {
      this.logger.warn('Invalid monitor command payload received.')
      return
    }

    const [agent, monitor, latestStatus] = await Promise.all([
      this.prisma.agents.findUnique({ where: { id: agentId } }),
      this.prisma.monitors.findUnique({
        where: { id: monitorId },
        select: { userId: true, status: true },
      }),
      this.prisma.statusResults.findFirst({
        where: { monitorId },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    if (!agent) {
      this.logger.warn(`Agent ${agentId} not found.`)
      return
    }

    const isLatestStatusUp = latestStatus && latestStatus.responseTime !== -1

    if (!agent.isOnline) {
      if (isLatestStatusUp) {
        this.logger.warn(
          `Agent ${agentId} is offline and latest status is UP. Sending notification.`,
        )

        await this.notificationService.sendAgentNotification(
          agent,
          agent.userId,
          true,
        )
      }

      await this.prisma.statusResults.create({
        data: {
          monitorId,
          responseTime: -1,
          metadata: { reason: 'Agent offline' },
        },
      })

      if (monitor?.status !== 'DOWN') {
        await this.prisma.monitors.update({
          where: { id: monitorId },
          data: { status: 'DOWN' },
        })
      }
    }

    const socketServer = this.agentsGateway.server
    if (!socketServer) {
      this.logger.error('Socket server not initialized')
      return
    }

    this.logger.log(`Emitting monitor command to agent ${agentId}`)
    socketServer.to(agentId).emit('run-command', data)
  }
}
