import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http.exceptions';
import { configCors } from './infrastructure/configurations/cors.configurations';
import morganMiddleware from './infrastructure/configurations/loggingConfiguration/morgan.logs';
import { server_envs } from './infrastructure/envs/server.envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configCors(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ====== Base API Path ======= //
  app.setGlobalPrefix(server_envs.base_path);

  // ====== Logs - console ======= //
  app.use(morganMiddleware);

  // ====== Global exception catch ======= //
  app.useGlobalFilters(new HttpExceptionFilter());

  // ====== Documentation ======= //

  // ====== PORT ======= //
  await app.listen(server_envs.port_server);
}
bootstrap();
