import { Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { UsersController } from './controllers/users/users.controller';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';

@Module({
  providers: [UsersService, OrdersService],
  controllers: [UsersController, OrdersController],
})
export class UsersModule {}
