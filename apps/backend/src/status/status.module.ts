import { Module } from '@nestjs/common'
import { StatusService } from './status.service'
import { StatusResolver } from './status.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [StatusResolver, StatusService, PrismaService],
})
export class StatusModule {}
