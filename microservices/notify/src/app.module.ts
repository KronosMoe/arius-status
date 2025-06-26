import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { NotificationModule } from './notification/notification.module'
import { ConfigModule } from '@nestjs/config'
import { EmailModule } from './email/email.module'

@Module({
  imports: [
    NotificationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
