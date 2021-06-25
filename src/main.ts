import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { MONGO_URI, PORT } from './app.constants'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import * as mongoose from 'mongoose';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const configSwagger = new DocumentBuilder()
    .setTitle('Heyoo API')
    .setDescription('The Heyoo API description')
    .setVersion('1.0')
    .addTag('heyoo')
    .addBearerAuth()
    .build();

  config.update({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_REGION'),
  });

  app.enableCors();
  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('api', app, documentSwagger);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.listen( PORT , () => {
    console.log("Application is running at port:" + PORT );
    // mongoose.set('debug', true);
  });
}

bootstrap();