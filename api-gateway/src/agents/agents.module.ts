import { Module } from '@nestjs/common'
import { AgentsService } from './agents.service'
import { AgentsResolver } from './agents.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { AgentsGateway } from './agents.gateway'
import { MonitorGateway } from 'src/monitors/monitors.gateway'
import { NotificationService } from 'src/notification/notification.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [AuthModule, HttpModule],
  providers: [
    AgentsResolver,
    AgentsService,
    PrismaService,
    AgentsGateway,
    MonitorGateway,
    NotificationService,
  ],
  exports: [MonitorGateway],
})
export class AgentsModule {}
