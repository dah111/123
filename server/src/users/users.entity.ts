import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Roles } from "../roles/roles.entity/roles.entity";

@Entity({ name: 'users' })
export class Users {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @ManyToMany(() => Roles, role => role.users)
    @JoinTable()
    roles: Roles[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
