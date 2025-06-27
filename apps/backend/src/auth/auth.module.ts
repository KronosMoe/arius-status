import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'src/prisma/prisma.service'
import { NotificationModule } from 'src/notification/notification.module'

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    NotificationModule,
  ],
  providers: [AuthResolver, AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
