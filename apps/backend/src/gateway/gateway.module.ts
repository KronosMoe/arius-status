import { Module } from '@nestjs/common'
import { AgentsGateway } from './agents.gateway'
import { MonitorGateway } from './monitors.gateway'
import { MonitorWebSocketEmitter } from './monitor-emitter.gateway'
import { PrismaService } from 'src/prisma/prisma.service'
import { HttpModule } from '@nestjs/axios'
import { RabbitMQSharedModule } from './rabbitmq.module'
import { NotificationModule } from 'src/notification/notification.module'
import { MonitorPublisherService } from './monitor-publisher.service'

@Module({
  imports: [RabbitMQSharedModule, HttpModule, NotificationModule],
  providers: [
    AgentsGateway,
    MonitorGateway,
    MonitorWebSocketEmitter,
    PrismaService,
    MonitorPublisherService,
  ],
  exports: [MonitorGateway, MonitorPublisherService],
})
export class GatewayModule {}
