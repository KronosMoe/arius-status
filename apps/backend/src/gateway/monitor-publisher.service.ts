import { Injectable, Logger } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

@Injectable()
export class MonitorPublisherService {
  private logger = new Logger(MonitorPublisherService.name)

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishMonitorCommand(payload: {
    monitorId: string
    agentId: string
    data: any
  }) {
    this.logger.debug(
      `Publishing monitor command to agent ${payload.agentId}, monitor ${payload.monitorId}`,
    )

    await this.amqpConnection.publish(
      'monitor.exchange',
      'monitor.route',
      payload,
    )
  }
}
