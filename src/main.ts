/* eslint-disable @typescript-eslint/no-var-requires */
import dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { NextModule } from './server/nextjs/next.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

// needed for parallel link parsing in LinksService#getPreview
require('events').EventEmitter.prototype._maxListeners = 128;
require('events').defaultMaxListeners = 128;

import { AppModule } from './server/app.module';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { domain, port, url } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.colorize(),
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

  app.use(
    helmet({
      // see https://github.com/vercel/next.js/issues/256
      contentSecurityPolicy: false,
    }),
  );
  app
    .get(NextModule)
    .prepare()
    .then(() => {
      app.listen(port, domain, () => {
        console.log(`> Ready on http://${url} with Next.js!`);
      });
    });
}

dotenv.config();
bootstrap();
