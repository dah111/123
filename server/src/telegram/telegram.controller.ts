import { Controller, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  // @Get('send-message')
  // async sendMessage(): Promise<string> {
  //   await this.telegramService.sendMessage('chatId', 'Hello from NestJS!');
  //   return 'Message sent';
  // }
}
