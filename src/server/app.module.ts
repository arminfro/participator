import { DriverType, StorageModule } from '@codebrew/nestjs-storage';
import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { ChatsModule } from './chats/chats.module';
import { HttpExceptionsFilter } from './http-exceptions-filter';
import { LinksModule } from './links/links.module';
import { LoginModule } from './login/login.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { WsExceptionsFilter } from './ws-exceptions-filter';

import ormconfig from '../../ormconfig.json';
import { domain, port } from '../constants';

@Module({
  imports: [
    AuthModule,
    CaslModule,
    UsersModule,
    LoginModule,
    ChatsModule,
    RoomsModule,
    LinksModule,
    TypeOrmModule.forRoot({ ...ormconfig, type: 'sqlite' }),
    StorageModule.forRoot({
      default: 'local',
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: process.cwd(),
          },
        },
      },
    }),
    RenderModule.forRootAsync(
      Next({
        dev: process.env.NODE_ENV !== 'production',
        // dir: resolve(__dirname, '../../..'),
        hostname: domain,
        port: Number(port),
      }),
      { passthrough404: false, viewsDir: null },
    ),
    //   Next({ dev: process.env.NODE_ENV !== 'production' }),
    //   { viewsDir: null, dev: process.env.NODE_ENV !== 'production' },
    // ),
  ],
  controllers: [AppController],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: WsExceptionsFilter,
    },
  ],
})
export class AppModule {}
