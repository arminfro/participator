import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { NextMiddleware } from './nextjs/next.middleware';
import { NextModule } from './nextjs/next.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [NextModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // handle scripts
    consumer.apply(NextMiddleware).forRoutes({
      path: '_next*',
      method: RequestMethod.GET,
    });

    // handle other assets
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
