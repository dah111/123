import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Supplier } from '../../suppliers/supplier.entity/supplier.entity';
import { ProductItems } from "../../product-items/product-item.entity/product-item.entity";

@Entity({ name: 'purchase_orders' })
export class PurchaseOrders {
  @PrimaryColumn({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => ProductItems, { eager: true })
  @JoinColumn({ name: 'item_id' })
  productItem: ProductItems;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  @Column()
  quantity: number;

  @Column({ name: 'delivery_date', type: 'date' })
  deliveryDate: Date;

  @Column({ name: 'is_delivered' })
  isDelivered: boolean;

  @Column({ name: 'payment_id' })
  paymentId: string;

  @Column({ name: 'is_paid' })
  isPaid: boolean;
}
