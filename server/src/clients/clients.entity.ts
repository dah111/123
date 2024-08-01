import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'clients' })
export class Clients {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    username: string;

    @Column({ unique: true })
    chatId: number;

}
