import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import test_with_handlers_as_options from './mailserver';
require('dotenv').config();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // const port = process.env.PORT || 4000;
  // console.log('port', port);
  // app.useGlobalPipes(new ValidationPipe());
  // await app.listen(port);
  test_with_handlers_as_options();
}
bootstrap();
