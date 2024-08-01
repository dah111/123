import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from "./roles.entity/roles.entity";
import { Users } from "../users/users.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private roleRepository: Repository<Roles>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async assignRoleToUser(userId: string, roleId: number): Promise<void> {
    const user = await this.userRepository.findOne(
      {
        where: { id: userId },
        relations: ['roles']
      }
    );
    const role = await this.roleRepository.findOne({where: { id: roleId }});

    if (!user || !role) {
      throw new Error('User or Role not found');
    }

    user.roles.push(role);
    await this.userRepository.save(user);
  }

  async removeRoleFromUser(userId: string, roleId: number): Promise<void> {
    const user = await this.userRepository.findOne(
      {
        where: { id: userId },
        relations: ['roles']
      }
    );

    if (!user) {
      throw new Error('User not found');
    }

    user.roles = user.roles.filter(role => role.id !== roleId);
    await this.userRepository.save(user);
  }

  async createRole(roleData: Roles): Promise<Roles> {
    const role = this.roleRepository.create(roleData);
    return await this.roleRepository.save(role);
  }

  async findAllRoles(): Promise<Roles[]> {
    return await this.roleRepository.find();
  }

  async findRoleById(id: number): Promise<Roles> {
    return await this.roleRepository.findOne({ where: {id} });
  }

  async updateRole(id: number, roleData: Roles): Promise<Roles> {
    const role = await this.findRoleById(id);
    role.name = roleData.name;
    role.description = roleData.description;
    return await this.roleRepository.save(role);
  }

  async deleteRole(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }


}
