import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from "typeorm";
import { ProductItems } from "./product-item.entity/product-item.entity";
import { TelegramService } from "../telegram/telegram.service";
import { Cities } from "../cities/cities.entity";
import { CitiesService } from "../cities/cities.service";
import axios from "axios";

@Injectable()
export class ProductItemsService {
  private readonly apiKey = 'd76352fc1bba4b57b74cf1c70600f3e9';

  constructor(
    @InjectRepository(ProductItems)
    private readonly productRepository: Repository<ProductItems>,
    // @Inject(CitiesService) private readonly itemsService: CitiesService,
    @Inject(TelegramService)
    private readonly telegraf: TelegramService,
  ) {}

  async findAll(): Promise<ProductItems[]> {
    return this.productRepository.find({
      order: {
        id: 'DESC', // Order by id in descending order
      },
    });
  }

  async findOne(id: number): Promise<ProductItems | undefined> {
    return this.productRepository.findOne({ where: {id} });
  }

  async findByOrderCode(itemCode: string): Promise<ProductItems | undefined> {
    return this.productRepository.findOne({ where: { itemCode } });
  }

  // async findByClientId(clientId: any): Promise<ProductItems[]> {
  //   return this.productRepository.find({ where: { client: clientId } });
  // }

  async findByChatId(clientId: any): Promise<ProductItems[]> {
    return this.productRepository.find({ where: { client: { chatId: clientId } } });
  }

  async create(productData: Partial<ProductItems>): Promise<ProductItems> {
    const productItem = this.productRepository.create(productData);
    return this.productRepository.save(productData);
  }

  async createByOrderId(itemCode: string): Promise<void> {
    const productItem = this.productRepository.create({ itemCode });
    await this.productRepository.save(productItem);
  }

  async update(id: number, productData: Partial<ProductItems>): Promise<ProductItems | undefined> {
    // await this.productRepository.update(id, productData);
    // return this.productRepository.findOne({ where: {id} });

    const productToUpdate = await this.productRepository.findOne({ where: {id} });
    if (!productToUpdate) {
      throw new Error(`Product with ID ${id} not found.`);
    }
    const updatedProduct = this.productRepository.merge(productToUpdate, productData);
    return this.productRepository.save(updatedProduct);

  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async updateStatusByItemCode(itemCode: string, status: number): Promise<ProductItems | undefined> {
    try {
      const productItem = await this.productRepository.findOne({ where: { itemCode } });
      if (!productItem) {
        return undefined; // Or return an appropriate error message
      }

      console.log('status', status);
      console.log('as', productItem.status);

      // Check if the status transition is valid
      if (status - 1 != productItem.status) {
        let errorMessage: string;
        if (status === 3) {
          errorMessage = 'Сперав сделайте приемку';
        } else if (status === 2) {
          errorMessage = 'Сперав примите заказ';
        } else {
          errorMessage = 'Ошибка на стороне сервера';
        }
        throw new Error(errorMessage);
      }

      // Update the status if it is greater than the current status
      if (status > productItem.status) {
        productItem.status = status;
        await this.productRepository.save(productItem);
        await this.telegraf.sendNotification(productItem);
      }

      return productItem;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByStatus(status: number): Promise<ProductItems[]> {
    return this.productRepository.find({ where: { status } });
  }

  async filterProducts(criteria: Partial<ProductItems>, cityId?: number): Promise<ProductItems[]> {
    // let qb = this.productRepository.createQueryBuilder('product');
    //
    // // Apply query filters
    // Object.keys(criteria).forEach(key => {
    //   if (criteria[key]) {
    //     qb = qb.andWhere(`product.${key} = :${key}`, { [key]: criteria[key] });
    //   }
    // });
    // console.log(qb.innerJoin('product.city', 'city2'))
    // if (cityId) {
    //   criteria = {
    //     ...criteria,
    //     city: {
    //       id: cityId
    //     }
    //   }
    // }
    console.log(criteria)
    //
    // return qb.getMany();
    return this.productRepository.find({ where: criteria });
  }

  // async getCurrency(): Promise<any> {
  //   try {
  //     const response = await axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${this.apiKey}&symbols=KZT,INR&base=USD`);
  //     console.log('res', response);
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch exchange rates: ${error.message}`);
  //   }
  // }

  async getOrdersOneMonthAgo(): Promise<ProductItems[]> {
    const query = `
      SELECT *
      FROM products
      WHERE createDate <= DATE_SUB(NOW(), INTERVAL 1 MONTH)
    `;

    return this.productRepository.query(query);
  }

}
