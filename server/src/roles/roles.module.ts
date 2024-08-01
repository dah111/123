import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesService } from "./roles.service";
import { Roles } from "./roles.entity/roles.entity";
import { Users } from "../users/users.entity";
import { RolesController } from "./roles.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Roles, Users])],
  providers: [RolesService],
  controllers: [RolesController]
})
export class RolesModule {}
