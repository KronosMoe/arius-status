import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DEFAULT_PORT } from './constants/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT ?? DEFAULT_PORT)
}
bootstrap()
