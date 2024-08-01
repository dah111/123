import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../../users/users.entity";

@Entity({ name: 'Roles'})
export class Roles  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Users, user => user.roles)
  @JoinTable()
  users: Users[];
}
