import { NestFactory } from '@nestjs/core';
import { NextModule } from './server/nextjs/next.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './server/app.module';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
  });

  const options = new DocumentBuilder()
    .setTitle('Participator')
    .setDescription('The participator API description')
    .setVersion('1.0')
    .addTag('participator')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app
    .get(NextModule)
    .prepare()
    .then(() => {
      app.listen(3000, 'localhost', () => {
        console.log('> Ready on http://localhost:3000 with Next.js!');
      });
    });
}

bootstrap();
