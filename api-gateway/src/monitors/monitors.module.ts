import { Module } from '@nestjs/common'
import { MonitorsService } from './monitors.service'
import { MonitorsResolver } from './monitors.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { AgentsModule } from 'src/agents/agents.module'

@Module({
  imports: [AuthModule, AgentsModule],
  providers: [MonitorsResolver, MonitorsService, PrismaService],
})
export class MonitorsModule {}
