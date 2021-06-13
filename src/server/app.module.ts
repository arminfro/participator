import { DriverType, StorageModule } from '@codebrew/nestjs-storage';
import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { ChatsModule } from './chats/chats.module';
import { HttpExceptionsFilter } from './http-exceptions-filter';
import { LoginModule } from './login/login.module';
import { NextMiddleware } from './nextjs/next.middleware';
import { NextModule } from './nextjs/next.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { WsExceptionsFilter } from './ws-exceptions-filter';

@Module({
  imports: [
    AuthModule,
    CaslModule,
    NextModule,
    UsersModule,
    LoginModule,
    ChatsModule,
    RoomsModule,
    TypeOrmModule.forRoot(),
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(NextMiddleware).forRoutes({
      path: '__next*',
      method: RequestMethod.GET,
    });

    consumer.apply(NextMiddleware).forRoutes({
      path: '_next*',
      method: RequestMethod.GET,
    });

    consumer.apply(NextMiddleware).forRoutes({
      path: 'images/*',
      method: RequestMethod.GET,
    });

    consumer.apply(NextMiddleware).forRoutes({
      path: 'favicon.ico',
      method: RequestMethod.GET,
    });
  }
}
