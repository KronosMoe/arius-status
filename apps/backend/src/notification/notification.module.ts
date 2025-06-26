// notification.module.ts
import { forwardRef, Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { NotificationResolver } from './notification.resolver'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFY_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('AMQP_URL')],
            queue: 'notify_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  providers: [NotificationService, PrismaService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
