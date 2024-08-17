import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Enviroment } from '@Infrastructure/nestjs/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    rawBody: true,
  });

  const env = new Enviroment();
  const port = env.port;

  function getSwaggerServerUrl() {
    switch (process.env.NODE_ENV) {
      case 'production':
        return 'null';
      default:
        return `http://localhost:${port}`;
    }
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('0.1')
    .addServer(getSwaggerServerUrl())
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
