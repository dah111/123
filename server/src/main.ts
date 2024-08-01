import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from "./telegram/telegram.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  const telegramService = app.get(TelegramService);
  await telegramService.start();
}
bootstrap();

