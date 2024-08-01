import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  NotFoundException,
  Res,
  HttpStatus, Query, HttpException
} from "@nestjs/common";
import { ProductItems } from "./product-item.entity/product-item.entity";
import { ProductItemsService } from "./product-items.service";
import { Response } from 'express';
import axios from 'axios';


@Controller('/api/products')
export class ProductController {

  private readonly apiKey = 'd76352fc1bba4b57b74cf1c70600f3e9';


  constructor(private readonly productService: ProductItemsService) {}

  @Get()
  async findAll(): Promise<ProductItems[]> {
    return this.productService.findAll();
  }

  @Get('one-month-ago')
  async getOrdersOneMonthAgo(): Promise<ProductItems[]> {
    return this.productService.getOrdersOneMonthAgo();
  }

  @Get('filter')
  async filterProducts(@Query() query: Partial<ProductItems>, @Query('cityId') cityId?: number): Promise<ProductItems[]> {
    try {
      const response = await axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${this.apiKey}&symbols=KZT,INR&base=USD`);
      console.log('Response', response.data); // Log the response data for debugging
      return response.data; // Return the response data to the client
    } catch (error) {
      console.error('Error', error.response?.data || error.message); // Log the error message or response data for debugging
      throw new HttpException('Failed to fetch currency data', HttpStatus.INTERNAL_SERVER_ERROR); // Throw a 500 Internal Server Error if an error occurs
    }
    return this.productService.filterProducts(query, cityId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductItems | undefined> {
    return this.productService.findOne(parseInt(id, 10));
  }

  @Post()
  create(@Body() productData: Partial<ProductItems>): Promise<ProductItems> {
    return this.productService.create(productData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() productData: Partial<ProductItems>): Promise<ProductItems | undefined> {
    return this.productService.update(parseInt(id, 10), productData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(parseInt(id, 10));
  }

  @Get('status/:status')
  findAllByStatus(@Param('status') status: number): Promise<ProductItems[]> {
    return this.productService.findByStatus(status);
  }

  @Patch('status/:itemCode')
  async updateStatusByItemCode(@Param('itemCode') itemCode: string, @Body() statusData: { status: number }, @Res() res: Response): Promise<void> {
    try {
      const products = await this.productService.updateStatusByItemCode(itemCode, statusData.status);
      res.status(HttpStatus.OK).json(products);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

}
