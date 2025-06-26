import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { UsersModule } from './users/users.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { AuthModule } from './auth/auth.module'
import { AgentsModule } from './agents/agents.module'
import { MonitorsModule } from './monitors/monitors.module'
import { StatusModule } from './status/status.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { NotificationModule } from './notification/notification.module'
import { HttpModule } from '@nestjs/axios'
import { SettingsModule } from './settings/settings.module'
import { GatewayModule } from './gateway/gateway.module'
import { StatusPageModule } from './status-page/status-page.module'
import { AppController } from './app.controller'
import { AuthController } from './auth/auth.controller'

@Module({
  imports: [
    HttpModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/gql/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
    }),
    UsersModule,
    AuthModule,
    MonitorsModule,
    AgentsModule,
    StatusModule,
    NotificationModule,
    SettingsModule,
    GatewayModule,
    StatusPageModule,
  ],
  controllers: [AuthController, AppController],
  providers: [],
})
export class AppModule {}
