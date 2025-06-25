import { Module } from '@nestjs/common'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'monitor.exchange',
          type: 'topic',
        },
      ],
      uri: process.env.AMQP_URL || 'amqp://localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQSharedModule {}
