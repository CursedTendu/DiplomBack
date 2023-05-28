import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.ADMIN_USER]: process.env.ADMIN_PASSWORD,
      },
    }),
  );

  app.disable('x-powered-by', 'X-Powered-By');

  const config = new DocumentBuilder()
    .setTitle('API системы учета студентов для преподавателей')
    .setDescription('API системы учета студентов для преподавателей')
    .addTag(
      'Аутентификация',
      'Модуль для аутентификации и обновления токена доступа к API',
    )
    .addTag('Посещения', 'Модуль для взаимодействия с посещениями студентов')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
