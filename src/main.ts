import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// a
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.getHttpAdapter().getInstance().disable('etag');
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
    app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
