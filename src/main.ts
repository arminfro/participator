import { NestFactory } from '@nestjs/core';
import { NextModule } from './server/nextjs/next.module';
import { AppModule } from './server/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
