import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { NotificationModule } from './notification/notification.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [NotificationModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
