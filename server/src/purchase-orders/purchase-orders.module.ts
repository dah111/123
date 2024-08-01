import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase-orders.service';
import { PurchaseController } from "./purchase-orders.controller";
import { PurchaseOrders } from "./purchase-order.entity/purchase-order.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrders])],
  providers: [PurchaseService],
  controllers: [PurchaseController]
})
export class PurchaseOrdersModule {}
