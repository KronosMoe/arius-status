import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { AuthModule } from 'src/auth/auth.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { NotificationResolver } from './notification.resolver'

@Module({
  imports: [HttpModule, AuthModule],
  providers: [NotificationService, PrismaService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
