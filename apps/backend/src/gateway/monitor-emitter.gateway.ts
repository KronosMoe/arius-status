import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { AgentsGateway } from 'src/gateway/agents.gateway'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class MonitorWebSocketEmitter {
  private logger = new Logger(MonitorWebSocketEmitter.name)

  constructor(
    private agentsGateway: AgentsGateway,
    private prisma: PrismaService,
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

    const [agent, monitor] = await Promise.all([
      this.prisma.agents.findUnique({ where: { id: agentId } }),
      this.prisma.monitors.findUnique({
        where: { id: monitorId },
        select: { status: true },
      }),
    ])

    if (!agent) {
      this.logger.warn(`Agent ${agentId} not found.`)
      return
    }

    if (!agent.isOnline) {
      this.logger.warn(`Agent ${agentId} is offline. Marking monitor as DOWN.`)

      // Save a DOWN status result
      await this.prisma.statusResults.create({
        data: {
          monitorId,
          responseTime: -1,
          metadata: { reason: 'Agent offline' },
        },
      })

      // Update monitor status if needed
      if (monitor?.status !== 'DOWN') {
        await this.prisma.monitors.update({
          where: { id: monitorId },
          data: { status: 'DOWN' },
        })
      }

      return // Stop here, no command is sent
    }

    // If agent is online, send the command
    const socketServer = this.agentsGateway.server
    if (!socketServer) {
      this.logger.error('Socket server not initialized')
      return
    }

    this.logger.log(`Emitting monitor command to agent ${agentId}`)
    socketServer.to(agentId).emit('run-command', data)
  }
}
