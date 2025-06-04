import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DEFAULT_PORT } from './constants/env'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  await app.listen(process.env.PORT ?? DEFAULT_PORT)
}
bootstrap()
