import { Module } from '@nestjs/common'
import { PingService } from './ping.service'
import { PingGateway } from './ping.gateway'
import { PrismaService } from 'src/prisma/prisma.service'
import { PingCronService } from './ping.cron'

@Module({
  providers: [PingGateway, PingService, PrismaService, PingCronService],
})
export class PingModule {}
