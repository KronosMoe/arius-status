import { Resolver } from '@nestjs/graphql'
import { SettingsService } from './settings.service'

@Resolver()
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}
}
