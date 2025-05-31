import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { AgentsGateway } from 'src/gateway/agents.gateway'

@Injectable()
export class MonitorWebSocketEmitter {
  private logger = new Logger(MonitorWebSocketEmitter.name)

  constructor(private agentsGateway: AgentsGateway) {}

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

    const socketServer = this.agentsGateway.server
    if (!socketServer) {
      this.logger.error('Socket server not ready')
      return
    }

    this.logger.log(`Emitting monitor ${monitorId} to agent ${agentId}`)
    socketServer.to(agentId).emit('run-command', data)
  }
}
