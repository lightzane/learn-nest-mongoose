import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('./public');

  const config = new DocumentBuilder()
    .setTitle('Learn Nest Mongoose')
    .setDescription(
      'Mock tool: <a href="https://www.mockaroo.com" target="_blank">https://www.mockaroo.com</a>',
    )
    .setVersion('0.1.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Learn Nest Mongoose',
    swaggerOptions: {
      requestInterceptor: (request: Request) => {
        const appJson = 'application/json';
        request.headers.accept = appJson;
        request.headers['Content-Type'] = appJson;
        return request;
      },
    },
  });

  await app.listen(3000);
}
bootstrap();
