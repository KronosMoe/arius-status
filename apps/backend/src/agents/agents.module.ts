import { Module } from '@nestjs/common'
import { AgentsService } from './agents.service'
import { AgentsResolver } from './agents.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [AuthModule, HttpModule],
  providers: [AgentsResolver, AgentsService, PrismaService],
})
export class AgentsModule {}
