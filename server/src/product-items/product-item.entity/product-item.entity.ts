import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Supplier } from '../../suppliers/supplier.entity/supplier.entity';
import { Clients } from "../../clients/clients.entity";
import { Cities } from "../../cities/cities.entity";

@Entity({ name: 'products'})
export class ProductItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_code' })
  itemCode: string;

  @Column({ name: 'item_barcode', nullable: true  })
  itemBarcode: string;

  @Column({ name: 'item_name', nullable: true  })
  itemName: string;

  @Column({ name: 'item_weight', nullable: true  })
  itemWeight: number;

  @Column({ name: 'item_description', nullable: true  })
  itemDescription: string;

  @Column({ name: 'item_image', type: 'json', nullable: true  })
  itemImage: any;

  @Column({ name: 'brand_name', nullable: true  })
  brandName: string;

  @Column({ name: 'cost_per_unit', type: 'float', nullable: true  })
  costPerUnit: number;

  @Column({ name: 'price', type: 'float', nullable: true  })
  price: number;

  @Column({ name: 'stock_count', nullable: true  })
  stockCount: number;

  @Column({ name: 'status' })
  status: number;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Clients, { eager: true })
  @JoinColumn({ name: 'client_id', referencedColumnName: 'chatId' })
  client: Clients;

  @ManyToOne(() => Cities, { eager: true })
  @JoinColumn({ name: 'city'})
  city: Cities;

  @CreateDateColumn({ name: 'create_date' })
  createDate: Date;

  @UpdateDateColumn({ name: 'update_date' })
  updateDate: Date;

}
