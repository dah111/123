import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from './clients.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Clients])],
    providers: [ClientsService],
    exports: [ClientsService],
})
export class ClientsModule { }
