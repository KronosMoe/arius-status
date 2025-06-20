import { Module } from '@nestjs/common'
import { MonitorsService } from './monitors.service'
import { MonitorsResolver } from './monitors.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { RabbitMQSharedModule } from 'src/gateway/rabbitmq.module'
import { GatewayModule } from 'src/gateway/gateway.module'
import { MonitorPublisherService } from 'src/gateway/monitor-publisher.service'

@Module({
  imports: [AuthModule, RabbitMQSharedModule, GatewayModule],
  providers: [
    MonitorsResolver,
    MonitorsService,
    PrismaService,
    MonitorPublisherService,
  ],
})
export class MonitorsModule {}
