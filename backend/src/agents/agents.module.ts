import { Module } from '@nestjs/common'
import { AgentsService } from './agents.service'
import { AgentsResolver } from './agents.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'
import { NotificationService } from 'src/notification/notification.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [AuthModule, HttpModule],
  providers: [
    AgentsResolver,
    AgentsService,
    PrismaService,
    NotificationService,
  ],
})
export class AgentsModule {}
