

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let port =  process.env.PORT || 4000
  console.log("port",port)
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
