import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisClientFactory } from "./redis.client.factory";
import { RedisRepository } from "./redis.repository";

@Module({
  providers: [redisClientFactory, RedisRepository, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
