import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DEFAULT_PORT } from './constants/env'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { startTracing } from './libs/tracer'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.use(cookieParser())
  app.enableCors({
    origin: [process.env.URL ?? 'http://localhost:3000'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
      'Content-Type',
      'Baggage',
    ],
    credentials: true,
  })

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  await startTracing()
  await app.listen(process.env.PORT ?? DEFAULT_PORT)
}
bootstrap()
