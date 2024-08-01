import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductItemsModule } from './product-items/product-items.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import * as path from 'path';
import { SupplierModule } from "./suppliers/supplier.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { RedisModule } from "./redis/redis.module";
import { TelegramModule } from './telegram/telegram.module';
import { CitiesModule } from "./cities/cities.module";
import { TelegramService } from "./telegram/telegram.service";
import { MyWebSocketGateway } from "./core/websocket.gateway";
import { CurrencyEntity } from "./core/entities/currency.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 3005,
      username: "postgres",
      password: "123456",
      database: "inventory_control_managment",
      entities: [path.join(__dirname, "**/*.entity{.ts,.js}")],
      synchronize: true
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    SupplierModule,
    ProductItemsModule,
    PurchaseOrdersModule,
    RolesModule,
    TelegramModule,
    CitiesModule,
    TypeOrmModule.forFeature([CurrencyEntity])
  ],
  controllers: [AppController],
  providers: [AppService, MyWebSocketGateway],
})
export class AppModule {}
