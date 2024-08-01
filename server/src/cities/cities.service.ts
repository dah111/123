import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cities } from "./cities.entity";
import { Supplier } from "../suppliers/supplier.entity/supplier.entity";
import { ClientsService } from "../clients/clients.service";

@Injectable()
export class CitiesService {
    constructor(
        @InjectRepository(Cities)
        private readonly citiesRepository: Repository<Cities>,
        private readonly client: ClientsService,
    ) {}

    async findOneByName(name: string): Promise<Cities | undefined> {
        return this.citiesRepository.findOne({ where: { name } });
    }


    findAll(): Promise<Cities[]> {
        return this.citiesRepository.find();
    }

    async createCity(name: string) {
        const user = this.citiesRepository.create({ name });
        return await this.citiesRepository.save(user);
    }
}
