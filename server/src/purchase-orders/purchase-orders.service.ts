import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrders } from "./purchase-order.entity/purchase-order.entity";

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseOrders)
    private readonly purchaseRepository: Repository<PurchaseOrders>,
  ) {}

  async findAll(): Promise<PurchaseOrders[]> {
    return this.purchaseRepository.find();
  }

  async create(purchaseData: Partial<PurchaseOrders>): Promise<PurchaseOrders> {
    return this.purchaseRepository.save(purchaseData);
  }
}
