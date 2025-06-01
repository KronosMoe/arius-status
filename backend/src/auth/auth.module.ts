import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'src/prisma/prisma.service'
import { GithubStrategy } from './strategies/github.strategy'
import { AuthController } from './auth.controller'

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [AuthResolver, AuthService, PrismaService, GithubStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
