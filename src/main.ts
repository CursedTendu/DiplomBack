import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.ADMIN_USER]: process.env.ADMIN_PASSWORD,
      },
    }),
  );

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
