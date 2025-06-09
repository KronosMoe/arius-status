import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'src/prisma/prisma.service'
import { GithubStrategy } from './strategies/github.strategy'
import { SessionCleanupService } from './session-cleanup.service'

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    GithubStrategy,
    SessionCleanupService,
  ],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
