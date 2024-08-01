import { forwardRef, Module } from "@nestjs/common";
import { ProductItemsService } from './product-items.service';
import { ProductController } from "./product-items.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductItems } from "./product-item.entity/product-item.entity";
import { TelegramModule } from "../telegram/telegram.module";
import { TelegramService } from "../telegram/telegram.service";
import { CitiesModule } from "../cities/cities.module";
import { ClientsModule } from "../clients/clients.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductItems]),
    forwardRef(() => TelegramModule),
    // CitiesModule,
  ],
  providers: [ProductItemsService],
  controllers: [ProductController],
  exports: [ProductItemsService],
})
export class ProductItemsModule {}
