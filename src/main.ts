import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { MONGO_URI, PORT } from './app.constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.listen( PORT , () => {
    console.log("Application is running at port 3000")
    console.log( MONGO_URI )

  });
}

bootstrap();