import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'supplier' })
export class Supplier {
  @PrimaryColumn({ name: 'supplier_id' })
  supplierId: string;

  @Column({ name: 'supplier_name' })
  supplierName: string;

  @Column()
  address: string;

  @Column({ name: 'registered_on', type: 'date' })
  registeredOn: Date;
}
