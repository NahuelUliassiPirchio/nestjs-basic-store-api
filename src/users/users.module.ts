import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';

@Module({
  providers: [UsersService, OrdersService],
  controllers: [UsersController, OrdersController],
  imports: [TypeOrmModule.forFeature([User, Order])],
})
export class UsersModule {}
