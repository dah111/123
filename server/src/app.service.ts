import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CurrencyEntity } from "./core/entities/currency.entity";
import { ProductItems } from "./product-items/product-item.entity/product-item.entity";

@Injectable()
export class AppService {
  private readonly apiKey = 'd76352fc1bba4b57b74cf1c70600f3e9';

  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
  ) {
  }

  getHello(): string {
    return 'Hello World22323!';
  }

  async getCurrencyById(id: number): Promise<CurrencyEntity> {
    return this.currencyRepository.findOne({ where: { id: id } });
  }

  async updateCurrencyValueIfExpired(currency: CurrencyEntity): Promise<CurrencyEntity> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (currency.updateDate < oneDayAgo) {
      currency.value = await this.fetchUpdatedValue('KZT');
      await this.currencyRepository.save(currency);
    }
    return currency;
  }

  async fetchUpdatedValue(currencyName: string = 'KZT'): Promise<string> {
    const response = await axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${this.apiKey}&symbols=${currencyName}&base=USD`);
    console.log('fetchedDate', response.data)
    return response.data.rates[currencyName];
  }

  async updatedValue(id, data: Partial<CurrencyEntity>): Promise<CurrencyEntity> {
    const currency = await this.currencyRepository.findOne({ where: { id: id } });
    const updatedProduct = this.currencyRepository.merge(currency, data);
    console.log('up', updatedProduct);
    return await this.currencyRepository.save(updatedProduct);
  }

}
