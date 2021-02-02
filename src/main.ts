import { NestFactory } from '@nestjs/core';
import { NextModule } from './server/nextjs/next.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './server/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
