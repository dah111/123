import { forwardRef, Module } from "@nestjs/common";
import { TelegramService } from './telegram.service';
import { TelegramController } from "./telegram.controller";
import { ProductItemsModule } from "../product-items/product-items.module";
import { ClientsModule } from "../clients/clients.module";
import { CitiesModule } from "../cities/cities.module";
import { CitiesService } from "../cities/cities.service";
import { ClientsService } from "../clients/clients.service";
import { MyWebSocketGateway } from "../core/websocket.gateway";

@Module({
  imports: [forwardRef(() => ProductItemsModule), ClientsModule, CitiesModule],
  providers: [TelegramService, MyWebSocketGateway],
  exports: [TelegramService],
  controllers: [TelegramController]
})
export class TelegramModule {}
