import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from "./roles.entity/roles.entity";

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  async createRole(@Body() roleData: Roles): Promise<Roles> {
    return await this.rolesService.createRole(roleData);
  }

  @Get()
  async getAllRoles(): Promise<Roles[]> {
    return await this.rolesService.findAllRoles();
  }

  @Get(':id')
  async getRoleById(@Param('id') id: string): Promise<Roles> {
    return await this.rolesService.findRoleById(+id);
  }

  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() roleData: Roles,
  ): Promise<Roles> {
    return await this.rolesService.updateRole(+id, roleData);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<void> {
    await this.rolesService.deleteRole(+id);
  }
}
