import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { NotificationController } from './notification.controller'

@Module({
  imports: [HttpModule],
  providers: [NotificationService, PrismaService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
