import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'cities' })
export class Cities {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

}
