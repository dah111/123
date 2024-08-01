import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cities } from "./cities.entity";
import { ClientsModule } from "../clients/clients.module";
import { CityController } from "./city.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Cities]), ClientsModule],
    providers: [CitiesService],
    controllers: [CityController],
    exports: [CitiesService],
})
export class CitiesModule { }
