import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { GatewayModule } from './gateway.module';

const logger = new Logger('Gateway');

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  /* Swagger */
  const config = new DocumentBuilder()
    .setTitle('API docs')
    .addBearerAuth()
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
  });

  /* Start Server */
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  await app.listen(PORT, () =>
    logger.log(`Gateway server is listening on port ${PORT}...`),
  );
}
bootstrap();
