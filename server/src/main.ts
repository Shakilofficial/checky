import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('config.port') || 5000;

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors({
    origin: configService.get<string>('config.frontendUrl'),
    credentials: true,
  });

  await app.listen(port);

  logger.log(`================================================`);
  logger.log(`🚀 TASK SERVER IS RUNNING ON PORT: [${port}]`);
  logger.log(`🏠 API PREFIX: [api/v1]`);
  logger.log(`✅ ENVIRONMENT: [SUCCESSFULLY INITIALIZED]`);
  logger.log(`================================================`);
}
void bootstrap();
