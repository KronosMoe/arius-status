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

    const agent = await this.prisma.agents.findUnique({
      where: { id: agentId },
    })

    if (!agent || !agent.isOnline) {
      this.logger.log(`Agent ${agentId} is offline. Logging service as down.`)

      await this.prisma.statusResults.create({
        data: {
          monitorId,
          responseTime: -1,
          metadata: { reason: 'Agent offline' },
        },
      })

      await this.prisma.monitors.update({
        where: { id: monitorId },
        data: { status: 'DOWN' },
      })

      return
    }

    const socketServer = this.agentsGateway.server
    if (!socketServer) {
      this.logger.error('Socket server not ready')
      return
    }

    this.logger.log(`Emitting monitor ${monitorId} to agent ${agentId}`)
    socketServer.to(agentId).emit('run-command', data)
  }
}
