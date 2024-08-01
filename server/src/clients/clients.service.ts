import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Clients } from "./clients.entity";

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Clients)
        private readonly clientsRepository: Repository<Clients>,
    ) {}

    async findOneByUsername(username: string): Promise<Clients | undefined> {
        return this.clientsRepository.findOne({ where: { username } });
    }

    async findByChatId(chatId: number) {
        return this.clientsRepository.findOne({ where: { chatId } });
    }

    async createUser(chatId: number, username: string) {
        const user = this.clientsRepository.create({ chatId, username });
        return await this.clientsRepository.save(user);
    }
}
