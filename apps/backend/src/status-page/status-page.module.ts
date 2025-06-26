import { Module } from '@nestjs/common'
import { StatusPageService } from './status-page.service'
import { StatusPageResolver } from './status-page.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [StatusPageResolver, StatusPageService, PrismaService],
})
export class StatusPageModule {}
