import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './cores/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './cores/filters/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Enable CORS cho tất cả các origin
  app.enableCors({ origin: '*' });

  // Đặt global prefix cho tất cả các route
  app.setGlobalPrefix('api/v1');

  // Cấu hình Swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Ecom API')
    .setDescription('The Ecom API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api/v1', app, swaggerDocument);



  // Global interceptors và filters
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Khởi chạy ứng dụng
  await app.listen(5001, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
