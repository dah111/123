import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { AppService } from './app.service';
import axios from "axios";
import { CurrencyEntity } from "./core/entities/currency.entity";
import { ProductItems } from "./product-items/product-item.entity/product-item.entity";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('currency')
  async getCurrency(@Query() query: Partial<CurrencyEntity>): Promise<CurrencyEntity> {
    const currency = await this.appService.getCurrencyById(1);
    return await this.appService.updateCurrencyValueIfExpired(currency);
  }

  @Get('currency/cost')
  async getCurrencyCost(): Promise<CurrencyEntity> {
    return await this.appService.getCurrencyById(2);
  }

  @Post('currency/:id')
  async storeCurrencyCost(@Param('id') id: string, @Body() body: Partial<CurrencyEntity>): Promise<CurrencyEntity> {
    return await this.appService.updatedValue(id, body)
  }

}
