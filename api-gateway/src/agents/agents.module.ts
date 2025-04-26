import { Module } from '@nestjs/common'
import { AgentsService } from './agents.service'
import { AgentsResolver } from './agents.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { AgentsGateway } from './agents.gateway'
import { MonitorGateway } from 'src/monitors/monitors.gateway'

@Module({
  imports: [AuthModule],
  providers: [
    AgentsResolver,
    AgentsService,
    PrismaService,
    AgentsGateway,
    MonitorGateway,
  ],
  exports: [MonitorGateway],
})
export class AgentsModule {}
