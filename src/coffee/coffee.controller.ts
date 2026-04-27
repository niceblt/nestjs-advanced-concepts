import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  RequestTimeoutException,
  UseInterceptors,
} from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';
import { CircuitBreakerInterceptor } from '../common/interceptors/circuit-breaker.interceptor.js';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@UseInterceptors(CircuitBreakerInterceptor)
@Controller('coffee')
export class CoffeeController {
  constructor(
    private readonly coffeeService: CoffeeService,
    private readonly lazyModuleLoader: LazyModuleLoader,
  ) {}

  @Post()
  async create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.time();
    const rewardsModuleRef = await this.lazyModuleLoader.load(() =>
      import('../rewards/rewards.module.js').then((m) => m.RewardsModule),
    );

    const { RewardsService } = await import('../rewards/rewards.service.js');
    const rewardsService = rewardsModuleRef.get(RewardsService);
    console.timeEnd();
    rewardsService.grantTo();
    return this.coffeeService.create(createCoffeeDto);
  }

  @Get()
  findAll() {
    console.log('finall');
    throw new RequestTimeoutException('error');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeeService.findOne(+id);
  }

  @Patch(':id')
  update(
    // @Param('id', EntityExistsPipe(Coffee)) id: string, // 👈 example of using the new Pipe (comment out next line)
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeeService.update(+id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeeService.remove(+id);
  }
}
