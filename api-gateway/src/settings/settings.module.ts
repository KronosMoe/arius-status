import { Module } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { SettingsResolver } from './settings.resolver'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [SettingsResolver, SettingsService, PrismaService],
})
export class SettingsModule {}
