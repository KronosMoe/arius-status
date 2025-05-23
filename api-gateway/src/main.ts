import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DEFAULT_PORT } from './constants/env'
import * as cookieParser from 'cookie-parser'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })

  await app.listen(process.env.PORT ?? DEFAULT_PORT)
}
bootstrap()
