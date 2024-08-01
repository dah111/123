import { Controller, Get, Post, Body, Param, Put, Delete, Patch, NotFoundException } from "@nestjs/common";
import { CitiesService } from "./cities.service";
import { Cities } from "./cities.entity";

@Controller('/api/cities')
export class CityController {
  constructor(private readonly cityService: CitiesService) {}

  @Get()
  findAll(): Promise<Cities[]> {
    return this.cityService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<ProductItems | undefined> {
  //   return this.cityService.findOne(parseInt(id, 10));
  // }
}
