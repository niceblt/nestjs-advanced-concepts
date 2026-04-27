import { Module } from '@nestjs/common';
import { DataSourceModule } from '../data-source/data-source.module.js';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DataSourceModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
