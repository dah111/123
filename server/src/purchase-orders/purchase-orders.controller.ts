import { Controller, Get, Post, Body } from '@nestjs/common';
import { PurchaseService } from "./purchase-orders.service";
import { PurchaseOrders } from "./purchase-order.entity/purchase-order.entity";

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  findAll(): Promise<PurchaseOrders[]> {
    return this.purchaseService.findAll();
  }

  @Post()
  create(@Body() purchaseData: Partial<PurchaseOrders>): Promise<PurchaseOrders> {
    return this.purchaseService.create(purchaseData);
  }
}
